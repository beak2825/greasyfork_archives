// ==UserScript==
// @name        Jigidi Color Matching Helper and Solver
// @namespace   https://greasyfork.org/en/scripts/526141-jigidi-color-matching-helper-solver
// @match		https://jigidi.com/solve*
// @match		https://www.jigidi.com/solve*
// @match		https://jigidi.com/*/solve*
// @match		https://www.jigidi.com/*/solve*
// @match       https://jigidi.com/s*
// @match       https://www.jigidi.com/s*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       unsafeWindow
// @grant		GM_xmlhttpRequest
// @version     1.6
// @description Script to help solve Jigidi puzzles, by rendering columns in a colourful grid gradient, and matching by color
// @website     https://greasyfork.org/en/scripts/526141-jigidi-color-matching-helper-solver
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526141/Jigidi%20Color%20Matching%20Helper%20and%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/526141/Jigidi%20Color%20Matching%20Helper%20and%20Solver.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let $verboselevel=9;
    let $movestop = 0;
    let $drawlevel = 0;
    let $delay1 = 1;
    let $delay2 = 1;
    let $movedelay1 = 1;
    let $movedelay2= 20;
    let $limitpieces = 9999;
    let $forcefactor = 0.2
    let BKCOLOR = "#F6F6F6";

    // Custom Gradients array:
    var gradientsArray = {
        "Rainbow": ['#FF0000', '#FFFF00', '#00FF00', '#0000FF'],
        "Distinct": ['#191970', '#006400', '#ff0000', '#00ff00', '#00ffff', '#ff00ff', '#ffb6c1'],
        "Rastafari": ['#1E9600', "#FFF200", "#FF0000"],
        "Sublime Vivid": ['#FC466B', "#3F5EFB"],
        "DanQ": ['#FF0000', '#EE82EE'],
        "Instagram": ['#833ab4', "#fd1d1d", "#fcb045"],
        "Hacker": ['#ff0000', "#000000", "#00ff11", "#000000", "#0077ff"],
    }
    //**********************************
    // HELPER FUNCTIONS
    //**********************************
    //Borrowed function converts canvas to screenpos, it seems to work.
        function convertCanvasPosToScreenPos(canvas, x, y) {
		let rect, screenX, screenY;

		try {
			rect = canvas.getBoundingClientRect();
		} catch (err) {
			rect = {
				top: canvas.offsetTop,
				left: canvas.offsetLeft,
				width: canvas.offsetWidth,
				height: canvas.offsetHeight,
			};
		}

		const marginX =
			(window.pageXOffset || document.scrollLeft || 0) -
			(document.clientLeft || document.body.clientLeft || 0);
		const marginY =
			(window.pageYOffset || document.scrollTop || 0) -
			(document.clientTop || document.body.clientTop || 0);
		const style = window.getComputedStyle
			? getComputedStyle(canvas)
			: canvas.currentStyle;
		const left =
			rect.left +
			marginX +
			(parseInt(style.paddingLeft, 10) + parseInt(style.borderLeftWidth, 10));
		const right =
			rect.right +
			marginX -
			(parseInt(style.paddingRight, 10) + parseInt(style.borderRightWidth, 10));
		const top =
			rect.top +
			marginY +
			(parseInt(style.paddingTop, 10) + parseInt(style.borderTopWidth, 10));
		const bottom =
			rect.bottom +
			marginY -
			(parseInt(style.paddingBottom, 10) +
				parseInt(style.borderBottomWidth, 10));

		if (y === undefined) {
			screenX = left + (x.x * (right - left)) / canvas.width;
			screenY = top + (x.y * (bottom - top)) / canvas.height;
		} else {
			screenX = left + (x * (right - left)) / canvas.width;
			screenY = top + (y * (bottom - top)) / canvas.height;
		}

		return {x: Math.floor(screenX), y: Math.floor(screenY) };
	}

// Simulate a mouse event, It seems to work says chatgpt
    async function simulateEvent(element, type, options = {}) {
                const event = new unsafeWindow.MouseEvent(type, {
                    bubbles: true,
                    cancelable: true,
                    view: unsafeWindow, // Fix for Greasemonkey
                    clientX: options.clientX || 0,
                    clientY: options.clientY || 0,
                    buttons: options.buttons || 1, // Left mouse button
                });
                element.dispatchEvent(event);
            }

    async function simulateDrag(target, startX, startY, endX, endY, steps = 10) {
        if (!target) return console.error("Target element not found");

        if ($verboselevel > 8) {console.log(`-->Starting drag simulation...${startX} ${startY}`);}

        // Step size for smooth movement
        const stepX = (endX - startX) / steps;
        const stepY = (endY - startY) / steps;

        // Trigger mousedown at start position
        await simulateEvent(target, "mousedown", { clientX: startX, clientY: startY });
        await sleep($movedelay1);

        // Simulate smooth movement
        let currentX = startX;
        let currentY = startY;
        for (let i = 0; i <= steps; i++) {
            currentX += stepX;
            currentY += stepY;
            await simulateEvent(target, "mousemove", { clientX: currentX, clientY: currentY });
            await sleep($movedelay1);

        }
        await simulateEvent(target, "mousemove", { clientX: endX, clientY: endY });
        await sleep(1);
        // Trigger mouseup at final position
        await simulateEvent(target, "mouseup", { clientX: endX, clientY: endY });
        await sleep($movedelay2);
        if ($verboselevel > 8) {console.log(`-->Drag simulation completed. ${endX} ${endY}`);}
    }

    // Seems to do the trick
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    // I should just settle on one approach and with I, I mean chatgpt

    function hexToRgb(hex) {
        // Convert hex to RGB
        hex = hex.replace(/^#/, "");
        let bigint = parseInt(hex, 16);
        return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255,255];
    }

    function rgbToHex([r, g, b]) {
        return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
    }
    //**********************************
    // RECOLORING FUNCTIONS - The principle is to give every piece a unique color
    //**********************************
    // From magicstripes
    function interpolateColors(color1, color2, t) {
        // Extract RGB components of the colors
        const [r1, g1, b1] = color1.match(/\w\w/g).map(hex => parseInt(hex, 16));
        const [r2, g2, b2] = color2.match(/\w\w/g).map(hex => parseInt(hex, 16));

        // Interpolate RGB components
        const r = Math.round(r1 + (r2 - r1) * t);
        const g = Math.round(g1 + (g2 - g1) * t);
        const b = Math.round(b1 + (b2 - b1) * t);

        // Convert interpolated RGB components to hex format
        return '#' + [r, g, b].map(component => component.toString(16).padStart(2, '0')).join('');
    }
    // From magicstripes
    function generateSpectrum(N, A) {
        function interpolateColor(c1, c2, factor) {
            return c1.map((val, i) => Math.round(val + factor * (c2[i] - val)));
        }

        let colors = A.map(hexToRgb);
        let result = [];

        for (let i = 0; i < N; i++) {
            let t = i / (N - 1);
            let index = t * (colors.length - 1);
            let lower = Math.floor(index);
            let upper = Math.ceil(index);
            let factor = index - lower;

            if (lower === upper) {
                result.push(rgbToHex(colors[lower]));
            } else {
                result.push(rgbToHex(interpolateColor(colors[lower], colors[upper], factor)));
            }
        }

        return result;
    }
    //**********************************
    // DETECTION FUNCTIONS
    //**********************************
    // Find the square the is the main part of the puzzel piece without the tabs
    // Floodfill and histogram, very expensive function..
    function getBoundingRectangle(canvas, startX, startY, targetColor) {
        const ctx = canvas.getContext("2d");
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        const width = canvas.width;
        const height = canvas.height;

        function getPixelIndex(x, y) {
            return (y * width + x) * 4;
        }

        function isTargetColor(idx) {
            return pixels[idx] === targetR && pixels[idx + 1] === targetG && pixels[idx + 2] === targetB;
        }

        // Convert target color to RGB format
        const [targetR, targetG, targetB] = hexToRgb(targetColor);

        // Ensure the start pixel matches the target color
        const targetIdx = getPixelIndex(startX, startY);
        if (!isTargetColor(targetIdx)) {
            return null;
        }

        // Initialize bounding box coordinates
        let minX = startX, maxX = startX, minY = startY, maxY = startY;
        const queue = [startX, startY];
        const visited = new Uint8Array(width * height); // Track visited pixels

        // Perform flood-fill algorithm to find connected pixels of the same color
        while (queue.length > 0) {
            const y = queue.pop();
            const x = queue.pop();
            const idx = getPixelIndex(x, y);
            if (visited[idx >> 2]) continue;
            visited[idx >> 2] = 1;

            // Update bounding box
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);

            // Check adjacent pixels (left, right, up, down)
            for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                    const nIdx = getPixelIndex(nx, ny);
                    if (!visited[nIdx >> 2] && isTargetColor(nIdx)) {
                        queue.push(nx, ny);
                    }
                }
            }
        }

        // Compute histograms for trimming bounding box
        let rectWidth = maxX - minX + 1;
        let rectHeight = maxY - minY + 1;
        let horizontalHistogram = new Array(rectWidth).fill(0);
        let verticalHistogram = new Array(rectHeight).fill(0);

        for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
                if (visited[getPixelIndex(x, y) >> 2]) {
                    horizontalHistogram[x - minX]++;
                    verticalHistogram[y - minY]++;
                }
            }
        }

        // Less than 30% would mean a tab. Seems fair
        function findTrimmedBounds(histogram) {
            let left = 0, right = histogram.length - 1;
            let maxH = Math.max(...histogram);
            while (histogram[left] < maxH * 0.3) left++; // Trim left side
            while (histogram[right] < maxH * 0.3) right--; // Trim right side
            return [left, right];
        }

        // Trim bounding box using histogram data
        const [trimLeft, trimRight] = findTrimmedBounds(horizontalHistogram);
        const [trimTop, trimBottom] = findTrimmedBounds(verticalHistogram);

        // Compute center of trimmed bounding box
        const centerX = Math.round((trimRight + trimLeft+2) / 2) + minX;
        const centerY = Math.round((trimBottom + trimTop+2) / 2) + minY;

        // Validate if the center pixel still matches the target color
        const centerIdx = getPixelIndex(centerX, centerY);
        const isCenterOK = isTargetColor(centerIdx);

        // Return final bounding rectangle with center point validation
        return {
            x: trimLeft + minX,
            y: trimTop + minY,
            width: trimRight - trimLeft + 2,
            height: trimBottom - trimTop + 2,
            center: { x: centerX, y: centerY },
            isCenterOK: isCenterOK
        };
    }



    // Find the piece we are looking for
    function findColorBlock(canvas, targetColor,lastLocation) {
        const ctx = canvas.getContext("2d");
        const width = canvas.width;
        const height = canvas.height;
        const imageData = ctx.getImageData(0, 0, width, height).data;
        let lastIndex = width * height *4;
        let startY = 0;


        // Convert target color to RGBA
        const targetRGBA = hexToRgb(targetColor);
        const tR = targetRGBA[0], tG = targetRGBA[1], tB = targetRGBA[2], tA = targetRGBA[3];

        if (lastLocation !== undefined) {
            let startIndex = (lastLocation.y * width + lastLocation.x) * 4;
            if (
                    imageData[startIndex] === tR &&
                    imageData[startIndex + 1] === tG &&
                    imageData[startIndex + 2] === tB) {
               if ($verboselevel > 5) {console.log(`Cache hit: ${targetColor} ${lastLocation.x} ${lastLocation.y}`);}
                return (lastLocation);
            } else {
                startY = lastLocation.y;
            }
        }

        for (let yloop = 0; yloop < height; yloop++) {
            for (let x = 0; x < width; x++) {
                let y = (startY + yloop) % height;
                let index = (y * width + x) * 4;
                // Directly compare pixel values
                if (
                    imageData[index] === tR &&
                    imageData[index + 1] === tG &&
                    imageData[index + 2] === tB
                ) {
                    if ($verboselevel > 5) {if (lastLocation !== undefined) {console.log(`Cache miss: ${targetColor} ${lastLocation.x} ${lastLocation.y} versus x:${x}-y:${y}`); }}
                    return { x, y };
                }
            }
        }

        return null; // No matching block found
    }


    function drawRect (xCanvas, xColor, xPos, yPos, xWidth, xHeight=0) {
        const ctx = xCanvas.getContext("2d");
        if (xHeight==0) xHeight = xWidth;
        ctx.fillStyle = xColor;
        ctx.fillRect(xPos, yPos, xWidth, xHeight);
    }


    //**********************************
    // FORM AND LOAD
    //**********************************


    // Wait for page to load
    window.addEventListener('load', function () {
        // Prepare ColorMatching Solver UI
        const JigidiColorMatchingSolver = document.createElement('div');
        JigidiColorMatchingSolver.id = 'jigidi-ColorMatching-solver';


        // Inject ColorMatching Solver UI after the tool info panel
        const creatorElem = document.getElementById('tool-info-panel');
        const insertElem = document.getElementById('tool-clock-panel');
        if (insertElem) {
            insertElem.insertAdjacentElement('afterend',JigidiColorMatchingSolver);
        }
        const zoom_in = document.getElementById("game-zoom-in");
        const ColorMatchingGo = document.createElement("button");
		ColorMatchingGo.id = "ColorMatchingGo";
		ColorMatchingGo.title = "Solve/Stop";
		ColorMatchingGo.className = "btn";
        ColorMatchingGo.style.fontSize = "30px"; // Change text size
        ColorMatchingGo.style.fontWeight = "bold"; // Make text bold
        ColorMatchingGo.style.lineHeight = "30px";
        if (zoom_in) {
            zoom_in.parentNode.insertBefore(ColorMatchingGo, zoom_in);
        }


        // Cleanup the page, best part of this script
        const elementWithAds = document.querySelector('.show-ad');
        if (elementWithAds) {
            elementWithAds.classList.remove('show-ad');
        }

        // Get the canvas element
        const mycanvas = document.querySelector('canvas');
        if (!mycanvas) {
            // Sleep for 2 seconds and try again
            setTimeout(() => { window.location.reload(); }, 2000);
            return;
        }

        // Global settings
        const ColorMatchingSolverSettingsGlobal = GM_getValue('ColorMatchingSolverSettingsGlobal', {
            showNumbers: true,
            showColours: true,
            showColoursBy: 'length',
            gradient: 'Rainbow',
            fontSize: 26
        });
        // Unique jigsaw ID settings
        const match = window.location.href.match(/solve\/(\w+)\//);
        const jigsawId = match ? match[1] : null; // Use null or any default value
        const ColorMatchingSolverSettings = GM_getValue(`ColorMatchingSolverSettings_${jigsawId}`, { col: 1 });
        // Initialize an empty string to store the HTML options
        let optionsHTML = '';
        JigidiColorMatchingSolver.innerHTML = `
                    <div id="tool-settings-panel" class="panel-tool">
                        <label id="showloginname" style="display:none;gap:10px"><input style="text-align:center;background-color:orange;color:white;" type="text" id="loginname"  maxlength="10" readonly></label>
                        <label id="shownumpieces" style="display:none;gap:10px"># of Pieces: <input style="width:50px" type="number" id="numpieces" min="1" value="750" maxlength="3" readonly>Columns: <input style="width:50px" type="number" id="numcolumns" min="1" value="20" maxlength="3"></label>
                        <label class="checkbox icon-plus">Show numbers on pieces <input type="checkbox" id="show-numbers" ${ColorMatchingSolverSettingsGlobal.showNumbers ? 'checked' : ''}><i style="${ColorMatchingSolverSettingsGlobal.showNumbers ? 'background: green;' : 'background: firebrick;'}"></i></label>

                        <label for="font-size" class="checkbox icon-plus">Font size: <select name="font-size" id="font-size" style="padding: 0.5rem; font-weight: bold; border-radius: 0.5rem; background: white; color: black; border: none; float: right;">
                            <option value="12" ${ColorMatchingSolverSettingsGlobal.fontSize === 12 ? 'selected' : ''}>12</option>
                            <option value="16" ${ColorMatchingSolverSettingsGlobal.fontSize === 16 ? 'selected' : ''}>16</option>
                            <option value="22" ${ColorMatchingSolverSettingsGlobal.fontSize === 22 ? 'selected' : ''}>22</option>
                            <option value="26" ${ColorMatchingSolverSettingsGlobal.fontSize === 26 ? 'selected' : ''}>26</option>
                            <option value="30" ${ColorMatchingSolverSettingsGlobal.fontSize === 30 ? 'selected' : ''}>30</option>
                            <option value="36" ${ColorMatchingSolverSettingsGlobal.fontSize === 36 ? 'selected' : ''}>36</option>
                            <option value="40" ${ColorMatchingSolverSettingsGlobal.fontSize === 40 ? 'selected' : ''}>40</option>
                        </select> </label>

                        <label for="gradients" class="checkbox icon-plus">Gradient: <select name="gradients" id="gradients" style="padding: 0.5rem; font-weight: bold; border-radius: 0.5rem; background: white; color: black; border: none; float: right;">
                            ${optionsHTML}
                        </select> </label>

                    </div>
            `;

        const showLoginName = document.getElementById('showloginname');
        const loginName = document.getElementById('loginname');
        const accountstatus = document.getElementById('account-status');
        const showNumPieces = document.getElementById('shownumpieces');
        const numPieces = document.getElementById('numpieces');
        const numcolumns = document.getElementById('numcolumns');
        if (accountstatus) {
            loginName.value = accountstatus.title;
            showLoginName.style.display = (loginName.value!="") ? "flex" : "none";
        }

        let jCols = 0;
        let jRows = 0;
        let piecesCounter = 0;
        let bPiecesHidden=false;
        if (!creatorElem || !creatorElem.innerText) {
            bPiecesHidden= true;
            jCols = parseInt(numcolumns.value,10);
            jRows = parseInt(numPieces.value,10)/jCols;

        }
        else {
            const jDimensions = creatorElem.innerText.match(/(\d+)×(\d+)/);
            if (jDimensions) {
                jCols = parseInt(jDimensions[1]);
                jRows = parseInt(jDimensions[2]);
            } else {
                jCols = parseInt(numcolumns.value,10);
                jRows = parseInt(numPieces.value,10)/jCols;
                bPiecesHidden= true;
            }
        }

        if (numcolumns) {
            numcolumns.addEventListener('change', () => {
                jCols = parseInt(numcolumns.value,10);
                jRows = parseInt(numPieces.value,10)/jCols;
            });
        }

        showNumPieces.style.display = bPiecesHidden ? "flex" : "none";

        // Iterate over the keys of the gradientsArray object
        for (const gradientName in gradientsArray) {
            // Check if the current property is a direct property of the object and not inherited
            if (gradientsArray.hasOwnProperty(gradientName)) {
                // Create an option element with the gradient name as the value and label
                optionsHTML += `<option value="${gradientName}" ${ColorMatchingSolverSettingsGlobal.gradient === gradientName ? 'selected' : ''}>${gradientName}</option>`;
            }
        }

        let jC;;
        let bFirstImage;
        let firstColorRect;
        let bAbort = false;
        let bRunning=false;



        function walkToCenter(canvas, colorx, ret) {
            const ctx = canvas.getContext("2d");
            const { width, height } = canvas;
            const imageData = ctx.getImageData(0, 0, width, height);
            const pixels = imageData.data; // Use Uint32Array for fast access

            function getPixelIndex(x, y) {
                return ((y * width + x)*4);
            }

            let targetColor = jColors[colorx]; // Get color from global table

            let { x, y } = ret;
            let steps = 0;
            let maxSteps = Math.min(10, firstColorRect.width * $forcefactor) // To avoid break detect neighbor when there is an extreme zoom out.

            while (steps < maxSteps) {
                if (x + 1 >= width || y + 1 >= height) break; // Stop if out of bounds

                let idx = getPixelIndex(x + 1, y + 1);
                if (rgbToHex(pixels.slice(idx, idx + 3)) !== targetColor) break; // Stop if color changes

                x++;
                y++;
                steps++;
            }

            return { x, y };
        }

         // Find the piece and move it into the right area, based on upper right corner (hope it hasn't moved)
         // Once moved, find the center and try to align it correctly
        async function moveBlock(colorx, lastloc) {
            if (!mycanvas) {
                console.error("Target element not found.");
                return;
            }

            // Calculate the grid position (row, column) for the block
            const col = colorx % jCols;
            const row = Math.floor(colorx / jCols) % jRows;

            // Find the color block within the target element
            let ret = findColorBlock(mycanvas, jColors[colorx], lastloc);
            if (ret === null) {
                if ($verboselevel > 2) console.log(`Cell: ${colorx} not found, probably of screen`);
                return;
            }

            // Move the block to the center
            ret = walkToCenter(mycanvas, colorx, ret);
            if ($verboselevel > 4) console.log(`Cell grab1: ${colorx} (${ret.x}, ${ret.y})`);

            // Optional debug visualization
            if (($drawlevel & 8) == 8) {drawRect(mycanvas,"purple",ret.x - 10, ret.y - 10, 5);}

            // Convert positions from canvas to screen coordinates
            let canvaspos = convertCanvasPosToScreenPos(mycanvas, ret.x, ret.y);
            let newx = col * firstColorRect.width + firstColorRect.x;
            let newy = row * firstColorRect.height + firstColorRect.y;
            let targetret = convertCanvasPosToScreenPos(mycanvas, newx, newy);

            if ($verboselevel > 2) console.log(`Color: ${colorx} Update point to (${newx}, ${newy})`);

            await sleep($delay1);

            // Move the block to its new position
            if (($movestop & 1)!=1) {
                await simulateDrag(mycanvas, canvaspos.x, canvaspos.y, targetret.x, targetret.y, 5);
            }

            // Re-find the block in its new location
            ret = findColorBlock(mycanvas, jColors[colorx], { x: newx, y: newy });
            if (ret === null) {
                if ($verboselevel > 1) console.log(`Cell: ${colorx} not found after move`);
                return;
            }

            if ($verboselevel > 2) console.log(`Cell grab2: ${colorx}, (${ret.x} ${ret.y})`);

            // Optional debug visualization
            if (($drawlevel & 2) == 2) {drawRect(mycanvas,"pink",ret.x - 10, ret.y - 10, 5);}

            // Determine the bounding rectangle of the block
            let boundrect = getBoundingRectangle(mycanvas, ret.x, ret.y, jColors[colorx]);
            if ($verboselevel > 6) console.log(`Bounding: ${colorx} From ${boundrect.x} ${boundrect.y} H/W ${boundrect.width} ${boundrect.height} Center: ${boundrect.center.x} ${boundrect.center.y}`);

            // Optional debug visualization
            if (($drawlevel &  16) == 16) {drawRect(mycanvas,"black",boundrect.x, boundrect.y, boundrect.width, boundrect.height);}

            await sleep($delay2);

            if (colorx === 0) {
                // Mark the position of the first block (0,0)
                firstColorRect = boundrect;
                if ($verboselevel > 5) console.log(`First cell: ${firstColorRect.x} ${firstColorRect.y} ${firstColorRect.center.x} ${firstColorRect.center.y} ${firstColorRect.width} ${firstColorRect.height}`);
            } else {
                // Adjust based on visibility of the piece
                if (boundrect.isCenterOK) {
                    ret = boundrect.center;
                }

                // Convert positions for final alignment
                canvaspos = convertCanvasPosToScreenPos(mycanvas, ret.x, ret.y);
                newx = col * firstColorRect.width + firstColorRect.center.x - boundrect.center.x + ret.x;
                newy = row * firstColorRect.height + firstColorRect.center.y - boundrect.center.y + ret.y;
                targetret = convertCanvasPosToScreenPos(mycanvas, newx, newy);

                if ($verboselevel>2) console.log(`Color: ${colorx} Update center to (${newx}, ${newy})`);

                // Move the block to its final position
                if (($movestop & 4)!=4) {
                    await simulateDrag(mycanvas, canvaspos.x, canvaspos.y, targetret.x, targetret.y, 2);
                }
            }
        }


    //**********************************
    // GO Function
    //**********************************

        ColorMatchingGo.addEventListener('click', async () => {
            if (!bRunning) {
                DeactivateButtons();
                if ($verboselevel > 0) {console.log(`Starting Go`);}
                firstColorRect = {x:50, y:80, center: {x: 200, y:200}, width:150, height:180};
                await moveBlock (0);
                for (let colorx = 1; colorx < piecesCounter ;colorx++) {
                    if (!bAbort) {
                        await makePieceFit (colorx);
                        if (colorx >= $limitpieces) {break;}
                        await sleep(1);
                    }
                }
                if ($verboselevel > 0) {console.log(`Ending Go`);}
                ActivateButtons();
            } else {
                bAbort=true;
                if ($verboselevel > 0) {console.log(`Aborted`);}
            }
        });

        ActivateButtons();



        function DeactivateButtons() {
            bRunning=true;
            ColorMatchingGo.style.color = "Red";
            ColorMatchingGo.innerText = "stop";


        }
        function ActivateButtons() {
            bRunning=false;
            ColorMatchingGo.style.color = "Green";
            ColorMatchingGo.innerText = "Go!";
            bAbort = false;
        }

        // Check whether the piece is connected to the left and up
        // Check the block and at least 90% should not have another color, that allows for errors in the bounding block calculation to include an unexpected neightbor
        function IsMissingNeighbour(canvas, colorx, boundrect) {
                    const ctx = canvas.getContext("2d");
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;


            function getPixelIndex(x, y) {
                return (y * canvasWidth + x) * 4;
            }

            function getPixelColor(x, y) {
                const idx = getPixelIndex(x, y);
                return rgbToHex(pixels.slice(idx, idx + 3));
            }

            let upColor = colorx - jCols;
            let leftColor = colorx -1 ;
            if (colorx % jCols != 0) { // We need a left neighbour
               let dim=0;

               while (dim < boundrect.height*0.40) {
                   dim++;
                   let x = boundrect.x;
                   let y = boundrect.y+dim;
                   let pixColor = getPixelColor (x,y);
                   if (pixColor == BKCOLOR) {return true;}
                   let fi = jColors.indexOf(pixColor);
                   if (fi >=0) {
                       if (fi != colorx && fi != leftColor && fi!=upColor) {
                           return true;
                       }
                   }
                   x = boundrect.center.x-dim;
                   y = boundrect.center.y;
                   pixColor = getPixelColor (x,y);
                   if (pixColor == BKCOLOR) {return true;}
                   fi = jColors.indexOf(pixColor);
                   if (fi >=0) {
                       if (fi != colorx) {
                           if (fi != leftColor && fi!=upColor) {
                               return true;
                           } else
                           {break;}
                       }
                   }
               }
            }
            if (colorx >= jCols) { // We need a upper neighbour
                let dim=0;

               while (dim < boundrect.width*0.40) {
                   dim++;
                   let x = boundrect.x+dim;
                   let y = boundrect.y;
                   let pixColor = getPixelColor (x,y);
                   if (pixColor == BKCOLOR) {return true;}
                   let fi = jColors.indexOf(pixColor);
                   if (fi >=0) {
                       if (fi != colorx && fi != leftColor && fi!=upColor) {
                           return true;
                       }
                   }
                   x = boundrect.center.x;
                   y = boundrect.center.y-dim;
                   pixColor = getPixelColor (x,y);
                   if (pixColor == BKCOLOR) {return true;}
                   fi = jColors.indexOf(pixColor);
                   if (fi >=0) {
                       if (fi != colorx) {
                           if (fi != leftColor && fi!=upColor) {
                               return true;
                           } else
                           {break;}
                       }
                   }
               }
            }
            return (false);
        }


        function isPieceAtRightSpot(targetColor) {
            const ctx = mycanvas.getContext("2d");
            const width = mycanvas.width;
            const height = mycanvas.height;
            const imageData = ctx.getImageData(0, 0, width, height).data;
            let lastIndex = width * height *4;
            const col = targetColor % jCols;
            const row = Math.floor(targetColor / jCols) % jRows;
            const lastLocation = {x:(col)*firstColorRect.width+firstColorRect.center.x, y:(row)*firstColorRect.height+firstColorRect.center.y};

            if (($drawlevel & 32) == 32) {drawRect(mycanvas,"blue",lastLocation.x, lastLocation.y, 4);}

            // Convert target color to RGBA
            const targetRGBA = hexToRgb(jColors[targetColor]);
            const tR = targetRGBA[0], tG = targetRGBA[1], tB = targetRGBA[2], tA = targetRGBA[3];


            let startIndex = (lastLocation.y * width + lastLocation.x-2) * 4;
            for (let i = 0; i < 4; i++) {
                if (
                    imageData[startIndex+i*4] === tR &&
                    imageData[startIndex+i*4 + 1] === tG &&
                    imageData[startIndex+i*4 + 2] === tB) {
                    return (lastLocation);
                } else {
                    if(($drawlevel & 4) == 4) {drawRect(mycanvas,"black",lastLocation.x-2,lastLocation.y-2,4);}
                }
            }
            return (null);
        }

                //Check if the pixel has the color we expected
        async function makePieceFit(targetColor) {
            let lastLocation = isPieceAtRightSpot(targetColor);
            if (!lastLocation) {
                const col = targetColor % jCols;
                const row = Math.floor(targetColor / jCols) % jRows;
                const ret = {x:col*firstColorRect.width+firstColorRect.x, y:row*firstColorRect.height+firstColorRect.y};
                if (($movestop & 2)!=2) {
                    await moveBlock (targetColor, ret);
                }
            }
        }


        var fontSize = GM_getValue('ColorMatchingSolverSettingsGlobal', ColorMatchingSolverSettingsGlobal).fontSize;
        const showNumbers = document.getElementById('show-numbers');
        if (showNumbers) {
            ColorMatchingGo.style.display = showNumbers.checked ? "none" : "block";
            showNumbers.addEventListener('change', () => {
                showNumbers.parentElement.querySelector('i').style.background = showNumbers.checked ? 'green' : 'firebrick';
                // Store the new value
                ColorMatchingSolverSettingsGlobal.showNumbers = showNumbers.checked;
                ColorMatchingGo.style.display = showNumbers.checked ? "none" : "block";
                GM_setValue('ColorMatchingSolverSettingsGlobal', ColorMatchingSolverSettingsGlobal);
                window.location.reload();
            });
        }



        // Check which gradient to use
        const gradient = document.getElementById('gradients');
        if (gradient) {
            gradient.addEventListener('change', () => {
                // Store the new value
                ColorMatchingSolverSettingsGlobal.gradient = gradient.value;
                GM_setValue('ColorMatchingSolverSettingsGlobal', ColorMatchingSolverSettingsGlobal);
                window.location.reload();
            });
        }

        // Check which font size to use
        const fontSizeSelect = document.getElementById('font-size');
        if (fontSizeSelect) {
            fontSizeSelect.addEventListener('change', () => {
                // Store the new value
                ColorMatchingSolverSettingsGlobal.fontSize = parseInt(fontSizeSelect.value);
                ColorMatchingSolverSettingsGlobal.showNumbers = true;
                ColorMatchingGo.style.display ="none";
                GM_setValue('ColorMatchingSolverSettingsGlobal', ColorMatchingSolverSettingsGlobal);
                window.location.reload();
            })
            // Check whether to show numbers
            if (!ColorMatchingSolverSettingsGlobal.showNumbers) {
                fontSize = 0;
            }
        }


        const restartButton = document.getElementById('restart');
        if (restartButton) {
            restartButton.addEventListener('click', () => {
                resetAfterLoad();
            });
        }


        let spectrum;
        let jColors;

        function resetAfterLoad() {
            jC = 0;
            bFirstImage = jCols * jRows;
            bAbort = false;
            piecesCounter = 0;
            initSpectrum();
        }
        resetAfterLoad();

        function initSpectrum() {
            spectrum = generateSpectrum(jRows * jCols, gradientsArray[ColorMatchingSolverSettingsGlobal.gradient]);
            jColors = spectrum.map(color => `${color}`);
        }




            // Override putImageData with a manipulated version for THIS page load

            CanvasRenderingContext2D.prototype.putImageData = function (imageData, dx, dy) {
                if (jC == jCols * jRows) {jC = 0;}
                const targetCol = parseInt(ColorMatchingSolverSettings.col);
                const col = jC % jCols;
                const row = Math.floor(jC / jCols) % jRows;
                this.globalAlpha = 100;;

                // Target column: color and number multiple times
                this.fillStyle = jColors[jC];

                this.fillRect(-1000, -1000, 2000, 2000);

                // Font size and text
                this.font = `bold ${fontSize}px sans-serif`;
                const text = `${row + 1}-${col + 1}    `.repeat(100);
                const x = -100;
                this.fillStyle = 'black'; // Outline color
                // Linewidth based on font size
                this.lineWidth = fontSize / 4;
                //this.lineWidth = 7; // Adjust the thickness of the outline

                // Draw the outline text with a thicker stroke
                this.strokeStyle = 'black'; // Set the stroke color
                this.strokeText(text, x, 0); // Draw the outline text at the top

                // Draw the inner text in white
                this.fillStyle = 'white'; // Inner color
                this.fillText(text, x, 0); // Draw the text in white at the top

                // Draw the text in multiple rows
                for (let i = -100; i <= 100; i++) {
                    const y = i * (fontSize * 1.5); // Adjust the spacing between rows
                    this.strokeText(text, x, y); // Outline
                    this.fillText(text, x, y); // Fill
                }

                jC++;
            }

            // Prevent the original image to be drawn on top of the puzzle pieces
            const originalDrawImage= CanvasRenderingContext2D.prototype.drawImage;
            CanvasRenderingContext2D.prototype.drawImage = function (img, dx, dy) {
                if (img instanceof HTMLCanvasElement) {
                    originalDrawImage.call(this,img,dx,dy);
                } else if (img instanceof HTMLImageElement) {
                    if (bFirstImage >0) {
                        bFirstImage--;
                        piecesCounter++;
                        numPieces.value = piecesCounter;
                        return;
                    } else {
                        originalDrawImage.call(this,img,dx,dy);
                        bAbort=true;
                        if ($verboselevel > 0) {console.log(`Game over`);}
                    }
                }
            }
        });

})();