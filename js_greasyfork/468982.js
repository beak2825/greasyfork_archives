// ==UserScript==
// @name        百度网盘破解SVIP&&倍速播放&&文稿字幕
// @namespace   http://tampermonkey.net/
// @match       https://pan.baidu.com/
// @match       https://pan.baidu.com/*
// @exclude     https://pan.baidu.com/aipan/search
// @grant       unsafeWindow
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @run-at      document-start
// @connect     pan.baidu.com
// @require     https://lib.baomitu.com/hls.js/latest/hls.js
// @version     1.5.4
// @license     MIT
// @author      Gwen
// @homepageURL https://greasyfork.org/zh-CN/scripts/468982-%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E7%A0%B4%E8%A7%A3svip-%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE-%E6%96%87%E7%A8%BF%E5%AD%97%E5%B9%95
// @description 百度网盘视频完全破解SVIP。电脑用户使用新版火狐或安插件设置UserAgent:Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:110.0) Gecko/20100101 Firefox/110.0。iPad用户（我iOS15.7）：安装Focus浏览器，安装插件，登录即为Svip。
// @downloadURL https://update.greasyfork.org/scripts/468982/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E7%A0%B4%E8%A7%A3SVIP%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%E6%96%87%E7%A8%BF%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/468982/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E7%A0%B4%E8%A7%A3SVIP%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%E6%96%87%E7%A8%BF%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==

(function() {

  GM_addStyle('#app{width:100%!important}.vp-toolsbar{display:none!important}.vp-header{min-width:0!important}.vp-personal-video-play{min-width:0}.vp-personal-home-layout__video{min-width:30vw;padding-top:10px!important;height:80vh!important}.vp-personal-home-layout{padding:0 20px!important}.vp-personal-home-layout .vp-aside{padding-top:0!important}.vp-tabs{min-width:10vw!important}')
  let originalAddEventListener = EventTarget.prototype.addEventListener;
  let hookAddEventListener = function(...args) {
    if (args[0] != "keydown" && args[0] != "keyup" && args[0] != "keypress") {
    	return originalAddEventListener.apply(this, args);
    }
  }

  EventTarget.prototype.addEventListener = hookAddEventListener;
  document.addEventListener = hookAddEventListener;
  document.documentElement.addEventListener = hookAddEventListener;

  var settings = {
    solve_subtitle: true, //处理文稿字幕
    subtitles: null,
    subtitle_enabled: false,
    subtitleAutoEnable: GM_getValue('subtitleAutoEnable', false), //是否自动开启字幕
    longPressRate: 2, //长按加速倍速，Safari受设备影响，我的设备最高只能2倍速
    lastPlaybackRate: GM_getValue('lastPlaybackRate', 1),
    lastCurrentTime: 0,
    lastVideoWidth: GM_getValue('lastVideoWidth', null),
    lastTabWidth: GM_getValue('lastTabWidth', null),
    resolution: null,
    failCountThreshold: 15, //视频加载几秒仍未加载插件则手动发送获取视频m3u8的请求
    path: null,
    isSvip: null,
    adToken: null,
    bdstoken: null,
    globalVideo: null,
    hls: null,
    histories: GM_getValue('histories', []),
    pdf: null,
    m3u8url: null,
    capturePath: null, // 要导出的pdf
    timePoints: null,
    captureHls: null,
  }
  unsafeWindow.fucksettings = settings
  if (location.href.indexOf('https://pan.baidu.com/disk/main') != -1) {
    hookRequest()
    unsafeWindow.locals.userInfo.vip_identity = '2'
        unsafeWindow.locals.userInfo.vip_level = '10'
        unsafeWindow.locals.userInfo.svip10_id = '000000'
    let fuckLocals = setInterval(() => {
      if (unsafeWindow?.locals?.userInfo) {
        clearInterval(fuckLocals);
        unsafeWindow.locals.userInfo.vip_identity = '21'
        unsafeWindow.locals.userInfo.vip_level = '10'
        unsafeWindow.locals.userInfo.svip10_id = '000000'
      }
    }, 100)
    function wait() {
      let center = document.head && document.body && document.querySelector('.wp-s-header__center')
      if (!center) {
        setTimeout(wait, 300)
      } else {
        initPlayHistory()
        let historyBtn = document.createElement('a')
        historyBtn.href = '#'
        historyBtn.innerText = '播放历史'
        historyBtn.onclick = e => {
          e.preventDefault()
          document.querySelector('.history-wrapper').style.display='block';
          loadHistories()
        }
        center.appendChild(historyBtn)
      }
    }
    wait()
    return;
  } else if (location.href.indexOf('/pfile') == -1) {
      hookRequest()
      setLocals()
    return
  }

  //兼容某些浏览器无GMapi
  function GM_setValue(key, value) {
    settings[key] = value
    if (typeof value === 'string') {
      localStorage.setItem(key, value);
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      localStorage.setItem(key, value.toString());
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }
  function GM_getValue(key, defaultValue = null) {
    const value = localStorage.getItem(key);
    if (value === null || value === undefined) {
      return defaultValue;
    }
    try {
      return JSON.parse(value);
    } catch (error) {
      alert(`Error parsing stored value for key '${key}': ${error}`);
      return defaultValue;
    }
  }
  function createElement(tag, clazz, attrs) {
    const elem = document.createElement(tag);
    elem.className = clazz;
    if (attrs) {
      for (let key in attrs) {
        elem[key] = attrs[key];
      }
    }
    return elem;
  }
  function throttle(fn, delay) {
    var ctx;
    var args;
    var previous = Date.now();
    var later = function () {
      fn.apply(ctx, args);
    };
    return function () {
      ctx = this;
      args = arguments;
      var now = Date.now();
      var diff = now - previous - delay;
      if (diff >= 0) {
        previous = now;
        setTimeout(later, delay);
      }
    };
  }

  var $msg = {success:console.log,error:console.log,info:console.log}
  let h0x00=setInterval(()=>{
    if(document&&document.head&&document.body) {
      clearInterval(h0x00)
      function useMessage(){function n(n){for(var o=10,e=0;e<f.length;e++){var t=f[e];if(n&&n===t)break;o+=t.clientHeight+20}return o}function o(o){for(var e=0;e<f.length;e++){if(f[e]===o){f.splice(e,1);break}}o.classList.add(a.hide),f.forEach(function(o){o.style.top=n(o)+"px"})}function e(e){function i(){p.removeEventListener("animationend",i),setTimeout(o,x||t.duration||3e3,p)}function s(){"0"===getComputedStyle(p).opacity&&(p.removeEventListener("transitionend",s),p.remove())}var d=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"info",x=arguments[2],p=r.createElement("div");p.className=a.box+" "+d,p.style.top=n()+"px",p.style.zIndex=c,p.innerHTML='\n    <span class="'+a.icon+'"></span>\n    <span class="'+a.text+'">'+e+"</span>\n    ",c++,f.push(p),r.body.appendChild(p),p.addEventListener("animationend",i),p.addEventListener("transitionend",s)}var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=document,i="__"+Math.random().toString(36).slice(2,7),a={box:"msg-box"+i,hide:"hide"+i,text:"msg-text"+i,icon:"msg-icon"+i},s=r.createElement("style");s.textContent=("\n  ."+a.box+", ."+a.icon+", ."+a.text+" {\n    padding: 0;\n    margin: 0;\n    box-sizing: border-box;\n  }\n  ."+a.box+" {\n    position: fixed;\n    top: 0;\n    left: 50%;\n    display: flex;\n    padding: 12px 16px;\n    border-radius: 2px;\n    background-color: #fff;\n    box-shadow: 0 3px 3px -2px rgba(0,0,0,.2),0 3px 4px 0 rgba(0,0,0,.14),0 1px 8px 0 rgba(0,0,0,.12);\n    white-space: nowrap;\n    animation: "+a.box+"-move .4s;\n    transition: .4s all;\n    transform: translate3d(-50%, 0%, 0);\n    opacity: 1;\n    overflow: hidden;\n  }\n  ."+a.box+'::after {\n    content: "";\n    position: absolute;\n    left: 0;\n    top: 0;\n    height: 100%;\n    width: 4px;\n  }\n  @keyframes '+a.box+"-move {\n    0% {\n      opacity: 0;\n      transform: translate3d(-50%, -100%, 0);\n    }\n    100% {\n      opacity: 1;\n      transform: translate3d(-50%, 0%, 0);\n    }\n  }\n  ."+a.box+"."+a.hide+" {\n    opacity: 0;\n    /* transform: translate3d(-50%, -100%, 0); */\n    transform: translate3d(-50%, -100%, 0) scale(0);\n  }\n  ."+a.icon+" {\n    display: inline-block;\n    width: 18px;\n    height: 18px;\n    border-radius: 50%;\n    overflow: hidden;\n    margin-right: 6px;\n    position: relative;\n  }\n  ."+a.text+" {\n    font-size: 14px;\n    line-height: 18px;\n    color: #555;\n  }\n  ."+a.icon+"::after,\n  ."+a.icon+'::before {\n    position: absolute;\n    content: "";\n    background-color: #fff;\n  }\n  .'+a.box+".info ."+a.icon+", ."+a.box+".info::after {\n    background-color: #1890ff;\n  }\n  ."+a.box+".success ."+a.icon+", ."+a.box+".success::after {\n    background-color: #52c41a;\n  }\n  ."+a.box+".warning ."+a.icon+", ."+a.box+".warning::after {\n    background-color: #faad14;\n  }\n  ."+a.box+".error ."+a.icon+", ."+a.box+".error::after {\n    background-color: #ff4d4f;\n  }\n  ."+a.box+".info ."+a.icon+"::after,\n  ."+a.box+".warning ."+a.icon+"::after {\n    top: 15%;\n    left: 50%;\n    margin-left: -1px;\n    width: 2px;\n    height: 2px;\n    border-radius: 50%;\n  }\n  ."+a.box+".info ."+a.icon+"::before,\n  ."+a.box+".warning ."+a.icon+"::before {\n    top: calc(15% + 4px);\n    left: 50%;\n    margin-left: -1px;\n    width: 2px;\n    height: 40%;\n  }\n  ."+a.box+".error ."+a.icon+"::after, \n  ."+a.box+".error ."+a.icon+"::before {\n    top: 20%;\n    left: 50%;\n    width: 2px;\n    height: 60%;\n    margin-left: -1px;\n    border-radius: 1px;\n  }\n  ."+a.box+".error ."+a.icon+"::after {\n    transform: rotate(-45deg);\n  }\n  ."+a.box+".error ."+a.icon+"::before {\n    transform: rotate(45deg);\n  }\n  ."+a.box+".success ."+a.icon+"::after {\n    box-sizing: content-box;\n    background-color: transparent;\n    border: 2px solid #fff;\n    border-left: 0;\n    border-top: 0;\n    height: 50%;\n    left: 35%;\n    top: 13%;\n    transform: rotate(45deg);\n    width: 20%;\n    transform-origin: center;\n  }\n  ").replace(/(\n|\t|\s)*/gi,"$1").replace(/\n|\t|\s(\{|\}|\,|\:|\;)/gi,"$1").replace(/(\{|\}|\,|\:|\;)\s/gi,"$1"),r.head.appendChild(s);var c=t.zIndex||1e4,f=[];return{show:e,info:function(n){e(n,"info")},success:function(n){e(n,"success")},warning:function(n){e(n,"warning")},error:function(n){e(n,"error")}}}
      $msg=useMessage();
      $msg.success('脚本开始运行')
    }
  },100)

  //为解决某些我无法解决的视频加载错误或手机端插件各种bug的循环检错器
  var failCount = 0
  var failChecker = null
  //手动请求视频资源
  function fetchVideoM3U8() {
    settings.lastCurrentTime = settings.globalVideo ? settings.globalVideo.currentTime : 0
    let xhr = new XMLHttpRequest()
    let url = `https://pan.baidu.com/api/streaming?app_id=250528&clienttype=0&channel=chunlei&web=1&isplayer=1&check_blue=1&type=M3U8_AUTO_${settings.resolution?settings.resolution:'480'}&trans=&vip=0` +
          `&bdstoken=${settings.bdstoken||unsafeWindow.locals.bdstoken}&path=${settings.path}&jsToken=${unsafeWindow.jsToken}`
    xhr.open("GET", url)
    xhr.manual = true
    if (settings.adToken) {
      xhr.callback = function() {
        $msg.info('开始获取m3u8')
        fetchVideoM3U8()
      }
    }
    xhr.send()
  }
  function fetchResolution() {
    let xhr = new XMLHttpRequest()
    let url = `https://pan.baidu.com/api/filemetas?clienttype=0&app_id=250528&web=1&channel=chunlei`
    let body = `dlink=1&target=${encodeURIComponent('["' + settings.path + '"]')}`
    xhr.open("POST", url)
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.send(body)
  }
  function startFailChecker() {
    if (failChecker != null) {
      $msg.error('failChecker已在启动')
      return
    }
    failChecker = setInterval(() => {
      if (settings.globalVideo.readyState == 0) { //视频未成功加载
        failCount++
        if (failCount == settings.failCountThreshold) {
          $msg.error('视频未成功加载')
          clearInterval(failChecker)
          fetchVideoM3U8()
          failCount = 0
        }
      } else {
        $msg.success('视频成功加载')
        clearInterval(failChecker)
      }
    }, 1000)
  }

  function init() {
    let video = document.querySelector('video')
    if (!video) {
      console.log('still loading...')
      setTimeout(init, 400)
    } else if (video.id == 'vjs_video_3_html5_api') {
      video.remove()
      console.log('%removed beforeplay animation', 'color:blue')
      setTimeout(init, 400)
    } else {
      console.log('%cloaded!', 'color:red')
      $msg.success('加载成功')
      settings.globalVideo = video
      settings.path = new URLSearchParams(new URL(location.href).search).get('path');
      settings.isSvip = settings.isSvip
        || (document.querySelector('.vp-personal-userinfo__vip-icon')&&document.querySelector('.vp-personal-userinfo__vip-icon').src.indexOf('svip') != -1)
        || unsafeWindow?.locals?.is_svip
      fetchResolution()
      // if (settings.hls == null) {
      //   bindHls(video.src)
      // }

      video.parentElement.onselectstart = function(){return false;};
      video.autoplay = 'true'
      var scrubber = document.createElement("div");
      scrubber.style = 'text-align: center; width: 100%; z-index: 1000; color: white; font-weight: bold; text-shadow: black 0px 0px 10px;position: absolute;top: 50%;font-size: 30px;'
      var speedAlert = document.createElement('div')
      speedAlert.innerText = settings.longPressRate + '倍速播放中'
      speedAlert.style = 'text-align: center; width: 100%;position: absolute; top: 20px;z-index: 100; font-size: 30px;color: orange; text-shadow: black 0px 0px 20px;'
      speedAlert.style.display = 'none'
      video.parentElement.appendChild(scrubber);
      video.parentElement.appendChild(speedAlert)

      let scrubbing = false;
      let scrubStartX = 0;
      let scrubStartTime = 0;
      let deltaX = 0

      function updateScrubber() {
          var currentTime = video.currentTime;
          var duration = video.duration;
          scrubber.textContent = formatTime(currentTime) + " / " + formatTime(duration);
      }

      function formatTime(time) {
          var hours = Math.floor(time / 3600);
          var minutes = Math.floor((time % 3600) / 60);
          var seconds = Math.floor(time % 60);
          return (hours > 0 ? hours + ":" : "") + (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
      }

      let isLongPress = false
      let longPressTimer;
      let longPressThreshold = 500; // milliseconds

      video.addEventListener("touchstart", function(event) {
          if (event.touches.length == 1) {
              isLongPress = false;
              scrubbing = true;
              scrubStartX = event.touches[0].pageX;
              scrubStartTime = video.currentTime;

              longPressTimer = setInterval(function() {
                  GM_setValue('lastPlaybackRate', video.playbackRate)
                  video.playbackRate = settings.longPressRate;
                  speedAlert.style.display = 'block'
                  isLongPress = true;
                  clearInterval(longPressTimer);
              }, longPressThreshold);
          }
      });

      video.addEventListener("touchmove", function(event) {
          if (scrubbing && event.touches.length == 1 && !isLongPress) {
              deltaX = event.touches[0].pageX - scrubStartX;
              var scrubTime = scrubStartTime + deltaX * video.duration / video.clientWidth * 0.08;
              if (scrubTime < 0) {
                  scrubTime = 0;
              } else if (scrubTime > video.duration) {
                  scrubTime = video.duration;
              }
              clearInterval(longPressTimer)
              scrubber.style.display = "block";
              scrubber.textContent = formatTime(scrubTime) + " / " + formatTime(video.duration);
          }
      });

      video.addEventListener("touchend", function(event) {
          if (scrubbing && event.touches.length == 0) {
              scrubbing = false;
              if (!isLongPress) {
                deltaX = event.changedTouches[0].pageX - scrubStartX;
                if (deltaX != 0) {
                  var scrubTime = scrubStartTime + deltaX * video.duration / video.clientWidth * 0.08;
                  if (scrubTime < 0) {
                      scrubTime = 0;
                  } else if (scrubTime > video.duration) {
                      scrubTime = video.duration;
                  }
                  video.currentTime = scrubTime;
                  scrubber.style.display = "none";
                }
              }

              clearInterval(longPressTimer);
              isLongPress = false
              speedAlert.style.display = 'none'
              video.playbackRate = settings.lastPlaybackRate;
          }
      });

      video.addEventListener("touchcancel", function(event) {
          if (scrubbing && event.touches.length == 0) {
              scrubbing = false;
              scrubber.style.display = "none";

              clearInterval(longPressTimer);
              isLongPress = false
              speedAlert.style.display = 'none'
              video.playbackRate = settings.lastPlaybackRate;
          }
      });

      //播放历史模块
      initPlayHistory()
      let playHistoryButton = document.createElement('li')
      playHistoryButton.className = 'vp-menu-item'
      playHistoryButton.innerHTML = `<a class="vp-link" href="#"><span>播放历史</span></a>`
      document.querySelector('.vp-menu').appendChild(playHistoryButton)
      playHistoryButton.onclick = e => {e.preventDefault();loadHistories();document.querySelector('.history-wrapper').style.display='block';}
      historyUpdateCount = 0

      //FIX: 替换自带progressBar修复手动使用Hls播放高清视频后的点击bug
      let progressBarHtml = `<div class="vjs-progress-control vjs-control vp-video-progress-control"><div tabindex="0" class="vjs-progress-holder vjs-slider vjs-slider-horizontal" role="slider" aria-valuenow="0.00" aria-valuemin="0" aria-valuemax="100" aria-label="进度条" aria-valuetext="2:01/-:-">
<div class="vjs-play-progress vjs-slider-bar" aria-hidden="true" style="width: 0%;"><div class="vjs-time-tooltip" aria-hidden="true" style="right: -18.5px;">0:00</div></div>
</div></div>`
      let progressParent = document.querySelector('.vjs-progress-control').parentElement
      progressParent.children[0].remove()
      progressParent.insertAdjacentHTML('afterbegin', progressBarHtml)
      let progressHolder = progressParent.children[0].children[0]
      let progressBar = progressHolder.children[0]
      let progressToolTip = progressBar.children[0]
      let subtitleElement = document.querySelector('.vp-video__subtitle-text-first')
      let subtitleTab = null
      let subtitleWrapper = null
      let subtitleContent = null
      let subtitleInitTimer = setInterval(() => {
        if (!subtitleTab) {
          const elements = document.querySelectorAll('.vp-tabs__header-item');
          elements.forEach(elem => {
            if (elem.innerText.trim() == '文稿') {
              console.log('已获取到文稿元素')
              subtitleTab = elem
            }
          })
        } else {
          if (subtitleTab.className.indexOf('active')) {
            if (!subtitleWrapper) {
              subtitleWrapper = document.querySelector('.ai-draft__wrap-list')
            } else {
              console.log('%c加载文稿列表', 'color:pink;')
              subtitleContent = subtitleWrapper.parentElement
              clearInterval(subtitleInitTimer)
            }
          }
        }
      }, 400)
      progressHolder.addEventListener('click', updateProgress);
      progressHolder.addEventListener('touchstart', updateProgress);

      subtitleElement.style.fontSize = '24px'
      subtitleElement.parentElement.style.height = 'fit-content'
      subtitleElement.parentElement.style.left = '50%'
      subtitleElement.parentElement.style.top = '80%'
      subtitleElement.parentElement.style.maxWidth = '70%'
      subtitleElement.parentElement.parentElement.style.position = 'relative'
      // function makeDraggableFunction(t,e,n,s){return function(l){var o=parseInt(t.style.left),i=parseInt(t.style.top),p=l.clientX-o,r=l.clientY-i;n&&n(),document.onmousemove=function(n){t.style.left=n.clientX-p+"px",t.style.top=n.clientY-r+"px",e||(parseInt(t.style.left)<=0&&(t.style.left="0px"),parseInt(t.style.top)<=0&&(t.style.top="0px"),parseInt(t.style.left)>=window.innerWidth-parseInt(t.style.width)&&(t.style.left=window.innerWidth-parseInt(t.style.width)+"px"),parseInt(t.style.top)>=window.innerHeight-parseInt(t.style.height)&&(t.style.top=window.innerHeight-parseInt(t.style.height)+"px"))},document.onmouseup=function(){document.onmousemove=null,document.onmouseup=null,s&&s()}}}
      function makeDraggableFunction(elem, allowMoveOut, exec, callback) {
  let handleMouseDown = function (event) {
    let offsetX = event.clientX - elem.getBoundingClientRect().left
    let offsetY = event.clientY - elem.getBoundingClientRect().top

    if (!!exec) {
      exec()
    }

    document.onmousemove = function (event) {
      let newLeft = event.clientX - offsetX
      let newTop = event.clientY - offsetY

      if (!allowMoveOut) {
        // 获取父元素的边界
        let parentRect = elem.parentElement.getBoundingClientRect()

        // 计算元素的右边界和底边界
        let rightBoundary = parentRect.right
        let bottomBoundary = parentRect.bottom

        // 调整新位置，确保元素不超出右边界和底边界
        newLeft = Math.min(Math.max(newLeft, parentRect.left), rightBoundary - elem.offsetWidth)
        newTop = Math.min(Math.max(newTop, parentRect.top), bottomBoundary - elem.offsetHeight)
      }

      elem.style.left = newLeft + 'px'
      elem.style.top = newTop + 'px'
    }

    document.onmouseup = function () {
      document.onmousemove = null
      document.onmouseup = null

      if (!!callback) {
        callback()
      }
    }
  }

  return handleMouseDown
}
      subtitleElement.parentElement.addEventListener('mousedown', makeDraggableFunction(subtitleElement.parentElement, false))

      // initDraftExport()

      //点击更新进度条位置
      function updateProgress(event) {
        var totalWidth = progressHolder.offsetWidth;
        var offsetX = 0;
        if (event.type === 'click') {
          offsetX = event.offsetX;
        } else if (event.type === 'touchstart') {
          offsetX = event.touches[0].clientX - progressHolder.getBoundingClientRect().left;
        }
        var percentage = (offsetX / totalWidth) * 100;
        progressBar.style.width = percentage + '%';
        let currentTime = (percentage / 100) * video.duration;
        progressToolTip.innerText = formatTime(currentTime)
        video.currentTime = currentTime;
      }
      progressHolder.addEventListener('touchmove', function(event) {
        event.preventDefault();
      });
      //寻找字幕
      function showSubtitle(subtitles, currentTime) {
        let left = 0;
        let right = subtitles.length - 1;
        while (left <= right) {
          let middle = Math.floor((left + right) / 2);
          let subtitle = subtitles[middle];
          if (currentTime >= subtitle.startTime && currentTime <= subtitle.endTime) {
            subtitleElement.innerHTML = subtitle.text;
            return;
          } else if (currentTime < subtitle.startTime) {
            right = middle - 1;
          } else {
            left = middle + 1;
          }
        }
        subtitleElement.innerHTML = '';
      }
      //video时间变化执行内容
      function videoTimeUpdate() {
        let currentTime = video.currentTime;
        // 更新自定义进度条的位置
        let percentage = (currentTime / video.duration) * 100;
        progressBar.style.width = percentage + '%';
        //如果开启了字幕，显示字幕
        if (settings.subtitle_enabled && settings.subtitles) {
          if (settings.subtitles) {
            showSubtitle(settings.subtitles, this.currentTime);
          } else {
            subtitleElement.innerText = '字幕正在加载中...'
          }
        }
        historyUpdateCount++
        if (historyUpdateCount == 25) {
          historyUpdateCount = 0
          let lastIdx = settings.path.lastIndexOf('/')
          let title = settings.path
          if (lastIdx != -1)
            title = settings.path.substring(lastIdx + 1)
          let history = {
            path: settings.path,
            title: title,
            timestamp: new Date().getTime(),
            duration: video.duration,
            current: Math.floor(currentTime)
          }
          updateHistory(history)
        }
        //破解Svip打开文稿后同步显示字幕位置
        if (!settings.isSvip && subtitleTab && subtitleTab.className.indexOf('active') != -1 && subtitleWrapper) {
          const paragraphs = subtitleWrapper.children
          let currentIndex = 0
          for (let i = 0; i < paragraphs.length; i++) {
            const paragraph = paragraphs[i]
            if (currentTime * 1000 >= paragraph.dataset.starttime) {
              currentIndex = i
            } else {
              break;
            }
          }
          //取消当前高亮
          try {
            subtitleWrapper.querySelectorAll('.ai-draft__p-sentence--fouce').forEach(node => node.className = 'ai-draft__p-sentence')
          } catch(err) {}
          const subtitles = settings.subtitles
          for (let i = currentIndex * 15; i < (currentIndex + 1) * 15 && i < settings.subtitles.length; i++) {
            if (currentTime > subtitles[i].startTime && currentTime < subtitles[i].endTime) {
              let paragraph = paragraphs[currentIndex].children[i % 15]
              paragraph.className = 'ai-draft__p-sentence ai-draft__p-sentence--fouce'
              paragraph.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
              break;
            }
          }
        }
      }
      video.addEventListener('timeupdate', throttle(videoTimeUpdate, 500));

      //前进后退倍速字幕
      //FIX: 修复替换进度条后键盘控制
      let longPressRightArrowTimer = null
      document.onkeydown = function(e) {
        if (e.key === 'ArrowLeft') {
          if (video.currentTime - 15 >= 0) {
            video.currentTime -= 15;
          } else {
            video.currentTime = 0;
          }
        } else if (e.key === 'ArrowRight') {
          if (video.currentTime + 15 < video.duration) {
            video.currentTime += 15;
          } else {
            video.currentTime = video.duration;
          }
        } else if (e.code === 'Space') {
          if (video.paused) {
            video.play()
          } else {
            video.pause()
          }
        }
      };

      let toolBox = document.createElement('div')
      toolBox.style='width:100%;margin:10px 0;display:flex;justify-content:space-between;flex-flow:row wrap;'
      toolBox.id = 'toolBox'
      let reloadBtn = createButton('重新加载', e => {
        fetchVideoM3U8()
      })
      let subtitleBtn = createButton(settings.subtitle_enabled ? '关闭字幕' : '开启字幕', e => {
        if (settings.subtitle_enabled) { //已经开启了，点击关闭
          subtitleBtn.textContent = '开启字幕'
          document.querySelector('.vp-video__subtitle-text').style.display = 'none'
          GM_setValue('subtitleAutoEnable', false)
        } else { //点击开启字幕
          subtitleBtn.textContent = '关闭字幕'
          document.querySelector('.vp-video__subtitle-text').style.display = 'block'
          if (!settings.subtitles) {
            $msg.info('开始加载字幕文件')
            document.querySelector('.vp-video__subtitle-text-first').innerText = '字幕正在加载中...'
            document.querySelector('.vp-tabs__header-item:nth-child(4)').click();
          }
          if (!settings.subtitleAutoEnable && confirm('是否设置自动开启字幕？')) {
            GM_setValue('subtitleAutoEnable', true)
          }
        }
        settings.subtitle_enabled = !settings.subtitle_enabled
      })
      let rewindBtn = createButton('←15s', e => {
        if (video.currentTime - 15 >= 0) {
          video.currentTime -= 15;
        } else {
          video.currentTime = 0;
        }
      })
      let forwardBtn = createButton('15s→', e => {
        if (video.currentTime + 15 < video.duration) {
          video.currentTime += 15;
        } else {
          video.currentTime = video.duration;
        }
      })
      toolBox.appendChild(reloadBtn)
      toolBox.appendChild(subtitleBtn)
      toolBox.appendChild(rewindBtn)
      toolBox.appendChild(forwardBtn)
      let speedBox = document.createElement('select')
      speedBox.value = settings.lastPlaybackRate
      let speeds = [3, 2, 1.75, 1.5, 1, 0.75]
      speeds.forEach(speed => {
        const option = document.createElement('option');
        option.textContent = speed == 1 ? '正常' : (speed + 'X'); // 设置option的文本值
        option.value = speed;
        speedBox.appendChild(option);
      });
      speedBox.addEventListener('change', event => {
        const selectedSpeed = event.target.value;
        settings.globalVideo.playbackRate = selectedSpeed;
        GM_setValue('lastPlaybackRate', selectedSpeed)
      });
      toolBox.appendChild(speedBox)
      let resolutionBox = document.createElement('select')
      resolutionBox.id = 'resolution-box'
      resolutionBox.addEventListener('change', event => {
        const selectedResolution = event.target.value;
        if (selectedResolution == '1080') {
          alert('1080无法播放好像。。。')
          settings.resolution = '720'
        } else {
          settings.resolution = selectedResolution;
        }
        fetchVideoM3U8()
      })
      toolBox.appendChild(resolutionBox)
      //导出课件
      // let exportPdfBtn = createButton('导出课件', exportPdf1)
      // toolBox.appendChild(exportPdfBtn)
      video.parentElement.parentElement.parentElement.appendChild(toolBox)
      initDraftExport()
      if (settings.subtitleAutoEnable) {
        setTimeout(() => {
          subtitleBtn.click()
        }, 1500)
      }

      //FIX: 修改部分css修复宽度小时无法显示全的问题
      // setTimeout(() => {
      //   document.getElementById('app').style.width = '100%'
      //   document.querySelector('.vp-toolsbar').remove()
      //   document.querySelector('.vp-header').style.minWidth = '0'
      //   document.querySelector('.vp-personal-video-play').style.minWidth = '0'
      //   document.querySelector('.vp-personal-home-layout__video').style.minWidth = '30vw'
      //   document.querySelector('.vp-personal-home-layout__video').style.paddingTop = '10px'
      //   document.querySelector('.vp-personal-home-layout__video').style.height = '80vh'
      // }, 4000)
      // document.querySelector('.vp-personal-home-layout').style.padding = '0 20px'
      // document.querySelector('.vp-personal-home-layout .vp-aside').style.paddingTop = '0'
      // document.querySelector('.vp-tabs').style.minWidth = '10vw'
      if (settings.lastTabWidth) {
        document.querySelector('.vp-personal-home-layout .vp-aside').style.width = settings.lastTabWidth
      }
      function addSplitScreenAdjustment(element1Selector, element2Selector) {
        const element1 = document.querySelector(element1Selector);
        const element2 = document.querySelector(element2Selector);
        let scriptChanging = false;
        const handle = document.createElement('div');
        handle.style.width = '15px';
        handle.style.cursor = 'ew-resize';
        handle.style.backgroundColor = '#ccc';
        handle.style.margin = '0 5px';
        let startX, startWidth1, startWidth2;
        const handleMouseDown = (event) => {
          startX = event.clientX;
          startWidth1 = element1.offsetWidth;
          startWidth2 = element2.offsetWidth;
          scriptChanging = true
          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);
        };
        const handleMouseMove = throttle((event) => {
          const dx = event.clientX - startX;
          const newWidth1 = startWidth1 + dx;
          const newWidth2 = startWidth2 - dx;
          element1.style.width = newWidth1 + 'px';
          element2.style.width = newWidth2 + 'px';
        }, 100);
        const handleMouseUp = () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
          scriptChanging = false
          GM_setValue('lastTabWidth', '"' + element2.style.width + '"')
        };
        handle.addEventListener('mousedown', handleMouseDown);
        const handleTouchStart = (event) => {
          startX = event.touches[0].clientX;
          startWidth1 = element1.offsetWidth;
          startWidth2 = element2.offsetWidth;
          scriptChanging = true
          document.addEventListener('touchmove', handleTouchMove);
          document.addEventListener('touchend', handleTouchEnd);
        };
        const handleTouchMove = throttle((event) => {
          const dx = event.touches[0].clientX - startX;
          const newWidth1 = startWidth1 + dx;
          const newWidth2 = startWidth2 - dx;
          element1.style.width = newWidth1 + 'px';
          element2.style.width = newWidth2 + 'px';
        }, 100);
        const handleTouchEnd = () => {
          document.removeEventListener('touchmove', handleTouchMove);
          document.removeEventListener('touchend', handleTouchEnd);
          scriptChanging = false
          GM_setValue('lastTabWidth', '"' + element2.style.width + '"')
        };
        handle.addEventListener('touchstart', handleTouchStart);
        element2.parentNode.insertBefore(handle, element2);
        //防止百度网盘自动调整他的宽度
        var observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            const oldStyle = mutation.oldValue;
            if (!scriptChanging) {
              observer.disconnect()
              setTimeout(() => {
                element2.style = oldStyle;
                observer.observe(element2, {attributes: true, attributeOldValue: true})
              }, 50)
            }
          });
        });
        observer.observe(element2, { attributes: true, attributeOldValue: true });
      }
      addSplitScreenAdjustment('main', '.vp-personal-home-layout .vp-aside')

      let rateOptions = document.querySelector('.vp-video__control-bar--playback-rates').children
      for (let i = 0; i < rateOptions.length; i++) {
        let option = rateOptions[i]
        if (option.classList[1] != 'is-svip-guide') {
          option.onclick = function(e) {
            e.stopPropagation()
            GM_setValue('lastPlaybackRate', Number.parseFloat(option.innerText.replace('X', '')))
            video.playbackRate = settings.lastPlaybackRate
          }
        }
      }

      //双击暂停
      let container = video.parentElement;
      let pauseThreshold = 500; // milliseconds
      let lastClickTime = 0;
      let pauseTimer;
      container.addEventListener("touchstart", function(event) {
        let currentTime = new Date().getTime();
        if (currentTime - lastClickTime < pauseThreshold) {
          clearTimeout(pauseTimer);
          if (video.paused) {
            video.play();
          } else {
            video.pause();
          }
        } else {
          lastClickTime = currentTime;
          pauseTimer = setTimeout(function() {
            lastClickTime = 0;
          }, pauseThreshold);
        }
      });

      //FIX: 替换自带全屏修复Focus浏览器全屏使用iOS默认播放器
      let vpVideo = document.querySelector('.vp-video')
      let controllBar = document.querySelector('.vp-video__control-bar--setup')
      controllBar.children[4].remove()
      controllBar.insertAdjacentHTML('beforeend', `<div class="vp-video__control-bar--button-group">
  <div class="vp-video__control-bar--button is-icon">
    <i class="u-icon-screen"></i></div></div>`)
      let fullScreenBtn = controllBar.children[4]
      let fullScreenIcon = fullScreenBtn.children[0].children[0]
      fullScreenBtn.onclick = e => {
        if (fullScreenIcon.className == 'u-icon-screen') {
          //点击全屏
          vpVideo.style.zIndex = '99999'
          vpVideo.style.position = 'fixed';
          vpVideo.style.top = '0';
          vpVideo.style.left = '0';
          fullScreenIcon.className = 'u-icon-exit-screen'
        } else {
          vpVideo.style.position = 'unset';
          fullScreenIcon.className = 'u-icon-screen'
        }
      }

      //准备完毕，开始检查视频状态
      startFailChecker()
    }
  }

  function createButton(textContent, callback) {
    let btn = document.createElement('div')
    btn.style = 'padding: 10px 10px; text-align: center; background: rgb(6, 167, 255); color: white;font-size: 14px;cursor:pointer'
    btn.textContent = textContent
    if (callback) {
      btn.onclick = e => {
        callback(e)
      }
    }
    return btn;
  }

  function formatPlayTime(timestamp) {
      let current = new Date().getTime()
      let gap = Math.floor((current - timestamp) / 1000)
      if (gap < 60) {
          return `${gap}秒前`
      } else if (gap < 60 * 60) {
          return `${Math.floor(gap/60)}分钟前`
      } else if (gap < 60 * 60 * 24) {
          return `${Math.floor(gap/60/60)}小时前`
      } else {
          return new Date(timestamp).toLocaleString()
      }
  }
  function initPlayHistory() {
      let style = document.createElement('style')
      style.textContent = '.history-wrapper{display:none;background-color:#fefefe;position:fixed;z-index:99999;top:40%;left:50%;transform:translate(-50%,-50%);padding:5px 10px 10px;border:1px solid #888;width:420px;}.history-list::-webkit-scrollbar{width:4px;}.history-list::-webkit-scrollbar-track{background-color:#f1f1f1;}.history-list::-webkit-scrollbar-thumb{background-color:#888888;}.history-list{min-height:100px;max-height:300px;overflow-y:auto;scrollbar-width:thin;}.history{padding:8px 4px;transition:.2s;cursor:pointer;border-bottom:1px dashed lightgray;}.history:hover{background-color:rgb(240,240,240);}.history-time{color:rgb(100,100,100);font-size:small;}.history-title{font-size:16px;}.history-progress-bar{width:280px;height:6px;background-color:#f1f1f1;border-radius:10px;overflow:hidden;display:inline-block;}.history-progress{width:0%;height:100%;background-color:#007bff;transition:width 0.3s ease-in-out;}.close{color:#aaa;float:right;font-size:28px;font-weight:bold;}.close:hover,.close:focus{color:black;text-decoration:none;cursor:pointer;}.history-end{color:rgb(150,150,150);text-align:center;font-size:small;}';
      document.head.append(style)
      let historyWrapper = document.createElement('div')
      historyWrapper.className = 'history-wrapper'
      historyWrapper.innerHTML = `<span style="float:left;margin-top: 5px;font-weight: bold;">播放历史（保留20条）</span>
          <span class="close" onclick="closeModal()">&times;</span>
          <div style="clear:both;"></div>
          <div class="history-list"></div>`
      historyWrapper.querySelector('.close').onclick = function(e) {
          historyWrapper.style.display = 'none'
      }
      document.body.append(historyWrapper)
      var existingHistoryIndex = settings.histories.findIndex(function(item) {
        return item.path === settings.path;
      });
      if (existingHistoryIndex != -1 && settings.globalVideo) {
        settings.globalVideo.currentTime = settings.histories[existingHistoryIndex].current
      }
      loadHistories()
  }
  function loadHistories() {
      let historyList = document.querySelector('.history-list')
      historyList.innerHTML = ''
      for (let i = settings.histories.length - 1; i >= 0; i--) {
        let history = settings.histories[i]
        let historyElem = document.createElement('div')
        historyElem.className = 'history'
        historyList.append(historyElem)
        historyElem.innerHTML = `<div class="history-time">${formatPlayTime(history.timestamp)}</div>
          <div class="history-title">${history.title}</div>
          <div class="history-progress-bar">
            <div class="history-progress" style="width:${100*history.current/history.duration}%"></div>
          </div>
          <span style="color:rgb(100,100,100);font-size:12px;">观看至${formatTime(history.current)}</span>`
        historyElem.setAttribute('path', history.path)
      }
      historyList.onclick = function(e) {
        const elem = event.target.closest('.history');
        if (elem) {
          const path = elem.getAttribute('path')
          if (confirm('跳转视频' + path + '?')) {
            location.href = 'https://pan.baidu.com/pfile/video?path=' + encodeURIComponent(path)
          }
        }
      }
      historyList.innerHTML += `<div class="history-end">—————— 已经到底了哦 ——————</div>`
  }
  function updateHistory(history) {
    const histories = settings.histories;
    var existingHistoryIndex = histories.findIndex(function(item) {
      return item.path === history.path;
    });
    if (existingHistoryIndex !== -1) {
      histories.splice(existingHistoryIndex, 1)[0];
      histories.push(history);
    } else {
      histories.push(history);
      if (histories.length > 20) {
        histories.splice(0, 1)
      }
    }
    GM_setValue('histories', histories);
  }

  function hookRequest() {
      var originOpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function (method, url) {
        // console.log(`%c【${method}】:${url}`, 'color:blue;')
        if (url.indexOf('netdisk-subtitle') != -1 && settings.solve_subtitle) { //获取字幕信息
          this.addEventListener('readystatechange', function() {
            if (this.readyState == 4) {
              var blobData = this.response;
              var reader = new FileReader();
              reader.onloadend = function() {
                var textContent = reader.result;
                let arr = textContent.split('\n')
                setTimeout(() => {
                  let wrapper = document.querySelector('.ai-draft__wrap-list')
                  try {
                    document.querySelector('.ai-draft__wrap-content').style = 'padding-right:12px!important;'
                    document.querySelector('.ai-draft__wrap-content').contentEditable = true
                    document.querySelector('.ai-draft__filter').remove()
                    document.querySelector('.ai-draft__svip-guide').remove()
                  } catch(err) {
                  }
                  let subtitles = []
                  let paragraph
                  console.log('开始解析字幕')
                  for (let i = 1; i < arr.length / 4; i++) {
                    if (arr[i * 4] == '')
                      break;
                    let lines = [arr[i * 4], arr[i * 4 + 1], arr[i * 4 + 2]]
                    let timeParts = lines[1].split(' --> ');
                    let startTime = srtTimeToSeconds(timeParts[0].trim());
                    let endTime = srtTimeToSeconds(timeParts[1].trim());
                    if (!settings.isSvip && i >= 15 * 3 + 1) {
                      if (i % 15 == 1) {
                        paragraph = document.createElement('p')
                        paragraph.className = 'ai-draft__p-paragraph'
                        paragraph.setAttribute('data-starttime', startTime * 1000)
                      } else if (i % 15 == 0) {
                        wrapper.appendChild(paragraph)
                      }
                      let span = document.createElement('span')
                      span.className = 'ai-draft__p-sentence'
                      span.setAttribute('data-index', i - 1)
                      span.innerText = lines[2]
                      span.onclick = e => {
                        settings.globalVideo.currentTime = startTime
                      }
                      paragraph.appendChild(span)
                    }
                    subtitles.push({
                      index: i - 1,
                      startTime: startTime,
                      endTime: endTime,
                      text: lines[2]
                    })
                  }
                  settings.subtitles = subtitles
                }, 1000)
              };
              reader.readAsText(blobData);
            }
          });
          originOpen.apply(this, arguments);
        } else if (url.indexOf('/api/loginStatus') != -1) { //伪造svip信息
          this.addEventListener('readystatechange', function() {
            if (this.readyState == 4) {
              let res = JSON.parse(this.responseText)
              settings.isSvip = res.login_info.vip_type == '21'
              res.login_info.vip_type = '21'
              res.login_info.vip_identity = '21'
              res.login_info.vip_level =  10
              res.login_info.vip_point = 99999
              res.login_info.svip10_id = '000000'
              res.login_info.username = 'sout(\'GwenCrack\')'
              settings.bdstoken = res.login_info.bdstoken
              Object.defineProperty(this, "responseText", {
                  writable: true,
              });
              this.responseText = JSON.stringify(res)
            }
          })
          originOpen.apply(this, arguments);
        } else if (url.indexOf('/user/info') != -1) {
          this.addEventListener('readystatechange', function() {
            if (this.readyState == 4) {
              let res = {}
              if (this.responseType == 'json') {
                res = this.response
              } else {
                res = JSON.parse(this.responseText)
              }
              res.user_info.is_vip = 1
              res.user_info.is_svip = 1
              res.user_info.is_plus_buy =	1
              if (this.responseType == 'json') {
                Object.defineProperty(this, "responseText", {
                  writable: true,
                });
                this.responseText = JSON.stringify(res)
              } else {
                Object.defineProperty(this, "responseText", {
                  writable: true,
                });
                this.response = res
              }
            }
          })
          originOpen.apply(this, arguments);
        } else if (url.indexOf('/membership/user') != -1) {
          this.addEventListener('readystatechange', function() {
            if (this.readyState == 4) {
              let res = {}
              if (this.responseType == 'json') {
                res = this.response
              } else {
                res = JSON.parse(this.responseText)
              }
              res.reminder = {
                "svip": {
                  "leftseconds": 999999999999,
                  "nextState": "normal"
                }
              }
              res.level_info = {
                "current_value": 12090,
                "current_level": 10,
                "history_value": 11830,
                "history_level": 10,
                "svip10_id": "000000",
                "last_manual_collection_time": 0
              }
              res.product_infos = [{
                "product_id": "",
                "start_time": 1685635199,
                "end_time": 2547483648,
                "buy_time": 0,
                "cluster": "vip",
                "detail_cluster": "svip",
                "auto_upgrade_to_svip": 0,
                "product_name": "svip2_nd",
                "status": 0,
                "function_num": 0,
                "buy_description": "",
                "product_description": "",
                "cur_svip_type": "month"
              }]
              res.current_product = {
                "cluster": "vip",
                "detail_cluster": "svip",
                "product_type": "vip2_1m_auto",
                "product_id": "12187135090581539740"
              }
              res.current_product_v2 = {
                "cluster": "vip",
                "detail_cluster": "svip",
                "product_type": "vip2_1m_auto",
                "product_id": "12187135090581539740"
              }
              if (this.responseType == 'json') {
                Object.defineProperty(this, "response", {
                  writable: true,
                });
                this.response = res
              } else {
                Object.defineProperty(this, "responseText", {
                  writable: true,
                });
                this.responseText = JSON.stringify(res)
              }
            }
          })
          originOpen.apply(this, arguments);
        } else if (url.indexOf('/api/streaming') != -1 && url.indexOf('M3U8_SUBTITLE_SRT') == -1) { //获取视频m3u8接口
          let modifiedUrl = url.replace(/vip=2/, 'vip=0')
                  // .replace(/M3U8_.*?&/, 'M3U8_AUTO_1080&')
          if (settings.adToken) {
            modifiedUrl += ('&adToken=' + encodeURIComponent(settings.adToken))
            settings.adToken = null
          }
          originOpen.call(this, method, modifiedUrl, arguments[2]);
          this.addEventListener('readystatechange', function() {
            if (this.readyState == 4) {
              if (this.status != 200) {
                $msg.error('加载失败！！！！')
                return
              }
              if (this.responseText[0] == '{') {
                let res = JSON.parse(this.responseText)
                settings.adToken = res.adToken
                res.ltime = 0.001
                res.adTime = 0.001
                Object.defineProperty(this, "responseText", {
                  writable: true,
                });
                this.responseText = JSON.stringify(res)

                if (settings.isSvip) {
                  settings.lastCurrentTime = settings.globalVideo ? settings.globalVideo.currentTime : 0
                  let xhr = new XMLHttpRequest()
                  let url = `https://pan.baidu.com/api/streaming?app_id=250528&clienttype=0&channel=chunlei&web=1&isplayer=1&check_blue=1&type=M3U8_AUTO_${settings.resolution?settings.resolution:'480'}&trans=&vip=0` +
                        `&bdstoken=${settings.bdstoken||unsafeWindow.locals.bdstoken}&path=${encodeURIComponent(settings.path)}&jsToken=${unsafeWindow.jsToken}`
                  xhr.open("GET", url, false)
                  xhr.send()
                  this.responseText = xhr.responseText.replace(/https.*?\//, 'https://nv0.baidupcs.com/')
                } else if (this.callback) {
                  this.callback()
                }
              } else {
                let m3u8Content = this.responseText
                let blob = new Blob([this.responseText], { type: 'application/vnd.apple.mpegurl' });
                let url = URL.createObjectURL(blob);
                bindHls(url)
                settings.m3u8url = url
              }
            }
          })
        } else if (url.indexOf('/api/streaming') != -1 && url.indexOf('SUBTITLE_SRT') != -1) {
          this.addEventListener('readystatechange', function() {
            if (this.readyState == 4) {
              let res = this.responseText
              Object.defineProperty(this, "responseText", {
                  writable: true,
              });
              this.responseText = res.replace(/https:\/\/.*?\//, 'https://nv0.baidupcs.com/')
            }
          })
          originOpen.apply(this, arguments);
        } else if (url.indexOf('/api/filemetas') != -1) {
          this.addEventListener('readystatechange', function() {
            if (this.readyState == 4) {
              let res = JSON.parse(this.responseText)
              if (res.info.length != 1)
                return
              let resolution = res.info[0].resolution
              console.log('分辨率'+ resolution)
              let resolutionOptions = []
              let match = false
              switch(resolution) {
                case 'width:1920,height:1080':
                  match = true
                  resolutionOptions.push('1080')
                case 'width:1280,height:720':
                  match = true
                  resolutionOptions.push('720')
                case 'width:720,height:480':
                  match = true
                  resolutionOptions.push('480')
                default:
                  resolutionOptions.push('360');
              }
              if (!match) {
                resolutionOptions = ['720', '480', '360']
              }
              console.log(resolutionOptions)
              let waitTimer = setInterval(() => {
                let box = document.getElementById('resolution-box')
                if (box) {
                  clearInterval(waitTimer)
                  box.innerHTML = ''
                  resolutionOptions.forEach(resolution => {
                    const option = document.createElement('option')
                    option.textContent = resolution + 'P'
                    option.value = resolution
                    box.appendChild(option)
                  })
                }
              }, 400)
            }
          })
          originOpen.apply(this, arguments);
        } else if (url.indexOf('/msg/streaming') != -1 || url.indexOf('/share/streaming') != -1) {
          this.addEventListener('readystatechange', function() {
            if (this.readyState == 4) {
              if (this.responseText[0] != '{')
                return
              let res = JSON.parse(this.responseText)
              res.ltime = 0.000001
              res.adTime = 0.000001
              Object.defineProperty(this, 'responseText', {
                writable: true,
              })
              this.responseText = JSON.stringify(res)
            }
          })
          originOpen.apply(this, arguments);
        } else if (url.indexOf('/aitrans/ppt/get') != -1) {
          const parseTimeToSeconds = (timeStr) => {
            let [h, m, s] = timeStr.split(":");
            return parseInt(h)*60*60 + parseInt(m)*60 + parseInt(s);
          }
          this.addEventListener('readystatechange', function() {
            if (this.readyState == 4) {
              console.log("课件：" + this.responseText);
              let res = JSON.parse(this.responseText);
              console.log(res);
              let list = res.data.list;
              if (!list || list.length == 0) {
                $msg.error("没有pdf，等待生成或者别生成了");
                return;
              }
              const timePoints = [];
              for (let item of list) {
                for (let time of item.img_timestamp) {
                  console.log(time);
                  timePoints.push(parseTimeToSeconds(time))
                }
              }
              console.log(timePoints)
              settings.timePoints = timePoints;
              showPdf();
            }
          })
          originOpen.apply(this, arguments);
        } else {
          originOpen.apply(this, arguments);
        }

        /*
        else if (url.indexOf('/ppt/common') != -1) { // 查询ppt生成情况接口
          this.addEventListener('readystatechange', function() {
            if (this.readyState == 4) {
              console.log("课件：" + this.responseText)
              let res = JSON.parse(this.responseText)
              res.data.rights_info.residue_count = 10
              res.data.rights_info.vip_type = 4
              res.data.rights_info.strategy_flag = 1
              if (url.indexOf('method=apply') != -1) {
                res.data.apply_status = 200
              }
              Object.defineProperty(this, 'responseText', {
                writable: true
              })
              Object.defineProperty(this, 'response', {
                writable: true
              })
              this.response = JSON.stringify(res)
              this.responseText = JSON.stringify(res)
              console.log(res)
            }
          })
          originOpen.apply(this, arguments);
        }
        */
      }
    }

  function bindHls(url) {
    if (!Hls.isSupported()) {
      $msg.error('浏览器不支持播放')
      return
    }
    if (settings.hls) {
      try {
        settings.hls.destroy()
        settings.hls = null
      } catch(err) {
        console.error(err)
      }
    }
    settings.hls = new Hls({
      autoStartLoad: true,
      autoplay: true
    })
    let hls = settings.hls
    let video = settings.globalVideo
    let vpError = document.querySelector('.vp-error')
    if (vpError) {
      vpError.remove()
    }
    hls.on(Hls.Events.MEDIA_ATTACHED, function() {
      hls.loadSource(url);
    });
    hls.on(Hls.Events.MANIFEST_PARSED, function(event, data) {
      console.log('上次加载到' + settings.lastCurrentTime)
      video.currentTime = settings.lastCurrentTime
      video.play();
      video.playbackRate = settings.lastPlaybackRate
      let checkDurationTimer = setInterval(() => {
        if (video.readyState > 0) {
          document.querySelector('.vp-video__control-bar--play-time-all>div').innerText = formatTime(video.duration)
          clearInterval(checkDurationTimer)
        }
      }, 100)
    });
    hls.attachMedia(video);
  }
  function srtTimeToSeconds(timeString) {
    var timeParts = timeString.split(':');
    var hours = parseInt(timeParts[0]);
    var minutes = parseInt(timeParts[1]);
    var secondsAndMilliseconds = timeParts[2].split('.');
    var seconds = parseInt(secondsAndMilliseconds[0]);
    var milliseconds = parseInt(secondsAndMilliseconds[1]);
    var totalSeconds = (hours * 3600) + (minutes * 60) + seconds + (milliseconds / 1000);
    return totalSeconds;
  }

  function formatTime(totalSeconds, requireMil = false) {
    var hours = Math.floor(totalSeconds / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = Math.floor(totalSeconds % 60);
    var formattedTime = hours.toString().padStart(2, '0') + ':' +
                        minutes.toString().padStart(2, '0') + ':' +
                        seconds.toString().padStart(2, '0');
    if (requireMil) {
      formattedTime += ',' + (seconds % 1).toFixed(3).substring(2)
    }
    return formattedTime;
  }
  function copyToClipboard(txt){
    if (navigator.clipboard?.writeText)
      navigator.clipboard.writeText(txt)
    else {
      input = document.createElement('textarea')
      input.setAttribute('readonly', 'readonly')
      input.value = txt
      document.body.appendChild(input)
      input.select()
      if (document.execCommand('copy'))
        document.execCommand('copy')
      document.body.removeChild(input)
    }
  }
  function initDraftExport() {
    function getDefaultFilename(ext) {
      var videoNameElement = document.querySelector('div.vp-video-page-card span.is-playing.vp-video-page-card__video-name');
      if (videoNameElement) {
        var originalFilename = videoNameElement.innerText.trim();
        var newFilename = originalFilename.replace(/\.[^/.]+$/, '') + ext; // 去掉原始文件名的后缀，并添加新的后缀名
        return newFilename;
      }
      return 'subtitle' + ext;
    }
    let toolBox = document.getElementById('toolBox')
    // 创建复制字幕按钮
    function createDraftButton(id, textContent, left, callback) {
      const btn = document.createElement('button');
      btn.id = id;
      btn.innerText = textContent;
      // btn.style = `position:fixed;left:${left};bottom:3px;z-index:9999;padding:10px;background:#fff;border:1px solid #ccc;cursor:pointer;`
      btn.style = 'padding: 3px 10px;font-size: 14px;background:#fff;border:1px solid #ccc;cursor:pointer;'
      // 复制字幕按钮点击事件处理函数
      btn.addEventListener('click', function() {
        if (!settings.subtitles) {
          $msg.info('视频文稿未加载，开始加载...')
          document.querySelector('.vp-tabs__header-item:nth-child(4)').click();
          setTimeout(() => {
            document.querySelector('.vp-tabs__header-item:nth-child(1)').click();
          }, 500)
          return
        }
        callback()
      });
      toolBox.append(btn)
    }
    createDraftButton('copySubtitleBtn', '复制字幕', '40px', function() {
      const subtitleElements = document.querySelectorAll('.ai-draft__wrap-list p.ai-draft__p-paragraph'); // 获取所有段落元素
      const subtitleText = [];
      for (let i = 0; i < subtitleElements.length; i++) {
        subtitleText.push(subtitleElements[i].innerText.trim()); // 将每个段落的文本添加到字幕数组中
      }
      copyToClipboard(subtitleText.join('\n\n')); // 将字幕数组以空行连接起来并返回
      $msg.success('字幕已复制')
    })
    createDraftButton('exportToDocBtn', '导出文稿doc', '120px', function() {
      $msg.info('正在导出文稿...')
      const subtitleElements = document.querySelectorAll('.ai-draft__wrap-list p.ai-draft__p-paragraph'); // 获取所有段落元素
      const subtitleText = [];
      for (let i = 0; i < subtitleElements.length; i++) {
        subtitleText.push(subtitleElements[i].innerText.trim()); // 将每个段落的文本添加到字幕数组中
      }
      const subtitle = subtitleText.join('\n\n'); // 获取字幕内容
      const filename = getDefaultFilename('.doc');
      var blob = new Blob([subtitle], {type: 'text/plain;charset=utf-8'});
      var downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = filename;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(downloadLink.href);
      //saveAs(blob, filename); // 使用FileSaver.js保存文件
      $msg.success('导出成功')
    })
    createDraftButton('exportToSrtBtn', '导出字幕srt', '220px', function() {
      $msg.info('正在导出文稿...')
      const blobArray = [];
      settings.subtitles.forEach(function(subtitle) {
        const srtText =
          (subtitle.index + 1) + "\n" +
          formatTime(subtitle.startTime, true) + " --> " + formatTime(subtitle.endTime, true) + "\n" +
          subtitle.text + "\n\n";
        // console.log(srtText)
        const srtBlob = new Blob([srtText], { type: "text/plain;charset=utf-8" });
        blobArray.push(srtBlob);
      });
      var combinedBlob = new Blob(blobArray, { type: "text/plain;charset=utf-8" });
      var downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(combinedBlob);
      downloadLink.download = getDefaultFilename('.srt');
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(downloadLink.href);
      //saveAs(combinedBlob, getDefaultFilename('.srt'));
      $msg.success('导出成功')
    })
  }

  hookRequest()
  init()
  function setLocals() {
    let localsTimer = setInterval(() => {
      if (!unsafeWindow.locals) return
      clearInterval(localsTimer)
      console.log('设置window.locas', unsafeWindow.locals)
      if (unsafeWindow.locals.userInfo) {
        unsafeWindow.locals.userInfo.vip_level = 8
        unsafeWindow.locals.userInfo.vip_identity = 21
        unsafeWindow.locals.userInfo.username = "GwenCrackヾ(-_-;)"
      } else if(unsafeWindow.locals.mset) {
        unsafeWindow.locals.mset({
          'is_vip': 1,
          'is_svip': 1,
          'vip_level': 8,
          'show_vip_ad': 0
        })
      } else {
        unsafeWindow.locals.vip_level = 8
        unsafeWindow.locals.is_vip = 1
        unsafeWindow.locals.is_svip = 1
        unsafeWindow.locals.is_evip = 0
        unsafeWindow.locals.show_vip_ad = 0
      }
    }, 100)
  }
  setLocals()
  let lastUrl = location.href
  setInterval(() => {
    if (lastUrl != location.href) {
      lastUrl = location.href
      console.log('%cURL变化为' + location.href, 'color:purple;')
      settings.path = new URLSearchParams(new URL(lastUrl).search).get('path');
      setTimeout(() => {
        $msg.info('重新加载字幕')
        settings.subtitles = null
        document.querySelector('.vp-tabs__header-item:nth-child(4)').click();
        setTimeout(() => {
          document.querySelector('.vp-tabs__header-item:nth-child(1)').click();
        }, 500)
      }, 4000)

    }
  }, 500)

  function showPdf() {
    document.querySelector('.vp-tabs__header').children[2].click()
    const doShow = () => {
      if (!settings.timePoints || settings.timePoints.length == 0) {
        console.log("正在加载课件时间点...");
        setTimeout(doShow, 500);
      } else {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        let aiCourse = document.querySelector(".vp-ai-course")
        let aiCourseTools = null;
        let logText = null;
        let reloadBtn = null;
        let exportBtn = null;
        let imageContainer = document.getElementById("export-image-container")
        // if (aiCourse && !aiCourse.querySelector('.vp-ai-course-tools')) {
        if (aiCourse) {
          aiCourse.innerHTML = ''
          aiCourseTools = createElement('div', 'vp-ai-course-tools', {style:'margin-bottom:5px;'})
          logText = createElement('span', '', {style:'margin-right:10px;font-size:16px;'})
          reloadBtn = createElement('button', '', {innerText: '重新加载', disabled: true, style: 'margin-right:10px;padding: 3px 10px;font-size: 14px;background:#fff;border:1px solid #ccc;cursor:pointer;'});
          exportBtn = createElement('button', '', {innerText: '导出', disabled: true, style: 'padding: 3px 10px;font-size: 14px;background:#fff;border:1px solid #ccc;cursor:pointer;'});
          reloadBtn.onclick = () => {
            if (!reloadBtn.disabled) {
              showPdf();
            }
          }
          let exportLock = false;
          exportBtn.onclick = () => {
            if (!exportBtn.disabled && !exportLock) {
              exportLock = true;
              $msg.info("正在写入pdf")
              if (settings.captureHls)
                settings.captureHls.destroy();
              settings.captureHls = null;
              // 导出pdf
              const imgs = imageContainer.querySelectorAll('img')
              let w = imgs[0].naturalWidth, h = imgs[0].naturalHeight
              let pdf = new jspdf.jsPDF('l', 'px', [w, h]);
              for (let i = 0; i < imgs.length; i++) {
                  let img = imgs[i]
                  pdf.addImage(img.src, 'JPEG', 0, 0, w, h)
                  pdf.addPage([img.naturalWidth, img.naturalHeight], 'l')
              }
              const targetPage = pdf.internal.getNumberOfPages()
              pdf.deletePage(targetPage)
              pdf.save(document.querySelector('.vp-personal-home-layout__video > .vp-toolsbar > .vp-toolsbar__title').title + '.pdf')
              $msg.success("导出成功")
              settings.timePoints = []
              exportLock = false;
            }
          }
          aiCourseTools.appendChild(logText)
          aiCourseTools.appendChild(reloadBtn)
          aiCourseTools.appendChild(exportBtn)
          aiCourse.append(aiCourseTools);
        }
        if (!imageContainer) {
          imageContainer = document.createElement('div')
          imageContainer.id = "export-image-container"
          imageContainer.style.overflowY = 'auto'
        } else {
          imageContainer.innerHTML = ''
        }
        aiCourse.appendChild(imageContainer)

        //const hls = new Hls();
        if (settings.captureHls) {
          settings.captureHls.destroy();
          settings.captureHls = null;
        }
        settings.captureHls = new Hls();
        const hls = settings.captureHls;
        video.volume = 0

        hls.on(Hls.Events.MEDIA_ATTACHED, function() {
            hls.loadSource(settings.m3u8url);
        });

        hls.on(Hls.Events.MANIFEST_PARSED, function() {
            video.play();
        });

        hls.on(Hls.Events.ERROR, function (event, data) {
          // console.log("HLS ERROR");
          // console.log(event, data)
          if (data.fatal && data.type == Hls.ErrorTypes.MEDIA_ERROR) {
            $msg.error("导出出现异常，尝试恢复")
            hls.recoverMediaError();
            logText.innerHTML = '<span style="color:red">导出出现异常，尝试恢复</span>'
          } else if (data.fatal) {
            $msg.error("导出失败，请重试")
            logText.innerHTML = '<span style="color:red">导出失败，请重试</span>'
            reloadBtn.disabled = false;
          }
        })

        video.oncanplay = function() {
          video.oncanplay = null;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          function captureScreenshot(timePoints, index) {
            if (index >= timePoints.length) {
              // 销毁视频对象
              settings.captureHls.destroy();
              settings.captureHls = null;
              logText.innerHTML = '加载完成';
              reloadBtn.disabled = false;
              exportBtn.disabled = false;
              return;
            }
            logText.innerHTML = `加载中(${index+1}/${timePoints.length})`
            const time = timePoints[index]
            video.pause();
            video.currentTime = time;
            video.onseeked = function() {
              video.onseeked = null;
              context.drawImage(video, 0, 0, canvas.width, canvas.height);
              const imgDataUrl = canvas.toDataURL('image/jpeg', 1);
              const imgWrapper = createElement('div', '', {style:'position:relative;width:100%;height:fit-content;'})
              const img = createElement('img', '', {src: imgDataUrl, style: 'width:100%;'});
              imgWrapper.append(img)
              imageContainer.appendChild(imgWrapper);
              imgWrapper.addEventListener('mouseenter', () => {
                const imgOverlay = createElement('div', 'img-index-text', {textContent:`${index+1}/${timePoints.length}`, style: "font-size:13px;position:absolute;top:0;left:0;background:black;color:white;padding:5px;border-radius:5px;"});
                imgWrapper.appendChild(imgOverlay);
              });
              imgWrapper.addEventListener('mouseleave', () => {
                const imgOverlay = imgWrapper.querySelector('.img-index-text');
                imgWrapper.removeChild(imgOverlay);
              });
              captureScreenshot(timePoints, index+1)
            };
          }
          captureScreenshot(settings.timePoints, 0)
        };
        hls.attachMedia(video);
      }
    }
    if (!unsafeWindow.jspdf) {
      let script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.1.1/jspdf.umd.min.js'
      document.head.appendChild(script)
      script.onload = doShow
      $msg.info("正在引入pdf所需js依赖")
    } else {
      doShow()
    }
  }

})()