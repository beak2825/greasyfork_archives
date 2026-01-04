// ==UserScript==
// @name         Customize and Share MWI Avatar
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Allow you to replace your avatar with any image, and share it with other players who also installed this script.
// @author       VoltaX
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @connect      https://mwi-avatar.voltax.workers.dev
// @icon         http://milkywayidle.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535854/Customize%20and%20Share%20MWI%20Avatar.user.js
// @updateURL https://update.greasyfork.org/scripts/535854/Customize%20and%20Share%20MWI%20Avatar.meta.js
// ==/UserScript==
const css = 
`
.custom-mwi-avatar{
    width: 100%;
    height: 100%;
}
`;
const InsertStyleSheet = (style) => {
    const s = new CSSStyleSheet();
    s.replaceSync(style);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, s];
};
InsertStyleSheet(css);
const HTML = (tagname, attrs, ...children) => {
    if(attrs === undefined) return document.createTextNode(tagname);
    const ele = document.createElement(tagname);
    if(attrs) for(const [key, value] of Object.entries(attrs)){
        if(value === null || value === undefined) continue;
        if(key.charAt(0) === "_"){
            const type = key.slice(1);
            ele.addEventListener(type, value);
        }
        else if(key === "eventListener"){
            for(const listener of value){
                ele.addEventListener(listener.type, listener.listener, listener.options);
            }
        }
        else ele.setAttribute(key, value);
    }
    for(const child of children) if(child) ele.append(child);
    return ele;
};
const RemoteHost = "https://mwi-avatar.voltax.workers.dev";
const AvatarPath = "/get-avatar";
const AvatarsPath = "/get-avatars";
const UploadPath = "/set-avatar";
let PlayerUsername = "";
let avatarCache;
let lastUpdated;
const expireTime = 3 * 60 * 60 * 1000;
class Lock{
    #queue = [];
    #count = 0;
    constructor(count){
        this.#count = count;
        this.release = this.release.bind(this);
    };
    acquire(){
        if(this.#count > 0) {
            this.#count -= 1;
            return this.release;
        }
        else{
            const {promise, resolve} = Promise.withResolvers();
            this.#queue.push(resolve);
            return promise;
        }
    };
    release(){
        if(this.#queue.length > 0){
            const front = this.#queue.shift();
            front(this.release);
        }
        else this.#count += 1;
    };
};
const ReqLock = new Lock(1);
const InitCache = () => {
    try{
        avatarCache = JSON.parse(window.localStorage.getItem("custom-avatar-cache") ?? "undefined");
        lastUpdated = JSON.parse(window.localStorage.getItem("custom-avatar-cache-updated") ?? "undefined");
    } catch(e){
        avatarCache = undefined;
        lastUpdated = undefined;
    }
}
InitCache();
const SaveCache = () => {
    window.localStorage.setItem("custom-avatar-cache", JSON.stringify(avatarCache));
    window.localStorage.setItem("custom-avatar-cache-updated", JSON.stringify(lastUpdated));
};
const UpdateCache = async () => {
    const res = await fetch(`${RemoteHost}${AvatarsPath}`, {mode: "cors"});
    if(res.status === 200){
        avatarCache = await res.json();
        lastUpdated = new Date().getTime();
        SaveCache();
        return true;
    }
    else return false;
};
const CheckCache = async (username) => {
    if(!lastUpdated || !avatarCache || (new Date().getTime() - lastUpdated >= expireTime)){
        const cacheValid = await UpdateCache();
        if(cacheValid) return avatarCache[username];
        else return false;
    }
    else return avatarCache[username];
};
const GetCustomAvatar = async (username) => {
    const lock = await ReqLock.acquire();
    const result = await CheckCache(username);
    lock();
    return result;
};
const ReplaceHeaderAvatar = async () => {
    const characterInfoDiv = document.querySelector("div.Header_characterInfo__3ixY8:not([avatar-modified])");
    if(!characterInfoDiv) return;
    console.log("ReplaceHeader");
    characterInfoDiv.setAttribute("avatar-modified", "");
    const username = characterInfoDiv.querySelector(":scope div.CharacterName_name__1amXp").dataset.name;
    if(!PlayerUsername) PlayerUsername = username;
    const avatarWrapperDiv = characterInfoDiv.querySelector(":scope div.Header_avatar__2RQgo");
    const avatarURL = await GetCustomAvatar(username);
    if(avatarURL) avatarWrapperDiv.replaceChildren(
        HTML("img", {class: "custom-mwi-avatar", src: avatarURL})
    );
};
const ReplaceProfileAvatar = async () => {
    const profileDiv = document.querySelector("div.SharableProfile_modal__2OmCQ:not([avatar-modified])");
    if(!profileDiv) return;
    profileDiv.setAttribute("avatar-modified", "");
    const username = profileDiv.querySelector(":scope div.CharacterName_name__1amXp").dataset.name;
    const avatarWrapperDiv = profileDiv.querySelector(":scope div.FullAvatar_fullAvatar__3RB2h.FullAvatar_xlarge__1cmUN");
    const avatarURL = await GetCustomAvatar(username);
    if(avatarURL) avatarWrapperDiv.replaceChildren(
        HTML("img", {class: "custom-mwi-avatar", src: avatarURL})
    );
};
const ReplacePartyMember = async () => {
    const slotDiv = document.querySelector("div.Party_partySlots__3zGeH:not([avatar-modified])");
    if(!slotDiv) return;
    slotDiv.setAttribute("avatar-modified", "");
    const username = slotDiv.querySelector(":scope div.CharacterName_name__1amXp").dataset.name;
    const avatarWrapperDiv = slotDiv.querySelector(":scope div.FullAvatar_fullAvatar__3RB2h.FullAvatar_large__fJGwX");
    const avatarURL = await GetCustomAvatar(username);
    if(avatarURL) avatarWrapperDiv.replaceChildren(
        HTML("img", {class: "custom-mwi-avatar", src: avatarURL})
    );
};
const ReplaceCombatUnit = async () => {
    const unitDiv = document.querySelector("div.CombatUnit_combatUnit__1m3XT:not([avatar-modified])");
    if(!unitDiv) return;
    unitDiv.setAttribute("avatar-modified", "");
    const username = unitDiv.querySelector(":scope div.CombatUnit_name__1SlO1").textContent;
    const avatarWrapperDiv = unitDiv.querySelector(":scope div.FullAvatar_fullAvatar__3RB2h");
    const avatarURL = await GetCustomAvatar(username);
    if(avatarURL) avatarWrapperDiv.replaceChildren(
        HTML("img", {class: "custom-mwi-avatar", src: avatarURL})
    );
};
const UploadAvatar = async () => {
    const URLInput = document.getElementById("custom-avatar-url-input").value;
    const errorSpan = document.getElementById("custom-avatar-upload-error");
    try{
        const toURL = new URL(URLInput);
        if(toURL.protocol != "https:"){
            errorSpan.textContent = "输入的链接协议不是https";
        }
    }
    catch(e){
        if(e instanceof TypeError) {
            errorSpan.textContent = "输入的链接不是有效的URL";
            return;
        }
        else console.error(e);
    };
    errorSpan.textContent = "准备上传";
    const res = await fetch(`${RemoteHost}${UploadPath}`, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: PlayerUsername,
            imageURL: URLInput,
        })
    });
    if(res.status === 200) {
        errorSpan.textContent = "成功上传";
        avatarCache[PlayerUsername] = URLInput;
        SaveCache();
        RefreshAvatar();
    }
    else errorSpan.textContent = `上传失败：${res.status} ${await res.text()}`;
};
const ManualRefresh = async () => {
    const errorSpan = document.getElementById("custom-avatar-upload-error");
    avatarCache = undefined;
    lastUpdated = undefined;
    errorSpan.textContent = "准备刷新";
    try{
        await GetCustomAvatar(PlayerUsername);
    }
    catch(e){
        errorSpan.textContent = "刷新时出现错误，请联系VoltaX";
    }
    errorSpan.textContent = "刷新完成";
    RefreshAvatar();
};
const ShowHelp = () => {
    const errorSpan = document.getElementById("custom-avatar-upload-error");
    errorSpan.textContent = "帮助信息正在施工中";
};
const AddUploadInput = () => {
    const settingDiv = document.querySelector("div.SettingsPanel_profileTab__214Bj:not([avatar-upload-added])");
    if(!settingDiv) return;
    settingDiv.setAttribute("avatar-upload-added", "");
    const settingGrid = settingDiv.children[0];
    const frag = document.createDocumentFragment();
    frag.append(
        HTML("div", {class: "SettingsPanel_label__24LRD"}, "上传自定义头像"),
        HTML("div", {class: "SettingsPanel_value__2nsKD"},
            HTML("input", {id: "custom-avatar-url-input", class: "SettingsPanel_value__2nsKD Input_input__2-t98", placeholder: "输入自定义头像的图床链接"}),
            HTML("button", {class: "Button_button__1Fe9z", _click: UploadAvatar}, "上传"),
            HTML("button", {class: "Button_button__1Fe9z", _click: ShowHelp}, "帮助"),
            HTML("button", {class: "Button_button__1Fe9z", _click: ManualRefresh}, "刷新本地缓存"),
        ),
        HTML("div", {class: "SettingsPanel_label__24LRD"}),
        HTML("div", {class: "SettingsPanel_value__2nsKD"},
            HTML("span", {id: "custom-avatar-upload-error"}),
        ),
    );
    settingGrid.insertBefore(frag, settingGrid.children[0]);
}
const OnMutate = (mutlist, observer) => {
    observer.disconnect();
    ReplaceHeaderAvatar();
    ReplaceProfileAvatar();
    ReplaceCombatUnit();
    ReplacePartyMember();
    AddUploadInput();
    observer.observe(document, {subtree: true, childList: true});
};
const observer = new MutationObserver(OnMutate)
observer.observe(document, {subtree: true, childList: true});
const RefreshAvatar = () => {
    document.querySelectorAll("[avatar-modified]").forEach(ele => ele.removeAttribute("avatar-modified"));
    OnMutate([], observer);
};