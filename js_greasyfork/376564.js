// ==UserScript==
// @name        妖火自动发吹牛
// @namespace   http://yaohuo.me/
// @supportURL  http://blog.zgcwkj.cn
// @version     20240607.01
// @description 妖火论坛自动发吹牛，让您的妖精尽快挥霍一空！
// @author      zgcwkj
// @match       *://yaohuo.me/games/chuiniu/add*
// @match       *://www.yaohuo.me/games/chuiniu/add*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/376564/%E5%A6%96%E7%81%AB%E8%87%AA%E5%8A%A8%E5%8F%91%E5%90%B9%E7%89%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/376564/%E5%A6%96%E7%81%AB%E8%87%AA%E5%8A%A8%E5%8F%91%E5%90%B9%E7%89%9B.meta.js
// ==/UserScript==

(function () {
    //注入一个按钮
    var isStart = localStorage.getItem('zgcwkjAutoChuiniuAdd') === "true";
    var button = document.createElement('button');
    button.textContent = '开始自动吹牛';
    if (isStart) button.textContent = '关闭自动吹牛';
    button.addEventListener('click', function () {
        localStorage.setItem('zgcwkjAutoChuiniuAdd', !isStart);
        //window.location.href = '/games/chuiniu/book_list.aspx';
        location.reload();
    });
    document.body.insertBefore(button, document.body.firstChild);
    //延迟执行
    setTimeout(() => {
        //发吹牛逻辑
        if (!isStart) return;
        if (document.title.indexOf("密码") != -1) {
            console.log("输入密码");
            return;
        }
        if (document.title.indexOf("公开挑战") == -1) {
            console.log("不该运行");
            return;
        }
        //页面上所有输入组件
        var toHtml_input = document.getElementsByTagName("input");
        //console.log(toHtml_input.length);
        if (toHtml_input.length != 0) {
            //==>随机妖晶（删掉的话，那么默认就是500）
            var yaojing = 500 + Math.ceil(Math.random() * 10);
            toHtml_input[0].value = yaojing;
            //==>随机妖晶（删掉的话，那么默认就是500）
            toHtml_input[1].value = "我是吹牛逼大神！";
            toHtml_input[2].value = "不是";
            toHtml_input[3].value = "当然";
            //==>随机答案（删掉的话，那么默认就是答案一）
            var toHtml_select = document.getElementsByTagName("select");
            toHtml_select[0].value = Math.ceil(Math.random() * 2);
            //==>随机答案（删掉的话，那么默认就是答案一）
            toHtml_input[toHtml_input.length - 1].click();//确定按钮
        } else {
            setTimeout(function () {
                window.location.href = '/games/chuiniu/add.aspx';
            }, '2000');
        }
    }, 300);
})();