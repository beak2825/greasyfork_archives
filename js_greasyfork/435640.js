// ==UserScript==
// @name         字幕库增强
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  给字幕库 zimuku 网站增加rarbg跳转按钮、直接显示下载、直接显示豆瓣评分功能 (fork from Zimuku2pianyuan)
// @author       DoveAz
// @include       https://zmk.pw/detail/*
// @include       https://zimuku.org/detail/*
// @include       https://zimuku.pw/detail/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/435640/%E5%AD%97%E5%B9%95%E5%BA%93%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/435640/%E5%AD%97%E5%B9%95%E5%BA%93%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
  function addButton() {
    GM_addStyle(
      "span.py{background:#20A4FF;padding:16px 20px !important;height:50px;font-size:18px;color:#fff !important} span.rarbg{background:#505599;padding:16px 20px !important;height:50px;font-size:18px;color:#fff !important}"
    );
    let keywords = $("meta[name='keywords']").attr("content");
    let [title, en_title, ...rest] = keywords.split(",");
    let rarbgBtn = `<a href="https://rarbgmirror.com/torrents.php?search=${encodeURIComponent(
      en_title
    )}" target="_blank"><span class="rarbg">RARBG</span></a>`;
    let btnDownload = $(".dl").parent();
    btnDownload.after(rarbgBtn);
  }
  async function fetchDLinks() {
    GM_addStyle(`
            .down{margin:20px 0;}
            .down ul {
                -webkit-column-count: 3;
                -moz-column-count: 3;
                column-count: 3;
                }
            .down li{padding:10px}
        `);
    let link = document.getElementById("down1");
    link.hostname = location.hostname;
    link.protocol = location.protocol;
    let html = await fetch(link.href).then((response) => response.text());
    let downLinks = $($.parseHTML(html)).find(".down");
    downLinks.find("a").removeClass("btn");
    downLinks.find(".btn-warning").parent().remove();
    downLinks.find(".btn-success").parent().remove();
    $(".subinfo").after(downLinks);
  }

  function addDoubanIframe() {
    const doubanId = $(".tbhd li")
      .eq(1)
      .find("a")
      .attr("href")
      .match(/\/(\d*)\/$/)[1];
    $(".rside").prepend(
      `<iframe src="https://m.douban.com/mip/movie/subject/${doubanId}/" width="290" height="280" style="border:none" scrolling ="no"></iframe>`
    );
  }
  addButton();
  fetchDLinks();
  addDoubanIframe();
})();
