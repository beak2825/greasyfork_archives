// ==UserScript==
// @name        Enhanced UI - eldritch.cafe
// @match       https://eldritch.cafe/*
// @grant       none
// @version     0.3
// @author      Agatha Rose (@AgathaSorceress@eldritch.cafe)
// @namespace   https://agatharose.dev
// @description Minor improvements for the Eldrich Café's mastodon UI
// @downloadURL https://update.greasyfork.org/scripts/425096/Enhanced%20UI%20-%20eldritchcafe.user.js
// @updateURL https://update.greasyfork.org/scripts/425096/Enhanced%20UI%20-%20eldritchcafe.meta.js
// ==/UserScript==

// pretty favicon!
var link = document.querySelector("link[rel~='icon']");
if (!link) {
  link = document.createElement('link');
  link.rel = 'icon';
  document.getElementsByTagName('head')[0].appendChild(link);
}
link.href = 'https://agatharose.dev/host/favicon.png';


var style = document.createElement('style');
style.innerHTML = `
  /* alternative "notify me" icon */
  .fa-bell-o {
    content: url('https://agatharose.dev/host/bell-o.svg');
    width: 16px;
  }
  /* when the button is enabled, make the background dark */
  .icon-button.active[aria-label^="Stop notifying"] {
    background-color: #a288bd;
  }
  .icon-button.active:hover[aria-label^="Stop notifying"] {
    background-color: #bca9cf;
  }
  /* a small hack to recolor the icon to white without editing the svg file */
  .icon-button.active[aria-label^="Stop notifying"] > i {
    filter: brightness(130%);
  }
  
  /* alternative bullhorn icon */
  .fa-bullhorn {
    content: url('https://agatharose.dev/host/bullhorn.svg');
    width: 16px;
    padding-top: 5px;
  }
  
  /* make text selection fit the theme */
  ::selection {
    color: #27222f;
    background: #d5bdd6;
  }
`;
document.head.appendChild(style);