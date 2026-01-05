// ==UserScript==
// @name              JSON formatter
// @namespace         https://gera2ld.space
// @author            Gerald
// @icon              https://cn.gravatar.com/avatar/a0ad718d86d21262ccd6ff271ece08a3?s=80
// @description       Format JSON data in a beautiful way.
// @description:zh-CN 更加漂亮地显示JSON数据。
// @version           process.env.VERSION
// @require           https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @match             *://*/*
// @match             file:///*
// @grant             GM_addElement
// @grant             GM_registerMenuCommand
// @grant             GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/10718/JSON%20formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/10718/JSON%20formatter.meta.js
// ==/UserScript==

(function () {
'use strict';

const JSON_VIEWER_EMBED = 'https://rally.pore.run/embed';
let iframe;
if (window === window.top && window.location.origin + window.location.pathname === JSON_VIEWER_EMBED) {
  handleViewerAfterRedirection();
} else {
  if (testRules([
  // text/javascript - file:///foo/bar.js
  /^(?:text|application)\/(?:.*?\+)?(?:plain|json|javascript)$/], document.contentType)) handleViewerIframe();
  GM_registerMenuCommand('Format JSON', handleViewerIframe);
}
function testRules(rules, contentType) {
  for (const rule of rules) {
    if (typeof rule === 'string') {
      if (rule === contentType) return true;
    } else if (typeof (rule == null ? void 0 : rule.test) === 'function') {
      if (rule.test(contentType)) return true;
    }
  }
  return false;
}
function handleViewerIframe() {
  if (iframe) return;
  const content = JSON.parse(document.body.textContent);
  document.body.innerHTML = '';
  iframe = GM_addElement(document.body, 'iframe', {
    sandbox: 'allow-scripts allow-same-origin allow-popups',
    src: JSON_VIEWER_EMBED,
    style: `position:fixed;width:100vw;height:100vh;inset:0;border:none`
  });
  let initiated = false;
  const setData = () => {
    initiated = true;
    handleInitData(content, iframe.contentWindow);
  };
  iframe.addEventListener('load', () => {
    setTimeout(() => {
      if (!initiated) {
        // JS blocked, redirect to the embed page
        const url = new URL(JSON_VIEWER_EMBED);
        url.searchParams.set('from', 'userscript');
        url.searchParams.set('json_url', window.location.href);
        window.location.assign(url);
      }
    }, 2000);
  });
  window.addEventListener('message', e => {
    const {
      type
    } = e.data;
    switch (type) {
      case 'ready':
        {
          setData();
          break;
        }
    }
  });
}
async function handleViewerAfterRedirection() {
  const url = new URL(window.location.href);
  if (url.searchParams.get('from') !== 'userscript') return;
  const jsonUrl = url.searchParams.get('json_url');
  const content = await new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      url: jsonUrl,
      responseType: 'json',
      onload: res => {
        resolve(res.response);
      },
      onerror: res => {
        reject(res);
      }
    });
  });
  const setData = () => {
    handleInitData(content, window, jsonUrl);
  };
  window.addEventListener('load', () => {
    setData();
  });
  window.addEventListener('message', e => {
    const {
      type
    } = e.data;
    switch (type) {
      case 'ready':
        {
          setData();
          break;
        }
    }
  });
}
function handleInitData(content, window, jsonUrl) {
  window.postMessage({
    type: 'setReadOnly',
    payload: true
  }, '*');
  window.postMessage({
    type: 'setData',
    payload: content
  }, '*');
  if (jsonUrl) {
    window.postMessage({
      type: 'setBanner',
      payload: {
        html: `JSON URL: <a href="${jsonUrl}">${jsonUrl}</a>`
      }
    });
  }
}

})();
