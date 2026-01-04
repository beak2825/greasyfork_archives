// ==UserScript==
// @name           [doesn't work] blackhack
// @version        1.14-beta9
// @description    Cheat for brofist.io
// @author         CiNoP
// @match          https://brofist.io/
// @match          https://brofist.io/modes/twoPlayer/c/index.html
// @match          https://brofist.io/modes/hideAndSeek/c/index.html
// @match          https://brofist.io/modes/sandbox/c/index.html
// @match          http://brofist.io/
// @match          http://brofist.io/modes/twoPlayer/c/index.html
// @match          http://brofist.io/modes/hideAndSeek/c/index.html
// @match          http://brofist.io/modes/sandbox/c/index.html
// @match          http://www.brofist.io/
// @match          http://www.brofist.io/modes/twoPlayer/c/index.html
// @match          http://www.brofist.io/modes/hideAndSeek/c/index.html
// @match          http://www.brofist.io/modes/sandbox/c/index.html
// @icon           https://www.google.com/s2/favicons?sz=64&domain=brofist.io
// @grant          none
// @license        GPL-3.0-only
// @namespace      brofist.io 1st-cheat (FOR ALL MODES)
// @downloadURL https://update.greasyfork.org/scripts/513076/%5Bdoesn%27t%20work%5D%20blackhack.user.js
// @updateURL https://update.greasyfork.org/scripts/513076/%5Bdoesn%27t%20work%5D%20blackhack.meta.js
// ==/UserScript==
/* jshint esversion: 11 */
/* jshint asi: true */






// Функция для переключения вкладок (пример реализации)
window.openTab = function(tabName, event) {
	const tabContents = document.querySelectorAll(".tab-content");
	tabContents.forEach(tab => tab.style.display = "none");
	const buttons = document.querySelectorAll(".tab-button");
	buttons.forEach(btn => btn.classList.remove("active"));
	document.getElementById(tabName + "Tab").style.display = "block";
	event.currentTarget.classList.add("active");
}




// Функция для обновления списка в контейнере
window.updateBlacklistList = function() {
    const container = document.getElementById("blacklistContainer");
    container.innerHTML = "";
    hack.vars.blacklisted.names.forEach(name => {
        const row = document.createElement("div");
        row.className = "form-row";
        row.style.justifyContent = "flex-start";
        row.style.alignItems = "center";
        row.style.gap = "8px"; // Увеличиваем зазор между элементами

        // Кнопка для удаления (эмодзи ❌) - сделана квадратной
        const delBtn = document.createElement("button");
        delBtn.className = "btn";
        delBtn.style.padding = "0";
        delBtn.style.width = "24px";
        delBtn.style.height = "24px";
        delBtn.style.lineHeight = "24px";
        delBtn.style.display = "flex";
        delBtn.style.alignItems = "center";
        delBtn.style.justifyContent = "center";
        delBtn.style.boxSizing = "border-box";
        delBtn.innerText = "❌";
        delBtn.onclick = function() {
            window.removeBlacklistName(name);
        };

        // Эмодзи белой точки
        const whiteDot = document.createElement("span");
        whiteDot.innerText = "⚪";
        whiteDot.style.marginRight = "4px"; // расстояние между белой точкой и никнеймом

        const nameSpan = document.createElement("span");
        nameSpan.innerText = name;

        row.appendChild(delBtn);
        row.appendChild(whiteDot);
        row.appendChild(nameSpan);
        container.appendChild(row);
    });
}

// Функция добавления никнейма
window.addBlacklistName = function() {
    const input = document.getElementById("blacklistInput");
    const name = input.value.trim();
    if (name !== "" && !hack.vars.blacklisted.names.includes(name)) {
        hack.vars.blacklisted.names.push(name);
        input.value = "";
        window.updateBlacklistList();
    }
}


// Функция удаления никнейма по клику на ❌
window.removeBlacklistName = function(name) {
    hack.vars.blacklisted.names = hack.vars.blacklisted.names.filter(e => e !== name);
    window.updateBlacklistList();
}

















// Функция, возвращающая противоположный (инвертированный) цвет в формате HEX
window.getComplementaryColor = function(hex) {
	hex = hex.replace("#", "");
	if (hex.length === 3) {
		hex = hex.split("").map(ch => ch + ch).join("");
	}
	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);
	const compR = (255 - r).toString(16).padStart(2, '0');
	const compG = (255 - g).toString(16).padStart(2, '0');
	const compB = (255 - b).toString(16).padStart(2, '0');
	return `#${compR}${compG}${compB}`;
}

// Преобразование HEX в RGBA с учетом прозрачности
window.hexToRGBA = function(hex, opacity) {
	hex = hex.replace("#", "");
	if (hex.length === 3) {
		hex = hex.split("").map(ch => ch + ch).join("");
	}
	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);
	return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Функция для применения выбранных настроек косметики
window.applyCosmetics = function() {
	const bgColor = document.getElementById("bgColorInput").value;
	const textColor = document.getElementById("textColorInput").value;
	const bgOpacity = parseFloat(document.getElementById("bgOpacityInput").value);
	const outlineEnabled = document.getElementById("textOutlineCheckbox").checked;

	const background = window.hexToRGBA(bgColor, bgOpacity);
	const elementIds = ["someData", "controlPanel", "mapCredits", "leaderboard", "timer", "seekerDistance", "hidersCount"];

	elementIds.forEach(id => {
		const el = document.getElementById(id);
		if (el) {
			el.style.setProperty("background-color", background, "important");
			el.style.setProperty("opacity", "1", "important");

			// Меняем цвет текста и добавляем обводку, если это не leaderboard
			if (id !== "leaderboard") {
				el.style.setProperty("color", textColor, "important");

				if (outlineEnabled) {
					const outlineColor = getComplementaryColor(textColor);
					el.style.setProperty("text-shadow", `
    0.75px 0.75px 0 ${outlineColor},
    -0.75px -0.75px 0 ${outlineColor},
    0.75px -0.75px 0 ${outlineColor},
    -0.75px 0.75px 0 ${outlineColor},
    0.75px 0 0 ${outlineColor},
    0 0.75px 0 ${outlineColor},
    -0.75px 0 0 ${outlineColor},
    0 -0.75px 0 ${outlineColor}
  `, "important");
				} else {
					el.style.setProperty("text-shadow", "none", "important");
				}
			}
		}
	});

	localStorage.setItem("cosmeticsSettings", JSON.stringify({
		bgColor,
		textColor,
		bgOpacity,
		outlineEnabled
	}));
};

// Функция для загрузки сохраненных настроек
window.loadCosmetics = function() {
	const savedSettings = localStorage.getItem("cosmeticsSettings");
	if (savedSettings) {
		const {
			bgColor,
			textColor,
			bgOpacity,
			outlineEnabled
		} = JSON.parse(savedSettings);

		document.getElementById("bgColorInput").value = bgColor;
		document.getElementById("textColorInput").value = textColor;
		document.getElementById("bgOpacityInput").value = bgOpacity;
		if (typeof outlineEnabled !== "undefined") {
			document.getElementById("textOutlineCheckbox").checked = outlineEnabled;
		}

		window.applyCosmetics();
	}
};





const roomButtons = document.querySelectorAll('.button.rooms');
roomButtons.forEach(button => {
	button.addEventListener('click', function() {
		setTimeout(function() {
			window.loadCosmetics();
		}, 30);
	});
});











let sandboxURL = ['https://brofist.io/modes/sandbox/c/index.html', 'http://brofist.io/modes/sandbox/c/index.html', 'http://www.brofist.io/modes/sandbox/c/index.html']
let twoPlayerURL = ['https://brofist.io/modes/twoPlayer/c/index.html', 'http://brofist.io/modes/twoPlayer/c/index.html','http://www.brofist.io/modes/twoPlayer/c/index.html']
let hideAndSeekURL = ['https://brofist.io/modes/hideAndSeek/c/index.html', 'http://brofist.io/modes/hideAndSeek/c/index.html', 'http://www.brofist.io/modes/hideAndSeek/c/index.html']
let brofioURL = ['https://brofist.io', 'http://brofist.io/']

document.body.insertAdjacentHTML("beforebegin",
	`<button id="infoPanelBtn" style="display: inherit; width: 30px; height: 30px; position: fixed; top: 50%; left: 0px; background: rgba(0, 0, 0, 0.3); color: rgb(255, 255, 255); border: none; cursor: pointer;">ⓘ</button>`
);

document.body.insertAdjacentHTML("beforebegin",
	`<div id="infoPanelArrow" style="position: fixed; left: 35px; top: 50%; font-size: 30px; color: #FF4136; opacity: 0; transform: translateY(-50%);">➤</div>`
);

document.getElementById('infoPanelBtn').addEventListener('click', () => {
	const panel = document.getElementById('cheatInfoPanel');
	panel.style.display = (panel.style.display === 'none') ? 'block' : 'none';
});

document.body.insertAdjacentHTML("beforebegin",
	`<div id="cheatInfoPanel" style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0, 0, 0, 0.8); color: rgb(255, 255, 255); padding: 15px; border-radius: 5px; font-size: 20px; text-align: center; z-index: 1000; font-family: Arial, sans-serif; cursor: move; max-width: 90%; max-height: 90%; overflow: auto; user-select: none;">
    <div style="margin-bottom: 10px;">
      <button id="decreaseFont" style="margin-right: 5px;">-</button>
      <button id="increaseFont">+</button>
    </div>
    <div id="cheatInfoText">
      ${getCheatInfoText()}
    </div>
  </div>`
);

makePanelDraggable(document.getElementById('cheatInfoPanel'));

function getCheatInfoText() {
	if (brofioURL.includes(window.location.href)) {
		return "Зайдите в любой режим";
	} else if (twoPlayerURL.includes(window.location.href)) {
		return `
<b>Функционал чита:</b><br>
английская <b>C</b> - Рывок (во все стороны)<br>
англ. <b>Z</b> - Прыжок с возможностью второго прыжка<br>
<b>F2</b> - Режим бога<br>
<b>ё</b> или <b>\`</b> - Изменение скорости в режиме бога<br>
<b>F4</b> - Невосприимчивость к яду<br>
<b>F9</b> - Невосприимчивость к смерти (по умолчанию вкл.)<br>
<b>Home</b>/<b>End</b> - тп к спавну/двери<br>
Зажатие англ. <b>S</b> - Увеличение массы в 3 раза<br>
<b>Insert</b> - Тп к игроку<br>
<b>Колесо мыши</b> - Выдача вертикальной скорости<br>
<b>Правый клик</b> - Телепорт к месту на котором ваш курсор<br><br>

<b>А так же:</b><br>
Информация об игроке, скриптовых переменных и т.п. во вкладке Info<br>
Изменение стиля интерфейса во вкладке Cosmetics<br>
Переключение между новым и старым передвижением в левой нижней панели<br>
Нажмите <b>Esc</b> чтобы скрыть новые панели<br>
    `;
	} else {
		return `
<b>Функционал чита:</b><br>
английская <b>C</b> - Рывок (во все стороны)<br>
англ. <b>Z</b> - Прыжок с возможностью второго прыжка<br>
<b>F2</b> - Режим бога<br>
<b>ё</b> или <b>\`</b> - Изменение скорости в режиме бога<br>
Зажатие англ. <b>S</b> - Увеличение массы в 3 раза<br>
<b>Колесо мыши</b> - Выдача вертикальной скорости<br><br>

<b>А так же:</b><br>
Информация об игроке, скриптовых переменных и т.п. в левой верхней панели<br>
Переключение между новым и старым передвижением в левой нижней панели<br>
Нажмите <b>Esc</b> чтобы скрыть новые панели<br>
    `;
	}
}

function makePanelDraggable(panel) {
	let isDragging = false;
	let startX, startY, initialX, initialY;

	panel.addEventListener('mousedown', dragStart);
	document.addEventListener('mouseup', dragEnd);
	document.addEventListener('mousemove', drag);

	function dragStart(e) {
		isDragging = true;
		startX = e.clientX;
		startY = e.clientY;
		const rect = panel.getBoundingClientRect();
		initialX = rect.left;
		initialY = rect.top;
		panel.style.transform = 'none';
	}

	function drag(e) {
		if (!isDragging) return;

		const offsetX = e.clientX - startX;
		const offsetY = e.clientY - startY;

		let newX = initialX + offsetX;
		let newY = initialY + offsetY;

		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;
		const panelRect = panel.getBoundingClientRect();

		const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
		const scrollbarHeight = window.innerHeight - document.documentElement.clientHeight;

		newX = Math.max(0, Math.min(windowWidth - panelRect.width - scrollbarWidth, newX));
		newY = Math.max(0, Math.min(windowHeight - panelRect.height - scrollbarHeight, newY));

		panel.style.left = `${newX}px`;
		panel.style.top = `${newY}px`;
	}

	function dragEnd() {
		isDragging = false;
	}
}

const cheatInfoPanel = document.getElementById('cheatInfoPanel');
const cheatInfoText = document.getElementById('cheatInfoText');
const decreaseFontBtn = document.getElementById('decreaseFont');
const increaseFontBtn = document.getElementById('increaseFont');

let fontSize = 20;

decreaseFontBtn.addEventListener('click', () => {
	fontSize = Math.max(10, fontSize - 2);
	cheatInfoText.style.fontSize = fontSize + 'px';
});

increaseFontBtn.addEventListener('click', () => {
	fontSize = Math.min(40, fontSize + 2);
	cheatInfoText.style.fontSize = fontSize + 'px';
});

const infoPanelArrow = document.getElementById('infoPanelArrow');
let animationCount = 0;
let animationRunning = false;

function initializeArrow() {
	infoPanelArrow.style.position = 'fixed';
	infoPanelArrow.style.top = '50%';
	infoPanelArrow.style.left = '35px';
	infoPanelArrow.style.transform = 'translateY(-50%) rotate(180deg)';
	infoPanelArrow.style.opacity = 0;
	infoPanelArrow.style.top = 'calc(50% + 15px)'
}

function animateArrow() {
	if (animationRunning) return;

	animationRunning = true;
	let opacity = 0;
	let fadeIn = true;

	const animationSpeed = 25;

	const animation = setInterval(() => {
		if (fadeIn) {
			opacity += 0.1;
			if (opacity >= 1) {
				fadeIn = false;
			}
		} else {
			opacity -= 0.1;
			if (opacity <= 0) {
				fadeIn = true;
				animationCount++;
				if (animationCount >= 10) {
					clearInterval(animation);
					animationRunning = false;
					infoPanelArrow.style.opacity = 0;
				}
			}
		}

		infoPanelArrow.style.opacity = opacity;
	}, animationSpeed);
}


initializeArrow();
animateArrow();











function sandboxHack() {
	function activateMain(temp1) {
        function returnModule(par) {
            for ( let i in temp1 ) {
                let tie = temp1[`${i}`].exports
                for (let j in tie) {
                    if ( j == par ) {
                        return tie
                    }
                }
            }
        }
        function returnModuleIfName(par) {
            for (let i in temp1) {
                let tie = temp1[`${i}`].exports
                if (tie.name == par) {
                    return tie
                }
            }
        }
        const hack = {
			keyBindings: {
				isCPressed: false,
				cTimer: null,
				isZPressed: false
			},
			playerMoveData: {
				lastHorizontalDirection: 1,
				isDashingDown: false,
				isDashingUp: false,
				lastDashTime: 0,
				dashDuration: 100,
				dashEndTime: 0,
				isDoubleJumpAllowed: false,
				airDashAvailable: true,
				newMovementIsOn: false,
			},
			bindKeys: function() {
				document.addEventListener('keydown', function(event) {
					if (event.key === 'Escape') {
						const panel = document.getElementById('someData')
						const panel1 = document.getElementById('controlPanel')
                        const panel2 = document.getElementById('buttonContainer')
						if (panel.style.display === 'none') {
							panel.style.display = 'block'
                            panel2.style.display = 'flex'
						} else {
							panel.style.display = 'none'
                            panel2.style.display = 'none'
						}
						if (panel1.style.display === 'none') {
							panel1.style.display = 'flex'
						} else {
							panel1.style.display = 'none'
						}
					}
					if (event.key.toLowerCase() === 's' && event.repeat) {
						if (!hack.vars.modeIsOn) {
							hack.getters.me.p.mass = 3
						}
					}
					if (event.key.toLowerCase() === 'z' && !event.repeat) {
						hack.keyBindings.isZPressed = true
					} else if (event.repeat) {
						hack.keyBindings.isZPressed = false
					}
					if (event.key.toLowerCase() === 'c') {
						hack.keyBindings.isCPressed = true
						if (!hack.keyBindings.cTimer) {
							hack.keyBindings.cTimer = setTimeout(() => {
								hack.keyBindings.isCPressed = false
								hack.keyBindings.cTimer = null
							}, 250)
						}
					}
				})
				document.addEventListener('keyup', function(event) {
					if (event.key.toLowerCase() === 's') {
						if (!hack.vars.modeIsOn) {
							hack.getters.me.p.mass = 1
						}
					}
					if (event.key.toLowerCase() === 'z') {
						hack.keyBindings.isZPressed = false
					}
					if (event.key.toLowerCase() === 'c') {
						hack.keyBindings.isCPressed = false
						if (hack.keyBindings.cTimer) {
							clearTimeout(hack.keyBindings.cTimer)
							hack.keyBindings.cTimer = null
						}
					}
				})
			},
			getters: {
				client: returnModule('onReady'),
				gf: returnModule('pointBetweenTwoPointsGivenXorYvalue'),
				gp: returnModule('deleteCounter'),
				graphics: returnModule('makeSpriteFromImageUrl'),
				mode: returnModule('playerMovement'),
				envirData: returnModuleIfName('envirData'),
				network: returnModule('getAllSupporters'),
				physics: returnModule('createRay'),
                rBio: returnModuleIfName('rBio'),
				ghost: false,
				get me() {
					return this.mode.player.gpData;
				},
				get ray() {
					return this.me.ray;
				},
				get velocity() {
					return this.me.p.velocity;
				},
				get otherPlayers() {
					return this.mode.otherPlayers;
				}
			},
            vars: {
                blacklisted: { data: [], names: [] },
				get isGround() {
					return isGrounded()
				},
				mult: 1,
				lrSpd: 3,
				udSpd: 3,
				get currentPosX() {
					return Math.round(hack.getters.me.getX() * 100) / 100
				},
				get currentPosY() {
					return Math.round(hack.getters.me.getY() * 100) / 100
				},
				get totalSpd() {
					return (((this.lrSpd + this.udSpd) / 2) * this.mult)
				},
				get currentSpdX() {
					return Math.round(hack.getters.me.p.velocity[0] * 100) / 100
				},
				get currentSpdY() {
					return Math.round(hack.getters.me.p.velocity[1] * 100) / 100
				},
				multSpdIsOn: false,
				modeIsOn: false,
				ghost1: false,
			},
			suppFuncs: {
				getMult: () => {
					if (hack.vars.mult < 3) {
						return 1
					} else if (hack.vars.mult < 4) {
						return 2
					}
				},
				setMult: function(e) {
					if (e != undefined) {
						hack.vars.lrSpd = hack.vars.udSpd = e
						return
					}
					if (hack.suppFuncs.getMult() === 1) {
						hack.vars.mult++
					} else if (hack.suppFuncs.getMult() === 2) {
						hack.vars.mult += 2
					} else {
						hack.vars.mult = 1
					}
				},
                processBlacklistData: function() {
					// 1. Добавляем новых игроков
					for (let name of hack.vars.blacklisted.names) {
						const index = hack.suppFuncs.getIndexByName(name);

						if (index !== false) { // Убедимся, что игрок найден
							const alreadyExists = hack.vars.blacklisted.data.some(entry => {
								return entry && entry[1] === name;
							});

							if (!alreadyExists) {
								hack.vars.blacklisted.data.push([index, name]);
							}
						}
					}
					// 2. Удаляем устаревшие записи
					if (hack.vars.blacklisted.data.length) {
						hack.vars.blacklisted.data = hack.vars.blacklisted.data.filter(entry => {
							return entry && entry[1] && hack.vars.blacklisted.names.includes(entry[1]);
						});
					}
				},
				getIndexByName: function(playerName) {
					const index = hack.getters.otherPlayers.findIndex(player => player?.myName === playerName)
					return index === -1 ? false : index
				}
			},
			functions: {
				godModeEnable: () => {
					hack.vars.ghost1 = true
					hack.getters.me.p.collisionResponse = false
					hack.getters.me.p.mass = 0
					hack.vars.modeIsOn = true
					hack.getters.velocity[0] = 0
					hack.getters.velocity[1] = 0
				},
				godModeDisable: () => {
					hack.vars.ghost1 = false
					hack.getters.me.p.collisionResponse = true
					hack.getters.me.p.mass = 1
					hack.vars.modeIsOn = false
					hack.getters.velocity[0] = 0
					hack.getters.velocity[1] = 0
				},
				multSpdEnable: () => {
					hack.vars.lrSpd *= hack.vars.mult
					hack.vars.udSpd *= hack.vars.mult
					hack.vars.multSpdIsOn = true
				},
				multSpdDisable: () => {
					hack.vars.lrSpd /= hack.vars.mult
					hack.vars.udSpd /= hack.vars.mult
					hack.vars.multSpdIsOn = false
				}
			},
			logFuncs: {
				logModeIsOn: () => {
					console.log('modeIsOn:', hack.vars.modeIsOn)
				},
				logSpd: () => {
					console.log('speed:', ((hack.vars.lrSpd + hack.vars.udSpd) / 2) * hack.vars.mult)
				}
			}
		}
        window.hack = hack;

        hack.getters.mode.processOthersPlayerData = function() {
			hack.suppFuncs.processBlacklistData();
			if (0 != hack.getters.mode.othersPlayerNetworkData.length) {
				var currentPlayersIndex = [];
				for (var x = 0; x < hack.getters.mode.othersPlayerNetworkData.length; x++) {
					for (var y = 0; y < hack.getters.mode.othersPlayerNetworkData[x].length; y++) {
						var data = hack.getters.mode.othersPlayerNetworkData[x][y];
						var index = data[0];
						var xVelo = data[1];
						var yVelo = data[2];
						var xAxis = data[3];
						var yAxis = data[4];

                        let isBlacklisted = false;
						for (let iterator = 0; iterator < hack.vars.blacklisted.data.length; iterator++) {
							if (hack.vars.blacklisted.data[iterator] && hack.vars.blacklisted.data[iterator].includes(index)) {
								isBlacklisted = true;
                                break;
							}
						}
						if (isBlacklisted) {
							continue;
						}

						if (typeof hack.getters.mode.otherPlayers[index] == "undefined" || hack.getters.mode.otherPlayers[index] == null) {
								hack.getters.mode.oldPlayersIndex[hack.getters.mode.oldPlayersIndex.length] = index;
								var person = new Object();
								person.myName = "";
								person.mySkin = 0,
								person.reset = Infinity;
								person.gpData = hack.getters.mode.createPlayer();
								person.gpData.g.myIndex = index;
								hack.getters.mode.otherPlayers[index] = person;
								hack.getters.mode.enableEmit && hack.getters.rBio?.fire(hack.getters.network.gsSocket, index);
								hack.getters.gp.gWorld.removeChild(person.gpData.g);
								hack.getters.gp.gWorld.mid.addChild(person.gpData.g)
                        }


						if (10 < hack.getters.mode.otherPlayers[index].reset) {
								hack.getters.mode.otherPlayers[index].gpData.setX(xAxis);
								hack.getters.mode.otherPlayers[index].gpData.setY(yAxis);
								hack.getters.mode.otherPlayers[index].reset = 0
                        }
						hack.getters.mode.otherPlayers[index].reset++;
						hack.getters.mode.otherPlayers[index].gpData.p.velocity[0] = xVelo;
						hack.getters.mode.otherPlayers[index].gpData.p.velocity[1] = yVelo;
						currentPlayersIndex[currentPlayersIndex.length] = index;
					}
				}
				var result = hack.getters.gf.difference(hack.getters.mode.oldPlayersIndex, currentPlayersIndex);
				for (var i = 0; i < result.length; i++) {
					var person = hack.getters.mode.otherPlayers[result[i]];
					if (null != person) {
						hack.getters.gp.gWorld.children[1].removeChild(person.gpData.g);
						hack.getters.gp.pWorld.removeBody(person.gpData.p);
						hack.getters.gp.list[hack.getters.gp.list.indexOf(person.gpData)] = null;
						hack.getters.gp.deleteCounter++;
						hack.getters.mode.otherPlayers[result[i]] = null;
                    }

				}
				hack.getters.mode.oldPlayersIndex = currentPlayersIndex;
				hack.getters.mode.othersPlayerNetworkData = [];
			}
		}

        const style = document.createElement('style');
        style.innerHTML = `
          .fixed-container { position: fixed; z-index: 1000; font-family: Arial, sans-serif; color: #fff; }
          .transparent-bg { background-color: rgba(0, 0, 0, 0.7); }
          .no-bg { background-color: transparent; }
          .button-container { display: flex; justify-content: flex-start; gap: 10px; top: 0; left: 0; padding: 4px; z-index: 1001; }
          .tab-button { font-size: 0.6em; cursor: pointer; }
          .data-container { top: 0; left: -12px; padding: 25px 5px 5px; margin-left: 10px; text-align: left; font-size: 14px; }
          .tab-content { display: none; }
          .tab-content.active { display: block; }
          .cosmetics-container { display: flex; flex-direction: column; gap: 10px; margin-left: 1px; }
          .form-row { display: flex; align-items: center; }
          .form-row label { width: 100px; text-align: left; margin: 0; }
          .form-row input { width: 142px; }
          .btn { padding: 5px 10px; cursor: pointer; }
          .control-panel { display: flex; flex-direction: column; gap: 10px; margin-left: 1px; bottom: 0; left: 0; font-size: 14px; background-color: transparent; color: rgba(255, 255, 255, 1); }
          .control-panel button { padding: 2px 10px; cursor: pointer; }
        `;
        document.head.appendChild(style);

        document.body.insertAdjacentHTML("beforeend", `
          <div id="buttonContainer" class="fixed-container button-container no-bg">
            <button class="tab-button active" onclick="openTab('info', event)">Info</button>
            <button class="tab-button" onclick="openTab('cosmetics', event)">Cosmetics</button>
            <button class="tab-button" onclick="openTab('blacklist', event)">Blacklist</button>
          </div>
          <div id="someData" class="fixed-container data-container transparent-bg">
            <div id="infoTab" class="tab-content active"></div>
            <div id="cosmeticsTab" class="tab-content"></div>
            <div id="blacklistTab" class="tab-content"></div>
          </div>
        `);

        document.getElementById("cosmeticsTab").innerHTML = `
          <div class="cosmetics-container no-bg">
            <div class="form-row" style="justify-content: flex-end;"> <label for="bgColorInput" style="width: 70px; text-align: left; margin-right: 10px;">Фон:</label> <input type="color" id="bgColorInput" style="width: 150px;" value="#000000"> </div>
            <div class="form-row" style="justify-content: flex-end;"> <label for="textColorInput" style="width: 70px; text-align: left; margin-right: 10px;">Текст:</label> <input type="color" id="textColorInput" style="width: 150px;" value="#ffffff"> </div>
            <div class="form-row" style="justify-content: flex-end;"> <label for="bgOpacityInput" style="width: 70px; text-align: left; margin-right: 10px;">Прозрачн. фона:</label> <input type="number" id="bgOpacityInput" min="0" max="1" step="0.1" value="0.7" style="width: 142px;"> </div>
            <div class="form-row" style="justify-content: flex-end;"> <label for="textOutlineCheckbox" style="width: 70px; text-align: left; margin-right: 10px;">Обводка:</label> <input type="checkbox" id="textOutlineCheckbox"> </div>
            <div style="text-align: center; margin-top: 10px;"> <button class="btn" onclick="applyCosmetics()">Применить</button> </div>
          </div>
        `;

        document.getElementById("blacklistTab").innerHTML = `
          <div class="cosmetics-container no-bg" style="padding: 5px;">
            <div class="form-row" style="display: flex; align-items: center; gap: 10px; width: max-content;">
              <label for="blacklistInput" style="min-width: 70px; text-align: left;">Никнейм</label>
              <input type="text" id="blacklistInput" style="width: 150px;">
              <button class="btn" onclick="addBlacklistName()">Добавить</button>
            </div>
            <div id="blacklistContainer" style="margin-top: 10px; max-height: 175px; overflow-y: auto; font-size: 12px;"></div>
          </div>
        `;

		const updateData = () => {
            const o = [];
            o.push("<b>POSITION INFO</b>");
            o.push(`  current Pos X: ${hack.vars.currentPosX}`);
            o.push(`  current Pos Y: ${hack.vars.currentPosY}`);
            o.push("<br><b>SPEED INFO</b>");
            o.push(`  total Spd: ${hack.vars.totalSpd}`);
            o.push(`  current Spd X: ${hack.vars.currentSpdX}`);
            o.push(`  current Spd Y: ${hack.vars.currentSpdY}`);
            o.push("<br><b>SCRIPT VALUES</b>");
            o.push(`  mult Spd Is On: ${hack.vars.multSpdIsOn}`);
            o.push(`  mode Is On: ${hack.vars.modeIsOn}`);
            o.push("<br><b>MOVEMENT VALUES</b>");
            o.push(`  new Movement Is On: ${hack.playerMoveData.newMovementIsOn}`);
			document.getElementById("infoTab").innerHTML = o.join('<br>');
		}

        document.body.insertAdjacentHTML("beforebegin", `
          <div id="controlPanel" style="display: flex; flex-direction: column; gap: 5px; position: fixed; bottom: 0px; left: 0px; height: auto; text-align: left; font-size: 14px; background-color: rgba(0, 0, 0, 0.7); color: rgba(255, 255, 255, 1); font-family: Arial, sans-serif; padding: 5px;">
            <div style="display: flex; align-items: center; gap: 5px;">
              <span>new movement:</span>
              <button id="newMoveBtn" style="padding: 0 6px; height: 18px; line-height: 18px; display: flex; align-items: center; justify-content: center; box-sizing: border-box;">${hack.playerMoveData.newMovementIsOn}</button>
            </div>
          </div>
        `);

		const updateButtonStates = () => {
			document.getElementById("newMoveBtn").innerText = hack.playerMoveData.newMovementIsOn
		}

		document.getElementById("newMoveBtn").addEventListener("click", () => {
			if (!hack.playerMoveData.newMovementIsOn) {
				newMovement()
			} else {
				oldMovement()
			}
			updateButtonStates()
		})

		setInterval(updateData, 100 / 6)
		updateButtonStates()
		setInterval(updateButtonStates, 100 / 6)
		hack.bindKeys()

		let scrActivate = function() {
            setTimeout(() => window.loadCosmetics(), 0);
			hack.getters.client.loopFunctions[2].timeOut = 100 / 6
			hack.getters.client.loopFunctions[3].timeOut = 0
			oldMovement()
			Object.defineProperty(hack.vars, 'mult', { enumerable: false })
			Object.defineProperty(hack.vars, 'lrSpd', { enumerable: false })
			Object.defineProperty(hack.vars, 'udSpd', { enumerable: false })
			Object.defineProperty(hack.vars, 'multSpdIsOn', { enumerable: false })
			Object.defineProperty(hack.vars, 'ghost1', { enumerable: false })
			Object.defineProperty(hack.playerMoveData, 'lastDashTime', { enumerable: false })
			Object.defineProperty(hack.playerMoveData, 'lastHorizontalDirection', { enumerable: false })
			Object.defineProperty(hack.playerMoveData, 'dashDuration', { enumerable: false })
			Object.defineProperty(hack.playerMoveData, 'dashEndTime', { enumerable: false })
			Object.defineProperty(hack.playerMoveData, 'newMovementIsOn', { enumerable: false })
		}

		hack.getters.client.findUntilFound = function(e, t, n) {
			hack.getters.network.gsip = e;
			hack.getters.network.gsrn = t;
			hack.getters.network.getSID?.((sid) => {
				hack.getters.network.sid = sid;
				hack.getters.network.connectToGs?.(hack.getters.network.gsip, () => {
					console.log("connected to gs");

					hack.getters.client.verifyIsHuman?.(() => {
						hack.getters.network.registerSidOnGs?.((verifyStatus) => {
							console.log("verified on gs server", verifyStatus);

							if (verifyStatus === "") {
								alert("You are already playing the game in another browser tab.");
								location.reload();
								n(2);
							} else {
								hack.getters.network.joinRoom?.(hack.getters.network.gsrn, (joinStatus) => {
									if (joinStatus === 1) {
										hack.getters.client.sendPlayingInfo?.(hack.getters.client.roomId, () => {
											hack.getters.client.onReady?.();
											n(1);
											scrActivate()
										});
									} else {
										console.log("else");
										hack.getters.network.gsSockehack?.getters.client.disconnect?.();

										do {
											hack.getters.client.rIndex++;
											const currentDataCenter = hack.getters.network.dataCenters?.[hack.getters.client.dcIndex];

											if (!currentDataCenter?.[hack.getters.client.rIndex]) {
												hack.getters.client.dcIndex++;
												hack.getters.client.rIndex = 0;

												if (!hack.getters.network.dataCenters?.[hack.getters.client.dcIndex]) {
													alert("It seems all servers are full. Please refresh your page and try again.");
													location.reload();
													return;
												}
											}
										} while (hack.getters.network.dataCenters?.[hack.getters.client.dcIndex]?.[hack.getters.client.rIndex]?.[2] !== hack.getters.client.modeInfo.mp);

										const newGsip = hack.getters.network.dataCenters?.[hack.getters.client.dcIndex]?.[hack.getters.client.rIndex]?.[1];
										const newGsrn = hack.getters.network.dataCenters?.[hack.getters.client.dcIndex]?.[hack.getters.client.rIndex]?.[3];
										hack.getters.client.roomId = hack.getters.network.dataCenters?.[hack.getters.client.dcIndex]?.[hack.getters.client.rIndex]?.[4];

										hack.getters.client.findUntilFound(newGsip, newGsrn, n);
									}
								});
							}
						});
					});
				});
			});
		};

		document.body.onkeyup = (event) => {
			const key = event.key
			switch (key) {
				case 'PageUp':
					if (!hack.vars.modeIsOn) {
						hack.getters.me.p.gravityScale = 1
						hack.getters.me.p.collisionResponse = 1
					}
					break;
				case 'PageDown':
					if (!hack.vars.modeIsOn) {
						hack.getters.me.p.collisionResponse = 1
					}
					break;
			}
		}

		document.body.onkeydown = (event) => {
			const key = event.key;
			switch (key) {
				case 'PageUp':
					if (!hack.vars.modeIsOn) {
						hack.getters.me.p.gravityScale = -1
						hack.getters.me.p.collisionResponse = 0
					}
					break;
				case 'PageDown':
					if (!hack.vars.modeIsOn) {
						hack.getters.me.p.gravityScale = 1
						hack.getters.me.p.collisionResponse = 0
					}
					break;
				case 'F2':
					if (!hack.vars.modeIsOn) {
						hack.functions.godModeEnable();
						hack.logFuncs.logModeIsOn();
						hack.functions.multSpdEnable();
					} else {
						hack.functions.godModeDisable();
						hack.logFuncs.logModeIsOn();
						hack.functions.multSpdDisable();
					}
					break;
				case '`': // Backtick (`)
				case 'ё'.toLowerCase(): // Cyrillic Yo (часто на той же клавише, что и Backtick)
					if (hack.vars.modeIsOn) {
						hack.suppFuncs.setMult();
						hack.logFuncs.logSpd();
					}
					break;
			}
		};

		function isGrounded() {
			const meX = hack.getters.me.getX()
			const meY = hack.getters.me.getY()
			const ray = hack.getters.ray
			const physics = hack.getters.physics
			const gpPWorld = hack.getters.gp.pWorld
			const rayResult = hack.getters.me.ray.result
			const rayHitPoint = (hack.getters.ray.hitPoint = [Infinity, Infinity])

			const verticalOffset = 50
			const checkYPosition = meY + 45

			for (let i = 0; i < 121; i++) {
				const o = meX - 15 + i * (30 / 120)
				const s = checkYPosition
				const u = s + verticalOffset

				ray.from = [physics.xAxis(o, 0), physics.yAxis(s, 0)]
				ray.to = [physics.xAxis(o, 0), physics.yAxis(u, 0)]

				ray.update()
				rayResult.reset()

				if (gpPWorld.raycast(rayResult, ray)) {
					rayResult.getHitPoint(rayHitPoint, ray)
					const hitDistance = rayResult.getHitDistance(ray)

					if (rayResult.shape.ref.getCollision() && hitDistance < 0.1) {
						return true
					}
				}
			}

			return false
		}

		function newMovement() {
			hack.getters.client.loopFunctions[2].fun = function() {
				const currentTime = Date.now()
				const dashCooldown = 250
				const dashDistance = 2.5
				const dashSpeed = 25
				const grounded = isGrounded()

				if (grounded) {
					hack.playerMoveData.airDashAvailable = true
				}

				if (hack.getters.mode.moveLeft) {
					hack.playerMoveData.lastHorizontalDirection = -1
				} else if (hack.getters.mode.moveRight) {
					hack.playerMoveData.lastHorizontalDirection = 1
				}

				if (
					hack.keyBindings.isCPressed &&
					hack.getters.mode.moveDown &&
					currentTime - hack.playerMoveData.lastDashTime >= dashCooldown &&
					!hack.playerMoveData.isDashingDown &&
					(grounded || (!grounded && hack.playerMoveData.airDashAvailable))
				) {
					hack.playerMoveData.lastDashTime = currentTime
					hack.playerMoveData.isDashingDown = true
					hack.playerMoveData.dashDuration = (dashDistance / dashSpeed) * 1000
					hack.playerMoveData.dashEndTime = currentTime + hack.playerMoveData.dashDuration
					if (!grounded) {
						hack.playerMoveData.airDashAvailable = false
					}
				}

				if (
					hack.keyBindings.isCPressed &&
					hack.getters.mode.moveUp &&
					currentTime - hack.playerMoveData.lastDashTime >= dashCooldown &&
					!hack.playerMoveData.isDashingUp &&
					(grounded || (!grounded && hack.playerMoveData.airDashAvailable))
				) {
					hack.playerMoveData.lastDashTime = currentTime
					hack.playerMoveData.isDashingUp = true
					hack.playerMoveData.dashDuration = (dashDistance / dashSpeed) * 1000
					hack.playerMoveData.dashEndTime = currentTime + hack.playerMoveData.dashDuration
					if (!grounded) {
						hack.playerMoveData.airDashAvailable = false
					}
				}

				if (
					hack.keyBindings.isCPressed &&
					currentTime - hack.playerMoveData.lastDashTime >= dashCooldown &&
					!hack.playerMoveData.isDashing &&
					(grounded || (!grounded && hack.playerMoveData.airDashAvailable))
				) {
					hack.playerMoveData.lastDashTime = currentTime
					hack.playerMoveData.isDashing = true
					hack.playerMoveData.dashVelocity = dashSpeed * hack.playerMoveData.lastHorizontalDirection
					hack.playerMoveData.dashDuration = (dashDistance / dashSpeed) * 1000
					hack.playerMoveData.dashEndTime = currentTime + hack.playerMoveData.dashDuration
					if (!grounded) {
						hack.playerMoveData.airDashAvailable = false
					}
				}

				if (hack.playerMoveData.isDashingDown) {
					hack.getters.mode.player.gpData.p.velocity[1] = -dashSpeed
					hack.getters.mode.player.gpData.p.velocity[0] = 0
					hack.getters.me.p.collisionResponse = false
					if (currentTime >= hack.playerMoveData.dashEndTime) {
						hack.playerMoveData.isDashingDown = false
						hack.getters.mode.player.gpData.p.velocity[1] = 0
						if (!hack.vars.modeIsOn) {
							hack.getters.me.p.collisionResponse = true
						}
					}
					return
				}

				if (hack.playerMoveData.isDashingUp) {
					hack.getters.mode.player.gpData.p.velocity[1] = dashSpeed
					hack.getters.mode.player.gpData.p.velocity[0] = 0
					hack.getters.me.p.collisionResponse = false
					if (currentTime >= hack.playerMoveData.dashEndTime) {
						hack.playerMoveData.isDashingUp = false
						hack.getters.mode.player.gpData.p.velocity[1] = 0
						if (!hack.vars.modeIsOn) {
							hack.getters.me.p.collisionResponse = true
						}
					}
					return
				}

				if (hack.playerMoveData.isDashing) {
					hack.getters.mode.player.gpData.p.velocity[0] = hack.playerMoveData.dashVelocity
					hack.getters.mode.player.gpData.p.velocity[1] = 0
					hack.getters.me.p.collisionResponse = false
					if (currentTime >= hack.playerMoveData.dashEndTime) {
						hack.playerMoveData.isDashing = false
						hack.getters.mode.player.gpData.p.velocity[0] = 0
						if (!hack.vars.modeIsOn) {
							hack.getters.me.p.collisionResponse = true
						}
					}
					return
				} else {
					if (hack.getters.mode.moveRight) {
						hack.getters.mode.player.gpData.p.velocity[0] = hack.vars.lrSpd * hack.vars.mult
					} else if (hack.getters.mode.moveLeft) {
						hack.getters.mode.player.gpData.p.velocity[0] = -hack.vars.lrSpd * hack.vars.mult
					}
				}

				if (grounded) {
					hack.playerMoveData.isDoubleJumpAllowed = true
					if (hack.keyBindings.isZPressed) {
						hack.keyBindings.isZPressed = false
						hack.getters.velocity[1] = 8 * (hack.getters.me.p.gravityScale)
					}
				} else if (hack.playerMoveData.isDoubleJumpAllowed && hack.keyBindings.isZPressed) {
					hack.keyBindings.isZPressed = false
					hack.getters.velocity[1] = 8 * (hack.getters.me.p.gravityScale)
					hack.playerMoveData.isDoubleJumpAllowed = false
				}

				if (hack.vars.ghost1) {
					if (hack.getters.mode.moveUp) {
						hack.getters.velocity[1] = hack.vars.udSpd * hack.vars.mult
					}
					if (hack.getters.mode.moveDown) {
						hack.getters.velocity[1] = -hack.vars.udSpd * hack.vars.mult
					}
					if (!hack.getters.mode.moveUp && !hack.getters.mode.moveDown) {
						hack.getters.velocity[1] = 0
					}
				}
			}
			hack.playerMoveData.newMovementIsOn = true
		}

		function oldMovement() {
			hack.getters.client.loopFunctions[2].fun = function() {
				const grounded = isGrounded()

				if (hack.getters.mode.moveRight) {
					hack.getters.mode.player.gpData.p.velocity[0] = hack.vars.lrSpd * hack.vars.mult
				} else if (hack.getters.mode.moveLeft) {
					hack.getters.mode.player.gpData.p.velocity[0] = -hack.vars.lrSpd * hack.vars.mult
				}
				if (grounded) {
					if (hack.getters.mode.moveUp) {
						hack.getters.velocity[1] = 8
					}
				}
				if (hack.vars.ghost1) {
					if (hack.getters.mode.moveUp) {
						hack.getters.velocity[1] = hack.vars.udSpd * hack.vars.mult
					}
					if (hack.getters.mode.moveDown) {
						hack.getters.velocity[1] = -hack.vars.udSpd * hack.vars.mult
					}
					if (!hack.getters.mode.moveUp && !hack.getters.mode.moveDown) {
						hack.getters.velocity[1] = 0
					}
				}
			}
			hack.playerMoveData.newMovementIsOn = false
		}

		addEventListener("mousewheel", e => {
			window.tweenObjects.map(x => {
				try {
					if (e.shiftKey) {
						hack.getters.mode.player.gpData.p.velocity[0] = -Math.sign(e.deltaY) * 15;
					} else {
						hack.getters.mode.player.gpData.p.velocity[1] = -Math.sign(e.deltaY) * 15;
					}
				} catch (err) {
					console.error(err);
				}
			});
		});

	}

	let temp1 = {};
	const _call = Function.prototype.call;
	new Promise((resolve, reject) => {
		Function.prototype.call = function(...args) {
			if (args[2]?.exports) {
				temp1 = args[6]
				Function.prototype.call = _call
				console.log(temp1)
				resolve(temp1)
			}
			return _call.apply(this, args)
		};
	}).then((result) => {
		if (Object.keys(result).length > 0) {
			activateMain(result)
		} else {
			console.log("temp1 is empty")
		}
	}).catch((error) => {
		console.error("An error occurred:", error)
	})
}





















function twoPlayerHack() {
    function activateMain(temp1) {
        function returnModuleIfName(par) {
            for (let i in temp1) {
                let tie = temp1[`${i}`].exports
                if (tie.name == par) {
                    return tie
                }
            }
        }
        function returnModule(par) {
            for ( let i in temp1 ) {
				let tie = temp1[`${i}`].exports
                for (let j in tie) {
                    if ( j == par ) {
                        return tie
                    }
                }
            }
        }
        function handleKeyDown(event) {
            if (event.repeat) return;

            const mode = hack.getters.mode;
            const velocity = mode.player.gpData.p.velocity

            switch (event.key) {
                case "ArrowLeft":
                    mode.moveLeft = true;
                    mode.moveRight = false;
                    break;
                case "ArrowRight":
                    mode.moveRight = true;
                    mode.moveLeft = false;
                    break;
                case "ArrowUp":
                    mode.moveUp = true;
                    mode.moveDown = false;
                    break;
                case "ArrowDown":
                    mode.moveDown = true;
                    mode.moveUp = false;
                    break;
            }
        }

        function handleKeyUp(event) {
            const mode = hack.getters.mode;
            const velocity = mode.player.gpData.p.velocity

            switch (event.key) {
                case "ArrowLeft":
                    mode.moveLeft = false;
                    velocity[0] = 0;
                    break;
                case "ArrowRight":
                    mode.moveRight = false;
                    velocity[0] = 0
                    break;
                case "ArrowUp":
                    mode.moveUp = false;
                    break;
                case "ArrowDown":
                    mode.moveDown = false;
                    break;
            }
        }


		const hack = {
			keyBindings: {
				isCPressed: false,
				cTimer: null,
				isZPressed: false,
                isZRepeat: false
			},
			playerMoveData: {
				lastHorizontalDirection: 1,
				isDashingDown: false,
				isDashingUp: false,
				lastDashTime: 0,
				dashDuration: 100,
				dashEndTime: 0,
				isDoubleJumpAllowed: false,
				airDashAvailable: true,
				newMovementIsOn: true,
				division: 120,
				meYplus: 45,
			},
			bindKeys: function() {




                document.addEventListener("keydown", (event) => {
                    if (event.key === "Shift") {
                        hack.vars.shiftPressed = true;
                    }
                });

                document.addEventListener("keyup", (event) => {
                    if (event.key === "Shift") {
                        hack.vars.shiftPressed = false;
                    }
                });





				document.addEventListener('keydown', function(event) {
					if (event.key === 'Escape') {
						const panel = document.getElementById('someData')
						const panel1 = document.getElementById('controlPanel')
                        const panel2 = document.getElementById('buttonContainer')
						if (panel.style.display === 'none') {
							panel.style.display = 'block'
                            panel2.style.display = 'flex'
						} else {
							panel.style.display = 'none'
                            panel2.style.display = 'none'
						}
						if (panel1.style.display === 'none') {
							panel1.style.display = 'flex'
						} else {
							panel1.style.display = 'none'
						}
					}
					if (event.key.toLowerCase() === 's' && event.repeat) {
						if (!hack.vars.modeIsOn) {
							hack.getters.me.p.mass = 3
						}
					}

                    if (event.key.toLowerCase() === 'z') {
                        hack.keyBindings.isZPressed = true;
                        if (event.repeat) {hack.vars.isZRepeat = true; hack.keyBindings.isZPressed = false}
                    }

					if (event.key.toLowerCase() === 'c') {
						hack.keyBindings.isCPressed = true
						if (!hack.keyBindings.cTimer) {
							hack.keyBindings.cTimer = setTimeout(() => {
								hack.keyBindings.isCPressed = false
								hack.keyBindings.cTimer = null
							}, 250)
						}
					}
				})
				document.addEventListener('keyup', function(event) {
					if (event.key.toLowerCase() === 's') {
						if (!hack.vars.modeIsOn) {
							hack.getters.me.p.mass = 1
						}
					}
                    if (event.key.toLowerCase() === 'z') {
                        hack.keyBindings.isZPressed = false;
                        hack.vars.isZRepeat = false
                    }
					if (event.key.toLowerCase() === 'c') {
						hack.keyBindings.isCPressed = false
						if (hack.keyBindings.cTimer) {
							clearTimeout(hack.keyBindings.cTimer)
							hack.keyBindings.cTimer = null
						}
					}
				})
			},
			getters: {
				client: returnModule('onReady'),
				gf: returnModule('pointBetweenTwoPointsGivenXorYvalue'),
				gp: returnModule('deleteCounter'),
				graphics: returnModule('makeSpriteFromImageUrl'),
				guiComponentsKick: returnModule('showUser'),
				mode: returnModule('playerMovement'),
				envirData: returnModuleIfName('envirData'),
				remote_kickPlayer: returnModuleIfName('kickPlayer'),
                myStatus: returnModuleIfName('myStatus'),
				rBio: returnModuleIfName('rBio'),
				rGho: returnModuleIfName('rGho'),
				modules_resultScreen: returnModule('showResultScreen'),
				network: returnModule('getAllSupporters'),
				keyboardjs: returnModule('KeyCombo'),
				physics: returnModule('createRay'),
				get me() {
					return hack.getters.mode.player.gpData
				},
				get ray() {
					return hack.getters.me.ray
				},
				get velocity() {
					return hack.getters.me.p.velocity
				},
				get otherPlayers() {
					return hack.getters.mode.otherPlayers
				},
			},
			vars: {
                shiftPressed: false,
				blacklisted: {
					data: [],
					names: []
				},
				get isGround() {
					return isGrounded()
				},
				tpToOtherByClickIsOn: false,
				indexByClick: 0,
				mult: 1,
				lrSpd: 3,
				udSpd: 3,
				get currentPosX() {
					return Math.round(hack.getters.me.getX() * 100) / 100
				},
				get currentPosY() {
					return Math.round(hack.getters.me.getY() * 100) / 100
				},
				pX: 0,
				pY: 0,
				get totalSpd() {
					return (((this.lrSpd + this.udSpd) / 2) * this.mult)
				},
				get currentSpdX() {
					return Math.round(hack.getters.me.p.velocity[0] * 100) / 100
				},
				get currentSpdY() {
					return Math.round(hack.getters.me.p.velocity[1] * 100) / 100
				},
				multSpdIsOn: false,
				modeIsOn: false,
				immIsOn: false,
				MMGIsOn: false,
				interTpToOtherIsOn: false,
				ghost1: false,
				ghost2: false,
				isPlayerDead: false,
				tpSpawnCounter: 0,
			},
			suppFuncs: {
				getMult: () => {
					if (hack.vars.mult < 3) {
						return 1
					} else if (hack.vars.mult < 4) {
						return 2
					}
				},
				setMult: function(e) {
					if (e != undefined) {
						hack.vars.lrSpd = hack.vars.udSpd = e
						return
					}
					if (hack.suppFuncs.getMult() === 1) {
						hack.vars.mult++
					} else if (hack.suppFuncs.getMult() === 2) {
						hack.vars.mult += 2
					} else {
						hack.vars.mult = 1
					}
				},
				getIndexByName: function(playerName) {
					const index = hack.getters.otherPlayers.findIndex(player => player?.myName === playerName)
					return index === -1 ? false : index
				},
				processBlacklistData: function() {
					// 1. Добавляем новых игроков
					for (let name of hack.vars.blacklisted.names) {
						const index = hack.suppFuncs.getIndexByName(name);

						if (index) {
							const alreadyExists = hack.vars.blacklisted.data.some(entry => {
								return entry && entry[1] === name;
							});

							if (!alreadyExists) {
								hack.vars.blacklisted.data.push([index, name]);
							}
						}
					}
					// 2. Удаляем устаревшие записи
					if (hack.vars.blacklisted.data.length) {
						hack.vars.blacklisted.data = hack.vars.blacklisted.data.filter(entry => {
							return entry && entry[1] && hack.vars.blacklisted.names.includes(entry[1]);
						});
					}
				}
			},
			functions: {
				getBio: function(index) {
					let i = hack.getters.mode.otherPlayers[index]
					return {
						get gpData() {
							return hack.getters.me
						},
						get myName() {
							return i.myName
						},
						get mySkin() {
							return i.mySkin
						},
						get whatBro() {
							return i.whatBro
						},
						get chatColor() {
							return i.chatColor
						},
						get teamColor() {
							return i.teamColor
						},
					}
				},
				setBio: function(bio) {
					let mode = hack.getters.mode
					mode.setBio(
						bio.gpData,
						bio.myName,
						bio.mySkin,
						bio.whatBro,
						bio.chatColor,
						bio.teamColor
					)
				},
				prevPos: function() {
					hack.vars.pX = hack.getters.mode.player.gpData.getX()
					hack.vars.pY = hack.getters.mode.player.gpData.getY()
				},
				tpSpawn: function() {
					if (hack.vars.tpSpawnCounter == 0) {
						this.tp(hack.vars.pX, hack.vars.pY);
						hack.vars.tpSpawnCounter++
						return
					} else if (hack.vars.tpSpawnCounter == 1) {
						this.tp(
							hack.getters.mode.spawn.refP.getX(),
							hack.getters.mode.spawn.refP.getY()
						)
					}
					hack.vars.tpSpawnCounter = 0
				},
				tpDoor: function() {
					this.prevPos()
					hack.vars.tpSpawnCounter = 0
					this.tp(
						hack.getters.mode.exitGate.exitGateCounter.refP.getX(),
						hack.getters.mode.exitGate.exitGateCounter.refP.getY()
					)
				},
				tp: function(x, y) {
					hack.getters.mode.player.gpData.setX(x)
					hack.getters.mode.player.gpData.setY(y)
				},
				setTpToOther: function(playerIndex) {
					if (!hack.vars.interTpToOtherIsOn && playerIndex !== false) {
						this.interTpToOther = setInterval(() => {
							hack.getters.me.p.position[0] = hack.getters.otherPlayers[playerIndex].gpData.p.position[0]
							hack.getters.me.p.position[1] = hack.getters.otherPlayers[playerIndex].gpData.p.position[1]
						}, 100 / 14.4)
						hack.vars.interTpToOtherIsOn = true
					} else if (playerIndex === false) {
						try {
							clearInterval(this.interTpToOther)
							hack.vars.interTpToOtherIsOn = false
						} catch {
							console.log('не существующий интервал')
						}
					}
				},
				MMGEnable: function() {
					hack.getters.mode.makeMeGhost = function() {
						hack.getters.me.setAlpha(0.3)
						hack.getters.me.p.shapes[0].sensor = true
						hack.getters.me.p.gravityScale = 0
						hack.getters.velocity[0] = 0
						hack.getters.velocity[1] = 0
						hack.getters.me.me = void 0
						hack.vars.ghost2 = true
						hack.vars.isPlayerDead = true
						hack.getters.rGho.fire(hack.getters.network.gsSocket)
						if (hack.getters.mode.md.mobile()) {
							hack.getters.mode.setupTouchButtons(true)
						}
					}
					hack.vars.MMGIsOn = true
				},
				MMGDisable: function() {
					hack.getters.mode.makeMeGhost = () => {}
					hack.vars.MMGIsOn = false
				},
				immEnable: () => {
					hack.getters.me.me = void 0
					hack.vars.immIsOn = true
				},
				immDisable: () => {
					hack.getters.me.me = true
					hack.vars.immIsOn = false
				},
				godModeEnable: () => {
					hack.vars.ghost1 = true
					hack.getters.me.p.collisionResponse = false
					hack.getters.me.p.mass = 0
					hack.vars.modeIsOn = true
					hack.getters.velocity[0] = 0
					hack.getters.velocity[1] = 0
				},
				godModeDisable: () => {
					hack.vars.ghost1 = false
					hack.getters.me.p.collisionResponse = true
					hack.getters.me.p.mass = 1
					hack.vars.modeIsOn = false
					hack.getters.velocity[0] = 0
					hack.getters.velocity[1] = 0
				},
				multSpdEnable: () => {
					hack.vars.lrSpd *= hack.vars.mult
					hack.vars.udSpd *= hack.vars.mult
					hack.vars.multSpdIsOn = true
				},
				multSpdDisable: () => {
					hack.vars.lrSpd /= hack.vars.mult
					hack.vars.udSpd /= hack.vars.mult
					hack.vars.multSpdIsOn = false
				}
			},
			logFuncs: {
				logModeIsOn: () => {
					console.log('modeIsOn:', hack.vars.modeIsOn)
				},
				logImmIsOn: () => {
					console.log('immIsOn:', hack.vars.immIsOn)
				},
				logSpd: () => {
					console.log('speed:', ((hack.vars.lrSpd + hack.vars.udSpd) / 2) * hack.vars.mult)
				},
				logMMGIsOn: () => {
					console.log('MMGIsOn:', hack.vars.MMGIsOn)
				}
			}
		}

		window.hack = hack

        const style = document.createElement('style');
        style.innerHTML = `
          .fixed-container { position: fixed; z-index: 1000; font-family: Arial, sans-serif; color: #fff; }
          .transparent-bg { background-color: rgba(0, 0, 0, 0.7); }
          .no-bg { background-color: transparent; }
          .button-container { display: flex; justify-content: flex-start; gap: 10px; top: 0; left: 0; padding: 4px; }
          .tab-button { font-size: 0.6em; cursor: pointer; }
          .data-container { top: 25px; left: -12px; padding: 5px; margin-left: 10px; text-align: left; font-size: 14px; }
          .tab-content { display: none; }
          .tab-content.active { display: block; }
          .identity-container, .cosmetics-container { display: flex; flex-direction: column; gap: 10px; margin-left: 1px; }
          .form-row { display: flex; align-items: center; }
          .form-row label { width: 100px; text-align: left; margin: 0; }
          .form-row input { width: 142px; }
          .btn { padding: 5px 10px; cursor: pointer; }
          .control-panel { display: flex; flex-direction: column; gap: 10px; margin-left: 1px; bottom: 0; left: 0; font-size: 14px; background-color: transparent; color: rgba(255, 255, 255, 1); }
          .control-panel button { padding: 2px 10px; cursor: pointer; }
        `;
        document.head.appendChild(style);

        document.body.insertAdjacentHTML("beforeend", `
          <div id="buttonContainer" class="fixed-container button-container no-bg">
            <button class="tab-button active" onclick="openTab('info', event)">Info</button>
            <button class="tab-button" onclick="openTab('cosmetics', event)">Cosmetics</button>
            <button class="tab-button" onclick="openTab('blacklist', event)">Blacklist</button>
            <button class="tab-button" onclick="openTab('identity', event)">Identity</button>
          </div>
          <div id="someData" class="fixed-container data-container transparent-bg">
            <div id="infoTab" class="tab-content active"></div>
            <div id="cosmeticsTab" class="tab-content"></div>
            <div id="blacklistTab" class="tab-content"></div>
            <div id="identityTab" class="tab-content"></div>
          </div>
        `);

        document.getElementById("blacklistTab").innerHTML = `
          <div class="cosmetics-container no-bg" style="padding: 5px;">
            <div class="form-row" style="display: flex; align-items: center; gap: 10px; width: max-content;">
              <label for="blacklistInput" style="min-width: 70px; text-align: left;">Никнейм</label>
              <input type="text" id="blacklistInput" style="width: 150px;">
              <button class="btn" onclick="addBlacklistName()">Добавить</button>
            </div>
            <div id="blacklistContainer" style="margin-top: 10px; max-height: 175px; overflow-y: auto; font-size: 12px;"></div>
          </div>
        `;

        document.getElementById("identityTab").innerHTML = `
        <div class="identity-container no-bg" style="position: relative;">
          <div class="form-row"> <label for="nicknameInput">Никнейм</label> <input type="text" id="nicknameInput" value=""> </div>
          <div class="form-row"> <label for="skinInput">Скин</label> <input type="text" id="skinInput" value=""> </div>
          <div class="form-row"> <label for="vipInput">Вип статус</label> <input type="text" id="vipInput" value=""> </div>
          <div class="form-row"> <label for="chatColorInput">Цв. чата</label> <input type="text" id="chatColorInput" value=""> </div>
          <div class="form-row"> <label for="teamColorInput">Цв. команды</label> <input type="text" id="teamColorInput" value=""> </div>
          <div style="text-align: center; margin-top: 10px;">
            <button class="btn" onclick="
              hack.getters.mode.setMyBio();
              let skinValue = document.getElementById('skinInput').value; if (!skinValue) { skinValue = hack.getters.mode.mySkin; }
              let chatColorValue = document.getElementById('chatColorInput').value; if (!chatColorValue) { chatColorValue = hack.getters.mode.chatColor; }
              let vipValue = document.getElementById('vipInput').value; if (!vipValue) { vipValue = undefined; }
              hack.getters.mode.setBio( hack.getters.mode.player.gpData, document.getElementById('nicknameInput').value, skinValue, vipValue, chatColorValue, document.getElementById('teamColorInput').value )">Применить</button>
          </div>
          <div style="position: absolute; bottom: 0; left: 0;">
            <button class="btn" onclick="
              hack.getters.mode.setMyBio();
              const bio = hack.functions.getBio(hack.vars.indexByClick);
              if (bio) {
                document.getElementById('nicknameInput').value = bio.myName || '';
                document.getElementById('skinInput').value = bio.mySkin || '';
                document.getElementById('vipInput').value = bio.whatBro || '';
                document.getElementById('chatColorInput').value = bio.chatColor || '';
                document.getElementById('teamColorInput').value = bio.teamColor || '';
              }
            ">©</button>
          </div>
        </div>
        `;

        document.getElementById("cosmeticsTab").innerHTML = `
          <div class="cosmetics-container no-bg">
            <div class="form-row" style="justify-content: flex-end;"> <label for="bgColorInput" style="width: 70px; text-align: left; margin-right: 10px;">Фон:</label> <input type="color" id="bgColorInput" style="width: 150px;" value="#000000"> </div>
            <div class="form-row" style="justify-content: flex-end;"> <label for="textColorInput" style="width: 70px; text-align: left; margin-right: 10px;">Текст:</label> <input type="color" id="textColorInput" style="width: 150px;" value="#ffffff"> </div>
            <div class="form-row" style="justify-content: flex-end;"> <label for="bgOpacityInput" style="width: 70px; text-align: left; margin-right: 10px;">Прозрачн. фона:</label> <input type="number" id="bgOpacityInput" min="0" max="1" step="0.1" value="0.7" style="width: 142px;"> </div>
            <div class="form-row" style="justify-content: flex-end;"> <label for="textOutlineCheckbox" style="width: 70px; text-align: left; margin-right: 10px;">Обводка:</label> <input type="checkbox" id="textOutlineCheckbox"> </div>
            <div style="text-align: center; margin-top: 10px;"> <button class="btn" onclick="applyCosmetics()">Применить</button> </div>
          </div>
        `;

        const updateData = () => {
            const o = [];
            o.push("<b>POSITION INFO</b>");
            o.push(`  current Pos X: ${hack.vars.currentPosX}`);
            o.push(`  current Pos Y: ${hack.vars.currentPosY}`);
            o.push("<br><b>SPEED INFO</b>");
            o.push(`  total Spd: ${hack.vars.totalSpd}`);
            o.push(`  current Spd X: ${hack.vars.currentSpdX}`);
            o.push(`  current Spd Y: ${hack.vars.currentSpdY}`);
            o.push("<br><b>SCRIPT VALUES</b>");
            o.push(`  mult Spd Is On: ${hack.vars.multSpdIsOn}`);
            o.push(`  mode Is On: ${hack.vars.modeIsOn}`);
            o.push(`  imm Is On: ${hack.vars.immIsOn}`);
            o.push(`  MMG Is On: ${hack.vars.MMGIsOn}`);
            o.push(`  inter Tp To Other Is On: ${hack.vars.interTpToOtherIsOn}`);
            o.push(`  is Player Dead: ${hack.vars.isPlayerDead}`);
            o.push("<br><b>MOVEMENT VALUES</b>");
            o.push(`  new Movement Is On: ${hack.playerMoveData.newMovementIsOn}`);
            document.getElementById("infoTab").innerHTML = o.join('<br>');
        };
        setInterval(updateData, 100 / 6);

        document.body.insertAdjacentHTML("beforebegin", `
          <div id="controlPanel" style="display: flex; flex-direction: column; gap: 5px; position: fixed; bottom: 0px; left: 0px; height: auto; text-align: left; font-size: 14px; background-color: rgba(0, 0, 0, 0.7); color: rgba(255, 255, 255, 1); font-family: Arial, sans-serif; padding: 5px;">
            <div style="display: flex; align-items: center; gap: 5px;"> <span>new movement:</span> <button id="newMoveBtn" style="padding: 0 6px; height: 18px; line-height: 18px; display: flex; align-items: center; justify-content: center; box-sizing: border-box;">${hack.playerMoveData.newMovementIsOn}</button> </div>
            <div style="display: flex; align-items: center; gap: 5px;"> <span>poison immunity:</span> <button id="immBtn" style="padding: 0 6px; height: 18px; line-height: 18px; display: flex; align-items: center; justify-content: center; box-sizing: border-box;">${hack.vars.immIsOn}</button> </div>
            <div style="display: flex; align-items: center; gap: 5px;"> <span>death immunity:</span> <button id="MMGBtn" style="padding: 0 6px; height: 18px; line-height: 18px; display: flex; align-items: center; justify-content: center; box-sizing: border-box;">${!hack.vars.MMGIsOn}</button> </div>
          </div>
        `);

		const updateButtonStates = () => {
			const newMoveBtn = document.getElementById("newMoveBtn");
			const immBtn = document.getElementById("immBtn");
			const MMGBtn = document.getElementById("MMGBtn");
			if (newMoveBtn) newMoveBtn.innerText = hack.playerMoveData.newMovementIsOn;
			if (immBtn) immBtn.innerText = hack.vars.immIsOn;
			if (MMGBtn) MMGBtn.innerText = !hack.vars.MMGIsOn;
		}

		document.getElementById("newMoveBtn").addEventListener("click", () => {
			if (!hack.playerMoveData.newMovementIsOn) {
				newMovement();
			} else {
				oldMovement();
			}
			updateButtonStates();
		});

		document.getElementById("immBtn").addEventListener("click", () => {
			if (hack.vars.immIsOn) {
				hack.functions.immDisable();
			} else {
				hack.functions.immEnable();
			}
			updateButtonStates();
		});

		document.getElementById("MMGBtn").addEventListener("click", () => {
			if (hack.vars.MMGIsOn) {
				hack.functions.MMGDisable();
			} else {
				hack.functions.MMGEnable();
			}
			updateButtonStates();
		});

		updateButtonStates();
		setInterval(updateButtonStates, 100 / 6);
		hack.functions.MMGDisable()

		function scrActivate() {
            hack.getters.mode.createKickGui = function(e) {
                e.myIndex = e.myIndex;
                e.interactive = true;
                e.buttonMode = true;
                let flag = false;
                function t() {
                    if (hack.vars.shiftPressed) {
                        let name = this.ref.refP.name.getText();
                        if (!hack.vars.blacklisted.names.includes(name)) {
                            hack.vars.blacklisted.names.push(name);
                        }
                        window.updateBlacklistList();
                        flag = true;
                    }
                    if (flag) {
                        flag = false;
                        return;
                    }
                    let kickIndex = hack.getters.mode.kickIndex = this.ref.refP.g.myIndex;
                    hack.getters.guiComponentsKick.showLoading(this.ref.refP.name.getText(), this.ref.refP.g.myIndex);
                    hack.vars.indexByClick = kickIndex;
                }
                e.on("click", t).on("touchstart", t);
            }

			setTimeout(function() {
				window.loadCosmetics();
			}, 0);
			hack.getters.client.loopFunctions[3].timeOut = 0
			hack.getters.client.loopFunctions[2].timeOut = 100 / 6
			oldMovement()
			Object.defineProperty(hack.vars, 'mult', { enumerable: false })
			Object.defineProperty(hack.vars, 'lrSpd', { enumerable: false })
			Object.defineProperty(hack.vars, 'udSpd', { enumerable: false })
			Object.defineProperty(hack.vars, 'ghost2', { enumerable: false })
			Object.defineProperty(hack.vars, 'pX', { enumerable: false })
			Object.defineProperty(hack.vars, 'pY', { enumerable: false })
			Object.defineProperty(hack.vars, 'tpSpawnCounter', { enumerable: false })
			Object.defineProperty(hack.vars, 'multSpdIsOn', { enumerable: false })
			Object.defineProperty(hack.vars, 'ghost1', { enumerable: false })
			Object.defineProperty(hack.playerMoveData, 'lastDashTime', { enumerable: false })
			Object.defineProperty(hack.playerMoveData, 'lastHorizontalDirection', { enumerable: false })
			Object.defineProperty(hack.playerMoveData, 'dashDuration', { enumerable: false })
			Object.defineProperty(hack.playerMoveData, 'dashEndTime', { enumerable: false })
			Object.defineProperty(hack.playerMoveData, 'newMovementIsOn', { enumerable: false })
			Object.defineProperty(hack.playerMoveData, 'division', { enumerable: false })
			Object.defineProperty(hack.playerMoveData, 'meYplus', { enumerable: false })
		}

		hack.bindKeys()

		hack.getters.mode.processOthersPlayerData = function() {
			hack.suppFuncs.processBlacklistData()
			let flag = false
			if (0 != hack.getters.mode.othersPlayerNetworkData.length) {
				var currentPlayersIndex = [];
				for (var x = 0; x < hack.getters.mode.othersPlayerNetworkData.length; x++) {
					for (var y = 0; y < hack.getters.mode.othersPlayerNetworkData[x].length; y++) {
						var data = hack.getters.mode.othersPlayerNetworkData[x][y];
						var index = data[0];
						var xVelo = data[1];
						var yVelo = data[2];
						var xAxis = data[3];
						var yAxis = data[4];
						for (let iterator = 0; iterator < hack.vars.blacklisted.data.length; iterator++) {
							if (hack.vars.blacklisted.data[iterator] && hack.vars.blacklisted.data[iterator].includes(index)) {
								flag = true;
							}
						}
						if (flag) {
							flag = false;
							continue
						}

						if (typeof hack.getters.mode.otherPlayers[index] == "undefined" || hack.getters.mode.otherPlayers[index] == null) {
								hack.getters.mode.oldPlayersIndex[hack.getters.mode.oldPlayersIndex.length] = index;
								var person = new Object();
								person.myName = "";
								person.mySkin = 0,
								person.reset = Infinity;
								person.gpData = hack.getters.mode.createPlayer();
								person.gpData.g.myIndex = index;
								hack.getters.mode.otherPlayers[index] = person;
								hack.getters.mode.enableEmit && hack.getters.rBio.fire(hack.getters.network.gsSocket, index);
								hack.getters.gp.gWorld.removeChild(person.gpData.g);
								hack.getters.gp.gWorld.mid.addChild(person.gpData.g)
                        }


						if (10 < hack.getters.mode.otherPlayers[index].reset) {
								hack.getters.mode.otherPlayers[index].gpData.setX(xAxis);
								hack.getters.mode.otherPlayers[index].gpData.setY(yAxis);
								hack.getters.mode.otherPlayers[index].reset = 0
                        }
						hack.getters.mode.otherPlayers[index].reset++;
						hack.getters.mode.otherPlayers[index].gpData.p.velocity[0] = xVelo;
						hack.getters.mode.otherPlayers[index].gpData.p.velocity[1] = yVelo;
						currentPlayersIndex[currentPlayersIndex.length] = index;
					}
				}
				var result = hack.getters.gf.difference(hack.getters.mode.oldPlayersIndex, currentPlayersIndex);
				for (var i = 0; i < result.length; i++) {
					var person = hack.getters.mode.otherPlayers[result[i]];
					if (null != person) {
						hack.getters.gp.gWorld.children[1].removeChild(person.gpData.g);
						hack.getters.gp.pWorld.removeBody(person.gpData.p);
						hack.getters.gp.list[hack.getters.gp.list.indexOf(person.gpData)] = null;
						hack.getters.gp.deleteCounter++;
						hack.getters.mode.otherPlayers[result[i]] = null;
                    }

				}
				hack.getters.mode.oldPlayersIndex = currentPlayersIndex;
				hack.getters.mode.othersPlayerNetworkData = [];
			}
		}

		hack.getters.mode.onChangeMap = function(e) {
			try {
				scrActivate()
				scrActivate = null
			} catch {}
			let mode = hack.getters.mode;
			let gp = hack.getters.gp;
			let resultScreen = hack.getters.modules_resultScreen;
			let client = hack.getters.client
			clearInterval(mode.startTimeId);
			clearTimeout(mode.smallStepTimeId);
			resultScreen.hideResultScreen();
			e = e;
			gp.unload(gp);
			gp.list = gp.load(e, gp);
			mode.syncArr = [];
			mode.ghost = !1;
			mode.tweenObjects = [];
			mode.defineBehaviours(gp.list, mode.syncArr, gp);
			mode.md.mobile() && mode.setupTouchButtons(!1);
			mode.setMyBio();
			mode.setBio(mode.player.gpData, mode.myName, mode.mySkin, mode.whatBro, mode.chatColor, mode.teamColor);
			for (var t, n = 0; n < mode.otherPlayers.length; n++)
				void 0 !== mode.otherPlayers[n] && null != mode.otherPlayers[n] && (t = mode.otherPlayers[n].gpData.g.myIndex,
					mode.otherPlayers[n].gpData = mode.createPlayer(),
					mode.otherPlayers[n].gpData.g.myIndex = t,
					mode.otherPlayers[n].gpData.p.gravityScale = 0,
					gp.gWorld.removeChild(mode.otherPlayers[n].gpData.g),
					gp.gWorld.mid.addChild(mode.otherPlayers[n].gpData.g),
					mode.setBio(mode.otherPlayers[n].gpData, mode.otherPlayers[n].myName, mode.otherPlayers[n].mySkin, mode.otherPlayers[n].whatBro, mode.otherPlayers[n].chatColor, mode.otherPlayers[n].teamColor));
			void 0 === mode.firstTimeMapChange && (mode.firstTimeMapChange = !0);
			mode.smallStepTimeId = setTimeout(function() {
				document.getElementById("startTime").style.display = "inherit";
				document.getElementById("startTime").innerHTML = mode.startTime;
				client.runPhysics = !1;
				mode.startTimeId = setInterval(function() {
					mode.startTime++;
					document.getElementById("startTime").innerHTML = mode.startTime;
					3 == mode.startTime && (mode.startTime = 0,
						client.runPhysics = !0,
						clearInterval(mode.startTimeId),
						document.getElementById("startTime").style.display = "none");
				}, 1e3);
			}, 0);
			hack.getters.me.me = true
			if (hack.vars.modeIsOn) {
				hack.functions.godModeEnable()
			} else {
				hack.functions.godModeDisable()
			}
			if (hack.vars.immIsOn) {
				hack.functions.immEnable()
			} else {
				hack.functions.immDisable()
			}
			hack.vars.ghost2 = false
			hack.vars.isPlayerDead = false

			const keyboardjs = hack.getters.keyboardjs
			for (let i in keyboardjs._listeners) {
				if (i != 0) {
					delete keyboardjs._listeners[i]
				}
			}
			document.addEventListener("keyup", handleKeyUp)
			document.addEventListener("keydown", handleKeyDown)
		}

		document.body.onkeyup = (event) => {
			const key = event.key
			switch (key) {
				case 'PageUp':
					if (!hack.vars.modeIsOn) {
						hack.getters.me.p.gravityScale = 1
						hack.getters.me.p.collisionResponse = 1
					}
					break;
				case 'PageDown':
					if (!hack.vars.modeIsOn) {
						hack.getters.me.p.collisionResponse = 1
					}
					break;
			}
		}

		document.body.onkeydown = (event) => {
			const key = event.key;
			switch (key) {
				case 'Delete':
					if (!hack.vars.tpToOtherByClickIsOn) {
						hack.vars.tpToOtherByClickIsOn = true
						hack.functions.setTpToOther(hack.vars.indexByClick)
					} else {
						hack.vars.tpToOtherByClickIsOn = false
						hack.functions.setTpToOther(false)
					}
					break
				case 'PageUp':
					if (!hack.vars.modeIsOn) {
						hack.getters.me.p.gravityScale = -1
						hack.getters.me.p.collisionResponse = 0
					}
					break;
				case 'PageDown':
					if (!hack.vars.modeIsOn) {
						hack.getters.me.p.gravityScale = 1
						hack.getters.me.p.collisionResponse = 0
					}
					break;
				case 'Control':
					hack.getters.mode.makeMeGhost();
					break;
				case 'F2':
					if (!hack.vars.modeIsOn) {
						hack.functions.godModeEnable();
						hack.logFuncs.logModeIsOn();
						hack.functions.multSpdEnable();
					} else {
						hack.functions.godModeDisable();
						hack.logFuncs.logModeIsOn();
						hack.functions.multSpdDisable();
					}
					break;
				case 'Home':
					hack.functions.tpSpawn();
					break;
				case 'End':
					hack.functions.tpDoor();
					break;
				case 'F9':
					if (!hack.vars.MMGIsOn) {
						hack.functions.MMGEnable();
						hack.logFuncs.logMMGIsOn();
					} else {
						hack.functions.MMGDisable();
						hack.logFuncs.logMMGIsOn();
					}
					break;
				case '`': // Backtick (`)
				case 'ё'.toLowerCase(): // Cyrillic Yo (часто на той же клавише, что и Backtick)
					if (hack.vars.modeIsOn) {
						hack.suppFuncs.setMult();
						hack.logFuncs.logSpd();
					}
					break;
				case 'Insert':
				case 'NumPad0': // Клавиша 0 на цифровой клавиатуре
					hack.functions.setTpToOther(hack.suppFuncs.getIndexByName(prompt('Введите корректный никнейм. Чтобы выйти из интервала нажмите Esc.')));
					break;
				case 'F4':
					if (!hack.vars.immIsOn) {
						hack.functions.immEnable();
						hack.logFuncs.logImmIsOn();
					} else {
						hack.functions.immDisable();
						hack.logFuncs.logImmIsOn();
					}
					break;
			}
		};


		function isGrounded() {
			const { me, ray, physics, gp } = hack.getters;
			const { division, meYplus } = hack.playerMoveData;
			const meX = me.getX();
			const meY = me.getY();
			const gpPWorld = gp.pWorld;
			const rayResult = me.ray.result;
			const rayHitPoint = ray.hitPoint = [Infinity, Infinity];
			const verticalOffset = 50;
			const checkYPosition = meY + meYplus;
			const startYPosition = physics.yAxis(checkYPosition, 0);
			const endYPosition = physics.yAxis(checkYPosition + verticalOffset, 0);
			const leftX = meX - 15;
			const step = 30 / division;

			for (let i = 0; i <= division; i++) {
				const currentX = leftX + i * step;
				const xPos = physics.xAxis(currentX, 0);
				ray.from = [xPos, startYPosition];
				ray.to = [xPos, endYPosition];
				ray.update();
				rayResult.reset();
				if (gpPWorld.raycast(rayResult, ray)) {
					rayResult.getHitPoint(rayHitPoint, ray);
					const hitDistance = rayResult.getHitDistance(ray);
					if (rayResult.shape.ref.getCollision() && hitDistance < 0.1) {
						return true;
					}
				}
			}
			return false;
		}

		function newMovement() {
			hack.playerMoveData.division = 120;
			hack.playerMoveData.meYplus = 45;
			const dashCooldown = 250;
			const dashDistance = 2.5;
			const dashSpeed = 25;
			const dashDuration = (dashDistance / dashSpeed) * 1000;

			function startDash(type, currentTime, grounded) {
				hack.playerMoveData.lastDashTime = currentTime;
				if (type === 'Down') {
					hack.playerMoveData.isDashingDown = true;
				} else if (type === 'Up') {
					hack.playerMoveData.isDashingUp = true;
				} else if (type === 'Horizontal') {
					hack.playerMoveData.isDashing = true;
					hack.playerMoveData.dashVelocity = dashSpeed * hack.playerMoveData.lastHorizontalDirection;
				}
				hack.playerMoveData.dashDuration = dashDuration;
				hack.playerMoveData.dashEndTime = currentTime + dashDuration;
				if (!grounded) {
					hack.playerMoveData.airDashAvailable = false;
				}
			}

			function updateDash(type, currentTime) {
				const player = hack.getters.mode.player.gpData.p;
				const me = hack.getters.me.p;
				if (type === 'Down') {
					player.velocity[1] = -dashSpeed;
					player.velocity[0] = 0;
				} else if (type === 'Up') {
					player.velocity[1] = dashSpeed;
					player.velocity[0] = 0;
				} else if (type === 'Horizontal') {
					player.velocity[0] = hack.playerMoveData.dashVelocity;
					player.velocity[1] = 0;
				}
				me.collisionResponse = false;
				if (currentTime >= hack.playerMoveData.dashEndTime) {
					if (type === 'Down') {
						hack.playerMoveData.isDashingDown = false;
						player.velocity[1] = 0;
					} else if (type === 'Up') {
						hack.playerMoveData.isDashingUp = false;
						player.velocity[1] = 0;
					} else if (type === 'Horizontal') {
						hack.playerMoveData.isDashing = false;
						player.velocity[0] = 0;
					}
					if (!hack.vars.modeIsOn) {
						me.collisionResponse = true;
					}
				}
			}

			hack.getters.client.loopFunctions[2].fun = function() {
				const currentTime = Date.now();
				const grounded = isGrounded();

				if (grounded) {
					hack.playerMoveData.airDashAvailable = true;
				}

				if (hack.getters.mode.moveLeft) {
					hack.playerMoveData.lastHorizontalDirection = -1;
				} else if (hack.getters.mode.moveRight) {
					hack.playerMoveData.lastHorizontalDirection = 1;
				}

				if (hack.keyBindings.isCPressed &&
					currentTime - hack.playerMoveData.lastDashTime >= dashCooldown &&
					(grounded || hack.playerMoveData.airDashAvailable)
				) {
					if (hack.getters.mode.moveDown && !hack.playerMoveData.isDashingDown) {
						startDash('Down', currentTime, grounded);
					} else if (hack.getters.mode.moveUp && !hack.playerMoveData.isDashingUp) {
						startDash('Up', currentTime, grounded);
					} else if (!hack.playerMoveData.isDashing) {
						startDash('Horizontal', currentTime, grounded);
					}
				}

				if (hack.playerMoveData.isDashingDown) {
					updateDash('Down', currentTime);
					return;
				} else if (hack.playerMoveData.isDashingUp) {
					updateDash('Up', currentTime);
					return;
				} else if (hack.playerMoveData.isDashing) {
					updateDash('Horizontal', currentTime);
					return;
				} else {
					const player = hack.getters.mode.player.gpData.p;
					if (hack.getters.mode.moveRight) {
						hack.getters.mode.moveLeft = false
						player.velocity[0] = hack.vars.lrSpd * hack.vars.mult;
					} else if (hack.getters.mode.moveLeft) {
						hack.getters.mode.moveRight
						player.velocity[0] = -hack.vars.lrSpd * hack.vars.mult;
					}
				}

                if (hack.keyBindings.isZPressed) {
                    hack.keyBindings.isZPressed = false;
                    if (grounded) {
                        hack.getters.velocity[1] = 8 * hack.getters.me.p.gravityScale;
                        hack.playerMoveData.isDoubleJumpAllowed = true;
                    } else if (hack.playerMoveData.isDoubleJumpAllowed) {
                        hack.getters.velocity[1] = 8 * hack.getters.me.p.gravityScale;
                        hack.playerMoveData.isDoubleJumpAllowed = false;
                    }
                }

                if (grounded) {
                    hack.playerMoveData.isDoubleJumpAllowed = true;
                }

				if (hack.vars.ghost1 || hack.vars.ghost2) {
					if (hack.getters.mode.moveUp) {
						hack.getters.velocity[1] = hack.vars.udSpd * hack.vars.mult;
					}
					if (hack.getters.mode.moveDown) {
						hack.getters.velocity[1] = -hack.vars.udSpd * hack.vars.mult;
					}
					if (!hack.getters.mode.moveUp && !hack.getters.mode.moveDown) {
						hack.getters.velocity[1] = 0;
					}
				}
			};

			hack.playerMoveData.newMovementIsOn = true;
		}

		function oldMovement() {
			hack.playerMoveData.division = 12
			hack.playerMoveData.meYplus = 49
			hack.getters.client.loopFunctions[2].fun = function() {
				const grounded = isGrounded()

				if (hack.getters.mode.moveRight) {
					hack.getters.mode.player.gpData.p.velocity[0] = hack.vars.lrSpd * hack.vars.mult
				} else if (hack.getters.mode.moveLeft) {
					hack.getters.mode.player.gpData.p.velocity[0] = -hack.vars.lrSpd * hack.vars.mult
				}
				if (grounded) {
					if (hack.getters.mode.moveUp) {
						hack.getters.velocity[1] = 8
					}
				}
				if (hack.vars.ghost1 || hack.vars.ghost2) {
					if (hack.getters.mode.moveUp) {
						hack.getters.velocity[1] = hack.vars.udSpd * hack.vars.mult
					}
					if (hack.getters.mode.moveDown) {
						hack.getters.velocity[1] = -hack.vars.udSpd * hack.vars.mult
					}
					if (!hack.getters.mode.moveUp && !hack.getters.mode.moveDown) {
						hack.getters.velocity[1] = 0
					}
				}
			}
			hack.playerMoveData.newMovementIsOn = false
		}
		addEventListener("mousewheel", e => {
			window.tweenObjects.map(x => {
				try {
					if (e.shiftKey) {
						hack.getters.mode.player.gpData.p.velocity[0] = -Math.sign(e.deltaY) * 15;
					} else {
						hack.getters.mode.player.gpData.p.velocity[1] = -Math.sign(e.deltaY) * 15;
					}
				} catch (err) {
					console.error(err);
				}
			});
		});

		window.window = this

		function teleportToClick(event) {
			event.preventDefault()
			const gameWidthFactor = window.innerWidth / hack.getters.mode.horizontalFOV
			const gameHeightFactor = window.innerHeight / (hack.getters.mode.horizontalFOV * (window.innerHeight / window.innerWidth))
			const targetX = (hack.getters.me.g.x + (event.clientX - window.innerWidth / 2) / gameWidthFactor) / 100;
			const targetY = -(hack.getters.me.g.y - hack.getters.me.shapes[1].getHeight() / 2 + (event.clientY - window.innerHeight / 2) / gameHeightFactor) / 100
			hack.getters.me.p.position[0] = targetX
			hack.getters.me.p.position[1] = targetY
		}
		document.addEventListener("contextmenu", teleportToClick)
	}

	let temp1 = {};
	const _call = Function.prototype.call;
	new Promise((resolve, reject) => {
		Function.prototype.call = function(...args) {
			if (args[2]?.exports) {
				temp1 = args[6]
				Function.prototype.call = _call
				console.log(temp1)
				resolve(temp1)
			}
			return _call.apply(this, args)
		};
	}).then((result) => {
		if (Object.keys(result).length > 0) {
			activateMain(result)
		} else {
			console.log("temp1 is empty")
		}
	}).catch((error) => {
		console.error("An error occurred:", error)
	})
}

function hideAndSeekHack() {
	function activateMain(temp1) {
        function returnModuleIfName(par) {
            for (let i in temp1) {
                let tie = temp1[`${i}`].exports
                if (tie.name == par) {
                    return tie
                }
            }
        }
        function returnModule(par) {
            for ( let i in temp1 ) {
                let tie = temp1[`${i}`].exports
                for (let j in tie) {
                    if ( j == par ) {
                        return tie
                    }
                }
            }
        }
		const hack = {
			keyBindings: {
				isCPressed: false,
				cTimer: null,
				isZPressed: false
			},
			playerMoveData: {
				lastHorizontalDirection: 1,
				isDashingDown: false,
				isDashingUp: false,
				lastDashTime: 0,
				dashDuration: 100,
				dashEndTime: 0,
				isDoubleJumpAllowed: false,
				airDashAvailable: true,
				newMovementIsOn: true
			},
			bindKeys: function() {
				document.addEventListener('keydown', function(event) {
					if (event.key === 'Escape') {
						const panel = document.getElementById('someData')
						const panel1 = document.getElementById('controlPanel')
                        const panel2 = document.getElementById('buttonContainer')
						if (panel.style.display === 'none') {
							panel.style.display = 'block'
                            panel2.style.display = 'flex'
						} else {
							panel.style.display = 'none'
                            panel2.style.display = 'none'
						}
						if (panel1.style.display === 'none') {
							panel1.style.display = 'flex'
						} else {
							panel1.style.display = 'none'
						}
					}
					if (event.key.toLowerCase() === 's' && event.repeat) {
						if (!hack.vars.modeIsOn) {
							hack.getters.me.p.mass = 3
						}
					}
					if (event.key.toLowerCase() === 'z' && !event.repeat) {
						hack.keyBindings.isZPressed = true
					} else if (event.repeat) {
						hack.keyBindings.isZPressed = false
					}
					if (event.key.toLowerCase() === 'c') {
						hack.keyBindings.isCPressed = true
						if (!hack.keyBindings.cTimer) {
							hack.keyBindings.cTimer = setTimeout(() => {
								hack.keyBindings.isCPressed = false
								hack.keyBindings.cTimer = null
							}, 250)
						}
					}
				})
				document.addEventListener('keyup', function(event) {
					if (event.key.toLowerCase() === 's') {
						if (!hack.vars.modeIsOn) {
							hack.getters.me.p.mass = 1
						}
					}
					if (event.key.toLowerCase() === 'z') {
						hack.keyBindings.isZPressed = false
					}
					if (event.key.toLowerCase() === 'c') {
						hack.keyBindings.isCPressed = false
						if (hack.keyBindings.cTimer) {
							clearTimeout(hack.keyBindings.cTimer)
							hack.keyBindings.cTimer = null
						}
					}
				})
			},
			getters: {
                client: returnModule('onReady'),
                gf: returnModule('pointBetweenTwoPointsGivenXorYvalue'),
                gp: returnModule('deleteCounter'),
                graphics: returnModule('makeSpriteFromImageUrl'),
                mode: returnModule('playerMovement'),
                envirData: returnModuleIfName('envirData'),
                network: returnModule('getAllSupporters'),
                physics: returnModule('createRay'),
                rBio: returnModuleIfName('rBio'),
				get me() {
					return hack.getters.mode.player.gpData
				},
				get ray() {
					return hack.getters.me.ray
				},
				get velocity() {
					return hack.getters.me.p.velocity
				},
				get otherPlayers() {
					return hack.getters.mode.otherPlayers
				},
				ghost: false,
			},
			vars: {
                blacklisted: { data: [], names: [] },
				get isGround() {
					return isGrounded()
				},
				mult: 1,
				lrSpd: 3,
				udSpd: 3,
				get currentPosX() {
					return Math.round(hack.getters.me.getX() * 100) / 100
				},
				get currentPosY() {
					return Math.round(hack.getters.me.getY() * 100) / 100
				},
				get totalSpd() {
					return (((this.lrSpd + this.udSpd) / 2) * this.mult)
				},
				get currentSpdX() {
					return Math.round(hack.getters.me.p.velocity[0] * 100) / 100
				},
				get currentSpdY() {
					return Math.round(hack.getters.me.p.velocity[1] * 100) / 100
				},
				multSpdIsOn: false,
				modeIsOn: false,
				ghost1: false,
				isPlayerDead: false,
			},
			suppFuncs: {
				getMult: () => {
					if (hack.vars.mult < 3) {
						return 1
					} else if (hack.vars.mult < 4) {
						return 2
					}
				},
				setMult: function(e) {
					if (e != undefined) {
						hack.vars.lrSpd = hack.vars.udSpd = e
						return
					}
					if (hack.suppFuncs.getMult() === 1) {
						hack.vars.mult++
					} else if (hack.suppFuncs.getMult() === 2) {
						hack.vars.mult += 2
					} else {
						hack.vars.mult = 1
					}
				},
                processBlacklistData: function() {
					// 1. Добавляем новых игроков
					for (let name of hack.vars.blacklisted.names) {
						const index = hack.suppFuncs.getIndexByName(name);

						if (index !== false) { // Убедимся, что игрок найден
							const alreadyExists = hack.vars.blacklisted.data.some(entry => {
								return entry && entry[1] === name;
							});

							if (!alreadyExists) {
								hack.vars.blacklisted.data.push([index, name]);
							}
						}
					}
					// 2. Удаляем устаревшие записи
					if (hack.vars.blacklisted.data.length) {
						hack.vars.blacklisted.data = hack.vars.blacklisted.data.filter(entry => {
							return entry && entry[1] && hack.vars.blacklisted.names.includes(entry[1]);
						});
					}
				},
				getIndexByName: function(playerName) {
					const index = hack.getters.otherPlayers.findIndex(player => player?.myName === playerName)
					return index === -1 ? false : index
				}
			},
			functions: {
				godModeEnable: () => {
					hack.vars.ghost1 = true
					hack.getters.me.p.collisionResponse = false
					hack.getters.me.p.mass = 0
					hack.vars.modeIsOn = true
					hack.getters.velocity[0] = 0
					hack.getters.velocity[1] = 0
				},
				godModeDisable: () => {
					hack.vars.ghost1 = false
					hack.getters.me.p.collisionResponse = true
					hack.getters.me.p.mass = 1
					hack.vars.modeIsOn = false
					hack.getters.velocity[0] = 0
					hack.getters.velocity[1] = 0
				},
				multSpdEnable: () => {
					hack.vars.lrSpd *= hack.vars.mult
					hack.vars.udSpd *= hack.vars.mult
					hack.vars.multSpdIsOn = true
				},
				multSpdDisable: () => {
					hack.vars.lrSpd /= hack.vars.mult
					hack.vars.udSpd /= hack.vars.mult
					hack.vars.multSpdIsOn = false
				}
			},
			logFuncs: {
				logModeIsOn: () => {
					console.log('modeIsOn:', hack.vars.modeIsOn)
				},
				logSpd: () => {
					console.log('speed:', ((hack.vars.lrSpd + hack.vars.udSpd) / 2) * hack.vars.mult)
				}
			}
		}
        window.hack = hack;

        hack.getters.mode.processOthersPlayerData = function() {
			hack.suppFuncs.processBlacklistData();
			if (0 != hack.getters.mode.othersPlayerNetworkData.length) {
				var currentPlayersIndex = [];
				for (var x = 0; x < hack.getters.mode.othersPlayerNetworkData.length; x++) {
					for (var y = 0; y < hack.getters.mode.othersPlayerNetworkData[x].length; y++) {
						var data = hack.getters.mode.othersPlayerNetworkData[x][y];
						var index = data[0];
						var xVelo = data[1];
						var yVelo = data[2];
						var xAxis = data[3];
						var yAxis = data[4];

                        let isBlacklisted = false;
						for (let iterator = 0; iterator < hack.vars.blacklisted.data.length; iterator++) {
							if (hack.vars.blacklisted.data[iterator] && hack.vars.blacklisted.data[iterator].includes(index)) {
								isBlacklisted = true;
                                break;
							}
						}
						if (isBlacklisted) {
							continue;
						}

						if (typeof hack.getters.mode.otherPlayers[index] == "undefined" || hack.getters.mode.otherPlayers[index] == null) {
								hack.getters.mode.oldPlayersIndex[hack.getters.mode.oldPlayersIndex.length] = index;
								var person = new Object();
								person.myName = "";
								person.mySkin = 0,
								person.reset = Infinity;
								person.gpData = hack.getters.mode.createPlayer();
								person.gpData.g.myIndex = index;
								hack.getters.mode.otherPlayers[index] = person;
								hack.getters.mode.enableEmit && hack.getters.rBio?.fire(hack.getters.network.gsSocket, index);
								hack.getters.gp.gWorld.removeChild(person.gpData.g);
								hack.getters.gp.gWorld.mid.addChild(person.gpData.g)
                        }


						if (10 < hack.getters.mode.otherPlayers[index].reset) {
								hack.getters.mode.otherPlayers[index].gpData.setX(xAxis);
								hack.getters.mode.otherPlayers[index].gpData.setY(yAxis);
								hack.getters.mode.otherPlayers[index].reset = 0
                        }
						hack.getters.mode.otherPlayers[index].reset++;
						hack.getters.mode.otherPlayers[index].gpData.p.velocity[0] = xVelo;
						hack.getters.mode.otherPlayers[index].gpData.p.velocity[1] = yVelo;
						currentPlayersIndex[currentPlayersIndex.length] = index;
					}
				}
				var result = hack.getters.gf.difference(hack.getters.mode.oldPlayersIndex, currentPlayersIndex);
				for (var i = 0; i < result.length; i++) {
					var person = hack.getters.mode.otherPlayers[result[i]];
					if (null != person) {
						hack.getters.gp.gWorld.children[1].removeChild(person.gpData.g);
						hack.getters.gp.pWorld.removeBody(person.gpData.p);
						hack.getters.gp.list[hack.getters.gp.list.indexOf(person.gpData)] = null;
						hack.getters.gp.deleteCounter++;
						hack.getters.mode.otherPlayers[result[i]] = null;
                    }

				}
				hack.getters.mode.oldPlayersIndex = currentPlayersIndex;
				hack.getters.mode.othersPlayerNetworkData = [];
			}
		}

        const style = document.createElement('style');
        style.innerHTML = `
          .fixed-container { position: fixed; z-index: 1000; font-family: Arial, sans-serif; color: #fff; }
          .transparent-bg { background-color: rgba(0, 0, 0, 0.7); }
          .no-bg { background-color: transparent; }
          .button-container { display: flex; justify-content: flex-start; gap: 10px; top: 0; left: 0; padding: 4px; }
          .tab-button { font-size: 0.6em; cursor: pointer; }
          .data-container { top: 25px; left: -12px; padding: 5px; margin-left: 10px; text-align: left; font-size: 14px; }
          .tab-content { display: none; }
          .tab-content.active { display: block; }
          .cosmetics-container { display: flex; flex-direction: column; gap: 10px; margin-left: 1px; }
          .form-row { display: flex; align-items: center; }
          .form-row label { width: 100px; text-align: left; margin: 0; }
          .form-row input { width: 142px; }
          .btn { padding: 5px 10px; cursor: pointer; }
          .control-panel { display: flex; flex-direction: column; gap: 10px; margin-left: 1px; bottom: 0; left: 0; font-size: 14px; background-color: transparent; color: rgba(255, 255, 255, 1); }
          .control-panel button { padding: 2px 10px; cursor: pointer; }
        `;
        document.head.appendChild(style);

        document.body.insertAdjacentHTML("beforeend", `
          <div id="buttonContainer" class="fixed-container button-container no-bg">
            <button class="tab-button active" onclick="openTab('info', event)">Info</button>
            <button class="tab-button" onclick="openTab('cosmetics', event)">Cosmetics</button>
            <button class="tab-button" onclick="openTab('blacklist', event)">Blacklist</button>
          </div>
          <div id="someData" class="fixed-container data-container transparent-bg">
            <div id="infoTab" class="tab-content active"></div>
            <div id="cosmeticsTab" class="tab-content"></div>
            <div id="blacklistTab" class="tab-content"></div>
          </div>
        `);

        document.getElementById("cosmeticsTab").innerHTML = `
          <div class="cosmetics-container no-bg">
            <div class="form-row" style="justify-content: flex-end;"> <label for="bgColorInput" style="width: 70px; text-align: left; margin-right: 10px;">Фон:</label> <input type="color" id="bgColorInput" style="width: 150px;" value="#000000"> </div>
            <div class="form-row" style="justify-content: flex-end;"> <label for="textColorInput" style="width: 70px; text-align: left; margin-right: 10px;">Текст:</label> <input type="color" id="textColorInput" style="width: 150px;" value="#ffffff"> </div>
            <div class="form-row" style="justify-content: flex-end;"> <label for="bgOpacityInput" style="width: 70px; text-align: left; margin-right: 10px;">Прозрачн. фона:</label> <input type="number" id="bgOpacityInput" min="0" max="1" step="0.1" value="0.7" style="width: 142px;"> </div>
            <div class="form-row" style="justify-content: flex-end;"> <label for="textOutlineCheckbox" style="width: 70px; text-align: left; margin-right: 10px;">Обводка:</label> <input type="checkbox" id="textOutlineCheckbox"> </div>
            <div style="text-align: center; margin-top: 10px;"> <button class="btn" onclick="applyCosmetics()">Применить</button> </div>
          </div>
        `;

        document.getElementById("blacklistTab").innerHTML = `
          <div class="cosmetics-container no-bg" style="padding: 5px;">
            <div class="form-row" style="display: flex; align-items: center; gap: 10px; width: max-content;">
              <label for="blacklistInput" style="min-width: 70px; text-align: left;">Никнейм</label>
              <input type="text" id="blacklistInput" style="width: 150px;">
              <button class="btn" onclick="addBlacklistName()">Добавить</button>
            </div>
            <div id="blacklistContainer" style="margin-top: 10px; max-height: 175px; overflow-y: auto; font-size: 12px;"></div>
          </div>
        `;

		const updateData = () => {
			const o = [];
            o.push("<b>POSITION INFO</b>");
            o.push(`  current Pos X: ${hack.vars.currentPosX}`);
            o.push(`  current Pos Y: ${hack.vars.currentPosY}`);
            o.push("<br><b>SPEED INFO</b>");
            o.push(`  total Spd: ${hack.vars.totalSpd}`);
            o.push(`  current Spd X: ${hack.vars.currentSpdX}`);
            o.push(`  current Spd Y: ${hack.vars.currentSpdY}`);
            o.push("<br><b>SCRIPT VALUES</b>");
            o.push(`  mult Spd Is On: ${hack.vars.multSpdIsOn}`);
            o.push(`  mode Is On: ${hack.vars.modeIsOn}`);
            o.push("<br><b>MOVEMENT VALUES</b>");
            o.push(`  new Movement Is On: ${hack.playerMoveData.newMovementIsOn}`);
			document.getElementById("infoTab").innerHTML = o.join('<br>');
		}

        document.body.insertAdjacentHTML("beforebegin", `
          <div id="controlPanel" style="display: flex; flex-direction: column; gap: 5px; position: fixed; bottom: 0px; left: 0px; height: auto; text-align: left; font-size: 14px; background-color: rgba(0, 0, 0, 0.7); color: rgba(255, 255, 255, 1); font-family: Arial, sans-serif; padding: 5px;">
            <div style="display: flex; align-items: center; gap: 5px;">
              <span>new movement:</span>
              <button id="newMoveBtn" style="padding: 0 6px; height: 18px; line-height: 18px; display: flex; align-items: center; justify-content: center; box-sizing: border-box;">${hack.playerMoveData.newMovementIsOn}</button>
            </div>
          </div>
        `);

		const updateButtonStates = () => {
			document.getElementById("newMoveBtn").innerText = hack.playerMoveData.newMovementIsOn
		}

		document.getElementById("newMoveBtn").addEventListener("click", () => {
			if (!hack.playerMoveData.newMovementIsOn) {
				newMovement()
			} else {
				oldMovement()
			}
			updateButtonStates()
		})

		setInterval(updateData, 100 / 6)
		updateButtonStates()
		setInterval(updateButtonStates, 100 / 6)
		hack.bindKeys()

		let scrActivate = function() {
            console.log('АБОБА АБОБА АБОБА АБОБА АБОБА АБОБА АБОБА АБОБА АБОБА АБОБА АБОБА АБОБА')

            hack.getters.mode.createKickGui = function(e) {
                e.myIndex = e.myIndex;
                e.interactive = true;
                e.buttonMode = true;
                let flag = false;
                function t() {
                    if (hack.vars.shiftPressed) {
                        let name = this.ref.refP.name.getText();
                        if (!hack.vars.blacklisted.names.includes(name)) {
                            hack.vars.blacklisted.names.push(name);
                        }
                        window.updateBlacklistList();
                        flag = true;
                    }
                    if (flag) {
                        flag = false;
                        return;
                    }
                    let kickIndex = hack.getters.mode.kickIndex = this.ref.refP.g.myIndex;
                    hack.getters.guiComponentsKick.showLoading(this.ref.refP.name.getText(), this.ref.refP.g.myIndex);
                    hack.vars.indexByClick = kickIndex;
                }
                e.on("click", t).on("touchstart", t);
            }

            setTimeout(() => window.loadCosmetics(), 0);
			hack.getters.client.loopFunctions[2].timeOut = 100 / 6
			hack.getters.client.loopFunctions[3].timeOut = 0
			oldMovement()
			Object.defineProperty(hack.vars, 'mult', { enumerable: false })
			Object.defineProperty(hack.vars, 'lrSpd', { enumerable: false })
			Object.defineProperty(hack.vars, 'udSpd', { enumerable: false })
			Object.defineProperty(hack.vars, 'multSpdIsOn', { enumerable: false })
			Object.defineProperty(hack.vars, 'ghost1', { enumerable: false })
			Object.defineProperty(hack.playerMoveData, 'lastDashTime', { enumerable: false })
			Object.defineProperty(hack.playerMoveData, 'lastHorizontalDirection', { enumerable: false })
			Object.defineProperty(hack.playerMoveData, 'dashDuration', { enumerable: false })
			Object.defineProperty(hack.playerMoveData, 'dashEndTime', { enumerable: false })
			Object.defineProperty(hack.playerMoveData, 'newMovementIsOn', { enumerable: false })
		}

		setTimeout(() => {
			if (hack.vars.modeIsOn) {
				hack.functions.godModeEnable()
			}
		}, 300)

		hack.getters.client.findUntilFound = function(e, t, n) {
			hack.getters.network.gsip = e;
			hack.getters.network.gsrn = t;
			hack.getters.network.getSID?.((sid) => {
				hack.getters.network.sid = sid;
				hack.getters.network.connectToGs?.(hack.getters.network.gsip, () => {
					console.log("connected to gs");

					hack.getters.client.verifyIsHuman?.(() => {
						hack.getters.network.registerSidOnGs?.((verifyStatus) => {
							console.log("verified on gs server", verifyStatus);

							if (verifyStatus === "") {
								alert("You are already playing the game in another browser tab.");
								location.reload();
								n(2);
							} else {
								hack.getters.network.joinRoom?.(hack.getters.network.gsrn, (joinStatus) => {
									if (joinStatus === 1) {
                                        scrActivate()
										hack.getters.client.sendPlayingInfo?.(hack.getters.client.roomId, () => {
											hack.getters.client.onReady?.();
											n(1);

										});
									} else {
										console.log("else");
										hack.getters.network.gsSockehack?.getters.client.disconnect?.();

										do {
											hack.getters.client.rIndex++;
											const currentDataCenter = hack.getters.network.dataCenters?.[hack.getters.client.dcIndex];

											if (!currentDataCenter?.[hack.getters.client.rIndex]) {
												hack.getters.client.dcIndex++;
												hack.getters.client.rIndex = 0;

												if (!hack.getters.network.dataCenters?.[hack.getters.client.dcIndex]) {
													alert("It seems all servers are full. Please refresh your page and try again.");
													location.reload();
													return;
												}
											}
										} while (hack.getters.network.dataCenters?.[hack.getters.client.dcIndex]?.[hack.getters.client.rIndex]?.[2] !== hack.getters.client.modeInfo.mp);

										const newGsip = hack.getters.network.dataCenters?.[hack.getters.client.dcIndex]?.[hack.getters.client.rIndex]?.[1];
										const newGsrn = hack.getters.network.dataCenters?.[hack.getters.client.dcIndex]?.[hack.getters.client.rIndex]?.[3];
										hack.getters.client.roomId = hack.getters.network.dataCenters?.[hack.getters.client.dcIndex]?.[hack.getters.client.rIndex]?.[4];

										hack.getters.client.findUntilFound(newGsip, newGsrn, n);
									}
								});
							}
						});
					});
				});
			});
		};

		document.body.onkeydown = (event) => {
			const key = event.key;
			switch (key) {
				case 'PageUp':
					if (!hack.vars.modeIsOn) {
						hack.getters.me.p.gravityScale = -1
						hack.getters.me.p.collisionResponse = 0
					}
					break;
				case 'PageDown':
					if (!hack.vars.modeIsOn) {
						hack.getters.me.p.gravityScale = 1
						hack.getters.me.p.collisionResponse = 0
					}
					break;
				case 'F2':
					if (!hack.vars.modeIsOn) {
						hack.functions.godModeEnable();
						hack.logFuncs.logModeIsOn();
						hack.functions.multSpdEnable();
					} else {
						hack.functions.godModeDisable();
						hack.logFuncs.logModeIsOn();
						hack.functions.multSpdDisable();
					}
					break;
				case '`': // Backtick (`)
				case 'ё'.toLowerCase(): // Cyrillic Yo (часто на той же клавише, что и Backtick)
					if (hack.vars.modeIsOn) {
						hack.suppFuncs.setMult();
						hack.logFuncs.logSpd();
					}
					break;
			}
		};

		function isGrounded() {
			const meX = hack.getters.me.getX()
			const meY = hack.getters.me.getY()
			const ray = hack.getters.ray
			const physics = hack.getters.physics
			const gpPWorld = hack.getters.gp.pWorld
			const rayResult = hack.getters.me.ray.result
			const rayHitPoint = (hack.getters.ray.hitPoint = [Infinity, Infinity])

			const verticalOffset = 50
			const checkYPosition = meY + 45

			for (let i = 0; i < 121; i++) {
				const o = meX - 15 + i * (30 / 120)
				const s = checkYPosition
				const u = s + verticalOffset

				ray.from = [physics.xAxis(o, 0), physics.yAxis(s, 0)]
				ray.to = [physics.xAxis(o, 0), physics.yAxis(u, 0)]

				ray.update()
				rayResult.reset()

				if (gpPWorld.raycast(rayResult, ray)) {
					rayResult.getHitPoint(rayHitPoint, ray)
					const hitDistance = rayResult.getHitDistance(ray)

					if (rayResult.shape.ref.getCollision() && hitDistance < 0.1) {
						return true
					}
				}
			}

			return false
		}

		function newMovement() {
			hack.getters.client.loopFunctions[2].fun = function() {
				const currentTime = Date.now()
				const dashCooldown = 250
				const dashDistance = 2.5
				const dashSpeed = 25
				const grounded = isGrounded()

				if (grounded) {
					hack.playerMoveData.airDashAvailable = true
				}

				if (hack.getters.mode.moveLeft) {
					hack.playerMoveData.lastHorizontalDirection = -1
				} else if (hack.getters.mode.moveRight) {
					hack.playerMoveData.lastHorizontalDirection = 1
				}

				if (
					hack.keyBindings.isCPressed &&
					hack.getters.mode.moveDown &&
					currentTime - hack.playerMoveData.lastDashTime >= dashCooldown &&
					!hack.playerMoveData.isDashingDown &&
					(grounded || (!grounded && hack.playerMoveData.airDashAvailable))
				) {
					hack.playerMoveData.lastDashTime = currentTime
					hack.playerMoveData.isDashingDown = true
					hack.playerMoveData.dashDuration = (dashDistance / dashSpeed) * 1000
					hack.playerMoveData.dashEndTime = currentTime + hack.playerMoveData.dashDuration
					if (!grounded) {
						hack.playerMoveData.airDashAvailable = false
					}
				}

				if (
					hack.keyBindings.isCPressed &&
					hack.getters.mode.moveUp &&
					currentTime - hack.playerMoveData.lastDashTime >= dashCooldown &&
					!hack.playerMoveData.isDashingUp &&
					(grounded || (!grounded && hack.playerMoveData.airDashAvailable))
				) {
					hack.playerMoveData.lastDashTime = currentTime
					hack.playerMoveData.isDashingUp = true
					hack.playerMoveData.dashDuration = (dashDistance / dashSpeed) * 1000
					hack.playerMoveData.dashEndTime = currentTime + hack.playerMoveData.dashDuration
					if (!grounded) {
						hack.playerMoveData.airDashAvailable = false
					}
				}

				if (
					hack.keyBindings.isCPressed &&
					currentTime - hack.playerMoveData.lastDashTime >= dashCooldown &&
					!hack.playerMoveData.isDashing &&
					(grounded || (!grounded && hack.playerMoveData.airDashAvailable))
				) {
					hack.playerMoveData.lastDashTime = currentTime
					hack.playerMoveData.isDashing = true
					hack.playerMoveData.dashVelocity = dashSpeed * hack.playerMoveData.lastHorizontalDirection
					hack.playerMoveData.dashDuration = (dashDistance / dashSpeed) * 1000
					hack.playerMoveData.dashEndTime = currentTime + hack.playerMoveData.dashDuration
					if (!grounded) {
						hack.playerMoveData.airDashAvailable = false
					}
				}

				if (hack.playerMoveData.isDashingDown) {
					hack.getters.mode.player.gpData.p.velocity[1] = -dashSpeed
					hack.getters.mode.player.gpData.p.velocity[0] = 0
					hack.getters.me.p.collisionResponse = false
					if (currentTime >= hack.playerMoveData.dashEndTime) {
						hack.playerMoveData.isDashingDown = false
						hack.getters.mode.player.gpData.p.velocity[1] = 0
						if (!hack.vars.modeIsOn) {
							hack.getters.me.p.collisionResponse = true
						}
					}
					return
				}

				if (hack.playerMoveData.isDashingUp) {
					hack.getters.mode.player.gpData.p.velocity[1] = dashSpeed
					hack.getters.mode.player.gpData.p.velocity[0] = 0
					hack.getters.me.p.collisionResponse = false
					if (currentTime >= hack.playerMoveData.dashEndTime) {
						hack.playerMoveData.isDashingUp = false
						hack.getters.mode.player.gpData.p.velocity[1] = 0
						if (!hack.vars.modeIsOn) {
							hack.getters.me.p.collisionResponse = true
						}
					}
					return
				}

				if (hack.playerMoveData.isDashing) {
					hack.getters.mode.player.gpData.p.velocity[0] = hack.playerMoveData.dashVelocity
					hack.getters.mode.player.gpData.p.velocity[1] = 0
					hack.getters.me.p.collisionResponse = false
					if (currentTime >= hack.playerMoveData.dashEndTime) {
						hack.playerMoveData.isDashing = false
						hack.getters.mode.player.gpData.p.velocity[0] = 0
						if (!hack.vars.modeIsOn) {
							hack.getters.me.p.collisionResponse = true
						}
					}
					return
				} else {
					if (hack.getters.mode.moveRight) {
						hack.getters.mode.player.gpData.p.velocity[0] = hack.vars.lrSpd * hack.vars.mult
					} else if (hack.getters.mode.moveLeft) {
						hack.getters.mode.player.gpData.p.velocity[0] = -hack.vars.lrSpd * hack.vars.mult
					}
				}

				if (grounded) {
					hack.playerMoveData.isDoubleJumpAllowed = true
					if (hack.keyBindings.isZPressed) {
						hack.keyBindings.isZPressed = false
						hack.getters.velocity[1] = 8 * (hack.getters.me.p.gravityScale)
					}
				} else if (hack.playerMoveData.isDoubleJumpAllowed && hack.keyBindings.isZPressed) {
					hack.keyBindings.isZPressed = false
					hack.getters.velocity[1] = 8 * (hack.getters.me.p.gravityScale)
					hack.playerMoveData.isDoubleJumpAllowed = false
				}

				if (hack.vars.ghost1) {
					if (hack.getters.mode.moveUp) {
						hack.getters.velocity[1] = hack.vars.udSpd * hack.vars.mult
					}
					if (hack.getters.mode.moveDown) {
						hack.getters.velocity[1] = -hack.vars.udSpd * hack.vars.mult
					}
					if (!hack.getters.mode.moveUp && !hack.getters.mode.moveDown) {
						hack.getters.velocity[1] = 0
					}
				}
			}
			hack.playerMoveData.newMovementIsOn = true
		}

		function oldMovement() {
			hack.getters.client.loopFunctions[2].fun = function() {
				const grounded = isGrounded()

				if (hack.getters.mode.moveRight) {
					hack.getters.mode.player.gpData.p.velocity[0] = hack.vars.lrSpd * hack.vars.mult
				} else if (hack.getters.mode.moveLeft) {
					hack.getters.mode.player.gpData.p.velocity[0] = -hack.vars.lrSpd * hack.vars.mult
				}
				if (grounded) {
					if (hack.getters.mode.moveUp) {
						hack.getters.velocity[1] = 8
					}
				}
				if (hack.vars.ghost1) {
					if (hack.getters.mode.moveUp) {
						hack.getters.velocity[1] = hack.vars.udSpd * hack.vars.mult
					}
					if (hack.getters.mode.moveDown) {
						hack.getters.velocity[1] = -hack.vars.udSpd * hack.vars.mult
					}
					if (!hack.getters.mode.moveUp && !hack.getters.mode.moveDown) {
						hack.getters.velocity[1] = 0
					}
				}
			}
			hack.playerMoveData.newMovementIsOn = false
		}
		addEventListener("mousewheel", e => {
			window.tweenObjects.map(x => {
				try {
					if (e.shiftKey) {
						hack.getters.mode.player.gpData.p.velocity[0] = -Math.sign(e.deltaY) * 15;
					} else {
						hack.getters.mode.player.gpData.p.velocity[1] = -Math.sign(e.deltaY) * 15;
					}
				} catch (err) {
					console.error(err);
				}
			});
		})
	}

	let temp1 = {};
	const _call = Function.prototype.call;
	new Promise((resolve, reject) => {
		Function.prototype.call = function(...args) {
			if (args[2]?.exports) {
				temp1 = args[6]
				Function.prototype.call = _call
				console.log(temp1)
				resolve(temp1)
			}
			return _call.apply(this, args)
		};
	}).then((result) => {
		if (Object.keys(result).length > 0) {
			activateMain(result)
		} else {
			console.log("temp1 is empty")
		}
	}).catch((error) => {
		console.error("An error occurred:", error)
	})
}

if (sandboxURL.includes(window.location.href)) {
	sandboxHack();
} else if (twoPlayerURL.includes(window.location.href)) {
	twoPlayerHack();
} else if (hideAndSeekURL.includes(window.location.href)) {
	hideAndSeekHack();
}