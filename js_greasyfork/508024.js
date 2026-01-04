// ==UserScript==
// @name        Spotify lyric background color change
// @namespace   Violentmonkey Scripts
// @match       https://open.spotify.com/*
// @grant       none
// @version     1.6
// @author      baxtermaia5000
// @license     MIT
// @run-at      document-body
// @description hi
// @downloadURL https://update.greasyfork.org/scripts/508024/Spotify%20lyric%20background%20color%20change.user.js
// @updateURL https://update.greasyfork.org/scripts/508024/Spotify%20lyric%20background%20color%20change.meta.js
// ==/UserScript==

const delay = ms => new Promise(res => setTimeout(res, ms));
//active: Green, inactive: base00, passed: green with opacity of .5, bg: base3
const styleString = "--lyrics-color-active: rgb(133,153,0); --lyrics-color-inactive: rgb(101,123,131); --lyrics-color-passed: rgba(133,153,0,0.5); --lyrics-color-background: rgb(0,43,54); --lyrics-color-messaging: rgb(0, 0, 0);";
//active: Green, inactive: base0, passed: green with opacity of .5, bg: base03
const lightStyleString = "--lyrics-color-active: rgb(133,153,0); --lyrics-color-inactive: rgb(131, 148, 150); --lyrics-color-passed: rgba(133,153,0,0.5); --lyrics-color-background: rgb(253, 246, 227); --lyrics-color-messaging: rgb(0, 0, 0);";
const styleStrings = [styleString, lightStyleString];
const darkButton = document.createElement("button");
darkButton.textContent = 'Dark Mode';
darkButton.style.color = "rgb(29, 185, 84)";
darkButton.style.backgroundColor = "rgb(0,0,0)";
darkButton.style.border = "none";
darkButton.style.fontFamily = "var(--encore-body-font-stack)";
darkButton.style.fontSize = "var(--encore-text-size-smaller)";
darkButton.fontWeight = "400";
darkButton.style.marginRight = "8px";
darkButton.style.width = "75px"
var modeSelect = 0;
var onSelect = 1;

const onButton = document.createElement("button");
onButton.textContent = "Lyric Mod";
onButton.style.color = "rgb(29,185,84)";
onButton.style.backgroundColor = "rgb(0,0,0)";
onButton.style.border = "none";
onButton.style.fontFamily = "var(--encore-body-font-stack)"
onButton.style.fontSize = "var(--encore-text-size-smaller)";
onButton.fontWeight = "400";
onButton.style.marginRight = "16px";

darkButton.addEventListener('click', () => { //handles dark mode button toggle
  if (modeSelect == 0) {
    modeSelect = 1;
    darkButton.innerHTML = "Light Mode";
    darkButton.style.color = "rgba(255,255,255,0.7)";
  } else {
    modeSelect = 0;
    darkButton.innerHTML = "Dark Mode";
    darkButton.style.color = "rgb(29,185,84)";
  }
});

onButton.addEventListener('click', () => { //handles on button toggle
  if (onSelect == 0) {
    onSelect = 1;
    onButton.style.color = "rgb(29, 185, 84)";
  } else {
    onSelect = 0;
    onButton.style.color = "rgba(255,255,255,0.7)";
  }
});
var defaultColor = "";

const loopFunction = function () {
  let possibleDiv = document.getElementsByClassName("FUYNhisXTCmbzt9IDxnT");
  if (possibleDiv[0] == undefined) {
    return 0;
  }
  var divStyle = possibleDiv[0].style.cssText;
  if ((divStyle != styleStrings[0]) && (divStyle != styleStrings[1])) {
    defaultColor = divStyle;
    if (onSelect == 1) {
      possibleDiv[0].style.cssText = styleStrings[modeSelect];
    }
    return 0;
  }
  if (onSelect == 1) {
    possibleDiv[0].style.cssText = styleStrings[modeSelect];
    return 0;
  }
  possibleDiv[0].style.cssText = defaultColor;
  return 0;
}

const buttonFunction = async () => {
  var buttonDiv = document.getElementsByClassName("mwpJrmCgLlVkJVtWjlI1");
  while (buttonDiv[0] == undefined) {
    await delay(100);
    buttonDiv = document.getElementsByClassName("mwpJrmCgLlVkJVtWjlI1"); // waits for button div to load
  }
  buttonDiv[0].prepend(darkButton); //adds buttons to button div
  buttonDiv[0].prepend(onButton);
}
const MainFunction = async () => {
    'use strict';
    buttonFunction();
    console.log(darkButton.style.width);
    while (true) {
      loopFunction();
      await delay(100);
    }
};

MainFunction()