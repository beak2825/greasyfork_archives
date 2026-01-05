// ==UserScript==
// @name Force Flash Wmode 
// @namespace Mikhoul.rog
// @description Force flash video playback to use wmode direct to allow hardware acceleration
// @author      Based on anonymous Userscripts
// @version     1.0.2
// @include     http://www.youtube.com/watch*
// @include     http://youtube.com/watch*
// @include     https://www.youtube.com/watch*
// @include     https://youtube.com/watch*
// @include	http://dailymotion.com*
// @include	http://www.dailymotion.com*
// @include	https://dailymotion.com*
// @include	https://www.dailymotion.com*
// @include	http://vimeo.com*
// @include	http://www.vimeo.com*
// @include	https://vimeo.com*
// @include	https://www.vimeo.com*
// @include	http://metacafe.com*
// @include	http://www.metacafe.com*
// @include	https://metacafe.com*
// @include	https://www.metacafe.com*
// @include	http://funnyordie.com*
// @include	http://www.funnyordie.com*
// @include	https://funnyordie.com*
// @include	https://www.funnyordie.com*
// @include	http://videojug.com*
// @include	http://www.videojug.com*
// @include	https://videojug.com*
// @include	https://www.videojug.com*
// @include	http://blip.tv*
// @include	http://www.blip.tv*
// @include	https://blip.tv*
// @include	https://www.blip.tv*
// @include	http://vevo.com*
// @include	http://www.vevo.com*
// @include	https://vevo.com*
// @include	https://www.vevo.com*
// @include    	http://megavideo.com/*v=*
// @include	http://www.megavideo.com/*v=*
// @include	http://megaporn.com/video/*v=*
// @include	http://www.megaporn.com/video/*v=*
// @include	http://facebook.com/*video*
// @include	http://www.facebook.com/*video*
// @include	http://www.collegehumor.com/video/*
// @include	http://redtube.com/*
// @include	http://www.redtube.com/*
// @include	http://youporn.com/*watch*
// @include	http://www.youporn.com/*watch*
// @include	http://pornhub.com/*video*
// @include	http://www.pornhub.com/*video*
// @include	http://pornotube.com/*media*
// @include	http://www.pornotube.com/*media*
// @include	http://pornotube.com/*m=*
// @include	http://www.pornotube.com/*m=*
// @include	http://xvideos.com/*video*
// @include	http://www.xvideos.com/*video*
// @include	http://www.keezmovies.com/*
// @include	http://keezmovies.com/*
// @include	http://www.tube8.com/*
// @include	http://www.twitch.tv/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/5433/Force%20Flash%20Wmode.user.js
// @updateURL https://update.greasyfork.org/scripts/5433/Force%20Flash%20Wmode.meta.js
// ==/UserScript==

var targetNode=document.body;
var matchSelector="object[type='application/x-shockwave-flash']";
var onMatch=function(node){
    var wmodeParam=node.querySelector("object>param[name='wmode']");
    if(wmodeParam){
        wmodeParam.value="direct";
            //node.classList.add("userscript-patch---wmode-direct");
            //observer.disconnect();
        return true;
    }
};
var MutationObserver=window.MutationObserver;
var observer = new MutationObserver(function(mutations) {
    mutations.some(function(mutation){
        var addedNodes=Array.from(mutation.addedNodes||[]);
        return addedNodes.some(function(node){
            if(node.nodeType!==Node.ELEMENT_NODE)return;
            if(!node.mozMatchesSelector(matchSelector))return;
            return onMatch(node);
        });
    });
});
var options={childList: true, subtree: true};
observer.observe(targetNode, options);