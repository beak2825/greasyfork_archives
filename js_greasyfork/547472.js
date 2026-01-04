// ==UserScript==
// @name         Ísland.is Kennitala Fix (SPA-safe) (Lárus Björn Björnsson | 160808-2170)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Works with React routing on island.is and safely replaces Kennitala without breaking layout or styles.
// @author       You
// @match        https://island.is/minarsidur/min-gogn/yfirlit
// @match        https://island.is/minarsidur/min-gogn/yfirlit/*
// @grant        none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/547472/%C3%8Dslandis%20Kennitala%20Fix%20%28SPA-safe%29%20%28L%C3%A1rus%20Bj%C3%B6rn%20Bj%C3%B6rnsson%20%7C%20160808-2170%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547472/%C3%8Dslandis%20Kennitala%20Fix%20%28SPA-safe%29%20%28L%C3%A1rus%20Bj%C3%B6rn%20Bj%C3%B6rnsson%20%7C%20160808-2170%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const oldKT = '160808-2170';
    const newKT = '160805-2170';
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