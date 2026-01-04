// ==UserScript==
// @name         Seeking Alpha - Paywall remover
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Enjoy Seeking Alpha without Paywall
// @author       AnonymousFriend
// @match        https://seekingalpha.com/*
// @icon         https://www.google.com/s2/favicons?domain=seekingalpha.com
// @downloadURL https://update.greasyfork.org/scripts/425153/Seeking%20Alpha%20-%20Paywall%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/425153/Seeking%20Alpha%20-%20Paywall%20remover.meta.js
// ==/UserScript==
var root = document.querySelector(".root");
function callback(mutationList, observer) {
    var _a;
    mutationList.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
            var attr = node.attributes.getNamedItem('id');
            if (attr && attr.value === 'paywall') {
                node.remove();
                window.observer.disconnect();
            }
        });
    });
    root.innerHTML = window.backup;
    document.body.style.overflow = 'scroll';
    document.body.classList.remove('tp-modal-open');
    var modal = document.body.querySelector('.tp-modal');
    if (modal) {
        modal.remove();
        window.observer.disconnect();
    }
    (_a = document.body.querySelector('.tp-backdrop')) === null || _a === void 0 ? void 0 : _a.remove();
}
window.setTimeout(function () {
    window.backup = root.innerHTML;
    window.observer = new MutationObserver(callback);
    window.observer.observe(document.body, { childList: true, subtree: false });
}, 2000);
