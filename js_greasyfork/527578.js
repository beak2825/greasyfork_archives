// ==UserScript==
// @name         FaustCore
// @version      2025-02-21
// @description  Adds support for Faust mods
// @author       Faust
// @match        https://esonline.su/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @namespace https://greasyfork.org/users/1437749
// @downloadURL https://update.greasyfork.org/scripts/527578/FaustCore.user.js
// @updateURL https://update.greasyfork.org/scripts/527578/FaustCore.meta.js
// ==/UserScript==

(function() {
"use strict";
var MessageReason;
(function (MessageReason) {
    MessageReason.user_join = "userJoin";
    MessageReason.user_leave = "userLeave";
    MessageReason.node_data = "nodeData";
    MessageReason.time_update = "serverTimecode";
    MessageReason.client_move = "clientMove";
})(MessageReason || (MessageReason = {}));
function getScreenResolution() {
    const resolutions = [
        [1920, 1080],
        [1792, 1008],
        [1664, 936],
        [1536, 864],
        [1408, 792],
        [1280, 720],
        [1152, 648],
        [1024, 576],
        [896, 504],
        [768, 432],
        [640, 360],
        [512, 288],
        [384, 216],
    ];
    const screen_width = window.innerWidth;
    const screen_height = window.innerHeight;
    let selected_resolution;
    for (let index in resolutions) {
        let resolution = resolutions[index];
        if (resolution[0] <= screen_width && resolution[1] <= screen_height) {
            selected_resolution = resolution;
            break;
        }
    }
    if (!selected_resolution) {
        console.error("screen too small " + screen_width + "x" + screen_height);
        selected_resolution = resolutions[resolutions.length - 1];
    }
    return selected_resolution;
}
function display_notification(text) {
    const elements = document.querySelectorAll("#notify");
    if (elements.length > 0 && elements[0].parentElement) {
        elements[0].parentElement.removeChild(elements[0]);
    }
    const text_bubble = document.createElement("div");
    text_bubble.id = "notify";
    text_bubble.innerHTML = text;
    text_bubble.style.animationName = "hide";
    text_bubble.style.animationDelay = "2s";
    text_bubble.style.animationDuration = "0.5s";
    text_bubble.style.animationFillMode = "forwards";
    text_bubble.style.zIndex = "9999";
    document.body.appendChild(text_bubble);
    text_bubble.addEventListener("animationend", () => {
        text_bubble.remove();
    });
}
class AbstractMenuItem {
    constructor() {
        this.is_added = false;
        this.is_hidden = false;
        this.main_div = document.createElement("div");
    }
    addElement() {
        if (this.is_added) {
            return;
        }
        this.main_div = this.composeMainDiv();
        document.body.appendChild(this.main_div);
        this.is_added = true;
    }
    removeElement() {
        if (!this.is_added) {
            return;
        }
        this.main_div.remove();
        this.is_added = false;
    }
    hideElement() {
        if (!this.is_added) {
            return;
        }
        this.main_div.style.display = "none";
        this.is_hidden = true;
    }
    unhideElement() {
        if (!this.is_added) {
            return;
        }
        this.main_div.style.display = "block";
        this.is_hidden = false;
    }
    isShown() {
        return this.is_added;
    }
    isHidden() {
        return this.is_hidden;
    }
}
class MenuButtonsFactory {
    static buildButton(text, on_click) {
        const button = document.createElement("button");
        button.style.borderRadius = "10px";
        button.style.border = "2px solid rgba(3, 55, 170, 0.8)";
        button.style.backgroundColor = "rgba(3, 55, 170, 0.8)";
        button.style.color = "white";
        button.style.padding = "5px 10px";
        button.style.fontSize = "14px";
        button.innerText = text;
        button.addEventListener("mouseenter", () => {
            button.style.backgroundColor = "white";
            button.style.color = "rgba(3, 55, 170, 0.8)";
        });
        button.addEventListener("mouseleave", () => {
            button.style.backgroundColor = "rgba(3, 55, 170, 0.8)";
            button.style.color = "white";
        });
        button.addEventListener("mousedown", on_click);
        return button;
    }
}
class TweakMenu extends AbstractMenuItem {
    constructor() {
        super();
    }
    getScrollableArea(screen_height) {
        const scrollableDiv = document.createElement("div");
        scrollableDiv.style.height = (screen_height / 3).toString() + "px";
        scrollableDiv.style.overflow = "auto";
        scrollableDiv.style.border = "1px solid #ccc";
        scrollableDiv.style.padding = "10px";
        scrollableDiv.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
        scrollableDiv.style.borderRadius = "10px";
        scrollableDiv.style.marginBottom = "20px";
        return scrollableDiv;
    }
    getTweakNameColor(tweak) {
        if (tweak.isEnabled()) {
            return "green";
        }
        return "white";
    }
    buildDivUponTweak() {
        const result = [];
        for (let iter = 0; iter < loaded_tweaks.length; iter++) {
            const entry = document.createElement("div");
            entry.style.display = "flex";
            entry.style.flexDirection = "row";
            entry.style.alignItems = "center";
            entry.style.justifyContent = "flex-start";
            entry.style.borderRadius = "6px";
            entry.style.border = "2px solid rgba(230, 224, 203, 0.6)";
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = loaded_tweaks[iter].getTweakName();
            checkbox.style.marginLeft = "10px";
            checkbox.style.marginRight = "10px";
            checkbox.checked = loaded_tweaks[iter].isEnabled();
            checkbox.addEventListener("change", (event) => {
                const target = event.target;
                target.checked ? loaded_tweaks[iter].enable() : loaded_tweaks[iter].disable();
            });
            const label = document.createElement("label");
            label.htmlFor = checkbox.id;
            label.innerText = checkbox.id;
            label.style.fontSize = "21px";
            label.style.color = this.getTweakNameColor(loaded_tweaks[iter]);
            entry.appendChild(checkbox);
            entry.appendChild(label);
            result.push(entry);
        }
        return result;
    }
    composeMainDiv() {
        const result = document.createElement("div");
        // resizing
        const resolution = getScreenResolution();
        result.style.position = "fixed";
        result.style.width = (resolution[0] / 2.5).toString() + "px";
        result.style.height = "fit-content";
        // Centering block
        result.style.top = "50%";
        result.style.left = "50%";
        result.style.transform = "translate(-50%, -50%)";
        // Cosmetics
        result.style.padding = "20px";
        result.style.backgroundColor = "rgba(0, 0, 0, 0.75)"; // transparent black
        result.style.borderRadius = "10px";
        result.style.textAlign = "center";
        result.style.backdropFilter = "blur(5px)";
        result.style.zIndex = "9999";
        const window_name = document.createElement("h2");
        window_name.style.color = "white";
        window_name.style.marginBottom = "20px";
        window_name.innerText = "Меню твиков";
        // TODO: add macros for resolution results (or even better, return a struct)
        const scroll_area = this.getScrollableArea(resolution[1]);
        const div_tweaks = this.buildDivUponTweak();
        for (let iter = 0; iter < div_tweaks.length; iter++) {
            scroll_area.appendChild(div_tweaks[iter]);
        }
        result.appendChild(window_name);
        result.appendChild(scroll_area);
        result.appendChild(MenuButtonsFactory.buildButton("Close", () => this.removeElement()));
        return result;
    }
}
class GratitudeMenu extends AbstractMenuItem {
    constructor() {
        super();
    }
    getScrollableArea(screen_height) {
        const scrollableDiv = document.createElement("div");
        scrollableDiv.style.height = (screen_height / 4).toString() + "px";
        scrollableDiv.style.overflow = "auto";
        scrollableDiv.style.border = "1px solid #ccc";
        scrollableDiv.style.padding = "10px";
        scrollableDiv.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
        scrollableDiv.style.borderRadius = "10px";
        scrollableDiv.style.marginBottom = "20px";
        return scrollableDiv;
    }
    composeMainDiv() {
        const result = document.createElement("div");
        // resizing
        const resolution = getScreenResolution();
        result.style.position = "fixed";
        result.style.width = (resolution[0] / 3).toString() + "px";
        result.style.height = "fit-content";
        // Centering block
        result.style.top = "50%";
        result.style.left = "50%";
        result.style.transform = "translate(-50%, -50%)";
        // Cosmetics
        result.style.padding = "20px";
        result.style.backgroundColor = "rgba(0, 0, 0, 0.75)"; // transparent black
        result.style.borderRadius = "10px";
        result.style.textAlign = "center";
        result.style.backdropFilter = "blur(5px)";
        result.style.zIndex = "9999";
        const window_name = document.createElement("h2");
        window_name.style.color = "white";
        window_name.style.marginBottom = "20px";
        window_name.innerText = "Благодарности";
        const scroll_area = this.getScrollableArea(resolution[1]);
        const gratitude_block = document.createElement("div");
        gratitude_block.style.color = "white";
        gratitude_block.style.fontSize = "16px";
        gratitude_block.innerText =
            "Спасибо тебе, игрок, за то что даёшь проекту шанс на жизнь.\nТак же спасибо ребятами ждущим альфа-тест сюжетного твика. Ваша поддержка заставляла проект жить.\n\n Спасибо, TRIOLA.\nСпасибо, makter.";
        result.appendChild(window_name);
        result.appendChild(scroll_area);
        scroll_area.appendChild(gratitude_block);
        result.appendChild(MenuButtonsFactory.buildButton("Close", () => this.removeElement()));
        return result;
    }
}
/// <reference path="./menu_interface.ts" />
/// <reference path="../menu_button_factory.ts" />
/// <reference path="./tweaks_menu.ts" />
/// <reference path="./gratitude_menu.ts" />
class FaustCoreMenu extends AbstractMenuItem {
    constructor() {
        super();
        this.tweak_menu = new TweakMenu();
        this.gratitude_menu = new GratitudeMenu();
    }
    composeMainDiv() {
        const result = document.createElement("div");
        // positioning
        result.style.position = "absolute";
        result.style.left = "50%";
        result.style.top = "5%";
        result.style.transform = "translate(-50%, -50%)";
        // reshaping
        result.style.width = "fit-content";
        result.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        result.style.color = "white";
        result.style.zIndex = "9990";
        result.style.borderRadius = "10px";
        result.style.textAlign = "center";
        result.style.backdropFilter = "blur(5px)";
        // element positioning
        result.style.display = "flex";
        result.style.flexDirection = "row";
        result.style.alignItems = "center";
        result.style.justifyContent = "flex-start";
        result.style.gap = "20px";
        result.style.padding = "10px";
        const window_name = document.createElement("h2");
        window_name.style.fontWeight = "bold";
        window_name.style.color = "white";
        window_name.innerText = "Faust Core";
        result.appendChild(window_name);
        result.appendChild(MenuButtonsFactory.buildButton("Твики", () => this.tweak_menu.addElement()));
        result.appendChild(MenuButtonsFactory.buildButton("?", () => this.gratitude_menu.addElement()));
        return result;
    }
}
/// <reference path="./menu_windows/faust_core_menu.ts" />
class Application {
    constructor() {
        this.fcore_menu = new FaustCoreMenu();
        this.fcore_menu.addElement();
    }
}
const app = new Application();
const OriginalWebSocket = window.WebSocket; // backup original websocket
var WebsocketListeners;
(function (WebsocketListeners) {
    let receive_listeners = new Map();
    let send_listeners = new Map();
    function addReceiveListener(listener) {
        if (receive_listeners.has(listener.getTweakName())) {
            return false;
        }
        receive_listeners.set(listener.getTweakName(), listener);
        return true;
    }
    WebsocketListeners.addReceiveListener = addReceiveListener;
    function removeReceiveListener(tweak_name) {
        if (typeof tweak_name !== "string") {
            tweak_name = tweak_name.getTweakName();
        }
        receive_listeners.delete(tweak_name);
    }
    WebsocketListeners.removeReceiveListener = removeReceiveListener;
    function addSendListener(listener) {
        if (send_listeners.has(listener.getTweakName())) {
            return false;
        }
        send_listeners.set(listener.getTweakName(), listener);
        return true;
    }
    WebsocketListeners.addSendListener = addSendListener;
    function removeSendListener(tweak_name) {
        if (typeof tweak_name !== "string") {
            tweak_name = tweak_name.getTweakName();
        }
        send_listeners.delete(tweak_name);
    }
    WebsocketListeners.removeSendListener = removeSendListener;
    function triggerReceiveListener(data) {
        for (let [_, value] of receive_listeners) {
            value.processReceivedWebsocketMessage(data);
        }
    }
    WebsocketListeners.triggerReceiveListener = triggerReceiveListener;
    function triggerSendListener(data) {
        for (let [_, value] of send_listeners) {
            value.processSendedWebsocketMessage(data);
        }
    }
    WebsocketListeners.triggerSendListener = triggerSendListener;
})(WebsocketListeners || (WebsocketListeners = {}));
class PatchedWebSocket extends OriginalWebSocket {
    constructor(url, protocols) {
        super(url, protocols);
        // redefining send method
        const originalSend = this.send;
        this.send = (data) => {
            originalSend.call(this, data);
            WebsocketListeners.triggerSendListener(data);
        };
        // redefining accept method
        this.addEventListener("message", (event) => {
            WebsocketListeners.triggerReceiveListener(event.data);
        });
    }
}
// Redefining global websocket with Faust patch
window.WebSocket = PatchedWebSocket;
Object.defineProperties(window.WebSocket, {
    CONNECTING: { value: OriginalWebSocket.CONNECTING },
    OPEN: { value: OriginalWebSocket.OPEN },
    CLOSING: { value: OriginalWebSocket.CLOSING },
    CLOSED: { value: OriginalWebSocket.CLOSED },
});
const loaded_tweaks = [];
class Tweaks {
    constructor() {
        loaded_tweaks.push(this);
    }
    getTweakName() {
        return this.name;
    }
    isServerSide() {
        return this.sever_side;
    }
    isEnabled() {
        return this.is_enabled;
    }
}
/// <reference path="./tweak_interface.ts" />
class PlayerLister extends Tweaks {
    constructor() {
        super();
        this.name = "Отображать меню с игроками на локации";
        this.sever_side = false;
        this.is_enabled = false;
        // Init main div
        this.main_div = this.initPlayerListBlock();
        this.main_div.style.display = "none"; // Hiding window
        document.body.appendChild(this.main_div);
        // sub div will remain empty
        this.player_list_div = document.createElement("div");
        this.player_list_div.style.padding = "20px";
        this.main_div.appendChild(this.player_list_div);
        this.is_dragging = false;
        this.offset_x = 0;
        this.offset_y = 0;
        this.players_on_location = new Map();
    }
    enable() {
        this.is_enabled = true;
        this.main_div.style.display = "block";
        WebsocketListeners.addReceiveListener(this);
        display_notification("Для обновления списка перезайдите на локацию.");
    }
    disable() {
        this.is_enabled = false;
        this.main_div.style.display = "none";
        WebsocketListeners.removeReceiveListener(this);
        // Clearing info
        this.players_on_location.clear();
        this.updatePlayerList();
    }
    /**
     * @brief Parses user json entry from websocket
     *
     * @param user json info
     * @return PlayerInfo: parsed data
     */
    parseSocketUserData(user) {
        const result = {
            id: user.id,
            name: user.name,
            color: user.color,
        };
        return result;
    }
    processReceivedWebsocketMessage(websocket_event_data) {
        try {
            const parsedData = JSON.parse(websocket_event_data);
            switch (parsedData.reason) {
                case MessageReason.user_join:
                    const user = this.parseSocketUserData(parsedData.user);
                    this.players_on_location.set(user.id, user);
                    break;
                case MessageReason.node_data:
                    this.players_on_location.clear();
                    const users = parsedData.users;
                    if (!Array.isArray(users)) {
                        return;
                    }
                    users.forEach((user) => {
                        user = this.parseSocketUserData(user);
                        this.players_on_location.set(user.id, user);
                    });
                    break;
                case MessageReason.user_leave:
                    this.players_on_location.delete(parsedData.id);
                    break;
                default:
                    return;
            }
            this.updatePlayerList();
        }
        catch (error) {
            console.error(error);
        }
    }
    processSendedWebsocketMessage(websocket_event_data) { }
    updatePlayerList() {
        this.player_list_div.innerHTML = ""; // Clearing list
        for (const [key, value] of this.players_on_location) {
            const player_entry = document.createElement("p");
            player_entry.style.color = "#" + value.color;
            player_entry.innerText = key.toString() + " " + value.name;
            // player_entry.style.marginLeft = "10px";
            this.player_list_div.appendChild(player_entry);
        }
    }
    initPlayerListBlock() {
        const movableDiv = document.createElement("div");
        movableDiv.style.position = "fixed";
        movableDiv.style.top = "100px";
        movableDiv.style.left = "100px";
        movableDiv.style.width = "fit-content";
        movableDiv.style.height = "fit-content";
        movableDiv.style.backdropFilter = "blur(5px)";
        movableDiv.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        movableDiv.style.cursor = "grab";
        movableDiv.style.borderRadius = "10px";
        movableDiv.style.zIndex = "9990";
        const window_name = document.createElement("h3");
        window_name.style.color = "white";
        window_name.innerText = "На локации:";
        window_name.style.marginLeft = "5px";
        window_name.style.marginRight = "5px";
        window_name.style.marginTop = "5px";
        movableDiv.appendChild(window_name);
        // Enabling element moving
        movableDiv.addEventListener("mousedown", (event) => {
            this.is_dragging = true;
            this.offset_x = event.clientX - movableDiv.getBoundingClientRect().left;
            this.offset_y = event.clientY - movableDiv.getBoundingClientRect().top;
            // removing selection while holding
            event.preventDefault();
        });
        document.addEventListener("mousemove", (event) => {
            if (this.is_dragging) {
                movableDiv.style.left = `${event.clientX - this.offset_x}px`;
                movableDiv.style.top = `${event.clientY - this.offset_y}px`;
            }
        });
        document.addEventListener("mouseup", () => {
            this.is_dragging = false;
        });
        // Adding element to page
        document.body.appendChild(movableDiv);
        return movableDiv;
    }
}
//TODO: must be a better way of doing this
const player_lister_tweak = new PlayerLister();
//# sourceMappingURL=main.js.map
})();
