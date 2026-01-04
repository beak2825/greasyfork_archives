// ==UserScript==
// @name         nodeseek论坛屏蔽词
// @namespace    http://tampermonkey.net/
// @version      2023-12-30
// @description  为nodeseek论坛添加屏蔽词功能
// @author       bigQY
// @match        https://www.nodeseek.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nodeseek.com
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483014/nodeseek%E8%AE%BA%E5%9D%9B%E5%B1%8F%E8%94%BD%E8%AF%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/483014/nodeseek%E8%AE%BA%E5%9D%9B%E5%B1%8F%E8%94%BD%E8%AF%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 设置按钮
    var headerDiv = document.querySelector("#nsk-head")
    var btn = document.createElement("button");
    btn.innerHTML = "屏蔽词设置";
    btn.classList.add("btn");
    btn.style = "margin-left: 10px;";
    headerDiv.appendChild(btn);

    // 设置面板
    var panel = document.createElement("div");
    panel.innerHTML = `
    <div id="ns-block-words-setting">
      <h2>屏蔽词设置</h2>
      <input type="checkbox" id="ns-block-words-checkbox-enable" name="ns-block-words-checkbox-enable" checked />
      <label for="ns-block-words-checkbox-enable">启用屏蔽词</label>
      <br/>
      <input type="checkbox" id="ns-block-words-checkbox-hide" name="ns-block-words-checkbox-enable" checked />
      <label for="ns-block-words-checkbox-hide">不显示被屏蔽的帖子或楼层</label>
      <br/>
      <p>屏蔽词列表（逗号分隔）</p>
      <textarea id='ns-block-words' style='width: 98%; height: 50vh;'></textarea>
      <br/>
      <div style="display: flex;justify-content: end;margin:10px">
        <button id='ns-block-words-btn-save' class='btn' style="margin:0 10px">保存</button>
        <button id='ns-block-words-btn-cance' class='btn'>取消</button>
      </div>
    </div>
    `;
    panel.style = `
    position: fixed; 
    top: 10vh; 
    left: 10vw; 
    z-index: -1; 
    display: block;
    width: 80vw; 
    height: 0; 
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 10px;
    backdrop-filter: blur(10px);
    padding:20px;
    transition: all 0.5s;
    opacity: 0;
    overflow: hidden;
    `;
    document.body.appendChild(panel);

    // 设置按钮点击事件
    btn.onclick = function() {
        showSetting();
        document.getElementById("ns-block-words").value = localStorage.getItem("ns-block-words");
    };
    // 保存按钮点击事件
    document.getElementById("ns-block-words-btn-save").onclick = function() {
        localStorage.setItem("ns-block-words", document.getElementById("ns-block-words").value);
        localStorage.setItem("ns-block-words-enable", document.getElementById("ns-block-words-checkbox-enable").checked);
        localStorage.setItem("ns-block-words-hide", document.getElementById("ns-block-words-checkbox-hide").checked);
        hideSetting();
    };
    // 取消按钮点击事件
    document.getElementById("ns-block-words-btn-cance").onclick = function() {
        hideSetting();
    };

    function showSetting() {
        panel.style.zIndex = 9998;
        panel.style.opacity = 1;
        panel.style.height = "80vh";
    }

    function hideSetting() {
        panel.style.opacity = 0;
        panel.style.height = "0";
        setTimeout(function() {
          if(panel.style.opacity == 0){
            panel.style.zIndex = -1;
          }
        }, 500);
    }

    // dom ready初始化
    $(document).ready(function() {
        // 屏蔽词列表
        var blockWords = localStorage.getItem("ns-block-words");
        if (blockWords == null) {
            blockWords = "";
        }
        blockWords = blockWords.split(",");
        // 启用屏蔽词
        var enable = localStorage.getItem("ns-block-words-enable");
        enable = enable == 'true' ? true : false;
        var checkbox = document.getElementById("ns-block-words-checkbox-enable");
        checkbox.checked = enable;
        // 隐藏屏蔽词
        var hide = localStorage.getItem("ns-block-words-hide");
        hide = hide == 'true' ? true : false;
        var checkbox2 = document.getElementById("ns-block-words-checkbox-hide");
        checkbox2.checked = hide;
        // 屏蔽词列表
        var textarea = document.getElementById("ns-block-words");
        textarea.value = blockWords.join(",");
        // 屏蔽词
        if (enable) {
            // 帖子界面
            var comments = document.querySelectorAll(".content-item");
            if (comments != null) {
                comments.forEach(function(comment) {
                    var content = comment.querySelector(".post-content");
                    var contentText = content.innerText;
                    blockWords.forEach(function(word) {
                        if (contentText.indexOf(word) != -1) {
                            if (word==="") return;
                            if (hide) {
                                comment.style.display = "none";
                            } else {
                                content.innerHTML = `<span style="color: red;">触发屏蔽词：${word}</span>`
                            }
                        }
                    });
                });
            }
            // 列表界面
            var posts = document.querySelectorAll(".post-list-content");
            if (posts != null) {
                posts.forEach(function(post) {
                    var content = post.querySelector(".post-title > a");
                    var contentText = content.innerText;
                    blockWords.forEach(function(word) {
                        if (contentText.indexOf(word) != -1) {
                            if (word==="") return;
                            if (hide) {
                                post.parentNode.style.display='none'
                            } else {
                                content.innerHTML = `<span style="color: red;">触发屏蔽词：${word}</span>`
                            }
                        }
                    });
                });
            }
        }
    });
})();