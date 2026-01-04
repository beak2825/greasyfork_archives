// ==UserScript==
// @name         工时计算
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  计算加班时长
// @author       秦大哥
// @match        http://oa.innovatech.net.cn:8000/com/yj/ScheduleRecord.jsp
// @icon         https://www.google.com/s2/favicons?sz=64&domain=innovatech.net.cn
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476140/%E5%B7%A5%E6%97%B6%E8%AE%A1%E7%AE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/476140/%E5%B7%A5%E6%97%B6%E8%AE%A1%E7%AE%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('加载成功')

    $("tr:contains('人力资源'):last").append(`
            <td style="display:" id="icuLabel" class="fieldName"  colspan="1">加班时长</td>
            <td style="display:" id="" name="" _samepair="" class="field" colspan="1">
		    	<span id="icuTotalValue"></span>
		    </td>
         `)
    let trList = $("#reportList tr")
    let workList = []
    for(let i = 0;i<trList.length;i++){
        let tr = trList[i]
        if(i == 0){
            $(tr).append(`
                <td width="60px" nowrap="">周末</td>
                <td width="60px" nowrap="">非工作日</td>
                <td width="60px" nowrap="">加班时长(小时)</td>
                `)
        }else {
            //日期
            let dateStr = $($(tr).children()[2]).text()
            let date = new Date(dateStr)
            let currentDay = date.getDay()
            let isWeekend = currentDay === 6 || currentDay === 0
            let isHoliday = isWeekend
            console.log("before = "+ isHoliday)
            let storedValue = localStorage.getItem(dateStr)
            if(storedValue != null){
                isHoliday = storedValue == "true"
                console.log("after = "+ isHoliday)
            }
            $(tr).append(`<td width="60px" nowrap="">${isWeekend?"是":"否"}</td>`)
            let checkBox = $("<input/>").attr("type","checkbox").prop({"checked":isHoliday}).change(() =>{
                let checked = checkBox.prop("checked")
                localStorage.setItem(dateStr,checked)
                workList[i - 1].isHoliday = checked
                let newIcuValue = reCalRow(i - 1)
                $($(tr).find("#icuValue")).html(newIcuValue)
                let totalIcuValue = reCalTotalIcu()
                 $("#icuTotalValue").html(`${totalIcuValue}小时`)
            })

            let tdHoliday =$(`<td width="60px" nowrap=""></td>`).append(checkBox)
            $(tr).append(tdHoliday)
            console.log(`date=${date} ${isWeekend?'周末':'不是周末'}`)

            //上班时间
            let onWorkDateStr = $($(tr).children()[3]).text()
            let onWorkDate = new Date(`${dateStr} ${onWorkDateStr}`)
            //下班时间
            let offWorkDateStr = $($(tr).children()[4]).text()
            let offWorkDate = new Date(`${dateStr} ${offWorkDateStr}`)

            //加班时长
            let icuValue = 0
            if(!isHoliday && offWorkDateStr != "00:00"){
                console.log("in icu")
                let icuStartDate = new Date(`${dateStr} 18:30:00`)
                icuValue = (parseInt(offWorkDate - icuStartDate)/1000.0/60/60).toFixed(2)
            }else if(onWorkDateStr != "00:00" && offWorkDateStr != "00:00") {
                console.log("in icu")
                icuValue = (parseInt(offWorkDate - onWorkDate)/1000.0/60/60).toFixed(2)
            }
            if(icuValue < 0){
                icuValue = 0
            }
            $(`<td width="60px" id="icuValue" nowrap="">${icuValue}</td>`).appendTo(tr)

            workList.push({
                date:date,
                dateStr:dateStr,
                onWorkDate:onWorkDate,
                onWorkDateStr:onWorkDateStr,
                offWorkDate:offWorkDate,
                offWorkDateStr:offWorkDateStr,
                isHoliday:isHoliday,
                icuValue:icuValue
            })
        }
        let totalIcuValue = reCalTotalIcu()
        $("#icuTotalValue").html(`${totalIcuValue}小时`)

    }

    //重新计算单行加班时间
    function reCalRow(index){
        let work = workList[index]
        let icuValue = 0
        if(!work.isHoliday && work.offWorkDateStr != "00:00"){
            console.log("in icu")
            let icuStartDate = new Date(`${work.dateStr} 18:30:00`)
            icuValue = (parseInt(work.offWorkDate - icuStartDate)/1000.0/60/60).toFixed(2)
        }else if(work.onWorkDateStr != "00:00" && work.offWorkDateStr != "00:00") {
            console.log("in icu")
            icuValue = (parseInt(work.offWorkDate - work.onWorkDate)/1000.0/60/60).toFixed(2)
        }
        if(icuValue < 0){
            icuValue = 0
        }
        work.icuValue = icuValue
        return icuValue
    }

    //重新计算总时长
    function reCalTotalIcu(){
        let totalIcu = 0
        workList.forEach((item,index) =>{
            totalIcu += parseFloat(item.icuValue)
        })
        return totalIcu.toFixed(2)
    }



})();