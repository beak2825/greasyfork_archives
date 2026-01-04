// ==UserScript==
// @name Project Void
// @namespace http://tampermonkey.net/
// @version 2.5
// @author NuK3r_101 and _VcrazY_
// @description Galaxy menu with animated title, smooth toggle, sliding pages, updated info
// @match *://moomoo.io/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/534932/Project%20Void.user.js
// @updateURL https://update.greasyfork.org/scripts/534932/Project%20Void.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const menu = document.createElement('div');
    menu.id = 'projectVoidMenu';
    menu.innerHTML = `
        <div id="menuHeader">
            Project Void
            <button id="pageSwitch">→</button>
        </div>
        <div id="menuContent">
            <div class="page active" id="page1">
                <p><b>Keys:</b></p>
                <ul>
                    <li>R → Instakill</li>
                    <li>Z → Auto Windmills</li>
                    <li>F → Trap / Boost</li>
                    <li>V → Spike</li>
                    <li>H → Teleporter / Turret</li>
                    <li>N → Windmill</li>
                </ul>
                <p><b>Insta Kill Type:</b>
                <select id="instaKillType">
                    <option value="normal" selected>normal</option>
                    <option value="rev">rev</option>
                    <option value="nobull">nobull</option>
                </select></p>
                <p><i>This mod is in beta and is a compilation of many mods. Some features have been coded by _VcrazY_, so a huge thanks to him.</i></p>
            </div>
            <div class="page" id="page2">
                <p><b>Features:</b></p>
                <label><input type="checkbox" id="autoPlacer"> Auto Placer</label>
                <label><input type="checkbox" id="rePlacer"> Re-Placer</label>
                <label><input type="checkbox" id="autoPush"> Auto Push</label>
                <label><input type="checkbox" id="antiShame"> Anti Shame</label>
                <label><input type="checkbox" id="antiInsta"> Anti Insta</label>
                <label><input type="checkbox" id="spikeTick"> Spike Tick</label>
            </div>
        </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
        #projectVoidMenu {
            position: fixed;
            top: 20px;
            left: 20px;
            width: 320px;
            background: url('https://cdn.discordapp.com/attachments/1129277020661100605/1368624373497598022/images3.jpg?ex=6818e646&is=681794c6&hm=d952ce01439848e264505593db64301cfd73afbb85fc7731bd64dd80808849d6&') center/cover;
            color: #ddd;
            font-family: 'Segoe UI', sans-serif;
            border: 2px solid #444;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
            z-index: 9999;
            overflow: hidden;
            opacity: 1;
            transform: scale(1);
            transition: opacity 0.3s ease, transform 0.3s ease;
        }
        #projectVoidMenu.hidden {
            opacity: 0;
            transform: scale(0.9);
            pointer-events: none;
        }
        #menuHeader {
            background: rgba(0, 0, 0, 0.7);
            padding: 10px;
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            border-bottom: 1px solid #333;
            position: relative;
            background-image: linear-gradient(270deg, red, white, red);
            background-size: 600% 600%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: moveGradient 5s linear infinite;
        }
        #pageSwitch {
            position: absolute;
            top: 5px;
            right: 8px;
            background: rgba(255,255,255,0.1);
            border: none;
            color: #fff;
            font-size: 16px;
            cursor: pointer;
            border-radius: 4px;
            padding: 2px 6px;
        }
        @keyframes moveGradient {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
        }
        #menuContent {
            background: rgba(0, 0, 0, 0.5);
            padding: 10px;
            font-size: 13px;
            position: relative;
            height: 200px;
        }
        .page {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            transform: translateX(100%);
            transition: opacity 0.4s ease, transform 0.4s ease;
        }
        .page.active {
            opacity: 1;
            transform: translateX(0);
        }
        #menuContent p, #menuContent ul {
            margin: 6px 0;
        }
        #menuContent ul {
            padding-left: 20px;
        }
        #menuContent select, #menuContent input[type="checkbox"] {
            margin-bottom: 5px;
        }
        #menuContent label {
            display: block;
            margin-bottom: 3px;
        }
    `;

    document.body.appendChild(menu);
    document.head.appendChild(style);

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            menu.classList.toggle('hidden');
        }
    });

    const switchBtn = document.getElementById('pageSwitch');
    const pages = [document.getElementById('page1'), document.getElementById('page2')];
    let currentPage = 0;
    switchBtn.addEventListener('click', () => {
        pages[currentPage].classList.remove('active');
        currentPage = (currentPage + 1) % pages.length;
        pages[currentPage].classList.add('active');
    });

    const features = ['autoPlacer', 'rePlacer', 'autoPush', 'antiShame', 'antiInsta', 'spikeTick'];
    features.forEach(id => {
        const checkbox = document.getElementById(id);
        const saved = localStorage.getItem(`pv_${id}`);
        checkbox.checked = saved !== null ? saved === 'true' : true;

        checkbox.addEventListener('change', (e) => {
            const isActive = e.target.checked;
            localStorage.setItem(`pv_${id}`, isActive);
            console.log(`${id} is now ${isActive ? 'ON' : 'OFF'}`);
        });
    });
})();