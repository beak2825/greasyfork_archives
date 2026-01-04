// ==UserScript==
// @name        Wanikani slowdown
// @namespace   wksld
// @description Prevents submiting wrong answers too quick
// @include     http://www.wanikani.com/review/session*
// @include     https://www.wanikani.com/review/session*
// @version     1.0
// @author      フラカノ
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/369764/Wanikani%20slowdown.user.js
// @updateURL https://update.greasyfork.org/scripts/369764/Wanikani%20slowdown.meta.js
// ==/UserScript==

var lastClick = 0;//time of last enter click
var delayms = 1000;//delay time in milliseconds

//callback on button click, saves time of last 'enter' click
function answerTimestamp(event)
{
    if(event.keyCode != 13)return;

    lastClick = Date.now();
}

//callback after submiting checked answer (when alredy answer is green or red)
//if it's wrong and passed time was too short it prevents submitting
function checkAnswer(event)
{
    if(event.keyCode != 13)return;//if enter wasn't clicked

    var currentClick = Date.now();

    if( (currentClick-lastClick) < delayms)//if interval between lastClick and currentClick was too short
    {
        if(document.getElementsByClassName('incorrect').length > 0)//if current answer is incorect
        {
            event.stopPropagation();
            event.preventDefault();

            alert("You're going too quick and already answered wrong");
            return true;
        }
    }
}

//bind keys
document.getElementById("user-response").addEventListener("keydown", answerTimestamp);
document.documentElement.addEventListener("keydown", checkAnswer);