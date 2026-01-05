// ==UserScript==
// @name     _Remove blacklisted comments
// @include  http://hypnohub.net/comment*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @description Hide comments on blacklisted posts 
// @version 0.0.1.20160215200848
// @namespace https://greasyfork.org/users/30490
// @downloadURL https://update.greasyfork.org/scripts/17106/_Remove%20blacklisted%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/17106/_Remove%20blacklisted%20comments.meta.js
// ==/UserScript==
 
 $( document ).ready(function() {
var badDivs = $(".post");
for (i = 0; i < badDivs.length; i++) {
    var string = badDivs.eq(i).find('img:first').attr('src');
    console.log(string);
    if(string)
    {
    substring = "blacklist";
    if(string.indexOf(substring) > -1)
    {
        badDivs.eq(i).hide ();
    }
    }
}
});