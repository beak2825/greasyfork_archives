// ==UserScript==
// @name         Webtekno Dark Theme
// @name:tr      Webtekno Karanlık Tema
// @namespace    https://gitlab.com/mburakg/WebteknoDarkTheme
// @version      0.204
// @description  Dark Theme For Webtekno.com
// @description:tr Webtekno.com için Karanlık Tema
// @author       @mbrkg
// @match        https://www.webtekno.*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=webtekno.com
// @grant GM_addStyle
// @run-at document-start
// @include https://www.webtekno.*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444926/Webtekno%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/444926/Webtekno%20Dark%20Theme.meta.js
// ==/UserScript==

(function() {
    let css = "";
    if(false || document.location.href.indexOf("https://www.webtekno") == 0){
        css += `
             .content-timeline__time, .wt-container,.headline,.content-card__detail,.sidebar-social__item__caption{
                 background: black!important;
             }
             .content-timeline--underline, .underline, .content-title>h1,.content-body--right,.sidebar-social__item__count,.content-comments__sub-title span,.content-comments__item__author__name,.content-comments__item__message{
                 color: #bec9d3!important;
             }
             #wt-masthead{
                 display:none;
             }
             .sidebar-social__item{
                 border-right: 3px solid black!important;
             }
            .content-body > .content-body--right > .content-body__detail > div{
                background:#334!important;
            }
            .bottom-new-video{
                background:transparent!important;
            }
             `;
    }
    if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(css);
    }
    else {
        let styleNode = document.createElement("style");
        styleNode.appendChild(document.createTextNode(css));
        (document.querySelector("head") || document.documentElement).appendChild(styleNode);
    }
})();