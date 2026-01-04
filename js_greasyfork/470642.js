// ==UserScript==
// @name            知乎网页优化
// @description     1.首页避免自动跳转到登录页。
// @namespace       f65l3ph5oz93x1j23128sh1tp0ban7ce
// @author          ejin
// @match         https://*.zhihu.com/signin*
// @version         2023.09.14.3
// @run-at document-start
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/470642/%E7%9F%A5%E4%B9%8E%E7%BD%91%E9%A1%B5%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/470642/%E7%9F%A5%E4%B9%8E%E7%BD%91%E9%A1%B5%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

// 20230914 优化逻辑
// 20230712 避免首页自动跳转到登录页
//签到
(function(){
    //避免首页自动跳转到登录页，直接跳转到-
    if ( location.href=="https://www.zhihu.com/signin?next=%2F" ){
        location.href="/explore";
    }
})()