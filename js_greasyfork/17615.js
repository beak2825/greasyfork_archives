// ==UserScript==
// @name         irccloud formatting helper
// @namespace    http://example.com/
// @version      0.1
// @description  Intercept ctrl+i and ctrl+b on irccloud and add the relevant
//               control characters.
// @author       Steve Howard
// @match        https://www.irccloud.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17615/irccloud%20formatting%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/17615/irccloud%20formatting%20helper.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

/**
 * formatHelper: String -> String
 * Converts IRC control characters to HTML tags to preview formatting
 */
function formatForBrowser (str) {
    var controlCharRegex = /(\x1d|\x02)/g;
    var pieces = str.split(controlCharRegex);
    var output = [];

    var bold = false, italic = false;

    for (var i = 0, end = pieces.length; i < end; ++i) {
        var piece = pieces[i];

        if (piece.match(/\x1d/)) {
            italic = !italic;
            output.push(italic ? '<i>' : '</i>');
        }
        else if (piece.match(/\x02/)) {
            bold = !bold;
            output.push(bold ? '<b>' : '</b>');
        }
        else {
            output.push(piece);
        }
    }

    return output.join('');
}

/**
 * createOverlay: Node -> Node
 * Creates a div that copies the same 
 */
function createOverlay (msg) {
    var o = document.createElement('div');
    o.style.width = msg.style.width;
    o.style.height = msg.style.height;
    o.style.whiteSpace = 'pre';

    o.addEventListener('click', function () { 
        msg.focus();
    });
    
    msg.addEventListener('keyup', function () {
        // Can't just make this a global variable because RegExps store state
        var controlCharRegex = /(\x1d|\x02)/g;
        if (controlCharRegex.test(msg.value)) {
            // If there were control characters, use the overlay/side by side view to preview message
            // Easier to check the contents than inspect the state from the above; clears itself when necessary
            o.innerHTML = formatForBrowser(msg.value);
            o.style.display = 'block';
        }
        else {
            // otherwise the text box by itself is much faster
            o.style.display = 'none';
        }
    });

    return o;
}


function main (msg) {
    var overlay = createOverlay(msg);
    msg.parentNode.appendChild(overlay);

    function keyHandler (e) {
        function emitControlCharacter (c) {
            var st = msg.selectionStart, en = msg.selectionEnd;

            // check for text selection. If so, insert control character twice
            if (st < en) {
                var val = msg.value;
                msg.value = val.substring(0, st) + c + val.substring(st, en) + c + val.substring(en);
            }
            else {
                msg.value += c;
            }
        }

        if (e.ctrlKey) {
            switch (e.keyCode) {
                case 73: // 'i'
                    emitControlCharacter('\x1d');
                    break;

                case 66: // 'b'
                    emitControlCharacter('\x02');
                    break;
            }
        }
    }

    msg.addEventListener('keyup', keyHandler);
}

(function () {
    var initialized = {};
    
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            Array.from(mutation.addedNodes).forEach(function (node) {
                var msg = node.querySelector && node.querySelector('[name=msg]');
                if (msg && !initialized[msg.id]) {
                    main(msg);
                    initialized[msg.id] = true;
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();