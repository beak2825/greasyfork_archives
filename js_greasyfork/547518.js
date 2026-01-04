// ==UserScript==
// @name         Human Style
// @namespace    http://tampermonkey.net/
// @version      1.5.0
// @description  Evades Style
// @author       Human
// @match        https://evades.io/
// @license      MIT
// @run-at       document-end
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/547518/Human%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/547518/Human%20Style.meta.js
// ==/UserScript==

GM_addStyle(`
.button {
    color: #eeeeee !important;
    border-radius: 10px !important;
    cursor: pointer !important;
    border: 1px solid #eeeeee !important;
    background-color: transparent !important;
    outline: 2px #808080 solid !important;
    text-shadow: #eeeeee 0 0 10px, #ffffff 0 0 20px, #ffffff79 0 0 25px !important;
    outline-offset: -3px !important;
    font-weight: 700 !important;
    font-size: 14px !important;
    transition: all 0.3s ease;
}
.button:hover {
    border: 1px solid #050505 !important;
    color: #050505 !important;
    background-color: #eeeeee !important;
    text-shadow: none !important;
    animation: pulse 1s infinite alternate;
}
@keyframes pulse {
    0% { transform: scale(1); box-shadow: 0 0 5px #eee; }
    100% { transform: scale(1.05); box-shadow: 0 0 20px #eee; }
}
`);


GM_addStyle(`
body.theme-dark { background-color: #0a0a0a !important; color: #e0e0e0 !important; }
body.theme-purple { background-color: #120016 !important; color: #f0d0ff !important; }
body.theme-neon { background-color: #000014 !important; color: #00f9ff !important; }
`);


GM_addStyle(`
#nightMenu {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%) scale(0.9);
    opacity: 0;
    background: #111;
    border: 2px solid #888;
    border-radius: 12px;
    padding: 20px;
    z-index: 99999;
    text-align: center;
    color: #eee;
    font-family: Arial, sans-serif;
    min-width: 340px;
    min-height: 260px;
    box-shadow: 0 0 20px rgba(0,0,0,0.8);
    transition: all 0.3s ease;
    display: none;
    background-size: cover;
    background-position: center;
    overflow: hidden;
}
#nightMenu.active {
    display: block;
    opacity: 1;
    transform: translate(-50%,-50%) scale(1);
}
#nightMenu h2 { margin: 0 0 15px 0; }
#nightMenu label { cursor: pointer; display: block; margin: 8px 0; font-size: 16px; }
#wallControls { margin: 10px 0; }
#wallControls button {
    margin: 0 5px;
    padding: 4px 10px;
    background: rgba(255,255,255,0.1);
    border: 1px solid #aaa;
    border-radius: 6px;
    cursor: pointer;
    color: #eee;
    transition: 0.2s;
}
#wallControls button:hover { background: rgba(255,255,255,0.3); }
#particlesCanvas {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none;
}
`);


const wallpapers = [
  "https://winzoro.net/uploads/posts/2022-10/1666718381_dark-night_preview.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSuQAdqf5DrdIYtvAJGfHPUlKZLZL1GAIRiw&s"
];
let currentWall = 0;


const menu = document.createElement("div");
menu.id = "nightMenu";
menu.style.backgroundImage = `url('${wallpapers[currentWall]}')`;
menu.innerHTML = `
  <canvas id="particlesCanvas"></canvas>
  <div style="position: relative; z-index: 2; background: rgba(0,0,0,0.6); border-radius: 10px; padding: 15px;">
    <h2> Settings </h2>
    <label><input type="radio" name="theme" value="dark"> Night </label>
    <label><input type="radio" name="theme" value="purple"> Violet </label>
    <label><input type="radio" name="theme" value="neon"> Neon </label>
    <div id="wallControls">
      <button id="prevWall">← </button>
      <button id="nextWall"> →</button>
    </div>
    <small>Made by Human</small>
  </div>
`;
document.body.appendChild(menu);


let menuOpen = false;
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    menuOpen = !menuOpen;
    menu.classList.toggle("active", menuOpen);
    if (menuOpen) startParticles(); else stopParticles();
  }
});


const radios = menu.querySelectorAll("input[name=theme]");
radios.forEach(r => {
  r.addEventListener("change", (e) => {
    document.body.classList.remove("theme-dark","theme-purple","theme-neon");
    document.body.classList.add("theme-" + e.target.value);
    localStorage.setItem("evadesTheme", e.target.value);
  });
});
const saved = localStorage.getItem("evadesTheme");
if (saved) {
  document.body.classList.add("theme-" + saved);
  menu.querySelector(`input[value=${saved}]`).checked = true;
}

document.getElementById("prevWall").addEventListener("click", () => {
  currentWall = (currentWall - 1 + wallpapers.length) % wallpapers.length;
  menu.style.backgroundImage = `url('${wallpapers[currentWall]}')`;
});
document.getElementById("nextWall").addEventListener("click", () => {
  currentWall = (currentWall + 1) % wallpapers.length;
  menu.style.backgroundImage = `url('${wallpapers[currentWall]}')`;
});


let ctx, particles = [], animId;
function startParticles() {
  const canvas = document.getElementById("particlesCanvas");
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  ctx = canvas.getContext("2d");

  particles = Array.from({length: 40}, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 1,
    dx: (Math.random() - 0.5) * 0.6,
    dy: (Math.random() - 0.5) * 0.6
  }));

  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x<0||p.x>canvas.width) p.dx*=-1;
      if (p.y<0||p.y>canvas.height) p.dy*=-1;
    });
    animId = requestAnimationFrame(draw);
  }
  draw();
}
function stopParticles() {
  cancelAnimationFrame(animId);
}
