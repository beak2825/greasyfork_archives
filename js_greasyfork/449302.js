// ==UserScript==
// @name         Pornone Unblur
// @namespace    wads
// @version      0.1
// @description  try to unblur
// @author       espo
// @match        https://pornone.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pornone.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449302/Pornone%20Unblur.user.js
// @updateURL https://update.greasyfork.org/scripts/449302/Pornone%20Unblur.meta.js
// ==/UserScript==

function exec(fn) {
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = '(' + fn + ')();';
    document.body.appendChild(script);
    document.body.removeChild(script);
}


exec(function() {
	PageObserver.disconnect();


});


  document.body.innerHTML = document.body.innerHTML.replace(/blur/g,'');




      const PageObserver = new MutationObserver((changes) => {
        changes.forEach((change) => {
          if (element.style.filter === 'blur(10px)') {
              element.style.filter = 'blur(0px)';}
        });
      });




      function refreshBlurClassAttributes() {
        const elementsWithBlurClass = document.getElementsByClassName('blur');
        for (const element of elementsWithBlurClass) {
          element.style.filter = 'blur(0px)';
        }
      }

      setInterval(refreshBlurClassAttributes, 1);