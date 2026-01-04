// ==UserScript==
// @name         Don't recommend a smartphone reddit app
// @match        https://www.reddit.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @description  Hide the smartphone app popup when opening the reddit mobile site.
// @version 0.2
// @grant GM_setValue
// @grant GM_getValue
// @namespace https://greasyfork.org/users/83168
// @downloadURL https://update.greasyfork.org/scripts/454385/Don%27t%20recommend%20a%20smartphone%20reddit%20app.user.js
// @updateURL https://update.greasyfork.org/scripts/454385/Don%27t%20recommend%20a%20smartphone%20reddit%20app.meta.js
// ==/UserScript==

$(function(){

    setInterval(function(){
        $('.XPromoPopupRpl__actionButton').click();
        $('.XPromoBottomBar__closeButton').click();
    },50);
    $('.TopButton').hide();

})(jQuery);