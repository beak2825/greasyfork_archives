// ==UserScript==
// @name         Noto Sans CJK Fonts Import
// @name:ja         Noto Sans CJK Fonts Import
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  Make Noto Sans CJK Fonts Available to all Sites
// @description:ja  すべてのサイトでNoto Sans CJK Fontsを利用できるため
// @author       You
// @match        https://*/*
// @icon         https://cdn-1.webcatalog.io/catalog/google-fonts/google-fonts-icon-filled.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429074/Noto%20Sans%20CJK%20Fonts%20Import.user.js
// @updateURL https://update.greasyfork.org/scripts/429074/Noto%20Sans%20CJK%20Fonts%20Import.meta.js
// ==/UserScript==
-(function $$($$count) {
    'use strict';

    if (!document.documentElement) return window.requestAnimation(() => $$count ? $$($$count - 1) : 0);

    function addStyle(styleText) {
        const styleNode = document.createElement('style');
        styleNode.type = 'text/css';
        styleNode.textContent = styleText;
        document.documentElement.appendChild(styleNode);
        return styleNode;
    }

    let r = [
        'family=Noto+Sans:wght@300;400;500;600;700',
        'family=Noto+Sans+HK:wght@300;400;500;600;700',
        'family=Noto+Sans+TC:wght@300;400;500;600;700',
        'family=Noto+Sans+SC:wght@300;400;500;600;700',
        'family=Noto+Sans+JP:wght@300;400;500;600;700',
        'family=Noto+Sans+KR:wght@300;400;500;600;700',
        'display=swap'
    ];

    let url = 'https://fonts.googleapis.com/css2?' + r.join('&');

    addStyle(`@import url('${url}');`);

})(4);