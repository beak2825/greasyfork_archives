
// ==UserScript==
// @name         市场监管总局网络学院
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  进入https://www.samrela.com/student/class_myClassList.do?type=1&menu=myclass 选择专题，进入专题后开始学习
// @author       freeman99sd
// @license MIT
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js
// @require      https://cdn.jsdelivr.net/npm/@supabase/supabase-js@1.0.3/dist/umd/supabase.min.js
// @match        https://www.samrela.com/
// @match        https://www.samrela.com/index.html
// @match        https://www.samrela.com/student/class_detail_course.do?*
// @match        https://www.samrela.com/portal/play.do?*
// @match        https://www.samrela.com/portal/course_detail.do*
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @grant        GM_info
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/466470/%E5%B8%82%E5%9C%BA%E7%9B%91%E7%AE%A1%E6%80%BB%E5%B1%80%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/466470/%E5%B8%82%E5%9C%BA%E7%9B%91%E7%AE%A1%E6%80%BB%E5%B1%80%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2.meta.js
// ==/UserScript==

(async function () {
	'use strict';
  var newWindow
  var stopMark = false
  var stopMarkNum = 0

  var homeUrl = "https://www.samrela.com/"
  var homeIndexUrl = "https://www.samrela.com/index.html"
  var zhuantiListUrl = "https://www.samrela.com/student/class_myClassList.do?type=1&menu=myclass&init=init"
  var classDetailUrl = "https://www.samrela.com/student/class_detail_course.do"
  var courseInfo = "https://www.samrela.com/portal/course_detail.do"
  var courseDetail = "https://www.samrela.com/portal/play.do?"
  if(window.location.href.startsWith(classDetailUrl)) {
    studyClass()
  } else if (window.location.href.startsWith(courseDetail)) {
    playCourse()
  } else if (window.location.href == homeUrl || window.location.href == homeIndexUrl) {
    let res = $(".login_status").css("display")
    if (res == "none") {
      alert("请登录后再开始学习")
    } else {
      window.open(zhuantiListUrl)
    }
  }

  function playCourse() {
    $(document).ready(async() => {
      //5s 后开始播放
      setTimeout(() => {
        if ($(".user_choise").length) {
          $(".user_choise")[0].click()
        }
        $("#course_player").prop('muted', true); 
        setTimeout(() => {
          $("#course_player").prop('muted', true); 
          $("#course_player")[0].play()

          $("#course_player")[0].addEventListener("playing", ()=> {
            stopMark = false
            stopMarkNum = 0
          })

          $("#course_player")[0].addEventListener("ended", ()=> {
            stopMark = true
          })

        }, 10000);
      }, 5000);

      var timer = setInterval(function () {
        if(stopMark) {
          stopMarkNum++
        }
        if(stopMarkNum > 1) {
          clearInterval(timer);
          window.close();
        }
			}, 15000);
    })
  }


  function studyClass() {
    $(document).ready(() => {
      let courseRowArr = $(".hoz_course_row")
      let willStudyArr = [] //待学的
      for(let i = 0; i<courseRowArr.length; i++) {
        let temp = $(courseRowArr[i]).find(".h_pro_percent")
        if (temp.text() != "100.0%") {
          willStudyArr.push(courseRowArr[i])
        }
      }

      if (willStudyArr.length == 0) {
        alert("本专题已学完，请切换专题")
        return
      }

      let reg_count = /addUrl\((.+?)\)/
      let regArr = reg_count.exec($(willStudyArr[0]).find(".hover_btn").attr('onclick'))
      let objId = regArr[1]
      newWindow = window.open("/portal/play.do?id="+ objId, '_blank');

      var timer = setInterval(function () {
				if (newWindow.closed) {
					location.reload();
					clearInterval(timer);
				}
			}, 10000);
    })
  }
})();