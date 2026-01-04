// ==UserScript==
// @name        妖火自动抢吹牛
// @namespace   http://yaohuo.me/
// @supportURL  http://blog.zgcwkj.cn
// @version     20240607.01
// @description 妖火论坛自动抢吹牛，让您的妖精变得毫无用途！
// @author      zgcwkj
// @match        *://yaohuo.me/games/chuiniu*
// @match        *://www.yaohuo.me/games/chuiniu*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/376566/%E5%A6%96%E7%81%AB%E8%87%AA%E5%8A%A8%E6%8A%A2%E5%90%B9%E7%89%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/376566/%E5%A6%96%E7%81%AB%E8%87%AA%E5%8A%A8%E6%8A%A2%E5%90%B9%E7%89%9B.meta.js
// ==/UserScript==

(function () {
    //注入一个按钮
    var isStart = localStorage.getItem('zgcwkjAutoChuiniu') === "true";
    var button = document.createElement('button');
    button.textContent = '开始自动抢吹牛';
    if (isStart) button.textContent = '关闭自动抢吹牛';
    button.addEventListener('click', function () {
        localStorage.setItem('zgcwkjAutoChuiniu', !isStart);
        window.location.href = '/games/chuiniu/index.aspx';
    });
    document.body.insertBefore(button, document.body.firstChild);
    //延迟执行
    setTimeout(() => {
        //抢吹牛逻辑
        if (!isStart) return;
        if (document.title.indexOf("密码") != -1) {
            console.log("输入密码");
            return;
        }
        if (document.title.indexOf("公开挑战") != -1) {
            console.log("防止和另一个插件冲突");
            return;
        }
        var toHtml_a = document.getElementsByTagName("a");
        //console.log(toHtml_a.length);
        if (toHtml_a.length == 2) {//被抢了
            toHtml_a[0].click();
        } else if (toHtml_a.length == 3 || toHtml_a.length == 4) {//抢到了
            var toHtml_input = document.getElementsByTagName("input");
            //console.log(toHtml_input.length);
            if (toHtml_input.length != 0) {
                //==>随机答案（删掉的话，那么默认就是答案一）
                var toHtml_select = document.getElementsByTagName("select");
                toHtml_select[0].value = Math.ceil(Math.random() * 2);
                //==>随机答案（删掉的话，那么默认就是答案一）
                toHtml_input[toHtml_input.length - 1].click();//确定按钮
            } else {
                toHtml_a[toHtml_a.length - 2].click();//返回上级
            }
        } else {//开始抢
            for (let i = 0; i < toHtml_a.length; i++) {
                var toHtml_a1 = (toHtml_a[i].innerHTML + "").match(/(?<=\().+?(?=妖晶\))/);
                if (toHtml_a1 != null) {
                    //console.log(toHtml_a1);
                    if (toHtml_a1 <= 500) {//某个范围抢
                        console.log("正在抢占吹牛");
                        toHtml_a[i].click();
                    }
                }
            }
            console.log("不符合条件，跳过");
            setTimeout(function () {
                window.location.href = '/games/chuiniu/index.aspx';
            }, '2000');
        }
    }, 300);
})();