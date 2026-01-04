// ==UserScript==
// @name         CSUCourseSelectionUtil
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  An util for CSU students
// @author       Rika
// @match        http://csujwc.its.csu.edu.cn/jsxsd/xsxkkc/comeInBxqjhxk
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376314/CSUCourseSelectionUtil.user.js
// @updateURL https://update.greasyfork.org/scripts/376314/CSUCourseSelectionUtil.meta.js
// ==/UserScript==

(function () {
    let xkidArray = ["201820192015789",
        "201820192015792",
        "201820192015787",
        "201820192015793",
        "201820192015616",
        "201820192015615",
        "201820192015614",
        "201820192015611",
        "201820192015680",
        "201820192015658",
        "201820192015657",
        "201820192015656",
        "201820192015653",
        "201820192015765",
        "201820192015763"]
    const PostInterval = 10 * 1000
    $('<br><textarea id="log" style="width: 100%;height:10em;"></textarea>').insertAfter('body > font:nth-child(3)')
    const logTxt = $('textarea#log')

    function log(s) {
        logTxt.val(logTxt.val() + `[${(new Date()).toLocaleTimeString()}]${s}\n`)
        logTxt.scrollTop = logTxt.scrollHeight
    }

    function del_and_log(s) {
        let _ = $('textarea#log').val().split('\n').filter(l =>
            l.indexOf('[Now]') < 0
        ).join('\n')
        logTxt.val(_ + `[${(new Date()).toLocaleTimeString()}]${s}\n`)
        logTxt.scrollTop = logTxt.scrollHeight

    }

    log('[Debug]此处将输出自动选课日志')
    log(`[Info]您有${xkidArray.length}门待选的课程`)
    log(`[Info]每${PostInterval / 1000}秒将进行一次尝试`)


    function interval() {
        let cnt = 0, successCnt = 0
        xkidArray.forEach(async (e) => {
            const retJson = JSON.parse(await $.get('/jsxsd/xsxkkc/bxqjhxkOper?jx0404id=' + e))
            // console.log(retJson)
            if (retJson.success) {
                log(`[Info]课程${e}已成功选课！`)
                successCnt++
                xkidArray.splice(xkidArray.indexOf(e), 1)
            }
            cnt++
            if (cnt === xkidArray.length) del_and_log(`[Now]尝试选课${cnt}门，成功${successCnt}门`)
        })
    }

    setInterval(interval, PostInterval)

})()
