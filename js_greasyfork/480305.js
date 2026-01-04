// ==UserScript==
// @name         V2EX check user
// @version      0.1
// @description  检查封禁用户
// @author       You
// @match        https://*.v2ex.com/t/*
// @match        https://v2ex.com/t/*
// @grant        none
// @namespace https://greasyfork.org/users/1220355
// @downloadURL https://update.greasyfork.org/scripts/480305/V2EX%20check%20user.user.js
// @updateURL https://update.greasyfork.org/scripts/480305/V2EX%20check%20user.meta.js
// ==/UserScript==


(function() {
    'use strict';


    if (window.location.href.match(/^https:\/\/v2ex\.com\/t\//)) {

        var sep10Div = document.querySelector('.sep10');

        if (sep10Div) {

            var checkDiv = document.createElement("div");
            checkDiv.id = "check";

            var checkButton = document.createElement("button");
            checkButton.textContent = "检查";
            checkButton.addEventListener("click", checkLinks);

            checkDiv.appendChild(checkButton);

            sep10Div.insertAdjacentElement('afterend', checkDiv);

            function checkLinks() {

                checkButton.disabled = true;

                var cells = document.getElementsByClassName("cell");


                for (var i = 0; i < cells.length; i++) {

                    var links = cells[i].getElementsByTagName("a");


                    for (var j = 0; j < links.length; j++) {
                        var href = links[j].getAttribute("href");

                        if (href.includes("/member/") && !isDescendant(links[j], 'reply_content')) {

                            href = window.location.origin + href;

                            setTimeout(checkLinkValidity, j * 1000, href, links[j]);
                        }
                    }
                }
            }

            function isDescendant(element, className) {
                while ((element = element.parentElement) && !element.classList.contains(className));
                return element;
            }

            function checkLinkValidity(url, linkElement) {
                fetch(url)
                    .then(response => {
                        if (response.status === 404) {
                            console.error("404 Not Found:", url);

                            linkElement.classList.add("error-message");

                            var errorElement = document.createElement("span");
                            errorElement.textContent = " 此用户已被封禁";
                            linkElement.parentNode.appendChild(errorElement);
                        } else if (response.status === 403) {
                            console.error("403 Forbidden:", url);

                            linkElement.classList.add("error-message");

                            var errorElement = document.createElement("span");
                            errorElement.textContent = " 403 Forbidden";
                            linkElement.parentNode.appendChild(errorElement);
                        } else {

                            console.log("Link is valid:", url);
                        }
                    })
                    .catch(error => {
                        console.error("Error checking link:", error);
                    })
                    .finally(() => {

                    });
            }
        }
    }
})();
