// ==UserScript==
// @name         AO3: [Wrangling] Highlight Old Tags
// @description  Highlights the created date of older tags in your unwrangled bins.
// @version      1.2.1

// @author       kaerstyne
// @namespace    https://github.com/kaerstyne/ao3-wrangling-scripts
// @license      GPL-3.0 <https://www.gnu.org/licenses/gpl.html>

// @match        *://*.archiveofourown.org/tags/*/wrangle?*&status=unwrangled
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38866/AO3%3A%20%5BWrangling%5D%20Highlight%20Old%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/38866/AO3%3A%20%5BWrangling%5D%20Highlight%20Old%20Tags.meta.js
// ==/UserScript==

// SETTINGS //

// Colors to use for different tag ages.
// By default, new tags don't change color, older tags are yellow, and the oldest tags are red.

// Default site skin
var color_new = ""; // default: "" or #C4EAC3
var color_older = "#FDF2A3"; // default: #FDF2A3
var color_oldest = "#FFB7B7"; // default: #FFB7B7
// Reversi or other dark skin
var color_new_rev = ""; // default: "" or #228B22
var color_older_rev = "#999900"; // default: #999900
var color_oldest_rev = "#8B0000"; // default: #8B0000

// Number of days before a tag is considered old.
// By default, older tags are 7+ days old, and the oldest tags are 14+ days old.
var age_older = 7;
var age_oldest = 14;

// END OF SETTINGS //


// DO THE THING //

// https://stackoverflow.com/questions/4259815/how-do-i-detect-the-inherited-background-color-of-an-element-using-jquery-js
function getBackgroundColor(jqueryElement) {
  var color = jqueryElement.css("background-color");
    if (color !== "rgba(0, 0, 0, 0)") {
      return color;
    }
    if (jqueryElement.is("body")) {
      return false;
    } else {
      return getBackgroundColor(jqueryElement.parent());
    }
}

// http://wowmotty.blogspot.com/2009/06/convert-jquery-rgb-output-to-hex-color.html
// https://24ways.org/2010/calculating-color-contrast/
function isDarkMode(rgbcolor){
  rgbcolor = rgbcolor.replace(/\s/g,'').match(/^rgba?\((\d+),(\d+),(\d+)/i);
  var hexcolor = ("0" + parseInt(rgbcolor[1],10).toString(16)).slice(-2) +
    ("0" + parseInt(rgbcolor[2],10).toString(16)).slice(-2) +
    ("0" + parseInt(rgbcolor[3],10).toString(16)).slice(-2);
  return (parseInt(hexcolor, 16) > 0xffffff/2) ? false:true;
}

(function($) {

  // swap colors if using a darker color scheme
  var bgcolor = getBackgroundColor($("td[title='created']"));
  if (isDarkMode(bgcolor) === true) {
    color_new = color_new_rev;
    color_older = color_older_rev;
    color_oldest = color_oldest_rev;
  }

  var date_today = new Date();
  $( "td[title='created']" ).each( function( index, element ){
    var date_created = new Date($( this ).text());
    var tag_age = (date_today - date_created)/(1000*60*60*24);

    if (tag_age >= age_oldest) {
      $( this ).wrapInner("<span style=\"background-color:" + color_oldest + "\"></span>");
    } else if (tag_age >= age_older) {
      $( this ).wrapInner("<span style=\"background-color:" + color_older + "\"></span>");
    } else if (color_new !== "") {
      $( this ).wrapInner("<span style=\"background-color:" + color_new + "\"></span>");
    }
  });
})(jQuery);
