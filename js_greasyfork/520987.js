// ==UserScript==
// @name         质量部脚本
// @namespace    http://tampermonkey.net/
// @version      202601150
// @description  Bug分析脚本
// @author       You
// @match        http://*/zentao/*.html
// @match        http://*/pages/viewpage.action?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=akuvox.local
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/520987/%E8%B4%A8%E9%87%8F%E9%83%A8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/520987/%E8%B4%A8%E9%87%8F%E9%83%A8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(window.location.href.includes('bug-view-')){
        // bug分析
        loadScript('http://192.168.10.51:51084/bug-analyze.js');
    }
     if(window.location.href.includes('/pages/viewpage.action?')){
        // 辅助用例评审
        loadScript('http://192.168.10.51:51084/testCase.js');
    }
    if(window.location.href.includes('pageId=103860886')){
        loadScript('http://192.168.10.51:51084/bug-case.js');
    }
    if(window.location.href.includes('/testcase-browse')||window.location.href.includes('/testcase-view-')){
        // 用例评审修改
        loadScript('http://192.168.10.51:51084/useCase.js');
    }
    if(window.location.href.includes('/bug-create-')){
         caseAdjust()
    }
    if(window.location.href.includes('/bug-view-')||window.location.href.includes('bug-browse-')||window.location.href.includes('project-bug-')){
        loadScript('http://192.168.10.51:51084/bug-review.js')
    }
    if(window.location.href.includes('testcase-view')||window.location.href.includes('testcase-view')){
        loadScript('http://192.168.10.51:51084/test-case-reason.js');
    }

})();

function loadScript(url) {
    const script = document.createElement('script');
    script.src = url;
    script.type = 'text/javascript';
    script.async = true;
    document.head.appendChild(script);
}

function caseAdjust(){
    const iframe = document.querySelector('.ke-edit-iframe').contentWindow.document;
    const content = iframe.querySelector('.article-content');

    if(!content.innerHTML.includes('5、用例ID(无或者用例ID):')){
        content.innerHTML += `
          <p><strong>5、用例ID(无或者用例ID):</strong></p>
          <p><strong>6、是否需要整改用例(是/否):</strong></p>
          <p><strong>7、是否已经完成用例整改(是/否):</strong></p>
    `;
    }
}





