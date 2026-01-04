// ==UserScript==
// @name         Tweaks For Screenshots - UserStyles
// @description  You can open screenshot in new tab
// @match        https://userstyles.org/styles/*
// @author       Pabli
// @version      3.0
// @run-at       document-end
// @grant        none
// @namespace    https://greasyfork.org/users/124677
// @downloadURL https://update.greasyfork.org/scripts/31516/Tweaks%20For%20Screenshots%20-%20UserStyles.user.js
// @updateURL https://update.greasyfork.org/scripts/31516/Tweaks%20For%20Screenshots%20-%20UserStyles.meta.js
// ==/UserScript==
(function() {
    'use strict';

window.onload = function image() {

if (document.getElementById('preview_image_div') !== null) {
  var url = document.getElementById('preview_image_div').style.backgroundImage;

  if (url.length > 90) {
    url = 'url("' + url.substr(46);
    document.getElementById('preview_image_div').style.backgroundImage = url;
  }

  var link = url.slice(5, -2);
  $("#preview_image_div").wrap('<div><a href="'+link+'" target="_blank" title="Open in new tab"></a></div>');

  document.getElementById('preview_image_div').style.backgroundSize = "contain";
}
else {
  setTimeout(image, 100);
}

};

})();