// ==UserScript==
// @name        Golem.de HTML5 Video
// @namespace   golem.de.html5.video.stuff.dasprids.de
// @description Replaces the Flash player with a native HTML5 one
// @include     http://*.golem.de/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13834/Golemde%20HTML5%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/13834/Golemde%20HTML5%20Video.meta.js
// ==/UserScript==

// For www.golem.de
var figures = document.getElementsByTagName('figure');

for (var i = 0; i < figures.length; ++i) {
  if (!figures[i].hasAttribute('id')) {
    continue;
  }

  var id = figures[i].getAttribute('id');

  if (!id.startsWith('gvideo')) {
    continue;
  }

  figures[i].removeAttribute('id');

  var videoId  = id.split('_')[1];
  var videoUrl = 'http://video.golem.de/download/' + videoId;

  figures[i].innerHTML = '<video controls="controls" width="620"><source src="' + videoUrl + '" type="video/mp4" /></video>';
}

// For video.golem.de
var projectors = document.getElementsByClassName('projekktor');

for (var i = 0; i < projectors.length; ++i) {
  if (!projectors[i].hasAttribute('id')) {
    continue;
  }

  var match = projectors[i].getAttribute('id').match(/^NVBPlayer(\d+)$/);

  if (!match) {
    continue;
  }

  projectors[i].removeAttribute('id');

  var videoId  = match[1];
  var videoUrl = 'http://video.golem.de/download/' + videoId;

  projectors[i].innerHTML = '<video controls="controls" width="620"><source src="' + videoUrl + '" type="video/mp4" /></video>';
}
