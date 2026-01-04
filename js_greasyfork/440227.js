// ==UserScript==
// @name         百度网站统计 url 转中文 decode
// @description  url列表转decode编码
// @version      0.2
// @author       tomiaa
// @match        *://*tongji.baidu.com/*
// @namespace    http://tampermonkey.net/


// @downloadURL https://update.greasyfork.org/scripts/440227/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%AB%99%E7%BB%9F%E8%AE%A1%20url%20%E8%BD%AC%E4%B8%AD%E6%96%87%20decode.user.js
// @updateURL https://update.greasyfork.org/scripts/440227/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%AB%99%E7%BB%9F%E8%AE%A1%20url%20%E8%BD%AC%E4%B8%AD%E6%96%87%20decode.meta.js
// ==/UserScript==
(function(){
  const decode = () => {
    const fn = list => {
      list.forEach(item => {
        item.title = item.innerHTML = decodeURI(item.innerHTML)
      })
    }
    let list = document.querySelectorAll('a.ellipsis')
    fn(list);
    list = document.querySelectorAll('.access_page a')
    fn(list);
  }
  window.onload = decode;
  setTimeout(decode,2000)
  setTimeout(decode,4000)
  setTimeout(decode,6000)
})()