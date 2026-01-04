// ==UserScript==
// @name         arXiv paper homepage
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  use `ctrl + e` to jump to the arXiv homepage when in pdf page.
// @author       W.Wen
// @match        https://arxiv.org/pdf/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390975/arXiv%20paper%20homepage.user.js
// @updateURL https://update.greasyfork.org/scripts/390975/arXiv%20paper%20homepage.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var home_url = window.location.href.slice(0, -4).replace('pdf', 'abs');
    document.addEventListener('keydown', (event) => {
        const keyName = event.key;
        if (keyName === 'Control') {
            // do not alert when only Control key is pressed.
            return;
        }
        if (event.ctrlKey) {
            // Even though event.key is not 'Control' (i.e. 'a' is pressed),
            // event.ctrlKey may be true if Ctrl key is pressed at the time.
            // alert(`Combination of ctrlKey + ${keyName}`);
            var thekey = `${keyName}`;
            if (thekey == 'e') {
              // alert(home_url);
              // window.location.replace(home_url);
              // window.location.href = home_url;
              // window.navigate(home_url);
              window.open(home_url);
            }
        }
    }, false);
})();