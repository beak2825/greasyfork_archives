// ==UserScript==
// @name         Dunkin Clicker
// @namespace    /u/TIFUByRedditting
// @version      4.20
// @description  Does dunkin surveys automatically
// @author       You
// @match        *://*.telldunkin.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/24546/Dunkin%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/24546/Dunkin%20Clicker.meta.js
// ==/UserScript==

//function to easily check cookies
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


//Sets the cookie and moves on to doing the survey itself
function surveyCookie() {
    document.cookie = "buttonClicked = true";
    doSurvey();
}

//The function that actually does the survey
function doSurvey() {
    if (getCookie("buttonClicked") == 'true') {
        var surveyDone = document.getElementsByClassName('ValCode');
        if (surveyDone.length > 0) {
            document.cookie = "buttonClicked=;";
        } else {
            window.location = 'Index.aspx?LanguageID=US';
            //This line clicks the buttons of the survey
            Array.from(document.querySelectorAll(".radioBranded")).forEach(button => button.click());
            //This line moves you on to the next page
            document.getElementById('NextButton').click();
            setTimeout(doSurvey, 3000);
        }
    }
}

/*--- Create a button in a container div.  It will be styled and
    positioned with CSS.
*/
var zNode = document.createElement('div');
zNode.innerHTML = '<button id="myButton" type="button">' +
    'Do the survey!</button>';
zNode.setAttribute('id', 'myContainer');
document.body.appendChild(zNode);

//--- Activate the newly added button.
document.getElementById("myButton").addEventListener(
    "click", surveyCookie, false
);


//--- Style our newly added elements using CSS.
GM_addStyle(multilineStr(function() {
    /*!
        #myContainer {
            position:               absolute;
            top:                    0;
            left:                   0;
            font-size:              20px;
            margin:                 5px;
            opacity:                0.8;
            z-index:                222;
        }
        #myButton {
            cursor:                 pointer;
        }
        #myContainer p {
            color:                  red;
            background:             white;
        }
    */
}));

function multilineStr(dummyFunc) {
    var str = dummyFunc.toString();
    str = str.replace(/^[^\/]+\/\*!?/, '') // Strip function () { /*!
        .replace(/\s*\*\/\s*\}\s*$/, '') // Strip */ }
        .replace(/\/\/.+$/gm, '') // Double-slash comments wreck CSS. Strip them.
    ;
    return str;
}

doSurvey();