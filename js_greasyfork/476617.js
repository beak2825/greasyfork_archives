// ==UserScript==
// @name         🔥HTML5视频截图保存工具+带时间戳和文件名(可用于所有视频网站,百度网盘和哔哩哔哩亲测可用)
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Alt+shift+D保存HTML5视频截图，并生成带时间戳和文件名的图片+并复制到剪切板(可用于所有视频网站,百度网盘和哔哩哔哩亲测可用)
// @license      Yolanda Morgan
// @author       Yolanda Morgan
// @match         http://*/*
// @match         https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476617/%F0%9F%94%A5HTML5%E8%A7%86%E9%A2%91%E6%88%AA%E5%9B%BE%E4%BF%9D%E5%AD%98%E5%B7%A5%E5%85%B7%2B%E5%B8%A6%E6%97%B6%E9%97%B4%E6%88%B3%E5%92%8C%E6%96%87%E4%BB%B6%E5%90%8D%28%E5%8F%AF%E7%94%A8%E4%BA%8E%E6%89%80%E6%9C%89%E8%A7%86%E9%A2%91%E7%BD%91%E7%AB%99%2C%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%92%8C%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%BA%B2%E6%B5%8B%E5%8F%AF%E7%94%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/476617/%F0%9F%94%A5HTML5%E8%A7%86%E9%A2%91%E6%88%AA%E5%9B%BE%E4%BF%9D%E5%AD%98%E5%B7%A5%E5%85%B7%2B%E5%B8%A6%E6%97%B6%E9%97%B4%E6%88%B3%E5%92%8C%E6%96%87%E4%BB%B6%E5%90%8D%28%E5%8F%AF%E7%94%A8%E4%BA%8E%E6%89%80%E6%9C%89%E8%A7%86%E9%A2%91%E7%BD%91%E7%AB%99%2C%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%92%8C%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%BA%B2%E6%B5%8B%E5%8F%AF%E7%94%A8%29.meta.js
// ==/UserScript==


(function() {
    'use strict';
/* 不起作用
// 屏蔽网站自带的快捷键
    window.addEventListener('keydown', function(e) {
        e.stopPropagation();
        e.preventDefault();
    }, true);
*/
    let disableWebsiteShortcuts = false;

    // 屏蔽网站自带的快捷键
    function disableShortcuts(e) {
        if (disableWebsiteShortcuts) {
            e.stopPropagation();
            e.preventDefault();
        }
    }
    // 监听键盘按键事件
    document.addEventListener('keydown', function(e) {
        //说明:alt+d是浏览器快捷键,ctrl+d调用ra的搜索框,d键在bilibili是字幕开关(随可在自用截图脚本中关闭,但是不能html5加强脚本中不能实现,因为不是通过监听器调用的),因此选用d键以外的键,最好为左手键,可以改成F
        //可用alt+ctrl+f,html5加强脚本中能用,但是在此中无论百度网盘还是bilibili都无法用
       // 判断是否按下了Alt、Shift和D键 -在网盘中有效,在bilibili与网站自带字幕快捷键冲突-4.0脚本已解决(随可在自用截图脚本中关闭,但是不能html5加强脚本中不能实现,因为不是通过监听器调用的)
        //if (e.altKey && e.shiftKey && e.key === 'D') {
        //判断是否按下了空格键和D键-此处在百度网盘和bilibili无效,但在html5加强脚本中有效
        //if (e.key === "Space" && e.key === 'D') {
        // 判断是否按下了Tab键和D键 -会导致bilibili翻页
        //  if (e.key === 'Tab' && e.key === 'D') {
       // 判断是否按下了Shift和D键 -在网盘中有效,在bilibili有效,但是影响大写字幕的录入
        //判断是否按下了Alt、shift和D键-自用截图脚本和html5加强脚本均可用
       if (e.altKey && e.shiftKey && e.key === 'D') {
              // 屏蔽网站自带的快捷键
              disableWebsiteShortcuts = true;
            // 获取页面的video元素
            var v = document.querySelector('video');
            if (v) {
                // 获取当前时间作为文件名的一部分
                var currenttime = getCurrentTime();

                // 创建canvas元素并绘制video元素内容
                var c = document.createElement('canvas');
                c.width = v.videoWidth;
                c.height = v.videoHeight;
                c.getContext('2d').drawImage(v, 0, 0, c.width, c.height);

                // 绘制后，获取图片数据并下载
                c.toBlob(function(b) {
                    var u = URL.createObjectURL(b);
                    var filename = getFilename(currenttime, v);
                    download(u, filename);
                    URL.revokeObjectURL(u);
                    setClipboard(b); // 尝试复制到剪贴板
                }, 'image/jpg', 0.99);
            }
              // 恢复网站自带的快捷键
            disableWebsiteShortcuts = false;
            e.stopPropagation();
            e.preventDefault();

          }
    });

      // 启用或禁用网站自带的快捷键
    window.addEventListener('keydown', disableShortcuts, false);


    // 获取视频文件名
    function getFilename(currenttime, videoElement) {
  var videoNameElement = document.querySelector('div.vp-video-page-card span.is-playing.vp-video-page-card__video-name,div.frame-main div.video-title span.video-title-left'); //若第二个在前面会导致帧数识别错误
  //var videoNameElement = document.querySelector('div.vp-video-page-card span.is-playing.vp-video-page-card__video-name');
  //var videoNameElement = document.querySelectorAll('div.frame-main div.video-title span.video-title-left, div.vp-video-page-card span.is-playing.vp-video-page-card__video-name'); //无效
        var originalFilename = videoNameElement ? videoNameElement.innerText.trim() : '';
        if (!originalFilename) {
            var titleElement = document.querySelector('head > title');
            originalFilename = titleElement ? titleElement.innerText.trim() : '';
        }
        if (videoNameElement || titleElement) {
            originalFilename = originalFilename.replace(/\.[^.]+$/, ""); // 去掉原始文件名的后缀
        }
        //可用 var currentTimeStr = formatTime(currenttime).replace(/:/g, ''); // 将冒号删除,样式为帧_000247
        //可用 var currentTimeStr = formatTime(getCurrentTime(videoElement)).replace(/:/g, ''); //与上一行等同,样式为帧_000247
        //可用 const currentTimeStr = `${Math.floor(currenttime / 60)}'${(currenttime % 60).toFixed(0)}''`; //秒保持0位小数,样式为帧_94'37''
        const currentTimeStr = `${Math.floor((getCurrentTime(videoElement)) / 60)}'${((getCurrentTime(videoElement)) % 60).toFixed(0)}''`; //(getCurrentTime(videoElement))注意带有括号,否则读取时间有时候会失败,尤其是是百度组视频链接
        var newFilename = "BR截图_" + getCurrentDate() + "_帧_" + currentTimeStr + "_" + originalFilename + ".png"; // 根据需求拼接文件名,帧就是时间戳,BR表示browser
        return newFilename || 'screenshot';
    }

    // 获取当前完整日期时间，格式为yyyyMMddHHmmss
    function getCurrentDate() {
        var date = new Date();
        var year = date.getFullYear();
        var month = ('0' + (date.getMonth() + 1)).slice(-2);
        var day = ('0' + date.getDate()).slice(-2);
        var hours = ('0' + date.getHours()).slice(-2);
        var minutes = ('0' + date.getMinutes()).slice(-2);
        var seconds = ('0' + date.getSeconds()).slice(-2);
        return year + month + day + hours + minutes + seconds;
    }

    // 格式化时间为hh:mm:ss的格式
    function formatTime(time) {
        var hours = Math.floor(time / 3600);
        var minutes = Math.floor((time % 3600) / 60);
        var seconds = Math.floor(time % 60);
        return ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2);
    }

// 获取视频当前时间-可自行添加,优先级从前到后

//说明:timeElements的属性来自
//用于百度网盘,不能颠倒顺序,否则,会导致分享页面的视频的当前时间读取为0:0:0
//    document.querySelector(".vjs-current-time-display"),
//用于百度网盘,
//    document.querySelector(".vjs-time-tooltip"),
 //用于bilibili的
//    document.querySelector(".bpx-player-ctrl-time-current"),
 //用于bilibili的
//     document.querySelector(".bkplayer-current-time")
//timeElements的属性还来自下面网站的属性:
//1.网站好看视频属性来自<span class="currentTime">00:26</span>
//2.网站网站youbutey属性来自 <span class="ytp-time-current">1:49</span>
//3.网站vimeo属性来自 <div class="FocusTarget_module_focusTarget__02e194b8 shared_module_focusable__63d26f6d" role="slider" aria-label="进度条" aria-valuemin="0" aria-valuemax="15.061" aria-valuenow="7" aria-valuetext="00:06 of 00:15" tabindex="0" data-progress-bar-focus-target="true"></div>
//4.网站iqiyi 属性来自<div class="iqp-time-display iqp-time-cur" data-player-hook="timecur">1:49</div>
//5.网站乐视属性来自<div class="hv_time"><span>05:53</span></div>
//6.网站tencent属性来自<div class="txp_time_current">00:23</div>
//7.网站sohu属性来自<shpspan class="x-time-current">12:32</shpspan>
//8.网站sina属性来自<span class="vjs-sina-time-white">00:06</span>
//9.网站nico属性来自<span class="PlayTimeFormatter PlayerPlayTime-playtime">12:35</span>
//10.支持cctv
//11.待添加
//芒果<div class="_ActionItem_1fux8_32 no-event grayable"><span>05:31/13:34</span></div>
//快手

function getCurrentTime() {
  var timeElements = document.querySelectorAll("[class*='current' i][class*='time' i],[class*='cur' i][class*='time' i],[class*='vjs'][class*='time'], *[class*='display'], *[class*='tooltip'], *[class*='playtime'], .hv_time span:first-child");

    var currentTime = null;
  for (var i = 0; i < timeElements.length; i++) {
    var timeStr = timeElements[i].textContent.trim();
    // 将当前时间格式化为秒数
    if (/^\d+:\d+$/.test(timeStr)) { // 格式为"mm:ss"
      var minutes = parseInt(timeStr.split(":")[0], 10);
      var seconds = parseInt(timeStr.split(":")[1], 10);
      currentTime = minutes * 60 + seconds;
    } else if (/^\d+:\d+:\d+$/.test(timeStr)) { // 格式为"hh:mm:ss"
      var hours = parseInt(timeStr.split(":")[0], 10);
      minutes = parseInt(timeStr.split(":")[1], 10);
      seconds = parseInt(timeStr.split(":")[2], 10);
      currentTime = hours * 3600 + minutes * 60 + seconds;
    }
    if (currentTime !== null) {
      break;
    }
  }
  return currentTime;
}

    // 保存图片的函数。它模拟点击链接，打开保存窗口
    function download(href, name) {
        var save_link = document.createElement('a');
        save_link.href = href;
        save_link.download = name;
        var event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        save_link.dispatchEvent(event);
    }

    // 复制到剪切板的函数
    function setClipboard(blob) {
        navigator.clipboard.write([
            new ClipboardItem({
                'image/png': blob
            })
        ]);
    }
})();