// ==UserScript==
// @name コミックDAYS＆くらげバンチ＆マガポケ＆ジャンプ＋＆となりのヤングジャンプ＆WEBヒーローズ＆Pixivコミック　左キーだけでどんどん読む
// @description 「次の話を読む」や「この作品の無料公開中の話へ」ボタンが出た時に左キーでそれをクリックします　Enterで最新話に移動　fや[で全画面化
// @match *://comic-days.com/episode/*
// @match *://kuragebunch.com/episode/*
// @match *://pocket.shonenmagazine.com/episode/*
// @match *://shonenjumpplus.com/episode/*
// @match *://tonarinoyj.jp/episode/*
// @match *://viewer.heros-web.com/episode/*
// @match *://comic.pixiv.net/viewer/*
// @match *://mangacross.jp/comics/*
// @match *://comic-action.com/episode/*
// @match *://ashitano.tonarinoyj.jp/series/*
// @match *://daysneo.com/works/*
// @match *://rookie.shonenjump.com/series/*
// @match *://kodansha-cc.co.jp/comic/*
// @match *://viewer.ganganonline.com/manga/*
// @match *://www.mangabox.me/reader/*
// @match *://r-cbs.mangafactory.jp/*
// @match *://comic-gardo.com/episode/*
// @match *://comic-zenon.com/episode/*
// @match *://magcomi.com/episode/*
// @match *://curazy.com/manga/viewer*
// @match *://comic-trail.jp/pt/*
// @match *://piccoma.com/web/viewer/*
// @match *://wanibooks-newscrunch.com/articles/viewer/*
// @match *://urasunday.com/title/*
// @match *://feelweb.jp/episode/*
// @match *://www.sunday-webry.com/episode/*
// @match https://comicborder.com/episode/*
// @match *://comic-ogyaaa.com/*
// @match https://comic-trail.com/episode/*
// @match *://www.corocoro.jp/episode/*
// @match *://comic-growl.com/*
// @match https://ichicomi.com/episode/*
// @run-at document-idle
// @grant GM_addStyle
// @version 0.6.27
// @namespace https://greasyfork.org/users/181558
// @require https://code.jquery.com/jquery-3.4.1.min.js
// @require https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @downloadURL https://update.greasyfork.org/scripts/376311/%E3%82%B3%E3%83%9F%E3%83%83%E3%82%AFDAYS%EF%BC%86%E3%81%8F%E3%82%89%E3%81%92%E3%83%90%E3%83%B3%E3%83%81%EF%BC%86%E3%83%9E%E3%82%AC%E3%83%9D%E3%82%B1%EF%BC%86%E3%82%B8%E3%83%A3%E3%83%B3%E3%83%97%EF%BC%8B%EF%BC%86%E3%81%A8%E3%81%AA%E3%82%8A%E3%81%AE%E3%83%A4%E3%83%B3%E3%82%B0%E3%82%B8%E3%83%A3%E3%83%B3%E3%83%97%EF%BC%86WEB%E3%83%92%E3%83%BC%E3%83%AD%E3%83%BC%E3%82%BA%EF%BC%86Pixiv%E3%82%B3%E3%83%9F%E3%83%83%E3%82%AF%E3%80%80%E5%B7%A6%E3%82%AD%E3%83%BC%E3%81%A0%E3%81%91%E3%81%A7%E3%81%A9%E3%82%93%E3%81%A9%E3%82%93%E8%AA%AD%E3%82%80.user.js
// @updateURL https://update.greasyfork.org/scripts/376311/%E3%82%B3%E3%83%9F%E3%83%83%E3%82%AFDAYS%EF%BC%86%E3%81%8F%E3%82%89%E3%81%92%E3%83%90%E3%83%B3%E3%83%81%EF%BC%86%E3%83%9E%E3%82%AC%E3%83%9D%E3%82%B1%EF%BC%86%E3%82%B8%E3%83%A3%E3%83%B3%E3%83%97%EF%BC%8B%EF%BC%86%E3%81%A8%E3%81%AA%E3%82%8A%E3%81%AE%E3%83%A4%E3%83%B3%E3%82%B0%E3%82%B8%E3%83%A3%E3%83%B3%E3%83%97%EF%BC%86WEB%E3%83%92%E3%83%BC%E3%83%AD%E3%83%BC%E3%82%BA%EF%BC%86Pixiv%E3%82%B3%E3%83%9F%E3%83%83%E3%82%AF%E3%80%80%E5%B7%A6%E3%82%AD%E3%83%BC%E3%81%A0%E3%81%91%E3%81%A7%E3%81%A9%E3%82%93%E3%81%A9%E3%82%93%E8%AA%AD%E3%82%80.meta.js
// ==/UserScript==

(function() {
  let COLL = (a, b) => (new Intl.Collator("ja", { numeric: true, sensitivity: 'base' }).compare)(a.textContent, b.textContent)

  function latestReadable(s = 1) {
    $(`.enterdisp`).remove();
    if (ld("kuragebunch")) {
      let dates = elegeta('time[class*="index-module--series-episode-list-date--"] , span.series-episode-list-date').sort(COLL);
      let epiBoxes = dates.map(e => e.closest('ul[class*="index-module--series-episode-list--"] > li , li.episode'));
      let freeBoxes = epiBoxes.filter(e => eleget0('span[class*="index-module--series-episode-list-is-free--"] , span.test-readable-product-is-free.series-episode-list-is-free', e));
      let chosenBox = s ? freeBoxes?.pop() : frees?.shift();
      if (!chosenBox) return;
      let forDisp = eleget0('time[class*="index-module--series-episode-list-date--"] , span.series-episode-list-date', chosenBox)?.parentNode;
      let link = eleget0('a', chosenBox)
      end(forDisp, `<span class="enterdisp">(Enter)</span>`);
      return link;
    }
    // generic
    let l = elegeta('div.series-episode-list-title-wrapper.test-readable-product-item-title , ul.lqZczAJslwNiA3lOHO3Q > li > a , li.HKk5yLHCfNleZOC5_Q2p , div[class*="index-module--series-episode-list-title-wrapper--"]')
      .filter(e => !e.innerText.match(/公開は終了しました/) && !eleget0('p.test-readable-product-point.point , p.eDnJnjjkB4KebMMcVbBi , p[class*="index-module--point--"] , span.series-episode-list-private , span[class*="index-module--rental-point--"]', e.closest("li")))
      .sort(COLL)?.pop()
    end(l, `<span class="enterdisp">(Enter)</span>`);
    return l && eleget0('span.series-episode-list-date , span.cvKkAbN8tUWlwq0W0aVk , span[class*="index-module--series-episode-list-date--"]', l) || l;
  }
  const KeyNextReadableEpisode = "ArrowLeft";
  const KeyLatestReadableEpisode = "Enter";
  const KeyFullScreen1 = "[";
  const KeyFullScreen2 = "f";
  let latestClick = 0

  let GF = {};


  // 最新話グループにページネーション
  ld(`ichicomi.com`, `comicborder.com`, `shonenjumpplus.com`, `tonarinoyj.jp`, `heros-web.com`, `comic-days`, `kuragebunch`, `pocket.shonenmagazine.com`, `www.sunday-webry.com`) && waitAndDo(() => eleget0('div[class*="index-module--tab--"]:visible'), e => {
    elegeta('div[class*="index-module--tab--"]:visible').reduce((a, b) => (+a?.textContent?.match0(/\-?[\d\,\.]+/) || 0) < +(b?.textContent?.match0(/\-?[\d\,\.]+/) || 0) ? b : a, 0)?.click();
    document?.activeElement?.blur()
    setTimeout(() => document?.body?.focus(), 222)
    setTimeout(() => {
      eleget0('section.episode-header')?.click();
      eleget0('section.episode-header')?.focus()
    }, 555)
  })

  function waitAndDo(checkFunc, func) { // checkFuncがtrueになったらfuncを実行
    if (!checkFunc()) setTimeout(waitAndDo, 333, checkFunc, func);
    else func();
  }

  setInterval(openacc, 2000); // アコーディオンを開く
  document.addEventListener("scroll", openacc)

  function openacc() {
    if (eleget0('span.loading-text:visible')) return;
    setTimeout(() => {
      var ele = elegeta(':is(div.js-readable-products-pagination.readable-products-pagination , div.js-readable-product-list , ul[class*="index-module--series-episode-list--"]) :is(section.read-more-container button , button.js-read-more-button , section[class*="index-module--read-more-container--"] > button):visible').concat(elegeta('div.series-comment-contents-box button.comment-more-button.js-series-comment-read-more-button:inscreen:visible'))
      if (ele.length && Date.now() - (GF?.lastoa || 0) >= 2000) {
        $(ele).click().effect("highlight");
        GF.lastoa = Date.now();
      }
    }, 500);
  }

  GM_addStyle(".lightup { box-shadow: 0px 0px 10px 10px rgba(0, 250, 0, 0.5), inset 0 0 100px rgba(0, 250, 0, 0.2) !important; outline: rgba(0, 250,0,0.7) solid 4px !important; outline-offset: 1px !important; }")

  // 次の話に←表示
  var nextl = '//div[@class="viewer-colophon-info-wrapper"]/div[@class="viewer-colophon-info"]/p[@class="viewer-colophon-next-episode"]/a[@class="next-link test-back-matter-next-link"]|//a[contains(@class,"next-episode-free-link common-button")]|//a[@class="next-open-link"]|//a[contains(text(),"次の話")]|//div[@class="end-page__box"]/div[2]/a[contains(text(),"次のエピソードを読む")]|//li/a[@class="ui-button-colophon js-next-episode"]|//div[@id="end_page"]/p/a/span[contains(text(),"次の話へ")]|//a[@class="button next-episode-button"]|//a[@class="btn btn-next" and text()="次の話を読む"]|//div/button[contains(text(),"次の話へ")]|//a[@class="lastSlider_nextButton"]|//div[@id="rc_next"]|//a[@class="viewer_commonButton viewer_commonButton-gotoNext jsViewer_commonButton"]|//div[@class="r-linkbutton_orange r-main"]/a[contains(text(),"次の話を読む")]|//div[@class="article-comic-slider__item-next"]/div/a[contains(text(),"次の話を読む")]|//a[@class="next-episode-free-link   common-button"]';

  var leftArrowTimer = setInterval(() => {
    var ele = eleget0(nextl);
    if (isinscreen(ele) && !ele.innerText.match(/ \(←\)/)) {
      ele.innerText += " (←)";
    }
  }, 500);

  var writeEnter = setInterval(() => {
    let e = latestReadable()
  }, 500)

  // １，下にスクロールさせてエピソードリンクを読み込ませる
  var ele = eleget0('//div[@class="episode-header-container"]');
  ele && $("html,body").animate({ scrollTop: $(ele).offset().top });

  // ２，一番上にスクロールを戻す
  if (!lh("rookie.shonenjump.com")) {
    scr2()

    function scr2() {
      if (document.visibilityState == "visible" && eleget0('time[class*="index-module--series-episode-list-date--"] , span.series-episode-list-date:inscreen')) {
        //setTimeout(() => {
        $(eleget0('//div[@id="btn-scale"]/div[1]/div[text()="拡大"]|//span[@class="viewer-btn-expand js-viewer-btn-expand"]|//button[@class="viewer-button viewer-button--max"]/img')).click(); // 「拡大」ボタンがあれば押す
        $("html,body").animate({ scrollTop: 0 });
        //}, ld("kuragebunch")?666:160)
      } else {
        setTimeout(scr2, 111)
      }
    }
  }

  document.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
    if (!e.getModifierState("Alt") && !e.getModifierState("Control") && !e.getModifierState("Shift") && e.key === KeyNextReadableEpisode) { // 左キー
      var ele = eleget0(nextl);
      if (isinscreen(ele)) {
        if (Date.now() - latestClick < 1500) return false; // 1秒に1回以上は抑制
        latestClick = Date.now();
        lightup(ele);
        ele.click();
        ele.focus();
        ele.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      }
    }

    if (!e.getModifierState("Alt") && !e.getModifierState("Control") && !e.getModifierState("Shift") && e.key === KeyLatestReadableEpisode) { // Enterキー
      var ele = latestReadable()
      if (ele) {
        if (Date.now() - latestClick < 1500) return false; // 1秒に1回以上は抑制
        latestClick = Date.now();
        lightup(ele);
        ele.click();
        ele.focus();
        ele.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      } else eleget0('//div[@class="episode-header-container"]') && eleget0('//div[@class="episode-header-container"]').scrollIntoView();
    }

    if (!e.getModifierState("Alt") && !e.getModifierState("Control") && !e.getModifierState("Shift") && e.key === "a") { // a::
      domsort(eleget0('//ul[@class="series-comment-contents-list js-series-comment-list"]'), elegeta('//li[@class="comment-container js-series-report-comment-container"]'), v => parseInt(eleget0('//span[@class="comment-likes-number js-comment-like-counts"]|.//span[@class="comment-likes-number js-comment-like-counts comment-like-counts-zero"]', v)?.innerText))
    }

    if (!e.getModifierState("Alt") && !e.getModifierState("Control") && !e.getModifierState("Shift") && (e.key === KeyFullScreen1 || e.key === KeyFullScreen2)) { // f [ 全画面化
      var y = window.pageYOffset;
      if (!document.fullscreenElement) {
        let p = document.documentElement.requestFullscreen();
        p.catch(() => {});
      } else {
        if (document.exitFullscreen) {
          let p = document.exitFullscreen();
          p.catch(() => {});
        }
      }
      setTimeout(window.scroll, 100, 0, y);
    }
  }, false)
  return

  function elegeta(xpath, node = document) {
    if (!xpath || !node) return [];
    if (typeof xpath === "function") return xpath() // !!!
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
    //if (typeof xpath === "function") return xpath() // !!!
    //    if (/:inv?screen|:visible|:text\*=/.test(xpath)) return elegeta(xpath, node)?.shift();
    if (/:inscreen|:visible|:text\*=/.test(xpath)) return elegeta(xpath, node)?.shift();
    if (!/^\.?\//.test(xpath)) return node.querySelector(xpath);
    try {
      var ele = document.evaluate("." + xpath, node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
      return ele.snapshotLength > 0 ? ele.snapshotItem(0) : null;
    } catch (e) { alert(e + "\n" + xpath + "\n" + JSON.stringify(node)); return null; }
  }

  function isinscreen(ele, wait = "nowait") {
    if (!ele || (wait == "wait" && $(eleget0('//span[@class="loading-text"]')).is(":visible"))) return 0;
    var eler = ele.getBoundingClientRect();
    return (eler.top > 0 && eler.left > 0 && eler.left < window.parent.screen.width && eler.top < window.parent.screen.height);
  }

  function lightup(ele) {
    ele.classList.add("lightup")
    setTimeout(() => ele.classList.remove("lightup"), 1000);
  }

  function domsort(container, doms, func, prepend = 0) { // prepend:1ならcontainerの最初に付ける、0なら最後に付ける
    doms.map(function(v) { return { dom: v, value: func(v) } }).sort(function(a, b) { return (typeof Number(a.value) && Number(b.value) ? (b.value - a.value) : (a.value < b.value ? 1 : -1)) }).forEach(function(v) { prepend ? container.prepend(v.dom) : container.appendChild(v.dom); });
  }

  function lh(re) { let tmp = location.protocol == "file:" ? null : location.href.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可
  //  function ld(re) { let tmp = location.protocol == "file:" ? null : location.hostname.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可
  function ld(...re) { return location.protocol == "file:" ? null : re?.flat()?.some(v => location.hostname.match(v)) }

  function before(e, html) { e?.insertAdjacentHTML('beforebegin', html); return e?.previousElementSibling; }

  function begin(e, html) { e?.insertAdjacentHTML('afterbegin', html); return e?.firstChild; }

  function end(e, html) { e?.insertAdjacentHTML('beforeend', html); return e?.lastChild; }

  function after(e, html) { e?.insertAdjacentHTML('afterend', html); return e?.nextElementSibling; }


})();