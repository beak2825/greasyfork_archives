// ==UserScript==
// @name         Cityvibe Enhancer
// @namespace    cityvibe_enhancer
// @homepage     https://sleazyfork.org/scripts/15481
// @version      0.8
// @description  Increases the image sizes of slideshows and main profile image and adds keybindings for slideshow and escort navigation.
// @author       m435tr0d
// @match        http://*.cityvibe.com/*/Premium/*/
// @match        http://*.cityvibe.com/*/Premium/*/*/*
// @match        http://*.cityvibe.com/*/Escorts/*/*
// @match        http://*.cityvibe.com/*/Escorts/
// @exclude      http://*.cityvibe.com/*/Premium/*/Classic/
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/15481/Cityvibe%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/15481/Cityvibe%20Enhancer.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

function setStyles() {
  document.getElementById('body_div_id').style.width = 'auto';
  GM_addStyle(`
.listing-display-grid-gallery a.image-link .thumbnail-name {
  font-weight: bold;
}
.listing-display-grid-gallery a.image-link:visited .thumbnail-name {
  font-weight: normal!important;
}
#image_gallery_images_div_id {
  max-height: none !important;
}
#image_gallery_image_prev_id,
#image_gallery_image_next_id {
  top: 24px;
  height: 100%;
}
.post-contact-image-container {
  padding-left: 0;
}
.post-default-image-container {
  position: relative;
}
.post-default-image {
  width: auto;
  height: auto;
}
.post-default-image img {
  width: 100%;
  height: auto;
}
.listings-display-container .column-right {
  display: none;
}
.listings-display-container .column-main-left,
.column-main-left .column-main-content {
  margin-right: 0;
}
.listing-display-grid-gallery .thumbnail-name {
  color: inherit;
}
  `);
}

var target = document.querySelector('head > title');
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    setStyles();
  });
});
observer.observe(target, { subtree: true, characterData: true, childList: true });

setStyles();

document.onkeydown = function (e) {
  e = e || window.event;
  var keyCode = e.keyCode || e.which,
      arrow = {left: 37, up: 38, right: 39, down: 40 };

  if (e.ctrlKey) {
    switch (keyCode) {
      case arrow.left:
      case arrow.right:
        var direction = (keyCode == arrow.left) ? 'prev' : 'next';
        var icon = document.getElementById('image_gallery_image_' + direction + '_id');
        if (icon && icon.style.display != 'none') {
          icon.click();
        }
        break;
      case arrow.up:
      case arrow.down:
        var selected = document.querySelector('#premium_category_sidebar_scroller_id div.listing-display-grid-row.selected');
        var parent = selected.parentNode;
        var direction = (keyCode == arrow.up) ? 'previousElementSibling' : 'nextElementSibling';
        var sibling = parent[direction];
        if (sibling) {
          var imageLink = sibling.querySelector('a.image-link');
          imageLink.click();
        }
        break;
    }
  }
  if (keyCode === 80) {
    var url = location.href;
    location.href = '#image_gallery_images_container_div_id';
    history.replaceState(null,null,url);
  }
};
