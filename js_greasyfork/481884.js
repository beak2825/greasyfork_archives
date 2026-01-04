// ==UserScript==
// @name         Moomoo.io - Dark Visuals
// @author       Seryo
// @version      1.2
// @description  Menu and gameplay enhancements with a minimalist touch.
// @             details:  Remove unnecessary menu elements, chat button, and death text. Stylish purple HP bar. Start with 100 initial resources. Customize elements with laid-back name changes. Tailor ping and shutdown warnings to your preferences.
// @             Tailor everything to your preferences.
// @match        *://*.moomoo.io/*
// @namespace    https://greasyfork.org/users/1190411
// @icon         https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b/cursor12.png
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481884/Moomooio%20-%20Dark%20Visuals.user.js
// @updateURL https://update.greasyfork.org/scripts/481884/Moomooio%20-%20Dark%20Visuals.meta.js
// ==/UserScript==

window.addEventListener("load", () => {

    let toggleRender = true;
    let canvas = document.getElementById("gameCanvas");
    let ctx = canvas.getContext("2d");
    let screenWidth = 1920;
    let screenHeight = 1080;
    let screenW = screenWidth / 2;
    let screenH = screenHeight / 2;

    function render() {

        if (toggleRender) {

            ctx.beginPath();

            let gradient = ctx.createRadialGradient(screenW, screenH, 0, screenW, screenH, screenWidth);
            for (let i = 0; i <= 1; i++) {
                gradient.addColorStop(i, "rgba(0, 0, 0, " + i + ")");
            }

            ctx.fillStyle = gradient;
            ctx.rect(0, 0, screenWidth, screenHeight);
            ctx.fill();

        }

        window.requestAnimFrame(render);

    }

    render();
});

(function() {
    "use strict";

    const log = console.log;

    function createHook(target, prop, callback) {
        const symbol = Symbol(prop);
        Object.defineProperty(target, prop, {
            get() {
                return this[symbol];
            },
            set(value) {
                callback(this, symbol, value);
            },
            configurable: true
        });
    }

    createHook(Object.prototype, "maxPlayers", function(that, symbol, value) {
        delete Object.prototype.maxPlayers;
        that.maxPlayers = value + 12;
    });
})();

(function() {
    var ot_Script = `
        function modifyCanvasRenderingContext2D() {
          if (CanvasRenderingContext2D.prototype.roundRect) {
            CanvasRenderingContext2D.prototype.roundRect = ((oldFunc) => function() {
              if (this.fillStyle === "#8ecc51") {
                this.fillStyle = "#8551f5";
              }
              return oldFunc.call(this, ...arguments);
            })(CanvasRenderingContext2D.prototype.roundRect);
          }
        }

        function modifyUIElements() {
          document.getElementById('enterGame').innerHTML = 'Play';
          document.getElementById('loadingText').innerHTML = '';
          document.getElementById('nameInput').placeholder = '';
          document.getElementById('chatBox').placeholder = '';
          document.getElementById('adCard')?.remove();
          document.getElementById('errorNotification')?.remove();
          document.getElementById('gameName').innerHTML = '';
          document.getElementById('promoImg')?.remove();
          document.getElementById("mainMenu").style.backgroundImage = "url('https://wallpaperset.com/w/full/1/0/f/380248.jpg')";
          document.getElementById("mainMenu").style.backgroundSize = "cover";
          document.getElementById("mainMenu").style.width = "100%";
          document.getElementById("mainMenu").style.height = "100vh";
          document.getElementById("pingDisplay").style.color = "584487"
          document.getElementById("killCounter").style.color = "584487"
          document.getElementById("killCounter").style.backgroundColor = "rgba(0, 0, 0, 0.10)"
          document.getElementById("scoreDisplay").style.backgroundColor = "rgba(0, 0, 0, 0.10)"
          document.getElementById("foodDisplay").style.color = "584487"
          document.getElementById("foodDisplay").style.backgroundColor = "rgba(0, 0, 0, 0.10)"
          document.getElementById("woodDisplay").style.color = "584487"
          document.getElementById("woodDisplay").style.backgroundColor = "rgba(0, 0, 0, 0.10)"
          document.getElementById("stoneDisplay").style.color = "584487"
          document.getElementById("stoneDisplay").style.backgroundColor = "rgba(0, 0, 0, 0.10)"
          document.getElementById("leaderboard").style.color = "584487"
          document.getElementById("leaderboard").style.backgroundColor = "rgba(0, 0, 0, 0.10)"
          document.getElementById('chatBox').style.color = "584487"
          document.getElementById('chatBox').style.backgroundColor = "rgba(0, 0, 0, 0.10)"
          document.getElementById("ageText").style.color = "584487"
          document.getElementById("ageBar").style.backgroundColor = "rgba(0, 0, 0, 0.10)"
          document.getElementById('chatButton').style.color = "584487"
          document.getElementById("chatButton").style.backgroundColor = "rgba(0, 0, 0, 0.10)"
          document.getElementById("ageBarBody").style.backgroundColor = "584487"
          document.getElementById("mapDisplay").style.backgroundColor = "rgba(0, 0, 0, 0.10)"
          document.getElementById("allianceButton").style.color = "584487"
          document.getElementById("allianceButton").style.backgroundColor = "rgba(0, 0, 0, 0.10)"
          document.getElementById("storeButton").style.color = "584487"
          document.getElementById("storeButton").style.backgroundColor = "rgba(0, 0, 0, 0.10)"

          const storeHolder = document.getElementById("storeHolder");
          if (storeHolder) {
            storeHolder.style = "height: 200px; width: 400px;";
          }

          const elementsToRemove = [
            "#youtuberOf",
            "#followText",
            "#promoImgHolder",
            "#twitterFollow",
            "#joinPartyButton",
            "#linksContainer2",
            "#partyButton",
            "#youtubeFollow",
            "#adBlock",
            "#mobileInstructions",
            "#downloadButtonContainer",
            "#mobileDownloadButtonContainer",
            ".downloadBadge",
            "#ot-sdk-btn-floating",
            "#pre-content-container"
          ];

          elementsToRemove.forEach((selector) => {
            $(selector)?.remove();
          });
        }

        $(document).ready(function() {
          modifyCanvasRenderingContext2D();
          modifyUIElements();
        });
    `;

    function injectScript(script) {
        var scriptElement = document.createElement('script');
        scriptElement.innerHTML = script;
        document.head.appendChild(scriptElement);
    }
    window.addEventListener('load', function() {
        injectScript(ot_Script);
    });
})();

(function() {
    'use strict';

    window.addEventListener('load', function() {

        var chatButton = document.getElementById('chatButton');
        if (chatButton) {
            chatButton.style.display = 'none';
        }
    });
})();


function StartRes() {
    window.follmoo("moofoll", 1);
}

StartRes();

var diedText = document.getElementById("diedText");

if (diedText) {

    diedText.remove();
}

(function() {
    'use strict';

    const elementsToRemove = document.querySelectorAll('.menuText, .menuHeader, .menuLink');
    elementsToRemove.forEach(element => {
        element.remove();
    });

    const specificElementToRemove = document.getElementById('desktopInstructions');
    if (specificElementToRemove) {
        specificElementToRemove.remove();
    }

    const pingDisplayDiv = document.querySelector('#pingDisplay');
    if (pingDisplayDiv) {
        pingDisplayDiv.style.color = '#fff';
        pingDisplayDiv.style.textShadow = '3px 3px 3px black';
    }

    const shadowStyle = 'box-shadow: 0 0 10px 10px rgba(0, 0, 0, 0.4)';

    const setupCardDiv = document.getElementById('setupCard');
    if (setupCardDiv) {
        setupCardDiv.style.cssText += shadowStyle;
    }

    const serverBrowserSelect = document.getElementById('serverBrowser');
    if (serverBrowserSelect) {
        serverBrowserSelect.style.color = '#333';
        serverBrowserSelect.style.backgroundColor = '#e5e3e4';
    }

    const enterGameButton = document.getElementById('enterGame');
    if (enterGameButton) {
        enterGameButton.style.backgroundColor = '#333';
    }

    if (pingDisplayDiv) {
        document.body.appendChild(pingDisplayDiv);
    }

    const style = document.createElement('style');
    style.innerHTML = `
        .menuLink {
            font-size: 20px;
            color: #333;
        }
        a {
            color: #333;
            text-decoration: none;
        }
    `;
    document.head.appendChild(style);

    const nameInputElement = document.getElementById('nameInput');
    if (nameInputElement) {
        nameInputElement.style.color = '#333';
    }

    const guideCardDiv = document.getElementById('guideCard');
    if (guideCardDiv) {
        guideCardDiv.style.cssText += shadowStyle;
        setupCardDiv.style.backgroundColor = '#181818';
        guideCardDiv.style.backgroundColor = '#181818';
    }

    const shutdownDisplayDiv = document.querySelector('#shutdownDisplay');
    if (shutdownDisplayDiv) {
        shutdownDisplayDiv.style.position = 'absolute';
        shutdownDisplayDiv.style.top = '15px';
        shutdownDisplayDiv.style.left = '150px';
        shutdownDisplayDiv.style.color = '#820000';
        shutdownDisplayDiv.style.fontSize = '200%';
        shutdownDisplayDiv.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.7)';
    }
})();