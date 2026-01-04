// ==UserScript==
// @name        Moomoo.io - DarkMode & PurityEnhance
// @author      Seryo
// @description Chat Button Disappears, 100 Starting Resources, Purple HP Bar (you & ur tribe), Minimalist Menu, Relaxed Element Names.
// @version     0.1
// @match       *://*.moomoo.io/*
// @namespace   https://greasyfork.org/users/1190411
// @icon        https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b/cursor12.png
// @license     MIT
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/476896/Moomooio%20-%20DarkMode%20%20PurityEnhance.user.js
// @updateURL https://update.greasyfork.org/scripts/476896/Moomooio%20-%20DarkMode%20%20PurityEnhance.meta.js
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
          document.getElementById("ageBar").style.backgroundColor = "rgba(0, 0, 0, 0.25)"
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