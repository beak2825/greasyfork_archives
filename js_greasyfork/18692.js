// ==UserScript==
// @name Canal+ Player
// @description Zap la pub vidéo canalplus
// @namespace d19bfb8e-cacc-41f1-895b-9c2b5bd747be
// @author Reek
// @include *://*.d8.tv/pid*
// @include *://*.d8.tv/*/pid*
// @include *://*.d17.tv/pid*
// @include *://*.d17.tv/*/pid*
// @include *://*.mycanal.fr/pid*
// @include *://*.mycanal.fr/*/pid*
// @include *://*.canalplus.fr/pid*
// @include *://*.canalplus.fr/*/pid*
// @version 1.2
// @downloadURL https://update.greasyfork.org/scripts/18692/Canal%2B%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/18692/Canal%2B%20Player.meta.js
// ==/UserScript==

if (parent == self) { // skip frames

  // force redirection
  var lrefs = document.querySelectorAll('a');
  for (var j = 0, len = lrefs.length; j < len; ++j) {
    var lref = lrefs[j];
    if (lref.href.indexOf('?vid=') > -1) {
      lref.removeAttribute('onclick');
      lref.onclick = function () {
        location.href = this.href;
      };
    }
  }

  // waiting for video container
  setTimeout(function () {

    var getVideoId = function () {
      if (location.href.indexOf('?vid=') > -1) { // vod
        //console.log('vid in url');
        return location.href.split('?vid=')[1];
      } else if (typeof unsafeWindow.videoId !== 'undefined' && unsafeWindow.videoId !== '') { // vod
        //console.log('vid in dom');
        return unsafeWindow.videoId;
      }
      else { // live
	    //console.log('vid in flashvars');
        var flashvars = document.querySelector('embed#CanalPlayerEmbarque').getAttribute('flashvars');
        return flashvars.match(/videoId=([0-9]+)/)[1];
      }
    }
	
    var getParam = function () {
      return location.host.split('.')[1].replace('canalplus', 'cplus');
    }

    var container = document.querySelector('#CanalPlayerEmbarque');
    if (container) {
      var parent = container.parentNode;
      var player = document.createElement('div');
      player.innerHTML = '<embed title="Player without ads :-)" width="' + container.clientWidth + '" height="' + container.clientHeight + '" bgcolor="#000000" wmode="opaque" allowfullscreen="true" allowscriptaccess="always" flashvars="param=' + getParam() + '&amp;env=prod&amp;videoId=' + getVideoId() + '&amp;targetURL=&amp;timecode=1&amp;targetNewWindow=false&amp;autoplay=1" name="canalPlayer" src="http://player.canalplus.fr/site/flash/player.swf"><noembed>Veuillez installer Flash Player pour lire la vid&amp;eacute;o</noembed></object>';
      parent.replaceChild(player, container);
    }

  }, 5000);

}