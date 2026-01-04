// ==UserScript==
// @name         oa加班时长计算
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  oa加班时长计算!
// @author       You
// @match        https://oa.transsion.com/wui/main.jsp
// @icon         https://www.google.com/s2/favicons?domain=transsion.com
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440434/oa%E5%8A%A0%E7%8F%AD%E6%97%B6%E9%95%BF%E8%AE%A1%E7%AE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/440434/oa%E5%8A%A0%E7%8F%AD%E6%97%B6%E9%95%BF%E8%AE%A1%E7%AE%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function request(url){
        return new Promise(function(resolve, reject){
            GM_xmlhttpRequest({
                method: "GET",
                header: {
                    'User-Agent': navigator.userAgent
                },
                url: url,
                onload: function(res) {
                    console.log('oa:res >>', res)
                    if (res.status == 200) {
                        var text = res.responseText;
                        var json = JSON.parse(text);
                        console.log(11,json)
                        resolve(json)
                    }
                },
                onError: function(err){
                    console.error(err)
                    reject(err)
                }
            });
        })
    }

    //本程序不能统计到请假时间段，如果涉及到请假日期，请自行手动计算这部分时间
    async function workingHours(){
        const standard = '2020:'
        const today = new Date()
        const year = today.getFullYear()
        const days = today.getDate()
        const month = today.getMonth() + 1
        const limit = days > 2 ? days - 2 : 0//当月已过天数,公司OA接口只能提供前两天的数据

        //获取出勤数据和当月节假日数据
        let attendanceDetail = [], holidaysObject = {}, holidays = []
        const req = await Promise.all([fetch(`https://oa.transsion.com/new_transsion_jsp/sunq/api/getAttendenceData.jsp?page=1&limit=${limit}`), request(`https://timor.tech/api/holiday/year/${year}-${month}`)])
        attendanceDetail = (await req[0].json()).data
        holidaysObject = (await req[1]).holiday
        console.log('holi', holidaysObject)
        attendanceDetail.splice(attendanceDetail.length - 1, 1)//去除接口返回的上月底那天数据
        for (const h in holidaysObject) {
            if (Object.hasOwnProperty.call(holidaysObject, h)) {
                const element = holidaysObject[h]
                holidays.push(element)
            }
        }
        // console.log(attendanceDetail, holidays);

        const result = []
        let overTime = 0
        attendanceDetail.forEach(d => {
            const holiday = holidays.find(item => item.date === d.kqdate)
            if(holiday){//在节假日表中
                if(holiday.holiday && d.firstbrushtime && d.lastbrushtime){//true为节假日，上班时长均算为加班时长
                    const start = new Date(standard + d.firstbrushtime).getTime()
                    const end = new Date(standard + d.lastbrushtime).getTime()
                    overTime += (end - start)
                    console.log(`${d.kqdate} ${d.wk} 节假日加班`, `${(end - start) / 1000 / 60}分钟`)
                }else if(!holiday.holiday && d.firstbrushtime && d.lastbrushtime){//false为公共调休日，按正常上班时间计算
                    const start = new Date(standard + d.firstbrushtime).getTime()
                    let lateTime = start - new Date(standard + d.firstbctime).getTime()
                    lateTime = lateTime < 0 ? 0 : lateTime

                    const end = new Date(standard + d.lastbrushtime).getTime()
                    let ot = end - new Date(standard + '19:00').getTime()
                    ot = ot < 0 ? 0 : ot

                    overTime += (ot - lateTime)

                    console.log(`${d.kqdate} ${d.wk} 公共调休日`, `${(ot - lateTime) / 1000 / 60}分钟`)
                }
            }else if(d.firstbrushtime && d.lastbrushtime){
                if(d.wk === '星期日' || d.wk === '星期六'){
                    const start = new Date(standard + d.firstbrushtime).getTime()
                    const end = new Date(standard + d.lastbrushtime).getTime()
                    overTime += (end - start)
                    console.log(`${d.kqdate} ${d.wk} 周末加班`, `${(end - start) / 1000 / 60}分钟`);
                }else{
                    const start = new Date(standard + d.firstbrushtime).getTime()
                    let lateTime = start - new Date(standard + d.firstbctime).getTime()
                    lateTime = lateTime < 0 ? 0 : lateTime

                    const end = new Date(standard + d.lastbrushtime).getTime()
                    let ot = end - new Date(standard + '19:00').getTime()
                    ot = ot < 0 ? 0 : ot

                    overTime += (ot - lateTime)

                    console.log(`${d.kqdate} ${d.wk} 工作日加班`, `${(ot - lateTime) / 1000 / 60}分钟`)
                }
            }
            result.push({
                kqDate: d.kqdate,
                day: d.wk
            })
        })
        console.warn('本程序不能统计到请假时间段，如果涉及到请假日期，请自行手动计算这部分时间')
        console.log('加班总时长：', `${overTime / 1000 / 60}分钟`)

        return overTime / 1000 / 60;
    }

    window.onload = function(){
        workingHours().then(function(res){
            location.hash = '加班时长:' + res
        })
    }

    // Your code here...
})();