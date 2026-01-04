// ==UserScript==
// @name         Infinite Craft
// @namespace    http://tampermonkey.net/
// @version      01
// @license      GNU GPLv3
// @description  Save and Load Script for Infinite Craft
// @author       Shadowdanc
// @match        https://neal.fun/infinite-craft/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491710/Infinite%20Craft.user.js
// @updateURL https://update.greasyfork.org/scripts/491710/Infinite%20Craft.meta.js
// ==/UserScript==

function download_txt() {
    let currentData = localStorage.getItem('infinite-craft-data');
    let hiddenElement = document.createElement('a');

    hiddenElement.href = 'data:attachment/text,' + encodeURI(currentData);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'InfiniteCraftSaveData.txt';
    hiddenElement.click();
}

function addDownloadButton() {
    let button = document.createElement('button');
    button.innerHTML = 'Save Game Data';
    button.classList.add('downloadSaveButton');
    document.getElementsByClassName('side-controls')[0].appendChild(button);

    document.getElementsByClassName('downloadSaveButton')[0].addEventListener('click', download_txt);
}

function askYesNoQuestion(question) {
    let answer = prompt(question + " (yes or no)");
    if (answer.toLowerCase() === "yes") {
        return true;
    } else if (answer.toLowerCase() === "no") {
        return false;
    } else {
        // If the user enters an invalid response, prompt again
        alert("Please enter 'yes' or 'no'");
        return askYesNoQuestion(question);
    }
}

function addLoadButton() {

    let input = document.createElement('input');
    input.classList.add('LoadSaveButton');
    input.type = 'file';
    input.innerHTML = 'Load Game Data';
    input.accept = 'text/plain';

    document.getElementsByClassName('side-controls')[0].appendChild(input);
    document.getElementsByClassName('LoadSaveButton')[0].addEventListener('change', function (event) {
		let input = event.target;
        let reader = new FileReader();
        reader.onload = function() {
            let text = reader.result;
            if (askYesNoQuestion("This will overrite you'r current save data: Continue?")) {
                localStorage.setItem('infinite-craft-data', text);
            }
        };
        reader.readAsText(input.files[0]);
	});
}

(function() {
    'use strict';

    setTimeout(function(){
        addDownloadButton();
        addLoadButton();
    }, 500);

})();