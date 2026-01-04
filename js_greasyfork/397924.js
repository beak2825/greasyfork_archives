// ==UserScript==
// @name         JIRA ISSUE JUMP for PUBG
// @namespace    https://greasyfork.org/en/scripts/397924-jira-direct-issue-jump
// @version      0.1.0
// @description  input 4 numbers and go to the issue directly
// @author       pto2k
// @match        https://jira.krafton.com/browse/PUBG*
// @match        https://jira.krafton.com/projects/PUBG/*
// @grant        none
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/397924/JIRA%20ISSUE%20JUMP%20for%20PUBG.user.js
// @updateURL https://update.greasyfork.org/scripts/397924/JIRA%20ISSUE%20JUMP%20for%20PUBG.meta.js
// ==/UserScript==

var issueId ="";
var myInput=document.body.appendChild(document.createElement("div"));
//var a = document.createTextNode("");

myInput.style.color ="#12006f";
myInput.style.backgroundColor ="#00111177";
//myinput1.appendChild(a);

myInput.style.top = "0px";
myInput.style.left = "0px";
myInput.style.width = "0%";
myInput.style.height = "0%";
myInput.style.fontSize = "400px";
myInput.style.position = "fixed";
myInput.style.textAlign = "center";
myInput.style.marginTop = "20px";
myInput.style.zIndex = "99999999";

my_log('hello world')
//var myInput = document.body.appendChild(myinput1);

document.addEventListener('keydown', function (e) {
    my_log(e);
    var keyCode = e.keyCode || e.which;
    if (keyCode >= 96 && keyCode <= 105) {
        // Numpad keys
        keyCode -= 48;
    }
    my_log('keycode is: ' + keyCode);
    if ([32,64].includes(keyCode)){//exclude space, enter, delete
        return;
    }
    if( e.target.nodeName == "INPUT" || e.target.nodeName == "TEXTAREA" ) return;
    if( e.target.isContentEditable ) return;
    if(isNaN(String.fromCharCode(keyCode))==false){
        myInput.style.width = "100%";
        myInput.style.height = "100%";
        issueId = issueId + String.fromCharCode(keyCode);
        myInput.textContent = issueId;
    }
    if(e.keyCode==8){
        issueId = "";
        myInput.style.width = "0%";
        myInput.style.height = "0%";
        myInput.textContent = issueId;
    }
    if ((issueId.length == 5)||(keyCode == 13)) {
      //alert(issueId);
        var myUrl = "https://jira.krafton.com/browse/PUBG-" + issueId;
        issueId = "";
    //     myInput.style.width = "0%";
    //     myInput.style.height = "0%";
        //myInput.textContent = issueId;
        myInput.style.fontSize = "400px";
    //      myInput.style.backgroundColor ="#cc0da394";
        myInput.style.color ="#a2ff00";
        window.open(myUrl,"_self");
    }
});

function my_log(log_text) {
    console.log('%c My LOG: ' + log_text , 'background: #222; color: #bada55');
}