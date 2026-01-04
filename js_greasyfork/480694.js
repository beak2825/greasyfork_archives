// ==UserScript==
// @name                 Font Substitute: Microsoft Yahei
// @version              3.0
// @author               softforum
// @description          Substitute fonts with Microsoft Yahei.
// @license              Unlicense
// @include              *://*
// @exclude              /^https?://www\.google\.com/maps([/\?].*)?$/
// @run-at               document-start
// @grant                GM_addStyle
// @namespace            uxin.ca
// @downloadURL https://update.greasyfork.org/scripts/480694/Font%20Substitute%3A%20Microsoft%20Yahei.user.js
// @updateURL https://update.greasyfork.org/scripts/480694/Font%20Substitute%3A%20Microsoft%20Yahei.meta.js
// ==/UserScript==

GM_addStyle(`
@font-face {
    font-family: "SimSun";
    src: local("Microsoft Yahei");
}

@font-face {
    font-family: "NSimSun";
    src: local("Microsoft Yahei");
}

@font-face {
    font-family: "宋体";
    src: local("Microsoft Yahei");
}

@font-face {
    font-family: "custom-ht";
    src: local("Microsoft Yahei");
}

@font-face {
    font-family: "STHeiti";
    src: local("Microsoft Yahei");
}

@font-face {
    font-family: "Songti SC";
    src: local("Microsoft Yahei");
}

@font-face {
    font-family: "Roboto";
    src: local("Microsoft Yahei");
    unicode-range: U+4E00-9FFF;
}

@font-face {
    font-family: "Roboto";
    src: local("Roboto");
    unicode-range: U+0-4DFF;
}

@font-face {
    font-family: "Roboto";
    src: local("Roboto");
    unicode-range: U+A000-10FFFF;
}

@font-face {
    font-family: "Segoe UI";
    src: local("Microsoft Yahei");
    unicode-range: U+4E00-9FFF;
}

@font-face {
    font-family: "Segoe UI";
    src: local("Segoe UI");
    unicode-range: U+0-4DFF;
}

@font-face {
    font-family: "Segoe UI";
    src: local("Segoe UI");
    unicode-range: U+A000-10FFFF;
}

@font-face {
    font-family: "Arial";
    src: local("Microsoft Yahei");
    unicode-range: U+4E00-9FFF;
}

@font-face {
    font-family: "Arial";
    src: local("Arial");
    unicode-range: U+0-4DFF;
}

@font-face {
    font-family: "Arial";
    src: local("Arial");
    unicode-range: U+A000-10FFFF;
}

@font-face {
    font-family: "Times New Roman";
    src: local("Microsoft Yahei");
    unicode-range: U+4E00-9FFF;
}

@font-face {
    font-family: "Times New Roman";
    src: local("Times New Roman");
    unicode-range: U+0-4DFF;
}

@font-face {
    font-family: "Times New Roman";
    src: local("Times New Roman");
    unicode-range: U+A000-10FFFF;
}

@font-face {
    font-family: "Times";
    src: local("Microsoft Yahei");
    unicode-range: U+4E00-9FFF;
}

@font-face {
    font-family: "Times";
    src: local("Times");
    unicode-range: U+0-4DFF;
}

@font-face {
    font-family: "Times";
    src: local("Times");
    unicode-range: U+A000-10FFFF;
}
`);