// ==UserScript==
// @name soup.io: Display hidden elements
// @namespace    http://xcvbnm.org/
// @author Nordern
// @description Shows hidden reactions, reposts, icons and dates on soup.io pages
// @version 4.1
// @match http://*.soup.io/*
// @match https://*.soup.io/*
// @license public domain
// @downloadURL https://update.greasyfork.org/scripts/16891/soupio%3A%20Display%20hidden%20elements.user.js
// @updateURL https://update.greasyfork.org/scripts/16891/soupio%3A%20Display%20hidden%20elements.meta.js
// ==/UserScript==
/* 
 * Available on github under: https://github.com/edave64/souplements/blob/master/showHiddenElements.js
 * Using the infinite scrolling support template: https://github.com/edave64/souplements/blob/master/infiniteScrollingTemplate.js
 */
 
(function () {
    function customCode () {
        [].forEach.call(
            document.querySelectorAll('.hide-reposted-by,.icons.hidden,.date.hidden,.hide-tags'),
            function (ele) {
                ele.classList.remove('hide-reposted-by');
                ele.classList.remove('hide-tags');
                ele.classList.remove('hidden');
            }
        );
    }

    // Reduces calls to customCode by limiting it to execute once per javascript activity and stops it from calling
    // itself.
    var _runner = null;
    function runDelayed () {
        if (_runner === null) {
            _runner = setTimeout(function () {
                try {
                    customCode();
                } finally {
                    _runner = null;
                }
            }, 0);
        }
    }
    function register () {
        customCode();
        new MutationObserver(runDelayed).observe(
            document.getElementById('contentcontainer'), {
                childList: true,
                subtree: true
            }
        );
    }
    // Is the soup page already loaded? This allows the custom code to run as both a bookmarklet and a userscript.
    if (document.getElementById('contentcontainer')) {
        register();
    } else {
        document.addEventListener("load", register);
    }
}());