// ==UserScript==
// @name         zqy爱学习
// @namespace    http://tampermonkey.net/
// @version      2077-04-11
// @description  私人刷视频脚本
// @author       fxalll
// @match        https://cela.gwypx.com.cn/portal/special_recommend_hot.do?infopush_id=48&menu=special&subjectId=1225&cela_sso_logged=true
// @match        https://cela.gwypx.com.cn/portal/course_detail.do?*
// @match        https://cela.gwypx.com.cn/portal/playnew.do?menu=course&*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gd.gov.cn
// @license      WTFPL
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491476/zqy%E7%88%B1%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/491476/zqy%E7%88%B1%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function () {
  'use strict';
  console.log("脚本开始运行")

  if (location.pathname === '/portal/special_recommend_hot.do') {
    // 专题课程页面
    let doList = []
    document.querySelectorAll('.h_pro_percent').forEach((e) => {
      if (e.innerText !== "100.0%") {
        doList.push(e)
      }
    })
    if (doList[0] === undefined) {
      alert('当前所有视频已看完！')
      return;
    } else {
      console.log(doList)
      console.log(`当前还有${doList.length}视频`)
      doList[0].click();

      setTimeout(() => {
        window.location.href = 'about:blank'
        window.close()
      }, 5000)
    }

  } else if (location.pathname === '/portal/course_detail.do') {
    // 进入课程页面
    console.log("进入课程页面")
    function clickBtn () {
      console.log("点击按钮")
      console.log(document.querySelector('.hover_btn').innerText)
      if (document.querySelector('.hover_btn').innerText === '我要学习') {
        setTimeout(() => {
          document.querySelector('.hover_btn').click()
          window.close()
        }, 100)

      } else {

        setTimeout(() => {
          // 关闭警告弹窗
          window.alert = function (str) {
            return;
          }
          // 点击选课按钮
          document.querySelector('.hover_btn').click()
          if (document.querySelector('.hover_btn').innerText != '') {
            clickBtn();
          } else {
            setTimeout(() => {
              window.location.href = 'about:blank'
              window.close()
            }, 50)
          }

        }, 500)
      }


    }
    let interval1 = setInterval(() => {
      try {
        clickBtn()
        clearInterval(interval1)
      } catch (err) {
        clickBtn()
      }
    }, 1000)

  } else if (location.pathname === '/portal/playnew.do') {
    // 如果打开了视频页面
    console.log("进入视频页面")
    function detectVideo () {
      let videoEle = window.frames['course_frm'].contentDocument.querySelector('video');
      if (videoEle.currentTime / videoEle.duration > 0.9995) {
        console.log("ok")
        window.open("https://cela.gwypx.com.cn/portal/special_recommend_hot.do?infopush_id=48&menu=special&subjectId=1225&cela_sso_logged=true")
        clearInterval(interval2);
        setTimeout(() => {
          window.close()
        }, 5000)

      } else {
        console.log(`还在看视频，目前进度${(videoEle.currentTime / videoEle.duration) * 100}%`)
        try {
          // 防止视频被暂停
            //console.log(window.frames['course_frm'].contentDocument.querySelector('.pause'))
          if (window.frames['course_frm'].contentDocument.querySelector('.pause') !== null) {
            window.frames['course_frm'].contentDocument.querySelector('.outter').click()
          }
            window.frames['course_frm'].contentDocument.querySelector('video').volume=0
            window.frames['course_frm'].contentDocument.querySelector('video').play()

        } catch (err) {
        console.log(err)
        }
      }
    }


    let interval2 = setInterval(() => {
      detectVideo()
    }, 1000)




  }
})()