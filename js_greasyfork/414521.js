// ==UserScript==
// @name         YouTube聊天观察哨
// @namespace    https://greasyfork.org/scripts/414521
// @version      0.8.2
// @description  观测指定用户的聊天消息；报告被删除的聊天消息；观测当前用户的消息状态；一键检测SuperChat状态
// @author       nyakarin
// @match        https://www.youtube.com/live_chat*
// @require      https://cdn.jsdelivr.net/npm/vue@3.0.5/dist/vue.global.prod.js
// @grant        unsafeWindow
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        window.focus
// @downloadURL https://update.greasyfork.org/scripts/414521/YouTube%E8%81%8A%E5%A4%A9%E8%A7%82%E5%AF%9F%E5%93%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/414521/YouTube%E8%81%8A%E5%A4%A9%E8%A7%82%E5%AF%9F%E5%93%A8.meta.js
// ==/UserScript==
if (!unsafeWindow.Vue) {
    unsafeWindow.Vue = Vue;
}
(async function () {
    "use strict";
    const spyVersion = "0.8.2";
    const defaultSettings = {
        cv6Port: 5000,
        reportedChatItemCount: 3,
        reservedChatItemCount: 20,
    };
    const settings = Vue.ref(Object.assign({}, defaultSettings));
    const settingsValueKey = "settings";
    const chatItemsDeletedByAuthorEventValueKey = "__chatItemsDeletedByAuthorEvent";
    function last(arr) {
        return arr[arr.length - 1];
    }
    function waitFor(fn, timeout = 100, tryTimes = 100) {
        let times = 0;
        return new Promise((resolve, reject) => {
            const intervalId = setInterval(() => {
                try {
                    const result = fn();
                    if (result !== undefined) {
                        clearInterval(intervalId);
                        resolve(result);
                    }
                    else {
                        times += 1;
                        if (times >= tryTimes) {
                            clearInterval(intervalId);
                            reject("超时");
                        }
                    }
                }
                catch (error) {
                    clearInterval(intervalId);
                    reject(error);
                }
            }, timeout);
        });
    }
    function getByPath(obj, ...paths) {
        paths.forEach((path) => {
            if (obj != null) {
                obj = obj[path];
            }
            else {
                return undefined;
            }
        });
        return obj;
    }
    function toTimeString(timestamp) {
        const date = new Date(timestamp);
        let hourStr = date.getHours() + "";
        if (hourStr.length === 1) {
            hourStr = "0" + hourStr;
        }
        let minuteStr = date.getMinutes() + "";
        if (minuteStr.length === 1) {
            minuteStr = "0" + minuteStr;
        }
        return `${hourStr}:${minuteStr}`;
    }
    function toDurationString(duration) {
        const totalSeconds = Math.round(duration / 1000);
        const seconds = totalSeconds % 60;
        const minutes = (totalSeconds - seconds) / 60;
        let minuteStr = minutes + "";
        if (minuteStr.length === 1) {
            minuteStr = "0" + minuteStr;
        }
        let secondStr = seconds + "";
        if (secondStr.length === 1) {
            secondStr = "0" + secondStr;
        }
        return `${minuteStr}:${secondStr}`;
    }
    function toMessageText(runs) {
        let text = "";
        if (Array.isArray(runs)) {
            runs.forEach((run) => {
                if (run) {
                    if (run.text) {
                        text += run.text;
                    }
                    else if (run.emoji) {
                        const emojiText = getByPath(run.emoji, "shortcuts", 0);
                        text += emojiText ? emojiText : ":emoji:";
                    }
                }
            });
        }
        return text;
    }
    class Messager {
        constructor() {
            this._callbacks = [];
        }
        emit(message) {
            this._callbacks.forEach((callback) => {
                try {
                    callback(message);
                }
                catch (error) {
                    console.error(error);
                }
            });
        }
        subscribe(callback) {
            this._callbacks.push(callback);
            return () => {
                this._callbacks = this._callbacks.filter((cb) => cb !== callback);
            };
        }
    }
    let ChatItemDeletedType;
    (function (ChatItemDeletedType) {
        ChatItemDeletedType[ChatItemDeletedType["ByItem"] = 1] = "ByItem";
        ChatItemDeletedType[ChatItemDeletedType["ByAuthor"] = 2] = "ByAuthor";
    })(ChatItemDeletedType || (ChatItemDeletedType = {}));
    const ChatItemDeletedTypeIcons = {
        [ChatItemDeletedType.ByItem]: "❌",
        [ChatItemDeletedType.ByAuthor]: "🚫",
    };
    const ChatItemDeletedLinkIcon = "🔗";
    const EmojiNumberIcons = [
        "0️⃣",
        "1️⃣",
        "2️⃣",
        "3️⃣",
        "4️⃣",
        "5️⃣",
        "6️⃣",
        "7️⃣",
        "8️⃣",
        "9️⃣",
        "🔟",
        "*️⃣",
    ];
    const isReplay = window.location.pathname === "/live_chat_replay";
    const currentChannelId = (() => {
        var _a;
        const serviceTrackingParams = getByPath(unsafeWindow.ytInitialData, "responseContext", "serviceTrackingParams");
        if (Array.isArray(serviceTrackingParams)) {
            const guidedHelp = serviceTrackingParams.find((param) => (param === null || param === void 0 ? void 0 : param.service) === "GUIDED_HELP");
            if (guidedHelp) {
                const guidedHelpParams = guidedHelp.params;
                if (Array.isArray(guidedHelpParams)) {
                    const channelId = (_a = guidedHelpParams.find((param) => (param === null || param === void 0 ? void 0 : param.key) === "creator_channel_id")) === null || _a === void 0 ? void 0 : _a.value;
                    if (typeof channelId === "string") {
                        return channelId;
                    }
                }
            }
        }
        return null;
    })();
    const currentAuthorName = (() => {
        var _a;
        const viewerName = (_a = getByPath(unsafeWindow.ytInitialData, "continuationContents", "liveChatContinuation", "viewerName")) !== null && _a !== void 0 ? _a : getByPath(unsafeWindow.ytInitialData, "contents", "liveChatRenderer", "viewerName");
        return typeof viewerName === "string" ? viewerName : null;
    })();
    const currentAuthorPhoto = (() => {
        var _a;
        const liveChatContinuation = (_a = getByPath(unsafeWindow.ytInitialData, "continuationContents", "liveChatContinuation")) !== null && _a !== void 0 ? _a : getByPath(unsafeWindow.ytInitialData, "contents", "liveChatRenderer");
        const thumbnails = getByPath(liveChatContinuation, "actionPanel", "liveChatMessageInputRenderer", "authorPhoto", "thumbnails");
        if (Array.isArray(thumbnails)) {
            const thumbnail = last(thumbnails);
            const url = thumbnail === null || thumbnail === void 0 ? void 0 : thumbnail.url;
            return typeof url === "string" ? url : undefined;
        }
        return undefined;
    })();
    const chatItemById = Vue.reactive(new Map());
    const chatItemsByChannelId = Vue.reactive(new Map());
    const chatItemInfoById = new Map();
    const liveChatMessager = new Messager();
    const liveChatAddChatItemCountMessager = new Messager();
    const sentMessageIdSet = new Set();
    const sendMessageIgnoredMessager = new Messager();
    const getCartErrorMessager = new Messager();
    let fetchNative;
    let listenGetLiveChat = false;
    let listenSendMessage = false;
    let interceptGetCart = false;
    let currentGetLiveChatCallNumber = 0;
    let currentGetLiveChatTimestamp = 0;
    function patchFetch() {
        const getLiveChatPath = isReplay
            ? "/get_live_chat_replay"
            : "/get_live_chat";
        const sendMessagePath = "/send_message";
        const getCartPath = "/get_cart";
        function patchResponse(response, handler) {
            const jsonNative = response.json;
            response.json = async function (...args) {
                const json = await jsonNative.apply(this, args);
                try {
                    const result = handler(json);
                    if (result !== undefined) {
                        return result;
                    }
                }
                catch (error) {
                    console.error(error);
                }
                return json;
            };
            const textNative = response.text;
            response.text = async function (...args) {
                const text = await textNative.apply(this, args);
                try {
                    const json = JSON.parse(text);
                    const result = handler(json);
                    if (result !== undefined) {
                        return JSON.stringify(result, undefined, 2);
                    }
                }
                catch (error) {
                    console.error(error);
                }
                return text;
            };
        }
        fetchNative = unsafeWindow.fetch;
        unsafeWindow.fetch = async function (...args) {
            const response = await fetchNative.apply(this, args);
            let pathname;
            try {
                const url = new URL(response.url);
                pathname = url.pathname;
            }
            catch (error) {
                pathname = "";
            }
            if (listenGetLiveChat && pathname.endsWith(getLiveChatPath)) {
                patchResponse(response, (json) => {
                    currentGetLiveChatCallNumber += 1;
                    currentGetLiveChatTimestamp = Date.now();
                    let actions = getByPath(json, "continuationContents", "liveChatContinuation", "actions");
                    if (isReplay && Array.isArray(actions)) {
                        actions = actions
                            .map((action) => getByPath(action, "replayChatItemAction", "actions"))
                            .flat();
                    }
                    if (Array.isArray(actions)) {
                        const addChatItemCount = actions.filter((action) => action === null || action === void 0 ? void 0 : action.addChatItemAction).length;
                        if (addChatItemCount > 0) {
                            liveChatAddChatItemCountMessager.emit({
                                count: addChatItemCount,
                                timestamp: Date.now(),
                            });
                        }
                        actions.forEach((action) => {
                            var _a, _b, _c, _d;
                            const addedMessageRenderer = getByPath(action, "addChatItemAction", "item", "liveChatTextMessageRenderer");
                            if (addedMessageRenderer) {
                                const id = getByPath(addedMessageRenderer, "id");
                                const channelId = getByPath(addedMessageRenderer, "authorExternalChannelId");
                                const authorName = getByPath(addedMessageRenderer, "authorName", "simpleText");
                                const timestampUsec = getByPath(addedMessageRenderer, "timestampUsec");
                                const messageRuns = getByPath(addedMessageRenderer, "message", "runs");
                                if (typeof id === "string" &&
                                    typeof channelId === "string" &&
                                    typeof authorName === "string" &&
                                    typeof timestampUsec === "string") {
                                    if (!chatItemsByChannelId.has(channelId)) {
                                        chatItemsByChannelId.set(channelId, []);
                                    }
                                    const chatItems = chatItemsByChannelId.get(channelId);
                                    if (chatItems.length >= settings.value.reservedChatItemCount) {
                                        const item = chatItems.shift();
                                        if (item) {
                                            chatItemById.delete(item.id);
                                            chatItemInfoById.delete(item.id);
                                        }
                                    }
                                    const item = {
                                        id,
                                        channelId,
                                        authorName,
                                        time: toTimeString(parseInt(timestampUsec, 10) / 1000),
                                        message: toMessageText(messageRuns),
                                    };
                                    chatItems.push(item);
                                    chatItemById.set(item.id, item);
                                    chatItemInfoById.set(item.id, {
                                        callNumber: currentGetLiveChatCallNumber,
                                        timestamp: currentGetLiveChatTimestamp,
                                    });
                                    liveChatMessager.emit({
                                        type: "add",
                                        item,
                                    });
                                }
                            }
                            const deletedAction = getByPath(action, "markChatItemAsDeletedAction");
                            if (deletedAction) {
                                const itemId = getByPath(deletedAction, "targetItemId");
                                const deletedStateMessageRuns = getByPath(deletedAction, "deletedStateMessage", "runs");
                                if (typeof itemId === "string") {
                                    const item = chatItemById.get(itemId);
                                    if (item) {
                                        item.deletedType =
                                            ((_a = item.deletedType) !== null && _a !== void 0 ? _a : 0) | ChatItemDeletedType.ByItem;
                                        item.deletedState = toMessageText(deletedStateMessageRuns);
                                        const chatItemInfo = chatItemInfoById.get(item.id);
                                        if (chatItemInfo) {
                                            (_b = item.deletedEfficiency) !== null && _b !== void 0 ? _b : (item.deletedEfficiency = currentGetLiveChatCallNumber - chatItemInfo.callNumber);
                                            (_c = item.deletedDuration) !== null && _c !== void 0 ? _c : (item.deletedDuration = currentGetLiveChatTimestamp - chatItemInfo.timestamp);
                                        }
                                    }
                                    liveChatMessager.emit({
                                        type: "delete",
                                        itemId,
                                    });
                                }
                            }
                            const byAuthorDeletedAction = getByPath(action, "markChatItemsByAuthorAsDeletedAction");
                            if (byAuthorDeletedAction) {
                                const channelId = getByPath(byAuthorDeletedAction, "externalChannelId");
                                const deletedStateMessageRuns = getByPath(byAuthorDeletedAction, "deletedStateMessage", "runs");
                                if (typeof channelId === "string") {
                                    const chatItems = chatItemsByChannelId.get(channelId);
                                    const lastChatItemId = chatItems
                                        ? (_d = last(chatItems)) === null || _d === void 0 ? void 0 : _d.id : undefined;
                                    chatItems === null || chatItems === void 0 ? void 0 : chatItems.forEach((item) => {
                                        var _a, _b, _c;
                                        item.deletedType =
                                            ((_a = item.deletedType) !== null && _a !== void 0 ? _a : 0) | ChatItemDeletedType.ByAuthor;
                                        item.deletedState = toMessageText(deletedStateMessageRuns);
                                        const chatItemInfo = chatItemInfoById.get(item.id);
                                        if (chatItemInfo) {
                                            (_b = item.deletedDuration) !== null && _b !== void 0 ? _b : (item.deletedDuration = currentGetLiveChatTimestamp - chatItemInfo.timestamp);
                                            if (item.id === lastChatItemId) {
                                                (_c = item.deletedEfficiency) !== null && _c !== void 0 ? _c : (item.deletedEfficiency = currentGetLiveChatCallNumber -
                                                    chatItemInfo.callNumber);
                                            }
                                        }
                                    });
                                    liveChatMessager.emit({
                                        type: "deleteByAuthor",
                                        channelId,
                                    });
                                    if (lastChatItemId) {
                                        GM_setValue(chatItemsDeletedByAuthorEventValueKey, `${channelId}|${lastChatItemId}`);
                                    }
                                }
                            }
                        });
                    }
                });
            }
            if (listenSendMessage && pathname.endsWith(sendMessagePath)) {
                patchResponse(response, (json) => {
                    const actions = getByPath(json, "actions");
                    if (Array.isArray(actions)) {
                        actions.forEach((action) => {
                            const addedMessageRenderer = getByPath(action, "addChatItemAction", "item", "liveChatTextMessageRenderer");
                            if (addedMessageRenderer) {
                                const id = getByPath(addedMessageRenderer, "id");
                                if (typeof id === "string") {
                                    sentMessageIdSet.add(id);
                                    sendMessageIgnoredMessager.emit(false);
                                }
                            }
                        });
                    }
                    else {
                        sendMessageIgnoredMessager.emit(true);
                    }
                });
            }
            if (interceptGetCart && pathname.endsWith(getCartPath)) {
                patchResponse(response, (json) => {
                    const errorTextRuns = getByPath(json, "messageRenderer", "liveChatErrorMessageRenderer", "errorText", "runs");
                    if (!errorTextRuns) {
                        getCartErrorMessager.emit(null);
                        return {
                            responseContext: getByPath(json, "responseContext"),
                            trackingParams: getByPath(json, "trackingParams"),
                            messageRenderer: {
                                liveChatErrorMessageRenderer: {
                                    errorText: {
                                        runs: [
                                            {
                                                text: "✔️",
                                            },
                                        ],
                                    },
                                },
                            },
                        };
                    }
                    else {
                        getCartErrorMessager.emit(toMessageText(errorTextRuns));
                    }
                });
            }
            return response;
        };
    }
    function unpatchFetch() {
        if (fetchNative) {
            unsafeWindow.fetch = fetchNative;
        }
        fetchNative = undefined;
    }
    function getChatItemDeletedTypeIcon(item) {
        return item.deletedType
            ? item.deletedEfficiency == null
                ? ChatItemDeletedLinkIcon
                : item.deletedType & ChatItemDeletedType.ByItem
                    ? ChatItemDeletedTypeIcons[ChatItemDeletedType.ByItem]
                    : item.deletedType & ChatItemDeletedType.ByAuthor
                        ? ChatItemDeletedTypeIcons[ChatItemDeletedType.ByAuthor]
                        : null
            : null;
    }
    function getChatItemDeletedEfficiencyIcon(item) {
        return item.deletedEfficiency != null
            ? EmojiNumberIcons[Math.min(item.deletedEfficiency, 11)]
            : "⬜";
    }
    function copyToClipboard(items) {
        let str = "";
        items.forEach((item) => {
            if (item.deletedType) {
                str +=
                    getChatItemDeletedTypeIcon(item) +
                        getChatItemDeletedEfficiencyIcon(item) +
                        " ";
            }
            if (item.deletedState) {
                str += item.deletedState + " ";
            }
            str += `[${item.time}]` + " " + item.authorName;
            if (item.message) {
                str += ": " + item.message;
            }
            str += "\r\n";
        });
        GM_setClipboard(str);
    }
    class CV6Connection {
        constructor() {
            this.status = Vue.ref("closed");
            this.error = Vue.ref(null);
            this._watchingChannelIds = [];
        }
        connect() {
            this.disconnect();
            this.error.value = null;
            const websocket = new WebSocket(`ws://localhost:${settings.value.cv6Port}`);
            this._websocket = websocket;
            this._websocket.addEventListener("open", () => {
                if (!this._isCurrentWebSocket(websocket)) {
                    return;
                }
                this.status.value = "open";
                this._sendMessage({ type: "hello" });
            });
            this._websocket.addEventListener("close", (ev) => {
                if (!this._isCurrentWebSocket(websocket)) {
                    return;
                }
                if (ev.code === 1006) {
                    this.error.value = "连接失败";
                }
                else if (ev.code === 4444) {
                    this.error.value = "连接已被占用";
                }
                this.status.value = "closed";
                this.disconnect();
            });
            this._websocket.addEventListener("message", (ev) => {
                if (!this._isCurrentWebSocket(websocket)) {
                    return;
                }
                try {
                    const message = JSON.parse(ev.data);
                    if ((message === null || message === void 0 ? void 0 : message.command) === "monitor-channel") {
                        this._watchingChannelIds = message.payload;
                    }
                }
                catch (error) {
                    console.error(error);
                }
            });
            this._subscriber = liveChatMessager.subscribe((msg) => {
                var _a;
                if (!this._isCurrentWebSocket(websocket)) {
                    return;
                }
                if (msg.type === "add") {
                    if (this._watchingChannelIds.includes(msg.item.channelId)) {
                        this._sendMessage({
                            type: "message-added",
                            message: msg.item,
                        });
                    }
                }
                else if (msg.type === "delete") {
                    const item = chatItemById.get(msg.itemId);
                    if (item && this._watchingChannelIds.includes(item.channelId)) {
                        this._sendMessage({
                            type: "message-deleted",
                            message: item,
                        });
                    }
                }
                else if (msg.type === "deleteByAuthor") {
                    if (this._watchingChannelIds.includes(msg.channelId)) {
                        this._sendMessage({
                            type: "messages-deleted-by-author",
                            channelId: msg.channelId,
                            messages: (_a = chatItemsByChannelId.get(msg.channelId)) !== null && _a !== void 0 ? _a : [],
                        });
                    }
                }
            });
        }
        disconnect() {
            if (this._websocket) {
                this._websocket.close();
                this._websocket = undefined;
            }
            if (this._subscriber) {
                this._subscriber();
                this._subscriber = undefined;
            }
            this._watchingChannelIds = [];
        }
        _sendMessage(message) {
            var _a;
            (_a = this._websocket) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify(Object.assign({ __spy: spyVersion, timestamp: Date.now() }, message)));
        }
        _isCurrentWebSocket(websocket) {
            return !this._websocket || websocket === this._websocket;
        }
    }
    const cv6Connection = new CV6Connection();
    function createApp() {
        const app = Vue.createApp({
            setup() {
                const initialized = Vue.ref(false);
                const visible = Vue.ref(false);
                const toggleVisible = () => {
                    visible.value = !visible.value;
                    if (visible.value) {
                        initialized.value = true;
                    }
                };
                const toggleVisibleButtonTitle = Vue.computed(() => initialized.value ? "观察哨（已启动）" : "观察哨（未启动）");
                const toggleVisibleButtonContentStyle = Vue.computed(() => !initialized.value
                    ? {
                        opacity: 0.33,
                    }
                    : {});
                const chatItemsDeletedByAuthor = Vue.ref(false);
                const sendMessageIgnoredCount = Vue.ref(0);
                const sendMessageIgnoredTitle = Vue.computed(() => sendMessageIgnoredCount.value
                    ? `发送消息被忽略（连续${sendMessageIgnoredCount.value}次）`
                    : undefined);
                const superChatCheckVisible = Vue.ref(false);
                Vue.watch(visible, (value, oldValue) => {
                    if (value || oldValue === undefined) {
                        superChatCheckVisible.value = !!document.querySelector("yt-live-chat-product-button-renderer[icon-id=purchase_super_chat]");
                    }
                }, {
                    immediate: true,
                });
                const superChatCheckRunning = Vue.ref(false);
                const superChatCheckError = Vue.ref(undefined);
                const superChatCheckText = Vue.ref(undefined);
                const superChatCheckTitle = Vue.computed(() => superChatCheckRunning.value
                    ? "正在检测SuperChat状态..."
                    : "检测SuperChat状态");
                const checkSuperChat = async (text) => {
                    var _a, _b, _c;
                    if (superChatCheckRunning.value) {
                        return {
                            error: "正在检测SuperChat状态...",
                        };
                    }
                    let resultReceived = false;
                    superChatCheckText.value = undefined;
                    superChatCheckError.value = undefined;
                    superChatCheckRunning.value = true;
                    interceptGetCart = true;
                    const subscriber = getCartErrorMessager.subscribe((message) => {
                        resultReceived = true;
                        if (message) {
                            superChatCheckError.value = message;
                        }
                        else {
                            superChatCheckError.value = null;
                        }
                    });
                    try {
                        try {
                            const superChatEl = await waitFor(() => { var _a; return (_a = document.querySelector("yt-live-chat-product-button-renderer[icon-id=purchase_super_chat] > a")) !== null && _a !== void 0 ? _a : undefined; }, 1, 1);
                            superChatEl.click();
                        }
                        catch (error) {
                            throw "用户未登录或SuperChat不可用";
                        }
                        const sendButtonEl = await waitFor(() => { var _a; return (_a = document.querySelector("#button.yt-live-chat-message-buy-flow-renderer")) !== null && _a !== void 0 ? _a : undefined; });
                        if (text === true) {
                            text = "";
                            const childNodes = (_b = (_a = document.querySelector("yt-live-chat-text-input-field-renderer.yt-live-chat-message-input-renderer > #input")) === null || _a === void 0 ? void 0 : _a.childNodes) !== null && _b !== void 0 ? _b : [];
                            childNodes.forEach((node) => {
                                var _a;
                                if (node instanceof HTMLImageElement) {
                                    if (node.classList.contains("emoji")) {
                                        const alt = node.alt;
                                        if (alt) {
                                            if (/\p{Extended_Pictographic}/u.test(alt)) {
                                                text += alt;
                                            }
                                            else {
                                                text += `:${alt}:`;
                                            }
                                        }
                                    }
                                }
                                else {
                                    text += (_a = node.textContent) !== null && _a !== void 0 ? _a : "";
                                }
                            });
                            text = text.trim();
                        }
                        if (text) {
                            superChatCheckText.value = text;
                            const inputEl = document.querySelector("yt-live-chat-text-input-field-renderer.yt-live-chat-paid-message-renderer > #input");
                            if (inputEl) {
                                inputEl.textContent = "";
                                const pasteEvent = new ClipboardEvent("paste", {
                                    clipboardData: new DataTransfer(),
                                });
                                (_c = pasteEvent.clipboardData) === null || _c === void 0 ? void 0 : _c.items.add(text, "text/plain");
                                inputEl.dispatchEvent(pasteEvent);
                            }
                        }
                        sendButtonEl.click();
                        await waitFor(() => (resultReceived ? resultReceived : undefined));
                        const closeButtonEl = await waitFor(() => { var _a; return (_a = document.querySelector("#close-button.yt-live-chat-message-buy-flow-renderer")) !== null && _a !== void 0 ? _a : undefined; });
                        closeButtonEl.click();
                    }
                    catch (error) {
                        superChatCheckError.value =
                            typeof error === "string" ? error : "未知错误";
                    }
                    finally {
                        superChatCheckRunning.value = false;
                        interceptGetCart = false;
                        subscriber();
                    }
                    return { error: superChatCheckError.value || null };
                };
                let chatItemsDeletedByAuthorListenerId;
                let sendMessageIgnoredSubscriber;
                Vue.onMounted(() => {
                    patchFetch();
                    listenSendMessage = true;
                    unsafeWindow.checkSuperChat = checkSuperChat;
                    if (currentChannelId) {
                        chatItemsDeletedByAuthorListenerId = GM_addValueChangeListener(chatItemsDeletedByAuthorEventValueKey, (name, oldValue, newValue) => {
                            if (typeof newValue !== "string") {
                                return;
                            }
                            const [channelId, lastChatItemId] = newValue.split("|");
                            if (!chatItemsDeletedByAuthor.value &&
                                channelId === currentChannelId &&
                                sentMessageIdSet.has(lastChatItemId)) {
                                chatItemsDeletedByAuthor.value = true;
                                GM_notification({
                                    text: `观测到用户 ${currentAuthorName !== null && currentAuthorName !== void 0 ? currentAuthorName : currentChannelId} 所有消息被删除，该用户可能被ban`,
                                    image: currentAuthorPhoto,
                                    onclick: () => {
                                        window.focus();
                                    },
                                });
                            }
                        });
                    }
                    sendMessageIgnoredSubscriber = sendMessageIgnoredMessager.subscribe((ignored) => {
                        if (ignored) {
                            sendMessageIgnoredCount.value += 1;
                        }
                        else {
                            chatItemsDeletedByAuthor.value = false;
                            sendMessageIgnoredCount.value = 0;
                        }
                    });
                });
                Vue.onUnmounted(() => {
                    unpatchFetch();
                    listenSendMessage = false;
                    delete unsafeWindow.checkSuperChat;
                    if (chatItemsDeletedByAuthorListenerId) {
                        GM_removeValueChangeListener(chatItemsDeletedByAuthorListenerId);
                        chatItemsDeletedByAuthorListenerId = undefined;
                    }
                    if (sendMessageIgnoredSubscriber) {
                        sendMessageIgnoredSubscriber();
                        sendMessageIgnoredSubscriber = undefined;
                    }
                });
                return {
                    initialized,
                    visible,
                    toggleVisible,
                    toggleVisibleButtonTitle,
                    toggleVisibleButtonContentStyle,
                    chatItemsDeletedByAuthor,
                    sendMessageIgnoredCount,
                    sendMessageIgnoredTitle,
                    superChatCheckVisible,
                    superChatCheckRunning,
                    superChatCheckError,
                    superChatCheckTitle,
                    superChatCheckText,
                    checkSuperChat,
                };
            },
            template: `
        <span v-if="sendMessageIgnoredCount" :title="sendMessageIgnoredTitle">⚠️</span>
        <span v-if="chatItemsDeletedByAuthor" title="观测到用户所有消息被删除，当前用户可能被ban">🚫</span>
        <span v-if="superChatCheckError" :title="'无法发送SuperChat：' + superChatCheckError">❌</span>
        <span v-if="superChatCheckError === null" title="可以发送SuperChat">{{superChatCheckText ? '🉑' : '✔️'}}</span>
        <button v-if="superChatCheckVisible" :title="superChatCheckTitle" :disabled="superChatCheckRunning" @click="checkSuperChat(true)"><span>💵</span></button>
        <button :title="toggleVisibleButtonTitle" @click="toggleVisible"><span :style="toggleVisibleButtonContentStyle">👀</span></button>
        <app-main v-if="initialized" :visible="visible" />
      `,
        });
        app.component("app-main", {
            props: ["visible"],
            setup(props) {
                const chatRestricted = Vue.ref(false);
                Vue.watch(() => props.visible, (value) => {
                    if (value) {
                        chatRestricted.value = !!document.querySelector("yt-live-chat-restricted-participation-renderer");
                    }
                }, {
                    immediate: true,
                });
                const rootStyle = Vue.computed(() => ({
                    boxSizing: "border-box",
                    position: "absolute",
                    top: "48px",
                    zIndex: 2000,
                    height: isReplay
                        ? "calc(100vh - 48px)"
                        : chatRestricted.value
                            ? "calc(100vh - 96px)"
                            : "calc(100vh - 160px)",
                    width: "100vw",
                    display: props.visible ? "flex" : "none",
                    flexDirection: "column",
                    padding: "5px",
                    fontSize: "14px",
                    backgroundColor: "#f9f9f9",
                }));
                Vue.onMounted(() => {
                    listenGetLiveChat = true;
                });
                Vue.onUnmounted(() => {
                    listenGetLiveChat = false;
                });
                let userLiveChatSubscriber;
                const onUserLiveChatRegister = (chatProps) => {
                    const filterAuthors = Vue.computed(() => typeof chatProps.filter === "string"
                        ? chatProps.filter
                            .split("|")
                            .map((author) => author.trim())
                            .filter(Boolean)
                        : []);
                    userLiveChatSubscriber = liveChatMessager.subscribe((message) => {
                        if (message.type === "add") {
                            const item = message.item;
                            if (typeof chatProps.filter === "string"
                                ? filterAuthors.value.includes(item.authorName) ||
                                    filterAuthors.value.includes(item.channelId)
                                : chatProps.filter.test(item.authorName)) {
                                chatProps.items.push(item);
                            }
                        }
                    });
                };
                const onUserLiveChatUnregister = () => {
                    if (userLiveChatSubscriber) {
                        userLiveChatSubscriber();
                        userLiveChatSubscriber = undefined;
                    }
                };
                const userLiveChatTextFilterPlaceholder = '请输入用户名或频道ID，以"|"分隔';
                const userLiveChatTextFilterHelp = "普通模式：\r\n" +
                    '输入以"|"分隔的用户名或频道ID，观测对应用户的新到消息\r\n' +
                    "示例：foo|bar|baz\r\n" +
                    "\r\n" +
                    "正则表达式模式：\r\n" +
                    '输入"/pattern/flags"，观测用户名符合该正则表达式的用户的新到消息\r\n' +
                    "示例：/foo[bar]+/i";
                const deletedLiveChatAddedChatItemIdSet = new Set();
                let deletedLiveChatSubscriber;
                const onDeletedLiveChatRegister = (chatProps) => {
                    deletedLiveChatSubscriber = liveChatMessager.subscribe((message) => {
                        if (message.type === "delete") {
                            const item = chatItemById.get(message.itemId);
                            if (item && !deletedLiveChatAddedChatItemIdSet.has(item.id)) {
                                deletedLiveChatAddedChatItemIdSet.add(item.id);
                                chatProps.items.push(item);
                            }
                        }
                        if (message.type === "deleteByAuthor") {
                            const chatItems = chatItemsByChannelId.get(message.channelId);
                            if (chatItems) {
                                const reportedChatItems = chatItems
                                    .slice(Math.max(chatItems.length - settings.value.reportedChatItemCount, 0))
                                    .reverse();
                                reportedChatItems.forEach((item, index) => {
                                    if (!deletedLiveChatAddedChatItemIdSet.has(item.id)) {
                                        deletedLiveChatAddedChatItemIdSet.add(item.id);
                                        const insertBeforeItem = reportedChatItems[index - 1];
                                        const insertBeforeIndex = chatProps.items.lastIndexOf(insertBeforeItem);
                                        if (insertBeforeIndex >= 0) {
                                            chatProps.items.splice(insertBeforeIndex, 0, item);
                                        }
                                        else {
                                            chatProps.items.push(item);
                                        }
                                    }
                                });
                            }
                        }
                    });
                };
                const onDeletedLiveChatUnregister = () => {
                    if (deletedLiveChatSubscriber) {
                        deletedLiveChatSubscriber();
                        deletedLiveChatSubscriber = undefined;
                    }
                };
                const deletedLiveChatTextFilterPlaceholder = "请输入需要被包含或排除的关键词，以空格分隔";
                const deletedLiveChatTextFilterHelp = "普通模式：\r\n" +
                    "输入以空格分隔的关键词，过滤出符合所有条件的消息（大小写不敏感）\r\n" +
                    '默认为包含关键词，在前面加"-"将其变为排除关键词\r\n' +
                    "示例：foo bar -baz\r\n" +
                    "\r\n" +
                    "正则表达式模式：\r\n" +
                    '输入"/pattern/flags"，过滤出符合该正则表达式的消息\r\n' +
                    "示例：/^.{3,20}$/";
                const deletedLiveChatTextFilterFn = (() => {
                    const textFilter = Vue.ref("");
                    const keywords = Vue.computed(() => typeof textFilter.value === "string"
                        ? textFilter.value
                            .split(" ")
                            .map((e) => e.trim().toLowerCase())
                            .filter(Boolean)
                        : []);
                    const includeKeywords = Vue.computed(() => keywords.value.filter((e) => !e.startsWith("-")));
                    const excludeKeywords = Vue.computed(() => keywords.value
                        .filter((e) => e.startsWith("-"))
                        .map((e) => e.substring(1)));
                    return (items, filter) => {
                        if (typeof filter === "string") {
                            textFilter.value = filter;
                            return items.filter((item) => {
                                const message = item.message.toLowerCase();
                                return (includeKeywords.value.every((keyword) => message.includes(keyword)) &&
                                    excludeKeywords.value.every((keyword) => !message.includes(keyword)));
                            });
                        }
                        else {
                            return items.filter((item) => filter.test(item.message));
                        }
                    };
                })();
                const cv6ConnectionStatus = Vue.computed(() => cv6Connection.status.value);
                const cv6ConnectionError = Vue.computed(() => cv6Connection.error.value);
                const connectCV6 = () => {
                    cv6Connection.connect();
                };
                const showSettings = Vue.ref(false);
                const toggleShowSettings = () => {
                    showSettings.value = !showSettings.value;
                };
                let addChatItemCountMessages = [];
                const addChatItemCountInLastMinute = Vue.ref(0);
                let addChatItemCountIntervalId;
                let addChatItemCountSubscriber;
                Vue.onMounted(() => {
                    addChatItemCountIntervalId = setInterval(() => {
                        const now = Date.now();
                        const index = addChatItemCountMessages.findIndex((e) => now - e.timestamp <= 60000);
                        addChatItemCountMessages =
                            index >= 0 ? addChatItemCountMessages.slice(index) : [];
                        addChatItemCountInLastMinute.value = addChatItemCountMessages.reduce((count, e) => count + e.count, 0);
                    }, 5000);
                    addChatItemCountSubscriber = liveChatAddChatItemCountMessager.subscribe((message) => {
                        addChatItemCountMessages.push(message);
                    });
                });
                Vue.onUnmounted(() => {
                    if (addChatItemCountIntervalId) {
                        clearInterval(addChatItemCountIntervalId);
                        addChatItemCountIntervalId = undefined;
                    }
                    if (addChatItemCountSubscriber) {
                        addChatItemCountSubscriber();
                        addChatItemCountSubscriber = undefined;
                    }
                });
                return {
                    rootStyle,
                    onUserLiveChatRegister,
                    onUserLiveChatUnregister,
                    userLiveChatTextFilterPlaceholder,
                    userLiveChatTextFilterHelp,
                    onDeletedLiveChatRegister,
                    onDeletedLiveChatUnregister,
                    deletedLiveChatTextFilterPlaceholder,
                    deletedLiveChatTextFilterHelp,
                    deletedLiveChatTextFilterFn,
                    addChatItemCountInLastMinute,
                    connectCV6,
                    cv6ConnectionStatus,
                    cv6ConnectionError,
                    showSettings,
                    toggleShowSettings,
                };
            },
            template: `
        <teleport to="#contents.yt-live-chat-app">
          <div :style="rootStyle">
            <div style="display: flex; align-items: center; margin-bottom: 5px">
              <div>最近一分钟消息数：{{addChatItemCountInLastMinute}}</div>
              <div style="display: flex; align-items: center; margin-left: auto">
                <span v-if="cv6ConnectionError" :title="cv6ConnectionError">❌</span>
                <span v-if="cv6ConnectionStatus === 'open'" title="CV-6已连接">🌐</span>
                <button title="连接到CV-6" :disabled="cv6ConnectionStatus === 'open'" @click="connectCV6">📡</button>
                <button title="设置" @click="toggleShowSettings">⚙️</button>
              </div>
            </div>
            <div v-show="!showSettings" style="display: flex; flex-direction: column; flex-grow: 1">
              <div style="border-bottom: 1px solid rgba(0, 0, 0, 0.1); margin: 0 -5px" />
              <app-live-chat-container header="用户消息观测" @register="onUserLiveChatRegister" @unregister="onUserLiveChatUnregister" :textFilterPlaceholder="userLiveChatTextFilterPlaceholder" :textFilterHelp="userLiveChatTextFilterHelp" />
              <div style="border-bottom: 1px solid rgba(0, 0, 0, 0.1); margin: 0 -5px" />
              <app-live-chat-container header="删除消息观测" @register="onDeletedLiveChatRegister" @unregister="onDeletedLiveChatUnregister" :textFilterPlaceholder="deletedLiveChatTextFilterPlaceholder" :textFilterHelp="deletedLiveChatTextFilterHelp" :textFilterFn="deletedLiveChatTextFilterFn" />
            </div>
            <app-settings v-if="showSettings" @close="toggleShowSettings" />
          </div>
        </teleport>
      `,
        });
        app.component("app-live-chat-container", {
            props: [
                "header",
                "textFilterPlaceholder",
                "textFilterHelp",
                "textFilterFn",
            ],
            emits: ["register", "unregister"],
            setup(props, { emit }) {
                const authorView = Vue.ref(false);
                const toggleAuthorView = () => {
                    authorView.value = !authorView.value;
                };
                const deletedTypeFilter = Vue.ref(0);
                const toggleDeletedTypeFilter = () => {
                    switch (deletedTypeFilter.value) {
                        case 0:
                            deletedTypeFilter.value = ChatItemDeletedType.ByItem;
                            break;
                        case ChatItemDeletedType.ByItem:
                            deletedTypeFilter.value = ChatItemDeletedType.ByAuthor;
                            break;
                        case ChatItemDeletedType.ByAuthor:
                            deletedTypeFilter.value = 0;
                            break;
                        default:
                            deletedTypeFilter.value = 0;
                            break;
                    }
                };
                const deletedTypeFilterText = Vue.computed(() => "过滤：" +
                    (deletedTypeFilter.value === ChatItemDeletedType.ByItem
                        ? ChatItemDeletedTypeIcons[ChatItemDeletedType.ByItem]
                        : deletedTypeFilter.value === ChatItemDeletedType.ByAuthor
                            ? ChatItemDeletedTypeIcons[ChatItemDeletedType.ByAuthor]
                            : "无"));
                const textFilter = Vue.ref("");
                const filterRegExp = Vue.computed(() => {
                    const execArr = /^\/(.+)\/([gimsuy]*)$/.exec(textFilter.value);
                    if (execArr) {
                        try {
                            return new RegExp(execArr[1], execArr[2]);
                        }
                        catch (error) {
                            return null;
                        }
                    }
                    else {
                        return undefined;
                    }
                });
                const filter = Vue.computed(() => {
                    return filterRegExp.value
                        ? filterRegExp.value
                        : filterRegExp.value === null
                            ? ""
                            : textFilter.value;
                });
                const items = Vue.ref([]);
                const filteredItems = Vue.computed(() => {
                    let result = items.value.slice();
                    if (props.textFilterFn) {
                        result = props.textFilterFn(result, filter.value);
                    }
                    if (deletedTypeFilter.value) {
                        const reversedItems = result.reverse();
                        result = [];
                        let deletedType;
                        reversedItems.forEach((item) => {
                            if (item.deletedEfficiency != null) {
                                deletedType = item.deletedType;
                            }
                            if ((deletedTypeFilter.value === ChatItemDeletedType.ByItem &&
                                (deletedType !== null && deletedType !== void 0 ? deletedType : 0) & ChatItemDeletedType.ByItem) ||
                                (deletedTypeFilter.value === ChatItemDeletedType.ByAuthor &&
                                    deletedType === ChatItemDeletedType.ByAuthor)) {
                                result.push(item);
                            }
                        });
                        result = result.reverse();
                    }
                    return result;
                });
                const filteredAuthorItems = Vue.computed(() => {
                    const authorMap = new Map();
                    filteredItems.value
                        .slice()
                        .reverse()
                        .forEach((item) => {
                        if (!authorMap.has(item.channelId)) {
                            authorMap.set(item.channelId, Object.assign(Object.assign({}, item), { id: item.channelId, message: "" }));
                        }
                    });
                    return Array.from(authorMap.values()).reverse();
                });
                const displayedItems = Vue.computed(() => {
                    return authorView.value
                        ? filteredAuthorItems.value
                        : filteredItems.value;
                });
                const clear = () => {
                    const filteredIdSet = new Set(filteredItems.value.map((item) => item.id));
                    items.value = items.value.filter((item) => !filteredIdSet.has(item.id));
                };
                Vue.onMounted(() => {
                    emit("register", Vue.reactive({
                        items,
                        filter,
                    }));
                });
                Vue.onUnmounted(() => {
                    emit("unregister");
                });
                return {
                    authorView,
                    toggleAuthorView,
                    toggleDeletedTypeFilter,
                    deletedTypeFilterText,
                    filterRegExp,
                    items,
                    displayedItems,
                    textFilter,
                    copyToClipboard,
                    clear,
                };
            },
            template: `
        <div style="display: flex; flexDirection: column; flex: 1 1 0; min-height: 0">
          <div style="display: flex">
            <div style="font-size: 16px; font-weight: 600">{{header}}</div>
            <button @click="toggleDeletedTypeFilter" style="margin-left: auto">{{deletedTypeFilterText}}</button>
            <button @click="toggleAuthorView">{{'查看：' + (authorView ? '用户' : '消息')}}</button>
            <button @click="copyToClipboard(displayedItems)">复制</button>
            <button @click="clear">清空</button>
          </div>
          <div style="display: flex">
            <input v-model="textFilter" :placeholder="textFilterPlaceholder" style="flex-grow: 1" />
            <span v-if="filterRegExp" title="正则表达式合法">✔️</span>
            <span v-if="filterRegExp === null" title="正则表达式非法">❌</span>
            <span :title="textFilterHelp">ℹ️</span>
          </div>
          <app-chat-item-list :items="displayedItems" />
        </div>
      `,
        });
        app.component("app-chat-item-list", {
            props: ["items"],
            setup() {
                const listEl = Vue.ref(null);
                let scrollToBottom = false;
                Vue.onBeforeUpdate(() => {
                    scrollToBottom = listEl.value
                        ? Math.abs(listEl.value.scrollHeight -
                            listEl.value.scrollTop -
                            listEl.value.clientHeight) < 2
                        : false;
                });
                Vue.onUpdated(() => {
                    if (listEl.value && scrollToBottom) {
                        scrollToBottom = false;
                        listEl.value.scrollTop = listEl.value.scrollHeight;
                    }
                });
                return {
                    listEl,
                };
            },
            template: `
        <div ref="listEl" style="flex-grow: 1; overflow-x: hidden; overflow-y: auto; word-break: break-all">
          <app-chat-item v-for="item in items" :key="item.id" :item="item" />
        </div>
      `,
        });
        app.component("app-chat-item", {
            props: ["item"],
            setup(props) {
                const deletedTypeIcon = Vue.computed(() => {
                    const item = props.item;
                    return getChatItemDeletedTypeIcon(item);
                });
                const deletedTypeTitle = Vue.computed(() => {
                    const item = props.item;
                    if (!item.deletedType) {
                        return null;
                    }
                    const arr = [];
                    if (item.deletedType & ChatItemDeletedType.ByItem) {
                        arr.push("单条消息被删除");
                    }
                    if (item.deletedType & ChatItemDeletedType.ByAuthor) {
                        arr.push("用户所有消息被删除");
                    }
                    let str = "";
                    if (item.deletedEfficiency == null) {
                        str += "这是被级联删除的历史消息\r\n\r\n";
                    }
                    str += "删除原因：\r\n" + arr.join("\r\n");
                    return str;
                });
                const deletedEfficiencyIcon = Vue.computed(() => {
                    const item = props.item;
                    return getChatItemDeletedEfficiencyIcon(item);
                });
                const deletedEfficiencyTitle = Vue.computed(() => {
                    const item = props.item;
                    let str = "";
                    if (item.deletedEfficiency != null) {
                        str += `删除效率：${item.deletedEfficiency}\r\n`;
                    }
                    if (item.deletedDuration != null) {
                        str += `存活时长：${toDurationString(item.deletedDuration)}`;
                    }
                    if (item.deletedType === ChatItemDeletedType.ByAuthor &&
                        item.deletedEfficiency &&
                        item.deletedEfficiency > 10) {
                        str += "\r\n\r\n删除效率数值较高，可能未观测到用户的最近消息";
                    }
                    return str;
                });
                const deletedByAuthor = Vue.computed(() => {
                    var _a;
                    const item = props.item;
                    return ((_a = item.deletedType) !== null && _a !== void 0 ? _a : 0) & ChatItemDeletedType.ByAuthor;
                });
                return {
                    deletedTypeIcon,
                    deletedTypeTitle,
                    deletedEfficiencyIcon,
                    deletedEfficiencyTitle,
                    deletedByAuthor,
                };
            },
            template: `
        <div>
          <span v-if="item.deletedType" :title="deletedTypeTitle">{{deletedTypeIcon}}</span>
          <span v-if="item.deletedType" :title="deletedEfficiencyTitle">{{deletedEfficiencyIcon}}</span>
          <span v-if="item.deletedType">&nbsp;</span>
          <span v-if="item.deletedState" style="color: #dc3545" :style="{'font-weight': deletedByAuthor ? 600 : null}">{{item.deletedState}}&nbsp;</span>
          <span>[{{item.time}}]&nbsp;</span>
          <span style="font-weight: 600">{{item.authorName}}&nbsp;</span>
          <span>{{item.message}}</span>
        </div>
      `,
        });
        app.component("app-settings", {
            emits: ["close"],
            setup(props, { emit }) {
                const settingsInternal = Vue.ref(Object.assign({}, settings.value));
                const _saveSettings = () => {
                    settings.value = Object.assign({}, settingsInternal.value);
                    GM_setValue(settingsValueKey, JSON.stringify(settings.value));
                };
                const saveSettings = () => {
                    _saveSettings();
                    emit("close");
                };
                const resetSettings = () => {
                    settingsInternal.value = Object.assign({}, defaultSettings);
                    _saveSettings();
                };
                return {
                    settings: settingsInternal,
                    saveSettings,
                    resetSettings,
                };
            },
            template: `
        <div style="display:flex; flex-direction: column; flex-grow: 1">
          <div style="font-size: 18px; font-weight: 600; margin: 5px 0">设置</div>
          <div style="font-size: 16px; font-weight: 600; margin: 5px 0">观察哨</div>
          <div style="display: flex">
            <div style="width: 150px">删除消息报告数</div>
            <input style="width: 100px" type="number" required min="1" max="20" step="1" v-model.number="settings.reportedChatItemCount" />
          </div>
          <div style="font-size: 16px; font-weight: 600; margin: 5px 0">CV-6</div>
          <div style="display: flex">
            <div style="width: 150px">CV-6端口</div>
            <input style="width: 100px" type="number" required min="0" max="65535" step="1" v-model.number="settings.cv6Port" />
          </div>
          <div style="margin: 5px 0">
            <button @click="saveSettings">保存</button>
            <button @click="resetSettings">重置</button>
          </div>
        </div>
      `,
        });
        return app;
    }
    const headerActionButtonsEl = await waitFor(() => { var _a; return (_a = document.querySelector("#action-buttons.yt-live-chat-header-renderer")) !== null && _a !== void 0 ? _a : undefined; });
    if (!headerActionButtonsEl) {
        console.error("YouTube聊天观察哨初始化失败");
        return;
    }
    try {
        const loadedSettings = JSON.parse(GM_getValue(settingsValueKey) || "{}");
        Object.keys(defaultSettings).forEach((key) => {
            const settingsKey = key;
            if (typeof loadedSettings[settingsKey] ===
                typeof defaultSettings[settingsKey]) {
                settings.value[settingsKey] = loadedSettings[settingsKey];
            }
        });
    }
    catch (error) {
        console.error(error);
    }
    const rootEl = document.createElement("div");
    headerActionButtonsEl.prepend(rootEl);
    const app = createApp();
    app.mount(rootEl);
})();
