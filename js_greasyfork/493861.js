// ==UserScript==
// @name         自动输入密码123456
// @namespace    http://tampermonkey.net/
// @version      2024年4月30日
// @description  这是一个还在测试的输入验证码功能
// @author       Kinjaz
// @match        http://mail.uctu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=uctu.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493861/%E8%87%AA%E5%8A%A8%E8%BE%93%E5%85%A5%E5%AF%86%E7%A0%81123456.user.js
// @updateURL https://update.greasyfork.org/scripts/493861/%E8%87%AA%E5%8A%A8%E8%BE%93%E5%85%A5%E5%AF%86%E7%A0%81123456.meta.js
// ==/UserScript==

(function() {
    $('#rcmloginpwd').val('123456');
    $(document).ready(function() {
        setTimeout(function() {
            $('#messagelist tbody tr.message').each(function() {
                var $row = $(this); // 当前行元素
                // 提取当前行中的 subject 内容
                var subjectContent = $row.find('.subject span.subject')[0].innerText
                console.log('第'+$row+'行'+subjectContent);
                // 为当前行的 .subject 元素添加点击事件
                //$row.find('.subject span.subject').click(function() {
                $row.click(function() {
                    console.log('当前行内容被点击:', subjectContent);
                    // 在这里可以执行你想要的操作，比如复制当前行的内容等
                    // 这里暂时只输出内容到控制台，你可以根据需要修改此处的代码
                    var str = subjectContent;
                    var matches = str.match(/\d+/);
                    if (matches) {
                        // 获取要显示的数字
                        var number = "";
                        number = matches[0];
                        console.log(number); // 输出 "9363"
                        alert(number);
                    } else {
                        console.log("未找到数字");
                        alert("未找到数字");
                    }
                });
            });
        }, 2000); // 等待两秒后执行
    });
})();

