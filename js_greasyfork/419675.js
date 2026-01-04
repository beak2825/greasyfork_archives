// ==UserScript==
// @name        Image Popup - usasexguide.nl
// @namespace   Violentmonkey Scripts
// @match       http://www.usasexguide.nl/forum/*
// @match       https://www.usasexguide.nl/forum/*
// @match       http://www.internationalsexguide.nl/forum/*
// @match       https://www.internationalsexguide.nl/forum/*
// @grant       none
// @version     1.1.2
// @author      -
// @description Display attached images in a lightbox and remove ads
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/419675/Image%20Popup%20-%20usasexguidenl.user.js
// @updateURL https://update.greasyfork.org/scripts/419675/Image%20Popup%20-%20usasexguidenl.meta.js
// ==/UserScript==

let $head = document.querySelector('head')
let $link = document.createElement('link')
$link.rel = 'stylesheet'
$link.href = '//cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css'
let $script = document.createElement('script')
$script.type = 'text/javascript'
$head.append($link)
$head.append($script)
$script.onload = () => {
  jQuery('.attachments .postcontent a').addClass('glightbox')
  jQuery('.isgThumbnail.Attachment td>a').addClass('glightbox')
  jQuery('#attachmenttable td>a').addClass('glightbox')
  let lightbox = GLightbox({ height: 648 })
  console.log('done')
}
$script.src = '//cdn.jsdelivr.net/gh/mcstudios/glightbox/dist/js/glightbox.min.js';

// Noise Removal
(function() {
var css = `
.isg_background_border_banner,
.isg_banner,
#header a.logo-image,
#uiISGAdFooter,
#toplinks + div,
#navtabs li:nth-child(6),
#navtabs li:nth-child(7),
#navtabs li:nth-child(8),
#navtabs li:nth-child(9),
.below_body,
#isg_overlayDiv,
#isg_shadowDiv,
#isg_popupDiv,
#thread_000
{
  display: none;
}
#postlist .isg_background_border_banner.isg_Blog {
  display: block !important;
}
#pagination_top form.pagination {
  float: left !important;
}
.postrow {
  line-height: 1.3;
}
#postpagestats_above {
  float: none !important;
}
`;
if (typeof GM_addStyle != "undefined") {
  GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
  PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
  addStyle(css);
} else {
  var node = document.createElement("style");
  node.type = "text/css";
  node.appendChild(document.createTextNode(css));
  var heads = document.getElementsByTagName("head");
  if (heads.length > 0) {
    heads[0].appendChild(node);
  } else {
    // no head yet, stick it whereever
    document.documentElement.appendChild(node);
  }
}

// Kill the first-click pop-under
window.initPu = () => {}

// Kill the new first-click pop-under - 2022-09-13
setCookieISG('popundrisg', 24*365)

// Kill the isg_overlay popover - 2022-11-21
setCookieISG('popupoverlayisg', 24*365)
})();
