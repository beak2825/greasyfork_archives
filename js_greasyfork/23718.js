// ==UserScript==
// @name         91160批量已就诊工具
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://h.91160.com/sz/SZJZNKYY/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23718/91160%E6%89%B9%E9%87%8F%E5%B7%B2%E5%B0%B1%E8%AF%8A%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/23718/91160%E6%89%B9%E9%87%8F%E5%B7%B2%E5%B0%B1%E8%AF%8A%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
(function() {
    // 不在设置就诊页面则不执行
    if(/&a=check&/.test(location.search)){
        // 全局创建一个对象
        window.gh91168 = {};
        // 获取代码中的挂号ID
        window.gh91168.getUserIdList = function(htmlData) {
            // html代码去换行
            htmlData = htmlData.replace(/(\n)+|(\r\n)+/g, '');
            // 提取剩余挂号数量
            var lastNum = /<font color=\"#FF0000\">([0-9]+)<\/font>/.exec(htmlData)[1],
                // 匹配出所有结果
                inputArr = htmlData.match(/<input type="checkbox" name="sltGuhao\[([0-9]+)\]".*?<\/tr>/g),
                sltGuhao = {},
                inputVal = {},
                ttyj = '';
            // 输入到页面
            $('.load_mask_con')[0].innerText = "正在处理...剩余["+lastNum+"]";
            // 检查匹配到了多少
            if (inputArr.length <= 0) {
                alert('貌似没了...');
                return;
            }
            for (var i = 0; i < inputArr.length; i++) {
                inputVal = /<input type="checkbox" name="sltGuhao\[([0-9]+)\]"/.exec(inputArr[i]);
                // 获取预约途径
                ttyj = inputArr[i].match(/<td nowrap[^>]*>([^<\s]+)<\/td>/g)[8];
                // 提取预约途径值
                ttyj = /<td nowrap[^>]*>([^<\s]+)<\/td>/.exec(ttyj)[1];
                if (ttyj == '现场预约') {
                    sltGuhao[inputVal[1]] = inputVal[1];
                } else {
                    console.log(inputVal[1], ttyj);
                }
            }
            console.log(sltGuhao);
            // 调用 方法执行
            window.gh91168.sendGuaHaoCheck(sltGuhao);
        };
        // 提交批量就诊
        window.gh91168.sendGuaHaoCheck = function(sltGuhao) {
            jQuery.ajax({
                url: location.href,
                type: 'POST',
                dataType: 'html',
                data: {
                    date_type: 1,
                    begin_date: $('#start_date').value,
                    end_date: $('#end_date').value,
                    state: {
                        1: 'v1'
                    },
                    more_visits_type: 2,
                    sltGuhao: sltGuhao,
                    key: 'over'
                },
                success: function(data, textStatus, xhr) {
                    window.gh91168.getUserIdList(data);
                }
            });
        };
        // 获取页面需要追加按钮的元素
        var divList = $('.inline-block');
        // 追加一个按钮上去
        $(divList[divList.length - 1]).append("<input type=\"button\" class=\"btn\" id=\"batchGuaHaoCheck\" value=\"批量设置已就诊\">");
        // 给按钮绑定事件
        $('#batchGuaHaoCheck').click(function() {
            // 提交一次空的 获取需要处理的列表
            window.gh91168.sendGuaHaoCheck({});
        });
    }
})();
