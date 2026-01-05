// ==UserScript==
// @name     _Remove blacklisted avatars
// @include  http://hypnohub.net/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @description Remove avatars on your blacklist
// @version 0.0.1.20160215195946
// @namespace https://greasyfork.org/users/30490
// @downloadURL https://update.greasyfork.org/scripts/17105/_Remove%20blacklisted%20avatars.user.js
// @updateURL https://update.greasyfork.org/scripts/17105/_Remove%20blacklisted%20avatars.meta.js
// ==/UserScript==
 
$( document ).ready(function() {
var avatars = $(".hhhz-avatar-anchor");
console.log(avatars);
for (i = 0; i < avatars.length; i++) {
    console.log("TEST");
    console.log(avatars[i]);
    var string = avatars.eq(i).attr("class").split(' ')[0].substring(2);
    if(Post.is_blacklisted(string))
    {
        avatars.eq(i).hide ();
    }
}
});