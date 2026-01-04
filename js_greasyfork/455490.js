// ==UserScript==
// @name         B站倍速控制优化
// @namespace    https://greasyfork.org/zh-CN/users/782923-asea
// @version      1.0.1
// @description  '+'、'-'、'c'、'x'、'z'控制倍速；'alt'+'[1-9]' 选择快速选择整数倍速；详细的操作方法请看下方的描述
// @author       yuege
// @match        https://www.bilibili.com/video/*
// @match        https://www.icourse163.org/learn/*
// @match        https://www.icourse163.org/spoc/learn/*
// @icon         https://www.bilibili.com/favicon.ico
// @icon         https://edu-image.nosdn.127.net/32a8dd2a-b9aa-4ec9-abd5-66cd8751befb.png?imageView&quality=100
// @grant        none
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/455490/B%E7%AB%99%E5%80%8D%E9%80%9F%E6%8E%A7%E5%88%B6%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/455490/B%E7%AB%99%E5%80%8D%E9%80%9F%E6%8E%A7%E5%88%B6%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
  var old_url = window.location.href; // 获取当前url，方便后面换课时调用
  var errors = 0
  mainfn = setInterval(mainKeybind, 500);
  function mainKeybind(){
      if(document.readyState == 'complete') // 判断网页资源加载完毕
      {
        urlfn = setInterval(url_listener, 1000)  // 监听url变化
        var rate = 0.2; // 倍速增长量，倍速最低0.2，最高16
        var rateOld = 1; // 原先的倍速
        try
        {
          if(old_url.indexOf("bilibili") != -1)
          {
            videoElement = document.querySelector('video')
          }else{
            videoElement = document.querySelector('video')
          }

        // videoElement.click()
        document.onkeydown = keybind // 绑定键盘事件
        function keybind(event)
        {//键盘事件
          var e = event || window.event || arguments.callee.caller.arguments[0];
          //鼠标上下键控制视频音量
          if(e &&(e.key === '=' || e.key === '+'||e.key === 'c'))
          {
            // 按加号键 倍速增加
            rateOld = videoElement.playbackRate+rate;
            rateButton = document.querySelector(old_url.search('bilibili')!== -1 ? '.bilibili-player-video-btn.bilibili-player-video-btn-speed button' : '.controlbar_btn.ratebtn.j-ratebtn')
            videoElement.playbackRate <= 16 -rate ? videoElement.playbackRate = parseFloat((videoElement.playbackRate+rate).toFixed(1)) : 1;
            rateButton.textContent = parseFloat(videoElement.playbackRate).toFixed(1).toString() + 'x'
            return false;
          } else if(e && e.key === '-'||e.key === 'x')
          {
            // 按减号键 倍速减少
            rateOld = videoElement.playbackRate-rate;
            rateButton = document.querySelector(old_url.search('bilibili')!== -1 ? '.bilibili-player-video-btn.bilibili-player-video-btn-speed button' : '.controlbar_btn.ratebtn.j-ratebtn')
            videoElement.playbackRate > rate ? videoElement.playbackRate = parseFloat((videoElement.playbackRate-rate).toFixed(1)) : 1;
            rateButton.textContent = parseFloat(videoElement.playbackRate).toFixed(1).toString() + 'x'
            return false;
          } else if(e && e.altKey && '123456789'.search(e.key) != -1)
          {
            // 整数倍速
            rateOld = Number(e.key);
            rateButton = document.querySelector(old_url.search('bilibili')!== -1 ? '.bilibili-player-video-btn.bilibili-player-video-btn-speed button' : '.controlbar_btn.ratebtn.j-ratebtn')
            videoElement.playbackRate > 0 && videoElement.playbackRate <= 16 ? videoElement.playbackRate = Number(e.key) : 1;
            rateButton.textContent = videoElement.playbackRate.toFixed(1) + 'x';
            return false;
          }else if(e.key === 'z')
          {
            // 还原为1
            rateButton = document.querySelector(old_url.search('bilibili')!== -1 ? '.bilibili-player-video-btn.bilibili-player-video-btn-speed button' : '.controlbar_btn.ratebtn.j-ratebtn')
            if(videoElement.playbackRate != 1)
            {
                videoElement.playbackRate = 1;
            } else
            {
                videoElement.playbackRate = rateOld;
            }
            rateButton.textContent = videoElement.playbackRate.toFixed(1) + 'x';
            return false;
          }
            else if(e && e.altKey && e.key === '0')
          {
            alert('已开启刷课模式，您可以按[shift]+[0]关闭')
            not_pause = setInterval(() => {
            if (videoElement.paused === true){
              videoElement.play()
            }
          }, 1000);
          }else if(e && e.shiftKey && e.key === '0')
          {

            try{
              clearInterval(not_pause)
              alert('已关闭刷课模式')}

            catch{
              alert('您未开启刷课模式，可以按[alt]+[0]开启')
            }
          }
        };
        console.log('Done') // 总事件绑定完毕
        clearInterval(mainfn); // 关闭加载元素的定时监听
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
        console.log('发现url切换')
        old_url = now_url;
        mainfn = setInterval(mainKeybind, 500); // 开启主定时任务
        clearInterval(urlfn); // 关闭url监听定时任务
      }
    }
})();