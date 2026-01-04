// ==UserScript==
// @name         3donlinefilms Autopagination
// @namespace    https://greasyfork.org/en/users/10118-drhouse
// @version      2.2
// @description  Appends next page to the current page
// @match        https://www.3donlinefilms.com/*
// @require      https://code.jquery.com/jquery-3.7.0.min.js
// @author       drhouse
// @license      CC-BY-NC-SA-4.0
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.3donlinefilms.com
// @downloadURL https://update.greasyfork.org/scripts/474999/3donlinefilms%20Autopagination.user.js
// @updateURL https://update.greasyfork.org/scripts/474999/3donlinefilms%20Autopagination.meta.js
// ==/UserScript==
/* global $ */

(function() {
    window._page_zipper_is_bookmarklet=true;
    window._page_zipper=document.createElement('script');
    window._page_zipper.type='text/javascript';window._page_zipper.src='//www.printwhatyoulike.com/static/pagezipper/pagezipper_10.js';
    document.getElementsByTagName('head')[0].appendChild(window._page_zipper);

    setInterval(function(){
        $("[id^='pgzp_page']").each(function() {
            if (this.id.match(/\d$/)) {
                $(this).find('header').remove();
            }
        });

        $('img').each(function() {
            var dataSrc = $(this).attr('data-src');
            if (dataSrc) {
                $(this).attr('src', dataSrc);
            }
        });

        $('.wrap-content:not(:first)').find('.title.text_center').remove()
        $('.wrap-footer:not(:first)').remove()
      
    }, 1000);

})();