// ==UserScript==
// @name         XKCD Print Titles
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Change XKCD/what-if image alt text to captions and show reference text inline (and don't hide on click)
// @author       You
// @match        https://*.xkcd.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27830/XKCD%20Print%20Titles.user.js
// @updateURL https://update.greasyfork.org/scripts/27830/XKCD%20Print%20Titles.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...
var img = document.querySelectorAll('#comic img');
if(img.length === 0)
    img = document.querySelectorAll('.entry img');
img.forEach(function(element) {
    var title = element.title;
    if(title !== undefined) {
        var p = document.createElement('p');
        p.style.textAlign = 'center';
        p.style.lineHeight = 1.5;
        p.style.backgroundColor = '#ccc';
        p.style.padding = 5;
        p.innerHTML = `<span style="padding: 5px">${title}</span>`;
        element.parentNode.insertBefore(p, element.nextSibling);
    }
});

var ref = document.querySelectorAll('article .ref');
ref.forEach(function(element) {
    var refBody = element.querySelector(':scope .refbody');
    refBody.style.position = 'relative';
    refBody.style.display = 'inline-block';
    refBody.style.left = 0;
    refBody.style.bottom = 0;
    refBody.style.overflow = 'visible';
});

jQuery('.refnum').prop('onclick', null).off('click');
jQuery('body').prop('onclick', null).off('click');