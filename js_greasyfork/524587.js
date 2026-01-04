// ==UserScript==
// @name         Luogu Alias And Customize Tags
// @namespace    http://tampermonkey.net/
// @version      2025-01-23 15:17
// @description  try to take over the world!
// @author       normalpcer
// @match        https://www.luogu.com.cn/*
// @match        https://www.luogu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=luogu.com.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524587/Luogu%20Alias%20And%20Customize%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/524587/Luogu%20Alias%20And%20Customize%20Tags.meta.js
// ==/UserScript==
/**
 * 自定义类名、LocalStorage 项的前缀。
 * 为了避免与其他插件重名。
 */
const Prefix = "normalpcer-alias-tags-";
const Cooldown = 1000; // 两次修改的冷却时间（毫秒）
const Colors = new Map(Object.entries({
    purple: "#9d3dcf",
    red: "#fe4c61",
    orange: "#f39c11",
    green: "#52c41a",
    blue: "#3498db",
    gray: "#bfbfbf",
}));
/**
 * 用于确定一个用户
 */
class UserIdentifier {
    uid; // 0 为无效项
    username;
    constructor(uid, username) {
        this.uid = uid;
        this.username = username;
    }
    static fromUid(uid) {
        console.log(`UserIdentifier::fromUid(${uid})`);
        let res = uidToIdentifier.get(uid);
        if (res !== undefined) {
            return new Promise((resolve, _) => {
                resolve(res);
            });
        }
        // 否则，直接通过 API 爬取
        const APIBase = "/api/user/search?keyword=";
        let api = APIBase + uid.toString();
        console.log("api: " + api);
        let xml = new XMLHttpRequest();
        xml.open("GET", api);
        return new Promise((resolve, reject) => {
            xml.addEventListener("loadend", () => {
                console.log("status: " + xml.status);
                console.log("response: " + xml.responseText);
                if (xml.status === 200) {
                    let json = JSON.parse(xml.responseText);
                    let users = json["users"];
                    if (users.length !== 1) {
                        reject();
                    }
                    else {
                        let uid = users[0]["uid"];
                        let username = users[0]["name"];
                        let identifier = new UserIdentifier(uid, username);
                        uidToIdentifier.set(uid, identifier);
                        usernameToIdentifier.set(username, identifier);
                        resolve(identifier);
                    }
                }
                else {
                    reject();
                }
            });
            xml.send();
        });
    }
    static fromUsername(username) {
        console.log(`UserIdentifier::fromUsername(${username})`);
        let res = usernameToIdentifier.get(username);
        if (res !== undefined) {
            return new Promise((resolve) => {
                resolve(res);
            });
        }
        const APIBase = "/api/user/search?keyword=";
        let api = APIBase + username;
        let xml = new XMLHttpRequest();
        xml.open("GET", api);
        return new Promise((resolve, reject) => {
            xml.addEventListener("loadend", () => {
                console.log("response: ", xml.responseText);
                if (xml.status === 200) {
                    let json = JSON.parse(xml.responseText);
                    let users = json["users"];
                    if (users.length !== 1) {
                        reject();
                    }
                    else {
                        let uid = users[0]["uid"];
                        let username = users[0]["name"];
                        let identifier = new UserIdentifier(uid, username);
                        uidToIdentifier.set(uid, identifier);
                        usernameToIdentifier.set(username, identifier);
                        resolve(identifier);
                    }
                }
                else {
                    reject();
                }
            });
            xml.send();
        });
    }
    /**
     * 通过用户给定的字符串，自动判断类型并创建 UserIdentifier 对象。
     * @param s 新创建的 UserIdentifier 对象
     */
    static fromAny(s) {
        // 保证：UID 一定为数字
        // 忽略首尾空格，如果是一段完整数字，视为 UID
        if (s.trim().match(/^\d+$/)) {
            return UserIdentifier.fromUid(parseInt(s));
        }
        else {
            return UserIdentifier.fromUsername(s);
        }
    }
    dump() {
        return { uid: this.uid, username: this.username };
    }
}
let uidToIdentifier = new Map();
let usernameToIdentifier = new Map();
class UsernameAlias {
    id;
    newName;
    constructor(id, newName) {
        this.id = id;
        this.newName = newName;
    }
    /**
     * 在当前文档中应用别名。
     * 当前采用直接 dfs 全文替换的方式。
     */
    apply() {
        function dfs(p, alias) {
            // 进行一些特判。
            /**
             * 如果当前为私信页面，那么位于顶栏的用户名直接替换会出现问题。
             * 在原名的后面用括号标注别名，并且在修改时删除别名
             */
            if (window.location.href.includes("/chat")) {
                if (p.classList.contains("title")) {
                    let a_list = p.querySelectorAll(`a[href*='/user/${alias.id.uid}']`);
                    if (a_list.length === 1) {
                        let a = a_list[0];
                        if (a.children.length !== 1)
                            return;
                        let span = a.children[0];
                        if (!(span instanceof HTMLSpanElement))
                            return;
                        if (span.innerText.includes(alias.id.username)) {
                            if (span.getElementsByClassName(Prefix + "alias").length !== 0)
                                return;
                            // 尝试在里面添加一个 span 标注别名
                            let alias_span = document.createElement("span");
                            alias_span.classList.add(Prefix + "alias");
                            alias_span.innerText = `(${alias.newName})`;
                            span.appendChild(alias_span);
                            // 在真实名称修改时删除别名
                            let observer = new MutationObserver(() => {
                                span.removeChild(alias_span);
                                observer.disconnect();
                            });
                            observer.observe(span, {
                                characterData: true,
                                childList: true,
                                subtree: true,
                                attributes: true,
                            });
                        }
                    }
                    return;
                }
            }
            if (p.children.length == 0) {
                // 到达叶子节点，进行替换
                if (!p.innerText.includes(alias.id.username)) {
                    return; // 尽量不做修改
                }
                p.innerText = p.innerText.replaceAll(alias.id.username, alias.newName);
            }
            else {
                for (let element of p.children) {
                    if (element instanceof HTMLElement) {
                        dfs(element, alias);
                    }
                }
            }
        }
        dfs(document.body, this);
    }
    dump() {
        return { uid: this.id.uid, newName: this.newName };
    }
}
let aliases = new Map();
let cache = new Map(); // 每个 UID 的缓存
class SettingBoxItem {
}
class SettingBoxItemText {
    element = null;
    placeholder;
    constructor(placeholder) {
        this.placeholder = placeholder;
    }
    createElement() {
        if (this.element !== null) {
            throw "SettingBoxItemText::createElement(): this.element is not null.";
        }
        let new_element = document.createElement("input");
        new_element.placeholder = this.placeholder;
        this.element = new_element;
        return new_element;
    }
    getValue() {
        if (this.element instanceof HTMLInputElement) {
            return this.element.value;
        }
        else {
            throw "SettingBoxItemText::getValue(): this.element is not HTMLInputElement.";
        }
    }
}
/**
 * 位于主页的设置块
 */
class SettingBox {
    title;
    items = [];
    placed = false; // 已经被放置
    callback = null; // 确定之后调用的函数
    constructor(title) {
        this.title = title;
    }
    /**
     * 使用一个新的函数处理用户输入
     * @param func 用作处理的函数
     */
    handle(func = null) {
        this.callback = func;
    }
    /**
     * 尝试在当前文档中放置设置块。
     * 如果已经存在，则不会做任何事。
     */
    place() {
        if (this.placed)
            return;
        let parent = document.getElementById(Prefix + "boxes-parent");
        if (!(parent instanceof HTMLDivElement))
            return;
        let new_element = document.createElement("div");
        new_element.classList.add("lg-article");
        // 标题元素
        let title_element = document.createElement("h2");
        title_element.innerText = this.title;
        // "收起"按钮
        let fold_button = document.createElement("span");
        fold_button.innerText = "[收起]";
        fold_button.style.marginLeft = "0.5em";
        fold_button.setAttribute("fold", "0");
        title_element.appendChild(fold_button);
        new_element.appendChild(title_element);
        // 依次创建接下来的询问
        let queries = document.createElement("div");
        for (let x of this.items) {
            queries.appendChild(x.createElement());
        }
        // “确定”按钮
        let confirm_button = document.createElement("input");
        confirm_button.type = "button";
        confirm_button.value = "确定";
        confirm_button.classList.add("am-btn", "am-btn-primary", "am-btn-sm");
        if (this.callback !== null) {
            let callback = this.callback;
            let args = this.items;
            confirm_button.onclick = () => callback(args);
        }
        queries.appendChild(confirm_button);
        new_element.appendChild(queries);
        fold_button.onclick = () => {
            if (fold_button.getAttribute("fold") === "0") {
                fold_button.innerText = "[展开]";
                fold_button.setAttribute("fold", "1");
                queries.style.display = "none";
            }
            else {
                fold_button.innerText = "[收起]";
                fold_button.setAttribute("fold", "0");
                queries.style.display = "block";
            }
        };
        parent.insertBefore(new_element, parent.children[0]); // 插入到开头
        this.placed = true;
    }
}
/**
 * 用户自定义标签
 */
class UserTag {
    id;
    tag;
    constructor(id, tag) {
        this.id = id;
        this.tag = tag;
    }
    /**
     * 应用一个标签
     */
    apply() {
        // 寻找所有用户名出现的位置
        // 对于页面中的所有超链接，如果链接内容含有 "/user/uid"，且为叶子节点，则认为这是一个用户名
        let feature = `/user/${this.id.uid}`;
        let selector = `a[href*='${feature}']`;
        if (window.location.href.includes(feature)) {
            selector += ", .user-name > span";
        }
        let links = document.querySelectorAll(selector);
        for (let link of links) {
            if (!(link instanceof HTMLElement)) {
                console.log("UserTag::apply(): link is not HTMLElement.");
                continue;
            }
            // 已经放置过标签
            if (link.parentElement?.getElementsByClassName(Prefix + "customized-tag").length !== 0) {
                // console.log("UserTag::apply(): already placed tag.");
                continue;
            }
            if (link.children.length === 1 && link.children[0] instanceof HTMLSpanElement) {
                // 特别地，仅有一个 span 是允许的
                link = link.children[0];
            }
            else if (link.children.length !== 0) {
                // 否则，要求 link 为叶子节点
                // console.log("UserTag::apply(): link is not a leaf node.");
                continue;
            }
            if (!(link instanceof HTMLElement))
                continue; // 让 Typescript 认为 link 是 HTMLElement
            // console.log(link);
            // 获取用户名颜色信息
            // - 如果存在颜色属性，直接使用
            // - 否则，尝试通过 class 推断颜色
            let existsColorStyle = false;
            let color = link.style.color;
            let colorHex = "";
            let colorName = ""; // 通过 class 推断的颜色名
            if (color !== "") {
                existsColorStyle = true;
                // 尝试解析十六进制颜色或者 rgb 颜色
                if (color.startsWith("#")) {
                    colorHex = color;
                }
                else if (color.startsWith("rgb")) {
                    let rgb = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
                    if (rgb !== null) {
                        // 十进制转为十六进制
                        const f = (x) => parseInt(x).toString(16).padStart(2, "0");
                        colorHex = "#" + f(rgb[1]) + f(rgb[2]) + f(rgb[3]);
                    }
                    else {
                        throw "UserTag::apply(): cannot parse color " + color;
                    }
                }
                else {
                    throw "UserTag::apply(): cannot parse color " + color;
                }
            }
            else {
                // 尝试从类名推断
                let classList = link.classList;
                for (let x of classList) {
                    if (x.startsWith("lg-fg-")) {
                        colorName = x.substring(6);
                        break;
                    }
                }
            }
            if (!existsColorStyle && colorName === "") {
                // 尝试使用缓存中的颜色
                if (cache.has(this.id.uid)) {
                    let data = cache.get(this.id.uid)?.get("color");
                    console.log("data", data);
                    if (data !== undefined && typeof data === "string") {
                        colorHex = data;
                        existsColorStyle = true;
                    }
                }
            }
            // 完全无法推断，使用缺省值灰色
            if (!existsColorStyle && colorName === "") {
                let color = Colors.get("gray");
                if (color !== undefined) {
                    colorHex = color;
                }
                else {
                    throw "UserTag::apply(): cannot find color gray.";
                }
            }
            console.log(`tag ${this.tag} for ${this.id.uid}. colorHex = ${colorHex}, colorName = ${colorName}`);
            // 生成标签
            let new_element = document.createElement("span");
            new_element.classList.add("lg-bg-" + colorName);
            new_element.classList.add("am-badge");
            new_element.classList.add("am-radius");
            new_element.classList.add(Prefix + "customized-tag");
            new_element.innerText = this.tag;
            if (!existsColorStyle) {
                let color = Colors.get(colorName);
                if (color !== undefined) {
                    colorHex = color;
                }
                else {
                    throw "UserTag::apply(): cannot find color " + colorName;
                }
            }
            new_element.style.setProperty("background", colorHex, "important");
            new_element.style.setProperty("border-color", colorHex, "important");
            new_element.style.setProperty("color", "#fff", "important");
            // 特别地，如果 innerText 不以空格结尾，添加 0.3em 的 margin-left
            if (!link.innerText.endsWith(" ")) {
                new_element.style.marginLeft = "0.3em";
            }
            // 插入到文档中
            if (!(link instanceof HTMLAnchorElement)) {
                if (link.parentElement instanceof HTMLAnchorElement) {
                    link = link.parentElement;
                }
            }
            if (!(link instanceof HTMLElement)) {
                throw "UserTag::apply(): link is not HTMLElement before insertion.";
            }
            let parent = link.parentElement;
            if (parent === null) {
                throw "UserTag::apply(): cannot find parent.";
            }
            // 在 link 之后
            if (parent.lastChild === link) {
                parent.appendChild(new_element);
            }
            else {
                parent.insertBefore(new_element, link.nextSibling);
            }
            // 在原始元素被修改时删除标签
            // 仍然是为了适配私信界面
            let observer = new MutationObserver(() => {
                observer.disconnect();
                new_element.remove();
            });
            observer.observe(link, {
                childList: true,
                characterData: true,
                subtree: true,
                attributes: true,
            });
            // 在缓存中保存颜色信息
            if (!cache.has(this.id.uid))
                cache.set(this.id.uid, new Map());
            cache.get(this.id.uid)?.set("color", colorHex);
            saveCache();
        }
    }
    dump() {
        return { uid: this.id.uid, tag: this.tag };
    }
}
let tags = new Map();
/**
 * 从 localStorage 加载/存储数据
 */
const StorageKeyName = Prefix + "alias_tag_data";
const StorageCacheKeyName = Prefix + "alias_tag_cache";
function load() {
    let json = localStorage.getItem(StorageKeyName);
    if (json !== null) {
        let data = JSON.parse(json);
        let _identifiers = data.identifiers;
        if (_identifiers instanceof Array) {
            for (let x of _identifiers) {
                let uid = x.uid;
                let username = x.username;
                // 判断 uid 为数字，username 为字符串
                if (typeof uid === "number" && typeof username === "string") {
                    let identifier = new UserIdentifier(uid, username);
                    uidToIdentifier.set(uid, identifier);
                    usernameToIdentifier.set(username, identifier);
                }
            }
        }
        let _aliases = data.aliases;
        if (_aliases instanceof Array) {
            for (let x of _aliases) {
                let uid = x.uid;
                let newName = x.newName;
                if (typeof uid === "number" && typeof newName === "string") {
                    let identifier = uidToIdentifier.get(uid);
                    if (identifier !== undefined) {
                        aliases.set(identifier, new UsernameAlias(identifier, newName));
                    }
                }
            }
        }
        let _tags = data.tags;
        if (_tags instanceof Array) {
            for (let x of _tags) {
                let uid = x.uid;
                let tag = x.tag;
                if (typeof uid === "number" && typeof tag === "string") {
                    let identifier = uidToIdentifier.get(uid);
                    if (identifier !== undefined) {
                        tags.set(identifier, new UserTag(identifier, tag));
                    }
                }
            }
        }
    }
    let json_cache = localStorage.getItem(StorageCacheKeyName);
    if (json_cache !== null) {
        let _cache = JSON.parse(json_cache);
        if (_cache instanceof Array) {
            for (let item of _cache) {
                if (item instanceof Array && item.length === 2) {
                    let [uid, data] = item;
                    if (typeof uid === "number" && typeof data === "object") {
                        let data_map = new Map();
                        for (let [key, value] of Object.entries(data)) {
                            if (typeof key === "string") {
                                data_map.set(key, value);
                            }
                        }
                        cache.set(uid, data_map);
                    }
                }
            }
        }
    }
}
function save() {
    let data = {
        identifiers: Array.from(uidToIdentifier.values()).map((x) => x.dump()),
        aliases: Array.from(aliases.values()).map((x) => x.dump()),
        tags: Array.from(tags.values()).map((x) => x.dump()),
    };
    let json = JSON.stringify(data);
    localStorage.setItem(StorageKeyName, json);
}
function saveCache() {
    let cache_data = Array.from(cache.entries()).map(([uid, data]) => [
        uid,
        Object.fromEntries(data.entries()),
    ]);
    let json_cache = JSON.stringify(cache_data);
    localStorage.setItem(StorageCacheKeyName, json_cache);
}
(function () {
    "use strict";
    load();
    //
    // Your code here...
    // “添加别名”设置块
    let alias_box = new SettingBox("添加别名");
    alias_box.items.push(new SettingBoxItemText("UID/用户名"));
    alias_box.items.push(new SettingBoxItemText("别名"));
    alias_box.handle((arr) => {
        let uid_or_name = arr[0].getValue();
        let alias = arr[1].getValue();
        console.log(`${uid_or_name} -> ${alias}?`);
        UserIdentifier.fromAny(uid_or_name).then((identifier) => {
            console.log(`${identifier.uid} ${identifier.username} -> ${alias}`);
            aliases.set(identifier, new UsernameAlias(identifier, alias));
            alert(`为 ${identifier.username} (${identifier.uid}) 添加别名 ${alias}`);
            save();
            run();
        });
    });
    // “添加标签”设置块
    let tag_box = new SettingBox("添加标签");
    tag_box.items.push(new SettingBoxItemText("UID/用户名"));
    tag_box.items.push(new SettingBoxItemText("标签"));
    tag_box.handle((arr) => {
        let uid_or_name = arr[0].getValue();
        let tag = arr[1].getValue();
        UserIdentifier.fromAny(uid_or_name).then((identifier) => {
            console.log(`${identifier.uid} ${identifier.username} -> tag ${tag}`);
            tags.set(identifier, new UserTag(identifier, tag));
            alert(`为 ${identifier.username} (${identifier.uid}) 添加标签 ${tag}`);
            save();
            run();
        });
        save();
    });
    // “还原用户”设置块
    let restore_box = new SettingBox("还原用户");
    restore_box.items.push(new SettingBoxItemText("UID/用户名"));
    restore_box.handle((arr) => {
        let uid_or_name = arr[0].getValue();
        UserIdentifier.fromAny(uid_or_name).then((identifier) => {
            let deleted_item = [];
            if (aliases.has(identifier)) {
                aliases.delete(identifier);
                deleted_item.push("别名");
            }
            if (tags.has(identifier)) {
                tags.delete(identifier);
                deleted_item.push("标签");
            }
            if (deleted_item.length > 0) {
                alert(`已删除 ${identifier.username} (${identifier.uid}) 的 ${deleted_item.join("和")}（刷新网页生效）`);
            }
            save();
        });
    });
    console.log("Luogu Alias And Customize Tags");
    // let prev_time = Date.now();
    function run() {
        // if (Date.now() - prev_time < Cooldown) return;
        try {
            restore_box.place();
            tag_box.place();
            alias_box.place();
        }
        catch (_) { }
        for (let [_, alias] of aliases) {
            alias.apply();
        }
        for (let [_, tag] of tags) {
            tag.apply();
        }
    }
    window.onload = () => {
        // 创建 boxes-parent
        function create_boxes_parent() {
            let boxes_grand_parent = document.querySelectorAll(".am-g .am-u-lg-3");
            if (boxes_grand_parent.length !== 1)
                throw "cannot place boxes-parent";
            let boxes_parent = document.createElement("div");
            boxes_parent.id = Prefix + "boxes-parent";
            boxes_grand_parent[0].insertBefore(boxes_parent, boxes_grand_parent[0].firstChild);
        }
        try {
            create_boxes_parent();
        }
        catch (err) {
            console.log("create_boxes_parent: ", err);
        }
        // 加入 style 标签
        let new_style = document.createElement("style");
        new_style.innerHTML = `
span.${Prefix}customized-tag {
    display: inline-block;
    color: #fff;
    padding: 0.25em 0.625em;
    font-size: min(0.8em, 1.3rem);
    font-weight: 800;
    /* margin-left: 0.3em; */
    border-radius: 2px;
}`;
        // console.log(new_style);
        new_style.id = Prefix + "customized-tags-style";
        document.head.appendChild(new_style);
        /*
        const observer = new MutationObserver(run);
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true,
        });
        setTimeout(run, Cooldown);
*/
        setInterval(run, Cooldown);
    };
})();
