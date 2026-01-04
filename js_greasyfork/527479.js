// ==UserScript==
// @name         Drawaria Pixel Converter Mod
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Converts the entire Drawaria page, including all elements, to a pixelated style, with a draggable UI and separate enable/disable buttons.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/527479/Drawaria%20Pixel%20Converter%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/527479/Drawaria%20Pixel%20Converter%20Mod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let pixelSize = 8;
    let isPixelated = false;
    let observer = null;
    let uiContainer = null; // Store the UI container

    function pixelateElement(element) {
        if (!element) return;

        // Check if element is a canvas or an image
        if (element.tagName === 'CANVAS' || element.tagName === 'IMG') {
            pixelateImage(element);

        } else {

            // Recursively pixelate children
            for (const child of element.children) {
                pixelateElement(child);
            }
        }

        //Pixelate text, but only if not already handled by a parent or child element
        if (element.textContent && element.children.length === 0) {
            pixelateText(element);
        }

        //Pixelate background images
        pixelateBackgroundImage(element);

        //pixelate border images
        pixelateBorderImage(element);

    }


    function pixelateImage(element) {
      if (!element || !element.width || !element.height) return;

        const canvas = document.createElement('canvas');
        canvas.width = element.width;
        canvas.height = element.height;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        // Draw the original element onto the canvas
        if (element.tagName === "CANVAS"){
          ctx.drawImage(element, 0, 0, element.width, element.height);
        } else if (element.tagName === "IMG" && element.src) {
            //for images, we need to be sure they loaded before drawing
            if (!element.complete) {
              element.onload = () => pixelateImage(element)
              return;
            }
            ctx.drawImage(element, 0, 0, element.width, element.height);
        } else {
          return;
        }

        const pixelatedCanvas = pixelateCanvasData(canvas, ctx);

        if (element.tagName === "CANVAS"){
           const elementCtx = element.getContext('2d');
           elementCtx.clearRect(0, 0, element.width, element.height);
           elementCtx.drawImage(pixelatedCanvas, 0, 0, element.width, element.height);
        }
        else if(element.tagName === "IMG"){
           element.src = pixelatedCanvas.toDataURL(); // Replace image src with pixelated data
        }
    }


    function pixelateCanvasData(canvas, ctx) {
        const width = canvas.width;
        const height = canvas.height;

        const pixelatedCanvas = document.createElement('canvas');
        pixelatedCanvas.width = width;
        pixelatedCanvas.height = height;
        const ctxPixelated = pixelatedCanvas.getContext('2d');
        ctxPixelated.imageSmoothingEnabled = false;


        for (let y = 0; y < height; y += pixelSize) {
            for (let x = 0; x < width; x += pixelSize) {
                const pixelData = ctx.getImageData(x, y, 1, 1).data;
                const color = `rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, ${pixelData[3] / 255})`;
                ctxPixelated.fillStyle = color;
                ctxPixelated.fillRect(x, y, pixelSize, pixelSize);
            }
        }
        return pixelatedCanvas;

    }

    function pixelateText(element){
      element.style.font = `bold ${pixelSize}px monospace`; // Use a monospace font for consistent character width
    }


    function pixelateBackgroundImage(element) {
        let originalBackgroundImage = window.getComputedStyle(element).backgroundImage;
        if (originalBackgroundImage && originalBackgroundImage !== 'none') {
            // Extract URL from 'url("...")'
            const imageUrlMatch = originalBackgroundImage.match(/url\("?(.+?)"?\)/);

            if (imageUrlMatch) {
                const imageUrl = imageUrlMatch[1];
                const img = new Image();
                img.src = imageUrl; // Set the image source

                img.onload = () => {
                  const tempCanvas = document.createElement('canvas');
                  tempCanvas.width = img.width;
                  tempCanvas.height = img.height;
                  const tempCtx = tempCanvas.getContext('2d');
                  tempCtx.drawImage(img, 0, 0);

                  const pixelatedCanvas = pixelateCanvasData(tempCanvas, tempCtx);

                  element.style.backgroundImage = `url(${pixelatedCanvas.toDataURL()})`;
                  element.style.backgroundSize = `${img.width}px ${img.height}px`; //Keep original background image size

                };
                 img.onerror = () => {
                    console.error("Error loading background image:", imageUrl);
                };
            }
        }
    }

     function pixelateBorderImage(element){
        let originalBorderImage = window.getComputedStyle(element).borderImageSource;

        if (originalBorderImage && originalBorderImage !== 'none') {
             // Extract URL from 'url("...")'
            const imageUrlMatch = originalBorderImage.match(/url\("?(.+?)"?\)/);
            if(imageUrlMatch){
              const imageUrl = imageUrlMatch[1];
              const img = new Image();
              img.crossOrigin = "anonymous"; // Attempt to avoid CORS issues
              img.src = imageUrl;
              img.onload = () => {
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = img.width;
                tempCanvas.height = img.height;
                const tempCtx = tempCanvas.getContext('2d');
                tempCtx.drawImage(img, 0, 0);

                const pixelatedCanvas = pixelateCanvasData(tempCanvas, tempCtx);
                element.style.borderImageSource = `url(${pixelatedCanvas.toDataURL()})`;

              }
               img.onerror = () => {
                    console.error("Error loading border image:", imageUrl);
                };
            }

        }
    }

    function applyPixelation() {
        if (isPixelated) {
            pixelateElement(document.body);
        }
    }


    function enablePixelation() {
      if(!isPixelated){
        isPixelated = true;
        applyPixelation();
        startObserving();
      }
    }

    function disablePixelation(){
      if(isPixelated){
        isPixelated = false;
        stopObserving();
        location.reload(); //refresh page
      }
    }


    function createUI() {
      uiContainer = document.createElement('div');
      uiContainer.id = "pixelationUI";
      uiContainer.style.position = 'fixed';
      uiContainer.style.top = '20px';
      uiContainer.style.right = '20px';
      uiContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; // Semi-transparent black
      uiContainer.style.color = 'white';
      uiContainer.style.padding = '15px';
      uiContainer.style.borderRadius = '10px';
      uiContainer.style.zIndex = '10000';
      uiContainer.style.fontFamily = 'sans-serif';
      uiContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)';
      uiContainer.style.userSelect = 'none'; // Prevent text selection
      uiContainer.style.cursor = 'move';   // Indicate draggability

      // --- Title Bar (for dragging) ---
      const titleBar = document.createElement('div');
      titleBar.style.cursor = 'move';
      titleBar.style.fontWeight = 'bold';
      titleBar.style.marginBottom = '10px';
      titleBar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.3)';
      titleBar.style.paddingBottom = '5px';
      titleBar.textContent = 'Pixelator Controls';
      uiContainer.appendChild(titleBar);

        // --- Button container ---
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex'; // Arrange buttons horizontally
        buttonContainer.style.gap = '10px';     // Spacing between buttons
        buttonContainer.style.marginBottom = '10px';
        uiContainer.appendChild(buttonContainer);

      // --- Enable Button ---
        const enableButton = document.createElement('button');
        enableButton.id = "pixelationEnableButton";
        enableButton.textContent = 'Enable Pixelation';
        enableButton.style.backgroundColor = '#4CAF50'; // Green
        enableButton.style.color = 'white';
        enableButton.style.border = 'none';
        enableButton.style.padding = '8px 16px';
        enableButton.style.borderRadius = '5px';
        enableButton.style.cursor = 'pointer';
        enableButton.style.flex = '1'; // Equal width
        enableButton.addEventListener('click', enablePixelation);
        buttonContainer.appendChild(enableButton); // Add to button container

      // --- Disable Button ---
        const disableButton = document.createElement('button');
        disableButton.id = "pixelationDisableButton";
        disableButton.textContent = 'Disable Pixelation';
        disableButton.style.backgroundColor = '#f44336'; // Red
        disableButton.style.color = 'white';
        disableButton.style.border = 'none';
        disableButton.style.padding = '8px 16px';
        disableButton.style.borderRadius = '5px';
        disableButton.style.cursor = 'pointer';
        disableButton.style.flex = '1';  // Equal width
        disableButton.addEventListener('click', disablePixelation);
        buttonContainer.appendChild(disableButton); // Add to button container


      // --- Pixel Size Input ---
      const pixelSizeContainer = document.createElement('div');
      pixelSizeContainer.style.marginBottom = '10px';
      pixelSizeContainer.style.display = 'flex';          // Use flexbox
      pixelSizeContainer.style.alignItems = 'center';    // Center vertically
      pixelSizeContainer.style.justifyContent = 'space-between';  // Space out

      const pixelSizeLabel = document.createElement('label');
      pixelSizeLabel.textContent = 'Pixel Size:';
      pixelSizeLabel.style.marginRight = '10px';
      pixelSizeContainer.appendChild(pixelSizeLabel);

      const pixelSizeInput = document.createElement('input');
      pixelSizeInput.type = 'number';
      pixelSizeInput.value = pixelSize;
      pixelSizeInput.min = '1';
      pixelSizeInput.style.width = '60px';
      pixelSizeInput.style.padding = '5px';
      pixelSizeInput.style.borderRadius = '5px';
      pixelSizeInput.style.border = '1px solid #666';
      pixelSizeInput.style.backgroundColor = '#333';
      pixelSizeInput.style.color = 'white';
      pixelSizeInput.addEventListener('change', (event) => {
          const newValue = parseInt(event.target.value, 10);
          if (!isNaN(newValue) && newValue > 0) {
              pixelSize = newValue;
              applyPixelation();
          }
      });
      pixelSizeContainer.appendChild(pixelSizeInput);
      uiContainer.appendChild(pixelSizeContainer);


      // --- Close Button ---
      const closeButton = document.createElement('button');
      closeButton.textContent = '×';
      closeButton.style.position = 'absolute';
      closeButton.style.top = '5px';
      closeButton.style.right = '5px';
      closeButton.style.backgroundColor = 'transparent';
      closeButton.style.color = 'white';
      closeButton.style.border = 'none';
      closeButton.style.fontSize = '18px';
      closeButton.style.cursor = 'pointer';
      closeButton.addEventListener('click', () => {
          uiContainer.remove(); // Remove the whole UI
          stopObserving(); //stop observing to prevent errors when pixelating
      });
      uiContainer.appendChild(closeButton);

      document.body.appendChild(uiContainer);
      makeDraggable(uiContainer);
    }

    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        // Use the title bar as the drag handle
        const dragHandle = element.querySelector('div'); // Get the first div (title bar)
        dragHandle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // Get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // Call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // Calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // Set the element's new position:
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // Stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }



    function startObserving() {
        if (observer) return;

        observer = new MutationObserver(mutations => {
            applyPixelation();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true,
        });
    }

    function stopObserving() {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
    }


    createUI();

})();