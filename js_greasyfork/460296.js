// ==UserScript==
// @name         PT批量换上传
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  PT批量换上传脚本
// @author       beerats
// @match        https://*/mybonus.php
// @match        https://*/mybonus.php?do=upload
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdn.staticfile.org/jquery/1.7.1/jquery.min.js
// @grant        GM_addElement
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/460296/PT%E6%89%B9%E9%87%8F%E6%8D%A2%E4%B8%8A%E4%BC%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/460296/PT%E6%89%B9%E9%87%8F%E6%8D%A2%E4%B8%8A%E4%BC%A0.meta.js
// ==/UserScript==

var configs = {
    'https://hdfan.org': {
        amount: '#buyAmount',
        table: '#outer > table',
        origButton: 'input[type="submit"][name="submit"][value="交换"]',
        origTop: '#outer > table > tbody > tr:nth-child(3) > td:nth-child(4)',
        interval: 12000
    },
}

var default_config = {
    amount: '#buyAmount',
    table: '#outer > table',
    origButton: 'input[type="submit"][name="submit"][value="交换"]',
    origTop: '#outer > table > tbody > tr:nth-child(3) > td:nth-child(4)',
    interval: 12000
}

function bulkBuy(event) {
    var config;
    if (configs[window.location.origin]) {
        config = configs[window.location.origin];
    }
    else {
        config = default_config;
    }
    var $table;
    $table = $(config.table);
    var $button;
    $button = $table.find(config.origButton);
    var $amounts = $table.find('.amount');
    $amounts.each(function() {
        var times = $(this).attr('value');
        if(times) {
            var $tr = $(this).closest('tr');
            var option = $tr.find('input[name="option"]').attr('value');
            var id = $tr.find('.rowhead_center').text();
            doBulkBuy(config, id, option, times);
        }
    });
}

function doBulkBuy(config, id, option, times) {
    var url = window.location.origin + '/mybonus.php?action=exchange';
    if(times > 0) {
        var interval = config.interval;
        var count = 0;
        var ref = setInterval(function() {
            if (count < times) {
                buy(url, id, option);
                count++;
                console.log('第' + count + '/' + times + '次购买');
            } else {
                clearInterval(ref);
            }
        }, interval);
    }
}

    function buy(url, id, option) {
        console.log('购买项目: ' + id);
        var data = 'option=' + option + '&submit=交换';
        GM.xmlHttpRequest({
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: data,
            onload: response => {
                let content = $(response.response).text();
                let pattern = /魔力值 \[使用\]: ([0-9\.,]+)/;
                let bonus = content.match(pattern)[1];
                console.log('剩余魔力值：' + bonus);
            },
        })
    }

    (function() {
        'use strict';

        var config;
        if (configs[window.location.origin]) {
            config = configs[window.location.origin];
        }
        else {
            config = default_config;
        }
        var $table;
        $table = $(config.table);
        var $button;
        $button = $table.find(config.origButton);
        $button.after('<input class="amount" placeholder="填写交换数量">');
        var $top = $(config.origTop);
        $top.before('<td class="colhead" align="center"><input type="button" class="bulkBuy" value="批量交换"><p>填写交换数量，点击顶栏的批量交换</p><p><font color="red">不交换的项千万不要填写</font></p></td>');
        $top.remove();
        $('.bulkBuy').click(bulkBuy);
    })();