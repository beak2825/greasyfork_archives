// ==UserScript==
// @name       浮窗小工具
// @namespace  http://tampermonkey.net/
// @match      https://uatcts.jicift.com/*
// @match      http://*.jiciot.com/*
// @exclude    http://ls.demo.jiciot.com/
// @version    1.0.2
// @description  右下角浮窗单击展开多个自定义操作区域
// @author       沸水煮青蛙
// @grant        GM_addStyle
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @require https://code.jquery.com/jquery-2.1.3.min.js#sha256=23456...
// @require https://code.jquery.com/jquery-2.1.2.min.js#md5=34567...,sha256=6789...
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471309/%E6%B5%AE%E7%AA%97%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/471309/%E6%B5%AE%E7%AA%97%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
(function() {
    'use strict';
    console.log(`脚本开始运行`)
    $('#app').append('<div class="suspension"><div class="suspension2"><div class="suspension3"></div></div></div>');
    let btnStrs = '<div class="yanshi-box2">'
    + '<div class="pading-box">'
    if(window.location.href.search("http://aiotlight.demo.jiciot.com")>-1){
        btnStrs = btnStrs+ '<div class="transition1 transitionbox">'
            +'灯杆管理'
            + ' </div>'
        btnStrs = btnStrs +  ' <div class="transition2 transitionbox">'
            + '驾驶舱'
            + '</div>'
    }else if(window.location.href.search("http://aiot.jiciot.com/")>-1){
        btnStrs = btnStrs +  ' <div class="transition1 transitionbox">'
            + '智慧照明'
            + '</div>'
        btnStrs = btnStrs+ '<div class="transition2 transitionbox">'
            +'位置平台'
            + ' </div>'
    }else if(window.location.href.search("http://postweb.demo.jiciot.com/")>-1){
        btnStrs = btnStrs +  ' <div class="transition1 transitionbox">'
            + '金库管控'
            + '</div>'
        btnStrs = btnStrs+ '<div class="transition2 transitionbox">'
            +'智慧照明'
            + ' </div>'
    }
    btnStrs = btnStrs +  '<div id="fullScreen" class="transition3 transitionbox">'
        +'全屏'
        + '</div>'
    btnStrs = btnStrs+  '<div id="close" class="transition4 transitionbox" @click="clicktypes(3)">'
        + '关闭'
        + ' </div>'
    btnStrs = btnStrs + ' </div>'
    btnStrs = btnStrs+ ' </div>'
    $('#app').append(btnStrs);

    window.onload=function(){
        if($('.transition1').size()==0 && $('.transition2').size()==0 ){
            $('.transition3').css("top","0%")
            $('.transition4').css("top","0%")
        }
        //自动点击登录按钮
        if(window.location.href.search("#/login")>-1){
            $('.login-submit').click()
        }
        //自动点击登录按钮
        if(window.location.href.search("loginPage")>-1){
            $('input[value="登录"]').click()
        }
    };

    let isactive = false
    $(".yanshi-box2").hide()
    $(".suspension").click(function(){
        if(IsOrNoFullScreen()){
            $(".transition3").html("退出全屏")
        }else{
            $(".transition3").html("全屏")
        }
        if (isactive) {
            $(".transition1").addClass("fadeoutTopLeft")
            $(".transition2").addClass("fadeoutTopRight")
            $(".transition3").addClass("fadeoutBottomLeft")
            $(".transition4").addClass("fadeoutBottomRight")


            setTimeout(() => {
                $(".transition1").removeClass("fadeoutTopLeft")
                $(".transition2").removeClass("fadeoutTopRight")
                $(".transition3").removeClass("fadeoutBottomLeft")
                $(".transition4").removeClass("fadeoutBottomRight")

                $(".yanshi-box2").hide()
                isactive = false
            }, 400);
        } else {
            isactive = true
            $(".yanshi-box2").show()
            $(".transition1").addClass("fadeInTopLeft")
            $(".transition2").addClass("fadeInTopRight")
            $(".transition3").addClass("fadeInBottomLeft")
            $(".transition4").addClass("fadeInBottomRight")

            setTimeout(() => {
                $(".transition1").removeClass("fadeInTopLeft")
                $(".transition2").removeClass("fadeInTopRight")
                $(".transition3").removeClass("fadeInBottomLeft")
                $(".transition4").removeClass("fadeInBottomRight")
            }, 400);
        }
    })
    $(".transition1").click(function(){
        if(window.location.href.search("http://aiotlight.demo.jiciot.com")>-1){
            window.location.href ="http://aiotlight.demo.jiciot.com/#/lightHome/index"
        }
        if(window.location.href.search("http://aiot.jiciot.com/")>-1){
            window.location.href ="http://aiotlight.demo.jiciot.com/"
        }
        if(window.location.href.search("http://postweb.demo.jiciot.com/")>-1){
            window.location.href ="http://ls.demo.jiciot.com/#/indexHbase?fullscreen="
        }
    })

    $(".transition2").click(function(){
        if(window.location.href.search("http://aiotlight.demo.jiciot.com")>-1){
            window.location.href ="http://aiotlight.demo.jiciot.com/#/bigScreen/index"
        }
        if(window.location.href.search("http://aiot.jiciot.com/")>-1){
            window.location.href ="http://postweb.demo.jiciot.com/"
        }
        if(window.location.href.search("http://postweb.demo.jiciot.com/")>-1){
            window.location.href ="http://aiotlight.demo.jiciot.com/"
        }
    })


    $("#fullScreen").click(function(){
        if(IsOrNoFullScreen()){
            document.exitFullscreen ? document.exitFullscreen() :
            document.mozCancelFullScreen ? document.mozCancelFullScreen() :
            document.webkitExitFullscreen ? document.webkitExitFullscreen() : '';
        }else{
            const elem = document.documentElement;
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.mozRequestFullScreen) { /* Firefox */
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { /* IE/Edge */
                elem.msRequestFullscreen();
            }
        }
    })
    $("#close").click(function(){
        if (navigator.userAgent.indexOf("MSIE") > 0) {
            if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
                window.opener = null;
                window.close();
            } else {
                window.open('', '_top');
                window.top.close();
            }
        } else if (navigator.userAgent.indexOf("Firefox") > 0) {
            window.location.href = 'about:blank ';
        } else {
            //window.opener = null;
            window.open('', '_self', '');
            window.close();
        }
    })
    $('body').click(function(e) {
        var target = $(e.target);
        // 如果#overlay或者#btn下面还有子元素，可使用
        // !target.is('#btn *') && !target.is('#overlay *')
        if(!target.is('.suspension') && !target.is('.suspension2') && !target.is('.suspension3') && isactive){
            $(".transition1").addClass("fadeoutTopLeft")
            $(".transition2").addClass("fadeoutTopRight")
            $(".transition3").addClass("fadeoutBottomLeft")
            $(".transition4").addClass("fadeoutBottomRight")
            setTimeout(() => {
                $(".transition1").removeClass("fadeoutTopLeft")
                $(".transition2").removeClass("fadeoutTopRight")
                $(".transition3").removeClass("fadeoutBottomLeft")
                $(".transition4").removeClass("fadeoutBottomRight")
                $(".yanshi-box2").hide()
                isactive = false
            }, 400);
        }
    });

    function IsOrNoFullScreen() {
        var explorer = window.navigator.userAgent.toLowerCase();
        if (explorer.indexOf('chrome') > 0) {//webkit
            if (document.body.scrollHeight === window.screen.height && document.body.scrollWidth === window.screen.width) {
                return true
            } else {
                return false
            }
        } else {//IE 9+  fireFox
            if (window.outerHeight === window.screen.height && window.outerWidth === window.screen.width) {
                return true
            } else {
                return false
            }
        }
    }

    //     // 获取当前可视窗口的宽度和高度
    //     const _winWidth = window.innerWidth
    //     const _winHeight = window.innerHeight
    //     // 获取拖拽div自身的宽度和高度
    //     const _boxWidth = 70//document.querySelector(".suspension").offsetWidth
    //     const _boxHeight = 70//document.querySelector(".suspension").offsetHeight
    //     // 鼠标按下事件
    //     document.querySelector(".suspension").onmousedown = function (event) {
    //         // 获去光标在div元素坐标系中的位置(点击坐标)
    //         const _offsetX = event.offsetX
    //         const _offsetY = event.offsetY
    //         // 鼠标移动时，计算拖拽元素的定位位置
    //         document.onmousemove = function (event) {
    //             // 当前光标在可视窗口的定位
    //             const _clientX = event.clientX
    //             const _clientY = event.clientY
    //             // 计算拖拽元素的定位
    //             let _top = _clientY - _offsetY
    //             let _left = _clientX - _offsetX
    //             // 判断是否超过范围，如果超过就等于临界值
    //             if (_top < 0) {
    //                 _top = 0
    //             } else if (_top > _winHeight - _boxHeight) {
    //                 _top = _winHeight - _boxHeight
    //             }
    //             if (_left < 0) {
    //                 _left = 0
    //             } else if (_left > _winWidth - _boxWidth) {
    //                 _left = _winWidth - _boxWidth
    //             }
    //             console.log('_boxWidth：'+_boxWidth+'_boxHeight：'+_boxHeight+'_clientX：'+_clientX+' _offsetX：'+_offsetX+"  123："+(_clientX - _offsetX)+" 456:"+(_winWidth - _boxWidth))
    //             // 设置元素的CSS定位
    //             document.querySelector(".suspension").style.top = _top + "px"
    //             document.querySelector(".suspension").style.left = _left + "px"
    //         }
    //         // 鼠标弹起，取消鼠标移动事件
    //         document.onmouseup = function () {
    //             document.onmousemove = null
    //         }
    //     }
})();
//========================================= css
GM_addStyle(`
    .suspension {
      position: absolute;
      top: 80%;
      right: 100px;
      transform: translateY(-50%);
      width: 70px;
      height: 70px;
      border-radius: 35px;
      background-color: rgba(255, 255, 255, 0.1);
      box-shadow: 0 0 8px 0 rgba(0,0,0,.1);
      cursor: pointer;
      overflow: hidden;
      z-index: 99999;
}
.suspension2 {
   margin: 5px;
   padding-top: 5px;
   width: 60px;
   height: 60px;
   border-radius: 30px;
   background-color: rgba(255, 255, 255, 0.4);
}
.suspension3 {
   margin-left: 5px;
   width:50px;
   height: 50px;
   border-radius: 25px;
   background-color: rgba(255, 255, 255, 0.5);
}

.yanshi-box,.yanshi-box2 {
  position: fixed;
  right: 100px;
  top: 80%;
  transform: translateY(-50%);
  width: 70px;
  height: 70px;
}

.yanshi-box2 {
  box-sizing: border-box;
  box-sizing: content-box;
  cursor: pointer;
  z-index: 99998;
}

.yanshi-box2>.pading-box {
    width: 100%;
    height: 100%;
    position: relative;
}



.yanshi-box2>.pading-box>.transitionbox {
      width: 70px;
      height: 40px;
      border-radius: 5px;

      font-size: 16px;
      color: white;
      border:1px solid #a7ffff;
      background: #002D5188;
      box-sizing: content-box;
      position: absolute;
      display: flex;
      align-items: center;
      z-index: 997;
      padding: 5px;
      justify-content:center;
}
    .yanshi-box2>.pading-box>.transitionbox.transition1 {
        bottom: 50%;
      }
      .yanshi-box2>.pading-box>.transitionbox.transition2 {
        bottom: 50%;
      }

      .yanshi-box2>.pading-box>.transitionbox.transition3 {
        top: 50%;
      }

      .yanshi-box2>.pading-box>.transitionbox.transition4 {
        top: 50%;
      }

      .yanshi-box2>.pading-box>.transitionbox.transition1,
      .yanshi-box2>.pading-box>.transitionbox.transition3 {
        right: 80px;
        margin-top:10px;
      }

      .yanshi-box2>.pading-box>.transitionbox.transition2,
      .yanshi-box2>.pading-box>.transitionbox.transition4 {
        left: 80px;
        margin-top:10px;
      }

// 旋转动画
@-webkit-keyframes rotateY {
  0% {
    -webkit-transform: rotateY(0deg);
  }

  100% {
    -webkit-transform: rotateY(360deg);
  }
}

@keyframes rotateY {
  0% {
    transform: rotateY(0deg);
  }

  100% {
    transform: rotateY(360deg);
  }
}

/*设置内容由显示变为隐藏*/
@keyframes fadeioTL {

  0% {
    opacity: 1;
    transform: translate(0%, 0%);
  }

  100% {
    opacity: 0;
    transform: translate(80%, 50%);
    display: none;
  }
}

.fadeoutTopLeft {
  animation: fadeioTL 0.5s infinite;
  -webkit-animation: fadeioTL 0.5s infinite;
}

@keyframes fadeioBL {

  0% {
    opacity: 1;
    transform: translate(0%, 0%);
  }

  100% {
    opacity: 0;
    transform: translate(80%, -50%);
    display: none;
  }
}

.fadeoutBottomLeft {
  animation: fadeioBL 0.5s infinite;
  -webkit-animation: fadeioBL 0.5s infinite;
}

@keyframes fadeioTR {

  0% {
    opacity: 1;
    transform: translate(0%, 0%);
  }

  100% {
    opacity: 0;
    transform: translate(-80%, 50%);
    display: none;
  }
}

.fadeoutTopRight {
  animation: fadeioTR 0.5s infinite;
  -webkit-animation: fadeioTR 0.5s infinite;
}

@keyframes fadeioBR {

  0% {
    opacity: 1;
    transform: translate(0%, 0%);
  }

  100% {
    opacity: 0;
    transform: translate(-80%, -50%);
    display: none;
  }
}

.fadeoutBottomRight {
  animation: fadeioBR 0.5s infinite;
  -webkit-animation: fadeioBR 0.5s infinite;
}

@keyframes fadeInTL {

  0% {
    display: block;
    opacity: 0;
    transform: translate(80%, 50%);
  }

  100% {
    opacity: 1;
    transform: translate(0%, 0%);

  }
}

.fadeInTopLeft {
  animation: fadeInTL 0.5s infinite;
  -webkit-animation: fadeInTL 0.5s infinite;
}

@keyframes fadeInTR {

  0% {
    display: block;
    opacity: 0;
    transform: translate(-80%, 50%);
  }

  100% {
    opacity: 1;
    transform: translate(0%, 0%);

  }
}

.fadeInTopRight {
  animation: fadeInTR 0.5s infinite;
  -webkit-animation: fadeInTR 0.5s infinite;
}

@keyframes fadeInBL {

  0% {
    display: block;
    opacity: 0;
    transform: translate(80%, -50%);
  }

  100% {
    opacity: 1;
    transform: translate(0%, 0%);

  }
}

.fadeInBottomLeft {
  animation: fadeInBL 0.5s infinite;
  -webkit-animation: fadeInBL 0.5s infinite;
}

@keyframes fadeInBR {

  0% {
    display: block;
    opacity: 0;
    transform: translate(-80%, -50%);
  }

  100% {
    opacity: 1;
    transform: translate(0%, 0%);

  }
}

.fadeInBottomRight {
  animation: fadeInBR 0.5s infinite;
  -webkit-animation: fadeInBR 0.5s infinite;
}

`);