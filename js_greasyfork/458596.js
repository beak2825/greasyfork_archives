// ==UserScript==
// @name                GitHub 在线预览代码插件
// @namespace           https://github.com/k1995/github-i18n-plugin/
// @version             0.0.2
// @description:zh      GitHub在线预览
// @description:zh-cn   GitHub在线预览
// @description:en "GitHub Onlion View"
// @author              JHC000abc@gmail.com
// @match               https://github.com/*
// @match               https://gist.github.com/*
// @grant               none
// @license MIT
// @description GitHub在线预览
// @downloadURL https://update.greasyfork.org/scripts/458596/GitHub%20%E5%9C%A8%E7%BA%BF%E9%A2%84%E8%A7%88%E4%BB%A3%E7%A0%81%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/458596/GitHub%20%E5%9C%A8%E7%BA%BF%E9%A2%84%E8%A7%88%E4%BB%A3%E7%A0%81%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll('#repository-container-header').forEach(element => {

      let btn = document.createElement('button')
      btn.innerText = '一键在线预览代码'
      element.after(btn)
        btn.style.width = '150px'
        btn.style.height = '40px'
        btn.style.backgroundColor = 'red'
        btn.style.borderRadius = '8px'

      btn.addEventListener('click',(e)=>{
          var url = window.location.pathname
          window.open("https://gitpod.io/#/github.com"+url)

      })

    });

})();