// ==UserScript==
// @name         童话翻译
// @version      1.03
// @description  拦截指定路径的请求，修改内容并返回
// @author       红凯
// @match        https://otogi-rest.otogi-frontier.com/*
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/1408925
// @downloadURL https://update.greasyfork.org/scripts/520294/%E7%AB%A5%E8%AF%9D%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/520294/%E7%AB%A5%E8%AF%9D%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function () {
    const open = XMLHttpRequest.prototype.open;
    const send = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        this._interceptedUrl = url;
        return open.apply(this, arguments);
    };

    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        if (url.includes("Assets/font")) {
            console.log("[重定向字体]");
            const newURL = "https://pub-8c5e69e127a7478d9f9bec549ff7d8d5.r2.dev/font";
            arguments[1] = newURL;
        }

        this._interceptedUrl = url;
        return open.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function (body) {
        this.addEventListener("readystatechange", function () {
            if (this.readyState === 4 && this._interceptedUrl.includes("api/MAdults/MonsterMAdults/")) {
                const lastPartOfUrl = this._interceptedUrl.split("/").pop();
                if (this.responseType === "arraybuffer") {
                    const textDecoder = new TextDecoder();
                    const textEncoder = new TextEncoder();

                    try {
                        const originalText = textDecoder.decode(this.response);
                        let originalJson = JSON.parse(originalText);
                        const translationJsonUrl = "https://raw.githubusercontent.com/kureinaikai/otogi_frontier_translate/refs/heads/main/MAdults/"+lastPartOfUrl+".json";
                        const translationData = loadTranslationJsonSync(translationJsonUrl);

                        if (translationData) {
                            originalJson = replaceUsingTranslation(originalJson, translationData);
                        } else {
                            console.warn("[拦截] 未加载到译文 JSON，跳过替换。");
                        }
                        const modifiedText = JSON.stringify(originalJson);
                        const modifiedArrayBuffer = textEncoder.encode(modifiedText).buffer;
                        Object.defineProperty(this, "response", { value: modifiedArrayBuffer });
                        console.log("[拦截] 替换后的 ArrayBuffer 响应已返回给页面。");

                    } catch (e) {
                        console.error("[拦截] ArrayBuffer 转换或 JSON 解析失败：", e);
                    }
                }
            }else if(this.readyState === 4 && this._interceptedUrl.includes("api/MScenes/")){
                const lastPartOfUrl = this._interceptedUrl.split("/").pop();
                if (this.responseType === "arraybuffer") {
                    const textDecoder = new TextDecoder();
                    const textEncoder = new TextEncoder();

                    try {
                        const originalText = textDecoder.decode(this.response);
                        let originalJson = JSON.parse(originalText);
                        const translationJsonUrl = "https://raw.githubusercontent.com/kureinaikai/otogi_frontier_translate/refs/heads/main/MScenes/"+lastPartOfUrl+".json";
                        const translationData = loadTranslationJsonSync(translationJsonUrl);

                        if (translationData) {
                            originalJson = replaceUsingTranslation(originalJson, translationData);
                        } else {
                            console.warn("[拦截] 未加载到译文 JSON，跳过替换。");
                        }
                        const modifiedText = JSON.stringify(originalJson);
                        const modifiedArrayBuffer = textEncoder.encode(modifiedText).buffer;
                        Object.defineProperty(this, "response", { value: modifiedArrayBuffer });
                        console.log("[拦截] 替换后的 ArrayBuffer 响应已返回给页面。");

                    } catch (e) {
                        console.error("[拦截] ArrayBuffer 转换或 JSON 解析失败：", e);
                    }
                }
            }else if(this.readyState === 4 && this._interceptedUrl.includes("api/Episode/MStory")){
                const lastPartOfUrl = this._interceptedUrl.split("/").pop();
                if (this.responseType === "arraybuffer") {
                    const textDecoder = new TextDecoder();
                    const textEncoder = new TextEncoder();

                    try {
                        const originalText = textDecoder.decode(this.response);
                        let originalJson = JSON.parse(originalText);
                        const translationJsonUrl = "https://raw.githubusercontent.com/kureinaikai/otogi_frontier_translate/refs/heads/main/Mstory/"+lastPartOfUrl+".json";
                        const translationData = loadTranslationJsonSync(translationJsonUrl);

                        if (translationData) {
                            originalJson = replaceUsingTranslation(originalJson, translationData);
                        } else {
                            console.warn("[拦截] 未加载到译文 JSON，跳过替换。");
                        }
                        const modifiedText = JSON.stringify(originalJson);
                        const modifiedArrayBuffer = textEncoder.encode(modifiedText).buffer;
                        Object.defineProperty(this, "response", { value: modifiedArrayBuffer });
                        console.log("[拦截] 替换后的 ArrayBuffer 响应已返回给页面。");

                    } catch (e) {
                        console.error("[拦截] ArrayBuffer 转换或 JSON 解析失败：", e);
                    }
                }
            }
        });
        return send.apply(this, arguments);
    };

    function loadTranslationJsonSync(url) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
        try {
            xhr.send();
            if (xhr.status >= 200 && xhr.status < 300) {
                console.log("[拦截] 同步加载译文 JSON 成功：", url);
                return JSON.parse(xhr.responseText);
            } else {
                console.error(`[拦截] 同步加载译文 JSON 失败，HTTP 状态码：${xhr.status}`);
                return null;
            }
        } catch (error) {
            console.error("[拦截] 同步加载译文 JSON 过程中出错：", error);
            return null;
        }
    }

    function replaceUsingTranslation(data, translationDict) {
        if (typeof data === "string" && translationDict[data]) {
            return translationDict[data]; // 替换为译文 JSON 中的对应值
        } else if (Array.isArray(data)) {
            return data.map((item) => replaceUsingTranslation(item, translationDict));
        } else if (typeof data === "object" && data !== null) {
            const newData = {};
            for (const key in data) {
                newData[key] = replaceUsingTranslation(data[key], translationDict);
            }
            return newData;
        }
        return data;
    }
})();