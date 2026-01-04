// ==UserScript==
// @name         qtfm-download
// @namespace    https://greasyfork.org/zh-CN/users/135090
// @version      0.8
// @author       zwb83925462
// @match        https://m.qtfm.cn/*vchannels/*/programs/*
// @match        https://www.qtfm.cn/channels/*/programs/*/
// @match        https://www.qingting.fm/channels/*/programs/*/
// @icon         https://www.qingting.fm/favicon.ico
// @grant        none
// @run-at       document-end
// @description  蜻蜓FM-节目下载
// @license      CC
// @downloadURL https://update.greasyfork.org/scripts/438472/qtfm-download.user.js
// @updateURL https://update.greasyfork.org/scripts/438472/qtfm-download.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){
        let qtapi=null;
        let qtcn=location.pathname.indexOf("channels");
        if (location.hostname.includes("qingting.fm")) {
            qtapi="https://webapi.qingting.fm/api/mobile/"+location.pathname.substring(qtcn);
        } else if (location.hostname.includes("qtfm.cn")) {
            qtapi="https://webapi.qtfm.cn/api/mobile/"+location.pathname.substring(qtcn);
        }
        fetch(qtapi).then(res=>{return res.text()}).then(txt=>{return JSON.parse(txt)?.programInfo})
            .then(pinfo=>{
                console.log(pinfo);
                let au=pinfo?.audioUrl;
                let ahref=null;
                if (pinfo?.saleStatus == "free" ){
                    ahref=au;
                    let avd=document.createElement('video');
                    avd.style.width="800px";
                    avd.style.height="auto";
                    avd.style.position="fixed";
                    avd.style.top="450px";
                    avd.style.left="2px";
                    avd.src=ahref;
                    avd.setAttribute('controls','');
                    avd.controlslist="noremoteplayback";
                    document.body.append(avd);
                } else {
                    ahref=au?.length > 0 ? au : "#";
                }
                let aqt=document.createElement("a");
                aqt.style.position="fixed";
                aqt.style.top="250px";
                aqt.style.left="2px";
                aqt.href=ahref;
                aqt.download=pinfo?.title+".m4a";
                aqt.value=pinfo?.title;
                aqt.textContent=pinfo?.saleStatus == "free" ? pinfo?.title : "收费音频,无法下载";
                document.body.append(aqt);
                /*
                {
                    let atk="&access_token="+JSON.parse(localStorage.accessToken)?.value;
                    atk += "&"+document.cookie.substring(document.cookie.indexOf('qingting'),document.cookie.indexOf('Hm_lpvt')-2);
                    ahref=au+atk;
                }
                */
                console.log(ahref);
            });
    },500);
})();