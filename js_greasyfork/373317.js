// ==UserScript==
// @name         Steam Secure Login
// @icon         https://store.steampowered.com/favicon.ico
// @version      2018.10.16
// @description  自定义登录框以防钓鱼网站
// @author       YinJH
// @namespace    steam-secure-login@YinJH
// @match      https://store.steampowered.com/login*
// @match      https://steamcommunity.com/openid/login*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373317/Steam%20Secure%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/373317/Steam%20Secure%20Login.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var bgColor = '#5C7E10'; // 输入框背景色
    var phText = 'SECURE SIGN IN'; // 提示文字
    var phColor = 'white'; // 提示文字颜色

    var inputs = document.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
        var st = inputs[i].style;
        st.setProperty('background', bgColor);
        st.setProperty('border-color', 'yellow');
        st.setProperty('border-width', 'medium');

        inputs[i].placeholder = phText;
    }

    var css = '::placeholder{ color:' + phColor + '; font-weight: bold; }',
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
})();