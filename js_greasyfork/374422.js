// ==UserScript==
// @name         JIRA DIRECT ISSUE JUMP *OLD*
// @namespace    https://greasyfork.org/en/scripts/374422-jira-direct-issue-jump
// @version      0.5
// @description  input 4 numbers and go to the issue directly
// @author       You
// @match        https://fantasyflightgames.atlassian.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374422/JIRA%20DIRECT%20ISSUE%20JUMP%20%2AOLD%2A.user.js
// @updateURL https://update.greasyfork.org/scripts/374422/JIRA%20DIRECT%20ISSUE%20JUMP%20%2AOLD%2A.meta.js
// ==/UserScript==

var issueId ="";
var myInput=document.body.appendChild(document.createElement("div"));
//var a = document.createTextNode("");

myInput.style.color ="#12006f";
myInput.style.backgroundColor ="#00111177";
//myinput1.appendChild(a);

myInput.style.top = "10px";
myInput.style.left = "102px";
myInput.style.width = "0%";
myInput.style.height = "0%";
myInput.style.fontSize = "400px";
myInput.style.position = "fixed";
myInput.style.textAlign = "left";
myInput.style.marginTop = "20px";

//var myInput = document.body.appendChild(myinput1);

$(document).on('keydown', function (e) {
    var keyCode = e.keyCode || e.which;
     if (keyCode >= 96 && keyCode <= 105) {
        // Numpad keys
        keyCode -= 48;
    }
    console.log(keyCode);
    if ([13,32,64].includes(keyCode)){//exclude space, enter, delete
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
  if (issueId.length == 4) {
      //alert(issueId);
     var myUrl = "https://fantasyflightgames.atlassian.net/browse/LRIT-" + issueId;
     issueId = "";
//     myInput.style.width = "0%";
//     myInput.style.height = "0%";
     //myInput.textContent = issueId;
      myInput.style.fontSize = "400px";
//      myInput.style.backgroundColor ="#cc0da394";
      myInput.style.color ="#fefe16";
     window.open(myUrl,"_self");
  }
});
