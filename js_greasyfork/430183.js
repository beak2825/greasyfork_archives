// ==UserScript==
// @name         把德克里特堡查个天翻地覆！
// @namespace    https://space.bilibili.com/57935837/dynamic
// @version      0.1
// @description  仅对环球网的全球联署活动有效
// @author       huoshan
// @match        http://wxapi.junpinghui.com/huanqiutou/index.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430183/%E6%8A%8A%E5%BE%B7%E5%85%8B%E9%87%8C%E7%89%B9%E5%A0%A1%E6%9F%A5%E4%B8%AA%E5%A4%A9%E7%BF%BB%E5%9C%B0%E8%A6%86%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/430183/%E6%8A%8A%E5%BE%B7%E5%85%8B%E9%87%8C%E7%89%B9%E5%A0%A1%E6%9F%A5%E4%B8%AA%E5%A4%A9%E7%BF%BB%E5%9C%B0%E8%A6%86%EF%BC%81.meta.js
// ==/UserScript==

(function() {
    var 等待时间 = 5000; //不要调得太小，以防止对宽带和网站服务器造成太大的压力！！太小会被判定为作弊！！
    var times = localStorage.times; //获取已运行的次数
    while (isInteger(parseFloat(times))!=true){
        times=1; //如果获取失败就重新计次
    }
    todo(); //跑起来
    function todo(){
        console.log("开始执行第  "+ (times) +"  次签名")
        times++
        localStorage.times=times//更新运行次数
        //btnOnClick()//签名
        delCookie()//清除签名标记
        setTimeout(function () {
            reload();//重载页面后就相当于重新运行此脚本
        }, 等待时间);
    }
    //清除cookie中的签名标记
    function delCookie(){
        localStorage.removeItem("is_sign");
    };
    //提交表单
    function btnOnClick(){
        document.getElementsByClassName("sign_btn")[0].click()
    }
    //强制重载页面
    function reload(){
        location.reload(true);
    };
    //判断是否是整数
    function isInteger(obj) {
        return typeof obj === 'number' && obj%1 === 0
    }
})();