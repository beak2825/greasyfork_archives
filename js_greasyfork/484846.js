// ==UserScript==
// @name         Educake ChatGPT Button + Allow Pasting
// @namespace    https://github.com/Z2r-YT/Educake-Pasting
// @version      1.0
// @description  Adds a ChatGPT button to Educake which copies question text and opens a ChatGPT window, allowing you to get answers quickly. This script also re-enables the pasting feature in the answer box, so you can copy answers from GPT / Google, and paste them in the answer box
// @author       liam @ duckwithsunglasses.com
// @match        *://*.educake.co.uk/*
// @grant        none
// @license      MIT
// @icon         data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWw6c3BhY2U9InByZXNlcnZlIiBpZD0iSWNvbnMiIHg9IjAiIHk9IjAiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDQ4IDQ4IiBzdHlsZT0iY3Vyc29yOiBkZWZhdWx0OyI+DQogIDxzdHlsZT4NCiAgICAuc3Qze2ZpbGw6bm9uZTtzdHJva2U6IzQ1NDEzYztzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTB9DQogIDwvc3R5bGU+DQogIDxnIGlkPSJYTUxJRF8xNzQ5N18iPg0KICAgIDxlbGxpcHNlIGlkPSJYTUxJRF8xNzUxM18iIGN4PSIyNCIgY3k9IjQ1LjEiIGZpbGw9IiM0NTQxM2MiIG9wYWNpdHk9Ii4xNSIgcng9IjE0LjIiIHJ5PSIxLjkiLz4NCiAgICA8ZyBpZD0iWE1MSURfMTc0OThfIj4NCiAgICAgIDxwYXRoIGlkPSJYTUxJRF8xNzUxMl8iIGZpbGw9IiNkZWJiN2UiIGQ9Ik0zNyA0NC41SDExYy0xLjkgMC0zLjUtMS42LTMuNS0zLjVWNy44QzcuNSA1LjkgOSA0LjQgMTEgNC40aDI2YzEuOSAwIDMuNSAxLjYgMy41IDMuNVY0MWMwIDEuOS0xLjUgMy41LTMuNSAzLjV6Ii8+DQogICAgICA8cGF0aCBpZD0iWE1MSURfMTc1MTFfIiBmaWxsPSIjZjBkNWE4IiBkPSJNMzcgNC40SDExYy0yIDAtMy41IDEuNS0zLjUgMy40djRDNy41IDkuOSA5IDguNCAxMSA4LjRoMjZjMS45IDAgMy41IDEuNiAzLjUgMy41di00YzAtMi0xLjUtMy41LTMuNS0zLjV6Ii8+DQogICAgICA8cGF0aCBpZD0iWE1MSURfMTc1MTBfIiBkPSJNMzcgNDQuNUgxMWMtMS45IDAtMy41LTEuNi0zLjUtMy41VjcuOEM3LjUgNS45IDkgNC40IDExIDQuNGgyNmMxLjkgMCAzLjUgMS42IDMuNSAzLjVWNDFjMCAxLjktMS41IDMuNS0zLjUgMy41eiIgY2xhc3M9InN0MyIvPg0KICAgICAgPHBhdGggaWQ9IlhNTElEXzE3NTA5XyIgZmlsbD0iI2ZmZmVmMiIgZD0iTTM1LjEgNDAuNEgxMi45Yy0uNyAwLTEuMi0uNi0xLjItMS4yVjExLjZjMC0uNy42LTEuMiAxLjItMS4yaDIyLjNjLjcgMCAxLjIuNiAxLjIgMS4ydjI3LjZjMCAuNy0uNiAxLjItMS4zIDEuMnoiLz4NCiAgICAgIDxwYXRoIGlkPSJYTUxJRF8xNzUwOF8iIGZpbGw9IiNmZmYiIGQ9Ik0zNS4xIDEwLjRIMTIuOWMtLjcgMC0xLjIuNi0xLjIgMS4ydjMuOWMwLS43LjYtMS4yIDEuMi0xLjJoMjIuM2MuNyAwIDEuMi42IDEuMiAxLjJ2LTMuOWMwLS43LS42LTEuMi0xLjMtMS4yeiIvPg0KICAgICAgPHBhdGggaWQ9IlhNTElEXzE3NTA3XyIgZD0iTTM1LjEgNDAuNEgxMi45Yy0uNyAwLTEuMi0uNi0xLjItMS4yVjExLjZjMC0uNy42LTEuMiAxLjItMS4yaDIyLjNjLjcgMCAxLjIuNiAxLjIgMS4ydjI3LjZjMCAuNy0uNiAxLjItMS4zIDEuMnoiIGNsYXNzPSJzdDMiLz4NCiAgICAgIDxwYXRoIGlkPSJYTUxJRF8xNzUwNl8iIGZpbGw9IiNkYWVkZjciIGQ9Ik0yNiA4LjFjMC0xLjEtLjktMi0yLTJzLTIgLjktMiAyaC0zLjVjLS43IDAtMS4yLjYtMS4yIDEuMnYxLjljMCAuNy42IDEuMiAxLjIgMS4yaDExYy43IDAgMS4yLS42IDEuMi0xLjJWOS4zYzAtLjctLjYtMS4yLTEuMi0xLjJIMjZ6Ii8+DQogICAgICA8cGF0aCBpZD0iWE1MSURfMTc1MDVfIiBmaWxsPSIjZThmNGZhIiBkPSJNMjkuNSA4LjFIMjZjMC0xLjEtLjktMi0yLTJzLTIgLjktMiAyaC0zLjVjLS43IDAtMS4yLjYtMS4yIDEuMnYyYzAtLjcuNi0xLjIgMS4yLTEuMkgyMmMwLTEuMS45LTIgMi0yczIgLjkgMiAyaDMuNWMuNyAwIDEuMi41IDEuMiAxLjJ2LTJjLjEtLjYtLjUtMS4yLTEuMi0xLjJ6Ii8+DQogICAgICA8cGF0aCBpZD0iWE1MSURfMTc1MDRfIiBkPSJNMjYgOC4xYzAtMS4xLS45LTItMi0ycy0yIC45LTIgMmgtMy41Yy0uNyAwLTEuMi42LTEuMiAxLjJ2MS45YzAgLjcuNiAxLjIgMS4yIDEuMmgxMWMuNyAwIDEuMi0uNiAxLjItMS4yVjkuM2MwLS43LS42LTEuMi0xLjItMS4ySDI2eiIgY2xhc3M9InN0MyIvPg0KICAgICAgPHBhdGggaWQ9IlhNTElEXzE3NTAzXyIgZD0iTTE1LjQgMTYuM2g2LjIiIGNsYXNzPSJzdDMiLz4NCiAgICAgIDxwYXRoIGlkPSJYTUxJRF8xNzUwMl8iIGQ9Ik0xNS40IDM0LjRoNi4yIiBjbGFzcz0ic3QzIi8+DQogICAgICA8cGF0aCBpZD0iWE1MSURfMTc1MDFfIiBkPSJNMTUuNCAyMGgxNC41IiBjbGFzcz0ic3QzIi8+DQogICAgICA8cGF0aCBpZD0iWE1MSURfMTc1MDBfIiBkPSJNMTUuNCAyMy4zaDE0LjUiIGNsYXNzPSJzdDMiLz4NCiAgICAgIDxwYXRoIGlkPSJYTUxJRF8xNzQ5OV8iIGQ9Ik0xNS40IDI2LjloMTQuNSIgY2xhc3M9InN0MyIvPg0KICAgIDwvZz4NCiAgPC9nPg0KPC9zdmc+
// @downloadURL https://update.greasyfork.org/scripts/484846/Educake%20ChatGPT%20Button%20%2B%20Allow%20Pasting.user.js
// @updateURL https://update.greasyfork.org/scripts/484846/Educake%20ChatGPT%20Button%20%2B%20Allow%20Pasting.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // check if GPT button exists
    function isNewButtonAdded() {
      return document.getElementById("newButton") !== null;
    }

    // inject GPT Button
    function injectGPT() {
      // Check if the button has already been added
        if (!isNewButtonAdded()) {
            var newButton = document.createElement("div");
            newButton.className = "btn bg-green-80 bg-green-hover r-bg-light r-bg-light-hover r-text-dark ml-2 lh-close mb-2 mb-sm-0 align-self-start";
            newButton.textContent = "Copy and open ChatGPT";
            newButton.id = "newButton";

            // Add event listener to copy text and open "chat.openai.com" in a new tab
            newButton.addEventListener("click", function() {
                // Copy text from elements with class ".question-text"
                var questionTextElements = document.querySelectorAll(".question-text");
                var copiedText = Array.from(questionTextElements).map(element => element.textContent).join('\n');

                // Copy text to clipboard
                var tempInput = document.createElement("textarea");
                tempInput.value = copiedText;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand("copy");
                document.body.removeChild(tempInput);

                // Open "chat.openai.com" in a new tab
                window.open("https://chat.openai.com", "_blank");
            });

            // Insert the new button before the last div in the existing div
            var existingDiv = document.querySelector(".column");
            existingDiv.insertBefore(newButton, existingDiv.lastElementChild);
        }
    }

    // wait for body to click
    document.addEventListener('click', function() {
    setInterval(injectGPT, 500);
    });

    // remove retarded "onpaste" disable func
function removePaste() {
    var elements = document.querySelectorAll('.answer-text');
    elements.forEach(function(element) {
        element.removeAttribute('onpaste');
    });
}
// check every .5s for new boxess
setInterval(removePaste, 500);

})();
