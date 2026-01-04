// ==UserScript==
// @name       			Darwin Conclusion Enhancer
// @namespace  			https://greasyfork.org/zh-CN/users/782923-asea
// @version    			0.1.0
// @description			Add line through style to the issue with conclusion
// @author     			Asea
// @match      			https://darwin.zhenguanyu.com/
// @icon       			https://darwin.zhenguanyu.com/assets/darwin-ico.png
// @grant      			none
// @license    			MIT
// @downloadURL https://update.greasyfork.org/scripts/515141/Darwin%20Conclusion%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/515141/Darwin%20Conclusion%20Enhancer.meta.js
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
    await loadExternalScript('https://static-nginx-test.oss-cn-beijing-internal.aliyuncs.com/solar/solar-tools/tampermonkey-scripts/darwin.js');
  } catch (error) {
    console.error('Failed to initialize:', error);
  }
}
 
init();
 
 
})();