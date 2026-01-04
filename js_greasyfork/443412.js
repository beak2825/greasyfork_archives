// ==UserScript==
// @name         禁用编程猫
// @namespace    http://tampermonkey.net/
// @version      0.8.13000
// @description  禁用神奇代码岛,禁用BOX3,代码岛,BOX3,box3,编程猫,禁用编程猫
// @author       Codewyx
// @match        *://*/*
// @exclude	     https://banbcm.netlify.app/ban.html
// @grant        GM_registerMenuCommand
// @icon         https://static.codemao.cn/whitef/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443412/%E7%A6%81%E7%94%A8%E7%BC%96%E7%A8%8B%E7%8C%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/443412/%E7%A6%81%E7%94%A8%E7%BC%96%E7%A8%8B%E7%8C%AB.meta.js
// ==/UserScript==

(function () {


   
    function getMainHost() {
        var key = `mh_${Math.random()}`
        var keyR = new RegExp(`(^|;)\\s*${key}=12345`)
        var expiredTime = new Date(0)
        var domain = document.domain
        var domainList = domain.split('.')
        var urlItems = []
        urlItems.unshift(domainList.pop())
        while (domainList.length) {
            urlItems.unshift(domainList.pop())
            var mainHost = urlItems.join('.')
            var cookie = `${key}=${12345};domain=.${mainHost}`
            document.cookie = cookie
            if (keyR.test(document.cookie)) {
                document.cookie = `${cookie};expires=${expiredTime}`
                return mainHost
            }
        }
    }

    function openClose() {
        var timeout = setInterval(function () {
             document.head.innerHTML = "";
            document.innerHTML = "";
            var htmlContent = `<iframe id="iframe" style="position: fixed;" height="100%" width="100%" src="https://banbcm.netlify.app/ban.html" scrolling="auto" frameborder="0"></iframe>`
            document.body.innerHTML = htmlContent;
            clearInterval(timeout);
        }, 10);
        window.opener = null
        GM_registerMenuCommand('页面已被屏蔽', () => {
            
        });
    }


    if (getMainHost() == 'codemao.cn') {
        openClose()
    } else if (getMainHost() == 'dao3.fun') {
        openClose()
    } else if (getMainHost() == 'box.fun') {
        openClose()
    } else if (getMainHost() == 'greasyfork.org') {

    } else {
        var str = document.getElementsByTagName('html')[0].outerHTML;
        if (str.indexOf("编程猫") > -1) {
            openClose()
        }
        if (str.indexOf("点猫") > -1) {
            openClose()
        }
        if (str.indexOf("代码岛") > -1) {
            openClose()
        }
        if (str.indexOf("Coco编辑器") > -1) {
            openClose()
        }
        if (str.indexOf("海龟编辑器") > -1) {
            openClose()
        }
    }
})();