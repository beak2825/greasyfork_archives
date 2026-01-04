// ==UserScript==
// @name         KiraBot2
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  bilibili
// @author       You
// @match        https://www.bilibili.com/v/topic/detail*?topic_id=32780*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @license      AGPL-3.0
// @connect      bilibili.com
// @connect      gitee.com
// @downloadURL https://update.greasyfork.org/scripts/474456/KiraBot2.user.js
// @updateURL https://update.greasyfork.org/scripts/474456/KiraBot2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var topicId = 32780
    //cookie，bili_jct和csrf在bilibili是相同的值
    var csrf = window.document.cookie.match(/bili_jct=(\w+)/)[1];
    //schedule间隔
    var scheduleTime = 1000*60
    var getBlackListTime = 1000*60*10
    var sleepTime = 1000

    console.log(getCurrTime()+" kirabot start");
    //首次加载执行一次
    getBlackList()
    main()

    setInterval(()=>{main()}, scheduleTime);
    setInterval(()=>{getBlackList()}, getBlackListTime);

    async function main(){

        //用GM_setValue存储每次运行时间，防止多个标签重复多次运行
        var timeInterval = new Date().getTime()-GM_getValue("kiraTime",0);

        //运行间隔scheduleTime-500毫秒
        if(timeInterval < (scheduleTime - 500)){
            //console.log(getNowTime()+" 被拦截"+timeInterval);
            return
        }
        GM_setValue("kiraTime",new Date().getTime());

        //console.log(getNowTime()+" schedule start");

        //refresh blacklist
        if(Math.floor(Math.random()*10)==0){
            getBlackList()
        }

        var dynamics= spliceDynamicList(await getDynamicByUid());
        await sleep(sleepTime)
        var topics= await getTopics();
        await sleep(sleepTime)

        var blackList = new Set(GM_getValue('blackList',[]))
        checkTopics(topics,blackList)

        for(const dynamic of dynamics){
            var aid = dynamic.basic.comment_id_str
            var replyList = await getReply(aid,dynamic.basic.comment_type)
            await sleep(sleepTime)
            checkReply(replyList,dynamic.id_str,aid,blackList)
        }

        function getTopics() {
            return new Promise(resolve =>GM_xmlhttpRequest({
                url: 'https://app.bilibili.com/x/topic/web/details/cards?sort_by=3&page_size=20&source=Web&topic_id='+topicId,
                method: "GET",
                onload: function (data) {
                    resolve(JSON.parse(data.responseText).data.topic_card_list.items);
                }
            }));
        }
        function getDynamicByUid() {
            return new Promise(resolve =>GM_xmlhttpRequest({
                url: 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?offset=&host_mid=672353429&timezone_offset=-480',
                method: "GET",
                onload: function (data) {
                    resolve(JSON.parse(data.responseText).data.items);
                }
            }));
        }
        // 返回了12个，但是只需要检查其中几个。动态时间过去很久，减少该动态检查间隔
        function spliceDynamicList(items) {

            var dynamicList = items.splice(0,8)
            for (let i = 0; i < dynamicList.length; i++) {
                // 至少有2条动态
                if(i==0||i==1){
                    continue;
                }
                var hour = (new Date().getTime()/1000-dynamicList[i].modules.module_author.pub_ts)/60/60
                //超过24小时动态，10次循环执行一次
                if(hour>24&&Math.floor(Math.random()*10)!=0){
                    dynamicList.splice(i, 1);
                    i--;
                }
            }
            return dynamicList
        }
        function getReply(aid,type) {
            return new Promise(resolve =>GM_xmlhttpRequest({
                url: 'https://api.bilibili.com/x/v2/reply?type='+type+'&oid='+aid+'&nohot=1&pn=1',
                method: "GET",
                onload: function (data) {
                    resolve(JSON.parse(data.responseText).data.replies);
                }
            }));
        }
        function checkReply(replyList,oid,aid,blackList) {
            for (const reply of replyList){
                if (reply.action == 2) {
                    continue;
                }
                if(!blackList.has(reply.mid)){
                    continue
                }
                hateReply(reply, oid,aid);
                reportReply(reply,oid)
                //只举报一次，以免短时间请求太多，被拦截ip
                break
            }

        }
        function checkTopics(topics,blackList) {
            for(const topic of topics){
                if(!blackList.has(topic.dynamic_card_item.modules.module_author.mid)){
                    continue
                }
                reportTopic(topic.dynamic_card_item.id_str)
                //只举报一次，以免短时间请求太多，被拦截ip
                return
            }

        }
    }
    function reportTopic(oid) {
        GM_xmlhttpRequest({
            url: "https://app.bilibili.com/x/topic/resource/report",
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data: 'topic_id=' + topicId + '&res_type=0&res_id_str=' + oid + '&reason=话题不相关&csrf=' + csrf,
            onload: function (resp) {
                var log = " report topic,oid:"+oid
                var json = JSON.parse(resp.responseText)
                if (json.code == 0) {
                    console.log(getCurrTime()+" success"+log)
                }else {
                    console.log(getCurrTime()+" error msg:"+json.message+log)
                }
            }
        })
    }
    function hateReply(reply,oid,aid) {
        GM_xmlhttpRequest({
            url: 'https://api.bilibili.com/x/v2/reply/hate',
            method : "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data:'oid='+aid+'&rpid='+reply.rpid+'&type='+reply.type+'&action=1&csrf='+csrf,
            onload : function(res){
                var json = JSON.parse(res.responseText)
                var log = " hate reply,oid:"+oid+"uid:"+reply.mid+"uname:"+reply.member.uname+"content:"+reply.content.message.substr(0,10)
                if (json.code == 0) {
                    console.log(getCurrTime()+" success"+log)
                }else {
                    console.log(getCurrTime()+" error msg:"+json.message+log)
                }
            }
        });
    }
    function reportReply(reply,oid) {
        //引战
        var reason = 4
        GM_xmlhttpRequest({
            url: 'https://api.bilibili.com/x/v2/reply/report',
            method : "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data:'oid='+reply.oid+'&rpid='+reply.rpid+'&type='+reply.type+'&reason='+reason+'&csrf='+csrf,
            onload : function(res){
                var json = JSON.parse(res.responseText)
                var log = " report reply,oid:"+oid+" uid:"+reply.rpid+" uname:"+reply.member.uname+" content:"+reply.content.message.substr(0,10)
                if (json.code == 0) {
                    //console.log(getNowTime()+" success"+log)
                }else {
                    //console.log(getNowTime()+" error msg:"+json.message+log)
                }
            }
        });
    }
    function getBlackList() {
        GM_xmlhttpRequest({
            url: 'https://gitee.com/giteegitee126/kira/raw/master/blacklist.json',
            method : "GET",
            onload : function(data){
                GM_setValue('blackList', JSON.parse(data.responseText) ?? []);
            }
        });
    }
    function sleep(time) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve()
            }, time);});
    }
    function getCurrTime() {
        return new Date().getHours()+":"+new Date().getMinutes()+":"+new Date().getSeconds()
    }
})();