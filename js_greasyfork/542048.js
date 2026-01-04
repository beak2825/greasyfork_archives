// ==UserScript==
// @name         Client 14Extended GUI not hack
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Custom GUI for Client 14Extended - no done button version not really good script btw
// @author       You
// @match        *://*/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/542048/Client%2014Extended%20GUI%20not%20hack.user.js
// @updateURL https://update.greasyfork.org/scripts/542048/Client%2014Extended%20GUI%20not%20hack.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let guiVisible = false;

    const style = `
        #client14Gui {
            position: fixed;
            top: 10%;
            left: 50%;
            transform: translateX(-50%);
            background-color: black;
            color: white;
            padding: 20px;
            border-radius: 8px;
            z-index: 9999;
            font-family: Arial, sans-serif;
            width: 400px;
            display: none;
        }
        #client14Tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
        }
        .client14Tab {
            background: #222;
            padding: 5px 10px;
            cursor: pointer;
        }
        .client14Tab:hover {
            background: #444;
        }
        .client14Content {
            display: none;
        }
        .client14Content.active {
            display: block;
        }
        .client14Button {
            background: #333;
            color: white;
            border: none;
            padding: 5px 10px;
            margin-top: 10px;
            cursor: pointer;
        }
        .client14Button:hover {
            background: #555;
        }
    `;

    const guiHTML = `
        <div id="client14Gui">
            <div id="client14Tabs">
                <div class="client14Tab" data-tab="welcome">Welcome</div>
                <div class="client14Tab" data-tab="overlay">Overlay</div>
                <div class="client14Tab" data-tab="settings">Settings</div>
                <div class="client14Tab" data-tab="fun">Fun</div>
                <div class="client14Tab" data-tab="color">Color</div>
            </div>
            <div id="welcome" class="client14Content active">
                <p>Welcome to Client 14Extended!</p>
                <p>What's new: 14client!</p>
                <button class="client14Button" id="joinDiscord">Join Discord</button>
            </div>
            <div id="overlay" class="client14Content">
                <label>Darkness: <input type="range" min="0" max="100" value="50"></label><br>
                <label>Lightness: <input type="range" min="0" max="100" value="50"></label><br>
                <label>Colorblind Mode: <input type="checkbox"></label>
            </div>
            <div id="settings" class="client14Content">
                <p>FPS: <span id="fps">60</span></p>
                <p>Ping: <span id="ping">20ms</span></p>
                <p>RAM: <span id="ram">2.5GB</span></p>
                <label>Draggable: <input type="checkbox" id="draggableToggle"></label>
            </div>
            <div id="fun" class="client14Content">
                <button class="client14Button" id="removeAds">Remove All Ads</button>
            </div>
            <div id="color" class="client14Content">
                <label>Menu Color: <input type="color" id="menuColor" value="#000000"></label>
            </div>
        </div>
    `;

    const styleElement = document.createElement('style');
    styleElement.textContent = style;
    document.head.appendChild(styleElement);

    const guiElement = document.createElement('div');
    guiElement.innerHTML = guiHTML;
    document.body.appendChild(guiElement);

    const gui = document.getElementById('client14Gui');
    const tabs = document.querySelectorAll('.client14Tab');
    const contents = document.querySelectorAll('.client14Content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            contents.forEach(c => c.classList.remove('active'));
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    document.getElementById('joinDiscord').addEventListener('click', () => {
        GM_setClipboard("https://discord.gg/zVDfBnhW");
        alert("Discord link copied to clipboard!");
    });

    document.getElementById('removeAds').addEventListener('click', () => {
        document.querySelectorAll("iframe, .ad, [id*='ad']").forEach(el => el.remove());
        alert("All ads removed!");
    });

    document.getElementById('menuColor').addEventListener('input', (e) => {
        gui.style.backgroundColor = e.target.value;
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === "'") {
            guiVisible = !guiVisible;
            gui.style.display = guiVisible ? "block" : "none";
        }
    });

    console.log("Client 14Extended loaded. Press ' to toggle GUI.");
})();
