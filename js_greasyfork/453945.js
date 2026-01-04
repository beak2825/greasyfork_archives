// ==UserScript==
// @name         dogTopic
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  report dogTopic
// @author       You
// @match        https://www.bilibili.com/v/topic/detail?topic_id=36153*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      bilibili.com
// @downloadURL https://update.greasyfork.org/scripts/453945/dogTopic.user.js
// @updateURL https://update.greasyfork.org/scripts/453945/dogTopic.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var topicId = 36153
    //cookie，bili_jct和csrf在bilibili是相同的值
    var csrf = window.document.cookie.match(/bili_jct=(\w+)/)[1];
    //定时任务间隔
    var scheduleTime = 1000*60*5
    //首次加载执行一次
    main()
    setInterval(()=>{
        main()
    }, scheduleTime);

    async function main(){
        console.log(new Date().getHours()+":"+new Date().getMinutes()+":"+new Date().getSeconds()+" schedule start");
        //用GM_setValue存储每次运行时间，防止多个标签重复多次运行
        var timeInterval = new Date().getTime()-GM_getValue("dogTopicTime",0);
        //运行间隔scheduleTime-500毫秒
        if(timeInterval < (scheduleTime - 500)){
            //console.log(new Date().getHours()+":"+new Date().getMinutes()+":"+new Date().getSeconds()+" 被拦截"+timeInterval);
            return
        }
        GM_setValue("dogTopicTime",new Date().getTime());

        //console.log(new Date().getHours()+":"+new Date().getMinutes()+":"+new Date().getSeconds()+" start");
        //return

        var topics= await getTopics();
        reportTopics(topics)

        function getTopics() {
            return new Promise(resolve =>GM_xmlhttpRequest({
                url: 'https://app.bilibili.com/x/topic/web/details/cards?sort_by=3&page_size=20&source=Web&topic_id='+topicId,
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
                data: 'topic_id=' + topicId + '&res_type=0&res_id_str=' + oid + '&reason=话题不相关&csrf=' + csrf,
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