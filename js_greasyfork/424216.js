// ==UserScript==
// @name        B站自动宽屏
// @description 自动宽屏、调整滚动条位置、左右侧添加回到顶部隐藏按钮，自动隐藏小窗口视频
// @version     5.4
// @author      zhanaa
// @include     *://www.bilibili.com/video/*
// @include     *://www.bilibili.com/bangumi/*
// @namespace nobody_space
// @downloadURL https://update.greasyfork.org/scripts/424216/B%E7%AB%99%E8%87%AA%E5%8A%A8%E5%AE%BD%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/424216/B%E7%AB%99%E8%87%AA%E5%8A%A8%E5%AE%BD%E5%B1%8F.meta.js
// ==/UserScript==

//该dom元素是动态添加的，得通过setInterval设置
    var ss = setInterval(btnChangeStyle, 1500);
    let mini_box
    //发送弹幕按钮改为白色背景
    function btnChangeStyle(){
        var btn = document.querySelector('.bpx-player-dm-btn-send').children[0];
        mini_box = document.querySelector('.bpx-state-no-cursor');
        if(btn !== null){
            btn.style.color = '#757575';
            btn.style.backgroundColor = '#ffffff';
        }
        if(btn !== null && mini_box !== null){
            clearInterval(ss)
        }
    }

 window.addEventListener('scroll', function (e) {
        if(window.pageYOffset >= 700 && mini_box !== null){
            mini_box.style.display='none';
          }
        if(window.pageYOffset < 700 && mini_box !== null){
            mini_box.style.display='block';
          }
  })

//自动宽屏、调整滚动条位置
function setScroll(){
    if(location.pathname.indexOf("bangumi/") === 1){
        window.scrollTo(0,0)
    }else{
        window.scrollTo(0,146)
    }
}

;(async function () {
  // prevent space bar from scrolling page
  window.addEventListener('keydown', function (e) {
    if (e.code === 'Space' && e.target == document.body) {
      e.preventDefault()
    }
  })

  const sleep = function * (sec) {
    while (true) {
      yield new Promise(res => setTimeout(res, sec * 1000))
    }

  }

  for await (const __ of sleep(0.5)) {
    const box = document.querySelector(
      '.bpx-player-control-bottom-right',
    )
    const btn = box.querySelector('.bpx-player-ctrl-wide-enter')
    if (btn) {
      btn.click()
      break
    }
  }
    setScroll()
})()

////////////////////////////////
//右侧大区域添加回到顶部隐藏按钮
;(async function() {
    var btnId = '__gotop1';
    var isIE = !!window.ActiveXObject && /msie (\d)/i.test(navigator.userAgent) ? RegExp['$1'] : false;

    function $() {
        return document.getElementById(arguments[0]);
    }

    function getScrollTop() {
        return ('pageYOffset' in window) ? window.pageYOffset
            : document.compatMode === "BackCompat"
            && document.body.scrollTop
            || document.documentElement.scrollTop ;
    }

    function bindEvent(event, func) {
        if (window.addEventListener) {
            window.addEventListener(event, func, false);
        } else if (window.attachEvent) {
            window.attachEvent('on' + event, func);
        }
    }

    bindEvent('load',
        function() {
            var css = 'width:125px;height:560px;position:fixed;right:10px;top:8px;border-radius:10px;cursor:pointer;display:none;';

            if (isIE && isIE < 7) {
                css += '_position:absolute;_top:expression(eval(document.documentElement.scrollTop+document.documentElement.clientHeight-30-this.offsetHeight-(parseInt(this.currentStyle.marginTop,10)||0)-(parseInt(this.currentStyle.marginBottom,10)||0)))';
                var style = document.createStyleSheet();
                style.cssText = '*html{background-image:url(about:blank);background-attachment:fixed;}';
            }

            var html = '';
            var el = document.createElement('DIV');
            el.id = btnId;
            el.style.cssText = css;
            el.innerHTML = html;
            document.body.appendChild(el);

            el.onclick = function() {
                 setScroll()
            };

            
        }
    );

    bindEvent('scroll',
        function() {
            var top = getScrollTop(), display = 'none';

            if (top >= 0) {
                display = 'block';
            }

            $(btnId).style.display = display;
        });
})();

////////////////////////////////
//左侧大区域添加回到顶部隐藏按钮
;(async function() {
    var btnId = '__gotop2';
    var isIE = !!window.ActiveXObject && /msie (\d)/i.test(navigator.userAgent) ? RegExp['$1'] : false;

    function $() {
        return document.getElementById(arguments[0]);
    }

    function getScrollTop() {
        return ('pageYOffset' in window) ? window.pageYOffset
            : document.compatMode === "BackCompat"
            && document.body.scrollTop
            || document.documentElement.scrollTop ;
    }

    function bindEvent(event, func) {
        if (window.addEventListener) {
            window.addEventListener(event, func, false);
        } else if (window.attachEvent) {
            window.attachEvent('on' + event, func);
        }
    }

    bindEvent('load',
        function() {
            var css = 'width:125px;height:560px;position:fixed;left:10px;top:8px;border-radius:10px;cursor:pointer;display:none;';

            if (isIE && isIE < 7) {
                css += '_position:absolute;_top:expression(eval(document.documentElement.scrollTop+document.documentElement.clientHeight-30-this.offsetHeight-(parseInt(this.currentStyle.marginTop,10)||0)-(parseInt(this.currentStyle.marginBottom,10)||0)))';
                var style = document.createStyleSheet();
                style.cssText = '*html{background-image:url(about:blank);background-attachment:fixed;}';
            }

            var html = '';
            var el = document.createElement('DIV');
            el.id = btnId;
            el.style.cssText = css;
            el.innerHTML = html;
            document.body.appendChild(el);

            el.onclick = function() {
                 setScroll()
            };
        }
    );

    bindEvent('scroll',
        function() {
            var top = getScrollTop(), display = 'none';

            if (top >= 0) {
                display = 'block';
            }

            $(btnId).style.display = display;
        });
    
})();

//////////////////////////////////////////////
///点击播放页面推荐的视频时也自动宽屏
//////////////////////////////////////////////////

(function bilibili() {
    'use strict';
    var counter=0;
    let iscensor = true;
    let url = geturl();//获取刚加载脚本时的Url
    is_change_url();
    censor();
    setTimeout(censor,100);
    go();

    function go(){
        counter++;
        if(document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-widescreen")&&document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-widescreen").offsetHeight>0){
            if(document.querySelector("#bangumi_player")){
              scrollTo(0,document.querySelector("#bangumi_player").offsetTop);
              if(document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-widescreen").innerHTML.indexOf("退出宽屏")!=-1 ||
                 document.querySelector(".bilibili-player-video-btn.bilibili-player-video-web-fullscreen").innerHTML.indexOf("退出网页全屏")!=-1 ||
                 document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-fullscreen").innerHTML.indexOf("退出全屏")!=-1
                ){iscensor = true; return;}
              setTimeout(function(){document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-widescreen").click();iscensor = false;},50);
            }
            else{
               if(document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-widescreen:not(.closed)")!=null)
               setTimeout(function(){document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-widescreen:not(.closed)").click();iscensor = false;},50);
            }
        }
        else{
            if(counter>2){
                iscensor = false;
                return;
            }
            setTimeout(go,300);
        }
    }

    function geturl(){
        return window.location.href;
    }

    function is_change_url(){
       if(url!=geturl()){
           clearTimeout(censor);
           bilibili();
        }else
            setTimeout(is_change_url,100);
    }
    function censor(){
         setScroll()
    }

})();

