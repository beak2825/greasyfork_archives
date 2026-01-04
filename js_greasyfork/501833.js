// ==UserScript==
// @name         ModifProviderName
// @namespace    http://tampermonkey.net/
// @version      2024-07-30
// @description  三方海外仓渠道拼接code
// @author       PolarisHenry
// @match        *://*/*amzup-web-main/*
// @icon         none
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/501833/ModifProviderName.user.js
// @updateURL https://update.greasyfork.org/scripts/501833/ModifProviderName.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const URL = window.location.origin;
    let filteredAgents = [];
    const filteredAgentsTest = 'filteredAgentsTest';
    const filteredAgentsOnline = 'filteredAgentsOnline';

    if (URL.includes('meiyunji')) {
        const filteredAgentsTestValue = GM_getValue(filteredAgentsTest)
        if (filteredAgentsTestValue) {
            filteredAgents = [...new Set(filteredAgentsTestValue)]
        }
    }
    else if (URL.includes('sellfox')) {
        const filteredAgentsOnlineValue = GM_getValue(filteredAgentsOnline)

        if (filteredAgentsOnlineValue) {
            filteredAgents = [...new Set(filteredAgentsOnlineValue)]
        }

    }
    if (!filteredAgents.length) {
        await storageChannelNameCodeMappingRelationship()
        window.location.reload();
    }

    const originalXhrOpen = window.XMLHttpRequest.prototype.open;
    const originalXhrSend = window.XMLHttpRequest.prototype.send;

    window.XMLHttpRequest.prototype.open = function (method, url) {
        this._url = url; // 记录请求的URL
        return originalXhrOpen.apply(this, arguments);
    };
    window.XMLHttpRequest.prototype.send = function () {
        this.addEventListener('load', function () {
            const modifyResponse = (responseData, key, providerIdField, providerNameField) => {
                const data = key ? responseData[key] : responseData;
                data.forEach(item => {
                    const matchedAgent = filteredAgents.find(agent => agent.agentProviderId === item[providerIdField]);
                    if (matchedAgent) {
                        item[providerNameField] += `(${matchedAgent.agentProviderChannelCode})`;
                    }
                });
                return responseData;
            };

            if (!this.responseText) {
                console.error('Response text is empty');
                return;
            }

            try {
                let responseData = JSON.parse(this.responseText);

                if (this._url.endsWith('api/overseaComm/listAllOverseaChannel.json')) {
                    responseData = modifyResponse(responseData, 'data', 'agentProviderId', 'displayName');
                } else if (this._url.endsWith('api/packageShip/getPackagePage.json')) {
                    responseData.data = modifyResponse(responseData.data, 'rows', 'providerId', 'providerName');
                } else if (this._url.includes('api/overseaComm/listChannel.json')) {
                    responseData = modifyResponse(responseData, 'data', 'agentProviderId', 'displayName');
                } else if (this._url.includes('api/packageShip/packageDetail.json')) {
                    const detail = responseData.data.detail;
                    const matchedAgent = filteredAgents.find(agent => agent.agentProviderId === detail.providerId);
                    if (matchedAgent) {
                        detail.providerName += `(${matchedAgent.agentProviderChannelCode})`;
                    }
                }

                const modifiedResponse = JSON.stringify(responseData);
                Object.defineProperty(this, 'response', { value: modifiedResponse });
                Object.defineProperty(this, 'responseText', { value: modifiedResponse });
            } catch (error) {
                console.error('Error parsing or modifying response:', error);
            }
        });

        return originalXhrSend.apply(this, arguments);
    };
    await storageChannelNameCodeMappingRelationship();
    async function storageChannelNameCodeMappingRelationship() {
        let request;
        let response;

        request = await fetch(`${URL}/api/overseaComm/listOverseaAgent.json`, {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9",
                "cache-control": "no-cache",
                "pragma": "no-cache",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Google Chrome\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
            },
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        });

        response = await request.json();
        const agentAuthIds = response.data.enableList.map(item => item.agentAuthId);

        for (const authorId of agentAuthIds) {
            request = await fetch(`${URL}/api/overseaComm/listOverseaChannel.json?authorId=${authorId}`, {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "zh-CN,zh;q=0.9",
                    "cache-control": "no-cache",
                    "pragma": "no-cache",
                    "priority": "u=1, i",
                    "sec-ch-ua": "\"Google Chrome\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                },
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "include"
            });

            response = await request.json();
            // debugger;
            let enableList = response.data.enableList.map(item => {
                return { agentProviderId: item.agentProviderId, agentProviderChannelCode: item.agentProviderChannelCode }
            });
            let disableList = response.data.disableList.map(item => {
                return { agentProviderId: item.agentProviderId, agentProviderChannelCode: item.agentProviderChannelCode }
            });;

            filteredAgents = [...filteredAgents, ...enableList, ...disableList];
        }
        // debugger
        URL.includes('meiyunji') ? GM_setValue(filteredAgentsTest, filteredAgents) : GM_setValue(filteredAgentsOnline, filteredAgents)
    }
})();
