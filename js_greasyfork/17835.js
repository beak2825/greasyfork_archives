// ==UserScript==
// @name        KW Anki Mode
// @namespace   mempo
// @description Anki mode on KaniWani
// @include     https://www.kaniwani.com/reviews/session
// @include     https://kaniwani.com/reviews/session
// @version     2
// @grant       none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/17835/KW%20Anki%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/17835/KW%20Anki%20Mode.meta.js
// ==/UserScript==

console.log('/// start of Kaniwani Anki Mode');


var lightning_mode_wrong_answer = true;

 var WKANKIMODE_showAnswer = function () {
     var answer = "";
     $("div:lang(ja)").each(function(i, obj) {
         if(!obj.innerHTML.includes("<")){ // check for html tags
             // console.log(obj.innerHTML);
             answer += obj.innerHTML;
         }
     });
   // console.log("Answer: " + answer);
   $("#answer").first().val(answer);
};

 var WKANKIMODE_answerYes = function () {
   //console.log('inside answer yes');
   $("#answer + :submit").click();
};

var WKANKIMODE_answerNo = function () {
     //console.log('inside answer no');
     $("#answer").first().val("のぺ");
     $("#answer + :submit").click();
     if(lightning_mode_wrong_answer){
          $("#answer + :submit").click();
     }
};


var bindHotkeys = function () {
    $(document).on("keydown", function (event) {

        switch (event.keyCode) {
            case 32: //SPACE
                event.stopPropagation();
                event.preventDefault();

                //console.log('//// pressed space');

                WKANKIMODE_showAnswer();

                return;
                break;
            case 49: //1
                event.stopPropagation();
                event.preventDefault();

                //console.log('//// pressed 1');


                WKANKIMODE_answerYes();

                return;
                break;
            case 50: //2

                event.stopPropagation();
                event.preventDefault();

                //console.log('//// pressed 2');

                WKANKIMODE_answerNo();

                return;
                break;
        }
            
    });
};

bindHotkeys();