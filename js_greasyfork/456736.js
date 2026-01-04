// ==UserScript==
// @name           Hide Names in Edulink
// @author         Simon Laycock
// @version        1.2
// @description    Provide facility to show and hide student names within Edulink. Only affects currently loaded names, so you will need to scroll through the list initially to hide/show them all.
// @match          *://*.edulinkone.com/*
// @grant          GM_addStyle
// @namespace      NotsofastmateyEdulink
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/456736/Hide%20Names%20in%20Edulink.user.js
// @updateURL https://update.greasyfork.org/scripts/456736/Hide%20Names%20in%20Edulink.meta.js
// ==/UserScript==

var names=[]; //Array to hold the student names
var reg_groups=[]; //Array to hold form groups

var buttonHide = document.createElement("Button");
buttonHide.innerHTML = "Hide Names";
buttonHide.style = "top:0;right:0;position:absolute;z-index:99999;padding:20px;text-transform: uppercase;background-color:#7cc576;cursor: pointer;border-radius: 8px;font-weight:700;color: #fff; border: 2px solid #fff; margin:5px";
buttonHide.onclick = function () {
    for (const element of document.getElementsByClassName("b-student-select__name ng-binding")){
        element.style.color="white"; //Hide the name
        let name = element.offsetParent.firstElementChild.innerText;
        if (!names.includes (name.split('\n')[0])) {
            names.push(name.split('\n')[0]); //Add the name text to an array of names it's not already in there
            reg_groups.push(name.split('\n')[1]); //Add the reg group text to an array of names it's not already in there
        }
    }
    console.log(names);
    console.log(reg_groups);
};

var buttonShow = document.createElement("Button");
buttonShow.innerHTML = "Show Names";
buttonShow.style = "top:0;left:0;position:absolute;z-index:99999;padding:20px;text-transform: uppercase;background-color:#7cc576;cursor: pointer;border-radius: 8px;font-weight:700;color: #fff; border: 2px solid #fff; margin: 5px";
buttonShow.onclick = function () {
    for (const element of document.getElementsByClassName("b-student-select__name ng-binding")){
        element.style.color="darkgray"; //Show the name

    }

};

document.body.appendChild(buttonShow);
document.body.appendChild(buttonHide);
