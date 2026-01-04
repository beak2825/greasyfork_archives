// ==UserScript==
// @name         FB RALEWAY
// @namespace    https://greasyfork.org/en/users/346130-nightmyst
// @version      1.5
// @description  Change facebook default font to Raleway family
/* The user can sustitute any font desired. Google has many fonts
 * that can be used. Simply find the font you want and substitute.
 */
// @author       NightMyst
// @match        https://www.facebook.com/*
// @include      https://www.facebook.com/*
// @include      http://www.facebook.com/*
// @include      https://www.facebook.com/groups/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389449/FB%20RALEWAY.user.js
// @updateURL https://update.greasyfork.org/scripts/389449/FB%20RALEWAY.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addStyle('@import url(https://fonts.googleapis.com/css?family=Raleway&display=swap);'); // Set Font Family from Google Fonts
//    addStyle('._5wj- { font-family: "Raleway", sans-serif !important; font-size: 18px !important;}');
    addStyle('._2s25 { font-family: "Raleway", sans-serif !important; font-size: 16px !important;}'); // Top Navigation Text 'user' 'home' 'find friends' 'create'
    addStyle('._16ve { font-family: "Raleway", sans-serif !important; font-size: 11px !important;}'); // Icons 'photo/video' 'tag friends' 'feeling/activity'
    addStyle('._72vr { font-family: "Raleway", sans-serif !important; font-size: 14px !important;}'); // Comments +
    addStyle('._4w79 { font-family: "Raleway", sans-serif !important; font-size: 14px !important;}'); // Comment Input Text
    addStyle('._55lr { font-family: "Raleway", sans-serif !important; font-size: 10px !important;}'); // Right panel
    addStyle('._5afe { font-family: "Raleway", sans-serif !important; font-size: 12px !important;}'); // Left panel
//    addStyle('._5pbx userContent { font-family: "Raleway", sans-serif !important; font-size: 13px !important;}'); // User Content
    addStyle('.fwb { font-family: "Raleway", sans-serif !important; font-size: 14px !important;}'); // Poster's Name
    addStyle('._wpv { font-family: "Raleway", sans-serif !important; font-size: 12px !important;}'); // Poster's Group
    addStyle('._5v3q ._5pbx p { font-family: "Raleway", sans-serif !important; font-size: 16px !important;}'); // Poster's Text
    addStyle('.fbPhotosPhotoCaption { font-family: "Raleway", sans-serif !important; font-size: 12px !important;}'); // Photo Captions
//    addStyle('._4ik6 { font-family: "Raleway", sans-serif !important; font-size: 10px !important;}');
    addStyle('.nameText _3gz_ { font-family: "Raleway", sans-serif !important; font-size: 18px !important;}');
    addStyle('body { font-family: "Raleway", sans-serif !important; font-size: 12px !important;}');
    addStyle('p { font-family: "Raleway", sans-serif !important; font-size: 12px !important;}'); // Basic 'body' text
    addStyle('._5rpb { font-family: "Raleway", sans-serif !important; font-size: 18px !important;}');
})();