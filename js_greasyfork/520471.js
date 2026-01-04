// ==UserScript==
// @name         op_release_token
// @namespace    https://www.midu.com/
// @version      2024-12-11.5
// @description  推送op token到7.89虚拟机的flaskApi
// @author       You
// @match        https://op.miduchina.com/oalogin/?accessToken=*
// @icon         https://www.midu.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @connect      172.17.7.89
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520471/op_release_token.user.js
// @updateURL https://update.greasyfork.org/scripts/520471/op_release_token.meta.js
// ==/UserScript==



(function() {
    'use strict';
    var url_params = window.location.href.split('accessToken=')
    var token = url_params[url_params.length - 1]
    /*正式接口*/
    var api_url = 'http://172.17.7.89:8080/api/op?token='+token;
    /*测试接口*/
    //var api_url = 'http://127.0.0.1:9527/api/op?token='+token;
    //var api_url = 'http://10.10.249.189:9527/api/op?token=VzdNWnMrMjJvNzMzN0E3WnZTeEtybW1LK01tOGN6N2hhOXo0Q0k4Z0lTWmEzZWpCZVAzSUpRdXR4Mll3MjZQZTQ4anh1YWxmVXRwcDJnSW9TYU5QRWtvSjA3REJwOEFJTGNxOW9zbTBxWXZPOXZSSDRWK0dxaitVY0MwZDROUng=&expiry=2024-12-12%2018:44:01'
    console.log(api_url)
    GM_xmlhttpRequest({
        method: "GET",
        url: api_url,
        timeout: 5000,
        onload: function(response) {
            console.log('进入请求处理')
            var response_json = JSON.parse(response.responseText);
            var mess = response_json.mess
            // 处理返回值
            if (response.status === 200) {
                alert('推送请求成功: '+mess);
            } else {
                alert('推送请求失败: '+mess);
            }
        },
        onerror: function(err){
            alert('推送请求错误:'+err);
        },
        ontimeout: function(err){
            alert('推送请求超时');
        }
    });
})();


