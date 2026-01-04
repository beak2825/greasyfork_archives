// ==UserScript==
// @name         MyEbay Watcher
// @version      0.1
// @description  Show new views and observer in my ebay selling overview
// @author       Sebastian Löscher
// @match        http*://my.ebay.de/*MyeBayNextSelling*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @namespace https://greasyfork.org/users/159643
// @downloadURL https://update.greasyfork.org/scripts/35284/MyEbay%20Watcher.user.js
// @updateURL https://update.greasyfork.org/scripts/35284/MyEbay%20Watcher.meta.js
// ==/UserScript==

$(function() {
    $(".my_itl-iT tbody tr.my_itl-itR").each(function() {
        var articleId = $(this).find('input').get(0).value;
        var articleViews = $(this).children('td:nth-child(4)').children('p:first-child').text();
        var articleObserver = $(this).children('td:nth-child(4)').children('p:nth-child(2)').text();

        var loadedArticle = null;
        if (typeof GM_getValue == "function") {
            loadedArticle = GM_getValue('ebaywatcher_' + articleId);
        }

        if (window.chrome) {
            loadedArticle = $.parseJSON(localStorage.getItem('ebaywatcher_' + articleId));
        }

        var currentArticle = {
          'id': articleId,
          'views': articleViews,
          'observer': articleObserver,
        };

        if( loadedArticle !== null && loadedArticle !== 'undefined' ) {
            if( loadedArticle.views != currentArticle.views ) {
                $(this).children('td:nth-child(4)').children('p:first-child').css({
                    "border": "1px solid #75a478",
                    "background-color": "#a5d6a7"
                });
            }

            if( loadedArticle.observer != currentArticle.observer ) {
                $(this).children('td:nth-child(4)').children('p:nth-child(2)').css({
                    "border": "1px solid " + ((loadedArticle.observer > currentArticle.observer) ? "#ba6b6c" : "#75a478"),
                    "background-color": ((loadedArticle.observer > currentArticle.observer) ? "#ef9a9a" : "#a5d6a7")
                });
            }
        }

        if (typeof GM_setValue == "function") {
            GM_setValue('ebaywatcher_' + articleId, JSON.stringify(currentArticle));
        }

        if (window.chrome) {
			localStorage.setItem('ebaywatcher_' + articleId, JSON.stringify(currentArticle));
		}
    });
});