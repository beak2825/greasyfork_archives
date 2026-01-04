// ==UserScript==
// @name         河洛农场商会任务自动点击
// @namespace    https://greasyfork.org/users/433510
// @version      0.1.1
// @description  限定河洛论坛专用，自动点击农场商会任务
// @author       lingyer
// @match        https://www.horou.com/plugin.php?id=jnfarm*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430188/%E6%B2%B3%E6%B4%9B%E5%86%9C%E5%9C%BA%E5%95%86%E4%BC%9A%E4%BB%BB%E5%8A%A1%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/430188/%E6%B2%B3%E6%B4%9B%E5%86%9C%E5%9C%BA%E5%95%86%E4%BC%9A%E4%BB%BB%E5%8A%A1%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const total = 100;

    var httpRequest = new XMLHttpRequest();
    var timenow = new Date();
    var formhash;
    var num;
    var tmp_str,tmp_ary;

    //获取formhash
    tmp_str = document.getElementById("jnland").innerHTML;
    //console.log(tmp_str);
    tmp_ary = tmp_str.match(/(?<=formhash=)[0123456789abcdef]{8}/g);
    //console.log(tmp_ary);
    formhash = tmp_ary[0];
    //console.log("formhash:" + formhash);

    //初始化
    num = 1;

    //开始
    console.log("开始自动点击商会任务。");
    setTimeout(quests, 2000);

    //第一步：建立所需的对象
    //var httpRequest = new XMLHttpRequest();
    //第二步：打开连接  将请求参数写在url中  true:请求为异步  false:同步
    //httpRequest.open('GET', './plugin.php?id=jnfarm&do=harvest&jfid=4&formhash=c855597c', true);
    //第三步：发送请求  将请求参数写在URL中
    //httpRequest.send();

    //sub_function area 以下为子函数定义区域


    function quests() {
        if (num <= total) {
            httpRequest.open("GET", "/plugin.php?id=jnfarm&do=guild&ac=feed&submit=true&timestamp=" + Math.floor(timenow.getTime()/1000) + "&formhash=" + formhash, true);
            httpRequest.send();
            num++;
            if ((num % 10) == 0) {
                console.log("点击" + num +"次。");
            }
            setTimeout(quests, 2000);
        } else {
            console.log("点击100次完成，退出脚本。");

        }
    }

})();