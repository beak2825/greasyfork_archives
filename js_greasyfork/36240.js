// ==UserScript==
// @name         スキチェン
// @namespace    japan agar.io
// @version      2.0
// @description  スキンチェンジャー（スキチェン）
// @author       kag
// @icon         https://i.imgur.com/SKajdq0.png
// @match        http://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36240/%E3%82%B9%E3%82%AD%E3%83%81%E3%82%A7%E3%83%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/36240/%E3%82%B9%E3%82%AD%E3%83%81%E3%82%A7%E3%83%B3.meta.js
// ==/UserScript==

setTimeout(function() {

    $('#instructions').after('<center><span class="text-muted">やぁ 暇なら下の<b>プレイ<b>を押すといい。</span><button id="start" class="btn btn-primary btn-party party-create" style="float: left;">プレイ</button></center>');

    Array.prototype.random = function() {
        return this[Math.floor(Math.random() * length)];
    };

    skins = ['Blue', 'Purple', 'Green', 'Red', 'Yellow', 'Light', 'Pink'];

  let rotator = true;

    this.rotating = null;

    window.start = () => {
        var rotating = setInterval(function() {
            if(rotator === true) {
                MC.setNick(skins.random());

                core.registerSkin('Blue', null, 'https://i.imgur.com/8WVAEvk.png', 1, null);
                core.registerSkin('Purple', null, 'https://i.imgur.com/Dgw45eH.png', 1, null);
                core.registerSkin('Green', null, 'https://i.imgur.com/jOx7ARx.png', 1, null);
                core.registerSkin('Red', null, 'https://i.imgur.com/LDn7shn.png', 1, null);
                core.registerSkin('Yellow', null, 'https://i.imgur.com/Bpdqfih.png', 1, null);
                core.registerSkin('Light', null, 'https://i.imgur.com/gJSGYoI.png', 1, null);
                core.registerSkin('Pink', null, 'https://i.imgur.com/aElQhJm.png', 1, null);

            }
        }, 1000);
    };

    window.add = () => {
        this.rotating = setInterval(function() {
            if(rotator === true) {
                MC.setNick(skins.random());

                core.registerSkin('Blue', null, 'https://i.imgur.com/8WVAEvk.png', 1, null);
                core.registerSkin('Purple', null, 'https://i.imgur.com/Dgw45eH.png', 1, null);
                core.registerSkin('Green', null, 'https://i.imgur.com/jOx7ARx.png', 1, null);
                core.registerSkin('Red', null, 'https://i.imgur.com/LDn7shn.png', 1, null);
                core.registerSkin('Yellow', null, 'https://i.imgur.com/Bpdqfih.png', 1, null);
                core.registerSkin('Light', null, 'https://i.imgur.com/gJSGYoI.png', 1, null);
                core.registerSkin('Pink', null, 'https://i.imgur.com/aElQhJm.png', 1, null);
            }
        }, 1000);
    };

    document.addEventListener('keydown', (e) => {
        let keyCode = e.keyCode;
        switch(keyCode) {
            case 18: //ALT
                console.log('ESC , Stoping interval...');
                window.start = null;
                clearInterval(this.rotating);
                break;
        }
    });
document.getElementById('start').onclick = function() {
        rotator = true;
        window.start = window.add();
        console.log('starting skin rotator...');
    };

}, 1000);

//agar tool

function loadExtension()
{
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = location.protocol + "//cdn.agartool.io/extension.js?ts="+Date.now();
    script.onerror = function(err)
    {
        setTimeout(loadExtension, 100);
    };
    document.head.appendChild(script);
}

if(location.pathname.includes(".htm") || location.pathname.includes(".php") || !location.pathname.includes("."))
{
    window.stop();
    document.documentElement.innerHTML = "";
	loadExtension();
}