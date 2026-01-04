// ==UserScript==
// @name ￥+クリックした要素を削除
// @description ￥+＾:指した要素を非表示登録　Ctrl+＾:非表示登録をundo　Shift+＾:非表示登録を編集　￥+左クリック：要素を削除　^+左クリック：親要素を削除　Shift+Alt+￥:見えない要素を削除　￥+@:要素のtextを編集可能化　 ￥+BS：要素の横幅を拡大　￥+.：指した要素を画像として保存　￥+Enter：指した要素をドラッグできるようにする　￥+f：ページ全体のフォントを詰める
// @match *://*/*
// @match file:///*.html
// @version     0.8.2
// @grant       GM.setClipboard
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @run-at    document-idle
// @namespace https://greasyfork.org/users/181558
// @require https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @downloadURL https://update.greasyfork.org/scripts/374125/%EF%BF%A5%2B%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF%E3%81%97%E3%81%9F%E8%A6%81%E7%B4%A0%E3%82%92%E5%89%8A%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/374125/%EF%BF%A5%2B%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF%E3%81%97%E3%81%9F%E8%A6%81%E7%B4%A0%E3%82%92%E5%89%8A%E9%99%A4.meta.js
// ==/UserScript==

(function() {

  var excludeRE = "block;|@data|@href=|width|height|@title=|@alt=|@src="; //"@href=|text\\(\\)|@title=|@alt=|@src="; // o,pキーではこれを含むXPath式は除外する 例：/href|text\(\)/ or /\0/
  var requireRE = "";
  var requireHits = 1;

  const YEN_F_FONTS = [
    `body , * { font-family: 'Noto Sans JP', sans-serif !important; font-weight:400; }`,
    `body , * { font-family: 'Noto Sans JP', sans-serif !important; font-weight:400; font-feature-settings: "palt" !important; }`,
    `body , * { font-family: 'FORM UDPGothic', sans-serif !important; font-weight:400; font-feature-settings: "palt" !important; }`,
    `body , * { font-family: 'Noto Sans JP', sans-serif !important; font-weight:400; font-feature-settings: "palt","kern" !important; letter-spacing:-0.01em !important; }`, //font-variant-east-asian: proportional-width !important;
    `body , * { }`,
  ];
  const YENDOT_SCALE_MIN = 1.5; // ￥＋.の保存時の解像度の最低倍率　1=100%
  const YENDOT_SCALE_AT_LEAST_FIT_SCREEN = 0; // 1:￥＋.の保存時の解像度を画面の縦か横（長辺）フィット以上にしようとする、要するに高解像度化
  const YENDOT_SCALE_AT_LEAST_FIT_SCREEN_X = 1920; // ↑が1の時に画面解像度が取得できない時の暫定解像度
  const YENDOT_SCALE_AT_LEAST_FIT_SCREEN_Y = 1080; // ↑が1の時に画面解像度が取得できない時の暫定解像度

  const YEN_SHOW_OUTERHTML = 0; // ￥や＾時にホバーしている要素のouterHTMLを表示する
  const VERBOSE = 0; // 1:饒舌なログ表示
  const DEBUG = 0; // 1:消した要素をdocument.titleに表示
  const ENABLE_REPORT_AUTO_HIDE = 1; //0なら登録要素を非表示にしたことをポップアップで表示しない
  const POPUPMS = 3000; //ポップアップの表示時間（ミリ秒）
  const TRYMS = 300; //￥＋＾で一回のXPathの自動生成にかける試行時間の上限、ただし最低限の生成ができない時は5000msまでかける
  const CancelStyle = /box-shadow: none;|\@style=\"\"|(\sand\s)\sand\s|\[\]|\sand\s(\])/gmi;
  const cancelrep = "$1$2";

  var blockIntervalID
  const D_FILENAME_MAXLENGTH = 100

  const genNoboruRitsu = 0.1; // 0.5　遡る確率　初期値は５０％
  const genNoboruRitsuCSS = 0.5; // 0.5　遡る確率　初期値は５０％
  const XPATH_CSS_RATIO = 1; // XPATH:CSS のCSSの割合
  const TEXT_MAX = 150; // @text等の文字列指定をする最大の長さ　これ以上の長さの@text=""やcontains(text(),"")の指定はしない
  const tips = "\n\nTips:\n「ABCやDEFを含まず、GHIかJKLを含み、かつMNOとPQRも含む」\n!ABC|DEF GHI|JKL MNO PQR\n\n";
  const autoNextLinkDecision = /page.*last\(\)|nav|next|right|>|＞|»|次/gmi;
  const autoNextLinkDecisionNot = /href/gmi;
  const autoPageElementDecision = /main|list|content/gmi;
  const verbose = 0; // 詳細をconsole.log()
  var blockXP = pref('blockXP') || "";

  let removeHistory = [];
  var GF = {}
  var mousex = 0;
  var mousey = 0;
  var shiftYenText = "";
  var bubparent = 0;
  var shiftYenText = pref('shiftYenText') || "";
  var shiftYenbubparent = pref('shiftYenbubparent') || 0;
  String.prototype.match0 = function(re) { let tmp = this.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可
  //const hide_commonXP = Math.random() > 0.9 ? '' : ''; // ''; //全ページ共通で非表示にしたい要素 //廃止

  let addstyle = {
    added: [],
    add: function(str) {
      if (this.added.includes(str)) return
      end(document.head, `<style>${str}</style>`)
      this.added.push(str)
    },
  }

  var popupY = 0;
  var BrightStyle = "0px 0px 6px 6px rgba(0, 250, 0, 0.5), inset 0 0 12px rgba(0, 250, 0, 0.2)";
  var panel;
  var frameOldEle, frameOldStyle, frameOldTimer;
  var ap1, ap2;

  const BEKIJOU = (((window.navigator.userAgent.toLowerCase()).indexOf('chrome') != -1) ? 222 : 160);
  const ATMARK = (((window.navigator.userAgent.toLowerCase()).indexOf('chrome') != -1) ? 192 : 64);
  const YENMARK = (((window.navigator.userAgent.toLowerCase()).indexOf('chrome') != -1) ? 220 : 220);
  const BS = (((window.navigator.userAgent.toLowerCase()).indexOf('chrome') != -1) ? 8 : 8);


  function block(interval = 2000) {
    GF?.blockStop?.()
    if (!blockXP > "") return;
    let latestMO = 0;
    let cbTO;
    //    if (interval) blockIntervalID = setTimeout(() => { block(blockXPath, interval) }, interval);

    function cb() { //console.log(`mo ${Date.now()}`)
      if (document.visibilityState != "visible" || Date.now() - latestMO < interval) {
        if (!cbTO) cbTO = setTimeout(cb, interval)
        return;
      }
      cbTO = 0;
      //console.log(`mo exec`)
      latestMO = Date.now()
      var i = 0;
      elegeta(blockXP).forEach(e => {
        if (e.offsetHeight) {
          e.style.display = "none";
          if (DEBUG) document.title = blockXP + " => " + e.outerHTML;
          i++;
        }
      })
      if (ENABLE_REPORT_AUTO_HIDE && i) { popup2(i + "個の要素を非表示化しました（Shift+＾で編集）"); }
    }
    cb(blockXP);
    let mo = new MutationObserver(cb)
    mo?.observe(document, { attributes: true, childList: true, subtree: true });
    GF.blockStop = () => {
      mo?.disconnect();
      mo = null;
    }
  }

  /*  if (hide_commonXP != "") {
      setTimeout(() => { block(hide_commonXP, 0) }, 600);
      setTimeout(() => { block(hide_commonXP, 0) }, 2200);
      setTimeout(() => { block(hide_commonXP, 0) }, 4400);
      setTimeout(() => { block(hide_commonXP, 0) }, 6600);
    }
  */
  if (blockXP) {
    block()
    //setTimeout(() => block(blockXP, 0), 100)
    //    var blockIntervalID=setInterval(() => { block(blockXP) }, 3001);
  }
  document?.body?.addEventListener('AutoPagerize_DOMNodeInserted', function(evt) {
    if (shiftYenText) deleteByTextAndBp(shiftYenText, shiftYenbubparent, true);
  }, false); // uAutoPagerizeの継ぎ足し部分だけに付ける

  function removeInherit() { // shift+alt+￥
    var i = 0;
    for (let ele of (/youtube\.com/.test(location.href) ? elegeta('ytd-grid-video-renderer,ytd-item-section-renderer,.style-scope.ytd-item-section-renderer,ytd-rich-item-renderer,ytd-playlist-video-renderer').filter(e => e.style.display == "none") : elegeta('//tr|.//table|.//li|.//a|//article|.//*[@class="style-scope ytd-grid-renderer"]|.//*[@class="style-scope ytd-playlist-video-list-renderer"]|.//div|.//ytd-playlist-renderer|.//ytd-channel-renderer|.//ytd-movie-renderer|.//ytd-horizontal-card-list-renderer|.//*[@class="style-scope ytd-section-list-renderer"]'))) {
      if (getComputedStyle(ele, null).getPropertyValue("display") == "none" || getComputedStyle(ele, null).getPropertyValue("visibility") == "inherit" || ele.style.display == "none;" || (ele?.tagName != "A" && !ele.offsetHeight && [...ele.children].every(e => !e.offsetHeight))) {
        //if (getComputedStyle(ele, null).getPropertyValue("display") == "none" || getComputedStyle(ele, null).getPropertyValue("visibility") == "inherit" || ele.style.display == "none;" || (ele?.tagName != "A" && !ele.offsetHeight)) {
        ele.remove();
        i++;
      }
    }
    popup2(i + "個の不可視要素を削除しました");
  }
  //リアルタイムキー入力
  //var input_key_buffer = new Array();
  var keyP = {};
  const keyPHold = (key) => keyP[key] > 0 ? Date.now() - keyP[key] : 0; // if ( keyPHold("a") > 1000 ) で１秒の長押し判定

  document.addEventListener('keyup', function(e) {
    //input_key_buffer[e.keyCode] = false;
    //    keyP[e.key] = false;
    keyP[e.key] = 0;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.getAttribute('contenteditable') === 'true' || ((e.target.closest('#chat-messages,ytd-comments-header-renderer') || document.activeElement.closest('#chat-messages,ytd-comments-header-renderer')))) return;
    if (e.key == "\\") { //￥
      restoreMark();
    }
    if (e.key == "^") { //^
      restoreMark();
    }
  }, true);

  document.addEventListener('blur', function(e) { keyP = {}; /*input_key_buffer.length = 0;*/ }, false);

  document.addEventListener("saveDOMAsImage", e => { // { detail: { element: ele, filename: fn, scale: scale, eleToFlash: 発光させる要素, hd:true=高画質要求 } } // \+.::
    let [capture, FNAME_SAVE, scale, eleToFlash, hd] = [e.detail.element, e.detail.filename, e.detail.scale, e.detail.eleToFlash, e.detail?.hd]
    scale *= window.devicePixelRatio
    scale = Math.max(YENDOT_SCALE_MIN, scale)
    if (hd || YENDOT_SCALE_AT_LEAST_FIT_SCREEN) {
      scale = Math.max(scale, Math.min(Math.max(screen.height, YENDOT_SCALE_AT_LEAST_FIT_SCREEN_Y) / capture.offsetHeight, Math.max(screen.width, YENDOT_SCALE_AT_LEAST_FIT_SCREEN_X) / capture.offsetWidth))
      verb(`y最低：${(screen.height || 1080) / capture.offsetHeight} x最小：${(screen.width || 1920) / capture.offsetWidth} scale:${scale}`)
    }
    let h = capture.offsetHeight
    let w = capture.offsetWidth
    let hmax = 32767 / 4 // / 2 // 経験上1/4までが描画される
    let wmax = 32767 / 4 /// 2
    let maxscale = [hmax / h, wmax / w, 472907776 / (w * h)]
    verb(`ordered  scale: ${w} x ${h} x ${Math.round(scale*100)/100} = ${Math.ceil(w*scale)}(/${wmax}) x ${Math.ceil(h*scale)}(/${hmax}) = ${Math.ceil(w*h*scale)}(/472907776)`)
    scale = maxscale.reduce((a, v) => Math.min(a, v), scale)
    verb(`modified scale: ${w} x ${h} x ${Math.round(scale*100)/100} = ${Math.ceil(w*scale)}(/${wmax}) x ${Math.ceil(h*scale)}(/${hmax}) = ${Math.ceil(w*h*scale)}(/472907776)`)
    if (capture.style.overflowY == "auto") {
      addstyle.add(".cssforcapture{box-shadow:none !important; overflow-y:initial !important; max-height:none !important; }")
    } else {
      addstyle.add(".cssforcapture{box-shadow:none !important;}")
    }
    capture.classList.add("cssforcapture") //if (capture?.style?.boxShadow) capture.style.boxShadow="none"; // boxshadowはhtml2canvasではグリッチ
    html2canvas(capture, { scale: scale, useCORS: true, logging: false }).then(canvas => {
      verb(canvas)
      //      var base64 = canvas.toDataURL('image/png');
      var base64 = canvas.toDataURL('image/webp', 1);
      let e = end(document.body, `<a id="download"></a>`)
      e.href = base64
      e.download = FNAME_SAVE
      e.click()
      e.remove()
      capture.classList.remove("cssforcapture")
      addstyle.add(`.yenClickHighlight{animation: pulse 1s 1; } @keyframes pulse { 0% { box-shadow: 0 0 0 0 #00ff88f0; } 100% { box-shadow: 0 0 10px 35px #00ff8800; } } .yenClickHighlight {outline: rgba(0, 255,128,0.7) solid 4px !important;}`)
      eleToFlash = eleToFlash || capture
      eleToFlash?.classList?.add("yenClickHighlight")
      setTimeout(eleToFlash => eleToFlash?.classList?.remove("yenClickHighlight"), 1000, eleToFlash)
    });
  })

  document.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.getAttribute('contenteditable') === 'true' || ((e.target.closest('#chat-messages,ytd-comments-header-renderer') || document.activeElement.closest('#chat-messages,ytd-comments-header-renderer')))) return;
    var key = (e.shiftKey ? "Shift+" : "") + (e.altKey ? "Alt+" : "") + (e.ctrlKey ? "Ctrl+" : "") + e.key;

    //input_key_buffer[e.keyCode] = true;
    if (!keyP[e.key]) keyP[e.key] = Date.now();
    if (VERBOSE) {
      console.log(`\n●${e.key} :${keyP[e.key]} , hold:${keyPHold(e.key)} shiftKey:${e.shiftKey} ctrlKey:${e.ctrlKey}`);
      for (let k in keyP) { console.log(k, keyP[k]) }
    }

    if (((keyP["^"] || keyP["\\"]) && keyP["f"])) { // ￥＋f:: すべてのフォントを変更
      e.stopImmediatePropagation() + e.preventDefault() + e.stopPropagation() + restoreMark();
      GF.font = ((GF?.font === undefined ? -1 : GF.font) + 1) % YEN_F_FONTS.length;
      elegeta('style#yenclicss').forEach(e => e?.remove())
      end(document.head, `<style id="yenclicss">${YEN_F_FONTS[GF.font]}</style>`)
      popup2(`￥＋ｆ: (${GF.font+1}/${YEN_F_FONTS.length})\n${YEN_F_FONTS[GF.font]}\nに変更しました`);
      return false;
    }
    if (((keyP["^"] && keyP["Enter"]) || (keyP["\\"] && keyP["Enter"])) && !e.shiftKey && !e.altKey) { // ￥＋Enter:: ^+Enter:: 指しているものをドラッグできるようにする
      let ele = document.elementFromPoint(mousex, mousey)
      if (!ele) return;
      if (keyP["^"]) ele = getBekijouEle(ele) //ele = ele?.parentNode;
      if (!ele) return;
      //if(getComputedStyle(ele).backgroundColor=="rgba(0, 0, 0, 0)") {ele.style.backgroundColor="#ffffff !important"; ele.style.zIndex=(getComputedStyle(ele)?.zIndex||0)+1;}
      dragElement2(ele, "*", "")
      //console.log(getComputedStyle(ele).backgroundColor)
    }

    if (((keyP["^"] && keyP["."]) || (keyP["\\"] && keyP["."])) && !e.shiftKey && !e.altKey) { // ￥＋.:: ^+.::
      let ele = document.elementFromPoint(mousex, mousey)
      if (!ele) return;
      if (keyP["^"]) ele = getBekijouEle(ele) //ele = ele?.parentNode;
      if (!ele) return;
      restoreMark()
      removePanel();

      let hrefName = ""
      var fn = `${signzen(document.title+" "+location.href).substr(0, D_FILENAME_MAXLENGTH-hrefName.length-1)} ${hrefName}`?.trim()
      //      var res = ele?.textContent?.replace(/\s+|\n+/gm, " ") || ""
      var res = ele?.innerText?.replace(/\s+|\n+/gm, " ") || ele?.textContent?.replace(/\s+|\n+/gm, " ") || ""
      //var res = ele?.innerText?.replace(/\s+|\n+/gm, " ") || ""

      if (res) fn = `${signzen(document.title+" "+location.href).substr(0, D_FILENAME_MAXLENGTH/2-hrefName.length-1)} ${signzen(res).substr(0, D_FILENAME_MAXLENGTH/2-1)} ${hrefName}`.trim();
      GM.setClipboard(fn);

      function signzen(str) { return str.replace(/^\s+/, "").replace(/\\|\/|\:|\;|\,|\+|\&|\=|\*|\?|\"|\'|\>|\<|\./g, c => { return String.fromCharCode(c.charCodeAt(0) + 0xFEE0) }) }

      let scale = 1
      document.dispatchEvent(new CustomEvent('saveDOMAsImage', { detail: { element: ele, filename: fn, scale: scale } }))
      //input_key_buffer = []
      keyP = {}
      e.preventDefault()
      return false;
    }

    //    if (keyP["\\"] && !e.shiftKey && !e.altKey) {
    if (keyP["\\"] && !e.shiftKey && !e.altKey) {
      removePanel();
      mark();
    }
    if (keyP["^"] && !e.shiftKey && !e.altKey) {
      removePanel();
      let ele = document.elementFromPoint(mousex, mousey)
      ele = getBekijouEle(ele)
      mark(ele); //mark((document.elementFromPoint(mousex, mousey))?.parentNode);
    }
    if (keyP["|"] && e.shiftKey && e.altKey) { removeInherit(); } // shift＋alt＋＾　不可視要素を削除

    if (keyP["\\"] && keyP["^"] && !e.shiftKey && !e.altKey) { // ￥＋＾
      e.preventDefault();
      var ele = document.elementFromPoint(mousex, mousey);
      if ((key == "\\" || key != "^") && ele?.tagName != "HTML") ele = ele?.parentNode
      if (!isBody(ele, 0)) blockElement(ele);
    }

    //    if (keyP["\\"] && input_key_buffer[64] && !e.shiftKey && !e.altKey) { // ￥＋@
    //    if (keyP["\\"] && keyP["@"] && !e.shiftKey && !e.altKey) { // ￥＋@
    if ((keyP["\\"] || keyP["^"]) && keyP["@"] && !e.altKey) { // ￥＋@:: @を押すとshiftは押された判定になるので判断から外す
      e.preventDefault();
      //        if (Date.now() - input_key_buffer[e.keyCode] >= 2000) { // 2秒以上の長押し
      var one = document.elementFromPoint(mousex, mousey);
      if (keyP["^"]) one = getBekijouEle(one)
      if (one) {
        if (one.contentEditable != "true") {
          one.contentEditable = "true";
          one?.animate([{ outline: `9px dashed #04f`, boxShadow: `0 0 1em 1em #04f0` }, { outline: `8px solid #fff0`, boxShadow: `0 0 0px 0px #04f0` }], 555)
        } else {
          one.removeAttribute("contentEditable")
          one?.animate([{ outline: `9px dashed #888`, boxShadow: `0 0 1em 1em #8880` }, { outline: `8px solid #fff`, boxShadow: `0 0 0px 0px #0000` }], 555)
        }

        //input_key_buffer = [];
        keyP = {};
        restoreMark()
        one.focus();
      }
    }
    //    }

    if (keyP["\\"] && !e.shiftKey && !e.altKey && e.key == ":") { // ￥＋::: ランダムぼかし
      e.preventDefault();
      var ele = document.elementFromPoint(mousex, mousey);
      ele.style.filter = `blur(${~~(((+ele.style?.filter?.match0(/[\d\.]+/)||0)+4))%20}px)`
    }


    if (keyP["^"] && e.ctrlKey && !e.altKey) { // ctrl+＾
      if (blockXP.match0(/\||\/\//)) { alert(`Ctrl+^:\n登録内容にXPathを含むようなのでアンドゥは機能しません\nShift+^の自由編集で編集してください`); return; }
      //let undoXP = blockXP.match(/\|[^\|]*$|^[^|]*$/);
      let undoXP = blockXP.split(",") //match0(/\s*\,\s*[^\,]*$/)||"";
      //undoXP=undoXP.map(v=>v.split("|")).flat()
      /*if (undoXP) {
        for (let ele of elegeta(undoXP.replace(/^\s*\,\s*|^\|/, ""))) { ele.style.display = "block"; }
      }*/
      let removed = undoXP.pop()
      if (removed > "") elegeta(removed || "").forEach(e => { e.style.display = "block"; });
      blockXP = undoXP.map(v => v?.trim()).join(" , ") //blockXP.replace(undoXP,"")//replace(/\s*\,\s*[^\,]*$|\|[^\|]*$|^[^|]*$/, "");
      pref('blockXP', blockXP);
      popup2(removed + "\nを自動非表示登録から削除しました\n\n編集後：\n" + blockXP);
      if (blockXP == "") pref('blockXP', "");
      block()
    }

    if (!keyP["|"] && keyP["~"] && e.shiftKey && !e.ctrlKey) { // Shift＋＾
      let tmp = prompt("Shift+＾\nこのドメインで自動で非表示にする要素をXPathかCSSセレクタで指定してください\n\n　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　", blockXP || "");
      if (tmp !== null && tmp != blockXP) {
        blockXP = tmp;
        for (let ele of elegeta(blockXP)) ele.remove();
        pref('blockXP', blockXP);
        if (blockXP == "") pref('blockXP', "");
        location.reload()
      }
    }

    if (keyP["\\"] && keyP["Backspace"]) { // ￥+BackSpace::ホバーしている要素の横幅を10px広げる
      e.preventDefault();
      var ele = document.elementFromPoint(mousex, mousey);
      var w = ele.getBoundingClientRect().width;
      var wp = Number(w) + 10;
      ele.style.width = `${wp}px`
      ele.style.maxWidth = `${wp}px`
    }
  }, true);

  document.addEventListener("mousedown", function(e) {
    if (!e?.isTrusted) return;
    if (keyP["\\"] && e.button == 0) { //￥+左クリック
      e.preventDefault();
      e.stopPropagation();
      var ele = document.elementFromPoint(e.clientX, e.clientY);
      if (isBody(ele, 0)) return;
      removeEle(ele)
      //ele.parentNode.removeChild(ele);
      return false;
    }
    if (keyP["^"] && e.button == 0) { //＾+左クリック
      e.preventDefault();
      e.stopPropagation();
      var ele = e?.target
      if (!ele || isBody(ele, 1)) return;
      ele = getBekijouEle(ele)
      if (!ele || isBody(ele, 1)) return;
      removeEle(ele)
      return false;
    }
    if ((keyP["^"] || keyP["\\"]) && e?.button == 2) { // ＾＋右クリック/￥＋右クリック
      e.preventDefault();
      e.stopPropagation();
      restoreMark()
      removePanel()
      removeEleUndo()
      restoreMark()
      removePanel()
      return false;
    }
  }, true);
  document.addEventListener("contextmenu", e => {
    if (keyP["^"] || keyP["\\"]) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, true)

  function removeEle(ele) {
    if (ele && ele.parentNode) {
      removeHistory.push({ element: ele, parent: ele.parentNode, index: Array.prototype.indexOf.call(ele.parentNode.children, ele) });
      ele?.remove()
    }
  }

  function removeEleUndo() {
    if (removeHistory.length) {
      const { element, parent, index } = removeHistory.pop();
      parent.insertBefore(element, parent.children[index] || null);
    }
  }
  document.addEventListener("mousemove", function(e) {
    mousex = e.clientX;
    mousey = e.clientY;
    if (keyP["\\"]) mark(); //￥
    //    if (keyP["^"]) mark((document.elementFromPoint(mousex, mousey)).parentNode);
    if (keyP["^"]) mark(getBekijouEle(document.elementFromPoint(mousex, mousey)));
  }, false);

  return;

  function isBody(ele, alsoParent = 0) { // eleがbodyならtrue
    if (alsoParent && (ele != document.body && ele.parentNode != document.body)) return false;
    if (!alsoParent && ele != document.body) return false;
    popup2("body要素です");
    return true;
  }

  function blockElement(ele) {
    if (!ele) return;
    restoreMark();
    var xp = getElementXPath0(ele);
    removePanel();
    if (["//HTML", "//HTML/BODY", null, ""].includes(xp)) {
      alert("この要素に対してはCSSセレクタがうまく自動作成できませんでした\n何度か試すか、Shift+^から手書きしてください")
      return;
    }

    if (blockXP.match0(/\||\/\//)) { alert(`￥＋＾:\n既存の登録内容にXPathを含むようです\n自動生成は現在CSSを作り、XPathと混在できません\nShift+^の自由編集で全削除すると新たに登録できるようになります`); return; }

    //for (let ele of elegeta(xp)) ele.style.display = "none"; //ele.remove();
    if (blockXP) blockXP += " , " + xp;
    else blockXP = xp;
    pref('blockXP', blockXP);
    block()
    popup2(xp + "\nを非表示登録しました（Ctrl+＾:取り消し　Shift+＾:編集）\n\n編集後：\n" + blockXP);
  }

  function getElementXPath0(ele) {
    var paths = makecontent(0, ele);
    if (!paths?.length) return "";
    var path = paths[0];
    path = paths.find(v => v.match(/\.\w|#/) && elegeta(v)?.[0] == ele) || null;
    /*                    for (let p of paths) {
          if (p.match(/\.\w|#/)) { path = p; break; }
        }*/
    return path;
  }

  function makecontent(mode, ele) {
    var retStr = [];
    var maxline = 50 //window.innerHeight / maxLines;
    var maxtrial = 0 //maxline * TryMulti * (mode != 9 ? 32 : 3) * (requireRE > "\0" ? 3 : 1) * ((mode == 0 && requireHits == 1) ? 3 : 1);
    var retStrl = 0;
    hajime();
    let stime = Date.now()
    //    for (var i = 0; i < maxtrial && retStrl < maxline; i++) {
    for (var i = 0; Date.now() - stime < 1000 && retStrl < maxline; i++) {
      var xp = Math.random() > XPATH_CSS_RATIO ? getElementXPath(mode, ele) : getElementXPathCSS(mode, ele)
      if (xp && !(mode !== 9 && RegExp((excludeRE || "$^").replace(/｜/gm, "|").replace(/^[\!|！](\S*)/, "^(?!.*($1)).*").replace(/(\S*)[ 　](\S*)/gm, "^(?=.*($1))(?=.*\($2\))").replace(/\s|　/gm, ".*"), "i").test(xp))) {
        retStr.push(xp);
        var retStr = retStr.sort().reduce(function(previous, current) { if (previous[previous.length - 1] !== current) { previous.push(current); } return previous; }, []).sort(function(a, b) { return a.length - b.length < 0 ? -1 : 1; }); // 重複を削除＆ソート
        retStrl = retStr.length;
      }
    }
    owari();
    cl("trymax:" + maxtrial + "\nmakemax:" + maxline + "\ntried:" + i + "\nmake:" + retStr.length);
    /*    // 1つは全属性を記述しただけのもの
        if (getAttrOfEle(mode, ele, true)) {
          var path = "//" + ele.tagName + "[" + getAttrOfEle(mode, ele, true) + "";
          retStr.push(path.replace(CancelStyle, cancelrep).replace(CancelStyle, cancelrep));
        }
        // 1つはフルパスを辿っただけのもの
        retStr.push(getElementXPathFullPath(ele).replace(CancelStyle, cancelrep).replace(CancelStyle, cancelrep));
        // 1つはフルパス全属性を辿っただけのもの
        retStr.push(getElementXPathFullpathAndFullproperty(mode, ele).replace(CancelStyle, cancelrep).replace(CancelStyle, cancelrep));
    */
    return retStr;
  }

  function getElementXPath(mode, ele) {
    var path = "";
    var origele = ele;
    for (let i = 0; i == 0 || (ele && ele.nodeType == 1 && Math.random() > genNoboruRitsu); ele = ele.parentNode, i++) {

      //兄弟番号を調べる
      var ps = getPrevSib(ele);
      var ns = getNextSib(ele);

      var idx = 0;
      var arg = "";
      if (!ns && ps && Math.random() > 0.2) {
        var arg = "[last()]";
      } else
      if (!ps && ns && Math.random() > 0.2) {
        var arg = "[1]";
      } else {
        for (var idx = 1, sib = getPrevSib(ele); sib; sib = getPrevSib(sib)) { idx++; }
      }
      //属性を調べる
      var att = getAttrOfEle(mode, ele);
      if (att) att = "[" + att;
      //背番号かfirst/lastか属性か何も付けないかを32,32,32,4％ずつ
      var rnd = Math.random();
      if ((rnd > 0.68) && arg) var opt = arg;
      else if ((rnd > 0.36) && idx > 1) var opt = "[" + idx + "]";
      else if ((rnd > 0.04) && att) var opt = att;
      else var opt = "";
      path = "/" + ele.tagName.toLowerCase() + (opt) + path;
    }
    if (!path) return "";

    path = "/" + path;
    path = path.replace(CancelStyle, cancelrep).replace(CancelStyle, cancelrep);
    if (requireRE > "" && !(RegExp((requireRE || "$^").replace(/｜/gm, "|").replace(/^[\!|！](\S*)/, "^(?!.*($1)).*").replace(/(\S*)[ 　](\S*)/gm, "^(?=.*($1))(?=.*\($2\))").replace(/\s|　/gm, ".*"), "i").test(path))) return "";

    let hits = elegeta(path).length; // 検算
    let hitsVisible = elegeta(path).filter(e => e?.offsetHeight).length; // 検算
    if (hits == 0 || (mode == 8 && hits < 2) || (mode == 0 && (requireHits != hits && requireHits != hitsVisible))) return false;
    return path;
  }

  function getAttrOfEle(mode, ele, allFlag = false) {
    if (ele.tagName.match(/html|body/gmi)) return "";
    let attrs = ele.attributes;
    let xp = "";
    let att2 = [];
    for (let att of attrs) {
      if (att.value === "") continue;
      if (att.value.length < TEXT_MAX) {
        if (att.name == "class" && Math.random() > 0.2 && !allFlag) {
          att2.push({ name: "contains(@class,", value: "\"" + att.value + "\")" })
        } else {
          att2.push({ name: "@" + att.name + "=", value: "\"" + att.value + "\"" })
        }
      }
    }

    //text
    if (!allFlag) {
      if (Math.random() > (0.5)) {
        if (ele.innerText && !ele.innerText.match(/[\r\n]/)) { att2.push({ name: "text()=", value: "\"" + ele.innerText + "\"" }) }
      } else {
        if (ele.innerText && !ele.innerText.match(/[\r\n]/)) { att2.push({ name: "contains(text(),", value: "\"" + ele.innerText + "\")" }) }
      }
    }

    for (let j = 0; j < att2.length; j++) {
      if ((Math.random() > (allFlag ? 0 : att2[j].name.match(/href/) ? 0.7 : 0.5))) {
        xp += att2[j].name + att2[j].value + " and ";
      }
    }
    xp = xp.replace(/ and $/, "]").replace(/^(.*)\[$/, "$1");
    return xp;
  }

  function getElementXPathCSS(mode, ele) {
    var path = "";
    var origele = ele;
    for (let i = 0; i == 0 || (ele && ele.nodeType == 1 && Math.random() > genNoboruRitsuCSS); ele = ele.parentNode, i++) {

      //兄弟番号を調べる
      var ps = getPrevSib(ele);
      var ns = getNextSib(ele);

      let cla = [...ele.classList].filter(v => v !== "")
      let classes = (cla.length) ? cla.filter(v => Math.random() > 0.5).map(v =>
        Math.random() > (v.match(/[0-9\_\-]+/) ? 0.66 : 0.9) ? `[class*="${v}"]` :
        `.${v}`).join("") : "";
      let idname = `${ele?.id>""&&Math.random()>0.66&&ele?.id?("#"+ele?.id) : ""}`;

      //属性を調べる
      var att = getAttrOfEleCSS(mode, ele);
      if (att) att = "[" + att;

      var idx = 0;
      var arg = "";
      if (!ns && ps && Math.random() > 0.2) {
        var arg = Math.random() > 0.5 ? ":last-of-type" : ":last-child";
      } else
      if (!ps && ns && Math.random() > 0.2) {
        var arg = [`:nth-child(1 of ${ele.tagName.toLowerCase()}${idname}${classes})`, `:nth-of-type(1)`, `:nth-child(1)`][~~(Math.random() * 3)]
      } else {
        for (var idx = 1, sib = getPrevSib(ele); sib; sib = getPrevSib(sib)) { idx++; }
      }

      //背番号かfirst/lastか属性か何も付けないかを32,32,32,4％ずつ
      var rnd = Math.random();
      if ((rnd > 0.68) && arg) var opt = arg;
      //      else if ((rnd > 0.5) && idx > 1) var opt = ":nth-child(" + idx + ")";
      else if ((rnd > 0.5) && idx > 1) var opt = Math.random() > 0.5 ? `:nth-child(${idx} of ${ele.tagName.toLowerCase()}${idname}${classes})` : `:nth-child(${idx})`;
      else if ((rnd > 0.04) && att) var opt = att;
      else var opt = "";

      path = ` > ${ele.tagName.toLowerCase()}${idname}${classes}${opt}${path}`;

    }
    if (!path) return "";

    path = path.replace(CancelStyle, cancelrep).replace(CancelStyle, cancelrep);
    path = path.trim()?.replace(/^\>\s/, "");

    if (requireRE > "" && !(RegExp((requireRE || "$^").replace(/｜/gm, "|").replace(/^[\!|！](\S*)/, "^(?!.*($1)).*").replace(/(\S*)[ 　](\S*)/gm, "^(?=.*($1))(?=.*\($2\))").replace(/\s|　/gm, ".*"), "i").test(path))) return "";

    let hits = elegeta(path).length; // 検算
    let hitsVisible = elegeta(path).filter(e => e?.offsetHeight).length; // 検算
    if (hits == 0 || (mode == 8 && hits < 2) || (mode == 0 && (requireHits != hits && requireHits != hitsVisible))) return false;
    //if (hits == 0 || (mode == 8 && hits < 2) || (mode == 0 && requireHits != hits)) return false;
    return path;
  }

  function getAttrOfEleCSS(mode, ele, allFlag = false) {
    if (ele.tagName.match(/html|body/gmi)) return "";
    let attrs = ele.attributes;
    let xp = "";
    let att2 = [];
    for (let att of attrs) {
      if (att.value.length < TEXT_MAX && att.value !== "") {
        if (att.name != "class" && att.name != "id" && Math.random() > 0.5) {
          att2.push({ name: "" + att.name + "=", value: "\"" + att.value + "\"" })
        }
      }
    }
    for (let j = 0; j < att2.length; j++) {
      if ((Math.random() > (allFlag ? 0 : att2[j].name.match(/href/) ? 0.7 : 0.5))) {
        xp += att2[j].name + att2[j].value + "][";
      }
    }
    xp = xp.replace(/\[$/, "").replace(/^(.*)\[$/, "$1");
    return xp;
  }



  function getElementXPathFullPath(ele) {
    var path = "";
    for (; ele && ele.nodeType == 1; ele = ele.parentNode) {
      for (var idx = 1, sib = ele.previousSibling; sib; sib = sib.previousSibling) {
        if (sib.nodeType == 1 && sib.tagName == ele.tagName) idx++
      }
      path = "/" + ele.tagName + (!ele.tagName.match(/html|body/gi) ? "[" + idx + "]" : "") + path;
    }
    return path;
  }

  function getElementXPathFullpathAndFullproperty(mode, ele) {
    var path = "";
    for (; ele && ele.nodeType == 1; ele = ele.parentNode) {
      if (getAttrOfEle(mode, ele, true)) { path = "/" + ele.tagName + "[" + getAttrOfEle(mode, ele, true) + path; } else { path = "/" + ele.tagName + path; }
    }
    path = "/" + path;
    return path;
  }

  function mark(ele = document.elementFromPoint(mousex, mousey)) {
    restoreMark();
    if (!ele || ele == document.body) return;
    let classlist = (ele?.className || "")?.trim()?.split(" ").filter(v => v).filter(v => !v.match(/\:/)).map(v => "." + v.trim()).join("")
    //    let csssel = `${ele.tagName?.toLowerCase()}${typeof ele.id=="string"&&ele.id>""?"#"+ele.id:""}${typeof ele.className=="string"&&ele.className>""?"."+ele.className.trim().replace(/\s+/g,".").trim():""}`
    let csssel = `${ele.tagName?.toLowerCase()}${typeof ele.id=="string"&&ele.id>""?"#"+ele.id:""}${classlist.trim()}`
    //let csssel = `${ele.tagName?.toLowerCase()}${ele.id?"#"+ele.id:""}${ele.className?"."+ele.className.trim().replace(/\s+/g,".").trim():""}`
    popup2(`${csssel} (${elegeta(csssel).length})`, 9, csssel) // ￥::を押した要素のCSSセレクタをポップアップ（簡易）

    if (YEN_SHOW_OUTERHTML && ele && ele?.outerHTML?.length < 700) popup(ele?.outerHTML + " (" + ele?.outerHTML?.length + "文字)", ele?.outerHTML);
    if (ele) setMark(ele);
    //    ele.addEventListener("mouseout", function(e) { restoreMark(); }, false);
  }

  function xpathErr() {
    popup2(`￥+クリックした要素を削除:\nxpathかcssの書式が正しくないかもしれません\nShift+^で設定し直してください`);
  }

  function eleget0(xpath, node = document) {
    try {
      if (!/^\.?\/\//.test(xpath)) return document.querySelector(xpath);
      var ele = document.evaluate(xpath, node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      return ele.snapshotLength > 0 ? ele.snapshotItem(0) : "";
    } catch (e) { xpathErr(); return null }
  }

  function elegeta(xpath, node = document) {
    try {
      if (!xpath) return [];
      if (!/^\.?\/\//.test(xpath)) return [...document.querySelectorAll(xpath)];
    } catch (e) { xpathErr(); return [] }
    //    var ele = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    try {
      var array = [];
      var ele = document.evaluate("." + xpath, node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
      for (var i = 0; i < ele.snapshotLength; i++) array[i] = ele.snapshotItem(i);
      return array;
    } catch (e) { xpathErr(); return [] }
  }

  function str2numMinMax(str, min, max) {
    var ans = Number(str.replace(/[Ａ-Ｚａ-ｚ０-９．]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 65248);
    }).replace(/[^-^0-9^\.]/g, ""));
    if (ans > max) ans = max;
    if (ans < min) ans = min;
    return ans;
  }

  // バルーン表示
  function popup(txt, unRCtxt) {
    clearTimeout(frameOldTimer);
    if (panel) {
      panel.remove();
      panel = null;
    }
    txt = txt.replace(/outline: 3px dotted red;|\s?style=\"\s*\"\s?/gmi, "");
    txt = txt.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/`/g, '&#x60;').replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/gm, "<br>")
    if (unRCtxt) unRCtxt = unRCtxt.replace(/outline: 3px dotted red;|\s?style=\"\s*\"\s?/gmi, "");
    var ele = eleget0("//span[@id='ctrlc']");
    if (ele) ele.parentElement.removeChild(ele);
    var opa = 0.8;
    panel = document.createElement("span");
    panel.className = "ignoreMe"
    panel.setAttribute("style", "max-width:95%; right:0; bottom:0; z-index:2147483646; opacity:" + opa + "; text-align:left; line-height:1.1em; position:fixed; font-size:15px; margin:15px;  text-decoration:none; padding:15px 15px; border-radius:7px; background-color:#d0e8ff; color:#000000;  box-shadow:5px 5px 8px #0003; border:2px solid #fff; font-family: 'MS UI Gothic','Meiryo UI','Yu Gothic UI','Arial',sans-serif;");
    panel.innerHTML = txt;
    panel.id = "ctrlc";
    panel.onclick = function() {
      GM.setClipboard(unRCtxt || txt);
      panel.style.opacity = 0;
    };
    document.body.appendChild(panel);
    frameOldTimer = setTimeout(function() {
      panel.remove();
      panel = null;
    }, POPUPMS);
    return;
  }

  function removePanel() {
    if (frameOldTimer) clearTimeout(frameOldTimer);
    if (panel) {
      panel.remove();
      panel = null;
    }
  }

  function restoreMark() {
    /*if (frameOldEle) {
      frameOldEle.style.outline = frameOldStyle;
      frameOldEle = null;
    }*/
    elegeta('.yenclickmark').forEach(e => e.classList.remove("yenclickmark"))
  }

  function setMark(ele) {
    addstyle.add(".yenclickmark{outline:red dotted 3px !important;}")
    ele?.classList?.add("yenclickmark")
    //frameOldStyle = ele.style.outline;
    //frameOldEle = ele;
    //ele.style.outline = "red dotted 3px";
  }

  var maet;

  function popup2(text, i = 0, tocopy = "") {
    var mae = eleget0('//span[@id="mllboxYenToDelete"]');
    if (maet && mae) {
      mae.remove();
      clearTimeout(maet);
    }
    text = text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/`/g, '&#x60;').replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/gm, "<br>")
    var ele = document.createElement("span");
    ele.className = "ignoreMe"
    document.body.appendChild(ele)
    ele.outerHTML = `<span id="mllboxYenToDelete" class="ignoreMe" title="クリックでクリップボードにコピー" data-tocopy="${escape(tocopy||text)}" style="all:initial; position: fixed; right:1em; bottom: ${ (i * 2 + 1) }em; z-index:2147483647; opacity:1; font-size:15px; margin:0px 1px; text-decoration:none !important;  padding:1px 6px 1px 6px; word-break: break-all !important; border-radius:12px; background-color:#6090d0; color:white; ">${text}</span>`;
    maet = setTimeout(function() {
      var mae = eleget0('//span[@id="mllboxYenToDelete"]');
      if (mae) { mae.remove(); }
    }, 3000);
    //    document.querySelector('#mllboxYenToDelete').onclick = (e) => { GM.setClipboard(e.target.textContent.trim()) }
    document.querySelector('#mllboxYenToDelete').onclick = (e) => { GM.setClipboard(unescape(e.target.dataset.tocopy)) }
  }

  function str2numMinMax(str, min, max) {
    var ans = Number(str.replace(/[Ａ-Ｚａ-ｚ０-９．]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 65248);
    }).replace(/[^-^0-9^\.]/g, ""));
    if (ans > max) ans = max;
    if (ans < min) ans = min;
    return ans;
  }

  function eleget1(xpath) {
    if (!xpath) return "Err";
    try { var ele = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null) } catch (err) { return "Err"; }
    return ele.snapshotLength > 0 ? ele.snapshotItem(0) : ele;
  }

  function getNextSib(ele) { // 同じタグの弟ノードを走査
    if (!ele.nextElementSibling) return null;
    let orgtag = ele.tagName;
    do {
      ele = ele.nextElementSibling;
      if (!ele) return null;
      if (ele.tagName == orgtag) return ele;
    } while (1)
    return null;
  }

  function getPrevSib(ele) { // 同じタグの兄ノードを走査
    if (!ele.previousElementSibling) return null;
    let orgtag = ele.tagName;
    do {
      ele = ele.previousElementSibling;
      if (!ele) return null;
      if (ele.tagName == orgtag) return ele;
    } while (1)
    return null;
  }

  function proInput(prom, defaultval, min, max = Number.MAX_SAFE_INTEGER) {
    return Math.min(Math.max(
      Number(window.prompt(prom, defaultval).replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 65248);
      }).replace(/[^-^0-9^\.]/g, "")), min), max);
  }

  var start_ms;

  function hajime() { start_ms = new Date().getTime(); }

  function owari() {
    var elapsed_ms = new Date().getTime() - start_ms;
    //console.log('処理時間:' + elapsed_ms + "ms");
  }

  function hajime2() { return new Date().getTime(); }

  function owari2(hajimeTime) {
    return new Date().getTime() - hajimeTime;
  }

  function pref(name, store = undefined) { // prefs(name,data)で書き込み（数値でも文字列でも配列でもオブジェクトでも可）、prefs(name)で読み出し
    var domain = new URL(location.href).hostname;
    if (store === undefined) { // 読み出し
      let data = GM_getValue(domain + " ::: " + name)
      if (data == undefined) return; // 値がないなら終わり
      if (data.substr(0, 1) === "[") { // 配列なのでJSONで返す
        try { return JSON.parse(data || '[]'); } catch (e) {
          console.log("データベースがバグっているのでクリアします\n" + e);
          pref(name, []);
          return;
        }
      } else return data;
    }
    if (store === "" || store === [] || store === null) { // 書き込み、削除
      GM_deleteValue(domain + " ::: " + name);
      return;
    } else if (typeof store === "string") { // 書き込み、文字列
      GM_setValue(domain + " ::: " + name, store);
      return store;
    } else { // 書き込み、配列
      try { GM_setValue(domain + " ::: " + name, JSON.stringify(store)); } catch (e) {
        console.log("データベースがバグっているのでクリアします\n" + e);
        pref(name, "");
      }
      return store;
    }
  }

  function before(e, html) { e?.insertAdjacentHTML('beforebegin', html); return e?.previousElementSibling; }

  function begin(e, html) { e?.insertAdjacentHTML('afterbegin', html); return e?.firstChild; }

  function end(e, html) { e?.insertAdjacentHTML('beforeend', html); return e?.lastChild; }

  function after(e, html) { e?.insertAdjacentHTML('afterend', html); return e?.nextElementSibling; }

  function verb() { if (VERBOSE) console.log(...arguments) }

  function cl(...args) {
    if (verbose) console.log(...args)
  }

  function lh(re) { let tmp = location.protocol == "file:" ? null : location.href.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可
  function ld(re) { let tmp = location.protocol == "file:" ? null : location.hostname.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可

  function getBekijouEle(ele) {
    if (lh(/\/\/www\.youtube\.com/)) return ele?.closest(`:is(ytd-video-renderer , ytd-rich-item-renderer , ytd-grid-video-renderer , ytd-playlist-video-renderer , ytd-reel-item-renderer.style-scope.yt-horizontal-list-renderer , ytd-compact-video-renderer , ytm-shorts-lockup-view-model-v2.shortsLockupViewModelHost , ytd-playlist-panel-video-renderer#playlist-items.style-scope.ytd-playlist-panel-renderer , yt-lockup-view-model)`) || ele?.parentNode || ele;
    else if (lh(/\/\/www\.yodobashi\.com/)) return ele?.closest(`div.srcResultItem_block.pListBlock.js_productBox.productListTile`) || ele?.parentNode || ele;
    //    else if (lh(/\/\/www\.amazon\.co/)) return ele?.closest(`div.a-section.a-spacing-small.puis-padding-left-small.puis-padding-right-small , [data-asin]`) || ele?.parentNode || ele;
    else if (lh(/\/\/www\.amazon\.co/)) return ele?.closest(`[data-asin]`) || ele?.parentNode || ele;
    else if (lh(/https:\/\/www\.google\.(?:[a-z\.]+)\/search\?/i)) return ele?.closest(`[data-viewer-group] [data-hveid][data-ved] , li.I8iMf`) || ele?.parentNode || ele;
    else if (lh(/\/\/duckduckgo\.com\/\?q\=/)) return ele?.closest(`.tile.tile--img.has-detail`) || ele?.parentNode || ele;
    else if (ld(/iherb\.com/)) return ele?.closest(`div.col-sm-12`) || ele?.parentNode || ele;
    else if (ld(/bilibili\.com/)) return ele?.closest(`.video-list.row>div`) || ele?.parentNode || ele;
    else if (ld(/www\.tiktok\.com/)) return ele?.closest(`[id*="grid-item-container-"]`) || ele?.parentNode || ele;
    else if (ld(/www\.nicovideo\.jp/)) return ele?.closest(`li.item.nrn-thumb-info-done`) || ele?.parentNode || ele;
    else return ele?.parentNode || ele;
  }

  function dragElement3(elesF, handleSel = "*", cancelSel = "", zindexcss = "", downF) {
    if (!dragElement3.done) dragElement3.done = new Set();
    elesF().filter(e => !dragElement3.done.has(e)).forEach(e => {
      dragElement3.done.add(e)
      dragElement2(e, handleSel, cancelSel, zindexcss, downF)
    })
  }

  function dragElement2(ele, handleSel = "*", cancelSel = "", zindexcss = "", downF) {
    let x, y;
    let targets = (handleSel == "*" ? [ele] : elegeta(handleSel, ele));
    targets.forEach(e => {
      e.onmousedown = dragMouseDown;
      e.style.cursor = "grab";
    });

    targets.forEach(e => { e.addEventListener("dblclick", e => { dragElement2?.bu?.has(ele) && ["position", "left", "top", "right", "bottom"].forEach((v, i) => { ele.style[v] = dragElement2.bu?.get(ele)[i] }) }) }) // ダブルクリックで元の位置に回復

    function dragMouseDown(e) {
      if ((cancelSel > "" && e?.target?.closest(cancelSel)) || e.button != 0) return;
      if (window.getComputedStyle(e?.target)?.resize == "both" && mousex > ele.offsetLeft + $(ele).width() - 12 && mousey > ele.getBoundingClientRect().top + $(ele).height() - 12) return; // resize:bothだったら右下の角は掴めない判定にする
      //if (e?.target?.style?.resize && mousex > ele.getBoundingClientRect().left + $(ele).width() - 8 && mousey > ele.getBoundingClientRect().top + $(ele).height() - 8) return; // resize:bothだったら右下の角は掴めない判定にする

      dragElement2.bu = dragElement2?.bu || new Map(); //元の位置を覚えておく 2025.04
      if (!dragElement2.bu.has(ele)) dragElement2.bu.set(ele, ["position", "left", "top", "right", "bottom"].map(v => ele?.style?.[v]));

      if (getComputedStyle(ele).backgroundColor == "rgba(0, 0, 0, 0)") setCSS(ele, `background-color: #fff;`) //position: relative;
      let maxZIndex = elegeta('*').reduce((a, b) => Math.max(a, (parseInt(getComputedStyle(b)?.zIndex) || 0) + 1), 0) //test 462回実行 / 1sec , 2.1645021645021645ミリ秒/１実行
      setCSS(ele, `z-index: ${maxZIndex+1}; `)

      e = e || window.event;
      e.preventDefault();
      var w = w || ele.getBoundingClientRect().width - elePadding(ele).left - elePadding(ele).right;
      //ele.style.minWidth = `${w}px`;
      //ele.style.maxWidth = `${w}px`;
      [x, y] = [e.clientX, e.clientY];
      elegeta('iframe').forEach(e => { e.style.pointerEvents = "none" }) //elegeta('iframe', e.target).forEach(e => { e.style.pointerEvents = "none" })
      if (zindexcss) e.target.style.zIndex = elegeta(zindexcss).reduce((a, b) => Math.max(a, b.style.zIndex), 0) + 1
      if (downF) downF(ele, e)
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elePadding(ele) {
      const style = window.getComputedStyle(ele);
      return {
        top: parseInt(style.paddingTop, 10),
        right: parseInt(style.paddingRight, 10),
        bottom: parseInt(style.paddingBottom, 10),
        left: parseInt(style.paddingLeft, 10)
      };
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      if (window.getComputedStyle(ele).position != "fixed") {
        let l = `${ele.getBoundingClientRect().left}px`;
        let t = `${ele.getBoundingClientRect().top}px`;
        ele.style.position = "fixed";
        ele.style.left = l;
        ele.style.top = t;
      }
      ele.dataset.moved = 1;
      if (ele.style.right) { // right:かbottom:で張り付いてるものなら剥がしてleft/topにする
        ele.style.left = `${ele.offsetLeft}px`
        ele.style.right = ""
      }
      if (ele.style.bottom) { // right:かbottom:で張り付いてるものなら剥がしてleft/topにする
        ele.style.top = `${ele.offsetTop}px`
        ele.style.bottom = ""
      }

      /*      ele.style.top = `${(ele.offsetTop - (y - e.clientY))}px`;
            ele.style.left = `${(ele.offsetLeft - (x - e.clientX))}px`;
      */
      let [ml, mt] = [parseFloat(getComputedStyle(ele)?.marginLeft || 0), parseFloat(getComputedStyle(ele)?.marginTop || 0)];
      ele.style.top = `${(ele.offsetTop - (y - e.clientY)) - mt}px`;
      ele.style.left = `${(ele.offsetLeft - (x - e.clientX)) - ml}px`;

      [x, y] = [e.clientX, e.clientY];
    }

    function closeDragElement(e) {
      document.onmouseup = null;
      document.onmousemove = null;
      elegeta('iframe').forEach(e => { e.style.pointerEvents = "auto" }) //elegeta('iframe', e.target).forEach(e => { e.style.pointerEvents = "auto" })
      if (getComputedStyle(ele)?.resize == "none") nearest(ele);
    }
  }

  function setCSS(ele, css) {
    css.trim().split(";").map(v => v.trim()).filter(v => v).map(v => v.split(":")).forEach(css => ele.style.setProperty(css?.[0].trim(), css?.[1].trim()))
  }

  function nearest(ele) {
    if (!(ele instanceof Element) || getComputedStyle(ele).position != 'fixed') return;
    const [viewportWidth, viewportHeight] = [document.documentElement.clientWidth, document.documentElement.clientHeight];
    const fontsize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const parentEle = ele.offsetParent || document.documentElement;
    const [parentWidth, parentHeight] = [parentEle.clientWidth, parentEle.clientHeight];
    const cStyle = getComputedStyle(ele);
    const parse = str => { if (!str || str === 'auto') return null; const hits = str.trim().match(/^(-?[\d.]+)([a-z%]*)$/i); return hits ? { val: +hits[1], unit: hits[2] || 'px' } : null; };
    const unit2px = (org, isVertical) => !org ? null : org.unit === 'px' ? org.val : org.unit === 'em' ? org.val * fontsize : org.unit === '%' ? (isVertical ? parentHeight * org.val / 100 : parentWidth * org.val / 100) : org.unit === 'vh' ? viewportHeight * org.val / 100 : org.unit === 'vw' ? viewportWidth * org.val / 100 : org.val;
    const px2unit = (px, unit, isVertical) => unit === 'px' ? px : unit === 'em' ? px / fontsize : unit === '%' ? (isVertical ? px / parentHeight * 100 : px / parentWidth * 100) : unit === 'vh' ? px / viewportHeight * 100 : unit === 'vw' ? px / viewportWidth * 100 : px;
    const [topP, bottomP, leftP, rightP] = [parse(cStyle.top), parse(cStyle.bottom), parse(cStyle.left), parse(cStyle.right)];
    const [topPx, bottomPx, leftPx, rightPx] = [unit2px(topP, true), unit2px(bottomP, true), unit2px(leftP, false), unit2px(rightP, false)];
    const rect = ele.getBoundingClientRect();
    const dist = { top: rect.top, bottom: viewportHeight - rect.bottom, left: rect.left, right: viewportWidth - rect.right };
    const useTop = topPx !== null && (bottomPx === null || dist.top <= dist.bottom);
    const useBottom = bottomPx !== null && !useTop;
    const useLeft = leftPx !== null && (rightPx === null || dist.left <= dist.right);
    const useRight = rightPx !== null && !useLeft;
    ele.style.top = (useTop) ? (topP ? px2unit(dist.top, topP.unit, true) : dist.top) + (topP ? topP.unit : 'px') : '';
    ele.style.bottom = (useBottom) ? (bottomP ? px2unit(dist.bottom, bottomP.unit, true) : dist.bottom) + (bottomP ? bottomP.unit : 'px') : '';
    ele.style.left = (useLeft) ? (leftP ? px2unit(dist.left, leftP.unit, false) : dist.left) + (leftP ? leftP.unit : 'px') : '';
    ele.style.right = (useRight) ? (rightP ? px2unit(dist.right, rightP.unit, false) : dist.right) + (rightP ? rightP.unit : 'px') : '';
  }

  function ctLong(callback, name = "test", time = 10) { console.time(name); for (let i = time; i--;) { callback() } console.timeEnd(name) } // 速度測定（もともと長くかかるもの）
  function ct(callback, name = "test", time = 10) { let i = 0; let st = Date.now(); while (Date.now() - st < 1000) { i++, callback() } console.log(`${name} ${i}回実行 / 1sec , ${1000/i}ミリ秒/１実行 ${callback.toString().slice(0,55)}`) } // 速度測定（一瞬で終わるもの）

})();