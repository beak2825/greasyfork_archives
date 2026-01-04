// ==UserScript==
// @name         三三制
// @namespace    http://tampermonkey.net/
// @license Common
// @version      0.3.1
// @description  打开测试界面，自动填写三三制答案
// @author       木木
// @match        https://33.bxwxm.com.cn/index/exam/show/id/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bxwxm.com.cn
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/451972/%E4%B8%89%E4%B8%89%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/451972/%E4%B8%89%E4%B8%89%E5%88%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function goToUrl(url) {
        var div = document.createElement('div');
        div.style.position = 'fixed';
        div.style.top = '50%';
        div.style.left = '50%';
        div.style.transform = 'translate(-50%,-50%)';
        div.style.color = 'blue';
        div.style.background = 'white';
        div.style.padding = '10px';
        div.style.border = '1px solid blue';
        div.style.borderRadius = '10px';
        div.style.width = '200px';
        div.style.display = 'flex';
        div.style.flexDirection = 'column';
        var content = document.createElement('div');
        content.innerText = '无法连接服务器，可能是服务器被墙了，是否前往放行？在拦截界面点击高级，点击继续访问。然后回到此页面刷新。';
        div.appendChild(content);
        var buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        div.appendChild(buttonContainer);
        var cancelButton = document.createElement('button');
        cancelButton.style.color = 'blue';
        cancelButton.style.background = 'white';
        cancelButton.style.border = '1px solid blue';
        cancelButton.style.borderRadius = '5px';
        cancelButton.style.flexGrow = '1';
        cancelButton.innerText = '取消';
        cancelButton.onclick = function () {
            document.body.removeChild(div);
        };
        buttonContainer.appendChild(cancelButton);
        var confirmButton = document.createElement('button');
        confirmButton.style.color = 'blue';
        confirmButton.style.background = 'white';
        confirmButton.style.border = '1px solid blue';
        confirmButton.style.borderRadius = '5px';
        confirmButton.style.flexGrow = '1';
        confirmButton.innerText = '确认';
        confirmButton.onclick = function () {
            window.location.href = url;
        };
        buttonContainer.appendChild(confirmButton);
        document.body.appendChild(div);
    }

    let had_init = false;
    fetch("https://43.128.107.237:5721/", {
        method: "GET", headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },mode: 'cors',
    }).then(response => {
        
        if (response.ok) {
            response.text().then(text => {

            })
        } else {
            goToUrl("https://43.128.107.237:5721/")
        }
    }).catch(error => {
        goToUrl("https://43.128.107.237:5721/")
    })

    function init() {
        if (had_init) {
            return;
        }


        let uls = document.getElementsByClassName("list-unstyled question");
        for (var i = 0; i < uls.length; i++) {
            //判断是否做过
            if (uls[i].getElementsByTagName("div").length > 0) {
                add_message(document.getElementsByClassName("full text-center")[0], "\r\n三三制脚本：已做,不再自动选择。")
                break;
            }
            let q_list = uls[i].getElementsByClassName("a-radio")[0].getAttribute("name");
            var title = uls[i].getElementsByClassName("question_title")[0];
            var strong_text = my_replace(title.getElementsByTagName("strong")[0].innerText);
            var question = my_replace(title.innerText).replace(/^\[.*?\]/g, "").replace(strong_text, "");
            request(uls[i], q_list, question);
        }

        function request(ul, q_list, question) {
            fetch(`https://43.128.107.237:5732/ssz?q_list=${q_list}`, {
                method: "GET", headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }, mode: 'cors',

            })
                .then(response => response.json())
                .then(json => {
                    // 数据库中一个 q_list 只有唯一一个数据对应，所以如果返回成功，直接获取第一个就行
                    if (json['statue'] === 200) {
                        const ans = json["results"][0]["answers"];
                        check(ans, ul);
                    } else {
                        // 如果查找失败，通过题目查找
                        request_with_question(ul, question);
                    }
                })
                .catch(error => {
                    console.error("请求失败：", error);
                    add_message(ul, "查找答案失败");
                });
        }

        function request_with_question(ul, question) {
            fetch(`https://43.128.107.237:5732/ssz?question=${question}`, {
                method: "GET", headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }, mode: 'cors'
            })
                .then(response => response.json())
                .then(json => {
                    // 数据库中一个 question 可能对应多个结果，如果返回成功，处理多个结果
                    if (json['statue'] == 200) {
                        const results = json["results"];
                        for (let res_index = 0; res_index < results.length; res_index++) {
                            check(ul, results[res_index]['answers']);
                        }
                    } else {
                        // 显示查找失败信息
                        add_message(ul, "查找答案失败");
                    }
                })
                .catch(error => {
                    console.error("请求失败：", error);
                    add_message(ul, "查找答案失败");
                });
        }


        function check(answers, ul) {
            var lis = ul.getElementsByClassName("question_info");
            var need_check_radios = [];
            var need_check_text = [];
            for (var i = 0; i < lis.length; i++) {
                had_init = true;
                var text = my_replace(lis[i].innerText);
                //console.log("选项内容为："+text+"答案内容为"+answers);
                for (var j = 0; j < answers.length; j++) {
                    if (answers[j] === text) {
                        need_check_radios.push(lis[i].getElementsByClassName("a-radio")[0]);
                        need_check_text.push(text);
                    }
                }
            }
            if (my_equals(need_check_text, answers)) {
                for (var radio_index = 0; radio_index < need_check_radios.length; radio_index++) {
                    need_check_radios[radio_index].checked = true;
                }
            } else {
                add_message(ul, "查找到答案，但是匹配选项失败，以下是查询到的答案：" + answers);
            }
        }

        function my_replace(text) {
            text = text.replace(new RegExp(/( |	|[\r\n])|\s+|\s+$/g), "");
            text = text.replace(/^[A-Z][．|\.|,|、|，|,]{0,1}/, "");
            return text;
        }

        function my_equals(arr1, arr2) {
            return arr1.length === arr2.length && arr1.every(function (value) {
                return arr2.includes(value);
            });
        }

        function add_message(ul, msg) {
            var a = document.createElement('a');
            a.innerText = msg;
            ul.appendChild(a);
        }
    }

    const checkForQuestionListBox = setInterval(() => {
        const questionListBox = document.getElementById('question-list-box');
        if (questionListBox) {
            // 检测到元素，调用 init 方法并清除循环
            init();
            clearInterval(checkForQuestionListBox);
        }
    }, 500);

    // Your code here...
})();
