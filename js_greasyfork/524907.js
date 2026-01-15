// ==UserScript==
// @name         Mkana+
// @namespace    https://lit.link/toracatman
// @version      2026-01-15
// @description  パソコンや スマホで 表示できない フォントを 表示するために，フォントを 変更します。
// @author       トラネコマン
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @sandbox      DOM
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524907/Mkana%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/524907/Mkana%2B.meta.js
// ==/UserScript==

let css = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&family=Noto+Sans+KR&family=Noto+Serif+Hentaigana&display=swap');

@font-face {
	font-family: "Mkana+";
	src: local("Mkana+"),
	     url("https://toracatman.github.io/fonts/mkanaplus.woff2") format("woff2"),
	     url("https://toracatman.github.io/fonts/mkanaplus.woff") format("woff");
	font-display: swap;
	unicode-range: U+0-F8FF, U+FA0E-FA0F, U+FA11, U+FA13-FA14, U+FA1F, U+FA21, U+FA23-FA24, U+FA27-FA29, U+FB00-2F7FF, U+2FA20-10FFFF;
}
@font-face {
	font-family: "MgenKana+";
	src: local("MgenKana+"),
	     url("https://toracatman.github.io/fonts/mgenkanaplus.woff2") format("woff2"),
	     url("https://toracatman.github.io/fonts/mgenkanaplus.woff") format("woff");
	font-display: swap;
	unicode-range: U+0-F8FF, U+FA0E-FA0F, U+FA11, U+FA13-FA14, U+FA1F, U+FA21, U+FA23-FA24, U+FA27-FA29, U+FB00-2F7FF, U+2FA20-10FFFF;
}
@font-face {
	font-family: "Nishiki-teki-Braille";
	src: local("Nishiki-teki"),
	     url("https://toracatman.github.io/fonts/nishiki-teki.woff2") format("woff2"),
	     url("https://toracatman.github.io/fonts/nishiki-teki.woff") format("woff");
	font-display: swap;
	unicode-range: U+2800-28FF;
}
@font-face {
	font-family: "Jigmo";
	src: local("Jigmo"),
	     url("https://toracatman.github.io/fonts/Jigmo.woff2") format("woff2"),
	     url("https://toracatman.github.io/fonts/Jigmo.woff") format("woff");
	font-display: swap;
	unicode-range: U+2E80-302D, U+3030-312F, U+3190-9FFF, U+F900-FAFF, U+FE11-FE12, U+FE51, U+FF61-FFDF, U+1AFF0-1B16F, U+1D372-1D376, U+1F000-1F02F, U+1F200-1F2FF, U+1FA60-1FA6D, U+100000-10FFFF;
}
@font-face {
	font-family: "Jigmo2";
	src: local("Jigmo2"),
	     url("https://toracatman.github.io/fonts/Jigmo2.woff2") format("woff2"),
	     url("https://toracatman.github.io/fonts/Jigmo2.woff") format("woff");
	font-display: swap;
}
@font-face {
	font-family: "Jigmo3";
	src: local("Jigmo3"),
	     url("https://toracatman.github.io/fonts/Jigmo3.woff2") format("woff2"),
	     url("https://toracatman.github.io/fonts/Jigmo3.woff") format("woff");
	font-display: swap;
}

body {
	font-family: "Mkana+", "MgenKana+", "Nishiki-teki-Braille", "Noto Color Emoji", "Noto Sans KR", "Noto Serif Hentaigana", "Jigmo", "Jigmo2", "Jigmo3", sans-serif;
}
`;
let css2 = `
* {
	font-family: "Mkana+", "MgenKana+", "Nishiki-teki-Braille", "Noto Sans KR", "Noto Serif Hentaigana", "Jigmo", "Jigmo2", "Jigmo3", sans-serif !important;
}
`;

(() => {
    if (location.origin == "https://x.com") css += css2;
    let style = document.createElement("style");
    style.textContent = css;
    document.body.appendChild(style);
})();