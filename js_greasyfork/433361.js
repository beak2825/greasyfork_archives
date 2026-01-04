// ==UserScript==
// @name         Pikabu download video helper
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Helpers for display direct url for video
// @author       Apkawa
// @license      MIT
// @icon         https://www.google.com/s2/favicons?domain=pikabu.ru
// @match        https://pikabu.ru/*
// @homepage     https://github.com/Apkawa/userscripts
// @homepageUrl  https://github.com/Apkawa/userscripts
// @supportUrl   https://github.com/Apkawa/userscripts/issues
// @downloadUrl  https://github.com/Apkawa/userscripts/raw/master/dist/pikabu.ru/video_url.user.js
// @updateUrl    https://github.com/Apkawa/userscripts/raw/master/dist/pikabu.ru/video_url.user.js
// @downloadURL https://update.greasyfork.org/scripts/433361/Pikabu%20download%20video%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/433361/Pikabu%20download%20video%20helper.meta.js
// ==/UserScript==
(function() {
    "use strict";
    function waitElement(match, callback, root = document.body) {
        const observer = new MutationObserver((mutations => {
            let matchFlag = false;
            mutations.forEach((mutation => {
                if (!mutation.addedNodes) return;
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    const node = mutation.addedNodes[i];
                    matchFlag = match(node);
                }
            }));
            if (matchFlag) {
                _stop();
                callback();
                _start();
            }
        }));
        let isStarted = false;
        function _start() {
            if (isStarted) return;
            observer.observe(root || document.body, {
                childList: true,
                subtree: true,
                attributes: false,
                characterData: false
            });
            isStarted = true;
        }
        function _stop() {
            observer.disconnect();
            isStarted = false;
        }
        _start();
        return () => {
            _stop();
        };
    }
    function isFunction(x) {
        return "function" === typeof x;
    }
    function matchLocation(...patterns) {
        const s = document.location.href;
        for (const p of patterns) {
            if (isFunction(p) && p(s)) return true;
            if (RegExp(p).test(s)) return true;
        }
        return false;
    }
    Object.keys;
    Object.entries;
    Object.values;
    function humanFileSize(bytes, si = false, dp = 1) {
        const thresh = si ? 1e3 : 1024;
        if (Math.abs(bytes) < thresh) return bytes + " B";
        const units = si ? [ "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB" ] : [ "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB" ];
        let u = -1;
        const r = 10 ** dp;
        do {
            bytes /= thresh;
            ++u;
        } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
        return bytes.toFixed(dp) + " " + units[u];
    }
    (function() {
        "use strict";
        if (!matchLocation("^https://pikabu.ru/.*")) return;
        function addDownloadButtonsForVideo(el) {
            var _a, _b, _c, _d;
            if (el.getAttribute("linked")) return;
            const source = null === (_a = el.dataset.source) || void 0 === _a ? void 0 : _a.replace(/\.\w{3,4}$/, "");
            el.setAttribute("linked", "1");
            if (!(null === source || void 0 === source ? void 0 : source.match("pikabu.ru"))) return;
            const name = source.split("/").pop();
            const container = document.createElement("div");
            container.setAttribute("style", `display: flex; width: 100%; height: 30px; \n      align-items: center; justify-content: flex-start`);
            let html = "";
            const extensions = [ "mp4", "av1", "webm" ];
            if (null === (_b = el.dataset.source) || void 0 === _b ? void 0 : _b.endsWith(".gif")) extensions.unshift("gif");
            for (const ext of extensions) {
                let s = (null === (_c = el.dataset) || void 0 === _c ? void 0 : _c[ext]) || `${source}.${ext}`;
                if ("av1" == ext && !s.endsWith(".mp4")) s += ".mp4";
                const size = Number.parseInt((null === (_d = el.dataset) || void 0 === _d ? void 0 : _d[`${ext}Size`]) || "");
                let sizeDisplay = "";
                if (!Number.isFinite(size) || size <= 0) continue;
                if (Number.isFinite(size) && size > 0) sizeDisplay = humanFileSize(size, true);
                html += `<a \n        href="${s}" \n        style="padding: 5px; \n        margin: 5px;\n        border: gray 1px solid; border-radius: 3px; \n        height: 25px; line-height: 15px; vertical-align: middle"\n        download="${name || "download"}.${ext}"\n        target="_blank"\n        title="${sizeDisplay}"\n        >${ext} ${sizeDisplay}</a>`;
            }
            container.innerHTML = html;
            el.parentNode && el.parentNode.insertBefore(container, el.nextSibling);
        }
        waitElement((el => {
            const _el = el;
            return Boolean(_el.querySelectorAll && _el.querySelectorAll(".player"));
        }), (() => {
            document.querySelectorAll && document.querySelectorAll(".player").forEach((el => addDownloadButtonsForVideo(el)));
        }));
    })();
})();