// ==UserScript==
// @name         Stratums.io Autoscroll + Hotkeys
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Macros and autoscroll for Stratums.io
// @author       -
// @match        *://stratums.io/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454108/Stratumsio%20Autoscroll%20%2B%20Hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/454108/Stratumsio%20Autoscroll%20%2B%20Hotkeys.meta.js
// ==/UserScript==

(async () => {
    let store;
    let button;
    let down;
    let up;
    let functions = [];
    let idens = [];
    let identifiers = ["Buy", "Equip", "Unequip"];
    let elems = [];
    let first = 0;
    let insta = 0;
    let checkedHeal = false;

    const clickObj = new Proxy(new Event(""), {
        get(_this, dir) {
            return "isTrusted" === dir || _this[dir];
        }
    });

    const ael = HTMLElement.prototype.addEventListener;
    const cael = HTMLCanvasElement.prototype.addEventListener;

    let tempFirst = -4;

    HTMLElement.prototype.addEventListener = function() {
        if(arguments[0] === "click") {
            if(this.style?.cssText?.length > 100) {
                elems.push({obj: this, func: arguments[1]});
            } else if(this.childNodes?.[0]?.style?.cssText === "font-size: 40px; vertical-align: middle;") {
                if(++first === 2) button = arguments[1];
            } else if(this.parentNode === null && identifiers.includes(this.innerText)) {
                if(functions.length === 31) {
                    idens = [];
                    functions = [];
                }
                idens.push(this.innerText);
                functions.push(arguments[1]);
            }
        }
        ael.call(this, ...arguments);
    }

    HTMLCanvasElement.prototype.addEventListener = function() {
        if(this.height !== 300) {
            if(arguments[0] === "mousedown") {
                down = arguments[1];
            } else if(arguments[0] === "mouseup") {
                up = arguments[1];
            }
        }
        cael.call(this, ...arguments);
    }

    Object.freeze(Proxy);
    Object.freeze(Event);
    Object.freeze(console);
    Object.freeze(HTMLElement.prototype.addEventListener);

    const scrollList = {
        z: 1350,
        b: 500,
        g: 1350,
        o: 1150,
        Shift: 850,
        i: 750,
        p: 800
    };

    const macroList = {
        q: 0,
        f: 4,
        v: 2,
        n: 3
    };

    const scrollObj = {};
    const keys = {};

    function click() {
        down(clickObj);
        up(clickObj);
    }

    function place(t) {
        t.func(clickObj);
        click();
    }

    function putOnHat() {
        if(scrollObj.top !== undefined && store) {
            button(clickObj);
            store.scroll(scrollObj);
            if(scrollObj.top === 0 || idens[scrollObj.top / 50] !== "Unequip") {
                functions[scrollObj.top / 50](clickObj);
            }
            button(clickObj);
        }
    }

    setInterval(() => {
        if(document.activeElement.placeholder === "Enter chat message...") return;
        let places = 0, t;
        for(let i in macroList) {
            if(keys[i] && (t = elems.filter(e => e.obj.style.display !== "none")[macroList[i]])) {
                place(t);
                if(++places > 1) return;
            }
        }
        checkedHeal = false;
    }, 1000 / 9);

    document.addEventListener("keydown", ({key}) => {
        keys[key] = true;
        if(document.activeElement.placeholder === "Enter chat message...") return;
        if(!store) store = Array.from(document.getElementsByTagName("div")).filter(e => e.childNodes.length === 31)[0];
        if(key === "r") {
            insta = !insta;
        } else if(insta){
            if(key === "1") {
                scrollObj.top = 750;
                putOnHat();
                setTimeout(() => {
                    click();
                }, 50);
            } else if(key === "2") {
                scrollObj.top = 1150;
                putOnHat();
                setTimeout(() => {
                    click();
                    setTimeout(() => {
                        scrollObj.top = 500;
                        putOnHat();
                    }, 111);
                }, 50);
                insta = false;
            }
        }
        scrollObj.top = scrollList[key];
        putOnHat();
    });

    document.addEventListener("keyup", ({key}) => {
        keys[key] = false;
    });
})();