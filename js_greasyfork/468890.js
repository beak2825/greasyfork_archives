// ==UserScript==
// @name         增加豌豆荚网页版中APP的历史版本下载按钮和相关历史版本app跳转到下载页
// @namespace    https://github.com/eaeful/
// @version      0.7
// @description  增加豌豆荚网页版中APP的历史版本下载按钮和恢复相关历史版本app正常下载
// @match        https://www.wandoujia.com/mip/apps/*/history_v*
// @match        https://www.wandoujia.com/apps/*
// @match        https://m.wandoujia.com/mip/apps/*/history_v*
// @match        https://m.wandoujia.com/apps/*
// @grant        none
// @license      MIT License
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/468890/%E5%A2%9E%E5%8A%A0%E8%B1%8C%E8%B1%86%E8%8D%9A%E7%BD%91%E9%A1%B5%E7%89%88%E4%B8%ADAPP%E7%9A%84%E5%8E%86%E5%8F%B2%E7%89%88%E6%9C%AC%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE%E5%92%8C%E7%9B%B8%E5%85%B3%E5%8E%86%E5%8F%B2%E7%89%88%E6%9C%ACapp%E8%B7%B3%E8%BD%AC%E5%88%B0%E4%B8%8B%E8%BD%BD%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/468890/%E5%A2%9E%E5%8A%A0%E8%B1%8C%E8%B1%86%E8%8D%9A%E7%BD%91%E9%A1%B5%E7%89%88%E4%B8%ADAPP%E7%9A%84%E5%8E%86%E5%8F%B2%E7%89%88%E6%9C%AC%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE%E5%92%8C%E7%9B%B8%E5%85%B3%E5%8E%86%E5%8F%B2%E7%89%88%E6%9C%ACapp%E8%B7%B3%E8%BD%AC%E5%88%B0%E4%B8%8B%E8%BD%BD%E9%A1%B5.meta.js
// ==/UserScript==

// 只有电脑网页端有效了，电脑端仍然是"直接下载当前版本号的APK"的按钮。
//手机网页端因为脚本无法跨域请求网页端的下载链接来赋值到手机网页端的下载按钮，所以手机网页端没有任何脚本作用，请自行切换到电脑端标识下载。
//不好意思，更新久等了，估计（可能）脚本及其对应方法快要彻底失效了，彻底失效可能意味着豌豆荚彻底断开历史版本的前台显示的下载通道，（源文件的下载我不清楚能不能继续）

(function() {
  var currentUrl = window.location.href;

  // 定义匹配第一条件的模式
  var pattern1 = /https:\/\/www\.wandoujia\.com\/apps\/(\d+)\/history_v(\d+)/;
  var match1 = currentUrl.match(pattern1);

  // 定义匹配第二条件的模式
  var pattern2 = /https:\/\/m\.wandoujia\.com\/apps\/(\d+)\/history_v(\d+)/;
  var match2 = currentUrl.match(pattern2);


  if (match1) {

    var appId = match1[1];
    var version = match1[2];

    // 构建新的跳转URL
    var newUrl = "https://www.wandoujia.com/mip/apps/" + appId + "/history_v" + version;

    // 跳转到新的URL
    window.location.href = newUrl;
 } else if (match2) {


    let appId = match2[1];
    let version = match2[2];

    // 构建新的跳转URL
    //let newUrl = "https://m.wandoujia.com/mip/apps/" + appId + "/history_v" + version;

    // 跳转到新的URL
   // window.location.href = newUrl;
 }
  if (currentUrl.includes('www') && currentUrl.includes('mip')) {
    // 获取当前版本号的APK下载链接
    var apkLink = document.querySelector('.qr-info a').href;

    // 创建下载按钮
    var downloadBtn = document.createElement('a');
    downloadBtn.target = '_blank';
    downloadBtn.href = apkLink;
    downloadBtn.className = 'v2-safe-btn';
    downloadBtn.style.background = '#0080ff';
    downloadBtn.innerHTML = '直接下载当前版本号的APK';

    // 添加下载按钮到页面
    var buttonWrap = document.querySelector('.download-v2-wrap .button-wrap');
    buttonWrap.appendChild(downloadBtn);
  }


 else {
    var pattern3 = /https:\/\/www\.wandoujia\.com\/apps\/(\d+)/;
    var match3 = currentUrl.match(pattern3);

    var pattern4 = /https:\/\/m\.wandoujia\.com\/apps\/(\d+)/;
    var match4 = currentUrl.match(pattern4);

    if (match3) {

      // 构建历史版本的新URL，只保留 apps 后面的数字，并在基本 URL 后添加 /history
      let appId = currentUrl.match(/apps\/(\d+)/)[1];
      var historyUrl = currentUrl.replace('/apps/' + appId, '/apps/' + appId + '/history');

      // 创建历史版本的链接元素
      var historyLink = document.createElement('a');
      historyLink.href = historyUrl;
      historyLink.target = '_blank';
      historyLink.innerText = '历史版本';

      // 查找适合的插入位置
      var detailMenu = document.querySelector('div.detail-menu ul');
      var insertPosition = detailMenu || null;

      // 在插入位置添加历史版本链接，在简介、评论、热门文章右边添加“历史版本”的绿色文字按钮
      if (insertPosition) {
        var listItem = document.createElement('li');
        listItem.className = 'current';
        listItem.appendChild(historyLink);
        insertPosition.appendChild(listItem);
      }
    } else if (match4) {

      // 构建历史版本的新URL，只保留 apps 后面的数字，并在基本 URL 后添加 /history
        let appId = currentUrl.match(/apps\/(\d+)/)[1];
        let historyUrl = currentUrl.replace('/apps/' + appId, '/apps/' + appId + '/history');

      // 创建历史版本的链接元素
      let historyLink = document.createElement('a');
      historyLink.href = historyUrl;
      historyLink.target = '_blank';
      historyLink.innerText = '历史版本';

      // 查找适合的插入位置
      let detailMenu = document.querySelector('div.detail-menu ul');
      let insertPosition = detailMenu || null;

      // 在插入位置添加历史版本链接，在简介、评论、热门文章右边添加“历史版本”的绿色文字按钮
      if (insertPosition) {
        let listItem = document.createElement('li');
        listItem.className = 'current';
        listItem.appendChild(historyLink);
        insertPosition.appendChild(listItem);
      }
    }
  }
})();
