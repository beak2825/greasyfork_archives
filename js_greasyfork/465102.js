// ==UserScript==
// @name         BonziMENU Alpha
// @description  Silly mod menu that just does shit
// @author       Jy
// @match        https://cyganworld.bluefong2.repl.co/
// @match        http://bonzi.lol
// @match        https://bonzi.lol
// @icon         https://media.discordapp.net/attachments/1053978787810902019/1062778187853090906/Screenshot_2023-01-11_10.59.51_AM.png
// @grant        none
// @license      BonziLolz
// @version 0.0.1.20230429073042
// @namespace https://greasyfork.org/users/1069905
// @downloadURL https://update.greasyfork.org/scripts/465102/BonziMENU%20Alpha.user.js
// @updateURL https://update.greasyfork.org/scripts/465102/BonziMENU%20Alpha.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var menuContent = "<div id='bg'><a href=''>Background Options</a></div><br><div id='menuoptions'><a href=''>Menu Options</a><br></div>";

  // create menu button
  var menuButton = document.createElement('button');
  menuButton.innerText = 'Menu';
  menuButton.style.backgroundColor = 'red';
  menuButton.style.color = 'white';
  menuButton.style.position = 'fixed';
  menuButton.style.top = '10px';
  menuButton.style.right = '10px';

  // create menu container
  var menuContainer = document.createElement('div');
  menuContainer.id = 'menuf';
  menuContainer.style.backgroundColor = 'black';
  menuContainer.style.color = 'white';
  menuContainer.style.width = '200px';
  menuContainer.style.height = '400px';
  menuContainer.style.position = 'fixed';
  menuContainer.style.top = '50%';
  menuContainer.style.left = '50%';
  menuContainer.style.transform = 'translate(-50%, -50%)';
  menuContainer.innerHTML = "<h3>Menu</h3><hr>" + menuContent + "<div id='close' style='bottom: 20px; position: absolute;'><br><br><button style='color: black;'>Close Menu</button></div>";
  menuContainer.style.display = 'none';

  // append menu button and container to the body element
  document.body.appendChild(menuButton);
  document.body.appendChild(menuContainer);

  // add click event listener to open the menu
  menuButton.addEventListener('click', function() {
    menuContainer.style.display = 'block';
    menuButton.style.display = 'none';
  });

  // add click event listener to close the menu
  var closeButton = menuContainer.querySelector('#close');
  closeButton.addEventListener('click', function() {
    menuContainer.style.display = 'none';
    menuButton.style.display = 'block';
  });

})();