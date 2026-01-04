// ==UserScript==
// @name YouTubeのフィルタを表に出す
// @description フィルタボタンを押すのが面倒な人向け
// @version 0.1.2
// @run-at document-idle
// @match *://*.youtube.com/*
// @grant none
// @namespace https://greasyfork.org/users/181558
// @downloadURL https://update.greasyfork.org/scripts/487074/YouTube%E3%81%AE%E3%83%95%E3%82%A3%E3%83%AB%E3%82%BF%E3%82%92%E8%A1%A8%E3%81%AB%E5%87%BA%E3%81%99.user.js
// @updateURL https://update.greasyfork.org/scripts/487074/YouTube%E3%81%AE%E3%83%95%E3%82%A3%E3%83%AB%E3%82%BF%E3%82%92%E8%A1%A8%E3%81%AB%E5%87%BA%E3%81%99.meta.js
// ==/UserScript==

(function() {
  const interwait = 0; // 0～1000ぐらい:CSSの仕様変更があった場合フィルタメニューを開いて閉じる操作のウェイト　小さくすると画面が点滅する感じになるので光感受性発作に注意して大きくする

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

  var GF = {}

  setInterval(() => {
    if (document.visibilityState == "visible" && lh(/youtube\.com\/results\?search_query=/) && eleget0('#filter-button button yt-touch-feedback-shape div div , button.yt-spec-button-shape-next.yt-spec-button-shape-next--text.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-trailing.yt-spec-button-shape-next--enable-backdrop-filter-experiment:visible') && !eleget0("#filterExpandedContainer")) run();
  }, 1000)
  document.addEventListener('yt-navigate-finish', () => elegeta('#filterExpandedContainer').forEach(e => e?.remove()))

  return;

  function waitanddo(int, delay, ele, func, start = Date.now()) {
    setTimeout(() => {
      let e = ele()
      if (e && e?.length !== 0) { setTimeout(() => { func(e); return e; }, delay); return; }
      if (Date.now() - start < 10000 || document.visibilityState != "visible") waitanddo(Math.min(int + 100, 1000), delay, ele, func, start); // 10秒たったらやめるelse alert(int);
      //if (Date.now() - start < 10000) waitanddo(Math.min(int + 100, 1000), delay, ele, func, start); // 10秒たったらやめるelse alert(int);
    }, int)
  }

  function run(e) {
    var overlaycssid = addstyle.add('tp-yt-iron-overlay-backdrop.opened{opacity:0} tp-yt-paper-dialog{opacity:0.1}')
    elegeta('#filterExpandedContainer').forEach(e => e?.remove())
    after(eleget0('ytd-search-header-renderer.style-scope.ytd-search'), `<span id="filterExpandedContainer"></span>`)
    eleget0('#filter-button button yt-touch-feedback-shape div div , button.yt-spec-button-shape-next.yt-spec-button-shape-next--text.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-trailing.yt-spec-button-shape-next--enable-backdrop-filter-experiment:visible')?.click()
    waitanddo(111, 0, () => elegeta('tp-yt-paper-dialog.ytd-popup-container yt-formatted-string.style-scope.ytd-search-filter-group-renderer,tp-yt-paper-dialog.ytd-popup-container #endpoint:visible'), e => {
      GF.filterEle = e;
      waitanddo(interwait, 0, () => eleget0('yt-icon-button#close-button'), e => {
        if (GF?.filterEle?.length > 0) {
          elegeta('#filterExpandedContainer').forEach(e => e?.remove())
          after(eleget0('ytd-search-header-renderer.style-scope.ytd-search'), `<span id="filterExpandedContainer"></span>`)
          end(eleget0('#filterExpandedContainer'), `<div style="font-size:16px; margin:0.3em 0 0.3em 0;" id="filterExpanded"><span style="display:inline-block;">
  ${GF.filterEle.map((e,i,a)=>
  (e?.href ? `<a style="text-decoration: none;" href="${e?.href}">${sani(e.textContent?.trim())}</a>${a?.[i+1]?.href ? "｜":"　"}`
  :a[i-1]?.href ? `</span>　<span style="display:inline-block;">`
  :""
  ))?.join("")?.trim()}
  </span><div>`)
        }
        eleget0('yt-icon-button#close-button')?.click()
        setTimeout(() => addstyle.remove(overlaycssid), 999)
      })
    })
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
      if (/:inscreen/.test(xpath)) array = array.filter(e => { var eler = e.getBoundingClientRect(); return (eler.bottom >= 0 && eler.right >= 0 && eler.left <= document.documentElement.clientWidth && eler.top <= document.documentElement.clientHeight) }) // 画面内に1ピクセルでも入っている
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


  function before(e, html) { e?.insertAdjacentHTML('beforebegin', html); return e?.previousElementSibling; }

  function begin(e, html) { e?.insertAdjacentHTML('afterbegin', html); return e?.firstChild; }

  function end(e, html) { e?.insertAdjacentHTML('beforeend', html); return e?.lastChild; }

  function after(e, html) { e?.insertAdjacentHTML('afterend', html); return e?.nextElementSibling; }

  function lh(re) { let tmp = location.href.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可
  function ld(re) { let tmp = location.hostname.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可
  function sani(s) { return s?.replace(/&/g, "&amp;")?.replace(/"/g, "&quot;")?.replace(/'/g, "&#39;")?.replace(/`/g, '&#x60;')?.replace(/</g, "&lt;")?.replace(/>/g, "&gt;") || "" }

})()