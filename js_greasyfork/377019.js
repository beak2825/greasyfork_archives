// ==UserScript==
// @name         处理工单
// @namespace    http://www.acfun.cn/login
// @version      1.0
// @description  税务顾问专用
// @author       Jun Ge
// @include      *//10.249.217.120/uflow/listProblemKFS.do*
// @include      *//10.249.217.120/kfs/demandDetail*
// @icon         http://www.portal.unicom.local/favicon.ico
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/377019/%E5%A4%84%E7%90%86%E5%B7%A5%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/377019/%E5%A4%84%E7%90%86%E5%B7%A5%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //刷新列表时间（秒）
    var refreshTime = 60;
    //延时接单（秒）
    var receiptTime = 180;
    //重复接单（分）
    var repeatTime = 90;

    //处理问题省份
    var myProvince = new Array();
    myProvince[0]="湖北省";
    myProvince[1]="江西省";

    var site = window.location.href;
    var uflow = /uflow/;
    var kfs = /kfs/;

    var demands = new Array();

    //工单列表
    if(uflow.test(site)){
        var html = document.body.innerHTML;
        var obj = JSON.parse(html);
        //重新封装页面
        var table = getTable(obj);
        document.body.innerHTML = table;

        var total = obj.total;
        if(total > 0){
            for (var i=0;i<total;i++){
                var gd = obj.rows[i];
                gd.startTime = new Date().getTime();
                foropen(gd);
            }
        }
        window.setTimeout(reloadUrl,refreshTime*1000);
    }

    function getTable(obj){
        var tableStart = '<table style="width: 100%" border="1" cellspacing="0" cellpadding="0" ><tr><th colspan="7">沃工单</th></tr><tr><th>工单编号</th><th>发起人</th><th>最后处理人</th><th>到达时间</th><th>最后处理时间</th><th>问题状态</th><th>省份</th></tr>';
        var total = obj.total;
        var td = '';
        if(total > 0){
            for (var i=0;i<total;i++){
                var gd = obj.rows[i];
                var provinceName = gd.provinceName;
                var flag = false;
                for (var j=0;j<myProvince.length;j++){
                    if(myProvince[j] == provinceName){
                        flag = true;
                    }
                }
                if(flag){
                    td += '<tr style="color:red"><td><a href="'+gd.detailUrl+'" target="_blank">'+gd.demandNum+'</a></td><td>'+gd.userNick+'</td><td>'+gd.lastUserNick+'</td><td>'+datetimeFormat(gd.arriveTime)+'</td><td>'+datetimeFormat(gd.processeTime)+'</td><td>'+gd.demandStateName+'</td><td>'+gd.provinceName+'</td></tr>';
                }else{
                    td += '<tr><td><a href="'+gd.detailUrl+'" target="_blank">'+gd.demandNum+'</a></td><td>'+gd.userNick+'</td><td>'+gd.lastUserNick+'</td><td>'+datetimeFormat(gd.arriveTime)+'</td><td>'+datetimeFormat(gd.processeTime)+'</td><td>'+gd.demandStateName+'</td><td>'+gd.provinceName+'</td></tr>';
                }
            }
        }
        var tableEen = '</table>';
        if(td == ''){
           return '暂时没有工单！';
        }else{
           return tableStart+td+tableEen;
        }
    }

    function foropen(gd){
        var detailUrl = gd.detailUrl;
        var provinceName = gd.provinceName;
        var demandId = gd.demandId;
        for (var i=0;i<myProvince.length;i++){
            if(myProvince[i] == provinceName){
                var id = window.sessionStorage.getItem(demandId);
                if(id == null){
                    window.sessionStorage.setItem(demandId,gd.startTime);
                    window.open(detailUrl);
                }else{
                    //计算相差分钟数
                    var minutes=Math.floor((new Date().getTime() - id)/(60*1000))
                    if(minutes > repeatTime){
                        gd.startTime = new Date().getTime();
                        window.sessionStorage.setItem(demandId,gd.startTime);
                        window.open(detailUrl);
                    }
                }
            }
        }
    }

    function reloadUrl(){
        var url = "http://10.249.217.120/uflow/listProblemKFS.do?method=getWaitingClaim&pageNo=1&pageSize=100&sortname=id&sortorder=desc";
        window.location.href = url;
    }

    //接工单
    if(kfs.test(site)){
        var claim = document.getElementById('claim');
        //可认领状态
        if(claim.style.display != 'none'){
            window.setTimeout(receiptClick, receiptTime*1000);
        }
    }

    function receiptClick(){
        var claim = document.getElementById('claim');
        claim.click();
    }

})();