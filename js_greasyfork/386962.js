// ==UserScript==
// @name         TAPD链接可点击化
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  tapd 链接可点击
// @author       mingyuanyun
// @match        https://www.tapd.cn/*
// @grant        none
// @requir       https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/386962/TAPD%E9%93%BE%E6%8E%A5%E5%8F%AF%E7%82%B9%E5%87%BB%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/386962/TAPD%E9%93%BE%E6%8E%A5%E5%8F%AF%E7%82%B9%E5%87%BB%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const needArr = ['Jira链接','CodeReview链接', 'ykUpgrader链接'];
    var $ = window.jQuery;

    function init() {
        let arr = Array.from($(".left_3_col"));
        if (arr.length > 0) {
            // 处理链接
            arr.forEach(item => {
                // 创建 new-wrap 作为隔离区域
                let wrap = $(item).children(".new-wrap");
                if (wrap.length == 0) {
                    $(item).append(`<div class="new-wrap"></div>`);
                    wrap = $(item).children(".new-wrap")
                } else {
                    $(wrap[0]).empty();
                }

                let label = $(item).children(".tapd-view-title")[0].innerText;
                if (needArr.includes(label)) {
                    let value = $(item).find(".editable-value")[0].innerText;
                    let reg = /\s/g;
                    let valueArr = [];

                    if (reg.test(value)) {
                        valueArr = value.split(/\s/g);
                    } else {
                        valueArr = [value];
                    }

                    valueArr.forEach((child, index) => {
                        if (child !== '--') {
                            $(wrap[0]).append(`<a style="padding: 3px;display: inline-block;border: 1px solid #3582fb;border-radius: 5px;margin-bottom:5px;" href="${child}">Jump to ${label} ${index + 1}</a>`);
                        }
                    })

                };
                // 处理粘贴
                if (label === '分支名称') {
                    let value = $(item).find(".editable-value")[0].innerText;
                    $(wrap[0]).append(`<div style="padding: 3px;display: inline-block;cursor:pointer;border: 1px solid #3582fb;border-radius: 5px;color:#3582fb;font-size:12px;" id="copyBtn">Copy ${label}</div>
                    <a style="padding: 3px;display: inline-block;border: 1px solid #3582fb;border-radius: 5px;margin-left:5px;" href="http://pa.myscrm.cn/project/view?id=${value}">分支链接</a>`);
                    $('#copyBtn').click(() => {
                        copy(value);
                    });

                }
            })
        }
    }


    function copy(value) {
        const input = document.createElement('input');
        document.body.appendChild(input);
        input.setAttribute('value', value);
        input.select();
        if (document.execCommand('copy')) {
            document.execCommand('copy');
            console.log('复制成功');
        }
        document.body.removeChild(input);
    }

    // 监听右侧输入框失去焦点事件，重新执行init() 函数。
    $('#base_information').on('blur','input',function () {
        setTimeout(() => {
            init();
        },1000)
    })
    $('#base_information').on('blur','textarea',function () {
        setTimeout(() => {
            init();
        },1000)

    })


    init();

})();