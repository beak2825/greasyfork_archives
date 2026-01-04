/// ==UserScript==
// @name         MakeItMeme Menu
// @icon         https://makeitmeme.com/favicon.ico
// @namespace    https://tampermonkey.net/
// @version      1.1
// @description  It's finally out!
// @author       Generic Human
// @license      Ask for permission in the Greasy Fork comments before copying.
// @match        https://*.makeitmeme.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/473232/MakeItMeme%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/473232/MakeItMeme%20Menu.meta.js
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
      background: linear-gradient(to bottom, #000000, #110c29);
      border: 2px solid #000000;
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

function automateButtonClick() {
    // Find the button with the specified class
    var button = document.querySelector('.MuiButton-containedSecondary');

    // If the button is found, trigger a click event on it
    if (button) {
        button.click();
    }
}

// Use a MutationObserver to wait for changes in the DOM
var observer = new MutationObserver(function (mutationsList) {
    // Check if the desired button is present after each DOM change
    automateButtonClick();
});

// Start observing changes in the DOM
observer.observe(document.documentElement, { childList: true, subtree: true });

// Call the function to automate the button click 1 second after the page fully loads
setTimeout(function () {
    automateButtonClick();
}, 1000);


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
      '<img src="https://makeitmeme.com/favicon.ico" width="45" height="45">' +
      '<h2>MakeItMeme Menu</h2>' +
      '<div id=\'closeBtn\'>X</div>' +
      '<p style="font-size: 18px;"><a href=\'https://greasyfork.org/users/1106635\' target=\'_blank\'>generic</a></p>' +
      '<hr style="border: none; border-top: 1px solid #ffffff;">' +
      '<button id="lockButton" title="Fixes cookies. Heavily work in progress.">FixCookies</button>' +
      '<button id=\'brUI\' title=\'reskin\'>RESKIN 4 THE WIN</button>' +
      '<button id=\'button2\' title=\'reskin\'>RESKIN 4 THE WIN</button>' +
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
    function fixCookies() {

        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;


            document.cookie = name + "=   ; path=/;";
        }
    }

    fixCookies();
    alert("Done!");
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
  '<button id="page2Button2" title="Page 2 Button 2">Button 2</button>' +
  '<button id="page2Button3" title="Page 2 Button 3">Button 3</button>';
menu.appendChild(page2Div);



        var page2Button1 = document.getElementById('page2Button1');
page2Button1.addEventListener('click', function () {
  console.log('Page 2 Button 1');
  createRipple(event);
});

var page2Button2 = document.getElementById('page2Button2');
page2Button2.addEventListener('click', function () {
  console.log('Page 2 Button 2');
  createRipple(event);
});

var page2Button3 = document.getElementById('page2Button3');
page2Button3.addEventListener('click', function () {
  console.log('Page 2 Button 3');
  createRipple(event);
});

        button2Text = 'Hide Page 2';
        page2Button.textContent = button2Text;
      } else {
        menu.removeChild(page2Div);
        page2Div = null;

        button2Text = 'Page 2';
        page2Button.textContent = button2Text;
      }
    });
  }

  createMenu();
})();