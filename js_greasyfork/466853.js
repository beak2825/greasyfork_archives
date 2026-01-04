// ==UserScript==
// @name               (新商盟)①跳密码提示+②跳目录订单+③跳黑龙江登陆页+④目录订单和购物车排序+⑤清空回目录订单+⑥删除自动确认
// @name:zh-CN         sally
// @description:zh-CN  sally
// @version            24.3.8
// @match              *://*.xinshangmeng.com/*
// @run-at             document-start
// @grant              GM_openInTab
// @namespace          https://greasyfork.org/users/466853
// @license            MIT
// @description A simple mouse gesture script
// @downloadURL https://update.greasyfork.org/scripts/466853/%28%E6%96%B0%E5%95%86%E7%9B%9F%29%E2%91%A0%E8%B7%B3%E5%AF%86%E7%A0%81%E6%8F%90%E7%A4%BA%2B%E2%91%A1%E8%B7%B3%E7%9B%AE%E5%BD%95%E8%AE%A2%E5%8D%95%2B%E2%91%A2%E8%B7%B3%E9%BB%91%E9%BE%99%E6%B1%9F%E7%99%BB%E9%99%86%E9%A1%B5%2B%E2%91%A3%E7%9B%AE%E5%BD%95%E8%AE%A2%E5%8D%95%E5%92%8C%E8%B4%AD%E7%89%A9%E8%BD%A6%E6%8E%92%E5%BA%8F%2B%E2%91%A4%E6%B8%85%E7%A9%BA%E5%9B%9E%E7%9B%AE%E5%BD%95%E8%AE%A2%E5%8D%95%2B%E2%91%A5%E5%88%A0%E9%99%A4%E8%87%AA%E5%8A%A8%E7%A1%AE%E8%AE%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/466853/%28%E6%96%B0%E5%95%86%E7%9B%9F%29%E2%91%A0%E8%B7%B3%E5%AF%86%E7%A0%81%E6%8F%90%E7%A4%BA%2B%E2%91%A1%E8%B7%B3%E7%9B%AE%E5%BD%95%E8%AE%A2%E5%8D%95%2B%E2%91%A2%E8%B7%B3%E9%BB%91%E9%BE%99%E6%B1%9F%E7%99%BB%E9%99%86%E9%A1%B5%2B%E2%91%A3%E7%9B%AE%E5%BD%95%E8%AE%A2%E5%8D%95%E5%92%8C%E8%B4%AD%E7%89%A9%E8%BD%A6%E6%8E%92%E5%BA%8F%2B%E2%91%A4%E6%B8%85%E7%A9%BA%E5%9B%9E%E7%9B%AE%E5%BD%95%E8%AE%A2%E5%8D%95%2B%E2%91%A5%E5%88%A0%E9%99%A4%E8%87%AA%E5%8A%A8%E7%A1%AE%E8%AE%A4.meta.js
// ==/UserScript==


//23.8.31跳转到广西新商盟改为跳转到四川新商盟

//①登录页自动关闭修改密码的提示
if (window.location.href.includes("xinshangmeng.com") && window.location.href.includes("Version=")) {

    //关闭修改密码提示,使用setInterval函数来定期检查,如果找到元素,点击,并停止定期检查,如10次检查后仍没有找到元素，自动停止定期检查
    var myMaxAttempts = 100;
    var myAttempts = 0;
    var myintervalId = setInterval(function() {
        myAttempts++;
        if (myAttempts >= myMaxAttempts) {
            clearInterval(myintervalId);
        } else {
            var nextModifyElement = document.querySelector('#nextModify');
            if (nextModifyElement) {
                nextModifyElement.click();
                clearInterval(myintervalId);
            }
        }
    }, 200);
}



//②自动点击进入目录订单页面(订购页面)
if (window.location.href.includes("home.xinshangmeng.com/home")) {//仅在网址包含"https://home.xinshangmeng.com/home"才运行下面代码
    setTimeout(function() {
        var maxAttempts = 20;
        var attempts = 0;
        var IntervalId = setInterval(function() {
            attempts++;
            if (attempts >= maxAttempts) {
                clearInterval(IntervalId);
            } else {
                var tipElement = document.querySelector('.cmd-1');
                if (tipElement) {
                    tipElement.click();
                    clearInterval(IntervalId);
                }
            }
        }, 200);
    }, 50);
}



//③账号退出后,自动跳转回黑龙江入口登录页
if (["https://www.xinshangmeng.com/xsm2/", "http://www.xinshangmeng.com/xsm2/", "https://www.xinshangmeng.com/xsm6/", "http://www.xinshangmeng.com/xsm2/"].includes(window.location.href)) {
    window.location.replace("https://hl.xinshangmeng.com/");
}


//④所有新商盟目录订单和购物车按可用量排序2次
setTimeout(function (){
    for (let i = 0; i < 2; i++) {
        document.querySelectorAll("span#qty-lmt-h, span#kyl-btn").forEach(el => el.click());
    }
},100);

//⑤清空购物车后自动回到目录订单
setTimeout(function() {
    document.querySelector('#content > div.xsm-gboxone.textdg.fl > div.f14.lineh40.pl10.textmg > div > p:nth-child(2) > input, #alertBtn').click();
}, 200);


//⑥监听购物车所有"删除按钮"===如果点删除--触发自动点确定
document.addEventListener('click', function(event) {
    if (event.target.matches('.delCgt')) {
        setTimeout(function() {
            var button = document.querySelector('input.ui_button[type="button"][value="确定"]');
            if (button) {
                button.click();
            }
        }, 150);
    }
});