// ==UserScript==
// @name         Afk script
// @description  made with much love
// @version      0.2.2
// @author       Cazka#1820
// @match        *://diep.io/*
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/541070
// @downloadURL https://update.greasyfork.org/scripts/420238/Afk%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/420238/Afk%20script.meta.js
// ==/UserScript==
/*
 *   C L A S S E S
 */
class Input {
  keyDown(key) {
    const keydown = new KeyboardEvent('keydown', {
      key: '',
      code: '',
      keyCode: key,
      which: key,
      cancelable: true,
      composed: true,
      bubbles: true,
    });
 
    unsafeWindow.dispatchEvent(keydown);
  }
 
  keyUp(key) {
    const keyup = new KeyboardEvent('keyup', {
      key: '',
      code: '',
      keyCode: key,
      which: key,
      cancelable: true,
      composed: true,
      bubbles: true,
    });
 
    unsafeWindow.dispatchEvent(keyup);
  }
}
class Gui {
    constructor(title) {
        this._colors = ['#E8B18A', '#E666EA', '#9566EA', '#6690EA', '#E7D063', '#EA6666', '#92EA66', '#66EAE6'];
        this._buttons = [];
 
        this._title = title;
        this._gui;
        this._guiHead;
        this._guiBody;
 
        this._init();
 
        this._enableShortcuts();
    }
 
    _init() {
        const nonce = `b`;
        GM_addStyle(
            `.${nonce} {z-index:100000;}.${nonce} button{display:block;font-family:Ubuntu;color:#fff;text-shadow:-.1em -.1em 0 #000,0 -.1em 0 #000,.1em -.1em 0 #000,.1em 0 0 #000,.1em .1em 0 #000,0 .1em 0 #000,-.1em .1em 0 #000,-.1em 0 0 #000;opacity:.8;border:0;padding:.3em .5em;width:100%;transition:all .15s}.${nonce}{top:0;left:0;position:absolute}.${nonce} button:active:not([disabled]){filter:brightness(.9)}.${nonce} button:hover:not([disabled]):not(:active){filter:brightness(1.1)}`
        );
 
        this._gui = document.createElement('div');
        this._guiHead = document.createElement('div');
        this._guiBody = document.createElement('div');
 
        this._gui.className = `${nonce}`;
        this._guiBody.style.display = 'block';
 
        document.body.appendChild(this._gui);
        this._gui.appendChild(this._guiHead);
        this._gui.appendChild(this._guiBody);
 
        this._addButton(this._guiHead, this._title, () => {
            if (this._guiBody.style.display === 'block') {
                this._guiBody.style.display = 'none';
            } else {
                this._guiBody.style.display = 'block';
            }
        });
    }
    addButton(text, onclick, keyCode) {
        return this._addButton(this._guiBody, text, onclick, keyCode);
    }
    removeButton(button) {
        button.remove();
        button.active = false;
    }
    reset() {
        const head = this._buttons[0];
        this._buttons.forEach((x, i) => {
            if (i === 0) return;
            this.removeButton(x);
        });
        this._buttons = [head];
    }
    _addButton(parent, text, onclick, keyCode) {
        const button = document.createElement('button');
        button.innerHTML = text;
        button.keyCode = keyCode;
        button.onclick = onclick;
        button.style['background-color'] = this._colors[this._buttons.length % this._colors.length];
        button.addEventListener('contextmenu', (e) => e.preventDefault());
 
        parent.appendChild(button);
        this._buttons.push(button);
        return button;
    }
    _enableShortcuts() {
        document.addEventListener('keydown', (event) => {
            if (document.getElementById('textInputContainer').style.display === 'block') return;
            this._buttons.forEach((button) => {
                if (button.keyCode === event.code) button.onclick();
            });
        });
    }
}
class Minimap {
    constructor() {
        this._minimapWidth;
        this._minimapHeight;
        this._x00;
        this._y00;
        this._pointX;
        this._pointY;
        this._viewportWidth;
        this._viewportHeight;
 
        this._minimapHook();
        this._arrowHook();
    }
    get x() {
        return (this._pointX - this._x00) / this._minimapWidth;
    }
    get y() {
        return (this._pointY - this._y00) / this._minimapHeight;
    }
    _minimapHook() {
        let setTransformArgs;
 
        const onsetTransform = (args) => {
            if (args[0] === args[3]) setTransformArgs = args;
        };
        const onstrokeRect = () => {
            if (setTransformArgs) {
                this._minimapWidth = setTransformArgs[0];
                this._minimapHeight = setTransformArgs[3];
                this._x00 = setTransformArgs[4];
                this._y00 = setTransformArgs[5];
                setTransformArgs = undefined;
            }
        };
        this._ctxHook('setTransform', onsetTransform);
        this._ctxHook('strokeRect', onstrokeRect);
    }
    _arrowHook() {
        let index = 0;
        const stack = Array(4);
 
        let pointA;
        let pointB;
        let pointC;
 
        const calculatePos = () => {
            const side1 = ((pointA[0] - pointB[0]) ** 2 + (pointA[1] - pointB[1]) ** 2) ** 0.5;
            const side2 = ((pointA[0] - pointC[0]) ** 2 + (pointA[1] - pointC[1]) ** 2) ** 0.5;
            const side3 = ((pointB[0] - pointC[0]) ** 2 + (pointB[1] - pointC[1]) ** 2) ** 0.5;
            if (~~side1 == ~~side2 && ~~side2 == ~~side3) return;
 
            this._pointX = (pointA[0] + pointB[0] + pointC[0]) / 3;
            this._pointY = (pointA[1] + pointB[1] + pointC[1]) / 3;
        };
        const onbeginPath = () => {
            index = 0;
            stack[index++] = 0;
        };
        const onmoveTo = (args) => {
            if (index == 1 && stack[index - 1] == 0) {
                stack[index++] = 1;
                pointA = args;
                return;
            }
            index = 0;
        };
        const onlineTo = (args) => {
            if (index == 2 && stack[index - 1] == 1) {
                stack[index++] = 2;
                pointB = args;
                return;
            }
            if (index == 3 && stack[index - 1] == 2) {
                stack[index++] = 2;
                pointC = args;
                return;
            }
            index = 0;
        };
        const onfill = () => {
            if (index == 4 && stack[index - 1] == 2) {
                calculatePos();
                return;
            }
            index = 0;
        };
 
        this._ctxHook('beginPath', onbeginPath);
        this._ctxHook('moveTo', onmoveTo);
        this._ctxHook('lineTo', onlineTo);
        this._ctxHook('fill', onfill);
    }
    _ctxHook(method, callback) {
        const target = window.CanvasRenderingContext2D.prototype;
        target[method] = new Proxy(target[method], {
            apply(target, thisArg, args) {
                callback(args);
                return target.apply(thisArg, args);
            },
        });
    }
}
class Player {
    constructor() {
        this._minimap = new Minimap();
        this._mouse = { x: NaN, y: NaN };
    }
    get x() {
        return this._minimap.x;
    }
    get y() {
        return this._minimap.y;
    }
    goto(x, y) {
        const dX = x - this.x;
        const dY = y - this.y;
        const len = Math.sqrt(dX ** 2 + dY ** 2);
        if (dX > 0) {
            input.keyDown('68');
            input.keyUp('65');
        } else {
            input.keyDown('65');
            input.keyUp('68');
        }
        if (dY > 0) {
            input.keyDown('83');
            input.keyUp('87');
        } else {
            input.keyDown('87');
            input.keyUp('83');
        }
    }
}
/*
 *   H E L P E R   F U N C T I O N S
 */
function onbtnAfk() {
    this.active = !this.active;
    if (this.active) {
        this.x = player.x;
        this.y = player.y;
        this.innerHTML = 'AFK: ON';
    } else {
        input.keyUp('65');
        input.keyUp('68');
        input.keyUp('87');
        input.keyUp('83');
        this.innerHTML = 'AFK: OFF';
    }
}
function onbtnFreezeMouse() {
    this.active = !this.active;
    if (this.active) {
        this.innerHTML = 'Freeze Mouse: ON';
    } else {
        this.innerHTML = 'Freeze Mouse: OFF';
    }
}
function onbtnRepelNecro() {
    this.active = !this.active;
    if (this.active) {
        let repelTime = 25 * 1000;
        input.keyDown('16');
        this.repelInterval = setInterval(() => {
            input.keyDown('16');
            setTimeout(() => input.keyUp('16'), repelTime);
        }, 2 * repelTime + 1300);
        this.innerHTML = 'Repel Necro: ON';
    } else {
        clearInterval(this.repelInterval);
        input.keyUp('16');
        this.innerHTML = 'Repel Necro: OFF';
    }
}
function onbtnRepelOverlord() {
    this.active = !this.active;
    if (this.active) {
        let repelTime = 60 * 1000;
        input.keyDown('16');
        this.repelInterval = setInterval(() => {
            input.keyUp('16');
            setTimeout(() => input.keyDown('16'), 3000);
        }, repelTime);
        this.innerHTML = 'Repel Overlord: ON';
    } else {
        clearInterval(this.repelInterval);
        input.keyUp('16');
        this.innerHTML = 'Repel Overlord: OFF';
    }
}
function onbtnUpAndDown() {
    this.active = !this.active;
    if (this.active) {
        this.down = true;
        this.x = player.x;
        this.innerHTML = 'Up and Down: ON';
    } else {
        input.keyUp('65');
        input.keyUp('68');
        input.keyUp('87');
        input.keyUp('83');
        this.innerHTML = 'Up and Down: OFF';
    }
}
function onbtnDiscord() {
    window.open('https://discord.gg/5q2E3Sx');
}
/*
 *   M A I N
 */
const gui = new Gui('AFK by Cazka');
const player = new Player();
const input = new Input();
 
let btnAfk = gui.addButton('AFK: OFF', onbtnAfk, 'KeyQ');
let btnFreezeMouse = gui.addButton('Freeze Mouse: OFF', onbtnFreezeMouse, 'KeyG');
let btnRepelNecro = gui.addButton('Repel Necro: OFF', onbtnRepelNecro, 'KeyR');
let btnRepelOverlord = gui.addButton('Repel Overlord: OFF', onbtnRepelOverlord, 'KeyT');
let btnUpAndDown = gui.addButton('Up and Down: OFF', onbtnUpAndDown);
let btnDiscord = gui.addButton('Discord', onbtnDiscord);
 
unsafeWindow.requestAnimationFrame = new Proxy(unsafeWindow.requestAnimationFrame, {
    apply: function (target, thisArg, args) {
        if (btnAfk.active) player.goto(btnAfk.x, btnAfk.y);
        else if (btnUpAndDown.active) {
            if (btnUpAndDown.down) {
                player.goto(btnUpAndDown.x, 1);
                if (player.y >= 0.95) btnUpAndDown.down = false;
            } else {
                player.goto(btnUpAndDown.x, 0);
                if (player.y <= 1 - 0.95) btnUpAndDown.down = true;
            }
        }
        return target.apply(thisArg, args);
    },
});