// ==UserScript==
// @name         (NOT WORKING, PENDING UPDATE) JanitorAI - Dynamic Character Avatars
// @namespace    http://tampermonkey.net/
// @version      1.7
// @license      MIT
// @author       Zephyr (@xzeph__)
// @description  Logs the last bot message and shows an emotion-based avatar. Completly customizable.
// @match        https://janitorai.com/chats/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=janitorai.com
// @grant        GM_log
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      generativelanguage.googleapis.com
// @downloadURL https://update.greasyfork.org/scripts/542834/%28NOT%20WORKING%2C%20PENDING%20UPDATE%29%20JanitorAI%20-%20Dynamic%20Character%20Avatars.user.js
// @updateURL https://update.greasyfork.org/scripts/542834/%28NOT%20WORKING%2C%20PENDING%20UPDATE%29%20JanitorAI%20-%20Dynamic%20Character%20Avatars.meta.js
// ==/UserScript==

/* ｡･ﾟﾟ･｡ ｡･ﾟﾟ･｡ ｡･ﾟﾟ･｡ ｡･ﾟﾟ･｡ ｡･ﾟﾟ･｡ ｡･ﾟﾟ･｡ ｡･ﾟﾟ･｡ ｡･ﾟﾟ･｡ ｡･ﾟﾟ･｡ ｡･ﾟﾟ･｡ ｡･ﾟﾟ･｡ ｡･ﾟﾟ･｡ ｡･ﾟﾟ･｡ ｡･ﾟﾟ･｡ ｡･ﾟﾟ･｡ ｡･ﾟﾟ･｡ ｡･ﾟﾟ･｡
 *                                                                                   *
 *                    JanitorAI - Dynamic Character Avatars Script                   *
 *                                                                                   *
 *   This script adds dynamic, emotion-based avatars to JanitorAI chats!             *
 *   It analyzes the bot's last message and shows a cute avatar matching             *
 *   the detected emotion.                                                           *
 *                                                                                   *
 *      HOW TO CUSTOMIZE                                                             *
 *   ─────────────────────                                                           *
 *   • SECTION 1: Change/add/remove your character avatars and emotion images.       *
 *   • SECTION 2: Set your Gemini API key and model.                                 *
 *   • SECTION 5: Edit the prompt sent to Gemini for emotion analysis.               *
 *     (Make sure the emotion list here matches your avatars in Section 1!)          *
 *                                                                                   *
 *   All other sections are core logic and style.                                    *
 *   For best results, only edit Sections 1, 2, and 5!                               *
 *                                                                                   *
 *                                                                                   *
 * ｡･ﾟﾟ･｡ ｡･ﾟﾟ･｡ ｡･ﾟﾟ･｡ ｡･ﾟﾟ･｡ ｡･ﾟﾟ･｡ ｡･ﾟﾟ･｡ ｡･ﾟﾟ･｡ ｡･ﾟﾟ･｡ ｡･ﾟﾟ･｡ ｡･ﾟﾟ･｡ ｡･ﾟﾟ･｡ ｡･ﾟﾟ･｡ ｡･ﾟﾟ･｡ ｡･ﾟﾟ･｡ ｡･ﾟﾟ･｡ ｡･ﾟﾟ･｡ ｡･ﾟﾟ･｡
*/

(function () {
  "use strict";

  /*
  *・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.:*・*
  *                                                                           *
  *                  SECTION 1: AVATAR CONFIGURATION                          *
  *           (Customize your character emotion avatars here!)                *
  *                                                                           *
  *・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.:*・*
  */

  // 🖼️ --- Character Emotion Avatars --- 🖼️
  const characterEmotionAvatars = {
    Ashley: {
      1: "https://i.ibb.co/BHNGbwC2/proud.webp", // Admiration
      2: "https://i.ibb.co/XZFRjgWX/amusement.webp", // Amusement
      3: "https://i.ibb.co/qYQvPc7g/yelling-insulting-angry-alittlelessintense-arguingagressive.webp", // Anger
      4: "https://i.ibb.co/mV297s2V/irritated-annoyed.webp", // Annoyance
      5: "https://i.ibb.co/tpRmY6Nj/chatty-hasalittlesmilewhiletalking.webp", // Approval
      6: "https://i.ibb.co/tMztWz5L/gentle.webp", // Caring
      7: "https://i.ibb.co/39YzgMdV/embarrassment.webp", // Confusion
      8: "https://files.catbox.moe/m99dz8.png", // Curiosity
      9: "https://i.ibb.co/4gMkVBmb/teasing-mockingaffection.webp", // Desire
      10: "https://i.ibb.co/mV297s2V/irritated-annoyed.webp", // Dissapointment
      11: "https://i.ibb.co/j981cRP2/exasperation.webp", // Disapproval
      12: "https://i.ibb.co/HTZgC02b/disgusted.webp", // Disgust
      13: "https://i.ibb.co/39YzgMdV/embarrassment.webp", // Embarrassment
      14: "https://i.ibb.co/6J8WYw9T/excited.webp", // Excitement
      15: "https://i.ibb.co/FL2HgSRY/terrified.webp", // Fear
      16: "https://i.ibb.co/tpRmY6Nj/chatty-hasalittlesmilewhiletalking.webp", // Gratitude
      17: "https://i.ibb.co/Xx94PTxr/smiling.webp", // Joy
      18: "https://i.ibb.co/tMztWz5L/gentle.webp", // Love
      19: "https://i.ibb.co/YFtm7tvZ/nervouslaugh.webp", // Nervousness
      20: "https://i.ibb.co/DDSmJHRC/bored-dismissive.webp", // Neutral
      21: "https://i.ibb.co/6J8WYw9T/excited.webp", // Optimism
      22: "https://i.ibb.co/BHNGbwC2/proud.webp", // Pride
      23: "https://i.ibb.co/N6VxqxVy/surprised-confused.webp", // Realization
      24: "https://i.ibb.co/k27tvrfK/resignation.webp", // Relief
      25: "https://i.ibb.co/JR6S8LNC/weak-unwell-depressed.webp", // Remorse
      26: "https://i.ibb.co/tPcnCf41/sad.webp", // Sadness
      27: "https://i.ibb.co/NghfF9vc/greatlysurprised-revelation.webp", // Surprise
    },

    // Add other characters and emotions here if needed. The default character is Ashley
  };

  /*
  *・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.:*・*
  *                                                                           *
  *                  SECTION 2: GEMINI API CONFIGURATION                      *
  *           (Set up your Gemini API key and model here!)                    *
  *                                                                           *
  *・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.:*・*
  */

  // 🔑 --- API Key & Model --- 🔑
  const apiKey = "YOUR_OWN_API_KEY"; // Replace with your actual API key
  const model = "gemini-2.0-flash";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  /*
  *・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.:*・*
  *                                                                           *
  *                  SECTION 3: AVATAR STYLES & FUNCTIONS                     *
  *           (Handles avatar CSS, creation, and interaction!)                *
  *                                                                           *
  *   ⚠️ WARNING: Do not modify the rest of the code unless you know what      *
  *   you're doing! This section and below contains core logic and utilities.  *
  *   To customize how emotions are detected, go to SECTION 5!                *
  *                                                                           *
  *・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.:*・*
  */

  // 🎨 --- Avatar CSS Styles --- 🎨
  GM_addStyle(`
    .emotion-avatar-item {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center; /* Center children horizontally */
      margin-bottom: 5px;
    }
    img.emotion-avatar-float {
      transition: opacity 0.3s ease;
      cursor: move;
      width: 100px;
      height: auto;
      margin-bottom: 8px;
      display: block;
    }
    .emotion-avatar-controls {
      position: absolute;
      top: 0;
      right: -50px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      opacity: 0;
      z-index: 10;
      transition: opacity 0.3s ease;
    }
    .emotion-avatar-controls button {
      border-radius: 50%;
      background: linear-gradient(to bottom,
        rgba(176, 196, 222, 0.8),
        rgba(255, 255, 255, 0.5));
      color: rgba(255, 255, 255, 0.9) !important;
      box-shadow: 0 0 5px rgba(176, 196, 222, 0.8);
      transition: box-shadow 0.3s ease-in-out;
      border: none;
      width: 40px;
      height: 40px;
      padding: 0;
      margin: 2px 0;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .emotion-avatar-controls button:hover {
      box-shadow: 0 0 10px rgba(176, 196, 222, 1);
    }
    .emotion-avatar-slider-fade {
      opacity: 0;
      transition: opacity 0.3s ease;
      width: 100%;
      margin-top: 0;
      margin-bottom: 4px;
      left: 0;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    /* --- GLASSY SLIDER THEME --- */
    .size-slider {
      -webkit-appearance: none;
      appearance: none;
      width: 100px;
      height: 8px;
      border-radius: 8px;
      background: linear-gradient(90deg, rgba(176,196,222,0.7) 0%, rgba(255,255,255,0.5) 100%);
      box-shadow: 0 2px 8px 0 rgba(176,196,222,0.25), 0 1.5px 0px 0px rgba(255,255,255,0.25) inset;
      outline: none;
      opacity: 0.95;
      transition: box-shadow 0.2s;
      cursor: pointer;
      border: 1px solid rgba(176,196,222,0.3);
      backdrop-filter: blur(2px);
      display: block;
      margin-top: 3px;
      margin-left: auto;
      margin-right: auto;
    }
    .size-slider:focus {
      box-shadow: 0 0 0 2px rgba(176,196,222,0.5);
    }
    .size-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(255,255,255,0.85) 60%, rgba(176,196,222,0.7) 100%);
      box-shadow: 0 0 8px 2px rgba(176,196,222,0.7), 0 2px 6px 0 rgba(176,196,222,0.3);
      border: 2px solid rgba(255,255,255,0.7);
      cursor: pointer;
      transition: box-shadow 0.2s;
      filter: drop-shadow(0 0 4px rgba(176,196,222,0.5));
    }
    .size-slider:active::-webkit-slider-thumb {
      box-shadow: 0 0 12px 4px rgba(176,196,222,0.9);
    }
    .size-slider::-moz-range-thumb {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(255,255,255,0.85) 60%, rgba(176,196,222,0.7) 100%);
      box-shadow: 0 0 8px 2px rgba(176,196,222,0.7), 0 2px 6px 0 rgba(176,196,222,0.3);
      border: 2px solid rgba(255,255,255,0.7);
      cursor: pointer;
      transition: box-shadow 0.2s;
      filter: drop-shadow(0 0 4px rgba(176,196,222,0.5));
    }
    .size-slider:active::-moz-range-thumb {
      box-shadow: 0 0 12px 4px rgba(176,196,222,0.9);
    }
    .size-slider::-ms-thumb {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(255,255,255,0.85) 60%, rgba(176,196,222,0.7) 100%);
      box-shadow: 0 0 8px 2px rgba(176,196,222,0.7), 0 2px 6px 0 rgba(176,196,222,0.3);
      border: 2px solid rgba(255,255,255,0.7);
      cursor: pointer;
      transition: box-shadow 0.2s;
      filter: drop-shadow(0 0 4px rgba(176,196,222,0.5));
    }
    .size-slider:active::-ms-thumb {
      box-shadow: 0 0 12px 4px rgba(176,196,222,0.9);
    }
    .size-slider::-ms-fill-lower {
      background: transparent;
    }
    .size-slider::-ms-fill-upper {
      background: transparent;
    }
    .size-slider:focus {
      outline: none;
    }
    .size-slider::-webkit-slider-runnable-track {
      height: 8px;
      border-radius: 8px;
      background: transparent;
    }
    .size-slider::-moz-range-track {
      height: 8px;
      border-radius: 8px;
      background: transparent;
    }
    .size-slider::-ms-fill-lower,
    .size-slider::-ms-fill-upper {
      background: transparent;
    }
    .slider-value-popup {
      position: absolute;
      bottom: 15px;
      left: 50%;
      transform: translateX(-50%);
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 2px 5px;
      border-radius: 3px;
      font-size: 12px;
      white-space: nowrap;
      display: none;
    }
  `);

  let botAvatars = {};
  let botCount = 0;
  let scriptDisabled = false;

  // 🧩 --- Avatar & Gemini Functions --- 🧩
  function addEmotionAvatar(emotionNumber, characterName) {
    if (scriptDisabled) return;
    if (!botAvatars[characterName]) {
      const avatarItem = document.createElement("div");
      avatarItem.classList.add("emotion-avatar-item");
      avatarItem.style.position = "fixed";
      avatarItem.style.top = `${50 + botCount * 20}px`;
      avatarItem.style.left = `${20 + botCount * 20}px`;
      avatarItem.style.zIndex = 1000 + botCount;

      const avatar = document.createElement("img");
      avatar.classList.add("emotion-avatar-float");
      avatar.style.opacity = "1";

      // Limit avatar size after image loads
      avatar.onload = () => {
        getMaxAvatarSize(avatar, ({ width, height }) => {
          avatar.style.width = Math.min(100, width) + "px";
          avatar.style.maxWidth = width + "px";
          avatar.style.maxHeight = height + "px";
          if (avatar._sizeSlider) {
            avatar._sizeSlider.max = width;
          }
        });
      };

      // --- Size Slider ---
      const sliderContainer = document.createElement("div");
      sliderContainer.className = "size-slider-container emotion-avatar-slider-fade";
      const sizeSlider = document.createElement("input");
      sizeSlider.type = "range";
      sizeSlider.min = "80";
      sizeSlider.max = "800";
      sizeSlider.value = "100";
      sizeSlider.className = "size-slider";
      sizeSlider.style.width = "100px";
      avatar._sizeSlider = sizeSlider;

      // Limit slider max after image loads
      getMaxAvatarSize(avatar, ({ width }) => {
        sizeSlider.max = width;
        if (parseInt(sizeSlider.value) > width) {
          sizeSlider.value = width;
          avatar.style.width = width + "px";
          sizeSlider.style.width = Math.max(50, width * 0.8) + "px";
        }
      });

      const valuePopup = document.createElement("div");
      valuePopup.className = "slider-value-popup";
      sliderContainer.appendChild(valuePopup);

      const updatePopup = () => {
        valuePopup.textContent = `${sizeSlider.value}px`;
        const percent = (sizeSlider.value - sizeSlider.min) / (sizeSlider.max - sizeSlider.min);
        const thumbWidth = 12;
        const popupLeft = percent * (sizeSlider.offsetWidth - thumbWidth) + thumbWidth / 2;
        valuePopup.style.left = `${popupLeft}px`;
      };

      const handleSliderInteractionStart = (e) => {
          e.stopPropagation();
          valuePopup.style.display = 'block';
          updatePopup();
      };

      const handleSliderInteractionEnd = () => {
          valuePopup.style.display = 'none';
      };

      sizeSlider.addEventListener("mousedown", handleSliderInteractionStart);
      sizeSlider.addEventListener("touchstart", handleSliderInteractionStart);

      sizeSlider.addEventListener("input", updatePopup);

      sizeSlider.addEventListener("mouseup", handleSliderInteractionEnd);
      sizeSlider.addEventListener("touchend", handleSliderInteractionEnd);

      sizeSlider.addEventListener("change", () => {
        // Clamp to max allowed size
        const maxAllowed = parseInt(sizeSlider.max);
        let newWidth = Math.min(parseInt(sizeSlider.value), maxAllowed);
        avatar.style.width = newWidth + "px";
        sizeSlider.style.width = Math.max(50, newWidth * 0.8) + "px";
        keepInBounds(avatarItem);
      });

      sliderContainer.appendChild(sizeSlider);

      const controls = addControlButtons(avatarItem, avatar, sliderContainer);

      avatarItem.appendChild(avatar);
      avatarItem.appendChild(sliderContainer);
      avatarItem.appendChild(controls);
      document.body.appendChild(avatarItem);

      botAvatars[characterName] = { avatar, container: avatarItem };
      makeDraggable(avatarItem);
      botCount++;
    }

    const avatarData = botAvatars[characterName];
    if (!avatarData) return;

    const characterAvatars = characterEmotionAvatars[characterName] || characterEmotionAvatars["Ashley"];
    const newSrc = characterAvatars[emotionNumber];

    if (newSrc && avatarData.avatar.src !== newSrc) {
      avatarData.avatar.style.opacity = "0";
      setTimeout(() => {
        avatarData.avatar.src = newSrc;
        avatarData.avatar.onload = () => {
          avatarData.avatar.style.opacity = "1";
          // Re-limit size on new image
          getMaxAvatarSize(avatarData.avatar, ({ width, height }) => {
            avatarData.avatar.style.maxWidth = width + "px";
            avatarData.avatar.style.maxHeight = height + "px";
            if (avatarData.avatar._sizeSlider) {
              avatarData.avatar._sizeSlider.max = width;
              // Clamp current size if needed
              if (parseInt(avatarData.avatar.style.width) > width) {
                avatarData.avatar.style.width = width + "px";
                avatarData.avatar._sizeSlider.value = width;
              }
            }
          });
        };
      }, 300);
    } else if (!newSrc) {
      console.error(`Emotion number ${emotionNumber} not found for character: ${characterName}`);
    }
  }

  // 🛡️ --- Keep Avatar In Bounds --- 🛡️
  function keepInBounds(elmnt) {
    if (scriptDisabled) return;
    const rect = elmnt.getBoundingClientRect();
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;

    let newLeft = rect.left;
    let newTop = rect.top;

    if (rect.left < 0) newLeft = 0;
    if (rect.top < 0) newTop = 0;
    if (rect.right > winWidth) newLeft = winWidth - rect.width;
    if (rect.bottom > winHeight) newTop = winHeight - rect.height;

    elmnt.style.left = newLeft + 'px';
    elmnt.style.top = newTop + 'px';
  }

  /*
  *・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.:*・*
  *                                                                           *
  *                  SECTION 4: DRAGGABLE & CONTROLS                          *
  *           (Drag, flip, close, and control avatar UI!)                     *
  *                                                                           *
  *・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.:*・*
  */

  // ✋ --- Make Avatar Draggable (Mouse & Touch) --- ✋
  function makeDraggable(elmnt) {
    if (scriptDisabled) return;
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    let isDragging = false;
    const dragHandle = elmnt;

    // Assign start events
    dragHandle.onmousedown = dragStart;
    dragHandle.ontouchstart = dragStart;

    function dragStart(e) {
      // Don't start drag if the target is a button or slider
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') {
          return;
      }
      e = e || window.event;
      isDragging = false;

      // Get the initial cursor position
      if (e.type === 'touchstart') {
        // --- Prevent page scrolling on drag start ---
        e.preventDefault();
        pos3 = e.touches[0].clientX;
        pos4 = e.touches[0].clientY;
        // Assign touch-specific listeners
        document.ontouchmove = elementDrag;
        document.ontouchend = dragEnd;
      } else {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        // Assign mouse-specific listeners
        document.onmousemove = elementDrag;
        document.onmouseup = dragEnd;
      }
    }

    function elementDrag(e) {
      isDragging = true;
      e = e || window.event;
      e.preventDefault();

      let clientX, clientY;
      // Get the new cursor position
      if (e.type === 'touchmove') {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      // Calculate the displacement
      pos1 = pos3 - clientX;
      pos2 = pos4 - clientY;
      pos3 = clientX;
      pos4 = clientY;

      // Calculate the new element position
      const newTop = elmnt.offsetTop - pos2;
      const newLeft = elmnt.offsetLeft - pos1;

      // Boundary collision detection
      const maxLeft = window.innerWidth - elmnt.offsetWidth;
      const maxTop = window.innerHeight - elmnt.offsetHeight;

      // Set the element's new position, respecting boundaries
      elmnt.style.top = Math.max(0, Math.min(newTop, maxTop)) + "px";
      elmnt.style.left = Math.max(0, Math.min(newLeft, maxLeft)) + "px";
    }

    function dragEnd(e) {
      // Check if it was a tap (no dragging occurred)
      if (!isDragging && e.type === 'touchend') {
          const controls = elmnt.querySelector('.emotion-avatar-controls');
          const slider = elmnt.querySelector('.emotion-avatar-slider-fade');
          if (controls && slider) {
              const isVisible = controls.style.opacity === "1";
              controls.style.opacity = isVisible ? "0" : "1";
              slider.style.opacity = isVisible ? "0" : "1";
          }
      }

      // Unbind all document-level events
      document.onmouseup = null;
      document.onmousemove = null;
      document.ontouchend = null;
      document.ontouchmove = null;

      // Reset the dragging flag
      isDragging = false;
    }
  }

  // 🕹️ --- Add Control Buttons (Close, Flip) --- 🕹️
  function addControlButtons(container, avatar, sliderContainer) {
    const controls = document.createElement("div");
    controls.classList.add("emotion-avatar-controls");
    controls.style.opacity = "0";
    sliderContainer.style.opacity = "0";
    let hideTimeout;

    const showControls = () => {
      controls.style.opacity = "1";
      sliderContainer.style.opacity = "1";
      clearTimeout(hideTimeout);
    };

    const hideControls = () => {
      controls.style.opacity = "0";
      sliderContainer.style.opacity = "0";
    };

    const startHideTimer = () => {
      hideTimeout = setTimeout(hideControls, 2000);
    };

    container.addEventListener("mouseenter", showControls);
    container.addEventListener("mouseleave", startHideTimer);

    // --- Mobile: Tap avatar to show controls, tap outside to hide ---
    if (!container._mobileTapHandlerAdded) {
      container._mobileTapHandlerAdded = true;

      // Show controls on avatar tap
      container.addEventListener("touchstart", function(e) {
        // Only trigger if tapping the avatar itself, not controls or slider
        if (
          e.target === avatar ||
          e.target === container
        ) {
          showControls();
          e.stopPropagation();
        }
      });

      // Hide controls when tapping outside avatar/controls/slider
      document.addEventListener("touchstart", function hideOnOutsideTap(e) {
        if (
          !container.contains(e.target)
        ) {
          hideControls();
        }
      });
    }

    // --- Button creation ---
    const closeButton = document.createElement("button");
    closeButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;margin:auto;" class="lucide lucide-x-icon lucide-x">
        <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
      </svg>
    `;
    let closeHandled = false;
    const closeHandler = (e) => {
      e.stopPropagation();
      if (e.type === "touchstart") {
        closeHandled = true;
      }
      container.remove();
      delete botAvatars[Object.keys(botAvatars).find(key => botAvatars[key].avatar === avatar)];
      scriptDisabled = true;
    };
    closeButton.addEventListener("touchstart", function(e) {
      closeHandler(e);
    }, { passive: false });
    closeButton.addEventListener("click", function(e) {
      if (closeHandled) {
        closeHandled = false;
        return;
      }
      closeHandler(e);
    });

    const flipButton = document.createElement("button");
    flipButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;margin:auto;" class="lucide lucide-arrow-left-right-icon lucide-arrow-left-right">
        <path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/>
      </svg>
    `;
    let flipHandled = false;
    const flipHandler = (e) => {
      e.stopPropagation();
      if (e.type === "touchstart") {
        flipHandled = true;
      }
      avatar.style.transform = avatar.style.transform === "scaleX(-1)" ? "scaleX(1)" : "scaleX(-1)";
    };
    flipButton.addEventListener("touchstart", function(e) {
      flipHandler(e);
    }, { passive: false });
    flipButton.addEventListener("click", function(e) {
      if (flipHandled) {
        flipHandled = false;
        return;
      }
      flipHandler(e);
    });

    controls.appendChild(closeButton);
    controls.appendChild(flipButton);

    return controls;
  }

  // 🔍 --- Analyze Emotion with Gemini --- 🔍
  function analyzeEmotion(characterName, messageText) {
    if (scriptDisabled) return;

    /*
    *・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.:*・*
    *                                                                           *
    *                  SECTION 5: GEMINI PROMPT TEMPLATE                        *
    *           (The prompt sent to Gemini is customizable! ✨)                  *
    *                                                                           *
    *   📝 You can edit the prompt below to change how Gemini analyzes           *
    *   character emotions. If you add/remove emotions or change their           *
    *   descriptions/numbers in your avatar config, update the prompt list       *
    *   here to match! This helps keep the emotion detection and avatar images   *
    *   in sync for your characters and preferences.                            *
    *                                                                           *
    *・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.:*・*
    */

    GM_log("Sending message to Gemini for emotion analysis...");
    const prompt = `Analyze the following text and determine ${characterName}'s LAST DISPLAYED emotion based solely on their physical expressions, tone of voice, body language, and observable actions in the FINAL SENTENCE OR PHRASE.\n\nIgnore all internal thoughts, motivations, or non-visible context. Classify the emotion based on how a neutral observer would interpret their behavior at that moment. Focus ONLY on the visible and audible cues in the last part of the text.\n\nExample: If the character smiles warmly while gripping a knife (without visible tension), the emotion is "17" (Joy). If they cry silently with clenched fists, it's "26" (Sadness).\n\nRespond ONLY with the NUMBER corresponding to the most fitting emotion from this list, considering ONLY the LAST emotion shown:\n\n1. Admiration\n2. Amusement\n3. Anger\n4. Annoyance\n5. Approval\n6. Caring\n7. Confusion\n8. Curiosity\n9. Desire\n10. Disappointment\n11. Disapproval\n12. Disgust\n13. Embarrassment\n14. Excitement\n15. Fear\n16. Gratitude\n17. Joy\n18. Love\n19. Nervousness\n20. Neutral\n21. Optimism\n22. Pride\n23. Realization\n24. Relief\n25. Remorse\n26. Sadness\n27. Surprise\n\n${messageText}`;
    const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };

    GM_xmlhttpRequest({
      method: "POST",
      url: endpoint,
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(payload),
      onload: function (res) {
        try {
          const response = JSON.parse(res.responseText);
          const emotionNumber = parseInt(response.candidates?.[0]?.content?.parts?.[0]?.text) || 20;
          addEmotionAvatar(emotionNumber, characterName);
        } catch (e) {
          console.error("Error processing response:", e.message);
        }
      },
      onerror: function (err) {
        console.error("Error request:", err.message);
      },
    });
  }

  /*
  *・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.:*・*
  *                                                                           *
  *                  SECTION 6: JANITORAI CHAT INTEGRATION                    *
  *           (Hooks into JanitorAI chat to track bot messages)               *
  *                                                                           *
  *・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.:*・*
  */

  // 💬 --- Chat Selectors --- 💬
  const CHAT_CONTAINER_SELECTOR = '[class^="_messagesMain_"]';
  const MESSAGE_CONTAINER_SELECTOR = '[data-testid="virtuoso-item-list"] > div[data-index]';
  const BOT_NAME_ICON_SELECTOR = '[class^="_nameIcon_"]';
  const LAST_MESSAGE_SWIPE_CONTAINER_SELECTOR = '[class^="_botChoicesContainer_"]';
  const SWIPE_SLIDER_SELECTOR = '[class^="_botChoicesSlider_"]';
  const MESSAGE_WRAPPER_SELECTOR = 'li[class^="_messageDisplayWrapper_"]';
  const MESSAGE_TEXT_SELECTOR = ".css-ji4crq p";
  const EDIT_PANEL_SELECTOR = '[class^="_editPanel_"]';
  const CONTROL_PANEL_SELECTOR = '[class^="_controlPanel_"]';
  const BOT_NAME_SELECTOR = '[class^="_nameText_"]';

  let lastLoggedText = "";
  let lastLoggedStatus = "";
  let lastLoggedSwipeIndex = -1;
  let lastLoggedMessageIndex = -1;

  // 📝 --- Log Message Status --- 📝
  /**
   * Finds the last bot message, determines its state (swipe, text, status),
   * and logs the information.
   */
  function logMessageStatus() {
    if (scriptDisabled) return; // <--- Early return if disabled
    const allMessageNodes = document.querySelectorAll(MESSAGE_CONTAINER_SELECTOR);
    if (allMessageNodes.length === 0) return;

    // Find the last message from a bot
    let lastBotMessageContainer = null;
    for (let i = allMessageNodes.length - 1; i >= 0; i--) {
      if (allMessageNodes[i].querySelector(BOT_NAME_ICON_SELECTOR)) {
        lastBotMessageContainer = allMessageNodes[i];
        break;
      }
    }

    if (!lastBotMessageContainer) return; // No bot messages found

    const botNameElement = lastBotMessageContainer.querySelector(BOT_NAME_SELECTOR);
    const characterName = botNameElement ? botNameElement.textContent.trim() : null;

    const messageIndex = parseInt(lastBotMessageContainer.dataset.index, 10);
    let activeMessageNode;
    let activeSwipeIndex = 0; // Default to 0 for non-swipeable messages

    // Check if this is the swipeable container or a regular message
    const swipeContainer = lastBotMessageContainer.querySelector(LAST_MESSAGE_SWIPE_CONTAINER_SELECTOR);

    if (swipeContainer) {
      // It's the last message with swipes
      const slider = swipeContainer.querySelector(SWIPE_SLIDER_SELECTOR);
      if (!slider) return;

      const transform = slider.style.transform;
      const translateX = transform ? parseFloat(transform.match(/translateX\(([-0-9.]+)%\)/)?.[1] || "0") : 0;
      activeSwipeIndex = Math.round(Math.abs(translateX) / 100);

      const allSwipes = slider.querySelectorAll(MESSAGE_WRAPPER_SELECTOR);
      if (allSwipes.length <= activeSwipeIndex) return;
      activeMessageNode = allSwipes[activeSwipeIndex];
    } else {
      // It's an older, non-swipeable message
      activeMessageNode = lastBotMessageContainer.querySelector(MESSAGE_WRAPPER_SELECTOR);
    }

    if (!activeMessageNode) return;

    const textElements = activeMessageNode.querySelectorAll(MESSAGE_TEXT_SELECTOR);
    const messageText =
      textElements.length > 0
        ? Array.from(textElements)
            .map((p) => p.textContent.trim())
            .join("\n")
        : "[No text found]";

    const isEditing = !!activeMessageNode.querySelector(EDIT_PANEL_SELECTOR);
    const isFinished = !!activeMessageNode.querySelector(CONTROL_PANEL_SELECTOR);

    let status;
    if (isEditing) {
      status = "Editing";
    } else if (isFinished) {
      status = "Finished";
    } else {
      status = "Streaming";
    }

    const shouldLog =
      status !== lastLoggedStatus ||
      activeSwipeIndex !== lastLoggedSwipeIndex ||
      messageIndex !== lastLoggedMessageIndex ||
      (status !== "Streaming" && messageText !== lastLoggedText);

    if (shouldLog) {
      GM_log(`Message Index: ${messageIndex} (Swipe ${activeSwipeIndex + 1}):`);

      if (status === "Streaming") {
        GM_log(`Status: ${status}`);
      } else {
        GM_log(`Text: "${messageText}"`);
        GM_log(`Status: ${status}`);
        if (status === "Finished" && messageText !== "[No text found]" && characterName) {
          analyzeEmotion(characterName, messageText);
        }
      }
      GM_log("--------------------");

      lastLoggedStatus = status;
      lastLoggedSwipeIndex = activeSwipeIndex;
      lastLoggedMessageIndex = messageIndex;

      if (status !== "Streaming") {
        lastLoggedText = messageText;
      } else {
        lastLoggedText = "";
      }
    }
  }

  // 👀 --- Initialize Observer --- 👀
  /**
   * Initializes the observer to watch for chat changes.
   */
  function initializeObserver() {
    if (scriptDisabled) return;
    const container = document.querySelector(CHAT_CONTAINER_SELECTOR);

    if (container) {
      const observer = new MutationObserver((mutations) => {
        logMessageStatus();
      });

      observer.observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style'],
      });

      // Initial check
      logMessageStatus();
    } else {
      setTimeout(initializeObserver, 1000);
    }
  }

  // 🚀 --- Script Start --- 🚀
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeObserver);
  } else {
    initializeObserver();
  }

  /*
  *・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.:*・*
  *                                                                           *
  *                  SECTION 7: UTILITY FUNCTIONS                             *
  *           (Helpers for image sizing and viewport calculations)            *
  *                                                                           *
  *・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.:*・*
  */

  // 📏 --- Get Visible Area --- 📏
  function getVisibleArea() {
    if (scriptDisabled) return;
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  // 🖼️ --- Get Image Natural Size --- 🖼️
  function getImageNaturalSize(img, callback) {
    if (scriptDisabled) return;
    if (img.complete) {
      callback({ width: img.naturalWidth, height: img.naturalHeight });
    } else {
      img.onload = () => {
        callback({ width: img.naturalWidth, height: img.naturalHeight });
      };
    }
  }

  // 📐 --- Get Max Avatar Size --- 📐
  function getMaxAvatarSize(img, callback) {
    if (scriptDisabled) return;
    getImageNaturalSize(img, ({ width: imgW, height: imgH }) => {
      const { width: vpW, height: vpH } = getVisibleArea();
      const maxW = vpW - 50;
      const maxH = vpH - 50;
      // Maintain aspect ratio
      const aspect = imgW / imgH;
      let finalW = maxW, finalH = maxW / aspect;
      if (finalH > maxH) {
        finalH = maxH;
        finalW = maxH * aspect;
      }
      callback({ width: Math.floor(finalW), height: Math.floor(finalH) });
    });
  }
})();
