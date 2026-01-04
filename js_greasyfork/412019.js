// ==UserScript==
// @name         removes quora question page adverts
// @namespace    https://www.quora.com
// @version      0.1
// @description  removes quora question page adverts spacing_log_question_page_ad
// @author       angelo.ndira@gmail.com
// @match        https://www.quora.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.5.1.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/412019/removes%20quora%20question%20page%20adverts.user.js
// @updateURL https://update.greasyfork.org/scripts/412019/removes%20quora%20question%20page%20adverts.meta.js
// ==/UserScript==
/*global window jQuery $ console*/

function removePageAdvert() {
    $(document).find('div.q-box.spacing_log_question_page_ad.qu-pb--small.qu-borderBottom').each(function () {
        var rowNode = $(this);
        rowNode.remove();
        console.log("woohoo #### removed spacing_log_question_page_ad");
    });
}

(function() {
    'use strict';

    removePageAdvert();
    window.onscroll = function (e){
        removePageAdvert();
    }
})();

