// ==UserScript==
// @name			Tumblr Greentext
// @namespace		http://pisspasta.tumblr.com/
// @version			1.0
// @author			dripdad
// @description		Meme arrows, bitch.
// @icon			https://pbs.twimg.com/profile_images/467963365172576256/_5NLD8Uq_normal.jpeg
// @include			https://www.tumblr.com/blog*
// @include			https://www.tumblr.com/dashboard*
// @include			https://www.tumblr.com/inbox*
// @include			https://www.tumblr.com/tagged*
// @include			https://www.tumblr.com/likes*
// @include			https://www.tumblr.com/reblog*
// @include			https://www.tumblr.com/settings*
// @include			https://www.tumblr.com/explore*
// @include			https://www.tumblr.com/privacy*
// @include			https://www.tumblr.com/search*
// @require			http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @grant			none
// @downloadURL https://update.greasyfork.org/scripts/377476/Tumblr%20Greentext.user.js
// @updateURL https://update.greasyfork.org/scripts/377476/Tumblr%20Greentext.meta.js
// ==/UserScript==

$('p').filter(
    function() {
        return $(this).text().substring(0, 1) == '>';
    }).addClass('greentext');

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('.greentext {color: #789922 !important}');
