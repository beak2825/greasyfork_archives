// ==UserScript==
// @name         Navigator for Logs
// @namespace    https://eos2git.cec.lab.emc.com/lyuj/selfScript/blob/master/Navigator%20for%20Logs.user.js
// @version      0.31415926
// @description  Add handy buttons on test log pages
// @author       Jack.A.Black
// @match        https://www.google.com/search?q=%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC%E5%BC%80%E5%8F%91&rlz=1C1GCEA_en__838__838&oq=%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC%E5%BC%80%E5%8F%91&aqs=chrome..69i57j0l5.3119j0j1&sourceid=chrome&ie=UTF-8
// @grant        none
// @include      https://easyjenkins.service.baas.darkside.cec.lab.emc.com/*
// @downloadURL https://update.greasyfork.org/scripts/387334/Navigator%20for%20Logs.user.js
// @updateURL https://update.greasyfork.org/scripts/387334/Navigator%20for%20Logs.meta.js
// ==/UserScript==

// If log file URL changed, please make some change to "@include", pay attention to "*".
// Contact lv4399@126.com for future help. But everyone in my scrum is far more better than me XD. love all of you ~

var counterError, pointerError;
var counterFail, pointerFail;

/*
Function to locate target event
Input: eventName
Returns:  *None*
*/

function findEvent(eventName) {
    var list = document.querySelectorAll(eventName);
    var tag = eventName.split(".")[1];
    for (let index = list.length - 1; index >= 0; index--) {
        list[index].setAttribute("id", tag + index);
        list[index].firstChild.setAttribute("style", "background-color:#FFC943")
    }
}

/*
Function to find next event
Input: eventName
Returns:  *None*
Notice: Only work on some browsers: Chorme 29 and above(animation work on 61 above), IE8 and above, Firefox 1 and above(animation work on 36 above)
P.S. It alerts that there is a bug, but it works and actually it is not a bug.
*/

    findNext = function(eventName, isNext) {
    var index;
    if (isNext == false) {
        addCounter(eventName, 2);
        findNext(eventName);
        return;
    }
    else if (eventName == 'tr.ERROR') {
        if (counterError == 0){alert("No Error found. Good Job.");}
        else if (pointerError < 1) { resetCounter('tr.ERROR'); }
        index = counterError - pointerError;
        pointerError--;
    }
    else if (eventName == 'tr.FAIL') {
        if (counterFail == 0){alert("No Fail found. Good Job.");}
        else if (pointerFail < 1) { resetCounter('tr.FAIL'); }
        index = counterFail - pointerFail;
        pointerFail--;
    }

    else { alert('Script findNext error, call maintainer for help.'); }
    document.querySelectorAll(eventName)[index].scrollIntoView({ block: "start", inline: "nearest" });
}

/*
Function to reset pointer of event finder.
Input: eventName
Returns:  *None*
*/

function resetCounter(eventName, value) {
    if (eventName == 'All') {
        if (value != null) {
            pointerError = value;
            pointerFail = value;
            return;
        }
        resetCounter('tr.ERROR');
        resetCounter('tr.FAIL');
        return;
    }
    if (eventName == 'tr.ERROR') {
        pointerError = counterError;
    }
    else if (eventName == 'tr.FAIL') {
        pointerFail = counterFail;
    }
    else { alert('Script resetCounter error, call maintainer for help.'); }
}

function addCounter(eventName, value) {
    if (eventName == 'tr.ERROR') {
        if (pointerError >= counterError - 1) { pointerError = 1; return; }
        else { pointerError += value; }
    }
    else if (eventName == 'tr.FAIL') {
        if (pointerFail >= counterFail - 1) { pointerFail = 1; return; }
        else { pointerFail += value; }
    }
    else { alert('Script resetCounter error, call maintainer for help.'); }
}


$(document).ready(function () {
    //findEvent function -- to search for certain event
    findEvent('tr.FAIL');
    findEvent('tr.ERROR');
    counterFail = document.querySelectorAll('tr.FAIL').length;
    pointerFail = counterFail;
    counterError = document.querySelectorAll('tr.ERROR').length;
    pointerError = counterError;
    //add Button function -- to add a few buttons to panel
    addButtons();
});


/*
Function to add some new buttons to the panel
Input: *None*
Returns: *None*
Effects: add "to top", "to bottom", "find fail" and "find error" buttons
Modified on Mar 2019 by Jack Lyu
Advise / Next stage: remove functions and put these buttons inside the HTML pages
*/

function addButtons() {
    //adding anchor to page
    var pageTop = document.createElement('a');
    pageTop.setAttribute("id", "top");
    var pageBottom = document.createElement('a');
    pageBottom.setAttribute("id", "bottom")
    var tableBody = document.getElementById("content");
    tableBody.insertBefore(pageTop, tableBody.firstChild);
    $(pageBottom).insertAfter(tableBody);

    //adding link to page
    var infoText = document.createElement('p');
    infoText.setAttribute("style", "font-size: 1em;margin:0 0 5px 5px");
    infoText.innerHTML = "Navigator v1.0<br><div style='color:red;>'>Error(s):" + counterError + " Fail(s):" + counterFail + "</div>";
    var toTop = document.createElement('a');
    toTop.setAttribute("href", "#top");
    toTop.setAttribute("onclick", "resetCounter('All')");
    toTop.setAttribute("style", "color:#333333;margin:5px 0 0 5px;border:2px solid #6CDFEA;");
    toTop.innerHTML = "To Top";
    var toBottom = document.createElement('a');
    toBottom.setAttribute("href", "#bottom");
    toBottom.setAttribute("onclick", "resetCounter('All',0)");
    toBottom.setAttribute("style", "color:#333333;margin-left:5px;border:2px solid #6CDFEA;");
    toBottom.innerHTML = "To Bottom";
    var panleBottom = document.getElementById("filters");
    panleBottom.insertBefore(infoText, panleBottom.lastChild);
    panleBottom.insertBefore(toTop, panleBottom.lastChild);
    panleBottom.insertBefore(toBottom, panleBottom.lastChild);

    //adding "find next fail" button function
    var failButton = document.createElement('div');
    failButton.setAttribute("style", "margin: 15px 0 0 5px;");
    var findNextFail = document.createElement('a');
    findNextFail.setAttribute("href", "javascript:void(233)");
    findNextFail.setAttribute("onclick", "findNext('tr.FAIL')");
    findNextFail.setAttribute("style", "color:#333333;border:3px solid #F02311;margin-left:5px;padding:5px 1.19em 5px 5px;width:30%;text-align:center");
    findNextFail.innerHTML = "Next FAIL";
    failButton.insertBefore(findNextFail, failButton.lastChild);
    //adding "Prev fail" button function
    var findFail = document.createElement('a');
    findFail.setAttribute("href", "javascript:void(233)");
    findFail.setAttribute("onclick", "findNext('tr.FAIL',false)");
    findFail.setAttribute("style", "color:#333333;border:3px solid #F02311;padding:5px 1.19em 5px 5px;width:30%;text-align:center");
    findFail.innerHTML = "Prev FAIL";
    failButton.insertBefore(findFail, failButton.lastChild);

    //adding "find next error" button function
    var errorButton = document.createElement('div');
    errorButton.setAttribute("style", "margin: 20px 0 10px 5px;");
    var findNextError = document.createElement('a');
    findNextError.setAttribute("href", "javascript:void(233)");
    findNextError.setAttribute("onclick", "findNext('tr.ERROR')");
    findNextError.setAttribute("style", "color:#333333;border:3px solid #F02311;margin-left:5px;padding:5px 0 5px 5px;width:30%;text-align:center");
    findNextError.innerHTML = "Next ERROR";
    errorButton.insertBefore(findNextError, errorButton.lastChild);
    panleBottom.insertBefore(failButton, panleBottom.lastChild);
    //adding "Prev error" button function
    var findError = document.createElement('a');
    findError.setAttribute("href", "javascript:void(233)");
    findError.setAttribute("onclick", "findNext('tr.ERROR',false)");
    findError.setAttribute("style", "color:#333333;border:3px solid #F02311;padding:5px 0 5px 5px;width:30%;text-align:center");
    findError.innerHTML = "Prev ERROR";
    errorButton.insertBefore(findError, errorButton.lastChild);
    panleBottom.insertBefore(failButton, panleBottom.lastChild);

    //add both button to panle
    panleBottom.insertBefore(errorButton, panleBottom.lastChild);
}

