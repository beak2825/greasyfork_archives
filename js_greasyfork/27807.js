// ==UserScript==
// @name         Gazelle Colorful Sandbox
// @version      0.1.5
// @description  Give the different types of threads in the NotWhat sandbox different colors
// @author       Chameleon
// @include      http*://*redacted.ch/*forumid=8*
// @include	http*://*apollo.rip/*forumid=24*
// @include	http*://*notwhat.cd/*forumid=7*
// @include      http*://*passtheheadphones.me/*forumid=8*
// @grant        none
// @namespace https://greasyfork.org/users/82871
// @downloadURL https://update.greasyfork.org/scripts/27807/Gazelle%20Colorful%20Sandbox.user.js
// @updateURL https://update.greasyfork.org/scripts/27807/Gazelle%20Colorful%20Sandbox.meta.js
// ==/UserScript==

var colours = [
  {name:"user script", colour:"#888800"},
  {name:"script", colour:"#888800"},
  {name:"userscript", colour:"#444400"},
  {name:"stylesheet", colour:"#880000"},
  {name:"tool", colour:"#008800"},
  {name:"application", colour:"#6666cc"},
  {name:"python", colour:"#008888"},
  {name:"gazelle", colour:"#880088"},
  {name:"user script / tool", colour:"white; background: linear-gradient(to right, #888800 0%,#008800 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"},
  ];

(function() {
  'use strict';

  var as=document.getElementsByClassName("forum_index")[0].getElementsByClassName('tooltip');
  for(var i=0; i<as.length; i++)
  {
    var a=as[i];
    if(a.tagName != "A")
      continue;
    var split=a.innerHTML.split('[');
    if(split.length < 2)
      continue;
    split=split[1].split(']');
    if(split.length < 2)
      continue;
    for(var j=0; j<colours.length; j++)
    {
      if(split[0].toLowerCase() == colours[j].name)
      {
        a.innerHTML = a.innerHTML.replace('[', '[<span style="color: '+colours[j].colour+'">');
        a.innerHTML = a.innerHTML.replace(']', '</span>]');
        break;
      }
    }
  }
})();