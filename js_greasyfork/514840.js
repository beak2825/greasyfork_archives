// ==UserScript==
// @name       			Octopus Export
// @namespace  			https://greasyfork.org/zh-CN/users/782923-asea
// @version    			0.1.0
// @description			You can export single values of the dashboard.
// @author     			Asea
// @match      			https://octopus.zhenguanyu.com
// @icon       			https://conan-online.fbcontent.cn/conan-operation-resource/6k0jwunu3mb3vgukvi.png
// @grant      			none
// @license    			MIT
// @downloadURL https://update.greasyfork.org/scripts/514840/Octopus%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/514840/Octopus%20Export.meta.js
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
    await loadExternalScript('https://static-nginx-test.oss-cn-beijing-internal.aliyuncs.com/solar/solar-tools/tampermonkey-scripts/octopus.js');
  } catch (error) {
    console.error('Failed to initialize:', error);
  }
}

init();


})();
