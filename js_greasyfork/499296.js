// ==UserScript==
// @name         知乎段落引用和图片引用
// @namespace    https://greasyfork.org/scripts/499296
// @icon         data:image/png;base64,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
// @version      1.0
// @description  在知乎段落和图片后添加灰色数字，用于复制引用和引用数
// @author       wzj042
// @match        *://www.zhihu.com/question/*
// @match        *://zhuanlan.zhihu.com/p/*
// @grant        GM_setClipboard
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499296/%E7%9F%A5%E4%B9%8E%E6%AE%B5%E8%90%BD%E5%BC%95%E7%94%A8%E5%92%8C%E5%9B%BE%E7%89%87%E5%BC%95%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/499296/%E7%9F%A5%E4%B9%8E%E6%AE%B5%E8%90%BD%E5%BC%95%E7%94%A8%E5%92%8C%E5%9B%BE%E7%89%87%E5%BC%95%E7%94%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to show toast message
    function showToast(message) {
        const toast = $('<div>').text(message).css({
            'position': 'fixed',
            'bottom': '20px',
            'left': '50%',
            'transform': 'translateX(-50%)',
            'background-color': 'rgba(0, 0, 0, 0.7)',
            'color': 'white',
            'padding': '10px 20px',
            'border-radius': '5px',
            'z-index': '1000',
            'font-size': '14px'
        }).hide().fadeIn(400);

        $('body').append(toast);

        setTimeout(() => {
            toast.fadeOut(400, () => {
                toast.remove();
            });
        }, 2000);
    }

    function addReferenceNumbers() {
        $('.RichContent, .Post-RichTextContainer').each(function() {
            let refIndex = 1;

            $(this).find('.RichText p:not(.ztext-empty-paragraph), .RichText figure, .RichText h1, .RichText h2, .RichText h3, .RichText blockquote, .RichText ol, .RichText ul').each(function() {
                if ($(this).is('p') && $(this).text().trim().length === 0) {
                    return; // Skip empty paragraphs
                }
                if (!$(this).find('.ref-number').length) {
                    var refNumber = $('<span>').text(` [${refIndex}]`).css({
                        'color': 'gray',
                        'cursor': 'pointer',
                        'user-select': 'none',
                        'margin-left': '5px'
                    }).addClass('ref-number');

                    refNumber.click(function() {
                        var refIndexText = $(this).text().match(/\d+/)[0];
                        var paragraphText;
                        if ($(this).parent().is('figure')) {
                            paragraphText = `图片[${refIndexText}]`;
                        } else {
                            paragraphText = $(this).parent().text().trim();
                        }
                        var copyText = `> ${paragraphText}\n`;
                        GM_setClipboard(copyText);
                        showToast('已复制引用:\n' + copyText);
                    });

                    $(this).append(refNumber);
                    refIndex++;
                }
            });
        });
    }

    // Use MutationObserver to watch for changes in the RichContent element
    function observeContentChanges() {
        const targetNodes = document.querySelectorAll('.RichContent, .Post-RichTextContainer');
        if (!targetNodes.length) return;

        const config = { childList: true, subtree: true };

        const callback = function(mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    addReferenceNumbers();
                }
            }
        };

        targetNodes.forEach((node) => {
            const observer = new MutationObserver(callback);
            observer.observe(node, config);
        });

        // Initial call to add numbers to already existing content
        addReferenceNumbers();
    }

    $(document).ready(function() {
        observeContentChanges();
    });

})();
