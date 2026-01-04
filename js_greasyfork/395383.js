// ==UserScript==
// @name        Insert download link - torlock.com
// @namespace   Torlock Scripts
// @match       https://www.torlock.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 1/4/2020, 10:25:24 AM
// @downloadURL https://update.greasyfork.org/scripts/395383/Insert%20download%20link%20-%20torlockcom.user.js
// @updateURL https://update.greasyfork.org/scripts/395383/Insert%20download%20link%20-%20torlockcom.meta.js
// ==/UserScript==

const _links = document.getElementsByTagName('a');
const links = Array.prototype.slice.call(_links);
console.log('test ' + links.length);
for (var i = 0; i < links.length; i++) {
  const link = links[i];
  if (link.href) {
    console.log(link.href);
    const m = link.href.match(/\/torrent\/(\d+)\//);
    if (m) {
      const a = document.createElement('a');
      const text = document.createTextNode('Torrent ');
      a.appendChild(text);
      a.href = 'https://torlock.com/tor/' + m[1] + '.torrent';
      link.parentNode.insertBefore(a, link);
    }
  }
}