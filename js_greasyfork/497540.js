// ==UserScript==
// @name               自研 - 哔哩哔哩 - 分 P 连播
// @name:en_US         Self-made - BiliBili - Continuous playback of multiple-part videos
// @description        连续播放多段(Part)视频。
// @description:en_US  Continuous playback of multiple video parts.
// @version            2.0.1
// @author             CPlayerCHN
// @license            MulanPSL-2.0
// @namespace          https://www.gitlink.org.cn/CPlayerCHN
// @match              https://www.bilibili.com/video/*
// @icon               https://static.hdslb.com/images/favicon.ico
// @run-at             document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/497540/%E8%87%AA%E7%A0%94%20-%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%20-%20%E5%88%86%20P%20%E8%BF%9E%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/497540/%E8%87%AA%E7%A0%94%20-%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%20-%20%E5%88%86%20P%20%E8%BF%9E%E6%92%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义「网页标题」「初始化侦测器」「异步加载侦测器」变量，和「快捷元素选择」函数。
    let title = document.title,
        init = new MutationObserver(() => {

        // 如果播放方式模式元素存在，就执行进一步的语句。
        if($(".bpx-player-ctrl-setting-handoff")) {

            // 结束监听。
            init.disconnect();

            // 等待 0.5 秒，让网页内容加载。
            setTimeout(() => {

                // 如果有下一段视频且播放模式不是自动切集，就开启自动切集并弹出撤销弹框。
                if(($(".multi-page-v1 .cur-list .list-box li.watched + li") || $(".base-video-sections-v1 .video-section-list .video-episode-card__info-playing")?.parentNode.nextElementSibling) && !$(".bpx-player-ctrl-setting-handoff-content input").checked) {

                    // 开启自动连播。
                    $(".next-button .switch-button").click();

                    // 弹出消息栏提示是否需要取消自动连播，如果 10 不撤销就移除消息栏。
                    if(!$("#CPL-snackbar")) {

                        // 把消息栏写入网页。
                        document.body.insertAdjacentHTML("beforeend", "<style id=\"CPL-snackbar-style\">#CPL-snackbar { position: fixed; z-index: 100001; right: 24px; bottom: -48px; height: 48px; padding: 0 12px 0 24px; border-radius: 2px; background-color: #323232; display: flex; align-items: center; font-size: 14px; user-select: none; transition: bottom 0.3s cubic-bezier(0, 0, 0.2, 1) 0s; } #CPL-snackbar.display { bottom: 84px; } #CPL-snackbar span { color: #FFFFFF; } #CPL-snackbar button { border: none; background: transparent; height: 36px; padding: 0 16px; border-radius: 2px; color: var(--brand_blue); transition: background-color 0.3s cubic-bezier(0, 0, 0.2, 1) 0s; } #CPL-snackbar button:hover { background-color: rgba(255, 255, 255, 0.1); } #CPL-snackbar button:active { background-color: rgba(255, 255, 255, 0.3); }</style><nav id=\"CPL-snackbar\"><span>检测到分 P 视频，已为您开启自动连播。</span><button onclick='document.querySelector(\".next-button .switch-button\")?.click(); document.querySelector(\"#CPL-snackbar\").classList.remove(\"display\"); setTimeout(() => { document.querySelector(\"#CPL-snackbar\").remove(); }, 300);'>撤销</button></nav>");

                        // 定义「消息栏」变量。
                        const snackbar = $("#CPL-snackbar");

                        // 展示消息栏。
                        setTimeout(() => {
                            snackbar.classList.add("display");
                        }, 300);

                        // 10 秒后移除消息栏。
                        setTimeout(() => {

                            snackbar.classList.remove("display");
                            setTimeout(() => {
                                snackbar.remove();
                                $("#CPL-snackbar-style").remove();
                            }, 300);

                        }, 9700);

                    }

                // 不然如果没有下一段视频且播放模式是自动切集，就关闭自动切集。
                }else if(!($(".multi-page-v1 .cur-list .list-box li.watched + li") || $(".base-video-sections-v1 .video-section-list .video-episode-card__info-playing")?.parentNode.nextElementSibling) && $(".bpx-player-ctrl-setting-handoff-content input").checked) {

                    // 开启关闭自动切集。
                    $(".next-button .switch-button").click();

                }

            }, 500);

        }

    }),
        asyncLoad = new MutationObserver(() => {

        // 如果网页标题和之前不一样就。
        if(title !== document.title) {

            // 更新「网页标题」变量
            title = document.title;

            // 如果有下一段视频且播放模式不是自动切集，就开启自动切集并弹出撤销弹框。
            if(($(".multi-page-v1 .cur-list .list-box li.watched + li") || $(".base-video-sections-v1 .video-section-list .video-episode-card__info-playing")?.parentNode.nextElementSibling) && !$(".bpx-player-ctrl-setting-handoff-content input").checked) {

                // 开启自动连播。
                $(".next-button .switch-button").click();

                // 弹出消息栏提示是否需要取消自动连播，如果 10 不撤销就移除消息栏。
                if(!$("#CPL-snackbar")) {

                    // 把消息栏写入网页。
                    document.body.insertAdjacentHTML("beforeend", "<style id=\"CPL-snackbar-style\">#CPL-snackbar { position: fixed; z-index: 100001; right: 24px; bottom: -48px; height: 48px; padding: 0 12px 0 24px; border-radius: 2px; background-color: #323232; display: flex; align-items: center; font-size: 14px; user-select: none; transition: bottom 0.3s cubic-bezier(0, 0, 0.2, 1) 0s; } #CPL-snackbar.display { bottom: 84px; } #CPL-snackbar span { color: #FFFFFF; } #CPL-snackbar button { border: none; background: transparent; height: 36px; padding: 0 16px; border-radius: 2px; color: var(--brand_blue); transition: background-color 0.3s cubic-bezier(0, 0, 0.2, 1) 0s; } #CPL-snackbar button:hover { background-color: rgba(255, 255, 255, 0.1); } #CPL-snackbar button:active { background-color: rgba(255, 255, 255, 0.3); }</style><nav id=\"CPL-snackbar\"><span>检测到分 P 视频，已为您开启自动连播。</span><button onclick='document.querySelector(\".next-button .switch-button\")?.click(); document.querySelector(\"#CPL-snackbar\").classList.remove(\"display\"); setTimeout(() => { document.querySelector(\"#CPL-snackbar\").remove(); }, 300);'>撤销</button></nav>");

                    // 定义「消息栏」变量。
                    const snackbar = $("#CPL-snackbar");

                    // 展示消息栏。
                    snackbar.classList.add("display");

                    // 10 秒后移除消息栏。
                    setTimeout(() => {

                        snackbar.classList.remove("display");
                        setTimeout(() => {
                            snackbar.remove();
                            $("#CPL-snackbar-style").remove();
                        }, 300);

                    }, 9700);

                }

            // 不然如果没有下一段视频且播放模式是自动切集，就关闭自动切集。
            }else if(!($(".multi-page-v1 .cur-list .list-box li.watched + li") || $(".base-video-sections-v1 .video-section-list .video-episode-card__info-playing")?.parentNode.nextElementSibling) && $(".bpx-player-ctrl-setting-handoff-content input").checked) {

                // 开启关闭自动切集。
                $(".next-button .switch-button").click();

            }

        }

    });

    function $(elm) {
        return document.querySelector(elm);
    }


    // 配置「初始化侦测器」「异步加载侦测器」。
    init.observe(document.body, {
        childList: true,
        subtree: true
    });
    asyncLoad.observe(document.querySelector("head"), {
        childList: true,
        subtree: true
    });

})();