// ==UserScript==
// @name         北科入口網站 - 自動填寫驗證碼
// @namespace    http://tampermonkey.net/
// @version      2024-12-26 v2
// @description  登入介面中自動填寫驗證碼
// @author       umeow
// @match        https://nportal.ntut.edu.tw/index.do*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu.tw
// @connect      istream.ntut.edu.tw
// @run-at       document-end
// @require      https://cdnjs.cloudflare.com/ajax/libs/mathjs/14.0.1/math.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521693/%E5%8C%97%E7%A7%91%E5%85%A5%E5%8F%A3%E7%B6%B2%E7%AB%99%20-%20%E8%87%AA%E5%8B%95%E5%A1%AB%E5%AF%AB%E9%A9%97%E8%AD%89%E7%A2%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/521693/%E5%8C%97%E7%A7%91%E5%85%A5%E5%8F%A3%E7%B6%B2%E7%AB%99%20-%20%E8%87%AA%E5%8B%95%E5%A1%AB%E5%AF%AB%E9%A9%97%E8%AD%89%E7%A2%BC.meta.js
// ==/UserScript==

let model = undefined;
const img = document.getElementById("authImage");

async function getModel() {
    let text = localStorage.getItem('ntut.edu.tw_model_weight.json');

    if(text === null) {
        const res = await fetch('https://gistcdn.githack.com/umeow0716/d2f9ff8c5d060eeb0bdb86985cd328d8/raw/df1bac93ceb0d85eb2e4234a34b298d800f512a6/ntut.edu.tw_model_weight.json');
        text = await res.text();
        localStorage.setItem('ntut.edu.tw_model_weight.json', text);
    }

    model = JSON.parse(text);
}

function dotProduct(arr1, arr2) {
    if (arr1[0].length !== arr2.length) {
        throw new Error("Matrix dimensions do not align for dot product");
    }

    const result = Array.from({ length: arr1.length }, () => new Array(arr2[0].length).fill(0))
    for (let i = 0; i < arr1.length; i++) {
        const row = [];
        for (let j = 0; j < arr2[0].length; j++) {
            for (let k = 0; k < arr2.length; k++) {
                result[i][j] += arr1[i][k] * arr2[k][j];
            }
        }
    }
    return result;
}
function applyFunction(arr, func) {
    return arr.map(element =>
        Array.isArray(element) ? applyFunction(element, func) : func(element)
    );
}
function ELU(x) {
    if(x >= 0.0) {
        return x;
    }
    return 1.2 * (Math.exp(x) - 1);
}
function ReLU(x) {
    return Math.max(x, 0);
}
function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}
function findChar(arr) {
    const maxValue = Math.max(...arr);
    const maxIndex = arr.indexOf(maxValue);
    return String.fromCharCode(65 + maxIndex);
}
function transpose(matrix) {
    if (!Array.isArray(matrix) || !Array.isArray(matrix[0])) {
        throw new Error("Input must be a 2D array");
    }
    const rows = matrix.length;
    const cols = matrix[0].length;
    const transposed = Array.from({ length: cols }, () => new Array(rows));

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            transposed[j][i] = matrix[i][j];
        }
    }
    return transposed;
}

function forward(x) {
    const layer_1_output = applyFunction(math.add(dotProduct(model.layer_1_weight, x), model.layer_1_bias), ELU);
    const layer_2_output = applyFunction(math.add(dotProduct(model.layer_2_weight, layer_1_output), model.layer_2_bias), ReLU);
    const layer_3_output = applyFunction(math.add(dotProduct(model.layer_3_weight, layer_2_output), model.layer_3_bias), sigmoid);
    let result = ''
    for(let i = 0 ; i < 4 ; i++) {
    result += findChar(layer_3_output.map(arr => arr[i]));
    }
    return result;
}

function normalize(matrix) {
    const h = matrix.length;
    const w = matrix[0].length;

    const dHeight = 40 - h;
    const dWidth = 40 - w;

    if(dHeight < 0 || dWidth < 0) {
        throw new Error("Input must smaller than 40x40");
    }

    const padTop = Math.floor(dHeight / 2);
    const padLeft = Math.floor(dWidth / 2);

    // Create new padded matrix
    const padded = Array.from({ length: 40 }, () => Array(40).fill(0));

    // Copy the original matrix into the padded one
    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            padded[i + padTop][j + padLeft] = matrix[i][j];
        }
    }

    return padded;
}

function getImage() {
    // Create a canvas element
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // Set canvas dimensions to image dimensions
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw the image onto the canvas
    context.drawImage(img, 0, 0);

    // Extract pixel data
    const imageData = context.getImageData(0, 0, img.width, img.height);
    const data = imageData.data; // Array of RGBA values (one-dimensional)

    // Convert the flat array into a 2D array of RGB values
    const rgbArray = [];
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];     // Red
        const g = data[i + 1]; // Green
        const b = data[i + 2]; // Blue

        rgbArray.push([r, g, b]);
    }

    return {
        w: img.width,
        h: img.height,
        rgbArray: rgbArray,
    };
};

const run = async() => {
    const { w, h, rgbArray } = getImage();
    const colorSet = new Set();

    for (let i = 0; i < rgbArray.length; i += 4) {
        const r = rgbArray[i][0];
        const g = rgbArray[i][1];
        const b = rgbArray[i][2];

        colorSet.add(JSON.stringify([r, g, b]));
    }
    const colorList = Array.from(colorSet).map(item => JSON.parse(item));

    const originImage = [];
    for(let i = 0 ; i < h ; i++) {
        const row = []
        for(let j = 0 ; j < w ; j++) {
            row.push(rgbArray[i * w + j]);
        }
        originImage.push(row);
    }

    const posList = [];
    colorList.forEach((color, i) => {
        const xSet = new Set();
        const ySet = new Set();
        const posData = [[], []];
        for (let y = 0 ; y < h ; y++) {
            for (let x = 0 ; x < w; x++) {
                if (JSON.stringify(originImage[y][x]) === JSON.stringify(color)) {
                    xSet.add(x);
                    ySet.add(y);
                    posData[1].push(x);
                    posData[0].push(y);
                }
            }
        }
        posList.push([
            xSet,
            ySet,
            posData
        ]);
    });

    // Filter out background colors, dot colors, and text colors
    const backgroundList = [];
    const dotList = [];
    let textColorList = [];

    for(let i = 0 ; i < colorList.length ; i++) {
        if(posList[i][0].size > 40 || posList[i][0].size > 40) {
            backgroundList.push(colorList[i]);
            continue;
        }
        if(Math.min(...posList[i][1]) < 2 && Math.max(...posList[i][1]) > w-3) {
            backgroundList.push(colorList[i]);
            continue;
        }
        if(Math.min(...posList[i][0]) < 2 && Math.max(...posList[i][0]) > h-3) {
            backgroundList.push(colorList[i]);
            continue;
        }
        if((colorList[i][0] * 299 + colorList[i][1] * 587 + colorList[i][2] * 114 + 500) / 1000 > 150) {
            backgroundList.push(colorList[i]);
            continue;
        }

        if(posList[i][0].size < 5 || posList[i][0].size < 5) {
            dotList.push(colorList[i]);
            continue;
        }

        textColorList.push(i);
    }

    textColorList = textColorList.sort((a, b) => Math.min(...posList[a][0]) -  Math.min(...posList[b][0]));

    result = [];

    for(const i of textColorList) {
        const posData = posList[i][2];

        const xMin = Math.min(...posData[1]);
        const yMin = Math.min(...posData[0]);

        const xMax = Math.max(...posData[1]);
        const yMax = Math.max(...posData[0]);

        const genImage = Array.from({ length: yMax - yMin + 1 }, () => Array(xMax - xMin + 1).fill(0));

        for(let j = 0 ; j < posData[0].length ; j++) {
            genImage[posData[0][j]-yMin][posData[1][j]-xMin] = 1;
        }

        result.push(normalize(genImage));
    }

    const MLPInput = transpose(result.map(arr => arr.flat()));

    document.querySelector('#authcode').value = forward(MLPInput);
}

const main = async () => {
    let n = 5;
    await getModel();
    let done = false;
    setInterval(() => {
        if(!done && img.complete) {
            run();
            done = true;
        };
    }, 100);
}

document.querySelector('#authcode').value = "稍待片刻...";
main();