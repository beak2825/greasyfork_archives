// ==UserScript==
// @name        电脑报
// @namespace   Violentmonkey Scripts
// @match       https://www.mydigit.cn/forum-39-1.html
// @grant       none
// @version     1.0
// @author      liguang
// @description 2023/10/20 20:59:57
// @downloadURL https://update.greasyfork.org/scripts/477858/%E7%94%B5%E8%84%91%E6%8A%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/477858/%E7%94%B5%E8%84%91%E6%8A%A5.meta.js
// ==/UserScript==

(function(){
    // 获取页面上的所有超链接
    const linksCollection = document.querySelectorAll('a');
    pos = document.querySelector('#append_parent');    //插入点

    // 遍历链接集合，保存包含“电脑报2023”的链接
    const links = [];
    for(let i = 0; i < linksCollection.length; i++) {
      if(linksCollection[i].innerText.includes('电脑报202')) {
        links.push(linksCollection[i]);
      }
    }
    console.log(links);

    // 创建新的p元素，并将包含“电脑报2023”的链接添加到里面
    const p = document.createElement('p');
    p.style.textAlign = 'center';
    p.style.padding = '30px';
    p.style.border = '4px solid #f00';
    links.forEach(link => p.appendChild(link.cloneNode(true)));

    // 将p元素插入到文档中
    document.body.appendChild(p);
    document.body.insertBefore(p, pos);
    console.log(p);

})()