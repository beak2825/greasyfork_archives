// ==UserScript==
// @name        No Volume Normalization 4 YouTube
// @namespace   https://gist.github.com/abec2304
// @description Enjoy YouTube videos at their true volume
// @author      abec2304
// @version     4.1
// @match       https://*.youtube.com/*
// @match       https://*.youtube-nocookie.com/*
// @run-at      document-start
// @grant       GM_addElement
// @license     AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/513352/No%20Volume%20Normalization%204%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/513352/No%20Volume%20Normalization%204%20YouTube.meta.js
// ==/UserScript==

function ytvt_hook() {
  function ytvt_patchDescriptor(targetProto, targetProp) {
    let desc = Object.getOwnPropertyDescriptor(targetProto, targetProp);
    Object.defineProperty(targetProto, targetProp, {
      enumerable: true,
      configurable: true,
      get: function() { return desc.get.call(this); },
      set: function(e) { void e; }
    });
    return desc;
  }

  let ytvt_desc = ytvt_patchDescriptor(HTMLMediaElement.prototype, 'volume');
  let ytvt_valSetter = HTMLElement.prototype.setAttribute;
  HTMLElement.prototype.setAttribute = function(name, val) {
    if(name === 'aria-valuenow') {
      let isVolume = this.matches('[aria-label="Volume"][role="slider"]');
      if(isVolume) {
        let newVolume = val / 100;
        let players = document.querySelectorAll('.video-stream');
        // players[1] can be the active, so just set the volume on all players
        for(let player of players) {
          if(player.volume !== newVolume) {
            ytvt_desc.set.call(player, newVolume);
          }
        }
      }
    }
    ytvt_valSetter.call(this, name, val);
  };

  let ytvt_rule = '.ytp-sfn-content::after, ytmusic-nerd-stats::after { content: "using No Volume Normalization" }';
  let ytvt_sheet = new CSSStyleSheet();
  ytvt_sheet.insertRule(ytvt_rule);
  document.adoptedStyleSheets = (document.adoptedStyleSheets || []).concat([ytvt_sheet]);

  let ytvt_script = document.getElementById('ytvoltweak');
  if(ytvt_script) { ytvt_script.remove(); }
}

function ytvt_inject() {
  let ytvt_textContent = ytvt_hook + '\n' + ytvt_hook.name + '();';
  GM_addElement('script', {textContent: ytvt_textContent, id: 'ytvoltweak'});
}

if(!document.head) {
  let ytvt_headObserver = new MutationObserver(function(_arr, obs) {
    if(document.head) { obs.disconnect(); ytvt_inject(); }
  });
  ytvt_headObserver.observe(document, {subtree: true, childList: true});
} else {
  ytvt_inject();
}
