// ==UserScript==
// @name         树维日志助手
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  树维日志助手；自动选择；自动填写部分内容；
// @author       不想说话的树
// @match        http://pms.supwisdom.com:81/pms/index.php?m=my&f=mylog*
// @match        http://10.51.67.53:8080/eam/*
// @match        http://192.168.160.69:8081/energymanager/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/387073/%E6%A0%91%E7%BB%B4%E6%97%A5%E5%BF%97%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/387073/%E6%A0%91%E7%BB%B4%E6%97%A5%E5%BF%97%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function() {
    'use strict';
    //增加一行
    $(".icon-addFile").eq(0).click();
    //选任务
    $(".logtypeid").val("109552");
    //工作时段
    $("[id=timeinterval]").eq(0).val("am");
    $("[id=timeinterval]").eq(1).val("pm");
    //val("pm");
    //工作地点
    $("[id=location]").eq(0).val("out");
    $("[id=location]").eq(1).val("out");
    //工作内容
    //$("detail").val("中医大维护");
    //实际工时
    $(".workhour").val("4.00");
    //全部选中
    $('[id=submitid]').attr("checked", true);
    //提交


    // 智慧教室，选教室...
    $("[id=areatype]").val("106");
    $("[class=layui-layer-btn0 a]")[0].click();
    //电表系统填密码
    $('#empPwd').val('shuweiv5');
    $('#remark').val('shuweiv5');


    })();