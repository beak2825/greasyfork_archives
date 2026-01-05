// ==UserScript==
// @name        Hide Blocked ComicVine Users' Posts
// @namespace   http://baron-chronos.tumblr.com/
// @description Causes the posts made by users you've blocked on ComicVine, to be hidden by default, with an option to view them. (When you block a user, you may need to refresh the page for their posts to be hidden.)
// @include     *comicvine.gamespot.com*
// @version     1
// @grant       GM_addStyle
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/27309/Hide%20Blocked%20ComicVine%20Users%27%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/27309/Hide%20Blocked%20ComicVine%20Users%27%20Posts.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(function(){
  $("div.js-message").each(function(){ //Iterates through every post on the current page.
    var currentPost = $(this);
    var userName = currentPost.find("div.message-wrap > div.message-inner > div.message-title > a.message-user").text(); //Retrieves the name of the user whose post it is.
    var blockStatus = currentPost.find("div > div > dl > dd > form[name='user_block'] > button > span").text(); //Will return either "Block" (indicating the user isn't currently blocked) or "Unblock" (indicating that they are currently blocked).
    if (blockStatus == "Unblock") { //if the user is currently blocked, then...
      currentPost.wrap("<div class='cv-blocked-field'></div>"); //Wraps the post in a block.
      currentPost.before("<p class='cv-hidden-post'>Post by <em>" + userName +
                         "</em> was hidden. <a class='cv-toggle-post'>Toggle view.</a></p>");
      //Adds text and a link to toggle the post's view.
      currentPost.hide(); //Hides the post's content.
    }
  });
  
  $("a.cv-toggle-post").click(function(event){ //When the "Toggle view" link is clicked, then...
    $(this).parent().siblings("div.message.js-message").toggle(); //Toggles the view of the post.
  });
  
  $("div.cv-blocked-field").css({ //Sets some style rules.
    'margin': '3px 3px 15px 3px',
    'padding': '5px'
  }); $("div.cv-blocked-field div.js-message").css({
    'margin-bottom': '5px'
  }); 
  
  if ($("link#skin-color").attr("href").indexOf("black") > -1) { //if the black color scheme is used, then, use following style rules...
    $("div.cv-blocked-field").css({
      'border': '3px solid #111',
      'background': '#222',
    });
  } else { //if the white color scheme is used, then, use these styles instead...
    $("div.cv-blocked-field").css({
      'border': '3px solid #CCC',
      'background': '#EEE',
    });
  }
});