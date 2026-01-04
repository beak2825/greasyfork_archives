// ==UserScript==
// @name        Zooniverse: Hubble Asteroid Hunter - Automatic Image Focus
// @description Automatically sets focus on the image in the Hubble Image Hunter project on Zooniverse
// @namespace   https://georgejames.com
// @include     https://www.zooniverse.org/projects/sandorkruk/hubble-asteroid-hunter/classify
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version     3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/400957/Zooniverse%3A%20Hubble%20Asteroid%20Hunter%20-%20Automatic%20Image%20Focus.user.js
// @updateURL https://update.greasyfork.org/scripts/400957/Zooniverse%3A%20Hubble%20Asteroid%20Hunter%20-%20Automatic%20Image%20Focus.meta.js
// ==/UserScript==

// Automatically sets focus on the image in the Hubble Image Hunter project on Zooniverse

//Avoid conflicts
this.$ = this.jQuery = jQuery.noConflict(true);


$(document).ready(function() {

  // When we mouse over the image then, if we are on the first or third page
  // set focus on the image by clicking the pan button.
  // Do not do this on the second page as we need to have the pointer selected on that page
  $(document).on("mouseenter",".subject-container",function(){ 
      if ($(".question p")[0].innerHTML == 'Is there an asteroid trail visible in the images?') {
        var pan=$(".fa-arrows")
        pan.click()
      }

      if ($(".question p")[0].innerHTML == 'Is there any other asteroid trail visible in the image?') {
        var pan=$(".fa-arrows")
        pan.click()
      }
    });

  // Invert image if the user presses the I key
  $(document).on("keydown", function(event) {
    if (event.which == 73) {
      if (window.location.pathname == '/projects/sandorkruk/hubble-asteroid-hunter/classify') {
        $(".secret-button")[1].click()
      }
    }
  });


});

