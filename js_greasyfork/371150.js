// ==UserScript==
// @name        Wanikani Incorrect Driller
// @namespace   https://greasyfork.org/en/scripts/
// @author      Musera
// @description Adds a quiz to the review screen so you can drill mistakes
// @version     0.1.2
// @include     *://www.wanikani.com/review
// @copyright   2018+, Musera
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/371150/Wanikani%20Incorrect%20Driller.user.js
// @updateURL https://update.greasyfork.org/scripts/371150/Wanikani%20Incorrect%20Driller.meta.js
// ==/UserScript==


//===================================================================
// Functions
//===================================================================


function sortType() {
    quizOrder.length = 0;
    for (var i = 0; i < quizLink.length; i++) {
        quizOrder[i] = i;
    }
    quizOrder = shuffle(quizOrder);
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function hide()
{
    var hideType = ["apprentice", "guru", "master"];

    for (var j = 0; j < hideType.length; j++) {
        var hiClass = incorrect.getElementsByClassName(hideType[j]);
        var hiList = hiClass[0].querySelector('ul');
        for (var i = 0; i < hiList.children.length; i++) {
            hiList.children[i].style.display = "none";
        }
    }
}

function reset()
{
    var hideType = ["apprentice", "guru", "master"];

    for (var j = 0; j < hideType.length; j++) {
        var hiClass = incorrect.getElementsByClassName(hideType[j]);
        var hiList = hiClass[0].querySelector('ul');
        for (var i = 0; i < hiList.children.length; i++) {
            hiList.children[i].style.fontSize = "16px";
            hiList.children[i].style.display = "inline-block";
        }
    }
}

function next()
{
    sortNum++;

    if (sortNum == 0) {
        quizLink[quizOrder[sortNum]].style.display = "inline-block";
        quizLink[quizOrder[sortNum]].style.fontSize = "64px";
    } else if (quizOrder.length > sortNum) {
        quizLink[quizOrder[sortNum - 1]].style.display = "none";
        quizLink[quizOrder[sortNum]].style.display = "inline-block";
        quizLink[quizOrder[sortNum - 1]].style.fontSize = "16px";
        quizLink[quizOrder[sortNum]].style.fontSize = "64px";
    }
    else
    {
        quizLink[quizOrder[sortNum - 1]].style.display = "none";
        quizLink[quizOrder[sortNum - 1]].style.fontSize = "16px";
        sortNum = 0;
        sortType();
        quizLink[quizOrder[sortNum]].style.display = "inline-block";
        quizLink[quizOrder[sortNum]].style.fontSize = "64px";
    }
}

function startQuiz(quizType)
{
    if(quizType != currentSet) {
        var tempType= incorrect.getElementsByClassName(quizType);
        quizLink = tempType[0].querySelectorAll('li');
        currentSet = quizType;
        sortNum = -1;
        window.addEventListener('keypress', function (e) {if (e.keyCode == 32) { next(); }}, false);
        reset();
        hide();
        sortType();
        next();
    }
}

//===================================================================
// Variables
//===================================================================
var incorrect = document.getElementById("incorrect");

var inLinks = incorrect.querySelectorAll('span');
inLinks[0].addEventListener('click',function() {startQuiz("master");}, false);
inLinks[1].addEventListener('click',function() {startQuiz("guru");}, false);
inLinks[2].addEventListener('click',function() {startQuiz("apprentice");}, false);

var currentSet;
var quizLink;
var quizOrder = [];
var sortNum = 0;

//Thanks rFindley for this.
var style = document.createElement('style');
style.innerHTML = 'div.hover {max-width:600px; overflow:hidden;}';
document.querySelector('head').append(style);