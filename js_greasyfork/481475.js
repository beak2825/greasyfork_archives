// ==UserScript==
// @name         Shazam Content
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Optimize Shazam artist and title for copy and paste
// @author       You
// @match        https://www.shazam.com/track/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shazam.com
// @grant        none
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/481475/Shazam%20Content.user.js
// @updateURL https://update.greasyfork.org/scripts/481475/Shazam%20Content.meta.js
// ==/UserScript==

$(document).ready(function(){
    /*
    $('h1').parent().append('<input id="title_fix" type="text" style="width: 100%; font-size: 20px;">');
    console.log($('h1').text());
    */
});

function checkElement() {
  if ($('h1').length) {
      clearInterval(checkInterval);
    //console.log($('h1').text());
      //$('.details').append('<table border="1"><tr><td>Column 1</td><td>Column 2</td></tr></table>');



      //$('h2.artist').css('width',"50%");
      title = $('h1').text();
      artist = $('h2.artist').text().trim();
      combined = artist + " - " + title;
    //$('h1').parent().append('<br><br><input id="title_artist" type="text" style="width: 100%; font-size: 20px;"><br><br>');
    $('h1').replaceWith('<br><br><input id="title_box" type="text" style="width: 100%; font-size: 20px;"><br><br>');
    $('h2.artist').replaceWith('<input id="artist_box" type="text" style="width: 100%; font-size: 20px;"><br><br><input id="combined_box" type="text" style="width: 100%; font-size: 20px;">');
      $('#title_box').val(artist);
      $('#artist_box').val(title);
      $('#combined_box').val(combined);
    // Stop the interval because you don't need to keep checking

  }
}

// Set up an interval to check for the element
const checkInterval = setInterval(checkElement, 1000);