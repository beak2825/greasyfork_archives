// ==UserScript==
// @name        WaniKani Insult Script
// @namespace   Jerred.scripts
// @author      Jerred
// @description This script displays an insult when you get a question wrong in your WaniKani Reviews
// @include     https://www.wanikani.com/review/session*
// @version     0.2
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/36081/WaniKani%20Insult%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/36081/WaniKani%20Insult%20Script.meta.js
// ==/UserScript==


$("#answer-form form button").on("click",function() {
    $("#rude").remove();
    setTimeout(function(){
    
        var selectedInsult; 
      　if ($("#answer-form form fieldset").hasClass("incorrect"))
        {
            selectedInsult = randomInsult();
            $("#character").after("<p id=\"rude\" style=\"font-size: 2em\">"+selectedInsult+"</p>");
            
        }
    
    }, 100);
});

function randomInsult(){
    var ind =  Math.floor(Math.random() * insultList.length)
    return insultList[ind];
    
}

var insultList = [
    "馬鹿じゃあ？不正解は決まってんだろう。",
    "馬鹿じゃないの?その程度で何も出来ないくせに。",
    "不合格です。無理すな。",
    "I bet you're the person who keeps getting the 'spoon' radical wrong, too",
    "You’re dumb. Go make me a sandwich.",
    "Could you just...OK?",
    "Is that really the best you can do? Pathetic.",
    "I find your lack of 知性 disturbing.",
    "Crabigator disapproves.",
    "Get your shit together, get it all together and put it in a back pack, all your shit, so it's together. And if you gotta take it some where, take it somewhere, you know, take it to the shit store and sell it, or put it in the shit museum. I don't care what you do, you just gotta get it together. - Rick and Morty "
    ];