// ==UserScript==
// @name         Unlock feishu doc copy
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  https://gist.github.com/mosby-zhou/e9ecdf19043f8baaed06268b7cc3ad73
// @author       Mosby
// @match        https://*.feishu.cn/*
// @match        https://*.larkoffice.com/*
// @match        https://*.larksuite.com/*
// @icon         <$ICON$>
// @license MIT
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_webRequest
// @grant        GM_addElement
// @webRequest    [{"selector": "*://**/*docx_app_spa**.js", "action": "cancel"}]
// @downloadURL https://update.greasyfork.org/scripts/483064/Unlock%20feishu%20doc%20copy.user.js
// @updateURL https://update.greasyfork.org/scripts/483064/Unlock%20feishu%20doc%20copy.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // @webRequest    [{"selector": "*://**/*clipboard_module_es6**.js", "action": "cancel"},{"selector": "*://**/*docx_app_spa**.js", "action": "cancel"}]
  GM_webRequest(GM_info.script.webRequest, async function (info, message, details) {
    console.log(info, message, details);
    if (details.url.includes('docx_app_spa.') && !window.has_docx_app_spa) {
      window.has_docx_app_spa = true;
      const resp = await GM.xmlHttpRequest({ url: details.url });
      let str = resp.responseText;
      str = str.replace('||o.copyable', '|| o.copyable || true');
      const scriptEle = document.createElement('script');
      scriptEle.innerHTML = str;

      const blob = new Blob([str], { type: 'text/plain' });
      const objectURL = URL.createObjectURL(blob);

      GM_addElement('script', {
        src: objectURL,
        type: 'text/javascript',
      });

      console.log('append docx_app_spa success');
    }
  });

  try {
    document.head.__appendChild = document.head.appendChild;
  } catch (e) {
    console.error('Can not get document.head.appendChild', e);
    debugger;
  }
  document.head.appendChild = (...args) => {
    window.warnList = window.warnList || [];
    const link = args[0];
    if (link.nodeName === 'SCRIPT') {
      window.warnList.push(link.src);
    }

    if (link.nodeName === 'SCRIPT' && link.src.includes('clipboard_module_es6.')) {
      (async () => {
        console.dir('clipboard_module_es6', link);
        const source = await fetch(link.src);
        let str = await source.text();
        str = str.replace('shouldHandleCopy(e){', 'shouldHandleCopy(e) { return true;');

        const blob = new Blob([str], { type: 'text/plain' });
        const objectURL = URL.createObjectURL(blob);

        link.src = objectURL;

        document.head.__appendChild(link);
        console.log('append clipboard_module_es6 success');
      })();
      return;
    }

    return document.head.__appendChild(...args);
  };
})();
