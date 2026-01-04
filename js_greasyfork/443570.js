// ==UserScript==
// @name         Corsairs CheatPanel
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Press TAB to show the panel
// @author       Milk_Cool
// @match        https://tbot.xyz/corsairs/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tbot.xyz
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443570/Corsairs%20CheatPanel.user.js
// @updateURL https://update.greasyfork.org/scripts/443570/Corsairs%20CheatPanel.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const cheatPanel = document.createElement("div");
    cheatPanel.style.position = "fixed";
    cheatPanel.style.top = "calc(50vh - 300px)";
    cheatPanel.style.left = "calc(50vw - 300px)";
    cheatPanel.style.width = "600px";
    cheatPanel.style.height = "600px";
    cheatPanel.style.background = "gray";
    cheatPanel.style.opacity = .8;
    cheatPanel.style.zIndex = 9999;
    cheatPanel.style.display = "none";
    document.body.appendChild(cheatPanel);

    cheatPanel.innerHTML = `
        Opacity: <input id="tranx" min="0.1" max="1" step="0.01" value="0.8" type="range" onchange="document.querySelector('body > div:nth-child(3)').style.opacity = parseFloat(document.getElementById('tranx').value)"><br>
        <i>Fixes</i><br>
        <button onclick="document.querySelectorAll('.fix').forEach(a => a.click())">Fix all</button>
        <button class="fix" onclick="newGame=()=>{shipSpeed=100,bulletFrac=400,bulletSpeed=130,score=0,pause=!(level=1),lvlText.text='Level '+level,scoreText.text=score+'',resetLevel(),ge('score_share').className='score_share'}">Fix speed bug</button>
        <button class="fix" onclick="document.onkeydown=function(n){if(window.pr)return;window.pr=true;n=n.which||n.keyCode;40!=n&&38!=n&&32!=n&&37!=n&&39!=n||swap()};document.onkeyup=()=>window.pr=false">Fix button hold bug</button><br>
        <i>Values changer</i><br>
        <input type="number" id="scorx" placeholder="0"><button onclick="score = parseInt(document.getElementById('scorx').value || 0)">Set score</button><br>
        <input type="number" id="spedx" placeholder="100"><button onclick="shipSpeed = parseInt(document.getElementById('spedx').value || 100)">Set speed</button><br>
        <input type="number" id="spebx" placeholder="150"><button onclick="bulletSpeed = parseInt(document.getElementById('spebx').value || 150)">Set bullet speed</button><button onclick="window.fire = !window.fire">Bullets on/off</button><br>
        <input type="number" id="fracx" placeholder="500"><button onclick="bulletFrac = parseInt(document.getElementById('fracx').value || 500)">Set bullet spawn delay (in ms)</button><br>
        <input type="number" id="lvelx" placeholder="1"><button onclick="level = parseInt(document.getElementById('lvelx').value || 1)">Set level</button><button onclick="nextLevel()">Skip level</button><br>
        <i>Misc</i><br>
        <button onclick="window.deathPossible = !window.deathPossible">Death on/off</button><button onclick="die()">Die (if death is on)</button><br>
        <input type="checkbox" checked onchange="window.sounde = !window.sounde; ion.sound.play('coin2',{volume:~~window.sounde}); ion.sound.play('explosion',{volume:~~window.sounde}); ion.sound.pause('explosion'); ion.sound.pause('coin2')">Sound<br>
        <i>Info</i><br>
        <h2>Cheatpanel by Milk_Cool (v0.5)</h2>
    `;
    document.addEventListener("keydown", e => {
        const cheatPanel = document.querySelector("body > div:nth-child(3)");
        if(e.keyCode == 9){
            e.preventDefault();
            if(cheatPanel.style.display == "none")
                cheatPanel.style.display = "block";
            else cheatPanel.style.display = "none";
        }
    });

    window.deathPossible = true;
    window.fire = true;
    window.sounde = true;
    setInterval(() => {
        die = () => {
            if(window.deathPossible) (()=>{if(!started)return!1;if(started=!1,dieing=shipSpeed,!bang){bang=new PIXI.Container,bang.x=0;for(var a=[13376026,16770452,16762697,16777215,10822435,16472355],e=bang.y=0;e<25;e++){var r=new PIXI.Graphics;r.beginFill(a[Math.floor(Math.random()*a.length)],1),r.drawCircle(0,0,p(5)),r.endFill(),bang.addChild(r),r.alpha=0,bangParts.push(r)}stage.addChild(bang)}var n=0;for(e in bangParts){var s=bangParts[e],i=p(4);s.scaleTo=.8,setTimeout(function(n){return function(){n.alpha=0,n.scale.set(.01,.01);var a=cham.scale(n,n.scaleTo,n.scaleTo,20),e=rX(radians(angle),100),r=rY(radians(angle),100);n.x=e+rand(i,!0),n.y=r+rand(i,!0),cham.fadeIn(n,20),cham.slide(n,e+rand(i,!0),r+rand(i,!0),20),a.onComplete=function(){var a=rX(radians(angle),100),e=rY(radians(angle),100);cham.scale(n,0,0,70),cham.fadeOut(n,40),cham.slide(n,a+rand(i,!0),e+rand(i,!0),40)}}}(s),n),n+=30}var o=ship.scale.x,l=ship.scale.y;cham.scale(ship,1.5*-ship.scale.x,1.5*ship.scale.y,15).onComplete=function(){cham.scale(ship,o,l,15)},setTimeout(function(){cham.fadeOut(ship,30)},800),setTimeout(stop,2e3);for(e=0;e<table.length;e++){var t=table[e];if(t.current&&t.score<score){for(ge("updating").style.display="block",t.score=score;0<e;){e--;var c=table[e];if(!(c.score<score))break;var d=t.pos;t.pos=c.pos,c.pos=d,table[e]=t,table[e+1]=c}updateTable();break}}(score>userScore?sendScore:getHighScores)(),ion.sound.play("explosion")})();
        }
        fireBullet = () => {
            if(window.fire) (()=>{var e,i=bulletsPull.shift();i?(i.alpha=1,i.done=!1):(i=new PIXI.Sprite(imgs.bullet),stage.addChildAt(i,stage.getChildIndex(tower))),i.anchor.set(.5,.5);var t=92*shipSpeed/bulletSpeed;4==fireMode?(fireMode=0,e=angle+(90*Math.random()-45)):3==fireMode?e=angle:2==fireMode?(fireMode=0,e=angle+(direction?t:-t)):(e=angle+(direction?t:-t),e+=60*Math.random()-30),fireMode+=1,360<e&&(e-=360),i.deg=e,i.rotation=i.a=radians(e),i.dist=0,i.width=p(4),i.height=3*i.width,i.x=rX(e,i.dist),i.y=rY(e,i.dist),bulletsArr.push(i)})();
        };
        doneCoin = o => {if(started){o=coins[o];if(o&&!o.done){o.done=!0,o.chams=[],o.chams.push(cham.fadeOut(o,20)),o.chams.push(cham.scale(o,2*o.stScale,2*o.stScale,20));var c,n=coinF=!1;for(c in coins)coins[c].done||(!(n=!0)===coinF&&(coinF=c),coinL=c);n?score+=1:nextLevel(),scoreText.text=score+"",ion.sound.play("coin2")}}}
    });
})();