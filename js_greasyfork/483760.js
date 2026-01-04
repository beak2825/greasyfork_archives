// ==UserScript==
// @name         NEW LiveWorksheets Solver
// @namespace    https://www.liveworksheets.com/
// @version      1.1
// @description  Since the Liveworksheets website was updated, we have changed the way to get answers. LiveWorksheets Solver by TobyAdd
// @author       TobyAdd
// @match        https://www.liveworksheets.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://www.liveworksheets.com
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/483760/NEW%20LiveWorksheets%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/483760/NEW%20LiveWorksheets%20Solver.meta.js
// ==/UserScript==

(function () {
    const worksheetContainer = document.getElementById('worksheet-buttons');

    // creating answer button

    const answerButton = document.createElement('button');
    answerButton.style = 'background-color: #2c2c2c; color: #eee; border-radius: 0.5rem; padding: 8px; cursor: pointer;';
    answerButton.innerText = 'Solve worksheet';
    answerButton.onclick = () => {
        jQuery("#worksheet-preview")
            .worksheetPreview("validation",
                {
                    clicked: !1,
                    showAnswers: !0,
                    showRightAnswers: !0
                }
            );

        document.getElementById('worksheet-preview').scrollIntoView();
    }

    worksheetContainer.append(answerButton);
})();