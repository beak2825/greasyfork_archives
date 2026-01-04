// ==UserScript==
// @name            Open in the current tab for Yandex
// @name:ru         Открывать в текущей вклакде для Яндекс
// @namespace       FIX
// @version         0.2
// @description     Force to open Yandex search result linx in the same tab. Default behaviour is to open in the new tab.
// @description:ru  Заставляет открывать ссылки в поиске Янедкса в текущей вкладке при нажатии на них. По умолчанию Яндекс открывает их в новой вкладке.
// @author          toverna
// @include         *://yandex.*/*
// @include         *://*.yandex.*/*
// @grant           unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/376657/Open%20in%20the%20current%20tab%20for%20Yandex.user.js
// @updateURL https://update.greasyfork.org/scripts/376657/Open%20in%20the%20current%20tab%20for%20Yandex.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var win = unsafeWindow || window;
    if (win.top !== win.self) return;

    console.time('Remove Yandex load');

    function removeAttrs (scope) {
        var links = scope.querySelectorAll('a[target="_blank"]');
      	var i;
        for (i = links.length - 1; i >= 0; --i) {
            links[i].removeAttribute('target');
        }
    }

    removeAttrs (document.body);

    var obs = new MutationObserver(function(ms){
        ms.forEach(function(m){
            m.addedNodes.forEach(function(n){
                if (n.nodeType !== Node.ELEMENT_NODE) {
                    return;
                }
                removeAttrs(n);
            });
        });
    });
    obs.observe(document.body, {childList: true, subtree: true});

    console.timeEnd('Remove Yandex load');
})();