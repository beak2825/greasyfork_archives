// ==UserScript==
// @name         MooMoo.io Stack Visualizers
// @namespace    https://moomoo.io/
// @version      2024-08-29
// @description  MooMoo.io Visuals without bundle.
// @author       BianosakaSozinho
// @match        *://*.moomoo.io/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @icon         https://moomoo.io/img/favicon.png?v=1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505782/MooMooio%20Stack%20Visualizers.user.js
// @updateURL https://update.greasyfork.org/scripts/505782/MooMooio%20Stack%20Visualizers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var menu = document.createElement(`div`);
    menu.id = `menu`;
    menu.innerHTML = `
      <label id='wow'>MooMoo io Visualizer</label>
      <p> Health Color: <input type="color" value="#8ecc51" id="healthColor"> </p>
      <p> Enemy Health: <input type="color" value="#cc5151" id="enemyHealthColor"> </p>
      <p> Damage Text Color: <input type="color" value="#ffffff" id="damageColor"> </p>
      <p> Health Text Color: <input type="color" value="#8ecc51" id="healthTColor"> </p>
      <p> Chat Text Color: <input type="color" value="#ffffff" id="chatTColor"> </p>
      <p> My Chat Text Color: <input type="color" value="#ffffff" id="myChatColor"> </p>
      <p> Nickname Color: <input type="color" value="#ffffff" id="nickColor"> </p>
      <p> My Player Nick Color: <input type="color" value="#ffffff" id="myPNColor"> </p>
      <p> Text Outline: <input type="checkbox" id="outlineText"> </p>
      <p> Remove Grids: <input type="checkbox" id="grids"> </p>
    `;
    let style = document.createElement(`style`);
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

      #menu {
        display: flex;
        position: fixed;
        flex-direction: column;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 400px;
        height: 600px;
        color: white;
        background-color: #4C4C4C;
        font-family: "Be Vietnam Pro", sans-serif;
        border-radius: 6px;
        z-index: 50;
        overflow-y: auto;
      }

      #menu > p {
        margin-left: 4px;
      }

      p > input {
        cursor: pointer;
      }

      #wow {
        text-align: center;
        font-size: 24px;
      }

      #menu::-webkit-scrollbar {
        width: 8px;
      }

      #menu::-webkit-scrollbar-track {
        background: #4C4C4C;
        border-radius: 4px;
      }

      #menu::-webkit-scrollbar-thumb {
        background-color: #3C3C3C;
        border-radius: 4px;
      }

      #menu::-webkit-scrollbar-thumb:hover {
        background-color: #2C2C2C;
      }
    `;

    document.head.appendChild(style);
    document.body.prepend(menu);
    let myChat;
    document.addEventListener(`keydown`, e => {
        if(e.keyCode == 27) $(`#menu`).toggle()
        if(e.keyCode == 13 && document.getElementById('chatHolder').style.display == `block`) myChat = document.getElementById('chatBox').value;
    })

    const originalFillText = CanvasRenderingContext2D.prototype.fillText;
    const originalStrokeText = CanvasRenderingContext2D.prototype.strokeText;
    const originalMoveTo = CanvasRenderingContext2D.prototype.moveTo;
    const originalRoundRect = CanvasRenderingContext2D.prototype.roundRect;
    const originaldrawImage = CanvasRenderingContext2D.prototype.drawImage;

    CanvasRenderingContext2D.prototype.fillText = function(text, x, y, maxWidth) {
        if (text !== 'x' && document.getElementById('outlineText').checked) {
            originalStrokeText.call(this, text, x, y, maxWidth);
        }
        if(this.fillStyle == '#ffffff' && typeof text === 'number') this.fillStyle = document.getElementById('damageColor').value
        if(this.fillStyle == '#8ecc51') this.fillStyle = document.getElementById('healthTColor').value;
        if (this.fillStyle === '#ffffff' && this.font === `30px "Hammersmith One"`) {
            if (text === localStorage.getItem('moo_name')) {
                this.fillStyle = document.getElementById('myPNColor').value;
            } else {
                this.fillStyle = document.getElementById('nickColor').value;
            }
        }
        if(text == myChat) {
            this.fillStyle = document.getElementById('myChatColor').value;
        }
        if(this.fillStyle == '#ffffff' && this.font === `32px "Hammersmith One"` && text != myChat) this.fillStyle = document.getElementById('chatTColor').value;
        originalFillText.call(this, text, x, y, maxWidth);
    }

    CanvasRenderingContext2D.prototype.moveTo = function(x, y) {
        if(this.globalAlpha === 0.06 && document.getElementById('grids').checked) this.globalAlpha = 0;
        originalMoveTo.call(this, x, y);
    }

    CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
        if(this.fillStyle === '#8ecc51') this.fillStyle = document.getElementById('healthColor').value;
        if(this.fillStyle === '#cc5151') this.fillStyle = document.getElementById('enemyHealthColor').value;
        originalRoundRect.call(this, x, y, w, h, r)
    }

})();