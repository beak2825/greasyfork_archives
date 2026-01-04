// ==UserScript==
// @name         bloxd.io no hit cool down + instant break + hide gui + auto deny telport and auto respawn
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description   this is a fun experince for people no copying it u can get banned using this if u do it around players so do it someweres away from players
// @author       airtrash
// @match        https://bloxd.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bloxd.io
// @grant        none
// @license      BItTORRENT-1.0
// @downloadURL https://update.greasyfork.org/scripts/545154/bloxdio%20no%20hit%20cool%20down%20%2B%20instant%20break%20%2B%20hide%20gui%20%2B%20auto%20deny%20telport%20and%20auto%20respawn.user.js
// @updateURL https://update.greasyfork.org/scripts/545154/bloxdio%20no%20hit%20cool%20down%20%2B%20instant%20break%20%2B%20hide%20gui%20%2B%20auto%20deny%20telport%20and%20auto%20respawn.meta.js
// ==/UserScript==


;(original => (Date.now = () => original() * 2.1).toString = () => "function now() {\n    [native code]\n}")(Date.now);
(function() {
    'use strict';

    var wholeAppWrapper = document.querySelector(".WholeAppWrapper");
    document.addEventListener('keydown', function(event) {
        if (event.key === 'U') {
            if (wholeAppWrapper.style.visibility === 'hidden') {
                wholeAppWrapper.style.visibility = 'visible';
            } else {
                wholeAppWrapper.style.visibility = 'hidden';
            }
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'u') {
            if (wholeAppWrapper.style.visibility === 'hidden') {
                wholeAppWrapper.style.visibility = 'visible';
            } else {
                wholeAppWrapper.style.visibility = 'hidden';
            }
        }
    });

})()(function() {
    'use strict';
    //  it doesnt say anything....
    let GUI_THEME = {
        mainColor: "#b51515",
        transparentColor: "rgba(255, 0, 0, 0.4)",
        gradientFirst: "#6C3E93",
        gradientSecond: "#4B0082"
    }
    function addColorPicker(thingToChange) {
        let colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = thingToChange;
        colorInput.style.width = '100px';
 
        colorInput.addEventListener('input', function (event) {
            thingToChange = event.target.value;
            updateGUIColors(GUI_THEME.mainColor, GUI_THEME.transparentColor, GUI_THEME.gradientFirst, GUI_THEME.gradientSecond);
        });
        gui.appendChild(colorInput)
        return colorInput;
    }
 
 
    document.querySelector('.Title.FullyFancyText').textContent = "LeiClient";
    let toggleKey = 'T';
 
    document.addEventListener('keydown', function(event) {
        if (event.key.toUpperCase() === toggleKey) {
            if (gui.style.display === 'none') {
                gui.style.display = 'block';
            } else {
                gui.style.display = 'none';
            }
        }
    });
 
    let isAutoRespawnEnabled = false;
    let isAutoDenyTeleportEnabled = false;
    let youtubeVolume = 100;  // Default volume
    let buttonArray = []
    let modal;
    let gui;
    let watermark;
    function createStyledButton(text, onClickFunction, tooltipText = "") {
        const container = document.createElement('div');
        const button = document.createElement('button');
        button.textContent = text;
        button.onclick = onClickFunction;
        button.style.padding = '8px 15px';
        button.style.margin = '5px 0';
        button.style.borderRadius = '5px';
        button.style.border = 'none';
        button.style.background = `linear-gradient(90deg, ${GUI_THEME.gradientFirst}, ${GUI_THEME.gradientSecond})`;
        button.style.color = 'white';
        button.style.cursor = 'pointer';
        button.style.transition = 'background 0.3s';
        button.onmouseover = function() {
            button.style.background = `linear-gradient(90deg, ${GUI_THEME.gradientSecond}, ${GUI_THEME.gradientFirst})`;
        };
        button.onmouseout = function() {
            button.style.background = `linear-gradient(90deg, ${GUI_THEME.gradientFirst}, ${GUI_THEME.gradientSecond})`;
        };
        buttonArray.push(button)
        if (tooltipText) {
            const tooltip = document.createElement('div');
            tooltip.textContent = "?";
            tooltip.title = tooltipText;
            tooltip.style.display = "inline-block";
            tooltip.style.marginLeft = "10px";
            tooltip.style.color = "white";
            tooltip.style.cursor = "pointer";
            container.appendChild(button);
            container.appendChild(tooltip);
            return container;
        }
 
        return button;
    }
 
    // Remove Game's Background Music
    function removeGameBackgroundMusic() {
        const audioElements = document.querySelectorAll('audio, video');
        for (let audio of audioElements) {
            audio.pause();
            audio.remove();
        }
    }
 
    removeGameBackgroundMusic();
 
    // Welcome message modal
    modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.backgroundColor = GUI_THEME.mainColor;
    modal.style.border = '1px solid #333';
    modal.style.padding = '20px';
    modal.style.borderRadius = '5px';
    modal.style.zIndex = '99999';
    modal.innerHTML = "<strong style='color: white;'>Thanks for choosing LeiClient! Join the Official Discord From the GUI! Press T to toggle the menu for the first time and Enjoy!</strong><br>";
    const closeButton = createStyledButton('Close', function() {
        document.body.removeChild(modal);
    });
    modal.appendChild(closeButton);
    document.body.appendChild(modal);
 
    // GUI container
    gui = document.createElement('div');
    gui.style.position = 'fixed';
    gui.style.top = '10px';
    gui.style.right = '10px';
    gui.style.backgroundColor = GUI_THEME.mainColor;
    gui.style.color = 'white';
    gui.style.border = '1px solid #333';
    gui.style.padding = '5px';
    gui.style.borderRadius = '5px';
    gui.style.zIndex = '9999';
    document.body.appendChild(gui);
    function addColorPicker(thingToChange) {
        let colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = GUI_THEME[thingToChange];
        colorInput.style.width = '100px';
 
        colorInput.addEventListener('input', function (event) {
            GUI_THEME[thingToChange] = event.target.value;
            updateGUIColors(GUI_THEME.mainColor, GUI_THEME.transparentColor, GUI_THEME.gradientFirst, GUI_THEME.gradientSecond);
        });
        gui.appendChild(colorInput)
        return colorInput;
    }
    addColorPicker("mainColor");
    addColorPicker("transparentColor");
    addColorPicker("gradientFirst");
    addColorPicker("gradientSecond");
    function addGUIComponents() {
        // Toggle Key Setting
        const toggleKeyLabel = document.createElement('label');
        toggleKeyLabel.textContent = 'Toggle Key:';
        const toggleKeyInput = document.createElement('input');
        toggleKeyInput.type = 'text';
        toggleKeyInput.value = toggleKey;
        toggleKeyInput.maxLength = 1;
        toggleKeyInput.style.width = '30px';
        toggleKeyInput.addEventListener('input', function(event) {
            toggleKey = toggleKeyInput.value.toUpperCase();
        });
        gui.appendChild(toggleKeyLabel);
        gui.appendChild(toggleKeyInput);
        gui.appendChild(document.createElement('br'));
 
        // Watermark
    watermark = document.createElement('div');
    watermark.textContent = 'LeiClient';
    watermark.style.position = 'fixed';
    watermark.style.top = '5px';
    watermark.style.left = '50%';
    watermark.style.transform = 'translateX(-50%)';
    watermark.style.color = 'white';
    watermark.style.fontSize = '24px';
    watermark.style.fontWeight = 'bold';
    watermark.style.padding = '5px 10px';
    watermark.style.backgroundColor = GUI_THEME.transparentColor;
    watermark.style.borderRadius = '5px';
    watermark.style.zIndex = '10000';
    document.body.appendChild(watermark);
 
 
        // Auto Respawn Toggle
        const respawnContainer = createStyledButton(
            isAutoRespawnEnabled ? 'Disable Auto Respawn' : 'Enable Auto Respawn',
            function() {
                isAutoRespawnEnabled = !isAutoRespawnEnabled;
                respawnContainer.firstChild.textContent = isAutoRespawnEnabled ? 'Disable Auto Respawn' : 'Enable Auto Respawn';
            },
            'If enabled, when you die, the "Respawn" button will automatically click itself.'
        );
        gui.appendChild(respawnContainer);
 
        // Auto Deny Teleport Toggle
        const teleportContainer = createStyledButton(
            isAutoDenyTeleportEnabled ? 'Disable Auto Deny Teleport' : 'Enable Auto Deny Teleport',
            function() {
                isAutoDenyTeleportEnabled = !isAutoDenyTeleportEnabled;
                teleportContainer.firstChild.textContent = isAutoDenyTeleportEnabled ? 'Disable Auto Deny Teleport' : 'Enable Auto Deny Teleport';
            },
            'If enabled, when somebody sends you a Teleport Request, it will automatically deny the teleport request.'
        );
        gui.appendChild(teleportContainer);
 
        // Crosshair URL Input
        const crosshairUrlLabel = document.createElement('label');
        crosshairUrlLabel.textContent = 'Crosshair URL:';
        const crosshairUrlInput = document.createElement('input');
        crosshairUrlInput.type = 'text';
        crosshairUrlInput.placeholder = 'Enter the URL for your crosshair';
        crosshairUrlInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                modifyCrossHair(crosshairUrlInput.value);
            }
        });
        const crosshairTooltip = document.createElement('div');
        crosshairTooltip.textContent = "?";
        crosshairTooltip.title = "Find a transparent Crosshair image online (Reddit, Pinterest, etc), and paste the URL to the image here. This will swap the crosshair image with the one you provided.";
        crosshairTooltip.style.display = "block";
        crosshairTooltip.style.marginTop = "5px";
        crosshairTooltip.style.color = "white";
        crosshairTooltip.style.cursor = "pointer";
 
        gui.appendChild(crosshairUrlLabel);
        gui.appendChild(crosshairUrlInput);
        gui.appendChild(crosshairTooltip);
 
        // YouTube Audio Loop Input
        const youtubeLabel = document.createElement('label');
        youtubeLabel.textContent = 'YouTube Audio Loop:';
        const youtubeInput = document.createElement('input');
        youtubeInput.type = 'text';
        youtubeInput.placeholder = 'Paste YouTube link here...';
        youtubeInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                playYoutubeLoop(youtubeInput.value);
            }
        });
        const youtubeTooltip = document.createElement('div');
        youtubeTooltip.textContent = "?";
        youtubeTooltip.title = "[MAKE SURE TO MUTE IN GAME MUSIC!!!] Copy and Paste the YouTube URL to a music video to add some vibe to your gameplay! My personal favorite is LoFi, but the options are endless!";
        youtubeTooltip.style.display = "block";
        youtubeTooltip.style.marginTop = "5px";
        youtubeTooltip.style.color = "white";
        youtubeTooltip.style.cursor = "pointer";
 
        gui.appendChild(youtubeLabel);
        gui.appendChild(youtubeInput);
        gui.appendChild(youtubeTooltip);
 
        // Volume slider for YouTube Audio
        const volumeLabel = document.createElement('label');
        volumeLabel.textContent = 'Volume:';
        gui.appendChild(volumeLabel);
 
        const volumeSlider = document.createElement('input');
        volumeSlider.type = 'range';
        volumeSlider.min = 0;
        volumeSlider.max = 100;
        volumeSlider.value = youtubeVolume;
        volumeSlider.oninput = function() {
            youtubeVolume = volumeSlider.value;
            adjustYoutubeVolume(youtubeVolume / 100); // The API expects a range from 0.0 to 1.0
        };
        gui.appendChild(volumeSlider);
 
        // Play and Pause buttons for YouTube Audio
        const playButton = createStyledButton('▶️', playYoutubeAudio);
        gui.appendChild(playButton);
 
        const pauseButton = createStyledButton('⏸️', pauseYoutubeAudio);
        gui.appendChild(pauseButton);
 
        createDiscordButton();
    }
 
    let youtubeIframe = null;
    function playYoutubeLoop(youtubeLink) {
        if (!youtubeIframe) {
            youtubeIframe = document.createElement('iframe');
            youtubeIframe.width = 0;
            youtubeIframe.height = 0;
            youtubeIframe.frameBorder = "0";
            youtubeIframe.allow = "autoplay";
            document.body.appendChild(youtubeIframe);
        }
 
        if (youtubeLink.includes('youtube.com/watch?v=')) {
            const videoId = youtubeLink.split('v=')[1].split('&')[0];
            youtubeIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&enablejsapi=1&volume=${youtubeVolume}`;
        } else {
            alert('Please provide a valid YouTube link.');
        }
    }
 
    function pauseYoutubeAudio() {
        if (youtubeIframe) {
            youtubeIframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        }
    }
 
    function playYoutubeAudio() {
        if (youtubeIframe) {
            youtubeIframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        }
    }
 
    function adjustYoutubeVolume(value) {
        if (youtubeIframe) {
            youtubeIframe.contentWindow.postMessage(`{"event":"command","func":"setVolume","args":[${value * 100}]}`, '*');
        }
    }
 
    function modifyCrossHair(url) {
        const crossHairElement = document.querySelector('.CrossHair');
        if (crossHairElement) {
            crossHairElement.style.backgroundImage = `url(${url})`;
            crossHairElement.style.backgroundSize = 'contain';
            crossHairElement.style.backgroundRepeat = 'no-repeat';
            crossHairElement.style.backgroundPosition = 'center';
            crossHairElement.textContent = '';
        }
    }
 
    function autoDenyTeleport() {
        if (!isAutoDenyTeleportEnabled) return;
 
        const denyTeleportButton = document.querySelector('.UiReqDismissButt');
        if (denyTeleportButton) {
            denyTeleportButton.click();
        }
    }
 
    function applyColorChanges() {
        changeColorForElements('.SettingsMenu, .Inventory, .hotbar, .CenteredDiv', GUI_THEME.mainColor);
        changeColorForElements('.ChatMessages', GUI_THEME.transparentColor);
 
        const adBox = document.getElementById('gameadsbannerpic');
        if (adBox) {
            adBox.remove();
        }
    }
 
    function changeColorForElements(selector, color) {
        const elements = document.querySelectorAll(selector);
        for (let elem of elements) {
            elem.style.backgroundColor = color;
        }
    }
 
    function autoClickRespawn() {
        if (!isAutoRespawnEnabled) return;
        const respawnButton = document.querySelector('.RespawnButton');
        if (respawnButton && !respawnButton.disabled) {
            respawnButton.click();
    }
}
 
function createDiscordButton() {
    const discordButton = createStyledButton('Discord', function() {
        window.location.href = "https://discord.gg/7WFrfyQ7vy";
    }, 'Join our Discord server!');
    gui.appendChild(discordButton);
}
    function updateGUIColors(mainColor, transparentColor, gradientFirst, gradientSecond) {
        for (let button of buttonArray) {
            button.style.background = `linear-gradient(90deg, ${GUI_THEME.gradientFirst}, ${GUI_THEME.gradientSecond})`;
        }
        if (modal) {
            modal.style.backgroundColor = GUI_THEME.mainColor;
        }
        if (gui) {
            gui.style.backgroundColor = GUI_THEME.mainColor;
        }
        if (watermark) {
            watermark.style.backgroundColor = GUI_THEME.transparentColor;
        }
 
}
addGUIComponents(); // Ensures the GUI components are added when the script runs. made by airtrash
setInterval(autoClickRespawn, 1000);
    setInterval(autoClickRespawn, 1000);
    setInterval(autoDenyTeleport, 1000);
    setInterval(applyColorChanges, 5); // Checks every 5 milliseconds
})();