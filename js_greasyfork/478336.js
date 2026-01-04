// ==UserScript==

// @name               YouTube sort playlists by play time length
// @name:zh-TW         YouTube 以播放時間長度排序播放清單
// @name:zh-CN         YouTube 以播放时间长度排序播放清单
// @name:ja            YouTube でプレイリストを再生時間順に並べ替える
// @description        Sorting playlists by play time length use internal API .
// @description:zh-TW  使用官方API以播放時間長度排序清單
// @description:zh-CN  使用官方API以播放时间长度排序清单
// @description:ja     再生時間の長さによるプレイリストの並べ替えには、内部 API を使用します。
// @copyright          2023, HrJasn (https://greasyfork.org/zh-TW/users/142344-jasn-hr)
// @license            GPL3
// @license Copyright  HrJasn
// @icon               https://www.google.com/s2/favicons?domain=www.youtube.com
// @homepageURL        https://greasyfork.org/zh-TW/users/142344-jasn-hr
// @supportURL         https://greasyfork.org/zh-TW/users/142344-jasn-hr
// @version            1.7
// @namespace          https://greasyfork.org/zh-TW/users/142344-jasn-hr
// @grant              none
// @match              http*://www.youtube.com/*
// @exclude            http*://www.google.com/*

// @downloadURL https://update.greasyfork.org/scripts/478336/YouTube%20sort%20playlists%20by%20play%20time%20length.user.js
// @updateURL https://update.greasyfork.org/scripts/478336/YouTube%20sort%20playlists%20by%20play%20time%20length.meta.js
// ==/UserScript==

(() => {
    console.log("YouTube sort playlists by play time length is loading.");
    let setCookie = (name,value,days) => {
        let expires = "";
        if (days) {
            let date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    };
    let getCookie=(name) =>{
        let nameEQ = name + "=";
        let ca = document.cookie.split(';');
        for(let i=0;i < ca.length;i++) {
            let c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    };
    let eraseCookie=(name) =>{
        document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    };
    if (typeof Array.prototype.equals === "undefined") {
        Array.prototype.equals = function( array ) {
            return this.length == array.length &&
                this.every( function(this_i,i) { return this_i == array[i] } )
        };
    };
    if (typeof Array.prototype.move === "undefined") {
        Array.prototype.move = function(from, to, on = 1) {
            return this.splice(to, 0, ...this.splice(from, on)), this
        };
    };
    let oldLH = '';
    let observerYSPBPTL;
    observerYSPBPTL = new MutationObserver( (mutations) => {
        let ypvlse = null;
        if( (oldLH !== window.location.href) && (ypvlse = document.querySelector('div#icon-label')) ){
            oldLH = window.location.href;
            let gck = JSON.parse(getCookie('CustomSortStatus'));
            let ypvlmtArr = {
                'en':'Play time length',
                'zh-TW':'播放時長',
                'zh-CN':'播放时长',
                'ja': 'プレイ時間'
            };
            let ypvlmt = ypvlmtArr[(navigator.userLanguage || navigator.language || navigator.browserLanguage || navigator.systemLanguage)] || ypvlmtArr.en;
            function searchObj(path, obj, target) {
                for (let k in obj) {
                    if (obj.hasOwnProperty(k)){
                        if(obj[k] === target){
                            return path + "['" + k + "']";
                        } else if (typeof obj[k] === 'object') {
                            let result = searchObj(path + "['" + k + "']", obj[k], target);
                            if (result){
                                return result;
                            };
                        };
                    };
                };
                return false;
            };
            function getObjPathParent(srcPath){
                let tgPath = null;
                if( (srcPath) && (srcPath.replace) ){tgPath = srcPath.replace(/\[[^\[\]]+\]$/,'')};
                return tgPath;
            };
            let getFndPath = getObjPathParent(getObjPathParent(getObjPathParent(searchObj("ytInitialData",ytInitialData,document.querySelector('ytd-playlist-video-list-renderer div#contents ytd-playlist-video-renderer a[href *= "/watch?v="]').href.match(/v=([^\=\&]+)&?/)[1]))));
            let ypvricarr = [];
            let MutationObserverTimerYSPBPTL3;
            let ypvlmevntfn = (evnt) => {
                evnt.preventDefault();
                evnt.stopPropagation();
                evnt.stopImmediatePropagation();
                console.log(evnt);
                getFndPath = getObjPathParent(getObjPathParent(getObjPathParent(searchObj("ytInitialData",ytInitialData,document.querySelector('ytd-playlist-video-list-renderer div#contents ytd-playlist-video-renderer a[href *= "/watch?v="]').href.match(/v=([^\=\&]+)&?/)[1]))));
                ypvricarr = [];
                try{
                    ypvricarr = [...eval('(' + getFndPath + ')')];
                }catch(err){
                    console.log(err);
                };
                if(ypvricarr.length != 0){
                    let ypvrearr = [];
                    let orgetih = evnt.target.innerHTML;
                    if(orgetih == ('　' + ypvlmt + '↑')){
                        ypvrearr = [...ypvricarr].sort((a,b)=>{
                            return parseInt(b.playlistVideoRenderer.lengthSeconds) - parseInt(a.playlistVideoRenderer.lengthSeconds);
                        });
                    } else if( (orgetih == ('　' + ypvlmt + '↓')) || (orgetih == ('　' + ypvlmt + '↑↓')) ){
                        ypvrearr = [...ypvricarr].sort((a,b)=>{
                            return parseInt(a.playlistVideoRenderer.lengthSeconds) - parseInt(b.playlistVideoRenderer.lengthSeconds);
                        });
                    } else {
                        ypvrearr = [...ypvricarr].sort((a,b)=>{
                            return parseInt(a.playlistVideoRenderer.lengthSeconds) - parseInt(b.playlistVideoRenderer.lengthSeconds);
                        });
                        orgetih = ('　' + ypvlmt + '↓');
                        evnt.target.innerHTML = orgetih;
                    };
                    function IsrtSrtSim(carr1,carr2) {
                        let cnt = 0;
                        let mxle = null;
                        let arr1 = [...carr1];
                        let arr2 = [...carr2];
                        while (!arr1.equals(arr2)){
                            mxle = arr2.reduce((a,b)=>{
                                let al = Math.abs(arr2.indexOf(a) - arr1.indexOf(a));
                                let bl = Math.abs(arr2.indexOf(b) - arr1.indexOf(b));
                                return ( al > bl ? a : b );
                            });
                            if(mxle && (arr1.indexOf(mxle) !== arr2.indexOf(mxle))){
                                arr1 = arr1.move(arr1.indexOf(mxle), arr2.indexOf(mxle));
                                cnt++;
                            };
                        };
                        return cnt;
                    };
                    let ttcnts = IsrtSrtSim(ypvricarr,ypvrearr);
                    console.log(ttcnts);
                    orgetih = (orgetih == ('　' + ypvlmt + '↑'))?('　' + ypvlmt + '↓'):('　' + ypvlmt + '↑');
                    if(gck = JSON.parse(getCookie('CustomSortStatus'))){
                        gck.BtnStr = orgetih;
                        setCookie('CustomSortStatus',JSON.stringify(gck),null);
                    } else {
                        setCookie('CustomSortStatus',JSON.stringify({"BtnStr":orgetih}),null);
                    }
                    evnt.target.innerHTML = orgetih;
                    console.log(ypvrearr);
                    if(MutationObserverTimerYSPBPTL3){
                        clearTimeout(MutationObserverTimerYSPBPTL3);
                    };
                    MutationObserverTimerYSPBPTL3 = setTimeout(() => {
                        if(ypvrearr.length != 0){
                            let ot = document.title, ftd = 0.5;
                            async function getSApiSidHash(SAPISID, origin) {
                                function sha1(str) {
                                    return window.crypto.subtle
                                        .digest("SHA-1", new TextEncoder().encode(str))
                                        .then((buf) => {
                                        return Array.prototype.map
                                            .call(new Uint8Array(buf), (x) => ("00" + x.toString(16)).slice(-2))
                                            .join("")
                                    });
                                };
                                const TIMESTAMP_MS = Date.now();
                                const digest = await sha1(`${TIMESTAMP_MS} ${SAPISID} ${origin}`);
                                return `${TIMESTAMP_MS}_${digest}`;
                            };
                            async function fetchYTMoveAPI(actions,playlistId){
                                return fetch("https://www.youtube.com/youtubei/v1/browse/edit_playlist?key=" + ytcfg.data_.INNERTUBE_API_KEY + "&prettyPrint=false", {
                                    "headers": {
                                        "accept": "*/*",
                                        "authorization": "SAPISIDHASH " + await getSApiSidHash(document.cookie.split("SAPISID=")[1].split("; ")[0], window.origin),
                                        "content-type": "application/json"
                                    },
                                    "body": JSON.stringify({
                                        "context": {
                                            "client": {
                                                clientName: "WEB",
                                                clientVersion: ytcfg.data_.INNERTUBE_CLIENT_VERSION
                                            }
                                        },
                                        "actions": actions,
                                        "playlistId": playlistId
                                    }),
                                    "method": "POST"
                                });
                            };
                            async function moveYTItem(evnt,ypvlmt,ypvricarr,ypvrearr,ttcnts,ttcntst,mxle,ytactsjson,startTime,endTime,tdavg){
                                let nsttArr = {
                                    'en' : '　' + ypvlmt + ' ( Remain ' + ttcnts + ' steps . )',
                                    'zh-TW' : '　' + ypvlmt + ' ( 剩餘 ' + ttcnts + ' 步。 )',
                                    'zh-CN' : '　' + ypvlmt + ' ( 剩余 ' + ttcnts + ' 步。 )',
                                    'ja' : '　' + ypvlmt + ' ( 残る ' + ttcnts + ' ステップ。 )',
                                };
                                let nstt = nsttArr[(navigator.userLanguage || navigator.language || navigator.browserLanguage || navigator.systemLanguage)] || ypvlmtArr.en;
                                evnt.target.innerHTML = nstt;
                                document.title = ot + nstt;
                                console.log('Fetching: ',mxle);
                                console.log('Move ' + ypvricarr.indexOf(mxle) + ' to ' + ypvrearr.indexOf(mxle));
                                try {
                                    await fetchYTMoveAPI(ytactsjson,oldLH.match(/\?list=([^=&\?]+)&?/)[1]);
                                    ypvricarr = ypvricarr.move(ypvricarr.indexOf(mxle), ypvrearr.indexOf(mxle));
                                    ttcnts--;
                                } catch (err) {
                                    console.error(err.message);
                                };
                                endTime = new Date();
                                let timeDiff = endTime - startTime;
                                tdavg = (tdavg + (timeDiff/1000)) / 2;
                                tdavg = Math.round(tdavg*10)/10;
                                evnt.target.style.transition = 'all ' + tdavg + 's';
                                evnt.target.style.boxShadow = 'inset -' + evnt.target.offsetWidth*(ttcnts/ttcntst) + 'px 0px rgba(255, 255, 255, 0.2)';
                                startTime = endTime;
                                return {"evnt" : evnt ,
                                        "ypvlmt" : ypvlmt ,
                                        "ypvricarr" : ypvricarr ,
                                        "ypvrearr" : ypvrearr ,
                                        "ttcnts" : ttcnts ,
                                        "ttcntst" : ttcntst ,
                                        "mxle" : mxle ,
                                        "ytactsjson" : ytactsjson ,
                                        "startTime" : startTime ,
                                        "endTime" : endTime ,
                                        "tdavg" : tdavg};
                            };
                            async function getPosts(){
                                let reg = /\<meta name="description" content\=\"(.+?)\"/;
                                let ttcntst = ttcnts;
                                let startTime = new Date(), endTime, tdavg = ftd;
                                if(ttcntst < ypvrearr.length){
                                    while (!ypvricarr.equals(ypvrearr)){
                                        let mxle = null;
                                        mxle = ypvrearr.reduce((a,b)=>{
                                            let al = Math.abs(ypvrearr.indexOf(a) - ypvricarr.indexOf(a));
                                            let bl = Math.abs(ypvrearr.indexOf(b) - ypvricarr.indexOf(b));
                                            return ( al > bl ? a : b );
                                        });
                                        if(mxle && (ypvricarr.indexOf(mxle) !== ypvrearr.indexOf(mxle))){
                                            let ytactsjson;
                                            if(ypvricarr.indexOf(mxle) < ypvrearr.indexOf(mxle)){
                                                ytactsjson = [{
                                                    "action": "ACTION_MOVE_VIDEO_AFTER",
                                                    "setVideoId": mxle.playlistVideoRenderer.setVideoId,
                                                    "movedSetVideoIdPredecessor": ypvricarr[ypvrearr.indexOf(mxle)].playlistVideoRenderer.setVideoId
                                                }];
                                            } else if (ypvrearr.indexOf(mxle) === 0) {
                                                ytactsjson = [{
                                                    "action": "ACTION_MOVE_VIDEO_AFTER",
                                                    "setVideoId": mxle.playlistVideoRenderer.setVideoId
                                                }];
                                            } else {
                                                ytactsjson = [{
                                                    "action": "ACTION_MOVE_VIDEO_AFTER",
                                                    "setVideoId": mxle.playlistVideoRenderer.setVideoId,
                                                    "movedSetVideoIdPredecessor": ypvricarr[ypvrearr.indexOf(mxle)-1].playlistVideoRenderer.setVideoId
                                                }];
                                            };
                                            let mytird = await moveYTItem(evnt,ypvlmt,ypvricarr,ypvrearr,ttcnts,ttcntst,mxle,ytactsjson,startTime,endTime,tdavg);
                                            evnt = mytird.evnt;
                                            ypvlmt = mytird.ypvlmt;
                                            ypvricarr = mytird.ypvricarr;
                                            ypvrearr = mytird.ypvrearr;
                                            ttcnts = mytird.ttcnts;
                                            ttcntst = mytird.ttcntst;
                                            mxle = mytird.mxle;
                                            ytactsjson = mytird.ytactsjson;
                                            startTime = mytird.startTime;
                                            endTime = mytird.endTime;
                                            tdavg = mytird.tdavg;
                                            ypvricarr = ypvricarr.move(ypvricarr.indexOf(mxle), ypvrearr.indexOf(mxle));
                                        };
                                    };
                                } else {
                                    ttcnts = ypvrearr.length - 1;
                                    ttcntst = ttcnts;
                                    for(let ypvrei=0;ypvrei<ypvrearr.length;ypvrei++){
                                        let mxle = ypvrearr[ypvrearr.length - ypvrei - 1];
                                        let ytactsjson = [{
                                            "action": "ACTION_MOVE_VIDEO_AFTER",
                                            "setVideoId": mxle.playlistVideoRenderer.setVideoId
                                        }];
                                        let nsttArr = {
                                            'en' : '　' + ypvlmt + ' ( Remain ' + ttcnts + ' steps . )',
                                            'zh-TW' : '　' + ypvlmt + ' ( 剩餘 ' + ttcnts + ' 步。 )',
                                            'zh-CN' : '　' + ypvlmt + ' ( 剩余 ' + ttcnts + ' 步。 )',
                                            'ja' : '　' + ypvlmt + ' ( 残る ' + ttcnts + ' ステップ。 )',
                                        };let mytird = await moveYTItem(evnt,ypvlmt,ypvricarr,ypvrearr,ttcnts,ttcntst,mxle,ytactsjson,startTime,endTime,tdavg);
                                        evnt = mytird.evnt;
                                        ypvlmt = mytird.ypvlmt;
                                        ypvricarr = mytird.ypvricarr;
                                        ypvrearr = mytird.ypvrearr;
                                        ttcnts = mytird.ttcnts;
                                        ttcntst = mytird.ttcntst;
                                        mxle = mytird.mxle;
                                        ytactsjson = mytird.ytactsjson;
                                        startTime = mytird.startTime;
                                        endTime = mytird.endTime;
                                        tdavg = mytird.tdavg;
                                        ypvricarr = ypvricarr.move(ypvricarr.indexOf(mxle), ypvrearr.indexOf(mxle));
                                    };
                                };
                            };
                            if(!ypvricarr.equals(ypvrearr)){
                                evnt.target.style.transition = 'all ' + ftd + 's';
                                getPosts().then(()=>{
                                    document.title = ot;
                                    evnt.target.innerHTML = orgetih;
                                    evnt.target.style = '';
                                    console.log('Done. ');
                                    window.location.href = window.location.href;
                                });
                            };
                        };
                    },1000);
                } else {
                    if(gck = JSON.parse(getCookie('CustomSortStatus'))){
                        gck.LastAct = 'Sorting';
                        setCookie('CustomSortStatus',JSON.stringify(gck),null);
                    } else {
                        setCookie('CustomSortStatus',JSON.stringify({'LastAct':'Sorting'}),null);
                    };
                    window.location.href = window.location.href;
                };
            };
            let ypvlmes = [[...ypvlse.parentNode.children].find(cn => cn.innerText.match(ypvlmt))];
            console.log(ypvlmes);
            if( (ypvlmes) && (ypvlmes.length !== 0) ){
                ypvlmes.forEach((ypvlme)=>{
                    if(ypvlme){
                        ypvlme.removeEventListener('click',ypvlmevntfn);
                        ypvlme.remove();
                    };
                });
            };
            let yvlmen = '';
            if( !(gck = JSON.parse(getCookie('CustomSortStatus'))) ){
                yvlmen = ypvlmt + '↑↓';
            } else {
                yvlmen = gck.BtnStr;
            };
            let ypvlme = ypvlse.cloneNode(true);
            ypvlme.innerHTML = yvlmen;
            ypvlse.parentNode.insertBefore(ypvlme,ypvlse.nextSibling);
            ypvlme.addEventListener('click',ypvlmevntfn);
            if(gck = JSON.parse(getCookie('CustomSortStatus'))){
                if(gck.LastAct == 'Sorting'){
                    gck.LastAct = 'Nothing';
                    setCookie('CustomSortStatus',JSON.stringify(gck),null);
                    //ypvlme.click();
                };
            } else {
                setCookie('CustomSortStatus',JSON.stringify({'LastAct':'Nothing'}),null);
            };
            try{
                ypvricarr = [...eval('(' + getFndPath + ')')];
            }catch(err){
                let nfrstrArr = {
                    'en':'click to fresh page one time.',
                    'zh-TW':'按下以重新整理一次',
                    'zh-CN':'按下以重新整理一次',
                    'ja': '押してページを 1 回更新します'
                };
                let nfrst = nfrstrArr[(navigator.userLanguage || navigator.language || navigator.browserLanguage || navigator.systemLanguage)] || nfrstrArr.en;
                ypvlme.innerHTML = ('　' + ypvlmt + ' ( ' + nfrst +' ) ');
                console.log(err);
            };
            console.log("YouTube sort playlists by play time length is loaded.");
        };
    });
    observerYSPBPTL.observe(document, {attributes:true, childList:true, subtree:true});
})();
