// ==UserScript==
// @name           fefe dates 2
// @description    Ersetzt auf blog.fefe.de das [l] in den Pro-Post-Links durch das Post-Datum.
// @version        2.1
// @author         arbu (original: flying sheep)
// @namespace      https://greasyfork.org/users/1220
// @include        http://blog.fefe.de/*
// @include        https://blog.fefe.de/*
// @run-at         document-end
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/1004/fefe%20dates%202.user.js
// @updateURL https://update.greasyfork.org/scripts/1004/fefe%20dates%202.meta.js
// ==/UserScript==
var head = document.getElementsByTagName('head')[0],
    style = document.createElement('style');
style.setAttribute('type', 'text/css');
style.textContent = 'body > h3 + ul > li > a[href^="?ts="] {color: black; text-decoration: none; margin-right: 1ex}';
head.appendChild(style);

for(var i = 3; i < document.links.length; i++)
  if(document.links[i].text == '[l]' && document.links[i].search.indexOf('?ts=') === 0)
    document.links[i].text = '[' +
      new Date((parseInt(document.links[i].search.substring(4), 16) ^ 0xfefec0de) * 1000).toLocaleTimeString() +
      ']';