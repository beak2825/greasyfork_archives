// ==UserScript==
// @name ShowModalDialog
// @namespace undefined
// @version 0.0.1
// @description https://github.com/shanewignall/replace-showModalDialog/blob/master/replace-showModalDialog.user.js
// @include *
// @grant unsafeWindow
// @license Apache 2.0
// @downloadURL https://update.greasyfork.org/scripts/37701/ShowModalDialog.user.js
// @updateURL https://update.greasyfork.org/scripts/37701/ShowModalDialog.meta.js
// ==/UserScript==
(function(window) {
    window.spawn = window.spawn || function(gen) {
        function continuer(verb, arg) {
            var result;
            try {
                result = generator[verb](arg);
            } catch (err) {
                return Promise.reject(err);
            }
            if (result.done) {
                return result.value;
            } else {
                return Promise.resolve(result.value).then(onFulfilled, onRejected);
            }
        }
        var generator = gen();
        var onFulfilled = continuer.bind(continuer, 'next');
        var onRejected = continuer.bind(continuer, 'throw');
        return onFulfilled();
    };
    window.showModalDialog = window.open; 
})(unsafeWindow);