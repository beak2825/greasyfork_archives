// ==UserScript==
// @name        roll20CardStackEnlarger
// @namespace   towerofawesome.org
// @include     https://app.roll20.net/editor/
// @description Script to apply slight modification of roll20 card widget on load
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4252/roll20CardStackEnlarger.user.js
// @updateURL https://update.greasyfork.org/scripts/4252/roll20CardStackEnlarger.meta.js
// ==/UserScript==

function addcss(css)
{
  var head = document.getElementsByTagName('head')[0];
  var s = document.createElement('style');
  s.setAttribute('type', 'text/css');
  if (s.styleSheet) {   // IE
      s.styleSheet.cssText = css;
  } else {                // the world
      s.appendChild(document.createTextNode(css));
  }
  head.appendChild(s);
}

document.onLoad = onLoad();

function onLoad()
{
    addcss("#showndecks {width:200px;max-height: 244px;bottom: 100px;} #showndecks .deckstack {width: 200px;} #showndecks .card {width:200px;}");
}