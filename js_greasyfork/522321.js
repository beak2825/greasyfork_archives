// ==UserScript==
// @name         Let Me Leave, Bro
// @author       Christopher Conley
// @copyright    Copyright (C) 2024 Christopher Conley
// @license      MIT
// @version      2024.12.30.0851
// @description  Do you hate "Are you SURE you want to leave this page?" dialogs that pop up when you try to close a tab? So do I. This is a Chrome extension and Tampermonkey script that prevents execution of those Javascript dialogs that prevent you from leaving a page.
// @namespace    https://github.com/rosettast0ned/let-me-leave-bro
// @source       https://github.com/rosettast0ned/let-me-leave-bro
// @supportURL   https://github.com/rosettast0ned/let-me-leave-bro/issues
// @match        *://*/*
// @icon         https://raw.githubusercontent.com/rosettast0ned/let-me-leave-bro/refs/heads/main/tampermonkey/let_me_leave_bro.png
// @icon64       https://raw.githubusercontent.com/rosettast0ned/let-me-leave-bro/refs/heads/main/tampermonkey/let_me_leave_bro64.png
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/522321/Let%20Me%20Leave%2C%20Bro.user.js
// @updateURL https://update.greasyfork.org/scripts/522321/Let%20Me%20Leave%2C%20Bro.meta.js
// ==/UserScript==
//
//

(function () {
    console.log('LMLB: Let Me Leave, Bro extension loaded.')

    const StopIt = (event) => {
        console.log('LMLB: Intercepting unload events.')
        event.stopImmediatePropagation();
        event.stopPropagation();
    };

    const AddListeners = () => {
        window.addEventListener("beforeunload", StopIt, { capture: true });
        document.addEventListener("beforeunload", StopIt, { capture: true });
        window.addEventListener("unload", StopIt, { capture: true });
        document.addEventListener("unload", StopIt, { capture: true });
        console.log('LMLB: Added listeners.');
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('LMLB: Document loaded, adding listeners.');
            AddListeners();
        });
    } else {
        console.log('LMLB: Document already loaded, adding listeners.');
        AddListeners();
    }

})();
