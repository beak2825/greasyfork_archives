// ==UserScript==
// @name           Hide E-hentai Comments
// @name:cn        隐藏E-hentai评论
// @version        0.1
// @description    Hide comments on E-hentai &ExHentai.
// @description:cn 对E-hentai &ExHentai评论区进行隐藏/屏蔽。
// @match          https://e-hentai.org/*
// @match          https://exhentai.org/*
// @license MIT
// @namespace https://greasyfork.org/users/1176046
// @downloadURL https://update.greasyfork.org/scripts/475703/Hide%20E-hentai%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/475703/Hide%20E-hentai%20Comments.meta.js
// ==/UserScript==

// 屏蔽评论区
const element = document.getElementById("cdiv");
element.style.display= "none";