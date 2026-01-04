// ==UserScript==
// @name         爱奇艺海外版字幕自动下载
// @namespace    http://tampermonkey.net/
// @version      0.6.1
// @description  爱奇艺海外版字幕自动下载，自动下载字幕
// @author       XGCM
// @match        https://www.iq.com/play/*
// @icon         https://www.iqiyipic.com/common/images/logo.ico
// @grant        GM_addElement
// @grant        GM_openInTab
// @grant        GM_download
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/432302/%E7%88%B1%E5%A5%87%E8%89%BA%E6%B5%B7%E5%A4%96%E7%89%88%E5%AD%97%E5%B9%95%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/432302/%E7%88%B1%E5%A5%87%E8%89%BA%E6%B5%B7%E5%A4%96%E7%89%88%E5%AD%97%E5%B9%95%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

function download(close=true) {
    // Wait until playObject exists.
    var i = 0;
    var ref = setInterval(function() {
        console.log(i)
        if (
            playerObject !== undefined &&
            playerObject._player.package.engine.adproxy.engine.movieinfo.tvid != undefined &&
            playerObject._player.package.engine.adproxy.engine.episode.EpisodeStore[playerObject._player.package.engine.adproxy.engine.movieinfo.tvid].movieInfo != undefined &&
            playerObject._player.package.engine.adproxy.engine.episode.EpisodeStore[playerObject._player.package.engine.adproxy.engine.movieinfo.tvid].movieInfo.originalData !== undefined) {

            clearInterval(ref);

            var tvid=playerObject._player.package.engine.adproxy.engine.movieinfo.tvid;
            var oData=playerObject._player.package.engine.adproxy.engine.episode.EpisodeStore[tvid].movieInfo.originalData;
            var prefix=oData.data.dstl;
            for(var num = 0; num<oData.data.program.stl.length; num++){
                var subUrl=oData.data.program.stl[num].srt;
                var title=document.getElementsByClassName('intl-play-title')[0].textContent+"_"+oData.data.program.stl[num]._name+".srt";
                GM_download(prefix+subUrl, title);
            }
            if (close) window.close();
        }
    }, 500);
}

(function() {
    'use strict';
    var urlSearchParams = new URLSearchParams(window.location.search);
    var params = Object.fromEntries(urlSearchParams.entries());


    // Add button
    var button = GM_addElement(document.getElementsByClassName('episodes-filter-wrap')[0], 'button', {
        id: 'download-all-subtitles',
    });
    button.innerHTML = '下载字幕！';
    button.onclick = function () {
        var lis = document.getElementsByClassName('intl-episodes-list')[0].getElementsByTagName('li')
        var i = 0;
        var ref = setInterval(function(){
            GM_openInTab(lis[i].getElementsByTagName('a')[0].href+'&download_subtitles=true');
            i++;
            if (i >= lis.length) {
                clearInterval(ref);
            }
        }, 1000);
    }

    // Add download current subtitle button
    var button2 = GM_addElement(document.getElementsByClassName('episodes-filter-wrap')[0], 'button', {
        id: 'download-current-subtitles',
    });
    button2.innerHTML = '下载当前字幕！';
    button2.onclick = function () {
        download(false);
    }
    if (params.download_subtitles) {
        download();
    }
})();