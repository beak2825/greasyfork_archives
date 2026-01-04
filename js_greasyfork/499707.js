// ==UserScript==
// @name         zqy爱学习2
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  cela课程刷视频脚本
// @author       fxalll
// @match        https://cela.e-celap.com/page.html

// @icon         https://www.google.com/s2/favicons?sz=64&domain=gd.gov.cn
// @license      WTFPL
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/499707/zqy%E7%88%B1%E5%AD%A6%E4%B9%A02.user.js
// @updateURL https://update.greasyfork.org/scripts/499707/zqy%E7%88%B1%E5%AD%A6%E4%B9%A02.meta.js
// ==/UserScript==

(function () {
  'use strict';
  let div = document.createElement('div');
  div.id = "fkVideo";
  div.style.width = "100%";
  div.style.height = "20px";
  div.style.position = "absolute";
  div.style.color = "#7ce649";
  div.style.textAlign = "center";
  div.style.alignItems = "center";
  div.style.background = "#000";
  div.style.zIndex = "9999999999";
  div.innerText = "脚本开始运行..."
  document.body.appendChild(div)


  setTimeout(() => {
    if (location.hash.split('/')[3] === 'pagechannel') {

      // 专题课程页面
      div.innerText = "【脚本正在运行】当前在专题课程页面，等待下一步操作（点击章节按钮）..."
      // 检查点没点到
      let isClickTab;

      setTimeout(() => {
        clickIt();
      }, 1000)
      function clickIt () {
        try {
          document.getElementById("tab-second").click();
          document.querySelectorAll('#tab-second')[0].classList.forEach(e => { if (e === 'is-active') { isClickTab = true } });
          if (!!!isClickTab) {
            div.innerText = "【脚本运行重试】当前在专题课程页面，等待下一步操作（重新再点击一次章节按钮）..."
            setTimeout(() => {
              clickIt();
              div.innerText = "【脚本正在运行】当前在专题课程页面，等待下一步操作（点击章节按钮）..."
            }, 1000)
          } else {
            div.innerText = "【脚本正在运行】当前在专题课程页面，等待下一步操作（获取最近一个未完成的课程）..."
            let classList = []; document.querySelectorAll(".chapter-body")[0].childNodes.forEach(e => { let classNode = {}; classNode.progress = e.childNodes[3].childNodes[0].childNodes[1].textContent.split('%')[0]; classNode.name = e.childNodes[0].childNodes[1].innerText; classList.push(classNode) })

            let unFinishNum = 0; classList.forEach(e => { if (parseInt(e.progress) < 100) unFinishNum += 1 });
            div.innerText = `【脚本正在运行】获取到数据,还剩${unFinishNum}个视频没看完，这就开始看它~`

            let unFinishIndex = 0; classList.forEach((e, index) => { if (parseInt(e.progress) < 100) unFinishIndex = index });
            setTimeout(() => {
              clickIt2();
            }, 2000)
            function clickIt2 () {
              try {
                document.querySelectorAll(".chapter-body")[0].childNodes[unFinishIndex].childNodes[4].click();

                // div.innerText = `【脚本正在运行】咱从后往前看哈，现在在看第${unFinishIndex}个视频。`
                div.innerText = `【注意】视频已点开，但脚本可能被拦截，记得允许在此页面弹出窗口啊！和上次一样`

                            window.onbeforeunload = null;
            setTimeout(()=>{
            window.close();
            },3000)






              } catch (error) {
                div.innerText = "【脚本运行重试】当前在专题课程页面，等待下一步操作（重新再点击一次进入课程按钮）..."
                setTimeout(() => {
                  clickIt2();
                }, 1000)
              }
            }



          }

        } catch {
          div.innerText = "【脚本运行重试】当前在专题课程页面，等待下一步操作（重新再点击一次章节按钮）..."
          setTimeout(() => {
            clickIt();
          }, 1000)
        }
      }



    } else if (location.hash.split('/')[3] === 'pagecourse') {
      // 课程视频页面
      div.innerText = "【脚本正在运行】当前在课程视频页面，等待下一步操作（开始看视频）..."

      let interval2 = setInterval(() => {
        detectVideo()
      }, 1000)
      function detectVideo () {
        let videoEle = document.getElementById("whplayer-vhall-video");
        if (videoEle.currentTime / videoEle.duration > 0.9995) {
          window.open("https://cela.e-celap.com/page.html#/pc/nc/pagechannel/channelDetail?id=91639af13d04457c93619930ce0ccf9c")
          clearInterval(interval2);

            window.onbeforeunload = null;
            setTimeout(()=>{
            window.close();
            },3000)

        } else {
          div.innerText = `【脚本正在运行】还在看视频，目前进度${(videoEle.currentTime / videoEle.duration) * 100}%`

          try {
            // 防止视频被暂停
            //console.log(window.frames['course_frm'].contentDocument.querySelector('.pause'))
            if (document.getElementsByClassName("vhallPlayer-playBtn play")[0] !== undefined) {
              // 视频被暂停，要开
              document.getElementsByClassName("vhallPlayer-playBtn play")[0].click();
            }
            videoEle.volume = 0
            videoEle.play()

          } catch (err) {
            div.innerText = `【脚本错误】拿错误代码来问我：${err}%`

            console.log(err)
          }
        }
      }


    }
  }, 3000)
})()