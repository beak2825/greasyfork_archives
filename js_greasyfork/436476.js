// ==UserScript==
// @name         cassNexus搜索优化脚本
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  添加下拉框，直达项目位置!
// @author       solenya
// @license      Apache License 2.0
// @match        http://dev.casstime.com/nexus/
// @icon         https://www.google.com/s2/favicons?domain=casstime.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant        unsafeWindow
// @grant      window.close
// @grant      window.focus
// @grant      GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/436476/cassNexus%E6%90%9C%E7%B4%A2%E4%BC%98%E5%8C%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/436476/cassNexus%E6%90%9C%E7%B4%A2%E4%BC%98%E5%8C%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
     'use strict';


       console.log("油猴脚本执行。。。")
    let div = document.createElement('div');
    div.innerHTML = "<label for=\"inputroute\">Choose your browser from the list:</label>\n" +
        "    <input list=\"routedata\" name=\"browser\" id=\"inputroute\">\n" +
        "    <datalist id=\"routedata\">\n" +
        "    </datalist>"
    document.body.prepend(div)

    //路由
      
    let route = {
        "icec-cloud-decode-service":"",
        "icec-cloud-decode-web":"",
        "icec-cloud-dependencies":"",
        "icec-cloud-inquiry":"",
        "icec-cloud-inquiry-es":"",
        "icec-cloud-distribute":"",
        "icec-cloud-distribute-service":"",
        "icec-cloud-intelligent-score":"",
        "icec-cloud-quote":"",
        "icec-cloud-aggregation-inquiry-service":"",
        "icec-cloud-archive-inquiry-service":"",
        "icec-cloud-clarify-service":"",
        "icec-cloud-clarify-service-spi":"",
        "icec-cloud-decode-spi":"",
        "icec-cloud-inquiry-spi": "http://dev.casstime.com/nexus/#browse/browse:public:com%2Fcasstime%2Fcloud%2Ficec-cloud-inquiry-spi",
        "inquiry-service": "http://dev.casstime.com/nexus/#browse/browse:public:com%2Fcasstime%2Fcloud%2Ficec-cloud-inquiry-service",
        "bk-spi": "http://dev.casstime.com/nexus/#browse/browse:public:com%2Fcasstime%2Fcloud%2Ficec-cloud-bk-spi",
        "bk-spi-service": "http://dev.casstime.com/nexus/#browse/browse:public:com%2Fcasstime%2Fcloud%2Ficec-cloud-bk-spi-service",
        "decode-spi": "http://dev.casstime.com/nexus/#browse/browse:public:com%2Fcasstime%2Fcloud%2Ficec-cloud-decode-spi",
        "icec-cloud-inquiry-service": "http://dev.casstime.com/nexus/#browse/browse:public:com%2Fcasstime%2Fcloud%2Ficec-cloud-inquiry-service",
        "icec-cloud-inquiry-es-spi": "http://dev.casstime.com/nexus/#browse/browse:public:com%2Fcasstime%2Fcloud%2Ficec-cloud-inquiry-es-spi",
        "icec-cloud-inquiry-infrastructure-service": "http://dev.casstime.com/nexus/#browse/browse:public:com%2Fcasstime%2Fcloud%2Ficec-cloud-inquiry-infrastructure-service",
        "icec-cloud-inquiry-infrastructure-spi": "http://dev.casstime.com/nexus/#browse/browse:public:com%2Fcasstime%2Fcloud%2Ficec-cloud-inquiry-infrastructure-spi",

    }
    
    //填充路由到 datalist中
    let options = "";
    let keys = Object.keys(route)
    for (let i = 0; i < keys.length; i++) {
        options += '<option value="' + keys[i] + '" />';
    }
    document.getElementById('routedata').innerHTML = options;

    // 监听
    let myDiv = document.querySelector("#inputroute");
    if (myDiv) {
        //监听选择框修改
        myDiv.addEventListener("change", (event) => {
            routeTo(event.target.value);
        });
    }
    function routeTo(str) {
        console.log("开始执行route。。。str=>" +str)
         window.location.href = route[str] == ""?"http://dev.casstime.com/nexus/#browse/browse:public:com%2Fcasstime%2Fcloud%2F" + str : route[str]  ;
    }

})();