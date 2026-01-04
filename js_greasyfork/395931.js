// ==UserScript==
// @name         Arknights SD Additional Backgrounds
// @namespace    https://twitter.com/Automalix
// @version      0.0.4
// @description  Adds some fun backgrounds to the Arknights Sprite Database viewer.
// @author       Felix "Automalix"
// @match        https://arknights.nuke.moe/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395931/Arknights%20SD%20Additional%20Backgrounds.user.js
// @updateURL https://update.greasyfork.org/scripts/395931/Arknights%20SD%20Additional%20Backgrounds.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let addGlobalStyle = css => {
        let head = document.getElementsByTagName('head')[0];
        if (!head) return;
        let style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
    addGlobalStyle(`.tt {
      display: inline-block;
      position: relative;
      border-bottom: 1px dotted black;
    }
    .tt .ttx {
      visibility: hidden;
      width: 110px;
      background-color: rgba(0,0,0,0.5);
      color: #fff;
      text-align: center;
      border-radius: 6px;
      padding: 5px 0;
      position: absolute;
      bottom: 35%;
      left: 50%;
      margin-left: -55px;
      z-index: 999;
    }
    .tt:hover .ttx {
      visibility: visible;
    }`);
    let office = ['https://i.imgur.com/1V84jO0.png', 'office', 'HR Office'],
        reception = ['https://i.imgur.com/AOTkaMv.png', 'reception', 'Reception'],
        trainingRoom = ['https://i.imgur.com/OiGZgiP.png', 'trainingRoom', 'Training Room'],
        powerPlant = ['https://i.imgur.com/9ycOHGm.png', 'powerPlant', 'Power Plant'],
        dormBG = ['https://i.imgur.com/YB6G2eg.png', 'dormBG', 'Dormatory'],
        tradingPost = ['https://i.imgur.com/Fqx1yAi.png', 'tradingPost', 'Trading Post'],
        hexagons = ['https://i.imgur.com/sK43n89.png', 'hexagons', 'Hexagons'],
        cyan = ['https://i.imgur.com/zHfXvBn.jpg', 'cyan', 'Cyan'],
        magenta = ['https://i.imgur.com/KBv3VKe.jpg', 'magenta', 'Magenta'],
        yellow = ['https://i.imgur.com/Fx6PCxC.jpg', 'yellow', 'Yellow'],
        red = ['https://i.imgur.com/o7fuMV3.jpg', 'red', 'Red'],
        black = ['https://i.imgur.com/9j3dBBe.jpg', 'black', 'Black'],
        white = ['https://i.imgur.com/4g3LLKy.jpg', 'white', 'White'],
        none = ['https://i.imgur.com/4Br88bA.png', 'none', 'Transparent'];
    let backgroundArr = [red, cyan, magenta, yellow, black, white, none, office, reception, trainingRoom, powerPlant, dormBG, tradingPost, hexagons];

    let backgroundSelection = picked => {
        document.querySelector("#SdCanvas").style.backgroundImage = `url(${picked})`;
        document.body.removeChild(document.getElementById("selector"));
        document.body.removeChild(document.getElementById("darken"));
        document.body.style.overflow = "auto";
    }
    let thumbnailSelection = arr => {
        let ifTransparent;
        for(let item of arr) {
            item[1] === 'none' ? ifTransparent = 'border:1px solid #98a3b5;' : ifTransparent = 'border: none;';
            document.querySelector('#selector').insertAdjacentHTML('beforeend',
            `<div class="thumbbutton tt" style="${ifTransparent} background-image: url('${item[0]}'); background-size: cover; background-position: 50% 50%;" id="${item[1]}"><span class="ttx">${item[2]}</span></div>`);
            document.getElementById(item[1]).addEventListener('click', () => backgroundSelection(item[0]));
        }
    }
    document.querySelector('.btnGenericText[onclick="onSelectBG()"]').addEventListener('click', e => thumbnailSelection(backgroundArr))
})();