// ==UserScript==
// @name         ChatGPT-Magic
// @namespace    ChatGPT-Magic
// @version      0.5
// @license MIT
// @description  这是一个最新的ai交互功能chatgpt，与搜索引擎融合的油猴插件，通过这个插件可以实现左边查看搜索引擎搜索结果，右边查看ai方给的答案方便日常工作优化搜索引擎。
// @author       //作者微信号wxid_qo94xu9bwvwo22
// @match        *://*.baidu.com/*
// @match        *://*.csdn.net/*
// @match        *://*.google.com/*
// @match        *://*.bing.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0CAYAAADL1t+KAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAQvaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49J++7vycgaWQ9J1c1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCc/Pgo8eDp4bXBtZXRhIHhtbG5zOng9J2Fkb2JlOm5zOm1ldGEvJz4KPHJkZjpSREYgeG1sbnM6cmRmPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjJz4KCiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0nJwogIHhtbG5zOkF0dHJpYj0naHR0cDovL25zLmF0dHJpYnV0aW9uLmNvbS9hZHMvMS4wLyc+CiAgPEF0dHJpYjpBZHM+CiAgIDxyZGY6U2VxPgogICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSdSZXNvdXJjZSc+CiAgICAgPEF0dHJpYjpDcmVhdGVkPjIwMjItMTItMTE8L0F0dHJpYjpDcmVhdGVkPgogICAgIDxBdHRyaWI6RXh0SWQ+MmE3ZjhhMjQtNzAyZS00YmUwLThkMDYtNjQxNzcwYTQyZjU5PC9BdHRyaWI6RXh0SWQ+CiAgICAgPEF0dHJpYjpUb3VjaFR5cGU+MjwvQXR0cmliOlRvdWNoVHlwZT4KICAgIDwvcmRmOmxpPgogICA8L3JkZjpTZXE+CiAgPC9BdHRyaWI6QWRzPgogPC9yZGY6RGVzY3JpcHRpb24+CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczpkYz0naHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8nPgogIDxkYzp0aXRsZT4KICAgPHJkZjpBbHQ+CiAgICA8cmRmOmxpIHhtbDpsYW5nPSd4LWRlZmF1bHQnPmMgLSAxPC9yZGY6bGk+CiAgIDwvcmRmOkFsdD4KICA8L2RjOnRpdGxlPgogPC9yZGY6RGVzY3JpcHRpb24+CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczpwZGY9J2h0dHA6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dAAADEDQAQAwAEEHAMAABB0AAAMQdAAADEDQAQAwAEEHAMAABB0AAAMQdAAADEDQAQAwAEEHAMAABB0AAAMQdAAADEDQAQAwAEEHAMAABB0AAAMQdAAADEDQAQAwAEEHAMAABB0AAAMQdAAADEDQAQAwAEEHAMAABB0AAAMQdAAADEDQAQAwAEEHAMAABB0AAAMQdAAADEDQAQAwAEEHAMAABB0AAAMQdAAADEDQAQAwAEEHAMAABB0AAAMQdAAADEDQAQAwAEEHAMAABB0AAAMQdAAADEDQAQAwAEEHAMAABB0AAAMQdAAADEDQAQAwAEEHAMAABB0AAAMQdAAADEDQAQAwAEEHAMAABB0AAAMQdAAADEDQAQAwAEEHAMAABB0AAAMQdAAADEDQAQAwAEEHAMAABB0AAAMQdAAADEDQAQAwAEEHAMAABB0AAAMQdAAADEDQAQAwAEEHAMAABB0AAAMQdAAADEDQAQAwAEEHAMAABB0AAAMQdAAADEDQAQAwAEEHAMAABB0AAAMQdAAADEDQAQAwAEEHAMAABB0AAAMQdAAADEDQAQAwAEEHAMAABB0AAAMQdAAADEDQAQAwAEEHAMAABB0AAAMQdAAADEDQAQAwAEEHAMAABB0AAAMQdAAADEDQAQAwAEEHAMAABB0AAAMQdAAADEDQAQAwAEEHAMAABB0AAAMQdAAADEDQAQAwAEEHAMAABB0AAAMQdAAADEDQAQAwAEEHAMAABB0AAAMQdAAADEDQAQAwAEEHAMAABB0AAAMQdAAADEDQAQAwAEEHAMAA/x+E8eujTE0BpQAAAABJRU5ErkJggg==

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456447/ChatGPT-Magic.user.js
// @updateURL https://update.greasyfork.org/scripts/456447/ChatGPT-Magic.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 节流函数
    function throttle(fn, delay) {
        // last为上一次触发回调的时间
        let last = 0;
        // 将throttle处理结果当作函数返回
        return function () {
            // 保留调用时的this上下文
            let context = this;
            // 保留调用时传入的参数
            let args = arguments;
            // 获取当前时间
            let now = +new Date();
            // 判断上次触发的时间和当前的时间差是否小于时间间隔的阈值
            if (now - last >= delay) {
                // 将this和参数传入函数执行
                fn.apply(context, args);
                // 更新时间
                last = now;
            }
        }
    }
    //xss注入转义函数 防范xss
    function htmlEncodeByRegExp  (str){  
        var s = "";
        if(str.length == 0) return "";
        s = str.replace(/&/g,"&amp;");
        s = s.replace(/</g,"&lt;");
        s = s.replace(/>/g,"&gt;");
        s = s.replace(/ /g,"&nbsp;");
        s = s.replace(/\'/g,"&#39;");
        s = s.replace(/\"/g,"&quot;");
        return s;  
}


    // Your code here...
    var su, kw

    window.onload = function () {
        console.log("欢迎使用chatgpt功能")
        var href = window.location.href;
        if (href.indexOf("https://www.baidu.com") != -1) {
            su = document.querySelector("#su")
            kw = document.querySelector("#kw")
        }
        if (href.indexOf("csdn") != -1) {
            su = document.querySelector("#search")
            kw = document.querySelector("#keyword")
            console.log(su, kw)
        }
        if (href.indexOf("google") != -1) {


            su = document.querySelector(".Tg7LZd")
            kw = document.querySelector("input")
            console.log(su, kw)


        }
        if (href.indexOf("bing") != -1) {


            su = document.querySelector("#sb_form_q")
            kw = document.querySelector("#sb_form_go")
            console.log(su, kw)


        }

        su.addEventListener("click", throttle(() => {
            let warps = document.querySelectorAll("#warp")
            console.log(warps)
            if (warps.length != 0) {
                warps[0].remove()
            }

            var box = `
    <div id="warp" class="warp">
        <div class="content">
            <div id="gbt_title" class ="gbt_title" style="padding-top:20px;margin-bottom:0px;font-weight: 800;text-align: center">Chatgpt-AI插件</div>
            <span style="word-wrap:break-word;word-break:break-all;" class="content_val">chatgpt插件已经触发，稍等片刻即可获得相应答案~</span>
            <img id="chatgpt_img" style="width:100%;margin-top:20px;border-radius:20px"  src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202107%2F19%2F20210719182507_fbc17.thumb.1000_0.gif&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1673322367&t=ab3d1b28dfc19845790520826340af93" alt="">

        </div>
    </div>
    `
            document.body.insertAdjacentHTML('afterbegin', box);
            let warp = document.querySelector("#warp")
            let gbt_title = document.querySelector("#gbt_title")
            let flag = false;
            let disX, disY;
            let bound;
            // flag 设为 true 表示按下鼠标，并记录鼠标离盒子左上角的相对距离
            function leftDown(e) {
                if (e.button === 0) {   // 按下鼠标左键
                    flag = true;
                    bound = warp.getBoundingClientRect();

                    disX = e.clientX - bound.left;
                    disY = e.clientY - bound.top;
                }
            }

            function drag(e) {
                if (flag) {
                    let top = e.clientY - disY;
                    let left = e.clientX - disX;

                    // 处理边界条件
                    if (top < 0) top = 0;
                    if (left < 0) left = 0;
                    // if (top + bound.height > document.body.clientHeight) {
                    //     top = document.body.clientHeight - bound.height;
                    //     console.log(top,"top")
                    // }
                    if (left + bound.width > document.body.clientWidth) {
                        left = document.body.clientWidth - bound.width;
                    }

                    warp.style.top = `${top}px`;
                    warp.style.left = `${left}px`;
                }
            }

            function leftUp(e) {
                if (e.button === 0) {
                    flag = false;
                }
            }

            gbt_title.addEventListener('mousedown', leftDown);
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', leftUp);
            console.log(warp)
            gbt_title.style.padding = "10px"
            warp.style.position = "absolute"
            warp.style.borderRadius = "20px"
            warp.style.margin = "50px 20px"
            warp.style.border = "1px solid #96C2F1"
            warp.style.backgroundColor = "rgba(247, 247, 247)"

            warp.style.paddingBottom = "20px"
            warp.style.right = "20px"
            warp.style.width = "15%"
            warp.style.zIndex = "999"
            let content = document.querySelector(".content")
  
            content.style.padding = "10px"
            content.style.color = "rgba(112, 112, 112)"
            let content_val = document.querySelector(".content_val")
            let chatgpt_img = document.querySelector("#chatgpt_img")
            content_val.style.paddingRight = "20px"
            $.ajax({
                "url": "https://www.miku39.fun/openai/get_answer", "data": JSON.stringify({
                    "prompt": kw.value,
                }),
                "type": "POST",
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (result) {
                        console.log(result.msg)
                        //console.log(content_val)
                        content_val.innerHTML = ""
                        chatgpt_img.remove()
                        content_val.innerHTML = htmlEncodeByRegExp(result.msg)
                        console.log(content_val)
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest.status, XMLHttpRequest.statusText, XMLHttpRequest.responseText); // 获取状态码
                    chatgpt_img.remove()
                    if (XMLHttpRequest.status == 0) {
                        content_val.innerHTML = "服务器出错请联系开发者~"//作者微信号wxid_qo94xu9bwvwo22，有问题请联系
                    }
             
                }
            })

        }, 1000))
    }




})();