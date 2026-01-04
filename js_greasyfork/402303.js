// ==UserScript==
// @name       (Defunct/Replaced) YouTube Title formatted for filename 3
// @namespace  sm
// @version    1.05
// @description  reformats the titles of YouTube videos to be windows filename compatible on click. - Rebuilt to work better.
// @match      http*://www.youtube.com/watch*
// @copyright  2021, sm
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/402303/%28DefunctReplaced%29%20YouTube%20Title%20formatted%20for%20filename%203.user.js
// @updateURL https://update.greasyfork.org/scripts/402303/%28DefunctReplaced%29%20YouTube%20Title%20formatted%20for%20filename%203.meta.js
// ==/UserScript==
// @require http://code.jquery.com/jquery-3.4.1.min.js

console.log("docReady waiting ")

let i = 0
function runFunctionTimer() //because setTimeout doesn't work in Tampermonkey  - use of it below is let untouched for now || this works for the first few minutes
{
    var interval = 1000;
    runFunctionTimer = setInterval(function () {
        if (i < 20) {
            addButtonsAndWatch();
            i++
            if (interval < 7000){ interval += 1000}
        }
    }, interval);
}



function addButtonsAndWatch() { //creates buttons and runs the actual logic

    let buttons = ""
    buttons = addButtons(buttons)
    function addButtons(buttonsString) {
        let inputBox0 = "<h1 id='targetYTFormatter'></h1><span><input id='formatTitleInput' placeholder='Insert title here' /><button id='formatTitleButton1'>Format Title</button></span>"
        let button2 = "<span><button id='formatDescriptionButton' hidden>Format Description</button><button id='fetch'>Fetch Title</button></span>"
        let button3 = "<span><button id='appendName'>Append Channel Name</button></span>"
        let button4 = "<span><button id='prependName'>Prepend Channel Name</button></span>"
        let button5 = "<span><button id='removeName'>Remove Name</button></span>"
        buttonsString = buttonsString + "<br />" + inputBox0 + button2 + "<br>" + button4 + button3 + button5;
        return buttonsString
    }

    let DescriptionBox = document.getElementById("meta");
    let pageString = document.getElementById("columns");
    if (pageString != null) {
        pageString = pageString.innerHTML
        let regexTestCalled = new RegExp("appendName", "gmi")
        if (pageString && !pageString.match(regexTestCalled)) {
            console.log("indide box")
            DescriptionBox.insertAdjacentHTML('beforebegin', buttons)
            // pageString = document.getElementById("columns").innerHTML();
            function2();
        }
    }
}


function function2() { // logic, looks for button presses and replaces text
    docReady(function () {

        //Buttons
        let titleButton = document.querySelector("#formatTitleButton");
        let titleButton1 = document.querySelector("#formatTitleButton1");
        let prependName = document.querySelector("#appendName");
        let appendName = document.querySelector("#prependName");
        let removeName = document.querySelector("#removeName");
        let fetch = document.querySelector("#fetch");


        let discription = document.querySelector("#description > yt-formatted-string")
        if (discription != null) { discription = discription.innerHTML }
        let channelNameHolder = document.querySelector("#text > a");
        if (channelNameHolder != null) { channelNameHolder = channelNameHolder.innerHTML }


       function getUserTitle() {
            let userTitle = document.querySelector("#formatTitleInput")
            userTitle = userTitle.value

            return userTitle
        }

        function getChannelName() {
            let channelNameHolder = document.querySelector("#text > a");
            if (channelNameHolder != null) { channelNameHolder = channelNameHolder.innerHTML }
            return channelNameHolder
        }


        let userTitle = getUserTitle();


        let target = document.querySelector("#targetYTFormatter");

        function findTitle(){ // fetches title and rerturns to input
            let title = document.title
                    console.log("title = ",title)
            let trimTitle = title.split("- YouTube")
            title = trimTitle[0].trim()
                    console.log(title)

            document.querySelector("#formatTitleInput").value = title
        }




        function runTitle1(hide){
             let target = document.querySelector("#targetYTFormatter");
            if (target.innerHTML == "" || !hide) {
            userTitle = getUserTitle();
                channelNameHolder = getChannelName();
                target.innerHTML = ""
                let fixedTitle = isValid(userTitle)
                target.innerHTML = fixedTitle
            } else {
                target.innerHTML = ""
            }
        }
                fetch.onclick = function(e){
        console.log("fetch")
        findTitle()
            runTitle1(false)
        }


        titleButton1.onclick = function (e) {//turn title into button
            runTitle1(true)
        }

        appendName.onclick = function (e) {//turn title into button
            userTitle = getUserTitle();
            channelNameHolder = getChannelName();
            let target = document.querySelector("#targetYTFormatter");
            target.innerHTML = ""
            let fixedTitle = isValid(userTitle)
            let fixedChannelName = isValid(channelNameHolder)
            target.innerHTML = fixedChannelName + " - " + fixedTitle
        }


        prependName.onclick = function (e) {//turn title into button
            userTitle = getUserTitle();
            channelNameHolder = getChannelName();
            let target = document.querySelector("#targetYTFormatter");
           // target.innerHTML = ""
            let fixedTitle = isValid(userTitle)
            let fixedChannelName = isValid(channelNameHolder)
            target.innerHTML = fixedTitle + " - " + fixedChannelName
        }


        removeName.onclick = function (e) {//turn title into button
            userTitle = getUserTitle();
            channelNameHolder = getChannelName();
            let target = document.querySelector("#targetYTFormatter");
            target.innerHTML = ""
            let fixedTitle = isValid(userTitle)
            target.innerHTML = fixedTitle

        }


        function isValid(fname) {
           // console.log("fname type is ", typeof fname);
           // console.log("fname input is ", fname);

            for (let i = 0; i < 20; i++) {
                fname = fname.replace("&", " and ")
                fname = fname.replace("|", " ")
                fname = fname.replace("||", " ")
                fname = fname.replace(",", " ")
                fname = fname.replace("?", " ")
                fname = fname.replace("!", " ")
                fname = fname.replace('"', " ")
                fname = fname.replace("@", " ")
                //fname = fname.replace("<","(")
                // fname = fname.replace(">",")")
                fname = fname.replace(".", "")
                fname = fname.replace("'", "")
                fname = fname.replace("►", "")
                fname = fname.replace("`", "")
                fname = fname.replace("/", " ")
                fname = fname.replace("\\", " ")
                fname = fname.replace(":", "")
                fname = fname.replace(";", "")
                fname = fname.replace("*", "")
                fname = fname.replace("^", "")
                fname = fname.replace("%", "")
                fname = fname.replace("$", "")
                fname = fname.replace("#", "")
                fname = fname.replace("+", "")
                fname = fname.replace("_", "")
                fname = fname.replace("’", "")
                fname = fname.replace("→", " - ")
                fname = fname.replace("」", " ")
                fname = fname.replace("「", " ")
                fname = fname.replace("}", ")")
                fname = fname.replace("{", " (")
                fname = fname.replace("  ", " ")
                fname = fname.replace("ー", "-")
                fname = fname.replace("『", " (")
                fname = fname.replace("』", ")")
                fname = fname.replace("！", "")
                fname = fname.replace("【", " (")
                fname = fname.replace("■", "-")
                fname = fname.replace("】", ")")
                fname = fname.replace("and amp ", " and ")
                fname = fname.replace("｜", " - ")
                fname = fname.replace("☆", " ")
                fname = fname.replace("<font>", " ")
                fname = fname.replace("</font>", " ")
                fname = fname.replace("< font>", " ")
                fname = fname.replace("</ font>", " ")
                fname = fname.replace("< /font>", " ")

            }
            return fname
        }
    });

}


runFunctionTimer();






function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}
// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
})();