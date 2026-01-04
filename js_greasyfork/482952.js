// ==UserScript==
// @name         点击波纹特效
// @namespace    https://sharechain.qq.com/a5a372bae6710cac84a1554022378a57
// @version      0.2
// @description  点击时显示波纹特效。脚本菜单可更改大小, 颜色, 数量
// @author       You
// @run-at       document-idle
// @match        *://*/*
// @license      MIT
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/482952/%E7%82%B9%E5%87%BB%E6%B3%A2%E7%BA%B9%E7%89%B9%E6%95%88.user.js
// @updateURL https://update.greasyfork.org/scripts/482952/%E7%82%B9%E5%87%BB%E6%B3%A2%E7%BA%B9%E7%89%B9%E6%95%88.meta.js
// ==/UserScript==

// 添加菜单
GM_registerMenuCommand('波纹大小', function() {
    var newSize = prompt("请输入新的波纹大小，格式为 'min,max'（例如：6,10）：", GM_getValue('rippleSize', '6,10').split(","));
    if (newSize !== null && newSize !== '') {
        GM_setValue('rippleSize', newSize);
    }
});

GM_registerMenuCommand('波纹颜色', function() {
    var newColors = prompt("请输入新的波纹颜色，多个颜色请使用逗号分隔（例如：#F73859,#14FFEC,#00E0FF）：", GM_getValue('rippleColors', '#F73859,#14FFEC,#00E0FF,#FF99FE,#FAF15D').split(","));
    if (newColors !== null && newColors !== '') {
        GM_setValue('rippleColors', newColors);
    }
});

GM_registerMenuCommand('波纹数量', function() {
    var newCount = prompt("请输入新的波纹数量：", GM_getValue('rippleCount', 1));
    if (newCount !== null && newCount !== '') {
        GM_setValue('rippleCount', newCount);
    }
});

function clickEffect() {
  let balls = [];
  let longPressed = false;
  let longPress;
  let multiplier = 0;
  let width, height;
  let origin;
  let normal;
  let ctx;
  const colours = GM_getValue('rippleColors', '#F73859,#14FFEC,#00E0FF,#FF99FE,#FAF15D').split(",");
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  canvas.setAttribute("style", "width: 100%; height: 100%; top: 0; left: 0; z-index: 99999; position: fixed; pointer-events: none;");
  const pointer = document.createElement("span");
  pointer.classList.add("pointer");
  document.body.appendChild(pointer);

  if (canvas.getContext && window.addEventListener) {
    ctx = canvas.getContext("2d");
    updateSize();
    window.addEventListener('resize', updateSize, false);
    loop();
    window.addEventListener("mousedown", function(e) {
      pushBalls(GM_getValue('rippleCount', 1), e.clientX, e.clientY);
      document.body.classList.add("is-pressed");
      longPress = setTimeout(function(){
        document.body.classList.add("is-longpress");
        longPressed = true;
      }, 500);
    }, false);
    window.addEventListener("mouseup", function(e) {
      clearInterval(longPress);
      if (longPressed == true) {
        document.body.classList.remove("is-longpress");
        pushBalls(randBetween(40 + Math.ceil(multiplier), 80 + Math.ceil(multiplier)), e.clientX, e.clientY);
        longPressed = false;
      }
      document.body.classList.remove("is-pressed");
    }, false);
    window.addEventListener("mousemove", function(e) {
      let x = e.clientX;
      let y = e.clientY;
      pointer.style.top = y + "px";
      pointer.style.left = x + "px";
    }, false);
  } else {
  }

  function updateSize() {
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * pixelRatio;
    canvas.height = window.innerHeight * pixelRatio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(pixelRatio, pixelRatio);
    width = (canvas.width = window.innerWidth);
    height = (canvas.height = window.innerHeight);
    origin = {
      x: width / 2,
      y: height / 2
    };
    normal = {
      x: width / 2,
      y: height / 2
    };
  }

  class Ball {
    constructor(x = origin.x, y = origin.y) {
      this.x = x;
      this.y = y;
      this.angle = Math.PI * 2 * Math.random();
      if (longPressed == true) {
        this.multiplier = randBetween(1, 2);
      } else {
        this.multiplier = randBetween(3, 6);
      }
      this.vx = (this.multiplier + Math.random() * 0.5) * Math.cos(this.angle);
      this.vy = (this.multiplier + Math.random() * 0.5) * Math.sin(this.angle);
      this.r = randBetween(parseInt(GM_getValue('rippleSize', '6,10').split(",")[0]), parseInt(GM_getValue('rippleSize', '6,10').split(",")[1])) + 3 * Math.random();
      this.color = colours[Math.floor(Math.random() * colours.length)];
    }
    update() {
      this.x += this.vx - normal.x;
      this.y += this.vy - normal.y;
      normal.x = -2 / window.innerWidth * Math.sin(this.angle);
      normal.y = -2 / window.innerHeight * Math.cos(this.angle);
      this.r -= 0.3;
      this.vx *= 0.9;
      this.vy *= 0.9;
    }
  }

  function pushBalls(count = 1, x = origin.x, y = origin.y) {
    for (let i = 0; i < count; i++) {
      balls.push(new Ball(x, y));
    }
  }

  function randBetween(min, max) {
    return Math.floor(Math.random() * max) + min;
  }

  function loop() {
    ctx.fillStyle = "rgba(255, 255, 255, 0)";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < balls.length; i++) {
      let b = balls[i];
      if (b.r < 0) continue;
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2, false);
      ctx.fill();
      b.update();
    }
    if (longPressed == true) {
      multiplier += 0.2;
    } else if (!longPressed && multiplier >= 0) {
      multiplier -= 0.4;
    }
    removeBall();
    requestAnimationFrame(loop);
  }

  function removeBall() {
    for (let i = 0; i < balls.length; i++) {
      let b = balls[i];
      if (b.x + b.r < 0 || b.x - b.r > width || b.y + b.r < 0 || b.y - b.r > height || b.r < 0) {
        balls.splice(i, 1);
      }
    }
  }
}

// 调用特效函数
clickEffect();
