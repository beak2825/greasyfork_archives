// ==UserScript==
// @name:ru      Эвадес но лучше
// @name         E-Better
// @version      0.1.5.5
// @description  Custom menu for Evades with many features for improvement.
// @author       Alertix(aka Failure, BubShurup), thanks to EtherCD(aka ✺Mistake✺) for helping and for making Map Filling for Beauty (https://github.com/EtherCD).
// @match        https://evades.online/
// @match        https://evades.io/
// @icon         https://u.cubeupload.com/FailureEvades/evadesactions.png
// @grant        none
// @run-at       document-idle
// @license      CC BY-NC-ND 4.0
// @description:ru      Меню в левом краю и всякие кнопки классные
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/490201/E-Better.user.js
// @updateURL https://update.greasyfork.org/scripts/490201/E-Better.meta.js
// ==/UserScript==


'use strict';
const customCSS = document.createElement('style');
customCSS.innerHTML = `
.changelog {
    float: left;
    width: 500px;
    height: 250px;
    color: #fff;
    border: 1px solid #585858;
    border-radius: 5px;
    position: relative;
    left: 40%;
    overflow: auto;
}

.button {
    background-color: #030303;
}

.button:hover {
    background: #121212
}

.button:disabled {
    background-color: #000000
}

.game-server {
    background-color: #030303;
}

.game-server:hover {
    background: #121212
}

.button {
    background-color: #030303;
}

.button:hover {
    background: #121212
}

.button:disabled {
    background-color: #000000
}

    .results-title {
        text-align: center;
        margin-top: 10px;
        margin-bottom: 50px;
        font-size: 65px;
        font-weight: 500;
        animation: rainbowText 4s infinite;
    }

    @keyframes rainbowText {
        0% {
            color: red;
        }
        16.666% {
            color: orange;
        }
        33.333% {
            color: yellow;
        }
        50% {
            color: green;
        }
        66.666% {
            color: blue;
        }
        83.333% {
            color: indigo;
        }
        100% {
            color: violet;
        }
    }

    #chat {
        width: 300px;
        height: 200px;
        background-color: #1a1a1a;
        position: fixed;
        bottom: 0;
        border: 2px solid #333;
        border-radius: 10px;
        overflow: hidden;
        z-index: 9998;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }

    #leaderboard,
    #subMenu,
    #cursorChangerSubMenu,
    #creditsSubMenu {
        z-index: 9999;
    }

    #chat-window {
        width: calc(100% - 4px);
        height: 165px;
        padding-bottom: 10px;
        overflow-y: auto;
        background-color: #2d2d2d;
        color: #ccc;
        font-family: Arial, sans-serif;
        position: relative;
    }

    #chat-input {
        width: calc(100% - 4px);
        height: 25px;
        padding: 5px;
        box-sizing: border-box;
        position: absolute;
        bottom: 0;
        border: none;
        background-color: #1a1a1a;
        color: #ccc;
        font-family: Arial, sans-serif;
        border-top: 2px solid #333;
    }

    #leaderboard.big {
        width: 230px;
    }

    .leaderboard-title {
        width: 100%;
        color: #f9f9f9;
        text-align: center;
        white-space: nowrap;
        font: 700 20px Tahoma, Arial, Verdana, Segoe, sans-serif;
        display: inline-block;

.header-ad {
    opacity: .0;
    height: 125px;
    width: 480px;
    text-align: center;
    display: none;
    margin: 0 auto
}

.left-ad {
    opacity: .0;
    float: left;
    display: none;
}

.right-ad {
    opacity: .0;
    float: right;
    display: none;
}

.box-ad {
    opacity: .0;
    float: right;
    position: relative;
    left: -62%;
    display: none;
    transform: translate(165%);
}
`;
document.head.appendChild(customCSS);

function initEBetter() {
	const menu = document.createElement('div')
	menu.setAttribute('id', 'customMenu')
	menu.style.position = 'fixed'
	menu.style.top = '50%'
	menu.style.left = '0'
	menu.style.transform = 'translateY(-50%)'
	menu.style.background = 'rgba(0, 0, 0, 0.7)'
	menu.style.width = '50px'
	menu.style.height = '100vh'
	menu.style.display = 'block'
	menu.style.transition = 'width 0.5s'

	const settingsButton = document.createElement('img')
	settingsButton.src = 'https://evades.io/options.8b56ab3c.png'
	settingsButton.alt = 'Settings'
	settingsButton.style.position = 'absolute'
	settingsButton.style.top = '10px'
	settingsButton.style.left = '10px'
	settingsButton.style.width = '30px'
	settingsButton.style.height = 'auto'
	settingsButton.style.cursor = 'pointer'
	settingsButton.addEventListener('click', function () {
		toggleSubMenu()
	})

	const cursorChangerButton = document.createElement('img')
	cursorChangerButton.src =
		'https://u.cubeupload.com/FailureEvades/CursorChanger.png'
	cursorChangerButton.alt = 'Cursor Changer'
	cursorChangerButton.style.position = 'absolute'
	cursorChangerButton.style.top = '55px'
	cursorChangerButton.style.left = '10px'
	cursorChangerButton.style.width = '30px'
	cursorChangerButton.style.height = 'auto'
	cursorChangerButton.style.cursor = 'pointer'
	cursorChangerButton.addEventListener('click', function () {
		toggleCursorChangerSubMenu()
	})

	const cursorChangerSubMenu = document.createElement('div')
	cursorChangerSubMenu.setAttribute('id', 'cursorChangerSubMenu')
	cursorChangerSubMenu.style.position = 'absolute'
	cursorChangerSubMenu.style.top = '55px'
	cursorChangerSubMenu.style.left = '50px'
	cursorChangerSubMenu.style.width = '0'
	cursorChangerSubMenu.style.height = '70px'
	cursorChangerSubMenu.style.background = 'rgba(0, 0, 0, 0.7)'
	cursorChangerSubMenu.style.transition = 'width 0.5s'
	cursorChangerSubMenu.style.overflow = 'hidden'

	const changeCursorButton = document.createElement('img')
	changeCursorButton.src =
		'https://u.cubeupload.com/FailureEvades/arrowIcon.png'
	changeCursorButton.alt = 'Change Cursor'
	changeCursorButton.style.color = '#ffffff'
	changeCursorButton.style.position = 'absolute'
	changeCursorButton.style.top = '5px'
	changeCursorButton.style.left = '20px'
	changeCursorButton.style.width = '20px'
	changeCursorButton.style.height = 'auto'
	changeCursorButton.style.cursor = 'pointer'
	changeCursorButton.addEventListener('click', function () {
		changeCursor()
	})

let isCrosshairActive = false;

cursorChangerButton.addEventListener('click', function () {
    toggleCursorChangerSubMenu();
    toggleCursorStyle();
})

function toggleCursorStyle() {
    const body = document.querySelector('body');
    if (!isCrosshairActive) {
        body.style.cursor = 'crosshair';
        applyCrosshairToAllElements();
        applyCrosshairToAllCSSStyles();
        isCrosshairActive = true;
    } else {
        body.style.cursor = 'auto';
        removeCrosshairFromAllElements();
        isCrosshairActive = false;
    }
}

function applyCrosshairToAllElements() {
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
        element.style.cursor = 'crosshair';
    });
}

function removeCrosshairFromAllElements() {
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
        element.style.cursor = 'auto';
    });
}

function applyCrosshairToAllCSSStyles() {
    const styleSheets = document.styleSheets;
    for (let i = 0; i < styleSheets.length; i++) {
        const rules = styleSheets[i].cssRules;
        for (let j = 0; j < rules.length; j++) {
            const rule = rules[j];
            if (rule instanceof CSSStyleRule) {
                if (rule.style.cursor === 'crosshair') {
                    rule.style.cursor = 'crosshair';
                }
            }
        }
    }
}



	const currentCursorText = document.createElement('div')
	currentCursorText.textContent = 'Current Cursor: Normal'
	currentCursorText.style.color = '#ffffff'
	currentCursorText.style.position = 'absolute'
	currentCursorText.style.top = '5px'
	currentCursorText.style.left = '50px'
	currentCursorText.style.padding = '5px'
	currentCursorText.style.display = 'inline-block'

	let currentCursor = 'normal'

	cursorChangerSubMenu.appendChild(currentCursorText)
	cursorChangerSubMenu.appendChild(changeCursorButton)

	function changeCursor() {
		const body = document.querySelector('body')
		if (currentCursor === 'normal') {
			body.style.cursor = 'crosshair'
			currentCursorText.textContent = 'Current Cursor: Crosshair'
			currentCursor = 'crosshair'
		} else {
			body.style.cursor = 'auto'
			currentCursorText.textContent = 'Current Cursor: Normal'
			currentCursor = 'normal'
		}
	}

	menu.appendChild(cursorChangerButton)
	document.body.appendChild(cursorChangerSubMenu)

	function toggleCursorChangerSubMenu() {
		if (cursorChangerSubMenu.style.width === '0px') {
			cursorChangerSubMenu.style.width = '200px'
		} else {
			cursorChangerSubMenu.style.width = '0'
		}
	}

	const creditsButton = document.createElement('img')
	creditsButton.src = 'https://evades.io/question.bc02e04b.png'
	creditsButton.alt = 'Credits'
	creditsButton.style.position = 'absolute'
	creditsButton.style.top = '100px'
	creditsButton.style.left = '10px'
	creditsButton.style.width = '30px'
	creditsButton.style.height = 'auto'
	creditsButton.style.cursor = 'pointer'
	creditsButton.addEventListener('click', function () {
		toggleCreditsSubMenu()
	})

	const creditsSubMenu = document.createElement('div')
	creditsSubMenu.setAttribute('id', 'creditsSubMenu')
	creditsSubMenu.style.position = 'absolute'
	creditsSubMenu.style.top = '100px'
	creditsSubMenu.style.left = '50px'
	creditsSubMenu.style.width = '0px'
	creditsSubMenu.style.height = '150px'
	creditsSubMenu.style.background = 'rgba(0, 0, 0, 0.7)'
	creditsSubMenu.style.transition = 'width 1.5s'
	creditsSubMenu.style.overflow = 'hidden'

	const currentCreditsText = document.createElement('div')
	currentCreditsText.textContent = 'Thanks to EtherCD(aka ✺Mistake✺) for helping and for making Map Filling for Beauty (https://github.com/EtherCD).'
	currentCreditsText.style.color = '#ffffff'
	currentCreditsText.style.position = 'absolute'
	currentCreditsText.style.top = '5px'
	currentCreditsText.style.left = '10px'
	currentCreditsText.style.padding = '5px'
	currentCreditsText.style.display = 'inline-block'

	creditsSubMenu.appendChild(currentCreditsText)

	menu.appendChild(creditsButton)
	document.body.appendChild(creditsSubMenu)

	function toggleCreditsSubMenu() {
		if (creditsSubMenu.style.width === '0px') {
			creditsSubMenu.style.width = '200px'
		} else {
			creditsSubMenu.style.width = '0'
		}
	}

	const subMenu = document.createElement('div')
	subMenu.setAttribute('id', 'subMenu')
	subMenu.style.position = 'absolute'
	subMenu.style.top = '0'
	subMenu.style.left = '50px'
	subMenu.style.width = '0'
	subMenu.style.height = '67px'
	subMenu.style.background = 'rgba(0, 0, 0, 0.7)'
	subMenu.style.transition = 'width 0.5s'
	subMenu.style.overflow = 'hidden'

const colorPickerButton = document.createElement('div');
colorPickerButton.style.display = 'flex';
colorPickerButton.style.alignItems = 'center';
colorPickerButton.style.cursor = 'pointer';
colorPickerButton.style.padding = '5px';
colorPickerButton.style.borderBottom = '1px solid #ccc';
colorPickerButton.textContent = "Change everybody's nick color to rainbow (clientside)";
colorPickerButton.style.color = '#ffffff';
colorPickerButton.style.transition = 'color 1s linear';

let rainbowTextColorInterval;

colorPickerButton.addEventListener('click', function () {
    if (!rainbowTextColorInterval) {
        rainbowTextColorInterval = setInterval(() => {
            let hue = Math.floor(Math.random() * 360);
            colorPickerButton.style.color = `hsl(${hue}, 100%, 50%)`;
        }, 50);
        changeNickColorToRainbow();
        colorPickerButton.textContent = "Stop changing nick color to rainbow";
    } else {
        clearInterval(rainbowTextColorInterval);
        rainbowTextColorInterval = null;
        colorPickerButton.style.color = '#ffffff';
        colorPickerButton.textContent = "Change everybody's nick color to rainbow (clientside)";
    }
});

function changeNickColorToRainbow() {
    const chatMessages = document.querySelectorAll('.chat-message-sender');
    chatMessages.forEach(function (message) {
        if (!isNickAlreadyColored(message)) {
            rainbowNickColor(message);
        }
    });
}

function isNickAlreadyColored(element) {
    return element.style.color !== '' && element.style.color !== 'inherit';
}

function rainbowNickColor(element) {
    let hue = 0;
    setInterval(() => {
        hue = (hue + 1) % 360;
        element.style.color = `hsl(${hue}, 100%, 50%)`;
    }, 50);
}

subMenu.appendChild(colorPickerButton);

	menu.appendChild(settingsButton)
	document.body.appendChild(menu)
	document.body.appendChild(subMenu)

	function toggleSubMenu() {
		if (subMenu.style.width === '0px') {
			subMenu.style.width = '200px'
		} else {
			subMenu.style.width = '0'
		}
	}

function changeNickColor(newColor) {
    const chatMessages = document.querySelectorAll('.chat-message-sender');
    chatMessages.forEach(function (message) {
        message.style.color = newColor;
        message.style.transition = 'color 1s linear';
        rainbowNickColor(message);
    });
}

function rainbowNickColor(element) {
    let hue = 0;
    setInterval(() => {
        hue = (hue + 1) % 360;
        element.style.color = `hsl(${hue}, 100%, 50%)`;
    }, 50);
}

	document.addEventListener('mousemove', function (event) {
		if (event.clientX < 20) {
			menu.style.display = 'block'
			menu.style.width = '150px'
		} else {
			menu.style.width = '50px'
		}
	})
}

// EtherCD's Map Filling for Beauty
window.EvadesME = {
	vars: {
		worlds: {
			'Central Core': ['#425a6d', 0.1],
			//'Catastrophic Core': ['#B00B1E', 0.1, () => Math.abs(Math.sin(Date.now() / 1000) * 0.15)],
			'Haunted Halls': ['#664B00', 0.1],
			'Peculiar Pyramid': ['#666600', 0.1],
			'Wacky Wonderland': ['#870080', 0.1],
			'Glacial Gorge': ['#005668', 0.1],
			'Vicious Valley': ['#4d6b40', 0.1],
			'Humongous Hollow': ['#663900', 0.1],
			'Elite Expanse': ['#2a3b4f', 0.1],
			'Endless Echo': ['#4168c4', 0.1],
			'Dangerous District': ['#680000', 0.1],
			'Quiet Quarry': ['#425a6d', 0.1],
			'Monumental Migration': ['#470066', 0.1],
			'Ominous Occult': ['#63838e', 0.1],
			'Frozen Fjord': ['#27494f', 0.1],
			'Restless Ridge': ['#a88b64', 0.1],
			'Toxic Territory': ['#5c5c5c', 0.1],
			'Magnetic Monopole': ['#bf00ff', 0.1],
			'Burning Bunker': ['#cc0000', 0.1],
			'Grand Garden': ['#6a9c49', 0.1],
			'Mysterious Mansion': ['#9c0ec7', 0.1],
			'Cyber Castle': ['#21bad9', 0.1],
			'Shifting Sands': ['#c88241', 0.1],
			'Infinite Inferno': ['#9b0606', 0.1],
			'Coupled Corridors': ['#bcad59', 0.1],
			'Withering Wasteland': ['#c45945', 0.1],
			'Dusty Depths': ['#825B37', 0.1],
		},
		worldsKeys: [],
	},

	replaces: [],

	addReplace(a, b) {
		this.replaces.push([a, b])
	},

	addReplaces() {
		this.addReplace(
			/prepareCanvas\(\w\)\{[\w\d\$="'.,;#?:\s\(\)]+\}/,
			`prepareCanvas(e) {
                  this.chat.style.visibility = 'visible';
                  this.leaderboard.style.visibility = 'visible';
                  this.context.fillStyle = '#333';
                  this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
                  if (window.EvadesME.vars.worldsKeys.includes(e.area.regionName)) {
                    this.context.fillStyle = window.EvadesME.vars.worlds[e.area.regionName][0];
                    this.context.globalAlpha = window.EvadesME.vars.worlds[e.area.regionName][2]
                      ? window.EvadesME.vars.worlds[e.area.regionName][2]()
                      : window.EvadesME.vars.worlds[e.area.regionName][1];
                    this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
                    this.context.globalAlpha = 1;
                  }
                  this.camera.centerOn(e.self.entity);
                }`
		)
		// this.addReplace(/=['"]#006b2c['"]/, `="#6B0063"`); // #006b66
		// this.addReplace(/=['"]#00ff6b['"]/, `="#e500ff"`); // #00fff4
	},

	init() {
		this.vars.worldsKeys = Object.keys(this.vars.worlds)
		this.addReplaces()
	},

	insertCode() {
		// From script by @Irudis: Evades Helper
		// commenting from alertix: HMMMM????? hacker??🤨
		let elem = Array.from(document.querySelectorAll('script')).filter(
			a => a.type === 'module' && a.src.match(/\/index\.[0-9a-f]{8}\.js/)
		)[0]
		if (!elem) return
		if (!navigator.userAgent.includes('Firefox')) elem.remove()
		let src = elem.src

		let req = new XMLHttpRequest()
		req.open('GET', src, false)
		req.send()
		let code = req.response
		for (const r in this.replaces)
			code = code.replace(this.replaces[r][0], this.replaces[r][1])

		let nScr = document.createElement('script')
		nScr.setAttribute('type', 'module')
		nScr.innerHTML = code
		document.body.appendChild(nScr)
		console.log('E-Better was loaded!')
		initEBetter()
	},

	// idk why did ethercd put that
	asAddonForTSMod() {
		console.log('Sorry, E-Better is not working with TS-Mod')
	},
}

window.EvadesME.init()
if (!window.tsmod) window.EvadesME.insertCode()
else window.EvadesME.asAddonForTSMod()
function setZoomTo100() {
	document.body.style.zoom = '100%'
}

initEBetter();