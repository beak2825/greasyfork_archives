// ==UserScript==
// @name        SZ Minus - sueddeutsche.de
// @namespace   Violentmonkey Scripts
// @match       https://www.sueddeutsche.de/
// @grant       none
// @version     1.0
// @author      -
// @description 10.4.2021, 11:55:10
// @downloadURL https://update.greasyfork.org/scripts/424808/SZ%20Minus%20-%20sueddeutschede.user.js
// @updateURL https://update.greasyfork.org/scripts/424808/SZ%20Minus%20-%20sueddeutschede.meta.js
// ==/UserScript==

class SZMinus
{
  run()
  {
    let teaserLinks = document.querySelectorAll('a.sz-teaser');
    teaserLinks.forEach((link) => 
    {
      let hasPlusLogo = link.querySelector('.sz-teaser__overline-label');
      if (hasPlusLogo !== null)
      {
        link.style.display = 'none';
      }
    });
    
    let editorials = document.querySelectorAll('.interactiveeditorial');
    editorials.forEach((editorial) => 
    {
      editorial.style.display = 'none';
    });
  }
}

let szm = new SZMinus();
szm.run();