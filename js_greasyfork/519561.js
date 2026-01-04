// ==UserScript==
// @name Property Highlight
// @namespace http://tampermonkey.net/
// @version 0.2
// @description highlights properties, only yours
// @author TheProfessor [1425134]
// @match https://www.torn.com/properties.php*
// @icon https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519561/Property%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/519561/Property%20Highlight.meta.js
// ==/UserScript==

function check(){
    var properties = $('.properties-list').children().each(function(){
        var prop = $(this);
        if ($(".image-description",prop).length>0){

                var des = $(".image-description",prop).text();

                if (des.includes('Leased to')){
                    var days_test = des.split('/')[0].split('(')[2];
                    var days = parseInt(des.split('/')[0].split('(')[1]);
                    // window.alert(days_test, typeof(days_test))
                    if (days_test <= 10){
                        $(".image-description",prop).css("background", "linear-gradient(0.25turn, rgba(255, 160, 0, 0.125), rgba(255, 160, 0, 0.325), rgba(255, 160, 0, 0.125))");
                    }
                }
                else if (des.includes('Owned by your spouse')){
                    $(".image-description",prop).css("background", "linear-gradient(0.25turn, rgba(210, 48, 48, 0.125), rgba(210, 48, 48, 0.8), rgba(210, 48, 48, 0.125))");
                }
                else if (des.includes('Owned by you') && !des.includes("spouse")){
                    $(".image-description",prop).css("background", "linear-gradient(0.25turn, rgba(40, 211, 45, 0.125), rgba(40, 211, 45, 0.325), rgba(40, 211, 45, 0.125))");
                }
                else if (des.includes('You and your spouse are living here')){
                    $(".image-description",prop).css("background", "linear-gradient(0.25turn, rgba(40, 210, 211, 0.125), rgba(40, 210, 211, 0.4), rgba(40, 210, 211, 0.125))");
                }
                else if (des.includes('Up for rent')){
                     $(".image-description",prop).css("background", "linear-gradient(0.25turn, rgba(36, 117, 255, 0.125), rgba(36, 117, 255, 0.325), rgba(36, 117, 255, 0.125))");
                }

            }
    });


}

(function() {
    setInterval(check,500);


})();

