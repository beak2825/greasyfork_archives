// ==UserScript==
// @name              Bypass Age Check
// @name:zh-Tw        動畫瘋自動同意年齡確認
// @description       The script automically select agree when age check appear
// @description:zh-Tw 年齡認證出現時自動選取同意
// @author            mcc
// @version           1
// @run-at            document-end
// @match             http*://*ani.gamer.com.tw/animeVideo*
// @license           MIT
// @namespace https://greasyfork.org/users/1280342
// @downloadURL https://update.greasyfork.org/scripts/491034/Bypass%20Age%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/491034/Bypass%20Age%20Check.meta.js
// ==/UserScript==
/*jshint esversion: 8 */

(async function () {
    let videoPlayer = document.querySelector('#ani_video')
    let observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.className == 'R18'){
                    document.getElementById('adult').click()
                }
            })
        });
    });
    observer.observe(videoPlayer, { childList: true, });
})();