// ==UserScript==
// @name         flash-Zentao
// @namespace    https://www.flashmoney.com/
// @version      2.1.1
// @description  禅道与飞书的bug通信
// @grant        GM_addStyle
// @run-at       document-end
// @author       ll
// @match        https://project.flashexpress.pub/bug-*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.4.1/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439095/flash-Zentao.user.js
// @updateURL https://update.greasyfork.org/scripts/439095/flash-Zentao.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('body')
    .delegate('#submit', 'click', function(event) {
        const href = window.top.location.href

        if(href.indexOf('bug-create') > -1) {
            // 影响版本
            const _require = $('#openedBuild_chosen .search-choice >span').text()
            // 标题
            const _bugTitle = $('.input-control #title').val()
            // 指派给
            const bugUserName = $("#assignedTo_chosen >.chosen-single-with-deselect >span").text()

            if (_require && _bugTitle) {
                sendMessageFeiShu(_bugTitle, bugUserName)
            }
        } else {
            const _bugUserName = $(".picker-selections .picker-selection-text").text()
            const _bugTitle = $('.input-control #title').val() || $('.main-header >h2').children().eq(1).text()

            // 状态置为解决不发送
            const _resolution = $('#resolution_chosen')
            if (_resolution.length) return

            sendMessageFeiShu(_bugTitle, _bugUserName)
        }

        });

    // send飞书
    function sendMessageFeiShu(_title, _name){
        const _emailElement = $(`#assignedTo option:contains(${_name})`)
        const email = _emailElement && _emailElement.val()

        // 白名单：不发送的email
        const whiteEmail = ['yanxuesong']
        if(whiteEmail.includes(email)) return

        // 发送人
        const _sendName = window.top.$("#header #userNav .user-name").text()
        // bug地址
        const href = window.top.location.href

        const query = {
            email: `${email}@flashexpress.com`,
            msg_type: "interactive",
            card: {
                "config": {
                    "update_multi": true,
                    "wide_screen_mode": true
                },
                "header": {
                    "title": {
                        "tag": "plain_text",
                        "content": '🥺【bug】' + _name,
                    },
                    "template": "red"
                },
                "elements": [
                    {
                        "tag": "div",
                        "text": {
                            "tag": "lark_md",
                            "content": `**bug：**[${_title}](${href})`
                        }
                    },
                    {
                        "tag": "div",
                        "text": {
                            "tag": "lark_md",
                            "content": `**发送人：**${_sendName}`
                        }
                    },
                    {
                        "tag": "div",
                        "text": {
                            "tag": "lark_md",
                            "content": `**发送时间：**${formatTimestamp(new Date(), "yyyy-MM-dd hh:mm:ss")}`
                        }
                    },
                    {
                        "tag": "action",
                        "actions": [
                            {
                                "tag": "button",
                                "text": {
                                    "tag":"plain_text",
                                    "content":'禅道bug地址' //指定按钮文本
                                },
                                "url": href,
                                "type": "danger"
                            }
                        ]
                    }
                ]
            }
        }

        let apiUrl = 'https://feishu-api.flashfin.com/send-message'

        // 针对没有邮箱的，url不一样
        // const whiteName = ['W:王雪晴', 'D:段飞扬']
        // if(whiteName.includes(_name)) {
        // apiUrl = 'https://open.feishu.cn/open-apis/bot/v2/hook/2cb384af-73a4-4590-9bf9-31acaf7ddc12'
        // }

        $.ajax({
            url: apiUrl,
            type: "post",
            headers:{'Content-Type':'application/json'},
            dataType: 'json',
            data: JSON.stringify(query),
            success:function(result){
                console.log('send success')
            }
        });
    }

    // 格式化时间
    function formatTimestamp (date, fmt) {
        if (!date) return date
        if (typeof date === 'string') {
            // 解决IOS上无法从dateStr parse 到Date类型问题
            date = date.replace(/-/g, '/')
            date = new Date(date)
        }
        const o = {
            'M+': date.getMonth() + 1, // 月份
            'd+': date.getDate(), // 日
            'h+': date.getHours(), // 小时
            'm+': date.getMinutes(), // 分
            's+': date.getSeconds(), // 秒
            'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
            S: date.getMilliseconds() // 毫秒
        }
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        for (const k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
            }
        }
        return fmt
    }
})();