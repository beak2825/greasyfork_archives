// ==UserScript==
// @name         终端软件部脚本
// @namespace    http://tampermonkey.net/
// @version      20251219
// @description  script
// @author       You
// @match        http://*/zentao/bug-view-*.html
// @match        http://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=akuvox.local
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/535844/%E7%BB%88%E7%AB%AF%E8%BD%AF%E4%BB%B6%E9%83%A8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/535844/%E7%BB%88%E7%AB%AF%E8%BD%AF%E4%BB%B6%E9%83%A8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
     const username = document?.getElementById?.('userMenu')?.querySelector('a')?.textContent?.trim?.()
    const title = document?.querySelector?.('#user-menu-link')?.getAttribute?.('title')

    if(window.location.href.includes('know.xm.akubela.local')||window.location.href.includes('192.168.13.7')||window.location.href.includes('work.xm.akubela.local')||window.location.href.includes('192.168.13.6')){
        // bug分析
        loadScript('http://192.168.10.51:51084/version-check.js ');
        if(username==='王居辉'){
            loadScript('http://192.168.10.51:51084/word-export.js');
        }
    }
    if(window.location.href.includes('pageId=111371922')||window.location.href.includes('pageId=111371583')){
        loadScript('http://192.168.10.51:51084/cloud-mqtt.js');
    }
    if(window.location.href.includes('/zentao/my/')||window.location.href.includes('/zentao/my/')){
        loadScript('http://192.168.10.51:51084/test-list-ignored.js');
    }
    if(window.location.href.includes('bug-view-')&&username==='王居辉'){
        loadScript('http://192.168.10.51:51084/zentao-bug-review.js');
    }
 if(window.location.href.includes('testtask-create-')||window.location.href.includes('testtask-create-')){
        loadScript('http://192.168.10.51:51084/testcase-review.js');
    }
loadScript('http://192.168.10.51:51084/all-script.js')
    if(window.location.href.includes('pages/viewpage.action')){
        thRemove()
    }
})();

function loadScript(url) {
    const script = document.createElement('script');
    script.src = url;
    script.type = 'text/javascript';
    script.async = true;
    document.head.appendChild(script);
}

function thRemove(){
    let i
    const t = setInterval(()=>{
        const list = document.querySelectorAll('th')
        list.forEach(item=>{
            item.style = "user-select: unset !important;"
        })

        i++
        if(i>16){
            clearInterval(t)
        }

    },1000)
    }







