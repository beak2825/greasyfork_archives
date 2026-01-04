// ==UserScript==
// @name         Jellyneo Challenger Checklist Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Adds buttons containing links for locations to unlock opponents that are not provided by Jellyneo's Challenger Checklist.
// @author       Amanda Bynes & AI-manda Binary
// @match        https://battlepedia.jellyneo.net/?go=challenger_checklist*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538506/Jellyneo%20Challenger%20Checklist%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/538506/Jellyneo%20Challenger%20Checklist%20Enhancer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function createStyledButton(text, href) {
        const button = document.createElement("a");
        button.href = href;
        button.target = "_blank";
        button.innerText = text;
        button.className = "button tiny";
        button.style.color = "#fff";
        button.style.display = "inline-block";
        button.style.marginTop = "6px";
        return button;
    }

    function injectButtonForChallenger(id, buttonText, destinationUrl) {
        const challengerLink = document.querySelector(`a[href="?go=showchallenger&id=${id}"]`);
        if (!challengerLink) return;

        const row = challengerLink.closest("tr");
        if (!row) return;

        const cells = row.querySelectorAll("td");
        if (cells.length < 2) return;

        const infoCell = cells[1];
        const button = createStyledButton(buttonText, destinationUrl);
        infoCell.appendChild(button);
    }

    function injectAll() {
        injectButtonForChallenger(
            7,
            "Visit the Haunted Woods »",
            "https://www.neopets.com/halloween/index.phtml"
        );
        injectButtonForChallenger(
            27,
            "Visit User Lookup »",
            "https://www.neopets.com/userlookup.phtml?user=kastraliss&place=99999"
        );
        injectButtonForChallenger(
            27,
            "Visit Pet Lookup »",
            "https://www.neopets.com/search.phtml?selected_type=pet&string=Kastraliss"
        );
        injectButtonForChallenger(
            40,
            "Visit the Wheel of Excitement »",
            "https://www.neopets.com/faerieland/wheel.phtml"
        );
        injectButtonForChallenger(
            52,
            "Visit the Advent Calendar »",
            "https://www.neopets.com/winter/adventcalendar.phtml"
        );
    }

    window.addEventListener("load", () => {
        setTimeout(injectAll, 500);
    });
})();
