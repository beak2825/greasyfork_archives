// ==UserScript==
// @name         Ísland.is Kennitala Fix (SPA-safe) (Þórdís Anna Sigtryggsdóttir | 090109-2190)
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Works with React routing on island.is and safely replaces Kennitala without breaking layout or styles.
// @author       You
// @match        https://island.is/minarsidur/min-gogn/yfirlit
// @match        https://island.is/minarsidur/min-gogn/yfirlit/*
// @grant        none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/547511/%C3%8Dslandis%20Kennitala%20Fix%20%28SPA-safe%29%20%28%C3%9E%C3%B3rd%C3%ADs%20Anna%20Sigtryggsd%C3%B3ttir%20%7C%20090109-2190%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547511/%C3%8Dslandis%20Kennitala%20Fix%20%28SPA-safe%29%20%28%C3%9E%C3%B3rd%C3%ADs%20Anna%20Sigtryggsd%C3%B3ttir%20%7C%20090109-2190%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const oldKT = '090109-2190';
    const newKT = '090105-2190';
    const oldKTplain = oldKT.replace('-', '');
    const newKTplain = newKT.replace('-', '');
    setInterval(() => {
        document.querySelectorAll('p, span, div').forEach(el => {
            if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
                let text = el.textContent;

                if (text.includes(oldKT)) {
                    el.textContent = text.replace(oldKT, newKT);
                }

                if (text.includes(oldKTplain)) {
                    el.textContent = text.replace(oldKTplain, newKTplain);
                }
            }
        });
    }, 50);
})();