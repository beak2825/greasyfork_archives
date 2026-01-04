// ==UserScript==
// @name         桂林电子科技大学校园网自动登录（北海）
// @namespace    http://tampermonkey.net/
// @version      21.10.21
// @description  根据桂林理工校园网自动登录0.01版本修改，查阅网上各种资料，现在都略懂JS了，感谢前辈！
// @author       NPC老李  https://space.bilibili.com/73740357
// @match        http://192.168.5.212/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434170/%E6%A1%82%E6%9E%97%E7%94%B5%E5%AD%90%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%EF%BC%88%E5%8C%97%E6%B5%B7%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/434170/%E6%A1%82%E6%9E%97%E7%94%B5%E5%AD%90%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%EF%BC%88%E5%8C%97%E6%B5%B7%EF%BC%89.meta.js
// ==/UserScript==

(function() {

//先填写个人学号密码
    var username = '学号';
    var password = '密码';



    setTimeout(() => {


        if (document.getElementsByClassName('form-item')[0])
        {
            document.getElementsByClassName('form-item')[0].value = username;
        }

        if (document.getElementsByClassName('form-item')[1])
        {
            document.getElementsByClassName('form-item')[1].value = password;
        }
  
        if (document.getElementsByClassName('submit layui-bg-blue')[0].click() && document.getElementsByClassName('submit btn-yellow is-active')[0].id !== 'online')
        {
            document.getElementsByClassName('submit layui-bg-blue')[0].click()
        }


    }, 500);
})();