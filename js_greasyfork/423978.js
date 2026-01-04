// ==UserScript==
// @name        Gartic Phone Shortcuts
// @namespace   Violentmonkey Scripts
// @match       https://garticphone.com/*
// @grant       none
// @version     1.1
// @author      Rundik
// @description 3/25/2021, 9:17:44 PM
// @downloadURL https://update.greasyfork.org/scripts/423978/Gartic%20Phone%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/423978/Gartic%20Phone%20Shortcuts.meta.js
// ==/UserScript==


// space, z, x, c, a, s, d, w = Tools
// 1-9, Shift + 1-8 = Colors
// Shift + space, Shift + z, Shift + x, Shift + c, Shift + a = Thiknesses
// p = insert an image overlay  
  

window.onload = () => {
  history.pushState = ( f => function pushState(){
    const ret = f.apply(this, arguments);
    window.dispatchEvent(new Event('pushstate'));
    window.dispatchEvent(new Event('locationchange'));
    return ret;
  })(history.pushState);

  history.replaceState = ( f => function replaceState(){
      const ret = f.apply(this, arguments);
      window.dispatchEvent(new Event('replacestate'));
      window.dispatchEvent(new Event('locationchange'));
      return ret;
  })(history.replaceState);

  window.addEventListener('popstate',()=>{
      window.dispatchEvent(new Event('locationchange'))
  });

  window.addEventListener('locationchange', () => {
    console.log(location.pathname);
    if (location.pathname === "/draw") {
      window.ondrawpage = true;
      setTimeout(initKeybinds, 1000);
      document.removeEventListener("keyup", keyupEvent);
      document.addEventListener("keyup", keyupEvent);
    } else {
      window.ondrawpage = false;
    }
  });
};

const initKeybinds = () => {
  window.keybinds = [
    // Tools
    { key: 32, el: document.querySelector(".tools .pen") },
    { key: 90, el: document.querySelector(".tools .ers") },
    { key: 88, el: document.querySelector(".tools .reb") },
    { key: 67, el: document.querySelector(".tools .ellb") },
    { key: 65, el: document.querySelector(".tools .rec") },
    { key: 83, el: document.querySelector(".tools .ell") },
    { key: 68, el: document.querySelector(".tools .lin") },
    { key: 87, el: document.querySelector(".tools .fil") },
    // Colors
    { key: 49, el: document.querySelectorAll(".color")[0] },
    { key: 50, el: document.querySelectorAll(".color")[1] },
    { key: 51, el: document.querySelectorAll(".color")[2] },
    { key: 52, el: document.querySelectorAll(".color")[3] },
    { key: 53, el: document.querySelectorAll(".color")[4] },
    { key: 54, el: document.querySelectorAll(".color")[5] },
    { key: 55, el: document.querySelectorAll(".color")[6] },
    { key: 56, el: document.querySelectorAll(".color")[7] },
    { key: 57, el: document.querySelectorAll(".color")[8] },
    { key: 48, el: document.querySelectorAll(".color")[9] },
    { key: 49, el: document.querySelectorAll(".color")[10], shift: true },
    { key: 50, el: document.querySelectorAll(".color")[11], shift: true },
    { key: 51, el: document.querySelectorAll(".color")[12], shift: true },
    { key: 52, el: document.querySelectorAll(".color")[13], shift: true },
    { key: 53, el: document.querySelectorAll(".color")[14], shift: true },
    { key: 54, el: document.querySelectorAll(".color")[15], shift: true },
    { key: 55, el: document.querySelectorAll(".color")[16], shift: true },
    { key: 56, el: document.querySelectorAll(".color")[17], shift: true },
    // Thikness
    { key: 32, el: document.querySelectorAll(".thickness")[0], shift: true },
    { key: 90, el: document.querySelectorAll(".thickness")[1], shift: true },
    { key: 88, el: document.querySelectorAll(".thickness")[2], shift: true },
    { key: 67, el: document.querySelectorAll(".thickness")[3], shift: true },
    { key: 65, el: document.querySelectorAll(".thickness")[4], shift: true },
    // Insert image
    { key: 80, func: () => {
      const src = prompt("Image URL:");
      const canvas = document.querySelector(".drawingContainer canvas");
      const context = canvas.getContext('2d');
      const img = new Image();
      img.onload = function() {
        context.drawImage(this, 0, 0, canvas.width, canvas.height);
      }
      img.src = src;
    }}
  ];
}

const keyupEvent = function(e) {
  keybinds.every(k => {
    if (!e.ctrlKey && window.ondrawpage && ((!k.shift && !e.shiftKey && e.which === k.key) || (k.shift && e.which === k.key && e.shiftKey))) {
      if (k.func) {
        k.func()
      } else {
        k.el.click();
      }
      return false;
    }
    return true;
  });
}