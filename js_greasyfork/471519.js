// ==UserScript==
// @name         南邮校园网自动登录
// @version      1.1
// @author       Alplune
// @namespace    alplune-auto-wifi
// @license      MIT
// @description  南京邮电大学校园网自动登录脚本
// @match        https://p.njupt.edu.cn/a79.htm
// @match        https://p.njupt.edu.cn
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/471519/%E5%8D%97%E9%82%AE%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/471519/%E5%8D%97%E9%82%AE%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
(function () {
    //下面三个参数需要你设置！！！
    const carrier = ""        //  njupt(默认)：""   移动:"@cmcc"  电信:"@njxy"
    const username = ""      // 帐号
    const password = ""     // 密码

    
    if (!username || !password) alert("请到脚本源码设定用户名和密码");
    const url = "https://p.njupt.edu.cn:802/eportal/portal/login?callback=dr1003&login_method=1&user_account=,0," + username + carrier + "&user_password=" + password + "&wlan_user_ip=&wlan_user_ipv6=&wlan_user_mac=000000000000&wlan_ac_ip=&wlan_ac_name=&jsVersion=4.1.3&terminal_type=1&lang=zh-cn&v=8554&lang=zh"

    // //法一 ：简单粗暴，不优雅
    // const a = document.createElement("a");
    // a.href = url;
    // a.click();

    //法二：MacOS在Edge不知道为什么不行
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        headers: { "Content-Type": "application/javascript; charset=utf-8" },
        fetch: true,
        onload: function (response) {
            alert("登录成功");
            // window.location.href = "https://cn.bing.com/"; //避免重复登录导致瞬间三个设备同时登录的状态
        },
        onerror: function (response) {
            alert(response);
        }
    });
})();