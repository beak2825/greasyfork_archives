// ==UserScript==
// @name         Wanikani Anki Mode (kustom)
// @namespace    mempo
// @version      1.6mod6b (kustom audio play after wrong answer, and better compatibility with WKO ignore)
// @description  Anki mode for Wanikani
// @author       Mempo
// @match        https://www.wanikani.com/review/session*
// @match        http://www.wanikani.com/review/session*
// @grant        none
// @license      GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/26906/Wanikani%20Anki%20Mode%20%28kustom%29.user.js
// @updateURL https://update.greasyfork.org/scripts/26906/Wanikani%20Anki%20Mode%20%28kustom%29.meta.js
// ==/UserScript==

//Original author: Oleg Grishin <og402@nyu.edu>

console.log('/// Start of Wanikani Anki Mode');

//Kustom touchscreen controls
var touchscreen = function () {
    $("#question-type > h1").before("<div id='touchSpace' style='position:absolute;z-index:20;right:0px;line-height:1.88em;font-size:3em;-moz-user-select: none;'>&nbsp &nbsp▶&nbsp &nbsp</div>");
    $("#touchSpace").click(function() {
       pressSpace(); 
});
    
    $("#question-type > h1").before("<div id='touchX' style='position:absolute;z-index:20;left:0px;line-height:1.88em;font-size:3em;-moz-user-select: none;'>&nbsp &nbsp✖&nbsp &nbsp</div>");
    $("#touchX").click(function() {
       pressX(); 
});
}

var pressSpace = function () {
    
                        if (activated && kustom)
                            if (answerShown || ($("#answer-form form fieldset").hasClass("correct") ||
                                $("#answer-form form fieldset").hasClass("incorrect") ||
							$("#answer-form form fieldset").hasClass("WKO_ignored"))) {
								WKANKIMODE_answerYes();
							}
                            else {WKANKIMODE_showAnswer();}//originally only this
}

var pressX = function () {
    
                        if (activated)
                            WKANKIMODE_answerNo();
}

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

var kustom = true;

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
        !answerShown) {
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
                for(i=0;i<(currentItem.kana.length - 1);i++){
                    answer += currentItem.kana[i] + ", ";
                }
                answer += currentItem.kana[currentItem.kana.length - 1];
            } else if (currentItem.emph == 'kunyomi') {
                for(i=0;i<(currentItem.kun.length - 1);i++){
                    answer += currentItem.kun[i] + ", ";
                }
                answer += currentItem.kun[currentItem.kun.length - 1];
            } else if (currentItem.emph == 'nanori') {
                for(i=0;i<(currentItem.nanori.length - 1);i++){
                    answer += currentItem.nanori[i] + ", ";
                }
                answer += currentItem.nanori[currentItem.nanori.length - 1];
            } else {
                for(i=0;i<(currentItem.on.length - 1);i++){
                    answer += currentItem.on[i] + ", ";
                }
                answer += currentItem.on[currentItem.on.length - 1];
            }
            $("#user-response").val(answer);
        }
        answerShown = true;
        
    }
     if ($("#audiowrap")) {$("#audiowrap").click();}//Play Kustom audio
};

 var WKANKIMODE_answerYes = function () {
    if (answerShown) {
        answerChecker.evaluate = checkerYes;
        $("#answer-form form button").click();
        answerShown = false;
        answerChecker.evaluate = originalChecker;
//        return;
    }

    // if answer is shown, press '1' one more time to go to next
    if ($("#answer-form form fieldset").hasClass("correct")) {
        kustom = false;
        setTimeout(function(){
                 $("#answer-form form button").click();
                 setTimeout(function(){
                        kustom = true;  
					
					 // for Single mode, Reading then Meaning, show meaning answer after continuing from reading question
					 if ($.jStorage.get("questionType") === "meaning") 
						 WKANKIMODE_showAnswer()
                  }, 100); 
        }, 500);
                 
    } else if ($("#answer-form form fieldset").hasClass("incorrect") || $("#answer-form form fieldset").hasClass("WKO_ignored")) {
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

//    if ($("#answer-form form fieldset").hasClass("correct") ||
//        $("#answer-form form fieldset").hasClass("incorrect") ) {
//        $("#answer-form form button").click();
//    }

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
                    case 32:
                        event.stopPropagation();
                        event.preventDefault();
                        pressSpace();

                        return;
                        break;
//                    case 49:
//                        event.stopPropagation();
//                        event.preventDefault();
//
//                        if (activated)
//                            WKANKIMODE_answerYes();
//
//                        return;
//                        break;
                    case 88:

                        event.stopPropagation();
                        event.preventDefault();
                        pressX();

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
touchscreen();