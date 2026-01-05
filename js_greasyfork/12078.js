// ==UserScript==
// @name        Empornium All-in script
// @description Empornium all in script.
// @namespace   asd
// @include     *.empornium.me*
// @exclude     *.empornium.me/torrents.php?id=*
// @exclude     *.empornium.me/forums.php*
// @exclude     *.empornium.me/top10.php
// @require     http://code.jquery.com/jquery-1.11.3.min.js
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12078/Empornium%20All-in%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/12078/Empornium%20All-in%20script.meta.js
// ==/UserScript==

/*
 * Replaces category icons with text. 
 */
function replaceImagesWithText(){
  $(".cats_col >div").each(function(key, value){
    var categoryText = $(value).attr("title");
    $(value).text(categoryText);
    $(value).css("text-align", "left");
  });

}

/*
 * Removes uploader's column from torrents.php 
 * You'll have a lot more space there
 */
function removeUploader(){
  $(".colhead > td:nth-child(10)").hide();
  $("td.user").hide();
}

/*
 * According to number of seeders (or ratio) 
 *  the uploader's column is colored red/yellow/green.
 */
function checkSeeders(){
  $(".torrent > td:nth-child(8)").each(function(key,value){
    var val = $(value).text();
    var leechers = $(value).next().text();
    if( val == 0  || (val/leechers) < 0.4){
      $(value).css("background-color", "#c84f4f");
      $(value).css("color", "#000");
    } else if ( (val > 0) && (val < 8) ) {
      $(value).css("background-color", "#ead575");
    } else {
      $(value).css("background-color", "#8ecc60");
    }
  });
}

/*
 * Pushes download icon left to the title
 */
function downloadIconToLeft(){
  $(".torrent > td:nth-child(2) > span").css({
    "float": "left",
    "padding-right": "5px"
  });
}

/*
 * Highlights your favorite tags to see them instantly on torrents.php
 * Usage: 
 *  - Add your favorite tags to "tagsToHighlight", the following way:
 *  - ["Tag name", "Tag's background color (default: dark green)"], 
 *  - After the last element, don't put comma
 */
function highlightFavoriteTags(){
  var tagsToHighlight = [
    ["anal", "#ff0000"],          //1. favorite tag: anal, background color is #ff0000
    ["oral.creampie", "#00ff00"], //2. favorite tag: oral.creampie, background color is #00ff00
    ["hardcore"],                 //3. favorite tag: hardcore, background color is default
    ["mydirtyhobby.com"]          //4. favorite tag: mydirtyhobby.com, default background
  ];

  $('.tags > a').each(function(key, value){
    for (var i = 0, len = tagsToHighlight.length; i < len; i++) {
      if($(value).text() == tagsToHighlight[i][0]){
        $(value).css("background-color" , tagsToHighlight[i][1] ? tagsToHighlight[i][1] : "#4E9C68");
        $(value).css("color" , "#fff");
        $(value).css("padding-left" , "5px");
        $(value).css("padding-right" , "5px");
        $(value).css({
           "border-radius": "10px",
           "-moz-border-radius": "10px",
           "-webkit-border-radius": "10px"
        });
      }
    }
  });
}

//replaceImagesWithText(); - if you don't want to use a function, just comment it out.
removeUploader();
checkSeeders();
downloadIconToLeft();
highlightFavoriteTags();
