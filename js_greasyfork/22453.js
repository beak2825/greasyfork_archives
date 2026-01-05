// ==UserScript==
// @author       TenATaco
// @name         KissAnime Video Expander
// @namespace    http://kissanime.to/
// @version      1.2.0
// @description  Remove the page background and expands the video player while watching videos on KissAnime. It's like full screen without full screen.
// @include      *kissanime.*/Anime/*/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/22453/KissAnime%20Video%20Expander.user.js
// @updateURL https://update.greasyfork.org/scripts/22453/KissAnime%20Video%20Expander.meta.js
// ==/UserScript==

/* Save the video do that it does not get removed with the page. */
var save = $('#divContentVideo').detach();

/* Delete the page content */
$('body').remove();

/* Add the video back (save) */
$('html').append(save);

/* Change the player to your screen w/h */
$( document.getElementsByTagName('iframe')[0] ).css({
    "width": window.innerWidth,
    "height": window.innerHeight
});



/* Resize the player with your screen */
$( window ).resize(function() {
    $( document.getElementsByTagName('iframe')[0] ).css({
        "width": $( window ).width(),
        "height": $( window ).height()
    });
});

/* Trick the player into thinking you're in full screen! */
$(".vjs-control-bar").remove();
$("#my_video_1_html5_api").prop({
  controls: true
});