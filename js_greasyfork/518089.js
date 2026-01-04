// ==UserScript==
// @name         FFA Foul Language Display
// @licence      MIT
// @author       krcanacu
// @namespace    FFA_FL_Script
// @description  Enhanced script for detecting and counting occurrences of specific words.
// @match        http://vcc-review-caption-alpha.corp.amazon.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @version      1.0.0
// @grant        none
// @require https://update.greasyfork.org/scripts/515949/1487240/FFA%20Foul%20Language%20Processor.js
// @downloadURL https://update.greasyfork.org/scripts/518089/FFA%20Foul%20Language%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/518089/FFA%20Foul%20Language%20Display.meta.js
// ==/UserScript==

(function() {
    let popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '10px';
    popup.style.right = '10px';
    popup.style.zIndex = 9999;
    popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    popup.style.maxWidth = '400px';
    popup.style.overflowY = 'auto';
    popup.style.backgroundColor = 'white';
    popup.style.padding = '10px';
    popup.style.border = '1px solid black';


    document.body.appendChild(popup);

    popup = popup.appendChild(LoadFL());

})();
