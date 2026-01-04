// ==UserScript==
// @name         DiepBox by Cazka
// @description  made with much love
// @version      0.2.1
// @author       Cazka#1820
// @match        *://diep.io/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @license      MIT
// @namespace    https://greasyfork.org/users/541070
// @downloadURL https://update.greasyfork.org/scripts/423441/DiepBox%20by%20Cazka.user.js
// @updateURL https://update.greasyfork.org/scripts/423441/DiepBox%20by%20Cazka.meta.js
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
        this._notifications = [];

        this._title = title;
        this._gui;
        this._guiHead;
        this._guiBody;
        this._notificationBody;
        this._notificationColor = 0;

        this._init();
        this._enableShortcuts();
    }
    _init() {
        const nonce = `a${Math.floor(Math.random() * 1e5)}`;
        GM_addStyle(
            `.${nonce}{z-index:9999;}.${nonce} button{display:block;font-family:Ubuntu;color:#fff;text-shadow:-.1em -.1em 0 #000,0 -.1em 0 #000,.1em -.1em 0 #000,.1em 0 0 #000,.1em .1em 0 #000,0 .1em 0 #000,-.1em .1em 0 #000,-.1em 0 0 #000;opacity:.8;border:0;padding:.3em .5em;width:100%;transition:all .15s}.${nonce}{top:0;left:0;position:absolute}.${nonce} button:active:not([disabled]){filter:brightness(.9)}.${nonce} button:hover:not([disabled]):not(:active){filter:brightness(1.1)}`
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

        //Notification
        this._notificationBody = document.body.appendChild(document.createElement('div'));
        this._notificationBody.className = `${nonce}`;
        this._notificationBody.style.pointerEvents = 'none';
        this._notificationBody.style.position = 'absolute';
        this._notificationBody.style.zIndex = '99999';
        this._notificationBody.style.left = `${unsafeWindow.innerWidth / 3}px`;
        this._notificationBody.style.top = `${unsafeWindow.innerHeight / 20}px`;
        this._notificationBody.style.width = '33%';
        this._notificationBody.style.opacity = '0.70';
        unsafeWindow.addEventListener('resize', () => {
            this._notificationBody.style.left = `${unsafeWindow.innerWidth / 3}px`;
            this._notificationBody.style.top = `${unsafeWindow.innerHeight / 20}px`;
        });
    }

    addButton(text, onclick, keyCode) {
        return this._addButton(this._guiBody, text, onclick, keyCode);
    }

    notification(text, duration = 5000) {
        const button = document.createElement('button');
        button.innerText = text;
        button.style['background-color'] = this._colors[this._notificationColor++ % this._colors.length];
        button.style.display = 'block';
        button.addEventListener('contextmenu', (e) => e.preventDefault());

        this._notificationBody.appendChild(button);
        setTimeout(() => button.remove(), duration);
    }

    removeButton(button) {
        const index = this._buttons.findIndex((x) => x === button);
        if (index == -1) return;

        button.remove();
        button.active = false;

        this._buttons.splice(index, 1);
    }
    reset() {
        for (let i = 1, n = this._buttons.length; i < n; i++) {
            this.removeButton(this._buttons[1]);
        }
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
        unsafeWindow.addEventListener('keydown', (event) => {
            if (document.getElementById('textInputContainer').style.display === 'block') return;
            this._buttons.forEach((button) => {
                if (button.keyCode === event.code) button.onclick();
            });
        });
        // unsafeWindow.onkeydown = new Proxy(unsafeWindow.onkeydown, {
        //     apply: (target, thisArgs, args) => {
        //         if (document.getElementById('textInputContainer').style.display === 'block')
        //             return Reflect.apply(target, thisArgs, args);
        //         this._buttons.forEach((button) => {
        //             if (button.keyCode === event.code) button.onclick();
        //         });
        //         return Reflect.apply(target, thisArgs, args);
        //     },
        // });
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
        this._pointX_previous;
        this._pointY_previous;
        this._viewportWidth;
        this._viewportHeight;
        this._fov;

        this._minimapHook();
        this._arrowHook();
        this._viewportHook();
        this._fovHook();
    }
    get x() {
        return this._pointX ? (this._pointX - this._x00) / this._minimapWidth : 0;
    }
    get y() {
        return this._pointY ? (this._pointY - this._y00) / this._minimapHeight : 0;
    }
    get x_previous() {
        return this._pointX_previous ? (this._pointX_previous - this._x00) / this._minimapWidth : 0;
    }
    get y_previous() {
        return this._pointY_previous ? (this._pointY_previous - this._y00) / this._minimapHeight : 0;
    }
    get scale() {
        return {
            x: this._viewportWidth / this._minimapWidth,
            y: this._viewportHeight / this._minimapHeight,
        };
    }
    get fov() {
        return this._fov;
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
            const side1 = Math.floor(
                Math.sqrt(Math.pow(pointA[0] - pointB[0], 2) + Math.pow(pointA[1] - pointB[1], 2))
            );
            const side2 = Math.floor(
                Math.sqrt(Math.pow(pointA[0] - pointC[0], 2) + Math.pow(pointA[1] - pointC[1], 2))
            );
            const side3 = Math.floor(
                Math.sqrt(Math.pow(pointB[0] - pointC[0], 2) + Math.pow(pointB[1] - pointC[1], 2))
            );
            if (side1 == side2 && side2 == side3) return;

            this._pointX_previous = this._pointX;
            this._pointY_previous = this._pointY;

            this._pointX = (pointA[0] + pointB[0] + pointC[0]) / 3;
            this._pointY = (pointA[1] + pointB[1] + pointC[1]) / 3;
        };
        const onbeginPath = () => {
            index = 0;
            stack[index++] = 0;
        };
        const onmoveTo = (args) => {
            if (index === 1 && stack[index - 1] === 0) {
                stack[index++] = 1;
                pointA = args;
                return;
            }
            index = 0;
        };
        const onlineTo = (args) => {
            if (index === 2 && stack[index - 1] === 1) {
                stack[index++] = 2;
                pointB = args;
                return;
            }
            if (index === 3 && stack[index - 1] === 2) {
                stack[index++] = 2;
                pointC = args;
                return;
            }
            index = 0;
        };
        const onfill = () => {
            if (index === 4 && stack[index - 1] === 2) {
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
    _viewportHook() {
        let setTransformArgs;

        const onsetTransform = (args) => {
            if ((args[0] / args[3]).toFixed(4) !== (unsafeWindow.innerWidth / unsafeWindow.innerHeight).toFixed(4))
                return;
            if (args[0] >= unsafeWindow.innerWidth && args[3] >= unsafeWindow.innerHeight) return;

            setTransformArgs = args;
        };
        const onfillRect = () => {
            if (setTransformArgs) {
                unsafeWindow.input.set_convar('ren_minimap_viewport', false);
                this._viewportWidth = setTransformArgs[0];
                this._viewportHeight = setTransformArgs[3];
                setTransformArgs = undefined;
            }
        };

        this._ctxHook('setTransform', onsetTransform);
        this._ctxHook('fillRect', onfillRect);

        setTimeout(() => unsafeWindow.input.set_convar('ren_minimap_viewport', true), 1000);
        setInterval(() => {
            unsafeWindow.input.set_convar('ren_minimap_viewport', true);
        }, 1000);
    }
    _fovHook() {
        let solid_background = false;
        setTimeout(() => {
            solid_background = unsafeWindow.input.get_convar('ren_solid_background') === 'true' ? true : false;
        }, 1000);

        const calculateFov = (fov) => {
            this._fov = fov * 10;
        };
        function onstroke() {
            if (this.fillStyle === '#cccccc') {
                if (solid_background) unsafeWindow.input.set_convar('ren_solid_background', true);
                calculateFov(this.globalAlpha);
            }
        }

        this._ctxHook('stroke', onstroke);

        setInterval(() => {
            if (solid_background) unsafeWindow.input.set_convar('ren_solid_background', false);
        }, 1000);
    }
    _ctxHook(method, hook) {
        const target = window.CanvasRenderingContext2D.prototype;
        target[method] = new Proxy(target[method], {
            apply(target, thisArg, args) {
                args = hook.call(thisArg, args) || args;
                return target.apply(thisArg, args);
            },
        });
    }
}
class DiepGamepad {
    constructor() {
        this._axes = [0, 0, 0, 0];
        this._buttons = [...Array(17)].map((x) => {
            return { pressed: false };
        });
    }

    set x(value) {
        this._axes[0] = value;
    }
    set y(value) {
        this._axes[1] = value;
    }
    set mx(value) {
        this._axes[2] = value;
    }
    set my(value) {
        this._axes[3] = value;
    }
    set leftMouse(value) {
        this._buttons[7].pressed = value;
    }
    set rightMouse(value) {
        this._buttons[6].pressed = value;
    }
    set connected(value) {
        unsafeWindow.navigator.getGamepads = () => [value ? this.toGamepad() : undefined];
    }

    get x() {
        return this._axes[0];
    }
    get y() {
        return this._axes[1];
    }
    get mx() {
        return this._axes[2];
    }
    get my() {
        return this._axes[3];
    }
    get leftMouse() {
        return this._buttons[7].pressed;
    }
    get rightMouse() {
        return this._buttons[6].pressed;
    }
    get connected() {
        return unsafeWindow.navigator.getGamepads()[0] ? true : false;
    }

    toGamepad() {
        return {
            axes: this._axes,
            buttons: this._buttons,
            mapping: 'standard',
        };
    }
}
class Vector {
    static length({ x, y }) {
        return Math.sqrt(x ** 2 + y ** 2);
    }
    static add(u, v) {
        return {
            x: u.x + v.x,
            y: u.y + v.y,
        };
    }
    static subtract(u, v) {
        return {
            x: u.x - v.x,
            y: u.y - v.y,
        };
    }
    static scale(r, v) {
        return {
            x: r * v.x,
            y: r * v.y,
        };
    }
    static normalize(v) {
        return {
            x: v.x / Vector.length(v),
            y: v.y / Vector.length(v),
        };
    }
    static dot(u, v) {
        return u.x * v.x + u.y * v.y;
    }
    static distance(u, v) {
        return Vector.length(Vector.subtract(u, v));
    }
    static distanceLine(a, n, p) {
        const r = Vector.dot(n, Vector.subtract(a, p)) / -Vector.dot(n, n);
        const point = Vector.add(a, Vector.scale(r, n));
        const distance = Vector.distance(point, p);
        return {
            r,
            point,
            distance,
        };
    }
}
class Arena {
    static get BLOCKSIZE() {
        return 50;
    }
    static scale(x, y) {
        return {
            x: Math.floor(22300 * (x - 0.5) + 0.5),
            y: Math.floor(22300 * (y - 0.5) + 0.5),
        };
    }
    static unscale(x, y) {
        return {
            x: x / 22300 + 0.5,
            y: y / 22300 + 0.5,
        };
    }
}
class Player {
    constructor() {
        this._minimap = new Minimap();
        this._gamepad = new DiepGamepad();

        this._mouse = {
            x: 0,
            y: 0,
        };
        this._inputs = {
            left: false,
            down: false,
            up: false,
            right: false,
        };
        this._dead = true;

        unsafeWindow.addEventListener('mousemove', (e) => this._onmousemove(e));
        unsafeWindow.addEventListener('mousedown', (e) => this._onmousedown(e));
        unsafeWindow.addEventListener('mouseup', (e) => this._onmouseup(e));
        unsafeWindow.addEventListener('keydown', (e) => this._onkeydown(e));
        unsafeWindow.addEventListener('keyup', (e) => this._onkeyup(e));
        //Dead Listener
        setInterval(() => {
            if(!unsafeWindow.input) return;
            const isDead = document.getElementById('dimmer')?.dataset.isActive === 'true';
            if (this._dead == isDead) return;
            this._dead = isDead;

            if (this._dead) this.ondead();
            //else this.onspawn();
        }, 20);
        //Message Listener
        const notify = (text) => {
            if (this.onmessage) this.onmessage(text);
        };
        CanvasRenderingContext2D.prototype.fillText = new Proxy(CanvasRenderingContext2D.prototype.fillText, {
            apply(target, thisArg, args) {
                if (args[0].startsWith("You've killed ")) {
                    notify(args[0]);
                }
                return Reflect.apply(target, thisArg, args);
            },
        });
    }

    set useGamepad(value) {
        this._gamepad.connected = value;
    }

    get position() {
        const position = Arena.scale(this._minimap.x, this._minimap.y);
        const previous = Arena.scale(this._minimap.x_previous, this._minimap.y_previous);
        return {
            x: position.x,
            y: position.y,
            x_previous: previous.x,
            y_previous: previous.y,
        };
    }
    get mouse() {
        return this.toArenaPos(this._mouse.x, this._mouse.y);
    }
    get inputs() {
        return this._inputs;
    }
    get dead() {
        return this._dead;
    }

    get gamemode() {
        return unsafeWindow.localStorage.gamemode;
    }

    keyDown(key) {
        input.keyDown(key);
        this._onkeydown({ keyCode: key });
    }
    keyUp(key) {
        input.keyUp(key);
        this._onkeyup({ keyCode: key });
    }
    spawn(name) {
        if (!this.dead) return;

        if (name !== undefined) {
            document.getElementById('textInput').value = name;
        }

        this.keyDown(13);
        this.keyUp(13);

        setTimeout(() => {
            if (document.getElementById('textInputContainer').style.display === 'none') return;
            this.keyDown(13);
            this.keyUp(13);
        }, 300);
    }
    toScreenPos(x, y) {
        const position = this.position;

        const directionX = x - position.x;
        const directionY = y - position.y;

        const scaledX = Math.round(directionX * this._minimap.fov);
        const scaledY = Math.round(directionY * this._minimap.fov);

        const screenX = scaledX + window.innerWidth / 2;
        const screenY = scaledY + window.innerHeight / 2;

        return { x: screenX, y: screenY };
    }
    toArenaPos(x, y) {
        const position = this.position;

        const directionX = x - window.innerWidth / 2;
        const directionY = y - window.innerHeight / 2;

        const scaledX = Math.round(directionX * 1/this._minimap.fov);
        const scaledY = Math.round(directionY * 1/this._minimap.fov);

        const arenaX = scaledX + position.x;
        const arenaY = scaledY + position.y;

        return { x: arenaX, y: arenaY };
    }
    moveTo(x, y) {
        const position = this.position;

        const deltaX = x - position.x;
        const deltaY = y - position.y;
        const length = Vector.length({ x: deltaX, y: deltaY });

        if (length === 0) {
            this._gamepad.x = 0;
            this._gamepad.y = 0;
            return;
        }

        //max speed
        x = deltaX / length;
        y = deltaY / length;

        this._gamepad.x = x;
        this._gamepad.y = y;
    }
    lookAt(x, y) {
        const position = this.position;

        const a = window.innerHeight / 1080;
        const b = window.innerWidth / 1920;
        const c = b < a ? a : b;

        let x_axes = (((x - position.x) / c) * this._minimap.fov) / 1200 / 1.1;
        let y_axes = (((y - position.y) / c) * this._minimap.fov) / 1200 / 1.1;

        const length = Vector.length({ x: x_axes, y: y_axes });

        if (length != 0 && length < 0.1) {
            x_axes *= 0.11 / length;
            y_axes *= 0.11 / length;
        }

        this._gamepad.mx = x_axes;
        this._gamepad.my = y_axes;
    }
    findBestPos(targetPosition, inputs) {
        const TOLERANCE = 200;
        //Strategies:
        //(1) Dont move to target if to close [removed]
        //(2) copy movement vector if to close [removed]
        //(3) predict future position
        //(4) make way when target moves to my direction
        //(5) dont do (2). create new vector through player inputs instead. this makes better predictions.
        const me = this.position;
        const target = {
            x: targetPosition.x,
            y: targetPosition.y,
            x_previous: targetPosition.x_previous,
            y_previous: targetPosition.y_previous,
        };

        const distance = Vector.distance(me, target);

        const targetVector = Vector.subtract(
            { x: target.x, y: target.y },
            { x: target.x_previous, y: target.y_previous }
        );

        // (4)
        if (distance < 4 * TOLERANCE && Vector.length(targetVector) > 2) {
            const { r, point, distance } = Vector.distanceLine(target, targetVector, me);

            if (distance < 75 && r > 0) {
                return Vector.add(me, Vector.subtract(me, point));
            }
        }
        // (5)
        if (distance < TOLERANCE) {
            let x = inputs.left ? -1 : 0;
            x += inputs.right ? 1 : 0;
            let y = inputs.up ? -1 : 0;
            y += inputs.down ? 1 : 0;
            return Vector.add(me, { x, y });
        }

        // (3)
        return Vector.add(target, Vector.scale(50, targetVector));
    }
    _onmousemove(e) {
        if (DEBUG) console.log('player onmousemove', e.clientX, e.clientY);
        this._mouse.x = e.clientX;
        this._mouse.y = e.clientY;
    }
    _onmousedown(e) {
        if (DEBUG) console.log('player onmousedown', e.which);
        this.onkeyDown && this.onkeyDown(e.which);
    }
    _onmouseup(e) {
        if (DEBUG) console.log('player onmouseup', e.which);
        this.onkeyUp && this.onkeyUp(e.which);
    }
    _onkeydown(e) {
        if (DEBUG) console.log('player onkeydown', e.keyCode);
        switch (e.keyCode) {
            case 37:
            case 65:
                this._inputs.left = true;
                break;
            case 40:
            case 83:
                this._inputs.down = true;
                break;
            case 38:
            case 87:
                this._inputs.up = true;
                break;
            case 39:
            case 68:
                this._inputs.right = true;
                break;
            case 1:
            case 32:
                this._gamepad.leftMouse = true;
                break;
            case 3:
            case 16:
                this._gamepad.rightMouse = true;
                break;
        }

        this.onkeyDown && this.onkeyDown(e.keyCode);
    }
    _onkeyup(e) {
        if (DEBUG) console.log('player onkeyup', e.keyCode);
        switch (e.keyCode) {
            case 37:
            case 65:
                this._inputs.left = false;
                break;
            case 40:
            case 83:
                this._inputs.down = false;
                break;
            case 38:
            case 87:
                this._inputs.up = false;
                break;
            case 39:
            case 68:
                this._inputs.right = false;
                break;
            case 1:
            case 32:
                this._gamepad.leftMouse = false;
                break;
            case 3:
            case 16:
                this._gamepad.rightMouse = false;
                break;
        }

        this.onkeyUp && this.onkeyUp(e.keyCode);
    }
}
class MultiboxStorage {
    /*
     * items in storage:
     * position: [x, y, x_previous, y_previous]
     * mouse: [x,y]
     * mutex: boolean
     * multibox: boolean
     * keyDown: Number
     * keyUp: Number
     * clumpMode: String
     * inputs: [left, down, up, right]
     */
    constructor() {
        //if the user launches this script for the first time
        try {
            this.position;
            this.mouse;
            this.multibox;
            this.mutex;
            this.keyDown;
            this.keyUp;
            this.clumpMode;
            this.inputs;
            this.notification;
        } catch (err) {
            console.log('DiepBox Error: MultiboxStorage needs to be initialized');
            this.reset();
        }
    }

    set position(position) {
        GM_setValue('position', [position.x, position.y, position.x_previous, position.y_previous]);
    }
    set mouse(mouse) {
        GM_setValue('mouse', [mouse.x, mouse.y]);
    }
    set mutex(mutex) {
        GM_setValue('mutex', mutex ? 1 : 0);
    }
    set multibox(multibox) {
        GM_setValue('multibox', multibox ? 1 : 0);
    }
    set keyDown(key) {
        GM_setValue('keyDown', key);
    }
    set keyUp(key) {
        GM_setValue('keyUp', key);
    }
    set clumpMode(mode) {
        let m = 0;
        switch (mode) {
            case 'player':
                m = 0;
                break;
            case 'mouse':
                m = 1;
                break;
            case 'shield':
                m = 2;
                break;
            case 'off':
                m = 3;
                break;
            default:
                throw new Error('unsupported clump mode', mode);
        }
        GM_setValue('clumpMode', m);
    }
    set inputs(inputs) {
        GM_setValue('inputs', [inputs.left, inputs.down, inputs.up, inputs.right]);
    }
    set notification(text) {
        GM_setValue('notification', text);
    }

    get position() {
        const position = GM_getValue('position');
        return {
            x: position[0],
            y: position[1],
            x_previous: position[2],
            y_previous: position[3],
        };
    }
    get mouse() {
        const mouse = GM_getValue('mouse');
        return {
            x: mouse[0],
            y: mouse[1],
        };
    }
    get mutex() {
        const mutex = GM_getValue('mutex');
        return mutex === 1 ? true : false;
    }
    get multibox() {
        const multibox = GM_getValue('multibox');
        return multibox === 1 ? true : false;
    }
    get keyDown() {
        return GM_getValue('keyDown');
    }
    get keyUp() {
        return GM_getValue('keyUp');
    }
    get clumpMode() {
        const m = GM_getValue('clumpMode');
        let mode = '';
        switch (m) {
            case 0:
                mode = 'player';
                break;
            case 1:
                mode = 'mouse';
                break;
            case 2:
                mode = 'shield';
                break;
            case 3:
                mode = 'off';
                break;
            default:
                throw new Error('unsupported clump mode', m);
        }
        return mode;
    }
    get inputs() {
        const inputs = GM_getValue('inputs');
        return {
            left: inputs[0],
            down: inputs[1],
            up: inputs[2],
            right: inputs[3],
        };
    }
    get notification() {
        return GM_getValue('notification');
    }

    reset() {
        this.position = { x: 0, y: 0, x_previous: 0, y_previous: 0 };
        this.mouse = { x: 0, y: 0 };
        this.mutex = false;
        this.multibox = false;
        this.keyDown = -1;
        this.keyUp = -1;
        this.clumpMode = 'player';
        this.inputs = { left: false, down: false, up: false, right: false };
        this.notification = '';
    }
    on(name, cb) {
        return GM_addValueChangeListener(name, cb);
    }
    once(name, cb) {
        const id = GM_addValueChangeListener(name, (...args) => {
            cb(...args);
            this.off(id);
        });
    }
    off(id) {
        GM_removeValueChangeListener(id);
    }
}

/*
 *   D E B U G G E R
 */
const DEBUG = false;
const debugger_mouse = document.body.appendChild(document.createElement('div'));
function DEBUG_MousePosition(x, y, info = '') {
    if (!DEBUG) return;
    debugger_mouse.style.pointerEvents = 'none';
    debugger_mouse.style.position = 'absolute';
    debugger_mouse.style.zIndex = '99999';
    debugger_mouse.style.left = `${x - 5}px`;
    debugger_mouse.style.top = `${y - 2}px`;
    debugger_mouse.innerText = '👆 ' + info;
}
const debugger_pos = document.body.appendChild(document.createElement('div'));
const debugger_pos_prediction = document.body.appendChild(document.createElement('div'));
function DEBUG_PlayerPosition(x = -100, y = -100, x_prediction = -100, y_prediction = -100, info = '') {
    if (!DEBUG) return;
    debugger_pos.style.pointerEvents = 'none';
    debugger_pos.style.position = 'absolute';
    debugger_pos.style.zIndex = '99999';
    debugger_pos.style.left = `${x - 11}px`;
    debugger_pos.style.top = `${y - 12}px`;
    debugger_pos.innerText = '🟢 ' + info;

    debugger_pos_prediction.style.pointerEvents = 'none';
    debugger_pos_prediction.style.position = 'absolute';
    debugger_pos_prediction.style.zIndex = '99999';
    debugger_pos_prediction.style.left = `${x_prediction - 11}px`;
    debugger_pos_prediction.style.top = `${y_prediction - 12}px`;
    debugger_pos_prediction.innerText = '🔵';
}
/*
 *   H E L P E R   F U N C T I O N S
 */
function onbtnMultibox() {
    this.active = !this.active;
    if (this.active) {
        storage.multibox = true;
        this.innerHTML = 'Multiboxing: ON';
    } else {
        storage.multibox = false;
        this.innerHTML = 'Multiboxing: OFF';
    }
}
function onbtnAfk() {
    this.active = !this.active;
    if (this.active) {
        player.useGamepad = true;
        this.position = player.position;
        this.mouse = player.mouse;
        this.innerHTML = 'AFK: ON';
    } else {
        player.useGamepad = false;
        this.innerHTML = 'AFK: OFF';
    }
}
function onbtnToggleClump() {
    this.mode = this.mode || 0;
    this.mode = (this.mode + 1) % 4;
    switch (this.mode) {
        case 0:
            storage.clumpMode = 'player';
            this.innerHTML = 'Clump: Player';
            break;
        case 1:
            storage.clumpMode = 'mouse';
            this.innerHTML = 'Clump: Mouse';
            break;
        case 2:
            storage.clumpMode = 'shield';
            this.innerHTML = 'Clump: Shield';
            break;
        case 3:
            storage.clumpMode = 'off';
            this.innerHTML = 'Clump: OFF';
            break;
    }
}
function onbtnDiscord() {
    window.open('https://discord.gg/5q2E3Sx');
}

function smallBoi() {
    player.isMaster = false;
    player.useGamepad = storage.multibox;

    const multiboxListener = storage.on('multibox', (name, old_value, new_value, remote) => {
        player.useGamepad = new_value;
    });
    const keyDownListener = storage.on('keyDown', (name, old_value, new_value, remote) => {
        if ([-1, 65, 83, 87, 68, 37, 40, 38, 39].includes(new_value)) return;

        if (DEBUG) console.log('master keyDown', new_value);

        if (storage.multibox) {
            if ([1, 32].includes(new_value)) player._gamepad.leftMouse = true;
            else if ([3, 16].includes(new_value)) player._gamepad.rightMouse = true;

            player.keyDown(new_value);
        }
    });
    const keyUpListener = storage.on('keyUp', (name, old_value, new_value, remote) => {
        if ([-1, 65, 83, 87, 68, 37, 40, 38, 39].includes(new_value)) return;

        if (DEBUG) console.log('master keyUp', new_value);

        if (storage.multibox) {
            if ([1, 32].includes(new_value)) player._gamepad.leftMouse = false;
            else if ([3, 16].includes(new_value)) player._gamepad.rightMouse = false;

            player.keyUp(new_value);
        }
    });

    btnForceMaster = gui.addButton('Unlock this tab', () => {
        storage.reset();
        storage.off(multiboxListener);
        storage.off(keyDownListener);
        storage.off(keyUpListener);

        gui.reset();

        bigBoi();
    });
}
function bigBoi() {
    player.isMaster = true;
    storage.mutex = true;
    storage.clumpMode = 'player';

    const notificationListener = storage.on('notification', (name, old_value, new_value, remote) => {
        gui.notification(new_value);
    });

    storage.once('mutex', (name, old_value, new_value, remote) => {
        if (!new_value) {
            storage.off(notificationListener);

            gui.reset();

            smallBoi();
        }
    });

    btnMultibox = gui.addButton('Multiboxing: OFF', onbtnMultibox, 'KeyF');
    btnAfk = gui.addButton('AFK: OFF', onbtnAfk, 'KeyQ');
    btnToggleClump = gui.addButton('Clump: Player', onbtnToggleClump, 'KeyP');
    btnDiscord = gui.addButton('Discord', onbtnDiscord);
}
function mainLoop() {
    if (!unsafeWindow.input) return;

    if (player.isMaster) {
        storage.position = player.position;
        storage.inputs = player.inputs;

        if (!btnAfk.active) storage.mouse = player.mouse;

        if (btnAfk.active) {
            if (Vector.distance(btnAfk.position, player.position) > 50) {
                player.moveTo(btnAfk.position.x, btnAfk.position.y);
            } else {
                player.moveTo(player.position.x, player.position.y);
            }
            player.lookAt(btnAfk.mouse.x, btnAfk.mouse.y);
        }
    } else {
        const clumpMode = storage.clumpMode;
        const mouse = storage.mouse;
        let position;
        let bestPosition;

        switch (clumpMode) {
            case 'player':
                position = storage.position;
                bestPosition = player.findBestPos(position, storage.inputs);
                break;
            case 'mouse':
                position = mouse;
                bestPosition = position;
                break;
            case 'shield':
                position = Vector.add(
                    storage.position,
                    Vector.scale(200, Vector.normalize(Vector.subtract(mouse, storage.position)))
                );
                bestPosition = position;
                break;
            case 'off':
                position = player.position;
                bestPosition = position;
                break;
            default:
                throw new Error('Unsupported clumpMode', clumpMode);
                break;
        }

        if (storage.multibox) {
            player.moveTo(bestPosition.x, bestPosition.y);
            player.lookAt(mouse.x, mouse.y);
            //player.spawn();
        }

        //Debugging
        const mouseScreen = player.toScreenPos(mouse.x, mouse.y);
        DEBUG_MousePosition(mouseScreen.x, mouseScreen.y, `(${mouse.x}, ${mouse.y})`);

        const playerScreen = player.toScreenPos(position.x, position.y);
        const bestPositionScreen = player.toScreenPos(bestPosition.x, bestPosition.y);
        DEBUG_PlayerPosition(
            playerScreen.x,
            playerScreen.y,
            bestPositionScreen.x,
            bestPositionScreen.y,
            `(${bestPosition.x}, ${bestPosition.y})`
        );
    }
}

/*
 *   M A I N
 */
const gui = new Gui('DiepBox by Cazka');
const player = new Player();
const storage = new MultiboxStorage();
const input = new Input();

let btnForceMaster;
let btnMultibox;
let btnToggleClump;
let btnAfk;
let btnDiscord;

if (storage.mutex) {
    smallBoi();
}
else {
    bigBoi();
}

unsafeWindow.addEventListener('unload', () => {
    if (player.isMaster) {
        storage.reset();
    }
});

player.onkeyDown = (key) => {
    if (player.isMaster) {
        storage.keyDown = key;
        storage.keyDown = -1;
    }
};
player.onkeyUp = (key) => {
    if (player.isMaster) {
        storage.keyUp = key;
        storage.keyUp = -1;
    }
};

player.onmessage = (text) => {
    if (!player.isMaster) {
        storage.notification = text;
    }
};

unsafeWindow.addEventListener('keydown', (e) => {
    if (!player.isMaster && e.keyCode == 13) {
        const input = document.getElementById('textInput');
        input.value = input.value.startsWith('\u0044\u0042') ? input.value : '\u0044\u0042 ' + input.value;
    }
});

//setup canvas
const ctx = document.getElementById('canvas').getContext('2d');

// run main Loop
// bots dont need high FPS
const BOT_FPS = 20;

unsafeWindow.requestAnimationFrame = new Proxy(unsafeWindow.requestAnimationFrame, {
    apply: function (target, thisArg, args) {
        mainLoop();
        if (player.isMaster) return Reflect.apply(target, thisArg, args);
        else setTimeout(() => Reflect.apply(target, thisArg, args), 1000 / BOT_FPS);
    },
});
