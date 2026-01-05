// ==UserScript==
// @name            GitHub: Blame Previous Commit Button
// @description     Add a button to `git blame` the `sha^` (parent commit) on each commit on a `git blame` page.
// @author          Chris H (Zren / Shade)
// @icon            https://github.com/favicon.ico
// @namespace       http://xshade.ca
// @version         3
// @include         https://github.com*
// @downloadURL https://update.greasyfork.org/scripts/10694/GitHub%3A%20Blame%20Previous%20Commit%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/10694/GitHub%3A%20Blame%20Previous%20Commit%20Button.meta.js
// ==/UserScript==

// Works with GitHub Enterprise as well, just add your own @include rule for your domain.

(function(){

    var createElement = function(html) {
        var e = document.createElement('div');
        e.innerHTML = html;
        return e.firstChild;
    };

    var blameUrlPattern = /^(\/[^\/]+\/[^\/]+\/blame\/)([^\/]+)(.*)$/;

    var main = function() {
        var m = blameUrlPattern.exec(document.location.pathname);
        if (!m)
            return;

        Array.prototype.forEach.call(document.querySelectorAll('.blame-commit-info'), function(e) {
            var url = e.firstElementChild.href;
            var sha = url.substr(url.lastIndexOf('/') + 1);
            var blameUrlForCurrentFile = m[1] + sha + encodeURI('^') + m[3];
            var html = '<a class="blame-sha blame-previous-commit" href="' + blameUrlForCurrentFile + '">Before</a>';
            var a = createElement(html);
            e.lastElementChild.insertBefore(a, e.lastElementChild.firstChild);
        });
    };

    main();

})();
