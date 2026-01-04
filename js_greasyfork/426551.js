// ==UserScript==
// @name         node-web(https://www.youneed.win/free-ssr)
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  获取ssr
// @author       qibao
// @match        https://www.youneed.win/free-ssr
// @require      https://cdn.bootcss.com/jquery/1.7.1/jquery.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/426551/node-web%28https%3Awwwyouneedwinfree-ssr%29.user.js
// @updateURL https://update.greasyfork.org/scripts/426551/node-web%28https%3Awwwyouneedwinfree-ssr%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('#post-box > div > section > div:nth-child(7) > table > thead > tr > th:nth-child(1)').live('click', function() {
        if (!confirm("确认收集？")) {
            return;
        }
        alert("开始收集。");
        let data = [];
        $('#post-box > div > section > div:nth-child(7) > table > tbody > tr').each(function(){
            let host = $(this).find('td').eq(1).text();
            let port = $(this).find('td').eq(2).text();
            let password = $(this).find('td').eq(3).text();
            let method = $(this).find('td').eq(4).text();
            let protocol = $(this).find('td').eq(5).text();
            let obfs = $(this).find('td').eq(6).text();
            let o = {};
            o.host = host;
            o.port = parseInt(port);
            o.password = password;
            o.method = method;
            o.protocol = protocol;
            o.obfs = obfs;
            o.protocolParam = "WWW.YOUNEED.WIN";
            o.obfsParam = "WWW.YOUNEED.WIN";
            data.push(o);
        });
        if (data.length == 0) {
            console.info('长度为0，中止上传。');
            return;
        }
        let tag = "youneed";
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://node-web.chenweiwen.top:57443/ssr/push?token=4NivA2SEhEo1pBSv5XMvVzzHtNAkcsVh',
            headers: {'Content-Type': 'application/json;charset=UTF-8'},
            data: JSON.stringify({
                tag: tag,
                nodes: data
            }),
            onload: function(data) {
                let res = JSON.parse(data.response);
                alert(res.msg);
            }
        });
    });
})();