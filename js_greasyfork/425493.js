// ==UserScript==
// @name         WanXue Video Time
// @namespace    https://jluzh.wanxue.cn/
// @version      0.1
// @description  wanxue video time
// @author       WeiYuanStudio
// @match        https://jluzh.wanxue.cn/*
// @grant        GM.xmlHttpRequest
// @connect      jluzh.wanxue.cn
// @downloadURL https://update.greasyfork.org/scripts/425493/WanXue%20Video%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/425493/WanXue%20Video%20Time.meta.js
// ==/UserScript==

'use strict';

(function () {
    function addTime(courseId, videoId) {
        const userId = $('#loginUserId').attr('value')
        const request = new XMLHttpRequest();
        request.open('POST', 'https://jluzh.wanxue.cn/sls/jwcourse/commitStudyTime', true)
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')

        $.ajax({ url: "../jwcourse/commitStudyTime", data: getMilliseconds({ "avTime": '60', "xtTime": '0', "moduleId": videoId, "courseId": courseId, "courseType": "4", "userId": userId }), type: "POST", async: false, success: function () {} })

    }

    setTimeout(function () {
        $('.f16').each(function () {
            /* modify parent click */
            const onClickExpression = $(this).parent().attr('onClick')
            $(this).parent().attr('onClick', "")
            $(this).parent().on('click', function (e) {
                if (e.target.getAttribute('class') != 'add-time-btn') {
                    eval(onClickExpression)
                }
            })

            /* get video id */
            let videoId = 0
            if (/[0-9]+/.test(onClickExpression)) {
                videoId = /[0-9]+/.exec(onClickExpression)[0]
            }

            /* get course id */
            let courseId = 0

            const parser = document.createElement('a')
            parser.href = window.location.href
            const queryString = parser.search

            courseId = new URLSearchParams(queryString).get('courseId')

            /* if v and c get */
            if (videoId != 0 && courseId != 0) {
                console.log({
                    videoId,
                    courseId
                })
            }

            let addTimeBtn = document.createElement('span')
            addTimeBtn.innerText = "点我增加1分钟学习时长"
            addTimeBtn.setAttribute('class', 'add-time-btn')
            addTimeBtn.setAttribute('style', 'color: red; margin: 0px 20px')
            addTimeBtn.addEventListener('click', function () {
                console.log({
                    videoId,
                    courseId
                })
                addTime(courseId, videoId)
            })
            $(this).append(addTimeBtn)
        })

    }, 1000)
})();
