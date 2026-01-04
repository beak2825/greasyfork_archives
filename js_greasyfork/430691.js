// ==UserScript==
// @name        debloat amazon homepage
// @namespace   ajd
// @match       http*://*amazon.com/
// @match       http*://*amazon.com/ref=nav_logo
// @grant       none
// @version     1.0
// @author      ajdungan
// @license     MIT
// @description the ultimate goal is to make the amazon homepage appear as simple as a google search homepage without any distracting elements
// @supportURL  https://github.com/ajdungan/debloat-amazon-homepage/
// @contributionURL BTC 1P4WAuxS1h74DM4awmPh5kCrbYpLnU8r4M  ETH 0x8e1977d348042175B98aF35E87e8B49474Ff4F92
// @run-at     document-end
// @downloadURL https://update.greasyfork.org/scripts/430691/debloat%20amazon%20homepage.user.js
// @updateURL https://update.greasyfork.org/scripts/430691/debloat%20amazon%20homepage.meta.js
// ==/UserScript==

//////////////////////////////////////////////////////////////////////////////////////
  
//Remove everthing but search bar and basic navigation  
//id="desktop-banner"
document.querySelectorAll('[id="desktop-banner"]')[0].remove()


//class="a-section a-spacing-none"
document.getElementsByClassName('a-section a-spacing-none')[0].remove()


//class="navFooterVerticalColumn navAccessibility"
document.getElementsByClassName('navFooterVerticalColumn navAccessibility')[0].remove()

//id="navBackToTop"
document.querySelectorAll('[id="navBackToTop"]')[0].remove()

//class="navFooterBackToTop"
document.getElementsByClassName('navBackToTop')[0].remove()

//////////////////////////END/////////////////////////////////////////////////////////