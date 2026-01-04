// ==UserScript==
// @name        Infinite Page Scroll
// @description Scroll the page by holding the 'G' key and dragging your mouse! Change the speed by scrolling the mouse wheel! Done scrolling? Release the 'G' key! Want to change settings, click "Open Settings" in TamperMonkey menu!
// @namespace   q2p
// @license     Creative Commons Zero v1.0 Universal
// @author      q2p
// @version     2.1.0
// @match       *://*/*
// @run-at      document-idle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/456573/Infinite%20Page%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/456573/Infinite%20Page%20Scroll.meta.js
// ==/UserScript==

'use strict';
function on_vis_change() {
if (document.visibilityState !== "visible") {
return
}
document.removeEventListener("visibilitychange", on_vis_change)
const css_reset = {
    "padding": "0",
    "margin": "0",
};
function wipe_els(el) {
    while (el.hasChildNodes()) {
        el.lastChild.remove();
    }
}
function is_editable(e) {
    return (e !== null &&
        e instanceof HTMLElement && (e.tagName === "INPUT" ||
        e.tagName === "TEXTAREA" ||
        e.isContentEditable));
}
function no_selection(e) {
    return !is_editable(e.target) && !is_editable(document.activeElement);
}
function apply_styles(el, styles) {
    for (const key in styles) {
        el.style.setProperty(key, styles[key], "important");
    }
}

const mouse = { x: 0, y: 0 };
class Bool {
    name;
    def;
    value;
    constructor(name, def) {
        this.name = name;
        this.def = def;
        this.value = def;
    }
    deserialize(bool) {
        if (typeof bool !== "boolean") {
            return false;
        }
        this.value = bool;
        return true;
    }
    render() {
        const input = document.createElement("input");
        input.type = "checkbox";
        input.checked = this.value;
        apply_styles(input, {
            ...css_reset,
            "display": "inline-block",
            "box-sizing": "border-box",
        });
        input.addEventListener("input", () => {
            this.value = input.checked;
            saver.queue();
        });
        return [label(`${this.name} (default: ${this.def})`), input];
    }
}
class Num {
    name;
    def;
    min;
    max;
    value;
    constructor(name, def, min, max) {
        this.name = name;
        this.def = def;
        this.min = min;
        this.max = max;
        this.value = def;
    }
    deserialize(number) {
        if (typeof number !== "number") {
            return false;
        }
        const value = this.validate(number);
        if (value === undefined) {
            return false;
        }
        this.value = value;
        return true;
    }
    render() {
        const input = document.createElement("input");
        input.type = "number";
        if (Number.isInteger(this.value)) {
            input.value = this.value.toString();
        }
        else {
            input.value = this.value.toFixed(2);
        }
        apply_styles(input, {
            ...css_reset,
            "display": "block",
            "width": "100%",
            "box-sizing": "border-box",
        });
        input.addEventListener("input", () => {
            const new_number = this.validate(parseFloat(input.value));
            if (new_number === undefined) {
                apply_styles(input, {
                    "outline": "red solid",
                });
            }
            else {
                this.value = new_number;
                apply_styles(input, {
                    "outline": "none",
                });
                saver.queue();
            }
        });
        return [label(`${this.name} (min: ${this.min}, max: ${this.max}, default: ${this.def})`), input];
    }
    validate(number) {
        if (!Number.isFinite(number) || Number.isNaN(number) || number < this.min || number > this.max) {
            return undefined;
        }
        return number;
    }
}

const resolved_promise = Promise.resolve();
new TextEncoder();
new TextDecoder("utf-8", { fatal: true });
function clamp(min, value, max) {
    if (value <= min) {
        return min;
    }
    if (value >= max) {
        return max;
    }
    return value;
}
function do_once(action) {
    let is_done = false;
    let result;
    return function () {
        if (!is_done) {
            result = action.apply(this, arguments);
            is_done = true;
        }
        return result;
    };
}
function lerp(a, b, t) {
    return (1 - t) * a + t * b;
}

const sensitivity$1 = new Num("Default sensitivity", 2, -16, 16);
const min_sensitivity = new Num("Min sensitivity", -2, -16, 16);
const max_sensitivity = new Num("Max sensitivity", 4, -16, 16);
const sensitivity_change_on_scroll = new Num("Sensitivity change on scroll", 0.005, 0.0001, 32);
let scroll_want_lock = false;
let scroll_timeout;
const mouse_timeout_ms = 50;
class DragSpin {
    name = "Drag";
    parameters = [sensitivity$1, min_sensitivity, max_sensitivity, sensitivity_change_on_scroll];
    begin() {
        if (!scroll_want_lock) {
            scroll_want_lock = true;
            requeue_timeout();
            try {
                document.body.requestPointerLock();
            }
            catch (_) { }
        }
    }
    mouse_move(delta) {
        if (scroll_want_lock && scroll_timeout === undefined && is_pointer_locked()) {
            const dist = Math.hypot(delta.x, delta.y);
            if (dist <= 128) {
                const mouse_scroll_speed = (2 ** sensitivity$1.value);
                send_scroll(delta.x * mouse_scroll_speed, delta.y * mouse_scroll_speed);
            }
        }
    }
    wheel(delta) {
        if (scroll_want_lock && scroll_timeout === undefined && is_pointer_locked()) {
            sensitivity$1.value = clamp(min_sensitivity.value, sensitivity$1.value - sensitivity_change_on_scroll.value * delta, max_sensitivity.value);
        }
    }
    cancel_scroll() {
        if (scroll_want_lock) {
            scroll_want_lock = false;
            requeue_timeout();
            try {
                document.exitPointerLock();
            }
            catch (_) { }
        }
    }
}
function dequeue_timeout() {
    if (scroll_timeout !== undefined) {
        try {
            clearTimeout(scroll_timeout);
        }
        catch (_) { }
        scroll_timeout = undefined;
    }
}
function requeue_timeout() {
    if (scroll_timeout !== undefined) {
        try {
            clearTimeout(scroll_timeout);
        }
        catch (_) { }
    }
    scroll_timeout = setTimeout(dequeue_timeout, mouse_timeout_ms);
}
function is_pointer_locked() {
    return document.pointerLockElement === document.body;
}
addEventListener("load", () => {
    addEventListener("pointerlockchange", requeue_timeout);
}, { once: true });

const scroll_use_accel = new Bool("Use acceleration", true);
const step = new Num("Step", 12, 12, 12);
const sensitivity = new Num("Sensitivity", 0.05, 0.001, 1000);
const scroll_ease = new Num("Scroll Ease", 48, 48, 48);
const rubberband = new Num("Rubberband", 128, 128, 128);
const friction = new Num("Friction", 0.3, 0.001, 0.999);
let travel = 0;
let previous_time;
let acceleration = 0;
const scroll_points = [-1e6, -1e6, -1e6, -1e6, -1e6, -1e6];
let scroll_raf;
class AccelSpin {
    name = "Accelerating spin (broken)";
    parameters = [scroll_use_accel, sensitivity, step, scroll_ease, rubberband, friction];
    begin() {
        if (scroll_raf === undefined) {
            travel = 0;
            acceleration = 0;
            previous_time = undefined;
            reset_spin_points();
            scroll_raf = requestAnimationFrame(scroll_on_frame);
        }
    }
    mouse_move() {
        if (scroll_raf !== undefined) {
            while (true) {
                const dist = Math.hypot(mouse.x - scroll_points[4], mouse.y - scroll_points[5]);
                if (dist > rubberband.value) {
                    reset_spin_points();
                    break;
                }
                const t = step.value / dist;
                if (t > 1) {
                    break;
                }
                scroll_points[0] = scroll_points[2];
                scroll_points[1] = scroll_points[3];
                scroll_points[2] = scroll_points[4];
                scroll_points[3] = scroll_points[5];
                scroll_points[4] = scroll_points[4] + (mouse.x - scroll_points[4]) * t;
                scroll_points[5] = scroll_points[5] + (mouse.y - scroll_points[5]) * t;
                let x1 = scroll_points[2] - scroll_points[0];
                let x2 = scroll_points[4] - scroll_points[2];
                let y1 = scroll_points[3] - scroll_points[1];
                let y2 = scroll_points[5] - scroll_points[3];
                const d1 = Math.hypot(x1, y1);
                const d2 = Math.hypot(x2, y2);
                if (d1 > 0.01 && d2 > 0.01) {
                    x1 /= d1;
                    y1 /= d1;
                    x2 /= d2;
                    y2 /= d2;
                    if (x1 * x2 + y1 * y2 > 0) {
                        let ca = x1 * y2 - y1 * x2;
                        ca = Math.sign(ca) * Math.min(0.5, Math.abs(ca));
                        if (scroll_use_accel.value) {
                            acceleration += step.value * sensitivity.value * ca;
                            travel += acceleration;
                        }
                        else {
                            travel += step.value * sensitivity.value * ca;
                        }
                    }
                }
            }
        }
    }
    cancel_scroll() {
        if (scroll_raf !== undefined) {
            cancelAnimationFrame(scroll_raf);
            scroll_raf = undefined;
        }
    }
    wheel() { }
}
function reset_spin_points() {
    for (let i = 0; i !== 3; i++) {
        scroll_points[2 * i + 0] = mouse.x;
        scroll_points[2 * i + 1] = mouse.y;
    }
}
function scroll_on_frame(ts) {
    scroll_raf = requestAnimationFrame(scroll_on_frame);
    if (previous_time === undefined) {
        previous_time = ts;
        return;
    }
    const dt = ts - previous_time;
    previous_time = ts;
    let dy;
    if (scroll_ease.value > 2) {
        dy = travel * Math.min(0.5, dt / scroll_ease.value);
    }
    else {
        dy = travel;
    }
    send_scroll(0, dy);
    travel -= dy;
    acceleration *= Math.pow(friction.value, dt / 1000);
}

const anchor_spot = { x: 0, y: 0 };
let angle$1 = 0;
let winding = 0;
const pixels_per_rad = new Num("Pixels per radian", 200, 10, 10000);
class Turner {
    name = "Turner";
    parameters = [pixels_per_rad];
    begin() {
        winding = 0;
        angle$1 = 0;
        anchor_spot.x = Math.round(mouse.x * 100) / 100;
        anchor_spot.y = Math.round(mouse.y * 100) / 100;
        circle.style.left = `${anchor_spot.x - 9}px`;
        circle.style.top = `${anchor_spot.y - 9}px`;
        const root = get_root();
        root.inner.appendChild(circle);
        document.body.appendChild(root.outer);
    }
    mouse_move() {
        const dy = mouse.y - anchor_spot.y;
        const dx = mouse.x - anchor_spot.x;
        const new_angle = Math.atan2(dy, dx);
        if (dx * dx + dy * dy > 81) {
            let delta = new_angle - angle$1;
            if (delta > Math.PI) {
                delta -= 2 * Math.PI;
            }
            else if (delta < -Math.PI) {
                delta += 2 * Math.PI;
            }
            winding += delta;
            send_scroll(0, delta * pixels_per_rad.value);
            circle.style.transform = `rotate(${winding.toFixed(2)}rad)`;
        }
        angle$1 = new_angle;
    }
    cancel_scroll() {
        circle.remove();
    }
    wheel() {
    }
}

function dot(a, b) {
    return a.x * b.x + a.y * b.y;
}

const deadzone_pos = { x: 0, y: 0 };
let flip = 0;
let angle = 0;
const deadzone_diameter = new Num("Deadzone diameter", 128, 2, 1024);
const deadzone_degrees = new Num("Deadzone drift degrees", 15, 1, 30);
const pixels_per_pixel = new Num("Pixels per pixel", 200, 10, 10000);
class DotProductTurner {
    name = "Dot Product Turner";
    parameters = [deadzone_diameter, pixels_per_pixel];
    begin() {
        angle = 0;
        deadzone_pos.x = mouse.x;
        deadzone_pos.y = mouse.y;
        document.body.appendChild(get_root().outer);
    }
    mouse_move(delta, old) {
        const root = get_root();
        wipe_els(root.inner);
        const dz_radius = deadzone_diameter.value / 2;
        const dz_rad = deadzone_degrees.value * Math.PI / 180;
        circle.style.left = `${deadzone_pos.x - dz_radius}px`;
        circle.style.top = `${deadzone_pos.y - dz_radius}px`;
        circle.style.width = `${deadzone_diameter.value}px`;
        circle.style.height = `${deadzone_diameter.value}px`;
        root.inner.appendChild(circle);
        const dz = {
            x: mouse.x - deadzone_pos.x,
            y: mouse.y - deadzone_pos.y,
        };
        const dz_dist = Math.sqrt(dz.x * dz.x + dz.y * dz.y);
        const momentum = {
            x: Math.cos(angle),
            y: Math.sin(angle),
        };
        let dot_product;
        const angle_threshold = Math.PI / 2 - dz_rad;
        if (dz_dist > dz_radius) {
            deadzone_pos.x = mouse.x - dz.x * dz_radius / dz_dist,
                deadzone_pos.y = mouse.y - dz.y * dz_radius / dz_dist,
                dot_product = dot(momentum, {
                    x: dz.x / dz_dist,
                    y: dz.y / dz_dist,
                });
            if (dot_product > 0) {
                angle = Math.atan2(dz.y, dz.x);
            }
            else {
                angle = Math.atan2(-dz.y, -dz.x);
            }
            const flip_angle = rot_dist(flip, angle);
            console.log(flip_angle * 180 / Math.PI, angle_threshold * 180 / Math.PI);
            if (Math.abs(flip_angle) < angle_threshold) {
                console.log("flip");
                angle += Math.PI;
                dot_product = -dot_product;
            }
            if (flip_angle > Math.PI / 2) {
                flip = angle - Math.PI / 2;
            }
        }
        else {
            dot_product = dot(momentum, delta);
        }
        const delta_dist = Math.sqrt(delta.x * delta.x + delta.y * delta.y);
        const scroll_y = Math.sign(dot_product) * delta_dist;
        send_scroll(0, scroll_y);
        raya(deadzone_pos, flip, "#f5f");
        raya(deadzone_pos, flip - angle_threshold, "#f00");
        raya(deadzone_pos, flip + angle_threshold, "#f00");
        raya(deadzone_pos, angle, "#fff");
        raya(deadzone_pos, angle + Math.PI / 2, "#0f0");
        raya(deadzone_pos, angle - Math.PI / 2, "#0f0");
    }
    cancel_scroll() {
        circle.remove();
    }
    wheel() {
    }
}
function rot_dist(a, b) {
    return (three_pi + (b - a) % two_pi) % two_pi - Math.PI;
}
const two_pi = 2 * Math.PI;
const three_pi = 3 * Math.PI;
function raya(from, angle, hex) {
    ray(from, { x: Math.cos(angle), y: Math.sin(angle) }, hex);
}
function ray(from, dir, hex) {
    const len = Math.sqrt(dir.x * dir.x + dir.y * dir.y);
    const b = {
        x: from.x + dir.x * 32 / len,
        y: from.y + dir.y * 32 / len,
    };
    line(from, b, hex);
}
function line(a, b, hex) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    for (let i = 0; i < len; i += 1) {
        make_dot(lerp(a.x, b.x, i / len), lerp(a.y, b.y, i / len), hex);
    }
}
function make_dot(x, y, hex) {
    const dot = document.createElement("div");
    apply_styles(dot, {
        ...css_reset,
        "left": `${x.toFixed(2)}px`,
        "top": `${y.toFixed(2)}px`,
        "overflow": "hidden",
        "position": "fixed",
        "width": "1px",
        "height": "1px",
        "background": hex,
        "pointer-events": "none",
    });
    get_root().inner.appendChild(dot);
}

function cancel(e) {
    try {
        e.preventDefault();
    }
    catch (_) { }
    try {
        e.stopImmediatePropagation();
    }
    catch (_) { }
}
function binds_match(bind, e) {
    return (bind !== undefined &&
        bind.alt === e.altKey &&
        bind.shift === e.shiftKey &&
        bind.ctrl === e.ctrlKey &&
        bind.key === e.code);
}

class BlockingDoer {
    update;
    #wants_update = false;
    #active_update;
    constructor(update) {
        this.update = update;
    }
    wait_to_finish() {
        if (this.#active_update !== undefined) {
            return this.#active_update;
        }
        return resolved_promise;
    }
    queue() {
        this.#wants_update = true;
        if (this.#active_update === undefined) {
            this.#active_update = this.#do_update();
        }
    }
    async #do_update() {
        while (this.#wants_update) {
            this.#wants_update = false;
            await this.update();
        }
        this.#active_update = undefined;
    }
}

const saver = new BlockingDoer(() => {
    const object = {
        toggle: scroll_toggle,
        key: scroll_key,
        system: active_system.name,
    };
    for (const system of spin_systems) {
        const system_object = {};
        for (const param of system.parameters) {
            system_object[param.name] = param.value;
        }
        object[system.name] = system_object;
    }
    return GM.setValue("settings", object);
});
let scroll_disabled = false;
let is_scrolling = false;
let is_on_screen = false;
const spin_systems = [
    new DragSpin(),
    new Turner(),
    new DotProductTurner(),
    new AccelSpin(),
];
let active_system = spin_systems[0];
function safe_string(value) {
    if (typeof value === "string")
        return value;
    return undefined;
}
function safe_bool(value) {
    if (value === true)
        return true;
    if (value === false)
        return false;
    return undefined;
}
function safe_kb(value, into) {
    if (value === null || typeof value !== "object")
        return false;
    const ctrl = safe_bool(value.ctrl);
    const alt = safe_bool(value.alt);
    const shift = safe_bool(value.shift);
    const key = safe_string(value.key);
    if (ctrl === undefined || alt === undefined || shift === undefined || key === undefined) {
        return false;
    }
    into.ctrl = ctrl;
    into.shift = shift;
    into.alt = alt;
    into.key = key;
    return true;
}
function kb_to_str(from) {
    let out = "";
    if (from.ctrl)
        out += "Ctrl + ";
    if (from.shift)
        out += "Shift + ";
    if (from.alt)
        out += "Alt + ";
    return out + from.key;
}
const scroll_toggle = {
    key: "KeyG",
    ctrl: true,
    alt: false,
    shift: false,
};
const scroll_key = {
    key: "KeyG",
    ctrl: false,
    alt: false,
    shift: false,
};
let settings_callback;
function load(settings) {
    if (settings === null || typeof (settings) !== "object") {
        return false;
    }
    let fine = true;
    fine = safe_kb(settings.key, scroll_key) && fine;
    fine = safe_kb(settings.toggle, scroll_toggle) && fine;
    const found_system = spin_systems.find(s => s.name === settings.system);
    fine &&= found_system !== undefined;
    active_system = found_system ?? active_system;
    for (const system of spin_systems) {
        const system_settings = settings[system.name];
        if (system_settings === null || typeof (system_settings) !== "object") {
            fine = false;
            continue;
        }
        for (const param of system.parameters) {
            fine = param.deserialize(system_settings[param.name]) && fine;
        }
    }
    return fine;
}
async function start() {
    if (!load(await GM.getValue("settings"))) {
        saver.queue();
    }
    if (self === top) {
        GM_registerMenuCommand("Open Scroller Settings", () => {
            cancel_scroll();
            const root = get_root();
            const modal = get_modal();
            modal.system_select.value = active_system.name;
            modal.key.textContent = kb_to_str(scroll_key);
            modal.toggle.textContent = kb_to_str(scroll_toggle);
            update_system_params();
            root.inner.appendChild(modal.container);
            document.body.appendChild(root.outer);
            modal.container.showModal();
        });
    }
    addEventListener("blur", cancel_scroll);
    addEventListener("mousemove", (e) => {
        is_on_screen = true;
        const old = { x: mouse.x, y: mouse.y };
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        if (is_scrolling) {
            active_system.mouse_move({ x: e.movementX, y: e.movementY }, old);
        }
    }, { passive: false, capture: true });
    document.addEventListener("mouseleave", () => {
        if (!is_scrolling) {
            is_on_screen = false;
        }
    }, { passive: false, capture: true });
    addEventListener("keydown", (e) => {
        if (binds_match(scroll_key, e) && is_scrolling) {
            cancel(e);
            return;
        }
        if (!is_on_screen || !no_selection(e)) {
            return;
        }
        if (settings_callback !== undefined && /^Key[A-Z]$/.test(e.code) && !e.repeat) {
            cancel(e);
            settings_callback.key.ctrl = e.ctrlKey;
            settings_callback.key.shift = e.shiftKey;
            settings_callback.key.alt = e.altKey;
            settings_callback.key.key = e.code;
            settings_callback.button.textContent = kb_to_str(settings_callback.key);
            settings_callback = undefined;
        }
        else if (binds_match(scroll_toggle, e) && !e.repeat) {
            cancel(e);
            if (is_scrolling) {
                cancel_scroll();
            }
            scroll_disabled = !scroll_disabled;
            pop_audio.currentTime = 0;
            pop_audio.play();
        }
        else if (binds_match(scroll_key, e) && !scroll_disabled && !is_scrolling && !e.repeat) {
            cancel(e);
            let el = document.elementFromPoint(mouse.x, mouse.y) ?? document.body;
            do {
                scroll_focused_elements.push(el);
                el = el.parentElement;
            } while (el !== null);
            is_scrolling = true;
            active_system.begin();
        }
    }, { passive: false, capture: true });
    addEventListener("keyup", (e) => {
        if (scroll_key?.key === e.code && is_scrolling) {
            cancel(e);
            cancel_scroll();
        }
    }, { passive: false });
    addEventListener("wheel", (e) => {
        if (is_scrolling) {
            cancel(e);
            active_system.wheel(e.deltaY);
        }
    }, { passive: false, capture: true });
}
const scroll_focused_elements = [];
function send_scroll(dx, dy) {
    while (!scroll_focused_elements[0].isConnected) {
        scroll_focused_elements.splice(0, 1);
    }
    const elements = [];
    for (let element = scroll_focused_elements[0]; element !== null; element = element.parentElement) {
        if (element === document.documentElement ||
            (getComputedStyle(element).overflow !== "visible" &&
                (element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight))) {
            elements.splice(0, 0, element);
        }
    }
    function apply_scroll(el, ddx, ddy) {
        const old_scroll_left = el.scrollLeft;
        const old_scroll_top = el.scrollTop;
        el.scrollBy(ddx, ddy);
        const delta_left = el.scrollLeft - old_scroll_left;
        const delta_top = el.scrollTop - old_scroll_top;
        const old_dx = dx;
        const old_dy = dy;
        dx -= delta_left;
        dy -= delta_top;
        if (Math.sign(old_dx) !== Math.sign(dx)) {
            dx = 0;
        }
        if (Math.sign(old_dy) !== Math.sign(dy)) {
            dy = 0;
        }
    }
    const viewport = {
        x0: 0,
        y0: 0,
        x1: document.documentElement.clientWidth,
        y1: document.documentElement.clientHeight,
    };
    for (let i = 0; i + 1 < elements.length; i++) {
        const cur = elements[i];
        const next = elements[i + 1];
        let bbox = next.getBoundingClientRect();
        const top_cropped = bbox.top < viewport.y0;
        const bottom_cropped = bbox.bottom > viewport.y1;
        const left_cropped = bbox.left < viewport.x0;
        const right_cropped = bbox.right > viewport.x1;
        let ddx = 0, ddy = 0;
        if (dx < -1e-5 && (left_cropped && !right_cropped)) {
            ddx = Math.max(dx, bbox.left - viewport.x0);
        }
        else if (dx > 0.00001 && (right_cropped && !left_cropped)) {
            ddx = Math.min(dx, bbox.right - viewport.x1);
        }
        if (dy < -1e-5 && (top_cropped && !bottom_cropped)) {
            ddy = Math.max(dy, bbox.top - viewport.y0);
        }
        else if (dy > 0.00001 && (bottom_cropped && !top_cropped)) {
            ddy = Math.min(dy, bbox.bottom - viewport.y1);
        }
        if ((Math.abs(ddx) + Math.abs(ddy)) > 0.00001) {
            apply_scroll(cur, ddx, ddy);
            bbox = next.getBoundingClientRect();
        }
        viewport.x0 = Math.max(viewport.x0, bbox.left);
        viewport.x1 = Math.min(viewport.x1, bbox.right);
        viewport.y0 = Math.max(viewport.y0, bbox.top);
        viewport.y1 = Math.min(viewport.y1, bbox.bottom);
        if (viewport.x1 <= viewport.x0 || viewport.y1 <= viewport.y0) {
            break;
        }
    }
    for (let i = elements.length - 1; i !== -1 && (Math.abs(dx) + Math.abs(dy)) > 0.00001; i--) {
        apply_scroll(elements[i], dx, dy);
    }
}
const get_root = do_once(() => {
    const outer = document.createElement("div");
    apply_styles(outer, {
        ...css_reset,
        "overflow": "hidden",
        "position": "fixed",
        "z-index": "999999",
        "inset": "0",
        "pointer-events": "none",
    });
    let inner = outer;
    try {
        inner = outer.attachShadow({ mode: "open" }) ?? inner;
    }
    catch (_) { }
    return {
        outer,
        inner,
    };
});
const circle = document.createElement("div");
apply_styles(circle, {
    ...css_reset,
    "overflow": "hidden",
    "position": "fixed",
    "width": 18 + "px",
    "height": 18 + "px",
    "background": "rgba(0, 0, 0, 0.4)",
    "border": "4px dashed white",
    "border-radius": "50%",
    "box-sizing": "border-box",
    "pointer-events": "none",
});
function label(label) {
    const text = document.createElement("label");
    text.textContent = label;
    apply_styles(text, {
        ...css_reset,
        "display": "block",
        "width": "100%",
    });
    return text;
}
function button(text, on_click) {
    const btn = document.createElement("button");
    btn.addEventListener("mousedown", e => {
        if (e.button === 0)
            on_click();
    });
    btn.textContent = text;
    apply_styles(btn, {
        ...css_reset,
        "dislpay": "block",
        "width": "100%",
        "overflow": "hidden",
        "box-sizing": "border-box",
    });
    return btn;
}
function update_system_params() {
    const modal = get_modal();
    while (modal.container.lastChild !== modal.system_select) {
        modal.container.lastChild.remove();
    }
    for (const parameter of active_system.parameters) {
        modal.container.append(...parameter.render());
    }
    modal.container.appendChild(modal.close);
}
const get_modal = do_once(() => {
    const container = document.createElement("dialog");
    apply_styles(container, {
        "margin": "auto",
        "padding": "8px",
        "pointer-events": "all",
    });
    const close = button("Close", () => container.close());
    const key = button("", () => {
        key.textContent = "...";
        settings_callback = { button: key, key: scroll_key };
    });
    const toggle = button("", () => {
        toggle.textContent = "...";
        settings_callback = { button: toggle, key: scroll_toggle };
    });
    const system_select = document.createElement("select");
    for (const system of spin_systems) {
        const option = document.createElement("option");
        option.textContent = system.name;
        system_select.appendChild(option);
    }
    apply_styles(system_select, {
        ...css_reset,
        "display": "block",
        "width": "100%",
        "box-sizing": "border-box",
    });
    system_select.addEventListener("input", () => {
        active_system = spin_systems.find(system => system.name === system_select.value) ?? active_system;
        saver.queue();
        update_system_params();
    });
    container.addEventListener("close", () => {
        settings_callback = undefined;
        get_root().outer.remove();
        container.remove();
        cancel_scroll();
        saver.queue();
    });
    container.append(label("Scroll key:"), key, label("Scroll toggle key:"), toggle, label("Scroll system:"), system_select);
    return {
        container,
        key,
        toggle,
        system_select,
        close,
    };
});
function cancel_scroll() {
    scroll_focused_elements.length = 0;
    is_scrolling = false;
    active_system.cancel_scroll();
    circle.remove();
    const root = get_root();
    if (root.inner.childElementCount === 0) {
        root.outer.remove();
    }
}
const pop_audio = new Audio("data:audio/flac;base64,ZkxhQwAAACIQABAAAAE9AAE9AXcA8AAAAlgIuSIKgBsus9Y78qQHAemlhAAAKCAAAAByZWZlcmVuY2UgbGliRkxBQyAxLjQuMiAyMDIyMTAyMgAAAAD/+HwIAAJXBg5Q//8ACQAdAEYAdAC0APsBSAGctIuiMXm1X/TZhI6vu3ogBdKySxtdOyVXYZS8hudNpbCW4iZUIb3DVuiRpd01vqRfq9zFs0RnmJEjaMTZMyIlba6SKi/f3uz++tnqI3rGJlMYjKQRtENvsyydP16dzpHvyF0RLEQiNTMaCISYhEZ4aT/Sl/np4ttPEZbWMqEJSEEiGMyIjETxCK8JDlTF9Kst6xPu2mNGJiMRiNjIaQySSN77C+Si+yr/duiREQmxjJiIMlZhIrNJ5bKXrZ1ddqvbonbiNcIyZhuTGSEhOjeXy2H6XnqZ1qaW0hO3EjMRIiCJ0ZJmi6M8XXx8tnun+aXkIhUITSIzZPjJpnNLJ0i7O2f5J+lTdOTWo0TTobb411yfEi5NjwbUvEM702iwjohtTA==");
pop_audio.volume = 0.2;

start();
}if (document.visibilityState !== "visible") {
document.addEventListener("visibilitychange", on_vis_change)
} else {
on_vis_change()
}