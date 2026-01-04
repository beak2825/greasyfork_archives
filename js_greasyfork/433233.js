// ==UserScript==
// @name         Password Length Indicator
// @namespace    trockenasche
// @version      3.1
// @description  Indicate password fields that have a maximum length of characters.
// @author       trockenasche
// @homepage     https://github.com/trockenasche/US-Password-Length-Indicator
// @supportURL   https://github.com/trockenasche/US-Password-Length-Indicator/issues
// @include      *
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Three_asterisks.svg/32px-Three_asterisks.svg.png
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/433233/Password%20Length%20Indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/433233/Password%20Length%20Indicator.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) {
        return;
    }
    style = document.createElement('style');
    style.innerHTML = css;
    head.appendChild(style);
}

function removeMaxLength() {
    var passFields = document.querySelectorAll("input[type='password']");
    [].forEach.call(passFields, function (passField) {
        passField.removeAttribute("maxLength");
        passField.style.border = "0px";
    })
    var divs = document.querySelectorAll("div.us-pli-div");
    [].forEach.call(divs, function (div) {
        div.remove();
    });
}

(function () {
    'use strict';
    var passFields = document.querySelectorAll("input[type='password']");

    if (passFields.length == 0) {
        // Couldn't find any password fields, leaving function.
        return;
    }

    addGlobalStyle(`div.us-pli {
                    position: relative;
                    display: flex;
                    flex-direction: row;
                    width: 100%;
                    align-content: flex-end;
                    }`);
    addGlobalStyle(`div.us-pli>div {
                    padding: 0px 1px;
                    background: coral;
                    border: 1px solid coral;
                    justify-content: center;
                    display: flex;
                    border-radius: 0px 5px 5px 0px;
                    }`);
    addGlobalStyle(`a.us-pli-button {
                    color: white;
                    font-family: Verdana, Arial, Helvetica, sans-serif;
                    font-size: 0.9em;
                    text-decoration: none;
                    align-self: center;
                    }`);
    addGlobalStyle(`a.us-pli-button:hover {
                    color: red;
                    text-decoration: line-through;
                    }`);

    [].forEach.call(passFields, function (passField) {
        if (passField.maxLength > 0) {
            passField.style.border = "2px solid coral";

            // Add the div before the input field.
            var wrapper = document.createElement('div');
            wrapper.classList.add('us-pli');
            passField.parentNode.insertBefore(wrapper, passField);
            // And move the input field inside the div element.
            wrapper.appendChild(passField);

            // Add the div element with the maxLength value at the end of the input element.
            passField.insertAdjacentHTML('afterend', '<div class="us-pli-div"><a href="javascript:void\(0\)" class="us-pli-button" title="remove limit!"> ' + passField.maxLength + '</a></div>');
        }
    });

    var usPliButtons = document.querySelectorAll("a.us-pli-button");
    if (usPliButtons.length > 0) {
        [].forEach.call(usPliButtons, function (usPliButton) {
            usPliButton.addEventListener("click", removeMaxLength);
        });
    }

    return;
})

();
