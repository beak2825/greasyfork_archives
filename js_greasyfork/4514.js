// ==UserScript==
// @id             www.tagesschau.de-d25add17-4ab0-4d46-ad1e-980d91e0e4cd@https://github.com/about-robots
// @name           tagesschau.de-html5-videos
// @description    tagesschau.de: HTML5 Video all the way - get rid of annoying projekktor player
// @namespace      https://github.com/about-robots
// @include        http://www.tagesschau.de/*
// @exclude        http://www.tagesschau.de/multimedia/video/video-*~player_autoplay-true.html
// @exclude        http://www.tagesschau.de/multimedia/livestreams/index.html
// @run-at         document-end

// @version        1.6.2
// @downloadURL https://update.greasyfork.org/scripts/4514/tagesschaude-html5-videos.user.js
// @updateURL https://update.greasyfork.org/scripts/4514/tagesschaude-html5-videos.meta.js
// ==/UserScript==

var mediaTypes = [];
var iframes = document.getElementsByTagName("iframe");

for (var i = iframes.length - 1; i >= 0; i--) {
  var mediaResources = iframes[i].getAttribute("data-ctrl-iframe");
  var i1 = mediaResources.indexOf("'src'") + 7;
  var i2 = mediaResources.indexOf("'", i1);
  var mediaPageUrl = "http://www.tagesschau.de" + mediaResources.substr(i1, i2 - i1);
  mediaTypes[i] = mediaPageUrl.indexOf("audio") > -1 ? "audio" : "video";
  
  var oReq = new XMLHttpRequest();
  oReq.onload = (function(e,ix) {
    return function() {
      var mediaType = mediaTypes[ix];
      var i1 = this.response.indexOf("var playlist");
      i1 = this.response.indexOf("http://media.tagesschau.de/", i1);
      var i2 = this.response.indexOf((mediaType == "audio" ? "'" : '"'), i1);
      var mediaFileUrl = this.response.substr(i1, i2 - i1 - (mediaType == "audio" ? 3 : 10)) + ((mediaType == "audio" ? "ogg" : "l.h264.mp4"));
      var mediaElement = document.createElement(mediaType);
      mediaElement.setAttribute("src", mediaFileUrl);
      mediaElement.setAttribute("controls", "1");
      var audioBgImg = "http://www.tagesschau.de/resources/framework/mediaplayer/skin/audiobg.jpg";
      mediaElement.setAttribute("style", "width:100%;height:155px;background:url("+audioBgImg+") center bottom / auto no-repeat transparent;");
      if (mediaType == "video") {
        i1 = this.response.indexOf('poster:', i2);
        i1 = this.response.indexOf("5:", i1);
        i1 = this.response.indexOf('"', i1) + 1;
        i2 = this.response.indexOf('"', i1);
        var videoPosterImg = "http://www.tagesschau.de" + this.response.substr(i1, i2 - i1);
        mediaElement.setAttribute("poster", "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7");
        mediaElement.setAttribute("style", "width:100%;background:url("+videoPosterImg+") center / 100% no-repeat transparent");
      }

      iframes[ix].parentNode.insertBefore(mediaElement, iframes[ix]);
      iframes[ix].parentNode.removeChild(iframes[ix]);
    }
  })(oReq,i);
  oReq.open("get", mediaPageUrl, true);
  oReq.send();
}
