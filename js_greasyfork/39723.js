// ==UserScript==
// @name         Map Progress Focus
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Allows you to view maprogress maps on a second monitor without it pausing
// @author       Alex Cohen
// @match        https://*.maprogress.com/
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/39723/Map%20Progress%20Focus.user.js
// @updateURL https://update.greasyfork.org/scripts/39723/Map%20Progress%20Focus.meta.js
// ==/UserScript==


(function() {
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutationRecord) {
            var parent = target.parentNode;
            if(parent.offsetParent != null)
            {
                var button = target.getElementsByClassName('btn')[0];
                button.click();
            }
        });
    });

    var target = document.getElementById('lostFocusDialog');
    observer.observe(target, { attributes : true, attributeFilter : ['style'] });

})();
