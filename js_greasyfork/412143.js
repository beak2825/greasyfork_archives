// ==UserScript==
// @name         oi-archive-helper
// @namespace    oi-archive-helper
// @description  OI Archive Beta 辅助脚本
// @version      0.1.2
// @author       memset0
// @match        http://localhost*
// @match        http://uoj.ac/user/profile/*
// @match        https://uoj.ac/user/profile/*
// @match        https://loj.ac/user/*
// @match        https://oi-archive.memset0.cn
// @match        https://oi-archive.memset0.cn/*
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/412143/oi-archive-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/412143/oi-archive-helper.meta.js
// ==/UserScript==

function load() {
    let json = GM_getValue('oi-archive-helper-data');
    return json && json !== 'undefined' ? JSON.parse(json) : [];
}

function push(data) {
    GM_setValue('oi-archive-helper-data', JSON.stringify(data));
}

function pushList(oj, list) {
    let array = load();
    list.forEach(id => {
        let includes = false;
        for (let element of array) {
            if (element.oj == oj && element.id == id) {
                includes = true;
                break;
            }
        }
        if (!includes) {
            array.push({
                oj: oj,
                id: id
            });
        }
    });
    push(array);
}

function parseUOJ($) {
    return Array.from($(".list-group-item-text:last-child > a")
        .map((index, element) => {
            return element.innerHTML;
        }));
}

function parseLOJ($) {
    return Array.from($('.ui.bottom.attached.segment > a')
        .map((index, element) => {
            return element.innerHTML;
        }));
}

function buildButton(innerText, callback) {
    let element = document.createElement("button");
    element.innerHTML = innerText;
    element.onclick = function () {
        callback();
        alert('success!');
    };
    console.log(element);
    return element;
}

(function() {
    'use strict';

    let href = window.location.href;

    if (href.startsWith('https://uoj.ac/user/profile/') || href.startsWith('http://uoj.ac/user/profile/')) {
        $('.uoj-honor').append(buildButton('导入 UOJ 通过记录到 OIAH', () => pushList("uoj", parseUOJ($))));
    }

    if (href.startsWith('https://loj.ac/user/')) {
        $('.content > .header').append(buildButton('导入 LibreOJ 通过记录到 OIAH', () => pushList("loj", parseLOJ($))));
    }

    if (href.startsWith('http://localhost') || href.startsWith('https://oi-archive.memset0.cn')) {
        unsafeWindow.oiah = {
            load: load,
            push: push,
        };
    }

})();