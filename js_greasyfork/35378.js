// ==UserScript==
// @name Google Image Reminder
// @namespace eiou
// @description Popup reminder on Google images
// @include *.google.*tbm=isch*
// @include *.google.*tbm=vid*
// @include *.google.*tbs=sbi*
// @version 2.0
// @grant none
// @require		https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/35378/Google%20Image%20Reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/35378/Google%20Image%20Reminder.meta.js
// ==/UserScript==

// Title
//var title = 'Bonds > Pixels';
var title = 'Google Image Reminder';

// Text
//var text = 'P is a supernormal stimulus trap. Like a pitcher plant: Attractive and easy, but harmful and deadly.';
//var text = 'Porn is a parasitic worm.';
//var text = 'Porn is anti-family.';
var html = `<div style="text-align:left;">When I haven't PMed, ... 
<br><br>
I feel confident and refreshed when I go outside. When I see a girl, I don't feel perverted, guilty, or ashamed. 
<br><br>
For my students, I feel energetic, fun, and cheerful. 
<br><br>
I want to keep those feelings and remember them when my body goes into automatic addiction mode.<div>`;

// Hide pictures
var style_images = $('<style>#main div { visibility: hidden !important; }</style>');
style_images.appendTo('head')

// Hide popup button
var style_button = $('<style>.swal-btn-hidden { visibility: hidden; }</style>');
style_button.appendTo('head')

$.getScript("https://unpkg.com/sweetalert2", function() {
  swal({
    title: title,
    //text: text,
    html: html,
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    confirmButtonClass: 'swal-btn-hidden'
  }).then((result) => {
    // Show pictures
    style_images.remove();
  })
  
  // Show popup button
  setTimeout(function() {
    style_button.remove();
  }, 3000)
});
