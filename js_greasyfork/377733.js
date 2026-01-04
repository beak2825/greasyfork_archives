// ==UserScript==
// @name -で指定した要素をオートフォーカス
// @description [-]：Escで戻る＋オートフォーカス要素に登録（上端）　Shift+[-]：Escで戻る＋オートフォーカス要素に登録（中央）　Shift+Ctrl+[-]：Escで戻る要素に登録（中央）　Esc：そこに戻る
// @match *://*/*
// @run-at document-idle
// @version     0.5.4
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @namespace https://greasyfork.org/users/181558
// @downloadURL https://update.greasyfork.org/scripts/377733/-%E3%81%A7%E6%8C%87%E5%AE%9A%E3%81%97%E3%81%9F%E8%A6%81%E7%B4%A0%E3%82%92%E3%82%AA%E3%83%BC%E3%83%88%E3%83%95%E3%82%A9%E3%83%BC%E3%82%AB%E3%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/377733/-%E3%81%A7%E6%8C%87%E5%AE%9A%E3%81%97%E3%81%9F%E8%A6%81%E7%B4%A0%E3%82%92%E3%82%AA%E3%83%BC%E3%83%88%E3%83%95%E3%82%A9%E3%83%BC%E3%82%AB%E3%82%B9.meta.js
// ==/UserScript==

(function() {
  const scrollBehavior = "smooth"; // smooth:スムーズ、instant:瞬間、auto:ブラウザデフォルト
  var kaisuu = 0; // Escを押すたびに複数の候補を順にフォーカス

  const maxLines = 5; // 一度に提案する最大数調整　大きいほど少ない（maxLines/縦解像度）
  const TryMulti = 15; // 一度に生成する試行回数調整　増やすと沢山試す＝遅い代わりに結果が増える
  var excludeRE = "@data|@href=|width|height|@title=|@alt=|@src="; //"@href=|text\\(\\)|@title=|@alt=|@src="; // o,pキーではこれを含むXPath式は除外する 例：/href|text\(\)/ or /\0/
  var requireRE = "";
  var requireHits = 1;
  const CancelStyle = /box-shadow: none;|\@style=\"\"|(\sand\s)\sand\s|\[\]|\sand\s(\])/gmi;
  const cancelrep = "$1$2";

  var mousex = 0;
  var mousey = 0;

  document.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable || ((e.target.closest('#chat-messages,ytd-comments-header-renderer') || document.activeElement.closest('#chat-messages,ytd-comments-header-renderer')))) return;
    var key = (e.shiftKey ? "Shift+" : "") + (e.altKey ? "Alt+" : "") + (e.ctrlKey ? "Ctrl+" : "") + e.key;
    var ele = document.elementFromPoint(mousex, mousey);
    if (key === "Escape") { // esc
      loadfocus2("onesc");
    }
    if (key === "Shift+Ctrl+=") { // shift+ctl+- Escで戻る機能だけ
      ele.focus()
      var xp = mark("esc", ele);
      e.preventDefault();
    }
    if (key === "-") { // -　画面の上端
      e.preventDefault();
      ele.focus()
      var xp = mark("start", ele);
    }
    if (key === "Shift+=") { // shift+-　画面の中央
      ele.focus()
      var xp = mark("center", ele);
      e.preventDefault();
    }
  }, false);

  document.addEventListener("mousemove", function(e) {
    mousex = e.clientX;
    mousey = e.clientY;
  }, false);

  //setTimeout(() => { if (window.scrollY < 2) { loadfocus() } }, 100)
  if (window.scrollY < 2) { loadfocus() }

  return;

  function loadfocus(times = 0) {
    let xp = pref("mAutoFocusXPath") || "";
    if (!xp || times > 5000) return false;
    //    if (eleget0(xp)) { setTimeout(() => { loadfocus2(); }, 200); return; } else setTimeout(() => { loadfocus(times + 200); }, 200)
    if (eleget0(xp)) { loadfocus2(); return; } else setTimeout(() => { loadfocus(times + 200); }, 200)
  }

  async function loadfocus2(mode = "onload") {

    var xp = (mode.match(/esc/) ? pref("mAutoFocusXPathEsc") : (mode = "esc", pref("mAutoFocusXPath"))) || pref("mAutoFocusXPath");
    if (!xp) return;
    var yblock = pref("mAutoFocusXPathYBlock") || "center";
    var elea = elegeta(xp);
    if (elea.length) {
      let ele = elea[(++kaisuu) % elea.length]

      function yobu(e) {
        if (!document.hidden) {
          focus3(this.ele)
          document.removeEventListener('visibilitychange', this, false);
        }
      }

      if (document.hidden) {
        document.addEventListener('visibilitychange', {
          handleEvent: yobu,
          ele: ele,
        }, false);
      } else {
        focus3(ele)
      }

      function focus3(ele) {
        ele.focus()
        end(document.head, `<style id="minusdeautofocus">input.minusdeautofocus:focus,textarea.minusdeautofocus:focus{animation: pulse 1s 1; } @keyframes pulse { 0% { box-shadow: 0 0 0 0 #00ff00f0; } 100% { box-shadow: 0 0 10px 35px #00ff0000; } } .minusdeautofocus {outline: rgba(0, 250,0,0.7) solid 4px !important;}</style>`)
        ele.classList.add('minusdeautofocus')
        setTimeout((function(e) {
          return function() {
            e.classList.remove('minusdeautofocus');
            eleget0('#minusdeautofocus')?.remove();
          }
        }(ele)), 1000);
        if (mode != "onload" && (ele.tagName != "INPUT" && ele.tagName != "TEXTAREA")) ele.scrollIntoView({ behavior: scrollBehavior, block: (yblock || "center"), inline: "center" });
      }
    }
  }

  function mark(mode, ele = document.elementFromPoint(mousex, mousey)) {
    var ls = (mode == "esc" ? pref("mAutoFocusXPathEsc") : (mode == pref("mAutoFocusXPathYBlock") ? pref("mAutoFocusXPath") : "")) || "";
    var xp0 = getElementXPath0(ele);

    var tmp = eleget0(xp0);

    if (ls.indexOf(xp0) > -1) var teianxp = ls;
    else var teianxp = (ls == "" ? xp0 : (ls + "|." + xp0));
    var xp = promptHE(ls, "『" + (new URL(location.href).hostname || location.href) + "』で\n\n・" + (mode != "esc" ? "オートフォーカスする場所" + (mode != "center" ? "（合わせ位置：画面の上端）" : "（合わせ位置：画面の中央）") + "\n・Escで戻る場所" : "Escで戻る場所") +
      "\n\nをXpathで指定してください\n|で区切って記述すると複数をOR指定できます\n\n現在の設定値：\n" + (
        "1or2) Esc+Focus: " + (pref("mAutoFocusXPath") || "") + "\n" +
        "3) Escのみ: " + (pref("mAutoFocusXPathEsc") || "") + "\n"
      ) + "\n今指した要素：\n" + xp0 + "\n\nTips:\n1 [-]：Escで戻る＋オートフォーカス要素に登録（画面上端）\n2 Shift+[-]：Escで戻る＋オートフォーカス要素に登録（画面中央）\n3 Shift+Ctrl+[-]：Escで戻る要素に登録（画面中央）\n\n※空欄にすると削除します", teianxp);
    if (xp === null) return;
    if (xp === "") {
      if (mode == "start" || mode == "center") {
        pref("mAutoFocusXPath", null);
        pref("mAutoFocusXPathYBlock", null);
      }
      if (mode == "esc") {
        pref("mAutoFocusXPathEsc", null);
      }
      return;
    }
    var ele = eleget0(xp);
    if (ele) {
      if (mode == "esc") {
        pref("mAutoFocusXPathEsc", xp);
      } else {
        pref("mAutoFocusXPath", xp);
        pref("mAutoFocusXPathYBlock", mode);
      }
      loadfocus2("on" + mode);
    } else {
      alert(xp + "\n" + "要素が見つかりませんでした\n設定は変更しません\n");
      return;
    }
  }

  function str2numMinMax(str, min, max) {
    var ans = Number(str.replace(/[Ａ-Ｚａ-ｚ０-９．]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 65248);
    }).replace(/[^-^0-9^\.]/g, ""));
    if (ans > max) ans = max;
    if (ans < min) ans = min;
    return ans;
  }

  function getElementXPath0(ele) {
    //    var path = "";
    var paths = makecontent(0, ele);
    var path = paths[0];
    for (let p of paths) {
      if (p.match(/@class|@id=/)) { path = p; break; }
    }
    //      path = "/" + ele.tagName + (!ele.tagName.match(/html|body/gi) ? "[" + idx + "]" : "") + path;
    return path;
  }


  function makecontent(mode, ele) {
    var retStr = [];
    var maxline = 3000; //window.innerHeight / maxLines;
    var maxtrial = 3000; //maxline * TryMulti * (mode != 9 ? 32 : 3) * (requireRE > "\0" ? 3 : 1) * ((mode == 0 && requireHits == 1) ? 3 : 1);
    var retStrl = 0;
    hajime();
    for (var i = 0; i < maxtrial && retStrl < maxline; i++) {
      var xp = getElementXPath(mode, ele);
      if (xp && !(mode !== 9 && RegExp(excludeRE, "i").test(xp))) {
        retStr.push(xp);
        var retStr = retStr.sort().reduce(function(previous, current) { if (previous[previous.length - 1] !== current) { previous.push(current); } return previous; }, []).sort(function(a, b) { return a.length - b.length < 0 ? -1 : 1; }); // 重複を削除＆ソート
        retStrl = retStr.length;
        if (xp.length < 60 && xp.match(/@class|@id=/)) {
          //console.log(xp);
          i += 600
        }
      }
    }
    owari();
    //console.log("trymax:" + maxtrial + "\nmakemax:" + maxline + "\ntried:" + i + "\nmake:" + retStr.length);
    // 1つは全属性を記述しただけのもの
    if (getAttrOfEle(mode, ele, true)) {
      var path = "//" + ele.tagName + "[" + getAttrOfEle(mode, ele, true) + "";
      retStr.push(path.replace(CancelStyle, cancelrep).replace(CancelStyle, cancelrep));
    }
    // 1つはフルパスを辿っただけのもの
    retStr.push(getElementXPathFullPath(ele).replace(CancelStyle, cancelrep).replace(CancelStyle, cancelrep));
    // 1つはフルパス全属性を辿っただけのもの
    retStr.push(getElementXPathFullpathAndFullproperty(mode, ele).replace(CancelStyle, cancelrep).replace(CancelStyle, cancelrep));

    return retStr;
  }

  function getElementXPath(mode, ele) {
    var path = "";
    var origele = ele;
    for (let i = 0; i == 0 || (ele && ele.nodeType == 1 && Math.random() > 0.5); ele = ele.parentNode, i++) {

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
    if (requireRE > "" && !(RegExp(requireRE, "i").test(path))) return "";

    let hits = elegeta(path).length; // 検算
    if (hits == 0 || (mode == 8 && hits < 2) || (mode == 0 && requireHits != hits)) return false;
    return path;
  }

  function getAttrOfEle(mode, ele, allFlag = false) {
    if (ele.tagName.match(/html|body/gmi)) return "";
    let attrs = ele.attributes;
    let xp = "";
    let att2 = [];
    for (let att of attrs) {
      if (att.value.length < 100) {
        if (att.name == "class" && Math.random() > 0.9 && !allFlag) {
          att2.push({ name: "contains(@class,", value: "\"" + att.value + "\")" })
        } else {
          att2.push({ name: "@" + att.name + "=", value: "\"" + att.value + "\"" })
        }
      }
    }

    //text
    if (!allFlag) {
      if (Math.random() > (0.7)) {
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

  function str2numMinMax(str, min, max) {
    var ans = Number(str.replace(/[Ａ-Ｚａ-ｚ０-９．]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 65248);
    }).replace(/[^-^0-9^\.]/g, ""));
    if (ans > max) ans = max;
    if (ans < min) ans = min;
    return ans;
  }

  function elegeta(xpath, node = document) {
    if (!xpath || !node) return [];
    //    let xpath2 = xpath.replace(/:inv?screen|:visible|:text\*=[^:]*/g, "") // text*=～中で:は使えない
    let xpath2 = xpath.replace(/:inscreen|:visible|:text\*=[^:]*/g, "") // text*=～中で:は使えない
    let array = []
    try {
      if (!/^\.?\//.test(xpath)) {
        array = [...node.querySelectorAll(xpath2)]
      } else {
        var snap = document.evaluate("." + xpath2, node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null)
        let l = snap.snapshotLength
        for (var i = 0; i < l; i++) array[i] = snap.snapshotItem(i)
      }
      if (/:visible/.test(xpath)) array = array.filter(e => e.offsetHeight)
      //if (/:invscreen/.test(xpath)) array = array.filter(e => { var eler = e.getBoundingClientRect(); return (eler.bottom >= 0 && eler.top <= document.documentElement.clientHeight) }) // 画面縦内に1ピクセルでも入っている
      else if (/:inscreen/.test(xpath)) array = array.filter(e => { var eler = e.getBoundingClientRect(); return (eler.bottom >= 0 && eler.right >= 0 && eler.left <= document.documentElement.clientWidth && eler.top <= document.documentElement.clientHeight) }) // 画面内に1ピクセルでも入っている
      if (/:text\*=./.test(xpath)) { let text = xpath.replace(/^.*:text\*=([^:]*)$/, "$1"); if (text) array = array.filter(e => new RegExp(text).test(e?.textContent)) }
    } catch (e) { return []; }
    return array
  }

  function eleget0(xpath, node = document) {
    if (!xpath || !node) return null;
    //    if (/:inv?screen|:visible|:text\*=/.test(xpath)) return elegeta(xpath, node)?.shift();
    if (/:inscreen|:visible|:text\*=/.test(xpath)) return elegeta(xpath, node)?.shift();
    if (!/^\.?\//.test(xpath)) return node.querySelector(xpath);
    try {
      var ele = document.evaluate("." + xpath, node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
      return ele.snapshotLength > 0 ? ele.snapshotItem(0) : null;
    } catch (e) { alert(e + "\n" + xpath + "\n" + JSON.stringify(node)); return null; }
  }
  /*  function eleget0(xpath) {
      try { var ele = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null) } catch (err) { return ""; }
      var ele = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
      return ele.snapshotLength > 0 ? ele.snapshotItem(0) : "";
    }
    function elegeta(xpath, node = document) {
      try { var ele = document.evaluate("." + xpath, node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null) } catch (err) {
        var ele = "err";
      }
      var array = [];
      for (var i = 0; i < ele.snapshotLength; i++) array[i] = ele.snapshotItem(i);
      return array;
    }
  */
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
    //console.log('処理時間:' + elapsed_ms / 1000 + "秒");
  }

  function promptHE(present, text, shoki) { // prompt with handling esc
    let str = prompt(text, shoki);
    //console.log(str)
    if (str === null) return present;
    else return str;
  }

  function pref(name, store = undefined) { // prefs(name,data)で書き込み（数値でも文字列でも配列でもオブジェクトでも可）、prefs(name)で読み出し
    //var domain = (location.href.match(/^https?:\/{2,}(.*?)(?:\/|\?|#|$)/)[1] || location.href);
    var domain = (new URL(location.href).hostname || location.href);
    if (store === undefined) { // 読み出し
      let data = GM_getValue(domain + " ::: " + name)
      if (data == undefined) return; // 値がないなら終わり
      if (data.substr(0, 1) === "[") { // 配列なのでJSONで返す
        try { return JSON.parse(data || '[]'); } catch (e) {
          console.log("データベースがバグってるのでクリアします\n" + e);
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
        console.log("データベースがバグってるのでクリアします\n" + e);
        pref(name, "");
      }
      return store;
    }
  }

  function before(e, html) { e.insertAdjacentHTML('beforebegin', html); return e?.previousElementSibling; }

  function begin(e, html) { e.insertAdjacentHTML('afterbegin', html); return e?.firstChild; }

  function end(e, html) { e.insertAdjacentHTML('beforeend', html); return e?.lastChild; }

  function after(e, html) { e.insertAdjacentHTML('afterend', html); return e?.nextElementSibling; }


})();
