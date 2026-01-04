// ==UserScript==
// @name         123云盘/123网盘优化
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  优化123云盘/123网盘网页版使用体检，切换为app样式，可以看到文件的上传时间。顺便去除一些广告
// @author       You
// @match        *://*.123pan.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=123pan.com
// @grant        none
// @run-at       documnet-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460980/123%E4%BA%91%E7%9B%98123%E7%BD%91%E7%9B%98%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/460980/123%E4%BA%91%E7%9B%98123%E7%BD%91%E7%9B%98%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
(function () {
  "use strict";

  const style = document.createElement("style");
  if (window.innerWidth < 900) return;
  style.innerHTML = `

    #app {
        height:100%;
        backgrond-color:#b3b3b3;
    }

    .app {
        height: 100%
    }

    .appbody {
        max-width:900px;
        margin:0 auto;
        height:100%;
    }

    .appdiv {
        height: 100%
    }

    .webbody {
        display: none
    }

    .apptop {
        width: 90%;
        height: 110px;
        background: #f5f5f5;
        padding: 10px;
        box-sizing: border-box;
        margin: 0 auto
    }

    .appuser {
        width: 78%;
        height: 34px;
        float: left;
        margin-left: 10px
    }

    .appinput {
        width: 80%;
        height: 200px;
        padding: 20px;
        margin: 140px auto 0
    }

    .appinput button {
        width: 100%;
        height: 46px;
        line-height: 46px;
        background: #597dfc;
        text-align: center;
        color: #fff;
        font-size: 18px;
        display: block;
        margin-top: 30px;
        border-radius: 30px
    }

    .appimg img {
        width: 28px;
        height: 31px
    }

    .oldinput {
        width: 100%
    }

    .appinpout {
        height: 40px
    }

    .repbut {
        margin-top: -20px
    }

    .logobut {
        width: 100%;
        height: 36px;
        line-height: 36px
    }

    .apprem {
        margin-top: -40px
    }

    .appremche {
        margin: 0
    }

    .webbot {
        width: 100%;
        margin-top: -10px
    }

    .wbeinp {
        width: 160px;
        height: 40px
    }

    .webcpoymod {
        width: 78%
    }

    .webcpoymint {
        width: 190px
    }

    .codebut {
        float: right;
        height: 40px;
        line-height: 40px
    }

    .appboy {
        width: 100%;
        padding: 0 20px;
        display: flex;
        justify-content: space-between
    }

    .apphei {
        width: 100%;
        overflow-y: auto;
        top: 270px;
        position: absolute;
        z-index: 10;
        bottom: 80px;
        margin-top: 100px;
    }

    .appTable{
        background-color:#f1f1f1;
    }

    .appfltop {
        width: 100%;
        height: auto;
        padding: 10px 0;
        position: absolute
    }

    body,html {
        height: 100%
    }

    .appbuom {
        margin-top: -16px
    }
    .appFileName {
    width: 100%;
    height: 20px;
    color: #9b9c9f;
    font-size: 14px;
    padding-left: 20px;
    box-sizing: border-box
}

.appFileChoose {
    width: 68px;
    float: right;
    margin-right: 8px;
    text-align: center;
    color: #6372fd;
    box-sizing: border-box
}


`;

  document.head.appendChild(style);
  const appBody = document.querySelector(".appbody");
  appBody.style.display = "block";
  const prod = document.querySelector("#prod");
  if (prod) {
    prod.remove();
  }

  const appHeader = document.querySelector(".appHeader");
  if (appHeader) {
    //appHeader.remove();
  }
  //保存分享者id
  const apptop = document.querySelector(".apptop");
  apptop.innerHTML = document.querySelector(".leftInfo").outerHTML;
  apptop.style = `   display: flex;
    flex-direction: column;margin:20px`;
  apptop.querySelector("img").style.maxWidth = "30px";
  apptop.querySelector(".reportDiv").remove();
    window.onload = function() {
  // 在页面加载完成后执行的代码
  var bannerBottom = document.querySelector('#bannerBottom');
  if(bannerBottom){
      bannerBottom.remove();
  }
};

})();
