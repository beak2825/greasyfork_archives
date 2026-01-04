// ==UserScript==
// @name         知乎故事会
// @namespace    https://greasyfork.org/zh-CN/scripts/386228-%E7%9F%A5%E4%B9%8E%E6%95%85%E4%BA%8B%E4%BC%9A
// @version      0.2.3
// @description  将知乎网站所有“知乎”替换为“故事会”
// @author       taxayd
// @match        *://*.zhihu.com/*
// @downloadURL https://update.greasyfork.org/scripts/386228/%E7%9F%A5%E4%B9%8E%E6%95%85%E4%BA%8B%E4%BC%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/386228/%E7%9F%A5%E4%B9%8E%E6%95%85%E4%BA%8B%E4%BC%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function reset (element) {
        // let root = document.getElementById('root');
        if (element.childElementCount == 0) {
            return;
        }
        let children = element.children;
        for(let i=0; i<children.length; i++){
            let item = children[i];
            // console.log(i, item);
            if (item.childElementCount == 0 && item.innerText != undefined) {
                // no child
                if (item.innerText.includes('知乎')) {
                    // item.innerText = item.innerText.split('知乎').join('故事会');
                    item.innerText = item.innerText.replace(/知乎/g, '故事会');
                    item.innerText = item.innerText.replace(/回答/g, '故事');
                    item.innerText = item.innerText.replace(/谢邀/g, '我要开始装逼了');
                }
            } else {
                // has child
                reset(item);
            }
        }
    }
    // 内容
    reset(document.getElementById('root'));
    // title
    document.title = document.title.replace(/知乎/g, '故事会');
    // favicon
    let link = document.querySelector("link[rel*='shortcut icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = 'https://i.loli.net/2019/06/16/5d059b3dbb3dc45665.png';
    document.getElementsByTagName('head')[0].appendChild(link);
    // 头部图标
    function reset_icon (svg){
        console.log('in reset_icon', svg);
        let icon = null;
        let icon_text = null;
        if (svg == undefined || svg == null) {
            console.log('first');
            svg = document.getElementById('zh-top-link-logo');
            svg.style = 'background-image:url(https://i.loli.net/2019/06/16/5d05ac216b0f116870.png);';
        } else {
            console.log('second');
            icon_text = document.createElement('b');
            icon_text.style="color: #1889e8;";
            icon_text.id="icon-text";
            icon_text.innerText = '故事会';
            icon = svg.parentElement;
            icon.replaceChild(icon_text, svg);
        }
    }
    let svgs = document.getElementsByClassName('Icon ZhihuLogo ZhihuLogo--blue Icon--logo');
    let svg1 = svgs[1];
    let svg0 = svgs[0];
    reset_icon(svg0);
    reset_icon(svg1);
})();