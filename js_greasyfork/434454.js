// ==UserScript==
// @name         微博群聊自动抢红包
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  只能用于m.weibo.cn的群聊，因为pc网页无法显示手机红包
// @author       @一只蠢狗君
// @match        https://m.weibo.cn/message/chat*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/434454/%E5%BE%AE%E5%8D%9A%E7%BE%A4%E8%81%8A%E8%87%AA%E5%8A%A8%E6%8A%A2%E7%BA%A2%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/434454/%E5%BE%AE%E5%8D%9A%E7%BE%A4%E8%81%8A%E8%87%AA%E5%8A%A8%E6%8A%A2%E7%BA%A2%E5%8C%85.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var id = "4524720329230254";   //配置指定群，然后把页面挂在那个群里，刷新一下启动
    var yiqianghongbao = [ ];
    GM_setValue('yiqianghongbao',yiqianghongbao);

function qianghongbao(){
     GM_xmlhttpRequest(
        {
        method:'get',
        url:'https://m.weibo.cn/api/groupchat/list?count=10&gid=' + id,
        headers:{'Referer': 'https://m.weibo.cn/message/chat?gid='+ id + '&name=msgbox'},
        onload:function (response) {
            let rsp = JSON.parse(response.responseText);
            for(let n=0; n < 10; n++){
                let media_type = rsp["data"]["msgs"][n]["media_type"];
                if(media_type == 13){
                    let url_long = rsp["data"]["msgs"][n]["url_objects"][0]["info"]["url_long"];
                    if(/mall.e.weibo.com/.test(url_long) == true){
                        let exist_or_not = GM_getValue('yiqianghongbao').find(item => item == url_long);
                        if (exist_or_not == undefined) {
                            window.open(url_long);
                            let a = GM_getValue('yiqianghongbao');
                            a.push(url_long);
                            GM_setValue('yiqianghongbao',a);
                        };
                        };
                };
            };
        }
        });
}
setInterval(qianghongbao, 1000);
})();