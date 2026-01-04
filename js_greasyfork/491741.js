// ==UserScript==
// @name     Neopets Auto Daily
// @version  1.1
// @grant    none
// @include		https://www.neopets.com/*
// @author Bochuplah, lyd723
// @description Login to Neopets and go to http://www.neopets.com/index.phtml
// @namespace https://greasyfork.org/users/1263461
// @downloadURL https://update.greasyfork.org/scripts/491741/Neopets%20Auto%20Daily.user.js
// @updateURL https://update.greasyfork.org/scripts/491741/Neopets%20Auto%20Daily.meta.js
// ==/UserScript==

//dailies pages
var indexPage="https://www.neopets.com/myaccount.phtml";
var omelettePage="https://www.neopets.com/prehistoric/omelette.phtml"
var fishingPage="https://www.neopets.com/water/fishing.phtml"
var shrinePage="https://www.neopets.com/desert/shrine.phtml"
var plushiePage="https://www.neopets.com/faerieland/tdmbgpop.phtml"
var springPage="https://www.neopets.com/faerieland/springs.phtml"
var springPageTwo="https://www.neopets.com/faerieland/index.phtml?"
var tombolaPage="https://www.neopets.com/island/tombola.phtml"
var tombolaPageTwo="https://www.neopets.com/island/tombola2.phtml" //after collecting prize
var trudyPage="https://www.neopets.com/trudys_surprise.phtml"
var bankPage="https://www.neopets.com/bank.phtml"
var jellyPage="https://www.neopets.com/jelly/jelly.phtml"
var fruitPage="https://www.neopets.com/desert/fruit/index.phtml"
var anchorPage="https://www.neopets.com/pirates/anchormanagement.phtml"
var gravePage="https://www.neopets.com/halloween/gravedanger/"
var shorePage="https://www.neopets.com/pirates/forgottenshore.phtml"


//start the magic if you have already login
function indexFun()
{
  var f = document.getElementById("logout_link");

  if (f!= null)
  {
  	//go to the next page
    setTimeout(() => { window.location.href = omelettePage; }, 2000);
  }
  else
  {
    alert("[Neopets BotBot]Please Login to Neopets!!!")
  }
}

function omeletteFun()
{
  var omeletteForm = document.getElementsByTagName("form")[1];

  if (omeletteForm != null && omeletteForm.innerHTML.includes("Grab"))
  {
    omeletteForm.submit();
  }
  else
  {
    //go to the next page
    setTimeout(() => { window.location.href = fishingPage; }, 4000);
  }
}

function fishingFun()
{
  var fishingForm = document.getElementsByTagName("form")[1];

  if (fishingForm != null && fishingForm.innerHTML.includes("Reel"))
  {
    fishingForm.submit();
  }
  else
  {
    //go to the next page
    setTimeout(() => { window.location.href = shrinePage; }, 4000);
  }
}

function shrineFun()
{
  var shrineForm = document.getElementsByTagName("form")[1];


  if (shrineForm != null && shrineForm.innerHTML.includes("Approach"))
  {
    shrineForm.submit();
  }
  else
  {
    //go to the next page
    setTimeout(() => { window.location.href = plushiePage; }, 4000);
  }
}

function plushieFun()
{
  var plushieForm = document.getElementsByTagName("form")[1];

  if (plushieForm != null && plushieForm.innerHTML.includes("Talk"))
  {
    plushieForm.submit();
  }
  else
  {
    //go to the next page
    setTimeout(() => { window.location.href = springPage; }, 4000);
  }
}

function springFun()
{
  var springForm = document.getElementsByTagName("form")[1];

  if (springForm != null && springForm.innerHTML.includes("Heal"))
  {
    springForm.submit();
  }
  else
  {
    //go to the next page
    setTimeout(() => { window.location.href = tombolaPage; }, 4000);
  }
}

function tombolaFun()
{
  var tombolaForm = document.getElementsByTagName("form")[1];

  if (tombolaForm != null && tombolaForm.innerHTML.includes("Play"))
  {
    tombolaForm.submit();
  }
  else
  {
    //go to the next page
    setTimeout(() => { window.location.href = jellyPage; }, 4000);
  }
}

function jellyFun()
{
  var jellyForm = document.getElementsByTagName("form")[1];
  if (jellyForm != null && jellyForm.innerHTML.includes("Grab"))
  {
    jellyForm.submit();
  }
  else
  {
    //go to the next page
    setTimeout(() => { window.location.href = fruitPage; }, 4000);
  }
}

function fruitFun()
{
  var fruitForm = document.getElementsByTagName("form")[1];
  if (fruitForm != null && fruitForm.innerHTML.includes("Spin, spin, spin"))
  {
    fruitForm.submit();
  }
  else
  {
    //go to the next page
    setTimeout(() => { window.location.href = anchorPage; }, 20000);
  }
}

function anchorFun()
{
  var anchorForm = document.getElementsByTagName("form")[1];

  if (anchorForm != null)
  {
    anchorForm.submit();
  }
  else
  {
    //go to the next page
    setTimeout(() => { window.location.href = shorePage; }, 4000);
  }
}

function shoreFun()
{
  var exploreButton = document.querySelector('#shore_back a');

  if (exploreButton != null)
  {
    exploreButton.click();
  }
  else
  {
    //go to the next page
    setTimeout(() => { window.location.href = gravePage; }, 4000);
  }
}

function graveFun()
{
  var sendButton = document.querySelector('.select.button-yellow__2020.button-default__2020.btn-single__2020');
  var replayButton = document.querySelector('#gdReward + .gdForm .button-default__2020.button-yellow__2020.btn-single__2020');
  if (sendButton != null)
  {
    document.querySelector('#gdSelection div').click();
    sendButton.click();
    setTimeout(() => {
      document.querySelector('.select.button-default__2020.button-green__2020.popup-right-button__2020').click();
    }, 1000);
  }
  else if (replayButton != null && replayButton.innerText != 'Visit the NC Mall') {
    replayButton.click();
  }
  else
  {
    //go to the next page
    setTimeout(() => { window.location.href = trudyPage; }, 4000);
  }
}

//perform actions only when page finish loading
window.addEventListener('load', function() {
  var currentURL = window.location.href;
  if (currentURL.localeCompare(indexPage) == 0)
  {
  	indexFun();
  }
  else if (currentURL.localeCompare(omelettePage) == 0)
  {
    omeletteFun();
  }
  else if (currentURL.localeCompare(fishingPage) == 0)
  {
    fishingFun();
  }
  else if (currentURL.localeCompare(shrinePage) == 0)
  {
    shrineFun();
  }
  else if (currentURL.localeCompare(plushiePage) == 0)
  {
    plushieFun();
  }
  else if (currentURL.localeCompare(springPage) == 0 || currentURL.localeCompare(springPageTwo) == 0)
  {
    springFun();
  }
  else if (currentURL.toLowerCase().includes("tombola") && !currentURL.toLowerCase().includes("wizard"))
  {
    tombolaFun();
  }
  else if (currentURL.toLowerCase().includes("jelly.phtml")) {
    jellyFun();
  }
  else if (currentURL.localeCompare(fruitPage) == 0) {
    fruitFun();
  }
  else if (currentURL.localeCompare(anchorPage) == 0) {
    anchorFun();
  }
  else if (currentURL.localeCompare(gravePage) == 0) {
    graveFun();
  }
  else if (currentURL.toLowerCase().includes("forgottenshore")) {
    shoreFun();
  }
}, false);