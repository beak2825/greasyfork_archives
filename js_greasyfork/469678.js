// ==UserScript==
// @name         ECJTU-Stu_自动联网工具
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  每次登录认证都很麻烦
// @author       gitee小威
// @match        http://172.16.2.100/*
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.5.1.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @require      https://cdn.jsdelivr.net/npm/blueimp-md5@2.9.0
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469678/ECJTU-Stu_%E8%87%AA%E5%8A%A8%E8%81%94%E7%BD%91%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/469678/ECJTU-Stu_%E8%87%AA%E5%8A%A8%E8%81%94%E7%BD%91%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

//开始
start()
function checkLocalStorageKey(key) {
    const value = localStorage.getItem(key);
    return value === '' || value == null;
}
// 弹出警告框并获取用户输入的用户名和密码
function showAlertWithUserInput() {
    // 创建一个空的 div 元素，用于存储对话框的内容
    var dialogContent = $('<div>');
    // 创建用户名输入框
    var usernameInput = $('<input type="text" placeholder="学号">');
    dialogContent.append(usernameInput);
    // 创建密码输入框
    var passwordInput = $('<input type="password" placeholder="密码">');
    dialogContent.append(passwordInput);
    // 创建下拉框
    var Select = $('<select>');
    var option1 = $('<option value="1">中国移动</option>');
    var option2 = $('<option value="2">中国电信</option>');
    var option3 = $('<option value="3">中国联通</option>');
    Select.append(option1, option2, option3);
    dialogContent.append(Select);
    passwordInput.after('<p>一次输入，永久自动登录！</br>第一次使用请输入学号和密码</p>');
    // 显示对话框
    dialogContent.dialog({
        modal: true,
        title: '，ECJTU校园网一键登录！',
        buttons: {
            "确认": function() {
                localStorage.setItem('studentID', usernameInput.val());
                localStorage.setItem('password', passwordInput.val());
                localStorage.setItem('ISP', Select.val()); // 保存选择的学校
                console.log('学号：', localStorage.getItem('studentID'));
                $(this).dialog("close");
                location.reload();
            },
            "取消": function() {
                $(this).dialog("close");
                location.reload();
            }
        },
    });
    // 设置对话框的样式
    dialogContent.closest('.ui-dialog').css('background-color', '#ddd');
}
function closeWin() {
    try {
        window.opener = window;
        var win = window.open("", "_self");
        win.close();
        top.close();
    } catch (e) {
    }

}
async function start() {
    //保存配置
    console.log("初始化...")
    if (checkLocalStorageKey('studentID') && checkLocalStorageKey('password') && checkLocalStorageKey('ISP')) {
        console.info('学号和密码未填写完整');
        showAlertWithUserInput();
    }else {
        // 找到账号输入框
        var IDInput = $('input[name="DDDDD"]');
        IDInput.val(localStorage.getItem('studentID'));
        // 找到密码输入框
        var passwordInput = $('input[type=password]');
        passwordInput.val(localStorage.getItem('password'));
        // 找到 name 属性为 'ISP_select' 的下拉选择框元素并选择 '中国移动' 的项
        var num = localStorage.getItem('ISP')
        $('select[name="ISP_select"] option:eq('+num+')').prop('selected', true);
        // 找到 name 属性为 '0MKKey' 的输入框元素并进行点击操作
        $('input[name="0MKKey"]').click();
        // 查找带有特定 ID 的 div 元素
        var divElement = document.querySelector('#message');
        // 检查 div 元素是否存在并且文本内容为 "登录成功"
        if (divElement && divElement.textContent.trim() === "登录成功") {
            // 关闭网页
            closeWin()
        }
        if (divElement && divElement.textContent.trim() === "AC认证失败") {
            // 关闭网页
            closeWin()
        }
    }

}