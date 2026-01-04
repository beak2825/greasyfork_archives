// ==UserScript==
// @name         Remove Google "People also search for"
// @namespace    http://spadrig.se/
// @version      1.1
// @description  Get rid of that annoying box that transitions in on the search page of google and tells what other people have searched for .
// @author       Oscar Jonsson  -  oscar@spadrig.se
// @match        https://www.google.com/search*
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431719/Remove%20Google%20%22People%20also%20search%20for%22.user.js
// @updateURL https://update.greasyfork.org/scripts/431719/Remove%20Google%20%22People%20also%20search%20for%22.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = { attributes: true, childList: false, subtree: true };
    const callback = function(mutationsList, observer) {
        for(let mutation of mutationsList)
            if (mutation.attributeName==="style"&&mutation.target.getAttribute("style")==="display: block; opacity: 1;") {
                mutation.target.parentElement.parentElement.style.height="auto";//cancel out the container-div expanding which it does to contain annoying box
                mutation.target.remove();//remove the annoying box
                return observer.disconnect();
            }
    };
    const observer = new MutationObserver(callback);
    observer.observe(document.body, config);
})();