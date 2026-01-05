// ==UserScript==
// @name         FB CLEAR FONTS
// @namespace    FacebookEditLab
// @version      0.2
// @description  Change facebook default font to a clearer one, your eyes will not heart you anymore :p
// @author       Yassine Nacer
// @match        https://www.facebook.com/*
// @include      https://www.facebook.com/*
// @include      http://www.facebook.com/*
// @include      https://www.facebook.com/groups/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22447/FB%20CLEAR%20FONTS.user.js
// @updateURL https://update.greasyfork.org/scripts/22447/FB%20CLEAR%20FONTS.meta.js
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

    addStyle('@import url(https://fonts.googleapis.com/css?family=Cairo:700&subset=arabic);');
    addStyle('._5wj- { font-family: "Cairo", sans-serif !important; font-size: 15px !important;}');
    addStyle('.UFICommentBody { font-family: "Cairo", sans-serif !important; font-size: 15px !important;}');
    addStyle('._5pbx userContent { font-family: "Cairo", sans-serif !important; font-size: 15px !important;}');
    addStyle('._5v3q ._5pbx p { font-family: "Cairo", sans-serif !important; font-size: 15px !important;}');
    addStyle('.fbPhotosPhotoCaption { font-family: "Cairo", sans-serif !important; font-size: 15px !important;}');
    addStyle('._4ik6 { font-family: "Cairo", sans-serif !important; font-size: 15px !important;}');
    addStyle('.nameText _3gz_ { font-family: "Cairo", sans-serif !important; font-size: 15px !important;}');
    addStyle('._wpv { font-family: "Cairo", sans-serif !important; font-size: 15px !important;}');
    addStyle('body { font-family: "Cairo", sans-serif !important; font-size: 15px !important;}');
    addStyle('p { font-family: "Cairo", sans-serif !important; font-size: 15px !important;}');
    addStyle('._5rpb { font-family: "Cairo", sans-serif !important; font-size: 15px !important;}');
})();