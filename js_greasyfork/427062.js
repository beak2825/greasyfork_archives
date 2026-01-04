// ==UserScript==
// @name         获取上海华新仓下所有工号
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  hello world~
// @author       王饱饱
// @match        https://sxz.zjs.com.cn/
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/427062/%E8%8E%B7%E5%8F%96%E4%B8%8A%E6%B5%B7%E5%8D%8E%E6%96%B0%E4%BB%93%E4%B8%8B%E6%89%80%E6%9C%89%E5%B7%A5%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/427062/%E8%8E%B7%E5%8F%96%E4%B8%8A%E6%B5%B7%E5%8D%8E%E6%96%B0%E4%BB%93%E4%B8%8B%E6%89%80%E6%9C%89%E5%B7%A5%E5%8F%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var prefix = 'idToken='
    var start = document.cookie.indexOf(prefix);
    var end = document.cookie.indexOf(";", start + prefix.length);
    var idToken = document.cookie.substring(start + prefix.length,end);
    console.log(idToken);

    $.ajax({
        type: 'POST',
        url: 'https://sxz.zjs.com.cn:10002/zwmsapi/setting/v2/userinfoController/selectUserinfos',
        data: JSON.stringify({'isEnable': 1,'limit': 300,'page': 1,'pkWarehouse': '2156960184101763510'}),
        dataType:'json',
        headers: {
            idToken:idToken,
            equipmentId: '318646ywfwpt-pc',
            user: '318646',
            'Content-Type': 'application/json;charset=UTF-8'
        },
        success: (res) => {
           console.log(res.body.list);
            let list = [];
            for(let i in res.body.list) {
             list.push(res.body.list[i].jobNumber);
            }
            console.log(list);
        }
    });
})();