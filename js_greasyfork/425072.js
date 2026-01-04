// ==UserScript==
// @name         美化SCSS中文网文档左侧文档目录栏
// @name:en      Prettify directory column on the left side of the SCSS Chinese website.
// @namespace    http://sass.hk/docs/
// @version      0.1
// @description  给scss中文网文档的侧边目录栏添加滚动条并且将其固定在左侧不随页面滚动.
// @description:en Add a scroll bar to the side directory bar of the scss Chinese website document and fix it on the left side without scrolling with the page.
// @author       AIUSoft
// @match        *.sass.hk/docs/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425072/%E7%BE%8E%E5%8C%96SCSS%E4%B8%AD%E6%96%87%E7%BD%91%E6%96%87%E6%A1%A3%E5%B7%A6%E4%BE%A7%E6%96%87%E6%A1%A3%E7%9B%AE%E5%BD%95%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/425072/%E7%BE%8E%E5%8C%96SCSS%E4%B8%AD%E6%96%87%E7%BD%91%E6%96%87%E6%A1%A3%E5%B7%A6%E4%BE%A7%E6%96%87%E6%A1%A3%E7%9B%AE%E5%BD%95%E6%A0%8F.meta.js
// ==/UserScript==
/*jshint esversion: 6 */

function constructStyleSheet(innerRule){
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(innerRule));
    return style
}


(function() {
    'use strict';
    const leftSide = document.querySelector('body>.container-fluid>.w-tabnav')
    if(leftSide!==null){
        leftSide.style= "position: sticky;height:90vh;top: 5em;left: 0;overflow: overlay;"
        const styleStr = `
  .scrollbar-customize::-webkit-scrollbar{
    width:6px;
    transition: width 1s linear;
  }
  .scrollbar-customize::-webkit-scrollbar-track{
    border-radius:3px;
    background-color:rgba(186,186,186,0.3);
  }
  .scrollbar-customize::-webkit-scrollbar-thumb{
    background-color:#A5A5A5;
    border-radius:3px;
  }
  .scrollbar-customize:hover::-webkit-scrollbar{
    width:12px;
    border-radius:6px;
  }
  .scrollbar-customize:hover::-webkit-scrollbar-track{
    border-radius:6px;
  }
  .scrollbar-customize:hover::-webkit-scrollbar-thumb{
    background-color:#CC6699;
    border-radius:6px;
  }
      `
      const styleEl = constructStyleSheet(styleStr)
      document.head.appendChild(styleEl)
      leftSide.classList.add('scrollbar-customize')
    }
})();