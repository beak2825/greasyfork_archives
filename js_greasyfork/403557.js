// ==UserScript==
// @name         cloud_log
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  try to take over the world!
// @author       lejunjie
// @match        https://cloud.bytedance.net/*
// @match        https://ms-argos.byted.org/streamlog/info_overview/*
// @downloadURL https://update.greasyfork.org/scripts/403557/cloud_log.user.js
// @updateURL https://update.greasyfork.org/scripts/403557/cloud_log.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getQuery(key) {
        const queries = location.search.slice(1).split('&').reduce((prev, cur) => {
            prev[cur.split('=')[0]] = cur.split('=')[1];
            return prev;
        }, {});
        return key ? queries[key] : queries;
    }

    function splitToArray(str, split = ' | ') {
        return str.split(split);
    }

    function splitKeyValue(str) {
        // 如果是用 = 连接
        const data = str.match(/\s*=\s*/);
        if (data) {
            const key = str.slice(0, data.index);
            let value = str.slice(data[0].length + (data.index || 0));
            try {
                if (key.toLowerCase() !== 'logid') {
                    var a = value.replace(/=\\"/g, '=').replace(/\\\";/g, ';').replace(/""""/g, '""').replace(/\\\\/, '');
                    value = JSON.parse(a);
                }
            } catch (e) {
            }
            return {
                [key]: value
            };
        }
        return {};
    }

    function formatLog(text) {
        text = text.replace(/\s\|\s\|\s/g, ' | ');
        const firstArr = splitToArray(text);
        const basicInfo = firstArr[0] || '';
        const logInfo = firstArr.slice(1);

        let keyValueMap = {};

        // 基础信息
        let basicInfoArr = splitToArray(basicInfo, ' ');
        const titleStr = basicInfoArr[basicInfoArr.length - 1];
        basicInfoArr = basicInfoArr.slice(0, -1);
        keyValueMap.title = splitKeyValue(titleStr).title;

        // log信息
        Object.assign(keyValueMap, logInfo.map(val => splitKeyValue(val)).reduce((prev, cur) => Object.assign({}, prev, cur), {}))

        const restBaiscInfoArr = basicInfoArr.filter(str => str.indexOf('=') < 0);
        const {status, method} = basicInfoArr.filter(str => str.indexOf('=') >= 0).map(val => splitKeyValue(val)).reduce((prev, cur) => Object.assign({}, prev, cur), {});
        const logid = restBaiscInfoArr.find(str => /^(?!\d+$)(?![A-Za-z]+$)[a-zA-Z0-9]+$/.test(str));
        const logidHref = `<a target="_blank" href="/streamlog/info_overview/trace_search?logId=${logid}&region=${getQuery('region') || 'cn'}&psm=${getQuery('psm')}">${logid}</a>`;
        keyValueMap = {
            logid: 'logidHref',
            level: restBaiscInfoArr[0],
            time: restBaiscInfoArr[1] + ' ' + restBaiscInfoArr[2],
            status,
            method,
            ...keyValueMap
        };

        return JSON.stringify(keyValueMap, null, 4).replace('\"logidHref\"', logidHref);
    }

    function replaceContent() {
        [].slice.call(document.querySelectorAll('[class^=LogList_log-content]')).forEach(node => {
            const replaced = node.getAttribute('replaced');
            if (!(replaced && replaced === '1')) {
                node.innerHTML = formatLog(node.innerText).replace(/\n/g, '<br>').replace(/\s/g, '&nbsp;');
                node.setAttribute('replaced', '1');
            }
        })
    }

    window.addEventListener('load', function() {
        let timer = setInterval(function () {
            if (location.pathname.includes('/log/search') || location.pathname.includes('/keyword_search')) {
                const formList = document.querySelector('[class^=LogList_log-list]');
                if (formList) {
                    replaceContent();
                }
            }
        }, 200);
    }, false);
})();