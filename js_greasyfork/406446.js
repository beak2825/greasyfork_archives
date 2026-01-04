// ==UserScript==
// @name		向Iwara视频标题添加作者名称和日期
// @description		在网站标题中添加作者名和发布日期，以便下载软件如IDM自动获取文件名。
// @namespace		https://sirokami.moe/
// @version		0.350
// @require		https://code.jquery.com/jquery-3.5.1.slim.min.js
// @match		https://*.iwara.tv/video/*
// @downloadURL https://update.greasyfork.org/scripts/406446/%E5%90%91Iwara%E8%A7%86%E9%A2%91%E6%A0%87%E9%A2%98%E6%B7%BB%E5%8A%A0%E4%BD%9C%E8%80%85%E5%90%8D%E7%A7%B0%E5%92%8C%E6%97%A5%E6%9C%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/406446/%E5%90%91Iwara%E8%A7%86%E9%A2%91%E6%A0%87%E9%A2%98%E6%B7%BB%E5%8A%A0%E4%BD%9C%E8%80%85%E5%90%8D%E7%A7%B0%E5%92%8C%E6%97%A5%E6%9C%9F.meta.js
// ==/UserScript==

window.onload = function() {
  let intervalId = setInterval(function(){
    if ($) {
      const username = $(".page-video__byline__info").find(".text")[0].innerText;
      const title = $(".text--h1")[0].innerText;
      const textInput = $(".page-video__details__subtitle").find(".text--small")[0].title;
      const datefix = formatDate(textInput);

      const fixtitle = "[" + username + "] [" + datefix + "] " + title;

      let iId = setInterval(function(){
        document.title = fixtitle;
      },1000);

      setTimeout(function(){
        clearInterval(iId);
      }, 8000)

      clearInterval(intervalId);
    }
  }, 500);
};

function formatDate(str) {
    let parts = str.split('/');
    let year = parts[0];
    let month = parts[1].padStart(2, '0');
    let dateWithTime = parts[2];
    let dateParts = dateWithTime.split(' ');
    let day = dateParts[0];
    return `${year}-${month}-${day}`;
}

