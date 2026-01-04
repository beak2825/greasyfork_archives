// ==UserScript==
// @name         Code Pre Wrapper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  コードブロックの折返しを適用するだけ。ブックマークレットにしてもいいかも
// @author       Hansy
// @match        https://galaxy.val.cs.tut.ac.jp/SoftwareExercise3A/*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413851/Code%20Pre%20Wrapper.user.js
// @updateURL https://update.greasyfork.org/scripts/413851/Code%20Pre%20Wrapper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // コードブロックの折返しを適用
    document.querySelectorAll("code").forEach(tag=>{tag.style.whiteSpace = "pre-wrap";});
})();