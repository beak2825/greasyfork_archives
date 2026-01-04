// ==UserScript==
// @name         [Hadzy] Youtube Comment Analytics
// @namespace    https://greasyfork.org/en/users/10118-drhouse
// @version      3.1
// @description  Hadzy - The best youtube comment picker and great tool to search for all comments, open it with 'Activate' menu button
// @include      https://www.youtube.com/watch?*
// @include      https://hadzy.com/analytics/youtube/
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @author       drhouse
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @downloadURL https://update.greasyfork.org/scripts/393514/%5BHadzy%5D%20Youtube%20Comment%20Analytics.user.js
// @updateURL https://update.greasyfork.org/scripts/393514/%5BHadzy%5D%20Youtube%20Comment%20Analytics.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);

(function($){

    GM_registerMenuCommand("Activate", function(){
        if (location !== "https://hadzy.com/analytics/youtube/"){
            var here = window.location.href;
            GM_setValue("ytube", here);
            // window.location.href = 'https://hadzy.com/analytics/youtube/';
            window.open('https://hadzy.com/analytics/youtube/');
        }
    }, "A");

    if (window.location.href === 'https://hadzy.com/analytics/youtube/'){
        var storedObject = GM_getValue("ytube");
        var target1 = $('.MuiInputBase-input');
        var target2 = $('.MuiButtonBase-root');
        $(target1).val(storedObject);
        $(target2).click();
        setTimeout(function(){
            var loadButton = $('.MuiButtonBase-root.MuiFab-root');
            $(loadButton).click();
        }, 1000);

        function waitForElementToDisplay(selector, time) {
            if($(selector)!=null) {
                $(selector).click();
                return;
            }
            else {
                setTimeout(function() {
                    waitForElementToDisplay(selector, time);
                }, time);
            }
        }

        var target3 = "div.MuiPaper-root > div.MuiCardContent-root > button"
        waitForElementToDisplay(target3, 1000)
        var target4 = "div.MuiCardContent-root > a:nth-child(2) > button";
        waitForElementToDisplay(target4, 1000)
        //#root > div > div.MuiPaper-root.MuiCard-root.sc-kAzzGY.jujnLM.MuiPaper-elevation1.MuiPaper-rounded > div.MuiCardContent-root.sc-kGXeez.dVnFSi > a:nth-child(2) > button
    }
})(jQuery);