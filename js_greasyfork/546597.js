// ==UserScript==
// @name         CSDN界面优化
// @namespace    http://tampermonkey.net/
// @version      v1.0.3
// @description  CSDN界面美化
// @author       明天不知在哪里
// @match        *://*.csdn.net/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAb1BMVEX8VTH8USz8Tyj8Tif8Uy78TST8eF38kn79mIb8fGP8Wjb+zsb+493/8/D+6+j+0sv9nYr8b1L/9/X////9xbj9va7+3NP9qpn8Zkj+6OL8Rhb8Sx/9x7v8gmr8YD39pJT8iHD/+vn+tqn8j3j9sKPVly74AAAA5klEQVR4Aa2SRZLDQBAENSQcsKbErJX//8Ulk3DRec2uiCbnSRDKKOF7hgvH9XwvCNlOyvEjqZSW5rQJ0ziyuGCNWDsJwCZpBgD5wpKiBJRX1XVVREBSz2XdAGUrLh2nOibzYAzY07VLTkO6CEaA6e49LprloYLthbMLHUZol+xL0Y+QzgH1CyCrv0iRA5IcSDqtGpoX8s5iPNcPFbOZrRNATzW/nDU05UDnUQDqHFbvOCcNZPP2WHu5pJQKHzT1cklyxA0VdXzZcZEbqZXSZdZ49fpPiAjdyfe9tmB07/0IZZfX/DdvphAP/wvKn48AAAAASUVORK5CYII=
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546597/CSDN%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/546597/CSDN%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  const style = document.createElement("style");
  document.head.appendChild(style);
  style.textContent = `
    /* 顶部导航 */
    #toolbarBox {
      display: none !important;
    }

    /* 左侧边栏 */
    .blog_container_aside  {
      display: none !important;
    }

    /** 右侧边栏 */
    .preview-wrapper.view, .recommend-right {
      display: none !important;
    }

    /* 底部推荐 */
    .recommend-box {
      display: none !important;
    }
  `

  // 主体部分
  const mainBox = document.querySelector("#mainBox");
  mainBox.style.cssText = `
  width: 60%;
  margin: 0 auto;
  `;
  const main = mainBox.querySelector("main");
  main.style.cssText = `
  width: 100%;
  `;


  // 监听复制, 去掉版权声明
  document.addEventListener("copy", (e) => {
    e.preventDefault();
    const text = document.getSelection()?.toString() || "";
    navigator.clipboard.writeText(text);
  });

  // 存在关注博主即可阅读全文自动展开
  const btnReadmoreZk = document.getElementById('btn-readmore-zk')
  if (btnReadmoreZk){
    // 移除父级元素
    btnReadmoreZk.parentElement?.remove()
    // 移除内容元素样式
    const article_content = document.getElementById('article_content')
    article_content?.removeAttribute('style')
  }
})();
