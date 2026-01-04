
// ==UserScript==
// @name         山西好干部
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  进入https://www.sxgbxx.gov.cn/uc/plan 选择专题，进入专题后开始学习
// @author       freeman99sd
// @license MIT
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js
// @require      https://cdn.jsdelivr.net/npm/@supabase/supabase-js@1.0.3/dist/umd/supabase.min.js
// @match        https://www.sxgbxx.gov.cn/
// @match        https://www.sxgbxx.gov.cn/uc/plan
// @match        https://www.sxgbxx.gov.cn/uc/plan/info?*
// @match        https://www.sxgbxx.gov.cn/front/couinfo*
// @match        https://www.sxgbxx.gov.cn/front/playkpoint*
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
// @downloadURL https://update.greasyfork.org/scripts/466343/%E5%B1%B1%E8%A5%BF%E5%A5%BD%E5%B9%B2%E9%83%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/466343/%E5%B1%B1%E8%A5%BF%E5%A5%BD%E5%B9%B2%E9%83%A8.meta.js
// ==/UserScript==

(async function () {
	'use strict';
  var newWindow

  var homeUrl = "https://www.sxgbxx.gov.cn/"
  var planListUrl = "https://www.sxgbxx.gov.cn/uc/plan"
  var planInfoUrl = "https://www.sxgbxx.gov.cn/uc/plan/info"
  var courseInfo = "https://www.sxgbxx.gov.cn/front/couinfo"
  var courseDetail = "https://www.sxgbxx.gov.cn/front/playkpoint"
  if(window.location.href.startsWith(planInfoUrl)) {
    studyPlan()
  } else if (window.location.href.startsWith(courseInfo)) {
    watchCourse()
  } else if (window.location.href.startsWith(courseDetail)) {
    playCourse()
  } else if (window.location.href == homeUrl) {
    let res = $(".u-login-box.pr")
    if (res.length == 0) {
      alert("请登录后再开始学习")
    } else {
      window.open(planListUrl)
    }
  }

  function playCourse() {
    $(document).ready(async() => {
      //如果当前播放进度为100%，切换到下一个不为100%的
      let currentProgress = $(".chap-seclist ul li.current .c-blue1").text()
      if(currentProgress.trim() == "100%") {
        let arr = $(".chap-seclist")
        for(let i = 0; i< arr.length; i++) {
          if($(arr[i]).find(".c-blue1").text().trim() != "100%") {
            $(arr[i]).find(".kpoint_list").click()
            return
          }
        }
        //所有的都学完，关闭
        window.close();
        return
      }

      //5s 后开始播放
      setTimeout(() => {
          if($(".chap-seclist ul li.current .play-icon-box.image-icon-box").attr("title") == "图文播放") {
              location.reload();
              return
          }
        $(".pv-volumebtn.pv-iconfont.pv-icon-volumeon")[0].click()
        $("button.pv-playpause.pv-iconfont.pv-icon-btn-play")[0].click()
      }, 5000);

      var timer = setInterval(function () {
				let text = $(".pv-time-wrap").text()
        let textArr = text.split("/")
        if(textArr[0].trim() == textArr[1].trim()) {
          clearInterval(timer);
          window.close();
        }
			}, 15000);
    })
  }


  function studyPlan() {
    $(document).ready(() => {
      let courseBtnArr = $("aside.u-f-c-more.my-cou-check")
      let willStudyArr = [] //待学的
      for(let i = 0; i<courseBtnArr.length; i++) {
        let temp = $(courseBtnArr[i]).prev("div.txtOf.mt5.hLh20")
        let reg_count = /总章节数：([0-9]+)\s*已学完章节：([0-9]+)/
        let regArr = reg_count.exec(temp.text())
        if (regArr[1] > regArr[2]) {
          willStudyArr.push(courseBtnArr[i])
        }
      }

      if (willStudyArr.length == 0) {
        alert("本专题已学完，请切换专题")
        return
      }

      $(willStudyArr[0]).find("a").click((e) => {
        e.preventDefault()
        // 打开新窗口并获取窗口对象
        newWindow = window.open($(willStudyArr[0]).find("a").attr('href'), '_blank');
        // 在新窗口加载完成后执行操作
        $(newWindow).on('load', function() {
          // 在新窗口中执行你想要的操作
          // 例如，修改新窗口的内容或调用新窗口的方法
          // 可以使用 newWindow.document 对象来访问新窗口的 DOM
          console.log('新窗口已加载');
        });
      })
      $(willStudyArr[0]).find("a")[0].click()

      var timer = setInterval(function () {
				if (newWindow.closed) {
					location.reload();
					clearInterval(timer);
				}
			}, 10000);
    })
  }

  function watchCourse() {
    $(document).ready(() => {
      $("a.bm-lr-btn").click()
    })
  }

})();