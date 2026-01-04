// ==UserScript==
// @name         南航算力平台增强脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  南航算力平台增强脚本 ssh命令一键复制
// @author       You
// @match        http://hpcai.nuaa.edu.cn/dashboard
// @icon         http://hpcai.nuaa.edu.cn/static/img/logo.375eb001.svg
// @require https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @grant        GM_setClipboard
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/463368/%E5%8D%97%E8%88%AA%E7%AE%97%E5%8A%9B%E5%B9%B3%E5%8F%B0%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/463368/%E5%8D%97%E8%88%AA%E7%AE%97%E5%8A%9B%E5%B9%B3%E5%8F%B0%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let machine_list = []
    function addSshButtonOnPage() {
        let divs = $(".model_hd")
        console.log(divs)

        $(".addBtn").remove();

        for(let i = 0; i < divs.length; i++){

            let u = divs[i]
            console.log(u.outerText)
            let content = u.outerText
            var reg1 = /实例ID: (.*)/;
            console.log(reg1.exec(content)[1].trim());
            let task_id = reg1.exec(content)[1].trim()
            let uid = `ssh-${task_id}`

//             if($(`#${uid}`).length > 0){
//                 $(`#${uid}`).remove();
//                 //continue
//             }

            let port = ''
            for(let j = 0; j < machine_list.length; j++) {
                if(task_id == machine_list[j].task_id) {
                    port = machine_list[j].port;
                    break;
                }
            }

            //let newBtn = $('<button data-v-d739442c="" type="button" id="ssh" class="el-button el-button--success"><!----><!----><span> ssh命令 </span></button>').
            const newBtn = document.createElement("button");
            newBtn.setAttribute("class", "el-button el-button--success addBtn");
            newBtn.setAttribute("type", "button");
            newBtn.setAttribute("id", uid);
            // 创建一个 span 元素
            const span = document.createElement("span");

            // 在 span 元素中添加文本
            const textNode = document.createTextNode("ssh命令");

            // 将文本节点添加到 span 元素中
            span.appendChild(textNode);

            newBtn.appendChild(span);

            divs[i].lastChild.append(newBtn)
            $(`#${uid}`).click(function () {
                //$(this).addClass("active");
                console.log('666')
                // that.$message('这是一条消息提示');
                //let port = '1234'
                GM_setClipboard(`ssh ubuntu@172.18.101.86 -p ${port}`);
                GM_notification({text: "ssh命令已复制到剪切板", title: "南航算力平台增强脚本", timeout: 2500});
            })

        }


    }

    //setTimeout(() => {addSshButtonOnPage()}, 1000);

    var _ajax = window.XMLHttpRequest.prototype.send;
    window.XMLHttpRequest.prototype.send = function () {
        this.addEventListener('readystatechange', function () {
            if (this.readyState == 4) {
                //console.log(this)
                //console.log(this.response);
                var data1 = JSON.parse(this.response).data;
                let res = this.response;
                if(!Array.isArray(data1) || data1.length == 0) {
                    return
                }
                //console.log(typeof this.response)
                //console.log(data)

                let tmp_list = [];

                //console.log(data1, machine_list)
                for(let i = 0; i < data1.length; i++) {
                    tmp_list.push({'task_id': data1[i].task_id, 'port': data1[i].port});
                }

                let flag = false;
                for(let i = 0; i < data1.length; i++){
                    let exist = false;
                    for(let j = 0; j < machine_list.length; j++){
                        if(data1[i].task_id == machine_list[j].task_id){
                            exist = true;
                            break
                        }
                    }
                    if(!exist){
                        flag = true;
                        break
                    }
                }

                //console.log(tmp_list, machine_list)

                if(flag) {
                    machine_list = tmp_list;
                    addSshButtonOnPage();
                }
            }
        }, false);
        _ajax.apply(this, arguments);
    };
})();