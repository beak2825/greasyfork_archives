

// ==UserScript==
// @license MIT
// @name         Scroll Page Progress
// @namespace    http://tampermonkey.net/
// @version      1.8.3
// @description  Visual indicator of page progress while scrolling
// @author       You
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502780/Scroll%20Page%20Progress.user.js
// @updateURL https://update.greasyfork.org/scripts/502780/Scroll%20Page%20Progress.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const currentState = {
    deg: 0,
    progress: 0,
    zIndex: 0,
    movementIntervalId: null
  }
  let globalShadow
  let progressBar
  const createDiv = () => document.createElement('div')

  function insertCirculaProgressBarEl() {
    const shadowHost = createDiv()
    shadowHost.id = 'host-shwadow-circular-progress'
    const shadow = shadowHost.attachShadow({ mode: "closed" });
    globalShadow = shadow

    const circularProgressBar = createDiv()
    progressBar = circularProgressBar
    const contentWrapper = createDiv()
    const closeOverlay = createDiv()
    const title = createDiv()
    const overlay = createDiv()
    const leftSide = createDiv()
    const rightSide = createDiv()

    circularProgressBar.classList.add('circular-progress-bar')
    title.classList.add('title');
    closeOverlay.classList.add('close-overlay');
    contentWrapper.classList.add('content-wrapper')
    overlay.classList.add('overlay');
    leftSide.classList.add('left-side');
    rightSide.classList.add('right-side');

    title.innerText = '-%'

    // this is the only way to create a trusted HTML element
    if (window.trustedTypes) {
      closeOverlay.innerHTML = window.trustedTypes.defaultPolicy.createHTML('&times;')
    } else {
      closeOverlay.innerHTML = '&times;'
    }

    closeOverlay.addEventListener('click', function () {
      //circularProgressBar.style.display = 'none'
      const screenWidth = window.innerWidth;
      const elementoWidth = circularProgressBar.offsetWidth;

      // Calcular la nueva posición
      const newPosition = screenWidth - elementoWidth / 2;

      // Aplicar la nueva posición
      circularProgressBar.style.left = `${newPosition}px`;
      const topPosition = circularProgressBar.style.top

      const path = window.location.pathname;
      let savedPaths = JSON.parse(localStorage.getItem('not-allowed-paths')) || [];

      const existingEntryIndex = savedPaths.findIndex(entry => entry.path === path);

      const newEntry = {
        path: path,
        left: newPosition,
        top: topPosition || '0px' // Si el top no está definido, usa '0px' como valor por defecto
      };

      if (existingEntryIndex !== -1) {
        // Si ya existe una entrada para la ruta, actualiza la posición
        savedPaths[existingEntryIndex] = newEntry;
      } else {
        // Si no existe, añade la nueva entrada
        savedPaths.push(newEntry);
      }
      console.log("savedPaths", savedPaths)
      // Guardar el array actualizado en localStorage
      localStorage.setItem('not-allowed-paths', JSON.stringify(savedPaths));
    });

    ;[title, overlay, leftSide, rightSide].forEach(childEl => contentWrapper.appendChild(childEl))
    circularProgressBar.appendChild(closeOverlay)
    circularProgressBar.appendChild(contentWrapper)
    shadow.appendChild(circularProgressBar)
    document.body.appendChild(shadowHost)
  }

  function addCSS() {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
              * {
              box-sizing: border-box;
              padding: 0;
              margin: 0;
            }
            .circular-progress-bar {
              --backgroundColor: #424242;
              --left-side-angle: 180deg;
              --barColor:orangered;
              width: 60px;
              height: 60px;
              color: #fff;
              border-radius: 50%;
              position: fixed;
              z-index: 2147483646;
              background: var(--backgroundColor);
              border: 5px solid white;
              box-shadow:
                    0 1px 1px hsl(0deg 0% 0% / 0.075),
                    0 2px 2px hsl(0deg 0% 0% / 0.075),
                    0 4px 4px hsl(0deg 0% 0% / 0.075),
                    0 8px 8px hsl(0deg 0% 0% / 0.075),
                    0 16px 16px hsl(0deg 0% 0% / 0.075);
              text-align: center;
              cursor: pointer;
              transition: opacity 0.2s ease;
            }
            
            
            .circular-progress-bar .overlay {
              width: 50%;
              height: 100%;
              position: absolute;
              top: 0;
              left: 0;
              background-color: var(--backgroundColor);
              transform-origin: right;
              transform: rotate(var(--overlay));
            }
            .close-overlay {
                width: 20px;
                height: 20px;
                position: absolute;
                left: 100%;
                top: -30%;
                z-index: 2147483647;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 50%;
                background: orangered;
                font-size: 19px;
                text-align: center;
                opacity: 0;
            }
            .close-overlay:hover {
                font-weight: bold;
            }
     
            .content-wrapper {
                overflow: hidden;
                height: 100%;
                width: 100%;
                border-radius: 50%;
                position: relative;
            }
            
            .circular-progress-bar:hover .close-overlay {
            		opacity:1;
            }
            
            .circular-progress-bar .title {
              font-size: 15px;
              font-weight: bold;
              position:relative;
              height: 100%;
              display:flex;
              justify-content:center;
              align-items: center;
              z-index: 100;
            }
     
            .circular-progress-bar .left-side,
            .circular-progress-bar .right-side {
              width: 50%;
              height: 100%;
              position: absolute;
              top: 0;
              left: 0;
              border: 5px solid var(--barColor);
              border-radius: 100px 0px 0px 100px;
              border-right: 0;
              transform-origin: right;
            }
            .circular-progress-bar .left-side {
              transform: rotate(var(--left-side-angle));
            }
            .circular-progress-bar .right-side {
              transform: rotate(var(--right-side-angle));
            }
      `
    globalShadow.appendChild(styleSheet)
  }

  function setAngle(deg) {
    const progressBar = globalShadow.querySelector('.circular-progress-bar')
    const leftSide = globalShadow.querySelector('.left-side')
    const rightSide = globalShadow.querySelector('.right-side')
    const overlay = globalShadow.querySelector('.circular-progress-bar .overlay')

    const zIndex = deg > 180 ? 100 : 0
    const rightSideAngle = deg < 180 ? deg : 180
    const leftSideAngle = deg
    const overlayAngle = deg < 180 ? 0 : deg - 180
    const zIndexChangedToPositive = currentState.zIndex === 0 && zIndex === 100
    if (deg > 180) {
      rightSide.style.zIndex = 2
      leftSide.style.zIndex = 0
      overlay.style.zIndex = 1
    } else {
      rightSide.style.zIndex = 1
      leftSide.style.zIndex = 0
      overlay.style.zIndex = 2
    }
    progressBar.style.setProperty('--overlay', `${overlayAngle}deg`);
    progressBar.style.setProperty('--right-side-angle', `${rightSideAngle}deg`);
    progressBar.style.setProperty('--left-side-angle', `${leftSideAngle}deg`);

  }

  function smoothProgressBar(targetProgress, duration) {

    if (currentState.movementIntervalId) {
      clearInterval(currentState.movementIntervalId);
    }
    let currentProgress = currentState.deg
    const increment = (targetProgress - currentProgress) / (duration / 10);

    currentState.movementIntervalId = setInterval(function () {
      currentProgress += increment;

      if ((increment > 0 && currentProgress >= targetProgress) || (increment < 0 && currentProgress <= targetProgress)) {
        currentProgress = targetProgress;
        clearInterval(currentState.movementIntervalId);
      }

      setAngle(currentProgress)
    }, 10);
  }

  function percentageToAngle(percentageNumber) {
    if (percentageNumber > 100) {
      return 360
    }
    if (percentageNumber < 0) {
      return 0
    }
    return (360 * percentageNumber) / 100
  }

  function setPercentage(percentageNumber) {
    const angle = percentageToAngle(percentageNumber)
    smoothProgressBar(angle, 400)
  }

  function debounce(callback, wait) {
    let timerId;
    return (...args) => {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        callback(...args);
      }, wait);
    };
  }

  function setEventListeners() {
      let offsetX = 0, offsetY = 0, isDragging = false;

      progressBar.addEventListener("mousedown", (e) => {
        e.preventDefault()
        offsetX = e.clientX - progressBar.offsetLeft;
        offsetY = e.clientY - progressBar.offsetTop;
        isDragging = true;
        progressBar.style.cursor = "grabbing";
        progressBar.style.opacity = "0.3";
      });

      document.addEventListener("mousemove", (e) => {
        if (isDragging) {
          e.preventDefault();
          const left = e.clientX - offsetX;
          const top = e.clientY - offsetY;
          progressBar.style.left = `${left}px`;
          progressBar.style.top = `${top}px`;
          savePosition(left, top); // Guardar la posición cada vez que se mueve
        }
      });

      document.addEventListener("mouseup", () => {
        isDragging = false;
        progressBar.style.cursor = "grab";
        progressBar.style.opacity = "1";
      });
  }

  function savePosition(left, top) {
    const position = { left, top };
    localStorage.setItem("elementPosition", JSON.stringify(position));
  }

  function loadPosition() {
    const currentPath = window.location.pathname;
    const savedPaths = JSON.parse(localStorage.getItem('not-allowed-paths')) || [];

    const entry = savedPaths.find(entry => entry.path === currentPath);

    if (entry) {
      console.log('exist entry')
      // Si existe una entrada para la ruta, aplica las posiciones guardadas
      progressBar.style.left = `${entry.left}px`;
      progressBar.style.top = `${entry.top}`;
      return;
    }
    const savedPosition = localStorage.getItem("elementPosition");
    if (savedPosition) {
      const { left, top } = JSON.parse(savedPosition);
      progressBar.style.left = `${left}px`;
      progressBar.style.top = `${top}px`;
    } else {
      progressBar.style.right = `10px`;
      progressBar.style.top = `10px`;
    }
  }

  function getCurrentScrollProgress() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (winScroll / height) * 100;
    return Math.trunc(progress);
  }

  function watchScroll() {
    const progressBarTitle = globalShadow.querySelector('.title')
    document.addEventListener('scroll', debounce(() => {
      setPercentage(getCurrentScrollProgress())
      progressBarTitle.innerText = getCurrentScrollProgress() + '%'
      currentState.progress = getCurrentScrollProgress()
      currentState.deg = percentageToAngle(getCurrentScrollProgress())
    }, 50))
  }


  document.onreadystatechange = function () {
    if (document.readyState == "complete") {
      if (window.trustedTypes && window.trustedTypes.createPolicy && !window.trustedTypes.defaultPolicy) {
        window.trustedTypes.createPolicy('default', {
          createHTML: (string, sink) => string
        });
      }

      insertCirculaProgressBarEl()
      setEventListeners()
      addCSS()
      loadPosition()
      watchScroll()
    }
  }


})();

