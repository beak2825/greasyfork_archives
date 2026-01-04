// ==UserScript==
// @name         ajaxHooker-nebula
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  ajaxHooker for nebula
// @author       nebula
// @match        *.changan.com.cn/configcenter-web/
// @match        *.changan.com.cn/vot-admin-center-web/
// @require      https://update.greasyfork.org/scripts/519750/1517668/ajaxHooking.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/523276/ajaxHooker-nebula.user.js
// @updateURL https://update.greasyfork.org/scripts/523276/ajaxHooker-nebula.meta.js
// ==/UserScript==

(function() {
    'use strict';
    ajaxHooker.filter([
        //{type: 'xhr', url: /getCarSeriesConfByPage/, method: 'GET', async: true},
        {url: /getCarSeriesConfByPage/},
        {url: /seriesLevelModelTree/},
    ]);
    ajaxHooker.hook(request => {
        console.log("request:",request)

        localStorage.setItem("Authorization", request.headers.Authorization);
        request.response = res => {
            const responseText = res.responseText; // 注意保存原数据
            const resdata = JSON.parse(responseText);
            console.log(resdata);
            if(resdata.code == 0){
                if(request.url.includes("getCarSeriesConfByPage")){
                    listconfig(resdata);
                    if((/itemCode(\S*)&/).test(request.url)){
                        //if(request.url.includes("itemCode levelId")){
                        savequerydata(resdata)
                    } else {
                        localStorage.removeItem("QUERY_LIST")
                    }
                } else {
                    showtree(resdata);
                }
                res.responseText = JSON.stringify(resdata)
                console.log("response修改后：",resdata);

            }
            //         res.responseText = new Promise(resolve => {
            //             setTimeout(() => {
            //                 resolve(responseText + 'test');
            //             }, 3000);
            //         });
        };
    });


    var ALL_CONFIG = [];

    function showtree(resdata){
        var data0 = resdata.data;
        if(data0){
            data0.forEach(data => {
                ALL_CONFIG.push(data);
                if(data.conf && data.conf.appModuleConfigJson){
                    data.itemName = "✔" + data.itemName
                    data.hasjson = true;
                }
            })
        }
        GM_setValue("allConfig", ALL_CONFIG);
        localStorage.setItem("allConfig", JSON.stringify(ALL_CONFIG));
    }
    function savequerydata(resdata){
        var QUERY_LIST = [];
        var list = resdata.data.list;
        if(list){
            list.forEach(data => {
                QUERY_LIST.push({itemName: data.itemName, itemCode:data.itemCode});
            })
        }
        localStorage.setItem("QUERY_LIST", JSON.stringify(QUERY_LIST));
    }
    function listconfig(resdata){
        var list = resdata.data.list;
        if(list){
            list.forEach(data => {
                if(data.conf.appModuleConfigJson){
                    data.itemName = ("✔" + data.itemName);
                    data.hasjson = true;
                } else {
                    data.itemName = ("✘" + data.itemName);
                    data.hasjson = false;
                }
            })
        }
    }
    // Your code here...
})();