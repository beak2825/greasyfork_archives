// ==UserScript==
// @name         okcupid profile filter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  do you hate bullshit profiles?
// @author       hacksoi
// @match        https://www.okcupid.com/match
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/373102/okcupid%20profile%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/373102/okcupid%20profile%20filter.meta.js
// ==/UserScript==

var MINIMUM_NUMBER_OF_WORDS = 100;
var ANNOYING_WORDS = ["Queer", "Trans Woman", "Transfeminine", "Transgender", "Transsexual", "Gender Nonconforming", "Genderqueer", "Seeing Someone", "Pansexual", "Sapiosexual", "Demisexual", "Gender Nonconforming", "Questioning", "Asexual", "Heteroflexible", "Gay", "Sapiosexual", "Lesbian", "Bisexual", "Heteroflexible", "Homoflexible"];

// thank you https://www.mediacollege.com/internet/javascript/text/count-words.html
function countWords(str) {
	str = str.replace(/(^\s*)|(\s*$)/gi,"");
	str = str.replace(/[ ]{2,}/gi," ");
	str = str.replace(/\n /,"\n");
    var result = str.split(' ').length;
    return result;
}

// add to end, remove from front
var windowsToClose = [];

function closeOldestWindow() {
    var oldestWindow = windowsToClose.shift();
    oldestWindow.close();
}

function checkNotEnoughWords(profileWindow)
{
    var totalNumWords = 0;
    $('.profile-essay-contents', profileWindow.document).each(function(index, essay) {
        var text = essay.innerText;
        var numWords = countWords(text);
        totalNumWords += numWords;
    });
    console.log("totalNumWords: " + totalNumWords);
    var result = totalNumWords < MINIMUM_NUMBER_OF_WORDS;
    if (result)
    {
        console.log("not enough words, bitch!");
    }
    return result;
 }

function checkUsesAnnoyingWords(profileWindow)
{
    var profileDetailsBasics = $('.matchprofile-details-section--basics', profileWindow.document);
    var profileDetailsBasicsTextObj = profileDetailsBasics.find('.matchprofile-details-text');
    var BasicsText = profileDetailsBasicsTextObj.text();
    var CSV = BasicsText.split(",");
    for (var i = 0; i < CSV.length; i++)
    {
        CSV[i] = CSV[i].trim();
    }

    for (i = 0; i < CSV.length; i++)
    {
        for (var j = 0; j < ANNOYING_WORDS.length; j++)
        {
            if (CSV[i] == ANNOYING_WORDS[j])
            {
                console.log("this dumb bitch used an annoying word: " + CSV[i]);
                return true;
            }
        }
    }
    return false;
}

function processMatchCard(matchCard)
{
    var profileLinkPath = matchCard.attr("href");
    var profileLink = "https://okcupid.com" + profileLinkPath;
    var profileWindow = window.open(profileLink);
    console.log("opened profile: " + profileLink);
    console.log("profileWindow: " + profileWindow);
    $(profileWindow).load(function() {
        console.log("profileWindow loaded");

        var notEnoughWords = checkNotEnoughWords(profileWindow);
        var usesAnnoyingWords = checkUsesAnnoyingWords(profileWindow);

        if (notEnoughWords || usesAnnoyingWords) {
            var passDatAssButton = $("#pass-button.profile-buttons-actions-action", profileWindow.document);
            passDatAssButton.click();

            // close window. need a delay cause can't close window too quickly after click() for some reason.
            windowsToClose.push(profileWindow);
            setTimeout(closeOldestWindow, 100);
        }
        else {
            console.log("huzzah! you pass!");
        }
    });
}

function filterMatches() {
    // loop through each match result
    var matchCards = $('.match-results-card');
    matchCards.each(function(index, profile) {
        processMatchCard($(this));
    });
    //processMatchCard($(matchCards[0]));
}

$(document).ready(function() {
    var filterMatchesButton = $('<button/>', {
        text: 'Filter Matches',
        click: filterMatches
    });
    $(filterMatchesButton).insertAfter(".page-featured");
});