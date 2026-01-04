// ==UserScript==
// @name         gitAddProject
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  git add project for pms
// @author       HolmesZhao
// @match        *://pms.zuoyebang.cc/ApplyForGit*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430323/gitAddProject.user.js
// @updateURL https://update.greasyfork.org/scripts/430323/gitAddProject.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var username_script = ""
    let projects = [
        { "power": "paperangtest", "reason": "迁移项目"}
    ]

    function getUserInfo() {
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function() {
            if(this.readyState === 4) {
                console.log(this.responseText);
                let result = JSON.parse(this.responseText).data
                username_script = result.uname
            }
        });

        xhr.open("GET", "https://pms.zuoyebang.cc/testplatapi/rdtask/GetUserInfo");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.send();
    }
    getUserInfo();

    function addProject(power, reason) {
        if (username_script == "") {
            alert('请先登录')
            return
        }
        let gitcode = "Paperang_iOS"
        let btn = document.getElementsByClassName('mmbutton')[0];
        switch (btn.innerText) {
            case "组件":
                gitcode = "Paperang_iOS"
                break;
            case "项目":
                gitcode = "paperangnative"
                break;
            default:
                break;
        }
        let approved = "zhangtianlong"
        let deptfullname = "其他部门"
        var data = JSON.stringify({"username": username_script,"gitcode": gitcode,"power":"Add Project:" + power + " (private)", "gitapproved": approved, "url": "git.zuoyebang.cc", "reason": reason, "deptfullname": deptfullname});

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function() {
            if(this.readyState === 4) {
                console.log(this.responseText);
            }
        });

        xhr.open("POST", "https://pms.zuoyebang.cc/testplatapi/git/SetApproved");
        xhr.setRequestHeader("Cookie", document.cookie);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.send(data);
    }

    function addButton(name, marginLeft, fun) {
        var txt = document.createTextNode(name);
        var btn = document.createElement('button');
        btn.className = 'mmbutton';
        btn.style = "z-index: 9999; font-size: large; position: fixed; top: 0pt; left: "+(screen.width / 4 + marginLeft)+"px;";
        btn.onclick = fun;
        btn.appendChild(txt);
        document.body.appendChild(btn);
        return btn.offsetWidth;
    };

    function injectOnce() {
        let ivu_tabs_tabpane = null
        document.getElementsByClassName('ivu-tabs-tabpane').forEach(element => {
            if (element.className == 'ivu-tabs-tabpane' &&
                element.style.visibility == 'visible') {
                element.getElementsByClassName('ivu-form-item-label').forEach(element2 => {
                    if (element2.textContent.indexOf('project') != -1) {
                        ivu_tabs_tabpane = element
                    }
                })
            }
        });
        if (ivu_tabs_tabpane == null) {
            alert('null')
            return
        } else {
            let input_default = ivu_tabs_tabpane.getElementsByClassName('ivu-input')[0]
            let input_textArea = ivu_tabs_tabpane.getElementsByClassName('ivu-input')[1]
            if (input_default.value.length == 0) {
                alert('需要输入 project 名称')
                return
            }
            if (input_textArea.value.length == 0) {
                input_textArea.value = "喵宝组件"
            }
            addProject(input_default.value, input_textArea.value)
        }
        alert('已发送请求');
    }

    function injectAll() {
        projects.forEach(e => {
            addProject(e.power, e.reason)
        })
        alert('已发送所有请求');
    }

    function changedGroup() {
        let btn = document.getElementsByClassName('mmbutton')[0];
        switch (btn.innerText) {
            case "组件":
                btn.innerText = "项目"
                break;
            case "项目":
                btn.innerText = "组件"
                break;
            default:
                break;
        }
    }

    window.onload = () => {
        addButton('组件', 0, changedGroup);
        addButton('单次申请', 100, injectOnce);
        addButton('批量申请', 200, injectAll);
    }
})();