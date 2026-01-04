// ==UserScript==
// @name         繁体中文自动转简体
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  页面初始化完成后，讲自动转化页面中的繁体
// @author       mds
// @license      MIT
// @match         *://*/*
// @icon         https://fanyi-cdn.cdn.bcebos.com/webStatic/translation/img/favicon/favicon-32x32.png
// @grant        none
// @require      https://unpkg.com/cnchar@3.2.4/cnchar.min.js
// @require      https://unpkg.com/cnchar-trad@3.2.4/cnchar.trad.min.js
// @downloadURL https://update.greasyfork.org/scripts/469304/%E7%B9%81%E4%BD%93%E4%B8%AD%E6%96%87%E8%87%AA%E5%8A%A8%E8%BD%AC%E7%AE%80%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/469304/%E7%B9%81%E4%BD%93%E4%B8%AD%E6%96%87%E8%87%AA%E5%8A%A8%E8%BD%AC%E7%AE%80%E4%BD%93.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function autoTransfer(){
    try {
      const txtNodes = [];
      const allNode = filterInValidNode(document.body.childNodes);
      function findAllTxtNode(nodes = []) {
        nodes.forEach((node) => {
          if (node.nodeType === 3) {
            txtNodes.push(node);
          } else if (node.childNodes && node.childNodes.length > 0) {
            findAllTxtNode(filterInValidNode(node.childNodes));
          }
        });
      }

      function filterInValidNode(nodes = []) {
        return Array.from(nodes).filter((node) => {
          const names = ["CANVAS", "SCRIPT", "STYLE", "IMG"];
          if (names.includes(node.nodeName)) return false;
          return true;
        });
      }

      //去掉html标签
      function delHtmlTag(str) {
        const str1 = str.replace(/<\/?[^>]*>/gim, ""); //去掉所有的html标记
        return str1.replace(/(^\s+)|(\s+$)/g, ""); //去掉前后空格
      }
      findAllTxtNode(allNode);
      const filterNodes = txtNodes.filter((node) => {
        return delHtmlTag(node.nodeValue) !== "";
      });

      if (!filterNodes.length) return;
      console.log(filterNodes,'filterNodes')
      filterNodes.forEach((item) => {
        const innerText = item.nodeValue.convertTradToSimple();
        item.nodeValue = innerText;
      });
    } catch (error) {
      console.log('出错啦',error);
    }
  }

  function filterFixedPng(){
     // 获取域名中的数字,并且都不是连续的
     const domainNumbers = location.hostname.match(/\d+/g).join("");
     if(location.hostname.includes(domainNumbers))return

    // 移除所有fixed并且z-index>100的.
    const fixedEles = Array.from(document.querySelectorAll('[style*="fixed"]') || [])
    const filterFixed = fixedEles.filter(item=>item.style.zIndex>100)
    console.log('filterFixed',filterFixed)
    filterFixed.forEach((item) => {
      item.parentNode.removeChild(item)
    })

     // 获取所有的a>img标签 
     /* const findAllA =Array.from(document.querySelectorAll('a>img') || [])
     
     findAllA.forEach((item) => {
      item.parentNode.onLone
     }) */
     
  }
  window.onload = function () {
    setTimeout(() => {
      autoTransfer()
      filterFixedPng()
    },3000)
  };
})();
