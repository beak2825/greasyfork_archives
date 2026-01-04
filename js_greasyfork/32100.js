// ==UserScript==
// @name         浙江大学安全考试
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Operation no control
// @author       Revolution Radio
// @match        http://kaoshi.xsfww.cn/General/Examination/ExamView.aspx?Pid=40
// @grant        none
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/32100/%E6%B5%99%E6%B1%9F%E5%A4%A7%E5%AD%A6%E5%AE%89%E5%85%A8%E8%80%83%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/32100/%E6%B5%99%E6%B1%9F%E5%A4%A7%E5%AD%A6%E5%AE%89%E5%85%A8%E8%80%83%E8%AF%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
var id=$("#Label6").text();
function getExamTopList(topid, daan) {
            $.ajax({
                Type: "POST",
                url: "/General/ExamPaper/ExamPaperAjaxCopy.aspx?mode=daan&topid=" + topid + "&daan=" + daan,
                dataType: "json",
                success: function (msg) {
                    console.info(topid, daan);
                    console.log(msg);
                    var jiexi = msg.ds[0].Describe;
                    var name = msg.ds[0].Answer;
                    $('input:checkbox').removeAttr('checked');
                    for (var i=0;i<name.length;i++){$('input[value|='+name[i]+']').trigger("click");}
                    $("#Label2").text($("#Label2").text()+jiexi);
                    console.info(topid, name);
                }
            });
        }
    getExamTopList(id,0);
    // Your code here...
})();