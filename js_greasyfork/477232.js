// ==UserScript==
// @name         naver-works-meeting-auto-call
// @version      0.9
// @description  Auto-call for meetings on Naver Works
// @author       Busung Kim, Inwook Jung
// @match        https://calendar.worksmobile.com/main*
// @match        https://calendar.navercorp.com/main*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=worksmobile.com
// @grant        GM_notification
// @grant        GM_openInTab
// @license      MIT
// @namespace    https://greasyfork.org/users/1192532
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment-with-locales.min.js
// @downloadURL https://update.greasyfork.org/scripts/477232/naver-works-meeting-auto-call.user.js
// @updateURL https://update.greasyfork.org/scripts/477232/naver-works-meeting-auto-call.meta.js
// ==/UserScript==

/* global oInitialData, moment */

class Ringtone {
    constructor(src) {
        this.audio = new Audio();
        this.audio.src = src;
    }

    play() {
        this.audio.play();
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
    }
}

(async function() {
    'use strict';

    const ringtone = new Ringtone("https://line-objects-dev.com/lads/naver-works-auto-call/cp77_v_s_ringtone.mp3"); // Cyberpunk 2077

    let todaySchedules = await getTodaySchedules();
    let alreadyAlarmedScheduleIds = new Set();

    const notificationIntervalSec = 30;
    const dataPollingIntervalSec = 120;
    const alarmTriggeringTimeWindowMin = 1;

    setInterval(async () => {
        await sendNotification(todaySchedules, alreadyAlarmedScheduleIds);
    }, notificationIntervalSec * 1_000);

    setInterval(async () => {
        const nextTodaySchedules = await getTodaySchedules();
        if (nextTodaySchedules.length === 0) {
            return;
        }
        todaySchedules = nextTodaySchedules;
    }, dataPollingIntervalSec * 1_000);

    async function sendNotification(schedules, alarmedScheduleIds) {
        const nowTsSec = Math.floor(Date.now()/1000);
        const alarmNeededSchedules = schedules
            .filter((s) => !alarmedScheduleIds.has(s.scheduleId))
            .filter((s) => {
                const startDate = s.repeatDateList?.length > 0 ? s.repeatDateList[0].startDate : s.startDate;
                const tsDiff = Math.floor(Date.parse(startDate)/1000) - nowTsSec;
                return alarmTriggeringTimeWindowMin * -60 <= tsDiff && tsDiff < alarmTriggeringTimeWindowMin * 60;
            });

        const nextAlarmedScheduleIds = new Set(alarmedScheduleIds);
        alarmNeededSchedules.forEach((sc) => {
            ringtone.play();
            GM_notification({
                title: sc.content,
                text: sc.videoMeeting ? 'Click to join the meeting' : 'Time to attend the meeting',
                timeout: 300_000,
                onclick: () => {
                    if (!sc.videoMeeting) {
                        return;
                    }
                    GM_openInTab(sc.videoMeeting.link, {active: true})
                },
                ondone: () => {
                    ringtone.stop();
                    nextAlarmedScheduleIds.add(sc.scheduleId);
                }
            });
        });

        alreadyAlarmedScheduleIds = nextAlarmedScheduleIds;
    }

    async function getTodaySchedules() {
        const timeStamp = new Date().getTime();
        const scheduleQueryRange = [`${moment(timeStamp).format('YYYY-MM-DD HH:mm:ss')}`, `${moment(timeStamp).format('YYYY-MM-DD 23:59:59')}`];

        const res = await fetch('/ajax/GetScheduleList', {
            body: makeRequestBody(scheduleQueryRange),
            method: 'post'
        });

        if (!res.ok) {
            return [];
        }

        const responseBody = await res.json();
        return responseBody.retScheduleList.returnValue;
    }

    function makeRequestBody(scheduleQueryRange = []) {
        const userConfig = oInitialData.oConfig;
        const userId = userConfig.userNo;
        const instanceCode = oInitialData.sLoginUserInstanceCode;
        const myCalendar = oInitialData.aCalendarList.filter((c) => c.owner === userId)[0];

        const body = {
            calendarUidWithInstanceCodeList: [{
                calendarId: myCalendar.calendarId,
                instanceCode: instanceCode
            }],
            startDate: scheduleQueryRange[0],
            endDate: scheduleQueryRange[1],
            userTimezone: userConfig.userTimezone,
        };

        const formData = new FormData();
        formData.append('bo', JSON.stringify(body));
        formData.append('localUserId', userId);

        return formData;
    }
})();