// ==UserScript==
// @name         Quia Script
// @namespace    http://tampermonkey.net/
// @version      1.0.11
// @description  Assists you in Quia quizzes
// @author       Alex Pristawa
// @match        https://www.quia.com/quiz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=quia.com
// @grant        GM_getResourceText
// @resource     DictionarySE https://raw.githubusercontent.com/mananoreboton/en-es-en-Dic/master/src/main/resources/dic/es-en.xml
// @resource     DictionaryES https://raw.githubusercontent.com/mananoreboton/en-es-en-Dic/master/src/main/resources/dic/en-es.xml
// @noframes

// @downloadURL https://update.greasyfork.org/scripts/488381/Quia%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/488381/Quia%20Script.meta.js
// ==/UserScript==
(function() {
    'use strict';

    let windowWasLoaded = false;

    //Regular calls but in a function so it can be at the beginning
    let runScriptFromEnd = () => {

        window.addEventListener('load', scriptFunction);

        setTimeout(() => {
            if(!windowWasLoaded) {
                scriptFunction();
            }
        }, 2000);
    }

    let scriptFunction = () => {
        windowWasLoaded = true;
        window.removeEventListener('load', scriptFunction);

        //If a certain condition is not met, these become false
        let abilities = {
            translateText: true,
            translateInput: true,
            enterNextQuestion: true,
            quickDropdown: true,
            arrowForQuestion: true,
            goBackIfWrong: true,
            autoSubmit: true,
            needsAutoFill: true
        }

        console.log("Script loaded!");

        if(!['true', 'false'].includes(localStorage.autoFill)) {
            localStorage.autoFill = "false";
        }

        if(localStorage.savedAnswers == undefined) {
            localStorage.savedAnswers = JSON.stringify({});
        }

        let fromSubmitButton = false;

        //Gets the text from the dictionary
        let parser = new DOMParser();
        let wordObj = {
            SE: parser.parseFromString(GM_getResourceText("DictionarySE"), "text/xml").getElementsByTagName("w"),
            ES: parser.parseFromString(GM_getResourceText("DictionaryES"), "text/xml").getElementsByTagName("w")
        };

        //You can't translate if the xml request doesn't work
        if(wordObj.SE.length < 2) {
            abilities.translateText = false;
        }
        if(wordObj.ES.length < 2) {
            abilities.translateInput = false;
        }
        //Element list for future reference
        let elements = {
            submit: document.querySelector('input[value="Submit answer"]'),
            go: document.querySelector('input[value="Go"]'),
            questionDropdown: document.querySelector('select[name="tag_goto_question_number"]')
        };

        //If there is no question dropdown (usually for a one-page test), question-navigating functions are not allowed
        if(elements.questionDropdown == null) {
            abilities.enterNextQuestion = false;
            abilities.quickDropdown = false;
            abilities.leffArrForQuestion = false;
        }

        if(elements.submit == null) {
            abilities.goBackIfWrong = false;
        }

        if(document.querySelectorAll('input').length <= 2) {
            abilities.autoSubmit = false;
        }

        //Selectors to access arrays of objects
        let selectors = {
            question: 'td.quia_standard > ol > li',
            questionWord: 'td.quia_standard > ol > li > span.spansForTranslation'
        };

        //Makes all text user-selectable
        document.body.style.webkitUserSelect = 'text'; // For Safari and Chrome
        document.body.style.mozUserSelect = 'text'; // For Firefox
        document.body.style.msUserSelect = 'text'; // For IE 10 and 11
        document.body.style.userSelect = 'text'; // Standard syntax

        //Focuses on the last textbox on the page
        {
            let lastInput = document.querySelectorAll('input[type="text"]');
            let arr = [];
            if(lastInput.length > 2) {
                arr = [...lastInput];
            } else {
                arr = [lastInput[lastInput.length-1]];
            }

            arr.forEach(input => {
                let div = document.createElement('div');
                div.classList.add('fillInAnswer');
                div.style.height = '15px';
                div.style.width = '15px';
                div.style.marginBottom = '-4px';
                div.style.marginLeft = '3px';
                div.style.border = '1px solid gray';
                div.style.display = 'inline-block';
                div.style.position = 'relative';
                div.style.cursor = 'pointer';
                if (input) {
                    let firstDiv = document.createElement('div');
                    firstDiv.style.position = 'absolute';
                    firstDiv.style.height = '6px';
                    firstDiv.style.width = '6px';
                    firstDiv.style.borderRadius = '1px';
                    firstDiv.style.border = '1px solid gray';
                    firstDiv.style.top = '2px';
                    firstDiv.style.left = '2px';
                    div.appendChild(firstDiv);

                    let secondDiv = document.createElement('div');
                    secondDiv.style.position = 'absolute';
                    secondDiv.style.height = '6px';
                    secondDiv.style.width = '6px';
                    firstDiv.style.borderRadius = '1px';
                    secondDiv.style.border = '1px solid gray';
                    secondDiv.style.bottom = '2px';
                    secondDiv.style.right = '2px';
                    div.appendChild(secondDiv);

                    input.after(div);
                    input.selectionStart = input.selectionEnd = input.value.length;
                    input.focus();

                    div.addEventListener('click', () => {
                        if(div.dataset.fakeClick != "true") {
                            let elements = document.querySelectorAll('.fillInAnswer');
                            if(elements.length > 2) {
                                elements.forEach(element => {
                                    if(element.dataset.fakeClick != "true") {
                                        element.dataset.fakeClick = "true";
                                        element.click();
                                        element.dataset.fakeClick = "false";
                                    }
                                });
                            } else {
                                setAnswer(input);
                            }
                        } else {
                            setAnswer(input);
                        }
                    });
                }
            });
        }

        let submitButtonAutoFill;
        if(elements.submit) {
            submitButtonAutoFill = () => {
                if(localStorage.autoFill == "true" && abilities.needsAutoFill) {
                    getClipboardToAdd();
                }
            }
            elements.submit.addEventListener('click', () => {fromSubmitButton = true;}, true);

            let parent = document.getElementById('quiaBlueTopNav');
            let div = document.createElement('a');
            div.classList.add('bannerlink');
            div.classList.add('bannerlinkbutton');
            div.style.cursor = 'pointer';
            div.style.marginLeft = '50px';
            let obj = {
                "false": "off",
                "true": "on"
            };
            div.innerHTML = `Copy every question: ${obj[localStorage.autoFill]}`;
            parent.appendChild(div);

            div.addEventListener('click', () => {
                if(localStorage.autoFill == "false") {
                    localStorage.autoFill = 'true';
                    localStorage.savedAnswers = JSON.stringify({});
                } else {
                    localStorage.autoFill = 'false';
                }
                div.innerHTML = `Copy every question: ${obj[localStorage.autoFill]}`;
            });
        }

        window.addEventListener('beforeunload', (event) => {
            if(submitButtonAutoFill != undefined && fromSubmitButton) {
                submitButtonAutoFill();
            }
            fromSubmitButton = false;
        });

        let getClipboardToAdd = async function() {
            let text;
            if (navigator.clipboard) {
                try {
                    text = await navigator.clipboard.readText();
                } catch (err) {
                    console.error('Failed to read clipboard contents:', err);
                    return; // Or handle the error as appropriate for your application
                }
            } else {
                console.error('Clipboard API not available.');
                return;
            }
            if(text == '') {
                text = {};
            } else {
                try {
                    text = JSON.parse(text);
                    if(typeof text != "object") {
                        text = {};
                    }
                } catch {
                    text = {};
                }
            }
            let lastTextbox = document.querySelectorAll('input[type="text"]');
            lastTextbox = lastTextbox[lastTextbox.length-1];
            let question = document.querySelectorAll('table > tbody > tr > td.quia_standard > ol > li');
            question = question[question.length-1];
            question = question.textContent;
            text[question] = lastTextbox.value;
            text = JSON.stringify(text);

            navigator.clipboard.writeText(text).then(() => {
                abilities.needsAutoFill = false;
                elements.submit.click();
            }).catch(err => {
                abilities.needsAutoFill = false;
                console.log('Error in exporting!');
            });
            let firstObj = JSON.parse(localStorage.savedAnswers);
            firstObj[question] = lastTextbox.value;
            localStorage.savedAnswers = JSON.stringify(firstObj);
        }

        //If the previous question was answered incorrectly, it goes back to the previous question
        if(abilities.goBackIfWrong) {
            let arr = document.querySelectorAll('table > tbody > tr > td > b > font');
            arr.forEach(element => {
                if(element.innerHTML == "Incorrect.") {
                    if(elements.questionDropdown.selectedIndex > 0) {
                        if(elements.questionDropdown && elements.go) {
                            elements.questionDropdown.selectedIndex--;
                            elements.go.click();
                        }
                    }
                }
            });
        }

        async function setAnswer(textbox) {
            let obj;
            if (navigator.clipboard) {
                try {
                    const text = await navigator.clipboard.readText();
                    obj = JSON.parse(text);
                } catch (err) {
                    console.error('Failed to read clipboard contents:', err);
                    return; // Or handle the error as appropriate for your application
                }
            } else {
                console.error('Clipboard API not available.');
                return;
            }
            let question = textbox.parentNode.textContent;
            question = question.replace(/[\n\s]/g, "").split("");
            let arr = Object.keys(obj);
            const uneditedArr = [...arr];
            arr = arr.map(element => element.replace(/[\n\s]/g, "").split(""));
            for(let i = 0; arr.length > 1; i++) {
                for(let j = 0; j < arr.length; j++) {
                    if(arr[j][i] != question[i]) {
                        arr.splice(j, 1);
                        uneditedArr.splice(j, 1);
                        j--;
                    }
                }
            }
            let correct = uneditedArr[0];
            textbox.value = obj[correct];
            if(!['undefined', undefined].includes(obj[correct])) {
                if(abilities.autoSubmit) {
                    elements.submit.click();
                }
            }
        }

        //If you are on the summary page
        if(document.querySelectorAll('table#quiz-summary').length > 0) {
            let parent = document.getElementById('quiaBlueTopNav');
            let div = document.createElement('a');
            div.classList.add('bannerlink');
            div.classList.add('bannerlinkbutton');
            div.style.cursor = 'pointer';
            div.style.marginLeft = '50px';
            div.innerHTML = 'Export answers';
            parent.appendChild(div);

            div.addEventListener('click', () => {
                let textToCopy = JSON.stringify(getSummaryObj());
                navigator.clipboard.writeText(textToCopy).then(() => {
                    div.innerHTML = 'Answers exported!';
                }).catch(err => {
                    div.innerHTML = 'Error in exporting!';
                });
                let mouseoutHandler = () => {
                    div.innerHTML = "Export answers";
                    div.removeEventListener('mouseout', mouseoutHandler);
                }
                div.addEventListener('mouseout', mouseoutHandler);
            });
        }

        /**
       Gets the answer object from the summary page and copies it to clipboard
    */
        let getSummaryObj = () => {
            let elements = document.querySelectorAll('table > tbody > tr > td > ol > li > div > b');

            let obj = {};
            elements.forEach(element => {
                if(element.textContent == "The following answer is acceptable:") {
                    obj[element.parentNode.querySelector('span.quia_standard').textContent] = element.parentNode.querySelector('span.fians').textContent;
                } else if(element.textContent == "The following answers are acceptable:") {
                    obj[element.parentNode.querySelector('span.quia_standard').textContent] = element.parentNode.querySelector('span.fians').textContent;
                }
            });

            return obj;
        }

        /*
        Keydown function
    */
        let alexKeydownFunction = (event) => {

            //Stops on first keypress
            if(abilities.arrowForQuestion) {
                abilities.arrowForQuestion = false;
                //Left arrow goes back
                if(event.key == 'ArrowLeft' && elements.questionDropdown.selectedIndex > 0) {
                    elements.questionDropdown.selectedIndex--;
                    elements.go.click();
                }

                //Right arrow goes forward
                if(event.key == 'ArrowRight' && elements.questionDropdown.selectedIndex < elements.questionDropdown.querySelectorAll('option').length-1) {
                    elements.questionDropdown.selectedIndex++;
                    elements.go.click();
                }
            }

            //Inside a textarea
            if(event.target.tagName == 'TEXTAREA' || event.target.matches('input[type="text"]')) {

                //Enter key without shift inside a textarea
                if(event.key == 'Enter' && !event.shiftKey && !(event.metaKey || event.ctrlKey)) {
                    if(abilities.enterNextQuestion && abilities.autoSubmit) {
                        elements.submit.click();
                    }

                    //Enter key with a meta/control click but not a shift click
                } else if(event.key == "Enter" && (event.metaKey || event.ctrlKey) && !event.shiftKey) {
                    if(abilities.translateInput) {
                        event.preventDefault();

                        //Finds translation for current word
                        let arr = linearSearchForWord(wordObj.ES, getCurrentWordFromCaret(event));
                        replaceCurrentWord(event, arr[0]);

                        //Allows you to cycle between words
                        let i = 0;
                        let keydownHandler = (e) => {

                            //If it isn't an exception, it makes it so you can't keep changing it
                            if(!['Shift', 'Meta', 'Alt', 'CapsLock', 'Control', 'Fn', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                                document.removeEventListener('keydown', keydownHandler);
                                e.target.removeEventListener('blur', blurHandler);
                            }
                            if(e.key == 'ArrowUp') {
                                e.preventDefault();
                                i++;
                                if(i >= arr.length) {
                                    i = 0;
                                }
                                replaceCurrentWord(event, arr[i]);
                            }
                            if(e.key == 'ArrowDown') {
                                e.preventDefault();
                                i--;
                                if(i < 0) {
                                    i = arr.length-1;
                                }
                                replaceCurrentWord(event, arr[i]);
                            }
                        }

                        let blurHandler = () => {
                            document.removeEventListener('keydown', keydownHandler);
                            event.target.removeEventListener('blur', blurHandler);
                        }
                        document.addEventListener('keydown', keydownHandler);
                        event.target.addEventListener('blur', blurHandler);
                    }
                }
            }
        }

        /*
        Mousemove function used for when a mouse hovers over a word
    */
        let alexMousemoveFunction = (event) => {
            if(event.target.matches(selectors.questionWord) && !(event.metaKey || event.ctrlKey)) {
                if(abilities.translateText) {
                    if(event.target.innerHTML == event.target.dataset.original) {

                        let allWords = JSON.parse(event.target.dataset.translation);
                        event.target.innerHTML = allWords[parseInt(event.target.dataset.i)];
                        event.target.style.color = 'rgb(150, 20, 20)';

                        let mouseoutHandler = () => {
                            event.target.innerHTML = event.target.dataset.original;
                            event.target.style.color = 'black';
                            event.target.removeEventListener("mouseout", mouseoutHandler);
                        }
                        event.target.addEventListener("mouseout", mouseoutHandler);
                    }
                }
            }
        }

        /*
        Click function used for when a user clicks on a word to change translations
    */
        let alexClickFunction = (event) => {

            //If you clicked on a word
            if(event.target.matches(selectors.questionWord)) {
                if(abilities.translateText) {
                    event.target.dataset.i = parseInt(event.target.dataset.i)+1;
                    if(parseInt(event.target.dataset.i) >= parseInt(event.target.dataset.length)) {
                        event.target.dataset.i = 0;
                    }
                    event.target.innerHTML = JSON.parse(event.target.dataset.translation)[parseInt(event.target.dataset.i)];
                }
            }
        }

        function binarySearchForWord(words, searchWord) {
            let left = 0;
            let right = words.length - 1;

            let results = [];

            while (left <= right) {
                let mid = Math.floor((left + right) / 2);
                let midWord = words.item(mid).getElementsByTagName('c')[0].textContent;

                if (midWord < searchWord) {
                    left = mid + 1;
                } else if (midWord > searchWord) {
                    right = mid - 1;
                } else {
                    // Found a match, collect all possible translations for the searchWord
                    results.push(words.item(mid).getElementsByTagName('d')[0].textContent);

                    // Check for multiple translations by looking at neighboring elements
                    let i = mid - 1;
                    while (i >= left && words.item(i).getElementsByTagName('c')[0].textContent === searchWord) {
                        results.push(words.item(i).getElementsByTagName('d')[0].textContent);
                        i--;
                    }

                    i = mid + 1;
                    while (i <= right && words.item(i).getElementsByTagName('c')[0].textContent === searchWord) {
                        results.push(words.item(i).getElementsByTagName('d')[0].textContent);
                        i++;
                    }

                    break; // Break the loop after finding all matches
                }
            }

            if(results.length == 0) {
                results = linearSearchForWord(words, searchWord);
            }
            return results;
        }

        function linearSearchForWord(words, searchWord) {
            searchWord = searchWord.toLowerCase(); // Normalize case for comparison
            let results = [];

            // Iterate through all 'w' elements
            for (let i = 0; i < words.length; i++) {
                let wordElement = words.item(i);
                let cElementText = wordElement.getElementsByTagName('c')[0].textContent.toLowerCase(); // Normalize case

                if (cElementText === searchWord) {
                    // If a match is found, add its translation(s) to the results array
                    results.push(wordElement.getElementsByTagName('d')[0].textContent);

                    // Check for additional translations in preceding elements
                    let j = i - 1;
                    while (j >= 0 && words.item(j).getElementsByTagName('c')[0].textContent.toLowerCase() === searchWord) {
                        results.unshift(words.item(j).getElementsByTagName('d')[0].textContent); // Add to the start of results
                        j--;
                    }

                    // Check for additional translations in succeeding elements
                    let k = i + 1;
                    while (k < words.length && words.item(k).getElementsByTagName('c')[0].textContent.toLowerCase() === searchWord) {
                        results.push(words.item(k).getElementsByTagName('d')[0].textContent); // Add to the end of results
                        k++;
                    }

                    break; // Break the loop after finding and adding all matches
                }
            }

            return results;
        }

        function replaceCurrentWord(event, newWord) {
            // Ensure the target is a textarea or a text input
            if(newWord == undefined) {
                newWord = "Error!";
            }
            if (event.target.tagName === 'TEXTAREA' || (event.target.tagName === 'INPUT' && event.target.type === 'text')) {
                const input = event.target;
                const startPos = input.selectionStart;
                const endPos = input.selectionEnd;
                const text = input.value;
                let before = text.substring(0, startPos);
                let after = text.substring(endPos);

                // Find the start of the current word
                const wordStart = before.lastIndexOf(' ') + 1;
                // Find the end of the current word
                const wordEnd = after.indexOf(' ');
                const beforeWord = before.substring(0, wordStart);
                const afterWord = wordEnd === -1 ? after : after.substring(wordEnd);

                // Replace the current word with newWord and update the input value
                input.value = beforeWord + newWord + afterWord;

                // Set the caret position to the end of the new word
                const newPos = beforeWord.length + newWord.length;
                input.setSelectionRange(newPos, newPos);
            }
        }

        function getCurrentWordFromCaret(event) {
            if (!event.target.value) return ""; // Early exit if there's no value

            const text = event.target.value;
            let caretPos = event.target.selectionStart;
            let start = caretPos;
            let end = caretPos;

            // Find the start of the current word
            while (start > 0 && text[start - 1] !== ' ') {
                start--;
            }

            // Find the end of the current word
            while (end < text.length && text[end] !== ' ') {
                end++;
            }

            // Extract the word
            const currentWord = text.substring(start, end);

            return currentWord;
        }

        async function addTranslationToDataset(element) {
            let word = element.innerHTML;

            element.dataset.original = word;

            // Use a regular expression to replace non-letter characters
            // \p{L} matches any kind of letter from any language
            // \p{M} matches a character intended to be combined with another character (e.g., accents)
            // g flag for global search and replace
            word = word.replace(/[^\p{L}\p{M}]/gu, '');

            element.dataset.translation = JSON.stringify(binarySearchForWord(wordObj.SE, word.toLowerCase()));
            if(JSON.parse(element.dataset.translation).length == 0) {
                element.dataset.translation = JSON.stringify(["Error!"]);
            }

            element.dataset.i = 0;
            element.dataset.length = JSON.parse(element.dataset.translation).length;
        }

        function wrapTextNodesWithSpan(selector) {
            document.querySelectorAll(selector).forEach(element => {
                // Iterate over child nodes to find text nodes
                Array.from(element.childNodes).forEach(child => {
                    if (child.nodeType === Node.TEXT_NODE && child.textContent.trim().length > 0) {
                        // Split text content into words and wrap each with a <span>
                        const spanWrappedWords = child.textContent.trim().split(/\s+/).map(word => `<span class = 'spansForTranslation'>${word}</span>`).join(' ');
                        const spanElement = document.createElement('div'); // Using a div to temporarily hold HTML
                        spanElement.innerHTML = spanWrappedWords;
                        Array.from(spanElement.childNodes).forEach(spanChild => {
                            element.insertBefore(spanChild, child);
                        });
                    }
                });
                // Remove the original text nodes
                Array.from(element.childNodes).forEach(child => {
                    if (child.nodeType === Node.TEXT_NODE && child.textContent.trim().length > 0) {
                        child.remove();
                    }
                });
            });

            //Adds translations to each span object
            document.querySelectorAll(selectors.questionWord).forEach(element => {
                addTranslationToDataset(element);
            });
        }

        //Wraps all words with a span
        if(abilities.translateText) {
            wrapTextNodesWithSpan(selectors.question);
        }

        document.addEventListener('mousemove', alexMousemoveFunction);
        document.addEventListener('keydown', alexKeydownFunction);
        document.addEventListener('click', alexClickFunction);
        if(abilities.quickDropdown) {
            elements.questionDropdown.addEventListener('change', () => {
                setTimeout(() => {
                    elements.go.click();
                });
            });
        }
    }

    runScriptFromEnd();
})();