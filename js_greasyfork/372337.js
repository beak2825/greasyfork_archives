// ==UserScript==
// @name         Torn Superman
// @namespace    namespace
// @version      0.2
// @description  description
// @match        *.torn.com/index.php*
// @downloadURL https://update.greasyfork.org/scripts/372337/Torn%20Superman.user.js
// @updateURL https://update.greasyfork.org/scripts/372337/Torn%20Superman.meta.js
// ==/UserScript==

var plane = document.querySelector('#plane')
if (plane && plane != null) {
  plane.children[0].src = 'https://webiconspng.com/wp-content/uploads/2017/09/Superman-PNG-Image-51338.png'
  plane.children[0].style.width = '300px'
  if (document.querySelector('.destination-title').innerText.split(' ')[0] !== 'Torn') plane.querySelector('img').style.transform = 'scaleX(-1)'
}