// ==UserScript==
// @name            自动领取在线经验
// @name:en         Qidian Auto Exp
// @namespace       kw13202
// @version         0.0.2
// @include         *://my.qidian.com/level
// @author          kw13202
// @description     保持页面打开状态，脚本会自动触发领取方法，不用手动领取（起点服务器竟然还存着这时间，不怕服务器资源浪费吗）
// @description:en  help Qidian auto get Exp
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/387971/%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96%E5%9C%A8%E7%BA%BF%E7%BB%8F%E9%AA%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/387971/%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96%E5%9C%A8%E7%BA%BF%E7%BB%8F%E9%AA%8C.meta.js
// ==/UserScript==
; (function () {
    //因为起点页面已经有JQuery引用，故不用@require     http://code.jquery.com/jquery-1.11.0.js
    'use strict';	//启用严格模式

    var cookie = new Object();
    var xmlhttp = null;

    console.log("自动领取start");
    var csrfToken = getCookie("_csrfToken")
    console.log("Token：" + csrfToken);


    var getExp = function () {
        console.log("进入定时器方法")
        let button = window.document.getElementsByClassName("elGetExp")[0];
        if (button) {
            console.log("进行ajax请求")
            var num = button.attributes["data-num"].value;
            let url = `${location.protocol}//my.qidian.com/ajax/Score/Receive?_csrfToken=${csrfToken}&referObject=${num}`;
            console.log("ajax：" + url)
            var obj = {
                url: url,
                method: "GET",
                async: true,
                success: function () {
                    console.log("ajax请求成功");
                    location.reload(true);
                }
            }
            ajaxSend(obj);
        } else {
            console.log("没找到领取按钮，继续等待1分钟");
        }
    };
    let timeIndex = window.setInterval(getExp, 60000);
    console.log("启动定时器" + timeIndex);
    getExp();

    function ajaxCreate() {
        if (!xmlhttp) {
            xmlhttp = new XMLHttpRequest();
        }
    }

    function ajaxSend(obj) {
        console.log("ajax start")
        ajaxCreate();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    obj.success(xmlhttp.responseText);
                } else {
                    console.error('请求失败', xmlhttp);
                }
            }
        }
        xmlhttp.open(obj.method, obj.url, obj.async);
        xmlhttp.send(obj.data);
        console.log("ajax send")
    };

    function getCookie(name) {
        if (cookie[name]) {
            return cookie[name];
        } else {
            var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
            var arr = document.cookie.match(reg);
            if (arr) {
                cookie[name] = unescape(arr[2]);
                return cookie[name];
            } else {
                return null;
            }
        }
    };

})();