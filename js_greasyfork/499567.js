// ==UserScript==
// @name         Fake Z-Lib Site Warning
// @name:zh-CN   小心有假的Z-Lib
// @namespace    http://tampermonkey.net/
// @version      0.2.7
// @description:zh-CN   提醒用户注意假冒的 Z-Lib 网站
// @description Warn users about scam Z-Lib sites to protect their accounts
// @author       Yearly
// @match        *://zlibrary.to/*
// @match        *://z-lib.io/*
// @match        *://z-lib.id/*
// @include      *://z-lib.*/*
// @include      *://*.z-lib.*/*
// @include      *://*.z-library.*/*
// @include      *://z-library.*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=z-lib.gs
// @license      AGPL-v3.0
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/499567/Fake%20Z-Lib%20Site%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/499567/Fake%20Z-Lib%20Site%20Warning.meta.js
// ==/UserScript==

(function() {

  function checkResourceExists(url) {
    return fetch(url, { method: 'HEAD' })
      .then(response => {
      return response.ok ? 1 : 0;
    })
      .catch(() => {
      return 0;
    });
  }

  // 使用示例
  checkResourceExists('/components/zlibrary-startup-script.js').then(result => {
    if(result) {
      console.log("startup succ");
    } else {
      console.log("fake site");
      GM_addStyle(`
      html, body{
         background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMjUwIDE1MCI+PHN0eWxlPi53d3R0MXtmb250LXdlaWdodDo5MDB9PC9zdHlsZT48dGV4dCB5PSIxMDAiIGNsYXNzPSJ3d3R0MSIgZm9udC1zaXplPSIyNCIgZmlsbD0iI0YwMDYiIHRyYW5zZm9ybT0icm90YXRlKC0yNSkiPldBUk5JTkchPC90ZXh0Pjx0ZXh0IHk9IjE1MCIgY2xhc3M9Ind3dHQxIiBmb250LXNpemU9IjI0IiBmaWxsPSIjRjAwNiIgdHJhbnNmb3JtPSJyb3RhdGUoLTI1KSI+U0NBTSBXRUJTSVRFITwvdGV4dD48L3N2Zz4=");
       }
       `);
    }
  });

  if (document.title.search("Z-Library") >= 0) {

    var testImage = new Image();
    testImage.src = '/img/banners/scam-sites-3.png';

    testImage.onload = function() {
      console.log("load succ");
    };

    testImage.onerror = function() {
      const savedTime = localStorage.getItem('savedTime');
      const currentTime = Date.now();
      const timeDifference = currentTime - savedTime;

      if (timeDifference > 86400000) {
        showWarning();
      }

      const imgurl="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgwIiBoZWlnaHQ9IjY0MCIgdmlld0JveD0iMCAwIDI0IDMyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjIiIHk9IjkiIGZvbnQtc2l6ZT0iNCIgZmlsbD0iI0EwMCIgZm9udC13ZWlnaHQ9ImJvbGQiPkZha2UgWi1MaWI8L3RleHQ+PHBhdGggZD0iTTEuMjUgMTUuMjVhNiA2IDAgMCAxIDYtNmg5LjVhNiA2IDAgMCAxIDYgNnY5LjVhNiA2IDAgMCAxLTYgNmgtOS41YTYgNiAwIDAgMS02LTZ6IiBmaWxsPSIjZTc3Ii8+PHRleHQgeD0iOSIgeT0iMjciIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiNBMDAiIGZvbnQtd2VpZ2h0PSJib2xkIj4hPC90ZXh0Pjx0ZXh0IHg9IjgiIHk9IjMwIiBmb250LXNpemU9IjIiIGZpbGw9IiNBMDAiIGZvbnQtd2VpZ2h0PSJib2xkIj53YXJuaW5nITwvdGV4dD48L3N2Zz4=";

      GM_addStyle(`
             div.container  div.well.login {
               background-repeat: no-repeat;
               background-image: url(${imgurl});
               background-position: center;
               background-size: contain;
             }
             div.container  div.well.login button {
               color: #FF5722;
               background: #FFEB3B;
             }
             div.container  div.well.login img {
               filter: sepia(100%);
             }
            `);
    };

    function showWarning() {
      var language = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage);
      var isEnglish = language.startsWith('en');

      var warningDiv = document.createElement('div');
      warningDiv.style = "position: fixed; top: 0px; left: 0px; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.6); z-index: 9999; display: flex; justify-content: center; align-items: center;";

      var contentDiv = document.createElement('div');
      contentDiv.style = "background-color: white; padding: 20px; border-radius: 10px; text-align: center;";

      var title = document.createElement('h2');
      title.textContent = isEnglish ? 'The current site is a scam Z-Library, please protect your account and data.' : '当前网址是假的z-lib，请注意保护你的账号和数据安全，不要登录或填写信息，防止账号丢失或信息泄露';
      title.style = "margin-bottom:10px;";
      contentDiv.appendChild(title);

      var closeButton = document.createElement('span');
      closeButton.textContent = isEnglish ? 'Close the alert, Continue to visit fake site' : '关闭提示，继续访问山寨网站';
      closeButton.style = "padding:3px 12px; font-size:large; cursor:pointer; color:#e77; background:#fcc6;"
      closeButton.onclick = function() {
        document.body.removeChild(warningDiv);
      };

      var close24hBtn = document.createElement('span');
      close24hBtn.textContent = isEnglish ? 'Do not remind again within 24 hours' : '24小时内不再提示';
      close24hBtn.style = "padding:3px 12px; margin-left:30px; font-size:large; cursor:pointer; color:#e77; background:#fcc6;"
      close24hBtn.onclick = function() {
        document.body.removeChild(warningDiv);
        const currentTime = Date.now();
        localStorage.setItem('savedTime', currentTime);
      };
      contentDiv.append(closeButton, close24hBtn);

      var img = document.createElement('img');
      img.src = '/banners/scam-sites-3.png';
      img.style ="display:block; maxWidth: 100%; margin:0px -10px 15px";
      contentDiv.appendChild(img);

      var info = document.createElement('h3');
      info.textContent = isEnglish ? 'Known official sites:' : '已知的官方链接：';
      contentDiv.appendChild(info);

      var links = [
        "https://z-lib.gs",
        "https://z-lib.fm",
        "https://1lib.sk",
        "https://go-to-library.sk",
        "https://articles.sk",
        "https://z-library.sk",

        //  "https://singlelogin.re",
        //  "https://singlelogin.rs",
        //  "https://z-library.rs",

      ];

      links.forEach(function(link) {
        let a = document.createElement('a');
        a.href = link;
        a.textContent = link;
        a.style = 'display:block; margin:5px auto; width: max-content;';
        contentDiv.appendChild(a);
        let testImage = new Image();
        testImage.src = link + '/img/banners/scam-sites-3.png';
        testImage.onload = function() {
          a.style.color = "#0b8";
          img.src = testImage.src;
          console.log("load succ" + img.src);
        };
      });

      warningDiv.appendChild(contentDiv);
      document.body.appendChild(warningDiv);
    }

  }
})();
