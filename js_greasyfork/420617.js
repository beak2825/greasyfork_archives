// ==UserScript==
// @name         淘宝直播自动拉黑
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  自动屏蔽不良用户
// @author       Will
// @match        https://liveplatform.taobao.com/live/liveDetail.htm*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420617/%E6%B7%98%E5%AE%9D%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E6%8B%89%E9%BB%91.user.js
// @updateURL https://update.greasyfork.org/scripts/420617/%E6%B7%98%E5%AE%9D%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E6%8B%89%E9%BB%91.meta.js
// ==/UserScript==

function add(userid,t) {
    if (t>5) {
    } else {
        var httpRequest = new XMLHttpRequest();
        httpRequest.open('POST', 'https://liveplatform.taobao.com/live/action.do', true);
        httpRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        var sendinfo = 'api=add_live_black&pFeedId='+window.pageData.liveDO.id+'&userId='+userid+'&_tb_token_='+document.getElementById('J_TB_TOKEN').value+'&_='+Date.now();
        httpRequest.send(sendinfo);
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                var json = httpRequest.responseText;
                console.log(json);
            } else {
                add(userid,t+1);
            };
        };
    };
}

function get() {
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('POST', 'https://liveplatform.taobao.com/live/action.do', true);
    httpRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    var sendinfo = 'api=get_live_black&pFeedId='+window.pageData.liveDO.id+'&pagesize=20&s=0&_tb_token_='+document.getElementById('J_TB_TOKEN').value+'&_='+Date.now();
    httpRequest.send(sendinfo);
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var json = httpRequest.responseText;
            console.log(json);
        }
    };
}

function autoblock(bl) {
    var j;
    for(j = 0; j < blacklist.length; j++) {
        userid = blacklist[j];
        add(userid,1);
    }
}

(function() {
    blacklist = [
        "784850834",
        "380859796",
        "4211604372",
        "741719549",
        "828567987",
        "154411673",
        "2208952492616",
        "2201049459301",
        "2207228196344",
        "2201432086123"
    ];
    setTimeout(function() { autoblock(blacklist); }, 5000);
    //setTimeout(function() { get(); }, 5000);
})();