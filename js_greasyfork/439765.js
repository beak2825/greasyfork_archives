// ==UserScript==
// @name         NUIST TimeTable Export
// @version      0.1
// @description  南信大课表导出为 iCal 格式
// @author       凌莞
// @license MIT
// @match        http://bkxk.nuist.edu.cn/*/student/mykebiaoall1.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nuist.edu.cn
// @grant        none
// @namespace https://greasyfork.org/users/874549
// @downloadURL https://update.greasyfork.org/scripts/439765/NUIST%20TimeTable%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/439765/NUIST%20TimeTable%20Export.meta.js
// ==/UserScript==

((neko, nya) => {
    const INFO_SEPERATOR = '◇';
    const TIMETABLE = [
        // [begin, end]
        ['080000', '094000'],
        ['101000', '115000'],
        ['134500', '152500'],
        ['155500', '173500'],
        ['184500', '202500'],
    ];
    const WEEKS = 16;
    // 开学第一周的星期一
    const FIRST_SCHOOL_DAY = new Date('2022-02-21');

    const ONE_DAY = 24 * 60 * 60 * 1000;
    const lastOf = (iterable) => iterable[iterable.length - 1];
    const $ = neko
    Date.prototype.format = function (fmt) {
        var o = {
            'M+': this.getMonth() + 1, //月份
            'd+': this.getDate(), //日
            'h+': this.getHours(), //小时
            'm+': this.getMinutes(), //分
            's+': this.getSeconds(), //秒
            'q+': Math.floor((this.getMonth() + 3) / 3), //季度
            S: this.getMilliseconds(), //毫秒
        }
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        for (var k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
            }
        }
        return fmt
    }

    /**
     * 将课表上的课程文本转换成对象
     * @param {string} lesson 课表上的课程文本，暂不支持黑色菱形（多节课）
     * 
     * 如：数字图像处理◇范春年(1-16)(软工合作20(2)班;软工合作20(1)班;)◇(西苑)揽江楼N505◇多媒体教室◇{12节}
     */
    function parselesson(lesson) {
        if (!lesson.trim()) return null
        const info = lesson.split(INFO_SEPERATOR);
        const name = info[0].trim();
        let place = info.length === 5 ? info[2].trim() : '';
        if (['(西苑)', '(东苑)', '(中苑)'].some(it => place.startsWith(it))) {
            place = place.substring(4);
        }
        const infoPart2 = parseInfo(info[1].trim());
        const teacher = infoPart2[0];
        // 一起上课的班级
        const coClass = infoPart2.length === 3 ? infoPart2[2] : '';
        let weeks = [1, WEEKS];
        if (infoPart2.length === 3) {
            const weeksExec = /(\d+)-(\d+)/.exec(infoPart2[1]);
            weeks = [parseInt(weeksExec[1]), parseInt(weeksExec[2])];
        }
        let weekSpec = 'all';
        lastOf(info).startsWith('单周') && (weekSpec = 'odd');
        lastOf(info).startsWith('双周') && (weekSpec = 'even');
        return { name, place, teacher, coClass, weeks, weekSpec, raw: lesson };
    }

    /**
     * 解析课程文本的第二串
     * @param {string} info 第二串信息，大概包含老师姓名，周次，班级
     * 
     * 如：范春年(1-16)(软工合作20(2)班;软工合作20(1)班;)
     */
    function parseInfo(info) {
        let lastBrackletLength = 0;
        const infoArray = [''];
        for (const i of info) {
            if (i === '(') {
                lastBrackletLength++;
                if (lastBrackletLength === 1)
                    lastOf(infoArray) !== '' && infoArray.push('');
                else
                    infoArray[infoArray.length - 1] += i;
            }
            else if (i === ')') {
                lastBrackletLength--;
                if (lastBrackletLength === 0)
                    lastOf(infoArray) !== '' && infoArray.push('');
                else
                    infoArray[infoArray.length - 1] += i;
            }
            else {
                infoArray[infoArray.length - 1] += i;
            }

        }
        if (lastOf(infoArray) === '')
            infoArray.pop();
        return infoArray;
    }

    function getSessionTimeWrapper(beginEnd) {
        return (weekday, session, isEvenWeek, firstWeek) => {
            weekday += firstWeek - 1;
            isEvenWeek && (weekday += 7);
            const firstLessonDay = new Date(FIRST_SCHOOL_DAY.getTime() + weekday * ONE_DAY);
            return `${firstLessonDay.format('yyyyMMdd')}T${TIMETABLE[session][beginEnd]}`;
        }
    }

    const getSessionBeginTime = getSessionTimeWrapper(0);
    const getSessionEndTime = getSessionTimeWrapper(1);

    /**
     * 根据网页获取课程列表
     */
    function getLessonInfos() {
        const $rows = $('table#TABLE1>tbody>tr');
        const weekdays = [];
        for (let i = 1; i < 7; i++) {
            const $row = $rows.eq(i);
            const sessions = [];
            for (let j = 1; j < 6; j++) {
                sessions.push(parselesson($row.children().eq(j).text()));
            }
            weekdays.push(sessions);
        }
        return weekdays;
    }

    function getPageInfo() {
        const schoolYear = $('select#DropDownList1').val()
        const semester = $('select#DropDownList2').val()
        return `${schoolYear} 学年第 ${semester} 学期课表`
    }

    function convertTimeTableToRfc5545(title, timeTable) {
        let icsData = `BEGIN:VCALENDAR
PRODID:-//Clansty//NUIST TimeTable Export 1.0//EN
VERSION:2.0
CALSCALE:GREGORIAN
X-WR-CALNAME:${title}
X-WR-TIMEZONE:Asia/Shanghai
BEGIN:VTIMEZONE
TZID:Asia/Shanghai
X-LIC-LOCATION:Asia/Shanghai
BEGIN:STANDARD
TZOFFSETFROM:+0800
TZOFFSETTO:+0800
TZNAME:CST
DTSTART:19700101T000000
END:STANDARD
END:VTIMEZONE`

        let idCount = 1000;
        const id = () => ++idCount;

        /**
         * 把课程写入 ics
         * @param {object} lesson 课程对象
         * @param {number} weekday 星期几
         * @param {number} session 第几节
         */
        const writeLesson = (lesson, weekday, session) => {
            if (!lesson) return;
            const WEEKDAYS = ['MO', 'TU', 'WE', 'TH', 'FR'];
            const { name, place, teacher, coClass, weeks, weekSpec, raw } = lesson;
            const lessonWeeks = weeks[1] - weeks[0] + 1;
            icsData += `
BEGIN:VEVENT
DTSTART;TZID=Asia/Shanghai:${getSessionBeginTime(weekday, session, weekSpec === 'even', weeks[0])}
DTEND;TZID=Asia/Shanghai:${getSessionEndTime(weekday, session, weekSpec === 'even', weeks[0])}
DTSTAMP:${new Date().format('yyyyMMddThhmmss')}
UID:${id()}@clansty.com
SUMMARY:${name}
DESCRIPTION:${teacher}\\n${coClass}\\n\\n${raw}
LOCATION:${place}
RRULE:FREQ=WEEKLY;WKST=MO;INTERVAL=${weekSpec === 'all' ? 1 : 2};BYDAY=${WEEKDAYS[weekday]
                };COUNT=${Math.floor(weekSpec === 'all' ? lessonWeeks : lessonWeeks / 2)}
END:VEVENT`
        }

        // 节次
        for (let session = 0; session < timeTable.length; session++) {
            // 星期几
            for (let weekday = 0; weekday < timeTable[session].length; weekday++) {
                const lesson = timeTable[session][weekday];
                lesson && writeLesson(lesson, weekday, session);
            }
        }

        icsData += '\nEND:VCALENDAR';
        return icsData;
    }

    function downloadText(content, filename) {
        const blob = new Blob([content]);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
    }

    function doGetIcs() {
        const title = getPageInfo();
        const icsContent = convertTimeTableToRfc5545(title, getLessonInfos());
        downloadText(icsContent, `${title}-${new Date().format('yyyyMMddhhmmss')}.ics`);
    }

    function injectExportButton() {
        const btn = document.createElement('input');
        btn.type = 'button';
        btn.value = '导出为 iCal';
        btn.onclick = doGetIcs;

        $('input#Button1').after(btn);
    }

    injectExportButton();
})(jQuery)