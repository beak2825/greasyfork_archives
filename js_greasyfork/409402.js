// ==UserScript==
// @name         Akuvox ChanDao
// @namespace    http://www.akuvox.com/
// @version      0.4
// @description  增加关于软件包下载相关，移动端可以忽略
// @author       phoenixylf
// @match        http://zentao.akuvox.local/*
// @match        http://192.168.10.17/*
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/409402/Akuvox%20ChanDao.user.js
// @updateURL https://update.greasyfork.org/scripts/409402/Akuvox%20ChanDao.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Your code here...

    function changeScmPathToTag(){
         var scmPath = document.getElementById("scmPath");
         var submit = document.getElementById("submit");
         if(scmPath !== null && submit !== null){
              scmPath.parentNode.previousSibling.previousSibling.innerHTML = '<span class="red">Tag</span>'
              scmPath.placeholder = "请输入GitLab上的Tag号,填写后提交按钮才可点击"
              if(scmPath.value == ""){
                  submit.disabled = true;
              }
              scmPath.addEventListener("change",function(){
                  if(scmPath.value != ""){
                      submit.disabled = false;
                  }else{
                      submit.disabled = true;
                  }
              });
             var redStar = document.createElement("div");
             //redStar.class = "required required-wrapper"
             redStar.setAttribute("class", "required required-wrapper");
             scmPath.parentNode.insertBefore(redStar,scmPath);
             //scmPath.parentNode.appendChild(redStar)
         }

    }

    changeScmPathToTag()

    function createButton(text, groupValue) {
        const btn = document.createElement("button");
        btn.textContent = text;
        btn.type = "button";  // 明确设置为按钮，防止触发表单提交
        btn.style.marginLeft = "10px";
        btn.style.padding = "6px 10px";
        btn.style.backgroundColor = "#4CAF50";
        btn.style.color = "white";
        btn.style.border = "none";
        btn.style.borderRadius = "4px";
        btn.style.cursor = "pointer";
        btn.style.display = "inline-block";

        btn.addEventListener("click", function (e) {
            e.preventDefault();  // 阻止表单提交（即使按钮在表单内）
            e.stopPropagation(); // 阻止事件冒泡

            const nameInput = document.getElementById("name");
            const pathInput = document.getElementById("filePath");

            if (!nameInput || !pathInput) {
                console.error("找不到 name 或 filePath 控件");
                return;
            }

            const softwareName = nameInput.value.trim();
            if (!softwareName) {
                alert("请先填写软件名称字段！");
                return;
            }

            const url = `http://192.168.10.2:5000/api/get_version_path?group=${groupValue}&software=${encodeURIComponent(softwareName)}`;

            // 创建弹框
            const modal = document.createElement("div");
            modal.style.cssText = "position:fixed;top:40%;left:50%;transform:translate(-50%,-50%);background:white;padding:20px;box-shadow:0 0 10px rgba(0,0,0,0.3);z-index:9999;text-align:center;";

            const msg = document.createElement("div");
            msg.textContent = "正在查询版本路径，请稍候...";
            modal.appendChild(msg);

            const cancelBtn = document.createElement("button");
            cancelBtn.textContent = "取消";
            cancelBtn.style.cssText = "margin-top:10px;padding:5px 10px;margin-left:10px;border:1px solid #ccc;cursor:pointer;";
            modal.appendChild(cancelBtn);

            document.body.appendChild(modal);

            let cancelled = false;
            let req = null;

            cancelBtn.addEventListener("click", function () {
                cancelled = true;
                if (req && typeof req.abort === "function") {
                    req.abort();
                }
                document.body.removeChild(modal);
            });

            req = GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function (response) {
                    if (cancelled) return;
                    document.body.removeChild(modal);

                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            pathInput.value = data.version_path || "";
                        } catch (err) {
                            alert("返回数据格式错误！");
                            console.error("JSON 解析失败:", err);
                        }
                    } else {
                        try {
                            const data = JSON.parse(response.responseText);
                            alert(data.error || "查询失败");
                        } catch {
                            alert("查询失败：" + response.status);
                        }
                    }
                },
                onerror: function () {
                    if (!cancelled) {
                        alert("请求失败");
                        document.body.removeChild(modal);
                    }
                }
            });
        });

        return btn;
    }

    function insertButtons() {
        const target = document.getElementById("filePath");
        if (!target) {
            console.error("未找到 ID 为 filePath 的控件");
            return;
        }

        const wrapper = document.createElement("span");
        wrapper.style.marginLeft = "10px";

        const androidBtn = createButton("获取安卓包路径", "android_team");
        const embBtn = createButton("获取EMB包路径", "emb_team");

        wrapper.appendChild(androidBtn);
        wrapper.appendChild(embBtn);

        target.insertAdjacentElement("afterend", wrapper);
    }

    // 等待 DOM 加载完成再插入
    window.addEventListener("load", insertButtons);


})();