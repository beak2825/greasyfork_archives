// ==UserScript==
// @name         F3- EventID Get
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  try it!
// @author       Antony.Kao
// @include       *MarketManagement/*
// @include       *://gmm*.gmm88.com/*
// @run-at        document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435247/F3-%20EventID%20Get.user.js
// @updateURL https://update.greasyfork.org/scripts/435247/F3-%20EventID%20Get.meta.js
// ==/UserScript==

(function() {
    if(UrlContains("MarketManagement")){
    }
    $("body").keydown(function(e){
        //now we caught the key code!!
        var keyCode = e.keyCode || e.which;
        if(keyCode == 114) // F3
        {
            //well you need keep on mind that your browser use some keys
            //to call some function, so we'll prevent this
            e.preventDefault();

            if($("[name='youyou']").length >0)
            {
                $("[name='youyou']").remove();
                return;
            }
            var val = '';
            var eventIDs = [];
            $("span[name='eventID']").each(function(i, obj){
                eventIDs.push($(this).html());
            });
            var unique = eventIDs.filter(function(item, i, eventIDs) {
                return i == eventIDs.indexOf(item);
            });

            $("#EventList").prepend("<input type='text' style='margin:2px 5px 5px 5px; width:80%; background-color: #FFFF96;' name='youyou' value='"+unique.join()+"' />");
        }
    });
    // Your code here...
})();

function UrlContains(urlfragment){
    return document.URL.indexOf(urlfragment) != -1;
}