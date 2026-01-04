// ==UserScript==
// @name         Protobowl Spam bot
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.protobowl.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400111/Protobowl%20Spam%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/400111/Protobowl%20Spam%20bot.meta.js
// ==/UserScript==


var $ = window.jQuery;
var spamnode = document.createElement("Button");
var spamtextnode = document.createTextNode("Start Spamming");
spamnode.appendChild(spamtextnode);
document.getElementsByClassName("actionbar")[0].appendChild(spamnode);
var isSpamming = 0;
// spamnode.setAttribute("onclick", "spamtoggle()");
spamnode.setAttribute("id", "spambtn");
spamnode.setAttribute("class", "btn btn-warning");


var textspam = document.createElement("textarea");
textspam.setAttribute("id", "textspam");
textspam.setAttribute("placeholder", "spam text here");
document.getElementsByClassName("actionbar")[0].appendChild(textspam);

var timespam = document.createElement("input");
timespam.setAttribute("id", "timespams");
timespam.setAttribute("type", "number");
timespam.setAttribute("placeholder", "spam interval (seconds)");
document.getElementsByClassName("actionbar")[0].appendChild(timespam);
var spammafs = document.getElementById("timespams").value;
var thingy = document.getElementById("spambtn")

function doSpam() {
    if (isSpamming == 1) {
    spammafs = document.getElementById("timespams").value;
    $(".chatbtn").click();
    $(".chat_input").val(document.getElementById("textspam").value);
    $(".textbar-submit").click();
    setTimeout(doSpam, spammafs * 1000);

    }

}

document.getElementById("spambtn").addEventListener("click", function(){
  if (isSpamming == 0) {
        document.getElementById("spambtn").innerHTML = "Stop spamming"
        isSpamming = 1;
        doSpam();

    } else {
        isSpamming = 0;
        document.getElementById("spambtn").innerHTML = "Start spamming"
    }
});

// function spamtoggle(){
//     if (isSpamming == 0) {
//         document.getElementById("spambtn").innerHTML = "Stop spamming"
//         isSpamming = 1;
//         doSpam();

//     } else {
//         isSpamming = 0;
//         document.getElementById("spambtn").innerHTML = "Start spamming"
//     }

// }