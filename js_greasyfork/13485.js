// ==UserScript==
// @name        Baldwin's Cheatsheet
// @namespace   https://greasyfork.org
// @description Adds a quick reference box to the Transmute page so you can see what type of item transmutes to what type of compound without leaving the page
// @include     http://www1.flightrising.com/trading/baldwin/transmute
// @include     http://www.flightrising.com/trading/baldwin/transmute
// @include     https://www1.flightrising.com/trading/baldwin/transmute
// @include     https://www.flightrising.com/trading/baldwin/transmute
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13485/Baldwin%27s%20Cheatsheet.user.js
// @updateURL https://update.greasyfork.org/scripts/13485/Baldwin%27s%20Cheatsheet.meta.js
// ==/UserScript==

var newHTML = document.createElement('div');
newHTML.innerHTML = ' \
  <div id="baldwinRef"> \
   <style scoped> \
    table, th, td {border:1px solid black;} \
    td, th {padding: 5px 0px;} \
    td {text-align: center;} \
   </style> \
   <table style = "width:100%;"> \
    <tr> \
     <th>Food</th> \
     <th>Materials</th> \
     <th>Trinkets/Other</th> \
     <th>Apparel</th> \
     <th>Familiars</th> \
    </tr> \
    <tr> \
     <td colspan="5">BECOME(S)</td> \
    </tr> \
    <tr> \
     <th>Goo</th> \
     <th>Ooze</th> \
     <th>Sludge</th> \
     <th>Slime</th> \
     <th>Muck</th> \
    </tr> \
    <tr> \
     <th><img src="http://www1.flightrising.com/static/cms/trinket/1886.png"></td> \
     <th><img src="http://www1.flightrising.com/static/cms/trinket/1892.png"></td> \
     <th><img src="http://www1.flightrising.com/static/cms/trinket/1898.png"></td> \
     <th><img src="http://www1.flightrising.com/static/cms/trinket/1904.png"></td> \
     <th><img src="http://www1.flightrising.com/static/cms/trinket/1907.png"></td> \
    </tr> \
    <tr><td colspan = "5" style = "background-color:black;"></td></tr> \
    <tr> \
     <td colspan = "5">Color Rarity (most common to most rare):</td> \
    </tr> \
    <tr> \
     <td colspan = "3"> \
      <ul style="list-style-type: none;"> \
        <li>Green</li> \
        <li>Yellow</li> \
        <li>Orange</li> \
        <li>Red</li> \
        <li>Purple</li> \
        <li>Blue</li> \
      </ul> \
     </td> \
     <td> \
      <ul style="list-style-type: none;"> \
        <li>Grey</li> \
        <li>White</li> \
        <li>Black</li> \
      </ul> \
     </td> \
     <td> \
      <ul style="list-style-type: none;"> \
        <li>Copper</li> \
        <li>Silver</li> \
        <li>Gold</li> \
      </ul> \
     </td> \
    </tr> \
   </table> \
  </div> \
';

var elmBaldwin = document.getElementById('baldwin');
elmBaldwin.parentNode.insertBefore(newHTML, elmBaldwin.nextSibling);
//document.body.appendChild(newHTML)

var elmRef = document.getElementById('baldwinRef');
elmRef.style.position = 'absolute';
elmRef.style.top = '500px';
elmRef.style.width = '700px';
