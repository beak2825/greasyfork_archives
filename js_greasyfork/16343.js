 // ==UserScript==
    // @name         twatEmotes
    // @version      0.1
    // @description  Emoticons for v4c and other synctube rooms by TWAT
    // @match        *://instasync.com/r/v4c
    // @match        *://instasync.com/r/movie4chan
    // @match        *://instasync.com/r/*
    // @grant        twatEmotes
    // @copyright    2016
// @namespace https://greasyfork.org/users/12145
// @downloadURL https://update.greasyfork.org/scripts/16343/twatEmotes.user.js
// @updateURL https://update.greasyfork.org/scripts/16343/twatEmotes.meta.js
    // ==/UserScript==
     
self.$externalEmotes = {};
 //if (typeof(self.$twatEmotes) === "undefined") self.$twatEmotes = {};
script.$twatEmotes={
    
'boo': '<img src="http://i.imgur.com/vqThWEh.png" width="36" height="36">',



};
$.extend(script.$externalEmotes, script.$twatEmotes);