// ==UserScript==
// @name         TW Calc Questmanager
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Use this script to hide quests manually on tw-calc.net. This script adds a button to all Quests in Quest overview on tw-calc.net to hide them. Data ist stored in localStorage.
// @author       Rikone
// @match        https://*.tw-calc.net/quests/*
// @icon         https://www.google.com/s2/favicons?domain=tw-calc.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425676/TW%20Calc%20Questmanager.user.js
// @updateURL https://update.greasyfork.org/scripts/425676/TW%20Calc%20Questmanager.meta.js
// ==/UserScript==

(function(fn) {
    'use strict';

	var newScript = document.createElement('script');
	newScript.setAttribute("type", "application/javascript");
	newScript.textContent = '(' + fn + ')();';
	(document.body || document.head || document.documentElement).appendChild(newScript);
	newScript.parentNode.removeChild(newScript);
})(function() {
    const localStorageKey = 'tw_calc_questmanager_data';
    const querySelector = '[quest_name]';

    // run init functions
    addIconFont();
    hideQuestsOnLocalStorage();
    addClearButton();
    addHideButtons();

    // init functions
    function addIconFont() {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.async = false;
        link.type = 'text/css';
        link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';

        document.head.appendChild(link);
    }

    function hideQuestsOnLocalStorage() {
        let json = getStoredJson();
        if (json.hiddenQuests) {
            json.hiddenQuests.forEach((id) => {
                hideQuest(id);
            });
        }
    }

    function addClearButton() {
        let button = createClearButton();
        document.querySelector('h1').appendChild(button);
    }

    function addHideButtons() {
        let questgroups = document.querySelectorAll(querySelector);
        questgroups.forEach((questgroup) => {
            questgroup.style.position = 'relative';
            questgroup.classList.remove('fade');
            questgroup.querySelector('.container').classList.add('fade');
            questgroup.appendChild(createHideButton());
        });
    }

    // click handler
    function onHideQuestButtonClicked(event) {
        event.preventDefault();

        let parentAnker = event.target.closest(querySelector);
        let id = parentAnker.id;
        addhiddenQuestToLocalStorage(id);
        hideQuest(id);
    }

    function onClearButtonClicked() {
        window.localStorage.removeItem(localStorageKey);
        showAllQuests();
    }

    // logic functions
    function addhiddenQuestToLocalStorage(id) {
        let json = getStoredJson();

        if (json.hiddenQuests) {
            if (!json.hiddenQuests.includes(id)) {
                json.hiddenQuests.push(id);
            }
        } else {
            json.hiddenQuests = [id];
        }

        window.localStorage.setItem(localStorageKey, JSON.stringify(json));
    }

    function hideQuest(id) {
        document.querySelector(`#${id}`).style.display = 'none';
    }

    function showAllQuests() {
        let questgroups = document.querySelectorAll(querySelector);
        questgroups.forEach((questgroup) => {
            questgroup.style.display = 'inline-block';
        });
    }

    // button creation
    function createClearButton() {
        let icon = document.createElement('span');
        icon.className = 'material-icons';
        icon.style.color = '#eee';
        icon.style.fontSize = '22px';

        let text = document.createTextNode('visibility');
        icon.appendChild(text);

        let button = document.createElement('button');
        button.appendChild(icon);
        button.style.border = '1px #eee solid';
        button.style.display = 'inline-flex';
        button.style.borderRadius = '3px';
        button.style.background = 'rgb(58 46 16 / 75%)';
        button.style.padding = '1px';
        button.style.marginLeft = '5px';
        button.style.cursor = 'pointer';
        button.classList.add('fade');
        button.addEventListener('click', onClearButtonClicked);
        button.title = 'Show all quests';

        return button;
    }

    function createHideButton() {
        let icon = document.createElement('span');
        icon.className = 'material-icons';
        icon.style.color = '#eee';
        icon.style.fontSize = '22px';

        let text = document.createTextNode('visibility_off');
        icon.appendChild(text);

        let button = document.createElement('button');
        button.appendChild(icon);
        button.style.position = 'absolute';
        button.style.zIndex = '999';
        button.style.top = '-5px';
        button.style.right = '-4px';
        button.style.border = '1px #eee solid';
        button.style.display = 'flex';
        button.style.borderRadius = '3px';
        button.style.background = 'rgb(58 46 16 / 75%)';
        button.style.padding = '1px';
        button.style.cursor = 'pointer';
        button.classList.add('fade');
        button.addEventListener('click', onHideQuestButtonClicked);
        button.addEventListener('mouseover', removeEvent);
        button.title = 'Hide quest';

        return button;
    }

    // utils
    function getStoredJson() {
        let localStorageItem = window.localStorage.getItem(localStorageKey);
        return JSON.parse(localStorageItem) || {};
    }

    function removeEvent(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    function debug(message) {
        console.log(message);
    }
});

