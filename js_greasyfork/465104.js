// ==UserScript==
// @name         BonziLulz | Official
// @description  Mod Menu for bonzi.lol, this is like BonziLolz and BonziMenu Alpha but updated and actually better
// @author       SeamusWasMostLikelyTaken
// @match        http://bonzi.lol
// @match        https://bonzi.lol
// @icon         https://cdn.discordapp.com/attachments/1050484828149125220/1101773124200050718/bonz.png
// @grant        none
// @license      BonziFuckers
// @version 0.0.7
// @namespace https://greasyfork.org/users/1069905
// @downloadURL https://update.greasyfork.org/scripts/465104/BonziLulz%20%7C%20Official.user.js
// @updateURL https://update.greasyfork.org/scripts/465104/BonziLulz%20%7C%20Official.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var menuContent = "<div id='bg'><a href=''>Background Options</a></div><br><div id='menuoptions'><a href=''>Menu Options</a><br></div>";

  // create menu button
  var menuButton = document.createElement('button');
  menuButton.innerText = 'Menu';
  menuButton.style.backgroundColor = '#808080';
  menuButton.style.color = 'white';
  menuButton.style.position = 'fixed';
  menuButton.style.top = '10px';
  menuButton.style.right = '10px';

  // create menu container
  var menuContainer = document.createElement('div');
  menuContainer.id = 'menuf';
  menuContainer.style.backgroundColor = '#424242';
  menuContainer.style.color = 'white';
  menuContainer.style.width = '200px';
  menuContainer.style.height = '400px';
  menuContainer.style.position = 'fixed';
  menuContainer.style.top = '50%';
  menuContainer.style.left = '50%';
  menuContainer.style.transform = 'translate(-50%, -50%)';
  menuContainer.innerHTML = "<h3 style='text-align:center;'>Menu</h3><hr>" + menuContent + "<div id='close'><br><br></div>";
  menuContainer.style.display = 'none';
  menuContainer.style.cursor = 'move';

  // make menu draggable
  var dragStartX, dragStartY, offsetX = 0, offsetY = 0;
  menuContainer.addEventListener('mousedown', function(e) {
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    offsetX = menuContainer.offsetLeft;
    offsetY = menuContainer.offsetTop;
    menuContainer.style.cursor = 'grabbing';
  });

  menuContainer.addEventListener('mouseup', function() {
    menuContainer.style.cursor = 'move';
  });

  menuContainer.addEventListener('mousemove', function(e) {
    if (e.buttons !== 1) {
      return;
    }
    var newOffsetX = e.clientX - dragStartX + offsetX;
    var newOffsetY = e.clientY - dragStartY + offsetY;
    menuContainer.style.left = newOffsetX + 'px';
    menuContainer.style.top = newOffsetY + 'px';
  });

  // create close button
  var closeButton = document.createElement('button');
  closeButton.querySelector('button').style.height = '50px';
  closeButton.innerText = 'Close Menu';
  closeButton.style.backgroundColor = '#808080';
  closeButton.style.color = 'white';
  closeButton.style.position = 'absolute';
  closeButton.style.bottom = '10px';
  closeButton.style.right = '10px';

  // create close button container
  var closeButtonContainer = document.createElement('div');
  closeButtonContainer.id = 'close';
  closeButtonContainer.appendChild(closeButton);

  // set the same style properties as the menu button
  closeButton.style.backgroundColor = menuButton.style.backgroundColor;
  closeButton.style.color = menuButton.style.color;
  closeButton.style.position = menuButton.style.position;
  closeButton.style.top = menuButton.style.top;

  // append menu button and container to the body element
  document.body.appendChild(menuButton);
  document.body.appendChild(menuContainer);

  // add click event listener to open the menu
  menuButton.addEventListener('click', function() {
    menuContainer.style.display = 'block';
    menuButton.style.display = 'none';
    menuContainer.appendChild(closeButtonContainer);
  });

  // add click event listener to close the menu
  closeButton.addEventListener('click', function() {
    menuContainer.style.display = 'none';
    menuButton.style.display = 'block';
    closeButtonContainer.remove();
  });

})();