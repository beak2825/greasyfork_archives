// ==UserScript==
// @name        MyStat homework display
// @namespace   Violentmonkey Scripts
// @match       https://mystat.itstep.org/*
// @grant       none
// @version     1.2
// @author      regularuser548
// @description Скрипт который отображает текстовые дз прямо в Майстате
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/495713/MyStat%20homework%20display.user.js
// @updateURL https://update.greasyfork.org/scripts/495713/MyStat%20homework%20display.meta.js
// ==/UserScript==

const modalHTML = '<button class="float-right btn btn-danger" id="modalCloseBtn">X</button> <p></p>';
const pdfModalHTML = '<button class="float-right btn btn-danger" id="modalCloseBtn">X</button> <embed />';

let fileMIMEType = '';

document.addEventListener('click', clickHandler);

function clickHandler(event) {
    if (event.target.parentElement.parentElement.classList.contains("load-file"))
        displayFile(event);
}

function closeDialog() {
    document.querySelector('.customModal').close();
}

function displayFile(event) {
    event.preventDefault();

    let link = event.target.parentElement;

    fetch(link, { method: 'HEAD' })
        .then((response) => {

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            fileMIMEType = response.headers.get("Content-Type").split(";")[0];


            if (fileMIMEType == 'text/plain' || fileMIMEType == 'application/pdf')
                downloadFile(link);

            else
                link.click();

        })

}

function downloadFile(link) {
    fetch(link)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            if (fileMIMEType == 'application/pdf')
                return response.blob();
            else
                return response.text();

        })
        .then((content) => {
            displayModal(content);
        });

}

function displayModal(content) {
    let container = document.querySelector('.homeworks-section');
    let modal = container.querySelector('.customModal');

    //create dialog node
    if (modal == null) {

        modal = document.createElement('dialog');

        modal.classList.add("customModal");

        container.appendChild(modal);
    }

    //clean old html
    modal.innerHTML = '';

    //pdf
    if (fileMIMEType == 'application/pdf') {
        modal.innerHTML = pdfModalHTML;

        modal.querySelector('#modalCloseBtn').onclick = closeDialog;

        let embed = modal.querySelector('embed');

        embed.type = fileMIMEType;

        //we need to calculate size manually here :)
        let vh = window.innerHeight / 100;
        let vw = window.innerWidth / 100;

        embed.height = 85 * vh + 'px';
        embed.width = 85 * vw + 'px';

        embed.src = URL.createObjectURL(content);

        embed.onload = () => {
            URL.revokeObjectURL(embed.src);
        };
    }
    //text
    else {

        modal.innerHTML = modalHTML;
        modal.querySelector('#modalCloseBtn').onclick = closeDialog;
        modal.querySelector('p').innerText = content.trim();
    }


    modal.showModal();
}