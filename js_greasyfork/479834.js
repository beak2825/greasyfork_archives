// ==UserScript==
// @name         CSDN无效信息清除脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  做一名干干净净的程序员！
// @author       hencins(github - 892108131@qq.com)
// @connect      www.csdn.net
// @match      *://*.csdn.net/*
// @match        https://www.tampermonkey.net/index.php?ext=gcal&updated=true&version=5.0.6189
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479834/CSDN%E6%97%A0%E6%95%88%E4%BF%A1%E6%81%AF%E6%B8%85%E9%99%A4%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/479834/CSDN%E6%97%A0%E6%95%88%E4%BF%A1%E6%81%AF%E6%B8%85%E9%99%A4%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    console.log('CSDN无效信息清除脚本 loaded');

    // 遇到链接直接跳转
    if (location.host === "link.csdn.net") {
        location.href = decodeURIComponent(location.search.replace('?target=', ''));
        return;
    }

    // hidden class
    // blog-footer-bottom recommend-box recommend-nps-box
    // hidden id
    // asideNewNps footerRightAds

    const css = `
      .blog-footer-bottom,
      .recommend-box,
      .recommend-nps-box,
      .csdn-side-toolbar,
      .box-shadow.mb8,
      .toolbar-btn.toolbar-btn-vip,
      .aside-box-footer,
      .tool-active-list,
      .data-info.item-tiling,
      .user-profile-head-banner,
      .programmer1Box,
      .aside-box.kind_person, #分类专栏,
      .hljs-button.signin,
      .more-toolbox-new,
      .passport-login-container,
      .blog-banner,
      .blog-slide-ad-box,
      .blog-rank-footer,
      .csdn-copyright-footer,
      .blog-nps,
      .blog-top-banner,
      .blogTree,
      .operation .feedback,
      .weixin-shadowbox, #phone,
      .csdn-toolbar-box, #phone,
      .article_info, #phone,
      .feed-Sign-weixin, #phone,
      #operate, #phone,
      #recommend, #phone,
      .open_app_channelCode.app_abtest_btn_open, #phone,
      .adsbygoogle,
      #toolbarBox,
      #asideNewNps,
      #asideWriteGuide,
      #footerRightAds,
      #google-center-div,
      #recommendAdBox,
      #asideNewComments, #最新评论,
      #asideHotArticle, #热门文章,
      #asideArchive, #asideArchive>*, #最新文章,
      #asideProfile, #博主信息,
      #asideSearchArticle, #搜索文章,
      #blogHuaweiyunAdvert,
      #blogColumnPayAdvert,
      #articleSearchTip,
      #asideCategory,
      #treeSkill
      {
         display: none !important;
         visibility: hidden !important;
      }

      #userSkin {
        background: unset !important;
      }

      #code,
      #content_views pre,
      #content_views pre code {
        user-select: text !important;
      }
    `
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    style.id = 'hencins script'
    document.head.appendChild(style);

    // 复制粘贴
    let keydownList = [];
    onkeydown = (e) => {
        console.log('监听到:', e.key)
        keydownList.push(e.key);
        if (keydownList.toString() === 'Control,c') {
            const copytext = getSelectionText();
            console.log('执行拷贝操作', copytext)
            navigator.clipboard.writeText(copytext).then(() => {
                console.log('拷贝成功')
            })
        }
    }
    onkeyup = (e) => {
        //if (keydownList.includes(e.key)) {
        //    keydownList.splice(keydownList.indexOf(e.key), 1)
        //}
        keydownList = [];
    }

    function getSelectionText() {
        var text = "";
        if (window.getSelection) {
            text = window.getSelection().toString();
        } else if (document.selection && document.selection.type != "Control") {
            text = document.selection.createRange().text;
        }
        return text;
    }

    {
      // 背景色及水印
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const width = 200;
        const height = 100;
        canvas.width = width;
        canvas.height = height;
        ctx.fillStyle = 'white'; // 'rgba(144, 238, 144, 44)';
        ctx.fillRect(0,0,width,height);
        ctx.font="20px Georgia";
        ctx.fillStyle = '#00000022';
        // ctx.fillText('helloworld', 10, 50);
        // ctx.fillText('世界', 20, 20);
        ctx.translate(15, 20);
        ctx.rotate(30 * Math.PI / 180);
        ctx.fillText('CSDN', 0, 0);
        // ctx.rotate(90 * Math.PI / 180);
        // ctx.fillText('helloworld', 0, 0);
        var blob = canvas.toDataURL('image/png')
        console.log(blob, document.body)
        // document.body
        document.body.style = `background: url(${blob}) repeat;`;
    }
})();