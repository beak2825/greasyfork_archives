// ==UserScript==
// @name         Diep.io+ (fixed Destroyer Cooldown & Anti aim)
// @namespace    http://tampermonkey.net/
// @version      2.4.1
// @description  work in progress...
// @author       r!PsAw
// @match        https://diep.io/*
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFMDAvSZe2hsFwAIeAPcDSNx8X2lUMp-rLPA&s
// @grant        none
// @license      Mi300 don't steal my scripts ;)
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/502774/Diepio%2B%20%28fixed%20Destroyer%20Cooldown%20%20Anti%20aim%29.user.js
// @updateURL https://update.greasyfork.org/scripts/502774/Diepio%2B%20%28fixed%20Destroyer%20Cooldown%20%20Anti%20aim%29.meta.js
// ==/UserScript==

/*
let's keep things structured this time :P

0. Defined constants & Variables
  0.1 general information
  0.2 inputs information
  0.3 mouse functions
  0.4 diep keys
  0.5 dimensions
1. HOOKS & PROXIES
  1.1 access Objects with useful client sided functions
  1.2 Self made proxy manager
  1.3 Mouse Proxy
2. GUI
  2.1 script Interface & logic
  2.2 define debug Modules
  2.3 remove annoying html elements
  2.4 personal best
  2.5 handle diep console
3. Main Logic
  3.1 Link Element
  3.2 Anti Aim
  3.3 Auto Respawn
4. Canvas display
  4.0 ctx helper functions
  4.1 destroyer cooldown visualiser
  4.999 canvas gui (try to keep this in the end)

999. update player values
*/

//0. Defined constants & Variables

//0.1 general information
let player = {
    connected: false,
    inGame: false,
    name: '',
    team: null,
    gamemode: null,
    ui_scale: 1,
}

/*
What is this?
This objects saves pointers to ingame functions from diep.io.
It allows you to replace the pointer instead of replacing the function
everywhere, where it was used.

names Explanation:

inputs handler recieves some event and passes it into the handler function
inputs simulator doesn't recieve the event, but simulates it
state getter is reading states
state setter is changing states
*/

let predefined_functions = {
    inputs_handler: {
        mouse: {
            move: null,
        },
        player: {
            spawn: null,
        },
    },
    inputs_simulator: {
        mouse: {
            move: null,
            click: null,
            unclick: null,
        },
        keys: {
            press: null,
            unpress: null,
        },
    },
    state_getter: {
        wasm_communicator: {
            doesHaveTank: null,
        },
    },
    diep_console: {
        execute: null,
        set_convar: null,
        get_convar: null,
    },
    test: {
        always_null: null
    }
}

window.pf = predefined_functions;

var killer_names = localStorage.getItem("[Diep.io+] saved names") ? JSON.parse(localStorage.getItem("[Diep.io+] saved names")) : ['r!PsAw', 'TestTank'];
function import_killer_names(){
    let imported_string = prompt('Paste killer names here: ', '["name1", "name2", "name3"]');
    killer_names = killer_names.concat(JSON.parse(imported_string));
    killer_names = [...new Set(killer_names)];
    localStorage.setItem("[Diep.io+] saved names", JSON.stringify(killer_names));
}

//0.2 inputs information
let inputs = {
    mouse: {
        real: {
            x: 0,
            y: 0,
        },
        game: {
            x: 0,
            y: 0,
        },
        force: {
            x: 0,
            y: 0,
        },
        isForced: false, //input mouse operations flag (overwrites your inputs to forced one's)
        isFrozen: false, //Mouse Freeze flag
        isShooting: false, //Anti Aim flag
        isPaused: false, //Anti Aim flag (different from isFrozen & isForced for better readability)
    },
    moving_game: {
        KeyW: false,
        KeyA: false,
        KeyS: false,
        KeyD: false,
        ArrowUp: false,
        ArrowRight: false,
        ArrowDown: false,
        ArrowLeft: false,
    },
    moving_real: {
        KeyW: false,
        KeyA: false,
        KeyS: false,
        KeyD: false,
        ArrowUp: false,
        ArrowRight: false,
        ArrowDown: false,
        ArrowLeft: false,
    },
    keys_pressed: [],
};

//0.3 mouse functions
function m_event(type, ...args) {
    if(!!predefined_functions.inputs_simulator.mouse[type]){
        predefined_functions.inputs_simulator.mouse[type](...args);
    }else{
        console.log('m_event cancelled, function was not defined yet');
    }
}

function click_at(x, y, time = 100){
    m_event('click', -1, x, y);
    setTimeout(() => {
        m_event('unclick', -1, x, y);
    }, time);
}

function apply_force(x, y) {
    inputs.mouse.force = {
        x: x,
        y: y,
    }
    inputs.mouse.isForced = true;
}

function disable_force() {
    inputs.mouse.isForced = false;
}

//0.4 diep keys

//Key numbers for pressing or unpressing them (copied from source code)
let diepKeys = {
    KeyA: 65,
    KeyB: 66,
    KeyC: 67,
    KeyD: 68,
    KeyE: 69,
    KeyF: 70,
    KeyG: 71,
    KeyH: 72,
    KeyI: 73,
    KeyJ: 74,
    KeyK: 75,
    KeyL: 76,
    KeyM: 77,
    KeyN: 78,
    KeyO: 79,
    KeyP: 80,
    KeyQ: 81,
    KeyR: 82,
    KeyS: 83,
    KeyT: 84,
    KeyU: 85,
    KeyV: 86,
    KeyW: 87,
    KeyX: 88,
    KeyY: 89,
    KeyZ: 90,
    Digit0: 48,
    Digit1: 49,
    Digit2: 50,
    Digit3: 51,
    Digit4: 52,
    Digit5: 53,
    Digit6: 54,
    Digit7: 55,
    Digit8: 56,
    Digit9: 57,
    Numpad0: 96,
    Numpad1: 97,
    Numpad2: 98,
    Numpad3: 99,
    Numpad4: 100,
    Numpad5: 101,
    Numpad6: 102,
    Numpad7: 103,
    Numpad8: 104,
    Numpad9: 105,
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123,
    Space: 32,
    Enter: 13,
    Tab: 9,
    Escape: 27,
    Backspace: 8,
    Delete: 46,
    Insert: 45,
    Home: 36,
    End: 35,
    PageUp: 33,
    PageDown: 34,
    ArrowUp: 38,
    ArrowDown: 40,
    ArrowLeft: 37,
    ArrowRight: 39,
    ShiftLeft: 16,
    ShiftRight: 16,
    ControlLeft: 17,
    ControlRight: 17,
    AltLeft: 18,
    AltRight: 18,
    MetaLeft: 91,
    MetaRight: 93,
    CapsLock: 20,
    NumLock: 144,
    ScrollLock: 145,
    Semicolon: 186,
    Equal: 187,
    Comma: 188,
    Minus: 189,
    Period: 190,
    Slash: 191,
    Backquote: 192,
    BracketLeft: 219,
    Backslash: 220,
    BracketRight: 221,
    Quote: 222
}

//0.5 dimensions

function windowScaling() {
  const a = window.innerHeight / 1080;
  const b = window.innerWidth / 1920;
  return b < a ? a : b;
}

class dimensions_converter {
    constructor() {
        this.scalingFactor = null; //undetectable without bypass
        this.fieldFactor = null; //undetectable without bypass
    }
    canvas_2_window(a) {
        let b = a / (window.canvas.width / window.innerWidth);
        return b;
    }

    window_2_canvas(a) {
        let b = a * (window.canvas.width / window.innerWidth);
        return b;
    }

    windowScaling_2_window(a) {
        let b = (this.windowScaling_2_canvas(a)) / (window.canvas.width / window.innerWidth);
        return b;
    }

    windowScaling_2_canvas(a) {
        let b = a * windowScaling();
        return b;
    }
/* DISABLED FOR NOW
    diepUnits_2_canvas(a) {
        let b = a / scalingFactor;
        return b;
    }

    diepUnits_2_window(a) {
        let b = (this.diepUnits_2_canvas(a)) / (canvas.width / window.innerWidth);
        return b;
    }

    window_2_diepUnits(a) {
        let b = (this.canvas_2_diepUnits(a)) * (canvas.width / window.innerWidth);
        return b;
    }

    canvas_2_diepUnits(a) {
        let b = a * this.scalingFactor;
        return b;
    }
*/

    window_2_windowScaling(a) {
        let b = (this.canvas_2_windowScaling(a)) * (canvas.width / window.innerWidth) * player.ui_scale;
        return b;
    }

    canvas_2_windowScaling(a) {
        let b = a * windowScaling();
        return b;
    }
/* DISABLED FOR NOW
    diepUnits_2_windowScaling(a) {
        let b = (this.diepUnits_2_canvas(a)) * this.fieldFactor;
        return b;
    }

    windowScaling_2_diepUntis(a) {
        let b = (a / this.fieldFactor) * this.scalingFactor;
        return b;
    }
*/
}

let dim_c = new dimensions_converter();

//1. HOOKS & PROXIES

//1.1 access Objects with useful client sided functions
function define_pf(obj, prop, path_arr){
    //console.log('define_pf was called');
    if(!obj[prop]) return console.warn(`${obj} [ ${prop} ] does not exist`, Object.keys(obj).length);
    //console.log('passed 1 check');
    let target = predefined_functions;
    let target_key = path_arr[path_arr.length-1];
    for(let i = 0; i < path_arr.length-1; i++){
        if(target[path_arr[i]]){
            target = target[path_arr[i]];
        }else{
            return console.warn(`${target} [ ${path_arr[i]} ] in define_pf() doesn't exist, quitting...`);
        }
    }
    //console.log('passed 2 check');
    if(!target_key in target) return console.warn(`${target} [ ${target_key} ] in define_pf() doesn't exist, quitting...`);
    //console.log('passed 3 check');
    target[target_key] = obj[prop];
}

const mapN = {
    _on_touch_start: '_on_touch_start',
    _on_touch_end: '_on_touch_end',
    _set_mouse_pos: '_set_mouse_pos',
    _set_key_down: '_set_key_down',
    _set_key_up: '_set_key_up',
    _has_tank: '_has_tank',
};
//spawn _cpp__oe960b366917 $ka
//move mouse? _cpp__o0e188399ce9 $ma

function define_pf_for_N(){
    if(!window.N) return console.warn('%cwindow.N was not defined, quitting define_pf_for_N()...', 'color: red');
    const obj = window.N;
    if(Object.keys(obj).length != 51) return setTimeout(define_pf_for_N, 100); //we hook into N before all keys are defined, that's why we need to wait here
    define_pf(obj, mapN._on_touch_start, ['inputs_simulator', 'mouse', 'click']);
    define_pf(obj, mapN._on_touch_end, ['inputs_simulator', 'mouse', 'unclick']);
    define_pf(obj, mapN._set_mouse_pos, ['inputs_simulator', 'mouse', 'move']);
    define_pf(obj, mapN._set_key_down, ['inputs_simulator', 'keys', 'press']);
    define_pf(obj, mapN._set_key_up, ['inputs_simulator', 'keys', 'unpress']);
    define_pf(obj, mapN._has_tank, ['state_getter', 'wasm_communicator', 'doesHaveTank']);
}

function define_pf_for_n(){
    if(!window.n) return console.warn('%cwindow.n was not defined, quitting define_pf_for_n()...', 'color: red');
    const obj = window.n;
    define_pf(obj, 'set_mouse_pos', ['inputs_handler', 'mouse', 'move']);
    define_pf(obj, 'spawn_player', ['inputs_handler', 'player', 'spawn']);
}

const prop = '_cp5_destroy';
Object.defineProperty(Object.prototype, prop, {
    get: function(){
        return undefined
    },
    set: function(new_val){
        if(this.pauseMainLoop){
            window.N = this;
            define_pf_for_N(); //automatically fills up everything inside predefined_functions
            console.log('N found! Deleting Object hook for N...');
            delete Object.prototype[prop]
            //not required but nice to have for debugging
            if(!(prop in Object.prototype) && !(prop in {})){
                console.log('%cN Object hook successfully deleted!', 'color: green');
            }else{
                console.warn('N Object hook was not removed, despite N being found! Checking cases...');
                let msg = [prop in Object.prototype, prop in {}];
                msg[0]? console.log('%cObject.prototype still has _cp5_destroy', 'color: red') : null;
                msg[1]? console.log('%cnew created Object still has _cp5_destroy', 'color: red') : null;
            }
        }
    },
    configurable: true,
});

const prop2 = 'grant_reward';
Object.defineProperty(Object.prototype, prop2, {
    get: function() {
        return undefined
    },
    set: function(new_val) {
        if (this.spawn_player) {
            window.n = this;
            define_pf_for_n(); //automatically fills up everything inside predefined_functions
            console.log('n found! Deleting Object hook for n...');
            delete Object.prototype[prop2]
            //not required but nice to have for debugging
            if (!(prop2 in Object.prototype) && !(prop2 in {})) {
                console.log('%cn Object hook successfully deleted!', 'color: green');
            } else {
                console.warn('n Object hook was not removed, despite n being found! Checking cases...');
                let msg = [prop2 in Object.prototype, prop2 in {}];
                msg[0] ? console.log('%cObject.prototype still has grant_reward', 'color: red') : null;
                msg[1] ? console.log('%cnew created Object still has grant_reward', 'color: red') : null;
            }
        }
    },
    configurable: true,
});

function await_input(){
    if(!window.input){
        return setTimeout(await_input, 100);
    }else{
        predefined_functions.diep_console = window.input;
    }
}
await_input();

//1.2 Self made proxy manager
function get_ap(){
    if(!window.active_proxies){
        let temp = new WeakMap();
        window.active_proxies = temp;
    }
    return window.active_proxies;
}

let active_proxies = get_ap();

const default_handler ={
    apply: function(target, thisArgs, args){
        console.log(`
        target: ${target}
        thisArgs: ${thisArgs}
        args: ${args}
        `);
        return Reflect.apply(target, thisArgs, args);
    }
}

class func_proxy{
    constructor(obj, prop, handler = default_handler){
        if(typeof obj != 'object') throw new Error(`${obj} is not an Object`);
        if(typeof obj[prop] != 'function') throw new Error(`${obj}.${prop} is not a function`);
        if(typeof handler != 'object') throw new Error(`${handler} is not an Object`);
        const func_proxy_used_methods = [
            {obj: WeakMap, prop: 'has'},
            {obj: WeakMap, prop: 'get'},
            {obj: WeakMap, prop: 'set'},
            {obj: Set, prop: 'add'},
            {obj: console, prop: 'warn'},
        ];
        for(let i = 0; i < func_proxy_used_methods.length; i++){
            let temp = func_proxy_used_methods[i];
            if((temp.obj === obj || temp.obj.prototype === obj) && temp.prop === prop){
                console.warn(`Notice, that ${temp.obj}.${temp.prop} is being used by func_proxy! Continuing...`);
                break
            }
        }
        this.original = obj[prop];
        this.obj = obj;
        this.prop = prop;
        this.handler = handler;
        this.active = false;
    }
    proxy_exists(){
        return active_proxies.has(this.obj) && active_proxies.get(this.obj).has(this.prop);
    }
    start(){
        if(!this.proxy_exists()){
            this.obj[this.prop] = new Proxy(this.obj[this.prop], this.handler);
            this.active = true;
            let temp;
            if(active_proxies.has(this.obj)){
                temp = active_proxies.get(this.obj);
            }else{
                temp = new Set();
            }
            temp.add(this.prop);
            active_proxies.set(this.obj, temp);
        }else{
            console.warn(`func_proxy.start cancelled, because ${this.obj}.${this.prop} was already proxied!`);
        }
    }
    unproxy(){
        if(this.proxy_exists()){
            this.obj[this.prop] = this.original;
            active_proxies.get(this.obj).delete(this.prop);
        }
    }
}

//1.3 Mouse proxy
let mouse_proxy;
let mouse_handler = {
    apply: function(target, thisArgs, args){
        //console.log(`x: ${args[0]} y: ${args[1]}`);
        let x, y, new_args;
        if (inputs.mouse.isForced) {
            x = inputs.mouse.force.x;
            y = inputs.mouse.force.y;
        } else {
            x = args[0];
            y = args[1];
        }
        new_args = [x, y];
        inputs.mouse.game = {
            x: new_args[0],
            y: new_args[1],
        }
        return Reflect.apply(target, thisArgs, new_args);
    }
};

function wait_for_handlerMouseMove(){
    if(!predefined_functions.inputs_handler.mouse.move){
        return setTimeout(wait_for_handlerMouseMove, 100);
    }else{
        mouse_proxy = new func_proxy(window.n, 'set_mouse_pos', mouse_handler);
        mouse_proxy.start();
    }
}

wait_for_handlerMouseMove();

document.addEventListener("mousemove", (e) => {
    inputs.mouse.real.x = e.clientX;
    inputs.mouse.real.y = e.clientY;
});

//2. GUI

//2.1 script Interface & logic
function n2id(string) {
  return string.toLowerCase().replace(/ /g, "-");
}

class El {
  constructor(
    name,
    type,
    el_color,
    width,
    height,
    opacity = "1",
    zindex = "100"
  ) {
    this.el = document.createElement(type);
    this.el.style.backgroundColor = el_color;
    this.el.style.width = width;
    this.el.style.height = height;
    this.el.style.opacity = opacity;
    this.el.style.zIndex = zindex;
    this.el.id = n2id(name);
    this.display = "block"; // store default display
  }

  setBorder(type, width, color, radius = 0) {
    const borderStyle = `${width} solid ${color}`;
    switch (type) {
      case "normal":
        this.el.style.border = borderStyle;
        break;
      case "top":
        this.el.style.borderTop = borderStyle;
        break;
      case "left":
        this.el.style.borderLeft = borderStyle;
        break;
      case "right":
        this.el.style.borderRight = borderStyle;
        break;
      case "bottom":
        this.el.style.borderBottom = borderStyle;
        break;
    }
    this.el.style.borderRadius = radius;
  }

  setPosition(
    position,
    display,
    top,
    left,
    flexDirection,
    justifyContent,
    translate
  ) {
    this.el.style.position = position;
    this.el.style.display = display;
    if (top) this.el.style.top = top;
    if (left) this.el.style.left = left;
    // Flex properties
    if (flexDirection) this.el.style.flexDirection = flexDirection;
    if (justifyContent) this.el.style.justifyContent = justifyContent;
    if (translate) this.el.style.transform = `translate(${translate})`;
    this.display = display;
  }

  margin(top, left, right, bottom) {
    this.el.style.margin = `${top} ${right} ${bottom} ${left}`;
  }

  setText(
    text,
    txtColor,
    font,
    weight,
    fontSize,
    stroke,
    alignContent,
    textAlign
  ) {
    this.el.innerHTML = text;
    this.el.style.color = txtColor;
    this.el.style.fontFamily = font;
    this.el.style.fontWeight = weight;
    this.el.style.fontSize = fontSize;
    this.el.style.textShadow = stroke;
    this.el.style.alignContent = alignContent;
    this.el.style.textAlign = textAlign;
  }

  add(parent) {
    parent.appendChild(this.el);
  }

  remove(parent) {
    parent.removeChild(this.el);
  }

  toggle(showOrHide) {
    this.el.style.display = showOrHide === "hide" ? "none" : this.display;
  }
}

let mainCont,
  header,
  subContGray,
  subContBlack,
  modCont,
  settCont,
  activeCategory;

//logic for saving
let trashed_module_names = (() => {
  const saved = localStorage.getItem("[Diep.io+] Trashed names");
  if (saved) {
    return new Set(JSON.parse(saved));
  }
  return new Set();
})();

let saved_trash_content = [];

class Trashbin {
  constructor(trash_content) {
    this.active = {
      trashbin: false,
      mover: false,
    };
    this.trash_content = trash_content;
    //element creation

    //outside
    this.trash_container = new El(
      "TrashBin Container",
      "div",
      "rgb(100, 0, 0)",
      "100%",
      "50px"
    );
    this.trash_container.setPosition("sticky", "flex", "0", "0", "row");
    this.trash_container.el.style.overflowX = "auto";
    this.trash_container.el.style.overflowY = "hidden";
    this.trash_container.el.style.paddingBottom = "20px";

    //inside
    let temp_cont = new El(
      "TrashBinContainer",
      "div",
      "transparent",
      "90px",
      "50px"
    );
    let trashbin = new El("TrashBin", "div", "transparent", "45px", "50px");
    trashbin.setPosition("relative", "inline-block");
    trashbin.setText(
      `${this.trash_content.length}🗑️`,
      "white",
      "Calibri",
      "bold",
      "20px",
      "2px",
      "center",
      "center"
    );
    trashbin.setBorder("normal", "0px", "transparent", "10px");
    trashbin.el.addEventListener("mouseover", (e) => {
      trashbin.el.style.cursor = "pointer";
      trashbin.el.style.backgroundColor = this.active.trashbin
        ? "rgb(200, 0, 0)"
        : "rgb(50, 0, 0)";
    });
    trashbin.el.addEventListener("mouseout", (e) => {
      trashbin.el.style.cursor = "normal";
      trashbin.el.style.backgroundColor = this.active.trashbin
        ? "rgb(150, 0, 0)"
        : "transparent";
    });
    trashbin.el.addEventListener("mousedown", (e) => {
      if (e.button != 0) return;
      this.active.trashbin = !this.active.trashbin;
      if (this.active.trashbin) {
        trashbin.el.style.backgroundColor = "rgb(100, 0, 0)";
        this.show_deleted_buttons();
        this.trash_container.add(mainCont.el);
      } else {
        trashbin.el.style.backgroundColor = "transparent";
        this.trash_container.el.innerHTML = ""; //clear previous items first
        this.trash_container.remove(mainCont.el);
      }
    });

    let mover = new El("Mover", "div", "transparent", "45px", "50px");
    mover.setPosition("relative", "inline-block");
    mover.setText(
      `⬅️`,
      "white",
      "Calibri",
      "bold",
      "20px",
      "2px",
      "center",
      "center"
    );
    mover.setBorder("normal", "0px", "transparent", "10px");
    mover.el.addEventListener("mouseover", (e) => {
      mover.el.style.cursor = "pointer";
      mover.el.style.backgroundColor = this.active.mover
        ? "rgb(0, 0, 200)"
        : "rgb(0, 0, 50)";
    });
    mover.el.addEventListener("mouseout", (e) => {
      mover.el.style.cursor = "normal";
      mover.el.style.backgroundColor = this.active.mover
        ? "rgb(0, 0, 150)"
        : "transparent";
    });
    mover.el.addEventListener("mousedown", (e) => {
      if (e.button != 0) return;
      this.active.mover = !this.active.mover;
      mover.el.style.backgroundColor = "rgb(0, 0, 100)";
    });
    //elements fusion
    temp_cont.el.appendChild(trashbin.el);
    temp_cont.el.appendChild(mover.el);
    this.element = temp_cont.el;
  }
  add_content(content) {
    this.trash_content.push(content);
    this.update_text();
  }
  remove_content(content) {
    let index = this.trash_content.indexOf(content);
    if (index === -1) return;
    this.trash_content.splice(index, 1);
    this.update_text();
  }
  update_text() {
    this.element.children[0].innerHTML = `${this.trash_content.length}🗑️`;
  }
  create_deleted_button(obj) {
    let temp = new El(obj.name, "div", "transparent", "170px", "50px");
    temp.el.style.backgroundColor = "rgb(200, 100, 0)";
    temp.setText(
      obj.name,
      "lightgray",
      "Calibri",
      "bold",
      "20px",
      "2px",
      "center",
      "center"
    );
    temp.setBorder("normal", "2px", "rgb(200, 200, 0)", "5px");
    temp.el.style.flexShrink = "0";
    temp.el.addEventListener("mouseover", (e) => {
      temp.el.style.cursor = "pointer";
      temp.el.style.backgroundColor = "rgb(250, 150, 0)";
    });
    temp.el.addEventListener("mouseout", (e) => {
      temp.el.style.cursor = "normal";
      temp.el.style.backgroundColor = "rgb(200, 100, 0)";
    });
    temp.el.addEventListener("mousedown", (e) => {
      if (e.button != 0) return;
      let path = find_module_path(obj.name);
      let target_module = modules[path[0]][path[1]];
      target_module.trashed = false;
      trashed_module_names.delete(target_module.name);
      localStorage.setItem(
        "[Diep.io+] Trashed names",
        JSON.stringify(Array.from(trashed_module_names))
      );
      if (path[0] === activeCategory) {
        for (let child of obj.children) {
          modCont.el.appendChild(child);
        }
      }
      this.trash_container.el.removeChild(temp.el);
      this.remove_content(obj);
      this.update_text();
    });
    return temp;
  }
  show_deleted_buttons() {
    this.trash_container.el.innerHTML = "";
    if (this.trash_content.length > 0) {
      for (let obj of this.trash_content) {
        let btn = this.create_deleted_button(obj);
        btn.add(this.trash_container.el);
      }
    }
  }
}

function trash_module(module_name, class_elements) {
  if (modCont.el.children.length === 0)
    return console.warn("Currently no modules loaded");
  let temp_storage = {
    name: module_name,
    children: [],
  };
  for (let child of modCont.el.children) {
    for (let class_el of class_elements) {
      if (child === class_el) {
        temp_storage.children.push(child);
      }
    }
  }
  for (let element of temp_storage.children) {
    modCont.el.removeChild(element);
  }
  trash.add_content(temp_storage);
}

//creation of trashbin class instance
let trash = new Trashbin(saved_trash_content);

//new keybinds logic
let keybinds = new Set();

class Setting {
  constructor(name, type, options, target_class) {
    this.name = name;
    this.options = options;
    this.elements = [];
    this.desc = new El(
      name + " Setting",
      "div",
      "transparent",
      "170px",
      "50px"
    );
    this.desc.setPosition("relative", "block");
    this.desc.setText(
      name,
      "white",
      "Calibri",
      "bold",
      "15px",
      "2px",
      "center",
      "center"
    );
    this.elements.push(this.desc.el);

    switch (type) {
      case "title":
        this.desc.el.style.backgroundColor = "rgb(50, 50, 50)";
        this.desc.setText(
          name,
          "lightgray",
          "Calibri",
          "bold",
          "20px",
          "2px",
          "center",
          "center"
        );
        this.desc.setBorder("normal", "2px", "gray", "5px");
        break;
      case "keybind":
        this.kb_state = "idle";
        this.previous_key = "";
        this.desc.el.style.backgroundColor = "rgb(103, 174, 110)";
        this.desc.setText(
          name.length > 0 ? name : "Click to Select Keybind",
          "rgb(225, 238, 188)",
          "Calibri",
          "bold",
          "15px",
          "2px",
          "center",
          "center"
        );
        this.desc.setBorder("normal", "2px", "rgb(50, 142, 110)", "5px");
        this.desc.el.addEventListener("mouseover", (e) => {
          this.desc.el.style.backgroundColor = "rgb(144, 198, 124)";
          target_class.desc.setBorder("normal", "2px", "red", "5px");
        });
        this.desc.el.addEventListener("mouseout", (e) => {
          this.desc.el.style.backgroundColor = "rgb(103, 174, 110)";
          target_class.desc.setBorder("normal", "0px", "transparent", "0px");
        });
        this.desc.el.addEventListener("mousedown", (e) => {
          if (e.button != 0) return;
          this.desc.el.innerHTML = "Press a key";
          this.kb_state = "listening";
        });
        document.addEventListener("keydown", (e) => {
          switch (this.kb_state) {
            case "set":
              if (e.code === this.previous_key) {
                target_class.active = !target_class.active;
                target_class.update_toggle(target_class.checkbox);
              }
              break;
            case "listening":
              if (this.previous_key === e.code) {
                this.desc.el.innerHTML = e.code;
                this.kb_state = "set";
              } else if (keybinds.has(e.code)) {
                this.desc.el.innerHTML =
                  "Keybind already being used, try again!";
              } else {
                if (e.code === "Backspace" || e.code === "Escape") {
                  this.desc.el.innerHTML = "Click to Select Keybind";
                  this.kb_state = "set";
                  return;
                }
                keybinds.add(e.code);
                if (keybinds.has(this.previous_key))
                  keybinds.delete(this.previous_key);
                this.desc.el.innerHTML = e.code;
                this.previous_key = e.code;
                this.kb_state = "set";
              }
              break;
            default:
              return;
          }
        });
        break;
      case "select": {
        if (!this.options) return console.warn("Missing Options!");
        let index = 0;
        this.selected = options[index];
        //temp cont
        let temp_container = new El(
          name + " temp Container",
          "div",
          "transparent"
        );
        temp_container.el.style.display = "flex";
        temp_container.el.style.alignItems = "center";
        temp_container.el.style.justifyContent = "center";
        temp_container.el.style.gap = "10px";

        //displ
        let displ = new El(
          name + " Setting Display",
          "div",
          "lightgray",
          "125px",
          "25px"
        );
        displ.setText(
          this.selected,
          "black",
          "Calibri",
          "bold",
          "15px",
          "2px",
          "center",
          "center"
        );

        //left Arrow
        let l_arrow = new El(
          name + " left Arrow",
          "div",
          "transparent",
          "0px",
          "0px"
        );
        l_arrow.setBorder("bottom", "8px", "transparent");
        l_arrow.setBorder("left", "0px", "transparent");
        l_arrow.setBorder("right", "16px", "blue");
        l_arrow.setBorder("top", "8px", "transparent");

        l_arrow.el.addEventListener("mouseover", () => {
          l_arrow.el.style.cursor = "pointer";
          l_arrow.setBorder("right", "16px", "darkblue");
        });

        l_arrow.el.addEventListener("mouseout", () => {
          l_arrow.el.style.cursor = "normal";
          l_arrow.setBorder("right", "16px", "blue");
        });

        l_arrow.el.addEventListener("mousedown", (e) => {
          if (e.button != 0) return;
          let limit = options.length - 1;
          if (index - 1 < 0) {
            index = limit;
          } else {
            index--;
          }
          this.selected = options[index];
          displ.el.innerHTML = this.selected;
        });

        //right Arrow
        let r_arrow = new El(
          name + " right Arrow",
          "div",
          "transparent",
          "0px",
          "0px"
        );
        r_arrow.setBorder("bottom", "8px", "transparent");
        r_arrow.setBorder("left", "16px", "blue");
        r_arrow.setBorder("right", "0px", "transparent");
        r_arrow.setBorder("top", "8px", "transparent");

        r_arrow.el.addEventListener("mouseover", () => {
          r_arrow.el.style.cursor = "pointer";
          r_arrow.setBorder("left", "16px", "darkblue");
        });

        r_arrow.el.addEventListener("mouseout", () => {
          r_arrow.el.style.cursor = "normal";
          r_arrow.setBorder("left", "16px", "blue");
        });

        r_arrow.el.addEventListener("mousedown", (e) => {
          if (e.button != 0) return;
          let limit = options.length - 1;
          if (index + 1 > limit) {
            index = 0;
          } else {
            index++;
          }
          this.selected = options[index];
          displ.el.innerHTML = this.selected;
        });

        //connect together
        temp_container.el.appendChild(l_arrow.el);
        temp_container.el.appendChild(displ.el);
        temp_container.el.appendChild(r_arrow.el);

        //remember them
        this.elements.push(temp_container.el);
        break;
      }
      case "toggle": {
        this.active = false;
        this.desc.el.style.display = "flex";
        this.desc.el.style.alignItems = "center";
        this.desc.el.style.justifyContent = "space-between";
        let empty_checkbox = new El(
          this.name + " Setting checkbox",
          "div",
          "lightgray",
          "20px",
          "20px"
        );
        empty_checkbox.setBorder("normal", "2px", "gray", "4px");
        //event listeners
        empty_checkbox.el.addEventListener("mousedown", (e) => {
          if (e.button != 0) return;
          this.active = !this.active;
          this.update_toggle(empty_checkbox);
        });
        empty_checkbox.el.addEventListener("mouseover", () => {
          empty_checkbox.el.style.backgroundColor = this.active
            ? "darkgreen"
            : "darkgray";
          empty_checkbox.el.style.cursor = "pointer";
        });
        empty_checkbox.el.addEventListener("mouseout", () => {
          empty_checkbox.el.style.backgroundColor = this.active
            ? "green"
            : "lightgray";
        });
        this.desc.el.appendChild(empty_checkbox.el);
        this.checkbox = empty_checkbox;
        break;
      }
        case "boolean":{
            this.bool = false;
            this.updateBool = function(bool){
                this.bool = bool;
                if(this.bool){
                    this.desc.el.style.backgroundColor = "darkgreen";
                    this.desc.setText(
                        name,
                        "green",
                        "Calibri",
                        "bold",
                        "10px",
                        "2px",
                        "center",
                        "center"
                    );
                    this.desc.setBorder("normal", "2px", "lime", "5px");
                }else{
                    this.desc.el.style.backgroundColor = "darkred";
                    this.desc.setText(
                        name,
                        "red",
                        "Calibri",
                        "bold",
                        "10px",
                        "2px",
                        "center",
                        "center"
                    );
                    this.desc.setBorder("normal", "2px", "salmon", "5px");
                }
            }
            this.updateBool(this.bool);
            break;
        }
    }
  }
  update_toggle(empty_checkbox) {
    if (this.active) {
      empty_checkbox.el.innerHTML = "✔";
      empty_checkbox.el.style.backgroundColor = "green";
      empty_checkbox.setBorder("normal", "2px", "lime", "4px");
    } else {
      empty_checkbox.el.innerHTML = "";
      empty_checkbox.el.style.backgroundColor = "lightgray";
      empty_checkbox.setBorder("normal", "2px", "gray", "4px");
    }
  }
  load() {
    this.elements.forEach((element) => settCont.el.appendChild(element));
  }

  unload() {
    this.elements.forEach((element) => {
      if (settCont.el.contains(element)) {
        settCont.el.removeChild(element);
      }
    });
  }
}

class Module {
  constructor(name, type, settings, callback) {
    this.name = name;
    this.type = type;
    this.trashed = trashed_module_names.has(this.name);
    this.callbackFunc = callback;
    this.settings = settings;
    this.title = new El(name, "div", "transparent", "100%", "50px");
    this.title.setPosition("relative", "block");
    this.title.setText(
      name,
      "white",
      "Calibri",
      "bold",
      "15px",
      "2px",
      "center",
      "center"
    );
    this.title.el.addEventListener("mouseover", (e) => {
      if (!trash.active.mover) return;
      this.title.el.style.color = "rgb(200, 0, 0)";
    });
    this.title.el.addEventListener("mouseout", (e) => {
      if (this.title.el.style.color === "rgb(200, 0, 0)") {
        this.title.el.style.color = "white";
      }
    });
    this.elements = [];
    this.elements.push(this.title.el);
    switch (type) {
      case "toggle": {
        this.active = false;
        this.title.el.style.display = "flex";
        this.title.el.style.alignItems = "center";
        this.title.el.style.justifyContent = "space-between";
        let empty_checkbox = new El(
          this.name + " checkbox",
          "div",
          "lightgray",
          "20px",
          "20px"
        );
        empty_checkbox.setBorder("normal", "2px", "gray", "4px");
        //event listeners
        empty_checkbox.el.addEventListener("mousedown", (e) => {
          if (e.button != 0) return;
          this.active = !this.active;
          if (this.active) {
            empty_checkbox.el.innerHTML = "✔";
            empty_checkbox.el.style.backgroundColor = "green";
            empty_checkbox.setBorder("normal", "2px", "lime", "4px");
          } else {
            empty_checkbox.el.innerHTML = "";
            empty_checkbox.el.style.backgroundColor = "lightgray";
            empty_checkbox.setBorder("normal", "2px", "gray", "4px");
          }
        });
        empty_checkbox.el.addEventListener("mouseover", () => {
          empty_checkbox.el.style.backgroundColor = this.active
            ? "darkgreen"
            : "darkgray";
          empty_checkbox.el.style.cursor = "pointer";
        });
        empty_checkbox.el.addEventListener("mouseout", () => {
          empty_checkbox.el.style.backgroundColor = this.active
            ? "green"
            : "lightgray";
        });
        this.title.el.appendChild(empty_checkbox.el);
        break;
      }
      case "slider": {
        this.value = 100;
        this.title.el.innerHTML = `${this.name}: ${this.value} %`;
        const slider = document.createElement("input");
        slider.type = "range";
        slider.value = this.value;
        slider.min = 0;
        slider.max = 100;

        slider.addEventListener("input", () => {
          this.value = slider.value;
          this.title.el.innerHTML = `${this.name}: ${this.value} %`;
        });

        this.elements.push(slider);
        break;
      }
      case "button":
        this.title.el.style.width = "100%";
        this.title.el.style.boxSizing = "border-box";
        this.title.el.style.whiteSpace = "normal"; // Allows text wrapping
        this.title.setBorder("normal", "2px", "white", "10px");
        this.title.el.style.cursor = "pointer";
        this.title.el.addEventListener("mousedown", () => {
          if (trash.active.mover) return;
          if (this.callbackFunc) {
            this.callbackFunc();
          }
        });
        break;
      case "open": {
        this.active = false;
        this.title.el.style.display = "flex";
        this.title.el.style.alignItems = "center";
        this.title.el.style.justifyContent = "space-between";
        let opener_box = new El(
          this.name + " opener box",
          "div",
          "rgb(75, 75, 75)",
          "20px",
          "20px"
        );
        opener_box.setBorder("normal", "2px", "gray", "4px");
        opener_box.el.style.display = "flex";
        opener_box.el.style.alignItems = "center";
        opener_box.el.style.justifyContent = "center";
        //
        let triangle = new El(
          name + " triangle",
          "div",
          "transparent",
          "0px",
          "0px"
        );
        triangle.setBorder("bottom", "16px", "lime");
        triangle.setBorder("left", "8px", "transparent");
        triangle.setBorder("right", "8px", "transparent");
        triangle.setBorder("top", "0px", "transparent");
        //
        //event listeners
        opener_box.el.addEventListener("mousedown", (e) => {
          if (e.button != 0) return;
          if (trash.active.mover) return;
          this.active = !this.active;
          if (this.active) {
            triangle.setBorder("bottom", "0px", "transparent");
            triangle.setBorder("left", "8px", "transparent");
            triangle.setBorder("right", "8px", "transparent");
            triangle.setBorder("top", "16px", "red");
            this.loadSettings();
          } else {
            triangle.setBorder("bottom", "16px", "lime");
            triangle.setBorder("left", "8px", "transparent");
            triangle.setBorder("right", "8px", "transparent");
            triangle.setBorder("top", "0px", "transparent");
            this.unloadSettings();
          }
        });
        opener_box.el.addEventListener("mouseover", () => {
          opener_box.el.style.backgroundColor = "rgb(50, 50, 50)";
          opener_box.el.style.cursor = "pointer";
        });
        opener_box.el.addEventListener("mouseout", () => {
          opener_box.el.style.backgroundColor = "rgb(75, 75, 75)";
        });
        opener_box.el.appendChild(triangle.el);
        this.title.el.appendChild(opener_box.el);
        break;
      }
    }
    if (trashed_module_names.has(this.name)) {
      saved_trash_content.push({ name: this.name, children: this.elements });
      trash.update_text();
    }
    this.title.el.addEventListener("mousedown", (e) => {
      if (!trash.active.mover) return;
      trash_module(this.name, this.elements);
      this.trashed = true;
      trashed_module_names.add(this.name);
      localStorage.setItem(
        "[Diep.io+] Trashed names",
        JSON.stringify(Array.from(trashed_module_names))
      );
      this.title.el.style.color = "white";
      trash.show_deleted_buttons();
    });
  }
  load() {
    this.elements.forEach((element) => modCont.el.appendChild(element));
  }

  unload() {
    this.elements.forEach((element) => {
      if (modCont.el.contains(element)) {
        modCont.el.removeChild(element);
      }
    });
  }

  loadSettings() {
    if (!this.settings) return;
    for (let _sett in this.settings) {
      this.settings[_sett].load();
    }
  }

  unloadSettings() {
    if (!this.settings) return;
    for (let _sett in this.settings) {
      this.settings[_sett].unload();
    }
  }
}

class Category {
  constructor(name, modules) {
    this.name = name;
    this.element = new El(name, "div", "rgb(38, 38, 38)", "90px", "50px");
    this.element.setPosition("relative", "block");
    this.element.setText(
      name,
      "white",
      "Calibri",
      "bold",
      "20px",
      "2px",
      "center",
      "center"
    );
    this.element.setBorder("normal", "2px", "transparent", "10px");
    this.selected = false;
    this.modules = modules;

    this.element.el.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;
      this.selected = !this.selected;
      this.element.el.style.backgroundColor = this.selected
        ? "lightgray"
        : "rgb(38, 38, 38)";
      handle_categories_selection(this.name);
      if (!this.selected) unload_modules(this.name);
    });

    this.element.el.addEventListener("mouseover", () => {
      if (!this.selected) {
        this.element.el.style.backgroundColor = "rgb(58, 58, 58)";
        this.element.el.style.cursor = "pointer";
      }
    });

    this.element.el.addEventListener("mouseout", () => {
      if (!this.selected)
        this.element.el.style.backgroundColor = "rgb(38, 38, 38)";
    });
  }
  unselect() {
    this.selected = false;
    this.element.el.style.backgroundColor = "rgb(38, 38, 38)";
  }
}

//1travel
let modules = {
    Info: {
        hall_of_Fame: new Module("Hall of Fame", "open", {
            darkdealer_00249: new Setting("darkdealer_00249", "title"),
            Sguanto: new Setting("Sguanto", "title"),
        }),
        q_a1: new Module(
            "Where are the old scripts from diep.io+?",
            "button",
            null,
            () => {
                alert('Patched, I am trying to restore as many as I can now');
            }
        ),
        q_a2: new Module(
            "What happened to Zoom Hack?",
            "button",
            null,
            () => {
                alert("It's gone forever. If you need a working zoom hack, use memory FOV");
            }
        ),
        q_a3: new Module(
            "Why don't you update your script for so long?",
            "button",
            null,
            () => {
                alert("Because I'm a student and I don't have so much time anymore.");
            }
        ),
        q_a4: new Module(
            "How can I join your discord server?",
            "button",
            null,
            () => {
                alert(
                    "Join and follow instructions: https://discord.gg/S3ZzgDNAuG please dm me if the link doesn't work, discord: h3llside"
                );
            }
        ),
        q_a5: new Module(
            "Can you make me a script?",
            "button",
            null,
            () => {
                alert(
                    "If it's simple - yes. If it's hard to make, then only for a small donation 5-15$. My discord is: h3llside"
                );
            }
        ),
        q_a6: new Module(
            "I'm a coder, can you teach me everything you know so I can help you?",
            "button",
            null,
            () => {
                alert(
                    "Yes of course! But if your script breaks, you will need to fix it yourself."
                );
            }
        ),
    },
    Visual: {
        Diep_console: new Module("Diep Console", "open", {
            net_predict_movement: new Setting("net_predict_movement", "toggle"),
            ren_scoreboard: new Setting("Leaderboard", "toggle"),
            ren_scoreboard_names: new Setting("Scoreboard Names", "toggle"),
            ren_fps: new Setting("FPS", "toggle"),
            ren_upgrades: new Setting("Tank Upgrades", "toggle"),
            ren_stats: new Setting("Stat Upgrades", "toggle"),
            ren_names: new Setting("Names", "toggle"),
        }),
        destroyer_cooldown: new Module("Destroyer Cooldown", "open", {
            Title: new Setting("Destroyer Cooldown", "title"),
            keybind: new Setting(
                "",
                "keybind",
                null,
                (this.temp = new Setting("enable Destroyer Cooldown", "toggle"))
            ),
            reload: new Setting("Reload?", "select", [0, 1, 2, 3, 4, 5, 6, 7]),
            destroyer_cooldown: this.temp,
        }),
    },
    Functional: {
        Import_names: new Module(
            "Import Killer Names",
            "button",
            null,
            import_killer_names
        ),
        Export_names: new Module("Export Killer Names", "button", null, () => {
            let exported_string = localStorage.getItem("[Diep.io+] saved names")
            ? localStorage.getItem("[Diep.io+] saved names")
            : -1;
            if (exported_string < 0) return alert("not copied, because 0 saved names");
            navigator.clipboard.writeText("'" + exported_string + "'");
            alert(`copied ${JSON.parse(exported_string).length} saved names`);
        }),
        Auto_respawn: new Module("Auto Respawn", "open", {
            Title: new Setting("Auto Respawn", "title"),
            keybind: new Setting(
                "",
                "keybind",
                null,
                (this.temp = new Setting("Auto Respawn", "toggle"))
            ),
            Remember: new Setting("Remember and store Killer Names", "toggle"),
            Prevent: new Setting("Prevent respawning after 300k score", "toggle"),
            Name: new Setting("Spawn Name Type: ", "select", [
                "Normal",
                "Random Killer",
                "Random Symbols",
                "Random Numbers",
                "Random Letters",
            ]),
            Auto_respawn: this.temp,
        }),
    },
    Mouse: {
        Anti_aim: new Module("Anti Aim", "open", {
            Title: new Setting("Anti Aim", "title"),
            keybind: new Setting(
                "",
                "keybind",
                null,
                (this.temp = new Setting("enable Anti Aim", "toggle"))
            ),
            Timing: new Setting(
                "Follow mouse on click, how long?",
                "select",
                [50, 100, 150, 200, 250, 300]
            ),
            Anti_aim: this.temp,
        }),
    },
    Addons: {
    },
    Debug: {},
    /*Old Modules
  Info: {
    hall_of_Fame: new Module("Hall of Fame", "open", {
      darkdealer_00249: new Setting("darkdealer_00249", "title"),
      Sguanto: new Setting("Sguanto", "title"),
    }),
    q_a1: new Module(
      "Where are the old scripts from diep.io+?",
      "button",
      null,
      () => {
        alert("They're either patched, or not fully integrated yet.");
      }
    ),
    q_a2: new Module("Can you make me a script?", "button", null, () => {
      alert(
        "If it's simple - yes, if not give me a donation or a private script and I will do it for you, unless I don't know how to implement it."
      );
    }),
    q_a3: new Module("This script is so confusing!", "button", null, () => {
      alert(
        "Maybe I will make full tutorial, but for now ask me anything about it. Discord: h3llside"
      );
    }),
    q_a4: new Module(
      "How can I join your discord server?",
      "button",
      null,
      () => {
        alert(
          "Join and follow instructions: https://discord.gg/S3ZzgDNAuG please dm me if the link doesn't work, discord: h3llside"
        );
      }
    ),
    q_a5: new Module("Why do you update it so often?", "button", null, () => {
      alert(
        "I get it, it can be annoying to constantly update the script, but sometimes new ideas come, sometimes game updates and breaks this script so I have no choice but to update frequently"
      );
    }),
    q_a6: new Module("What is the import, export for?", "button", null, () => {
      alert(
        "it's for auto respawn+, mainly spawn type: Random Killer. It basically chooses random saved name and you can share those saved names with each other :)"
      );
    }),
  },

  Visual: {
    Key_inputs_visualiser: new Module("Key Inputs Visualiser", "toggle"),
    destroyer_cooldown: new Module("Destroyer Cooldown", "open", {
      Title: new Setting("Destroyer Cooldown", "title"),
      keybind: new Setting(
        "",
        "keybind",
        null,
        (this.temp = new Setting("enable Destroyer Cooldown", "toggle"))
      ),
      reload: new Setting("Reload?", "select", [0, 1, 2, 3, 4, 5, 6, 7]),
      destroyer_cooldown: this.temp,
    }),
  },

  Functional: {
    CopyLink: new Module("Copy Party Link", "button", null, () => {
      document.getElementById("copy-party-link").click();
    }),
    Predator_stack: new Module("Predator Stack", "button", null, () => {
      predator_stack(get_reload());
    }),
    Sandbox_lvl_up: new Module("Sandbox Auto Level Up", "toggle"),
    Auto_respawn: new Module("Auto Respawn", "open", {
      Title: new Setting("Auto Respawn", "title"),
      keybind: new Setting(
        "",
        "keybind",
        null,
        (this.temp = new Setting("Auto Respawn", "toggle"))
      ),
      Remember: new Setting("Remember and store Killer Names", "toggle"),
      Prevent: new Setting("Prevent respawning after 300k score", "toggle"),
      Name: new Setting("Spawn Name Type: ", "select", [
        "Normal",
        "Glitched",
        "N A M E",
        "Random Killer",
        "Random Symbols",
        "Random Numbers",
        "Random Letters",
      ]),
      Auto_respawn: this.temp,
    }),
    Import_names: new Module(
      "Import Killer Names",
      "button",
      null,
      import_killer_names
    ),
    Export_names: new Module("Export Killer Names", "button", null, () => {
      let exported_string = localStorage.getItem("[Diep.io+] saved names")
        ? localStorage.getItem("[Diep.io+] saved names")
        : -1;
      if (exported_string < 0)
        return alert("not copied, because 0 saved names");
      navigator.clipboard.writeText("'" + exported_string + "'");
      alert(`copied ${JSON.parse(exported_string).length} saved names`);
    }),
    Bot_tab: new Module("Sandbox Arena  size increase", "toggle"),
    Tank_upgrades: new Module("Tank Upgrades Keybinds", "open", {
      Title: new Setting("Tank Upgrades Keybinds", "title"),
      visualise: new Setting("Show positions and keys", "toggle"),
      Tank_upgrades: new Setting("enable Tank Upgrades Keybinds", "toggle"),
    }),
    Zoom: new Module("Zoom Out", "slider"),
  },

  Mouse: {
    Anti_aim: new Module("Anti Aim", "open", {
      Title: new Setting("Anti Aim", "title"),
      keybind: new Setting(
        "",
        "keybind",
        null,
        (this.temp = new Setting("enable Anti Aim", "toggle"))
      ),
      Timing: new Setting(
        "Follow mouse on click, how long?",
        "select",
        [50, 100, 150, 200, 250, 300]
      ),
      Anti_aim: this.temp,
    }),
    Freeze_mouse: new Module("Freeze Mouse", "toggle"),
    Anti_timeout: new Module("Anti AFK Timeout", "toggle"),
    Move_2_mouse: new Module("Move to mouse", "open", {
      Title: new Setting("Move to mouse", "title"),
      keybind: new Setting(
        "",
        "keybind",
        null,
        (this.temp = new Setting("enable Move to Mouse", "toggle"))
      ),
      toggle_debug: new Setting("Watch how the script works", "toggle"),
      Approximation: new Setting(
        "Approximation Factor (lower = smoother)",
        "select",
        [10, 25, 40, 65, 80, 100]
      ),
      Time_factor: new Setting(
        "Time Factor (higher = longer)",
        "select",
        [10, 20, 30, 40, 50]
      ),
      Move_2_mouse: this.temp,
    }),
    Custom_auto_spin: new Module("Custom Auto Spin", "open", {
      Title: new Setting("Custom Auto Spin", "title"),
      keybind: new Setting(
        "",
        "keybind",
        null,
        (this.temp = new Setting("enable Custom Auto Spin", "toggle"))
      ),
      Interval: new Setting(
        "Movement Interval",
        "select",
        [
          100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300,
          1400, 1500, 1600, 1700, 1800, 1900, 2000, 2500, 3000, 3500, 4000,
          5000,
        ]
      ),
      Smoothness: new Setting("Smoothness", "select", [3, 4, 5, 6, 7, 8]),
      Replace_auto_spin: new Setting("replace Auto Spin", "toggle"),
      Custom_auto_spin: this.temp,
    }),
  },

  DiepConsole: {
    con_toggle: new Module("Show/hide Diep Console", "toggle"),
    net_predict_movement: new Module("predict movement", "toggle"),
    Render: new Module("Render things", "open", {
      Title: new Setting("Rendering", "title"),
      ren_scoreboard: new Setting("Leaderboard", "toggle"),
      ren_scoreboard_names: new Setting("Scoreboard Names", "toggle"),
      ren_fps: new Setting("FPS", "toggle"),
      ren_upgrades: new Setting("Tank Upgrades", "toggle"),
      ren_stats: new Setting("Stat Upgrades", "toggle"),
      ren_names: new Setting("Names", "toggle"),
    }),
    //game builds
  },

  Addons: {
    aim_lines: new Module("Tank Aim lines", "open", {
      Title: new Setting("Tank Aim lines", "title"),
      keybind: new Setting(
        "",
        "keybind",
        null,
        (this.temp = new Setting("Toggle Aim Lines", "toggle"))
      ),
      adjust_length: new Setting(
        "Adjust aim line length",
        "select",
        [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 5, 7.5, 10]
      ),
      toggle_aim_lines: this.temp,
    }),
    farm_bot: new Module("Farm Bot", "open", {
      Title: new Setting("Farm Bot", "title"),
      keybind: new Setting(
        "",
        "keybind",
        null,
        (this.temp = new Setting("Toggle Farm Bot", "toggle"))
      ),
      detect_type: new Setting("Detect shapes by:", "select", ["closest", "most xp"]),
      ignore_shapes: new Setting("Shapes you want to ignore:"),
      toggle_squares: new Setting("Squares", "toggle"),
      toggle_crashers: new Setting("Crashers", "toggle"),
      toggle_pentagons: new Setting("Pentagons", "toggle"),
      toggle_triangles: new Setting("Triangles", "toggle"),
      ignore_outside: new Setting("Ignore Outside base?", "toggle"),
      other_setts: new Setting("Movement:"),
      move_to_shape: new Setting("Move to Shapes", "toggle"),
      visuals: new Setting("Visuals:"),
      toggle_lines: new Setting("Toggle Line to Shape", "toggle"),
      toggle_debug: new Setting("See how script works", "toggle"),
      activation: new Setting("Activation:"),
      toggle_farm_bot: this.temp,
    }),
    world_coords: new Module("World Coordinates", "open", {
      Title: new Setting("World Coordinates", "title"),
      precision: new Setting("Precision Factor", "select", [0, 1, 2, 3, 4]),
      toggle_world_coords: new Setting("Toggle World Coordinates", "toggle"),
    }),
    enemy_tracers: new Module("Enemy Tracers", "toggle"),
    trails: new Module("Trails", "open", {
        Title: new Setting("Trails", "title"),
        update_interval: new Setting("Update Interval", "select", [10, 50, 100, 250, 500]),
        toggle_trails: new Setting("Toggle Trails", "toggle"),
    }),
    invisibles: new Module("Uninvisible yourself", "toggle"),
  },
  */
};

console.log(modules);

let categories = [];

function create_categories() {
  for (let key in modules) {
    categories.push(new Category(key, modules[key]));
  }
}
create_categories();

//loading / unloading modules
function load_modules(category_name) {
  activeCategory = category_name;
  const current_category = categories.find(
    (category) => category.name === category_name
  );
  for (let moduleName in current_category.modules) {
    let module = current_category.modules[moduleName];
    if (!module.trashed) module.load();
    if (module.type === "open" && module.active) module.loadSettings();
  }
}

function unload_modules(category_name) {
  if (activeCategory === category_name) activeCategory = undefined;
  const current_category = categories.find(
    (category) => category.name === category_name
  );
  for (let moduleName in current_category.modules) {
    let module = current_category.modules[moduleName];
    module.unload();
    module.unloadSettings();
  }
}

function find_module_path(_name) {
  for (let category in modules) {
    for (let module in modules[category]) {
      // Iterate over actual modules
      if (modules[category][module].name === _name) {
        return [category, module]; // Return actual category and module
      }
    }
  }
  return -1; // Return -1 if not found
}

function handle_categories_selection(current_name) {
  categories.forEach((category) => {
    if (category.name !== current_name && category.selected) {
      category.unselect();
      unload_modules(category.name);
    }
  });

  load_modules(current_name);
}

function loadCategories() {
  const categoryCont = document.querySelector("#sub-container-gray");
  categories.forEach((category) =>
    categoryCont.appendChild(category.element.el)
  );
}

function load_selected() {
  categories.forEach((category) => {
    if (category.selected) {
      load_modules(category.name);
    }
  });
}

function loadGUI() {
  document.body.style.margin = "0";
  document.body.style.display = "flex";
  document.body.style.justifyContent = "left";

  mainCont = new El("Main Cont", "div", "rgb(38, 38, 38)", "500px", "400px");
  mainCont.setBorder("normal", "2px", "lime", "10px");
  mainCont.el.style.display = "flex";
  mainCont.el.style.minHeight = "min-content";
  mainCont.el.style.flexDirection = "column";
  mainCont.add(document.body);

  header = new El("Headline Dp", "div", "transparent", "100%", "40px");
  header.setBorder("bottom", "2px", "rgb(106, 173, 84)");
  header.setText(
    "Diep.io+ by r!PsAw (Hide GUI with J)",
    "white",
    "Calibri",
    "bold",
    "20px",
    "2px",
    "center",
    "center"
  );
  header.add(mainCont.el);

  const contentWrapper = document.createElement("div");
  contentWrapper.style.display = "flex";
  contentWrapper.style.gap = "10px";
  contentWrapper.style.padding = "10px";
  contentWrapper.style.flex = "1";
  mainCont.el.appendChild(contentWrapper);

  subContGray = new El(
    "Sub Container Gray",
    "div",
    "transparent",
    "100px",
    "100%"
  );
  subContGray.el.style.display = "flex";
  subContGray.el.style.flexDirection = "column";
  subContGray.el.style.overflowY = "auto";
  subContGray.add(contentWrapper);

  subContBlack = new El("Sub Container Black", "div", "black", "360px", "100%");
  subContBlack.el.style.display = "flex";
  subContBlack.el.style.gap = "10px";
  subContBlack.add(contentWrapper);

  modCont = new El("Module Container", "div", "transparent", "50%", "100%");
  modCont.el.style.display = "flex";
  modCont.el.style.flexDirection = "column";
  modCont.el.style.overflowY = "auto";
  modCont.setBorder("right", "2px", "white");
  modCont.add(subContBlack.el);

  settCont = new El("Settings Container", "div", "transparent", "50%", "100%");
  settCont.el.style.display = "flex";
  settCont.el.style.flexDirection = "column";
  settCont.el.style.overflowY = "auto";
  settCont.add(subContBlack.el);

  loadCategories();
  load_selected();

  subContGray.el.appendChild(trash.element);
}

loadGUI();
document.addEventListener("keydown", toggleGUI);

function toggleGUI(e) {
  if (e.key === "j" || e.key === "J") {
    if (mainCont.el) {
      mainCont.remove(document.body);
      mainCont.el = null;
    } else {
      loadGUI();
    }
  }
}

//2.2 define debug Modules
function unnest(obj, prefix=''){
    //console.log('checking... ', obj);
    if(typeof obj != 'object' || obj === null){
        //console.log('end reached');
        return prefix;
    }
    //console.log('!!! LOOP !!!');
    const keys = Object.keys(obj);
    let arr = [];
    for(let key of keys){
        let next = obj[key];
        //console.log(prefix);
        let final_key = unnest(next, prefix+'-'+key);
        arr.push(final_key);
        if(final_key instanceof Array){
            //console.log('FLATTENING...');
            arr = arr.flat(1);
        }
    }
    return arr;
}
const unnested_pfs = unnest(predefined_functions);

function pf_exists(path_arr){
    let target = predefined_functions;
    while(path_arr.length > 1){
        let key = path_arr.shift();
        target = target[key];
    }
    return !!target[path_arr[0]];
}

function define_pf_module(){
    const target = modules.Debug;
    let settings_obj = {};
    for(let unnested_pf of unnested_pfs){
        let temp = unnested_pf;
        let bool = pf_exists(temp.split('-').slice(1));
        settings_obj[unnested_pf] = new Setting(unnested_pf, "boolean");
        settings_obj[unnested_pf].updateBool(bool);
    }
    target.predefined_functions = new Module("predefined Functions", "open", settings_obj);
}
define_pf_module();

function update_pf_module(){
    const target = modules.Debug.predefined_functions.settings;
    for(let unnested_pf of unnested_pfs){
        let temp = unnested_pf;
        let bool = pf_exists(temp.split('-').slice(1));
        target[unnested_pf].updateBool(bool);
    }
}
setInterval(update_pf_module, 100);

//2.3 remove annoying html elements
function instant_remove() {
    // Define selectors for elements to remove
    const selectors = [
        "#cmpPersistentLink",
        "#apes-io-promo",
        "#apes-io-promo > img",
        "#last-updated",
        "#diep-io_300x250"
    ];

    // Remove each selected element
    selectors.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            element.remove();
        }
    });
}

setInterval(instant_remove, 100);

//2.4 personal best
let gamemode, gameOverScreen, gameOverScreenContainer, gameDetails, personal_best;
let last_gamemode = localStorage.getItem(`[Diep.io+] last_gm`);
let your_final_score = 0;

function save_gm() {
    let saved_gm = localStorage.getItem(`[Diep.io+] last_gm`);
    if (saved_gm != null && saved_gm != gamemode) {
        last_gamemode = saved_gm;
    }
    saved_gm === null ? localStorage.setItem(`[Diep.io+] last_gm}`, gamemode) : null;
}

function load_ls() {
    return localStorage.getItem(gamemode) ? localStorage.getItem(gamemode) : 0;
}

function save_ls() {
    localStorage.setItem(gamemode, your_final_score);
}

function check_gamemode() {
        gamemode = document.querySelector("#gamemode-selector > div > div.selected > div.dropdown-label").innerHTML;
        save_gm();
}

function define_gameOverScreenContainer(){
    if(gameOverScreen && gameOverScreen.children.length > 0){
        for(let i = 0; i < gameOverScreen.children.length; i++){
            let child = gameOverScreen.children[i];
            if(child.classList.contains('game-over-container')){
                gameOverScreenContainer = child;
                break;
            }
        }
    }
}

function define_gameDetails(){
    if(gameOverScreenContainer && gameOverScreenContainer.children.length > 0){
        for(let i = 0; i < gameOverScreenContainer.children.length; i++){
            let child = gameOverScreenContainer.children[i];
            if(child.classList.contains('game-details')){
                gameDetails = child;
                break;
            }
        }
    }
}

function is_gameOverScreen_active(){
    return (!!gameOverScreen && gameOverScreen.classList.contains('active'));
}

function create_highscore_div(){
    if(!gameOverScreenContainer){
        define_gameOverScreenContainer();
        return setTimeout(create_highscore_div, 100);
    }
    if(!gameDetails){
        define_gameDetails();
        return setTimeout(create_highscore_div, 100);
    }
    let _gameDetails = gameDetails.children[0];
    //create the elements & containers
    let gameDetail = document.createElement('div');
    let best_label = document.createElement('div');
    personal_best = document.createElement('div');
    //add classes
    gameDetail.classList.add('game-detail');
    best_label.classList.add('label');
    personal_best.classList.add('value');
    //inner Text
    best_label.innerText = 'Best:';
    //append
    gameDetail.appendChild(best_label);
    gameDetail.appendChild(personal_best);
    _gameDetails.appendChild(gameDetail);
}

function await_gameOverScreen(){
    gameOverScreen = document.querySelector("#game-over-screen");
    if(!gameOverScreen){
        //console.log('no');
        return setTimeout(await_gameOverScreen, 100);
    }
    //console.log('yes');
}
await_gameOverScreen();

function check_final_score() {
    if (is_gameOverScreen_active()) {
        //console.log(`debugging started...`);
        //console.log(`applying _c.death_score: ${JSON.parse(document.querySelector("#game-over-stats-player-score").innerText.replaceAll(',', ''))}`);
        //console.log(`to your_final_score: ${your_final_score}`);
        your_final_score = JSON.parse(document.querySelector("#game-over-stats-player-score").innerText.replaceAll(',', ''));
        //console.log(`redefined: ${your_final_score}`);
        let t = load_ls();
        //console.log(`applying saved_score: ${t}`);
        //console.log(`with parseFloat: ${parseFloat(t)}`);
        let saved_score = parseFloat(t);
        personal_best.textContent = saved_score;
        if(isNaN(saved_score)) return console.warn('NaN score!');
        if (saved_score < your_final_score) {
            personal_best.textContent = your_final_score;
            save_ls();
        }
        //console.log(`debugging ended...`);
    }
}

function await_gm_el(){
    let el = document.querySelector("#gamemode-selector > div > div.selected > div.dropdown-label");
    if(!el){
        return setTimeout(await_gm_el, 100);
    }else{
        //console.log('starting timeout');
        setTimeout(() => {
            //console.log('before', gamemode);
            gamemode = el.innerHTML;
            localStorage.setItem(`[Diep.io+] last_gm`, gamemode);
            //console.log('after', gamemode);
            //console.log('localStorage: ', localStorage.getItem(`[Diep.io+] last_gm`));
            create_highscore_div();
            setInterval(check_gamemode, 250);
            setInterval(check_final_score, 100);
        }, 1000);
    }
}
await_gm_el();

//2.5 handle diep console
function handle_dc(){
    window.requestAnimationFrame(handle_dc);
    const pf = predefined_functions;
    if(player.is_connected && pf.diep_console.get_convar){
        const mdl = modules.Visual.Diep_console.settings;
        const get_convar = pf.diep_console.get_convar;
        for(let convar in mdl){
            let output = get_convar(convar);
            let setting = mdl[convar];
            switch(output){
                case null:
                    break
                case 'false':
                    setting.active = false;
                    setting.update_toggle(setting.checkbox);
                    break
                case 'true':
                    setting.active = true;
                    setting.update_toggle(setting.checkbox);
                    break
            }
        }
    }
}
window.requestAnimationFrame(handle_dc);

function define_dc_event_listeners(){
    const pf = predefined_functions;
    const set_convar = pf.diep_console.set_convar;
    const get_convar = pf.diep_console.get_convar;
    if(!set_convar || !get_convar){
        return setTimeout(define_dc_event_listeners, 100);
    }else{
        const mdl = modules.Visual.Diep_console.settings;
        for(let convar in mdl){
            let setting = mdl[convar];
            setting.checkbox.el.addEventListener('mousedown', (e) => {
                let output = predefined_functions.diep_console.get_convar(convar);
                if(output != null){
                    switch(output){
                        case 'true':
                            predefined_functions.diep_console.set_convar(convar, false);
                            break
                        case 'false':
                            predefined_functions.diep_console.set_convar(convar, true);
                            break
                    }
                }
            });
        }
    }
}
define_dc_event_listeners();

//3. Main logic

//3.1 Link Element
function get_partylink_div(){
    return document.querySelector("#copy-party-link");
}

//3.2 Anti Aim

document.addEventListener('mousedown', (e) => {
    if(e.button === 0 && modules.Mouse.Anti_aim.settings.Anti_aim.active){
        //console.log('1', inputs.mouse.isShooting);
        if(inputs.mouse.isShooting){
           return;
        }
        inputs.mouse.isShooting = true;
        //console.log('2', inputs.mouse.isShooting);
        e.stopPropagation();
         setTimeout(function(){
             inputs.mouse.isShooting = false;
             //console.log('3', inputs.mouse.isShooting);
         }, modules.Mouse.Anti_aim.settings.Timing.selected);
    };
});

function detect_corner() {
    let w = window.innerWidth;
    let h = window.innerHeight;
    let center = {
        x: w / 2,
        y: h / 2
    };
    let lr, ud;
    inputs.mouse.real.x > center.x ? lr = "r" : lr = "l";
    inputs.mouse.real.y > center.y ? ud = "d" : ud = "u";
    return lr + ud;
}

function look_at_corner(corner) {
    //console.log('called look at corner');
    if (!inputs.mouse.isShooting) {
        let w = window.innerWidth;
        let h = window.innerHeight;
        let x, y;
        switch (corner) {
            case "lu":
                x = w;
                y = h;
                break
            case "ld":
                x = w;
                y = 0;
                break
            case "ru":
                x = 0;
                y = h;
                break
            case "rd":
                x = 0;
                y = 0;
                break
        }
        apply_force(dim_c.window_2_canvas(x), dim_c.window_2_canvas(y)); //overwrite your mouse movement event
        m_event('move', dim_c.window_2_canvas(x), dim_c.window_2_canvas(y)); //send custom event, so it looks when mouse is idle
    }
}


function anti_aim_loop() {
    if (modules.Mouse.Anti_aim.settings.Anti_aim.active) {
        if(inputs.mouse.isShooting){
            console.log('is Shooting!!!');
            let x = inputs.mouse.real.x;
            let y = inputs.mouse.real.y;
            apply_force(dim_c.window_2_canvas(x), dim_c.window_2_canvas(y)); //overwrite your mouse movement event
            m_event('move', dim_c.window_2_canvas(x), dim_c.window_2_canvas(y)); //send custom event, so it looks when mouse is idle
            click_at(
                 dim_c.window_2_canvas(inputs.mouse.real.x),
                 dim_c.window_2_canvas(inputs.mouse.real.y),
                 50
             );
        }else{
            look_at_corner(detect_corner());
        }
    } else if (!modules.Mouse.Anti_aim.settings.Anti_aim.active) {
        disable_force();
    }
    requestAnimationFrame(anti_aim_loop);
}
requestAnimationFrame(anti_aim_loop);

//3.3 Auto Respawn

//name saving logic
function get_killer_name(){
    if(!is_gameOverScreen_active()) return '';
    return document.querySelector("#game-over-killed-by-info").innerText;
}

function get_death_score(){
    if(!is_gameOverScreen_active()) return -1;
    return JSON.parse(document.querySelector("#game-over-stats-player-score").innerText.replaceAll(',',''));
}

let banned_names = ["Pentagon", "Triangle", "Square", "Crasher", "Mothership", "Guardian of Pentagons", "Fallen Booster", "Fallen Overlord", "Necromancer", "Defender", "Unnamed Tank"];
function check_and_save_name(){
    let k_name = get_killer_name();
    if(is_gameOverScreen_active() && !banned_names.includes(k_name) && !killer_names.includes(k_name)){
        killer_names.push(k_name);
        killer_names = [...new Set(killer_names)];
        if(modules.Functional.Auto_respawn.settings.Remember.active){
            localStorage.setItem("[Diep.io+] saved names", JSON.stringify(killer_names));
        }
    }
}

function get_random_killer_name(){
    let l = killer_names.length;
    let index = Math.floor(Math.random() * l);
    return killer_names[index];
}

//Random Symbols/Numbers/Letters
function generate_random_name_string(type){
    let final_result = '';
    let chars = '';
    switch(type){
        case "Symbols":
            chars = '!@#$%^&*()_+=-.,][';
            break
        case "Numbers":
            chars = '1234567890';
            break
        case "Letters":
            chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            break
    }
    for (let i = 0; i < 16; i++) {
        final_result += chars[Math.floor(Math.random() * chars.length)];
    }
    return final_result;
}

//main Loop
function get_respawn_name_by_type(type){
    let temp_name = '';
    switch(type){
        case "Normal":
            temp_name = player.name;
            break
        case "Random Killer":
            temp_name = get_random_killer_name();
            break
        case "Random Symbols":
            temp_name = generate_random_name_string('Symbols');
            break
        case "Random Numbers":
            temp_name = generate_random_name_string('Numbers');
            break
        case "Random Letters":
            temp_name = generate_random_name_string('Letters');
            break
    }
    return temp_name;
}

function respawn() {
    check_and_save_name();
    let death_score = get_death_score();
    if (
        modules.Functional.Auto_respawn.settings.Auto_respawn.active &&
        player.is_connected &&
        !player.inGame
    ) {
        //prevent respawn after 300k flag
        if(modules.Functional.Auto_respawn.settings.Prevent.active && death_score != -1 && death_score >= 300000){
            return;
        }
        let type = modules.Functional.Auto_respawn.settings.Name.selected;
        let temp_name = get_respawn_name_by_type(type);
        if(predefined_functions.inputs_handler.player.spawn != null){
            predefined_functions.inputs_handler.player.spawn(temp_name);
        }
    }
}
setInterval(respawn, 100);

//4. Canvas display

//4.0 ctx helper functions
let ctx = window.canvas?.getContext('2d');
function await_canvas(){
    if(!window.canvas){
        return setTimeout(await_canvas, 100);
    }else{
        setTimeout(() => {
            ctx = window.canvas.getContext('2d');
            console.log('%cctx loaded!', 'color:purple', ctx);
            requestAnimationFrame(canvas_draw);
        }, 1000);
    }
}
await_canvas();

function ctx_arc(x, y, r, sAngle, eAngle, counterclockwise, c, stroke_or_fill = 'fill', _globalAlpha=1, _lineWidth = '2px') {
    if(!ctx instanceof CanvasRenderingContext2D) return
    let original_ga = ctx.globalAlpha;
    let original_lw = ctx.lineWidth;
    ctx.beginPath();
    ctx.arc(x, y, r, sAngle, eAngle, counterclockwise);
    ctx.globalAlpha = _globalAlpha;
    switch(stroke_or_fill){
        case "fill":
            ctx.fillStyle = c;
            ctx.fill();
            break
        case "stroke":
            ctx.lineWidth = _lineWidth;
            ctx.strokeStyle = c;
            ctx.stroke();
            ctx.lineWidth = original_lw;
            break
    }
    ctx.globalAlpha = original_ga;
}

function ctx_text(fcolor, scolor, lineWidth, font, text, textX, textY) {
    if(!(ctx instanceof CanvasRenderingContext2D)) return
    ctx.fillStyle = fcolor;
    ctx.lineWidth = lineWidth;
    ctx.font = font;
    ctx.strokeStyle = scolor;
    ctx.strokeText(`${text}`, textX, textY)
    ctx.fillText(`${text}`, textX, textY)
}

function ctx_rect(x, y, a, b, c) {
    if(!(ctx instanceof CanvasRenderingContext2D)) return
    ctx.beginPath();
    ctx.strokeStyle = c;
    ctx.strokeRect(x, y, a, b);
}

function transparent_rect_fill(x, y, a, b, scolor, fcolor, opacity){
    if(!(ctx instanceof CanvasRenderingContext2D)) return
    ctx.beginPath();
    ctx.rect(x, y, a, b);

    // Set stroke opacity
    ctx.globalAlpha = 1;// Reset to 1 for stroke, or set as needed
    ctx.strokeStyle = scolor;
    ctx.stroke();

    // Set fill opacity
    ctx.globalAlpha = opacity;// Set the opacity for the fill color
    ctx.fillStyle = fcolor;
    ctx.fill();

    // Reset globalAlpha back to 1 for future operations
    ctx.globalAlpha = 1;
}

//4.1 destroyer cooldown visualiser
let times_watcher = {
    waiting: false,
    cooldowns: [2540, 2311, 2201, 1911, 1760, 1681, 1560, 1381],
}

function draw_destroyer_cooldown(){
    let c = times_watcher.waiting? 'red' : 'lime' ;
    const x = dim_c.window_2_canvas(inputs.mouse.real.x);
    const y = dim_c.window_2_canvas(inputs.mouse.real.y);
    ctx_arc(x, y, 50, 0, 2 * Math.PI, false, c, 'fill', 0.3);
}

function handle_cooldown(_cd){
    times_watcher.waiting = true;
    setTimeout(() => {
        times_watcher.waiting = false;
    }, _cd);
}
document.body.addEventListener("mousedown", function(e) {
    if(e.button === 0 && !times_watcher.waiting && player.inGame){
        let _cd = times_watcher.cooldowns[modules.Visual.destroyer_cooldown.settings.reload.selected];
        handle_cooldown(_cd);
    }
});

document.body.addEventListener("keydown", function(e){
    if(e.keyCode === 32 && !times_watcher.waiting && player.inGame){
        let _cd = times_watcher.cooldowns[modules.Visual.destroyer_cooldown.settings.reload.selected];
        handle_cooldown(_cd);
    }
});

//4.999 canvas gui (try to keep this in the end)
function canvas_draw(){
    requestAnimationFrame(canvas_draw);
    //console.log('called canvas_draw', player.inGame, !!ctx, ctx instanceof CanvasRenderingContext2D);
    if (player.inGame && ctx && ctx instanceof CanvasRenderingContext2D) {
        //console.log('cond fullfilled');
        //ctx_rect(100, 150, 1000, 1500, 'pink');
            /*
            if(modules.Functional.Tank_upgrades.settings.visualise.active){
                visualise_tank_upgrades();
            }
            if (modules.Visual.Key_inputs_visualiser.active) {
                visualise_keys();
            }
            */
        if (modules.Visual.destroyer_cooldown.settings.destroyer_cooldown.active){
            draw_destroyer_cooldown();
        }
    }
}

//999. update player values
function update_player(){
    window.requestAnimationFrame(update_player);
    //console.log(player, predefined_functions.state_getter.wasm_communicator.doesHaveTank);
    if(predefined_functions.state_getter.wasm_communicator.doesHaveTank != null){
        player.inGame = predefined_functions.state_getter.wasm_communicator.doesHaveTank();
    }
    player.is_connected = !!get_partylink_div();
    let input_div = document.querySelector("#spawn-nickname");
    if(!!input_div){
        player.name = input_div.value;
    }
}
window.requestAnimationFrame(update_player);