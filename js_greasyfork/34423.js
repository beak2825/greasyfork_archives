// ==UserScript==
// @name         日报生成工具
// @namespace    undefined
// @version      1.0.1
// @description  try to take over the world!
// @author       烟草味
// @match        *://exmail.qq.com/*
// @require      https://code.jquery.com/jquery-latest.js
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34423/%E6%97%A5%E6%8A%A5%E7%94%9F%E6%88%90%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/34423/%E6%97%A5%E6%8A%A5%E7%94%9F%E6%88%90%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var reciver = '';
    var current_month_filter = [1,2,3,4,5,6,7,8];
    var last_month_filter = [];
    var last_last_month_filter = [];

    var now = new Date();
    var nowYear = now.getFullYear();
    var month = now.getMonth();
    var centerCount = 0;
    var topCount = 0;
    var buttomCount = 0;

    $(function(){
        $('.topbg').append('<div class="dayReport" style="float: left;position: relative;top: 20%;left: 24%;cursor:pointer;color:#00588c;">生成日报</div>');
        //$('.topdata').append('<div class="inputConfig"></div>');
        $('.dayReport').click(generaterDayReport);
    });
    //生成日报
    function generaterDayReport(){
        reciver = prompt('请输入收件人(已过滤国家法定节假日)');
        init();
        var frame = $(document.getElementById('mainFrame').contentWindow.document.body);
        $(frame).find('.toarea').empty();
        var days = getDaysInMonth(nowYear,month);
        var centerTr = createReportData(nowYear,month,days,0,0);
        topCount = randomNum(0,25 - centerCount);

        var topTr = createReportData(nowYear,month + 1,topCount,1,1);
        buttomCount = 25 - centerCount - topCount;
        var bottomTr = createReportData(nowYear,month - 1,buttomCount,0,2);
        console.log('topCount:'+topCount+',centerCount:'+centerCount+',bottomCount:'+buttomCount );
        var trs =  topTr + centerTr + bottomTr;
        $(frame).find('.toarea').html(trs);
        $('.dayReport').css('display','none');
    }
    /**
    year:年份
    month:月份
    limit:生成行数限制
    rev:开始日期 0:从月初开始 1:从月末开始
    */
    function createReportData(year,month,limit,rev,types){
        var days = getDaysInMonth(year,month);
        var trs = '';
        var first_flag = 1;
        var work_day = 0;
        if(rev === 0){
            for(var i = days;i >= 1;i--){
                if(!filterDays(types,i)) continue;
                var type = '';
                var day_week = getDayOfWeek(month,i);
                if(work_day == 25 || work_day >= limit) break;
                if(day_week != 6 && day_week !== 0){
                    if(first_flag == 1){
                        type = '月报';
                        first_flag = 0;
                    }else if(day_week == 5){
                        type = '周报';
                    }else{
                        type = '日报';
                    }
                    if(types === 0){
                        centerCount = centerCount + 1;
                    }
                    trs += createTr(reciver,type,month,i) ;
                    work_day++;
                }
            }
        }else{
            for(var i = 1;i <= days;i++){
                if(!filterDays(types,i)) continue;
                var type = '';
                var day_week = getDayOfWeek(month,i);
                if(work_day == 25 || work_day >= limit) break;
                if(day_week != 6 && day_week != 0){
                    if(day_week == 5){
                        type = '周报';
                    }else{
                        type = '日报';
                    }
                    trs = createTr(reciver,type,month,i) + trs;
                    work_day++;
                }
            }
        }
        return trs;

    }
    //初始化全局变量
    function init(){
        now = new Date();
        nowYear = now.getFullYear();
        month = now.getMonth();
        centerCount = 0;
        topCount = 0;
        buttomCount = 0;
    }
    //创建表格数据
    function createTr(reciver,type,month,day){
        var tr = '<table cellspacing="0" class="i M" style=""><tbody><tr>';
        tr += '<td class="cx"><input totime="1503415637000" type="checkbox" unread="false" fn="" ';
        tr += 'fa="" sh="niexiaosong@kldaby.com,zhangyuanyuan@kldaby.com" bsm="false" name="mailid" ';
        tr += 'value="ZC1322-vSRykLH8tGb6YkoT_iZMf7k" colid="-145284202" preload="" init="true"></td>';
        tr += '<td class="ci folderid3"><div class="ciz ">&nbsp;</div><div class="cir Rr " title="新窗口读信">&nbsp;</div>';
        tr += '<div class="cij">&nbsp;</div><div class="retome"></div></td><td onclick="getTop().RD(event,"ZC1322-vSRykLH8tGb6YkoT_iZMf7k",0,1,3,0,0,"","5637", "0");"';
        tr += ' class="l"><table cellspacing="0" class="i"><tbody><tr><td class="Ss" title="邮件投递成功" style="width:13px;overflow:hidden;"></td>';
        tr += '<td class="tl tf" title="niexiaosong@kldaby.com,zhangyuanyuan@kldaby.com"><nobr>'+reciver+'&nbsp;</nobr></td><td class="fg_n ">';
        tr += '<div></div></td><td class="gt tf"><div class="txt_hidden"><u tabindex="0" class="black ">'+type+'</u>&nbsp;</div><div class="TagDiv">';
        tr += '</div></td><td class="dt"><div>'+month+'月'+day+'日&nbsp;</div></td><td class="fg" title="标记星标"><div></div></td></tr></tbody></table></td></tr></tbody></table>';
        return tr;
    }
    //获得某月的天数
    function getDaysInMonth(year,month){
        month = parseInt(month,10); //parseInt(number,type)这个函数后面如果不跟第2个参数来表示进制的话，默认是10进制。
        var temp = new Date(year,month,0);
        return temp.getDate();
    }
    //获得某天是星期几
    function getDayOfWeek(month,day){
        var strTime= nowYear +'-'+ month + '-'+ day;
        var date= new Date(Date.parse(strTime.replace(/-/g,  "/")));
        return date.getDay();
    }
    //随机生成天数
    function randomNum(Min,Max){
        var Range = Max - Min;
        var Rand = Math.random();
        var num = Min + Math.round(Rand * Range);
        return num;
    }
    //过滤时间
    function filterDays(type,day){
        var flag = true;
        if(type == 0){
            flag = checkDay(last_month_filter,day);
        }else if(type == 1){
            flag = checkDay(current_month_filter,day);
        }else if(type == 2){
            flag = checkDay(last_last_month_filter,day);
        }
        return flag;
    }
    //验证是否为过滤日期
    function checkDay(array,day){
        var flag = true;
        for(var i = 0;i < array.length;i++){
            if(day == array[i]){
                flag = false;
                break;
            }
         }
        return flag;
    }


})();