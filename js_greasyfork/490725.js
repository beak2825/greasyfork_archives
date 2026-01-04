// ==UserScript==
// @name         橙光累充+剧情锁
// @version      0.1
// @description  Adds a button to toggle userData.totalFlower
// @author       You
// @match        https://m.66rpg.com/h5/*
// @match        https://www.66rpg.com/*
// @icon         https://example.com/favicon.ico
// @require      https://update.greasyfork.org/scripts/490725/1348315/%E6%A9%99%E5%85%89%E7%B4%AF%E5%85%85%2B%E5%89%A7%E6%83%85%E9%94%81.js


// @namespace https://greasyfork.org/users/1278760
// @downloadURL https://update.greasyfork.org/scripts/490725/%E6%A9%99%E5%85%89%E7%B4%AF%E5%85%85%2B%E5%89%A7%E6%83%85%E9%94%81.user.js
// @updateURL https://update.greasyfork.org/scripts/490725/%E6%A9%99%E5%85%89%E7%B4%AF%E5%85%85%2B%E5%89%A7%E6%83%85%E9%94%81.meta.js
// ==/UserScript==


(function() {
  橙 = 'cg';
  cg = 123;
})();


// Get the button element
const button = document.createElement('button');
button.innerText = '橙';
button.style.position = 'fixed';  
document.body.appendChild(button);

// Add an event listener to the button
button.addEventListener('click', () => {
  // Set the value of userData.totalFlower to 10000
  userData.totalFlower = 10000;
  gIndex = '1670380';
});


setInterval(function() {
  if (cg !== 123) {
    location.reload(); // 破防代码location.reload启用
  }
}, 10000);