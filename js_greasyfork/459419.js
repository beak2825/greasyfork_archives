// ==UserScript==
// @name         山东执业医师继续教育
// @namespace    1721384107@qq.com
// @version      2.0
// @description  山东药师刷课脚本
// @author       winegd
// @match        https://www.sdlpa.org.cn/*
// @match        https://sdu.sdlpa.org.cn/*
// @icon         data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkIxNEIyNjFEMDAyNDExRTVCNzNGRUVGNEJFRTU3OENGIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkIxNEIyNjFFMDAyNDExRTVCNzNGRUVGNEJFRTU3OENGIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QjE0QjI2MUIwMDI0MTFFNUI3M0ZFRUY0QkVFNTc4Q0YiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QjE0QjI2MUMwMDI0MTFFNUI3M0ZFRUY0QkVFNTc4Q0YiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5802I/AAACGUlEQVR42pyTz0tUURTH7/uF44zMjC0EcRpdBA5a6qKgRWk/lFo1I4GbMA01khbWf1B/QGCLkBDBCMZSI42WgxSirsoZMWg5QjKKLYZEZvS9d1/fM5wnF3PVhQ/nvnvv+95zvuc9zfM8oY4nQ7MUmkAeXANZEAXF8am+ojgxzFNeJAbAV45vWKAdPDgpoPkZQKADYQxkwAFYwI3qHokkQQ5M+3sVAT7QCiJg9dX5iSxfkOD1D483R0kgxeu/wWcS0XmBNs+BNBazSoa94DlNIEoeTLM3N9kfYeL2ikHgI0fB9d4Gj8BZ8AJ8Yl/oggaOxxlQbbpfF0Yj6AL1VCa4AW7RBneiGwweezDc9zasedofV3fFUiIjtqO/fKFJ0Ama6WFo5aFwdEcEAlab7bjm6/S9734G3Z7miYBdLVoKrWqXXoJn/gMJm64pymV733XkRbWEoH8odFgjpCYrN2FsgnfAcAxb5GLrQuoSNWnUe1v9kMKma9VOXp2gNqZ0T4+ALd7bAHexP1+IFO5D+KkhjThU9tQMfkC1RzGwgyMRBkdsahM8uoCzlzH/pmaw7OpOf2ojGV9oW1zkdhb5+4iyF9HETsv75t3EdfhFLS2oAhJ1z5zZr+scWR6N2Ya9JjV325JWvmSVyJNg6ChUj/SvoFtfIPDzn5+J0kQbM4DacAlp3sELe1VOFdVajXkt4hxezp/6M/3v+CvAACvoyrZL083WAAAAAElFTkSuQmCC
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @require      http://code.jquery.com/jquery-migrate-1.2.1.min.js



// @downloadURL https://update.greasyfork.org/scripts/459419/%E5%B1%B1%E4%B8%9C%E6%89%A7%E4%B8%9A%E5%8C%BB%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/459419/%E5%B1%B1%E4%B8%9C%E6%89%A7%E4%B8%9A%E5%8C%BB%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */


(function () {
  'use strict';
  console.log('山东药师继续教育刷课脚本执行')
  try { layer.open = function () { }; }
  catch (e) { console.log(e) }
  var pathname = unsafeWindow.location.pathname;
  var currentURL = window.location.href;
  var pat = new RegExp("/Learning/VideoH52/*");
  var pat2 = new RegExp("/Exam/SingleExam/*")
  var pat3 = new RegExp("/Learning/Video1/*")
  var pat4 = new RegExp("sdu.sdlpa.org.cn/*")
  var pat5 = new RegExp("sddfvc.sdlpa.org.cn/*")
  var pat6 = new RegExp("sdutcm.sdlpa.org.cn/*")

  var pj = new RegExp("/CourseAssess")
  // new Promise(function () {

  if (pat4.test(currentURL) || pat5.test(currentURL) || pat6.test(currentURL)) {
    console.log('当前为山大学习页面')
    var sd_pathname = unsafeWindow.location.pathname;

    var sd_pat_stduy = new RegExp("/home/CourseList/*")
    var sd_pat_stduy2 = new RegExp("/home/courselist/*")
    var sd_pat_exam = new RegExp("/home/Exam/*")
    var sd_pat_video = new RegExp("/home/Video/*")
    try {
      let xuexi_btn = document.querySelector("body > div.content > div > div.layui-col-md4.rightCont > div:nth-child(1) > a")
      xuexi_btn.click()
    } catch (error) {
      // console.log(error)
    }

    if (sd_pat_stduy.test(sd_pathname) || sd_pat_stduy2.test(sd_pathname)) {
      var tbody = document.querySelector('tbody');

      // 使用 querySelectorAll 获取 tbody 下的所有 tr 元素
      let allTr = tbody.querySelectorAll('tr');

      $('body').append(('<button class="b6" style="width:100px;height:50px;color:red;font-size:20px;position:absolute;left:100px;top:1000px">刷课中..</button>'))
      // console.log(ttr_list)
      GM_setValue('p_len', allTr.length)
      let t = 0
      for (let ttr of allTr) {
        t++
        let statue = ttr.children[3].innerText

        let jindu = ttr.children[1].innerText
        if (jindu == '100%' && statue == '未通过') {
          let kasohi = ttr.children[4].children[0].children[1]
          kasohi.click()
          break
        }
        if (jindu != '100%') {
          console.log('开始学习')
          let study = ttr.children[4].children[0].children[0]
          study.click()
          break
        }



      }
      GM_setValue('p_n_len', t + 1)
      // setVideoData()
      // sd_video()

      if (t == allTr.length) {
        $('.b6').text('已学完')
      }
    } else if (sd_pat_exam.test(sd_pathname)) {
      console.log('考试')
      try {
        let trs = document.querySelector("body > div.aui_state_lock > div > table > tbody > tr:nth-child(2) > td.aui_c > div > table > tbody").querySelectorAll('tr')

        let pinjia = trs[1].querySelector('.aui_content').children[0].querySelectorAll('ul')

        for (let p of pinjia) {
          p.children[4].click()
        }
        let btn = trs[2].querySelector('button')
        btn.click()

      } catch (e) {
        console.log(e)
      }

      handleExam()
    } else if (sd_pat_video.test(sd_pathname)) {
      console.log('监听视频播放')
      function attachPauseListener () {
        var videoElement = $("video").get(0);

        // 如果找到 video 元素
        if (videoElement) {

          setVideoData()

          // 清除 interval，因为已经找到 video 元素并附加了事件监听器
          clearInterval(checkVideoInterval);
        }
      }

      // 使用 setInterval 检查 video 元素是否存在
      var checkVideoInterval = setInterval(function () {
        attachPauseListener();
      }, 500);




    }
  } else {
    console.log(pathname)
    if (pathname == '/Learning/Default1' || pathname == '/learning/Default1') {
      $('body').append(('<button class="b6" style="width:100px;height:50px;color:red;font-size:20px;position:absolute;left:100px;top:100px">刷课中..</button>'))
      let ttr_list = document.querySelectorAll('.ttr')
      // console.log(ttr_list)
      let t = 0
      for (let ttr of ttr_list) {
        t++
        if (ttr.children[3].innerText == '听课中' || ttr.children[3].innerText == '待考试') {
          ttr.children[4].children[0].click()
          setTimeout(() => {
            let ttr_list_2 = document.querySelectorAll('.ttr')
            console.log(ttr_list_2.length)

            GM_setValue('p_len', ttr_list_2.length)
            let flag = 1
            for (let ttr_2 of ttr_list_2) {
              // console.log(ttr_2.children[1].children)
              try {
                let xxjd = ttr_2.children[2].innerText
                console.log(xxjd)
                // if (ttr_2.children[2].innerText == '听课中' || ttr_2.children[2].innerText == '待学习') {
                if (xxjd != '通过' && xxjd != '去考试') {

                  ttr_2.children[4].children[0].click()
                  // location.reload()
                  console.log("点击学习进入视频列表")

                  GM_setValue('p_n_len', flag)
                  break
                } else {
                  flag++
                  if (xxjd == '去考试') {

                    unsafeWindow.open(ttr_2.children[2].children[0].href)
                    break
                  }
                }
              } catch (error) {

              }

            }
            setTimeout(() => {
              // document.querySelector("#default_load > div:nth-child(2) > div.noticetitle1 > a:nth-child(2)").click()

              let ttr_list_3 = document.querySelectorAll('.ttr')
              console.log(ttr_list_3.length)
              let len = ttr_list_3.length - 1
              if (ttr_list_3[len].children[2].innerText == '') {
                GM_setValue('len', len)
              } else {
                GM_setValue('len', len + 1)
              }
              console.log('设置len完成' + len)
              // document.querySelector("#default_load > div:nth-child(2) > div.noticetitle1 > a:nth-child(2)").click()
              // console.log("点击刷新")
              // setTimeout(() => { console.log(111) }, 2000);
              console.log("列表长度")

              console.log(ttr_list_3.length)
              for (let i = 0; i <= len; i++) {

                // console.log(ttr_list_3[i].children[1].children)
                let shichang = ttr_list_3[i].children[2].innerText
                console.log("视频时长" + shichang)
                if (shichang == "0.0") {
                  console.log(shichang == "0.0")

                  GM_setValue('n_len', i + 1)
                  console.log('设置n_len完成')

                  let a = ttr_list_3[i].children[0].children[0].href

                  unsafeWindow.open(a)
                  break
                } else if (shichang != '') {
                  let all_times = ttr_list_3[i].children[1].innerText.split(':')
                  let all_time = 3600 * all_times[0] + 60 * all_times[1] + parseInt(all_times[2])
                  let local_times = ttr_list_3[i].children[2].innerText.split(':')
                  let local_time = 3600 * local_times[0] + 60 * local_times[1] + parseInt(local_times[2])
                  if (local_time >= all_time) {
                    continue
                  } else {
                    GM_setValue('n_len', i + 1)

                    // ttr_list_3[i].children[0].children[0].click()
                    let a = ttr_list_3[i].children[0].children[0].href


                    unsafeWindow.open(a)

                    break
                  }
                }

              }
            }, 2000);

          }, 2000);
          break

        }

      }

      if (t == ttr_list.length) {
        $('.b6').text('已学完')
      }

    } else if (pat.test(pathname)) {

      $('body').append(('<button style="width:100px;height:50px;color:red;font-size:20px;position:absolute;left:100px;top:100px">刷课中..</button>'))
      $('body').append(('<button class="b2" style="width:100px;height:50px;color:red;font-size:20px;position:absolute;left:100px;top:150px"></button>'))
      $('body').append(('<button class="b3" style="width:100px;height:50px;color:red;font-size:20px;position:absolute;left:100px;top:200px"></button>'))
      $('body').append(('<button class="b4" style="width:200px;height:50px;color:red;font-size:20px;position:absolute;left:50px;top:250px"></button>'))

      let p_n_len = GM_getValue('p_n_len')
      let p_len = GM_getValue('p_len')
      let n_len = GM_getValue('n_len')
      let len = GM_getValue('len')
      $('.b2').text(p_n_len + '/' + p_len)
      $('.b3').text(n_len + '/' + len)

      console.log(p_n_len + '/' + p_len)
      console.log(n_len + '/' + len)


      $(unsafeWindow).unbind('beforeunload')
      unsafeWindow.onbeforeunload = null


      $("video").prop('muted', true);

      setInterval(() => {

        $('.b4').text('当前视频进度: ' + parseInt((parseInt(player.currentTime) / parseInt(player.duration)) * 100) + '%')
      }, 20000);



      $("video").get(0).addEventListener("pause", function () {
        console.log("视频暂停播放")
        $("video").prop('muted', true);


        layer.closeAll();
        console.log("关闭弹窗")
        $("video").get(0).play();
        console.log("开始播放")


      }, false);

      $("video").get(0).addEventListener('playing', function () {
        $("video").prop('muted', true);
        $("video").get(0).play();
        $('.b4').text('当前视频进度: ' + parseInt((parseInt(player.currentTime) / parseInt(player.duration)) * 100) + '%')


      }, false);

      $("video").get(0).addEventListener('ended', function () { //结束
        console.log("播放结束");
        // window.opener = null;
        // window.close();
        // location.reload()
        let queryString = window.location.search;
        let params = new URLSearchParams(queryString);
        let wid = params.get("wId");
        let path = window.location.pathname.split('/')
        console.log('cid: ' + path[path.length - 1])
        console.log('wid: ' + wid)
        var lastdata = new FormData();
        lastdata.append('cid', path[path.length - 1]);
        lastdata.append('wid', wid);
        lastdata.append('time', tempSubmitTimes);
        navigator.sendBeacon('/Service/SaveTime', lastdata);
        upload()
        setTimeout(() => {
          $(unsafeWindow).unbind('beforeunload')
          unsafeWindow.onbeforeunload = null
          // location.replace('https://www.sdlpa.org.cn/Learning/Default1')

          unsafeWindow.close();

          // document.querySelector("#default_load > div:nth-child(2) > div.noticetitle1 > a:nth-child(2)").click()
          // console.log("点击刷新")
          unsafeWindow.opener.location.reload()
        }, 2000)

      }, false);


    }
    else if (pat2.test(pathname)) {
      $('body').append(('<button class="b7" style="width:300px;height:50px;color:red;font-size:20px;position:absolute;left:100px;top:100px">答题中</button>'))
      // flag = 0
      let flag = parseInt(GM_getValue('flag'))
      if (isNaN(flag)) {
        flag = 0;
        GM_setValue('flag', 0)
      }
      console.log(flag)
      console.log('考试页面')
      let answer = ['A', 'B', 'C', 'D']
      let temp = parseInt(flag) + 1
      if (flag >= 0 && flag < 10) {
        $('.b7').text('第' + temp + '次答题  ' + '当前为随机答案')
        console.log('当前为随机答案')
        for (let q of jsonQuestion) {
          q.answer = answer[Math.floor(Math.random() * answer.length)]
          // q.answer = 'A'
        }
      } if (flag >= 10 && flag <= 20) {
        $('.b7').text('第' + temp + '次答题  ' + '当前为全是A答案')
        console.log('当前为全是A答案')
        for (let q of jsonQuestion) {
          // q.answer = answer[Math.floor(Math.random() * answer.length)]
          q.answer = 'A'

        }
      } else if (flag > 20) {
        GM_setValue('flag', 0)
        $('.b7').text('尝试次数过多，暂时退出')
        setTimeout(() => {
          unsafeWindow.close()
          unsafeWindow.opener.location.reload()
        }, 1000);

      }

      console.log(jsonQuestion)


      setTimeout(() => {
        ajaxPostExam(jsonQuestion)

      }, 1000);

      setTimeout(() => {

        let socre = document.querySelector("body > div.aui_state_focus > div > table > tbody > tr:nth-child(2) > td.aui_c > div > table > tbody > tr:nth-child(2) > td.aui_main > div").innerText.replace(/[^\d]/g, " ")
        if (parseInt(socre) >= 60) {
          GM_setValue('flag', 0)
          console.log('考试通过')
          document.querySelector("body > div.aui_state_focus > div > table > tbody > tr:nth-child(2) > td.aui_c > div > table > tbody > tr:nth-child(3) > td > div > button.aui_state_highlight").click()
          unsafeWindow.opener.location.reload()
        } else {
          flag++
          GM_setValue('flag', flag)
          unsafeWindow.location.reload()
        }
      }, 3000)




      // let t_cid = document.URL.split('?')[1].split('=')[1]
      // let t_pid = document.querySelector("#questionIdsDiv > dl > dd").children[0].href.split('?')[1].split('=')[1]
      // console.log(t_cid, t_pid)











    }
    else if (pj.test(pathname)) {
      let pj_list = document.querySelectorAll('.star')
      let i = 0;
      for (let star of pj_list) {
        star.children[1].children[4].click()
      }
      setTimeout(() => {
        document.querySelector("#next").click()
      }, 1000);

      setTimeout(() => {
        unsafeWindow.close()
        unsafeWindow.opener.location.reload()
      }, 1000);


    } else if (pat3.test(pathname)) {
      handleFlash()

    } else {

    }
  }

})();

function setVideoData () {

  let works = document.querySelector("#courseList").children
  let work_p = 0
  let work_p_n = 0
  // GM_setValue('work_len', p_list.length)
  // console.log('work_len: ' + works.length)
  for (let w of works) {
    let p_list = w.querySelectorAll('li')

    for (let p of p_list) {
      let temp = p.querySelector('.layui-icon-ok-circle')
      if (temp) {
        work_p_n++
      }
      work_p++
    }

  }
  GM_setValue('len', work_p)
  GM_setValue('n_len', work_p_n + 1)
  if (work_p_n >= work_p) {
    let h = document.querySelector("body > div.header.header2 > div > div.nav > ul > li:nth-child(4) > a").href
    unsafeWindow.location.href = h;
    // 刷新页面
    unsafeWindow.location.reload();
  }
  outerLoop: for (let w of works) {
    let p_list = w.querySelectorAll('li')

    for (let p of p_list) {
      let temp = p.querySelector('.layui-icon-ok-circle')
      if (temp) {

      } else {
        p.click()
        function attachPauseListener () {
          var videoElement = $("video").get(0);
          // 如果找到 video 元素
          if (videoElement) {

            sd_video()
            // 清除 interval，因为已经找到 video 元素并附加了事件监听器
            clearInterval(checkVideoInterval);
          }
        }
        // 使用 setInterval 检查 video 元素是否存在
        var checkVideoInterval = setInterval(function () {
          attachPauseListener();
        }, 500);
        // console.log(p)
        break outerLoop
      }
    }
  }


}

function sd_video () {
  console.log('sd_video')

  $('body').append(('<button style="width:100px;height:50px;color:red;font-size:20px;position:absolute;left:100px;top:100px">刷课中..</button>'))
  $('body').append(('<button class="b2" style="width:100px;height:50px;color:red;font-size:20px;position:absolute;left:100px;top:150px"></button>'))
  $('body').append(('<button class="b3" style="width:100px;height:50px;color:red;font-size:20px;position:absolute;left:100px;top:200px"></button>'))
  $('body').append(('<button class="b4" style="width:200px;height:50px;color:red;font-size:20px;position:absolute;left:50px;top:250px"></button>'))

  let p_n_len = GM_getValue('p_n_len')
  let p_len = GM_getValue('p_len')
  let n_len = GM_getValue('n_len')
  let len = GM_getValue('len')
  $('.b2').text(p_n_len + '/' + p_len)
  $('.b3').text(n_len + '/' + len)

  console.log(p_n_len + '/' + p_len)
  console.log(n_len + '/' + len)


  // $(unsafeWindow).unbind('beforeunload')
  // unsafeWindow.onbeforeunload = null


  $("video").prop('muted', true);
  $("video").get(0).play();
  setInterval(() => {

    $('.b4').text('当前视频进度: ' + parseInt((parseInt(player.currentTime) / parseInt(player.duration)) * 100) + '%')
  }, 20000);



  $("video").get(0).addEventListener("pause", function (event) {
    // console.log("视频暂停播放")
    $("video").prop('muted', true);
    event.preventDefault();
    $("video").get(0).play();

    try {
      // let dialog = document.querySelector('.layui-layer-dialog')
      // let a1 = dialog.querySelectorAll('a')[1]
      // let a2 = dialog.querySelectorAll('a')[0]
      // simulateClick(a1)
      // simulateClick(a2)

    }
    catch (e) {
      // console.log(e)
    }
    // layer.closeAll();
    // console.log("关闭弹窗")
    // $("video").get(0).play();
    // console.log("开始播放")

  }, false);

  $("video").get(0).addEventListener('playing', function () {
    $("video").prop('muted', true);
    $("video").get(0).play();
    $('.b4').text('当前视频进度: ' + parseInt((parseInt(player.currentTime) / parseInt(player.duration)) * 100) + '%')


  }, false);

  $("video").get(0).addEventListener('ended', function () { //结束
    console.log("播放结束");
    setTimeout(() => {
      location.reload()
    }, 2000)


    // window.opener = null;
    // window.close();
    // location.reload()
    // let queryString = window.location.search;
    // let params = new URLSearchParams(queryString);
    // let wid = params.get("wId");
    // let path = window.location.pathname.split('/')
    // console.log('cid: ' + path[path.length - 1])
    // console.log('wid: ' + wid)
    // var lastdata = new FormData();
    // lastdata.append('cid', path[path.length - 1]);
    // lastdata.append('wid', wid);
    // lastdata.append('time', tempSubmitTimes);
    // navigator.sendBeacon('/Service/SaveTime', lastdata);
    upload()
    // setTimeout(() => {
    //   $(unsafeWindow).unbind('beforeunload')
    //   unsafeWindow.onbeforeunload = null
    //   // location.replace('https://www.sdlpa.org.cn/Learning/Default1')

    //   unsafeWindow.close();

    //   // document.querySelector("#default_load > div:nth-child(2) > div.noticetitle1 > a:nth-child(2)").click()
    //   // console.log("点击刷新")
    //   unsafeWindow.opener.location.reload()
    // }, 2000)

  }, false);

}

function isNaN (n) {
  if (n !== n) {
    return true;
  } else {
    return false;
  }
}

function handleFlash () {
  $('body').append(('<button style="width:100px;height:50px;color:red;font-size:20px;position:absolute;left:100px;top:100px">刷课中..</button>'))
  $('body').append(('<button class="b2" style="width:100px;height:50px;color:red;font-size:20px;position:absolute;left:100px;top:150px"></button>'))
  $('body').append(('<button class="b3" style="width:100px;height:50px;color:red;font-size:20px;position:absolute;left:100px;top:200px"></button>'))
  $('body').append(('<button class="b4" style="width:200px;height:50px;color:red;font-size:20px;position:absolute;left:50px;top:250px"></button>'))

  let p_n_len = GM_getValue('p_n_len')
  let p_len = GM_getValue('p_len')
  let n_len = GM_getValue('n_len')
  let len = GM_getValue('len')
  $('.b2').text(p_n_len + '/' + p_len)
  $('.b3').text(n_len + '/' + len)

  console.log(p_n_len + '/' + p_len)
  console.log(n_len + '/' + len)

  $(unsafeWindow).unbind('beforeunload')
  unsafeWindow.onbeforeunload = null
  try {
    flashvars.checkin = 0
    swfobject.embedSWF(
      "/flashvideo/SparrowPlayer.swf?v=1.8", "flashContent",
      "820", "500",
      swfVersionStr, xiSwfUrlStr,
      flashvars, params, attributes);
  } catch (e) {

  }
  var timer = setInterval(function () {
    // 定时执行的代码
    if (getMediaStatus() != 'play') {
      playVideo()
    }




  }, 1000); // 时间间隔为 1000 毫秒

  setTimeout(function () {
    // 延时执行的代码
    if (getMediaStatus() == 'stop') {
      $(unsafeWindow).unbind('beforeunload')
      unsafeWindow.onbeforeunload = null
      unsafeWindow.close();
      unsafeWindow.opener.location.reload()
      console.log("视频无法播放")
    } else {

    }
    console.log('延时执行的代码！');
  }, 5000); // 延迟 5000 毫秒后执行


  setTimeout(() => {
    $(unsafeWindow).unbind('beforeunload')
    unsafeWindow.onbeforeunload = null
    unsafeWindow.close();
    unsafeWindow.opener.location.reload()
  }, 12 * 60 * 1000);

}

function handleExam () {
  $('body').append(('<button class="b7" style="width:300px;height:50px;color:red;font-size:20px;position:absolute;left:100px;top:100px">答题中</button>'))
  // flag = 0
  let flag = parseInt(GM_getValue('flag'))
  if (isNaN(flag)) {
    flag = 0;
    GM_setValue('flag', 0)
  }
  console.log(flag)
  console.log('考试页面')
  let answer = ['A', 'B', 'C', 'D']
  let temp = parseInt(flag) + 1
  if (flag >= 0 && flag <= 20) {
    $('.b7').text('第' + temp + '次答题  ' + '当前为随机答案')
    console.log('当前为随机答案')
    for (let q of jsonQuestion) {
      q.answer = answer[Math.floor(Math.random() * answer.length)]
      // q.answer = 'A'
    }
  } else if (flag > 20) {
    GM_setValue('flag', 0)
    $('.b7').text('尝试次数过多，暂时退出')
    setTimeout(() => {
      unsafeWindow.close()
      unsafeWindow.opener.location.reload()
    }, 1000);

  }

  console.log(jsonQuestion)


  setTimeout(() => {
    ajaxPostExam(jsonQuestion)

  }, 1000);

  setTimeout(() => {

    let socre = document.querySelector("body > div.aui_state_focus > div > table > tbody > tr:nth-child(2) > td.aui_c > div > table > tbody > tr:nth-child(2) > td.aui_main > div").innerText.replace(/[^\d]/g, " ")
    if (parseInt(socre) >= 60) {
      GM_setValue('flag', 0)
      console.log('考试通过')
      document.querySelector("body > div.aui_state_focus > div > table > tbody > tr:nth-child(2) > td.aui_c > div > table > tbody > tr:nth-child(3) > td > div > button.aui_state_highlight").click()
      unsafeWindow.opener.location.reload()
    } else {
      flag++
      GM_setValue('flag', flag)
      unsafeWindow.location.reload()
    }
  }, 3000)

}

function simulateClick (element) {
  // 创建一个新的鼠标点击事件
  const clickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: unsafeWindow
  });

  // 在目标元素上分发事件
  element.dispatchEvent(clickEvent);
}

