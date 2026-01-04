// ==UserScript==
// @name         Vidio Remove Chat
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove annoying chat bar on the right side on the vidio.com
// @author       Akzn
// @include      /^https?:\/\/vidio.com/*
// @include      /^https?:\/\/www.vidio.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422081/Vidio%20Remove%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/422081/Vidio%20Remove%20Chat.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('Remove Chat')
     try{
        var chatEle = document.getElementsByClassName( 'livestreaming-discussion' );
        chatEle[1].remove();
    } catch(err){
        return false;
        console.log('Error Searching Element')
    }
    // Your code here...
})();