// ==UserScript==
// @name         kirka.io ESP
// @namespace    http://tampermonkey.net/
// @version      2024-01-30
// @description  ESP behind the wall players show cheat for kirka.io
// @author       anonimbiri
// @match        https://kirka.io/*
// @require https://update.greasyfork.org/scripts/482771/1321969/Malayala%20Kit.js
// @require      https://unpkg.com/three@latest/build/three.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kirka.io
// @lisans Mid
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485668/kirkaio%20ESP.user.js
// @updateURL https://update.greasyfork.org/scripts/485668/kirkaio%20ESP.meta.js
// ==/UserScript==


const AnonimbiriAPI = {
    THREE: window.THREE,
    chams: false,
    skin: false,
    scene: null,
    camera: null,
    gun: null,
    debug: false,
};

delete window.THREE;

var toastManager = new MalayalaKit.ToastManager();
const kit = new MalayalaKit.CreateMenu({
    title: "Kirka Menu",
    icon: "",
    size: { width: 500, height: 400 },
    position: { top: 50, left: 50 },
    hotkey: {
        keyCode: 113,
        ctrlKey: false,
        altKey: false,
        shiftKey: false
    },
    pointerLock: true
});
const general = new MalayalaKit.Tab("General");
general.addSwitch({
    label: "Player Chams",
    value: false,
    onchange: (value) => {
        AnonimbiriAPI.chams = value;
        toastManager.showToast({ message: 'Player Chams is ' + (value ? 'ON' : 'OFF'), type: 'info' });
    },
});
general.addSwitch({
    label: "Rapid Fire",
    value: false,
    onchange: (value) => {
        window.Date.now = new Proxy(Date.now, {
            apply: (target, thisArg, argumentsList) => (target.apply(thisArg, argumentsList) * (value ? 2123 : 1 / 2123))
        });
        toastManager.showToast({ message: 'Rapid Fire is ' + (value ? 'ON' : 'OFF'), type: 'info' });
    },
});
/*general.addSwitch({
    label: "Skin Changer",
    value: false,
    onchange: (value) => {
        AnonimbiriAPI.skin = value;
        toastManager.showToast({ message: 'Skin Changer is ' + (value ? 'ON' : 'OFF'), type: 'info' });
    },
});*/
kit.addTab(general);

WeakMap.prototype.set = new Proxy(WeakMap.prototype.set, {
    apply(target, thisArgs, [object]) {

        if (object && typeof object === 'object'){
            if (object.type == 'Scene' && object.autoUpdate === false){
                AnonimbiriAPI.debug && console.log("%cScene Found: ", "color: pink", object);
                AnonimbiriAPI.scene = object;
            }else if (object.type == 'Scene' && object.autoUpdate === true){
                AnonimbiriAPI.debug && console.log("%cCamera Found: ", "color: pink", object.children[0].children[0]);
                AnonimbiriAPI.camera = object.children[0].children[0];
            }else if(object.type == 1009 && object.image && object.image.currentSrc && !object.image.currentSrc.includes("data:image")){
                AnonimbiriAPI.debug && console.log("%cSkin Found: ", "color: pink", object);
                AnonimbiriAPI.gun = object;
            }
        }

        return Reflect.apply(...arguments);
    }
});
window.requestAnimationFrame = new Proxy(window.requestAnimationFrame, {
    apply(target, prop, args) {
        if(AnonimbiriAPI.gun && AnonimbiriAPI.skin){
            AnonimbiriAPI.gun.image.currentSrc = "https://kirka.io/assets/img/texture.61357e1e.webp";
            AnonimbiriAPI.gun.image.src = "https://kirka.io/assets/img/texture.61357e1e.webp";
        }
        if(AnonimbiriAPI.chams){
            AnonimbiriAPI.scene.children.filter(object => {
                return object.type == 'Group'
            }).forEach(player => {
                const character = player.children[0].children[0].children[1];
                if (
                    player.entity?.hasOwnProperty('colyseusObject') &&
                    player.entity?.colyseusObject?.hasOwnProperty('team')
                ) {
                    const color = player.entity.colyseusObject.team === 'blue' ? [0, 0, 1] : [1, 0, 0];
                    character.material.alphaTest = 1;
                    character.material.depthTest = false;
                    character.material.fog = false;
                    character.material.color.setRGB(...color);
                } else {
                    character.material.alphaTest = 1;
                    character.material.depthTest = false;
                    character.material.fog = false;
                    character.material.color.setRGB(1, 0, 0);
                }
                AnonimbiriAPI.debug && console.log("%cPlayer: ", "color: pink", player);
            });
        }
        return Reflect.apply(target, prop, args);
    }
});

window.AnonimbiriAPI = AnonimbiriAPI;
kit.render();