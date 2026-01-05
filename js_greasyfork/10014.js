// ==UserScript==
// @name        CoqCommandsCounter
// @namespace   CoqCommandsCounter
// @include     http://prover.cs.ru.nl/index.html
// @version     1
// @grant       none
// @description count commands used in Coq
// @downloadURL https://update.greasyfork.org/scripts/10014/CoqCommandsCounter.user.js
// @updateURL https://update.greasyfork.org/scripts/10014/CoqCommandsCounter.meta.js
// ==/UserScript==

/*
 * The MIT License (MIT)
 * 
 * Copyright (c) 2015 Camil Staps <info@camilstaps.nl>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

function countCommands(output, value) {
    var regex = /(?:^|\n)([a-z][a-zA-Z0-9_']*|LEM)/g;
    var matches = [], i = 0;

    do {
        match = regex.exec(value);
        if (match != null) {
            matches[i++] = match[1];
        }
    } while (match != null);

    if (matches.length == 0) {
        $(output).html("No Coq commands found.");
    } else {
        matches.sort();

        var counts = {};
        matches.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });

        var counts_output = [], i = 0;
        for (cmd in counts) {
            counts_output[i++] = counts[cmd] + "x " + cmd;
        }

        $(output).html(counts_output.join(", "));
    }
}

function selectElementText(el, win) {
    win = win || window;
    var doc = win.document, sel, range;
    if (win.getSelection && doc.createRange) {
        sel = win.getSelection();
        range = doc.createRange();
        range.selectNodeContents(el);
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (doc.body.createTextRange) {
        range = doc.body.createTextRange();
        range.moveToElementText(el);
        range.select();
    }
}

var cachedScript = '_';

$(document).ready(function(event) {
    var frame = $('#editframe');
    
    frame.css('height', 'calc(100% - 6em)');
    frame.parent().append('<div id="output" style="width: 100%; height: 6em; background: #fff; border: 1px solid #000; padding: 5px;"></div>');
    
    frame.load(function (){
        console.log("CoqCommandCounter: Rebinding DOMSubtreeModified")
        $(frame[0].contentDocument.body).bind("DOMSubtreeModified", function() {
            var str = $(this.children[0]).text();
            if(str != cachedScript)
            {
                cachedScript = str;
                console.log("Content updated: " + str);
                countCommands('#output', str);
            }
            
        });
    });
    
    $('#output').click(function() { 
       selectElementText($('#output')[0], null);         
    });
});
