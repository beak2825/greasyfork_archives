// ==UserScript==
// @name         桂林电子科技大学校园网自动登录
// @namespace    http://tampermonkey.net/
// @version      21.4.7
// @description  根据桂林理工校园网自动登录0.01版本修改，查阅网上各种资料，现在都略懂JS了，感谢前辈！
// @author       NPC老李  https://space.bilibili.com/73740357
// @match        http://10.0.1.5/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424588/%E6%A1%82%E6%9E%97%E7%94%B5%E5%AD%90%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/424588/%E6%A1%82%E6%9E%97%E7%94%B5%E5%AD%90%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {

    var type1 = '';
    var type2 = '@telecom';
    var type3 = '@unicom';
    var type4 = '@cmcc';

//使用前请选择运营商以及填写账号密码

//type1 -> 校园网，type2 -> 中国电信，type3 -> 中国联通，type4 -> 中国移动
    var type = type1 ;
    var username = '此处填写账号';
    var password = '此处填写密码';



    setTimeout(() => {


        if (document.getElementsByClassName('edit_lobo_cell')[2])
        {
            document.getElementsByClassName('edit_lobo_cell')[2].value = username;
        }

        if (document.getElementsByClassName('edit_lobo_cell')[3])
        {
            document.getElementsByClassName('edit_lobo_cell')[3].value = password;
        }

        if (document.getElementsByClassName('edit_lobo_cell edit_select')[0])
        {
            document.getElementsByClassName('edit_lobo_cell edit_select')[0].value=type;
        }

        if (document.getElementsByClassName('edit_lobo_cell')[1] && document.getElementsByClassName('edit_lobo_cell')[1].name !== 'logout')
        {
            document.getElementsByClassName('edit_lobo_cell')[1].click();
        }


    }, 500);
})();