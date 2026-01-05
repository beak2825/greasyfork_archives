// ==UserScript==
// @name        KW Anki Mode (kustom)
// @namespace   mempo (mod: nelemnaru)
// @description Anki mode on KaniWani
// @include     https://www.kaniwani.com/kw/review/*
// @version     1.4mod2b (touchscreen controls)
// @grant       none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/27354/KW%20Anki%20Mode%20%28kustom%29.user.js
// @updateURL https://update.greasyfork.org/scripts/27354/KW%20Anki%20Mode%20%28kustom%29.meta.js
// ==/UserScript==

/* Make sure these settings are set on KaniWani settings 
on:  Automatically advance to next item in review if answer was correct.
off: Automatically show kanji and kana if you answer correctly.
off: Automatically show kanji and kana if you answer incorrectly.
*/

console.log('/// start of Kaniwani Anki Mode');

//Kustom touchscreen controls
var touchscreen = function () {
    $(".lower").before("<div id='touchwrap' style='position:relative;color:#fff;line-height:1.88em;font-size:3em;-moz-user-select: none;'></div>")
    $("#touchwrap").append("<div id='touchSpace' style='position:absolute;z-index:20;right:0px;top:-100px;'>&nbsp &nbsp▶ &nbsp</div>");
    $("#touchwrap").append("<div id='touchX' style='position:absolute;z-index:20;left:0px;top:-100px;'>&nbsp ✖&nbsp &nbsp</div>");

    $("#touchSpace").click(function() {
       pressSpace(); 
    });
    
    $("#touchX").click(function() {
       pressX(); 
    });
}

var pressSpace = function () {
                        if (kustom) {
                            if (answershown) {KWANKIMODE_answerYes();}
                            else {KWANKIMODE_showAnswer();}
                        }
}

var pressX = function () {
                        if (kustom && answershown) {KWANKIMODE_answerNo();}
}

var lightning_mode_wrong_answer = true;

if(lightning_mode_wrong_answer){$("#addSynonym").hide();}

var answershown = false;
var kustom = true;

var KWANKIMODE_showAnswer = function () {

    $("#detailKanji button").removeClass('-disabled');
    $("#detailKana button").removeClass('-disabled');
    $("#detailKanji div").removeClass('-hidden');
    $("#detailKana div").removeClass('-hidden');
    answershown = true;
    
    $("#kustomaudiowrap").click();
    var answer = $("<span>").html($('#detailKanji p').html().split("<br>")[0].trim()).text();
    $('#userAnswer').val(answer);
};

var KWANKIMODE_answerYes = function () {
   console.log('inside answer yes');
   
/*   var answer = $("<span>").html($('#detailKanji p').html().split("<br>")[0].trim()).text();
   $('#userAnswer').val(answer);*/
   $("#submitAnswer").click();
   $('#userAnswer').focus();
       kustom = false;
       setTimeout(function(){
           answershown = false
           kustom = true
       }, 500);

};

var KWANKIMODE_answerNo = function () {
     console.log('inside answer no');

     $('#userAnswer').val("のぺ");
     $("#submitAnswer").click();
    
     var answer = $("<span>").html($('#detailKanji p').html().split("<br>")[0].trim()).text();
     $('#userAnswer').val(answer);
    
     if(lightning_mode_wrong_answer){
         kustom = false;
         setTimeout(function(){
             $("#submitAnswer").click();
             $('#userAnswer').focus();
             answershown = false
             setTimeout(function(){//prevents accidental continue like in WK
                 kustom = true
             }, 500);
          }, 500);
     }
     
};


var bindHotkeys = function () {
    $(document).on("keydown.reviewScreen", function (event)
        {
            
            
                switch (event.keyCode) {
                    case 32: //SPACE
                        event.stopPropagation();
                        event.preventDefault();

                        //console.log('//// pressed space');
                        pressSpace();

                        return;
                        break;
/*                    case 49: //1
                        event.stopPropagation();
                        event.preventDefault();

                            //console.log('//// pressed 1');

                        
                            KWANKIMODE_answerYes();

                        return;
                        break;*/
                    case 88: //X

                        event.stopPropagation();
                        event.preventDefault();
                    
                            //console.log('//// pressed 2');

                            pressX();

                        return;
                        break;
				case 66: //B
                        event.stopPropagation();
                        event.preventDefault();
                        $("#kustomaudiowrap").click();
                        return;
                        break;
                }
            
        });
};

bindHotkeys();
touchscreen();