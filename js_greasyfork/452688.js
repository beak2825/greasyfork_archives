// ==UserScript==
// @name         YouTube Ad Video Link
// @namespace    https://greasyfork.org/morca
// @version      0.7
// @description  Show video link of YouTube Ad.
// @author       morca
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452688/YouTube%20Ad%20Video%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/452688/YouTube%20Ad%20Video%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var busy, id;
    function getAdDocId() {
        function showContextmenu() {
            var video = Array.from(document.getElementsByClassName('html5-main-video'));
            for (var i = 0; i < video.length; i++) {
                var evt = video[i].ownerDocument.createEvent('MouseEvents');
                evt.initMouseEvent('contextmenu', true, true, video[i].ownerDocument.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 2, null);
                // multiple videos may exist and some of them don't handle the event
                if (!video[i].dispatchEvent(evt)) return true;
            }
            return false;
        }
        var contextmenu = Array.from(document.getElementsByClassName('ytp-contextmenu'));
        if (contextmenu.length == 0) {
            if (!showContextmenu()) return "failed";
            return;
        }
        if (busy) return;
        if (id) {
            var tmp = id;
            id = null;
            return tmp;
        }
        busy = true;
        if (contextmenu[0].getAttribute('style').indexOf('display: none') >= 0) showContextmenu();
        var menuitem = Array.from(document.getElementsByClassName('ytp-menuitem'));
        try {
            for (var i = menuitem.length - 1; i >= 0; i--) {
                if (menuitem[i].parentNode.parentNode.parentNode.getAttribute('class').indexOf('ytp-contextmenu') >= 0 ||
                    menuitem[i].parentNode.parentNode.parentNode.parentNode.getAttribute('class').indexOf('ytp-contextmenu') >= 0) {
                    menuitem[i].click(); // 'statistics detail' which is last of ytp-contextmenu siblings
                    break;
                }
            }
            id = Array.from(document.getElementsByClassName('ytp-sfn-cpn'))[0].innerText.split(' ')[1];
            Array.from(document.getElementsByClassName('html5-video-info-panel-close'))[0].click();
        } catch (err) {
            console.log(err);
            id = 'failed';
        }
        busy = false;
    }
    var observer = new MutationObserver(() => {
        var ad = Array.from(document.getElementsByClassName('ytp-ad-player-overlay-layout__ad-info-container'));
        if (ad.length == 0) {
            var sub = document.getElementsByClassName('ytp-ad-video-link-sub');
            if (sub.length > 0) sub[0].remove();
            return;
        }
        if (document.getElementsByClassName('ytp-ad-video-link').length > 0) return;
        var addocid = getAdDocId();
        if (!addocid) return;
        var title = null;
        var href = null;
        if (addocid != 'failed') {
            title = Array.from(document.getElementsByClassName('ytp-title-fullerscreen-link'))[0].innerText;
            href = 'https://www.youtube.com/watch?v=' + addocid;
            console.log(title);
            console.log(href);
        } else console.log("failed to get addocid");
        var visible = false;
        for (var i = 0; i < ad.length; i++) { // multiple ad-info may exist
            var span = document.createElement('span');
            span.className = 'ytp-ad-video-link ytp-ad-simple-ad-badge';
            if (href) {
                var a = document.createElement('a');
                a.setAttribute('href', href);
                a.setAttribute('title', title);
                a.setAttribute('target', '_blank');
                a.setAttribute('style', 'margin-left: 3px');
                a.append('[Ad]');
                span.append(a);
            }
            ad[i].appendChild(span);
            if (ad[i].checkVisibility()) visible = true;
        }
        if (!visible && href) {
            span = document.createElement('span');
            span.className = 'ytp-ad-video-link-sub ytp-ad-simple-ad-badge';
            span.setAttribute('style', 'display: flex; align-items: center');
            a = document.createElement('a');
            a.setAttribute('href', href);
            a.setAttribute('title', title);
            a.setAttribute('target', '_blank');
            a.setAttribute('style', 'margin-left: 3px');
            a.append('[Ad]');
            span.append(a);
            document.getElementsByClassName('ytp-left-controls')[0].appendChild(span);
        }
    });
    observer.observe(document.getElementsByTagName('body')[0], {childList: true, subtree: true});
})();