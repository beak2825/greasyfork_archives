// ==UserScript==
// @name         PT批量送魔力
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  PT站点批量送魔力脚本
// @author       XGCM
// @match        https://hdsky.me/mybonus.php
// @match        https://pterclub.com/mybonus.php
// @match        https://u2.dmhy.org/ucoin.php
// @match        https://club.hares.top/mybonus.php
// @match        https://audiences.me/mybonus.php
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addElement
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/432315/PT%E6%89%B9%E9%87%8F%E9%80%81%E9%AD%94%E5%8A%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/432315/PT%E6%89%B9%E9%87%8F%E9%80%81%E9%AD%94%E5%8A%9B.meta.js
// ==/UserScript==

var config = {
    'https://hdsky.me': {
        username: '#outer input[name=username]',
        amount: '#giftcustom',
        message: '#outer input[name=message]',
        originalSendButton: '#outer input[value=赠送]',
        option: 10,
        interval: 0,
        step: 10000
    },
    'https://pterclub.com': {
        username: '#outer input[name=username]',
        amount: '#giftcustom',
        message: '#outer input[name=message]',
        originalSendButton: '#outer input[value=赠送]',
        option: 13,
        interval: 0,
        step: 10000
    },
    'https://audiences.me': {
        username: '#outer input[name=username]',
        amount: '#giftcustom',
        message: '#outer input[name=message]',
        originalSendButton: '#outer input[value=赠送]',
        option: 7,
        interval: 0,
        step: 10000
    },
    'https://club.hares.top': {
        username: '#outer input[name=username]',
        amount: '#giftcustom',
        message: '#outer input[name=message]',
        originalSendButton: '#outer input[value=赠送]',
        option: 7,
        interval: 0,
        step: 10000
    },
    'https://u2.dmhy.org': {
        url: 'https://u2.dmhy.org/mpshop.php',
        username: '#outer input[name=recv]',
        amount: '#outer input[name=amount]',
        message: '#outer input[name=message]',
        originalSendButton: '#outer input[value=赠送]',
        option: 13,
        interval: 305000,
        step: 50000,
    }
}

var ERROR = '';

function getTable() {
    var tableFunc = config[window.location.origin].table;
    if (tableFunc === undefined)
        return getNexusPHPTable();
    return tableFunc();
}

function getNexusPHPTable() {
    return document.getElementById('outer').getElementsByTagName('table')[0]
}

function bulkSend(username, amount, message) {
    var url = config[window.location.origin].url !== undefined ? config[window.location.origin].url : window.location.origin + '/mybonus.php?action=exchange';
    var option = config[window.location.origin].option;
    var interval = config[window.location.origin].interval;
    var step = config[window.location.origin].step;

    var ref = setInterval(function() {
        if (amount > step) {
            sendNexusPHP(url, username, step, message, option);
            amount -= step;
        } else {
            clearInterval(ref);
        }
    }, interval);
    if (amount > 0) sendNexusPHP(url, username, step, message, option);

}

function sendNexusPHP(url, username, amount, message, option) {
    console.log(url, username, amount, message, option);
    var data;
    if (window.location.origin === 'https://u2.dmhy.org') {
        data = 'recv=' + username + '&amount=' + amount + '&message=' + message + '&event=1003';
    } else {
        data = 'username=' + username + '&bonusgift=' + amount + '&message=' + message + '&option=' + option + '&submit=赠送';
    }
    GM.xmlHttpRequest({
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: data,
        onload: response => {
            console.log(response.response);
            if (response.response.indexOf('错误') == -1) {
                var success = GM_addElement(document.querySelector(config[window.location.origin].message).closest('td'), 'span', {});
                success.innerHTML = '你成功给' + username + '发送了' + amount + '魔力' + '<br>';
            } else {
                var responseHTML = document.createElement('html');
                responseHTML.innerHTML = response.response;
                ERROR = responseHTML.querySelector('td[id="outer"] > table > tbody > tr > td').textContent;
                var error = GM_addElement(document.querySelector(config[window.location.origin].message).closest('td'), 'span', {});
                error.innerHTML = ERROR + '<br>';
            }
        },
    })
}

(function() {
    'use strict';

    var buttonRow;
    if (config[window.location.origin].originalSendButton) {
        buttonRow = document.querySelector(config[window.location.origin].originalSendButton).closest('td')
    } else {
        buttonRow = document.querySelector(config[window.location.origin].buttonRow)
    }
    var bulkButton = GM_addElement(buttonRow, 'button', {
        id: 'send_bulk',
        name: '批量赠送'
    });
    bulkButton.innerHTML = '批量赠送';
    document.querySelector('button[name="批量赠送"]').onclick = function() {
        var username = document.querySelector(config[window.location.origin].username);
        var amount = document.querySelector(config[window.location.origin].amount);
        var message = document.querySelector(config[window.location.origin].message);
        if (isNaN(parseInt(amount.value, 10))) {
            alert('魔力值须为数字！');
            return
        } else if (username.value === '') {
            alert('用户名不能为空！');
            return
        } else {
            bulkSend(username.value, amount.value, message.value);
            username.value = '';
            amount.value = '';
            message.value = '';
        }
    }
})();
