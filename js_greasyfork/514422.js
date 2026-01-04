// ==UserScript==
// @name         Free ECUST Chatbot
// @namespace    https://ecust.edu.cn/
// @version      0.1.5
// @description  Free and unrestricted ECUST chatbot
// @author       Oborozuki
// @match        *://ai.s.ecust.edu.cn/chatbot/*
// @match        *://ai.s.ecust.edu.cn/academic-qa/*
// @run-at       document-start
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/514422/Free%20ECUST%20Chatbot.user.js
// @updateURL https://update.greasyfork.org/scripts/514422/Free%20ECUST%20Chatbot.meta.js
// ==/UserScript==

const modelTemperature = 0.5;
const useGPT4oMini = true;
const deleteSystemPrompt = true;

(function () {
    const originFetch = fetch;

    window.unsafeWindow.fetch = async (url, options) => {
        if (url.includes("/chatbot/api/tokenizer") || url.includes("/chatbot/api/paycenter/token/consume") || url.includes("/academic-qa/api/tokenizer") || url.includes("/academic-qa/api/paycenter/token/consume")) {
            return null;
        }

        if ((url.includes("/chatbot/api/chat/") || url.includes("/academic-qa/api/chat/ecust")) && options?.body) {
            const body = JSON.parse(options.body);
            body.chatSettings.temperature = modelTemperature;

            if (url.includes("/chatbot/api/chat/azure") && useGPT4oMini) {
                body.chatSettings.model = "gpt-4o-mini";
            }

            if (body.messages?.length) {
                const firstMessage = body.messages[0];
                if (deleteSystemPrompt && firstMessage.role === "system") {
                    body.messages.shift();
                }
            }
            options.body = JSON.stringify(body);
        }

        return originFetch(url, options).then(async (response) => {
            if (url.includes("/chatbot/api/text/check") || url.includes("/academic-qa/api/text/check")) {
                const res = await response.clone().json();
                res.data.forEach(d => { d.code = 1; });
                return new Response(JSON.stringify(res), response);
            }
            return response;
        });
    };
})();
