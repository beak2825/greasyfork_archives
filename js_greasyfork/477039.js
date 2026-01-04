// ==UserScript==
// @name         jellyfin调用弹弹play
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  jellyfin launch 弹弹play
// @description:zh-cn jellyfin调用弹弹play
// @license      MIT
// @author       @tuip123
// @include      */web/index.html
// @downloadURL https://update.greasyfork.org/scripts/477039/jellyfin%E8%B0%83%E7%94%A8%E5%BC%B9%E5%BC%B9play.user.js
// @updateURL https://update.greasyfork.org/scripts/477039/jellyfin%E8%B0%83%E7%94%A8%E5%BC%B9%E5%BC%B9play.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let GLOBAL_INIT = true
    function init() {
        GLOBAL_INIT = false
        let player = document.querySelectorAll("div#itemDetailPage:not(.hide) #embyDandanplay")[0];
        if (!player) {
            let mainDetailButtons = document.querySelectorAll("div#itemDetailPage:not(.hide) .mainDetailButtons .detailButton[title='播放']")[0];
            if (mainDetailButtons) {
                // <button id="embyDandanplay" type="button" class="button-flat btnPlay detailButton emby-button" title="弹弹play - 串流播放"> <div class="detailButton-content"> <span>弹弹play</span> </div> </button>

                let buttonhtml = `
                <button id="embyDandanplay" type="button" class="button-flat btnPlay detailButton emby-button" title="弹弹play - 串流播放"> <div class="detailButton-content"> <span class="material-icons detailButton-icon icon-ddplay">　</span> </div> </button>
                `
                mainDetailButtons.insertAdjacentHTML('afterend', buttonhtml)
                document.querySelector("div#itemDetailPage:not(.hide) #embyDandanplay").onclick = embyDandanplay;
                document.querySelector("div#itemDetailPage:not(.hide) .icon-ddplay").style.cssText += 'background: url(https://www.dandanplay.com/favicon.ico)no-repeat;background-size: 100% 100%';
            }
        }
    }

    async function getItemInfo() {
        let userId = ApiClient._serverInfo.UserId;
        let itemId = /\?id=(\w*)/.exec(window.location.hash)[1];
        let response = await ApiClient.getItem(userId, itemId);
        //继续播放当前剧集的下一集
        if (response.Type == "Series") {
            let seriesNextUpItems = await ApiClient.getNextUpEpisodes({ SeriesId: itemId, UserId: userId });
            console.log("nextUpItemId: " + seriesNextUpItems.Items[0].Id);
            return await ApiClient.getItem(userId, seriesNextUpItems.Items[0].Id);
        }
        //播放当前季season的第一集
        if (response.Type == "Season") {
            let seasonItems = await ApiClient.getItems(userId, { parentId: itemId });
            console.log("seasonItemId: " + seasonItems.Items[0].Id);
            return await ApiClient.getItem(userId, seasonItems.Items[0].Id);
        }
        //播放当前集或电影
        console.log("itemId:  " + itemId);
        return response;
    }

    async function getIntent(mediaSource, position) {
        let title = mediaSource.Path.split('/').pop();
        let externalSubs = mediaSource.MediaStreams.filter(m => m.IsExternal == true);
        let subs = ''; //要求是android.net.uri[] ?
        let subs_name = '';
        let subs_filename = '';
        let subs_enable = '';
        if (externalSubs) {
            subs_name = externalSubs.map(s => s.DisplayTitle);
            subs_filename = externalSubs.map(s => s.Path.split('/').pop());
        }
        return {
            title: title,
            position: position,
            subs: subs,
            subs_name: subs_name,
            subs_filename: subs_filename,
            subs_enable: subs_enable
        };
    }

    async function getEmbyMediaInfo() {
        let itemInfo = await getItemInfo();
        let mediaSourceId = itemInfo.MediaSources[0].Id;
        let selectSource = document.querySelector("select[is='emby-select']:not(.hide).selectSource");
        if (selectSource && selectSource.value.length > 0) {
            mediaSourceId = selectSource.value;
        }
        //let selectAudio = document.querySelector("select[is='emby-select']:not(.hide).selectAudio");
        let mediaSource = itemInfo.MediaSources.find(m => m.Id == mediaSourceId);
        let domain = `${ApiClient._serverAddress}/emby/videos/${itemInfo.Id}`;
        let streamUrl = `${domain}/stream.${mediaSource.Container}?api_key=${ApiClient.accessToken()}&Static=true&MediaSourceId=${mediaSourceId}`;
        let position = parseInt(itemInfo.UserData.PlaybackPositionTicks / 10000);
        let intent = await getIntent(mediaSource, position);
        console.log(streamUrl, intent);
        return {
            streamUrl: streamUrl,
            intent: intent,
        }
    }

    async function embyDandanplay() {
        let {streamUrl,intent} = await getEmbyMediaInfo()
        let file = intent.title
        var urlPart = streamUrl;
        if (file) {
            urlPart += `|filePath=${file}`;
        }
        let ddplayUrl = `ddplay:${encodeURIComponent(urlPart)}`;
        location.href = ddplayUrl;
    }

    let nIntervId = null;
    function main(){
        if (GLOBAL_INIT && !document.querySelector("div#itemDetailPage:not(.hide) #embyDandanplay")){
            init()
        }
        else{
            clearInterval(nIntervId)
            nIntervId = null
        }

    }
    nIntervId = setInterval(main,1000);

    document.addEventListener("viewbeforeshow", function (e) {
        GLOBAL_INIT = true
        if (nIntervId == null){
            nIntervId = setInterval(main,1000);
        }
    });
})();