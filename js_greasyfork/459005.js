// ==UserScript==
// @name         Warzone Order Clipboard
// @namespace    https://greasyfork.org/en/users/884770-andenrx
// @version      1.2
// @description  Copy and paste orders in Warzone (Ctrl+C to copy and Ctrl+V to paste)
// @author       andenrx
// @match        https://www.warzone.com/SinglePlayer*
// @match        https://www.warzone.com/MultiPlayer*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459005/Warzone%20Order%20Clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/459005/Warzone%20Order%20Clipboard.meta.js
// ==/UserScript==
 
(async function() {
    'use strict';
    let m1 = window.location.href.match(/MultiPlayer\?GameID=\d+/);
    let m2 = window.location.href.match(/SinglePlayer\?Level=\d+/);
    const gameid = 1
    const DAYS_TO_STORE = 100;
 
    let clipboard;
 
    function copy() {
        clipboard = (window.UJS_Hooks[min.TurnBuilder][min.OrderList] || []).map(order_container => order_container[min.Order]);
        save(gameid, clipboard);
        console.log("Copied", clipboard);
    }
 
    function paste() {
        clipboard = clipboard || load(gameid);
        if (clipboard) {
            window.UJS_Hooks[min.TurnBuilder][min.LoadOrders](clipboard);
            console.log("Pasted", clipboard);
        } else {
            console.log("Nothing in clipboard");
        }
    }
 
    function save(gameid, orders) {
        let storage_id = "userscript_order_clipboard_" + gameid;
        update_registry(storage_id);
        window.localStorage.setItem(
            storage_id,
            JSON.stringify(orders.map(normalize))
        )
    }
    function load(gameid) {
        let storage_id = "userscript_order_clipboard_" + gameid;
        if (storage_id in window.localStorage) {
            update_registry(storage_id);
            return JSON.parse(window.localStorage.getItem(storage_id)).map(denormalize);
        }
    }
 
    function is_wz_object(obj) {
        return obj && typeof(obj) === "object" && min.Type in obj;
    }
 
    function normalize(order) {
        if (!is_wz_object(order))
            return order;
        let type_data = type_table[order[min.Type].name];
        let normalized_order = {type: type_data.name};
        type_data.properties.forEach(
            (prop, index) => {
                normalized_order[index] = normalize(order[prop]);
            }
        );
        return normalized_order;
    };
 
    function denormalize(normalized_order) {
        if (!(normalized_order && typeof(normalized_order) === "object" && normalized_order.type))
            return normalized_order;
        let type_data = type_table[min.from_name[normalized_order.type]];
        delete normalized_order.type;
        console.assert(type_data.type, "Unable to find order type " + type_data.name);
        let order = new type_data.type();
        for (let i = 0; i < type_data.properties.length; i++) {
            order[type_data.properties[i]] = denormalize(normalized_order[i]);
        }
        return order;
    }
 
    function clean_registry() {
        let registry = JSON.parse(localStorage.getItem("userscript_order_clipboard_registry")) || {};
        let now = Date.now();
        for (let id in registry) {
            let last_access = registry[id];
            let days_elapsed = (now - last_access) / (1000 * 60 * 60 * 24);
            if (days_elapsed >= DAYS_TO_STORE) {
                console.log("Removing " + id + " as more than " + DAYS_TO_STORE + " days have passed", days_elapsed);
                localStorage.removeItem(id);
                delete registry[id];
            }
        }
        localStorage.setItem("userscript_order_clipboard_registry", JSON.stringify(registry));
    }
 
    function update_registry(storage_id) {
        let registry = JSON.parse(localStorage.getItem("userscript_order_clipboard_registry")) || {};
        registry[storage_id] = Date.now();
        localStorage.setItem("userscript_order_clipboard_registry", JSON.stringify(registry));
    }
 
    async function get_ujs_script() {
        let ujs_script = Array.from(
            document.scripts
        ).map(
            script => script.src
        ).filter(
            script => script.match(/^https:\/\/warzonecdn.com\/js\/Release\/ujs/)
        );
        console.assert(ujs_script.length > 0, "Failed to find ujs script");
        console.assert(ujs_script.length <= 1, "Found multiple ujs scripts");
        ujs_script = await $.ajax(ujs_script[0]);
        ujs_script = ujs_script.replaceAll("\n", "");
        return ujs_script;
    }
 
    function waitFor(condition) {
        return new Promise(resolve => {
            (function delayed() {
                if (condition()) resolve();
                else setTimeout(delayed);
            })();
        });
    }
 
    let min = {};
    let type_table = {};
 
    waitFor(() => window.UJS_Hooks).then(async () => {
        clean_registry();
 
        let ujs_script = await get_ujs_script();
 
        min.from_name = Object.fromEntries(
            Array.from(
                ujs_script.matchAll(/([\w$_]+)\.(__name__|.)=\["warlight","shared","(GameOrder\w*)"\];/g),
                match => [match[3], match[1]]
            )
        );
 
        min.Type = ujs_script.match(new RegExp(`,([\\w$_]+):${min.from_name.GameOrder.replace("$", "\\$")},`))[1];
        let match = ujs_script.match(/this\.([\w$_]+)\.([\w$_]+)\(\[\]\),/);
        min.TurnBuilder = match[1];
        min.LoadOrders = match[2];
        min.PreviousTurn = ujs_script.match(/="GetLatestGameInfo\.5";0>=this\.[\w$_]+\.[\w$_]+\?\([\w$_]+\.([\w$_]+)=null/)[1];
        min.OrderList = ujs_script.match(/"Not fully deployed"\);return this\.([\w$_]+)/)[1];
        match = ujs_script.match(/\(null!=this\.[\w$_]+\.([\w$_]+)\.([\w$_]+),"Root\.Links\.Latest is null"\)/);
        min.Links = match[1];
        min.Latest = match[2];
        min.Order = ujs_script.match(/\(this\.([\w$_]+),[\w$_]+\)\)return"The card that was played on one of the previous turns is no longer active."/)[1];
 
        function crawl(id) {
            let obj = {};
            obj.name = ujs_script.match(new RegExp(`${id.replace("$", "\\$")}\\.(__name__|.)=\\[("\\w+",)*"(\\w+)"\\];`))[3];
            min.from_name[obj.name] = id;
            let body = ujs_script.match(new RegExp(
                  "("
                +     `function ${id.replace("$", "\\$")}`  // "function f"
                +     `|${id.replace("$", "\\$")}=function` // or "f = function"
                + ")"
                + "\\(([\\w$_,])*\\)"                       // "(arg1, arg2)"
                + "{(.*?)}"                                 // "{ body }"
            ))[3];
            obj.properties = [];
            Array.from(body.matchAll(/this\.([\w$_]+)=(new ([\w$_]+))?/g)).forEach(
                match => {
                    obj.properties.push(match[1]);
                    if (match[3] && !(match[3] in type_table)) {
                        crawl(match[3]);
                    }
                }
            );
            type_table[id] = obj;
        }
        Array.from(
            ujs_script.matchAll(/([\w$_]+)\.(__name__|.)=\["warlight","shared","(GameOrder\w*)"\];/g),
            match => match[1]
        ).forEach(crawl);
 
        function grab_types(obj) {
            if (!is_wz_object(obj))
                return;
            let type = obj[min.Type].name;
            if (type in type_table && !type_table[type].type) {
                type_table[type].type = obj[min.Type];
                Object.values(obj).forEach(grab_types);
            }
        }
        (window.UJS_Hooks[min.TurnBuilder][min.OrderList] || []).map(order_container => order_container[min.Order]).forEach(grab_types);
        if (window.UJS_Hooks[min.Links][min.Latest][min.PreviousTurn]) {
            window.UJS_Hooks[min.Links][min.Latest][min.PreviousTurn][min.OrderList].forEach(grab_types);
        }
 
        $(window).on("keydown.userscript", null, null, event => {
            event.keyCode == 67 && event.ctrlKey && copy();
            event.keyCode == 86 && event.ctrlKey && paste();
        });
 
        console.log("Userscript loaded");
    });
})();