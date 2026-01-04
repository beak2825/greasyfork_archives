// ==UserScript==
// @name                 Font Substitute: Hiragino Sans GB
// @version              3.0
// @author               softforum
// @description          Substitute fonts with Hiragino Sans GB W3.
// @license              Unlicense
// @include              *://*
// @exclude              /^https?://www\.google\.com/maps([/\?].*)?$/
// @run-at               document-start
// @grant                GM_addStyle
// @namespace            uxin.ca
// @downloadURL https://update.greasyfork.org/scripts/471702/Font%20Substitute%3A%20Hiragino%20Sans%20GB.user.js
// @updateURL https://update.greasyfork.org/scripts/471702/Font%20Substitute%3A%20Hiragino%20Sans%20GB.meta.js
// ==/UserScript==

GM_addStyle(`
@font-face {
    font-family: "SimSun";
    src: local("Hiragino Sans GB W3");
}

@font-face {
    font-family: "NSimSun";
    src: local("Hiragino Sans GB W3");
}

@font-face {
    font-family: "宋体";
    src: local("Hiragino Sans GB W3");
}

@font-face {
    font-family: "Microsoft Yahei";
    src: local("Hiragino Sans GB W3");
}

@font-face {
    font-family: "Microsoft Yahei UI";
    src: local("Hiragino Sans GB W3");
}

@font-face {
    font-family: "微软雅黑";
    src: local("Hiragino Sans GB W3");
}

@font-face {
    font-family: "custom-ht";
    src: local("Hiragino Sans GB W3");
}

 
@font-face {
    font-family: "STHeiti";
    src: local("Hiragino Sans GB W3");
}

@font-face {
    font-family: "Songti SC";
    src: local("Hiragino Sans GB W3");
}

@font-face {
    font-family: "Roboto";
    src: local("Hiragino Sans GB W3");
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
    src: local("Hiragino Sans GB W3");
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
    src: local("Hiragino Sans GB W3");
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
    src: local("Hiragino Sans GB W3");
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
    src: local("Hiragino Sans GB W3");
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