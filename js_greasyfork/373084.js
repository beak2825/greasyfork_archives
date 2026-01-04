// ==UserScript==
// @name        sis.img.slideshow
// @description slide show
// @namespace   zhang
// @include     http://www.sexinsex.net/bbs/viewthread.php?*
// @include     http://www.sexinsex.net/bbs/thread*.html
// @include     http://www.sis001.com/forum/viewthread.php?*
// @include     http://www.sis001.com/forum/thread*.html
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/373084/sisimgslideshow.user.js
// @updateURL https://update.greasyfork.org/scripts/373084/sisimgslideshow.meta.js
// ==/UserScript==
function preventDefault(e) {
  e.preventDefault();
}

function toggle_slideshow(e) {
  //console.dir(e);
  var message = e.currentTarget; //.parentElement;
  if (message.className.indexOf('slideshow') < 0) {
    message.className = message.className + ' slideshow';
  } else {
    message.className = message.className.replace(' slideshow', '');
  }
  e.preventDefault();
  //console.log(message);
}

function slideshow_on(e) {
  //console.log(e.type, e.target);
  //console.dir(e);
  var message = e.target; //.parentElement;
  if (message.className.indexOf('slideshow') < 0) {
    message.className = message.className + ' slideshow';
  } else {
    message.className = message.className.replace(' slideshow', '');
  }
  //console.log(message);
}

var messages = document.querySelectorAll('.t_msgfont');
console.log(messages.length);
for (var i = 0; i < messages.length; i++) {
  var message = messages[i];
  message.addEventListener('mousedown', preventDefault);
  message.addEventListener('dblclick', toggle_slideshow);
  var images = message.querySelectorAll('img');
  console.log(message.id+" has "+images.length+" images.");
	for (var j = 0; j < images.length; j++) {
    var image = images[j];
    image.removeAttribute("onclick");
  }
}

document.onclick = undefined;