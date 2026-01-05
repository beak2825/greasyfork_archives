// ==UserScript==
// @name         Polycount Old Link Converter
// @description  Redirects from an old, broken, link to the working one
// @author       Nelios
// @match        *://*polycount.com/*
// @exclude      *://*wiki.polycount.com/*
// @exclude      *://*polycount.com/
// @exclude      *://*polycount.com/discussion/*
// @exclude      *://*polycount.com/forum
// @exclude      *://*polycount.com/categories*
// @grant        none
// @version 0.0.1.20151102160520
// @namespace https://greasyfork.org/users/19412
// @downloadURL https://update.greasyfork.org/scripts/13559/Polycount%20Old%20Link%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/13559/Polycount%20Old%20Link%20Converter.meta.js
// ==/UserScript==

var oldUrl = window.location.href;
var expThread = /\?[t]=([0-9]*)/;
var expPost = /com\/([0-9]*)/;
var newId;
var urlStart;
var urlEnd = '';
$(document).ready(function(){
    try{
        newId = expThread.exec(oldUrl)[1];
        urlStart = 'http://polycount.com/discussion/';
    }
    catch(err){
        newId = expPost.exec(oldUrl)[1];
        urlStart = 'http://polycount.com/discussion/comment/';
        urlEnd = '/#Comment_' + newId;
    }

    if(newId !== undefined && newId !== ''){
        window.location.assign(urlStart + newId + urlEnd);
    }
});