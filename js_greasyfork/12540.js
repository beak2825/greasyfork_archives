// ==UserScript==
// @name        APUG.org show image keyboard control
// @namespace   http://oscar.carlsson.photography/
// @description Keyboard navigation for APUG user gallery images.
// @include     http://www.apug.org/gallery1/showimage.php?i=*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12540/APUGorg%20show%20image%20keyboard%20control.user.js
// @updateURL https://update.greasyfork.org/scripts/12540/APUGorg%20show%20image%20keyboard%20control.meta.js
// ==/UserScript==
function find_links() {
  links = {};
  
  $('div.smallfont a').each(function (e) {
    if ($(this) [0].textContent === 'Previous Image')
      links.prev = $(this) [0];

    if ($(this) [0].textContent === 'Next Image')
      links.next = $(this) [0];
  });
  return links;
}

function upwards() {
  var breadcrumbs = $('div#breadcrumb li.navbit'),
      previous = null;
  for (var index = 0; index < breadcrumbs.length; index++) {
    var breadcrumb = breadcrumbs[index],
        classes = breadcrumb.className.split(/\s+/);
    
    if ($.inArray('lastnavbit', classes) === - 1) {
      previous = breadcrumb;
      continue;
    } else {
      // fetch link from the previous element
      var children = $(previous).children();
      for (var idx = 0; idx < children.length; idx++) {
        var child = children[idx],
        url = child.href;
        if (url) window.location.assign(url);
      }
    }
  }
}

$(window).keyup(function (e) {
  var key = e.keyCode;

  if (key == 39 || key == 37)
    var links = find_links();

  if (key == 37) {
    window.location.assign(links.prev.href);
    return;
  }
  if (key == 39) {
    window.location.assign(links.next.href);
    return;
  }
  if (key == 85) { // u
    upwards();
    return;
  }
});
