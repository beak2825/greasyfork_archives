// ==UserScript==
// @name        超管单点
// @namespace   lihuozi
// @match       *://*/admin/org/index
// @grant       none
// @version     1.4.1
// @author      李豁子
// @description 2021/7/12下午8:37:13
// @downloadURL https://update.greasyfork.org/scripts/430639/%E8%B6%85%E7%AE%A1%E5%8D%95%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/430639/%E8%B6%85%E7%AE%A1%E5%8D%95%E7%82%B9.meta.js
// ==/UserScript==
myFuncs = {};

myFuncs.init = function () {
    $(".datagrid-btable tr").each((i, el) => {
        console.log(i);
        var text = $(el).find('td:eq(2) div').html().split('（')[1];
        var account = text.substring(0, text.length - 1);
        $(el).find('td:eq(2)').dblclick(function () {
            myFuncs.toPage(account);
        });
    });
    $(".searchbox-button").click(function () {
        console.log('onhaschange');
        setTimeout("window.myFuncs.init()", 2000);
    });
    $('.linkbutton-group').dblclick(function () {
      myFuncs.toPage('admin');
    });
    alert("附魔成功！");
};

myFuncs.toPage = function (account) {
    var settings = {
        "url": "/api/services/Org/UserLoginIntegrationByUserLoginName",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "LoginName": account,
            "IPAddress": "127.0.0.1",
            "IntegrationKey": "46aa92ec-66af-4818-b7c1-8495a9bd7f17"
        }),
    };
    $.ajax(settings).done(function (res) {
        console.log(res);
        var url = location.origin + '/index.html?token=' + res.data;
        window.open(url);
    });
};
(function () {
    'use strict';
    try {
        window.myFuncs = myFuncs;
        setTimeout("window.myFuncs.init()", 3000);
    } catch (err) {
        console.log(err);
    }
})();