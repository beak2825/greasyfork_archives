// ==UserScript==
// @name         SanuliHacksGUI
// @namespace    http://tampermonkey.net/
// @version      2025-05-24
// @description  Sanuli huijaus Käyttöliittymä
// @author       @theyhoppingonme on discord
// @match        https://sanuli.fi/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sanuli.fi
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536382/SanuliHacksGUI.user.js
// @updateURL https://update.greasyfork.org/scripts/536382/SanuliHacksGUI.meta.js
// ==/UserScript==
function isMobile() {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const smallScreen = window.innerWidth <= 820;
    const isPortrait = window.matchMedia('(orientation: portrait)').matches;

    const userAgentMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    return (hasTouch && smallScreen && isPortrait) || userAgentMobile;
}

function encode(input, key) {
    let encoded = '';
    for (let i = 0; i < input.length; i++) {
        let charCode = input.charCodeAt(i);
        let keyCharCode = key.charCodeAt(i % key.length);
        let shifted = (charCode + keyCharCode) % 256;
        encoded += shifted.toString(16).padStart(2, '0');
    }
    return encoded;
}

function decode(encoded, key) {
    let decoded = '';
    for (let i = 0; i < encoded.length; i += 2) {
        let byte = parseInt(encoded.substr(i, 2), 16);
        let keyCharCode = key.charCodeAt((i/2) % key.length);
        let originalCharCode = (byte - keyCharCode + 256) % 256;
        decoded += String.fromCharCode(originalCharCode);
    }
    return decoded;
}

function main() {
setTimeout(function() {
(() => {
    if (document.location.href == 'https://sanuli.fi/') {
    let opacity = 0.95
    if (localStorage.getItem('gui')) {
      const guid = JSON.parse(localStorage.getItem('gui'));
      if (guid.o != undefined) {
      opacity = guid.o;
        } else {
          localStorage.removeItem('gui');
        }
    }
    const version = 1.4;
    const guiId = 'an-gui';

    if (document.getElementById(guiId)) {
        console.log('GUI already exists.');
        return;
    }
    let elz;
    let data;
    let settings = localStorage.getItem('settings');
    let sjson = JSON.parse(settings);
    let game = `game|"${sjson.current_game_mode}"|"${sjson.current_word_list}"|${sjson.current_word_length}`;
    let json;

    const tabs = [
        { id: 'set', label: 'Aseta', active: true },
        { id: 'toggle', label: 'Kytkimet', active: false },
        { id: 'button', label: 'Napit', active: false },
        { id: 'settings', label: 'Asetukset', active: false }
    ];

    const inputs = [{
            tab: 'set',
            info: 'Aseta putki',
            placeholder: 'Putki',
            buttonText: 'Aseta',
            type: 'number',
            callback: (value) => {
                try {
                    data = localStorage.getItem(game);
                    if (!data) throw new Error('No data found');
                    json = JSON.parse(data);
                    json.streak = Number(value);
                    localStorage.setItem(game, JSON.stringify(json));
                    setTimeout(function() {
                    location.reload();
                    }, 100);
                } catch (e) {
                    console.error('Failed to set streak:', e);
                }
            }

        },
        {
            tab: 'set',
            info: 'Aseta sana',
            placeholder: 'Sana',
            buttonText: 'Aseta',
            type: 'text',
            callback: (value) => {
                try {
                    data = localStorage.getItem(game);
                    if (!data) throw new Error('No data found');
                    json = JSON.parse(data);
                    value = value.toUpperCase();
                    value = value.split('');
                    json.word = value;
                    json.word_length = value.length;
                    localStorage.setItem(game, JSON.stringify(json));
                    setTimeout(function() {
                    location.reload();
                    }, 100);
                } catch (e) {
                    console.error('Failed to set word:', e);
                }
            }
        },
         {
            tab: 'set',
            info: 'Aseta viesti',
            placeholder: 'Viesti',
            buttonText: 'Aseta',
            type: 'text',
            callback: (value) => {
                try {
                    data = localStorage.getItem(game);
                    if (!data) throw new Error('No data found');
                    json = JSON.parse(data);
                    json.message = value;
                    localStorage.setItem(game, JSON.stringify(json));
                    setTimeout(function() {
                    location.reload();
                    }, 100);
                } catch (e) {
                    console.error('Failed to set message:', e);
                }
            }
        },
        {
            tab: 'settings',
            info: 'Aseta sanulin taustaväri (Heksadesimaali)',
            placeholder: 'Esim: #000000',
            buttonText: 'Aseta',
            type: 'text',
            callback: (value) => {
                try {
                    document.body.style.background = value;
                } catch (e) {
                    console.error('Failed to set color:', e);
                }
            }
        },
    ];
    let interval;
    let recent;
    let word;
    const toggles = [{
            tab: 'toggle',
            info: 'Automaattinen arvaus',
            name: 'autoguess',
            onFunc: () => {
                guess();
            },
            offFunc: () => {
                clearInterval(interval);
            }
        },
    ];
    function guess() {
        interval = setInterval(() => {
                        data = localStorage.getItem(game);
                        json = JSON.parse(data);
                        const word = json.word.join('');
                        if (recent != word) {
                        typeWord(word);
                        recent = word;
                        }
                        document.dispatchEvent(enterEvent);
                        document.dispatchEvent(enterEvent);
                 }, 100);
    }
    const buttons = [{
            tab: 'button',
            info: 'Selvitä sana',
            buttonText: 'Selvitä',
            callback: () => {
                data = localStorage.getItem(game);
                json = JSON.parse(data);
                json.message = 'Sana on: ' + json.word.join('');
                localStorage.setItem(game, JSON.stringify(json));
                alert(json.message);
            }
        },
        {
            tab: 'button',
        info: 'Aseta Maksimiputki',
            buttonText: 'Aseta',
            callback: () => {
                data = localStorage.getItem(game);
                    if (!data) throw new Error('No data found');
                    json = JSON.parse(data);
                    json.streak = 0xFFFFFFFF;
                    localStorage.setItem(game, JSON.stringify(json));
                    setTimeout(function() {
                    location.reload();
                    }, 100);
            }
        },
         {
             tab: 'button',
        info: 'Voita peli',
            buttonText: 'Voita',
            callback: () => {
                data = localStorage.getItem(game);
                    if (!data) throw new Error('No data found');
                    json = JSON.parse(data);
                    json.is_winner = true;
                    json.is_guessing = false;
                    json.is_unknown = false;
                    json.streak += 1;
                    localStorage.setItem(game, JSON.stringify(json));
                    setTimeout(function() {
                    location.reload();
                    }, 100);
            }
        },
        {
            tab: 'settings',
            info: 'Tallenna Sanulitiedot',
            buttonText: 'Tallenna',
            callback: () => {
                navigator.clipboard.writeText(encode(localStorage.getItem(game), 'SanuliHacksGUI'))
                    .then(() => {
                alert('Tallennuskoodi on tallennettu leikepöytään.');
                });
            }
        },
        {
            tab: 'settings',
            info: 'Lataa Sanulitiedot',
            buttonText: 'Lataa',
            callback: () => {
                const save = prompt('Anna tallennettu koodi.');
                if (save) {
                    const str = decode(save, 'SanuliHacksGUI');
                    try {
                        JSON.parse(str);
                        localStorage.setItem(game, str);
                        alert('Ladattu!');
                        location.reload();
                    } catch (e) {
                        alert('Virheellistä koodia!');
                    }
                } else {
                  alert('Et vastannut mitään');
                }
            }
        },
    ];

    const sliders = [{
            tab: 'settings',
            info: 'Käyttöjärjestelmän läpinäkyvyys',
            value: opacity,
            step: 100,
            min: 0,
            max: 1,
            callback: (value) => {
                const element = document.getElementById(guiId);
                if (element) {
                 element.style.opacity = value;
                    data = JSON.parse(localStorage.getItem('gui'));
                    data.o = value;
                    localStorage.setItem('gui', JSON.stringify(data));
                }
            }
        }
    ];

    function simulateKeyPress(key) {
  const keyUpper = key.toUpperCase();
  const keyCode = keyUpper.charCodeAt(0);
  const code = key === 'Enter' ? 'Enter' : 'Key' + keyUpper;

  ['keydown', 'keypress', 'keyup'].forEach(type => {
    const event = new KeyboardEvent(type, {
      key: key,
      code: code,
      keyCode: keyCode,
      which: keyCode,
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(event);
  });
}

function typeWord(word, delay = 10) {
  let i = 0;
  const interval = setInterval(() => {
    if (i >= word.length) return clearInterval(interval);
    simulateKeyPress(word[i++]);
  }, delay);
}

const enterEvent = new KeyboardEvent('keydown', {
  key: 'Enter',
  code: 'Enter',
  keyCode: 13,
  which: 13,
  bubbles: true,
});


    const style = document.createElement('style');
    style.textContent = `
#${guiId} {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 320px;
  background: #2b2b2b;
  color: #e0e0e0;
  border-radius: 8px;
  font-family: Arial, sans-serif;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  z-index: 9999;
  overflow: hidden;
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  opacity: ${opacity};
}
#${guiId} .gui-header {
  padding: 12px;
  background: #1e1e1e;
  cursor: move;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px 8px 0 0;
  user-select: none;
}
#${guiId} .gui-title {
  font-weight: bold;
  font-size: 14px;
  transition: color 0.2s ease;
}
#${guiId} .gui-tabs {
  display: flex;
  background: #262626;
  border-bottom: 1px solid #3a3a3a;
}
#${guiId} .gui-tab {
  padding: 10px 15px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
  border-bottom: 2px solid transparent;
  position: relative;
  overflow: hidden;
}
#${guiId} .gui-tab:hover {
  background: #303030;
}
#${guiId} .gui-tab.active {
  background: #2b2b2b;
  border-bottom: 2px solid #4CAF50;
  font-weight: bold;
}

#${guiId} .gui-tab::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%);
  transform-origin: 50% 50%;
}
#${guiId} .gui-tab:focus:not(:active)::after {
  animation: ripple 0.5s ease-out;
}
@keyframes ripple {
  0% {
    transform: scale(0, 0);
    opacity: 0.5;
  }
  100% {
    transform: scale(20, 20);
    opacity: 0;
  }
}
#${guiId} .gui-content {
  padding: 16px;
  max-height: 70vh;
  overflow-y: auto;
  transition: max-height 0.4s ease-in-out;
}
#${guiId} .tab-content {
  display: none;
  animation-duration: 0.45s;
  animation-fill-mode: both;
  animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
}
#${guiId} .tab-content.active {
  display: block;
  animation-name: fadeIn;
}
#${guiId} .tab-content.fade-out {
  animation-name: fadeOut;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes fadeOut {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-10px);
  }
}
#${guiId} .gui-item {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease-out;
}
#${guiId} .gui-item:hover {
  transform: translateX(2px);
}
#${guiId} .gui-item-info {
  margin-bottom: 6px;
  font-size: 12px;
  color: #b0b0b0;
  transition: color 0.2s ease;
}
#${guiId} .gui-input-container {
  display: flex;
  gap: 8px;
}
#${guiId} input {
  flex: 1;
  padding: 8px;
  background: #3a3a3a;
  border: 1px solid #4a4a4a;
  color: #e0e0e0;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}
#${guiId} input:focus {
  border-color: #6a6a6a;
  box-shadow: 0 0 0 2px rgba(106, 106, 106, 0.3);
}
#${guiId} button {
  padding: 8px 12px;
  background: #4a4a4a;
  border: none;
  color: #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.25s ease, transform 0.15s ease;
  outline: none;
}
#${guiId} button:hover {
  background: #5a5a5a;
  transform: translateY(-1px);
}
#${guiId} button:active {
  background: #6a6a6a;
  transform: translateY(1px);
}
#${guiId} .toggle-container {
  display: flex;
  align-items: center;
  gap: 8px;
}
#${guiId} .toggle-switch {
  position: relative;
  width: 40px;
  height: 20px;
}
#${guiId} .toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #3a3a3a;
  transition: background-color 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
  border-radius: 20px;
}
#${guiId} .toggle-slider:before {
  position: absolute;
  content: '';
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: #e0e0e0;
  transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1), background-color 0.3s ease;
  border-radius: 50%;
}
#${guiId} input:checked + .toggle-slider {
  background-color: #4CAF50;
}
#${guiId} input:checked + .toggle-slider:before {
  transform: translateX(20px);
}
#${guiId} .gui-slider-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  width: 85%;
}
#${guiId} .gui-slider-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 12px;
  color: #b0b0b0;
}
#${guiId} .gui-slider-value {
  font-weight: bold;
  color: #e0e0e0;
  transition: color 0.2s ease;
}
#${guiId} .gui-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  background: #3a3a3a;
  border-radius: 3px;
  outline: none;
  transition: background 0.2s ease, box-shadow 0.2s ease;
}
#${guiId} .gui-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #4CAF50;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
}
#${guiId} .gui-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border: none;
  border-radius: 50%;
  background: #4CAF50;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
}
#${guiId} .gui-slider:hover {
  background: #444444;
}
#${guiId} .gui-slider:hover::-webkit-slider-thumb {
  transform: scale(1.1);
  box-shadow: 0 0 8px rgba(76, 175, 80, 0.4);
}
#${guiId} .gui-slider:hover::-moz-range-thumb {
  transform: scale(1.1);
  box-shadow: 0 0 8px rgba(76, 175, 80, 0.4);
}
#${guiId} .gui-slider:focus {
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}
#${guiId} .gui-slider:focus::-webkit-slider-thumb {
  background: #5dbb61;
  box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.3);
}
#${guiId} .gui-slider:focus::-moz-range-thumb {
  background: #5dbb61;
  box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.3);
}
#${guiId} .gui-slider:active::-webkit-slider-thumb {
  transform: scale(1.2);
  background: #3d9140;
}
#${guiId} .gui-slider:active::-moz-range-thumb {
  transform: scale(1.2);
  background: #3d9140;
}
    `;
    document.head.appendChild(style);

    const gui = document.createElement('div');
    gui.id = guiId;
    let jss;
    const guiHeader = document.createElement('div');
    guiHeader.className = 'gui-header';

    const guiTitle = document.createElement('div');
    guiTitle.className = 'gui-title';
    guiTitle.textContent = `AnGUI - Sanuli V${version}`;

    const guiTabs = document.createElement('div');
    guiTabs.className = 'gui-tabs';

    const guiContent = document.createElement('div');
    guiContent.className = 'gui-content';

    guiHeader.appendChild(guiTitle);
    gui.appendChild(guiHeader);
    gui.appendChild(guiTabs);
    gui.appendChild(guiContent);
    document.body.appendChild(gui);

     tabs.forEach(tab => {
        const tabButton = document.createElement('div');
        tabButton.className = `gui-tab ${tab.active ? 'active' : ''}`;
        tabButton.textContent = tab.label;
        tabButton.dataset.tabId = tab.id;
        guiTabs.appendChild(tabButton);

        const tabContent = document.createElement('div');
        tabContent.className = `tab-content ${tab.active ? 'active' : ''}`;
        tabContent.id = `tab-${tab.id}`;
        guiContent.appendChild(tabContent);

        tabButton.addEventListener('click', () => {
            document.querySelectorAll(`#${guiId} .gui-tab`).forEach(t => {
                t.classList.remove('active');
            });
            document.querySelectorAll(`#${guiId} .tab-content`).forEach(c => {
                c.classList.remove('active');
            });

            tabButton.classList.add('active');
            tabContent.classList.add('active');
        });
    });

        let isVisible = true;
        let dragActive = false;
        let dragStartX, dragStartY, initialX, initialY;

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Insert') {
                isVisible = !isVisible;
                gui.style.display = isVisible ? 'block' : 'none';
            }
        });

        guiHeader.addEventListener('mousedown', (e) => {
            startD(e.clientX, e.clientY);
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (dragActive) {
                moveD(e.clientX, e.clientY);
            }
        });

        document.addEventListener('mouseup', () => {
            endD();
        });

        guiHeader.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                const touch = e.touches[0];
                startD(touch.clientX, touch.clientY);
                e.preventDefault();
            }
        });

        document.addEventListener('touchmove', (e) => {
            if (dragActive && e.touches.length === 1) {
                const touch = e.touches[0];
                moveD(touch.clientX, touch.clientY);
                e.preventDefault();
            }
        });

        document.addEventListener('touchend', () => {
            endD();
        });

        document.addEventListener('touchcancel', () => {
            endD();
        });

        function startD(x, y) {
            dragActive = true;
            dragStartX = x;
            dragStartY = y;
            initialX = gui.offsetLeft;
            initialY = gui.offsetTop;
            gui.style.cursor = 'grabbing';
        }

        function moveD(x, y) {
            const dx = x - dragStartX;
            const dy = y - dragStartY;
            gui.style.left = initialX + dx + 'px';
            gui.style.top = initialY + dy + 'px';
            gui.style.right = 'auto';
            if (!localStorage.getItem('gui')) {
            const jss = {
                'l': gui.style.left,
                't': gui.style.top,
                'r': gui.style.right,
                'o': 0.95,
            };
            localStorage.setItem('gui', JSON.stringify(jss));
            } else {
                const read = JSON.parse(localStorage.getItem('gui'));
                const jss = {
                'l': gui.style.left,
                't': gui.style.top,
                'r': gui.style.right,
                'o': read.o,
                };
                localStorage.setItem('gui', JSON.stringify(jss));
            }
        }

        function endD() {
            if (dragActive) {
                dragActive = false;
                gui.style.cursor = 'default';
            }
        }

        let inputFocused = false;

        document.addEventListener('keydown', function(event) {
        if (event.key === '=') {
            if (confirm('Oletko varma, että haluat nollaa käyttöjärjestelmän?')) {
                   localStorage.removeItem('gui');
                   alert('käyttöjärjestelmä on nollattu.');
                   location.reload();
                }
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === '!') {
            if (confirm('Oletko varma, että haluat nollaa sanulin tiedot?')) {
                   const keep = localStorage.getItem('gui');

                   for (let i = localStorage.length - 1; i >= 0; i--) {
                       const key = localStorage.key(i);
                       if (key !== 'gui') {
                           localStorage.removeItem(key);
                       }
                   }

                if (keep !== null) {
                    localStorage.setItem('gui', keep);
                }
                   alert('sanulin tiedot on nollattu.');
                   location.reload();
                }
        }
    });

   const createInput = (tabId, info, placeholder, buttonText, type, callback) => {
       const tabContent = document.getElementById(`tab-${tabId}`);
        if (!tabContent) return;

        const item = document.createElement('div');
        item.className = 'gui-item';

        const itemInfo = document.createElement('div');
        itemInfo.className = 'gui-item-info';
        itemInfo.textContent = info;

        const inputContainer = document.createElement('div');
        inputContainer.className = 'gui-input-container';

        const input = document.createElement('input');
        input.type = type;
        input.placeholder = placeholder;

        input.addEventListener('focus', () => {
        inputFocused = true;
    });

    input.addEventListener('blur', () => {
        inputFocused = false;
    });

    input.addEventListener('keydown', (event) => {
        event.stopPropagation();
    });

        const button = document.createElement('button');
        button.textContent = buttonText;
        button.addEventListener('click', () => {
            callback(input.value);
        });

        inputContainer.appendChild(input);
        inputContainer.appendChild(button);

        item.appendChild(itemInfo);
        item.appendChild(inputContainer);
        tabContent.appendChild(item);
    };

const createSlider = (tabId, info, value, step, min, max, callback) => {
    const tabContent = document.getElementById(`tab-${tabId}`);
    if (!tabContent) return;

    const item = document.createElement('div');
    item.className = 'gui-item';

    const itemInfo = document.createElement('div');
    itemInfo.className = 'gui-item-info';
    itemInfo.textContent = info;

    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'gui-slider-container';

    const sliderHeader = document.createElement('div');
    sliderHeader.className = 'gui-slider-header';

    const sliderLabel = document.createElement('span');
    sliderLabel.textContent = info;

    const valueLabel = document.createElement('span');
    valueLabel.className = 'gui-slider-value';
    valueLabel.textContent = value;

    sliderHeader.appendChild(sliderLabel);
    sliderHeader.appendChild(valueLabel);

    const slider = document.createElement('input');
    slider.className = 'gui-slider';
    slider.type = 'range';
    slider.min = min;
    slider.max = max;
    slider.step = (max - min) / step;
    slider.value = value;

    slider.addEventListener('input', () => {
        valueLabel.textContent = slider.value;
        callback(slider.value);
    });

    sliderContainer.appendChild(sliderHeader);
    sliderContainer.appendChild(slider);

    item.appendChild(sliderContainer);
    tabContent.appendChild(item);

    return slider;
};


    const createToggle = (tabId, info, name, onFunc, offFunc) => {
        const tabContent = document.getElementById(`tab-${tabId}`);
        if (!tabContent) return;

        const item = document.createElement('div');
        item.className = 'gui-item';

        const itemInfo = document.createElement('div');
        itemInfo.className = 'gui-item-info';
        itemInfo.textContent = info;

        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'toggle-container';

        const toggleLabel = document.createElement('label');
        toggleLabel.className = 'toggle-switch';

        const toggleInput = document.createElement('input');
        toggleInput.type = 'checkbox';
        toggleInput.name = name;

        const toggleSlider = document.createElement('span');
        toggleSlider.className = 'toggle-slider';

        toggleInput.addEventListener('change', () => {
            if (toggleInput.checked) {
                onFunc();
            } else {
                offFunc();
            }
        });

        toggleLabel.appendChild(toggleInput);
        toggleLabel.appendChild(toggleSlider);
        toggleContainer.appendChild(toggleLabel);

        item.appendChild(itemInfo);
        item.appendChild(toggleContainer);
        tabContent.appendChild(item);

        return toggleInput;
    };

    const createButton = (tabId, info, buttonText, callback) => {
        const tabContent = document.getElementById(`tab-${tabId}`);
        if (!tabContent) return;

        const item = document.createElement('div');
        item.className = 'gui-item';

        const itemInfo = document.createElement('div');
        itemInfo.className = 'gui-item-info';
        itemInfo.textContent = info;

        const button = document.createElement('button');
        button.textContent = buttonText;
        button.addEventListener('click', callback);

        item.appendChild(itemInfo);
        item.appendChild(button);
        tabContent.appendChild(item);

        return button;
    };

    inputs.forEach(input => {
        createInput(input.tab, input.info, input.placeholder, input.buttonText, input.type, input.callback);
    });

    toggles.forEach(toggle => {
        createToggle(toggle.tab, toggle.info, toggle.name, toggle.onFunc, toggle.offFunc);
    });

    buttons.forEach(button => {
        createButton(button.tab, button.info, button.buttonText, button.callback);
    });

    sliders.forEach(slider => {
        createSlider(slider.tab, slider.info, slider.value, slider.step, slider.min, slider.max, slider.callback);
    });

    if (localStorage.getItem('gui')) {
      const vals = JSON.parse(localStorage.getItem('gui'));
       gui.style.left = vals.l;
       gui.style.right = vals.r;
       gui.style.top = vals.t;
    }
    let item = null;
    if (isMobile()) {
       const elems = document.querySelectorAll('div.keyboard-row');
        const target = Array.from(elems).find(el => el.childElementCount === 13);
        item = document.createElement('button');
        item.className = 'keyboard-button keyboard-button-submit';
        item.style.backgroundColor = 'purple';
        item.textContent = 'angui';
        target.appendChild(item);
    }
    if (item) {
        item.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                isVisible = !isVisible;
                gui.style.display = isVisible ? 'block' : 'none';
            }
        });
    }

    } else {
      alert('Tämä koodi toimii vain sivustolla sanuli.fi, avataan sivu.');
        document.location.href = 'https://sanuli.fi/';
    }
})();
    // tekijä: theyhoppingonme
}, 200);
}
const waitForDiv = () => {
    const div = document.querySelector('.keyboard');
    if (div) {
        main();
    } else {
        requestAnimationFrame(waitForDiv);
    }
};

waitForDiv();
