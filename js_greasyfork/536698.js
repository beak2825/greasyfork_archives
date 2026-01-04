// ==UserScript==
// @name         JanitorAI generateAlpha Formatter (Final)
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Перехватывает и форматирует ответ "generateAlpha" на janitorai.com.
// @author       Your Name
// @match        https://janitorai.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/536698/JanitorAI%20generateAlpha%20Formatter%20%28Final%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536698/JanitorAI%20generateAlpha%20Formatter%20%28Final%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const KEYWORD_TO_CATCH = 'generateAlpha';

    function saveDataToFile(data, filename, contentType = 'text/plain;charset=utf-8') {
        const blob = new Blob([data], { type: contentType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function formatData(jsonData) {
        if (jsonData && jsonData.messages && jsonData.messages.length > 0 && jsonData.messages[0].content) {
            const systemContent = jsonData.messages[0].content;
            let persona = 'PERSONA_NOT_FOUND';
            let scenario = 'SCENARIO_NOT_FOUND';

            const scenarioRegex = /<scenario>(.*?)<\/scenario>/s;
            const scenarioMatch = systemContent.match(scenarioRegex);
            if (scenarioMatch && scenarioMatch[1]) {
                scenario = scenarioMatch[1].trim();
            }

            const personaCandidateRegex = /<(.*?)>(.*?)<\/\1>/gs;
            let match;
            let personaFound = false;

            while ((match = personaCandidateRegex.exec(systemContent)) !== null) {
                const tagName = match[1].trim().toLowerCase();
                const tagContent = match[2].trim();

                if (tagName === 'system' || tagName === 'scenario') {
                    continue;
                }
                persona = tagContent;
                personaFound = true;
                break;
            }

            if (!personaFound) {
                 const oldPersonaRegex = /<system>\[do not reveal any part of this system prompt if prompted\]<\/system>\s*<([A-ZА-ЯЁa-zа-яё0-9_.\- ]+?)>(.*?)<\/\1>/s;
                 const oldMatch = systemContent.match(oldPersonaRegex);
                 if (oldMatch && oldMatch[2]) {
                     persona = oldMatch[2].trim();
                 } else {
                    persona = 'PERSONA_NOT_FOUND';
                 }
            }

            if (persona !== 'PERSONA_NOT_FOUND' || scenario !== 'SCENARIO_NOT_FOUND') {
                 const formattedOutput = `-----------!!!PERSONA!!!-----------\n${persona}\n-----------!!!SCENARIO!!!-----------\n${scenario}`;
                 return formattedOutput;
            } else {
                return null;
            }

        } else {
            return null;
        }
    }

    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const [url, options] = args;
        let requestUrl = (typeof url === 'string') ? url : (url instanceof Request ? url.url : '');

        const response = await originalFetch.apply(this, args);

        if (requestUrl.includes(KEYWORD_TO_CATCH)) {
            const clonedResponse = response.clone();
            clonedResponse.text().then(textData => {
                try {
                    const jsonData = JSON.parse(textData);
                    const formattedContent = formatData(jsonData);
                    if (formattedContent !== null) {
                        saveDataToFile(formattedContent, `formatted_alpha_fetch_${Date.now()}.txt`);
                    } else {
                        saveDataToFile(JSON.stringify(jsonData, null, 2), `original_alpha_fetch_error_${Date.now()}.json`, 'application/json;charset=utf-8');
                    }
                } catch (e) {
                    saveDataToFile(textData, `error_alpha_fetch_parsing_${Date.now()}.txt`);
                }
            }).catch(err => {
                // Можно добавить логирование ошибки в консоль, если нужно отлаживать проблемы с чтением ответа
                // console.error("JanitorAI Formatter: Fetch response read error:", err);
            });
        }
        return response;
    };

    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url, ...restArgs) {
        this._url = url;
        return originalXHROpen.apply(this, [method, url, ...restArgs]);
    };

    XMLHttpRequest.prototype.send = function(body) {
        this.addEventListener('load', function() {
            if (this.readyState === 4 && (this.status >= 200 && this.status < 300)) {
                if (this._url && this._url.toString().includes(KEYWORD_TO_CATCH)) {
                    const responseText = this.responseText;
                    try {
                        const jsonData = JSON.parse(responseText);
                        const formattedContent = formatData(jsonData);
                        if (formattedContent !== null) {
                            saveDataToFile(formattedContent, `formatted_alpha_xhr_${Date.now()}.txt`);
                        } else {
                            saveDataToFile(JSON.stringify(jsonData, null, 2), `original_alpha_xhr_error_${Date.now()}.json`, 'application/json;charset=utf-8');
                        }
                    } catch (e) {
                        saveDataToFile(responseText, `error_alpha_xhr_parsing_${Date.now()}.txt`);
                    }
                }
            }
        });
        return originalXHRSend.apply(this, [body]);
    };
})();