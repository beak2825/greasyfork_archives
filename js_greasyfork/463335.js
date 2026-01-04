// ==UserScript==
// @name         回到顶部
// @description  Adds a button to the page which allows the user to scroll to the top of the page with a single click
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @version 0.0.1.20230405134412
// @namespace https://greasyfork.org/users/1053751
// @downloadURL https://update.greasyfork.org/scripts/463335/%E5%9B%9E%E5%88%B0%E9%A1%B6%E9%83%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/463335/%E5%9B%9E%E5%88%B0%E9%A1%B6%E9%83%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var scrollButton = document.createElement("button");
    scrollButton.textContent = "Top";
    scrollButton.setAttribute("style", "position:fixed;bottom:10px;left:10px;");
    document.body.appendChild(scrollButton);
    scrollButton.addEventListener("click", function(){
        window.scroll({
            top: 0,
            behavior: 'smooth'
          });
    });
})();