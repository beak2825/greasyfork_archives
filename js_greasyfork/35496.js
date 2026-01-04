// ==UserScript==
// @name         Agar.io Skin Changer
// @namespace    Agar.io Hack 2017
// @version      0.1
// @description  Agario Hack
// @author       TrapKilloYT
// @match        http://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35496/Agario%20Skin%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/35496/Agario%20Skin%20Changer.meta.js
// ==/UserScript==

setTimeout(function() {

    $('#instructions').after('<center><span class="text-muted">Press <b>ESC</b> to stop rotating the skins</span><button id="start" class="btn btn-primary btn-party party-create" style="float: left;">Start</button></center>');

    Array.prototype.random = function() {
        return this[Math.floor(Math.random() * length)];
    };

    skins = ['fly', 'spider', 'wasp', 'lizard', 'bat', 'snake', 'fox', 'coyote', 'hunter', 'sumo', 'bear', 'cougar', 'panther', 'lion', 'crocodile', 'shark', 'mammoth', 'raptor', 't-rex', 'kraken'];

    let rotator = true;

    this.rotating = null;

    window.start = () => {
        var rotating = setInterval(function() {
            if(rotator === true) {
                MC.setNick(skins.random());

                core.registerSkin('fly', null, 'https://configs-web.agario.miniclippt.com/live/v9/1027/Fly.png', 1, null);
                core.registerSkin('spider', null, 'https://configs-web.agario.miniclippt.com/live/v9/1027/Spider.png', 1, null);
                core.registerSkin('wasp', null, 'https://configs-web.agario.miniclippt.com/live/v9/1027/Wasp.png', 1, null);
                core.registerSkin('lizard', null, 'https://configs-web.agario.miniclippt.com/live/v9/1027/Lizard.png', 1, null);
                core.registerSkin('bat', null, 'https://configs-web.agario.miniclippt.com/live/v9/1027/Bat.png', 1, null);
                core.registerSkin('snake', null, 'https://configs-web.agario.miniclippt.com/live/v9/1027/Snake.png', 1, null);
                core.registerSkin('fox', null, 'https://configs-web.agario.miniclippt.com/live/v9/1027/Fox.png', 1, null);
                core.registerSkin('coyote', null, 'https://configs-web.agario.miniclippt.com/live/v9/1027/Coyote.png', 1, null);
                core.registerSkin('hunter', null, 'https://configs-web.agario.miniclippt.com/live/v9/1027/Hunter.png', 1, null);
                core.registerSkin('sumo', null, 'https://configs-web.agario.miniclippt.com/live/v9/1027/Sumo.png', 1, null);
                core.registerSkin('bear', null, 'https://configs-web.agario.miniclippt.com/live/v9/1027/Bear.png', 1, null);
                core.registerSkin('cougar', null, 'https://configs-web.agario.miniclippt.com/live/v9/1027/Cougar.png', 1, null);
                core.registerSkin('panther', null, 'https://configs-web.agario.miniclippt.com/live/v9/1027/Panther.png', 1, null);
                core.registerSkin('lion', null, 'https://configs-web.agario.miniclippt.com/live/v9/1027/Lion.png', 1, null);
                core.registerSkin('crocodile', null, 'https://configs-web.agario.miniclippt.com/live/v9/1027/Crocodile.png', 1, null);
                core.registerSkin('shark', null, 'https://configs-web.agario.miniclippt.com/live/v9/1027/Shark.png', 1, null);
                core.registerSkin('mammoth', null, 'https://configs-web.agario.miniclippt.com/live/v9/1027/Mammoth.png', 1, null);
                core.registerSkin('raptor', null, 'https://configs-web.agario.miniclippt.com/live/v9/1027/Raptor.png', 1, null);
                core.registerSkin('t-rex', null, 'https://configs-web.agario.miniclippt.com/live/v9/1027/T-Rex.png', 1, null);
                core.registerSkin('kraken', null, 'https://configs-web.agario.miniclippt.com/live/v9/1027/Kraken.png', 1, null);
            }
        }, 1000);
    };

    window.add = () => {
        this.rotating = setInterval(function() {
            if(rotator === true) {
                MC.setNick(skins.random());

                core.registerSkin('fly', null, 'https://configs-web.agario.miniclippt.com/live/v9/1027/Fly.png', 1, null);
                core.registerSkin('spider', null, 'https://configs-web.agario.miniclippt.com/live/v9/1027/Spider.png', 1, null);
                core.registerSkin('wasp', null, 'https://configs-web.agario.miniclippt.com/live/v9/1027/Wasp.png', 1, null);
                core.registerSkin('lizard', null, 'https://configs-web.agario.miniclippt.com/live/v9/1027/Lizard.png', 1, null);
                core.registerSkin('bat', null, 'https://configs-web.agario.miniclippt.com/live/v9/1027/Bat.png', 1, null);
                core.registerSkin('snake', null, 'https://configs-web.agario.miniclippt.com/live/v9/1027/Snake.png', 1, null);
                core.registerSkin('fox', null, 'https://configs-web.agario.miniclippt.com/live/v9/1027/Fox.png', 1, null);
                core.registerSkin('coyote', null, 'https://configs-web.agario.miniclippt.com/live/v9/1027/Coyote.png', 1, null);
                core.registerSkin('hunter', null, 'https://configs-web.agario.miniclippt.com/live/v9/1027/Hunter.png', 1, null);
                core.registerSkin('sumo', null, 'https://configs-web.agario.miniclippt.com/live/v9/1027/Sumo.png', 1, null);
                core.registerSkin('bear', null, 'https://configs-web.agario.miniclippt.com/live/v9/1027/Bear.png', 1, null);
                core.registerSkin('cougar', null, 'https://configs-web.agario.miniclippt.com/live/v9/1027/Cougar.png', 1, null);
                core.registerSkin('panther', null, 'https://configs-web.agario.miniclippt.com/live/v9/1027/Panther.png', 1, null);
                core.registerSkin('lion', null, 'https://configs-web.agario.miniclippt.com/live/v9/1027/Lion.png', 1, null);
                core.registerSkin('crocodile', null, 'https://configs-web.agario.miniclippt.com/live/v9/1027/Crocodile.png', 1, null);
                core.registerSkin('shark', null, 'https://configs-web.agario.miniclippt.com/live/v9/1027/Shark.png', 1, null);
                core.registerSkin('mammoth', null, 'https://configs-web.agario.miniclippt.com/live/v9/1027/Mammoth.png', 1, null);
                core.registerSkin('raptor', null, 'https://configs-web.agario.miniclippt.com/live/v9/1027/Raptor.png', 1, null);
                core.registerSkin('t-rex', null, 'https://configs-web.agario.miniclippt.com/live/v9/1027/T-Rex.png', 1, null);
                core.registerSkin('kraken', null, 'https://configs-web.agario.miniclippt.com/live/v9/1027/Kraken.png', 1, null);
            }
        }, 1000);
    };

    document.addEventListener('keydown', (e) => {
        let keyCode = e.keyCode;
        switch(keyCode) {
            case 27: //ESC
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