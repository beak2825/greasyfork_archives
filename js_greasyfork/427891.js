// ==UserScript==
// @name         超星键盘控制优化
// @namespace    https://greasyfork.org/zh-CN/users/782923-asea
// @version      1.4.2.4
// @description  上下控制音量；左右控制视频进度条；空格播放\暂停视频；'+'、'-'控制倍速；'['、']'控制上一节、下一节；'alt'+'[1-9]' 选择快速选择整数倍速；'f'全屏；'ESC'退出全屏；若无效请单击播放窗口一次再尝试，若仍无效请刷新页面；仍有bug请留言反馈
// @author       Asea Q:569389750
// @match        https://*.chaoxing.com/mycourse/studentstudy*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/427891/%E8%B6%85%E6%98%9F%E9%94%AE%E7%9B%98%E6%8E%A7%E5%88%B6%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/427891/%E8%B6%85%E6%98%9F%E9%94%AE%E7%9B%98%E6%8E%A7%E5%88%B6%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
  var errors = 0;
  mainfn_flag = false // 主定时任务标志
  var old_url = window.location.href; // 获取当前url，方便后面换课时调用
  if(mainfn_flag===false)
  {
    mainfn = setInterval(mainKeybind, 500);
    mainfn_flag = true;
  }
  function changeURLArg(url,arg,arg_val) // 获取url某个属性的value
  {   old_arg_val = getArgVal(url,arg).toString()
      newUrl = url.replace(old_arg_val,arg_val)
      return newUrl
    }
  function getArgVal(url,arg){ // 更改某个属性的value
    patch = arg+'=([^&]*)'
    arg_val = url.match(patch)[1]
    return arg_val
  }
  function mainKeybind(){
      var keybind_is_done = false
      if(document.readyState == 'complete') // 判断网页资源加载完毕
      { 
        urlfn = setInterval(url_listener, 1000)  // 监听url变化
        var vol = 0.1;  //1代表100%音量，每次增减0.1
        var time = 5; //单位秒，每次增减5秒
        var rate = 0.2; // 倍速增长量，倍速最低0.2，最高16
        try
        {
          var iframes = document.getElementById("iframe").contentWindow.document.querySelectorAll("iframe"); // 获取到页面内所有iframe，ppt以及video的iframe是在一个大的iframe里的
          var is_binded = 0 // 已绑定的元素
          iframes.forEach(iframe=>
            {
              if(iframe.contentWindow.document.querySelectorAll('#reader').length > 0) // 判断是否含有video标签
              { 
                is_binded += 1 // 已绑定的元素+1
                videoElement = iframe.contentWindow.document.querySelector('video'); // 定位到video标签
                keybind_is_done = true
                  videoElement.onclick = function(event) // 绑定鼠标点击事件
                  { 
                    videoElement = event.currentTarget // 定位当前元素
                    videoElement.onkeydown = keybind // 绑定键盘事件
                    function keybind(event)   
                    {//键盘事件
                      var e = event || window.event || arguments.callee.caller.arguments[0];
                      //鼠标上下键控制视频音量
                      if (e && e.key === 'ArrowUp') 
                      {
      
                        // 按 向上键
                        videoElement.volume !== 1 ? videoElement.volume += vol : 1;
                        return false;
        
                      } else if (e && e.key === 'ArrowDown') 
                      {
        
                        // 按 向下键
                        videoElement.volume !== 0 ? videoElement.volume -= vol : 1;
                        return false;
        
                      } else if (e && e.key === 'ArrowLeft') 
                      {
        
                        // 按 向左键
                        videoElement.currentTime !== 0 ? videoElement.currentTime -= time : 1;
                        return false;
        
                      } else if (e && e.key === 'ArrowRight') 
                      {
        
                          // 按 向右键
                          videoElement.volume !== videoElement.duration ? videoElement.currentTime += time : 1;
                          return false;
        
                      } else if (e && e.key === ' ') 
                      {
        
                        // 按空格键 判断当前是否暂停
                        videoElement.paused === true ? videoElement.play() : videoElement.pause();
                        return false;
                      } else if(e &&(e.key === '=' || e.key === '+')) 
                      {
                        // 按加号键 倍速增加
                        videoElement.playbackRate > 0 && videoElement.playbackRate < 16 ? videoElement.playbackRate = (videoElement.playbackRate+rate).toFixed(1) : 1;
                        return false;
                      } else if(e && e.key === '-') 
                      {
                        // 按减号键 倍速减少
                        videoElement.playbackRate > rate ? videoElement.playbackRate = (videoElement.playbackRate-rate).toFixed(1) : 1;
                        return false;
                      } else if(e && e.altKey && '123456789'.search(e.key) != -1) 
                      {
                        // 整数倍速
                        videoElement.playbackRate > 0 && videoElement.playbackRate < 16 ? videoElement.playbackRate = Number(e.key) : 1;
                        return false;

                      }  else if(e && e.key === 'home' || e.key === 'Home' ) 
                      {
                        // 按减号键 倍速减少
                        videoElement.currentTime  = 0;
                        return false;
                      } 
                      else if(e && e.key === ']') // 下一节
                      {
                        url = window.location.href
                        now_chapterId = getArgVal(url,'chapterId')
                        next_chapterId = (Number(now_chapterId)+1).toString()
                        window.location.href = changeURLArg(url,'chapterId',next_chapterId)
                      } else if(e && e.key === '[') // 上一节
                      {
                        url = window.location.href
                        now_chapterId = getArgVal(url,'chapterId')
                        next_chapterId = (Number(now_chapterId)-1).toString()
                        window.location.href = changeURLArg(url,'chapterId',next_chapterId)
                      } else if(e && e.key === 'f') // 全屏
                      {   
                        videoElementPar = videoElement.parentElement
                          if (videoElement.requestFullscreen) {
                            videoElementPar.requestFullscreen();
                        } else if (videoElement.mozRequestFullScreen) {
                            videoElementPar.mozRequestFullScreen();
                        } else if (videoElement.webkitRequestFullScreen) {
                            videoElementPar.webkitRequestFullScreen();
                        }
                      }
                    };
                  }
              }
              
          });
          if(keybind_is_done){
            clearInterval(mainfn); // 关闭加载元素的定时监听
            console.log('Done:',is_binded); // 总鼠标事件绑定完毕
            mainfn_flag = false; // 主定时任务停止的标志 方便开启
          }
        }
        catch
        { 
          errors += 1
          if(errors < 20){
          console.log('Loading') // 元素未加载出来时
          }
          else if (errors > 20){ 
            console.log('未发现video元素，已关闭监听')
            clearInterval(mainfn)
          }
        }
      }
    }
    
    function url_listener()
    { 
      var now_url = window.location.href; // 当前url
      if (now_url !== old_url) // 判断是否换节课
      { 
        errors = 0
        clearInterval(mainfn)
        // console.log('发现url切换')
        old_url = now_url;
        mainfn = setInterval(mainKeybind, 500); // 开启主定时任务
        clearInterval(urlfn); // 关闭url监听定时任务
      }
    }
})();