// ==UserScript==
// @name         HZAU自动思想测评
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  允许脚本，打开测评页面，刷新一次，自己提交
// @author       Ken
// @match        http://*/*
// @grant        none
// @include      http://xg.hzau.edu.cn/xg
// @downloadURL https://update.greasyfork.org/scripts/381600/HZAU%E8%87%AA%E5%8A%A8%E6%80%9D%E6%83%B3%E6%B5%8B%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/381600/HZAU%E8%87%AA%E5%8A%A8%E6%80%9D%E6%83%B3%E6%B5%8B%E8%AF%84.meta.js
// ==/UserScript==


(function() {
    //setTimeout(function(){ console.log(document.getElementsByClassName("col-xs-10").length); }, 3000);
    var start = new Date().getTime();
        //  console.log('休眠前：' + start);
        while (true) {
            if (new Date().getTime() - start > 2000) {//测试过，先预留2秒，防止加载不成功
                break;
            }
        }
    //获取
    window.addEventListener("load", function(event) {
    //console.log(document.getElementsByClassName('col-xs-10').length);
    var myCollection = document.getElementsByClassName("col-xs-10");
    //console.log(myCollection)
    //console.log(document.getElementsByClassName("col-xs-10").length);
    var i;
    for (i =1; i < myCollection.length; i++) {
        var num=Math.floor(Math.random()*50)+350;//表示 3.5基础分 加上一个随机值
        myCollection[i].value=(num/100).toFixed(2);//设置值，保留2位小数
 }
});
  }
)();