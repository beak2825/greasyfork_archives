// ==UserScript==
// @name         Github IDE Preview
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Open a github repo in an online code editor (similar to VSCode)!
// @author       Bartholomé Gili (https://barthofu.me)
// @match        https://github.com/*/*
// @icon         https://img.stackshare.io/service/25068/default_0f7f9aa5d96a272083e318ee229eb9899f8f1780.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424926/Github%20IDE%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/424926/Github%20IDE%20Preview.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let queryResult = document.querySelector(".file-navigation");

    if (queryResult) {

        const redirectUrl = window.location.href.split("://github.com").join("://github1s.com"),
              splittedContent = document.querySelector(".file-navigation").innerHTML.split("\"flex-auto\"></div>");

        document.querySelector('.file-navigation').innerHTML = splittedContent[0] + `"flex-auto"></div>

            <a class="ide-preview btn ml-2 d-none d-md-block" href="${redirectUrl}">IDE Preview</a>

        ` + splittedContent[1];

        let myElement = document.querySelector('.ide-preview');

        myElement.style.backgroundColor = "var(--color-scale-blue-5)";
        myElement.style.color = "var(--color-btn-primary-text)";

    }

})();