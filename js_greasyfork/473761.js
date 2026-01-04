// ==UserScript==
// @name         GH PR Writer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  For feature branches composed of squashed merges. Adds a button to write a description of PR on Github, combining all the PR numbers into a list
// @author       You
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473761/GH%20PR%20Writer.user.js
// @updateURL https://update.greasyfork.org/scripts/473761/GH%20PR%20Writer.meta.js
// ==/UserScript==

(function () {
    function getPrs() {
        return document.querySelectorAll('.js-timeline-item .issue-link.js-issue-link');
    }

    const prs = getPrs();

    if (!prs.length) console.log('No PR strings found');

    let partialPRString = '';
    const prStrings = [...prs].map(pr => pr.innerText);
    const mutatedPRStrings = [];

    prStrings.forEach((prString) => {
        if (!prString.substring) return;

        if (!prString.includes('…')) {
            mutatedPRStrings.push(prString);
            return;
        }

        if (prString.endsWith('…')) {
            partialPRString = prString.substring(0, prString.indexOf('…'));
            return;
        }

        if (prString.startsWith('…') && partialPRString) {
            const mutatedPRString = `${partialPRString}${prString.substring(
                prString.indexOf('…') + 1,
                prString.length
            )}`;

            mutatedPRStrings.push(mutatedPRString);
        }
    });

    const mutatedPRStringsList = mutatedPRStrings.map(s => `- ${s}`).join('\n');

    // aria-label="Edit Pull Request title"
    const divForButton = document.querySelector('[aria-label="Edit Pull Request title"]').parentElement;

    const button = document.createElement('button');
    button.innerText = 'Write PR Description';

    button.addEventListener('click', () => {
        const prDescriptionTextArea = document.querySelector('textarea[name="pull_request[body]"]');
        const prDescription = mutatedPRStringsList;
        prDescriptionTextArea.value = prDescription;
    });

    divForButton.appendChild(button);
}());
