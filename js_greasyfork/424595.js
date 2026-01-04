// ==UserScript==
// @name         Night Mode
// @namespace    Nightmode
// @version      8
// @description  Adds a transparent dark layer depending on the time of the day to any website to make it less bright.
// @author       hacker09
// @include      *
// @require      https://greasyfork.org/scripts/403996-exev/code/ExEv.js?version=808391
// @icon         https://i.imgur.com/XxHMRlM.png
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/424595/Night%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/424595/Night%20Mode.meta.js
// ==/UserScript==

(function() {
  'use strict';
  if (GM_getValue("DefaultOpacity") === undefined) { //If the variable doesn't exist yet define the variables
    GM_setValue('DefaultOpacity', 30); //Set the default opacity % number
    GM_setValue('FromHour', 21); ///From this hour on enable the dark layer
    GM_setValue('ToHour', 8); //Up to this hour keep the dark layer enabled
  } //Finishes the if condition

  var timeinhours = new Date().getHours(); //Get the actual time

  if (GM_getValue('FromHour') < GM_getValue('ToHour')) //If the FromHour time is smaller than the ToHour time (If from hour is morning,afternoon or evening hour)
  { //Starts the if condition
    var TimeCondition = timeinhours >= GM_getValue('FromHour') && timeinhours <= GM_getValue('ToHour'); //Creates a new variable to check and hold the time condition
  } //Finishes the if condition
  if (GM_getValue('FromHour') > GM_getValue('ToHour')) //If the FromHour time is greater than the ToHour time (If from hour is night hour)
  { //Starts the if condition
    TimeCondition = timeinhours >= GM_getValue('FromHour') || timeinhours <= GM_getValue('ToHour'); //Creates a new variable to check and hold the time condition
  } //Finishes the if condition
  if (GM_getValue('FromHour') === GM_getValue('ToHour')) //If the FromHour time is equal the ToHour time
  { //Starts the if condition
    TimeCondition = timeinhours === GM_getValue('FromHour'); //Creates a new variable to check and hold the time condition
  } //Finishes the if condition

  if (TimeCondition === true || timeinhours === 0) //If the actual time is within the set times
  { //Starts the if condition
    document.events.on('bodyloaded', async () => { //When the body is loaded
      var opacity = (GM_getValue('nightSettings:' + document.location.host) || {}).opacity; //Get the website custom opacity %
      var DefaultOpacity = document.createElement('center'); //Creates a new element
      var SetCustomLayer = document.createElement('input'); //Creates a new element
      var MenuBox = document.createElement('container'); //Creates a new element
      var percentage = document.createElement('center'); //Creates a new element
      var closeButton = document.createElement('span'); //Creates a new element
      var Disable = document.createElement('center'); //Creates a new element
      var ShowMenu = document.createElement('div'); //Creates a new element
      var From = document.createElement('center'); //Creates a new element
      var text = document.createElement('center'); //Creates a new element
      var layer = document.createElement('div'); //Creates a new element

      ShowMenu.setAttribute("id", "nightmenu"); //Sets an id to the ShowMenu button
      layer.setAttribute("id", "nightThemeLayout"); //Sets an id to the layer element
      text.setAttribute("style", "color: white; margin-right: 10px;"); //The CSS for the text button
      SetCustomLayer.setAttribute("style", "cursor: pointer;"); //The CSS for the SetCustomLayer button
      [From, percentage, DefaultOpacity, Disable].map(element => element.setAttribute("style", "color: white;")); //The CSS for these 3 elements
      closeButton.setAttribute("style", "font: -webkit-control; color: red; position: absolute; left: calc(100% - (18px + 1.75px) * 0.9); top: -2px; cursor: pointer;"); //The CSS for the closeButton button
      ShowMenu.setAttribute("style", "cursor: pointer; width: 2rem; height: 2rem; position: fixed; top: " + `calc(${window.innerHeight}px - 2rem)` + "; left: " + `calc(${window.innerWidth}px - 3rem)` + "; text-align: center; background: rgb(0, 0, 0); color: white; padding: 0.5rem 0px; border: 1px solid white; z-index: 2147483647;"); //The CSS for the ShowMenu button
      MenuBox.setAttribute("style", "position: fixed; background: rgba(0, 0, 0, 0.8); display: none; transform: translateX(calc(50vw - 50%)); left: 0px; top: 40vh; border: 1px solid white; z-index: 2147483647;"); //The CSS for the MenuBox
      layer.setAttribute("style", "width: 100vw; height: 100vh; z-index: 2147483647; background: rgb(0, 0, 0); opacity: " + (opacity || GM_getValue("DefaultOpacity")) + "%" + "; position: fixed; top: 0px; left: 0px; pointer-events: none;"); //The CSS for the layer button

      DefaultOpacity.innerHTML = 'Default Opacity <input id="DefaultOpacity" style="width: 17px;" value="' + GM_getValue('DefaultOpacity') + '"></input>%'; //Set the default opacity % number to be displayed
      From.innerHTML = 'From <input id="FromHour" style="width: 17px;" value="' + GM_getValue('FromHour') + '"></input> to <input id="ToHour" style="width: 17px;" value="' + GM_getValue('ToHour') + '"></input>'; //Set the default from and to times
      Disable.innerHTML = 'Disable/Enable <input id="nightDisable" style="width: 17px;" type="checkbox"></input>'; //Add the disable checkbox

      ShowMenu.innerText = "⚙️"; //Sets the ShowMenu symbol
      closeButton.innerText = "❌"; //Sets the closeButton symbol
      text.innerText = "Layer's opacity"; //Sets the text element text
      percentage.innerText = (opacity || GM_getValue('DefaultOpacity')) + "%"; //Sets the % number text to be shown

      SetCustomLayer.min = "0"; //Define the minimum range number to 0
      SetCustomLayer.max = "95"; //Define the maximum range number to 95
      SetCustomLayer.type = "range"; //Let the user define the input from a range
      SetCustomLayer.value = (opacity || GM_getValue('DefaultOpacity')); //Set the default opacity % number to be displayed

      MenuBox.append(text, SetCustomLayer, percentage, From, DefaultOpacity, closeButton, Disable); //Add the element to the page
      document.body.append(layer, ShowMenu, MenuBox); //Add the element to the page

      [document.querySelector("#DefaultOpacity"), document.querySelector("#ToHour"), document.querySelector("#FromHour")].map(element => element.oninput = function() {
        GM_setValue('DefaultOpacity', parseInt(document.querySelector("#DefaultOpacity").value)); //Store the new DefaultOpacity variable %
        GM_setValue('FromHour', parseInt(document.querySelector("#FromHour").value)); //Store the new FromHour time variable
        GM_setValue('ToHour', parseInt(document.querySelector("#ToHour").value)); //Store the new ToHour time variable
      });

      document.querySelector("#nightDisable").addEventListener('change', function() { //If the disable/enable checkbox is checked/unchecked
        if (this.checked) { //If the checkbox is checked
          document.querySelector("#nightThemeLayout").style.display = 'none'; //Hide the dark layer
          document.querySelector("#nightmenu").style.display = 'none'; //Hide the menu
        } else { //If the checkbox is unchecked
          document.querySelector("#nightThemeLayout").style.display = ''; //Show the dark layer
          document.querySelector("#nightmenu").style.display = ''; //Show the menu
        } //Finishes the else condition
      }); //FInishes the onchange event listener

      document.addEventListener("fullscreenchange", function() { //When a video is on full screen
        if (document.fullscreen) { //If the video entered the full screen mode
          ShowMenu.style.display = "none"; //Hide the menu
        } else { //If the video lefted the full screen mode
          ShowMenu.style.display = "block"; //Show the menu button again
        } //Finishes the if condition
      }); //Finishes the fullscreenchange event listener

      ShowMenu.onclick = function() { //When the menu button is clicked
        this.style.display = "none"; //Hide the menu
        MenuBox.style.display = ''; //Show the options box
      }; //FInishes the click event listener

      closeButton.onclick = function() { //When the close button is clicked
        this.parentNode.style.display = "none"; //Hide the options box
        ShowMenu.style.display = "block"; //Show the menu button again
      }; //FInishes the click event listener

      SetCustomLayer.oninput = function() { //When the user changed the opacity %
        GM_setValue('nightSettings:' + document.location.host, {
          "opacity": this.value
        }); //Store the new opacity % to be used on this site
        percentage.innerText = `${this.value}%`; //Change the displayed opacity %
        layer.style.opacity = this.value + "%"; //Change the website opacity
      }; //Finishes the oninput event listener
    }); //Finishes the bodyloaded event listener
  } //Finishes the if condition
})();