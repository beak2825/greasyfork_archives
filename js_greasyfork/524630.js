// ==UserScript==
// @name         Torn Sailing
// @namespace    namespace
// @version      0.1
// @description  description
// @match        *.torn.com/index.php*
// @downloadURL https://update.greasyfork.org/scripts/524630/Torn%20Sailing.user.js
// @updateURL https://update.greasyfork.org/scripts/524630/Torn%20Sailing.meta.js
// ==/UserScript==

var plane = document.querySelector('#plane')
if (plane && plane != null) {
  plane.children[0].src = 'https://i.postimg.cc/tRZC13RZ/sailing.gif'
  plane.children[0].style.width = '400px'
  if (document.querySelector('.destination-title').innerText.split(' ')[0] !== 'Torn') plane.querySelector('img').style.transform = 'scaleX(-1)'
}