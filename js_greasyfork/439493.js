// ==UserScript==
// @name         TVer just size
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  TVerのプレイヤーのサイズを画面いっぱいにするスクリプト
// @author       kawaida
// @match        https://tver.jp/*
// @icon         https://www.google.com/s2/favicons?domain=tver.jp
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439493/TVer%20just%20size.user.js
// @updateURL https://update.greasyfork.org/scripts/439493/TVer%20just%20size.meta.js
// ==/UserScript==

(function() {
    let e = !1;
    const n = document.createElement("button");
	n.classList.add("btnToTheatre");
    n.textContent = "ウィンドウ幅に合わせる（非公式）", n.style.color = "#999999", n.style.padding = "4px", n.onclick = () => {
            e = !e, console.log("expanded:", e), e ? (document.querySelector("body.companionad")
                .style.minWidth = "95vw", document.querySelector(".video-section .inner")
                .style.maxWidth = "none", document.querySelector(".playvideo > .inner")
                .style.padding = 0, document.querySelector(".companionad-inner")
                .style.maxWidth = "none", document.querySelector(".companionad-right")
                .style.display = "none") : (document.querySelector(".video-section .inner")
                .style.maxWidth = "1110px", document.querySelector(".playvideo > .inner")
                .style.padding = "20px 20px 0", document.querySelector(".companionad-inner")
                .style.maxWidth = "1110px", document.querySelector(".companionad-right")
                .style.display = "block"), n.textContent = e ? "もとに戻す（非公式）" : "ウィンドウ幅に合わせる（非公式）"
	}, document.querySelector(".playvideo > .inner").appendChild(n)
	n.click();
})();