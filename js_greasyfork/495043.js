// ==UserScript==
// @name         橙光游戏修改累充和商城
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  修改鲜花累充为1500，修改商城购买数量。
// @author       QQ1447383974
// @match        https://m.66rpg.com/h5/*
// @icon         https://c2.cgyouxi.com/website/mobile/img/OrangeLike/icon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495043/%E6%A9%99%E5%85%89%E6%B8%B8%E6%88%8F%E4%BF%AE%E6%94%B9%E7%B4%AF%E5%85%85%E5%92%8C%E5%95%86%E5%9F%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/495043/%E6%A9%99%E5%85%89%E6%B8%B8%E6%88%8F%E4%BF%AE%E6%94%B9%E7%B4%AF%E5%85%85%E5%92%8C%E5%95%86%E5%9F%8E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();

// Get the button element

const button = document.createElement('button');

button.innerText = '插件开启';

document.body.appendChild(button);

// Add an event listener to the button

button.addEventListener('click', () => {

  // Set the value of userData.totalFlower to 1500

  userData.freshFlower=1500;
  userData.wildFlower=1500;
  userData.tempFlower=1500;
  userData.realFlower=1500;
  userData.haveFlower=1500;
  userData.totalFlower=1500;
  userData.restFlower=1500;
  userData.rest_Flower=1500;
  gIndex ='1670380';
alert('开启脚本成功');

});


setInterval(function() {
  if (累充数 !== 1500) {

    location.reload(); // 破防代码location.reload启用

  }
},10000);