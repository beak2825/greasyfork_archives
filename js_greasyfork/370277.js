// ==UserScript==
// @name         Bunpro: Auto Commit 2.0
// @namespace    http://tampermonkey.net/
// @version      2.1.3
// @description  Automatically submits your answer once it's correct.
// @author       Kumirei
// @include      *bunpro.jp/*
// @exclude      *community.bunpro.jp*
// @require      https://greasyfork.org/scripts/370623-bunpro-helpful-events/code/Bunpro:%20Helpful%20Events.js?version=974369
// @require      https://greasyfork.org/scripts/370219-bunpro-buttons-bar/code/Bunpro:%20Buttons%20Bar.js?version=768992
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370277/Bunpro%3A%20Auto%20Commit%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/370277/Bunpro%3A%20Auto%20Commit%2020.meta.js
// ==/UserScript==

(function() {
    var $ = window.$;

    // ---------------------------------------------------------------SETTINGS--------------------------------------------------------------- //

    var settings = {
        bugReporting: false,     // Get alerts when the script can't find the answer
        indicator: true,         // Add an indicator for whether an answer was found to the stats bar
        prints: false            // Print helpful debug information in the console
    };

    // -----------------------------------------------------------------MAIN----------------------------------------------------------------- //

    // Global variable
    var autocommit = {
        answer: "",
        on: true,
        id: 0,
        sentence: ""
    };

    // Update when a new item is loaded
    $('html')[0].addEventListener('new-review-item', function() {
        // Initialize if first item
        if (!$('#AutoCommit').length) initialise();

        // Reset
        autocommit.answer = "";
        updateIndicator();
        autocommit.id = findID();

        // Find the answer by matching the question to the example sentences
        matchExamples(parse);
        if (autocommit.answer == "") matchExamples((e)=>{return parse(e).replace(/です/g, "");}); // Try removing formalities if no answer was found
        if (autocommit.answer == "" && settings.bugReporting) alertNoAnswer();
        else updateIndicator();
        if (settings.prints) console.log(autocommit.id, 'Answer:', autocommit.answer);
    });

    // Set up the page for continued running
    function initialise() {
        addButton();
        addEventlistener();
        if (settings.indicator) addIndicator();
    }

    // Adds the on/off button to the buttons bar
    function addButton() {
        autocommit.on = (localStorage.getItem('BPautoCommit') == "false" ? false : true);
        buttonsBar.addButton('AutoCommit', 'Auto Commit ' + (autocommit.on == true ? "ON" : "OFF"), toggleAutoCommit);
    }

    // Add event listener that matches the answer to the input when the input changes
    function addEventlistener() {
        $('#study-answer-input').on('keyup', function(e) {
            if (autocommit.on) {
                var currentInput = $('#study-answer-input')[0].value;
                if (currentInput == autocommit.answer) {
                    $('#submit-study-answer').click();
                }
            }
        });
    }

    // Adds a red/green cirle which indicates whether the answer has been found
    function addIndicator() {
        $('.in-review-stats').append('<div id="autocommit-indicator" class="review__stats" title="Indicator for whether Autocommit has found an answer for this question"></div>');
        $('head').append('<style id="AutocommitCSS">'+
                         '    :root {--autocommit-indicator: red;}'+
                         '    #autocommit-indicator {'+
                         '        height: 15px;'+
                         '        width: 15px;'+
                         '        background-color: var(--autocommit-indicator);'+
                         '        border-radius: 50%;'+
                         '        margin: 13px 5px;'+
                         '    }'+
                         '</style>');
    }

    // Updates the indicator color depending on whether there is an answer
    function updateIndicator() {
        if (settings.indicator) {
            var newColor = (autocommit.answer == "" ? "red" : "green");
            if (!autocommit.on) newColor = "red";
            $('html')[0].style.setProperty('--autocommit-indicator', newColor);
        }
    }

    // Finds and returns the ID for the grammar point
    function findID() {
        return $('.level_lesson_info > a')[0].href.split("grammar_points/")[1];
    }

    // Matches the study question with the example sentences to find the answer
    function matchExamples(parser) {
        var questionElem = $('.study-question-japanese > div')[0];
        var sentence = parser(questionElem); // Study question with .* where the input should be
        autocommit.sentence = sentence;
        var examples = $('.examples .japanese-example-sentence');
        autocommit.answer = "";
        examples.each(function(i, e) {
            var example = parser(e);
            if (example.match(sentence) != null) {
                var startIndex = sentence.match(/\./).index;
                var sentenceEnd = sentence.slice(startIndex+2)+'$';
                var endIndex = example.match(sentenceEnd).index;
                autocommit.answer = example.slice(startIndex, endIndex); // Crop out the answer
                if (settings.prints) console.log(i, example);
            }
        });
    }

    // Parses the sentence then cleans it by removing punctuation and stuff. Add .* for study question input
    function parse(elem) {
        var text = parseSentence(elem);
        text = text.replace(/___/g, '.*').replace(/\[.*\]$/g, '').replace(/[、。\(\)\s\[\]]/g, '');
        return text;
    }

    // Extracts the sentence in kana from the sentence elements
    function parseSentence(sentenceElem) {
        var text = "";
        sentenceElem.childNodes.forEach((elem)=>{
            //console.log(elem.className==""?undefined:elem.className, elem.nodeName, elem.textContent);
            if (elem.className == "study-area-input") text += "___"; // Underscores to indicate input
            else if (elem.nodeName == "STRONG" || elem.nodeName == "SPAN"|| elem.nodeName == "chui") text += parseSentence(elem); // Need to go deeper for these
            else if (!elem.textContent.includes('（')) text += elem.textContent; // If no furigana is included, just grab the text
            else text += elem.textContent.split('（')[1].replace('）', ''); // Else grab the furigana?
        });
        return text;
    }

    // Alerts the user with info regarding why no answer was found
    function alertNoAnswer(id) {
        var examples = '';
        $('.examples .japanese-example-sentence').each(function(i, e) {examples += 'Example: ' + parse(e) +'\n';});
        var text = 'Bunpro: Autocommit could not find the answer to this question.'+
            '\nCopy the following and sent it to Kumi on the Bunpro forums.'+
            '\n\nIf you don\'t want to receive these bug alerts anymore, disable them by setting bugReporting = false at the top of the script.\n'+
            '\nGrammar ID: ' + autocommit.id +
            '\nSentence: ' + autocommit.sentence +
            '\n' + examples;
        alert(text);
        if (settings.prints) console.log(text);
    }

    // Toggles the running state of the script
    var toggleAutoCommit = function() {
        autocommit.on = !autocommit.on;
        var name = "Auto Commit " + (autocommit.on == true ? "ON" : "OFF");
        $('#AutoCommit')[0].value = name;
        updateIndicator();
    };
})();
