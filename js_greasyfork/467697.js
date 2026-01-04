// ==UserScript==
// @name         自用GPT-token
// @namespace    zhou_jianlei
// @version      0.3
// @description  本地GPT 公司内网自用 安装油猴插件后使用。
// @author       zhou_jianlei
// @match        http://192.168.8.97:8018/*
// @icon         http://192.168.8.97:8018/apple-touch-icon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467697/%E8%87%AA%E7%94%A8GPT-token.user.js
// @updateURL https://update.greasyfork.org/scripts/467697/%E8%87%AA%E7%94%A8GPT-token.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var url = 'http://192.168.8.97:8018/'
    var expiration_date = '2023-06-30 14:00:00';
    var date = new Date(expiration_date);
    //判断date 与当前时间比较
    if (date < new Date()) {
        console.info('token 已过期');
        return;
    }
    // 创建日期格式字符串
    var dateString = date.toGMTString();
    //access-token
    var access_token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1UaEVOVUpHTkVNMVFURTRNMEZCTWpkQ05UZzVNRFUxUlRVd1FVSkRNRU13UmtGRVFrRXpSZyJ9.eyJodHRwczovL2FwaS5vcGVuYWkuY29tL3Byb2ZpbGUiOnsiZW1haWwiOiJ6aGFveGluX3dvcmtAc2luYS5jbiIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlfSwiaHR0cHM6Ly9hcGkub3BlbmFpLmNvbS9hdXRoIjp7InVzZXJfaWQiOiJ1c2VyLUtIc25PZlRLckNjSUhZVG5GakxLNjZsbyJ9LCJpc3MiOiJodHRwczovL2F1dGgwLm9wZW5haS5jb20vIiwic3ViIjoiYXV0aDB8NjNlNWZmMjJkYjcxZDZlYTMwYTBkY2VhIiwiYXVkIjpbImh0dHBzOi8vYXBpLm9wZW5haS5jb20vdjEiLCJodHRwczovL29wZW5haS5vcGVuYWkuYXV0aDBhcHAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTY4NjkwMzg4MSwiZXhwIjoxNjg4MTEzNDgxLCJhenAiOiJUZEpJY2JlMTZXb1RIdE45NW55eXdoNUU0eU9vNkl0RyIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgbW9kZWwucmVhZCBtb2RlbC5yZXF1ZXN0IG9yZ2FuaXphdGlvbi5yZWFkIG9yZ2FuaXphdGlvbi53cml0ZSJ9.CnjxLSmmE7jaVq5Fdrt3T9dFRN4n5tMOmyR1ukI1HhXv4zW1ipyowSrsOr5vSqpGUy2u9QIqTGmdcZnfU-Yg81QpjliEokWEaKaPlf-X_zxnrL2Z614qy1TgpzhNA9VnUchw86ZNiFac71WiTBTj6NgmlZJI1TBLkBsMn3UbTIHS_Eogv3FbU0-tG2mAsjEFvGSO2bgLWwXFggtphd88_2I7-4c4Ro6-BrSzLtrLZaOVTWRtWcZt2IhRdlvbn7TQCG6evoI68GSnae32ZJAvDYXCPTE_HJZiUs2ngWQlD86vgwTzbe8oW1nQZeA5Y_eL8liGT4HruLeDZLpOCXhP-A';

    var token = getCookie('access-token');
    if (token == null) {
        console.info('token 不存在');
        document.cookie = "access-token=" + access_token + "; expires=" + dateString + "; path=/";
        console.info('token 已设置');
        window.location.replace(url)
    } else {
        console.info('token 存在 重新设置')
        document.cookie = "access-token=" + access_token + "; expires=" + dateString + "; path=/";
    }
    //获取cookies函数 name，cookie名字
    function getCookie(name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    }
})();