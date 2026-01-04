// ==UserScript==
// @name         Colored Cards for Gingko
// @namespace    GingkoColors
// @version      0.2
// @description  Makes cards with hashtags colored.
// @author       Popo
// @match        https://gingkoapp.com/app
// @downloadURL https://update.greasyfork.org/scripts/382241/Colored%20Cards%20for%20Gingko.user.js
// @updateURL https://update.greasyfork.org/scripts/382241/Colored%20Cards%20for%20Gingko.meta.js
// ==/UserScript==

(function() {
    setInterval(function() {
        var colors = new Array("#ddffdd","#ddddff","#ffffdd","#ffddff","#ddffff","#ffdddd");
        var newClasses = new Array();
        $(".taglink").each(function(){
            var newClass = "popo-colored-"+ $(this).data("action").replace("search:toggleTag ","");
            $(this).closest(".card").addClass(newClass);
            if(!newClasses.includes(newClass)) newClasses.push(newClass);
        });
        var i = 0;
        newClasses.forEach(function(newClass) {
            $("."+newClass).css("background", colors[i]);
            i++;
            if(i > colors.length) i = 0;
        });
    }, 500);
})();