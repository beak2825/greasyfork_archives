// ==UserScript==
// @name         YouTube - Custom Default Settings
// @name:en      YouTube - Custom Default Settings
// @name:ja      YouTube - 初期設定の変更
// @namespace    https://greasyfork.org/ja/users/941284-ぐらんぴ
// @version      2025-11-21
// @description  hide short, annotation, liveChat, etc.
// @description:en hide short, annotation, liveChat, etc.
// @description:ja 画質 次の動画への秒数 文字起こしの有無 ライブチャットの有無などの変更
// @author       ぐらんぴ
// @match        https://www.youtube.com/*
// @icon         https://www.youtube.com/favicon.ico
// @run-at       document-start
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521433/YouTube%20-%20Custom%20Default%20Settings.user.js
// @updateURL https://update.greasyfork.org/scripts/521433/YouTube%20-%20Custom%20Default%20Settings.meta.js
// ==/UserScript==

let S = {
    Quality: 720, // 144, 240, 360, 480, 720, 1080, 1440, 2160
    isDeleteShorts: true, // true | false
    isDeleteAnnotation: true, // true | false
    AutoplayCountDown: 3, // Number
    isLiveChatCollapsed: "LIVE_CHAT_DISPLAY_STATE_COLLAPSED", // "LIVE_CHAT_DISPLAY_STATE_COLLAPSED" | "LIVE_CHAT_DISPLAY_STATE_EXPANDED"
    DESCRIPTION_PANEL: "ENGAGEMENT_PANEL_VISIBILITY_HIDDEN", //"ENGAGEMENT_PANEL_VISIBILITY_VISIBLE" | "ENGAGEMENT_PANEL_VISIBILITY_HIDDEN"
    CHAPTER_PANEL: "ENGAGEMENT_PANEL_VISIBILITY_VISIBLE", //"ENGAGEMENT_PANEL_VISIBILITY_VISIBLE" | "ENGAGEMENT_PANEL_VISIBILITY_HIDDEN"
    COMMENTS_PANEL: "ENGAGEMENT_PANEL_VISIBILITY_HIDDEN", //"ENGAGEMENT_PANEL_VISIBILITY_VISIBLE" | "ENGAGEMENT_PANEL_VISIBILITY_HIDDEN"
    SHOPPING_PANEL: "ENGAGEMENT_PANEL_VISIBILITY_HIDDEN", //"ENGAGEMENT_PANEL_VISIBILITY_VISIBLE" | "ENGAGEMENT_PANEL_VISIBILITY_HIDDEN"
    TRANSCRIPT_PANEL: "ENGAGEMENT_PANEL_VISIBILITY_VISIBLE", //"ENGAGEMENT_PANEL_VISIBILITY_VISIBLE" | "ENGAGEMENT_PANEL_VISIBILITY_HIDDEN"
    CLIP_PANEL: "ENGAGEMENT_PANEL_VISIBILITY_HIDDEN", //"ENGAGEMENT_PANEL_VISIBILITY_VISIBLE" | "ENGAGEMENT_PANEL_VISIBILITY_HIDDEN"
    // ADS_PANEL: "ENGAGEMENT_PANEL_VISIBILITY_VISIBLE", //"ENGAGEMENT_PANEL_VISIBILITY_VISIBLE" | "ENGAGEMENT_PANEL_VISIBILITY_HIDDEN"
};

if(S.isDeleteAnnotation){
    GM_addStyle(`
    .annotation { display: none; }`)
}

const allowed = new Set([144, 240, 360, 480, 720, 1080, 1440, 2160]);
if(allowed.has(S.Quality)){
    for(let i = 0; i < localStorage.length; i++){
        let key = localStorage.key(i);
        if(key === "yt-player-quality"){
            let data = localStorage.getItem(key);
            let obj = JSON.parse(data);
            let innerData = JSON.parse(obj.data);

            innerData.quality = S.Quality;
            obj.data = JSON.stringify(innerData);

            let newData = JSON.stringify(obj);
            localStorage.setItem(key, newData);
        }
    }
}

addEventListener("yt-navigate-finish", e => {
    let pageType = e.detail.pageType
    let res = e.detail.response.response
    console.log(res,res.engagementPanels)
    try{
        if(pageType == "search"){
            res.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents.forEach(i =>{
                if(i.gridShelfViewModel) i.gridShelfViewModel = ""
                if(S.isDeleteShorts){
                    GM_addStyle(`
                    ytd-video-renderer:has([overlay-style="SHORTS"]) { display: none !important; }
                    grid-shelf-view-model { display: none !important; }
                    `);
                }
            })

        }
        if(pageType == "browse"){
            if(location.pathname == "/feed/you"){
                GM_addStyle(`
                    ytd-rich-section-renderer { display: block !important; }
                    ytd-rich-item-renderer:has([overlay-style="SHORTS"]) { display: block !important; }
                `);
                return;
            }
            res.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.richGridRenderer.contents.forEach(i =>{
                if(i.richSectionRenderer) i.richSectionRenderer = ""
            });
            if(S.isDeleteShorts){
                GM_addStyle(`
                    ytd-rich-section-renderer { display: none !important; }
                    ytd-rich-item-renderer:has([overlay-style="SHORTS"]) { display: none !important; }
                `);
            }
        }
        if(pageType == "watch"){
            if(S.isDeleteShorts){
                GM_addStyle(`
                ytd-reel-shelf-renderer { display: none !important; }
                #spinner { display: none; }
                `)

                res.contents.twoColumnWatchNextResults.secondaryResults.secondaryResults.results[1].itemSectionRenderer.contents.forEach(i =>{
                    i.reelShelfRenderer = ""
                })
            }
            // quality
            if(allowed.has(S.Quality)){
                for(let i = 0; i < localStorage.length; i++){
                    let key = localStorage.key(i);
                    if(key === "yt-player-quality"){
                        let data = localStorage.getItem(key);

                        let obj = JSON.parse(data);
                        let innerData = JSON.parse(obj.data);

                        innerData.quality = S.Quality;
                        obj.data = JSON.stringify(innerData);

                        let newData = JSON.stringify(obj);
                        localStorage.setItem(key, newData);
                    }
                }
            }

            // contens
            res.contents.twoColumnWatchNextResults.autoplay.autoplay.countDownSecs = S.AutoplayCountDown
            if(res.contents.twoColumnWatchNextResults.conversationBar?.liveChatRenderer) res.contents.twoColumnWatchNextResults.conversationBar.liveChatRenderer.initialDisplayState = S.isLiveChatCollapsed
            // engagementPanels
            res.engagementPanels.forEach(i =>{
                if(i.engagementPanelSectionListRenderer.targetId == "engagement-panel-comments-section") i.engagementPanelSectionListRenderer.visibility = S.COMMENTS_PANEL
                //if(i.engagementPanelSectionListRenderer.targetId == "engagement-panel-ads") i.engagementPanelSectionListRenderer.visibility = S.ADS_PANEL
                if(i.engagementPanelSectionListRenderer.targetId == "shopping_panel_for_entry_point_5") i.engagementPanelSectionListRenderer.visibility = S.SHOPPING_PANEL
                if(i.engagementPanelSectionListRenderer.targetId == "engagement-panel-clip-create") i.engagementPanelSectionListRenderer.visibility = S.CLIP_PANEL
                if(i.engagementPanelSectionListRenderer.targetId == "engagement-panel-structured-description") i.engagementPanelSectionListRenderer.visibility = S.DESCRIPTION_PANEL
                if(i.engagementPanelSectionListRenderer.targetId == "engagement-panel-searchable-transcript") i.engagementPanelSectionListRenderer.visibility = S.TRANSCRIPT_PANEL
                if(i.engagementPanelSectionListRenderer.targetId == "engagement-panel-macro-markers-description-chapters") i.engagementPanelSectionListRenderer.visibility = S.CHAPTER_PANEL
            });

            // playerOverlays
            if(res.playerOverlays.playerOverlayRenderer.autoplay?.playerOverlayAutoplayRenderer){
                res.playerOverlays.playerOverlayRenderer.autoplay.playerOverlayAutoplayRenderer.countDownSecs = S.AutoplayCountDown
                res.playerOverlays.playerOverlayRenderer.autoplay.playerOverlayAutoplayRenderer.countDownSecsForFullscreen = S.AutoplayCountDown
            }
        }
    }catch(err){ //console.log(err)
               }
})