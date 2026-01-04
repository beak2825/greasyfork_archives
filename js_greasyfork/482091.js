// ==UserScript==
// @name         考勤8点以后下班统计
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  (访问想要报销的考勤月份,访问报销过的会填写重复,提交不过)
// @author       lq
// @include      https://ihr.corpautohome.com/pc/person/calendar*
// @include      https://ihr.corpautohome.com/person/calendar*
// @icon         https://www.google.com/s2/favicons?domain=corpautohome.com
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js
// @license MIT
// @run-at       document-start
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/482091/%E8%80%83%E5%8B%A48%E7%82%B9%E4%BB%A5%E5%90%8E%E4%B8%8B%E7%8F%AD%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/482091/%E8%80%83%E5%8B%A48%E7%82%B9%E4%BB%A5%E5%90%8E%E4%B8%8B%E7%8F%AD%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==


(function() {
    'use strict'; 
    var pm8MoneyScript = `
       /**
         更新内容
         1.数据以json展示
         2.自动判断周末加班时长>=8 则为一天，否则为半天自动加入halfDay中。
         3.日期上增加del按钮如果不需要报销的日志可以手动删除
         4.脚本可以浏览器控制台使用，直接粘贴在控制台后回车生效。
       */

        $.cookie.json = true;

        var cssDel = "float:right;border: 1px solid;width: 25px;text-align: center;background-color: yellowgreen;border-radius: 6px;";

        var pm8DateArr = [];//加班日期
        var currMonthPm8DateArr=[];//当月加班日期
        var weekEndTdIndex = [5, 6, 12, 13, 19, 20, 26, 27, 33, 34];
        var bxData={"userid":0,"username":"-",dateArr:[],"money":0,"halfDay":[]};


        function delDate(ele,date,dayMoney){
           if( confirm("确定删除["+date+"，￥"+dayMoney+"]")){
            $(ele).parent().parent().parent().css('background','');
            $(ele).hide();
            for(let i=0;i<pm8DateArr.length;i++){
                if(pm8DateArr[i] == date ){
                    pm8DateArr.splice(i,1);
                    bxData.money -= dayMoney;
                    bxData.dateArr = pm8DateArr;
                    setResult()
                    break;
                }
            }
            setTimeout(function(){
                $.cookie( 'dateArr',pm8DateArr ,{ expires: 1, path: '/',domain:'corpautohome.com' });
            },300)
          }
        }

        function clearCurrMonthDate(){

            for(let i=0;i<pm8DateArr.length;i++){
                if( currMonthPm8DateArr.indexOf(pm8DateArr[i])>-1){
                    pm8DateArr.splice(i,1);
                }
            }
            setTimeout(function(){
                $.cookie( 'dateArr',pm8DateArr ,{ expires: 1, path: '/',domain:'corpautohome.com' });
            },300)
        }

        function setResult(){
              pm8DateArr.sort();
               console.log('date---->',pm8DateArr);
              $('.ant-page-header-heading-left').html(JSON.stringify(bxData));
              $.cookie( 'dateArr',pm8DateArr ,{ expires: 1, path: '/',domain:'corpautohome.com' });
        }

         var tjClickTimer = null;
        function statisticsJiabanDate(){
            clearTimeout(tjClickTimer);
             tjClickTimer = setTimeout(function(){
                bxData.userid=$("img[alt='avatar']").attr("src").split("=")[1];
                bxData.username=$(".anticon").text();
                currMonthPm8DateArr=[];
                $('.ant-page-header-heading-left').html('');
                var dateDoms = $(".ant-picker-cell-in-view");

                dateDoms.each((index,elem)=>{
                    var dateCell = $(elem);
                    var currDate = dateCell.attr('title');
                    var amTimeStr = dateCell.find('div[class=text] div:eq(0)').text().replace('上午：','')||"";
                    var pmTimeStr = dateCell.find('div[class=text] div:eq(1)').text().replace('下午：','')||"";
                    var amTime = new Date(currDate +' '+amTimeStr);
                    var pmTime = new Date(currDate +' '+pmTimeStr);

                    var pmEightClock = new Date(currDate +' '+'20:00');
                    var dayMoney = 30;

                    var hasDelDayBtn = dateCell.find("div[class=delDay]").text();

                    //周末
                    if(weekEndTdIndex.indexOf(index)>-1 && amTimeStr && pmTimeStr ){
                        var oneDay = (pmTime.getTime() - amTime.getTime())/3600000 >=8;
                        dayMoney = oneDay? 60 :30;
                        dateCell.css('background','#e88989c7');

                        if(pm8DateArr.indexOf(currDate)<0){
                            pm8DateArr.push(currDate);
                            bxData.dateArr =pm8DateArr;
                            bxData.money += dayMoney;
                            if(dayMoney == 30 && bxData.halfDay.indexOf(currDate)<0 ){
                                bxData.halfDay.push(currDate);
                            }
                        }
                        if(currMonthPm8DateArr.indexOf(currDate)<0){
                            currMonthPm8DateArr.push(currDate);
                        }
                        if(hasDelDayBtn!="del"  ){
                            currDateTemp = "'"+currDate+"'";

                          dateCell.find('div[class=text] div:last').after('<a class="delDay" style="' + cssDel + '" onclick="delDate(this,' +currDateTemp + ',' + dayMoney + ')">del</a>');
                        }

                    }
                    //工作日
                    if(pmTime.getTime()>pmEightClock.getTime()){
                        dateCell.css('background','#e88989c7');
                        if(pm8DateArr.indexOf(currDate)<0){
                            pm8DateArr.push(currDate);
                            bxData.dateArr =pm8DateArr;
                            bxData.money += dayMoney;
                        }
                        if(currMonthPm8DateArr.indexOf(currDate)<0){
                            currMonthPm8DateArr.push(currDate);
                        }
                         if( hasDelDayBtn!="del"  ){
                              currDateTemp = "'"+currDate+"'";
                          dateCell.find('div[class=text] div:last').after('<a class="delDay" style="' + cssDel + '" onclick="delDate(this,' +currDateTemp + ',' + dayMoney + ')">del</a>');
                        }

                    }


                    if(index ===dateDoms.length-1 ){
                       setResult();
                    }
                });
                //$('.ant-page-header-heading-left').append('<a href="javascript:clearCurrMonthDate()">清除当月加班</a');
            },2000);
        }



          $(function(){
             statisticsJiabanDate();
            //切换月份或点击当月事件
            $(document).on('click','.month',()=>{
               console.log('month area click');
               statisticsJiabanDate();
            });
         })


//===================end===================================
  `;

    $("head").append(`<script title="pm8money_lzy"> ${pm8MoneyScript}</script>`);
    setTimeout(function(){
       statisticsJiabanDate();
    },3000);

})();
