// ==UserScript==
// @name            Remove Yandex Redirect
// @name:ru         Удаление редиректов на Яндексе
// @namespace       FIX
// @version         0.4
// @description     Remove Yandex redirect in search, news and mail
// @description:ru  Удаление редиректов на Яндексе в поисковой выдаче, новостях и почте
// @author          raletag
// @include         *://yandex.*/*
// @include         *://*.yandex.*/*
// @grant           unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/22737/Remove%20Yandex%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/22737/Remove%20Yandex%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var win = unsafeWindow || window;
    if (win.top !== win.self) return;

    console.time('Remove Yandex Redirect load');

    function remove (e) {
        var links = e.querySelectorAll('a[onmousedown*="/clck/jsredir"]'), i;
        for (i = links.length - 1; i >= 0; --i) {
            links[i].removeAttribute('onmousedown');
        }
        links = e.querySelectorAll('a[data-counter]');
        for (i = links.length - 1; i >= 0; --i) {
            links[i].removeAttribute('data-counter');
            links[i].removeAttribute('data-bem');
        }
        links = e.querySelectorAll('a[data-vdir-href]');
        for (i = links.length - 1; i >= 0; --i) {
            links[i].removeAttribute('data-vdir-href');
            links[i].removeAttribute('data-orig-href');
        }
    }

    remove (document.body);

    var o = new MutationObserver(function(ms){
        ms.forEach(function(m){
            m.addedNodes.forEach(function(n){
                if (n.nodeType !== Node.ELEMENT_NODE) {
                    return;
                }
                remove(n);
            });
        });
    });
    o.observe(document.body, {childList: true, subtree: true});

    console.timeEnd('Remove Yandex Redirect load');
})();