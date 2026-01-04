// ==UserScript==
// @name        Gartic Phone Shortcuts Plus
// @namespace   User Scripts
// @match       https://garticphone.com/*
// @grant       none
// @version     1.2
// @author      Rundik, Atterratio
// @license     MIT
// @description Gartic Phone Shortcuts Plus it's fixed and updated script with shortcuts for Gartic Phone from Rundik
// @downloadURL https://update.greasyfork.org/scripts/435968/Gartic%20Phone%20Shortcuts%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/435968/Gartic%20Phone%20Shortcuts%20Plus.meta.js
// ==/UserScript==


// q, w, e, r, t, a, s, d, f = Tools
// 1-9, Shift + 1-9 = Colors
// z, x, c, v, b = Thiknesses
// i = insert an image overlay

window.onload = () => {
  console.log(location.pathname);
  history.pushState = ( f => function pushState(){
  	console.log(location.pathname);
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
    if (location.pathname.includes("/draw")) {
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
    { key: 81, el: document.querySelector(".tool.pen") },
    { key: 65, el: document.querySelector(".tool.ers") },
    { key: 87, el: document.querySelector(".tool.reb") },
    { key: 83, el: document.querySelector(".tool.ellb") },
    { key: 69, el: document.querySelector(".tool.rec") },
    { key: 68, el: document.querySelector(".tool.ell") },
    { key: 82, el: document.querySelector(".tool.lin") },
    { key: 70, el: document.querySelector(".tool.fil") },
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
    { key: 49, el: document.querySelectorAll(".color")[9], shift: true },
    { key: 50, el: document.querySelectorAll(".color")[10], shift: true },
    { key: 51, el: document.querySelectorAll(".color")[11], shift: true },
    { key: 52, el: document.querySelectorAll(".color")[12], shift: true },
    { key: 53, el: document.querySelectorAll(".color")[13], shift: true },
    { key: 54, el: document.querySelectorAll(".color")[14], shift: true },
    { key: 55, el: document.querySelectorAll(".color")[15], shift: true },
    { key: 56, el: document.querySelectorAll(".color")[16], shift: true },
    { key: 57, el: document.querySelectorAll(".color")[17], shift: true },
    // Thikness
    { key: 90, el: document.querySelectorAll(".thickness")[0] },
    { key: 88, el: document.querySelectorAll(".thickness")[1] },
    { key: 67, el: document.querySelectorAll(".thickness")[2] },
    { key: 86, el: document.querySelectorAll(".thickness")[3] },
    { key: 66, el: document.querySelectorAll(".thickness")[4] },
    // Insert image
    { key: 73, func: () => {
      const src = prompt("Image URL:");
      const canvas = document.querySelector(".drawingContainer canvas");
      const context = canvas.getContext('2d');
      const img = new Image();
      img.onload = function() {
        // context.drawImage(this, 0, 0, canvas.width, canvas.height);
        var width_diff = this.width - canvas.width;
        var height_diff = this.height - canvas.width;
        if (width_diff > height_diff && width_diff > 0) {
            var width = canvas.width
            var height = canvas.width * this.height / this.width
        } else {
            width = canvas.height * this.width / this.height
            height = canvas.height
        }
        var posX = canvas.width / 2 - width / 2
        var posY = canvas.height / 2 - height / 2
        context.drawImage(
            this,
            posX,
            posY,
            canvas.height * this.width / this.height,
            canvas.height
        );
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