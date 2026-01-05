// ==UserScript==
// @name         Facebook UnWower
// @namespace    facebookWow
// @version      0.2
// @description  This will be the antidote to the Facebook Wower.
// @author       William Nielsen
// @match        http*://www.facebook.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17430/Facebook%20UnWower.user.js
// @updateURL https://update.greasyfork.org/scripts/17430/Facebook%20UnWower.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

function scanForWows(){
    var likeList = document.querySelectorAll('[data-testid="fb-ufi-unlikelink"]');
    
    for( var i = 0; i < likeList.length; i++ ){
        var a = likeList[i];
        console.log(a);
        if(isSpanWow(a)){
            a.click();
        }
    }
}

function isSpanWow( e ) {
    if( e.innerHTML.indexOf("Wow") > 0 )
        return true;
    else
        return false;

}

document.addEventListener("keyup", scanForWows);