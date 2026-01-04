// ==UserScript==
// @name         贴吧提示被删楼层
// @namespace    qtqz
// @version      0.3
// @description  脚本在楼层右边计数，如果察觉到有楼层被删，数字会变红
// @author       qtqz
// @match        https://tieba.baidu.com/p/*
// @icon         https://tieba.baidu.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491422/%E8%B4%B4%E5%90%A7%E6%8F%90%E7%A4%BA%E8%A2%AB%E5%88%A0%E6%A5%BC%E5%B1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/491422/%E8%B4%B4%E5%90%A7%E6%8F%90%E7%A4%BA%E8%A2%AB%E5%88%A0%E6%A5%BC%E5%B1%82.meta.js
// ==/UserScript==

//2024/4/1
// @source       https://github.com/qtqz
(function () {
  'use strict';

setInterval(()=>{
    if(window.Atsbs!=window.location.href){
        func()
        window.Atsbs=window.location.href
    }
},5000)

  const func = () => {
    const flag = document.createElement('div')
    flag.classList.add('flag')
    let l = 1
    if (window.location.href.match('pn=')) {
      l = parseInt(document.querySelector('.post-tail-wrap > span.tail-info:nth-last-of-type(2)').textContent.slice(0, -1))
    }
    document.querySelectorAll('.p_content').forEach((e, i) => {
      let num = parseInt(e.parentNode.querySelector('.post-tail-wrap > span.tail-info:nth-last-of-type(2)').textContent.slice(0, -1))
      let r = flag.cloneNode()
      r.innerText = l
      if (num != l) {
        r.style = 'color:red;'
        l = num
      }
      l++
      e.append(r)
    });
  }
  func()
  var node = document.createElement("style");
  node.appendChild(document.createTextNode(`
.p_content {
    position: relative;
}
.post-tail-wrap > span.tail-info:nth-last-of-type(2) {
    font-size: 4rem!important;
}
.p_content>.flag {
    /*content: counter(item);
    counter-increment: item;*/
    position: absolute;
    z-index: 2000;
    right: -7rem;
    bottom: -5rem;
    width: 7rem;
    height: 7rem;
    background: #fff;
    font-size: 4rem;
    border-radius: 0 50% 50% 0;
    text-align: center;
    line-height: 7rem;
    box-shadow: #ccc 2px 0px 10px;
    color: #b0b0b0;
}


        `));
  var heads = document.getElementsByTagName("head");
  if (heads.length > 0) {
    heads[0].appendChild(node);
  } else {
    document.documentElement.appendChild(node);
  }
})();