// ==UserScript==
// @name         自动同意配置
// @namespace    xxx
// @version      0.0.1
// @description  自动同意配置....
// @author       xxx
// @match       *://*/*
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      music-cms.hz.netease.com
// @connect      https://music-cms.hz.netease.com/*
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/520204/%E8%87%AA%E5%8A%A8%E5%90%8C%E6%84%8F%E9%85%8D%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/520204/%E8%87%AA%E5%8A%A8%E5%90%8C%E6%84%8F%E9%85%8D%E7%BD%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var tabId = 'id-' + new Date().getTime().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
    console.log("初始化"+tabId);
    var checkInterval = setInterval(()=>checkInit(),2000);
    function checkInit(){
        var lock = GM_getValue("autoConfiglock")
        if(lock==null || lock == undefined){
            GM_setValue("autoConfiglock",tabId+"@||@"+new Date().getTime());
            work();
            return;
        }
        let lockV = lock.split("@||@");
        if(lockV[0]==tabId){
            GM_setValue("autoConfiglock",tabId+"@||@"+new Date().getTime());
            work();
            return;
        }
        if(Math.abs(lockV[1] - new Date().getTime()) > 4000){
            GM_setValue("autoConfiglock",tabId+"@||@"+new Date().getTime());
            work();
            return;
        }
    }
    function work(){
        GM_xmlhttpRequest({
            url: 'https://music-cms.hz.netease.com/api/apollo/process/list',
            method: "POST",
            data:'{"order":"","type":2,"current":1,"pageSize":20,"procDefKey":"apollo_config_application","status":[0],"operator":[],"historyAssignees":[],"procInstSerials":[],"createTimeStart":null,"createTimeEnd":null,"procListType":2,"bizFieldQueries":{"kfId":null}}',
            headers:  {"Content-Type": "application/json"},
            onload:function (data) {
                if (data && data.response) {
                    let res = JSON.parse(data.response);
                    if(res && res.data && res.data.list){
                        var datas = res.data.list.map(item => item.procInstSerial)
                        if(datas && datas.length>0){
                            console.log("执行批量审批");
                            GM_xmlhttpRequest({
                                url: 'https://music-cms.hz.netease.com/api/apollo/manager/batchHandler/batch',
                                method: "POST",
                                data:JSON.stringify({"procInstSerials":datas,"batchHandlerType":1}),
                                headers:  {"Content-Type": "application/json"},
                                onload:function (data) {
                                    if (data && data.response) {
                                        let res = JSON.parse(data.response);
                                        console.log(res)
                                    }
                                }
                            });
                        }
                    }
                }
            }
        });
    }
})();