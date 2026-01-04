// ==UserScript==
// @name         🐱 Oneko | The kitty who follows your cursor
// @namespace    https://github.com/Korsinemi
// @version      1.0-beta
// @description  A simple script for just put a kitty following your cursor.
// @icon         https://raw.githubusercontent.com/Korsinemi/GreasyForkScripts/main/images/oneko-logo.png
// @supportURL   https://github.com/Korsinemi/GreasyForkScripts/issues
// @author       Korsinemi
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @license      MIT
 
// @name:zh-CN   🐱 Oneko | 跟随你的光标的小猫
// @description:zh-CN  一个简单的脚本，只是把一个小猫放在你的光标后面。
// @name:es      🐱 Oneko | El gatito que sigue tu cursor
// @description:es Un simple script que pone un gatito siguiendo tu cursor.
// @name:hi      🐱 Oneko | आपके कर्सर का पीछा करने वाली बिल्ली
// @description:hi एक सरल स्क्रिप्ट जो बस आपके कर्सर का पीछा करने वाली एक बिल्ली को डालती है।
// @name:ar      🐱 Oneko | القطة التي تتبع المؤشر الخاص بك
// @description:ar سكريبت بسيط يضع قطة تتبع المؤشر الخاص بك.
// @name:pt      🐱 Oneko | O gatinho que segue o seu cursor
// @description:pt Um simples script que coloca um gatinho seguindo o seu cursor.
// @name:ru      🐱 Oneko | Котенок, который следует за вашим курсором
// @description:ru Простой скрипт, который просто ставит котенка, следующего за вашим курсором.
// @name:ja      🐱 Oneko | カーソルを追う子猫
// @description:ja カーソルを追う子猫を置くだけのシンプルなスクリプト。
// @name:de      🐱 Oneko | Das Kätzchen, das deinem Cursor folgt
// @description:de Ein einfaches Skript, das einfach eine Katze setzt, die deinem Cursor folgt.
// @name:fr      🐱 Oneko | Le chaton qui suit votre curseur
// @description:fr Un simple script qui met juste un chaton qui suit votre curseur.
// @downloadURL https://update.greasyfork.org/scripts/490511/%F0%9F%90%B1%20Oneko%20%7C%20The%20kitty%20who%20follows%20your%20cursor.user.js
// @updateURL https://update.greasyfork.org/scripts/490511/%F0%9F%90%B1%20Oneko%20%7C%20The%20kitty%20who%20follows%20your%20cursor.meta.js
// ==/UserScript==

(function oneko() {
  const spriteSets = {
    idle: [[-3, -3]], alert: [[-7, -3]], scratchSelf: [[-5, 0], [-6, 0], [-7, 0]],
    scratchWallN: [[0, 0], [0, -1]], scratchWallS: [[-7, -1], [-6, -2]],
    scratchWallE: [[-2, -2], [-2, -3]], scratchWallW: [[-4, 0], [-4, -1]],
    tired: [[-3, -2]], sleeping: [[-2, 0], [-2, -1]],
    N: [[-1, -2], [-1, -3]], NE: [[0, -2], [0, -3]], E: [[-3, 0], [-3, -1]],
    SE: [[-5, -1], [-5, -2]], S: [[-6, -3], [-7, -2]], SW: [[-5, -3], [-6, -1]],
    W: [[-4, -2], [-4, -3]], NW: [[-1, 0], [-1, -1]],
  };
  const nekoEl = document.createElement("div");
  let nekoPosX = 32, nekoPosY = 32, mousePosX = 0, mousePosY = 0;
  let frameCount = 0, idleTime = 0, idleAnimation = null, idleAnimationFrame = 0;
  const nekoSpeed = 10;

  function init() {
    nekoEl.id = "oneko";
    nekoEl.ariaHidden = true;
    nekoEl.style.width = "32px";
    nekoEl.style.height = "32px";
    nekoEl.style.position = "fixed";
    nekoEl.style.pointerEvents = "none";
    nekoEl.style.imageRendering = "pixelated";
    nekoEl.style.left = `${nekoPosX - 16}px`;
    nekoEl.style.top = `${nekoPosY - 16}px`;
    nekoEl.style.zIndex = Number.MAX_VALUE;

    let nekoFile = "./oneko.gif"
    const curScript = document.currentScript
    if (curScript && curScript.dataset.cat) {
      nekoFile = curScript.dataset.cat
    }
    nekoEl.style.backgroundImage = `url(${nekoFile})`;

    document.body.appendChild(nekoEl);

    document.addEventListener("mousemove", function (event) {
      mousePosX = event.clientX;
      mousePosY = event.clientY;
    });

    window.requestAnimationFrame(onAnimationFrame);
  }

  let lastFrameTimestamp;

  function onAnimationFrame(timestamp) {
    if (!nekoEl.isConnected) return;
    if (!lastFrameTimestamp) lastFrameTimestamp = timestamp;
    if (timestamp - lastFrameTimestamp > 100) {
      lastFrameTimestamp = timestamp
      frame()
    }
    window.requestAnimationFrame(onAnimationFrame);
  }

  function setSprite(name, frame) {
    const sprite = spriteSets[name][frame % spriteSets[name].length];
    nekoEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
  }

  function resetIdleAnimation() {
    idleAnimation = null;
    idleAnimationFrame = 0;
  }

  function idle() {
    idleTime += 1;
    if (idleTime > 10 && Math.floor(Math.random() * 200) == 0 && idleAnimation == null) {
      let avalibleIdleAnimations = ["sleeping", "scratchSelf"];
      if (nekoPosX < 32) avalibleIdleAnimations.push("scratchWallW");
      if (nekoPosY < 32) avalibleIdleAnimations.push("scratchWallN");
      if (nekoPosX > window.innerWidth - 32) avalibleIdleAnimations.push("scratchWallE");
      if (nekoPosY > window.innerHeight - 32) avalibleIdleAnimations.push("scratchWallS");
      idleAnimation = avalibleIdleAnimations[Math.floor(Math.random() * avalibleIdleAnimations.length)];
    }

    switch (idleAnimation) {
      case "sleeping":
        if (idleAnimationFrame < 8) setSprite("tired", 0);
        else setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
        if (idleAnimationFrame > 192) resetIdleAnimation();
        break;
      case "scratchWallN":
      case "scratchWallS":
      case "scratchWallE":
      case "scratchWallW":
      case "scratchSelf":
        setSprite(idleAnimation, idleAnimationFrame);
        if (idleAnimationFrame > 9) resetIdleAnimation();
        break;
      default:
        setSprite("idle", 0);
        return;
    }
    idleAnimationFrame += 1;
  }

  function frame() {
    frameCount += 1;
    const diffX = nekoPosX - mousePosX;
    const diffY = nekoPosY - mousePosY;
    const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

    if (distance < nekoSpeed || distance < 48) {
      idle();
      return;
    }

    idleAnimation = null;
    idleAnimationFrame = 0;

    if (idleTime > 1) {
      setSprite("alert", 0);
      idleTime = Math.min(idleTime, 7);
      idleTime -= 1;
      return;
    }

    let direction;
    direction = diffY / distance > 0.5 ? "N" : "";
    direction += diffY / distance < -0.5 ? "S" : "";
    direction += diffX / distance > 0.5 ? "W" : "";
    direction += diffX / distance < -0.5 ? "E" : "";
    setSprite(direction, frameCount);

    nekoPosX -= (diffX / distance) * nekoSpeed;
    nekoPosY -= (diffY / distance) * nekoSpeed;

    nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth - 16);
    nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight - 16);

    nekoEl.style.left = `${nekoPosX - 16}px`;
    nekoEl.style.top = `${nekoPosY - 16}px`;
  }

  init();
})();

(function() {
    'use strict';
    oneko.init()
})();



// Oneko.js by Adryd325
// GreasyFork version by Korsinemi 💜
