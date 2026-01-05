// ==UserScript==
// @name         Facebook Video Preload Blocker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Evita la precarga de videos en Facebook
// @author       Jose Enrique Ayala Villegas
// @match        https://www.facebook.com/*
// @grant        none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/29731/Facebook%20Video%20Preload%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/29731/Facebook%20Video%20Preload%20Blocker.meta.js
// ==/UserScript==
var v1 = true;
var list = {};
var mmm;
(function(open) {
    XMLHttpRequest.prototype.realOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        try{
            var url = arguments[1];
            if(url.indexOf('https://video') !== -1){
                var vname = url.split('/')[5].split('?')[0];
                var vid = vname.split('_')[1].substring(0,5);
                var dO = window.photos_snowlift === undefined ? true : photos_snowlift.classList.contains('hidden_elem');
                if(dO){
                    return;
                } else {
                    if(list[vname] === undefined) { list[vname] = 0; }
                    else {
                        if(list[vname] !== -1){
                            list[vname]++;
                            if(list[vname]>2){
                                list[vname] = -1;
                                mmm();
                            }
                        }
                    }
                }
            }
        } catch(e){}
        open.apply(this, arguments);
    };
    XMLHttpRequest.prototype.fakeOpen = XMLHttpRequest.prototype.open;
})(XMLHttpRequest.prototype.open);


window.onmousedown = function(e){
    if(e.target.tagName === 'I'){
        if(document.querySelectorAll('input[type="button"]',e.target).length>0){
            mmm = ((function(ee){
                var kke = ee.target.querySelector('input');
                if(kke.hasClick) return;
                kke.hasClick = true;
                kke.click();
            }).bind(null,e));
            console.log('Video Reproducir');
        }
    }
};