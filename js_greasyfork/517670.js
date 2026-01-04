// ==UserScript==
// @name         BetterGrok
// @license MIT
// @namespace    http://greasyfork.org/
// @version      1.0.0
// @description  Use BetterGPT as Grok frontend
// @author       ten4dinosaur
// @match        https://bettergpt.chat/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bettergpt.chat
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/517670/BetterGrok.user.js
// @updateURL https://update.greasyfork.org/scripts/517670/BetterGrok.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const storageGet = localStorage.getItem;
    localStorage.getItem = function (name) {
        if (name !== "free-chat-gpt") return storageGet.call(this, name);
        const result = storageGet.call(this, "grok-xAI");
        return result !== null ? result : `{"state":{"currentChatIndex":-1,"apiEndpoint":"https://api.x.ai/v1/chat/completions","theme":"dark","autoTitle":false,"advancedMode":true,"prompts":[{"id":"0d3e9cb7-b585-43fa-acc3-840c189f6b93","name":"English Translator","prompt":"I want you to act as an English translator, spelling corrector and improver. I will speak to you in any language and you will detect the language, translate it and answer in the corrected and improved version of my text, in English. I want you to replace my simplified A0-level words and sentences with more beautiful and elegant, upper level English words and sentences. Keep the meaning same, but make them more literary. I want you to only reply the correction, the improvements and nothing else, do not write explanations. Do you understand?"}],"defaultChatConfig":{"model":"grok-beta","max_tokens":131072,"temperature":1,"presence_penalty":0,"top_p":1,"frequency_penalty":0},"defaultSystemMessage":"You are Grok, a large language model trained by xAI.\\nCarefully heed the user's instructions. \\nRespond using Markdown.","hideMenuOptions":false,"firstVisit":true,"hideSideMenu":false,"folders":{},"enterToSubmit":true,"inlineLatex":false,"markdownMode":true,"totalTokenUsed":{},"countTotalTokens":false},"version":8}`;
    }

    const storageSet = localStorage.setItem;
    localStorage.setItem = function (name, value) {
        if (name === "free-chat-gpt") {
            if (value.indexOf("grok-beta") === -1) {
                alert("Script injected too late."); // https://github.com/Tampermonkey/tampermonkey/issues/211
                window.location.reload();
                return;
            }
            name = "grok-xAI"
        }
        return storageSet.call(this, name, value);
    }

    const arrayMap = Array.prototype.map;
    Array.prototype.map = function (...args) {
        if (this?.length > 1 && this[0] === "gpt-3.5-turbo") {
            this.length = 0;
            this.push("grok-beta");
        }
        return arrayMap.apply(this, args);
    }

    Object.defineProperty(Object.prototype, "grok-beta", {
        get: function () {
            if (this === undefined || this === null) return undefined;
            const gpt = this["gpt-3.5-turbo"];
            if (gpt === 4096) return 131072;
            if (gpt?.completion?.unit === 1e3) {
                return {
                    prompt: {
                        price: .005,
                        unit: 1e3
                    },
                    completion: {
                        price: .015,
                        unit: 1e3
                    }
                };
            }
            return undefined;
        },
        set: function (value) {
            Object.defineProperty(this, 'grok-beta', {
                value: value,
                writable: true,
                enumerable: true,
                configurable:true
            });
        },
        enumerable: false,
        configurable: true
    });
})();