// ==UserScript==
// @name         9GAG Quick Download
// @namespace    de.nugorra
// @version      0.4
// @description  Quick download button, to download the not webp/webm version. Because some people can't find the download link.
// @author       Nugorra
// @match        https://9gag.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405682/9GAG%20Quick%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/405682/9GAG%20Quick%20Download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var element;

    if (document.querySelector('.image-post') !== null) {
        element = document.querySelector('.image-post img');
    } else if (document.querySelector('.video-post') !== null) {
        element = document.querySelector('.video-post source[type="video/mp4"]');
    } else {
        console.log("Screw it, I'm out!");
        return;
    }
    if(typeof element.src === 'undefined') { return; }
    var url = element.src;
    var a = document.createElement('a');
    a.href = new URL(url).pathname;
    a.style="text-indent: 0; text-align: center; padding-top: 2px; font-size: 20px;"
    a.setAttribute('download', '');
    a.innerHTML = "&#128190";
    var li = document.createElement('li');
    li.append(a);

    var voteBox = document.querySelector('.post-afterbar-a ul:first-of-type');
    voteBox.append(li);
})();