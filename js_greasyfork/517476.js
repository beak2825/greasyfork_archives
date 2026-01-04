// ==UserScript==
// @name         Wyświetl notatki jako popup z pulsującym tłem
// @version      1.3
// @author       Dawid
// @description  Wyświetla treść notatki na górze strony jako popup z czerwonym tłem, pulsującymi bokami i pogrubionym tekstem
// @match        *://premiumtechpanel.sellasist.pl/*
// @grant        none
// @license      Proprietary
// @namespace https://greasyfork.org/users/1396754
// @downloadURL https://update.greasyfork.org/scripts/517476/Wy%C5%9Bwietl%20notatki%20jako%20popup%20z%20pulsuj%C4%85cym%20t%C5%82em.user.js
// @updateURL https://update.greasyfork.org/scripts/517476/Wy%C5%9Bwietl%20notatki%20jako%20popup%20z%20pulsuj%C4%85cym%20t%C5%82em.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function displayNotesPopup() {
        const notesContainer = document.querySelector('#notes');
        if (!notesContainer) return;
        const notes = notesContainer.querySelectorAll('.note .text p');
        if (notes.length === 0) return;
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '40px';
        popup.style.left = '50%';
        popup.style.transform = 'translateX(-50%)';
        popup.style.backgroundColor = '#ffcccc';  // Jasno czerwone tło
        popup.style.border = '2px solid #000';
        popup.style.padding = '15px';
        popup.style.zIndex = '1000';
        popup.style.width = '80%';
        popup.style.maxWidth = '600px';
        popup.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)';
        popup.style.borderRadius = '8px';
        popup.style.fontFamily = 'Arial, sans-serif';
        // Pulsujące boki za pomocą animowanego gradientu
        popup.style.animation = 'pulse-border 2s infinite';
        popup.style.backgroundImage = 'linear-gradient(90deg, rgba(255, 0, 0, 0.5), rgba(255, 0, 0, 0) 50%, rgba(255, 0, 0, 0.5))';
        popup.style.backgroundSize = '200% 100%';
        const styleSheet = document.createElement('style');
        styleSheet.innerText = `
            @keyframes pulse-border {
                0% { background-position: 0% 0%; }
                50% { background-position: 100% 0%; }
                100% { background-position: 0% 0%; }
            }
        `;
        document.head.appendChild(styleSheet);
        const popupTitle = document.createElement('h2');
        popupTitle.innerText = 'Notatki';
        popupTitle.style.marginTop = '0';
        popupTitle.style.fontSize = '15px';
        popupTitle.style.textAlign = 'center';
        popupTitle.style.color = '#333';
        popup.appendChild(popupTitle);
        notes.forEach((note, index) => {
            const noteWrapper = document.createElement('div');
            noteWrapper.classList.add('popup-note');
            const noteText = document.createElement('p');
            noteText.innerText = note.innerText;
            noteText.style.marginBottom = '10px';
            noteText.style.color = '#444';
            noteText.style.fontWeight = 'bold';
            noteWrapper.appendChild(noteText);
            if (index < notes.length - 1) {
                const separator = document.createElement('div');
                separator.style.borderBottom = '3px solid #ff4444';
                separator.style.margin = '10px 0';
                noteWrapper.appendChild(separator);
            }
            popup.appendChild(noteWrapper);
        });
        const closeButton = document.createElement('button');
        closeButton.innerText = 'Zamknij';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.style.backgroundColor = '#ff4444';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.padding = '5px 10px';
        closeButton.style.borderRadius = '5px';
        closeButton.style.cursor = 'pointer';
        closeButton.addEventListener('click', () => {
            popup.style.display = 'none';
        });
        popup.appendChild(closeButton);
        document.body.appendChild(popup);
    }
    window.addEventListener('load', displayNotesPopup);
})();