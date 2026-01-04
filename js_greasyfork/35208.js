// ==UserScript==
// @name         [MTurk Worker] Return All HITs
// @namespace    https://github.com/Kadauchi
// @version      1.0.1
// @description  Returns all HITs that are in your queue
// @author       Kadauchi
// @icon         http://i.imgur.com/oGRQwPN.png
// @include      https://worker.mturk.com/tasks*
// @downloadURL https://update.greasyfork.org/scripts/35208/%5BMTurk%20Worker%5D%20Return%20All%20HITs.user.js
// @updateURL https://update.greasyfork.org/scripts/35208/%5BMTurk%20Worker%5D%20Return%20All%20HITs.meta.js
// ==/UserScript==

(function () {
    const button = document.createElement(`button`);
    button.className = `m-l-sm text-black btn btn-default`;
    button.textContent = `Return All`;
    button.addEventListener(`click`, async (event) => {
        const c = confirm(`Are you sure you want to return all HITs?`);

        if (c) {
            document.getElementsByClassName(`table-expand-collapse-button`)[0].click();

            for (const form of document.forms) {
                try {
                    const response = await fetch(form.action, {
                        method: `post`,
                        credentials: `include`,
                        body: new FormData(form)
                    });
                }
                catch (error) {
                    console.log(`Expected error:`, error);
                }

                form.closest(`.table-row`).style.display = `none`;
            }
        }
    });

    document.getElementsByClassName(`expand-collapse-projects-holder`)[0].appendChild(button);
})();