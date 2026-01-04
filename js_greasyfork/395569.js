// ==UserScript==
// @name         哔哩哔哩自动登录
// @namespace    https://greasyfork.org/users/91873
// @version      1.0.0.77
// @description  Bilibili auto Login
// @include      https://*.bilibili.com/*
// @include      https://bilibili.com/*
// @author       wujixian
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/395569/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/395569/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(async () => {
  delete window.RTCPeerConnection
  delete window.mozRTCPeerConnection
  delete window.webkitRTCPeerConnection
  delete window.RTCDataChannel
  delete window.DataChannel
  //获取当前所有cookie
  var strCookies = document.cookie;
  if(getCookie("CURRENT_QUALITY")==="")
  {
    document.cookie="CURRENT_QUALITY=127;domain=.bilibili.com;path=/;";
    document.cookie="CURRENT_FNVAL=4080;domain=.bilibili.com;path=/;";
    window.localStorage.setItem("bilibili_player_settings","{\"setting_config\":{},\"video_status\":{\"autopart\":\"\",\"highquality\":true,\"widescreensave\":true,\"iswidescreen\":true,\"blackside_state\":true,\"autoplay\":true,\"autoplay_reddot_status\":false,\"panoramamode\":true,\"panoramamode_reddot_status\":true,\"videospeed\":1,\"skip_pip_red_dot\":true},\"block\":{},\"message\":{},\"subtitle\":{},\"player_icon\":{},\"guide\":{}}");
    window.localStorage.setItem("bilibili_player_codec_prefer_type","1");
    window.localStorage.setItem("recommend_auto_play","close");
    location.reload();
  }
  document.cookie="CURRENT_QUALITY=127;domain=.bilibili.com;path=/;";
  if (strCookies.indexOf("SESSDATA")<0) {
    document.cookie="DedeUserID=39596846;domain=.bilibili.com;path=/;";
    document.cookie="DedeUserID__ckMd5=962df2f008671eee;domain=.bilibili.com;path=/;";
    document.cookie="LIVE_BUVID=AUTO5617577019674163;domain=.bilibili.com;path=/;";
    document.cookie="SESSDATA=73ac193d%2C1773253913%2Cc7534%2A91CjC8yaeQyRllV1SLxfcDFCxG3A_2MZ3of9czqpm5D7ZvPEQ-0Zb8iNnSPHiVHYTGSmUSVjNIaXVzR2g1bk9pN3QtaUVIMEhRay1jNnR0MlB5UFF0S09USmRha3M4VGFlTHc3c3YyWFVyOTFEZ1FBeGNlWEtSQnVYUDBfOFFEVHdjQTNEelRabF93IIEC;domain=.bilibili.com;path=/;";
    document.cookie="_uuid=2852CD1C-DBA8-B10F7-4510F-BCD2A810B1E4695545infoc;domain=.bilibili.com;path=/;";
    document.cookie="b_lsid=FADA6B54_1993F30EED2;domain=.bilibili.com;path=/;";
    document.cookie="b_nut=1757701794;domain=.bilibili.com;path=/;";
    document.cookie="bili_jct=07cadf86eab612a09ed52ecf0467bf0d;domain=.bilibili.com;path=/;";
    document.cookie="bili_ticket=eyJhbGciOiJIUzI1NiIsImtpZCI6InMwMyIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTc5NjEzNTIsImlhdCI6MTc1NzcwMjA5MiwicGx0IjotMX0.wfo4i003f8HknFxticqGbY85ztUT_c9jhsw7k795YoM;domain=.bilibili.com;path=/;";
    document.cookie="bmg_src_def_domain=i2.hdslb.com;domain=www.bilibili.com;path=/;";
    document.cookie="buvid3=FFC4F4F5-D6BA-34DA-B1C5-61F2BCBC707394881infoc;domain=.bilibili.com;path=/;";
    document.cookie="home_feed_column=5;domain=.bilibili.com;path=/;";
    document.cookie="sid=5yapkugx;domain=.bilibili.com;path=/;";
    document.cookie="theme-tip-show=SHOWED;domain=.bilibili.com;path=/;";

    document.cookie="CURRENT_BLACKGAP=0;domain=.bilibili.com;path=/;";
    document.cookie="CURRENT_FNVAL=4048;domain=.bilibili.com;path=/;";
    document.cookie="CURRENT_PID=92eb2b70-e5cf-11ed-b6ec-0de642ec6315;domain=.bilibili.com;path=/;";
    document.cookie="CURRENT_QUALITY=127;domain=.bilibili.com;path=/;";
    document.cookie="FEED_LIVE_VERSION=V_WATCHLATER_PIP_WINDOW3;domain=.bilibili.com;path=/;";
    document.cookie="GIFT_BLOCK_COOKIE=GIFT_BLOCK_COOKIE;domain=live.bilibili.com;path=/;";
    document.cookie="INTVER=1;domain=.bilibili.com;path=/;";
    document.cookie="PVID=8;domain=.bilibili.com;path=/;";
    document.cookie="_dfcaptcha=e0bb9a43ffe204752a68037ed7275a06;domain=.bilibili.com;path=/;";
    document.cookie="b_ut=5;domain=.bilibili.com;path=/;";
    document.cookie="blackside_state=1;domain=.bilibili.com;path=/;";
    document.cookie="bmg_af_switch=1;domain=www.bilibili.com;path=/;";
    document.cookie="bp_t_offset_39596846=1044558019439886336;domain=.bilibili.com;path=/;";
    document.cookie="bp_video_offset_39596846=923571818681335827;domain=.bilibili.com;path=/;";
    document.cookie="browser_resolution=1922-946;domain=.bilibili.com;path=/;";
    document.cookie="buvid4=2034A3C4-01AE-CD94-713D-27D8890E24B396002-025031512-Ao6i7l37g6jonY%2BEM7ulqQ%3D%3D;domain=.bilibili.com;path=/;";
    document.cookie="buvid_fp=c59a4b40190631f112f05dd56b89e2d3;domain=.bilibili.com;path=/;";
    document.cookie="buvid_fp_plain=undefined;domain=.bilibili.com;path=/;";
    document.cookie="deviceFingerprint=6725488e757dcbde247d45d97b2a01d5;domain=.bilibili.com;path=/;";
    document.cookie="enable_feed_channel=DISABLE;domain=.bilibili.com;path=/;";
    document.cookie="enable_web_push=DISABLE;domain=.bilibili.com;path=/;";
    document.cookie="fingerprint3=95e410403a3861b42ed02eebbf91f5ad;domain=.bilibili.com;path=/;";
    document.cookie="fingerprint=8283c2147e8d90a36a8be783f8747d01;domain=.bilibili.com;path=/;";
    document.cookie="fingerprint_s=61ea79874f509535821d19c96fbe5304;domain=.bilibili.com;path=/;";
    document.cookie="header_theme_version=CLOSE;domain=.bilibili.com;path=/;";
    document.cookie="hit-dyn-v2=1;domain=.bilibili.com;path=/;";
    document.cookie="home_feed_column=5;domain=.bilibili.com;path=/;";
    document.cookie="i-wanna-go-back=-1;domain=.bilibili.com;path=/;";
    document.cookie="innersign=1;domain=.bilibili.com;path=/;";
    document.cookie="msource=pc_web;domain=.bilibili.com;path=/;";
    document.cookie="rpdid=|(J|)J|u~~l|0J'u~kJ)uJ~ku;domain=.bilibili.com;path=/;";
    document.cookie="theme_style=light;domain=.bilibili.com;path=/;";
    location.reload();
  }
  if((location.href).indexOf("live")<0){
    if((location.href).indexOf("video")>0){
    window.localStorage.clear();
    window.localStorage.setItem("bilibili_player_settings","{\"setting_config\":{},\"video_status\":{\"autopart\":\"\",\"highquality\":true,\"widescreensave\":true,\"iswidescreen\":true,\"blackside_state\":true,\"autoplay\":true,\"autoplay_reddot_status\":false,\"panoramamode\":true,\"panoramamode_reddot_status\":true,\"videospeed\":1,\"skip_pip_red_dot\":true},\"block\":{},\"message\":{},\"subtitle\":{},\"player_icon\":{},\"guide\":{}}");
    window.localStorage.setItem("bilibili_player_codec_prefer_type","1");
    window.localStorage.setItem("recommend_auto_play","close");
    let widescreen = false
    setInterval(function() {
        if (!widescreen) {
            let wideScreenBtn = document.querySelector("#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-right > div.bpx-player-ctrl-btn.bpx-player-ctrl-wide")
            if (!wideScreenBtn.className.includes("entered")) {
                wideScreenBtn.click()
                if (wideScreenBtn.className.includes("entered")) {
                    widescreen = true
                } else {
                    wideScreenBtn.click()
                }
            }
        }
    }, 200);
  }
    }
  //window.localStorage.setItem("web-player-ui-config:39596846","{\"volume\":{\"value\":90,\"disabled\":false},\"danmaku\":{\"display\":false,\"opacity\":100,\"fontScale\":100,\"density\":100,\"area\":4,\"showMaskOption\":false,\"enableMask\":true}}");
  window.localStorage.setItem("bpx_player_profile","{\"media\":{\"quality\":99,\"volume\":1,\"nonzeroVol\":1,\"hideBlackGap\":true,\"dolbyAudio\":true,\"audioQuality\":2,\"autoplay\":true,\"handoff\":2,\"seniorTip\":true}}");

  function getCookie(cname)
  {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++)
    {
      var c = ca[i].trim();
      if (c.indexOf(name)==0)
      {
        return c.substring(name.length,c.length);
      }
    }
    return "";
  }
})();