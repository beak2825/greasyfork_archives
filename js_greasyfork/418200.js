// ==UserScript==
// @name         MALFunction - "Fix" ERRORS on MAL + Text AutoSaver
// @namespace    MALFunction
// @version      34
// @description  When MAL bugs showing ERROR messages or is blank and don't load the script reloads the page until MAL is successfully loaded... The script also AutoSaves any text that you are writing on MAL so that you will never again lose an UnSubmitted text!
// @author       hacker09
// @match        https://myanimelist.net/*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/418200/MALFunction%20-%20%22Fix%22%20ERRORS%20on%20MAL%20%2B%20Text%20AutoSaver.user.js
// @updateURL https://update.greasyfork.org/scripts/418200/MALFunction%20-%20%22Fix%22%20ERRORS%20on%20MAL%20%2B%20Text%20AutoSaver.meta.js
// ==/UserScript==

//The text "ㅤㅤ" contains the right to left mark used to bypass the mal character counter
(function() {
  'use strict';
  setTimeout(() => { //Starts the setTimeout function
    if ((document.querySelector("body").innerHTML.length < 3100 && document.body.innerText.search('Please click "Submit" to verify that you are not a bot.') === -1 && (location.href.match('ajaxtb') === null)) || (document.title.match(/^500 Internal Server Error$|^504 Gateway Time-out$|^ERROR: The request could not be satisfied$/) !== null)) {
      location.reload(); //Reloads the page
    } //Finishes the if condition
  }, 500); //Finishes the setTimeout function

  if (document.querySelector('div > h1:not(.forum_locheader)') !== null && document.querySelector('div > h1:not(.forum_locheader)').innerText.match(/^400 Invalid recaptcha.$|^400 Bad Request$/) !== null && document.querySelector('div > h1:not(.forum_locheader)').innerText.match(/^400 Invalid recaptcha.$|^400 Bad Request$/)[0] !== '') {
    history.back(); //Go Back
  } //Finishes the if condition

  setTimeout(function() { //Starts the setTimeout function when the "website finishes loading"
    if (document.querySelector("#amzn-captcha-verify-button") !== null) { //If the verify screen is shown
      document.querySelector("#amzn-captcha-verify-button").click(); //Click on Begin
    } //Finishes the if condition
  }, 1000); //Finishes the setTimeout function

  var SpanElements = document.querySelectorAll("span"); //Get all span elements on the page
  for (var i = SpanElements.length; i--;) { //For every single span element
    if (SpanElements[i].style.fontSize !== undefined) { //Check if the element has the font-size CSS attribute
      if (parseInt(SpanElements[i].style.fontSize) > 1000) { //If the element has the font-size CSS attribute and the font-size CSS value is bigger than 1000%
        SpanElements[i].style.fontSize = '1000%'; //Change the span element font-size CSS attribute to be only 1000%
      } //Finishes the if condition
    } //Finishes the if condition
  } //Finishes the for condition

  if (location.href.match('https://myanimelist.net/profile/') !== null || location.href.match('comtocom.php') !== null) //If the URL is an profile or comments page
  { //Starts the if condition
    var ProfileComments = document.querySelectorAll('div[id*="comtext"]'); //Get all span elements on the page
    for (i = ProfileComments.length; i--;) { //For every single span element
      ProfileComments[i].setAttribute('style', 'overflow:hidden !important;');
    } //Finishes the for condition
  } //Finishes the if condition

  if (location.href.match('login.php') === null) //If the URL ISN'T the mal login page
  { //Starts the if condition
    setTimeout(() => { //Starts the setTimeout function
      if (document.querySelector(".sceditor-toolbar") !== null) //If the user is anywhere that has the MAL BBCode editor ToolBar (forum topic or PM pages)
      { //Starts the if condition
        document.querySelectorAll(".sceditor-toolbar").forEach(function(el) { //For the top and bottom New reply text boxes on forum topics
          el.nextSibling.contentWindow.document.body.onkeyup = function() { //Detects when the user is writing on the page
            if (this.innerText !== '\n' && this.innerText !== undefined && document.activeElement.outerHTML.match(/"inputtext js-advancedSearchText"|"inputtext fl-l"/) === null) //If the focused element contains text and is not = undefined, and isn't the search bar
            { //Starts the if condition
              GM_setValue("Recovered text", this.innerText); //Save the text that is being written
            } //Finishes the if condition
          }; //Finishes the onkeypress event listener

          el.nextSibling.contentWindow.document.body.addEventListener('mousedown', function(e) { //Detects when the user middle clicks on the page
            if (e.button === 1) { //Starts the if condition If the middle mouse button was clicked and the focused element is not = undefined
              this.innerText = GM_getValue("Recovered text"); //Add the text that the script recovered previously to the element that is actually focused
              e.preventDefault(); //Prevent the default middle button action from executing
            } //Finishes the if condition
          }); //Finishes the mousedown event listener
        }); //Finishes the ForEach loop
      } //Finishes the if condition
    }, 1500); //Finishes the setTimeout function

    document.body.onkeyup = function() { //Detects when the user is writing on the page
      if (document.activeElement.value !== '' && document.activeElement.value !== undefined && document.activeElement.outerHTML.match(/"inputtext js-advancedSearchText"|"inputtext fl-l"|"autocomplete-input"/) === null) //If the focused element contains text and is not = undefined, and isn't the search bar or the Mentioner script search bar
      { //Starts the if condition
        GM_setValue("Recovered text", document.activeElement.value); //Save the text that is being written
      } //Finishes the if condition
    }; //Finishes the onkeypress event listener

    window.addEventListener('mousedown', function(e) { //Detects when the user middle clicks on the page
      if (e.button === 1 && document.activeElement.value !== undefined) { //Starts the if condition If the middle mouse button was clicked and the focused element is not = undefined
        document.activeElement.value = GM_getValue("Recovered text"); //Add the text that the script recovered previously to the element that is actually focused
        e.preventDefault(); //Prevent the default middle button action from executing
      } //Finishes the if condition
    }); //Finishes the mousedown event listener
  } //Finishes the if condition
})();