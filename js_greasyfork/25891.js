// ==UserScript==
// @name           PTH Tag Colours
// @description    Colourises some genre tags
// @version        1.0
// @include        http*://*passtheheadphones.me/*
// @grant          GM_addStyle
// @namespace https://greasyfork.org/users/88604
// @downloadURL https://update.greasyfork.org/scripts/25891/PTH%20Tag%20Colours.user.js
// @updateURL https://update.greasyfork.org/scripts/25891/PTH%20Tag%20Colours.meta.js
// ==/UserScript==


var tagGroups = [

  {
    color: '#00ff00',
    tags:  'synth.pop, electro.pop, electronic'
  },

  {
    color: '#0000ff',
    tags:  'rock, alternative.rock'
  },

  {
    color: 'red',
    tags:  'jam.band'
  }

];


var style = '';
for (var i = tagGroups.length; i--; ) {
  tagGroups[i].tags = tagGroups[i].tags.trim().toLowerCase().split(/[ ,]+/);
  style += [
    'a.tagcolor_', i, ' { color: ', tagGroups[i].color, ' !important; }',
    'a.tagcolor_', i, ':hover { color: ', tagGroups[i].color, ' !important; opacity: 0.8; }'
  ].join('');
}
GM_addStyle(style);

var links = document.querySelectorAll('.tags > a, .box_tags li > a');
for (var i = links.length; i--; ) {
  var tag = links[i].textContent.trim();
  for (var j = tagGroups.length; j--; ) {
    if (tagGroups[j].tags.indexOf(tag) > -1) {
      links[i].classList.add('tagcolor_' + j);
      break;
    }
  }
}