// ==UserScript==
// @name         Zentao-Fs
// @namespace    https://www.flashmoney.com/
// @version      1.1
// @description  禅道与飞书的bug通信
// @grant        GM_addStyle
// @run-at       document-end
// @author       ll
// @match        https://project.flashexpress.pub/zentao/bug-*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.4.1/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438796/Zentao-Fs.user.js
// @updateURL https://update.greasyfork.org/scripts/438796/Zentao-Fs.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const whiteName = ['L:刘丽 前端', 'W:王文君']
    const href = window.location.href
    console.log(href)
    $('body')
    .delegate('#submit', 'click', function(event) {
        const href = window.location.href

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
            if(!whiteName.includes(_name)) return

            const query = {
                msg_type: "post",
                content: {
                    "post": {
                        "zh_cn": {
                            "title": "有人给你提bug",
                            "content": [
                                [{
                                    "tag": "text",
                                    "text": 'bug名：'
                                },
                                 {
                                     "tag": "text",
                                     "text": _title
                                 }],
                                 [{
                                     "tag": "text",
                                     "text": '归属人：'
                                 },
                                  {
                                      "tag": "text",
                                      "text": _name
                                  }]
                            ]
                        }
                    }
                }
            }
             $.ajax({
                url:"https://open.feishu.cn/open-apis/bot/v2/hook/02eadbf7-31de-4f4d-bc7e-613ec986ba60",
                type: "post",
                headers:{'Content-Type':'application/json'},
                dataType: 'json',
                data: JSON.stringify(query),
                success:function(result){
                    console.log('send success')
                }
            });

        }
})();