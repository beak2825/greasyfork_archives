// ==UserScript==
// @name        楽天ラッキーくじ一覧ページ マウスオーバーでくじページを開く くじページ マウスオーバーでくじを開く くじ結果ページ 自動クローズ
// @namespace   Violentmonkey Scripts
// @match       https://jccc2013.web.fc2.com/rakuten-lucky-kuji/
// @match       https://rakucoin.appspot.com/rakuten/kuji/

// @match       https://kuji.rakuten.co.jp/*

// @match       https://kuji.rakuten.co.jp/*/lose
// @match       https://kuji.rakuten.co.jp/*/already
// @match       https://kuji.rakuten.co.jp/*/win
// @match       https://kuji.rakuten.co.jp/*/close
// @match       https://kuji.rakuten.co.jp/*/limit
// @match       https://www.rakuten-card.co.jp/e-navi/index.xhtml
// @match       https://kuji.rakuten.co.jp/root/limited
// @match       https://point.rakuten.co.jp/doc/lottery/lucky/*
// @match       https://service.link.link/lp/specialoffer/so-release.html#kujiArea

// @grant       none
// @version     1.0.10
// @author      ykhr.m
// @description 2021/7/28 2:42:26
// @downloadURL https://update.greasyfork.org/scripts/486284/%E6%A5%BD%E5%A4%A9%E3%83%A9%E3%83%83%E3%82%AD%E3%83%BC%E3%81%8F%E3%81%98%E4%B8%80%E8%A6%A7%E3%83%9A%E3%83%BC%E3%82%B8%20%E3%83%9E%E3%82%A6%E3%82%B9%E3%82%AA%E3%83%BC%E3%83%90%E3%83%BC%E3%81%A7%E3%81%8F%E3%81%98%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%92%E9%96%8B%E3%81%8F%20%E3%81%8F%E3%81%98%E3%83%9A%E3%83%BC%E3%82%B8%20%E3%83%9E%E3%82%A6%E3%82%B9%E3%82%AA%E3%83%BC%E3%83%90%E3%83%BC%E3%81%A7%E3%81%8F%E3%81%98%E3%82%92%E9%96%8B%E3%81%8F%20%E3%81%8F%E3%81%98%E7%B5%90%E6%9E%9C%E3%83%9A%E3%83%BC%E3%82%B8%20%E8%87%AA%E5%8B%95%E3%82%AF%E3%83%AD%E3%83%BC%E3%82%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/486284/%E6%A5%BD%E5%A4%A9%E3%83%A9%E3%83%83%E3%82%AD%E3%83%BC%E3%81%8F%E3%81%98%E4%B8%80%E8%A6%A7%E3%83%9A%E3%83%BC%E3%82%B8%20%E3%83%9E%E3%82%A6%E3%82%B9%E3%82%AA%E3%83%BC%E3%83%90%E3%83%BC%E3%81%A7%E3%81%8F%E3%81%98%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%92%E9%96%8B%E3%81%8F%20%E3%81%8F%E3%81%98%E3%83%9A%E3%83%BC%E3%82%B8%20%E3%83%9E%E3%82%A6%E3%82%B9%E3%82%AA%E3%83%BC%E3%83%90%E3%83%BC%E3%81%A7%E3%81%8F%E3%81%98%E3%82%92%E9%96%8B%E3%81%8F%20%E3%81%8F%E3%81%98%E7%B5%90%E6%9E%9C%E3%83%9A%E3%83%BC%E3%82%B8%20%E8%87%AA%E5%8B%95%E3%82%AF%E3%83%AD%E3%83%BC%E3%82%BA.meta.js
// ==/UserScript==

//infoseek
//https://kuji.rakuten.co.jp/d6e3c174e6
//https://kuji.rakuten.co.jp/2c43c18483

// const AUTO_CLICK_LINK = true;
const AUTO_DRAW_LOT = true;
// const windowFeaturesWithKuji = "resizable,scrollbars,noopner";
const windowFeaturesWithKuji = "noopener";

const dp = {
  verbose:true,
  autoScroll:true,
  windowOptions: 'width=400,height=400,top=0,left=800',
  styles: {
  fontSize: '11pt',
  backgroundColor: 'white'
  },
  w:undefined,
  displayCnt:0,
  open:function(){
    const win = window.open("",document.URL,this.windowOptions);
    if (win) {
      this.w = win;
      this.applyStyles();
      this.addKeyboardShortcut();
    }
    // this.br = document.createElement('br');
    return win;
  },
  applyStyles: function() {
    if (this.w && this.w.document.body) {
      const body = this.w.document.body;
      Object.assign(body.style, this.styles);
    }
  },
  openChk:function(){
    if(typeof this.w === 'undefined' || this.w.closed ){
      this.w = this.open();
    }
  },
  scrollEnd:function(){
    this.openChk();
    this.w.scrollTo(0,this.w.document.body.scrollHeight);
  },
  writeTitle:function(str){
    this.openChk();
    const doc = this.w.document;
    doc.title = str;
  },
  writeLog:function(str){
    this.insertStr(str + "<br>\n");
  },
  insertStr:function(str){
    if(this.verbose){
      this.openChk();
      const body = this.w.document.body;

      this.displayCnt++;

      body.insertAdjacentHTML('beforeend',str);
      if(this.autoScroll){
      	this.scrollEnd();
      }
    }
  },
  clear: function() {
  	if (this.w && this.w.document.body) {
    	const body = this.w.document.body;
    	this.w.document.body.innerHTML = "";
    	this.w.scrollTo(0, 0);
    }
  },
  addKeyboardShortcut: function() {
    if (this.w) {
      this.w.addEventListener("keydown", (event) => {
        if (event.ctrlKey && event.key === "l") {
          event.preventDefault();
          this.clear();
        }
      });
    }
  }
};


function replaceURL(){
  let replaceList = [
    ['https://rakucoin.appspot.com/rakuten/kuji/redirect/842378b442','https://rakucoin.appspot.com/rakuten/kuji/redirect/0113a059b5'],
    ['https://kuji.rakuten.co.jp/5ec39fd82a','https://kuji.rakuten.co.jp/26d3a1367e'],
    ['https://kuji.rakuten.co.jp/9d6398ceb1','https://kuji.rakuten.co.jp/73b39bb2dc']
  ];
  let oldURLList = replaceList.map(e=>e[0]);
  document.querySelectorAll('h2+p+table td a').forEach(e=>{
    let index = oldURLList.indexOf(e.href);
    if(index >= 0){
      e.href = e.href.replace(replaceList[index][0],replaceList[index][1]);
      console.log('Replace URL ' + replaceList[index][0] + " TO "+ replaceList[index][1]);
    }
  });
}

function setLinkOpenElement () {
  let link_cnt = 0;
  let bln_opening = false;
  let arayLink = false;
  let logStr = "";

  function autoClick(){
  //https://www.rakuten-card.co.jp/e-navi/members/other-services/lucky-lot/redirect.xhtml
  //などのwww.rakuten-card.co.jpほにゃららredirectは引っかからないようにする
    // if(arayLink===false) arayLink = Array.from(document.querySelectorAll("h2+p+table td a")).filter(e=>!(/pointmall|emagazine|e-navi\/members\/point|pointmail|#user-agent|r10\.to\/hf7Y7J/.test(e.href)) && !(/期間中1回/.test(e.innerText)));
    let qStr = "";
    if(/jccc2013.web.fc2.com/.test(document.URL)){
      qStr = "h2+p+table td a";
    }else if(/rakucoin.appspot.com/.test(document.URL)){
      qStr = "a";
    }
    if(arayLink===false){
      arayLink = Array.from(document.querySelectorAll(qStr));
      arayLink = arayLink.filter(e=>!(/pointmall|emagazine|e-navi\/members\/point|pointmail|#user-agent|r10\.to\/hf7Y7J|www\.rakuten-card\.co\.jp\/.*redirect/.test(e.href)) && !(/期間中1回/.test(e.innerText)));
      arayLink = arayLink.filter(e=>{return !/リワード/.test(e.innerText) || /https?:\/\/rakucoin\.appspot\.com\/rakuten\/kuji\/redirect\/.+/.test(e.href)});
      arayLink = arayLink.filter(e=>!e.href.includes('https://kuji.rakuten.co.jp/7e14010b80'));//skipするkujiURL

      arayLink.forEach(link=>link.addEventListener('click',e=>{
        e.preventDefault();
        if(/https?:\/\/rakucoin\.appspot\.com\/rakuten\/kuji\/redirect\/.+/.test(link.href)){
          testForrakucoin(link);
        }else{
         window.open(link.href,"",windowFeaturesWithKuji);
        }
      }));
    }


    const testForrakucoin = (linkDOM)=>{
      const rakutenKujiBaseURL = "https://kuji.rakuten.co.jp/";
      const kujiNumber = linkDOM.href.split("/").pop();
      const kujiURL = rakutenKujiBaseURL + kujiNumber;
      const tabName = "limit" + kujiNumber;
      // let windowObj = window.open(kujiURL + '/limit',tabName,windowFeaturesWithKuji);
      window.open(kujiURL + '/limit',tabName,windowFeaturesWithKuji);
      setTimeout(()=>{
        window.open(kujiURL,tabName);
      },1000 * 1);
    }

    if(bln_opening === false){
      bln_opening = true;
      setTimeout(function(){bln_opening = false;},100);
      if(link_cnt < arayLink.length){

        arayLink[link_cnt].click();

        logStr = logStr + link_cnt + ' : ' + Date.now() + ' ' + arayLink[link_cnt].outerHTML + '\n';
      }else if(link_cnt = arayLink.length){
        document.querySelector("#test-indicator").style.display = "none";
        console.log(logStr);
      }
      link_cnt++;
    }
  }

  var style = `          #test-indicator{
              position: absolute;
              font-size: 3vh;
              z-index: 100;
              color: rgba( 24,24, 24,0.6);
              Top: 0px;
              Left: 75vw;
              width: 30%;
              height: 15vh;
              background-color: #f1f3f450;
              line-height: normal;
            }`;
    // 新しいstyle要素を作成
  var newStyle = document.createElement('style');
  newStyle.type = 'text/css';
  // CSSの内容を書く
  newStyle.innerText = style;
  // HEAD要素の最後に作成したstyle要素を追加
  document.getElementsByTagName('HEAD').item(0).appendChild(newStyle);


  // 新しい div 要素を作成します
  var newDiv = document.createElement("div");
  // いくつかの内容を与えます
  var newContent = document.createTextNode("マウスイベント");
  // テキストノードを新規作成した div に追加します
  newDiv.appendChild(newContent);
  newDiv.appendChild(document.createElement("div"));
  newDiv.id = "test-indicator"
  newDiv.addEventListener('mouseover', function() {
     autoClick();
  });
  newDiv.addEventListener('touchend', function() {
     autoClick();
  });
  // DOM に新しく作られた要素とその内容を追加します
  document.body.appendChild(newDiv);
}

function editAfLink(){
//アフィリエイトリンク？削除
//下記のようなアフィアドレスを含むURLを戻せるなら戻して戻せないならリンク削除
//https://hb.afl.rakuten.co.jp/hsc/08ef9e12.bfede16b.1532c77f.c02f38dc/?scid=af_shop_img&link_type=pict&ut=eyJwYWdlIjoic2hvcCIsInR5cGUiOiJwaWN0IiwiY29sIjowLCJjYXQiOiI1OCIsImJhbiI6IjQ5OTk2NiJ9

  document.querySelectorAll("a").forEach(function(e){
    if(new RegExp(/https:\/\/hb\.afl\.rakuten\.co\.jp.+/).test(e.href)){
      if(new RegExp(/https:\/\/hb\.afl\.rakuten\.co\.jp.+m=/).test(e.href)){
        e.href = decodeURIComponent(e.href.replace(/https:\/\/hb\.afl\.rakuten\.co\.jp.+m=/,""));
        if(new RegExp(/https:\/\/www.rakuten\.co\.jp\/$/).test(e.href)) e.remove();
      }else{
        e.remove();
      }
    }
  }
  );
}

function setAutoRunElement() {
//外れ画像例
//https://jp.rakuten-static.com/1/bu/lottery/service/images/page_contents/239/defeated.gif?1626880886737
//当たり画像例
//https://jp.rakuten-static.com/1/bu/lottery/service/images/page_contents/239/elected.gif?1626968569745

// ublock origin くじの待ち時間短縮 kuji.rakuten.co.jp##+js(nano-sib, /\.attr.+f\.src[\s\S]+ac[\s\S]+clearInterval/ , *, 0.2)

//楽天証券ラッキーカブくじ https://kuji.rakuten.co.jp/6e7329f994 が長い可能性がある 7000 + 8000
//https://jp.rakuten-static.com/1/bu/lottery/service/images/page_contents/267/defeated.gif

//https://kuji.rakuten.co.jp/33d38332c2 短い 9000
//fc437af2c7 9000　スロット型が9秒の様子
//https://kuji.rakuten.co.jp/33d38332c2 修正された？
//ラッキースクラッチ 100500+4500

// 		        interval1	interval2
// kabu	  267	7000	8000
// slot	  245	9000	4500
// ????   224	9500	3000
// basic	239	10500	4500

  const RELOADTIMEOUTSEC =  10500+2000;
  // let execIntervalTime = (/6e7329f994/.test(document.URL)) ? 12000 + 2000 : (/33d38332c2/.test(document.URL)) ? 9000+2000 : RELOADTIMEOUTSEC;
  let execIntervalTime = (/6e7329f994/.test(document.URL)) ? 12000 + 2000 : RELOADTIMEOUTSEC;

  var style = `          #test-indicator{
              position: absolute;
              font-size: 18vh;
              z-index: 100;
              color: rgba( 24,24, 24,0.4);
              Top: 0px;
              Left: 0px;
              width: 100%;
              height: 100vh;
              background-color: #f1f3f450;
            }`;
    // 新しいstyle要素を作成
  var newStyle = document.createElement('style');
  newStyle.type = 'text/css';
  // CSSの内容を書く
  newStyle.innerText = style;
  // HEAD要素の最後に作成したstyle要素を追加
  document.getElementsByTagName('HEAD').item(0).appendChild(newStyle);


  // 新しい div 要素を作成します
  var newDiv = document.createElement("div");
  // いくつかの内容を与えます
  var newContent = document.createTextNode("マウスオーバーイベント設置 稼働中");
  // テキストノードを新規作成した div に追加します
  newDiv.appendChild(newContent);
  newDiv.appendChild(document.createElement("div"));
  newDiv.id = "test-indicator"

  let obs;
  let imgSrc = false;
  let autoRun = ()=>{
    // console.log("test OK");
    document.querySelector("#test-indicator").style.display = "none";
    document.querySelector("#entry").click();
    obs = setInterval(()=>{
      if((imgSrc == false) && (/lottery\.gif/.test(document.querySelector("#entry").src))){imgSrc = document.querySelector("#entry").src.match(/^.*$/)[0];}
      if(imgSrc && imgSrc !== document.querySelector("#entry").src){
        clearInterval(obs);
        // console.log("title書き換え");
        imgSrc = document.querySelector("#entry").src.match(/[^/]*$/)[0];
        // document.title = imgSrc;//ajaxSuccessでわかるようにしたのでコメントアウト
        if(!/elected|defeated/.test(imgSrc)){
          window.alert(imgSrc);
        }
        setTimeout(()=>{
          if(/elected/.test(document.querySelector("#entry").src)){
            // window.open(document.URL+"/win","test-win")
          }else{
            // window.close();//ajaxSuccessで対応した
          }
        },1000 * 3);
      }
    },1000 * 0.1);
  };
  newDiv.addEventListener('mouseover', autoRun);
//   newDiv.addEventListener('mouseover', function() {
//     // console.log("test OK");
//     document.querySelector("#test-indicator").style.display = "none";
//     document.querySelector("#entry").click();
//     obs = setInterval(()=>{
//       if((imgSrc == false) && (/lottery\.gif/.test(document.querySelector("#entry").src))){imgSrc = document.querySelector("#entry").src.match(/^.*$/)[0];}
//       if(imgSrc && imgSrc !== document.querySelector("#entry").src){
//         clearInterval(obs);
//         // console.log("title書き換え");
//         imgSrc = document.querySelector("#entry").src.match(/[^/]*$/)[0];
//         document.title = imgSrc;
//         if(!/elected|defeated/.test(imgSrc)){
//           window.alert(imgSrc);
//         }
//         setTimeout(()=>{
//           if(/elected/.test(document.querySelector("#entry").src)){window.open(document.URL+"/win","test-win")}
//           window.close();
//         },1000 * 3);
//       }
//     },1000 * 0.2);
// //     setTimeout(()=>{
// // //      if(/defeated/.test(document.querySelector("#entry").src)){window.close();}
// //       if(/elected/.test(document.querySelector("#entry").src)){window.open(document.URL+"/win","test-win")}
// //       window.close();
// //     },execIntervalTime);
//   });
  // DOM に新しく作られた要素とその内容を追加します
  document.body.appendChild(newDiv);
  if(AUTO_DRAW_LOT) autoRun();
  let resultData = [];
  $(document).ajaxSuccess(function(event, xhr, settings) {
      console.log(`settings.url : ${settings.url}`);
      console.log(`xhr.responseText : ${xhr.responseText}`);
  //   dp.writeLog(`settings.url : ${settings.url}`);
  //   dp.writeLog(`xhr.responseText : ${xhr.responseText}`);
    function decodeData(data){
      let h, s = data.split('&');
      let z = 'lot',l,r = 'https://jp.rakuten-static.com/1/bu/lottery/service/';// l:分岐判定 r:遷移先URL
      for (let i = 0; i < s.length; i++) {
         h = s[i].split('=');
         if (h[0] == z + '_answer') {
            l = h[1]
         } else {
            r = h[1];
            if (h[2]) r += h[2];
         }
      }
      // console.log(`l:${l} r:${r}`);
      return [l,r];
    }
    if(/decide/.test(settings.url)){
      resultData = decodeData(xhr.responseText);
      if(/win$|lose$/.test(resultData[1])){
        document.title = /win|lose/.exec(resultData[1])[0];
      }else{
        document.title = resultData[1];
      }
    }else if(/accept/.test(settings.url)){
      if(/lose/.test(resultData[1])){
          // document.title = 'close';
        setTimeout(()=>{
          location.replace(resultData[1]);
          // window.close();
        },2499);
      }else{
        document.title = resultData[1];
        setTimeout(()=>{
          // window.open(resultData[1],"test-win" + resultData[1]);
          // window.close();
          // location.href = resultData[1];
          location.replace(resultData[1]);
        },2499);
      }
    }


// settings.url : /e713b7ab68/MDV5K2sxckpLbmhrdlNZYVFYMDJ6dz09Cg==/decide?flash_version=undefined&os=Win32&useragent=Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0
// xhr.responseText : lot_answer=0&redirect_url=https://kuji.rakuten.co.jp/e713b7ab68/win
// settings.url : /e713b7ab68/MDV5K2sxckpLbmhrdlNZYVFYMDJ6dz09Cg==/accept?flash_version=undefined&os=Win32&useragent=Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0
// xhr.responseText :
//
// settings.url : /bdf378c660/MDV5K2sxckpLbmhrdlNZYVFYMDJ6dz09Cg==/decide?flash_version=undefined&os=Win32&useragent=Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0
// xhr.responseText : lot_answer=1&redirect_url=https://kuji.rakuten.co.jp/bdf378c660/lose
// settings.url : /bdf378c660/MDV5K2sxckpLbmhrdlNZYVFYMDJ6dz09Cg==/accept?flash_version=undefined&os=Win32&useragent=Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0
// xhr.responseText :


  });
}

function autoClose(){
  function closeWindow(){
    // console.log("test close");
    window.close();
  }
  const DOC_URL = document.URL;
  if(DOC_URL.includes('/win')){
    setTimeout(closeWindow,1500);
  }else if(DOC_URL.includes('/root/limited')){
    setTimeout(closeWindow,2500);
  }else if(DOC_URL.includes('/limit')){
    setTimeout(closeWindow,2000);
  }else{
    closeWindow();
  }
}
function focusKuji(){
  const kujiId = document.querySelector('#entry,#lot,#lot_already_content');
  if(kujiId){
    setTimeout(()=>{
      const kujiPos = kujiId.getBoundingClientRect();
      window.scrollTo( window.pageXOffset + kujiPos.left , window.pageYOffset + kujiPos.top);
      // kujiId.focus();
    },1000);
  }
}

function ini(){
  const DOC_URL = document.URL;
  if(/https?:\/\/jccc2013\.web\.fc2\.com\/rakuten-lucky-kuji\//.test(DOC_URL)){
    editAfLink();

    let obs_cnt = 0;
    let obs = setInterval(function(){
      if(obs_cnt >= 3){
        clearInterval(obs);
        replaceURL();
        setLinkOpenElement();
      };
      if(obs_cnt >= 20){
        clearInterval(obs);
      }
      obs_cnt++;
    }, 500);
  }else if(/rakucoin\.appspot\.com\/rakuten\/kuji/.test(DOC_URL)){
    editAfLink();
    setLinkOpenElement();
  }else if(/https?:\/\/kuji\.rakuten\.co\.jp\/(?:root\/limited|.*\/(?:lose|win|already|close|limit))|www\.rakuten-card\.co\.jp\/e-navi\/index\.xhtml/.test(DOC_URL)){
    window.addEventListener("load", (event) => {
      focusKuji();
    });

    if(/Infoseekラッキーくじ_01/.test(document.title)){
      const retryLink = document.querySelector('a img.kuji_retry');
      if(retryLink){
        retryLink.parentElement.click();
      }
    }else{
      autoClose();
    }
  }else if(/https?:\/\/kuji\.rakuten\.co\.jp/.test(DOC_URL)){
    // if(/Infoseekラッキーくじ_01/.test(document.title)){
    //   // Infoseekラッキーくじ_01.htm
    // }else{
    if(true){
      window.addEventListener("load", (event) => {
        focusKuji();
      });

      let obs_cnt = 0;
      let obs = setInterval(function(){
        if(document.querySelector("#entry") && document.querySelector("#entry").complete){
          clearInterval(obs);
          setAutoRunElement();
        };
        if(obs_cnt >= 20){
          clearInterval(obs);
        }
        obs_cnt++;
      }, 500);
    }
  }else if(/point\.rakuten\.co\.jp\/doc\/lottery\/lucky/.test(DOC_URL)){
    const style = document.createElement('style');
    document.head.appendChild(style);
    const sheet = style.sheet;
    sheet.insertRule('#animation_container{ transform: scale(0.5) !important;/* 	transform: unset !important; */}', 0);
    sheet.insertRule('.block_main{ width: 375px !important;	height: 667px !important;}', 0);

  }else if(/service\.link\.link\/lp\/specialoffer\/so-release\.html#kujiArea/.test(DOC_URL)){
    const link = document.querySelector('#kujiArea a');
    if(link){
      location.replace(link.href);
    }
  }

}

ini();

// (function() {
//    var $ = jQuery;
//    var pl = 'data:image/gif;base64,' + 'R0lGODlhEAALAPQAAP////wJCf3b2/3R0f3q6vwODvwJCfw1Nf2GhvxlZf28vPwpKfxQUP2Ojvxpaf3AwPwtLfwMDPxUVP3m5v3Z2f309Pw/P/3d3f3y8v24uP2jo/3Ly/3u7gAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCwAAACwAAAAAEAALAAAFLSAgjmRpnqSgCuLKAq5AEIM4zDVw03ve27ifDgfkEYe04kDIDC5zrtYKRa2WQgAh+QQJCwAAACwAAAAAEAALAAAFJGBhGAVgnqhpHIeRvsDawqns0qeN5+y967tYLyicBYE7EYkYAgAh+QQJCwAAACwAAAAAEAALAAAFNiAgjothLOOIJAkiGgxjpGKiKMkbz7SN6zIawJcDwIK9W/HISxGBzdHTuBNOmcJVCyoUlk7CEAAh+QQJCwAAACwAAAAAEAALAAAFNSAgjqQIRRFUAo3jNGIkSdHqPI8Tz3V55zuaDacDyIQ+YrBH+hWPzJFzOQQaeavWi7oqnVIhACH5BAkLAAAALAAAAAAQAAsAAAUyICCOZGme1rJY5kRRk7hI0mJSVUXJtF3iOl7tltsBZsNfUegjAY3I5sgFY55KqdX1GgIAIfkECQsAAAAsAAAAABAACwAABTcgII5kaZ4kcV2EqLJipmnZhWGXaOOitm2aXQ4g7P2Ct2ER4AMul00kj5g0Al8tADY2y6C+4FIIACH5BAkLAAAALAAAAAAQAAsAAAUvICCOZGme5ERRk6iy7qpyHCVStA3gNa/7txxwlwv2isSacYUc+l4tADQGQ1mvpBAAIfkECQsAAAAsAAAAABAACwAABS8gII5kaZ7kRFGTqLLuqnIcJVK0DeA1r/u3HHCXC/aKxJpxhRz6Xi0ANAZDWa+kEAA7AAAAAAAAAAAA';
//    $('<style type="text/css">.preloader{background:url(' + pl + ') center center no-repeat #fff}</style>').appendTo('head');
//    $.fn.preloader = function(options) {
//       var defaults = {
//          delay: 200,
//          preload_parent: "div",
//          check_timer: 100,
//          ondone: function() {},
//          oneachload: function(image) {},
//          fadein: 380
//       };
//       var options = $.extend(defaults, options),
//          root = $(this),
//          images = root.find("img").css({
//             "visibility": "hidden",
//             opacity: 0
//          }),
//          timer, counter = 0,
//          pi = 0,
//          cf = [],
//          delaySum = options.delay,
//          ic, init = function() {
//             timer = setInterval(function() {
//                if (counter >= cf.length) {
//                   clearInterval(timer);
//                   options.ondone();
//                   return;
//                }
//                for (pi = 0; pi < images.length; pi++) {
//                   if (images[pi].complete == true) {
//                      if (cf[pi] == false) {
//                         cf[pi] = true;
//                         options.oneachload(images[pi]);
//                         counter++;
//                         delaySum += options.delay;
//                      }
//                      $(images[pi]).css("visibility", "visible").delay(delaySum).animate({
//                         opacity: 1
//                      }, options.fadein, function() {
//                         $(this).parent().removeClass("preloader");
//                      });
//                   }
//                }
//             }, options.check_timer)
//          };
//       images.each(function() {
//          ($(this).parent(options.preload_parent).length == 0) ? $(this).wrap("<a class='preloader'/>"): $(this).parent().addClass("preloader");
//          cf[pi++] = false;
//       });
//       images = $.makeArray(images);
//       ic = $("<img/>", {
//          id: 'loadingicon',
//          src: pl
//       }).hide().appendTo("body");
//       timer = setInterval(function() {
//          if (ic[0].complete == true) {
//             clearInterval(timer);
//             init();
//             ic.remove();
//             return;
//          }
//       }, 100);
//    }
//    var l, r, q, a, f, p = {},
//       b = 'https://jp.rakuten-static.com/1/bu/lottery/service/',
//       z = 'lot',
//       v = 'entry',
//       w = 'src',
//       g = 'images/page_contents/',
//       k = '.gif',
//       r = b;
//    p[0] = '/elected' + k;
//    p[1] = '/defeated' + k;
//    p[2] = '/' + z + 'tery' + k;
//    p[3] = '/entry' + k;
//    $(window).bind('load', function() {
//       p[0] = b + g + x + p[0];
//       p[1] = b + g + x + p[1];
//       p[2] = b + g + x + p[2];
//       p[3] = b + g + x + p[3];
//       q = '?flash_version=undefined&os=' + window.navigator.platform + '&useragent=' + navigator.userAgent;
//       r += c + '/already';
//       a = new Image();
//       a.src = p[2];
//       $('#' + z).append('<img id="' + v + '" ' + w + '="' + p[3] + '"/>').preloader();
//       $(function() {
//          $('#' + v).click(function() {
//             $('#' + v).unbind('click').attr(w, a.src);
//             de();
//             var t = setInterval(function() {
//                $('#' + v).attr(w, f.src);
//                ac();
//                clearInterval(t);
//             }, 10500);
//          });
//       });
//    });

//    function re(d) {
//       var h, s = d.split('&');
//       for (var i = 0; i < s.length; i++) {
//          h = s[i].split('=');
//          if (h[0] == z + '_answer') {
//             l = h[1]
//          } else {
//             r = h[1];
//             if (h[2]) r += h[2];
//          }
//       }
//       if (l == '2') {
//          rd(r)
//       } else {
//          f = new Image();
//          f.src = p[l] + '?' + Date.now();
//       }
//    }

//    function de() {
//       $.ajax({
//          type: "GET",
//          url: '/' + c + '/' + m + '/decide' + q,
//          dataType: "text",
//          success: function(d) {
//             re(d)
//          }
//       });
//    }

//    function ac() {
//       $.ajax({
//          type: "GET",
//          url: '/' + c + '/' + m + '/accept' + q,
//          dataType: "text",
//          success: function(d) {
//             var t = setInterval(function() {
//                rd(r);
//             }, 4500)
//          }
//       });
//    }

//    function rd(ul) {
//       document.location.href = ul
//    }
// }).call(this);