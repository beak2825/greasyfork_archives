// ==UserScript==
// @name         math-leave-data
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @license      MIT
// @description  汇总调休数据
// @author       hjl
// @match        https://pc.newland.com.cn/appPortal/kaoqin/home/myteamkq/my_tearm_card_detailList
// @icon         https://www.google.com/s2/favicons?sz=64&domain=newland.com.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513943/math-leave-data.user.js
// @updateURL https://update.greasyfork.org/scripts/513943/math-leave-data.meta.js
// ==/UserScript==


const xlsx ='https://xyfali.postar.cn/postar-st/web/xlsx.full.min.js'


function createScript (url,onLoad){
    var script = document.createElement('script');
    script.src = url;
    if(onLoad){
        script.onload=onLoad
    }
    return script
}


document.body.appendChild(createScript(xlsx))
window.onload = function () {
    document.body.appendChild(createScript(`https://xyfali.postar.cn/risk-message/leave-calculation.js?time=${new Date().getTime()}`))
}

