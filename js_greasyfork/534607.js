// ==UserScript==
// @name         FarmRPG Helper Utils
// @namespace    https://greasyfork.org/users/1114461
// @version      1.0.0
// @description  Utility functions and constants for FarmRPG Helper scripts
// @author       Fewfre
// @license      GNU GPLv3
// @grant        unsafeWindow
// ==/UserScript==

(function() {
    'use strict';

    // START OF SECTION: Initial Setup and Polyfills
    // Note: localStorage is inherently global, no need to export.
    // Consider if this needs to run in the Utils script or only the main one.
    // If multiple scripts might use it, keeping it here is fine.
    localStorage.setItem('fewfh-enable-all', "1");

    (function () { const e = document.createElement("link").relList; if (e && e.supports && e.supports("modulepreload")) return; for (const i of document.querySelectorAll('link[rel="modulepreload"]')) s(i); new MutationObserver(i => { for (const l of i) if (l.type === "childList") for (const r of l.addedNodes) r.tagName === "LINK" && r.rel === "modulepreload" && s(r) }).observe(document, { childList: !0, subtree: !0 }); function t(i) { const l = {}; return i.integrity && (l.integrity = i.integrity), i.referrerPolicy && (l.referrerPolicy = i.referrerPolicy), i.crossOrigin === "use-credentials" ? l.credentials = "include" : i.crossOrigin === "anonymous" ? l.credentials = "omit" : l.credentials = "same-origin", l } function s(i) { if (i.ep) return; i.ep = !0; const l = t(i); fetch(i.href, l) } })();
    // END OF SECTION: Initial Setup and Polyfills

    // START OF SECTION: App Wrapper (Q)
    var Q_internal; (n => { const e = (typeof unsafeWindow < "u" ? unsafeWindow : window).myApp; function t(r, o) { e.onPageInit(r, o) } n.onPageInit = t; function s(r, o) { e.onPageBeforeRemove(r, o) } n.onPageBeforeRemove = s; function i(r, o) { let a = null; n.onPageInit("*", c => { a === r && c.name !== r && o(c), a = c.name }) } n.onPageExit = i; function l() { e.mainView.router.refreshPage() } n.refreshPage = l })(Q_internal || (Q_internal = {}));
    // Export Q to the window object for other scripts to use
    unsafeWindow.Q = Q_internal;
    // END OF SECTION: App Wrapper (Q)


    // START OF SECTION: Constants (de)
    var de_internal; (n => {
        var audioCtx;

        // Keep _e local if only used here
        function _e(n, e) { return Math.random() * (e - n) + n }
        unsafeWindow._e = _e;

        function playBeepInternal(duration = 150, frequency = 1000, volume = 0.3, type = 'sine') {
            try {
                if (!audioCtx || audioCtx.state === 'closed') {
                    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                }
                if (audioCtx.state === 'suspended') {
                    audioCtx.resume();
                }

                const oscillator = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);

                oscillator.type = type;
                oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

                const now = audioCtx.currentTime;
                const attackTime = 0.01; // 10ms fade in
                const decayTime = 0.01; // 10ms fade out
                const beepEndTime = now + duration / 1000;

                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.linearRampToValueAtTime(volume, now + attackTime);
                gainNode.gain.setValueAtTime(volume, beepEndTime - decayTime);
                gainNode.gain.linearRampToValueAtTime(0.0001, beepEndTime);

                oscillator.start(now);
                oscillator.stop(beepEndTime);

                oscillator.onended = () => {
                    oscillator.disconnect();
                    gainNode.disconnect();
                };

            } catch (e) {
                console.error("FarmRPG Helper Utils: Error playing beep sound.", e);
                // Fail silently if Web Audio API not supported or fails
            }
        }

        n.SOUND_FINISHED = {
            play: function() {
                playBeepInternal(); // Uses default beep parameters
            }
            // Add other methods like pause(), etc., if needed
        };

        // Assuming the chevron image is still needed, keep it.
        n.IMAGE_CEVRON_RIGHT = "data:image/svg+xml;charset=utf-8;base64,PHN2ZyB2aWV3Qm94PScwIDAgNjAgMTIwJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxwYXRoIGQ9J202MCA2MS41LTM4LjI1IDM4LjI1LTkuNzUtOS43NSAyOS4yNS0yOC41LTI5LjI1LTI4LjUgOS43NS05Ljc1eicgZmlsbD0nI2M3YzdjYycvPjwvc3ZnPg==";

    })(de_internal || (de_internal = {}));
    // Export de to the window object for other scripts to use
    unsafeWindow.de = de_internal;
    // END OF SECTION: Constants (de)

    // START OF SECTION: Utility Functions
    // Keep _e local as it's only used by V and ft within this script
    function _e(n, e) { return Math.random() * (e - n) + n }

    async function V_internal(n, e) { return new Promise(t => { setTimeout(t, e ? _e(n * 1e3, e * 1e3) : n * 1e3) }) }
    unsafeWindow.V = V_internal; // Export V

    function ft_internal(n, e) { let t, s; return { promise: new Promise(l => { s = l, t = setTimeout(l, e ? _e(n * 1e3, e * 1e3) : n * 1e3) }), timeoutId: t, cancel() { clearTimeout(t), s() } } }
    unsafeWindow.ft = ft_internal; // Export ft

    function ve_internal(n, e = {}) { return new Promise((t, s) => { const i = r => $(r).is(":visible") && parseInt($(r).css("opacity")) > .1; if ($(n).length && (!e.visible || i(n))) return t($(n + ":visible").first()[0]); const l = new MutationObserver(r => { $(n).length && (!e.visible || i(n)) && (t($(n + ":visible").first()[0]), l.disconnect()) }); e.timeout && V_internal(e.timeout).then(() => { l.disconnect(), s(new Error("observer timed out")) }), l.observe(e.target || document.body, { attributes: !0, childList: !0, subtree: !0, ...e.config }) }) }
    unsafeWindow.ve = ve_internal; // Export ve

    async function we_internal(n, e) { return fetch(`worker.php?go=buyitem&id=${n}&qty=${e}`, { method: "POST" }).then(t => t.text()).then(t => Number.isNaN(Number.parseInt(t)) ? t : we_internal(n, t)) }
    unsafeWindow.we = we_internal; // Export we

    const le_internal = { farming: 0, fishing: 0, crafting: 0, exploring: 0, cooking: 0 };
    unsafeWindow.le = le_internal; // Export le

    function st_internal() {
        // Assumes jQuery ($) is available globally
        if (typeof $ === 'undefined') {
             console.error("FarmRPG Helper Utils: jQuery ($) is not defined. Cannot update skill levels.");
             return le_internal;
        }
        if ($('[href="progress.php?type=Farming"]').length) {
            le_internal.farming = parseInt($('[href="progress.php?type=Farming"]').parent().text().replaceAll(/[^\d]/g, "") || "0");
            le_internal.fishing = parseInt($('[href="progress.php?type=Fishing"]').parent().text().replaceAll(/[^\d]/g, "") || "0");
            le_internal.crafting = parseInt($('[href="progress.php?type=Crafting"]').parent().text().replaceAll(/[^\d]/g, "") || "0");
            le_internal.exploring = parseInt($('[href="progress.php?type=Exploring"]').parent().text().replaceAll(/[^\d]/g, "") || "0");
            le_internal.cooking = parseInt($('[href="progress.php?type=Cooking"]').parent().text().replaceAll(/[^\d]/g, "") || "0");
        }
        return le_internal;
    }
    unsafeWindow.st = st_internal; // Export st
    // END OF SECTION: Utility Functions

})();