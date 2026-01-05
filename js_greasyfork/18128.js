// ==UserScript==
// @name        SuperRoach
// @namespace   http://www.gamestah.com
// @description Gamestah automation helper
// @include     http://www.gamestah.com/wp-admin/post-new.php
// @include     https://www.gamestah.com/wp-admin/post-new.php
// @author      Brett James
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18128/SuperRoach.user.js
// @updateURL https://update.greasyfork.org/scripts/18128/SuperRoach.meta.js
// ==/UserScript==
//this.$ = this.jQuery = jQuery.noConflict(true);

var datathing
$(document).ready(function ()
{
  
  

  var youtube_HTTP = prompt('Paste your youtube website');
  //var youtube_HTTP = 'https://www.youtube.com/watch?v=3FY2_EP7-F0';
  var youtube_ID;

  function youtube_parser(url) {
    var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
      return match[2];
    }
  }
  if (youtube_HTTP != null) {
    youtube_ID = youtube_parser(youtube_HTTP);
  }
  
 
  
  $.getJSON("https://www.googleapis.com/youtube/v3/videos?part=snippet&id="+ youtube_ID +"&key=AIzaSyA7YJ4FDhYGZ-EYyt0LPegi_AI3YYNs3Ew", function (data) {
    
    //Prepare data 
    var youtube_thumbnail = data.items[0].snippet.thumbnails.maxres.url;
    var youtube_title = data.items[0].snippet.title;
    var youtube_description = data.items[0].snippet.description;
    var youtube_publishdate = data.items[0].snippet.publishedAt;
    var youtube_tags = data.items[0].snippet.tags.toString()
    
    // Check to see what game it is.
    var rocket_league_regexp = new RegExp(/Rocket league| RL /i)
    var rocket_league = rocket_league_regexp.test(youtube_title)    
    
    var results = $("<div id=\"yt_results\" style=\" border-radius: 5px; display: block; padding: 0px 0px 2px 5px; margin: 5px; background: rgb(221, 153, 51) none repeat scroll 0% 0%; border: 3px solid rgb(149, 191, 58); \"><h4>Youtube video found: " + youtube_title + "</h4><p>This is the highres thumbnail. <a href=\""+ youtube_thumbnail +"\"><img src=\"" + youtube_thumbnail + "\" width=120 width=90> Save and use it! </a></p><p>To finish up, please set this image as the featured image (bottom right), and type in the casters names one at a time in the Cactus Channel below</p></div>");
    $('#poststuff').prepend(results);
    $('#yt_results').hide().show('slow');
    $('#tm_video_url-cmb-field-0').val(youtube_HTTP); // youtube url
    
    // Set the Page Title
    $('#title').val(youtube_title);
    
    // Set the Description
    $("#content-html").click();
    $("#content").val(youtube_description); 
    $("#content-tmce").click() // Go back to visual when done
    // Click the button to make the post be a video
    $("#post-format-video").click()
    
    if (rocket_league) 
      {
        $("#in-popular-category-287").click();
        $("#new-tag-post_tag").val(youtube_tags) 
        // Add the tags
        $("input.button.tagadd").click();
        
      }

    
  });
});