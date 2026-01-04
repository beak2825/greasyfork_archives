// ==UserScript==
// @name         Lazy Student for dk
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  robot for dk.91huayi.com
// @author       han2ee
// @match        http://dk.91huayi.com/*
// @match        http://dk.91huayi.com/course_ware/*
// @run-at       document-start
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/375699/Lazy%20Student%20for%20dk.user.js
// @updateURL https://update.greasyfork.org/scripts/375699/Lazy%20Student%20for%20dk.meta.js
// ==/UserScript==

function playend() {
    //if (getDuration($("#ccid").val()) - getPosition($("#ccid").val()) < 200) {
    //var uid = '437c3b4b-0243-49ef-bd94-ce305122416c';
    //var cwrid = 'aa149adf-2eec-4234-a9df-2d60b6b03b31';
    //var cwid = 'b9cd9a3c-554a-450c-b138-0d47389f7373';

    $.ajax({
        type: "POST",
        url: "../ashx/CourseWareFinish.ashx",
        data: {
            "uid": uid,
            "cwrid": cwrid,
            "iscommpany": ""
        },
        dataType: "text",
        error: function () {
            //alert("更新学习记录失败");
        },
        success: function (res) {
            console.log("end play");
            //alert(res);
            window.location = "http://dk.91huayi.com/exam/myexam_info.aspx";
        }
    });
    //}
}

(function() {
    'use strict';
    setInterval(function(){
        if(document.URL.startsWith('http://dk.91huayi.com/course_ware/course_ware_cc.aspx')) {
            playend();

        } else if(document.URL.startsWith('http://dk.91huayi.com/exam/myexam_info.aspx')){
            if($("table a img")[0].title.startsWith("（未学习）")) {
                window.location = $("table a")[0].href;
            }
        }
    }, 3000);
})();
