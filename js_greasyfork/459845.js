// ==UserScript==
// @name         BetterXes
// @namespace    https://github.com/wuyuhangxyz/BetterXes
// @version      0.0.1
// @description  优化学而思功能,美化学而思主题
// @author       吴宇航
// @license      GPL-3.0
// @run-at       document-start
// @match        https://code.xueersi.com/*
// @icon         https://code.xueersi.com/static/images/code-home/qrlogo.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459845/BetterXes.user.js
// @updateURL https://update.greasyfork.org/scripts/459845/BetterXes.meta.js
// ==/UserScript==

// 部分代码来源于XesExt,特此鸣谢

function getSourceCode(){
    const href = window.location.href;
    const type = /langType=.+/.exec(href)[0].substring('langType='.length)
    const pid = /pid=[0-9]+/.exec(href)[0].substring('pid='.length)
    let url;
    if (type == "scratch"){
        url = `https://code.xueersi.com/scratch3/index.html?pid=${pid}&version=3.0&from=adapt&env=community`;
    }else{
        url = `https://code.xueersi.com/ide/code/${pid}?from=adapt`;
    }
    return url;
}
(function() {
    'use strict';
    window.addEventListener('load', () => {
        // 修改标题
        document.title = "BetterXes";

        // 源代码
        let adaptBtn = document.getElementsByClassName("adapt");
        adaptBtn = (adaptBtn.length == 1)?adaptBtn:document.getElementsByClassName("not-allow-adopt-con");
        if (adaptBtn.length == 1){
            adaptBtn[0].childNodes[0].className = 'never-adapt';
            adaptBtn[0].replaceWith(adaptBtn[0].cloneNode(true));
            adaptBtn[0].childNodes[1].data = ' 源代码 ';
            adaptBtn[0].addEventListener('click', (ev) => {
            window.open(getSourceCode());
            ev.preventDefault();
          });
        }

        // 去除运行频率限制
        const _setTimeout = window.setTimeout
        window.setTimeout = (code, delay, ...args) => {
          if (code.toString().includes('fnTryLockRun')) {
            code()
            return -1
          }
          return _setTimeout(code, delay, ...args)
        }
    });
})();