// ==UserScript==
// @name         video speed up
// @namespace    http://sthelse.net
// @icon         https://www.iconfinder.com/icons/2998137/download/ico
// @version      0.1
// @description  take control of video speed
// @author       chenkai
// @match        https://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499972/video%20speed%20up.user.js
// @updateURL https://update.greasyfork.org/scripts/499972/video%20speed%20up.meta.js
// ==/UserScript==
/* jshint esnext:true */
(function() {
    'use strict';
    var statusBarId=-1;
    var rate=GM_getValue('rate', 1.5);
    console.log('start', rate);
    var videoObserver=function (arr){
        for(var i=0;i<arr.length;i++){
            var len=arr[i].addedNodes.length;
            for(var j=0;j<len;j++) {
                //var n=arr[i].addedNodes[j];
                if(arr[i].addedNodes[j].tagName == 'VIDEO') {
                    var v=arr[i].addedNodes[j];
                    if(1 != v.getAttribute('__vs_attached')) {
                        v.addEventListener('canplay', function (){
                            this.playbackRate=rate;
                        });
                        v.setAttribute('__vs_attached',1);
                    }
                }
            }
        }
    };
    var obs=new MutationObserver(videoObserver);
    console.log('attached');
    obs.observe(document, {'childList':true, 'attributes':false,'subtree':true,'characterData':false});

    var setRate = function (toRate){
        rate=toRate;
        GM_setValue('rate',rate);
        document.querySelectorAll('video').forEach(i => {
            i.playbackRate=rate;
        });
        setRateStatusBar(rate);
    }

    GM_registerMenuCommand("0.5x", function (){
        setRate(0.5);
    });

    GM_registerMenuCommand("1x", function (){
        setRate(1);
    });

    GM_registerMenuCommand("1.5x", function (){
        setRate(1.5);
    });

    GM_registerMenuCommand("2x", function (){
        setRate(2);
    });

    var setRateStatusBar = function (toRate) {
        statusBarId=GM_registerMenuCommand("Current Speed: "+toRate, function (){}, {id:statusBarId});
    }
    setRateStatusBar(rate);
})();
