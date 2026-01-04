// ==UserScript==
// @name:zh-tw      Line Store 貼圖輕鬆下載器
// @name            Line Store Easy Sticker Downloader
// @namespace       com.sherryyue.linestickerstoredownloader
// @version         0.5
// @description:zh-tw 此腳本讓用戶能輕鬆下載 Line 貼圖商店網站上的貼圖。左鍵點擊任何貼圖時，預覽圖將在新分頁中開啟，方便瀏覽或右鍵下載貼圖。
// @description       This script allows users to easily download stickers from the Line Store website. By left-clicking on any sticker, the preview image will open in a new tab, making it simple to view or download the sticker using the right-click menu.
// @author          SherryYue
// @copyright       SherryYue
// @license         MIT
// @match           https://store.line.me/*
// @supportURL      sherryyue.c@protonmail.com
// @icon            https://sherryyuechiu.github.io/card/images/logo/maskable_icon_x96.png
// @require         https://code.jquery.com/jquery-3.6.0.js
// @require         https://code.jquery.com/ui/1.13.1/jquery-ui.js
// @supportURL      "https://github.com/sherryyuechiu/GreasyMonkeyScripts/issues"
// @homepage        "https://github.com/sherryyuechiu/GreasyMonkeyScripts"
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/457224/Line%20Store%20Easy%20Sticker%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/457224/Line%20Store%20Easy%20Sticker%20Downloader.meta.js
// ==/UserScript==

(function () {
  let downloadImage = (url) => {
    var a = document.createElement('a');
    a.href = url;
    a.download = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  let main = () => {
    $('.FnStickerPreviewItem').on("click", function () {
      let data = JSON.parse($(this).attr('data-preview'));
      let clearImageUrl = data.fallbackStaticUrl;
      downloadImage(clearImageUrl);
      console.warn('data', data)
    });
  }

  function observerFallBack(mutations, obs) {
    if (!document.querySelector(".FnStickerPreviewItem")) return;
    setTimeout(main, 250);
    observer.disconnect();
  }

  let observer = new MutationObserver(observerFallBack);
  observer.observe(document.querySelector("body"), {
    childList: true,
    subtree: true
  });
  setTimeout(observerFallBack, 250);

  document.getElementsByTagName('head')[0].append(
    '<link '
    + 'href="//code.jquery.com/ui/1.13.1/themes/base/jquery-ui.css" '
    + ' type="text/css">'
  );
})();

