// ==UserScript==
// @name         Chopcoin Mouse
// @namespace    http://redd.it/3710r5
// @version      0.1
// @description  Agar.io mouse control: Left mouse splits, Right mouse feeds
// @author       originally - trabladorr
// @match        http://chopcoin.io/*
// @grant        none
// @license      WTFPL v2 (http://www.wtfpl.net/txt/copying/)
// @downloadURL https://update.greasyfork.org/scripts/20157/Chopcoin%20Mouse.user.js
// @updateURL https://update.greasyfork.org/scripts/20157/Chopcoin%20Mouse.meta.js
// ==/UserScript==



$(
    function() {
        var feeddown = $.Event("keydown", { keyCode: 87}); //w button
        var feedup = $.Event("keyup", { keyCode: 87}); //w button
        var splitdown = $.Event("keydown", { keyCode: 32}); //space button
        var splitup = $.Event("keyup", { keyCode: 32}); //space button
        $(document).bind('mousedown', function(e) {
            if( (e.which == 1) ){ // left click
                
                return; // uncomment to disable 1s spam
                
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 50 );
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 100 );
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 150 );
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 200 );
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 250 );
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 300 );
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 350 );
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 400 );
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 450 );
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 500 );
                
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 550 );
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 600 );
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 650 );
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 700 );
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 750 );
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 800 );
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 850 );
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 900 );
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 950 );
                
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 975 );
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 1000 );
                
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 25 );
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 175 );
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 125 );
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 275 );
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 225 );
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 375 );
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 325 );
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 475 );
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 425 );
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 250 );
                
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 525 );
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 675 );
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 625 );
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 775 );
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 725 );
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 875 );
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 825 );
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 975 );
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 925 );

                //setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 100 );
                //setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 150 );
                //setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 80 );

                $("body").trigger(feeddown);
                $("body").trigger(feedup);
                //$("body").trigger(feeddown);
                //$("body").trigger(feedup);
                //console.log("feed");
            }
            else if( (e.which == 3) ){ // right click
                
                $("body").trigger(feeddown);
                $("body").trigger(feedup);
                
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 160 );
                setTimeout( function(){ $("body").trigger(feedup); $("body").trigger(feedup); }, 160 );
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 170 );
                setTimeout( function(){ $("body").trigger(feedup); $("body").trigger(feedup); }, 170 );
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 180 );
                setTimeout( function(){ $("body").trigger(feedup); $("body").trigger(feedup); }, 180 );
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 190 );
                setTimeout( function(){ $("body").trigger(feedup); $("body").trigger(feedup); }, 190 );
                
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); },200 );
                setTimeout( function(){ $("body").trigger(feedup); $("body").trigger(feedup); }, 200 );
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 210 );
                setTimeout( function(){ $("body").trigger(feedup); $("body").trigger(feedup); }, 210 );
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 220 );
                setTimeout( function(){ $("body").trigger(feedup); $("body").trigger(feedup); }, 220 );
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 230 );
                setTimeout( function(){ $("body").trigger(feedup); $("body").trigger(feedup); }, 230 );
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 240 );
                setTimeout( function(){ $("body").trigger(feedup); $("body").trigger(feedup); }, 240 );
                setTimeout( function(){ $("body").trigger(feeddown); $("body").trigger(feedup); }, 250 );
                setTimeout( function(){ $("body").trigger(feedup); $("body").trigger(feedup); }, 250 );
                
                //$("body").trigger(splitdown);
                //$("body").trigger(splitup);
                //console.log("split");
            }
        }).bind('contextmenu', function(e){
            e.preventDefault();
        });
        //alert("mouse enabled");
    }
)();