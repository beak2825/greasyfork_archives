// ==UserScript==
// @name 大连东软信息学院作业平台答案脚本
// @description 自动填写作业平台客观题答案
// @namespace    http://tampermonkey.net/
// @version      0.3
// @match        http://hw-neusoft-edu-cn.portal.neutech.com.cn/hw/exercise/*
// @match        *://hw.neusoft.edu.cn/hw/exercise/exercise.do*
// @downloadURL https://update.greasyfork.org/scripts/412780/%E5%A4%A7%E8%BF%9E%E4%B8%9C%E8%BD%AF%E4%BF%A1%E6%81%AF%E5%AD%A6%E9%99%A2%E4%BD%9C%E4%B8%9A%E5%B9%B3%E5%8F%B0%E7%AD%94%E6%A1%88%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/412780/%E5%A4%A7%E8%BF%9E%E4%B8%9C%E8%BD%AF%E4%BF%A1%E6%81%AF%E5%AD%A6%E9%99%A2%E4%BD%9C%E4%B8%9A%E5%B9%B3%E5%8F%B0%E7%AD%94%E6%A1%88%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
$(function () {
    function getParameter(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
        var r = location.search.substr(1).match(reg);
        if (r!=null) return (r[2]); return null;
    }
    var  eid = getParameter("eid");
    // alert(eid);
    var sj = "semester=1&eid=" + eid;

    $.ajax({
        type:'post',
        url:'getQuestList.do',
        data:sj,
        cache:false,
        dataType:'json',
        success : function (data) {
            var string = "";
            var ans = data.list;
            for (var i = 0; i < ans.length;i++){

                $.ajax({
                    type : "POST",
                    url : "http://hw.neusoft.edu.cn/hw/exercise/saveoa.do",
                    data : {
                        qt_id: ans[i].qt_id,
                        qid: ans[i].qid,
                        objectiveanswer: ans[i].answer,
                        position: i + 1,
                        eid: eid,
                    },
                })
            }
        }
    });
    alert("选择完毕");
});