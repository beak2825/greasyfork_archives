// ==UserScript==
// @name        Choualbox block furry
// @namespace   com.choualbox.blockfurry
// @include     http://choualbox.com/*
// @include     http://www.choualbox.com/*
// @version     1
// @grant       none
// @description none
// @downloadURL https://update.greasyfork.org/scripts/22706/Choualbox%20block%20furry.user.js
// @updateURL https://update.greasyfork.org/scripts/22706/Choualbox%20block%20furry.meta.js
// ==/UserScript==
var sitesInterdits = 
    new Array('http://choualbox.com/g/furry', 'http://choualbox.com/g/porn');
var motsInterdits = 
    new Array('Furry', 'Porn');
var redirection = 'http://choualbox.com/';

for(var i = 0; i < motsInterdits.length; i++)
{
  if(content.document.title.indexOf(' - ' + motsInterdits[i]) != -1)
    window.location.replace(redirection);
}

if (contains(siteInterdits, content.document.location))
  window.location.replace(redirection);

function contains(a, obj)
{
  for (var i = 0; i < a.length; i++) 
  {
    if (a[i] == obj) 
      return true;

  }
  return false;
}