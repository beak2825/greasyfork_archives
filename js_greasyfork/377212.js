// ==UserScript==
// @name         TAPD link clickable
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  tapd 链接可点击
// @author       liuzp01
// @match        https://www.tapd.cn/*
// @grant        none
// @requir       https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/377212/TAPD%20link%20clickable.user.js
// @updateURL https://update.greasyfork.org/scripts/377212/TAPD%20link%20clickable.meta.js
// ==/UserScript==

/*jshint esversion: 6 */
(function() {
    'use strict';

    // Your code here...
    const needArr = ['分支链接','Jira链接','CodeReview链接', 'ykUpgrader链接'];
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
                    $(wrap[0]).append(`<div style="padding: 3px;display: inline-block;cursor:pointer;border: 1px solid #3582fb;border-radius: 5px;color:#3582fb;font-size:12px;" id="copyBtn">Copy ${label}</div>`);
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


    init();

})();
