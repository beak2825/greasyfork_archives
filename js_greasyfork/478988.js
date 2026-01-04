// ==UserScript==
// @name         🚀云班课一键完成所有资源🚀
// @namespace    http://tampermonkey.net/
// @version      1.1.12
// @description  咕咚，蓝墨云都消失不见了，我大学生涯还没过完呢！！！我还得陪伴云班课数年！！！没有他们我该怎么办！！！不行！！！我得自力更生！！！自己动手写一个！！！
// @author       Handsomedog
// @match        https://www.mosoteach.cn/web/index.php?c=res&m=index&clazz_course_id=*
// @icon
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/478988/%F0%9F%9A%80%E4%BA%91%E7%8F%AD%E8%AF%BE%E4%B8%80%E9%94%AE%E5%AE%8C%E6%88%90%E6%89%80%E6%9C%89%E8%B5%84%E6%BA%90%F0%9F%9A%80.user.js
// @updateURL https://update.greasyfork.org/scripts/478988/%F0%9F%9A%80%E4%BA%91%E7%8F%AD%E8%AF%BE%E4%B8%80%E9%94%AE%E5%AE%8C%E6%88%90%E6%89%80%E6%9C%89%E8%B5%84%E6%BA%90%F0%9F%9A%80.meta.js
// ==/UserScript==

(function () {
  var courseId = document.getElementsByName("clazz_course_id")[0].value//课程ID
  var res = $('div[data-mime]')//文件数组
  var finished = $('span[data-is-drag]')//文件完成情况
  var box = document.getElementsByClassName("create-box manual-order-hide-part")//视频的盒子
  var studyres = document.getElementsByClassName("study-res")[0].children[0].innerHTML//已学习的资源
  var totalres = document.getElementsByClassName("total-res")[0].children[0].innerHTML//总共的资源
  var leaveres = totalres - studyres//剩余资源数
  var deepen = 0
  var nowdeep = 0
  $("#cc-main").append('<div class="progress"><div class="progressBar"><span class="progressBar-value">一键完成所有资源</span></div></div>')
  GM_addStyle(".progress {position: absolute;right:20px;top: 75px;width: 180px;height: 25px;background: #e5e5e5;border-radius: 4px;overflow: hidden;cursor:pointer;}")
  GM_addStyle(".progressBar {  width: 180px;  height: 100%;  display: flex;  justify-content: center;  align-items: center;  background: cornflowerblue;  background-image: linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);background-size: 40px 40px;transition: width .6s ease;border-radius: 4px;animation: progressBar 2s linear infinite;}")
  GM_addStyle(".progressBar-value {  font-size: 13px;  font-weight: bold;  color: white;  margin-right: 0px;}")
  GM_addStyle("@keyframes progressBar {  from {    background-position: 40px 0;  }  to {    background-position: 0 0;  }}")
  var progressBar = document.getElementsByClassName("progressBar")[0]
  var progressBarValue = document.getElementsByClassName("progressBar-value")[0]
  if (leaveres == 0) {
    progressBarValue.innerHTML = `很厉害哦,所有资源都完成啦!!!`
    progressBar.style.cursor = "default"
  }
  $(".progress").click(function () {
    if (leaveres > 0) {
      deepen = (100 / leaveres).toFixed(1)
      progressBarValue.innerHTML = `进度：0%`
      progressBar.style.width = '80px'
      progressBar.style.justifyContent = 'flex-end'
      progressBarValue.style.marginRight = '5px'
    } else {
      return
    }
    setTimeout(function () {
      for (let i = 0; i < res.length; i++) {
        let type = res[i].getAttribute("data-mime")
        let value = res[i].getAttribute("data-value")
        let finish = finished[i * 2].getAttribute("data-is-drag")
        if (finish === 'N') {
          if (type === 'video') {
            let time = box[i].children[4].innerHTML
            let hour = time.substring(0, 2)
            let minute = time.substring(3, 5)
            let second = time.substring(6, 8)
            let alltime = Number(hour * 60 * 60) + Number(minute * 60) + Number(second)
            //console.log(hour, minute, second);
            //console.log(type, value, finish, alltime);
            getVideo(value, alltime)
          } else {
            getResource(value)
          }
        }
      }
    }, 500)
  })

  function getResource (value) {
    $.ajax({
      type: 'head',
      url: 'index.php?c=res&m=online_preview&clazz_course_id=' + courseId + '&file_id=' + value,
      complete: function (res) {
        leaveres -= 1
        if (leaveres <= 0) {
          progressBarValue.innerHTML = `进度：100%`
          progressBar.style.width = '180px'
          location.reload()
        } else {
          nowdeep = getNowDeep(nowdeep)
          progressBar.style.width = Number(nowdeep) + 80 + 'px'
          progressBarValue.innerHTML = `进度：${nowdeep}%`
        }


      }
    });
  }

  function getVideo (value, alltime) {
    $.ajax({
      type: 'post',
      dataType: 'json',
      url: 'index.php?c=res&m=save_watch_to',
      data: {
        clazz_course_id: courseId,
        res_id: value, //当前观看视频资源的id
        watch_to: alltime, //假数据
        duration: alltime,
        current_watch_to: 0 //假数据
      },
      success: function (res) {
        leaveres -= 1
        if (leaveres <= 0) {
          progressBarValue.innerHTML = `进度：100%`
          progressBar.style.width = '180px'
          location.reload()
        } else {
          nowdeep = getNowDeep(nowdeep)
          progressBar.style.width = Number(nowdeep) + 80 + 'px'
          progressBarValue.innerHTML = `进度：${nowdeep}%`
        }

      },
      erorr: function (res) {
        console.log("不知道什么原因,视频观看失败!请到greasyfork反馈一下!");
      }
    });
  }
  function getNowDeep (nowdeep) {
    nowdeep = (Number(nowdeep) + Number(deepen)).toFixed(1)
    if (nowdeep >= 100 - deepen) {
      nowdeep = 100
    } else if (nowdeep - Math.floor(nowdeep) >= 0.5) {
      nowdeep = Math.ceil(nowdeep)
    }
    //console.log(nowdeep);
    return nowdeep
  }
})();