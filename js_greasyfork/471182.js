// ==UserScript==
// @name hornex.PRO | Randomize rarity colours, RAINBOW MODE, hide HUD and Performance Boost
// @namespace http://tampermonkey.net/
// @version 1.3
// @description Hides HUD on hotkey press, RAINBOW MODE for petal deck and zone infos, deletes outdated messages, randomize petal background colours and more!
// @author aragami070
// @match https://hornex.pro/*
// @run-at document-start
// @icon https://hornex.pro/favicon.png
// @license MIT
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/471182/hornexPRO%20%7C%20Randomize%20rarity%20colours%2C%20RAINBOW%20MODE%2C%20hide%20HUD%20and%20Performance%20Boost.user.js
// @updateURL https://update.greasyfork.org/scripts/471182/hornexPRO%20%7C%20Randomize%20rarity%20colours%2C%20RAINBOW%20MODE%2C%20hide%20HUD%20and%20Performance%20Boost.meta.js
// ==/UserScript==

const scriptVersion = "1.3"
const maxMessages = 24; // edit this if you want to allow more or less messages
const randomizer = true; // set this to false if you want to disable press P to randomize petal colours
const enableRainbow = true; // same as the above

console.log("Waiting...");

(function() {
    'use strict';


    window.onload = async () => {
        await new Promise(resolve => setTimeout(resolve, 1200)); //for EVERYTHING to load
        console.log('Starting to load script...')
        console.log('NOTE: Rarity background colour randomizer and rainbow mode can be disabled by changing randomizer = true and enableRainbow = true to false at the top of the script!')
        console.log("Don't see bottom right user count infos? They are cloned from debug info. Enable debug info by pressing L and reload page should fix it.")

        const debugInfo = document.querySelector('.debug-info');
        const clone = debugInfo.cloneNode();
        clone.setAttribute('stroke', `User Count / AS1: Unknown / AS2: Unknown / EU1: Unknown / EU2: Unknown / US1: Unknown / US2: Unknown / Total: Unknown`);
        clone.style.bottom = `12px`;
        clone.classList.add('user-count');
        debugInfo.parentElement.insertBefore(clone, debugInfo);

        const clone2 = debugInfo.cloneNode();
        clone2.setAttribute('stroke', `SSHC ${scriptVersion} | ` + getActiveServer());
        clone2.style.bottom = `21.5px`;
        clone2.classList.add('server-info');
        debugInfo.parentElement.insertBefore(clone2, debugInfo);


        const petalRows = document.querySelector('.petal-rows');
        const minimap = document.querySelector('.minimap');
        const chatInput = document.querySelector('.chat-input');
        const scoreboard = document.querySelector('.scoreboard');

        const input = document.querySelector('.chat-input');
        const inputName = document.querySelector('.grid .nickname')

        updateUserCount()

        let chatFocus = false;
        let nameFocus = false;

        input.addEventListener('focus', () => {
            chatFocus=true;
        });
        inputName.addEventListener('focus', () => {
            nameFocus=true;
        });
        input.addEventListener('blur', () => {
            chatFocus=false
        })
        inputName.addEventListener('blur', () => {
            nameFocus=false;
        });

        const susStyle = document.querySelector('.desktop style')

        const rules = susStyle.sheet.cssRules;
        const tier0Rule = findRule(rules, /\.tier-0/);
        const tier1Rule = findRule(rules, /\.tier-1/);
        const tier2Rule = findRule(rules, /\.tier-2/);
        const tier3Rule = findRule(rules, /\.tier-3/);
        const tier4Rule = findRule(rules, /\.tier-4/);
        const tier5Rule = findRule(rules, /\.tier-5/);
        const tier6Rule = findRule(rules, /\.tier-6/);
        const tier7Rule = findRule(rules, /\.tier-7/);
        const tier8Rule = findRule(rules, /\.tier-8/);
        const uwu = [tier0Rule,tier1Rule,tier2Rule,tier3Rule,tier4Rule,tier5Rule,tier6Rule,tier7Rule,tier8Rule]

        const rainbow=document.createElement('style');
        rainbow.innerHTML=`
        @keyframes rainbow{
        	from {
        		filter: hue-rotate(0deg);
        	}
	        to {
	        	filter: hue-rotate(360deg);
	        }
        }

        .rainbow .petal-rows .petal:not(.empty), .rainbow .zone .petal {
        	animation: rainbow 3s infinite alternate linear !important;
        }
        `;
        document.body.appendChild(rainbow);
        document.body.classList.add('rainbow');
        document.body.classList.toggle('rainbow');

        const style=document.createElement('style');
        style.innerHTML=`
        .hide-zone .zone {
          display: none !important;
        }
        `;
        document.body.appendChild(style);

        const urmom = document.createElement('style')
        urmom.innerHTML=`
        .hidden {
          display: none !important;
        }
        `;
        document.body.appendChild(urmom)

        document.addEventListener('keydown', event => {
            if (chatFocus===false && nameFocus===false) {
                if (event.key === 'h') { // 72
                    toggleElem(petalRows)
                }
                if (event.key === 'b') { // 66
                    toggleElem(minimap)
                }
                if (event.key === 'k') { // 75
                    toggleHideChat(chatInput)
                }
                if (event.key === 'j') { // 74
                    toggleElem(scoreboard)
                }
                if (event.key === 'n') {
                    document.body.classList.toggle('hide-zone')
                }
                if (event.key === 'p' && randomizer === true) {
                    for (let i=0; i<uwu.length; i++) {
                        rgbRandomizer(uwu[i], 'background-color', i)
                    }
                }
                if (event.key === 'o' && enableRainbow === true) {
                    document.body.classList.toggle('rainbow');
                }
                if (event.key === 'y') {
                    toggleElem(scoreboard)
                    toggleElem(minimap)
                    toggleElem(petalRows)
                    document.body.classList.toggle('hide-zone')
                }
            }
        });
        document.addEventListener('DOMNodeInserted', (event) => {
            if (event.target.classList.contains('chat-item')) {
                deleteOldMessages();
            }
        });

        document.addEventListener('click', event => {
            const target = event.target;
            if (target.classList.contains('btn')) {
                console.log("update server info")
                updateServerInfo()
            }
        });
    }; //window.onload ends

})(); //function ends



const deleteOldMessages = () => {
    const messages = document.querySelectorAll('.chat-item');
    if (messages.length > maxMessages) {
        for (let i = 0; i < messages.length - maxMessages; i++) {
            messages[i].remove();
        }}
};

function toggleElem(e) {
    e.classList.toggle('hidden');
}

function toggleHideChat(sus) {
    const hideChatCB = document.querySelector('.hide-chat-cb');
    hideChatCB.checked = !hideChatCB.checked;
    sus.classList.toggle('hide-chat');
}

function getActiveServer() {
    const activeButton = document.querySelector('.server-area .btn.active');
    if (activeButton) {
        const serverName = activeButton.querySelector('span:first-child').getAttribute('stroke');
        return serverName;
    }
    return "sus";
}

function updateServerInfo() {
    const activeButton = document.querySelector('.server-area .btn.active');
    const server = activeButton ? activeButton.querySelector('span:first-child').getAttribute('stroke') : 'Unknown';
    const serverInfo = document.querySelector('.server-info');
    serverInfo.setAttribute('stroke', `SSHC ${scriptVersion} | ` + server);
};

function findRule(rules, selector) {
    for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        if (rule.selectorText.match(selector)) {
            return rule;
        }
    }
    return null;
}

function rgbRandomizer(rule, property, i) {
    if (rule) {
        const myVariable = Math.round(0-(i*2.5))
        const sys = `hsl(${Math.random()*360}, ${95+myVariable}%, ${75+myVariable}%)`
        rule.style[property] = sys;
    }
}

function updateUserCount() {
    fetch('https://stats.hornex.pro/api/userCount')
        .then(res => res.json())
        .then(data => {
        const total = data.eu_ffa1 + data.eu_ffa2 + data.us_ffa1 + data.us_ffa2 + data.as_ffa1 + data.as_ffa2
        const ucEl = document.querySelector('.debug-info.user-count')
        ucEl.setAttribute('stroke', 'User Count / AS1: ' + data.as_ffa1 + ' / AS2: ' + data.as_ffa2 + ' / EU1: ' + data.eu_ffa1 + ' / EU2: ' + data.eu_ffa2 + ' / US1: ' + data.us_ffa1 + ' / US2: ' + data.us_ffa2 + ' / Total: ' + total)
    });
}

// Updates each 10 seconds

setInterval(() => {

    updateUserCount()

}, 10000);