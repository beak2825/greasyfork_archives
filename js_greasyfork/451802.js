// ==UserScript==
// @name              notion-kroki
// @namespace         https://github.com/zuisong/notion-kroki
// @homepage          https://github.com/zuisong/notion-kroki
// @homepageURL       https://github.com/zuisong/notion-kroki
// @source            https://github.com/zuisong/notion-kroki
// @contributionURL   https://github.com/zuisong/notion-kroki
// @grant             none
// @version           1.2.0
// @license           MIT
// @match             *://www.notion.so/*
// @match             *://*.notion.site/*
// @match             *://*.super.site/*
// @supportURL        https://github.com/zuisong/notion-kroki/issues
// @require           https://unpkg.com/fflate@0.8.0/umd/index.js
// @run-at            document-idle
// @author            zuisong
// @description       Render notion code block as graph by kroki
// @downloadURL https://update.greasyfork.org/scripts/451802/notion-kroki.user.js
// @updateURL https://update.greasyfork.org/scripts/451802/notion-kroki.meta.js
// ==/UserScript==
function debounce(func, wait) {
    let timeoutId;
    return function debounced() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        clearTimeout(timeoutId);
        timeoutId = setTimeout(()=>{
            timeoutId = undefined;
            func(...args);
        }, wait);
    };
}
function _debug() {
    for(var _len = arguments.length, data = new Array(_len), _key = 0; _key < _len; _key++){
        data[_key] = arguments[_key];
    }
    if (isDebugMode()) {
        console.log(...data);
    }
}
function isDebugMode() {
    return !!localStorage.getItem("debug");
}
const defaultConfig = {
    serverPath: "//kroki.io/"
};
function main() {
    let element = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
    const blocks = Array.from((element || document.body).querySelectorAll("*")).filter((it)=>it.textContent.startsWith("//kroki "));
    for (const codeDiv of blocks){
        const lines = codeDiv.textContent.split("\n");
        const type = lines[0].replace("//kroki", "").trim();
        if (!type.trim()) continue;
        const data = lines.filter((_value, index)=>index !== 0).join("\n");
        if (!data.trim()) continue;
        const svgUrl = plant(data, type, defaultConfig);
        const div = document.createElement("div", undefined);
        div.setAttribute("style", "display: flex; flex-direction: row; place-content: center;");
        div.setAttribute("notion-kroki", "true");
        div.innerHTML = `<object type="image/svg+xml" style="max-width: 100%;" data="${svgUrl}" />`;
        const parentElement = codeDiv.parentElement.parentElement;
        const preCreatedNode = parentElement.querySelector("div[notion-kroki]");
        if (preCreatedNode) {
            const preSvgUrl = preCreatedNode.firstElementChild.getAttribute("data");
            _debug(`preSvgUrl:${preSvgUrl}`);
            _debug(`svgUrl:${svgUrl}`);
            if (preSvgUrl === svgUrl) {
                continue;
            } else {
                parentElement.removeChild(preCreatedNode);
            }
        }
        parentElement.appendChild(div);
    }
}
function textEncode(str) {
    return new TextEncoder().encode(str);
}
function plant(content, type, config) {
    _debug(`kroki render type: ${type}`);
    _debug(`kroki render content:\n${content}`);
    const urlPrefix = `${config.serverPath + type}/svg/`;
    const data = textEncode(content);
    const compressed = strFromU8(fflate.zlibSync(data, {
        level: 9
    }));
    const result = btoa(compressed).replace(/\+/g, "-").replace(/\//g, "_");
    const svgUrl = urlPrefix + result;
    return svgUrl;
}
function init_listener() {
    if (globalThis.MutationObserver) {
        new MutationObserver(check).observe(document, {
            childList: true,
            subtree: true
        });
    }
}
const render = debounce(main, 100);
function check(mutations, _observer) {
    render();
}
function strFromU8(dat) {
    let r = "";
    const s = 2 ** 15;
    for(let i = 0; i < dat.length; i += s){
        r += String.fromCharCode(...dat.subarray(i, i + s));
    }
    return r;
}
main();
init_listener();

