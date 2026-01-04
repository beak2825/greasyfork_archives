// ==UserScript==
// @name         page view optimize - "sass-lang"
// @namespace    https://xianghongai.github.io
// @version      0.0.2
// @description  固定定位 TOC(Table Of Contents)
// @author       Nicholas Hsiang
// @icon         https://xinlu.ink/favicon.ico
// @match        http*://sass-lang.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376623/page%20view%20optimize%20-%20%22sass-lang%22.user.js
// @updateURL https://update.greasyfork.org/scripts/376623/page%20view%20optimize%20-%20%22sass-lang%22.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var css = `
          @media (min-width: 1224px) {
            .complementary.content-secondary {position: fixed; right: 10%; bottom: 10%; width: auto; }
            #toc {position: fixed; right: 18px; bottom: 0; top: 50px; max-width: 266px; width: 266px; padding-left: 10px; padding-right: 10px; }
            #search a.full_list_link { margin-right: 5px; }
            #filecontents {padding-right: 300px; }
            #search {position: fixed; right: 13px; }
            #search_frame {position: fixed; }
          }
        `,
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');

    style.type = 'text/css';

    if (style.styleSheet){
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
})();