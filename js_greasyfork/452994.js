// ==UserScript==
// @name         Diep.io Auto Tank Builder/Upgrader - Enhance Your Diep.io Gameplay Experience!
// @version      1.6
// @description  Streamline your Diep.io gameplay with the ultimate auto tank builder and upgrader, empowering you with optimized builds for strategic dominance.
// @author       Its_Arslan
// @match        *://diep.io/*
// @grant        none
// @namespace    https://greasyfork.org/users/970291
// @license      CC BY-NC-ND
// @downloadURL https://update.greasyfork.org/scripts/452994/Diepio%20Auto%20Tank%20BuilderUpgrader%20-%20Enhance%20Your%20Diepio%20Gameplay%20Experience%21.user.js
// @updateURL https://update.greasyfork.org/scripts/452994/Diepio%20Auto%20Tank%20BuilderUpgrader%20-%20Enhance%20Your%20Diepio%20Gameplay%20Experience%21.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var textG = document.createElement("div");
  document.getElementsByTagName("body")[0].appendChild(textG);
  textG.innerHTML = `
  <style>
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

.mainMenuDiv {
    align-items: center;
	background-attachment: scroll;
	background-image: url("https://wallpapercave.com/wp/wp5102770.jpg");
	background-position: center center;
	background-repeat: no-repeat;
	background-size: cover;
	border-bottom-left-radius: 20px;
	border-color: black;
	border-right-width: 2px;
	border-style: solid;
	border-top-left-radius: 20px;
	border-width: 5px;
	color: white;
	display: flex;
	flex-direction: column;
	flex-wrap: nowrap;
	justify-content: center;
	position: absolute;
	transform: translate(0, -50%);
	right: 0%;
	top: 45%;
	z-index: 9999;
}

.infoDiv {
	align-items: center;
	color: white;
	cursor: default;
	display: flex;
	flex-direction: column;
	flex-wrap: nowrap;
	font-weight: 700;
	justify-content: center;
	margin-top: 20px;
	margin-bottom: 10px;
	position: relative;
	text-shadow: -1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black;
}

.nameBtn {
	background-color: transparent;
	border: none;
	color: white;
	cursor: default;
	font-size: 45px;
	padding: 0px;
}

.hideBtn {
	background-color: transparent;
	border: none;
	color: white;
	cursor: default;
	font-family: Arial;
	font-size: 16px;
	margin-top: 3px;
	margin-bottom: 3px;
	padding: 0px;
}

.websiteBtn {
	background-color: rgba(225, 20, 80, 0.8);
	border: 2px solid black;
	border-radius: 5px;
	color: white;
	cursor: pointer;
	font-size: 28px;
	height: 35px;
	padding: 0px;
	transition-duration: 0.2s;
	width: 200px;
}

.websiteBtn:hover {
	background-color: rgba(225, 20, 80, 1);
	transform: scale(1.05);
}

.buildButtonsDiv {
	align-items: center;
	display: flex;
	flex-direction: column;
	flex-wrap: nowrap;
	justify-content: center;
	margin-left: 20px;
	margin-right: 20px;
}

.buildButton {
	align-items: center;
	background-color: rgba(225, 20, 80, 0.8);
	border: 2px solid black;
	border-radius: 5px;
	color: white;
	cursor: pointer;
	display: flex;
	font-size: 20px;
	height: 30px;
	justify-content: center;
	padding: 0px 0px;
	margin-top: 2px;
	margin-bottom: 1px;
	transition-duration: 0.2s;
	white-space: nowrap;
	width: 200px;
}

.buildButton:hover {
	background-color: rgba(225, 20, 80, 1);
	transform: scale(1.05);
}

.controlButtonsDiv {
	display: flex;
	justify-content: space-between;
	width: 200px;
	flex-direction: row;
	flex-wrap: nowrap;
	margin-top: 5px;
	margin-bottom: 20px;
	align-items: center;
}

.musicBtn {
	background-image: url("https://i.imgur.com/0iikTOM.png");
	background-size: contain;
	background-position: center;
	background-repeat: no-repeat;
	width: calc(50% - 1px);
	height: 50px;
	position: relative;
	background-color: rgba(225, 20, 80, 0.8);
	border: 2px solid black;
	color: white;
	border-radius: 5px;
	transition-duration: 0.2s;
	cursor: pointer;
	padding: 0px;
	margin: 0px;
	white-space: nowrap;
}

.musicBtn:hover {
	background-color: rgba(225, 20, 80, 1);
	transform: scale(1.05);
}

.settingBtn {
	background-image: url(https://i.imgur.com/CbWdWZs.png);
	background-size: contain;
	background-position: center;
	background-repeat: no-repeat;
	width: calc(50% - 1px);
	height: 50px;
	position: relative;
	background-color: rgba(225, 20, 80, 0.8);
	border: 2px solid black;
	color: white;
	border-radius: 5px;
	transition-duration: 0.2s;
	cursor: pointer;
	padding: 0px;
	margin: 0px;
	white-space: nowrap;
}

.settingBtn:hover {
	background-color: rgba(225, 20, 80, 1);
	transform: scale(1.05);
}

.settingMenuDiv {
	display: none;
	flex-direction: column;
	flex-wrap: nowrap;
	justify-content: center;
	align-items: center;
	background-attachment: scroll;
	background-image: url("https://picstatio.com/large/9671a6/minimal-night-mountains-fox-digital-artwork.jpg");
	background-position: center center;
	background-repeat: no-repeat;
	background-size: cover;
	border-bottom-left-radius: 20px;
	border-bottom-right-radius: 20px;
	border-color: black;
	border-style: solid;
	border-top-left-radius: 20px;
	border-top-right-radius: 20px;
	border-width: 5px;
	color: white;
	padding: 20px;
	position: absolute;
	right: 50%;
	top: 40%;
	transform: translate(50%, -50%);
	z-index: 9999;
}

.buildsConfigDiv {
	align-items: center;
	display: flex;
	flex-direction: column;
	flex-wrap: nowrap;
	justify-content: center;
	margin-bottom: 15px;
}

.buildConfigButton {
	align-items: center;
	background-color: rgba(225, 20, 80, 0.8);
	border: 2px solid black;
	border-radius: 5px;
	color: white;
	cursor: pointer;
	display: flex;
	font-size: 20px;
	height: 30px;
	justify-content: center;
	padding: 0px 0px;
	margin-top: 2px;
	margin-bottom: 1px;
	transition-duration: 0.2s;
	white-space: nowrap;
	width: 200px;
}

.buildConfigButton:hover {
	background-color: rgba(225, 20, 80, 1);
	transform: scale(1.05);
}

.buildDropdownDiv {
	display: flex;
	width: 180px;
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: space-between;
	align-items: center;
	margin-top: 2px;
	margin-bottom: 15px;
}

.editBtn {
	font-size: 18px;
	width: calc(50% - 2px);
	height: 25px;
	padding: 0px;
	border: 2px solid black;
	background-color: rgba(225, 20, 80, 0.8);
	color: white;
	transition-duration: 0.2s;
	border-radius: 5px;
}

.editBtn:hover {
	background-color: rgba(225, 20, 80, 1);
	transform: scale(1.05);
}

.deleteBtn {
	font-size: 18px;
	width: calc(50% - 2px);
	height: 25px;
	padding: 0px;
	border: 2px solid black;
	background-color: rgba(225, 20, 80, 0.8);
	color: white;
	transition-duration: 0.2s;
	border-radius: 5px;
}

.deleteBtn:hover {
	background-color: rgba(225, 20, 80, 1);
	transform: scale(1.05);
}

.addBuildDiv {
	display: flex;
	flex-direction: column;
	flex-wrap: nowrap;
	justify-content: center;
	align-items: center;
	position: relative;
	padding: 0px;
	width: 200px;
}

.addBuildBtn {
	background-color: rgba(225, 20, 80, 0.8);
	border: 2px solid black;
	border-radius: 5px;
	color: white;
	cursor: pointer;
	display: flex;
	font-size: 20px;
	height: 35px;
	padding: 0px 0px;
	margin: 0px;
	transition-duration: 0.2s;
	width: 200px;
	justify-content: center;
	align-items: center;
}

.addBuildBtn:hover {
	background-color: rgba(225, 20, 80, 1);
	transform: scale(1.05);
}

.addBuildInputDiv {
	display: none;
	flex-direction: column;
	flex-wrap: nowrap;
	justify-content: space-between;
	align-items: center;
	position: relative;
	padding: 0px;
	margin-bottom: 1px;
	height: 60px;
	width: 200px;
}

.input {
	position: relative;
	font-family: Arial;
	font-size: 16px;
	background-color: transparent;
	border: none;
	border-bottom: 2px solid white;
	color: white;
	border-radius: 0;
	height: 25px;
	padding: 0;
	margin: 0;
	width: 200px;
	transition-duration: 0.2s;
}

.input:focus {
	border-bottom: 2px solid #E11450;
	outline: none;
}

::placeholder {
	color: white;
	font-size: 16px;
	transition-duration: 0.2s;
	transition-timing-function: ease-in;
}

.input:focus::placeholder {
	position: absolute;
	justify-content: flex-start;
	align-items: flex-start;
	display: flex;
	font-size: 0px;
}

.addBuildActionDiv {
	display: none;
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: space-between;
	align-items: center;
	position: relative;
	margin-top: 3px;
	height: 30px;
	width: 200px;
}

.saveBuildBtn {
	font-size: 18px;
	width: calc(50% - 1px);
	height: 30px;
	padding: 0px;
	border: 2px solid black;
	background-color: rgba(225, 20, 80, 0.8);
	color: white;
	transition-duration: 0.2s;
	border-radius: 5px;
}

.saveBuildBtn:hover {
	background-color: rgba(225, 20, 80, 1);
	transform: scale(1.05);
}

.discardBuildBtn {
	font-size: 18px;
	width: calc(50% - 1px);
	height: 30px;
	padding: 0px;
	border: 2px solid black;
	background-color: rgba(225, 20, 80, 0.8);
	color: white;
	transition-duration: 0.2s;
	border-radius: 5px;
}

.discardBuildBtn:hover {
	background-color: rgba(225, 20, 80, 1);
	transform: scale(1.05);
}

.notificationDiv {
	display: flex;
	height: 4vh;
	flex-direction: column-reverse;
	flex-wrap: nowrap;
	justify-content: flex-end;
	align-items: center;
	transform: translateY(80px);
    pointer-events: none;
}

.notificationCurrent {
	font-size: 24px !important;
}

.printNotification {
	font-family: Arial;
	margin: 0px;
	font-size: 18px;
	color: #069C56;
    pointer-events: none;
	z-index: 9999;
}

.warnNotification {
	font-family: Arial;
	margin: 0px;
	font-size: 18px;
	color: #FF681E;
    pointer-events: none;
	z-index: 9999;
}

.errorNotification {
	font-family: Arial;
	margin: 0px;
	font-size: 18px;
	color: #D3212C;
    pointer-events: none;
	z-index: 9999;
}
  </style>
`;
    var defaultJson = {
    builds: [{
            id: "01",
            name: "Stable",
            code: "765421765421765421765421765421765"
        },
        {
            id: "02",
            name: "Bullet Storm",
            code: "212127654765476547654765476547652"
        },
        {
            id: "03",
            name: "Glass Cannon",
            code: "567567485675674856748567456744488"
        },
        {
            id: "04",
            name: "Rammer",
            code: "111888232323232323231181188867676"
        },
        {
            id: "05",
            name: "Null",
            code: "000000000000000000000000000000000"
        },
        {
            id: "06",
            name: "Null",
            code: "000000000000000000000000000000000"
        },
        {
            id: "07",
            name: "Null",
            code: "000000000000000000000000000000000"
        }
    ]
};

var jsonData = loadJson();

function loadJson() {
    var jsonData = localStorage.getItem('builds');
    if (!jsonData) {
        localStorage.setItem('builds', JSON.stringify(defaultJson));
        jsonData = localStorage.getItem('builds');
    }
    return JSON.parse(jsonData);
}

var notificationQueue = [];

function notification(message, type) {
    var notificationDiv = document.getElementById("notificationDiv");
    var notification = document.createElement('h3');
    notification.textContent = message;
    notification.style.transform = "scale(0.8)";
    notification.style.opacity = "0";

    var oldNotification = document.querySelector(".notificationCurrent");
    if (oldNotification) {
        oldNotification.classList.remove("notificationCurrent");
    }

    switch (type) {
        case "print":
            notification.classList.add("notificationCurrent", "printNotification");
            break;
        case "warn":
            notification.classList.add("notificationCurrent", "warnNotification");
            break;
        case "error":
            notification.classList.add("notificationCurrent", "errorNotification");
            break;
    }

    notificationDiv.appendChild(notification);

    setTimeout(function() {
        notification.style.transition = "transform 0.5s ease, opacity 0.5s ease";
        notification.style.transform = "scale(1)";
        notification.style.opacity = "1";
    }, 0);

    setTimeout(function() {
        notification.style.transition = "transform 0.8s ease, opacity 0.8s ease";
        notification.style.transform = "scale(0.0)";
        notification.style.opacity = "0";

        setTimeout(function() {
            notificationDiv.removeChild(notification);
        }, 500);
    }, 2500);
}

function buildsConfigDropdown(build, buildButtonsDiv, buildsConfigDiv, buildConfigButton) {
    document.querySelector('.addBuildInputDiv').style.display = "none";
    document.querySelector('.addBuildActionDiv').style.display = "none";
    document.querySelector('.addBuildBtn').style.display = "flex";

    var existingDropdown = buildConfigButton.nextElementSibling;
    if (existingDropdown && existingDropdown.classList.contains('buildDropdownDiv')) {
        existingDropdown.remove();
        return;
    }

    var buildInputs = document.getElementsByClassName('input');
    buildInputs.value = '';

    document.querySelectorAll('.buildDropdownDiv').forEach(function(element) {
        element.remove();
    });

    var buildDropdownDiv = document.createElement('div');
    buildDropdownDiv.className = 'buildDropdownDiv';

    var editBtn = document.createElement('button');
    editBtn.className = 'editBtn';
    editBtn.textContent = 'Edit';

    var deleteBtn = document.createElement('button');
    deleteBtn.className = 'deleteBtn';
    deleteBtn.textContent = 'Delete';

    buildDropdownDiv.appendChild(editBtn);
    buildDropdownDiv.appendChild(deleteBtn);

    buildConfigButton.parentNode.insertBefore(buildDropdownDiv, buildConfigButton.nextSibling);

    editBtn.addEventListener('click', function() {
        notification('Edit feature is coming soon.', 'print');
    });

    deleteBtn.addEventListener('click', function() {
        var nullBuild = {
            id: build.id,
            name: 'Null',
            code: '000000000000000000000000000000000'
        };

        var buildIndex = jsonData.builds.findIndex(function(item) {
            return item.id === build.id;
        });

        notification(build.name + ' has been deleted successfully.', 'print');

        if (buildIndex !== -1) {
            jsonData.builds[buildIndex] = nullBuild;
            localStorage.setItem('builds', JSON.stringify(jsonData));

            document.querySelectorAll('.buildDropdownDiv').forEach(function(element) {
                element.remove();
            });
            document.querySelector(".buildButtonsDiv [id='" + build.id + "']").remove();
            buildConfigButton.remove();
        }
    });
};

function addHtml() {
    var jsonData = loadJson();
    if (!jsonData || !jsonData.builds) {
        jsonData = defaultJson;
    }

    var mainMenuDiv = document.createElement('div');
    mainMenuDiv.className = 'mainMenuDiv';
    mainMenuDiv.id = 'mainMenuDiv';

    var settingMenuDiv = document.createElement('div');
    settingMenuDiv.className = 'settingMenuDiv';
    settingMenuDiv.id = 'settingMenuDiv';

    var notificationDiv = document.createElement('div');
    notificationDiv.className = 'notificationDiv';
    notificationDiv.id = 'notificationDiv';

    var infoDiv = document.createElement('div');
    infoDiv.className = 'infoDiv';
    mainMenuDiv.appendChild(infoDiv);

    var buildButtonsDiv = document.createElement('div');
    buildButtonsDiv.className = 'buildButtonsDiv';
    mainMenuDiv.appendChild(buildButtonsDiv);

    var controlButtonsDiv = document.createElement('div');
    controlButtonsDiv.className = 'controlButtonsDiv';
    mainMenuDiv.appendChild(controlButtonsDiv);

    var buildsConfigDiv = document.createElement('div');
    buildsConfigDiv.className = 'buildsConfigDiv';
    settingMenuDiv.appendChild(buildsConfigDiv);

    var addBuildDiv = document.createElement('div');
    addBuildDiv.className = 'addBuildDiv';
    settingMenuDiv.appendChild(addBuildDiv);

    var nameBtn = document.createElement('button');
    nameBtn.className = 'nameBtn';
    nameBtn.textContent = 'Its_Arslan';
    infoDiv.appendChild(nameBtn);

    var hideBtn = document.createElement('button');
    hideBtn.className = 'hideBtn';
    hideBtn.textContent = 'Press T To Hide';
    infoDiv.appendChild(hideBtn);

    var websiteBtn = document.createElement('button');
    websiteBtn.className = 'websiteBtn';
    websiteBtn.textContent = 'Website';
    infoDiv.appendChild(websiteBtn);

    nameBtn.addEventListener("click", function() {
        var link = "https://greasyfork.org/en/users/970291";
        window.open(link, "_blank");
    });

    hideBtn.addEventListener("click", function() {
        mainMenuDiv.style.display = "none";
        settingMenuDiv.style.display = "none";
    });

    websiteBtn.addEventListener("click", function() {
        var link = "https://site--arslanbehleem.repl.co/";
        window.open(link, "_blank");
    });

    jsonData.builds.forEach(function(build) {
        if (build.name !== 'Null') {
            var buildButton = document.createElement('button');
            buildButton.id = build.id;
            buildButton.className = 'buildButton';
            buildButton.textContent = build.name;
            buildButton.setAttribute('onclick', "input.execute('game_stats_build " + build.code + "')");
            buildButtonsDiv.appendChild(buildButton);

            buildButton.addEventListener('click', function() {
                notification(build.name + ' has been activated.', "print");
            });

            var buildConfigButton = document.createElement('button');
            buildConfigButton.id = build.id;
            buildConfigButton.className = 'buildConfigButton';
            buildConfigButton.textContent = build.name;
            buildsConfigDiv.appendChild(buildConfigButton);

            buildConfigButton.addEventListener('click', function() {
                buildsConfigDropdown(build, buildButtonsDiv, buildsConfigDiv, buildConfigButton);
            });
        }
    });

    var addBuildBtn = document.createElement('button');
    addBuildBtn.className = 'addBuildBtn';
    addBuildBtn.textContent = 'Add Build';
    addBuildDiv.appendChild(addBuildBtn);

    var addBuildInputDiv = document.createElement('div');
    addBuildInputDiv.className = 'addBuildInputDiv';
    addBuildDiv.appendChild(addBuildInputDiv);

    var addBuildActionDiv = document.createElement('div');
    addBuildActionDiv.className = 'addBuildActionDiv';
    addBuildDiv.appendChild(addBuildActionDiv);

    addBuildBtn.addEventListener('click', function() {
        if (buildsConfigDiv) {
            var existingDropdowns = buildsConfigDiv.querySelectorAll('.buildDropdownDiv');

            for (var i = 0; i < existingDropdowns.length; i++) {
                existingDropdowns[i].remove();
            }
        }

        addBuildBtn.style.display = "none";
        addBuildInputDiv.style.display = "flex";
        addBuildActionDiv.style.display = "flex";
    });

    var buildNameInput = document.createElement('input');
    buildNameInput.type = 'text';
    buildNameInput.className = 'input';
    buildNameInput.placeholder = 'Enter Build Name';
    addBuildInputDiv.appendChild(buildNameInput);

    buildNameInput.addEventListener('keydown', function(event) {
        event.stopPropagation();
        if (
            event.key === 'Backspace' ||
            (event.ctrlKey && event.key === 'c') ||
            (event.ctrlKey && event.key === 'a') ||
            (event.ctrlKey && event.key === 'x') ||
            (event.ctrlKey && event.key === 'v') ||
            event.key.includes('Arrow') ||
            (event.shiftKey && event.key.includes('Arrow'))
        ) {
            return;
        }

        if (
            !(event.key.match(/^[a-zA-Z0-9_ -]$/)) ||
            buildNameInput.value.length >= 16
        ) {
            event.preventDefault();
        }
    });

    buildNameInput.addEventListener('input', function() {
        var sanitizedText = buildNameInput.value.replace(/[^a-zA-Z0-9_ -]/g, '');
        var maxLength = 16;

        if (sanitizedText.length > maxLength) {
            sanitizedText = sanitizedText.substring(0, maxLength);
        }

        if (buildNameInput.value !== sanitizedText) {
            buildNameInput.value = sanitizedText;
        }
    });

    var buildCodeInput = document.createElement('input');
    buildCodeInput.type = 'text';
    buildCodeInput.className = 'input';
    buildCodeInput.placeholder = 'Enter Build Code';
    addBuildInputDiv.appendChild(buildCodeInput);

    buildCodeInput.addEventListener('keydown', function(event) {
        event.stopPropagation();
        if (
            event.key === 'Backspace' ||
            (event.ctrlKey && event.key === 'c') ||
            (event.ctrlKey && event.key === 'a') ||
            (event.ctrlKey && event.key === 'x') ||
            (event.ctrlKey && event.key === 'v') ||
            event.key.includes('Arrow') ||
            (event.shiftKey && event.key.includes('Arrow'))
        ) {
            return;
        }

        if (
            !(event.key.match(/^[1-8]$/)) ||
            buildCodeInput.value.length >= 33
        ) {
            event.preventDefault();
        }
    });

    buildCodeInput.addEventListener('input', function() {
        var sanitizedCode = buildCodeInput.value.replace(/[^1-8]/g, '');
        var maxLength = 33;

        if (sanitizedCode.length > maxLength) {
            sanitizedCode = sanitizedCode.substring(0, maxLength);
        }

        if (buildCodeInput.value !== sanitizedCode) {
            buildCodeInput.value = sanitizedCode;
        }
    });

    var saveBuildBtn = document.createElement('button');
    saveBuildBtn.className = 'saveBuildBtn';
    saveBuildBtn.textContent = 'Save';
    addBuildActionDiv.appendChild(saveBuildBtn);

    saveBuildBtn.addEventListener('click', function() {
        var newName = buildNameInput.value;
        var newCode = buildCodeInput.value;

        if (buildCodeInput.value.length !== 33) {
            notification("BuildCode must be exactly 33 characters in length.", "error");
        } else {
            if (newName && newCode) {
                var build = jsonData.builds.find(function(build) {
                    return build.name === 'Null';
                });

                if (build) {
                    build.name = newName;
                    build.code = newCode;
                } else {
                    return;
                }

                notification(build.name + " has been saved.", "print");

                addBuildInputDiv.style.display = "none";
                addBuildActionDiv.style.display = "none";
                addBuildBtn.style.display = "flex";
                buildNameInput.value = '';
                buildCodeInput.value = '';

                var buildButton = document.createElement('button');
                buildButton.id = build.id;
                buildButton.className = 'buildButton';
                buildButton.textContent = build.name;
                buildButton.setAttribute('onclick', "input.execute('game_stats_build " + build.code + "')");
                buildButtonsDiv.appendChild(buildButton);

                buildButton.addEventListener('click', function() {
                    notification(build.name + ' has been activated.', "print");
                });

                var buildConfigButton = document.createElement('button');
                buildConfigButton.id = build.id;
                buildConfigButton.className = 'buildConfigButton';
                buildConfigButton.textContent = build.name;
                buildsConfigDiv.appendChild(buildConfigButton);

                buildConfigButton.addEventListener('click', function() {
                    buildsConfigDropdown(build, buildButtonsDiv, buildsConfigDiv, buildConfigButton);
                });

                localStorage.setItem('builds', JSON.stringify(jsonData));
            }
        }
    });

    var discardBuildBtn = document.createElement('button');
    discardBuildBtn.className = 'discardBuildBtn';
    discardBuildBtn.textContent = 'Discard';
    addBuildActionDiv.appendChild(discardBuildBtn);

    discardBuildBtn.addEventListener('click', function() {
        addBuildInputDiv.style.display = "none";
        addBuildActionDiv.style.display = "none";
        addBuildBtn.style.display = "flex";
        buildNameInput.value = '';
        buildCodeInput.value = '';
    });

    var musicBtn = document.createElement('button');
    musicBtn.className = 'musicBtn';
    controlButtonsDiv.appendChild(musicBtn);

    var settingBtn = document.createElement('button');
    settingBtn.className = 'settingBtn';
    controlButtonsDiv.appendChild(settingBtn)

    musicBtn.addEventListener('click', function() {
        notification('Music feature is coming soon.', 'print');
    });

    settingBtn.addEventListener('click', function() {
        document.querySelector('.addBuildInputDiv').style.display = "none";
        document.querySelector('.addBuildActionDiv').style.display = "none";
        document.querySelector('.addBuildBtn').style.display = "flex";
        buildNameInput.value = '';
        buildCodeInput.value = '';
        document.querySelectorAll('.buildDropdownDiv').forEach(function(element) {
            element.remove();
        });

        var existingDropdowns = settingMenuDiv.querySelectorAll('.buildDropdownDiv');
        for (var i = 0; i < existingDropdowns.length; i++) {
            existingDropdowns[i].remove();
        }

        settingMenuDiv.style.display = (settingMenuDiv.style.display === 'flex') ? 'none' : 'flex';
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 't') {
            if (mainMenuDiv.style.display === 'flex' || mainMenuDiv.style.display === '') {
                mainMenuDiv.style.display = settingMenuDiv.style.display = 'none';
            } else {
                mainMenuDiv.style.display = 'flex';
            }
        }
    });

    document.body.appendChild(mainMenuDiv);
    document.body.appendChild(settingMenuDiv);
    document.body.appendChild(notificationDiv);

    setTimeout(function() {
        notification("Auto Tank Builder/Upgrader has been loaded.", "print");
    }, 500);
}

addHtml();
})();