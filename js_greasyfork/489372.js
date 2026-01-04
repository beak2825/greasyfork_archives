// ==UserScript==
// @name YoshikeiRakurakuIikanjini
// @namespace com.loupe.yoshikeiiikanji
// @version 20240309.08.05
// @description なんか良い感じに
// @author mikan-megane
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match https://yoshikei-rakurakuweb.com/order/menu/*
// @downloadURL https://update.greasyfork.org/scripts/489372/YoshikeiRakurakuIikanjini.user.js
// @updateURL https://update.greasyfork.org/scripts/489372/YoshikeiRakurakuIikanjini.meta.js
// ==/UserScript==

(function() {
let css = `
#course_2,
#course_3,
#course_4,
#course_5,
#course_6,
#course_18,
#course_19,
#course_16,
#course_7 {
    display: none !important;
}

.container {
    max-width: inherit !important;
    padding: 0 30px !important;
}

.desc-wrap .suryo_normal:nth-child(n+2) {
    display: none !important;
}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
