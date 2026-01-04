// ==UserScript==
// @name     YouTube Studio Scheduled Date Visual Enhancer
// @description Sort YouTube Studio videos by scheduled and published date easier through visual cues (border and bgcolor)
// @version  2
// @grant    none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @match https://studio.youtube.com/channel/*/videos/upload*
// @namespace ปวัตน
// @downloadURL https://update.greasyfork.org/scripts/426865/YouTube%20Studio%20Scheduled%20Date%20Visual%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/426865/YouTube%20Studio%20Scheduled%20Date%20Visual%20Enhancer.meta.js
// ==/UserScript==
console.log("YouTube Studio Scheduled Date Visual Enhancer running");
window.addEventListener('load', function() {

this.$ = this.jQuery = jQuery.noConflict(true);
var timerVar    = setInterval (function() {DoMeEverySecond (); }, 5000);

function isOdd(num) { return num % 2;}
  
function DoMeEverySecond ()
{
  dayPrev=0;
  $("ytcp-content-section#video-list div.video-table-content ytcp-video-row").each(function() {
  	cell = $(this).find("div#row-container div.tablecell-date")
  	description = $(cell).find("div.cell-description").text().trim();
    visibility = $(this).find("#row-container div.tablecell-visibility span.label-span").text().trim();
    console.log(visibility);
    if (description == "Scheduled" || description == "Published") {
      day = $(cell).text().trim().split(",")[0].split(" ")[1];
      // border
      if (day != dayPrev) {
        $(this).find("#row-container").css("border-top", "solid black 3px");
      } else {
        $(this).find("#row-container").css("border-top", "solid black 0px");
      }
      dayPrev = day;
      // bg
      if (isOdd(day)) {
        if (visibility == "Public") {
          $(this).find("#row-container").css("background-color", "#ada");
        } else {
          $(this).find("#row-container").css("background-color", "#ddd");
        }
      } else {
        if (visibility == "Public") {
          $(this).find("#row-container").css("background-color", "#dfd");
        } else {
        	$(this).find("#row-container").css("background-color", "transparent");
        }
      }
    }
  });
}

//--- When ready to stop the timer, run this code:
//clearInterval (timerVar);
//timerVar        = "";
  
}, false);