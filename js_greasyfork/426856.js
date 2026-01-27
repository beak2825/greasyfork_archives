// ==UserScript==
// @name         bilibili关灯及快捷操作
// @namespace    hhh2000
// @version      1.0.3.6
// @description  bilibili关灯及快捷操作(把被新版B站藏起来的关灯按钮揪出来，在关闭弹幕按钮左边，还可以用快捷键，默认'A')、非全屏滚轮音量控制、弹幕控制快捷操作等
// @author       hhh2000
// @include      http*://www.bilibili.com/*
// @include      http*://www.bilibili.com/video/av*
// @include      http*://www.bilibili.com/video/BV*
// @include      http*://www.bilibili.com/watchlater/*
// @include      http*://www.bilibili.com/medialist/play/*
// @include      http*://www.bilibili.com/bangumi/play/ep*
// @include      http*://www.bilibili.com/bangumi/play/ss*
// @include      http*://bangumi.bilibili.com/anime/*/play*
// @include      http*://bangumi.bilibili.com/movie/*
// @include      http*://www.bilibili.com/blackboard/*
// @include      http*://t.bilibili.com/*
// @include      http*://space.bilibili.com/*
// @include      http*://www.bilibili.com/video/online.html*
// @include      http*://www.bilibili.com/account/history
// @include      http*://api.bilibili.com/*
// @include      http*://search.bilibili.com/*
// @include      http*://space.bilibili.com/39638/favlist/*
// @exclude      http*://www.bilibili.com/watchroom/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/protobufjs/7.2.5/protobuf.min.js
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_removeValue
// @grant        GM_listValues
// @grant        none
// @compatible   chrome
/* globals jQuery, $, waitForkeyElements */
/* eslint-disable no-multi-spaces, dot-notation */
// @downloadURL https://update.greasyfork.org/scripts/426856/bilibili%E5%85%B3%E7%81%AF%E5%8F%8A%E5%BF%AB%E6%8D%B7%E6%93%8D%E4%BD%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/426856/bilibili%E5%85%B3%E7%81%AF%E5%8F%8A%E5%BF%AB%E6%8D%B7%E6%93%8D%E4%BD%9C.meta.js
// ==/UserScript==


'use strict';
var hhh_lightoff_main = {
    init() {
        let //fix var to let ...
            g_is_in_biliplayer;
        var //globle
            g_test,
            g_fn_arr = [],
            ob = [],
            ver,
            ver2,
            video_ver,
            fps,
            h5Player,
            curr_focus,
            is_show_hint,
            $tip,
            move_frames,
            video_type,
            video_sub_type,
            video_type_unique_id,
            prev_video_type,
            prev_video_type_unique_id,
            biliinfo = { 'is_login': undefined, 'vip_status': undefined },
            myinfo = { 'hand_lightoff_state': undefined },
            app_page_parameters = {
                player_setting_opacity: 0,
                player_setting_area: 0,
                player_setting_fontsize: 0,
            }
            // sort_arr = [],
            // real_to_draw = [];
            const [LIGHT_DEFAULT, LIGHTON_LIKE] = ['default', 'lightOnWhenLike']
            const [MULTI_P, VIDEO_LIST, ACTION_LIST, NORMAL_VIDEO] = ['视频选集', '合集', '收藏列表', '常规视频']  //视频选集/合集（选集是单个BV号，合集是多个BV号）
            //BILI_3_X_VIDEO   （一般视频 | 旧版 | 默认）
            //BILI_3_X_VIDEO_V1（一般视频 | 新版）
            //BILI_3_X_MOVIE   （电影电视剧和番剧）
            const [ BILI_2_X_V2 ,  BILI_2_X_V3 ,  BILI_2_X ,  BILI_3_X_VIDEO,  BILI_3_X_MOVIE ,  BILI_3_X_VIDEO_V1 ,  BILI_4_X_V1,   ALL] = 
                  ['bili_2.x.v2', 'bili_2.x.v3', 'bili_2.x', 'bili_3.x'     , 'bili_3.x.movie', 'bili_3.x.video.v1', 'bili_4.x.v1', 'all'];
            const [NO_NEED_LOAD] = ['no need to load'];
        var //切换番剧和一般视频class
            bb = {},
            bb_type = undefined,
            bb_config = {
                bb_class_data: {  //其实这样不方便调试，但方便测试
                    'player':{[BILI_2_X_V2]:'.player'}, //main

                    //$('meta[property="og:image"]').attr('content')
                    'coverImg':{[ALL]:'meta[property="og:image"]'}, //封面

                    'playTipWrap':{[BILI_2_X]  :'.bilibili-player-dm-tip-wrap', [BILI_3_X_VIDEO]:'.bpx-player-video-perch'}, //paly/pause
                    'fullScreen':{[BILI_2_X]   :'.bilibili-player-video-btn-fullscreen', [BILI_3_X_MOVIE]:'.bpx-player-ctrl-btn.bpx-player-ctrl-full', [BILI_3_X_VIDEO]:'.bpx-player-ctrl-btn.bpx-player-ctrl-full'}, //全屏
                    'webFullScreen':{[BILI_2_X]:'.bilibili-player-video-web-fullscreen', [BILI_3_X_MOVIE]:'.bpx-player-ctrl-btn.bpx-player-ctrl-web', [BILI_3_X_VIDEO]:'.bpx-player-ctrl-btn.bpx-player-ctrl-web'}, //网页全屏
                    'wideScreen':{[BILI_2_X]   :'.bilibili-player-video-btn-widescreen', [BILI_3_X_MOVIE]:'.bpx-player-ctrl-btn.bpx-player-ctrl-wide', [BILI_3_X_VIDEO]:'.bpx-player-ctrl-btn.bpx-player-ctrl-wide'}, //宽屏

                    //一健三联 toolbar-left
                    'like'   :{[BILI_2_X_V2]:'.ops .like'   , [BILI_3_X_VIDEO_V1]:'.video-toolbar-left .video-like'   , [BILI_3_X_MOVIE]:'.toolbar-left .like', [BILI_3_X_VIDEO]:'.ops .like', [NO_NEED_LOAD]: true}, //点赞
                    'likeon' :{[BILI_2_X_V2]:'.ops .like.on', [BILI_3_X_VIDEO_V1]:'.video-toolbar-left .video-like.on', [BILI_3_X_MOVIE]:'.toolbar-left .like.on', [BILI_3_X_VIDEO]:'.ops .like.on'}, //已点赞
                    'coin'   :{[BILI_2_X_V2]:'.ops .coin'   , [BILI_3_X_VIDEO_V1]:'.video-toolbar-left .video-coin'   , [BILI_3_X_MOVIE]:'.toolbar-left .coin', [BILI_3_X_VIDEO]:'.ops .coin'}, //硬币
                    'coinon' :{[BILI_2_X_V2]:'.ops .coin.on', [BILI_3_X_VIDEO_V1]:'.video-toolbar-left .video-coin.on', [BILI_3_X_MOVIE]:'.toolbar-left .coin.on', [BILI_3_X_VIDEO]:'.ops .coin.on'}, //已投币
                    // 'like'   :{[BILI_2_X_V2]:'.ops .like'   , [BILI_3_X_VIDEO_V1]:'.video-toolbar-left .like'   , [BILI_3_X_MOVIE]:'.like-info', [BILI_3_X_VIDEO]:'.ops .like', [NO_NEED_LOAD]: true}, //点赞
                    // 'likeon' :{[BILI_2_X_V2]:'.ops .like.on', [BILI_3_X_VIDEO_V1]:'.video-toolbar-left .like.on', [BILI_3_X_MOVIE]:'.like-info.active', [BILI_3_X_VIDEO]:'.ops .like.on'}, //已点赞
                    // 'coin'   :{[BILI_2_X_V2]:'.ops .coin'   , [BILI_3_X_VIDEO_V1]:'.video-toolbar-left .coin'   , [BILI_3_X_MOVIE]:'.coin-info', [BILI_3_X_VIDEO]:'.ops .coin'}, //硬币
                    // 'coinon' :{[BILI_2_X_V2]:'.ops .coin.on', [BILI_3_X_VIDEO_V1]:'.video-toolbar-left .coin.on', [BILI_3_X_MOVIE]:'.coin-info.active', [BILI_3_X_VIDEO]:'.ops .coin.on'}, //已投币
                    'collect':{[BILI_2_X_V2]:'.ops .collect', [BILI_3_X_VIDEO_V1]:'.video-toolbar-left .video-fav', [BILI_3_X_MOVIE]:'.toolbar-left .favorite', [BILI_3_X_VIDEO]:'.ops .collect'}, //收藏
                    'collecton':{[BILI_2_X_V2]:'.ops .collect.on', [BILI_3_X_VIDEO_V1]:'.video-toolbar-left .video-fav.on', [BILI_3_X_MOVIE]:'.toolbar-left .favorite.on', [BILI_3_X_VIDEO]:'.ops .collect.on'}, //已收藏
                    'biliDlgM':{[BILI_2_X]:'.bili-dialog-m', [BILI_3_X_MOVIE]:'.coin-dialog-mask', [BILI_3_X_VIDEO]:'.bili-dialog-m', [BILI_3_X_VIDEO_V1]:'.bili-dialog-m'}, //投币、收藏框
                    'coinDlgCoin':{[BILI_2_X]:'.bili-dialog-m .coin-operated-m', [BILI_3_X_MOVIE]:'.coin-dialog-mask .coin-operated', [BILI_3_X_VIDEO]:'.bili-dialog-m .coin-operated-m', [BILI_3_X_VIDEO_V1]:'.bili-dialog-m .coin-operated-m-exp'}, //投币div
                    'coinDlgCloseBtn':{[BILI_2_X]:'.bili-dialog-m .close', [BILI_3_X_MOVIE]:'.coin-dialog-mask .icon-close', [BILI_3_X_VIDEO]:'.bili-dialog-m .close'}, //投币确定按钮
                    'coinDlgOkBtn':{[BILI_2_X]:'.bili-dialog-m .bi-btn', [BILI_3_X_MOVIE]:'.coin-dialog-mask .coin-btn', [BILI_3_X_VIDEO]:'.bili-dialog-m .bi-btn'}, //投币确定按钮

                    //弹幕
                    'danmukuTopBottomClose':{[BILI_2_X]:'.bilibili-player-block-filter-type[data-name=ctlbar_danmuku_top_close]', [BILI_3_X_VIDEO]:'.bpx-player-block-filter-type.bpx-player-block-typeTopBottom.bpx-player-active'}, //固定弹幕
                    'danmukuTopBottom'     :{[BILI_2_X]:'.bilibili-player-block-filter-type[ftype=top]', [BILI_3_X_VIDEO]:'.bpx-player-block-filter-type.bpx-player-block-typeTopBottom'}, //固定弹幕
                    'danmukuColorClose'    :{[BILI_2_X]:'.bilibili-player-block-filter-type[data-name=ctlbar_danmuku_bottom_close]', [BILI_3_X_VIDEO]:'.bpx-player-block-filter-type.bpx-player-block-typeColor.bpx-player-active'}, //彩色弹幕
                    'danmukuColor'         :{[BILI_2_X]:'.bilibili-player-block-filter-type[ftype=bottom]', [BILI_3_X_VIDEO]:'.bpx-player-block-filter-type.bpx-player-block-typeColor'}, //彩色弹幕
                    'danmukuSpecialClose'  :{[BILI_2_X]:'.bilibili-player-block-filter-type[data-name=ctlbar_danmuku_bottom_close]', [BILI_3_X_VIDEO]:'.bpx-player-block-filter-type.bpx-player-block-typeSpecial.bpx-player-active'}, //彩色弹幕
                    'danmukuSpecial'       :{[BILI_2_X]:'.bilibili-player-block-filter-type[ftype=bottom]', [BILI_3_X_VIDEO]:'.bpx-player-block-filter-type.bpx-player-block-typeSpecial'}, //彩色弹幕
                    'progressVal'    :{[ALL]:'.bui-progress-val'}, //读数
                    'progressWrap'   :{[ALL]:'.bui-progress-wrap'}, //进度条
                    'progressBar'    :{[ALL]:'.bui-progress-bar'}, //百分数
                    'settingOpacity' :{[BILI_2_X]:'.bilibili-player-setting-opacity', [BILI_3_X_VIDEO]:'.bpx-player-dm-setting-left-opacity'}, //弹幕透明度
                    'settingFontsize':{[BILI_2_X]:'.bilibili-player-setting-fontsize', [BILI_3_X_VIDEO]:'.bpx-player-dm-setting-left-fontsize'}, //弹幕字号
                    'settingArea'    :{[BILI_2_X]:'.bilibili-player-setting-area', [BILI_3_X_VIDEO]:'.bpx-player-dm-setting-left-area'}, //显示区域
                    'settingFs'      :{[BILI_2_X]:'.bilibili-player-video-danmaku-setting-left-fs input', [BILI_3_X_VIDEO]:'.bpx-player-dm-setting-left-radio>.bpx-player-dm-setting-left-fs input'}, //弹幕随屏幕缩放

                    //音量
                    'volumeHint'    :{[BILI_2_X]:'.bilibili-player-volumeHint', [BILI_3_X_VIDEO]:'.bpx-player-volume-hint'}, //音量显示
                    'volumeHintText':{[BILI_2_X]:'.bilibili-player-volumeHint-text', [BILI_3_X_VIDEO]:'.bpx-player-volume-hint-text'}, //音量显示百分比读数
                    'volumeHintIcon':{[BILI_2_X]:'.bilibili-player-volumeHint-icon', [BILI_3_X_VIDEO]:'.bpx-player-volume-hint-icon'}, //音量显示图标
                    // 'volumebarWrp'  :{[BILI_2_X]:'.bilibili-player-video-volumebar-wrp', [BILI_3_X_MOVIE]:'.squirtle-volume-bar-wrap', [BILI_3_X_VIDEO]:'.bpx-player-ctrl-volume-box'}, //音量条
                    // 'volumeNum'     :{[BILI_2_X]:'.bilibili-player-video-volume-num', [BILI_3_X_MOVIE]:'.squirtle-volume-num', [BILI_3_X_VIDEO]:'.bpx-player-ctrl-volume-number'}, //音量读数
                    'volumebarWrp'  :{[BILI_2_X]:'.bilibili-player-video-volumebar-wrp', [BILI_3_X_MOVIE]:'.bpx-player-ctrl-btn.bpx-player-ctrl-volume', [BILI_3_X_VIDEO]:'.bpx-player-ctrl-volume-box'}, //音量条
                    'volumeNum'     :{[BILI_2_X]:'.bilibili-player-video-volume-num', [BILI_3_X_MOVIE]:'.bpx-player-ctrl-volume-box', [BILI_3_X_VIDEO]:'.bpx-player-ctrl-volume-number'}, //音量读数


                    //视频速度
                    'videoSpeedActive':{[BILI_2_X]:'.bilibili-player-video-btn-speed-menu-list.bilibili-player-active', [BILI_3_X_MOVIE]:'.bpx-player-ctrl-playbackrate-menu-item.bpx-state-active', [BILI_3_X_VIDEO]:'.bpx-player-ctrl-playbackrate-menu-item.bpx-state-active'}, //视频速度
                    'videoSpeed':{[BILI_2_X]:'.bilibili-player-video-btn-speed-menu-list', [BILI_3_X_MOVIE]:'.bpx-player-ctrl-playbackrate-menu-item', [BILI_3_X_VIDEO]:'.bpx-player-ctrl-playbackrate-menu-item'}, //视频速度
                    'videoSpeedName':{[BILI_2_X]:'.bilibili-player-video-btn-speed-name', [BILI_3_X_MOVIE]:'.bpx-player-ctrl-playbackrate-result', [BILI_3_X_VIDEO]:'.bpx-player-ctrl-playbackrate-result'}, //视频速度

                    //弹幕设置等
                    'switchBody':{[ALL]:'.bui-switch-body'}, //系统关灯css设置
                    'switchDot':{[ALL]:'.bui-switch-dot'}, //系统弹幕设置按钮wrap进度条拖动点

                    'switchInput':{[BILI_3_X_VIDEO_V1]:'.bui-danmaku-switch-input', [BILI_3_X_MOVIE]:'.bui-danmaku-switch-input', [ALL]:'.bui-switch-input'}, //弹幕设置switch按钮
                    'switchLabel':{[BILI_3_X_VIDEO_V1]:'.bui-danmaku-switch-label', [BILI_3_X_MOVIE]:'.bui-danmaku-switch-label', [ALL]:'.bui-switch-label'}, //弹幕设置switchLabel

                    'danmaku':{[BILI_2_X]:'.bilibili-player-video-danmaku', [BILI_3_X_VIDEO]:'.bpx-player-row-dm-wrap'}, //弹幕
                    'danmakuRoot':{[BILI_2_X]:'.bilibili-player-video-danmaku-root', [BILI_3_X_VIDEO]:'.bpx-player-dm-root'}, //系统弹幕设置条
                    'danmakuSwitch':{[BILI_2_X]:'.bilibili-player-video-danmaku-switch', [BILI_3_X_VIDEO]:'.bpx-player-dm-switch'}, //关闭弹幕按钮

                    'dm':{[BILI_2_X]:'.bilibili-player-video-danmaku-setting', [BILI_3_X_VIDEO]:'.bpx-player-dm-setting'}, //系统弹幕设置按钮
                    'dmWrap':{[BILI_2_X]:'.bilibili-player-video-danmaku-setting-wrap', [BILI_3_X_VIDEO]:'.bpx-player-dm-setting-wrap'}, //系统弹幕设置wrap
                    'dmBox':{[BILI_2_X]:'.bilibili-player-video-danmaku-setting-box', [BILI_3_X_VIDEO]:'.bpx-player-dm-setting-box'}, //系统弹幕设置box
                    'dmLeft':{[BILI_2_X]:'.bilibili-player-video-danmaku-setting-left', [BILI_3_X_VIDEO]:'.bpx-player-dm-setting-left'},
                    'dmLeftMore':{[BILI_2_X]:'.bilibili-player-video-danmaku-setting-left-more', [BILI_3_X_VIDEO]:'.bpx-player-dm-setting-left-more'},
                    'dmLeftMoreText':{[BILI_2_X]:'.bilibili-player-video-danmaku-setting-left-more-text', [BILI_3_X_VIDEO]:'.bpx-player-dm-setting-left-more-text'},
                    'dmLeftBlock':{[BILI_2_X]:'.bilibili-player-video-danmaku-setting-left-block', [BILI_3_X_VIDEO]:'.bpx-player-dm-setting-left-block'},
                    'dmLeftBlockTitle':{[BILI_2_X]:'.bilibili-player-video-danmaku-setting-left-block-title', [BILI_3_X_VIDEO]:'.bpx-player-dm-setting-left-block-title'},
                    'dmLeftFs':{[BILI_2_X]:'.bilibili-player-video-danmaku-setting-left-fs', [BILI_3_X_VIDEO]:'.bpx-player-dm-setting-left-fs'},
                    'dmRightMore':{[BILI_2_X]:'.bilibili-player-video-danmaku-setting-right-more', [BILI_3_X_VIDEO]:'.bpx-player-dm-setting-right-more'},
                    'dmRightMoreText':{[BILI_2_X]:'.bilibili-player-video-danmaku-setting-right-more-text', [BILI_3_X_VIDEO]:'.bpx-player-dm-setting-right-more-text'},
                    'dmRightSeparator':{[BILI_2_X]:'.bilibili-player-video-danmaku-setting-right-separator', [BILI_3_X_VIDEO]:'.bpx-player-dm-setting-right-separator'},
                    'dmRightReset':{[BILI_2_X]:'.bilibili-player-video-danmaku-setting-right-reset', [BILI_3_X_VIDEO]:'.bpx-player-dm-setting-right-reset'},

                    'videoWrap':{[BILI_2_X]:'.bilibili-player-video-wrap', [BILI_3_X_VIDEO]:'.bpx-player-video-area'}, //播放wrap
                    'videoContextMenu':{[BILI_2_X]:'.bilibili-player-video-wrap', [BILI_3_X_VIDEO]:'.bpx-player-video-perch'}, //播放contextmenu
                    'video':{[BILI_2_X]:'.bilibili-player-video', [BILI_3_X_VIDEO]:'.bpx-player-video-wrap'}, //播放
                    'videoTopMask':{[BILI_2_X]:'.bilibili-player-video-top-mask', [BILI_3_X_VIDEO]:'.bpx-player-top-mask'}, //全屏时鼠标悬停时产生的顶端mask

                    //系统设置等
                    'playArea':{[BILI_2_X]:'.bilibili-player-area'}, //哔哩哔哩播放器
                    'playVideo':{[BILI_2_X]:'.bilibili-player-video-btn'}, //系统设置
                    'playVideoControlWrap':{[BILI_2_X]:'.bilibili-player-video-control-wrap', [BILI_3_X_VIDEO]:'.bpx-player-control-wrap'}, //系统控制面板
                    'playSetting':{[BILI_2_X]:'.bilibili-player-video-btn-setting'}, //系统播放设置
                    'playSettingWrap':{[BILI_2_X]:'.bilibili-player-video-btn-setting-wrap'}, //系统播放设置wrap bpx-player-ctrl-btn bpx-player-ctrl-setting
                    'playSettingAutoplay':{[BILI_2_X]:'.bilibili-player-video-btn-setting-left-autoplay input', [BILI_3_X_MOVIE]: '.bpx-player-ctrl-setting-autoplay', [BILI_3_X_VIDEO]:'.bpx-player-ctrl-setting-autoplay input'}, //自动播放
                    'playSettingRepeatInput':{[BILI_2_X]:'.bilibili-player-video-btn-setting-left-repeat input', [BILI_3_X_MOVIE]:'.bpx-player-ctrl-setting-loop', [BILI_3_X_VIDEO]:'.bpx-player-ctrl-setting-loop input'}, //洗脑循环按钮
                    'playSettingLightoff':{[BILI_2_X]:'.bilibili-player-video-btn-setting-right-others-content-lightoff input', [BILI_3_X_MOVIE]:'.bpx-player-ctrl-setting-checkbox.bpx-player-ctrl-setting-lightoff input', [BILI_3_X_VIDEO]:'.bpx-player-ctrl-setting-checkbox.bpx-player-ctrl-setting-lightoff input'}, //关灯按钮
                    // 'playSettingAutoplay':{[BILI_2_X]:'.bilibili-player-video-btn-setting-left-autoplay input', [BILI_3_X_MOVIE]: '.squirtle-setting-autoplay', [BILI_3_X_VIDEO]:'.bpx-player-ctrl-setting-autoplay'}, //自动播放
                    // 'playSettingRepeatInput':{[BILI_2_X]:'.bilibili-player-video-btn-setting-left-repeat input', [BILI_3_X_MOVIE]:'.squirtle-setting-loop', [BILI_3_X_VIDEO]:'.bpx-player-ctrl-setting-loop'}, //洗脑循环按钮
                    // 'playSettingLightoff':{[BILI_2_X]:'.bilibili-player-video-btn-setting-right-others-content-lightoff input', [BILI_3_X_MOVIE]:'.squirtle-single-setting-other-choice.squirtle-lightoff', [BILI_3_X_VIDEO]:'.bpx-player-ctrl-setting-checkbox.bpx-player-ctrl-setting-lightoff input'}, //关灯按钮
                    //'bpxStateLightOff':{[BILI_3_X_VIDEO]:'.bpx-state-light-off'}, //关灯bpx
                    'playJumpElectric':{[BILI_2_X]: '.bilibili-player-electric-panel-jump', [BILI_3_X_VIDEO]: '.bpx-player-electric-jump'}, //2.69.4版本B站取消充电鸣谢，2.72又加回来了
                    'playTooltipArea' :{[BILI_3_X_VIDEO]: '.bpx-player-tooltip-area'},
                    'playTooltipItem' :{[BILI_3_X_VIDEO]: '.bpx-player-tooltip-item'},
                    'playTooltipTitle':{[BILI_3_X_VIDEO]: '.bpx-player-tooltip-title'},
                    'playCtrlSubtitle':{[BILI_3_X_VIDEO]: '.bpx-player-ctrl-subtitle-close-switch:not(.bpx-state-active), .bpx-player-ctrl-subtitle-language-item[data-lan=ai-zh]:not(.bpx-state-active)'},
                    //高能进度条
                    'playPBP':{[BILI_3_X_VIDEO]: '.bpx-player-pbp'},
                    //稍后再看
                    'playWatchLater':{[BILI_3_X_VIDEO]: '.ops-watch-later'},
                    //自动连播
                    'playListAutoPlay':{[BILI_3_X_VIDEO]: '.auto-play:contains(自动连播)'},

                    //视频选集/连播列表
                    //'videoList':{[BILI_3_X_VIDEO]: '.list-box,.video-section-list'},

                    //右键菜单
                    'playerContextMenu':{[BILI_2_X]:'.bilibili-player-context-menu-container.black.bilibili-player-context-menu-origin', [BILI_3_X_VIDEO]:'.bpx-player-contextmenu.bpx-player-black'}, //右键菜单
                    'hotkeyPanel':{[BILI_2_X]:'.bilibili-player-hotkey-panel-container', [BILI_3_X_VIDEO]:'.bpx-player-hotkey-panel'}, //快捷键说明面板
                    'hotkeyPanelClose':{[BILI_2_X]:'.bilibili-player-hotkey-panel-close', [BILI_3_X_VIDEO]:'.bpx-player-hotkey-panel-close'}, //快捷键说明面板关闭按钮
                    //'videoInfo':{[BILI_2_X]:'.bilibili-player-video-info', [BILI_3_X_VIDEO]:'.bpx-player-info'}, //视频统计信息
                    'videoInfoClose':{[BILI_2_X]:'.bilibili-player-video-info-close', [BILI_3_X_VIDEO]:'.bpx-player-info-close'}, //视频统计信息关闭按钮
                    'videoInfoContainer':{[BILI_2_X]:'.bilibili-player-video-info-container', [BILI_3_X_VIDEO]:'.bpx-player-info-container'}, //视频统计信息
                    'videoInfoShow':{[BILI_2_X]:'.bilibili-player-video-info-container active', [BILI_3_X_VIDEO]:'.bpx-player-info-container'}, //视频统计信息面板显示
                    'DOMNodeInsertedVideoInfoShow':{[BILI_2_X]:'.bilibili-player-video-info-container active', [BILI_3_X_VIDEO]:'.info-line'}, //
                },
                set_bb(_bb_type) {
                    try {
                        bb_type = _bb_type;
                        for(var k in this.bb_class_data){
                            //var class_str = this.bb_class_data[k][bb_type] || this.bb_class_data[k][[BILI_2_X]] || this.bb_class_data[k][[ALL]];
                            let cc = this.bb_class_data[k];
                            var class_str = cc[bb_type] || cc[Object.keys(cc).find((t)=>{ return bb_type.indexOf(t) !== -1 })] || cc[[ALL]];
                            bb[k] = class_str;
                        }
                    } catch (error) {
                        log(error)
                    }
                },
           };

        function deep_clone(obj){ return JSON.parse(JSON.stringify(obj)) }

        class keybindingKeyString{
            mergeSpace(str) { return str.replace(/\s+/g, ' ') }
            delSpace(str) { return str.replace(/\s+/g, '') }
            uppercaseFirst(str) { return str[0].toUpperCase() + str.substr(1) }
            getkeyCode(k) {
                var keyCodes = {
                    300: '滚↑轮',
                    301: '滚↓轮',
                    302: '鼠标左键',
                    303: '鼠标右键',
                    304: '鼠标中键',
                    305: '鼠标左前侧键',
                    306: '鼠标左后侧键',
                    307: '鼠标右前侧键',
                    308: '鼠标右后侧键',
                    309: '鼠标中前侧键',
                    310: '鼠标中后侧键',

                    0: "",
                    3: "break",
                    8: "Backspace",
                    9: "Tab",
                    12: "Clear",
                    13: "Enter",
                    16: "Shift",
                    17: "Ctrl",
                    18: "Alt",
                    19: "PauseBreak",
                    20: "CapsLock",
                    27: "Escape",
                    32: "Space",
                    33: "PageUp",
                    34: "PageDown",
                    35: "End",
                    36: "Home",
                    37: "←",   //LeftArrow ↑ ↓ ← →
                    38: "↑",   //UpArrow
                    39: "→",   //RightArrow
                    40: "↓",   //DownArrow
                    45: "Insert",
                    46: "Delete",
                    48: "0",
                    49: "1",
                    50: "2",
                    51: "3",
                    52: "4",
                    53: "5",
                    54: "6",
                    55: "7",
                    56: "8",
                    57: "9",
                    65: "A",
                    66: "B",
                    67: "C",
                    68: "D",
                    69: "E",
                    70: "F",
                    71: "G",
                    72: "H",
                    73: "I",
                    74: "J",
                    75: "K",
                    76: "L",
                    77: "M",
                    78: "N",
                    79: "O",
                    80: "P",
                    81: "Q",
                    82: "R",
                    83: "S",
                    84: "T",
                    85: "U",
                    86: "V",
                    87: "W",
                    88: "X",
                    89: "Y",
                    90: "Z",
                    93: "ContextMenu",
                    96: "NumPad0",
                    97: "NumPad1",
                    98: "NumPad2",
                    99: "NumPad3",
                    100: "NumPad4",
                    101: "NumPad5",
                    102: "NumPad6",
                    103: "NumPad7",
                    104: "NumPad8",
                    105: "NumPad9",
                    106: "NumPad_Multiply",
                    107: "NumPad_Add",
                    108: "NumPad_Separator",
                    109: "NumPad_Subtract",
                    110: "NumPad_Decimal",
                    111: "NumPad_Divide",
                    112: "F1",
                    113: "F2",
                    114: "F3",
                    115: "F4",
                    116: "F5",
                    117: "F6",
                    118: "F7",
                    119: "F8",
                    120: "F9",
                    121: "F10",
                    122: "F11",
                    123: "F12",
                    124: "F13",
                    125: "F14",
                    126: "F15",
                    127: "F16",
                    128: "F17",
                    129: "F18",
                    130: "F19",
                    144: "NumLock",
                    145: "ScrollLock",
                    166: "BrowserBack",
                    167: "BrowserForward",
                    170: "BrowserSearch",
                    172: "BrowserHome",
                    173: "AudioVolumeMute",
                    174: "AudioVolumeDown",
                    175: "AudioVolumeUp",
                    176: "MediaTrackNext",
                    177: "MediaTrackPrevious",
                    178: "MediaStop",
                    179: "MediaPlayPause",
                    180: "LaunchMail",
                    181: "LaunchMediaPlayer",
                    183: "LaunchApp2",
                    186: ";",
                    187: "=",
                    188: ",",
                    189: "-",
                    190: ".",
                    191: "/",
                    192: "`",
                    193: "ABNT_C1",
                    194: "ABNT_C2",
                    219: "[",
                    220: "\\",
                    221: "]",
                    222: "'",
                    223: "OEM_8",
                    226: "OEM_102",
                    229: "KeyInComposition",
                };
                return keyCodes[k];
            }
            getKCode(e){
                return e.ctrlKey<<18 | e.shiftKey<<17 | e.altKey<<16 | e.keyCode;
            }
            kcodeToKeys(kcode){
                let keys = [];
                let i = 0;
                if(kcode>>18 & 1) keys[i++] = 'Ctrl';
                if(kcode>>17 & 1) keys[i++] = 'Shift';
                if(kcode>>16 & 1) keys[i++] = 'Alt';
                let key = kcode & 0xFFFF;
                if(['ctrl', 'shift', 'alt'].indexOf(this.getkeyCode(key)?.toLowerCase()) === -1) keys[i++] = this.getkeyCode(key);
                return keys;
            }
            keysToStr(keys){
                let keystr = '';
                for (var index = 0; index < keys.length-1; index++) {
                    keystr += `${keys[index]} + `;
                }
                keystr += keys[index];
                return keystr;
            }
            strToKeys(str){ return str.split(/\s*\+\s*/) }
            stringifyKeyCode(e){ return this.keysToStr(this.kcodeToKeys(this.getKCode(e))) }
            is_ctl(str) { return ['ctrl', 'shift', 'alt'].indexOf(str.replace(/\s+/g,'').toLowerCase()) !== -1 }
            combine_same_keys(keystr_arr){
                //log(keystr_arr)
                if(keystr_arr.length <= 1) return keystr_arr;  //需要多于一个
                //判断相似结构
                let s0  = keystr_arr[0].split('+');
                let len0 = s0.length;
                let str0__1 = s0.slice(0,-1).toString();
                for (let i = 1; i < keystr_arr.length; i++) {
                    const s = keystr_arr[i].split('+');
                    //是否需要合并
                    if(len0 <= 1 || this.is_ctl(s.slice(-1).toString()) === true || len0 !== s.length || str0__1 !== s.slice(0,-1).toString()){
                        str0__1 = -1;
                        break;
                    }
                }

                if(str0__1 !== -1){  //组合键组合  Ctrl+X / Ctrl+A -> Ctrl+X/A
                    let arr = [this.keysToStr([...s0.slice(0,-1), s0.slice(-1)])];
                    for (let i = 1; i < keystr_arr.length; i++) {
                        const s = keystr_arr[i].split('+');
                        arr.push(s.slice(-1)[0]);
                    }
                    keystr_arr = arr;
                }else if(len0 > 1){  //避免歧义  Ctrl+X / A -> Ctrl+X/(A)
                    let arr = [];
                    for (let i = 0; i < keystr_arr.length; i++) {
                        const s = keystr_arr[i].split('+');
                        (s.length === 1 && this.is_ctl(s[0]) === false) ? arr.push('('+keystr_arr[i]+')') : arr.push(keystr_arr[i]);
                    }
                    keystr_arr = arr;
                }

                //滚轮组合  滚[↑↓]轮/滚[↑↓]轮 -> 滚轮
                if(keystr_arr.toString().match(/滚[↑↓]轮,滚[↑↓]轮/))
                    keystr_arr = keystr_arr.toString().replace(/滚[↑↓]轮,滚[↑↓]轮/, '滚轮').split(',');

                return keystr_arr;
            }
        }
        const [ON, OFF] = [true, false];
        var //config
            keycode = {
                'Enter': 13,
                'Ctrl': 17,
                'Esc': 27,
                'left': 37,
                'right': 39,
                'up': 38,
                'down': 40,
                'space': 32,
                '/': 191,
                'x': 88,
                'X': 88,
            },
            kb = new keybindingKeyString(),
            config = {
                //一些主要开关设置
                sets: {},
                groupFirst: 'commonCheckbox',
                group: 'commonCheckbox',
                //key唯一
                findGroupByKey(key){
                    for(let [group, {options}] of Object.entries(this.sets)){
                        // eslint-disable-next-line no-extra-boolean-cast
                        if(!!options[key]) return group;
                    }
                    return null;
                },

                getCheckboxSettingKeyKey(key, subkey) {
                    let group = this.findGroupByKey(key);
                    return group && this.sets[group]['options'][key][subkey];
                },
                setCheckboxSettingKeyKey(key, subkey, subval) {
                    let group = this.findGroupByKey(key);
                    group && (this.sets[group]['options'][key][subkey] = subval);
                },

                getCheckboxSettingStatus(key) {
                    let group = this.findGroupByKey(key);
                    return group && this.sets[group]['options'][key]['status'];
                },
                getCheckboxSettingFn(key) {
                    let group = this.findGroupByKey(key);
                    return group && this.sets[group]['options'][key]['fn'];
                },
                getCheckboxSettingArgs(key, subkey) {
                    let group = this.findGroupByKey(key);
                    if(group) {
                        if(subkey === undefined) return this.sets[group]['options'][key]['args'];
                        else return this.sets[group]['options'][key]['args'][subkey];
                    }
                },
                /*
                autoQualityVideo: { text: '自动选择最高质量视频', status: OFF,
                        args2:{ type: ['select'],
                                select: { items: ['浅色','深色'], value: '浅色', tip: [''] } }
                        },
                */
                getCheckboxSettingArgs2(key, type_name, subkey) {
                    let group = this.findGroupByKey(key)
                    if(group) {
                        if(subkey === undefined) return this.sets[group]['options'][key]['args2']
                        else return this.sets[group]['options'][key]['args2'][type_name][subkey]
                    }
                },
                getCheckboxSettingTempArgs(key, subkey) {
                    let group = this.findGroupByKey(key);
                    if(group) {
                        if(subkey === undefined) return this.sets[group]['options'][key]['tempargs'];
                        else return this.sets[group]['options'][key]['tempargs'][subkey];
                    }
                },
                setCheckboxSettingStatus(key, status) {
                    let group = this.findGroupByKey(key);
                    group && (this.sets[group]['options'][key]['status'] = status);
                },
                setCheckboxSettingTips(key, tip) {
                    let group = this.findGroupByKey(key);
                    group && (this.sets[group]['options'][key]['tip'] = tip);
                },
                setCheckboxSettingTempArgs(key, tempargs) {
                    let group = this.findGroupByKey(key);
                    group && (this.sets[group]['options'][key]['tempargs'] = deep_clone(tempargs));
                },
                // setCheckboxSettingArgs(key, args) {
                //     let group = this.findGroupByKey(key);
                //     group && (this.sets[group]['options'][key]['args'] = deep_clone(args));
                // },
                setCheckboxSettingArgs(key, args_or_subkey, subval) {
                    let group = this.findGroupByKey(key);
                    if(group) {
                        if(subval === undefined) this.sets[group]['options'][key]['args'] = deep_clone(args_or_subkey);
                        else this.sets[group]['options'][key]['args'][args_or_subkey] = subval
                    }
                },
                setCheckboxSettingArgs2(key, type_name, args_or_subkey, subval) {
                    let group = this.findGroupByKey(key);
                    if(group) {
                        if(subval === undefined) this.sets[group]['options'][key]['args2'] = deep_clone(args_or_subkey);
                        else this.sets[group]['options'][key]['args2'][type_name][args_or_subkey] = subval
                    }
                },
                storageCheckboxSetting() {
                    set_value('hhh_checkboxes', this.sets);
                },
                // defaultCheckboxSetting() {
                //     this.sets = JSON.parse(JSON.stringify(this.checkboxes));
                // },
                updataCheckboxSetting(new_sets) {
                    this.sets = JSON.parse(JSON.stringify(new_sets));
                },
                setKeySettingKeystr(key, keystr) {
                    //let group = this.findGroupByKey(key);
                    this.sets['keyBinding']['options'][key]['keystr'] = keystr
                },
                getKeySettingNonuse(key) {
                    return this.sets['keyBinding']['options'][key]['nonuse']
                },
                setKeySettingNonuse(key, nonuse) {
                    //log(key, nonuse)
                    this.sets['keyBinding']['options'][key]['nonuse'] = nonuse
                },
                getKeySettingKeycount(key) {
                    return this.sets['keyBinding']['options'][key]['keycount']
                },
                setKeySettingKeycount(key, keycount) {
                    //log(key, nonuse)
                    this.sets['keyBinding']['options'][key]['keycount'] = keycount
                },
                o2a(o, arr=[]){
                    for (let [key, val] of Object.entries(o)) {
                        arr.push(key);
                        if(typeof val === 'object'){
                            this.o2a(val, arr);
                        }
                    }
                    return arr;
                },

                //深度合并多个对象的方法
                deepAssign(){
                    //判断对象是否是一个纯粹的对象
                    function isPlainObject(obj){
                        return typeof obj === 'object' && Object.prototype.toString.call(obj) === '[object Object]'
                    }

                    let len = arguments.length, target = arguments[0]
                    if(!isPlainObject(target)){
                        target = {}
                    }
                    for (let i = 1; i < len; i++){
                        let source = arguments[i]
                        if( isPlainObject( source ) ){
                            for( let s in source ){
                                if ( s === '__proto__' || target === source[s] ) {
                                    continue
                                }
                                if( isPlainObject( source[s] ) ){
                                    target[s] = config.deepAssign(target[s], source[s])
                                }else{
                                    target[s] = source[s]
                                }
                            }
                        }
                    }
                    return target
                },
                //根据dest_sets找src_sets中没有的
                getOptionsDiff(src_sets, dest_sets){
                    // log('------1------')
                    // log(src_sets)
                    // log(dest_sets)
                    // log('------2------')
                    function getOptionsKey(o){
                        let options = {}
                        for (let key of Object.keys(o)) {
                            options[key] = Object.keys(o[key]['options'])  //转换为数组
                        }
                        return options
                    }

                    let diffOptions = []
                    
                    let src_mainkeys = Object.keys(src_sets)
                    for (let mainkey of Object.keys(dest_sets)) {
                        //log(mainkey)
                        if(src_mainkeys?.includes(mainkey) === false){
                            //log('--',mainkey)
                            diffOptions.push([mainkey, ''])
                        }
                    }

                    let src_options = getOptionsKey(src_sets)
                    // eslint-disable-next-line no-unused-vars
                    let dest_options = getOptionsKey(dest_sets)
                    // log('------3------')
                    // log(src_options)
                    // log(dest_options)
                    for (let key of Object.keys(dest_sets)) {
                        let option = dest_sets[key]['options']
                        for(let k of Object.keys(option)){
                            if(src_options[key]?.includes(k) === false){
                                log(key,k)
                                diffOptions.push([key, k])
                            }
                        }
                    }
                    return diffOptions
                },
                //是否有重复key
                compareDuplicateKey(sets, excludeType = ['key']){  //排除指定类型
                    let bucket = {}
                    for (let key of Object.keys(sets)) {
                        if(excludeType.includes(sets[key]['type']) === true) continue
                        let option = sets[key]['options']
                        for(let k of Object.keys(option)){
                            if(bucket[k] === true) { log('checkboxes包含重复key!!!: ', k); return }
                            bucket[k] = true
                        }
                    }
                },
                getCheckboxSetting() {
                    this.sets = get_value('hhh_checkboxes') || JSON.parse(JSON.stringify(this.checkboxes))
                    //是否有重复key
                    this.compareDuplicateKey(this.checkboxes)
                    if(JSON.stringify(this.o2a(this.sets)) !== JSON.stringify(this.o2a(this.checkboxes))){
                        //log('设置更新，设置为默认');
                        //log(JSON.stringify(this.o2a(this.sets)))
                        //log(JSON.stringify(this.o2a(this.checkboxes)))

                        log('设置更新，合并更新设置')
                        for(let currDiff of this.getOptionsDiff(this.sets, this.checkboxes)){
                            log('增加设置项:', currDiff[0], currDiff[1])
                        }
                        this.sets = this.deepAssign({}, this.checkboxes, this.sets)
                        for(let currDiff of this.getOptionsDiff(this.checkboxes, this.sets)){
                            log('去除设置项:', currDiff[0], currDiff[1])
                            if(currDiff[1] !== '') delete this.sets[currDiff[0]].options[currDiff[1]]
                            else delete this.sets[currDiff[0]]
                        }
                    }
                    this.storageCheckboxSetting()
                },
                findKeyBinding(curr_key){
                    let arr = [];
                    for (let [k, {text, keystr, keycount, delimiter, syskey, nonuse}] of Object.entries(config.sets['keyBinding'].options)) {
                        //config.sets中查找
                        if(keystr === undefined) continue
                        let keys = keystr.split(/\s+/)
                        keys.forEach((key, index) => {
                            if(keycount !== 0 && curr_key === key){
                                arr.push({id:k, text: text, index: index, key: key, is_system_key: syskey, nonuse: nonuse})
                            }
                        })
                    }
                    return arr
                },

                //options 里的 key 不能重复，不包含快捷键key
                checkboxes: {
                    commonCheckbox: {
                        options: {
                            autoPlay: { text: '自动播放', status: OFF, tip: '' },
                            autoLightOff: { text: '自动关灯', status: OFF, tip: '' },
                            autoFullScreen: { text: '自动全屏（浏览器限制无法使用）', status: OFF, tip: '', disable: ON },
                            autoWebFullScreen: { text: '自动网页全屏', status: OFF, tip: '' },
                            autoWideScreen: { text: '自动宽屏', status: OFF, tip: '' },
                            videoRepeat: { text: '自动洗脑循环', status: OFF, tip: '' },
                            lightOffWhenPlaying: { text: '播放时自动关灯', status: OFF, fn: 'lightOffWhenPlaying' },
                            lightOnWhenPause: { text: '暂停时自动开灯', status: OFF, fn: 'lightOnWhenPause' },
                            lightOnWhenLike: { text: '关灯状态时滚动屏幕控制开关灯', status: OFF, tip: '默认下滚超过0.3屏开灯，方便关灯时点赞、评论等', fn: 'lightOnWhenLike',
                                               args:{ screen_top: 0.3, opt: { tip: ['占屏比（0.0~1.0）'] } } },
                            autoQualityVideo: { text: '自动选择视频画质', status: OFF, tip: '',
                                                args2:{ type: ['select'],
                                                select: { items: ["自动最高", "真彩 HDR", "超清 4K", "高清 1080P60", "高清 1080P+", "高清 1080P", "高清 720P", "清晰 480P", "流畅 360P", "自动"],
                                                          data_value: [Number.MAX_SAFE_INTEGER, 125, 120, 116, 112, 80, 64, 32, 16, 0],
                                                          value: 80, tip: ['如果当前视频没有选定画质，自动选择当前最接近的高一级画质，默认：高清 1080P'] } }
                                                 },
                            autoOpenDanmu: { text: '自动打开弹幕', status: ON, tip: '', fn: 'autoOpenDanmu' },
                            rememberVideoRepeat: { text: '记忆洗脑循环（B站已添加此功能）', status: ON, tip: '记住最后选择，优先级低于【自动洗脑循环】', disable: ON }, //优先级低于videoRepeat
                            dblclickFullScreen: { text: '双击或中键、功能键全屏', status: ON, tip: '', fn: 'dblclickFullScreen' },
                            volumeControlWhenNonFullScreen: { text: '非全屏滚轮音量调节', status: ON, tip: '', fn___: 'wheel_volumeHint', 
                                                              args:{ screen_left: 0.3, screen_rght: 0.7, opt: { tip: ['鼠标有效范围（全屏0.0~1.0）'] } } },  //0~1全屏
                            volumeControlWhenPause: { text: '非全屏暂停时滚轮音量调节', status: ON, tip: '' },
                            danmuOpacityControl: { text: '弹幕透明度控制', status: ON, tip: 'Ctrl + 滚轮', fn___: 'wheel_opacity' },
                                                   //args:{ delta: 5, opt: { tip: ['调节幅度%'] } } }, //ctrl+滚轮
                            keyVideoSpeed: { text: '键盘调节视频速度', status: ON, tip: 'Ctrl + ↑↓' },
                            removeVideoTopMask: { text: '去掉顶部mask', status: ON, tip: '', fn: 'removeVideoTopMask' },
                            jumpElectric: { text: '跳过充电鸣谢', status: ON, fn: 'jumpElectric' }, //2.69.4版本B站取消充电鸣谢，2.72又加回来了
                            //removeMostViewedListener: { text: '删除动态首页UP主动态提示', status: ON },
                        },
                        btn: '常用设置',
                        type: 'checkbox'
                    },
                    
                    otherCheckbox: {
                        options: {
                            openHotKey: { text: '开启自定义快捷键', status: ON, tip: '', fn: 'set_hotkey' },
                            reloadDanmuku: { text: '快进快退恢复重载弹幕效果', status: OFF }, //快进快退恢复重载弹幕效果  3.13版本取消默认不重载效果，改回默认重载弹幕
                            loopPlayback: { text: '开启段落循环', status: OFF, tip: 'Ctrl+左键点击进度条设定段落循环 / 设定后L键切换', fn: 'loopPlayback' },
                            hideThreePopup: { text: '隐藏屏幕三连弹窗', status: OFF, tip: '', fn: 'hideThreePopup' },
                            hideScorePopup: { text: '隐藏屏幕打分弹窗', status: OFF, tip: '', fn: 'hideScorePopup' },
                            expandList: { text: '订阅合集列表自动展开', status: ON, tip: '', fn: 'expand_list',
                                          args:{ columns: 10, opt: { tip: ['列表展开高度（行）'] } } },
                            expandTitle: { text: '订阅合集标题宽度自动展开', status: ON, tip: '加宽标题栏宽度', fn: 'fnarr.expand_title',
                                           args:{ width: 300, is_expand: OFF, opt: { tip: ['标题展开宽度限制（像素），默认加宽300px，-1表示按最大长度展开，0表示以滚动条形式展开'] }, /*old_width: '100%'*/ } },
                            collectionFilter: { text: '播放页收藏夹关键字过滤', status: ON, tip: '', fn: 'collection_filter' },
                            saveRecommendList: { text: '记忆首页推荐列表（暂无法设置）', status: ON, tip: '', fn: 'run_save_recommend_list', disable: ON },
                            // onlinePreview: { text: '当前在线视频预览（暂无法设置）', status: ON, tip: '', fn: 'run_online_preview', disable: ON },
                            openVideoInNewTab: { text: '新窗口打开连播列表视频', status: OFF, tip: '点击右侧自动连播列表视频在新窗口打开', fn: 'run_rec_list_newtab' },
                            customPlayRate: { text: '开启自定义倍速播放', status: ON, tip: '长按 → 键', fn: 'customPlayRate', 
                                              args:{ rate: 2.0, opt: { tip: ['播放倍速（倍），系统默认3倍'] } } },
                            dynamicSpace: { text: '合理化空格键', status: ON, tip: 'B站空格键不合理，恢复非视频焦点时的默认效果（翻页）' },
                            danmuAreaSwicth: { text: '弹幕显示区域切换设置', status: ON, tip: '弹幕显示区域大切换到小时重新加载弹幕' },
                            //showDynListContent: { text: '动态首页显示/隐藏简介', status: ON, tip: '可在当前页面显示/简介隐藏内容' },
                            favSetting: { text: '收藏夹长度/行高/过滤（暂无法设置）', status: ON, tip: '', disable: ON },
                            
                            //__line__1: { text: '', type: 'line', status: OFF, tip: '', },
                            
                            memoryProgress: { text: '记忆选集视频进度', status: ON, tip: '在选集列表里用颜色和进度条指示', fn: 'fnarr.memory_multipart_progress' },
                                autoJumpMemoryProgress: { text: '选集视频自动跳转', status: OFF, level: 1 },
                            autoSubtitle: { text: '自动开启字幕', status: OFF, tip: '如果当前视频有字幕，自动开启' },

                            independentListPlayControl: { text: '选集/合集等独立连播控制', status: ON, tip: '接管合集等列表形式的播放控制方式，系统【自动连播】、【洗脑循环】将会失效', fn: 'list_play_control',
                                                          items: ['自动连播', '列表循环', '单集循环', '播完暂停'], default: '自动连播',
                                                          args:{ second: 3, opt: { tip: ['连播时间间隔(秒)，0表示立即播放下一P'] } } },

                            autoOffListPlay: { text: '自动关闭系统自动连播', status: ON, fn: 'autooff_listplay' },
                        },
                        btn: '其他设置',
                        type: 'checkbox'
                    },
                    
                    otherCheckbox2: {
                        options: {
                            //不显示有明显变化的提示，关灯、关弹幕等，因为对有些人来说这些操作变化明显可见，提示反而多余且遮挡屏幕
                            hotKeyHint: { text: '快捷键屏幕提示', status: OFF, tip: '不显示有明显变化的提示，关灯、弹幕等' },
                            sortList: { text: '添加合集播放、弹幕数或上传日期并支持排序', status: ON, tip: '网页刷新后生效' },
                                addDateKey: { text: '增加上传日期关键字', status: OFF, tip: '', level: 1 },
                            dynamicMainheader: { text: '动态显示隐藏BiliBili头部标题栏', status: OFF, tip: '', fn: 'dynamic_hide_mainheader' },
                            autoLike: { text: '自动点赞', status: OFF, tip: '可指定播放开始X秒后点赞（默认15秒），视频长度不足的播放完成后点赞', fn: 'auto_like', 
                                        args:{ second: 15, opt: { tip: ['播放0~300秒后点赞【0代表打开页面即点赞】'] } } },
                                likeFollowed: { text: '只自动点赞已关注UP主视频', status: OFF, level: 1 },
                            opacityPlayerSendingArea: { text: '关灯时淡化弹幕发送区域', status: OFF, tip: '', fn: 'opacity_player_sending_area',
                                                        args:{ opacity: 10, opt: { step: 5, min: 0, max: 100, tip: ['淡化幅度0~100%'] } } },
                            toolbarCloneToDmRoot: { text: '点赞等按钮上移到弹幕栏', status: OFF, tip: '网页全屏等情况时方便点赞', fn: 'toolbar_cloneto_dmroot' },
                                isRemoveVideoInfo: { text: '隐藏弹幕栏左侧在线人数等信息', status: OFF, tip: '如果觉得弹幕栏拥挤或屏幕小的可选', level: 1 },
                            
                            delayShareHoverTip: { text: '延迟分享按钮悬浮提示', status: ON, tip: '分享按钮提示框影响体验，延迟300ms提示', fn: 'delay_share_hover_tip' },
                            // videoSpeedSet: { text: '', status: OFF, tip: '' },  //video_speed_set
                            videoSpeedDefault: { text: '指定视频默认播放速度', status: OFF, tip: '',
                                                 args:{ speed: 1.0, opt: { step: 0.05, min: 0.1, max: 20, tip: ['范围0.1~20'] } } },
                            
                            listFilter: { text: '合集类视频过滤', status: ON, tip: '过滤框在合集列表上方，根据关键字过滤，输入前缀字符使用以下功能——#正则表达式、@标题字数，例子：#第.+集，@12', fn: 'list_filter' },
                            showListItemInControlBar: { text: '宽屏时在控制栏显示选集按钮', status: OFF, tip: '与全屏时效果相同', fn: 'show_list_item_in_control_bar' },
                            
                            normalVideoPlayCount: { text: '视频标题抬头显示播放次数', status: ON, tip: '开启后会自动记忆播放次数，关闭后停止计数', fn: 'normal_video_play_count',
                                                    args:{ second: 0, opt: { step: 1, min: 0, tip: ['可指定播放X秒后开始计数，0表示打开网页即计数（默认0）'] } } },
                                                    
                            addTagsToVideoTitle: { text: '视频标题抬头显示tags', status: ON, tip: '视频属于哪个区等', fn: 'add_tags_to_video_title' },

                            addDMInfoToTopTitle: { text: '加入已填装弹幕等信息到视频顶部标题', status: ON, tip: '全屏时显示', fn: 'add_dm_info_to_top_title' },
                            resetVideo: { text: '打开视频后强制从最开始播放', status: OFF, tip: 'B站默认会记忆视频播放进度，开启后会强制从最开始播放' },

                            homepageSetting: { text: '', status: ON, default: 5, show: OFF },  //设置内不显示，只作为设置项保存

                            settingBox: { text: '', status: ON, aspect: '0:0', show: OFF },  // 0:0、4:3、16:9
                                                        
                        },
                        btn: '其他设置Ⅱ',
                        type: 'checkbox'
                    },

                    keyBinding: {
                        options: {
                            'lightOff': { text: '关灯/开灯', keystr: 'A', keycount: 1, keycode: 0, nonuse: OFF, }, //NumPad_Decimal
                            'onePerVolumeControl':  { text: '非全屏音量调节${step}%', keystr: '滚↑轮 滚↓轮 NumPad_Decimal NumPad0', keycount: 4, delimiter: '、', nonuse: OFF, 
                                                      tempargs: [ {name: 'step', value: 1, opt: { step: 1, min: 0, max: '100', tip: ['调节幅度%'] }}, ], },
                            'fivePerVolumeControl': { text: '非全屏音量调节${step}%', keystr: '↑ ↓', keycount: 2, nonuse: OFF, 
                                                      tempargs: [ {name: 'step', value: 5, opt: { step: 5, min: 0, max: '100', tip: ['调节幅度%'] }}, ], },
                            'webFullscreen': { text: '网页全屏', keystr: 'W', keycount: 1, nonuse: OFF, },
                            'widescreen': { text: '宽屏模式', keystr: 'Q', keycount: 1, nonuse: OFF, },  //nonuse test
                            'danmu': { text: '开关弹幕', keystr: 'D', keycount: 1, nonuse: OFF, },
                            //'danmuTopBottom': { text: '开关顶部/底部弹幕', keystr: 'T B', keycount: 2, nonuse: OFF, },
                            'danmuTopBottomColor': { text: '开关固定/彩色和特殊弹幕', keystr: 'T B', keycount: 2, nonuse: OFF, },
                            'videoRepeat': { text: '洗脑循环', keystr: 'R', keycount: 1, nonuse: OFF, },
                            'addsubDanmuOpacity': { text: '减增弹幕透明度${step}%', keystr: 'Z C', keycount: 2, nonuse: OFF, 
                                                    tempargs: [ {name: 'step', value: 10, opt: { step: 10, min: 0, max: '100', tip: ['调节幅度%'] }}, ], },
                            'addsubDanmuFontsize': { text: '减增弹幕字号${step}%', keystr: 'V N', keycount: 2, nonuse: OFF, 
                                                     tempargs: [ {name: 'step', value: 10, opt: { step: 10, min: 0, max: '100', tip: ['调节幅度%'] }}, ], },
                            'danmuArea': { text: '弹幕显示区域 1/10屏～不限', keystr: '1 2 3 4 5', keycount: 5, delimiter: '、', nonuse: OFF, },
                            'wheelDanmuOpacity': { text: '增减弹幕透明度${step}%', keystr: 'Ctrl+滚↑轮 Ctrl+滚↓轮', keycount: 2, nonuse: OFF, 
                                                   tempargs: [ {name: 'step', value: 5, opt: { step: 5, min: 0, max: '100', tip: ['调节幅度%'] }}, ], },
                            'fastForwardBackward30s': { text: '快进/快退${second}s', keystr: 'Ctrl+← Ctrl+→', keycount: 2, nonuse: OFF,
                                                        tempargs: [ {name: 'second', value: 30, opt: { step: 10, min: 0, max: '600', tip: ['调节幅度-秒'] }}, ], },
                            'frameByFrame': { text: '逐帧操作', keystr: 'Shift+← Shift+→', keycount: 2, keycode: 0, tip: '', keyshow: 'Shift + ←/→', nonuse: OFF, },
                            'keyVideoSpeed': { text: '调节视频播放速度', keystr: 'Ctrl+↑ Ctrl+↓', keycount: 2, nonuse: OFF, },
                            'keyVideoSpeed0dot1': { text: '0.1倍速调节视频播放速度', keystr: 'Ctrl+NumPad_Decimal Ctrl+NumPad0', keycount: 2, nonuse: OFF, },
                            'ctrl_enterFullScreen': { text: '全屏', keystr: 'Ctrl+Enter', keycount: 1, nonuse: OFF, },
                            'danmuZoomWithScreen': { text: '弹幕随屏幕缩放', keystr: 'S', keycount: 1, nonuse: OFF, },
                            'like': { text: '点赞、投币、收藏、长按一键三连', keystr: 'Y U I O', keycount: 4, delimiter: '、', nonuse: OFF, },
                            'listCtrlSwitch': { text: 'list播放方式切换', keystr: '`', keycount: 1, nonuse: OFF, },

                            'setCustomPlayRate': { text: '调节自定义倍速速度', keystr: 'Shift+↑ Shift+↓', keycount: 2, nonuse: OFF, },
                            'subtitle': { text: '开关字幕', keystr: 'E', keycount: 1, nonuse: OFF, },
                            'watchLater': { text: '开关稍后再看', keystr: 'H', keycount: 1, nonuse: OFF, },
                            'enableDarkMode': { text: '开关深色模式', keystr: 'X', keycount: 1, nonuse: OFF, },

                            //enableDarkMode: { text: '使用深色模式', status: OFF, tip: '使用bilibili自带dark.css', fn: 'toggle_bili_dark_light_mode' },
                            // enableDarkMode: { text: '使用深色模式', status: OFF, tip: '使用bilibili自带dark.css/light.css切换深色/浅色模式',
                            //                   args:{ type: 'select', opt: { items: ['浅色','深色'], min: 0, tip: ['可指定播放X秒后开始计数，0表示打开网页即计数（默认0）'] } } },

                            'dblclickFullScreen': { text: '全屏', keystr: '双击/中键/功能键', keycount: -1, },  //keycount <= 0 不能更改
                            'loop': { text : '设定段落循环 / 设定后切换', keystr: 'Ctrl+鼠标左键 L', keycount: -2, },
                            'dynamicProgress': { text : '快进/快退时显示醒目进度条', keystr: '← →', keycount: -2, },
                            'dynamicSpace': { text : '合理空格键', keystr: 'Space', keycount: -1, },
                            'dynamicEsc': { text : '优先取消右键菜单等', keystr: 'Escape', keycount: -1, },
                            'dynamicEnter': { text : '有投币框时回车投币', keystr: 'Enter', keycount: -1, },

                            'followingSyskeys': { text:'以下是系统热键，可屏蔽但不能更改', keycount: 0, },  //display: 'none' 不显示

                            //系统热键，用sys前缀表示
                            'sysLike': { text:'单次点赞/取消点赞，长按一键三连', keystr:'Q', keycount: 1, syskey: ON, },  //display: 'none' 不显示
                            'sysCoin': { text:'投币', keystr:'W', keycount: 1, syskey: ON, },
                            'sysCollect': { text:'收藏', keystr:'E', keycount: 1, syskey: ON, },
                            'sysThree': { text:'长按一键三连', keystr:'R', keycount: 1, syskey: ON, },
                            'sysPlayPause': { text:'播放/暂停', keystr:'Space', keycount: 1, syskey: ON, },
                            'sysFastForward': { text:'单次快进5s，长按倍速播放', keystr:'→', keycount: 1, syskey: ON, },
                            'sysFastBackward': { text:'快退5s', keystr:'←', keycount: 1, syskey: ON, },
                            'sysVolume+': { text:'音量增加10%', keystr:'↑', keycount: 1, syskey: ON, },
                            'sysVolume-': { text:'音量降低10%', keystr:'↓', keycount: 1, syskey: ON, },
                            'sysEscFullScreen': { text:'退出全屏', keystr:'Esc', keycount: 1, syskey: ON, },
                            'sysPlayPause2': { text:'播放/暂停', keystr:'媒体键play/pause', keycount: 1, syskey: ON, },
                            'sysFullScreen': { text:'全屏/退出全屏', keystr:'F', keycount: 1, syskey: ON, },
                            'sysPrecPart': { text:'多P上一个', keystr:'[', keycount: 1, syskey: ON, },
                            'sysNextpart': { text:'多P下一个', keystr:']', keycount: 1, syskey: ON, },
                            'sysSendDM': { text:'发弹幕', keystr:'Enter', keycount: 1, syskey: ON, },
                            'sysSwitchDM': { text:'开启/关闭弹幕', keystr:'D', keycount: 1, syskey: ON, },
                            'sysSwitchMute': { text:'开启/关闭静音', keystr:'M', keycount: 1, syskey: ON, },
                            'sysOneSpeed': { text:'一倍速（正常倍速）', keystr:'Shift+1', keycount: 1, syskey: ON, },
                            'sysDoubleSpeed': { text:'二倍速', keystr:'Shift+2', keycount: 1, syskey: ON, },
                        },
                        btn: '快捷键设置',
                        type: 'key'
                    },
                    
                    // otherSetting: {
                    //     options: {
                    //         listPlayControl: { items: ['自动连播', '列表循环', '单集循环', '播完暂停'], init: '自动连播', status: ON },
                    //     },
                    //     btn: '其他设置',
                    //     type: 'value'
                    // },

                    //参数 TODO
                    // args: {
                    //     options: {
                    //     },
                    //     btn: '参数',
                    //     type: 'args'
                    // },

                    /*
                        // quickDo: {
                        //     fullscreen: { value: 'f', text: '全屏', },
                        //     webFullscreen: { value: 'w', text: '网页全屏', },
                        //     widescreen: { value: 'q', text: '宽屏', },
                        //     subSpeed: { value: '[', text: '减少速度', },
                        //     addSpeed: { value: ']', text: '增加速度', },
                        //     resetSpeed:  { value: '\\', text: '重置速度', },
                        //     danmu: { value: 'd', text: '弹幕', },
                        //     playAndPause: { value: 'p', text: '暂停播放', },
                        //     prevPart: { value: 'k', text: '上一P', },
                        //     nextPart: { value: 'l', text: '下一P', },
                        //     showDanmuInput: { value: 'enter', text: '发弹幕', },
                        //     mirror: { value: 'j', text: '镜像', },
                        //     danmuTop: { value: 't', text: '顶部弹幕', },
                        //     danmuBottom: { value: 'b', text: '底部弹幕', },
                        //     danmuScroll: { value: 's', text: '滚动弹幕', },
                        //     danmuPrevent: { value: 'c', text: '防挡弹幕', },
                        //     rotateRight: { value: 'o', text: '向右旋转', },
                        //     rotateLeft: { value: 'i', text: '向左旋转', },
                        //     lightOff: { value: 'y', text: '灯', },
                        //     download: { value: 'z', text: '下载', },
                        //     seek: { value: 'x', text: '空降', },
                        //     mute: { value: 'm', text: '静音', },
                        //     jump: { value: '', text: '跳转', },
                        //     scroll2Top: { value: '', text: '回到顶部', },
                        //     jumpContent: { value: '', text: '跳过鸣谢', },
                        //     playerSetOnTop: { value: '', text: '播放器置顶', },
                        //     setRepeatStart: { value: '', text: '循环起点', },
                        //     setRepeatEnd: { value: '', text: '循环终点', },
                        //     resetRepeat: { value: '', text: '清除循环点', },
                        //     subVolume: { value: '', text: '减少音量', },
                        //     addVolume: { value: '', text: '增加音量', },
                        //     subProgress: { value: '', text: '快退', },
                        //     addProgress: { value: '', text: '快进', },
                        // },
                    */
                },
                //快捷键
                QDs: {}, //未使用
                getQD(key) {
                    return this.QDs[key];
                }, //未使用
                saveQD() {
                    for (let [key, { value, text }] of Object.entries(this.hotKeyMenu)) {
                        this.QDs[key] = {value: value, keyCode: value.charCodeAt(), text: text};
                    }
                }, //未使用
                hotKeyMenu: {  //只是右键菜单的数据，如需改动快捷键改run函数
                    'volumeControl': { value: '滚轮', text: '音量调节', },
                    'lightOff': { value: 'A', text: '关灯/开灯', },
                    'webFullscreen': { value: 'W', text: '网页全屏', },
                    'widescreen': { value: 'Q', text: '宽屏模式', },
                    'danmu': { value: 'D', text: '开关弹幕', },
                    'danmuTopBottom': { value: 'T/B', text: '顶部/底部弹幕', },
                    'videoRepeat': { value: 'R', text: '洗脑循环', },
                    'addsubDanmuOpacity': { value: 'Z/C', text: '减增弹幕透明度10%', },
                    'addsubDanmuFontsize': { value: 'V/N', text: '减增弹幕字号10%', },
                    'danmuArea': { value: '1、2、3、4、5', text: '弹幕显示区域 1/10屏～不限', },
                    // 'quarterArea': { value: '1', text: '1/4屏', },
                    // 'halfArea': { value: '2', text: '半屏', },
                    // 'threeQuarterArea': { value: '3', text: '3/4屏', },
                    // 'nonOverArea': { value: '4', text: '不重叠', },
                    // 'fullArea': { value: '5', text: '不限', },
                    'wheelDanmuOpacity': { value: 'Ctrl + 滚轮', text: '增减弹幕透明度5%', },
                    'fastForwardBackward30s': { value: 'Ctrl + ←/→', text: '快进/快退30s', },
                    'frameByFrame': { value: 'Shift + ←/→', text: '逐帧操作', },
                    'keyVideoSpeed': { value: 'Ctrl + ↑/↓', text: '调节视频播放速度', },
                    'dblclickFullScreen': { value: '双击/中键/功能键', text: '全屏', },
                    'ctrl_enterFullScreen': { value: 'Ctrl+Enter', text: '全屏', },
                    'danmuZoomWithScreen': { value: 'S', text: '弹幕是否随屏幕缩放', },
                    'like': { value: 'Y、U、I、O', text: '点赞、投币、收藏、长按一键三连', },
                    'loop': { value: 'Ctrl + 左键 / L', text: '设定段落循环 / 设定后切换', },
                },
            };
        const assert = function(condition, message) {
            if (!condition)
                throw Error('Assert failed: ' + (message || 'Assertion failed'));
        }
        let log = console.log
        let dir = console.dir
        let err = console.error
        function get_value(key, default_value = undefined) { return JSON.parse(localStorage.getItem(key)) || default_value }
        function set_value(key, value) { localStorage.setItem(key, JSON.stringify(value)) }
        function sec2str(t){
            var d = Math.floor(t/86400),
                h = (''+Math.floor(t/3600)%24).slice(-2),
                m = ('0'+Math.floor(t/60)%60).slice(-2),
                s = ('0'+t%60).slice(-2);
            return (d>0?d+'天':'')+((d>0||h>0)?h+':':'')+m+':'+s;
        }
        // 对Date的扩展，将 Date 转化为指定格式的String
        // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
        // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
        // 例子： 
        // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
        // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
        Date.prototype.Format = function (fmt) {  
            var o = {
                "M+": this.getMonth() + 1, //月份 
                "d+": this.getDate(), //日 
                "h+": this.getHours(), //小时 
                "m+": this.getMinutes(), //分 
                "s+": this.getSeconds(), //秒 
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
                "S": this.getMilliseconds() //毫秒 
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }

        function waitForNode(nodeSelector, callback, time=100) {
            //log('----n---');
            if(--time < 0) {err('waitForNode 超时 '+nodeSelector); return false;}
            if(time < 0) return;
            var node = nodeSelector();
            if (node) {
                callback(node);
            } else {
                time-=1;
                setTimeout(function() { waitForNode(nodeSelector, callback, time); }, 50);
            }
        }
        // 功能：等待某个条件为真，直到超时
        // 参数：ifTrue：条件函数；callback：条件满足时的回调函数；time：超时时间，默认100ms
        function waitForTrue(ifTrue, callback, time=100) {
            // 减少超时时间
            if(--time < 0) { err('waitForTrue 超时 '+ifTrue); return false }
            // 保存当前函数引用，避免递归调用自身函数
            const fn = waitForTrue
            // 判断条件是否为真
            if (ifTrue()) {
                // 条件为真，执行回调函数
                callback(); return true
            } else {
                // 条件为假，设置定时器，递归调用自身函数
                setTimeout(function() { fn(ifTrue, callback, time) }, 50)
            }
        }
        function waitForTrueNoErr(ifTrue, callback, time=100) {
            if(--time < 0) return false
            const fn = waitForTrueNoErr
            if (ifTrue()) {
                callback(); return true
            } else {
                setTimeout(function() { fn(ifTrue, callback, time); }, 50)
            }
        }        
        //等待某个条件为真或者超时，执行回调函数
        function waitForTrueFalse(ifTrue, callback, time=100) {
            if(--time < 0) { callback(); return false }
            const fn = waitForTrueFalse
            if (ifTrue()) {
                callback(); return true
            } else {
                setTimeout(function() { fn(ifTrue, callback, time) }, 50)
            }
        }
        //等待某个条件为真或者超时，执行不同回调函数
        function waitForTrueTimeout(ifTrue, callback, callback2, time=100) {
            if(--time < 0) { callback2(); return false }
            const fn = waitForTrueTimeout
            if (ifTrue()) {
                callback(); return true
            } else {
                setTimeout(function() { fn(ifTrue, callback, time) }, 50)
            }
        }
        function waitForTrue_async(ifTrue, callback, time=100){
            return new Promise((resolve, reject)=>{
                let tid = setInterval(()=>{
                    if(--time < 0) { clearInterval(tid); reject('waitForTrue 超时 '+ifTrue) }
                    if (ifTrue()) { clearInterval(tid); callback(); resolve() }
                },50)
            })
        }
        function isTimeout(ifTrue, time=50){
            function waitForTimeout(ifTrue, callback, callback2, time=50) {
                if(--time < 0) { callback2(); return false }
                if (ifTrue()) { callback(); return true }
                else { setTimeout(function() { waitForTimeout(ifTrue, callback, callback2, time) }, 100) }
            }
            return new Promise((resolve)=>{ waitForTimeout(ifTrue, ()=>resolve(false), ()=>resolve(true), time) })
        }
        function geth5Player(){ return $('.bpx-player-video-wrap>video')[0] || $('.bpx-player-video-wrap bwp-video')[0] }
        function toggle_control_top(show) {
            if(bb_type.indexOf(BILI_2_X) !== -1){
                if($(bb['playArea']).hasClass('video-control-show') === true) $(bb['playVideoControlWrap']).mouseout();
                else $(bb['playVideoControlWrap']).mousemove();
            }else{
                if($('.bpx-player-container').attr('data-ctrl-hidden') === "true"){  //控制栏隐藏状态
                    if(show !== 'hide'){
                        $('.bpx-player-container').attr('data-ctrl-hidden', "false");
                        $('.bpx-player-control-entity').attr('data-shadow-show','false');
                    }
                }else{
                    if(show !== 'show'){
                        $('.bpx-player-container').attr('data-ctrl-hidden', "true");
                        $('.bpx-player-control-entity').attr('data-shadow-show','true');
                    }
                }
            }
        }
    
        function is_fullscreen() {
            //if(bb_type.indexOf(BILI_2_X) !== -1){ return bili_player.isFullScreen() }
            if(bb_type.indexOf(BILI_2_X) !== -1){ return $('#bilibiliPlayer').hasClass('mode-webfullscreen') || $('#bilibiliPlayer').hasClass('mode-fullscreen')  }
            else if(bb_type.indexOf(BILI_3_X_VIDEO) !== -1){ return $('.bpx-player-container').attr('data-screen') === 'web' || $('.bpx-player-container').attr('data-screen') === 'full' }  //normal wide web full
        }
        function fullscreen() { $(bb['fullScreen']).click() }
        function web_fullscreen() { $(bb['webFullScreen']).click() }
        function wide_screen() { $(bb['wideScreen']).click() }
        function watchLater() { $(bb['playWatchLater']).click() }
        function is_watchlater_added() { return $(bb['playWatchLater'])[0] && $(bb['playWatchLater']+'.added').length > 0 }
        function autooff_listplay(){ $('.continuous-btn:contains(自动连播)').click() }
        function subtitle() {
            let $list = $('.bpx-player-ctrl-subtitle-close-switch,.bpx-player-ctrl-subtitle-major .bpx-player-ctrl-subtitle-language-item')
            $list.each(function(i){
                // log($(this).hasClass('bpx-state-active'), i)
                if($(this).hasClass('bpx-state-active') === true){
                    // log(((i+1) % $list.length))
                    $list[((i+1) % $list.length)].click()
                    return false
                }
            })
        }
        function auto_top_quality_video(status) { //自动选择最高质量视频
            if(status !== ON || biliinfo.is_login !== true) return
            if(!biliinfo.vip_status) {
                //选大会员码率之下最高的
                if($('.bpx-player-ctrl-quality-menu-item:contains(大会员)').length !== 0) $('.bpx-player-ctrl-quality-menu-item:contains(大会员):last').next().click()
                else $('.bpx-player-ctrl-quality-menu-item:first').click()
            }else{
                $('.bpx-player-ctrl-quality-menu-item:first').click()
            }
        }
        function auto_quality_video(quality_text) { $(`.bpx-player-ctrl-quality-menu-item:contains(${quality_text})`).click() }
        function enableDarkMode() {
            let href = $('#__css-map__').attr('href')
            if(href.includes('/light.css')) $('#__css-map__').attr('href', href.replace("light.css", "dark.css"))
            else $('#__css-map__').attr('href', href.replace("dark.css", "light.css"))
        }

        function is_danmaku_show(){ return $(bb['danmakuSwitch']+' '+bb['switchInput']+':last')[0].checked }
        function lightoff() { $(bb['playSettingLightoff']).click() }
        function is_lightoff() {
            return window.player.getLightOff()  //新方法
            //if (bb_type.indexOf(BILI_2_X) !== -1) { return !bili_player.getPlayerState().lightOn }
            // if (bb_type.indexOf(BILI_2_X) !== -1) { return $('#bilibiliPlayer').hasClass('mode-light-off') }
            // else if(bb_type === BILI_3_X_MOVIE) { return $('.bpx-docker-major').hasClass('bpx-state-light-off') }
            // else if(bb_type.indexOf(BILI_3_X_VIDEO) !== -1) { return $('.bpx-docker-major').hasClass('bpx-state-light-off') }
        }
        function add_tip($tip, $node, args){
            //log('addtip '+$tip.length)
            $node.mouseover(function(){
                var e = this;
                var op = {};
                let t = setTimeout(function() {
                    $tip.appendTo(e);
                    let $this = $(e);
                    let $new_tip = $('.player-tooltips.tip.top-center.animation').css({top:0,left:0});

                    true === !!$this.data('tip') ? $.extend(true, op, $this.data('tip')) : $.extend(true, op, args);
                    $new_tip.find('.tooltip').text(op['text']);

                    let tip_new_top = $this.offset().top - $new_tip.offset().top - $new_tip.height();
                    //console.log('top:'+$this.offset().top+' tiptop: '+$new_tip.offset().top +' height: '+ $new_tip.height());
                    //console.log('left:'+$this.offset().left+' tipleft: '+$new_tip.offset().left +' width: '+ $this.width()+' tipwidth: '+ $new_tip.width());
                    //console.log('top:'+$this.css('top')+'left:'+$this.css('left'))
                    let tip_new_left = $this.offset().left - $new_tip.offset().left + ($this.width() - $new_tip.width())/2;
                    //console.log(tip_new_top+'  '+tip_new_left);
                    tip_new_left = tip_new_left <= 0 ? 0 : tip_new_left;
                    let diff_full_top = is_fullscreen() ? (op['diff_full_top'] || 0) : 0; //全屏时位置不同
                    $new_tip.css({'top':tip_new_top + op['top'] + diff_full_top, 'left':tip_new_left + op['left']}).addClass('active');
                }, op['millisec']);
                $(this).data('timeout', t);
            }).
            mouseout(function(){
                clearTimeout($(this).data('timeout'));
                $('.player-tooltips.tip.top-center.animation').removeClass('active');
                $('.player-tooltips.tip.top-center.animation').remove();
            })
        }
        //关灯按钮样式
        function lightoff_btn_css() {
            var body_brgb = 'rgb(160, 130, 110)';
            var dot_crgb = 'rgb(230, 200, 180)';
            var dot_brgb = 'rgb(50, 50, 50)';
            var dark_rgb = 'rgb(77, 77, 77)';
            if ($('#hhh_lightoff '+bb['switchInput'])[0].checked === false) {  //关灯
                $('#hhh_lightoff '+bb['switchBody']+':first').css('background-color', dark_rgb);
                $('#hhh_lightoff '+bb['switchBody']+':first>'+bb['switchDot']).css('color', dark_rgb);
                $(`#hhh_lightoff ${bb['switchLabel']}`).removeClass('checked');
            }
            else {
                $('#hhh_lightoff '+bb['switchBody']+':first').css('background-color', body_brgb);
                $('#hhh_lightoff '+bb['switchBody']+':first>'+bb['switchDot']).css({'color': dot_crgb, 'background-color': dot_brgb});
                $(`#hhh_lightoff ${bb['switchLabel']}`).addClass('checked');
            }
        }
        //关灯run
        function lightoff_run(){
            //关灯
            lightoff()

            //弹幕发送区域透明度
            opacity_player_sending_area(config.getCheckboxSettingStatus('opacityPlayerSendingArea'), [ config.getCheckboxSettingArgs('opacityPlayerSendingArea', 'opacity') ])
        }
        //手动关灯
        function lightoff_hand(lightoff_entry_state = LIGHT_DEFAULT){
            //关灯
            lightoff_run()

            //更新关灯按钮tip等
            lightoff_btn_tip()

            //记录手动关灯状态（排除lightOnWhenLike时产生的开关灯状态等）
            myinfo.hand_lightoff_state = is_lightoff()
            
            //网页滚动时控制开关灯
            lightOnWhenLike(config.getCheckboxSettingStatus('lightOnWhenLike'), config.getCheckboxSettingArgs('lightOnWhenLike', 'screen_top'))

            // if(lightoff_entry_state !== LIGHTON_LIKE) {
                //log('lightoff_entry_state:',lightoff_entry_state,'is_lightoff:', is_lightoff(), 'hand_lightoff_state:', myinfo.hand_lightoff_state)
            // }
        }
        //关灯按钮tip等
        function lightoff_btn_tip() {  // lightoff_entry_state - 此状态标明谁执行的关灯操作
            //屏幕关灯tip
            is_show_hint && (is_lightoff() ? showHint(parent, '#hhh_wordsHint', '关灯') : showHint(parent, '#hhh_wordsHint', '开灯'))

            //更新关灯按钮
            let $light_input = $('#hhh_lightoff '+bb['switchInput'])  // .bui-switch-input
            if(is_lightoff() === $light_input[0].checked) {  // checked==true开灯 false关灯
                $light_input[0].checked = !$light_input[0].checked
            }
            lightoff_btn_css()

            //更新关灯按钮tip，两种方式更新light_tip_text
            tip_update_3_X({ target: $('#hhh_lightoff'), tip_target: $('#hhh_tip'), gap: 6 })  //title参数为空，原tip自更新
            //$('#hhh_lightoff .tooltip').text(light_tip_text)  //2.x
        }
        //关灯按钮初始化
        function lightoff_init() {
            //插入关灯按钮
            $(`${bb['danmakuSwitch']}:first`).clone().prependTo(`${bb['danmakuRoot']}:first`)[0].id = 'hhh_lightoff';
            $('#hhh_lightoff '+bb['switchInput'])[0].checked = true;
            if(bb_type !== BILI_3_X_VIDEO_V1 && bb_type !== BILI_3_X_MOVIE) $(`#hhh_lightoff ${bb['switchDot']}`)[0].innerHTML = '灯';
            else{
                //开灯
                $('#hhh_lightoff').find('.bui-danmaku-switch-on svg').replaceWith(`
                    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path style="clip-rule:evenodd;fill-rule:evenodd" d="M 15.765 1.814 C 15.513 1.840 15.264 1.971 15.068 2.244 L 13.207 4.835 C 12.827 4.831 12.463 4.828 12.119 4.828 L 11.988 4.828 C 11.518 4.828 11.014 4.831 10.474 4.839 L 8.763 2.273 C 8.018 1.154 6.340 2.273 7.085
                    3.392 L 8.085 4.892 C 7.404 4.910 6.682 4.932 5.921 4.960 C 3.981 5.029 2.367 6.478 2.091 8.400 C 1.926 9.550 1.845 10.945 1.845 12.585 C 1.845 14.550 1.960 16.255 2.195 17.701 C 2.499 19.569 4.068 20.971 5.958 21.064 L 6.865 21.109 C 8.070 21.172 8.673 21.205 10.472
                    21.205 C 11.748 21.164 11.748 19.271 10.472 19.230 C 8.714 19.230 8.132 19.200 6.970 19.138 L 6.056 19.091 C 5.096 19.044 4.300 18.331 4.146 17.382 C 3.930 16.058 3.820 14.459 3.820 12.585 C 3.820 11.022 3.897 9.721 4.046 8.681 C 4.186 7.704 5.005 6.967 5.990 6.933 C
                    8.434 6.846 10.456 6.803 12.054 6.802 C 13.652 6.802 15.673 6.847 18.117 6.933 C 19.077 6.967 19.827 7.742 19.972 8.746 C 20.047 9.270 20.085 10.709 20.113 11.812 L 20.113 11.814 C 20.123 12.156 20.130 12.463 20.138 12.693 C 20.184 14.009 22.158 13.942 22.113 12.626 C
                    22.105 12.400 22.096 12.102 22.087 11.769 L 22.087 11.742 C 22.057 10.624 22.014 9.079 21.927 8.466 C 21.654 6.560 20.144 5.029 18.187 4.960 C 17.287 4.928 16.444 4.902 15.656 4.882 L 16.707 3.421 C 17.295 2.602 16.520 1.735 15.765 1.814 z M 8.896 8.152 C 8.896 9.808
                    8.883 10.962 8.855 11.613 C 8.831 12.260 8.747 12.892 8.605 13.513 C 8.466 14.134 8.271 14.693 8.017 15.189 C 7.764 15.682 7.456 16.112 7.095 16.480 C 7.359 16.756 7.695 17.191 8.105 17.783 C 8.838 16.784 9.358 15.814 9.667 14.871 C 10.122 15.390 10.560 15.912 10.980
                    16.441 L 12.052 15.396 C 11.413 14.729 10.733 14.076 10.011 13.439 C 10.067 13.104 10.114 12.726 10.152 12.302 C 10.850 11.691 11.511 11.083 12.136 10.478 L 11.126 9.562 C 10.911 9.845 10.622 10.200 10.261 10.630 C 10.289 9.891 10.302 9.065 10.302 8.152 L 8.896 8.152 z
                    M 11.751 8.625 L 11.751 9.947 L 14.052 9.947 L 14.052 15.357 C 14.052 15.915 13.792 16.195 13.271 16.195 C 12.872 16.195 12.387 16.176 11.814 16.136 C 11.971 16.575 12.099 17.059 12.203 17.585 A 1.939 1.750 0 0 1 13.539 17.101 A 1.939 1.750 0 0 1 14.625 17.402 C 14.708
                    17.370 14.808 17.345 14.871 17.304 C 15.103 17.160 15.277 16.953 15.392 16.683 C 15.507 16.414 15.564 16.082 15.564 15.691 L 15.564 9.947 L 17.458 9.947 L 17.458 8.625 L 11.751 8.625 z M 8.189 9.730 L 7.074 9.917 C 7.247 10.877 7.404 11.926 7.542 13.070 L 8.677 12.865 C 8.511 11.669 8.349 10.624 8.189 9.730 z "/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M22.846 14.627a1 1 0 00-1.412.075l-5.091 5.703-2.216-2.275-.097-.086-.008-.005a1 1 0 00-1.322 1.493l2.963 3.041.093.083.007.005c.407.315 1 .27 1.354-.124l5.81-6.505.08-.102.005-.008a1 1 0 00-.166-1.295z" fill="#00AEEC"/>
                    </svg>`
                 );
                //关灯
                $('#hhh_lightoff').find('.bui-danmaku-switch-off svg').replaceWith(`
                    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path style="clip-rule:evenodd;fill-rule:evenodd" d="M 15.765 1.814 C 15.514 1.840 15.264 1.971 15.068 2.244 L 13.207 4.835 C 12.826 4.831 12.464 4.828 12.119 4.828 L 11.988 4.828 C 11.518 4.828 11.014 4.831 10.474 4.839 L 8.765 2.273 C 8.020 1.154 6.340 2.273 7.085
                    3.392 L 8.085 4.890 L 8.083 4.890 C 7.402 4.909 6.680 4.933 5.919 4.960 C 3.979 5.030 2.367 6.478 2.091 8.400 C 1.926 9.549 1.845 10.943 1.845 12.583 C 1.845 14.548 1.961 16.253 2.197 17.699 C 2.500 19.567 4.068 20.970 5.958 21.064 C 7.861 21.158 9.276 21.205 11.472
                    21.205 C 12.748 21.164 12.748 19.271 11.472 19.230 C 9.666 19.234 7.860 19.188 6.056 19.091 C 5.096 19.043 4.300 18.331 4.146 17.382 C 3.931 16.058 3.820 14.459 3.820 12.585 C 3.820 11.022 3.896 9.721 4.046 8.681 C 4.186 7.704 5.004 6.968 5.990 6.933 C 8.434 6.847
                    10.456 6.802 12.054 6.802 C 13.652 6.803 15.673 6.846 18.117 6.933 C 19.076 6.966 19.829 7.742 19.972 8.746 C 20.048 9.270 20.085 10.709 20.113 11.812 L 20.113 11.814 C 20.122 12.156 20.130 12.465 20.138 12.695 C 20.184 14.011 22.159 13.942 22.113 12.626 C 22.105
                    12.400 22.097 12.102 22.087 11.769 L 22.087 11.742 C 22.057 10.624 22.015 9.079 21.927 8.466 C 21.655 6.559 20.145 5.029 18.187 4.960 C 17.288 4.928 16.444 4.902 15.656 4.882 L 16.705 3.421 C 17.293 2.603 16.520 1.736 15.765 1.814 z M 8.896 8.152 C 8.896 9.808 8.883
                    10.960 8.855 11.611 C 8.831 12.258 8.747 12.892 8.605 13.513 C 8.466 14.134 8.271 14.693 8.017 15.189 C 7.764 15.682 7.456 16.112 7.095 16.480 C 7.359 16.756 7.695 17.189 8.105 17.781 C 8.838 16.782 9.358 15.812 9.667 14.869 C 10.122 15.388 10.560 15.912 10.980 16.441
                    L 12.052 15.396 C 11.413 14.729 10.733 14.076 10.011 13.439 C 10.067 13.104 10.114 12.724 10.152 12.300 C 10.850 11.689 11.511 11.083 12.136 10.478 L 11.125 9.560 C 10.909 9.843 10.622 10.200 10.261 10.630 C 10.289 9.891 10.302 9.065 10.302 8.152 L 8.896 8.152 z
                    M 11.75 8.625 L 11.75 9.945 L 14.052 9.945 L 14.052 14.726 A 5.249 5.249 0 0 1 15.562 13.486 L 15.562 9.945 L 17.458 9.945 L 17.458 8.625 L 11.75 8.625 z M 8.189 9.728 L 7.074 9.916 C 7.247 10.875 7.404 11.926 7.542 13.070 L 8.677 12.863 C 8.511 11.667 8.349 10.622 8.189 9.728 z
                    M 18.062 14.062 C 12.729 14.062 12.729 22.062 18.062 22.062 C 23.395 22.062 23.395 14.062 18.062 14.062 z M 18.212 15.560 C 19.463 15.638 20.561 16.667 20.560 18.060 C 20.560 18.480 20.456 18.875 20.273 19.222 L 16.945 15.820 C 17.360 15.613 17.796 15.534 18.212 15.560 z
                    M 11.812 16.136 C 11.972 16.583 12.104 17.076 12.208 17.615 C 12.430 17.617 12.643 17.601 12.861 17.597 A 5.249 5.249 0 0 1 13.195 16.191 C 12.808 16.189 12.355 16.174 11.812 16.136 z M 15.843 16.902 L 19.169 20.300 C 18.825 20.471 18.445 20.561 18.060 20.560 C 16.182 20.561 14.974 18.567 15.843 16.902 z"/>
                    </svg>`
                 );
            }
            //css
            lightoff_btn_css();
            //add tip
            if(bb_type.indexOf(BILI_2_X) !== -1){
                waitForTrue(()=> ($tip !== undefined), () => {
                    // if(bb_type === BILI_3_X_MOVIE) $('.squirtle-controller-wrap').css({"display":"flex"});
                    // $(bb['dmWrap']).css({"display":"block"});

                    if(bb_type === BILI_2_X_V2) $('#hhh_lightoff').data('tip', {'text': '关灯', 'millisec':1, 'top':2, 'left':0, 'diff_full_top':-20});
                    else if(bb_type === BILI_3_X_VIDEO_V1) $('#hhh_lightoff').data('tip', {'text': '关灯', 'millisec':1, 'top':-4, 'left':0, 'diff_full_top':-14});
                    add_tip($tip, $('#hhh_lightoff'), {});

                    // $(bb['dmWrap']).css({"display":"none"});
                    // if(bb_type === BILI_3_X_MOVIE) $('.squirtle-controller-wrap').css({"display":"none"});
                })
            } else {
                //创建关灯tip
                tip_create_3_X({
                    target: $('#hhh_lightoff'),
                    tip_target: $('#hhh_tip'),
                    gap: 6,
                    title: ()=>{
                        let $light_input = $('#hhh_lightoff '+bb['switchInput']);
                        let light_tip_text = $light_input[0].checked === true? '关灯': '开灯';
                        light_tip_text += ' '+`(${config.sets.keyBinding.options.lightOff.keystr.toLowerCase()})`;
                        return light_tip_text;
                    }
                });
            }
        }

        //模拟B站音量调节
        //2.X版本可以直接调用系统函数window.player.volume()，但不能直接使用H5Player.volume
        //3.X版本去掉了window.player.volume()，但H5Player.volume功能发生变动，基本等价于window.player.volume()
        function volume(v, is_show_hint=true){
            function volume_bar(v){  //未使用
                if(v === undefined) return;
                v = v<0? 0: v>1? 1: v;
                $('.bilibili-player-video-volume-num').text(Math.round(v*100));
                $('.bilibili-player-video-volumebar-wrp .bui-bar.bui-bar-normal')[0].style.transform = `scaleY(${v})`;
                $('.bilibili-player-video-volumebar-wrp .bui-thumb')[0].style.transform = `translateY(${-48*v}px)`;
                v === 0? $('.bilibili-player-video-btn.bilibili-player-video-btn-volume').addClass('video-state-volume-min'): $('.bilibili-player-video-btn.bilibili-player-video-btn-volume').removeClass('video-state-volume-min')
            }
            function volume_hint_bar(v){
                if(v === undefined) return;
                assert(typeof v === "number", '| volume err: v is not number')  //debug
                //v = v<0? 0: v>1? 1: v;
                v = +Math.max(Math.min(v,1),0).toFixed(3);
                var $volumeHintIcon = $(`#hhh_volumeHint ${bb['volumeHintIcon']}`);
                var volumeHintIconClassName = bb['volumeHintIcon'].substr(1);

                if(bb_type.indexOf(BILI_2_X) !== -1){
                    if(v <= 0) $volumeHintIcon.attr('class', `${volumeHintIconClassName} video-state-volume-min`);
                    else if(v >= 1) $volumeHintIcon.attr('class', `${volumeHintIconClassName} video-state-volume-max`);
                    else $volumeHintIcon.attr('class', volumeHintIconClassName);
                } else{
                    if(v <= 0){
                        $volumeHintIcon.find('svg:last').css('display','block');
                        $volumeHintIcon.find('svg:first').css('display','none');
                    } else{
                        $volumeHintIcon.find('svg:last').css('display','none');
                        $volumeHintIcon.find('svg:first').css('display','block');
                    }
                }

                if(v <= 0) showHint(this, '#hhh_volumeHint', '静音');
                else showHint(this, '#hhh_volumeHint', Math.round(v*100)+'%');
            }

            h5Player = geth5Player()  // bug：调节清晰度会影响 h5Player 和window.player，需要重新赋值
            assert(typeof h5Player.volume === "number", '| volume err: h5Player.volume is not number')  //debug
            if(v === undefined) { /*log('v: '+h5Player.volume);*/ return +h5Player.volume;}
            v = +Math.max(Math.min(v,1),0).toFixed(3);
            assert(typeof v === "number", '| volume err: v is not number')  //debug
            //log('volume: '+v+'  '+h5Player);
            //v = v<0.01? 0: v>1? 1: v;  //0.01防止误差
            bb_type.indexOf(BILI_2_X) !== -1? window.player.volume(v): h5Player.volume = v;
            //h5Player.volume = v;
            if(is_show_hint === true) volume_hint_bar(+h5Player.volume);
            return +h5Player.volume;
        }

        //显示提示
        function showHint(parent, selector_str, text, t=1e3){
            $(bb['volumeHint']).css({"visibility":"visible"})
            $(bb['volumeHint']).css('display', 'none');  //隐藏所有提示，避免提示重叠
            $(`${selector_str}>${bb['volumeHintText']}`).text(text);  //百分比显示
            var Hint = $(selector_str);  //显示及渐隐效果（抄bilibili^^）
            clearTimeout(parent.showHintTimer),
                Hint.stop().css("opacity", 1).show(),
                parent.showHintTimer = window.setTimeout((function() {
                Hint.animate({
                    opacity: 0
                }, 300, (function() {
                    $(this).hide()
                }))
            }
            ), t)
        }

        /*
         * 控制进度条
         * .bpx-player-dm-setting-left-area 显示区域
         * .bilibili-player-setting-opacity 透明度
         * .bilibili-player-setting-area 显示区域
         * .bilibili-player-setting-speedplus 弹幕速度 等
         * 利用系统mousedown事件
         * 0 ~ 100
         */
        function set_progress(selector_str, percent, limit_left, limit_right){
            // log('----set_progress---')
            function calc_bar_offset2(percent, bar_width, limit_left, limit_right){  //某种插值算法，未使用
                let p = +percent;
                p = p<limit_left? limit_left: p>limit_right? limit_right: p;
                //log(p+' - '+bar_width+' - '+(limit_right-limit_left));
                let limits = limit_right - limit_left;
                let quo = Math.floor((p-limit_left)*bar_width/limits);
                let rem = (p-limit_left)*bar_width%limits;
                //log(quo+'****'+rem);
                return (bb_type === BILI_3_X_MOVIE)? Math.round((p-limit_left)/limits*bar_width): (rem>=(limits/2)? quo+1: quo);  //百分比对应进度条位置
            }

            function calc_bar_offset(percent, bar_width, limit_left, limit_right){
                let p = Math.max(Math.min(+percent, limit_right), limit_left);
                //log(p+' - '+bar_width+' - '+(limit_right-limit_left));
                let limits = limit_right - limit_left;
                let bar_offset = (p-limit_left) / limits * bar_width;
                return Math.round(bar_offset);  //百分比对应进度条位置
            }

            let selector = document.querySelector(selector_str)
            selector = $(`${selector_str} ${bb['progressWrap']}`)[0]

            let e1 = new MouseEvent('mousedown'), e2 = new MouseEvent('mouseup');

            if(bb_type === BILI_3_X_MOVIE) $('.squirtle-controller-wrap').css({"display":"flex"});
            $(bb['dmWrap']).css({"display":"block"});

            let selector_rect = selector.getClientRects();
            let bar_offset = calc_bar_offset(percent, $(`${selector_str} ${bb['progressWrap']}`).innerWidth(), limit_left, limit_right);
            // log('wrapWIdth: '+ calc_bar_offset(percent, $(`${selector_str} ${bb['progressWrap']}`).innerWidth(), limit_left, limit_right));
            for(let i=0;i<10;i++){
                let dest_per = Math.max(Math.min(+percent, limit_right), limit_left);
                let clientX = selector_rect[0].left + bar_offset;
                e1.initMouseEvent('mousedown',1,1,window,1,0,0,clientX,0,0,0,0,0,0,null);
                e2.initMouseEvent('mouseup'  ,1,1,window,1,0,0,clientX,0,0,0,0,0,0,null);
                selector.dispatchEvent(e1); selector.dispatchEvent(e2);
                let curr_per = +$(`${selector_str} ${bb['progressVal']}`).text().slice(0,-1);
                // log(curr_per+' - '+dest_per);
                if(curr_per !== dest_per){
                    curr_per < dest_per ? ++bar_offset : --bar_offset;
                    //log(bar_offset);
                }else{
                    break;
                }
            }

            $(bb['dmWrap']).css({"display":"none"});
            if(bb_type === BILI_3_X_MOVIE) $('.squirtle-controller-wrap').css({"display":"none"});

            //激活设置，记忆进度条位置
            if(bb_type === BILI_3_X_MOVIE){
                $(bb['dm'])[0].dispatchEvent( new MouseEvent('mouseleave') );  //3.X
            }else{
                $(bb['dm'])[0].dispatchEvent( new MouseEvent('mouseout') );  //2.X
            }

            return $(`${selector_str} ${bb['progressVal']}`).text();
        }

        /*
         * 调节弹幕设置进度条
         * 利用系统mousedown事件
         * '正数': right,  '负数': left,  -100 ~ +100
         */
        function adjust_progress(selector_str, inc_percent, limit_left, limit_right){
            // log('---adjust_progress---')
            var curr_percent = Number($(`${selector_str} ${bb['progressVal']}`).text().slice(0,-1))
            return set_progress(selector_str, curr_percent + inc_percent, limit_left, limit_right)
        }

        /*     /  \
               |  |
               \  /
        clip-path: polygon(40% 0%, 25% 30%, 25% 70%, 40% 100%, 0% 100%, 0% 0%,60% 0%, 75% 30%, 75% 70%, 60% 100%, 100% 100%, 100% 0%);

                <div style="width:200px;height:200px;background:red;clip-path: url(#myClip);">

            <div>11111111111111111111111</div>
            <div>11111111111111111111111</div>
            <div>11111111111111111111111</div>
            <div>11111111111111111111111</div>
            <div>11111111111111111111111</div>
            <div>11111111111111111111111</div>
            <div>11111111111111111111111</div>
            <div>11111111111111111111111</div>
            <div>11111111111111111111111</div>
            </div>

        <svg width="0" height="0">
        <defs>
            <clipPath id="myClip">
            <circle cx="100" cy="100" r="40"/>
            <circle cx="60" cy="60" r="40"/>
            </clipPath>
        </defs>
        </svg>

                $('.bilibili-player-context-menu-container.active li:last').mouseenter(function(){
            let hotkey_class = '.bilibili-player-hotkey-panel-container'.substr(1);
            $('#hhh_hotkey_panel').clone(true,true).replaceAll($(`.${hotkey_class}:last`)).attr({'id': '', 'class': hotkey_class, 'style': ''});
            let $hotkey = $('.bilibili-player-hotkey-panel-container').addClass('active').css('z-index', $('.bilibili-player-video-control-wrap').css('z-index'));
        }).mouseleave(function(){
            $('.bilibili-player-hotkey-panel-container').removeClass('active').css('display', 'none');
        })

        BV to AV
        // 作者：mcfx
        // 链接：https://www.zhihu.com/question/381784377/answer/1099438784
        // 来源：知乎
        // 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
        function bv2av() {
            const bv = document.getElementById('bv').value;
            document.getElementById('av').value = dec(bv);
        }

        function av2bv() {
            const av = +document.getElementById('av').value;
            document.getElementById('bv').value = enc(av);
        }

        const table = 'fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF'
        const tr = {}
        for (let i = 0; i < 58; i++)
            tr[table[i]] = i
        const s = [11, 10, 3, 8, 4, 6]
        const xor = 177451812
        const add = 8728348608

        function dec(x) {
            let r = 0
            for (let i = 0; i < 6; i++) {
                r += tr[x[s[i]]] * 58 ** i
            }
            return (r - add) ^ xor
        }
        function enc(x) {
            x = (x ^ xor) + add
            r = 'BV1  4 1 7  '.split('')
            for (let i = 0; i < 6; i++) {
                r[s[i]] = table[parseInt(x / 58 ** i) % 58]
            }
            return r.join('')
        }

        // console.log(dec('BV17x411w7KC'))
        // console.log(dec('BV1Q541167Qg'))
        // console.log(dec('BV1mK4y1C7Bz'))
        // console.log(enc(170001))
        // console.log(enc(455017605))
        // console.log(enc(882584971))
        // console.log('----------------------------');
        // console.log(1, enc(1))
        // console.log(93761707, dec(enc(93761707)))
        // console.log('BV1xE411x7Mn', enc(dec('BV1xE411x7Mn')))
        // console.log(add === 100618342136696320, add); */

        //自定义快捷键说明页面
        function add_custom_hotkey(hotkey_panel_class, hotkey, is_append) {
            var $hotkey_panel = $(`.${hotkey_panel_class}`)
            var $hotkey_item  = $hotkey_panel.find(`.${hotkey_panel_class}-item:first`)
            var key_name = bb_type.indexOf(BILI_2_X) !== -1 ? 'key' : 'name'
            if(is_append === false) $hotkey_panel.empty()
            for (let [key, { keystr, text, keycount, syskey, delimiter, tempargs }] of Object.entries(hotkey)) {
                if(keycount === 0) continue
                if(syskey === ON) continue

                let keystr_arr = keystr.split(/\s+/)
                keystr_arr = kb.combine_same_keys(keystr_arr)
                keystr = keystr_arr.join(delimiter || '/')
                
                $hotkey_item.clone().appendTo($hotkey_panel).css('display', 'block')
                let $hotkey_key = $hotkey_panel.find(`.${hotkey_panel_class}-${key_name}:last`)
                $hotkey_key.text(keystr)  //value
                const argsvalue = tempargs?.[0].value
                if(!!argsvalue){  //替换形如${...}
                    text = text.replace(/\$\{\w+\}/, argsvalue)
                }
                $hotkey_key.next().text(text)
                
                $hotkey_key.width(200)
                //$hotkey_key.next().width(185)
            }
        }

        //添加右键菜单自定义快捷键说明2.X
        function add_custom_hotkey_menu_2_X(custom_hotkey) {
            //主class名，去掉"."
            let hotkey_panel_class = 'bilibili-player-hotkey-panel',
                is_init = false;

            //设置右键 & 快捷键菜单
            (function add_menu(){
                $('#bilibiliPlayer')[0].addEventListener('DOMSubtreeModified', function fn_(e) {
                    //typeof e.target.className === 'string' && e.target.className !== '' && log(e.target.className);
                    let $target = $(e.target);
                    if($target.hasClass('context-line context-menu-function hover') && $('.bilibili-player-hotkey-panel').length === 1){
                        if(is_init === false){
                            //log('-------添加快捷键菜单--------');
                            is_init = true;
                            let $last_item = $('.bilibili-player-hotkey-panel').find('.bilibili-player-hotkey-panel-item:last');
                            $last_item.attr('id', 'hhh_last_system_hotkey_panel_item');
                            add_custom_hotkey(hotkey_panel_class, custom_hotkey, true);
                        }else if($target[0].id !== '__sizzle__'){  //过滤掉第一个懒加载
                            let $last_system_itme = $('#hhh_last_system_hotkey_panel_item');
                            //log($target.find('a').text());
                            if($target.find('a').text() === '快捷键说明'){
                                    //log('--------显示快捷键说明-------');
                                    $last_system_itme.prevAll().css('display','block');
                                    $last_system_itme.css('display','block');
                                    $last_system_itme.nextAll().css('display','none');
                            }else if($target.find('a').text() === '快捷键说明（bilibili关灯）'){
                                    //log('--------显示快捷键说明（bilibili关灯）-------');
                                    $last_system_itme.prevAll().css('display','none');
                                    $last_system_itme.css('display','none');
                                    $last_system_itme.nextAll().css('display','block');
                            }
                            let wheelEvent = new WheelEvent('mousewheel', { deltaY: -10000, deltaMode: 0 });  //打开时回到最上
                            $('.bilibili-player-hotkey-panel-wrap')[0].dispatchEvent(wheelEvent);
                            $('.bilibili-player-hotkey-panel-wrap').find('.bscroll-vertical-scrollbar')[0].style.cssText+=";background:#f1f1f1!important";  //默认滚动条对比度不明显，浅化背景颜色，增强对比度
                        }
                    } else if($target.hasClass('bilibili-player-context-menu-container black bilibili-player-context-menu-origin') &&  $target[0].id === '') {  //还有一个id = __sizzle__
                        this.removeEventListener('DOMSubtreeModified', fn_);
                        //this.removeEventListener('DOMSubtreeModified', arguments.callee);
                        //log('--------添加右键菜单-------');
                        let $li_sys_hotkey = $target.find('a:contains("快捷键说明"):first').parent();  //返回li，XXX: 此时contains("快捷键说明")多于一个
                        let $a_hhh_hotkey = $target.find('a:contains("快捷键说明（bilibili关灯）")');
                        var $li_hhh_hotkey = ($a_hhh_hotkey.length && $a_hhh_hotkey.parent()) || $li_sys_hotkey.clone(false, false).insertAfter($li_sys_hotkey).css('display', '').find('a').text('快捷键说明（bilibili关灯）');  //插入自定义快捷键

                        add_menu();
                    }
                });
            })();
        }

        //添加右键菜单自定义快捷键说明3.X
        function add_custom_hotkey_menu_3_X(custom_hotkey) {
            //主class名，去掉"."
            let hotkey_panel_class = 'bpx-player-hotkey-panel-content';

            //监听右键菜单，生成自定义快捷键说明页面，只执行一次
            (function set_custom_hotkey(){
                let ob = new MutationObserver((mutations, observer) => {
                    for (var mutation of mutations) {
                        let $target = $(mutation.target)
                        // log('-------添加快捷键菜单2--------');
                        if($target.hasClass('bpx-player-hotkey-panel')){
                            ob.disconnect()
                            let $last_item = $target.find('.bpx-player-hotkey-panel-content-item:last');
                            $last_item.attr('id', 'hhh_last_system_hotkey_panel_item');
                            add_custom_hotkey(hotkey_panel_class, custom_hotkey, true);
                        }
                    }
                })
                ob.observe($('.bpx-player-video-area')[0], { /*childList: true,*/ subtree: true, attributes: true })
            })();

            //右键菜单弹出时添加项
            (function add_menu(){
                let ob = new MutationObserver((mutations, observer) => {
                    for (var mutation of mutations) {
                        let $target = $(mutation.target)
                        // log($target[0].className);
                        if($target.hasClass('bpx-player-contextmenu bpx-player-black') && $target[0].childNodes.length !== 0) {
                            ob.disconnect()
                            // log('--------添加右键菜单-------');
                            let $li_sys_hotkey = $target.find('li:contains("快捷键说明"):first');
                            var $li_hhh_hotkey = $li_sys_hotkey.clone(false, false).insertAfter($li_sys_hotkey).text('快捷键说明（bilibili关灯）');  //插入自定义快捷键

                            let $last_system_itme = $('#hhh_last_system_hotkey_panel_item');
                            $last_system_itme.nextAll().remove();  //重新加载自定义快捷键菜单
                            add_custom_hotkey(hotkey_panel_class, custom_hotkey, true);

                            // log('--------显示快捷键说明-------');
                            $li_sys_hotkey.off('mousedown.sys_hotkey');
                            $li_sys_hotkey.on('mousedown.sys_hotkey', function(){
                                $last_system_itme.prevAll().css('display','block');
                                $last_system_itme.css('display','block'); 
                                $last_system_itme.nextAll().css('display','none');
                                $('.bpx-player-hotkey-panel').width(400)
                            });
                            // log('--------显示快捷键说明（bilibili关灯）-------');
                            $li_hhh_hotkey.off('mousedown.hhh_hotkey');
                            $li_hhh_hotkey.on('mousedown.hhh_hotkey', function(){
                                $last_system_itme.prevAll().css('display','none');
                                $last_system_itme.css('display','none');
                                $last_system_itme.nextAll().css('display','block');
                                $('.bpx-player-hotkey-panel').width(440)
                            });
                            let wheelEvent = new WheelEvent('mousewheel', { deltaY: -10000, deltaMode: 0 });  //打开时回到最上
                            $('.bpx-player-hotkey-panel-area')[0].dispatchEvent(wheelEvent);

                            add_menu();
                        }
                    }
                })
                ob.observe($('.bpx-player-container')[0], { childList: true, subtree: true, /*attributes: true,*/ })
            })();

            //模拟右键菜单消息，激活菜单
            let evt = new MouseEvent('contextmenu', { clientX:-9999, clientY:-9999 });
            $(bb['videoWrap'])[0].dispatchEvent(evt);

            //模拟点击菜单，激活热键菜单DOM
            evt = new MouseEvent('mousedown',{ bubbles:true });
            $(`.bpx-player-contextmenu.bpx-player-black li:contains("快捷键说明")`)[0].dispatchEvent(evt);

            //关闭热键菜单
            $('.bpx-player-hotkey-panel-close').click();
        }

        //添加右键菜单自定义快捷键说明
        function add_custom_hotkey_menu(hotKeyMenu) {
            if(bb_type.indexOf(BILI_2_X) !== -1) add_custom_hotkey_menu_2_X(hotKeyMenu);
            else add_custom_hotkey_menu_3_X(hotKeyMenu);
        }

        //取得版本号-未使用
        //function get_ver() {
        //    if(bb_type.indexOf(BILI_2_X) !== -1) ver = bili_player.getVersion().version;
        //    else ver = $('.bpx-common-opacity-60').text().split('-')[0];
        //}

        //取得视频FPS（Frames Per Second）、版本
        function get_video_fps_ver() {

            let ob = new MutationObserver((mutations, observer) => {
                for (var mutation of mutations) {
                    let $target = $(mutation.target)
                    //插入info面板时截取fps值
                    if($target.hasClass('bpx-player-info-panel')) {
                        ob.disconnect()

                        let $video_info_close = $(bb['videoInfoClose']);  //bpx-player-info-close
                        $video_info_close.click();  //模拟关闭统计信息面板，2.X版本一次即可关掉
                        // $video_info_close.click();  //3.X版本执行两次才能关掉面板，保险起见3次
                        // $video_info_close.click();  //估计是点击事件开始太快，系统未能处理，也可能3.X测试版自己的问题
    
                        //text中取得fps值
                        var get_title_text = function(title) { return $(bb['videoInfoContainer']).find(`.info-title:contains("${title}")`).next().text() }
                        fps = Number(get_title_text('Resolution').match(/\d+\.\d+/)) || Number(get_title_text('FPS')) || 30
                    }
                }
            })
            ob.observe($(bb['videoWrap'])[0], { childList: true, subtree: true })  //attributes: true

            //模拟右键菜单消息，激活菜单DOM
            let evt = new MouseEvent('contextmenu', { clientX:-9999, clientY:-9999 });
            $(bb['videoContextMenu'])[0].dispatchEvent(evt);

            //模拟点击菜单，激活热键菜单DOM，版本号
            if(bb_type.indexOf(BILI_2_X) !== -1){
                let evt = new MouseEvent('click',{ bubbles:true });
                $(`${bb['playerContextMenu']} a:contains("视频统计信息")`)[0].dispatchEvent(evt);  //bpx-player-contextmenu
                ver2 = $(`${bb['playerContextMenu']} a:contains("更新历史")`).text().split(' ')[1].split('-')[0];
            }
            else if(bb_type.indexOf(BILI_3_X_VIDEO) !== -1) {
                let evt = new MouseEvent('mousedown',{ bubbles:true });
                $(`${bb['playerContextMenu']} li:contains("视频统计信息")`)[0].dispatchEvent(evt);
                ver2 = $(`${bb['playerContextMenu']} li:contains("更新历史")`).text().match(/\S+/g)[1].split('-')[0];
            }
        }
        
        //是否登录、是否大会员等
        function get_biliinfo(){
            biliinfo.is_login = window.__BiliUser__.cache.data.isLogin
            biliinfo.vip_status = biliinfo.is_login === true ? window.__BiliUser__.cache.data.vipStatus : undefined
        }

        //笨办法，激活系统音量设置，复制volumeHint DOM
        function pick_volume_hint(){
            let volume_hint_html = `
                <div class="bpx-player-volume-hint" style="opacity: 0;visibility: visible;display: none;">
                    <span class="bpx-player-volume-hint-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" data-pointer="none" style="enable-background:new 0 0 22 22" viewBox="0 0 22 22">
                            <path d="M10.188 4.65 6 8H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1l4.188 3.35a.5.5 0 0 0 .812-.39V5.04a.498.498 0 0 0-.812-.39zM14.446 3.778a1 1 0 0 0-.862 1.804 6.002 6.002 0 0 1-.007 10.838 1 1 0 0 0 .86 1.806A8.001 8.001 0 0 0 19 11a8.001 8.001 0 0 0-4.554-7.222z"></path>
                            <path d="M15 11a3.998 3.998 0 0 0-2-3.465v6.93A3.998 3.998 0 0 0 15 11z"></path>
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" data-pointer="none" style="display: none;" viewBox="0 0 22 22">
                            <path d="M15 11a3.998 3.998 0 0 0-2-3.465v2.636l1.865 1.865A4.02 4.02 0 0 0 15 11z"></path>
                            <path d="M13.583 5.583A5.998 5.998 0 0 1 17 11a6 6 0 0 1-.585 2.587l1.477 1.477a8.001 8.001 0 0 0-3.446-11.286 1 1 0 0 0-.863 1.805zM18.778 18.778l-2.121-2.121-1.414-1.414-1.415-1.415L13 13l-2-2-3.889-3.889-3.889-3.889a.999.999 0 1 0-1.414 1.414L5.172 8H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1l4.188 3.35a.5.5 0 0 0 .812-.39v-3.131l2.587 2.587-.01.005a1 1 0 0 0 .86 1.806c.215-.102.424-.214.627-.333l2.3 2.3a1.001 1.001 0 0 0 1.414-1.416zM11 5.04a.5.5 0 0 0-.813-.39L8.682 5.854 11 8.172V5.04z"></path>
                        </svg>
                    </span>
                    <span class="bpx-player-volume-hint-text">30%</span>
                </div>
            `

            //添加 volumeHint wordsHint opacityHint DOM
            $(volume_hint_html).clone().appendTo(bb['videoWrap']).attr('id','hhh_volumeHint');  //bpx-player-volume-hint

            $('#hhh_volumeHint').clone().appendTo(bb['videoWrap']).attr('id','hhh_wordsHint').css({'opacity': 0, 'display': 'none'}).find(bb['volumeHintIcon']).remove();
            $('#hhh_wordsHint').clone().appendTo(bb['videoWrap']).attr('id','hhh_opacityHint');

            if(bb_type.indexOf(BILI_2_X) !== -1){
                $('#hhh_wordsHint').css({'width':'auto','margin-left':'0px','padding-left':'8px','padding-right':'15px','transform':'translate(-50%)'})
                                    .find(bb['volumeHintText']).css({'width': 'auto', 'padding-left': '10px'});
                $('#hhh_opacityHint').find(bb['volumeHintText']).css({'padding-right': '6px'});
            }
            else{
                $('#hhh_wordsHint, #hhh_opacityHint').find(bb['volumeHintText']).css({'padding': '0 10px'});
            }

            // log($('.bpx-player-volume-hint').length)
            
            // var original_volume = h5Player.volume;
            // let index = 0
            // let ob = new MutationObserver((mutations, observer) => {
            //     for (var mutation of mutations) {
            //         let $target = $(mutation.target)
            //         log(`[${++index}]`,$target[0].className)
            //         //插入info面板时截取fps值
            //         if($target.hasClass(bb['volumeHint'].substr(1))) {  //bpx-player-volume-hint
            //             ob.disconnect()
            //             log(original_volume, $target[0].className)

            //             volume(original_volume);  //模拟鼠标拖动无法按1%精确控制音量，系统自身限制或者说bug

            //             //添加 volumeHint wordsHint opacityHint DOM
            //             $(bb['volumeHint']).clone().appendTo(bb['videoWrap']).attr('id','hhh_volumeHint');
    
            //             $('#hhh_volumeHint').clone().appendTo(bb['videoWrap']).attr('id','hhh_wordsHint').css({'opacity': 0, 'display': 'none'}).find(bb['volumeHintIcon']).remove();
            //             $('#hhh_wordsHint').clone().appendTo(bb['videoWrap']).attr('id','hhh_opacityHint');
    
            //             if(bb_type.indexOf(BILI_2_X) !== -1){
            //                 $('#hhh_wordsHint').css({'width':'auto','margin-left':'0px','padding-left':'8px','padding-right':'15px','transform':'translate(-50%)'})
            //                                    .find(bb['volumeHintText']).css({'width': 'auto', 'padding-left': '10px'});
            //                 $('#hhh_opacityHint').find(bb['volumeHintText']).css({'padding-right': '6px'});
            //             }
            //             else{
            //                 $('#hhh_wordsHint, #hhh_opacityHint').find(bb['volumeHintText']).css({'padding': '0 10px'});
            //             }
    
            //             //隐藏提示
            //             $(bb['volumeHint']).css({"visibility":"hidden"});
            //         }
            //     }
            // })
            // ob.observe($(bb['videoWrap'])[0], { subtree: true, attributes: true })  //childList: true

            // //激活系统音量设置，复制volumeHint DOM
            // let evt = new KeyboardEvent('keydown', { keyCode:keycode['up'] });
            // window.dispatchEvent(evt);
        }

        //快进时显示醒目进度条
        function dynamicProgress(dynamicHeight, staticHeight){
            if(bb_type.indexOf(BILI_2_X) !== -1) {
                if (1||$('.bilibili-player-area').hasClass('progress-shadow-show') === true) {
                    $('.bilibili-player-video-progress-shadow .bui-track-video-progress').css('cssText', `height:${dynamicHeight}px !important`);
                    clearTimeout(document.showVideoProgress);
                    document.showVideoProgress = window.setTimeout((function() { $('.bilibili-player-video-progress-shadow .bui-track-video-progress').css('cssText', `height:${staticHeight}px !important`); }), 2000);
                }
            } else {
                if($('.bpx-player-container').hasClass('bpx-state-no-cursor') === true ||  //3.x
                   $('.bpx-player-control-entity').hasClass('bpx-state-no-cursor') === true) {  //3.x.13
                    $('.bpx-player-shadow-progress-area').css({'height': `${dynamicHeight}px`});  //3.x.13
                    //$('.bpx-player-progress').css({'height': `${dynamicHeight/2}px`});
                    $('.squirtle-progress-bar').css({'height': `${dynamicHeight}px`});  //3.x
                    clearTimeout(document.showVideoProgress);
                    document.showVideoProgress = window.setTimeout((function() {
                        $('.bpx-player-shadow-progress-area').css({'height': `${staticHeight}px`});
                        //$('.bpx-player-progress').css({'height': `${staticHeight/2}px`});
                        $('.squirtle-progress-bar').css({'height': `${staticHeight}px`});
                    }), 2000);
                }
            }
        }

        //修复选择历史弹幕时弹幕填装信息丢失问题
        function fix_danmaku_info() {
            if(bb_type.indexOf(BILI_2_X) !== -1) {
                $('.danmaku-box')[0].addEventListener('DOMSubtreeModified', function(e) {
                    if($(e.target).hasClass('player-auxiliary-danmaku-list bpui-component bpui-undefined bpui-selectable') && $('.bilibili-player-video-info').hasClass('bilibili-player-hide-dm')) {
                        $('.bilibili-player-video-info').removeClass('bilibili-player-hide-dm');
                        //得到弹幕数
                        let danmaku_number = $('.player-auxiliary-danmaku-contaner .player-auxiliary-danmaku-list').height()/$('.danmaku-info-row:first').height();
                        $('.bilibili-player-video-info-danmaku-number').text(danmaku_number);
                    }
                });
            } else {
                let ob = new MutationObserver((mutations, observer) => {
                    for (var mutation of mutations) {
                        let $target = $(mutation.target)
                        if($target.hasClass('bpx-player-video-info-dm') && $('.bpx-player-video-info').hasClass('bpx-player-hide-dm')) {
                            $('.bpx-player-video-info').removeClass('bpx-player-hide-dm')
                        }
                    }
                })
                ob.observe($('.bpx-player-video-info')[0], { childList: true, subtree: true, /*attributes: true,*/ })
            }
        }

        //添加 <style css>
        function append_style($container, id, rules){
            $(`#${id}`).remove();
            if($(`#${id}`).length<1){
                $container.append(`<style id=${id} type="text/css">${rules}</style>`);
            }
        }

        //快捷键设置
        function set_keybindings($to_div){
            let html = `<div>
                <style type="text/css">
                    .keybindings-editor {
                        padding: 2px 0 0 2px;
                        /*position: fixed;*/
                        top: 10%;
                        left: 40%;
                        /*z-index: 200001;*/
                        width:550px;
                    }
                </style>
                <div class="keybindings-editor">
                    <style type="text/css">
                        /* 对话框 */
                        .defineKeybindingWidget {
                            padding: 10px;
                            position: absolute
                        }
                        .message {
                            /*width: 400px;*/
                            text-align: center
                        }

                        .settings-search-container {
                            flex: 1
                        }
                        .settings-search-input {
                            vertical-align: middle
                        }
                        .monaco-inputbox {
                            position: relative;
                            display: block;
                            padding: 0;
                            box-sizing: border-box;
                            font-size: inherit;
                            margin-top: 10px;
                            /*width: 400px;*/
                            height: 30px;
                            text-align: center;
                        }
                        .monaco-inputbox.idle {
                            border: 1px solid transparent
                        }
                        .monaco-inputbox.synthetic-focus {
                            outline: 1px solid #007fd4;
                            outline-offset: -1px;
                            opacity: 1!important
                        }
                        .ibwrapper {
                            position: relative;
                            width: 100%;
                            height: 100%
                        }
                        .monaco-inputbox>.ibwrapper>input {
                            display: inline-block;
                            box-sizing: border-box;
                            width: 100%;
                            height: 100%;
                            line-height: inherit;
                            border: none;
                            padding: 4px;
                            padding-left: 10px;
                            font-family: inherit;
                            font-size: 14px;
                            resize: none;
                            color: inherit;
                            text-overflow: ellipsis;
                            text-align: center;
                        }
                        .monaco-inputbox>.ibwrapper>input[type=text]:focus{
                            outline: 0!important;
                        }

                        .existing, .monaco-inputbox, .output {
                            margin-top: 10px;
                            /*width: 400px;*/
                            display: block;
                            text-align: center
                        }
                        .output {
                            display: flex;
                            justify-content: center
                        }
                        .existingText {
                            text-decoration: underline;
                            cursor: pointer
                        }
                    </style>
                    <!-- class
                        overlay-container
                        defineKeybindingWidget
                            message
                            settings-header-widget
                                settings-search-container
                                    settings-search-input
                                        monaco-inputbox  idle
                                            ibwrapper
                                                input empty
                            output
                                monaco-keybinding
                                    monaco-keybinding-key
                            existing
                                existingText
                    -->
                    <!-- 对话框 -->
                    <div class="overlay-container" style="position: absolute; z-index: 40; display: none;">
                        <div class="defineKeybindingWidget" style="display: block; width: 300px; height: 110px; background-color: rgb(37, 37, 38); color: rgb(204, 204, 204); box-shadow: rgba(0, 0, 0, 0.36) 0px 2px 8px; top: 150px; left: 0px;">
                            <div class="message">先按所需的组合键，再按 Enter 键。</div>
                            <div class="settings-header-widget">
                                <div class="settings-search-container">
                                    <div class="settings-search-input">
                                        <div class="monaco-inputbox idle" data-keybinding-context="22" style="background-color: rgb(60, 60, 60); color: rgb(204, 204, 204);">
                                            <div class="ibwrapper">
                                                <input class="input empty" autocorrect="off" autocapitalize="off" spellcheck="false" type="text" wrap="off" aria-label="先按所需的组合键，再按 Enter 键。" aria-live="off" style="background-color: inherit; color: rgb(204, 204, 204);" title="code: KeyE, keyCode: 69, key: e => UI: E, user settings: e, dispatch: E">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="output">
                                <div class="monaco-keybinding" title="Ctrl+X" style="color: rgb(204, 204, 204);">
                                </div>
                            </div>
                            <div class="existing">
                                <span class="existingText"></span>  <!-- 已有 1 条命令的按键绑定与此相同 -->
                            </div>
                        </div>
                    </div>

                    <style type="text/css">
                        /* 键盘绑定 */
                        .keybindings-body {
                            /*background: #1e1e1e;*/
                            color: #cccccc;
                            font-size: 13px
                        }
                        .keybindings-table-container {
                            width: 100%;
                            border-spacing: 0;
                            border-collapse: separate
                        }
                        .monaco-table {
                            display: flex;
                            flex-direction: column;
                            position: relative;
                            height: 100%;
                            width: 100%;
                            white-space: nowrap
                        }
                    </style>
                    <!-- class
                        keybindings-body
                        keybindings-table-container
                        monaco-table
                    -->
                    <!-- 键盘绑定 -->
                    <div class="keybindings-body">
                        <div class="keybindings-table-container" style="height: 360px;">
                            <div class="monaco-table">

                            <style type="text/css">
                                /* 标题行 */
                                .monaco-split-view2 {
                                    position: relative;
                                    width: 100%;
                                    height: 100%;
                                    /* border-bottom: 1px solid transparent; */
                                    transition: border-color .2s ease-out
                                }
                                .monaco-split-view2>.monaco-scrollable-element {
                                    width: 100%;
                                    height: 100%
                                }
                                .split-view-container {
                                    width: 100%;
                                    height: 100%;
                                    white-space: nowrap;
                                    position: relative
                                }
                                .split-view-view {
                                    white-space: normal;
                                    position: absolute;
                                    height: 100%
                                }
                                .monaco-table-th {
                                    width: 100%;
                                    height: 100%;
                                    font-weight: 700;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    background-color: rgba(204, 204, 204, 0.04)
                                }
                            </style>
                                <!-- class
                                    monaco-split-view2      horizontal
                                    monaco-scrollable-element *
                                    split-view-container
                                        split-view-view         visible
                                            monaco-table-th
                                -->
                                <!-- 标题行 -->
                                <div class="monaco-split-view2" style="height: 30px; line-height: 30px;">
                                    <div class="monaco-scrollable-element " role="presentation" style="position: relative; overflow: hidden;">
                                        <div class="split-view-container" style="overflow: hidden;">
                                            <div class="split-view-view visible" style="left: 0px; width: 30px;">
                                                <div class="monaco-table-th" data-col-index="1" title=""></div>
                                            </div>
                                            <div class="split-view-view visible" style="left: 30px; width: 240px;">
                                                <div class="monaco-table-th" data-col-index="1" title="">命令</div>
                                            </div>
                                            <div class="split-view-view visible" style="left: 270px; width: 423px;">
                                                <div class="monaco-table-th" data-col-index="2" title="">键绑定（双击变更）</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <style type="text/css">
                                    /* 键盘绑定 */
                                    .monaco-list {
                                        position: relative;
                                        height: 100%;
                                        width: 100%;
                                        white-space: nowrap;
                                        flex: 1
                                    }
                                    .monaco-list>.monaco-scrollable-element {
                                        height: 100%
                                    }
                                    .monaco-list-rows {
                                        position: relative;
                                        width: 100%;
                                        height: 100%
                                    }
                                    .monaco-list-row {
                                        position: absolute;
                                        box-sizing: border-box;
                                        overflow: hidden;
                                        width: 100%
                                    }

                                    .monaco-table-tr {
                                        display: flex;
                                        height: 100%;
                                        cursor: default
                                    }
                                    .monaco-list-row[data-parity=odd]:not(.focused):not(.selected):not(:hover) .monaco-table-tr {
                                        background-color: rgba(204, 204, 204, 0.04);
                                    }
                                    .monaco-list-row:not(.focused):hover .monaco-table-tr {
                                        background-color: #2a2d2e
                                    }

                                    .mask {
                                        filter: brightness(0.4);
                                        background: rgba(0, 0, 0, 0.7)
                                    }

                                    .focused {
                                        color: #ffffff;
                                        background: #04395e;
                                        outline: 1px solid #0075d4e6;
                                        outline-offset: -1px
                                    }

                                    .monaco-table-td,.monaco-table-th {
                                        box-sizing: border-box;
                                        flex-shrink: 0;
                                        overflow: hidden;
                                        white-space: nowrap;
                                        text-overflow: ellipsis
                                        padding-left: 10px
                                    }
                                    .monaco-table-td {
                                        align-items: center;
                                        display: flex;
                                        overflow: hidden
                                    }
                                    .monaco-table-td[data-col-index="0"], .monaco-table-th[data-col-index="0"] {
                                        padding-left: 20px
                                    }

                                    .monaco-keybinding {
                                        display: flex;
                                        align-items: center;
                                        line-height: 10px
                                    }
                                    .monaco-keybinding-key {
                                        display: inline-block;
                                        border-style: solid;
                                        border-width: 1px;
                                        border-radius: 3px;
                                        vertical-align: middle;
                                        font-size: 11px;
                                        padding: 3px 5px;
                                        margin: 0 2px
                                    }
                                    .monaco-keybinding-key:first-child {
                                        margin-left: 0
                                    }
                                    .monaco-keybinding-key-separator {
                                        display: inline-block
                                    }
                                    .monaco-keybinding-key-chord-separator {
                                        width: 6px
                                    }

                                    .monaco-scrollable-element>.visible {
                                        opacity: 1;
                                        background: transparent;
                                        transition: opacity .1s linear
                                    }
                                    .monaco-scrollable-element>.invisible {
                                        opacity: 0;
                                        pointer-events: none
                                    }
                                    .monaco-scrollable-element>.invisible.fade {
                                        transition: opacity .8s linear
                                    }

                                    /* invisible scrollbar vertical fade */

                                    .monaco-scrollable-element>.scrollbar>.slider {
                                        background: rgba(121, 121, 121, 0.4);
                                    }
                                    .monaco-scrollable-element>.scrollbar>.slider:hover {
                                        background: rgba(100, 100, 100, 0.7);
                                    }
                                    .monaco-scrollable-element>.scrollbar>.slider.active {
                                        background: rgba(191, 191, 191, 0.4);
                                    }

                                </style>
                                <!-- class
                                    monaco-list
                                    monaco-scrollable-element *
                                    monaco-list-rows
                                    monaco-list-row
                                    monaco-table-tr
                                        monaco-table-td  说明
                                            <div>
                                        monaco-table-td  键位
                                            monaco-keybinding
                                                monaco-keybinding-key
                                                monaco-keybinding-key-separator
                                -->

                                <!-- 键盘绑定list  Control+K Control+Shift+\\  -->
                                <div class="monaco-list" tabindex2="1" role="list" aria-label="键绑定" style="height: 330px;" aria-activedescendant="list_id_9_0">
                                    <div class="monaco-scrollable-element" role="presentation" style="position: relative; overflow: hidden;">
                                        <div class="monaco-list-rows" style="transform: translate3d(0px, 0px, 0px); overflow: hidden; left: 0px; top: 0px; height: 46272px;">
                                        </div>
                                        <div role="presentation" aria-hidden="true" class="invisible scrollbar horizontal" style="position: absolute; width: 0px; height: 10px; left: 0px; bottom: 0px;">
                                            <div class="slider" style="position: absolute; top: 0px; left: 0px; height: 10px; transform: translate3d(0px, 0px, 0px); contain: strict; width: 0px;"></div>
                                        </div>
                                        <div role="presentation" aria-hidden="true" class="invisible scrollbar vertical fade" style="position: absolute; width: 10px; height: 69px; right: 0px; top: 0px;">
                                            <div class="slider" style="position: absolute; top: 0px; left: 0px; width: 10px; transform: translate3d(0px, 0px, 0px); contain: strict; height: 20px;"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div></div>`
            $(html).appendTo($to_div);

            let $main = $('.keybindings-editor');
            let $scroll_element = $('.monaco-scrollable-element');
            let row_count = 0;
            let row_line_height = 24;
            let oldkeystr = '';
            let oldwheelstr = '';

            //设置keybinding
            function set_keybinding_key($keybinding, keystrs, combine){
                let keybinding_key = `<span class="monaco-keybinding-key" style="background-color: rgba(128, 128, 128, 0.17); border-color: rgba(51, 51, 51, 0.6)
                                      rgba(51, 51, 51, 0.6) rgba(68, 68, 68, 0.6); box-shadow: rgba(0, 0, 0, 0.36) 0px -1px 0px inset;"></span>`
                let separator = `<span class="monaco-keybinding-key-separator"></span>`

                $keybinding.attr('key-str', keystrs).empty()
                let delimiter = $keybinding.attr('key-delimiter')
                let keycount = $keybinding.attr('key-count')
                if(+keycount <= 0){  //原样输出
                    // if(+keycount === 0) $(keybinding).clone().appendTo($keybinding).text('');
                    if(+keycount === 0) $keybinding.closest('.monaco-table-tr').css({'justify-content': 'center', 'color': '#cd5c5c'})  //信息、说明行
                                                   .find('.monaco-table-td:first').hide().end()
                                                   .find('.monaco-table-td:last').hide()
                    else $(keybinding_key).clone().appendTo($keybinding).text(keystrs.replace(/\s+/,' / ')+'（暂不能更改）')
                    return
                }
                let keystr_arr = keystrs.split(/\s+/)

                //合并同类项
                if(1&&combine === true) keystr_arr = kb.combine_same_keys(keystr_arr)
                //显示
                keystr_arr.forEach((split, index, array) => {
                    let keys = kb.strToKeys(split)
                    for (var i = 0; i < keys.length; i++) {
                        $(keybinding_key).clone().appendTo($keybinding).text(keys[i])
                        if(['ctrl', 'shift', 'alt'].indexOf(keys[i].toLowerCase()) !== -1)  //是控制键
                            $(separator).clone().appendTo($keybinding).text('+')
                    }
                    if(index < array.length-1)
                        $(separator).clone().appendTo($keybinding).text(delimiter)
                })
            }

            //滚动刷新
            function scroll_updata($dom, newY){
                let screen_height = $('.monaco-list').height();
                let screen_line_count = parseInt(screen_height/row_line_height);
                let scale = screen_line_count / (row_count + parseInt(screen_line_count/2));
                let limittop = (-row_count + parseInt(screen_line_count/1.75))*row_line_height;  // list高度+半屏空屏缓冲
                $scroll_element.find('.vertical').height(screen_height);
                $scroll_element.find('.slider').height(screen_height*scale);

                let newtop = +newY.top,
                    newslider = +newY.slider;
                if(isNaN(newtop) === true) newtop = newslider / scale;
                newtop = newtop >= 0 ? 0 : newtop <= limittop ? limittop : newtop;
                $dom.find('.monaco-list-rows').css({top: `${newtop}px`});  //list
                $dom.find('.slider').css({top: `${-newtop * scale}px`});  //进度条
            }

            //=========初始化==========//
            //初始化list_row
            function init_list_row(){
                //#cd5c5c55
                function set_status_svg(stroke){
                    return `<svg viewBox="-250.88 -350.88 1013.76 1013.76" fill="#000000" stroke="#000000" stroke-width="0" transform="matrix(-0.60, 0, 0, 0.60, 0, 0)rotate(0)">
                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="${stroke}" stroke-width="102.4"><path fill="#000000" d="M105.367 18.328c23.14 15.444 46.098 31.27 68.55 47.572-45.055-20.895-94.51-35.918-149.37-44.246 46.697 26.72 91.596 55.58 135.705 85.524-37.203-18.033-77.48-32.22-121.602-41.37 58.218 34.322 109.368 72.465 154.71 114.206C136.02 227.227 86.295 284.717 45.79 354.18c27.11-24.29 54.91-47.545 82.868-70.68C81.942 339.36 45.05 405.01 20.2 482.135c20.36-24.62 40.988-48.203 61.905-70.817 44.7-67.485 89.567-147.11 148.856-170.418-29.61 30.708-63.36 75.164-98.25 118.145 40.99-40.437 83.09-77.46 126.415-111.512 61.598 70.49 110.757 149.38 152.145 235.873-6.738-44.794-16.796-87.384-30.03-127.666l46.444 65.53s-26.037-72.69-43.66-101.987c40.76 55.91 78.208 114.428 112.328 175.205-18.674-89.454-50.512-169.772-98.893-238.224 34.906 34.69 68.637 71.1 100.93 109.045C465.048 288.827 423.58 221.82 372.214 167c40.224-25.887 81.48-49.73 123.863-71.783-32.025 5.56-62.49 12.92-92.006 21.934 21.836-16.173 44.41-32.124 67.024-47.523-37.987 11.91-74.633 25.775-109.067 41.433 42.668-27.673 86.32-53.668 131.004-78.602h-.003c-67.47 18.055-130.83 42.19-188.998 73.548-56.294-41.79-122.01-71.787-198.663-87.68z"></path></g>
                                <g id="SVGRepo_iconCarrier"><path fill="#000000" d="M105.367 18.328c23.14 15.444 46.098 31.27 68.55 47.572-45.055-20.895-94.51-35.918-149.37-44.246 46.697 26.72 91.596 55.58 135.705 85.524-37.203-18.033-77.48-32.22-121.602-41.37 58.218 34.322 109.368 72.465 154.71 114.206C136.02 227.227 86.295 284.717 45.79 354.18c27.11-24.29 54.91-47.545 82.868-70.68C81.942 339.36 45.05 405.01 20.2 482.135c20.36-24.62 40.988-48.203 61.905-70.817 44.7-67.485 89.567-147.11 148.856-170.418-29.61 30.708-63.36 75.164-98.25 118.145 40.99-40.437 83.09-77.46 126.415-111.512 61.598 70.49 110.757 149.38 152.145 235.873-6.738-44.794-16.796-87.384-30.03-127.666l46.444 65.53s-26.037-72.69-43.66-101.987c40.76 55.91 78.208 114.428 112.328 175.205-18.674-89.454-50.512-169.772-98.893-238.224 34.906 34.69 68.637 71.1 100.93 109.045C465.048 288.827 423.58 221.82 372.214 167c40.224-25.887 81.48-49.73 123.863-71.783-32.025 5.56-62.49 12.92-92.006 21.934 21.836-16.173 44.41-32.124 67.024-47.523-37.987 11.91-74.633 25.775-109.067 41.433 42.668-27.673 86.32-53.668 131.004-78.602h-.003c-67.47 18.055-130.83 42.19-188.998 73.548-56.294-41.79-122.01-71.787-198.663-87.68z"></path></g>
                            </svg>
                           `
                }

                function ret_list_row(index, text, key, keystr, keycount, delimiter, nonuse, syskey, top){
                    const parity = ['even', 'odd'];
                    return `<div class="monaco-list-row ${nonuse === ON ? 'mask' : ''}" data-parity="${parity[index%2]}" role="listitem" data-index="${index}" data-last-element="false" aria-setsize="1928" aria-posinset="11" id="list_id_9_10" aria-selected="false"
                            aria-label="笔记本: 加入上一个单元格, Shift+Alt+Windows+J, 默认值notebookEditorFocused" draggable="false" style="top: ${top}px; height: 24px;">
                                <div class="monaco-table-tr">
                                    <!-- 状态栏 -->
                                    <div class="monaco-table-td" data-col-index="1" style="width: 30px; cursor: pointer">
                                        <div class="usable-sign" ${nonuse === ON ? 'style="display: block"' : 'style="display: none"'}>${set_status_svg('#cd5c5c55')}</div>
                                        <div class="usable-hover" style="display: none">${set_status_svg('#cd5c5ccc')}</div>
                                    </div>

                                    <!-- 说明 -->
                                    <div class="monaco-table-td" data-col-index="2" style="width: 240px;">
                                        <div>${text}</div>
                                    </div>
                                    
                                    <!-- 键位 -->
                                    <div class="monaco-table-td" data-col-index="3" style="width: 423px;">
                                        <div class="monaco-keybinding" key-id="${key}" key-text="${text}" key-str="${keystr}" key-count="${keycount}" key-delimiter="${delimiter}" key-sys="${syskey}" style="color: rgb(204, 204, 204);">
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                }

                let $div = $('<div>');
                for (let [key, {text, tempargs, keystr, keycount, display, delimiter, nonuse, syskey}] of Object.entries(config.sets['keyBinding'].options)) {
                    if(delimiter === undefined) delimiter = '/';  // 默认是'/'

                    let list_row;
                    if(display === 'none')
                        list_row = ret_list_row(-1, text, key, keystr, keycount, delimiter, nonuse, syskey, -1*row_line_height);
                    else
                        list_row = ret_list_row(row_count++, text, key, keystr, keycount, delimiter, nonuse, syskey, (row_count-1)*row_line_height);

                    let $list_row = $(list_row);

                    ///////////////////////////////////////////
                    //创建一个 args num input
                    // eslint-disable-next-line no-inner-declarations
                    function create_num_input(key, arg, arg_index){
                        //创建inputDOM
                        function create_num_input_$dom(key, arg){
                            let $container = $(`<div class="hhh-bpx-player-dm-setting_container"></div>`);
                            $container.append(`<input key="${key}" class="hhh-bpx-player-dm-setting-number" style="margin:0px" type="tel" min="${arg.opt.min}" max="${arg.opt.max}" 
                                                                   value="${arg.value}" placeholder="${arg.value}" step="${arg.opt.step}">`)

                            if(bb_type.indexOf(BILI_3_X_VIDEO) !== -1 && !!arg.opt)
                                tip_create_3_X({ target: $container, tip_target: $('#hhh_tip'), color: '#00ffff', title: arg.opt.tip[0], gap: 1 });
                            
                            return $container;
                        }

                        //设置inputDOM event
                        function num_input_event_init($num_input_dom, arg_index){
                            let $input = $num_input_dom.find('input')
                            //---change---
                            $input.off('change.hhh_num_input');
                            $input.on ('change.hhh_num_input', function(){
                                let $this = $(this)
                                let key = $this.attr('key')
                                let args = config.getCheckboxSettingTempArgs(key)
                                
                                args[arg_index]['value'] = $this.val()
                                config.setCheckboxSettingTempArgs(key, args);
                                config.storageCheckboxSetting();
                            });

                            //---focus---
                            $input.off('focus.hhh_num_input');
                            $input.on ('focus.hhh_num_input', function(){
                                //---keydown stopPropagation on---
                                $('body').off('keydown.hhh_num_input');
                                $('body').on ('keydown.hhh_num_input', function(e){ e.stopPropagation() });
                                $(this).css({width: "36px"}).prop('type', 'number');
                            })
                            //---dblclick---
                            //* 双击 number input 会透过input节点产生blur事件 */ bug？
                            $input.off('dblclick.hhh_num_input');
                            $input.on ('dblclick.hhh_num_input', function(e){
                                e.stopImmediatePropagation()
                                e.preventDefault()
                            })
                            //---blur---
                            $input.off('blur.hhh_num_input');
                            $input.on ('blur.hhh_num_input', function(){
                                //---keydown stopPropagation off---
                                $('body').off('keydown.hhh_num_input');
                                $(this).prop('type', 'tel');                                
                                this.style.width = "10px";  //让 scrollWidth 获取最小值，达到回缩的效果
                                this.style.width = (this.scrollWidth)+"px";
                            })

                            //---mouseenter、mouseleave---
                            $input.off('mouseenter.hhh_num_input');
                            $input.off('mouseleave.hhh_num_input');
                            $input.on ('mouseenter.hhh_num_input', function(){
                                let $this = $(this);
                                $this.css({width: "36px"}).prop('type', 'number');
                                let rect = this.getBoundingClientRect();
                                document.onmousemove = function(e){
                                    let x = e.clientX;
                                    let y = e.clientY;
                                    if(x < rect.left || x > rect.right || y < rect.top || y > rect.bottom ){
                                        $this.mouseleave();
                                    }
                                }
                            }).on('mouseleave.hhh_num_input', function(){
                                document.onmousemove = null;
                                if(this !== document.activeElement){
                                    $(this).prop('type', 'tel');
                                    this.style.width = "10px";  //让 scrollWidth 获取最小值，达到回缩的效果
                                    this.style.width = (this.scrollWidth)+"px";
                                }
                            })
                        }

                        let $num_input_dom = create_num_input_$dom(key, arg)
                        num_input_event_init($num_input_dom, arg_index)

                        return $num_input_dom
                    }

                    //插入到相应 list row
                    if(!!tempargs){
                        let $text = $(`<div style="display: contents"></div>`)
                        let static_text = text.split(/\${.+?}/)
                        let i;

                        for(i = 0; i < tempargs.length; ++i){
                            $text[0].appendChild( document.createTextNode(static_text[i]) )
                            $text[0].appendChild( create_num_input(key, tempargs[i], i)[0] )
                        }
                        $text[0].appendChild( document.createTextNode(static_text[i]) )

                        $list_row.find(`:contains(${text}):last`).replaceWith($text)
                    }

                    $list_row.appendTo($div);
                    set_keybinding_key($list_row.find('.monaco-keybinding'), keystr, true);
                    if(display === 'none') $list_row.hide();
                }
                $div.find('.monaco-list-row').appendTo($('.monaco-list-rows'));
                
                //初始化input宽度
                $('.monaco-list-rows').find('.hhh-bpx-player-dm-setting-number').mouseenter().mouseleave()

                //滚动条半屏空屏
                if($('.monaco-list').height() < row_count*row_line_height){

                    //初始化滚动条
                    scroll_updata($scroll_element, {top: 0})

                    //滚轮滚动条
                    $scroll_element.on('mousewheel',function(e){
                        var wheelDelta = e.originalEvent.wheelDelta;
                        let delta = wheelDelta >= 0 ? row_line_height*2 : -row_line_height*2;
                        let newtop = parseInt($(this).find('.monaco-list-rows').css('top').split('px')[0]) + delta;
                        scroll_updata($(this), {top: newtop});
                        return false;
                    });

                    let track = 'mouseover';
                    //拖动滚动条
                    $scroll_element.find('.slider').mousedown(function(e){
                        let $this = $(this);
                        let doc = document;

                        $this.addClass('active');

                        let fixed_offsetY = e.clientY - parseInt($this.css('top').split('px')[0]);  //点击时鼠标坐标Y相对滚动条top的偏移

                        doc.onmousemove = function(e){
                            scroll_updata($scroll_element, {slider: parseInt(fixed_offsetY - e.clientY)});
                        };

                        doc.onmouseup = function(){
                            //清除事件
                            doc.onmousemove = null;
                            doc.onmouseup = null;

                            $this.removeClass('active');
                            track === 'mouseleave' && $scroll_element.mouseleave();

                            return false;
                        }

                        return false;
                    });

                    //点击滚动条轨道，滑块中点移到点击位置
                    $scroll_element.find('.vertical').mousedown(function(e){
                        let newslider = $(this).find('.slider').height()/2 - e.offsetY;  //计算滑块中点相对于鼠标点击位置偏移
                        scroll_updata($scroll_element, {slider: newslider});
                        return false;
                    });

                    //over & leave
                    $scroll_element.mouseover(function(){
                        track = 'mouseover';
                        if($(this).find('.slider').hasClass('active') !== true){
                            $(this).find('.vertical').removeClass('invisible')
                                                     .removeClass('fade')
                                                     .addClass('visible');
                        }
                    }).mouseleave(function(){
                        track = 'mouseleave';
                        if($(this).find('.slider').hasClass('active') !== true){
                            $(this).find('.vertical').removeClass('visible')
                                                     .addClass('invisible')
                                                     .addClass('fade');
                        }
                    });
                }

                //焦点集中在第一项
                $('.monaco-list-row').removeClass('focused');
                $('.monaco-list-row:first').addClass('focused');
            }

            //=========事件==========//
            //list-row Event
            function set_listrow_event(open){
                //input Event
                function set_input_event(open){
                    //===========
                    //input Event
                    function set_widget(curr_keystr){
                        function set_input(keystr){
                            let delimiter = $('.defineKeybindingWidget .monaco-keybinding').attr('key-delimiter');
                            delimiter = delimiter === '/' ? ' / ' : delimiter;
                            $('.defineKeybindingWidget input').val(keystr.replace(/\s+/g, `${delimiter}`));
                        }
                        function set_existing(keystr){
                            let str = keystr.split(' ').slice(-1)[0];
                            let keyarr = config.findKeyBinding(str);
                            let len = keyarr.length;
                            let html = '';
                            if(len > 0){  //有重复
                                let len_html = '';
                                let sys_html = '';
                                let id_text = '';
    
                                //如果是系统快捷键
                                let i = 0;
                                for (; i < keyarr.length-1; i++) {
                                    const o = keyarr[i];
                                    if(o.is_system_key) id_text += `"${o.id}（系统命令）" / `;
                                    else id_text += `"${o.id}" / `;
                                }
                                if(keyarr[i].is_system_key) id_text += `"${keyarr[i].text}（系统命令）"`;
                                else id_text += `"${keyarr[i].text}"`;
    
                                //如果多于一个
                                if(len > 1) len_html = `等 <span style="color:orangered">${len}</span> 个命令`;
    
                                html = `<div>已有命令<span style="color:orangered"> ${id_text} </span>${len_html}绑定此按键</div>`
    
                            }
                            let $existing = $main.find($('.existingText'));
                            $existing.text('').append(html);
                        }
    
                        //设置 input keybinging existing
                        let keycount = Math.abs(+$('.defineKeybindingWidget .monaco-keybinding').attr('key-count'));
                        let keystr_temp = $('.defineKeybindingWidget .monaco-keybinding').attr('key-str-temp');
    
                        let keystr = curr_keystr;
                        if(keystr_temp !== '' && keystr_temp.split(' ').length < keycount){
                            keystr = keystr_temp + ' ' + keystr;
                        }
    
                        set_input(keystr);
                        set_keybinding_key($('.defineKeybindingWidget .monaco-keybinding'), keystr, true);
                        set_existing(keystr);
    
                        return keystr;
                    }

                    if (open !== ON){
                        $main.find('input').off('keydown.hhh_widget_input');
                        $main.find('input').off('keyup.hhh_widget_input');
                        $main.find('input').add('.defineKeybindingWidget').off('mousewheel.hhh_widget_input');
                        $main.find('input').off('blur.hhh_widget_input');
                    }else{
                        //----------------
                        //keydown && keyup
                        $main.find('input').off('keyup.hhh_widget_input');
                        $main.find('input').on ('keyup.hhh_widget_input',function(){
                            oldkeystr = ''; oldwheelstr = '';
                        });
                        $main.find('input').off('keydown.hhh_widget_input');
                        $main.find('input').on ('keydown.hhh_widget_input',function(e){
                            let curr_keystr = kb.delSpace(kb.stringifyKeyCode(e));
                            if(curr_keystr === oldkeystr) return false;
                            
                            if(curr_keystr === 'Enter'){  //确定keybinding
                                $('.overlay-container').hide();
                                //更新list-row
                                let index = $('.defineKeybindingWidget').attr('data-index');
                                let $keybinding = $('.monaco-list-rows .monaco-list-row').eq(index).find('.monaco-keybinding');
                                let keystr = $('.defineKeybindingWidget .monaco-keybinding').attr('key-str');
                                let keyid = $('.defineKeybindingWidget .monaco-keybinding').attr('key-id');
                                set_keybinding_key($keybinding, keystr, true);
    
                                //log('确认: '+keyid+' - '+keystr);
                                config.setKeySettingKeystr(keyid, keystr);
                                config.storageCheckboxSetting();
    
                            }else if(curr_keystr === 'Escape'){  //取消keybinding
                                $('.overlay-container').hide();
                            }else{  //储存keybinding
                                let keystr = set_widget(curr_keystr);
                                let curr_last_keystr = kb.getkeyCode(e.keyCode);
                                if(['ctrl', 'shift', 'alt'].indexOf(curr_last_keystr.toLowerCase()) === -1){  //  非控制键暂存
                                    $('.defineKeybindingWidget .monaco-keybinding').attr('key-str-temp', keystr);
                                }
                            }
    
                            oldkeystr = curr_keystr;
                            return false;
                        });
                        //----------
                        //mousewheel
                        $main.find('input').add('.defineKeybindingWidget').off('mousewheel.hhh_widget_input');
                        $main.find('input').add('.defineKeybindingWidget').on ('mousewheel.hhh_widget_input',function(e){
                            e.keyCode = e.originalEvent.wheelDelta >= 0 ? '300' : '301';
                            let curr_keystr = kb.delSpace(kb.stringifyKeyCode(e));
    
                            //
                            // let id, index, key;
                            // //e.ctrlKey = true;
                            // let keybindings = config.findKeyBinding(kb.delSpace(kb.stringifyKeyCode(e)));
    
                            // if(keybindings.length){
                            //     id = keybindings[0]['id'];
                            //     index = keybindings[0]['index'];
                            //     key = keybindings[0]['key'];
                            // };
    
                            // keybindings.forEach(element => {
                            //     log(element)
                            // });
                            //
    
                            if(curr_keystr === oldwheelstr) return false;
    
                            let keystr = set_widget(curr_keystr);
                            $('.defineKeybindingWidget .monaco-keybinding').attr('key-str-temp', keystr);
    
                            oldwheelstr = curr_keystr;
                            return false;
                        });
                        //-----
                        //blur
                        $main.find('input').off('blur.hhh_widget_input');
                        $main.find('input').on ('blur.hhh_widget_input',function(){
                            $('.overlay-container').hide();
                            $main.find('input').off('keydown.hhh_widget_input');
                            $main.find('input').off('keyup.hhh_widget_input');
                            $main.find('input').add('.defineKeybindingWidget').off('mousewheel.hhh_widget_input');
                        })
                    }
                }

                function key_input_run(){
                    // log('--key_input_run--')
                    // log(+$('.monaco-list-row.focused .monaco-keybinding').attr('key-count'))
                    // log(typeof $('.monaco-list-row.focused .monaco-keybinding').attr('key-sys'), $('.monaco-list-row.focused .monaco-keybinding').attr('key-sys'), ON)
                    if( +$('.monaco-list-row.focused .monaco-keybinding').attr('key-count') <= 0
                        || $('.monaco-list-row.focused .monaco-keybinding').attr('key-sys') === String(ON) )  //不可设置
                        return false;
                    let bindWidth = $('.keybindings-editor').width();
                    let bindHeight = $('.keybindings-editor').height();
                    let inputWidth = $('.defineKeybindingWidget').outerWidth();
                    let inputHeight = $('.defineKeybindingWidget').outerHeight();
                    let index = $('.monaco-list-row.focused').attr('data-index');
                    $('.defineKeybindingWidget').css({left: `${(bindWidth-inputWidth)/2}px`, top: `${(bindHeight-inputHeight)/2}px`})
                                                .attr({'data-index': index});

                    let key_id = $('.monaco-list-row.focused').find('.monaco-keybinding').attr('key-id');
                    let key_str = $('.monaco-list-row.focused').find('.monaco-keybinding').attr('key-str');
                    let key_count = $('.monaco-list-row.focused').find('.monaco-keybinding').attr('key-count');
                    let delimiter = $('.monaco-list-row.focused').find('.monaco-keybinding').attr('key-delimiter');
                    $('.defineKeybindingWidget .monaco-keybinding').attr({'key-id': key_id, 'key-str': key_str, 'key-count': key_count, 'key-delimiter': delimiter, 'key-str-temp': ''});

                    $('.defineKeybindingWidget .existingText').text('');
                    let key_count_str = +key_count===1 ? '' : `（${key_count}组）`;
                    $('.defineKeybindingWidget .message').text(`先按所需的组合键${key_count_str}，再按 Enter 键。`);
                    $('.defineKeybindingWidget .monaco-keybinding').empty();

                    $('.overlay-container').show();
                    $('.defineKeybindingWidget input').val('').focus();

                    oldkeystr = '';
                    oldwheelstr = '';

                    set_input_event(ON);
                    //set_widget(key_str);  //可以在显示时初始化
                }

                if (open !== ON){
                    $('body').off('keydown.hhh_widget_listrow');
                    $main.find('.monaco-list-rows').off('click.hhh_widget_listrow');
                    $main.find('.monaco-list-rows').off('dblclick.hhh_widget_listrow');
                }else{
                    //--------
                    //keydown
                    $('body').off('keydown.hhh_widget_listrow');
                    $('body').on ('keydown.hhh_widget_listrow',function(e){
                        if(config.group !== 'keyBinding') return;  //选择执行 key event

                        let kcode = kb.getkeyCode(e.keyCode);
                        if(kcode === 'Enter'){
                            key_input_run();
                            e.stopImmediatePropagation()
                            e.preventDefault()
                        }else if(kcode === '↑' || kcode === '↓' ){
                            let $next_prev = $('.monaco-list-row.focused').next();
                            if(kcode === '↑'){
                                $next_prev = $('.monaco-list-row.focused').prev();
                            }

                            if($next_prev.length !== 0 && $next_prev.css('display') !== 'none'){
                                $('.monaco-list-row.focused').removeClass('focused');
                                $next_prev.addClass('focused');
                            }else{
                                $next_prev = $('.monaco-list-row.focused');
                            }

                            let rows_top = +Math.abs($scroll_element.find('.monaco-list-rows').css('top').split('px')[0]);
                            let screen_height = $('.monaco-list').height();
                            let focus_row_top = +$next_prev.css('top').split('px')[0];
                            let focus_row_bottom = focus_row_top + $next_prev.height();
                            let focus_row_virtual_top = focus_row_bottom - screen_height;
                            if(rows_top > focus_row_top) {
                                scroll_updata($scroll_element, {top: -focus_row_top});
                            }else if(rows_top < focus_row_virtual_top) {
                                scroll_updata($scroll_element, {top: -focus_row_virtual_top});
                            }
                            e.stopImmediatePropagation()
                            e.preventDefault()
                            //log('curr_row_top: '+focus_row_bottom+' - rows_top: '+rows_top+' - focus_row_virtual_top: '+(focus_row_bottom-screen_height))
                        }
                    });
                    //------------------
                    //click && dblclick
                    $main.find('.monaco-list-rows').off('click.hhh_widget_listrow');
                    $main.find('.monaco-list-rows').off('dblclick.hhh_widget_listrow');
                    $main.find('.monaco-list-rows').on ('click.hhh_widget_listrow',function(e){
                        let $target = $(e.target);
                        $('.monaco-list-row').removeClass('focused');
                        $target.parents(".monaco-list-row").addClass('focused');
                    }).on('dblclick.hhh_widget_listrow',function(){
                        key_input_run();
                    });
                    //------------------
                    //mouseenter & mouseleave
                    $main.find('.monaco-list-row').off('click.hhh_widget_listrow');
                    $main.find('.monaco-list-row').off('mouseenter.hhh_widget_listrow');
                    $main.find('.monaco-list-row').off('mouseleave.hhh_widget_listrow');
                    $main.find('.monaco-list-row').on ('mouseenter.hhh_widget_listrow',function(){
                        let key_id = $(this).find('.monaco-keybinding').attr('key-id')  // 第三个
                        let keycount = config.getKeySettingKeycount(key_id)
                        if(keycount > 0){
                            $(this).find('.monaco-table-td:first>.usable-sign').hide()
                            $(this).find('.monaco-table-td:first>.usable-hover').show()
                        }
                    }).on('mouseleave.hhh_widget_listrow',function(){
                        let key_id = $(this).find('.monaco-keybinding').attr('key-id')  // 第三个
                        let keycount = config.getKeySettingKeycount(key_id)
                        if(keycount > 0){
                            $(this).find('.monaco-table-td:first>.usable-hover').hide()
                            if(config.getKeySettingNonuse(key_id) === ON){
                                $(this).find('.monaco-table-td:first>.usable-sign').show()
                            }else{
                                $(this).find('.monaco-table-td:first>.usable-sign').hide()
                            }
                        }
                    }).on('click.hhh_widget_listrow',function(e){
                        let $target = $(e.target)
                        if((e.target.className === 'monaco-table-td' && $target.index() === 0) || $target.parents(".monaco-table-td").index() === 0){ // 第一个
                            let key_id = $(this).find('.monaco-keybinding').attr('key-id')  // 第三个
                            let keycount = config.getKeySettingKeycount(key_id)
                            if(keycount > 0){
                                $(this).find('.monaco-table-td:first>.usable-hover').hide()
                                let nonuse = !config.getKeySettingNonuse(key_id)
                                config.setKeySettingNonuse(key_id, nonuse)
                                config.storageCheckboxSetting()
                                function showtip(title, $target){
                                    tip_create_3_X({ target: $target, tip_target: $('#hhh_tip'), color: '#cd5c5c', title: title, delay: 1, duration: 1000, gap: 1, once: ON })
                                }
                                if(nonuse === ON){
                                    $(this).find('.monaco-table-td:first>.usable-sign').show()
                                    showtip('已屏蔽', $(this).find('.monaco-table-td'))
                                }else{
                                    $(this).find('.monaco-table-td:first>.usable-sign').hide()
                                    showtip('解除屏蔽', $(this).find('.monaco-table-td'))
                                }
                                $(this).toggleClass('mask')
                                return false
                            }
                        }
                    });
                }
            }

            init_list_row();
            set_listrow_event(ON);

            // $('.bpx-player-dm-setting').mouseenter()
            // $('#hhh_custom').click()

            // $('#keyBinding').click()
            // $('#hhh_item>div:first').css({'height':'max-content','width':'max-content'})

            // {
            //     "key": "ctrl+h",
            //     "command": "workbench.action.tasks.runTask",
            //     "args": {
            //       "task": "VS Code - Build",
            //       "type": "npm"
            //     }
            // }

        }

        //自定义快捷键设置
        //ON - 启用热键，OFF - 关闭热键
        function set_hotkey(open){
            if (open !== ON){
                $(document).off('keyup.hhh_lightoff')
                $(document).off('keydown.hhh_lightoff')
                $(document).off('mousewheel.hhh_lightoff')
                $(document).off('DOMMouseScroll.hhh_lightoff')
            }else{
                var parent = document;
                var like_shake = false;
                var prev_time = 0;
                var old_index = app_page_parameters.player_setting_area;
                is_show_hint = config.getCheckboxSettingStatus('hotKeyHint');

                let time1 = 0, time2 = 0, diff = 0;

                // eslint-disable-next-line no-inner-declarations
                function hot_run(e){
                    let id, text, index, key, status
                    let keybindings = config.findKeyBinding(kb.delSpace(kb.stringifyKeyCode(e)))
                    // log(keybindings)

                    if(keybindings.length === 0) return

                    let nonuse = keybindings[0]['nonuse']  //控制执行当前热键
                    let is_system_key = keybindings[0]['is_system_key']  //是否是系统热键
                    // log('①',id,nonuse)
                    // e.type === 'keydown' && log('--1--',keybindings)
                    if(is_system_key === ON && nonuse === ON){ e.preventDefault(); e.stopPropagation(); return }

                    if(nonuse !== ON){
                        id = keybindings[0]['id']
                        text = e.type === 'keyup' ? keybindings[0]['text'] + e.type : keybindings[0]['text']
                        index = keybindings[0]['index']
                        key = keybindings[0]['key']

                        // setInterval((e) => {
                        //    log(count)
                        //    count = 0
                        // }, 1000);

                        //特例
                        if((e.type === 'mousewheel' || e.type === 'DOMMouseScroll') && text !== '非全屏音量调节${step}%'){
                            e.preventDefault()
                            e.stopPropagation()
                        }
                        
                        // log(id)
                        // log(text)
                        // log(text,id)
                        // log('非全屏音量调节\${step}%',id)
                        // log((text+id) === '非全屏音量调节\${step}%',id)

                        if(text === '快进/快退时显示醒目进度条'){  //快进时显示醒目进度条 && 段落循环
                            //log( $('#hhh_loop_wrap')[0].hhh_loop_time_id );
                            // if(0&&$('#hhh_loop_wrap')[0].hhh_loop_time_id === true){
                            //     return false;
                            // }else{
                                if(config.getCheckboxSettingStatus('reloadDanmuku') === ON) {
                                    //恢复重载弹幕效果
                                    e.stopPropagation();
                                    h5Player.currentTime = index === 0 ? h5Player.currentTime - 5 : h5Player.currentTime + 5;
                                    h5Player.play();
                                    setTimeout(function(){
                                        $(bb['danmakuSwitch']).last().find('input').click();
                                        $(bb['danmakuSwitch']).last().find('input').click();
                                    },0);
                                }
                                //快进/快退时显示醒目进度条
                                dynamicProgress(12, 2)
                                //按↔取消自定义播放下一P提示
                                if($('.bpx-player-toast-wrap .bpx-player-toast-text').text().match('秒钟后播放下一P') !== null){
                                    $('.bpx-player-toast-wrap .bpx-player-toast-cancel').click()
                                    return false
                                }
                            //}
                        } else if(text === '合理空格键') {  //空格键2.X版本不合理，改成和3.X版本一样，3.X版也o了
                            if( config.getCheckboxSettingStatus('dynamicSpace') === ON && !is_fullscreen()){
                                if(g_is_in_biliplayer === false) e.stopPropagation()
                            }
                        } else if(text === '优先取消右键菜单等') {  //优先取消右键菜单等 Esc
                            //右键菜单
                            if($(bb['hotkeyPanel']).length === 1 && ($(bb['hotkeyPanel']).hasClass('active') === true || $(bb['hotkeyPanel']).css('display') !== 'none')){
                                //$(bb['hotkeyPanel']).removeClass('active').css('display', 'none');
                                $(bb['hotkeyPanel']).find(bb['hotkeyPanelClose']).click();  //慢
                                return false;
                            }
                            //右键菜单
                            if($(bb['playerContextMenu']).hasClass('active') === true || $(bb['playerContextMenu']).hasClass('bpx-player-active') === true ){
                                let evt = new MouseEvent('contextmenu', { clientX:-9999, clientY:-9999 });
                                $(bb['videoWrap'])[0].dispatchEvent(evt);
                                return false;
                            }
                            //封面
                            if($('#hhh_img').length > 0 && $('#hhh_img').css('display') !== 'none'){
                                $('#hhh_img').css('display', 'none');
                                return false;
                            }
                            //关闭打开的评论区图片
                            if($('#hhh_show_image_wrap').length > 0){
                                $('.operation-btn-icon.close-container').click()
                                return false;
                            }
                            //自定义播放下一P提示
                            if($('.bpx-player-toast-wrap .bpx-player-toast-text').text().match('秒钟后播放下一P') !== null){
                                $('.bpx-player-toast-wrap .bpx-player-toast-cancel').click()
                                return false
                            }
                        } else if(text === '有投币框时回车投币') {  //有投币框时回车投币 Enter
                            //log($(bb['coinDlgOkBtn']).length)
                            // if($(bb['coinDlgOkBtn']).length === 1){
                            //     $(bb['coinDlgOkBtn']).click();
                            // }
                        } else if(text === '关灯/开灯') {  //开关灯
                            $('#hhh_lightoff input').click();
                        } else if(text+id === '非全屏音量调节${step}%'+'onePerVolumeControl') {  //非全屏音量调节 0~1 （b站默认"滚轮"(如果使用滚轮的话)操作某些情况会失效，一并处理全屏情况）
                                                                    //两个参数指定屏幕范围（按百分比），第三个参数表示滚动一下增加的音量百分比，参数四表示暂停时是否调节
                            let delta = 1  //默认1%
                            for(let v of config.getCheckboxSettingTempArgs(id)){
                                if(v?.name === 'step') { delta = parseInt(v.value); break }
                            }
                            
                            let args = config.getCheckboxSettingArgs('volumeControlWhenNonFullScreen'),
                                isWheelVolume = config.getCheckboxSettingStatus('volumeControlWhenNonFullScreen'),
                                screen_left = args.screen_left,
                                screen_rght = args.screen_rght,
                                isPauseVolume = config.getCheckboxSettingStatus('volumeControlWhenPause');

                            if(isWheelVolume === OFF) return;

                            //缺省屏幕百分比参数，默认0.3~0.7
                            screen_left = (screen_left<0 || screen_left>1)? 0.3: screen_left;
                            screen_rght = (screen_rght<0 || screen_rght>1)? 0.7: screen_rght;
                            //缺省音量百分比，默认1
                            delta = (delta<1 || delta>100)? 1: delta;

                            //非暂停(可选) && 鼠标在屏幕指定位置时处理
                            let isPauseStillRun = isPauseVolume || h5Player.paused === false;
                            let Rect = $(bb['videoWrap'])[0].getBoundingClientRect();
                            let offsetX = e.originalEvent.x - Rect.x;
                            let inLimit = offsetX > Rect.width*screen_left && offsetX < Rect.width*screen_rght;

                            if(is_fullscreen() || (isPauseStillRun && (inLimit ||  (!e.type.includes('wheel') && e.type !== 'DOMMouseScroll') ))) {
                                //阻止页面滚动 && 阻止冒泡
                                if (e.type.includes('wheel') || e.type === 'DOMMouseScroll') {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }

                                let v = volume();
                                if(index === 0 || index === 2) {  //向上滚动，减少音量
                                    volume(+(v+(delta/100)).toFixed(3));  //+ string to number
                                } else if(index === 1 || index === 3) {  //向下滚动，增大音量
                                    volume(+(v-(delta/100)).toFixed(3));
                                }
                            }
                        } else if(text+id === '非全屏音量调节${step}%'+'fivePerVolumeControl') {  //音量控制，替换系统默认    let tempargs = config.getCheckboxSettingTempArgs(key);
                            let delta = 0.05  //默认5%
                            for(let v of config.getCheckboxSettingTempArgs(id)){
                                if(v?.name === 'step') { delta = parseInt(v.value)/100; break }
                            }
                            let diff = index === 0 ? delta : -delta
                            window.setTimeout((function() {  //长按时保持DOM更新
                                //volume(volume()+diff);
                                let vol = (volume() + diff).toFixed(2)
                                volume(diff > 0 ? Math.floor(vol*20)/20 : Math.ceil(vol*20)/20)  // 5%的倍数
                            }),10);
                            return false;
                        } else if(text === '全屏') {  //全屏
                            fullscreen();
                        } else if(text === '网页全屏') {  //网页全屏 B站改成点赞了
                            web_fullscreen();
                            e.stopPropagation();
                        } else if(text === '宽屏模式') {  //宽屏模式 B站改成投币了
                            is_fullscreen() ? web_fullscreen() : wide_screen();
                            e.stopPropagation();
                        } else if(text === '开关固定/彩色和特殊弹幕') {  //开关固定/彩色和特殊弹幕
                            if(index === 0){
                                $(bb['danmukuTopBottomClose']).length === 0 ? showHint(parent, '#hhh_wordsHint', '关闭固定弹幕') : showHint(parent, '#hhh_wordsHint', '打开固定弹幕');
                                dm_remember(function(){$(bb['danmukuTopBottom']).click()});
                            }else{
                                $(bb['danmukuColorClose']).length === 0 ? showHint(parent, '#hhh_wordsHint', '关闭彩色及特殊弹幕') : showHint(parent, '#hhh_wordsHint', '打开彩色及特殊弹幕');
                                dm_remember(function(){$(bb['danmukuColor']).click()});
                                dm_remember(function(){$(bb['danmukuSpecial']).click()});
                            }
                        } else if(text === '开关弹幕') {  //开关弹幕 bilibili增加了关弹幕的快捷键，也是D
                                $(bb['danmakuSwitch']).last().find('input').click();
                                is_show_hint && (is_danmaku_show() === true ? showHint(parent, '#hhh_wordsHint', '开弹幕') : showHint(parent, '#hhh_wordsHint', '关弹幕'));
                                e.stopPropagation();
                        } else if(text === '洗脑循环') {  //开关洗脑循环  B站改成一键三连了
                            $(bb['playSettingRepeatInput'])[0].checked ? showHint(parent, '#hhh_wordsHint', '关洗脑循环') : showHint(parent, '#hhh_wordsHint', '开洗脑循环');
                            $(bb['playSettingRepeatInput']).click();
                            e.stopPropagation();
                        } else if(text === '弹幕随屏幕缩放') {  //弹幕随屏幕缩放
                            $(bb['settingFs'])[0].checked === false ? showHint(parent, '#hhh_wordsHint', '弹幕随屏幕缩放') : showHint(parent, '#hhh_wordsHint', '弹幕不随屏幕缩放');
                            dm_remember(function(){$(bb['settingFs']).click()});
                        } else if(text === '增减弹幕透明度${step}%' ) {  //滚轮调节弹幕透明度（ctrl+滚轮），参数表示滚动一下增加的透明度百分比
                            if(config.getCheckboxSettingStatus('danmuOpacityControl') === OFF) return;
                            //阻止页面滚动 && 阻止冒泡
                            //e.preventDefault();
                            //e.stopPropagation();
                            //缺省透明度百分比，默认5
                            let delta = 5  //默认5%
                            for(let v of config.getCheckboxSettingTempArgs(id)){
                                if(v?.name === 'step') { delta = parseInt(v.value); break }
                            }
                            //let delta = parseInt(config.getCheckboxSettingArgs('danmuOpacityControl').delta);
                            delta = (delta<0 || delta>100)? 5: delta;
                            var opacity;
                            if(index === 0) {  //向上滚动，增大透明度
                                opacity = adjust_progress(bb['settingOpacity'], delta, 10, 100);
                            } else if(index === 1) {  //向下滚动，减少透明度
                                opacity = adjust_progress(bb['settingOpacity'], -delta, 10, 100);
                            }
                            if(opacity !== undefined) showHint(document, '#hhh_opacityHint', '透 '+opacity);
                        } else if(text === '减增弹幕透明度${step}%') {  //+ -弹幕透明度
                            let inc_percent = 10  //默认10%
                            for(let v of config.getCheckboxSettingTempArgs(id)){
                                if(v?.name === 'step') { inc_percent = parseInt(v.value); break }
                            }
                            inc_percent = index === 0 ? -inc_percent : inc_percent;
                            window.setTimeout((function() {  //长按时保持DOM更新
                                dm_remember(function(){
                                    let opacity = adjust_progress(bb['settingOpacity'], inc_percent, 10, 100);
                                    showHint(parent, '#hhh_opacityHint', '透 ' + opacity);
                                });
                            }),10);
                        } else if(text === '减增弹幕字号${step}%') {  //+ -弹幕字号
                            let inc_percent = 10  //默认10%
                            for(let v of config.getCheckboxSettingTempArgs(id)){
                                if(v?.name === 'step') { inc_percent = parseInt(v.value); break }
                            }
                            inc_percent = index === 0 ? -inc_percent : inc_percent;
                            //let inc_percent = index === 0 ? -10 : 10;
                            window.setTimeout((function() {  //长按时保持DOM更新
                                dm_remember(function(){
                                    let opacity = adjust_progress(bb['settingFontsize'], inc_percent, 50, 170);
                                    showHint(parent, '#hhh_opacityHint', '字 ' + opacity);
                                });
                            }),10);
                        } else if(text === '弹幕显示区域 1/10屏～不限') {  //弹幕显示区域
                            dm_remember(function(){
                                var area_text = {0:'1/10屏', 25:'1/4屏', 50:'半屏', 75:'3/4屏', 100:'全屏'};
                                var percent = index * 25;  //((0~4)*25)%
                                //弹幕显示区域大到小切换时清空弹幕
                                // console.log(old_index, index)
                                if(old_index > index){
                                    setTimeout(function(){
                                        $(bb['danmakuSwitch']).last().find('input').click();
                                        $(bb['danmakuSwitch']).last().find('input').click();
                                    },0);
                                }
                                old_index = index;
                                set_progress(bb['settingArea'], percent, 0, 100);
                                showHint(parent, '#hhh_wordsHint', area_text[percent]);
                            });
                        } else if(text === '快进/快退${second}s') {  //+ -30s ctrl+ left/right
                            h5Player = geth5Player()
                            $(bb['danmakuSwitch']).last().find('input').click().click()
                            let second = 30  //默认30s
                            for(let v of config.getCheckboxSettingTempArgs(id)){
                                if(v?.name === 'second') { second = parseInt(v.value); break }
                            }
                            h5Player.currentTime = index === 0 ? +h5Player.currentTime - second : +h5Player.currentTime + second;
                            h5Player.play();
                            dynamicProgress(12, 2);
                        } else if(text === '逐帧操作') {  //逐帧 shift+ left/right
                            time2 = new Date().getTime(); diff += time2 - time1; time1 = time2;
                            if(diff > 150) {  //避免连续按键时间间隔过短造成画面停止
                                diff = 0
                                h5Player.pause();
                                for(let move_frames = 1.01; move_frames>0.1;){
                                    let move_frames_time = move_frames/fps;
                                    h5Player.currentTime = index === 0 ? +(h5Player.currentTime - move_frames_time).toFixed(3) : +(h5Player.currentTime + move_frames_time).toFixed(3);
                                    if(prev_time === h5Player.currentTime){  //如果未走帧
                                        move_frames /= 2;
                                        //log('2.1: h5currTime: '+h5Player.currentTime+' - prev_time: '+prev_time+' - '+move_frames_time+' - '+move_frames);
                                        continue;
                                    }
                                    else{
                                        //log('2.2: h5currTime: '+h5Player.currentTime+' - prev_time: '+prev_time+' - '+move_frames_time+' - '+move_frames);
                                        let total_frame = +(h5Player.duration*fps).toFixed();
                                        let current_frame = +(h5Player.currentTime*fps).toFixed();
                                        showHint(parent, '#hhh_wordsHint', `${current_frame}/${total_frame}`);
                                        prev_time = h5Player.currentTime;
                                        break;
                                    }
                                }
                                e.stopPropagation();
                            }
                        } else if(text === '调节视频播放速度') {  //ctrl + ↑↓
                            if(config.getCheckboxSettingStatus('keyVideoSpeed') === OFF) return;
                            window.setTimeout((function() {  //长按时保持DOM更新
                                index === 0 ? video_select_speed(1) : video_select_speed(-1);
                            }),10);
                        } else if(text === '0.1倍速调节视频播放速度') {  //ctrl + '0'&'.'
                            window.setTimeout((function() {  //长按时保持DOM更新
                                index === 0 ? video_speed_0dot1(0.1) : video_speed_0dot1(-0.1);
                            }),10);
                        } else if(text === '调节自定义倍速速度') {  //shift + ↑↓
                            if(config.getCheckboxSettingStatus('customPlayRate') === OFF) return
                            const args = config.getCheckboxSettingArgs('customPlayRate')
                            const newrate = Math.max(0, (index === 0 ? +args.rate + 0.5 : +args.rate - 0.5))
                            const new_args = {rate: newrate}
                            //log(newrate, args.rate, config.getCheckboxSettingArgs('customPlayRate')['rate'])
                            config.setCheckboxSettingArgs('customPlayRate', {...args, ...new_args})
                            showHint(parent, '#hhh_wordsHint', `→${newrate.toFixed(1)}x`)
                            customPlayRate(config.getCheckboxSettingStatus('customPlayRate'), +config.getCheckboxSettingArgs('customPlayRate')['rate']);
                        } else if(text === '开关字幕') {  //E
                            subtitle()
                            e.stopPropagation()
                        } else if(text === '开关稍后再看') {  //H
                            is_watchlater_added() !== undefined && (is_watchlater_added() === false ? showHint(parent, '#hhh_wordsHint', '已加稍后再看') : showHint(parent, '#hhh_wordsHint', '已从稍后再看列表中移除'))  //有延迟
                            watchLater()
                            e.stopPropagation()
                        } else if(text === '开关深色模式') {  //X
                            enableDarkMode()
                            e.stopPropagation()
                        } else if(text === '点赞、投币、收藏、长按一键三连') {  //长按一键三连(keydown) - 对应系统快捷键 Q、R、W、E
                            if(index === 0 || index === 3){  //点赞、三连
                                $(bb['like'])[0].dispatchEvent( new MouseEvent('mousedown',{ bubbles:true }) )
                                $(bb['like'])[0].dispatchEvent( new MouseEvent('mouseup',{ bubbles:true }) )
                                if(like_shake === false) like_shake = !!$('.van-icon-videodetails_like.shake').length;
                            }else if(index === 1){  //投币
                                $(bb['coin']).click()
                                set_dialog('coin', 'hhh_test_coin')
                            }else if(index === 2){  //收藏
                                $(bb['collect']).click();
                            }
                        } else if(text === '点赞、投币、收藏、长按一键三连'+'keyup') {  //点赞；长按一键三连(keyup)
                            if(index === 0 || index === 1){
                                $(bb['like'])[0].dispatchEvent(new MouseEvent('mouseup'));
                                if(index === 0 && like_shake === false) {
                                    let like_text = $(bb['like']).text().match(/.+/)[0];
                                    let like_num = like_text.match(/\d+$/)? (+like_text.match(/\d+$/)[0])+1: like_text;
                                    if($(bb['likeon']).length === 1) showHint(parent, '#hhh_wordsHint', '取消点赞');
                                    else showHint(parent, '#hhh_wordsHint', `点赞成功 ${like_num}`);
                                    $(bb['like']).click();
                                }
                                like_shake = false;
                            }
                        } else if(text === 'list播放方式切换') {  //list播放方式切换
                            $('#hhh_auto_list_play .handoff-item.on').next().add($('.handoff .handoff-item:first')).click()
                            showHint(parent, '#hhh_wordsHint', $('#hhh_auto_list_play .handoff-item.on').text())
                        //排序后可以正确打开下一集
                        } else if (1&&e.type === 'keydown' && (e.key === '[' || e.key === ']')) {  //  '[' ']'
                            if(['视频选集', '合集', '收藏列表'].includes(video_type) === true) {
                                //多级收藏列表情况执行默认行为
                                if($('.multip-list-item').length > 0) return

                                let next_video  = $('.video-pod__item.active').next()
                                                  .add($('.simple-base-item.normal, .simple-base-item.sub').get($('.simple-base-item.normal, .simple-base-item.sub').index($('.simple-base-item.normal.active, .simple-base-item.sub.active'))+1))
                                                //    .add($('.single-p .simple-base-item.active').parent().parent().next().find('.simple-base-item'))
                                                //    .add($('.multi-p .simple-base-item.sub.active').next())
                                                   .add($('.singlep-list-item-inner.siglep-active').parent().parent().next().find('.singlep-list-item-inner'))
                                                   //.add($('.multip-list-item').get($('.multip-list-item').index($('.multip-list-item-active'))+1))
                                let item_len = $('.simple-base-item.normal, .simple-base-item.sub').length
                                let prev_video  = $('.video-pod__item.active').prev()
                                                  .add($('.simple-base-item.normal, .simple-base-item.sub').get(-item_len+$('.simple-base-item.normal, .simple-base-item.sub').index($('.simple-base-item.normal.active, .simple-base-item.sub.active'))-1))
                                                //    .add($('.single-p .simple-base-item.active').parent().parent().prev().find('.simple-base-item'))
                                                //    .add($('.multi-p .simple-base-item.sub.active').prev())
                                                   .add($('.singlep-list-item-inner.siglep-active').parent().parent().prev().find('.singlep-list-item-inner'))
                                                   //.add($('.multip-list-item').get($('.multip-list-item').index($('.multip-list-item-active'))-1))

                                if(e.key === ']') next_video.click()  //下一集
                                else prev_video.click()  //上一集
                                
                                e.stopPropagation()
                            }
                        //TEST
                        } else if(e.type === 'keydown' && (e.keyCode === 'X'.charCodeAt() || e.keyCode === keycode['/'])) {  //TEST 显示、隐藏video-control、高能进度条
                            if(bb_type.indexOf(BILI_2_X) !== -1){
                                if($(bb['playArea']).hasClass('video-control-show') === true) $(bb['playVideoControlWrap']).mouseout();
                                else $(bb['playVideoControlWrap']).mousemove();
                            }else{
                                if($('.bpx-player-container').attr('data-ctrl-hidden') === "true"){
                                    $('.bpx-player-container').attr('data-ctrl-hidden', "false");
                                    $('.bpx-player-control-entity').attr('data-shadow-show','false');
                                    $(bb['playPBP']).addClass('show')  //高能进度条
                                }else{
                                    $('.bpx-player-container').attr('data-ctrl-hidden', "true");
                                    $('.bpx-player-control-entity').attr('data-shadow-show','true');
                                    $(bb['playPBP']).removeClass('show')
                                }
                            }
                        } else if(e.type === 'keydown' && (e.keyCode === 'H'.charCodeAt())) {  //TEST
                            //if(bb_type===BILI_3_X_MOVIE) $('.bpx-player-dm-setting-wrap').css('display','block');
                            $('.bilibili-player-video-danmaku-setting-wrap').mouseover();
                            //$('.bilibili-player-area.video-state-blackside').attr('class', 'bilibili-player-area video-state-blackside video-state-pause video-control-show');
                        } else{
                            //console.dir(e.keyCode);
                        }
                    }

                    // let syskey = ['Q','W','E','R','Space','→','←','↑','↓','Esc','F','[',']','Enter','D','M','Shift+1','Shift+2']
                    //屏蔽系统快捷键
                    if(e.type === 'keydown'){
                        // log('---syskey---', e.key, e.ctrlKey, e.shiftKey, e.altKey)
                        // log('keybindings',keybindings)
                        for(let i=0; i<keybindings.length; i++){
                            if(keybindings[i].is_system_key === true && keybindings[i].nonuse === true){
                                // log(keybindings[i].key)
                                // e.preventDefault()
                                e.stopPropagation()
                                break
                            }
                        }
                    }
                }

                //key
                // eslint-disable-next-line no-inner-declarations
                function global_binding_key(){
                    $(document).off('keydown.hhh_lightoff keyup.hhh_lightoff');
                    $(document).on('keydown.hhh_lightoff keyup.hhh_lightoff',function(e){
                        // log('--------',e)
                        //跳过输入框
                        if(!!e.target.type && e.target.type.toLowerCase().search(/text|textarea/) !== -1) return true
                        if(e.target.className === 'ql-editor') return true
                        
                        //log('global_binding_key2:'+e.target.type)

                        //处理键盘及鼠标
                        return hot_run(e);

                    });
                }
                //wheel
                // eslint-disable-next-line no-inner-declarations
                function global_binding_wheel(){
                    $(bb['videoWrap']).off('wheel.hhh_lightoff mousewheel.hhh_lightoff');
                    $(bb['videoWrap']).on('wheel.hhh_lightoff mousewheel.hhh_lightoff',function(e){

                        //处理键盘及鼠标
                        e.keyCode = e.originalEvent.wheelDelta >= 0 ? '300' : '301';  //滚轮上滚和下滚

                        return hot_run(e);
                    })
                    //firefox
                    $(bb['videoWrap']).off('DOMMouseScroll.hhh_lightoff');
                    $(bb['videoWrap']).on('DOMMouseScroll.hhh_lightoff',function(e){

                        //处理键盘及鼠标
                        e.keyCode = e.detail < 0 ? '300' : '301'  //滚轮上滚和下滚
                        return hot_run(e)
                    })
                }

                global_binding_key();
                global_binding_wheel();
            }
        }

        //初始化自定义设置 节点 事件 tip
        //setting - wrap - box | wrap - move - item
        function init_setting(run_default_setting_flag){
            var $DSet = $(bb['dm']);
            var $wrap = $DSet.find('.bui-panel-wrap:first');
            var $move = $DSet.find('.bui-panel-move:first');
            var $item_0 = $DSet.find('.bui-panel-item:eq(0)');
            var $item_1 = $DSet.find('.bui-panel-item:eq(1)');
            var $item_2;
            var old_width = $item_0.width() + $item_1.width() + 5;
            var item_0_height = $item_0.height() + 36;
            //var item_2_width = 'auto';  // todo
            //var item_2_height = 100 + 18 * 22;

            //
            if($DSet.length!=1 || $wrap.length!=1 || $move.length!=1) log('init_setting失败');
            if($item_0.length!=1 || $item_1.length!=1) log('init_setting失败2');

            /*-----------------------------------
             * 初始化
             *----------------------------------*/
            //初始化【$item_0】高度
            $item_0.css('height', item_0_height);$wrap
            $item_0[0].hhh_new_height = item_0_height;

            //初始化【$move】宽度
            //$DSet.find('.bui-panel-move').css('width', old_width + item_2_width);
            //$move.css('width', '10000px');  //留出足够空间，省事 后面值会改变

            /*-----------------------------------
             * 复制所需节点
             *----------------------------------*/
            //复制【item_0】【高级设置】To【自定义设置】
            $(bb['dmLeftMore']).clone().appendTo(bb['dmLeft']).attr('id', 'hhh_custom')
                                                              .css('top', '20px')
                                                              .find(bb['dmLeftMoreText']).text('自定义设置');
            //复制【item_1】 To 【item_2】
            //clone Bug 修复，clone之后bui-radio-input checked属性会丢失，会跑到clone节点里，需要重新赋值
            let radio_input_array = []
            $item_1.find('.bui-radio-input').each((index, e)=>{ radio_input_array.push(e.checked) })
            $item_2 = $item_1.clone().appendTo($move).attr('id', 'hhh_item')
                                                    .css({'width':'auto', 'height':'auto'})
                                                    .removeClass('bui-panel-item-active')
                                                    .find('div *').remove().end();
            $item_1.find('.bui-radio-input').each((index, e)=>{ e.checked = radio_input_array[index] })
            //复制【分割线】模板
            var $separator = $item_1.find(`${bb['dmRightSeparator']}:first`).clone();

            //复制【$title $hotkey父节点】模板
            var $title_div = $item_0.find(bb['dmLeftBlock']).clone().attr('id', 'hhh_title_div')
                                                                    //.css({'display': 'flex', 'flex-direction': 'column'})
                                                                    .empty().css({'margin-top': 6, 'margin-bottom': 2, 'height': 32+0});

            //复制【title】模板
            var $title = $item_0.find(bb['dmLeftBlockTitle']).clone().css({'color': '#12b3e8'})
                                                                     .css({'display': 'inline-flex', 'line-height': '32px'})
                                                                     .text('bilibili关灯自定义设置');
            //复制【快捷键说明】模板
            var $hotkey = $item_1.find(bb['dmRightMore']).clone().attr('id', 'hhh_item_2_hotkey')
                                                                 .css({'display': 'inline-flex', 'float': 'right'})
                                                                 .find('span:first').remove().end()
                                                                 .find(bb['dmRightMoreText']).text('快捷键说明（点击切换）').end();
            //
            var $div = $('<div></div>');
            var $middle_div = $div.clone().attr('id','hhh_middle_div').css({'display':'flex', 'justify-content':'space-between'})
                                                                      //.css({'widht':'400px'})
                                                                      //.css('background', 'blue')
                                                                      ;
            //复制【封面】模板
            var $cover = $item_1.find(bb['dmRightMore']).clone().attr('id', 'hhh_item_2_cover')
                                                                 //.css({'display': 'inline-flex', 'float': 'right', 'flex-direction': 'row-reverse'})
                                                                 //.css({'float': 'right'})
                                                                 .find('span:first').remove().end()
                                                                 .find(bb['dmRightMoreText']).text('显示封面（点击切换）').end();
            //复制【input-checkbox父节点】模板
            var $input_div = $item_0.find(bb['dmLeftBlock']).clone().attr('id', 'hhh_input_div')
                                                                    .empty().css({'margin-top': 4, 'margin-bottom': 2})
                                                                    .css('padding-right', '10px')
                                                                    //.css('background', 'red')
                                                                    //.css('width', 'auto')
                                                                    ;
            //复制【更多其他】模板
            var $group_div = $item_0.find(bb['dmLeftBlock']).clone().attr('id', 'hhh_group_div')
                                                                    .empty().css({'margin-top': 4, 'margin-bottom': 2})
                                                                    //.css('background', 'yellow')
                                                                    .css('width', 125)
                                                                    //.css('height', 100)
                                                                    ;
            //复制【input-checkbox】模板
            var $input = $item_0.find(bb['dmLeftFs']).clone().find('input').removeAttr('aria-label').prop('checked', false).end()
                                                                    .find('.bui-checkbox-name').text('bilibili关灯').end()
                                                                    .appendTo($div.clone()).parent().css({display: 'flex', 'margin-top': '6px'})
                                                                    ;
            //复制【恢复默认设置】模板
            var $reset = $item_1.find(bb['dmRightReset']).clone().css({'margin-top': 6, 'margin-bottom': 6, width: 'auto'})
                                                                 .find('div').text('恢复默认设置（如有配置错误请尝试点击）').end()
                                                                 ;

            //复制【导出设置】模板
            var $export_setting = $item_1.find(bb['dmRightReset']).clone().css({'margin-top': 6, 'margin-bottom': 6, 'margin-left': 30, width: 'auto'})
                                                                  .find('div').text('导出设置').end()
                                                                  ;

            //复制【导入设置】模板
            var $import_setting = $item_1.find(bb['dmRightReset']).clone().css({'margin-top': 6, 'margin-bottom': 6, 'margin-left': 8, width: 'auto'})
                                                                  .find('div').text('')
                                                                  .append('<label for="import_setting">导入设置</label>')
                                                                  .append('<input type="file" id="import_setting" accept=".json" style="display: none;">').end()
                                                                  ;

            //复制【返回】模板
            var $reback = $item_1.find(bb['dmRightMore']).clone().attr('id', 'hhh_item_2_more')
                                                                 .css({'margin-top': 2, 'margin-bottom': 5, 'margin-right': 10})
                                                                 .find(bb['dmRightMoreText'])
                                                                 .text('返回').end();
            /*-----------------------------------
             * 添加节点
             *----------------------------------*/
            let $item_2_div = $item_2.children(':first');
            /*-----------------------------------
             * 上部div
             *----------------------------------*/
            //添加title hotkey
            $title_div.appendTo($item_2_div);
            $title.clone().appendTo($title_div);
            $hotkey.clone().appendTo($($title_div));
            //添加分割线
            $separator.clone().appendTo($item_2_div);
            /*-----------------------------------
             * 中部div
             *----------------------------------*/
            $middle_div.appendTo($item_2_div);
            $input_div.appendTo($middle_div);
            $group_div.appendTo($middle_div);
            //添加封面
            $cover.appendTo($group_div);

            //test
            // $input_div.css('border','1px red solid');   //红色 input
            // $group_div.css('border','1px gold solid');  //黄色 group
            // $middle_div.css('border','1px green solid');  //绿色
            // $item_2_div.css('border','1px cyan solid');     //青色

            //$input_div.css('width','500px');
            //$group_div.css('width','300px');
            //$middle_div.css('width','atuo');   ////
            //$item_2_div.css('width','700px');
            
            //log($input_div.width()+' '+$group_div.width()+' '+$middle_div.width()+' '+$item_2_div.width());

            // $('.bpx-player-dm-setting').mouseenter()
            // $('#hhh_custom').click()

            // $('#keyBinding').click()
            // $('#hhh_item>div:first').css({'height':'max-content','width':'max-content'})
            // $('.bui-panel-wrap').css({'height': $('#hhh_item').css('height'), 'width': $('#hhh_item').css('width')});
            // $move.css('transform', `translateX(-${old_width}px)`);

            // $('#commonCheckbox').click()
            // $('.bui-panel-wrap').width(350)
            // $('.bui-panel-wrap').height(700)

            //设置复选框
            let input_max_width = 0;
            let input_number_max_width = 0;
            let max_checkbox_width = 0;
            let all_checkbox_width = 'auto';

            //fn run
            function checkbox_fn_run(key, status, fn, args){
                //执行fn等
                if(key === 'volumeControlWhenNonFullScreen'){
                    //let pause_status = config.getCheckboxSettingStatus('volumeControlWhenPause');
                    //eval(`${fn}(${status}, ${args.screen_left}, ${args.screen_rght}, ${args.delta}, ${pause_status})`);
                } else if(key === 'volumeControlWhenPause'){
                    //let non_full_status = config.getCheckboxSettingStatus('volumeControlWhenNonFullScreen');
                    //let fn = config.getCheckboxSettingFn('volumeControlWhenNonFullScreen');
                    //let args = config.getCheckboxSettingArgs('volumeControlWhenNonFullScreen');
                    //eval(`${fn}(${non_full_status}, ${args.screen_left}, ${args.screen_rght}, ${args.delta}, ${status})`);
                } else if(key === 'danmuOpacityControl'){
                    //eval(`${fn}(${status}, ${args.delta})`)
                } else if(key === 'hotKeyHint'){
                    is_show_hint = config.getCheckboxSettingStatus(key)
                } else if(key === 'expandList'){
                    eval(`${fn}(${status}, ${args.columns})`)
                } else if(key === 'expandTitle'){
                    let fn_name = fn.split('.')[1] || fn.split('.')[0]  //执行闭包内导出的函数
                    let fn2 = g_fn_arr[fn_name]
                    // log(g_fn_arr, fn, fn_name, fn2)
                    if(typeof fn2 === 'function') fn2(status, args.width)
                } else if(key === 'customPlayRate'){
                    eval(`${fn}(${status}, ${args.rate})`)
                } else if(key === 'lightOnWhenLike'){
                    eval(`${fn}(${status}, ${args.screen_top})`)
                } else if(key === 'memoryProgress'){  //暂只支持刷新后生效
                    // let fn_name = fn.split('.')[1] || fn.split('.')[0]  //执行闭包内导出的函数
                    // let fn2 = g_fn_arr[fn_name]
                    // fn2(status, [ config.getCheckboxSettingStatus('sortList') ])
                    // eval(`${fn}(${status}, [ ${config.getCheckboxSettingStatus('sortList')} ])`)
                } else if(key === 'autoLike'){
                    eval(`${fn}(${status}, [ ${config.getCheckboxSettingStatus('likeFollowed')}, ${args.second} ])`)
                } else if(key === 'opacityPlayerSendingArea'){
                    eval(`${fn}(${status}, [ ${args.opacity} ])`)
                } else if(key === 'toolbarCloneToDmRoot' || key === 'isRemoveVideoInfo'){
                    eval(`${config.getCheckboxSettingFn('toolbarCloneToDmRoot')}(${config.getCheckboxSettingStatus('toolbarCloneToDmRoot')}, [ ${config.getCheckboxSettingStatus('isRemoveVideoInfo')} ])`)
                } else if(key === 'normalVideoPlayCount'){
                    eval(`${fn}(${status}, ${args.second})`)
                } else if(!!fn){ // openHotKey | removeVideoTopMask 等
                    eval(`${fn}(${status})`)
                    //new Function(`${fn}(${status})`)();  //与eval相比作用域不同
                }
            }
                        
            //更新选择框设置（二级，input/select），disabled化、灰化
            function checkbox_sub_input_update(key, status){
                let $key = $(`#${key}`)
                let $setting_input = $key.find('.hhh-bpx-player-dm-setting_container input')
                $setting_input.prop('disabled', !status)
                
                let $setting_ipuit_select = $key.find('[hhh_input_select]')
                let $setting_ipuit_select_border = $setting_ipuit_select.find('.bui-select-border')
                let $setting_ipuit_select_arrow_down = $setting_ipuit_select_border.find('.bui-select-arrow-down')
                if(status === ON){
                    $setting_input.css({'pointer-events': ''})
                    $setting_input.css({color: '#cccccc', border: '1px solid #00a1d699'})

                    $setting_ipuit_select.css({'pointer-events': ''})
                    $setting_ipuit_select_border.css({color: '#cccccc', border: '1px solid #00a1d699'})
                    $setting_ipuit_select_arrow_down.css({'border-top-color': ''})
                }else{
                    $setting_input.css({'pointer-events': 'none'})
                    $setting_input.css({color: '#cccccc66', border: '1px solid #ffffff33'})

                    $setting_ipuit_select.css({'pointer-events': 'none'})
                    $setting_ipuit_select_border.css({color: '#cccccc66', border: '1px solid #ffffff33'})
                    $setting_ipuit_select_arrow_down.css({'border-top-color': 'rgba(204, 204, 204, 0.4)'})
                }
            }

            //初始化选择框设置（二级，input）
            function checkbox_sub_input_init(group){
                //define css
                append_style($middle_div, 'hhh_style_dm_setting_number',
                    `
                        .hhh-bpx-player-dm-setting_container {
                            display: flex;
                        }
                        .hhh-bpx-player-dm-setting-number {
                            width: 25px;
                            border: 1px solid #00a1d699;
                            border-radius: 5px;
                            /* appearance: none; */
                            color: #cccccc;
                            background-color: initial;
                            margin-left: 5px;
                            text-align: center;
                        }
                    `
                )
                
                //create DOM
                for (let [key, {text, status, args}] of Object.entries(config.sets[group].options)) {
                    if(!args) continue

                    let name = 'checkbox_setting'
                    let $container = $(`<div class="hhh-bpx-player-dm-setting_container"></div>`)

                    if(key === 'customPlayRate'){  //自定义倍速
                        $container.append(`<input name="${name}" checkbox_id="${key}" class="hhh-bpx-player-dm-setting-number" type="tel" min="0" value="${args.rate}" placeholder="${args.rate}" step="0.5">`)
                    }else if(key === 'expandList'){  //订阅合集列表自动展开
                        $container.append(`<input name="${name}" checkbox_id="${key}" class="hhh-bpx-player-dm-setting-number" type="tel" min="5" value="${args.columns}" placeholder="${args.columns}" step="5">`)
                    }else if(key === 'expandTitle'){  //订阅合集标题自动展开
                        $container.append(`<input name="${name}" checkbox_id="${key}" class="hhh-bpx-player-dm-setting-number" type="tel" min="-1" max="999" value="${args.width}" placeholder="${args.width}" step="50">`)
                    }else if(key === 'danmuOpacityControl'){  //弹幕透明度控制
                        $container.append(`<input name="${name}" checkbox_id="${key}" class="hhh-bpx-player-dm-setting-number" type="tel" min="0" max="100" value="${args.delta}" placeholder="${args.delta}" step="5">`)
                    }else if(key === 'volumeControlWhenNonFullScreen'){  //鼠标在指定屏幕范围内音量调节
                        $container.append(`<input name="${name}" checkbox_id="${key}" arg="Left"  class="hhh-bpx-player-dm-setting-number" type="tel" min="0" max="1" value="${args.screen_left}" placeholder="${args.screen_left}" step="0.1">
                                           <input name="${name}" checkbox_id="${key}" arg="Right" class="hhh-bpx-player-dm-setting-number" type="tel" min="0" max="1" value="${args.screen_rght}" placeholder="${args.screen_rght}" step="0.1">
                                        `)
                    }else if(key === 'lightOnWhenLike'){  //下滚时自动开灯，上滚关灯
                        $container.append(`<input name="${name}" checkbox_id="${key}" class="hhh-bpx-player-dm-setting-number" type="tel" min="0" max="1" value="${args.screen_top}" placeholder="${args.screen_top}" step="0.1">`)
                    }else if(key === 'autoLike'){  //自动点赞
                        $container.append(`<input name="${name}" checkbox_id="${key}" class="hhh-bpx-player-dm-setting-number" type="tel" min="0" max="300" value="${args.second}" placeholder="${args.second}" step="5">`)
                    }else if(key === 'opacityPlayerSendingArea'){  //弹幕发送栏透明度
                        $container.append(`<input name="${name}" checkbox_id="${key}" class="hhh-bpx-player-dm-setting-number" type="tel" step="${args.opt.step}" min="${args.opt.min}" max="${args.opt.max}"
                                                                                                                                          value="${args.opacity}" placeholder="${args.opacity}">`)
                    }else if(key === 'videoSpeedDefault'){  //指定视频默认播放速度
                        $container.append(`<input name="${name}" checkbox_id="${key}" class="hhh-bpx-player-dm-setting-number" type="tel" step="${args.opt.step}" min="${args.opt.min}" max="${args.opt.max}"
                                                                                                                                          value="${args.speed}" placeholder="${args.speed}">`)
                    }else if(key === 'normalVideoPlayCount'){  //记录视频播放次数，设定X秒后开始记录
                        $container.append(`<input name="${name}" checkbox_id="${key}" class="hhh-bpx-player-dm-setting-number" type="tel" step="${args.opt.step}" min="${args.opt.min}"
                                                                                                                                          value="${args.second}" placeholder="${args.second}">`)
                    }else if(key === 'independentListPlayControl'){  //选集/合集等独立连播控制，自定义连播间隔
                        $container.append(`<input name="${name}" checkbox_id="${key}" class="hhh-bpx-player-dm-setting-number" type="tel" min="0" value="${args.second}" placeholder="${args.second}" step="1">`)
                    }

                    if($container.find(`input[name=${name}]`).length > 0){
                        $(`#${key}`).append($container)
                        checkbox_sub_input_update(key, status)
                        
                        if(bb_type.indexOf(BILI_3_X_VIDEO) !== -1) tip_create_3_X({ target: $container, tip_target: $('#hhh_tip'), color: '#00ffff', title: args.opt.tip[0], gap: 1 })

                        // input_number_max_width = Math.max(input_number_max_width, $(`#${key}`).find('.hhh-bpx-player-dm-setting_container').outerWidth())  //记录最大宽度
                        let $input_number_container = $(`#${key}`).find('.hhh-bpx-player-dm-setting_container')
                        $input_number_container.attr('hhh_width', $input_number_container.outerWidth())

                        // log(input_number_max_width)
                    }
                }

                //选择框设置（二级，input）
                function checkbox_sub_input_event(){
                    //---change---
                    $item_2.find('#hhh_input_div').off('change.hhh_checkbox_args');
                    $item_2.find('#hhh_input_div').on('change.hhh_checkbox_args', function(e){
                        let target = e.target;
                        if(target.name === 'checkbox_setting'){  //选择框设置（二级）
                            let key = $(target).attr('checkbox_id');
                            let arg = $(target).attr('arg');
                            let args = config.getCheckboxSettingArgs(key);
                            let new_args = {};
    
                            if(key === 'customPlayRate'){  //自定义倍速
                                new_args = {rate: target.value}
                            }else if(key === 'expandList'){  //订阅合集列表自动展开
                                new_args = {columns: target.value}
                            }else if(key === 'expandTitle'){  //订阅合集标题自动展开
                                new_args = {width: target.value}
                            }else if(key === 'danmuOpacityControl'){  //弹幕透明度控制
                                new_args = {delta: target.value}
                            }else if(key === 'volumeControlWhenNonFullScreen' && arg === 'Left'){  //指定鼠标范围 Left
                                new_args = {screen_left: target.value}
                            }else if(key === 'volumeControlWhenNonFullScreen' && arg === 'Right'){  //指定鼠标范围 Right
                                new_args = {screen_rght: target.value}
                            }else if(key === 'lightOnWhenLike'){  //下滚时自动开灯，上滚关灯
                                new_args = {screen_top: target.value}
                            }else if(key === 'autoLike'){  //XX秒后自动点赞
                                new_args = {second: target.value}
                            }else if(key === 'opacityPlayerSendingArea'){  //弹幕发送区域透明度
                                new_args = {opacity: target.value}
                            }else if(key === 'videoSpeedDefault'){  //指定视频默认播放速度
                                new_args = {speed: target.value}
                            }else if(key === 'normalVideoPlayCount'){  //X秒后开始记录播放次数
                                new_args = {second: target.value}
                            }else if(key === 'independentListPlayControl'){  //自定义连播间隔
                                new_args = {second: target.value}
                            }
    
                            config.setCheckboxSettingArgs(key, {...args, ...new_args});
    
                            /////////
                            //log($(target))
                            //log(target.name+' - '+target.attributes.checkbox_id.value+' = '+$(target).attr('checkbox_id'));
                            /////////
                            
                            config.storageCheckboxSetting();
                            let fn = config.getCheckboxSettingFn(key);
                            let status = config.getCheckboxSettingStatus(key);
                            args = config.getCheckboxSettingArgs(key);
                            checkbox_fn_run(key, status, fn, args);
                        }
                    });
    
                    //---focus---
                    $('input[name=checkbox_setting]').off('focus.hhh_checkbox_args');
                    $('input[name=checkbox_setting]').on ('focus.hhh_checkbox_args', function(){
                        $(this).css({width: "40px"}).prop('type', 'number');
                    })
                    //---blur---
                    $('input[name=checkbox_setting]').off('blur.hhh_checkbox_args');
                    $('input[name=checkbox_setting]').on ('blur.hhh_checkbox_args', function(){
                        $(this).css({width: "25px"}).prop('type', 'tel');
                    })
    
                    //---mouseenter、mouseleave---
                    $('input[name=checkbox_setting]').off('mouseenter.hhh_checkbox_args');
                    $('input[name=checkbox_setting]').off('mouseleave.hhh_checkbox_args');
                    $('input[name=checkbox_setting]').on ('mouseenter.hhh_checkbox_args', function(){
                        let $this = $(this);
    
                        $this.css({width: "40px"}).prop('type', 'number');
                        let rect = this.getBoundingClientRect();
                        document.onmousemove = function(e){
                            let x = e.clientX;
                            let y = e.clientY;
                            if(x < rect.left || x > rect.right || y < rect.top || y > rect.bottom ){
                                $this.mouseleave();
                            }
                        }
                    }).on('mouseleave.hhh_checkbox_args', function(){
                        let $this = $(this);
                        
                        document.onmousemove = null;
                        if(this !== document.activeElement) $this.css({width: "25px"}).prop('type', 'tel');
                    })
    
                    //---keydown---
                    $('body').off('keydown.hhh_checkbox_args')
                    $('body').on ('keydown.hhh_checkbox_args', function(e){
                        // if(config.group === 'commonCheckbox' || config.group === 'otherCheckbox')  //选择执行 key event
                        if(config.group.includes('Checkbox'))  //阻止快捷键
                            e.stopPropagation()
                    })
                }

                //add event
                checkbox_sub_input_event()
            }
            
            //初始化选择框设置（二级，select等）
            function checkbox_sub_select_init(group){
                //define css
                let container_str = '#hhh_middle_div'
                append_style($middle_div, 'hhh_style_select',
                    `
                        ${container_str} .bpx-player-dm-setting-right-font-content {
                            margin-left: 5px;
                            margin-bottom: 0px;
                        }
                        ${container_str}  .bpx-player-dm-setting-right-font-content-fontfamily {
                            width: auto;
                        }
                        ${container_str}  .bui-select-wrap {
                            height: 16px;
                        }
                        ${container_str}  .bui-select-border {
                            border: 1px solid rgba(0, 161, 214, 0.6);
                            border-radius: 5px;
                        }
                        ${container_str}  .bui-select-header {
                            height: 16px;
                            line-height: 16px;
                            font-size: 11px;
                            border-top-left-radius: 5px;
                            border-top-right-radius: 5px;
                        }
                        ${container_str}  .bui-select-list-wrap {
                            border-bottom-left-radius: 5px;
                            border-bottom-right-radius: 5px;
                        }
                        ${container_str}  .bui-select-list {
                            font-size: 11px;
                            padding-top: 2px;
                        }
                    `
                )

                // $('#hhh_middle_div .bpx-player-dm-setting-right-font-content').remove()
                //设置选择框
                function set_$container($container, name, key, args2){
                    $container.attr({name: name, checkbox_id: key})
                    let {type, select: {items, data_value, value}} = args2
                    items.forEach((v,i)=>{
                        $container.find('.bui-select-list').append(`<li class="bui-select-item" data-value="${data_value[i]}">${v}</li>`)
                    })
                    $container.find('.bui-select-list li').removeClass('bui-select-item-active')
                    $container.find(`.bui-select-list li[data-value="${value}"]`).addClass('bui-select-item-active')
                    $container.find('.bui-select-result').text($container.find('.bui-select-item-active').text())
                }

                //create DOM
                let $container_base = $('.bpx-player-dm-setting-right-font-content:first').clone().attr('hhh_input_select', '').find('.bui-select-list .bui-select-item').remove().end()
                for (let [key, {status, args2}] of Object.entries(config.sets[group].options)) {
                    if(args2?.select === undefined) continue

                    let name = 'checkbox_setting'
                    let $container = $container_base.clone()

                    if(key === 'autoQualityVideo'){  //自动切换画质
                        set_$container($container, name, key, args2)
                    }

                    $(`#${key}`).append('<span hhh_input_select_wrap></span>')
                    $(`#${key}>[hhh_input_select_wrap]`).append($container)
                    checkbox_sub_input_update(key, status)
                    
                    if(bb_type.indexOf(BILI_3_X_VIDEO) !== -1) tip_create_3_X({ target: $(`#${key}>[hhh_input_select_wrap]`), tip_target: $('#hhh_tip'), color: '#00ffff', title: args2.select.tip[0], gap: 1 })

                    // input_number_max_width = Math.max(input_number_max_width, $(`#${key}`).find('.hhh-bpx-player-dm-setting_container').outerWidth())  //记录最大宽度
                    let $select_container = $(`#${key}`).find('[hhh_input_select_wrap]')
                    $select_container.attr('hhh_width', $select_container.outerWidth())
                }
                
                let $select_container = $('#hhh_middle_div [hhh_input_select]')
                let wrap_max_height = 0
                let list_height = 0
                let scrollbar_height = 0
                let indicator_height = 0
                let is_dragging = false
                let startY = 0

                $select_container.off('mouseenter.hhh_input_select').on('mouseenter.hhh_input_select',function(e){
                    $(this).find('.bui-select-wrap').addClass('bui-select-unfold')
                    wrap_max_height = parseInt($(this).find('.bui-select-list-wrap').css('max-height'))
                    list_height = $(this).find('.bui-select-list').height()
                    indicator_height = parseInt(wrap_max_height / list_height * wrap_max_height)
                    scrollbar_height = $(this).find('.bscroll-vertical-scrollbar').height()

                    // log(wrap_max_height, list_height, indicator_height, scrollbar_height)

                    if(list_height <= wrap_max_height){
                        $select_container.find('.bscroll-vertical-scrollbar').hide()
                    }else{
                        $(this).find('.bscroll-indicator').height(indicator_height)
                        $select_container.find('.bscroll-vertical-scrollbar').show()
                    }
                })
                $select_container.off('mouseleave.hhh_input_select').on('mouseleave.hhh_input_select',function(e){
                    $(this).find('.bui-select-wrap').removeClass('bui-select-unfold')
                })
                
                function me(e){ console.log(e) }  //TEST
                
                $select_container.off('pointerdown.hhh_input_select').on('pointerdown.hhh_input_select',function(e){
                    if($(e.target)[0].className.indexOf('bscroll-indicator') === -1) return
                    this.setPointerCapture(e.originalEvent.pointerId)
                    startY = e.screenY
                })
                $select_container.off('pointerup.hhh_input_select').on('pointerup.hhh_input_select',function(e){
                    this.releasePointerCapture(e.originalEvent.pointerId)
                })
                $select_container.off('pointermove.hhh_input_select').on('pointermove.hhh_input_select',function(e){
                    if (this.hasPointerCapture(e.originalEvent.pointerId) && e.buttons === 1) {
                        // console.log("Pointermove: 正在拖动...")
                        // me(e)
                        let $this = $(this)
                        let diffY = e.screenY - startY
                        startY = e.screenY

                        let curr_y = parseFloat($this.find('.bscroll-indicator')[0].style.transform.match(/-?[\d.]+/) || 0)
                        let next_y = curr_y + diffY
                        let limit_y = next_y < 0 ? 0 : next_y + indicator_height >= scrollbar_height ? scrollbar_height - indicator_height : next_y
                        // log(curr_y, next_y, limit_y)
                        $this.find('.bscroll-indicator')[0].style.transform = `translateY(${limit_y}px)`
                        
                        diffY = diffY / wrap_max_height * list_height
                        curr_y = parseFloat($this.find('.bui-select-list')[0].style.transform.match(/translate\(0px,\s*(-?[\d.]+?)px\)/)?.[1] || 0)
                        next_y = curr_y - diffY
                        limit_y = next_y >= 0 ? 0 : next_y < wrap_max_height - list_height ? wrap_max_height - list_height : next_y
                        // log(curr_y, next_y, limit_y)
                        $this.find('.bui-select-list')[0].style.transform = `translate(0px, ${limit_y}px) scale(1) translateZ(0px)`

                        return false
                    }
                })

                $select_container.off('click.hhh_input_select').on('click.hhh_input_select',function(e){
                    // log(config.getCheckboxSettingArgs2($(this).attr('checkbox_id'), 'select', 'value'),$(this).attr('checkbox_id'), $(this), $(e.target).text(), $(e.target))
                    // log($(this), $(e.target))
                    if($(e.target)[0].className.indexOf('bui-select-item') === -1) return

                    $(this).find('.bui-select-wrap').removeClass('bui-select-unfold')
                    $(this).find('.bui-select-result').text($(e.target).text())
                    config.setCheckboxSettingArgs2($(this).attr('checkbox_id'), 'select', 'value', $(e.target).attr('data-value'))
                    config.storageCheckboxSetting()
                    // log(config.getCheckboxSettingArgs2($(this).attr('checkbox_id'), 'select', 'value'))
                })
                
                $select_container.find('.bui-select-list-wrap').off('wheel.hhh_input_select').on('wheel.hhh_input_select',function(e){
                    // console.log('wheel', e.deltaY, e.originalEvent.wheelDelta)
                    let $this = $(this)
                    let item_height = $this.find('.bui-select-item:first').height()
                    let step = 1
                    let step_height = item_height * step / list_height * wrap_max_height  //滚动step行距离
                    
                    let deltaY = e.originalEvent.wheelDelta >= 0 ? -step_height : step_height;  //滚轮上滚和下滚
                    let curr_y = parseFloat($this.find('.bscroll-indicator')[0].style.transform.match(/-?[\d.]+/) || 0)
                    let next_y = curr_y + deltaY
                    let limit_y = next_y < 0 ? 0 : next_y + indicator_height >= scrollbar_height ? scrollbar_height - indicator_height : next_y
                    // log(curr_y, next_y, limit_y)
                    $this.find('.bscroll-indicator')[0].style.transform = `translateY(${limit_y}px)`

                    //translate(0px, -60px) scale(1) translateZ(0px)
                    step_height = item_height * step  //滚动step行距离
                    deltaY = e.originalEvent.wheelDelta >= 0 ? step_height : -step_height;  //滚轮上滚和下滚
                    curr_y = parseFloat($this.find('.bui-select-list')[0].style.transform.match(/translate\(0px,\s*(-?[\d.]+?)px\)/)[1] || 0)
                    next_y = curr_y + deltaY
                    limit_y = next_y >= 0 ? 0 : next_y < wrap_max_height - list_height ? wrap_max_height - list_height : next_y
                    // log(curr_y, next_y, limit_y)
                    $this.find('.bui-select-list')[0].style.transform = `translate(0px, ${limit_y}px) scale(1) translateZ(0px)`

                    return false
                })
            }

            //设置【checkbox】点击 click
            function checkbox_event(){
                $item_2.find('#hhh_input_div').off('click.hhh_checkbox');
                $item_2.find('#hhh_input_div').on('click.hhh_checkbox', function(e){
                    let target = e.target;
                    if(target.type === 'checkbox'){  //一级选择框设置
                        [prev_video_type, prev_video_type_unique_id] = [undefined, undefined];

                        let key = bb_type.indexOf(BILI_2_X) !== -1 ? target.parentNode.id : target.parentNode.parentNode.parentNode.id;
                        let status = target.checked;
                        //log('checked: '+e.target.checked)
                        config.setCheckboxSettingStatus(key, status);
                        config.storageCheckboxSetting();

                        let fn = config.getCheckboxSettingFn(key);
                        let args = config.getCheckboxSettingArgs(key);

                        //设定参数设置
                        checkbox_sub_input_update(key, status);

                        checkbox_fn_run(key, status, fn, args);
                    }
                })
            }

            //生成checkbox
            function checkbox_init(group){
                let len = 0
                //按行添加
                for (let [key, {text, level, status, tip, disable, show}] of Object.entries(config.sets[group].options)) {
                    if(show === OFF) continue

                    //log(text+' - '+tip)
                    ++len
                    let $key = $input.clone().appendTo($input_div).attr('id', key).css('width', 'auto')
                                                                  .find('input').prop('checked', status).end()
                                                                  .find('.bui-checkbox-name').text(text).end()
                    
                    // input_max_width = Math.max(input_max_width, $key.find('label').outerWidth())  //记录最大宽度
                    $key.attr('hhh_width', $key.find('label').outerWidth() + 15)
                    // log(input_max_width)

                    //按级别缩进
                    if(!!level) {
                        //console.log('__level__',level)
                        $key.css({'margin-left': `${level*18}px`})
                        //$key.addClass('bpx-player-dm-setting-right-separator')
                        //$key.empty().css({'margin-top': '13px', 'border-top': '1px solid rgba(229,233,239,.1)' ,'height': '8px'})
                        //$key.css({'margin-bottom': '0px'})
                    }
                    
                    //set tips
                    if(bb_type.indexOf(BILI_2_X) !== -1){
                        !!tip && add_tip($tip, $key.find('.bpx-player-dm-setting-left-flag-title'), {'text':tip, 'millisec':200, 'top':9, 'left':0})
                    }else{
                        !!tip && tip_create_3_X({ target: $key.find(bb['dmLeftFs']), tip_target: $('#hhh_tip'), color: '#00ffff', title: tip, gap: 6 })
                    }

                    //禁用
                    if(disable === ON) {
                        $key.css({'pointer-events': 'none', 'opacity': 0.3})
                    }

                }

                //填充空行
                let one_input_height = +$input_div.children(':first').outerHeight() + (+$input_div.children(':first').css('margin-top').match(/\d+/)[0]);
                for(; len<=18; len++){
                    $div.clone().appendTo($input_div).css({height: `${one_input_height}px`});
                }

                //add event
                checkbox_event();
            }

            //初始化【group】和【checkbox】
            function init(){
                for(let [group, {options, btn, type}] of Object.entries(config.sets)){
                    let type_type = ['checkbox', 'key']  //可处理类型
                    if(type_type.includes(type) !== true) continue
                    
                    $cover.clone().appendTo($group_div).attr('id', group)  //复用封面DOM模板
                                                       .css({height: '22px' /*, border: '1px solid hsla(0,0%,100%,.2)'*/})
                                                       .find(bb['dmRightMoreText']).text(btn+'（点击）').end();

                    // $reset.clone().appendTo($group_div).attr('id', group)  //复用封面DOM模板
                    //                                    .css({height: '22px', display: 'flex'}).text(btn+'（点击）');

                    $(`#${group}`).click(function(){
                        config.group = group;
                        //
                        //if($('body')[0].hhh_body_key_event !== '快捷键设置') return;
                        //$('body')[0].hhh_body_key_event = group;
                        //取消激活
                        let $active = $group_div.find('.active');
                        let active_text = $active.find(bb['dmRightMoreText']).text();
                        $active.find(bb['dmRightMoreText']).text(active_text.split('***')[0]);
                        $active.removeClass('active');
                        //激活
                        let text = $(this).find(bb['dmRightMoreText']).text();
                        $(this).find(bb['dmRightMoreText']).text(text+'***');
                        $(this).addClass('active');

                        $input_div.empty();
                        if(type == 'checkbox') {
                            checkbox_init(group);

                            // $input_div.css('width', `${all_checkbox_width}`);
                            $wrap.css({'height': $item_2.css('height'), 'width': $item_2.css('width')});
                            $move.css('transform', `translateX(-${old_width}px)`);
                            $('#hhh_item_2_more').parent().css({'justify-content': 'space-between'});  //设置"返回"位置
                            
                            checkbox_sub_input_init(group)
                            checkbox_sub_select_init(group)
                            
                            function set_checkbox_width(group){
                                for (let [key] of Object.entries(config.sets[group].options)) {
                                    let $key = $(`#${key}`)
                                    let line_width = +($key.attr('hhh_width') ?? 0)
                                    $(`#${key}>*`).each((i,v)=>{ line_width += +($(v).attr('hhh_width') ?? 0) })
                                    max_checkbox_width = Math.max(max_checkbox_width, line_width)
                                    // console.log(key, max_checkbox_width, line_width)
                                }
                                $input_div.css('width', `${max_checkbox_width+5}px`)
                            }
                            set_checkbox_width(group)

                        }else if(type == 'key') {
                            set_keybindings($input_div);

                            $input_div.css('width', 'auto');
                            $('#hhh_item>div:first').css({'height':'max-content','width':'max-content'})
                            $wrap.css({'height': $item_2.css('height'), 'width': $item_2.css('width')});
                            $move.css('transform', `translateX(-${old_width}px)`);
                            $('#hhh_item_2_more').parent().css({'justify-content': 'flex-end'});  //设置"返回"位置
                        }
                    })
                }
            }

            init();

            //添加恢复默认设置
            $reset.appendTo($item_2_div)

            //加载并配置设置
            function load_sets(new_sets){
                config.updataCheckboxSetting(new_sets);
                config.storageCheckboxSetting();
                for(let [group, {options, type}] of Object.entries(config.checkboxes)){
                    if(type === 'checkbox'){
                        for (let [key, { status, fn, args }] of Object.entries(options)) {
                            //if(config.getCheckboxSettingStatus(key) === status) continue;
                            $(`#${key}`).find('input').prop('checked', status);
                            //设定参数设置
                            checkbox_sub_input_update(key, status);
                            checkbox_fn_run(key, status, fn, args);
                        }
                    }
                }
            }

            //重设置【item_2 - 恢复默认设置】 click
            $reset.click(function(){
                load_sets(config.checkboxes);
                // $(`#${config.groupFirst}`).click();  //返回第一页
            })

            //添加导出设置
            $export_setting.appendTo($item_2_div)

            //重设置【item_2 - 导出设置】 click
            $export_setting.click(function(){
                function exportJSON(data, fileName) {
                    // 将数据序列化为 JSON 字符串
                    const jsonString = JSON.stringify(data, null, 2);
                
                    // 创建一个 Blob 对象，指定类型为 application/json
                    const blob = new Blob([jsonString], { type: 'application/json' });
                
                    // 创建一个可下载的链接
                    const url = URL.createObjectURL(blob);
                
                    // 创建一个 a 标签用于下载
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = fileName || 'export.json'; // 设置下载文件名
                    a.click(); // 触发下载
                
                    // 释放对象 URL
                    URL.revokeObjectURL(url);
                }
                //导出
                let settings = { name: GM_info.script.name, version: GM_info.script.version, sets: JSON.parse(JSON.stringify(config.sets)) }
                exportJSON(settings, 'Bilibili-lights-off-and-quick-operation-settings.json')
            })

            //添加导入设置
            $import_setting.appendTo($item_2_div)

            //重设置【item_2 - 导入设置】 click
            $import_setting.change(function(event){

                function customMerge(target, ...sources) {
                    if (!sources.length) return target;
                  
                    const source = sources.shift();
                  
                    if (typeof target !== 'object' || target === null) {
                      throw new TypeError('Target must be an object');
                    }
                  
                    if (typeof source !== 'object' || source === null) {
                      throw new TypeError('Source must be an object');
                    }
                  
                    for (const key in source) {
                      if (source.hasOwnProperty(key)) {
                        const sourceProp = source[key];
                        const targetProp = target[key];
                  
                        if (Array.isArray(sourceProp)) {
                          // 如果源属性是数组
                          if (!Array.isArray(targetProp)) {
                            // 如果目标属性不是数组，直接覆盖
                            console.log(`[${target?.text}][${key}]: '${target[key]}' -> '${sourceProp}'`)
                            target[key] = sourceProp.slice(); // 使用 slice 创建新数组，避免直接引用
                          } else {
                            // 如果目标属性也是数组，去重合并数组
                            // target[key] = [...new Set([...sourceProp, ...targetProp])]; // 去重合并
                            target[key] = sourceProp.slice(); // 使用 slice 创建新数组，避免直接引用
                          }
                        } else if (typeof sourceProp === 'object' && sourceProp !== null) {
                          // 如果源属性是对象
                          if (typeof targetProp !== 'object' || targetProp === null) {
                            // 如果目标属性不是对象，初始化为新对象
                            console.log(`[${target?.text}][${key}]: '${target[key]}' -> '{}'`)
                            target[key] = {};
                          }
                          customMerge(target[key], sourceProp);
                        } else {
                          // 其他情况，直接赋值
                          // if(target[key] != sourceProp) {console.log(target, target?.text, `${key}: ${target[key]}->${sourceProp}`)}
                          if(target[key] != sourceProp) {console.log(`[${target?.text}][${key}]: '${target[key]}' -> '${sourceProp}'`)}
                          target[key] = sourceProp;
                        }
                      }
                    }
                  
                    return customMerge(target, ...sources)
                }

                const file = event.target.files[0]
                if (file) {
                    const reader = new FileReader()
                    reader.onload = function(e) {
                        const content = e.target.result
                        try {
                            const settings = JSON.parse(content)
                            console.info("%c 导入设置 %c v" + settings.version, "padding: 2px 6px; border-radius: 3px 0 0 3px; color: #fff; background: #00aeec; font-weight: bold;",
                                         "padding: 2px 6px; border-radius: 0 3px 3px 0; color: #fff; background: #00ceea; font-weight: bold;")
                            let custom_sets = JSON.parse(JSON.stringify(config.sets))
                            customMerge(custom_sets, settings.sets)
                            console.log('原设置　：', config.sets)
                            console.log('导入设置：', custom_sets)
                            load_sets(custom_sets);
                            // $(`#${config.groupFirst}`).click();  //返回第一页
                        } catch (error) {
                            console.error('解析 JSON 文件时出错：', error)
                        }
                    };
                    reader.readAsText(file)
                }
            })

            /*-----------------------------------
             * 下部div
             *----------------------------------*/
            //添加分割线
            $separator.clone().appendTo($item_2_div);
            //添加返回
            //$reback.clone().appendTo($item_2_div);

            //TEST
            let $bottom_div = $div.clone();
            $bottom_div.appendTo($item_2_div).css({display:'flex', 'justify-content':'space-between'});
            $reback.clone().appendTo($bottom_div);

            //总在最上
            let $always_top = $input.clone().appendTo($bottom_div).attr('id', 'hhh_always_top').css('width', 'auto')
                                                                  .css({'margin':'2px 0px 5px 20px'})
                                                                  .find('input').prop('checked', false).end()
                                                                  .find('.bui-checkbox-name').text('总在最上').end();
            let boserver
            $always_top.click(function(e){
                if(e.target.type === 'checkbox'){
                    let checkbox = e.target
                    if(e.target.checked === ON){
                        //鼠标离开时panel保持在最上
                        boserver?.disconnect()
                        boserver = new MutationObserver((mutations, observer) => {
                            mutations.forEach(mutation => {
                                const target = mutation.target
                                if(typeof target.className === 'string' && target.className !== ''){
                                    //console.log(target.className +' | '+mutation.attributeName)
                                    $(target).show()
                                }
                            })
                        })
                        boserver.observe($(bb['dmWrap'])[0], { attributes: true })

                        //鼠标是否在弹幕设置界面内
                        document.onmouseup = function(e){
                            let classes = $(':hover').map((i,e)=>e?.className)?.get()
                            let is_in_dm_setting_panel = classes.includes('bui-panel-wrap')
                            // log(is_in_dm_setting_panel, classes, e)
                            if(is_in_dm_setting_panel === false){
                                document.onmouseup = null
                                checkbox.checked = OFF
                                boserver?.disconnect()
                                $(bb['dm'])[0].dispatchEvent(new MouseEvent('mouseleave'))
                            }
                        }
                    }else{
                        document.onmouseup = null
                        boserver?.disconnect()
                    }
                }
            })

            /*-----------------------------------
             * 添加事件等
             *----------------------------------*/
            //重设置【自定义设置按钮】
            // $DSet.mouseenter(function(){
            //     $wrap.css('height', $DSet.find('.bui-panel-item-active').css('height'));
            // })

            //重设置【item_0 - 自定义设置】 click
            $('#hhh_custom').click(function(){
                $wrap.css({'height': $item_2.css('height'), 'width': $item_2.css('width')});
                $move.css('transform', `translateX(-${old_width}px)`);
                $DSet.find('.bui-panel-item-active').removeClass('bui-panel-item-active');
                $item_2.addClass('bui-panel-item-active');
                $(`#${Object.keys(config.sets)[0]}`).click();  //设置第一项
            })

            //重设置【item_1 - 更多弹幕设置】 click
            $item_1.find(bb['dmRightMore']).click(function(){
                $item_0.css('height', item_0_height);  //会改变item_0长度
                $wrap.css({'height': $item_0.css('height'), 'width': $item_0.css('width')});
            })

            //重设置【item_2 - 返回】 click
            $item_2.find('#hhh_item_2_more').click(function(){
                $wrap.css({'height': $item_0.css('height'), 'width': $item_0.css('width')});
                $move.css('transform', 'translateX(0px)');
                $DSet.find('.bui-panel-item-active').removeClass('bui-panel-item-active');
                $item_0.addClass('bui-panel-item-active');
            })

            //重设置【item_2 - 封面】 click
            $item_2.find('#hhh_item_2_cover').click(function(){
                if($('#hhh_img').length === 1){
                    let $hhh_img = $('#hhh_img');
                    //let width = $(bb['video']).width()*0.9;
                    //$('#hhh_img').css('width', width);
                    $hhh_img.css('display') === 'none'? $hhh_img.css('display', 'flex'): $hhh_img.css('display', 'none');
                } else {
                    let imgurl = $(bb['coverImg']).attr('content').replace('http:','https:').replace(/@.*/,'')
                    let $img = $(`<img style="cursor:pointer" src="${imgurl}" />`);
                    let $d = $div.clone().attr('id', 'hhh_img')
                                         .css({position: 'absolute', top:'50%', left:'50%', transform: 'translate(-50%,-50%)'})
                                         .css({'z-index':`${$(bb['playTipWrap']).css('z-index')}`})
                                         .css({'display':'flex'})
                                         //.css('width',width)
                                         .css({'align-items':'center','justify-content':'center'})
                                         .appendTo($(bb['videoWrap']));
                    $img.css({width:'100%', height:'auto'}).appendTo($d);
                    //重设置【item_2 - 封面 - IMG】
                    $('#hhh_img').click(function(){
                        $(this).css('display','none');
                        window.open(imgurl);
                    })
                }
            })

            //重设置【item_2 - 快捷键说明】 click
            let set_hotkey_panel_close = false;
            $item_2.find('#hhh_item_2_hotkey').click(function(){
                let is_active = bb_type.indexOf(BILI_2_X) !== -1 ? $(bb['hotkeyPanel']).hasClass('active') : $(bb['hotkeyPanel']).css('display') !== 'none';
                //2.X和3.X不一样？我来让你一样！
                if(is_active === false){
                    
                    //模拟右键菜单消息，激活菜单
                    let evt = new MouseEvent('contextmenu', { clientX:-9999, clientY:-9999 });
                    $(bb['videoWrap'])[0].dispatchEvent(evt);
                    evt = bb_type.indexOf(BILI_2_X) !== -1? new MouseEvent('click', { bubbles:true }): new MouseEvent('mousedown', { bubbles:true });
                    let node = bb_type.indexOf(BILI_2_X) !== -1? 'a': 'li';
                    $(bb['playerContextMenu']).find(`${node}:contains("快捷键说明")`)[0].dispatchEvent(evt);

                    //过滤快捷键说明（bilibili关灯）
                    let $last_system_itme = $('#hhh_last_system_hotkey_panel_item');
                    $last_system_itme.prevAll().css('display','none');
                    $last_system_itme.css('display','none');
                    $last_system_itme.nextAll().css('display','block');
                    $('.bpx-player-hotkey-panel').width(440)
                    let wheelEvent = new WheelEvent('mousewheel', { deltaY: -10000, deltaMode: 0 });  //打开时回到最上
                    $('.bpx-player-hotkey-panel-area')[0].dispatchEvent(wheelEvent);

                    let $hotkey = $(bb['hotkeyPanel']);
                    //let $hotkey = $(bb['hotkeyPanel']).css('z-index', $(bb['playVideoControlWrap']).css('z-index')-1);

                    //同步显示
                    // let wrap_left = $(bb['dmWrap']).position().left;
                    // let box_left = $(bb['dmBox']).position().left;
                    // $(bb['dmWrap']).css('left', wrap_left + $item_0.width());
                    // $(bb['dmBox']).css('left', box_left - $item_0.width());
                    // $(bb['dmWrap']).css('height', $hotkey.innerHeight());
                    // $(bb['dmWrap']).css('width', $hotkey.innerWidth()-50);
                    // $(bb['dmBox']).css('width', item_2_width);
                    //$(bb['dmWrap']).css('background', 'blue').css('opacity', 0.8);  //test

                    //同步隐藏
                    // waitForTrue(()=> ($(bb['hotkeyPanel']).hasClass('active') === false && $(bb['hotkeyPanel']).css('display') === 'none') || $(bb['dmWrap']).css('display') === 'none', () => {
                    //     //$(bb['hotkeyPanel']).removeClass('active').css('display', 'none');
                    //     $(bb['hotkeyPanelClose']).click();
                    // });

                    let new_left = $item_2.offset().left + $item_2.width();
                    let new_top = $hotkey.offset().top + ($item_2.offset().top + $item_2.height()) - ($hotkey.offset().top + $hotkey.innerHeight());
                    $hotkey.offset({left:new_left, top:new_top});
                    //$hotkey.offset({left:new_left, top:new_top}).find(bb['hotkeyPanelClose']).css('display', 'none');

                    if(set_hotkey_panel_close === false){  //
                        set_hotkey_panel_close = true;
                        $(bb['hotkeyPanelClose']).click(function(){
                            $(bb['hotkeyPanel']).css({left: '50%', top:'50%'});
                        })
                    }
                }else{
                    $(bb['hotkeyPanel']).css({left: '50%', top:'50%'});
                    $(bb['hotkeyPanelClose']).click();
                    // $(bb['dmWrap'])[0].style.cssText = '';
                    // $(bb['dmBox'])[0].style.cssText = '';
                    // $(bb['dmWrap']).css('display', 'block');
                }
            })

            let id = 0;
            //重设置弹幕设置触发按钮
            $DSet.on('mouseenter', function(){
                clearInterval(id);

                if ($(bb['dmWrap']).css('display') !== 'none') return;
                $item_0.css('height', $item_0[0].hhh_new_height);
                $wrap.css({'height': $item_0.css('height'), 'width': $item_0.css('width')});
                $move.css('transform', 'translateX(0px)');
                $move.css('width', '10000px');  //留出足够空间，省事
                $DSet.find('.bui-panel-item-active').removeClass('bui-panel-item-active');
                $item_0.addClass('bui-panel-item-active');
                $(bb['dmWrap'])[0].style.cssText = '';
                $(bb['dmBox'])[0].style.cssText = '';

                let dm_right = $('.bpx-player-dm-setting')[0].getBoundingClientRect().right
                let dm_max_width = 724  //默认最大宽度
                let dm_wrap_cssRight = parseInt($('.bpx-player-dm-setting-wrap').css('right'))
                // log('dm_right: '+dm_right)
                // log('dm-box_width: '+dm_max_width)
                // log('dm-wrap_cssRight: '+dm_wrap_cssRight)
                // log(dm_max_width-dm_right-10)
                // log($('.bpx-player-dm-setting-wrap').css('right'))
                if(dm_right-dm_max_width < dm_wrap_cssRight){
                    $('.bpx-player-dm-setting-wrap').css('right', dm_right-dm_max_width-10)
                }
            }).on('mouseleave', function(){  //解决mouseleave和bb['dmWrap']).css('display')不同步的问题
                clearInterval(id);
                id = setInterval(() => {
                    if ($(bb['dmWrap']).css('display') !== 'none') return;
                    clearInterval(id);
                    let $main = $('.keybindings-editor');
                    $main.find('.monaco-list-rows').off('click.hhh_widget_listrow');
                    $main.find('.monaco-list-rows').off('dblclick.hhh_widget_listrow');
                    $main.find('input').off('keydown.hhh_widget_input');
                    $main.find('input').off('keyup.hhh_widget_input');
                    $main.find('input').add('.defineKeybindingWidget').off('mousewheel.hhh_widget_input');
                    $main.find('input').off('blur.hhh_widget_input');
                    $('body').off('keydown.hhh_widget_listrow');
                    $('body').off('keydown.hhh_checkbox_args');
                }, 200);
            });

            // $DSet.on('mouseleave', function(){
            //     return false;
            // })

            //执行所有默认设置
            if(run_default_setting_flag === 'run_default_setting') $reset.click()

            //初始化【checkbox】
            $(bb['dmWrap']).find('.bui-panel-wrap').css('visibility', 'hidden') //避免弹幕设置框闪影
            $(bb['dmWrap']).find('.bui-panel-move').css('visibility', 'hidden')

            $(bb['dm'])[0].dispatchEvent(new MouseEvent('mouseenter'))
            $(bb['dm'])[0].dispatchEvent(new MouseEvent('mouseover'))
            $(bb['dmWrap']).css('visibility', 'hidden')
            Object.keys(config.sets).forEach((kname)=>{ if(config.sets[kname].type === 'checkbox') $(`#${kname}`).click() })  //点击所有checkbox，得到最大宽度
            $(bb['dm'])[0].dispatchEvent(new MouseEvent('mouseout'))
            $(bb['dm'])[0].dispatchEvent(new MouseEvent('mouseleave'))

            setTimeout(() => {
                $(bb['dmWrap']).hide()
                $(bb['dmWrap']).css('visibility', 'visible')
                $(bb['dmWrap']).find('.bui-panel-wrap').css('visibility', 'visible')
                $(bb['dmWrap']).find('.bui-panel-move').css('visibility', 'visible')
            }, 0)

            all_checkbox_width = input_max_width + input_number_max_width + 'px'
        }

        //记忆弹幕设置操作
        function dm_remember(setting_func){
            // if(bb_type.indexOf(BILI_3_X_VIDEO) !== -1) $('.squirtle-controller-wrap').css({"display":"flex"});
            // $(bb['dmWrap']).css({"display":"block"});

            $(bb['dm'])[0].dispatchEvent(new MouseEvent('mouseenter'));
            //$(bb['dm'])[0].dispatchEvent(new MouseEvent('mouseover'));
            setting_func();
            //$(bb['dm'])[0].dispatchEvent(new MouseEvent('mouseout'));
            $(bb['dm'])[0].dispatchEvent(new MouseEvent('mouseleave'));

            // $(bb['dmWrap']).css({"display":"none"});
            // if(bb_type.indexOf(BILI_3_X_VIDEO) !== -1) $('.squirtle-controller-wrap').css({"display":"none"});
        }

        //因为遮挡弹幕，去掉全屏时鼠标悬停时产生的顶端mask
        function removeVideoTopMask(is_remove){
            let top_mask_class = bb['videoTopMask'].substr(1);
            if(is_remove === ON) $(bb['videoTopMask']).attr('id', top_mask_class).removeClass();
            else $(`#${top_mask_class}`).addClass(top_mask_class);
        }

        //1、播放关灯 2、暂停开灯 3、下滚时开灯 4、跳过充电
        function lightOffWhenPlaying(status){
            $(h5Player).off('play.hhh'); if(status === OFF) return
            $(h5Player).on('play.hhh', ()=> !is_lightoff() && lightoff_hand())
        }
        function lightOnWhenPause(status){
            $(h5Player).off('pause.hhh'); if(status === OFF) return
            $(h5Player).on('pause.hhh', ()=> is_lightoff() && lightoff_hand())
        }
        function lightOnWhenLike(status, screen_top){
            $(window).off('scroll.hhh_light_like'); if(status === OFF || myinfo.hand_lightoff_state === OFF) return
            $(window).on('scroll.hhh_light_like', function() {
                let $mini = $('.bpx-player-mini-warp')
                if($mini.length > 0 && $mini.css('display') !== 'none') return
                const video_top = $('.bpx-player-video-area')[0].getBoundingClientRect().top - $('#biliMainHeader').height()// + $('#biliMainHeader').height()
                const light_on_limit = $('.bpx-player-video-area')[0].getBoundingClientRect().height * screen_top
                // log(-video_top, light_on_limit, screen_top)
                // if(-video_top >= light_on_limit) is_lightoff() && lightoff_hand(LIGHTON_LIKE)
                // else !is_lightoff() && lightoff_hand(LIGHTON_LIKE)
                if(-video_top >= light_on_limit) is_lightoff() && lightoff_run()
                else !is_lightoff() && lightoff_run()
              })
        }
        function jumpElectric(status){
            $(h5Player).off('ended.hhh'); if(status === OFF) return;
            $(h5Player).on('ended.hhh', ()=> $(bb['playJumpElectric']).click())
        }

        //自动打开弹幕
        function autoOpenDanmu(){
            let ob = new MutationObserver((mutations, observer) => {
                for (var mutation of mutations) {
                    let $target = $(mutation.target)
                    if($target.hasClass('bilibili-player-video-info-people-number') || bb_type.indexOf(BILI_3_X_VIDEO) !== -1) {
                        ob.disconnect()
                        let $danmaku = $(bb['danmakuSwitch']).last().find('input')
                        if($danmaku[0].checked === false) $danmaku.click()
                        let t = setInterval(() => {
                            if($danmaku[0].checked === false) $danmaku.click()
                        }, 200)
                        setTimeout(() => { clearInterval(t) }, 2000)
                    }
                }
            })
            ob.observe($('body')[0], { childList: true, subtree: true, /*attributes: true,*/ })
        }

        //隐藏屏幕三连弹窗
        function hideThreePopup(status){
            let $popup = $('.bili-guide-all')
            if($popup.length === 0) return
            if(status === ON) $popup.hide()
            else $popup.show()
        }
        //隐藏屏幕打分弹窗 **
        function hideScorePopup(status){
            let $popup = $('.bili-score');
            if($popup.length === 0) return
            if(status === ON) $popup.hide()
            else $popup.show()
        }

        //双击或中键全屏、侧键网页全屏
        function dblclickFullScreen(status){
            $(bb['videoWrap']).off('mousedown.hhh'); if(status === OFF) return
            $(bb['videoWrap']).on('mousedown.hhh', function(e){
                if(e.button === 1 || e.button === 4 || e.button === 3) {  // 1中键
                    if(e.button === 1) web_fullscreen()
                    else fullscreen()
                    e.preventDefault(); e.stopPropagation()
                }
            })
            //$(bb['playTipWrap']).dblclick(function(){ fullscreen() });  //2.66自带双击全屏
        }

        //扩展播放倍速范围
        function extend_video_speed(){
            let $speedul = $(bb['videoSpeedActive']).parent();
            let ratios = ['0.1x','0.5x','0.75x','1.0x','1.25x','1.5x','1.75x','2.0x','2.5x','3.0x','3.5x','4.0x','4.5x','5.0x'];
            let $li = $speedul.find('li:first').clone(true, true);
            $speedul.empty();
            ratios.forEach(ratio => {
                let $this = $li.clone().prependTo($speedul).text(ratio);
                $this.attr('data-value', `${$this.text().split('x')[0]}`);
            });
            let speed_active = (bb_type === BILI_3_X_MOVIE)? 'bpx-state-active': (bb_type.indexOf(BILI_3_X_VIDEO) !== -1)? 'bpx-state-active': 'bilibili-player-active';
            $speedul.find('li:contains("1.0x")').addClass(speed_active);

            $speedul.on('click', function(e){
                let $li = $(e.target);
                let speed = $li.attr('data-value');
                if(speed !== undefined){
                    h5Player.playbackRate = +speed;
                    setTimeout(function(){
                        let speed_active = (bb_type === BILI_3_X_MOVIE)? 'bpx-state-active': (bb_type.indexOf(BILI_3_X_VIDEO) !== -1)? 'bpx-state-active': 'bilibili-player-active';
                        $(bb['videoSpeedActive']).removeClass(speed_active);
                        $li.addClass(speed_active);
                        //$(bb['videoSpeedName']).text($li.text());
                    },0)
                }
            })
        }

        //区间舍入
        function roundoff(rough_speed, direction, ratios){
            let speed
            if(direction > 0){  // ↑
                speed = ratios.find(ratio => rough_speed <= parseFloat(ratio))
            }else{  // ↓
                speed = ratios.slice().reverse().find(ratio => rough_speed >= parseFloat(ratio))
            }
            return parseFloat(speed || ratios[direction > 0 ? ratios.length - 1 : 0])
        }

        //调节视频倍速
        function video_select_speed(level) {
            const $speedul = $(bb['videoSpeed']).parent()
            const data_x = []
            const value_x = []
            $speedul.find('li').each(function() {
                const value = $(this).text()
                data_x.unshift(value)
                value_x.unshift(parseFloat(value))
            })
            const v = roundoff(h5Player.playbackRate, level, data_x)
            const index = value_x.indexOf(v)
            const x = h5Player.playbackRate !== v ? data_x[index] : (data_x[index + level] ? data_x[index + level] : data_x[index])
            //log(level, h5Player.playbackRate, v, x, data_x[index + level], data_x[index])
            $(`${bb["videoSpeed"]}:contains("${x}")`).click()
            showHint(parent, '#hhh_wordsHint', x)
        }

        //调节视频倍速(0.1x)
        function video_speed_0dot1(dot) {
            const rate = (h5Player.playbackRate + dot).toFixed(1)
            h5Player.playbackRate = rate
            showHint(parent, '#hhh_wordsHint', `${rate}x`)
        }

        //设置视频速度
        function video_speed_set(open=OFF, speed) {  //videoSpeedDefault
            if(open === OFF) return
            h5Player.playbackRate = (+speed).toFixed(2)
        }

        //播放设置控制
        function play_setting_box(){
            //==自动视频比例
            $('.bpx-player-ctrl-setting-aspect').off('click.hhh')
            //点击
            function aspect_click(v){ $(`.bpx-player-ctrl-setting-aspect .bui-radio-input[value="${v}"]`).click() }
            //读取/设置
            let curr_aspect = config.getCheckboxSettingKeyKey('settingBox', 'aspect')
            aspect_click(curr_aspect)
            //监听/保存
            waitForTrue(()=> $('.bpx-player-ctrl-setting-aspect-content .bui-radio-input:checked').val() === curr_aspect, ()=>{
                $('.bpx-player-ctrl-setting-aspect').on('click.hhh', ()=>{
                    let curr_aspect = $('.bpx-player-ctrl-setting-aspect-content .bui-radio-input:checked').val()
                    config.setCheckboxSettingKeyKey('settingBox', 'aspect', curr_aspect)
                    config.storageCheckboxSetting()
                })
            })
        }

        //计算坐标
        function tip_calc_xy_3_X(t){
            let crects = t.target[0].getBoundingClientRect(),
                trects = t.tip_target[0].getBoundingClientRect(),
                tip_height = trects.height,
                tip_width = trects.width,
                width = crects.width,
                top = crects.top - tip_height,
                left = crects.left + (width - tip_width) / 2;
            return {x:left, y:top};
        }
        //创建tip
        function tip_create_3_X(et){
            function show_tip(t){
                //显示及渐隐效果（抄bilibili^^）
                let o = t.tip_target,
                    tip = t.target.data('tip'),
                    color = t.color || 'white',
                    text = (typeof tip === 'function' && tip()) || tip;
                o.find('div').css({color: color}).text(text);
                let xy = tip_calc_xy_3_X(t),
                    target = t.target[0];
                clearTimeout(target.showHintTimer),
                clearTimeout(target.hideHintTimer),
                    target.showHintTimer = window.setTimeout((function() {
                        o.stop();
                        o.css({visibility: 'visible'});
                        o.css({left: xy.x, top: xy.y});
                        o.animate({
                            opacity: 1,
                            top: xy.y - t.gap,
                        }, t.animate_duration);
                    }
                ), t.delay);
                if(t.duration !== -1){
                    target.hideHintTimer = window.setTimeout((function() {
                        o.stop().animate({opacity: 0, top: xy.y + t.gap}, t.animate_duration, (function() { o.css({visibility: 'hidden'}) }));
                    }), t.duration);
                }
            }

            let $target = et.target,
                $tip = et.tip_target;
            $target.data('tip', et.title);

            let tip_args = {
                name: 'hhh_tip',
                target: $target,
                tip_target: $tip,
                color: et.color,
                position: 2,
                animate_duration: 300,
                delay: et.delay || 200,
                duration: et.duration || -1,
                gap: et.gap,
                type:'show',
            };

            if(et.once === ON){
                clearTimeout($target[0].showHintTimer);
                $tip.stop().css({visibility: 'hidden', opacity: 0});
                show_tip(tip_args);
            }else{
                $target.mouseenter(function(){
                    show_tip(tip_args);
                }).mouseleave(function(){
                    clearTimeout($target[0].showHintTimer);
                    $tip.stop().css({visibility: 'hidden', opacity: 0});
                })
            }
        }
        //更新tip
        function tip_update_3_X(t){
            if(t.title !== undefined) t.target.data('tip', t.title);
            let tip = t.target.data('tip'),
            text = (typeof tip === 'function' && tip()) || tip;
            t.tip_target.find('div').text(text);
            let xy = tip_calc_xy_3_X(t);
            t.tip_target.css({left: xy.x, top: xy.y - t.gap});
        }

        //初始化tip
        function tip_init() {
            if(bb_type.indexOf(BILI_2_X) !== -1){
                $('.bilibili-player-video-danmaku-setting-left-ps').mouseover();
                waitForTrue(()=> $('.player-tooltips.tip.top-center.animation').length === 1, () => {
                    $tip = $('.player-tooltips.tip.top-center.animation').clone().removeClass('active');
                    $tip.find('.tooltip').css('background-color', 'rgba(0,0,0,0.9)');
                    $('.bilibili-player-video-danmaku-setting-left-ps').mouseout();
                });
            } else {
                if($('#hhh_tip').length <= 0)
                    $(bb['playTooltipArea']).append(`<div id='hhh_tip' class=${bb['playTooltipItem'].slice(1)}><div class=${bb['playTooltipTitle'].slice(1)}>TIP</div></div>`); 
            }
        }

        //自定义倍速播放
        function customPlayRate(open=OFF, rate=2){
            if(open === !ON){
                $(document).off('keydown.hhh_rate');
                $(document).off('keyup.hhh_rate');
                let $three_rate = $('.bpx-player-three-playrate-hint');
                if($three_rate.length > 0) $three_rate.contents()[1].nodeValue = `倍速播放中`;                
                return false;
            }else{
                let go_id = null;
                let keystrokes = 0;
                let old_rate;
                // eslint-disable-next-line no-inner-declarations
                function kup(e){
                    if(e.keyCode === keycode['right']){  //right arrow down
                        $('.bpx-player-three-playrate-hint').css('display','none');
                        clearTimeout(go_id);
                        go_id = null;
                        keystrokes = 0;
                        h5Player.playbackRate = old_rate || h5Player.playbackRate;
                    }
                }
                // eslint-disable-next-line no-inner-declarations
                function kdown(e){
                    if(e.keyCode === keycode['right']){  //right arrow down
                        if(e.ctrlKey || e.shiftKey || e.altKey) return;
                        if(++keystrokes === 1) old_rate = h5Player.playbackRate;  //记录第一次按键时播放速度
                        let $three_rate = $('.bpx-player-three-playrate-hint');
                        if($three_rate.length > 0){
                            // eslint-disable-next-line no-inner-declarations
                            function go(op){
                                function g(op, i){
                                    op.now[i] += op.steps[i];
                                    if(op.now[i] > op.end || op.now[i] < op.start){
                                        op.steps[i] = -op.steps[i];
                                    }
                                    let $r = $three_rate.find('g:first');
                                    let $g = $r.children(`g:eq(${i})`);
                                    $g.attr('opacity', op.now[i]);
                                }
                                g(op,0); g(op,1); g(op,2);
                                //恢复初始状态
                                if(1&&op.now[0] < op.start){
                                    op.now[0] = op.now_init[0], op.now[1] = op.now_init[1], op.now[2] = op.now_init[2];
                                    op.steps[0] = op.step, op.steps[1] = op.step, op.steps[2] = op.step;
                                    //console.table(op)
                                }
                            }

                            //rate=倍速***
                            // eslint-disable-next-line no-inner-declarations
                            function loop(rate=2){  //键盘连按大约1秒30次，间隔33毫秒
                                let op = (function(rate){
                                    let start = 0.15;
                                    let now = [0.15, 0.35, 0.55];
                                    let end = 0.75;
                                    let millisec = 33;
                                    let frame = 1000 / millisec;
                                    let cycle = end - start;
                                    let step = cycle / (frame/rate/1.33);
                                    return {
                                        start: start,
                                        now_init: JSON.parse(JSON.stringify(now)),
                                        now: JSON.parse(JSON.stringify(now)),
                                        end: end,
                                        millisec: millisec,
                                        step: step,
                                        steps: [step, step, step],
                                    }
                                })(rate);
                                go_id = setInterval(()=>{
                                    go(op);
                                }, op.millisec);
                            }

                            if(keystrokes === 2){  //第二次按键开始倍速播放
                                $three_rate.css('display','');
                                let Hanzi_digit = ['〇','一','二','三','四','五','六','七','八','九','十'][rate] || rate;
                                $three_rate.contents()[1].nodeValue = `${Hanzi_digit}倍速播放中`;
                                h5Player.play();
                                h5Player.playbackRate = rate;
                                //loop(rate);  //...
                            }
                            if(keystrokes !== 1) return false;  //第一次按键正常返回，执行默认操作（快进5秒）
                        }
                    }
                }
                $(document).off('keydown.hhh_rate').on('keydown.hhh_rate',kdown)
                $(document).off('keyup.hhh_rate').on('keyup.hhh_rate',kup)
            }
        }
        
        //标题抬头显示tags（视频属于哪个区）
        function add_tags_to_video_title(open=ON){
            let tags = []
            $('#hhh_tags').remove('span')
            if(open === OFF) return false

            $('.tag-panel .tag-link:first, .tag-panel .tag-link:eq(1)').each(function(){
                tags.push($(this).text())
            })
            $('.video-info-meta .pubdate-ip.item').after(`<span id=hhh_tags style="margin-right:5px">( ${tags.join(' | ')} )</span>`)
        }

        //读取cookie
        function get_cookie(name) {
            let c = document.cookie.split(';')
            let v = c.find(e => e.match(name+'='))
            return v.split(name+'=')[1]
        }
        //设置cookie
        function set_cookie(name, value, day) {
            day = void 0 !== day ? day : 365
            let d = new Date
            d.setTime(d.getTime() + 24 * day * 60 * 60 * 1e3)
            document.cookie = name + "=" + escape(value) + ";expires=" + d.toGMTString() + "; path=/; domain=.bilibili.com"
        }
        
        //添加返回旧版按钮 暂不使用
        function add_go_back(){
            if(ver === BILI_3_X_VIDEO_V1){
                let $sidenav = $('.fixed-sidenav-storage')
                let $go_back = $sidenav.append('<div class="back-to-top-wrap"><div class="back-to-top fixed-sidenav-storage-item visible" data-v-3965288e>返回旧版</div></div>').children(':last')
                $go_back.click(()=>{
                    set_cookie("go_old_video", "1")  //返回旧版
                    location.reload()
                })
            }
        }

        //内测版首页添加返回新版按钮
        function run_go_back_new_version(){
            if(ver === BILI_4_X_V1){  //测试版
                waitForTrue(()=> $('.palette-button-wrap .top-btn-wrap').length === 1, () => {
                    let $last_primary = $('.palette-button-wrap .top-btn-wrap')
                    let $go_back = $last_primary.after($last_primary.clone()).next()
                    $go_back.find('svg').remove('svg')
                    $go_back.find('.primary-btn').addClass('visible')
                    $go_back.find('.primary-btn-text').css('width','34px').text('返回新版')

                    $go_back.click(()=>{
                        set_cookie('i-wanna-go-back', '-1')  //返回新版
                        set_cookie('i-wanna-go-feeds', '-1')  //返回新版
                        set_cookie('buvid3', '')  //返回新版
                        set_cookie('nostalgia_conf', '1')  //返回新版
                        location.reload()
                    })
                })
            }
            
            //if(ver !== BILI_3_X_VIDEO){  //旧版
                // set_cookie('buvid3', '')  //返回新版
                // set_cookie('buvid4', '')  //返回新版
                // location.reload()
            //}
        }

        //动态隐藏biliMainHeader
        function dynamic_hide_mainheader(open){
            function is_block(){
                if ($('.center-search__bar.is-focus').length > 0) return true  //是否弹出搜索历史
                let is_block = false
                $('.v-popover').each(function(){
                    // console.log($(this).css('display'))
                    if($(this).css('display') !== 'none'){  //是否弹出直播、漫画、消息、动态、收藏、历史等
                        is_block = true
                        return false
                    }
                })
                return is_block
            }
            
            $('body').off('mousemove.hhh_dynamic_hide_mainheader')
            const $main_header = $('#biliMainHeader')
            if(open === OFF) { $main_header.css('position', '').show(); return }

            waitForTrue(()=>$main_header.length > 0, ()=>{
                const height = $main_header[0].getBoundingClientRect().height
                $main_header.css('position', 'absolute').hide()
                $('body').on('mousemove.hhh_dynamic_hide_mainheader', (e)=>{
                    const x = e.clientX
                    const y = e.clientY
                    // log(e.clientX, e.clientY)
                    const rect = $('.up-panel-container')[0].getBoundingClientRect()
                    const up_left   = rect.left
                    const up_right  = rect.right
                    const up_top    = rect.top
                    const up_bottom = rect.bottom
                    const is_in_up_box = x > up_left && x < up_right && y > up_top && y < up_bottom
                    const is_pop_dm_setting_box = $('.bpx-player-dm-setting-wrap').css('display') !== 'none'  //是否弹出弹幕设置

                    if(y > 0 && y < height && !is_in_up_box && !is_pop_dm_setting_box) { $main_header.show() }
                    else if(y >= height && !is_block()) { $main_header.hide() }
                })
            })
        }
        
        //自动点赞
        function auto_like(open, [following_status, second]){
            // log('---auto_like---')
            const fn = auto_like

            function removeEventLists(timerun, timeend){
                h5Player.removeEventListener('timeupdate', timerun)
                h5Player.removeEventListener('ended', timeend)
            }
            
            removeEventLists(fn.timerun, fn.timeend)

            function is_following_UP() { return $('.following').length > 0 }
            function is_following_UP_by_Joint() {  //联合投稿
                if($('.membersinfo-upcard-wrap').length === $('.add-follow-btn').length) return false  //里面没有关注的UP主
                return true
            }
            function is_like() { return $(bb['like']).hasClass('on') }  //备注：$.ajax - url: `https://api.bilibili.com/x/web-interface/archive/has/like?bvid=${bvid}`, .data
            function like_click() { $(bb['like']).click() }

            if(open === OFF) return
            if(is_like() === true) return
            if(following_status && !is_following_UP() && !is_following_UP_by_Joint()) return

            if(second <= 0) { log('自动点赞，打开网页后'); like_click(); return }  //进入视频页立即点赞
            
            // h5Player = geth5Player()

            let timerun = function(){
                // log('---timerun---')
                const fn = timerun
                if(fn.time === undefined){
                    fn.time = Date.now()
                    fn.interval = 0
                }

                const now = Date.now()
                fn.interval += now - fn.time
                fn.time = now

                // log('second: ', fn.interval, second)
                if(fn.interval > second*1000){
                    removeEventLists(fn, timeend)
                    log(`自动点赞，播放${second}秒后`)
                    like_click()
                }
            }

            let timeend = function(){
                // log('---自动点赞 timeend---')
                removeEventLists(timerun, timeend)
                log(`自动点赞，播放完毕后`)
                like_click()
            }

            fn.timerun = timerun
            fn.timeend = timeend

            h5Player.addEventListener('timeupdate', timerun)
            h5Player.addEventListener('ended', timeend)
        }
        
        //弹幕发送区域透明度
        function opacity_player_sending_area(open, [opacity]){
            $('.bpx-player-sending-area').off('mouseenter.hhh_opacity')
            $('.bpx-player-sending-area').off('mouseleave.hhh_opacity')
            $('.bpx-player-sending-area').css('opacity', 1)
            if(open === OFF) return false
            if(is_lightoff() === OFF) return false

            const t = 200
            
            if(!$(':hover').map((i,e)=>e.className).get().includes('bpx-player-sending-area')){ // 鼠标是否在发送区域之上，不在淡化
                $('.bpx-player-sending-area').stop().animate({ opacity: `${opacity/100}` }, t)
            }

            $('.bpx-player-sending-area').on('mouseenter.hhh_opacity',()=>{
                // log('----mouseenter',e.target.className, e)
                $('.bpx-player-sending-area').stop().animate({ opacity: 1 }, t)
            })
            $('.bpx-player-sending-area').on('mouseleave.hhh_opacity',()=>{
                // log('--mouseleave',e.target.className, e)
                if(!$(':hover').map((i,e)=>e.className).get().includes('bpx-player-sending-area')){ // 鼠标是否在发送区域之上，不在淡化
                    $('.bpx-player-sending-area').stop().animate({ opacity: `${opacity/100}` }, t)
                }
            })
        }

        //点赞等按钮上移到弹幕栏
        function toolbar_cloneto_dmroot(open, [remove_info]){
            let root = $('#arc_toolbar_report').add('#playlistToolbar').add('.plp-l .toolbar')[0]
            if(!!root?.hhh_ob) root?.hhh_ob?.disconnect()
            $('#hhh_toolbar_cloneto_dmroot').remove()
            $('.bpx-player-video-info').css('display', '')
            //恢复弹幕输入栏
            $('.bpx-player-video-inputbar').css({'width': '', 'min-width': ''})
            $('.bpx-player-video-inputbar-wrap').css({'width': ''})
            $('.bpx-player-dm-input').css({'min-width': '', 'width': ''})
            $('.bpx-player-dm-hint').show()
            if(open === OFF) return false
            if(video_type.includes('SS')) return false //电影、番剧等暂不支持

            if(remove_info === ON){ $('.bpx-player-video-info').hide() }
            //减短弹幕输入栏，避免弹幕栏过长
            $('.bpx-player-video-inputbar').css({'width': 'auto', 'min-width': 'auto'})
            $('.bpx-player-video-inputbar-wrap').css({'width': 'auto'})
            $('.bpx-player-dm-input').css({'min-width': 'auto', 'width': '30px'})
            $('.bpx-player-dm-hint').hide()

            //复制点赞等按钮
            $('.video-toolbar-left-main:first').clone().prependTo('.bpx-player-dm-root')
                                                       .css({'display': 'flex', 'width': 'max-content'})
                                                       .attr({'id': 'hhh_toolbar_cloneto_dmroot'})
                                                       .find('svg').css({'width': '20px'}).end()
                                                       .find('.toolbar-left-item-wrap').css({'margin-right': '10px'}).end()
                                                       .find('.video-toolbar-left-item').css({'width': 'auto'}).end()
                                                       .find('.video-share-info').css({'width': 'auto'}).end()
                                                       .find('.video-share-info-text').css({'position': 'relative'}).end()
                                                       .find('.video-share-popover').remove()

            $('.video-watchlater').clone().appendTo('#hhh_toolbar_cloneto_dmroot')
                                          .css({'margin-right': '25px'})
                                          .find('.ops-watch-later').remove().end()
                                          .find('svg').css({'width': '20px'}).end()

            append_style($('#hhh_toolbar_cloneto_dmroot'), 'hhh_toolbar_cloneto_dmroot_style',
                `
                    .video-watchlater.on {
                        color: var(--brand_blue);
                    }
                `
            )

            //得到当前稍后再看状态
            if($('.ops-watch-later').hasClass('added') === true) $('#hhh_toolbar_cloneto_dmroot .video-watchlater').addClass('on')

            //video-share
            ;['mouseenter', 'mouseleave', 'click'].forEach((event)=>{
                $('#hhh_toolbar_cloneto_dmroot .video-share').off(`${event}.hhh_video_share`).on(`${event}.hhh_video_share`, ()=>{
                
                    // log(event)
                    if(event === 'mouseenter'){
                        let aria_hidden = $('.video-share-popover').attr('aria-hidden')

                        if(aria_hidden === 'true'){
                            $('.video-share-popover').css('visibility', 'hidden')
                        }
                        $('.video-share')[1].dispatchEvent(new MouseEvent('mouseenter'))

                        setTimeout(()=>{
                            let old_share = $('.video-share:last').offset()
                            let new_share = $('.video-share:first').offset()
                            let old_pop = $('.video-share-popover').offset()
                            let new_top = old_pop.top - (old_share.top - new_share.top)
                            let new_left = old_pop.left - (old_share.left - new_share.left)

                            if(aria_hidden === 'true'){
                                $('.video-share-popover').css({'top': new_top, 'left': new_left})
                            }
                            $('.video-share-popover').css({'visibility': 'visible'})
                        },0)
                    }
                    else{
                        $('.video-share')[1].dispatchEvent(new MouseEvent(event))
                    }
                    
                })
            })

            //like、coin、fav、watchlater
            let toolbar = {
                'like': ['click', 'mousedown', 'mouseleave', 'mouseup'],
                'coin': ['click'],
                'fav': ['click'],
                'watchlater': ['click'],
            }
            for(let [item_type, events] of Object.entries(toolbar)){
                // console.log(item_type, events)
                events.forEach((event)=>{
                    $(`#hhh_toolbar_cloneto_dmroot .video-${item_type}`).off(`${event}.hhh_video_${item_type}`).on(`${event}.hhh_video_${item_type}`, function(){
                        let video_item = item_type === 'watchlater' ? $('.ops-watch-later')[0] : $(`.video-${item_type}`)[1]
                        video_item.dispatchEvent(new MouseEvent(event))
                        
                    })
                })
            }
            
            //监听响应
            root.hhh_ob = new MutationObserver((mutationsList) => {
                for (let mutation of mutationsList) {
                    let class_name = mutation.target.className.toString()
                    // console.log(mutation)
                    if(class_name?.includes('video-like')) $('#hhh_toolbar_cloneto_dmroot .video-like').toggleClass('on')  //console.log('点赞:', $(mutation.target).hasClass('on'))
                    if(class_name?.includes('video-fav'))  $('#hhh_toolbar_cloneto_dmroot .video-fav').toggleClass('on')
                    if(class_name?.includes('ops-watch-later')) $('#hhh_toolbar_cloneto_dmroot .video-watchlater').toggleClass('on')
                    if(class_name?.includes('video-coin') && $(mutation.target).hasClass('on')) $('#hhh_toolbar_cloneto_dmroot .video-coin').addClass('on')
                }
            })
            root.hhh_ob.observe(root, {
                subtree: true,
                attributes: true,
            })
            root.hhh_ob.observe($('.ops-watch-later')?.[0] ?? root, {
                subtree: true,
                attributes: true,
            })

        }

        // 加入已填装弹幕等信息到视频顶部title
        function add_dm_info_to_top_title(open){
            // log('add_dm_info_to_top_title',open)
            if(open === OFF) return false

            if(bb_type !== BILI_3_X_MOVIE){
                $('.bpx-player-top-wrap').css({'-webkit-clip-path': ''})
                waitForTrueFalse(()=>{
                    let dm_count = parseInt($('.bpx-player-video-info-dm').text().match(/\d+/)?.[0])
                    // log('loop:',dm_count, $('.bpx-player-top-left-title').text(), $('.bpx-player-top-left-title span').length)
                    return $('.bpx-player-top-left-title span').length <= 0 && dm_count > 0
                }, ()=>{
                    // if(video_type === '视频选集') $('.bpx-player-top-left-title').text($('.list-box .on .part').text())
                    let dm = $('.bpx-player-video-info-dm').text()
                    let time = $('.bpx-player-ctrl-time-duration').text()
                    $('.bpx-player-top-left-title').find('span').remove().end()
                                                   .append(`<span> | ${dm} | ${time}</span>`)
                    
                    $('.bpx-player-top-wrap').css({'-webkit-clip-path': 'none'})
                    
                    clearTimeout($('.bpx-player-top-wrap')[0].hhh_dm_t)
                    $('.bpx-player-top-wrap')[0].hhh_dm_t = setTimeout(()=>{
                        $('.bpx-player-top-wrap').css({'-webkit-clip-path': ''})
                    }, 4000)

                    // log('OK',$('.bpx-player-top-left-title').text())//$item_active.text()
                }, 20)
            }
        }

        function toggle_bili_dark_light_mode(open){

        }

        function get_video_type(){
            //视频选集/合集（选集是单个BV号，合集是多个BV号）
            let video_type_ =  $('.video-pod__list.multip').length > 0 ?     MULTI_P : //视频选集
                               $('.video-pod__list.section').length > 0 ? VIDEO_LIST : //合集
                               $('.action-list-inner').length > 0 ?      ACTION_LIST : //收藏列表
                                                                        NORMAL_VIDEO   //常规视频
            // video_type_ = !!window.__NEXT_DATA__ ? ('SS_'+window.__NEXT_DATA__.props.pageProps.dehydratedState.queries[0].state.data.seasonInfo.mediaInfo.ssTypeFormat.name) : video_type_
            video_type_ = $('.mediainfo_btnHome__P2fri').text()?.match(/(.+)频道/)?.[1] ? 'SS_'+$('.mediainfo_btnHome__P2fri').text()?.match(/(.+)频道/)?.[1] : video_type_

            //get 唯一id
            function get_video_type_unique_id(video_type_){
                let vue = $('#app')[0]?.__vue__
                let video_type_unique_id_ = video_type_ === MULTI_P ?                 vue?.aid : //视频选集
                                            video_type_ === VIDEO_LIST ? vue?.sectionsInfo?.id : //合集
                                            video_type_ === ACTION_LIST ?    vue?.playlist?.id : //收藏列表
                                                                                      vue?.aid   //常规视频
                return video_type_unique_id_
            }

            let video_type_unique_id_ = get_video_type_unique_id(video_type_)
            return [video_type_, video_type_unique_id_]
        }

        //常规视频播放计数
        function normal_video_play_count(open=ON, second=0){
            if(open === OFF) { remove_play_count_to_video_title(); return false}
            
            function get_bv() { return $('meta[itemprop=url]').attr('content')?.match(/BV\w+/)?.[0] }
            if(get_bv() === undefined) return false

            function update_play_count(){
                // log('---------update_play_count----------')
                const bvid = get_bv()
                if(bvid === undefined) { err('当前视频未发现bvid'); return }

                const obj = get_value('hhh_normal_video_play_count') || {}
                const bv = obj?.[bvid] ?? {}
                bv.play_count = bv.play_count === undefined ? 1 : bv.play_count + 1
                obj[bvid] = bv
                set_value('hhh_normal_video_play_count', obj)

                return bv.play_count
            }
            function get_play_count(){
                const bvid = get_bv()
                if(bvid === undefined) { err('当前视频未发现bvid'); return }
                const obj = get_value('hhh_normal_video_play_count') || {}
                const play_count = obj?.[bvid]?.play_count ?? 0

                return play_count
            }

            function remove_play_count_to_video_title(){ $('#hhh_normal_video_play_count').remove() }
            function add_play_count_to_video_title(play_count){
                if(play_count === undefined) return
                remove_play_count_to_video_title()
                let $insert = $('#hhh_tags').length > 0 ? $('#hhh_tags') : $('.video-info-meta .pubdate-ip.item')
                $insert.after(`<span id=hhh_normal_video_play_count style="margin-right:10px">( 观看次数:${play_count} )</span>`)
            }

            //点击即开始计数
            if(second === 0) {
                // log(second)
                add_play_count_to_video_title(update_play_count())
            }else{
                add_play_count_to_video_title(get_play_count())
                const fn_timeupdate = function(){
                    add_play_count_to_video_title(update_play_count())
                    run_events_listener('timeupdate', {'hhh_play_count': null})
                }
                // log('---run_events_listener---')
                run_events_listener('timeupdate', {'hhh_play_count': fn_timeupdate})
            }
        }

        //强制从最开始播放
        function reset_video(open=OFF){
            if(open === OFF) return false
            
            if( h5Player.currentTime > 3){
                waitForTrue(()=>$('.bpx-player-toast-wrap .bpx-player-toast-confirm').length > 0, ()=>{
                    $('.bpx-player-toast-wrap .bpx-player-toast-confirm').click()
                }, 20)
            }else{ h5Player.play() }

            // window.player.pause()
            // if( window.player.getCurrentTime() > 3){
            //     // window.player.seek(0)
            // }
            // window.player.play()
        }
        
        //////////////////////////////
        ////=====$('#hhh_expand_list').off('mouseenter.hhh').on('mouseenter.hhh',()=>{
        //     window.player.tooltip.create({
        //     name: 'hhh_expand_list',
        //     title: '自动连播下面',
        //     target: $('#hhh_expand_list')[0],
        //     position: 2,
        //     duration: 1e3,
        //     delay: 300,
        //     })
        // })

        // $('#hhh_expand_list').off('mouseleave.hhh').on('mouseleave.hhh',()=>{
        //     window.player.tooltip.remove('hhh_expand_list')
        // })
        
        //加载视频时执行，处理不刷新页面也重新加载视频的情况
        let a = 0
        function run_video_loaded(){
            // log('------加载视频时执行，处理不刷新页面也重新加载视频的情况------')
            
            // log('---video_type---1', prev_video_type,'-', prev_video_type_unique_id,'-', video_type,'-', video_type_unique_id)
            ;[prev_video_type, prev_video_type_unique_id] = [video_type, video_type_unique_id]
            ;[video_type, video_type_unique_id] = get_video_type()
            // log('---run_video_loaded-video_type---2', prev_video_type,'-', prev_video_type_unique_id,'-', video_type,'-', video_type_unique_id)

            h5Player = geth5Player()

            //判断是否是在同一视频集合，或不是列表类视频
            if(video_type_unique_id !== prev_video_type_unique_id || ['视频选集', '合集', '收藏列表'].includes(video_type) === false){
                run_events_listener('ended', null)  //清空ended事件
                h5Player.removeEventListener('timeupdate', $(bb['video'])[0]?.hhh_fn_timeupdate)  //清空timeupdate事件***
            }

            //记忆洗脑循环
            if(0&&config.getCheckboxSettingStatus('rememberVideoRepeat') === ON && config.getCheckboxSettingStatus('videoRepeat') !== ON) {

                //log(get_value('hhh-rememberVideoRepeat'),get_value('hhh-rememberVideoRepeat', $(bb['playSettingRepeatInput'])[0].checked), $(bb['playSettingRepeatInput'])[0].checked)

                // if(get_value('hhh-rememberVideoRepeat', $(bb['playSettingRepeatInput'])[0].checked) === true) $(bb['playSettingRepeatInput']).click()  //localStorage只能保存字符串
                // setTimeout(()=>{
                //     $(bb['playSettingRepeatInput']).click()
                // },3000)
                // $(bb['playSettingRepeatInput']).click(function() {
                //     set_value('hhh-rememberVideoRepeat', !!$(bb['playSettingRepeatInput'])[0].checked)
                // })
            }

            //自动点赞
            auto_like(config.getCheckboxSettingStatus('autoLike'), [config.getCheckboxSettingStatus('likeFollowed'), config.getCheckboxSettingArgs('autoLike')['second']])
  
            //列表类视频关键字过滤
            list_filter(config.getCheckboxSettingStatus('listFilter'))
            
            //列表类视频自动连播、列表循环、单集循环、播完暂停
            list_play_control(config.getCheckboxSettingStatus('independentListPlayControl'))

            //列表类视频列表展开，需要在add_to_video_sections_head之前执行
            expand_list(config.getCheckboxSettingStatus('expandList'), config.getCheckboxSettingArgs('expandList', 'columns'))
            
            //列表类视频head加入总时长等信息、进度可视化、排序
            if(a<=0)set_video_list()
            a++
            
            //新窗口打开自动连播列表视频
            run_rec_list_newtab(config.getCheckboxSettingStatus('openVideoInNewTab'))

            //点赞等按钮上移到弹幕栏
            toolbar_cloneto_dmroot(config.getCheckboxSettingStatus('toolbarCloneToDmRoot'), [ config.getCheckboxSettingStatus('isRemoveVideoInfo') ])

            //初次加载时视频顶端显示弹幕数和时长
            add_dm_info_to_top_title(config.getCheckboxSettingStatus('addDMInfoToTopTitle'))

            //指定视频默认播放速度
            video_speed_set(config.getCheckboxSettingStatus('videoSpeedDefault'), config.getCheckboxSettingArgs('videoSpeedDefault', 'speed'))

            //抬头显示tags（视频属于哪个区）
            add_tags_to_video_title(config.getCheckboxSettingStatus('addTagsToVideoTitle'))
            
            //常规视频播放计数
            normal_video_play_count(config.getCheckboxSettingStatus('normalVideoPlayCount'), config.getCheckboxSettingArgs('normalVideoPlayCount', 'second'))

            //播放设置控制
            play_setting_box()

            //强制从最开始播放
            reset_video(config.getCheckboxSettingStatus('resetVideo'))

            //** 指定画质视频
                            /*
                autoQualityVideo: { text: '自动选择最高质量视频', status: OFF,
                        args2:{ type: ['select'],
                                select: { items: ['浅色','深色'], value: '浅色', tip: [''] } }
                        },
                */
                        // getCheckboxSettingArgs2(key, type_name, subkey) {
                        //     let group = this.findGroupByKey(key)
                        //     if(group) {
                        //         if(subkey === undefined) return this.sets[group]['options'][key]['args2']
                        //         else return this.sets[group]['options'][key]['args2'][type_name][subkey]
                        //     }
                        // },
            // console.log(config.getCheckboxSettingArgs2('autoQualityVideo', 'select', 'value'))
            // config.setCheckboxSettingArgs2('autoQualityVideo', 'select', 'value', '深色')
            // console.log(config.getCheckboxSettingArgs2('autoQualityVideo', 'select', 'value'))
            function auto_quality_video(open=OFF) {
                if(open === OFF) return
                let quality_value = config.getCheckboxSettingArgs2('autoQualityVideo', 'select', 'value')
                // quality_value = 0
                let quality_data_value_array = Array.from($(`.bpx-player-ctrl-quality .bpx-player-ctrl-quality-menu li`)).map(item => parseInt(item.dataset.value, 10))
                let found_value = quality_data_value_array.reverse().find((item)=>item >= quality_value)
                let quality_item = $(`.bpx-player-ctrl-quality .bpx-player-ctrl-quality-menu li[data-value="${found_value}"]`)
                quality_item.length <= 0 ? auto_top_quality_video(ON) : quality_item.click()
            }
            auto_quality_video(config.getCheckboxSettingStatus('autoQualityVideo'))
            

            //log
            log(`[${video_ver}][${ver}][${video_type}]VIDEO加载完毕`)
        }
        
        //分享按钮提示框影响体验，延迟300ms提示
        function delay_share_hover_tip(open){

            // let ob = new MutationObserver((mutations) => {
            //     for (var mutation of mutations) {
            //         let target = mutation.target
            //         log(target.className)
            //     }
            // })
            // ob.observe($('.video-toolbar-left-main')[0], { childList: true, attributes: true, subtree: true })

            // return

            if(video_type.includes('SS')) return false //电影、番剧等暂不支持
            
            waitForTrue(()=> $('#share-btn-outer').length >= 1, ()=>{
                //mouseenter / mouseleave
                $('#share-btn-outer')[0].removeEventListener('mouseenter', $('#share-btn-outer')[0]?.hhh_share_btn_fn, true)
                $('#share-btn-outer')[0].removeEventListener('mouseleave', $('#share-btn-outer')[0]?.hhh_share_btn_fn2, true)
                if(open === OFF) return false
    
                if(bb_type === BILI_3_X_MOVIE) return
                //mouseenter
                $('#share-btn-outer')[0].hhh_share_btn_fn = function(e){
                    // console.log($(e), e.target.nodeName.toString().toUpperCase(), e.target.id, e.clientX, e.clientY)
                    if(e.target.id === 'share-btn-outer'){
                        // console.log('mouseenter')
                        $('#share-btn-outer')[0].hhh_share_btn_t = setTimeout(()=>{
                            // console.log('setTimeout')
                            $('#share-btn-outer')[0].removeEventListener('mouseenter', $('#share-btn-outer')[0]?.hhh_share_btn_fn, true)
                            $('#share-btn-outer')[0].dispatchEvent(new MouseEvent('mouseenter'))
                        }, 300)
                    }
                    e.preventDefault()
                    e.stopPropagation()
                    e.stopImmediatePropagation()
                }
                $('#share-btn-outer')[0].addEventListener('mouseenter', $('#share-btn-outer')[0].hhh_share_btn_fn, true)
            
                //mouseleave
                $('#share-btn-outer')[0].hhh_share_btn_fn2 = function(e){
                    if(e.target.id === 'share-btn-outer'){
                        // console.log('mouseleave')
                        clearTimeout($('#share-btn-outer')[0]?.hhh_share_btn_t)
                        $('#share-btn-outer')[0].addEventListener('mouseenter', $('#share-btn-outer')[0].hhh_share_btn_fn, true)
                    }
                }
                $('#share-btn-outer')[0].addEventListener('mouseleave', $('#share-btn-outer')[0].hhh_share_btn_fn2, true)
            })
        }

        //判断当前鼠标点击焦点，执行一些响应
        function handle_global_click(){
            $(document).mouseup(function(e){
                let ids = $(':hover').map((i,e)=>e?.id)?.get()
                let classes = $(':hover').map((i,e)=>e?.className)?.get()
                g_is_in_biliplayer = ids.includes('bilibili-player')

                //点击屏幕外时隐藏封面 2.x && 3.x
                if(g_is_in_biliplayer === false || e.target.className === 'bilibili-player-dm-tip-wrap' || e.target.tagName.toLowerCase() === 'video'){
                    $('#hhh_img').css('display', 'none')
                }
                //下一P倒计时，视频范围有点击动作时取消
                if(g_is_in_biliplayer === true && classes.includes('bpx-player-toast-wrap') === false){
                    if($('.bpx-player-toast-wrap .bpx-player-toast-text').text().match('秒钟后播放下一P') !== null){
                        $('.bpx-player-toast-wrap .bpx-player-toast-cancel').click()
                    }
                }
            })
        }
        
        //监听视频模式变化
        function show_list_item_in_control_bar(open){
            let ob = $('.bpx-player-container')[0].hhh_show_list_item_ob
            ob?.disconnect()
            if(open === OFF) return false

            ob = new MutationObserver((mutations, observer) => {
                for (var mutation of mutations) {
                    let target = mutation.target
                    let screen_type = $(target).attr('data-screen')
                    if(video_type === '合集'){
                        // log($(target).attr('data-screen'), $('.bpx-player-ctrl-btn.bpx-player-ctrl-eplist').css('visibility'), $('.bpx-player-ctrl-btn.bpx-player-ctrl-eplist').css('width'))
                        if(screen_type === 'wide'){
                            $('.bpx-player-ctrl-btn.bpx-player-ctrl-eplist').css({ 'visibility': 'visible', 'width': '54px' })
                        }else if(screen_type === 'normal'){
                            $('.bpx-player-ctrl-btn.bpx-player-ctrl-eplist').css({ 'visibility': 'hidden', 'width': '0px' })
                        }
                    }
                }
            })
            ob.observe($('.bpx-player-container')[0], { attributes: true })
            $('.bpx-player-container')[0].hhh_show_list_item_ob = ob
        }

        /////////////////////////////////
        ////======主程序,页面刷新完成时执行
        function run_once(){
            //防止重复加载
            if ($('#hhh_lightoff').length === 1) { /*log('重复加载');*/ return }
            
            //视频选集/合集（选集是单个BV号，合集是多个BV号）
            // log('---video_type---1', prev_video_type,'-', prev_video_type_unique_id,'-', video_type,'-', video_type_unique_id)
            // ;[prev_video_type, prev_video_type_unique_id] = [video_type, video_type_unique_id]
            ;[video_type] = get_video_type()
            // log('---run_once-video_type---2', prev_video_type,'-', prev_video_type_unique_id,'-', video_type,'-', video_type_unique_id)

            //bpx test
            function bpx_info(){
                return
                log('----------info---------')
                log('video_ver    : '+video_ver)
                log('ver          : '+ver)
                log('type         : '+video_type)
                log('fps          : '+fps)
                log('--------h5Player-------')
                dir(h5Player);
                log('currentTime  : '+h5Player.currentTime)
                log('duration     : '+h5Player.duration)
                log('playbackRate : '+h5Player.playbackRate)
                log('volume       : '+h5Player.volume)
                log('paused       : '+h5Player.paused)
                log('pause()      : '+'h5Player.pause()')
                log('videoHeight  : '+h5Player.videoHeight)
                log('videoWidth   : '+h5Player.videoWidth)
                log('-----------------------')
            }

            /*-----------------------------------
             *初始化等
             *----------------------------------*/
            //取得h5 video & window.player
            h5Player = geth5Player()

            //保存一些视频参数初始值
            app_page_parameters.player_setting_area = $(`.bpx-player-dm-setting-left-area ${bb['progressBar']}`).width()/25

            //初始化tip
            tip_init()

            //监听视频模式变化，显示/隐藏选集按钮
            show_list_item_in_control_bar(config.getCheckboxSettingStatus('showListItemInControlBar'))

            //初始化关灯按钮
            lightoff_init()

            //激活系统弹幕设置，以此调用系统网页全屏等
            $(bb['dm']).mouseenter().mouseleave()

            //激活系统播放设置，以此调用系统关灯等
            //去掉mouseleave()，否则如果太快执行mouseleave()无法激活关灯class，应该是mouseenter()未执行完就被mouseleave打断了
            $(`${bb['playVideo']}${bb['playSetting']}`).mouseenter()

            //避免显示设置页面
            // waitForNode(() => document.querySelector(bb['playSettingWrap']), (node) => {;
            //     $(node).css({"visibility":"hidden"});  //visible
            // })

            //解决因为激活关灯class，导致全屏时滚轮操作（系统自带）无法调节音量的问题
            // waitForTrue(()=> $(bb['playSettingWrap']).css('display') === 'block', () => {
            //     $(bb['playSettingWrap']).css('display', 'none').css('visibility', 'visible');
            // });

            //取得视频fps、版本号
            get_video_fps_ver()
                        
            //是否登录、是否大会员等
            get_biliinfo()

            //取得版本号
            //get_ver();

            //激活系统提示添加音量等自定义提示DOM
            pick_volume_hint();

            //添加自定义快捷键说明到右键菜单
            //add_custom_hotkey_menu(config.hotKeyMenu);
            add_custom_hotkey_menu(config.sets.keyBinding.options);

            //初始化自定义设置
            init_setting();

            /*-----------------------------------
             *事件等
             *----------------------------------*/
            //点击关灯
            $(`#hhh_lightoff ${bb['switchInput']}:first`).click(function(){ lightoff_hand() });

            //判断当前鼠标点击焦点，执行一些响应
            handle_global_click()

            //扩展播放倍速范围
            extend_video_speed()

            //修复选择历史弹幕时弹幕填装信息丢失问题
            fix_danmaku_info()

            //自动运行
            if( config.getCheckboxSettingStatus('autoPlay') === ON && $(bb['playSettingAutoplay'])[0].checked === false) $(bb['playSettingAutoplay'] ).click();//开启自动播放
            if( config.getCheckboxSettingStatus('autoLightOff') === ON ) lightoff_hand();  //自动关灯
            if( config.getCheckboxSettingStatus('autoFullScreen') === ON ) fullscreen();  //自动全屏
            if( config.getCheckboxSettingStatus('autoWebFullScreen') === ON ) web_fullscreen();  //自动网页全屏
            if( config.getCheckboxSettingStatus('autoWideScreen') === ON ) wide_screen();  //自动宽屏
            if( config.getCheckboxSettingStatus('videoRepeat') === ON ) $(bb['playSettingRepeatInput']).click();  //开启洗脑循环（系统默认关闭）
            if( config.getCheckboxSettingStatus('autoOpenDanmu') === ON ) autoOpenDanmu();  //自动显示弹幕
            if( config.getCheckboxSettingStatus('autoSubtitle') === ON ) subtitle() //自动开启字幕
            if( config.getCheckboxSettingStatus('autoOffListPlay') === ON && $(bb['playListAutoPlay']).find('.switch-btn').hasClass('on')) autooff_listplay() //自动关闭自动连播

            //双击或中键全屏
            dblclickFullScreen(config.getCheckboxSettingStatus('dblclickFullScreen'))

            //非全屏滚轮音量调节
            //两个参数指定屏幕范围（按百分比），第三个参数表示滚动一下增加的音量百分比，参数四表示暂停时是否调节
            //let args = config.getCheckboxSettingArgs('volumeControlWhenNonFullScreen')
            //wheel_volumeHint(config.getCheckboxSettingStatus('volumeControlWhenNonFullScreen'), args.screen_left,args.screen_rght,args.delta, config.getCheckboxSettingStatus('volumeControlWhenPause'));

            //滚轮调节弹幕透明度（ctrl），参数表示滚动一下增加的透明度百分比，默认5
            //wheel_opacity(config.getCheckboxSettingStatus('danmuOpacityControl'), 5)

            //因为遮挡弹幕，去掉全屏时鼠标悬停时产生的顶端mask
            removeVideoTopMask(config.getCheckboxSettingStatus('removeVideoTopMask'))

            //播放关灯，暂停开灯，跳过充电鸣谢，自动选择最高质量视频
            lightOffWhenPlaying(config.getCheckboxSettingStatus('lightOffWhenPlaying'))
            lightOnWhenPause(config.getCheckboxSettingStatus('lightOnWhenPause'))
            jumpElectric(config.getCheckboxSettingStatus('jumpElectric'))
            // auto_top_quality_video(config.getCheckboxSettingStatus('autoQualityVideo'))

            /*-----------------------------------
             *键盘控制
             *----------------------------------*/
            set_hotkey(config.getCheckboxSettingStatus('openHotKey'))

            /*设置界面
            //viewBox="10 8.5 10 12"
            $('.bilibili-player-video-danmaku-setting').clone(false,false).insertBefore($('#hhh_lightoff')).attr('id', 'hhh_setting')
            $('#hhh_setting>span>svg')[0].attributes[1].value = '10 8.5 10 12'
            $('#hhh_setting>span>svg>path:first').remove()
            */

            //段落循环
            loopPlayback(config.getCheckboxSettingStatus('loopPlayback'))

            //自定义倍速播放
            customPlayRate(config.getCheckboxSettingStatus('customPlayRate'), config.getCheckboxSettingArgs('customPlayRate')['rate'])

            //返回旧版
            //add_go_back()
            
            //动态隐藏biliMainHeader
            dynamic_hide_mainheader(config.getCheckboxSettingStatus('dynamicMainheader'))

            //延迟分享悬浮提示
            delay_share_hover_tip()

            //TEST INFO
            bpx_info()
            
            //log
            log(`[${video_ver}][${ver}][${video_type}]INIT加载完毕`)
        }

        //干净链接
        function clear_url(){
            const [path, query] = location.href.split('?')
            if(path.match(/BV\w+/)?.length === 1){
                const new_query = query?.match(/p=\d+/)?.[0]
                const href = new_query === undefined ? path : `${path}?${new_query}`
                history.replaceState(null,null, href)
            }
            return location.href
        }

        //段落循环
        function loopPlayback(open){
            /*
            bpx-player-progress-wrap
                hhh_loop_wrap
                    bpx-player-progress
                        bpx-player-progress-schedule-wrap    //进度条
                            bpx-player-progress-schedule
                                bpx-player-progress-schedule-buffer
                                bpx-player-progress-schedule-current
                        bpx-player-progress-point-wrap
                        bpx-player-progress-thumb
                        bpx-player-progress-move-indicator  //移动指示器
                        bpx-player-progress-popup           //预览
                            bpx-player-progress-preview
                                bpx-player-progress-preview-image
                                bpx-player-progress-preview-time     //进度时间框
                        bpx-player-progress-pull-indicator
                        bpx-player-progress-cursor
                        bpx-player-progress-scaleplate
                        hhh_loop_arrow_1
                        hhh_loop_arrow_2
                        hhh_loop_time_1
                        hhh_loop_time_2
            */
            let $progress_area = $('.bpx-player-progress-area');
            let $progress_wrap = $('.bpx-player-progress-wrap');
            let $progress = $('.bpx-player-progress');
            let $indeicator = $('.bpx-player-progress-move-indicator');
            let $popup = $('.bpx-player-progress-popup');
            let $down = $('.bpx-player-progress-move-indicator-down');
            let $up = $('.bpx-player-progress-move-indicator-up');
            let $ctrl_time_current = $('.bpx-player-ctrl-time-current');

            //监听视频窗口大小变化
            let ro = new ResizeObserver( entries => {
                for (let entry of entries) {
                    //更新loop位置
                    resize_updata();
                }
            });

            if(open !== ON) {
                $('#hhh_loop_wrap').off('mousedown.hhh_loop_wrap');
                $('#hhh_loop_wrap').off('mouseup.hhh_loop_wrap');
                $(document).off('keydown.hhh_document');
                $(document).off('keyup.hhh_document');
                $(document).off('mouseup.hhh_document');
                $('#hhh_loop_time_1, #hhh_loop_time_2').off('mouseenter.hhh_loop_time');
                $('#hhh_loop_time_1, #hhh_loop_time_2').off('mousedown.hhh_loop_time');
                ro.unobserve($(bb['video'])[0]);

                if($('#hhh_loop_wrap').length > 0) {
                    loop_state_switch(0);
                    ctrl_play_time();
                    $('#hhh_loop_wrap')[0].hhh_loop_state_switch = false;
                    $('#hhh_loop_time_1')[0].hhh_seconds = undefined;
                    $('#hhh_loop_time_2')[0].hhh_seconds = undefined;
                }
                return false;
            }
            //if($('#hhh_loop_wrap').length > 0) return true;
            if(bb_type.indexOf(BILI_3_X_VIDEO) === -1) return false;

            //保存arrow原color
            if(!$progress_area.attr('old_arrow_color')) $progress_area.attr('old_arrow_color', $down.css('border-top-color'));
            let old_arrow_color = $progress_area.attr('old_arrow_color');
            let new_arrow_color = '#FFA500';
            let is_begin = true;

            // Observe one or multiple elements
            //squirtle-video-time-now 2.X   bilibili-player-video-time-now 3.X
            ro.unobserve($(bb['video'])[0]);
            ro.observe($(bb['video'])[0]);

            //css
            $('#hhh_head_style').remove();  //test
            if($('#hhh_head_style').length<1){
                $progress_area.append(`<style id="hhh_head_style" type="text/css">
                .hhh-bpx-player-progress-popup {
                    position: absolute;
                    background-color: transparent;
                    border-radius: 2px;
                    overflow: hidden;
                    height: 30px;
                    cursor: w-resize;
                    margin-left: -18px;
                    bottom: 28px;
                }
                .hhh-bpx-player-progress-preview {
                    position: relative;
                    height: 30px;
                }
                .hhh-bpx-player-progress-preview-time {
                    position: absolute;
                    display: inline-block;
                    vertical-align: bottom;
                    padding: 0 5px;
                    left: 50%;
                    -webkit-transform: translateX(-50%);
                    transform: translateX(-50%);
                    font-size: 12px;
                    height: 18px;
                    line-height: 18px;
                    border-radius: 2px;
                    color: #fff;
                    background-color: rgba(21,21,21,.9);
                    top: 6px;
                }
                </style>`);
            }

            //更新位置
            function resize_updata(){
                let $p1 = $('#hhh_loop_time_1');
                let $p2 = $('#hhh_loop_time_2');
                let $bar = $('#hhh_loop_bar');
                if($p1.length !== 1 || $p2.length !== 1 && $bar.length !== 1) return;

                let t1 = $p1[0].hhh_seconds;
                let t2 = $p2[0].hhh_seconds;
                let id1 = $p1.attr('hhh_loop_arrow_id');
                let id2 = $p2.attr('hhh_loop_arrow_id');
                let rect = $progress[0].getBoundingClientRect();
                //let rect = $('.bilibili-player-video-progress')[0].getBoundingClientRect();
                let newleft = t1/h5Player.duration*rect.width;
                $p1.add($('#'+id1)).css('left', newleft);
                newleft = t2/h5Player.duration*rect.width;
                $p2.add($('#'+id2)).css('left', newleft);

                //log($p1.css('left'),$p2.css('left'));
                //log('------'+newleft);

                t1 = $p1.css('left').slice(0,-2);
                t2 = $p2.css('left').slice(0,-2);
                let begin = Math.min(t1,t2);
                let end = Math.max(t1,t2);
                $bar.css({left:begin, width:end-begin});
            }

            function show_loop_time(){
                //$popup.find('.bpx-player-progress-preview-image').hide();
            }
            function hide_loop_time(){
                //$popup.find('.bpx-player-progress-preview-image').show();
            }

            //更新
            function loop_update($hhh_loop_time, o){
                //function PrefixZero(num, n) { return (Array(n).join(0) + num).slice(-n) }
                //time = PrefixZero(Math.floor(time/60),2) + ':' + PrefixZero(time%60,2);
                let left = 0,
                    seconds = 0,
                    rect = $progress[0].getBoundingClientRect();
                    //rect2 = $progress_wrap[0].getBoundingClientRect();
                    //log(`rect_width: ${rect.width} - $progress.width(): ${$progress.width()}`);
                    //log(`rect2_width: ${rect2.width} - $progress_wrap.width(): ${$progress_wrap.width()}`);

                //get second
                if(o.left !== undefined){
                    left = o.left - rect.x;
                    if(left < 0 || left > rect.width) return $hhh_loop_time[0].hhh_seconds;
                    //Position To Time
                    seconds = Math.floor(left/rect.width*h5Player.duration);
                }else if(o.seconds !== undefined){
                    //Time To Position
                    left = o.seconds/h5Player.duration*rect.width;
                    if(left < 0 || left > rect.width) return $hhh_loop_time[0].hhh_seconds;
                    seconds = o.seconds;
                }else{ log('参数错误',o); return;}

                //updata left
                $hhh_loop_time.css({left:left, display:'block'});
                $("#"+$hhh_loop_time.attr('hhh_loop_arrow_id')).css({left:left, display:'block'});

                //updata time
                $hhh_loop_time[0].hhh_seconds = seconds;
                let time = sec2str(seconds);
                $hhh_loop_time.find('.hhh-bpx-player-progress-preview-time').text(time);

                //updata (width + margin-left)
                //log($('.bpx-player-progress-preview-time')[0].getBoundingClientRect())
                let width = $hhh_loop_time.find('.hhh-bpx-player-progress-preview-time')[0].getBoundingClientRect().width;
                $hhh_loop_time.find('.hhh-bpx-player-progress-preview').width(width);
                $hhh_loop_time.css('margin-left', `${-width/2}px`);

                //updata bar
                let s1 = $('#hhh_loop_time_1')[0].hhh_seconds;
                let s2 = $('#hhh_loop_time_2')[0].hhh_seconds;
                if(s1!==undefined && s2!==undefined){
                    let t1 = $('#hhh_loop_time_1').css('left').slice(0,-2);
                    let t2 = $('#hhh_loop_time_2').css('left').slice(0,-2);
                    let begin = Math.min(t1,t2);
                    let end = Math.max(t1,t2);
                    $('#hhh_loop_bar').css({display:'block', left:`${begin}px`, width:`${end-begin}px`});
                }

                return seconds;
            }

            function ctrl_play_time(){
                //time now
                function set_time() {
                    //log('time-current')
                    if($('#hhh_loop_wrap')[0].hhh_loop_state_switch && $('#hhh_loop_wrap')[0].hhh_loop_state_switch !== 0){
                        let t1 = $('#hhh_loop_time_1')[0].hhh_seconds;
                        let t2 = $('#hhh_loop_time_2')[0].hhh_seconds;
                        let begin = Math.min(t1,t2);
                        let end = Math.max(t1,t2);
                            //log(t1+' - '+t2);
                        if(h5Player.currentTime > end){
                            //log(t1+' - '+t2);
                            h5Player.currentTime = begin;
                        }
                    }
                }
                let s1 = $('#hhh_loop_time_1')[0].hhh_seconds;
                let s2 = $('#hhh_loop_time_2')[0].hhh_seconds;
                let is_bar = $('#hhh_loop_bar').css('display') !== 'none';
                //log(s1+' - '+s2+' - '+is_bar)
                if(s1!==undefined && s2!==undefined && is_bar){
                    $ctrl_time_current[0].removeEventListener('DOMNodeInserted', set_time);
                    $ctrl_time_current[0].addEventListener('DOMNodeInserted', set_time);
                }else{
                    $ctrl_time_current[0].removeEventListener('DOMNodeInserted', set_time);
                }
            }

            //loop显示状态切换
            function loop_state_switch(state){
                $('#hhh_loop_wrap')[0].hhh_loop_state_switch = state;
                let $p1 = $('#hhh_loop_time_1').add($('#hhh_loop_arrow_1')), $p2 = $('#hhh_loop_time_2').add($('#hhh_loop_arrow_2')), $bar = $('#hhh_loop_bar');
                if(state === 0){  //no loop
                    $p1.hide(), $p2.hide(), $bar.hide();
                }else if(state === 1){  //loop 1
                    if($p1[0].hhh_seconds) $p1.show();
                    if($p2[0].hhh_seconds) $p2.show();
                    if($p1[0].hhh_seconds && $p2[0].hhh_seconds) $bar.show();
                }else{  //loop 2
                    $p1.hide(), $p2.hide();
                    if($p1[0].hhh_seconds && $p2[0].hhh_seconds) $bar.show();
                }
            }

            /*---------------------------
            * 插入节点
            *--------------------------*/
            if($('#hhh_loop_wrap').length === 0){
                let progwrapclass = $progress_wrap.attr('class');
                //wrap append
                let $hhh_loop_wrap = $progress.wrap(`<div id="hhh_loop_wrap" class="${progwrapclass}" style="width:100%"></div>`).parent();
                //arrow append * 2
                $indeicator.clone(true,true).prependTo($progress).attr('id','hhh_loop_arrow_1').hide()
                                                                 .css({visibility:'visible', opacity:1})
                                                                 .find('.bpx-player-progress-move-indicator-up').remove().end()
                                                                 .find('.bpx-player-progress-move-indicator-down').css({'border-top-color':new_arrow_color}).end();
                $('#hhh_loop_arrow_1').clone(true,true).prependTo($progress).attr('id','hhh_loop_arrow_2');
                //preview-time append * 2
                $popup.clone(true,true).prependTo($progress_area).attr({'id':'hhh_loop_time_1', 'hhh_loop_arrow_id':'hhh_loop_arrow_1'})
                                                                 .addClass('hhh-bpx-player-progress-popup').removeClass('bpx-player-progress-popup').hide()
                                                                 .find('.bpx-player-progress-preview-image').remove().end()
                                                                 .find('.bpx-player-progress-hotspot').remove().end()
                                                                 .find('.bpx-player-progress-preview').addClass('hhh-bpx-player-progress-preview').removeClass('bpx-player-progress-preview').end()
                                                                 .find('.bpx-player-progress-preview-time').addClass('hhh-bpx-player-progress-preview-time').removeClass('bpx-player-progress-preview-time').end();
                $('#hhh_loop_time_1').clone(true,true).prependTo($progress_area).attr({'id':'hhh_loop_time_2', 'hhh_loop_arrow_id':'hhh_loop_arrow_2'});
                //schedule append
                $('.bpx-player-control-top').find('.bpx-player-progress-schedule-buffer:first').clone(true,true).appendTo($progress).css({transform:'scaleX(0.999999)'})  //配合其他transform，否则height不同，scaleX会改变height，bug？
                                                                                                                                    .css({background:'rgba(255,165,0,0.5)', display:'none'})
                                                                                                                                    .attr('id','hhh_loop_bar');
            }

            /*---------------------------
            * 事件
            *--------------------------*/
            //设置起点和终点
            $('#hhh_loop_wrap')[0].hhh_loop_time_id = false;
            $('#hhh_loop_wrap').off('mousedown.hhh_loop_wrap');
            $('#hhh_loop_wrap').off('mouseup.hhh_loop_wrap');
            $('#hhh_loop_wrap').on('mousedown.hhh_loop_wrap', function(e){
                if(e.ctrlKey === true){
                    return false
                }
            }).on('mouseup.hhh_loop_wrap', function(e){
                if(e.ctrlKey === true){
                    let $hhh_loop_time = is_begin? $('#hhh_loop_time_1'): $('#hhh_loop_time_2');
                    is_begin = !is_begin;
                    loop_update($hhh_loop_time, {left:e.pageX});

                    //$('.bilibili-player-video-toast-wrp').css('z-index', 0);
                    this.hhh_loop_time_id = $hhh_loop_time[0].id;

                    loop_state_switch(1);
                    ctrl_play_time();

                    return false;
                }else{
                    this.hhh_loop_time_id = false;
                }
            });

            //键盘 down
            $(document).off('keydown.hhh_document');
            $(document).on('keydown.hhh_document',function(e){
                if(e.keyCode === keycode['Ctrl']) {  //Ctrl
                    if($progress_wrap.hasClass('bpx-state-active') === true){  //隐藏(img + up)
                        $down.css('border-top-color', new_arrow_color);
                        $up.hide();
                        show_loop_time();
                    }
                    $('#hhh_loop_time_1, #hhh_loop_time_2').css({cursor: 'pointer'})  //代表可以点击time标签
                }else if(e.keyCode === keycode['left'] || e.keyCode === keycode['right']){  //键盘调整开始结束时间
                    if($('#hhh_loop_wrap')[0].hhh_loop_time_id !== false && $('#hhh_loop_time_1').css('display') !== 'none'){
                        toggle_control_top('show');
                        let $hhh_loop_time = $('#'+$('#hhh_loop_wrap')[0].hhh_loop_time_id);
                        let seconds = $hhh_loop_time[0].hhh_seconds;
                        e.keyCode === keycode['right'] ? ++seconds : --seconds;
                        loop_update($hhh_loop_time, {seconds:seconds});
                        return false;
                    }
                }else if(e.keyCode === 'L'.charCodeAt()){  //切换
                    if($('#hhh_loop_time_1')[0].hhh_seconds !== undefined){
                        toggle_control_top('show');
                        $('#hhh_loop_wrap')[0].hhh_loop_state_switch = ++$('#hhh_loop_wrap')[0].hhh_loop_state_switch % 3;
                        loop_state_switch($('#hhh_loop_wrap')[0].hhh_loop_state_switch);
                        ctrl_play_time();
                    }
                }
            });

            //键盘 up
            $(document).off('keyup.hhh_document');
            $(document).on('keyup.hhh_document',function(e){
                if(e.keyCode === 17) {  //Ctrl
                    $down.css('border-top-color', old_arrow_color);
                    $up.show();
                    hide_loop_time();
                    $('#hhh_loop_time_1, #hhh_loop_time_2').css({cursor: 'w-resize'})
                } else if(e.keyCode === keycode['left'] || e.keyCode === keycode['right']){  //段落循环
                    if($('#hhh_loop_wrap')[0].hhh_loop_time_id !== false){
                        //hide_loop_time();
                        return false;
                    }
                }
            });

            //判断当前鼠标点击焦点
            $(document).off('mouseup.hhh_document');
            $(document).on('mouseup.hhh_document', function(e){
                if(!e.ctrlKey && $('#hhh_loop_wrap').length > 0 && $('#hhh_loop_wrap')[0].hhh_loop_time_id) $('#hhh_loop_wrap')[0].hhh_loop_time_id = false;
            });

            //拖动确定范围
            $('#hhh_loop_time_1, #hhh_loop_time_2').off('mouseenter.hhh_loop_time');
            $('#hhh_loop_time_1, #hhh_loop_time_2').off('mousedown.hhh_loop_time');
            $('#hhh_loop_time_1, #hhh_loop_time_2').on('mouseenter.hhh_loop_time', function(){
                $(this).attr('in_dom', true);
            }).on('mouseleave.hhh_loop_time', function(){
                $(this).attr('in_dom', false);
            }).on('mousedown.hhh_loop_time', function(e){
                var $this = $(this);
                var doc = document;

                $this.css('z-index', 10000);  //当前的在上面

                if(e.ctrlKey){
                    loop_state_switch(0);
                    ctrl_play_time();
                }else{
                    loop_update($this, {left:e.clientX});

                    doc.onmousemove = function(e){
                        //log(e.clientX)
                        loop_update($this, {left:e.clientX});
                        return false;
                    };

                    doc.onmouseup = function(){
                        //清除事件
                        doc.onmousemove = null;
                        doc.onmouseup = null;
                        //hide_loop_time();

                        //$this.find('.bilibili-player-video-progress-detail-container').show();

                        $this.css('z-index', 'auto');
                        $('#hhh_loop_wrap')[0].hhh_loop_time_id = $this[0].id;
                        return false;
                    }
                }
            });
        }

        //增加当前在线视频预览
        function run_online_preview(open=ON){
            if(open !== ON) return false;
            if($('#hhh_online_list_style').length === 1) return true;

            function hide(parent, selector){
                var o = $();
                if($.isArray(selector) === true){
                    $.each(selector, function(i,v){
                        o = o.add(v);
                    })
                }else{
                    o = $(selector);
                }
                //显示及渐隐效果（抄bilibili^^）
                clearTimeout(parent.showHintTimer),
                    o.stop().show(),
                    parent.showHintTimer = window.setTimeout((function() {
                        o.animate({
                            opacity: 0
                        }, 600, (function() {
                            $(this).hide()
                        }))
                    }
                ), 0)
            }
            function show(parent, selector){
                var o = $();
                if($.isArray(selector) === true){
                    $.each(selector, function(i,v){
                        o = o.add(v);
                    })
                }else{
                    o = $(selector);
                }
                //显示及渐隐效果（抄bilibili^^）
                clearTimeout(parent.showHintTimer),
                    parent.showHintTimer = window.setTimeout((function() {
                        o.stop().show(),
                        o.animate({
                            opacity: 1
                        }, 600, (function() {
                            $(this).show()
                        }))
                    }
                ), 300)
            }
            if($('#hhh_online_list_style').length<1){
                $('.online-list').append(`<style id="hhh_online_list_style" type="text/css">
                    .hhh-preview-bg {
                        top: 12px;  /*硬编码，随时调整*/
                        z-index: 2;
                        height: 100%;
                    }
                    .hhh-preview-wrapper {
                        top: 0;
                        z-index: 4;
                        padding: 0 5px 5px;
                        box-sizing: border-box;
                        background-color: #000;
                    }
                    .hhh-preview-bg, .hhh-preview-wrapper {
                        position: absolute;
                        display: none;
                        left: 0;
                        width: 100%;
                    }
                    .hhh-preview-progress {
                        width: 100%;
                        height: 2px;
                        margin-top: 5px;
                        background-color: hsla(0,0%,100%,.4);
                        border-radius: 1px;
                    }
                    .hhh-preview-progress-bar {
                        width: 0;
                        height: 2px;
                        border-radius: 1px;
                        background-color: #fff;
                    }
                    </style>`);
            }
            var bvs = {},
                box_width = 0,
                bg_img_row = 0,
                bg_y_block_len = 0,
                bg_img_totle = 0;
            $('.online-list>.ebox>a>div').mouseenter(function(){
                this.state = 'enter';
                let $lazy_img = $(this);
                let bvid = $lazy_img.parent().attr('href').match(/BV\w+$/);
                bvid = bvid && bvid[0];
                this.bvid = bvid;
                if(bvs[bvid] === undefined){
                    bvs[bvid] = $lazy_img.parent().attr('title');
                    $.getJSON("https://api.bilibili.com/x/player/videoshot", { bvid: bvid, index: "1" },
                        function(json){
                            let bg_img = json.data.image[0];
                            box_width = $lazy_img.width();
                            bg_img_totle = json.data.index.length > (json.data.img_x_len*json.data.img_x_len)? (json.data.img_x_len*json.data.img_x_len): json.data.index.length;
                            bg_img_row = bg_img_totle < json.data.img_x_len? bg_img_totle: json.data.img_x_len;
                            bg_y_block_len = json.data.img_y_size/json.data.img_x_size*box_width;
                            bvs[bvid] = {box_width:box_width, bg_img_totle:bg_img_totle, bg_img_row:bg_img_row, bg_y_block_len:bg_y_block_len};

                            //log(bg_img_row+' - '+bg_img_totle+' - '+bg_y_block_len);
                            //log(bvs[bvid]);
                            $lazy_img.css({'overflow':'hidden', 'position':'relative'});
                            $lazy_img.append(`<div class="hhh-preview-bg"      style="background-position: 0px 0px; background-size: ${box_width*bg_img_row}px; background-image: url('${bg_img}');"></div>
                                              <div class="hhh-preview-wrapper" style="display: none; opacity: 1;"><div class="hhh-preview-progress"><div class="hhh-preview-progress-bar" style="width: 50%;"></div></div></div>
                                              <div class="hhh-preview-wrapper" style="display: none; opacity: 1; top:129px; height:20px"></div>`);  /*硬编码，随时调整*/
                            if($lazy_img[0].state === 'enter') show($lazy_img[0], [$lazy_img.find('.hhh-preview-bg'), $lazy_img.find('.hhh-preview-wrapper')], 'show');
                    });
                }else{
                    show($lazy_img[0], [$lazy_img.find('.hhh-preview-bg'), $lazy_img.find('.hhh-preview-wrapper')], 'show');
                }
            }).mouseleave(function(){
                this.state = 'leave';
                hide(this, [$(this).find('.hhh-preview-bg'), $(this).find('.hhh-preview-wrapper')], 'hide');
            }).mousemove(function(e){
                //log(this.bvid);
                let obv = bvs[this.bvid];
                let amounts = Math.floor(e.offsetX/(obv.box_width/obv.bg_img_totle));
                let x =  Math.floor(amounts % obv.bg_img_row) * -obv.box_width;
                x = Math.min(Math.max(x,-obv.box_width*(obv.bg_img_totle-1)),0);
                let y =  Math.floor(amounts/obv.bg_img_row) * -obv.bg_y_block_len;
                //log('---'+box_width+' - '+bg_img_totle);
                //log(e.offsetX+' - '+amounts+' - '+x+' - '+y+' - '+bg_y_block_len+' - '+Math.floor(amounts/bg_img_row));
                $(this).find('.hhh-preview-bg').css({'background-position':`${x}px ${y}px`});

                let w = Math.round(e.offsetX/obv.box_width*100);
                $(this).find('.hhh-preview-progress-bar').css({'width':`${w}%`});
            })
        }

        //动态首页直接显示隐藏content
        function run_content(open=ON){
            if(open !== ON){
                return false;
                //Test
                // eslint-disable-next-line no-unreachable
                if($('[hhh_has_content]').length){
                    let $major = $('.bili-dyn-content__orig__major');
                    let $content = $major.find('.bili-dyn-card-video__desc');
                    let $expand = $major.find('.bili-dyn-card-video_expand___hhh');
                    $content.removeClass('bili-dyn-card-video__desc___new_expand')
                            .removeClass('bili-dyn-card-video__desc___new_collapse');
                    $expand.add($content).off('click.hhh_content');
                    $expand.remove('.bili-dyn-card-video_expand___hhh');
                    $major.find('.bili-dyn-card-video').removeClass('bili-dyn-card-video___new');
                    $major.find('.bili-dyn-card-video__header').removeClass('bili-dyn-card-video__header___new');
                    $major.find('.bili-dyn-card-video__body').removeClass('bili-dyn-card-video__body___new');
                    $('[hhh_has_content]').removeAttr('hhh_has_content');
                }
                return false;
            }
            if($('[hhh_has_content]').length < $('.bili-dyn-content__orig__major').length){
                $('.bili-dyn-content__orig__major').each(function(){
                    let $major = $(this);
                    let $hhh_has_content = $major.find('[hhh_has_content]');
                    if($hhh_has_content.length >= 1) return true;
                    //$major.attr('hhh_has_content', true);

                    //log($hhh_has_content.length)

                    //隐藏弹幕，弹幕意义不大还遮挡窗口视频
                    $major.find($('.dyn-video-preview__danmaku')).hide()

                    //隐藏"投稿视频"，同样意义不大还遮挡窗口视频
                    if($major.find($('.bili-dyn-card-video__badge:contains(投稿视频)')).length === 1){
                        // log($major.text())
                        $major.find($('.bili-dyn-card-video__badge:contains(投稿视频)')).hide()
                    }

                    //新版“bili-dyn-card-video__stat”去掉position: absolute，使用默认值
                    $major.find('.bili-dyn-card-video__stat').css({'position': 'static'})

                    //显示隐藏标题
                    let $title = $major.find('.bili-dyn-card-video__title');
                    let padding_bottom = '24px';  //根据标题行数确定 .bili-dyn-card-video__stat 位置
                    if($title.length >= 1){
                        let font_size = $title.css('font-size');
                        let line_height = +font_size.match(/\d+/)[0] + 5;  //估算
                        let h = $title.removeClass('bili-dyn-card-video__title').css({'font-size':font_size}).height();
                        $title[0].style = "";
                        //log($title.text()+': '+line_height+' - '+h)
                        $title.addClass('bili-dyn-card-video__title');
                        if(h > line_height*2){
                            $title.attr('title', $title.text())
                        }
                        if(h > line_height){
                            padding_bottom = '10px';
                        }
                    }

                    //显示隐藏content
                    let $content = $major.find('.bili-dyn-card-video__desc');
                    if($content.length >= 1){
                        //console.log($content.text().slice(0,10)+ ' : ' +$content.height());
                        let line_height = $content.css('line-height');
                        //log($content.height());
                        let font_size = $content.css('font-size');
                        let h = $content.removeClass('bili-dyn-card-video__desc').css({'line-height':line_height, 'font-size':font_size}).height();
                        $content[0].style = "";
                        line_height = line_height.match(/\d+/)[0];
                        //log('---line_h:'+line_height+'  h: '+h+'  title: '+$major.find('.title').text());
                        $content.addClass('bili-dyn-card-video__desc');
                        $content.attr('hhh_has_content', true);

                        if(h > line_height*2){
                            // $major.find('.bili-dyn-card-video').height('auto');
                            // $major.find('.bili-dyn-card-video__body').css('display', 'block');
                            // $major.find('.bili-dyn-card-video__header').height(127);

                            if($('#hhh_content_style').length<1){
                                $major.append(`<style id="hhh_content_style" type="text/css">
                                    .bili-dyn-card-video___new {
                                        height: auto;
                                    }
                                    .bili-dyn-card-video__header___new {
                                        height: 127px;
                                    }
                                    .bili-dyn-card-video__body___new {
                                        display: block;
                                    }
                                    .bili-dyn-card-video__desc___new_expand {
                                        --padding-top: 8px;
                                        line-height: ${line_height}px;
                                        font-size: ${font_size};
                                        padding-top: var(--padding-top);
                                        height: auto;
                                        -webkit-box-orient: inline-axis;
                                    }
                                    .bili-dyn-card-video__desc___new_collapse {
                                        --padding-top: 8px;
                                        line-height: ${line_height}px;
                                        font-size: ${font_size};
                                        padding-top: var(--padding-top);
                                        height: calc(var(--padding-top) + ${line_height}px);
                                        -webkit-box-orient: vertical;
                                    }
                                    .bili-dyn-card-video_expand___hhh {
                                        color:#178bcf;
                                        font-size:12px;
                                        line-height:22px;
                                        display:block;
                                    }
                                    </style>`);
                            }
                            $major.find('.bili-dyn-card-video').addClass('bili-dyn-card-video___new');
                            $major.find('.bili-dyn-card-video__header').addClass('bili-dyn-card-video__header___new');
                            $major.find('.bili-dyn-card-video__body').addClass('bili-dyn-card-video__body___new');
                            $content.addClass('bili-dyn-card-video__desc___new_collapse');

                            // $content.css({'padding-top':'8px'});
                            // console.log(line_height);
                            // $content.css({'height': `${line_height}px`});
                            //let $expand = $(`<div style="color:#178bcf; font-size:12px; line-height:22px; display:block" onMouseOver="this.style.color='#00b5e5'" onMouseOut="this.style.color='#178bcf'">展开</div>`).insertAfter($content);
                            let $expand = $(`<div class="bili-dyn-card-video_expand___hhh" style="padding-bottom:${padding_bottom}" padding-bottom="${padding_bottom}" onMouseOver="this.style.color='#00b5e5'" onMouseOut="this.style.color='#178bcf'">展开</div>`).insertAfter($content);
                            $expand.add($content).off('click.hhh_content');
                            $expand.add($content).on('click.hhh_content', function(){
                            //$expand.add($content).click(function(){
                                if($expand.text() === '展开'){
                                    //console.log('=='+$content.height()+'==='+$content.css('line-height').match(/\d+/)[0]);
                                    //$content.css({height:'auto', '-webkit-box-orient':'inline-axis'});
                                    $content.removeClass('bili-dyn-card-video__desc___new_collapse').addClass('bili-dyn-card-video__desc___new_expand');
                                    $expand.css({'padding-bottom': '0px'});
                                    $expand.text('收起');
                                }else{
                                    //$content.height(line_height);
                                    //$content.css({'-webkit-box-orient':'vertical'});
                                    $content.removeClass('bili-dyn-card-video__desc___new_expand').addClass('bili-dyn-card-video__desc___new_collapse');
                                    $expand.css({'padding-bottom': $expand.attr('padding-bottom')});
                                    $expand.text('展开');
                                }
                                return false
                            });
                        }
                    }
                })
            }
        }

        //添加首页轮播 prev next slide （抄网易）
        function run_add_carousel_slide(){
            if(bb_type !== BILI_3_X_VIDEO) return false
            waitForTrue(()=> $('.rcmd-box-wrap').length === 1, () => {
                if($('.focus-carousel_hhh').length > 0) return false;
                let style = `<style type="text/css">
                    .hhh_slide_prev,.hhh_slide_next {
                        width: 35px;
                        height: 60px;
                        position: absolute;
                        display: block;
                        top: 50%;
                        margin-top: -40px;
                        overflow: hidden;
                        line-height: 999px;
                        background-image: url(https://static.ws.126.net/163/f2e/www/index20170701/images/sprite_img20211126.png);
                        background-repeat: no-repeat;
                        cursor: pointer;
                        z-index: 10;
                    }
                    .hhh_slide_prev {
                        left: -80px;
                        background-position: 0px -411px;
                        -webkit-transition: left 0.3s;
                        -moz-transition: left 0.3s;
                        -ms-transition: left 0.3s;
                        -o-transition: left 0.3s;
                        transition: left 0.3s;
                    }
                    .hhh_slide_prev:hover {
                        background-position: -99px -411px;
                    }
                    .hhh_slide_next {
                        right: -80px;
                        background-position: -49px -411px;
                        -webkit-transition: right 0.3s;
                        -moz-transition: right 0.3s;
                        -ms-transition: right 0.3s;
                        -o-transition: right 0.3s;
                        transition: right 0.3s;
                    }
                    .hhh_slide_next:hover {
                        background-position: -143px -411px;
                    }
                    .focus-carousel_hhh:hover .hhh_slide_prev {
                        left: 0px;
                    }
                    .focus-carousel_hhh:hover .hhh_slide_next {
                        right: 0px;
                    }
                </style>`;

                let $carousel = $('.focus-carousel');
                $carousel.append(style);
                $carousel.addClass('focus-carousel_hhh');
                let $prev = $(`<div class="hhh_slide_prev"></div>`).appendTo($carousel);
                let $next = $(`<div class="hhh_slide_next"></div>`).appendTo($carousel);

                //轮播效果
                $prev.on('click', function(){
                    if($carousel.find('.trigger span.on').index() === $carousel.find('.trigger span:first').index())
                        $carousel.find('.trigger span:last').click();
                    else
                        $carousel.find('.trigger span.on').prev().click();
                });
                $next.on('click', function(){
                    if($carousel.find('.trigger span.on').index() === $carousel.find('.trigger span:last').index())
                        $carousel.find('.trigger span:first').click();
                    else
                        $carousel.find('.trigger span.on').next().click();
                });
            });
        }

        //去掉首页插件提示
        function run_adblock_remove(){
            if(ver === BILI_3_X_VIDEO_V1 || ver === BILI_4_X_V1){
                $('.adblock-tips').remove()
            }
        }

        //首页添加观看列表
        function run_add_online(){
            let $box = $('.recommend-container__2-line');
            if($box.length !== 1) return;

            let $last_card = $box.children('.bili-video-card:visible:last');
            let left = $last_card.position().left;
            let width = $last_card.outerWidth();
            let $online_wrap = $('.bili-grid.short-margin.grid-anchor:last');

            $online_wrap.append(`<div id="hhh_online" style="position:absolute;left:${left}px"></div>`);
            $('#hhh_online').append($('#hhh_btn_num>button').clone().empty().css({width:`${width}px`, 'border-radius':'4px', background:'#f4f4f4', display:'flex', border:'1px solid #e7e7e7'})
                                                            .append(`<a href="//www.bilibili.com/video/online.html" target="_blank" style=" padding:6px; flex:1; transition:color .3s">观看列表</a>`));
let s = {'color': "var(--Ga1_t)"}
                                                            $('#hhh_online a').hover(function(){$(this).css('color','#00a1d6')}, function(){$(this).css({'color': "var(--Ga1_t)"})});
                                                            // $('#hhh_online a').hover(function(){$(this).css('color','#00a1d6')}, function(){$(this).css('color','#212121')});
        }

        //BILI_4_X_V1首页设置
        function run_homepage(){

            async function save_recommend_list_feed4(){
                
                if(ver !== BILI_4_X_V1) return false
    
                let $box_wrap = $('.recommended-container_floor-aside')
                let $box = $('.recommended-container_floor-aside>.container')
                let card_classname = '.feed-card'
                let box_data = [$box.clone()]
    
                let $rbtn = $('.feed-roll-btn:first');
                let $empty_rbtn = $rbtn.clone().empty();
    
                let h = $rbtn.outerHeight();
                let w = $rbtn.outerWidth();
    
                let $left  = $('.carousel-arrows').add($('.buttons.not-gray')).find('button:first')
                let $right = $('.carousel-arrows').add($('.buttons.not-gray')).find('button:last')
    
                let is_change_break = null;
                let curr_box_num = 0;

                //TEST
                // log('run_homepage Var:', $box_wrap, $box, $rbtn, $left, $right)
    
                //num
                $box_wrap.append($rbtn.clone().attr('id','hhh_btn_num').css({top:`${h+2}px`})
                                                                       .find('svg').remove().end()
                                                                       .find('span').remove().end()
                                                                       .find('button').css({cursor:'default', background:'var(--Ga1_t)', 'align-items':'center', 'border-radius':'8px'}).removeClass('primary-btn').append('1/1').end());

                //left
                let cbtn_h = $('#hhh_btn_num').outerHeight() + 3;
                $box_wrap.append($empty_rbtn.clone().attr('id','hhh_btn_zuo').css({top:`${h+1+cbtn_h}px`}).append($left.clone())
                                                                         .find('button').addClass('primary-btn roll-btn').css({'border-bottom':'0px', 'border-bottom-left-radius':'0px', 'border-bottom-right-radius':'0px'}).end()
                                                                         .find('svg').css({'margin-bottom':'1px'}).end());
                //right
                cbtn_h += $('#hhh_btn_zuo').outerHeight() - 1;
                $box_wrap.append($empty_rbtn.clone().attr('id','hhh_btn_you').css({top:`${h+1+cbtn_h}px`}).append($right.clone())
                                                                         .find('button').addClass('primary-btn roll-btn').css({'border-top':'0px', 'border-top-left-radius':'0px', 'border-top-right-radius':'0px'}).end()
                                                                         .find('svg').css({'margin-bottom':'1px'}).end());

                //left right - event
                function rbtn_event($lrtn){
                    $lrtn.click(function(){
                        //恢复前一个list
                        curr_box_num = this.id === 'hhh_btn_zuo'? Math.max(curr_box_num-1, 0): Math.min(curr_box_num+1, box_data.length-1);
                        $('#hhh_btn_num>button').text(`${curr_box_num+1}/${box_data.length}`);
                        $box.children(card_classname).each(function(i){
                            //log($(box_data[curr_box_num]).children(`.bili-video-card:eq(${i})`).attr('data-report'));
                            $(this).empty().append($(box_data[curr_box_num]).children(`${card_classname}:eq(${i})`).clone());
                        })
                        $('.bili-video-card__mask').has('.bili-video-card__stats--text:contains(广告)').css({background: 'black', opacity: 0.9})
                    })
                }
    
                rbtn_event($('#hhh_btn_zuo'));  //left
                rbtn_event($('#hhh_btn_you'));  //right
    
                //refresh - event
                $rbtn.click(()=>{
                    let ob = new MutationObserver((mutations, observer) => {
                        for (var mutation of mutations) {
                            let target = mutation.target
                            if(typeof target.className === 'string' && target.className === 'bili-video-card__image--wrap'){
                                clearTimeout(is_change_break)
                                ob.disconnect()
                                is_change_break = setTimeout(function() {
                                    //log("推荐页面刷新完毕")
                                    box_data.push($box.clone())
                                    // box_data.push($box.children(card_classname))
                                    // log(box_data)
                                    curr_box_num = box_data.length - 1
                                    $('#hhh_btn_num>button').text(`${box_data.length}/${box_data.length}`)
                                    $('.bili-video-card__mask').has('.bili-video-card__stats--text:contains(广告)').css({background: 'black', opacity: 0.9})
                                    //log(box_data.length)
                                }, 50)
                                break
                            }
                        }
                    })
                    ob.observe($box_wrap[0], { childList: true, subtree: true, /*attributes: true,*/ })
                })
            }

            function set_homepage_layout(){
                let column = +config.getCheckboxSettingKeyKey('homepageSetting', 'default')

                //layout
                let $box_wrap = $('.recommended-container_floor-aside')
                let cbtn_h = +$('#hhh_btn_you').position().top + $('#hhh_btn_you').outerHeight()
                // log(cbtn_h,typeof cbtn_h)
                let $hhh_btn_layout = $('.feed-roll-btn:first').clone().empty().attr('id', 'hhh_btn_layout')
                                                                               .css({'white-space': 'nowrap', 'top': `${cbtn_h+10}px`, 'padding': '3px', 'border-radius': '4px', 'background': 'var(--Ga1_t)', 'border': '1px solid var(--Ga2_t)'})
                $hhh_btn_layout.append(
                    `
                        <div>每行<input type="tel" min="1" max="9" value="${column}" placeholder="${column}" step="1" style="border-radius: 5px;text-align: center;margin-left: 1px;outline: none;text-decoration: none; background: var(--bg1); color: var(--text2);border: 1px solid rgba(0, 161, 214, 0.6);width: 13px;font-size: 14px;">个
                        </div>
                    `
                )
                $box_wrap.append($hhh_btn_layout)
                
                function change_layout(column){
                    let one_lines = column + 2,
                    first_column_card = (column + 1) * 2, //12
                    next_column_card = first_column_card + one_lines  //19

                    // log(column,one_lines,first_column_card, next_column_card)
    
                    $('#hhh_homepage_layout').remove()
                    append_style($('.recommended-container_floor-aside'), 'hhh_homepage_layout',
                        `
                            .recommended-container_floor-aside .container {
                                grid-template-columns: repeat(${one_lines},1fr) !important
                            }
                    
                            .recommended-container_floor-aside .container>*:nth-of-type(n + 0) {
                                margin-top: 0px !important
                            }
                    
                            .recommended-container_floor-aside .container>*:nth-of-type(n + ${first_column_card}) {
                                margin-top: 40px !important
                            }
                    
                            // .recommended-container_floor-aside .container>*:nth-of-type(n + ${next_column_card-1}) {
                            //     margin-top: 70px !important
                            // }
                    
                            .recommended-container_floor-aside .container>*:nth-of-type(n + ${next_column_card}) {
                                margin-top: 24px !important
                            }
                    
                            .recommended-container_floor-aside .container .feed-card {
                                display: block !important
                            }
                            
                        `
                    )
                }
                
                function num_input_event_init($num_input_dom){
                    let $input = $num_input_dom.find('input')
                    let $div = $num_input_dom.children('div')
                    //---change---
                    $input.off('change.hhh_num_input');
                    $input.on ('change.hhh_num_input', function(){
                        let column = +$(this).val()
                        config.setCheckboxSettingKeyKey('homepageSetting', 'default', column)
                        config.storageCheckboxSetting()

                        change_layout(column)
                    });

                    //---focus---
                    $input.off('focus.hhh_num_input')
                    $input.on ('focus.hhh_num_input', function(){
                        //---keydown stopPropagation on---
                        $('body').off('keydown.hhh_num_input');
                        $('body').on ('keydown.hhh_num_input', function(e){ e.stopPropagation() })
                        $(this).css({width: "36px"}).prop('type', 'number')
                    })
                    //---blur---
                    $input.off('blur.hhh_num_input')
                    $input.on ('blur.hhh_num_input', function(){
                        //---keydown stopPropagation off---
                        $('body').off('keydown.hhh_num_input')
                        $(this).prop('type', 'tel')
                        this.style.width = "13px"  //让 scrollWidth 获取最小值，达到回缩的效果
                    })

                    //---mouseenter、mouseleave---
                    $input.off('mouseenter.hhh_num_input')
                    $input.off('mouseleave.hhh_num_input')
                    $input.on ('mouseenter.hhh_num_input', function(){
                        let $this = $(this)
                        $this.css({width: "36px"}).prop('type', 'number')
                        let rect = this.getBoundingClientRect()
                        document.onmousemove = function(e){
                            let x = e.clientX
                            let y = e.clientY
                            if(x < rect.left || x > rect.right || y < rect.top || y > rect.bottom ){
                                $this.mouseleave()
                            }
                        }
                    }).on('mouseleave.hhh_num_input', function(){
                        document.onmousemove = null
                        if(this !== document.activeElement){
                            $(this).prop('type', 'tel')
                            this.style.width = "13px"  //让 scrollWidth 获取最小值，达到回缩的效果
                        }
                    })
                }

                change_layout(column)
                num_input_event_init($('#hhh_btn_layout'))
            }

            //新版首页添加观看列表
            function run_add_online_4X_V1(){
                let $box_wrap = $('.recommended-container_floor-aside')
                let cbtn_h = +$('.feed-roll-btn:last').position().top + $('.feed-roll-btn:last').outerHeight()
                
                let $online_wrap = $('.feed-roll-btn:first').clone().empty().attr('id', 'hhh_online')
                $box_wrap.append($online_wrap)

                $('#hhh_online').css({'white-space': 'nowrap', top: `${cbtn_h+10}px`, 'text-align': 'center', padding: '3px', 'border-radius':'4px', background:'#f4f4f4', border:'1px solid #e7e7e7'})
                                .append(`<a href="//www.bilibili.com/video/online.html" target="_blank" style=" padding:6px; flex:1; transition:color .3s">观看列表</a>`)
                $('#hhh_online a').hover(function(){$(this).css('color','#00a1d6')}, function(){$(this).css('color','#212121')})
            }

            //其他首页设置
            function other(){
                //广告遮黑
                $('.bili-video-card__mask').has('.bili-video-card__stats--text:contains(广告)').css({background: 'black', opacity: 0.9})
            }

            if(ver === BILI_4_X_V1){
                waitForTrue(()=>$('.recommended-swipe-body .carousel-arrows path').length > 0, ()=>{
                    save_recommend_list_feed4()
                    set_homepage_layout()
                    // run_add_online_4X_V1()
                    other()
                })
            }
        }

        //记忆首页推荐列表
        function run_save_recommend_list(open=ON){
            if(open !== ON) return false;
            if ($('.rcmd-box-wrap').length === 1) save_recommend_list_old();
            else if($('.bili-grid.short-margin.grid-anchor:first').length === 1) save_recommend_list_new();
            //else err('记忆首页推荐列表错误 - 找不到dom');
        }
        function save_recommend_list_old(){
            if($('#hhh_btn_num').length !== 0) return true;
            
            let $box_wrap = $('.rcmd-box-wrap');
            let $box = $('.rcmd-box');
            let box_data = [];
            let $cbtn = $('.change-btn');
            let h = $cbtn.outerHeight();
            let w = $cbtn.outerWidth();
            let curr_box_num = 0;

            //取得过滤器
            let filter = get_value('hhh_rcmd_filter', {})
            let filter_list = []
            let fresh_rcmd_list = [];

            load_card_box();

            //list-box left
            $('#elevator').css({left:`calc(50% + ${w+3+20}px)`});  //calc(50% + 3px);

            let $empty_cbtn = $cbtn.clone().empty();

            //num
            $box_wrap.append($empty_cbtn.clone().attr('id','hhh_btn_num').css({cursor:'default'})
                                                                         .css({height:'21px', 'line-height':'21px', top:`${h+2}px`})
                                                                         .css({padding:'0px', background:'#e2e2e2'}).append('1/1'))
            //left
            let cbtn_h = $('#hhh_btn_num').outerHeight() + 3;
            $box_wrap.append($empty_cbtn.clone().attr('id','hhh_btn_zuo').css({height:'auto', top:`${h+1+cbtn_h}px`})
                                                                         .css({'border-bottom':'0px', 'border-bottom-left-radius':'0px', 'border-bottom-right-radius':'0px'})
                                                                         .append('<i class="bilifont bili-icon_caozuo_xiangzuo"></i>'))
            //right
            cbtn_h += $('#hhh_btn_zuo').outerHeight() - 1;
            $box_wrap.append($empty_cbtn.clone().attr('id','hhh_btn_you').css({height:'auto', top:`${h+1+cbtn_h}px`})
                                                                         .css({'border-top':'0px', 'border-top-left-radius':'0px', 'border-top-right-radius':'0px'})
                                                                         .append('<i class="bilifont bili-icon_caozuo_xiangyou"></i>'))
            //button
            cbtn_h += $('#hhh_btn_you').outerHeight() + 10;
            $box_wrap.append($empty_cbtn.clone().attr('id','hhh_btn_remove_filter').css({height:'auto', top:`${h+1+cbtn_h}px`})
                                                .css({padding: '0px', border: '0px'})
                                                .append('<button style="cursor: pointer">重置</button>'))
                                                .find('button').css({padding: '2px'})

            function card_filter($card, filter){
                let BV = $card.find('a')[0].href.match(/BV\w+/)[0]  //取得BV号
                const [对钩, 叉叉] = ['bili-icon_caozuo_yitianjia', 'bili-icon_sousuo_yichu']
                let filter_value = filter[BV] === ON ? 对钩 : 叉叉
                //add filter
                $card.find('.hhh_filter').remove().end()
                    .prepend(
                        $card.find('.watch-later-video:first').clone()
                        .addClass('hhh_filter').css({top:'8px', 'background-image':'none'})
                        .find('.wl-tips').css({left:'-4px', display:'none'}).end()
                        .prepend($(`<i class="bilifont ${filter_value}" style="transform: scale(1.8);position: absolute;color: #fb7299;left: 7px;top: 8px;"></i>`).clone())
                    )
                
                if(filter_value === 对钩){
                    $card.find('.info-box').css({'background-image':'none', 'background-color':'black'})
                    $card.find('.info-box img').css({'opacity':0.2})
                }else{
                    $card.find('.info-box').css({'background-image':'', 'background-color':''})
                    $card.find('.info-box img').css({'opacity':''})
                }

                //event    
                $card.find('.hhh_filter').off('mouseover.hhh_filter').on('mouseover.hhh_filter', function(){
                    let $bilifont = $(this).find('i')
                    let $wl_tips = $(this).find('.wl-tips')
                    if($bilifont.hasClass(`bilifont ${叉叉}`)){
                        $wl_tips.text('点击屏蔽')
                        $wl_tips.css({left:`${($bilifont.width() - $wl_tips.width())/2}px`})
                    }else if($bilifont.hasClass(`bilifont ${对钩}`)){
                        $wl_tips.text('点击恢复')
                        $wl_tips.css({left:`${($bilifont.width() - $wl_tips.width())/2}px`})
                    }
                    $wl_tips.removeClass('van-watchlater-move-enter-active').addClass('van-watchlater-move-enter-active').show()
                }).off('mouseout.hhh_filter').on('mouseout.hhh_filter', function(){
                    $(this).find('.wl-tips').removeClass('van-watchlater-move-enter-active').hide()
                }).off('click.hhh_filter').on('click.hhh_filter', function(){
                    let $bilifont = $(this).find('i')
                    let $wl_tips = $(this).find('.wl-tips')
                    let $info_box = $(this).parent().find('.info-box')
                    let BV = $info_box.find('a')[0].href.match(/BV\w+/)[0]  //取得BV号
                    if($bilifont.hasClass(`bilifont ${叉叉}`)){
                        filter[BV] = ON
                        set_value('hhh_rcmd_filter', filter)
                        //log(get_value('hhh_rcmd_filter'))
                        $wl_tips.text('已屏蔽')
                        $wl_tips.css({left:`${($bilifont.width() - $wl_tips.width())/2}px`})
                        $bilifont.removeClass(`bilifont ${叉叉}`).addClass(`bilifont ${对钩}`)
                        $info_box.css({'background-image':'none', 'background-color':'black'})
                        $info_box.find('img').css({'opacity':0.2})
                    }else if($bilifont.hasClass(`bilifont ${对钩}`)){
                        delete filter[BV]
                        set_value('hhh_rcmd_filter', filter)
                        //log(get_value('hhh_rcmd_filter'))
                        $wl_tips.text('已恢复')
                        $wl_tips.css({left:`${($bilifont.width() - $wl_tips.width())/2}px`})
                        $bilifont.removeClass(`bilifont ${对钩}`).addClass(`bilifont ${叉叉}`)
                        $info_box.css({'background-image':'', 'background-color':''})
                        $info_box.find('img').css({'opacity':''})
                    }
                })
            }

            function cbtn_event($cbtn){
                $cbtn.click(function(){
                    //激活动画
                    let $i = $(this).find('i');
                    $i.addClass('active');
                    setTimeout(function(){ $i.removeClass('active') },500);
                    //恢复前一个list
                    curr_box_num = this.id === 'hhh_btn_zuo'? Math.max(curr_box_num-1, 0): Math.min(curr_box_num+1, box_data.length-1);
                    $('#hhh_btn_num').text(`${curr_box_num+1}/${box_data.length}`);
                    $box.find('.video-card-reco').each(function(i){
                        $(this).empty().append($(box_data[curr_box_num]).find('.video-card-reco:eq('+i+')>div').clone());
                        card_filter($(this), filter)
                    })
                })
            }

            cbtn_event($('#hhh_btn_zuo'));  //left
            cbtn_event($('#hhh_btn_you'));  //right

            //refresh
            $cbtn.click(()=>{
                $box_wrap[0].addEventListener('DOMSubtreeModified', function fn_(e) {
                    let eve_this = this;
                    if(typeof e.target.className === 'string' && e.target.className === $box.attr('class')){
                        //最后一个class
                        if($box.find('.video-card-reco').length === 10){
                            eve_this.removeEventListener('DOMSubtreeModified', fn_);                            
                            load_card_box()
                        }
                    }
                })
            })
            
            //重置
            $box_wrap.find('#hhh_btn_remove_filter').click(()=>{
                let box = new hhh_box()
                box.create({target: $('#hhh_btn_remove_filter button'), color: '#00b5e5', text: '是否清空屏蔽列表', gap: 8,
                    enter_fn: ()=>{
                        const json_filter = JSON.parse(localStorage.getItem('hhh_rcmd_filter'))
                        log(Object.keys(json_filter).length)
                        log(json_filter)

                        localStorage.removeItem('hhh_rcmd_filter')
                        filter = {}
                        $box.find('.video-card-reco').each(function(){
                            card_filter($(this), filter)
                        })
                    }
                })
            }).mouseenter(function(){
                const json_filter = JSON.parse(localStorage.getItem('hhh_rcmd_filter'))
                $(this).attr('title', `已屏蔽${Object.keys(json_filter).length}个`)
            })

            function load_card_box(){
                //hhh_rcmd_filter = {BVxxx: ON, BVxxx2: ON}
                //使用过滤器（BV号判断）过滤card数据，过滤后的数据
                $box.find('.video-card-reco').each(function(i){
                    let BV = $(this).find('a')[0].href.match(/BV\w+/)[0]  //取得BV号
                    if(filter[BV] === ON){  //对比BV号过滤
                        //log(BV)
                        filter_list.push(i)
                    }
                    //filter[BV] = ON
                })
                //set_value('hhh_rcmd_filter', filter)

                // filter_list = []
                // filter_list.push(Math.floor(Math.random() * (9 - 0 + 1) ) + 0)
                // filter_list.push(Math.floor(Math.random() * (9 - 0 + 1) ) + 0)
                //log('filter_list', filter_list)

                function get_fresh_rcmd(){
                    let items
                    $.ajax({
                        url: "https://api.bilibili.com/x/web-interface/index/top/rcmd?fresh_type=0&fresh_idx=0&fresh_idx_1h=0&homepage_ver=0",
                        type: "GET",
                        xhrFields: {
                            withCredentials: true
                        },
                        crossDomain: true,
                        async: false,
                        timeout: 1,
                        success: function (data) {
                            items = data.data.item
                            //log(data.data);
                        }
                    });
                    return items
                }
                    
                function set_card($card, item){
                    $card.find('.info-box a')[0].href = item.uri
                    $card.find('.info-box a img')[0].src = item.pic.split(/https*:/)?.[1] + '@412w_232h_1c.webp'
                    $card.find('.info-box a img')[0].alt = item.title
                    $card.find('.info-box a .info .title')[0].title = item.title
                    $card.find('.info-box a .info .title').text(item.title)
                    $card.find('.info-box a .info .up').contents()[1].nodeValue = item.owner.name
                    $card.find('.info-box a .info .play').text(item.stat.view >= 10000 ? (item.stat.view/10000).toFixed(1)+'万播放' : item.stat.view+'播放')
                }

                //如果发现需过滤BV，读取新rcmd填充
                if(filter_list.length !== 0){
                    //ajax读取rcmd填充
                    while(filter_list.length > fresh_rcmd_list.length){
                        let new_rcmd_list = get_fresh_rcmd()
                        new_rcmd_list = new_rcmd_list.filter((v)=>{ return filter[v.bvid] !== ON })
                        fresh_rcmd_list.push(...new_rcmd_list)
                    }

                    let $card_clone = $box.find('.video-card-reco:eq(0)').clone()    
                    for(let i of filter_list){
                        let $card = $('.rcmd-box .video-card-reco').eq(i)
                        $card.empty().append( $card_clone.find('>*').clone() )  // 去掉watch-later-video van-watchlater black [click]，由于稍后再看保存旧card内容，不去掉的话会错乱
                        let item = fresh_rcmd_list.shift()
                        set_card($card, item)
                    }
                }
                
                box_data.push($box.clone());
                curr_box_num = box_data.length - 1;
                $('#hhh_btn_num').text(`${box_data.length}/${box_data.length}`);
                if(box_data.length >= 10){ $('#hhh_btn_num').css({width:'37px', right:'-41px'}) }

                $box.find('.video-card-reco').each(function(){
                    card_filter($(this), filter)
                })
            }
        }
        function save_recommend_list_new(){
            if($('#hhh_btn_num').length !== 0) return true;

            let $box_wrap = $('.bili-grid.short-margin.grid-anchor:first');
            let $box = $('.recommend-container__2-line');
            let box_data = [$box.clone()];
            let $rbtn = $('.roll-btn-wrap');
            let $empty_rbtn = $rbtn.clone().empty();
            let h = $rbtn.outerHeight();
            let w = $rbtn.outerWidth();
            let $left = $('.buttons.not-gray').find('button:first');
            let $right = $('.buttons.not-gray').find('button:last');
            let is_change_break = null;
            let curr_box_num = 0;

            //palette-button left
            waitForTrue(()=> $('.palette-button-wrap').length === 1, () => {
                $('.palette-button-wrap').css({left:`calc(100% + ${w+10}px)`});  //calc(100% + 0px);
            });

            //num
            $box_wrap.append($rbtn.clone().attr('id','hhh_btn_num').css({top:`${h+2}px`})
                                                                   .find('svg').remove().end()
                                                                   .find('span').remove().end()
                                                                   .find('button').css({cursor:'default', background:'#e2e2e2', 'align-items':'center', 'border-radius':'8px'}).removeClass('primary-btn').append('1/1').end());
            //left
            let cbtn_h = $('#hhh_btn_num').outerHeight() + 3;
            $box_wrap.append($empty_rbtn.clone().attr('id','hhh_btn_zuo').css({top:`${h+1+cbtn_h}px`}).append($left)
                                                                     .find('button').addClass('primary-btn roll-btn').css({'border-bottom':'0px', 'border-bottom-left-radius':'0px', 'border-bottom-right-radius':'0px'}).end()
                                                                     .find('svg').css({'margin-bottom':'1px'}).end());
            //right
            cbtn_h += $('#hhh_btn_zuo').outerHeight() - 1;
            $box_wrap.append($empty_rbtn.clone().attr('id','hhh_btn_you').css({top:`${h+1+cbtn_h}px`}).append($right)
                                                                     .find('button').addClass('primary-btn roll-btn').css({'border-top':'0px', 'border-top-left-radius':'0px', 'border-top-right-radius':'0px'}).end()
                                                                     .find('svg').css({'margin-bottom':'1px'}).end());
            //left right - event
            function rbtn_event($rbtn){
                $rbtn.click(function(){
                    //恢复前一个list
                    curr_box_num = this.id === 'hhh_btn_zuo'? Math.max(curr_box_num-1, 0): Math.min(curr_box_num+1, box_data.length-1);
                    $('#hhh_btn_num>button').text(`${curr_box_num+1}/${box_data.length}`);
                    $box.children('.bili-video-card').each(function(i){
                        //log($(box_data[curr_box_num]).children(`.bili-video-card:eq(${i})`).attr('data-report'));
                        $(this).empty().append($(box_data[curr_box_num]).children(`.bili-video-card:eq(${i})`).clone());
                    })
                })
            }

            rbtn_event($('#hhh_btn_zuo'));  //left
            rbtn_event($('#hhh_btn_you'));  //right

            //refresh - event
            $rbtn.click(()=>{
                $box_wrap[0].addEventListener('DOMSubtreeModified', function fn_(e) {
                    let eve_this = this;
                    if(typeof e.target.className === 'string' && e.target.className === 'bili-video-card__image--wrap'){
                        clearTimeout(is_change_break);
                        is_change_break = setTimeout(function() {
                            //log("推荐页面刷新完毕");
                            eve_this.removeEventListener('DOMSubtreeModified', fn_);
                            //eve_this.removeEventListener('DOMSubtreeModified', arguments.callee);
                            box_data.push($box.clone());
                            curr_box_num = box_data.length - 1;
                            $('#hhh_btn_num>button').text(`${box_data.length}/${box_data.length}`);
                            //log(box_data.length)
                        }, 50);
                    }
                })
            });
        }

        //新窗口打开自动连播列表视频
        function run_rec_list_newtab(open){
            $('.rec-list .video-page-card').each(function(){
                if(open === ON){
                    let $a = $(this).find('.info a:first').attr('target',"_blank");
                    let $span = $(this).find('.info span');
                    $span.clone().prependTo($a).attr('hhh_new', true);
                    $span.hide();
                }else{
                    $(this).find('.info span[hhh_new]').remove();
                    $(this).find('.info span').show();
                }
            })
        }

        //全屏时显示投币、收藏对话框等
        function set_dialog(type, classname) {
            //log('set_dialog:'+classname)
            if(type === 'coin'){  //投币对话框
                //log('coin')
                let is_Dlg_exist = classname.includes('teleport') === true
                //harmony-font header-v2 win webscreen-fix
                //let is_coin_over = classname.includes('header-v2 win webscreen-fix') === true
                if(is_Dlg_exist === true){
                    if($('.coin-operated-m-exp').length <= 0){
                        //log('off')
                        $(document).off('keydown.hhh_coin')
                        return false
                    }
                    //jquery查找节点A，他的父节点是B

                    //log('--set_dialog 1--')  bili-dialog-m
                    // TODO: 全屏时显示
                    // $('.bili-dialog-m').appendTo('.bpx-player-container');
                    // $('.bili-dialog-m').find('.coin-bottom').css('line-height', 1.5);
                    let $biliDlgM = $('.bili-dialog-m').has('.coin-operated-m-exp')
                    if($biliDlgM.length === 1){
                        //网页全屏时显示
                        let z_index = +$('#bilibili-player').css('z-index');
                        !isNaN(z_index) && $(bb['biliDlgM']).css('z-index', z_index+1);
                        !isNaN(z_index) && $('.bili-msg').css('z-index', z_index+1);  //硬币不足 提示
                        //键盘事件
                        $(document).off('keydown.hhh_coin')
                        $(document).on('keydown.hhh_coin', function(e){
                            if(e.keyCode === keycode['left']){
                                $('.left-con').click();
                            }else if(e.keyCode === keycode['right']){
                                $('.right-con').click();
                            }else if(e.keyCode === keycode['Enter']){
                                let c_num = $('.mc-box.on').text()
                                $(bb['coinDlgOkBtn']).click()
                                //$(bb['coinDlgCloseBtn']).click()
                                showHint(document, '#hhh_wordsHint', `投币成功 ${$('.video-coin-info:first').text()}+${c_num}`, 2e3)
                            }else if(e.keyCode === keycode['Esc']){
                                log(11111111)
                                $(bb['coinDlgCloseBtn']).click()
                            }
                            return false
                        })
                    }
                }else if(classname === 'hhh_test_coin'){
                    //log('--set_dialog 2--');
                    if($(bb['coin']).filter('[title="对本稿件的投币枚数已用完"]').length > 0 && $('.van-message').length > 0){
                        showHint(document, '#hhh_wordsHint', '对本稿件的投币枚数已用完');
                    }
                }
            }
        }

        //合集列表关键字过滤
        function list_filter(open = ON){
            // log('---list_filter---')
            $('#hhh_list_input').remove()

            let $list_card = $('.video-pod__list>div').add('.action-list-inner .action-list-item-wrap')

            $list_card.show()

            if($list_card.length < 1) return

            if(['视频选集', '合集', '收藏列表'].includes(video_type) === false) return

            if(open === OFF) return

            // let is_dark = true
            // let list_input_div = `<div id="hhh_list_input" dark=${is_dark}>
            let list_input_div = `<div id="hhh_list_input" class = "">
                                    <div style="
                                        display: flex;
                                        align-items: center;
                                        justify-content: space-between;
                                        width: 75%;
                                        padding-left: 10px;
                                        padding-right: 10px;
                                    ">
                                        <input type="text" class="nav-search-input" maxlength="40" placeholder="按标题关键字筛选">
                                        <div class="nav-search-clean">
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M8 14.75C11.7279 14.75 14.75 11.7279 14.75 8C14.75 4.27208 11.7279 1.25 8 1.25C4.27208 1.25 1.25 4.27208 1.25 8C1.25 11.7279 4.27208 14.75 8 14.75ZM9.64999 5.64303C9.84525 5.44777 10.1618 5.44777 10.3571 5.64303C10.5524 5.83829 10.5524 6.15487 10.3571 6.35014L8.70718 8.00005L10.3571 9.64997C10.5524 9.84523 10.5524 10.1618 10.3571 10.3571C10.1618 10.5523 9.84525 10.5523 9.64999 10.3571L8.00007 8.70716L6.35016 10.3571C6.15489 10.5523 5.83831 10.5523 5.64305 10.3571C5.44779 10.1618 5.44779 9.84523 5.64305 9.64997L7.29296 8.00005L5.64305 6.35014C5.44779 6.15487 5.44779 5.83829 5.64305 5.64303C5.83831 5.44777 6.15489 5.44777 6.35016 5.64303L8.00007 7.29294L9.64999 5.64303Z" fill="#C9CCD0">
                                                </path>
                                            </svg>
                                        </div>
                                    </div>
                                    <span style="color:#999999; font-size:14px"></span>
                                </div>`;
            
            if($('#hhh_list_input').length === 0){
                //插入Node
                $('.rcmd-tab, .action-list-container').before($(list_input_div))
                //提示
                tip_create_3_X({ target: $('#hhh_list_input'), tip_target: $('#hhh_tip'), gap: 6,
                                 title: `默认支持或与非(space、|、!)和通配符(*、?)的简单搜索，例子：杨丞琳 雨。可使用前缀字符开启功能 —— =原始字符串、#正则表达式、@标题字数，例子：#第.+集，@12` })
                //插入CSS
                append_style($('#hhh_list_input'), 'hhh_list_input_style',
                    `
                        #hhh_list_input {
                            display: flex;
                            align-items: center;
                            background: var(--bg1);
                            height: auto;
                            line-height: 2px;
                            border: 1px solid var(--line_regular);
                            border-radius: 4px;
                            top: 20%;
                            margin-top: 3px;
                            margin-bottom: 2px;
                            margin-left: 1px;
                            margin-right: 1px;
                            pointer-events: all
                        }
                        #hhh_list_input .nav-search-input {
                            flex: 1;
                            overflow: hidden;
                            background-color: transparent;
                            padding-right: 5px;
                            border: none;
                            box-shadow: none;
                            color: var(--text2);
                            font-size: 12px;
                            outline: none;
                            height: 28px
                        }
                        #hhh_list_input .nav-search-clean {
                            width: 16px;
                            height: 16px;
                            right: 10px;
                            visibility: hidden
                        }
                        #hhh_list_input .nav-search-clean svg {
                            position: absolute;
                            color: var(--graph_weak)
                        }
                        #hhh_list_input .nav-search-clean:hover svg path {
                            fill: var(--graph_icon)
                        }
                        #hhh_list_input .nav-search-clean.has-keyword {
                            cursor: pointer;
                            visibility: inherit
                        }
                    `
                )
            
                $('#hhh_list_input input').off('input.hhh_list')
                $('#hhh_list_input input').on('input.hhh_list',function(e, is_backfill=false){
                    let input_text_all = $(this).val()

                    $('.video-pod__list').add('.action-list-inner')[0].hhh_list_filter_val = input_text_all

                    let $list_card = $('.video-pod__list>div').add('.action-list-inner .action-list-item-wrap')
                    $list_card.each(function(){
                        let $this = $(this)
                        if(!input_text_all) { $this.show(); return }
                        
                        let first = '&'  //默认与或非和通配符的简单实现
                        let input_text = input_text_all
                        if(input_text.length > 1 && '&#@='.includes(input_text[0])){  //第一个字符是&、#、@、=
                            // log('input_text.lengt:',input_text.length)
                            first = input_text[0]
                            input_text = input_text.slice(1)
                        }

                        function simple_find(txt, query){
                            // let txt = 'Spirit VS MOUZ-玩'.toUpperCase()
                            // let query = 'aa !bb|cc|d*d E? |a f';
                            // query = 'a|spirit 玩'
                            // query = query.trim().toUpperCase()
                            query = query.replace(/\?+/g, '.??')
                            query = query.replace(/\*+/g, '.*?')
                            // console.log(query)
                            let or_arr = query.split(/\|+/);
                            or_arr.forEach((v,i)=>{
                                let and_arr = v.trim().split(/\s+/)
                                //console.log('1--', and_arr)
                                and_arr.forEach((v2,i2)=>{
                                    if(v2[0] === '!'){
                                        //console.log(v2)
                                        and_arr[i2] = v2.length === 1 ? RegExp(v2).test(txt) : !RegExp(v2.slice(1)).test(txt)
                                    }else{
                                        //console.log(v2)
                                        and_arr[i2] = RegExp(v2).test(txt)
                                    }
                                })
                                // console.log('2--', and_arr)
                                or_arr[i] = !and_arr.includes(false)
                            })
                            // console.log('===', or_arr)
                            // console.log(or_arr.includes(true))
                            let ret = or_arr.includes(true)
                            return ret
                        }

                        let is_show = false
                        let list_text = $this.text().trim()
                        if(first === '&'){ //与或非和通配符的简单实现
                            is_show = simple_find(list_text.toUpperCase(), input_text.toUpperCase())
                        }else if(first === '#'){ //正则表达式
                            //const regex = new RegExp(input_text, 'i')
                            // log('###',input_text,list_text.match(regex),list_text)
                            is_show = RegExp(input_text, 'i').test(list_text)
                        }else if(first === '@'){ //字数相同
                            let title = $this.find('.title').attr('title')
                            // log('@@@', title, title.length, input_text)
                            is_show = title.length === +input_text
                        }else if(first === '='){ //纯文本
                            is_show = list_text.toUpperCase().indexOf(input_text.toUpperCase()) !== -1
                        }

                        if(is_show === true) {
                            $this.show()
                        }else{
                            $this.hide()
                        }
                    })

                    //回到首行位置
                    if(is_backfill === false) $('.video-pod__body, #playlist-video-action-list').scrollTop(0)

                    //更新过滤计数
                    if(!!input_text_all){
                        $('#hhh_list_input .nav-search-clean').addClass('has-keyword')
                        $('#hhh_list_input').find('span:first').
                        text(`过滤${$('.video-pod__list>div:visible').add('.action-list-inner .action-list-item-wrap:visible').length}个`)
                    }else{
                        $('#hhh_list_input .nav-search-clean').removeClass('has-keyword')
                        $('#hhh_list_input').find('span:first').text('')
                    }
                })

                // 清空输入框
                $('#hhh_list_input .nav-search-clean').off('click.hhh_list')
                $('#hhh_list_input .nav-search-clean').on('click.hhh_list',function(){
                    $('#hhh_list_input input').val('')
                    $('#hhh_list_input input').trigger('input')
                })

                //过滤值回填
                if($('.video-pod__list').add('.action-list-inner')[0].hhh_list_filter_val !== ''){
                    $('#hhh_list_input input').val($('.video-pod__list').add('.action-list-inner')[0].hhh_list_filter_val)
                    $('#hhh_list_input input').trigger('input', [true])
                }
            }
        }

        //添加到收藏夹关键字过滤（video wrap） collection-m-exp coin-operated-m-exp
        function collection_filter(open=ON){
            if($('.collection-m-exp').length <= 0) return false
            $(document).off('keydown.hhh_coin')
            if(open !== ON){
                $('.bili-dialog-m .title')[0].style['padding-left'] = '';
                $('#hhh_collection_input').off('input.hhh_collection');
                $('#hhh_collection_input').parent().remove();
                return false;
            }

            let collection_div = `<div style="
                                    height: auto;
                                    line-height: 2px;
                                    border: 1px solid #00a1d6;
                                    border-radius: 4px;
                                    position: absolute;
                                    top: 20%;
                                    left: 3%;
                                "><input id="hhh_collection_input" type="text" maxlength="20" placeholder="收藏夹关键字筛选" style="
                                    border: none;
                                    font-size: 12px;
                                    width: 170px;
                                    margin-left: 5px;
                                    padding: 0;
                                    box-shadow: none;
                                    height: 28px;
                                    outline: none;
                                    border-radius: 0 4px 4px 0;
                                    background: inherit;
                                ">
                                </div>`;
            if($('#hhh_collection_input').length === 0){
                $(collection_div).prependTo($('.bili-dialog-m .title').css('padding-left', '150px'))
                
                // log('collection_filter')
                // $('#hhh_collection_input')[0].dispatchEvent( new MouseEvent('mousedown') )
                // $('.bpx-player-video-wrap')[0].dispatchEvent( new MouseEvent('click') )

                setTimeout(() => {
                    //$('.group-list').find(':contains(排行榜)').parent()[0].dispatchEvent( new MouseEvent('click') )
                    $('#hhh_collection_input').focus()
                    //$('.group-list').find(':contains(排行榜)').parent().click()
                }, 0);

                $('#hhh_collection_input').off('input.hhh_collection')
                $('#hhh_collection_input').on('input.hhh_collection',function(){
                    let val = $(this).val();
                    $('.content li').each(function(){
                        if(!val) {
                            $(this).css('display','block');
                            return;
                        }
                        if($(this).find('.fav-title').text().toUpperCase().indexOf(val.toUpperCase()) !== -1) {
                            $(this).css('display','block');
                        }else{
                            $(this).css('display','none');
                        }
                    })
                })

                $('#hhh_collection_input').off('keydown.hhh_collection')
                $('#hhh_collection_input').on('keydown.hhh_collection',function(e){
                    if(e.key === 'Escape'){
                        $('.bili-dialog-m .close').click()
                    }
                })

                if(is_fullscreen() === true){
                    let z_index = +$('#bilibili-player').css('z-index')
                    $(bb['biliDlgM']).css('z-index', z_index+1)
                }
            }
        }

        //添加到收藏夹关键字过滤 collection-m-exp coin-operated-m-exp
        function collection_filter2(open=ON){
            if(open !== ON){
                $('#hhh_collection_input').off('input.hhh_collection')
                $('#hhh_collection_input').parent().remove()
                return false
            }
            
            let collection_div = `<div style="
                                    height: auto;
                                    line-height: 2px;
                                    border: 1px solid #f25d8e;
                                    border-radius: 4px;
                                    position: relative;
                                    top: 20%;
                                    margin-top: 3px;
                                    margin-bottom: 2px;
                                    margin-left: 1px;
                                    margin-right: 1px;
                                "><input id="hhh_collection_input" type="text" maxlength="20" placeholder="收藏夹关键字筛选" style="
                                    border: none;
                                    font-size: 12px;
                                    width: 170px;
                                    margin-left: 5px;
                                    padding: 0;
                                    box-shadow: none;
                                    height: 28px;
                                    outline: none;
                                    border-radius: 0 4px 4px 0;
                                    background: inherit;
                                ">
                                </div>`;
            if($('#hhh_collection_input').length === 0){
                let $fav_list = $('.vui_collapse .fav-sortable-list')
                $fav_list.before($(collection_div))

                setTimeout(() => {
                    //$('.group-list').find(':contains(排行榜)').parent()[0].dispatchEvent( new MouseEvent('click') )
                    $('#hhh_collection_input').focus()
                    //$('.group-list').find(':contains(排行榜)').parent().click()
                }, 0);

                $('#hhh_collection_input').off('input.hhh_collection')
                $('#hhh_collection_input').on('input.hhh_collection',function(){
                    let val = $(this).val()
                    $fav_list.find($('.fav-sidebar-item')).each(function(i){
                        // log(val)
                        if(!val) {
                            $(this).css('display','block');
                            return;
                        }
                        if($(this).find('.vui_sidebar-item-title').text().toUpperCase().indexOf(val.toUpperCase()) !== -1) {
                            $(this).css('display','block');
                        }else{
                            $(this).css('display','none');
                        }
                    })
                })

            }

            return true
        }

        //调整收藏夹长度/行高 & 添加收藏夹关键字过滤
        function run_fav(open){
            if(open === ON){
                //vui_collapse
                //vui_collapse_item_content
                // append_style($('#page-fav .fav-sidenav'), 'hhh_fav_sidenav_style',
                //     `
                //         #page-fav .fav-sidenav .text {
                //             line-height: initial!important
                //         }
                //         .be-dropdown-menu {
                //             margin-top: -10px
                //         }
                //     `
                // )
                // let $fav_list_li = $('#fav-createdList-container .fav-list li:first')
                // let length = $fav_list_li.height()
                // $('#fav-createdList-container').css('max-height', `${length*30}px`)
                $('.fav-collapse-wrap').css('max-height', '800px')
                $('.vui_sidebar-item').css('height', '0px')
                collection_filter2()
            }else{
                //let max_height = parseInt($('#fav-createdList-container').css('max-height'));
                //$('#fav-createdList-container').css('max-height', `${max_height/2}px`);
            }
        }

        //未使用
        function run_history(){
            $.get("https://api.bilibili.com/x/web-goblin/history/search", { pn:"1", keyword: "12", business: "all" },
                function(json){
                    console.log(json)
            });
        }

        function run_events_listener(event, fn_obj){
            // log(`---hhh_${event}_runfn---`, fn_obj)
            h5Player.removeEventListener(event, h5Player[`hhh_${event}_runfn`], true)

            if(fn_obj === null){
                h5Player[`hhh_${event}_runfn`] = null
                h5Player[`hhh_${event}_fns`] = {}
                return false
            }
            
            let o = Object.entries(fn_obj)[0]
            let name = o[0]
            let fn = o[1]

            h5Player[`hhh_${event}_fns`] ??= {}
            if(h5Player[`hhh_${event}_fns`][name] === undefined){
                h5Player[`hhh_${event}_fns`][name] = fn
            }else if(fn === null){
                delete h5Player[`hhh_${event}_fns`][name]
            }else if(fn.toString() !== h5Player[`hhh_${event}_fns`][name].toString()){
                err(`hhh_${event}_fns 重复：`, name, fn)
            }

            function runfn(e){
                // log(h5Player[`hhh_${event}_fns`])
                for(let [name, fn] of Object.entries(h5Player[`hhh_${event}_fns`])){
                    fn(e)
                }
            }

            h5Player[`hhh_${event}_runfn`] = runfn
            h5Player.addEventListener(event, runfn, true)

        }

        //简单的对话框
        class hhh_box{
            $box_container = null
            option = {
                id: 'hhh_box',
                target: null,
                tip_target: null,
                enter_fn: ()=>{},
                cancel_fn: ()=>{},
                color: 'white',
                gap: 2,
                z_index: 1,
            }
            //计算坐标
            calc_xy(t){
                let crects = t.target[0].getBoundingClientRect(),
                    trects = t.box_target[0].getBoundingClientRect(),
                    box_height = trects.height,
                    box_width = trects.width,
                    width = crects.width,
                    top = crects.top - box_height,
                    left = crects.left + (width - box_width) / 2;
                    //log(crects, trects)
                    // + document.scrollingElement.scrollTop
                return {x:left, y:top};
            }
            create(option_) {
                if(this.$box_container !== null) { console.error('已创建对话框'); return 0 }

                //add box
                let box = `<div id="hhh_box_container" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%; z-index: 20000; background-color: rgba(0,0,0,.5);">
                                <div id="hhh_box" style="position: absolute; display: flex; left: 100px; top: 100px; width: 100px; height: auto; padding: 8px 0px;
                                    background-color: rgb(0 0 0 / 0.8); flex-direction: column; justify-content: center; align-items: center; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,.16);">
                                    <div id="hhh_content" style="padding: 0px 8px; text-align: center"></div>
                                    <div>
                                        <div class="hhh-button" id="hhh_enter">
                                            <div class="hhh-button-area">确定</div>
                                        </div>
                                        <div class="hhh-button" id="hhh_cancel">
                                        <div class="hhh-button-area">取消</div>
                                        </div>
                                    </div>
                                </div>
                            </div>`
        
                let o = {...this.option, ...option_}
                this.$box_container = $(box).appendTo($('body'))
                let $box = this.$box_container.find('#hhh_box')
                o.box_target = $box
                
                //add css
                let rules = `
                    .hhh-button-area {
                        display: flex;
                        min-width: 40px;
                        transform: scale(0.8);
                        color: #fff;
                        border: 1px solid hsla(0,0%,100%,.2);
                        justify-content: center;
                        width: 100%;
                        height: 100%;
                        border-radius: 2px;
                        box-sizing: border-box;
                        transition: all .2s
                    }
                    .hhh-button-area:hover {
                        --bpx-fn-color: #00a1d6;
                        color: var(--bpx-fn-color,#00a1d6);
                        border-color: var(--bpx-fn-color,#00a1d6)
                    }
                    .hhh-button {
                        width: 40px;
                        height: 22px;
                        line-height: 22px;
                        margin-top: 9px;
                        display: inline-flex;
                        vertical-align: middle;
                        cursor: pointer
                    }
                `                
                let style_id = 'hhh_box_style'
                $(`#${style_id}`).remove();
                if($(`#${style_id}`).length <= 0){
                    this.$box_container.prepend(`<style id=${style_id} type="text/css">${rules}</style>`);
                }

                $box.find('#hhh_content').css({color: o.color}).text(o.text)
                let xy = this.calc_xy(o)        
                $box.css({left: xy.x, top: xy.y - o.gap, 'z-index': o.z_index})
        
                //event
                $box.find('#hhh_enter').click(()=>{ o.enter_fn(); this.destroy() })
                $box.find('#hhh_cancel').click(()=>{ o.cancel_fn(); this.destroy() })
                
            }
            destroy() {
                this.$box_container.empty()
                this.$box_container.remove()
                this.$box_container = null
            }
        }

        //时间to秒
        function timestr_to_second(d){
            d = d?.trim()?.split(/:/)?.reverse()
            return d?.reduce((t,v,i)=>t+parseInt(v)*(60**i),0)
        }    
        //格式化数字（播放量等），感谢ChatGPT
        function formatPlayCount(playCount) {
            if (playCount >= 10000 && playCount < 100000000) {
                // 如果播放量在一万以上，但不到一亿，以万为单位显示，保留一位小数
                return (playCount / 10000).toFixed(1) + '万';
            } else if (playCount >= 100000000) {
                // 如果播放量在一亿以上，以亿为单位显示，保留一位小数
                return (playCount / 100000000).toFixed(1) + '亿';
            } else {
                // 如果播放量在一万以下，直接显示整数
                return Math.round(playCount).toString();
            }
        }

        //自动(合集/选集)连播/循环
        //自动连播、列表循环、单集循环、播完暂停
        function list_play_control(open=ON){
            // log('------list_play_control------')

            // log('---', prev_video_type, prev_video_type_unique_id, video_type, video_type_unique_id)
            // log(h5Player.hhh_ended_fns, open)
            // log('------list_play_control2------')

            if(video_type_unique_id === prev_video_type_unique_id && prev_video_type_unique_id !== undefined) return
            
            $('#hhh_auto_list_play').remove()
            if($('.auto-play:contains(自动连播)').length > 1) $('#hhh_auto_list_play_button').remove()

            if(open === OFF) return
            if(['视频选集', '合集', '收藏列表'].includes(video_type) === false) return
            
            // let video_type =  $('.list-box').length > 0 ? MULTI_P : //视频选集
            //                   $('.video-section-list').length > 0 ? VIDEO_LIST : //合集
            //                   $('.action-list-inner').length > 0 ? ACTION_LIST : //收藏列表
            //                                                       NORMAL_VIDEO   //常规视频

            let is_dark = ''

            //auto_list_play && style
            let $auto_list_play = $('<span id="hhh_auto_list_play">').prependTo( $('.video-pod__header').add('.action-list-container') )
            $auto_list_play.css({
                'display': 'flex',
                'flex-direction': 'column',
                'align-items': 'flex-end',
                'margin': '0 16px',
            })
            if(video_type === '视频选集'){
                // $auto_list_play.css({'margin': '0px'})
                // $('.head-con').css({'align-items': 'stretch', 'flex-direction': 'column'})
            }else if(video_type === '收藏列表'){
                $auto_list_play.css({'margin-top': '8px'})
            }

            //添加css
            append_style($auto_list_play, 'hhh_handoff',
                `
                    .handoff {
                        display: flex;
                        flex-direction: row;
                    }
                    .handoff .handoff-item {
                        cursor: pointer;
                        color: var(--Lb5);
                        background: var(--graph_bg_regular);
                        border: 1px solid var(--line_regular);
                        border-radius: 8px;
                        box-sizing: border-box;
                        padding: 3px;
                        padding-top: 4px;
                        padding-bottom: 4px;
                        margin-bottom: 6px;
                        line-height: 14px;
                        font-size: 12px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        width: auto;
                        height: auto;
                    }
                    .handoff .handoff-item:hover {
                        background: var(--line_regular);
                    }
                    .handoff .handoff-item.on {
                        background-color: var(--Lb5);
                        color: var(--Ga1);
                    }
                    .handoff .list-tool-btn[data-v-53038c4f] {
                        position: relative;
                        width: 24px;
                        height: 24px;
                        margin-right: 2px;
                        cursor: pointer;
                    }
                    .handoff .list-tool-btn .list-tool-btn-icon[data-v-53038c4f] {
                        width: 100%;
                        height: 100%;
                        color: var(--text2);
                    }
                    .handoff .list-tool-btn .list-tool-btn-icon[data-v-53038c4f]:hover {
                        color: var(--brand_blue)
                    }
                `
            )

            let play_order = `<div title="顺序播放" class="list-playorder-btn list-tool-btn" data-v-53038c4f="">
                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="list-tool-btn-icon" data-v-53038c4f="">
                    <path d="M6.60968 14.9375L6.89623 14.6411C6.94252 14.5954 6.9972 14.5592 7.05728 14.5343C7.11844 14.5089 7.18399 14.4959 7.25019 14.4959C7.31638 
                          14.4959 7.38194 14.5089 7.44309 14.5343C7.50425 14.5596 7.55982 14.5967 7.60663 14.6436C7.65344 14.6904 7.69057 14.7459 7.71591 14.8071C7.74124 
                          14.8683 7.75428 14.9338 7.75428 15C7.75428 15.0662 7.74124 15.1317 7.71591 15.1929C7.69057 15.2541 7.65344 15.3096 7.60663 15.3564L5.61115 
                          17.3519C5.56431 17.396 5.5094 17.4306 5.44943 17.4538L5.43864 17.458L5.42806 17.4627C5.37203 17.4874 5.31144 17.5002 5.25019 17.5002C5.18893 
                          17.5002 5.12834 17.4874 5.07231 17.4627L5.06173 17.458L5.05094 17.4538C4.99097 17.4306 4.93606 17.396 4.88922 17.3519L2.89374 15.3564C2.7992 
                          15.2619 2.74609 15.1337 2.74609 15C2.74609 14.8663 2.7992 14.7381 2.89374 14.6436C2.98827 14.549 3.11649 14.4959 3.25019 14.4959C3.3827 14.4959 
                          3.50984 14.5481 3.60413 14.6411L3.89069 14.9375L4.75019 15.8266V14.59V7C4.75019 6.86739 4.80286 6.74022 4.89663 6.64645C4.9904 6.55268 5.11758 
                          6.5 5.25019 6.5C5.38279 6.5 5.50997 6.55268 5.60374 6.64645C5.69751 6.74022 5.75019 6.86739 5.75019 7V14.59V15.8266L6.60968 14.9375ZM21.2502 
                          7.5H11.2502C11.1176 7.5 10.9904 7.44732 10.8966 7.35355C10.8029 7.25978 10.7502 7.13261 10.7502 7C10.7502 6.86739 10.8029 6.74022 10.8966 
                          6.64645C10.9904 6.55268 11.1176 6.5 11.2502 6.5H21.2502C21.3828 6.5 21.51 6.55268 21.6037 6.64645C21.6975 6.74021 21.7502 6.86739 21.7502 
                          7C21.7502 7.13261 21.6975 7.25979 21.6037 7.35355C21.51 7.44732 21.3828 7.5 21.2502 7.5ZM11.2502 11.5H21.2502C21.3828 11.5 21.51 11.5527 
                          21.6037 11.6464C21.6975 11.7402 21.7502 11.8674 21.7502 12C21.7502 12.1326 21.6975 12.2598 21.6037 12.3536C21.51 12.4473 21.3828 12.5 21.2502 
                          12.5H11.2502C11.1176 12.5 10.9904 12.4473 10.8966 12.3536C10.8029 12.2598 10.7502 12.1326 10.7502 12C10.7502 11.8674 10.8029 11.7402 10.8966 
                          11.6464C10.9904 11.5527 11.1176 11.5 11.2502 11.5ZM11.2502 16.5H21.2502C21.3828 16.5 21.51 16.5527 21.6037 16.6464C21.6975 16.7402 21.7502 
                          16.8674 21.7502 17C21.7502 17.1326 21.6975 17.2598 21.6037 17.3536C21.51 17.4473 21.3828 17.5 21.2502 17.5H11.2502C11.1176 17.5 10.9904 17.4473 
                          10.8966 17.3536C10.8029 17.2598 10.7502 17.1326 10.7502 17C10.7502 16.8674 10.8029 16.7402 10.8966 16.6464C10.9904 16.5527 11.1176 16.5 11.2502 
                          16.5Z" fill="currentColor" stroke="currentColor">
                    </path>
                </svg>
                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="list-tool-btn-icon" style="display:none;" data-v-53038c4f="">
                    <path d="M4.14069 9.06272L3.85414 9.35916C3.80785 9.4048 3.75317 9.44107 3.69309 9.46595C3.63193 9.49129 3.56638 9.50432 3.50019 9.50432C3.43399 
                          9.50432 3.36844 9.49129 3.30728 9.46595C3.24612 9.44062 3.19055 9.40349 3.14374 9.35668C3.09693 9.30987 3.0598 9.2543 3.03447 9.19314C3.00913 
                          9.13198 2.99609 9.06643 2.99609 9.00023C2.99609 8.93403 3.00913 8.86848 3.03447 8.80732C3.0598 8.74617 3.09693 8.6906 3.14374 8.64379L5.13922 
                          6.64831C5.18606 6.60427 5.24097 6.56967 5.30094 6.54642L5.31173 6.54223L5.32231 6.53756C5.37834 6.51279 5.43893 6.5 5.50019 6.5C5.56144 6.5 
                          5.62203 6.51279 5.67806 6.53756L5.68864 6.54223L5.69943 6.54642C5.7594 6.56967 5.81431 6.60427 5.86115 6.64831L7.85663 8.64379C7.95117 8.73832 
                          8.00428 8.86654 8.00428 9.00023C8.00428 9.13393 7.95117 9.26214 7.85663 9.35668C7.7621 9.45121 7.63388 9.50432 7.50019 9.50432C7.36766 9.50432 
                          7.24052 9.45214 7.14623 9.35916L6.85968 9.06272L6.00019 8.17359V9.41023V17.0002C6.00019 17.1328 5.94751 17.26 5.85374 17.3538C5.75997 17.4476 
                          5.63279 17.5002 5.50019 17.5002C5.36758 17.5002 5.2404 17.4476 5.14663 17.3538C5.05286 17.26 5.00019 17.1328 5.00019 17.0002V9.41023V8.17359L4.14069 
                          9.06272ZM21.5002 7.5H11.5002C11.3676 7.5 11.2404 7.44732 11.1466 7.35355C11.0529 7.25978 11.0002 7.13261 11.0002 7C11.0002 6.86739 11.0529 
                          6.74022 11.1466 6.64645C11.2404 6.55268 11.3676 6.5 11.5002 6.5H21.5002C21.6328 6.5 21.76 6.55268 21.8537 6.64645C21.9475 6.74021 22.0002 6.86739 
                          22.0002 7C22.0002 7.13261 21.9475 7.25979 21.8537 7.35355C21.76 7.44732 21.6328 7.5 21.5002 7.5ZM11.5002 11.5H21.5002C21.6328 11.5 21.76 11.5527 
                          21.8537 11.6464C21.9475 11.7402 22.0002 11.8674 22.0002 12C22.0002 12.1326 21.9475 12.2598 21.8537 12.3536C21.76 12.4473 21.6328 12.5 21.5002 
                          12.5H11.5002C11.3676 12.5 11.2404 12.4473 11.1466 12.3536C11.0529 12.2598 11.0002 12.1326 11.0002 12C11.0002 11.8674 11.0529 11.7402 11.1466 
                          11.6464C11.2404 11.5527 11.3676 11.5 11.5002 11.5ZM11.5002 16.5H21.5002C21.6328 16.5 21.76 16.5527 21.8537 16.6464C21.9475 16.7402 22.0002 16.8674 
                          22.0002 17C22.0002 17.1326 21.9475 17.2598 21.8537 17.3536C21.76 17.4473 21.6328 17.5 21.5002 17.5H11.5002C11.3676 17.5 11.2404 17.4473 11.1466 
                          17.3536C11.0529 17.2598 11.0002 17.1326 11.0002 17C11.0002 16.8674 11.0529 16.7402 11.1466 16.6464C11.2404 16.5527 11.3676 16.5 11.5002 16.5Z" 
                          fill="currentColor" stroke="currentColor">
                    </path>
                </svg>
            </div>`

            let play_way = `<div title="列表循环" class="list-playway-btn list-tool-btn" data-v-53038c4f="">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="list-tool-btn-icon" style="display:none;" data-v-53038c4f="">
                    <path d="M18 15.375L19.5 16.875L18 18.375" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor"></path>
                    <path d="M18 5.625L19.5 7.125L18 8.625" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor"></path>
                    <path d="M19.5 7.125H16.875C14.1826 7.125 12 9.30761 12 12C12 14.6924 14.1826 16.875 16.875 16.875H19.5" stroke-width="1.7" stroke-linecap="round" stroke="currentColor" style="fill: none"></path>
                    <path d="M4.5 16.875H7.125C9.81739 16.875 12 14.6924 12 12C12 9.30761 9.81739 7.125 7.125 7.125H4.5" stroke-width="1.7" stroke-linecap="round" stroke="currentColor" style="fill: none"></path>
                </svg>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="list-tool-btn-icon" data-v-53038c4f="">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M5.64831 12.0001C5.64831 9.82845 7.40877 8.06799 9.58041 8.06799H17.8757C18.3769 8.06799 18.7831 7.66173 18.7831 7.16058C18.7831 6.65943 18.3769 6.25317 17.8757 6.25317H9.58041C6.40648 6.25317 3.8335 8.82615 3.8335 12.0001C3.8335 12.5012 4.23976 12.9075 4.7409 12.9075C5.24205 12.9075 5.64831 12.5012 5.64831 12.0001ZM18.352 12.0001C18.352 14.1717 16.5916 15.9322 14.4199 15.9322L7.27819 15.9322C6.77704 15.9322 6.37078 16.3385 6.37078 16.8396C6.37078 17.3408 6.77704 17.747 7.27819 17.747L14.4199 17.747C17.5938 17.747 20.1668 15.174 20.1668 12.0001C20.1668 11.4989 19.7606 11.0927 19.2594 11.0927C18.7583 11.0927 18.352 11.4989 18.352 12.0001Z" stroke-width="0" fill="currentColor"></path>
                    <path d="M17.0142 5.60962L18.5142 7.10962L17.0142 8.60962" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor"></path>
                    <path d="M7.21533 15.313L5.71533 16.813L7.21533 18.313" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor"></path>
                </svg>
            </div>`

            //添加node
            $auto_list_play.append(
                `
                    <div class="handoff" dark=${is_dark}>
                        ${play_order}
                        ${play_way}
                        <div class="handoff-item">自动连播</div>
                        <div class="handoff-item">列表循环</div>
                        <div class="handoff-item">单集循环</div>
                        <div class="handoff-item">播完暂停</div>
                    </div>
                `
            )

            //下移自动连播按钮
            if($('#hhh_auto_list_play_button').length <= 0){
                $('<p id="hhh_auto_list_play_button" style="display: flex; justify-content: space-between; margin-bottom: 12px; line-height: 22px; font-size: 15px;">接下来播放</p>').prependTo($('.rec-list'))
                $('.rec-list>p').append($('.auto-play:contains(自动连播):first'))
            }

            //设置默认播放状态
            let default_value = config.getCheckboxSettingKeyKey('independentListPlayControl', 'default')
            $(`#hhh_auto_list_play .handoff-item:contains(${default_value})`).addClass('on')

            //随机数组
            let length = $('.video-pod__list .video-pod__item').add('.action-list-inner .action-list-item-wrap').length
            let random = {
                'curr_idx'  : 0,
                'random_arr': Array.from(new Array(length).keys()),
                'arr_length': length
            }

            //数组洗牌
            function shuffleArray(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
            }

            //接管列表点击事件
            $('#hhh_auto_list_play').off('click.hhh_auto_list_play').on('click.hhh_auto_list_play', (e)=>{
                // log(e.target.outerText)
                let $target = $(e.target)
                if(e.target.className === 'handoff-item'){
                    $('#hhh_auto_list_play .handoff-item').removeClass('on')
                    $target.addClass('on')
                    config.setCheckboxSettingKeyKey('independentListPlayControl', 'default', e.target.outerText)
                    config.storageCheckboxSetting()
                }else if($target.parents('.list-tool-btn').length > 0){
                    //【顺序播放、倒序播放 | 列表循环、随机播放】
                    let $svg = !!$target.parent('svg')[0] === true ? $target.parent('svg') : $target
                    $svg.hide(); $svg.siblings('svg').removeAttr('style')

                    let $list_btn = $svg.parent()
                    let title = $list_btn.attr('title')
                    title = ['顺序播放', '倒序播放'].indexOf(title) !== -1 ? ('顺序播放' === title ? '倒序播放' : '顺序播放') : 
                            ['列表循环', '随机播放'].indexOf(title) !== -1 ? ('列表循环' === title ? '随机播放' : '列表循环') : undefined
                    $list_btn.attr('title', title)

                    //生成随机数组
                    if($target.parents('.list-tool-btn:first').attr('title') === '随机播放'){
                        random.curr_idx = 0
                        shuffleArray(random.random_arr)
                    }
                }
            })

            //按排序内容进行自动连播，随机，倒序***
            //视频结束时调用，【自动连播、列表循环、单集循环、播完暂停】
            const fn_ended = function(e){
                // log('---自动连播、列表循环、单集循环、播完暂停---')
                e.preventDefault()
                e.stopPropagation()
                e.stopImmediatePropagation()

                //弹出toast提示，3秒钟后播放下一P
                function countdown_toast(runfn, second=3) {
                    if(second <= 0) { runfn.click(); return }

                    let toast = window.player.toast
                    let toast_id = toast.create({
                        text: `${second} 秒钟后播放下一P`,  //即将播放...
                        duration: second*1000,
                        fixed: !0,  //立刻结束上一提示
                        manualMode: !0,  //允许手动中断（左侧 × ）
                        confirmText: '立即播放',
                        onConfirmClicked: function() {
                            toast.remove(toast_id)
                            runfn.click()
                        },
                        //onHoverChanged: function(){log('onHoverChanged'); },
                        onRemoved: function(e){
                            if(e.reason === 'delay') runfn.click()  //时间到关闭toast并运行fn
                            // else if(e.reason === 'manual' || 1 ) clearInterval(intervalId)  //手动关闭toast不运行fn
                            else if(e.reason === 'manual') clearInterval(intervalId)  //手动关闭toast不运行fn
                        }
                    })
                    let counter = second;
                    let intervalId = setInterval(() => {
                        $('.bpx-player-toast-fixed .bpx-player-toast-text').text(`${--counter} 秒钟后播放下一P`)
                        if (counter <= 0) {
                            clearInterval(intervalId)
                        }
                    }, 1000)
                }

                // ['自动连播', '列表循环', '单集循环', '播完暂停']
                // ['随机播放', '列表循环', '顺序播放', '倒序播放']
                let handoff     = $('#hhh_auto_list_play .handoff-item.on').text()

                let next_video  = $('.video-pod__item.active').next()
                                  .add($('.simple-base-item.normal, .simple-base-item.sub').get($('.simple-base-item.normal, .simple-base-item.sub').index($('.simple-base-item.normal.active, .simple-base-item.sub.active'))+1))
                                  .add($('.singlep-list-item-inner.siglep-active').parent().parent().next().find('.singlep-list-item-inner'))
                                  .add($('.multip-list-item').get($('.multip-list-item').index($('.multip-list-item-active'))+1))
                                
                let item_len    = $('.simple-base-item.normal, .simple-base-item.sub').add('.multip-list-item').length
                let prev_video  = $('.video-pod__item.active').prev()
                                  .add($('.simple-base-item.normal, .simple-base-item.sub').get(-item_len+$('.simple-base-item.normal, .simple-base-item.sub').index($('.simple-base-item.normal.active, .simple-base-item.sub.active'))-1))
                                  .add($('.singlep-list-item-inner.siglep-active').parent().parent().prev().find('.singlep-list-item-inner'))
                                  .add($('.multip-list-item').get(-item_len+$('.multip-list-item').index($('.multip-list-item-active'))-1))
                
                let first_video = $('.video-pod__item:first').add('.simple-base-item:first').add('.singlep-list-item-inner:first').add('.multip-list-item:first')
                let last_video  = $('.video-pod__item:last').add('.simple-base-item:last').add('.singlep-list-item-inner:last').add('.multip-list-item:last')

                // log(handoff, next_video.length, first_video.length)
                let second = config.getCheckboxSettingArgs('independentListPlayControl', 'second')
                if(handoff === '自动连播'){
                    if($('.list-playway-btn').attr('title') === '随机播放'){
                        if(random.curr_idx < random.random_arr.length){
                            let next_idx = random.random_arr[random.curr_idx++]
                            let next_random_video = $(`.video-pod__item:eq(${next_idx})`).add(`.simple-base-item:eq(${next_idx})`).add(`.singlep-list-item-inner:eq(${next_idx})`)
                            
                            // log(next_idx,next_random_video)

                            countdown_toast(next_random_video, second)
                        }else{ //随机循环完成暂停
                            window.player.endPanel.open()
                            setTimeout(() => { $('.bpx-player-ending-related-item-cancel').click() }, 0)
                        }
                    }else{
                        let then_video = $('.list-playorder-btn').attr('title') === '顺序播放' ? next_video : prev_video
                        if( then_video.length > 0){
                            countdown_toast(then_video, second) //3秒钟后播放下一P
                        }else{ //最后1p或第1p暂停
                            window.player.endPanel.open()
                            setTimeout(() => { $('.bpx-player-ending-related-item-cancel').click() }, 0)
                        }
                    }
                }else if(handoff === '列表循环'){
                    if($('.list-playway-btn').attr('title') === '随机播放'){
                        // console.log(random)
                        let next_idx = random.random_arr[random.curr_idx++]  //随机part index
                        if(random.curr_idx >= random.random_arr.length){ //随机循环完成，重新随机排序开始循环
                            random.curr_idx = 0
                            random.random_arr = Array.from(new Array(random.arr_length).keys())
                            shuffleArray(random.random_arr)
                            next_idx = random.random_arr[random.curr_idx++]
                        }
                        let next_random_video = $(`.video-pod__item:eq(${next_idx})`).add(`.simple-base-item:eq(${next_idx})`).add(`.singlep-list-item-inner:eq(${next_idx})`)
                        countdown_toast(next_random_video, second)
                    }else{
                        let then_video = $('.list-playorder-btn').attr('title') === '顺序播放' ? next_video : prev_video
                        let base_video = $('.list-playorder-btn').attr('title') === '顺序播放' ? first_video : last_video
                        countdown_toast(then_video.length <= 0 ? base_video : then_video, second)
                    }
                }else if(handoff === '单集循环'){
                    window.player.play()
                }else if(handoff === '播完暂停'){
                    window.player.endPanel.open()
                    setTimeout(() => { $('.bpx-player-ending-related-item-cancel').click() }, 0)
                }

            }
            run_events_listener('ended', {'hhh_list_play_control': fn_ended})
        }

        //自动连播按钮下移到列表底部，合集列表展开
        function expand_list(open=ON, columns=10){
            // log('---合集列表展开---')
            $('#hhh_expand_list').remove()
            let old_max_height = '250px'
            let list_class_str = '.video-pod__body'
            $(list_class_str).css({'max-height': old_max_height})

            if(open !== ON) return false
            if(video_type !== '合集') return false  //不是合集

            //第一次执行
            if($('#hhh_expand_list').length <= 0) {
                //复制自动连播按钮
                let $next_button = $('.auto-play:contains(自动连播)')
                $next_button.clone().appendTo($('.header-top>.right'))
                                    .attr({'id': 'hhh_expand_list', 'title': ''})
                                    .css({'margin-top': '5px'})
                                    .find('.txt').text(`展开列表`).end()
                                    .parent().css({'display': 'flex', 'flex-direction': 'column'})
                                    // .parent().css({'display': 'flex'})

                old_max_height = $(list_class_str).css('max-height')

                tip_create_3_X({ target: $('#hhh_expand_list'), tip_target: $('#hhh_tip'), gap: 6,
                                 title: `展开列表，默认展开高度（行）: ${config.getCheckboxSettingArgs('expandList', 'columns')}` })
            }

            //点击列表展开
            let $vitem = $('.video-pod__item:first')
            let vitem_height = $vitem.outerHeight() + parseInt($vitem.css('margin-top')) + parseInt($vitem.css('margin-bottom'))

            let $switch_button = $('#hhh_expand_list .switch-btn')
            if($switch_button.hasClass('on') === true) $switch_button.toggleClass('on')  //初始不展开状况
            $('#hhh_expand_list').off('click.hhh_expand_list')
            $('#hhh_expand_list').on('click.hhh_expand_list', function(){
                $switch_button.toggleClass('on')
                if($switch_button.hasClass('on') === true){
                    let limit_height = vitem_height * columns  //限高
                    $(list_class_str).css({'max-height': limit_height})  //展开columns个的高度
                } else {
                    $(list_class_str).css({'max-height': old_max_height})
                }
            });
            $('#hhh_expand_list').click()  //默认展开
        }

        //合集、视频选集等设置
        function set_video_list(){
            // log('======set_video_list======', video_type, video_type_unique_id)
            if(['合集','视频选集'].includes(video_type) === false) { $('.right-container').css('width', ''); return }

            let myid = []

            /////////////////////////////
            //给列表添加总时长 & 标注进度等
            /////////////////////////////
            function add_to_video_sections_head(){
                function add_total_time(){
                    function init(){
                        let $left = $('.header-bottom .left')  //合集
                        let $pod_slide = $('.video-pod .video-pod__slide')
                        let $items = $('.video-pod__body .stat-item.duration')
                        if($left.length <= 0) {
                            $left = $('.header-top .left')  //选集
                        }
        
                        const id = 'hhh_mysections_head'
                        if($items.length > 0){
                            if($(`#${id}`).length <= 0){
                                $left.wrap(`<div id="${id}">`).parent()
                            }
                        }
                        return [$(`#${id}`), $pod_slide, $items]
                    }
                    let [$wrap, $pod_slide, $items] = init()
    
                    //统计list秒数
                    function get_list_second($items, index){
                        //all
                        let second = 0
                        let begin = index === undefined ? 0 : index
                        let end = index === undefined ? $items.length - 1 : index
                        //log(index, begin, end)
                        for(; begin <= end; ++begin){
                            second += timestr_to_second($items.eq(`${begin}`).text()?.match(/([\d:]+)/)?.[1])
                        }
                        return second
                    }
                    let second = get_list_second($items)
    
                    if(!$wrap) return false
                    const id = 'hhh_total_time'
                    $(`#${id}`).remove()
                    $(`<div id="${id}" total-second="0" style="font-size: 12px; color: #999999; line-height: 16px; margin-top: 5px;"></div>`).appendTo($wrap)
                    let hour = ((second / (60*60/2)).toFixed(0)/2).toFixed(1)  //0.5的倍数
                    $(`#${id}`).text(`总时长: ${sec2str(second)}（${hour}小时）`).attr('total-second', second)
                }
                add_total_time()
                
                //多合集刷新时更新单个合集总时间
                if($('.video-pod__slide').length > 0) {
                    let is_change_break = null
                    $('.video-pod__list')[0]?.hhh_ob?.disconnect()
                    let ob = new MutationObserver((mutations, observer) => {
                        for (var mutation of mutations) {
                            let target = mutation.target
                            if(typeof target.className === 'string' && !!$(target).text()){
                                // log($(target).find('.title-txt:first').text())
                                clearTimeout(is_change_break)
                                is_change_break = setTimeout(function() {
                                    // log("合集刷新完毕")
                                    add_total_time()
                                }, 50)
                            }
                        }
                    })
                    ob.observe($('.video-pod__list')[0], { childList: true })
                    $('.video-pod__list')[0].hhh_ob = ob
                }

                return ['hhh_mysections_head', 'hhh_total_time']
            }
            myid = [ ...myid, ...add_to_video_sections_head()]
    
            /////////////////////////////
            //
            /////////////////////////////

            //支持视频选集/合集（选集是单个BV号，合集是多个BV号）
            async function memory_multipart_progress(open, [status]){
                const LIST_TYPE = video_type
                // log('=====memory_multipart_progress=====', LIST_TYPE)

                /*
                (function(){
                    if(!window.localStorage) {
                        console.log('浏览器不支持localStorage');
                    }
                    var size = 0, count = 0;
                    for(item in window.localStorage) {
                        if(window.localStorage.hasOwnProperty(item)) {
                            if(item === 'hhh_checkboxes'){
                                console.log(item)
                                console.log(window.localStorage.getItem(item))
                            }
                            size += window.localStorage.getItem(item).length;
                        }
                    }
                    console.log('当前localStorage个数：'+count, '当前localStorage使用容量为' + (size / 1024).toFixed(2) + 'KB');
                })()
                
                删除所有 hhh_BV
                (function(){
                    if(!window.localStorage) {
                        console.log('浏览器不支持localStorage');
                    }
                    var size = 0, count = 0;
                    for(item in window.localStorage) {
                        if(window.localStorage.hasOwnProperty(item)) {
                            if(item.match(/hhh_BV/)){
                                //localStorage.removeItem(item)
                                console.log(item)
                                console.log(window.localStorage.getItem(item))
                            }
                            //size += window.localStorage.getItem(item).length;
                        }
                    }
                    console.log('当前localStorage个数：'+count, '当前localStorage使用容量为' + (size / 1024).toFixed(2) + 'KB');
                })()
                
                `{
                    option:{
                        total_part:'0',

                        counter:'0',
                        currentTime:'0',
                        last_part:'0',
                        watch_date:'0',
                        watch_time:'0',
                    },
                    progress_list:{
                        bvid:...
                    }
                }`*/
                
                g_fn_arr[memory_multipart_progress.name] = memory_multipart_progress


                function get_total() { return +$('.video-pod__header .amt')?.text()?.match(/(\d+)\/(\d+)/)?.[2] }
                // function get_draw_part(){ return +$('.simple-base-item').index($('.simple-base-item.active')) + 1 }
                function get_part() { return +$('.video-pod')[0].__vue__.p }
                function get_curr_part() { return $('.video-pod__list .video-pod__item[data-scrolled]').index()+1 }
                function get_curr_part_duration() { return $('.video-pod__list .video-pod__item[data-scrolled] .duration').text().trim() }
                
                function remove_all_duration_pass(){ $('.stat-item.duration .hhh_pass').remove() }
                
                // function get_curr_cid() { return $('.video-pod')[0].__vue__.cid }
                function get_curr_data_key() { return $('.video-pod__list .video-pod__item[data-scrolled]').attr('data-key') }
                //$('.slide-item.active')?.attr('title') || ""
                function get_curr_slide_title() { return $('.video-pod__slide .slide-item.active')?.attr('title') || '' }
                function get_curr_$item() { return $(`.video-pod__list .video-pod__item[data-key=${get_curr_data_key()}]`) }
                function get_$item(data_key) { return $(`.video-pod__list .video-pod__item[data-key=${data_key}]`) }
                function get_base_$item(id_data_key) { let id_subname = id_data_key.split('_')
                                                  return id_subname.length > 1  //区分list里存在多于1P的item
                                                      ? $(`.video-pod__list .video-pod__item[data-key=${id_subname[0]}]`).find(`.page-list .simple-base-item:contains(${id_subname[1]})`)
                                                      : $(`.video-pod__list .video-pod__item[data-key=${id_data_key}]`).find('.simple-base-item')
                }
                function get_curr_page_key() { return get_curr_$item().find('.simple-base-item').length > 1
                                                      ? get_curr_data_key() + '_' + get_curr_$item().find('.page-list .simple-base-item.active .title').text().trim()
                                                      : undefined
                }
                function get_curr_page_$item() { return get_curr_$item().find('.simple-base-item').length > 1
                                                        ? get_curr_$item().find('.page-list .simple-base-item.active')
                                                        : undefined
                }
                
                function get_bv() { return $('meta[itemprop=url]').attr('content')?.match(/BV\w+/)?.[0] }
                function get_sid() { return $('.video-pod__header a').attr('href')?.match(/sid=\w+/)?.[0] }  //合集ID
                function get_progress_id() { return 'hhh_' + (LIST_TYPE === '合集' ? get_sid() : get_bv())}

                function get_slide_id(){ return $('.video-pod')[0]?.__vue__?.podCurSlide?.id }

                function get_vids(){
                    let vids = []
                    if(LIST_TYPE === VIDEO_LIST) $('.video-pod')[0]?.__vue__.videoData.ugc_season.sections.forEach((e)=>{ e.episodes.forEach((e1)=>{ vids.push(e1.bvid) }) })
                    else vids = Array.from({ length: get_total() }, (v, i) => i.toString())
                    return vids
                }

                function vid_to_part(bvid) { return vids.indexOf(bvid) + 1 }
                function part_to_vid(part) { return vids[part-1] }
                function vid_to_part2(bvid) { log(vids, bvid, vids.indexOf(bvid)); return vids.indexOf(bvid) + 1 }
                function part_to_vid2(part) { if(1||!(vids[part-1] && vids[part-1].match('BV'))) log('part_to_bv:', part, vids[part-1]); return vids[part-1] }

                    
                function get_obj(){
                    const progress_id = get_progress_id()
                    const obj = get_value(progress_id)
                    return obj
                }

                function save_obj(obj){
                    set_value(get_progress_id(), obj)
                }
                
                //版本转换
                function old_obj_convert_new(){
                    // log('---old_obj_convert_new 1---')
                    // log(get_obj())
                    
                    const old_obj = get_obj()
                    if(old_obj === undefined || old_obj.progress_list === undefined){
                        return save_obj({option: {}, progress_list: {}})
                    }

                    //重置
                    if(old_obj.option !== undefined && old_obj.progress_list !== undefined) return

                    //转换
                    let new_obj = {option: {}, progress_list: {}}
                    
                    new_obj.option.counter = old_obj.counter
                    new_obj.option.currentTime = old_obj.currentTime
                    new_obj.option.last_part = old_obj.last_part
                    new_obj.option.watch_date = old_obj.watch_date
                    new_obj.option.watch_time = old_obj.watch_time
                    
                    new_obj.option.total_part = get_total()

                    let old_list = old_obj.progress_list
                    for(let [part, value] of Object.entries(old_list)){
                        // log(part, value, part_to_vid(part))
                        new_obj.progress_list[part_to_vid(part)] = value
                    }

                    // log(old_obj)
                    // log(new_obj)
                    // log(Object.keys(old_list).length)
                    // log(Object.keys(new_obj.progress_list).length)
                    // log('---old_obj_convert_new 2---')

                    save_obj(new_obj)
                    
                    return new_obj
                }

                function update_obj(ended_value){
                    // log('---------update_obj----------')
                    const vid = get_curr_data_key()
                    if(vid === undefined) { err('当前视频不在item内'); return }
                    const date = new Date()
                    const currentTime = h5Player.currentTime

                    const obj = get_obj() || { option: {}, progress_list: {}}
                    // log(obj, obj.option.curr_slide_title, get_curr_slide_title())
                    obj.option.last_part = get_curr_part() + 'p'
                    obj.option.last_data_key = get_curr_data_key()
                    obj.option.curr_slide_title = get_curr_slide_title()
                    obj.option.currentTime = currentTime
                    obj.option.watch_date = date.Format("MM-dd")
                    obj.option.watch_time = date.Format("hh:mm")

                    
                    let item_id = get_curr_page_key()
                    // log(item_id ?? vid)
                    obj.progress_list[item_id ?? vid] = ended_value || currentTime  //看完的视频赋值 -1
                    
                    // log(vid, get_progress_id())
                    save_obj(obj)

                    return obj
                }
                    
                function counter_obj(){
                    const obj = get_obj() || { option: {}, progress_list: {}}
                    obj.option.counter = obj.option.counter === undefined ? 1 : obj.option.counter + 1
                    save_obj(obj)
                }
                //hhh_episode_view
                function bulid_real_to_draw(){
                    let real_to_draw = Array.from(new Array(1+get_total()).keys())  //默认real to real
                    let curr_section_begin_idx = 0
                    $('.video-section-list').add('.cur-list').each((i,v)=>{
                        // console.log(`-----${i}-----`)
                        $(v).find('.hhh_episode_view').each((i,v)=>{
                            // console.log(curr_section_begin_idx + +$(v).attr('real_idx'), curr_section_begin_idx+i+1)
                            real_to_draw[curr_section_begin_idx + +$(v).attr('real_idx')] = curr_section_begin_idx + i + 1
                        })
                        curr_section_begin_idx += $(v).find('.hhh_episode_view').length
                    })
                    return real_to_draw
                }

                //等待__vue__，超时退出
                if(await isTimeout(()=> $('.video-pod')[0]?.__vue__ !== undefined)) { err('get_vids timeout'); return }

                let run_count = 0,
                    vids = get_vids()
                    // reals_to_draws = bulid_real_to_draw();

                // log(reals_to_draws)
                //////////////////////////////
                //
                //////////////////////////////
                // log('-----memory_multipart_progress run-----')
                
                // const [MULTI_P, VIDEO_LIST] = [1,2]
                // const LIST_TYPE = $('.list-box').length > 0 ? MULTI_P : //视频选集
                //                   $('.video-section-list').length > 0 ? VIDEO_LIST : undefined //合集

                //hhh_memory_multipart_progress
                //hhh_pass
                //hhh_fn_timeupdate **
                function init(open){
                    // log('---------init----------', open)

                    //$('.hhh-multi-page-progress').width(0)
                    h5Player = geth5Player()

                    $('#hhh_memory_multipart_progress').remove()
                    $('.hhh-multi-page-progress').remove()
                    $('.hhh-multi-page-progress-border-right').remove()
                    $('.hhh-viewed').remove()
                    $('.stat-item.duration .hhh_pass').remove()  //去掉所有 √
                    $('.video-pod__slide .slide-inner .slide-item').map((i, item)=>{ item.style.cssText = ''; $(item).find('div').remove() })  //删除slide节点
                    h5Player.removeEventListener('timeupdate', $(bb['video'])[0]?.hhh_fn_timeupdate)

                    if(open === OFF) return false

                    //添加到mysections && 更新hhh_total_time已看时长百分比
                    function add_passed_second_time(){
                        // log('---add_passed_second_time---')
                        let $head_wrap = $('#hhh_mysections_head')
                        const id = 'hhh_memory_multipart_progress'
                        $(`<div id="${id}" style="font-size: 12px; color: #999999; line-height: 16px; margin-top: 3px; user-select: none"></div>`).appendTo($head_wrap)

                        //已看时长占百分比
                        if(get_obj()?.progress_list !== undefined){
                            // log('---hhh_total_time已看时长百分比---',get_obj())
                            //计算已看百分比
                            let list = get_obj().progress_list
                            let passed_second = 0
                            for(let [id, currentTime] of Object.entries(list)){  //累计已看秒数
                                if(currentTime === -1){  //看完，currentTime=视频时长
                                    currentTime = timestr_to_second(get_base_$item(id).find('.duration').text()?.match(/([\d:]+)/)?.[1]) ?? 0
                                }
                                passed_second += currentTime
                            }
                            let percent = (passed_second/$('#hhh_total_time').attr('total-second')*100).toFixed(0)
                            let new_text = `${$('#hhh_total_time').text().split('|')?.[0]}|（已看${percent}%）`
                            $('#hhh_total_time').text(new_text)
                        }
                    }

                    /* video-pod__list section - LIST
                    <div data-key="BV1iE411n7BC" data-v-f4470e68="" class="pod-item video-pod__item simple" data-scrolled="true">
                        <div class="single-p">
                            <div class="simple-base-item active normal">
                                <div title="1 冰火第一段子手 忧郁的艾迪" class="title">
                                    <div class="playing-gif"></div>
                                    <div class="title-txt">1 冰火第一段子手 忧郁的艾迪</div>
                                </div>
                                <div class="stats">
                                    <div class="stat-item duration">23:43</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    */
                
                    //鼠标悬浮显示百分比
                    function add_per_to_title(){
                        $('.video-pod__list').off('mouseover.hhh_title').on('mouseover.hhh_title',function(e){
                            if(e.originalEvent === undefined) return
                            let path = $(':hover').map((i,e)=>e)
                            log(path)
                            //判断是否为title
                            for (let i = 0; i < path.length; i++) {
                                const element = path[i]
                                if(element.className === 'single-p'){
                                    //读width确定百分比
                                    const width = $(element).find('.hhh-multi-page-progress')[0]?.style.width
                                    log(width)
                                    const centstr = width !== undefined ? ' ('+parseInt($(element).find('.hhh-multi-page-progress')[0]?.style.width)+'%)' : ''
                                    const $title = $(element).find('.title')
                                    $title[0].title = $title.text().trim() + centstr
                                }
                            }
                        })
                    }

                    //多video-sections-item small-mode，每个sections-item添加视频数量
                    function add_section_item(){
                        const silde = document.querySelector('.video-pod .video-pod__slide')
                        if(silde){
                            // if(silde.hasAttribute('data-hhh-video-count')) return
                            // silde.dataset.hhhVideoCount = ''
                            $('.video-pod__slide .slide-inner .slide-item').each((i, item)=>{
                                // console.log(i,item)
                                let $item = $(item)
                                $item.css({display: 'flex', 'flex-direction': 'column', 'justify-content': 'center', 'height': '42px', 'line-height': 'normal'})
                                let n = $('.video-pod')[0]?.__vue__.podSectionList[i].list.length
                                $item.append(`<div style="font-size: smaller">(共${(n)}个)</div>`)
                            })
                        }
                    }

                    add_passed_second_time()
                    // add_per_to_title()
                    add_section_item()

                    //timeupdate
                    h5Player.removeEventListener('timeupdate', $(bb['video'])[0]?.hhh_fn_timeupdate)
                    const fn_timeupdate = function(){
                        // log('---------fn_timeupdate----------')
                        const fn = fn_timeupdate
                        const LIMIT = 1000  //ms
                        const DELAY_LIMIT = 60000
                        if(fn.interval === undefined) {
                            fn.interval = 0
                            fn.interval_update = 0
                            fn.time = Date.now()
                        }
            
                        const now = Date.now()
                        fn.interval += now - fn.time
                        fn.interval_update += now - fn.time
                        fn.time = now

                        if((fn.interval === 0 || fn.interval > LIMIT) && h5Player.currentTime !== 0 ){  //默认每秒调用一次
                            //新进度 < 记忆进度 60s更新
                            const obj = get_obj()
                            const vid = get_curr_data_key()
                            if(vid === undefined) { err('当前视频不在item内'); fn.interval = 0; return }

                            let id = get_curr_page_key() ?? vid
                            let time = obj?.progress_list?.[id]
                            
                            if(time === undefined || (time !== -1 && time < h5Player.currentTime)){ fn.limit_update = LIMIT }  //1s
                            else{ fn.limit_update = DELAY_LIMIT }  //60s
                            fn.interval = 0

                            // log('currentTime:',h5Player.currentTime, 'time:',time, 'interval:',fn.interval, 'interval_update:',fn.interval_update, 'limit_update:',fn.limit_update)

                            if(fn.interval_update >= fn.limit_update){
                                update_obj()
                                update_progress(id)
                                update_title()
                                fn.interval_update = 0
                            }
                            draw_progress_red(id)
                        }
                    }
                    h5Player.addEventListener('timeupdate', fn_timeupdate)
                    $(bb['video'])[0].hhh_fn_timeupdate = fn_timeupdate

                    //end
                    const fn_ended = function(){
                        // log('---------fn_ended----------')
                        update_obj(-1)
                        update_progress()
                        update_title()
                    }
                    run_events_listener('ended', {'hhh_update_progress': fn_ended})

                    //点击跳转最后观看
                    //$multipart_progress.find('a').off('click.hhh_progress').on('click.hhh_progress', function(){ jump_last_video(this) })
                    
                    //自动跳转最后观看 - 可能存在问题
                    //if(run_count <= 0 && $(bb['video'])[0].hhh_last_bv === get_bv() && config.getCheckboxSettingStatus('autoJumpMemoryProgress') === ON){
                    if($(bb['video'])[0].hhh_last_bv !== get_bv() && config.getCheckboxSettingStatus('autoJumpMemoryProgress') === ON){
                        log('自动跳转最后观看:',run_count,$(bb['video'])[0].hhh_last_bv,get_bv())
                        $(bb['video'])[0].hhh_last_bv = get_bv()
                        waitForTrue( ()=> $('.hhh-video-seek').length >= 1, ()=> $('.hhh-video-seek').click() )
                    }

                    //换P自动跳转最后观看时间
                    if(config.getCheckboxSettingStatus('autoJumpMemoryProgress') === ON){
                        log('换P自动跳转最后观看时间: ',run_count)
                        const obj = get_obj()
                        const part = get_part()
                        if(!!obj?.progress_list?.[part_to_vid(part)]){
                            let currentTime = obj?.progress_list?.[part_to_vid(part)]
                            currentTime = currentTime < 0 ? 0 : currentTime
                            // $(`.list-box li:eq(${reals_to_draws[part]-1}) .clickitem`).click()
                            h5Player.currentTime = currentTime
                        }
                    }
                }

                //根据进度画右侧红线
                function draw_progress_red(id_data_key){
                    // log('---------draw_progress_red----------', id_data_key)
                    let $item = get_base_$item(id_data_key)
                    let height = '31px'
                    // if(LIST_TYPE === VIDEO_LIST){ $item = get_curr_page_$item() ?? $item.find('.simple-base-item') }

                    if($item.find('.hhh-multi-page-progress-border-right').length <= 0){
                        $item.find('.hhh-multi-page-progress').clone().appendTo($item).removeClass('hhh-multi-page-progress')
                                                                                      .addClass('hhh-multi-page-progress-border-right')
                    }
                    // const duration = timestr_to_second($item.find('.stat-item.duration').text()?.match(/([\d:]+)/)?.[1])
                    const duration = timestr_to_second($item.find('.stat-item.duration').text())
                    const cent = (h5Player.currentTime/duration)*100
                    $item.find('.hhh-multi-page-progress-border-right').width(`${cent}%`).height(`${height}`)  //右侧红线
                }

                //title
                /*
                    option:{
                        total_part:'0'
                        counter:'0'

                        currentTime:'0'
                        last_part:'0'
                        watch_date:'0'
                        watch_time:'0'
                    },
                    progress_list:{
                        [(bvid|cid):currentTime]
                        [(bvid|cid):currentTime]
                        ...
                    }
                */

                function update_title(){
                    // log('---------update_title----------')
                    const obj = get_obj()
                    let op = obj?.option
                    
                    if(!obj || !op || !op.watch_date || !op.watch_time || !op.last_part || !op.currentTime || op.currentTime === 0) return

                    const format_date = op.watch_date === new Date().Format("MM-dd") ? '今天' : op.watch_date
                    // const duration = LIST_TYPE === MULTI_P ? $(`.list-box .duration:eq(${parseInt(op.last_part)-1})`).text().split(/√/)?.[0]
                    //                                        : $(`.video-episode-card__info-duration:eq(${reals_to_draws[parseInt(op.last_part)]-1})`).text().split(/√/)?.[0]
                    const duration = get_curr_part_duration()
                    const cent = parseInt(op.currentTime / timestr_to_second(duration) * 100)


                    // let scroll_to_top32 = `<span id="hhh_scroll_to_top" style="cursor: pointer">
                    //     <svg width="16" height="16" viewBox="0 -10 48 48" fill="var(--text2)">
                    //         <path d="M4 8h40v4H4zM34.828 25 24 14.172 13.171 25 16 27.828l6-6V40h4V21.828l6 6z"></path>
                    //     </svg>
                    // </span>`

                    // let scroll_to_top222 = `<span id="hhh_scroll_to_top" style="cursor: pointer">
                    // <svg width="16px" height="16px" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    // <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.048"></g><g id="SVGRepo_iconCarrier">
                    // <path d="M19 4H5M12 20L12 8M12 8L9 11M12 8L15 11" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                    //  </g></svg>
                    // </span>`

                    //<svg width="16" height="16" viewBox="0 0 40 40" aria-hidden="true" role="img" class="iconify iconify--twemoji" preserveAspectRatio="xMidYMid meet">
                    let scroll_to_top = `<span class="hhh_scroll_to_top">
                        <svg width="16" height="16" viewBox="0 0 40 40">
                            <path fill="var(--text3)" d="M25.711 10.867L18.779.652c-.602-.885-1.558-.867-2.127.037l-6.39 10.141c-.569.904-.181 1.644.865 1.644H13V16a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-3.525h1.898c1.047 0 1.414-.723.813-1.608zM3.651 23.575H1.438c-.975 0-1.381-.712-1.381-1.401c0-.71.508-1.399 1.381-1.399h7.469c.874 0 1.381.689 1.381 1.399c0 .69-.406 1.401-1.381 1.401H6.696v10.189c0 1.016-.649 1.584-1.522 1.584s-1.522-.568-1.522-1.584V23.575zM10.396 28c0-4.222 2.841-7.471 6.982-7.471c4.079 0 6.983 3.351 6.983 7.471c0 4.201-2.821 7.471-6.983 7.471c-4.121 0-6.982-3.27-6.982-7.471zm10.798 0c0-2.456-1.279-4.67-3.816-4.67s-3.816 2.214-3.816 4.67c0 2.476 1.239 4.668 3.816 4.668c2.578 0 3.816-2.192 3.816-4.668zm4.433-5.644c0-.954.569-1.582 1.585-1.582h3.591c2.985 0 5.197 1.947 5.197 4.851c0 2.963-2.293 4.811-5.074 4.811h-2.253v3.329c0 1.016-.649 1.584-1.521 1.584c-.874 0-1.524-.568-1.524-1.584V22.356zm3.046 5.4h2.071c1.277 0 2.089-.934 2.089-2.151c0-1.219-.812-2.152-2.089-2.152h-2.071v4.303z"></path>
                        </svg>
                    </span>`

                    // let scroll_to_top2 = `<span id="hhh_scroll_to_top" style="cursor: pointer; position: relative; top: 4px;">
                    // <svg width="16" height="16" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--emojione" preserveAspectRatio="xMidYMid meet" fill="var(--text2)">
                    // <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g fill="var(--text2)"> 
                    // <path d="M32 2L16 18h10v15h12V18h10z"> </path> 
                    // <path d="M32 62c-3.3 0-6-2.8-6-6.3v-9.3c0-3.5 2.7-6.3 6-6.3s6 2.8 6 6.3v9.3c0 3.5-2.7 6.3-6 6.3m0-18.6c-1.7 0-3 1.3-3 3v9.3c0 1.6 1.3 3 3 3s3-1.3 3-3v-9.3c0-1.7-1.3-3-3-3"> </path> 
                    // <path d="M22 40H10v3h4.5v19h3V43H22z"> </path> <path d="M48 40h-6v22h3v-9.3h3c3.3 0 6-2.8 6-6.3c0-3.6-2.7-6.4-6-6.4m0 9.3h-3v-5.9h3c1.7 0 3 1.3 3 3s-1.3 2.9-3 2.9"> </path> </g> </g></svg>
                    // </span>`

                    // let scroll_to_top3 = `<span id="hhh_scroll_to_top" style="cursor: pointer">
                    // <svg width="16" height="16" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--noto" preserveAspectRatio="xMidYMid meet" fill="var(--text2)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M116 4H12c-4.42 0-8 3.58-8 8v104c0 4.42 3.58 8 8 8h104c4.42 0 8-3.58 8-8V12c0-4.42-3.58-8-8-8z" fill="#427687"> </path> <path d="M109.7 4H11.5A7.555 7.555 0 0 0 4 11.5v97.9c-.01 4.14 3.34 7.49 7.48 7.5H109.6c4.14.01 7.49-3.34 7.5-7.48V11.5c.09-4.05-3.13-7.41-7.18-7.5h-.22z" fill="#8cafbf"> </path> <path d="M91 41.4l-24-24a3.994 3.994 0 0 0-5.65-.35c-.13.11-.24.23-.35.35l-24 24a3.996 3.996 0 0 0 .44 5.64c.71.61 1.62.95 2.56.96h14c1.1 0 2 .9 2 2v22c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4V50c0-1.1.9-2 2-2h14a4 4 0 0 0 3-6.6z" fill="#fafafa"> </path> <path d="M39.7 12.9c0-2.3-1.6-3-10.8-2.7c-7.7.3-11.5 1.2-13.8 4s-2.9 8.5-3 15.3c0 4.8 0 9.3 2.5 9.3c3.4 0 3.4-7.9 6.2-12.3c5.4-8.7 18.9-10.6 18.9-13.6z" opacity=".5" fill="#b4e1ed"> </path> <g fill="#fafafa"> <path d="M37.37 111.67h-5.9V88.74H23.9v-4.91h21.02v4.91h-7.56v22.93z"> </path> <path d="M76.05 97.71c0 4.61-1.14 8.15-3.43 10.63s-5.56 3.71-9.83 3.71s-7.54-1.24-9.83-3.71s-3.43-6.03-3.43-10.66s1.15-8.17 3.44-10.62c2.29-2.44 5.58-3.67 9.85-3.67s7.55 1.23 9.82 3.69c2.28 2.47 3.41 6.01 3.41 10.63zm-20.32 0c0 3.11.59 5.45 1.77 7.03s2.95 2.36 5.29 2.36c4.71 0 7.07-3.13 7.07-9.39c0-6.27-2.34-9.41-7.03-9.41c-2.35 0-4.12.79-5.31 2.37c-1.19 1.59-1.79 3.93-1.79 7.04z"> </path> <path d="M102.03 92.51c0 3-.94 5.29-2.81 6.88c-1.87 1.59-4.54 2.38-7.99 2.38H88.7v9.9h-5.9V83.83h8.89c3.38 0 5.95.73 7.7 2.18c1.76 1.45 2.64 3.62 2.64 6.5zM88.7 96.93h1.94c1.82 0 3.17-.36 4.08-1.08c.9-.72 1.35-1.76 1.35-3.13c0-1.38-.38-2.41-1.13-3.07c-.76-.65-1.94-.98-3.56-.98H88.7v8.26z"> </path> </g> </g></svg>
                    // </span>`

                    // let scroll_to_top22 = `<span id="hhh_scroll_to_top" style="cursor: pointer">
                    //     <svg width="16" height="16" viewBox="0 0 24 14" xmlns="http://www.w3.org/2000/svg">
                    //         <path d="M19 4H5M12 20L12 8M12 8L9 11M12 8L15 11" stroke="var(--text3)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                    //     </svg>
                    //  </span>`

                    const html = `<a part="${op.last_part}" data_key="${op.last_data_key}" currentTime="${op.currentTime}" class="hhh-video-seek">看到 ${op?.curr_slide_title || ''} ${op.last_part} ${sec2str(parseInt(op.currentTime))} (${cent}%) </a>
                                  <button style="cursor: pointer; color: var(--text3); background: var(--graph_bg_thick); border: solid 1px var(--graph_medium);
                                   border-radius: 2px; padding: 1px;">重置</button>
                                  <a class="hhh-viewed"></a>
                                  ${scroll_to_top}
                                 `
                    let $multipart_progress = $('#hhh_memory_multipart_progress')
                    if($multipart_progress.html() === '') {
                        // log('--------1--------')
                        $multipart_progress.html(`${html}`)

                        // add tip * 3
                        tip_create_3_X({ target: $('.hhh-video-seek'), tip_target: $('#hhh_tip'), gap: 6,
                            title: ()=>{ return `${format_date} ${op.watch_time}观看` }
                        })
                        tip_create_3_X({ target: $multipart_progress.find('button'), tip_target: $('#hhh_tip'), gap: 6,
                            title: '清空所有进度，重置为初始状态'
                        })
                        tip_create_3_X({ target: $('.hhh-viewed'), tip_target: $('#hhh_tip'), gap: 6,
                            title: '已观看数量，点击循环定位（右键向后）'
                        })
                        tip_create_3_X({ target: $('.hhh_scroll_to_top'), tip_target: $('#hhh_tip'), gap: 6, delay: 500,
                            title: '滚动到顶部'
                        })

                        //滚动到顶部
                        function scroll_to_top(){
                            $('.hhh_scroll_to_top').off('click').on('click', ()=>$('.video-pod__body').scrollTop(0))
                        }
                        scroll_to_top()

                        //get last part
                        // eslint-disable-next-line no-inner-declarations
                        function get_last_part(){
                            return parseInt($('.hhh-video-seek').attr('part'))-1
                        }

                        //part click
                        // eslint-disable-next-line no-inner-declarations
                        // function part_click(part){
                        //     part = reals_to_draws[part]
                        //     if(LIST_TYPE === MULTI_P){ //多P
                        //         $(`.list-box li:eq(${part}) .clickitem`).click()
                        //     }else if(LIST_TYPE === VIDEO_LIST){ //合集
                        //         $(`.video-section-list .video-episode-card:eq(${part})`).click()
                        //     }
                        // }
                        
                        //重置
                        function set_reset_button(){
                            $('#hhh_memory_multipart_progress button').off('click.hhh_progress_button').on('click.hhh_progress_button', ()=>{
                                let box = new hhh_box()
                                box.create({target: $('#hhh_memory_multipart_progress button'), color: 'var(--brand_blue)', text: '是否重置', gap: 8,  //00b5e5
                                    enter_fn: ()=>{
                                        localStorage.removeItem(get_progress_id())
                                        $('.hhh-multi-page-progress').remove()
                                        $('.hhh-multi-page-progress-border-right').remove()
                                        $('.hhh-viewed').remove()
                                        $('#hhh_total_time').text($('#hhh_total_time').text().split('|')[0])
                                        remove_all_duration_pass()
                                        // const $list = $('.list-box .duration').add($('.video-section-list .video-episode-card__info-duration'))
                                        // $list.each(function(){
                                        //     const $duration = $(this)
                                        //     if($duration.text().match(/√/)) $duration.text($duration.text().match(/([\d:]+)/)?.[1])  //去掉 √
                                        // })
                                    }
                                })
                            })
                        }
                        set_reset_button()

                        // get one_height
                        // eslint-disable-next-line no-inner-declarations
                        function get_one_height(){
                            let $first_list = $('.video-pod__list>.video-pod__item:first')
                            const margin_top = parseInt($first_list.css('margin-top'))
                            const margin_bottom = parseInt($first_list.css('margin-bottom'))
                            const one_height = $first_list.outerHeight() + Math.max(margin_top, margin_bottom)
                            return one_height
                        }
                        
                        //循环定位
                        function cycle_locate(){
                            $('.hhh-viewed').off('contextmenu').on('contextmenu', (e)=>{ e.stopImmediatePropagation(); e.preventDefault() })
                            $('.hhh-viewed').off('mouseup.hhh_progress_viewed').on('mouseup.hhh_progress_viewed', function(e){
                                const index = e.button === 2 ? -1 : 1  //前进或后退
                                const one_height = get_one_height()

                                //const total_view = $('.list-box .hhh-multi-page-progress').length  // 8
                                // const total_view = LIST_TYPE === MULTI_P ? $('.list-box .hhh-multi-page-progress').length  // 8
                                //                                          : $('.video-section-list .hhh-multi-page-progress').length
                                
                                const total_view = $('.video-section-list .hhh-multi-page-progress').length

                                const curr_view = parseInt($('.hhh-viewed').text()?.match(/\d+/)?.[0])  // 1 - 8
                                const is_single_num = !parseInt($('.hhh-viewed').text()?.match(/\d+.(\d+)/)?.[1])  // 判断显示类型

                                let next_view = (curr_view + index) || total_view  // 0 -> length, length+1 -> 1
                                next_view = next_view > total_view ? 1 : next_view
                                if(is_single_num && index === -1) next_view = total_view  // (num)的形式，循环定位第一或最后

                                // const curr_view_index = LIST_TYPE === MULTI_P ? $('.list-box li:has(.hhh-multi-page-progress)').eq(next_view - 1).index()
                                //                                               : $('.video-section-list .video-episode-card:has(.hhh-multi-page-progress)').eq(next_view - 1).index()

                                const curr_view_index = $('.video-section-list .video-episode-card:has(.hhh-multi-page-progress)').eq(next_view - 1).index()

                                //log(one_height,total_view,curr_view,curr_view_index)
                                $('.video-pod__body').scrollTop(4 + one_height * curr_view_index)

                                $('.hhh-viewed').text(`（${next_view}/${total_view}）`)  //已观看数量
                            })
                        }
                        cycle_locate()
                        
                        //初始化已观看数量
                        function set_viewed_count(){
                            const total_view = $('.video-pod__list .hhh-multi-page-progress').length
                            if($('.hhh-viewed').attr('count') !== total_view){
                                $('.hhh-viewed').attr('count', total_view)
                                $('.hhh-viewed').text(`（${total_view}）`)  //已观看数量
                            }
                        }
                        set_viewed_count()

                        //双击跳转到观看进度
                        $('.hhh-video-seek').off('dblclick.hhh_video_seek').on('dblclick.hhh_video_seek', function(){
                            let obj = get_obj()
                            h5Player.currentTime = obj.option.currentTime ?? h5Player.currentTime
                        })
                        
                        //双击跳转到观看进度
                        // function Jump_to_viewing_progress(){
                        //     return
                        //     $('.list-box, .video-sections-content-list').off('dblclick.hhh_video_list').on('dblclick.hhh_video_list', function(){
                        //         const obj = get_obj()
                        //         let part = get_part()
                        //         //console.log('双击跳转观看进度', part)
                        //         if(!!obj?.progress_list?.[part_to_vid(part)]){
                        //             let currentTime = obj?.progress_list?.[part_to_vid(part)]
                        //             currentTime = currentTime < 0 ? 0 : currentTime
                        //             LIST_TYPE === MULTI_P ? $(`.list-box li:eq(${bulid_real_to_draw()[part]-1}) .clickitem`).click()
                        //                                 : $(`.video-section-list .video-episode-card:eq(${part-1})`).click()
                        //             h5Player.currentTime = currentTime
                        //         }
                        //     })
                        // }
                        // Jump_to_viewing_progress()

                        // //跳转最后1P 不使用
                        // // eslint-disable-next-line no-inner-declarations
                        // function jump_last_video(selector){
                        //     //log($(selector).attr('part'), $(selector).attr('currentTime'))
                        //     if(!$(selector).attr('part') || !$(selector).attr('currentTime')) return false  //无数据

                        //     part_click(get_last_part())
                            
                        //     //$(`.list-box li:eq(${parseInt($(selector).attr('part'))-1}) .clickitem`).click()
                        //     h5Player.currentTime = $(selector).attr('currentTime')
                        //     h5Player.play()
                        //     const margin_top = parseInt($('.list-box li:first').css('margin-top'))
                        //     const margin_bottom = parseInt($('.list-box li:first').css('margin-bottom'))
                        //     const one_height = $('.list-box li:first').outerHeight() + Math.max(margin_top, margin_bottom)
                        //     $('.list-box').scrollTop(one_height * (parseInt($(selector).attr('part'))-4))
                        // }
                        
                        //跳转last_part
                        $('.hhh-video-seek').off('click.hhh_progress_seek').on('click.hhh_progress_seek', function(){
                            const data_key = $(this).attr('data_key')
                            // log(data_key, get_$item(data_key).index(), get_one_height())
                            let center = -$('.video-pod__body').height() / 2 + get_one_height() / 2
                            $('.video-pod__body').scrollTop(get_one_height() * (get_$item(data_key).index()) + center)
                            //log('---jump_last_video click---')
                            //jump_last_video(this)
                        })

                    }else{
                        // log('--------2--------')
                        // const html = `<a part="${obj.last_part}" currentTime="${obj.currentTime}" class="hhh-video-seek">看到${obj.last_part} ${sec2str(parseInt(obj.currentTime))} (${cent}%) </a>
                        //               <button style="cursor: pointer">重置</button>
                        //               <a class="hhh-viewed"></a>`
                        
                        let $video_seek = $multipart_progress.find('.hhh-video-seek')
                        $video_seek.attr('part', op.last_part)
                        $video_seek.attr('data_key', op.last_data_key)
                        $video_seek.attr('currentTime', op.currentTime)
                        $video_seek.text(`看到 ${op?.curr_slide_title || ''} ${op.last_part} ${sec2str(parseInt(op.currentTime))} (${cent}%) `)
                        
                        //初始化已观看数量
                        function set_viewed_count(){
                            const total_view = $('.video-pod__list .hhh-multi-page-progress').length
                            if($('.hhh-viewed').attr('count') !== total_view){
                                $('.hhh-viewed').attr('count', total_view)
                                $('.hhh-viewed').text(`（${total_view}）`)  //已观看数量
                            }
                        }
                        set_viewed_count()
                    }
                }

                //progress
                function update_progress(id_data_key){
                    // log('---------update_progress----------', id)
                    if($('#hhh_style_progress').length <= 0){
                        append_style($('.video-pod__body'), 'hhh_style_progress',
                            `
                                .hhh-video-seek, .hhh-viewed {
                                    color: inherit;
                                }
                                .hhh_scroll_to_top {
                                    cursor: pointer;
                                    position: relative;
                                    top: 4px;
                                }
                                .hhh-multi-page-li {
                                    position: relative;
                                }
                                .hhh-multi-page-progress {
                                    position: absolute;
                                    pointer-events:none;
                                    left: 0px;
                                    /*top: 0px;*/
                                    background-color: rgb(0 255 255 / 0.12);
                                    border-right: none;
                                    /*height: 36|30px;*/
                                }
                                .hhh-multi-page-progress-border-right {
                                    position: absolute;
                                    pointer-events:none;
                                    left: 0px;
                                    /*top: 0px;*/
                                    background-color: #00000000;
                                    border-right: 1px solid #ffbbbb;
                                    /*height: 36|30px;*/
                                }
/*                                 .hhh_check_mark {
                                    position: absolute;
                                    margin-left: 4px;
                                } */
                            `
                        )
                    }

                    //用颜色标明进度百分比
                    const obj = get_obj()
                    if(obj?.progress_list === undefined) return

                    //画进度条和百分比
                    function draw_progress(id, currentTime){
                        let $item = get_base_$item(id)
                        let height = '31px'

                        //创建
                        if($item.find('.hhh-multi-page-progress').length <= 0){
                            $item.append(`<div class="hhh-multi-page-progress" style="height: ${height}"></div>`)
                        }

                        //刷新
                        let $progress = $item.find('.hhh-multi-page-progress')
                        let $duration = $item.find('.stat-item.duration')
                        let $check_mark = $item.find('.hhh_check_mark')
                        if(currentTime === -1){  //-1代表已看完，加 √
                            $progress.width(`100%`)
                            if($check_mark.length <= 0) $duration.append('<span class="hhh_check_mark">√</span>')
                        }else{
                            const cent = (currentTime / timestr_to_second($duration.text())) * 100
                            $progress.width(`${cent}%`)
                            $check_mark.remove()  //去掉 √ 如果有
                        }
                    }
                    
                    let slice = id_data_key === undefined ? obj.progress_list : {[id_data_key]: obj.progress_list[id_data_key]}

                    for(let [id, currentTime] of Object.entries(slice)){
                        draw_progress(id, currentTime)
                    }
                }

                // Test
                let timeEnd = console.timeEnd
                let log = (...args)=>{0 && console.log(...args)}
                timeEnd = ()=>{}

                //inti sort
                class ListSort{
                    // log('-----init__sort-----')

                    /* 分为2个函数，一个list插入播放量等信息，一个只处理排序，包括插入head和排序事件
                       
                    */
                    //list插入播放量等
                        //清理旧状态
                    // $('.hhh_episode_view').remove()
                    // $('#hhh_style_episode').remove()
                    //     //前置检查
                    // if(open === OFF) { return false }
                    // if(['合集', '视频选集'].includes(video_type) === false) return false // '视频选集', '合集', '收藏列表'
                        //获取数据
                        //渲染UI
                        //应用样式
                        //对齐内部表格
                        
                    //添加排序功能
                        //创建排序表头
                        //根据list item UI调整表头宽度
                        //绑定排序事件

                    //判断是否是同一个item，如是则不改变宽度
                    // log('判断是否是同一个item2', $('.video-pod')[0].hhh_sort_slide_id, get_slide_id())
                    // if($('.video-pod')[0].hhh_sort_slide_id === get_slide_id() && change_width === OFF) return
                    // $('.video-pod')[0].hhh_sort_slide_id = get_slide_id()

                    static is_addDateKey = config.getCheckboxSettingStatus('addDateKey') && video_type === '合集'

                    // ====================================================================
                    // ==================== 添加和格式化合集等列表项目 ====================
                    // ====================================================================
                    static AddAndFormatPodItem = {
                        //清理旧状态
                        cleanup(){
                            $('.hhh_episode_view').remove()
                            $('#hhh_style_episode').remove()
                        },

                        //前置检查
                        is_run(open, video_type){
                            return open === ON && ['合集', '视频选集'].includes(video_type) === true

                            // if(open === OFF) { return false }
                            // if(['合集', '视频选集'].includes(video_type) === false) return false // '视频选集', '合集', '收藏列表'
                        },
                        
                        // ==================== 数据获取模块 ====================
                        //取得【views, dms, durations, show_views, show_dms】【date】
                        DataFetcher: {
                            get_合集_视频选集_$cur_list() { return $('.video-pod')[0].__vue__.podCurArcList },
                            get_合集_视频选集_counts() { return $('.video-pod')[0].__vue__.podCurArcList.length },
                            
                            get_合集_infos(){
                                function get_合集_episodes() { return $('.video-pod')[0].__vue__.sectionsInfo.sections[
                                    $('.video-pod__slide').length > 0 ? $('.slide-item.active').index() : 0
                                    ].episodes }
                                let podCurArcList = this.get_合集_视频选集_$cur_list()
                                let episodes = get_合集_episodes()
                                let views = {}, dms = {}, durations = {}, show_views = {}, show_dms = {}, data_keys = {}, pubdate = {}, show_pubdate = {}
                                podCurArcList.forEach((v,i) => {
                                    views[i] = episodes[i].arc.stat.view
                                    dms[i] = episodes[i].arc.stat.danmaku
                                    durations[i] = episodes[i].arc.duration
                                    show_views[i] = v.view
                                    show_dms[i] = v.danmaku
                                    data_keys[i] = v.bvid
                                    //可选
                                    pubdate[i] = episodes[i].arc.ctime
                                    //直接获取 YYYY-MM-DD（瑞典语本地化刚好是这个格式，前端常用的小技巧）
                                    show_pubdate[i] = new Date(episodes[i].arc.ctime*1000).toLocaleDateString('sv-SE')
                                    // show_pubdate[i] = new Date(episodes[i].arc.ctime*1000).Format("yyyy-MM-dd")
                                })
                                // log(views, dms, durations, show_views, show_dms)
                                return [views, dms, durations, show_views, show_dms, data_keys, pubdate, show_pubdate]
                            },

                            async get_视频选集_infos(){
                                function load_视频选集_dms(){
                                    function get_a_dm(cid, p){
                                        var xhr = new XMLHttpRequest()
                                        let url = `https://api.bilibili.com/x/v2/dm/web/view?type=1&oid=${cid}`
                                        // if(page.page == 2) { cid = 'xxx'; log('cid err'); url = `https://api.bilibili.com/x/v2/dm/web/view?type=1&oid=${cid}` }
                                        // if(page.page == 3) { log('url err'); url = `https://api.bilibili.com/x/v2/dm/web/viewxxxx?type=1&oid=${cid}` }
                                        xhr.open('GET', url, true)
                                        xhr.responseType = 'arraybuffer';  // 设置响应类型为 'arraybuffer' 以接收二进制数据
                                        xhr.onload = function() {
                                            if (xhr.status === 200) {
                                                dms[p] = 'status 200 err'
                                                let o = message.toObject(message.decode(new Uint8Array(xhr.response)))
                                                
                                                // console.log(cid, p, o.count)

                                                test_dms.push([p, o.count, cid])
                                                dms[p] = o.count ?? 0
                                            } else { dms[p] = 'status other err'; console.error('请求失败，状态码：', xhr.status) }
                                        }
                                        xhr.onerror = function(err){ dms[p] = 'onerror'; console.error('请求出错', err) }
                                        xhr.send()
                                    }
            
                                    let jsonDescriptor = JSON.parse('{"nested":{"bilibili":{"nested":{"community":{"nested":{"service":{"nested":{"dm":{"nested":{"v1":{"nested":{"DmWebViewReply":{"fields":{"count":{"type":"int64","id":8}}}}}}}}}}}}}}}')
                                    let Root = window.protobuf.Root.fromJSON(jsonDescriptor)
                                    let message = Root.lookupType("bilibili.community.service.dm.v1.DmWebViewReply")
                                    let test_dms = []
            
                                    let len = cids.length > 30000 ? 30000 : cids.length
                                    // len = 2
                                    for(let i=0; i<len; i++){
                                        if(typeof dms[i] !== 'number') get_a_dm(cids[i], i)
                                    }
                                }

                                function get_视频选集_pages() { return $('.video-pod')[0].__vue__.videoData.pages }
                                let podCurArcList = this.get_合集_视频选集_$cur_list()
                                let list_counts = this.get_合集_视频选集_counts()
                                let cids = podCurArcList.map((v)=>v.cid)
                                let dms = {}
                                cids.forEach((v,i)=> dms[i] = undefined)

                                // console.log(cids, dms)
                                load_视频选集_dms()
                        
                                log = console.log
                                //加载
                                log('数据共:', list_counts)
                                if(await isTimeout(()=>{
                                    function ready_data_count()   { return Object.values(dms).filter(v => typeof v === 'number' && v >= 0).length }
                                    // function insert_data_count()  { return Object.values(infos.dms).filter(v => typeof v === 'number' && v < 0).length }
                                    function unxhr_data_count()   { return Object.values(dms).filter(v => v === undefined).length }
                                    function xhr_err_data_count() { return Object.values(dms).filter(v => typeof v === 'string').length }
            
                                    let ready_count = ready_data_count()
                                    log('已读取:', ready_count)
                                    //加载完成
                                    if(ready_count === list_counts) { log('OK 加载完成:', ready_count); timeEnd('main'); console.time('main2'); return true }
                                    //如果还有未加载数据，继续等待读取
                                    let unxhr_count = unxhr_data_count()
                                    if(unxhr_count > 0) { log('还有未加载数据:', unxhr_count, '，继续'); return false }
                                    //上一轮加载循环完成，重新加载错误数据
                                    let xhr_err_count = xhr_err_data_count()
                                    if(xhr_err_count > 0) { log('上一轮加载循环完成，重新加载错误数据:', 'xhr_err_count'); load_视频选集_dms(); return false }
            
                                    return false
                                })) { err('load_视频选集_dms timeout'); return }

                                //durations, show_dms
                                let durations = {}, show_dms = {}, data_keys = {}
                                let pages = get_视频选集_pages()
                                pages.forEach((v,i)=>{
                                    durations[i] = pages[i].duration
                                    show_dms[i] = formatPlayCount(dms[i])
                                    data_keys[i] = pages[i].cid
                                })
                                
                                // log('dms:', dms, show_dms, durations)
                                return [dms, durations, show_dms, data_keys]
                            },

                            async get_infos(){
                                let infos = {}
                                if(video_type === '合集') { [infos.views, infos.dms, infos.durations, infos.show_views, infos.show_dms, infos.data_keys, infos.pubdate, infos.show_pubdate] = this.get_合集_infos() }
                                else if(video_type === '视频选集') { [infos.dms, infos.durations, infos.show_dms, infos.data_keys] = await this.get_视频选集_infos() }

                                log(infos.views, infos.dms, infos.durations, infos.show_views, infos.show_dms)
                                return infos
                            }
                        },

                        // ==================== view等节点插入模块 ====================
                        EpisodeInsert : {
                            //返回一个episode节点
                            create_episode_element(video_type, is_addDateKey){
                                //定义&克隆 view dm等
                                let $view = $('.video-info-detail-list .view.item:first').clone()
                                let $dm = $('.video-info-detail-list .dm.item:first').clone()

                                //定义episode
                                let $episode = $('<div class="hhh_episode_view"></div>')
        
                                if(video_type === '合集') $episode.append($view)
                                $episode.append($dm)

                                if(is_addDateKey) $episode.append($view.clone().find('svg').remove().end().removeClass('view').addClass('pubdate'))
        
                                return $episode
                            },

                            populate_element($el, i, [view, dm, duration, show_view, show_dm, data_key, pubdate, show_pubdate], is_addDateKey){
                                // 填充数据 - 使用原生 lastChild 操作速度最快
                                const viewNode = $el.find('.view')[0]
                                if (viewNode) viewNode.lastChild.textContent = show_view

                                const dmNode = $el.find('.dm')[0]
                                if (dmNode) dmNode.lastChild.textContent = show_dm

                                const pubNode = $el.find('.pubdate')[0]
                                if (pubNode) pubNode.lastChild.textContent = show_pubdate

                                $el.attr({
                                    'view'    : view,
                                    'dm'      : dm,
                                    'TM'      : duration,
                                    'real_idx': i,
                                    ...(is_addDateKey && {pubdate: pubdate})
                                })

                                return $el[0]
                            },

                            batch_insert(infos, video_type, is_addDateKey) {
                                console.time('---插入$episode1')

                                const $items = $('.video-pod__list .video-pod__item')
                                let $template = this.create_episode_element(video_type, is_addDateKey)
                                $items.each((i, el) => {
                                    // console.log(i,el,$episode)
                                    const $episode = $template.clone()
                                    const episode_node = this.populate_element($episode, i, [infos?.views?.[i], infos.dms[i], infos.durations[i], infos?.show_views?.[i], infos.show_dms[i], infos.data_keys[i], infos?.pubdate?.[i], infos?.show_pubdate?.[i]], is_addDateKey)
                                    const stats = el.querySelector('.stats')
                                    if(stats) stats.insertBefore(episode_node, stats.firstChild)
                                })

                                timeEnd('---插入$episode1')
                            },


                            inject_layout(){
                                const style_content = `
                                    .simple-base-item .stats {
                                        display: inline-flex;
                                        align-items: center;
                                        gap: 10px;
                                    }

                                    /* 1. 定义外层容器的基本文字属性 */
                                    .hhh_episode_view {
                                        display: inline-flex;
                                        align-items: center;
                                        color: var(--text3);
                                        font-size: 12px;
                                        gap: 10px;
                                        /* margin-right: 5px; */
                                    }

                                    /* 2. 定义内部各项的公共布局 (Flex 对齐) */
                                    .hhh_episode_view .view, 
                                    .hhh_episode_view .dm, 
                                    .hhh_episode_view .pubdate {
                                        display: inline-flex;
                                        align-items: center; /* 垂直居中 */
                                        justify-content: center; /* 两端对齐预留空间 */
                                        background2: #61666d;
                                        /* margin-right: 4px; */
                                    }

                                    /* 3. 修正 SVG 大小 (使用 :is 简化选择器) */
                                    .hhh_episode_view :is(.view, .dm) svg {
                                        width: 12px !important;
                                        height: 12px !important;
                                        fill: currentColor; /* 颜色跟随文字 */
                                    }

                                    /* 4. 单独微调 .dm 的间距 */
                                    .hhh_episode_view .dm {
                                        /* margin-right: 7px; */
                                    }

                                    /* 2-2. 统一数据列样式 */
                                    .simple-base-item .stat-item {
                                        text-align: right;
                                        background2: #61666d;
                                    }

                                    /* 2-2. 统一数据列样式 */
                                    .simple-base-item .title {
                                        background2: #61666d;
                                    }
                                `

                                const style_id = 'hhh_style_episode'
                                $(`#${style_id}`).remove()
                                
                                $('<style>')
                                    .attr('id', style_id)
                                    .html(style_content)
                                    .appendTo('.video-pod:first')
                            },


                            get_max_width(selectors, is_reset_width = false) {
                                const views = document.querySelectorAll(selectors);
                                let maxWidth = 0;

                                // 1. 重置宽度，让浏览器重新计算自然宽度
                                is_reset_width && views.forEach(el => el.style.width = 'max-content')

                                // 2. 找出最宽的像素值
                                views.forEach(el => {
                                    const width = el.getBoundingClientRect().width;
                                    //if(width>461) console.log(width, el)
                                    if (width > maxWidth) maxWidth = width;
                                });
                                
                                is_reset_width && views.forEach(el => el.style.width = '')

                                return maxWidth
                            },

                            set_max_width(selectors, max_width) {
                                const views = document.querySelectorAll(selectors)
                                views.forEach(el => el.style.width = max_width)
                            },

                            align_poditem_columns(){
                                let max_w_view = this.get_max_width('.video-pod__item .view') + 2
                                let max_w_dm   = this.get_max_width('.video-pod__item .dm') + 2
                                let max_w_pubdate = this.get_max_width('.video-pod__item .pubdate') + 2

                                const check_marks = document.querySelectorAll('.video-pod__item .stat-item .hhh_check_mark')
                                check_marks.forEach(el => el.style.display = 'none')
                                let max_w_duration = this.get_max_width('.video-pod__item .stat-item') + ($('.video-pod__item:first .stat-item')[0].style.width === '' ? 2 + 15 : 0)
                                check_marks.forEach(el => el.style.display = '')

                                this.set_max_width('.video-pod__item .view', max_w_view+'px')
                                this.set_max_width('.video-pod__item .dm', max_w_dm+'px')
                                this.set_max_width('.video-pod__item .pubdate', max_w_pubdate+'px')
                                this.set_max_width('.video-pod__item .stat-item', max_w_duration+'px')
                            },

                        },

                        async init(open, video_type){
                            this.cleanup()
                            if(this.is_run(open, video_type) === false) return false
                            let infos = await this.DataFetcher.get_infos()
                            this.EpisodeInsert.batch_insert(infos, video_type, ListSort.is_addDateKey)
                            this.EpisodeInsert.inject_layout()
                            this.EpisodeInsert.align_poditem_columns()
                        }

                    }

                    // ====================================================================
                    // ======================== 添加排序表头、排序 ========================
                    // ====================================================================
                    static SortManager = {
                        create_header_node(header_column_names){
                            // let [Index, Title, View, DM, TM] = ['重置', 'Title', 'View', 'DM', 'TM']
                            $('#hhh_listsort').remove()
                            $('.video-pod__body').before(` 
                                <div id="hhh_listsort">
                                    ${(function add_span(){
                                        let spans = ''
                                        header_column_names.forEach((v)=>{ spans += `<span class="hhh-listsort-head" sort="none" > ${v}</span>` })
                                        return spans
                                    })()}
                                </div>
                            `)
                        },

                        get_header_item_width(is_addDateKey){
                            const max_w = {}
                            const $pod = $('.video-pod__item:first')
                            const pod = $pod[0]

                            // 1. 记录原始样式
                            const originalStyle = pod.style.cssText
                            if (video_type === '合集' ) pod.style.display = 'block'

                            console.log($pod.find('.title')[0].getBoundingClientRect().width)

                            max_w.max_w_title    = $pod.find('.title')[0].getBoundingClientRect().width
                            max_w.max_w_view     = $pod.find('.view')?.[0]?.getBoundingClientRect().width
                            max_w.max_w_dm       = $pod.find('.dm')[0].getBoundingClientRect().width
                            max_w.max_w_pubdate  = $pod.find('.pubdate')?.[0]?.getBoundingClientRect().width
                            max_w.max_w_duration = $pod.find('.stat-item')[0].getBoundingClientRect().width

                            // const $video_pod_item = $('.video-pod__item:first')
                            const $item = video_type === '合集' ? $pod.find('.simple-base-item:first'): $pod
                            const $stats = $pod.find('.stats:first')
                            const $episode = $pod.find('.hhh_episode_view:first')

                            const item_padding  = parseInt($item.css('padding-left')) || 0
                            const stats_margin_left = parseInt($stats.css('margin-left')) || 0
                            const stats_gap = parseInt($stats.css('gap')) || 0
                            const episode_gap = parseInt($episode.css('gap')) || 0
                        
                            // 4. 立即还原
                            pod.style.cssText = originalStyle
                            
                            const w_reset    = 32
                            const w_title    = max_w.max_w_title + item_padding + stats_margin_left/2 - w_reset
                            const w_view     = Math.max(max_w.max_w_view, 1) + stats_margin_left/2 + episode_gap/2
                            // const w_view     = 0
                            const w_dm       = Math.max(max_w.max_w_dm, 1) + episode_gap/2 + (is_addDateKey ? episode_gap/2 : stats_gap/2)
                            const w_pubdate  = is_addDateKey ? Math.max(max_w.max_w_pubdate, 1) + episode_gap/2 + stats_gap/2 : 0
                            const w_duration = Math.max(max_w.max_w_duration, 1) + stats_gap/2 + item_padding

                            console.log('max_w',max_w, w_title)

                            let widths
                            if (video_type === '合集') {
                                // [重置, Title, View, DM, Date(opt), TM]
                                widths = [
                                    w_reset,        // '重置' 按钮固定宽度
                                    w_title,        // 'Title' 涵盖标题区域并减去重置按钮
                                    w_view,         // 'View'
                                    w_dm,           // 'DM'
                                    w_duration      // 'TM'
                                ]
                            } else {
                                // [重置, Title, DM, Date(opt), TM]
                                widths = [
                                    w_reset, 
                                    w_title, 
                                    w_dm, 
                                    w_duration
                                ]
                            }

                            // 如果有日期，在 TM 前插入日期宽
                            if (is_addDateKey) {
                                widths.splice(widths.length - 1, 0, w_pubdate)
                            }

                            log('widths:', widths)

                            return widths
                        },

                        //Sort Head CSS
                        inject_layout(widths){
                            $('#hhh_style_listsort').remove()
                            const item_template = widths.join('px ') + 'px'
                            const styleContent = `
                                /* 1. 设置列表项容器为 Grid 布局 */
                                #hhh_listsort {
                                    display: grid;
                                    grid-template-columns: ${item_template};
                                    gap: 0px;
                                    align-items: center;
                                    width: 100%;
                                    line-height:18px;
                                    /* padding: 0 10px; */
                                    box-sizing: border-box;
                                    margin-left: ${parseInt($('.video-pod__body').css('margin-left')) + parseInt($('.video-pod__list').css('margin-left'))}px;
                                    margin-top: ${video_type === '合集' ? '0px' : '10px'};
                                    margin-bottom: 1px;
                                }
                                .hhh-listsort-head:first-of-type {
                                    background-image: none !important;
                                }
                                .hhh-listsort-head {
                                    background-repeat: no-repeat;
                                    background-position: center right;
                                    padding: 4px 0px 4px 0px;
                                    white-space: normal;
                                    cursor: pointer;
                                    border: 1px solid #cdcdcd;
                                    border-right-width: 0px;
                                    background-color: #99bfe6;  /*#99bfe6*/
                                    background-image: url(data:image/gif;base64,R0lGODlhFQAJAIAAACMtMP///yH5BAEAAAEALAAAAAAVAAkAAAIXjI+AywnaYnhUMoqt3gZXPmVg94yJVQAAOw==);
                                    font-weight: bold;
                                    text-shadow: 0 1px 0 rgb(204 204 204 / 70%);
                                    opacity: 0.7;
                                    user-select: none;
                                    white-space: pre;

                                    /*background-color: #9fbfdf;*/
                                    /*background-image: url(data:image/gif;base64,R0lGODlhFQAEAIAAACMtMP///yH5BAEAAAEALAAAAAAVAAQAAAINjI8Bya2wnINUMopZAQA7); ascending*/
                                    /*background-image: url(data:image/gif;base64,R0lGODlhFQAEAIAAACMtMP///yH5BAEAAAEALAAAAAAVAAQAAAINjB+gC+jP2ptn0WskLQA7); descending*/
                                }
                                .hhh-listsort-head-asc {
                                    /*opacity: 0.91;*/
                                    background-image: url(data:image/gif;base64,R0lGODlhFQAEAIAAACMtMP///yH5BAEAAAEALAAAAAAVAAQAAAINjI8Bya2wnINUMopZAQA7);
                                }
                                .hhh-listsort-head-desc {
                                    /*opacity: 0.91;*/
                                    background-image: url(data:image/gif;base64,R0lGODlhFQAEAIAAACMtMP///yH5BAEAAAEALAAAAAAVAAQAAAINjB+gC+jP2ptn0WskLQA7);
                                }
                            `
                            $('<style>')
                                .attr('id', 'hhh_style_listsort')
                                .html(styleContent)
                                .appendTo('.video-pod:first')
                        },

                        refresh_header_layout(){
                            // console.log('===refresh_header_layout')
                            const widths = this.get_header_item_width(ListSort.is_addDateKey)
                            this.inject_layout(widths)
                        },

                        //加入排序HEAD
                        add_header(is_addDateKey, header_column_names){
                            this.create_header_node(header_column_names)
                            let widths = this.get_header_item_width(is_addDateKey)
                            this.inject_layout(widths)
                        },
                        
                        sort(is_addDateKey, header_column_names){
                            //['重置', 'Title', 'View', 'DM', 'TM', 'TM_str', 'View_fmt', 'DM_fmt'] ...
                            
                            //【listsort】事件
                            //video-section-list section-0 section-1 section-2 ...
                            function store(){
                                let $video_items = $('.video-pod__list>.video-pod__item')
                                let video_items_array = Array.from($video_items)
                                return video_items_array
                            }
                            function bulid_sort_arr(video_items_array, is_addDateKey){
                                let unsorted_data_columns_arr = []
                                //保存排序数据
                                console.time('bulid_sort_arr')
                                $(video_items_array).each((i,v)=>{
                                    let $v = $(v)
                                    let Title = $v?.find('.title')?.attr('title')

                                    let $episode = $v.find('.hhh_episode_view')
                                    let [real_idx, View, DM, Date, TM] = [+$episode.attr('real_idx'), +$episode.attr('view'), +$episode.attr('dm'), +$episode.attr('pubdate'), +$episode.attr('TM')]

                                    // '合集' ? ['重置', 'Title', 'View', 'DM', 'TM'] : ['重置', 'Title', 'DM', 'TM']
                                    let unsorted_data_columns = video_type === '合集' ? [real_idx, Title, View, DM, TM] : [real_idx, Title, DM, TM]
                                    if(is_addDateKey) unsorted_data_columns.splice(unsorted_data_columns.length - 1, 0, Date)
                                        
                                    // let header_column_names = video_type === '合集' ? ['重置', 'Title', 'View', 'DM', 'TM'] : ['重置', 'Title', 'DM', 'TM']
                                    // if(ListSort.is_addDateKey) header_column_names.splice(header_column_names.length - 1, 0, 'Date')

                                    // log(header_column_names, unsorted_data_columns)
                                    unsorted_data_columns_arr.push(unsorted_data_columns)
                                })
                                timeEnd('bulid_sort_arr')
                                return unsorted_data_columns_arr
                            }
                            function arr_sort(unsorted_data_columns_arr, order, i){  //ascending, descending
                                let sorted_data_columns_arr
                                if(order === 'ascending') {
                                    sorted_data_columns_arr = [...unsorted_data_columns_arr].sort(function(a, b) {
                                        if(typeof a[i] === 'string'){
                                            return a[i].localeCompare(b[i])
                                        }else{
                                            return a[i] - b[i]
                                        }
                                    })
                                }else if(order === 'descending') {
                                    sorted_data_columns_arr = [...unsorted_data_columns_arr].sort(function(b, a) {
                                        if(typeof a[i] === 'string'){
                                            return a[i].localeCompare(b[i])
                                        }else{
                                            return a[i] - b[i]
                                        }
                                    })
                                }else{err('[arr_sort] Out of range')}
                                return sorted_data_columns_arr
                            }
                            function restore(sorted_data_columns_arr, unsorted_data_columns_arr, video_items_array){
                                //建立排序后和真实顺序的对应关系，范围：1~length
                                let real_to_draw = []
                                unsorted_data_columns_arr.forEach(function(v,i){
                                    real_to_draw[v[0]] = i
                                })

                                let new_video_items_array = []
                                sorted_data_columns_arr.forEach(function(v,i){
                                    new_video_items_array[i] = video_items_array[real_to_draw[v[0]]]
                                    // log(i,v,v[0],real_to_draw[v[0]])
                                })

                                let video_list = $('.video-pod__list')[0]
                                video_list.replaceChildren(...new_video_items_array)
                                // video_list.innerHTML = ''
                                // new_video_items_array.forEach(function(v,i){
                                //     video_list.appendChild(v)
                                // })
                            }

                            //list_sort
                            function list_sort(order, i, is_addDateKey){
                                //[index, Title, View, DM, tm_str, TM, view_fmt, dm_fmt] = [0, 1, 2, 3, 4, 5, 6, 7]
                                //let header_column_names = ['重置', 'Title', 'View', 'DM', 'TM_str', 'TM', 'View_fmt', 'DM_fmt']
                                let video_items_array = store()
                                
                                let unsorted_data_columns_arr = bulid_sort_arr(video_items_array, is_addDateKey)

                                let sorted_data_columns_arr = arr_sort(unsorted_data_columns_arr, order, i)
                                
                                restore(sorted_data_columns_arr, unsorted_data_columns_arr, video_items_array)
                            }

                            $('#hhh_listsort').off('click.hhh_listsort')
                            $('#hhh_listsort').on('click.hhh_listsort', function(e){

                                $('.hhh-listsort-head').css('opacity', 0.7)

                                let $head = $(e.target)
                                let sort = $head.attr('sort')
                                let text = $head.text().trim()
                                $head.css('opacity', 0.91)
                                
                                if(sort === 'none'){
                                    $head.attr('sort', 'descending')
                                        .removeClass('hhh-listsort-head-asc')
                                        .addClass('hhh-listsort-head-desc')
                                }else if(sort === 'ascending'){
                                    $head.attr('sort', 'descending')
                                        .removeClass('hhh-listsort-head-asc')
                                        .addClass('hhh-listsort-head-desc')
                                }else if(sort === 'descending'){
                                    $head.attr('sort', 'ascending')
                                        .removeClass('hhh-listsort-head-desc')
                                        .addClass('hhh-listsort-head-asc')
                                }else{err('[hhh_listsort click] Out of range')}

                                if(text === '重置'){
                                    list_sort('ascending', header_column_names.indexOf(text), is_addDateKey)
                                    $('.hhh-listsort-head').removeClass('hhh-listsort-head-asc')
                                                        .removeClass('hhh-listsort-head-desc')
                                }else{
                                    console.time('click.hhh_listsort')
                                    list_sort($head.attr('sort'), header_column_names.indexOf(text), is_addDateKey)
                                    timeEnd('click.hhh_listsort')
                                }

                                // reals_to_draws = bulid_real_to_draw()
                                // log('click.hhh_listsort:', reals_to_draws)
                                
                            })
                        },

                        init(){
                            $('#hhh_listsort').off('click.hhh_listsort').remove()
                            $('#hhh_style_listsort').remove()
                            if($('.hhh_episode_view').length <= 0) return
                            
                            let header_column_names = video_type === '合集' ? ['重置', 'Title', 'View', 'DM', 'TM'] : ['重置', 'Title', 'DM', 'TM']
                            if(ListSort.is_addDateKey) header_column_names.splice(header_column_names.length - 1, 0, 'Date')
                            this.add_header(ListSort.is_addDateKey, header_column_names)
                            this.sort(ListSort.is_addDateKey, header_column_names)
                        }
                    }

                    static async init(open, video_type){
                        console.time('sort_main')
                        requestAnimationFrame(()=>true)
                        await this.AddAndFormatPodItem.init(open, video_type)
                        this.SortManager.init()
                        requestAnimationFrame(()=>false)                    
                        timeEnd('sort_main')
                    }
                    
                }

                function change_title_width(){
                    log('------change_title_width------')

                    //判断是否是同一个item，如是则不改变宽度
                    // log('判断是否是同一个item', $('.video-pod')[0].hhh_change_width_slide_id, get_slide_id())
                    // log('判断是否是同一个item', $('.right-container').width())
                    if($('.video-pod')[0].hhh_change_width_slide_id === get_slide_id()) return
                    $('.video-pod')[0].hhh_change_width_slide_id = get_slide_id()
                    $('.video-pod')[0].hhh_sort_slide_id = undefined

                    // 重构后的 expand_title 函数
                    async function expand_title(open = ON, default_title_diff_width = 300){
                        g_fn_arr[expand_title.name] = expand_title

                        // const BREAKPOINT = 1680
                        // const WIDTH_NARROW = 350
                        const WIDTH_WIDE = 411

                        //记录初始差值
                        const title_ = $('.video-pod__list .title:first').outerWidth(true)
                        const right_ = $('.right-container').width()
                        const BASE_WIDTH_DIFF = right_ - title_
                        // console.log('title', title_, 'right', right_, 'right-title', BASE_WIDTH_DIFF)

                        const STATE = {
                            OFF: 'switch-btn',
                            HALF: 'switch-btn halfon-forward',
                            ON: 'switch-btn on',
                            HALF_BACK: 'switch-btn halfon-backward'
                        }

                        //替换b站setSize函数，加宽right-container后，缩放时正确响应，默认411
                        window.hhh_right_container_width = WIDTH_WIDE
                        window.setSize =  function() {
                            var e = window.isWide
                            , i = window.innerHeight
                            , t = Math.max(document.body && document.body.clientWidth || window.innerWidth, 1100)
                            //, n = 1680 < innerWidth ? 411 : 350 
                            //, n = new_w < 411 ? 411 : new_w > (t - 112 - 668) ? (t - 112 - 668) : new_w
                            , n = window.hhh_right_container_width
                            , r = parseInt(16 * (i - (1690 < innerWidth ? 318 : 308)) / 9)
                            , o = t - 112 - n
                            , a = o < r ? o : r;
                            a < 668 && (a = 668),
                            1694 < a && (a = 668);
                            var d, l = a + n;
                            window.isWide && (l -= 125,
                            a -= 100),
                            d = window.hasBlackSide && !window.isWide ? Math.round((a - 14 + (e ? n : 0)) * (9 / 16) + (1680 < innerWidth ? 56 : 46)) + 96 : Math.round((a + (e ? n : 0)) * (9 / 16)) + (1680 < innerWidth ? 56 : 46);
                            var c = l - n;
                            console.log('l',l,'a',a,'n',n,'l - (e ? -30 : n) + "px"', l - (e ? -30 : n))
                            var s = constructStyleString(".video-container-v1", {
                                width: "auto",
                                padding: "0 10px"
                            }) + constructStyleString(".left-container", {
                                width: l - n + "px"
                            }) + constructStyleString("#bilibili-player", {
                                width: l - (e ? -30 : n) + "px",
                                height: d + "px",
                                position: e ? "relative" : "static"
                            }) + constructStyleString("#oldfanfollowEntry", {
                                position: "relative",
                                top: e ? d + 28 - 18 + "px" : "0"
                            }) + constructStyleString("#danmukuBox", {
                                "margin-top": e ? d + 28 + "px" : "0"
                            }) + constructStyleString("#playerWrap", {
                                height: d + "px"
                            }) + constructStyleString(".video-discover", {
                                "margin-left": (l - n) / 2 + "px"
                            });
                            setSizeStyle.innerHTML = s
                        }

                        $('#hhh_expand_title .switch-btn')?.removeClass('on')?.removeClass('halfon-forward')?.removeClass('halfon-backward')
                        $('#hhh_expand_title')?.remove()
                        if(open !== ON) return false
                        if(video_type !== '合集') return false

                        const $next_button = $('.auto-play:contains(自动连播)')
                        $next_button.clone().appendTo($('.header-top>.right'))
                            .attr({id: 'hhh_expand_title', title: ''})
                            .css({'margin-top': '5px'})
                            .find('.txt').text('展开标题').end()
                            .parent().css({display: 'flex', 'flex-direction': 'column'})
                        $('#hhh_expand_title .switch-btn')[0].style.setProperty('--switch-btn-width','40px')

                        $('#hhh_style_expand_title').remove()
                        if($('#hhh_style_expand_title').length <= 0){
                            append_style($('#hhh_expand_title'), 'hhh_style_expand_title', `
                                #hhh_expand_title .switch-btn.halfon-forward,
                                #hhh_expand_title .switch-btn.halfon-backward {
                                    background: var(--Lb6);
                                }
                                #hhh_expand_title .switch-btn.halfon-forward .switch-block,
                                #hhh_expand_title .switch-btn.halfon-backward .switch-block {
                                    left: calc(calc(var(--switch-btn-width) - var(--switch-btn-height)) / 2 + var(--switch-btn-gap));
                                }
                            `)
                        }

                        tip_create_3_X({
                            target: $('#hhh_expand_title'),
                            tip_target: $('#hhh_tip'),
                            gap: 6,
                            title: `展开标题，Title默认增加宽度: ${config.getCheckboxSettingArgs('expandTitle', 'width')}px | 最大宽度`
                        })
                        
                        function limit_width(right_container_width){
                            const t = Math.max(document.body && document.body.clientWidth || window.innerWidth, 1100)
                            let limit_right_container_width = Math.max(411, Math.min(right_container_width, t - 112 - 668))
                            // console.log('t',t, 'old_right_container_width', $('.right-container').width(), 'right_container_width', right_container_width, 'limit_right_container_width', limit_right_container_width)
                            return limit_right_container_width
                        }

                        function get_title_max_width() {
                            const $items = $('.video-pod__list .title-txt')
                            if ($items.length === 0) return { current: 0, max: 0 }

                            const canvas = get_title_max_width.canvas || (get_title_max_width.canvas = document.createElement('canvas'))
                            const ctx = canvas.getContext('2d')

                            if (!get_title_max_width.font) {
                                const style = window.getComputedStyle($items[0])
                                get_title_max_width.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
                            }
                            ctx.font = get_title_max_width.font

                            let max_txt_width = 0
                            let arr = []
                            $items.each((i, v) => {
                                const width = ctx.measureText($(v).text().trim()).width
                                arr.push(width)
                                if (width > max_txt_width) max_txt_width = width
                            })

                            // max_txt_width = arr.sort()[parseInt(arr.length*0.95)]
                            const gif_width = $('.video-pod__list .playing-gif:first').outerWidth(true)
                            // console.log('max_txt_width', max_txt_width)
                            // console.log('old_title_width', $('.video-pod__list .title:first').outerWidth(true),'maxWidth', parseInt(max_txt_width + gif_width) + 1)
                            return parseInt(max_txt_width + gif_width) + 1
                        }

                        const $switch_button = $('#hhh_expand_title .switch-btn')

                        function handle_event(class_name){
                            $switch_button[0].className = class_name

                            let title = $('.video-pod__list .title:first').outerWidth(true)
                            let right = $('.right-container').width()
                            // log('title', title, 'right', right, 'right-title', right-title)
                            
                            let new_right_container_width = WIDTH_WIDE
                            let title_max_width = 0
                            // const old_right_container_width = $('.right-container').width()
                            // const old_title_width = $('.video-pod__list .title:first').outerWidth(true)

                            const default_title_width =  parseInt(default_title_diff_width)

                            if(default_title_width === 0){
                                new_right_container_width = limit_width(WIDTH_WIDE)
                            }if(default_title_width === -1){
                                title_max_width = get_title_max_width()
                                new_right_container_width = title_max_width + BASE_WIDTH_DIFF
                                config.setCheckboxSettingArgs('expandTitle', 'is_expand', ON)
                            }else{
                                const is_off = class_name === STATE.OFF
                                config.setCheckboxSettingArgs('expandTitle', 'is_expand', is_off ? OFF : ON)

                                if(!is_off){
                                    title_max_width = get_title_max_width()
                                    new_right_container_width = class_name === STATE.ON
                                        ? title_max_width + BASE_WIDTH_DIFF
                                        : default_title_width + BASE_WIDTH_DIFF
                                }
                            }
                            config.storageCheckboxSetting()

                            // const container = setSize2(diffW)
                            // set_right_container_width(container.left_container_width, container.right_container_width)
                            new_right_container_width = limit_width(new_right_container_width)
                            window.hhh_right_container_width = new_right_container_width
                            $('.right-container').width(new_right_container_width)
                            ListSort.SortManager.refresh_header_layout()
                        }

                        $('#hhh_expand_title').off('click.hhh_expand_title')
                        $('#hhh_expand_title').on('click.hhh_expand_title', function(){
                            const states = [STATE.OFF, STATE.HALF, STATE.ON, STATE.HALF_BACK]
                            const current = $switch_button[0].className
                            const next = states[(states.indexOf(current) + 1) % states.length]
                            
                            console.time('hhh_expand_title')
                            handle_event(next)
                            window.setSize()
                            timeEnd('hhh_expand_title')
                        })

                        handle_event(config.getCheckboxSettingArgs('expandTitle', 'is_expand') ? STATE.HALF : STATE.OFF)
                    }
                    expand_title(config.getCheckboxSettingStatus('expandTitle'), config.getCheckboxSettingArgs('expandTitle', 'width'))

                    function drap_sections(){
                        $('.base-video-sections-v1').off('mousemove.hhh').off('mousedown.hhh')

                        function fn_move(e){
                            let b = $('.base-video-sections-v1')[0]
                            let r = b.getBoundingClientRect()
                            let diffX = e.clientX - r.x;//鼠标距box边框的距离
                            let diffY = e.clientY - r.y;

                            log(diffX,diffY,r.x,r.y,r.width,r.height,e.clientX,e.clientY)

                            let is_open = config.getCheckboxSettingStatus('expandTitle') && config.getCheckboxSettingArgs('expandTitle', 'is_expand')
                            if(diffX > r.width-5 && is_open) $(this).css({cursor: 'w-resize'})
                            else $(this).css({cursor: ''})
                        }
                        $('.base-video-sections-v1').on('mousemove.hhh', fn_move)

                        $('.base-video-sections-v1').on('mousedown.hhh', function(e){
                            log($(this).css('cursor'))
                            if($(this).css('cursor') === 'w-resize'){
                                $('.base-video-sections-v1').off('mousemove.hhh')
                                let $down_this = $(this)
                                log('drapStart')
                                let doc = document
                                let begin_x = e.clientX
                                let begin_w = $('.base-video-sections-v1').width()
                                
                                doc.onmousemove = function(e){
                                    log('--onmove--')
                                    let diffX = e.clientX - begin_x
                                    log(diffX,e.clientX,begin_x)
                                    $('.base-video-sections-v1').width(begin_w+diffX)
                                    expand_title(config.getCheckboxSettingStatus('expandTitle'), config.getCheckboxSettingArgs('expandTitle', 'width'))
                                    return false
                                }
                        
                                doc.onmouseup = function(){
                                    //清除事件
                                    log('--onup--')
                                    doc.onmousemove = null;
                                    doc.onmouseup = null;
                        
                                    $down_this.css({cursor: ''})
                                    
                                    $('.base-video-sections-v1').off('mousemove.hhh').on('mousemove.hhh', fn_move)
                                    
                                    return false
                                }
                            }
                            //$(this).css({cursor: 'w-resize'})
                        })
                    }
                }

                //视频列表加长后，调节点击视频后滚动到中间
                function new_video_scroll(){
                    if(LIST_TYPE !== VIDEO_LIST) return

                    let func = $('.base-video-sections-v1')[0]?.__vue__?.openSectionAndScrollToVideo
                    // log($('.base-video-sections-v1')[0]?.__vue__?.openSectionAndScrollToVideo)

                    if(func === undefined) return

                    // log('---openSectionAndScrollToVideo---')
                    try {
                        let t = Object.prototype.toString.call(func).slice(1,-1).split(' ')[1]
                        // log(t)
                        if(t.includes('Proxy') === true) return

                        func[Symbol.toStringTag] = 'Proxy-' + t

                        let handler = {
                            apply(target, ctx) {
                                // log(ctx.curVideoIndex)
                                let h = parseInt($('.video-episode-card')[1]?.offsetTop - $('.video-episode-card')[0]?.offsetTop)
                                h = isNaN(h) === true ? 34 : h
                                let $list = $('.video-sections-content-list')
                                let count = parseInt(($list[0]?.offsetTop + $list.height()/2 - 0 - 140) / h)  //计算大约需要多滚动几个item

                                function draw_to_real(idx){
                                    if(+idx < 0) idx = 0
                                    if($('.hhh_episode_view').length <= 0) return +idx
                                    return +$($('.hhh_episode_view').get(idx)).attr('real_idx') - 1
                                }
                                function real_to_draw(section_idx, video_idx){
                                    let draw_idx = video_idx
                                    $(`.video-section-list.section-${section_idx} .hhh_episode_view`).each((i,v)=>{
                                        if(+$(v).attr('real_idx') === video_idx+1) {
                                            draw_idx = i
                                            return false
                                        }
                                    })
                                    return draw_idx
                                }

                                let real_idx = ctx.curVideoIndex
                                let draw_idx = real_to_draw(ctx.curSectionIndex, ctx.curVideoIndex)
                                // log(real_idx, draw_idx, draw_to_real(draw_idx - count), count, draw_idx - count, $('.video-sections-item')[ctx.curSectionIndex].offsetTop)

                                ctx.curVideoIndex = draw_to_real(draw_idx - count)

                                Reflect.apply(...arguments)
                                // log('real_idx:', real_idx, 'draw_idx:', draw_idx, 'count:', count, 'draw_idx - count', draw_idx - count, 'ctx.curVideoIndex:', ctx.curVideoIndex)
                                if(draw_idx - count < 0){  //后续保证滚动到中间
                                    let middle = parseInt($list.height()/2 - h/2)
                                    $list.animate({ scrollTop: $(`.video-section-list.section-${ctx.curSectionIndex} .video-episode-card:eq(${draw_idx})`)[0].offsetTop - $list[0].offsetTop - middle }, 2000)
                                }

                                ctx.curVideoIndex = real_idx

                                // t.prototype.onEnded = function() {
                                //     this.bufferAtom.checkBufferStatus(!1),
                                //     this.bufferAtom.checkLaggingStatus(!1),
                                //     this.patchAdvStore.hasLeftVideoToPlay() ? this.rootPlayer.emit(s.p.PATCH_ADV_PLAY_ENDED) : this.rootPlayer.emit(s.p.MEDIA_ENDED)
                                // }
                            },
                        }
                        $('.base-video-sections-v1')[0].__vue__.openSectionAndScrollToVideo = new Proxy(func, handler)
                    } catch (error) {
                        console.error(error);
                        // Expected output: ReferenceError: nonExistentFunction is not defined
                        // (Note: the exact output may be browser-dependent)
                    }
                }

                function other(){
                    //const [MULTI_P, VIDEO_LIST, ACTION_LIST, NORMAL_VIDEO] = ['视频选集', '合集', '收藏列表', '常规视频']  //视频选集/合集（选集是单个BV号，合集是多个BV号）
                    //标红当前播放条目，默认不够醒目
                    // $('.video-pod__list .simple-base-item .title-txt').css({'color': 'var(--text1)'})
                    // $('.video-pod__list .simple-base-item.active .title-txt').css({'color': 'var(--brand_blue)'})
                }

                function once(){
                    if(video_type !== '合集') return false  //不是合集
                    /////////////////////////////////
                    //totle-view添加totle-dm
                    let $total_view = $('#hhh_mysections_head .total-view')
                    $total_view.find('span').remove()
                    let totle_dm = 0
                    $('.video-pod')[0].__vue__.sectionsInfo.sections.forEach((v)=>{
                        v.episodes.forEach((v2)=>{
                            totle_dm += v2.arc.stat.danmaku
                        })
                    })
                    $total_view.append(`<span> - ${formatPlayCount(totle_dm)}弹幕</span>`)

                    ///////////////////////////////////
                    //监视right-container变化
                    // 1. 选择你想要观察的元素
                    // const myBox = document.querySelector('.right-container')
                    // // 如果想停止观察，可以使用:
                    // myBox.hhh_observer?.disconnect()
                    // // 2. 创建观察者，并定义回调函数
                    // const resizeObserver = new ResizeObserver(async entries => {
                    //     // 'entries' 是一个包含了所有发生尺寸变化的元素的数组
                    //     for (let entry of entries) {
                    //         console.log('元素尺寸改变了！')
                    //         // 你可以从 entry.contentRect 获取新尺寸
                    //         const newWidth = entry.contentRect.width
                    //         const newHeight = entry.contentRect.height
                    //         console.log(`元素新尺寸: ${newWidth}px x ${newHeight}px`)

                    //         console.log(status)
                    //         await ListSort(status)
                    //         // change_title_width()
                    //     }
                    // })
                    // // 3. 告诉观察者开始观察这个元素
                    // resizeObserver.observe(myBox)
                    // myBox.hhh_observer = resizeObserver
                }
    
                old_obj_convert_new()
                init(open)
                
                update_progress()
                update_title()

                await ListSort.init(status, video_type)

                change_title_width()

                once()
                other()
                
                if($('.video-pod__slide').length > 0) {
                    // console.log('多合集刷新时更新单个合集')
                    const $slide = $('.video-pod__slide')
                    $slide.off('click.hhh_slide').on('click.hhh_slide', '.slide-item', async function () {
                        init(open)
                        update_progress()
                        update_title()
                        await ListSort.init(status, video_type)
                        change_title_width()
                        other()
                        console.log("合集刷新完毕")
                    })
                }
            }
            memory_multipart_progress(config.getCheckboxSettingStatus('memoryProgress'), [config.getCheckboxSettingStatus('sortList')])
        }
        
        //搜索界面自动展开更多筛选
        function auto_more_conditions(){
            waitForTrue(()=>{
                if($('.more-conditions.ov_hidden').length > 0)
                    $('.vui_button.vui_button--active-shrink.i_button_more').click()
                return $('.more-conditions.ov_hidden').length <= 0
            }, ()=>{})
        }

        //新版评论图片，点击图片返回
        function return_comment(){

            // log($('.pswp__img').length)

            // let ob = new MutationObserver((mutations, observer) => {
            //     for (var mutation of mutations) {
            //         let target = mutation.target
            //         if(typeof target.className === 'string' && target.className === 'bili-video-card__image--wrap'){
            //             clearTimeout(is_change_break)
            //             ob.disconnect()
            //             is_change_break = setTimeout(function() {
            //                 //log("推荐页面刷新完毕")
            //                 box_data.push($box.clone())
            //                 // box_data.push($box.children(card_classname))
            //                 // log(box_data)
            //                 curr_box_num = box_data.length - 1
            //                 $('#hhh_btn_num>button').text(`${box_data.length}/${box_data.length}`)
            //                 $('.bili-video-card__mask').has('.bili-video-card__stats--text:contains(广告)').css({background: 'black', opacity: 0.9})
            //                 //log(box_data.length)
            //             }, 50)
            //             break
            //         }
            //     }
            // })
            // ob.observe($box_wrap[0], { childList: true, subtree: true, /*attributes: true,*/ })

            return

            if(mutation.addedNodes[0]?.nodeName.toLowerCase().includes('bili-photoswipe') === true){
                waitForTrueNoErr(()=>$($('bili-photoswipe')[0]?.shadowRoot).find('img').length >= 1, ()=>{
                    let $photoswipe =  $($('bili-photoswipe')[0]?.shadowRoot)
                    let $image_wrap = $photoswipe.find('#container')
                    let $image_content = $photoswipe.find('#zoom-wrap')

                    if($image_content.attr('hhh_show_image_wrap') !== true){
                        $image_content.attr('hhh_show_image_wrap', true)
                        
                        $image_wrap[0].removeEventListener('click', $image_wrap[0]?.hhh_show_image_btn_fn, true)
                        $image_wrap[0].hhh_show_image_btn_fn = function(e){
                            // log($(e), e.target.nodeName.toString().toUpperCase(), e.target.id, e.clientX, e.clientY)
                            let wrap_rect = $image_wrap[0].getBoundingClientRect()
                            let image_rect = $image_content[0].getBoundingClientRect()

                            if(e.target.nodeName.toLowerCase().includes('img') === true){
                                //点击图片关闭图片：相对于右上角X
                                $($('bili-photoswipe')[0]?.shadowRoot).find('#close').click()
                            }else{
                                //点击空白位置前后轮播图片：相当于左右箭头
                                let clientX = e.clientX
                                // log(clientX, wrap_rect.left, image_rect.left)
                                if(clientX >= wrap_rect.left && clientX <= image_rect.left) { $photoswipe.find('#prev').click() }
                                else if(clientX <= wrap_rect.right && clientX >= image_rect.right) { $photoswipe.find('#next').click() }
                            }
                            e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation()
                        }
                        $image_wrap[0].addEventListener('click', $image_wrap[0].hhh_show_image_btn_fn, true)

                        //鼠标变为默认形状
                        $image_content.css({'cursor': 'auto'})
                        
                        //设置不透明度，防止遮挡
                        $photoswipe.find('#thumb').css({'opacity': '30%'})
                    }
                })
            }

            return
            let $image_wrap = $('.show-image-wrap')
            let $image_content = $('.image-content')
            if($image_content[0].id !== 'hhh_show_image_wrap'){
                $image_content[0].id = 'hhh_show_image_wrap'
                //点击图片关闭图片：相对于右上角X
                $image_content.click(()=>{
                    $('.operation-btn-icon.close-container').click()
                })
                //点击空白位置前后轮播图片：相当于左右箭头
                $image_wrap.click((e)=>{
                    let wrap = $image_wrap[0].getBoundingClientRect()
                    let image = $image_content[0].getBoundingClientRect()
                    let clientX = e.clientX
                    if(clientX >= wrap.left && clientX <= image.left) { $('.operation-btn-icon.last-image').click(); return false }
                    if(clientX <= wrap.right && clientX >= image.right) { $('.operation-btn-icon.next-image').click(); return false }
                })
                //设置不透明度，防止遮挡
                $('.preview-list').css('opacity', '0.5')
            }
        }

        //https://api.bilibili.com/x/web-interface/archive/relation?aid=896486345&bvid=BV1CA4y1S7fS   //得到投币数量

        //初始化
        function init() {

            //读取设置 设置信息 && 快捷键信息
            config.getCheckboxSetting()

            //默认设置
            set_value('hhh_default', config.checkboxes)

            function set_danmuku_block_version(){
                // 创建一个代理对象来监视window.webAbTest
                let PropertyProxy = new Proxy({}, {
                    set: function(target, property, value) {
                        if (property === 'danmuku_block_version') {
                            value = 'OLD';
                            // 修改为'OLD'是旧版，'NEW'是新版
                        }
                        target[property] = value;
                        return true;
                    }
                });

                // 使用Object.defineProperty来监视window.webAbTest的属性
                Object.defineProperty(window, 'webAbTest', {
                    set: function(value) {
                        Object.assign(PropertyProxy, value);
                        return true;
                    },
                    get: function() {
                        return PropertyProxy;
                    },
                    configurable: true
                });
            }
            set_danmuku_block_version()

            // log('%%%%%%%%%%%%%%%%%%',window.location.href, geth5Player(), geth5Player()?.['tagName'], geth5Player()?.['baseURI'])

            // log('-----------',geth5Player())
            waitForTrueNoErr(()=>{return (h5Player = geth5Player()) !== undefined}, ()=>{
                function get_ver(){
                    let video_ver = window?.player?.getFormattedLogs()?.match(/version:\s*([\d.]+)/)?.[1]
                    let bili_ver = $('#app').length > 0 ? BILI_3_X_VIDEO_V1 :
                                $('#__next').length > 0 ? BILI_3_X_MOVIE : undefined
                    return [video_ver, bili_ver]
                }
                [video_ver, ver] = get_ver()
                if(ver === undefined || video_ver === undefined) return false

                bb_config.set_bb(ver)

                window.hhh_bb = bb
                window.hhh_config = config
    
                function lazyload(fn_arr){
                    let exclude_kv_body = {
                        [BILI_3_X_VIDEO_V1]: {
                            k: ['danmukuTopBottom', 'danmukuTopBottomClose', 'danmukuColor', 'danmukuColorClose', 'biliDlgM', 'coinDlgCoin', 'coinDlgCloseBtn', 'coinDlgOkBtn', 'playPBP',
                                'danmukuSpecial', 'danmukuSpecialClose', 'playTipWrap2', 'playCtrlSubtitle', 'playWatchLater', 'playTipWrap', 'playListAutoPlay'],
                            v: ['.video-toolbar-left .video-like.on', '.video-toolbar-left .video-coin.on', '.video-toolbar-left .video-fav.on', '.coin-dialog-mask .coin-btn',
                                '.bpx-player-volume-hint-text', '.bpx-player-volume-hint-icon', '.bpx-player-hotkey-panel', '.bili-dialog-m', '.coin-dialog-mask',
                                '.bpx-player-hotkey-panel-close', '.bpx-player-info-close', '.bpx-player-info-container', '.info-line','.bpx-player-top-mask',
                                '.bili-dialog-m .bi-btn', '.bpx-player-volume-hint', '.bpx-player-electric-jump'],
                        },
                        [BILI_3_X_MOVIE]: {
                            k: ['danmukuTopBottom', 'danmukuTopBottomClose', 'danmukuColor', 'danmukuColorClose', 'biliDlgM', 'coinDlgCoin', 'coinDlgCloseBtn', 'coinDlgOkBtn', 'playPBP',
                                'danmukuSpecial', 'danmukuSpecialClose', 
                                'playTipWrap2', 'playCtrlSubtitle', 'playWatchLater', 'likeon' , 'coinon', 'switchDot', 'collecton', 'collecton', 'playListAutoPlay'
                             ],
                            v: ['.like-info.active', '.coin-info.active', '.collect-info.active', '.coin-dialog-mask .coin-btn', '.bpx-player-volume-hint', '.bili-dialog-m',
                                '.bpx-player-volume-hint-text', '.bpx-player-volume-hint-icon', '.bpx-player-hotkey-panel', '.coin-dialog-mask', '.bpx-player-electric-jump',
                                '.bpx-player-hotkey-panel-close', '.bpx-player-info-close', '.bpx-player-info-container', '.info-line','.bpx-player-top-mask'],
                        },
                    }
    
                    function check_dom1(exclude_kv, is_show) {
                        // log('---check_dom1---',exclude_kv)
                        let exclude_k = exclude_kv['k']
                        let exclude_v = exclude_kv['v']
                        for(let [k, v] of Object.entries(bb)){
                            // if(!!k && exclude_k.indexOf(k) !== -1) log(k,v);  //test
                            if(!!k && exclude_k.indexOf(k) !== -1) continue
                            // if(!!v && exclude_v.indexOf(v) === -1 && $(v).length === 0) log( k, exclude_v.indexOf(v) +' - '+$(v).length+' - '+v )  //test
                            if(!!v && exclude_v.indexOf(v) === -1 && $(v).length === 0) {
                                if(is_show) log( k, exclude_v.indexOf(v) +' - '+$(v).length+' - '+v )
                                return false
                            }
                        }
                        return true
                    }

                    function check_dom2(){
                        let testarr = ''
                        let checked_dom = [ {cark:['.rec-list .upname path', '.RecommendItem_data___6DmA use', '.recommend-video-card']},
                                            {comment:['###_complex_01', '//comment', '.reply-list .sub-reply-dislike path']} ]
                        
                        let ret = checked_dom.every(doms => {
                            return Object.values(doms)[0].some(dom=>{
                                if(dom.match(/\/\/.+/) !== null) return true  //跳过
                                if(dom.match(/###.+/) !== null){
                                    if(dom.match(/complex_01/) !== null){
                                        testarr += `${dom} ${$($('bili-comments')[0]?.shadowRoot)?.find('#contents')?.length > 0} | `
                                        // return $($('bili-comments')[0]?.shadowRoot)?.length > 0
                                        return jQuery(jQuery('bili-comments')[0]?.shadowRoot)?.find('#contents')?.length > 0
                                    }
                                }
                                
                                // log('check_dom2-1:', dom, $(dom).length > 0)
                                testarr += `${dom} ${$(dom).length > 0} | `

                                return $(dom).length > 0
                            })
                        })

                        // log('check_dom2:', testarr, ret)

                        return ret
                    }

                    // function check_dom2(){
                    //     let checked_dom = [ {cark:['.video-page-card-small', '.RecommendItem_wrap__5sPoo', '.recommend-video-card']}, {comment:['#comment', '.comment-container .reply-list']} ]
                    //     // let checked_dom = [ {cark:['.video-page-card-small', '.RecommendItem_wrap__5sPoo', '.recommend-video-card']}, {comment:['.comment-container .reply-list']} ]
                    //     let ret = checked_dom.every(e => {
                    //         let $t = $()
                    //         Object.values(e)[0].forEach(v=>{ $t = $t.add($(v)) })
                    //         // log(Object.keys(e), $t.length)
                    //         log('check_dom2-1:', true)
                    //         if($t.length > 0) return true
                    //     })
                    //     log('check_dom2-2:', ret)
                    //     return ret
                    // }

                    function check_attr(){
                        return !!window?.__BiliUser__?.cache?.data
                    }

                    function is_run(exclude_kv, is_show){
                        // log(check_dom1(exclude_kv, is_show) , check_dom2() , check_attr())
                        $ = jQuery = $hhh_jq
                        return check_dom1(exclude_kv, is_show)
                            && check_dom2()
                            && check_attr()
                    }
    
                    function fn_run(fn_arr){
                        fn_arr.forEach(v=>v())
                    }
    
                    function waitForTrue2(ifTrue, callback, ifArgs, callArgs, time=100) {
                        if(--time < 0) { err('waitForTrue2 超时 '+ifTrue); return false }
                        const fn = waitForTrue2
                        //let fn = arguments.callee;
                        if (ifTrue(...ifArgs, false)) {
                            callback(...callArgs); return true
                        } else {
                            setTimeout(function() { fn(ifTrue, callback, ifArgs, callArgs, time); }, 100)
                        }
                    }
    
                    if(ver !== undefined) waitForTrue2(is_run, fn_run, [exclude_kv_body[ver]], [fn_arr], 50)
                    else err('未知bilibili版本')

                    // waitForTrue(()=>{
                    //     check_dom.forEach(e => {
                    //         //console.log(e, $(e).length)
                    //         for(let [k,v] of Object.entries(e)){
                    //             console.log(v)
                    //             let $t = $(v[0])
                    //             v.slice(1,-1).forEach(e=>{
                    //                 $t = $t.add($(e))
                    //             })
                    //             console.log($t.length)
                    //         }
                    //     })
                    // }, ()=>{
                    //     check_dom.forEach(element => {
                    //         log(element, $(element).length)
                    //     });
                    // })

                    // waitForTrue(()=> window?.bpNC_1, ()=>{
                    //     log(window.bpNC_1.config.aid)
                    //     fn_run(fn_arr)
                    // })
    
                    // log('^^^^^^^^^1',window?.user?.__ob__?.dep?.id, window.__VUE__)
                    // if(ver !== undefined) waitForTrue(()=>window?.user?.__ob__?.dep?.id && window.__VUE__, ()=>{
                    //     log('^^^^^^^^^2',window?.user?.__ob__?.dep?.id, window.__VUE__)
                    //     // log(window.__MIRROR_CONFIG__.config.whiteScreen.checkDom)
                    //     // window.__MIRROR_CONFIG__.config.whiteScreen.checkDom.forEach((v,i)=>{
                    //     //     console.log(i,v,$(v).length)
                    //     // })
                    //     // fn_run(fn_arr)
                    // })
                    // else err('未知bilibili版本')
                }
                
                let eve = ['loadstart', 'durationchange', 'loadedmetadata', 'loadeddata', 'progress', 'canplay', 'canplaythrough']  //test
                eve = ['loadeddata']
                h5Player = geth5Player()
                eve.forEach((v)=>{
                    $(h5Player).off(`${v}.hhh`)
                    $(h5Player).on(`${v}.hhh`,(e)=>{
                        // log(e.type)
                        if(e.type === 'loadeddata'){
                            waitForTrue(()=> window?.__INITIAL_STATE__?.videoData?.bvid === window?.__INITIAL_STATE__?.bvid, ()=>{
                                lazyload([run_once, run_video_loaded])
                            })
                        }
                    })
                })

            })
            // }

           /* var box = document.getElementById("hhh");
            //配置选项
            var config = { childList: true, subtree: true, attributes: true };
            var observer = new MutationObserver(function (mutationsList, observer) {
                for (var mutation of mutationsList) {
                    const target = mutation.target;
                    //typeof target.className === 'string' && target.className !== '' && log(target.className);
                    if (mutation.type == 'childList') {
                        //console.log('子元素被修改');
                    }
                    else if (mutation.type == 'attributes') {
                        //console.log(mutation.attributeName + '属性被修改');
                    }
                }
            });
            //开始观测
            observer.observe(document.body, config); */

            // GM_setValue('zw_test', a);
            // console.log(GM_getValue('zw_test'));
            // console.log(GM_getValue('zw_test').name);

            let is_card_load = true
            let is_content_load = null
            let is_rec_list_load = null
            let is_homepage_load = true
            let is_fav_list_load = true
            let is_history_break = null
            let is_run_3X_break = true
            let run_load = true
            let run_done = false
            let dm_t
            let clickitem_name
            let class_name_obj = {}
            let old_url
            new MutationObserver((mutations, observer) => {
                mutations.forEach(mutation => {

                    function show_class_name(class_name_obj){  //显示查找 className个数
                        function show_appoint_num(min, max){
                            for(let [k,v] of Object.entries(class_name_obj)){
                                if(max === -1){
                                    if(v >= min) log(k,v)
                                }else{
                                    if(v >= min && v <= max) log(k)
                                }
                            }
                        }
                        for(let i=0; i<=10; i++){
                            if(i<10){
                                log(`--------------[${i}]----------------`);
                                show_appoint_num(i,i)
                            } else if(i===10){
                                log(`--------------[${i}+]----------------`);
                                show_appoint_num(i,-1)
                            
                            }
                        }
                        log('--------------End----------------')
                        return;

                        for(let [k,v] of Object.entries(class_name_obj)){
                            log(k+' - '+v)
                            let arr=[];
                            //for (let [k, v] of Object.entries(bb)) { !!v && v[0] === '.' && $(v).length !== -1 && arr.push(v+' - '+$(v).length) && 0 && log(v+' - '+$(v).length); }
                            for(let i=0; i<=10; i++){
                                if(i<10){
                                    log(`--------------[${i}]----------------`);
                                    arr.forEach(function(v){
                                        +v.slice(-1) === i && v.slice(-2,-1) === ' ' && log(v);
                                    })
                                } else if(i===10){
                                    log(`--------------[${i}+]----------------`);
                                    arr.forEach(function(v){
                                        $.isNumeric(parseInt(v.slice(-2,-1))) && log(v);
                                    })
                                }
                            }
                            log('--------------End----------------')
                        }
                        log(class_name_obj)
                        return;
                        //for (let [k, v] of Object.entries(bb)) { !!v && v[0] === '.' && $(v).length !== length && log(v+' - '+$(v).length); }
                        if(!!ver) { bb = {}; bb_config.set_bb(ver) }
                        let arr=[];
                        for (let [k, v] of Object.entries(bb)) { !!v && v[0] === '.' && $(v).length !== -1 && arr.push(v+' - '+$(v).length) && 0 && log(v+' - '+$(v).length); }
                        for(let i=0; i<=10; i++){
                            if(i<10){
                                log(`--------------[${i}]----------------`);
                                arr.forEach(function(v){
                                    +v.slice(-1) === i && v.slice(-2,-1) === ' ' && log(v);
                                })
                            } else if(i===10){
                                log(`--------------[${i}+]----------------`);
                                arr.forEach(function(v){
                                    $.isNumeric(parseInt(v.slice(-2,-1))) && log(v);
                                })
                            }
                        }
                        log('--------------End----------------')
                        //log(arr)
                    }

                    const target = mutation.target
                    // log($(geth5Player()).length)
                    //class_name_obj[target.className] = class_name_obj?.[target.className] === undefined ? 1 : ++class_name_obj[target.className]
                    // typeof target.className === 'string' && target.className !== '' && log(target.className)
                    // let $item_active = $('.list-box .on, .video-episode-card__info-playing')
                    // let name = $item_active.text()
                    // log(name)
                    //typeof target.className === 'string' && target.className !== '' && log($('.rec-list .video-page-card').length);

                    //干净链接
                    if(old_url !== window.location.href) { old_url = clear_url() }

                    //const stage = mutation.previousSibling && target.getAttribute('stage')
                    if($('.bilibili-player-video-wrap').length === 1){  //2.X
                        // if($('#app').hasClass('app-v1')){
                        //     log("2.X“V3版”加载完毕");
                        //     bb_config.set_bb(BILI_3_X_VIDEO_V1);
                        //     run();
                        // }else{
                        //     log("2.X“V2版”加载完毕");
                        //     bb_config.set_bb(BILI_2_X_V2);
                        //     run();
                        // }
                    } else if(1&&typeof target.className === 'string' && (target.className === 'bui-select-list-wrap#####' || target.className === 'rec-list####') ) {
                         //bug?? bpx-player-control-top 会激活重新加载视频
                        // clearTimeout(is_rec_list_load)
                        // is_rec_list_load = setTimeout(function() {
                        //     // log('订阅合集列表加载完毕2222222222222222222222'); expand_list(config.getCheckboxSettingStatus('expandList'), config.getCheckboxSettingArgs('expandList', 'columns'));
                        //     log("连播列表加载"); run_rec_list_newtab(config.getCheckboxSettingStatus('openVideoInNewTab'));
                        //     add_to_video_sections_head()  //列表加入总时长等
                        //     list_filter()  //合集列表关键字过滤
                        //     //列表加入总时长
                        //     //add_total_time()
                        // }, 200);
                    //} else if(1&&typeof target.className === 'string' && (target.className === 'bpx-player-control-top###' || target.className === 'rec-list###')) {
                        //|| target.className.includes('header-v2 win webscreen-fix') === true
                    } else if(1&&typeof target.className === 'string' && (target.className.includes('teleport') === true
                                                                       || target.className.includes('header-v2 win webscreen-fix') === true
                                                                       || target.className.includes('main-container') === true
                                                                       || target.className.includes('video-toolbar-container') === true)) {
                        log("投币快捷设置或添加到收藏夹关键字过滤")//***
                        //log(target.className)
                        collection_filter(config.getCheckboxSettingStatus('collectionFilter'))
                        set_dialog('coin', target.className)
                    //} else if(!bb_type && typeof target.className === 'string' && target.className === 'bpx-player-loading-panel-text') {  //3.X  pbp-tip  bpx-player-loading-panel-text
                    //视频 ###弃用###
                    } else if(0&&typeof target.className === 'string' && ((target.className === 'bui-select-list-wrap' && run_load === true) || target.className === 'rec-list')) {  //3.X  pbp-tip  bpx-player-loading-panel-text

                        function get_ver_____(){
                            let ver_reg = $('.bpx-player-loading-panel-text').length > 0? $('.bpx-player-loading-panel-text').text().match(/(\d+).(\d+).(\d+)-(\w+)/): null;
                            let ver;
                            if(ver_reg === null) { ver = null; ver_reg = []}
                            else if($('#app').find('.l-con').length > 0) ver = BILI_3_X_VIDEO;
                            else if($('#app').find('.plp-l').length > 0) ver = BILI_3_X_MOVIE;  //todo plp-l
                            else if($('#app.app-v1').length > 0) ver = BILI_3_X_VIDEO_V1;  //todo plp-l
                            else ver = BILI_2_X;

                            //log(ver_reg[0]+' | '+ver)
                            //log($('#app').find('.l-con').length+' | '+$('#app').find('.plp-l').length)
                            return [ver, ver_reg[0]];
                        }

                        function get_ver__(){
                            let ver_reg = $('.bpx-player-loading-panel-text').length > 0? $('.bpx-player-loading-panel-text').text().match(/(\d+).(\d+).(\d+)-(\w+)/): null
                            //log(ver_reg)
                            ver_reg ??= $('.bpx-player-info-log .info-title').text().match(/[\d.]+/)
                            // log($('.bpx-player-info-log .info-title').length)

                            // log('[2]',window?.player?.getFormattedLogs().match(/version:\s*([\d.]+)/)?.[1])
                            ver_reg = window?.player?.getFormattedLogs().match(/version:\s*([\d.]+)/)?.[1]

                            let ver
                            
                            // if(ver_reg === null) { ver = null; ver_reg = [] }

                            if($('#app').find('.l-con').length > 0) ver = BILI_3_X_VIDEO;
                            else if($('#__next').find('.plp-l').length > 0) ver = BILI_3_X_MOVIE;  //todo plp-l
                            else if($('#app').length > 0) ver = BILI_3_X_VIDEO_V1;  //todo plp-l
                            else ver = BILI_2_X;

                            //log(ver_reg[0]+' | '+ver)
                            //log($('#app').find('.l-con').length+' | '+$('#app').find('.plp-l').length)
                            return [ver, ver_reg];
                        }

                        function show_bb_config(ver){  //显示查找 className DOM个数
                            //for (let [k, v] of Object.entries(bb)) { !!v && v[0] === '.' && $(v).length !== length && log(v+' - '+$(v).length); }
                            if(!!ver) { bb = {}; bb_config.set_bb(ver) }
                            let arr=[];
                            for (let [k, v] of Object.entries(bb)) { !!v && v[0] === '.' && $(v).length !== -1 && arr.push(v+' - '+$(v).length) && 0 && log(v+' - '+$(v).length); }
                            for(let i=0; i<=10; i++){
                                if(i<10){
                                    log(`--------------[${i}]----------------`);
                                    arr.forEach(function(v){
                                        +v.slice(-1) === i && v.slice(-2,-1) === ' ' && log(v);
                                    })
                                } else if(i===10){
                                    log(`--------------[${i}+]----------------`);
                                    arr.forEach(function(v){
                                        $.isNumeric(parseInt(v.slice(-2,-1))) && log(v);
                                    })
                                }
                            }
                            log('--------------End----------------')
                            //log(arr)
                        }
                        function isrun_3_x_movie() {
                            let exclude_k = ['danmukuTopBottom', 'danmukuTopBottomClose', 'danmukuColor', 'danmukuColorClose', 'biliDlgM', 'coinDlgCoin', 'coinDlgCloseBtn', 'coinDlgOkBtn', 'playPBP',
                                            'playTipWrap2', 'playCtrlSubtitle', 'playWatchLater', 'likeon' , 'coinon', 'switchDot', 'like', 'coin' ];
                            let exclude_v = ['.like-info.active', '.coin-info.active', '.collect-info.active', '.coin-dialog-mask .coin-btn', '.bpx-player-volume-hint', '.bili-dialog-m',
                                            '.bpx-player-volume-hint-text', '.bpx-player-volume-hint-icon', '.bpx-player-hotkey-panel', '.coin-dialog-mask', '.bpx-player-electric-jump',
                                            '.bpx-player-hotkey-panel-close', '.bpx-player-info-close', '.bpx-player-info-container', '.info-line','.bpx-player-top-mask'];
                            for(let [k, v] of Object.entries(bb)){
                                //if(!!k && exclude_k.indexOf(k) !== -1) log(k,v);  //test
                                if(!!k && exclude_k.indexOf(k) !== -1) continue;
                                if(!!v && exclude_v.indexOf(v) === -1 && $(v).length === 0) log( k, exclude_v.indexOf(v) +' - '+$(v).length+' - '+v );  //test
                                if(!!v && exclude_v.indexOf(v) === -1 && $(v).length === 0) return false;
                            }
                            return true;
                        }
                        function isrun_3_x_video() {
                            let exclude_k = ['danmukuTopBottom', 'danmukuTopBottomClose', 'danmukuColor', 'danmukuColorClose', 'biliDlgM', 'coinDlgCoin', 'coinDlgCloseBtn', 'coinDlgOkBtn', 'playPBP',
                                            'playTipWrap2', 'playCtrlSubtitle', 'playWatchLater', ];
                            let exclude_v = ['.ops .like.on', '.ops .coin.on', '.ops .collect.on', '.coin-dialog-mask .coin-btn', '.bpx-player-volume-hint', '.bpx-player-electric-jump',
                                            '.bpx-player-volume-hint-text', '.bpx-player-volume-hint-icon', '.bpx-player-hotkey-panel', '.bili-dialog-m', '.coin-dialog-mask',
                                            '.bpx-player-hotkey-panel-close', '.bpx-player-info-close', '.bpx-player-info-container', '.info-line','.bpx-player-top-mask',
                                            '.bili-dialog-m .bi-btn'];
                            for(let [k, v] of Object.entries(bb)){
                                //if(!!k && exclude_k.indexOf(k) !== -1) log(exclude_k.indexOf(k) +' - '+k+' - '+v);
                                if(!!k && exclude_k.indexOf(k) !== -1) continue;
                                //if(!!v && exclude_v.indexOf(v) === -1 && $(v).length === 0) log(exclude_v.indexOf(v) +' - '+$(v).length+' - '+v);
                                if(!!v && exclude_v.indexOf(v) === -1 && $(v).length === 0) return false;
                            }
                            return true;
                        }
                        function isrun_3_x_video_v1() {
                            let exclude_k = ['danmukuTopBottom', 'danmukuTopBottomClose', 'danmukuColor', 'danmukuColorClose', 'biliDlgM', 'coinDlgCoin', 'coinDlgCloseBtn', 'coinDlgOkBtn', 'playPBP',
                                            'playTipWrap2', 'playCtrlSubtitle', 'playWatchLater', 'playTipWrap', ];
                            let exclude_v = ['.video-toolbar-left .video-like.on', '.video-toolbar-left .video-coin.on', '.video-toolbar-left .video-fav.on', '.coin-dialog-mask .coin-btn', '.bpx-player-volume-hint', '.bpx-player-electric-jump',
                                            '.bpx-player-volume-hint-text', '.bpx-player-volume-hint-icon', '.bpx-player-hotkey-panel', '.bili-dialog-m', '.coin-dialog-mask',
                                            '.bpx-player-hotkey-panel-close', '.bpx-player-info-close', '.bpx-player-info-container', '.info-line','.bpx-player-top-mask',
                                            '.bili-dialog-m .bi-btn'];
                            for(let [k, v] of Object.entries(bb)){
                                //if(!!k && exclude_k.indexOf(k) !== -1) log(exclude_k.indexOf(k) +' - '+k+' - '+v);
                                if(!!k && exclude_k.indexOf(k) !== -1) continue;
                                if(!!v && exclude_v.indexOf(v) === -1 && $(v).length === 0) log(exclude_v.indexOf(v) +' - '+$(v).length+' - '+v);
                                if(!!v && exclude_v.indexOf(v) === -1 && $(v).length === 0) return false;
                            }
                            return true;
                        }

                        //clearTimeout(run_load);
                        run_load = false
                        //log('-------run_load----------')
                        //log(target.className)
                        //log($('.bpx-player-loading-panel-text').length)
                        clearTimeout(run_done)
                        run_done = setTimeout(function() {
                            //log(`-------run_load2----------`)
                            //log($('.bpx-player-loading-panel-text').text())

                            let ver_string
                            [ver, ver_string] = get_ver__();

                            log(`[${ver_string}][${ver}]加载完毕`);
                            //if(!ver || !ver_string) {
                            if(!ver) {
                                clearTimeout(run_load); return true;
                            }
                            // log('---bb_config.set_bb(ver);---')
                            bb_config.set_bb(ver)

                            ////////////////////////
                            ////////////////////////
                            // show_bb_config()
                            //setTimeout(()=>show_class_name(class_name_obj),2000)
                            //show_class_name(class_name_obj)
                            //return;
                            ////////////////////////
                            ////////////////////////

                            function run_(){
                                // run_2once()
                                // run_video_loaded() //视频加载时执行
                                //log('订阅合集列表加载完毕'); expand_list(config.getCheckboxSettingStatus('expandList'), config.getCheckboxSettingArgs('expandList', 'columns'))
                                log("连播列表加载"); run_rec_list_newtab(config.getCheckboxSettingStatus('openVideoInNewTab'))
                                list_filter()  //合集列表关键字过滤
                                // add_to_video_sections_head()  //列表加入总时长等
                                //log('add_to_video_sections_head: ',target.className)
                                //setTimeout(()=>run_load = true, 500)
                            }

                            if(ver === BILI_3_X_VIDEO) waitForTrue(isrun_3_x_video, run_);
                            else if(ver === BILI_3_X_VIDEO_V1) waitForTrue(isrun_3_x_video_v1, run_);
                            else waitForTrue(isrun_3_x_movie, run_);
                            
                            // log('订阅合集列表加载完毕'); expand_list(config.getCheckboxSettingStatus('expandList'), config.getCheckboxSettingArgs('expandList', 'columns'));
                            // log("连播列表加载"); run_rec_list_newtab(config.getCheckboxSettingStatus('openVideoInNewTab'));
                            // add_to_video_sections_head()  //列表加入总时长等
                        }, 800);
                    //动态首页
                    } else if(typeof target.className === 'string' && target.className==='bili-dyn-list__items'){
                        clearTimeout(is_content_load); //log(!!config.getCheckboxSettingStatus('showDynListContent') || 1)
                        is_content_load = setTimeout(function() { log("动态首页加载完毕"); run_content(!!config.getCheckboxSettingStatus('showDynListContent') || true); }, 200)
                    //当前在线
                    } else if(typeof target.className === 'string' && target.className === 'avatar' && target.baseURI.indexOf('www.bilibili.com/video/online.html') !== -1){
                        log("当前在线加载完毕");
                        run_online_preview(config.getCheckboxSettingStatus('onlinePreview'))
                    //首页
                    } else if(typeof target.className === 'string' && window.location.href.match(/https?:\/\/www.bilibili.com\/?$/) && is_homepage_load === true){
                        is_homepage_load = false
                        //waitForTrue(()=> $('.rcmd-box-wrap').length === 1 || $('.bili-grid.short-margin.grid-anchor:first').length === 1 || $('.recommended-swipe.grid-anchor:first').length === 1, () => {
                        waitForTrue(()=> $('#i_cecream').length > 0 || $('.rcmd-box-wrap').length === 1 || $('.bili-grid.short-margin.grid-anchor:first').length === 1 || $('.recommended-swipe:first').length === 1, () => {
                            // log($('#app main.bili-feed4-layout').length, $('.feed-card').length, $('#i_cecream').length)
                            if($('main.bili-feed4-layout').add('#app main.bili-feed4-layout').length > 0) ver = BILI_4_X_V1
                            else if($('#i_cecream main.bili-layout').length > 0) ver = BILI_3_X_VIDEO_V1
                            else if($('#app').length > 0) ver = BILI_3_X_VIDEO
                            else ver = undefined
                            bb_config.set_bb(ver)
                            log(`[${ver}]-首页-加载完毕`)
                            
                            run_homepage()

                            run_save_recommend_list(config.getCheckboxSettingStatus('saveRecommendList'))
                            run_add_carousel_slide()
                            // run_add_online()
                            run_adblock_remove()
                            // run_go_back_new_version()
                        })
                    //第一时间执行
                    } else if(0&&typeof target.className === 'string' && window.location.href.match(/https?:\/\/www.bilibili.com\/.+/) && is_homepage_load === true){
                    //收藏夹
                    } else if(typeof target.className === 'string' && target.className==='vui_ellipsis multi-mode'){
                        // log(config.getCheckboxSettingStatus('favSetting'))
                        // log(config.sets)
                        clearTimeout(is_fav_list_load)
                        is_fav_list_load = setTimeout(function() { log("收藏夹设置完毕")
                        // log(config.getCheckboxSettingStatus('favSetting'))
                        run_fav(config.getCheckboxSettingStatus('favSetting')); }, 200)
                    //三连和选择弹窗
                    } else if(typeof target.className === 'string' && target.className.indexOf('bili-guide-all bili-guide') !== -1){
                        hideThreePopup(config.getCheckboxSettingStatus('hideThreePopup'))
                    //打分弹窗
                    } else if(typeof target.className === 'string' && target.className.indexOf('bili-score bili-no-event') !== -1){
                        hideScorePopup(config.getCheckboxSettingStatus('hideScorePopup'))
                    //搜索界面自动展开更多筛选
                    } else if(typeof target.className === 'string' && target.className.indexOf('header-entry-avatar') !== -1){
                        auto_more_conditions()
                    //新版评论图片，任意点击返回
                    } else if(typeof target.className === 'string' && target.className.indexOf('pswp') !== -1){
                        // log(target.className)
                        return_comment()
                    // } else if(typeof target.className === 'string' && target.className==='history-list'){
                    //     clearTimeout(is_history_break);
                    //     is_history_break = setTimeout(function() { log("历史记录加载完毕"); run_history()}, 200);
                        //clearTimeout(is_rcmd_box_break);
                        //is_rcmd_box_break = setTimeout(function() { log("推荐列表加载完毕"); run_recommend_box()}, 50);
                    // } else if(is_card_load === false && typeof target.className === 'string' && target.className === 'card' && $(target).find('.video-container .content').length){
                        // is_card_load = true;
                        // log("2.X动态首页加载完毕");r
                        // run_card();  //搞笑，刚写完，2.70.7就有了
                        // removeMostViewedListener(config.getCheckboxSettingStatus('removeMostViewedListener'));
                    }
                });
            }).observe(document, {
                childList: true,
                subtree: true,
                //attributes: true,
            });
        }

        // console.log(jQuery.fn.jquery)
        var $hhh_jq = $
        init()
    }
}
hhh_lightoff_main.init()