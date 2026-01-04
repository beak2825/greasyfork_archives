// ==UserScript==
// @name         Edit Enhance in Wucai
// @namespace    http://tampermonkey.net/
// @version      0.2.6
// @description  Automatically transform "[" to "[]" and "【" to "【】" in textarea with optional selection inclusion, and convert "【【】】" to "[[]]"
// @author       Benature
// @match        https://marker.dotalk.cn/*
// @grant        none
// @license      MIT
// @icon         https://wucaiimg.dotalk.cn/wcfe8/20240114180352/wucai-icon-light.png
// @homepageURL  https://github.com/Benature
// @downloadURL https://update.greasyfork.org/scripts/484818/Edit%20Enhance%20in%20Wucai.user.js
// @updateURL https://update.greasyfork.org/scripts/484818/Edit%20Enhance%20in%20Wucai.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const pairs = {
      '[': ']',
      '【': '】',
      '[[': ']]'
    }

    function handle(e) {
        if (e.target.tagName.toLowerCase() !== 'textarea') { return; }
        // Check if the target is a textarea and the pressed key is '[' or '【'
        const textarea = e.target;
        const selectionStart = textarea.selectionStart;
        const selectionEnd = textarea.selectionEnd;
        const originalText = textarea.value;

        if (/[\[【]/.test(e.key)) {
            e.preventDefault(); // Prevent the original key from being inputted

            let pre_text = originalText.substring(0, selectionStart);
            let suf_text = originalText.substring(selectionEnd);

            let newText;
            let prefix = e.key;


            if (/[\[【]/.test(pre_text.slice(-1)) && /[\]】]/.test(suf_text.slice(0, 1))) {
                pre_text = pre_text.slice(0, -1);
                suf_text = suf_text.slice(1);
                prefix = "[[";
            }

            const suffix = pairs[prefix];


            newText = pre_text + prefix +
                      (selectionStart !== selectionEnd ? originalText.substring(selectionStart, selectionEnd) : '') +
                      suffix + suf_text;

            textarea.value = newText;
            textarea.setSelectionRange(selectionStart + 1, selectionEnd + 1);
        } else if (e.code === 'Backspace' && e.key === 'Backspace') {
            // Check if deleting "[" and the character after it is "]"
            let prefix = originalText[selectionStart - 1];
            if (!/[\[【]/.test(prefix)) { return; }
            let suffix = pairs[prefix];
            if (originalText[selectionStart] === suffix) {
                e.preventDefault();
                const newText = originalText.substring(0, selectionStart - 1) + originalText.substring(selectionStart + 1);
                textarea.value = newText;

                // Maintain the selection
                textarea.setSelectionRange(selectionStart - 1, selectionStart - 1);
                // return;
            }
        }

        // workaround: enusre textarea kown input event
        var event = new InputEvent('input', {
          'bubbles': true,
          'cancelable': true,
          // 'data': '这是要插入的文本'
        });
        textarea.dispatchEvent(event);
    }

    document.addEventListener('keydown', handle);
})();