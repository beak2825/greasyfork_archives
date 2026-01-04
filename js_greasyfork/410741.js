// ==UserScript==
// @name ヨドバシ検索結果で量あたり単価を表示
// @description Shift+A/Shift+B:量単価上限で絞り込み　A:量単価昇順　.:価格上限入力フォームにフォーカス　Shift+Alt+A:価格昇順　z:レビューの★多い順　,:価格上限で絞り込み(Amazon,iHerb)
// @match *://www.amazon.co.jp/*
// @exclude *://www.amazon.co.jp/*/cart/*
// @exclude *://www.amazon.co.jp/*/buy/*
// @exclude *://www.amazon.co.jp/*/huc/*
// @exclude *://www.amazon.co.jp/*/css/*
// @exclude *://www.amazon.co.jp/ap/*
// @exclude *://www.amazon.co.jp/auto-deliveries*
// @match *://jp.iherb.com/*
// @match https://www.kohnan-eshop.com/shop/goods/search.aspx*
// @match https://www.kohnan-eshop.com/shop/*
// @match https://www.komeri.com/category/*
// @match https://www.komeri.com/search/*
// @match https://www.komeri.com/disp/*
// @match https://www.komeri.com/topic/*
// @match https://www.komeri.com/shop/*
// @match *://www.yodobashi.com/*
// @match https://order.yodobashi.com/yc/shoppingcart/index.html*
// @match https://order.yodobashi.com/yc/shoppingcart/action.html*
// @match *://kakaku.com/*
// @match *://search.kakaku.com/*
// @match *://nttxstore.jp/*
// @match https://nttxstore.jp/freeSearch*
// @match https://nttxstore.jp/*
// @match https://search.rakuten.co.jp/*
// @match https://sundrug-online.com/collections/*
// @match https://sundrug-online.com/products/*
// @match https://sundrug-online.com/search*
// @match *://sundrug-online.com/*
// @match https://www1.pcdepot.co.jp/products/list*
// @match https://www1.pcdepot.co.jp/products/detail/*
// @match https://www.topvalu.net/items/*
// @match https://www.topvalu.net/search/*
// @match *://auctions.yahoo.co.jp/*
// @match *://page.auctions.yahoo.co.jp/jp/auction/*
// @match *://www.xprice.co.jp/*
// @match *://www.akibaoo.co.jp/*
// @match *://akibaoo.co.jp/*
// @match *://www.google.tld/*
// @match https://shopping.yahoo.co.jp/*
// @match *://jp.daisonet.com/*
// @match *://workman.jp/*
// @match *://www.e-fujiyakuhin.jp/*
// @match *://www.biccamera.com/*
// @match https://secure.iherb.com/myaccount/orderdetails*
// @match https://secure.iherb.com/myaccount/subscription*
// @match https://checkout2.iherb.com/cart
// @match *://super.belc-netshop.jp/*
// @match https://www.xprice.co.jp/*
// @match *://www.dospara.co.jp/*
// @match *://www.yamada-denkiweb.com/*
// @match *://shop.tsukumo.co.jp/*
// @match *://www.ebay.com/*
// @match *://ja.aliexpress.com/*
// @match *://www.e-welcia.com/*
// @noframes
// @grant       GM_addStyle
// @version 0.4.38
// @run-at document-idle
// @namespace https://greasyfork.org/users/181558
// @require https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/381341/%E3%83%A8%E3%83%89%E3%83%90%E3%82%B7%E6%A4%9C%E7%B4%A2%E7%B5%90%E6%9E%9C%E3%81%A7%E9%87%8F%E3%81%82%E3%81%9F%E3%82%8A%E5%8D%98%E4%BE%A1%E3%82%92%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/381341/%E3%83%A8%E3%83%89%E3%83%90%E3%82%B7%E6%A4%9C%E7%B4%A2%E7%B5%90%E6%9E%9C%E3%81%A7%E9%87%8F%E3%81%82%E3%81%9F%E3%82%8A%E5%8D%98%E4%BE%A1%E3%82%92%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

(function() {
  const DEBUG = 1; // 1:計算に使った要素をたまに可視化（推奨）　2:計算に使った要素を常に可視化　0:通常モード
  const USE_YODOBASHI_METHOD_IN_AMAZON = 1; // 1:ヨドバシ以外のポイント還元計算でヨドバシと同じ方法を使用　0:ポイントを値引きとして計算
  const GUESS_SHIPPING_AMAZON = 1; // 1:9キーを押す前からAmazon検索結果で出荷元：Amazonかどうかを推測して印をつける 0:無効
  const AMAZON_REMOVE_DUPLICATED = 2; // 1:Amazonで重複して出てきた商品に印をつける　2:Amazonで重複して出てきた商品を隠す　0:無効
  const debug2 = 0; // 1:半透明に消す
  const IHERB_EXPAND_REEL = 0;  // 1:iHerbの棚の密度を上げる 0:無効

  var debug = DEBUG;
  if (debug == 1) {
    debug = Math.random() > (lh("amazon.co.jp") ? 0.7 : 0.95) ? 1 : 0;
    setTimeout(() => debug = 0, 15000);
  }
  let addstyle = {
    added: [],
    add: function(str) {
      if (this.added.some(v => v[1] === str)) return;
      var S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" //      var S="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_"
      var d = Date.now()
      var uid = Array.from(Array(12)).map(() => S[Math.floor((d + Math.random() * S.length) % S.length)]).join('')
      end(document.head, `<style id="${uid}">${str}</style>`);
      this.added.push([uid, str]);
      return uid;
    },
    remove: function(str) { // str:登録したCSSでもaddでreturnしたuidでも良い
      let uid = this.added.find(v => v[1] === str || v[0] === str)?.[0]
      if (uid) {
        eleget0(`#${uid}`)?.remove()
        this.added = this.added.filter(v => v[0] !== uid)
      }
    }
  }


  //  const ael = (ele, evts, cb, opt) => evts.split(" ").forEach(evt => ele?.addEventListener(evt, cb, opt));
  //const ael = (ele, evts, cb, opt, interval = 0) => evts.split(" ").forEach(evt => ele?.addEventListener(evt, e => { if (!ael?.to) ael.to = setTimeout(e => { ael.to = 0; cb(e); }, interval, e) }, opt));
  const ael = (ele, evts, cb, opt, interval = 0) => evts.split(" ").forEach(evt => ele?.addEventListener(evt, e => !ael?.to ? ael.to = setTimeout(e => (cb(e), ael.to = 0), interval, e) : 0, opt));
  const notify = (message) => Notification.permission === "granted" ? new Notification(message) : Notification.permission !== "denied" && Notification.requestPermission().then(permission => (permission === "granted" && new Notification(message))) // notify(new Date().toLocaleString("ja-JP")

  var GF = {};
  let cppLimit = [];

  GF.pprbox = ld("amazon") && "div.s-asin[data-asin]";
  ael(document, "click contextmenu", e => { // pprのクリックで単価の上限でフィルタ
    if (e?.target?.matches(".ppr , .ppr2") && GF?.pprbox) {
      let type = e?.target?.matches(".ppr2") ? 1 : 0;
      e.stopImmediatePropagation() + e.preventDefault() + e.stopPropagation();
      var ret = proInput(`グループ${type?"B":"A"}の量あたり価格上限を入力してください`, e?.target?.dataset?.ppr || cppLimit[type]);
      if (ret === null || ret == cppLimit[type]) return false;
      cppLimit[type] = +ret;
      sessionStorage.setItem("cppLimit" + type, cppLimit[type] || "") || 0;
      pprfilter(elegeta(GF?.pprbox))
      return false;
    }
  }, true);
  moq(GF?.pprbox, eles => {
    pprfilter(eles)
  }, document, "Ppr");

  function pprfilter(eles) {
    GF.pprf = setTimeout(() => {
      eles.filter(v =>
        (cppLimit[0] && +eleget0(`.ppr`, v)?.dataset?.ppr > cppLimit[0]) ||
        (cppLimit[1] && +eleget0(`.ppr2`, v)?.dataset?.ppr > cppLimit[1])
      ).forEach(v => {
        gmhbHide(v, "yodoPpr")
      })
      eles.filter(v =>
        !(cppLimit[0] && +eleget0(`.ppr`, v)?.dataset?.ppr > cppLimit[0]) &&
        !(cppLimit[1] && +eleget0(`.ppr2`, v)?.dataset?.ppr > cppLimit[1])
      ).forEach(v => {
        gmhbShow(v, "yodoPpr")
      })
    }, 1111)
  }


  if (engine2() != "not target") return;

  String.prototype.match0 = function(re) { let tmp = this.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可
  let tpDone = new Set();

  if (typeof $ === "undefined") { window.addEventListener('DOMContentLoaded', function() { run0(); return; }) } else { run0(); }

  //  GM_addStyle(`.ppr,.ppr2 {all:initial; position:relative;z-index:999; display:inline-block; font-weight:bold; font-size:${lh("amazon")?"min(14px,110%)":"min(15px,80%)"}; margin:0.5px 0px 0.5px 3px; text-decoration:none !important; padding:0px 0.5em 0 0.2em; border-radius:99px; background-color:#6080b0; color:white; white-space: nowrap;}`)
  GM_addStyle(`.ppr,.ppr2 {all:initial; position:relative;z-index:99; display:inline-block; font-weight:bold; font-size:${lh("amazon")?"min(14px,110%)":"min(15px,80%)"}; margin:0.5px 0px 0.5px 3px; text-decoration:none !important; padding:0px 0.5em 0 0.2em; border-radius:99px; background-color:#6080b0; color:white; white-space: nowrap;}`)

  function run0() {

    if (window != parent) return;
    const ddg_google_ratio = 0.2; // 0:100%ddg 1:100%google
    const enableBeta = 1; // 1でポイント還元後価格（想像）を表示
    var gStaY = 0;

    // -----------------------------------------------------

    // 上が優先
    const SITEINFO = [{
        is: 'YODOBASHI',
        urlRE: '//.*.yodobashi.com/',
        //        titleXPath: '//div[contains(@class,"pName")]/p[2]|.//h1[@id="products_maintitle"]/span|.//span[@class="js_c_commodityName"]|.//a[@id="LinkProduct01"]|.//div[@class="product js_productName"]|.//a[@class="js_productListPostTag js-clicklog js-taglog-schRlt"]/p[2]|//span[contains(@class,"yhmMyMemo")]',
        titleXPath: '//div[contains(@class,"pName")]/p[2]|.//h1[@id="products_maintitle"]/span|.//span[@class="js_c_commodityName"]|.//a[@id="LinkProduct01"]|.//div[@class="product js_productName"]|.//a[@class="js_productListPostTag js-clicklog js-taglog-schRlt"]/p[2]',
        //titleXPath: '.yhmMyMemo',
        priceXPath: '//span[@class="productPrice"]|.//span[@id="js_scl_unitPrice"]|.//div[@class="price red"]/strong|.//li[@class="Special"]/em|.//span[@class="red js_ppSalesPrice"]',
        pointrateXPath: '//span[@class="spNone"]|.//span[@id="js_scl_pointrate"]|.//div[@class="point orange"]|.//li[@class="Point"]|.//span[@class="orange js_ppPoint"]|.//div[@class="pInfo liMt05"]/ul/li/span[@class="orange ml10"]',
        isorder: /https?:\/\/order\./,
        issearch: /[\?\&]word\=/,
        iscate: /category\/|\/maker\//,
        isproduct: /\/product\//,
        orderPL: 5,
        listPL: 3,
        //        closest:'.srcResultItem_block,.pListBlock,.js_productBox,.js_smpClickable,.js_latestSalesOrderProduct,.productListTile',//srcResultItem_block pListBlock hznBox js_productBox js_smpClickable js_latestSalesOrderProduct  productListTile
        sortData: [
          { sortPpr: '//span[@class="ignoreMe ppr2"]', sortElement: '.srcResultItem_block', },
          { sortPpr: '//span[@class="ignoreMe ppr"]', sortElement: '.srcResultItem_block', },
        ],
        sortUrl: /https:\/\/www.yodobashi.com\/category\/|https:\/\/www.yodobashi.com\/.*\?word=|https:\/\/www\.yodobashi\.com\/\?searchbtn=true\&word=|\/\/www\.yodobashi\.com\/.*\&word=|\/\/www.yodobashi.com\/maker\//, // todo: |https:\/\/www.yodobashi.com\/maker\/
        onLoad: () => { //window.addEventListener('DOMContentLoaded', function(){
          // .キーで上限絞り込みにフォーカス、全選択状態
          $(document).keypress((e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable || ((e.target.closest('#chat-messages,ytd-comments-header-renderer') || document.activeElement.closest('#chat-messages,ytd-comments-header-renderer')))) return;
            if (String(e.key) == ".") {
              var ele = eleget0('//input[@id="js_upperPrice"]');
              e.preventDefault();
              if (ele) {
                ele.focus();
                $(ele).select();
                ele.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
              }
            }
          });
          $('input#js_upperPrice').css('ime-mode', 'inactive'); // 上限価格はIME offにする
          //      })
        },
        onEachItem: (node, titleEle, rndcolor) => {
          if (issearch || isproduct) { // 「店頭でのみ販売しています|予定数の販売を終了しました|販売を終了しました」を非表示
            for (let ele of elegeta('//div[@class="pInfo"]/ul/li', node)) {
              if (ele.innerText.match(/店頭でのみ販売しています|販売を終了しました/)) { debugRemove(ele.parentNode.parentNode.parentNode); continue; }
            }
          };
          for (let site of [
              ["UserBenchmark", "www.userbenchmark.com", "#609070", /内蔵SSD|内蔵ハードディスク|PCパーツ>CPU|PCパーツ>グラフィックボード|USBメモリ/],
              ["techpowerup", "www.techpowerup.com Energy Efficiency", "#801010", /PCパーツ>CPU/],
              ["Backblaze", "www.backblaze.com/blog/hard-drive-stats", "#C51E33", /内蔵SSD|内蔵ハードディスク/],
              ["kopfhoerer.com", "www.kopfhoerer.com", "#137db0", /用ヘッドセット|型ヘッドホン|Bluetooth対応ヘッドホン|ゲーミングヘッドセット|Bluetoothヘッドセット|イヤホンマイク>3.5mmミニプラグ|インナーイヤーヘッドホン|ヘッドセット・ヘッドホン|ヘッドホン>完全ワイヤレスイヤホン/],
              ["Kopfhoerer.de", "www.kopfhoerer.de", "#2b2a3a", /型ヘッドホン|Bluetooth対応ヘッドホン|インナーイヤーヘッドホン|ヘッドセット・ヘッドホン|ヘッドホン>完全ワイヤレスイヤホン/],
              ["RTINGS", "www.rtings.com", "#609070", /用ヘッドセット|型ヘッドホン|Bluetooth対応ヘッドホン|ゲーミングヘッドセット|Bluetoothヘッドセット|イヤホンマイク>3.5mmミニプラグ|インナーイヤーヘッドホン|ヘッドセット・ヘッドホン|ヘッドホン>完全ワイヤレスイヤホン/],
              ["TFT CENTRAL", "www.tftcentral.co.uk", "#2e2e2e", />ディスプレイ・モニター|ゲーミングモニター/]
            ]) {
            if ((issearch || isproduct || iscate) && ((eleget0('//div[@class="breadcrumbs js_ctlg_ageconfirm_permit"]')?.innerText || "") + " " + ((titleEle.parentNode.parentNode.parentNode.innerText))).match(site[3])) { // RTINGS/kopfhoererリンク

              var ele = titleEle.parentNode.parentNode.parentNode.insertBefore(document.createElement("a"), titleEle.parentNode.parentNode.nextSibling);
              var iflsite = (Math.random() > ddg_google_ratio) ? "https://duckduckgo.com/?q=!ducky+" : "https://www.google.co.jp/search?btnI=I%27m+Feeling+Lucky&q=";
              ele.innerHTML += '<a rel=\"noopener noreferrer nofollow\" href="' + iflsite + (titleEle.innerText.replace(/[\/\?\+\[\]\(\)\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]+/gmi, " ") + ' ').replace(/\s{2,9}/gm, " ") + 'site:' + site[1] + '" style="font-weight:bold; font-size:auto;display:inline-block;margin:1px 1px;  padding:0.03em 0.5em 0.03em 0.5em; border-radius:99px; background-color:' + site[2] + '; color:white; white-space: nowrap; ">' + site[0] + '</a>';
            }
          }
        },
        pointFunc: (parentEle, price, priceEle, rndcolor) => {
          var pointEle = eleget0(SITE.pointrateXPath, parentEle);
          if (pointEle) {
            var pointtext = pointEle.innerText.replace(/\,/g, "");
            if (pointtext.match(/([0-9]+)(?:％)/)) {
              debugEle(pointEle, rndcolor);
              var pointPer = Number(pointtext.match(/([0-9,]+)(?:％)/)[1] / 100);
            } else
            if (pointtext.match(/([0-9]+)(?:ポイント)/)) {
              debugEle(pointEle, rndcolor);
              var pointPer = Number(pointtext.match(/([0-9]+)(?:ポイント)/)[1] / price);
              /* if (debug) */
              pointEle.innerHTML += "<span style='background-color:#fff8e8;'>(" + Math.round(pointPer * 100) + "%？)</span>";
            }
            if (pointPer || pointPer === 0) {
              var point = Math.floor(price - (price * (price / (price + price * pointPer))));
              var pricef = Math.round(price - point).toLocaleString();

              //              if (enableBeta) priceEle.innerHTML += " <span class='kangengo' style='background-color:#fff0f0;'>" + (isorder ? "<br>還元後:" : "（還元後：") + "￥" + pricef + (isorder ? "" : "）") + "</span>";
              if (enableBeta) after(priceEle, " <span class='kangengo' style='background-color:#fff0f0;color:#f00;font-weight:bold;'>" + (isorder ? "<br>還元後:" : "（還元後：") + "￥" + pricef + (isorder ? "" : "）") + "</span>");
            }
          } else { var point = -1; }
          return point;
        },
        hide: (title, isorder, isproduct, issearch, parentEle, price, iscate, cppLimit, point, titleEle) => {
          // type1
          var pass1 = 0;

          if (title.match0(/テープ|マスカー/) && title.match0(/[\d\.]+m|\s[\d\.]+m巻/i)) var ryou = (title.match(/([\d\.]+)(m)|×([\d\.]+)(km)/i) ?? title.match(/([\d\.]+)(m巻)|([\d\.]+)(km巻)/i));
          //          if (title.match0(/テープ|マスカー/) && title.match0(/×[\d\.]+m/i)) var ryou = (title.match(/×([\d\.]+)(m)|×([\d\.]+)(km)/i)??title.match(/([\d\.]+)(m巻)|([\d\.]+)(km巻)/i) ) ;
          else
          if (title.match(/ゴミ袋|ポリ袋/) || ((isproduct || issearch) && ((parentEle.innerText)).match(/ゴミ袋|ポリ袋/)))
            var ryou = title.replace(/\,/g, "").match(/\D([0-9\.]+)(P)/);
          else
          if (title.match(/ラップ|クッキングシート/) || ((isproduct || issearch) && ((parentEle.innerText)).match(/ラップ/)))
            var ryou = title.replace(/\,/g, "").match(/\D([0-9\.]+)(m)/);
          else
          if (title.match(/USBメモリ|(外付け|外付|ポータブル|内蔵|バルク|接続)(SSD|HDD|ハードディスク)|バルクドライブ|2\.5.?(inc|インチ)|7mm|9.5mm/) || ((isproduct || issearch) && ((parentEle.innerText)).match(/(内蔵|外付け|ポータブル)(SSD|HDD|ハードディスク)/)))
            var ryou = title.replace(/\,/g, "").match(/\s([0-9\.]+)(mg|㎎|g|ml|mL|ml|GB)|(?:[^A-Z0-9\.\-])([0-9\.]+)(L(?!b)|kg|㎏|Kg|TB)/i);
          else
            var ryou = title.replace(/\,/g, "").match(/\D([0-9\.]+)(mg|㎎|g|ml|mL|ml)|(?:[^A-Z0-9\.\-])([0-9\.]+)(L(?!b)|kg|㎏|Kg)/i);
          if (ryou && (ryou[1] > 0 || ryou[3] > 0)) {
            var ryout = Number(ryou[1]) || Number(ryou[3]) * (1000);
            if (ryou[4]) ryou[4] = ryou[4].replace(/kg|㎏|Kg/, "g").replace(/L/, "ml").replace(/TB/, "GB");
            //var ryout = Number(ryou[1]) || Number(ryou[3]) * 1000;
            var mul = (title.match(/×[0-9\.\,]+/m) && !(title.match(/[\(（\[].*×.*[\)）\]]/m)) && !(title.match(/×[\d\s]*(cm|mm|m)/))) ? Number(title.match(/×([0-9\.\,]+)/)[1]) : 1;

            if (point > -1) {
              var ppr = Math.round(100 * (price - point) / Number(ryout * mul)) / 100;
              var pprEmbed = (price - point) / Number(ryout * mul);
              //var pprEmbed = (price) / Number(ryout * mul);

              var pprEmbedAligned = pprEmbed
              if (ryou[2]?.match(/mg/i)) pprEmbedAligned = (price - point) / Number(ryout * mul / 1000)
              if (ryou[2]?.match(/mcg|μg/i)) pprEmbedAligned = (price - point) / Number(ryout * mul / 1000 / 1000)

              titleEle.style.display = "inline";
              var ele = $('<span class="ignoreMe ppr" data-ppr="' + pprEmbedAligned + '" style=" display:inline-block; font-weight:bold; font-size:90%;margin:0.5px 0px 0.5px 3px; text-decoration:none !important;  padding:0.03em 0.5em 0.03em 0.2em; border-radius:99px; background-color:#6080b0; color:white; white-space: nowrap; ">￥' + ppr + '/' + (ryou[2] || ryou[4]) + (ppr == undefined ? ryou + "," + ryout + "," + mul : "") + '</span>').insertAfter(titleEle);
              if ((!isproduct) && (!isorder)) setClick(ele, ppr, "\\" + (Math.round(price - point)) + "/" + Number(ryout * mul) + (ryou[2] || ryou[4]) + "=" + pprEmbed + "\n") //$(ele).css("cursor", "pointer").attr("title", "クリックかShift+Aでこの量単価の上限で絞り込む").click(e => inputcpplimit(e, 1, ppr));
              pass1 = ((iscate || issearch) && cppLimit[1] && ppr <= cppLimit[1]) ? 1 : 0;
            }
          }
          // type2
          var pass2 = 0;
          var ryou1 = ryou;
          var ryou = title.replace(/\,/g, "").match(/\D([0-9\.]+)(冊|袋|枚|粒|錠|包|杯|本|個|袋|組入|ポート|色|日分|ヶ入|食|回分|回用|巻(入|セット|缶|函))/);
          if (ryou && (ryou[1] > 0 || ryou[3] > 0)) {
            if (ryou[4]) ryou[4] = ryou[4].replace(/kg|㎏|Kg/, "g").replace(/L/, "ml").replace(/TB/, "GB");
            var ryout = Number(ryou[1]) || Number(ryou[3]) * 1000;
            var mul = 1; //(title.match(/×[0-9\.\,]+/m) && !(title.match(/[\(（\[].*×.*[\)）\]]/m)) && !(title.match(/×[\d\s]*(cm|mm)/)))?Number(title.match(/×([0-9\.\,]+)/)[1]):1;

            if (point > -1) {
              var ppr2 = Math.round(100 * (price - point) / Number(ryout * mul)) / 100;
              var pprEmbed = (price - point) / Number(ryout * mul);
              var pprEmbedAligned = pprEmbed

              titleEle.style.display = "inline";
              var ele = $('<span class="ignoreMe ppr2" data-ppr="' + pprEmbedAligned + '" style=" display:inline-block; font-weight:bold; font-size:90%;margin:0.5px 0px 0.5px 3px; text-decoration:none !important;  padding:0.03em 0.5em 0.03em 0.2em; border-radius:99px; background-color:#6080b0; color:white; white-space: nowrap; ">￥' + ppr2 + '/' + (ryou[2] || ryou[4]) + '</span>').insertAfter(titleEle);
              if ((!isproduct) && (!isorder)) $(ele).css("cursor", "pointer").attr("title", "クリックかShift+Bでこの量単価の上限で絞り込む").click(e => inputcpplimit(e, 2, ppr2));

              pass2 = ((iscate || issearch) && cppLimit[2] && ppr2 <= cppLimit[2]) ? 1 : 0;
            }
          }
          if ((cppLimit[1] > 0 && pass1 == 0) || (cppLimit[1] > 0 && (!ryou1))) debugRemove(parentEle);
          if ((cppLimit[2] > 0 && pass2 == 0) || (cppLimit[2] > 0 && (!ryou))) debugRemove(parentEle);
        },
      }, {

        // -----------------------------------------------------{
        is: 'KOHNAN',
        urlRE: '//www.kohnan-eshop.com/shop/goods/search.aspx|//www.kohnan-eshop.com/shop/', //|//www.kohnan-eshop.com/shop/g/',
        titleXPath: '//a[@class="js-enhanced-ecommerce-goods-name"]|//h1[@class="block-goods-name js-enhanced-ecommerce-goods-name"]', //'|//div[@class="mainframe_"]/h1[@class="goods_name_"]',
        priceXPath: '//div[@class="block-thumbnail-t--price-items"]/div|//div/div[@class="block-cartbox-section--price-price"]', //'|//table[@class="formdetail_ goodsspec_"]/tbody/tr[5]/td/span[@class="price_"]',        orderPL: 3,
        listPL: 3,
        isorder: /$^/,
        iscate: /shop\/c\//,
        isproduct: /www.kohnan-eshop.com\/shop\/g\//,
        issearch: /search/,
        sortData: [{ url: /https:\/\/www.kohnan-eshop.com\/shop\/goods\/search.aspx|\/\/www\.kohnan-eshop\.com\/shop\//, sortPpr: '//span[@class="ignoreMe ppr"]', sortElement: '.block-thumbnail-t li', }],
        //sortUrl: /https:\/\/www.kohnan-eshop.com\/shop\/goods\/search.aspx/,
        onLoad: () => {},
        onEachItem: (node, titleEle, rndcolor) => {},
        pointFunc: (parentEle, price, priceEle, rndcolor) => {},
        hide: (title, isorder, isproduct, issearch, parentEle, price, iscate, cppLimit, point, titleEle) => {
          // type1
          var pass1 = 0;
          title = title.replace(/[Ａ-Ｚａ-ｚ０-９，．]/g, function(s) { return String.fromCharCode(s.charCodeAt(0) - 0xFEE0) })
          var ryou = title.replace(/[Ａ-Ｚａ-ｚ０-９，．]/g, function(s) { return String.fromCharCode(s.charCodeAt(0) - 0xFEE0) }).replace(/\,/g, "").match(/\D([0-9\.]+)(mg|㎎|g|ml|mL|枚|粒|錠|包|杯|本|個|袋|ml|組入|ポート|色)|(?:[^A-Z0-9\.\-])([0-9\.]+)(L(?!b)|kg|㎏|Kg)/);

          //          alert(ryou);
          let discreteUnit = /×([0-9\.]+)\s?(セット|Pack|枚|タブレット|カプセル|個|錠|ベジタリアンカプセル|ベジタブルカプセル|植物性カプセル|Veggie Caps|Veg Capsules|ベジカプセル|べジカプセル|カプセル|粒|ベジキャップ|チュアブル錠|ソフトゼリー|ティーバック|ティーバッグ|袋|Softgels|ソフトジェル|Chewable Tablets|錠|Tablets|グミ|ロゼンジ|植物性液体フィトカプセル|Vegetarian Capsules)/m;

          if (ryou && (ryou[1] > 0 || ryou[3] > 0)) {
            if (ryou[4]) ryou[4] = ryou[4].replace(/kg|㎏|Kg/, "g").replace(/L/, "ml"); //.replace(/TB/, "GB");
            var ryout = Number(ryou[1]) || Number(ryou[3]) * 1000;
            var mul = (title.match(discreteUnit)) ? Number(title.match(discreteUnit)[1]) : 1;
            var ppr = Math.round(100 * (price) / Number(ryout * mul)) / 100;
            var pprEmbed = (price) / Number(ryout * mul);

            var pprEmbedAligned = pprEmbed
            if (ryou[2]?.match(/mg/i)) pprEmbedAligned = (price) / Number(ryout * mul / 1000)
            if (ryou[2]?.match(/mcg|μg/i)) pprEmbedAligned = (price) / Number(ryout * mul / 1000 / 1000)

            titleEle.style.display = "inline";
            var ele = $('<span class="ignoreMe ppr" data-ppr="' + pprEmbedAligned + '" style=" font-size:12px; ">￥' + ppr + '/' + (ryou[2] || ryou[4]) + (ppr == undefined ? ryou + "," + ryout + "," + mul : "") + '</span>').insertAfter(titleEle);
            if ((!isproduct) && (!isorder)) setClick(ele, ppr, "\\" + (Math.round(price)) + "/" + Number(ryout * mul) + (ryou[2] || ryou[4]) + "=" + pprEmbed + "\n");

            pass1 = ((iscate || issearch) && cppLimit[1] && ppr <= cppLimit[1] && ryou && ppr) ? 1 : 0;
          }
          // type2
          var pass2 = 0;
          var ryou1 = ryou;
          var ryou = title.match(discreteUnit);
          if (ryou && (ryou[1] > 0)) {
            var ryout = Number(ryou[1]);
            var mul = 1;
            var ppr2 = Math.round(100 * (price) / Number(ryout * mul)) / 100;
            titleEle.style.display = "inline";
            var ele = $('<span class="ignoreMe ppr2" style=" font-size:12px; ">￥' + ppr2 + '/' + (ryou[2] || ryou[4]) + '</span>').insertAfter(titleEle.parentNode);
            if ((!isproduct) && (!isorder)) $(ele).css("cursor", "pointer").attr("title", "クリックかShift+Bでこの量単価の上限で絞り込む").click(e => inputcpplimit(e, 2, ppr2));
            pass2 = ((iscate || issearch) && cppLimit[2] && ppr2 <= cppLimit[2] && ryou && ppr) ? 1 : 0;
          }

          if ((cppLimit[1] > 0 && pass1 == 0) || (cppLimit[1] > 0 && (!ryou1))) debugRemove(parentEle);
          //          if ((cppLimit[2] > 0 && pass2 == 0) || (cppLimit[2] > 0 && (!ryou))) debugRemove(parentEle);
        },
      },

      // -----------------------------------------------------
      {
        is: 'AMAZON', // amazon:: ama::
        urlRE: 'amazon.co',
        //priceXPath: '//span/span[1]/span/a[@class="a-button-text" and @id="a-autoid-5-announce"]/span[contains(text(),"￥")]|.//span[@class="a-color-base"]/span[@class="a-size-base a-color-price a-color-price"]|.//a/span[@class="a-price"]/span[@aria-hidden="true"]/span[@class="a-price-whole" and contains(text(),"￥")]|.//span[@class="a-price a-text-price a-size-medium apexPriceToPay" and @data-a-size="b"]/span[2]|.//div[@class="a-section a-spacing-none aok-align-center"]/span[@data-a-color="base"]/span/span[@class="a-price-whole"]|.//span[@class="a-price-whole"]|.//td/span[@id="snsDetailPagePrice"]/span|//span[@id="priceblock_ourprice"]/span',
        priceXPath: p => elegeta('span.a-price.reinventPricePriceToPayMargin > span > span:nth-child(2) , span[class*="a-price"].a-text-price.apexPriceToPay > span[aria-hidden="true"] :visible', p).concat(elegeta('//span/span[1]/span/a[@class="a-button-text" and @id="a-autoid-5-announce"]/span[contains(text(),"￥")]|.//span[@class="a-color-base"]/span[@class="a-size-base a-color-price a-color-price"]|.//a/span[@class="a-price"]/span[@aria-hidden="true"]/span[@class="a-price-whole" and contains(text(),"￥")]|.//span[@class="a-price a-text-price a-size-medium apexPriceToPay" and @data-a-size="b"]/span[2]|.//div[@class="a-section a-spacing-none aok-align-center"]/span[@data-a-color="base"]/span/span[@class="a-price-whole"]|.//span[@class="a-price-whole"]|.//td/span[@id="snsDetailPagePrice"]/span|//span[@id="priceblock_ourprice"]/span', p)),
        pointrateXPath: `span.a-size-base.a-color-price , div#ppd div[class*="a-row"] > div[class*="a-column"].a-span12[class*="a-spacing-top-micro"] > span.a-color-price , div#points_feature_div.celwidget , span.a-size-small.sc-points:visible:text*=ポイント|pt`,

        //'//div/span[@class="a-size-base a-color-price" and contains(text(),"ポイント(")]|.//span[@class="a-color-price" and contains(text(),"pt")]|.//div/div[@id="points_feature_div"]/span[contains(@class,"a-color-price")]|.//span[@class="a-size-base a-color-price" and contains(text(),"ポイント")]|.//span[@class="a-size-base a-color-base" and contains(text(),"%)")]:visible',
        domNIDelay: 1500,
        orderPL: 5,
        listPL: 5,
        isorder: /https?:\/\/order\./,
        iscate: /category\//,
        isproduct: /\/dp\//,
        //        issearch: /amazon.*?s\?k=|amazon.*?[\?\&]keywords\=|amazon.*?[\?\&]field-keywords\=/,
        issearch: /amazon.*?s\?|amazon.*?[\?\&]keywords\=|amazon.*?[\?\&]field-keywords\=/,
        sortData: [
          { url: /^(?=.*(^(?!.*(\&rh=)).*))(?=.*(https:\/\/www.amazon.co.jp\/s\?k=))/, sortPpr: '//span[@class="ignoreMe ppr"]', sortElement: 'div.sg-col-4-of-12.s-result-item', },
          { url: /https:\/\/www.amazon.co.jp\/s\?k=.*\&rh=/, sortPpr: '//span[@class="ignoreMe ppr"]', sortElement: 'div.sg-col-4-of-12.s-result-item', },
          { url: /https:\/\/www.amazon.co.jp\/s\?k=.*\&rh=/, sortPpr: '//span[@class="ignoreMe ppr"]', sortElement: '.s-result-item.s-asin.sg-col-0-of-12.sg-col-16-of-20.sg-col.s-widget-spacing-small.sg-col-12-of-16', }
        ],
        onLoad: () => {
          const rerun = () => {
            if (!GF?.rerun) GF.rerun = setTimeout(() => {
              GF.rerun = null;
              ["appm", "kangengo", "ppr", "ppr2"].forEach(v => {
                elegeta('*').filter(e => e.dataset[v]).forEach(e => delete e.dataset[v]);
              })
              $('.kangengo , .ppr , .ppr2').remove()
              //              elegeta('*[data-appm="c"]').forEach(e=>delete e.dataset.appm);
              run() //run0()
            }, 3333)
          }

          //          if (ld("amazon")) window.addEventListener("message", e => { if (typeof e?.data == "string" && e?.data?.match(/\"asin\"/)) setTimeout(() => run0(), 999) }) // 商品変更したら再実行
          if (ld("amazon")) window.addEventListener("message", e => { if (typeof e?.data == "string" && e?.data?.match(/\"asin\"/)) rerun() }) // 商品変更したら再実行
          // 単発←→定期便切り替えの安全確実な検出方法は分からないのでやらない
          if (ld("amazon")) window.addEventListener("mousedown", e => { if (e?.target?.matches('i.a-icon.a-accordion-radio')) rerun() }, true) // 商品変更したら再実行


        },
        onEachItem: (node, titleEle, rndcolor) => {},
        pointFunc: (parentEle, price, priceEle, rndcolor, tp, shipping = 0) => {
          var point = 0;
          var pointEle = elegeta(SITE.pointrateXPath, parentEle).filter(e => e.offsetHeight && !(tp.excludeWhenClosestIs && e.closest(tp.excludeWhenClosestIs)))[0]
          //var coupon=Number(eleget0('span.s-coupon-unclipped > span.s-highlighted-text-padding',parentEle)?.textContent?.replace(/[^0-9]/gm,"")||0)
          //var couponEle=eleget0('span.s-coupon-unclipped > span.s-highlighted-text-padding , label[id*="couponTextpctch"]',parentEle)?.textContent
          var couponEle = eleget0('span.s-coupon-unclipped > span.s-highlighted-text-padding , label[id*="couponTextpctch"]:visible', parentEle)
          var couponTC = couponEle?.textContent //　％オフ
          var couponPercent = 0
          var couponYen = 0;
          couponPercent = (couponTC?.match(/\d+% OFF/) && Number(couponTC?.match0(/\-?[0-9\,\.]+/)?.replace(/\,/g, "")) || 0) || (lh(/\/dp\/|\/gp\//) && +document.body.textContent.match0(/(\d+)\%\s*OFFクーポンの適用\s*規約/)) || 0;
          //          couponYen = (!couponTC?.match(/\d+% OFF/) && Number(couponTC?.match0(/\-?[0-9\,\.]+/)?.replace(/\,/g, "")) || 0) || (lh(/\/dp\/|\/gp\//) && +document.body.textContent.match0(/(\d+)\s*OFFクーポンの適用\s*規約/)) || 0;
          couponYen = (!couponTC?.match(/\d+% OFF|\dで購入可能/) && Number(couponTC?.match0(/\-?[0-9\,\.]+/)?.replace(/\,/g, "")) || 0) || (lh(/\/dp\/|\/gp\//) && +document.body.textContent.match0(/(\d+)\s*OFFクーポンの適用\s*規約/)) || 0;
          if ((couponTC?.match(/\dで購入可能/))) couponYen = price - Number(couponTC?.match0(/\-?[0-9\,\.]+/)?.replace(/\,/g, "")) || 0;
          if (couponPercent || couponYen) debugEle(couponEle, rndcolor);
          var pointPer = 0;
          if (pointEle || couponYen || couponPercent || shipping) {
            var pointtext = pointEle?.textContent?.replace(/\d+ポイント|\,/g, "") || "0";
            if (pointtext?.match(/([0-9]+)\%/)) {
              debugEle(pointEle, rndcolor);
              var pointPer = Number(pointtext?.match(/([0-9,]+)%/)[1] / 100);
            }
            if (pointPer || couponYen || couponPercent || shipping) {
              //dt(pointPer , couponYen , couponPercent , shipping)
              var point = USE_YODOBASHI_METHOD_IN_AMAZON ? Math.floor(price - (price * (price / (price + price * pointPer)))) : Number(price * pointPer);
              //point += (price * couponPercent / 100)
              var pricef = Math.round(price + shipping - point - couponYen - (price * couponPercent / 100)).toLocaleString();
              //      if (enableBeta) { $(`<span class='ignoreMe' style='background-color:#fff0f0;${USE_YODOBASHI_METHOD_IN_AMAZON?"color:#f00;font-weight:blod;":"color:#000;"}font-size:min(75%,15px);' title='ポイント率：${pointPer}\nポイント：${point}'>` + "（還元後：" + "￥" + pricef.toLocaleString() + "）</span>").appendTo(priceEle) }

              if (enableBeta && !parentEle?.dataset?.kangengo) {
                $(`<span class='ignoreMe kangengo' style='background-color:#fff0f0;${USE_YODOBASHI_METHOD_IN_AMAZON?"color:#f00;font-weight:bold;":"color:#000;"}font-size:min(75%,15px);' title='ポイント率：${pointPer*100}％\nポイント：${point}\nクーポン率：${couponPercent}％\nクーポン：￥${couponYen}\n送料：￥${shipping}'>` + "（還元後：" + "￥" + pricef?.toLocaleString() + "）</span>").appendTo(priceEle);
                parentEle.dataset.kangengo = 1
              }
            }
          } //else { var point = -1; }
          return point;
        },
        onRun: (node, cppLimit) => {
          //if(Math.random()>0.5) $('.s-line-clamp-4').css({ '-webkit-line-clamp': '8' }); // 商品名の最大行数を拡大
          var titleParentlevelXpathSet = [ // todo:titleとpriceのセットにする
            //            { b: '.a-section.a-spacing-base', t: 'a.a-link-normal.a-text-normal > h2.a-size-base-plus.a-spacing-none > span' }, // 4列検索結果
            //            { b: '.a-section.a-spacing-base', t: 'a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal>span.a-size-medium.a-color-base.a-text-normal' }, // 4列検索結果
            //            { b: '.a-section.a-spacing-base', t: 'a>span.a-size-base.a-color-base.a-text-normal' }, // 4列検索結果
            //            { b: '.s-result-item.s-asin.sg-col-0-of-12.sg-col-16-of-20.sg-col.s-widget-spacing-small.sg-col-12-of-16', t: 'a.a-link-normal.s-line-clamp-2.s-link-style > h2.a-size-medium.a-spacing-none[class*="a-color-base"] > span' }, // 1列検索結果
            //            { b: '.s-result-item.s-asin.sg-col-0-of-12.sg-col-16-of-20.sg-col.s-widget-spacing-small.sg-col-12-of-16', t: 'a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal>span.a-size-medium.a-color-base.a-text-normal' }, // 1列検索結果
            //            { b: '.s-result-item.s-asin.sg-col-0-of-12.sg-col-16-of-20.sg-col.s-widget-spacing-small.sg-col-12-of-16', t: 'a>span.a-size-base.a-color-base.a-text-normal' }, // 1列検索結果
            { b: '#dp-container:not(.a-carousel-col *)', t: 'span#productTitle', excludeWhenClosestIs: '.a-carousel-col' }, // /dp/詳細画面のタイトル
            { b: 'div.s-result-item.s-asin', t: 'h2[class*="a-color-base"].a-text-normal > span', excludeWhenClosestIs: '.a-carousel-col' }, // primeday? 2025.07
            { b: 'div.sc-list-item-content', t: 'span.a-truncate.sc-grid-item-product-title.a-size-base-plus', excludeWhenClosestIs: '.a-carousel-col' }, // primeday? 2025.07
          ];
          //let boxe=titleParentlevelXpathSet.map(v=>elegeta(v.b).filter(e=>!tpDone.has(e)))
          titleParentlevelXpathSet.forEach(tp => elegeta(tp.t).forEach(e => { e.title = e?.innerText; })) // 商品名にホバーで全行表示する

          //Math.random() > 0.5 && addstyle.add('.s-line-clamp-2 { -webkit-line-clamp: none; max-height: 9em; text-align: initial; display: inline !important; } .s-line-clamp-1, .s-line-clamp-2, .s-line-clamp-3, .s-line-clamp-4, .s-line-clamp-5 { -webkit-box-orient: initial; }') // タイトルを…で省略させない

          let isbookDesc = eleget0('//div/div[@data-category="books"]|//span[@class="nav-a-content" and contains(text(),"Kindle本")]|//a/span[@class="nav-a-content" and @text="本"]')
          let titleEleA = [];
          //console.log(elegeta(titleParentlevelXpathSet).map(v => elegeta(v.b||"").map(b => ([ v.b , elegeta(v.t||"" , b).length] ) ) ) )
          for (let tp of titleParentlevelXpathSet) {
            for (let box of elegeta(tp.b, document)) {
              for (let titleEle of elegeta(tp.t, box)) {
                let seido = 100;
                if (titleEle.dataset.appm == "c") { continue; } else { titleEle.dataset.appm = "c"; }
                var rndcolor = makeRndColor(); // var rndcolor = '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
                debugEle(titleEle, rndcolor, tp.t);
                var title = num(titleEle.textContent);
                //本の詳細ならページ単価
                if (isbookDesc) {
                  dc("is本詳細ページ")
                  let qu = eleget0('//ul[@class="a-unordered-list a-nostyle a-vertical a-spacing-none detail-bullet-list"]/li/span/span[contains(text(),"ページ")]')?.textContent || ""
                  if (qu) {
                    title = qu;
                    dc(qu)
                  }
                }

                var parentEle = box //titleEle.closest('#dp-container>#ppd') || eleget0('./ancestor::div[contains(@class,"sg-col-4-of-12 s-result-item")]', titleEle);
                debugEle(parentEle, rndcolor);
                var pointEle = elegeta(SITE.pointrateXPath, parentEle).filter(e => e.offsetHeight && !(tp.excludeWhenClosestIs && e.closest(tp.excludeWhenClosestIs)))[0]
                debugEle(pointEle, rndcolor);
                var pass1 = 0;

                var ryou = title.replace(/\,/gm, "").match(/\D?([0-9\.]+)\s?(mAh|ルーメン|lm|LM|ページ|mg|mcg|g|G|ml|ミリリットル|mL|ml|GB)|(?:[^A-Z0-9\.\-])([0-9\.]+)\s?(L(?![bmM])|kg|㎏|Kg|ｋｇ|キロ|TB|リットル)/); // 1,200 gのように数字と単位の間に1つのスペースを許容

                //var sFree = [elegeta('span[data-csa-c-mir-type="DELIVERY"][data-csa-c-mir-sub-type="CONDITIONALLY_FREE"] > a:nth-of-type(1):visible', parentEle), elegeta('//div[@class="a-spacing-base"]/a[@target="AmazonHelp" and contains(text(),"無料配送")]|.//span[@data-csa-c-type="element" and @data-csa-c-delivery-price="無料"]|.//div/div[@class="a-section"]/div/div/span/a[@rel="noopener" and text()="無料配送"]:visible', parentEle)].flat().filter(e => !(tp.excludeWhenClosestIs && e.closest(tp.excludeWhenClosestIs)))[0]
                var sFree = [elegeta('span[data-csa-c-mir-type="DELIVERY"][data-csa-c-mir-sub-type="CONDITIONALLY_FREE"] > a:nth-of-type(1):visible', parentEle), elegeta('span[data-csa-c-mir-type="DELIVERY"][data-csa-c-mir-variant="NON_THRESHOLD"] , div > div > span[data-csa-c-type="element"][data-csa-c-delivery-price="無料"]:visible:text*=無料配送', parentEle)].flat().filter(e => !(tp.excludeWhenClosestIs && e.closest(tp.excludeWhenClosestIs)))[0];

                var sCharge = [elegeta('span[data-csa-c-delivery-benefit-program-id="paid_shipping"]', parentEle), elegeta('span.a-color-base , div > div.a-row:nth-child(2) > div , span[data-csa-c-delivery-benefit-program-id="scheduled_delivery"] , span[data-csa-c-delivery-price="料 ¥"]:text*=配送料 ￥|配送料 ¥', parentEle)].flat().filter(e => !(tp.excludeWhenClosestIs && e.closest(tp.excludeWhenClosestIs)))[0]
                var shippingEle = !sFree && sCharge
                debugEle(sFree || sCharge, rndcolor)

                //                var priceEle = elegeta(SITE.priceXPath + ":visible", parentEle).filter(e => !(tp.excludeWhenClosestIs && e.closest(tp.excludeWhenClosestIs)))[0]
                var priceEle = elegeta(SITE.priceXPath, parentEle).filter(e => e?.offsetHeight && !(tp.excludeWhenClosestIs && e.closest(tp.excludeWhenClosestIs)))[0]
                //var ryou=undefined,ryout=0,mul=0;
                var [ryout, mul] = [0, 0];

                debugEle(priceEle, rndcolor);
                if (priceEle) {
                  var shipping = shippingEle ? Number(shippingEle.innerText.match0(/[0-9,]+/)?.replace(/\\|￥|\,/g, "")) || 0 : 0
                  var price = priceEle ? Number(priceEle.innerText.match0(/[0-9,]+/)?.replace(/\\|￥|\,/g, "")) || 0 : 0 //Number(priceEle.textContent.replace(/[^0-9]/g, ""));
                  var point = SITE.pointFunc(parentEle, price, priceEle, rndcolor, tp, shipping);

                  // type1
                  if (title.match(/クッキングシート/)) var ryou = title.replace(/\,/gm, "").match(/\D([0-9\.]+)(m|g|G|枚|粒|錠|包|杯|本|個|袋|GB|ペア|組|P|日分|ヶ入|組入|ポート|色|日分|ヶ入|食|巻|入|セット|缶|函)|(?:[^A-Z0-9\.\-])([0-9\.]+)(L(?!b)|kg|㎏|Kg|KG|ｋｇ|キロ|TB)/);
                  if (title.match(/ケーブル/)) var ryou = title.replace(/\,/gm, "").match(/\D([0-9\.]+)(枚|粒|錠|包|杯|本|個|袋|ペア|組|P|日分|ヶ入|組入|ポート|色|日分|ヶ入|食|巻|入|セット|缶|函)/);
                  if (title.match0(/テープ|マスカー/) && title.match0(/[×X][\d\.]+m|[\d\.]+m巻/i)) var ryou = (title.match(/[×X]([\d\.]+)(m)|×([\d\.]+)(km)/i) ?? title.match(/([\d\.]+)(m巻)|([\d\.]+)(km巻)/i));
                  if (ryou) {
                    var ryout = Number(ryou[1]) || Number(ryou[3]) * (1000);
                    if (ryou[4]) { ryou[4] = ryou[4].replace(/kg|㎏|Kg|KG|ｋｇ|キロ/, "g").replace(/L(?![BM])/, "ml").replace(/TB/, "GB"); }
                    if (!title.match(/PCI\-?e|NVMe|SSD.*Gen\s*\d/i) && title.match(/×[0-9\.\,]+/m) && !(title.match(/[\(（\[【].*×.*[\)）\]】]/m)) && !(title.match(/×[\d\s\.]*(cm|mm|g|m|km)/i))) { ryout *= Number(title.match(/×([0-9\.\,]+)/)[1]); }
                    if (title.match(/mg.+[0-9\.\,]+(粒|錠|カプセル)/m)) {
                      ryout *= Number(title.match(/([0-9\.\,]+)(粒|錠|カプセル)/)[1]);
                      seido = 10000;
                    }
                    var mul = 1;
                    if (point) { var priceEle = elegeta(SITE.priceXPath, parentEle)?.[0]; if (priceEle) { priceEle.dataset["ppr"] = Number(price + shipping - (point || 0)); } }
                    var ppr = Math.round(seido * (price + shipping - point) / Number(ryout * mul)) / seido;

                    var pprEmbed = (price + shipping - point) / Number(ryout * mul);
                    var pprEmbedAligned = pprEmbed
                    if (ryou[2]?.match(/mg/i)) pprEmbedAligned = (price + shipping - point) / Number(ryout * mul / 1000)
                    if (ryou[2]?.match(/mcg|μg/i)) pprEmbedAligned = (price + shipping - point) / Number(ryout * mul / 1000 / 1000)

                    var ele = $(`<span class="ignoreMe ppr" data-ppr="${ pprEmbedAligned }" style="background-color:#${shipping?"60a090":"6080b0"};">￥${ ppr}/${(ryou[2] || ryou[4]) }</span>`).insertAfter(titleEle.parentNode.parentNode);
                    if ((!isproduct) && (!isorder)) {
                      $(ele).css("cursor", "pointer").attr("title", `(\\${+ (Math.round(price - point)) }+\\${+ shipping})/${ + Number(ryout * mul) + (ryou[2] || ryou[4]) }=${ pprEmbed }\nクリックかShift+Aでこの量単価の上限で絞り込む\n右クリックかAキーで量単価で並べ替え`);
                    } else {
                      $(ele).attr("title", "(\\" + (Math.round(price - point)) + "+\\" + shipping + ")/" + Number(ryout * mul) + (ryou[2] || ryou[4]) + "=" + pprEmbed + "\n");
                    }
                    if (cppLimit[1] > 0 && (!priceEle || !ryou || (ppr && cppLimit[1] < ppr))) debugRemove(parentEle?.closest('div.s-asin[data-asin]') || parentEle); // ancest
                  }
                  //if (price && priceLimit && price > priceLimit) debugRemove(parentEle?.closest('div.s-asin[data-asin]') || parentEle); // ancest

                  // type2
                  var pass2 = 0;
                  let ryou1 = ryou;
                  let ryout1 = ryout;
                  var ryou = title.replace(/\,/g, "").match(/\D([0-9\.]+)(点|pcs|枚|粒|錠|包|杯|回分|回用|袋|冊|袋|枚|粒|錠|包|杯|組入|ポート|色|日分|ヶ入|食|回分|回用|巻|カプセル|入|セット|缶|函|ペア|組|P|日分|ヶ入|組入|ポート|色|日分|ヶ入|食|巻|入|セット|缶|函|(Pack|枚|タブレット|カプセル|個|錠|ベジタリアンカプセル|ベジタブルカプセル|植物性カプセル|Vegan.*Caps|Softgel.*Capsule|ベジ.*キャップ|ジェルキャップ|液.*ジェル|ソフトゲル|ビーガンタブレット|ゼラチンカプセル|ベジソフトジェル|カプセル|粒|チュアブル錠|ソフトゼリー|ティーバック|ティーバッグ|袋|Softgels|ソフトジェル|Chewable Tablets|錠|Tablets|グミ|Vegan Gummies|ロゼンジ|植物性液体フィトカプセル|Vegetarian Food-Based Tablets|Caples|Capsules|Mini Soft Gels|Tri-Layered Tablets|Gummies|Wipes|Tea Bags|Fish Gelatin Softgel|Chewables|Animal-Shaped Tablets|VegCaps|Vegetarian Gummies|Rapid Release Liquid Softgels|Bears|Wafers|Liquid Soft-Gels|Caplets|Organic Gummies|Penguin Chewables|Coated Caplets|Vegetarian Softgels|Mini-Tablets|Lozenges|Vegetarian Lozenges|Micro Tablets|Lozenge|(?:ベジ|Vegetarian|Vegan|Vegetable|Veggie|Vegi|Veg)[\s\-]*(?:カプセル|キャップ|Capsules|Caps|Tablets|Softgels)|(?:Quick(?: Release| Dissolve)?)[\s\-]*(?:Melts|Tablets|Softgels|Capsules)))/) || title.replace(/\,/g, "").match(/\D([0-9\.]+)(枚|粒|錠|包|杯|本|回分|回用|個|袋|冊|袋|枚|粒|錠|包|杯|本|個|袋|組入|ポート|色|日分|ヶ入|食|回分|回用|巻|カプセル|入|セット|缶|函|ペア|組|P|日分|ヶ入|組入|ポート|色|日分|ヶ入|食|巻|入|セット|缶|函|(Pack|枚|タブレット|カプセル|個|錠|ベジタリアンカプセル|ベジタブルカプセル|植物性カプセル|Vegan.*Caps|Softgel.*Capsule|ベジ.*キャップ|ジェルキャップ|液.*ジェル|ソフトゲル|ビーガンタブレット|ゼラチンカプセル|ベジソフトジェル|カプセル|粒|チュアブル錠|ソフトゼリー|ティーバック|ティーバッグ|袋|Softgels|ソフトジェル|Chewable Tablets|錠|Tablets|グミ|Vegan Gummies|ロゼンジ|植物性液体フィトカプセル|Vegetarian Food-Based Tablets|Caples|Capsules|Mini Soft Gels|Tri-Layered Tablets|Gummies|Wipes|Tea Bags|Fish Gelatin Softgel|Chewables|Animal-Shaped Tablets|VegCaps|Vegetarian Gummies|Rapid Release Liquid Softgels|Bears|Wafers|Liquid Soft-Gels|Caplets|Organic Gummies|Penguin Chewables|Coated Caplets|Vegetarian Softgels|Mini-Tablets|Lozenges|Vegetarian Lozenges|Micro Tablets|Lozenge|(?:ベジ|Vegetarian|Vegan|Vegetable|Veggie|Vegi|Veg)[\s\-]*(?:カプセル|キャップ|Capsules|Caps|Tablets|Softgels)|(?:Quick(?: Release| Dissolve)?)[\s\-]*(?:Melts|Tablets|Softgels|Capsules)))/);
                  //var ryou = title.replace(/\,/g, "").match(/\D([0-9\.]+)(枚|粒|錠|包|杯|本|回分|回用|個|袋|冊|袋|枚|粒|錠|包|杯|本|個|袋|組入|ポート|色|日分|ヶ入|食|回分|回用|巻(入|セット|缶|函|ペア|組|P|日分|ヶ入|組入|ポート|色|日分|ヶ入|食|巻|入|セット|缶|函|カプセル))/);
                  if (ryou && (ryou[1] > 0 || ryou[3] > 0)) {
                    if (ryou[4]) ryou[4] = ryou[4].replace(/kg|㎏|Kg/, "g").replace(/L/, "ml").replace(/TB/, "GB");
                    var ryout = Number(ryou[1]) || Number(ryou[3]) * 1000;
                    var mul = 1; //(title.match(/×[0-9\.\,]+/m) && !(title.match(/[\(（\[].*×.*[\)）\]]/m)) && !(title.match(/×[\d\s]*(cm|mm)/)))?Number(title.match(/×([0-9\.\,]+)/)[1]):1;

                    if (point > -1) {
                      //                      var ppr2 = Math.round(100 * (price - point) / Number(ryout * mul)) / 100;
                      var ppr2 = Math.round(100 * (price + shipping - point) / Number(ryout * mul)) / 100;
                      var pprEmbed = (price + shipping - point) / Number(ryout * mul);
                      var pprEmbedAligned = pprEmbed
                      if (ryou[2]?.match(/mg/i)) pprEmbedAligned = (price + shipping - point) / Number(ryout * mul / 1000)
                      if (ryou[2]?.match(/mcg|μg/i)) pprEmbedAligned = (price + shipping - point) / Number(ryout * mul / 1000 / 1000)

                      var ele = $(`<span class="ignoreMe ppr2" data-ppr="${ pprEmbedAligned }" style="background-color:#${shipping?"60a090":"6080b0"};">￥${ ppr2}/${(ryou[2] || ryou[4]) }</span>`).insertAfter(titleEle.parentNode.parentNode);
                      if ((!isproduct) && (!isorder)) {} else {
                        $(ele).attr("title", "(\\" + (Math.round(price - point)) + "+\\" + shipping + ")/" + Number(ryout * mul) + (ryou[2] || ryou[4]) + "=" + pprEmbed + "\n" + "クリックかShift+Bでこの量単価の上限で絞り込む").click(e => inputcpplimit(e, 2, ppr2));
                      }
                      if (cppLimit[2] > 0 && (!priceEle || !ryou || (ppr2 && cppLimit[2] < ppr2))) debugRemove(parentEle?.closest('div.s-asin[data-asin]') || parentEle); // ancest
                      pass2 = ((iscate || issearch) && cppLimit[2] && ppr2 <= cppLimit[2]) ? 1 : 0;
                    }
                  }

                  // type3 MGO
                  let ryout2 = ryout1;
                  if (title.match(/マヌカ|manuka/) && ryout2) {
                    var ryout = title?.match0(/MGO?\s*(\d+)/i)
                    if (ryout) {
                      $('.ppr2', parentEle).remove()
                      seido = 10000;
                      var ppr = Math.round(seido * (price + shipping - point) / Number(ryout * ryout2)) / seido;
                      var pprEmbed = (price + shipping - point) / Number(ryout * ryout2);
                      var pprEmbedAligned = pprEmbed
                      var ele = $(`<span class="ignoreMe ppr2" data-ppr="${ pprEmbedAligned }" style="background-color:#${shipping?"60a090":"6080b0"};">￥${ ppr}/MGO</span>`).insertAfter(titleEle.parentNode.parentNode);
                      $(ele).attr("title", `(${ Math.round(price - point)} +￥${ shipping } )/ (${ryout}*${ryout2}=${ + Number(ryout * ryout2)})=${ pprEmbed }\n`);
                      if (cppLimit[1] > 0 && (!priceEle || !ryou || (ppr && cppLimit[1] < ppr))) debugRemove(parentEle?.closest('div.s-asin[data-asin]') || parentEle); // ancest
                    }
                  }

                }
                //if ((cppLimit[1] > 0 && pass1 == 0) || (cppLimit[1] > 0 && (!ryou1))) debugRemove(parentEle);
                //if ((cppLimit[2] > 0 && pass2 == 0) || (cppLimit[2] > 0 && (!ryou))) debugRemove(parentEle);

                //              if (cppLimit[1] > 0 && (!priceEle || !ryou || (ppr && cppLimit[1] < ppr))) debugRemove(parentEle); // ancest
              }

              // 出荷元：Amazonか？ 9::
              if ((GF.shukkaamazon || GUESS_SHIPPING_AMAZON) && !box?.dataset?.amaship) {
                box.dataset.amaship = 1;
                var e = box;
                let ah = 0;
                if (eleget0('div.a-color-base:nth-child(3) > div.a-column.a-span12:text*=最も早い', e)) ah += 0.1;
                if (eleget0('div.a-row > span:text*=定期おトク便', e)) ah += 0.2;
                //if (setAH.has(eleget0('div > div[class*="a-row"].udm-primary-delivery-message > div:text*=にお届け', e)?.textContent)) ah = +0.1;
                if (eleget0('div.udm-delivery-block > div[class*="a-row"].udm-primary-delivery-message > div:text*=配送.*初回のご注文の場合|Amazonが発送する商品を', e)) ah += 0.5;
                if (eleget0('span:text*=Prime Try Before You Buy', e)) ah += 1;
                if (eleget0('div[class*="a-row"].a-size-base > div:nth-child(2) > span:text*=【まとめトク】', e)) ah += 0.5;
                if (eleget0('div.aok-block:text*=の中小企業', e)) ah -= 0.1;
                if (eleget0('span.a-color-base , span.a-color-base:text*=通常配送料無料', e)) ah += 0.5;
                if (eleget0('span > span.a-color-base:text*=Amazon発送の商品.*以上注文で送料無料', e)) ah += 0.5;
                //if (eleget0('span[id*="DEAL"]:text*=プライムデー先行セール', e)) ah += 0.1; // 2025.07
                //if (eleget0('i.a-icon.a-icon-prime.a-icon-medium', e)) ah += 0.1;
                addstyle.add(`div.a-spacing-small.puis-padding-left-small , div.a-section.a-spacing-base.a-text-center { position: relative; } .shukkaamazon{bottom:0em;right:0;position:absolute; z-index:99; font-weight:900; background:#0f1111; padding:0 0.3em;  color:#fff; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none;}`);
                (ah > 0 ? end(eleget0('div.a-spacing-small.puis-padding-left-small , div.a-section.a-spacing-base.a-text-center', box) || box, `<span class="ignoreMe shukkaamazon">A<span style="color:#F69931 !important;">送</span>?</span>`) : 0);
              }
              let v = box?.closest("div.s-asin");
              if (v) {
                if (GF.shukkaamazon == 0) gmhbShow(v, 'yodoShukkaamazon');
                if (GF.shukkaamazon == 1) eleget0('.shukkaamazon', v) ? gmhbShow(v, 'yodoShukkaamazon') : gmhbHide(v, 'yodoShukkaamazon');
                if (GF.shukkaamazon == 2) !eleget0('.shukkaamazon', v) ? gmhbShow(v, 'yodoShukkaamazon') : gmhbHide(v, 'yodoShukkaamazon');
              }

              // 検索結果の重複商品をuniq
              let dup = new Map();
              let removed = new Set();
              elegeta('.s-result-item[data-asin][role="listitem"]:visible').forEach(e => {
                let asin = e?.dataset?.asin;
                if (asin) {
                  let org = dup.get(asin);
                  if (org) {
                    //let rem=after(e,`<div style="cursor:pointer; display:inline-block;">重複<br>${asin}</span>`);
                    if (AMAZON_REMOVE_DUPLICATED == 2) e?.remove();
                    else if (AMAZON_REMOVE_DUPLICATED == 1) {
                      addstyle.add(".dupItem {outline:4px dashed #0008; opacity:0.5;}")
                      e?.classList.add("dupItem")
                    }
                    removed.add(asin)
                  }
                  dup.set(asin, e)
                }
              })
              if (removed.size) popup3(`重複商品：\n${[...removed].join("\n")}\n${AMAZON_REMOVE_DUPLICATED==2?"を削除":"がありました"}`, 1, 10000)

            }
          }
        },
      },

      // -----------------------------------------------------

      {
        /*        is: () => lh('//secure.iherb.com/'), // 2025.05
        title: n => eleget0('a.sc-dtLLSn > div', n),
        box: n => elegeta('div.dUCVvB', n),
        price: n => eleget0n('div.sc-WZYut.iivgnA', n),
        dni: 555,
*/

        is: 'IHERB', // iherb::
        /*        urlRE: 'jp.iherb.com/',
                titleXPath: '//a[@class="absolute-link product-link"]|.//section[3]/div[@id="product-summary-header"]/h1|//section/div/div[@id="name"]|.//h1[@id="name"]',
                priceXPath: n => eleget0('//label[1]/section[@data-pricing="" and @class="pricing-special "]/section/div[contains(@class,"row")]/div[contains(@class,"price")]/div/b|//div[@id="price"]/div[contains(@class,"price-inner-text")]/p|.//div/div[@class="price-container discount-price"]/b:visible', n) || eleget0('//span[@class="price "]/bdi|.//span[@class="price discount-red"]/bdi|.//label[1]/section/section/div[@class="row"]/div[last()]/div[@class="price-inner-text"]/p|.//div/div[@id="price"]/div[2]/p', n) || eleget0('label.purchase-option-one-time.selected > section > section:nth-child(1) > div.defer-flex > div#price.price > div > p:visible'),
                close: () => { return '.product-cell-container,div.product-detail-container.ga-product.clearfix,div.product-card.product.ga-product , section.product-summary-main' },
          */
        domNIDelay: 333,
        urlRE: /^https:\/\/secure\.iherb\.com\/myaccount\/orderdetails|jp\.iherb\.com\/|^https\:\/\/secure\.iherb\.com\/myaccount\/subscription|^https:\/\/checkout\d+\.iherb\.com\/cart$/, //'jp.iherb.com/',
        //        titleXPath: '//a[@class="absolute-link product-link"]|.//section[3]/div[@id="product-summary-header"]/h1|//section/div/div[@id="name"]|.//h1[@id="name"] | .//div[contains(@class,"info")]/a',
        //titleXPath: '//a[@class="absolute-link product-link"]|.//section[3]/div[@id="product-summary-header"]/h1|//section/div/div[@id="name"]|.//h1[@id="name"] | .//div[contains(@class,"info")]/a | .//div[@class="sc-iemWCZ bMQGWp"] | .//a[contains(@class,"sc-jNnpgg jIfccS")] | .//div[contains(@class,"muiltr-i4wlab ex5jtko1")]',
        titleXPath: 'a.absolute-link.product-link , h1#name , div.sc-iemWCZ.bMQGWp , div.line-items > div.line-item > div.info > a , div > a[data-qa-element="product-item-title"] , div.sc-iemWCZ.bMQGWp',
        priceXPath: n => eleget0('//label[1]/section[@data-pricing="" and @class="pricing-special "]/section/div[contains(@class,"row")]/div[contains(@class,"price")]/div/b|//div[@id="price"]/div[contains(@class,"price-inner-text")]/p|.//div/div[@class="price-container discount-price"]/b:visible', n) ||
          eleget0('//span[@class="price "]/bdi|.//span[@class="price discount-red"]/bdi|.//label[1]/section/section/div[@class="row"]/div[last()]/div[@class="price-inner-text"]/p|.//div/div[@id="price"]/div[2]/p', n) ||
          eleget0('label.purchase-option-one-time.selected > section > section:nth-child(1) > div.defer-flex > div#price.price > div > p , div.original-price.save-in-cart-config.defer-flex:nth-child(2) > div#price.our-price > div.price-inner-text:visible') ||
          eleget0('//span[contains(@class,"emphasis amount")]', n) ||
          eleget0('div.price-inner-text > p', n) ||
          eleget0('div.sc-WZYut.iivgnA', n) ||
          eleget0('div.sc-khIgEk.hQhHpX , div.sc-WZYut.cflMss', n) ||
          eleget0('span.muiltr-scyimf.e1epvw5f2 , span.muiltr-1j15iyw.e1epvw5f2', n) ||
          eleget0('div.info > div:nth-child(2 of div) > span.amount', n) || // 注文詳細 単発
          eleget0('span.css-17rwpsc', n) || //  カート 2025.06
          eleget0('div.sc-fXazdy.FTwVh', n) || //  定期便おすすめ 2025.06
          //          eleget0('section.pricing > section:nth-child(1 of section) > section.original-price-config > div > span.list-price:visible , section[class*="pricing-special"] > section#product-price > div > div > div.discount-price-content > b[class*="discount-price"] , b.discount-price:visible', n) ||  //  詳細画面 2025.06
          eleget0('label.radio-container > section.pricing-wrapper > section#product-price > div[class*="strike-through-price-wrapper"].strike-through-config > div[class*="discount-price-wrapper"] > div:nth-child(1) , section.pricing > section#product-price:nth-child(1 of section#product-price) > section.show:nth-child(2) > div.list-price-content:nth-child(1 of div.list-price-content) > span , div:nth-child(1 of div) > div > div > div.product-subscription.buy-box-v2.auto-ship-v2 > label.purchase-option-one-time.radio-container.selected.one-time-second[data-ga-event-label="ARW-47684"] > section.pricing-wrapper[style="margin-left: 32px;"] > section > section > div > span.list-price:visible', n), //  詳細画面 2025.10
        //        close: () => { return '.product-cell-container,div.product-detail-container.ga-product.clearfix,div.product-card.product.ga-product , section.product-summary-main , div.line-item' },
        close: () => { return '.product-cell-container,div.product-detail-container.ga-product.clearfix,div.product-card.product.ga-product , section.product-summary-main , div.line-item , div.dUCVvB , div.sc-iTVJFM.oxVOu , div.muiltr-15p3nqf > div , div > div.css-io6bf4 > div , div.sc-jffHpj.hYBHDF' },

        orderPL: 5,
        listPL: 6,
        isorder: /https?:\/\/order\.|https:\/\/checkout\d+\.iherb\.com\/cart/,
        iscate: /category\/|\/c\/|\/specials|\/trial-pricing/,
        isproduct: /\/pr\//,
        issearch: /search|subscription/,
        sortData: [
          { url: /https:\/\/jp.iherb.com\/search\?kw\=|https:\/\/jp.iherb.com\/c\//, sortPpr: '//span[@class="ignoreMe ppr2"]', sortElement: '.product-cell-container', },
          { url: /https:\/\/jp.iherb.com\/search\?kw\=|https:\/\/jp.iherb.com\/c\//, sortPpr: '//span[@class="ignoreMe ppr"]', sortElement: '.product-cell-container' }
        ],
        onLoad: () => {
          if (IHERB_EXPAND_REEL) {
            addstyle.add(`div.slick-slide {max-width:15em !important;}`)
            addstyle.add(`#pageBody { max-width: 95vw !important; }`)
          }
          addstyle.add('.dSzotL { display: block !important;} .hYBHDF { display: block !important; }') // 定期便おすすめ
          addstyle.add('.crlswz , div.muiltr-xfjzvn.ex5jtko4 { display: block !important;}')
          elegeta('span.percentage-off > bdi').forEach(e => { e.style.fontSize = `${+e?.textContent?.match0(/\d+/)*1.33+100}%` })
          lh("/pr/") && window.addEventListener("change", e => {
            lh("/pr/") && setTimeout(() => {
              $(".ppr , .ppr2").remove();
              elegeta("[data-ycpp]").forEach(e => delete e.dataset.ycpp)
              run0()
              //run()
            }, 2222);
          })

          // 空のままになってしまった？画像を埋める？ // 2025.06
          ael(document, "scroll", e => {
            elegeta('[data-image-src]:inscreen').forEach(e => {
              after(e, `<img loading="lazy" src="${e.dataset.imageSrc}">`);
              e?.remove()
            })
          }, false, 333)
        },
        onEachItem: (node, titleEle, rndcolor) => {},
        pointFunc: (parentEle, price, priceEle, rndcolor) => {},
        hide: (title, isorder, isproduct, issearch, parentEle, price, iscate, cppLimit, point, titleEle) => {
          // type1
          let seido = 100;
          var pass1 = 0;
          var ryou = title.replace(/\,/g, "").match(/\D([0-9\.]+)\s?(mg|g|ml|mL|mcg|μg)|\D([0-9\.]+)(L(?!b)|kg)/);
          let discreteUnit = /\D([0-9\.]+)\s*(Pack|枚|タブレット|カプセル|個|錠|ベジタリアンカプセル|ベジタブルカプセル|植物性カプセル|Vegan.*Caps|Softgel.*Capsule|ベジ.*キャップ|ジェルキャップ|液.*ジェル|ソフトゲル|ビーガンタブレット|ゼラチンカプセル|ベジソフトジェル|カプセル|粒|チュアブル錠|ソフトゼリー|ティーバック|ティーバッグ|袋|Softgels|ソフトジェル|Chewable Tablets|錠|Tablets|グミ|Vegan Gummies|ロゼンジ|植物性液体フィトカプセル|Vegetarian Food-Based Tablets|Caples|Capsules|Mini Soft Gels|Tri-Layered Tablets|Gummies|Wipes|Tea Bags|Fish Gelatin Softgel|Chewables|Animal-Shaped Tablets|VegCaps|Vegetarian Gummies|Rapid Release Liquid Softgels|Bears|Wafers|Liquid Soft-Gels|Caplets|Organic Gummies|Penguin Chewables|Coated Caplets|Vegetarian Softgels|Mini-Tablets|Lozenges|Vegetarian Lozenges|Micro Tablets|Lozenge|(?:ベジ|Vegetarian|Vegan|Vegetable|Veggie|Vegi|Veg)[\s\-]*(?:カプセル|キャップ|Capsules|Caps|Tablets|Softgels)|(?:Quick(?: Release| Dissolve)?)[\s\-]*(?:Melts|Tablets|Softgels|Capsules))/m;
          //let discreteUnit = /\D([0-9\.]+)\s*(Pack|枚|タブレット|カプセル|個|錠|ベジタリアンカプセル|ベジタブルカプセル|植物性カプセル|Vegan.*Caps|Softgel.*Capsule|ベジ.*キャップ|ジェルキャップ|Veggie Caps|液.*ジェル|ソフトゲル|ビーガンタブレット|ゼラチンカプセル|ベジソフトジェル|Veg Capsules|ベジカプセル|べジカプセル|カプセル|粒|ベジキャップ|チュアブル錠|ソフトゼリー|ティーバック|ティーバッグ|袋|Softgels|ソフトジェル|Chewable Tablets|錠|Tablets|グミ|Vegan Gummies|ロゼンジ|植物性液体フィトカプセル|Vegetarian Capsules|Vegetarian Food-Based Tablets|Caples|Vegi-Caps|Capsules|Mini Soft Gels|Tri-Layered Tablets|Gummies|Vegetarian Tablets|Wipes|Tea Bags|Fish Gelatin Softgel|Chewables|Animal-Shaped Tablets|VegCaps|Vegetarian Gummies|Rapid Release Liquid Softgels|Bears|Vegan Tablets|Wafers|Liquid Soft-Gels|Vegetable Caps|Caplets|Organic Gummies|Penguin Chewables|Coated Caplets|Vegetarian Softgels|Mini-Tablets|Lozenges|Vegetarian Lozenges|Micro Tablets|Lozenge)/m;

          if (ryou && (ryou[1] > 0 || ryou[3] > 0)) {
            if (ryou[4]) ryou[4] = ryou[4].replace(/kg|㎏|Kg/, "g").replace(/L/, "ml"); //.replace(/TB/, "GB");
            var ryout = Number(ryou[1]) || Number(ryou[3]) * 1000;
            var mul = (title.match(discreteUnit)) ? Number(title.match(discreteUnit)[1]) : 1;
            if (title.match(discreteUnit)) seido = 10000;
            var ppr = Math.round(seido * (price) / Number(ryout * mul)) / seido;
            var pprEmbed = (price) / Number(ryout * mul);

            var pprEmbedAligned = pprEmbed
            if (ryou[2]?.match(/mg/i)) pprEmbedAligned = (price) / Number(ryout * mul / 1000)
            if (ryou[2]?.match(/mcg|μg/i)) pprEmbedAligned = (price) / Number(ryout * mul / 1000 / 1000)
            titleEle.style.display = "inline";
            var ele = $('<span class="ignoreMe ppr" data-ppr="' + pprEmbedAligned + '" style="max-height:1.2em; position:relative;z-index:999; display:inline-block; font-weight:bold; font-size:15px;margin:0.5px 0px 0.5px 3px; text-decoration:none !important;  padding:0.03em 0.5em 0.03em 0.2em; border-radius:99px; background-color:#6080b0; color:white; white-space: nowrap;">￥' + ppr + '/' + (ryou[2] || ryou[4]) + (ppr == undefined ? ryou + "," + ryout + "," + mul : "") + '</span>').insertAfter(titleEle.parentNode);
            //ele[0].dataset.ppr = pprEmbed;
            //var ppr = Math.round(100 * (price) / Number(ryout * mul)) / 100;
            //            titleEle.style.display = "inline";
            //            var ele = $('<span class="ignoreMe ppr" data-ppr="' + pprEmbed + '" style=" position:relative;z-index:999; display:inline-block; font-weight:bold; font-size:15px;margin:0.5px 0px 0.5px 3px; text-decoration:none !important;  padding:0.03em 0.5em 0.03em 0.2em; border-radius:99px; background-color:#6080b0; color:white; white-space: nowrap; ">￥' + ppr + '/' + (ryou[2] || ryou[4]) + (ppr == undefined ? ryou + "," + ryout + "," + mul : "") + '</span>').insertAfter(titleEle.parentNode);
            if ((!isproduct) && (!isorder)) {
              setClick(ele, ppr, "\\" + (Math.round(price)) + "/" + Number(ryout * mul) + (ryou[2] || ryou[4]) + "=" + pprEmbed + "\n");
            } else {
              ele[0].title = "\\" + (Math.round(price)) + "/" + Number(ryout * mul) + (ryou[2] || ryou[4]) + "=" + pprEmbed + "\n"
            }
            pass1 = ((iscate || issearch) && cppLimit[1] && ppr <= cppLimit[1]) ? 1 : 0;
          }
          // type2
          var pass2 = 0;
          var ryou1 = ryou;
          var ryou = title.match(discreteUnit);
          if (ryou && (ryou[1] > 0)) {
            var ryout = Number(ryou[1]);
            var mul = 1;
            var ppr2 = Math.round(100 * (price) / Number(ryout * mul)) / 100;
            var pprEmbed = (price) / Number(ryout * mul)
            titleEle.style.display = "inline";
            //            var ele = $('<span class="ignoreMe ppr2" style="max-height:1.2em; position:relative;z-index:999; display:inline-block; font-weight:bold; font-size:15px;margin:0.5px 0px 0.5px 3px; text-decoration:none !important;  padding:0.03em 0.5em 0.03em 0.2em; border-radius:99px; background-color:#6080b0; color:white; white-space: nowrap; ">￥' + ppr2 + '/' + (ryou[2] || ryou[4]) + '</span>').insertAfter(titleEle.parentNode);
            var ele = $('<span class="ignoreMe ppr2" style="max-height:1.2em; position:relative;z-index:999; display:inline-block; font-weight:bold; font-size:15px;margin:0.5px 0px 0.5px 3px; text-decoration:none !important;  padding:0.03em 0.5em 0.03em 0.2em; border-radius:99px; background-color:#6080b0; color:white; white-space: nowrap; ">￥' + ppr2 + '/' + (ryou[2] || ryou[4]) + '</span>').insertAfter(titleEle.parentNode);
            ele[0].title = "\\" + (Math.round(price)) + "/" + Number(ryout * mul) + (ryou[2] || ryou[4]) + "=" + pprEmbed + "\n"
            ele[0].dataset.ppr = price / ryout * mul;
            if ((!isproduct) && (!isorder)) $(ele).css("cursor", "pointer").attr("title", ele[0].title + "\n" + "クリックかShift+Bでこの量単価の上限で絞り込む").click(e => inputcpplimit(e, 2, ppr2));
            pass2 = ((iscate || issearch) && cppLimit[2] && ppr2 <= cppLimit[2]) ? 1 : 0;
          }
          if ((cppLimit[1] > 0 && pass1 == 0) || (cppLimit[1] > 0 && (!ryou1))) debugRemove(parentEle.parentNode);
          if ((cppLimit[2] > 0 && pass2 == 0) || (cppLimit[2] > 0 && (!ryou))) debugRemove(parentEle.parentNode);
        },
      },

    ];

    // -----------------------------------------------------

    var siteinfo = SITEINFO;
    //  var siteinfo = Object.assign(SITEINFO, pref("MY_SITEINFO") || []); //alert(siteinfo);return;

    // thissiteを決定
    var thissite = null;
    for (var i = 0; i < siteinfo.length; i++) {
      if (siteinfo[i].urlRE == "") break;
      if (location.href.match(siteinfo[i].urlRE)) {
        thissite = i;
        var SITE = Object.create(siteinfo[thissite]);
        break;
      }
    }
    if (thissite === null) return;

    function sta(str, pointer = 0, y = 0, id = null) { // 右下ステータス表示
      if (id) $(`#${id}`).remove()
      return str > "" ? $(`<span ${id?`id="${id}"`:""}  class="yodotankastatus" title="ヨドバシ検索結果で量あたり単価を表示" style="${(pointer ? 'cursor:pointer; ' : '')} position: fixed; right:1em; bottom:${((y+2)* 1.6)}em; z-index:2147483647; opacity:0.66; font-size:15px; font-weight:bold; margin:0px 1px; text-decoration:none !important; text-align:center; padding:1px 6px 1px 6px; border-radius:12px; background-color:#6080ff; color:white; white-space: nowrap; ">${str}</span>`).appendTo(document.body) : "";
    }

    if (debug) sta("debug1", 0, 1);
    if (debug2) sta("debug2", 0, 2);
    let priceLimit = sessionStorage.getItem("priceLimit") || null;
    if (priceLimit) {
      /*popup3("");
      sta(`,：価格上限で絞り込み（￥${priceLimit}）`, 4)*/
    }

    var cppLimit = [0, 0];

    if (SITE.onLoad) SITE.onLoad();
    var isorder = location.href.match(SITE.isorder);
    var issearch = location.href.match(SITE.issearch);
    var iscate = location.href.match(SITE.iscate);
    var isproduct = location.href.match(SITE.isproduct);
    var parentLimit = isorder ? SITE?.orderPL : SITE?.listPL;

    function inputcpplimit(e, type, autonumber = null) {
      e.stopPropagation();
      e.preventDefault();
      var ret = proInput("量あたり価格上限を入力してください", autonumber || cppLimit[type]);
      if (ret === null || ret == cppLimit[type]) return false;
      cppLimit[type] = ret;
      sessionStorage.setItem("cppLimit" + type, cppLimit[type] || "") || 0;
      location.reload();
      return false;
    }

    ld("amazon") && document.addEventListener("keydown", e => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable || ((e.target.closest('#chat-messages,ytd-comments-header-renderer') || document.activeElement.closest('#chat-messages,ytd-comments-header-renderer')))) return;
      var key = (e.shiftKey ? "Shift+" : "") + (e.altKey ? "Alt+" : "") + (e.ctrlKey ? "Ctrl+" : "") + e.key;
      if (key == "Shift+)" && ld(/www\.amazon\.co\.jp/) && lh(/\/dp\/|\/gp\//)) { // Shift+9（商品詳細画面）::Amazon出品のものを優先して出す urlに&emi=AN1VRQENFRJN5 付け外し
        let amaShuppin = !location.href.match0(/([\?\&]smid=AN1VRQENFRJN5)/g, "")
        let nexturl = location.href.replace(/([\?\&]smid=AN1VRQENFRJN5)/g, "") + (amaShuppin ? `&smid=AN1VRQENFRJN5` : "");
        nexturl = deleteParam(nexturl, ["crid", "dib", "dib_tag", "keywords", "qid", "sprefix", "sr", "th", "__mk_ja_JP", "_encoding"])

        function deleteParam(nexturl, paras) {
          paras.forEach(v => { nexturl = nexturl.replace(new RegExp(`[\?\&]${v}=[^\?\&]+`), "") })
          return nexturl.replace(/\?/g, "\&").replace(/^([^\?]+?)\&(.*)$/, "$1?$2"); // ?より前に&が出てきたらそれは?にする
        }
        if (confirm(`Shift+9：\nAmazon出品＆発送の商品を優先的に出すURL「&smid=AN1VRQENFRJN5」を付けたり外したりします。\n\n次は、${amaShuppin?"付けます":"外します"}\n\nよろしいですか？\n\n${nexturl}`)) location.href = nexturl;
        return false
      }
    }, true)

    if (issearch || iscate) {
      cppLimit[1] = sessionStorage.getItem("cppLimit1") || 0;
      if (cppLimit[1]) $(sta("limit1(Shift+A): " + cppLimit[1], 1, 3)).appendTo(document.body).attr("title", "クリックかShift+Aでこの量単価の上限で絞り込む").click(e => inputcpplimit(e, 1));
      cppLimit[2] = sessionStorage.getItem("cppLimit2") || 0;
      if (cppLimit[2]) $(sta("limit2(Shift+B): " + cppLimit[2], 1, 4)).appendTo(document.body).attr("title", "クリックかShift+Bでこの量単価の上限で絞り込む").click(e => inputcpplimit(e, 2));
      document.addEventListener("keydown", function(e) {
          if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable || ((e.target.closest('#chat-messages,ytd-comments-header-renderer') || document.activeElement.closest('#chat-messages,ytd-comments-header-renderer')))) return;
          var key = (e.shiftKey ? "Shift+" : "") + (e.altKey ? "Alt+" : "") + (e.ctrlKey ? "Ctrl+" : "") + e.key;
          if (key == "Shift+A") inputcpplimit(e, 1); // shift+a 量価格上限a
          if (key == "Shift+B") inputcpplimit(e, 2); // shift+b 量価格上限b
          if (key == "z") { //z::レビューの★多い順
            if (lh(/iherb/) && lh(/\/c\/|\/search\?/)) {
              GF.zkey = (GF.zkey || 0) + 1
              //              sortdom(elegeta('div.product-cell-container'), v => { return +(parseFloat(eleget0('div.rating > a.stars', v)?.title.match0(/^([0-9\.]+)/) || "0"))*1000000000+ +num(eleget0('a.scroll-to[rel="noopener"] > span',v)?.textContent?.trim()?.replaceAll(/[^\d\.]/gm, "") || 0) }, 1)
              sortdom(elegeta('div.product-cell-container'), v => {
                let star = +num(eleget0('div.rating > a.stars', v)?.title.match0(/^([0-9\.]+)/) || "0") || 0;
                let wer = +num(eleget0('div > a.rating-count > span', v)?.textContent?.trim()?.replaceAll(/[^\d\.]/gm, "") || 0)
                if (GF.zkey % 2) return +star * 1000000000 + +wer || 0; // 単純に★でソート（同点なら評価人数が多い方が上）
                // 評価人数が少ないほど2に近づけて評価　★+((2-★)/人数)
                let res = (star && wer) ? +star + ((2 - star) / wer) : 0;
                return res || 0;
              }, 1)
              popup3(`z：レビューの★多い順に並べ替え（${GF.zkey%2?"シンプル":"人数考慮"}）`, 8, 5000, "bottom")
              //              popup3(`z：レビューの★多い順に並べ替え\n`, 8, 5000, "bottom")
            }
            if (lh(/amazon/)) {
              GF.zkey = (GF.zkey || 0) + 1
              lh(/amazon/) && elegeta('//div[@class="s-result-item sg-col-0-of-12 sg-col-16-of-20 s-widget sg-col s-flex-geom sg-col-12-of-16 s-widget-spacing-large"]|//div[@class="a-section a-spacing-none s-shopping-adviser s-shopping-adviser-line-clamp-ie"]').forEach(e => e.remove()) // おすすめ記事
              sortdom(elegeta('div.s-asin'), v => {
                let star = +num(eleget0('//span[contains(text(),"5つ星のうち")]', v)?.textContent?.trim()?.match(/5つ星のうち([0-9\.]+)/)?.[1]) || 0;
                let wer = +num(eleget0('a[class*="s-underline-text"][aria-label*="レーティング"] > span[class*="s-underline-text"][aria-hidden="true"]', v)?.textContent?.trim())?.replaceAll(/[^\d\.]/gm, "") || 0;
                if (GF.zkey % 2) return +star * 1000000000 + +wer || 0; // 単純に★でソート（同点なら評価人数が多い方が上）
                // 評価人数が少ないほど2に近づけて評価　★+((2-★)/人数)
                let res = (star && wer) ? +star + ((2 - star) / wer) : 0;
                return res || 0;
              }, 1)
              popup3(`z：レビューの★多い順に並べ替え（${GF.zkey%2?"シンプル":"人数考慮"}）\nこのバルーンをクリックするとさらに価格のない商品を隠します`, 8, 5000, "bottom", () => {
                elegeta('div.s-asin[data-asin]').filter(e => !eleget0('.a-price-whole', e)).forEach(e => {
                  gmDataList_add(e, "gmHideBypriceless")
                  $(e).hide(666)
                })
              })
            }
            if (lh(/yodobashi/)) {
              GF.zkey = (GF.zkey || 0) + 1;
              sortdom(elegeta('div.js_productBox'), v => {
                let star = +((parseFloat(eleget0('div.valueAvg>a', v)?.className?.match0(/rate(\d+_\d+)/)?.replace(/_/, ".")))) || 0
                let wer = +num(eleget0('//div[@class="valueAvg"]/span[@class="fs11 alignM"]/a', v)?.textContent?.trim())?.replaceAll(",", "") || 0;
                if (GF.zkey % 2) return +star * 1000000000 + +wer || 0; // 単純に★でソート（同点なら評価人数が多い方が上）
                // 評価人数が少ないほど2に近づけて評価　★+((2-★)/人数)
                let res = (star && wer) ? +star + ((2 - star) / wer) : 0;
                return res || 0;
              }, 1)
              popup3(`z：レビューの★多い順に並べ替え（${GF.zkey%2?"シンプル":"人数考慮"}）`, 8, 5000, "bottom", () => {
                elegeta('div.s-asin[data-asin]').filter(e => !eleget0('.a-price-whole', e)).forEach(e => {
                  gmDataList_add(e, "gmHideBypriceless");
                  $(e).hide(666)
                })
              })
            }
          }
          if (key == "a") { //a::
            if (lh(/amazon/)) {
              elegeta('//div[@class="s-result-item sg-col-0-of-12 sg-col-16-of-20 s-widget sg-col s-flex-geom sg-col-12-of-16 s-widget-spacing-large"]|//div[@class="a-section a-spacing-none s-shopping-adviser s-shopping-adviser-line-clamp-ie"]').forEach(e => e.remove()) // おすすめ記事
              let AVARI = 2; // 1:SI 2:個 3:値引き額 まで
              GF.sortTime = (GF?.sortTime || AVARI - 1) + 1;
              //if (SITE.sortData && location.href.match(SITE.sortUrl))

              // 値引き額
              $('.rakusa').remove()
              GF?.sortTime % AVARI == 2 && elegeta('div.s-asin[data-asin]').forEach(v => {
                let e = begin(v, `<span class="rakusa">￥${(eleget0n('.kangengo',v)||eleget0n('span.a-price-whole',v)) - (eleget0n('a[class*="a-link-normal"][class*="s-no-hover"].s-underline-link-text.s-link-style > div.a-section:text*=参考|過去',v)||(eleget0n('.kangengo',v)||eleget0n('span.a-price-whole',v))) }</span>`)
                setTimeout(e => e?.remove(), 11111, e)
              })

              SITE.sortData.forEach(e => {
                sortdom(elegeta('div.s-asin[data-asin]'), v => [() => eleget0('.ppr', v)?.dataset?.ppr, () => eleget0('.ppr2', v)?.dataset?.ppr, () => eleget0n('.rakusa', v)][GF.sortTime % AVARI]() || Number.MAX_SAFE_INTEGER, 0);
                popup3("");
                popup3(`a：量単価が安い順に並べ替え（優先グループ：${["SI","個","値引き額"][GF?.sortTime%AVARI]}）\nこのバルーンをクリックするとさらに価格のない商品を隠します`, 8, 5000, "bottom", () => {
                  elegeta('div.s-asin[data-asin]').filter(e => !eleget0('.a-price-whole', e)).forEach(e => {
                    gmhbHide(e, "priceless")
                    //gmDataList_add(e, "gmHideBypriceless");
                    //$(e).hide(666)
                  })
                })
              });
            } else if (lh(/yodobashi/)) {
              GF.sortTime = (GF?.sortTime || 1) + 1;
              SITE.sortData.forEach(e => {
                sortdom(elegeta('.srcResultItem_block'), v => { return (((eleget0(GF.sortTime % 2 ? '.ppr2' : '.ppr', v)?.dataset?.ppr))) || Number.MAX_SAFE_INTEGER }, 0)
                popup3("");
                popup3(`a：量単価が安い順に並べ替え（優先グループ：${GF?.sortTime%2?"個":"SI"}）`, 8, 5000, "bottom")
              })
            } else if (lh(/iherb/)) {
              GF.sortTime = (GF?.sortTime || 1) + 1;
              SITE.sortData.forEach(e => {
                sortdom(elegeta('div.product-cell-container.product-cell'), v => { return (((eleget0(GF.sortTime % 2 ? '.ppr2' : '.ppr', v)?.dataset?.ppr))) || Number.MAX_SAFE_INTEGER }, 0)
                popup3("");
                popup3(`a：量単価が安い順に並べ替え（優先グループ：${GF?.sortTime%2?"個":"SI"}）`, 8, 5000, "bottom")
              })
            } else {
              sortByPpr();
              //              popup3(`a：量単価が安い順に並べ替え`, 8, 5000, "bottom")
            } // 量単価小さい順で並べ替え
          }
          if (key == "Shift+Alt+A") { // Shift+Alt+A::
            e.preventDefault();
            if (lh(/\/\/www\.amazon\.co\.jp\//)) {
              GF.sortSmall = 1 - (GF?.sortSmall || 0)
              elegeta('//div[@class="s-result-item sg-col-0-of-12 sg-col-16-of-20 s-widget sg-col s-flex-geom sg-col-12-of-16 s-widget-spacing-large"]').forEach(e => e.remove()) // おすすめ記事
              if (GF.sortSmall == 1) {
                sortdom(elegeta('div.s-asin[data-asin]'), e => eleget0n('.kangengo', e) || eleget0n('.a-price-whole', e) || eleget0n('div.a-size-base.a-color-secondary > span:nth-child(2 of span):text*=￥', e), 0)
                //                sortEle(elegeta('div.s-asin[data-asin]').map(e => eleget0('.kangengo', e) ?? eleget0('.a-price-whole', e) ?? eleget0('div.a-size-base.a-color-secondary > span:nth-child(2 of span):text*=￥', e)).filter(c => c), '.s-result-item', /https:\/\/www.amazon.co.jp\/s\?k=/);
              } else {
                //                sortdom(elegeta('div.s-asin[data-asin]'), e => eleget0n('div.a-size-base.a-color-secondary > span:nth-child(2 of span):text*=￥', e) || eleget0n('.kangengo', e) || eleget0n('.a-price-whole', e), 0)
                sortdom(elegeta('div.s-asin[data-asin]'), e => [eleget0n('div.a-size-base.a-color-secondary > span:nth-child(2 of span):text*=￥', e), eleget0n('.kangengo', e), eleget0n('.a-price-whole', e)].reduce((a, v) => v && v < a ? v : a, Number.MAX_SAFE_INTEGER), 0)
                //                sortEle(elegeta('div.s-asin[data-asin]').map(e => eleget0('div.a-size-base.a-color-secondary > span:nth-child(2 of span):text*=￥', e) ?? eleget0('.a-price-whole', e)).filter(c => c), '.s-result-item', /https:\/\/www.amazon.co.jp\/s\?k=/);
              }
              popup3("");
              popup3(`Shift+Alt+A：安い順に並べ替え をしました（${GF.sortSmall?"新品":"全対象"}）\nこのバルーンをクリックするとさらに価格のない商品を隠します`, 8, 5000, "bottom", () => {
                elegeta('div.s-asin[data-asin]').filter(e => !/\\|￥/gm.test(e?.textContent)).forEach(e => {
                  //elegeta('div.s-asin[data-asin]').filter(e => !eleget0('.a-price-whole , div.a-size-base.a-color-secondary > span:nth-child(2 of span)', e)).forEach(e => {
                  gmhbHide(e, "priceless")
                  //gmDataList_add(e, "gmHideBypriceless")
                  //$(e).hide(666)
                })
              })
            }
            if (lh(/\/\/jp\.iherb\.com\//)) {
              domsort("", elegeta('.product-cell-container'), (v) => { return parseInt(eleget0('//span[@class="price "]/bdi|.//div[1]/span[@class="price discount-red"]/bdi|.//div[@id="price"]|.//div[1]/span[@class="price discount-green"]/bdi|//div[@id="price"]', v)?.innerText?.replace(/\D/g, "") || 0) }, 1)
              popup3("");
              popup3(`Shift+Alt+A：安い順に並べ替え`, 8)
            }
            if (lh(/\/\/www\.yodobashi\.com\//)) {
              //domsort("", elegeta('#listContents .pListBlock'), (v) => { return parseInt((eleget0('span.kangengo', v) || eleget0('#listContents .productPrice>span', v))?.textContent?.replace(/\D/g, "") || 0) }, 1)
              sortdom(elegeta('.srcResultItem_block'), v => { return parseInt((eleget0('span.kangengo', v) || eleget0('#listContents .productPrice>span', v))?.textContent?.replace(/\D/g, "") || 0) }, 0)
              popup3("");
              popup3(`Shift+Alt+A：安い順に並べ替え`, 8)
            }
            /*            if (ld("iherb.")) {
                          domsort("", elegeta('//div[@class="product-cell-container col-xs-12 col-sm-12 col-md-8 col-lg-6"]'), (v) => { return parseInt(eleget0('div.product-price-top', v)?.innerText?.replace(/\D/g, "") || 0) }, 1)
                          popup3("");
                          popup3(`Shift+Alt+A：安い順に並べ替え`, 8)
                        }
              */
          }
          if (key == "," && ld(/iherb/)) { // ,::価格上限で絞り込み
            priceLimit = proInput(`,：上限価格を入力してください`, priceLimit || 0) || 0; // , 価格上限
            sessionStorage.setItem("priceLimit", priceLimit || "") || 0;
            sta(priceLimit > 0 ? `,：価格上限で絞り込み（￥${priceLimit}）` : "", 0, 5, "comma")
            moq("div.product-cell-container", eles => {
              //clearTimeout(GF?.comma);
              GF.comma = setTimeout(() => {
                eles.filter(v => priceLimit != 0 && (!eleget0('div.product-price-top', v) || eleget0('div.product-price-top', v)?.textContent?.match(/([0-9,]+)/)?.[1]?.replace(/,/g, "") > priceLimit)).forEach(v => {
                  gmDataList_add(v, "gmHideByyodoComma");
                  $(v).hide(999)
                })
                eles.filter(v => priceLimit == 0 || (!(!eleget0('div.product-price-top', v) || eleget0('div.product-price-top', v)?.textContent?.match(/([0-9,]+)/)?.[1]?.replace(/,/g, "") > priceLimit))).forEach(v => { gmDataList_remove(v, "gmHideByyodoComma"); if (!gmDataList_includesPartial(v, 'gmHideBy')) $(v).show(999) })
              }, 1111)
            }, document, "comma")
            return false
          }
          if (key == "," && ld(/amazon/)) { // ,::価格上限で絞り込み
            priceLimit = proInput(`,：上限価格を入力してください`, priceLimit || 0) || 0; // , 価格上限
            sessionStorage.setItem("priceLimit", priceLimit || "") || 0;
            sta(priceLimit > 0 ? `,：価格上限で絞り込み（￥${priceLimit}）` : "", 0, 5, "comma")
            moq("div.s-asin[data-asin]", eles => {
              //clearTimeout(GF?.comma);
              GF.comma = setTimeout(() => {
                eles.filter(v => priceLimit != 0 && ((eleget0('span.ignoreMe.kangengo', v) || eleget0('.a-price-whole', v) || eleget0('div.a-spacing-small > div.a-spacing-none.a-spacing-top-mini > div.a-row.a-color-secondary > span.a-color-price', v))?.textContent?.match(/([0-9,]+)/)?.[1]?.replace(/,/g, "") > priceLimit)).forEach(v => {
                  gmDataList_add(v, "gmHideByyodoComma");
                  $(v).hide(999)
                })
                eles.filter(v => !(priceLimit != 0 && ((eleget0('span.ignoreMe.kangengo', v) || eleget0('.a-price-whole', v) || eleget0('div.a-spacing-small > div.a-spacing-none.a-spacing-top-mini > div.a-row.a-color-secondary > span.a-color-price', v))?.textContent?.match(/([0-9,]+)/)?.[1]?.replace(/,/g, "") > priceLimit))).forEach(v => {
                  gmDataList_remove(v, "gmHideByyodoComma");
                  if (!gmDataList_includesPartial(v, 'gmHideBy')) $(v).show(999)
                })
              }, 1111)
            }, document, "comma")
            return false
          }
          if (key == "9" && ld(/amazon/)) { // 9::たぶん出荷元：Amazonフィルタ
            GF.shukkaamazon = ((GF?.shukkaamazon || 0) + 1) % 3; //notify(GF.shukkaamazon)
            sta(GF.shukkaamazon > 0 ? `9：たぶん出荷元：${"無効 Amazon ほか".split(" ")[GF.shukkaamazon]}` : "", 0, 0, "shukkaamazon")
            SITE.onRun();
            return false
          }
          if (key == "Shift+)" && lh(/https:\/\/www\.amazon\.co\.jp\/s\?k=/)) { // Shift+9（検索結果画面）::Amazon出品・発送に限る urlに&emi=AN1VRQENFRJN5 付け外し
            let amashuppin = location.href.match0(/\&emi=AN1VRQENFRJN5|\&rh=p_6%3AAN1VRQENFRJN5/)
            //            let nexturl = location.href.replace(/(\&(?:__mk_ja_JP|sprefix)\=[^\&]+)/g,"").replace(/\&rh=p_6%3AAN1VRQENFRJN5/,"")
            let nexturl = location.href.replace(/(\&(?:sprefix)\=[^\&]+)/g, "").replace(/\&rh=p_6%3AAN1VRQENFRJN5/, "").replace("&dc", "")
            nexturl = amashuppin ? nexturl : nexturl + "&dc&emi=AN1VRQENFRJN5";
            if (confirm(`Shift+9：\nAmazon出品＆発送の商品だけに絞り込むURL「&emi=AN1VRQENFRJN5」を付けたり外したりします。\n\n次は、${!amashuppin?"付けます":"外します"}\n\nよろしいですか？\n\n${nexturl}`)) location.href = nexturl;
            return false
          }
          if (key == "," && ld(/yodobashi/)) { // ,::価格上限で絞り込み
            priceLimit = proInput(`,：上限価格を入力してください`, priceLimit || 0) || 0; // , 価格上限
            sessionStorage.setItem("priceLimit", priceLimit || "") || 0;
            sta(priceLimit > 0 ? `,：価格上限で絞り込み（￥${priceLimit}）` : "", 0, 5, "comma")
            moq("div.srcResultItem_block", eles => {
              //clearTimeout(GF?.comma);
              GF.comma = setTimeout(() => {
                eles.filter(v => priceLimit != 0 && ((eleget0('span.kangengo', v)?.textContent?.match(/([0-9,]+)/)?.[1]?.replace(/,/g, "") || eleget0('span.productPrice', v)?.textContent?.match(/([0-9,]+)/)?.[1]?.replace(/,/g, "")) > priceLimit)).forEach(v => {
                  gmDataList_add(v, "gmHideByyodoComma");
                  $(v).hide(999)
                })
                eles.filter(v => !(priceLimit != 0 && ((eleget0('span.kangengo', v)?.textContent?.match(/([0-9,]+)/)?.[1]?.replace(/,/g, "") || eleget0('span.productPrice', v)?.textContent?.match(/([0-9,]+)/)?.[1]?.replace(/,/g, "")) > priceLimit))).forEach(v => { gmDataList_remove(v, "gmHideByyodoComma"); if (!gmDataList_includesPartial(v, 'gmHideBy')) $(v).show(999) })
              }, 1111)
            }, document, "comma")
            return false
          }
        },
        false);
    }

    setTimeout(() => { run(document); }, document.hidden ? 0 : (SITE.domNIDelay || 100));

    if (SITE.onRun) {
      document.body.addEventListener('AutoPagerize_DOMNodeInserted', function(evt) { setTimeout(() => { run(evt.target); }, SITE.domNIDelay || 100); }, false);
    } else {
      //document.body.addEventListener('DOMNodeInserted', function(evt) { setTimeout(() => run(evt.target), SITE.domNIDelay || 300) }, false)
      //document.body.addEventListener('AutoPagerize_DOMNodeInserted', function(evt) { setTimeout(() => { run(evt.target); }, SITE.domNIDelay || 300); }, false);
      DOMNodeInserted(document.body, function(evt) { setTimeout(() => run(evt.target), SITE.domNIDelay || 300) })
    }

    /*let mo = new MutationObserver((m) => {
      let eles = [...m.filter(v => v.addedNodes).map(v => [...v.addedNodes]).filter(v => v.length)].flat().filter(v => v.nodeType === 1)
      if (eles.length){console.log(eles.length); run()}
    })
    mo?.observe(observeNode || document.body, { attributes: false, childList: true, subtree: true });*/

    return;

    function sortByPpr() { // a::
      GF.sortTime = (GF?.sortTime || 1) + 1;
      if (SITE.sortData && location.href.match(SITE.sortUrl)) SITE.sortData.forEach(e => {
        sortEle(e.sortPpr, e.sortElement, "useppr")
        popup3("");
        popup3(`a：量単価が安い順に並べ替え（優先グループ：${GF?.sortTime%2?"個":"SI"}）`, 8)
      });
      SITE.sortData.reverse()
      if (SITE.onSort) SITE.onSort()
      return;
    }

    function sortEle(xpath, close, opt = null) {
      //      let p = (typeof xpath != "string" ? xpath : elegeta(xpath)).filter(e => e.offsetHeight > 0 && e.closest(close));
      let p = (typeof xpath != "string" ? xpath : elegeta(xpath + ":visible")).filter(e => e.closest(close));
      let pele = p.map(e => e.closest(close))
      //if (debug) p.forEach(e => debugEle(e,"#f00"))//e.style.backgroundImage = "radial-gradient(#aaa,#999)")//"radial-gradient(#c7a,#329)") //" -webkit-gradient(linear, left top, right top, from(#329), to(#47a))")
      if (!p || !pele || p.length == 0 || pele.length == 0 || p.length != pele.length) return;
      pele.forEach((e, i) => {
        e.pr = opt == "useppr" && p[i].dataset.ppr ? Number(p[i].dataset.ppr) : Number(p[i]?.innerText?.replace(/\,/gm, "")?.match0(/[0-9.]+/));
        //if(debug) e.insertAdjacentHTML("beforeend", ` pr:\\${e.pr}`)
      });
      let pele2 = pele.slice();
      pele2 = pele2.sort((a, b) => { return Number(a.pr) > Number(b.pr) ? 1 : -1 });
      pele.forEach((e, i) => { e.outerHTML = pele2[i].outerHTML })
    }

    function setClick(ele, ppr, shiki = "") {
      $(ele).css("cursor", "pointer").attr("title", shiki + "クリックかShift+Aでこの量単価の上限で絞り込む\n右クリックかAキーで量単価で並べ替え").click(e => inputcpplimit(e, 1, ppr)).on("contextmenu", e => {
        sortByPpr();
        e.preventDefault();
        return false;
      });
    }

    function run(node = document.body) {
      if (!node || node.nodeName === "#text") return;
      if (node.classList && node.classList.contains("ignoreMe")) return;
      if (SITE.onRun) {
        SITE.onRun(node, cppLimit);
        if ((lh('https://www.kohnan-eshop.com/shop/g/') || lh('https://www.komeri.com/disp/') || lh(/^https:\/\/www\.amazon\.co\.jp\/.*dp\//) || lh("https://jp.iherb.com/pr/"))) {
          elegeta('.ppr:not(div.pdTopContainer .ppr),.ppr2:not(div.pdTopContainer .ppr2)').forEach(e => e.classList.add("pprcccopy"))
        }
        if (lh("https://www.yodobashi.com/product/")) {
          elegeta('div.pdTopContainer .ppr,div.pdTopContainer .ppr2').forEach(e => e.classList.add("pprcccopy"))
        }
        return;
      }

      // onRunがなかったら
      for (let titleEle of elegeta(SITE.titleXPath, node)) {
        var rndcolor = makeRndColor(); // var rndcolor = '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
        var title = (titleEle.title ? titleEle.title : titleEle.textContent);
        if (titleEle.dataset.ycpp) { continue; } else { titleEle.dataset.ycpp = "1"; }
        if (debug) debugEle(titleEle, rndcolor);
        var parentEle = titleEle;
        if (SITE.onEachItem) SITE.onEachItem(node, titleEle, rndcolor);

        if (SITE.close) {
          var parentEle = titleEle.closest(SITE.close())
          debugEle(parentEle, rndcolor);
        } else {
          for (var i = 0; i < parentLimit; i++) {
            parentEle = parentEle.parentNode;
            let found = elegeta(SITE.priceXPath, parentEle).length;
            if (found == 1) break;
            if (found > 1) i = parentLimit + 1;
          }
          if (i > parentLimit) continue;
          debugEle(parentEle, rndcolor);
          if (i == parentLimit) continue;
        }
        //        var priceEle = elegeta(SITE.priceXPath, parentEle)?.[0];
        var priceEle = eleget0(SITE.priceXPath, parentEle);
        if (!priceEle) continue;
        debugEle(priceEle, rndcolor);
        var price0 = (priceEle.textContent.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) { return String.fromCharCode(s.charCodeAt(0) - 0xFEE0) }))
        var price = Number(price0.match(/\D?([0-9\,]+)/)[1].replace(/\,/g, ""));
        if (SITE.pointFunc) var point = SITE.pointFunc(parentEle, price, priceEle, rndcolor);
        //        if (SITE.hide) SITE.hide(title, isorder, isproduct, issearch, parentEle, price, iscate, cppLimit, point, titleEle);
        if (SITE.hide) {
          SITE.hide(title, isorder, isproduct, issearch, parentEle, price, iscate, cppLimit, point, titleEle);
          if ((lh('https://www.kohnan-eshop.com/shop/g/') || lh('https://www.komeri.com/disp/') || lh(/^https:\/\/www\.amazon\.co\.jp\/.*(?:dp|gp)\//) || lh("https://jp.iherb.com/pr/"))) {
            elegeta('.ppr:not(div.pdTopContainer .ppr),.ppr2:not(div.pdTopContainer .ppr2)').forEach(e => e.classList.add("pprcccopy"))
          }
          if (lh("https://www.yodobashi.com/product/")) {
            elegeta('div.pdTopContainer .ppr,div.pdTopContainer .ppr2').forEach(e => e.classList.add("pprcccopy"))
          }
        }
      }
    }
  }

  function elegeta(xpath, node = document) {
    if (!xpath || !node) return [];
    if (typeof xpath == "function") return xpath(node);
    let xpath2 = xpath?.replace(/:inscreen|:visible|:text\*=[^:]*/g, "") // text*=～中で:は使えない
    let array = []
    try {
      if (!/^\.?\//.test(xpath)) {
        array = [...node.querySelectorAll(xpath2)]
      } else {
        var snap = document.evaluate("." + xpath2, node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
        let l = snap.snapshotLength
        for (var i = 0; i < l; i++) array[i] = snap.snapshotItem(i)
      }
      if (/:visible/.test(xpath)) array = array.filter(e => e.offsetHeight)
      if (/:inscreen/.test(xpath)) array = array.filter(e => { var eler = e.getBoundingClientRect(); return (eler.bottom >= 0 && eler.right >= 0 && eler.left <= document.documentElement.clientWidth && eler.top <= document.documentElement.clientHeight) }) // 画面内に1ピクセルでも入っている
      if (/:text\*=./.test(xpath)) { let text = xpath.replace(/^.*:text\*=([^:]*)$/, "$1"); if (text) array = array.filter(e => new RegExp(text).test(e?.textContent)) }
    } catch (e) { return []; }
    //      debug&& array.forEach(e=>e.animate([{outline:`3px dotted #080`},{outline:`3px dotted #f00`},{outline:`3px dotted #080`}],{fill:"both",duration:999}))
    //debug && GF?.e2 && array.forEach(e => e?.animate([{ outline: `4px dotted #084`, boxShadow: `0 0 4px 4px #0841, inset 0 0 4em #0841` }, {}], { fill: "both", duration: 14000 }))
    return array
  }

  function eleget0(xpath, node = document) {
    let e;
    if (!xpath || !node) return null;
    if (typeof xpath == "function") return xpath(node);
    if (/:inscreen|:visible|:text\*=/.test(xpath)) return elegeta(xpath, node)?.shift();
    if (!/^\.?\//.test(xpath)) e = node.querySelector(xpath);
    else {
      try {
        var ele = document.evaluate("." + xpath, node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        e = ele.snapshotLength > 0 ? ele.snapshotItem(0) : null;
      } catch (e) { alert(e + "\n" + xpath + "\n" + JSON.stringify(node)); return null; }
    }
    //debug && e.animate([{outline:`3px dotted #080`},{outline:`3px dotted #f00`},{outline:`3px dotted #080`}],{fill:"both",duration:999})
    //debug && GF?.e2 && e && e?.animate([{ outline: `3px dotted #084`, boxShadow: `0 0 4px 4px #0841, inset 0 0 4em #0841` }, {}], { fill: "both", duration: 14000 })
    return e
  }


  function dc(str, force = 0) {
    if (debug >= 1 || force) popup3(str, 0, 31000, "top");
    return str;
  }


  function proInput(prom, defaultval, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
    var inp = window.prompt(prom, defaultval);
    if (inp === undefined || inp === null) return inp;
    return Math.min(Math.max(Number(inp.replace(/[Ａ-Ｚａ-ｚ０-９．]/g, function(s) { return String.fromCharCode(s.charCodeAt(0) - 65248); }).replace(/[^-^0-9^\.]/g, "")), min), max);
  }

  function makeRndColor() {
    return '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
    //return '#' + ([0,0,0].map(c=>"789abcdef"[Math.floor(Math.random()*9)])).join("");
  }

  function debugEle(ele, col = "random", additionalInfo = "", removeTimeMS = 10000) {
    if (ele && (debug || col.indexOf("forced") !== -1)) {
      if (col.indexOf("random") !== -1) col = '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
      //      if (col.indexOf("random") !== -1) col = '#' + ("000".map(c=>"89abcdef"[Math.random()*8]));
      ele.style.outline = "3px dotted " + col;
      ele.style.boxShadow = " 0px 0px 4px 4px " + col + "30, inset 0 0 100px " + col + "20";
      ele.dataset.yododebugele = ""
      setTimeout(ele => {
        ele.style.outline = ""
        ele.style.boxShadow = ""
      }, removeTimeMS, ele)
      //ele.outerHTML+=additionalInfo;
    }
  }

  function debugRemove(ele) {
    //    if (debug2 && ele) { ele.style.opacity = "0.5"; } else ele.remove();
    if (debug2 && ele) {
      ele.dataset.hidden = "1";
      ele.style.opacity = "0.5";
    } else ele.remove();
  }

  function num(str) {
    //return str.replace(/[Ａ-Ｚａ-ｚ０-９．]/g, function(s) { return String.fromCharCode(s.charCodeAt(0) - 65248); });
    return (str || "").replace(/[Ａ-Ｚａ-ｚ０-９．]/g, function(s) { return String.fromCharCode(s.charCodeAt(0) - 65248); });
  }


  function dc(str, force = 0) {
    if (debug >= 1 || force) popup3(str, 0, 5000, "top");
    return str;
  }

  function popup3(text, i = 0, timer = 15000, alignY = "bottom", clickcb = () => {}) {
    if (text === "") { $('.amaqpuall').remove(); return }
    if (text === undefined || text === null) text = "<null>"
    if (typeof text == "string") text = text.slice(0, 500);
    if (typeof text == "number") text = String(text);
    text = text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/`/g, '&#x60;').replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/gm, "<br>")
    let id = Math.random().toString(36).substring(2);
    let maey = alignY == "bottom" ? 0 : elegeta(".amaqpu3top").map(e => e.getBoundingClientRect().bottom).reduce((a, b) => Math.max(a, b), 0) + 2;
    if (i > 0) $(`.pu3line${i}s`).remove()
    var ele = $(`<span id="amaqpu3${id}" class="ignoreMe amaqpuall amaqpu3${alignY} pu3line${i}s" title="ヨドバシ検索結果で量あたり単価を表示" style=" max-width:33%;font-family:sans-serif; position: fixed; right:0em; ${ alignY }:${maey + i }em; z-index:2147483647; opacity:1; font-size:15px; margin:0px 1px; text-decoration:none !important;  padding:1px 6px 1px 6px; word-break: break-all !important; border-radius:12px; background-color:#10804f; color:white; ">${ text }</span>`).click(clickcb).appendTo('body');
    let ey = ele[0]?.getBoundingClientRect()?.height
    if (ele[0].getBoundingClientRect().bottom >= (window.innerHeight)) {
      elegeta('.amaqpu3top').forEach(e => { e.style.top = parseFloat(e?.style?.top) - (ey) - 2 + "px" })
    }
    if (typeof text == "string") { maey += (text.match(/<br>/gmi) || []).length || 0; }
    setTimeout((function(id) {
      return function() {
        var e = eleget0('//span[@id="amaqpu3' + id + '"]');
        e && e?.remove();
      }
    })(id), timer);
  }

  function isinscreen(ele, evencorner = 0, borderHeight = 0) {
    if (!ele) return;
    var eler = ele.getBoundingClientRect();
    if (evencorner) return (eler.top > 0 - eler.height - borderHeight && eler.left > 0 && eler.left < document.documentElement.clientWidth && eler.top < Math.min(window.innerHeight, document.documentElement.clientHeight) + borderHeight);
    else return (eler.top > 0 - 0 && eler.left > 0 && eler.left + eler.width < document.documentElement.clientWidth && eler.top + eler.height < Math.min(window.innerHeight, document.documentElement.clientHeight) + 0);
  }

  function lh(re) { let tmp = location.href.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可
  function lo(re) { let tmp = location.origin.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可

  function domsort(containerEle, domEles, func, prepend = 0) { // container:domsの入っている大枠、省略時はdomsの１つ親　doms:並べ替える要素たち　prepend:0:containerの最後に付ける昇順　1:containerの最後に付ける降順
    if (containerEle === "") containerEle = domEles[0]?.parentNode
    if (!containerEle || !domEles.length) return
    if (Array.isArray(containerEle)) containerEle = containerEle.shift()
    let col = new Intl.Collator("ja", { numeric: true, sensitivity: 'base' }) //.compare
    let doms2 = prepend ?
      (domEles.map(function(v, i) { return { dom: v, value: func(v, i) } }).sort(function(a, b) { return (!isNaN(b.value) && !isNaN(a.value) ? (a.value - b.value) : b.value == a.value ? 0 : (col.compare(a.value, b.value))) })) :
      (domEles.map(function(v, i) { return { dom: v, value: func(v, i) } }).sort(function(a, b) { return (!isNaN(b.value) && !isNaN(a.value) ? (b.value - a.value) : b.value == a.value ? 0 : (col.compare(a.value, b.value) * -1)) }))
    doms2.forEach(function(v) { containerEle.appendChild(v.dom); })
  }

  function sortdom(doms, func, prepend = 0) { // doms:並べ替える要素たち　prepend:0:昇順　1:降順
    let position = doms[0]?.previousElementSibling
    //let container = doms[0]?.parentNode
    let container = ((e) => { while (e && /none/.test(getComputedStyle(e).display)) e = e.parentElement; return e; })(doms[0]?.parentNode); // 可視の最も近い先祖要素
    if (!container || !doms.length) return;
    let col = new Intl.Collator("ja", { numeric: true, sensitivity: 'base' })
    let fragment = new DocumentFragment();
    doms.map((v, i) => { return { dom: v, value: func(v, i) } }).sort((a, b) => (prepend == 0 ?
      (!isNaN(b.value) && !isNaN(b.value) ? a.value == b.value ? 0 : (a.value - b.value) : a.value == b.value ? 0 : (col.compare(a.value, b.value))) :
      (!isNaN(a.value) && !isNaN(b.value) ? a.value == b.value ? 0 : (b.value - a.value) : a.value == b.value ? 0 : (col.compare(b.value, a.value)))
    )).forEach(v => fragment?.append(v.dom))
    position ? position.parentNode.insertBefore(fragment, position.nextSibling) : container.prepend(fragment)
  }

  function en(v, no = 0) {
    return parseFloat(v?.textContent?.replace(/\,/gm, "")?.match(/[0-9,]+/gm)?.[no]?.toNum());
  }

  function engine2() { // e2::
    // 上が優先
    const SITEINFO = [{
      is: () => lh('//ja.aliexpress.com/'),
      title: n => eleget0('h3.k9_j0 , h3.j7_k5', n),
      box: n => elegeta('div.search-item-card-wrapper-gallery'),
      price: n => en(eleget0('div.k9_k0 , div.j7_la', n), 0) || 0, // + en(eleget0('', n), 0) || 0,
    }, {
      is: () => lh('//www.ebay.com/'),
      title: n => eleget0('div.su-card-container__header', n),
      box: n => elegeta('li.s-card'),
      price: n => en(eleget0('div.s-card__attribute-row > span[class*="su-styled-text"].primary.large-1.s-card__price', n), 0) + en(eleget0('div.s-card__attribute-row:nth-child(3 of div.s-card__attribute-row) > span.su-styled-text.secondary', n), 0) || 0,
    }, {
      is: () => lh('//shop.tsukumo.co.jp/'),
      title: n => eleget0('h2.product-name', n),
      box: n => elegeta('div.search-box__product'),
      price: n => en(eleget0('p.sli_grid_price > span.text-red__common', n), 0) || 0,
    }, {
      is: () => lh('//www.yamada-denkiweb.com'),
      title: n => eleget0('a.links.links-product , h1.product-info__title', n),
      box: n => elegeta('div.result-list__item , div.l-product-info'),
      //price: n => (en(eleget0('p.price , p.price.price-large', n), 0) || 0),
      pprPlace: n => lh("/cate|/search") ? n.parentNode : n.parentNode.parentNode.parentNode,
      price: n => {
        let price = eleget0n('p.price , p.price.price-large', n);
        let point = eleget0n('p.tiles-content__point , span.list-product-info__point', n);
        let point2 = Math.floor(price - (price * (price / (price + price * (point / price)))));
        let price2 = USE_YODOBASHI_METHOD_IN_AMAZON ? price - point2 : price - point;
        if (!eleget0('.kangengo', n) && point) after(eleget0(`p.price`, n), ` <span class='kangengo' title="価格：￥${price}\nポイント：${point}\n還元予測値：￥${point2}">（還元後：￥${price2}）</span>`);
        return price2;
      },
      cccopy: () => 1,
    }, {
      is: () => lh('//page.auctions.yahoo.co.jp/jp/auction/'),
      title: n => eleget0('h1.ProductTitle__text', n),
      box: n => elegeta('div.l-containerInner'),
      //price2: n => (en(eleget0('span.Price__tax', n), 0) || en(eleget0('dd.Price__value', n), 0)) + (en(eleget0('span.Price__postageValue', n), 0) || 0),
      price: n => (en(eleget0('span.Price__tax', n), 0) || en(eleget0('dd.Price__value', n), 0)) + (en(eleget0('span.Price__postageValue', n), 0) || 0),
      pprTagOption: `style="font-size:90%;" `,
      cccopy: () => 1,
    }, {
      is: () => lh('//auctions.yahoo.co.jp/search/search|//auctions.yahoo.co.jp/category/list/'),
      title: n => eleget0('a.Product__titleLink', n),
      box: n => elegeta('li.Product'),
      //price2: n => en(eleget0('span.Product__priceValue.u-textRed', n), 0) + (en(eleget0('p.Product__postage', n), 0) || 0),
      price: n => en(eleget0('span.Product__priceValue.u-textRed', n), 0) + (en(eleget0('p.Product__postage', n), 0) || 0),
      //price: n => eleget0('span.Product__priceValue.u-textRed', n),
      pprPlace: n => n,
      pprTagOption: `style="font-size:90%;" `,
    }, {
      is: () => lh("https://www.kohnan-eshop.com/shop/g/"),
      box: n => elegeta(`div.pane-contents`, n),
      title: n => eleget0(`h1.block-goods-name.js-enhanced-ecommerce-goods-name`, n),
      price: n => eleget0n(`//div[@class="block-cartbox-section--price-price"]`, n),
      pprPlace: n => n,
      pprTagOption: `style="font-size:80%;" `,
      delay: 2222,
      cccopy: () => 1,
    }, {
      is: () => lh("https://www.kohnan-eshop.com/shop/goods/"),
      box: n => elegeta(`.block-thumbnail-t li`, n),
      title: n => eleget0(`.block-thumbnail-t--goods-name a`, n),
      price: n => eleget0n(`.block-thumbnail-t--price-items div`, n),
      pprPlace: n => n,
      pprTagOption: `style="font-size:80%;" `,
      dni: 555,
      func: () => addstyle.add(`div.block-thumbnail-t--goods-name{height:auto !important;}`),
    }, {
      is: () => lh("https://www.topvalu.net/items/list/|https://www.topvalu.net/search/"),
      box: n => elegeta(`article.product__item`, n),
      title: n => eleget0(`div.product__item__spec`, n),
      price: n => eleget0n(`div.product__item__taxin`, n),
      pprPlace: n => n,
      pprTagOption: `style="font-size:95%;" `,
      dni: 555,
      func: () => setInterval(() => eleget0('div.product__button[data-products-role="refill"]:inscreen:visible')?.click(), 2000),
    }, {
      is: () => lh("https://www.topvalu.net/items/detail/"),
      box: n => elegeta(`div.main__inner.item-detail`, n),
      title: n => eleget0(`dd.item-detail__specs__value`, n),
      price: n => eleget0n(`dd.item-detail__specs__value.item-detail__specs__value--price`, n),
      pprTagOption: `style="font-size:110%;" `,
      cccopy: () => 1,
    }, {
      is: () => lh("https://www1.pcdepot.co.jp/products/detail/"),
      box: n => elegeta(`div.m-detail_inner`, n),
      title: n => eleget0(`//div[@class="m-detail_title_inner"]/h1/span`, n),
      price: n => eleget0n(`span.leading`, n),
      cccopy: () => 1,
    }, {
      is: () => lh("https://www1.pcdepot.co.jp/products/list"),
      box: n => elegeta(`//div[@class="m-commodity_inner"]/ul/li`, n),
      title: n => eleget0(`div.m-commodity_title`, n),
      price: n => eleget0n(`div.m-commodity_price.text-nowrap`, n),
      cccopy: () => 1,
    }, {
      is: () => lh("//nttxstore.jp/_"),
      title: n => eleget0('div.name', n),
      box: n => elegeta('li.item', n),
      price: n => eleget0n(`div.rbox`, n),
      pprPlace: n => n,
      cccopy: () => 1,
    }, {
      is: () => lh("https://nttxstore.jp/_II_"),
      box: n => elegeta(`//div[@id="incontents"]`, n),
      title: n => eleget0(`div#incontents>h1`, n),
      price: n => eleget0n(`dd.price>span`, n),
      pprPlace: n => n,
      cccopy: () => 1,
    }, {
      is: () => lo("https://nttxstore.jp"),
      box: n => elegeta(`div#schphoto>ul>li`, n),
      title: n => eleget0(`//div[@class="name"]/a`, n),
      price: n => eleget0n(`//div[@class="price"]`, n),
    }, {
      is: () => lo("search.rakuten.co.jp"),
      box: n => elegeta(`div.dui-card.searchresultitem`, n),
      title: n => eleget0(`a[class*="title-link--"]`, n),
      //price: n => eleget0n(`div[class*="price--"]`, n),
      price: n => +eleget0n('div[class*="price--"]', n) + +eleget0n('span[class*="paid-shipping-wrapper--"] > span', n),
    }, {
      is: () => lo('akibaoo.co.jp'),
      box: n => elegeta('//div[contains(@class,"resultsRow img goodsItem cf")]', n),
      title: n => eleget0('//a[@class="goodsName" and @target=""]', n),
      price: n => eleget0n(`//div[2]/div[contains(@class,"userOperateArea")]/span[4]`, n),
    }, {
      //p.txt-point
      is: () => lh('www.xprice.co.jp/search'),
      box: n => elegeta('div.product-list.search-item-am.cf li.search-item:visible', n),
      title: n => eleget0('a.txt-link', n),
      price: n => eleget0n(`p.txt-price`, n),
      /*      price: n => {
              let price = eleget0n('p.txt-price , span.txt-price', n);
              let point = eleget0n('p.txt-point', n);
              let point2 = Math.floor(price - (price * (price / (price + price * (point / price)))));
              let price2 = USE_YODOBASHI_METHOD_IN_AMAZON ? price - point2 : price - point;
              if (!eleget0('.kangengo', n)) after(eleget0(`p.txt-price , span.txt-price`, n), ` <span class='kangengo' title="価格：￥${price}\nポイント：${point}\n還元予測値：￥${point2}">（還元後：￥${price2}）</span>`);
              return price2;
            },
        */
      func: () => setInterval(run, 3999, SITE),
      retry: 1,
    }, {
      //p.txt-point
      is: () => lo('www.xprice.co.jp'),
      box: n => elegeta('div.product01__wrap.cf', n),
      title: n => eleget0('h1.product01__ttl', n),
      //price: n => eleget0n(`p.txt-price , span.txt-price`, n),
      price: n => {
        let price = eleget0n('span.txt-price', n);
        let point = eleget0n('span.point__rate', n);
        let point2 = Math.floor(price - (price * (price / (price + price * (point / price)))));
        let price2 = USE_YODOBASHI_METHOD_IN_AMAZON ? price - point2 : price - point;
        if (!eleget0('.kangengo', n)) after(eleget0(`span.txt-price`, n), ` <span class='kangengo' title="価格：￥${price}\nポイント：${point}\n還元予測値：￥${point2}">（還元後：￥${price2}）</span>`);
        return price2;
      },
      //delay:22222,
    }, {
      is: () => lh(/https:\/\/www\.google\.[^\/]+\/search\?(tbm=shop|udm=28)/),
      box: n => elegeta('div.Ez5pwe', n),
      title: n => eleget0('div.gkQHve', n),
      price: n => eleget0n(`span.lmQWe`, n),
      func: () => setInterval(run, 999, SITE),
      retry: 1,
    }, {
      is: () => lh("https://shopping.yahoo.co.jp/"),
      box: n => elegeta('div.SearchResult_SearchResultItem__mJ7vY', n),
      title: n => eleget0('a.SearchResult_SearchResultItem__detailLink__G4Top', n),
      price: n => eleget0n(`p.ItemPrice_SearchResultItemPrice__valueRow__G_aze`, n) + eleget0n('span.ItemPrice_SearchResultItemPrice__postageText__U0WKj', n),
      func: () => setInterval(run, 999, SITE),
      retry: 1,
    }, {
      is: () => lh('//jp.daisonet.com/'),
      title: n => eleget0('a.product-item__title.link , h1.product-meta__title.heading', n),
      price: n => eleget0n('div.product-item__price-list , div[role="region"] > div.price-list > span > span.tax:last-child', n),
      box: n => {
        let e = elegeta('div.product-item', n); // , div.product-item--vertical , div.product-block-list.product-block-list--small
        addstyle.add('div.product-list :is( div.product-item, div.product-item--vertical , div.product-block-list.product-block-list--small) {position:unset !important; left:unset !important; width:25% !important;}') //
        return e
      },
      cccopy: () => lh('/products/'),
    }, {
      is: () => ld('kakaku.com'),
      title: n => eleget0(`p.p-item_name.s-biggerlinkHover_underline > a , div.boxL > h2[itemprop="name"]`, n),
      box: n => elegeta(`div.c-list1_cell.p-resultItem , div.itmBoxIn`, n),
      price: n => eleget0n('em.p-item_priceNum , div.priceWrap > div.subInfoObj1 > p > span.priceTxt', n),
      keyfunc: lh('kakaku.com/item/') ? [{
        key: /^a$|^Shift\+Alt\+A$/, // a::
        func: ele => {
          //if (!GF?.use) return;
          sortdom(elegeta('table.p-priceTable > tbody > tr').filter(n => eleget0('p.p-PTPrice_price', n)), e => (eleget0n('.kangengo', e) || eleget0n('p.p-PTPrice_price', e) || Number.MAX_SAFE_INTEGER) + eleget0n('span.p-PTShipping_btn_sub', e), 0);
          popup3(`a:還元後価格＋送料が安い順に並べ替え`, 8, 5000, "bottom");
          return true;
        }
      }] : [{}],
      func: () => {
        if (lh('kakaku.com/item/')) {
          addstyle.add('.kangengo { font-size:120%; }')
          elegeta('table.p-priceTable > tbody > tr').forEach(n => {
            let price = eleget0n('p.p-PTPrice_price', n);
            let point = eleget0n('span.p-PTPoint_num', n);
            let point2 = Math.floor(price - (price * (price / (price + price * (point / price)))));
            let price2 = USE_YODOBASHI_METHOD_IN_AMAZON ? price - point2 : price - point;
            if (!eleget0('.kangengo', n)) after(eleget0(`p.p-PTPoint`, n), ` <span class='kangengo' title="価格：￥${price}\nポイント：${point}\n還元予測値：￥${point2}">（還元後：￥${price2}）</span>`);
          })
        }
      }
    }, {
      is: () => lh('www.komeri.com'), // 2024.12
      title: n => eleget0(`div.goods-nm > p:nth-child(2) , h1#goodsname.heading--top.webfont`, n),
      box: n => elegeta(`div.item , div.goods-main`, n),
      price: n => eleget0n('div.price-area.webfont > div.textRight , p.price--area2 > span.amt', n),
    }, {
      is: () => lh('workman.jp'), // 2024.12
      title: n => eleget0(`div._title>a`, n),
      box: n => elegeta(`div._item`, n),
      price: n => eleget0n('div._price', n),
    }, {
      is: () => lh('//www.e-fujiyakuhin.jp/'), // 2025.01
      title: n => eleget0(`div.column-set > section.column4 > h2 , div#pi_cart > h1`, n),
      box: n => elegeta(`section.column4 , div#itemDetail-cont`, n),
      price: n => { eleget0('span.taxin , tr.price > td > span:nth-child(2 of span)', n)?.classList?.add("kangengo"); return eleget0n('span.taxin , tr.price > td > span:nth-child(2 of span)', n) },
      cccopy: () => !lh('/list.'),
      pprPlace: n => n,
    }, {
      is: () => lh('//sundrug-online.com/'), // 2025.02
      title: n => eleget0('div > div.product-item__info-inner > a.product-item__title[class*="text--strong"]:nth-child(1) , span.snize-title , h1.product-meta__title.heading.h1', n),
      box: n => elegeta('div[class*="product-list--collection"] > div.product-item.product-item--vertical , ul > li.snize-product , div.product-block-list.product-block-list--small', n),
      price: n => eleget0n('div[class*="product-item__info"] > div[class*="product-item__info-inner"] > div.product-item__price-list[class*="price-list"] > span.price , span.snize-price , div > div.product-form__info-item > div > div[class*="price-list"] > span:nth-child(1)', n),
      func: () => setInterval(run, 999, SITE),
      cccopy: () => lh('/products/'),
    }, {
      is: () => lh('//www\.biccamera\.com/'), // 2025.02
      title: n => eleget0('p.bcs_title > a , h1#PROD-CURRENT-NAME', n),
      box: n => elegeta('li.prod_box , form[name="Goods"] > div.bcs_mainColumn', n),
      price: n => {
        let price = eleget0n('p.bcs_price > span.val , td[class*="bcs_price"] > p > strong', n);
        let point = eleget0n('p.bcs_point > span , tr.bcs_variationOff > td.bcs_point.bcs_basefont', n);
        let point2 = Math.floor(price - (price * (price / (price + price * (point / price)))));
        let price2 = USE_YODOBASHI_METHOD_IN_AMAZON ? price - point2 : price - point;
        if (!eleget0('.kangengo', n)) after(eleget0(`p.bcs_price > span.val , td[class*="bcs_price"] > p > strong`, n), ` <span class='kangengo' title="価格：￥${price}\nポイント：${point}\n還元予測値：￥${point2}">（還元後：￥${price2}）</span>`);
        return price2;
      },
      func: () => setInterval(run, 999, SITE),

      /*   }, {
            is: () => lh('//www.suplinx.com/'), // 2025.02 // @match *://www.suplinx.com/*
            title: n => eleget0('a.goods_name_', n),
            box: n => elegeta('div.StyleOB_line_.goods_list_line_', n),
            price: n => eleget0n('span.price_ > strong', n),
      */
      /*      },     {
              is: () => lh('//secure.iherb.com/'), // 2025.05
              title: n => eleget0('a.sc-dtLLSn > div', n),
              box: n => elegeta('div.dUCVvB', n),
              price: n => eleget0n('div.sc-WZYut.iivgnA', n),
              dni: 555,
      */

    }, {
      is: () => lh('//super.belc-netshop.jp/'), // 2025.05
      title: n => eleget0('h3.blo-item__name , h1.mod-item-detail__name', n),
      box: n => elegeta('li.mod-item-list__item , div.mod-item-detail', n),
      price: n => eleget0nNP('div.blo-item__tax-included , span.mod-item-detail__price-tax-included', n),
    }, {
      is: () => lh('www.dospara.co.jp'),
      title: n => eleget0('h3.p-product-show-detail__h3 , h2.p-products-all-item-product__name__text > a', n),
      box: n => elegeta('div.p-product-show-detail__contents , div.p-products-all-item__item', n),
      price: n => eleget0nNP('p.product_price > span.num , div > a.p-products-all-item-product__price--box > div', n),
      func: () => setInterval(run, 1999, SITE),
      //retry: 1,
    }, {
      is: () => lh('//www.e-welcia.com/'), // 2025.12
      title: n => eleget0('p.c-card-product__name , h1.p-product-main__name', n),
      box: n => elegeta('li.p-product-list__item , div.p-product-main__column', n),
      price: n => eleget0n('p.c-card-product-price__tax , p.p-product-setting-price__tax', n),
      // func: () => setInterval(run, 999, SITE),
      // cccopy: () => !lh('/list.'),

      /*    }, {
      is: () => lh(''), // 2025.02
      title: n => eleget0('', n),
      box: n => elegeta('', n),
      price: n => eleget0n('', n),
      // func: () => setInterval(run, 999, SITE),
      // cccopy: () => !lh('/list.'),
      */
    }, ];

    let SITE = SITEINFO.find(v => v.is())
    if (!SITE) return "not target";
    GF.e2 = 1;

    String.prototype.match0 = function(re) { let tmp = this.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可
    String.prototype.toNum = function() { return this.replace(/\,/gm, "").match0(/[0-9\.]+/gm) }
    GM_addStyle(`.ppr,.ppr2 {all:initial;position:relative;z-index:999; cursor:pointer; display:inline-block !important; font-weight:bold !important; margin:0.5px 0px 0.5px 3px !important; text-decoration:none !important; padding:0px 0.5em 0 0.2em !important; border-radius:99px !important; background-color:#6080b0 !important; color:white !important; white-space: nowrap !important;}
.kangengo{background-color:#fff0f0; ${USE_YODOBASHI_METHOD_IN_AMAZON?"color:#f00; font-weight:bold;":"color:#000; font-weight:normal;"} font-size:80%; }`)

    if (typeof $ === "undefined") { window.addEventListener('DOMContentLoaded', function() { run0(); return; }) } else { run0(); }

    function run0() {
      setTimeout(() => run(SITE, document.body), SITE?.delay || 0)
      document.body.addEventListener('AutoPagerize_DOMNodeInserted', function(evt) { run(SITE, evt.target); }, false);
      if (SITE.func) SITE.func()
      if (SITE?.dni) document.body.addEventListener('DOMNodeInserted', function(evt) {
        clearTimeout(GF.dniId) //}
        GF.dniId = setTimeout(() => run(SITE), SITE?.dni || 999)
      }, false);

      var mousex = 0;
      var mousey = 0;
      document.addEventListener("mousemove", function(e) {
        mousex = e.clientX;
        mousey = e.clientY;
        hovertimer = 0;
      }, false);

      // キーボード trueを返したら残りは見ない
      var keyFunc = [...(SITE?.keyfunc || []), ...[{
        key: "a", // a::
        func: ele => {
          if (!GF?.use) return;
          sortdom(SITE.box(), e => eleget0('.ppr', e)?.dataset?.tankafull?.toNum() || Number.MAX_SAFE_INTEGER, 0);
          //sortdom(SITE.box().filter(e => eleget0('.ppr', e)), e => eleget0('.ppr', e)?.dataset?.tankafull?.toNum(), 0);
          popup3(`a:量単価が安い順に並べ替え`, 8, 5000, "bottom");
        }
      }, {
        key: "Shift+Alt+A", // Shift+Alt+A::
        func: ele => {
          //          sortdom(SITE.box(), e => SITE.price(e)?.textContent?.match0(/([0-9,\.]+)/)?.replace(/[^0-9]/gmi, ""), 0)
          sortdom(SITE.box(), e => eleget0n('.kangengo', e) || SITE?.price(e), 0)
          //SITE.box().forEach(e=>debugEle(e,"random forced","",1500))
          popup3("");
          popup3(`Shift+Alt+A：安い順に並べ替え をしました`, 8, 5000, "bottom") //, () => { elegeta('div.s-asin[data-asin]').filter(e => !eleget0('.a-price-whole', e)).forEach(e => $(e).hide(666)) })
          return;
        }
      }, {
        key: ",", // ,::価格上限で絞り込み
        func: ele => {
          let priceLimit = sessionStorage.getItem("priceLimit") || null;
          priceLimit = proInput(`,：上限価格を入力してください`, priceLimit || 0) || 0; // , 価格上限
          sessionStorage.setItem("priceLimit", priceLimit || "") || 0;
          popup3(""), popup3(priceLimit > 0 ? `,：価格上限で絞り込み（￥${priceLimit}）` : "", 0, 5, "bottom")
          moq("*", ev => {
            //clearTimeout(GF?.commaTO);
            GF.commaTO = setTimeout(() => {
              let eles = SITE?.box()
              eles.filter(v => priceLimit != 0 && ((SITE?.price(v)) > priceLimit) && !gmDataList_includesPartial(v, `gmHideByyodoComma`)).forEach(v => {
                gmDataList_add(v, "gmHideByyodoComma");
                $(v).hide(999)
              })
              eles.filter(v => !(priceLimit != 0 && ((SITE?.price(v)) > priceLimit))).forEach(v => {
                gmDataList_remove(v, "gmHideByyodoComma");
                if (!gmDataList_includesPartial(v, 'gmHideBy')) $(v).show(999)
              })
            }, 1111, document, "e2comma")
          })
          return false
        }
      }]];
      var keyListen = function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.getAttribute('contenteditable') === 'true') return;
        var key = (e.shiftKey ? "Shift+" : "") + (e.altKey ? "Alt+" : "") + (e.ctrlKey ? "Ctrl+" : "") + e.key;
        var ele = document.elementFromPoint(mousex, mousey);
        var sel = (window.getSelection) ? window.getSelection().toString().trim() : ""
        for (let v of keyFunc) { if (v.key instanceof RegExp ? (v.key.test(key)) : (v.key == key)) { if (v.func(ele)) break } }
      }
      document.addEventListener('keydown', keyListen, false)
      document.addEventListener('contextmenu', e => {
        if (!GF?.use) return;
        if (e.target.matches(".ppr,.ppr2")) {
          keyFunc.find(v => v.key == "a").func();
          e.preventDefault();
          return false;
        }
      }, false)
      return;
    };

    function run(SITE, node = document.body) {
      SITE.box(node).filter(e => !e.dataset.pprdone).forEach(boxele => {
        if (!SITE?.retry) boxele.dataset.pprdone = 1
        //        let priceele = SITE?.price?.(boxele)
        //      let price = SITE?.price2?.(boxele) || priceele?.textContent?.toNum()
        let price = SITE?.price(boxele)
        let titleele = SITE.title(boxele)
        if (price && titleele) {
          //let rc=makeRndColor();
          //[priceele,titleele,boxele].forEach(e=>debugEle(e,rc)) //

          //var ryoua = titleele?.textContent?.replace(/[Ａ-Ｚａ-ｚ０-９．，]/g, function(s) { return String.fromCharCode(s.charCodeAt(0) - 65248) })?.replace(/\,/gm, "").match(/\D?([0-9\.]+)\s?(ページ|mg|mcg|μm|g|ml|mL|枚|粒|錠|包|杯|本|回分|回用|個|袋|ml|GB|ペア|組|日分|ヶ入|組入|ポート|色|日分|ヶ入|食|巻|入|セット|缶|函)|([0-9\.]+)\s?(L|kg|㎏|Kg|ｋｇ|キロ|TB)/); // ntt-x
          let title = titleele?.textContent?.replace(/[Ａ-Ｚａ-ｚ０-９．，]/g, function(s) { return String.fromCharCode(s.charCodeAt(0) - 65248) })?.replace(/\,/gm, "");
          var ryoua = (title.match0(/テープ|マスカー/) && title.match0(/×[\d\.]+m|[\d\.]+m巻/i)) ? (title.match(/×([\d\.]+)(m)|×([\d\.]+)(km)/i) ?? title.match(/([\d\.]+)(m巻)|([\d\.]+)(km巻)/i)) :
            title.match(/\D?([0-9\.]+)\s?(ページ|mg|mcg|μm|g|ml|mL|枚|粒|錠|包|杯|本|回分|回用|個|袋|ml|GB|ペア|組|日分|ヶ入|組入|ポート|色|日分|ヶ入|食|巻|入|セット|缶|函|枚|粒|錠|包|杯|本|回分|回用|個|袋|冊|袋|枚|粒|錠|包|杯|本|個|袋|組入|ポート|色|日分|ヶ入|食|回分|回用|巻|カプセル|入|セット|缶|函|ペア|組|P|日分|ヶ入|組入|ポート|色|日分|ヶ入|食|巻|入|セット|缶|函|Pack|枚|タブレット|カプセル|個|錠|ベジタリアンカプセル|ベジタブルカプセル|植物性カプセル|Vegan.*Caps|Softgel.*Capsule|ベジ.*キャップ|ジェルキャップ|液.*ジェル|ソフトゲル|ビーガンタブレット|ゼラチンカプセル|ベジソフトジェル|カプセル|粒|チュアブル錠|ソフトゼリー|ティーバック|ティーバッグ|袋|Softgels|ソフトジェル|Chewable Tablets|錠|Tablets|グミ|Vegan Gummies|ロゼンジ|植物性液体フィトカプセル|Vegetarian Food-Based Tablets|Caples|Capsules|Mini Soft Gels|Tri-Layered Tablets|Gummies|Wipes|Tea Bags|Fish Gelatin Softgel|Chewables|Animal-Shaped Tablets|VegCaps|Vegetarian Gummies|Rapid Release Liquid Softgels|Bears|Wafers|Liquid Soft-Gels|Caplets|Organic Gummies|Penguin Chewables|Coated Caplets|Vegetarian Softgels|Mini-Tablets|Lozenges|Vegetarian Lozenges|Micro Tablets|Lozenge|(?:ベジ|Vegetarian|Vegan|Vegetable|Veggie|Vegi|Veg)[\s\-]*(?:カプセル|キャップ|Capsules|Caps|Tablets|Softgels)|(?:Quick(?: Release| Dissolve)?)[\s\-]*(?:Melts|Tablets|Softgels|Capsules))|([0-9\.]+)\s?(L|kg|㎏|Kg|ｋｇ|キロ|TB)/i); // ntt-x

          var mul = !title.match(/PCI\-?e|NVMe|SSD.*Gen\s*\d/i) && (title.match(/×[0-9\.\,]+/m) && !(title.match(/[\(（\[].*×.*[\)）\]]/m)) && !(title.match(/×[\d\s]*(cm|mm|m)/))) ? Number(title.match(/×([0-9\.\,]+)/)[1]) : 1; // カッコの中に入っている×nは内訳と見てセットにしない
          let tankaa = []
          if (ryoua?.[1] && ryoua?.[2]) tankaa.push({ value: ryoua[1].toNum() * mul, unitname: ryoua[2] })
          //          if (ryoua?.[3] && ryoua?.[4]) tankaa.push({ value: ryoua[3], valueActual: ryoua[3]?.toNum()*1000, unitname: ryoua[4] })
          if (ryoua?.[3] && ryoua?.[4]) tankaa.push({ value: ryoua[3].toNum() * mul * (1000), unitname: ryoua[4].replace(/^L$/, "ml").replace(/^kg$|^キロ$/i, "g").replace(/^TB$/, "GB") }) // 1000倍の単位だったら1/1000の単位に変換
          tankaa.forEach(i => {
            //            let tanka = Math.round((priceele.textContent.toNum() / i.value.toNum()) * 100) / 100
            let tanka = Math.round((price / i.value) * 100) / 100
            //            let tankaFull = (priceele.textContent.toNum() / i.value.toNum())
            //            let tankaFull = (priceele.textContent.toNum() / (i?.valueActual||i.value.toNum() ) )
            let tankaFull = (price / (i?.valueActual || i.value))
            //            after(SITE?.pprPlace?.(titleele) || titleele.parentNode, ` <span class="pprcover"><span class="ppr${SITE?.cccopy?" pprcccopy":""}" ${SITE?.pprTagOption||""} data-tankafull="${tankaFull}" title="￥${priceele?.textContent?.toNum()}/${i.value.toNum()}${i.unitname}=￥${tankaFull}/${i.unitname}">￥${tanka}/${i.unitname}</span></span>`)

            var pprEmbed = (price) / (i?.valueActual || i.value);
            var pprEmbedAligned = pprEmbed;
            if (i.unitname?.match(/mg/i)) pprEmbedAligned = (pprEmbed / 1000);
            if (i.unitname?.match(/mcg|μg/i)) pprEmbedAligned = (pprEmbed / 1000 / 1000);
            tankaFull = pprEmbedAligned;
            after(SITE?.pprPlace?.(titleele) || titleele.parentNode, ` <span class="pprcover"><span class="ppr${SITE?.cccopy&&SITE?.cccopy()?" pprcccopy":""}" ${SITE?.pprTagOption||""} data-tankafull="${tankaFull}" title="￥${price}/${i.value}${i.unitname}=￥${tankaFull}/${i.unitname}">￥${tanka}/${i.unitname}</span></span>`)
            GF.use = 1
            boxele.dataset.pprdone = 1
          })
        }
      })
    }

    function dc(str, force = 0) {
      if (debug >= 1 || force) popup3(str, 0, 31000, "top");
      return str;
    }

    function proInput(prom, defaultval, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
      var inp = window.prompt(prom, defaultval);
      if (inp === undefined || inp === null) return inp;
      return Math.min(Math.max(Number(inp.replace(/[Ａ-Ｚａ-ｚ０-９．]/g, function(s) { return String.fromCharCode(s.charCodeAt(0) - 65248); }).replace(/[^-^0-9^\.]/g, "")), min), max);
    }

    function makeRndColor() {
      return '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
      //return '#' + ([0,0,0].map(c=>"789abcdef"[Math.floor(Math.random()*9)])).join("");
    }

    function debugEle(ele, col = "random", additionalInfo = "") {
      if (ele && (debug || col.indexOf("forced") !== -1)) {
        if (col.indexOf("random") !== -1) col = '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
        //      if (col.indexOf("random") !== -1) col = '#' + ("000".map(c=>"89abcdef"[Math.random()*8]));
        ele.style.outline = "3px dotted " + col;
        ele.style.boxShadow = " 0px 0px 4px 4px " + col + "30, inset 0 0 100px " + col + "20";
        ele.dataset.yododebugele = ""
        //ele.outerHTML+=additionalInfo;
      }
    }

    function sortdom(doms, func, prepend = 0) { // doms:並べ替える要素たち　func(e):要素eの順位を決める数値か文字列をreturnする関数　prepend:0:昇順　1:降順
      let position = doms[0]?.previousElementSibling
      let container = doms[0]?.parentNode
      if (!container || !doms.length) return
      let col = new Intl.Collator("ja", { numeric: true, sensitivity: 'base' })
      let fragment = new DocumentFragment();
      doms.map((v, i) => { return { dom: v, value: func(v, i) } }).sort((a, b) => (prepend == 0 ?
        (!isNaN(b.value) && !isNaN(b.value) ? a.value == b.value ? 0 : (a.value - b.value) : a.value == b.value ? 0 : (col.compare(a.value, b.value))) :
        (!isNaN(a.value) && !isNaN(b.value) ? a.value == b.value ? 0 : (b.value - a.value) : a.value == b.value ? 0 : (col.compare(b.value, a.value)))
      )).forEach(v => fragment?.append(v.dom))
      position ? position.parentNode.insertBefore(fragment, position.nextSibling) : container.prepend(fragment)
    }

    function ctLong(callback, name = "test", time = 10) { console.time(name); for (let i = time; i--;) { callback() } console.timeEnd(name) } // 速度測定（もともと長くかかるもの）
    function ct(callback, name = "test", time = 10) { let i = 0; let st = Date.now(); while (Date.now() - st < 1000) { i++, callback() } console.log(`${name} ${i} / 1sec`) } // 速度測定（一瞬で終わるもの）
    function lh(re) { let tmp = location.href.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可
    function lo(re) { let tmp = location.origin.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可
    function ld(re) { let tmp = location.hostname.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可
    function JS(v) { try { return JSON.stringify(v) } catch { return null } }

    function JP(v) { try { return JSON.parse(v) } catch { return null } }

    function e2sel(ele) { return `${ele.tagName?.toLowerCase()}${ele.id?"#"+ele.id:""}${ele.className?"."+ele.className.replace(/\s/g,"."):""}` }

    function han(str) { return str?.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) { return String.fromCharCode(s.charCodeAt(0) - 65248) }) || "" }

    function sani(s) { return s?.replace(/&/g, "&amp;")?.replace(/"/g, "&quot;")?.replace(/'/g, "&#39;")?.replace(/`/g, '&#x60;')?.replace(/</g, "&lt;")?.replace(/>/g, "&gt;") || "" }

    function isValidRE(str) {
      try { new RegExp(str) } catch (e) { return false }
      return true
    }

  }

  function lo(re) { let tmp = location.origin.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可
  function ld(re) { let tmp = location.hostname.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可

  // cssセレクタのみ使え、追加されたノードそのものと子孫の両方に対応。中速
  function moq(targetCSSSelector, func, observeNode = document, ID = targetCSSSelector + func.toString()) { // IDか「targetCSSSelector＋ func」が同じものなら前回のMOは解除する
    if (!moq.undup) moq.undup = new Map();
    if (moq.undup.has(ID)) moq.undup.get(ID)();
    func([...observeNode.querySelectorAll(targetCSSSelector)])
    let mo = new MutationObserver((m) => {
      let eles = [...m.filter(v => v.addedNodes).map(v => [...v.addedNodes]).filter(v => v.length)].flat().filter(v => v.nodeType === 1)
      let hits = eles.filter(v => v?.matches(targetCSSSelector)).concat(eles?.map(v => [...v?.querySelectorAll(targetCSSSelector)])?.flat())
      if (hits.length) func(hits)
    })
    mo?.observe(observeNode || document.body, { attributes: false, childList: true, subtree: true });
    moq.undup.set(ID, () => {
      mo?.disconnect();
      mo = null;
    })
    return moq.undup.get(ID);
  }

  // element.dataset.gmDataListプロパティにclassList.add/removeのような命令セット
  function gmDataList_add(ele, name) {
    let data = new Set(ele?.dataset?.gmDataList?.split(" ") || []);
    if (!data.has(name)) {
      data.add(name);
      ele.dataset.gmDataList = [...data].join(" ")
    }
  }

  function gmDataList_remove(ele, name) {
    let data = new Set(ele?.dataset?.gmDataList?.split(" ") || []);
    if (data.has(name)) {
      data.delete(name)
      if (data.size) ele.dataset.gmDataList = [...data].join(" ");
      else delete ele.dataset.gmDataList;
    }
  }

  function gmDataList_includesPartial(ele, name) { // *[class*="name"]のような部分一致
    let data = [...new Set(ele?.dataset?.gmDataList?.split(" ") || [])];
    return data.find(v => v.includes(name))
  }

  function gmhbShow(e, id) {
    gmDataList_remove(e, `gmHideBy${id}`)
    if (!gmDataList_includesPartial(e, 'gmHideBy')) $(e).show(333)
  }

  function gmhbHide(e, id) {
    gmDataList_add(e, `gmHideBy${id}`)
    $(e).hide(333)
  }

  function before(e, html) { e?.insertAdjacentHTML('beforebegin', html); return e?.previousElementSibling; }

  function begin(e, html) { e?.insertAdjacentHTML('afterbegin', html); return e?.firstChild; }

  function end(e, html) { e?.insertAdjacentHTML('beforeend', html); return e?.lastChild; }

  function after(e, html) { e?.insertAdjacentHTML('afterend', html); return e?.nextElementSibling; }

  function gmhbShow(e, id) {
    gmDataList_remove(e, `gmHideBy${id}`)
    if (!gmDataList_includesPartial(e, 'gmHideBy')) $(e).show(333)
  }

  function gmhbHide(e, id) {
    gmDataList_add(e, `gmHideBy${id}`)
    $(e).hide(333)
  }

  function eleget0n(xpath, node) {
    //    let r = (+eleget0(xpath, node)?.textContent?.replace(/\,/gm, "")?.match0(/\-?[0-9\.]+/gm) || 0);
    let r = (+eleget0(xpath, node)?.textContent?.replace(/\,/gm, "")?.match0(/\-?[0-9\.]+/) || 0);
    return r
  }

  function eleget0nNP(xpath, node) { // %の前の数字は無視版
    //    let r = (+eleget0(xpath, node)?.textContent?.replace(/\,/gm, "")?.match0(/\-?[0-9\.]+/gm) || 0);
    let r = (+eleget0(xpath, node)?.textContent?.replace(/\,|(\d+[％\%])/gm, "")?.match0(/\-?[0-9\.]+/) || 0);
    return r
  }

  /*
    function eleget0n(xpath, node) {
      //      return Number(eleget0(xpath, node)?.textContent?.replace(/\,/gm, "")?.match0(/[0-9\.]+/gm) );
      return eleget0(xpath, node)?.textContent?.replace(/\,/gm, "")?.match0(/[0-9\.]+/gm);
    }
  */
  function eleget0d(xpath, node = document, debug = 1) {
    let e = eleget0(xpath, node)
    if (e && debug) {
      addstyle.add(`.debugAttract {
        outline:4px solid #82d4;
        background:#82d1;
        }
      `) // box-shadow:0px 0px 4px 4px #92f, inset 0 0 100px #fe2;
      addstyle.add(`.debugattract{}`)
      e?.classList.add("debugAttract")
      setTimeout(e => e?.classList.remove("debugAttract"), 9999, e)
      e.title = `${e?.title||""} "${xpath}"`;
      if (debug >= 2) e?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    }
    return e
  }

  function dt() {
    document.title = [...arguments].map(v => { return `${v}`; }).join(" ") //document.title=[...arguments].map(v=>{return `${v.name}:${v}`;}).join(" ")
  }

  function DOMNodeInserted(target, listener) {
    return (new MutationObserver(m => m.forEach(x => [...x.addedNodes].filter(v => v.nodeType === 1 && !(v.classList.contains("ignoreMe"))).forEach(n => { listener({ target: n }) })))).observe(target, { childList: true, subtree: true });
  }

})();