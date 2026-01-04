// ==UserScript==
// @name         打卡提醒
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       cA7dEm0n
// @include      *
// @match        *
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @require     http://cdnjs.cloudflare.com/ajax/libs/moment.js/2.15.2/moment.min.js
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/401212/%E6%89%93%E5%8D%A1%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/401212/%E6%89%93%E5%8D%A1%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DEFAULT_WORK_START_TIME = "09:00";
    const DEFAULT_WORK_END_TIME = "18:30";

    const REFRESH_MS_TIME = 3000;
    const TIME_FORMAT = "H:m";

    let today = moment().format('L');
    const WORK_SIGN_KEY = `workSign_${today}`;
    const WORK_SIGN_TIME_KEY = `workSignTime_${today}`;
    const OFF_WORK_SIGN_KEY = `offWorkSign_${today}`;
    const OFF_WORK_SIGN_TIME_KEY = `offWorkSignTime_${today}`;

    const DEFAULT_WORK_TIME_MINUTE = Number(moment(DEFAULT_WORK_END_TIME, TIME_FORMAT).diff(moment(DEFAULT_WORK_START_TIME, TIME_FORMAT), 'minute'))

    if (stringInUrl("help!!!")) {
        console.log("setWorkTime    手动设置上班打卡时间,例: http://www.baidu.com/?setWorkTime=09:40")
        console.log("setWorkStatus  手动设置上班打卡状态,例: http://www.baidu.com/?setWorkStatus=true")
        console.log("setOffWorkTime   手动设置下班打卡时间,例: http://www.baidu.com/?setOffWorkTime=18:40")
        console.log("setOffWorkStatus  手动设置下班打卡状态,例: http://www.baidu.com/?setOffWorkStatus=true")
        alert("查看控制台")
    }

    if (getParameterByName("setWorkTime")) {
        let workSignTime = getParameterByName("setWorkTime")
        GM_setValue(WORK_SIGN_TIME_KEY, workSignTime)

        let endTime = moment(workSignTime, TIME_FORMAT).add(DEFAULT_WORK_TIME_MINUTE, 'm').format(TIME_FORMAT)
        GM_setValue(OFF_WORK_SIGN_TIME_KEY, endTime)
        alert(`上班打卡提示时间修改为: ${workSignTime}\n下班打卡提示时间修改为: ${endTime}`)
    }

    if (getParameterByName("setOffWorkTime")) {
        let offWorkSignTime = getParameterByName("setOffWorkTime")
        GM_setValue(OFF_WORK_SIGN_TIME_KEY, offWorkSignTime)
        alert(`下班打卡时间改为\n${offWorkSignTime}`)
    };

    if (getParameterByName("setOffWorkStatus")) {
        let offWorkSignStatus = getParameterByName("setOffWorkStatus")
        let status = offWorkSignStatus == "true" ? true : false
        GM_setValue(OFF_WORK_SIGN_KEY, status)
        alert(`修改下班打卡状态为[${status}]`)
    }

    if (getParameterByName("setWorkStatus")) {
        let workSignStatus = getParameterByName("setWorkStatus")
        let status = workSignStatus == "true" ? true : false
        GM_setValue(WORK_SIGN_KEY, status)
        alert(`修改上班打卡状态为[${status}]`)
    }

    function stringInUrl(name, url) {
        if (!url) url = window.location.href;
        return url.indexOf(name) > 0
    };

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    if (GM_getValue(OFF_WORK_SIGN_KEY, false)) {
        throw new Error("下班已经打卡,进程结束.");
    }

    let workSignTime = GM_getValue(WORK_SIGN_TIME_KEY, DEFAULT_WORK_START_TIME);
    $("body").append(`<div class="pfys">上午打卡时间:${workSignTime}</div>`)
    GM_addStyle(" \
    .pfys { \
        span { display: block; }\
        font-size: 8px;\
        z-index:9999; \
        opacity:0.5; \
        width: 10px; \
        line-height: 20px;\
        height: 40px;\
        position: fixed;\
        word-wrap:break-word; \
        word-break:break-all; \
        right: 1px;\
        top: 120px;\
        text-align: center;\
        -webkit-box-shadow: 1.2px 1.2px 1.2px #000;\
        box-shadow: 1px 1px 1px hsla(0,0%,0%,.4);\
        border-top-left-radius: 3px;\
        border-bottom-left-radius: 3px;\
        transition: all .8s ease 0s;\
        overflow: hidden;\
     }\
     .pfys:hover {\
        opacity:0.88; \
        width: 200px;\
        height: 120px;\
        font-size: 16px;\
        color: #333;\
        background-color: #FAFAFE;\
        line-height: 40px;\
      }\
     .pfys span { \
        display:block; \
      }"
    )

    $(".pfys").hover(function () {
        let offWorkSignTime = GM_getValue(OFF_WORK_SIGN_TIME_KEY, DEFAULT_WORK_END_TIME);
        let timeDiff = offWorkSignTimeMomentObj().diff(moment(), 'minute');
        $(".pfys").html(`<span>上午打卡时间:\t${workSignTime}</span><span> 下午打卡时间:\t${offWorkSignTime}</span><span>还有<b>${timeDiff}</b>分钟放学</span>`);
    });

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    function workSignTimeMomentObj() {
        let workSignTime = GM_getValue(WORK_SIGN_TIME_KEY, DEFAULT_WORK_START_TIME)
        return moment(workSignTime, TIME_FORMAT)
    }

    function offWorkSignTimeMomentObj() {
        let offWorkSignTime = GM_getValue(OFF_WORK_SIGN_TIME_KEY, DEFAULT_WORK_END_TIME)
        return moment(offWorkSignTime, TIME_FORMAT)
    }

    function isWork(timeObj) {
        return timeObj().unix() >= workSignTimeMomentObj().unix();
    };

    function isOffWork(timeObj) {
        return timeObj().unix() >= offWorkSignTimeMomentObj().unix();
    }

    let intervarl = setInterval(main, REFRESH_MS_TIME)

    function main() {
        console.log(`[.] 打卡提醒插件正常运行, 当前[${REFRESH_MS_TIME}ms]检测一次`)
        let nowTime = moment;
        let workSign = GM_getValue(WORK_SIGN_KEY, false);
        if (isWork(nowTime) && !workSign) {
            if (confirm("打卡了吗？")) {
                GM_setValue(WORK_SIGN_KEY, true);
                GM_setValue(WORK_SIGN_TIME_KEY, nowTime().format(TIME_FORMAT));

                let endTime = nowTime().add(DEFAULT_WORK_TIME_MINUTE, 'm').format(TIME_FORMAT)
                GM_setValue(OFF_WORK_SIGN_TIME_KEY, endTime);
            }
        }

        let offWorkSign = GM_getValue(OFF_WORK_SIGN_KEY, false);
        if (isOffWork(nowTime) && offWorkSign == false) {
            if (confirm("下班打卡了吗？")) {
                GM_setValue(OFF_WORK_SIGN_KEY, true);
                console.log(`下班打卡成功:${nowTime().format(TIME_FORMAT)}`);
            } else {
                console.log("打卡失败");
            }
        }
        if (GM_getValue(OFF_WORK_SIGN_KEY, false) == true) {
            console.log("[!] 下班已打卡!!!!")
            clearInterval(intervarl);
        }
    }
})();