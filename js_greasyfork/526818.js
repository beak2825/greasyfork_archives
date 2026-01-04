// ==UserScript==
// @name         解除限制
// @description  233
// @version      1
// @author       You
// @match        *://*/*
// @grant        none
// @namespace https://greasyfork.org/users/12375
// @downloadURL https://update.greasyfork.org/scripts/526818/%E8%A7%A3%E9%99%A4%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/526818/%E8%A7%A3%E9%99%A4%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function(w){
    [...w.document.all].forEach(e=>{
        ["contextmenu","dragstart","mouseup","copy","beforecopy","selectstart","select","keydown"]
        .forEach(x=>e['on'+x]=null);
        e.style?.setProperty('user-select','unset','important');
    });
})(window);
