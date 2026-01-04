// ==UserScript==
// @name           GoogleChat edit submit-key
// @namespace      https://greasyfork.org/ja/users/740641
// @version        0.5.1.8
// @description    GoogleChat上でEnterKeyで改行,Ctrl+Enterで送信されるようになります.
// @author         malleroid
// @license        MIT
// @include        https://chat.google.com/u/*/room/*
// @supportURL     https://greasyfork.org/ja/users/740641
// @licence        MIT
// @downloadURL https://update.greasyfork.org/scripts/422368/GoogleChat%20edit%20submit-key.user.js
// @updateURL https://update.greasyfork.org/scripts/422368/GoogleChat%20edit%20submit-key.meta.js
// ==/UserScript==

(function () {
    document.addEventListener('keydown', function (event) {
        // if (event.ctrlKey && event.key == 'Enter') {
        //     console.log('ctrl+enter');
        //     event.preventDefault();
        //     var newSubmitEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        //     document.dispatchEvent(newSubmitEvent);
        // }
        // else if (event.shiftKey && event.key == 'Enter') {
        //     console.log('shift+enter');
        // }
        if (event.key == 'Alt') {
            console.log('alt');
            event.preventDefault();
            var newLineEvent = new KeyboardEvent('keydown', { key: 'a', shiftKey: true });
            document.dispatchEvent(newLineEvent);
        }
    }, { passive: false });
})();