// ==UserScript==
// @name         Modify RES Image Title
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Sets the title attribute on the RES Image in a Reddit thread to match the document title. This is done so extensions like Pinterest can capture the image and use the document's title as the description.
// @author       PoorPolonius
// @include      http://www.reddit.com/r/*
// @include      https://www.reddit.com/r/*
// @match        http://www.reddit.com/r/*
// @match        https://www.reddit.com/r/*
// @grant        GM_log
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @license      Copyright 2016 reddit.com/u/PoorPolonius; Released under the MIT license
// @downloadURL https://update.greasyfork.org/scripts/14600/Modify%20RES%20Image%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/14600/Modify%20RES%20Image%20Title.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...

var COUNTER_LIMIT = 5;

var _siteTable = "#siteTable",
    _toggleButton = "a[class*='toggleImage']",
    _resImage = "img[class*='RESImage']";

var _buttonCounter = 0,
    _imageCounter = 0;

var _handlerAttached = false,
    _delayTimer = null;

function ClearTimeout() {
    
    if (null !== _delayTimer) {
        
        clearTimeout(_delayTimer);
    }
}

function ToggleHandler(e) {

    ClearTimeout();
    
    var resImage = $(_resImage);

    if (0 < resImage.length) {

        $(_resImage).attr("title", document.title);
        
        DetachToggleHandler();
    }
    else if (COUNTER_LIMIT !== _imageCounter) {
        
        _delayTimer = setTimeout(ToggleHandler, 100);
    }
    else {
        
        DetachToggleHandler();
    }
    
    _imageCounter++;
}

function AttachToggleHandler() {

    ClearTimeout();
    
    var toggleButton = $(_toggleButton);
    
    if (!_handlerAttached && 0 < toggleButton.length) {
        
        toggleButton.on("click", ToggleHandler);
        
        _handlerAttached = true;
    }
    else if (COUNTER_LIMIT !== _buttonCounter) {
        
        _delayTimer = setTimeout(AttachToggleHandler, 100);
    }
    
    _buttonCounter++;
}

function DetachToggleHandler() {
    
    $(_toggleButton).off("click", ToggleHandler);
}

$(document).ready(function () {

    AttachToggleHandler();
});
