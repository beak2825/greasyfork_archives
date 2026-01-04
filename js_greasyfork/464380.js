// ==UserScript==
// @name         自动更新测试
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  记录集数
// @author       You
// @license MIT
// @match        https://www.hao123.com/?tn=02003390_49_hao_pg
// @match                                                                *://www.dadagui.me/*
// @match                                                                *://www.bdys03.com/*
// @match                                                                *://www.mozhatu.com/*
// @match                                                                *://sun.20001027.com/*

// @match                                                                *://vip.tv1920.xyz/*
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/464380/%E8%87%AA%E5%8A%A8%E6%9B%B4%E6%96%B0%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/464380/%E8%87%AA%E5%8A%A8%E6%9B%B4%E6%96%B0%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==

(function () {
  "use strict";
let clickTimes = 1
  document.documentElement.onkeyup = function (e) {
    // 回车提交表单

    var theEvent = window.event || e;
    var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
    if(code == 38 && clickTimes==2){
      sessionStorage.clear()
    }
    if(code == 38 && clickTimes==1){
      clickTimes++
    }
  
  
  }

  window.onload = () => {

    if(window.location.origin=="https://www.dadagui.me"||window.location.origin=="https://www.mozhatu.com"){
      let videoArray = [];

      if (JSON.parse(localStorage.getItem("videoArray"))) {
        videoArray = JSON.parse(localStorage.getItem("videoArray"));
      }

      const isExist = videoArray
        .map((item) => {
          return item.id;
        })
        .includes(window.location.pathname.split("/")[2].split("-")[0]);

      const index = videoArray
        .map((item) => {
          return item.id;
        })
        .indexOf(window.location.pathname.split("/")[2].split("-")[0]);

      if (isExist == true) {
        if (
          !videoArray[index].video.includes(
            window.location.pathname.split("/")[2].split("-")[2]
          )
        ) {
          videoArray[index].video.push(
            window.location.pathname.split("/")[2].split("-")[2]
          );
        }
        let data = sessionStorage.getItem("key");
        sessionStorage.setItem("key", "isSun");

        if (
          !(
            window.location.href.split("-")[2] == videoArray[index].video.slice(-1)
          ) &&
          data == null
        ) {
          window.location.href = `${window.location.href.split("-")[0]}-${
            window.location.href.split("-")[1]
          }-${videoArray[index].video.slice(-1)}`;
        }
      } else {
        videoArray.push({
          id: window.location.pathname.split("/")[2].split("-")[0],
          video: [window.location.pathname.split("/")[2].split("-")[2]],
        });
      }

      localStorage.setItem("videoArray", JSON.stringify(videoArray));
      console.log(videoArray);

    }
    else{
      let videoArray = [];

      if (JSON.parse(localStorage.getItem("videoArray"))) {
        videoArray = JSON.parse(localStorage.getItem("videoArray"));
      }

      const isExist = videoArray
        .map((item) => {
          return item.id;
        })
        .includes(window.location.pathname.split("/")[2].split("-")[0]);

      const index = videoArray
        .map((item) => {
          return item.id;
        })
        .indexOf(window.location.pathname.split("/")[2].split("-")[0]);

      if (isExist == true) {
        if (
          !videoArray[index].video.includes(
            window.location.pathname.split("/")[2].split("-")[1]
          )
        ) {
          videoArray[index].video.push(
            window.location.pathname.split("/")[2].split("-")[1]
          );
        }
        let data = sessionStorage.getItem("key");
        sessionStorage.setItem("key", "isSun");

        if (
          !(
            window.location.href.split("-")[1] == videoArray[index].video.slice(-1)
          ) &&
          data == null
        ) {
          window.location.href = `${window.location.href.split("-")[0]}-${videoArray[index].video.slice(-1)}`;
        }
      } else {
        videoArray.push({
          id: window.location.pathname.split("/")[2].split("-")[0],
          video: [window.location.pathname.split("/")[2].split("-")[1]],
        });
      }

      localStorage.setItem("videoArray", JSON.stringify(videoArray));
      console.log(videoArray);
    }


  };
})();