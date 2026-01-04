// ==UserScript==
// @name         W2G Add-ons!
// @namespace    https://greasyfork.org/en/scripts/405602-w2g-add-ons
// @version      1.1
// @description  Add-ons for watch2gether to show parts of the website that can be changed or added.
// @author       Specy
// @match        https://www.watch2gether.com/rooms/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405602/W2G%20Add-ons%21.user.js
// @updateURL https://update.greasyfork.org/scripts/405602/W2G%20Add-ons%21.meta.js
// ==/UserScript==

//Removes limits of the video size
var playSearch = document.getElementsByClassName("w2g-player-search")[0]
var videoContainer = document.getElementsByClassName("w2g-video-container")[0]
var playerContainer = document.getElementsByClassName("w2g-player-container")[0]
var playerVideo = document.getElementsByClassName("w2g-player-video")[0]
var userList = document.getElementsByClassName("w2g-userbar-list")[0]
playSearch.style.maxWidth = "none"
videoContainer.style.maxWidth = "none"
videoContainer.style.maxHeight = "none"
playerVideo.style.maxHeight = "none"
//----------------------------------------------------//
//For the actual resize
var savedSize = parseInt(localStorage.getItem("savedSize"))
if(isNaN(savedSize)) {
    savedSize = 80
}
resizeVideo(0)

var plusMinusStyle = "border:2px black solid; display:block; width:40px; height:40px; font-size:2em; font-weight:bold; border-radius:5px;"
var buttonPlus = document.createElement("button")
var buttonMinus = document.createElement("button")
buttonPlus.innerHTML = "+"
buttonPlus.style = plusMinusStyle
buttonMinus.innerHTML = "-"
buttonMinus.style = plusMinusStyle + "position:absolute; bottom:0;"
var buttonsContainer = document.createElement("div")

buttonPlus.addEventListener("click", function() {
    resizeVideo(2)
})
buttonMinus.addEventListener("click", function() {
    resizeVideo(-2)
})

function resizeVideo(resizeAmount) {
    savedSize += resizeAmount
    localStorage.setItem("savedSize", savedSize)
    playerContainer.style.width = savedSize + "%"
    playerContainer.style.marginLeft = (100 - savedSize) / 2 + "%"
}
buttonsContainer.appendChild(buttonPlus)
buttonsContainer.appendChild(buttonMinus)
userList.parentNode.insertBefore(buttonsContainer, userList.nextSibling);




//Only works on mobile, just to show how it can be done, i'll remove it later on
var chatBox = document.getElementsByClassName("w2g-chat-messages")[0]
var chatInput = document.getElementsByClassName("w2g-chat-input")[0]
var userBar = document.getElementsByClassName("w2g-userbar")[0]
var oldStyle = chatBox.style
window.addEventListener("orientationchange", function() {
  if(window.orientation == 90 || window.orientation == 270 || window.orientation == -90){
     chatBox.style.position = "fixed"
     chatBox.style.width = "30%"
     chatBox.style.height = "calc(100% - 4.5em)"
     chatBox.style.top = "0"
     chatBox.style.right = "0"
     playerContainer.style.width = "70%"
     playerContainer.style.marginLeft = "0"
     chatInput.style.width = "30%"
     chatInput.style.left = "70%"
     userBar.style.width = "70%"
  }else{
      chatBox.style = oldStyle
      chatInput.style.width = "100%"
      chatInput.style.left = "0"
      userBar.style.width = "100%"
  }
});