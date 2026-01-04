// ==UserScript==
// @name         New E3 no captcha
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  disable new e3 captcha
// @author       Sakamoto
// @match        https://e3new.nctu.edu.tw/login/index.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386288/New%20E3%20no%20captcha.user.js
// @updateURL https://update.greasyfork.org/scripts/386288/New%20E3%20no%20captcha.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeAllNodes(nodeList) {
        Array.from(nodeList)
            .forEach(function (_) { _.remove(); });
    }

    let magic = document.createElement('div');
    magic.innerHTML = '<p style="color: #fff; font-size: 20px; font-weight: 600; margin: 0.5rem 0 0 0;">把 CAPTCHA Bang 不見 ｡:.ﾟヽ(*´∀`)ﾉﾟ.:｡</p>';

    removeAllNodes(document.getElementsByName('captcha_code'));
    removeAllNodes(document.getElementsByName('captcha'));
    Array.from(document.querySelectorAll('a.LoginLang-vain[href="#"]'))
        .forEach(function (_) { _.parentNode.replaceChild(magic.cloneNode(true), _); });

    let cssInject = `
.LoginForm, .LoginForm-phone {
    height: initial !important;
}

.LoginCard, .LoginCard-tablet, .LoginCard-phone {
    height: initial !important;
    padding-bottom: 1em;
}
    `;

    let cssDom = document.createElement('style');
    cssDom.innerHTML = cssInject;
    document.head.appendChild(cssDom);
})();