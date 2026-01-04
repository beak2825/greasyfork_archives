// ==UserScript==
// @name         微课自动学习
// @namespace    http://blog.simplenaive.cn/
// @version      0.11
// @description  学习内容
// @author       github.com/yidadaa
// @match        http://wb.mycourse.cn/svnweiban/student/study_studyAndTest.action
// @match        http://wb.mycourse.cn/svnweiban/student/home_index.action
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443241/%E5%BE%AE%E8%AF%BE%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/443241/%E5%BE%AE%E8%AF%BE%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    const parseSearchParams = url => {
        url = unescape(url)
        url = url.slice(url.indexOf('?') + 1)
        let query = {}
        url.split('&').map(v => v.split('=')).forEach(v => query[v[0]] = v[1])
        return query
    }
    const request = (userid, jiaoxuejihua) => {
        const time = +new Date()
        const url = `http://cp.mycourse.cn/wxcourse/addJiaoXueJiHuainfo.action?userid=${userid}&jiaoxuejihuaid=${jiaoxuejihua}&_=${time}`
        return fetch(url)
    }
    const fuckCourses = () => {
        const links = Array.from(document.querySelectorAll('a.courseLink'))
            .filter(v => v.querySelector('div.color3'))
            .map(v => {
                const href = v.href
                const { userId, jiaoxuejihuaId } = parseSearchParams(href)
                return request(userId, jiaoxuejihuaId)
            })
        links.length > 0 && Promise.all(links).then(res => {
            alert('已经全部学习完成，考试需要自己完成')
            location.reload()
        })
        return links
    }
    const answerForceQuestions = () => {
        let shouldSubmit = false
        document.querySelectorAll('div.widthPercent90.paddingL_30.border-box').forEach(v => {
            const randSelectIndex = Math.floor(v.childElementCount * Math.random()) // 瞎几把选一个
            v.children[randSelectIndex].click()
            shouldSubmit = true
        })
        shouldSubmit && document.querySelector('.forceQuestionSubmit').click() // ojbk，提交
    }
    switch (location.href) {
        case 'http://wb.mycourse.cn/svnweiban/student/home_index.action':
            answerForceQuestions();
            break
        case 'http://wb.mycourse.cn/svnweiban/student/study_studyAndTest.action':
            fuckCourses()
            break
    }
})();