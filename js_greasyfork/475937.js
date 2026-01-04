// ==UserScript==
// @name         BangingMyHeadAgainstAConcreteWall
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Unscramble words and lookup answers script with a dash of aids and no sleep
// @match        https://www.kidschat.net/kidschat/
// @grant        0sen
// @license    0sen.senno
// @downloadURL https://update.greasyfork.org/scripts/475937/BangingMyHeadAgainstAConcreteWall.user.js
// @updateURL https://update.greasyfork.org/scripts/475937/BangingMyHeadAgainstAConcreteWall.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var questionsUrl = 'https://raw.githubusercontent.com/0senno/sudo/main/TheArchive';
    var scramblesUrl = 'https://raw.githubusercontent.com/0senno/sudo/main/README.md';
    var miniWindowDiv = createMiniWindowDiv();
    var inputField = createInputField();
    var resultsDiv = createResultsDiv();

    miniWindowDiv.appendChild(inputField);
    miniWindowDiv.appendChild(resultsDiv);
    document.body.appendChild(miniWindowDiv);

    var questionsList = [];
    var scramblesList = [];

    function createMiniWindowDiv() {
        var miniWindowDiv = document.createElement('div');
        miniWindowDiv.id = 'unscramble-mini-window';
        miniWindowDiv.style.position = 'fixed';
        miniWindowDiv.style.top = '10px';
        miniWindowDiv.style.right = '10px';
        miniWindowDiv.style.width = '300px';
        miniWindowDiv.style.height = 'auto';
        miniWindowDiv.style.background = '#36393F';
        miniWindowDiv.style.border = '1px solid #202225';
        miniWindowDiv.style.padding = '10px';
        miniWindowDiv.style.fontFamily = 'Arial, sans-serif';
        miniWindowDiv.style.color = '#FFFFFF';
        miniWindowDiv.style.borderRadius = '4px';
        miniWindowDiv.style.cursor = 'move';

        var offsetX, offsetY;

        miniWindowDiv.addEventListener('mousedown', function(event) {
            if (event.button === 0) {
                offsetX = event.clientX - miniWindowDiv.getBoundingClientRect().left;
                offsetY = event.clientY - miniWindowDiv.getBoundingClientRect().top;
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            }
        });

        function onMouseMove(event) {
            miniWindowDiv.style.left = (event.clientX - offsetX) + 'px';
            miniWindowDiv.style.top = (event.clientY - offsetY) + 'px';
        }

        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        return miniWindowDiv;
    }

    function createInputField() {
        var inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.placeholder = 'Enter question for 0sen to do';
        inputField.style.width = '100%';
        inputField.style.marginBottom = '10px';
        inputField.style.background = 'rgba(32, 34, 37, 0.7)';
        inputField.style.color = '#FFFFFF';
        inputField.style.border = 'none';
        inputField.style.borderRadius = '4px';
        inputField.style.padding = '8px';

        return inputField;
    }

    function createResultsDiv() {
        var resultsDiv = document.createElement('div');
        resultsDiv.style.wordBreak = 'break-all';
        return resultsDiv;
    }

    function loadWordList(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var wordList = xhr.responseText.split('\n');
                callback(wordList);
            }
        };
        xhr.send();
    }

    function findAnswer(query, wordList) {
        for (var i = 0; i < wordList.length; i++) {
            if (wordList[i].toLowerCase().includes(query.toLowerCase())) {
                return wordList[i];
            }
        }
        return null;
    }

    function findUnscrambledWord(scrambledWord, wordList) {
        var sortedScrambled = sortString(scrambledWord);
        for (var i = 0; i < wordList.length; i++) {
            if (sortedScrambled === sortString(wordList[i])) {
                return wordList[i];
            }
        }
        return null;
    }

    function sortString(str) {
        return str.split('').sort().join('');
    }

    function copyToClipboard(text, callback) {
        var textField = document.createElement('textarea');
        textField.value = text;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand('copy');
        textField.remove();
        if (typeof callback === 'function') {
            callback();
        }
    }

    function processInput() {
        var input = inputField.value.trim();
        if (input.length > 1) {
            var unscrambledWord = findUnscrambledWord(input, scramblesList);
            if (unscrambledWord) {
                var fullAnswer = 'The answer is ' + unscrambledWord + ' that I did.';
                resultsDiv.innerText = unscrambledWord;
                copyToClipboard(fullAnswer, function() {
                    inputField.value = '';
                });
            } else {
                var answer = findAnswer(input, questionsList);
                if (answer) {
                    var fullAnswer = 'The answer is ' + answer + ' that I did.';
                    copyToClipboard(fullAnswer, function() {
                        resultsDiv.innerText = 'Copied: ' + answer;
                        inputField.value = '';
                    });
                } else {
                    resultsDiv.innerText = 'No matching answer or unscrambled word found in 0sens elephant genes';
                }
            }
        } else {
            var answer = findAnswer(input, questionsList);
            if (answer) {
                var fullAnswer = 'The answer is ' + answer + ' that 0sen was forced to do;c(ps:HELP ME-0SEN.';
                copyToClipboard(fullAnswer, function() {
                    resultsDiv.innerText = 'Copied: made by 0sen' + answer;
                    inputField.value = '';
                });
            } else {
                resultsDiv.innerText = 'No matching answer found.';
            }
        }
    }

    loadWordList(questionsUrl, function(questions) {
        questionsList = questions;
        loadWordList(scramblesUrl, function(scrambles) {
            scramblesList = scrambles;
            inputField.addEventListener('input', processInput);
        });
    });

})();
