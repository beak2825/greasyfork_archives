// ==UserScript==
// @name         B站主播后台助手
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  功能：一键导出单日直播礼物数据。使用方式：登录b站后进入用户中心，网页左下角会出现控制台。
// @author       小长长
// @include      /^https?:\/\/link\.bilibili\.com\/p\/center\/index(.*?)$/
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/424043/B%E7%AB%99%E4%B8%BB%E6%92%AD%E5%90%8E%E5%8F%B0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/424043/B%E7%AB%99%E4%B8%BB%E6%92%AD%E5%90%8E%E5%8F%B0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    function get_received_gift_list(d, csv, page_num) {
        var url = "https://api.live.bilibili.com/xlive/revenue/v1/giftStream/getReceivedGiftStreamList?page_num="+page_num+"&page_size=20&coin_type=0&gift_id=&begin_time="+d+"&uname=";
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onload = function () {
            var resp = JSON.parse(this.responseText);
            if (resp.data.list.length === 0) {
                download(`直播礼物统计${d}.csv`, csv);
            } else {
                for (var i in resp.data.list) {
                    var g = resp.data.list[i];
                    console.log(g);
                    csv += `${g.uid},${g.uname},${g.time},${g.gift_name},${g.gift_num},${g.hamster},${g.normal_gold},${g.silver},${g.gold}\n`;
                }
                get_received_gift_list(d, csv, page_num+1);
            }
        };
        xhr.withCredentials = true;
        xhr.send();
    }

    window.addEventListener('load', function() {
        var zNode = document.createElement ('div');
        zNode.innerHTML = '<tag>下载当日收益</tag><input type="date" id="input-date" value="YYYY-MM-DD"><button id="myButton">下载</button>';
        zNode.setAttribute ('id', 'myContainer');
        document.body.appendChild (zNode);

        //--- Activate the newly added button.
        document.getElementById ("myButton").addEventListener (
            "click", ButtonClickAction, false
        );

        function ButtonClickAction (zEvent) {
            var date = $('#input-date')[0].value;
            if (date === '') return;
            get_received_gift_list(date, "\ufeff送礼用户uid,送礼用户昵称,收礼时间,礼物名称,数量,金仓鼠数,金瓜子数,银瓜子数,gold\n", 1);
        }

        //--- Style our newly added elements using CSS.
GM_addStyle ( `
    #myContainer {
        position:               fixed;
        top:                    85%;
        left:                   0;
        font-size:              20px;
        background:             #4fc1e9;
        border:                 3px outset black;
        margin:                 5px;
        opacity:                0.8;
        z-index:                1100;
        padding:                5px 20px;
width: 200px;
    }
    #myButton {
        cursor:                 pointer;
    }
.ld-input {
width: 60px;
}
` );
    }, false);
})();