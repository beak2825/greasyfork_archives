// ==UserScript==
// @name        TuTool
// @namespace   Tutu
// @icon        https://ftp.bmp.ovh/imgs/2020/07/b32e9d8ea616c13d.png
// @match       http*://*/*
// @version     1.33
// @author      Tutu
// @description 可通过按键控制视频播放速度及音量,音量可放大数倍. 按键====>Q:正常音量, W:音量减少10%, E:音量增加10% ; Z:正常速度, X:速度减少10%, C:速度增加10% ; 对B站评论及Google进行了部分样式修改 ; 增加了自动识别填写验证码功能(可通过按钮或者快捷键ctrl+G 进行识别)
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_setClipboard
// @require     https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/407712/TuTool.user.js
// @updateURL https://update.greasyfork.org/scripts/407712/TuTool.meta.js
// ==/UserScript==
var $ = window.jQuery;
(function() {
  let volume = GM_getValue("volume", 1);
  let speed = GM_getValue("speed", 1);
  function speedUp(){
      var gtx = document.getElementsByTagName("bwp-video")[0];
      try{if (gtx.shadowRoot instanceof ShadowRoot) {gtx = gtx.shadowRoot};} catch {};
      const rate = document.getElementsByTagName("video")[0] || document.getElementById("videoPlayer") || document.querySelector('video') || document.getElementsByTagName("bwp-video")[0];
      let num = rate.playbackRate
      num += 0.1;
      if (rate){
        rate.playbackRate = num;
        window.sessionStorage.setItem("playbackRate", num);
      }else{
        window.sessionStorage.setItem("playbackRate", num);
      }
      Toast(`速度:${rate.playbackRate.toFixed(1)}X`);
      return rate.playbackRate
  }
  function speedDown(){
      var gtx = document.getElementsByTagName("bwp-video")[0];
      try{if (gtx.shadowRoot instanceof ShadowRoot) {gtx = gtx.shadowRoot};} catch {};
      const rate = document.getElementsByTagName("video")[0] || document.getElementById("videoPlayer") || document.querySelector('video') || document.getElementsByTagName("bwp-video")[0];
      let num = rate.playbackRate
      if (rate){
        if(rate.playbackRate > 0.1){
        num -= 0.1;
        rate.playbackRate = num;
        window.sessionStorage.setItem("playbackRate", num);
      }
      }else{
        num -= 0.1;
        window.sessionStorage.setItem("playbackRate", num);
      }

      Toast(`速度:${rate.playbackRate.toFixed(1)}X`);
      return rate.playbackRate
  }
  function volumeUp(volume){
    this.volume = volume;
    this.volume += 0.1;
    return this.volume

  }
  function volumeDown(volume){
    this.volume = volume;
    this.volume -= 0.1;
    if(this.volume <= 0){
      this.volume = 0;
    }
    return this.volume

  }
  function Toast(msg,duration){

      duration = isNaN(duration) ? 1000 : duration;
      const flat = document.querySelector(".showTheMsg");
      if(flat){
          flat.parentElement.removeChild(flat);
      }
      const m = document.createElement('div');
      m.className = "showTheMsg";
      m.innerHTML = `<div class="showTheMsg" style="width: 250px;height: auto; padding: auto; min-width: 150px; min-height: 6%; opacity: 0.5; color: rgb(255, 255, 255); line-height: 30px; text-align: center; border-radius: 55px; position: fixed; top: 40%; left: 40%; z-index: 2147483647; background: rgb(0, 0, 0); font-size: 22px;"><span style="position: absolute;left: 50%;top: 50%;-webkit-transform: translate(-50%, -50%);-moz-transform: translate(-50%, -50%);-ms-transform: translate(-50%, -50%);-o-transform: translate(-50%, -50%);transform: translate(-50%, -50%);">${msg}</span></div>`;
      var gtx = document.getElementsByTagName("bwp-video")[0];
      const video = document.getElementsByTagName("video")[0] || document.getElementById("videoPlayer") || document.querySelector('video') || document.querySelector('.codeButton') || gtx;
      video.parentElement.appendChild(m);
      setTimeout(function() {
          var d = 0.5;
          m.style.opacity = '0';
          setTimeout(function() {
            try {
              video.parentElement.removeChild(m);
            } catch {

            }
          }, d*1000);
      }, duration);
  }
  function setData(gainNode, videoSrc){
     var gtx = document.getElementsByTagName("bwp-video")[0];
     try{if (gtx.shadowRoot instanceof ShadowRoot) {gtx = gtx.shadowRoot};} catch {};
    const video = document.getElementsByTagName("video")[0] || document.getElementById("videoPlayer") || document.querySelector('video') || document.getElementsByTagName("bwp-video")[0];
    if(video){
      try {
        video.playbackRate = speed;
        window.sessionStorage.setItem("playbackRate", speed);
      } catch(err) {
        window.sessionStorage.setItem("playbackRate", speed);
        console.log(err);
      }
    }
    let nowVideoSrc = $("video").attr("src") || $("bwp-video").attr("src");
    let node = gainNode;
    if(nowVideoSrc != videoSrc){
      var gtx = document.getElementsByTagName("bwp-video")[0];
      try{if (gtx.shadowRoot instanceof ShadowRoot) {gtx = gtx.shadowRoot};} catch {};
      try{gtx = gtx.querySelector('video');} catch {gtx = document.getElementsByTagName("bwp-video")[0];};
      const myAudio = document.getElementsByTagName("video")[0] || document.getElementById("videoPlayer") || document.querySelector('video') || gtx;
      if (myAudio.src == ""){
        let sour = myAudio.querySelector("source");
        myAudio.src = sour.src + '?time=' + new Date().valueOf();
      }
      myAudio.crossOrigin = "anonymous";
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaElementSource(myAudio);
      //初始化音量控制节点
      gainNode = audioCtx.createGain();
      //初始化音量，为1
      //   gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
      //把节点连接起来。audioCtx.destination就是最终输出节点。
      source.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      node = gainNode;
    }
    node.gain.value = volume;
    return [node, nowVideoSrc]
  }
  function getImg(theImg){
    let img = $(theImg)[0];
    let type = 0;
    if(img.src.indexOf(";base64,") != -1){
      type = 2;
      img = img;
    } else if(img.src.indexOf(window.location.host) == -1){
      type = 1;
      img.crossOrigin = "anonymous";
      img.src = img.src + '?time=' + new Date().valueOf();
    } else {
      type = 0;
      img = img;
    }
    return [type, img]
  }
  function imgToBase(img){
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    let Base = canvas.toDataURL("image/png").replace(/.*,/, "");
    if(Base == 'iVBORw0KGgoAAAANSUhEUgAAAHgAAAAeCAYAAADnydqVAAAAfElEQVRoQ+3TAREAAAiDQNe/tD3+sAHgdh1tYDRdcFdg/AkKXGDcAI7XgguMG8DxWnCBcQM4XgsuMG4Ax2vBBcYN4HgtuMC4ARyvBRcYN4DjteAC4wZwvBZcYNwAjteCC4wbwPFacIFxAzheCy4wbgDHa8EFxg3geC0YD/yiPAAfEtw+9wAAAABJRU5ErkJggg==' || Base == "iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAEYklEQVR4Xu3UAQkAAAwCwdm/9HI83BLIOdw5AgQIRAQWySkmAQIEzmB5AgIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlACBB1YxAJfjJb2jAAAAAElFTkSuQmCC"){
      return "false";
    }
    return Base;
  }
  function ConversionBase(theImg) {
    let first = getImg(theImg);
    if (first[0] == 0){
      let last = imgToBase(first[1]);
      $('.codeButton').attr('imgData', last);
    } else if (first[0] == 1){
      setTimeout(function(){
        let last = imgToBase(first[1]);
        $('.codeButton').attr('imgData', last);
      }, 1500);
      $('.codeButton').attr('imgData', "false");
    } else {
      $('.codeButton').attr('imgData', first[1].src.split(";base64,")[1]);
    }
  }
  function getContentClientRect(target){
    console.log(target);
    var rect=target.getBoundingClientRect();
    var compStyle=unsafeWindow.getComputedStyle(target);
    var pFloat=parseFloat;
    var top=rect.top + pFloat(compStyle.paddingTop) + pFloat(compStyle.borderTopWidth);
    var right=rect.right - pFloat(compStyle.paddingRight) - pFloat(compStyle.borderRightWidth);
    var bottom=rect.bottom - pFloat(compStyle.paddingBottom) - pFloat(compStyle.borderBottomWidth);
    var left=rect.left + pFloat(compStyle.paddingLeft) + pFloat(compStyle.borderLeftWidth);
    return {
        top:top,
        right:right,
        bottom:bottom,
        left:left,
        width:right-left,
        height:bottom-top,
    };
  };
  function startGetCode(e){
    e.preventDefault() // 阻止默认行为
    ConversionBase('.codeImg');
    let interval = null;
    interval = setInterval(function(){
      let theImgByte = $('.codeButton').attr('imgData');
      if (theImgByte != "false"){
          let imgByte = theImgByte
          let protocol = document.location.protocol;
          $.ajax({
            url: `${protocol}//tutool.top/code?codeUrl=${imgByte}`,
            type: 'get',
            dateType: 'jsonp',
            cache: false,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            async: false,
            success: function(data) {
              console.log(data);
              GM_setClipboard(data);
              $('.codeText').attr('data-clipboard-text', data);
              $('.codeText').val(data);
              $('.codeButton').css("color","red");
              Toast(`${data}`, 1000);
              // console.log("sucess");
            },
            error: function(data) {
              console.log('ajax请求错误');
            }
          });
      clearInterval(interval);
      }
    }, 500);
  }
  setInterval(function(){
    if (window.location.host.indexOf("bilibili.com") != -1){
      $(".vip-red-name").removeClass("vip-red-name");
      if($(".level6").length == 0){
        $(".reply-box").find(".l6").parent().parent().each(function(){
          $(this).find(".name").addClass("level6");
        });
        $(".bili-avatar-icon--personal,.bili-avatar-icon--business").parent().parent().parent().parent().each(function () {
          $(this).find(".con").children(".user").find(".name").addClass("level6");
        });
        $(".name").each(function() {
          if ($(this).text() == $(".username").text()){
            $(this).addClass("upName");
            $(this).removeClass("level6");
            $(".username").addClass("upName");
          }
        })
        $(".level6").css("cssText", "color:orange !important");
        $(".upName").css("cssText", "color:red !important");
      }
    }
    if($("body").find('.codeButton').length == 0){
      $("img").each(function(){
        let inputText = $(this).parent().parent().parent().find("input[type='text']");
        if(inputText.length > 0){
          inputText = inputText[inputText.length-1];
          let htmltext = $(this).parent().parent().parent().html();
          let reg = /&amp;/g;
          htmltext = htmltext.replace(reg, '&');
          if ($("body").find('.codeButton').length == 0)
          {
            if(htmltext.indexOf($(this).attr("src")) + 200 > htmltext.indexOf("验证") && htmltext.indexOf("验证") != -1 && document.body.clientWidth * 0.5 > this.width && this.width > this.height * 1.25)
            {
              document.onkeydown = function(e) {
                var keyCode = e.keyCode || e.which || e.charCode;
                var ctrlKey = e.ctrlKey || e.metaKey;
                if(ctrlKey && keyCode == 71) {
                  startGetCode(e);
                }
              }
              $(inputText).addClass("codeText");
              $(this).addClass("codeImg");
              let postion = getContentClientRect(this);
              let top = postion.top;
              let right = postion.right;
              let bottom = postion.bottom;
              let left = postion.left;
              $(this).parent().append(`<div style='z-index: 99999;'><button class='codeButton' data-clipboard-text='' imgData='' style='width:60px;height:30px;font-size: 14px!important;z-index: 2147483647;position:relative;bottom: ${bottom};left: ${left};right: ${right};top: ${top};'>识别</button></div>`);
            }

          }
        }
      })
      $(".codeButton").click(function(e){startGetCode(e)});

    }
  }, 3000);
  if (window.location.host.indexOf("google.com") != -1){
      // const target = document.createElement("base");
      // target.target = "_blank";
      // document.querySelectorAll("head")[0].appendChild(target);
      const hyperLinks = document.querySelectorAll("a");
      for(let i = 0; i < hyperLinks.length; i++){
          hyperLinks[i].target = "_blank";
      }
      if ($(".B6fmyf") != null && $(".B6fmyf").length != 0){
        $(".B6fmyf").append('<div class="cadiv"></div>');
        let cadiv = $(".cadiv");
        $(".cadiv").each(function () {
        let caurl = $(this).parents().siblings("a").attr("href");
        $(this).append(`<a href="http://webcache.googleusercontent.com/search?q=cache%3A${caurl}">谷歌快照</a>`);
        });
        $(".cadiv").css({"display": "inline-block","padding-bottom": "1px","padding-top": "1px","padding-left": "10px","visibility": "visible"});
    }
  }
  //设置音频的源，找到<video>标签
  setTimeout(function(){
    var gtx = document.getElementsByTagName("bwp-video")[0];
    try{if (gtx.shadowRoot instanceof ShadowRoot) {gtx = gtx.shadowRoot};} catch {};
    try{gtx = gtx.querySelector('video');} catch {gtx = document.getElementsByTagName("bwp-video")[0];};
    const myAudio = document.getElementsByTagName("video")[0] || document.getElementById("videoPlayer") || document.querySelector('video') || gtx;
    if (myAudio != undefined){
      if (myAudio.src == "" && myAudio.querySelector("source")){
        let sour = myAudio.querySelector("source");
        myAudio.src = sour.src + '?time=' + new Date().valueOf();
      }
      if(myAudio.src.indexOf(window.location.host) == -1){
        myAudio.src = myAudio.src + '?time=' + new Date().valueOf();
      }
      myAudio.crossOrigin = "anonymous";
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaElementSource(myAudio);
      //初始化音量控制节点
      let gainNode = audioCtx.createGain();
      //初始化音量，为1
      //   gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
      //把节点连接起来。audioCtx.destination就是最终输出节点。
      source.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      // var volume = gainNode.gain.value;
      var gtx = document.getElementsByTagName("bwp-video")[0];
      try{if (gtx.shadowRoot instanceof ShadowRoot) {gtx = gtx.shadowRoot};} catch {};
      const video = document.getElementsByTagName("video")[0] || document.getElementById("videoPlayer") || document.querySelector('video') || document.getElementsByTagName("bwp-video")[0];
      document.onkeydown = function(){
          const e = window.event;
          const keyCode = e.keyCode;
          switch(keyCode){
              case 69:
                  if(!event.ctrlKey && !event.altKey && !event.metaKey){
                    volume = volumeUp(volume);
                    gainNode.gain.value = volume;
                    Toast(`音量:${(volume*100).toFixed(0)} %`);
                  }
                  break;
              case 87:
                  if(!event.ctrlKey && !event.altKey && !event.metaKey){
                    volume = volumeDown(volume);
                    gainNode.gain.value = volume;
                    Toast(`音量:${(volume*100).toFixed(0)} %`);
                  }
                  break;
              case 81:
                  if(!event.ctrlKey && !event.altKey && !event.metaKey){
                    gainNode.gain.value = 1;
                    volume = 1;
                    Toast(`音量:${(100).toFixed(0)} %`);
                  }
                  break;
              case 67:
                  if(!event.ctrlKey && !event.altKey && !event.metaKey){
                    speed = speedUp();
                  }
                  break;
              case 88:
                  if(!event.ctrlKey && !event.altKey){
                    speed = speedDown();
                  }
                  break;
              case 90:
                  if(!event.ctrlKey && !event.altKey && !event.metaKey){
                    if (video){
                        video.playbackRate = 1;
                        window.sessionStorage.setItem("playbackRate", 1);
                    }else{
                        window.sessionStorage.setItem("playbackRate", 1);
                    }
                    Toast(`速度:${video.playbackRate.toFixed(1)}X`);
                    speed = 1;
                  }
                  break;
          }
          GM_setValue("speed", speed);
          GM_setValue("volume", volume);
      }
      let videoSrc = $("video").attr("src") || $("bwp-video").attr("src");
      setData(gainNode, videoSrc);
      Toast(`音量:${(volume*100).toFixed(0)} % <br>速度:${video.playbackRate.toFixed(1)}X`, 3000);
      setInterval(function(){
        let info = setData(gainNode, videoSrc);
        gainNode = info[0];
        videoSrc = info[1];
      }, 3000);
    }
  }, 3000);

})();
