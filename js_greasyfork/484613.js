// ==UserScript==
// @name         NovelAI Disable Backward
// @name:ja      NovelAI 戻るボタン無効化
// @name:en      NovelAI Disable Backward
// @namespace    https://github.com/Takenoko3333/NAI-disable-backward
// @version      1.0.0
// @description  Disable Backward on NovelAI's image generation screen. This prevents the deletion of generated images due to browser backward operations.
// @description:ja  NovelAIの画像生成画面において、戻るボタンを無効化します。これにより、ブラウザの戻るボタン操作による生成画像削除を防止します。
// @description:en  Disable Backward on NovelAI's image generation screen. This prevents the deletion of generated images due to browser backward operations.
// @author       Takenoko3333
// @match        https://novelai.net/image
// @icon         https://www.google.com/s2/favicons?sz=64&domain=novelai.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484613/NovelAI%20Disable%20Backward.user.js
// @updateURL https://update.greasyfork.org/scripts/484613/NovelAI%20Disable%20Backward.meta.js
// ==/UserScript==

(function() {
    history.pushState(null, null, location.href);
    window.addEventListener('popstate', function(e) {
      history.pushState(null, null, null);
      alert('ブラウザバック無効\nDisable Backward');
      history.go(1);
    });
})();