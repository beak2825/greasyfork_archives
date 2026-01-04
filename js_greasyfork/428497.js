// ==UserScript==
// @name         MTN User Blocker
// @namespace    mactechnews.de
// @version      0.1
// @description  blocks defined users
// @author       MetalSnake
// @include      http*://mactechnews.de/*
// @include      http*://www.mactechnews.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428497/MTN%20User%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/428497/MTN%20User%20Blocker.meta.js
// ==/UserScript==

var blocked = ["sierkb"];
var nickList = document.getElementsByClassName('MtnCommentAccountName');
var content = document.getElementById('ContentPlaceHolder1_MtnNewsCommentScrollNewsComments');


console.log(nickList.length);
for (var i = 0; i < nickList.length; i++) {
  console.log(nickList[i]);
  if(blocked.indexOf(nickList[i].innerHTML) >= 0)
  {
      //console.log(nickList[i].parentElement.parentElement.parentElement);
      nickList[i].parentElement.parentElement.parentElement.style.display = "none";
  }
}


content.onchange = function(){
    alert("test");
var blocked = ["sierkb"];
var nickList = document.getElementsByClassName('MtnCommentAccountName');

console.log(nickList.length);
for (var i = 0; i < nickList.length; i++) {
  console.log(nickList[i]);
  if(blocked.indexOf(nickList[i].innerHTML) >= 0)
  {
      //console.log(nickList[i].parentElement.parentElement.parentElement);
      nickList[i].parentElement.parentElement.parentElement.style.display = "none";
  }
}


};