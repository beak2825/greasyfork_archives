// ==UserScript==
// @name         Order Blocker
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Blocks limit order values
// @author       Tiqur
// @match        https://www.bitget.com/en/mix/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bitget.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455549/Order%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/455549/Order%20Blocker.meta.js
// ==/UserScript==

function deltaE(rgbA, rgbB) {
  let labA = rgb2lab(rgbA);
  let labB = rgb2lab(rgbB);
  let deltaL = labA[0] - labB[0];
  let deltaA = labA[1] - labB[1];
  let deltaB = labA[2] - labB[2];
  let c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
  let c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
  let deltaC = c1 - c2;
  let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
  deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
  let sc = 1.0 + 0.045 * c1;
  let sh = 1.0 + 0.015 * c1;
  let deltaLKlsl = deltaL / (1.0);
  let deltaCkcsc = deltaC / (sc);
  let deltaHkhsh = deltaH / (sh);
  let i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
  return i < 0 ? 0 : Math.sqrt(i);
}

function rgb2lab(rgb){
  let r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255, x, y, z;
  r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
  x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
  z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
  x = (x > 0.008856) ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
  y = (y > 0.008856) ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
  z = (z > 0.008856) ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;
  return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)]
}

function getRGB(data, width, x, y) {
    const pos = (width * y + x) * 4;
    let rgb = [data[pos], data[pos+1], data[pos+2]];
    return rgb;
}


(function() {
    console.debug('loading....')
    const iframe = document.querySelector('[title="Financial Chart"]');


    setTimeout(() => {
        console.debug('finding')
        const canvasContainer = window.top
        .document.querySelector('iframe')
        .contentDocument.querySelector('[data-name="pane-widget-chart-gui-wrapper"]');
        const canvas = canvasContainer.children[0];
        const ctx = canvas.getContext("2d");
        const height = canvas.getBoundingClientRect().height;
        const width = canvas.getBoundingClientRect().width;

        setInterval(() => {
            // Copy canvas pixel data
            const data = ctx.getImageData(0, 0, width, height).data;

            let blinders = [];

            // Process canvas pixel data
            for (let y = 0; y < height; y++) {

                // If found price line color
                if (deltaE(getRGB(data, width, width-1, y), [241, 73, 63]) < 2 || deltaE(getRGB(data, width, width-1, y), [29, 162, 180]) < 2 ) {
                    let lineColor = deltaE(getRGB(data, width, width-1, y), [241, 73, 63]) < 2 ? [241, 73, 63] : [29, 162, 180];
                    let rightEnd = null;
                    let divHeight = 20;
                    let divWidth = null;
                    let validPriceLine = false;


                    // This is shit code, oh well

                    // Iterate horizontally until it finds gap
                    for (let x = width-1; x > 0; x--) {
                        if (deltaE(getRGB(data, width, x, y), lineColor) > 20) {
                            rightEnd = x;
                            validPriceLine = width-rightEnd > 50;
                            break;
                        }
                    }

                    // If not a valid price line ( a candle or something ), break
                    if (!validPriceLine) continue;

                    // Finds middle of X
                    for (let x = rightEnd; x > 0; x--) {
                        if (deltaE(getRGB(data, width, x, y), lineColor) < 2) {
                            rightEnd = x;
                            break;
                        }
                    }

                    // Finds end of red rect
                    for (let x = rightEnd-1; x > 0; x--) {
                        if (deltaE(getRGB(data, width, x, y), lineColor) < 2) {
                            rightEnd = x;
                            break;
                        }
                    }

                    // Finds start of red rect
                    for (let x = rightEnd-1; x > 0; x--) {
                        if (deltaE(getRGB(data, width, x, y), [255, 255, 255]) > 90) {
                            divWidth = rightEnd - x;
                            break;
                        }
                    }

                    // Append to array
                    blinders.push({width: divWidth, height: divHeight, top: y-divHeight/2, left: rightEnd-divWidth+1, color: `rgb(${lineColor[0]},${lineColor[1]},${lineColor[2]})`})
                }

            }
            // Remove unused blinders
            [].slice.call(window.top
                          .document.querySelector('iframe')
                          .contentDocument.querySelectorAll('[id*="blinderDiv"]')
                         ).forEach(e => {
                if (+e.id.replace(/\D/g, "") > blinders.length-1)
                    e.remove();
            })

            blinders.forEach((blinder, i) => {


                // Create blinder div if needed
                if (window.top.document.querySelector('iframe').contentDocument.querySelector(`[id="blinderDiv${i}"]`) === null) {
                    const div = document.createElement("div");
                    div.id = `blinderDiv${i}`;
                    canvasContainer.appendChild(div);
                }

                // Style and move blinder div
                const t = canvasContainer.querySelector(`[id="blinderDiv${i}"]`)
                t.style.position = 'absolute';
                t.style.background = blinder.color;
                t.style.width = `${blinder.width}px`;
                t.style.height = `${blinder.height}px`;
                t.style.top = `${blinder.top}px`;
                t.style.left = `${blinder.left}px`;
            })
        }, 50)

    }, 2000)
})();