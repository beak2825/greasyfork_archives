// ==UserScript==
// @name         Wanikani Anki Mode (irrelephant mod with buttons)
// @namespace    irrelephant
// @version      1.6.3
// @description  Anki mode for Wanikani; modified to show Anki buttons below character & answer field so that your hand doesn't hide that information. Uses two states for the button: either one large "Show Answer" button or two "Know"/"Don't Know" buttons so that you don't have to move your finger anywhere in case you got an answer correct.  You can also use "K" as the shortcut for "Know" (oKAY, I *K*now this) and "L" as the shortcut for "Don't know" (as in "this time, I *L*ose"). 
// @author       irrelephant
// @match        https://www.wanikani.com/review/session*
// @match        http://www.wanikani.com/review/session*
// @grant        none
// @license      GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/36746/Wanikani%20Anki%20Mode%20%28irrelephant%20mod%20with%20buttons%29.user.js
// @updateURL https://update.greasyfork.org/scripts/36746/Wanikani%20Anki%20Mode%20%28irrelephant%20mod%20with%20buttons%29.meta.js
// ==/UserScript==

//BASED ON:
//Wanikani Anki Mode by Mempo and modifications by necul, see https://community.wanikani.com/t/userscripts-on-android-browser/19113
//Original author: Oleg Grishin <og402@nyu.edu>

console.log('/// Start of Wanikani Anki Mode');


// Save the original evaluator
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


var WKANKIMODE_hideAnswerButtons = function(){
    $(".WKANKIMODE_button.correct").hide();
    $(".WKANKIMODE_button.incorrect").hide();
    $(".WKANKIMODE_button.show").show();
}

var WKANKIMODE_showAnswerButtons = function(){
    $(".WKANKIMODE_button.correct").show();
    $(".WKANKIMODE_button.incorrect").show();
    $(".WKANKIMODE_button.show").hide();
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
        WKANKIMODE_showAnswerButtons();
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
        WKANKIMODE_hideAnswerButtons();
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
        WKANKIMODE_hideAnswerButtons();
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
            width: 50%; \
            display: inline-block; \
            text-align:center; \
            font-size: 0.8125em; \
            color: #FFFFFF; \
            cursor: pointer; \
            padding: 10px 0; \
            margin-bottom: 5px; \
        } \
         .WKANKIMODE_buttons { \
            display: inline-block; \
            width:100%; \
        } \
        .WKANKIMODE_buttons .incorrect { \
            background-color: #990000; \
        } \
    .WKANKIMODE_buttons .correct { \
            background-color: #009900; \
        } \
    .WKANKIMODE_buttons .show { \
        background-color: #000099; \
        width:100%;\
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
                id : "WKANKIMODE_buttons"
    })
    .addClass("WKANKIMODE_buttons")
    .appendTo("#answer-form");

     $("<div />", {
                id : "WKANKIMODE_anki_incorrect",
                title : "Shortcut: L",
    })
    .text("Don't know")
    .addClass("WKANKIMODE_button incorrect")
    .on("click", WKANKIMODE_answerNo)
    .prependTo("#WKANKIMODE_buttons");

        $("<div />", {
                id : "WKANKIMODE_anki_show",
                title : "Shortcut: Space",
    })
    .text("Show Answer")
    .addClass("WKANKIMODE_button show")
    .on("click", WKANKIMODE_showAnswer)
    .prependTo("#WKANKIMODE_buttons");

$("<div />", {
                id : "WKANKIMODE_anki_correct",
                title : "Shortcut: K",
    })
    .text("Know")
    .addClass("WKANKIMODE_button correct")
    .on("click", WKANKIMODE_answerYes)
    .prependTo("#WKANKIMODE_buttons");

    // TO-DO
    // add physical buttons to press yes/no/show answer

    // var yesButton = "<div id='WKANKIMODE_yes' class='WKANKIMODE_button' title='Correct' onclick='WKANKIMODE_correct();'>Correct</div>";
    // var noButton = "<div id='WKANKIMODE_no' class='WKANKIMODE_button' title='Incorrect' onclick='WKANKIMODE_incorrect();'>Incorrect</div>";

    // $("footer").prepend($(noButton).hide());
    // $("footer").prepend($(yesButton).hide());

};

var autostartFeature = function() {
    console.log("///////////// AUTOSTART: " + autostart);
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
                    //key: Space
                    case 32:
                        event.stopPropagation();
                        event.preventDefault();

                        if (activated)
                            WKANKIMODE_showAnswer();

                        return;
                        break;
                    //key: "K" (like "oKAY, I got this")
                    case 75:
                        event.stopPropagation();
                        event.preventDefault();

                        if (activated)
                            WKANKIMODE_answerYes();

                        return;
                        break;
                    //key: "L" like "loser" (sorry, you are not a loser! It's all for the sake of the mnemonics)
                    case 76:

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
WKANKIMODE_hideAnswerButtons();