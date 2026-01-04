// ==UserScript==
// @name         niche_message
// @namespace    http://maxfew.com/
// @version      3.0
// @description  利基营销系统留言脚本
// @author       olaf
// @include       *
// @exclude      *larnt*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454555/niche_message.user.js
// @updateURL https://update.greasyfork.org/scripts/454555/niche_message.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var button = document.createElement("div"); //创建一个按钮
    button.textContent = "一键留言";
    button.style.width = "90px";
    button.style.height = "42px";
    button.style.lineHeight = "42px";
    button.style.align = "center";
    button.style.color = "white";
    button.style.background = "#e33e33";
    button.style.border = "1px solid #e33e33";
    button.style.borderRadius = "20px";
    button.style.position = "fixed";
    button.style.top = "50%";
    button.style.right = "10px";
    button.style.textAlign = "center";
    button.style.zIndex = "9999";
    button.style.cursor = "pointer";
    button.addEventListener("click", clickBotton) //监听按钮点击事件
    document.body.appendChild(button);


    async function clickBotton() {


        // 获取数据
        let name = getQueryVariable('name')
        let email = getQueryVariable('email')
        let phone = getQueryVariable('phone')
        let subject = getQueryVariable('subject')
        let content = getQueryVariable('content')



        // 设置表单内的值
        let hasSetForm = (function (name, email, phone, subject, content) {

            // 设置留言body
            let textareas = document.getElementsByTagName('textarea')
            if (textareas.length == 0) {
                console.log('留言失败，没有找到留言框')
                return false;
            }
            for (let i = 0; i < textareas.length; i++) {
                let dom_id = (textareas[i].getAttribute('id') + '').toLowerCase();
                let dom_name = (textareas[i].getAttribute('name') + '').toLowerCase();

                if (dom_id.includes('message') || dom_name.includes('message')
                    || dom_id.includes('body') || dom_name.includes('body')
                    || dom_id.includes('question') || dom_name.includes('question')) {

                    !async function simulatedUser() {
                        textareas[i].focus()
                        await sleep(5000)
                        textareas[i].value = content
                        textareas[i].blur()
                    }()

                }
            }


            // 获取所有的input框并设置值
            let inputs = document.getElementsByTagName('input')
            if (inputs.length > 0) {
                for (let i = 0; i < inputs.length; i++) {
                    let dom_id = (inputs[i].getAttribute('id') + '').toLowerCase();
                    let dom_name = (inputs[i].getAttribute('name') + '').toLowerCase();
                    let dom_title = (inputs[i].getAttribute('data-title') + '').toLowerCase();

                    // 邮箱
                    if (dom_id.includes('email') || dom_name.includes('email') || dom_title.includes('email')) {

                        !async function simulatedUser() {
                            inputs[i].focus()
                            await sleep(1000)
                            inputs[i].setAttribute('value', email)
                            inputs[i].blur()
                        }()

                    }

                    // 姓名
                    if (dom_id.includes('name') || dom_name.includes('name') || dom_title.includes('name')) {

                        !async function simulatedUser() {
                            inputs[i].focus()
                            await sleep(2000)
                            inputs[i].setAttribute('value', name)
                            inputs[i].blur()
                        }()

                    }



                    // 手机
                    if (dom_id.includes('phone') || dom_name.includes('phone') || dom_title.includes('phone')
                        || dom_id.includes('number') || dom_name.includes('number') || dom_title.includes('number')
                    ) {

                        !async function simulatedUser() {
                            inputs[i].focus()
                            await sleep(3000)
                            inputs[i].setAttribute('value', phone)
                            inputs[i].blur()
                        }()

                    }

                    // 主题
                    if (dom_id.includes('subject') || dom_name.includes('subject') || dom_title.includes('subject')) {

                        !async function simulatedUser() {
                            inputs[i].focus()
                            await sleep(4000)
                            inputs[i].setAttribute('value', subject)
                            inputs[i].blur()
                        }()

                    }
                }
            }


            // 过滤select框的干扰,无论什么选项都选第二个
            let selects = document.getElementsByTagName('select')
            if (selects.length > 0) {
                for (let i = 0; i < selects.length; i++) {
                    let childens = selects[i].children;

                    !async function simulatedUser() {
                        childens[i].focus()
                        await sleep(2000)
                        childens[1].selected = true; //设置第二个选中
                        childens[i].blur()
                    }()

                }
            }


            return true;

        })(name, email, phone, subject, content);



        // 提交按钮
        let has_submit = false;




        if (hasSetForm) {
            !async function simulatedUser() {

                await sleep(7000)

                // 提交按钮
                has_submit = (function (mapTxt) {

                    let has_submit = false;

                    for (let i = 0; i < mapTxt.length; i++) {
                        if (submintForm(mapTxt[i])) {
                            has_submit = true;
                            break
                        };
                    }

                    console.log(has_submit ? "已经点击了提交按钮" : '获取提交按钮失败');

                    return has_submit;

                })(['send', 'submit'])

            }()


        }



        // 验证是否提交成功
        if (has_submit) {
            console.log('去验证是否留言成功~');
        } else {
            console.log('提交留言失败~');
        }
    }

    // 找到所有的提交的的按钮,匹配出我们需要的按钮，触发点击事件
    function submintForm(text) {

        text = text.toLowerCase();

        let has_submit = false;

        // 有可能是input按钮
        let submit_inputs = document.querySelectorAll("input[type='submit']")
        for (let i = 0; i < submit_inputs.length; i++) {
            let value_name = (submit_inputs[i].getAttribute('value') + '').toLowerCase();
            if (value_name.includes(text)) {
                console.log("找到了点击input按钮");
                submit_inputs[i].click()

                has_submit = true;
                break;

            }
        }

        // 有可能是button按钮
        if (!has_submit) {
            let submit_btns = document.querySelectorAll("button[type='submit']")
            for (let i = 0; i < submit_btns.length; i++) {
                let value_name = (submit_btns[i].innerHTML + '').toLowerCase()
                if (value_name.includes(text)) {
                    console.log("找到了点击btn按钮");

                    submit_btns[i].click()

                    has_submit = true;
                    break;


                }
            }
        }
        return has_submit;
    }

    // 获取数据
    function getQueryVariable(variable) {
        var query = decodeURIComponent(window.location.search.substring(1));
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) { return pair[1]; }
        }
        return (false);
    }


    function sleep(delay) {
        return new Promise(reslove => {
            setTimeout(reslove, delay)
        })
    }


})();

