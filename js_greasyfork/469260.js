/// ==UserScript==
// @name         Panda Menu
// @icon         https://www.blooket.com/improvetools.svg
// @namespace    https://tampermonkey.net/
// @version      5.2
// @description  A menu with some useful tools for Blooket hosts.
// @author       Generic Human
// @license      Ask for permission in the Greasy Fork comments before copying.
// @match        https://*.blooket.com/*
// @grant        GM_addStyle
// @exclude      https://battleroyale.blooket.com/*
// @downloadURL https://update.greasyfork.org/scripts/469260/Panda%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/469260/Panda%20Menu.meta.js
// ==/UserScript==

(function () {
  var menuVisible = false;
  var offsetX = 0;
  var offsetY = 0;

  GM_addStyle(`
    #blooketMenu button {
      position: relative;
      overflow: hidden;
      background-color: white;
      transition: background-color 0.2s ease-in-out;
      border: none;
      border-radius: 3px;
      padding: 6px 12px;
      color: #222222;
      margin: 8px;
      font-size: 14px;
      font-weight: bold;
    }

    #blooketMenu button:hover {
      background-color: #bbbbbb;
    }

    #blooketMenu button .ripple {
      position: absolute;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.7);
      transform: scale(0);
      animation: rippleEffect 0.2s linear;
    }

    @keyframes rippleEffect {
      to {
        transform: scale(1);
        opacity: 0;
      }
    }

    #blooketMenu {
      position: fixed;
      top: 30%;
      left: 40%;
      background: linear-gradient(to bottom, #cc36d1, #410b58);
      border: 0px solid #000000;
      color: #ffffff;
      font-family: sans-serif;
      padding: 20px;
      border-radius: 7px;
      cursor: move;
      height: auto;
      width: 265px;
      box-shadow: 0 0 10px #ffffff;
      z-index: 99999;
      display: none;
    }

    #blooketMenu h2 {
      margin: 0 0 10px;
      font-size: 22px;
      font-weight: bold;
      text-align: center;
      color: #ffffff;
    }

    #blooketMenu p {
      text-align: center;
      margin-top: 15px;
      margin-bottom: 10px;
      font-size: 14px;
    }

    #blooketMenu p a {
      color: #3378ff;
      text-decoration: underline;
    }

    #blooketMenu hr {
      border: none;
      border-top: 1px solid #ffffff;
    }

    #blooketMenu #closeBtn {
      position: absolute;
      top: 5px;
      right: 7px;
      width: 23px;
      height: 23px;
      background-color: red;
      color: white;
      font-weight: bold;
      text-align: center;
      line-height: 25px;
      cursor: pointer;
    }

    #blooketImage {
      position: fixed;
      bottom: 20px;
      right: 20px;
      cursor: pointer;
      z-index: 99999;
      width: 50px;
      height: 50px;
    }
#blooketMenu button .ripple {
    position: absolute;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.7);
    transform: scale(0);
    animation: rippleEffect 0.2s linear;
  }

  @keyframes rippleEffect {
    to {
      transform: scale(1);
      opacity: 0;
    }
  }
  `);

  function toggleMenu() {
    var menu = document.getElementById('blooketMenu');
    menu.style.display = menuVisible ? 'none' : 'block';
    menuVisible = !menuVisible;
  }

  function createMenu() {
    var image = document.createElement('img');
    image.id = 'blooketImage';
    image.src = 'https://www.blooket.com/improvetools.svg';
    image.addEventListener('click', toggleMenu);
    document.body.appendChild(image);

    var menu = document.createElement('div');
    menu.id = 'blooketMenu';
    menu.innerHTML =
      '<div style="text-align: center;">' +
      '<img src="https://www.blooket.com/improvetools.svg" width="45" height="45">' +
      '<h2>Panda Menu</h2>' +
      '<div id=\'closeBtn\'>X</div>' +
      '<p style="font-size: 18px;"><a href=\'https://greasyfork.org/users/1106635\' target=\'_blank\'>generic</a></p>' +
      '<hr style="border: none; border-top: 1px solid #ffffff;">' +
      '<button id=\'lockButton\' title=\'Locks down the game so nobody can join the game (Unless you already gave them the code)\'>Lockdown</button>' +
      '<button id=\'brUI\' title=\'A simple Battle Royale kick UI\'>Battle Royale UI</button>' +
      '<button id=\'button2\' title=\'Kicks users with 0 points. Useful for kicking bots, still work in progress though.\'>Kick 0-pointers</button>' +
      '<br><button id=\'page2\' title=\'Page 2 of the menu\'>Page 2</button>' +
      '</div>';

    document.body.appendChild(menu);

    var menuDraggable = false;
    var menuDragStartX = 0;
    var menuDragStartY = 0;

    menu.addEventListener('mousedown', function (event) {
      menuDraggable = true;
      menuDragStartX = event.clientX - menu.offsetLeft;
      menuDragStartY = event.clientY - menu.offsetTop;
    });

    document.addEventListener('mousemove', function (event) {
      if (menuDraggable) {
        offsetX = event.clientX - menuDragStartX;
        offsetY = event.clientY - menuDragStartY;
        menu.style.left = offsetX + 'px';
        menu.style.top = offsetY + 'px';
      }
    });

    document.addEventListener('mouseup', function () {
      menuDraggable = false;
    });

    var closeBtn = document.getElementById('closeBtn');
    closeBtn.addEventListener('click', function () {
      menu.style.display = 'none';
      menuVisible = false;
    });

    function createRipple(event) {
      var button = event.currentTarget;
      var ripple = document.createElement('span');
      ripple.className = 'ripple';
      var diameter = Math.max(button.clientWidth, button.clientHeight);
      var radius = diameter / 2;
      ripple.style.width = ripple.style.height = diameter + 'px';
      ripple.style.left = event.clientX - button.getBoundingClientRect().left - radius + 'px';
      ripple.style.top = event.clientY - button.getBoundingClientRect().top - radius + 'px';
      button.appendChild(ripple);
      setTimeout(function () {
        ripple.remove();
      }, 1000);
    }

    var buttons = document.querySelectorAll('#blooketMenu button');
    buttons.forEach(function (button) {
      button.addEventListener('click', createRipple);
    });

    document.getElementById('lockButton').addEventListener('click', function () {
      function lockdown() {
        const divElement = document.getElementById('idNum');

        if (divElement) {
          divElement.textContent = 'Locked';
        }

        var headerTextRightElement = document.querySelector('.styles__headerTextRight___o9WG4-camelCase');

        if (headerTextRightElement) {
          var children = headerTextRightElement.childNodes;
          for (var i = children.length - 1; i >= 0; i--) {
            if (children[i].nodeName !== 'I') {
              headerTextRightElement.removeChild(children[i]);
            }
          }
        }

        const qrHolderElement = document.querySelector('.styles__qrHolder___30zO_-camelCase');

        if (qrHolderElement) {
          qrHolderElement.remove();
        }

        const copyButtonElement = document.querySelector('.styles__copyButton___3iVTv-camelCase');

        if (copyButtonElement) {
          copyButtonElement.remove();
        }

        const rightContainerElement = document.querySelector('.styles__rightContainer___1chxB-camelCase');

        if (rightContainerElement) {
          rightContainerElement.remove();
        }

        const headerTextLeftElement = document.querySelector('.styles__headerTextLeft___1qX9q-camelCase');

        if (headerTextLeftElement) {
          headerTextLeftElement.remove();
        }

        const startContainerElement = document.querySelector('.styles__startContainer___3WObI-camelCase');

        if (startContainerElement) {
          startContainerElement.remove();
        }

        const qrContainerElement = document.querySelector('.styles__qrContainer___1MGrr-camelCase');

        if (qrContainerElement) {
          qrContainerElement.remove();
        }

        const gameEndContainerElement = document.querySelector('.styles__gameEndContainer___1AYtY-camelCase');

        if (gameEndContainerElement) {
          gameEndContainerElement.remove();
        }

        console.log('Locked down successfully!');

        clearInterval(lockdownInterval);
      }

      lockdown();

      const lockdownInterval = setInterval(lockdown, 1);
    });

    document.getElementById('brUI').addEventListener('click', function () {
      let playerName = prompt("Who do you want to kick?");
if (playerName) {
  let { stateNode } = Object.values(document.querySelector('#app > div > div'))[1].children[0]._owner;
  stateNode.props.liveGameController.blockUser(playerName);
}
      console.log('btn 1');
    });

    document.getElementById('button2').addEventListener('click', function () {
      function checkDivs() {
        var divElements = document.getElementsByTagName('div');

        var divsWithZero = [];

        for (var i = 0; i < divElements.length; i++) {
          var div = divElements[i];

          if (div.style.display === 'block' && div.style.whiteSpace === 'nowrap') {
            // Check if the text inside the div is "0"
            if (div.textContent.trim() === '0') {
              divsWithZero.push(div);
            }
          }
        }

        if (divsWithZero.length > 1) {
          divsWithZero.forEach(function (div) {
            div.click();
          });
        }
      }

      checkDivs();

      setInterval(checkDivs, 1);

      console.log('btn 2');
    });

    var page2Button = document.getElementById('page2');
    var button2Text = 'Page 2';
    var page2Div = null;

    page2Button.addEventListener('click', function () {
      if (!page2Div) {
        page2Div = document.createElement('div');
        page2Div.id = 'page2Div';
        page2Div.innerHTML =
  '<hr style="border: none; border-top: 1px solid #ffffff;">' +
  '<p style="color: white;">This is page 2</p>' +
  '<button id="page2Button1" title="Page 2 Button 1">Button 1</button>' +
  '<button id="page2Button2" title="Clears distractions in Factory.">Clear distractions</button>' +
  '<button id="page2Button3" title="Page 2 Button 3">Button 3</button>';
menu.appendChild(page2Div);



        var page2Button1 = document.getElementById('page2Button1');
page2Button1.addEventListener('click', function () {
  console.log('Page 2 Button 1');
  createRipple(event);
});

var page2Button2 = document.getElementById('page2Button2');
page2Button2.addEventListener('click', async function (event) {
  let { stateNode } = Object.values(document.querySelector('body div[class*="camelCase"]'))[1].children[0]._owner;
  stateNode.setState({
    bits: 0,
    ads: [],
    hazards: [],
    color: "",
    lol: false,
    joke: false,
    slow: false,
    dance: false,
    glitch: "",
    glitcherName: "",
    glitcherBlook: ""
  });
  clearTimeout(stateNode.adTimeout);
  clearInterval(stateNode.hazardInterval);
  clearTimeout(stateNode.nightTimeout);
  clearTimeout(stateNode.glitchTimeout);
  clearTimeout(stateNode.lolTimeout);
  clearTimeout(stateNode.jokeTimeout);
  clearTimeout(stateNode.slowTimeout);
  clearTimeout(stateNode.danceTimeout);
  createRipple(event);
});

var page2Button3 = document.getElementById('page2Button3');
page2Button3.addEventListener('click', function (event) {
  console.log('Page 2 Button 3');
  createRipple(event);
});

button2Text = 'Hide Page 2';
page2Button.textContent = button2Text;
      }
    });
  }

  createMenu();
})();