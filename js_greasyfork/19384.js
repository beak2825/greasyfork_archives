// ==UserScript==
// @name         Ubuntu Fonts
// @version      1.9
// @description  Turn WebFonts To Ubtunu Font Family
// @author       Th3_A11_M1ghty_
// @match        *://*/*
// @namespace    https://greasyfork.org/users/41967
// @downloadURL https://update.greasyfork.org/scripts/19384/Ubuntu%20Fonts.user.js
// @updateURL https://update.greasyfork.org/scripts/19384/Ubuntu%20Fonts.meta.js
// ==/UserScript==
/*jshint esnext: true */

function addGlobalStyle(css,needh=false) {
    var head, style, body;
    if (head) {
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style); 
    }
    body = document.getElementsByTagName('body')[0];
    if (!body) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    body.appendChild(style);
}
addGlobalStyle("@font-face { font-family: 'Ubuntu Mono'; font-style: normal; font-weight: 400; src: local('Ubuntu Mono'), local('UbuntuMono-Regular'), url(https://fonts.gstatic.com/s/ubuntumono/v6/ViZhet7Ak-LRXZMXzuAfkUbcKLIaa1LC45dFaAfauRA.woff2) format('woff2'); unicode-range: U+1F00-1FFF; }"); 
addGlobalStyle("@font-face { font-family: 'Ubuntu Mono'; font-style: normal; font-weight: 400; src: local('Ubuntu Mono'), local('UbuntuMono-Regular'), url(https://fonts.gstatic.com/s/ubuntumono/v6/ViZhet7Ak-LRXZMXzuAfkWo_sUJ8uO4YLWRInS22T3Y.woff2) format('woff2'); unicode-range: U+0370-03FF; }"); 
addGlobalStyle("@font-face { font-family: 'Ubuntu Mono'; font-style: normal; font-weight: 400; src: local('Ubuntu Mono'), local('UbuntuMono-Regular'), url(https://fonts.gstatic.com/s/ubuntumono/v6/ViZhet7Ak-LRXZMXzuAfkSYE0-AqJ3nfInTTiDXDjU4.woff2) format('woff2'); unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF; }");
addGlobalStyle("@font-face { font-family: 'Ubuntu Mono'; font-style: normal; font-weight: 400; src: local('Ubuntu Mono'), local('UbuntuMono-Regular'), url(https://fonts.gstatic.com/s/ubuntumono/v6/ViZhet7Ak-LRXZMXzuAfkY4P5ICox8Kq3LLUNMylGO4.woff2) format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000; }");
addGlobalStyle("@font-face { font-family: 'Ubuntu'; font-style: normal; font-weight: 400; src: local('Ubuntu'), url(https://fonts.gstatic.com/s/ubuntu/v9/WkvQmvwsfw_KKeau9SlQ2_esZW2xOQ-xsNqO47m55DA.woff2) format('woff2'); unicode-range: U+1F00-1FFF; }");
addGlobalStyle("@font-face { font-family: 'Ubuntu'; font-style: normal; font-weight: 400; src: local('Ubuntu'), url(https://fonts.gstatic.com/s/ubuntu/v9/gYAtqXUikkQjyJA1SnpDLvesZW2xOQ-xsNqO47m55DA.woff2) format('woff2'); unicode-range: U+0370-03FF; }");
addGlobalStyle("@font-face { font-family: 'Ubuntu'; font-style: normal; font-weight: 400; src: local('Ubuntu'), url(https://fonts.gstatic.com/s/ubuntu/v9/Wu5Iuha-XnKDBvqRwQzAG_esZW2xOQ-xsNqO47m55DA.woff2) format('woff2'); unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF; }");
addGlobalStyle("@font-face { font-family: 'Ubuntu'; font-style: normal; font-weight: 400; src: local('Ubuntu'), url(https://fonts.gstatic.com/s/ubuntu/v9/sDGTilo5QRsfWu6Yc11AXg.woff2) format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000; }");
addGlobalStyle("body {font: 'Ubuntu', Ubuntu !important}",true);
addGlobalStyle("code {font: 'Ubuntu Mono', Ubuntu Mono !important}",true);
addGlobalStyle("body {font-family: 'Ubuntu', Ubuntu !important}",true);
addGlobalStyle("code {font-family: 'Ubuntu Mono', Ubuntu Mono !important}",true);