// ==UserScript==
// @name        Pluralsight Continuous Play Updated
// @description Auto play next module after the end of current module.
// @author      Paul Jacoby
// @include     https://app.pluralsight.com/*
// @version     2
// @namespace https://greasyfork.org/users/393755
// @downloadURL https://update.greasyfork.org/scripts/391812/Pluralsight%20Continuous%20Play%20Updated.user.js
// @updateURL https://update.greasyfork.org/scripts/391812/Pluralsight%20Continuous%20Play%20Updated.meta.js
// ==/UserScript==

//Based on another source code found at: https://github.com/John-Blair/pluralsight/blob/master/auto-click-continue-to-next-module-button.js
//The original code needed to be copy/pasted into the console window. Modified to work in greasemonkey(tested in Firefox).

console.log('[start]Pluralsight Continuous Play');

//Could use the attribute @require https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js 
//The @require would simplify the script with no need to use the following window.onload event
window.onload = function () {

  if ( !window.jQuery ) {
    var dollarInUse = !!window.$;
    var s = document.createElement('script');
    s.setAttribute('src', '//ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js');
    s.addEventListener('load', function(){
      console.log('jQuery loaded!');

      if(dollarInUse) {
        jQuery.noConflict();
        console.log('`$` already in use; use `jQuery`');
      }
    });

    document.body.appendChild(s);
  }

};
      setInterval(function () {
        try
        {
          //reference the jQuery already included on a site
          var $ = unsafeWindow.jQuery; //https://stackoverflow.com/questions/859024/how-can-i-use-jquery-in-greasemonkey
          //click the continue to next module button
          $("button[data-css-1srt63x]:visible").click(); //thanks to John Blair @ https://github.com/John-Blair/pluralsight/blob/master/auto-click-continue-to-next-module-button.js
        }
        catch (e)
        {
          console.log(e);
        }
      }, 5000); //for my testing the time interval could be 1000 with no noticable impact and lowered the wait time to next module
