// ==UserScript==
// @name         JWPlayer Enhancer
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      3
// @description  Improves binge watch experiences on any JWPlayer videos online.
// @author       hacker09
// @include      *
// @icon         https://www.jwplayer.com/hubfs/JW_Player_August2021/Images/favicon-152.png
// @run-at       document-end
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/434709/JWPlayer%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/434709/JWPlayer%20Enhancer.meta.js
// ==/UserScript==

(function() {
  'use strict';
  window.onload = setTimeout(function() { //When the page is loaded
    if (document.querySelector('.jw-media') !== null) //If the N key was pressed (skip end and next ep preview)
    { //Starts the if condition
      var next; //Creates a new global variable
      const Player = unsafeWindow.jwplayer(unsafeWindow.jwplayer().getContainer()); //Store the Player element to a variable

      setTimeout(function() { //Starts the settimeout function

        function Visibility() //Create a function to check the tab visibility status
        { //Starts the function
          if (document.visibilityState === 'visible') { //If the tab is unfocused
            Player.play(); //Plays the video
            Player.setFullscreen(true); //Auto full screen the video
          } //Finishes the if condition
        } //Finishes the if function
        Visibility(); //Calls the function

        document.addEventListener("visibilitychange", function() { //When the tab is focused/unfocused
          setTimeout(function() { //Starts the settimeout function
            Visibility(); //Calls the function
          }, 1000); //Finishes the settimeout function

          if (document.hidden) { //If the tab is unfocused
            Player.pause(); //Pause the video
          } //Finishes the if condition

        }, false); //Finishes the visibilitychange event listener
      }, 500); //Finishes the settimeout function

      Player.on('complete', function() { //When the video ends
        Player.setFullscreen(false); //Leave video full screen mode
      }); //Finishes the oncomplete event listener

      Player.on('pause', function() { //When the video is pause
        Player.setFullscreen(false); //Leave video full screen mode
      }); //Finishes the oncomplete event listener

      document.head.insertAdjacentHTML('beforeend', '<style>.jw-rightclick { display: none !important; }</style>'); //Hide the right click jwplayer video menu options

      document.getElementById(unsafeWindow.jwplayer().id).addEventListener('click', function(e) { //When the video is clicked
        setTimeout(function() { //Starts the settimeout function
          if (Player.getState() === 'paused') //If the video is paused
          { //Starts the if condition
            Player.setFullscreen(false); //Leave video full screen mode
          } //Finishes the if condition
          else //If the video is playing
          { //Starts the else condition
            Player.setFullscreen(true); //Enters video full screen mode
          } //Finishes the else condition
        }, 500); //Finishes the settimeout function
      }); //Finishes the on click event listener

      document.addEventListener("keydown", e => { //Listen for keypresses
        if (e.key === 'n') //If the N key was pressed (skip end and next ep preview)
        { //Starts the if condition
          Player.setFullscreen(false); //Leave video full screen mode
          if (location.href.match('mateus7g') !== null) //If the N key was pressed (skip end and next ep preview)
          { //Starts the if condition
            console.log("key N 2 pressed");
            //next.click();
            Player.next(); //Jump to next ep
            //window.querySelector(".collection-carousel-media-link-current").parentElement.nextElementSibling.querySelector("div > div > div > a").click(); //Jump to next ep
          } //Finishes the else condition
        } //Finishes the else condition
        if (e.key === 'l') //If the L key was pressed (skip the opening)
        { //Starts the if condition
          Player.seek(Player.getPosition() + 85); //Seek 1:25 secs foward
        } //Finishes the else condition
      }); //Finishes the keydown event listener
    } //Finishes the if condition
  }, 1500); //Finishes the onload event listener
})();