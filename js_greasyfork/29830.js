// ==UserScript==
// @name         Remix Rotation Get Music
// @namespace    http://remixrotation.com/
// @version      0.1
// @description  Get list of full-length music from remix rotation
// @author       nascent
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @match        http://remixrotation.com/*
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/29830/Remix%20Rotation%20Get%20Music.user.js
// @updateURL https://update.greasyfork.org/scripts/29830/Remix%20Rotation%20Get%20Music.meta.js
// ==/UserScript==
(function() {
    'use strict';
var output = "";

    
    
$(document).ready(function() {
    
    GM_addStyle ( "button {  margin-top: 0px;  line-height: 20px;  font-weight: bold;  padding: 0 40px;  background: lightblue;  border: none;}button:hover {  background: blue;}");
   
                 
                 // 1. Create the button
var button = document.createElement("button");
button.innerHTML = "Get Youtube Links";

// 2. Append somewhere
//var body = document.getElementsByTagName("body")[0];
//body.appendChild(button);
document.body.insertBefore(button, document.body.firstChild);


// 3. Add event handler
button.addEventListener ("click", function() {
  $('#playlist tr').each(function() {
      $(this).find('td:nth-child(1)').each (function() {
        //alert(this.title);
          //alert($(this).text());
          //alert(this.href);
          //alert($(this).attr('href'));
          //alert($(this).find('a').attr('href'));
          //alert($(this).find('.data-song-url').text());
          //alert($(this).html());
          var code = $(this).html();
    var song = code.match(/data-song-info=\"(.+?)\"/); 
    var youtubeURL = code.match(/data-song-url=\"(.+?)\"/); 
          //alert(song[1] +'\n' + youtubeURL[1]);
          if (youtubeURL) {
              console.log(youtubeURL[1]);
              output = output +' ' + youtubeURL[1];
          }
          //alert($(this).find('.play').html);
          //$(this).find('td:nth-child(1)').each (function() {
              //$.each(this.attributes, function(i,attrib){
             //    alert(attrib.name  + " " + attrib.value);
              //});
          //});
          //alert($(this).find('play-button').attr('data-song-url'));
          //alert($(this).data("data-song-url"));
          //alert($(this).children('td').eq(1).attr("text"));
         
          //return false;
      }); 
      //return false;
    //
  });
        alert(output);
    var link = document.createElement('a');
link.setAttribute('href', 'data:text/plain,'+output);
link.setAttribute('download', 'example.txt');
link.click();
});
});

    
  

})();