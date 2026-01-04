// ==UserScript==
// @name         AX Bots - Powerline.io
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  AX Bots
// @match        *://powerline.io/*
// @grant        none
// @author       https://discord.gg/zJafSX57Rc
// @downloadURL https://update.greasyfork.org/scripts/502866/AX%20Bots%20-%20Powerlineio.user.js
// @updateURL https://update.greasyfork.org/scripts/502866/AX%20Bots%20-%20Powerlineio.meta.js
// ==/UserScript==

(function(){'use strict';const Version="1.2";let WEBSOCKET_SERVER_URL='';let botCount=100;const originalWebSocket=window.WebSocket;window.WebSocket=function(...args){const ws=new originalWebSocket(...args);if(!WEBSOCKET_SERVER_URL){const url=new URL(args[0]);WEBSOCKET_SERVER_URL=`${url.hostname}:${url.port || 80}`}
return ws};const style=document.createElement('style');style.innerHTML=`
        body {
            font-family: Arial, sans-serif;
            background-color: #f7f7f7;
        }
        .button-container {
            position: fixed;
            top: 10px;
            left: 10px;
            z-index: 100;
            display: flex;
            flex-direction: column;
            gap: 10px;
            width: 150px;
            background: rgba(0,0,0,0.5);
            padding: 10px;
            border-radius: 5px;
            border: 2px solid;
        }
        .rgb-text {
            font-size: larger;
            text-align: center;
        }
                .rgb-text-qn {
            font-size: 10px;
            text-align: center;
        }
        button {
            padding: 10px;
            border: none;
            border-radius: 5px;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.3s ease;
            width: 100%;
        }
        #toggleButton {
            background-color: green;
            color: white;
        }
        #toggleButton.active {
            background-color: red;
        }
        input {
            width: 100%;
            padding: 5px;
            border-radius: 5px;
        }
        #message {
            color: white;
            text-align: center;
            font-family: monospace;
        }
        .switch-container {
            display: flex;
            justify-content: space-between;
        }
        .switch {
            flex-grow: 1;
            background: rgba(0, 0, 0, 0.5);
            color: white;
            text-align: center;
            padding: 5px;
            border-radius: 5px;
            cursor: pointer;
        }
        .switch.active {
            background-color: #4caf50;
        }
    `;document.head.appendChild(style);const container=document.createElement('div');container.id='draggable-container';container.className='button-container';container.innerHTML=`
        <div id="rgb-text" class="rgb-text" style="font-family:monospace">AX Bots</div>
        <div id="message">Connected bots: 0</div>
        <div id="rgb-text" class="rgb-text-qn" style="font-family:monospace">Quantity:</div>
                <div class="switch-container">
            <div id="switchLow" class="switch active">Low</div>
            <div id="switchMed" class="switch">Med</div>
            <div id="switchHigh" class="switch">High</div>
        </div>
        <input type="text" id="nickname-input" placeholder="Bots nick" value="AX Bots" maxlength="15">
        <button id="toggleButton">Start Bots</button>
    `;document.body.appendChild(container);const dragItem=container;let active=!1;let currentX,currentY,initialX,initialY,xOffset=0,yOffset=0;dragItem.addEventListener('mousedown',dragStart,!1);window.addEventListener('mouseup',dragEnd,!1);window.addEventListener('mousemove',drag,!1);function dragStart(e){initialX=e.clientX-xOffset;initialY=e.clientY-yOffset;active=!0}
function dragEnd(){initialX=currentX;initialY=currentY;active=!1}
function drag(e){if(active){e.preventDefault();currentX=e.clientX-initialX;currentY=e.clientY-initialY;xOffset=currentX;yOffset=currentY;dragItem.style.transform=`translate3d(${currentX}px, ${currentY}px, 0)`}}
let red=0,green=0,blue=0;let redDirection=1,greenDirection=1,blueDirection=1;function changeColor(){const elems=document.querySelectorAll('#rgb-text, #message');const elemBorder=document.getElementById('draggable-container');elems.forEach(elem=>elem.style.color=`rgb(${red}, ${green}, ${blue})`);elemBorder.style.borderColor=`rgb(${red}, ${green}, ${blue})`;if(red>=255)redDirection=-1;if(red<=0)redDirection=1;if(green>=255)greenDirection=-1;if(green<=0)greenDirection=1;if(blue>=255)blueDirection=-1;if(blue<=0)blueDirection=1;red+=redDirection*5;green+=greenDirection*7;blue+=blueDirection*11}
setInterval(changeColor,50);let configSocket;let botsRunning=!1;let shouldReconnect=!0;function generateUniqueId(){return Math.random().toString(36).substr(2,9)}
function toggleBots(){if(botsRunning){stopBots()}else{startBots()}}
function startBots(){const nickname=document.getElementById('nickname-input').value;configSocket=new WebSocket('wss://a.ctx.cl:8443');configSocket.addEventListener('open',function(){const config={action:'start',server:WEBSOCKET_SERVER_URL,nickname:nickname,bots:botCount,version:Version};configSocket.send(JSON.stringify(config));botsRunning=!0;document.getElementById('toggleButton').innerHTML="Stop Bots";document.getElementById('toggleButton').classList.add("active")});configSocket.addEventListener('message',function(event){const message=JSON.parse(event.data);if(message.type==='status'&&message.message.startsWith('Connected bots:')){document.getElementById('message').textContent=message.message}else if(message.type==='error'){alert(message.message);if(message.message==='Bots in use, Please wait'){shouldReconnect=!1}}});configSocket.addEventListener('close',function(){console.log('Disconnected.')})}
function stopBots(){if(configSocket){const stopSignal={action:'stop',version:Version};configSocket.send(JSON.stringify(stopSignal));configSocket.close()}
botsRunning=!1;document.getElementById('toggleButton').innerHTML="Start Bots";document.getElementById('toggleButton').classList.remove("active")}
document.getElementById('toggleButton').addEventListener('click',function(){shouldReconnect=!0;toggleBots()});document.getElementById('switchLow').addEventListener('click',function(){botCount=100;updateSwitchActiveState('Low')});document.getElementById('switchMed').addEventListener('click',function(){botCount=300;updateSwitchActiveState('Med')});document.getElementById('switchHigh').addEventListener('click',function(){botCount=700;updateSwitchActiveState('High')});function updateSwitchActiveState(activeLabel){const switches=document.querySelectorAll('.switch');switches.forEach(switchElem=>{if(switchElem.innerText===activeLabel){switchElem.classList.add('active')}else{switchElem.classList.remove('active')}})}})()