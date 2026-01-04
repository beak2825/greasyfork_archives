// ==UserScript==
// @name         超碰视频去广告，解决VIP限制
// @namespace    undefined
// @version      0.0.7
// @description  超碰小视频去广告，解决VIP限制
// @author       Svend
// @match        http://www.ri003.com/*
// @match        http://www.ri005.com/*
// @require      https://code.jquery.com/jquery-latest.js
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/34893/%E8%B6%85%E7%A2%B0%E8%A7%86%E9%A2%91%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%8C%E8%A7%A3%E5%86%B3VIP%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/34893/%E8%B6%85%E7%A2%B0%E8%A7%86%E9%A2%91%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%8C%E8%A7%A3%E5%86%B3VIP%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==
$(document).ready(function() {
  caoporn();
});

function caoporn() {
  var host = window.location.host.replace("www", "");
  if (!host.startsWith(".")) {
    host = "." + host;
  }
  setCookie("video_log", 0, host, "/");

  setTimeout(function() {
    //ad
    $('div[align="center"]').remove();
    $("div.footer-margin").remove();
    $("noindex").remove();
    $("qq").remove();

    if (flashvars) {
      var videoUrl = flashvars.video_url;
      if (videoUrl[videoUrl.length - 1] === "/")
        videoUrl = videoUrl.substr(0, videoUrl.length - 1);

      console.log("play video url :", videoUrl);
      createVideoEle("#kt_player", videoUrl);
    }
  }, 300);
}

function setCookie(name, value, domain, path) {
  var Days = 30;
  var exp = new Date();
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
  var cookie =
    name +
    "=" +
    escape(value) +
    ";expires=" +
    exp.toGMTString() +
    ";domain=" +
    domain +
    ";path=" +
    path;
  document.cookie = cookie;

  console.log("set cookie:", cookie);
}

function createVideoEle(ele, url) {
  var videoDiv =
    '<div id="user_video_div"><video id="user_video" controls="controls" autoplay></video></div>';
  $(ele).html(videoDiv);
  $("#user_video").attr("src", url);
  $("#user_video_div").css({
    width: "100%",
    height: "100%",
    top: "0",
    left: "0",
    background: "#000"
  });
  $("#user_video").css({
    width: "100%",
    height: "100%",
    background: '#000'
  });
  $(document).keydown(function(e) {
    if (e.keyCode === 39) {
      $("#user_video")[0].currentTime += 5;
    } else if (e.keyCode === 37) {
      $("#user_video")[0].currentTime -= 5;
    }
  });

  $('#user_video').on('play', function (e) {  
    $('#user_video').css('opacity', 1);
  }); 

  $('#user_video').on('pause', function (e) {  
    $('#user_video').css('opacity', 0);
  }); 

  $("#user_video").on('click', function(e){
    return this.paused ?  this.play() : this.pause();
  });
}