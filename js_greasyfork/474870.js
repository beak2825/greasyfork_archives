// ==UserScript==
// @name            Auto-Close AWS VPN Client Window
// @namespace       https://github.com/SlashNephy
// @version         0.1.2
// @author          SlashNephy
// @description     Close the AWS VPN Client window automatically.
// @description:ja  認証後に AWS VPN Client のウィンドウを自動的に閉じます。
// @homepage        https://scrapbox.io/slashnephy/AWS_VPN_Client_%E3%81%AE%E8%AA%8D%E8%A8%BC%E7%94%BB%E9%9D%A2%E3%82%92%E8%87%AA%E5%8B%95%E7%9A%84%E3%81%AB%E9%96%89%E3%81%98%E3%82%8B_UserScript
// @homepageURL     https://scrapbox.io/slashnephy/AWS_VPN_Client_%E3%81%AE%E8%AA%8D%E8%A8%BC%E7%94%BB%E9%9D%A2%E3%82%92%E8%87%AA%E5%8B%95%E7%9A%84%E3%81%AB%E9%96%89%E3%81%98%E3%82%8B_UserScript
// @icon            https://www.google.com/s2/favicons?sz=64&domain=127.0.0.1
// @supportURL      https://github.com/SlashNephy/userscripts/issues
// @match           http://127.0.0.1:35001/
// @grant           none
// @license         MIT license
// @downloadURL https://update.greasyfork.org/scripts/474870/Auto-Close%20AWS%20VPN%20Client%20Window.user.js
// @updateURL https://update.greasyfork.org/scripts/474870/Auto-Close%20AWS%20VPN%20Client%20Window.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const expectedBody = '認証の詳細を受信、詳細を処理中です。このウィンドウをいつでも閉じることができます。';
    function closeWindow() {
        if (document.body.textContent === expectedBody) {
            window.close();
        }
    }
    closeWindow();
    addEventListener('load', closeWindow);

})();
