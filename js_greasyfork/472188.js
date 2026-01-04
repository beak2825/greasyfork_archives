// ==UserScript==
// @name         Scope GrayList Exporter
// @namespace    https://open.feishu.cn
// @version      0.3
// @description  Export GrayList
// @author       Bestony
// @match        https://open.larksuite.com/scopeconsole/scopedetail/*
// @match        https://iopen.bytedance.net/scopeconsole/scopedetail/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=larksuite.com
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @license      APGL
// @downloadURL https://update.greasyfork.org/scripts/472188/Scope%20GrayList%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/472188/Scope%20GrayList%20Exporter.meta.js
// ==/UserScript==

var tag_loc = ""

function obj_to_csv(arr){
    let content = "申请记录,灰度类型,应用ID/租户ID,灰度事由,灰度时间\r\n";
    arr.forEach(item => {
        content = content + `${item.Id},${item.GrayType},${item.GrayKey},${item.Desc},${new Date(item.CreateTime * 1000).toLocaleString()}\r\n`
    })
    return content;
}

function data_to_csv(data, name) {
    const blob = new Blob([data], { type: "text/csv,charset=UTF-8" });
    const uri = URL.createObjectURL(blob);
    let downloadLink = document.createElement("a");
    downloadLink.href = uri;
    downloadLink.download = name + ".csv" || "temp.csv";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

function getFullScopeList(){
let host = window.location.origin;
    let scopeId = window.location.pathname.split("/")[3]
    let param = { "ScopeId":scopeId,"page":{"PageSize":10000,"CurrentPage":1}}
    GM_xmlhttpRequest({
        method: "POST",
        url: "/scopeconsole/api/GetOapiGrayList",
        headers: {
            "content-type": "application/json",
            "Cookie":document.cookie
        },
        "data":JSON.stringify(param),
        onload: function(response) {
            data_to_csv(obj_to_csv(JSON.parse(response.responseText).data.items),`scope-graylist-of-${scopeId}`)
        },
        abort: function(error){
            console.error(error);
        }
    });

}
function getFullResourceList(){
    let host = window.location.origin;
    let scopeId = window.location.pathname.split("/")[3]
    let param = { "ScopeId":scopeId,"page":{"PageSize":10000,"CurrentPage":1}}
     GM_xmlhttpRequest({
        method: "POST",
        url: "/scopeconsole/api/GetOapiScopeResourceRels",
        headers: {
            "content-type": "application/json",
            "Cookie":document.cookie
        },
        "data":JSON.stringify(param),
        onload: function(response) {
          let resources = JSON.parse(response.responseText).data.items;
          let text = resources.map(item => {
             return item.Resource.Name
          })
          let clipboardText = text.join("\r\n");
          GM_setClipboard(clipboardText, "text", () => alert("复制成功"));

        },
        abort: function(error){
            console.error(error);
        }
    });
}

(function() {
    'use strict';
    GM_registerMenuCommand('导出当前权限的所有灰度清单',getFullScopeList);
    GM_registerMenuCommand('导出当前权限的所有资源清单',getFullResourceList);
})();