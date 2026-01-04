// ==UserScript==
// @name         获取ss（youneed）
// @namespace    http://tampermonkey.net/
// @version      0.1.10
// @description  try to take over the world!
// @author       You
// @match        https://www.youneed.win/free-ss
// @match        https://www.chenweiwen.top:57443/youneed.html
// @require      https://cdn.bootcss.com/jquery/1.7.1/jquery.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/396407/%E8%8E%B7%E5%8F%96ss%EF%BC%88youneed%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/396407/%E8%8E%B7%E5%8F%96ss%EF%BC%88youneed%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('#post-box > div > section > div > table > thead > tr > th:nth-child(5)').live('click', function() {
        let data = [];
        $('#post-box > div > section > div > table > tbody > tr').each(function(){
            let host = $(this).find('td').eq(1).text();
            let port = $(this).find('td').eq(2).text();
            let password = $(this).find('td').eq(3).text();
            let method = $(this).find('td').eq(4).text();
            let o = {};
            o.host = host;
            o.port = parseInt(port);
            o.password = password;
            o.method = method;
            data.push(o);
        });
        console.info(data);
        if (data.length == 0) {
            console.info('长度为0，中止上传。');
            return;
        }
        let tag = prompt('请输入tag：');
        if (tag == null) {
            return;
        }
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://ss.chenweiwen.top:57443/pushSsList?token=s3GhlfQ3LbD2DaFXcjyWRpRnOWRdVhmq',
            headers: {'Content-Type': 'application/json;charset=UTF-8'},
            data: JSON.stringify({
                tag: tag,
                ssInfos: data
            }),
            onload: function(data) {
                let res = JSON.parse(data.response);
                alert(res.msg);
            }
        });
    });
})();