// ==UserScript==
// @name         popcat2starburst
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  KO NO KIRITO DA!
// @author       JCxYIS
// @match        https://popcat.click/
// @icon         https://www.google.com/s2/favicons?domain=popcat.click
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/430784/popcat2starburst.user.js
// @updateURL https://update.greasyfork.org/scripts/430784/popcat2starburst.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    GM_addStyle ( `
        @font-face {
            font-family: 'sao';
            src:
                url('https://raw.githubusercontent.com/JCxYIS/popcat2starburst/master/fonts/sao-latin.otf');
        }

        body {
            font-family: 'sao';
        }

        #title {
margin: .48763em 0 0 0;
/*text-decoration: underline #fff 4px;*/
           font-size: 80px;
    font-weight: 487.63;
           color: #fff;
           /*-webkit-text-stroke-color: #000;*/
           /*-webkit-text-stroke-width: 1.5px;*/
        }

        .counter {
           font-size: 48.763px;
           font-weight: 487.63;
           /*-webkit-text-stroke-width: 1px;*/
        }

        .p {
            background-image: url('https://i.imgur.com/lGwPrYG.jpg')
        }

        .op {
            background-image: url('https://i.imgur.com/FNXvcK2.gif')
        }

        .cat-img {
            max-width: 48763px;
            background-size: cover;
        }
    ` );

    var parent = document.getElementsByClassName("cat-img")[0]; //document.getElementById("app");
    var newtitle = document.createElement('div');
    newtitle.innerHTML = "STARBURST STREAM";
    newtitle.id = "title";
    //newtitle.className = "title"
    parent.insertBefore(newtitle, parent.childNodes[0]);
    document.getElementsByTagName("img")[0].remove();
})();