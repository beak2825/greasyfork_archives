// ==UserScript==
// @name         Goodreads_Giveaway_Autonomous
// @namespace    https://greasyfork.org/en/scripts/431707-goodreads-giveaway-autonomous
// @version      1.06
// @description  This script will Auto-click "Enter Giveaway".
// @author       Davinna Mayawen
// @icon         https://media.tenor.com/images/e5b48218f76d06c730cae7f2928ad2c7/tenor.gif
// @include      *www.goodreads.com/giveaway*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      https://opensource.org/licenses/MIT
// @copyright    Davinna Mayawen 2021
//=======================================================================================
// @downloadURL https://update.greasyfork.org/scripts/431707/Goodreads_Giveaway_Autonomous.user.js
// @updateURL https://update.greasyfork.org/scripts/431707/Goodreads_Giveaway_Autonomous.meta.js
// ==/UserScript==

$(document).ready(function () {
  //document variables
  var url;
  var $giveawayButtons = [];
  let giveawayButtonTimeout = 2000; //giveawayButtonTimeout every 2 seconds
  let reloadTimeout = 60000; //reload once a minute
  let lengthTimeout = 2000; //wait for DOM to finish loading the entries 2 seconds

  //change background color
  document.body.style.backgroundColor = "gray";
  $("div.mainContent ").css("background-color", "gray");
  $("div.mainContentFloat ").css("background-color", "gray");

  //===========Auto-click "Enter Giveaway"===========
  //wait for page to load
  window.addEventListener('load', function (event) {
    setTimeout(function() {
      //create the list of "Enter Giveaway" buttons
      $giveawayButtons = $('a.Button.Button--primary.Button--small');

      //delay loop to open Enter Giveaway window
      (function delayLoop(i) {
        setTimeout(function () {
          openWin($giveawayButtons[i - 1].href);
          //  decrement i and call delayLoop again if i > 0
          if (--i) delayLoop(i);
        }, giveawayButtonTimeout); //end giveawayButtonTimeout
        //
        if (i - 1 == 0) {
          setTimeout(function () {
            confirmFunction();
          }, reloadTimeout); //end of reloadTimeout
        }//end of if
      })($giveawayButtons.length); //end of delayLoop
    }, lengthTimeout); //end of lengthTimeout
  }); //end of event listener

  //Enter giveaway actions
  giveawaySelectors('a.addressLink');
  //add a short delay in milliseconds between clicks of terms checkbox
  setInterval(function () { giveawaySelectors('#termsCheckBox'); }, 1200);
  //add a short delay in milliseconds between clicks of check box and submit button
  setInterval(function () { giveawaySelectors('#giveawaySubmitButton'); }, 1000);

  //close enty windows once completed
  url = window.location.href;
  if (url != 'https://www.goodreads.com/giveaway?sort=ending_soon&format=print' && (($(".mediumTextBottomPadded:contains('You are entered to win.')").length > 0 || $('a.gr-button').length))) {
    window.close();
  };

});//end of .ready

//search all non-zero selectors
function giveawaySelectors(selector) {
  var x = $(selector);
  if (x.length > 0) {
    x[0].click();
  }
}

//open new window
function openWin(href) {
  window.open(href, "_blank", "left=1500,top=100,width=600,height=300");
}

//confirm function
function confirmFunction() {
  var r = confirm("Click 'OK' to reload Page");
  if (r == true) {
    location.reload();
  }
  else {
    return;
  }
}