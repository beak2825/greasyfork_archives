// ==UserScript==
// @name         Organizar Links PDFs por Disciplina
// @namespace    ViolentMonkey Scripts
// @version      0.2
// @description  Organiza links de PDFs das disciplinas na página principal do curso cfp
// @match        https://metodosanches.com.br/courses/preparatorio-cfp-cbmpa-2023/
// @grant        none
// @author       Jeiel Miranda
// @downloadURL https://update.greasyfork.org/scripts/484356/Organizar%20Links%20PDFs%20por%20Disciplina.user.js
// @updateURL https://update.greasyfork.org/scripts/484356/Organizar%20Links%20PDFs%20por%20Disciplina.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let disciplineContainer = document.querySelector('.tutor-mt-40');

    if (disciplineContainer) {
        let yourNameLink = document.createElement('a');
        yourNameLink.textContent = 'Jeiel Miranda';
        yourNameLink.href = 'https://is.gd/JeielMiranda';
        yourNameLink.style.cssText = 'color: gray; font-size: 14px; text-decoration: none;';

        disciplineContainer.parentNode.insertBefore(yourNameLink, disciplineContainer.nextSibling);

        let lessonLinks = disciplineContainer.querySelectorAll('a[href*="/licao/"]');

        lessonLinks.forEach(link => {
            let lessonURL = link.href;

            fetch(lessonURL)
                .then(response => response.text())
                .then(html => {
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(html, 'text/html');

                    let pdfIndicator = doc.querySelector('.tutor-icon-download');

                    if (pdfIndicator) {
                        let lessonTitle = link.textContent.trim();
                        let pdfLink = pdfIndicator.parentNode.href;

                        let pdfElement = document.createElement('a');
                        pdfElement.href = pdfLink;
                        pdfElement.textContent = ' [PDF]';
                        pdfElement.style.color = 'red';
                        pdfElement.style.marginLeft = '5px';

                        link.parentNode.appendChild(pdfElement);
                    }
                })
                .catch(error => {
                    console.error('Erro:', error);
                });
        });
    }
})();