// ==UserScript==
// @name         title renamer
// @namespace    http://tampermonkey.net/
// @version      0.7.6
// @description  sadf asdf!
// @author       You
// @match        *://10.105.1.7/*
// @match        *://10.105.1.10/*
// @match        *://10.106.1.10/*
// @match        *://192.168.2.85/*
// @match        *://10.100.22.31/*
// @match        *://10.100.66.38/*
// @match        *://10.100.66.44/*
// @match        *://yecai.xjjtkj.cn/*
// @license none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438076/title%20renamer.user.js
// @updateURL https://update.greasyfork.org/scripts/438076/title%20renamer.meta.js
// ==/UserScript==

(function () {
// @include        /^https?:\/\/.*\.[f][i]ture\.com\/.*/
    'use strict';
    const standardRegexp = /\/\/(?<app>\w+)\.(?<env>\w+)/;
    const urlPrefixMappings = new Map(Object.entries({
        "http://192.168.2.85:8004/": ["nacos", "dev"],
        "http://192.168.2.85:15672/": ["RabbitMQ", "dev"],
        "http://192.168.2.85:9080/": ["XXL-JOB", "dev"],
        "http://192.168.2.85:8009/": ["业财", "dev"],

        "http://10.106.1.10:8081/": ["nacos", "test"],
        "http://10.106.1.10:8057/": ["RabbitMQ", "test"],
        "http://10.106.1.10:8085": ["XXL-JOB", "test"],
        "http://10.106.1.10:8082/": ["业财", "test"],

        "http://10.106.1.10:8058/": ["nacos", "UAT"],
        "http://10.106.1.10:8060/": ["业财", "UAT"],

        "http://10.105.1.7:8038/": ["nacos", "PROD"],
        "https://yecai.xjjtkj.cn:8034/": ["业财", "PROD"],
    }));

    let originalTitle = document.title;

    function changeTitle() {
        let [app, env] = extractByMapping();

        // let app = extractByRegexp([standardRegexp], 'app');
        // let env = extractByRegexp([standardRegexp], 'env');

        if (app || env) {
            if (/^\S+@\S+ /.test(document.title)) return;
            let title = `${app}@${env.toUpperCase()} ${document.title}`
            // console.log(title)
            document.title = title;
        }
    }

    changeTitle();
    setInterval(changeTitle, 1000);

    function extractByMapping() {
        for (const [prefix, values] of urlPrefixMappings) {
            if (document.URL.startsWith(prefix)) {
                return values;
            }
        }
    }

    function extractByRegexp(regExps, group) {
        for (const regExp of regExps) {
            if (regExp.test(document.URL)) {
                return regExp.exec(document.URL).groups[group];
            }
        }
        return ""
    }
})();