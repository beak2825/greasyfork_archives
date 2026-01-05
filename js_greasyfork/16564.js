// ==UserScript==
// @name            GitHub: Issue sort:updated-desc Button
// @description     Add top level button to sort both issues/pull requests by the most recently updated.
// @author          Chris H (Zren / Shade)
// @icon            https://github.com/favicon.ico
// @namespace       http://xshade.ca
// @version         3
// @include         https://github.com*
// @downloadURL https://update.greasyfork.org/scripts/16564/GitHub%3A%20Issue%20sort%3Aupdated-desc%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/16564/GitHub%3A%20Issue%20sort%3Aupdated-desc%20Button.meta.js
// ==/UserScript==

(function(uw){
    
    var createElement = function(html) {
        var e = document.createElement('div');
        e.innerHTML = html;
        return e.firstChild;
    };

    var blameUrlPattern = /^https:\/\/github.com\/[^\/]+\/[^\/]+\/(issues|pulls)/;

    var main = function() {
        var m = blameUrlPattern.exec(document.location.href);
        if (!m)
            return;
        
        if (document.getElementById('sort-issues-recently-updated'))
            return;

        Array.prototype.forEach.call(document.querySelectorAll('.table-list-header-toggle.right'), function(e) { 
            var url = m[0] + '?q=sort%3Aupdated-desc';
            var html = '<div class="left"><a id="sort-issues-recently-updated" class="btn-link icon-only js-menu-target" role="button" aria-haspopup="true" style="padding-right: 15px; padding-left: 15px;" href="' + url + '">sort:recently-updated</a></div>';
            var a = createElement(html);
            e.insertBefore(a, e.firstChild);
        });
    };

    main();
    
    //var $ = uw.$;
    //$(document).on('pjax:end', main);
    setInterval(main, 1000);

})(typeof unsafeWindow === 'undefined' ? window : unsafeWindow);
