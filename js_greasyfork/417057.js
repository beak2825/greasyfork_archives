// ==UserScript==
// @name         ミストレforSPブラウザ フルスクリーン化
// @version      0.0.0.1
// @description  ミストトレインガールズのSPブラウザ版から余計な要素を除去します。
// @author       Shikikan
// @include      /^https?:\/\/(sp-play\.games\.dmm\.co(m|\.jp)\/play\/MistTrainGirls|mist-train-girls\.azurefd\.net\/Content\/AtomSpBrowser).*$/
// @grant        GM_addStyle
// @run-at       document-end
// @namespace    https://greasyfork.org/users/159960
// @downloadURL https://update.greasyfork.org/scripts/417057/%E3%83%9F%E3%82%B9%E3%83%88%E3%83%ACforSP%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%20%E3%83%95%E3%83%AB%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/417057/%E3%83%9F%E3%82%B9%E3%83%88%E3%83%ACforSP%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%20%E3%83%95%E3%83%AB%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E5%8C%96.meta.js
// ==/UserScript==

if( window.location.href.indexOf("dmm.co") > -1 ) {
  GM_addStyle(`
    body {
      background-color: #000;
    }
    #area-gameplay,
    #dm-footer {
      display: none !important;
    }
    #base > iframe {
      width: 100vw !important;
      height: 100vh !important;;
      max-width: 177.77vh !important;
      max-height: 56.25vw !important;
    }
  `);
}else{
  GM_addStyle(`
    html {
      overflow: hidden;
    }
  `);
}

