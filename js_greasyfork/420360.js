// ==UserScript==
// @name               ALRabbitMQ
// @name:zh-CN         ALRabbitMQ
// @description        Automatically Login to Rabbit MQ. Only for SAP internal using.
// @description:zh-CN  自动登录到Rabbit MQ。仅供SAP内部使用。
// @namespace          https://github.com/HaleShaw
// @version            1.0.0
// @author             HaleShaw
// @copyright          2020+, HaleShaw (https://github.com/HaleShaw)
// @license            AGPL-3.0-or-later
// @homepage           https://github.com/HaleShaw/TM-ALRabbitMQ
// @supportURL         https://github.com/HaleShaw/TM-ALRabbitMQ/issues
// @contributionURL    https://www.jianwudao.com/
// @icon               https://www.rabbitmq.com/favicon.ico
// @include            https://selfbilling-rabbitmq-proxy-*.cfapps.eu10.hana.ondemand.com/*
// @connect            account.eu2.hana.ondemand.com
// @compatible         Chrome
// @grant              GM_xmlhttpRequest
// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM_info
// @downloadURL https://update.greasyfork.org/scripts/420360/ALRabbitMQ.user.js
// @updateURL https://update.greasyfork.org/scripts/420360/ALRabbitMQ.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author             HaleShaw
// @collaborator       HaleShaw
// ==/OpenUserJS==

(function () {
    ('use strict');

    const spaces = {
        dev:
            'https://account.eu2.hana.ondemand.com/ajax/fa880b8a-5fb8-4251-8f74-3ae35ca22595/cf-eu10/d8ec27d3-7fde-4084-a8bf-f427e43d2370/getCFApplicationEnv/ee31e128-0dd2-4746-8ab8-f5d530a0307d',
        test:
            'https://account.eu2.hana.ondemand.com/ajax/fa880b8a-5fb8-4251-8f74-3ae35ca22595/cf-eu10/d8ec27d3-7fde-4084-a8bf-f427e43d2370/getCFApplicationEnv/31226a8a-d587-4442-bfad-b0bd11a4934a',
        performance:
            'https://account.eu2.hana.ondemand.com/ajax/fa880b8a-5fb8-4251-8f74-3ae35ca22595/cf-eu10/d8ec27d3-7fde-4084-a8bf-f427e43d2370/getCFApplicationEnv/d3ed5d43-6fe2-4193-a92c-bcabd5da500b',
        cand:
            'https://account.eu2.hana.ondemand.com/ajax/fa880b8a-5fb8-4251-8f74-3ae35ca22595/cf-eu10/d8ec27d3-7fde-4084-a8bf-f427e43d2370/getCFApplicationEnv/894db400-859f-4e46-98cc-b53208ff5f90'
    };

    const apiSuffix = '/api/whoami';

    main();

    async function main() {
        logInfo(GM_info.script.name, GM_info.script.version);
        let nameInput = document.querySelector(
            '#login > form > table > tbody > tr:nth-child(1) > td > input[type=text]'
        );
        if (nameInput) {
            let spaceInfo = await getSpaceInfo();
            console.log(spaceInfo);
            let pwdInput = document.querySelector(
                '#login > form > table > tbody > tr:nth-child(2) > td > input[type=password]'
            );

            let submitBtn = document.querySelector(
                '#login > form > table > tbody > tr:nth-child(3) > td > input[type=submit]'
            );
            nameInput.value = spaceInfo.username;
            pwdInput.value = spaceInfo.password;
            submitBtn.click();
        }
    }

    function getSpace() {
        const domain = document.domain;
        let space = '';
        for (let name in spaces) {
            if (domain.indexOf(name) != -1) {
                space = name;
                break;
            }
        }
        return space;
    }

    async function getSpaceInfo() {
        const space = getSpace();
        let spaceInfo = GM_getValue(space);
        let valide = await validateAccount(spaceInfo);
        if (!valide) {
            let url = spaces[space];
            let sessionId = prompt('Please input the session id:');
            let account = await getAccount(url, sessionId);
            spaceInfo = {};
            spaceInfo.username = account.username;
            spaceInfo.password = account.password;
            GM_setValue(space, spaceInfo);
        }
        return spaceInfo;
    }

    async function getAccount(url, sessionId) {
        let headers = {
            'Content-Type': 'application/json',
            'X-ClientSession-Id': sessionId
        };
        let resp = await doGet(url, headers);
        console.debug('Env: ' + resp);
        const credentials = JSON.parse(resp).system_env_json.VCAP_SERVICES.rabbitmq[0].credentials;
        let data = {
            username: credentials.username,
            password: credentials.password
        };
        console.debug(data);
        return data;
    }

    function getHeaders(username, password) {
        return { Authorization: 'Basic ' + btoa(username + ':' + password) };
    }

    async function validateAccount(spaceInfo) {
        if (!spaceInfo || !spaceInfo.username || !spaceInfo.password) {
            return false;
        }
        let username = spaceInfo.username;
        let password = spaceInfo.password;
        let url = window.location.origin + apiSuffix;
        let headers = getHeaders(username, password);
        return doValidate(url, headers);
    }

    /**
     * call the API and return the response.
     * @param {String} url url.
     * @param {Object} headers headers.
     */
    function doGet(url, headers) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'get',
                url: url,
                headers: headers,
                onload: function (res) {
                    if (res.status === 200) {
                        resolve(res.response);
                    } else {
                        console.warn('Get ' + url + ' Failed! Status: ' + res.status);
                        console.debug(res);
                    }
                },
                onerror: function (err) {
                    console.error('Get ' + url + ' Failed! Status: ' + err.status);
                    console.debug(err);
                }
            });
        });
    }

    function doValidate(url, headers) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'get',
                url: url,
                headers: headers,
                onload: function (res) {
                    let status = res.status;
                    validateStatus(status);
                    resolve(status === 200);
                },
                onerror: function (err) {
                    let status = err.status;
                    validateStatus(status);
                    resolve(false);
                }
            });
        });
    }

    function validateStatus(status) {
        if ('401' == status) {
            console.warn('Username and password invalid!');
        } else if ('200' != status) {
            console.error('Other error! Status: ' + status);
        }
    }

    /**
     * Log the title and version at the front of the console.
     * @param {String} title title.
     * @param {String} version script version.
     */
    function logInfo(title, version) {
        console.clear();
        const titleStyle = 'color:white;background-color:#606060';
        const versionStyle = 'color:white;background-color:#1475b2';
        const logTitle = ' ' + title + ' ';
        const logVersion = ' ' + version + ' ';
        console.log('%c' + logTitle + '%c' + logVersion, titleStyle, versionStyle);
    }
})();
