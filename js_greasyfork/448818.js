// ==UserScript==
// @name        调整打印文件
// @namespace   print adjust
// @match       https://ctbpsp.com/*
// @match       https://custominfo.cebpubservice.com/*
// @match       https://bulletin.cebpubservice.com/qualifyBulletin/*
// @match       https://bulletin.cebpubservice.com/biddingBulletin/*
// @match       https://bulletin.cebpubservice.com/candidateBulletin/*
// @match       https://bulletin.cebpubservice.com/resultBulletin/*
// @match       https://bulletin.cebpubservice.com/resources/*
// @match       https://bulletin.cebpubservice.com/changeBulletin/*
// @grant       none
// @run-at      document-idle
// @version     1.3.6
// @author      我爱小熊啊
// @description 感谢油猴中文网的 cxxjackie 大佬指点
// @description 增加更正公告打印支持
// @description 关于 postMessage() 跨域通信，学习地址 https://bbs.tampermonkey.net.cn/thread-2866-1-1.html
// @description cebpubservice.com 文件加载时间较长，遇到未加载完成的，页码输入界面点击取消，文件加载完后，记住页码，刷新输入页码，等待加载完成
// @description 将 ctbpsp.com 与 cebpubservice.com 的等待时间做区分
// @description 自动隐藏 cebpubservice.com 上的二维码广告
// @description 增加对 cebpubservice.com的支持
// @description 中国招标投标公共服务平台公告文件打印调整
// @description 2022/8/3 08:33:33
// @license     MIT
// @homepageURL https://greasyfork.org/zh-CN/scripts/448818-%E8%B0%83%E6%95%B4%E6%89%93%E5%8D%B0%E6%96%87%E4%BB%B6
// @downloadURL https://update.greasyfork.org/scripts/448818/%E8%B0%83%E6%95%B4%E6%89%93%E5%8D%B0%E6%96%87%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/448818/%E8%B0%83%E6%95%B4%E6%89%93%E5%8D%B0%E6%96%87%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
  'use strict';
  // 中国招标公告公示
  // 此网站的 iframe 与主页面同域，均在 bulletin.cebpubservice.com
  if (location.hostname === 'bulletin.cebpubservice.com'){
    var b = document.getElementsByClassName('PublicAddress')[0];
    b.style.display = 'none';
    var pdf = document.getElementsByClassName('pdf_wraper')[0];
    var iframe = pdf.children[0];    // 定位 iframe，pdf.children['iframe'];

    var t = setInterval(function(){
      // alert('1');
      // if(iframe.contentWindow.PDFViewerApplication.pdfDocument != null){
      if(iframe.contentWindow.PDFViewerApplication.downloadComplete){
        // alert('2');
        var n = 1 * iframe.contentDocument.getElementById('numPages').textContent[2];
        pdf.style.width = '900px';
        var h = n * 1150 + 'px';
        pdf.style.height = h;
        // slt[0].options[1].selected = true;
        clearInterval(t);
        // alert('3');
      }
    },1000);
  }
  // 全国招标投标公共服务平台
  // postMessage() 通信，感谢油猴中文网的 cxxjackie 大佬指点
  // 此网站的 iframe 与主页面 跨域，主页面在 ctbpsp.com，iframe 在 custominfo.cebpubservice.com
  // 主页面
  if (location.hostname === 'ctbpsp.com') {
    // 监听message事件，取得页码数后调整iframe大小
    window.addEventListener('message', e => {
      if ('numPages' in e.data) {
        document.querySelector('.loadingqrCode').style.display = 'none';
        var iframe = document.querySelector('.pdf-viewer');
        iframe.width = 900;
        iframe.height = 1150 * e.data.numPages;
      }
    });
  }
  // iframe页面
  if (location.hostname === 'custominfo.cebpubservice.com') {
    // iframe内有一个全局对象PDFViewerApplication，可对其进行劫持来判断pdf加载完毕，也可以用其他方法。
    var _load = window.PDFViewerApplication.load;
    window.PDFViewerApplication.load = function(pdfDocument) {
      // 获取页码数，发送给主页面
      window.top.postMessage({
        numPages: pdfDocument._pdfInfo.numPages
      }, 'https://ctbpsp.com');
      return _load.call(this, pdfDocument);
    };
  }
})();