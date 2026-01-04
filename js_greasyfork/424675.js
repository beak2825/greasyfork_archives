// ==UserScript==
// @name         jandan-gif2mov
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  感谢ezgif.com提供的服务，将gif图片传值至转换页面，点击【Convert GIF to MP4!】后即可完成转换，可直接查看，亦可下载后进行分享收藏。
// @author       vevan
// @match        http://jandan.net/pic/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424675/jandan-gif2mov.user.js
// @updateURL https://update.greasyfork.org/scripts/424675/jandan-gif2mov.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelectorAll('.commentlist img[src$=".gif"]').forEach(el=>{
        let org_url = el.getAttribute('org_src')
        let url = el.getAttribute('src')
        if(org_url){
            url = org_url.replace(/^.*?\/\//g,'')
        }else{
            url=url.replace(/^.*?\/\//g,'')
        }
        let br = el.previousElementSibling
        br.insertAdjacentHTML('beforebegin',`<a class="view_img_link" style="margin-inline-start:2em;" href="https://ezgif.com/gif-to-mp4?url=${url}" target="_blank" title="请在新页面点击Convert GIF to MP4!">[以mp4查看]</a><br />`)
    })
    // Your code here...
})();