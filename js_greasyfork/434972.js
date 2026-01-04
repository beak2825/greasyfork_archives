// ==UserScript==
// @name         Quizlet Explaniation Exploit
// @version      0.3
// @description  A small script to bypass quizlet's explainations (originally slader) pay lock.
// @author       DanPlayz0
// @match        https://quizlet.com/explanations/textbook-solutions/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/831955
// @downloadURL https://update.greasyfork.org/scripts/434972/Quizlet%20Explaniation%20Exploit.user.js
// @updateURL https://update.greasyfork.org/scripts/434972/Quizlet%20Explaniation%20Exploit.meta.js
// ==/UserScript==

(function() {
    setTimeout(() => yes(), 2000)
    function yes() {
        document.querySelector(".we2bqom").remove();
        [].forEach.call(document.querySelectorAll(".hpidy4b"), (el) => el.classList.remove("hpidy4b"));
        [].forEach.call(document.querySelectorAll(".hs7m9cv"), (el) => el.classList.remove("hs7m9cv"));
        [].forEach.call(document.querySelectorAll(".hnqbbas"), (el) => el.classList.remove("hnqbbas"));
    }
})();