/**
  The MIT License (MIT)

  Copyright (c) 2017 Michael Charles Aubrey
  
  Permission is hereby granted, free of charge, to any person obtaining a copy of
  this software and associated documentation files (the "Software"), to deal in
  the Software without restriction, including without limitation the rights to
  use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
  the Software, and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
  FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
  COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
  IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
**/
// ==UserScript==
// @name         CSS Editor for ProtonMail
// @namespace    http://tampermonkey.net/
// @namespace    http://michaelcharl.es
// @version      0.1
// @description  See your CSS edits as you type.
// @author       MichaelCharl.es/Aubrey
// @match        https://*.protonmail.com/*
// @grant        none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/27645/CSS%20Editor%20for%20ProtonMail.user.js
// @updateURL https://update.greasyfork.org/scripts/27645/CSS%20Editor%20for%20ProtonMail.meta.js
// ==/UserScript==
/* global $ */
(function() {
    'use strict';
    var $cssEdit = $('<div id="css-edit"></div>');
    var $topTools = $('<span id="top-tools"></span>');
    var $bottomTools = $('<span id="bottom-tools"></span>');
    var $topToggleButton = $('<button class="toggle">Toggle</button>');
    var $bottomToggleButton = $('<button class="toggle">Toggle</button>');
    var $downButton = $('<button class="move-down">Down</button>');
    var $upButton = $('<button class="move-up">Up</button>');
    var $textareaWrap = $('<div class="textarea-wrap"></div>');
    var $textarea = $('<textarea></textarea>');
    var $editorStyles = $('<style>#css-edit{z-index:9000000000000000;text-align:right;position:fixed;bottom:0;right:0}#css-edit textarea{display:block;width:400px;height:200px;background:rgba(33,33,33,.75);border:0;color: white !important;font-family: monospace !important;font-weight: 600;}#css-edit button{min-width:100px;background:#212121;color:white;border:0;font-weight:700;padding:.5em;cursor:pointer;}#css-edit span{display: block;background-color: #212121;}</style>');
    var $styleEdits = $('<style></style>');
    
    $("head").append($editorStyles);
    $("head").append($styleEdits);
    
    $topTools.append($topToggleButton);
    $topTools.append($downButton);
    $bottomTools.append($bottomToggleButton);
    $bottomTools.append($upButton);
    
    $textareaWrap.append($textarea);
    
    $cssEdit.append($topTools);
    $cssEdit.append($textareaWrap);
    $cssEdit.append($bottomTools);
    
    $topTools.hide();
    
    $("body").append($cssEdit);
    
    $upButton.click(function(){
        $cssEdit.css({
            "bottom": "auto",
            "top": "0"
        });
        $bottomTools.hide();
        $topTools.show();
    });
    $downButton.click(function(){
        $cssEdit.css({
            "bottom": "0",
            "top": "auto"
        });
        $topTools.hide();
        $bottomTools.show();
    });
    
    $bottomToggleButton.click(toggleStyleDisplay);
    $topToggleButton.click(toggleStyleDisplay);
    $textarea.keyup(applyStyles);
    
    function applyStyles() {
        $styleEdits.html($textarea.val());
    }
    
    function toggleStyleDisplay() {
        $textareaWrap.toggle();
    }
})();