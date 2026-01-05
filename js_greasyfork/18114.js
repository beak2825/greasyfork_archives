// ==UserScript==
// @name        AgarNeo
// @namespace   
// @description NewDefaults, Name Preset, Adblocker, QuickW(hold E)
// @include     *://agar.io/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18114/AgarNeo.user.js
// @updateURL https://update.greasyfork.org/scripts/18114/AgarNeo.meta.js
// ==/UserScript==


// NewDefaults
setSkins(false);
setNames(false);
setColors(false);
setShowMass(true);
setDarkTheme(true);
setSkipStats(true);


// Preset Name
$("#nick").val("YOURNAME");


// AdBlock
$("#adbg").hide();																			// Ad center bottom
$("span.PubAdAI").hide();	
$("#mainPanel center small").hide();														// Ad center bottom text
$("div.form-group div[style='float: right; margin-top: 10px; height: 40px;']").hide();		// YT & FB Buttons

$("#instructions center span" ).append("<span>Hold <b>E</b> to eject mass continuously</span>");


// QuickEjectScript by Headshot (https://greasyfork.org/de/scripts/17612-agar-io-script-by-headshot)
// Hold [e] down and it will keep firing until you take your finger off!
console.log('called');
var interval;
var switchy = false;
$(document).on('keydown',function(e){
    console.log('keydown e.keyCode="'+e.keyCode+'"');
    if(e.keyCode == 69){ // [e]
        console.log('keydown 69, switchy '+switchy);
        if(switchy){
            return;
        }
        switchy = true;
        interval = setInterval(function() {
            console.log('firing');
            $("body").trigger($.Event("keydown", { keyCode: 87})); // simulate pressing [w] over and over again
            $("body").trigger($.Event("keyup", { keyCode: 87}));
        }, 3);//increase this number to make it fire them out slower
    }
})

$(document).on('keyup',function(e){
    console.log('keyup e.keyCode="'+e.keyCode+'"');
    if(e.keyCode == 69){
        console.log('stop firing');
        switchy = false;
        clearInterval(interval);
        return;
    }
})