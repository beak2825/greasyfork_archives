// ==UserScript==
// @name         小可爱
// @license      @wzhccc
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  建监系统观看视频自动跳过题目弹窗，开始学习章节和课程
// @author       You
// @match        https://jxjymember.cdeledu.com/cdel_jxjy_member/selectCourse/view.do?op=studyCenter*
// @match        https://ware.cdeledu.com/cdel_ware/video/videoList/videoList.shtm?cwareID=*&studyType=*
// @match        https://ware.cdeledu.com/cdel_ware/h5/videoxPlay.shtm?cwareID=*&studyType=*&videoID=*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483193/%E5%B0%8F%E5%8F%AF%E7%88%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/483193/%E5%B0%8F%E5%8F%AF%E7%88%B1.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Your code here...
    // 转化日期
    function getMillions(str) {
        const dateArr = str.replace('小时',':').replace('分','').split(':')
        const hour = Number(dateArr[0])
        const mill = Number(dateArr[1])
        return hour * 60 * 60 * 1000 + mill * 60 * 1000
    }

    // Example POST method implementation:
    async function getData(url = "", data = {}) {
        // Default options are marked with *
        const response = await fetch(url, {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "zh-CN,zh;q=0.9",
                "Connection": "keep-alive",
                "Cookie": document.cookie,
                "Host": "jxjymember.cdeledu.com",
                "Referer": "https://jxjymember.cdeledu.com/cdel_jxjy_member/selectCourse/view.do?op=studyCenterForClass",
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-User": "?1",
                "Upgrade-Insecure-Requests": "1",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "sec-ch-ua": 'Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "Windows"
            },
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }

    //所有课程列表
    const trs = document.querySelectorAll('#courseList tr')
    //开始学习按钮
    const cn = document.querySelectorAll('form[target="_blank"] a')

    //if (trs.length > 0 && cn.length > 0) {
    //if (trs.length > 0) {
        /** trs.forEach((tr, key) => {
            if (key === 0) return
            const trArr = [...tr.querySelectorAll('td')]
            //总时长
            tr.mills = getMillions(trArr.at(-4).innerText)
        })
        let totalMills = 0
        trs.forEach((tr, key) => {
            if (key === 0) return
            setTimeout(() => {
                if (cn.length > 0) {
                    cn[key - 1].click();
                }
            }, totalMills)
            totalMills += tr.mills + 60 * 1000
       }) **/
    //}
    //const cn = document.querySelectorAll('form[target="_blank"] a');
    if (document.querySelector('.dyzs .btn')?.value === '进入班级') {
        //重新进入班级， 课程索引初始化
        localStorage.setItem('cs', 0)
        //点击进入班级
        document.querySelector('.dyzs .btn').click()
    }
    if (cn.length > 0) {
        //保活， 防止长时间不点击，获取不到数据
        setInterval(() => {
            getData("https://jxjymember.cdeledu.com/cdel_jxjy_member/userInfo/view.do?op=modifyUserInfo")
        }, 1000 * 60 * 60 * 1)
        //选课列表页，选择课程点击学习
        if (localStorage.getItem('cs') < cn.length) {
            //模拟点击开始学习
            cn[localStorage.getItem('cs')].click()
            localStorage.setItem('cs', +localStorage.getItem('cs') + 1)
        }
    } else {
       //所有章节列表
       const pls = document.querySelectorAll('.lists a');
       //继续学习按钮
       const jjxx = document.querySelectorAll('.jjxx a');
       //视频按钮
       const vl = document.querySelector('#my-video');
       if (pls.length > 0) {
           //该课程未完成视频个数
           const videos =[...document.querySelectorAll('.lists a')].filter(e => {
               return e.querySelector('font').innerText !== '已学完'
           })
           localStorage.setItem('unplayedNum', videos.length)
           localStorage.setItem('playedNum', 0)
           if (videos.length > 0) {
               setTimeout(() => {
                   //该课程有未播放完成的视频，模拟点击播放视频
                   videos[localStorage.getItem('playedNum')].click()
               }, 500)
           }else {
               //该课程全部已播放完成，打开选课tab页
               window.open('https://jxjymember.cdeledu.com/cdel_jxjy_member/selectCourse/view.do?op=studyCenterForClass')
           }
       }
       else if(vl){
           vl.setAttribute('preload', 'auto')
           vl.addEventListener('ended',() => {
               //每个视频播放完， 该课程已播放视频加1
               localStorage.setItem('playedNum',+localStorage.getItem('playedNum') + 1)
               //该课程全部播放完毕， 自动打开选课的tab页
               if (+localStorage.getItem('unplayedNum') <= +localStorage.getItem('playedNum')) {
                   window.close()
                   window.open('https://jxjymember.cdeledu.com/cdel_jxjy_member/selectCourse/view.do?op=studyCenterForClass')
               }
           })
           //2分钟后视频还是加载中，重新刷新页面
           setTimeout(() => {
               if (document.querySelector('.timeNum')?.innerText === '00:00 / 00:00') {
                   location.reload()
               }
           }, 1000 * 60 * 2)
           const it = setInterval(() => {
               //答题卡确定按钮
               const bEle = document.querySelector('.jbox-button-panel button')
               if (bEle) {
                   //选项卡第一个选项框
                   const vp = document.querySelectorAll('#jbox-content #videoPointContent input')
                   vp[0].setAttribute('checked', true)
                   bEle.click()
               }
           }, 10000)
       }
    }
})();