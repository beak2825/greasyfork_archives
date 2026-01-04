// ==UserScript==
// @name         nti56 qrcode dev hook token
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  二维码项目token放入localstorage便于复制
// @author       niushuai233
// @match        http://139.159.194.101/engineering/**
// @icon         http://139.159.194.101:21401/engineering/favicon.ico
// @require      https://unpkg.com/ajax-hook@2.0.3/dist/ajaxhook.min.js
// @license      GPL-3.0-only
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438018/nti56%20qrcode%20dev%20hook%20token.user.js
// @updateURL https://update.greasyfork.org/scripts/438018/nti56%20qrcode%20dev%20hook%20token.meta.js
// ==/UserScript==

(function() {
    'use strict';
    Date.prototype.format = function(fmt) {
        var o = {
            "M+" : this.getMonth()+1,                 //月份
            "d+" : this.getDate(),                    //日
            "h+" : this.getHours(),                   //小时
            "m+" : this.getMinutes(),                 //分
            "s+" : this.getSeconds(),                 //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S"  : this.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
        for(var k in o) {
            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
        return fmt;
    }

    ah.proxy({
        //请求发起前进入
        onRequest: (config, handler) => {
            // console.log(config.headers);
            var token = config.headers.authorization;

            if (token && token.length > 0) {
                window.localStorage.setItem('@qr token full', token);
                window.localStorage.setItem('@qr token', token.replace("Bearer ", ""));
                window.localStorage.setItem('@qr token reset time', new Date().format("yyyy-MM-dd hh:mm:ss"));
            }
            //var url_arr = config.url.split("?")
            //console.log(url_arr, new Date().toLocaleString())
            handler.next(config);
        },
        onError: (err, handler) => {
            console.log(err.type)
            handler.next(err)
        },
        //请求成功后进入
        onResponse: (response, handler) => {
            var res = response.response;
            //console.log(response)
            handler.next(response)
        }
    });
})();