// ==UserScript==
// @name     chatGPT for Persians (Professional rtl, Easy shortkeys, Support multi language and for coder users)
// @name:fa  راست چین chatgpt
// @description Fix rtl text issues for Persian/Farsi language. Press R+RIGHT for full rtl. R+LEFT for rtl align left. and R + DOWN for deactivation.
// @description:fa محیط چت جی پی تی رو راست چین میکنه و برای بلاک های کدینگ و استفاده ترکیبی دو زبانه بهینه شده. از دکمه های ترکیبی R و چپ R و راست و R پایین استفاده کنید.
// @version  1.3
// @namespace NIMABEHKARrtlchatgpt
// @grant    none
// @author   Nima Behkar
// @license  CC BY-NC-SA 4.0 DEED
// @match    *://chat.openai.com/*
// @downloadURL https://update.greasyfork.org/scripts/480558/chatGPT%20for%20Persians%20%28Professional%20rtl%2C%20Easy%20shortkeys%2C%20Support%20multi%20language%20and%20for%20coder%20users%29.user.js
// @updateURL https://update.greasyfork.org/scripts/480558/chatGPT%20for%20Persians%20%28Professional%20rtl%2C%20Easy%20shortkeys%2C%20Support%20multi%20language%20and%20for%20coder%20users%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const styles = {
        'rtlLeft': `
            body *:not(code):not(code *) {
                direction: rtl;
                text-align: left;
            }
            .z-0 {
                direction: ltr;
            }
            .scrollbar-trigger div {
                text-align: left;
            }
            pre, pre *, code, code * {
                direction: ltr !important;
                text-align: left !important;
            }
        `,
        'rtlRight': `
            body *:not(code):not(code *) {
                direction: rtl;
                text-align: right;
            }
            .z-0 {
                direction: ltr;
            }
            .scrollbar-trigger div {
                text-align: left;
            }
            pre, pre *, code, code * {
                direction: ltr !important;
                text-align: left !important;
            }
            .prose {
                padding-left: 0 !important;
            }
            .markdown ol,ul {
                padding-right: 1em !important;
                list-style-type: auto !important;
            }
            li {
                display: list-item !important;
            }
            li:before {
                content: '' !important;
            }
        `
    };

    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    document.head.appendChild(styleSheet);

    let currentStyle = '';

    const FapplyStyle = (styleName) => {
        if (styles[styleName]) {
            styleSheet.innerText = styles[styleName];
            currentStyle = styleName;
        }
    };

    const applyStyle = (styleName) => {
        if (styles[styleName]) {
            styleSheet.innerText = styles[styleName];
            currentStyle = styleName;
            alert(`استایل "${styleName}" فعال شد.`);
        }
    };

    const disableStyle = () => {
        styleSheet.innerText = '';
        currentStyle = '';
        alert('استایل غیرفعال شد.');
    };

    let lastKeyPressed = '';

    document.addEventListener('keydown', (event) => {
        if (event.key === 'r' || event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            if (lastKeyPressed === 'r' && event.key === 'ArrowLeft') {
                applyStyle('rtlLeft');
            } else if (lastKeyPressed === 'r' && event.key === 'ArrowRight') {
                applyStyle('rtlRight');
            } else if (lastKeyPressed === 'r' && event.key === 'ArrowDown') {
                if (currentStyle) {
                    disableStyle();
                }
            }
            lastKeyPressed = event.key;
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.key === lastKeyPressed) {
            lastKeyPressed = '';
        }
    });

    window.onload = () => {
        FapplyStyle('rtlRight'); 
    };
})();
