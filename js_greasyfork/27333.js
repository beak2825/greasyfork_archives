// ==UserScript==

// @name         Engage

// @namespace            https://greasyfork.org/en/users/95954

// @version      2

// @description  Increases your productivity on EngageME.TV

// @author       Ａ ｅ ｓ ｔ ｈ ｅ ｔ ｉ ｃ ｓ

// @icon            http://i.imgur.com/FhCT7Ke.png

// @icon64URL       http://i.imgur.com/8VRBwr7.png

// @include	      *engageme.tv/*

// @include	      *matchedcars.com/*

// @include	       *tvglee.com/*
// @include	       *tvminutes.com/*
// @include	       *miimd.com/*
// @include        *earnhoney.com*

// @downloadURL https://update.greasyfork.org/scripts/27333/Engage.user.js
// @updateURL https://update.greasyfork.org/scripts/27333/Engage.meta.js
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




function main(){

    var adsearch = document.getElementsByClassName('jw-flag-ads');

        if (adsearch.length > 0)

        {

        console.log('Waiting for ad to finish to skip');

        }else{
            jwplayer().seek(jwplayer().getDuration()-5);


}

}