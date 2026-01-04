// ==UserScript==
// @name     Misskey AtCoder Color Buttons
// @namespace https://misskey.kyoupro.com/
// @version  1.1.0
// @description Add color buttons to Misskey for AtCoder
// @grant    none
// @include  https://misskey.kyoupro.com/*
// @license  MIT
// @downloadURL https://update.greasyfork.org/scripts/470709/Misskey%20AtCoder%20Color%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/470709/Misskey%20AtCoder%20Color%20Buttons.meta.js
// ==/UserScript==

var colors = {
    "灰": "808080",
    "茶": "804000",
    "緑": "008000",
    "水": "00C0C0",
    "青": "0000FF",
    "黄": "C0C000",
    "橙": "FF8000",
    "赤": "FF0000"
};

function darkenColor(color, percent) {
    var num = parseInt(color, 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        G = (num >> 8 & 0x00FF) + amt,
        B = (num & 0x0000FF) + amt;
    return (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
            mutation.addedNodes.forEach(function(node) {
                if (node.querySelector) {
                    var textArea = node.querySelector('textarea[data-cy-post-form-text]');
                    if (textArea) {
                        // Create a wrapper div for all buttons
                        var buttonsWrapper = document.createElement('div');
                        buttonsWrapper.style.display = 'flex';
                        buttonsWrapper.style.flexWrap = 'wrap';
                        buttonsWrapper.style.margin = '0px 16px 8px 16px';  // Add margin around the div

                        Object.entries(colors).forEach(([name, color]) => {
                            var button = document.createElement('button');
                            button.textContent = name;
                            button.style.backgroundColor = '#' + color;
                            button.style.margin = '2px';
                            button.style.border = `2px solid #${darkenColor(color, 20)}`;  // Add darker border
                            button.style.borderRadius = '8px';  // Make button round
                            button.style.color = '#fff';  // Change text color to white
                            button.style.textShadow = '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black';  // Add text border
                            button.addEventListener('click', function() {
                                var cursorPos = textArea.selectionStart;
                                var endPos = textArea.selectionEnd;
                                var textBefore = textArea.value.substring(0,  cursorPos);
                                var textAfter  = textArea.value.substring(endPos, textArea.value.length);
                                var selectedText = textArea.value.substring(cursorPos, endPos) || 'text';  // If no text is selected, default to 'text'
                                textArea.value = textBefore + `$[fg.color=${color} ${selectedText}]` + textAfter;
                            });

                            // Add the button to the wrapper div
                            buttonsWrapper.appendChild(button);
                        });

                        var form = node.querySelector('footer[class=xkr7J]');
                        if (form) form.after(buttonsWrapper);  // Insert the div after the form
                    }
                }
            });
        }
    });
});

observer.observe(document.body, { childList: true, subtree: true });
