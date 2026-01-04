// ==UserScript==
// @name         Change Standard Scrollbar
// @namespace    https://github.com/RedCommander735
// @version      1.1
// @description  Changes default scrollbar to more simple one
// @author       RedCommander735
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @match        *://*/*
// @license      WTFPL
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/441782/Change%20Standard%20Scrollbar.user.js
// @updateURL https://update.greasyfork.org/scripts/441782/Change%20Standard%20Scrollbar.meta.js
// ==/UserScript==

(function() {

    var c = window.getComputedStyle( document.body ,null).getPropertyValue('background-color');

    var rgb = c.match(/\d+/g);
    var color = 0;

    var o = Math.round(((parseInt(rgb[0]) * 299) + (parseInt(rgb[1]) * 587) + (parseInt(rgb[2]) * 114)) /1000);
    console.log(o);
    if(o > 125) {
        color = 0;
    }else{
        color = 255;
    }

        var css = (`
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: rgb(${color}, ${color}, ${color}, .3);
  filter: brightness(.1);
}
/* Handle */
::-webkit-scrollbar-thumb {
  background: rgb(${color}, ${color}, ${color}, .45);
  filter: brightness(.25);
}
/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: rgb(${color}, ${color}, ${color}, .65);
  filter: brightness(.5);
}
`);

        if (typeof GM_addStyle !== "undefined") {
            GM_addStyle(css);
        } else {
            var styleNode = document.createElement("style");
            styleNode.appendChild(document.createTextNode(css));
            (document.querySelector("head") || document.documentElement).appendChild(styleNode);
        }
})();
