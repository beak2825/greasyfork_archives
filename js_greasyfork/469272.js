// ==UserScript==
// @name         goto avgle
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在ccavb里跳转到avgle kissjav forjav来搜索下载资源
// @author       You
// @match        https://ccavb.tv/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ccavb.tv
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469272/goto%20avgle.user.js
// @updateURL https://update.greasyfork.org/scripts/469272/goto%20avgle.meta.js
// ==/UserScript==


(function() {
    'use strict';
    let style = document.createElement('style')
    style.type = 'text/css';
    style.innerHTML = `
                 .mantine-h51n41{
                     min-height:60px;
                     height:auto;
                 }
            `
    document.querySelector('head').appendChild(style)
    let fh = location.pathname.replace('/video/FC2-','');
    if(!location.pathname.includes('FC2')){
        fh= location.pathname.replace('/video/','');
    }
    let url = 'https://avgle.com/search/videos?search_query='+fh+'&search_type=videos';
    let node = document.createElement('a');
    node.style.marginRight = '10px'
    node.href = url;
    node.innerText = 'AVGLE-link';
    let url2 = 'https://kissjav.com/search/video/?s='+fh;
    let node2 = document.createElement('a');
    node2.href = url2;
    node2.innerText = 'KISSJAV-link';
    node2.style.marginRight = '10px'
    let url3 = 'https://forjav.com/play/get.php?name='+fh;
    let node3 = document.createElement('a');
    node3.href = url3;
    node3.innerText = 'forJAv';
    setTimeout(()=>{document.getElementsByClassName('mantine-Title-root')[0].append(node);document.getElementsByClassName('mantine-Title-root')[0].append(node2);document.getElementsByClassName('mantine-Title-root')[0].append(node3)},1000)


    // Your code here...
})();