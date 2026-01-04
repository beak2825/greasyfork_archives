// ==UserScript==
// @name         Hatena Star with ICON
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Reder Hatena Star with user ICON
// @author       ozero
// @match        http://b.hatena.ne.jp/entry/*
// @match        https://b.hatena.ne.jp/entry/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/373966/Hatena%20Star%20with%20ICON.user.js
// @updateURL https://update.greasyfork.org/scripts/373966/Hatena%20Star%20with%20ICON.meta.js
// ==/UserScript==

// "Hatena Star with ICON - Hatena::Let" http://let.hatelabo.jp/esportgmailcom/let/hLHVrrmVmIdE

(function() {
  'use strict';
    var D_ = document;
    var RE_USER = /^(\S+)( \(\w+\))?$/;
    var RE_FACEBOOK_ID = /@facebook$/;
    var RE_TWITTER_ID = /@twitter$/;

    var forEach = Array.prototype.forEach;
    var setStyle = function(e, s) {
        for (var i in s) {
            e.style[i] = s[i];
        }
    };
    var iconizeStar = function (star) {
        var lnk = star.parentNode;
        if (lnk.iconized) return;

        var user = star.alt;
        var match = RE_USER.exec(user);     // e.g. alt="a-kuma3 (green)"
        if (match) {
            user = match[1];
        }

        var icon = D_.createElement('img');
        if (RE_FACEBOOK_ID.exec(user)) {        // Facebook user
            icon.src = "http://n.hatena.com/" + user + "/profile/image.gif";
        } else if (RE_TWITTER_ID.exec(user)) {       // Twitter user
            icon.src = "http://n.hatena.com/" + user + "/profile/image.gif";
        } else {        // hatena user
            icon.src = 'http://cdn1.www.st-hatena.com/users/' + user.substr(0, 2) + '/' + user + '/profile.gif';
        }

        var forwardMouseEvent = function(ev) {
            if (/^mouse/.test(ev.type)) {
                /*
                    Deprecated : MouseEvent.initMouseEvent
                    https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/initMouseEvent
                */
//                var newEvent = document.createEvent("MouseEvents");
//                newEvent.initMouseEvent(ev.type, ev.bubbles, ev.cancelable, ev.view, ev.detail, ev.screenX, ev.screenY, ev.clientX, ev.clientY, ev.ctrlKey, ev.altKey, ev.shiftKey, ev.metaKey, 0, null);
                var newEvent = new MouseEvent(ev.type, {
                        bubbles: ev.bubbles,
                        cancelable: ev.cancelable,
                        view: ev.view,
                        detail: ev.detail,
                        screenX: ev.screenX,
                        screenY: ev.screenY,
                        clientX: ev.clientX,
                        clientY: ev.clientY
                    });
                ev.target.nextSibling.dispatchEvent(newEvent);

            }
        };
        icon.addEventListener("mouseover", forwardMouseEvent, false);
        icon.addEventListener("mouseout", forwardMouseEvent, false);

        // Hatena Blog style
        setStyle(lnk, {
                "width": "20px",
                "height": "20px",
                "position": "relative",
                "display": "inline-block",
                "margin": "2px",
                "vertical-align": "middle",
            });
        setStyle(icon, {
                "height": "20px",
                "width": "20px",
                "position": "absolute",
            });
        setStyle(star, {
                "position": "absolute",
                "bottom": "0px",
                "left": "0px",
                "margin": "0px",
                "background": "rgba(255, 255, 255, 0.7)",
                "borderptop-top-right-radius": "2px",
                "borderptop-bottom-left-radius": "2px",
            });

        lnk.insertBefore(icon, star);
        lnk.iconized = true;

    };
    var iconizeAll = function(ctx) {
        forEach.call(ctx.querySelectorAll('.hatena-star-star-container img.hatena-star-star'), function (star) {
            iconizeStar(star);
        });
    };

    iconizeAll(D_.body);

    // https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
    var MutationObserver = window.MutationObserver || window.WebkitMutationObserver;
    new MutationObserver(function (records) {
        records.forEach(function (record) {
            if (record.addedNodes) {
                forEach.call(record.addedNodes, function(e) {
                    var child = e.firstChild;
                    if (child && child.tagName == "IMG" && child.className == "hatena-star-star") {
                        iconizeStar(child);
                    }
                });
            }
        });
    }).observe(D_.body, { childList: true, subtree: true });


    // Hatena Star doesn't work after autopagerizing in q.hatena.ne.jp ...
    //
    // cf. https://gist.github.com/noromanba/2725191
    //     http://s.hatena.ne.jp/js/HatenaStar.js

    if (location.hostname == "q.hatena.ne.jp") {
        new MutationObserver(function (records) {
            records.forEach(function (record) {
                if (record.addedNodes) {
                    forEach.call(record.addedNodes, function(e) {
                        if (e.className == 'list-balloon answer') {
                            Hatena.Star.EntryLoader.loadNewEntries(e);
                        }
                    });
                }
            });
        }).observe(D_.body, { childList: true, subtree: true });
    }

})();
