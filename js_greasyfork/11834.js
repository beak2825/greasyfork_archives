// ==UserScript==
// @name                 Agario Fire Feed
// @namespace    GuessX
// @version      v4
// @description  Agar.io
// @author       GuessX
// @match        http://agar.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11834/Agario%20Fire%20Feed.user.js
// @updateURL https://update.greasyfork.org/scripts/11834/Agario%20Fire%20Feed.meta.js
// ==/UserScript==
 
//v1
//Press Q will fire upto 8 feeds
/*$(document).on('keydown',function(e){
    if(e.keyCode == 81){
        for(var i = 0; i<8; i++){
            $("body").trigger($.Event("keydown", { keyCode: 87}));
            $("body").trigger($.Event("keyup", { keyCode: 87}));
        }
    }
})
*/
 
//v2
//Press Q will fire upto 8 feeds
/*$(document).on('keyup',function(e){
        if(e.keyCode == 81){
                var count = 0;
                var interval = setInterval(function() {
        if(count > 7){
                                clearInterval(interval);
                                return;
                        }
                        count++
                        console.log('firing')
                        $("body").trigger($.Event("keydown", { keyCode: 87}));
                        $("body").trigger($.Event("keyup", { keyCode: 87}));
                }, 50);
        }
})*/
 
//v3
//Press Q will fire upto 20 feeds
/*var interval;
var theSwitch = false;
$(document).on('keyup',function(e){
        if(e.keyCode == 81){
                var count = 0;
                if(theSwitch){
                        theSwitch = false;
                        clearInterval(interval);
                        return;
                }
                theSwitch = true;
                interval = setInterval(function() {
                        if(count > 20){ //Change this number if you want more
                                theSwitch = false;
                                clearInterval(interval);
                                return;
                        }
                        count++
                        console.log('firing')
                        $("body").trigger($.Event("keydown", { keyCode: 87}));
                        $("body").trigger($.Event("keyup", { keyCode: 87}));
                }, 10);//increase this number to make it fire them out slower
        }
})*/
 
//v4
//Hold Q down and it will keep firing untill you take your finger off!
var interval;
var switchy = false;
$(document).on('keydown',function(e){
        if(e.keyCode == 81){
                if(switchy){
                        return;
                }
                switchy = true;
                interval = setInterval(function() {
                        console.log('firing')
                        $("body").trigger($.Event("keydown", { keyCode: 87}));
                        $("body").trigger($.Event("keyup", { keyCode: 87}));
                }, 10);//increase this number to make it fire them out slower
        }
})
 
$(document).on('keyup',function(e){
        if(e.keyCode == 81){
                switchy = false;
                clearInterval(interval);
                return;
        }

    })
