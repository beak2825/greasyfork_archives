// ==UserScript==
// @name         AppleCardPickup
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  苹果卡订单快速整理!
// @author       Beyond
// @match        *://card.jd.com/order/order_detail.action?orderId=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381515/AppleCardPickup.user.js
// @updateURL https://update.greasyfork.org/scripts/381515/AppleCardPickup.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var html = "";
    html += '<div id="logContent"><label><input type="radio" name="price" value="50" checked> 50</label><label><input type="radio" name="price" value="100"> 100</label><label><input type="radio" name="price" value="200"> 200</label><label><input type="radio" name="price" value="500"> 500</label><label><input type="radio" name="price" value="1000"> 1000</label><button id="getCode">获取卡号卡密</button><button id="copyCode">一键复制</button><textarea id="msgText" style="width:100%" rows="8"></textarea></div>';
    $('.mc .fore').parent().prepend(html);
    $('#getCode').click(GetCode);
    $('#copyCode').click(CopyCode);
    function GetCode() {
        var trList = $(".fore .p-list table tbody").children("tr")
        var msg = "";
        var value =$('input[name="price"]:checked').val();
        for (var i = 0; i < trList.length; i++) {
            if (i != 0) {
                var tdArr = trList.eq(i).find("td");
                var no = tdArr.eq(0)[0].innerText;//序号
                var code = tdArr.eq(1).find('span')[0].innerText;//卡号
                var pwd = tdArr.eq(2).find('span')[0].innerText;//密码
                msg += code + "+" + pwd+"\t"+value + "\r\n";
            }
        }
        $('textarea').val(msg);
    }

    function CopyCode() {
        var area = document.getElementById("msgText");
        area.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
    }

})();