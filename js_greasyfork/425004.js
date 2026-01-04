// ==UserScript==
// @namespace    https://greasyfork.org/zh-CN/users/167084-lin-skywood
// @name         Open links in new tab@skywoodlin修改版
// @name:zh      Open links in new tab@skywoodlin修改版
// @description  always Open links in new tab
// @include      *
// @author       skywoodlin
// @contributor  skywoodlin
// @version      1.1
// @license      LGPLv3
// @grant        GM_openInTab
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/425004/Open%20links%20in%20new%20tab%40skywoodlin%E4%BF%AE%E6%94%B9%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/425004/Open%20links%20in%20new%20tab%40skywoodlin%E4%BF%AE%E6%94%B9%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    let suppressing, clickedElement;

    window.addEventListener('mousedown', function (e) {
        clickedElement = e.target;
    }, true);

    window.addEventListener('mouseup', function (e) {
        if (e.button > 1 || e.altKey || e.target != clickedElement)
            return;

        let hostname = location.hostname.toLowerCase();
        //console.log(hostname);
        //添加不用打开新标签的ip
        //let doNotOpenNewTabDomain = ["localhost","127.0.0.1","onlyou.com","192.168", "172.16"];
        let doNotOpenNewTabDomain = ["localhost", "127.0.0.1", "172.16"];
        for (let i = 0; i < doNotOpenNewTabDomain.length; i++) {
            if (location.hostname.indexOf(doNotOpenNewTabDomain[i]) > -1) {
                //console.log(doNotOpenNewTabDomain[i]);
                return;
            }
        }

        let link = e.target.closest('a');
        if (!link ||
            (link.getAttribute('href') || '').match(/^(javascript|#|$)/) ||
            link.href.replace(/#.*/, '') == location.href.replace(/#.*/, '')
        ) {
            return;
        }

        //GM_openInTab(link.href, {
        //active: !(!e.button && !e.ctrlKey),
        //});

        GM_openInTab(link.href, "loadInBackground");

        suppressing = true;
        setTimeout(function () {
            window.dispatchEvent(new MouseEvent('mouseup', {bubbles: true}));
        });
        prevent(e);
    }, true);

    window.addEventListener('click', prevent, true);
    window.addEventListener('auxclick', prevent, true);

    function prevent(e) {
        if (!suppressing)
            return;
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        setTimeout(function () {
            suppressing = false;
        }, 100);
    }

})();