// ==UserScript==
// @name         Agar.io Better Mouse
// @namespace    http://redd.it/3710r5
// @version      0.5
// @description  Agar.io mouse control: Left splits, Middle 1x W, Right 6x W
// @author       hadq
// @match        http://agar.io
// @grant        none
// @license      WTFPL v2 (http://www.wtfpl.net/txt/copying/)
// @downloadURL https://update.greasyfork.org/scripts/18017/Agario%20Better%20Mouse.user.js
// @updateURL https://update.greasyfork.org/scripts/18017/Agario%20Better%20Mouse.meta.js
// ==/UserScript==
 
$(
    function() {
        var amount = 6;
        var duration = 50; //ms
        var feeddown = $.Event("keydown", { keyCode: 87}); //w button
        var feedup = $.Event("keyup", { keyCode: 87}); //w button
        var splitdown = $.Event("keydown", { keyCode: 32}); //space button
        var splitup = $.Event("keyup", { keyCode: 32}); //space button
        $(document).bind('mousedown', function(e) {
            if( (e.which == 3) ){
                for (var i = 0; i < amount; ++i) {
                    setTimeout(function() {
                        $("body").trigger(feeddown);
                        $("body").trigger(feedup);
                    }, duration);
                }
            }
            else if( (e.which == 2) ){
                $("body").trigger(feeddown);
                $("body").trigger(feedup);
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