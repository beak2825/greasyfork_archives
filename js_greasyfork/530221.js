// ==UserScript==
// @name         Bloxd.io Mod Menu | Made by iron web10
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Mod menu for Bloxd.io
// @author       iron web10
// @match        https://bloxd.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bloxd.io
// @grant        none
// @license      iron web10
// @downloadURL https://update.greasyfork.org/scripts/530221/Bloxdio%20Mod%20Menu%20%7C%20Made%20by%20iron%20web10.user.js
// @updateURL https://update.greasyfork.org/scripts/530221/Bloxdio%20Mod%20Menu%20%7C%20Made%20by%20iron%20web10.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getStorage(name) {
        return localStorage.getItem(name);
    }

    function setStorage(name, value) {
        localStorage.setItem(name, value);
    }

   
    const clickerConfig = JSON.parse(localStorage.getItem('bloxdClickerConfig')) || {
        leftClickKey: 'KeyR',
        rightClickKey: 'KeyF'
    };

    let minCPS = 10, maxCPS = 15;
    let leftClickActive = false, rightClickActive = false;
    let leftClickInterval, rightClickInterval;

    // Auto Clicker Functions
    function simulateClick(button) {
        const element = document.querySelector("#noa-canvas");
        if (!element) return;
        element.dispatchEvent(new MouseEvent("mousedown", { button, bubbles: true }));
        element.dispatchEvent(new MouseEvent("mouseup", { button, bubbles: true }));
        if (button === 0) element.dispatchEvent(new MouseEvent("click", { button, bubbles: true }));
        if (button === 2) element.dispatchEvent(new MouseEvent("contextmenu", { button, bubbles: true }));
    }

    function randomInterval() {
        return 1000 / (Math.random() * (maxCPS - minCPS) + minCPS);
    }

    function startLeftClick() {
        if (leftClickActive) return;
        leftClickActive = true;
        function loop() {
            if (!leftClickActive) return;
            simulateClick(0);
            leftClickInterval = setTimeout(loop, randomInterval());
        }
        loop();
    }

    function stopLeftClick() {
        leftClickActive = false;
        clearTimeout(leftClickInterval);
    }

    function toggleLeftClick() {
        leftClickActive ? stopLeftClick() : startLeftClick();
    }

    function startRightClick() {
        if (rightClickActive) return;
        rightClickActive = true;
        function loop() {
            if (!rightClickActive) return;
            simulateClick(2);
            rightClickInterval = setTimeout(loop, randomInterval());
        }
        loop();
    }

    function stopRightClick() {
        rightClickActive = false;
        clearTimeout(rightClickInterval);
    }

    function toggleRightClick() {
        rightClickActive ? stopRightClick() : startRightClick();
    }

    function saveClickerConfig() {
        localStorage.setItem('bloxdClickerConfig', JSON.stringify(clickerConfig));
    }

    function createMenu() {
        if (document.getElementById('modMenu')) return;

        let menu = document.createElement('div');
        menu.id = 'modMenu';
        menu.style.position = 'fixed';
        menu.style.top = getStorage('menuTop') || '50px';
        menu.style.left = getStorage('menuLeft') || '50px';
        menu.style.width = '200px';
        menu.style.background = 'rgba(0, 0, 0, 0.9)';
        menu.style.color = 'white';
        menu.style.padding = '15px';
        menu.style.borderRadius = '10px';
        menu.style.zIndex = '9999';
        menu.style.fontFamily = 'Arial';
        menu.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.2)';
        menu.style.display = getStorage('menuMinimized') === 'true' ? 'none' : 'flex';
        menu.style.flexDirection = 'column';
        menu.style.alignItems = 'center';

        let titleBar = document.createElement('div');
        titleBar.style.display = 'flex';
        titleBar.style.justifyContent = 'space-between';
        titleBar.style.alignItems = 'center';
        titleBar.style.cursor = 'move';
        titleBar.style.width = '100%';
        titleBar.style.padding = '5px';
        titleBar.style.background = '#333';
        titleBar.style.borderRadius = '5px';

        let title = document.createElement('h3');
        title.textContent = 'Bloxd.io Mod Menu';
        title.style.margin = '0';
        title.style.flexGrow = '1';
        title.style.color = 'white';

        let minimizeButton = document.createElement('button');
        minimizeButton.textContent = '-';
        minimizeButton.style.background = 'transparent';
        minimizeButton.style.color = 'white';
        minimizeButton.style.border = 'none';
        minimizeButton.style.cursor = 'pointer';

        titleBar.appendChild(title);
        titleBar.appendChild(minimizeButton);
        menu.appendChild(titleBar);

        let content = document.createElement('div');
        content.style.display = getStorage('menuMinimized') === 'true' ? 'none' : 'block';
        menu.appendChild(content);

        document.body.appendChild(menu);

        minimizeButton.addEventListener('click', function () {
            let isHidden = content.style.display === 'none';
            content.style.display = isHidden ? 'block' : 'none';
            setStorage('menuMinimized', !isHidden);
        });

        function createSwitch(name, callback) {
            let container = document.createElement('div');
            container.style.display = 'flex';
            container.style.justifyContent = 'space-between';
            container.style.alignItems = 'center';
            container.style.width = '100%';
            container.style.marginBottom = '5px';

            let label = document.createElement('span');
            label.textContent = name;
            label.style.flexGrow = '1';

            let switchContainer = document.createElement('label');
            switchContainer.style.position = 'relative';
            switchContainer.style.display = 'inline-block';
            switchContainer.style.width = '34px';
            switchContainer.style.height = '18px';

            let input = document.createElement('input');
            input.type = 'checkbox';
            input.style.opacity = '0';
            input.style.width = '0';
            input.style.height = '0';
            input.checked = getStorage(name) === 'true';

            let slider = document.createElement('span');
            slider.style.position = 'absolute';
            slider.style.cursor = 'pointer';
            slider.style.top = '0';
            slider.style.left = '0';
            slider.style.right = '0';
            slider.style.bottom = '0';
            slider.style.backgroundColor = input.checked ? '#4CAF50' : '#ccc';
            slider.style.transition = '.4s';
            slider.style.borderRadius = '18px';

            let circle = document.createElement('span');
            circle.style.position = 'absolute';
            circle.style.height = '14px';
            circle.style.width = '14px';
            circle.style.left = '2px';
            circle.style.bottom = '2px';
            circle.style.backgroundColor = 'white';
            circle.style.borderRadius = '50%';
            circle.style.transition = '.4s';
            circle.style.transform = input.checked ? 'translateX(16px)' : 'translateX(0)';

            slider.appendChild(circle);
            switchContainer.appendChild(input);
            switchContainer.appendChild(slider);
            container.appendChild(label);
            container.appendChild(switchContainer);
            content.appendChild(container);

            input.addEventListener('change', function () {
                slider.style.backgroundColor = this.checked ? '#4CAF50' : '#ccc';
                circle.style.transform = this.checked ? 'translateX(16px)' : 'translateX(0)';
                setStorage(name, this.checked);
                callback(this.checked);
            });

            if (input.checked) {
                callback(true);
            }
        }

        function createAutoClickerControls() {
            let container = document.createElement('div');
            container.style.width = '100%';
            container.style.marginTop = '10px';
            container.style.paddingTop = '10px';
            container.style.borderTop = '1px solid #333';

            let title = document.createElement('h4');
            title.textContent = 'Auto Clicker';
            title.style.margin = '0 0 10px 0';
            title.style.color = 'white';
            title.style.textAlign = 'center';
            container.appendChild(title);

            
            let leftClickContainer = document.createElement('div');
            leftClickContainer.style.display = 'flex';
            leftClickContainer.style.justifyContent = 'space-between';
            leftClickContainer.style.alignItems = 'center';
            leftClickContainer.style.width = '100%';
            leftClickContainer.style.marginBottom = '5px';

            let leftClickLabel = document.createElement('span');
            leftClickLabel.textContent = 'Left Click';
            leftClickLabel.style.flexGrow = '1';

            let leftClickToggle = document.createElement('button');
            leftClickToggle.textContent = leftClickActive ? 'ON' : 'OFF';
            leftClickToggle.style.background = leftClickActive ? '#4CAF50' : '#ccc';
            leftClickToggle.style.color = 'white';
            leftClickToggle.style.border = 'none';
            leftClickToggle.style.padding = '3px 10px';
            leftClickToggle.style.borderRadius = '3px';
            leftClickToggle.style.cursor = 'pointer';

            leftClickToggle.addEventListener('click', function() {
                toggleLeftClick();
                leftClickToggle.textContent = leftClickActive ? 'ON' : 'OFF';
                leftClickToggle.style.background = leftClickActive ? '#4CAF50' : '#ccc';
            });

            leftClickContainer.appendChild(leftClickLabel);
            leftClickContainer.appendChild(leftClickToggle);
            container.appendChild(leftClickContainer);

          
            let rightClickContainer = document.createElement('div');
            rightClickContainer.style.display = 'flex';
            rightClickContainer.style.justifyContent = 'space-between';
            rightClickContainer.style.alignItems = 'center';
            rightClickContainer.style.width = '100%';
            rightClickContainer.style.marginBottom = '5px';

            let rightClickLabel = document.createElement('span');
            rightClickLabel.textContent = 'Right Click';
            rightClickLabel.style.flexGrow = '1';

            let rightClickToggle = document.createElement('button');
            rightClickToggle.textContent = rightClickActive ? 'ON' : 'OFF';
            rightClickToggle.style.background = rightClickActive ? '#4CAF50' : '#ccc';
            rightClickToggle.style.color = 'white';
            rightClickToggle.style.border = 'none';
            rightClickToggle.style.padding = '3px 10px';
            rightClickToggle.style.borderRadius = '3px';
            rightClickToggle.style.cursor = 'pointer';

            rightClickToggle.addEventListener('click', function() {
                toggleRightClick();
                rightClickToggle.textContent = rightClickActive ? 'ON' : 'OFF';
                rightClickToggle.style.background = rightClickActive ? '#4CAF50' : '#ccc';
            });

            rightClickContainer.appendChild(rightClickLabel);
            rightClickContainer.appendChild(rightClickToggle);
            container.appendChild(rightClickContainer);

            
            let cpsContainer = document.createElement('div');
            cpsContainer.style.display = 'flex';
            cpsContainer.style.flexDirection = 'column';
            cpsContainer.style.width = '100%';
            cpsContainer.style.marginTop = '10px';

            let minCPSControl = document.createElement('div');
            minCPSControl.style.display = 'flex';
            minCPSControl.style.justifyContent = 'space-between';
            minCPSControl.style.alignItems = 'center';
            minCPSControl.style.width = '100%';
            minCPSControl.style.marginBottom = '5px';

            let minCPSLabel = document.createElement('span');
            minCPSLabel.textContent = 'Min CPS:';
            minCPSLabel.style.flexGrow = '1';

            let minCPSInput = document.createElement('input');
            minCPSInput.type = 'number';
            minCPSInput.value = minCPS;
            minCPSInput.min = '1';
            minCPSInput.max = '50';
            minCPSInput.style.width = '50px';
            minCPSInput.style.padding = '2px';

            minCPSInput.addEventListener('change', function() {
                minCPS = parseInt(this.value);
            });

            minCPSControl.appendChild(minCPSLabel);
            minCPSControl.appendChild(minCPSInput);
            cpsContainer.appendChild(minCPSControl);

            let maxCPSControl = document.createElement('div');
            maxCPSControl.style.display = 'flex';
            maxCPSControl.style.justifyContent = 'space-between';
            maxCPSControl.style.alignItems = 'center';
            maxCPSControl.style.width = '100%';
            maxCPSControl.style.marginBottom = '5px';

            let maxCPSLabel = document.createElement('span');
            maxCPSLabel.textContent = 'Max CPS:';
            maxCPSLabel.style.flexGrow = '1';

            let maxCPSInput = document.createElement('input');
            maxCPSInput.type = 'number';
            maxCPSInput.value = maxCPS;
            maxCPSInput.min = '1';
            maxCPSInput.max = '50';
            maxCPSInput.style.width = '50px';
            maxCPSInput.style.padding = '2px';

            maxCPSInput.addEventListener('change', function() {
                maxCPS = parseInt(this.value);
            });

            maxCPSControl.appendChild(maxCPSLabel);
            maxCPSControl.appendChild(maxCPSInput);
            cpsContainer.appendChild(maxCPSControl);

            container.appendChild(cpsContainer);

           
            let keybindContainer = document.createElement('div');
            keybindContainer.style.display = 'flex';
            keybindContainer.style.flexDirection = 'column';
            keybindContainer.style.width = '100%';
            keybindContainer.style.marginTop = '10px';

            let leftKeyControl = document.createElement('div');
            leftKeyControl.style.display = 'flex';
            leftKeyControl.style.justifyContent = 'space-between';
            leftKeyControl.style.alignItems = 'center';
            leftKeyControl.style.width = '100%';
            leftKeyControl.style.marginBottom = '5px';

            let leftKeyLabel = document.createElement('span');
            leftKeyLabel.textContent = 'Left Key:';
            leftKeyLabel.style.flexGrow = '1';

            let leftKeyInput = document.createElement('input');
            leftKeyInput.type = 'text';
            leftKeyInput.value = clickerConfig.leftClickKey;
            leftKeyInput.style.width = '50px';
            leftKeyInput.style.padding = '2px';

            leftKeyControl.appendChild(leftKeyLabel);
            leftKeyControl.appendChild(leftKeyInput);
            keybindContainer.appendChild(leftKeyControl);

            let rightKeyControl = document.createElement('div');
            rightKeyControl.style.display = 'flex';
            rightKeyControl.style.justifyContent = 'space-between';
            rightKeyControl.style.alignItems = 'center';
            rightKeyControl.style.width = '100%';
            rightKeyControl.style.marginBottom = '5px';

            let rightKeyLabel = document.createElement('span');
            rightKeyLabel.textContent = 'Right Key:';
            rightKeyLabel.style.flexGrow = '1';

            let rightKeyInput = document.createElement('input');
            rightKeyInput.type = 'text';
            rightKeyInput.value = clickerConfig.rightClickKey;
            rightKeyInput.style.width = '50px';
            rightKeyInput.style.padding = '2px';

            rightKeyControl.appendChild(rightKeyLabel);
            rightKeyControl.appendChild(rightKeyInput);
            keybindContainer.appendChild(rightKeyControl);

            let saveButton = document.createElement('button');
            saveButton.textContent = 'Save Keybinds';
            saveButton.style.width = '100%';
            saveButton.style.padding = '5px';
            saveButton.style.marginTop = '5px';
            saveButton.style.background = '#4CAF50';
            saveButton.style.color = 'white';
            saveButton.style.border = 'none';
            saveButton.style.borderRadius = '3px';
            saveButton.style.cursor = 'pointer';

            saveButton.addEventListener('click', function() {
                clickerConfig.leftClickKey = leftKeyInput.value;
                clickerConfig.rightClickKey = rightKeyInput.value;
                saveClickerConfig();
                alert('Keybinds saved!');
            });

            keybindContainer.appendChild(saveButton);
            container.appendChild(keybindContainer);

            content.appendChild(container);
        }

        let isDragging = false;
        let offsetX, offsetY;

        titleBar.addEventListener('mousedown', function (event) {
            isDragging = true;
            offsetX = event.clientX - menu.getBoundingClientRect().left;
            offsetY = event.clientY - menu.getBoundingClientRect().top;
            titleBar.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', function (event) {
            if (isDragging) {
                let left = event.clientX - offsetX;
                let top = event.clientY - offsetY;
                menu.style.left = `${left}px`;
                menu.style.top = `${top}px`;
                setStorage('menuLeft', left);
                setStorage('menuTop', top);
            }
        });

        document.addEventListener('mouseup', function () {
            isDragging = false;
            titleBar.style.cursor = 'move';
        });

        createSwitch('Full Screen Bypass', function (enabled) {
            if (enabled) {
                if (!window.fullScreenBypassInterval) {
                    window.fullScreenBypassInterval = setInterval(function () {
                        let elementToDelete = document.querySelector('.ForceRotateBackground.FullyFancyText');
                        if (elementToDelete) {
                            elementToDelete.remove();
                        }
                    }, 100);
                }
            } else {
                clearInterval(window.fullScreenBypassInterval);
                window.fullScreenBypassInterval = null;
            }
        });

        createSwitch('Bunny Jump', function (enabled) {
            if (enabled) {
                if (!window.infiniteJumpInterval) {
                    window.infiniteJumpInterval = setInterval(function () {
                        let event = new KeyboardEvent('keydown', {
                            key: ' ',
                            code: 'Space',
                            keyCode: 32,
                            which: 32,
                            bubbles: true
                        });
                        document.dispatchEvent(event);
                    }, 100);
                }
            } else {
                clearInterval(window.infiniteJumpInterval);
                window.infiniteJumpInterval = null;
            }
        });

        createSwitch('Add Remover', function (enabled) {
            if (enabled) {
                function hideAds() {
                    var elementsToHide = document.querySelectorAll(
                        '#gameadsbanner, .AdContainer, #cmpbox, .CookieConsent, [id*="fc-"], [class*="fc-"]'
                    );

                    elementsToHide.forEach(function(element) {
                        if (element) {
                            element.style.opacity = '0';
                            element.style.width = '0';
                            element.style.height = '0';
                            element.style.overflow = 'hidden';
                            element.style.position = 'absolute';
                        }
                    });

                    console.log("🚀 Add removed!");
                }

                setInterval(hideAds, 2000);
            }
        });

        createSwitch('Custom Crosshair', function (enabled) {
            if (enabled) {
                let crosshairUrl = prompt("Ingrese la URL de la imagen para la Crosshair:", getStorage('crosshairURL') || '');
                if (crosshairUrl) {
                    setStorage('crosshairURL', crosshairUrl);
                    applyCrosshair(crosshairUrl);
                }
            } else {
                applyCrosshair(null);
            }
        });

        let isLMBCounterEnabled = false;
        let isRMBCounterEnabled = false;

        createSwitch('Enable LMB CPS Counter', function (enabled) {
            isLMBCounterEnabled = enabled;
        });

        createSwitch('Enable RMB CPS Counter', function (enabled) {
            isRMBCounterEnabled = enabled;
        });

        let LMBclickTimes = [];
        let RMBclickTimes = [];
        document.addEventListener('mousedown', function (event) {
            if (event.button === 0 && isLMBCounterEnabled) {
                LMBcountClick();
            } else if (event.button === 2 && isRMBCounterEnabled) {
                RMBcountClick();
            }
        });

        function LMBcountClick() {
            var LMBcurrentTime = new Date().getTime();
            LMBclickTimes.push(LMBcurrentTime);
            LMBupdateCPS();
            if (new Date().getTime() - LMBcurrentTime >= 1000) {
                LMBValue.textContent = '0';
            }
        }

        function RMBcountClick() {
            var RMBcurrentTime = new Date().getTime();
            RMBclickTimes.push(RMBcurrentTime);
            RMBupdateCPS();
            if (new Date().getTime() - RMBcurrentTime >= 1000) {
                RMBValue.textContent = '0';
            }
        }

        function LMBupdateCPS() {
            var currentTime = new Date().getTime();
            var oneSecondAgo = currentTime - 1000;
            var LMBcount = 0;

            for (var i = LMBclickTimes.length - 1; i >= 0; i--) {
                if (LMBclickTimes[i] >= oneSecondAgo) {
                    LMBcount++;
                } else {
                    break;
                }
            }

            LMBValue.textContent = LMBcount;
        }

        function RMBupdateCPS() {
            var currentTime = new Date().getTime();
            var oneSecondAgo = currentTime - 1000;
            var RMBcount = 0;

            for (var i = RMBclickTimes.length - 1; i >= 0; i--) {
                if (RMBclickTimes[i] >= oneSecondAgo) {
                    RMBcount++;
                } else {
                    break;
                }
            }

            RMBValue.textContent = RMBcount;
        }

        var cpsButton = document.createElement('div');
        cpsButton.style.position = 'fixed';
        cpsButton.style.top = '10px';
        cpsButton.style.left = '745px';
        cpsButton.style.backgroundColor = 'black';
        cpsButton.style.color = 'white';
        cpsButton.style.padding = '5px';
        cpsButton.style.fontFamily = 'Arial';
        cpsButton.style.fontSize = '20px';
        cpsButton.style.zIndex = '9999';
        cpsButton.textContent = '';

        var LMBValue = document.createElement('span');
        LMBValue.textContent = '0';
        var cpsLabel = document.createElement('span');
        cpsLabel.textContent = ' | ';
        var RMBValue = document.createElement('span');
        RMBValue.textContent = '0';

        cpsButton.appendChild(LMBValue);
        cpsButton.appendChild(cpsLabel);
        cpsButton.appendChild(RMBValue);
        document.body.appendChild(cpsButton);

        function applyCrosshair(url) {
            let crosshair = document.querySelector('.CrossHair');
            if (crosshair) {
                crosshair.textContent = "";
                if (url) {
                    crosshair.style.backgroundImage = `url(${url})`;
                    crosshair.style.backgroundRepeat = "no-repeat";
                    crosshair.style.backgroundSize = "contain";
                    crosshair.style.width = "50px";
                    crosshair.style.height = "50px";
                } else {
                    crosshair.style.backgroundImage = "";
                }
            }
        }

        let savedCrosshair = getStorage('crosshairURL');
        if (savedCrosshair) {
            applyCrosshair(savedCrosshair);
        }

        let reloadContainer = document.createElement('div');
        reloadContainer.style.display = 'flex';
        reloadContainer.style.flexDirection = 'column';
        reloadContainer.style.alignItems = 'center';
        reloadContainer.style.width = '100%';
        reloadContainer.style.marginBottom = '5px';

        let reloadLabel = document.createElement('span');
        reloadLabel.textContent = 'Account Generator';
        reloadLabel.style.flexGrow = '1';
        reloadLabel.style.textAlign = 'center';

        let reloadButtonContainer = document.createElement('label');
        reloadButtonContainer.style.position = 'relative';
        reloadButtonContainer.style.display = 'inline-block';
        reloadButtonContainer.style.width = 'auto';

        let reloadButton = document.createElement('button');
        reloadButton.textContent = 'Account Gen';
        reloadButton.style.backgroundColor = '#4CAF50';
        reloadButton.style.color = 'white';
        reloadButton.style.border = 'none';
        reloadButton.style.padding = '5px 10px';
        reloadButton.style.marginTop = '10px';
        reloadButton.style.cursor = 'pointer';
        reloadButton.style.borderRadius = '5px';
        reloadButton.disabled = true;

        reloadButton.addEventListener('click', function () {
            location.reload();
            var cookies = document.cookie.split(";");
            for (var _i = 0, cookies_1 = cookies; _i < cookies_1.length; _i++) {
                var cookie = cookies_1[_i];
                var eqPos = cookie.indexOf("=");
                var name_1 = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                document.cookie = name_1 + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
            }
        });

        reloadButtonContainer.appendChild(reloadButton);
        reloadContainer.appendChild(reloadLabel);
        reloadContainer.appendChild(reloadButtonContainer);
        content.appendChild(reloadContainer);

        setTimeout(function () {
            reloadButton.disabled = false;
        }, 3000);

        
        createAutoClickerControls();
    }

    
    document.addEventListener("keydown", (event) => {
        if (event.repeat || ["INPUT", "TEXTAREA"].includes(event.target.tagName) || event.target.isContentEditable) return;
        if (event.code === clickerConfig.leftClickKey) toggleLeftClick();
        if (event.code === clickerConfig.rightClickKey) toggleRightClick();
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createMenu);
    } else {
        createMenu();
    }
})();