// ==UserScript==
// @name         AcfunBlockerAnnoucement
// @namespace    acfun.cn
// @version      0.939
// @description  AcfunBlocker的公告和信息
// @author       You
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/384697/AcfunBlockerAnnoucement.user.js
// @updateURL https://update.greasyfork.org/scripts/384697/AcfunBlockerAnnoucement.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let text=`
<div style='margin: 3px; font-size: 16px'>
<p>最近带孩子，婴儿难养啊。等我两周内更新。大家不要急着卸载哟。</p>
</div>
`;

let p = /(\d+\.\d+)/;
/* let v = $("#banana_contain").prev().text().match(p)[0];
v=parseFloat(v);
    if (v<=1.504){
        localStorage.setItem('updateinfo', '1');
        A.emit("global::success","A站主页变更了，1.505以下版本屏蔽插件必要更新。")
    } */
    

    if (window.announcementDone) return;
window.announcementDone=true;
    


    let info={
       cloudServer: 16731600,
       articleId: 10406983,
    }
    setTimeout(()=>{

document.getElementById('announcement').innerHTML =(text);



        var d = localStorage.getItem('acblockannounce1');
        if (d!=='1'){
        localStorage.setItem('acblockannounce1', '1');
         A.emit("global::success","插件公告已更新！！");
       }
    }, 5000)
    return info;
})();