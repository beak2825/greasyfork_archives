// ==UserScript==
// @name         GotaMouse
// @namespace    http://redd.it/3710r5
// @version      0.4
// @description  Gota.io mouse play: Left mouse splits, Right mouse feeds. Q must be put as feed though.
// @author       Vulcan
// @match        http://gota.io/web/
// @grant        none
// @license      WTFPL v2 (http://www.wtfpl.net/txt/copying/)
// @downloadURL https://update.greasyfork.org/scripts/36363/GotaMouse.user.js
// @updateURL https://update.greasyfork.org/scripts/36363/GotaMouse.meta.js
// ==/UserScript==
 
$(
    function() {
        var feeddown = $.Event("keydown", { keyCode: 82}); //r button
        var feedup = $.Event("keyup", { keyCode: 82}); //r button
        var splitdown = $.Event("keydown", { keyCode: 32}); //space button
        var splitup = $.Event("keyup", { keyCode: 32}); //space button
        $(document).bind('mousedown', function(e) {
            if( (e.which == 3) ){
                $("body").trigger(feeddown);
                $("body").trigger(feedup);
                //console.log("feed");
            }
            else if( (e.which == 1) ){
                $("body").trigger(splitdown);
                $("body").trigger(splitup);
                //console.log("split");
            }
        }).bind('contextmenu', function(e){
            e.preventDefault();
        });
        //alert("mouse enabled");
    }
)();
