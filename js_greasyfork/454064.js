// ==UserScript==
// @name         清水河畔刮刮卡查询
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在格言左边显示刮刮卡信息
// @author       DARK-FLAME-MASTER FROM RIVERSIDE
// @match        https://bbs.uestc.edu.cn/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_getValue
// @grant        GM_setValue
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/454064/%E6%B8%85%E6%B0%B4%E6%B2%B3%E7%95%94%E5%88%AE%E5%88%AE%E5%8D%A1%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/454064/%E6%B8%85%E6%B0%B4%E6%B2%B3%E7%95%94%E5%88%AE%E5%88%AE%E5%8D%A1%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if(GM_getValue('time','')==''){
        GM_setValue('time',0)
    }
    console.log(GM_getValue('time'))
    let content = document.createElement('span')
    document.querySelector("#chart").append(content)

    function 爷要买刮刮卡() {
        if(document.querySelector("#toptb > div.y > a:nth-child(7)") != null)
        fetch("https://bbs.uestc.edu.cn/home.php?mod=magic")
            .then(data => data.text())
            .then(data => {
                let doc = new DOMParser().parseFromString(data, 'text/html');
                let info = doc.querySelector("#ct > div.mn > div > ul.mtm.mgcl.cl > li:nth-child(1) > p.mtn > span");
                if (info != null){
                    info.style.float = "right"
                    content.innerHTML = info.outerHTML
                } else {
                    let link = document.createElement('a')
                    link.href = "https://bbs.uestc.edu.cn/home.php?mod=magic&action=shop&operation=buy&mid=money"
                    link.text = "购买刮刮卡"
                    link.style.color = "#3085d9"
                    link.style.float = "right"
                    content.innerHTML = link.outerHTML
                    let t = GM_getValue('time')
                    if(new Date().getTime() - t >1000*180)
                    {
                        Notification.requestPermission().then((result) => { if (result === 'granted') { let n = new Notification("刮刮卡补货了！")} })
                        GM_setValue('time',new Date().getTime())
                    }
                }
            });
    }
    爷要买刮刮卡()
    setInterval(爷要买刮刮卡,1000*180)
    // Your code here...
})();