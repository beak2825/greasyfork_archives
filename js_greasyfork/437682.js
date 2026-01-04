// ==UserScript==
// @name        WaniKani Meaning/Reading Visual Aid
// @namespace   birthdaycat
// @match       https://www.wanikani.com/review/session
// @grant       none
// @version     0.2 (beta)
// @license     Apache, https://www.apache.org/licenses/LICENSE-2.0
// @author      birthdaycat
// @description Visual aid to help distinguish Meaning and Reading prompts
// @downloadURL https://update.greasyfork.org/scripts/437682/WaniKani%20MeaningReading%20Visual%20Aid.user.js
// @updateURL https://update.greasyfork.org/scripts/437682/WaniKani%20MeaningReading%20Visual%20Aid.meta.js
// ==/UserScript==

(function() {

if (!window.wkof) {
    alert('The show context sentence script requires Wanikani Open Framework.\nYou will now be forwarded to installation instructions.');
    window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
    return;
}

// overrides contents of questionType div
function override(questionType) {
    var childNodes = questionType.childNodes;
    childNodes[1].setAttribute('class', 'wf-sawarabimincho');
    if (questionType.className.localeCompare("reading") == 0){
        // Kanji for 'reading'
        childNodes[1].innerHTML = "読み方";
    } else if (questionType.className.localeCompare("meaning") == 0){
        // Kanji for 'meaning'
        childNodes[1].innerHTML = "Meaning";
    }
}

function install_question_type_css()
{
    var better_font = "<link href=\"https://fonts.googleapis.com/css?family=Sawarabi+Mincho\" rel=\"stylesheet\">";
    var question_type_css = ".wf-sawarabimincho { font-family: \"Sawarabi Mincho\"; }"

    $('head').append(better_font);
    $('head').append('<style>'+ question_type_css +'</style>');
}

$(window).on('load', function() {

    // change the font for a better-looking one
    install_question_type_css();

    // change questionType CSS
    let s = document.createElement("style");
    s.innerHTML = `#question #question-type.meaning {
    background-image: linear-gradient(to bottom, #ffffff, #e6e6ff);
    color: blue;
    text-shadow: none;
    border-bottom: 1px solid blue;}
    #question #question-type.reading {
    background-image: linear-gradient(to bottom, #ffffff, #ffe6e6);
    color: red;
    text-shadow: none;
    border-bottom: 1px solid red;}
    `
    document.head.appendChild(s);

    var questionType = document.getElementById("question-type");

    // Create an observer instance.
    var observer = new MutationObserver(function(mutations) {
        console.log(questionType.innerText);
        override(questionType);
    });

    // Pass in the target node, as well as the observer options.
    observer.observe(questionType, {
        attributes:    true,
        childList:     true,
        characterData: true
    });
});

})();