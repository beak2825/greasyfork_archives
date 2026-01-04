// ==UserScript==
// @name         GitHub Actions secrets 自动填写及更新
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  全自动填写及更新secrets，方便省事，使用时需要自己在代码里添加secrets
// @author       Aerozb
// @match        https://github.com/*/settings/secrets/actions*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420300/GitHub%20Actions%20secrets%20%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%8F%8A%E6%9B%B4%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/420300/GitHub%20Actions%20secrets%20%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%8F%8A%E6%9B%B4%E6%96%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.clear();
    let env = new Object();
    /*
    需要你在此注释以下面添加secrets

    格式： env.机密名 = ‘机密值'，如有多个机密值请使用&符号分开

    示例：
        一个账号cookie： env.JD_COOKIE = 'cookie1';
        4个账号cookie：env.JD_COOKIE = 'cookie1&cookie2&cookie3&cookie4';

        互助码：如果n个账号之间需要互助，互助码请填写n遍，2个账号东东农场互助码填写如下
        env.FRUITSHARECODES = '账号一互助码@账号二互助码&账号一互助码@账号二互助码';

    机密值 格式都跟lxk格式一样
    请务必保存好自己填写的secrets， 因为此脚本更新， 会覆盖， 你填写的就没了
    ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/

    //示例
    env.PET_NOTIFY_CONTROL = 'true';
    
    //↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
    let envKeys = [];
    for (let key in env) {
        envKeys.push(key);
    }

    localStorage.setItem("env", env);
    localStorage.getItem("env");
    let keyLen = envKeys.length;
    let index = localStorage.getItem("index");


    let url = window.location.href;
    //通过截取URL斜杠后的字符串，判断当前页，是添加还是修改或者secret页面
    let suffix = url.substr(url.lastIndexOf('/') + 1);

    //在secret页面才进行失败的secret判断
    if (isSecretPage()) {
        //判断是否有设置失败的secret
        let failedDiv = document.querySelectorAll("div");
        let isDel = true;
        for (let i = 0; i < failedDiv.length; i++) {
            if (macth(failedDiv[i].innerHTML, 'Please try again')) {
                isDel = false;
                if (localStorage.getItem("resetSecret") == null) {
                    localStorage.setItem("resetSecret", envKeys[index - 1]);
                }
                break;
            }
        }

        //成功设置，则移除resetSecret
        if (isDel) {
            localStorage.removeItem("resetSecret");
        }
    }

    if (index == keyLen) {
        if (confirm("已设置完所有secrets或已设置完新增的secrets，是否从头开始设置")) {
            if (confirm("真的确定从头开始设置？")) {
                index = setIndex(index);
            }
        }
    } else if (!index || index > keyLen) {
        index = setIndex(index);
    }

    //获取设置失败的secret
    let resetSecret = localStorage.getItem("resetSecret");
    if (isSecretPage()) {
        //获取页面secrets
        let keynameList = [];
        document.querySelectorAll("code").forEach(e => {
            if (macth(e.className, 'f5')) {
                keynameList.push(e.innerText);
            }
        });

        //是否进入更新页
        let isUpdate = false;

        //遍历页面secrets，进行下一步动作
        for (let i = index; i < keyLen; i++) {
            for (let j = 0; j < keynameList.length; j++) {
                //先进入需要重新设置secret的修改页面
                if (resetSecret != null) {
                    if (resetSecret == keynameList[j]) {
                        window.location.href += '/' + resetSecret;
                        isUpdate = true;
                        break;
                    }
                } else {
                    if (envKeys[i] == keynameList[j]) {
                        localStorage.setItem("index", i);
                        window.location.href += '/' + envKeys[i];
                        isUpdate = true;
                        break;
                    }
                }
            }
            if (isUpdate) {
                break;
            }
            window.location.href += '/new';
            break;
        }
    } else if (macth(suffix, 'new')) {
        if (resetSecret == null) {
            document.querySelector("#secret_name").value = envKeys[index];
        }
        // 处理设置失败的secret
        else {
            document.querySelector("#secret_name").value = resetSecret;
        }
        addOrUpadteValue(true);
    } else {
        addOrUpadteValue(false);
    }

    function addOrUpadteValue(isAdd) {
        //先处理设置失败的secret
        if (resetSecret != null) {
            document.querySelector("#secret_value").value = env[resetSecret];
        } else if (isAdd) {
            document.querySelector("#secret_value").value = env[envKeys[index]];
        } else {
            document.querySelector("#secret_value").value = env[suffix];
        }
        localStorage.setItem("index", parseInt(index) + 1);
        let submit = document.querySelector(".form-group > button");
        submit.removeAttribute("disabled");
        submit.click();
    }

    function macth(str, macthStr) {
        return str.indexOf(macthStr) != -1;
    }

    function setIndex(index) {
        localStorage.setItem("index", 0);
        index = localStorage.getItem("index");
        return index;
    }

    function isSecretPage() {
        return macth(suffix, 'actions') || suffix == '';
    }
})();