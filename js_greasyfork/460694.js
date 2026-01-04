// ==UserScript==
// @name         东北林业大学自动健康打卡
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  自动打卡
// @author       朱义奇
// @match       *://dlyx.nefu.edu.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/460694/%E4%B8%9C%E5%8C%97%E6%9E%97%E4%B8%9A%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E5%81%A5%E5%BA%B7%E6%89%93%E5%8D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/460694/%E4%B8%9C%E5%8C%97%E6%9E%97%E4%B8%9A%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E5%81%A5%E5%BA%B7%E6%89%93%E5%8D%A1.meta.js
// ==/UserScript==






function zyq() {
    let casess = document.getElementsByClassName("mint-field-core")[2];
    casess.value = '36.7'
    var event = document.createEvent('HTMLEvents');
    event.initEvent("input", true, true);
    event.eventType = 'message';
    casess.dispatchEvent(event);

    setTimeout(() => { document.getElementsByClassName("mint-cell-mask")[1].click(); }, 500);
        setTimeout(() => { document.getElementsByClassName("mint-radiobox-row")[1].click(); }, 1000);
        setTimeout(() => { document.getElementsByClassName("mint-cell-mask")[2].click(); }, 1500);
        setTimeout(() => { document.getElementsByClassName("mint-radiobox-row")[2].click(); }, 2000);
        setTimeout(() => { document.getElementsByClassName("mint-cell-mask")[3].click(); }, 2500);
        setTimeout(() => { document.getElementsByClassName("mint-cell-mask")[17].click(); }, 3000);
        setTimeout(() => { document.getElementsByClassName("mint-cell-mask")[11].click(); }, 3500);
        setTimeout(() => { document.getElementsByClassName("mint-cell-text")[19].click(); }, 4000);
}



setTimeout(()=>{zyq();},3000);