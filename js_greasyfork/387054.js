// ==UserScript==
// @name         Wanikani Anki Mode Mobile
// @namespace    mempo
// @version      1.7.3
// @description  Mobile Anki mode for Wanikani
// @author       Mempo
// @match        https://www.wanikani.com/review/session*
// @match        http://www.wanikani.com/review/session*
// @grant        none
// @license      GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/387054/Wanikani%20Anki%20Mode%20Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/387054/Wanikani%20Anki%20Mode%20Mobile.meta.js
// ==/UserScript==

//Original author: Oleg Grishin <og402@nyu.edu>

console.log('/// WKAM begin');


// Save the original evaluator
var answerChecker = window.answerChecker;
var originalChecker = answerChecker.evaluate;

var checkerYes = function (itemType, correctValue) {
    return {accurate : !0, passed: !0};
}

var checkerNo = function (itemType, correctValue) {
    return {accurate : !0, passed: 0};
}

var activated = false;
var answerShown = false;

//AUTOSTART
var autostart = false;


MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var observer = new MutationObserver(function(mutations, observer) {
    $("#user-response").blur();
});

 var WKANKIMODE_toggle = function () {

    if (activated) {
        if(autostart){
            //DISABLE ANKI MODE
            $("#WKANKIMODE_anki").text("Anki Mode Off");
            $("#answer-form form button").prop("disabled", false);
            $("#user-response").off("focus");
            $("#user-response").focus();

            answerChecker.evaluate = originalChecker;
            observer.disconnect();

            localStorage.setItem("WKANKI_autostart", false);
            activated = false;
            autostart = false;
            console.log("back to #1");


        }else{
            //ENABLE AUTOSTART
            activated = true;
            autostart = true;
            localStorage.setItem("WKANKI_autostart", true);

            $("#WKANKIMODE_anki").text("Anki Mode Auto Start");

            // start observer to force blur
            observer.observe(document.getElementById("answer-form"), {
                childList: true,
                subtree: true,
                attributes: true,
                characterData: false
            });
        }





    } else {
        //ENABLE ANKI MODE
        $("#WKANKIMODE_anki").text("Anki Mode On");
        $("#answer-form form button").prop("disabled", true);
        $("#user-response").on("focus", function () {
            $("#user-response").blur();
        });
        activated = true;
        autostart = false;
        // start observer to force blur
        observer.observe(document.getElementById("answer-form"), {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: false
        });
    }

}

 var WKANKIMODE_showAnswer = function () {
    if (!$("#answer-form form fieldset").hasClass("correct") &&
        !$("#answer-form form fieldset").hasClass("incorrect") &&
        !answerShown ) {
        var currentItem = $.jStorage.get("currentItem");
        var questionType = $.jStorage.get("questionType");
        if (questionType === "meaning") {
            var answer = currentItem.en.join(", ");
            if (currentItem.syn.length) {
                answer += " (" + currentItem.syn.join(", ") + ")";
            }
            $("#user-response").val(answer);
        } else { //READING QUESTION
            var i = 0;
            var answer = "";

            if (currentItem.voc) {
                answer += currentItem.kana[0];
            } else if (currentItem.emph == 'kunyomi') {
                answer += currentItem.kun[0];
            } else if (currentItem.emph == 'nanori') {
                answer += currentItem.nanori[0];
            } else {
                answer += currentItem.on[0];
            }
            $("#user-response").val(answer);
        }
        answerShown = true;
    }
};

 var WKANKIMODE_answerYes = function () {
    if (answerShown) {
        answerChecker.evaluate = checkerYes;
        $("#answer-form form button").click();
        answerShown = false;
        answerChecker.evaluate = originalChecker;
        return;
    }

    // if answer is shown, press '1' one more time to go to next
    if ($("#answer-form form fieldset").hasClass("correct") ||
        $("#answer-form form fieldset").hasClass("incorrect") ) {
        $("#answer-form form button").click();
    }

};

var WKANKIMODE_answerNo = function () {
    if (answerShown) {
        answerChecker.evaluate = checkerNo;
        $("#answer-form form button").click();
        answerShown = false;
        answerChecker.evaluate = originalChecker;
        return;
    }

    if ($("#answer-form form fieldset").hasClass("correct") ||
        $("#answer-form form fieldset").hasClass("incorrect") ) {
        $("#answer-form form button").click();
    }

};


    /*jshint multistr: true */
    var css = "\
        #WKANKIMODE_anki { \
            background-color: #000099; \
            margin: 0 5px; \
        } \
        #WKANKIMODE_yes { \
            background-color: #009900; \
            margin: 0 0 0 5px; \
        } \
        #WKANKIMODE_no { \
            background-color: #990000; \
        } \
        .WKANKIMODE_button { \
            display: inline-block; \
            font-size: 0.8125em; \
            color: #FFFFFF; \
            cursor: pointer; \
            padding: 10px; \
        } \
        .WKANKIMODE_button_show { \
            display: inline-block; \
            font-size: 0.8125em; \
            color: #FFFFFF; \
            cursor: pointer; \
            padding: 10px; \
            background-color: orange; \
            height: 15vh; \
            width: 25vw; \
        } \
        .WKANKIMODE_button_correct { \
            display: inline-block; \
            font-size: 0.8125em; \
            color: #FFFFFF; \
            cursor: pointer; \
            padding: 10px; \
            background-color: green; \
            height: 15vh; \
            width: 25vw; \
        } \
        .WKANKIMODE_button_incorrect { \
            display: inline-block; \
            font-size: 0.8125em; \
            color: #FFFFFF; \
            cursor: pointer; \
            padding: 10px; \
            background-color: red; \
            height: 15vh; \
            width: 25vw; \
        } \
        #WKANKIMODE_anki.hidden { \
            display: none; \
        } ";



function addStyle(aCss) {
  var head, style;
  head = document.getElementsByTagName('head')[0];
  if (head) {
    style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.textContent = aCss;
    head.appendChild(style);
    return style;
  }
  return null;
}

var addButtons = function () {
    //CHECK AUTOSTART
    autostart = localStorage.getItem('WKANKI_autostart')==="true"?true:false;

    $("<div />", {
                id : "WKANKIMODE_anki",
                title : "Anki Mode",
    })
    .text("Anki Mode Off")
    .addClass("WKANKIMODE_button")
    .on("click", WKANKIMODE_toggle)
    .prependTo("footer");

    

    $("<div />", {
        id : "WKANKIMODE_anki_correct",
        title : "Correct",
    })
    .text("Correct")
    .addClass("WKANKIMODE_button_correct")
    .on("click", WKANKIMODE_answerYes)
    .prependTo("footer");

    $("<div />", {
        id : "WKANKIMODE_anki_show",
        title : "Check",
    })
    .text("Check Answer")
    .addClass("WKANKIMODE_button_show")
    .on("click", WKANKIMODE_showAnswer)
    .prependTo("footer");

    $("<div />", {
        id : "WKANKIMODE_anki_correct",
        title : "Incorrect",
    })
    .text("Incorrect")
    .addClass("WKANKIMODE_button_incorrect")
    .on("click", WKANKIMODE_answerNo)
    .prependTo("footer");

    // TO-DO
    // add physical buttons to press yes/no/show answer

    // var yesButton = "<div id='WKANKIMODE_yes' class='WKANKIMODE_button' title='Correct' onclick='WKANKIMODE_correct();'>Correct</div>";
    // var noButton = "<div id='WKANKIMODE_no' class='WKANKIMODE_button' title='Incorrect' onclick='WKANKIMODE_incorrect();'>Incorrect</div>";

    // $("footer").prepend($(noButton).hide());
    // $("footer").prepend($(yesButton).hide());

};

var autostartFeature = function() {
    console.log("/// WKAM: AUTOSTART = " + autostart);
    if(autostart){
        $("#WKANKIMODE_anki").text("Anki Mode Auto Start");
        $("#answer-form form button").prop("disabled", true);
        $("#user-response").on("focus", function () {
            $("#user-response").blur();
        });
        activated = true;
        // start observer to force blur
        observer.observe(document.getElementById("answer-form"), {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: false
        });
    }
}

var bindHotkeys = function () {
    $(document).on("keydown.reviewScreen", function (event)
        {
            if ($("#reviews").is(":visible") && !$("*:focus").is("textarea, input"))
            {
                switch (event.keyCode) {
                    case 32:
                        event.stopPropagation();
                        event.preventDefault();

                        if (activated)
                            WKANKIMODE_showAnswer();

                        return;
                        break;
                    case 49:
                        event.stopPropagation();
                        event.preventDefault();

                        if (activated)
                            WKANKIMODE_answerYes();

                        return;
                        break;
                    case 50:

                        event.stopPropagation();
                        event.preventDefault();

                        if (activated)
                            WKANKIMODE_answerNo();

                        return;
                        break;
                }
            }
        });
};


addStyle(css);
addButtons();
autostartFeature();
bindHotkeys();