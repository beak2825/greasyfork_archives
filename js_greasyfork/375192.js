// ==UserScript==
// @name         Doppelte Fenster
// @name:en      Clone windows
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Synchronisiert Aktionen über Fenster/Tabs der gleichen Domain hinweg. Drücke C L O N E, um zu (de)aktivieren
// @description:en Synchronizes actions across windows and tabs with the same domain. Press C L O N E to disable/re-enable
// @author       Aloso
// @match        https://www.google.com
// @include      https://*
// @include      http://*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375192/Doppelte%20Fenster.user.js
// @updateURL https://update.greasyfork.org/scripts/375192/Doppelte%20Fenster.meta.js
// ==/UserScript==

(function () {
    "use strict";
    
    let lsp = "ls-clone-windows-" + encodeURI(window.location.hostname) + "-";
    
    let root = document.documentElement;
    
    let pressed = "";
    let last_press = 0;
    let initialized = false;
    
    let scrolled_here = false;
    let clicked_here = false;
    let inputTed_here = false;
    
    const msgStyle = {
        backgroundColor: "white",
        color: "black",
        fontSize: "18px",
        lineHeight: "initial",
        textShadow: "none",
        border: "none",
        borderRadius: "4px",
        boxShadow: "0 1px 30px rgba(0, 0, 0, 0.5)",
        boxSizing: "border-box",
        position: "fixed",
        opacity: "1",
        transform: "none",
        right: "5px",
        top: "5px",
        padding: "15px 20px",
        zIndex: "100000"
    };
    
    function msg(text) {
        let msg = document.createElement("div");
        msg.innerHTML = text;
        for (let x in msgStyle) if (msgStyle.hasOwnProperty(x)) {
            msg.style[x] = msgStyle[x];
        }
        document.body.appendChild(msg);
        setTimeout(() => document.body.removeChild(msg), 1300);
    }
    
    function keypress(event) {
        if (+new Date() - last_press > 600) pressed = "";
        last_press = +new Date();

        pressed += event.key;
        if (pressed.length > 5) pressed = pressed.substr(pressed.length - 5);
        if (pressed === "clone") {
            pressed = "";
            if (!initialized) {
                init("event");
                msg("<span style='color:#007b20'>CLONING ENABLED</span>");
            } else {
                deInit();
                msg("<span style='color:red'>CLONING DISABLED</span>");
            }
        }
    }
    
    function storage(event) {
        if (event.newValue !== null && event.key.startsWith(lsp)) {
            let type = event.key.substring(lsp.length);
            if (type === "init") {
                if (!initialized) {
                    init();
                    msg("<span style='color:#007b20'>CLONING ENABLED</span>");
                }
            } else if (type === "forbid") {
                if (initialized) {
                    deInit();
                    msg("<span style='color:red'>CLONING DISABLED</span>");
                }
            } else if (initialized) {
                if (type === "scroll") {
                    if (!scrolled_here) {
                        let [x, y] = event.newValue.split(" ").map(x => +x);
                        root.scrollTo(x, y);
                    }
                    scrolled_here = false;
                } else if (type === "click") {
                    if (!clicked_here) {
                        let [xs, ys, val] = event.newValue.split(" ");
                        let x = +xs;
                        let y = +ys;
                        let el = document.elementFromPoint(x, y);
                        if (el != null) {
                            fireMouseEvent(el, "click", x, y);
                        }
                    }
                    clicked_here = false;
                } else if (type === "input") {
                    if (!inputTed_here) {
                        let [xs, ys, val] = event.newValue.split(" ");
                        let x = +xs;
                        let y = +ys;
                        val = decodeURIComponent(val);
                        let el = document.elementFromPoint(x, y);
                        if (el.nodeName === "INPUT" || el.nodeName === "TEXTAREA" || el.nodeName === "SELECT") {
                            if (el.getAttribute("type") === "checkbox") {
                                el.checked = val !== "false";
                            } else {
                                el.value = val;
                            }
                        }
                    }
                    inputTed_here = false;
                } else if (type === "back") {
                    window.removeEventListener("popstate", popstate);
                    setTimeout(() => {
                        while (event.state === lsp + "back") history.go(-1);
                        history.go(-1);
                        while (event.state === lsp + "back") history.go(-1);
                        window.addEventListener("popstate", popstate);
                    }, 80);
                }
            }
        }
    }
    
    function init(option) {
        initialized = true;
        if (option === "event") {
            localStorage.setItem(lsp + "init", "1");
        }
        localStorage.removeItem(lsp + "forbid");
        if (history.state !== lsp + "back") {
            history.pushState(lsp + "back", "Go back");
        }
    }
    
    function deInit() {
        initialized = false;
        for (let x in localStorage) {
            if (x.startsWith(lsp) && localStorage.hasOwnProperty(x)) {
                localStorage.removeItem(x);
            }
        }
        localStorage.setItem(lsp + "forbid", "1");
    }
    
    function scroller() {
        if (initialized) {
            scrolled_here = true;
            localStorage.setItem(lsp + "scroll", root.scrollLeft + " " + root.scrollTop);
        }
    }
    
    function clicker(event) {
        if (initialized) {
            clicked_here = true;
            let x = event.clientX;
            let y = event.clientY;
            localStorage.setItem(lsp + "click", x + " " + y);
        }
    }

    function inputTer(event) {
        if (initialized) {
            inputTed_here = true;
            let el = event.target;
            let rect = el.getBoundingClientRect();
            let x = Math.round((rect.left + rect.right) / 2);
            let y = Math.round((rect.top + rect.bottom) / 2);
            let val;
            if (el.getAttribute("type") === "checkbox") {
                val = "" + el.checked;
            } else {
                val = "" + el.value;
            }
            localStorage.setItem(lsp + "input", x + " " + y + " " + encodeURIComponent(val));
        }
    }
    
    function popstate(event) {
        window.removeEventListener("popstate", popstate);
        if (initialized) {
            localStorage.setItem(lsp + "back", "" + +new Date());
        }
        while (event.state === lsp + "back") history.go(-1);
        history.go(-1);
        while (event.state === lsp + "back") history.go(-1);
        window.addEventListener("popstate", popstate);
    }
    
    
    root.addEventListener("keypress", keypress);
    root.addEventListener("click", clicker);
    window.addEventListener("scroll", scroller);
    window.addEventListener("input", inputTer);
    window.addEventListener("storage", storage);
    
    window.addEventListener("popstate", popstate);

    if (localStorage.getItem(lsp + "forbid") == null) {
        init("event");
    }
    
    function fireMouseEvent(node, eventName, x, y) {
        node.dispatchEvent(new MouseEvent(eventName, {
            altKey: false,
            ctrlKey: false,
            shiftKey: false,
            metaKey: false,
            bubbles: true,
            cancelable: true,
            button: 0,
            detail: 1,
            x: x,
            y: y,
            clientX: x,
            clientY: y,
        }));
    }
    

})();