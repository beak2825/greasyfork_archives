// ==UserScript==
// @name         Agar.io Mouse
// @namespace    http://redd.it/3710r5
// @version      2.0
// @description  Agar.io mouse control: Left mouse splits, Right mouse feeds
// @author       trabladorr
// @match        http://www.agar.re/
// @match        http://agar.io
// @match        http://play.ogarul.tk/
// @match        http://www.cellcraft.io/
// @grant        none
// @license      WTFPL v2 (http://www.wtfpl.net/txt/copying/)
// @downloadURL https://update.greasyfork.org/scripts/20357/Agario%20Mouse.user.js
// @updateURL https://update.greasyfork.org/scripts/20357/Agario%20Mouse.meta.js
// ==/UserScript==
 
$(
    function() {
        var feeddown = $.Event("keydown", { keyCode: 87}); //w button
        var feedup = $.Event("keyup", { keyCode: 87}); //w button
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