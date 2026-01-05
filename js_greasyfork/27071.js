// ==UserScript==

// @name         Engage

// @namespace      
// @version      2
// @locale       USA
// @description  Increases your productivity on EarnHoney

// @author       Cannon

// @icon            http://i.imgur.com/FhCT7Ke.png

// @icon64URL       http://i.imgur.com/8VRBwr7.png

// @include	       http://*.engageme.tv/*

// @include	      *matchedcars.com/*

// @include	       *tvglee.com/*
// @include	       *tvminutes.com/*
// @include	       *miimd.com/*

// @downloadURL https://update.greasyfork.org/scripts/27071/Engage.user.js
// @updateURL https://update.greasyfork.org/scripts/27071/Engage.meta.js
// ==/UserScript==

setInterval(function() {

    main();

        if (jwplayer().play(false))

    {

        jwplayer().play(true);

    }

    jwplayer().setVolume(0);

    yesiam();
    
    Object.defineProperty(document, "hidden", { value : false});

}, 6000);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function main(){

    var adsearch = document.getElementsByClassName('jw-flag-ads');

        if (adsearch.length > 0)

        {

        console.log('Waiting for ad to finish to skip');

        }else{
            jwplayer().seek(jwplayer().getDuration()-5);


}

}