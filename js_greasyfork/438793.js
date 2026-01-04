// ==UserScript==
// @name         深度社区图片优化
// @namespace    deepin
// @version      0.1
// @description  将深度社区帖子中查看图片的功能优化，让其具有放大缩小等功能，美化图片和标题排版。
// @author       thepoy
// @match        https://bbs.deepin.org*/post/*
// @icon         https://bbs.deepin.org/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438793/%E6%B7%B1%E5%BA%A6%E7%A4%BE%E5%8C%BA%E5%9B%BE%E7%89%87%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/438793/%E6%B7%B1%E5%BA%A6%E7%A4%BE%E5%8C%BA%E5%9B%BE%E7%89%87%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var new_style = document.createElement('style')
    new_style.innerHTML = `.imgBox {display:none!important;}
    .post_edit img:not(.emoji), .vditor-reset img:not(.emoji){display: block;
box-shadow: 0px 8px 16px 1px hsla(0, 0%, 0%, 0.3);
border-radius: 5px;
margin: 3rem auto;
max-width: 95% !important;
image-orientation: from-image;}
.post_edit h1, .vditor-reset  h1 {
text-align: center;
font-family: serif !important;
font-size: 2.5em !important;
font-weight: 900 !important;
margin-top: 1.5em !important;
}
.post_edit code, .vditor-reset code {
font-family: "Courier", Monaco, Consolas,"Liberation Mono",Menlo,Courier,monospace,"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji","Segoe UI Symbol","Android Emoji","EmojiSymbols" !important;
}
    `
    document.getElementsByTagName("head")[0].appendChild(new_style);

    var viewer_style = document.createElement("link");
    viewer_style.setAttribute('rel', 'stylesheet');
    viewer_style.setAttribute('href', 'https://cdn.jsdelivr.net/gh/fengyuanchen/viewerjs/dist/viewer.min.css');
    document.getElementsByTagName("head")[0].appendChild(viewer_style);

    var viewerjs = document.createElement("script");
    viewerjs.setAttribute("src", "https://cdn.jsdelivr.net/gh/fengyuanchen/viewerjs/dist/viewer.min.js");
    document.getElementsByTagName("head")[0].appendChild(viewerjs);

    const timer = () => {
        setTimeout(function () {
            if (!Viewer) {
                timer()
                return
            }

            const imgs = document.getElementsByClassName('post_edit')[0].querySelectorAll('img')
            for (const i of imgs) {
                const viewer = new Viewer(i, {
                    focus: false,
                    inline: false,
                    navbar: false,
                });

            }
        }, 500);
    }
    timer()

})();