// ==UserScript==
// @name        Jigidi Bingo Solver
// @namespace   to.soon.userjs.jigidi
// @match       https://www.jigidi.com/solve*
// @match       https://www.jigidi.com/s/*
// @match       https://www.jigidi.com/*/solve*
// @match       https://www.jigidi.com/*/s/*
// @grant       GM_getValue
// @grant       GM_setValue
// @version     1.6
// @author      Fox <https://github.com/f-o>
// @description Script to help solve Jigidi puzzles, by rendering columns in a colourful grid gradient, and marking each piece with numbers.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522009/Jigidi%20Bingo%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/522009/Jigidi%20Bingo%20Solver.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Custom Gradients array:
    var gradientsArray = {
        "Rainbow": ['#FF0000', '#FFFF00', '#00FF00', '#0000FF'],
        "Distinct": ['#191970', '#006400', '#ff0000', '#00ff00', '#00ffff', '#ff00ff', '#ffb6c1'],
        "Rastafari": ['#1E9600', "#FFF200", "#FF0000"],
        "Sublime Vivid": ['#FC466B', "#3F5EFB"],
        "DanQ": ['#FF0000', '#EE82EE'],
        "Instagram": ['#833ab4', "#fd1d1d", "#fcb045"],
        "Hacker": ['#ff0000', "#000000", "#00ff11", "#000000", "#0077ff"]
    }

    const $verbose = false;

    function generateSpectrum(rows, colors) {
        if (!Array.isArray(colors) || colors.length < 2) {
            throw new Error('Colors array must have at least two colors.');
        }

        const spectrum = [];
        const numColors = colors.length - 1; // Number of gradients between colors
        const increment = numColors / (rows - 1); // Increment between adjacent rows

        for (let i = 0; i < rows; i++) {
            const colorIndex = Math.floor(i * increment); // Index of the color gradient
            const startColor = colors[colorIndex]; // Start color of the gradient
            const endColor = colors[Math.min(colorIndex + 1, colors.length - 1)]; // End color of the gradient
            const t = (i * increment) % 1; // Interpolation parameter
            spectrum.push(interpolateColors(startColor, endColor, t)); // Interpolate color
        }

        return spectrum;
    }

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

    // Wait for page to load
    window.addEventListener('load', function () {

        // Get puzzle name from URL
        const puzzleNameMatch = window.location.href.match(/solve\/(\w+)\/([\w-]+)/);

        // If URL ends with "solve.php", get the puzzle ID from a tag under h1.puzzle-title and redirect
        if (window.location.href.endsWith('solve.php')) {
            const puzzleId = document.querySelector('h1.puzzle-title').querySelector('a').href;
            window.location.href = puzzleId.replace('https://www.jigidi.com/jigsaw-puzzle/', 'https://www.jigidi.com/solve/');
        }
        // If URL contains "/s/", get the puzzle ID from share-url and redirect
        else if (window.location.href.includes('/s/') || !puzzleNameMatch) {
            // Loop through all script tags and find the one containing "ShareEmbed.url"
            for (const script of document.querySelectorAll('script')) {
                if (script.innerText.includes('ShareEmbed.url')) {
                    const puzzleId = script.innerText.match(/ShareEmbed.url = "(.+)";/)[1];
                    window.location.href = puzzleId;
                    break;
                }
            }
        }

        // Prepare Bingo Solver UI
        const JigidiBingoSolver = document.createElement('div');
        JigidiBingoSolver.id = 'jigidi-bingo-solver';

        // Inject Bingo Solver UI after the tool info panel
        const creatorElem = document.getElementById('tool-info-panel');
        creatorElem.after(JigidiBingoSolver);

        // Cleanup the page
        const elementWithAds = document.querySelector('.show-ad');
        if (elementWithAds) {
            elementWithAds.classList.remove('show-ad');
            if ($verbose) {
                console.log('Removed element with class "show-ad".');
            }
        }

        // Get the canvas element
        const canvas = document.querySelector('canvas');
        if (!canvas) {
            if ($verbose) {
                console.log('Canvas not found.');
            }
            // Sleep for 2 seconds and try again
            setTimeout(() => { window.location.reload(); }, 2000);
            return;
        }

        // Global settings
        const bingoSolverSettingsGlobal = GM_getValue('bingoSolverSettingsGlobal', {
            showNumbers: true,
            showColours: true,
            showColoursBy: 'length',
            gradient: 'Rainbow',
            fontSize: 26
        });
        // Unique jigsaw ID settings
        const jigsawId = window.location.href.match(/solve\/(\w+)\//)[1];
        const bingoSolverSettings = GM_getValue(`bingoSolverSettings_${jigsawId}`, { col: 1 });

        // Log settings
        if ($verbose) {
            console.log(`Bingo Solver: jigsawId=${jigsawId}`);
            console.log(`Bingo Solver: bingoSolverSettingsGlobal=${JSON.stringify(bingoSolverSettingsGlobal)}`);
            console.log(`Bingo Solver: bingoSolverSettings=${JSON.stringify(bingoSolverSettings)}`);
        }

        const jDimensions = creatorElem.innerText.match(/(\d+)×(\d+)/);
        const jCols = parseInt(jDimensions[1]);
        const jRows = parseInt(jDimensions[2]);
        if ($verbose) {
            console.log(`Bingo Solver: jCols=${jCols} jRows=${jRows}`);
        }
        // Initialize an empty string to store the HTML options
        let optionsHTML = '';

        // Iterate over the keys of the gradientsArray object
        for (const gradientName in gradientsArray) {
            // Check if the current property is a direct property of the object and not inherited
            if (gradientsArray.hasOwnProperty(gradientName)) {
                // Create an option element with the gradient name as the value and label
                optionsHTML += `<option value="${gradientName}" ${bingoSolverSettingsGlobal.gradient === gradientName ? 'selected' : ''}>${gradientName}</option>`;
            }
        }
        JigidiBingoSolver.innerHTML = `
                <hr>
                <div class="hide-complete" style="margin-bottom:2rem;">
                    <strong>Bingo Solver</strong><br>
                    <p>Help with column? (0 to disable)</p>
                    <div class="panel-tool " style="display: flex; justify-content: space-between; gap: 1rem;" id="animated-border">
                        <input type="number" id="magicStripesCol" value="${bingoSolverSettings.col}" min="0" max="${jCols}" style="width: 25%; \
                                                                                                                                    text-align: center !important; \
                                                                                                                                    padding: 0.5rem; \
                                                                                                                                    font-size: 2rem; \
                                                                                                                                    font-weight: bold; \
                                                                                                                                    border-radius: 0.5rem; \
                                                                                                                                    background: white; \
                                                                                                                                    color: black; \
                                                                                                                                    border: none;">                                                                                                     
                        <button title="Go!" class="btn em" id="magicStripesGo" style="width: 25%;"><span style="font-size: 2rem; font-weight: bold; cursor: pointer;">Go!</span></button>
                        <div title="Go +1!" class="btn em" id="magicStripesPlusOne" style="width: 50%;"><span style="font-size: 2rem; font-weight: bold; cursor: pointer;">Go +1!</span></div>

                    </div>

                    <div id="tool-settings-panel" class="panel-tool">
                        <label class="checkbox icon-plus">Show numbers on pieces <input type="checkbox" id="show-numbers" ${bingoSolverSettingsGlobal.showNumbers ? 'checked' : ''}><i style="${bingoSolverSettingsGlobal.showNumbers ? 'background: green;' : 'background: firebrick;'}"></i></label>
                        
                        <label for="font-size" class="checkbox icon-plus">Font size: <select name="font-size" id="font-size" style="padding: 0.5rem; font-weight: bold; border-radius: 0.5rem; background: white; color: black; border: none; float: right;">
                            <option value="12" ${bingoSolverSettingsGlobal.fontSize === 12 ? 'selected' : ''}>12</option>
                            <option value="16" ${bingoSolverSettingsGlobal.fontSize === 16 ? 'selected' : ''}>16</option>
                            <option value="22" ${bingoSolverSettingsGlobal.fontSize === 22 ? 'selected' : ''}>22</option>
                            <option value="26" ${bingoSolverSettingsGlobal.fontSize === 26 ? 'selected' : ''}>26</option>
                            <option value="30" ${bingoSolverSettingsGlobal.fontSize === 30 ? 'selected' : ''}>30</option>
                            <option value="36" ${bingoSolverSettingsGlobal.fontSize === 36 ? 'selected' : ''}>36</option>
                            <option value="40" ${bingoSolverSettingsGlobal.fontSize === 40 ? 'selected' : ''}>40</option>
                        </select> </label>

                        <label for="gradients" class="checkbox icon-plus">Gradient: <select name="gradients" id="gradients" style="padding: 0.5rem; font-weight: bold; border-radius: 0.5rem; background: white; color: black; border: none; float: right;">
                            ${optionsHTML}
                        </select> </label>
                        
                    </div>
                </div>
                <hr>
            `;

        const magicStripesCol = document.getElementById('magicStripesCol');
        const magicStripesGo = document.getElementById('magicStripesGo');
        magicStripesGo.addEventListener('click', () => {
            bingoSolverSettings.col = parseInt(magicStripesCol.value);
            GM_setValue(`bingoSolverSettings_${jigsawId}`, bingoSolverSettings);
            window.location.reload();
        });
        document.getElementById('magicStripesPlusOne').addEventListener('click', () => {
            magicStripesCol.value = (parseInt(magicStripesCol.value) + 1) % (jCols + 1);
            magicStripesGo.dispatchEvent(new Event('click'));
        });

        var fontSize = GM_getValue('bingoSolverSettingsGlobal', bingoSolverSettingsGlobal).fontSize;

        // Check whether to show numbers
        const showNumbers = document.getElementById('show-numbers');
        showNumbers.addEventListener('change', () => {
            if ($verbose) {
                console.log(`Bingo Solver: showNumbers=${showNumbers.checked}`);
            }
            showNumbers.parentElement.querySelector('i').style.background = showNumbers.checked ? 'green' : 'firebrick';
            // Store the new value
            bingoSolverSettingsGlobal.showNumbers = showNumbers.checked;
            GM_setValue('bingoSolverSettingsGlobal', bingoSolverSettingsGlobal);
            window.location.reload();
        })

        // Check which gradient to use
        const gradient = document.getElementById('gradients');
        gradient.addEventListener('change', () => {
            if ($verbose) {
                console.log(`Bingo Solver: gradient=${gradient.value}`);
            }
            // Store the new value
            bingoSolverSettingsGlobal.gradient = gradient.value;
            GM_setValue('bingoSolverSettingsGlobal', bingoSolverSettingsGlobal);
            window.location.reload();
        })

        // Check which font size to use
        const fontSizeSelect = document.getElementById('font-size');
        fontSizeSelect.addEventListener('change', () => {
            if ($verbose) {
                console.log(`Bingo Solver: fontSize=${fontSizeSelect.value}`);
            }
            // Store the new value
            bingoSolverSettingsGlobal.fontSize = parseInt(fontSizeSelect.value);
            bingoSolverSettingsGlobal.showNumbers = true;
            GM_setValue('bingoSolverSettingsGlobal', bingoSolverSettingsGlobal);
            window.location.reload();
        })
        // Check whether to show numbers
        if (!bingoSolverSettingsGlobal.showNumbers) {
            fontSize = 0;
        }

        // Generate spectrum to use
        if ($verbose) {
            console.log(`Bingo Solver: colors=${JSON.stringify(gradientsArray[bingoSolverSettingsGlobal.gradient])}`);
        }
        const spectrum = generateSpectrum(jRows, gradientsArray[bingoSolverSettingsGlobal.gradient]);
        if ($verbose) {
            console.log(spectrum);
        }

        const jColors = spectrum.map(color => `${color}`);
        let jC = 0;

        const targetCol = parseInt(bingoSolverSettings.col);
        if (targetCol > 0) {
            // Override putImageData with a manipulated version for THIS page load
            CanvasRenderingContext2D.prototype.putImageData = function (imageData, dx, dy) {
                const targetCol = parseInt(bingoSolverSettings.col);
                const col = jC % jCols;
                const row = Math.floor(jC / jCols);
                if ((col + 1) === targetCol) {
                    // Target column: color and number multiple times
                    this.fillStyle = jColors[row];
                    if ($verbose) {
                        console.log("Column", col, "Row", row + 1, "Color", "https://www.color-hex.com/color/" + jColors[row % jColors.length].replace('#', ''));
                    }
                    this.fillRect(-1000, -1000, 2000, 2000);

                    // Font size and text
                    this.font = `bold ${fontSize}px sans-serif`;
                    const text = `${row + 1}  `.repeat(100);
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
                        const y = i * (fontSize * 1.2); // Adjust the spacing between rows
                        this.strokeText(text, x, y); // Outline
                        this.fillText(text, x, y); // Fill
                    }

                }
                else if ((col + 2) === targetCol) {
                    // Previous column: lightly color and number once
                    this.fillStyle = jColors[row % jColors.length];
                    this.fillRect(-1000, -1000, 2000, 2000);
                    // Fill with semi-transparent white
                    this.fillStyle = '#ffffffbb';
                    this.fillRect(-1000, -1000, 2000, 2000);

                    this.font = `bold ${fontSize}px sans-serif`;
                    this.fillStyle = 'black';

                    // Write in center, taking into account the size of the number
                    if (row < 10) {
                        this.fillText(`${row + 1}`, 0, 0);
                    }
                    else {
                        var textWidth = this.measureText(`${row}`).width;
                        this.fillText(`${row + 1}`, -textWidth / 2, 0);
                    }
                }
                else {
                    // Other columns: white-out
                    this.fillStyle = '#ffffff';
                    this.fillRect(-1000, -1000, 2000, 2000);
                }
                jC++;
            }
        }
    });

})();

