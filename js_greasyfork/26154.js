// ==UserScript==
// @name         Apollo & Redacted Colorize classes
// @version      0.2
// @description  Set the class titles unique colors
// @author       thegeek (but really Chameleon on PTH)
// @include      http*://*apollo.rip/*
// @include      http*://*redacted.ch/*
// @grant        none
// @namespace https://greasyfork.org/en/users/90188
// @downloadURL https://update.greasyfork.org/scripts/26154/Apollo%20%20Redacted%20Colorize%20classes.user.js
// @updateURL https://update.greasyfork.org/scripts/26154/Apollo%20%20Redacted%20Colorize%20classes.meta.js
// ==/UserScript==

(function() {
  'use strict';
  
  var classes=[['(User)', '#FFFFFF'],
               ['(Member)', '#AAFFFF'],
               ['(Power User)', '#AAAAFF'],
               ['(Elite)', '#FFAAFF'],
               ['(Torrent Master)', '#FFFFAA'],
               ['(Power TM)', '#FFFF66'],
               ['(Elite TM)', '#FFFF00'],
    ];

  var strongs=document.getElementsByTagName('strong');
  for(var i=0; i<strongs.length; i++)
  {
    var s=strongs[i];
    for(var j=0; j<classes.length; j++)
    {
      if(s.innerHTML == classes[j][0])
        s.style.color=classes[j][1];
    }
  }
})();