// ==UserScript==
// @name         FTXのWebアプリMod
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  FTXのWebアプリの独自のトレード機能を追加したりします。
// @author       touta44g
// @match        https://ftx.com/trade/*
// @grant        none
// @license      LGPLv3
// @run-at document-start
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.15/lodash.min.js
// @require      https://unpkg.com/react@17/umd/react.production.min.js
// @require      https://unpkg.com/react-dom@17/umd/react-dom.production.min.js
// @require      https://cdn.jsdelivr.net/npm/big-js@3.1.3/big.min.js
// @downloadURL https://update.greasyfork.org/scripts/423415/FTX%E3%81%AEWeb%E3%82%A2%E3%83%97%E3%83%AAMod.user.js
// @updateURL https://update.greasyfork.org/scripts/423415/FTX%E3%81%AEWeb%E3%82%A2%E3%83%97%E3%83%AAMod.meta.js
// ==/UserScript==


let isGiriMaker = false;
let isCenterMaker = false;
let currentMarket = null;
let markets = null;

let isScatterMaker = false;
let gPositionBetween = null;
let gPositionCount = null;

let gPositionAmount = null;
let isPositionCount = false;
let isPositionAmount = false;


// 任意の単位値で値を丸める関数
function RoundTo(number, roundto){
    return roundto * Math.round(number/roundto);
}

// 定期的にマーケットデータを取得。
// market価格の区切り単位を取得する為に利用。
const marketsUrl = "https://ftx.com/api/markets"
// 初回
fetch(marketsUrl).then(n => n.json()).then(jsonData => {markets = jsonData.result})
// 定期的に取得して更新
setInterval(
    () => fetch(marketsUrl).then(n => n.json()).then(jsonData => {markets = jsonData.result})
,30 * 1000)

class OrderBook {
    constructor() {
        // ローカル用の板データ保持にSetリストを利用。自動で一意な値に集約してくれて、実装が減る為。
        this.orderbook = new Set();
    }

    updateOrderBook(dataAsksBids) {
        // 空配列はガード
        if (dataAsksBids.length == 0) {
            return;
        }

        // 板データ変更処理
        dataAsksBids.forEach((n) => {
            if (n[1] == 0) {
                this.orderbook.delete(n[0])
                return
            }
            this.orderbook.add(n[0])
        })
    }
}

// 買い板
class BidOrderBook extends OrderBook {
  calcGiriMaker() {
      const higherPrice = _.max([...this.orderbook.values()])
      console.log({higherPrice})
      return higherPrice + markets.find(n => n.name == currentMarket).priceIncrement
  }
}

// 売り板
class AskOrderBook extends OrderBook {
  calcGiriMaker() {
      const lowerPrice = _.min([...this.orderbook.values()])
      console.log({lowerPrice})
      return lowerPrice - markets.find(n => n.name == currentMarket).priceIncrement
  }
}

// class構文だと、calcCenterMaker内のthisの参照先がOrderBooksインスタンスではなく別になってしまい、this.sellがundefinedとなって参照エラーになる。
// コンストラクタ内でbind関数使ってthis束縛も、効果無かった。
// オブジェクトリテラルに変更。
// →　this.sellをthis.sell.orderbookに参照変更したら直ったので勘違い。
class OrderBooks {
    constructor() {
     this.buy = new AskOrderBook()
     this.sell = new BidOrderBook()
    }
     calcCenterMaker(side) {
         const higherPrice = _.max([...this.sell.orderbook.values()])
         const lowerPrice = _.min([...this.buy.orderbook.values()])
         // .25や.75は注文が受付られないので、単位値で丸める。
         const avarage = (higherPrice + lowerPrice) / 2
         const { priceIncrement } = markets.find(n => n.name == currentMarket)
         let targetPrice
         if (side == "buy") {
           // スプレットの間隔が0と最狭になっている場合でbuyをすると、ask板の最小値と同額になり、POST注文が失敗する。
           // その為、丸めた値を最小単位で引く。
           targetPrice = RoundTo(avarage, priceIncrement) - priceIncrement
         }
         else {
           targetPrice = RoundTo(avarage, priceIncrement)
         }
         console.log({targetPrice})
         return targetPrice
     }
}

// WebSocketクラスのモンキーパッチ
const originWebSocket = window.WebSocket
window.WebSocket = class extends originWebSocket {
    constructor(...args){
        super(...args)
        console.log("WebSocketモンキーパッチ　constructor実行")

        this.orderBooks = new OrderBooks()

        const handleMessage = (e) => {
            // # WSのorderBookメッセージの仕様
            // ## dataオブジェクト配下の構造
            // channel: "orderbook"
            // data:
            // action: "update"
            // asks: Array(3)
            //       0: (2) [19005, 1.343]
            //       1: (2) [19043, 0.002]
            //       2: (2) [18969, 0]
            // bids: Array(4)
            //       0: (2) [18945.5, 11.6304]
            //       1: (2) [18950.5, 0.7109]
            //       2: (2) [18951.5, 4.8141]
            //       3: (2) [18955.5, 0.6507]
            // market: "BTC-0326"
            // type: "update"
            // ## 挙動
            // orderのインデックス1が0(bids: [... ,[18828.5, 0] ,...])　削除だと思われる。順不同。

            const data = JSON.parse(e.data);
            // console.log("Websocket messageイベント e.data", data)

            // 他のチャネルだと、データ構造相違で後続処理でエラー出るので、ガード
            if (data.channel != "orderbook") {
                return;
            };

            // 単純な実装なので、初回に2回初期化される。
            if (currentMarket != data.market) {
              console.log("ローカルorderBook　初期化")
              this.orderBooks = new OrderBooks()
              currentMarket = data.market
            }

            this.orderBooks["buy"].updateOrderBook(data.data.asks)
            this.orderBooks["sell"].updateOrderBook(data.data.bids)
        }

        this.addEventListener("message",handleMessage)
    }

    send(data) {
      console.log("WebSocket sendメソッド モンキーパッチ",
                   data,
                  {"is string": typeof data == "string",
                   "is ArrayBuffer": data instanceof ArrayBuffer,
                   "is Blob": data instanceof Blob})

      if (!isGiriMaker && !isCenterMaker && !isScatterMaker) {
         super.send(data)
         return
      }

      const json = JSON.parse(data)
      if (json.path != "orders"
          // 注文キャンセルでも通ってしまうので、ガード
         || json.method == "DELETE") {
         super.send(data)
         return
      }

      const bodyJson = JSON.parse(json.body)

      let price;
      if (isGiriMaker) {
          // 最大値を求める処理は、ボタン押した時に算出。
          price = this.orderBooks[bodyJson.side].calcGiriMaker()
      }
      else if (isCenterMaker) {
          price = this.orderBooks.calcCenterMaker(bodyJson.side)
      }
      else if (isScatterMaker) {
          if (isPositionCount) {
              _.times(gPositionCount).reduce((acc, cnt) => {
                  // "Do not send more than 2 orders total per 200ms"とエラーが出た。
                  // なので、直列式の非同期処理にして、スリープ制御を入れる。
                  return acc.then(async () => {
                      // 価格はばら撒きスタート位置に利用。
                      const { price, size, side } = bodyJson
                      const currentPrice = {
                          buy: price - (gPositionBetween * cnt),
                          sell: price + (gPositionBetween * cnt),
                      }[side]
                      const changedBodyJson = {...bodyJson, price: currentPrice, size: size / gPositionCount }
                      const changedJsonString = JSON.stringify({...json, body: JSON.stringify(changedBodyJson)})
                      super.send(changedJsonString)
                      await new Promise((reso) => setTimeout(reso, 200))
                  })
              }, Promise.resolve());
          }
          else if (isPositionAmount) {
              const { price, size, side } = bodyJson
              // 残り可能注文量
              let remainingSize = size
              // 注文回数
              let cnt = 0
              const id = setInterval(() => {
                  const currentPrice = {
                      buy: price - (gPositionBetween * cnt),
                      sell: price + (gPositionBetween * cnt),
                  }[side]
                  const currentSize = gPositionAmount/currentPrice

                  if (remainingSize - currentSize <= 0) {
                      // 量が不足したら、ループ終了
                      clearInterval(id)
                      return
                  }

                  remainingSize = remainingSize - currentSize

                  const changedBodyJson = {...bodyJson, price: currentPrice, size: currentSize }
                  const changedJsonString = JSON.stringify({...json, body: JSON.stringify(changedBodyJson)})
                  super.send(changedJsonString)

                  cnt=cnt+1
              }, 200)
          }
          // 注文済みなので処理終了。
          return
      }

      const changedBodyJson = {...bodyJson, price: price }

      const changedJsonString = JSON.stringify({...json, body: JSON.stringify(changedBodyJson)})

       super.send(changedJsonString)
    }
};


(function() {
    'use strict';

    window.addEventListener("load", () => {
       console.log("loadイベント　発火");

       const e = React.createElement;

       const LikeButton = (props) => {

            const handleClick = (e) => {
                console.log("ボタン押下　handleClickハンドラ実行")
                const {value} = e.target
                if (value == "0") {
                    isGiriMaker = false;
                    isCenterMaker = false;
                    isScatterMaker = false;
                }
                else if (value == "1") {
                    isGiriMaker = true;
                    isCenterMaker = false;
                    isScatterMaker = false;
                }
                else if (value == "2") {
                    isGiriMaker = false;
                    isCenterMaker = true;
                    isScatterMaker = false;
                }
                else if (value == "3") {
                    isGiriMaker = false;
                    isCenterMaker = false;
                    isScatterMaker = true;
                }
            }

            const handleClickRadioPoint = (e) => {
                const {value} = e.target
                if (value == "0") {
                    isPositionCount = true;
                    isPositionAmount = false;
                }
                if (value == "1") {
                    isPositionCount = false;
                    isPositionAmount = true;
                }
            }

            const betweenEl = React.useRef(null)
            const [positionBetween, setPositionBetween] = React.useState(0)
            const handleChangeBetween = (e) => {
                const { value } = e.target
                setPositionBetween(value)
            }
            React.useEffect(() => {
                gPositionBetween = Number(positionBetween)
            },[positionBetween])

            const countEl = React.useRef(null)
            const [positionCount, setPositionCount] = React.useState(0)
            const handleChangeCount = (e) => {
                const { value } = e.target
                setPositionCount(value)
            }
            React.useEffect(() => {
                gPositionCount = Number(positionCount)
            },[positionCount])


            const amountEl = React.useRef(null)
            const [positionAmount, setPositionAmount] = React.useState(0)
            const handleChangeAmount = (e) => {
                const { value } = e.target
                setPositionAmount(value)
            }
            React.useEffect(() => {
                gPositionAmount = Number(positionAmount)
            },[positionAmount])

            const handleClickInput = (el) => (e) => {
                // クリックしても、入力エリアが選択されないので、クリック時にフォーカスするようにした。
                el.current.focus()
            }

            return [
               e("input",
                 {onClick: handleClick, type: "radio", name: "priceAction", value: "0"},
                 null),
               e("span",
                 null,
                 "無し"),
               e("br", null, null),
               e("input",
                 {onClick: handleClick, type: "radio", name: "priceAction", value: "1"},
                 null),
               e("span",
                 null,
                 "Ask最安値-0.5の価格にBUY指値(SELLは逆)"),
               e("br", null, null),
               e("input",
                 {onClick: handleClick, type: "radio", name: "priceAction", value: "2"},
                 null),
               e("span",
                 null,
                 "Ask最安値とBid最高値の中央値にBUY指値(SELLも同様)"),
               e("br", null, null),
               e("input",
                 {onClick: handleClick, type: "radio", name: "priceAction", value: "3"},
                 null),
               e("span",
                 null,
                 "BUY指値を下方向にばら撒き(SELLは上方向)"),
               e("br", null, null),
               e("span",
                 null,
                 "指値配置する間隔"),
               e("input",
                 {onChange: handleChangeBetween, onClick: handleClickInput(betweenEl), ref: betweenEl, type: "tel", value: positionBetween},
                 null),
               e("br", null, null),
               e("input",
                 {onClick: handleClickRadioPoint, type: "radio", name: "pointAction", value: "0"},
                 null),
               e("span",
                 null,
                 "指値配置数"),
               e("input",
                 {onChange: handleChangeCount, onClick: handleClickInput(countEl), ref: countEl, type: "number", value: positionCount},
                 null),
               e("br", null, null),
               e("input",
                 {onClick: handleClickRadioPoint, type: "radio", name: "pointAction", value: "1"},
                 null),
               e("span",
                 null,
                 "1指値の注文量(USD)"),
               e("input",
                 {onChange: handleChangeAmount, onClick: handleClickInput(amountEl), ref: amountEl, type: "tel", value: positionAmount},
                 null),
             ]
        };


        const addonElm = document.createElement("div");
        addonElm.setAttribute("style", `
position: absolute;
cursor: move;
background: rgba(0, 0, 0, 0.8);
top: 0;
left: 0;
right: 0;
bottom: 0;
z-index: 100000;
font-size: 13px;
text-align: left;
box-sizing: border-box;
contain: size style;
width: 400px;
height: 150px;`);
        addonElm.setAttribute("id", "draggable-div");

        const backOffFn = () => {
            const elm = document.querySelector("#root")
            if (elm == null) {
                // ロードが終わっていなかった場合は、時間を置いて再度関数を実行。
                setTimeout(backOffFn, 5 * 1000)
                return;
            }
            elm.appendChild(addonElm);

            ReactDOM.render(e(LikeButton), addonElm);

        };
        backOffFn();

        dragElement(addonElm);

        // ドラッグ可能コンポーネント実装
        // 参考：https://www.w3schools.com/howto/howto_js_draggable.asp
        function dragElement(elmnt) {
            var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            if (document.getElementById(elmnt.id + "header")) {
                // if present, the header is where you move the DIV from:
                document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
            } else {
                // otherwise, move the DIV from anywhere inside the DIV:
                elmnt.onmousedown = dragMouseDown;
            }

            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();
                // get the mouse cursor position at startup:
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                // call a function whenever the cursor moves:
                document.onmousemove = elementDrag;
            }

            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();
                // calculate the new cursor position:
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                // set the element's new position:
                elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
            }

            function closeDragElement() {
                // stop moving when mouse button is released:
                document.onmouseup = null;
                document.onmousemove = null;
            }
        }


    })

})();