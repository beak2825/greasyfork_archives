// ==UserScript==
// @name         AJR log ttu
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Crea un botón para guardar logs para AJR
// @author       Pedrubik🦙
// @license      GPL-3.0-or-later
// @match        https://reader.ttsu.app/b?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ttsu.app
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473704/AJR%20log%20ttu.user.js
// @updateURL https://update.greasyfork.org/scripts/473704/AJR%20log%20ttu.meta.js
// ==/UserScript==

function copyLog(textLog,divObjective) {
    navigator.clipboard.writeText(textLog);
    createPopup(divObjective, textLog)
};
function createPopup(divObjective, textLog) {
    const popup = document.createElement('div');
    popup.textContent = `${textLog} ✅`;
    popup.style.position = 'absolute';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    popup.style.color = 'white';
    popup.style.padding = '10px';
    popup.style.borderRadius = '5px';
    popup.style.fontFamily = 'Arial, sans-serif';
    popup.style.fontSize = '16px';
    popup.style.zIndex = '9999';
    popup.style.pointerEvents = 'none';
    popup.style.opacity = '0'; // Start with 0 opacity
    popup.style.transition = 'opacity 0.25s ease, top 0.3s ease'; // Add transition for opacity


    // Adjust for the parent's positioning
    const rect = divObjective.getBoundingClientRect();
    const parentStyles = window.getComputedStyle(divObjective);
    const paddingTop = parseFloat(parentStyles.paddingTop);
    const paddingLeft = parseFloat(parentStyles.paddingLeft);

    const popupTop = rect.top + window.scrollY + paddingTop;
    const popupLeft = rect.left + window.scrollX + paddingLeft;

    popup.style.top = `${popupTop + rect.height / 2}px`;
    popup.style.left = `${popupLeft + rect.width / 2}px`;

    divObjective.appendChild(popup);

    // Triggering a reflow so that the initial opacity change is animated
    popup.offsetWidth;
    popup.style.top = `${popupTop - rect.height}px`; // Move the popup up
    popup.style.opacity = '1'; // Fade in
    setTimeout(() => {
        popup.style.opacity = '0'; // Fade out
        setTimeout(() => {
            divObjective.removeChild(popup);
        }, 500); // Remove the popup after the fade out animation (0.5 seconds)
    }, 1000); // Remove the popup after 2 seconds
}
function runScript() {
    const flexChild = this.querySelector(".flex-1");
    const regex = /\|.*|【電子版特典付】 \(PASH! ブックス\) /gm;
    const subst = ``;

    if (!runScript.executed && flexChild) {
        console.log("Executed")
        runScript.executed = true;
        let divChildren = flexChild.childNodes;
        for (var i = 0; i < divChildren.length - 1; i++) {
            let logText = `.log lectura ${divChildren[i+1].childNodes[2].innerText - divChildren[i].childNodes[2].innerText} ${document.title.replace(regex, subst)} ${divChildren[i].childNodes[0].innerText}`;
            divChildren[i].addEventListener("click", function(){
                copyLog(logText, this);
            }, false);
        }
    } else if (!flexChild) {
        console.log("No child with class 'flex-1' and the flag is reseted");
        runScript.executed = false; // Reset the flag
        // Your additional code here
    }else{
        console.log("Not Executed")
    }
};

const container = document.querySelector('.writing-horizontal-tb');
container.addEventListener('click', runScript);