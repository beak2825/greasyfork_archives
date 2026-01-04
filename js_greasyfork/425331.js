// ==UserScript==
// @name DNUI;vpn
// @namespace    http://tampermonkey.net/
// @description  配套插件
// @version      0.2
// @include      http://hw-neusoft-edu-cn.portal.neutech.com.cn/hw/exercise/*
// @match        *://hw-neusoft-edu-cn.portal.neutech.com.cn/hw/exercise/exercise.do*
// @downloadURL https://update.greasyfork.org/scripts/425331/DNUI%3Bvpn.user.js
// @updateURL https://update.greasyfork.org/scripts/425331/DNUI%3Bvpn.meta.js
// ==/UserScript==
$(function () {
        function getParameter(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = location.search.substr(1).match(reg);
            if (r != null) return (r[2]); return null;
        }
        var eid = getParameter("eid");
        var sj = "semester=1&eid=" + eid;
        $.ajax({
            type: 'post',
            url: 'getQuestList.do',
            data: sj,
            cache: false,
            dataType: 'json',
            success: function (data) {
                var string = "";
                var ans = data.list;
                for (var i = 0; i < ans.length; i++) {

                    $.ajax({
                        type: "POST",
                        url: "http://hw-neusoft-edu-cn.portal.neutech.com.cn/hw/exercise/saveoa.do",
                        data: {
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
    //  alert("选择完毕");
});