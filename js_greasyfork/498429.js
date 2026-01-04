// ==UserScript==
// @name         Voxiom.IO Aimbot, ESP & X-Ray
// @namespace    http://tampermonkey.net/
// @version      4.4
// @description  Let's you see players and items behind walls in voxiom.io. Comes with an aimbot that locks aim at nearest enemy and auto fires at them. Also shows ores and names of the items that are far far away.
// @author       Zertalious (Zert)
// @match        *://voxiom.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=voxiom.io
// @grant        none
// @run-at       document-start
// @require      https://unpkg.com/three@0.150.0/build/three.min.js
// @require      https://cdn.jsdelivr.net/npm/lil-gui@0.19
// @downloadURL https://update.greasyfork.org/scripts/498429/VoxiomIO%20Aimbot%2C%20ESP%20%20X-Ray.user.js
// @updateURL https://update.greasyfork.org/scripts/498429/VoxiomIO%20Aimbot%2C%20ESP%20%20X-Ray.meta.js
// ==/UserScript==

const THREE = window.THREE;
delete window.THREE;

const settings = {
    showPlayers: true,
    showPlayerNames: true,
    showItems: true,
    showItemNames: false,
    showBlocks: true,
    showLines: true,
    showOres: true,
    worldWireframe: false,
    aimbotEnabled: true,
    aimbotOnRightMouse: false,
    aimBehindWalls: false,
    aimHeight: 0.9,
    autoFire: true,
    aimAtEveryone: false,
    createdBy: 'Zertalious',
    editAimbotBlacklist() {
        const currList = Object.keys(aimbotBlacklist).join(', ');
        const string = prompt('Enter usernames of players for whom aimbot should be disabled.\nSeparated by single comma:', currList);

        if (string !== null) {
            aimbotBlacklist = {};
            string.split(',')
                .map(name => name.trim().toLowerCase())
                .filter(name => name.length > 0)
                .forEach(name => (aimbotBlacklist[name] = true));

            updateBlacklistBtn();
        }
    },
    showHelp() {
        dialogEl.style.display = dialogEl.style.display === '' ? 'none' : '';
    }
};

const keyToSetting = {
    'KeyV': 'showPlayers',
    'KeyI': 'showItems',
    'KeyN': 'showItemNames',
    'KeyL': 'showBlocks',
    'KeyB': 'aimbotEnabled',
    'KeyT': 'aimbotOnRightMouse',
    'KeyK': 'autoFire',
    'Semicolon': 'worldWireframe',
    'Comma': 'showOres'
};

let aimbotBlacklist = {
    'Zertalious': true,
    'Zert': true
};

function updateBlacklistBtn() {
    let name = 'Edit Aimbot Blacklist';
    const n = Object.keys(aimbotBlacklist).length;
    if (n > 0) name = `${name} (${n} user${n === 1 ? '' : 's'})`;

    controllers.editAimbotBlacklist.name(name);
}

const shadowHost = document.createElement('div');
Object.assign(shadowHost.style, {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none'
});
const shadow = shadowHost.attachShadow({ mode: 'open' });

let enableDocumentOverride = false;

function setDocumentOverride(prop, value) {
    const old = document[prop];

    Object.defineProperty(document, prop, {
        get() {
            return enableDocumentOverride ? value : old;
        },
        writeable: true,
        configurable: true
    });
}

let gui;
let controllers;

function initGui() {
    const settingToKey = {};
    for (const key in keyToSetting) {
        settingToKey[keyToSetting[key]] = key;
    }

    const keyOverride = {
        'Semicolon': ';',
        'Comma': ','
    };

    setDocumentOverride('body', shadow);
    setDocumentOverride('head', shadow);
    setDocumentOverride('querySelector', () => null);

    enableDocumentOverride = true;
    gui = new lil.GUI();
    enableDocumentOverride = false;

    controllers = {};
    for (const key in settings) {
        let name = fromCamel(key);
        let shortKey = settingToKey[key];

        if (shortKey) {
            if (keyOverride[shortKey]) shortKey = keyOverride[shortKey];
            else if (shortKey.startsWith('Key')) shortKey = shortKey.slice(3);
            name = `[${shortKey}] ${name}`;
        }

        controllers[key] = gui.add(settings, key).name(name).listen();
    }

    controllers.aimHeight.min(0).max(1.5);
    controllers.createdBy.disable();
    addDescription(controllers.aimAtEveryone, 'Enable this to make aimbot work in Survival mode.');
    updateBlacklistBtn();

    const titleEl = gui.domElement.querySelector('.title');
    titleEl.innerText = `[/] Controls`;
}

function addDescription(controller, text) {
    const div = document.createElement('div');
    div.className = 'my-lil-gui-desc';
    div.innerText = text;
    controller.domElement.querySelector('.name').appendChild(div);
}

function fromCamel(text) {
    const result = text.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
}

let isRightDown = false;
window.addEventListener('mousedown', event => {
    if (event.button === 2) isRightDown = true;
});

window.addEventListener('mouseup', event => {
    if (event.button === 2) isRightDown = false;
});

const geometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0));

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.id = 'overlayCanvas';

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const colors = {
    enemy: 'red',
    team: 'blue',
    block: 'green',
    item: 'gold'
};
for (const key in colors) {
    const color = new THREE.Color(colors[key]);
    color.rawColor = colors[key];
    colors[key] = color;
}

function MyMaterial(color) {
    return new THREE.RawShaderMaterial({
        vertexShader: `
            attribute vec3 position;
            uniform mat4 projectionMatrix;
            uniform mat4 modelViewMatrix;
            void main() {
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                gl_Position.z = 1.0;
            }
        `,
        fragmentShader: `
            precision mediump float;
            uniform vec3 color;
            void main() {
                gl_FragColor = vec4(color, 1.0);
            }
        `,
        uniforms: {
            color: { value: color }
        }
    });
}

let target;
let gameCamera;

let projectionMatrixKey;
let matrixWorldKey;
let elementsKey;

function inject() {
    Object.defineProperty(Object.prototype, 'overrideMaterial', {
        set(value) {
            setTimeout(() => checkScene(this), 0);
            this._overrideMaterial = value;
        },
        get() {
            return this._overrideMaterial;
        },
        configurable: true
    });

    Object.defineProperty(Object.prototype, 'far', {
        set(value) {
            this._far = value;
        },
        get() {
            checkCamera(this);
            return this._far;
        },
        configurable: true
    });
}

const postRunName = Math.random().toString(32).slice(0, 10).toUpperCase();

window[postRunName] = function () {
    const CTX = CanvasRenderingContext2D.prototype;
    CTX.fillText = new Proxy(CTX.fillText, {
        apply(target, ctx, [text]) {
            ctx.canvas.lastText = text;
            return Reflect.apply(...arguments);
        }
    });

    const WebGL = WebGLRenderingContext.prototype;

    const blocks = [
        [0, 3],
        [1, 3],
        [4, 2],
        [5, 2],
        [7, 3],
        [2, 2],
        [0, 4], [1, 4], [2, 4],
        [0, 5], [1, 5], [2, 5],
        [0, 6], [1, 6], [2, 6]
    ];
    const blockCheck = blocks.map(([x, y]) => `(p.x == ${x.toFixed(1)} && p.y == ${y.toFixed(1)})`).join(' || ');

    WebGL.shaderSource = new Proxy(WebGL.shaderSource, {
        apply(target, thisArgs, args) {
            let [shader, src] = args;

            if (src.indexOf('vRealUv = realUv;') > -1) {
                src = src.replace('void main()', `
                    uniform bool showOres;
                    uniform float currTime;
                    void main()
                `).replace('vRealUv = realUv;', `
                    if(showOres || !(${blockCheck})) {
                        vRealUv = realUv;
                    } else {
                        vRealUv = vec2(-1);
                    }
                `);
            }

            return Reflect.apply(...arguments);
        }
    });
}

const realKeys = Object.keys(THREE.Matrix4.prototype);