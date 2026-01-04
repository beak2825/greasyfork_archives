// ==UserScript==
// @name         小程序体验码生成
// @namespace    medivh
// @version      0.3
// @description  使用pageId生成对应的小程序体验码
// @author       You
// @match        http://ling-test.jd.com/atom_v2/h5/app/*
// @match        https://ling.jd.com/atom_v2/h5/app/*
// @match        http://tls-pre.jd.com/minishop/h5/minishop/*
// @match        https://tls.jd.com/minishop/h5/minishop/*
// @match        https://jshopx.jd.com/minishop/h5/minishop/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426140/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E4%BD%93%E9%AA%8C%E7%A0%81%E7%94%9F%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/426140/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E4%BD%93%E9%AA%8C%E7%A0%81%E7%94%9F%E6%88%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
  function getQueryVariable(variable){
       if (variable === 'pathId') {
          const pathNameArr = window.location.pathname.split('/')
          return pathNameArr[pathNameArr.length -1]
       }
       const query = window.location.search.substring(1);
       const vars = query.split("&");
       for (let i=0;i<vars.length;i++) {
               const pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}
 function run () {
     const container = document.querySelector('.app_container')
     const pageId = getQueryVariable('pathId')
     const appId = window.location.href.includes('/atom_v2/h5/app/') ? 'wxdefc7950d76a40bd' : 'wx5ccdbece47b04474'
     const parmers = encodeURIComponent(`appid=${appId}&path=pages%2Findex%2Findex.html%3FpageId%3D${pageId}%26isPreview%3D1#wechat-redirect`)
     const qrcodeUrl = encodeURIComponent(`https://open.weixin.qq.com/sns/getexpappinfo?${parmers}`)
     const qrCodeDom = document.createElement('iframe')
     qrCodeDom.src = `https://cli.im/api/qrcode/code?text=${qrcodeUrl}`
     qrCodeDom.style.cssText=`
        position: fixed;
        top: 50%;
        right: 200px;
        transform: translateY(-50%);`
     qrCodeDom.width = 500
     qrCodeDom.height = 500
     container.appendChild(qrCodeDom)
     const showBtnDom = document.getElementById('plugin-make-qrcode-btn')
     showBtnDom.innerText='关闭弹窗'
     showBtnDom.onclick=() => {
       container.removeChild(qrCodeDom)
       showBtnDom.innerText = '生成体验码'
       showBtnDom.onclick = run
     }
 }
 setTimeout(() => {
     const mainDom = document.querySelector('.app_container')
 const showBtn = document.createElement('div')
 showBtn.innerText = '生成体验码'
     showBtn.id='plugin-make-qrcode-btn'
     showBtn.style.cssText = `position: fixed;
    top: 20px;
    right: 40%;
    height: 32px;
    line-height: 32px;
    background: #2d68ff;
    padding: 0 10px;
    color: #fff;
    border-radius: 30px;
    cursor: pointer;
    z-index: 2;`
 showBtn.onclick = run
 mainDom.appendChild(showBtn)
 }, 2000)
})();