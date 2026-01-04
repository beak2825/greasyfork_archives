// ==UserScript==
// @name         Outlook Web App Unread Count Favicon
// @namespace    http://mattstow.com
// @version      0.1
// @description  Adds an unread count favicon
// @author       Matt Stow
// @match        https://outlook.office365.com/mail/*
// @match        https://outlook.live.com/mail/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377632/Outlook%20Web%20App%20Unread%20Count%20Favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/377632/Outlook%20Web%20App%20Unread%20Count%20Favicon.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (window.top !== window.self) {
        return;
    }

    var faviconEl = document.querySelector('[rel="shortcut icon"]');

    function setUnreadIconOnLoad (el) {
        var unreadEl = el.querySelector('.screenReaderOnly');
        var count = unreadEl ? unreadEl.parentElement.textContent.replace('unread', '') : 'O';

        faviconEl.href = 'https://dummyimage.com/32x32/0072c6/fff.png&text=' + count;
    }

    function setUreadIconOnChange (el) {
        var replacedUnread = el.textContent.replace('unread', '');
        var count = replacedUnread ? replacedUnread : 'O';

        faviconEl.href = 'https://dummyimage.com/32x32/0072c6/fff.png&text=' + count;
    }

    setTimeout(function () {
        var inboxEl = document.querySelector('[title="Inbox"]');
        var unreadConfig = { characterData: true, childList: true, subtree: true };
        var faviconConfig = { attributeFilter: ['href'] };

        var unreadObserver = new MutationObserver(function (mutations) {
            setUreadIconOnChange(mutations[0].target);
        });

        var faviconObserver = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (!mutation.target.href.includes('dummyimage.com')) {
                    setUnreadIconOnLoad(inboxEl);
                }
            });
        });

        setUnreadIconOnLoad(inboxEl);
        unreadObserver.observe(inboxEl, unreadConfig);
        faviconObserver.observe(faviconEl, faviconConfig);
    }, 2000);
})();
