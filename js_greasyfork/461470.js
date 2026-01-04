// ==UserScript==
// @name         Property Higlight
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  highlights properties, only yours
// @author       -zero [2669774]
// @match        https://www.torn.com/properties.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461470/Property%20Higlight.user.js
// @updateURL https://update.greasyfork.org/scripts/461470/Property%20Higlight.meta.js
// ==/UserScript==

function check(){
    var properties = $('.properties-list').children().each(function(){
        var prop = $(this);
        if ($(".image-description",prop).length>0){

                var des = $(".image-description",prop).text();

                if (des.includes('Leased to')){

                    var days = parseInt(des.split('/')[0].split('(')[1]);
                    if (days <= 10){
                        $(".image-description",prop).css("background-color", "red");
                    }
                }
                else if (des.includes('Owned by you')){
                    //console.log(des);
                     $(".image-description",prop).css("background-color", "green");
                }

            }
    });


}

(function() {
    setInterval(check,500);

    
})();