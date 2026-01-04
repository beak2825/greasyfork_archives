// ==UserScript==
// @name         菁优组卷与试卷打印处理程序JHB
// @version      0.2.1
// @namespace    bluethon.github.io
// @description  自动处理菁优个人组卷与试卷界面，使其能够直接打印
// @author       Bluethon
// @match        http://www.jyeoo.com/*/paper/detail/*
// @match        https://www.jyeoo.com/*/paper/detail/*
// @match        http://www.jyeoo.com/*/report/detail/*
// @match        https://www.jyeoo.com/*/report/detail/*
// @icon         https://www.jyeoo.com/favicon.ico
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @homepage     https://github.com/Bluethon/Jy-Print-Processer
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545909/%E8%8F%81%E4%BC%98%E7%BB%84%E5%8D%B7%E4%B8%8E%E8%AF%95%E5%8D%B7%E6%89%93%E5%8D%B0%E5%A4%84%E7%90%86%E7%A8%8B%E5%BA%8FJHB.user.js
// @updateURL https://update.greasyfork.org/scripts/545909/%E8%8F%81%E4%BC%98%E7%BB%84%E5%8D%B7%E4%B8%8E%E8%AF%95%E5%8D%B7%E6%89%93%E5%8D%B0%E5%A4%84%E7%90%86%E7%A8%8B%E5%BA%8FJHB.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var username = document.querySelector("div.profile-name").children[0].children[0].innerHTML;
    console.log("%c菁优组卷打印处理程序 %cBy CodeZhangBorui Version 0.11\n%c菁优网用户 %s，欢迎您使用本脚本", 'font-size: large; font-family: "微软雅黑"', 'font-size: large; font-family: "Consolas"', 'font-size: large; font-family: "微软雅黑"', username);
    GM_registerMenuCommand("处理后自动刷新", () => {
        if (localStorage.getItem("EnableAutoRefresh") == 'N') {
            localStorage.setItem("EnableAutoRefresh", 'Y');
            GM_notification("处理后自动刷新：已开启");
        } else {
            localStorage.setItem("EnableAutoRefresh", 'N');
            GM_notification("处理后自动刷新：已关闭");
        }
    })
    if (localStorage.getItem("EnableAutoRefresh") == null) {
        localStorage.setItem("EnableAutoRefresh", 'Y');
        function FirstUseSettingsStep1() {
            showConfirm('请完成脚本设置：是否要在完成处理后自动刷新？<br/>默认值：是。注意：Safari 请填写 N', ['是', function () {
                localStorage.setItem("EnableAutoRefresh", 'Y');
                showMessage('设置成功！');
                showProcess('脚本设置就绪，请点击右侧“立即处理并打印”按钮执行。');
                closeBox(this);
            }], ['否', function () {
                localStorage.setItem("EnableAutoRefresh", 'N');
                showMessage('设置成功！');
                showProcess('脚本设置就绪，请点击右侧“立即处理并打印”按钮执行。');
                closeBox(this);
            }], 0);
        }
        FirstUseSettingsStep1();
    }
    console.log("🔹 创建按钮对象...");
    var tipP = document.createElement('p');
    tipP.innerText = "----- 菁优组卷与试卷打印处理程序 -----";
    var processButton = document.createElement('span');
    processButton.innerHTML = `<a href="javascript:void(0)" style="width:130px;" class="mr15"><i class="icon i-paper-07"></i><em class="m5 vm">立即处理并打印</em></a>`;
    processButton.onclick = function () {
        /*
         * 打印完成后自动刷新：true/false
         */
        var EnableAutoRefresh = localStorage.getItem("EnableAutoRefresh") == 'Y' ? true : false;
        function deleteElementByClassName(ClassName) {
            while (1) {
                var obj = document.getElementsByClassName(ClassName)[0];
                if (obj == undefined) {
                    return;
                }
                obj.remove();
            }
        }
        function deleteElementById(Id) {
            var obj = document.getElementById(Id);
            if (obj == undefined) {
                return;
            }
            obj.remove();
        }
        function removeBorderByClassName(ClassName) {
            var obj = document.getElementsByClassName(ClassName);
            for (var i = 0; i < obj.length; i++) {
                obj[i].setAttribute('style', 'border: none;');
            }
        }
        // JHB
        function changeTitleName(ClassName) {
            var obj = document.getElementsByClassName(ClassName)[0];
            if (obj == undefined) {
                return;
            }
            let str = obj.textContent;
            let parts = str.split('-');
            parts.pop();
            let newStr = parts.join('-');
            console.log(newStr);
            obj.textContent = newStr;
        }
        //获取提示用信息
        var papertitle = document.getElementsByClassName('paper-title')[0].innerText;
        var subject = document.getElementsByClassName('nav-subject')[0].innerText;
        //外部框架
        deleteElementByClassName('top');
        deleteElementById('borwserWarning');
        deleteElementByClassName('brower-tip');
        deleteElementByClassName('header');
        deleteElementById('divNav')
        deleteElementByClassName('clear');
        deleteElementByClassName('foot');
        deleteElementByClassName('fixed-bottom');
        deleteElementById('divMsg');
        deleteElementByClassName('return-top');
        deleteElementByClassName('paper-tab-ctrl');
        deleteElementByClassName('paper-side-2024');
        deleteElementByClassName('divReportCart');
        //Content里内容
        deleteElementById('divBread');
        deleteElementByClassName('fright');
        deleteElementByClassName('h2-txt');
        //删除所有fieldtip
        deleteElementByClassName('fieldtip');
        //去除每道题外面的边框
        removeBorderByClassName('QUES_LI');

        // JHB
        deleteElementByClassName('title-txt tleft mt5 clearfix');    // 删除标题下方显示答案那条div
        deleteElementByClassName('qrcode-side');    // 删除二维码侧边栏
        deleteElementByClassName('new-fixed-bottom-side');    // 删除浮动标题栏, 否则会挡住第二页顶部试题
        changeTitleName('paper-title');     // 修改标题, 删掉补充信息

        //通知并打印
        console.log("✅ 处理成功！");
        // 弹出windows系统通知, 不用了, 太干扰了
        // GM_notification(subject + '| ' + papertitle, "✅ 试卷处理成功！");
        window.print();
        //自动刷新
        if (EnableAutoRefresh) {
            window.location.reload();
        }
    }
    var settingsButton = document.createElement('span');
    settingsButton.innerHTML = `<a href="javascript:void(0)" style="width:90px;" class="mr15"><i class="icon i-paper-12"></i><em class="m5 vm">脚本设置</em></a>`;
    settingsButton.onclick = function () {
        showConfirm('设置项1：是否要在完成处理后自动刷新？<br/>默认值：是。注意：Safari 请填写 N', ['是', function () {
            localStorage.setItem("EnableAutoRefresh", 'Y');
            showMessage('设置成功！');
            closeBox(this);
        }], ['否', function () {
            localStorage.setItem("EnableAutoRefresh", 'N');
            showMessage('设置成功！');
            closeBox(this);
        }], 0);
    }
    console.log("🔹 查找将要添加的位置...");
    var willAppendPlace = document.querySelector("div.mb15.bg-fff.pv15");
    if (willAppendPlace == undefined) {
        console.error("❌ 无法找到将要添加的位置 Element:'div.mb15.bg-fff.pv15'，程序现在将停止");
        showMessage('❌ 出错了<br/>脚本无法找到将要添加的位置 Element: div.mb15.bg-fff.pv15，程序现在将停止。请联系脚本作者更新！', false);
    } else {
        willAppendPlace.appendChild(tipP);
        willAppendPlace.appendChild(processButton);
        willAppendPlace.appendChild(settingsButton);
        console.log("✅ 程序已就绪！");
    }
})();
