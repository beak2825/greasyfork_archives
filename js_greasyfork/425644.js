// ==UserScript==
// @name         考勤主档===打卡记录
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  fendouzhe
// @author       NinjaHong
// @match        https://zgs.zjs.com.cn/Index.aspx
// @grant        none
// @require    http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/425644/%E8%80%83%E5%8B%A4%E4%B8%BB%E6%A1%A3%3D%3D%3D%E6%89%93%E5%8D%A1%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/425644/%E8%80%83%E5%8B%A4%E4%B8%BB%E6%A1%A3%3D%3D%3D%E6%89%93%E5%8D%A1%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.onload = function(){
        var speed = 1000
        var speedBtn = 10
        var findTableInterval = function(){
            //找到考勤主档的表格
            let tb = $(window.frames['main'].document).find('iframe[name=mainFrame]').contents().find('#Grrecord')[0]
            if(tb && $(tb).find('tr:first').find('th').size() == 9) {
                clearInterval(findId);
                outId = setInterval(outTableInterval, speed);
                console.log('find')

                $(tb).width('800px')
                //处理
                addOverWorkTimeColumn(tb)

            }
            //console.log('finding')

        }

        var outTableInterval = function(){
            //离开考勤主档的表格
            let tb = $(window.frames['main'].document).find('iframe[name=mainFrame]').contents().find('#Grrecord')[0]
            if(!tb || $(tb).find('tr:first').find('th').size() == 9) {
                clearInterval(outId);
                findId = setInterval(findTableInterval, speed);
                console.log('out')
            }
            //console.log('wiat out')
        }

        var addOverWorkTimeColumn = function(tb){
            $('#btnSearch').append('<input type="button" name="btnMonth1" value="1" id="btnMonth1" class="ButtonCss">')


            $(tb).find('tr:first').append(`<th scope="col">时长</th>`)
            $(tb).find('tr:first').append(`<th scope="col">按打卡时间算加班</th>`)
            $(tb).find('tr:first').append(`<th scope="col">按17点30开始算加班</th>`)
            let allOverWorkHours = 0
            let allOverWorkHours2 = 0
            let allOverWorkHours3 = 0
            $(tb).find('tr:gt(0)').each(function(k){

                let overWorkHours = countHoursMethod(this)
                let overWorkHours2 = countHoursMethod2(this)
                let overWorkHours3 = countHoursMethod3(this)

                allOverWorkHours += overWorkHours
                allOverWorkHours2 += overWorkHours2
                allOverWorkHours3 += overWorkHours3

                overWorkHours = format(overWorkHours, 'hh:mm:ss')
                overWorkHours2 = format(overWorkHours2, 'hh:mm:ss')

                $(this).append('<td style="width:120px;">' + overWorkHours3 + '</td>')
                $(this).append('<td style="width:120px;">' + overWorkHours + '</td>')
                $(this).append('<td style="width:120px;">' + overWorkHours2 + '</td>')

            })

            allOverWorkHours = format(allOverWorkHours, 'hh:mm:ss')
            allOverWorkHours2 = format(allOverWorkHours2, 'hh:mm:ss')
            $(tb).append('<tr><td style="width:75px;">汇总</td><td style="width:75px;">汇总</td><td style="width:75px;">汇总</td><td style="width:75px;">汇总</td><td style="width:75px;">汇总</td><td style="width:75px;"></td><td style="width:75px;">汇总</td><td style="width:75px;">汇总</td><td style="width:75px;">汇总</td><td style="width:75px;">'
                         + allOverWorkHours3 + '</td><td style="width:75px;">'+ allOverWorkHours + '</td><td style="width:75px;">'+allOverWorkHours2+'</td></tr>')

            $(tb).find('tr:last').css('background-color','#58bb6abd')


            //汇总
            let btn = $(window.frames['main'].document).find('iframe[name=mainFrame]').contents().find('.btnMonth').last()
            //表行数
            let standard = (tb.rows.length-2)*3
            let diff =  allOverWorkHours3 - standard
            btn.after("&nbsp;本月应加时间：" + "<span style='color: blue;'>" + standard + "</span>" + "&nbsp;本月已加时间：" +
                      (allOverWorkHours3<standard? ("<span style='color: red;'>" + allOverWorkHours3 + "(" + diff +")</span>"):("<span style='color: green;'>" + allOverWorkHours3 + "(+" + diff +")</span>")))

        }

        //时间计算方法
        //减9法
        //         var countHoursMethod = function(tr){
        //             //取 时长 字段
        //             let workHours = $(tr).find('td:eq(5)').text()
        //             let overWorkHours = workHours - 9
        //             if (overWorkHours < 0){
        //                 overWorkHours = 0
        //             }
        //             return overWorkHours
        //         }
        //时间差法
        var countHoursMethod = function(tr){
            //上班打卡时间
            let to = new Date($(tr).find('td:eq(3)').text())
            //下班打卡时间
            let off = new Date($(tr).find('td:eq(4)').text())
            let diff = off-to-32400000

            if (!diff || diff < 0){
                diff = 0
            }
            return diff
        }
        var countHoursMethod2 = function(tr){
            //上班打卡时间
            let to = new Date($(tr).find('td:eq(3)').text())
            to = new Date(to.setHours(17))
            to = new Date(to.setMinutes(30))
            to = new Date(to.setSeconds(0))
            //下班打卡时间
            let off = new Date($(tr).find('td:eq(4)').text())
            let diff = off-to

            if (!diff || diff < 0){
                diff = 0
            }
            return diff
        }
        //可能是人资算的
        var countHoursMethod3 = function(tr){
            //时长
            let total = $(tr).find('td:eq(5)').text()
            let diff = total - 9

            if (!diff || diff < 0){
                diff = 0
            }
            return diff
        }

        //格式化，只有时分秒
        var format = function(time, fmt){
            let hh = Math.floor(time/1000/60/60)
            let MM = Math.floor(time/1000/60%60)
            let ss = Math.floor(time/1000%60%60)

            var o = {
                "h+" : hh,                   //小时
                "m+" : MM,                 //分
                "s+" : ss,                 //秒
            };

            for(var k in o){
                if(new RegExp("("+ k +")").test(fmt)){
                    fmt = fmt.replace(
                        RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
                }
            }

            return fmt;
        }

        //找到查询按钮，添加快捷月份按钮
        var findBtnInterval = function(){
            //找到考勤主档的表格
            let beginDate = $(window.frames['main'].document).find('iframe[name=mainFrame]').contents().find('#txtBeginDate')[0]
            let endDate = $(window.frames['main'].document).find('iframe[name=mainFrame]').contents().find('#txtEndDate')[0]
            if(beginDate) {
                clearInterval(findBtnId);
                outBtnId = setInterval(outBtnInterval, speedBtn);
                console.log('findBtn')

                //处理
                let num = 3
                let month = new Date().getMonth()
                let year = new Date().getFullYear()
                let btn = $(window.frames['main'].document).find('iframe[name=mainFrame]').contents().find('#btnSearch')
                for(let i = 1; i <= num; i++) {
                    let btn1 = document.createElement('input')
                    btn1.setAttribute("type","button")
                    btn1.setAttribute("value",(month + 1))
                    btn1.setAttribute("class","btnMonth")
                    let mmm = btn1.getAttribute('value')
                    let mmm2 = ''+(btn1.getAttribute('value')%12 + 1)
                    $(btn1).click(function(){
                        $(beginDate).val(year + '-' + (mmm.length == 1? ('0'+mmm):mmm) + '-01')
                        $(endDate).val(year + Math.floor((month + 2)/12) + '-' + (mmm2.length == 1? ('0'+mmm2):mmm2) + '-01')
                    })
                    btn.after(btn1)

                    if(month == 0) year -= 1
                    month = (month+11)%12

                }

            }
            //console.log('findingBtn')

        }

        var outBtnInterval = function(){
            //离开考勤主档的表格
            let beginDate = $(window.frames['main'].document).find('iframe[name=mainFrame]').contents().find('#txtBeginDate')[0]
            if(!beginDate) {
                clearInterval(outBtnId);
                findBtnId = setInterval(findBtnInterval, speedBtn);
                console.log('out Btn')
            }
            //console.log('wiat out Btn')
        }

        //启动
        var findId = setInterval(findTableInterval, speed);
        var outId;
        var findBtnId = setInterval(findBtnInterval, speedBtn);
        var outBtnId;


    }
})();