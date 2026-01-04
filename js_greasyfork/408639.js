// ==UserScript==
// @name         闲鱼链接&口令转换（cover：去你大爷的闲鱼口令）
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  在 https://www.v2ex.com/t/686313 的基础上做了细微的修改，将 V2EX 帖子中的闲鱼口令/淘口令/链接转换为可直接访问的链接，使您可一键直达闲鱼/淘宝。
// @author       Wood, Liby
// @match        https://*.v2ex.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408639/%E9%97%B2%E9%B1%BC%E9%93%BE%E6%8E%A5%E5%8F%A3%E4%BB%A4%E8%BD%AC%E6%8D%A2%EF%BC%88cover%EF%BC%9A%E5%8E%BB%E4%BD%A0%E5%A4%A7%E7%88%B7%E7%9A%84%E9%97%B2%E9%B1%BC%E5%8F%A3%E4%BB%A4%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/408639/%E9%97%B2%E9%B1%BC%E9%93%BE%E6%8E%A5%E5%8F%A3%E4%BB%A4%E8%BD%AC%E6%8D%A2%EF%BC%88cover%EF%BC%9A%E5%8E%BB%E4%BD%A0%E5%A4%A7%E7%88%B7%E7%9A%84%E9%97%B2%E9%B1%BC%E5%8F%A3%E4%BB%A4%EF%BC%89.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const text = document.body.innerText;
  const aTagCollection = document.body.getElementsByTagName('a');
  const tkl = text.match(/[€|¥][A-Za-z0-9]+[€|¥]/g);
  const marketUrlCollection = text.match(/https:\/\/market.m.taobao.com\/.*/gm);

  function createNode(url) {
    const template = `<span onclick="addIframe('${url}')" style="color: red; padding: 0 .5em; font-weight: 500; cursor: pointer;">点击查看</span>`;
    let tempNode = document.createElement('div');
    tempNode.innerHTML = template;
    return tempNode.firstChild;
  }

  window.addIframe = (url) => {
    const viewDom = document.getElementById("viewGoods");
    viewDom && viewDom.remove();
    let div = document.createElement("div");
    div.setAttribute("id", "viewGoods");
    div.innerHTML = `
      <div><span onclick="document.getElementById('viewGoods').remove()" style="width: 60px;height: 30px;color: white;background: red;display: inline-block;text-align: center;line-height: 30px;float: right;cursor: pointer;">关闭</span></div>
      <iframe src=${url}" style="width: 300px;height: 540px;background: white;">`;
    div.style.position = "fixed";
    div.style.bottom = "3em";
    div.style.right = "4em";
    document.body.appendChild(div);
  }

  for (let i = 0; i < aTagCollection.length; i += 1) {
    if (marketUrlCollection?.includes(aTagCollection?.[i]?.href)) {
      const newNode = createNode(aTagCollection[i].href);
      aTagCollection[i].parentNode.replaceChild(newNode, aTagCollection[i]);
    }
  }

  tkl?.forEach(item => {
    if (fetch) {
      fetch(`https://jckhj8su.demo.wood-is.top/tkl/tkljm?apikey=ZwuJXDIBef&tkl=${item}`)
        .then(res => {
          res.json()
            .then(data => {
              const {content, url} = data;
              document.body.innerHTML = document.body.innerHTML.replace(item, `<span title="${content}" onclick="addIframe('${url}')" style="color: red; padding: 0 .5em; font-weight: 500; cursor: pointer;">${item}</span>`)
            })
        })
    }
  });
})();