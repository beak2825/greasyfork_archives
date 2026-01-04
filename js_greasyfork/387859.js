// ==UserScript==
// @name         Google Search Result Toggle Chinese/English
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Toggle the result language for Google searches
// @author       tgxhx
// @match        https://www.google.com/search*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/387859/Google%20Search%20Result%20Toggle%20ChineseEnglish.user.js
// @updateURL https://update.greasyfork.org/scripts/387859/Google%20Search%20Result%20Toggle%20ChineseEnglish.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //return;
    const settingsBtn = document.querySelector('#hdtb-tls');
    const settingsBtnParent = settingsBtn.parentElement;
    const a = document.createElement('a');
    const query = new URLSearchParams(decodeURIComponent(location.search));
    const isChinese = (query.get('hl') || '').toLowerCase() === 'zh-cn';

    if (isChinese) {
        query.delete('hl');
        query.delete('lr');
        query.delete('tbs');
        a.textContent = 'English';
    } else {
        query.set('hl', 'zh-cn');
        query.set('lr', 'lang_zh-CN|lang_zh-TW');
        query.set('tbs', 'lr:lang_1zh-CN|lang_1zh-TW');
        a.textContent = 'Chinese';
    }

    const href = `${location.origin}${location.pathname}?${query.toString()}`;
    a.setAttribute('href', href);
    a.classList.add('t2vtad');
    a.style.cssText = 'color: #5f6368; margin-right: 0; border-rad none; border-top-right-radius: 0; border-bottom-right-radius: 0;';
    settingsBtn.cssText = 'border-top-left-radius: 0; border-bottom-left-radius: 0;';
    settingsBtnParent.insertBefore(a, settingsBtn);
})();