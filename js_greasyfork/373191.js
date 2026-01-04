// ==UserScript==
// @name         北京麦课在线教育(大学安全教育)
// @namespace    http://blog.cumtpn.com/
// @version      0.1
// @description  try to take over the world!
// @author       Jachin
// @match        *://wb.mycourse.cn/svnweiban/student/study_studyAndTest.action
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @require      https://unpkg.com/axios/dist/axios.min.js
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373191/%E5%8C%97%E4%BA%AC%E9%BA%A6%E8%AF%BE%E5%9C%A8%E7%BA%BF%E6%95%99%E8%82%B2%28%E5%A4%A7%E5%AD%A6%E5%AE%89%E5%85%A8%E6%95%99%E8%82%B2%29.user.js
// @updateURL https://update.greasyfork.org/scripts/373191/%E5%8C%97%E4%BA%AC%E9%BA%A6%E8%AF%BE%E5%9C%A8%E7%BA%BF%E6%95%99%E8%82%B2%28%E5%A4%A7%E5%AD%A6%E5%AE%89%E5%85%A8%E6%95%99%E8%82%B2%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = $ || window.$;
    alert("你确定要开始刷课？？？？");
// delay ms
function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay)
        ;
}


var xpath = function (xpathToExecute) {
    var result = [];
    var nodesSnapshot = document.evaluate(xpathToExecute, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0; i < nodesSnapshot.snapshotLength; i++) {
        result.push(nodesSnapshot.snapshotItem(i));
    }
    return result;
}
var fn = function (dom) {

    var re = /jiaoxuejihuaId=(\d+)/;
    var s = dom.getAttribute('href');
    var id = s.match(re)[1];
    var uid = s.match(/userId%3D(\d+)/);
    if (uid) {

        var url = `http://cp.mycourse.cn/wxcourse/addJiaoXueJiHuainfo.action?callback=jQuery164084740886788869_1539133186681&userid=${uid[1]}&jiaoxuejihuaid=${id}`

        console.log(url);
        axios.get(url).then(function (response) {
            console.log(response.data);
        })
    }


}


var l = xpath("//div[@course-id]/a");
var i = l.length;
while (i--) {
    console.log(i);
    fn(l[i]);
    sleep(50);
}

    // Your code here...
})();