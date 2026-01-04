// ==UserScript==
// @name         Allen NLP Buttons
// @author       Tehapollo
// @version      1.0
// @include      *mturkcontent.com*
// @require      https://code.jquery.com/jquery-latest.min.js
// @namespace    http://tampermonkey.net/
// @description  Creates buttons to generate questions
// @downloadURL https://update.greasyfork.org/scripts/374498/Allen%20NLP%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/374498/Allen%20NLP%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';


$(document).ready(function(){
    var hide_stuff = setInterval(function(){ Please_Hide(); }, 250);

    function Please_Hide(){
         if ( $('h2:contains(Complex question answering with high-Level reasoning and inference)').length ){
         document.getElementById('collapse_link').click()
    $('<input type="button" value="Long FG" id="question1"/>').insertAfter('div.question');
    $('<input type="button" value="Short FG" id="question2"/>').insertAfter('input#question1');
    $('<input type="button" value="Long TDP" id="question3"/>').insertAfter('input#question2');
    $('<input type="button" value="Short TDP" id="question4"/>').insertAfter('input#question3');
    $('<input type="button" value="FirstTD" id="question5"/>').insertAfter('input#question4');
    $('<input type="button" value="LastTD" id="question6"/>').insertAfter('input#question5');
    $('<input type="button" value="FirstFG" id="question7"/>').insertAfter('input#question6');
    $('<input type="button" value="LastFG" id="question8"/>').insertAfter('input#question7');
    $('<input type="button" value="XorYLonger" id="question9"/>').insertBefore('div.question');
    $('<input type="button" value="WonBy" id="question10"/>').insertAfter('input#question9');
    $('<input type="button" value="TotalPass" id="question11"/>').insertAfter('input#question8');
    $('<input type="button" value="LoseBy" id="question12"/>').insertAfter('input#question10');
    $('<input type="button" value="TotalPoints" id="question13"/>').insertAfter('input#question12');
             $("input#question1").click(function() {
document.getElementById("input-question").value="How many yards was the longest field goal?";
});
         $("input#question2").click(function() {
document.getElementById("input-question").value="How many yards was the shortest field goal?";
});
         $("input#question3").click(function() {
document.getElementById("input-question").value="How many yards was the longest touchdown?";
});
             $("input#question4").click(function() {
document.getElementById("input-question").value="How many yards was the shortest touchdown?";
});
                          $("input#question5").click(function() {
document.getElementById("input-question").value="Who scored the first touchdown of the game?";
});
             $("input#question6").click(function() {
document.getElementById("input-question").value="Who scored the last touchdown of the game?";
});
             $("input#question7").click(function() {
document.getElementById("input-question").value="Who scored the first field goal of the game?";
});
             $("input#question8").click(function() {
document.getElementById("input-question").value="Who scored the last field goal of the game?";
});
             $("input#question9").click(function() {
document.getElementById("input-question").value="How many field goals longer than X did Y kick?";
});
   $("input#question10").click(function() {
document.getElementById("input-question").value="How many points did X win by?";
});
             $("input#question11").click(function() {
document.getElementById("input-question").value="How many total yards did X throw for touchdowns?";
});
       $("input#question12").click(function() {
document.getElementById("input-question").value="How many points did X lose by?";
});
             $("input#question13").click(function() {
document.getElementById("input-question").value="How many points in total were scored?";
});
             clearInterval(hide_stuff);
         }

         else if ( $('h2:contains(Complex question answering with high-level reasoning and inference)').length ) {
         document.getElementById('collapse_link').click()
         clearInterval(hide_stuff);
        }
         else {
          clearInterval(hide_stuff);
         }
}

});

})();