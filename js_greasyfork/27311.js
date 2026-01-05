// ==UserScript==
// @name        Enable Animated Avatars: Expanded
// @namespace   http://baron-chronos.tumblr.com/
// @description Those who use gifs as their avatars on ComicVine, will now have their avatars' animations activated. In addition, all avatars will be enlarged.
// @include     *comicvine.gamespot.com*
// @version     1
// @grant       GM_addStyle
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/27311/Enable%20Animated%20Avatars%3A%20Expanded.user.js
// @updateURL https://update.greasyfork.org/scripts/27311/Enable%20Animated%20Avatars%3A%20Expanded.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(function(){
  $("div.js-message").each(function(){ //Iterates through every post on the current page.
    var currentPost = $(this);
    var userName = currentPost.find("div.message-wrap > div.message-inner > div.message-title > a.message-user"); //Retrieves the name of the user whose post it is.
    var currentAvatar = currentPost.find("div.avatar-user > a.avatar > img"); //Gets the current avatar.
    var avatarSrc = currentAvatar.attr("src");
    var largerAvatar = currentAvatar.attr("src").replace("square_avatar", "square_medium"); //ComicVine, on uploading an animated gif, creates multiple, different-sized versions of the image, some of which (such as the avatar-sized) are not animated. This line of code gets the URL of an animated, if larger, version of the avatar. For avatars that are not animated...well, it just retrieves a larger version.
    currentAvatar.attr("src", largerAvatar); //This line replaces the avatar with its animated/larger counterpart.
    currentPost.find("div.message-wrap").css("margin-left","120px"); //Pushes the post a little to the side, to make room for the resized avatar.
    currentAvatar.css("min-width","100px").css("min-height","100px"); //Resizes the avatar.
    currentPost.find("div.avatar-user > div.avatar-user-actions").css("padding-left","50px"); //Pushes the hover-menu a little to the side.
  });
});