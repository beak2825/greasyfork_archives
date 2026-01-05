// ==UserScript==
// @name         PTH Colourise classes
// @version      0.3
// @description  Set the class titles unique colours
// @author       Chameleon
// @include      http*://redacted.ch/*
// @grant        none
// @namespace https://greasyfork.org/users/87476
// @downloadURL https://update.greasyfork.org/scripts/25924/PTH%20Colourise%20classes.user.js
// @updateURL https://update.greasyfork.org/scripts/25924/PTH%20Colourise%20classes.meta.js
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
               ['(Forum Mod)', 'rgba(0,0,0,1); text-shadow:rgba(255,255,255,1) 0px 0px 3px;'],
               ['(Moderator)', 'rgba(0,0,0,1); text-shadow:rgba(128,255,255,1) 0px 0px 3px;'],
               ['(Senior Moderator)', 'rgba(0,0,0,1); text-shadow:rgba(255,128,255,1) 0px 0px 3px;'],
               ['(Developer)', 'rgba(0,0,0,1); text-shadow:rgba(255,255,128,1) 0px 0px 3px;'],
               ['(Administrator)', 'rgba(0,0,0,1); text-shadow:rgba(255,192,0,1) 0px 0px 3px;'],
               ['(Sysop)', 'rgba(0,0,0,1); text-shadow:rgba(255,0,0,1) 0px 0px 3px;'],
               ['(VIP)', 'rgba(0,0,0,1); text-shadow:rgba(0,192,255,1) 0px 0px 3px;'],
               ['(Legend)', 'rgba(0,0,0,0.2); text-shadow:rgba(128,128,128,1) 0px 0px 1px;'],
    ];

  var strongs=document.getElementsByTagName('strong');
  for(var i=0; i<strongs.length; i++)
  {
    var s=strongs[i];
    for(var j=0; j<classes.length; j++)
    {
      if(s.innerHTML == classes[j][0])
        s.setAttribute('style', 'color:'+classes[j][1]);
    }
  }
})();
