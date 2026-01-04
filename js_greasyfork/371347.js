// ==UserScript==
// @name           Replace Vandal Video Player
// @author         unsigned char*
// @version        2
// @grant          none
// @namespace      uchar
// @icon           https://vandal.elespanol.com/favicon-32x32.png
// @include        /^https?:\/\/(?:www\.)?vandal\.elespanol\.com\/?.*$/
// @description:es Cambia el reproductor de video usado en el portal Vandal
// @description Cambia el reproductor de video usado en el portal Vandal
// @downloadURL https://update.greasyfork.org/scripts/371347/Replace%20Vandal%20Video%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/371347/Replace%20Vandal%20Video%20Player.meta.js
// ==/UserScript==

(function (window) {
  "use strict";
  
  var FAVandal = {    
    init: function() {
      var self = this;
    	this._replaceVideoPlayers("div[class*='reproductor_']", function(elm){
      	if ('embed' in elm.dataset && elm.dataset.embed.indexOf('youtube') !== -1) {
          self._injectPlayerHTML(elm, `<iframe width='560' height='315' src='${elm.dataset.embed}' frameborder='0' allow='encrypted-media' allowfullscreen></iframe>`);
        }
      });
      this._replaceVideoPlayers("iframe[id^='video_']", function(elm){
      	var vandalid = elm.id.split('_');
        if (vandalid && vandalid.length === 2 && self._isNumber(vandalid[1])) {
          self._injectPlayerHTML(elm, `<video controls webkit-playsinline='true' playsinline='true' src='https://videos.vandalimg.com/mp4/${vandalid[1]}.mp4' x-webkit-airplay='allow'></video>`);
        }
      });
    },
    
    _isNumber: function (n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    },
    
    _injectPlayerHTML: function(elmToReplace, htmlToInject) {
    	var ndiv = document.createElement('DIV');
      ndiv.innerHTML = htmlToInject;
      elmToReplace.parentNode.insertBefore(ndiv, elmToReplace);
      elmToReplace.parentNode.removeChild(elmToReplace);
    },

    _replaceVideoPlayers: function (selector, callback){
      document.body.querySelectorAll(selector).forEach(elm => { callback(elm); });
    }
	};

  FAVandal.init();

})(window)