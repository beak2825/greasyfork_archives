// ==UserScript==
// @name            B站、微信封面获取
// @namespace       https://github.com/ZIDOUZI/Bilibili-Cover-Geter
// @version         2.1.0
// @description     获取B站视频,文章,直播的封面，微信文章的封面
// @author          子斗子
// @license         MIT
// @match           *://www.bilibili.com/read/*
// @match           *://www.bilibili.com/video/*
// @match           *://live.bilibili.com/*
// @match           *://mp.weixin.qq.com/*
// @exclude         *://api.bilibili.com/*
// @exclude         *://api.*.bilibili.com/*
// @exclude         *://*.bilibili.com/api/*
// @exclude         *://member.bilibili.com/studio/bs-editor/*
// @exclude         *://t.bilibili.com/h5/dynamic/specification
// @exclude         *://bbq.bilibili.com/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=w3school.com.cn
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/439619/B%E7%AB%99%E3%80%81%E5%BE%AE%E4%BF%A1%E5%B0%81%E9%9D%A2%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/439619/B%E7%AB%99%E3%80%81%E5%BE%AE%E4%BF%A1%E5%B0%81%E9%9D%A2%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function () {

    //是否在新标签页中打开图片地址
    const openInNew = true;

    //创建容器
    const item = document.createElement('item');
    item.id = 'SIR';
    item.innerHTML = `
        <button class="SIR-button">获取图片</button>
        `;

    document.body.append(item)

    //创建样式
    const style = document.createElement('style');
    style.innerHTML = `
      #SIR * {
          box-sizing: border-box;
          padding: 0;
          margin: 0;
      }
      #SIR .SIR-button {
          display: inline-block;
          height: 22px;
          margin-right: 10px;
          opacity: 0.5;
          background: white;
          font-size: 13px;
          padding:0 5px;
          position:fixed;
          bottom:2px;
          right:2px;
          border: solid 2px black;
          z-index: 9999;
      }
      `;

    const button = item.querySelector('.SIR-button')
    button.onclick = () => {
        if(openInNew) {
        window.open(getUrl());
        } else {
        self.location = getUrl();
        }
    }

    document.head.append(style)

    function getUrl() {
        //获取网址
        var source_url = window.location.href;
        //获取源代码
        let source = '';
        var xhr = new XMLHttpRequest();
        xhr.open('GET', window.location.href, false);
        xhr.send();
        source = xhr.responseText;


        var video_BV = /https\:\/\/www\.bilibili\.com\/video\/BV(.*)/i;
        var video_AV = /https\:\/\/www\.bilibili\.com\/video\/AV(.*)/i;
        var artical = /https\:\/\/www\.bilibili\.com\/read\/CV(.*)/i;
        var live = /https\:\/\/live\.bilibili\.com\/(.*)/i;
        var wechat_article = /https\:\/\/mp\.weixin\.qq\.com\/(.*)/i;

        //类型对应的正则表达式
        var rex = /a/;
        //偏移量
        var offset = 0;

        if (video_AV.test(source_url)) {
            //av视频
            rex = /<meta data-vue-meta=\"true\" property=\"og:image\" content=\"(.*?)\.(jpe?g|png)\">/
            offset = 56
        } else if (video_BV.test(source_url)) {
            //bv视频
            rex = /<meta data-vue-meta=\"true\" property=\"og:image\" content=\"(.*?)\.(jpe?g|png)\">/
            offset = 56
        } else if (artical.test(source_url)) {
            //cv文章
            rex = /\"origin_image_urls\":\[\"(.*?)\"[,\]]/
            offset = 22
        } else if (live.test(source_url)) {
            //直播
            rex = /\"cover\":\"(.*?)\.(jpe?g|png)\",/
            offset = 9
        } else if (wechat_article.test(source_url)) {
            //微信文章
            rex = /msg_cdn_url = \"(.*?)(jpe?g|png)\";/
            offset = 15
            window.alert("wechat")
        } else {
            window.alert("unknow")
        }

        //获取封面地址
        return source.match(rex)[0].slice(offset, -2).replace(/\\u002F/g, '\/')
    }

})();