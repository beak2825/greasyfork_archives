// ==UserScript==
// @name Encryption Page
// @namespace Violentmonkey Scripts
// @version 0.1
// @description 加密你的网站，在网站未加载前输入密码。
// @run-at document-start
// @author 真心
// @include 网站请自行添加。
// @include 每行一个。
// @include 可自由增加。
// @include 无上限。
// @include 下方网站为测试网站，可访问http://encryption-test.iqianye.cn/测试效果。
// @include encryption-test.iqianye.cn
// @downloadURL https://update.greasyfork.org/scripts/371250/Encryption%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/371250/Encryption%20Page.meta.js
// ==/UserScript==
// 
// 加密你的网站，在网站未加载前输入密码。
// 重要：如出现在网页加载完成才显示密码输入框的情况，请在设置页将运行时间切换为：document-start
// 本脚本不可直接使用，需设置生效页面。
// 设置方法：
// 编辑代码，在// @include后方添加您的网站，一行一个。可无限叠加。
// 如有任何问题请联系QQ：1307993674

loopy()
function loopy() {
    var sWord =""
    while (sWord != "123") {//此处为密码，修改123为任何字符即可修改密码。
        sWord = prompt("输入正确密码才能登陆!")
    }
    alert("AH…欢迎光临！")
}