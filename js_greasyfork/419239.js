// ==UserScript==
// @name      FlashIsDead-LongLiveToFlash
// @namespace https://greasyfork.org/users/4785
// @author    nil
// @version   0.7
// @grant     none
// @description    [FR] remplace les applets flash par un joli tag <audio> pour écouter les morceaux depuis le navigateur
// @include        http://www.editions-musicales-chardonnieras.fr/styles.html
// @include        http://www.editions-musicales-chardonnieras.fr/bonus.html
// @include        http://jpzico.eklablog.com/*
// @downloadURL https://update.greasyfork.org/scripts/419239/FlashIsDead-LongLiveToFlash.user.js
// @updateURL https://update.greasyfork.org/scripts/419239/FlashIsDead-LongLiveToFlash.meta.js
// ==/UserScript==

// http://www.editions-musicales-chardonnieras.fr/styles.html
(function emc_myinit() {
  function changeSWFtoAudioTag() {
    // playback
    var xpathExpression = '//object[@type = "application/x-shockwave-flash"][starts-with(@data, "dewplayer.swf?mp3=mp3-play-back/")]';
    var xpathResult = document.evaluate( xpathExpression, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var node, i = 0; node = xpathResult.snapshotItem(i); i++) {
      var relative_url = node.getAttribute("data").substr(18);
      node.parentNode.innerHTML = "<audio controls=controls preload=none src='" + relative_url + "' type='audio/mpeg' >Your browser does not support the audio element.</audio>";
    }

    // extrait
    xpathExpression = '//object[@type = "application/x-shockwave-flash"][starts-with(@data, "dewplayer.swf?mp3=")]';
    var xpathResult = document.evaluate( xpathExpression, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var node, i = 0; node = xpathResult.snapshotItem(i); i++) {
      var relative_url = node.getAttribute("data").substr(18);
      node.parentNode.innerHTML = "<audio controls=controls preload=none src='" + relative_url + "' type='audio/mpeg' >Your browser does not support the audio element.</audio>";
    }
  }
  
  // return if not on www.editions-musicales-chardonnieras.fr
  if ("www.editions-musicales-chardonnieras.fr" !== location.host) return;
  
  // https://developer.mozilla.org/fr/docs/Web/API/MutationObserver
  // Selectionne le noeud dont les mutations seront observées
	var result_elt = document.getElementById('result');

	// Options de l'observateur (quelles sont les mutations à observer)
	var config_obs = { attributes: true, attributeFilter: [ "class" ] };

	// Fonction callback à éxécuter quand une mutation est observée
	function callback_obs(mutationsList) {
    for(var mutation of mutationsList) {
			if (mutation.type == 'attributes' && ! /wait/.test(result_elt.className)) {
        //console.log("attr change");
        changeSWFtoAudioTag();
    	}
    }
	};

  // Créé une instance de l'observateur lié à la fonction de callback
  var observer = new MutationObserver(callback_obs);

  // Commence à observer le noeud cible pour les mutations précédemment configurées
  observer.observe(result_elt, config_obs);
})();

// http://jpzico.eklablog.com/
(function jpzico_myinit() {
  function changeSWFtoAudioTag() {
    // playback
    var xpathExpression = '//object[@type = "application/x-shockwave-flash"][@data = "/data/misc/players/player_mp3_maxi.swf"]';
    xpathExpression += '/param[@name = "flashvars"][starts-with(@value, "mp3=http")]';
    // &width=300*
    var xpathResult = document.evaluate( xpathExpression, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var node, i = 0; node = xpathResult.snapshotItem(i); i++) {
      var url = node.getAttribute("value").substr(4);
      url = decodeURIComponent(url.substr(0, url.indexOf("&")));
      node.parentNode.parentNode.innerHTML = "<audio controls=controls preload=none src='" + url + "' type='audio/mpeg' >Your browser does not support the audio element.</audio>";
    }
  }
  
  // return if not on jpzico.eklablog.com
  if ("jpzico.eklablog.com" !== location.host) return;
  
  changeSWFtoAudioTag();
})();
