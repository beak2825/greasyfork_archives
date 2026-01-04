// ==UserScript==
// @name        Jira 工具
// @namespace   Violentmonkey Scripts
// @match       https://jira.zhenguanyu.com/secure/*
// @match       https://jira.zhenguanyu.com/browse/*
// @grant       none
// @version     1.1.3
// @author      -
// @description 2021/2/9下午3:12:17
// @downloadURL https://update.greasyfork.org/scripts/421582/Jira%20%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/421582/Jira%20%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

;(async function () {
  window.addEventListener('load', async () => {
  const loadScript = (url) => {
    const script = document.createElement('script')
    script.src = url;
    document.head.appendChild(script)

    return new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = reject;
    })
  }
  
  const loadStyle = (url) => {
    const link = document.createElement('link')
    link.href = url;
    link.rel = 'stylesheet';
    document.head.appendChild(link)

    return new Promise((resolve, reject) => {
      link.onload = resolve;
      link.onerror = reject;
    })
  }
  const isDebug = location.search.indexOf('jira-extension-script-debug=true') >= 0;

  const jsUrl = isDebug ? 'http://localhost:8080/index.js' : 'https://unpkg.com/jira-extension-script@latest';
  const cssUrl = isDebug ? 'http://localhost:8080/index.css' : 'https://unpkg.com/jira-extension-script@latest/dist/index.css';
  await Promise.all([
    loadScript(jsUrl),
    loadStyle(cssUrl)
  ]);
  
  const div = document.createElement('div');
  div.id = 'jira-ext';
  document.body.appendChild(div);
  JiraExtensionScript.render(div);
    
    

  JiraExtensionScript.polyfillRender && JiraExtensionScript.polyfillRender();
 })
})()