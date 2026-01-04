// ==UserScript==
// @name       			Jira Epic Display
// @namespace  			https://greasyfork.org/zh-CN/users/782923-asea
// @version    			0.1.0
// @description			Jira Extension Tools
// @author     			Asea
// @match      			https://jira.zhenguanyu.com/secure/RapidBoard.jspa*
// @icon       			https://jira.zhenguanyu.com/s/u5yasc/9120012/19gxtx8/_/images/fav-jsw.png
// @grant      			none
// @license    			MIT
// @downloadURL https://update.greasyfork.org/scripts/514651/Jira%20Epic%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/514651/Jira%20Epic%20Display.meta.js
// ==/UserScript==

(function () {
  function loadExternalScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
    document.head.appendChild(script);
  });
}

// 等待文档加载完成
const documentReady = () => {
  return new Promise((resolve) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => resolve());
    } else {
      resolve();
    }
  });
};


// 初始化函数
async function init() {
  try {
    await documentReady();
    await loadExternalScript('https://static-nginx-test.oss-cn-beijing-internal.aliyuncs.com/solar/solar-tools/tampermonkey-scripts/jira.js');
  } catch (error) {
    console.error('Failed to initialize:', error);
  }
}

init();


})();
