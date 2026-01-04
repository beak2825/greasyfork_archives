// ==UserScript==
// @name         FPS unlocker
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Mope.io fps unlocker
// @author       Jerry || Discord: w5b
// @match        https://mope.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mope.io
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/507864/FPS%20unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/507864/FPS%20unlocker.meta.js
// ==/UserScript==

const jerryPack = () => {
  let jerryData;
  loadStorage();
  checkForUpdate();
  const offsets = {
    fpsLimiter: jerryData.fpsLimit || "_0x39d3c4",
  };
  function checkForUpdate() {
    if (!jerryData.gameVersion || jerryData.gameVersion < $config.gameVersion) {
      jerryData.gameVersion = $config.gameVersion;

      fetch("https://mope.io/client.js")
        .then((res) => res.text())
        .then((text) => {
          const fpsLimitRegex = /requestAnimationFrame\(([^)]+)\)/;
          var fpsLimitOffset = text.match(fpsLimitRegex);
          if (fpsLimitOffset) {
            jerryData.fpsLimit = fpsLimitOffset[1];
          } else {
            console.dir("Regex match not found in the fetched content.");
          }
        })
        .catch((error) => {
          console.dir("Error fetching the client.js:", error);
        });
    }
  }

  function loadStorage() {
    try {
      jerryData = JSON.parse(localStorage.jerryDATA);
    } catch (error) {
      jerryData = {};
    }
  }

  function replaceAllFunctions() {
    unsafeWindow[offsets.fpsLimiter] = newFpsLimit;
  }

  let frameCount = 0,
    lastFrameTime = null,
    averageFPS = 0;

  function updateFPS(currentTime) {
    frameCount += 1;

    if (currentTime - lastFrameTime > 1000) {
      lastFrameTime = currentTime;
      averageFPS = frameCount;
      frameCount = 0;

      $bus["emit"]($bus["EVENTS"]["UI_SET_FPS"], averageFPS);
    }
  }

  let lastTime = 0;
  let targetFPS = jerryData.jerryFPS || 60;
  let timePerFrame = 1000 / targetFPS;

  function newFpsLimit(timestamp) {
    const elapsedTime = timestamp - lastTime;
    if (elapsedTime < timePerFrame) {
      requestAnimationFrame(unsafeWindow[offsets.fpsLimiter]);
      return;
    }
    updateFPS(timestamp);
    lastTime = timestamp;
    lastFrameTime === null && (lastFrameTime = timestamp);
    _0x2bcf6c(timestamp);
    requestAnimationFrame(newFpsLimit);
  }

  function handleFpsSlider() {
    const fpsSlider = document.getElementById("slider-fps");
    const sliderValue = document.getElementById("sliderValue");
    fpsSlider.value = jerryData.jerryFPS;
    sliderValue.innerHTML = fpsSlider.value;
    fpsSlider.addEventListener("input", function () {
      sliderValue.innerHTML = this.value;
      targetFPS = this.value;
      timePerFrame = 1000 / targetFPS;
    });
  }

  window.onbeforeunload = function () {
    const fpsSlider = document.getElementById("slider-fps");
    jerryData.jerryFPS = fpsSlider.value;
    localStorage.jerryDATA = JSON.stringify(jerryData);
  };

  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "p":
        const mainContainer = document.getElementById("main-container");
        const currentDisplay = mainContainer.style.display;
        currentDisplay == "none"
          ? (mainContainer.style.display = "flex")
          : (mainContainer.style.display = "none");
        break;
    }
  });

  replaceAllFunctions();

  function injectHTML() {
    const htmlCode = `
      <!-- Paste your HTML code here -->
      <div id="main-container">
        <h1>FPS Unlocker</h1>
        <div class="slider-container">
          <input type="range" min="10" max="360" value="60" class="slider" id="slider-fps">
          <div id="slider-header-container">
          <p id="header-fps">FPS:  </p>
          <span contenteditable id="sliderValue">60</span>
          </div>
        </div>
        <div id="credits-container">
        <button id="credits-button">Join Discord</button>
        </div>
        </div>
    `;

    const div = document.createElement("div");
    div.innerHTML = htmlCode;

    document.body.appendChild(div);

    const sliderValue = document.getElementById("sliderValue");

    sliderValue.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        this.blur();
        event.preventDefault();
      }
    });

    sliderValue.addEventListener("blur", function () {
      let newValue = parseInt(this.textContent);

      if (!isNaN(newValue)) {
        const fpsSlider = document.getElementById("slider-fps");

        newValue = Math.min(
          Math.max(newValue, parseInt(fpsSlider.min)),
          parseInt(fpsSlider.max)
        );

        this.textContent = newValue;
        fpsSlider.value = newValue;
      }
    });

    const mainContainer = document.getElementById("main-container");
    makeDraggable(mainContainer);

    document.getElementById("credits-button").addEventListener("click", function() {
      window.open("https://discord.gg/NSyHaFG8Uv", "_blank");
    });
  }

  function makeDraggable(element) {
    let offsetX, offsetY;
    let isDragging = false;

    element.addEventListener("mousedown", function (e) {
      const rect = element.getBoundingClientRect();
      const mainContainer = document.getElementById("main-container");

      if (e.target == mainContainer) {
        e.preventDefault();
        isDragging = true;

        function moveElement(e) {
          if (!isDragging) return;
          element.style.position = "absolute";
          element.style.left = e.clientX + "px";
          element.style.top = e.clientY + "px";
        }

        function stopDragging() {
          isDragging = false;
          document.removeEventListener("mousemove", moveElement);
          document.removeEventListener("mouseup", stopDragging);
        }

        document.addEventListener("mousemove", moveElement);
        document.addEventListener("mouseup", stopDragging);
      }
    });
  }

  function injectCSS() {
    const style = document.createElement("style");
    style.textContent = `
      h1 {
        color: white;
        margin: 20px;
        text-shadow: 1px 1px 1px black;
        font-family: sans-serif
      }

      #main-container {
        background-color: rgba(0, 0, 0, 0.7);
        border-radius: 2%;
        width: 23vw;
        height: 20vh;
        position: absolute;
        top: 20%;
        left: 80%;
        transform: translate(-50%, -50%);
        display: flex;
        align-items: center;
        flex-direction: column;
        z-index: 999
      }

      .slider-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        align-items: center;
      }

      #main-container p,span {
        color: white;
        font-weight: bold;
        text-shadow: 1px 1px 1px black;
        font-family: sans-serif
      }

      .slider {
        width: 70%;
        background-color: rgba(0, 0, 0, 0.2);
        height: 50%;
        -webkit-appearance: none;
        appearance: none;
        border-radius: 16px;
        overflow: hidden;
        border-radius: 16px;
      }

      .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 25px;
        height: 25px;
        background-color: #fff;
        border-radius: 50%;
        box-shadow: -407px 0 0 400px black;
        transition: 0.2s ease-in-out;
      }

      .slider::-moz-range-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 25px;
        height: 25px;
        background-color: #fff;
        border-radius: 50%;
        box-shadow: -407px 0 0 400px black;
        transition: 0.2s ease-in-out;
      }

      #slider-header-container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items:center;
      }

      #sliderValue {
        margin: 5px;
      }

      #credits-container {
        display: flex;
        position: absolute;
        justify-content: flex-end;
        align-items: center;
        right: 10px;
        width: 100%;
        height: 30px;
        bottom: 10px;
        }
        #credits-button {
          text-decoration: none;
          color: white;
          padding: 5px;
          background-color: transparent;
          border-radius: 5px;
          border: none;
          font-weight: bolder;
          font-family: sans-serif;
          cursor: pointer;
          font-size: 15px;
          text-shadow: 1px 1px 1px black;
          }

          #credits-button:hover {
            font-size: 16px;
            transition: font-size 0.1s ease-out
          }
    `;
    document.head.appendChild(style);
  }

  injectHTML();
  injectCSS();
  handleFpsSlider();
};
const initInterval = setInterval(() => {
  if (document.querySelector("head > script:nth-child(55)")) {
    clearInterval(initInterval);
    jerryPack();
  }
}, 100);
