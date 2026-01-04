// ==UserScript==
// @name         dogTopic
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  report dogTopic
// @author       111
// @match        https://www.bilibili.com/v/topic/detail?topic_id=36153*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      bilibili.com
// @downloadURL https://update.greasyfork.org/scripts/454007/dogTopic.user.js
// @updateURL https://update.greasyfork.org/scripts/454007/dogTopic.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var csrf = window.document.cookie.match(/bili_jct=(\w+)/)[1];
    scheduleTopic()
    setInterval(()=>{
        scheduleTopic()
    }, 300000);
 
    async function scheduleTopic(){
        console.log(new Date().getHours()+":"+new Date().getMinutes()+":"+new Date().getSeconds()+" schedule start");
        reportTopics(await getTopics())
 
        function getTopics() {
            return new Promise(resolve =>GM_xmlhttpRequest({
                url: 'https://app.bilibili.com/x/topic/web/details/cards?sort_by=3&page_size=20&source=Web&topic_id=36153',
                method: "GET",
                onload: function (data) {
                    resolve(JSON.parse(data.responseText).data.topic_card_list.items);
                }
            }));
        }
 
        function reportTopics(items) {
            //只举报一次，不用写for循环
            var oid = items[0].dynamic_card_item.id_str
            //过久的动态不举报
            var pub_ts = items[0].dynamic_card_item.modules.module_author.pub_ts * 1000
            if((new Date().getTime() - pub_ts) > 1000*60*60*24*3){
                console.log(new Date().getHours()+":"+new Date().getMinutes()+":"+new Date().getSeconds()+" 已经举报到了3天前的动态:"+oid+"请等待新动态发布");
                return
            }
            var log = " report topic,oid:"+oid
            GM_xmlhttpRequest({
                url: "https://app.bilibili.com/x/topic/resource/report",
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                data: 'topic_id=36153&res_type=0&res_id_str=' + oid + '&reason=话题不相关&csrf=' + csrf,
                onload: function (resp) {
                    var json = JSON.parse(resp.responseText)
                    var nowTime = new Date().getHours()+":"+new Date().getMinutes()+":"+new Date().getSeconds()
                    if (json.code == 0) {
                        console.log(nowTime+" success"+log)
                    }else {
                        console.log(nowTime+" error msg:"+json.message+log)
                    }
                }
            })
        }
    }
})();