// ==UserScript==
// @name         AIMBOT Starve.js
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  TRY to take over the world!
// @author       Cryo Scalpel
// @match        https://starve.io/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423810/AIMBOT%20Starvejs.user.js
// @updateURL https://update.greasyfork.org/scripts/423810/AIMBOT%20Starvejs.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    const injectInline = (data) => {
        let s = document.createElement('script');
        s.type = 'text/javascript';
        s.innerText = data;
        document.getElementsByTagName('head')[0].appendChild(s);
    }
 
 
 
    const request = url => fetch(url).then(res => res.text());
 
    const hack = `
(function(){
const canvas = document.getElementById('game_canvas');
      const ctx = canvas.getContext('2d');
      console.log('WHAT THE FUCK', CanvasRenderingContext2D.prototype.fillRect);
      const old = CanvasRenderingContext2D.prototype.fillRect;
        window.CanvasRenderingContext2D.prototype.fillRect = function(){
            old.apply(this,arguments);
    	    if(arguments.callee.caller.toString().length===19295 && window.Utils.hacks.ESP.enabled){
                if(r && r.oOol.length > 0){
                    const myPlayer = r.oOol[p.olo0];
                    const myPosition = {x: p.LOL.x + myPlayer.x, y: p.LOL.y + myPlayer.y};
                    r.oOol.forEach(entity => {
                        if(entity){
                            if(entity.type === 0){
                                if(entity!=myPlayer){
                                    console.log(entity);
                                    const theirPosition = {x:entity.x-myPlayer.x,y:entity.y-myPlayer.y};
                                    ctx.font = "15px Arial";
                                    ctx.strokeText(entity.oooo.loOO, myPosition.x+theirPosition.x-20, myPosition.y+theirPosition.y-50);
                                    ctx.beginPath();
                                    ctx.moveTo(myPosition.x, myPosition.y);
                                    ctx.strokeStyle = '#ff08c5';
                                    ctx.lineTo(myPosition.x+theirPosition.x, myPosition.y+theirPosition.y);
                                    ctx.stroke();
                                };
                            };
                        };
                    });
                };
                return;
    	    };
        };
const dist2d=(p1, p2)=>{
return Math.sqrt((p1.x-p2.x)**2 + (p1.y-p2.y)**2);
};
const calcAngle = (p1, p2) => {
var dy = p2.y - p1.y;
var dx = p2.x - p1.x;
var theta = Math.atan2(dy, dx);
return theta;
};
const getNearest=(us, them)=>{
const nearestEntity = {player: null, dist:null};
them.forEach(player=>{
const dist = dist2d(us, player);
if(!nearestEntity.dist || dist < nearestEntity.dist){
nearestEntity.dist = dist;
nearestEntity.player = player;
};
});
if(nearestEntity.player){
return nearestEntity.player;
};
return null;
};
let lastRefresh = performance.now();
const oldAnimFrame = window.requestAnimationFrame;
window.requestAnimationFrame = function(){
const now = performance.now();
if(now-lastRefresh > 1000/60 && p){
lastRefresh = now;
if(r && r.oOol.length > 0){
let entities = [];
const myPlayer = r.oOol[p.olo0];
r.oOol.forEach(entity => {
if(entity){
if(entity.type === 0){
if(entity!=myPlayer){
entities.push(entity);
};
};
};
});
if(myPlayer){
const nearest = getNearest(myPlayer, entities);
if(nearest){
const angle = calcAngle(myPlayer, nearest);
if(angle){
myPlayer.angle = angle;
window.overrideC= true;
window.newC = angle;
}else{
window.overrideC= false;
window.newC = null;
};
}else{
window.overrideC= false;
window.newC = null;
};
}else{
window.overrideC= false;
window.newC = null;
};
};
};
return oldAnimFrame.apply(this,arguments);
};
})();
`
    const theme_ = {
        name: "Custom By Cryo",
        colors: {
            menuBarBackground: 'rgb(35, 35, 35)',
            menuBarText: 'rgb(197, 41, 156)',
            panelBackground: 'rgb(28, 28, 27)',
 
            componentBackground: 'rgb(45, 41, 38)',
            componentBackgroundHover: 'rgb(233, 75, 60)',
            componentForeground: 'rgb(45, 168, 216)',
            componentActive: 'rgb(233, 75, 60)',
 
            textPrimary: 'rgb(206, 74, 126)',
            textSecondary: 'rgb(252, 246, 245)',
            textHover: 'rgb(235, 235, 235)',
            textActive: 'rgb(233, 75, 60)',
        },
    }
 
    window.Utils = {
        initUI: ()=>{
            let container = document.body;
            let gui = new guify({
                title: '🌜Cryogenic Client v0.1🌜',
                theme: theme_,
                align: 'right', // left, right
                width: 300,
                barMode: 'none',
                panelMode: 'none',
                opacity: 0.95,
                root: window.container,
                open: Utils.hacks.MENU.enabled
            });
 
            gui.Register({
                type: 'folder',
                label: 'Hacks',
                open: true
            });
 
            // Add to the folder example
            gui.Register([
 
                {
                    type: 'title',
                    label: 'ESP'
                },
                {
                    type: 'checkbox',
                    label: 'ESP',
                    object: Utils.hacks.ESP,
                    property: 'enabled',
                    onChange: (data) => {
                        Utils.hacks.ESP.enabled = data;
                    }
                },
 
                {
                    type: 'title',
                    label: 'AIMBOT'
                },
 
                {
                    type: 'checkbox',
                    label: 'Aimbot',
                    object: Utils.hacks.AIMBOT,
                    property: 'enabled',
                    onChange: (data) => {
                        Utils.hacks.AIMBOT.enabled = data;
                    }
                },
 
                {
                    type: 'checkbox',
                    label: 'Toggle on Press',
                    object: Utils.hacks.AIMBOT,
                    property: 'toggle',
                    onChange: (data) => {
                        Utils.hacks.AIMBOT.toggle = data;
                    }
                },
 
 
                {
                    type: 'title',
                    label: 'Key Binds'
                },
 
                { type: 'button', label: 'Set Aimbot Key',  action: (data) => {
                    Utils.controls.setKeyBind('AIMBOT');
                }},
 
                { type: 'button', label: 'Set ESP Key',  action: (data) => {
                    Utils.controls.setKeyBind('ESP');
                }},
 
                { type: 'text', label: 'Aimbot', object: Utils.hacks.AIMBOT, property: "key",
                 onChange: (data) => {
                     Utils.hacks.AIMBOT.key = data;
                 } },
 
                { type: 'text', label: 'ESP', object: Utils.hacks.ESP, property: "key",
                 onChange: (data) => {
                     Utils.hacks.ESP.key = data;
                 } },
 
                {
                    type: 'title',
                    label: 'Credits / Help'
                },
 
                {
                    type: 'button',
                    label: 'My Discord',
                    action: () => {
                    }
                },
 
            ], {
                folder: 'Hacks'
            });
        },
 
 
        controls: null,
 
        controller: class{
 
            constructor(){
 
                document.addEventListener('keydown', (e)=>{
                    const objectKeys = Object.keys(Utils.hacks);
                    objectKeys.forEach(hackKEY=>{
                        const hack = Utils.hacks[hackKEY];
                        if(hack.key === e.code && hack.toggle == true){
                            hack.enabled = !hack.enabled;
                        }
                        if(hack.key === e.code && hack.toggle != true){
                            hack.enabled = true;
                        }
                    })
                });
 
                document.addEventListener('keyup', (e)=>{
                    const objectKeys = Object.keys(Utils.hacks);
                    objectKeys.forEach(hackKEY=>{
                        const hack = Utils.hacks[hackKEY];
                        if(hack.key === e.code && hack.toggle != true){
                            hack.enabled = false;
                        }
                    })
                });
            }
 
            setKeyBind(callback){
                Utils.hacks[callback].key = "Press any key";
                let click = 0;
                document.addEventListener('keydown', function abc(event) {
                    click++;
                    if (click >= 1) {
                        Utils.hacks[callback].key = event.code;
                        document.removeEventListener('keydown', abc);
                        Utils.saveSettings();
                    }
                });
            }
        },
 
 
        saveSettings: ()=>{
            localStorage.setItem('keybinds', JSON.stringify(Utils.hacks));
        },
 
        loadSettings: ()=>{
            const SAVEDDATA = localStorage.getItem('keybinds');
            if(SAVEDDATA){
                if(Object.keys(JSON.parse(SAVEDDATA)).length != Object.keys(Utils.hacks).length){return}
                Utils.hacks = JSON.parse(SAVEDDATA);
                return JSON.parse(SAVEDDATA);
            }else{
            }
 
        },
 
        hacks: {
            'ESP': {key: 'KeyF', enabled: true, toggle: true},
            'AIMBOT': {key: 'KeyG', enabled: true, toggle: false},
            'MENU': {key: 'KeyP', enabled: false, toggle: false},
        },
 
        LoadHack: ()=>{
            Utils.loadSettings();
            Utils.controls = new Utils.controller();
            document.addEventListener("DOMContentLoaded", function(){
                let script = document.createElement('script');
                script.onload = function () {
                    Utils.initUI();
                    document.getElementsByClassName('guify-panel-container_1PomWg')[0].style.borderRadius = "3px";
                    document.getElementsByClassName('guify-panel-toggle-button_1PomWg')[0].style.opacity = '0';
 
                };
                script.src = "https://unpkg.com/guify@0.12.0/lib/guify.min.js";
 
                document.body.appendChild(script);
            });
 
 
        }
    }
 
    Utils.LoadHack();
    const hack2 = `if(window.overrideC && Utils.hacks.AIMBOT.enabled){
          c = window.newC;
      };`
 
    const attemptPatch = (source) => {
        const patches = new Map()
 
        .set("HACKLOGIC", [/document\[\w+\[\d+\]\]\("[\\a-zA-Z0-9]*"\)\[\w+\[\d+\]\]="[\\a-zA-Z0-9]*"\);\};/, hack, true])
        .set("HACKSETTER", [/\w+=!1;this\.[a-zA-Z0-9]+\+=\w+;/, hack2, true])
 
        let variables = {};
 
        for (const [name, item] of patches) {
            let match = source.match(item[0]);
 
            const patched = source.replace(item[0], match[0]+item[1]);
            if (source === patched) {
                alert(`Failed to replace ${name}`);
                continue;
            } else console.log("Successfully patched ", name);
            source = patched;
        }
 
        return source;
    }
 
    (async function() {
        let script = await request(`https://starve.io/js/c6.js`);
        injectInline(attemptPatch(script))
    })();
 
    let observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (let node of mutation.addedNodes) {
                if(node.src && node.src.match('https://starve.io/js/c6.js')){
                    node.outerHTML = ``
                    node.innerHTML = ``;
                    node.src='';
                }
 
            }
        }
    });
 
    observer.observe(document, {
        childList: true,
        subtree: true
    })
})();