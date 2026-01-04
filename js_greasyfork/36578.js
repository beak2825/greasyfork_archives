// ==UserScript==
// @name        botlike4like
// @namespace   like4like
// @description like4like antibot deleter
// @include     http://www.like4like.org/free-facebook-likes.php
// @include     http://www.like4like.org/user/earn-facebook-subscribes.php
// @include     http://www.like4like.org/user/earn-facebook-shares.php
// @include     http://www.like4like.org/user/earn-youtube-subscribe.php
// @include     http://www.like4like.org/user/earn-youtube.php
// @include     http://www.like4like.org/free-twitter-followers.php
// @include     http://www.like4like.org/user/earn-twitter-retweet.php
// @include     http://www.like4like.org/user/earn-twitter-favorites.php
// @include     http://www.like4like.org/user/earn-stumbleupon-follow.php
// @include     http://www.like4like.org/user/earn-google-circles.php
// @include     http://www.like4like.org/user/earn-google.php
// @include     http://www.like4like.org/user/earn-google-plus.php
// @include     http://www.like4like.org/user/earn-pinterest-follow.php
// @include     http://www.like4like.org/user/earn-pinterest-like.php
// @include     http://www.like4like.org/user/earn-pinterest-repin.php
// @include     http://www.like4like.org/user/earn-soundcloud-like.php
// @include     http://www.like4like.org/user/earn-soundcloud-follow.php
// @include     http://www.like4like.org/free-instagram-followers-likes-and-comments-exchange.php
// @include     http://www.like4like.org/user/earn-instagram-like.php
// @include     http://www.like4like.org/user/earn-myspace-connect.php
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/36578/botlike4like.user.js
// @updateURL https://update.greasyfork.org/scripts/36578/botlike4like.meta.js
// ==/UserScript==

$('a').each(function(){
   if($(this).css('background-image')=='url("http://www.like4like.org/img/icon/earn-facebook-like-antibot.png")'){
       $(this).parent().remove();
   } 
});
$('a').each(function(){
   if($(this).css('background-image')=='url("http://www.like4like.org/img/icon/earn-youtube-antibot.png")'){
       $(this).parent().remove();
   } 
});
$('a').each(function(){
   if($(this).css('background-image')=='url("http://www.like4like.org/img/icon/earn-twitter-antibot.png")'){
       $(this).parent().remove();
   } 
});
$('a').each(function(){
   if($(this).css('background-image')=='url("http://www.like4like.org/img/icon/earn-google-circles-435912.png")'){
       $(this).parent().remove();
   } 
});
waitForKeyElements (
    "img[src*='earn-google-circles-435912']",
    hideNode
);

function hideNode (jNode) {
    jNode.hide ();
}