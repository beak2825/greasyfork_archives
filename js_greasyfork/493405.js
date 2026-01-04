// ==UserScript==
// @name              哔哩哔哩（bilibili.com）调整
// @namespace         哔哩哔哩（bilibili.com）调整
// @copyright         QIAN
// @license           GPL-3.0 License
// @version           0.1.50.5
// @description       一、首页新增推荐视频历史记录(仅记录前6个推荐位中的非广告内容)，以防误点刷新错过想看的视频。二、动态页调整：默认显示"投稿视频"内容，可自行设置URL以免未来URL发生变化。三、播放页调整：1.自动定位到播放器（进入播放页，可自动定位到播放器，可设置偏移量及是否在点击主播放器时定位）；2.可设置播放器默认模式；3.可设置是否自动选择最高画质；4.新增快速返回播放器漂浮按钮；5.新增点击评论区时间锚点可快速返回播放器；6.网页全屏模式解锁(网页全屏模式下可滚动查看评论，并在播放器控制栏新增快速跳转至评论区按钮)；7.将视频简介内容优化后插入评论区或直接替换原简介区内容(替换原简介中固定格式的静态内容为跳转链接)；8.视频播放过程中跳转指定时间节点至目标时间节点(可用来跳过片头片尾及中间广告等)；9.新增点击视频合集、下方推荐视频、结尾推荐视频卡片快速返回播放器；
// @author            QIAN
// @match             *://www.bilibili.com
// @match             *://www.bilibili.com/video/*
// @match             *://www.bilibili.com/bangumi/play/*
// @match             *://www.bilibili.com/list/*
// @match             *://t.bilibili.com/*
// @require           https://cdn.jsdelivr.net/npm/md5@2.3.0/dist/md5.min.js
// @require           https://cdn.jsdelivr.net/npm/localforage@1.10.0/dist/localforage.min.js
// @require           https://cdn.jsdelivr.net/npm/axios@1.6.5/dist/axios.min.js
// @require           https://asifadeaway.com/utils/ShadowDOMHelper.js?#sha256=13aa860c659bb4cf23ae25a4a4722c9df29e84d172fb0e70bc751b703d3dcda9
// @require           https://scriptcat.org/lib/513/2.0.1/ElementGetter.js?#sha256=V0EUYIfbOrr63nT8+W7BP1xEmWcumTLWu2PXFJHh5dg=
// @grant             GM_info
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_addStyle
// @grant             GM_registerMenuCommand
// @grant             window.onurlchange
// @grant             unsafeWindow
// @supportURL        https://github.com/QIUZAIYOU/Bilibili-Adjustment
// @homepageURL       https://github.com/QIUZAIYOU/Bilibili-Adjustment
// @icon              https://www.bilibili.com/favicon.ico?v=1
// @downloadURL https://update.greasyfork.org/scripts/493405/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%EF%BC%88bilibilicom%EF%BC%89%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/493405/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%EF%BC%88bilibilicom%EF%BC%89%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==
// ?#sha256=V0EUYIfbOrr63nT8+W7BP1xEmWcumTLWu2PXFJHh5dg=
// ?#sha256=e2c555a7dfeef9362ba134e6fef421a129ff562650de6331e6238fa3ba950bec
(function () {
  'use strict';
  let vars = {
    theMainFunctionRunningCount: 0,
    thePrepFunctionRunningCount: 0,
    autoSelectScreenModeRunningCount: 0,
    autoCancelMuteRunningCount: 0,
    webfullUnlockRunningCount: 0,
    autoSelectVideoHighestQualityRunningCount: 0,
    insertGoToCommentButtonCount: 0,
    insertSetSkipTimeNodesButtonCount: 0,
    insertSetSkipTimeNodesSwitchButtonCount: 0,
    insertAutoEnableSubtitleSwitchButtonCount: 0,
    setIndexRecordRecommendVideoHistoryArrayCount: 0,
    functionExecutionsCount: 0,
    autoSubtitleRunningCount: 0,
    checkScreenModeSwitchSuccessDepths: 0,
    autoLocationToPlayerRetryDepths: 0,
  }
  let arrays = {
    screenModes: ['wide', 'web'],
    intervalIds: [],
    skipNodesRecords: [],
    indexRecommendVideoHistory: [],
    videoCategoriesActiveClass: ['adjustment_button', 'primary', 'plain'],
  }
  let objects = {
    videoCategories: {
      douga: { name: "动画", tids: [1, 24, 25, 47, 210, 86, 253, 27] },
      anime: { name: "番剧", tids: [13, 51, 152, 32, 33] },
      guochuang: { name: "国创", tids: [167, 153, 168, 169, 170, 195] },
      music: { name: "音乐", tids: [3, 28, 31, 30, 59, 193, 29, 130, 243, 244] },
      dance: { name: "舞蹈", tids: [129, 20, 154, 156, 198, 199, 200, 255] },
      game: { name: "游戏", tids: [4, 17, 171, 172, 65, 173, 121, 136, 19] },
      knowledge: { name: "知识", tids: [36, 201, 124, 228, 207, 208, 209, 229, 122] },
      tech: { name: "科技", tids: [188, 95, 230, 231, 232, 233] },
      sports: { name: "运动", tids: [234, 235, 249, 164, 236, 237, 238] },
      car: { name: "汽车", tids: [223, 245, 246, 247, 248, 240, 227, 176, 258] },
      life: { name: "生活", tids: [160, 138, 250, 251, 239, 161, 162, 21, 254] },
      food: { name: "美食", tids: [211, 76, 212, 213, 214, 215] },
      animal: { name: "动物圈", tids: [217, 218, 219, 220, 221, 222, 75] },
      kichiku: { name: "鬼畜", tids: [119, 22, 26, 126, 216, 127] },
      fashion: { name: "时尚", tids: [155, 157, 252, 158, 159] },
      information: { name: "资讯", tids: [202, 203, 204, 205, 206] },
      ent: { name: "娱乐", tids: [5, 71, 241, 242, 137] },
      cinephile: { name: "影视", tids: [181, 182, 183, 85, 184] },
      documentary: { name: "纪录片", tids: [177, 37, 178, 179, 180] },
      movie: { name: "电影", tids: [23, 147, 145, 146, 83] },
      tv: { name: "电视剧", tids: [11, 185, 187] }
    }
  }
  const selectors = {
    app: '#app',
    header: '#biliMainHeader',
    player: '#bilibili-player',
    playerWrap: '#playerWrap',
    playerWebscreen: '#bilibili-player.mode-webscreen',
    playerContainer: '#bilibili-player .bpx-player-container',
    playerController: '#bilibili-player .bpx-player-ctrl-btn',
    playerControllerBottomRight: '.bpx-player-control-bottom-right',
    playerTooltipArea: '.bpx-player-tooltip-area',
    playerTooltipTitle: '.bpx-player-tooltip-title',
    playerDanmuSetting: '.bpx-player-dm-setting',
    playerEndingRelateVideo: '.bpx-player-ending-related-item',
    volumeButton: '.bpx-player-ctrl-volume-icon',
    mutedButton: '.bpx-player-ctrl-muted-icon',
    video: '#bilibili-player video',
    videoWrap: '#bilibili-player .bpx-player-video-wrap',
    videoBwp: 'bwp-video',
    videoTitleArea: '#viewbox_report',
    videoFloatNav: '.fixed-sidenav-storage',
    videoComment: '#commentapp',
    videoCommentReplyList: '#comment .reply-list',
    videoRootReplyContainer: '#comment .root-reply-container',
    videoTime: 'a[data-type="seek"]',
    videoDescription: '#v_desc',
    videoDescriptionInfo: '#v_desc .basic-desc-info',
    videoDescriptionText: '#v_desc .desc-info-text',
    videoNextPlayAndRecommendLink: '.video-page-card-small .card-box',
    videoSectionsEpisodeLink: '.video-pod__list .video-pod__item',
    videoEpisodeListMultiMenuItem: '.bpx-player-ctrl-eplist-multi-menu-item',
    videoMultiPageLink: '#multi_page ul li',
    videoPreviousButton: '.bpx-player-ctrl-btn.bpx-player-ctrl-prev',
    videoNextButton: '.bpx-player-ctrl-btn.bpx-player-ctrl-next',
    bangumiApp: '#__next',
    bangumiComment: '#comment_module',
    bangumiFloatNav: '#__next div[class*="navTools_floatNavExp"] div[class*="navTools_navMenu"]',
    bangumiMainContainer: '.main-container',
    bangumiSectionsEpisodeLink: '#__next div[class*="numberList_wrapper"] div[class*="numberListItem_number_list_item"] ',
    qualitySwitchButtons: '.bpx-player-ctrl-quality-menu-item',
    screenModeWideEnterButton: '.bpx-player-ctrl-wide-enter',
    screenModeWideLeaveButton: '.bpx-player-ctrl-wide-leave',
    screenModeWebEnterButton: '.bpx-player-ctrl-web-enter',
    screenModeWebLeaveButton: '.bpx-player-ctrl-web-leave',
    screenModeFullControlButton: '.bpx-player-ctrl-full',
    danmukuBox: '#danmukuBox',
    danmuShowHideTip: 'div[aria-label="弹幕显示隐藏"]',
    membersContainer: '.members-info-container',
    membersUpAvatarFace: '.membersinfo-upcard:first-child picture img',
    upAvatarFace: '.up-info-container .up-avatar-wrap .bili-avatar .bili-avatar-face',
    upAvatarDecoration: '.up-info-container .up-avatar-wrap .bili-avatar .bili-avatar-pendent-dom .bili-avatar-img',
    upAvatarIcon: '.up-info-container .up-avatar-wrap .bili-avatar .bili-avatar-icon',
    setSkipTimeNodesPopover: '#setSkipTimeNodesPopover',
    setSkipTimeNodesPopoverToggleButton: '#setSkipTimeNodesPopoverToggleButton',
    setSkipTimeNodesPopoverHeaderExtra: '#setSkipTimeNodesPopover .header .extra',
    setSkipTimeNodesPopoverTips: '#setSkipTimeNodesPopover .tips',
    setSkipTimeNodesPopoverTipsDetail: '#setSkipTimeNodesPopover .tips .detail',
    setSkipTimeNodesPopoverTipsContents: '#setSkipTimeNodesPopover .tips .contents',
    setSkipTimeNodesPopoverRecords: '#setSkipTimeNodesPopover .setSkipTimeNodesWrapper .records',
    setSkipTimeNodesPopoverClouds: '#setSkipTimeNodesPopover .setSkipTimeNodesWrapper .clouds',
    setSkipTimeNodesPopoverResult: '#setSkipTimeNodesPopover .setSkipTimeNodesWrapper .result',
    setSkipTimeNodesInput: '#setSkipTimeNodesInput',
    skipTimeNodesRecordsArray: '#skipTimeNodesRecordsArray',
    skipTimeNodesCloudsArray: '#skipTimeNodesCloudsArray',
    clearRecordsButton: '#clearRecordsButton',
    saveRecordsButton: '#saveRecordsButton',
    uploadSkipTimeNodesButton: '#uploadSkipTimeNodesButton',
    syncSkipTimeNodesButton: '#syncSkipTimeNodesButton',
    indexApp: '#i_cecream',
    indexRecommendVideoSix: '.recommended-container_floor-aside .feed-card:nth-child(-n+7)',
    indexRecommendVideoRollButtonWrapper: '.recommended-container_floor-aside .feed-roll-btn',
    indexRecommendVideoHistoryPopoverTitle: '#indexRecommendVideoHistoryPopoverTitle',
    indexRecommendVideoRollButton: '.recommended-container_floor-aside .feed-roll-btn button.roll-btn',
    indexRecommendVideoHistoryOpenButton: '#indexRecommendVideoHistoryOpenButton',
    indexRecommendVideoHistoryPopover: '#indexRecommendVideoHistoryPopover',
    indexRecommendVideoHistoryCategory: '#indexRecommendVideoHistoryCategory',
    indexRecommendVideoHistoryCategoryButtons: '#indexRecommendVideoHistoryCategory li',
    indexRecommendVideoHistoryCategoryButtonsExceptAll: '#indexRecommendVideoHistoryCategory li:not(.all)',
    indexRecommendVideoHistoryCategoryButtonAll: '#indexRecommendVideoHistoryCategory li.all',
    indexRecommendVideoHistoryList: '#indexRecommendVideoHistoryList',
    clearRecommendVideoHistoryButton: '#clearRecommendVideoHistoryButton',
    dynamicSettingPopover: '#dynamicSettingPopover',
    dynamicSettingSaveButton: '#dynamicSettingSaveButton',
    dynamicSettingPopoverTips: '#dynamicSettingPopoverTips',
    dynamicHeaderContainer: '#bili-header-container',
    videoSettingPopover: '#videoSettingPopover',
    videoSettingSaveButton: '#videoSettingSaveButton',
    notChargeHighLevelCover: '.not-charge-high-level-cover',
    switchSubtitleButton: '.bpx-player-ctrl-btn.bpx-player-ctrl-subtitle',
    AutoSkipSwitchInput: '#Auto-Skip-Switch',
    AutoEnableSubtitleSwitchInput: '#Auto-Enable-Subtitle',
    WebVideoLinkInput: '#Web-Video-Link',
    IsVip: '#Is-Vip',
    AutoLocate: '#Auto-Locate',
    AutoLocateVideo: '#Auto-Locate-Video',
    AutoLocateBangumi: '#Auto-Locate-Bangumi',
    TopOffset: '#Top-Offset',
    ClickPlayerAutoLocation: '#Click-Player-Auto-Location',
    AutoQuality: '#Auto-Quality',
    Quality4K: '#Quality-4K',
    Quality8K: '#Quality-8K',
    Checkbox4K: '.adjustment_checkbox.fourK',
    Checkbox8K: '.adjustment_checkbox.eightK',
    FourKAndEightK: '.fourK,.eightK',
    SelectScreenMode: 'input[name="Screen-Mode"]',
    WebfullUnlock: '#Webfull-Unlock',
    AutoReload: '#Auto-Reload',
    AutoSkip: '#Auto-Skip',
    InsertVideoDescriptionToComment: '#Insert-Video-Description-To-Comment',
    PauseVideo: '#PauseVideo',
    ContinuePlay: '#ContinuePlay',
    AutoSubtitle: '#AutoSubtitle',
  }
  const shadowRootSelectors = {
    videoComments: '#comment bili-comments',
    videoComment: '#feed > bili-comment-thread-renderer',
    biliRichText: '#content > bili-rich-text',
    videoTime: '#contents > a[data-type="seek"][data-video-time]',
  }
  const vals = {
    is_vip: () => { return utils.getValue('is_vip') },
    player_type: () => { return utils.getValue('player_type') },
    offset_top: () => { return Math.trunc(utils.getValue('offset_top')) },
    auto_locate: () => { return utils.getValue('auto_locate') },
    get_offset_method: () => { return utils.getValue('get_offset_method') },
    auto_locate_video: () => { return utils.getValue('auto_locate_video') },
    auto_locate_bangumi: () => { return utils.getValue('auto_locate_bangumi') },
    click_player_auto_locate: () => { return utils.getValue('click_player_auto_locate') },
    video_player_offset_top: () => { return Math.trunc(utils.getValue('video_player_offset_top')) },
    bangumi_player_offset_top: () => { return Math.trunc(utils.getValue('bangumi_player_offset_top')) },
    current_screen_mode: () => { return utils.getValue('current_screen_mode') },
    selected_screen_mode: () => { return utils.getValue('selected_screen_mode') },
    auto_select_video_highest_quality: () => { return utils.getValue('auto_select_video_highest_quality') },
    contain_quality_4k: () => { return utils.getValue('contain_quality_4k') },
    contain_quality_8k: () => { return utils.getValue('contain_quality_8k') },
    webfull_unlock: () => { return utils.getValue('webfull_unlock') },
    auto_reload: () => { return utils.getValue('auto_reload') },
    auto_skip: () => { return utils.getValue('auto_skip') },
    insert_video_description_to_comment: () => { return utils.getValue('insert_video_description_to_comment') },
    web_video_link: () => { return utils.getValue('web_video_link') },
    signIn_date: () => { return utils.getValue('signIn_date') },
    dev_checkScreenModeSwitchSuccess_method: () => { return utils.getValue('dev_checkScreenModeSwitchSuccess_method') },
    pause_video: () => { return utils.getValue('pause_video') },
    continue_play: () => { return utils.getValue('continue_play') },
    auto_subtitle: () => { return utils.getValue('auto_subtitle') },
  }
  const styles = {
    BilibiliAdjustment: '::-webkit-scrollbar{width:6px!important;height:6px!important}::-webkit-scrollbar-track-piece{border-radius:0!important;background-color:#212121!important}::-webkit-scrollbar-thumb:vertical{height:5px!important;border-radius:6px!important;background-color:#00a1d6!important}::-webkit-scrollbar-thumb:horizontal{width:5px!important;border-radius:6px!important;background-color:#00a1d6!important}::-webkit-scrollbar-corner{border-radius:0!important;background-color:#141414!important}.adjustment_popover{position:fixed;top:50%;left:50%;box-sizing:border-box;margin:0;padding:15px;width:400px;max-height:70vh;border:0;border-radius:6px;font-size:1em;transform:translate(-50%,-50%);overscroll-behavior:contain;background:#212121;overflow-y:auto;color:#868686;border:1px solid #424242}.adjustment_popover::backdrop{backdrop-filter:blur(3px)}.adjustment_popoverTitle{margin-bottom:15px;text-align:center;font-weight:700;font-size:22px}.adjustment_popoverTitle .subTitle{font-size:14px}.recommend{padding:3px;border:1px solid #424242;border-radius:6px;box-sizing:border-box;text-align:center;margin-bottom:15px;font-size:14px}.recommend a{color:#00a1d6;text-decoration:none}.adjustment_buttonGroup{display:flex;margin-top:10px;align-items:center;justify-content:end;gap:10px}.adjustment_button{display:inline-block;box-sizing:border-box;margin:0;padding:10px 20px;outline:0;border:1px solid #424242;border-radius:4px;background:#fff;color:#606266;text-align:center;white-space:nowrap;font-weight:500;font-size:14px;line-height:1;cursor:pointer;transition:.1s;-webkit-appearance:none;-moz-user-select:none;-webkit-user-select:none;-ms-user-select:none}.adjustment_button.plain:disabled,.adjustment_button.plain:disabled:active,.adjustment_button.plain:disabled:focus,.adjustment_button.plain:disabled:hover,.adjustment_button:disabled,.adjustment_button:disabled:active,.adjustment_button:disabled:focus,.adjustment_button:disabled:hover{border-color:#ebeef5;background-color:#fff;background-image:none;color:#c0c4cc;cursor:not-allowed}.adjustment_button.primary{border-color:#00a1d6;background-color:#00a1d6;color:#fff}.adjustment_button.success{border-color:#67c23a;background-color:#67c23a;color:#fff}.adjustment_button.info{border-color:#909399;background-color:#909399;color:#fff}.adjustment_button.warning{border-color:#e6a23c;background-color:#e6a23c;color:#fff}.adjustment_button.danger{border-color:#f56c6c;background-color:#f56c6c;color:#fff}.adjustment_button.primary:focus,.adjustment_button.primary:hover{border-color:#66b1ff;background:#66b1ff;color:#fff}.adjustment_button.success:focus,.adjustment_button.success:hover{border-color:#85ce61;background:#85ce61;color:#fff}.adjustment_button.info:focus,.adjustment_button.info:hover{border-color:#a6a9ad;background:#a6a9ad;color:#fff}.adjustment_button.warning:focus,.adjustment_button.warning:hover{border-color:#ebb563;background:#ebb563;color:#fff}.adjustment_button.danger:focus,.adjustment_button.danger:hover{border-color:#f78989;background:#f78989;color:#fff}.adjustment_button.primary.plain{border-color:#b3d8ff;background:#ecf5ff;color:#409eff}.adjustment_button.success.plain{border-color:#c2e7b0;background:#f0f9eb;color:#67c23a}.adjustment_button.info.plain{border-color:#a6a9ad;background:#a6a9ad;color:#fff}.adjustment_button.warning.plain{border-color:#f5dab1;background:#fdf6ec;color:#e6a23c}.adjustment_button.danger.plain{border-color:#fbc4c4;background:#fef0f0;color:#f56c6c}.adjustment_button.primary.plain:focus,.adjustment_button.primary.plain:hover{border-color:#409eff;background:#409eff;color:#fff}.adjustment_button.success.plain:focus,.adjustment_button.success.plain:hover{border-color:#67c23a;background-color:#67c23a;color:#fff}.adjustment_button.info.plain:focus,.adjustment_button.info.plain:hover{border-color:#909399;background-color:#909399;color:#fff}.adjustment_button.warning.plain:focus,.adjustment_button.warning.plain:hover{border-color:#e6a23c;background-color:#e6a23c;color:#fff}.adjustment_button.danger.plain:focus,.adjustment_button.danger.plain:hover{border-color:#f56c6c;background-color:#f56c6c;color:#fff}.adjustment_button.primary:disabled,.adjustment_button.primary:disabled:active,.adjustment_button.primary:disabled:focus,.adjustment_button.primary:disabled:hover{border-color:#a0cfff;background-color:#a0cfff;color:#fff}.adjustment_button.success:disabled,.adjustment_button.success:disabled:active,.adjustment_button.success:disabled:focus,.adjustment_button.success:disabled:hover{border-color:#b3e19d;background-color:#b3e19d;color:#fff}.adjustment_button.info:disabled,.adjustment_button.info:disabled:active,.adjustment_button.info:disabled:focus,.adjustment_button.info:disabled:hover{border-color:#c8c9cc;background-color:#c8c9cc;color:#fff}.adjustment_button.warning:disabled,.adjustment_button.warning:disabled:active,.adjustment_button.warning:disabled:focus,.adjustment_button.warning:disabled:hover{border-color:#f3d19e;background-color:#f3d19e;color:#fff}.adjustment_button.danger:disabled,.adjustment_button.danger:disabled:active,.adjustment_button.danger:disabled:focus,.adjustment_button.danger:disabled:hover{border-color:#fab6b6;background-color:#fab6b6;color:#fff}.adjustment_button.primary.plain:disabled,.adjustment_button.primary.plain:disabled:active,.adjustment_button.primary.plain:disabled:focus,.adjustment_button.primary.plain:disabled:hover{border-color:#d9ecff;background-color:#ecf5ff;color:#8cc5ff}.adjustment_button.success.plain:disabled,.adjustment_button.success.plain:disabled:active,.adjustment_button.success.plain:disabled:focus,.adjustment_button.success.plain:disabled:hover{border-color:#e1f3d8;background-color:#f0f9eb;color:#a4da89}.adjustment_button.info.plain:disabled,.adjustment_button.info.plain:disabled:active,.adjustment_button.info.plain:disabled:focus,.adjustment_button.info.plain:disabled:hover{border-color:#e9e9eb;background-color:#f4f4f5;color:#bcbec2}.adjustment_button.warning.plain:disabled,.adjustment_button.warning.plain:disabled:active,.adjustment_button.warning.plain:disabled:focus,.adjustment_button.warning.plain:disabled:hover{border-color:#faecd8;background-color:#fdf6ec;color:#f0c78a}.adjustment_button.danger.plain:disabled,.adjustment_button.danger.plain:disabled:active,.adjustment_button.danger.plain:disabled:focus,.adjustment_button.danger.plain:disabled:hover{border-color:#fde2e2;background-color:#fef0f0;color:#f9a7a7}.adjustment_tips{display:inline-block;box-sizing:border-box;padding:3px 5px;height:fit-content;border:1px solid #d9ecff;border-radius:4px;background-color:#272727;color:#409eff;font-size:14px;line-height:1.5}.adjustment_tips.info{border-color:#424242;background-color:#272727;color:#868686}.adjustment_tips.success{border-color:#e1f3d8;background-color:#f0f9eb;color:#67c23a}.adjustment_tips.warning{border-color:#faecd8;background-color:#fdf6ec;color:#e6a23c}.adjustment_tips.danger{border-color:#fde2e2;background-color:#fef0f0;color:#f56c6c}.adjustment_form,.adjustment_form_item{display:flex;flex-direction:column}.adjustment_form{gap:15px}.adjustment_form_item{gap:15px;background:#2c2c2c;padding:15px;border-radius:6px}.adjustment_checkbox,.adjustment_form_item_content{display:flex;align-items:center;justify-content:space-between}.adjustment_checkbox_btn .knob,.adjustment_checkbox_btn .btn-bg{position:absolute;top:0;right:0;bottom:0;left:0}.adjustment_checkbox_btn,.adjustment_radio_btn{position:relative;top:50%;width:54px;height:26px;overflow:hidden}.adjustment_checkbox_btn.btn-pill,.adjustment_checkbox_btn.btn-pill>.btn-bg{border-radius:100px}.adjustment_checkbox_btn .checkbox,.adjustment_checkbox .radio{position:relative;width:100%;height:100%;padding:0;margin:0;opacity:0;cursor:pointer;z-index:3}.adjustment_checkbox_btn .knob{z-index:2}.adjustment_checkbox_btn .btn-bg{width:100%;background-color:#fcebeb;transition:.3s ease all;z-index:1}.adjustment_checkbox_btn .knob::before{content:"";position:absolute;top:3px;left:3px;width:9px;height:4px;color:#fff;font-size:10px;font-weight:bold;text-align:center;line-height:1;padding:8px 6px;background-color:#f44336;border-radius:50%;transition:.3s cubic-bezier(0.18,0.89,0.35,1.15) all}.adjustment_checkbox_btn .checkbox:checked+.knob::before{content:"";left:30px;background-color:#00a1d6}.adjustment_checkbox_btn .checkbox:checked ~ .btn-bg{background-color:#ebf7fc}.adjustment_checkbox_btn .knob,.adjustment_checkbox_btn .knob::before,.adjustment_checkbox_btn .btn-bg{transition:.3s ease all}.adjustment_radio_btn{gap:15px;width:66px;overflow:auto;height:26px;display:flex;align-items:center;justify-content:flex-start}.adjustment_radio_btn .radio{width:auto;height:auto}.adjustment_radio_btn .circle{position:absolute;top:0;right:0;bottom:0;left:0;z-index:2}.adjustment_radio_btn .radio+.circle::before{content:"";position:absolute;top:7px;left:5px;width:8px;height:8px;border-radius:50%;background:#424242;border:3px solid #272727;outline:2px solid #424242}.adjustment_radio_btn .radio:checked+.circle::before{background-color:#00a1d6;border-color:#ebf7fc;outline-color:#00a1d6}.adjustment_form_item label{font-size:18px}.adjustment_checkboxGroup{display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:10px}.adjustment_checkboxGroup span{color:#666}.adjustment_checkbox{width:100%;font-size:16px;gap:3px}.adjustment_input{display:inline-flex;padding:1px 11px;outline:0;border:1px solid #424242;border-radius:6px;background:#272727;line-height:32px;cursor:text;align-items:center;justify-content:center;color:#868686;width:100%;box-sizing:border-box}',
    IndexAdjustment: '#indexRecommendVideoHistoryOpenButton{margin-top:10px}#indexRecommendVideoHistoryPopover{width:600px}#indexRecommendVideoHistoryPopover #indexRecommendVideoHistoryPopoverTitle{display:flex;box-sizing:border-box;padding-bottom:15px;border-bottom:1px solid #424242;font-weight:700;font-size:22px;align-items:center;justify-content:space-between}#indexRecommendVideoHistoryPopover ul{display:flex;flex-direction:column;align-items:center;justify-content:space-between}ul#indexRecommendVideoHistoryCategory{display:grid;margin:10px 0 0;padding-bottom:10px;border-bottom:1px solid #424242!important;gap:5px;grid-template-columns:repeat(8,1fr);align-items:center;justify-content:center}ul#indexRecommendVideoHistoryCategory li{padding:3px 0!important;border:1px solid;border-radius:6px;justify-content:center}#indexRecommendVideoHistoryPopover ul li{display:flex;align-items:center;padding:7px 0;width:100%;border:1px solid #424242!important;line-height:24px}#indexRecommendVideoHistoryPopover #indexRecommendVideoHistoryList li{border-width:0 0 1px 0!important}#indexRecommendVideoHistoryPopover #indexRecommendVideoHistoryList li span{display:flex;width:32px;height:24px;margin-right:5px;border-radius:4px; overflow:hidden}#indexRecommendVideoHistoryPopover #indexRecommendVideoHistoryList li span img{width:100%;height:24px;object-fit:inherit}#indexRecommendVideoHistoryPopover #indexRecommendVideoHistoryList li a{color:#868686!important}#indexRecommendVideoHistoryPopover #indexRecommendVideoHistoryList li:hover a{color:#00a1d6!important}#clearRecommendVideoHistoryButton{position:sticky;display:flex;padding:10px;width:80px;border-radius:6px;background:#00a1d6;color:#fff;font-size:15px;line-height:16px;cursor:pointer;align-items:center;justify-content:center}',
    VideoPageAdjustment: '.back-to-top-wrap .locate{visibility:hidden}.back-to-top-wrap:has(.visible) .locate{visibility:visible}.bpx-player-container[data-screen=full] #goToComments{opacity:.6;cursor:not-allowed;pointer-events:none}#comment-description .user-name{display:flex;padding:0 5px;height:22px;border:1px solid;border-radius:4px;align-items:center;justify-content:center}.bpx-player-ctrl-skip{border:none!important;background:0 0!important}.bpx-player-container[data-screen=full] #setSkipTimeNodesPopoverToggleButton,.bpx-player-container[data-screen=web] #setSkipTimeNodesPopoverToggleButton{height:32px!important;line-height:32px!important}#setSkipTimeNodesPopover{top:50%!important;left:50%!important;box-sizing:border-box!important;padding:15px!important;max-width:456px!important;border:0!important;border-radius:6px!important;font-size:14px!important;transform:translate(-50%,-50%)!important}#setSkipTimeNodesPopover .setSkipTimeNodesWrapper{display:flex!important;flex-direction:column!important;gap:7px!important}#setSkipTimeNodesPopover .setSkipTimeNodesWrapper button{display:flex!important;width:100%;height:34px!important;border-style:solid!important;border-width:1px!important;border-radius:6px!important;text-align:center!important;line-height:34px!important;cursor:pointer;align-items:center!important;justify-content:center!important}#setSkipTimeNodesPopover .setSkipTimeNodesWrapper button:disabled{cursor:not-allowed}#setSkipTimeNodesPopover .setSkipTimeNodesWrapper .header{display:flex!important;font-weight:700!important;align-items:center!important;justify-content:space-between!important}#setSkipTimeNodesPopover .setSkipTimeNodesWrapper .header .title{font-weight:700!important;font-size:16px!important}#setSkipTimeNodesPopover .setSkipTimeNodesWrapper .header .extra{font-size:12px!important}#setSkipTimeNodesPopover .setSkipTimeNodesWrapper .header .extra,#setSkipTimeNodesPopover .setSkipTimeNodesWrapper .result{padding:2px 5px!important;border:1px solid #d9ecff!important;border-radius:6px!important;background-color:#ecf5ff!important;color:#409eff!important;font-weight:400!important}#setSkipTimeNodesPopover .setSkipTimeNodesWrapper .success{display:flex!important;padding:2px 5px!important;border-color:#e1f3d8!important;background-color:#f0f9eb!important;color:#67c23a!important}#setSkipTimeNodesPopover .setSkipTimeNodesWrapper .danger{display:flex!important;padding:2px 5px!important;border-color:#fde2e2!important;background-color:#fef0f0!important;color:#f56c6c!important}#setSkipTimeNodesPopover .setSkipTimeNodesWrapper .handles{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:7px!important}#setSkipTimeNodesPopover .setSkipTimeNodesWrapper .tips{position:relative!important;overflow:hidden;box-sizing:border-box!important;padding:7px!important;border-color:#e9e9eb!important;border-radius:6px!important;background-color:#f4f4f5!important;color:#909399!important;font-size:13px!important;transition:height .3s!important}#setSkipTimeNodesPopover .setSkipTimeNodesWrapper .tips.open{height:134px!important;line-height:20px!important;}#setSkipTimeNodesPopover .setSkipTimeNodesWrapper .tips.close{height:34px!important;line-height:22px!important}#setSkipTimeNodesPopover .setSkipTimeNodesWrapper .tips .detail{position:absolute!important;top:9px!important;right:7px!important;display:flex!important;cursor:pointer!important;transition:transform .3s!important}#setSkipTimeNodesPopover .setSkipTimeNodesWrapper .tips .detail.open{transform:rotate(0)}#setSkipTimeNodesPopover .setSkipTimeNodesWrapper .tips .detail.close{transform:rotate(180deg)}#setSkipTimeNodesPopover .setSkipTimeNodesWrapper .records{display:none;flex-direction:column!important;gap:7px}#setSkipTimeNodesPopover .setSkipTimeNodesWrapper .records .recordsButtonsGroup{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:7px!important}#clearRecordsButton{border-color:#d3d4d6!important;background:#f4f4f5!important;color:#909399!important}#clearRecordsButton:disabled{border-color:#e9e9eb!important;background-color:#f4f4f5!important;color:#bcbec2!important}#saveRecordsButton{border-color:#c2e7b0!important;background:#f0f9eb!important;color:#67c23a!important}#saveRecordsButton:disabled{border-color:#e1f3d8!important;background-color:#f0f9eb!important;color:#a4da89!important}#setSkipTimeNodesInput{box-sizing:border-box!important;padding:5px!important;width:calc(100% - 39px)!important;height:34px!important;border:1px solid #cecece!important;border-radius:6px!important;line-height:34px!important}#uploadSkipTimeNodesButton,#syncSkipTimeNodesButton{width:52px!important;height:34px!important;border:none!important;background:#00a1d6!important;color:#fff!important}#uploadSkipTimeNodesButton:hover{background:#00b5e5!important}#skipTimeNodesRecordsArray{display:flex!important;padding:2px 5px!important;border-radius:6px!important}#bilibili-player .bpx-player-video-wrap{position:relative}#bilibili-player .bpx-player-video-wrap::before{position:absolute;display:block;background:var(--video-cover) top left no-repeat;background-size:cover;content:"";inset:0}#setSkipTimeNodesPopover .setSkipTimeNodesWrapper .records{display:none}',
    BodyHidden: 'body{overflow:hidden!important}',
    ResetPlayerLayout: 'body{padding-top:0;position:auto}#playerWrap{display:block}#bilibili-player{height:auto;position:relative}.bpx-player-mini-warp{display:none}',
    UnlockWebscreen: 'body.webscreen-fix{padding-top:BODYHEIGHT;position:unset}#bilibili-player.mode-webscreen{height:BODYHEIGHT;position:absolute}#playerWrap{display:none}#danmukuBox{margin-top:0}',
    FreezeHeaderAndVideoTitle: '#biliMainHeader{height:64px!important}#viewbox_report{height:108px!important;padding-top:22px!important}.members-info-container{height:86px!important;overflow:hidden!important;padding-top:11px!important}.membersinfo-wide .header{display:none!important}',
    DynamicSetting: '#dynamicSettingPopoverTitle{margin-bottom:15px;text-align:center;font-weight:700;font-size:21px}#dynamicSettingPopover #dynamicSettingPopoverTips{margin-top:5px}',
    VideoSetting: '#videoSettingPopover{width:550px;max-height:90vh}#Top-Offset{width:100px}.screen-mode .adjustment_checkboxGroup{flex-direction:row}.screen-mode .adjustment_checkboxGroup .adjustment_checkbox:last-child .adjustment_radio_btn{width:98px}',
    UnlockEpisodeSelector: '.bpx-player-control-bottom-right .bpx-player-ctrl-btn.bpx-player-ctrl-eplist{visibility:visible!important;width:36px!important}.bpx-player-ctrl-eplist-menu-wrap{min-height:auto!important;height:fit-content;overscroll-behavior:contain}'
  }
  const regexps = {
    // 如果使用全局检索符(g)，则在多次使用 RegExp.prototype.test() 时会导致脚本执行失败，
    // 因为在全局检索符下(g), RegExp.prototype.test() 在匹配成功后会设置下一次匹配的起始索引 lastindex
    // 但是当前页面的 URL 为固定字符串，在上一次匹配成功后设置的 lastindex 后没有其他字符串，所以会匹配失败
    // 例如：使用 /asifadeaway/g.test('https://www.asifadeaway.com/post/Watched.html') 检查是否含有字符串'asifadeaway',此时返回 true 并将 lastindex 设为 23
    // 后续再执行一次同样的检查则会返回 false 并将 lastindex 设为 0，因为继上次检查匹配成功后再次检查会从索引位置 23 开始，而此位置往后并没有字符串'asifadeaway'
    // 以下的正则表达式都包含了整个 URL 字符串，所以匹配成功一次之后 lastindex 会被设置为 URL 字符串的长度，再次执行后必定返回 false
    // 所以会产生匹配成功之后再次匹配就会失败的奇怪现象，就是因为 lastindex 的值在上一次匹配成功后被设为了字符串的长度
    // 因此不使用全局检索符(g)
    video: /.*:\/\/www\.bilibili\.com\/(video|bangumi\/play|list)\/.*/i,
    dynamic: /.*:\/\/t\.bilibili\.com\/.*/i,
  }
  const utils = {
    /**
     * 初始化所有数据
     * - #region 初始化所有数据
     */
    initValue() {
      const value = [{
        name: 'is_vip',
        value: true,
      }, {
        name: 'player_type',
        value: 'video',
      }, {
        name: 'offset_top',
        value: 5,
      }, {
        name: 'video_player_offset_top',
        value: 168,
      }, {
        name: 'bangumi_player_offset_top',
        value: 104,
      }, {
        name: 'auto_locate',
        value: true,
      }, {
        name: 'get_offset_method',
        value: 'function',
      }, {
        name: 'auto_locate_video',
        value: true,
      }, {
        name: 'auto_locate_bangumi',
        value: true,
      }, {
        name: 'click_player_auto_locate',
        value: true,
      }, {
        name: 'current_screen_mode',
        value: 'normal',
      }, {
        name: 'selected_screen_mode',
        value: 'wide',
      }, {
        name: 'auto_select_video_highest_quality',
        value: true,
      }, {
        name: 'contain_quality_4k',
        value: false,
      }, {
        name: 'contain_quality_8k',
        value: false,
      }, {
        name: 'webfull_unlock',
        value: false,
      }, {
        name: 'auto_reload',
        value: false,
      }, {
        name: 'auto_skip',
        value: false,
      }, {
        name: 'insert_video_description_to_comment',
        value: true
      }, {
        name: 'web_video_link',
        value: 'https://t.bilibili.com/?tab=video'
      }, {
        name: 'signIn_date',
        value: ''
      }, {
        name: 'dev_checkScreenModeSwitchSuccess_method',
        value: 'interval'
      }, {
        name: 'pause_video',
        value: false
      }, {
        name: 'continue_play',
        value: false
      }, {
        name: 'auto_subtitle',
        value: false
      },
      ]
      value.forEach(v => {
        if (utils.getValue(v.name) === undefined) {
          utils.setValue(v.name, v.value)
        }
      })
    },
    // #endregion 初始化所有数据
    /**
     * 获取自定义数据
     * - #region 获取自定义数据
     * @param {String} 数据名称
     * @returns 数据数值
     */
    getValue(name) {
      return GM_getValue(name)
    },
    // #endregion 获取自定义数据
    /**
     * 写入自定义数据
     * - #region 写入自定义数据
     * @param {String} 数据名称
     * @param {*} 数据数值
     */
    setValue(name, value) {
      GM_setValue(name, value)
    },
    // #endregion 写入自定义数据
    /**
     * 休眠
     * - #region 休眠
     * @param {Number} 时长
     * @returns
     */
    sleep(times) {
      return new Promise(resolve => setTimeout(resolve, times))
    },
    // #endregion 休眠
    /**
     * 通过名称获取指定cookie的值
     * - #region 通过名称获取指定cookie的值
     * @param {String} name cookie中某一项的名称
     * @returns 
     */
    getCookieByName(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    },
    // #endregion 通过名称获取指定cookie的值
    /**
     * 判断数组长度是否为偶数
     * - #region 判断数组长度是否为偶数
     */
    isArrayLengthEven(arr) {
      return arr.length % 2 === 0
    },
    // #endregion 判断数组长度是否为偶数
    /**
     * 向文档插入自定义样式
     * - #region 向文档插入自定义样式
     * @param {String} id 样式表id
     * @param {String} css 样式内容
     */
    insertStyleToDocument(id, css) {
      const styleElement = GM_addStyle(css)
      styleElement.id = id
    },
    // #endregion 向文档插入自定义样式
    /**
     * 自定义日志打印
     * - #region 自定义日志打印
     * - info->信息；warn->警告
     * - error->错误；debug->调试
     */
    logger: {
      info(content) {
        console.info('%c播放页调整', 'color:white;background:#006aff;padding:2px;border-radius:2px', content);
      },
      warn(content) {
        console.warn('%c播放页调整', 'color:white;background:#ff6d00;padding:2px;border-radius:2px', content);
      },
      error(content) {
        console.error('%c播放页调整', 'color:white;background:#f33;padding:2px;border-radius:2px', content);
      },
      debug(content) {
        console.info('%c播放页调整(调试)', 'color:white;background:#cc00ff;padding:2px;border-radius:2px', content);
      },
    },
    // #endregion 自定义日志打印
    /**
     * 检查当前文档是否被激活
     * - #region 检查当前文档是否被激活
     */
    checkDocumentIsHidden() {
      // 定义可见性变化事件名称
      const visibilityChangeEventNames = ['visibilitychange', 'mozvisibilitychange', 'webkitvisibilitychange', 'msvisibilitychange']
      // 确定文档隐藏属性名称
      const documentHiddenPropertyName = visibilityChangeEventNames.find(name => name in document) || 'onfocusin' in document || 'onpageshow' in window ? 'hidden' : null
      if (documentHiddenPropertyName !== null) {
        // 定义一个函数来检查文档是否隐藏
        const isHidden = () => document[documentHiddenPropertyName]
        // 定义一个函数来处理可见性变化事件
        const onChange = () => isHidden()
        // 为所有相关事件添加监听器
        utils.addVisibilityEventListeners(visibilityChangeEventNames, onChange)
        // 返回当前的隐藏状态
        return isHidden()
      }
      // 如果无法判断是否隐藏，则返回undefined
      return undefined
    },
    // 辅助函数，用于添加事件监听器
    addVisibilityEventListeners(eventList, handler) {
      eventList.forEach(eventName => document.addEventListener(eventName, handler))
      window.addEventListener('focus', handler)
      window.addEventListener('blur', handler)
      window.addEventListener('pageshow', handler)
      window.addEventListener('pagehide', handler)
    },
    // #endregion 检查当前文档是否被激活
    /**
     * 刷新当前页面
     * - #region 刷新当前页面
     */
    reloadCurrentTab(...args) {
      if (args && args[0] === true) {
        location.reload()
      } else if (vals.auto_reload()) location.reload()
    },
    // #endregion 刷新当前页面
    /**
     * 滚动文档至目标位置
     * - #region 滚动文档至目标位置
     * @param {Number} 滚动距离
     */
    documentScrollTo(offset) {
      document.documentElement.scrollTop = offset
    },
    // #endregion 滚动文档至目标位置
    /**
     * 获取指定 meta 标签的属性值
     * - #region 获取指定meta标签的属性值
     * @param {*} attribute 属性名称
     * @returns 属性值
     */
    async getMetaContent(attribute) {
      const meta = await utils.getElementAndCheckExistence(`meta[${attribute}]`)
      if (meta) {
        return meta.getAttribute('content')
      } else {
        return null
      }
    },
    // #endregion 获取指定meta标签的属性值
    /**
     * 获取 Body 元素高度
     * - #region 获取Body元素高度
     * @returns Body 元素高度
     */
    getBodyHeight() {
      const bodyHeight = document.body.clientHeight || 0
      const docHeight = document.documentElement.clientHeight || 0
      return bodyHeight < docHeight ? bodyHeight : docHeight
    },
    // #endregion 获取Body元素高度
    /**
     * 确保页面销毁时清除所有定时器
     * - #region 确保页面销毁时清除所有定时器
     */
    clearAllTimersWhenCloseTab() {
      window.addEventListener('beforeunload', () => {
        for (let id of arrays.intervalIds) {
          clearInterval(id)
        }
        arrays.intervalIds = []
      })
    },
    // #endregion 确保页面销毁时清除所有定时器
    /**
     * 获取目标元素至文档距离
     * - #region 获取目标元素至文档距离
     * @param {String} 目标元素
     * @returns 顶部和左侧距离
     */
    getElementOffsetToDocument(element) {
      let rect, win
      if (!element.getClientRects().length) {
        return {
          top: 0,
          left: 0
        }
      }
      rect = element.getBoundingClientRect()
      win = element.ownerDocument.defaultView
      return {
        top: rect.top + win.pageYOffset,
        left: rect.left + win.pageXOffset
      }
    },
    // #endregion 获取目标元素至文档距离
    /**
     * 创建并插入元素至目标元素
     * - #region 创建并插入元素至目标元素
     * @param {String} Html 字符串
     * @param {Element} 目标元素
     * @param {String} 插入方法（before/after/prepend/append）
     * @returns 被创建的元素
     */
    createElementAndInsert(HtmlString, target, method) {
      const element = elmGetter.create(HtmlString, target)
      target[method](element)
      return element
    },
    // #endregion 创建并插入元素至目标元素
    /**
     * 判断函数是否为异步函数
     * - #region 判断函数是否为异步函数
     * - 不使用 targetFunction() instanceof Promise 方法
     * - 因为这会导致 targetFunction 函数在此处执行一遍，从而增加 vars 里相关的计数变量
     * - 当之后真正执行时会因为相关计数变量值不等于 1 导致在 executeFunctionsSequentially 函数里获取不到返回值
     */
    isAsyncFunction(targetFunction) {
      return targetFunction.constructor.name === 'AsyncFunction'
    },
    // #endregion 判断函数是否为异步函数
    /**
     * 按顺序依次执行函数数组中的函数
     * - #region 按顺序依次执行函数数组中的函数
     * @param {Array} functionsArray 待执行的函数数组
     * - 当函数为异步函数时，只有当前一个函数执行完毕时才会继续执行下一个函数
     * - 当函数为同步函数时，则只会执行相应函数
     */
    executeFunctionsSequentially(functionsArray) {
      if (functionsArray.length > 0) {
        // console.log(functionsArray.length)
        const currentFunction = functionsArray.shift()
        if (utils.isAsyncFunction(currentFunction)) {
          currentFunction().then(result => {
            // console.log(currentFunction.name, result)
            if (result) {
              const { message, callback } = result
              if (message) utils.logger.info(message)
              if (callback && Array.isArray(callback)) utils.executeFunctionsSequentially(callback)
            }
            // else utils.logger.debug(currentFunction.name)
            utils.executeFunctionsSequentially(functionsArray)
          }).catch(error => {
            utils.logger.error(error)
            utils.reloadCurrentTab()
          })
        } else {
          // console.log(currentFunction.name, result)
          const result = currentFunction()
          if (result) {
            const { message } = result
            if (message) utils.logger.info(message)
          }
        }
      }
    },
    // #endregion 按顺序依次执行函数数组中的函数
    /**
     * 检查元素数组中元素是否存在
     * - #region 检查元素数组中元素是否存在
     * @param {Array} elementsArray 元素数组
     */
    checkElementExistence(elementsArray) {
      if (Array.isArray(elementsArray)) {
        return elementsArray.map(element => Boolean(element))
      } else {
        return [Boolean(elementsArray)]
      }
    },
    // #endregion 检查元素数组中元素是否存在
    /**
     * 获取元素并检查元素是否存在
     * - #region 获取元素并检查元素是否存在
     * @param {String | String[]} selectors 元素选择器
     * @param {Number} delay 超时时间
     * @param {Boolean} debug debug 开关
     * @returns 获取的元素
     */
    async getElementAndCheckExistence(selectors, ...args) {
      let delay = 7000, debug = false
      if (args.length === 1) {
        const type = typeof args[0]
        if (type === 'number') delay = args[0]
        if (type === 'boolean') debug = args[0]
      }
      if (args.length === 2) {
        delay = args[0]
        debug = args[1]
      }
      const result = await elmGetter.get(selectors, delay)
      if (debug) utils.logger.debug(utils.checkElementExistence(result))
      return result
    },
    // #endregion 获取元素并检查元素是否存在
    /**
     * 为元素添加监听器并执行相应函数
     * - #region 为元素添加监听器并执行相应函数
     */
    async addEventListenerToElement() {
      if (window.location.href === 'https://www.bilibili.com/') {
        const [$indexRecommendVideoRollButton, $clearRecommendVideoHistoryButton] = await utils.getElementAndCheckExistence([selectors.indexRecommendVideoRollButton, selectors.clearRecommendVideoHistoryButton])
        $indexRecommendVideoRollButton.addEventListener('click', () => {
          const functionsArray = [
            modules.setIndexRecordRecommendVideoHistory,
            modules.getIndexRecordRecommendVideoHistory,
            modules.generatorVideoCategories
          ]
          setTimeout(() => {
            vars.setIndexRecordRecommendVideoHistoryArrayCount = 0
            utils.executeFunctionsSequentially(functionsArray)
          }, 1000)
        })
        $clearRecommendVideoHistoryButton.addEventListener('click', () => {
          modules.clearRecommendVideoHistory()
        })
      }
      if (regexps.video.test(window.location.href)) {
        if (window.onurlchange === null) {
          window.addEventListener('urlchange', () => {
            modules.functionsNeedToExecuteWhenUrlHasChanged()
            // utils.logger.debug('URL改变了！')
          })
        } else {
          modules.clickRelatedVideoAutoLocation()
        }
        window.addEventListener("popstate", () => {
          // utils.logger.debug('URL改变了！！')
          modules.functionsNeedToExecuteWhenUrlHasChanged()
        })
        const [$playerContainer, $AutoSkipSwitchInput, $AutoEnableSubtitleSwitchInput] = await utils.getElementAndCheckExistence([selectors.playerContainer, selectors.AutoSkipSwitchInput, selectors.AutoEnableSubtitleSwitchInput])
        $playerContainer.addEventListener('fullscreenchange', (event) => {
          let isFullscreen = document.fullscreenElement === event.target
          if (!isFullscreen) modules.locationToPlayer()
        })
        document.addEventListener('keydown', (event) => {
          if (event.key === 'j') {
            $AutoSkipSwitchInput.click()
          }
        })
        document.addEventListener('keydown', (event) => {
          if (event.key === 'l') {
            $AutoEnableSubtitleSwitchInput.click()
          }
        })
        if (vals.auto_skip()) {
          const [$video, $setSkipTimeNodesPopoverToggleButton, $setSkipTimeNodesPopoverRecords, $skipTimeNodesRecordsArray, $saveRecordsButton] = await utils.getElementAndCheckExistence([selectors.video, selectors.setSkipTimeNodesPopoverToggleButton, selectors.setSkipTimeNodesPopoverRecords, selectors.skipTimeNodesRecordsArray, selectors.saveRecordsButton])
          document.addEventListener('keydown', (event) => {
            if (event.key === 'k') {
              const currentTime = Math.ceil($video.currentTime)
              arrays.skipNodesRecords.push(currentTime)
              arrays.skipNodesRecords = Array.from(new Set(arrays.skipNodesRecords))
              if (arrays.skipNodesRecords.length > 0) {
                $setSkipTimeNodesPopoverRecords.style.display = 'flex'
                $skipTimeNodesRecordsArray.innerText = `打点数据：${JSON.stringify(arrays.skipNodesRecords)}`
                if (utils.isArrayLengthEven(arrays.skipNodesRecords)) {
                  $skipTimeNodesRecordsArray.classList.remove('danger')
                  $skipTimeNodesRecordsArray.classList.add('success')
                  $saveRecordsButton.removeAttribute('disabled')
                } else {
                  $skipTimeNodesRecordsArray.classList.remove('success')
                  $skipTimeNodesRecordsArray.classList.add('danger')
                  $saveRecordsButton.setAttribute('disabled', true)
                }
              }
            }
            if (event.key === 'g') {
              $setSkipTimeNodesPopoverToggleButton.click()
            }
          })
        }
      }
    }
    // #endregion 为元素添加监听器并执行相应函数
  }
  const biliApis = {
    /**
     * 获取解密WBI鉴权后的参数
     * - #region 获取解密WBI鉴权后的参数
     * @param {Object} originalParams 
     * @returns 
     */
    async getQueryWithWbi(originalParams) {
      const mixinKeyEncTab = [
        46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49,
        33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40,
        61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11,
        36, 20, 34, 44, 52
      ]

      // 对 imgKey 和 subKey 进行字符顺序打乱编码
      const getMixinKey = (orig) => mixinKeyEncTab.map(n => orig[n]).join('').slice(0, 32)

      // 为请求参数进行 wbi 签名
      const encWbi = (params, img_key, sub_key) => {
        const mixin_key = getMixinKey(img_key + sub_key),
          curr_time = Math.round(Date.now() / 1000),
          chr_filter = /[!'()*]/g

        Object.assign(params, { wts: curr_time }) // 添加 wts 字段
        // 按照 key 重排参数
        const query = Object.keys(params).sort().map(key => {
          // 过滤 value 中的 "!'()*" 字符
          const value = params[key].toString().replace(chr_filter, '')
          return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        }).join('&')

        const wbi_sign = MD5(query + mixin_key) // 计算 w_rid

        return query + '&w_rid=' + wbi_sign
      }

      // 获取最新的 img_key 和 sub_key
      const getWbiKeys = async () => {
        const url = 'https://api.bilibili.com/x/web-interface/nav'
        const res = await axios.get(url, { withCredentials: true })
        const { data: { wbi_img: { img_url, sub_url } } } = res.data

        return {
          img_key: img_url.slice(
            img_url.lastIndexOf('/') + 1,
            img_url.lastIndexOf('.')
          ),
          sub_key: sub_url.slice(
            sub_url.lastIndexOf('/') + 1,
            sub_url.lastIndexOf('.')
          )
        }
      }
      const main = async () => {
        const web_keys = await getWbiKeys()
        const params = originalParams,
          img_key = web_keys.img_key,
          sub_key = web_keys.sub_key
        const query = encWbi(params, img_key, sub_key)
        return query
      }
      return main()
    },
    // #endregion 获取解密WBI鉴权后的参数
    /**
     * 获取视频基本信息
     * - #region 获取视频基本信息
     * @param {String} videoId 视频ID(video BVID)
     * @returns videoInfo
     */
    async getVideoInformation(videoId) {
      const url = `https://api.bilibili.com/x/web-interface/view?bvid=${videoId}`
      const { data, data: { code } } = await axios.get(url, { withCredentials: true })
      if (code === 0) return data
      else if (code === -400) utils.logger.info("获取视频基本信息丨请求错误")
      else if (code === -403) utils.logger.info("获取视频基本信息丨权限不足")
      else if (code === -404) utils.logger.info("获取视频基本信息丨无视频")
      else if (code === 62002) utils.logger.info("获取视频基本信息丨稿件不可见")
      else if (code === 62004) utils.logger.info("获取视频基本信息丨稿件审核中")
      else if (code === 'ERR_BAD_REQUEST') utils.logger.info("获取视频基本信息丨请求失败")
      else utils.logger.warn("获取视频基本信息丨请求错误")
    },
    // #endregion 获取视频基本信息
    /**
     * 获取用户基本信息
     * - #region 获取用户基本信息
     * @param {String} userId 用户ID
     * @returns userInfo
     */
    async getUserInformation(userId) {
      const url = `https://api.bilibili.com/x/web-interface/card?mid=${userId}`
      const { data, data: { code } } = await axios.get(url, { withCredentials: true })
      if (code === 0) return data
      else if (code === -400) utils.logger.info("获取用户基本信息丨请求错误")
      else if (code === -403) utils.logger.info("获取用户基本信息丨权限不足")
      else if (code === -404) utils.logger.info("获取用户基本信息丨用户不存在")
      else if (code === 'ERR_BAD_REQUEST') utils.logger.info("获取用户基本信息丨请求失败")
      else utils.logger.warn("获取用户基本信息丨请求失败")
    },
    // #endregion 获取用户基本信息
    /**
     * 判断用户是否是大会员
     * - #region 判断用户是否是大会员
     * - 签到后执行，若已签到则不执行，避免触发多次请求
     */
    async isVip() {
      const userId = utils.getCookieByName('DedeUserID')
      const { data: { card: { vip: { status } } } } = await biliApis.getUserInformation(userId)
      if (status) utils.setValue('is_vip', true)
      else utils.setValue('is_vip', false)
    },
    // #endregion 判断用户是否是大会员
    /**
     * 自动签到
     * - #region 自动签到
     */
    async autoSignIn() {
      const now = new Date()
      const signInDate = `${now.getFullYear()}-${(now.getMonth() + 1)}-${now.getDate()}`
      if (!vals.signIn_date() || vals.signIn_date() !== signInDate) {
        const url = `https://api.live.bilibili.com/sign/doSign`
        const { data: { code } } = await axios.get(url, { withCredentials: true })
        if (code === 0) {
          utils.logger.info("自动签到丨签到成功")
          utils.setValue('signIn_date', signInDate)
          await biliApis.isVip()
        } else if (code === 1011040) {
          utils.logger.info("自动签到丨今日已签")
          utils.setValue('signIn_date', signInDate)
        } else {
          utils.logger.warn("自动签到丨签到异常")
          utils.setValue('signIn_date', '')
        }
      } else {
        utils.logger.info("自动签到丨今日已签")
      }
    },
    // #endregion 自动签到
    /**
     * 获取用户投稿视频列表
     * - #region 获取用户投稿视频列表
     */
    async getUserVideoList(userId) {
      const wib = await biliApis.getQueryWithWbi({ mid: userId })
      const url = `https://api.bilibili.com/x/space/wbi/arc/search?${wib}`
      const { data, data: { code } } = await axios.get(url, { withCredentials: true })
      if (code === 0) return data
      else if (code === -400) {
        utils.logger.info("获取用户投稿视频列表丨权限不足")
      } else if (code === -412) {
        utils.logger.info("获取用户投稿视频列表丨请求被拦截")
      } else {
        utils.logger.warn("获取用户投稿视频列表丨请求失败")
      }
    },
    // #endregion 获取用户投稿视频列表
  }
  const modules = {
    //** ----------------------- 通用功能 ----------------------- **//
    // #region 通用功能
    /**
     * 获取视频类型(video/bangumi)
     * - #region 获取视频类型
     * 如果都没匹配上则弹窗报错
     * @returns 当前视频类型
     */
    async getCurrentPlayerType(url = window.location.href) {
      let playerType
      const setCurrentPlayerType = () => {
        playerType = (url.startsWith('https://www.bilibili.com/video') || url.startsWith('https://www.bilibili.com/list/')) ? 'video' : url.startsWith('https://www.bilibili.com/bangumi') ? 'bangumi' : false
        if (!playerType) {
          utils.logger.debug('视频类型丨未匹配')
          alert('未匹配到当前视频类型，请反馈当前地址栏链接。')
        }
        utils.setValue('player_type', playerType)
      }
      window.addEventListener('focus', () => {
        setCurrentPlayerType()
      })
      // utils.logger.debug(`${playerType} ${vals.player_type()}`)
      setCurrentPlayerType()
      if (vals.player_type() === playerType) return { message: `视频类型丨${playerType}` }
      else modules.getCurrentPlayerType()
    },
    // #endregion 获取视频类型
    /**
     * 判断用户是否登录
     * - #region 判断用户是否登录
     */
    isLogin() {
      return Boolean(document.cookie.replace(/(?:(?:^|.*;\s*)bili_jct\s*=\s*([^;]*).*$)|^.*$/, '$1') || window.UserStatus.userInfo.isLogin || null)
    },
    // #endregion 判断用户是否登录
    /**
     * 获取视频ID/video BVID/bangumi EPID
     * - #region 获取视频ID
     */
    getCurrentVideoID(url = window.location.href) {
      return url.startsWith('https://www.bilibili.com/video') ? url.split('/')[4] : url.startsWith('https://www.bilibili.com/bangumi') ? url.split('/')[5].split('?')[0] : 'error'
    },
    // #endregion 获取视频ID
    /**
     * 获取Vue版本号
     * - #region 获取Vue版本号
     */
    async getVueScopeId(selector) {
      const element = await utils.getElementAndCheckExistence(selector)
      // utils.logger.debug(element)
      return new Promise((resolve, reject) => {
        let attrsArray = Array.from(element.attributes)
        let vueScopeAttrs = attrsArray.filter(attr => attr.name.startsWith('data-v-'))
        vueScopeAttrs.filter(attr => {
          // 使用字符串分割来提取 'data-v-' 后面的部分  
          const vueScopeId = attr.name.split('data-v-')[1];
          resolve(vueScopeId)
          // utils.logger.debug(vueScopeId) 
        })
      })
    },
    // #endregion 获取Vue版本号
    // #endregion 通用功能
    //** ----------------------- 视频播放页相关功能 ----------------------- **//
    // #region 视频播放页相关功能
    /**
     * 检查视频元素是否存在
     * - #region 检查视频元素是否存在
     * - 若存在返回成功消息
     * - 若不存在则抛出异常
     */
    async checkVideoExistence() {
      const [$videoWrap, $video] = await utils.getElementAndCheckExistence([selectors.videoWrap, selectors.video])
      if ($video) return { message: '播放器｜已找到', callback: [modules.setVideoCover.bind(null, $videoWrap, $video)] }
      else throw new Error('播放器｜未找到')
    },
    // #endregion 检查视频元素是否存在
    /**
     * 检查视频是否可以播放
     * - #region 检查视频是否可以播放
     */
    async checkVideoCanPlayThrough() {
      return new Promise((resolve, reject) => {
        let attempts = 100
        let message, result
        const timer = setInterval(() => {
          const $video = document.querySelector(selectors.video)
          const videoReadyState = $video.readyState
          if (videoReadyState === 4) {
            message = '视频资源｜可以播放'
            result = true
            resolve({ message, result })
            clearInterval(timer)
          } else if (attempts <= 0) {
            message = '视频资源｜加载失败'
            result = false
            utils.reloadCurrentTab(true)
            reject({ message, result })
            clearInterval(timer)
          }
          attempts--
        }, 100)
        arrays.intervalIds.push(timer)
      })
    },
    // #endregion 检查视频是否可以播放
    /**
     * 监听屏幕模式变化(normal/wide/web/full)
     * - #region 监听屏幕模式变化
     */
    async observerPlayerDataScreenChanges() {
      const $playerContainer = await utils.getElementAndCheckExistence(selectors.playerContainer)
      const observer = new MutationObserver(() => {
        const playerDataScreen = $playerContainer.getAttribute('data-screen')
        utils.setValue('current_screen_mode', playerDataScreen)
      })
      observer.observe($playerContainer, {
        attributes: true,
        attributeFilter: ['data-screen'],
      })
    },
    // #endregion 监听屏幕模式变化
    /**
     * 获取当前屏幕模式
     * - #region 获取当前屏幕模式
     * @param {Number} 延时
     * @returns
     */
    async getCurrentScreenMode() {
      return new Promise((resolve) => {
        let attempts = 100
        const timer = setInterval(() => {
          const $playerContainer = document.querySelector(selectors.playerContainer)
          const playerDataScreen = $playerContainer?.getAttribute('data-screen')
          if (playerDataScreen) {
            resolve(playerDataScreen)
            clearInterval(timer)
          } else if (attempts <= 0) {
            clearInterval(timer)
            throw new Error(`获取当前屏幕模式｜失败：已达到最大重试次数`)
          }
          attempts--
        }, 100)
        arrays.intervalIds.push(timer)
      })
    },
    // #endregion 获取当前屏幕模式
    /**
     * 视频未开始播放时显示视频封面
     * - #region 视频未开始播放时显示视频封面
     * - 应用于舞蹈类视频
     * - 视频播放时移除封面
     */
    async setVideoCover($videoWrap, $video) {
      if (vals.player_type() === 'bangumi') return
      const targetTids = Array.from(new Set().add([...objects.videoCategories.dance.tids, ...objects.videoCategories.fashion.tids])).flat()
      const { data: { pic, tid } } = await biliApis.getVideoInformation(modules.getCurrentVideoID(window.location.href))
      if (targetTids.includes(tid) && pic) {
        $videoWrap.style.setProperty('--video-cover', `url(${pic.replace(/^http:/i, 'https:')})`) // 设置视频封面的CSS变量
        $video.addEventListener('play', () => {
          $videoWrap.style.setProperty('--video-cover', '')
        })
        // $video.addEventListener('pause', function () {
        //   $videoWrap.style.setProperty('--video-cover', `url(${pic})`)
        // })
      }
    },
    // #endregion 视频未开始播放时显示视频封面
    /**
     * 判断当前视频是否未充电
     * - #region 判断当前视频是否未充电
     */
    checkVideoNoCharge() {
      return document.querySelector(selectors.notChargeHighLevelCover)
    },
    // #endregion 判断当前视频是否未充电
    // #region 自动选择播放器默认模式
    /**
     * 执行自动切换屏幕模式
     * - #region 执行自动切换屏幕模式
     * - 功能未开启，不执行切换函数，直接返回成功
     * - 功能开启，但当前屏幕已为宽屏或网页全屏，则直接返回成功
     * - 功能开启，执行切换函数
     */
    async autoSelectScreenMode() {
      if (modules.checkVideoNoCharge()) return
      if (++vars.autoSelectScreenModeRunningCount !== 1) return
      if (vals.selected_screen_mode() === 'close') return { message: '屏幕模式｜功能已关闭' }
      const currentScreenMode = await modules.getCurrentScreenMode()
      if (arrays.screenModes.includes(currentScreenMode)) return { message: `屏幕模式｜当前已是 ${currentScreenMode.toUpperCase()} 模式` }
      if (arrays.screenModes.includes(vals.selected_screen_mode())) {
        const result = await modules.checkScreenModeSwitchSuccess(vals.selected_screen_mode())
        if (result) return { message: `屏幕模式｜${vals.selected_screen_mode().toUpperCase()}｜切换成功` }
        else throw new Error(`屏幕模式｜${vals.selected_screen_mode().toUpperCase()}｜切换失败：已达到最大重试次数`)
      }
    },
    // #endregion 执行自动切换屏幕模式
    /**
     * 检查屏幕模式是否切换成功
     * - #region 检查屏幕模式是否切换成功
     * @param {*} expectScreenMode 期望的屏幕模式
     * - 未成功自动重试
     * - 定时器方式超过 10 次失败，1s 执行一次
     * - 递归方式超过 10 次返回失败
     */
    async checkScreenModeSwitchSuccess(expectScreenMode) {
      const enterBtnMap = {
        wide: async () => await utils.getElementAndCheckExistence(selectors.screenModeWideEnterButton),
        web: async () => await utils.getElementAndCheckExistence(selectors.screenModeWebEnterButton),
      }
      // 定时器方式检查
      if (vals.dev_checkScreenModeSwitchSuccess_method() === 'interval') {
        if (enterBtnMap[expectScreenMode]) {
          return new Promise((resolve) => {
            let attempts = 10
            const timer = setInterval(async () => {
              const enterBtn = await enterBtnMap[expectScreenMode]()
              enterBtn.click()
              const currentScreenMode = await modules.getCurrentScreenMode()
              const equal = expectScreenMode === currentScreenMode
              const success = vals.player_type() === 'video' ? expectScreenMode === 'wide' ? equal && +getComputedStyle(document.querySelector(selectors.danmukuBox))['margin-top'].slice(0, -2) > 0 : equal : equal
              if (success) {
                clearInterval(timer)
                resolve(success)
              } else if (attempts <= 0) {
                clearInterval(timer)
                resolve(false)
                utils.logger.warn(`屏幕模式切换失败，继续尝试丨当前：${currentScreenMode}，期望：${expectScreenMode}`)
              }
              attempts--
            }, 1000)
            arrays.intervalIds.push(timer)
          })
        }
      }
      if (vals.dev_checkScreenModeSwitchSuccess_method() === 'recursive') {
        // 递归方式检查
        if (enterBtnMap[expectScreenMode]) {
          const enterBtn = await enterBtnMap[expectScreenMode]()
          enterBtn.click()
          const currentScreenMode = await modules.getCurrentScreenMode()
          const equal = expectScreenMode === currentScreenMode
          const success = vals.player_type() === 'video' ? expectScreenMode === 'wide' ? equal && +getComputedStyle(document.querySelector(selectors.danmukuBox))['margin-top'].slice(0, -2) > 0 : equal : equal
          // utils.logger.debug(`${vals.player_type()} ${expectScreenMode} ${currentScreenMode} ${equal} ${success}`)
          if (success) return success
          else {
            if (++vars.checkScreenModeSwitchSuccessDepths === 10) return false
            // utils.logger.warn(`屏幕模式切换失败，继续尝试丨当前：${currentScreenMode}，期望：${expectScreenMode}`)
            await utils.sleep(300)
            return modules.checkScreenModeSwitchSuccess(expectScreenMode)
          }
        }
      }
    },
    // #endregion 检查屏幕模式是否切换成功
    // #endregion 自动选择播放器默认模式
    // #region 自动定位至播放器
    /**
     * 设置位置数据并滚动至播放器
     * - #region 设置位置数据并滚动至播放器
     * @returns 
     */
    async setLocationDataAndScrollToPlayer() {
      const getOffsetMethod = vals.get_offset_method()
      let playerOffsetTop
      if (getOffsetMethod === 'elements') {
        const $header = await utils.getElementAndCheckExistence(selectors.header)
        const $placeholderElement = await utils.getElementAndCheckExistence(selectors.videoTitleArea) || await utils.getElementAndCheckExistence(selectors.bangumiMainContainer)
        const headerHeight = $header.getBoundingClientRect().height
        const placeholderElementHeight = $placeholderElement.getBoundingClientRect().height
        playerOffsetTop = vals.player_type() === 'video' ? headerHeight + placeholderElementHeight : headerHeight + +getComputedStyle($placeholderElement)['margin-top'].slice(0, -2)
      }
      if (getOffsetMethod === 'function') {
        const $player = await utils.getElementAndCheckExistence(selectors.player)
        playerOffsetTop = utils.getElementOffsetToDocument($player).top
      }
      // utils.logger.debug(playerOffsetTop)
      vals.player_type() === 'video' ? utils.setValue('video_player_offset_top', playerOffsetTop) : utils.setValue('bangumi_player_offset_top', playerOffsetTop)
      await modules.getCurrentScreenMode() === 'wide' ? utils.documentScrollTo(playerOffsetTop - vals.offset_top()) : utils.documentScrollTo(0)
      return
      // utils.logger.debug('定位至播放器！')
    },
    // #endregion 设置位置数据并滚动至播放器
    /**
     * 自动定位至播放器并检查是否成功
     * - #region 自动定位至播放器并检查是否成功
     */
    async autoLocationToPlayer() {
      const unlockbody = () => {
        document.getElementById('BodyHiddenStyle')?.remove()
      }
      const onAutoLocate = vals.auto_locate() && ((!vals.auto_locate_video() && !vals.auto_locate_bangumi()) || (vals.auto_locate_video() && vals.player_type() === 'video') || (vals.auto_locate_bangumi() && vals.player_type() === 'bangumi'))
      if (!onAutoLocate || vals.selected_screen_mode() === 'web') return { callback: [unlockbody] }
      await modules.setLocationDataAndScrollToPlayer()
      const playerOffsetTop = vals.player_type() === 'video' ? vals.video_player_offset_top() : vals.bangumi_player_offset_top()
      const result = await modules.checkAutoLocationSuccess(playerOffsetTop - vals.offset_top())
      if (result) return { message: '自动定位｜成功', callback: [unlockbody] }
      else {
        unlockbody()
        throw new Error(`自动定位｜失败：已达到最大重试次数`)
      }
    },
    // #endregion 自动定位至播放器并检查是否成功
    /**
     * 递归检查屏自动定位是否成功
     * - #region 递归检查屏自动定位是否成功
     * @param {*} expectOffset 期望文档滚动偏移量
     * - 未定位成功自动重试，递归超过 10 次则返回失败
     * - 基础数据：
     * - videoOffsetTop：播放器相对文档顶部距离，大小不随页面滚动变化
     * - videoClientTop：播放器相对浏览器视口顶部距离，大小随页面滚动变化
     * - targetOffset：用户期望的播放器相对浏览器视口顶部距离，由用户自定义
     * - 文档滚动距离：videoOffsetTop - targetOffset
     */
    async checkAutoLocationSuccess(expectOffset) {
      const $video = await utils.getElementAndCheckExistence(selectors.video)
      utils.documentScrollTo(expectOffset)
      await utils.sleep(300)
      const videoClientTop = Math.trunc($video.getBoundingClientRect().top)
      const playerOffsetTop = vals.player_type() === 'video' ? vals.video_player_offset_top() : vals.bangumi_player_offset_top()
      // 成功条件：实际偏移量与用户设置偏移量相等/期望文档滚动偏移量与当前文档滚动偏移量相等/实际偏移量与用户设置偏移量误差小于5
      const success = (videoClientTop === vals.offset_top()) || ((playerOffsetTop - vals.offset_top()) - Math.trunc(window.scrollY) === 0) || (Math.abs(videoClientTop - vals.offset_top()) < 5)
      if (success) return success
      else {
        if (++vars.autoLocationToPlayerRetryDepths === 10) return false
        // utils.logger.debug(`${videoOffsetTop} ${videoClientTop} ${vals.offset_top()} ${Math.abs((videoOffsetTop - vals.offset_top()) - Math.trunc(window.scrollY))}`)
        utils.logger.warn(`
                    自动定位失败，继续尝试
                    -----------------
                    期望文档滚动偏移量：${playerOffsetTop - vals.offset_top()}
                    当前文档滚动偏移量：${Math.trunc(window.scrollY)}
                    文档滚动偏移量误差：${(playerOffsetTop - vals.offset_top()) - Math.trunc(window.scrollY)}
                    播放器顶部偏移量：${videoClientTop}
                    设置偏移量：${vals.offset_top()}`)
        utils.documentScrollTo(0)
        await utils.sleep(300)
        return modules.checkAutoLocationSuccess(expectOffset)
      }
    },
    // #endregion 递归检查屏自动定位是否成功
    /**
     * 文档滚动至播放器(使用已有数据)
     * - #region 文档滚动至播放器(使用已有数据)
     */
    async locationToPlayer() {
      const videoCanPlay = await modules.checkVideoCanPlayThrough()
      if (videoCanPlay.result) {
        const playerOffsetTop = vals.player_type() === 'video' ? vals.video_player_offset_top() : vals.bangumi_player_offset_top()
        const scrollOffset = await modules.getCurrentScreenMode() !== 'web' ? playerOffsetTop - vals.offset_top() : 0
        utils.documentScrollTo(scrollOffset)
      }
    },
    // #endregion 文档滚动至播放器(使用已有数据)
    /**
     * 点击播放器自动定位
     * - #region 点击播放器自动定位
     */
    async clickPlayerAutoLocation() {
      if (vals.click_player_auto_locate()) {
        const $video = await utils.getElementAndCheckExistence(selectors.video)
        $video.addEventListener('click', async () => {
          const currentScreenMode = await modules.getCurrentScreenMode()
          if (['full', 'mini'].includes(currentScreenMode)) return
          await modules.locationToPlayer()
        })
      }
    },
    // #endregion 点击播放器自动定位
    /**
     * 点击时间锚点自动返回播放器
     * - #region 点击时间锚点自动返回播放器
     */
    async clickVideoTimeAutoLocation() {
      const $video = await utils.getElementAndCheckExistence('video')
      const host = document.querySelector("#commentapp > bili-comments")
      const $descriptionClickTarget = 'video' ? await ShadowDOMHelper.queryUntil(host, "#feed > #bili-adjustment-contents") : ''
      if ($descriptionClickTarget) {
        await elmGetter.each(selectors.videoTime, $descriptionClickTarget, async (target) => {
          target.addEventListener('click', async (event) => {
            event.stopPropagation()
            await modules.locationToPlayer()
            // const targetTime = vals.player_type() === 'video' ? target.dataset.videoTime : target.dataset.time
            const targetTime = target.dataset.videoTime
            if (targetTime > $video.duration) alert('当前时间点大于视频总时长，将跳到视频结尾！')
            $video.currentTime = targetTime
            $video.play()
          })
        })
      }
      const stop = ShadowDOMHelper.watchQuery(
        host,
        '#feed',
        async item => {
          const links = ShadowDOMHelper.batchQuery(item, {
            seekLinks: '#comment >> bili-rich-text >> #contents > a[data-type="seek"]',
            replySeekLinks: 'bili-comment-replies-renderer >> bili-comment-reply-renderer >> bili-rich-text >> #contents > a[data-type="seek"]',
          })
          links.forEach(link => {
            link.addEventListener('click', async (event) => {
              event.stopPropagation();
              await modules.locationToPlayer()
              const targetTime = link.dataset.videoTime
              if (targetTime > $video.duration) alert('当前时间点大于视频总时长，将跳到视频结尾！')
              $video.currentTime = targetTime
              $video.play();
            })
          })
        },
        {
          nodeNameFilter: 'bili-comment-thread-renderer',
          debounce: 100,
          maxRetries: 5,
          observeExisting: true,
          scanInterval: 1000
        }
      )
    },
    // #endregion 点击时间锚点自动返回播放器
    // #endregion 自动定位至播放器
    /**
     * 自动关闭静音
     * - #region 自动关闭静音
     */
    async autoCancelMute() {

      if (++vars.autoCancelMuteRunningCount !== 1) return
      const [$mutedButton, $volumeButton] = await utils.getElementAndCheckExistence([selectors.mutedButton, selectors.volumeButton])
      // const mutedButtonDisplay = getComputedStyle(mutedButton)['display']
      // const volumeButtonDisplay = getComputedStyle(volumeButton)['display']
      const mutedButtonDisplay = $mutedButton.style.display
      const volumeButtonDisplay = $volumeButton.style.display
      if (mutedButtonDisplay === 'block' || volumeButtonDisplay === 'none') {
        $mutedButton.click()
        // utils.logger.info('静音丨已关闭')
        return {
          message: '静音丨已关闭'
        }
      }
    },
    // #endregion 自动关闭静音
    /**
     * 自动开启字幕
     * - #region 自动开启字幕
     */
    async autoEnableSubtitle() {
      if (!vals.auto_subtitle()) return
      const $switchSubtitleButton = await utils.getElementAndCheckExistence(selectors.switchSubtitleButton)
      const openStatus = $switchSubtitleButton.children[0].children[0].children[0].children[1].childElementCount === 1
      if (!openStatus) {
        $switchSubtitleButton.children[0].children[0].click()
        return {
          message: '视频字幕丨已开启'
        }
      }
    },
    // #endregion 自动开启字幕
    /**
     * 插入自动开启字幕功能开关
     * - #region 插入自动开启字幕功能开关
     */
    async insertAutoEnableSubtitleSwitchButton() {
      if (++vars.insertAutoEnableSubtitleSwitchButtonCount !== 1) return
      const autoEnableSubtitleSwitchButtonHtml = `
          <div id="autoEnableSubtitleSwitchButton" class="bpx-player-dm-switch bui bui-danmaku-switch" aria-label="跳过开启关闭">
            <div class="bui-area">
                <input id="${selectors.AutoEnableSubtitleSwitchInput.slice(1)}" class="bui-danmaku-switch-input" type="checkbox" ${vals.auto_subtitle() ? 'checked' : ''}>
                <label class="bui-danmaku-switch-label">
                <span class="bui-danmaku-switch-on">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 4.8h-1.5L8.8 2.3c-.3-.5-1-.6-1.4-.3s-.6.9-.3 1.4l1 1.5-2.2.1C4 5.1 2.4 6.5 2.1 8.4c-.2 1.4-.3 2.8-.2 4.2 0 1.7.1 3.4.3 5.1.3 1.9 1.9 3.3 3.8 3.4h.9c1.2.1 1.8.1 3.6.1.6 0 1-.4 1-1s-.4-1-1-1c-1.8 0-2.3 0-3.5-.1h-.9c-1 0-1.8-.8-1.9-1.7-.2-1.6-.3-3.2-.3-4.8 0-1.3.1-2.6.2-3.9C4.2 7.7 5 7 6 6.9c2.4-.1 4.5-.1 6.1-.1s3.6 0 6.1.1c1 .1 1.8.8 1.9 1.8.1.5.1 2 .1 3.1v.9c0 .6.5 1 1 1 .6 0 1-.5 1-1v-.9c0-1.1-.1-2.7-.2-3.3-.2-1.9-1.8-3.4-3.8-3.5l-2.5-.1 1.1-1.5c.2-.4.1-1-.3-1.4-.5-.3-1.1-.2-1.4.2l-1.9 2.5H12z" clip-rule="evenodd"/><path fill="#00aeec" fill-rule="evenodd" d="M22.9 14.6c-.4-.4-1-.3-1.4.1l-5.1 5.7-2.2-2.3-.2-.1c-.4-.3-1.1-.2-1.4.2-.3.4-.2.9.1 1.3l3 3 .1.1c.4.3 1 .3 1.4-.1L23 16l.1-.1c.2-.4.1-.9-.2-1.3z" clip-rule="evenodd"/><path d="M9.3 11.4H14l.7.6c-.2.2-.5.5-.8.7s-.6.5-1 .7c-.2.1-.3.2-.5.3v.2h3.8v1h-3.8v1.7c0 .3 0 .5-.1.7-.1.2-.2.3-.5.4-.2.1-.5.1-.8.2s-.7 0-1.1 0c0-.1-.1-.2-.1-.4s-.1-.3-.2-.4c-.1-.1-.1-.2-.2-.3h1.7V15H7.6v-1h3.8v-.6c.3-.1.6-.3.8-.5.2-.1.4-.3.5-.4H9.3v-1.1zM7.7 9.5h3.8v-.1c-.1-.2-.2-.5-.4-.6l1.1-.3c.1.2.3.4.4.6.1.2.2.3.2.4h3.5v2.2h-1.1v-1.2H8.7v1.2h-1V9.5z"/></svg>
                </span>
                <span class="bui-danmaku-switch-off">
                  <svg xmlns="http://www.w3.org/2000/svg" id="图层_1" viewBox="0 0 24 24"><path d="M8.1 5l-1-1.5c-.3-.5-.2-1.1.3-1.4s1.1-.2 1.4.3L10.5 5h2.7l1.9-2.6c.3-.5 1-.6 1.4-.2s.6 1 .2 1.4l-1 1.4 2.5.1c1.9.1 3.5 1.6 3.7 3.5.1.6.1 2.1.2 3.3v.9c0 .6-.4 1-1 1s-1-.4-1-1v-.9c0-1.1-.1-2.5-.1-3.1-.1-1-.9-1.8-1.9-1.8-2-.1-4-.1-6.1-.1-1.6 0-3.6 0-6.1.1-1 0-1.8.8-1.9 1.7-.2 1.3-.2 2.6-.2 3.9 0 1.6.1 3.2.3 4.8.1 1 .9 1.7 1.9 1.7 1.8.1 3.6.1 5.4.1.6 0 1 .4 1 1s-.4 1-1 1c-1.8 0-3.7 0-5.5-.1-1.9-.1-3.5-1.5-3.8-3.4-.3-1.7-.4-3.4-.4-5.1 0-1.4.1-2.8.2-4.2C2.4 6.6 4 5.2 6 5.1L8.1 5z" class="st0"/><path d="M18 14.1c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 6.5c-1.4 0-2.5-1.1-2.5-2.5 0-.4.1-.8.3-1.2l3.3 3.4c-.3.2-.7.3-1.1.3zm2.5-2.5c0 .4-.1.8-.3 1.2l-3.3-3.4c1.2-.6 2.7-.1 3.4 1.1.2.3.2.7.2 1.1z" class="st0"/><path d="M12.8 9.5c-.1-.1-.1-.3-.2-.5s-.3-.4-.4-.6l-1.1.3c.1.2.3.4.4.6v.1H7.7v2.2h1.1v-1.2h6.4v1.2h1.1V9.5h-3.5zm-.2 4.4v-.2c.2-.1.3-.2.5-.3.3-.2.7-.5 1-.7.3-.2.6-.5.8-.7l-.7-.6H9.3v1h3.4c-.2.1-.4.3-.5.4-.3.2-.5.4-.8.5v.6H7.6v1h3.8v1.8H9.6c.1.1.1.2.2.3l.2.4c0 .1.1.3.1.4h1.1c.3 0 .6-.1.8-.2.2-.1.4-.2.5-.4.1-.2.1-.4.1-.7v-1.7h1.3c.3-.4.7-.7 1.1-1h-2.4z"/></svg>
                </span>
                </label>
            </div>
          </div>`
      const autoEnableSubtitleSwitchButtonTipHtml = `
          <div id="autoEnableSubtitleTips" class="bpx-player-tooltip-item" style="visibility: hidden; opacity: 0; transform: translate(0px, 0px);">
              <div class="bpx-player-tooltip-title">关闭自动开启字幕(j)</div>
          </div>`
      const [playerDanmuSetting, playerTooltipArea] = await utils.getElementAndCheckExistence([selectors.playerDanmuSetting, selectors.playerTooltipArea])
      const $autoEnableSubtitleSwitchButton = utils.createElementAndInsert(autoEnableSubtitleSwitchButtonHtml, playerDanmuSetting, 'after')
      const autoEnableSubtitleTips = utils.createElementAndInsert(autoEnableSubtitleSwitchButtonTipHtml, playerTooltipArea, 'append')
      const $AutoEnableSubtitleSwitchInput = await utils.getElementAndCheckExistence(selectors.AutoEnableSubtitleSwitchInput)
      $AutoEnableSubtitleSwitchInput.addEventListener('change', async event => {
        const $AutoEnableSubtitleSwitchInput = await utils.getElementAndCheckExistence(selectors.AutoSubtitle)
        utils.setValue('auto_subtitle', event.target.checked)
        $AutoEnableSubtitleSwitchInput.checked = event.target.checked
        autoEnableSubtitleTips.querySelector(selectors.playerTooltipTitle).innerText = event.target.checked ? '关闭自动开启字幕(l)' : '开启自动开启字幕(l)'
      })
      $autoEnableSubtitleSwitchButton.addEventListener('mouseover', async function () {
        const { top, left } = utils.getElementOffsetToDocument(this)
        autoEnableSubtitleTips.style.top = `${top - window.scrollY - (this.clientHeight) - 12}px`
        autoEnableSubtitleTips.style.left = `${left - (autoEnableSubtitleTips.clientWidth / 2) + (this.clientWidth / 2)}px`
        autoEnableSubtitleTips.style.opacity = 1
        autoEnableSubtitleTips.style.visibility = 'visible'
        autoEnableSubtitleTips.style.transition = 'opacity .3s'
      })
      $autoEnableSubtitleSwitchButton.addEventListener('mouseout', function () {
        autoEnableSubtitleTips.style.opacity = 0
        autoEnableSubtitleTips.style.visibility = 'hidden'
      })
    },
    // #endregion 插入自动开启字幕功能开关
    /**
     * 自动选择最高画质
     * - #region 自动选择最高画质
     * - 质量代码：
     * - 127->8K 超高清;120->4K 超清;116->1080P 60帧;
     * - 80->1080P 高清；64->720P 高清；32->480P 清晰；
     * - 16->360P 流畅；0->自动
     */
    async autoSelectVideoHighestQuality() {
      if (modules.checkVideoNoCharge()) return
      if (++vars.autoSelectVideoHighestQualityRunningCount !== 1) return
      let message
      const qualitySwitchButtonsMap = new Map()
      if (!vals.auto_select_video_highest_quality()) return
      await elmGetter.each(selectors.qualitySwitchButtons, document.body, button => {
        qualitySwitchButtonsMap.set(button.dataset.value, button)
      })
      const qualitySwitchButtonsArray = [...qualitySwitchButtonsMap]
      const select4K = () => {
        qualitySwitchButtonsMap.get('120').click()
        message = '最高画质｜VIP｜4K｜切换成功'
      }
      const select8K = () => {
        qualitySwitchButtonsMap.get('127').click()
        message = '最高画质｜VIP｜4K｜切换成功'
      }
      const selectNo4K8K = () => {
        qualitySwitchButtonsArray.filter(quality => {
          return +quality[0] < 120
        })[0][1].click()
        message = '最高画质｜VIP｜不包含4K及8K｜切换成功'
      }
      if (vals.is_vip()) {
        if (!vals.contain_quality_4k() && !vals.contain_quality_8k()) {
          selectNo4K8K()
        }
        if (vals.contain_quality_4k() && !vals.contain_quality_8k()) {
          if (qualitySwitchButtonsMap.get('120')) {
            select4K()
          } else {
            selectNo4K8K()
          }
        }
        if (!vals.contain_quality_4k() && vals.contain_quality_8k()) {
          if (qualitySwitchButtonsMap.get('127')) {
            select8K()
          } else {
            selectNo4K8K()
          }
        }
        if ((vals.contain_quality_4k() && vals.contain_quality_8k())) {
          if (qualitySwitchButtonsMap.get('127')) {
            select8K()
          } else if (qualitySwitchButtonsMap.get('120')) {
            select4K()
          } else {
            selectNo4K8K()
          }
        }
      } else {
        qualitySwitchButtonsArray.filter(button => {
          return button[1].children.length < 2
        })[0][1].click()
        message = '最高画质｜非VIP｜切换成功'
      }
      // utils.logger.info(message)
      return { message }

    },
    // #endregion 自动选择最高画质
    /**
     * 插入漂浮功能按钮
     * - #region 插入漂浮功能按钮
     * - 快速返回至播放器
     */
    async insertFloatSideNavToolsButton() {
      const $floatNav = vals.player_type() === 'video' ? await utils.getElementAndCheckExistence(selectors.videoFloatNav) : await utils.getElementAndCheckExistence(selectors.bangumiFloatNav)
      const dataV = $floatNav.lastChild.attributes[1].name
      let $locateButton
      if (vals.player_type() === 'video') {
        const locateButtonHtml = '<div class="fixed-sidenav-storage-item locate" title="定位至播放器"><svg t="1643419779790" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1775" width="200" height="200" style="width: 50%;height: 100%;fill: currentColor;"><path d="M512 352c-88.008 0-160.002 72-160.002 160 0 88.008 71.994 160 160.002 160 88.01 0 159.998-71.992 159.998-160 0-88-71.988-160-159.998-160z m381.876 117.334c-19.21-177.062-162.148-320-339.21-339.198V64h-85.332v66.134c-177.062 19.198-320 162.136-339.208 339.198H64v85.334h66.124c19.208 177.062 162.144 320 339.208 339.208V960h85.332v-66.124c177.062-19.208 320-162.146 339.21-339.208H960v-85.334h-66.124zM512 810.666c-164.274 0-298.668-134.396-298.668-298.666 0-164.272 134.394-298.666 298.668-298.666 164.27 0 298.664 134.396 298.664 298.666S676.27 810.666 512 810.666z" p-id="1776"></path></svg>定位</div>'.replace('title="定位至播放器"', `title="定位至播放器" ${dataV}`)
        $locateButton = utils.createElementAndInsert(locateButtonHtml, $floatNav.lastChild, 'prepend')
      }
      if (vals.player_type() === 'bangumi') {
        const floatNavMenuItemClass = $floatNav.lastChild.lastChild.getAttribute('class')
        const locateButtonHtml = `<div class="${floatNavMenuItemClass} locate" style="height:40px;padding:0" title="定位至播放器">\n<svg t="1643419779790" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1775" width="200" height="200" style="width: 50%;height: 100%;fill: currentColor;"><path d="M512 352c-88.008 0-160.002 72-160.002 160 0 88.008 71.994 160 160.002 160 88.01 0 159.998-71.992 159.998-160 0-88-71.988-160-159.998-160z m381.876 117.334c-19.21-177.062-162.148-320-339.21-339.198V64h-85.332v66.134c-177.062 19.198-320 162.136-339.208 339.198H64v85.334h66.124c19.208 177.062 162.144 320 339.208 339.208V960h85.332v-66.124c177.062-19.208 320-162.146 339.21-339.208H960v-85.334h-66.124zM512 810.666c-164.274 0-298.668-134.396-298.668-298.666 0-164.272 134.394-298.666 298.668-298.666 164.27 0 298.664 134.396 298.664 298.666S676.27 810.666 512 810.666z" p-id="1776"></path></svg></div>`
        $locateButton = utils.createElementAndInsert(locateButtonHtml, $floatNav.lastChild, 'before')
      }
      $locateButton.addEventListener('click', async () => {
        await modules.locationToPlayer()
      })
    },
    // #endregion 插入漂浮功能按钮
    // #region 网页全屏模式解锁
    /**
     * 执行网页全屏模式解锁
     * - #region 执行网页全屏模式解锁
     */
    async webfullScreenModeUnlock() {
      if (!vals.webfull_unlock() || !vals.selected_screen_mode() === 'web' || ++vars.webfullUnlockRunningCount !== 1) return
      if (vals.player_type() === 'bangumi') return
      const [$app, $playerWrap, $player, $playerWebscreen, $wideEnterButton, $wideLeaveButton, $webEnterButton, $webLeaveButton, $fullControlButton] = await utils.getElementAndCheckExistence([selectors.app, selectors.playerWrap, selectors.player, selectors.playerWebscreen, selectors.screenModeWideEnterButton, selectors.screenModeWideLeaveButton, selectors.screenModeWebEnterButton, selectors.screenModeWebLeaveButton, selectors.screenModeFullControlButton])
      const resetPlayerLayout = async () => {
        if (document.getElementById('UnlockWebscreenStyle')) document.getElementById('UnlockWebscreenStyle').remove()
        if (!document.getElementById('ResetPlayerLayoutStyle')) utils.insertStyleToDocument('ResetPlayerLayoutStyle', styles.ResetPlayerLayout)
        $playerWrap.append($player)
        utils.setValue('current_screen_mode', 'wide')
        await modules.locationToPlayer()
      }
      const bodyHeight = utils.getBodyHeight()
      utils.insertStyleToDocument('UnlockWebscreenStyle', styles.UnlockWebscreen.replace(/BODYHEIGHT/gi, `${bodyHeight}px`))
      $app.prepend($playerWebscreen)
      $webLeaveButton.addEventListener('click', async () => {
        await utils.sleep(100)
        await resetPlayerLayout()
      })
      $webEnterButton.addEventListener('click', async () => {
        if (!document.getElementById('UnlockWebscreenStyle')) utils.insertStyleToDocument('UnlockWebscreenStyle', styles.UnlockWebscreen.replace(/BODYHEIGHT/gi, `${bodyHeight}px`))
        $app.prepend($playerWebscreen)
        await modules.locationToPlayer()
      })
      $wideEnterButton.addEventListener('click', async () => {
        await utils.sleep(100)
        await resetPlayerLayout()
      })
      $wideLeaveButton.addEventListener('click', async () => {
        await utils.sleep(100)
        await resetPlayerLayout()
      })
      $fullControlButton.addEventListener('click', async () => {
        await utils.sleep(100)
        await resetPlayerLayout()
      })
      return {
        message: '网页全屏解锁｜成功',
        callback: [modules.insertGoToCommentButton]
      }

    },
    // #endregion 执行网页全屏模式解锁
    /**
     * 网页全屏模式解锁后插入跳转评论按钮
     * - #region 网页全屏模式解锁后插入跳转评论按钮
     */
    async insertGoToCommentButton() {
      if (vals.player_type() !== 'video' || !vals.webfull_unlock() || ++vars.insertGoToCommentButtonCount !== 1) return
      const [$comment, $playerControllerBottomRight] = await utils.getElementAndCheckExistence([selectors.videoComment, selectors.playerControllerBottomRight])
      const goToCommentBtnHtml = '<div class="bpx-player-ctrl-btn bpx-player-ctrl-comment" role="button" aria-label="前往评论" tabindex="0"><div id="goToComments" class="bpx-player-ctrl-btn-icon"><span class="bpx-common-svg-icon"><svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="88" height="88" preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);"><path d="M512 85.333c235.637 0 426.667 191.03 426.667 426.667S747.637 938.667 512 938.667a424.779 424.779 0 0 1-219.125-60.502A2786.56 2786.56 0 0 0 272.82 866.4l-104.405 28.48c-23.893 6.507-45.803-15.413-39.285-39.296l28.437-104.288c-11.008-18.688-18.219-31.221-21.803-37.91A424.885 424.885 0 0 1 85.333 512c0-235.637 191.03-426.667 426.667-426.667zm-102.219 549.76a32 32 0 1 0-40.917 49.216A223.179 223.179 0 0 0 512 736c52.97 0 103.19-18.485 143.104-51.67a32 32 0 1 0-40.907-49.215A159.19 159.19 0 0 1 512 672a159.19 159.19 0 0 1-102.219-36.907z" fill="#currentColor"/></svg></span></div></div>'
      const $goToCommentButton = utils.createElementAndInsert(goToCommentBtnHtml, $playerControllerBottomRight, 'append')
      $goToCommentButton.addEventListener('click', (event) => {
        event.stopPropagation()
        utils.documentScrollTo(utils.getElementOffsetToDocument($comment).top - 10)
        // utils.logger.info('到达评论区')
      })

    },
    // #endregion 网页全屏模式解锁后插入跳转评论按钮
    // #endregion 网页全屏模式解锁
    /**
     * 将视频简介内容插入评论区或直接替换原简介区内容
     * - #region 视频简介优化
     * - 视频简介存在且内容过长，则将视频简介内容插入评论区，否则直接替换原简介区内容
     * - 若视频简介中包含型如 "00:00:00" 的时间内容，则将其转换为可点击的时间锚点元素
     * - 若视频简介中包含 URL 链接，则将其转换为跳转链接
     * - 若视频简介中包含视频 BV 号或专栏 cv 号，则将其转换为跳转链接
     */

    async insertVideoDescriptionToComment() {
      if (!vals.insert_video_description_to_comment() || vals.player_type() === 'bangumi') return
      const $commentDescription = document.getElementById('comment-description')
      if ($commentDescription) $commentDescription.remove()
      const [$videoDescription, $videoDescriptionInfo] = await utils.getElementAndCheckExistence([selectors.videoDescription, selectors.videoDescriptionInfo])
      // const $videoCommentReplyListShadowRoot = document.querySelector('#commentapp > bili-comments').shadowRoot.querySelector('#contents').querySelector('#feed')
      const host = document.querySelector('#commentapp > bili-comments')
      const $videoCommentReplyListShadowRoot = await ShadowDOMHelper.queryUntil(host, '#feed')
      // utils.logger.debug($videoCommentReplyListShadowRoot)
      const getTotalSecondsFromTimeString = (timeString) => {
        if (timeString.length === 5) timeString = '00:' + timeString
        const [hours, minutes, seconds] = timeString.split(':').map(Number)
        const totalSeconds = hours * 3600 + minutes * 60 + seconds
        return totalSeconds
      }
      const nbspToBlankRegexp = /&nbsp;/g
      const timeStringRegexp = /(\d\d:\d\d(:\d\d)*)/g
      const urlRegexp = /(?<!((href|url)="))(http|https|ftp):\/\/[\w-]+(\.[\w\-]+)*([\w\-\.\,\@\?\^\=\%\&\:\/\~\+\#;]*[\w\-\@?\^\=\%\&\/~\+#;])?/g
      const plaintVideoIdRegexp = /(?<!(>|\/))(BV1([a-km-zA-HJ-NP-Z1-9]){9})(?!(<\/))/g
      const plaintReadIdRegexp = /(?<!(>|\/))(cv([0-9]){7})(?!(<\/a))/g
      const blankRegexp = /^\s*[\r\n]/gm
      // 匹配一种特殊空白符(%09)
      const specialBlankRegexp = /%09(%09)*/g
      if ($videoDescription.childElementCount > 1 && $videoDescriptionInfo.childElementCount > 0) {
        // let $upAvatarFace, $upAvatarIcon, upAvatarFaceLink
        // const $membersContainer = document.querySelector(selectors.membersContainer)
        // if ($membersContainer) {
        //   const $membersUpAvatarFace = await utils.getElementAndCheckExistence(selectors.membersUpAvatarFace)
        //   upAvatarFaceLink = $membersUpAvatarFace.getAttribute('src')
        // } else {
        //   [$upAvatarFace, $upAvatarIcon] = await utils.getElementAndCheckExistence([selectors.upAvatarFace, selectors.upAvatarIcon])
        //   upAvatarFaceLink = $upAvatarFace.dataset.src.replace('@96w_96h_1c_1s_!web-avatar', '@160w_160h_1c_1s_!web-avatar-comment')
        // }
        // 先将内容编码后替换特殊空白符(%09)为普通空格(%20)后再解码供后续使用
        const upAvatarFaceLink = "//www.asifadeaway.com/Stylish/bilibili/avatar-description.png"
        const resetVideoDescriptionInfoHtml = decodeURIComponent(encodeURIComponent($videoDescriptionInfo.innerHTML).replace(specialBlankRegexp, '%20'))
        // 先将 % 编码为 %25 防止后续执行 decodeURIComponent() 报错，因为 % 为非法字符
        const videoDescriptionInfoHtml = resetVideoDescriptionInfoHtml.replaceAll('%', '%25').replace(nbspToBlankRegexp, ' ').replace(timeStringRegexp, (match) => {
          return `<a data-type="seek" data-video-part="-1" data-video-time="${getTotalSecondsFromTimeString(match)}">${match}</a>`
        }).replace(urlRegexp, (match) => {
          return `<a href="${match}" target="_blank">${match}</a>`
        }).replace(plaintVideoIdRegexp, (match) => {
          return `<a href="https://www.bilibili.com/video/${match}" target="_blank">${match}</a>`
        }).replace(plaintReadIdRegexp, (match) => {
          return `<a href="https://www.bilibili.com/read/${match}" target="_blank">${match}</a>`
        }).replace(blankRegexp, '')
        // const upAvatarDecorationLink = document.querySelector(selectors.upAvatarDecoration) ? document.querySelector(selectors.upAvatarDecoration).dataset.src.replace('@144w_144h_!web-avatar', '@240w_240h_!web-avatar-comment') : ''
        const shadowRootVideoDescriptionReplyTemplate = `
          <bili-adjustment-comment-thread-renderer>
              <style>#bili-adjustment-body{position:relative;padding-left:80px;padding-top:22px}#bili-adjustment-user-avatar{position:absolute;left:20px;top:22px;width:48px;height:48px;transform-origin:left top;transform:scale(1)}#bili-adjustment-avatar-picture{width:48px;height:48px;opacity:1;border-radius:50%;border:2px solid #00a1d6}#bili-adjustment-info{display:inline-flex;align-items:center}#bili-adjustment-user-name{font-size:13px;font-weight:500}#bili-adjustment-user-name a{color:#00a1d6;text-decoration:none}#bili-adjustment-user-badge{background:#0491bf;border-radius:3px;color:#fff;padding:2px 3px;margin-left:5px;font-size:10px}#bili-adjustment-content{font-size:15px;line-height:24px}#bili-adjustment-contents{margin-block-start:0;margin-block-end:0;margin-inline-start:0;margin-inline-end:0;display:inline;white-space:pre-line;word-break:break-word;-webkit-font-smoothing:antialiased}#bili-adjustment-contents a{color:#00a1d6;text-decoration:none;background-color:transparent;cursor:pointer}#bili-adjustment-spread-line{padding-bottom:14px;margin-left:80px;border-bottom:1px solid var(--graph_bg_thick)}</style>
              <bili-adjustment-comment-renderer id="comment">
                  <div id="bili-adjustment-body" class="light">
                      <a id="bili-adjustment-user-avatar">
                          <bili-adjustment-avatar>
                              <img id="bili-adjustment-avatar-picture" src="${upAvatarFaceLink}" alt="${upAvatarFaceLink}">
                          </bili-adjustment-avatar>
                      </a>
                      <div id="bili-adjustment-main" style="width:100%">
                          <div id="bili-adjustment-header">
                              <bili-adjustment-comment-user-info>
                                  <div id="bili-adjustment-info">
                                      <div id="bili-adjustment-user-name">
                                          <a href="#" onclick="event.preventDefault()">视频简介君 (ﾉ≧∀≦)ﾉ</a>
                                      </div>
                                      <div id="bili-adjustment-user-badge">Bilibili调整</div>
                                  </div>
                              </bili-adjustment-comment-user-info>
                          </div>
                          <div id="bili-adjustment-content">
                              <bili-adjustment-rich-text>
                                  <p id="bili-adjustment-contents">${decodeURIComponent(videoDescriptionInfoHtml)}</p>
                              </bili-adjustment-rich-text>
                          </div>
                      </div>
                  </div>
              </bili-adjustment-comment-renderer>
              <div id="bili-adjustment-spread-line"></div>
          </bili-adjustment-comment-thread-renderer>
          `
        if ($videoCommentReplyListShadowRoot) utils.createElementAndInsert(shadowRootVideoDescriptionReplyTemplate, $videoCommentReplyListShadowRoot, 'prepend')
        document.querySelector('#comment-description:not(:first-child)')?.remove()
      } else {
        $videoDescriptionInfo.innerHTML = $videoDescriptionInfo.innerHTML.replace(nbspToBlankRegexp, ' ').replace(timeStringRegexp, (match) => {
          return `<a data-type="seek" data-video-part="-1" data-video-time="${getTotalSecondsFromTimeString(match)}">${match}</a>`
        }).replace(urlRegexp, (match) => {
          return `<a href="${match}" target="_blank">${match}</a>`
        }).replace(plaintVideoIdRegexp, (match) => {
          return `<a href="https://www.bilibili.com/video/${match}" target="_blank">${match}</a>`
        }).replace(plaintReadIdRegexp, (match) => {
          return `<a href="https://www.bilibili.com/read/${match}" target="_blank">${match}</a>`
        }).replace(blankRegexp, '')
      }
    },
    // #endregion 视频简介优化
    // #region 自动跳过时间节点
    /**
     * 设置当前视频自动跳过信息
     * - #region 设置当前视频自动跳过信息（本地）
     * - indexedDB
     * - 数据存在浏览器本地
     */
    async setVideoSkipTimeNodesByIndexedDB(videoSkipTimeNodesArray, videoID = modules.getCurrentVideoID()) {
      if (videoID !== 'error') {
        const videoSkipTimeNodesList = localforage.createInstance({
          name: 'videoSkipTimeNodesList',
        })
        const result = videoSkipTimeNodesList.setItem(videoID, videoSkipTimeNodesArray).then(() => {
          // logger.info(`自动跳过丨节点储存丨${value}丨成功丨本地`)
          return {
            code: 200,
            message: `节点上传丨本地：成功`
          }
        }).catch(error => {
          // logger.error(error)
          return {
            code: 0,
            message: error
          }
        })
        return result
      } else {
        utils.logger.error('videoID丨获取失败')
      }
    },
    // #endregion 设置当前视频自动跳过信息（本地）
    /**
     * 获取当前视频自动跳过信息
     * - #region 获取当前视频自动跳过信息（本地）
     * - indexedDB
     * - 数据存在浏览器本地
     */
    async getVideoSkipTimeNodesByIndexedDB(videoID = modules.getCurrentVideoID()) {
      const videoSkipTimeNodesList = localforage.createInstance({
        name: 'videoSkipTimeNodesList',
      })
      if (videoID !== 'error') {
        try {
          const value = await videoSkipTimeNodesList.getItem(videoID)
          return value
        } catch (error) {
          utils.logger.error(error)
        }
      } else {
        utils.logger.error('videoID丨获取失败')
      }
    },
    // #endregion 获取当前视频自动跳过信息（本地）
    /**
     * 设置当前视频自动跳过信息
     * - #region 设置当前视频自动跳过信息（云端）
     * - Axios
     * - 数据存在云数据库
     */
    async setVideoSkipTimeNodesByAxios(timeNodesArray, videoID = modules.getCurrentVideoID()) {
      const videoAuthor = decodeURIComponent(await utils.getMetaContent('name="author"'))
      let videoTitle, videoUrl
      if (vals.player_type() === 'video') {
        videoTitle = decodeURIComponent(document.title.replace('_哔哩哔哩_bilibili', ''))
        videoUrl = decodeURIComponent(await utils.getMetaContent('itemprop="url"'))
      }
      if (vals.player_type() === 'bangumi') {
        videoTitle = document.title.replace(/-*高清.*哩/gi, '')
        videoUrl = decodeURIComponent(await utils.getMetaContent('property="og:url"'))
      }
      if (videoID !== 'error') {
        const timeNodesArraySafe = decodeURIComponent(timeNodesArray)
        const url = `https://hn216.api.yesapi.cn/?s=SVIP.Swxqian_MyApi.AUpdateSkipTimeNodes&return_data=0&videoID=${videoID}&timeNodesArray=${timeNodesArraySafe}&videoTitle=${videoTitle}&videoAuthor=${videoAuthor}&videoUrl=${videoUrl}&app_key=A11B09901609FA722CFDFEB981EC31DB&sign=6BAEA5FDE94074B8C3ADF35789AE8B18&yesapi_allow_origin=1`
        const result = axios.post(url).then(response => {
          // utils.logger.debug(response)
          const responseData = response.data
          const { msg, ret, data } = responseData
          const { err_msg } = data
          if (Object.keys(data).length === 0) {
            return {
              code: ret,
              message: `云端：失败：${msg}`
            }
          } else {
            return {
              code: ret,
              message: err_msg
            }
          }
        }).catch(error => {
          return {
            message: error
          }
        })
        return result
      } else {
        utils.logger.error('videoID丨获取失败')
      }
    },
    // #endregion 设置当前视频自动跳过信息（云端）
    /**
     * 获取当前视频自动跳过信息
     * - #region 获取当前视频自动跳过信息（云端）
     * - Axios
     * - 数据存在云数据库
     */
    async getVideoSkipTimeNodesByAxios(videoID = modules.getCurrentVideoID()) {
      if (videoID !== 'error') {
        const url = `https://hn216.api.yesapi.cn/?s=SVIP.Swxqian_MyApi.AGetSkipTimeNodes&return_data=0&videoID=${videoID}&app_key=A11B09901609FA722CFDFEB981EC31DB&sign=574181B06EBD07D9252199563CD7D9D3&yesapi_allow_origin=1`
        const result = axios.post(url).then(response => {
          const skipNodesInfo = response.data.data
          const success = skipNodesInfo.success
          const timeNodesArray = skipNodesInfo.info?.timeNodesArray
          if (success && timeNodesArray !== '') {
            // utils.logger.info(skipNodesInfo.info.timeNodesArray)
            return JSON.parse(timeNodesArray)
          } else {
            return false
          }
        }).catch(error => {
          utils.logger.error(error)
        })
        return result
      } else {
        utils.logger.error('videoID丨获取失败')
      }
    },
    // #endregion 获取当前视频自动跳过信息（云端）
    /**
     * 自动跳过视频已设置设置时间节点
     * - #region 自动跳过视频已设置设置时间节点
     */
    async autoSkipTimeNodes() {
      if (!vals.auto_skip()) return
      const videoID = modules.getCurrentVideoID()
      const [$video, $setSkipTimeNodesInput] = await utils.getElementAndCheckExistence([selectors.video, selectors.setSkipTimeNodesInput])
      const skipTo = (seconds) => {
        $video.currentTime = seconds
        if ($video.paused) {
          $video.play()
        }
      }
      const findTargetTimeNode = (num, arr) => {
        for (let i = 0; i < arr[0].length; i++) {
          if (arr[0][i] === num) {
            return arr[1][i];
          }
        }
        return null;
      }
      // [[10,30],[20,40]] → [[10,20],[30,40]]
      const convertArraySaveToReadable = (arr) => {
        if (typeof arr === 'string') arr = JSON.parse(arr)
        const readableArr = arr[0].map((col, i) => arr.map(row => row[i]))
        return JSON.stringify(readableArr).slice(1, -1)
      }
      if (videoID !== 'error') {
        let videoSkipTimeNodesArray
        const videoSkipTimeNodesArrayIndexedDB = await modules.getVideoSkipTimeNodesByIndexedDB(videoID)
        if (videoSkipTimeNodesArrayIndexedDB) {
          videoSkipTimeNodesArray = videoSkipTimeNodesArrayIndexedDB
        } else {
          const videoSkipTimeNodesArrayAxios = await modules.getVideoSkipTimeNodesByAxios(videoID)
          if (videoSkipTimeNodesArrayAxios) {
            videoSkipTimeNodesArray = videoSkipTimeNodesArrayAxios
            await modules.setVideoSkipTimeNodesByIndexedDB(videoSkipTimeNodesArray, videoID)
          } else {
            utils.logger.info('自动跳过丨节点信息不存在')
            return
          }
        }
        utils.logger.info(`自动跳过丨已获取节点信息丨${JSON.stringify(videoSkipTimeNodesArray)}`)
        $setSkipTimeNodesInput.value = convertArraySaveToReadable(videoSkipTimeNodesArray)
        $video.addEventListener('timeupdate', function () {
          const currentTime = Math.ceil($video.currentTime)
          const targetTimeNode = findTargetTimeNode(currentTime, videoSkipTimeNodesArray)
          if (vals.auto_skip() && targetTimeNode) skipTo(targetTimeNode)
        })
      }
    },
    // #endregion 自动跳过视频已设置设置时间节点
    /**
     * 插入设置跳过时间节点按钮
     * - #region 插入设置跳过时间节点按钮
     */
    async insertSetSkipTimeNodesButton() {
      const videoID = modules.getCurrentVideoID()
      if (++vars.insertSetSkipTimeNodesButtonCount !== 1 || !vals.auto_skip()) return
      const [$video, $playerContainer, $playerControllerBottomRight, $playerTooltipArea] = await utils.getElementAndCheckExistence([selectors.video, selectors.playerContainer, selectors.playerControllerBottomRight, selectors.playerTooltipArea])
      const validateInputValue = (inputValue) => {
        const regex = /^\[\d+,\d+\](,\[\d+,\d+\])*?$/g;
        const numbers = inputValue.match(/\[(\d+),(\d+)\]/g)?.flatMap(match => match.slice(1, -1).split(',')).map(Number) || [];
        const hasDuplicates = new Set(numbers).size !== numbers.length
        if (inputValue === '' || !regex.test(inputValue) || hasDuplicates) {
          return false
        }
        const isAscending = numbers.every((num, i) => i === 0 || num >= numbers[i - 1])
        return isAscending
      }
      // [[10,20],[30,40]] → [[10,30],[20,40]]
      const convertArrayReadableToSave = (arr) => {
        return arr[0].map((col, i) => arr.map(row => row[i]))
      }
      // [10,20,30,40] → [[10,30],[20,40]]
      // const convertArrayRecordToSave = (arr) => {
      //     return arr.reduce((acc, num, i) => {
      //         i % 2 === 0 ? acc[0].push(num) : acc[1].push(num);
      //         return acc;
      //     }, [[], []]);
      // }
      // [10,20,30,40] → [[10,20],[30,40]]
      const convertArrayRecordToReadable = (arr) => {
        return arr.reduce((acc, _, i) => {
          if (i % 2 === 0) {
            acc.push(arr.slice(i, i + 2));
          }
          return acc;
        }, []);
      }
      const setSkipTimeNodesPopoverToggleButtonHtml = `
          <button id="${selectors.setSkipTimeNodesPopoverToggleButton.slice(1)}" popovertarget="${selectors.setSkipTimeNodesPopover.slice(1)}" class="bpx-player-ctrl-btn bpx-player-ctrl-skip" role="button" aria-label="插入时间节点" tabindex="0">
              <div class="bpx-player-ctrl-btn-icon">
                  <span class="bpx-common-svg-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="88" height="88" class="icon" viewBox="0 0 1024 1024">
                          <path fill="#fff" d="M672 896a21.333 21.333 0 0 1 21.333 21.333v21.334A21.333 21.333 0 0 1 672 960H352a21.333 21.333 0 0 1-21.333-21.333v-21.334A21.333 21.333 0 0 1 352 896h320zM512 64a362.667 362.667 0 0 1 181.333 676.821v69.846A21.333 21.333 0 0 1 672 832H352a21.333 21.333 0 0 1-21.333-21.333V740.82A362.667 362.667 0 0 1 512 64zm24.107 259.243a21.333 21.333 0 0 0-29.398 6.826l-1.792 3.499a21.333 21.333 0 0 0-1.45 7.765l-.043 62.806-129.45-80.896a21.333 21.333 0 0 0-32.64 18.09v179.03a21.333 21.333 0 0 0 21.333 21.333l3.968-.384a21.333 21.333 0 0 0 7.338-2.859l129.451-80.981.043 62.89a21.333 21.333 0 0 0 32.64 18.091l143.232-89.514a21.333 21.333 0 0 0 0-36.182z" />
                      </svg>
                  </span>
              </div>
          </button>`
      const setSkipTimeNodesPopoverHtml = `
          <div id="${selectors.setSkipTimeNodesPopover.slice(1)}" popover>
              <div class="setSkipTimeNodesWrapper">
                  <div class="header">
                      <span class="title">上传时间节点(${videoID})</span>
                      <span class="extra"></span>
                  </div>
                  <div class="tips close">
                      <span class="detail open">
                          <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                              <path d="M512 926.476C283.087 926.476 97.524 740.913 97.524 512S283.087 97.524 512 97.524 926.476 283.087 926.476 512 740.913 926.476 512 926.476zm0-73.143c188.514 0 341.333-152.82 341.333-341.333S700.513 170.667 512 170.667 170.667 323.487 170.667 512 323.487 853.333 512 853.333zm-6.095-192.097L283.526 438.857l51.712-51.712 170.667 170.667L676.57 387.145l51.712 51.712-222.378 222.379z" fill="#909399"></path>
                          </svg>
                      </span>
                      <div class="contents">
                          视频播放到相应时间点时将触发跳转至设定时间点
                          <br>
                          格式：[触发时间点,目标时间点]
                          <br>
                          条件：触发时间点始终小于目标时间点且任意两数不相等
                          <br>
                          例：[10,20] 表示视频播放至第 10 秒时跳转至第 20 秒
                          <br>
                          若有多组节点请使用英文逗号 ',' 隔开
                          <br>
                          例：[10,20],[30,40],[50,60]
                      </div>
                  </div>
                  <span style="display:flex;color:#f56c6c">🈲请勿随意上传无意义时间点，否则将严重影响其他用户观看体验！</span>
                  <div class="records">
                      <span id="${selectors.skipTimeNodesRecordsArray.slice(1)}"></span>
                      <div class="recordsButtonsGroup">
                          <button id="${selectors.clearRecordsButton.slice(1)}">清除数据</button>
                          <button id="${selectors.saveRecordsButton.slice(1)}">保存数据</button>
                      </div>
                  </div>
                  <div class="adjustment_tips clouds">
                    <div>已有记录：<span id="${selectors.skipTimeNodesCloudsArray.slice(1)}"></span></div>
                  </div>
                  <div class="handles">
                      <input id="${selectors.setSkipTimeNodesInput.slice(1)}" class="adjustment_input" value="">
                      <button id="${selectors.uploadSkipTimeNodesButton.slice(1)}">上传</button>
                      <button id="${selectors.syncSkipTimeNodesButton.slice(1)}">同步</button>
                  </div>
                  <div class="result" style="display:none"></div>
              </div>
          </div>`
      const setSkipTimeNodesButtonTipHtml = `
          <div id="setSkipTimeNodesButtonTip" class="bpx-player-tooltip-item" style="visibility: hidden; opacity: 0; transform: translate(0px, 0px);">
              <div class="bpx-player-tooltip-title">上传节点</div>
          </div>`
      const $setSkipTimeNodesPopoverToggleButton = utils.createElementAndInsert(setSkipTimeNodesPopoverToggleButtonHtml, $playerControllerBottomRight, 'append')
      const $setSkipTimeNodesPopover = utils.createElementAndInsert(setSkipTimeNodesPopoverHtml, $playerContainer, 'append')
      const $setSkipTimeNodesButtonTip = utils.createElementAndInsert(setSkipTimeNodesButtonTipHtml, $playerTooltipArea, 'append')
      $setSkipTimeNodesPopoverToggleButton.addEventListener('mouseover', function () {
        const { top, left } = utils.getElementOffsetToDocument(this)
        // utils.logger.debug(`${top} ${left} ${window.scrollY} ${top - window.scrollY}`)
        $setSkipTimeNodesButtonTip.style.top = `${top - window.scrollY - (this.clientHeight * 2) - 5}px`
        $setSkipTimeNodesButtonTip.style.left = `${left - ($setSkipTimeNodesButtonTip.clientWidth / 2) + (this.clientWidth / 2)}px`
        $setSkipTimeNodesButtonTip.style.opacity = 1
        $setSkipTimeNodesButtonTip.style.visibility = 'visible'
        $setSkipTimeNodesButtonTip.style.transition = 'opacity .3s'
      })
      $setSkipTimeNodesPopoverToggleButton.addEventListener('mouseout', () => {
        $setSkipTimeNodesButtonTip.style.opacity = 0
        $setSkipTimeNodesButtonTip.style.visibility = 'hidden'
      })
      const [$setSkipTimeNodesPopoverHeaderExtra, $setSkipTimeNodesPopoverTips, $setSkipTimeNodesPopoverTipsDetail, $setSkipTimeNodesPopoverRecords, $setSkipTimeNodesInput, $skipTimeNodesRecordsArray, $setSkipTimeNodesPopoverResult, $clearRecordsButton, $saveRecordsButton, $uploadSkipTimeNodesButton, $syncSkipTimeNodesButton, $setSkipTimeNodesPopoverClouds, $skipTimeNodesCloudsArray] = await utils.getElementAndCheckExistence([selectors.setSkipTimeNodesPopoverHeaderExtra, selectors.setSkipTimeNodesPopoverTips, selectors.setSkipTimeNodesPopoverTipsDetail, selectors.setSkipTimeNodesPopoverRecords, selectors.setSkipTimeNodesInput, selectors.skipTimeNodesRecordsArray, selectors.setSkipTimeNodesPopoverResult, selectors.clearRecordsButton, selectors.saveRecordsButton, selectors.uploadSkipTimeNodesButton, selectors.syncSkipTimeNodesButton, selectors.setSkipTimeNodesPopoverClouds, selectors.skipTimeNodesCloudsArray])
      const cloudsArray = await modules.getVideoSkipTimeNodesByAxios(videoID)
      if (cloudsArray) {
        if (typeof cloudsArray === 'string') cloudsArray = JSON.parse(cloudsArray)
        $setSkipTimeNodesPopoverClouds.style.display = 'block'
        $skipTimeNodesCloudsArray.innerText = JSON.stringify(convertArrayReadableToSave(cloudsArray)).slice(1, -1)
      } else {
        $setSkipTimeNodesPopoverClouds.style.display = 'none'
      }
      $setSkipTimeNodesPopoverTipsDetail.addEventListener('click', function (event) {
        event.stopPropagation()
        const detailClassList = [...this.classList]
        if (detailClassList.includes('open')) {
          this.classList.replace('open', 'close')
          $setSkipTimeNodesPopoverTips.classList.replace('close', 'open')
        }
        if (detailClassList.includes('close')) {
          this.classList.replace('close', 'open')
          $setSkipTimeNodesPopoverTips.classList.replace('open', 'close')
        }
      })
      $setSkipTimeNodesPopoverToggleButton.addEventListener('click', () => {
        const currentTime = Math.ceil($video.currentTime)
        $setSkipTimeNodesPopoverHeaderExtra.innerText = `${currentTime} / ${$video.duration}`
      })
      $setSkipTimeNodesPopover.addEventListener('toggle', (event) => {
        if (event.newState === 'open') {
          $video.pause()
        }
        if (event.newState === 'closed') {
          $video.play()
        }
      })
      $clearRecordsButton.addEventListener('click', () => {
        arrays.skipNodesRecords = []
        $skipTimeNodesRecordsArray.className = ''
        $skipTimeNodesRecordsArray.innerText = ''
        $setSkipTimeNodesPopoverRecords.style.display = 'none'
        $setSkipTimeNodesInput.value = ''
      })
      $saveRecordsButton.addEventListener('click', () => {
        $setSkipTimeNodesInput.value = JSON.stringify(convertArrayRecordToReadable(JSON.parse($skipTimeNodesRecordsArray.innerText.replace('打点数据：', '')))).slice(1, -1)
      })
      const resetResultContent = (delay = 3000) => {
        const resetResultContentTimeout = setTimeout(() => {
          $setSkipTimeNodesPopoverResult.innerText = ''
          $setSkipTimeNodesPopoverResult.className = 'result'
          clearTimeout(resetResultContentTimeout)
        }, delay)
        arrays.intervalIds.push(resetResultContentTimeout)
      }
      $uploadSkipTimeNodesButton.addEventListener('click', async () => {
        const inputValue = $setSkipTimeNodesInput.value
        if (!validateInputValue(inputValue)) {
          $setSkipTimeNodesPopoverResult.classList.remove('success')
          $setSkipTimeNodesPopoverResult.classList.add('danger')
          $setSkipTimeNodesPopoverResult.innerText = '请按格式条件输入正确内容！'
          resetResultContent()
        } else {
          const timeNodesArray = convertArrayReadableToSave(JSON.parse(`[${inputValue}]`))
          const result_indexedDB = await modules.setVideoSkipTimeNodesByIndexedDB(timeNodesArray, videoID)
          const result_axios = await modules.setVideoSkipTimeNodesByAxios(JSON.stringify(timeNodesArray), videoID)
          // logger.debug(`${JSON.stringify(result_indexedDB)}丨${JSON.stringify(result_axios)}`)
          if ((result_indexedDB.code && result_axios.code) === 200) {
            $setSkipTimeNodesInput.value = ''
            $setSkipTimeNodesPopoverResult.classList.remove('danger')
            $setSkipTimeNodesPopoverResult.classList.add('success')
            $setSkipTimeNodesPopoverResult.innerText = `${result_indexedDB.message}丨${result_axios.message}`
          } else {
            $setSkipTimeNodesPopoverResult.classList.remove('success')
            $setSkipTimeNodesPopoverResult.classList.add('danger')
            $setSkipTimeNodesPopoverResult.innerText = `${result_indexedDB.message}丨${result_axios.message}`
          }
          resetResultContent()
        }
      })
      $syncSkipTimeNodesButton.addEventListener('click', async () => {
        const cloudsArray = await modules.getVideoSkipTimeNodesByAxios(videoID)
        if (cloudsArray) {
          if (typeof cloudsArray === 'string') cloudsArray = JSON.parse(cloudsArray)
          modules.setVideoSkipTimeNodesByIndexedDB(cloudsArray, videoID)
          const readableArr = JSON.stringify(convertArrayReadableToSave(cloudsArray)).slice(1, -1)
          $skipTimeNodesCloudsArray.innerText = readableArr
          $setSkipTimeNodesInput.value = readableArr
        }
      })

    },
    // #endregion 插入设置跳过时间节点按钮
    /**
     * 插入跳过时间节点功能开关
     * - #region 插入跳过时间节点功能开关
     */
    async insertSkipTimeNodesSwitchButton() {
      if (++vars.insertSetSkipTimeNodesSwitchButtonCount !== 1) return
      const skipTimeNodesSwitchButtonHtml = `
          <div id="autoSkipSwitchButton" class="bpx-player-dm-switch bui bui-danmaku-switch" aria-label="跳过开启关闭">
            <div class="bui-area">
                <input id="${selectors.AutoSkipSwitchInput.slice(1)}" class="bui-danmaku-switch-input" type="checkbox" ${vals.auto_skip() ? 'checked' : ''}>
                <label class="bui-danmaku-switch-label">
                <span class="bui-danmaku-switch-on">
                    <svg xmlns="http://www.w3.org/2000/svg" data-pointer="none" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M12 4.83h-1.53L8.76 2.27a1 1 0 1 0-1.67 1.12l1 1.5L5.92 5a4 4 0 0 0-3.83 3.4 30.92 30.92 0 0 0-.24 4.18 31.81 31.81 0 0 0 .35 5.12A4 4 0 0 0 6 21.06l.91.05c1.2.06 1.8.09 3.6.09a1 1 0 0 0 1-1 1 1 0 0 0-1-1c-1.76 0-2.34 0-3.5-.09l-.91-.05a2 2 0 0 1-1.91-1.71 29.75 29.75 0 0 1-.33-4.8 28 28 0 0 1 .23-3.9A2 2 0 0 1 6 6.93c2.45-.08 4.47-.13 6.06-.13s3.62 0 6.07.13A2 2 0 0 1 20 8.75c.08.52.12 2 .14 3.06v.88a1 1 0 1 0 2-.06v-.86c0-1.12-.08-2.66-.16-3.27A4 4 0 0 0 18.19 5l-2.53-.08 1.05-1.46a1 1 0 0 0-1.64-1.18l-1.86 2.55H12z" />
                    <path fill="#00aeec" fill-rule="evenodd" d="M22.85 14.63a1 1 0 0 0-1.42.07l-5.09 5.7-2.21-2.27L14 18a1 1 0 0 0-1.32 1.49l3 3 .1.09a1 1 0 0 0 1.36-.12L22.93 16l.08-.1a1 1 0 0 0-.16-1.27z" />
                    <path d="M7.58 8.23h3.12v3.54h-.9v1.62h1v.67a7.14 7.14 0 0 0 1.84-1.41v-1l-.72.36a17 17 0 0 0-1-2.17l.83-.41a18.26 18.26 0 0 1 .9 2.12V7.82h1v5a9 9 0 0 1-.47 3.05 5.26 5.26 0 0 1-1.4 2.13l-.78-.7a5 5 0 0 0 1.56-3.4 7.46 7.46 0 0 1-1.29 1.1l-.5-.83v.09h-1V16c.37-.13.7-.25 1-.37v.94a29.54 29.54 0 0 1-3.39 1.19l-.29-.93.42-.11v-3.9h.84v3.64l.55-.18v-4.51H7.58zm2.22 2.68V9.09H8.48v1.82zm6.53-1.81l.86.42a10 10 0 0 1-1.25 2.32l-.71-.5v.92a11.11 11.11 0 0 1 2 1.62l-.59.9a11.39 11.39 0 0 0-1.39-1.44v3.17c0 .21.1.32.29.32h.35a.36.36 0 0 0 .35-.22 4.31 4.31 0 0 0 .18-1.47l.9.28a4.27 4.27 0 0 1-.4 2 1.1 1.1 0 0 1-.83.3h-.84c-.66 0-1-.34-1-1v-8.9h1v3.33a9.28 9.28 0 0 0 1.08-2.05z" />
                    </svg>
                </span>
                <span class="bui-danmaku-switch-off">
                    <svg xmlns="http://www.w3.org/2000/svg" data-pointer="none" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M8.09 4.89l-1-1.5a1 1 0 1 1 1.68-1.12l1.7 2.57h2.74l1.86-2.59a1 1 0 0 1 1.64 1.18l-1.05 1.45 2.53.12a4 4 0 0 1 3.74 3.51c.08.61.13 2.15.16 3.27v.86a1 1 0 0 1-2 .07v-.89c0-1.1-.06-2.54-.14-3.06a2 2 0 0 0-1.85-1.82c-2-.07-4-.12-6.07-.13-1.59 0-3.62 0-6.06.13a2 2 0 0 0-1.92 1.74 28 28 0 0 0-.23 3.91 29.71 29.71 0 0 0 .33 4.79 2 2 0 0 0 1.91 1.71c1.8.1 3.61.14 5.41.14a1 1 0 0 1 1 1 1 1 0 0 1-1 1c-1.84 0-3.67-.05-5.51-.15A4 4 0 0 1 2.2 17.7a31.81 31.81 0 0 1-.35-5.12 30.92 30.92 0 0 1 .24-4.18A4 4 0 0 1 5.92 5l2.16-.07zm10 17.17a4 4 0 1 0-4-4 4 4 0 0 0 3.97 4zm0-1.5a2.5 2.5 0 0 1-2.5-2.5 2.61 2.61 0 0 1 .28-1.16l3.33 3.4a2.55 2.55 0 0 1-1.14.26zm2.5-2.5a2.38 2.38 0 0 1-.29 1.16l-3.3-3.4a2.5 2.5 0 0 1 3.61 2.24z" />
                    <path fill="none" d="M8.28 9.08H9.6v1.83H8.28zM13.42 15.08v-.85h-.11c0 .29-.09.58-.15.85z" />
                    <path d="M13.31 14.23h-1a7.52 7.52 0 0 1-.18.85h1.05c.04-.27.09-.56.13-.85zM13.4 9.6v-.24l-.54.24h.54zM13.4 9V7.82h-1V8l.33-.11A8.32 8.32 0 0 1 13.4 9zM12.41 9.4v.2h.11a2 2 0 0 0-.11-.2zM11.59 9.6l-.08-.18-.84.41c.18.32.36.67.53 1V9.6z" />
                    <path d="M11.2 13.64a7 7 0 0 1-.64.41v-.67h-1v-1.61h.9V8.22H7.37v3.55h1.32v4.5l-.55.18v-3.64h-.83v3.87l-.42.11.29.94a32.83 32.83 0 0 0 3.38-1.19v-.95c-.27.12-.59.24-1 .38v-1.69h1v-.08l.51.82a6.91 6.91 0 0 0 .94-.79h-.81zm-2.92-2.73V9.08H9.6v1.83zM15 8.2v-.38h-1V9.6h.34c.28-.46.5-.93.66-1.4zM10.78 17.3l.8.69a5.19 5.19 0 0 0 1.24-1.84h-1.15a4.22 4.22 0 0 1-.89 1.15zM16.81 9.89c.06-.13.12-.24.18-.38l-.86-.42c-.07.18-.16.34-.24.51h.92z" />
                    <path d="M15 13.84v-.5c.1.08.21.2.32.3a4.33 4.33 0 0 1 .92-.44 11.62 11.62 0 0 0-1.24-.95v-.91l.7.49a9.47 9.47 0 0 0 1.08-1.94V9.6h-.92a8.86 8.86 0 0 1-.86 1.55v-3c-.19.47-.41.94-.65 1.4H14v5.17a5.13 5.13 0 0 1 1-.88zM13.4 12.83V9.6h-.54l.54-.24V9a8.32 8.32 0 0 0-.66-1.11l-.33.11v1.4a2 2 0 0 1 .11.2h-.11v2a18.76 18.76 0 0 0-.82-2h-.39v1.27a12.22 12.22 0 0 1 .48 1.13l.73-.37v1a7.31 7.31 0 0 1-1.21 1v.59h.8c.11-.11.23-.21.34-.33 0 .12 0 .22-.06.33h1a12.21 12.21 0 0 0 .12-1.39zM13.16 15.08h-1.05a4.9 4.9 0 0 1-.44 1.07h1.15c0-.09.07-.17.11-.27.07-.25.16-.52.23-.8z" />
                    </svg>
                </span>
                </label>
            </div>
          </div>`
      const skipTimeNodesSwitchButtonTipHtml = `
          <div id="autoSkipTips" class="bpx-player-tooltip-item" style="visibility: hidden; opacity: 0; transform: translate(0px, 0px);">
              <div class="bpx-player-tooltip-title">关闭自动跳过(j)</div>
          </div>`
      const [playerDanmuSetting, playerTooltipArea] = await utils.getElementAndCheckExistence([selectors.playerDanmuSetting, selectors.playerTooltipArea])
      const $skipTimeNodesSwitchButton = utils.createElementAndInsert(skipTimeNodesSwitchButtonHtml, playerDanmuSetting, 'after')
      const $autoSkipTips = utils.createElementAndInsert(skipTimeNodesSwitchButtonTipHtml, playerTooltipArea, 'append')
      const $AutoSkipSwitchInput = await utils.getElementAndCheckExistence(selectors.AutoSkipSwitchInput)
      $AutoSkipSwitchInput.addEventListener('change', async event => {
        const $AutoSkipInput = await utils.getElementAndCheckExistence(selectors.AutoSkip)
        utils.setValue('auto_skip', event.target.checked)
        $AutoSkipInput.checked = event.target.checked
        $autoSkipTips.querySelector(selectors.playerTooltipTitle).innerText = event.target.checked ? '关闭自动跳过(j)' : '开启自动跳过(j)'
      })
      $skipTimeNodesSwitchButton.addEventListener('mouseover', async function () {
        const { top, left } = utils.getElementOffsetToDocument(this)
        $autoSkipTips.style.top = `${top - window.scrollY - (this.clientHeight) - 12}px`
        $autoSkipTips.style.left = `${left - ($autoSkipTips.clientWidth / 2) + (this.clientWidth / 2)}px`
        $autoSkipTips.style.opacity = 1
        $autoSkipTips.style.visibility = 'visible'
        $autoSkipTips.style.transition = 'opacity .3s'
      })
      $skipTimeNodesSwitchButton.addEventListener('mouseout', function () {
        $autoSkipTips.style.opacity = 0
        $autoSkipTips.style.visibility = 'hidden'
      })
    },
    // #endregion 插入跳过时间节点功能开关
    // #endregion 自动跳过时间节点
    /**
     * 自动返回播放器并更新评论区简介
     * - #region 自动返回播放器并更新评论区简介
     */
    async functionsNeedToExecuteWhenUrlHasChanged() {
      await utils.sleep(500)
      modules.locationToPlayer()
      await utils.sleep(1500)
      modules.autoEnableSubtitle()
      modules.insertVideoDescriptionToComment()
    },
    // #endregion 自动返回播放器并更新评论区简介
    /**
     * 点击相关视频自动返回播放器并更新评论区简介
     * - #region 点击相关视频自动返回播放器并更新评论区简介
     * - 合集中的其他视频
     * - 推荐列表中的视频
     */
    async clickRelatedVideoAutoLocation() {
      if (vals.player_type() === 'video') {
        // 视频合集
        await elmGetter.each(selectors.videoSectionsEpisodeLink, (link) => {
          link.addEventListener('click', () => {
            modules.functionsNeedToExecuteWhenUrlHasChanged()
          })
        })
        // 视频选集
        await elmGetter.each(selectors.videoMultiPageLink, (link) => {
          link.addEventListener('click', () => {
            modules.functionsNeedToExecuteWhenUrlHasChanged()
          })
        })
        // 接下来播放及推荐视频
        await elmGetter.each(selectors.videoNextPlayAndRecommendLink, (link) => {
          link.addEventListener('click', () => {
            modules.functionsNeedToExecuteWhenUrlHasChanged()
          })
        })
        // 视频结尾推荐视频
        await elmGetter.each(selectors.playerEndingRelateVideo, (link) => {
          link.addEventListener('click', () => {
            modules.functionsNeedToExecuteWhenUrlHasChanged()
          })
        })
        // 上一个视频
        await elmGetter.each(selectors.videoPreviousButton, (button) => {
          button.addEventListener('click', () => {
            modules.functionsNeedToExecuteWhenUrlHasChanged()
          })
        })
        // 下一个视频
        await elmGetter.each(selectors.videoNextButton, (button) => {
          button.addEventListener('click', () => {
            modules.functionsNeedToExecuteWhenUrlHasChanged()
          })
        })
      }
      if (vals.player_type() === 'bangumi') {
        // 番剧剧集
        await elmGetter.each(selectors.bangumiSectionsEpisodeLink, (link) => {
          link.addEventListener('click', async () => {
            modules.locationToPlayer()
          })
        })
      }
    },
    // #endregion 点击相关视频自动返回播放器并更新评论区简介
    /**
    * 解锁合集/选集视频集数选择按钮
    * - #region 解锁合集/选集视频集数选择按钮
    */
    async unlockEpisodeSelector() {
      const videoInfo = await biliApis.getVideoInformation(modules.getCurrentVideoID(window.location.href))
      const { pages = false, ugc_season = false } = videoInfo.data
      if (ugc_season || pages.length > 1) {
        if (!document.getElementById('UnlockEpisodeSelectorStyle')) {
          utils.insertStyleToDocument('UnlockEpisodeSelectorStyle', styles.UnlockEpisodeSelector)
          await elmGetter.each(selectors.videoEpisodeListMultiMenuItem, (link) => {
            link.addEventListener('click', async () => {
              modules.locationToPlayer()
            })
          })
        }
      } else if (document.getElementById('UnlockEpisodeSelectorStyle')) document.getElementById('UnlockEpisodeSelectorStyle').remove()
    },
    // #endregion 解锁合集/选集视频集数选择按钮
    /**
    * 离开当前页面暂停视频
    * - #region 离开当前页面暂停视频
    */
    async pauseVideoWhenLeavingCurrentPage() {
      const $video = await utils.getElementAndCheckExistence(selectors.video)
      let playFlag = false
      const timer = setInterval(async () => {
        const documentHidden = utils.checkDocumentIsHidden()
        if (documentHidden) {
          $video.pause()
          playFlag = true
        }
        else if (vals.continue_play() && playFlag) {
          $video.play()
          playFlag = false
        }
      }, 100)
      arrays.intervalIds.push(timer)
    },
    // #endregion 离开当前页面暂停视频
    // #endregion 视频播放页相关功能
    //** ----------------------- 动态页相关功能 ----------------------- **//
    // #region 动态页相关功能
    /**
     * 默认显示投稿视频
     * - #region 默认显示投稿视频
     */
    changeCurrentUrlToVideoSubmissions() {
      const web_video_link = vals.web_video_link()
      const url = window.location.href
      const indexLink = 'https://t.bilibili.com/pages/nav/index'
      const newIndexLinkRegexp = /(https:\/\/t.bilibili.com\/pages\/nav\/index_new).*/i
      const indexVoteLinkRegexp = /https:\/\/t.bilibili.com\/vote\/h5\/index\/#\/result\?vote_id=.*/i
      const webVoteLinkRegexp = /t.bilibili.com\/h5\/dynamic\/vote#\/result\?vote_id=.*/i
      const indexLotteryLinkRegexp = /https:\/\/t.bilibili.com\/lottery\/h5\/index\/.*/i
      const webLotteryLinkRegexp = /https:\/\/t.bilibili.com\/lottery\/.*/i
      const moreDynamicLinkRegexp = /https:\/\/t.bilibili.com\/[0-9]+\?tab=[0-9]+/i
      const dynamicDetailLinkRegexp = /https:\/\/t.bilibili.com\/[0-9]+/i
      const dynamicTopicDetailLinkRegexp = /https:\/\/t.bilibili.com\/topic\/[0-9]+/i
      if (url == indexLink || newIndexLinkRegexp.test(url) || indexVoteLinkRegexp.test(url) || webVoteLinkRegexp.test(url) || indexLotteryLinkRegexp.test(url) || webLotteryLinkRegexp.test(url) || moreDynamicLinkRegexp.test(url) || dynamicDetailLinkRegexp.test(url) || dynamicTopicDetailLinkRegexp.test(url)) {
        //不影响BiliBili首页导航栏动态悬浮窗、动态页里投票及互动抽奖页等内容显示
        return false
      }
      if (url !== web_video_link) {
        window.location.href = web_video_link
      } else {
        return { message: '动态页｜已切换至投稿视频' }
      }
    },
    // #endregion 默认显示投稿视频
    // #endregion 动态页相关功能
    //** ----------------------- 首页相关功能 ----------------------- **//
    // #region 首页相关功能
    // #region 记录首页推荐视频历史
    /**
     * 将推荐视频写入本地
     * - #region 将推荐视频写入本地
     */
    async setIndexRecordRecommendVideoHistory() {
      if (++vars.setIndexRecordRecommendVideoHistoryArrayCount !== 1) return
      const indexRecommendVideoHistory = localforage.createInstance({
        name: 'indexRecommendVideoHistory',
      })
      await elmGetter.each(selectors.indexRecommendVideoSix, document.body, async video => {
        const url = video.querySelector('a').href
        const title = video.querySelector('h3').title
        if (window.location.host.includes('bilibili.com') && !url.includes('cm.bilibili.com')) {
          const { data: { tid, pic } } = await biliApis.getVideoInformation(modules.getCurrentVideoID(url))
          indexRecommendVideoHistory.setItem(title, [tid, url, pic])
        }
      })

    },
    // #endregion 将推荐视频写入本地
    /**
     * 将本地推荐数据转为数组
     * - #region 将本地推荐数据转为数组
     * @returns 推荐记录数组
     */
    async getIndexRecordRecommendVideoHistoryArray() {
      arrays.indexRecommendVideoHistory = []
      const indexRecommendVideoHistory = localforage.createInstance({
        name: 'indexRecommendVideoHistory',
      })
      await indexRecommendVideoHistory.iterate((value, key) => {
        arrays.indexRecommendVideoHistory.push({ key, value })
      })
      if (!arrays.indexRecommendVideoHistory.length || arrays.indexRecommendVideoHistory.length !== await indexRecommendVideoHistory.length()) {
        return await modules.getIndexRecordRecommendVideoHistoryArray()
      }
      else return arrays.indexRecommendVideoHistory
    },
    // #endregion 将本地推荐数据转为数组
    /**
     * 插入推荐历史记录按钮
     * - #region 插入推荐历史记录按钮
     */
    async insertIndexRecommendVideoHistoryOpenButton() {
      if (document.getElementById(selectors.indexRecommendVideoHistoryOpenButton)) document.getElementById(selectors.indexRecommendVideoHistoryOpenButton).remove()
      if (document.getElementById(selectors.indexRecommendVideoHistoryPopover)) document.getElementById(selectors.indexRecommendVideoHistoryPopover).remove()
      const $indexRecommendVideoRollButtonWrapper = await utils.getElementAndCheckExistence(selectors.indexRecommendVideoRollButtonWrapper)
      const indexRecommendVideoHistoryOpenButtonHtml = `
        <button id="${selectors.indexRecommendVideoHistoryOpenButton.slice(1)}" popovertarget="${selectors.indexRecommendVideoHistoryPopover.slice(1)}" class="primary-btn roll-btn">
            <span>历史记录</span>
        </button>`
      const indexRecommendVideoHistoryPopoverHtml = `
        <div id="${selectors.indexRecommendVideoHistoryPopover.slice(1)}"  class="adjustment_popover" popover>
            <div id="${selectors.indexRecommendVideoHistoryPopoverTitle.slice(1)}">
                <span>首页视频推荐历史记录</span>
                <div id="${selectors.clearRecommendVideoHistoryButton.slice(1)}">清空记录</div>
            </div>
            <ul id="${selectors.indexRecommendVideoHistoryCategory.slice(1)}">
              <li class='all adjustment_button primary plain'>全部</li>
            </ul>
            <ul id="${selectors.indexRecommendVideoHistoryList.slice(1)}"></ul>
        </ul>`
      utils.createElementAndInsert(indexRecommendVideoHistoryOpenButtonHtml, $indexRecommendVideoRollButtonWrapper, 'append')
      const $indexRecommendVideoHistoryPopover = utils.createElementAndInsert(indexRecommendVideoHistoryPopoverHtml, document.body, 'append')
      $indexRecommendVideoHistoryPopover.addEventListener('toggle', async (event) => {
        const [$indexApp, $indexRecommendVideoHistoryPopoverTitle] = await utils.getElementAndCheckExistence([selectors.indexApp, selectors.indexRecommendVideoHistoryPopoverTitle])
        if (event.newState === 'open') {
          $indexApp.style.pointerEvents = 'none'
          $indexRecommendVideoHistoryPopoverTitle.querySelector('span').append(`(${$indexRecommendVideoHistoryPopover.querySelector(selectors.indexRecommendVideoHistoryList).childElementCount})`)
        }
        if (event.newState === 'closed') {
          $indexApp.style.pointerEvents = 'auto'
          $indexRecommendVideoHistoryPopoverTitle.querySelector('span').innerText = '首页视频推荐历史记录'
        }
      })
    },
    // #endregion 插入推荐历史记录按钮
    /**
     * 获取推荐历史记录
     * - #region 获取推荐历史记录
     */
    async getIndexRecordRecommendVideoHistory() {
      const getIndexRecordRecommendVideoHistoryArray = await modules.getIndexRecordRecommendVideoHistoryArray()
      const $indexRecommendVideoHistoryPopover = await utils.getElementAndCheckExistence(selectors.indexRecommendVideoHistoryPopover)
      $indexRecommendVideoHistoryPopover.querySelector(selectors.indexRecommendVideoHistoryList).innerHTML = ''
      for (const record of getIndexRecordRecommendVideoHistoryArray) {
        utils.createElementAndInsert(`<li><span><img src="${record.value[2]}"></span><a href="${record.value[1]}" target="_blank">${record.key}</a></li>`, $indexRecommendVideoHistoryPopover.querySelector(selectors.indexRecommendVideoHistoryList), 'append')
      }
    },
    // #endregion 获取推荐历史记录
    /**
     * 生成推荐视频分区信息
     * - #region 生成推荐视频分区信息
     */
    async generatorVideoCategories() {
      const setCategoryButtonActiveClass = (element) => {
        element.parentElement.querySelectorAll(selectors.indexRecommendVideoHistoryCategoryButtons).forEach(element => { element.classList.remove(...arrays.videoCategoriesActiveClass) })
        element.classList.add(...arrays.videoCategoriesActiveClass)
      }
      const getIndexRecordRecommendVideoHistoryArray = await modules.getIndexRecordRecommendVideoHistoryArray()
      const $indexRecommendVideoHistoryPopover = await utils.getElementAndCheckExistence(selectors.indexRecommendVideoHistoryPopover)
      $indexRecommendVideoHistoryPopover.querySelector(selectors.indexRecommendVideoHistoryCategory).innerHTML = "<li class='all adjustment_button primary plain'>全部</li>"
      let categoryHasVideoSet = new Set()
      // arrays.videoCategories.filter(category => {
      //   getIndexRecordRecommendVideoHistoryArray.filter(record => {
      //     if (category.tids.includes(record.value[0])) {
      //       categoryHasVideoSet.add(category)
      //     }
      //   })
      // })
      for (const [key, value] of Object.entries(objects.videoCategories)) {
        getIndexRecordRecommendVideoHistoryArray.filter(record => {
          if (value.tids.includes(record.value[0])) {
            categoryHasVideoSet.add(objects.videoCategories[key])
          }
        })
      }
      for (const category of Array.from(categoryHasVideoSet)) {
        utils.createElementAndInsert(`<li data-tids="[${category.tids}]">${category.name}</li>`, $indexRecommendVideoHistoryPopover.querySelector(selectors.indexRecommendVideoHistoryCategory), 'append')
      }
      await elmGetter.each(selectors.indexRecommendVideoHistoryCategoryButtonsExceptAll, $indexRecommendVideoHistoryPopover, category => {
        category.addEventListener('click', async function () {
          setCategoryButtonActiveClass(this)
          $indexRecommendVideoHistoryPopover.querySelector(selectors.indexRecommendVideoHistoryList).innerHTML = ''
          const categoryIds = this.dataset.tids
          for (const record of getIndexRecordRecommendVideoHistoryArray) {
            if (categoryIds.includes(record.value[0])) {
              utils.createElementAndInsert(`<li><span><img src="${record.value[2]}"></span><a href="${record.value[1]}" target="_blank">${record.key}</a></li>`, $indexRecommendVideoHistoryPopover.querySelector(selectors.indexRecommendVideoHistoryList), 'append')
            }
          }
        })
      })
      $indexRecommendVideoHistoryPopover.querySelector(selectors.indexRecommendVideoHistoryCategoryButtonAll).addEventListener('click', async function () {
        setCategoryButtonActiveClass(this)
        $indexRecommendVideoHistoryPopover.querySelector(selectors.indexRecommendVideoHistoryList).innerHTML = ''
        for (const record of getIndexRecordRecommendVideoHistoryArray) {
          utils.createElementAndInsert(`<li><span><img src="${record.value[2]}"></span><a href="${record.value[1]}" target="_blank">${record.key}</a></li>`, $indexRecommendVideoHistoryPopover.querySelector(selectors.indexRecommendVideoHistoryList), 'append')
        }
      })
    },
    // #endregion 生成推荐视频分区信息
    /**
     * 清除推荐历史记录
     * - #region 清除推荐历史记录
     */
    async clearRecommendVideoHistory() {
      const indexRecommendVideoHistory = localforage.createInstance({
        name: 'indexRecommendVideoHistory',
      })
      indexRecommendVideoHistory.clear()
      arrays.indexRecommendVideoHistory = []
      const $indexRecommendVideoHistoryPopover = await utils.getElementAndCheckExistence(selectors.indexRecommendVideoHistoryPopover)
      $indexRecommendVideoHistoryPopover.querySelector(selectors.indexRecommendVideoHistoryList).innerHTML = ''
      $indexRecommendVideoHistoryPopover.querySelector(selectors.indexRecommendVideoHistoryCategory).innerHTML = "<li class='all adjustment_button primary plain'>全部</li>"
      $indexRecommendVideoHistoryPopover.hidePopover()
    },
    // #endregion 清除推荐历史记录
    // #endregion 记录首页推荐视频历史
    // #endregion 首页相关功能
    //** ----------------------- 脚本最终执行函数 ----------------------- **//
    // #region 脚本最终执行函数
    /**
     *
     * 注册脚本设置选项
     * - #region 注册脚本设置选项
     */
    async registerMenuCommand() {
      if (regexps.dynamic.test(window.location.href)) {
        const dynamicSettingPopoverHtml = `
          <div id="${selectors.dynamicSettingPopover.slice(1)}" class="adjustment_popover" popover>
              <div class="adjustment_popoverTitle">哔哩哔哩动态页设置
                <div class="subTitle">（以下设置内容更改即生效，直接关闭本弹窗即可）</div>
              </div>
              <div class="recommend">推荐使用样式表：<a href="https://userstyles.world/style/241/nightmode-for-bilibili-com" target="_blank">「夜间哔哩 NightMode For Bilibili」</a></div>
              <label class="bilibili-adjustment-setting-label" style="padding-top:0!important;display: grid;grid-gap: 10px">
                  「投稿视频」链接：
                  <input id="${selectors.WebVideoLinkInput.slice(1)}" class="adjustment_input" value="${utils.getValue('web_video_link')}">
              </label>
              <div id="${selectors.dynamicSettingPopoverTips.slice(1)}" class="adjustment_tips info">点击「投稿视频」选项后，填入当前浏览器地址栏链接，即可自动跳转至该链接</div>
              <div class="adjustment_buttonGroup">
                <button id="${selectors.dynamicSettingSaveButton.slice(1)}" class="adjustment_button primary">保存</button>
              </div>
          </div>`
        if (document.getElementById(selectors.dynamicSettingPopover)) document.getElementById(selectors.dynamicSettingPopover).remove()
        const $dynamicSettingPopover = utils.createElementAndInsert(dynamicSettingPopoverHtml, document.body, 'append')
        GM_registerMenuCommand('设置', () => {
          $dynamicSettingPopover.showPopover()
        })
        const [$app, $dynamicHeaderContainer, $WebVideoLinkInput, $dynamicSettingSaveButton] = await utils.getElementAndCheckExistence([selectors.app, selectors.dynamicHeaderContainer, selectors.WebVideoLinkInput, selectors.dynamicSettingSaveButton])
        $WebVideoLinkInput.addEventListener('input', event => {
          utils.setValue('web_video_link', event.target.value.trim())
        })
        $dynamicSettingPopover.addEventListener('toggle', event => {
          if (event.newState === 'open') {
            $app.style.pointerEvents = 'none'
            $dynamicHeaderContainer.style.pointerEvents = 'none'
          }
          if (event.newState === 'closed') {
            $app.style.pointerEvents = 'auto'
            $dynamicHeaderContainer.style.pointerEvents = 'auto'
          }
        })
        $dynamicSettingSaveButton.addEventListener('click', () => {
          $dynamicSettingPopover.hidePopover()
        })
      }
      if (regexps.video.test(window.location.href)) {
        const $player = await utils.getElementAndCheckExistence(selectors.player, 10)
        const playerOffsetTop = Math.trunc(utils.getElementOffsetToDocument($player).top)
        const videoSettingPopoverHtml = `
          <div id="videoSettingPopover" class="adjustment_popover" popover>
            <div class="adjustment_popoverTitle">哔哩哔哩播放页设置
              <div class="subTitle">（以下设置内容更改即生效，直接关闭本弹窗即可）</div>
            </div>
            <div class="recommend">推荐使用样式表：<a href="https://userstyles.world/style/241/nightmode-for-bilibili-com" target="_blank">「夜间哔哩 NightMode For Bilibili」</a></div>
            <div class="adjustment_form">
              <div class="adjustment_form_item">
                <div class="adjustment_form_item_content">
                  <label>是否为大会员</label>
                  <div class="adjustment_checkbox_btn btn-pill">
                    <input type="checkbox" id="${selectors.IsVip.slice(1)}" ${vals.is_vip() ? 'checked' : ''} class="adjustment_checkbox checkbox">
                    <div class="knob"></div>
                    <div class="btn-bg"></div>
                  </div>
                </div>
                <span class="adjustment_tips info">请如实勾选，否则影响自动选择清晰度</span>
              </div>
              <div class="adjustment_form_item">
                <div class="adjustment_form_item_content">
                  <label>自动定位至播放器</label>
                  <div class="adjustment_checkbox_btn btn-pill">
                    <input type="checkbox" id="${selectors.AutoLocate.slice(1)}" ${vals.auto_locate() ? 'checked' : ''} class="adjustment_checkbox checkbox">
                    <div class="knob"></div>
                    <div class="btn-bg"></div>
                  </div>
                </div>
                <div class="adjustment_checkboxGroup">
                  <div class="adjustment_checkbox video">
                    <span>普通视频(video)</span>

                    <div class="adjustment_checkbox_btn btn-pill">
                      <input type="checkbox" id="${selectors.AutoLocateVideo.slice(1)}" ${vals.auto_locate_video() ? 'checked' : ''} class="adjustment_checkbox checkbox">
                      <div class="knob"></div>
                      <div class="btn-bg"></div>
                    </div>
                  </div>
                  <div class="adjustment_checkbox bangumi">
                    <span>其他视频(bangumi)</span>

                    <div class="adjustment_checkbox_btn btn-pill">
                      <input type="checkbox" id="${selectors.AutoLocateBangumi.slice(1)}" ${vals.auto_locate_bangumi() ? 'checked' : ''} class="adjustment_checkbox checkbox">
                      <div class="knob"></div>
                      <div class="btn-bg"></div>
                    </div>
                  </div>
                </div>
                <span class="adjustment_tips info">
                 只有勾选自动定位至播放器，才会执行自动定位的功能；勾选自动定位至播放器后，video 和 bangumi
                  两者全选或全不选，默认在这两种类型视频播放页都执行；否则勾选哪种类型，就只在这种类型的播放页才执行。
                </span>
              </div>
              <div class="adjustment_form_item">
                <div class="adjustment_form_item_content">
                  <label>播放器顶部偏移(px)</label>
                  <input id="${selectors.TopOffset.slice(1)}" class="adjustment_input" value="${vals.offset_top()}">
                </div>
                <span class="adjustment_tips info">
                 播放器距离浏览器窗口默认距离为 ${playerOffsetTop}；请填写小于 ${playerOffsetTop} 的正整数或 0；当值为 0 时，播放器上沿将紧贴浏览器窗口上沿、值为 ${playerOffsetTop} 时，将保持B站默认。
                </span>
              </div>
              <div class="adjustment_form_item">
                <div class="adjustment_form_item_content">
                  <label>点击播放器时定位</label>
                  <div class="adjustment_checkbox_btn btn-pill">
                    <input type="checkbox" id="${selectors.ClickPlayerAutoLocation.slice(1)}" ${vals.click_player_auto_locate() ? 'checked' : ''} class="adjustment_checkbox checkbox">
                    <div class="knob"></div>
                    <div class="btn-bg"></div>
                  </div>
                </div>
              </div>
              <div class="adjustment_form_item screen-mode">
                <div class="adjustment_form_item_content">
                  <label>播放器默认模式</label>
                  <div class="adjustment_checkboxGroup">
                    <div class="adjustment_checkbox">
                      <div class="adjustment_radio_btn">
                        <input class="radio" type="radio" name="Screen-Mode" value="close" ${vals.selected_screen_mode() === 'close' ? 'checked' : ''}>
                        <div class="circle"></div>
                        <span>关闭</span>
                      </div>
                    </div>
                    <div class="adjustment_checkbox">
                      <div class="adjustment_radio_btn">
                        <input class="radio" type="radio" name="Screen-Mode" value="wide" ${vals.selected_screen_mode() === 'wide' ? 'checked' : ''}>
                        <div class="circle"></div>
                        <span>宽屏</span>
                      </div>
                    </div>
                    <div class="adjustment_checkbox">
                      <div class="adjustment_radio_btn">
                        <input class="radio" type="radio" name="Screen-Mode" value="web" ${vals.selected_screen_mode() === 'web' ? 'checked' : ''}>
                        <div class="circle"></div>
                        <span>网页全屏</span>
                      </div>
                    </div>
                  </div>
                </div>
                <span class="adjustment_tips info">若遇到不能自动选择播放器模式可尝试刷新页面</span>
              </div>
              <div class="adjustment_form_item">
                <div class="adjustment_form_item_content">
                  <label>网页全屏模式解锁</label>
                  <div class="adjustment_checkbox_btn btn-pill">
                    <input type="checkbox" id="${selectors.WebfullUnlock.slice(1)}" ${vals.webfull_unlock() ? 'checked' : ''} class="adjustment_checkbox checkbox">
                    <div class="knob"></div>
                    <div class="btn-bg"></div>
                  </div>
                </div>
                <span class="adjustment_tips info">
                 勾选后网页全屏模式下可以滑动滚动条查看下方评论等内容（番剧播放页不支持）
                  <br>-&gt;新增迷你播放器显示，不过比较简陋，只支持暂停/播放操作，有条件的建议还是直接使用浏览器自带的小窗播放功能。</span>
              </div>
              <div class="adjustment_form_item">
                <div class="adjustment_form_item_content">
                  <label>自动选择最高画质</label>
                  <div class="adjustment_checkbox_btn btn-pill">
                    <input type="checkbox" id="${selectors.AutoQuality.slice(1)}" ${vals.auto_select_video_highest_quality() ? 'checked' : ''} class="adjustment_checkbox checkbox">
                    <div class="knob"></div>
                    <div class="btn-bg"></div>
                  </div>
                </div>
                <div class="adjustment_checkboxGroup">
                  <div class="adjustment_checkbox fourK" style="display:${vals.is_vip() ? 'flex' : 'none'}">
                    <span>包含4K画质</span>
                    <div class="adjustment_checkbox_btn btn-pill">
                      <input type="checkbox" id="${selectors.Quality4K.slice(1)}" ${vals.contain_quality_4k() ? 'checked' : ''} class="adjustment_checkbox checkbox">
                      <div class="knob"></div>
                      <div class="btn-bg"></div>
                    </div>
                  </div>
                  <div class="adjustment_checkbox eightK" style="display:${vals.is_vip() ? 'flex' : 'none'}">
                    <span>包含8K画质</span>
                    <div class="adjustment_checkbox_btn btn-pill">
                      <input type="checkbox" id="${selectors.Quality8K.slice(1)}" ${vals.contain_quality_8k() ? 'checked' : ''} class="adjustment_checkbox checkbox">
                      <div class="knob"></div>
                      <div class="btn-bg"></div>
                    </div>
                  </div>
                </div>
                <span class="adjustment_tips info">网络条件好时可以启用此项，勾哪项选哪项，都勾选8k，否则选择4k及8k外最高画质。</span>
              </div>
              <div class="adjustment_form_item">
                <div class="adjustment_form_item_content">
                  <label>优化视频简介并插入评论区</label>
                  <div class="adjustment_checkbox_btn btn-pill">
                    <input type="checkbox" id="${selectors.InsertVideoDescriptionToComment.slice(1)}"
                                  ${vals.insert_video_description_to_comment() ? 'checked' : ''} class="adjustment_checkbox checkbox">
                    <div class="knob"></div>
                    <div class="btn-bg"></div>
                  </div>
                </div>
                <span class="adjustment_tips info">将视频简介内容优化后插入评论区或直接替换原简介区内容(替换原简介中固定格式的静态内容为跳转链接)。</span>
              </div>
              <div class="adjustment_form_item">
                <div class="adjustment_form_item_content">
                  <label>自动跳过时间节点</label>
                  <div class="adjustment_checkbox_btn btn-pill">
                    <input type="checkbox" id="${selectors.AutoSkip.slice(1)}" ${vals.auto_skip() ? 'checked' : ''} class="adjustment_checkbox checkbox">
                    <div class="knob"></div>
                    <div class="btn-bg"></div>
                  </div>
                </div>
                <span class="adjustment_tips info">自动跳过视频已设置设置时间节点，视频播放到相应时间点时将触发跳转至设定时间点。</span>
              </div>
              <div class="adjustment_form_item">
                <div class="adjustment_form_item_content">
                  <label>离开页面自动暂停视频</label>
                  <div class="adjustment_checkbox_btn btn-pill">
                    <input type="checkbox" id="${selectors.PauseVideo.slice(1)}" ${vals.pause_video() ? 'checked' : ''} class="adjustment_checkbox checkbox">
                    <div class="knob"></div>
                    <div class="btn-bg"></div>
                  </div>
                </div>
                <div class="adjustment_checkboxGroup">
                  <div class="adjustment_checkbox continuePlay" style="display:${vals.is_vip() ? 'flex' : 'none'}">
                    <span>返回页面恢复播放</span>
                    <div class="adjustment_checkbox_btn btn-pill">
                      <input type="checkbox" id="${selectors.ContinuePlay.slice(1)}" ${vals.continue_play() ? 'checked' : ''} class="adjustment_checkbox checkbox">
                      <div class="knob"></div>
                      <div class="btn-bg"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="adjustment_form_item">
                <div class="adjustment_form_item_content">
                  <label>自动开启字幕</label>
                  <div class="adjustment_checkbox_btn btn-pill">
                    <input type="checkbox" id="${selectors.AutoSubtitle.slice(1)}" ${vals.auto_subtitle() ? 'checked' : ''} class="adjustment_checkbox checkbox">
                    <div class="knob"></div>
                    <div class="btn-bg"></div>
                  </div>
                </div>
              </div>
              <div class="adjustment_form_item">
                <div class="adjustment_form_item_content">
                  <label>自动刷新</label>
                  <div class="adjustment_checkbox_btn btn-pill">
                    <input type="checkbox" id="${selectors.AutoReload.slice(1)}" ${vals.auto_reload() ? 'checked' : ''} class="adjustment_checkbox checkbox">
                    <div class="knob"></div>
                    <div class="btn-bg"></div>
                  </div>
                </div>
                <span class="adjustment_tips info">（不建议开启）若脚本执行失败是否自动刷新页面重试，开启后可能会对使用体验起到一定改善作用，但若是因为B站页面改版导致脚本失效，则会陷入页面无限刷新的情况，此时则必须在页面加载时看准时机关闭此项才能恢复正常，请自行选择是否开启。</span>
              </div>
            </div>
            <div class="adjustment_buttonGroup">
              <button id="videoSettingSaveButton" class="adjustment_button primary">保存</button>
            </div>
          </div>`
        if (document.getElementById(selectors.videoSettingPopover)) document.getElementById(selectors.videoSettingPopover).remove()
        const $videoSettingPopover = utils.createElementAndInsert(videoSettingPopoverHtml, document.body, 'append')
        GM_registerMenuCommand('设置', () => {
          $videoSettingPopover.showPopover()
        })
        const $app = vals.player_type() === 'video' ? await utils.getElementAndCheckExistence(selectors.app) : await utils.getElementAndCheckExistence(selectors.bangumiApp)
        const [$IsVip, $AutoLocate, $AutoLocateVideo, $AutoLocateBangumi, $TopOffset, $ClickPlayerAutoLocation, $AutoQuality, $Quality4K, $Quality8K, $Checkbox4K, $Checkbox8K, $WebfullUnlock, $AutoReload, $videoSettingSaveButton, $AutoSkip, $InsertVideoDescriptionToComment, $PauseVideo, $ContinuePlay, $AutoSubtitle] = await utils.getElementAndCheckExistence([selectors.IsVip, selectors.AutoLocate, selectors.AutoLocateVideo, selectors.AutoLocateBangumi, selectors.TopOffset, selectors.ClickPlayerAutoLocation, selectors.AutoQuality, selectors.Quality4K, selectors.Quality8K, selectors.Checkbox4K, selectors.Checkbox8K, selectors.WebfullUnlock, selectors.AutoReload, selectors.videoSettingSaveButton, selectors.AutoSkip, selectors.InsertVideoDescriptionToComment, selectors.PauseVideo, selectors.ContinuePlay, selectors.AutoSubtitle])
        $videoSettingPopover.addEventListener('toggle', event => {
          if (event.newState === 'open') {
            // document.querySelector('*:not(#videoSettingPopover *)').style.pointerEvents = 'none'
            $app.style.pointerEvents = 'none'
          }
          if (event.newState === 'closed') {
            $app.style.pointerEvents = 'auto'
          }
        })
        $IsVip.addEventListener('change', async event => {
          utils.setValue('is_vip', event.target.checked)
          $Checkbox4K.style.display = event.target.checked ? 'flex' : 'none'
          $Checkbox8K.style.display = event.target.checked ? 'flex' : 'none'
        })
        $AutoLocate.addEventListener('change', event => {
          utils.setValue('auto_locate', event.target.checked)
        })
        $AutoLocateVideo.addEventListener('change', event => {
          utils.setValue('auto_locate_video', event.target.checked)
        })
        $AutoLocateBangumi.addEventListener('change', event => {
          utils.setValue('auto_locate_bangumi', event.target.checked)
        })
        $TopOffset.addEventListener('change', event => {
          utils.setValue('offset_top', +event.target.value)
        })
        $ClickPlayerAutoLocation.addEventListener('change', event => {
          utils.setValue('click_player_auto_locate', event.target.checked)
        })
        $AutoQuality.addEventListener('change', event => {
          utils.setValue('auto_select_video_highest_quality', event.target.checked)
        })
        $Quality4K.addEventListener('change', event => {
          utils.setValue('contain_quality_4k', event.target.checked)
        })
        $Quality8K.addEventListener('change', event => {
          utils.setValue('contain_quality_8k', event.target.checked)
        })
        $WebfullUnlock.addEventListener('change', event => {
          utils.setValue('webfull_unlock', event.target.checked)
        })
        $InsertVideoDescriptionToComment.addEventListener('change', event => {
          utils.setValue('insert_video_description_to_comment', event.target.checked)
        })
        $AutoSkip.addEventListener('change', event => {
          utils.setValue('auto_skip', event.target.checked)
        })
        $PauseVideo.addEventListener('change', event => {
          utils.setValue('pause_video', event.target.checked)
        })
        $ContinuePlay.addEventListener('change', event => {
          utils.setValue('continue_play', event.target.checked)
        })
        $AutoReload.addEventListener('change', event => {
          utils.setValue('auto_reload', event.target.checked)
        })
        $AutoSubtitle.addEventListener('change', event => {
          utils.setValue('auto_subtitle', event.target.checked)
        })
        await elmGetter.each(selectors.SelectScreenMode, $videoSettingPopover, radioInput => {
          radioInput.addEventListener('click', function () {
            utils.setValue('selected_screen_mode', this.value)
          })
        })
        $videoSettingSaveButton.addEventListener('click', () => {
          $videoSettingPopover.hidePopover()
          utils.reloadCurrentTab(true)
        })
      }
    },
    // #endregion 注册脚本设置选项
    /**
     * 前期准备函数
     * - #region 前期准备函数
     * 提前执行其他脚本功能所依赖的其他函数
     */
    thePrepFunction() {
      if (++vars.thePrepFunctionRunningCount !== 1) return
      utils.initValue()
      utils.clearAllTimersWhenCloseTab()
      modules.registerMenuCommand()
      utils.insertStyleToDocument('BilibiliAdjustmentStyle', styles.BilibiliAdjustment)
      // biliApis.autoSignIn() 官方签到活动已下线
      if (window.location.href === 'https://www.bilibili.com/') {
        utils.insertStyleToDocument('IndexAdjustmentStyle', styles.IndexAdjustment)
      }
      if (regexps.video.test(window.location.href)) {
        utils.insertStyleToDocument('BodyHiddenStyle', styles.BodyHidden)
        utils.insertStyleToDocument('VideoPageAdjustmentStyle', styles.VideoPageAdjustment)
        utils.insertStyleToDocument('FreezeHeaderAndVideoTitleStyle', styles.FreezeHeaderAndVideoTitle)
        utils.insertStyleToDocument('VideoSettingStyle', styles.VideoSetting)
        modules.observerPlayerDataScreenChanges()
      }
      if (regexps.dynamic.test(window.location.href)) {
        utils.insertStyleToDocument('DynamicSettingStyle', styles.DynamicSetting)
      }

    },
    // #endregion 前期准备函数
    /**
     * 执行主函数
     * - #region 执行主函数
     */
    async theMainFunction() {
      if (++vars.theMainFunctionRunningCount !== 1) return
      if (modules.isLogin()) {
        modules.thePrepFunction()
        const timer = setInterval(async () => {
          const documentHidden = utils.checkDocumentIsHidden()
          if (!documentHidden) {
            clearInterval(timer)
            utils.logger.info(`脚本版本｜${GM_info.script.version}`)
            utils.logger.info('当前标签｜已激活｜开始应用配置')
            let functionsArray = []
            if (regexps.video.test(window.location.href) || regexps.dynamic.test(window.location.href)) {
              if (regexps.video.test(window.location.href)) {
                functionsArray = [
                  modules.getCurrentPlayerType,
                  modules.checkVideoExistence,
                  modules.checkVideoCanPlayThrough,
                  modules.autoSelectScreenMode,
                  modules.webfullScreenModeUnlock,
                  modules.autoLocationToPlayer,
                  modules.insertVideoDescriptionToComment,
                  modules.autoCancelMute,
                  modules.autoSelectVideoHighestQuality,
                  modules.autoEnableSubtitle,
                  modules.insertAutoEnableSubtitleSwitchButton,
                  modules.clickPlayerAutoLocation,
                  modules.insertFloatSideNavToolsButton,
                  modules.clickVideoTimeAutoLocation,
                  modules.unlockEpisodeSelector,
                  // modules.insertSetSkipTimeNodesButton,
                  // modules.insertSkipTimeNodesSwitchButton,
                  // modules.autoSkipTimeNodes,
                ]
              }
              if (regexps.dynamic.test(window.location.href)) {
                functionsArray = [
                  modules.changeCurrentUrlToVideoSubmissions
                ]
              }
              if (vals.pause_video()) functionsArray.push(modules.pauseVideoWhenLeavingCurrentPage)
            }
            if (window.location.href === 'https://www.bilibili.com/') {
              functionsArray = [
                modules.insertIndexRecommendVideoHistoryOpenButton,
                modules.setIndexRecordRecommendVideoHistory,
                modules.getIndexRecordRecommendVideoHistory,
                modules.generatorVideoCategories
              ]
            }
            utils.addEventListenerToElement()
            utils.executeFunctionsSequentially(functionsArray)
          } else {
            utils.logger.info('当前标签｜未激活｜等待激活')
          }
        }, 100)
        arrays.intervalIds.push(timer)
      }
      else utils.logger.warn('请登录｜本脚本只能在登录状态下使用')

    }
    // #endregion 执行主函数
    // #endregion 脚本最终执行函数
  }
  modules.theMainFunction()
})();
