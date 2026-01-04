// ==UserScript==
// @name         PeopleSoft Export
// @namespace    peoplesoft_export
// @match        *://scrsprd.zju.edu.cn/*
// @version      0.0.1
// @license      MIT
// @description  ha ha ha ha ha ha ha ha ha ha ha !
// @author       NaN
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.2/jquery.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/462269/PeopleSoft%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/462269/PeopleSoft%20Export.meta.js
// ==/UserScript==

(function () {
    'use strict';


    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }


    // Your code here...
    var until = '20230524T000000';
    // yyyymmdd hhmmss
    var first_Sunday = new Date('2023-2-12');
    function getCourseTime(week, timeInfo) {
        // alert(timeInfo);
        let thatDay = new Date(first_Sunday.getTime() + 86400000 * week);
        var year = String(thatDay.getFullYear());
        var month = String(thatDay.getMonth() + 1).padStart(2, 0);
        var date = String(thatDay.getDate()).padStart(2, 0);
        var times = /(\d+):(\d+)([上下])午/.exec(timeInfo).slice(1);
        if (times[2] == '下') times[0] = String(Number(times[0]) + 12);
        times[0] = times[0].padStart(2, 0);
        return `${year}${month}${date}T${times[0]}${times[1]}00`;
    };



    var btn = $('<span>导出日程表</span>');
    $('div#win0divPAGEBAR').after(btn);


    btn.click(() => {
        var maxTime = Array(8);
        var startTime = Array(8);

        var ics = '';

        console.clear();
        $('.SSSTEXTWEEKLY').each((index, ele) => {
            let content = $(ele).html().split('<br>');
            let info = content.slice(0, 5);
            let staff = content.slice(5);
            let from_to = info[3].split(' - ');
            let days = $(ele).parent().index();
            // console.log($(ele).siblings());
            // return;
            if(!$(ele).parent().siblings().hasClass('SSSWEEKLYTIMEBACKGROUND'))
                days++;

            let from = getCourseTime(1, from_to[0]).slice(-6);
            let to = getCourseTime(1, from_to[1]).slice(-6);

            console.log(content[0], '-------------------\n', days);

            let week = 1;
            while(days){
                if(maxTime[week] == undefined || maxTime[week] <= from
                    || startTime[week] >= from)
                    days--, console.log('fill', week, ':', maxTime[week], startTime[week]);
                week++;
            }
            week--;
            from = getCourseTime(week, from_to[0]);
            to = getCourseTime(week, from_to[1]);

            // do{
            //     week++;
            //     // alert($(ele).siblings());
            //     from = getCourseTime(week, from_to[0]);
            //     to = getCourseTime(week, from_to[1]);
            // } while(maxTime[week] != undefined && maxTime[week] > from)
            maxTime[week] = to.slice(-6);
            startTime[week] = from.slice(-6);

            console.log(content[0], '====================\n', week);

                ics +=
                `
BEGIN:VEVENT
SUMMARY:${info.slice(0, 3).join('\\n')}
DTSTART:${getCourseTime(week, from_to[0])}
DTEND:${getCourseTime(week, from_to[1])}
RRULE:FREQ=WEEKLY;UNTIL=${until}
UID:course${index}
DESCRIPTION:${staff.join('\\n')}
LOCATION:${info[4]}
END:VEVENT
`;
            // console.log(info, staff);
        });



        ics =
`BEGIN:VCALENDAR
PRODID:-//PeopleSoftExport//CN
VERSION:2.0
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:My School Timetable
X-WR-TIMEZONE:Asia/Shanghai`
            + ics +
            `END:VCALENDAR #日历结束`;

            console.log(ics);
            download('shedule.ics', ics);
    });
})();