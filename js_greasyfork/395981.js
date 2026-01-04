// ==UserScript==
// @name         Church Bingo
// @namespace    churchsocial.com
// @version      1.9
// @description  Add "Church Bingo" to the Members area of the Church Social site.
// @author       Anthony van Orizande
// @match        https://app.churchsocial.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395981/Church%20Bingo.user.js
// @updateURL https://update.greasyfork.org/scripts/395981/Church%20Bingo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Array to hold all family details..
    var families = [];

    // Create three groups to make the presented options more relevant.
    // Avoid the temptation to generate names at the risk of creating hurtful combinations (deceased child, lost member, etc...)
    // Also avoid the temptation to guess people's genders in order to split out the singleNames array into male and female...
    var singleNames = [];
    var coupleNames = [];
    var familyNames = [];

    // List of Families that have not submitted a picture.
    var noImagefamilies = [];

    var activeAnswers = []
    var activeEntryId = null;
    var correctAnswers = 0;
    var wrongAnswers = 0;

    var answerButtonsEls = null;
    var bingoMessageEl;
    var bingoStatsEl;

    // Completed EntryIds to make lookups quick.
    var completedEntries = {};

    var fnButtonMenu = function(id, caption) {
        return '<a id="'+id+'" class="ml-2 sm:ml-4 px-2 sm:px-3 py-2 rounded-md hover:bg-grey-200">'+caption+'</a>';
    };
    var fnButtonAnswer = function(id, caption) {
        return '<a id="'+id+'" style="width:100%;margin:4px;border-style:solid;border-color:transparent;border-width:5px" class="btn btn-teal mr-1 px-4 sm:px-6"><div style="text-align: left;" class="caption">'+caption+'</div></a>';
    };
    var fnButtonEnd = function(id, caption) {
        return '<a id="'+id+'" class="btn btn-teal mr-1 px-4 sm:px-6"><div class="flex items-center"><div class="caption">'+caption+'</div></div></a>';
    };

    var fnAddNamesFromList = function(listOutput, listOptions, count) {
        while (listOutput.length < count) {
            var nameOption = listOptions[Math.floor(Math.random() * listOptions.length)];
            if (listOutput.indexOf(nameOption) == -1) {
                listOutput.push(nameOption);
            }
        }
        return;
    };

    // For Future, Weighted Random: https://stackoverflow.com/questions/8435183/generate-a-weighted-random-number
    var fnLoadNextFamily = function () {
        // Now get a random family id and scan for the next family to test.
        // Purposely retest families that were gotten wrong.
        var totalEntries = families.length;
        var familyId = Math.floor(Math.random() * totalEntries);

        // Starting with the random familyId scan for the next incomplete entry.

        do {
            if (!completedEntries[familyId])
               break; // Found an incomplete entry.
            else if (Object.keys(completedEntries).length >= totalEntries)
                return null; // We are done
            // Look at the next entry.
            familyId++;
            if (familyId >= families.length)
                familyId = 0; // Start at the beginning.
        } while (true);

        // Now create the questions.
        var familyName = families[familyId].name;
        var imageSrc = (families[familyId].src||'') ; //.replace('crop=faces&fit=crop&fm=jpg&h=500&ixlib=php-1.2.1&q=95&trim=auto&w=500','crop=faces&fit=clip&fm=jpg&h=2000&ixlib=php-1.2.1&q=95&trim=auto&w=2000');

        // If no image found then skip this entry and look for another.
        if (!imageSrc) {
            completedEntries[familyId] = 'S';
            return fnLoadNextFamily();
        }

        // Create a list of choices...
        var choiceNames = [familyName]; /// Include the current name to avoid duplicates.
        if (familyName.indexOf(',') != -1) {
            fnAddNamesFromList(choiceNames, familyNames, 4);
        } else if (familyName.indexOf('&') != -1) {
            fnAddNamesFromList(choiceNames, coupleNames, 4);
        } else {
            fnAddNamesFromList(choiceNames, singleNames, 4);
        }
        choiceNames = fnShuffle(choiceNames);

        document.querySelector('#churchBingoMain img').setAttribute('src', imageSrc);

        for (var i = 0; i < choiceNames.length; i++) {
            document.querySelector('#btn' + i + ' div.caption').innerHTML = "<span style='display:inline-block;width:2em'>" + (i + 1) + ".</span>" + choiceNames[i];
        }

        activeAnswers = choiceNames;
        return activeEntryId = familyId;
    }

    var processingAnswer = false;
    var fnProcessAnswer = function (e) {
        e.preventDefault();

        // Block attempts to click a button while procesing the answer.
        if (processingAnswer)
            return;

        // Now block attempts to click on other answer buttons.
        processingAnswer = true;

        // User may not click where expected.
        var target = e.target.closest('a');
        var answerText = target.textContent;
        var correctText = families[activeEntryId].name;

        // Check the Answer
        var delay = 1000; // The default correct delay is 1 second.
        if (answerText.indexOf(correctText) > 0) {
            target.style.borderColor = "black";
            bingoMessageEl.style.display = 'block';
            correctAnswers++;
            completedEntries[activeEntryId] = 'C';
        }
        else
        {
            target.style.borderColor = "red";
            wrongAnswers++;
            // Highlight the correct answer.
            answerButtonsEls.forEach(function(e) {
                if (String(e.textContent).indexOf(correctText) > 0) {
                    e.style.borderColor = 'blue';
                }
            });
            delay = delay * 3;
        }

        var totalEntries = families.length;
        var remainingEntries = totalEntries - Object.keys(completedEntries).length;
        bingoStatsEl.innerHTML =
            '<style>table.bingoStats th {padding: 0 10px;text-align:right;}</style>'+
            '<table class="bingoStats">' +
            '<tr><th style="color:blue">Correct:</th><th style="color:blue">' + correctAnswers + '</th><th>Remaining:</th><th>' + remainingEntries + '</th></tr>' +
            '<tr><th style="color:red">Wrong:</th><th style="color:red">' + wrongAnswers + '</th><th>Total:</th><th>' + totalEntries + '</th></tr>' +
            '</table>';

        setTimeout(function() {
            answerButtonsEls.forEach(function(e) {
                e.style.borderColor = 'transparent';
            });
            bingoMessageEl.style.display = 'none';
            var nextId = fnLoadNextFamily();

            // Check if we are done....
            if (nextId == null) {
                bingoMessageEl.textConent = "DONE!";
                bingoMessageEl.style.display = 'block';
            }
            else
            {
                processingAnswer = false;
            }
        }, delay);
        return false;
    }

    var fnShuffle = function(array) {
        // https://stackoverflow.com/a/2450976
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }

    function fnCreateElementFromHTML(htmlString) {
        var div = document.createElement('div');
        div.innerHTML = htmlString.trim();

        // Change this to div.childNodes to support multiple top-level nodes.
        return div.firstChild;
    }

    var fnStartChurchBingo = function() {
        console.log('Loading Church Bingo: ' + families.length + ' families found.');
        var isfullScreen = confirm('Do you want to play fullscreen?\n\n  Click OK to play fullscreen. \n  Click Cancel to play normal.');

        console.log("ChurchBingo - Load Images");
        var content = fnGetContent();
        var familiesHtml = content.querySelectorAll('div.flex.flex-wrap>div.flex');

        // ==========================================================================
        // Extract all of the families and store some details..
        familiesHtml.forEach(function( value ) {

            var familyNameEls = value.querySelectorAll("div.text-center div");
            var familyMembers = [];
            familyNameEls.forEach(function(familyMember) {
                var member = familyMember.textContent.trim();
                if (member)
                    familyMembers.push(member);
            });

            var familyName = familyMembers.join(', ');
            var imageSrc = value.querySelector('img')?.getAttribute('src');
            // Verify that the image is meaningful
            if (!imageSrc) {
                noImagefamilies.push(familyName);
            }
            else {
            families.push({
                name: familyName,
                src: imageSrc
            });

            if (familyName.indexOf(',') != -1)
                familyNames.push(familyName);
            else if (familyName.indexOf('&') != -1)
                coupleNames.push(familyName);
            else
                singleNames.push(familyName);
}
        });

        console.log(noImagefamilies);
        // =========================================================================
        // Shuffle the option lists.
        singleNames = fnShuffle(singleNames);
        coupleNames = fnShuffle(coupleNames);
        familyNames = fnShuffle(familyNames);

        // =============================================================================
        // Generate the UI
        var gameContainer = isfullScreen ? document.querySelector('#app') : content;
        // Create the Buttons
        var buttons = [];
        buttons.push(fnButtonAnswer('btn0', ''));
        buttons.push(fnButtonAnswer('btn1', ''));
        buttons.push(fnButtonAnswer('btn2', ''));
        buttons.push(fnButtonAnswer('btn3', ''));
        var buttonsHtml = buttons.join('');
        var gameWidget = fnCreateElementFromHTML(
            '<div id="churchBingoMain">'
                + '<img style="width:50%; float:left;" src=""/>'
                + '<div class="options" style="float:right;width:50%;padding:20px">' + buttonsHtml + '</div>'
                + '<div style="float:right;width:50%;padding:20px;text-align:center">'
                      + '<div style="">'
                      + '<div id="bingoStats" style="font-size:1em;padding:20px">loading...</div>'
                      + '<div id="bingoMessage" style="font-size:3em; color:#51999e;display:none">BINGO!</div>'
                      + '</div></div>'
                + '<div class="churchBingoFooter">' + fnButtonEnd('btnEndGame', 'End Game') + "</div>"
            + '</div>'
        );
        gameContainer.before(gameWidget);

        answerButtonsEls = document.querySelectorAll("#churchBingoMain .options a");
        bingoMessageEl = document.querySelector("#bingoMessage");
        bingoStatsEl = document.querySelector("#bingoStats");
        bingoStatsEl.innerHTML = families.length + ' families loaded. <br/> ' + noImagefamilies.length + " families don't have a picture.";

        answerButtonsEls.forEach(function(button) {
            button.onclick = fnProcessAnswer;
        });
        document.querySelector('#btnEndGame').onclick = function(e) {e.preventDefault(); location.reload(); return false; };
        gameContainer.style.display = 'none';

        fnLoadNextFamily();
    };

    var fnGetContent = function() {
        return document.querySelector('section div.flex.flex-grow');
    }

    // Add the button to start Church Bingo at the top.
    // NOTE: Previously had setTimeout() but it did not capture screen changes, since the site URL can change without reload
    setInterval(function() {
        // Need to monitor for page changes and:
        // 1) Add the button if it is missing.
        // 2) Stop the game if it should not be running.

        var activeGame = document.getElementById('churchBingoMain');
        var startButton = document.getElementById('startChurchBingo');
        if (document.location.pathname != '/families')
        {
            if (!!activeGame) {
                // Stop the game if it should not be running.
                activeGame.parentNode.removeChild(activeGame);
            }
        }
        else if (!!startButton) {
            // Button Found - We are done.
            return;
        }
        console.log("ChurchBingo - Init");
        var content = fnGetContent();
        var mapButton = content.querySelector("a[href='/map']");
        mapButton.before(fnCreateElementFromHTML(fnButtonMenu('startChurchBingo', 'Church Bingo')));
        document.querySelector('#startChurchBingo').onclick = function(e) {e.preventDefault(); fnStartChurchBingo(); return false; };
    }, 1000);
})();