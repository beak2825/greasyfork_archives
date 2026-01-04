// ==UserScript==
// @name         r!PsAw Multibox public
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  optimised multibox (no precise aim & move to mouse for now)
// @author       r!PsAw
// @match        https://diep.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521607/r%21PsAw%20Multibox%20public.user.js
// @updateURL https://update.greasyfork.org/scripts/521607/r%21PsAw%20Multibox%20public.meta.js
// ==/UserScript==

/*
TODO-List:
- finish importing world coordinates
 -> rework bot following other bots
- add Player detection tracers
- maybe add Tank upgrades option to auto upgrade to main tank

*/
//I do not recommend changing the code unless you understand it, since it might break
//In this code player is the tank that is running this code and clone usually is the main tab

//let other scripts know that this one is active
window.ripsaw_multibox = true;
const ctx = canvas.getContext('2d');
let you, him, inGame = false,
    connected = false;

function windowScaling() {
    const a = canvas.height / 1080;
    const b = canvas.width / 1920;
    return b < a ? a : b;
}

function window_2_canvas(a) {
    let b = a * (canvas.width / window.innerWidth);
    return b;
}

//options
let key_option = ["WASD", "Arrows"];
let mouse_modes = ["Copy", "Reversed"];
let movement_modes = ["Clump", "Copy"];
let repel_modes = ["long 50/50", "infinite 70/30", "infinity", "Necromancer"];

let config = {
    move_keys: key_option[0],
    copy_keys: false,
    copy_build: false,
    copy_mouse: false,
    movement_mode: movement_modes[0],
    mouse_mode: mouse_modes[0],
    afk: false,
    drone_repel: false,
    drone_repel_mode: repel_modes[0],
};

//GUI logic (visual menu)
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
    }
    setPosition(position, display, top, left, translate) {
        this.el.style.position = position;
        this.el.style.display = display;
        this.el.style.top = top;
        this.el.style.left = left;
        this.el.style.transform = "translate(" + translate + ")";
        this.display = display; //store last display
    }
    margin(top, left, right, bottom) {
        this.el.style.marginTop = top;
        this.el.style.marginLeft = left;
        this.el.style.marginRight = right;
        this.el.style.marginBottom = bottom;
    }
    setText(text, txt_color, font, fontsize, stroke, align) {
        this.el.innerHTML = text;
        this.el.style.color = txt_color;
        this.el.style.fontFamily = font;
        this.el.style.fontSize = fontsize;
        this.el.style.textShadow = stroke;
        this.el.style.textAlign = align;
    }
    add(parent) {
        parent.appendChild(this.el);
    }
    remove() {
        if (this.el.parentElement) {
            this.el.parentElement.removeChild(this.el);
            console.log("Element removed successfully.");
        } else {
            console.warn("Attempted to remove element, but it's not in the DOM.");
        }
    }

    toggle(showOrHide) {
        switch (showOrHide) {
            case "hide":
                this.el.display = "none";
                break;
            case "show":
                this.el.display = this.display;
                break;
        }
    }
}

class Setting {
    constructor(name, text, type, configsett, cycleArray = []) {
        this.sett = new El(name, "button", "Indigo", "100px", "60px", "0.75");
        this.sett.setPosition("relative", "block");
        this.sett.margin("20px", "10px", "10px", "20px");
        this.sett.setText(
            text,
            "white",
            "Lucida Console, Courier New, monospace",
            "15px",
            "0 0 2px gray",
            "center"
        );
        const element = this.sett.el; // Reference the DOM element
        element.onclick = () => {
            switch (type) {
                case "boolean":
                    config[configsett] = !config[configsett];
                    element.style.backgroundColor = config[configsett] ?
                        "Navy" :
                        "Indigo";
                    break;

                case "cycle": {
                    const currentIndex = cycleArray.indexOf(config[configsett]);
                    const nextIndex = (currentIndex + 1) % cycleArray.length;
                    config[configsett] = cycleArray[nextIndex];
                    element.innerHTML = `${text.split(":")[0]}: ${config[configsett]}`;
                }
                break;

                default:
                    console.error("Invalid setting type:", type);
                    break;
            }
        };
    }
    add(parent) {
        this.sett.add(parent);
    }
    remove() {
        this.sett.remove();
    }
    toggle(showOrHide) {
        this.sett.toggle(showOrHide);
    }
}

let gui_loaded = false;
let hidden = false;

function load_GUI() {
    //define everything
    if (!gui_loaded) {
        let sett_classes = [];

        let cont = new El("Mb Container", "div", "purple", "350px", "675x", "0.75");
        cont.setPosition("absolute", "block", "50%", "100%", "-50%, -50%");

        let credit = new El(
            "credit Element",
            "div",
            "transparent",
            "150px",
            "25px",
            "0.75"
        );
        credit.setText(
            "Multibox by r!PsAw",
            "white",
            "Lucida Console, Courier New, monospace",
            "20px",
            "0 0 2px red",
            "center"
        );
        credit.setPosition("relative", "block");

        let mk_setting = new Setting(
            "Move Keys",
            `Move Keys: ${config.move_keys}`,
            "cycle",
            "move_keys",
            key_option
        );
        sett_classes.push(mk_setting);

        let ck_setting = new Setting(
            "Copy Keys",
            "Copy Keys",
            "boolean",
            "copy_keys"
        );
        sett_classes.push(ck_setting);

        let cb_setting = new Setting(
            "Copy Build",
            "Copy Build",
            "boolean",
            "copy_build"
        );
        sett_classes.push(cb_setting);

        let cm_setting = new Setting(
            "Copy Mouse",
            "Copy Mouse",
            "boolean",
            "copy_mouse"
        );
        sett_classes.push(cm_setting);


        let mvm_setting = new Setting(
            "Movement Mode",
            `Movement: ${config.movement_mode}`,
            "cycle",
            "movement_mode",
            movement_modes
        );
        sett_classes.push(mvm_setting);


        let mm_setting = new Setting(
            "Mouse Mode",
            `Mouse Mode: ${config.mouse_mode}`,
            "cycle",
            "mouse_mode",
            mouse_modes
        );
        sett_classes.push(mm_setting);

        let afk_setting = new Setting("Afk", "Afk", "boolean", "afk");
        sett_classes.push(afk_setting);

        let dr_setting = new Setting(
            "Drone Repel",
            "Repel Drones",
            "boolean",
            "drone_repel"
        );
        sett_classes.push(dr_setting);

        let dm_setting = new Setting(
            "Drone Repel Modes",
            `Repel Mode: ${config.drone_repel_mode}`,
            "cycle",
            "drone_repel_mode",
            repel_modes
        );
        sett_classes.push(dm_setting);
        //load elements if unloaded
        cont.add(document.body);
        credit.add(cont.el);
        let l = sett_classes.length;
        for (let i = 0; i < l; i++) {
            sett_classes[i].add(cont.el);
        }
        gui_loaded = true;
    }
}

//mouse
function click_at(x, y, delay1 = 150) {
    input.onTouchStart(-1, x, y);
    setTimeout(() => {
        input.onTouchEnd(-1, x, y);
    }, delay1);
}

function ghost_click_at(x, y, delay1 = 150) {
    input.onTouchStart(0, x, y);
    setTimeout(() => {
        input.onTouchEnd(0, x, y);
    }, delay1);
}

function mouse_move(x, y) {
    input.onTouchMove(-1, x, y);
}

//define keys
const RAW_MAPPING = [
    "KeyA",
    "KeyB",
    "KeyC",
    "KeyD",
    "KeyE",
    "KeyF",
    "KeyG",
    "KeyH",
    "KeyI",
    "KeyJ",
    "KeyK",
    "KeyL",
    "KeyM",
    "KeyN",
    "KeyO",
    "KeyP",
    "KeyQ",
    "KeyR",
    "KeyS",
    "KeyT",
    "KeyU",
    "KeyV",
    "KeyW",
    "KeyX",
    "KeyY",
    "KeyZ",
    "ArrowUp",
    "ArrowLeft",
    "ArrowDown",
    "ArrowRight",
    "Tab",
    "Enter",
    "NumpadEnter",
    "ShiftLeft",
    "ShiftRight",
    "Space",
    "Numpad0",
    "Numpad1",
    "Numpad2",
    "Numpad3",
    "Numpad4",
    "Numpad5",
    "Numpad6",
    "Numpad7",
    "Numpad8",
    "Numpad9",
    "Digit0",
    "Digit1",
    "Digit2",
    "Digit3",
    "Digit4",
    "Digit5",
    "Digit6",
    "Digit7",
    "Digit8",
    "Digit9",
    "F2",
    "End",
    "Home",
    "Semicolon",
    "Comma",
    "NumpadComma",
    "Period",
    "Backslash",
]

function key_down(keyString) {
    const index = RAW_MAPPING.indexOf(keyString);
    if (index === -1) {
        console.error(`Invalid key string: ${keyString}`);
        return;
    }
    const result = index + 1; // Add 1 to the index as per your requirement
    input.onKeyDown(result);
}

function key_up(keyString) {
    const index = RAW_MAPPING.indexOf(keyString);
    if (index === -1) {
        console.error(`Invalid key string: ${keyString}`);
        return;
    }
    const result = index + 1; // Add 1 to the index as per your requirement
    input.onKeyUp(result);
}

function key_press(keyString, delay = 100) {
    key_down(keyString);
    setTimeout(() => {
        key_up(keyString)
    }, delay);
}

//those are updating player.keys when the script executes them
/*
function script_key_down(keyString, player) {
    const index = RAW_MAPPING.indexOf(keyString);
    player.keys[index] = 1;
    //console.log(`index ${index} player.keys[index] ${player.keys[index]} keyString ${keyString}`);
    key_down(keyString);
}

function script_key_up(keyString, player) {
    const index = RAW_MAPPING.indexOf(keyString);
    player.keys[index] = 0;
    //console.log(`index ${index} player.keys[index] ${player.keys[index]} keyString ${keyString}`);
    key_up(keyString);
}
*/

//credits to mi300
const ARENA_WIDTH = 26000;
const ARENA_HEIGHT = 26000;
let minimapArrow = [0, 0];
let square_pos = [0, 0]
let leaderArrow = [0, 0];
let minimapPos = [0, 0];
let minimapDim = [0, 0];
let calls = 0;
let points = [];

function hook(target, callback) {

    function check() {
        window.requestAnimationFrame(check);
        if (window.arrows) {
            minimapArrow[0] = window.arrows[0][0];
            minimapArrow[1] = window.arrows[0][0];
            minimapPos[0] = window.arrows[2][0];
            minimapPos[1] = window.arrows[2][1];
            minimapDim[0] = window.arrows[3][0];
            minimapDim[1] = window.arrows[3][1];
            //console.warn("[r!PsAw] canceled!");
            //console.log(minimapArrow);
            return;
        }
        const func = CanvasRenderingContext2D.prototype[target]

        if (func.toString().includes(target)) {

            CanvasRenderingContext2D.prototype[target] = new Proxy(func, {
                apply(method, thisArg, args) {
                    callback(thisArg, args)

                    return Reflect.apply(method, thisArg, args)
                }
            });
        }
    }
    window.requestAnimationFrame(check)
}

hook('beginPath', function(thisArg, args) {
    calls = 1;
    points = [];
});
hook('moveTo', function(thisArg, args) {
    if (calls == 1) {
        calls += 1;
        points.push(args)
    } else {
        calls = 0;
    }
});
hook('lineTo', function(thisArg, args) {
    if (calls >= 2 && calls <= 6) {
        calls += 1;
        points.push(args)
    } else {
        calls = 0;
    }
});


function getCentre(vertices) {
    let centre = [0, 0];
    vertices.forEach(vertex => {
        centre[0] += vertex[0]
        centre[1] += vertex[1]
    });
    centre[0] /= vertices.length;
    centre[1] /= vertices.length;
    return centre;
}

hook('fill', function(thisArg, args) {
    if (calls >= 4 && calls <= 6) {
        if (!window.M_X && thisArg.fillStyle === "#000000" && thisArg.globalAlpha > 0.9) {
            minimapArrow = getCentre(points);
            return;
        }
    } else {
        calls = 0;
    }
});

hook('strokeRect', function(thisArg, args) {
    const t = thisArg.getTransform();
    minimapPos = [t.e, t.f];
    minimapDim = [t.a, t.d];
});

//detect if focused
let is_main = document.hasFocus();

function setFocusState(isFocused) {
    is_main = isFocused;
}
window.addEventListener('focus', () => setFocusState(true));
window.addEventListener('blur', () => setFocusState(false));

//status(0) = is in game? status(1) = is connected? everything else returns null
function status(type) {
    let s;
    switch (type) {
        case 0:
            s = extern.doesHaveTank() > 0;
            break
        case 1:
            s = !!window.lobby_ip;
            break
    }
    return s;
}

//create ingame Notifications
function rgbToNumber(r, g, b) {
    return (r << 16) | (g << 8) | b;
}
const notification_rbgs = {
    require: [255, 165, 0], //orange
    warning: [255, 0, 0], //red
    normal: [0, 0, 128] //blue
}

let notifications = [];

function new_notification(text, color, duration) {
    input.inGameNotification(text, color, duration);
}

function one_time_notification(text, color, duration){
    if(notifications.includes(text)){
        return;
    }
    if(!inGame){
        notifications = [];
    }else{
        new_notification(text, color, duration);
        notifications.push(text);
    }
}

//FOV finder
let FOV = 0.55;
let fov_factors = [0.699, 0.8, 0.85, 0.899];
let fov_tanks = {
    0.699: ["Ranger"],
    0.8: ["Assassin", "Stalker"],
    0.85: ["Predator", "Streamliner", "Hunter"],
    0.899: ["Sniper", "Overseer", "Overlord", "Necromancer", "Manager", "Trapper", "Gunner Trapper", "Overtrapper", "Mega Trapper", "Tri-Trapper", "Smasher", "Landmine", "Streamliner", "Auto Trapper", "Battleship", "Auto Smasher", "Spike", "Factory", "Skimmer", "Glider", "Rocketeer"]
};

function find_fieldFactor(tank) {
    let fieldFactor = 1;
    let l = fov_factors.length;
    for (let i = 0; i < l; i++) {
        if (fov_tanks[fov_factors[i]].includes(tank)) {
            fieldFactor = fov_factors[i];
        }
    }
    return fieldFactor;
}

function calculateFOV(Fv, l) {
    const numerator = 0.55 * Fv;
    const denominator = Math.pow(1.01, (l - 1) / 2);
    return (numerator / denominator);
}

const crx = CanvasRenderingContext2D.prototype;
let diepFont = "20"; //I'm just assigning some value to it here, so it's not null or undefined
let sf = {
    autoFire: false,
    autoSpin: false
};

//this function is for both main and slave tab
function update_sf(state, f_or_s) {
    switch (state) {
        case " ON":
            sf[f_or_s] = true;
            break
        case " OFF":
            sf[f_or_s] = false;
            break
    }
}



crx.fillText = new Proxy(crx.fillText, {
    apply: function(f, _this, args) {
        //detect Auto Spin & Auto Fire
        if (args[0] === "diep.io") {
            diepFont = _this.font.split("px")[0];
        }
        if (args[0].includes("Auto Fire: ") && _this.font.split("px")[0] === diepFont) {
            update_sf(args[0].split(':')[1], "autoFire");
        }
        if (args[0].includes("Auto Spin: ") && _this.font.split("px")[0] === diepFont) {
            update_sf(args[0].split(':')[1], "autoSpin");
        }
        //detect data for FOV
        if (args[0].startsWith("Lvl ") && inGame) {
            let words = args[0].split(" ");
            let level = words[1];
            let tank = words.slice(2).join(" ").trim();
            let fieldFactor = find_fieldFactor(tank);
            FOV = calculateFOV(fieldFactor, level);
            you.fov = FOV;
            console.log(`
            %c[r!PsAw Multibox] FOV value was changed, look :0

            tank: ${tank}
            level: ${level}
            fieldFactor: ${fieldFactor}
            FOV: ${you.fov}
            `, "color: purple");
        }

        f.apply(_this, args);
    }
});

//share & recieve information across tabs
/*
keys index explanation:
 0: 0 = undefined, 1 = wasd, 2 = arrow keys
value 0 for unpressed and 1 for pressed:
 1: rest_keys[0]
 2: rest_keys[1]
 3: rest_keys[2]
 4: rest_keys[3]
 5: Shift (Triggered by ShiftLeft, ShiftRight or Right Mouse click
 6: Space (Triggered by Space and Left Mouse Click)
 7: Backslash (since sandbox arena is unusual, it breaks the world coords system, so it won't be used for now)
auto Fire & Auto Spin (0 for off and 1 for on):
 8: Auto Fire
 9: Auto Spin

This setup reduces number of transfered values from 64 to 10
Because the build is stored in a different array
*/
class Player {
    constructor() {
        this.pos_xy = new Uint16Array(2); //remake in world coords
        this.afk_xy = new Uint16Array(2); //remake in world coords
        this.mouse_xy = new Uint16Array(4); //last 2 should be world coords
        this.keys = new Uint8Array(10);
        this.build = new Uint8Array(33);
        this.windowSizes = new Uint16Array(2);
        this.minimapScale = new Uint16Array(4);
        this.fov = FOV;
    }
}

function update_move_keys(player){
    let bool = 0;
    if(key_option.includes(config.move_keys)){
        bool = key_option.indexOf(config.move_keys)+1;
    }
    player.keys[0] = bool;
    //console.log(player.keys[0]);
}

function update_build(player) {
    player.build.fill(0);
    let raw = extern.get_convar("game_stats_build");
    let temp_arr = [...raw];
    let l = temp_arr.length;
    for (let i = 0; i < l; i++) {
        player.build[i] = temp_arr[i];
    }
}

/* OLD VERSION (with converter to 1/2/3/4/5/6/7/8)
function update_build(player) {
    player.build.fill(0);
    let raw = extern.get_convar("game_stats_build");
    let temp_arr = [...raw];
    let l = temp_arr.length;
    for (let i = 0; i < l; i++) {
        let increase_index = parseFloat(temp_arr[i]);
        player.build[increase_index - 1]++;
    }
}
*/

function update_pos(player) {
    player.pos_xy[0] = Math.floor(minimapArrow[0]);
    player.pos_xy[1] = Math.floor(minimapArrow[1]);
    //console.log(player.pos_xy);
}

function update_minimap_Scale(player) {
    player.minimapScale[0] = minimapPos[0];
    player.minimapScale[1] = minimapPos[1];
    player.minimapScale[2] = minimapDim[0];
    player.minimapScale[3] = minimapDim[1];
}

function update_window_sizes(player) {
    player.windowSizes[0] = window.innerWidth;
    player.windowSizes[1] = window.innerHeight;
}

function save_sf(player){
    player.keys[8] = sf.autoFire?1:0;
    player.keys[9] = sf.autoSpin?1:0;
    //console.log(player.keys);
}

function save_info(player) {
    localStorage.setItem("Multibox Player", JSON.stringify(player));
}

function get_info() {
    return JSON.parse(localStorage.getItem("Multibox Player"));
}

//define some values
let wasd = ["KeyW", "KeyA", "KeyS", "KeyD"];
let arrows = ["ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"];
let build_keys = [
    "KeyU",
    "KeyM",
    "Numpad1",
    "Numpad2",
    "Numpad3",
    "Numpad4",
    "Numpad5",
    "Numpad6",
    "Numpad7",
    "Numpad8",
    "Digit1",
    "Digit2",
    "Digit3",
    "Digit4",
    "Digit5",
    "Digit6",
    "Digit7",
    "Digit8", ];

function move_keys() {
    switch (config.move_keys) {
        case "WASD":
            return wasd;
            break
        case "Arrows":
            return arrows;
            break
    }
}

function rest_keys() { //opposite to move_keys
    switch(config.move_keys){
        case "WASD":
            return arrows;
            break
        case "Arrows":
            return wasd;
            break
    }
}

//copy clone values

function copy_key_inputs(player) {
    //OLD
    /*
    for (let i = 0; i < RAW_MAPPING.length; i++) {
        const keyString = RAW_MAPPING[i];
        if (!keyString) {
            console.error(`Invalid keyString at index ${i}`);
            continue;
        }

        switch (player.keys[i]) {
            case 0:
                if (!rest_keys().includes(keyString) && !build_keys.includes(keyString)) { //DO NOT copy wasd/arrow keys OR build keys
                    key_up(keyString);
                }
                break;
            case 1:
                if (!rest_keys().includes(keyString) && !build_keys.includes(keyString)) { //DO NOT copy wasd/arrow keys OR build keys
                    key_down(keyString);
                    //console.log(keyString);
                }
                break;
            default:
                console.error(`Unexpected value for player.keys[${i}]: ${player.keys[i]}`);
        }
    }
    */
    //NEW
    for(let i = 1; i < 8; i++){
        copy_key_sub_func(i, player);
    }
}

function copy_key_sub_func(index, player){
    if(index < 5 && config.movement_mode != "Copy"){
        return;
    }
    let mk = move_keys();
    let allowed_keys = [mk[0], mk[1], mk[2], mk[3], "ShiftLeft", "Space", "Backslash"];
    let key = allowed_keys[index-1];
    if(player.keys[index] === 0){
        key_up(key);
    }else{
        key_down(key);
    }
}

//scaling from window to window
function scaleCoordinates(sourceX, sourceY, sourceWidth, sourceHeight, targetWidth, targetHeight) {
    // Scale factors for width and height
    const scaleX = targetWidth / sourceWidth;
    const scaleY = targetHeight / sourceHeight;

    // Scale the coordinates
    const scale = Math.min(scaleX, scaleY);
    const targetX = sourceX * scale;
    const targetY = sourceY * scale;


    return {
        x: targetX,
        y: targetY
    };
}

//copy mouse coords
function get_invert_mouse_coords(x, y, width, height) {
    let center = {
        x: width / 2,
        y: height / 2
    };
    let d = {
        x: x - center.x,
        y: y - center.y
    };
    let inverted_coords = {
        x: center.x - d.x,
        y: center.y - d.y
    };
    return inverted_coords;
}

function copy_mouse_inputs(player, clone) {
    console.log("copying inputs");
    switch (config.mouse_mode) {
        case "Copy": {
            console.log("Copy");
            let final = scaleCoordinates(clone.mouse_xy[0], clone.mouse_xy[1], clone.windowSizes[0], clone.windowSizes[1], player.windowSizes[0], player.windowSizes[1]);
            console.log(final);
            mouse_move(final.x, final.y);
        }
        break
        case "Reversed": { //haven't tested yet
            let modified = get_invert_mouse_coords(clone.mouse_xy[0], clone.mouse_xy[1], clone.windowSizes[0], clone.windowSizes[1]);
            let final = scaleCoordinates(modified.x, modified.y, clone.windowSizes[0], clone.windowSizes[1], player.windowSizes[0], player.windowSizes[1]);
            mouse_move(final.x, final.y);
        }
        break
    }
}

//update your values
//const KEY_MAP = new Map(RAW_MAPPING.map((key, index) => [key, index]));
window.addEventListener('keydown', function(e) {
    //OLD
    /*
    if (connected && inGame && is_main) {
        if (move_keys().includes(e.code) || build_keys.includes(e.code)) {
            return; //don't copy wasd/arrows or build keys
        }
        if (e.code === "KeyQ") {
            hidden = !hidden;
            toggle_GUI(hidden);
        }
        let index = KEY_MAP.get(e.code);
        if (index !== undefined) {
            you.keys[index] = 1;
            //console.log(`pressed ${e.code} status ${you.keys[index]} index ${index}`);
        }
    }
    */
    //NEW
    if (connected && is_main) {
        if (e.code === "KeyQ") {
            hidden = !hidden;
            toggle_GUI(hidden);
        }
        if(inGame){
            if(move_keys().includes(e.code)){
                let index = move_keys().indexOf(e.code);
                you.keys[index+1] = 1;
                //console.log(you.keys);
            }
            if(rest_keys().includes(e.code)){
                let rest_move = ["W, A, S, D", "Arrow Keys"];
                if(rest_keys()[0] === "KeyW"){
                    new_notification(`Warning, you are using ${rest_move[0]}, use ${rest_move[1]} instead OR change your move keys to ${rest_move[0]}`, rgbToNumber(243, 185, 26), 5000);
                }else{
                    new_notification(`Warning, you are using ${rest_move[1]}, use ${rest_move[0]} instead OR change your move keys to ${rest_move[1]}`, rgbToNumber(243, 185, 26), 5000);
                }
            }
            if(e.code === "Space"){
                you.keys[6] = 1;
                //console.log(you.keys);
            }
            if(e.code === "ShiftLeft" || e.code === "ShiftRight"){
                you.keys[5] = 1;
                //console.log(you.keys);
            }
            if(e.code === "Backslash"){
                you.keys[7] = 1;
                //console.log(you.keys);
            }
        }
    }
});

window.addEventListener('keyup', function(e) {
    //OLD
    /*
    if (connected && inGame && is_main) {
        let index = KEY_MAP.get(e.code);
        if (index !== undefined) {
            you.keys[index] = 0;
            //console.log(`unpressed ${e.code} status ${you.keys[index]} index ${index}`);
        }
    }
    */
    //NEW
    if (connected && inGame && is_main) {
        if(move_keys().includes(e.code)){
            let index = move_keys().indexOf(e.code);
            you.keys[index+1] = 0;
            //console.log(you.keys);
        }
        if(e.code === "Space"){
            you.keys[6] = 0;
            //console.log(you.keys);
        }
        if(e.code === "ShiftLeft" || e.code === "ShiftRight"){
            you.keys[5] = 0;
            //console.log(you.keys);
        }
        if(e.code === "Backslash"){
            you.keys[7] = 0;
            //console.log(you.keys);
        }
    }
});

window.addEventListener('mousemove', function(e) {
    if (connected && inGame && is_main) {
        you.mouse_xy[0] = e.clientX;
        you.mouse_xy[1] = e.clientY;
        //console.log(you.mouse_xy);
    }
});

window.addEventListener("mousedown", function(e) {
    if (connected && inGame && is_main) {
        if (e.button === 0){
            you.keys[6] = 1;
            //console.log(you.keys);
        }
        if (e.button === 2) {
            you.keys[5] = 1;
            //console.log(you.keys);
        }
    }
});

window.addEventListener("mouseup", function(e) {
    if (connected && inGame && is_main) {
        if (e.button === 0){
            you.keys[6] = 0;
            //console.log(you.keys);
        }
        if (e.button === 2) {
            you.keys[5] = 0;
            //console.log(you.keys);
        }
    }
});

//copy build
function read_build(player) {
    let buildStr = "";
    for (let i = 0; i < 33; i++) {
        if (player.build[i] === 0) {
            break
        }
        buildStr += player.build[i];
    }
    return buildStr;
}

function copy_build(string) {
    extern.execute(`game_stats_build ${string}`);
}

//AFK logic
let moving = false;
let goal = {
    x: 0,
    y: 0
};

function set_goal(x, y) {
    goal.x = x;
    goal.y = y;
}

function move_to_goal(player) {
    if (config.afk) {
        if (player.pos_xy[0] > goal.x) {
            key_up(rest_keys()[3]);
            key_down(rest_keys()[1]);
        } else {
            key_up(rest_keys()[1]);
            key_down(rest_keys()[3]);
        }
        if (player.pos_xy[1] > goal.y) {
            key_up(rest_keys()[2]);
            key_down(rest_keys()[0]);
        } else {
            key_up(rest_keys()[0]);
            key_down(rest_keys()[2]);
        }
        moving = true;
    } else {
        if (moving) {
            for (let i = 0; i < rest_keys().length; i++) {
                key_up(rest_keys()[i]);
            }
            moving = false;
        }
        set_goal(player.pos_xy[0], player.pos_xy[1]);
    }
}

//Tank Clump (enabled when copy keys enabled)
let debug = [
    0,
    0,
    0,
    0
];

function scale_minimap(PlayerInfo, CloneInfo) {
    //NOTE: This is only possible, because minimap is a square

    //player
    let pos1 = {
        x: PlayerInfo[0],
        y: PlayerInfo[1]
    };
    let m_pos1 = {
        x: PlayerInfo[2],
        y: PlayerInfo[3]
    };
    let m_dim1 = {
        w: PlayerInfo[4],
        h: PlayerInfo[5]
    };
    console.log("PlayerInfo");
    console.log(PlayerInfo);

    //clone
    let pos2 = {
        x: CloneInfo[0],
        y: CloneInfo[1]
    };
    let m_pos2 = {
        x: CloneInfo[2],
        y: CloneInfo[3]
    };
    let m_dim2 = {
        w: CloneInfo[4],
        h: CloneInfo[5]
    };
    console.log("CloneInfo");
    console.log(CloneInfo);

    //translate clone coords into player coords
    let distance_2_mpos = {
        x: pos2.x - m_pos2.x,
        y: pos2.y - m_pos2.y
    };
    let calc_percentage = {
        x: (distance_2_mpos.x / m_dim2.w) * 100,
        y: (distance_2_mpos.y / m_dim2.h) * 100
    };

    //use % from clone and transfer to player
    let scaled_clone = {
        x: m_pos1.x + (m_dim1.w / 100 * calc_percentage.x),
        y: m_pos1.y + (m_dim1.h / 100 * calc_percentage.y)
    }
    debug[0] = window_2_canvas(pos1.x);
    debug[1] = window_2_canvas(pos1.y);
    debug[2] = window_2_canvas(scaled_clone.x);
    debug[3] = window_2_canvas(scaled_clone.y);
    return scaled_clone;
}

function clump(player, clone) {
    if (config.copy_keys && config.movement_mode === "Clump") {
        if(config.afk){
            one_time_notification("Disabled Clump since you have afk on :)", rgbToNumber(243, 185, 26), 5000);
            if (moving) {
            for (let i = 0; i < move_keys().length; i++) {
                script_key_up(move_keys()[i], player);
            }
            moving = false;
            }
            return;
        }

        let scaled_clone = scale_minimap([
            player.pos_xy[0], player.pos_xy[1],
            player.minimapScale[0], player.minimapScale[1],
            player.minimapScale[2], player.minimapScale[3]
        ], [
            clone.pos_xy[0], clone.pos_xy[1],
            clone.minimapScale[0], clone.minimapScale[1],
            clone.minimapScale[2], clone.minimapScale[3]
        ]);
        console.log(`
        you ${player.pos_xy}
        clone ${scaled_clone.x} ${scaled_clone.y}
        1st cond ${player.pos_xy[0] > scaled_clone.x}
        2nd cond ${player.pos_xy[1] > scaled_clone.y}
        `);

        if (player.pos_xy[0] > scaled_clone.x) {
            key_up(rest_keys()[3]);
            key_down(rest_keys()[1]);
        } else {
            key_up(rest_keys()[1]);
            key_down(rest_keys()[3]);
        }
        if (player.pos_xy[1] > scaled_clone.y) {
            key_up(rest_keys()[2]);
            key_down(rest_keys()[0]);
        } else {
            key_up(rest_keys()[0]);
            key_down(rest_keys()[2]);
        }
        moving = true;
    } else {
        if (moving) {
            for (let i = 0; i < move_keys().length; i++) {
                key_up(move_keys()[i]);
            }
            moving = false;
        }
        set_goal(player.pos_xy[0], player.pos_xy[1]);
    }
}

//toggle GUI
function toggle_GUI(state) {
    let cont = document.getElementById("mb-container");
    if (state) {
        cont.style.display = "none";
    } else {
        cont.style.display = "block";
    }
}

//Drone Repel
let timings = { //long 50/50 by default
    main: 50000,
    inside: 25000
}

let reset_finished = false;

function repel_loop() {
    if (inGame && config.drone_repel) {
        reset_finished = false;
        key_down("ShiftLeft");
        setTimeout(() => {
           key_up("ShiftLeft");
        }, timings.inside);
    } else {
        if (!reset_finished) {
            key_up("ShiftLeft");
            reset_finished = true;
        }
    }
}
setInterval(repel_loop, timings.main);

function update_timings() {
    switch (config.drone_repel_mode) {
        case "long 50/50":
            timings.main = 50000;
            timings.inside = 25000;
            break
        case "infinite 70/30":
            timings.main = 10000;
            timings.inside = 7000;
            break
        case "infinity":
            timings.main = 100000;
            timings.inside = 99999;
            break
        case "Necromancer":
            timings.main = 50000;
            timings.inside = 20000;
            break
    }
}

//replace move keys of every clone to your main move keys
function new_move_keys(player, clone){
    if(player.keys[0] != clone.keys[0]){
        let btn = document.getElementById("move-keys");
        let index = clone.keys[0]-1;
        config.move_keys = key_option[index];
        btn.innerHTML = `Move Keys: ${key_option[index]}`;
    }
}

//this loop will handle your auto fire + auto spin, separately from init
function handle_sf(){
    if(connected && inGame && config.copy_keys){
        if(!is_main){
            if(you.keys[8] != him.keys[8]){
                key_press("KeyE");
                you.keys[8] = him.keys[8];
            }
            if(you.keys[9] != him.keys[9]){
                key_press("KeyC");
                you.keys[9] = him.keys[9];
            }
        }
    }
}

setInterval(handle_sf, 2500);

//initialise (I luv this shit)
function init() {
    window.requestAnimationFrame(init);
    inGame = status(0);
    connected = status(1);
    if (connected) {
        if (!you) {
            you = new Player();
            console.log("%c[r!PsAw] Player found, reading info for multibox... ^w^", "color: green");
        }
        load_GUI();
        if (inGame) {
            update_move_keys(you);
            update_build(you);
            update_window_sizes(you);
            update_minimap_Scale(you);
            update_pos(you);
            move_to_goal(you);
            update_timings();
            if (is_main) {
                save_sf(you);
                save_info(you);
            } else {
                him = get_info();
                if (config.copy_keys) {
                    copy_key_inputs(him);
                    clump(you, him);
                }
                new_move_keys(you, him);
                config.copy_build ? copy_build(read_build(him)) : null;
                config.copy_mouse ? copy_mouse_inputs(you, him) : null;
            }
        }else{
            update_sf(" OFF", "autoFire");
            update_sf(" OFF", "autoSpin");
        }
    }
}
window.requestAnimationFrame(init);

//canvas debug

setTimeout(() => {
    let gui = () => {
        if (!is_main) {
            ctx.beginPath();
            ctx.moveTo(debug[0], debug[1]);
            ctx.lineTo(debug[2], debug[3]);
            ctx.strokeStyle = "black";
            ctx.stroke();
        }
        window.requestAnimationFrame(gui);
    };
    gui();
    setTimeout(() => {
        gui();
    }, 5000);
}, 1000);