// ==UserScript==
// @name         PTH Apotheosis Link Creator
// @version      1.02
// @description  Copy Apotheosis command to clipboard
// @author       Suit_Of_Sables
// @include      http*://passtheheadphones.me/artist.php?id=*
// @include      http*://passtheheadphones.me/collage.php?id=*
// @include      http*://passtheheadphones.me/collages.php?id=*
// @grant        GM_setClipboard
// @namespace https://greasyfork.org/users/89337
// @downloadURL https://update.greasyfork.org/scripts/25992/PTH%20Apotheosis%20Link%20Creator.user.js
// @updateURL https://update.greasyfork.org/scripts/25992/PTH%20Apotheosis%20Link%20Creator.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var linkbox=document.getElementsByClassName('linkbox')[0];
  var a=document.createElement('a');
  linkbox.appendChild(a);
  a.innerHTML = 'Apotheosis';
  a.setAttribute('class', 'brackets');
    
  a.onmouseover = function () {
    a.style['text-decoration'] = 'underline';
    a.style.cursor = 'pointer';
  };

  a.onmouseout = function () {
    a.style['text-decoration'] = 'none';
	a.style.cursor = 'inherit';
  };
            
  a.addEventListener('click', function () {
      var id = document.getElementsByName("pageid")[0].getAttribute("value");
      var command = './apotheosis ';
      if (document.getElementById('collage')) {
          command = command.concat('-C ');
      }
      var str = command.concat(id);
      GM_setClipboard(str);
      a.style.color = "green";
  });
})();
