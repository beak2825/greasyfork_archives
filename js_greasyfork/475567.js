// ==UserScript==
// @name         Q-GPT复制研判结果
// @namespace    undefined
// @version      0.0.7
// @description  Q-GPT复制研判结果，临时使用
// @author       江南小虫虫
// @match        */hwop/threat-analysis/alarm/list*
// @match        */threat-analysis/alarm/*
// @require      http://code.jquery.com/jquery-2.2.1.min.js
// @grant    GM_addStyle
// @grant    GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475567/Q-GPT%E5%A4%8D%E5%88%B6%E7%A0%94%E5%88%A4%E7%BB%93%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/475567/Q-GPT%E5%A4%8D%E5%88%B6%E7%A0%94%E5%88%A4%E7%BB%93%E6%9E%9C.meta.js
// ==/UserScript==
;(function () {
    'use strict'

    // Your code here...
    // 设置定时器,定时增加复制按钮
    window.setInterval(function () {
        add_copy_btn()
    }, 1000)

    window.setInterval(function () {
        add_judge_copy_btn()
    }, 1000)

    function replaceLine(value){
        return value.replace(/[\t\n\r]/g, '');
    }

    function add_judge_copy_btn(){
        if (!document.querySelector('.my-judge-copy')) {
            var header = document.querySelector(
                '.ai-judgment-header-suggest span'
            )
            if(header){
                var attributes = header.attributes;

                for (var i = 0; i < attributes.length; i++) {
                    var attributeName = attributes[i].name;
                    if (attributeName.startsWith('data-v-')) {
                        console.log(attributeName);
                        break;
                    }
                }

                //var div = document.createElement('div')
                var copy_btn = document.createElement('button')
                copy_btn.type = 'button'
                copy_btn.onclick = function () {
                    //this.preventDefault();
                    console.log('点击了复制')
                    do_judge_copy(this)
                }
                copy_btn.className = 'q-button q-button--default q-button--small my-judge-copy';
                copy_btn.setAttribute(attributeName, '');

                var span = document.createElement('span')
                span.textContent = '复制AI研判'
                copy_btn.appendChild(span)
                header.append(copy_btn)
            }
        }
    }



    // 添加复制按钮
    function add_copy_btn () {
        if (!document.querySelector('.my-mul-copy')) {
            var header = document.querySelector(
                '.btn-toolbar'
            )
            if(header){
                //var div = document.createElement('div')
                var copy_btn = document.createElement('button')
                copy_btn.type = 'button'
                copy_btn.onclick = function () {
                    //this.preventDefault();
                    console.log('点击了复制')
                    do_copy(this)
                }
                copy_btn.className = 'q-button q-button--primary q-button--small my-mul-copy'
                var span = document.createElement('span')
                span.textContent = '复制告警+AI研判'
                copy_btn.appendChild(span)
                header.append(copy_btn)
            }
        }
    }

    function do_judge_copy(item){
        console.log('点击了复制')
        if(item){
            let result = {}
            let judge_result = document.querySelector('.ai-judgment-result-status')
            if(judge_result){
                result.judge_result =judge_result.textContent;
            }
            let judge_content = document.querySelectorAll('.item-content .markdown-body');
            if(judge_content){
                // AI研判
                result.judge_content = judge_content[0].textContent;
                // 处置建议
                //result.judge_advice = judge_content[1].textContent;
                console.log('找到结果，退出');

                //console.log(result)

                var excelStr = '';
                var keys = Object.keys(result);

                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    var value = result[key];

                    if (key === 'judge_content') {
                        // 去除制表符和换行符
                        value = replaceLine(value);
                    }

                    excelStr += value;

                    if (i < keys.length - 1) {
                        excelStr += '\t';
                    }
                }

                console.log(excelStr);
                // 设置剪切板内容
                //GM_setClipboard(JSON.stringify(result))
                GM_setClipboard(excelStr);
                Toast('已复制！', 1000);

            }
        }
    }
    function do_copy (item) {
        console.log('点击了复制')
        if (item) {
            console.log('有值')
            let result = {}
            let nodeList = document.querySelectorAll('#copy_id > span')
            result.alert_type = nodeList[3].textContent;
            result.alert_id = nodeList[0].textContent;
            result.rule_name = nodeList[4].textContent;
            result.attack_result = document.querySelector("#pane-base > div > div > div.base-main > table > tr:nth-child(7) > td:nth-child(2) > span > span").textContent.trim();
            let judge_result = document.querySelector('.judge-result').textContent;
            if(judge_result.indexOf('有效')!=-1){
                result.judge_result = '有效告警';
            }else if(judge_result.indexOf('无效')!=-1){
                result.judge_result = '无效告警';
            }else{
                result.judge_result = '空';
            }

            //点击 智能研判
            document.querySelector('#tab-ai-judgment').click();
            let count = 0;
            let intervalId = window.setInterval(function () {
                if (count > 5) {
                    console.log('超时退出');
                    Toast('超时退出！', 1000);
                    clearInterval(intervalId); // 清除定时器
                }
                let judge_content = document.querySelectorAll('.item-content .markdown-body');
                if(judge_content){
                    // AI研判
                    let url = document.querySelector('.detail-raw.detail-raw-url');
                    if(url){result.url = url.textContent;}

                    let labels = document.querySelectorAll('.ai-judgment-payload .payload-item label');
                    for(let i = 0;i< labels.length;i++)
                    {
                        if(labels[i].textContent.indexOf('请求体：')!=-1){
                            console.log('找到请求体');
                            result.req_body = document.querySelectorAll('.ai-judgment-payload .payload-item div')[i].textContent;
                            if (result.req_body.length > 1024) {
                                result.req_body = result.req_body.substring(0, 1024);
                            }
                            break;
                        }
                    }
                    result.url = "url" in result ? result.url : "-";
                    result.req_body = "req_body" in result ? result.req_body : "-";

                    //console.log('请求体');
                    //console.log(result.req_body);
                    result.judge_content = judge_content[0].textContent;


                    // 处置建议
                    //result.judge_advice = judge_content[1].textContent;
                    console.log('找到结果，退出');

                    //console.log(result)

                    var excelStr = '';
                    var keys = Object.keys(result);

                    for (var i = 0; i < keys.length; i++) {
                        var key = keys[i];
                        var value = result[key];

                        if (key === 'judge_content' || key === 'req_body') {
                            // 去除制表符和换行符
                            value = replaceLine(value);

                        }

                        excelStr += value;

                        if (i < keys.length - 1) {
                            excelStr += '\t';
                        }
                    }
                    console.log('请求体:');
                    console.log(result.req_body);
                    console.log('研判:');
                    console.log(judge_content);
                    console.log('最后结果：');
                    console.log(excelStr);
                    // 设置剪切板内容
                    //GM_setClipboard(JSON.stringify(result))
                    GM_setClipboard(excelStr);
                    Toast('已复制！', 1000);
                    clearInterval(intervalId); // 清除定时器
                }
                count = count + 1;
            }, 1000);

        } else {
            console.log('没有值')
        }
    }

    function Toast (msg, duration) {
        duration = isNaN(duration) ? 3000 : duration
        var m = document.createElement('div')
        m.innerHTML = msg
        m.style.cssText =
            'max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;'
        document.body.appendChild(m)
        setTimeout(function () {
            var d = 0.5
            m.style.webkitTransition =
                '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in'
            m.style.opacity = '0'
            setTimeout(function () {
                document.body.removeChild(m)
            }, d * 1000)
        }, duration)
    }
})()
