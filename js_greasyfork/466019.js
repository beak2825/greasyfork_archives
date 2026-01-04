// ==UserScript==
// @name         自动好评
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  西南交通大学研究生查成绩时的教评自动好评
// @author       FDM
// @match        https://one.swjtu.edu.cn/gsapp/sys/wspjapp/*default/index.do
// @match        https://one.swjtu.edu.cn/gsapp/sys/wspjapp/*default/index.do?t_s=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=swjtu.edu.cn
// @grant        unsafeWindow
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/466019/%E8%87%AA%E5%8A%A8%E5%A5%BD%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/466019/%E8%87%AA%E5%8A%A8%E5%A5%BD%E8%AF%84.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
fdm()
function fdm() {
    function timeout1() {
        if ($.trim($("h2").text()) == "课程评教评教") {
            $("h2").append('<button id="btn1">一键好评</button>').click(mains).css('color','#fab')        
        } else { setTimeout(timeout1, 500) }      
    }
    // 页面加载后
    function mains () { 
        // var all = $('.bh-row [data-action="评教"]').length;
        if ( $('.bh-row [data-action="评教"] div.sc-panel-diagonalStrips-bar').first().text() == '未评教'){ 
            if ($.trim($("h2").length) == 1){
                $('.bh-row [data-action="评教"]').first().click()
                timeout2()
            } 
            setTimeout (mains ,500)    
        } else {
            console.log('wanle');
        }
        // $('.bh-row [data-action="评教"][data-idx="0"]').click()
        // timeout2()
    }
    // 进入问卷
    function timeout2 () {
        if ($('td.paper_title').text()) {
            $("div.paper_tm label:first-of-type").css('color','#fab')
            $("div.paper_tm label:first-of-type").click()
            $("textarea").val("无")
        } else {
            setTimeout(timeout2,500)
            console.log("222");
        }
    }
    timeout1()
}
})();