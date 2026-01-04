// ==UserScript==
// @name              快递助手一键打印
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动选择模板对应项目
// @author       Essane
// @match        https://zz.kuaidizs.cn/newIndex/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant       GM_registerMenuCommand
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_log
// @downloadURL https://update.greasyfork.org/scripts/434806/%E5%BF%AB%E9%80%92%E5%8A%A9%E6%89%8B%E4%B8%80%E9%94%AE%E6%89%93%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/434806/%E5%BF%AB%E9%80%92%E5%8A%A9%E6%89%8B%E4%B8%80%E9%94%AE%E6%89%93%E5%8D%B0.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function objectToQueryString(obj) {
        return Object.keys(obj).map(function (key) {
            return "".concat(encodeURIComponent(key), "=").concat(encodeURIComponent(obj[key]));
        }).join('&');
    };
    function selectItem(name){
        name = name.substr(0,2);
        let allItem = document.querySelectorAll('#container > div > div.content > table > tbody > tr');
        for(let i=1;i< allItem.length;i++)
        {
            try {
                let title = allItem[i].querySelector('td:nth-child(9) > p:nth-child(1)').textContent.substr(0,2);
                if(title==name){
                    allItem[i].click();
                }
            }
            catch(err) {
                console.log("获取模板错误！");
            }
        }

    }
    let templateDataObject = {
        action: 'GetTemplateList',
        exuserId: window.localStorage.exuid,
        subUserId: 'NaN',
        modeId: 'kdd',
        pageIndex: 0,
        pageSize: 0,
        modeType: 1};
    GM_xmlhttpRequest({
        method: "post",
        url: "https://zz.kuaidizs.cn/modeListshow/getTemplateList",
        data:objectToQueryString(templateDataObject) ,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            "qnquerystring": window.localStorage.kdzsZzToken
        },
        onload: function(res) {
            let templateData = JSON.parse(res.response);
            templateData.data.ModeListShows.forEach(item=>{
                // let title = item.ExcodeName.slice(0,2);
                let title = item.ExcodeName;
                GM_registerMenuCommand(title,()=>{selectItem(title)});
            })
            //GM_registerMenuCommand("取消选择",()=>{selectItem("all")});
        }
    });

})();