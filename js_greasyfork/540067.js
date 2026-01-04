// ==UserScript==
(() => {
  const width = 160;
  const height = 90;// ==UserScript==
// @name         Discord DVD Cam Toggle
// @namespace    https://greasyfork.org/users/yourusername
// @version      1.0
// @description  Adds a button on your discord bar thing that if you are in vc turns on, then enable your camera and it will replace it with a dvd thing!!!
// @author       Your Name
// @match        https://discord.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/540067/Discord%20DVD%20Cam%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/540067/Discord%20DVD%20Cam%20Toggle.meta.js
// ==/UserScript==

(() => {
  const width = 160;
  const height = 90;

  // Create canvas and context
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.style.display = "none";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  // DVD logo properties (smaller size)
  const logoWidth = 48;
  const logoHeight = 24;
  let x = Math.random() * (width - logoWidth);
  let y = Math.random() * (height - logoHeight);
  let dx = 1.8; // constant speed
  let dy = 1.8;
  let hue = 0;

  // Draw DVD logo rectangle with color cycling and flipped text
  function drawLogo() {
    ctx.save();

    // Draw rectangle
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.fillRect(x, y, logoWidth, logoHeight);

    // Flip horizontally for text inside rectangle
    ctx.translate(x + logoWidth / 2, y + logoHeight / 2);
    ctx.scale(-1, 1); // flip horizontally
    ctx.font = "16px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("DVD", 0, 0);

    ctx.restore();
  }

  // Animation loop with constant speed
  let animationId = null;
  function animate() {
    ctx.clearRect(0, 0, width, height);

    drawLogo();

    x += dx;
    y += dy;

    if (x <= 0 || x + logoWidth >= width) {
      dx = -dx;
      hue = (hue + 60) % 360; // Change color on bounce
    }
    if (y <= 0 || y + logoHeight >= height) {
      dy = -dy;
      hue = (hue + 60) % 360;
    }

    animationId = requestAnimationFrame(animate);
  }

  function startAnimation() {
    if (!animationId) animate();
  }
  function stopAnimation() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  // Capture canvas as webcam stream
  const fakeStream = canvas.captureStream(30);

  // Save original getUserMedia once
  if (!window._originalGetUserMedia) {
    window._originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
  }

  // Override getUserMedia to provide fake webcam
  navigator.mediaDevices.getUserMedia = function(constraints) {
    if (constraints && constraints.video) {
      return Promise.resolve(fakeStream);
    }
    return window._originalGetUserMedia(constraints);
  };

  // Wait for the Discord UI to load mic button container
  function waitForContainer(maxRetries = 20) {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const interval = setInterval(() => {
        const container = document.querySelector(".micButtonParent__37e49");
        if (container) {
          clearInterval(interval);
          resolve(container);
        } else if (++attempts >= maxRetries) {
          clearInterval(interval);
          reject(new Error("Mic button container not found."));
        }
      }, 500);
    });
  }

  waitForContainer().then(container => {
    // Create toggle button
    const btn = document.createElement("button");
    btn.setAttribute("aria-label", "Toggle DVD Cam");
    btn.title = "Toggle DVD Cam";
    btn.style.all = "unset";
    btn.style.width = "40px";
    btn.style.height = "40px";
    btn.style.marginLeft = "8px";
    btn.style.borderRadius = "50%";
    btn.style.display = "flex";
    btn.style.alignItems = "center";
    btn.style.justifyContent = "center";
    btn.style.cursor = "pointer";
    btn.style.userSelect = "none";
    btn.style.backgroundColor = "#5865F2";
    btn.style.position = "relative";

    // SVG icon
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "20");
    svg.setAttribute("height", "20");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "white");
    svg.innerHTML = `<path d="M17 10.5V6c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-4.5l4 4v-11l-4 4z"/>`;
    btn.appendChild(svg);

    let active = false;
    const camOnLabel = "Turn Off Camera";
    const camOffLabel = "Turn On Camera";

    btn.onclick = () => {
      active = !active;
      if (active) {
        btn.style.backgroundColor = "#4f545c";
        startAnimation();

        const camToggle = Array.from(document.querySelectorAll("button")).find(
          (b) => b.getAttribute("aria-label") === camOffLabel
        );
        if (camToggle && camToggle.getAttribute("aria-pressed") === "false") camToggle.click();
      } else {
        btn.style.backgroundColor = "#5865F2";
        stopAnimation();

        const camToggle = Array.from(document.querySelectorAll("button")).find(
          (b) => b.getAttribute("aria-label") === camOnLabel
        );
        if (camToggle && camToggle.getAttribute("aria-pressed") === "true") camToggle.click();
      }
    };

    container.appendChild(btn);
    console.log("DVD Cam toggle button added!");
  }).catch(err => {
    alert(err.message);
  });
})();


  // Create canvas and context
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.style.display = "none";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  // DVD logo properties (smaller size)
  const logoWidth = 48;
  const logoHeight = 24;
  let x = Math.random() * (width - logoWidth);
  let y = Math.random() * (height - logoHeight);
  let dx = 1.8; // constant speed
  let dy = 1.8;
  let hue = 0;

  // Draw DVD logo rectangle with color cycling and flipped text
  function drawLogo() {
    ctx.save();

    // Draw rectangle
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.fillRect(x, y, logoWidth, logoHeight);

    // Flip horizontally for text inside rectangle
    ctx.translate(x + logoWidth / 2, y + logoHeight / 2);
    ctx.scale(-1, 1); // flip horizontally
    ctx.font = "16px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("DVD", 0, 0);

    ctx.restore();
  }

  // Animation loop with constant speed
  let animationId = null;
  function animate() {
    ctx.clearRect(0, 0, width, height);

    drawLogo();

    x += dx;
    y += dy;

    if (x <= 0 || x + logoWidth >= width) {
      dx = -dx;
      hue = (hue + 60) % 360; // Change color on bounce
    }
    if (y <= 0 || y + logoHeight >= height) {
      dy = -dy;
      hue = (hue + 60) % 360;
    }

    animationId = requestAnimationFrame(animate);
  }

  function startAnimation() {
    if (!animationId) animate();
  }
  function stopAnimation() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  // Capture canvas as webcam stream
  const fakeStream = canvas.captureStream(30);

  // Save original getUserMedia once
  if (!window._originalGetUserMedia) {
    window._originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
  }

  // Override getUserMedia to provide fake webcam
  navigator.mediaDevices.getUserMedia = function(constraints) {
    if (constraints && constraints.video) {
      return Promise.resolve(fakeStream);
    }
    return window._originalGetUserMedia(constraints);
  };

  // Find Discord mic button container
  const container = document.querySelector(".micButtonParent__37e49");
  if (!container) {
    alert("Join a voice channel first!");
    return;
  }

  // Create toggle button
  const btn = document.createElement("button");
  btn.setAttribute("aria-label", "Toggle DVD Cam");
  btn.title = "Toggle DVD Cam";
  btn.style.all = "unset";
  btn.style.width = "40px";
  btn.style.height = "40px";
  btn.style.marginLeft = "8px";
  btn.style.borderRadius = "50%";
  btn.style.display = "flex";
  btn.style.alignItems = "center";
  btn.style.justifyContent = "center";
  btn.style.cursor = "pointer";
  btn.style.userSelect = "none";
  btn.style.backgroundColor = "#5865F2";
  btn.style.position = "relative";

  // SVG icon
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "20");
  svg.setAttribute("height", "20");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "white");
  svg.innerHTML = `<path d="M17 10.5V6c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-4.5l4 4v-11l-4 4z"/>`;
  btn.appendChild(svg);

  let active = false;
  const camOnLabel = "Turn Off Camera";
  const camOffLabel = "Turn On Camera";

  btn.onclick = () => {
    active = !active;
    if (active) {
      btn.style.backgroundColor = "#4f545c";
      startAnimation();

      const camToggle = Array.from(document.querySelectorAll("button")).find(
        (b) => b.getAttribute("aria-label") === camOffLabel
      );
      if (camToggle && camToggle.getAttribute("aria-pressed") === "false") camToggle.click();
    } else {
      btn.style.backgroundColor = "#5865F2";
      stopAnimation();

      const camToggle = Array.from(document.querySelectorAll("button")).find(
        (b) => b.getAttribute("aria-label") === camOnLabel
      );
      if (camToggle && camToggle.getAttribute("aria-pressed") === "true") camToggle.click();
    }
  };

  container.appendChild(btn);

  console.log("DVD Cam toggle button updated — smaller, flipped text, smooth speed!");
})();
