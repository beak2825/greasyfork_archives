// ==UserScript==
// @name         Evex Banner Contest Viewer
// @namespace    faubiguy
// @version      0.1
// @description  Previews banners for the reddit.com/r/EVEX banner contest
// @author       faubiguy
// @match        https://www.reddit.com/r/EVEX/comments/3uztta/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14606/Evex%20Banner%20Contest%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/14606/Evex%20Banner%20Contest%20Viewer.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

if (document.body.classList.contains('comment-permalink-page')) {
    console.log('Switching banner image');
    var commentbody = document.getElementsByClassName('comment')[0].getElementsByClassName('usertext-body')[0];
    var imagelinks = Array.prototype.slice.call(commentbody.getElementsByTagName('a')).filter(function(url){return /\.(jpg|jpeg|png|gif)($|\?)/.exec(url.href);});
    console.log(Array.prototype.slice.call(commentbody.getElementsByTagName('a')).map(function(url){return url.href}));
    if (imagelinks.length === 0) {
        console.log('No images found');
        return;
    }
    console.log('Found an image to use: ' + imagelinks[0].href);
    var newstyle = document.createElement('style');
    newstyle.innerHTML = '#header{background-image:url("'+ imagelinks[0].href +'")!important;}';
    document.head.appendChild(newstyle);
    console.log('Appended style');
}