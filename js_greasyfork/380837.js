// ==UserScript==
// @name         All Gallery Thumbs
// @version      1.27
// @description  Load all thumbnail pages for a gallery
// @author       Hauffen
// @include      /https?:\/\/(e-|ex)hentai\.org\/.*/
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @namespace https://greasyfork.org/users/285675
// @downloadURL https://update.greasyfork.org/scripts/380837/All%20Gallery%20Thumbs.user.js
// @updateURL https://update.greasyfork.org/scripts/380837/All%20Gallery%20Thumbs.meta.js
// ==/UserScript==

(function() {
    let $ = window.jQuery;
    var url = document.URL;
    var count = 1;
    var flag = true;
    var timeout;

    if (url.split('/')[3] === "g") {
        var pages = document.getElementsByClassName('ptt')[0].children[0].children[0].children[document.getElementsByClassName('ptt')[0].children[0].children[0].childElementCount - 2].innerText;
        var s = setInterval(function() {

            if(document.hidden) { return; }

            loadMore();

            $("<style>.gtb{visibility:hidden;}.ptb{visibility:hidden;}div#gdt{display:grid;grid-template-columns:repeat(auto-fit, minmax(" + $(".gdtm").first().width() + "px, 1fr));}</style>").appendTo("head"); 
            clearInterval(s);
        }, 500);
    } else {
        return;
    }

    function loadMore() {
        if (!flag) {
            return;
        }
        flag = false;
        clearTimeout(timeout);

        if (count >= pages) {
            clearTimeout(timeout);
            return;
        }

        var $content = $('<div>');
        var nextUrl = url + "?p=" + count;
        count = count + 1;
        $content.load(`${nextUrl} #gdt`, function() {
            var divs = this.children[0].children;

            divs[0].parentNode.removeChild(divs[divs.length-1]);

            while (divs.length > 0) {
                $(divs[0]).insertBefore( document.getElementsByClassName('c')[3] );
            }
            flag = true;
            timeout = setTimeout(loadMore(count), 5000);
        });
    }
})();