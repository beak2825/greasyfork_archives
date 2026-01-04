// ==UserScript==
// @name         Format PHub GH commit
// @namespace    http://tampermonkey.net/
// @version      2025-05-24
// @description  Formats GH commit messages
// @author       tylerwgrass
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @match        https://github.com/runelite/plugin-hub/pull/*
// @match        https://github.com/runelite/plugin-hub/pulls
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528899/Format%20PHub%20GH%20commit.user.js
// @updateURL https://update.greasyfork.org/scripts/528899/Format%20PHub%20GH%20commit.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function appendFormatButton() {
        const btn = document.createElement("button");
        btn.textContent = "Format message";
        btn.addEventListener("click", function(e) {
            e.preventDefault();
            let el = [...document.querySelectorAll(".timeline-comment .author")]
            .filter(i => i.textContent == "runelite-github-app")[0];
            for (; !el.classList.contains("timeline-comment"); el = el.parentElement);
            let name = el.querySelector(".comment-body code").textContent;
            const input = document.querySelector("[data-component='input']");
            let ver = (/[.0-9]{3,}/.exec(input.value)||[])[0];
            let pull = /\(#[0-9]+\)/.exec(input.value)[0];
            let isUpdate = Array.from(document.querySelector(".js-issue-labels").children).map(c => c.textContent).some(c => c.includes("plugin change"));
            const newValue = `${isUpdate ? "update" : "add"} ${name}${ver && ver.indexOf(".") != -1 ? " to v" + ver : ""} ${pull}`;
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                window.HTMLInputElement.prototype,
                'value').set;
            nativeInputValueSetter.call(input, newValue);
            const event = new Event('input', { bubbles: true });
            input.dispatchEvent(event);
        });

        btn.classList.add("btn");
        const actionsContainer = document.querySelector('.merge-pr');
        actionsContainer.append(btn);
    }
    waitForKeyElements(".merge-pr", appendFormatButton, true);
})();