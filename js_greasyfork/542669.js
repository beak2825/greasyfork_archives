// ==UserScript==
// @name         Bonk Notes
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Allows you to take notes on players.
// @author       Apx
// @match        https://bonk.io/gameframe-release.html
// @match        https://bonkisback.io/gameframe-release.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542669/Bonk%20Notes.user.js
// @updateURL https://update.greasyfork.org/scripts/542669/Bonk%20Notes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const css = document.createElement('style');
    css.innerHTML = `
    .newbonklobby_playerentry_notebutton {
        background-image: url("data:image/svg+xml,%3Csvg width='12px' height='12px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath id='Vector' d='M10.0002 4H7.2002C6.08009 4 5.51962 4 5.0918 4.21799C4.71547 4.40973 4.40973 4.71547 4.21799 5.0918C4 5.51962 4 6.08009 4 7.2002V16.8002C4 17.9203 4 18.4801 4.21799 18.9079C4.40973 19.2842 4.71547 19.5905 5.0918 19.7822C5.5192 20 6.07899 20 7.19691 20H16.8031C17.921 20 18.48 20 18.9074 19.7822C19.2837 19.5905 19.5905 19.2839 19.7822 18.9076C20 18.4802 20 17.921 20 16.8031V14M16 5L10 11V14H13L19 8M16 5L19 2L22 5L19 8M16 5L19 8' stroke='%2300000064' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
        width: 12px;
        height: 12px;
        position: absolute;
        right: 6px;
        top: 1px;
        cursor: pointer;
    }
    .newbonklobby_playerentry_note {
        height: 12px;
        position: absolute;
        right: 6px;
        top: 1px;
        text-align: right;
        background: none;
        border: none;
        color: #371dff;
        font-size: 11px;
        width: 95%;
    }
    .newbonklobby_playerentry_note:focus {
		outline-width: 0;
	}
    #newbonklobby_playerbox_shownotes {
        position: absolute;
        top: 4px;
        right: 4px;
    }
    #newbonklobby_playerbox_shownotes_label {
        color: #ffffff;
        font-family: "futurept_b1";
        margin-right: 4px;
    }
    #newbonklobby_playerbox_shownotes_button {
        display: inline-block;
        height: 24px;
        width: 24px;
    }
    .newbonklobby_playerbox_shownotes_button_off {
        background-color: #a73e2d !important;
    }
    .newbonklobby_playerbox_shownotes_button_off:hover {
        background-color: #b75545 !important;
    }
    `;
    document.getElementsByTagName('head')[0].appendChild(css);

    if(localStorage.getItem('notes') == null) localStorage.setItem('notes', '{"show":true,"notes":{}}');

    const container = document.createElement('div');
    container.id = 'newbonklobby_playerbox_shownotes';

    const showLabel = document.createElement('span');
    showLabel.id = 'newbonklobby_playerbox_shownotes_label';
    showLabel.textContent = 'notes';

    const showButton = document.createElement('div');
    showButton.id = 'newbonklobby_playerbox_shownotes_button';
    showButton.className = 'brownButton brownButton_classic buttonShadow';
    showButton.textContent = 'on';
    if(!JSON.parse(localStorage.getItem('notes')).show) {
        showButton.textContent = 'off';
        showButton.classList.add('newbonklobby_playerbox_shownotes_button_off');
    }
    showButton.onclick = function () {
        const notes = JSON.parse(localStorage.getItem('notes'));
        if(notes.show) {
            showButton.textContent = 'off';
            showButton.classList.add('newbonklobby_playerbox_shownotes_button_off');
            notes.show = false;
        }
        else {
            showButton.textContent = 'on';
            showButton.classList.remove('newbonklobby_playerbox_shownotes_button_off');
            notes.show = true;
        }
        updateEntries(notes.show);
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    container.appendChild(showLabel);
    container.appendChild(showButton);
    document.getElementById('newbonklobby_playerbox').appendChild(container);

    function updateEntries (show) {
        const entries = [...document.getElementsByClassName('newbonklobby_playerentry')];
        entries.forEach( entry => {
            if(show) {
                entry.getElementsByClassName('newbonklobby_playerentry_notebutton')[0].style.visibility = 'inherit';
                entry.getElementsByClassName('newbonklobby_playerentry_note')[0].style.visibility = 'inherit';
            }
            else {
                entry.getElementsByClassName('newbonklobby_playerentry_notebutton')[0].style.visibility = 'hidden';
                entry.getElementsByClassName('newbonklobby_playerentry_note')[0].style.visibility = 'hidden';
            }
        });
    }

    function note (entry, username) {
        const note = JSON.parse(localStorage.getItem('notes')).notes[String(username)];

        const button = document.createElement('div');
        button.className = 'newbonklobby_playerentry_notebutton';
        button.onclick = function () {
            button.style.display = 'none';
            input.focus();
        };

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'newbonklobby_playerentry_note';
        input.maxLength = 20;
        input.onclick = button.onclick;
        input.onblur = function () {
            if(this.value.length == 0) button.style.display = 'block';
            else button.style.display = 'none';
            const notes = JSON.parse(localStorage.getItem('notes'));
            notes.notes[String(username)] = String(this.value);
            localStorage.setItem('notes', JSON.stringify(notes));
        };
        input.onkeydown = function (event) {
            if(event.keyCode == 13) {
                let fireEvent = document.createEvent("HTMLEvents");
                fireEvent.initEvent('keydown');
                fireEvent.keyCode = 13;
                document.dispatchEvent(fireEvent);
            }
        }

        entry.appendChild(input);
        entry.appendChild(button);

        const show = JSON.parse(localStorage.getItem('notes')).show;
        if(!show) {
            input.style.visibility = 'hidden';
            button.visibility = 'hidden';
        }

        if(note && typeof(note) === 'string' && note.length > 0) {
            input.value = note;
            button.style.display = 'none';
        }
    }

    const originalInsertBefore = document.getElementById('newbonklobby_playerbox_elementcontainer').insertBefore;
    document.getElementById('newbonklobby_playerbox_elementcontainer').insertBefore = function (...args) {
        originalInsertBefore.call(this, ...args);
        const entryOriginalAppend = args[0].appendChild;
        args[0].appendChild = function (elem) {
            entryOriginalAppend.call(this, elem);
            if(elem.className == 'newbonklobby_playerentry_balance' && elem.parentNode.getElementsByClassName('newbonklobby_playerentry_level')[0].textContent.startsWith('Level')) {
                note(elem.parentNode, elem.parentNode.getElementsByClassName('newbonklobby_playerentry_name')[0].textContent)
            }
        };
    };

    const originalAppendChild = document.getElementById('newbonklobby_specbox_elementcontainer').appendChild;
    document.getElementById('newbonklobby_specbox_elementcontainer').appendChild = function (...args) {
        originalAppendChild.call(this, ...args);
        const entryOriginalAppend = args[0].appendChild;
        args[0].appendChild = function (elem) {
            entryOriginalAppend.call(this, elem);
            if(elem.className == 'newbonklobby_playerentry_balance' && elem.parentNode.getElementsByClassName('newbonklobby_playerentry_level')[0].textContent.startsWith('Level')) {
                note(elem.parentNode, elem.parentNode.getElementsByClassName('newbonklobby_playerentry_name')[0].textContent)
            }
        };
    };
})();