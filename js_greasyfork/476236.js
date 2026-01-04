// ==UserScript==
// @name            Detect Types
// @namespace       https://github.com/SlashNephy
// @version         0.1.0
// @author          SlashNephy
// @description     Register a function to generate runtime window type definitions.
// @description:ja  window の型定義を生成する関数を登録します。
// @homepage        https://scrapbox.io/slashnephy
// @homepageURL     https://scrapbox.io/slashnephy
// @icon            https://www.google.com/s2/favicons?sz=64&domain=*
// @supportURL      https://github.com/SlashNephy/userscripts/issues
// @match           https://*/*
// @grant           unsafeWindow
// @license         MIT license
// @downloadURL https://update.greasyfork.org/scripts/476236/Detect%20Types.user.js
// @updateURL https://update.greasyfork.org/scripts/476236/Detect%20Types.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const escapeKey = (key) => {
        if (key.includes('.')) {
            return `'${key}'`;
        }
        return key;
    };
    const getTypeString = (value) => {
        if (value === null) {
            return 'null';
        }
        if (Array.isArray(value)) {
            if (value.length === 0) {
                return 'unknown[]';
            }
            const types = Array.from(new Set(value.map(getTypeString)));
            if (types.length > 1) {
                return `(${types.join(' | ')})[]`;
            }
            return `${types.at(0)}[]`;
        }
        switch (typeof value) {
            case 'object': {
                const entries = Object.entries(value);
                if (entries.length === 0) {
                    return 'Record<string, unknown>';
                }
                return `{${entries.map(([k, v]) => `${escapeKey(k)}: ${getTypeString(v)}`).join(', ')}}`;
            }
            case 'function':
                return 'Function';
            default:
                return typeof value;
        }
    };
    unsafeWindow.getTypeString = getTypeString;
    unsafeWindow.printTypeString = (value) => {
        console.log(getTypeString(value));
    };

})();
