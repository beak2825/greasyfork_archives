// ==UserScript==
// @name            翱翔门户主页半透明
// @name:en         翱翔门户主页半透明
// @namespace       https://github.com/dadaewqq/fun
// @version         2.2
// @description     目前已实现大部分元素的半透明效果
// @description:en  目前已实现大部分元素的半透明效果
// @author          dadaewqq
// @match           https://ecampus.nwpu.edu.cn/main.html*
// @icon            https://portal-minio.nwpu.edu.cn/cms/60_60-1612168704151-1620739414523.png
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/456026/%E7%BF%B1%E7%BF%94%E9%97%A8%E6%88%B7%E4%B8%BB%E9%A1%B5%E5%8D%8A%E9%80%8F%E6%98%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/456026/%E7%BF%B1%E7%BF%94%E9%97%A8%E6%88%B7%E4%B8%BB%E9%A1%B5%E5%8D%8A%E9%80%8F%E6%98%8E.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function changecommon() {
    document.querySelector(".footer").style.display = "none";
    document.querySelector(".nav-background").style.background = "rgba(0,0,0,0)";
    document.querySelector(".nav-background-stack").style.background = "rgba(0,0,0,0.2)";
  }

  function changemain() {
    document.querySelector(".services.wrapper_radius").style.background = "rgba(255,2555,255,0.5)";
    document.querySelector(".newsIndex.wrapper_radius").style.background = "rgba(255,2555,255,0)";
    document.querySelector(".newsIndex-content").style.background = "rgba(255,2555,255,0.5)";
    document.querySelector(".personal-top").style.background = "rgba(255,255,255,0.5)";
    document.querySelector(".personal-bottom").style.background = "rgba(255,255,255,0.5)";
    document.querySelector(".schedule").style.background = "rgba(255,255,255,0.35)";
    document.querySelector(".portal-content-bottom-left-asset.wrapper_radius").style.display = "none";
  }

  function changeson() {
    document.querySelector(".news-new-detail-left").style.background = "rgba(255,255,255,0.5)";
    document.querySelector(".PopularNews").style.background = "rgba(255,255,255,0.5)";
    document.querySelector(".news-new-detail-left-title").style.color = "black";
    document.querySelector(".news-new-detail-left-subTitle-left").style.color = "black";
    document.querySelector(".news-new-detail-left-content").style.color = "black";
    var pre_title = document.querySelectorAll(".PopularNews-content-list-title");
    for (var i = 0; i < pre_title.length; i++) {
      pre_title[i].style.color = "black";
    }
  }

  function changefont() {
    var pre_tab = document.querySelectorAll(".tab-title");
    for (var i1 = 0; i1 < pre_tab.length; i1++) {
      pre_tab[i1].style.color = "black";
    }

    var pre_news = document.querySelectorAll(".newsNav-li-name");
    for (var i2 = 0; i2 < pre_news.length; i2++) {
      pre_news[i2].style.color = "black";
    }

    var pre_servicenane = document.querySelectorAll(".serviceName");
    for (var i3 = 0; i3 < pre_servicenane.length; i3++) {
      pre_servicenane[i3].style.color = "black";
    }

    var pre_title = document.querySelectorAll(".title");
    for (var i4 = 0; i4 < pre_title.length; i4++) {
      pre_title[i4].style.color = "black";
    }
  }

  function changebg() {
    var whitebg = document.querySelectorAll(".news-new-detail-left-content *");
    for (var i = 0; i < whitebg.length; i++) {
      whitebg[i].style.background = "transparent";
    }
  }

  function setbutton() {
    document.querySelector(".nav-menu-item").onclick = function () {
      var id3 = setInterval(ch1, 250);
      setTimeout(() => {
        clearInterval(id3);
      }, 3000);
    };
  }

  function addblack() {
    var pre_tab = document.querySelectorAll(".services-head-container-tabs-li");
    for (var i1 = 0; i1 < pre_tab.length; i1++) {
      pre_tab[i1].onclick = function () {
        var id4 = setInterval(changefont, 100);
        setTimeout(() => {
          clearInterval(id4);
        }, 500);
      };
    }
  }
  function ch1() {
    if (document.querySelector(".newsIndex-content") != undefined) {
      console.log("ch1");
      setbutton();
      changecommon();
      changemain();
      changefont();
      addblack();
    }
  }

  function ch2() {
    if (document.querySelector(".news-new-detail-left-subTitle-left") != undefined) {
      console.log("ch2");
      setbutton();
      changecommon();
      changeson();
      changebg();
    }
  }

  var id1 = setInterval(ch1, 300);
  var id2 = setInterval(ch2, 300);

  setTimeout(() => {
    clearInterval(id1);
    clearInterval(id2);
  }, 3000);
})();
