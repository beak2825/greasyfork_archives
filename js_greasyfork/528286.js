// ==UserScript==
// @name              Userstyles World EDIT + ADD - Textarea Counter Limit
// @description       Adds a character counter to the input field of Userstyle Name (limit of 50 characters) and Userstyle Short description (limit of 160 characters).
// @icon              https://external-content.duckduckgo.com/ip3/userstyles.world.ico
// @version           1.5.0
// @author            decembre
// @namespace         https://greasyfork.org/fr/users/8-decembre
// @match             https://userstyles.world/edit/*
// @match             https://userstyles.world/add
// @grant             GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/528286/Userstyles%20World%20EDIT%20%2B%20ADD%20-%20Textarea%20Counter%20Limit.user.js
// @updateURL https://update.greasyfork.org/scripts/528286/Userstyles%20World%20EDIT%20%2B%20ADD%20-%20Textarea%20Counter%20Limit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add styles for counters
    GM_addStyle(`
        .test-class {
            font-size: 12px;
            color: silver;
        }
        .charCounter.Title {
            color: gold;
            background: green;
        }
        .charCounter.Title, .charCounter.ShortDescription {
            font-size: 12px;
        }
        .charCounter.Title.normal, .charCounter.ShortDescription.normal {
            border-radius: 5px;
            color: gold;
            background: green;
        }
        .charCounter.Title.too-large, .charCounter.ShortDescription.too-large {
            border-radius: 5px;
            color: glod;
            background: red;
        }
        input#name.normal {
            border: none;
        }
        input#name.too-large {
            border: 1px solid red;
        }
        textarea#description.shortTextarea.normal {
            border: none;
        }
        textarea#description.shortTextarea.too-large {
            border: 1px solid red;
        }
    `);

    // Title counter
    var titleCounterContainer = document.createElement('div');
    titleCounterContainer.className = 'test-class';
    var titleText = document.createTextNode('Your Title must be less to 50 characters: ');
    titleCounterContainer.appendChild(titleText);
    var titleCounter = document.createElement('span');
    titleCounter.className = 'charCounter Title normal';
    titleCounterContainer.appendChild(titleCounter);

    var titleLabel = document.querySelector('label[for="name"]');
    titleLabel.parentNode.insertBefore(titleCounterContainer, titleLabel.nextSibling);

    var titleInputField = document.querySelector('input#name');
    titleInputField.className = 'normal';
    updateTitleCounter();
    titleInputField.addEventListener('input', updateTitleCounter);

    function updateTitleCounter() {
        var textLength = titleInputField.value.length;
        titleCounter.textContent = textLength + '/50';
        if (textLength > 50) {
            titleCounter.className = 'charCounter Title too-large';
            titleInputField.className = 'too-large';
        } else {
            titleCounter.className = 'charCounter Title normal';
            titleInputField.className = 'normal';
        }
    }

    // Short description counter
    var shortDescriptionCounterContainer = document.createElement('div');
    shortDescriptionCounterContainer.className = 'test-class';
    var shortDescriptionText = document.createTextNode('Your Short description must be less to 160 characters: ');
    shortDescriptionCounterContainer.appendChild(shortDescriptionText);
    var shortDescriptionCounter = document.createElement('span');
    shortDescriptionCounter.className = 'charCounter ShortDescription normal';
    shortDescriptionCounterContainer.appendChild(shortDescriptionCounter);

    var shortDescriptionLabel = document.querySelector('label[for="description"]');
    shortDescriptionLabel.parentNode.insertBefore(shortDescriptionCounterContainer, shortDescriptionLabel.nextSibling);

    var shortDescriptionInputField = document.querySelector('textarea#description.shortTextarea');
    shortDescriptionInputField.className = 'normal';
    updateShortDescriptionCounter();
    shortDescriptionInputField.addEventListener('input', updateShortDescriptionCounter);

    function updateShortDescriptionCounter() {
        var textLength = shortDescriptionInputField.value.length;
        shortDescriptionCounter.textContent = textLength + '/160';
        if (textLength > 300) {
            shortDescriptionCounter.className = 'charCounter ShortDescription too-large';
            shortDescriptionInputField.className = 'too-large';
        } else {
            shortDescriptionCounter.className = 'charCounter ShortDescription normal';
            shortDescriptionInputField.className = 'normal';
        }
    }
})();
