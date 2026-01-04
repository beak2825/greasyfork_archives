// ==UserScript==
// @name         bilibili-jumper
// @namespace    bilijumper
// @version      1.2.7
// @description  bilibili video-jumper, self-speed, hidden-mode
// @author       jumper
// @match        https://www.bilibili.com/video/*
// @icon         none
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @license      MIT
// @supportURL   https://greasyfork.org/zh-CN/scripts/445181-bilibili-jumper/feedback
// @downloadURL https://update.greasyfork.org/scripts/445181/bilibili-jumper.user.js
// @updateURL https://update.greasyfork.org/scripts/445181/bilibili-jumper.meta.js
// ==/UserScript==

(function () {
  "use strict";
  //https://greasyfork.org/zh-CN/scripts/445181-bilibili-jumper

  let current_URL = document.baseURI;
  let bg_time = 0,
    ed_time = 0,
    ed_time_ok = 0;
  let hidden = 1;
  const defalut_U_I =
    "1@BV1JV411t7ow_12_5_中科大计网；BV1pi4y1d7jD_13.5_5.5_NYCU自控；sid=373380_12.4_5.6_上交IPADS_OS；sid=78079_0_0.1_IPADS新人培训；BV1jt4y117KR_1.5_0.1_邓俊辉数据结构；BV1kE411X7S5_4.12_8_南大系统基础课1；BV1fv411p7Ng_10_3_NTHU网络1；BV1Vg41137EK_7_2_NTHU网络2；BV1GE411T7Qs_5.2_1_南大系统实验课；BV1pW41117rs_5.4_-9_洪永淼计量；BV1qt411B7NF_10.2_-9_新竹交大OS；";
  const USER_INFO = "BILI_JUMPER_USER_INFO";
  const SPEED1 = "SPEED1";
  const SPEED2 = "SPEED2";
  let re = /(.+?)_(.+?)_(.+?)(_.+?)?[;；]/g;
  let U_I = "";

  let videoObj = null;
  window.addEventListener("load", function () {
    let waitingVideo = this.setInterval(() => {
      if (!videoObj) {
        videoObj = unsafeWindow.player;
      } else {
        //alert(videoObj);
        clearInterval(waitingVideo);
        JumpBegin();
      }
    }, 50);

    setTimeout(() => {
      InitSpeedFunc();
      current_URL = document.baseURI;
      endPause();
    }, 3800);
  });

  function JumpBegin() {
    // alert("JumpB");

    U_I = GM_getValue(USER_INFO);
    if (!U_I) {
      GM_setValue(USER_INFO, defalut_U_I);
      U_I = defalut_U_I;
    }
    hidden = parseInt(U_I.substring(0, U_I.search("@")));
    U_I = U_I.substring(U_I.search("@") + 1);

    bg_time = 0;
    ed_time = 0;
    ed_time_ok = 0;
    let ite = U_I.matchAll(re);
    let ob = null;
    //分p类
    let vd = unsafeWindow.vd;
    if (vd && vd.pages.length > 3) {
      while (!(ob = ite.next()).done) {
        if (current_URL.search(ob.value[1]) != -1) {
          bg_time = parseFloat(ob.value[2]);
          ed_time = parseFloat(ob.value[3]);
        }
      }
      skipBegin();
    }
    //合辑类视频的BV号总不同，因此采用合辑sid匹配
    let collection_sid = null;
    let waitingSidTime = 0;
    let waitingSid = setInterval(() => {
      if (!collection_sid) {
        waitingSidTime += 50;
        collection_sid = document.querySelector(".first-line-title"); // collection_sid = document.getElementsByClassName("first-line-title")[0];
      } else {
        clearInterval(waitingSid);
        while (!(ob = ite.next()).done) {
          if (collection_sid.href.search(ob.value[1]) != -1) {
            bg_time = parseFloat(ob.value[2]);
            ed_time = parseFloat(ob.value[3]);
          }
        }
        skipBegin();
      }

      if (waitingSidTime > 50 * 60) {
        clearInterval(waitingSid);
      }
    }, 50);
  }

  function skipBegin() {
    if (ed_time || bg_time) {
      videoObj.seek(bg_time);
      let _interval_waitingDuration = setInterval(function () {
        if (videoObj.getDuration() != NaN) {
          ed_time = videoObj.getDuration() - ed_time;
          ed_time_ok = 1;
          clearInterval(_interval_waitingDuration);
        }
      }, 300);
    }
  }

  let first_tt = true;
  let tt_0 = "";
  function InitSpeedFunc() {
    // time remaining
    let tt = document.querySelector(".video-title");
    if (tt) {
      if (first_tt) {
        tt_0 = tt.innerText;
        first_tt = false;
      }

      let vd = unsafeWindow.vd;
      if (vd && vd.pages.length >= 3) {
        let startP = videoObj.getManifest().p - 1;
        let tot = 0;
        for (let i = startP; i < vd.pages.length; i++) {
          tot += vd.pages[i].duration;
        }

        tot = Math.floor(tot / 60);
        tt.innerText =
          tt_0 +
          " [*_*] 剩余" +
          Math.floor(tot / 60) +
          "小时" +
          (tot % 60) +
          "分钟";
      }
    }

    //hidden AD
    let s = document.createElement("style");
    s.innerHTML =
      "#right-bottom-banner,#live_recommand_report,#bannerAd,#slide_ad,.ad-report,.video-card-ad-small,.video-page-special-card-small{display:none !important;}";
    document.getElementsByTagName("HEAD").item(0).appendChild(s);
    //hidden recommendations(study mode)
    if (hidden && (ed_time || bg_time)) {
      let ss = document.createElement("style");
      ss.innerHTML =
        "#reco_list,#biliMainHeader {display:none !important;}" +
        "#multi_page{height:560px;} .cur-list, .list-box{max-height:500px !important;}";
      document.getElementsByTagName("HEAD").item(0).appendChild(ss);
    }

    //add input and button
    if (!document.querySelector("#my_speed_div1")) {
      //button
      let speedsettingsbtn1 = document.createElement("button");
      let speedsettingsbtn2 = document.createElement("button");
      speedsettingsbtn1.innerHTML = speedsettingsbtn2.innerHTML =
        "&nbsp Set Speed &nbsp";
      speedsettingsbtn1.style = speedsettingsbtn2.style =
        "background-color:gray;color:white;text-align:center;";
      speedsettingsbtn1.setAttribute("id", "my_speed_div1");
      speedsettingsbtn1.addEventListener("click", speedsettingsevent1);
      speedsettingsbtn2.setAttribute("id", "my_speed_div2");
      speedsettingsbtn2.addEventListener("click", speedsettingsevent2);

      //input
      let speedInput1 = document.createElement("input");
      let speedInput2 = document.createElement("input");
      speedInput1.id = "my_speed_input1";
      speedInput2.id = "my_speed_input2";
      speedInput1.type = speedInput2.type = "text";
      speedInput1.value = GM_getValue(SPEED1) || "1.7";
      speedInput2.value = GM_getValue(SPEED2) || "1.3";
      speedInput1.style = speedInput2.style = "margin-left:3em;width:2.5em";

      //append
      let viewReportDiv = null;
      let waitingView = setInterval(() => {
        if (!viewReportDiv) {
          viewReportDiv = document
            .querySelector("#viewbox_report")
            .querySelector(".video-data:last-child");
        } else {
          clearInterval(waitingView);
          viewReportDiv.appendChild(speedInput1);
          viewReportDiv.appendChild(speedsettingsbtn1);
          viewReportDiv.appendChild(speedInput2);
          viewReportDiv.appendChild(speedsettingsbtn2);
        }
      }, 100);
    }

    //user-info display and edit
    if (!document.querySelector("#info_input")) {
      //button
      let infoSettingstn = document.createElement("button");
      infoSettingstn.innerHTML = "&nbsp Set INFO &nbsp";
      infoSettingstn.style =
        "background-color:gray;color:white;text-align:center;";
      infoSettingstn.setAttribute("id", "set_info");
      infoSettingstn.addEventListener("click", WriteUserInfo);
      //input
      let infoInput = document.createElement("textarea");
      infoInput.id = "info_input";
      infoInput.value = GM_getValue(USER_INFO);

      infoInput.setAttribute("rows", "6");
      infoInput.style = "width: 85%;"; //infoInput.setAttribute("cols", "100");

      //append
      let viewReportDiv2 = null;
      let waitingView2 = setInterval(() => {
        if (!viewReportDiv2) {
          viewReportDiv2 = document.getElementById("v_tag");
        } else {
          clearInterval(waitingView2);
          viewReportDiv2.appendChild(infoInput);
          viewReportDiv2.appendChild(document.createElement("br"));
          viewReportDiv2.appendChild(infoSettingstn);
        }
      }, 100);
    }
  }

  function endPause() {
    if (ed_time || bg_time) {
      let _interval_detectEnd = setInterval(function () {
        if (current_URL != document.baseURI) {
          current_URL = document.baseURI;
          JumpBegin();
          InitSpeedFunc();
        }
        if (videoObj.getCurrentTime() > ed_time && ed_time_ok) {
          videoObj.pause();
          videoObj.seek(ed_time - 0.1);
        }
      }, 100);
    }
  }

  function speedsettingsevent1() {
    let speedInput = document.querySelector("#my_speed_input1");
    GM_setValue(SPEED1, speedInput.value);
    videoObj.setPlaybackRate(parseFloat(speedInput.value));
    // let changeSpeed = document.querySelector(".bilibili-player-video-btn-speed-menu-list");
    // changeSpeed.setAttribute("data-value", parseFloat(speedInput.value));
    // changeSpeed.click();
  }

  function speedsettingsevent2() {
    let speedInput = document.querySelector("#my_speed_input2");
    GM_setValue(SPEED2, speedInput.value);
    videoObj.setPlaybackRate(parseFloat(speedInput.value));
  }

  function WriteUserInfo() {
    let infoin = document.querySelector("#info_input");
    GM_setValue(USER_INFO, infoin.value);
  }
})();
