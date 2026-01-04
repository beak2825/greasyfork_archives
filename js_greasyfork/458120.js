// ==UserScript==
// @name            pximg跳转
// @namespace       https://github.com/ZIDOUZI/...
// @version         1.0.1
// @description     从pximg跳转到pixiv.net
// @author          子斗子
// @license         MIT
// @match           https://i.pximg.net/img-original/img/*
// @match           https://*.jitsu.top/img-original/img/*
// @icon            https://www.pixiv.net/favicon.ico
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/458120/pximg%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/458120/pximg%E8%B7%B3%E8%BD%AC.meta.js
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
        if (openInNew) {
            window.open(getUrl());
        } else {
            self.location = getUrl();
        }
    }

    document.head.append(style)

    function getUrl() {
        //获取网址
        const source_url = window.location.href;

        const pximg = /img-original\/img\/\d{4}\/\d{2}\/\d{2}\/\d{2}\/\d{2}\/\d{2}\/(\d+)(_p(\d+)).(\w+)$/;

        if (pximg.test(source_url)) {
            const result = source_url.match(pximg);
            return "https://www.pixiv.net/artworks/" + result[1] + "#" + result[3]
        }
        else {
            window.alert("url not support!")
        }

    }
})()