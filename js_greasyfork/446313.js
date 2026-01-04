// ==UserScript==
// @name         MY ZCST UNLOCK
// @version      0.1
// @description  解锁我的珠科APP独占功能
// @author       WeiYuanStudio
// @match        *://my.zcst.edu.cn/_web/sopplus/things.jsp*
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/432318
// @downloadURL https://update.greasyfork.org/scripts/446313/MY%20ZCST%20UNLOCK.user.js
// @updateURL https://update.greasyfork.org/scripts/446313/MY%20ZCST%20UNLOCK.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createThingElement(name, url) {
        let thingElement = $(`<div class="col-md-3"><div class="box box-solid"><div class="box-body"><div class="app-info"><h3 class="app-name"><a title="${name}" href="${url}">${name}</a></h3></div></div></div></div></div>`)
        return thingElement
    }

    GM_xmlhttpRequest({
        method: "POST",
        url: "https://my.zcst.edu.cn/mobile/queryIndexApps.mo",
        onload: function(response) {
            console.log(response.response)
            let responseObject = JSON.parse(response.response)
            console.log(responseObject)
            let thingList = []
            if (responseObject.data.ranks) {
                responseObject.data.ranks.forEach(item => {
                    thingList.push({
                        title: item.title,
                        url: item.mainUrl
                    })
                })
                console.log(thingList)
                Array.from($("div.app-info a")).forEach(item => {
                    thingList = thingList.filter(checkItem => checkItem.title !== item.title)
                })
                console.log(thingList) //独占功能列表

                $("#serviceApps:last").append('<div class="box-header with-border things-list-header"><h3>手机独占功能</h3></div>')

                $("#serviceApps:last").append('<div class="things-list-main clearfix app-only"></div>')

                thingList.forEach(item => {
                    $(".app-only").append(createThingElement(item.title, item.url))
                })
            }
        }
    });

    // Your code here...
})();