// ==UserScript==
// @name         jellyfinLaunchPotplayerHideButton
// @name:en      jellyfinLaunchPotplayerHideButton
// @name:zh      jellyfinLaunchPotplayerHideButton
// @name:zh-CN   jellyfinLaunchPotplayerHideButton
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description jellyfin launch external player hide play button
// @description:en  jellyfin launch external player hide play button
// @description:zh-cn   jellyfin调用外部播放器，隐藏多余的播放按钮
// @license      MIT
// @author       @Myisking
// @include      */web/index.html
// @downloadURL https://update.greasyfork.org/scripts/541736/jellyfinLaunchPotplayerHideButton.user.js
// @updateURL https://update.greasyfork.org/scripts/541736/jellyfinLaunchPotplayerHideButton.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        .dropdown-container {
          position: relative; /* 关键：创建定位上下文 */
          display: inline-block;
        }
        .more-button-wrapper {
            position: relative;
            display: inline-block;
        }
        .more-button {
            background: #2b2b2b;
            border: 1px solid #444;
            color: #ddd;
            padding: 5px 15px;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
        }
        .more-dropdown {
            /* 新增样式 */
            max-width: min(80vw, 300px);
            max-height: 70vh;
            overflow: auto;
            margin: 5px;
            box-sizing: border-box;
            /* 原样式 */
            display: none;
            grid-template-columns: repeat(3, 1fr);
            right: 0; /* 默认右对齐 */
            display: none;
            position: absolute;
            top: 100%;
            right: 0;
            background: #333;
            border: 1px solid #444;
            border-radius: 4px;
            z-index: 1000;
            padding: 8px;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
          .more-button-wrapper .more-dropdown {
            display: none !important;
            opacity: 0;
            transition: opacity 0.3s ease;
          }
          .more-button-wrapper:hover .more-dropdown {
            display: grid !important;
            opacity: 1;
          }
        .player-option {
            width: 40px;
            height: 40px;
            background-size: contain !important;
            background-repeat: no-repeat !important;
            cursor: pointer;
            border-radius: 4px;
            transition: transform 0.2s;
        }
        .player-option:hover {
            transform: scale(1.1);
            background-color: rgba(255,255,255,0.1);
        }
        
    `;
    document.head.appendChild(style);
        setInterval(function () {
        let potplayer = document.querySelectorAll("div#itemDetailPage:not(.hide) #embyPot")[0];
        if (!potplayer) {
            let mainDetailButtons = document.querySelectorAll("div#itemDetailPage:not(.hide) .mainDetailButtons .detailButton[title='播放']")[0];
            if (mainDetailButtons) {
                // 创建"更多"下拉菜单容器
                const container = document.createElement('div');
                container.className = 'more-button-wrapper';
                
                // 构建下拉菜单HTML（所有按钮以图标形式展示）
                container.innerHTML = `
                 <div class="dropdown-container"> 
                    <button class="more-button">
                        <span style="
                            display:inline-block;
                            width:24px;
                            height:24px;
                            background:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjIuNSIgZD0iTTQgNGgxNnYxNGEyIDIgMCAwIDEtMiAySDZhMiAyIDAgMCAxLTItMnptMTAgMTB2LTRtMCAwaC00bTQgMGwtNCA0Ii8+PC9zdmc+);
                            background-size:contain;
                            background-color: white;">
                        </span>
                    </button>
                    <div class="more-dropdown">
                        <div class="player-option" id="embyPot" title="Potplayer" style="background: url(https://cdn.jsdelivr.net/gh/bpking1/embyExternalUrl@0.0.2/embyWebAddExternalUrl/icons/icon-PotPlayer.webp)"></div>
                        <div class="player-option" id="embyMX" title="MXPlayer" style="background: url(https://cdn.jsdelivr.net/gh/bpking1/embyExternalUrl@0.0.2/embyWebAddExternalUrl/icons/icon-MXPlayer.webp)"></div>
                        <div class="player-option" id="embyIINA" title="IINA" style="background: url(https://cdn.jsdelivr.net/gh/bpking1/embyExternalUrl@0.0.2/embyWebAddExternalUrl/icons/icon-IINA.webp)"></div>
                        <div class="player-option" id="embyVlc" title="VLC" style="background: url(https://cdn.jsdelivr.net/gh/bpking1/embyExternalUrl@0.0.2/embyWebAddExternalUrl/icons/icon-VLC.webp)"></div>
                        <div class="player-option" id="embyNPlayer" title="NPlayer" style="background: url(https://cdn.jsdelivr.net/gh/bpking1/embyExternalUrl@0.0.2/embyWebAddExternalUrl/icons/icon-NPlayer.webp)"></div>
                        <div class="player-option" id="embyInfuse" title="Infuse" style="background: url(https://cdn.jsdelivr.net/gh/bpking1/embyExternalUrl@0.0.2/embyWebAddExternalUrl/icons/icon-infuse.webp)"></div>
                    </div>
                </div>
                `;
                
                // 插入到播放按钮下方
                mainDetailButtons.insertAdjacentElement('afterend', container);
                
                // 绑定事件
                const detailPage = document.querySelector("div#itemDetailPage:not(.hide)");
                detailPage.querySelector("#embyPot").onclick = embyPot;
                detailPage.querySelector("#embyMX").onclick = embyMX;
                detailPage.querySelector("#embyIINA").onclick = embyIINA;
                detailPage.querySelector("#embyVlc").onclick = embyVlc;
                detailPage.querySelector("#embyNPlayer").onclick = embyNPlayer;
                detailPage.querySelector("#embyInfuse").onclick = embyInfuse;
            }
        }
    }, 1000);
    
let closeTimer = null;
    setInterval(() => {
        // const moreButtonWrapper = document.querySelector(".more-button-wrapper");
        // if (moreButtonWrapper && !moreButtonWrapper.dataset.eventsAdded) {
        //     moreButtonWrapper.addEventListener("mouseup", function() {
        //         const dropdown = this.querySelector(".more-dropdown");
        //         dropdown.style.display = "grid";
        //         adjustDropdownPosition(dropdown);
        //     });
        //     moreButtonWrapper.dataset.eventsAdded = "true";
        // }
         // 监听父容器而非按钮
        const container = document.querySelector(".dropdown-container");
        const dropdown = container.querySelector(".more-dropdown");
        const button = container.querySelector(".more-button");
    
        container.addEventListener("mouseenter", () => {
          clearTimeout(closeTimer);
          dropdown.style.display = "grid";
        });
    
        container.addEventListener("mouseleave", () => {
          closeTimer = setTimeout(() => {
              dropdown.style.display = "none";
              button.setAttribute("aria-expanded", "false");
          },500);
        });
    }, 1000);
// 动态定位函数
    function adjustDropdownPosition(dropdown) {
        const rect = dropdown.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        if (rect.right > viewportWidth - 20) {
            dropdown.style.left = "auto";
            dropdown.style.right = "0";
        } else if (rect.left < 20) {
            dropdown.style.left = "0";
            dropdown.style.right = "auto";
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

    function getSeek(position) {
        let ticks = position * 10000;
        let parts = []
            , hours = ticks / 36e9;
        (hours = Math.floor(hours)) && parts.push(hours);
        let minutes = (ticks -= 36e9 * hours) / 6e8;
        ticks -= 6e8 * (minutes = Math.floor(minutes)),
            minutes < 10 && hours && (minutes = "0" + minutes),
            parts.push(minutes);
        let seconds = ticks / 1e7;
        return (seconds = Math.floor(seconds)) < 10 && (seconds = "0" + seconds),
            parts.push(seconds),
            parts.join(":")
    }

    function getSubPath(mediaSource) {
        let selectSubtitles = document.querySelector("select[is='emby-select']:not(.hide).selectSubtitles");
        let subTitlePath = '';
        //返回选中的外挂字幕
        if (selectSubtitles && selectSubtitles.value > 0) {
            let SubIndex = mediaSource.MediaStreams.findIndex(m => m.Index == selectSubtitles.value && m.IsExternal);
            if (SubIndex > -1) {
                let subtitleCodec = mediaSource.MediaStreams[SubIndex].Codec;
                subTitlePath = `/${mediaSource.Id}/Subtitles/${selectSubtitles.value}/Stream.${subtitleCodec}`;
            }
        }
        else {
            //默认尝试返回第一个外挂中文字幕
            let chiSubIndex = mediaSource.MediaStreams.findIndex(m => m.Language == "chi" && m.IsExternal);
            if (chiSubIndex > -1) {
                let subtitleCodec = mediaSource.MediaStreams[chiSubIndex].Codec;
                subTitlePath = `/${mediaSource.Id}/Subtitles/${chiSubIndex}/Stream.${subtitleCodec}`;
            } else {
                //尝试返回第一个外挂字幕
                let externalSubIndex = mediaSource.MediaStreams.findIndex(m => m.IsExternal);
                if (externalSubIndex > -1) {
                    let subtitleCodec = mediaSource.MediaStreams[externalSubIndex].Codec;
                    subTitlePath = `/${mediaSource.Id}/Subtitles/${externalSubIndex}/Stream.${subtitleCodec}`;
                }
            }

        }
        return subTitlePath;
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
        let subPath = getSubPath(mediaSource);
        let subUrl = subPath.length > 0 ? `${domain}${subPath}?api_key=${ApiClient.accessToken()}` : '';
        let streamUrl = `${domain}/stream.${mediaSource.Container}?api_key=${ApiClient.accessToken()}&Static=true&MediaSourceId=${mediaSourceId}`;
        let position = parseInt(itemInfo.UserData.PlaybackPositionTicks / 10000);
        let intent = await getIntent(mediaSource, position);
        console.log(streamUrl, subUrl, intent);
        return {
            streamUrl: streamUrl,
            subUrl: subUrl,
            intent: intent,
        }
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

    async function embyPot() {
        let mediaInfo = await getEmbyMediaInfo();
        let intent = mediaInfo.intent;
        let poturl = `potplayer://${encodeURI(mediaInfo.streamUrl)} /sub=${encodeURI(mediaInfo.subUrl)} /current /title="${intent.title}" /seek=${getSeek(intent.position)}`;
        console.log(poturl);
        window.open(poturl, "_blank");
    }

    //https://wiki.videolan.org/Android_Player_Intents/
    async function embyVlc() {
        let mediaInfo = await getEmbyMediaInfo();
        let intent = mediaInfo.intent;
        //android subtitles:  https://code.videolan.org/videolan/vlc-android/-/issues/1903
        let vlcUrl = `intent:${encodeURI(mediaInfo.streamUrl)}#Intent;package=org.videolan.vlc;type=video/*;S.subtitles_location=${encodeURI(mediaInfo.subUrl)};S.title=${encodeURI(intent.title)};i.position=${intent.position};end`;
        if (getOS() == "windows") {
            //桌面端需要额外设置,参考这个项目,MPV也是类似的方法:  https://github.com/stefansundin/vlc-protocol
            vlcUrl = `vlc://${encodeURI(mediaInfo.streamUrl)}`;
        }
        if (getOS() == 'ios') {
            //https://code.videolan.org/videolan/vlc-ios/-/commit/55e27ed69e2fce7d87c47c9342f8889fda356aa9
            vlcUrl = `vlc-x-callback://x-callback-url/stream?url=${encodeURIComponent(mediaInfo.streamUrl)}&sub=${encodeURIComponent(mediaInfo.subUrl)}`;
        }
        console.log(vlcUrl);
        window.open(vlcUrl, "_blank");
    }

    //https://github.com/iina/iina/issues/1991
    async function embyIINA() {
        let mediaInfo = await getEmbyMediaInfo();
        let iinaUrl = `iina://weblink?url=${encodeURIComponent(mediaInfo.streamUrl)}&new_window=1`;
        console.log(`iinaUrl= ${iinaUrl}`);
        window.open(iinaUrl, "_blank");
    }

    //https://sites.google.com/site/mxvpen/api
    async function embyMX() {
        let mediaInfo = await getEmbyMediaInfo();
        let intent = mediaInfo.intent;
        //mxPlayer free
        let mxUrl = `intent:${encodeURI(mediaInfo.streamUrl)}#Intent;package=com.mxtech.videoplayer.ad;S.title=${encodeURI(intent.title)};i.position=${intent.position};end`;
        //mxPlayer Pro
        //let mxUrl = `intent:${encodeURI(mediaInfo.streamUrl)}#Intent;package=com.mxtech.videoplayer.pro;S.title=${encodeURI(intent.title)};i.position=${intent.position};end`;
        console.log(mxUrl);
        window.open(mxUrl, "_blank");
    }

    async function embyNPlayer() {
        let mediaInfo = await getEmbyMediaInfo();
        let nUrl = getOS() == 'macOS' ? `nplayer-mac://weblink?url=${encodeURIComponent(mediaInfo.streamUrl)}&new_window=1` : `nplayer-${encodeURI(mediaInfo.streamUrl)}`;
        console.log(nUrl);
        window.open(nUrl, "_blank");
    }

    //infuse
     async function embyInfuse() {
         let mediaInfo = await getEmbyMediaInfo();
         let infuseUrl = `infuse://x-callback-url/play?url=${encodeURIComponent(mediaInfo.streamUrl)}`;
         console.log(`infuseUrl= ${infuseUrl}`);
         window.open(infuseUrl, "_blank");
     }

    function getOS() {
        let u = navigator.userAgent
        if (!!u.match(/compatible/i) || u.match(/Windows/i)) {
            return 'windows'
        } else if (!!u.match(/Macintosh/i) || u.match(/MacIntel/i)) {
            return 'macOS'
        } else if (!!u.match(/iphone/i) || u.match(/Ipad/i)) {
            return 'ios'
        } else if (u.match(/android/i)) {
            return 'android'
        } else if (u.match(/Ubuntu/i)) {
            return 'Ubuntu'
        } else {
            return 'other'
        }
    }

})();