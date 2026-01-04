// ==UserScript==
// @name         BMO BOT
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  BMO
// @author       Bambi1
// @match        https://pixelplace.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixelplace.io
// @run-at       document-start
// @grant        none
 // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473056/BMO%20BOT.user.js
// @updateURL https://update.greasyfork.org/scripts/473056/BMO%20BOT.meta.js
// ==/UserScript==
let drawBMO = false;
var fillHeight = 70;
var fillWidth = 90;
var color = 28;
var lineLength = 5;
let chatting = false
let onOff = true;
function fix(a, b) {
    Object.defineProperty(window.console, a, { configurable: false, enumerable: true, writable: false, value: b });
}

fix('log', console.log);
fix('warn', console.warn);
fix('error', console.error);
fix('info', console.info);

const originalWebSocket = window.WebSocket;
var socket;

class WebSocketHook extends originalWebSocket {
    constructor(a, b) {
        super(a, b);
        socket = this;
    }
}

window.WebSocket = WebSocketHook;

document.addEventListener('DOMContentLoaded', () => {


document.addEventListener('keydown', function (event) {
    if (!chatting & onOff) {
        var coordinatesElement = document.getElementById('coordinates');
        var coordinatesValue = coordinatesElement.textContent;
        var [x, y] = coordinatesValue.split(',');
        x = parseInt(x);
        y = parseInt(y);

        switch (event.key) {
            case 'm':
                if (menuContainer.style.display === 'none') {
                    menuContainer.style.display = 'block';
                } else {
                    fillHeight = parseFloat(heightInput.querySelector('input').value);
                    fillWidth = parseFloat(widthInput.querySelector('input').value);
                    color = parseFloat(colorInput.querySelector('input').value);
                    lineLength = parseFloat(lineInput.querySelector('input').value);
                    menuContainer.style.display = 'none';
                }
                break;
            case 'f':
                fillTool(x, y, color);
                break;
            case 'i':
                drawUpLine(x, y, color);
                break;
            case 'k':
                drawDownLine(x, y, color);
                break;
            case 'j':
                drawLeftLine(x, y, color);
                break;
            case 'l':
                drawRightLine(x, y, color);
                break;
            case 'b':
                if (drawBMO === true) {
                    BMO(x, y, color);
                }
                break;
            default:
                break;
        }
    }
});


function placePix(x, y, col) {
    socket.send(`42["p",[${x},${y},${col},1]]`);
}

function fillTool(SX, SY, color) {
    let i = 0;
    let j = 0;

    function placePixelWithDelay() {
        if (j < fillHeight) {
            if (i < fillWidth) {
                placePix(SX + i, SY + j, color);
                placePix(SX + i, SY + j, color);
                i++;
                setTimeout(placePixelWithDelay, 50);// <---- Delay change with caution
            } else {
                i = 0;
                j++;
                setTimeout(placePixelWithDelay, 50);//<---- Delay change with caution
            }
        }
    }

    placePixelWithDelay();
}

     function drawUpLine(SX,SY,color){
         let a = 0;
      function placeUpLine(){
          if (a < lineLength){
              placePix(SX, SY - a , color)
              a++
              setTimeout(placeUpLine , 75)
}}
placeUpLine();}
    function drawDownLine(SX,SY,color){
       let b = 0;
      function placeDownLine(){
          if (b < lineLength){
              placePix(SX, SY + b , color)
              b++
              setTimeout(placeDownLine , 75)
}}
placeDownLine();}
function drawLeftLine(SX,SY,color){
         let c = 0;
      function placeLeftLine(){
          if (c < lineLength){
              placePix(SX - c, SY , color)
              c++
              setTimeout(placeLeftLine , 75)
}}placeLeftLine();}
function drawRightLine(SX,SY,color){
         let d = 0;
      function placeRightLine(){
          if (d < lineLength){
              placePix(SX + d, SY, color)
              d++
              setTimeout(placeRightLine , 75)
}}placeRightLine();}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function BMO(SX, SY) {
    const pixelArray = [
       [0 ,0 ,0 ,0 ,0 ,37 ,37, 37, 37, 37, 37, 37, 37, 37, 36, 36, 36, 36, 36],//1
 [0, 0, 0, 0, 0, 37, 48, 48, 48, 48, 48, 48, 48, 37, 36, 36, 36, 36, 36],//2
 [0, 0, 0, 0, 0, 37, 48, 5, 48, 48, 48, 5, 48, 37, 36, 36, 36, 36, 36],//3
 [0, 0, 0, 0, 0, 37, 48, 48, 48, 48, 48, 48, 48, 37, 36, 36, 36, 36, 36],//4
 [0, 0, 0, 0, 0, 37, 48, 5, 5, 5, 5, 5, 48, 37, 36, 36, 36, 36 ,36],//5
 [0, 37, 0, 0, 0, 37, 48, 48, 5, 5, 5, 48, 48, 37, 36, 36, 36, 36, 36],//6
 [0, 37, 0, 0, 0, 37, 48, 48, 48, 48, 48, 48, 48, 37, 36, 36, 36, 36, 36],//7
 [0, 0, 37, 0, 0, 37, 37, 37, 37, 37, 37, 37, 37, 37, 36, 36, 36, 36, 36],//8
 [0, 0, 0, 37, 37, 37, 3, 3, 3, 3, 3, 37, 44, 37, 36, 47, 36, 36, 36],//9
 [0, 0, 0, 0, 0, 37, 37, 37, 37, 37, 37, 37, 37, 37, 36, 47, 36, 36, 36],//10
 [0, 0, 0, 0, 0, 37, 37, 11, 37, 37, 37, 37, 37, 37, 36, 47, 36, 36, 36],//11
 [0, 0, 0, 0, 0, 37, 11, 11, 11, 37, 37, 37, 37, 37, 36, 47, 36, 36, 36],//12
 [0, 0, 0, 0, 0, 37, 37, 11, 37, 37, 37, 32, 37, 37, 36, 47, 36, 36, 36],//13
 [0, 0, 0, 0, 0, 37, 37, 37, 37, 37, 20, 37, 7, 37, 36, 36, 36, 36, 36],//14
 [0, 0, 0, 0, 0, 37, 37, 37, 37, 37, 37, 37, 37, 37, 36, 36, 36, 36, 36],//15
 [0, 0, 0, 0, 0, 37, 37, 37, 37, 37, 37, 37, 37, 37, 36, 36, 36, 36, 36],//16
 [0, 0, 0, 0, 0, 0, 0, 37, 36, 0, 0, 0, 0, 0, 37, 36, 0, 0, 0, 0],//17
 [0, 0, 0, 0, 0, 0, 0, 37, 36, 0, 0, 0, 0, 0, 37, 36, 0, 0, 0, 0],//18
 [0, 0, 0, 0, 0, 0, 0, 37, 36, 0, 0, 0, 0, 0, 37, 36, 0, 0, 0, 0],//19
        // Add more rows as needed
    ];
    for (let y = 0; y < pixelArray.length; y++) {
        for (let x = 0; x < pixelArray[y].length; x++) {
            const col = pixelArray[y][x];
            placePix(SX + x, SY + y, col);
            await sleep(75);
        }
    }
}


const menuContainer = document.createElement('div');
menuContainer.style.display = 'none';
menuContainer.style.position = 'fixed';
menuContainer.style.backgroundColor = 'white';
menuContainer.style.border = '1px solid #ccc';
menuContainer.style.padding = '10px';
menuContainer.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)';
menuContainer.style.fontFamily = 'Arial, sans-serif';
menuContainer.style.top = '50%';
menuContainer.style.left = '50%';
menuContainer.style.transform = 'translate(-50%, -50%)';


function createInputWithLabel(labelText, defaultValue) {
    const inputWrapper = document.createElement('div');

    const label = document.createElement('label');
    label.textContent = labelText + ':';
    label.style.fontWeight = 'bold';
    label.style.marginBottom = '4px';

    const input = document.createElement('input');
    if (typeof defaultValue === 'boolean') {
        input.type = 'checkbox';
        input.checked = defaultValue;
        input.addEventListener('change', function () {
            drawBMO = this.checked;
        });
    } else {
        input.type = 'number';
        input.placeholder = defaultValue;
        input.style = `
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 4px;
            width: 100px;
            margin-bottom: 10px;
            color: black; /* Set text color to black */
            z-index: 2000000001; /* Set z-index */
        `;
    }

    inputWrapper.appendChild(label);
    inputWrapper.appendChild(input);

    return inputWrapper;
}

const header = document.createElement('div');
header.textContent = 'Fill Tool Settings';
header.style.fontSize = '18px';
header.style.fontWeight = 'bold';
header.style.marginBottom = '10px';

const heightInput = createInputWithLabel('Fill Height', '0');
const widthInput = createInputWithLabel('Fill Width', '0');
const lineInput = createInputWithLabel('Line Length', '0');
const colorInput = createInputWithLabel('Color', '0');
const drawBMOInput = createInputWithLabel('Draw BMO', false);

const submitButton = document.createElement('button');
submitButton.textContent = 'Submit (m)';
submitButton.style.backgroundColor = '#007bff';
submitButton.style.color = 'white';
submitButton.style.padding = '8px 12px';
submitButton.style.border = 'none';
submitButton.style.borderRadius = '4px';
submitButton.style.cursor = 'pointer';
submitButton.style.marginTop = '10px';

menuContainer.appendChild(header);
menuContainer.appendChild(heightInput);
menuContainer.appendChild(widthInput);
menuContainer.appendChild(lineInput);
menuContainer.appendChild(colorInput);
menuContainer.appendChild(drawBMOInput);
menuContainer.appendChild(submitButton);

document.body.appendChild(menuContainer);



submitButton.addEventListener('click', () => {
    fillHeight = parseFloat(heightInput.querySelector('input').value);
    fillWidth = parseFloat(widthInput.querySelector('input').value);
    color = parseFloat(colorInput.querySelector('input').value);
    lineLength = parseFloat(lineInput.querySelector('input').value);
    menuContainer.style.display = 'none';
});
const chatInput = document.querySelector('input[name="chat"]');
chatInput.addEventListener('focus', () => {
    chatting = true;
    console.log("chatting");
});
chatInput.addEventListener('blur', () => {
    console.log("unchatting");
    chatting = false;
});
    /// Create the checkbox container element
    const checkboxContainer = document.createElement('div');
    checkboxContainer.style.position = 'fixed';
    checkboxContainer.style.left = '450px';
    checkboxContainer.style.bottom = '12px';
    checkboxContainer.style.zIndex = '2000000001'; // Set the z-index
    checkboxContainer.style.display = 'flex';
    checkboxContainer.style.alignItems = 'center';

    // Create the checkbox element
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
 checkbox.style.borderRadius = '25%';
    checkbox.style.width = '25px'; // Increase the size
    checkbox.style.height = '25px'; // Increase the size
    checkbox.checked = true;
    checkbox.style.marginRight = '10px'; // Add some spacing

    // Initial state of onOff based on checkbox's checked state
    let onOff = checkbox.checked;

    // Function to toggle onOff when checkbox is clicked
    checkbox.addEventListener('click', function() {
        onOff = checkbox.checked;
        updateBackgroundColor();
    });

    // Append the checkbox to the container
    checkboxContainer.appendChild(checkbox);

    // Append the container to the body
    document.body.appendChild(checkboxContainer);

    // Function to update background color based on onOff state
    function updateBackgroundColor() {
        if (onOff) {
            document.body.style.backgroundColor = 'lightblue';
        } else {
            document.body.style.backgroundColor = 'white';
        }}
        });