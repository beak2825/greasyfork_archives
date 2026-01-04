// ==UserScript==
// @name              腾讯视频、爱奇艺、优酷、芒果TV、乐视、PPTV、Bilibili解锁大会员、A站B站视频下载等几乎全网VIP会员视频解析脚本，持续完善更新
// @namespace         https://0xf.cc
// @version           1.0.2
// @description       VIP视频解析脚本，涵盖绝大多数视频网站，基于现有脚本修改，会持续更新接口等
// @antifeature       ads 微信公众号推广
// @author            0xfcc
// @icon               data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTkzOC42NjcgNTEyLjIxM2MwIDIzNS4wNTEtMTkxLjQ4OCA0MjYuNDU0LTQyNi42NjcgNDI2LjQ1NFM4NS4zMzMgNzQ3LjI2NCA4NS4zMzMgNTEyLjIxM2MwLTIzNS40NzcgMTkxLjQ4OC00MjYuODggNDI2LjY2Ny00MjYuODhzNDI2LjY2NyAxOTEuNDAzIDQyNi42NjcgNDI2Ljg4eiIgZmlsbD0iIzllYzRmNCIgb3BhY2l0eT0iLjkiLz48cGF0aCBkPSJNNjgyLjY2NyA1MTIuMjEzYzAgMTAuNzk1LTMuNDE0IDIxLjU5LTEwLjE5OCAzMC4yOTQtMS4yOCAxLjcwNi03LjIxIDguNzA0LTExLjg2MSAxMy4yMjZsLTIuNTYgMi41MThjLTM1LjYyNyAzNy43Ni0xMjQuMjg4IDk0LjU5Mi0xNjkuMjU5IDExMi44MSAwIC40MjctMjYuNzUyIDExLjIyMi0zOS40NjYgMTEuNjA2aC0xLjcwN2MtMTkuNDk5IDAtMzcuNzE3LTEwLjc1Mi00Ny4wNjEtMjguMTYtNS4xMi05LjYtOS43NzEtMzcuMzc2LTEwLjE5OC0zNy43Ni0zLjg0LTI0LjkxOC02LjM1Ny02My4wNjItNi4zNTctMTA0Ljk2IDAtNDMuOTQ3IDIuNTYtODMuNzU1IDcuMjEtMTA4LjI0NiAwLS40MjYgNC42OTQtMjIuODI2IDcuNjM4LTMwLjI5MyA0LjY5My0xMC43MSAxMy4xNDEtMTkuODgzIDIzLjc2NS0yNS42ODUgOC40OTEtNC4wOTYgMTcuNDA4LTYuMjMgMjYuNzEtNi4yMyA5Ljc3LjQyNyAyNy45ODkgNi42NTYgMzUuMiA5LjU1OCA0Ny41MyAxOC4yMTggMTM4LjMyNSA3Ny45NTIgMTczLjA5OCAxMTQuNDMyIDUuOTc0IDUuODAyIDEyLjMzMSAxMi45MjggMTQuMDM4IDE0LjUwNiA3LjE2OCA5LjEzMSAxMS4wMDggMjAuMzUyIDExLjAwOCAzMi4zODR6IiBmaWxsPSIjMGE4ZGZkIi8+PC9zdmc+
// @require           https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @match             *://xbeibeix.com/api/bilibili*
// @match             *://v.qq.com/x/cover/*
// @match             *://v.qq.com/x/page/*
// @match             *://www.iqiyi.com/v*
// @match             *://www.iqiyi.com/*
// @match             *://www.iqiyi.com/kszt/*
// @match             *://v.youku.com/v_show/*
// @match             *://w.mgtv.com/b/*
// @match             *://www.mgtv.com/b/*
// @match             *://tv.sohu.com/v/*
// @match             *://film.sohu.com/album/*
// @match             *://www.le.com/ptv/vplay/*
// @match             *://v.pptv.com/show/*
// @match             *://vip.pptv.com/show/*
// @match             *://www.acfun.cn/v/*
// @match             *://www.bilibili.com/video/*
// @match             *://www.bilibili.com/anime/*
// @match             *://www.bilibili.com/bangumi/play/*
// @match             *://vip.1905.com/play/*
// @match             *://www.wasu.cn/Play/show/*
// @license           GPL License
// @grant             unsafeWindow
// @grant             GM_openInTab
// @grant             GM.openInTab
// @grant             GM_xmlhttpRequest
// @grant             GM.xmlHttpRequest
// @grant             GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/420142/%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E3%80%81%E7%88%B1%E5%A5%87%E8%89%BA%E3%80%81%E4%BC%98%E9%85%B7%E3%80%81%E8%8A%92%E6%9E%9CTV%E3%80%81%E4%B9%90%E8%A7%86%E3%80%81PPTV%E3%80%81Bilibili%E8%A7%A3%E9%94%81%E5%A4%A7%E4%BC%9A%E5%91%98%E3%80%81A%E7%AB%99B%E7%AB%99%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E7%AD%89%E5%87%A0%E4%B9%8E%E5%85%A8%E7%BD%91VIP%E4%BC%9A%E5%91%98%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E8%84%9A%E6%9C%AC%EF%BC%8C%E6%8C%81%E7%BB%AD%E5%AE%8C%E5%96%84%E6%9B%B4%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/420142/%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E3%80%81%E7%88%B1%E5%A5%87%E8%89%BA%E3%80%81%E4%BC%98%E9%85%B7%E3%80%81%E8%8A%92%E6%9E%9CTV%E3%80%81%E4%B9%90%E8%A7%86%E3%80%81PPTV%E3%80%81Bilibili%E8%A7%A3%E9%94%81%E5%A4%A7%E4%BC%9A%E5%91%98%E3%80%81A%E7%AB%99B%E7%AB%99%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E7%AD%89%E5%87%A0%E4%B9%8E%E5%85%A8%E7%BD%91VIP%E4%BC%9A%E5%91%98%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E8%84%9A%E6%9C%AC%EF%BC%8C%E6%8C%81%E7%BB%AD%E5%AE%8C%E5%96%84%E6%9B%B4%E6%96%B0.meta.js
// ==/UserScript==

(function () {
  "use strict";
  let $ = window.$ || $;
  let host = location.host;
  let localurl = location.href;

  function innerParse(url) {
    $("#iframe-player").attr("src", url);
  }

  // function GMopenInTab(url, open_in_background) {
  //   if (typeof GM_openInTab === "function") {
  //     GM_openInTab(url, open_in_background);
  //   } else {
  //     GM.openInTab(url, open_in_background);
  //   }
  // }

  let GMaddStyle = (css) => {
    let myStyle = document.createElement("style");
    myStyle.textContent = css;
    let doc = document.head || document.documentElement;
    doc.appendChild(myStyle);
  };

  let node = "";
  let player_nodes = [
    { url: "v.qq.com", node: "#mod_player" },
    { url: "www.iqiyi.com", node: "#flashbox" },
    { url: "v.youku.com", node: "#player" },
    { url: "w.mgtv.com", node: "#mgtv-player-wrap" },
    { url: "www.mgtv.com", node: "#mgtv-player-wrap" },
    { url: "tv.sohu.com", node: "#player" },
    { url: "film.sohu.com", node: "#playerWrap" },
    { url: "www.le.com", node: "#le_playbox" },
    { url: "video.tudou.com", node: ".td-playbox" },
    { url: "v.pptv.com", node: "#pptv_playpage_box" },
    { url: "vip.pptv.com", node: ".w-video" },
    { url: "www.wasu.cn", node: "#flashContent" },
    { url: "www.acfun.cn", node: "#player" },
    { url: "www.bilibili.com", node: "#player_module" },
    { url: "vip.1905.com", node: "#player" },
  ];
  for (let i in player_nodes) {
    if (player_nodes[i].url == host) {
      node = player_nodes[i].node;
    }
  }

  let videoPlayer = $(
    "<div id='iframe-div' style='width:100%;height:100%;z-index:1000;'><iframe id='iframe-player' frameborder='0' allowfullscreen='true' width='100%' height='100%'></iframe></div>"
  );

  GMaddStyle(
    `body #sideBtn { position: fixed; left: 0; top: 30%; width: 50px; height: 50px; -webkit-transform: translateX(-30%); transform: translateX(-30%); -webkit-transition: 0.3s all ease-in-out; transition: 0.3s all ease-in-out; cursor: pointer; z-index: 9999; } body #sideBtn svg { height: 100%; width: 100%; } body #sideBtn:hover { -webkit-transform: translateX(0) scale(1.15); transform: translateX(0) scale(1.15); } body #videoToolBox ::-webkit-scrollbar { width: 3px; } body #videoToolBox ::-webkit-scrollbar-track { background-color: rgba(255, 255, 255, 0); } body #videoToolBox ::-webkit-scrollbar-thumb { background-color: rgba(117, 117, 117, 0.5); } body #videoToolBox .container { z-index: 9999; -webkit-box-sizing: border-box; box-sizing: border-box; position: fixed; left: 50%; top: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%); max-width: 720px; width: 90%; max-height: 85%; border-radius: 20px; background-color: rgba(250, 250, 250, 0.95); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px); overflow: hidden; -webkit-box-shadow: 0px 2px 9px 3px #8d8d8d66; box-shadow: 0px 2px 9px 3px #8d8d8d66; padding: 25px; display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-orient: vertical; -webkit-box-direction: normal; -ms-flex-direction: column; flex-direction: column; -webkit-transition: 0.5s all ease-in-out; transition: 0.5s all ease-in-out; } body #videoToolBox .container .close { position: absolute; top: 20px; right: 20px; width: 30px; height: 30px; cursor: pointer; z-index: 10000; } body #videoToolBox .container .close svg { width: 100%; height: 100%; } body #videoToolBox .container .tabs { position: relative; padding: 0px 50px 20px 50px; top: 0; left: 0; font-size: 15px; } body #videoToolBox .container .tabs ul { display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-pack: space-evenly; -ms-flex-pack: space-evenly; justify-content: space-evenly; -webkit-box-orient: horizontal; -webkit-box-direction: normal; -ms-flex-direction: row; flex-direction: row; position: relative; color: #464646; font-weight: 600; } body #videoToolBox .container .tabs ul li { list-style: none; background-color: #f3f3f3; padding: 10px 20px; border-radius: 9px; cursor: pointer; -webkit-transition: 0.25s all ease-in-out; transition: 0.25s all ease-in-out; } body #videoToolBox .container .tabs ul li:hover { background-color: #e2e2e2; } body #videoToolBox .container .tabs ul .active { color: white; background-color: #0a8dfd !important; -webkit-box-shadow: 2px 2px 7px 1px #0a8dfd99; box-shadow: 2px 2px 7px 1px #0a8dfd99; } body #videoToolBox .container .types { width: 100%; min-height: 300px; -webkit-box-flex: 1; -ms-flex-positive: 1; flex-grow: 1; overflow-y: scroll; } body #videoToolBox .container .types .part .partTitle { color: #000; font-weight: 600; font-size: 20px; padding-bottom: 10px; } body #videoToolBox .container .types .part ul { display: -webkit-box; display: -ms-flexbox; display: flex; -ms-flex-wrap: wrap; flex-wrap: wrap; font-size: 15px; padding-bottom: 5px; } body #videoToolBox .container .types .part ul li { list-style: none; padding: 5px 9px; background-color: #dbdbdb; margin: 0 6px 6px 0; border-radius: 6px; color: #000; -webkit-transition: 0.25s all ease-in-out; transition: 0.25s all ease-in-out; cursor: pointer; } body #videoToolBox .container .types .part ul li a { text-decoration: none; color: #000; } body #videoToolBox .container .types .part ul li:hover { color: #fff; background-color: #0a8dfd; } body #videoToolBox .container .types .part ul li:hover a { color: #fff; } body #videoToolBox .container .types .more .about { display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-orient: vertical; -webkit-box-direction: normal; -ms-flex-direction: column; flex-direction: column; -webkit-box-align: center; -ms-flex-align: center; align-items: center; } body #videoToolBox .container .types .more .about .title { font-size: 20px; margin-bottom: 15px; } body #videoToolBox .container .types .more .about .title strong { color: #ffb74a; } body #videoToolBox .container .types .more .about .content .qr { float: left; display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-orient: vertical; -webkit-box-direction: normal; -ms-flex-direction: column; flex-direction: column; margin-right: 10px; } body #videoToolBox .container .types .more .about .content .qr img { width: 200px; height: 200px; margin-bottom: 5px; } body #videoToolBox .container .types .more .about .content .qr p { text-align: center; font-size: 13px; color: #fff; font-weight: 600; background-color: #ffb74a; padding: 2px 0; border-radius: 5px; } body #videoToolBox .container .types .more .about .content .info p { font-size: 17px; line-height: 25px; padding-bottom: 5px; } body #videoToolBox .container .types .more .about .content .thanks { color: #757575; clear: both; font-size: 15px; text-align: center; margin-top: 20px; } body #videoToolBox .container .types .more .about .content .thanks a { text-decoration: none; color: #0a8dfd; }`
  );
  let html = $(
    `<div id="sideBtn"> <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="200" height="200" > <path d="M938.667 512.213c0 235.051-191.488 426.454-426.667 426.454S85.333 747.264 85.333 512.213c0-235.477 191.488-426.88 426.667-426.88s426.667 191.403 426.667 426.88z" fill="#9ec4f4" opacity=".9" /> <path d="M682.667 512.213c0 10.795-3.414 21.59-10.198 30.294-1.28 1.706-7.21 8.704-11.861 13.226l-2.56 2.518c-35.627 37.76-124.288 94.592-169.259 112.81 0 .427-26.752 11.222-39.466 11.606h-1.707c-19.499 0-37.717-10.752-47.061-28.16-5.12-9.6-9.771-37.376-10.198-37.76-3.84-24.918-6.357-63.062-6.357-104.96 0-43.947 2.56-83.755 7.21-108.246 0-.426 4.694-22.826 7.638-30.293 4.693-10.71 13.141-19.883 23.765-25.685 8.491-4.096 17.408-6.23 26.71-6.23 9.77.427 27.989 6.656 35.2 9.558 47.53 18.218 138.325 77.952 173.098 114.432 5.974 5.802 12.331 12.928 14.038 14.506 7.168 9.131 11.008 20.352 11.008 32.384z" fill="#0a8dfd" /> </svg> </div> <div id="videoToolBox" style="display: none"> <div class="container"> <div class="close"> <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="200" height="200" > <path d="M805.12 868.48c-8.32 0-16.64-3.2-22.4-9.6L572.16 648.32c-12.8-12.8-12.8-32.64 0-45.44s32.64-12.8 45.44 0l210.56 210.56c12.8 12.8 12.8 32.64 0 45.44-6.4 6.4-14.72 9.6-23.04 9.6zM513.28 576c-8.32 0-16.64-3.2-22.4-9.6L201.6 277.76c-12.8-12.8-12.8-32.64 0-45.44s32.64-12.8 45.44 0L536.32 521.6c12.8 12.8 12.8 32.64 0 45.44-6.4 5.76-14.72 8.96-23.04 8.96z" fill="#515151" /> <path d="M224 868.48c-8.32 0-16.64-3.2-22.4-9.6-12.8-12.8-12.8-32.64 0-45.44l581.76-581.76c12.8-12.8 32.64-12.8 45.44 0s12.8 32.64 0 45.44L247.04 858.88c-7.04 6.4-14.72 9.6-23.04 9.6z" fill="#515151" /> </svg> </div> <div class="tabs"> <ul> <li class="active">解析端口</li> <li>在线电视</li> <li>更多帮助</li> </ul> </div> <div class="types"> <div class="interface" style="display: block"> <div class="part embed"> <div class="partTitle">内嵌播放</div> <ul></ul> </div> <!-- <div class="part external"> <div class="partTitle">弹窗播放</div> <ul></ul> </div> --> </div> <div class="onlineTv" style="display: none"> <div class="part hd"> <div class="partTitle">高清直播</div> <ul></ul> </div> <div class="part sd"> <div class="partTitle">标清直播</div> <ul></ul> </div> </div> <div class="more" style="display: none"> <div class="about"> <div class="title"> 此脚本由<strong>轻梦</strong>公众号制作并维护 </div> <div class="content"> <div class="qr"> <img src="https://gitee.com/opoet/md-nice-pic/raw/master/2021-1-19/1611050462976-XONqlQGC5oYTyWu.png" alt="微信搜索“轻梦”" /> <p>求老爷们的关注呀 ( •̀ ω •́ )✧</p> </div> <div class="info"> <p> 这个脚本是我放假在家在利用空闲时间编写的，其中部分代码来自于原有脚本，我对其魔改以及重写UI，解析接口均来自于网络，感谢大家的使用。 </p> <p> 如果您对这个脚本感兴趣的话，不妨关注我，您的关注对我来说是莫大的鼓励~ </p> <p> 微信扫一扫关注我，获取使用指南和最新版本和功能，反馈问题，获取最新开发动向。我可不止这点能耐，每天都会分享免费实用工具哦~ </p> </div> <div class="thanks"> 鸣谢原作者 <a target="_blank" href="https://greasyfork.org/zh-CN/users/466206-die-wang" >die wang</a > </div> </div> </div> </div> </div> </div> </div>`
  );
  $("body").append(html);
  $("#sideBtn").click(() => {
    $("#videoToolBox").css("display") == "none"
      ? $("#videoToolBox").show()
      : $("#videoToolBox").hide();
  });
  $("#videoToolBox .container .close").click(() => {
    $("#videoToolBox").hide();
  });
  $(".tabs ul li").click(function () {
    $(".tabs ul li")
      .eq($(this).index())
      .addClass("active")
      .siblings()
      .removeClass("active");
    $(".types > div").eq($(this).index()).show().siblings().hide();
  });

  let channel = [
    {
      type: 0,
      name: "CCTV-1",
      url: "http://ivi.bupt.edu.cn/player.html?channel=cctv1hd",
    },
    {
      type: 0,
      name: "CCTV-2",
      url: "http://ivi.bupt.edu.cn/player.html?channel=cctv2hd",
    },
    {
      type: 0,
      name: "CCTV-3",
      url: "http://ivi.bupt.edu.cn/player.html?channel=cctv3hd",
    },
    {
      type: 0,
      name: "CCTV-4",
      url: "http://ivi.bupt.edu.cn/player.html?channel=cctv4hd",
    },
    {
      type: 0,
      name: "CCTV-5",
      url: "http://ivi.bupt.edu.cn/player.html?channel=cctv5hd",
    },
    {
      type: 0,
      name: "CCTV-6",
      url: "http://ivi.bupt.edu.cn/player.html?channel=cctv6hd",
    },
    {
      type: 0,
      name: "CCTV-7",
      url: "http://ivi.bupt.edu.cn/player.html?channel=cctv7hd",
    },
    {
      type: 0,
      name: "CCTV-8",
      url: "http://ivi.bupt.edu.cn/player.html?channel=cctv8hd",
    },
    {
      type: 0,
      name: "CCTV-9",
      url: "http://ivi.bupt.edu.cn/player.html?channel=cctv9hd",
    },
    {
      type: 0,
      name: "CCTV-10",
      url: "http://ivi.bupt.edu.cn/player.html?channel=cctv10hd",
    },
    {
      type: 0,
      name: "CCTV-12",
      url: "http://ivi.bupt.edu.cn/player.html?channel=cctv12hd",
    },
    {
      type: 0,
      name: "CCTV-14",
      url: "http://ivi.bupt.edu.cn/player.html?channel=cctv14hd",
    },
    {
      type: 0,
      name: "CCTV-17",
      url: "http://ivi.bupt.edu.cn/player.html?channel=cctv17hd",
    },
    {
      type: 0,
      name: "北京卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=btv1hd",
    },
    {
      type: 0,
      name: "北京文艺",
      url: "http://ivi.bupt.edu.cn/player.html?channel=btv2hd",
    },
    {
      type: 0,
      name: "北京影视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=btv4hd",
    },
    {
      type: 0,
      name: "北京新闻",
      url: "http://ivi.bupt.edu.cn/player.html?channel=btv9hd",
    },
    {
      type: 0,
      name: "北京冬奥",
      url: "http://ivi.bupt.edu.cn/player.html?channel=btv11hd",
    },
    {
      type: 0,
      name: "湖南卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=hunanhd",
    },
    {
      type: 0,
      name: "浙江卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=zjhd",
    },
    {
      type: 0,
      name: "江苏卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=jshd",
    },
    {
      type: 0,
      name: "东方卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=dfhd",
    },
    {
      type: 0,
      name: "安徽卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=ahhd",
    },
    {
      type: 0,
      name: "黑龙江卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=hljhd",
    },
    {
      type: 0,
      name: "辽宁卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=lnhd",
    },
    {
      type: 0,
      name: "深圳卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=szhd",
    },
    {
      type: 0,
      name: "广东卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=gdhd",
    },
    {
      type: 0,
      name: "天津卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=tjhd",
    },
    {
      type: 0,
      name: "湖北卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=hbhd",
    },
    {
      type: 0,
      name: "山东卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=sdhd",
    },
    {
      type: 0,
      name: "重庆卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=cqhd",
    },
    {
      type: 0,
      name: "福建东南",
      url: "http://ivi.bupt.edu.cn/player.html?channel=dnhd",
    },
    {
      type: 0,
      name: "四川卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=schd",
    },
    {
      type: 0,
      name: "河北卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=hbhd",
    },
    {
      type: 0,
      name: "江西卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=jxhd",
    },
    {
      type: 0,
      name: "河南卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=hnhd",
    },
    {
      type: 0,
      name: "广西卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=gxhd",
    },
    {
      type: 0,
      name: "吉林卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=jlhd",
    },
    {
      type: 0,
      name: "海南卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=lyhd",
    },
    {
      type: 0,
      name: "贵州卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=gzhd",
    },
    {
      type: 1,
      name: "CCTV-1综合",
      url: "http://ivi.bupt.edu.cn/player.html?channel=cctv1",
    },
    {
      type: 1,
      name: "CCTV-2财经",
      url: "http://ivi.bupt.edu.cn/player.html?channel=cctv2",
    },
    {
      type: 1,
      name: "CCTV-3综艺",
      url: "http://ivi.bupt.edu.cn/player.html?channel=cctv3",
    },
    {
      type: 1,
      name: "CCTV-4国际",
      url: "http://ivi.bupt.edu.cn/player.html?channel=cctv4",
    },
    {
      type: 1,
      name: "CCTV-6电影",
      url: "http://ivi.bupt.edu.cn/player.html?channel=cctv6",
    },
    {
      type: 1,
      name: "CCTV-7军事",
      url: "http://ivi.bupt.edu.cn/player.html?channel=cctv7",
    },
    {
      type: 1,
      name: "CCTV-8电视剧",
      url: "http://ivi.bupt.edu.cn/player.html?channel=cctv8",
    },
    {
      type: 1,
      name: "CCTV-9纪录",
      url: "http://ivi.bupt.edu.cn/player.html?channel=cctv9",
    },
    {
      type: 1,
      name: "CCTV-10科教",
      url: "http://ivi.bupt.edu.cn/player.html?channel=cctv10",
    },
    {
      type: 1,
      name: "CCTV-11戏曲",
      url: "http://ivi.bupt.edu.cn/player.html?channel=cctv11",
    },
    {
      type: 1,
      name: "CCTV-12社会",
      url: "http://ivi.bupt.edu.cn/player.html?channel=cctv12",
    },
    {
      type: 1,
      name: "CCTV-13新闻",
      url: "http://ivi.bupt.edu.cn/player.html?channel=cctv13",
    },
    {
      type: 1,
      name: "CCTV-14少儿",
      url: "http://ivi.bupt.edu.cn/player.html?channel=cctv14",
    },
    {
      type: 1,
      name: "CCTV-15音乐",
      url: "http://ivi.bupt.edu.cn/player.html?channel=cctv15",
    },
    {
      type: 1,
      name: "CGTN",
      url: "http://ivi.bupt.edu.cn/player.html?channel=cctv16",
    },
    {
      type: 1,
      name: "CCTV-17农业",
      url: "http://ivi.bupt.edu.cn/player.html?channel=cctv17",
    },
    {
      type: 1,
      name: "北京卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=btv1",
    },
    {
      type: 1,
      name: "北京文艺",
      url: "http://ivi.bupt.edu.cn/player.html?channel=btv2",
    },
    {
      type: 1,
      name: "北京科教",
      url: "http://ivi.bupt.edu.cn/player.html?channel=btv3",
    },
    {
      type: 1,
      name: "北京影视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=btv4",
    },
    {
      type: 1,
      name: "北京财经",
      url: "http://ivi.bupt.edu.cn/player.html?channel=btv5",
    },
    {
      type: 1,
      name: "北京生活",
      url: "http://ivi.bupt.edu.cn/player.html?channel=btv7",
    },
    {
      type: 1,
      name: "北京青年",
      url: "http://ivi.bupt.edu.cn/player.html?channel=btv8",
    },
    {
      type: 1,
      name: "北京新闻",
      url: "http://ivi.bupt.edu.cn/player.html?channel=btv9",
    },
    {
      type: 1,
      name: "北京卡酷少儿",
      url: "http://ivi.bupt.edu.cn/player.html?channel=btv10",
    },
    {
      type: 1,
      name: "北京冬奥纪实",
      url: "http://ivi.bupt.edu.cn/player.html?channel=btv11",
    },
    {
      type: 1,
      name: "浙江卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=zjtv",
    },
    {
      type: 1,
      name: "湖南卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=hunantv",
    },
    {
      type: 1,
      name: "江苏卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=jstv",
    },
    {
      type: 1,
      name: "东方卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=dftv",
    },
    {
      type: 1,
      name: "深圳卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=sztv",
    },
    {
      type: 1,
      name: "安徽卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=ahtv",
    },
    {
      type: 1,
      name: "河南卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=hntv",
    },
    {
      type: 1,
      name: "陕西卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=sxtv",
    },
    {
      type: 1,
      name: "吉林卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=jltv",
    },
    {
      type: 1,
      name: "广东卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=gdtv",
    },
    {
      type: 1,
      name: "山东卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=sdtv",
    },
    {
      type: 1,
      name: "湖北卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=hbtv",
    },
    {
      type: 1,
      name: "河北卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=hebtv",
    },
    {
      type: 1,
      name: "西藏卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=xztv",
    },
    {
      type: 1,
      name: "内蒙古卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=nmtv",
    },
    {
      type: 1,
      name: "青海卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=qhtv",
    },
    {
      type: 1,
      name: "四川卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=sctv",
    },
    {
      type: 1,
      name: "天津卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=tjtv",
    },
    {
      type: 1,
      name: "山西卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=sxrtv",
    },
    {
      type: 1,
      name: "辽宁卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=lntv",
    },
    {
      type: 1,
      name: "厦门卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=xmtv",
    },
    {
      type: 1,
      name: "新疆卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=xjtv",
    },
    {
      type: 1,
      name: "黑龙江卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=hljtv",
    },
    {
      type: 1,
      name: "云南卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=yntv",
    },
    {
      type: 1,
      name: "江西卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=jxtv",
    },
    {
      type: 1,
      name: "福建东南卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=dntv",
    },
    {
      type: 1,
      name: "贵州卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=gztv",
    },
    {
      type: 1,
      name: "宁夏卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=nxtv",
    },
    {
      type: 1,
      name: "甘肃卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=gstv",
    },
    {
      type: 1,
      name: "重庆卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=cqtv",
    },
    {
      type: 1,
      name: "兵团卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=bttv",
    },
    {
      type: 1,
      name: "延边卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=ybtv",
    },
    {
      type: 1,
      name: "三沙卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=sstv",
    },
    {
      type: 1,
      name: "海南卫视",
      url: "http://ivi.bupt.edu.cn/player.html?channel=lytv",
    },
    {
      type: 1,
      name: "山东教育",
      url: "http://ivi.bupt.edu.cn/player.html?channel=sdetv",
    },
    {
      type: 1,
      name: "CETV-1",
      url: "http://ivi.bupt.edu.cn/player.html?channel=cetv1",
    },
    {
      type: 1,
      name: "CETV-3",
      url: "http://ivi.bupt.edu.cn/player.html?channel=cetv3",
    },
    {
      type: 1,
      name: "CETV-4",
      url: "http://ivi.bupt.edu.cn/player.html?channel=cetv4",
    },
  ];

  for (let item of channel) {
    item.type
      ? $(".onlineTv .part.sd ul").append(
          `<li><a target="_blank" href = ${item.url}>${item.name}</a></li>`
        )
      : $(".onlineTv .part.hd ul").append(
          `<li><a target="_blank" href = ${item.url}>${item.name}</a></li>`
        );
  }
  for (let item of $(".onlineTv .part ul li")) {
    item.addEventListener("click", () => {
      $("#videoToolBox").hide();
    });
  }

  let interfaceList = [
    { name: "纯净线路", url: "https://z1.m1907.cn/?jx=" },
    { name: "B站", url: "https://vip.parwix.com:4433/player/?url=" },
    { name: "B站2", url: "https://jx.yingxiangbao.cn/vip.php?url=" },
    { name: "B站3", url: "https://vip.52jiexi.top/?url=" },
    { name: "B站4", url: "https://jx.yparse.com/index.php?url=" },
    { name: "B站5", url: "https://jx.116kan.com/?url=" },
    { name: "B站7", url: "https://www.cuan.la/m3u8.php?url=" },
    { name: "bl解析", url: "https://vip.bljiex.com/?v=" },
    { name: "冰豆", url: "https://api.bingdou.net/?url=" },
    { name: "八八", url: "https://vip.88jiexi.com/?url=" },
    { name: "爸比云", url: "http://jx.1ff1.cn/?url=" },
    { name: "百域", url: "https://jx.618g.com/?url=" },
    { name: "clouse6", url: "http://jx.clousx6.cn/player/?url=" },
    { name: "ckmov", url: "https://www.ckmov.vip/api.php?url=" },
    { name: "大幕", url: "https://jx.52damu.com/dmjx/jiexi.php?url=" },
    { name: "二度1", url: "https://jx.du2.cc/?url=" },
    { name: "二度2", url: "http://jx.drgxj.com/?url=" },
    { name: "福星", url: "https://jx.popo520.cn/jiexi/?url=" },
    { name: "跟剧", url: "https://www.5igen.com/dmplayer/player/?url=" },
    { name: "ha12", url: "https://py.ha12.xyz/sos/index.php?url=" },
    { name: "Hk", url: "https://jx.rdhk.net/?v=" },
    { name: "H8", url: "https://www.h8jx.com/jiexi.php?url=" },
    { name: "豪华啦", url: "https://api.lhh.la/vip/?url=" },
    { name: "黑米", url: "https://www.myxin.top/jx/api/?url=" },
    { name: "黑云", url: "https://jiexi.380k.com/?url=" },
    { name: "蝴蝶", url: "https://api.hdworking.top/?url=" },
    { name: "IDC", url: "https://jx.idc126.net/jx/?url=" },
    { name: "IK解析", url: "https://vip.ikjiexi.top/?url=" },
    { name: "久播(明日)", url: "https://jx.jiubojx.com/vip.php?url=" },
    { name: "九八看", url: "https://jx.youyitv.com/?url=" },
    { name: "凉城", url: "https://jx.mw0.cc/?url=" },
    { name: "蓝影", url: "http://huiwanka.xyz/jx/?url=" },
    { name: "流氓凡", url: "https://jx.wslmf.com/?url=" },
    { name: "m3u8", url: "https://jx.m3u8.tv/jiexi/?url=" },
    { name: "m3u8tv", url: "https://jiexi.janan.net/jiexi/?url=" },
    { name: "Mao", url: "https://titan.mgtv.com.kunlanys.com/m3u8.php?url=" },
    { name: "磨菇", url: "https://jx.wzslw.cn/?url=" },
    { name: "诺诺", url: "https://www.ckmov.com/?url=" },
    { name: "诺讯", url: "https://www.nxflv.com/?url=" },
    { name: "OK", url: "https://okjx.cc/?url=" },
    { name: "千忆", url: "https://v.qianyicp.com/v.php?url=" },
    { name: "千叶", url: "https://yi29f.cn/vip.php?url=" },
    { name: "思云", url: "https://jx.ap2p.cn/?url=" },
    { name: "思古1", url: "https://api.sigujx.com/?url=" },
    { name: "思古2", url: "https://jx.quanmingjiexi.com/?url=" },
    { name: "思古3", url: "https://api.bbbbbb.me/jx/?url=" },
    { name: "思古4", url: "https://jsap.attakids.com/?url=" },
    { name: "tv920", url: "https://api.tv920.com/vip/?url=" },
    { name: "通用", url: "https://jx.598110.com/index.php?url=" },
    { name: "维多", url: "https://jx.ivito.cn/?url=" },
    { name: "无名", url: "https://www.administratorw.com/video.php?url=" },
    { name: "xx", url: "https://chkkk.top/jiexi/ys?url=" },
    { name: "小蒋极致", url: "https://www.kpezp.cn/jlexi.php?url=" },
    { name: "小狼", url: "https://jx.yaohuaxuan.com/?url=" },
    { name: "新线路", url: "https://vip.kurumit3.top/?v=" },
    { name: "星驰", url: "https://vip.cjys.top/?url=" },
    { name: "星空", url: "https://jx.fo97.cn/?url=" },
    { name: "云端", url: "https://jx.ergan.top/?url=" },
    { name: "17云", url: "https://www.1717yun.com/jx/ty.php?url=" },
    { name: "33t", url: "https://www.33tn.cn/?url=" },
    { name: "41", url: "https://jx.f41.cc/?url=" },
    { name: "180", url: "https://jx.000180.top/jx/?url=" },
    { name: "200", url: "https://vip.66parse.club/?url=" },
    { name: "973", url: "https://jx.973973.xyz/?url=" },
    { name: "8090", url: "https://www.8090g.cn/?url=" },
    { name: "41478", url: "https://www.41478.net/?url=" },
  ];

  for (let item of interfaceList) {
    $(".interface .part.embed ul").append(`<li>${item.name}</li>`);
  }

  $(".interface .part.embed ul li").each((index, item) => {
    item.addEventListener("click", () => {
      if (document.getElementById("iframe-player") == null) {
        let player = $(node);
        player.empty();
        player.append(videoPlayer);
      }
      innerParse(interfaceList[index].url + location.href);
      $("#videoToolBox").hide();
    });
  });
  // $(".interface .part.external ul li").each((index, item) => {
  //   item.addEventListener("click", () => {
  //     GMopenInTab(parseInterface[index].url + location.href, false);
  //     $("#videoToolBox").hide();
  //   });
  // });
  // -----------------------
  let acfun = () => {
    let ele,
      content = "",
      videolist = [];
    videolist = JSON.parse(videoInfo.currentVideoInfo.ksPlayJson)
      .adaptationSet[0].representation;
    if (videolist.length > 0 && $("div#dlList").length == 0) {
      for (let item of videolist) {
        content += `<li style=" list-style: none; display: -webkit-box; display: -ms-flexbox; display: flex; margin-bottom: 15px; font-size: 15px; -webkit-box-align: center; -ms-flex-align: center; align-items: center; " > <div style="width: 75px">${item.qualityLabel}</div> <input style=" -webkit-box-flex: 1; -ms-flex-positive: 1; flex-grow: 1; border: none; background-color: #f0f0f0; border-radius: 5px; outline: none; padding: 5px 10px; color: #1875f0; " type="text" class="acdlLink" value="${item.url}" /> </li>`;
      }
      ele = `<div id="dlList" style=" background-color: #fff; border-radius: 15px; -webkit-box-shadow: 0px 1px 15px 5px #f0f0f0; box-shadow: 0px 1px 15px 5px #f0f0f0; padding: 20px; margin-bottom: 25px; " > <div style=" display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-align: center; -ms-flex-align: center; align-items: center; font-size: 20px; font-weight: 600; margin-bottom: 20px; " > <svg style="height: 25px; width: 25px; margin-right: 5px" class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="200" height="200" > <path d="M896 576c-17.7 0-32 14.3-32 32v137.8c0 22.9-9 44.5-25.3 60.8s-38 25.4-60.9 25.4H246.2c-22.9 0-44.5-9-60.8-25.3-16.4-16.4-25.4-38-25.4-60.9V608c0-17.7-14.3-32-32-32s-32 14.3-32 32v137.8C96 828.6 163.4 896 246.2 896h531.7c82.8 0 150.2-67.4 150.2-150.2V608c-.1-17.7-14.4-32-32.1-32z" fill="#1875F0" /> <path d="M489.4 662.6c12.5 12.5 32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L544 562.7V160c0-17.6-14.4-32-32-32s-32 14.4-32 32v402.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0-6.2 6.2-9.4 14.4-9.4 22.6s3.1 16.4 9.4 22.6l112.1 112.1z" fill="#1875F0" /></svg >视频下载 </div> <ul style="width: 100%">${content} </ul> </div>`;
    }
    $("h1.title").after(ele);
    $("#dlList ul li").click(function () {
      let value = $("#dlList .acdlLink")[$(this).index()];
      value.select();
      document.execCommand("copy");
    });
  };
  let bilibili = () => {
    let ele;
    ele = `<span id="dlbtn" style="cursor: pointer; height: 25px; width: 25px; position: absolute; top: 50%; transform: translateY(-75%); margin-left: 20px;"><svg style="height:25px;width:25px" class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-spm-anchor-id="a313x.7781069.0.i10" width="200" height="200"><path d="M160 32c-12 0-24.8 4.8-33.6 14.4S112 68 112 80v864c0 12 4.8 24.8 14.4 33.6C136 987.2 148 992 160 992h704c12 0 24.8-4.8 33.6-14.4C907.2 968 912 956 912 944V304L640 32H160z" fill="#00a1d6" data-spm-anchor-id="a313x.7781069.0.i8"/><path d="M912 304H688c-12 0-24.8-4.8-33.6-14.4-9.6-8.8-14.4-21.6-14.4-33.6V32l272 272z" fill="#69d3f6" data-spm-anchor-id="a313x.7781069.0.i9"/><path d="M500.8 684.8c3.2 2.4 6.4 4.8 11.2 4.8 4 0 8-1.6 11.2-4.8l142.4-136c2.4-2.4 3.2-5.6 1.6-8.8-1.6-3.2-4-4.8-7.2-4.8h-84v-136c0-4-1.6-8-4.8-11.2-3.2-3.2-7.2-4.8-11.2-4.8h-96c-4 0-8 1.6-11.2 4.8-3.2 3.2-4.8 7.2-4.8 11.2v136h-84c-3.2 0-6.4 1.6-7.2 4.8-1.6 3.2 0 6.4 1.6 8.8l142.4 136zM712 751.2H312c-8.8 0-16 7.2-16 16s7.2 16 16 16h400c8.8 0 16-7.2 16-16s-7.2-16-16-16z" fill="#fff" data-spm-anchor-id="a313x.7781069.0.i2"/></svg></span>`;
    setTimeout(() => {
      $("#arc_toolbar_report .ops").append(ele);
      $("#dlbtn").click(function () {
        let patt1 = new RegExp("(BV|av)[a-zA-Z0-9]*");
        let bvid = patt1.exec(window.location.href);
        let tempwindow = window.open("_blank");
        tempwindow.location =
          "https://xbeibeix.com/api/bilibili/?monkey=" + bvid[0];
      });
    }, 5000);
  };

  let reg_bili = /www.bilibili.com\/video.*/;
  let reg_acfun = /www.acfun.cn\/v\/.*/;
  window.onload = function () {
    if (reg_bili.test(localurl)) {
      bilibili();
    } else if (reg_acfun.test(localurl)) {
      acfun();
    }
  };

  switch (host) {
    case "www.iqiyi.com":
      //--------------------------------------------------------------------------------
      unsafeWindow.rate = 0;
      unsafeWindow.Date.now = () => {
        return new unsafeWindow.Date().getTime() + (unsafeWindow.rate += 1000);
      };
      setInterval(() => {
        unsafeWindow.rate = 0;
      }, 600000);
      //--------------------------------------------------------------------------------
      setInterval(() => {
        if (document.getElementsByClassName("cupid-public-time")[0] != null) {
          $(".skippable-after").css("display", "block");
          document.getElementsByClassName("skippable-after")[0].click();
        }
        $(".qy-player-vippay-popup").css("display", "none");
        $(".black-screen").css("display", "none");
      }, 500);
      break;
    case "v.qq.com":
      //--------------------------------------------------------------------------------
      setInterval(() => {
        //视频广告加速
        $(".txp_ad").find("txpdiv").find("video")[0].currentTime = 1000;
        $(".txp_ad").find("txpdiv").find("video")[1].currentTime = 1000;
      }, 1000);
      //--------------------------------------------------------------------------------
      setInterval(() => {
        let txp_btn_volume = $(".txp_btn_volume");
        if (txp_btn_volume.attr("data-status") === "mute") {
          $(".txp_popup_volume").css("display", "block");
          txp_btn_volume.click();
          $(".txp_popup_volume").css("display", "none");
        }
        //$("txpdiv[data-role='hd-ad-adapter-adlayer']").attr("class", "txp_none");
        $(".mod_vip_popup").css("display", "none");
        $(".tvip_layer").css("display", "none");
        $("#mask_layer").css("display", "none");
      }, 500);
      break;
    case "v.youku.com":
      //--------------------------------------------------------------------------------
      window.onload = function () {
        if (!document.querySelectorAll("video")[0]) {
          setInterval(() => {
            document.querySelectorAll("video")[1].playbackRate = 16;
          }, 100);
        }
      };
      //--------------------------------------------------------------------------------
      setInterval(() => {
        let H5 = $(".h5-ext-layer").find("div");
        if (H5.length != 0) {
          $(".h5-ext-layer div").remove();
          let control_btn_play = $(".control-left-grid .control-play-icon");
          if (control_btn_play.attr("data-tip") === "播放") {
            $(".h5player-dashboard").css("display", "block");
            control_btn_play.click();
            $(".h5player-dashboard").css("display", "none");
          }
        }
        $(".information-tips").css("display", "none");
      }, 500);
      break;
    case "www.mgtv.com":
      break;
    case "tv.sohu.com":
      setInterval(() => {
        $(".x-video-adv").css("display", "none");
        $(".x-player-mask").css("display", "none");
        $("#player_vipTips").css("display", "none");
      }, 500);
      break;
    case "www.bilibili.com":
      setInterval(() => {
        $(".player-limit-mask").remove();
      }, 500);
      break;
    case "xbeibeix.com":
      setInterval(() => {
        $("#boxs").remove(".adsbygoogle");
        $("#text-box").remove();
        $("#aswift_1_expand").remove();
        $(".adsbygoogle").remove();
        $("#accordionExample").remove();
        $("#text1").remove();
        $("#button").remove();
        $(".basic-addon1").remove();
        $("#text2").remove();
        $("#exampleModal").remove();
        $(".alert").remove();
        $(".button-1").remove();
        $(".row").attr("id", "ccc");
        $(".clearfix").attr("id", "aaa");
        $("#aaa").find("#button-1").attr("id", "bbb");
        $("#bbb").css("background-color", "#D0104C");
        let con = "请点击解析视频";
        $("#bbb").text(con);
        $("#ccc").remove();
        $("#basic").attr("id", "eee");
        $("#addon1").attr("id", "ggg");
        //$("#basic-addon1").remove();
      }, 500);
      break;
  }
})();
