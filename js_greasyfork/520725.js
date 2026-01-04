// ==UserScript==
// @name         PornoLab Less Spoilers
// @namespace    copyMister
// @version      1.0
// @description  Allows to get rid of some spoilers in posts, for example in quotes
// @description:ru  Позволяет убрать некоторые спойлеры в постах, например в цитатах
// @author       copyMister
// @license      MIT
// @match        https://pornolab.net/forum/viewtopic.php*
// @match        https://pornolab.net/forum/search.php*
// @match        https://pornolab.net/forum/privmsg.php*
// @match        https://pornolab.cc/forum/viewtopic.php*
// @match        https://pornolab.cc/forum/search.php*
// @match        https://pornolab.cc/forum/privmsg.php*
// @match        https://pornolab.biz/forum/viewtopic.php*
// @match        https://pornolab.biz/forum/search.php*
// @match        https://pornolab.biz/forum/privmsg.php*
// @match        https://pornolab.lib/forum/viewtopic.php*
// @match        https://pornolab.lib/forum/search.php*
// @match        https://pornolab.lib/forum/privmsg.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pornolab.net
// @run-at       document-body
// @grant        GM_addStyle
// @homepageURL  https://pornolab.net/forum/viewtopic.php?t=2714164
// @downloadURL https://update.greasyfork.org/scripts/520725/PornoLab%20Less%20Spoilers.user.js
// @updateURL https://update.greasyfork.org/scripts/520725/PornoLab%20Less%20Spoilers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $.holdReady(true);

    GM_addStyle('.q { max-height: none !important; }');

    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('.sp-body[title="Цитата"]').forEach(function(sp) {
            sp.firstElementChild.remove();
            sp.parentElement.outerHTML = sp.innerHTML;
        });

        document.querySelectorAll(
            ':is(.post-user-message, .post_body) > .sp-wrap > .sp-body:is(:not([title]), [title=""])'
        ).forEach(function(sp) {
            if (sp.parentElement.parentElement.innerHTML.trim() === sp.parentElement.outerHTML.trim()) {
                while (sp.firstElementChild && sp.firstElementChild.classList.contains('sp-wrap')) {
                    sp.firstElementChild.outerHTML = sp.firstElementChild.firstElementChild.innerHTML;
                }
                sp.parentElement.outerHTML = sp.innerHTML
                    .replaceAll(/(?:Ѣ|&amp;#1122;)/g, 'Е')
                    .replaceAll(/(?:ѣ|&amp;#1123;)/g, 'е')
                    .replaceAll(/(?:[ѴІ]|&amp;#1140;|&amp;#1030;)/g, 'И')
                    .replaceAll(/(?:[ѵі]|&amp;#1141;|&amp;#1110;)/g, 'и')
                    .replaceAll(/(?:Ѿ|&amp;#1150;)/g, 'От')
                    .replaceAll(/(?:ѿ|&amp;#1151;)/g, 'от')
                    .replaceAll(/ъ(&|[.,:;?!»"')\-\]]|\s|$)/gi, '$1')
                    .trim();
            }
        });

        $.holdReady(false);
    });
})();