// ==UserScript==
// @name         GitHub Pull requests file path
// @namespace    https://doctusoft.com/
// @version      1.1
// @description  This scripts converts shortened file paths (.../path/to/file) to full path (full/path/to/file)
// @author       Peter Farkas
// @include      https://github.com/*
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37023/GitHub%20Pull%20requests%20file%20path.user.js
// @updateURL https://update.greasyfork.org/scripts/37023/GitHub%20Pull%20requests%20file%20path.meta.js
// ==/UserScript==

function setCorrectFilePath() {
    'use strict';
    var t = $('div.file-info > a');
    for(var i = 0; i < t.length; i++) {
        t[i].textContent = t[i].title;
    }
}

function runCorrection() {
    var token = window.setInterval(setCorrectFilePath, 1000);
    window.setTimeout(function(){
        window.clearInterval(token);
    }, 20100);
}

var regex = /^https:\/\/github.com\/[^\/]+\/[^\/]+\/(?:pull\/[^\/]+\/(?:files|commits\/[^\/]+)?|commit\/[^\/]+)/gi;
console.log(regex.source);

var url = "";

function pollUrl() {
    if(url !== window.location.href) {
        url = window.location.href;
        if (regex.test(url)) {
            runCorrection();
        }
    }
}

window.setInterval(pollUrl, 1000);

pollUrl();