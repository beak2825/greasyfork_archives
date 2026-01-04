// ==UserScript==
// @name        哔哩哔哩屏蔽增强器
// @namespace   http://tampermonkey.net/
// @license     Apache-2.0
// @version     2.16.2
// @author      byhgz
// @description 对B站视频或评论进行屏蔽，支持关键词模糊正则等，支持时长播放弹幕过滤等，如视频、评论、动态、直播间的评论等，详情可看下面支持的屏蔽类型
// @icon        https://static.hdslb.com/images/favicon.ico
// @noframes    
// @run-at      document-start
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_addStyle
// @grant       GM_unregisterMenuCommand
// @grant       GM_registerMenuCommand
// @grant       GM_openInTab
// @grant       GM_xmlhttpRequest
// @grant       GM_getResourceText
// @exclude     *://message.bilibili.com/pages/nav/header_sync
// @exclude     *://message.bilibili.com/pages/nav/index_new_pc_sync
// @exclude     *://live.bilibili.com/blackboard/dropdown-menu.html
// @exclude     *://live.bilibili.com/p/html/live-web-mng/*
// @exclude     *://www.bilibili.com/correspond/*
// @exclude     http://localhost:3001/
// @match       *://search.bilibili.com/*
// @match       *://t.bilibili.com/*
// @match       *://space.bilibili.com/*
// @match       *://live.bilibili.com/*
// @match       *://www.bilibili.com/*
// @match       *://localhost:5173/*
// @require     https://unpkg.com/vue@2.7.16/dist/vue.min.js
// @require     https://unpkg.com/element-ui@2.15.14/lib/index.js
// @require     https://unpkg.com/dexie@4.2.0/dist/dexie.min.js
// @source      https://gitee.com/hangexi/BiBiBSPUserVideoMonkeyScript
// homepage     https://scriptcat.org/zh-CN/script-show-page/1029
// @downloadURL https://update.greasyfork.org/scripts/461382/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%B1%8F%E8%94%BD%E5%A2%9E%E5%BC%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/461382/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%B1%8F%E8%94%BD%E5%A2%9E%E5%BC%BA%E5%99%A8.meta.js
// ==/UserScript==
"use strict";
(function(Vue,Dexie){'use strict';var __typeError$7 = (msg) => {
  throw TypeError(msg);
};
var __accessCheck$7 = (obj, member, msg) => member.has(obj) || __typeError$7("Cannot " + msg);
var __privateGet$7 = (obj, member, getter) => (__accessCheck$7(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd$7 = (obj, member, value) => member.has(obj) ? __typeError$7("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateMethod$2 = (obj, member, method) => (__accessCheck$7(obj, member, "access private method"), method);
var _regularEvents, _callbackEvents, _EventEmitter_instances, handlePendingEvents_fn, executePreHandle_fn;
class EventEmitter {
  constructor() {
    __privateAdd$7(this, _EventEmitter_instances);
    __privateAdd$7(this, _regularEvents, {
      events: {},
      futures: {},
      parametersDebounce: {},
      preHandles: {}
    });
    __privateAdd$7(this, _callbackEvents, {
      events: {},
      callbackInterval: 1500
    });
  }
  on(eventName, callback, overrideEvents = false) {
    const events = __privateGet$7(this, _regularEvents).events;
    if (events[eventName]) {
      if (overrideEvents) {
        events[eventName] = callback;
        __privateMethod$2(this, _EventEmitter_instances, handlePendingEvents_fn).call(this, eventName, callback);
      }
      return this;
    }
    events[eventName] = callback;
    __privateMethod$2(this, _EventEmitter_instances, handlePendingEvents_fn).call(this, eventName, callback);
    return this;
  }
  onPreHandle(eventName, callback) {
    const preHandles = __privateGet$7(this, _regularEvents).preHandles;
    preHandles[eventName] = callback;
    return this;
  }
  handler(eventName, callback) {
    const handlerEvents = __privateGet$7(this, _callbackEvents).events;
    if (handlerEvents[eventName]) {
      throw new Error("该事件名已经存在，请更换事件名");
    }
    handlerEvents[eventName] = callback;
  }
  invoke(eventName, ...data) {
    return new Promise((resolve) => {
      const handlerEvents = __privateGet$7(this, _callbackEvents).events;
      if (handlerEvents[eventName]) {
        resolve(handlerEvents[eventName](...data));
        return;
      }
      const i1 = setInterval(() => {
        if (handlerEvents[eventName]) {
          clearInterval(i1);
          resolve(handlerEvents[eventName](...data));
        }
      }, __privateGet$7(this, _callbackEvents).callbackInterval);
    });
  }
  send(eventName, ...data) {
    const ordinaryEvents = __privateGet$7(this, _regularEvents);
    const events = ordinaryEvents.events;
    const event = events[eventName];
    if (event) {
      const preHandleData = __privateMethod$2(this, _EventEmitter_instances, executePreHandle_fn).call(this, eventName, data);
      event.apply(null, preHandleData);
      return this;
    }
    const futures = ordinaryEvents.futures;
    if (futures[eventName]) {
      futures[eventName].push(data);
      return this;
    }
    futures[eventName] = [];
    futures[eventName].push(data);
    return this;
  }
  sendDebounce(eventName, ...data) {
    const parametersDebounce = __privateGet$7(this, _regularEvents).parametersDebounce;
    let timeOutConfig = parametersDebounce[eventName];
    if (timeOutConfig) {
      clearTimeout(timeOutConfig.timeOut);
      timeOutConfig.timeOut = null;
    } else {
      timeOutConfig = parametersDebounce[eventName] = { wait: 1500, timeOut: null };
    }
    timeOutConfig.timeOut = setTimeout(
      () => {
        this.send(eventName, ...data);
      },
      timeOutConfig.wait
    );
    return this;
  }
  setDebounceWaitTime(eventName, wait) {
    const timeOutConfig = __privateGet$7(this, _regularEvents).parametersDebounce[eventName];
    if (timeOutConfig) {
      timeOutConfig.wait = wait;
    } else {
      __privateGet$7(this, _regularEvents).parametersDebounce[eventName] = {
        wait,
        timeOut: null
      };
    }
    return this;
  }
  emit(eventName, ...data) {
    const callback = __privateGet$7(this, _regularEvents).events[eventName];
    if (callback) {
      callback.apply(null, data);
    }
    return this;
  }
  off(eventName) {
    const events = __privateGet$7(this, _regularEvents).events;
    if (events[eventName]) {
      delete events[eventName];
      return true;
    }
    const handlerEvents = __privateGet$7(this, _callbackEvents).events;
    if (handlerEvents[eventName]) {
      delete handlerEvents[eventName];
      return true;
    }
    return false;
  }
  setInvokeInterval(interval) {
    __privateGet$7(this, _callbackEvents).callbackInterval = interval;
  }
  getEvents() {
    return {
      regularEvents: __privateGet$7(this, _regularEvents),
      callbackEvents: __privateGet$7(this, _callbackEvents)
    };
  }
}
_regularEvents = new WeakMap();
_callbackEvents = new WeakMap();
_EventEmitter_instances = new WeakSet();
handlePendingEvents_fn = function(eventName, callback) {
  const futureEvents = __privateGet$7(this, _regularEvents).futures;
  if (futureEvents[eventName]) {
    for (const eventData of futureEvents[eventName]) {
      const preHandleData = __privateMethod$2(this, _EventEmitter_instances, executePreHandle_fn).call(this, eventName, eventData);
      callback.apply(null, preHandleData);
    }
    delete futureEvents[eventName];
  }
};
executePreHandle_fn = function(eventName, data) {
  const preHandles = __privateGet$7(this, _regularEvents).preHandles;
  const callback = preHandles[eventName];
  if (callback) {
    return callback.apply(null, data);
  }
  return data;
};
const eventEmitter = new EventEmitter();const setBorderColor = (color) => {
  GM_setValue("borderColor", color);
};
const defBorderColor = "rgb(0, 243, 255)";
const getBorderColor = () => {
  return GM_getValue("borderColor", defBorderColor);
};
const setOutputInformationFontColor = (color) => {
  GM_setValue("output_information_font_color", color);
};
const defOutputInformationFontColor = "rgb(119,128,248)";
const getOutputInformationFontColor = () => {
  return GM_getValue("output_information_font_color", defOutputInformationFontColor);
};
const setHighlightInformationColor = (color) => {
  GM_setValue("highlight_information_color", color);
};
const defHighlightInformationColor = "rgb(234, 93, 93)";
const getHighlightInformationColor = () => {
  return GM_getValue("highlight_information_color", defHighlightInformationColor);
};
const setDefaultColorInfo = () => {
  setBorderColor(defBorderColor);
  setOutputInformationFontColor(defOutputInformationFontColor);
  setHighlightInformationColor(defHighlightInformationColor);
};
const getBOnlyTheHomepageIsBlocked = () => {
  return GM_getValue("bOnlyTheHomepageIsBlocked", false);
};
const getAdaptationBAppCommerce = () => {
  return GM_getValue("adaptation-b-app-recommend", false) === true;
};
const isShowRightTopMainButSwitch = () => {
  return GM_getValue("showRightTopMainButSwitch", true) === true;
};
const isFirstFullDisplay = () => {
  return GM_getValue("isFirstFullDisplay", true) === true;
};
const isHalfHiddenIntervalAfterInitialDisplay = () => {
  return GM_getValue("is_half_hidden_interval_after_initial_display", true) === true;
};
const isCompatible_BEWLY_BEWLY = () => {
  return GM_getValue("compatible_BEWLY_BEWLY", false) === true;
};
const isDiscardOldCommentAreas = () => {
  return GM_getValue("discardOldCommentAreas", false) === true;
};
const isDelPlayerPageRightVideoList = () => {
  return GM_getValue("isDelPlayerPageRightVideoList", false) === true;
};
const bFuzzyAndRegularMatchingWordsToLowercase$1 = () => {
  return GM_getValue("bFuzzyAndRegularMatchingWordsToLowercase", false);
};
const getRequestFrequencyVal = () => {
  return GM_getValue("requestFrequencyVal", 0.2);
};
const isDisableNetRequestsBvVideoInfo = () => {
  return GM_getValue("isDisableNetRequestsBvVideoInfo", false);
};
const isBlockFollowed = () => {
  return GM_getValue("blockFollowed", false);
};
const isUpOwnerExclusive = () => {
  return GM_getValue("is_up_owner_exclusive", false);
};
const isGenderRadioVal = () => {
  return GM_getValue("genderRadioVal", "不处理");
};
const isVipTypeRadioVal = () => {
  return GM_getValue("vipTypeRadioVal", "不处理");
};
const isSeniorMember = () => {
  return GM_getValue("is_senior_member", false);
};
const isCopyrightRadio = () => {
  return GM_getValue("copyrightRadioVal", "不处理");
};
const isDelBottomComment = () => {
  return GM_getValue("isDelBottomComment", false);
};
const isBlockVerticalVideo = () => {
  return GM_getValue("blockVerticalVideo", false);
};
const isCheckTeamMember = () => {
  return GM_getValue("checkTeamMember", false);
};
const getVideoLikeRate = () => {
  return GM_getValue("video_like_rate", 0.05);
};
const isVideoLikeRateBlockingStatus = () => {
  return GM_getValue("video_like_rate_blocking_status", false);
};
const isCoinLikesRatioRateBlockingStatus = () => {
  return GM_getValue("coin_likes_ratio_rate_blocking_status", false);
};
const getCoinLikesRatioRate = () => {
  return GM_getValue("coin_likes_ratio_rate", 0.05);
};
const isCoinLikesRatioRateDisabled = () => {
  return GM_getValue("coin_likes_ratio_rate_blocking_status", false);
};
const isInteractiveRateBlockingStatus = () => {
  return GM_getValue("interactive_rate_blocking_status", false);
};
const getInteractiveRate = () => {
  return GM_getValue("interactive_rate", 0.05);
};
const isTripleRateBlockingStatus = () => {
  return GM_getValue("triple_rate_blocking_status", false);
};
const getTripleRate = () => {
  return GM_getValue("triple_rate", 0.05);
};
const getUidRangeMasking = () => {
  return GM_getValue("uid_range_masking", [0, 100]);
};
const isUidRangeMaskingStatus = () => {
  return GM_getValue("uid_range_masking_status", false);
};
const isTimeRangeMaskingStatus = () => {
  return GM_getValue("time_range_masking_status", false);
};
const getTimeRangeMaskingArr = () => {
  return GM_getValue("time_range_masking", []);
};
const isDelPlayerEndingPanel = () => {
  return GM_getValue("is_del_player_ending_panel", false);
};
const isLocalhostPageAutomaticallyOpenTheMainPanelGm = () => {
  return GM_getValue("is_localhost_page_automatically_open_the_main_panel_gm", false);
};
const getCommentWordLimitVal = () => {
  return GM_getValue("comment_word_limit", -1);
};
const getSubstituteWordsArr = () => {
  return GM_getValue("substitute_words", []);
};
const isClearCommentEmoticons = () => {
  return GM_getValue("is_clear_comment_emoticons", false);
};
const isReplaceCommentSearchTerms = () => {
  return GM_getValue("is_replace_comment_search_terms", false);
};
const enableReplacementProcessing = () => {
  return GM_getValue("enable_replacement_processing", false);
};
const isEffectiveUIDShieldingOnlyVideo = () => {
  return GM_getValue("is_effective_uid_shielding_only_video", false);
};
const isSeniorMemberOnly = () => {
  return GM_getValue("is_senior_member_only", false);
};
const isExcludeURLSwitchGm = () => {
  return GM_getValue("is_exclude_url_switch_gm", false);
};
const getExcludeURLsGm = () => {
  return GM_getValue("exclude_urls_gm", []);
};
const isHideHotSearchesPanelGm = () => {
  return GM_getValue("is_hide_hot_searches_panel_gm", false);
};
const isHideSearchHistoryPanelGm = () => {
  return GM_getValue("is_hide_search_history_panel_gm", false);
};
const isCloseCommentBlockingGm = () => {
  return GM_getValue("is_close_comment_blocking_gm", false);
};
const isHideCarouselImageGm = () => {
  return GM_getValue("is_hide_carousel_image_gm", false);
};
const isHideHomeTopHeaderBannerImageGm = () => {
  return GM_getValue("is_hide_home_top_header_banner_image_gm", false);
};
const isHideHomeTopHeaderChannelGm = () => {
  return GM_getValue("is_hide_home_top_header_channel_gm", false);
};
const getLimitationFanSumGm = () => {
  return GM_getValue("limitation_fan_sum_gm", -1);
};
const isFansNumBlockingStatusGm = () => {
  return GM_getValue("is_fans_num_blocking_status_gm", false);
};
const getLimitationVideoSubmitSumGm = () => {
  return GM_getValue("limitation_video_submit_sum_gm", 0);
};
const isLimitationVideoSubmitStatusGm = () => {
  return GM_getValue("is_limitation_video_submit_status_gm", false);
};
const enableDynamicItemsContentBlockingGm = () => {
  return GM_getValue("enable_dynamic_items_content_blocking_gm", false);
};
const hideBlockButtonGm = () => {
  return GM_getValue("hide_block_button_gm", false);
};
const isCheckNestedDynamicContentGm = () => {
  return GM_getValue("is_check_nested_dynamic_content_gm", false);
};
const isBlockRepostDynamicGm = () => {
  return GM_getValue("is_block_repost_dynamic_gm", false);
};
const isBlockAppointmentDynamicGm = () => {
  return GM_getValue("is_block_appointment_dynamic_gm", false);
};
const isBlockVoteDynamicGm = () => {
  return GM_getValue("is_block_vote_dynamic_gm", false);
};
const isBlockUPowerLotteryDynamicGm = () => {
  return GM_getValue("is_block_u_power_lottery_dynamic_gm", false);
};
const isBlockGoodsDynamicGm = () => {
  return GM_getValue("is_block_goods_dynamic_gm", false);
};
const isBlockSpecialColumnForChargingDynamicGm = () => {
  return GM_getValue("is_block_special_column_for_charging_dynamic_gm", false);
};
const isBlockVideoChargingExclusiveDynamicGm = () => {
  return GM_getValue("is_block_video_charging_exclusive_dynamic_gm", false);
};
const getDrawerShortcutKeyGm = () => {
  return GM_getValue("drawer_shortcut_key_gm", "`");
};
const getExpiresMaxAgeGm = () => {
  return GM_getValue("expires_max_age_gm", 7);
};
const isClearLiveCardGm = () => {
  return GM_getValue("is_clear_live_card_gm", false);
};
const getMinimumUserLevelVideoGm = () => {
  return GM_getValue("minimum_user_level_video_gm", 0);
};
const getMaximumUserLevelVideoGm = () => {
  return GM_getValue("maximum_user_level_video_gm", 1);
};
const getMinimumUserLevelCommentGm = () => {
  return GM_getValue("minimum_user_level_comment_gm", 0);
};
const getMaximumUserLevelCommentGm = () => {
  return GM_getValue("maximum_user_level_comment_gm", 0);
};
const isEnableMinimumUserLevelVideoGm = () => {
  return GM_getValue("is_enable_minimum_user_level_video_gm", false);
};
const isEnableMaximumUserLevelVideoGm = () => {
  return GM_getValue("is_enable_maximum_user_level_video_gm", false);
};
const isEnableMinimumUserLevelCommentGm = () => {
  return GM_getValue("is_enable_minimum_user_level_comment_gm", false);
};
const isEnableMaximumUserLevelCommentGm = () => {
  return GM_getValue("is_enable_maximum_user_level_comment_gm", false);
};
const getMinimumPlayGm = () => {
  return GM_getValue("minimum_play_gm", 100);
};
const getMaximumPlayGm = () => {
  return GM_getValue("maximum_play_gm", 1e4);
};
const isMinimumPlayGm = () => {
  return GM_getValue("is_minimum_play_gm", false);
};
const isMaximumPlayGm = () => {
  return GM_getValue("is_maximum_play_gm", false);
};
const getMinimumBarrageGm = () => {
  return GM_getValue("minimum_barrage_gm", 20);
};
const getMaximumBarrageGm = () => {
  return GM_getValue("maximum_barrage_gm", 1e3);
};
const isMinimumBarrageGm = () => {
  return GM_getValue("is_minimum_barrage_gm", false);
};
const isMaximumBarrageGm = () => {
  return GM_getValue("is_maximum_barrage_gm", false);
};
const getMinimumDurationGm = () => {
  return GM_getValue("minimum_duration_gm", 30);
};
const getMaximumDurationGm = () => {
  return GM_getValue("maximum_duration_gm", 3e3);
};
const isMinimumDurationGm = () => {
  return GM_getValue("is_minimum_duration_gm", false);
};
const isMaximumDurationGm = () => {
  return GM_getValue("is_maximum_duration_gm", false);
};
const hidePersonalInfoCardGm = () => {
  return GM_getValue("hide_personal_info_card_gm", false);
};
const isVideosInFeaturedCommentsBlockedGm = () => {
  return GM_getValue("is_videos_in_featured_comments_blocked_gm", false);
};
const isFollowers7DaysOnlyVideosBlockedGm = () => {
  return GM_getValue("is_followers_7_days_only_videos_blocked_gm", false);
};
const isCommentDisabledVideosBlockedGm = () => {
  return GM_getValue("is_comment_disabled_videos_blocked_gm", false);
};
const getReleaseTypeCardsGm = () => {
  return GM_getValue("release_type_cards_gm", []);
};
const isAutomaticScrollingGm = () => {
  return GM_getValue("is_automatic_scrolling_gm", true);
};
const isRoomListAdaptiveGm = () => {
  return GM_getValue("is_room_list_adaptive_gm", false);
};
const isDelLivePageRightSidebarGm = () => {
  return GM_getValue("is_del_live_page_right_sidebar_gm", true);
};
const isRoomBackgroundHideGm = () => {
  return GM_getValue("is_room_background_hide_gm", false);
};
const isHideLiveGiftPanelGm = () => {
  return GM_getValue("is_room_background_hide_gm", false);
};
const bGateClearListNonVideoGm = () => {
  return GM_getValue("b_gate_clear_list_non_video_gm", false);
};
const isDelLiveBottomBannerAdGm = () => {
  return GM_getValue("is_del_live_bottom_banner_ad_val_gm", true);
};
var localMKData = {
  getTripleRate,
  isTripleRateBlockingStatus,
  setBorderColor,
  getBorderColor,
  setOutputInformationFontColor,
  getOutputInformationFontColor,
  setHighlightInformationColor,
  getHighlightInformationColor,
  getBOnlyTheHomepageIsBlocked,
  getAdaptationBAppCommerce,
  setDefaultColorInfo,
  isCompatible_BEWLY_BEWLY,
  isDiscardOldCommentAreas,
  isShowRightTopMainButSwitch,
  isFirstFullDisplay,
  isHalfHiddenIntervalAfterInitialDisplay,
  isDelPlayerPageRightVideoList,
  bFuzzyAndRegularMatchingWordsToLowercase: bFuzzyAndRegularMatchingWordsToLowercase$1,
  isDisableNetRequestsBvVideoInfo,
  isBlockFollowed,
  isUpOwnerExclusive,
  isGenderRadioVal,
  isVipTypeRadioVal,
  isSeniorMember,
  isCopyrightRadio,
  isDelBottomComment,
  isBlockVerticalVideo,
  isCheckTeamMember,
  getVideoLikeRate,
  isVideoLikeRateBlockingStatus,
  isCoinLikesRatioRateBlockingStatus,
  getCoinLikesRatioRate,
  isCoinLikesRatioRateDisabled,
  isInteractiveRateBlockingStatus,
  getInteractiveRate,
  getUidRangeMasking,
  isUidRangeMaskingStatus,
  isTimeRangeMaskingStatus,
  isDelPlayerEndingPanel,
  getTimeRangeMaskingArr,
  getCommentWordLimitVal
};const group_url = "http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=tFU0xLt1uO5u5CXI2ktQRLh_XGAHBl7C&authKey=KAf4rICQYjfYUi66WelJAGhYtbJLILVWumOm%2BO9nM5fNaaVuF9Iiw3dJoPsVRUak&noverify=0&group_code=876295632";
const scriptCat_js_url = "https://scriptcat.org/zh-CN/script-show-page/1029";
const b_url = "https://space.bilibili.com/473239155";
const common_question_url = "https://docs.qq.com/doc/DSlJNR1NVcGR3eEto";
const update_log_url = "https://docs.qq.com/doc/DSnhjSVZmRkpCd0Nj";
const adaptationBAppCommerce = localMKData.getAdaptationBAppCommerce();
const compatibleBEWLYBEWLY = localMKData.isCompatible_BEWLY_BEWLY();
const bOnlyTheHomepageIsBlocked = localMKData.getBOnlyTheHomepageIsBlocked();
const httpLocalHost = "http://localhost:3000";
const returnTempVal = { state: false };
const promiseResolve = Promise.resolve();
const promiseReject = Promise.reject();
var globalValue = {
  group_url,
  scriptCat_js_url,
  b_url,
  common_question_url,
  update_log_url,
  adaptationBAppCommerce,
  compatibleBEWLYBEWLY,
  bOnlyTheHomepageIsBlocked
};GM_registerMenuCommand("主面板", () => {
  eventEmitter.send("主面板开关");
}, "Q");
GM_registerMenuCommand("脚本猫脚本更新页", () => {
  GM_openInTab(globalValue.scriptCat_js_url);
}, "E");
GM_registerMenuCommand("gf脚本更新页", () => {
  GM_openInTab("https://greasyfork.org/zh-CN/scripts/461382");
}, "W");
GM_registerMenuCommand("加入or反馈", () => {
  GM_openInTab(globalValue.group_url);
}, "T");
GM_registerMenuCommand("常见问题", () => {
  GM_openInTab(globalValue.common_question_url);
}, "Y");
GM_registerMenuCommand("更新日志", () => {
  GM_openInTab(globalValue.update_log_url);
}, "U");const start = () => {
  let loop = false;
  let msg;
  if (!Vue) {
    loop = true;
    msg = "Vue is not defined，Vue未定义，请检查是否引入了Vue";
  }
  if (!Dexie) {
    loop = true;
    msg = "Dexie is not defined，Dexie未定义，请检查是否引入了Dexie";
  }
  if (loop) {
    if (confirm("外部库验证失败:" + msg + `
请联系作者核查问题
可通过点击确定按钮跳转。
脚本主页信息中，有相关解决文档
或通过脚本信息底下联系方式联系作者解决`)) {
      GM_openInTab(globalValue.scriptCat_js_url);
      GM_openInTab(globalValue.group_url);
    }
    throw new Error(`外部库验证失败:${msg}`);
  }
};
start();var defCss = `
.el-vertical-center {
    display: flex;
    justify-content: center;
}
.el-horizontal-center {
    display: flex;
    align-items: center;
}
.el-horizontal-right {
    display: flex;
    justify-content: flex-end;
}
.el-horizontal-left {
    display: flex;
    justify-content: flex-start;
}
.el-horizontal-outside {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.height-auto.el-divider.el-divider--vertical {
    height: auto !important;
}
.margin-top-bottom10.el-divider.el-divider--horizontal {
    margin: 10px 0;
}
`;var gzStyleCss = `button[gz_type] {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    border: 1px solid #dcdfe6;
    color: #F07775;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    transition: .1s;
    font-weight: 500;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    padding: 10px 20px;
    font-size: 14px;
    border-radius: 8px;
}
button[gz_type="primary"] {
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
}
button[gz_type="success"] {
    color: #fff;
    background-color: #67c23a;
    border-color: #67c23a;
}
button[gz_type="info"] {
    color: #fff;
    background-color: #909399;
    border-color: #909399;
}
button[gz_type="warning"] {
    color: #fff;
    background-color: #e6a23c;
    border-color: #e6a23c;
}
button[gz_type="danger"] {
    color: #fff;
    background-color: #f56c6c;
    border-color: #f56c6c;
}
button[border] {
    border-radius: 20px;
    padding: 12px 23px;
}
input[gz_type] {
    font-family: 'Arial', sans-serif; 
    font-size: 16px; 
    padding: 10px; 
    margin: 10px; 
    border: 1px solid #ccc; 
    border-radius: 4px; 
    outline: none; 
}
input[gz_type]:focus {
    border-color: #007bff; 
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.3); 
}
select {
    font-family: 'Arial', sans-serif; 
    font-size: 16px; 
    padding: 10px; 
    margin: 10px; 
    border: 1px solid #ccc; 
    border-radius: 4px; 
    outline: none; 
    background-color: white; 
    color: #333; 
}
select:focus {
    border-color: #007bff; 
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.3); 
}
select:disabled {
    background-color: #f1f1f1; 
    border-color: #ccc; 
    color: #888; 
}
button:hover {
    border-color: #646cff;
}
button[gz_type]:focus,
button[gz_type]:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
}
`;var __typeError$6 = (msg) => {
  throw TypeError(msg);
};
var __accessCheck$6 = (obj, member, msg) => member.has(obj) || __typeError$6("Cannot " + msg);
var __privateGet$6 = (obj, member, getter) => (__accessCheck$6(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd$6 = (obj, member, value) => member.has(obj) ? __typeError$6("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var _mapCache;
class ValueCache {
  constructor() {
    __privateAdd$6(this, _mapCache,  new Map());
  }
  set(key, value) {
    __privateGet$6(this, _mapCache).set(key, value);
    return value;
  }
  get(key, defaultValue = null) {
    const newVar = __privateGet$6(this, _mapCache).get(key);
    if (newVar) {
      return newVar;
    }
    return defaultValue;
  }
  getAll() {
    return __privateGet$6(this, _mapCache);
  }
}
_mapCache = new WeakMap();
const valueCache = new ValueCache();const wait = (milliseconds = 1e3) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};
const fileDownload = (content, fileName) => {
  const element = document.createElement("a");
  element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content));
  element.setAttribute("download", fileName);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
function saveTextAsFile(text, filename = "data.txt") {
  const blob = new Blob([text], { type: "text/plain" });
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  setTimeout(() => {
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(downloadLink.href);
  }, 100);
}
const handleFileReader = (event) => {
  return new Promise((resolve, reject) => {
    const file = event.target.files[0];
    if (!file) {
      reject("未读取到文件");
      return;
    }
    let reader = new FileReader();
    reader.onload = (e) => {
      const fileContent = e.target.result;
      resolve({ file, content: fileContent });
      reader = null;
    };
    reader.readAsText(file);
  });
};
const isIterable = (obj) => {
  return obj != null && typeof obj[Symbol.iterator] === "function";
};
const toTimeString = () => {
  return ( new Date()).toLocaleString();
};
function debounce(func, wait2 = 1e3) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait2);
  };
}
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
const parseUrl = (urlString) => {
  const url = new URL(urlString);
  const pathSegments = url.pathname.split("/").filter((segment) => segment !== "");
  const searchParams = new URLSearchParams(url.search.slice(1));
  const queryParams = {};
  for (const [key, value] of searchParams.entries()) {
    queryParams[key] = value;
  }
  return {
    protocol: url.protocol,
    hostname: url.hostname,
    port: url.port,
    pathname: url.pathname,
    pathSegments,
    search: url.search,
    queryParams,
    hash: url.hash
  };
};
const getLocalStorage = (key, isList = false, defaultValue = null) => {
  const item = localStorage.getItem(key);
  if (item === null) {
    return defaultValue;
  }
  if (isList) {
    try {
      return JSON.parse(item);
    } catch (e) {
      console.error(`读取localStorage时尝试转换${key}的值失败`, e);
      return defaultValue;
    }
  }
  return item;
};
const formatTimestamp = (timestamp, options = {}) => {
  if (!timestamp || isNaN(timestamp)) return "Invalid Timestamp";
  const ts = String(timestamp).length === 10 ? +timestamp * 1e3 : +timestamp;
  const timezoneOffset = (options.timezone || 0) * 60 * 60 * 1e3;
  const date = new Date(ts + timezoneOffset);
  if (isNaN(date.getTime())) return "Invalid Date";
  const timeObj = {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    hours: date.getUTCHours(),
    minutes: date.getUTCMinutes(),
    seconds: date.getUTCSeconds()
  };
  if (options.returnObject) return timeObj;
  const format = options.format || "YYYY-MM-DD HH:mm:ss";
  const pad = (n) => n.toString().padStart(2, "0");
  return format.replace(/YYYY/g, timeObj.year).replace(/YY/g, String(timeObj.year).slice(-2)).replace(/MM/g, pad(timeObj.month)).replace(/M/g, timeObj.month).replace(/DD/g, pad(timeObj.day)).replace(/D/g, timeObj.day).replace(/HH/g, pad(timeObj.hours)).replace(/H/g, timeObj.hours).replace(/mm/g, pad(timeObj.minutes)).replace(/m/g, timeObj.minutes).replace(/ss/g, pad(timeObj.seconds)).replace(/s/g, timeObj.seconds);
};
const calculateLikeRate = (likeCount, viewCount) => {
  if (viewCount === 0) {
    return 0;
  }
  return parseInt(likeCount / viewCount * 100);
};
const calculateInteractionRate = (danmaku, reply, view) => {
  return parseInt((danmaku + reply) / view * 100);
};
const calculateTripleRate = (favorite, coin, share, view) => {
  return parseInt((favorite + coin + share) / view * 100);
};
const calculateCoinLikesRatioRate = (coin, like) => {
  return parseInt(coin / like * 100);
};
const addGzStyle = (el, insertionPosition = document.head) => {
  const styleEl = el.querySelector("style[gz_style]");
  if (styleEl !== null) {
    console.log("已有gz_style样式，故不再插入该样式内容");
    return;
  }
  const style = document.createElement("style");
  style.setAttribute("gz_style", "");
  style.textContent = gzStyleCss;
  insertionPosition.appendChild(style);
};
function initVueApp(el, App, props = {}) {
  return new Vue({
    render: (h) => h(App, { props })
  }).$mount(el);
}
function getFutureTimestamp(days = 0, hours = 0, minutes = 0, seconds = 0) {
  const now =  new Date();
  const ms = days * 24 * 60 * 60 * 1e3 + hours * 60 * 60 * 1e3 + minutes * 60 * 1e3 + seconds * 1e3;
  const future = new Date(now.getTime() + ms);
  return future.getTime();
}
const getJQuery = async () => {
  return new Promise((resolve) => {
    const $ = valueCache.get("$");
    if ($) {
      resolve($);
      return;
    }
    const i1 = setInterval(() => {
      const $2 = unsafeWindow["$"];
      if ($2) {
        valueCache.set("$", $2);
        clearInterval(i1);
        resolve($2);
      }
    }, 1e3);
  });
};
var defUtil$1 = {
  wait,
  fileDownload,
  toTimeString,
  getJQuery,
  debounce,
  throttle,
  parseUrl,
  handleFileReader,
  isIterable,
  getLocalStorage,
  formatTimestamp,
  calculateLikeRate,
  calculateInteractionRate,
  calculateTripleRate,
  calculateCoinLikesRatioRate
};const mk_db = new Dexie("mk-db");
mk_db.version(1).stores({
  videoInfos: "bv,tags,userInfo,videoInfo,expiresMaxAge"
});
const addVideoData = async (bv, data) => {
  const { tags, userInfo, videoInfo } = data;
  try {
    await mk_db.videoInfos.add({
      bv,
      tags,
      userInfo,
      videoInfo,
      expiresMaxAge: getFutureTimestamp(getExpiresMaxAgeGm())
    });
  } catch (e) {
    console.warn(`添加视频数据失败`, bv, data, e);
    return false;
  }
  return true;
};
const bulkImportVideoInfos = async (friendsData) => {
  try {
    const lastKeyItem = await mk_db.videoInfos.bulkPut(friendsData);
    console.info("批量导入成功，最后一个插入的主键:", lastKeyItem);
    return { state: true, lastKeyItem };
  } catch (error) {
    console.error("批量导入时出错:", error);
    return { state: false, error };
  }
};
const getVideoInfo = async () => {
  return await mk_db.videoInfos.toArray();
};
const getVideoInfoCount = async () => {
  return await mk_db.videoInfos.count();
};
const findVideoInfoByBv = async (bv) => {
  const data = await mk_db.videoInfos.get(bv);
  return data ? data : null;
};
const clearVideoInfosTable = async () => {
  try {
    await mk_db.videoInfos.clear();
    return true;
  } catch (e) {
    console.log("清除videoInfos表失败", e);
    return false;
  }
};
const checkVideoInfoExpire = async () => {
  console.log("开始检查视频缓存表过期数据");
  const list = await getVideoInfo();
  const currentTimestamp = ( new Date()).getTime();
  for (let item of list) {
    const { bv, expiresMaxAge = -1 } = item;
    if (expiresMaxAge === -1) {
      await mk_db.videoInfos.update(bv, { expiresMaxAge: getFutureTimestamp(7) });
      console.log(`更新bv号为${bv}的过期时间戳为7天后`, item);
      continue;
    }
    if (currentTimestamp > expiresMaxAge) {
      await mk_db.videoInfos.delete(bv);
      console.log(`删除bv号为${bv}的过期数据`, item, currentTimestamp);
    }
  }
  console.log("检查视频缓存表过期数据结束");
};
setTimeout(async () => {
  await checkVideoInfoExpire();
}, 1e3 * 15);
const delVideoInfoItem = async (bv) => {
  try {
    const item = await findVideoInfoByBv(bv);
    if (!item) return false;
    await mk_db.videoInfos.delete(bv);
    return true;
  } catch (e) {
    return false;
  }
};
const bulkDelVideoInfoItem = async (bvArr) => {
  const data = { state: false, success: [], fail: [] };
  try {
    const existingItem = await mk_db.videoInfos.bulkGet(bvArr);
    const existingKeys = existingItem.filter((item) => item).map((item) => item.bv);
    if (existingKeys.length === 0) {
      data.fail = bvArr;
      return data;
    }
    data.state = true;
    data.success.push(...existingKeys);
    if (existingKeys.length !== bvArr.length) {
      data.fail.push(...bvArr.filter((item) => !existingKeys.includes(item)));
    }
    await mk_db.videoInfos.bulkDelete(bvArr);
    return data;
  } catch (e) {
    console.log("批量删除数据库中指定bv号失败:", e);
    return data;
  }
};
var bvDexie = {
  addVideoData,
  findVideoInfoByBv,
  clearVideoInfosTable,
  bulkImportVideoInfos,
  getVideoInfo,
  getVideoInfoCount,
  delVideoInfoItem,
  bulkDelVideoInfoItem
};function createAxiosLikeClient() {
  function request(config) {
    return new Promise((resolve, reject) => {
      const mergedConfig = {
        method: "GET",
        responseType: "json",
        headers: {},
        ...config
      };
      if (mergedConfig.data) {
        if (typeof mergedConfig.data === "object" && !mergedConfig.headers["Content-Type"]) {
          mergedConfig.headers["Content-Type"] = "application/json";
          mergedConfig.data = JSON.stringify(mergedConfig.data);
        }
      }
      GM_xmlhttpRequest({
        method: mergedConfig.method,
        url: mergedConfig.url,
        headers: mergedConfig.headers,
        data: mergedConfig.data,
        responseType: mergedConfig.responseType,
        onload: (response) => {
          if (response.status >= 200 && response.status < 300) {
            const responseData = mergedConfig.responseType === "json" ? tryParseJson(response.responseText) : response.responseText;
            resolve({
              data: responseData,
              status: response.status,
              headers: parseHeaders(response.responseHeaders)
            });
          } else {
            reject(createError(response, "HTTP Error"));
          }
        },
        onerror: (error) => {
          reject(createError(error, "Network Error"));
        }
      });
    });
  }
  function tryParseJson(text) {
    try {
      return JSON.parse(text);
    } catch (e) {
      console.warn("JSON 解析失败，返回原始文本");
      return text;
    }
  }
  function parseHeaders(headersString) {
    return headersString.split("\n").reduce((acc, line) => {
      const [key, value] = line.split(": ");
      if (key) acc[key.toLowerCase()] = value;
      return acc;
    }, {});
  }
  function createError(source, message) {
    return {
      message,
      status: source.status,
      data: source.responseText,
      error: source
    };
  }
  return {
    request,
    get(url, config = {}) {
      if (config.params) {
        debugger;
        const params = new URLSearchParams(config.params).toString();
        url += url.includes("?") ? `&${params}` : `?${params}`;
      }
      return this.request({
        ...config,
        method: "GET",
        url
      });
    },
    post(url, data, config = {}) {
      return this.request({
        ...config,
        method: "POST",
        url,
        data
      });
    }
  };
}
const defTmRequest = createAxiosLikeClient();var script$C = {
  data() {
    return {
      hostname: window.location.hostname,
      expiresMaxAgeVal: 7
    };
  },
  methods: {
    outDbDataBut() {
      bvDexie.getVideoInfo().then((data) => {
        if (data.length === 0) {
          this.$message("当前域名下没有缓存视频数据");
          return;
        }
        data = {
          hostName: this.hostname,
          size: data.length,
          data
        };
        defUtil$1.fileDownload(JSON.stringify(data, null, 4), "mk-db-videoInfos-cache.json");
        this.$message("已导出当前域名的缓存数据");
        console.log(data);
      });
    },
    handleFileUpload(event) {
      defUtil$1.handleFileReader(event).then((data) => {
        const { content } = data;
        let parse;
        try {
          parse = JSON.parse(content);
        } catch (e) {
          this.$message("文件内容有误");
          return;
        }
        const { hostName = null, videoInfos = [] } = parse;
        if (!hostName) {
          this.$message("hostName字段不存在");
          return;
        }
        if (!defUtil$1.isIterable(videoInfos)) {
          this.$message("文件内容有误，非可迭代的数组！");
          return;
        }
        if (videoInfos.length === 0) {
          this.$message("tags数据为空");
          return;
        }
        for (let item of videoInfos) {
          if (!item["bv"]) {
            this.$message("bv字段不存在");
            return;
          }
          if (!item["tags"]) {
            this.$message("tags字段不存在");
            return;
          }
          if (!item["userInfo"]) {
            this.$message("userInfo字段不存在");
            return;
          }
          if (!item["videoInfo"]) {
            this.$message("videoInfo字段不存在");
            return;
          }
        }
        bvDexie.bulkImportVideoInfos(videoInfos).then((bool) => {
          if (bool) {
            this.$message("导入成功");
          } else {
            this.$message("导入失败");
          }
        });
      });
    },
    inputFIleBut() {
      this.$refs.inputDemo.click();
    },
    clearPageVideoCacheDataBut() {
      this.$confirm("是否清空当前域名下的tags数据").then(() => {
        bvDexie.clearVideoInfosTable().then((bool) => {
          if (bool) {
            this.$message("已清空当前域名下的视频缓存数据");
          } else {
            this.$message("清空失败");
          }
        });
      });
    },
    lookContentBut() {
      this.$confirm("当数据量过大时，可能卡顿，等待时间会较为长，是要继续吗").then(async () => {
        const loading = this.$loading({ text: "获取中..." });
        const r = await bvDexie.getVideoInfo();
        loading.close();
        eventEmitter.send("展示内容对话框", JSON.stringify(r));
        this.$message("获取成功");
      });
    },
    outToConsoleBut() {
      bvDexie.getVideoInfo().then((r) => {
        this.$alert("已导出至控制台上，可通过f12等方式查看");
        const hostname = this.hostname;
        console.log(`${hostname}的视频数据===start`);
        console.log(r);
        console.log(`${hostname}的视频数据=====end`);
      });
    },
    async outToLocalServerBut() {
      let loading = this.$loading({ text: "请求中..." });
      try {
        await defTmRequest.get(httpLocalHost);
      } catch (e) {
        console.warn(e);
        this.$alert("请先运行本地localhost服务器，并开放3000端口");
        return;
      } finally {
        loading.close();
      }
      loading = this.$loading({ text: "获取缓存数据中..." });
      const r = await bvDexie.getVideoInfo();
      loading.close();
      if (r.length === 0) {
        this.$alert("当前域名下没有缓存视频数据");
        return;
      }
      loading = this.$loading({ text: "请求中..." });
      defTmRequest.post(httpLocalHost + "/data", r).then((res) => {
        console.log(res);
        if (res.status !== 200) {
          this.$alert("服务器返回错误");
          return;
        }
        this.$alert(res.data.msg);
      }).catch((e) => {
        this.$alert("请求失败");
        console.warn(e);
      }).finally(() => loading.close());
    },
    lookContentLenBut() {
      bvDexie.getVideoInfoCount().then((len) => {
        this.$alert(`数据量${len}`);
      });
    },
    batchDelBut() {
      this.$prompt("请输入删除的bv号，多个bv号用逗号隔开", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(async ({ value }) => {
        value = value?.trim() || null || "";
        if (value === null) return;
        const bvs = value.split(",");
        if (bvs.length === 1) {
          const bool = await bvDexie.delVideoInfoItem(bvs[0]);
          if (bool) {
            this.$message.success(`删除${value}的视频缓存数据成功`);
          } else {
            this.$message.warning(`删除失败，未找到${value}的视频缓存数据`);
          }
          return;
        }
        const data = await bvDexie.bulkDelVideoInfoItem(bvs);
        if (data.state) {
          if (data.success.length === bvs.length) {
            this.$alert(`删除${data.success.join(",")}的视频缓存数据成功`, {
              type: "success"
            });
          } else {
            this.$alert(`删除${data.success.join(",")}的视频缓存数据成功，${data.fail.join(",")}的视频缓存数据未找到`, {
              type: "warning"
            });
          }
        } else {
          this.$message.warning(`删除失败,错误信息请看控制台`);
        }
      });
    },
    modifyCacheTimeoutBut() {
      this.$prompt("请输入缓存超时时间，单位为天", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputType: "number",
        inputPattern: /^\d+$/,
        inputValidator: (value) => {
          if (!/^\d+$/.test(value)) {
            return "请输入有效的整数";
          }
          const num = parseInt(value);
          if (num < 1) {
            return "不能低于1天";
          }
          if (num <= 365) {
            return true;
          }
          return "不能超出365天";
        }
      }).then(async ({ value }) => {
        GM_setValue("expires_max_age_gm", parseInt(value));
        this.expiresMaxAgeVal = value;
        this.$message.success(`已修改视频缓存超时时间为${value}天`);
      });
    }
  }
};function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier , shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    const options = typeof script === 'function' ? script.options : script;
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
    }
    return script;
}
const __vue_script__$C = script$C;
var __vue_render__$C = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c(
        "el-card",
        {
          scopedSlots: _vm._u([
            {
              key: "header",
              fn: function () {
                return [_vm._v("说明")]
              },
              proxy: true,
            },
          ]),
        },
        [
          _vm._v(" "),
          _c("div", [_vm._v("1.每个域名中的缓存数据不同")]),
          _vm._v(" "),
          _c("div", [_vm._v("2.仅仅支持导入json格式")]),
          _vm._v(" "),
          _c("div", [_vm._v("3.下面导入默认追加模式")]),
          _vm._v(" "),
          _c(
            "div",
            [
              _vm._v("4.当前域名\n      "),
              _c("el-tag", [_vm._v(_vm._s(_vm.hostname))]),
            ],
            1
          ),
          _vm._v(" "),
          _c("div", [
            _vm._v("5.缓存超时时间:" + _vm._s(_vm.expiresMaxAgeVal) + "天"),
          ]),
        ]
      ),
      _vm._v(" "),
      _c(
        "el-card",
        {
          scopedSlots: _vm._u([
            {
              key: "header",
              fn: function () {
                return [_vm._v("操作")]
              },
              proxy: true,
            },
          ]),
        },
        [
          _vm._v(" "),
          _c("el-button", { on: { click: _vm.modifyCacheTimeoutBut } }, [
            _vm._v("修改缓存超时时间"),
          ]),
          _vm._v(" "),
          _c("el-button", { on: { click: _vm.inputFIleBut } }, [
            _vm._v("追加导入视频缓存数据"),
          ]),
          _vm._v(" "),
          _c("input", {
            ref: "inputDemo",
            staticStyle: { display: "none" },
            attrs: { accept: "application/json", type: "file" },
            on: { change: _vm.handleFileUpload },
          }),
          _vm._v(" "),
          _c("el-button", { on: { click: _vm.clearPageVideoCacheDataBut } }, [
            _vm._v("清空当前域名的视频缓存数据"),
          ]),
          _vm._v(" "),
          _c("el-button", { on: { click: _vm.lookContentBut } }, [
            _vm._v("查看内容"),
          ]),
          _vm._v(" "),
          _c("el-button", { on: { click: _vm.lookContentLenBut } }, [
            _vm._v("查看数据量"),
          ]),
          _vm._v(" "),
          _c(
            "el-button",
            { attrs: { type: "warning" }, on: { click: _vm.batchDelBut } },
            [_vm._v("批量删除")]
          ),
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "el-card",
        {
          scopedSlots: _vm._u([
            {
              key: "header",
              fn: function () {
                return [_vm._v("导出")]
              },
              proxy: true,
            },
          ]),
        },
        [
          _vm._v(" "),
          _c("el-button", { on: { click: _vm.outDbDataBut } }, [
            _vm._v("至文件"),
          ]),
          _vm._v(" "),
          _c("el-button", { on: { click: _vm.outToConsoleBut } }, [
            _vm._v("至控制台"),
          ]),
          _vm._v(" "),
          _c("el-button", { on: { click: _vm.outToLocalServerBut } }, [
            _vm._v("至本地服务器"),
          ]),
        ],
        1
      ),
    ],
    1
  )
};
var __vue_staticRenderFns__$C = [];
__vue_render__$C._withStripped = true;
  const __vue_inject_styles__$C = undefined;
  const __vue_component__$C = normalizeComponent(
    { render: __vue_render__$C, staticRenderFns: __vue_staticRenderFns__$C },
    __vue_inject_styles__$C,
    __vue_script__$C);var script$B = {
  data() {
    return {
      input_color: null,
      showRightTopMainButSwitch: localMKData.isShowRightTopMainButSwitch(),
      isFirstFullDisplay: localMKData.isFirstFullDisplay(),
      isHalfHiddenIntervalAfterInitialDisplay: localMKData.isHalfHiddenIntervalAfterInitialDisplay(),
      devToolsInputVal: "",
      drawerShortcutKeyVal: getDrawerShortcutKeyGm(),
      theKeyPressedKeyVal: ""
    };
  },
  methods: {
    setBorderColorBut() {
      this.$confirm("是否设置面板边框颜色", "提示").then(() => {
        localMKData.setBorderColor(this.input_color);
        this.$alert("已设置面板边框颜色，刷新生效");
      });
    },
    setDefFontColorForOutputInformationBut() {
      this.$confirm("是否设置输出信息默认字体颜色", "提示").then(() => {
        localMKData.setOutputInformationFontColor(this.input_color);
        this.$alert("已设置输出信息默认字体颜色，刷新生效");
      });
    },
    setTheFontColorForOutputInformationBut() {
      this.$confirm("是要设置输出信息高亮字体颜色吗？").then(() => {
        localMKData.setHighlightInformationColor(this.input_color);
        this.$alert("已设置输出信息高亮字体颜色，刷新生效");
      });
    },
    setDefInfoBut() {
      localMKData.setDefaultColorInfo();
      this.$alert("已恢复默认颜色，刷新生效");
    },
    changeDevToolsInput() {
      const toolsInputVal = this.devToolsInputVal;
      if (toolsInputVal.trim()) return;
      eventEmitter.send(toolsInputVal);
    },
    setDrawerShortcutKeyBut() {
      const theKeyPressedKey = this.theKeyPressedKeyVal;
      const drawerShortcutKey = this.drawerShortcutKeyVal;
      if (drawerShortcutKey === theKeyPressedKey) {
        this.$message("不需要重复设置");
        return;
      }
      GM_setValue("drawer_shortcut_key_gm", theKeyPressedKey);
      this.$notify({ message: "已设置打开关闭主面板快捷键", type: "success" });
      this.drawerShortcutKeyVal = theKeyPressedKey;
    }
  },
  watch: {
    showRightTopMainButSwitch(newVal) {
      GM_setValue("showRightTopMainButSwitch", newVal === true);
      eventEmitter.send("显隐主面板开关", newVal);
    },
    isFirstFullDisplay(newVal) {
      GM_setValue("isFirstFullDisplay", newVal === true);
    },
    isHalfHiddenIntervalAfterInitialDisplay(newBool) {
      GM_setValue("is_half_hidden_interval_after_initial_display", newBool === true);
    }
  },
  created() {
    eventEmitter.on("event-keydownEvent", (event) => {
      this.theKeyPressedKeyVal = event.key;
    });
  }
};
const __vue_script__$B = script$B;
var __vue_render__$B = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c(
        "el-card",
        {
          attrs: { shadow: "never" },
          scopedSlots: _vm._u([
            {
              key: "header",
              fn: function () {
                return [_c("span", [_vm._v("颜色设置")])]
              },
              proxy: true,
            },
          ]),
        },
        [
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "el-horizontal-center" },
            [
              _vm._v("\n      选择器\n      "),
              _c("el-color-picker", {
                model: {
                  value: _vm.input_color,
                  callback: function ($$v) {
                    _vm.input_color = $$v;
                  },
                  expression: "input_color",
                },
              }),
            ],
            1
          ),
          _vm._v(" "),
          _c("el-button", { on: { click: _vm.setBorderColorBut } }, [
            _vm._v("设置边框色"),
          ]),
          _vm._v(" "),
          _c(
            "el-button",
            { on: { click: _vm.setDefFontColorForOutputInformationBut } },
            [_vm._v("设置输出信息默认字体色")]
          ),
          _vm._v(" "),
          _c(
            "el-button",
            { on: { click: _vm.setTheFontColorForOutputInformationBut } },
            [_vm._v("设置输出信息高亮字体色")]
          ),
          _vm._v(" "),
          _c(
            "el-tooltip",
            { attrs: { content: "刷新页面生效" } },
            [
              _c("el-button", { on: { click: _vm.setDefInfoBut } }, [
                _vm._v("恢复默认"),
              ]),
            ],
            1
          ),
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "el-card",
        {
          attrs: { shadow: "never" },
          scopedSlots: _vm._u([
            {
              key: "header",
              fn: function () {
                return [_c("span", [_vm._v("页面右侧悬浮按钮设置")])]
              },
              proxy: true,
            },
          ]),
        },
        [
          _vm._v(" "),
          _c("el-switch", {
            attrs: { "active-text": "显示按钮" },
            model: {
              value: _vm.showRightTopMainButSwitch,
              callback: function ($$v) {
                _vm.showRightTopMainButSwitch = $$v;
              },
              expression: "showRightTopMainButSwitch",
            },
          }),
          _vm._v(" "),
          _c(
            "el-tooltip",
            {
              attrs: {
                content: "页面每次加载完之后是否完整展示按钮，否则半隐藏",
              },
            },
            [
              _c("el-switch", {
                attrs: { "active-text": "初次完整显示" },
                model: {
                  value: _vm.isFirstFullDisplay,
                  callback: function ($$v) {
                    _vm.isFirstFullDisplay = $$v;
                  },
                  expression: "isFirstFullDisplay",
                },
              }),
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "el-tooltip",
            {
              attrs: {
                content:
                  "页面每次加载完之后如完整展示按钮时，间隔10秒后半隐藏处理",
              },
            },
            [
              _c("el-switch", {
                attrs: { "active-text": "初次显示后间隔半隐藏" },
                model: {
                  value: _vm.isHalfHiddenIntervalAfterInitialDisplay,
                  callback: function ($$v) {
                    _vm.isHalfHiddenIntervalAfterInitialDisplay = $$v;
                  },
                  expression: "isHalfHiddenIntervalAfterInitialDisplay",
                },
              }),
            ],
            1
          ),
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "el-card",
        {
          attrs: { shadow: "never" },
          scopedSlots: _vm._u([
            {
              key: "header",
              fn: function () {
                return [_c("span", [_vm._v("快捷键")])]
              },
              proxy: true,
            },
          ]),
        },
        [
          _vm._v(" "),
          _c("div", [
            _vm._v("1.默认情况下，按键盘tab键上的~键为展开关闭主面板"),
          ]),
          _vm._v(" "),
          _c(
            "div",
            [
              _vm._v("2.当前展开关闭主面板快捷键：\n      "),
              _c("el-tag", [_vm._v(_vm._s(_vm.drawerShortcutKeyVal))]),
            ],
            1
          ),
          _vm._v("\n    当前按下的键\n    "),
          _c("el-tag", [_vm._v(_vm._s(_vm.theKeyPressedKeyVal))]),
          _vm._v(" "),
          _c("el-button", { on: { click: _vm.setDrawerShortcutKeyBut } }, [
            _vm._v("设置打开关闭主面板快捷键"),
          ]),
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "el-card",
        {
          attrs: { shadow: "never" },
          scopedSlots: _vm._u([
            {
              key: "header",
              fn: function () {
                return [_c("span", [_vm._v("devTools")])]
              },
              proxy: true,
            },
          ]),
        },
        [
          _vm._v(" "),
          _c("el-input", {
            nativeOn: {
              keyup: function ($event) {
                if (
                  !$event.type.indexOf("key") &&
                  _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")
                ) {
                  return null
                }
                return _vm.changeDevToolsInput.apply(null, arguments)
              },
            },
            model: {
              value: _vm.devToolsInputVal,
              callback: function ($$v) {
                _vm.devToolsInputVal =
                  typeof $$v === "string" ? $$v.trim() : $$v;
              },
              expression: "devToolsInputVal",
            },
          }),
        ],
        1
      ),
    ],
    1
  )
};
var __vue_staticRenderFns__$B = [];
__vue_render__$B._withStripped = true;
  const __vue_inject_styles__$B = undefined;
  const __vue_component__$B = normalizeComponent(
    { render: __vue_render__$B, staticRenderFns: __vue_staticRenderFns__$B },
    __vue_inject_styles__$B,
    __vue_script__$B);var script$A = {
  data() {
    return {
      adaptationBAppRecommend: globalValue.adaptationBAppCommerce,
      bGateClearListNonVideoV: bGateClearListNonVideoGm(),
      compatible_BEWLY_BEWLY: globalValue.compatibleBEWLYBEWLY,
      discardOldCommentAreasV: localMKData.isDiscardOldCommentAreas()
    };
  },
  watch: {
    adaptationBAppRecommend(newVal) {
      GM_setValue("adaptation-b-app-recommend", newVal === true);
    },
    bGateClearListNonVideoV(n) {
      GM_setValue("b_gate_clear_list_non_video_gm", n);
    },
    compatible_BEWLY_BEWLY(newVal) {
      GM_setValue("compatible_BEWLY_BEWLY", newVal === true);
    },
    discardOldCommentAreasV(newVal) {
      GM_setValue("discardOldCommentAreas", newVal === true);
    }
  }
};
const __vue_script__$A = script$A;
var __vue_render__$A = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c(
        "el-card",
        {
          scopedSlots: _vm._u([
            {
              key: "header",
              fn: function () {
                return [_vm._v("说明")]
              },
              proxy: true,
            },
          ]),
        },
        [
          _vm._v(" "),
          _c("div", [
            _vm._v(
              "如果用户没有安装并使用对应脚本或插件，就不要开启相关兼容选项"
            ),
          ]),
        ]
      ),
      _vm._v(" "),
      _c(
        "el-card",
        {
          scopedSlots: _vm._u([
            {
              key: "header",
              fn: function () {
                return [_vm._v("Bilibili-Gate脚本(bilibili-app-recommend)")]
              },
              proxy: true,
            },
          ]),
        },
        [
          _vm._v(" "),
          _c("el-switch", {
            attrs: { "active-text": "首页屏蔽适配" },
            model: {
              value: _vm.adaptationBAppRecommend,
              callback: function ($$v) {
                _vm.adaptationBAppRecommend = $$v;
              },
              expression: "adaptationBAppRecommend",
            },
          }),
          _vm._v(" "),
          _c("el-switch", {
            attrs: {
              "active-text": "清空列表非视频元素",
              title: "刷新页面后生效",
            },
            model: {
              value: _vm.bGateClearListNonVideoV,
              callback: function ($$v) {
                _vm.bGateClearListNonVideoV = $$v;
              },
              expression: "bGateClearListNonVideoV",
            },
          }),
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "el-card",
        {
          scopedSlots: _vm._u([
            {
              key: "header",
              fn: function () {
                return [_vm._v("Bewly插件(BewlyBewly和BewlyCat)")]
              },
              proxy: true,
            },
          ]),
        },
        [
          _vm._v(" "),
          _c("el-switch", {
            attrs: { "active-text": "首页适配" },
            model: {
              value: _vm.compatible_BEWLY_BEWLY,
              callback: function ($$v) {
                _vm.compatible_BEWLY_BEWLY = $$v;
              },
              expression: "compatible_BEWLY_BEWLY",
            },
          }),
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "el-card",
        {
          scopedSlots: _vm._u([
            {
              key: "header",
              fn: function () {
                return [_vm._v("评论区")]
              },
              proxy: true,
            },
          ]),
        },
        [
          _vm._v(
            "\n    使用之后需刷新对应页面才可生效，勾选即评论区使用新版获取方式，不再使用旧版方式\n    "
          ),
          _c(
            "div",
            [
              _c("el-switch", {
                attrs: { "active-text": "弃用旧版评论区处理" },
                model: {
                  value: _vm.discardOldCommentAreasV,
                  callback: function ($$v) {
                    _vm.discardOldCommentAreasV = $$v;
                  },
                  expression: "discardOldCommentAreasV",
                },
              }),
            ],
            1
          ),
        ]
      ),
    ],
    1
  )
};
var __vue_staticRenderFns__$A = [];
__vue_render__$A._withStripped = true;
  const __vue_inject_styles__$A = undefined;
  const __vue_component__$A = normalizeComponent(
    { render: __vue_render__$A, staticRenderFns: __vue_staticRenderFns__$A },
    __vue_inject_styles__$A,
    __vue_script__$A);var script$z = {
  data() {
    return {
      dialogVisible: false,
      content: ""
    };
  },
  methods: {
    handleClose(done) {
      this.$confirm("确认关闭？").then((_) => {
        done();
      }).catch((_) => {
      });
    }
  },
  created() {
    eventEmitter.on("展示内容对话框", (newContent) => {
      this.content = newContent;
      this.$message("已更新内容");
      this.dialogVisible = true;
    });
  }
};
const __vue_script__$z = script$z;
var __vue_render__$z = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c(
        "el-dialog",
        {
          attrs: {
            "before-close": _vm.handleClose,
            fullscreen: true,
            visible: _vm.dialogVisible,
            title: "提示",
            width: "30%",
          },
          on: {
            "update:visible": function ($event) {
              _vm.dialogVisible = $event;
            },
          },
        },
        [
          _c("el-input", {
            attrs: { autosize: "", type: "textarea" },
            model: {
              value: _vm.content,
              callback: function ($$v) {
                _vm.content = $$v;
              },
              expression: "content",
            },
          }),
          _vm._v(" "),
          _c(
            "span",
            {
              staticClass: "dialog-footer",
              attrs: { slot: "footer" },
              slot: "footer",
            },
            [
              _c(
                "el-button",
                {
                  on: {
                    click: function ($event) {
                      _vm.dialogVisible = false;
                    },
                  },
                },
                [_vm._v("取 消")]
              ),
              _vm._v(" "),
              _c(
                "el-button",
                {
                  attrs: { type: "primary" },
                  on: {
                    click: function ($event) {
                      _vm.dialogVisible = false;
                    },
                  },
                },
                [_vm._v("确 定")]
              ),
            ],
            1
          ),
        ],
        1
      ),
    ],
    1
  )
};
var __vue_staticRenderFns__$z = [];
__vue_render__$z._withStripped = true;
  const __vue_inject_styles__$z = undefined;
  const __vue_component__$z = normalizeComponent(
    { render: __vue_render__$z, staticRenderFns: __vue_staticRenderFns__$z },
    __vue_inject_styles__$z,
    __vue_script__$z);const bAfterLoadingThePageOpenMainPanel = () => {
  return GM_getValue("bAfterLoadingThePageOpenMainPanel", false);
};
const isWsService = () => {
  return GM_getValue("isWsService", false);
};var video_zone = {
  "动画": [
    "MAD·AMV",
    "MMD·3D",
    "短片·手书",
    "配音",
    "手办·模玩",
    "特摄",
    "动漫杂谈"
  ],
  "番剧": [
    "资讯",
    "官方延伸",
    "完结动画"
  ],
  "国创": [
    "国产动画",
    "国产原创相关",
    "布袋戏",
    "资讯"
  ],
  "音乐": [
    "原创音乐",
    "翻唱",
    "VOCALOID·UTAU",
    "演奏",
    "MV",
    "音乐现场",
    "音乐综合",
    "乐评盘点",
    "音乐教学"
  ],
  "舞蹈": [
    "宅舞",
    "舞蹈综合",
    "舞蹈教程",
    "街舞",
    "明星舞蹈",
    "国风舞蹈"
  ],
  "游戏": [
    "单机游戏",
    "电子竞技",
    "手机游戏",
    "网络游戏",
    "桌游棋牌",
    "GMV",
    "音游"
  ],
  "知识": [
    "科学科普",
    "社科·法律·心理(原社科人文、原趣味科普人文)",
    "人文历史",
    "财经商业",
    "校园学习",
    "职业职场",
    "设计·创意",
    "野生技术协会",
    "演讲·公开课(已下线)",
    "星海(已下线)"
  ],
  "科技": [
    "数码(原手机平板)",
    "软件应用",
    "计算机技术",
    "科工机械 (原工业·工程·机械)",
    "极客DIY",
    "电脑装机(已下线)",
    "摄影摄像(已下线)"
  ],
  "运动": [
    "篮球",
    "足球",
    "健身",
    "竞技体育",
    "运动文化"
  ],
  "汽车": [
    "汽车知识科普",
    "赛车",
    "改装玩车",
    "新能源车",
    "房车",
    "摩托车",
    "购车攻略",
    "汽车生活",
    "汽车文化(已下线)",
    "汽车极客(已下线)"
  ],
  "生活": [
    "搞笑",
    "出行",
    "三农",
    "家居房产",
    "手工",
    "绘画",
    "日常",
    "亲子",
    "美食圈(重定向)",
    "动物圈(重定向)",
    "运动(重定向)",
    "汽车(重定向)"
  ],
  "美食": [
    "美食制作(原[生活]->[美食圈])",
    "美食侦探",
    "美食测评",
    "田园美食"
  ],
  "动物圈": [
    "喵星人",
    "汪星人",
    "动物二创",
    "野生动物",
    "小宠异宠"
  ],
  "鬼畜": [
    "鬼畜调教",
    "音MAD",
    "人力VOCALOID",
    "鬼畜剧场"
  ],
  "时尚": [
    "美妆护肤",
    "仿妆cos",
    "穿搭",
    "时尚潮流",
    "健身(重定向)"
  ],
  "资讯": [
    "热点",
    "环球",
    "社会"
  ],
  "广告": [],
  "娱乐": [
    "综艺",
    "娱乐杂谈",
    "粉丝创作",
    "明星综合"
  ],
  "影视": [
    "影视杂谈",
    "影视剪辑",
    "小剧场",
    "预告·资讯"
  ],
  "纪录片": [
    "人文·历史",
    "科学·探索·自然",
    "军事"
  ],
  "电影": [
    "华语电影",
    "欧美电影",
    "日本电影"
  ],
  "电视剧": [
    "国产剧"
  ]
};const findKey = (itemKey) => {
  for (let key in video_zone) {
    const arr = video_zone[key];
    if (arr.some((i) => i === itemKey)) return key;
  }
  return null;
};
var video_zoneData = { findKey };var __typeError$5 = (msg) => {
  throw TypeError(msg);
};
var __accessCheck$5 = (obj, member, msg) => member.has(obj) || __typeError$5("Cannot " + msg);
var __privateGet$5 = (obj, member, getter) => (__accessCheck$5(obj, member, "read from private field"), member.get(obj));
var __privateAdd$5 = (obj, member, value) => member.has(obj) ? __typeError$5("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var _XOR_CODE, _MASK_CODE, _MAX_AID, _BASE, _data;
class BilibiliEncoder {
  constructor() {
    __privateAdd$5(this, _XOR_CODE, 23442827791579n);
    __privateAdd$5(this, _MASK_CODE, 2251799813685247n);
    __privateAdd$5(this, _MAX_AID, 1n << 51n);
    __privateAdd$5(this, _BASE, 58n);
    __privateAdd$5(this, _data, "FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf");
  }
  av2bv(aid) {
    const bytes = ["B", "V", "1", "0", "0", "0", "0", "0", "0", "0", "0", "0"];
    let bvIndex = bytes.length - 1;
    let tmp = (__privateGet$5(this, _MAX_AID) | BigInt(aid)) ^ __privateGet$5(this, _XOR_CODE);
    while (tmp > 0) {
      bytes[bvIndex] = __privateGet$5(this, _data)[Number(tmp % BigInt(__privateGet$5(this, _BASE)))];
      tmp = tmp / __privateGet$5(this, _BASE);
      bvIndex -= 1;
    }
    [bytes[3], bytes[9]] = [bytes[9], bytes[3]];
    [bytes[4], bytes[7]] = [bytes[7], bytes[4]];
    return bytes.join("");
  }
  bv2av(bvid) {
    const bvidArr = Array.from(bvid);
    [bvidArr[3], bvidArr[9]] = [bvidArr[9], bvidArr[3]];
    [bvidArr[4], bvidArr[7]] = [bvidArr[7], bvidArr[4]];
    bvidArr.splice(0, 3);
    const tmp = bvidArr.reduce((pre, bvidChar) => pre * __privateGet$5(this, _BASE) + BigInt(__privateGet$5(this, _data).indexOf(bvidChar)), 0n);
    return Number(tmp & __privateGet$5(this, _MASK_CODE) ^ __privateGet$5(this, _XOR_CODE));
  }
}
_XOR_CODE = new WeakMap();
_MASK_CODE = new WeakMap();
_MAX_AID = new WeakMap();
_BASE = new WeakMap();
_data = new WeakMap();
const bilibiliEncoder = new BilibiliEncoder();const fetchGetBarrageBlockingWords = () => {
  return new Promise((resolve, reject) => {
    fetch("https://api.bilibili.com/x/dm/filter/user", {
      credentials: "include"
    }).then((response) => response.json()).then(({ code, data, message }) => {
      if (code !== 0) {
        reject({ state: false, msg: `请求相应内容失败：msg=${message} code=` + code });
        return;
      }
      const { rule } = data;
      const list = [];
      for (let r of rule) {
        const { type, filter, ctime } = r;
        if (type === 2) {
          continue;
        }
        list.push({ type, filter, ctime });
      }
      resolve({ state: true, data, list, msg: "获取成功" });
    });
  });
};
const fetchGetAttentionInfo = (uid) => {
  return new Promise((resolve, reject) => {
    fetch(
      "https://api.bilibili.com/x/space/acc/relation?mid=" + uid,
      { credentials: "include" }
    ).then((response) => response.json()).then((data) => {
      if (data.code === 0) {
        if (data["be_relation"].mtime === 0) ;
        resolve({ state: true, data: data.data, msg: "获取成功" });
      }
      reject({ state: false, data, msg: "获取失败" });
    }).catch((error) => {
      reject({ state: false, msg: "请求失败", error });
    });
  });
};
const fetchGetVideoInfo = async (bvId) => {
  const response = await fetch(`https://api.bilibili.com/x/web-interface/view/detail?bvid=${bvId}`);
  if (response.status !== 200) {
    eventEmitter.send("请求获取视频信息失败", response, bvId);
    return { state: false, msg: "网络请求失败", data: response };
  }
  const { code, data, message } = await response.json();
  const defData = { state: false, msg: "默认失败信息" };
  if (code !== 0) {
    defData.msg = message;
    return defData;
  }
  defData.state = true;
  defData.msg = "获取成功";
  const {
    View: {
      staff,
      tname,
      tname_v2,
      desc,
      pubdate,
      ctime,
      copyright,
      is_upower_exclusive,
      duration,
      dimension,
      stat: {
        view,
        danmaku,
        reply,
        favorite,
        coin,
        share,
        like
      }
    },
    Card: {
      follower,
      like_num,
      archive_count,
      following,
      article_count,
      card: {
        friend,
        mid: uid,
        name,
        sex,
        level_info: {
          current_level
        },
        pendant,
        nameplate,
        Official,
        official_verify,
        vip,
        sign,
        is_senior_member
      }
    },
    Tags,
    participle
  } = data;
  const videoInfo = {
    staff,
    tname,
    tname_v2,
    desc,
    pubdate,
    ctime,
    copyright,
    is_upower_exclusive,
    duration,
    view,
    danmaku,
    reply,
    favorite,
    coin,
    share,
    participle,
    dimension,
    like
  };
  const userInfo = {
    follower,
    friend,
    like_num,
    archive_count,
    article_count,
    Official,
    official_verify,
    vip,
    uid: parseInt(uid),
    name,
    sex,
    current_level,
    pendant,
    nameplate,
    following,
    sign,
    is_senior_member
  };
  const tags = [];
  for (let tag of Tags) {
    tags.push(tag["tag_name"]);
  }
  tags.unshift(tname, tname_v2);
  const findKey = video_zoneData.findKey(tname);
  if (findKey) {
    tags.unshift(findKey);
  }
  defData.data = { videoInfo, userInfo, tags };
  return defData;
};
const fetchGetVideoReplyBoxDescription = async (bv) => {
  const avid = bilibiliEncoder.bv2av(bv);
  return new Promise((resolve, reject) => {
    fetch(
      `https://api.bilibili.com/x/v2/reply/subject/description?oid=${avid}&type=1`,
      { credentials: "include" }
    ).then((response) => response.json()).then((res) => {
      try {
        const { data, code, message } = res;
        const { child_text, disabled = false } = data["base"]["input"];
        if (code !== 0) {
          reject({ state: false, message });
          return;
        }
        resolve({ state: true, message, childText: child_text, disabled });
      } catch (e) {
        reject({ state: false, e });
      }
    }).catch((e) => {
      reject({ state: false, e });
    });
  });
};
window.fetchGetVideoInfo = fetchGetVideoInfo;
window.fetchGetVideoReplyBoxDescription = fetchGetVideoReplyBoxDescription;
var bFetch = {
  fetchGetVideoInfo,
  fetchGetBarrageBlockingWords,
  fetchGetAttentionInfo
};var __typeError$4 = (msg) => {
  throw TypeError(msg);
};
var __accessCheck$4 = (obj, member, msg) => member.has(obj) || __typeError$4("Cannot " + msg);
var __privateGet$4 = (obj, member, getter) => (__accessCheck$4(obj, member, "read from private field"), member.get(obj));
var __privateAdd$4 = (obj, member, value) => member.has(obj) ? __typeError$4("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet$3 = (obj, member, value, setter) => (__accessCheck$4(obj, member, "write to private field"), member.set(obj, value), value);
var __privateMethod$1 = (obj, member, method) => (__accessCheck$4(obj, member, "access private method"), method);
var _cacheMap, _queue, _processing, _interval$2, _fetchBvData, _BvRequestQueue_instances, startProcessing_fn, processNext_fn;
class BvRequestQueue {
  constructor(options = {}) {
    __privateAdd$4(this, _BvRequestQueue_instances);
    __privateAdd$4(this, _cacheMap,  new Map());
    __privateAdd$4(this, _queue, []);
    __privateAdd$4(this, _processing, false);
    __privateAdd$4(this, _interval$2, 1e3);
    __privateAdd$4(this, _fetchBvData, null);
    __privateSet$3(this, _interval$2, options.interval ?? 1e3);
    __privateSet$3(this, _fetchBvData, options.fetchBvData ?? __privateGet$4(this, _fetchBvData));
  }
  setInterval(interval) {
    __privateSet$3(this, _interval$2, interval);
  }
  addBv(bv) {
    if (__privateGet$4(this, _cacheMap).has(bv)) {
      return __privateGet$4(this, _cacheMap).get(bv);
    }
    const promise = new Promise((resolve, reject) => {
      __privateGet$4(this, _queue).push({ bv, resolve, reject });
      if (!__privateGet$4(this, _processing)) {
        __privateMethod$1(this, _BvRequestQueue_instances, startProcessing_fn).call(this);
      }
    });
    __privateGet$4(this, _cacheMap).set(bv, promise);
    return promise;
  }
}
_cacheMap = new WeakMap();
_queue = new WeakMap();
_processing = new WeakMap();
_interval$2 = new WeakMap();
_fetchBvData = new WeakMap();
_BvRequestQueue_instances = new WeakSet();
startProcessing_fn = function() {
  __privateSet$3(this, _processing, true);
  __privateMethod$1(this, _BvRequestQueue_instances, processNext_fn).call(this);
};
processNext_fn = async function() {
  if (__privateGet$4(this, _queue).length === 0) {
    __privateSet$3(this, _processing, false);
    return;
  }
  const { bv, resolve, reject } = __privateGet$4(this, _queue).shift();
  try {
    const result = await __privateGet$4(this, _fetchBvData).call(this, bv);
    resolve(result);
  } catch (error) {
    __privateGet$4(this, _cacheMap).delete(bv);
    reject(error);
  } finally {
    if (__privateGet$4(this, _queue).length > 0) {
      await new Promise((r) => setTimeout(r, __privateGet$4(this, _interval$2)));
      __privateMethod$1(this, _BvRequestQueue_instances, processNext_fn).call(this);
    } else {
      __privateSet$3(this, _processing, false);
    }
  }
};
const videoInfoRequestQueue = new BvRequestQueue({
  fetchBvData: (bv) => {
    return new Promise((resolve, reject) => {
      bFetch.fetchGetVideoInfo(bv).then((res) => resolve(res)).catch((error) => reject(error));
    });
  }
});
const fetchGetVideoReplyBoxDescRequestQueue = new BvRequestQueue({
  fetchBvData: (bv) => {
    return new Promise((resolve, reject) => {
      bFetch.fetchGetVideoReplyBoxDescription(bv).then((res) => {
        resolve(res);
      }).catch((error) => reject(error));
    });
  }
});
const setAllRequestInterval = (interval) => {
  videoInfoRequestQueue.setInterval(interval);
  fetchGetVideoReplyBoxDescRequestQueue.setInterval(interval);
};
setAllRequestInterval(getRequestFrequencyVal() * 1e3);
var bvRequestQueue = {
  videoInfoRequestQueue,
  fetchGetVideoReplyBoxDescRequestQueue,
  setAllRequestInterval
};var script$y = {
  data() {
    return {
      bAfterLoadingThePageOpenMainPanel: bAfterLoadingThePageOpenMainPanel(),
      isWsServiceVal: isWsService(),
      localhostPageAutomaticallyOpenTheMainPanelVal: isLocalhostPageAutomaticallyOpenTheMainPanelGm()
    };
  },
  methods: {
    sendWsMsgBut() {
      this.$prompt("请输入ws消息", {
        title: "请输入ws消息",
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({ value }) => {
        eventEmitter.send("ws-send", value);
      });
    },
    printValueCacheBut() {
      console.log(valueCache.getAll());
    },
    demoBut() {
    },
    fetchGetVideoInfoBut() {
      this.$prompt("请输入视频bv号", {
        title: "请输入视频bv号",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^BV[A-Za-z0-9]{10}$/,
        inputErrorMessage: "请输入正确的视频bv号"
      }).then(({ value }) => {
        bFetch.fetchGetVideoInfo(value).then((data) => {
          console.log(data);
          debugger;
        });
      });
    },
    printEventBut() {
      console.log(eventEmitter.getEvents());
    },
    printReqIntervalQueueVal() {
      console.log(bvRequestQueue.videoInfoRequestQueue);
      console.log(bvRequestQueue.fetchGetVideoReplyBoxDescRequestQueue);
    }
  },
  watch: {
    bAfterLoadingThePageOpenMainPanel(b) {
      GM_setValue("bAfterLoadingThePageOpenMainPanel", b);
    },
    isWsServiceVal(b) {
      GM_setValue("isWsService", b);
    },
    localhostPageAutomaticallyOpenTheMainPanelVal(b) {
      GM_setValue("is_localhost_page_automatically_open_the_main_panel_gm", b);
    }
  }
};
const __vue_script__$y = script$y;
var __vue_render__$y = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c(
        "el-tabs",
        { attrs: { "tab-position": "left" } },
        [
          _c(
            "el-tab-pane",
            { attrs: { label: "基础" } },
            [
              _c(
                "el-card",
                {
                  attrs: { shadow: "never" },
                  scopedSlots: _vm._u([
                    {
                      key: "header",
                      fn: function () {
                        return [_c("span", [_vm._v("测试")])]
                      },
                      proxy: true,
                    },
                  ]),
                },
                [
                  _vm._v(" "),
                  _c("el-button", { on: { click: _vm.demoBut } }, [
                    _vm._v("测试网络请求"),
                  ]),
                  _vm._v(" "),
                  _c("el-button", { on: { click: _vm.sendWsMsgBut } }, [
                    _vm._v("向ws发送消息"),
                  ]),
                  _vm._v(" "),
                  _c("el-button", { on: { click: _vm.fetchGetVideoInfoBut } }, [
                    _vm._v("请求获取视频信息"),
                  ]),
                  _vm._v(" "),
                  _c("el-button", { on: { click: _vm.printValueCacheBut } }, [
                    _vm._v("打印valueCache值"),
                  ]),
                  _vm._v(" "),
                  _c("el-button", { on: { click: _vm.printEventBut } }, [
                    _vm._v("打印事件中心值"),
                  ]),
                  _vm._v(" "),
                  _c(
                    "el-button",
                    { on: { click: _vm.printReqIntervalQueueVal } },
                    [_vm._v("打印requestIntervalQueue值")]
                  ),
                  _vm._v(" "),
                  _c("el-divider"),
                  _vm._v(" "),
                  _c("el-switch", {
                    attrs: { "active-text": "加载完页面打开主面板" },
                    model: {
                      value: _vm.bAfterLoadingThePageOpenMainPanel,
                      callback: function ($$v) {
                        _vm.bAfterLoadingThePageOpenMainPanel = $$v;
                      },
                      expression: "bAfterLoadingThePageOpenMainPanel",
                    },
                  }),
                  _vm._v(" "),
                  _c("el-switch", {
                    attrs: { "active-text": "localhost页面自动打开主面板" },
                    model: {
                      value: _vm.localhostPageAutomaticallyOpenTheMainPanelVal,
                      callback: function ($$v) {
                        _vm.localhostPageAutomaticallyOpenTheMainPanelVal = $$v;
                      },
                      expression:
                        "localhostPageAutomaticallyOpenTheMainPanelVal",
                    },
                  }),
                  _vm._v(" "),
                  _c("el-switch", {
                    attrs: { "active-text": "开启ws服务" },
                    model: {
                      value: _vm.isWsServiceVal,
                      callback: function ($$v) {
                        _vm.isWsServiceVal = $$v;
                      },
                      expression: "isWsServiceVal",
                    },
                  }),
                ],
                1
              ),
            ],
            1
          ),
        ],
        1
      ),
    ],
    1
  )
};
var __vue_staticRenderFns__$y = [];
__vue_render__$y._withStripped = true;
  const __vue_inject_styles__$y = undefined;
  const __vue_component__$y = normalizeComponent(
    { render: __vue_render__$y, staticRenderFns: __vue_staticRenderFns__$y },
    __vue_inject_styles__$y,
    __vue_script__$y);const getUrlUID = (url) => {
  let uid;
  if (url.startsWith("http")) {
    const parseUrl = defUtil$1.parseUrl(url);
    uid = parseUrl.pathSegments[0]?.trim();
    return parseInt(uid);
  }
  const isDoYouHaveAnyParameters = url.indexOf("?");
  const lastIndexOf = url.lastIndexOf("/");
  if (isDoYouHaveAnyParameters === -1) {
    if (url.endsWith("/")) {
      const nTheIndexOfTheLastSecondOccurrenceOfTheSlash = url.lastIndexOf("/", url.length - 2);
      uid = url.substring(nTheIndexOfTheLastSecondOccurrenceOfTheSlash + 1, url.length - 1);
    } else {
      uid = url.substring(lastIndexOf + 1);
    }
  } else {
    uid = url.substring(lastIndexOf + 1, isDoYouHaveAnyParameters);
  }
  return parseInt(uid);
};
const getUrlBV = (url) => {
  let match = url.match(/video\/(.+)\//);
  if (match === null) {
    match = url.match(/video\/(.+)\?/);
  }
  if (match === null) {
    match = url.match(/video\/(.+)/);
  }
  if (match !== null) {
    return match?.[1]?.trim();
  }
  const { queryParams: { bvid = null } } = defUtil$1.parseUrl(url);
  return bvid;
};
const isDOMElement = (obj) => {
  return obj !== null && typeof obj === "object" && "nodeType" in obj;
};
const inProgressCache =  new Map();
const validationElFun = (config, selector) => {
  const element = config.doc.querySelector(selector);
  if (element === null) return null;
  return config.parseShadowRoot && element.shadowRoot ? element.shadowRoot : element;
};
const __privateValidationElFun = (config, selector) => {
  const result = config.validationElFun(config, selector);
  return isDOMElement(result) ? result : null;
};
const findElement = async (selector, config = {}) => {
  const defConfig = {
    doc: document,
    interval: 1e3,
    timeout: -1,
    parseShadowRoot: false,
    cacheInProgress: true,
    validationElFun
  };
  config = { ...defConfig, ...config };
  const result = __privateValidationElFun(config, selector);
  if (result !== null) return result;
  const cacheKey = `findElement:${selector}`;
  if (config.cacheInProgress) {
    const cachedPromise = inProgressCache.get(cacheKey);
    if (cachedPromise) {
      return cachedPromise;
    }
  }
  const p = new Promise((resolve) => {
    let timeoutId, IntervalId;
    IntervalId = setInterval(() => {
      const result2 = __privateValidationElFun(config, selector);
      if (result2 === null) return;
      resolve(result2);
    }, config.interval);
    const cleanup = () => {
      if (IntervalId) clearInterval(IntervalId);
      if (timeoutId) clearTimeout(timeoutId);
      if (config.cacheInProgress) {
        inProgressCache.delete(cacheKey);
      }
    };
    if (config.timeout > 0) {
      timeoutId = setTimeout(() => {
        resolve(null);
        cleanup();
      }, config.timeout);
    }
  });
  if (config.cacheInProgress) {
    inProgressCache.set(cacheKey, p);
  }
  return p;
};
const findElementChain = (selector, config = {}) => {
  const paths = [];
  const chainObj = {
    find(childSelector, childConfig = {}) {
      if (config.allparseShadowRoot) {
        childConfig.parseShadowRoot = true;
      }
      childSelector.trim();
      if (childSelector === "" || childSelector.search(/^\d/) !== -1) {
        throw new Error("非法的元素选择器");
      }
      const separator = config.separator ?? childConfig.separator;
      if (separator === void 0 || separator === null || separator.trim() === "") {
        paths.push({ selector: childSelector, config: childConfig });
      } else {
        const selectorArr = childSelector.split(separator);
        if (selectorArr.length === 1) {
          paths.push({ selector: childSelector, config: childConfig });
        } else {
          for (let s of selectorArr) {
            s = s.trim();
            if (s === "") continue;
            childConfig.originalSelector = childSelector;
            paths.push({ selector: s, config: childConfig });
          }
        }
      }
      return this;
    },
    get() {
      return new Promise(async (resolve) => {
        let currentDoc = null;
        for ({ selector, config } of paths) {
          const resolvedConfig = { ...config };
          if (config.doc === null || config.doc === void 0) {
            resolvedConfig.doc = currentDoc ?? document;
          } else {
            resolvedConfig.doc = config.doc;
          }
          const res = await findElement(selector, resolvedConfig);
          if (res === null) {
            continue;
          }
          currentDoc = res;
        }
        resolve(currentDoc);
      });
    }
  };
  chainObj.find(selector, config);
  return chainObj;
};
const findElements = async (selector, config = {}) => {
  const defConfig = { doc: document, interval: 1e3, timeout: -1, parseShadowRoot: false };
  config = { ...defConfig, ...config };
  return new Promise((resolve) => {
    const i1 = setInterval(() => {
      const els = config.doc.querySelectorAll(selector);
      if (els.length > 0) {
        const list = [];
        for (const el of els) {
          if (config.parseShadowRoot) {
            const shadowRoot = el?.shadowRoot;
            list.push(shadowRoot ? shadowRoot : el);
            continue;
          }
          list.push(el);
        }
        resolve(list);
        clearInterval(i1);
      }
    }, config.interval);
    if (config.timeout > 0) {
      setTimeout(() => {
        clearInterval(i1);
        resolve([]);
      }, config.timeout);
    }
  });
};
const findElementsAndBindEvents = (css, callback, config = {}) => {
  config = {
    ...{
      interval: 2e3,
      timeOut: 3e3
    },
    config
  };
  setTimeout(() => {
    findElement(css, { interval: config.interval }).then((el) => {
      el.addEventListener("click", () => {
        callback();
      });
    });
  }, config.timeOut);
};
const hoverTimeoutEvents =  new Map();
const addHoverTimeoutEvent = (el, callback, timeout = 2e3) => {
  if (typeof el === "string") {
    el = document.querySelector(el);
  }
  if (el === null) return false;
  const attribute = el.getAttribute("data-hover-timeout");
  if (attribute !== null) return false;
  el.setAttribute("data-hover-timeout", "");
  let time = null;
  const mouseenter = (e) => {
    time = setTimeout(() => {
      callback(e);
    }, timeout);
  };
  const mouseleave = () => {
    if (time === null) {
      return;
    }
    clearTimeout(time);
  };
  hoverTimeoutEvents.set(el, { mouseenter, mouseleave });
  el.addEventListener("mouseenter", mouseenter);
  el.addEventListener("mouseleave", mouseleave);
  return true;
};
const removeHoverTimeoutEvent = (el) => {
  const attribute = el.getAttribute("data-hover-timeout");
  if (attribute === null) return false;
  el.removeEventListener("mouseenter", hoverTimeoutEvents.get(el).mouseenter);
  el.removeEventListener("mouseleave", hoverTimeoutEvents.get(el).mouseleave);
  return true;
};
const updateCssVModal = () => {
  const styleEl = document.createElement("style");
  styleEl.innerHTML = `.v-modal  {
    z-index: auto !important;
}`;
  document.head.appendChild(styleEl);
};
const installStyle$1 = (cssText, selector = ".mk-def-style") => {
  let styleEl = document.head.querySelector(selector);
  if (styleEl === null) {
    styleEl = document.createElement("style");
    if (selector.startsWith("#")) {
      styleEl.id = selector.substring(1);
    } else {
      styleEl.className = selector.substring(1);
    }
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = cssText;
};
const createVueDiv = (el = null, cssTests = null) => {
  const panelDiv = document.createElement("div");
  if (cssTests !== null) {
    panelDiv.style.cssText = cssTests;
  }
  const vueDiv = document.createElement("div");
  panelDiv.appendChild(vueDiv);
  if (el !== null) {
    el.appendChild(panelDiv);
  }
  return { panelDiv, vueDiv };
};
var elUtil = {
  getUrlUID,
  getUrlBV,
  findElement,
  isDOMElement,
  addHoverTimeoutEvent,
  removeHoverTimeoutEvent,
  findElements,
  findElementChain,
  findElementsAndBindEvents,
  updateCssVModal,
  installStyle: installStyle$1,
  createVueDiv
};const toPlayCountOrBulletChat = (str) => {
  if (!str) {
    return -1;
  }
  str = str.split(/[\t\r\f\n\s]*/g).join("");
  const replace = str.replace(/[^\d.]/g, "");
  if (str.endsWith("万") || str.endsWith("万次") || str.endsWith("万弹幕")) {
    return parseFloat(replace) * 1e4;
  }
  if (str.endsWith("次") || str.endsWith("弹幕")) {
    return parseInt(replace);
  }
  return parseInt(str);
};
const timeStringToSeconds = (timeStr) => {
  if (!timeStr) {
    return -1;
  }
  const parts = timeStr.split(":");
  switch (parts.length) {
    case 1:
      return Number(parts[0]);
    case 2:
      return Number(parts[0]) * 60 + Number(parts[1]);
    case 3:
      return Number(parts[0]) * 3600 + Number(parts[1]) * 60 + Number(parts[2]);
    default:
      throw new Error("Invalid time format");
  }
};
var sFormatUtil = {
  toPlayCountOrBulletChat,
  timeStringToSeconds
};var ruleKeyListDataJson = [
  {
    "key": "name",
    "name": "用户名(模糊匹配)"
  },
  {
    "key": "precise_name",
    "name": "用户名(精确匹配)"
  },
  {
    "key": "nameCanonical",
    "name": "用户名(正则匹配)"
  },
  {
    "key": "precise_uid",
    "name": "用户uid(精确匹配)"
  },
  {
    "key": "precise_uid_white",
    "name": "用户uid白名单(精确匹配)"
  },
  {
    "key": "title",
    "name": "标题(模糊匹配)"
  },
  {
    "key": "titleCanonical",
    "name": "标题(正则匹配)"
  },
  {
    "key": "commentOn",
    "name": "评论关键词(模糊匹配)"
  },
  {
    "key": "commentOnCanonical",
    "name": "评论关键词(正则匹配)"
  },
  {
    "key": "precise_fanCard",
    "name": "粉丝牌(精确匹配)"
  },
  {
    "key": "dynamic",
    "name": "动态关键词(模糊匹配)"
  },
  {
    "key": "dynamicCanonical",
    "name": "动态关键词(正则匹配)"
  },
  {
    "key": "dynamic_video",
    "name": "动态视频关键词(模糊匹配)"
  },
  {
    "key": "dynamic_videoCanonical",
    "name": "动态视频关键词(正则匹配)"
  },
  {
    "key": "precise_tag",
    "name": "话题tag标签(精确匹配)"
  },
  {
    "key": "tag",
    "name": "话题tag标签(模糊匹配)"
  },
  {
    "key": "tagCanonical",
    "name": "话题tag标签(正则匹配)"
  },
  {
    "key": "precise_partition",
    "name": "直播分区(精确匹配)"
  },
  {
    "key": "precise_liveRoomId",
    "name": "直播间id(精确匹配)"
  },
  {
    "key": "videoTag",
    "name": "视频tag(模糊匹配)"
  },
  {
    "key": "precise_videoTag",
    "name": "视频tag(精确匹配)"
  },
  {
    "key": "videoTagCanonical",
    "name": "视频tag(正则匹配)"
  },
  {
    "key": "videoTag_preciseCombination",
    "name": "视频tag(组合精确匹配)"
  },
  {
    "key": "hotSearchKey",
    "name": "热搜关键词(模糊匹配)"
  },
  {
    "key": "hotSearchKeyCanonical",
    "name": "热搜关键词(正则匹配)"
  },
  {
    "key": "precise_avatarPendantName",
    "name": "头像挂件名(精确匹配)"
  },
  {
    "key": "avatarPendantName",
    "name": "头像挂件名(模糊匹配)"
  },
  {
    "key": "signature",
    "name": "用户签名(模糊匹配)"
  },
  {
    "key": "signatureCanonical",
    "name": "用户签名(正则匹配)"
  },
  {
    "key": "videoDesc",
    "name": "视频简介(模糊匹配)"
  },
  {
    "key": "videoDescCanonical",
    "name": "视频简介(正则匹配)"
  },
  {
    "key": "precise_video_bv",
    "name": "视频bv号(精确匹配)"
  }
];const getSelectOptions = () => {
  const options = [
    {
      value: "模糊匹配",
      label: "模糊匹配",
      children: []
    },
    {
      value: "正则匹配",
      label: "正则匹配",
      children: []
    },
    {
      value: "多重匹配",
      label: "多重匹配",
      children: []
    },
    {
      value: "精确匹配",
      label: "精确匹配",
      children: []
    }
  ];
  for (let { name, key } of ruleKeyListDataJson) {
    let children;
    if (name.includes("(模糊匹配)")) {
      children = options[0].children;
    }
    if (name.includes("(正则匹配)")) {
      children = options[1].children;
    }
    if (name.includes("(组合精确匹配)")) {
      children = options[2].children;
    }
    if (name.includes("(精确匹配)")) {
      children = options[3].children;
    }
    children.push({
      value: key,
      label: name
    });
  }
  return options;
};
const getRuleKeyListData = () => {
  return ruleKeyListDataJson;
};
const getRuleKeyList = () => {
  return ruleKeyListDataJson.map((item) => {
    return item.key;
  });
};
const getNameArr = () => {
  return GM_getValue("name", []);
};
const getPreciseNameArr = () => {
  return GM_getValue("precise_name", []);
};
const getNameCanonical = () => {
  return GM_getValue("nameCanonical", []);
};
const getPreciseUidArr = () => {
  return GM_getValue("precise_uid", []);
};
const getPreciseUidWhiteArr = () => {
  return GM_getValue("precise_uid_white", []);
};
const getTitleArr = () => {
  return GM_getValue("title", []);
};
const getTitleCanonicalArr = () => {
  return GM_getValue("titleCanonical", []);
};
const getCommentOnArr = () => {
  return GM_getValue("commentOn", []);
};
const getCommentOnCanonicalArr = () => {
  return GM_getValue("commentOnCanonical", []);
};
const getPreciseTagArr = () => {
  return GM_getValue("precise_tag", []);
};
const getTagArr = () => {
  return GM_getValue("tag", []);
};
const getTagCanonicalArr = () => {
  return GM_getValue("tagCanonical", []);
};
const getPreciseFanCardArr = () => {
  return GM_getValue("precise_fanCard", []);
};
const getPrecisePartitionArr = () => {
  return GM_getValue("precise_partition", []);
};
const getVideoTagArr = () => {
  return GM_getValue("videoTag", []);
};
const getPreciseVideoTagArr = () => {
  return GM_getValue("precise_videoTag", []);
};
const getVideoTagCanonicalArr = () => {
  return GM_getValue("videoTagCanonical", []);
};
const getHotSearchKeyArr = () => {
  return GM_getValue("hotSearchKey", []);
};
const getHotSearchKeyCanonicalArr = () => {
  return GM_getValue("hotSearchKeyCanonical", []);
};
const clearKeyItem = (ruleKey) => {
  GM_deleteValue(ruleKey);
};
const getVideoTagPreciseCombination = () => {
  return GM_getValue("videoTag_preciseCombination", []);
};
const setVideoTagPreciseCombination = (list) => {
  GM_setValue("videoTag_preciseCombination", list);
};
const getPreciseVideoBV = () => {
  return GM_getValue("precise_video_bv", []);
};
var ruleKeyListData = {
  getNameArr,
  getPreciseNameArr,
  getNameCanonical,
  getPreciseUidArr,
  getPreciseUidWhiteArr,
  getTitleArr,
  getTitleCanonicalArr,
  getCommentOnArr,
  getCommentOnCanonicalArr,
  getRuleKeyListData,
  getPreciseTagArr,
  getTagArr,
  getTagCanonicalArr,
  getPreciseFanCardArr,
  getPrecisePartitionArr,
  getVideoTagArr,
  getPreciseVideoTagArr,
  getVideoTagCanonicalArr,
  getHotSearchKeyArr,
  getHotSearchKeyCanonicalArr,
  clearKeyItem,
  getSelectOptions,
  getVideoTagPreciseCombination,
  setVideoTagPreciseCombination,
  getRuleKeyList,
  getPreciseVideoBV
};const exactMatch = (ruleList, value) => {
  if (ruleList === null || ruleList === void 0) return false;
  if (!Array.isArray(ruleList)) return false;
  return ruleList.some((item) => item === value);
};
const bFuzzyAndRegularMatchingWordsToLowercase = localMKData.bFuzzyAndRegularMatchingWordsToLowercase();
const regexMatch = (ruleList, value) => {
  if (ruleList === null || ruleList === void 0) return null;
  if (!Array.isArray(ruleList)) return null;
  if (bFuzzyAndRegularMatchingWordsToLowercase) {
    value = value.toLowerCase();
  }
  value = value.split(/[\t\r\f\n\s]*/g).join("");
  const find = ruleList.find((item) => {
    try {
      return value.search(item) !== -1;
    } catch (e) {
      const msg = `正则匹配失败，请检查规则列表中的正则表达式是否正确，错误信息：${e.message}`;
      eventEmitter.send("正则匹配时异常", { e, msg });
      return false;
    }
  });
  return find === void 0 ? null : find;
};
const fuzzyMatch = (ruleList, value) => {
  if (ruleList === null || ruleList === void 0 || value === null) return null;
  if (!Array.isArray(ruleList)) return null;
  const find = ruleList.find((item) => value.toLowerCase().includes(item));
  return find === void 0 ? null : find;
};
var ruleMatchingUtil = {
  exactMatch,
  regexMatch,
  fuzzyMatch
};const verificationInputValue = (ruleValue, type) => {
  if (ruleValue === null) return { status: false, res: "内容不能为空" };
  if (type === "precise_uid" || type === "precise_uid_white") {
    ruleValue = parseInt(ruleValue);
    if (isNaN(ruleValue)) {
      return {
        status: false,
        res: "请输入数字！"
      };
    }
  } else {
    ruleValue.trim();
  }
  if (ruleValue === "") {
    return { status: false, res: "内容不能为空" };
  }
  return { status: true, res: ruleValue };
};
const addRule = (ruleValue, type) => {
  const verificationRes = verificationInputValue(ruleValue, type);
  if (!verificationRes.status) {
    return verificationRes;
  }
  const arr = GM_getValue(type, []);
  if (arr.includes(verificationRes.res)) {
    return { status: false, res: "已存在此内容" };
  }
  arr.push(verificationRes.res);
  GM_setValue(type, arr);
  return { status: true, res: "添加成功" };
};
const batchAddRule = (ruleValues, type) => {
  const successList = [];
  const failList = [];
  const arr = GM_getValue(type, []);
  const isUidType = type.includes("uid");
  for (let v of ruleValues) {
    if (isUidType) {
      if (isNaN(v)) {
        failList.push(v);
        continue;
      }
      v = parseInt(v);
    }
    if (arr.includes(v)) {
      failList.push(v);
      continue;
    }
    arr.push(v);
    successList.push(v);
  }
  if (successList.length > 0) {
    GM_setValue(type, arr);
  }
  return {
    successList,
    failList
  };
};
const delRule = (type, value) => {
  const verificationRes = verificationInputValue(value, type);
  if (!verificationRes.status) {
    return verificationRes;
  }
  const { res } = verificationRes;
  const arr = GM_getValue(type, []);
  const indexOf = arr.indexOf(res);
  if (indexOf === -1) {
    return { status: false, res: "不存在此内容" };
  }
  arr.splice(indexOf, 1);
  GM_setValue(type, arr);
  return { status: true, res: "移除成功" };
};
const showDelRuleInput = async (type) => {
  let ruleValue;
  try {
    const { value } = await eventEmitter.invoke("el-prompt", "请输入要删除的规则内容", "删除指定规则");
    ruleValue = value;
  } catch (e) {
    return;
  }
  const { status, res } = delRule(type, ruleValue);
  eventEmitter.send("el-msg", res);
  status && eventEmitter.send("刷新规则信息");
};
const getRuleContent = (isToStr = true, space = 0) => {
  const ruleMap = {};
  for (let ruleKeyListDatum of ruleKeyListData.getRuleKeyListData()) {
    const key = ruleKeyListDatum.key;
    const data = GM_getValue(key, []);
    if (data.length === 0) continue;
    ruleMap[key] = data;
  }
  if (isToStr) {
    return JSON.stringify(ruleMap, null, space);
  }
  return ruleMap;
};
const verificationRuleMap = (keyArr, content) => {
  let parse;
  try {
    parse = JSON.parse(content);
  } catch (e) {
    alert("规则内容有误");
    return false;
  }
  const newRule = {};
  for (const key in parse) {
    if (!Array.isArray(parse[key])) {
      continue;
    }
    if (parse[key].length === 0) {
      continue;
    }
    newRule[key] = parse[key];
  }
  if (Object.keys(newRule).length === 0) {
    alert("规则内容为空");
    return false;
  }
  return newRule;
};
const overwriteImportRules = (content) => {
  const map = verificationRuleMap(ruleKeyListData.getRuleKeyList(), content);
  if (map === false) return false;
  for (let key of Object.keys(map)) {
    GM_setValue(key, map[key]);
  }
  return true;
};
const appendImportRules = (content) => {
  const map = verificationRuleMap(ruleKeyListData.getRuleKeyList(), content);
  if (map === false) return false;
  for (let key of Object.keys(map)) {
    const arr = GM_getValue(key, []);
    for (let item of map[key]) {
      if (!arr.includes(item)) {
        arr.push(item);
      }
    }
    GM_setValue(key, arr);
  }
  return true;
};
const addRulePreciseUid = (uid, isTip = true) => {
  const results = addRule(uid, "precise_uid");
  if (isTip) {
    eventEmitter.send("el-notify", {
      title: "添加精确uid操作提示",
      message: results.res,
      type: "success"
    });
    return results;
  }
  return results;
};
const addRulePreciseBv = (bv, isTip = true) => {
  const results = addRule(bv, "precise_video_bv");
  if (isTip) {
    eventEmitter.send("el-notify", {
      title: "添加精确bv操作提示",
      message: results.res,
      type: "success"
    });
    return results;
  }
  return results;
};
const delRUlePreciseUid = (uid, isTip = true) => {
  const results = delRule("precise_uid", uid);
  if (isTip) {
    eventEmitter.send("el-alert", results.res);
    return null;
  }
  return results;
};
const addRulePreciseName = (name, tip = true) => {
  const results = addRule(name, "precise_name");
  if (tip) {
    eventEmitter.send("el-msg", results.res);
  }
  return results;
};
const findRuleItemValue = (type, value) => {
  return GM_getValue(type, []).find((item) => item === value) || null;
};
const addItemRule = (arr, key, coverage = true) => {
  const complianceList = [];
  for (let v of arr) {
    const { status, res } = verificationInputValue(v, key);
    if (!status) return { status: false, msg: `内容中有误:${res}` };
    complianceList.push(v);
  }
  if (coverage) {
    GM_setValue(key, complianceList);
    return { status: true, msg: `添加成功-覆盖模式，数量：${complianceList.length}` };
  }
  const oldArr = GM_getValue(key, []);
  const newList = complianceList.filter((item) => !oldArr.includes(item));
  if (newList.length === 0) {
    return { status: false, msg: "内容重复" };
  }
  GM_setValue(key, oldArr.concat(newList));
  return { status: true, msg: "添加成功-追加模式，新增数量：" + newList.length };
};
const addPreciseUidItemRule = (uidArr, isTip = true, coverage = true) => {
  const { status, msg } = addItemRule(uidArr, "precise_uid", coverage);
  if (isTip) {
    eventEmitter.send("el-alert", msg);
    return status;
  }
  return { status, msg };
};
var ruleUtil = {
  addRule,
  batchAddRule,
  showDelRuleInput,
  getRuleContent,
  overwriteImportRules,
  appendImportRules,
  addRulePreciseUid,
  addRulePreciseName,
  delRUlePreciseUid,
  findRuleItemValue,
  addItemRule,
  addPreciseUidItemRule,
  addRulePreciseBv
};var __typeError$3 = (msg) => {
  throw TypeError(msg);
};
var __accessCheck$3 = (obj, member, msg) => member.has(obj) || __typeError$3("Cannot " + msg);
var __privateGet$3 = (obj, member, getter) => (__accessCheck$3(obj, member, "read from private field"), member.get(obj));
var __privateAdd$3 = (obj, member, value) => member.has(obj) ? __typeError$3("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var _elEvents;
class ElEventEmitter {
  constructor() {
    __privateAdd$3(this, _elEvents,  new Map());
  }
  addEvent(el, eventName, callback, repeated = false) {
    const elEvents = __privateGet$3(this, _elEvents);
    if (!elEvents.has(el)) {
      elEvents.set(el, { events: [], attrs: [] });
    }
    const { events, attrs } = elEvents.get(el);
    if (!repeated) {
      if (attrs.includes(eventName)) {
        return;
      }
    }
    attrs.push(eventName);
    events.push({ eventName, callback });
    el.setAttribute(`gz-event`, JSON.stringify(attrs));
    el.addEventListener(eventName, callback);
  }
  hasEventName(el, eventName) {
    const elEvents = __privateGet$3(this, _elEvents);
    if (elEvents.has(el)) {
      return true;
    }
    const { attrs } = elEvents.get(el);
    return attrs.includes(eventName);
  }
}
_elEvents = new WeakMap();
const elEventEmitter = new ElEventEmitter();const addBlockButton$1 = (data, className = "gz_def_shielding_button", position = []) => {
  if (hideBlockButtonGm()) return;
  const { insertionPositionEl, explicitSubjectEl, cssMap, cssText } = data.data;
  const butEl = insertionPositionEl.querySelector("." + className);
  if (butEl) return;
  const buttonEL = document.createElement("button");
  buttonEL.setAttribute("gz_type", "");
  if (className !== "") {
    buttonEL.className = className;
  }
  buttonEL.textContent = "屏蔽";
  if (position.length !== 0) {
    buttonEL.style.position = "absolute";
  }
  if (position.includes("right")) {
    buttonEL.style.right = "0";
  }
  if (position.includes("bottom")) {
    buttonEL.style.bottom = "0";
  }
  if (cssText) {
    buttonEL.style.cssText = cssText;
  }
  if (cssMap) {
    for (let key of Object.keys(cssMap)) {
      buttonEL.style[key] = cssMap[key];
    }
  }
  if (explicitSubjectEl) {
    buttonEL.style.display = "none";
    elEventEmitter.addEvent(explicitSubjectEl, "mouseout", () => buttonEL.style.display = "none");
    elEventEmitter.addEvent(explicitSubjectEl, "mouseover", () => buttonEL.style.display = "");
  }
  insertionPositionEl.appendChild(buttonEL);
  buttonEL.addEventListener("click", (event) => {
    event.stopImmediatePropagation();
    event.preventDefault();
    const { updateFunc, data: { el } } = data;
    let localData;
    if (updateFunc) {
      localData = updateFunc(el);
    } else {
      localData = data.data;
    }
    const { uid = -1, name = null, bv = null, title = "", roomId = null } = localData;
    const showList = [];
    if (uid !== -1) {
      showList.push({ label: `uid精确屏蔽-用户uid=${uid}-name=${name}`, value: "uid" });
    } else {
      showList.push({ label: `用户名精确屏蔽(不推荐)-用户name=${name}`, value: "name" });
    }
    if (bv !== null) {
      showList.push({ label: `bv号屏蔽-视频bv=${bv}`, value: "bv", title });
    }
    if (roomId !== null) {
      showList.push({ label: `直播间id屏蔽-直播间id=${roomId}`, value: "roomId" });
    }
    eventEmitter.send("sheet-dialog", {
      title: "屏蔽选项",
      list: showList,
      optionsClick: (item) => {
        const { value } = item;
        let results;
        switch (value) {
          case "uid":
            if (uid === -1) {
              eventEmitter.send("el-msg", "该页面数据不存在uid字段");
              return;
            }
            results = ruleUtil.addRulePreciseUid(uid);
            break;
          case "name":
            results = ruleUtil.addRulePreciseName(name);
            break;
          case "bv":
            results = ruleUtil.addRulePreciseBv(bv);
            break;
          case "roomId":
            results = ruleUtil.addRule(roomId, "precise_liveRoomId");
            eventEmitter.send("el-notify", {
              title: "添加精确直播间id操作提示",
              message: results.res,
              type: "success"
            });
            break;
          default:
            eventEmitter.invoke("el-confirm", "不推荐用户使用精确用户名来屏蔽，确定继续吗？").then(() => {
              if (ruleUtil.addRulePreciseName(name).status) {
                data.maskingFunc();
              }
            });
        }
        if (results.status) {
          data.maskingFunc();
        }
      }
    });
  });
};
const addTopicDetailVideoBlockButton = (data) => {
  addBlockButton$1(data, "gz_shielding_button");
};
const addTopicDetailContentsBlockButton = (data) => {
  const position = data.data.position;
  const loop = position !== void 0;
  addBlockButton$1(data, "gz_shielding_topic_detail_button", loop ? position : []);
};
const blockUserUid = (uid) => {
  if (ruleMatchingUtil.exactMatch(ruleKeyListData.getPreciseUidArr(), uid)) {
    return { state: true, type: "精确uid" };
  }
  return returnTempVal;
};
const blockCheckWhiteUserUid = (uid) => {
  return ruleMatchingUtil.exactMatch(ruleKeyListData.getPreciseUidWhiteArr(), uid);
};
const blockExactAndFuzzyMatching = (val, config) => {
  if (!val) {
    return returnTempVal;
  }
  const {
    exactKey,
    exactTypeName,
    exactRuleArr = GM_getValue(exactKey, [])
  } = config;
  if (exactKey) {
    if (ruleMatchingUtil.exactMatch(exactRuleArr, val)) {
      return { state: true, type: exactTypeName, matching: val };
    }
  }
  let matching;
  const {
    fuzzyKey,
    fuzzyTypeName,
    fuzzyRuleArr = GM_getValue(fuzzyKey, [])
  } = config;
  if (fuzzyKey) {
    matching = ruleMatchingUtil.fuzzyMatch(fuzzyRuleArr, val);
    if (matching) {
      return { state: true, type: fuzzyTypeName, matching };
    }
  }
  const {
    regexKey,
    regexTypeName,
    regexRuleArr = GM_getValue(regexKey, [])
  } = config;
  if (regexKey) {
    matching = ruleMatchingUtil.regexMatch(regexRuleArr, val);
    if (matching) {
      return { state: true, type: regexTypeName, matching };
    }
  }
  return returnTempVal;
};
const blockComment = (comment) => {
  return blockExactAndFuzzyMatching(comment, {
    fuzzyKey: "commentOn",
    fuzzyTypeName: "模糊评论",
    regexKey: "commentOnCanonical",
    regexTypeName: "正则评论"
  });
};
const asyncBlockComment = async (comment) => {
  const res = blockComment(comment);
  if (res.state) return Promise.reject(res);
};
const blockAvatarPendant = (name) => {
  return blockExactAndFuzzyMatching(name, {
    exactKey: "precise_avatarPendantName",
    exactTypeName: "精确头像挂件名",
    fuzzyKey: "avatarPendantName",
    fuzzyTypeName: "模糊头像挂件名"
  });
};
const asyncBlockAvatarPendant = async (name) => {
  const res = blockAvatarPendant(name);
  if (res.state) return Promise.reject(res);
};
const blockSignature = (signature) => {
  return blockExactAndFuzzyMatching(signature, {
    fuzzyKey: "signature",
    fuzzyTypeName: "模糊用户签名",
    regexKey: "signatureCanonical",
    regexTypeName: "正则用户签名"
  });
};
const asyncBlockSignature = async (signature) => {
  const res = blockSignature(signature);
  if (res.state) return Promise.reject(res);
};
const blockVideoDesc = (desc) => {
  return blockExactAndFuzzyMatching(desc, {
    fuzzyKey: "videoDesc",
    fuzzyTypeName: "视频简介(模糊匹配)",
    regexKey: "videoDescCanonical",
    regexTypeName: "视频简介(正则匹配)"
  });
};
const asyncBlockVideoDesc = async (desc) => {
  const res = blockVideoDesc(desc);
  if (res.state) return Promise.reject(res);
};
const blockGender = (gender) => {
  const val = localMKData.isGenderRadioVal();
  const state = val === gender && val !== "不处理";
  if (state) {
    return { state: true, type: "性别屏蔽", matching: val };
  }
  return returnTempVal;
};
const asyncBlockGender = async (gender) => {
  const res = blockGender(gender);
  if (res.state) {
    return Promise.reject(res);
  }
};
const blockUserVip = (vipId) => {
  const val = localMKData.isVipTypeRadioVal();
  const vipMap = {
    0: "无",
    1: "月大会员",
    2: "年度及以上大会员"
  };
  if (val === vipMap[vipId]) {
    return { state: true, type: "会员类型屏蔽", matching: val };
  }
  return returnTempVal;
};
const asyncBlockUserVip = async (vipId) => {
  const res = blockUserVip(vipId);
  if (res.state) {
    return Promise.reject(res);
  }
};
const blockSeniorMember = (num) => {
  if (num === 1 && localMKData.isSeniorMember()) {
    return { state: true, type: "屏蔽硬核会员" };
  }
  return returnTempVal;
};
const asyncBlockSeniorMember = async (num) => {
  const res = blockSeniorMember(num);
  if (res.state) {
    return Promise.reject(res);
  }
};
const blockVideoCopyright = (num) => {
  const val = localMKData.isCopyrightRadio();
  const tempMap = {
    1: "原创",
    2: "转载"
  };
  if (val === tempMap[num]) {
    return { state: true, type: "视频类型屏蔽", matching: val };
  }
  return returnTempVal;
};
const asyncBlockVideoCopyright = async (num) => {
  const res = blockVideoCopyright(num);
  if (res.state) {
    return Promise.reject(res);
  }
};
const blockVerticalVideo = (dimension) => {
  if (!localMKData.isBlockVerticalVideo()) {
    return returnTempVal;
  }
  if (!dimension) {
    return returnTempVal;
  }
  const vertical = dimension.width < dimension.height;
  if (vertical) {
    return { state: true, type: "竖屏视频屏蔽", matching: vertical };
  }
  return returnTempVal;
};
const asyncBlockVerticalVideo = async (dimension) => {
  const res = blockVerticalVideo(dimension);
  if (res.state) return Promise.reject(res);
};
const blockVideoLikeRate = (like, view) => {
  if (!like || !view || !localMKData.isVideoLikeRateBlockingStatus()) {
    return returnTempVal;
  }
  const mk_likeRate = parseInt(localMKData.getVideoLikeRate() * 100);
  if (isNaN(mk_likeRate)) {
    return returnTempVal;
  }
  const likeRate = defUtil$1.calculateLikeRate(like, view);
  if (likeRate <= mk_likeRate) {
    return {
      state: true,
      type: "视频点赞率屏蔽",
      matching: mk_likeRate + "%",
      msg: `视频的点赞率为${likeRate}%，低于用户指定的限制${mk_likeRate}%，屏蔽该视频`
    };
  }
  return returnTempVal;
};
const asyncBlockVideoLikeRate = async (like, view) => {
  const res = blockVideoLikeRate(like, view);
  if (res.state) return Promise.reject(res);
};
const blockVideoInteractiveRate = (danmaku, reply, view) => {
  if (!danmaku || !view || !localMKData.isInteractiveRateBlockingStatus()) {
    return returnTempVal;
  }
  const mk_interactionRate = parseInt(localMKData.getInteractiveRate() * 100);
  const interactionRate = defUtil$1.calculateInteractionRate(danmaku, reply, view);
  if (interactionRate <= mk_interactionRate) {
    return {
      state: true,
      type: "视频互动率屏蔽",
      matching: mk_interactionRate + "%",
      msg: `视频的互动率为${interactionRate}%，低于用户指定的限制${mk_interactionRate}%，屏蔽该视频`
    };
  }
  return returnTempVal;
};
const asyncBlockVideoInteractiveRate = async (danmaku, reply, view) => {
  const res = blockVideoInteractiveRate(danmaku, reply, view);
  if (res.state) return Promise.reject(res);
};
const blockVideoTripleRate = (favorite, coin, share, view) => {
  if (!favorite || !coin || !share || !view || !localMKData.isTripleRateBlockingStatus()) {
    return returnTempVal;
  }
  const mk_tripleRate = parseInt(localMKData.getTripleRate() * 100);
  const tripleRate = defUtil$1.calculateTripleRate(favorite, coin, share, view);
  if (tripleRate <= mk_tripleRate) {
    return {
      state: true,
      type: "视频三连率屏蔽",
      matching: mk_tripleRate + "%",
      msg: `视频的三连率为${tripleRate}%，低于用户指定的限制${mk_tripleRate}%，屏蔽该视频`
    };
  }
  return returnTempVal;
};
const asyncBlockVideoTripleRate = async (favorite, coin, share, view) => {
  const res = blockVideoTripleRate(favorite, coin, share, view);
  if (res.state) return Promise.reject(res);
};
const blockVideoCoinLikesRatioRate = (coin, like) => {
  if (!coin || !like || !localMKData.isCoinLikesRatioRateBlockingStatus()) {
    return returnTempVal;
  }
  const mk_coinLikesRatioRate = parseInt(localMKData.getCoinLikesRatioRate() * 100);
  const coinLikesRatioRate = defUtil$1.calculateCoinLikesRatioRate(coin, like);
  if (coinLikesRatioRate <= mk_coinLikesRatioRate) {
    return {
      state: true,
      type: "视频投币/点赞比（内容价值）屏蔽",
      matching: mk_coinLikesRatioRate + "%",
      msg: `视频的投币/点赞比（内容价值）为${coinLikesRatioRate}%，低于用户指定的限制${mk_coinLikesRatioRate}%，屏蔽该视频`
    };
  }
  return returnTempVal;
};
const asyncBlockVideoCoinLikesRatioRate = async (coin, like) => {
  const res = blockVideoCoinLikesRatioRate(coin, like);
  if (res.state) return Promise.reject(res);
};
const blockByLevelForVideo = (level) => {
  if (!level) return returnTempVal;
  if (isEnableMinimumUserLevelVideoGm()) {
    const min = getMinimumUserLevelVideoGm();
    if (level < min) {
      return { state: true, type: "最小用户等级过滤-视频", matching: min };
    }
  }
  if (isEnableMaximumUserLevelVideoGm()) {
    const max = getMaximumUserLevelVideoGm();
    if (level > max) {
      return { state: true, type: "最大用户等级过滤-视频", matching: max };
    }
  }
  return returnTempVal;
};
const blockByLevelForComment = (level) => {
  if (level === -1) return returnTempVal;
  if (isEnableMinimumUserLevelCommentGm()) {
    const min = getMinimumUserLevelCommentGm();
    if (level < min) {
      return { state: true, type: "最小用户等级过滤-评论", matching: min };
    }
  }
  if (isEnableMaximumUserLevelCommentGm()) {
    const max = getMaximumUserLevelCommentGm();
    if (level > max) {
      return { state: true, type: "最大用户等级过滤-评论", matching: max };
    }
  }
  return returnTempVal;
};
const asyncBlockByLevelForComment = async (level) => {
  const res = blockByLevelForComment(level);
  if (res.state) return Promise.reject(res);
};
const asyncBlockByLevel = async (level) => {
  const res = blockByLevelForVideo(level);
  if (res.state) return Promise.reject(res);
};
const blockUserUidAndName = (uid, name) => {
  if (!uid || !name) {
    return returnTempVal;
  }
  let returnVal = blockUidWholeProcess(uid);
  if (returnVal.state) {
    return returnVal;
  }
  returnVal = blockUserName(name);
  if (returnVal.state) {
    return returnVal;
  }
  return returnTempVal;
};
const asyncBlockUserUidAndName = async (uid, name) => {
  const res = blockUserUidAndName(uid, name);
  if (res.state) {
    return Promise.reject(res);
  }
};
const blockVideoTeamMember = (teamMember) => {
  if (!teamMember) {
    return returnTempVal;
  }
  for (let u of teamMember) {
    const returnVal = blockUserUidAndName(u.mid, u.name);
    if (returnVal.state) {
      return returnVal;
    }
  }
  return returnTempVal;
};
const asyncBlockVideoTeamMember = async (teamMember) => {
  const res = blockVideoTeamMember(teamMember);
  if (res.state) return Promise.reject(res);
};
const blockUserName = (name) => {
  return blockExactAndFuzzyMatching(name, {
    exactKey: "precise_name",
    exactTypeName: "精确用户名",
    fuzzyKey: "name",
    fuzzyTypeName: "模糊用户名",
    regexKey: "nameCanonical",
    regexTypeName: "正则用户名"
  });
};
const blockVideoOrOtherTitle = (title) => {
  return blockExactAndFuzzyMatching(title, {
    fuzzyKey: "title",
    fuzzyTypeName: "模糊标题",
    regexKey: "titleCanonical",
    regexTypeName: "正则标题"
  });
};
const blockBasedVideoTag = (tags) => {
  const preciseVideoTagArr = ruleKeyListData.getPreciseVideoTagArr();
  const videoTagArr = ruleKeyListData.getVideoTagArr();
  if (preciseVideoTagArr.length <= 0 && videoTagArr.length <= 0) {
    return returnTempVal;
  }
  for (let tag of tags) {
    if (ruleMatchingUtil.exactMatch(preciseVideoTagArr, tag)) {
      return { state: true, type: "精确视频tag", matching: tag };
    }
    let fuzzyMatch = ruleMatchingUtil.fuzzyMatch(videoTagArr, tag);
    if (fuzzyMatch) {
      return { state: true, type: "模糊视频tag", matching: fuzzyMatch };
    }
    fuzzyMatch = ruleMatchingUtil.regexMatch(ruleKeyListData.getVideoTagCanonicalArr(), tag);
    if (fuzzyMatch) {
      return { state: true, type: "正则视频tag", matching: fuzzyMatch };
    }
  }
  return returnTempVal;
};
const asyncBlockBasedVideoTag = async (tags) => {
  const res = blockBasedVideoTag(tags);
  if (res.state) return Promise.reject(res);
};
const blockByUidRange = (uid) => {
  if (!localMKData.isUidRangeMaskingStatus()) {
    return returnTempVal;
  }
  const [head, tail] = localMKData.getUidRangeMasking();
  if (head >= uid && uid <= tail) {
    return { state: true, type: "uid范围屏蔽", matching: `${head}=>${uid}<=${tail}` };
  }
  return returnTempVal;
};
const blockUidWholeProcess = (uid) => {
  if (!uid || blockCheckWhiteUserUid(uid)) return returnTempVal;
  let returnVal = blockUserUid(uid);
  if (returnVal.state) {
    return returnVal;
  }
  return blockByUidRange(uid);
};
const asyncBlockFollowedVideo = (following) => {
  if (following && localMKData.isBlockFollowed()) {
    return Promise.reject({ state: true, type: "已关注" });
  }
};
const asyncBlockChargeVideo = (isUpOwnerExclusive) => {
  if (isUpOwnerExclusive && localMKData.isUpOwnerExclusive()) {
    return Promise.reject({ state: true, type: "充电专属视频" });
  }
};
const blockTimeRangeMasking = (timestamp) => {
  if (!timestamp || !localMKData.isTimeRangeMaskingStatus()) {
    return returnTempVal;
  }
  const timeRangeMaskingArr = localMKData.getTimeRangeMaskingArr();
  if (timeRangeMaskingArr.length === 0) {
    return returnTempVal;
  }
  for (let { status, r: [startTimestamp, endTimestamp] } of timeRangeMaskingArr) {
    if (!status) continue;
    const startSecondsTimestamp = Math.floor(startTimestamp / 1e3);
    const endSecondsTimestamp = Math.floor(endTimestamp / 1e3);
    if (startSecondsTimestamp >= timestamp <= endSecondsTimestamp) {
      const startToTime = new Date(startTimestamp).toLocaleString();
      const endToTime = new Date(endTimestamp).toLocaleString();
      const timestampToTime = new Date(timestamp * 1e3).toLocaleString();
      return { state: true, type: "时间范围屏蔽", matching: `${startToTime}=>${timestampToTime}<=${endToTime}` };
    }
  }
  return returnTempVal;
};
const asyncBlockTimeRangeMasking = async (timestamp) => {
  const res = blockTimeRangeMasking(timestamp);
  if (res.state) return Promise.reject(res);
};
const blockSeniorMemberOnly = (level) => {
  if (!isSeniorMemberOnly() || level === -1) {
    return returnTempVal;
  }
  if (level === 7) {
    return { state: true, type: "保留硬核会员" };
  }
  return { state: true, type: "非硬核会员" };
};
const asyncBlockSeniorMemberOnly = async (level) => {
  const res = blockSeniorMemberOnly(level);
  if (res.state) return Promise.reject(res);
};
const blockLimitationFanSum = (fansNum) => {
  if (fansNum < 0 || !isFansNumBlockingStatusGm()) {
    return returnTempVal;
  }
  const limitFansNum = getLimitationFanSumGm();
  if (limitFansNum === -1) return returnTempVal;
  if (fansNum <= limitFansNum) {
    return { state: true, type: "粉丝数限制", matching: `限制数[${limitFansNum}],${fansNum}<=${limitFansNum}` };
  }
  return returnTempVal;
};
const asyncBlockLimitationFanSum = async (fansNum) => {
  const res = blockLimitationFanSum(fansNum);
  if (res.state) return Promise.reject(res);
};
const blockUserVideoNumLimit = (num) => {
  if (!isLimitationVideoSubmitStatusGm()) return returnTempVal;
  const sumGm = getLimitationVideoSubmitSumGm();
  if (sumGm >= num) {
    return { state: true, type: "用户投稿视频数量限制", matching: `用户投稿视频数量[${num}],${sumGm}>=${num}` };
  }
  return returnTempVal;
};
const asyncBlockUserVideoNumLimit = async (num) => {
  const res = blockUserVideoNumLimit(num);
  if (res.state) return Promise.reject(res);
};
const asyncBlockUserFanCard = async (fansMedal) => {
  if (fansMedal !== null) {
    if (ruleMatchingUtil.exactMatch(ruleKeyListData.getPreciseFanCardArr(), fansMedal)) {
      return { state: true, type: "精确粉丝牌", matching: fansMedal };
    }
  }
  return returnTempVal;
};
const blockDynamicItemContent = (content, videoTitle = null, ruleArrMap = {}) => {
  let res;
  if (content !== "") {
    res = blockExactAndFuzzyMatching(content, {
      fuzzyKey: "dynamic",
      fuzzyTypeName: "动态内容(模糊匹配)",
      regexKey: "dynamicCanonical",
      regexTypeName: "动态内容(正则匹配)",
      ...ruleArrMap
    });
    if (res.state) return res;
  }
  if (videoTitle) {
    res = blockExactAndFuzzyMatching(videoTitle, {
      fuzzyKey: "dynamic_video",
      fuzzyTypeName: "动态视频(模糊匹配)",
      regexKey: "dynamic_videoCanonical",
      regexTypeName: "动态视频(正则匹配)"
    });
  }
  return res;
};
var shielding = {
  addTopicDetailVideoBlockButton,
  addTopicDetailContentsBlockButton,
  addBlockButton: addBlockButton$1
};const arraysLooseEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  const countMap = {};
  const getKey = (value) => {
    if (typeof value === "number" && Number.isNaN(value)) return "__NaN";
    return JSON.stringify(value);
  };
  for (const elem of arr1) {
    const key = getKey(elem);
    countMap[key] = (countMap[key] || 0) + 1;
  }
  for (const elem of arr2) {
    const key = getKey(elem);
    if (!countMap[key]) return false;
    countMap[key]--;
  }
  return true;
};
const arrayContains = (a, b) => {
  if (b.length === 0) return true;
  if (a.length < b.length) return false;
  const countMap = {};
  const getKey = (value) => {
    if (typeof value === "number" && Number.isNaN(value)) return "__NaN";
    return JSON.stringify(value);
  };
  for (const elem of a) {
    const key = getKey(elem);
    countMap[key] = (countMap[key] || 0) + 1;
  }
  for (const elem of b) {
    const key = getKey(elem);
    if (!countMap[key] || countMap[key] <= 0) return false;
    countMap[key]--;
  }
  return true;
};
var arrUtil = {
  arraysLooseEqual,
  arrayContains
};var __defProp$1 = Object.defineProperty;
var __typeError$2 = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => __defNormalProp$1(obj, key + "" , value);
var __accessCheck$2 = (obj, member, msg) => member.has(obj) || __typeError$2("Cannot " + msg);
var __privateGet$2 = (obj, member, getter) => (__accessCheck$2(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd$2 = (obj, member, value) => member.has(obj) ? __typeError$2("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet$2 = (obj, member, value, setter) => (__accessCheck$2(obj, member, "write to private field"), member.set(obj, value), value);
var _cachePr;
class VideoCacheManager {
  constructor() {
    __privateAdd$2(this, _cachePr, null);
    __publicField$1(this, "updateCacheDebounce", defUtil$1.debounce(() => {
      this.updateCache();
    }, 3e3));
  }
  async getCache() {
    if (__privateGet$2(this, _cachePr) !== null) {
      return __privateGet$2(this, _cachePr);
    }
    const p = new Promise((resolve) => {
      bvDexie.getVideoInfo().then((res) => resolve(res));
    });
    __privateSet$2(this, _cachePr, p);
    return p;
  }
  async updateCache() {
    __privateSet$2(this, _cachePr, null);
    await this.getCache().then((list) => {
      const msg = `已更新videoInfoCache，当前缓存数量：${list.length}`;
      console.log(msg);
      eventEmitter.send("event-update-out-info", { id: "更新videoInfoCache", msg });
      return list;
    });
  }
  async find(bv) {
    const list = await this.getCache();
    const find = list.find((item) => item.bv === bv);
    return find ? find : null;
  }
}
_cachePr = new WeakMap();
const videoCacheManager = new VideoCacheManager();const asyncBlockVideoTagPreciseCombination = async (tags) => {
  if (tags.length <= 0) return;
  const mkArrTags = ruleKeyListData.getVideoTagPreciseCombination();
  for (let mkTags of mkArrTags) {
    if (arrUtil.arrayContains(tags, mkTags)) return Promise.reject({
      state: true,
      type: "多重tag屏蔽",
      matching: mkTags
    });
  }
};
const blockVideoBV = (bv) => {
  const bvs = ruleKeyListData.getPreciseVideoBV();
  if (bvs.includes(bv)) {
    return { state: true, type: "精确bv号屏蔽", matching: bv };
  }
  return returnTempVal;
};
const blockVideoDuration = (duration) => {
  if (duration !== -1) {
    if (isMinimumDurationGm()) {
      const min = getMinimumDurationGm();
      if (min > duration && min !== -1) {
        return { state: true, type: "最小时长", matching: min };
      }
    }
    if (isMaximumDurationGm()) {
      const max = getMaximumDurationGm();
      if (max < duration && max !== -1) {
        return { state: true, type: "最大时长", matching: max };
      }
    }
  }
  return returnTempVal;
};
const blockVideoBulletChat = (bulletChat) => {
  if (bulletChat !== -1) {
    if (isMinimumBarrageGm()) {
      const min = getMinimumBarrageGm();
      if (min > bulletChat && min !== -1) {
        return { state: true, type: "最小弹幕数", matching: min };
      }
    }
    if (isMaximumBarrageGm()) {
      const max = getMaximumBarrageGm();
      if (max < bulletChat && max !== -1) {
        return { state: true, type: "最大弹幕数", matching: max };
      }
    }
  }
  return returnTempVal;
};
const blockVideoPlayCount = (playCount) => {
  if (playCount === -1) return returnTempVal;
  if (isMinimumPlayGm()) {
    const min = getMinimumPlayGm();
    if (min > playCount && min !== -1) {
      return { state: true, type: "最小播放量", matching: min };
    }
  }
  if (isMaximumPlayGm()) {
    const max = getMaximumPlayGm();
    if (max < playCount && max !== -1) {
      return { state: true, type: "最大播放量", matching: max };
    }
  }
  return returnTempVal;
};
const shieldingVideo = (videoData) => {
  const {
    title,
    uid = -1,
    name,
    nDuration = -1,
    nBulletChat = -1,
    nPlayCount = -1,
    bv = null
  } = videoData;
  let returnVal = blockUserUidAndName(uid, name);
  if (returnVal.state) return returnVal;
  if (isEffectiveUIDShieldingOnlyVideo()) return returnTempVal;
  returnVal = blockVideoOrOtherTitle(title);
  if (returnVal.state) return returnVal;
  returnVal = blockVideoBV(bv);
  if (returnVal.state) return returnVal;
  returnVal = blockVideoDuration(nDuration);
  if (returnVal.state) return returnVal;
  returnVal = blockVideoBulletChat(nBulletChat);
  if (returnVal.state) return returnVal;
  returnVal = blockVideoPlayCount(nPlayCount);
  if (returnVal.state) return returnVal;
  return returnTempVal;
};
const shieldingVideoDecorated = async (videoData, method = "remove") => {
  const { el, bv = "-1" } = videoData;
  if (el.style.display === "none") return promiseResolve;
  const { state, type, matching = null } = shieldingVideo(videoData);
  if (state) {
    eventEmitter.send("event-屏蔽视频元素", { res: { state, type, matching }, method, videoData });
    return promiseResolve;
  }
  if (bv === "-1") return promiseReject;
  let videoRes = await videoCacheManager.find(bv);
  if (videoRes === null) {
    const disableNetRequestsBvVideoInfo = localMKData.isDisableNetRequestsBvVideoInfo();
    if (disableNetRequestsBvVideoInfo) {
      return promiseReject;
    } else {
      const httpRes = await bvRequestQueue.videoInfoRequestQueue.addBv(bv);
      const { msg, data } = httpRes;
      if (!httpRes.state) {
        console.warn("获取视频信息失败:" + msg);
        return promiseReject;
      }
      videoRes = data;
      if (await bvDexie.addVideoData(bv, data)) {
        console.log("mk-db-添加视频信息到数据库成功", "获取视频信息成功:" + msg, data, videoData);
        videoCacheManager.updateCacheDebounce();
      }
    }
  }
  const verificationIns = await shieldingOtherVideoParameter(videoRes, videoData);
  if (verificationIns.state) {
    eventEmitter.send("event-屏蔽视频元素", { res: verificationIns, method, videoData });
    return promiseResolve;
  }
  return promiseReject;
};
eventEmitter.on("event-屏蔽视频元素", ({ res, method = "remove", videoData }) => {
  if (!res) return;
  const { type, matching } = res;
  const { el } = videoData;
  if (method === "remove") {
    el?.remove();
  } else {
    el.style.display = "none";
  }
  eventEmitter.send("event-打印屏蔽视频信息", type, matching, videoData);
});
const shieldingOtherVideoParameter = async (result, videoData) => {
  const { tags = [], userInfo, videoInfo } = result;
  return asyncBlockUserUidAndName(userInfo.uid, userInfo.name).then(() => {
    if (!isEffectiveUIDShieldingOnlyVideo()) {
      return;
    }
    return Promise.reject({ type: "中断", msg: "仅生效UID屏蔽(限视频)" });
  }).then(() => asyncBlockVideoTagPreciseCombination(tags)).then(() => asyncBlockBasedVideoTag(tags)).then(() => asyncBlockLimitationFanSum(userInfo.follower)).then(() => asyncBlockVerticalVideo(videoInfo.dimension)).then(() => asyncBlockVideoCopyright(videoInfo.copyright)).then(() => asyncBlockChargeVideo(videoInfo?.is_upower_exclusive)).then(() => asyncBlockFollowedVideo(videoInfo?.following)).then(() => asyncBlockSeniorMember(userInfo.is_senior_member)).then(() => asyncBlockVideoTeamMember(userInfo.mid)).then(() => asyncBlockVideoLikeRate(videoInfo.like, videoInfo.view)).then(() => asyncBlockVideoInteractiveRate(videoInfo.danmaku, videoInfo.reply, videoInfo.view)).then(() => asyncBlockVideoTripleRate(videoInfo.favorite, videoInfo.coin, videoInfo.share, videoInfo.view)).then(() => asyncBlockVideoCoinLikesRatioRate(videoInfo.coin, videoInfo.like)).then(() => asyncBlockTimeRangeMasking(videoInfo.pubdate)).then(() => asyncBlockVideoDesc(videoInfo?.desc)).then(() => asyncBlockSignature(videoInfo?.sign)).then(() => asyncBlockAvatarPendant(userInfo?.pendant?.name)).then(() => asyncBlockByLevel(userInfo?.current_level || -1)).then(() => asyncBlockGender(userInfo?.sex)).then(() => asyncBlockUserVip(userInfo.vip.type)).then(() => asyncBlockUserVideoNumLimit(userInfo.archive_count)).then(async () => {
    const videosInFeaturedCommentsBlockedVal = isVideosInFeaturedCommentsBlockedGm();
    const followers7DaysOnlyVideosBlockedVal = isFollowers7DaysOnlyVideosBlockedGm();
    const commentDisabledVideosBlockedVal = isCommentDisabledVideosBlockedGm();
    if (videosInFeaturedCommentsBlockedVal === false && followers7DaysOnlyVideosBlockedVal === false && commentDisabledVideosBlockedVal === false) {
      return;
    }
    const res = await bvRequestQueue.fetchGetVideoReplyBoxDescRequestQueue.addBv(videoData.bv);
    const { childText, disabled, message, state } = res;
    if (!state) {
      console.warn("获取视频评论输入框失败:" + message);
      return;
    }
    if (commentDisabledVideosBlockedVal && disabled) {
      return Promise.reject({ state, type: "禁止评论类视频" });
    }
    if (childText === "关注UP主7天以上的人可发评论" && followers7DaysOnlyVideosBlockedVal) {
      return Promise.reject({ state, type: "7天关注才可评论类视频" });
    }
    if (childText === "评论被up主精选后，对所有人可见" && videosInFeaturedCommentsBlockedVal) {
      return Promise.reject({ state, type: "精选评论类视频" });
    }
  }).then(() => {
    return returnTempVal;
  }).catch((v) => {
    const { msg, type } = v;
    if (msg) {
      console.warn("warn-type-msg", msg);
    }
    if (type === "中断") return returnTempVal;
    return v;
  });
};
eventEmitter.on("添加热门视频屏蔽按钮", (data) => {
  shielding.addBlockButton(data, "gz_shielding_button", ["right", "bottom"]);
});
eventEmitter.on("视频添加屏蔽按钮-BewlyBewly", (data) => {
  shielding.addBlockButton(data, "gz_shielding_button", ["right", "bottom"]);
});
eventEmitter.on("视频添加屏蔽按钮", (data) => {
  shielding.addBlockButton(data, "gz_shielding_button", ["right"]);
});
var video_shielding = {
  shieldingVideoDecorated
};const isHome = (url, title) => {
  if (title !== "哔哩哔哩 (゜-゜)つロ 干杯~-bilibili") {
    return false;
  }
  if (url === "https://www.bilibili.com/") {
    return true;
  }
  return url.includes("https://www.bilibili.com/?spm_id_from=");
};
const deDesktopDownloadTipEl = async () => {
  const el = await elUtil.findElement(".desktop-download-tip");
  el?.remove();
  const log = "已删除下载提示";
  console.log(log, el);
};
const hideHomeCarouselImage = (hide, immediately = false) => {
  const selector = ".container.is-version8>.recommended-swipe";
  if (immediately) {
    try {
      document.body.querySelector(selector).style.display = hide ? "none" : "";
    } catch (e) {
      console.log("隐藏首页轮播图失败", e);
    }
    return;
  }
  elUtil.findElement(selector).then((el) => {
    el.style.display = hide ? "none" : "";
  });
};
const hideHomeTopHeaderBannerImage = (hide) => {
  elUtil.findElement(".bili-header__banner").then((el) => {
    if (hide) {
      el.style.cssText = `
                visibility: hidden;
                height: 0 !important;
                min-height: 45px !important;
            `;
    } else {
      el.style.cssText = `
                visibility: visible;
                height: auto!important;
                min-height: 155px;
            `;
    }
  });
};
const hideHomeTopHeaderChannel = (hide) => {
  const styleTxt = hide ? `
        .bili-header__channel{
        height: 36px!important;
        visibility: hidden;
        }
        .header-channel{
        display: none;
        }
        ` : `.bili-header__channel{
        height: 120px!important;
        visibility: visible;
        }
        .header-channel{
        display: block;
        }
        `;
  elUtil.installStyle(styleTxt, ".mk-hide-home-top-header-channel");
};
const getVideoData = (el) => {
  const title = el.querySelector(".bili-video-card__info--tit").title;
  const name = el.querySelector(".bili-video-card__info--author").textContent.trim();
  let nPlayCount = el.querySelector(".bili-video-card__stats--text")?.textContent.trim();
  nPlayCount = sFormatUtil.toPlayCountOrBulletChat(nPlayCount);
  let nBulletChat = el.querySelector(".bili-video-card__stats--text")?.textContent.trim();
  nBulletChat = sFormatUtil.toPlayCountOrBulletChat(nBulletChat);
  let nDuration = el.querySelector(".bili-video-card__stats__duration")?.textContent.trim();
  nDuration = sFormatUtil.timeStringToSeconds(nDuration);
  const userUrl = el.querySelector(".bili-video-card__info--owner").getAttribute("href");
  const uid = elUtil.getUrlUID(userUrl);
  return {
    title,
    name,
    uid,
    nPlayCount,
    nBulletChat,
    nDuration,
    userUrl
  };
};
const getHomeVideoELList = async () => {
  const elList = await elUtil.findElements(".container.is-version8>.feed-card,.container.is-version8>.bili-feed-card");
  let list = [];
  for (let el of elList) {
    try {
      const tempData = getVideoData(el);
      const { userUrl } = tempData;
      if (!userUrl.includes("//space.bilibili.com/")) {
        el?.remove();
        const log = "遍历换一换视频列表下面列表时检测到异常内容，已将该元素移除";
        eventEmitter.send("打印信息", log);
        console.log(log, el);
        continue;
      }
      const videoUrl = el.querySelector(".bili-video-card__info--tit>a")?.href;
      const items = {
        ...tempData,
        ...{
          videoUrl,
          el,
          insertionPositionEl: el.querySelector(".bili-video-card__info--bottom"),
          explicitSubjectEl: el.querySelector(".bili-video-card__info")
        }
      };
      if (videoUrl?.includes("www.bilibili.com/video")) {
        items.bv = elUtil.getUrlBV(videoUrl);
      }
      list.push(items);
    } catch (e) {
      el?.remove();
      console.log("遍历视频列表中检测到异常内容，已将该元素移除;");
    }
  }
  return list;
};
const startClearExcessContentList = () => {
  if (globalValue.adaptationBAppCommerce) return;
  document.querySelectorAll(".adcard,.fixed-card").forEach((el) => el.remove());
  const releaseTypeCards = getReleaseTypeCardsGm();
  for (let el of document.querySelectorAll(".floor-single-card")) {
    const badgeEl = el.querySelector(".cover-container .badge>.floor-title");
    if (badgeEl === null) {
      continue;
    }
    const badge = badgeEl.textContent.trim();
    if (releaseTypeCards.includes(badge)) {
      continue;
    }
    el?.remove();
    console.log(`已清除视频列表中的${badge}类卡片`, el);
  }
};
const startShieldingHomeVideoList = async () => {
  const homeVideoELList = await getHomeVideoELList();
  for (const videoData of homeVideoELList) {
    video_shielding.shieldingVideoDecorated(videoData).catch(() => {
      eventEmitter.send("视频添加屏蔽按钮", { data: videoData, maskingFunc: startShieldingHomeVideoList });
    });
  }
  startClearExcessContentList();
};
const startDebounceShieldingHomeVideoList = defUtil$1.debounce(startShieldingHomeVideoList, 500);
const scrollMouseUpAndDown = async () => {
  if (globalValue.adaptationBAppCommerce) return;
  const el = document.body.querySelector("#home-bottom-div");
  el.scrollIntoView({ behavior: "smooth", block: "end" });
  await defUtil$1.wait(1200);
  document.querySelector(".browser-tip").scrollIntoView({ behavior: "smooth" });
};
const checkVideoListCount = () => {
  setInterval(async () => {
    console.log("开始检查视频列表数量");
    const elList = document.body.querySelectorAll(".container.is-version8>div:is(.feed-card,.bili-feed-card)");
    if (elList.length === 0) return;
    if (elList.length <= 9) {
      await scrollMouseUpAndDown();
    }
    startClearExcessContentList();
  }, 3e3);
};
const run$8 = () => {
  deDesktopDownloadTipEl();
  if (isHideCarouselImageGm()) {
    hideHomeCarouselImage(true);
  }
  if (isHideHomeTopHeaderBannerImageGm()) {
    hideHomeTopHeaderBannerImage(true);
  }
  if (isHideHomeTopHeaderChannelGm()) {
    hideHomeTopHeaderChannel(true);
  }
  GM_addStyle(`
    .recommended-container_floor-aside .container>*:nth-of-type(7) {
    margin-top: auto !important;
}
@media (min-width: 1560px) and (max-width: 2059.9px) {
    .recommended-container_floor-aside .container>*:nth-of-type(n + 8) {
        margin-top: auto !important;
    }
}
    `);
  elUtil.findElement(".load-more-anchor~.bili-video-card:last-child").then((el) => {
    let current = el;
    for (let i = 0; i < 12; i++) {
      const clone = current.cloneNode(true);
      current.insertAdjacentElement("afterend", clone);
      current = clone;
    }
    console.log("已插入12个空元素至视频列表尾部，最后插入的元素", current);
  });
  const bottomDiv = document.createElement("div");
  bottomDiv.id = "home-bottom-div";
  bottomDiv.style.all = "initial";
  document.body.appendChild(bottomDiv);
  if (isAutomaticScrollingGm()) {
    setTimeout(() => {
      checkVideoListCount();
    }, 1400);
  }
};
var bilibiliHome = {
  isHome,
  startDebounceShieldingHomeVideoList,
  getVideoData,
  hideHomeCarouselImage,
  hideHomeTopHeaderBannerImage,
  hideHomeTopHeaderChannel,
  run: run$8
};const dealingWithHotSearchTerms = (el, label) => {
  const hotSearchKeyArr = ruleKeyListData.getHotSearchKeyArr();
  const hotSearchKeyCanonicalArr = ruleKeyListData.getHotSearchKeyCanonicalArr();
  let match = ruleMatchingUtil.fuzzyMatch(hotSearchKeyArr, label);
  if (match) {
    el.remove();
    eventEmitter.send("打印信息", `根据模糊热搜关键词-【${match}】-屏蔽-${label}`);
    return;
  }
  match = ruleMatchingUtil.regexMatch(hotSearchKeyCanonicalArr, label);
  if (match) {
    eventEmitter.send("打印信息", `根据正则热搜关键词-【${match}】-屏蔽-${label}`);
    el.remove();
  }
};
const startShieldingHotList = async () => {
  if (isHideHotSearchesPanelGm()) {
    return;
  }
  console.log("检查热搜关键词中...");
  const elList = await elUtil.findElements(
    ".trendings-col>.trending-item,.trendings-single>.trending-item",
    { interval: 2e3 }
  );
  console.log("热搜元素列表", elList);
  for (let el of elList) {
    const label = el.textContent.trim();
    dealingWithHotSearchTerms(el, label);
  }
};
const startShieldingHotListDynamic = async () => {
  const elList = await elUtil.findElements(".trending-list>a");
  console.log("动态首页右侧热搜列表", elList);
  for (const el of elList) {
    const label = el.querySelector(".text").textContent.trim();
    dealingWithHotSearchTerms(el, label);
  }
};
const setTopSearchPanelDisplay = (hide, name = "搜索历史", timeout = -1) => {
  const css = name === "搜索历史" ? ".search-panel>.history" : ".search-panel>.trending";
  const msg = name === "搜索历史" ? "搜索历史" : "热搜";
  elUtil.findElement(css, { timeout }).then((el) => {
    if (el === null) {
      eventEmitter.send("el-msg", "未找到元素，可能是页面加载未完成，请稍后再试！");
      return;
    }
    el.style.display = hide ? "none" : "block";
    eventEmitter.send("打印信息", `已将顶部搜索框${msg}显示状态为${hide ? "隐藏" : "显示"}`);
  });
};
const run$7 = () => {
  setTopSearchPanelDisplay(isHideSearchHistoryPanelGm());
  setTopSearchPanelDisplay(isHideHotSearchesPanelGm(), "热搜");
};
var hotSearch = {
  startShieldingHotList,
  setTopSearchPanelDisplay,
  run: run$7,
  startShieldingHotListDynamic
};const setTopInputPlaceholder = async () => {
  if (globalValue.compatibleBEWLYBEWLY) {
    return;
  }
  const placeholder = valueCache.get("topInputPlaceholder");
  if (placeholder === null) {
    return;
  }
  const targetInput = await elUtil.findElement(".nav-search-input");
  targetInput.placeholder = placeholder;
  eventEmitter.send("el-notify", {
    title: "tip",
    message: "已恢复顶部搜索框提示内容"
  });
};
const processTopInputContent = async () => {
  if (globalValue.compatibleBEWLYBEWLY) {
    return;
  }
  if (!GM_getValue("isClearTopInputTipContent", false)) {
    return;
  }
  const targetInput = await elUtil.findElement(".nav-search-input");
  if (targetInput.placeholder === "") {
    await defUtil$1.wait(1500);
    await processTopInputContent();
    return;
  }
  valueCache.set("topInputPlaceholder", targetInput.placeholder);
  targetInput.placeholder = "";
  eventEmitter.send("el-msg", "清空了搜索框提示内容");
};
eventEmitter.on("执行清空顶部搜索框提示内容", () => {
  processTopInputContent();
});
var topInput = { processTopInputContent, setTopInputPlaceholder };const getDynamicCardModulesData = (vueData) => {
  const data = {};
  const { module_author, module_dynamic } = vueData.modules;
  data.name = module_author.name;
  data.uid = module_author.mid;
  data.desc = module_dynamic.desc?.text ?? "";
  const topic = module_dynamic["topic"];
  if (topic !== null) {
    data.topic = topic.name;
  }
  const major = module_dynamic["major"];
  const additional = module_dynamic["additional"];
  if (additional !== null) {
    switch (additional.type) {
      case "ADDITIONAL_TYPE_RESERVE":
        const reserve = additional["reserve"];
        data.reserveTitle = reserve.title;
        break;
      case "ADDITIONAL_TYPE_VOTE":
        const vote = additional["vote"];
        data.voteTitle = vote.desc;
        break;
      case "ADDITIONAL_TYPE_UPOWER_LOTTERY":
        const uPowerLottery = additional["upower_lottery"];
        data.uPowerLotteryTitle = uPowerLottery.title;
        data.uPowerLotteryDesc = uPowerLottery.desc.text;
        console.warn("充电专属抽奖信息，待观察", uPowerLottery);
        break;
      case "ADDITIONAL_TYPE_GOODS":
        data.goods = additional["goods"];
        break;
      default:
        console.warn("相关内容卡片信息,待观察", vueData);
        break;
    }
  }
  if (major !== null) {
    switch (major["type"]) {
      case "MAJOR_TYPE_ARCHIVE":
        const archive = major["archive"];
        data.videoTitle = archive.title;
        data.videoDesc = archive.desc;
        const badge = archive.badge;
        data.videoBadgeText = badge.text;
        data.videoChargingExclusive = badge.text === "充电专属";
        break;
      case "MAJOR_TYPE_OPUS":
        const opus = major["opus"];
        const opusTitle = opus.title ?? "";
        const opusDesc = opus.summary.text ?? "";
        data.opusTitle = opusTitle;
        data.opusDesc = opusDesc;
        data.desc += opusTitle + opusDesc;
        break;
      case "MAJOR_TYPE_BLOCKED":
        const blocked = major["blocked"];
        data.blockedTitle = blocked.title;
        const iconBadgeText = module_author?.["icon_badge"]?.text;
        if (iconBadgeText) {
          data.iconBadgeText = iconBadgeText;
          if (iconBadgeText === "充电专属") {
            data.specialColumnForCharging = true;
          }
        }
        break;
      default:
        console.warn("动态主体类型,待观察", vueData);
        break;
    }
  }
  return data;
};
const getDataList$1 = async () => {
  const elList = await elUtil.findElements(".bili-dyn-list__items>.bili-dyn-list__item");
  const list = [];
  for (let el of elList) {
    const dynItemEl = el.querySelector(".bili-dyn-item");
    const vueExample = dynItemEl?.__vue__;
    let data = { el };
    const vueData = vueExample?.data ?? null;
    data.vueExample = vueExample;
    data.vueData = vueData;
    if (vueData.visible === false) {
      continue;
    }
    const modulesData = getDynamicCardModulesData(vueData);
    data = { ...data, ...modulesData };
    switch (vueData.type) {
      case "DYNAMIC_TYPE_FORWARD":
        const { orig } = vueData;
        data.orig = getDynamicCardModulesData(orig);
        break;
    }
    list.push(data);
  }
  return list;
};
const checkEachItem = (dynamicData, ruleArrMap) => {
  const { desc, name, uid = -1, videoTitle = null, orig = null } = dynamicData;
  const blockRepostDynamicGm = isBlockRepostDynamicGm();
  if (orig && blockRepostDynamicGm) {
    eventEmitter.send("打印信息", `用户${name}-动态内容${desc}-规则转发类动态`);
    return true;
  }
  if (uid !== -1) {
    if (blockCheckWhiteUserUid(uid)) return false;
  }
  if (desc === "" && videoTitle === null) return false;
  if (dynamicData["reserveTitle"] && isBlockAppointmentDynamicGm()) {
    eventEmitter.send("打印信息", `用户${name}-动态内容${desc}-屏蔽预约类动态`);
    return true;
  }
  if (dynamicData["uPowerLotteryTitle"] && isBlockUPowerLotteryDynamicGm()) {
    eventEmitter.send("打印信息", `用户${name}-动态内容${desc}-屏蔽充电专属抽奖类动态`);
    return true;
  }
  if (dynamicData["voteTitle"] && isBlockVoteDynamicGm()) {
    eventEmitter.send("打印信息", `用户${name}-动态内容${desc}-屏蔽投票类动态`);
    return true;
  }
  if (dynamicData["goods"] && isBlockGoodsDynamicGm()) {
    eventEmitter.send("打印信息", `用户${name}-动态内容${desc}-屏蔽商品类动态`);
    return true;
  }
  if (dynamicData["specialColumnForCharging"] && isBlockSpecialColumnForChargingDynamicGm()) {
    eventEmitter.send("打印信息", `用户${name}-动态内容${desc}-屏蔽充电专属专栏动态`);
    return true;
  }
  if (dynamicData["videoChargingExclusive"] && isBlockVideoChargingExclusiveDynamicGm()) {
    eventEmitter.send("打印信息", `用户${name}-动态内容${desc}-屏蔽充电专属视频动态`);
    return true;
  }
  let { state, matching, type } = blockDynamicItemContent(desc, videoTitle, ruleArrMap);
  if (!state) {
    return false;
  }
  eventEmitter.send("打印信息", `用户${name}-动态内容${desc}-${type}-规则${matching}`);
  return true;
};
const commonCheckDynamicList = async () => {
  const dataList = await getDataList$1();
  console.log("动态列表", dataList);
  const ruleArrMap = {
    fuzzyRuleArr: GM_getValue("dynamic", []),
    regexRuleArr: GM_getValue("dynamicCanonical", [])
  };
  const checkNestedDynamicContentGm = isCheckNestedDynamicContentGm();
  for (const v of dataList) {
    if (checkEachItem(v, ruleArrMap)) {
      v.el.remove();
      continue;
    }
    const { orig = null } = v;
    if (orig === null || !checkNestedDynamicContentGm) {
      continue;
    }
    if (checkEachItem(orig, ruleArrMap)) {
      v.el.remove();
    }
  }
};
var dynamicCommon = {
  commonCheckDynamicList
};const isUrlDynamicHomePage = () => {
  return window.location.href.includes("t.bilibili.com") && document.title === "动态首页-哔哩哔哩";
};
const isUrlDynamicContentPage = () => {
  const href = window.location.href;
  const title = document.title;
  return (href.includes("t.bilibili.com") || href.includes("www.bilibili.com/opus")) && (title.endsWith("的动态-哔哩哔哩") || title.includes("的动态 - 哔哩哔哩"));
};
const debounceCheckDynamicList = defUtil$1.debounce(() => {
  if (!enableDynamicItemsContentBlockingGm()) return;
  dynamicCommon.commonCheckDynamicList();
}, 1e3);
const hidePersonalInfoCard = (show) => {
  elUtil.findElement(".left>section").then((el) => {
    el.style.display = show ? "none" : "";
  });
};
const run$6 = () => {
  debounceCheckDynamicList();
  elUtil.findElement("div.bili-dyn-up-list__content").then((el) => {
    console.log("已找到动态首页中顶部用户tabs栏", el);
    el.addEventListener("click", (event) => {
      const target = event.target;
      if (target["className"] === "shim") return;
      debounceCheckDynamicList();
    });
  });
  hotSearch.startShieldingHotListDynamic();
  if (hidePersonalInfoCardGm()) {
    hidePersonalInfoCard(true);
  }
};
var dynamicPage = {
  isUrlDynamicHomePage,
  isUrlDynamicContentPage,
  run: run$6,
  hidePersonalInfoCard,
  debounceCheckDynamicList
};var script$x = {
  data() {
    return {
      enableDynamicItemsContentBlockingVal: enableDynamicItemsContentBlockingGm(),
      isBlockRepostDynamicVal: isBlockRepostDynamicGm(),
      isBlockAppointmentDynamicVal: isBlockAppointmentDynamicGm(),
      isBlockVoteDynamicVal: isBlockVoteDynamicGm(),
      isBlockUPowerLotteryDynamicVal: isBlockUPowerLotteryDynamicGm(),
      isBlockGoodsDynamicVal: isBlockGoodsDynamicGm(),
      isBlockSpecialColumnForChargingDynamicVal: isBlockSpecialColumnForChargingDynamicGm(),
      isBlockVideoChargingExclusiveDynamicVal: isBlockVideoChargingExclusiveDynamicGm(),
      hidePersonalInfoCardVal: hidePersonalInfoCardGm()
    };
  },
  watch: {
    enableDynamicItemsContentBlockingVal(n) {
      GM_setValue("enable_dynamic_items_content_blocking_gm", n);
    },
    isBlockRepostDynamicVal(n) {
      GM_setValue("is_block_repost_dynamic_gm", n);
    },
    isBlockAppointmentDynamicVal(n) {
      GM_setValue("is_block_appointment_dynamic_gm", n);
    },
    isBlockVoteDynamicVal(n) {
      GM_setValue("is_block_vote_dynamic_gm", n);
    },
    isBlockUPowerLotteryDynamicVal(n) {
      GM_setValue("is_block_u_power_lottery_dynamic_gm", n);
    },
    isBlockGoodsDynamicVal(n) {
      GM_setValue("is_block_goods_dynamic_gm", n);
    },
    isBlockSpecialColumnForChargingDynamicVal(n) {
      GM_setValue("is_block_special_column_for_charging_dynamic_gm", n);
    },
    isBlockVideoChargingExclusiveDynamicVal(n) {
      GM_setValue("is_block_video_charging_exclusive_dynamic_gm", n);
    },
    hidePersonalInfoCardVal(n) {
      GM_setValue("hide_personal_info_card_gm", n);
      if (dynamicPage.isUrlDynamicHomePage()) {
        dynamicPage.hidePersonalInfoCard(n);
      }
    }
  }
};
const __vue_script__$x = script$x;
var __vue_render__$x = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c(
        "el-card",
        {
          scopedSlots: _vm._u([
            {
              key: "header",
              fn: function () {
                return [_vm._v("动态首页")]
              },
              proxy: true,
            },
          ]),
        },
        [
          _vm._v(" "),
          _c(
            "el-tooltip",
            {
              attrs: {
                content:
                  "启用该项后，对应页面中的动态会对uid白名单处理，和动态内容处理",
              },
            },
            [
              _c("el-switch", {
                attrs: { "active-text": "启用动态内容屏蔽" },
                model: {
                  value: _vm.enableDynamicItemsContentBlockingVal,
                  callback: function ($$v) {
                    _vm.enableDynamicItemsContentBlockingVal = $$v;
                  },
                  expression: "enableDynamicItemsContentBlockingVal",
                },
              }),
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "el-tooltip",
            {
              attrs: {
                content: "动态首页中左侧的个人信息卡片，展示关注粉丝动态该卡片",
              },
            },
            [
              _c("el-switch", {
                attrs: { "active-text": "隐藏个人信息卡片" },
                model: {
                  value: _vm.hidePersonalInfoCardVal,
                  callback: function ($$v) {
                    _vm.hidePersonalInfoCardVal = $$v;
                  },
                  expression: "hidePersonalInfoCardVal",
                },
              }),
            ],
            1
          ),
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "el-card",
        {
          scopedSlots: _vm._u([
            {
              key: "header",
              fn: function () {
                return [_vm._v("动态")]
              },
              proxy: true,
            },
          ]),
        },
        [
          _vm._v(" "),
          _c("el-switch", {
            attrs: { "active-text": "屏蔽转发类型" },
            model: {
              value: _vm.isBlockRepostDynamicVal,
              callback: function ($$v) {
                _vm.isBlockRepostDynamicVal = $$v;
              },
              expression: "isBlockRepostDynamicVal",
            },
          }),
          _vm._v(" "),
          _c(
            "el-tooltip",
            { attrs: { content: "如直播预约动态" } },
            [
              _c("el-switch", {
                attrs: { "active-text": "屏蔽预约类型" },
                model: {
                  value: _vm.isBlockAppointmentDynamicVal,
                  callback: function ($$v) {
                    _vm.isBlockAppointmentDynamicVal = $$v;
                  },
                  expression: "isBlockAppointmentDynamicVal",
                },
              }),
            ],
            1
          ),
          _vm._v(" "),
          _c("el-switch", {
            attrs: { "active-text": "屏蔽投票类型" },
            model: {
              value: _vm.isBlockVoteDynamicVal,
              callback: function ($$v) {
                _vm.isBlockVoteDynamicVal = $$v;
              },
              expression: "isBlockVoteDynamicVal",
            },
          }),
          _vm._v(" "),
          _c("el-switch", {
            attrs: { "active-text": "屏蔽充电专属抽奖类型" },
            model: {
              value: _vm.isBlockUPowerLotteryDynamicVal,
              callback: function ($$v) {
                _vm.isBlockUPowerLotteryDynamicVal = $$v;
              },
              expression: "isBlockUPowerLotteryDynamicVal",
            },
          }),
          _vm._v(" "),
          _c("el-switch", {
            attrs: { "active-text": "屏蔽商品类" },
            model: {
              value: _vm.isBlockGoodsDynamicVal,
              callback: function ($$v) {
                _vm.isBlockGoodsDynamicVal = $$v;
              },
              expression: "isBlockGoodsDynamicVal",
            },
          }),
          _vm._v(" "),
          _c("el-switch", {
            attrs: { "active-text": "屏蔽充电专属专栏" },
            model: {
              value: _vm.isBlockSpecialColumnForChargingDynamicVal,
              callback: function ($$v) {
                _vm.isBlockSpecialColumnForChargingDynamicVal = $$v;
              },
              expression: "isBlockSpecialColumnForChargingDynamicVal",
            },
          }),
          _vm._v(" "),
          _c("el-switch", {
            attrs: { "active-text": "屏蔽充电专属视频" },
            model: {
              value: _vm.isBlockVideoChargingExclusiveDynamicVal,
              callback: function ($$v) {
                _vm.isBlockVideoChargingExclusiveDynamicVal = $$v;
              },
              expression: "isBlockVideoChargingExclusiveDynamicVal",
            },
          }),
        ],
        1
      ),
    ],
    1
  )
};
var __vue_staticRenderFns__$x = [];
__vue_render__$x._withStripped = true;
  const __vue_inject_styles__$x = undefined;
  const __vue_component__$x = normalizeComponent(
    { render: __vue_render__$x, staticRenderFns: __vue_staticRenderFns__$x },
    __vue_inject_styles__$x,
    __vue_script__$x);const outputInformationFontColor$1 = localMKData.getOutputInformationFontColor();
const highlightInformationColor$1 = localMKData.getHighlightInformationColor();
const getLiveRoomCommentInfoHtml = (type, matching, commentData) => {
  const toTimeString = defUtil$1.toTimeString();
  const { name, uid, content } = commentData;
  return `<b style="color: ${outputInformationFontColor$1}; " gz_bezel>
${toTimeString}-根据${type}-${matching ? `<b style="color: ${highlightInformationColor$1}">【${matching}】</b>` : ""}-屏蔽用户【${name}】uid=
            <a href="https://space.bilibili.com/${uid}" 
            style="color: ${highlightInformationColor$1}"
            target="_blank">【${uid}】</a>
            直播评论【${content}】
            </b>`;
};
const getLiveRoomInfoHtml = (type, matching, liveRoomData) => {
  const toTimeString = defUtil$1.toTimeString();
  const { name = null, uid = -1, title, liveUrl } = liveRoomData;
  return `<b style="color: ${outputInformationFontColor$1};" gz_bezel>
${toTimeString}-根据${type}${matching ? `<b style="color: ${highlightInformationColor$1}">【${matching}】</b>` : ""}-屏蔽用户【${name === null ? "" : name}】${uid === -1 ? "" : `uid=
            <a href="https://space.bilibili.com/${uid}"
            style="color: ${highlightInformationColor$1}"
            target="_blank">【${uid}】</a>`}
            直播间标题【<a href="${liveUrl}" target="_blank" style="color: ${highlightInformationColor$1}">${title}</a>】
</b>`;
};
var output_informationTab = {
  getLiveRoomCommentInfoHtml,
  getLiveRoomInfoHtml
};const blockLiveRoomId = (liveRoomId) => {
  if (GM_getValue("precise_liveRoomId", []).includes(liveRoomId)) {
    return { state: true, type: "精确直播间id", matching: liveRoomId };
  }
  return returnTempVal;
};
const shieldingLiveRoomContent = (liveRoomContent) => {
  const { content, uid, name, level = -1, chatType, fansMedal, el } = liveRoomContent;
  asyncBlockSeniorMemberOnly(level).then(() => asyncBlockUserUidAndName(uid, name)).then(() => asyncBlockByLevelForComment(level)).then(() => asyncBlockUserFanCard(fansMedal)).then(() => {
    if (chatType === "emoticon") {
      return Promise.reject({ type: "中断" });
    }
  }).then(() => asyncBlockComment(content)).catch((res) => {
    let { state, type, matching } = res;
    if (type === "中断") return;
    if (state) {
      el?.remove();
    }
    if (type) {
      const infoHtml = output_informationTab.getLiveRoomCommentInfoHtml(type, matching, liveRoomContent);
      eventEmitter.send("打印信息", infoHtml);
    }
  });
};
const shieldingLiveRoom = (liveRoomData) => {
  const { name, title, partition, uid = -1, roomId } = liveRoomData;
  let returnVal;
  if (uid !== -1) {
    if (blockCheckWhiteUserUid(uid)) {
      return returnTempVal;
    }
    returnVal = blockUserUidAndName(uid, name);
    if (returnVal.state) {
      return returnVal;
    }
  }
  returnVal = blockVideoOrOtherTitle(title);
  if (returnVal.state) {
    return returnVal;
  }
  if (partition) {
    if (ruleMatchingUtil.exactMatch(ruleKeyListData.getPrecisePartitionArr(), partition)) {
      return { state: true, type: "精确直播分区" };
    }
  }
  if (roomId) {
    return blockLiveRoomId(roomId);
  }
  return returnTempVal;
};
const shieldingLiveRoomDecorated = (liveRoomData) => {
  const { state, type, matching = null } = shieldingLiveRoom(liveRoomData);
  if (state) {
    liveRoomData.el?.remove();
    const infoHtml = output_informationTab.getLiveRoomInfoHtml(type, matching, liveRoomData);
    eventEmitter.send("打印信息", infoHtml);
  }
  return state;
};
const addLiveContentBlockButton = (commentsData) => {
  shielding.addBlockButton(commentsData, "gz_shielding_live_danmaku_button");
};
eventEmitter.on("event-直播首页列表添加屏蔽按钮", (liveCardItemData) => {
  shielding.addBlockButton(liveCardItemData, "gz-live-home-room-card-list-item");
});
var live_shielding = {
  shieldingLiveRoomDecorated,
  shieldingLiveRoomContent,
  addLiveContentBlockButton
};var cssContent = `
#room-card-list > div {
    display: flex;
    flex-direction: column;
}
#room-card-list > div button {
    margin-top: 15px;
    z-index: 10;
}
.gz-live-home-room-card-list-item {
    z-index: 10;
    width: 100%;
    position: relative;
    top: 20px;
}
`;const addStyle = () => {
  const style = document.createElement("style");
  style.textContent = cssContent;
  document.head.appendChild(style);
};
const setLivePageRightSidebarHide = (hided = false) => {
  elUtil.findElement("#area-tags>div>aside,#sidebar-vm.p-relative.z-sidebar.contain-optimize").then((el) => {
    el.style.display = hided ? "none" : "";
    eventEmitter.send("打印信息", `已${hided ? "隐藏" : "显示"}直播页右侧边栏`);
  });
};
var liveCommon = {
  addStyle,
  setLivePageRightSidebarHide
};var liveRoomListAdaptiveCss = `#area-tag-list {
    width: auto !important;
}
#room-card-list {
    justify-content: center !important;
}
.Item_card-item_vf59q {
    height: 190px !important;
}
.tab__bar-wrap{
    padding:0px 100px !important;
}`;const isLiveSection = (url = window.location.href) => {
  return url.includes("live.bilibili.com/p/eden/area-tags");
};
const getRoomCardDataList = async () => {
  const elList = await elUtil.findElements("#room-card-list>div");
  const list = [];
  for (let el of elList) {
    const cardEL = el.querySelector("#card");
    const vueExample = cardEL.__vue__;
    const props = vueExample.$props;
    const uid = props.anchorId;
    const name = props.anchorName;
    const title = props.roomTitle;
    const titleEl = el.querySelector(".Item_roomTitle_ax3eD");
    if (titleEl) {
      titleEl.title = title;
    }
    const roomId = props.roomId;
    const partition = props.areaName;
    const popularity = props.watchedShow.num;
    const roomCover = props.roomCover;
    const liveUrl = "https://live.bilibili.com/" + roomId;
    const insertionPositionEl = el;
    const explicitSubjectEl = el;
    list.push({
      liveUrl,
      name,
      uid,
      roomId,
      title,
      partition,
      popularity,
      roomCover,
      insertionPositionEl,
      explicitSubjectEl,
      el
    });
  }
  return list;
};
const startShieldingLiveRoom$1 = async () => {
  const liveList = await getRoomCardDataList();
  for (let liveData of liveList) {
    if (live_shielding.shieldingLiveRoomDecorated(liveData)) continue;
    shielding.addBlockButton({ data: liveData, maskingFunc: startShieldingLiveRoom$1 }, "gz_shielding_live_room_button");
  }
};
const liveStreamPartitionStyle = (show = false) => {
  const selectorCss = "#live_room_list_adaptive";
  const el = document.querySelector(selectorCss);
  if (el && show === false) {
    el.textContent = "";
  } else {
    elUtil.installStyle(liveRoomListAdaptiveCss, selectorCss);
  }
};
const run$5 = () => {
  liveCommon.addStyle();
  liveStreamPartitionStyle(isRoomListAdaptiveGm());
  liveCommon.setLivePageRightSidebarHide(isDelLivePageRightSidebarGm());
};
var liveSectionModel = {
  isLiveSection,
  run: run$5,
  liveStreamPartitionStyle,
  startShieldingLiveRoom: startShieldingLiveRoom$1
};var userProfile = {
  run() {
    elUtil.findElement("bili-user-profile", { parseShadowRoot: true }).then(async (el) => {
      const but = document.createElement("button");
      but.id = "chat";
      but.className = "gz-div";
      but.textContent = "屏蔽";
      but.addEventListener("click", () => {
        const data = document.querySelector("bili-user-profile")?.["__data"];
        const { card: { mid, name } } = data;
        eventEmitter.invoke("el-confirm", `是要屏蔽的用户${name}-【${mid}】吗？`).then(() => {
          const uid = parseInt(mid);
          if (ruleUtil.addRulePreciseUid(uid).status) {
            eventEmitter.send("通知屏蔽").send("event-检查评论区屏蔽");
          }
        });
      });
      const checkTheInsertButton = (el2) => {
        const actionEl = el2.querySelector("#action");
        if (actionEl === null) return;
        let gzDiv = el2.querySelector("#chat.gz-div");
        if (gzDiv === null) actionEl.appendChild(but);
      };
      checkTheInsertButton(el);
      const observer = new MutationObserver(() => {
        checkTheInsertButton(el);
      });
      observer.observe(el, { childList: true, subtree: true });
    });
  }
};const isLiveRoom = (url = location.href) => {
  return url.search("/live.bilibili.com/\\d+") !== -1 || url.search("https://live.bilibili.com/blanc/\\d+") !== -1 || url.includes("live.bilibili.com/blackboard/era");
};
const isLiveRoomActivity = () => {
  return isLiveRoom() && !document.title.endsWith("哔哩哔哩直播，二次元弹幕直播平台");
};
const setRoomBackgroundDisplay = (hide = true) => {
  elUtil.findElement("#room-background-vm").then((el) => {
    el.style.display = hide ? "none" : "";
    eventEmitter.send("打印信息", `已${hide ? "隐藏" : "显示"}直播间背景`);
  });
};
const setGiftControlPanelDisplay = (hide = true) => {
  elUtil.findElement("#gift-control-vm").then((el) => {
    el.style.display = hide ? "none" : "";
    eventEmitter.send("打印信息", `已${hide ? "隐藏" : "显示"}直播间礼物控制面板`);
  });
};
const getChatItems = async () => {
  let targetEl;
  if (isLiveRoomActivity()) {
    const iframeEl = await elUtil.findElement("#player-ctnr iframe");
    targetEl = iframeEl.contentDocument;
  } else {
    targetEl = document.body;
  }
  const elList = await elUtil.findElements("#chat-items>div", { doc: targetEl });
  const list = [];
  for (let el of elList) {
    if (el.className === "chat-item  convention-msg border-box") {
      continue;
    }
    if (el.className === "chat-item misc-msg guard-buy") {
      continue;
    }
    const name = el.getAttribute("data-uname");
    if (name === null) {
      continue;
    }
    let chatType;
    if (el.classList.contains("chat-emoticon")) {
      chatType = "emoticon";
    } else {
      chatType = "text";
    }
    const uid = parseInt(el.getAttribute("data-uid"));
    const content = el.getAttribute("data-danmaku");
    const timeStamp = parseInt(el.getAttribute("data-timestamp"));
    const fansMedalEl = el.querySelector(".fans-medal-content");
    const fansMedal = fansMedalEl === null ? null : fansMedalEl.textContent.trim();
    list.push({
      name,
      chatType,
      uid,
      content,
      timeStamp,
      fansMedal,
      el
    });
  }
  return list;
};
const getSCList = async () => {
  const elList = await elUtil.findElements(".card-wrapper>.card-item-box.child");
  const list = [];
  for (let el of elList) {
    const vueData = el["__vue__"];
    const { itemData } = vueData;
    const { userInfo } = itemData;
    const { message, uid } = itemData;
    const { uname, userLevel } = userInfo;
    const { fansMedal } = userInfo;
    let fansMedalName = null, fansMedalLevel = null;
    if (fansMedal) {
      fansMedalName = fansMedal.name;
      fansMedalLevel = fansMedal.level;
    }
    list.push({
      uname,
      userLevel,
      uid,
      message,
      fansMedalName,
      fansMedalLevel,
      el,
      vueData,
      itemData
    });
  }
  return list;
};
const checkSCList = async () => {
  const list = await getSCList();
  for (let v of list) {
    const { uid, uname, el, userLevel, fansMedalName, message } = v;
    asyncBlockUserUidAndName(uid, uname).then(() => asyncBlockComment(message)).then(() => asyncBlockByLevel(userLevel)).then(() => asyncBlockUserFanCard(fansMedalName)).catch((res) => {
      el?.remove();
      const { type, matching } = res;
      eventEmitter.send(
        "打印信息",
        `根据${type}屏蔽用户${uname}醒目留言:【${message}】,匹配值【${matching}】`
      );
    });
  }
};
const listeningSC = () => {
  elUtil.findElement("#pay-note-panel-vm").then((el) => {
    const observer = new MutationObserver(checkSCList);
    observer.observe(el, { childList: true, subtree: true });
  });
};
const startShieldingLiveChatContents = defUtil$1.throttle(async () => {
  const commentsDataList = await getChatItems();
  for (let commentsData of commentsDataList) {
    live_shielding.shieldingLiveRoomContent(commentsData);
  }
}, 2e3);
const delLivePageRightSidebarAd = () => {
  if (isDelLivePageRightSidebarGm()) {
    elUtil.findElement(".flip-view.p-relative.over-hidden.w-100").then((el) => {
      el.remove();
      eventEmitter.send("打印信息", "已删除直播间礼物栏下方横幅广告");
    });
  }
};
const run$4 = async () => {
  const isLiveRoomActivityVal = isLiveRoomActivity();
  if (!isLiveRoomActivityVal) {
    userProfile.run();
    listeningSC();
    checkSCList();
    delLivePageRightSidebarAd();
  }
  setInterval(() => {
    startShieldingLiveChatContents();
  }, 2e3);
  let targetEl;
  if (isLiveRoomActivityVal) {
    const iframeEl = await elUtil.findElement("#player-ctnr iframe");
    targetEl = iframeEl.contentDocument;
  } else {
    targetEl = document.body;
  }
  elUtil.findElement(".danmaku-menu", { doc: targetEl }).then((el) => {
    const selectEl = el.querySelector(".none-select");
    const butEl = document.createElement("div");
    butEl.textContent = "添加屏蔽(uid)";
    for (const name of selectEl.getAttributeNames()) {
      butEl.setAttribute(name, name === "class" ? "block-this-guy" : "");
    }
    selectEl.appendChild(butEl);
    butEl.addEventListener("click", () => {
      const vueData = el["__vue__"];
      console.log(vueData);
      const { uid, username } = vueData["info"];
      eventEmitter.invoke("el-confirm", `是要屏蔽的用户${username}-【${uid}】吗？`).then(() => {
        if (ruleUtil.addRulePreciseUid(uid).status) {
          startShieldingLiveChatContents();
        }
      });
    });
  });
  if (isRoomBackgroundHideGm()) {
    setRoomBackgroundDisplay();
  }
  if (isHideLiveGiftPanelGm()) {
    setGiftControlPanelDisplay();
  }
  liveCommon.setLivePageRightSidebarHide(isDelLivePageRightSidebarGm());
};
var liveRoomModel = {
  isLiveRoom,
  setRoomBackgroundDisplay,
  setGiftControlPanelDisplay,
  run: run$4,
  isLiveRoomActivity,
  delLivePageRightSidebarAd
};var script$w = {
  components: { dynamicCard: __vue_component__$x },
  data() {
    return {
      isRemoveSearchBottomContent: GM_getValue("isRemoveSearchBottomContent", false),
      isClearLiveCardVal: isClearLiveCardGm(),
      isDelPlayerPageAd: GM_getValue("isDelPlayerPageAd", false),
      isDelPlayerPageRightGameAd: GM_getValue("isDelPlayerPageRightGameAd", false),
      isDelPlayerPageRightVideoList: localMKData.isDelPlayerPageRightVideoList(),
      isDelBottomComment: localMKData.isDelBottomComment(),
      isClearTopInputTipContent: GM_getValue("isClearTopInputTipContent", false),
      isDelPlayerEndingPanelVal: localMKData.isDelPlayerEndingPanel(),
      isHideHotSearchesPanelVal: isHideHotSearchesPanelGm(),
      isHideSearchHistoryPanelVal: isHideSearchHistoryPanelGm(),
      isCloseCommentBlockingVal: isCloseCommentBlockingGm(),
      isHideCarouselImageVal: isHideCarouselImageGm(),
      isHideHomeTopHeaderBannerImageVal: isHideHomeTopHeaderBannerImageGm(),
      isHideTopHeaderChannelVal: isHideHomeTopHeaderChannelGm(),
      releaseTypeCardVals: getReleaseTypeCardsGm(),
      isAutomaticScrollingVal: isAutomaticScrollingGm(),
      isRoomListAdaptiveVal: isRoomListAdaptiveGm(),
      isDelLivePageRightSidebarVal: isDelLivePageRightSidebarGm(),
      isRoomBackgroundHideVal: isRoomBackgroundHideGm(),
      isHideLiveGiftPanelVal: isHideLiveGiftPanelGm(),
      isDelLiveBottomBannerAdVal: isDelLiveBottomBannerAdGm()
    };
  },
  methods: {},
  watch: {
    isRemoveSearchBottomContent(b) {
      GM_setValue("isRemoveSearchBottomContent", b);
    },
    isClearLiveCardVal(b) {
      GM_setValue("is_clear_live_card_gm", b);
    },
    isDelPlayerPageAd(b) {
      GM_setValue("isDelPlayerPageAd", b);
    },
    isDelPlayerPageRightGameAd(b) {
      GM_setValue("isDelPlayerPageRightGameAd", b);
    },
    isDelPlayerPageRightVideoList(b) {
      GM_setValue("isDelPlayerPageRightVideoList", b);
    },
    isDelBottomComment(b) {
      GM_setValue("isDelBottomComment", b);
    },
    isClearTopInputTipContent(b) {
      GM_setValue("isClearTopInputTipContent", b);
      if (b) {
        eventEmitter.send("执行清空顶部搜索框提示内容");
        return;
      }
      topInput.setTopInputPlaceholder();
    },
    isDelPlayerEndingPanelVal(n) {
      GM_setValue("is_del_player_ending_panel", n);
    },
    isHideHotSearchesPanelVal(n) {
      GM_setValue("is_hide_hot_searches_panel_gm", n);
      hotSearch.setTopSearchPanelDisplay(n, "热搜", 4e3);
    },
    isHideSearchHistoryPanelVal(n) {
      GM_setValue("is_hide_search_history_panel_gm", n);
      hotSearch.setTopSearchPanelDisplay(n, "搜索历史", 4e3);
    },
    isCloseCommentBlockingVal(n) {
      GM_setValue("is_close_comment_blocking_gm", n);
    },
    isHideCarouselImageVal(n) {
      GM_setValue("is_hide_carousel_image_gm", n);
      bilibiliHome.hideHomeCarouselImage(n, true);
    },
    isHideHomeTopHeaderBannerImageVal(n) {
      GM_setValue("is_hide_home_top_header_banner_image_gm", n);
      bilibiliHome.hideHomeTopHeaderBannerImage(n);
    },
    isHideTopHeaderChannelVal(n) {
      GM_setValue("is_hide_home_top_header_channel_gm", n);
      bilibiliHome.hideHomeTopHeaderChannel(n);
    },
    releaseTypeCardVals(n) {
      GM_setValue("release_type_cards_gm", n);
    },
    isAutomaticScrollingVal(n) {
      GM_setValue("is_automatic_scrolling_gm", n);
    },
    isRoomListAdaptiveVal(n) {
      GM_setValue("is_room_list_adaptive_gm", n);
      if (liveSectionModel.isLiveSection()) {
        liveSectionModel.liveStreamPartitionStyle(n);
      }
    },
    isDelLivePageRightSidebarVal(n) {
      GM_setValue("is_del_live_page_right_sidebar_gm", n);
      if (liveSectionModel.isLiveSection() || liveRoomModel.isLiveRoom()) {
        liveCommon.setLivePageRightSidebarHide(n);
      }
    },
    isRoomBackgroundHideVal(n) {
      GM_setValue("is_room_background_hide_gm", n);
      if (liveRoomModel.isLiveRoom()) {
        liveRoomModel.setRoomBackgroundDisplay(n);
      }
    },
    isHideLiveGiftPanelVal(n) {
      GM_setValue("is_hide_live_gift_panel_gm", n);
      if (liveRoomModel.isLiveRoom()) {
        liveRoomModel.setGiftControlPanelDisplay(n);
      }
    },
    isDelLiveBottomBannerAdVal(n) {
      GM_setValue("is_del_live_bottom_banner_ad_val_gm", n);
      if (liveRoomModel.isLiveRoom() && !liveRoomModel.isLiveRoomActivity()) {
        liveRoomModel.delLivePageRightSidebarAd();
      }
    }
  }
};
const __vue_script__$w = script$w;
var __vue_render__$w = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c(
        "el-card",
        {
          attrs: { shadow: "never" },
          scopedSlots: _vm._u([
            {
              key: "header",
              fn: function () {
                return [_c("span", [_vm._v("搜索页")])]
              },
              proxy: true,
            },
          ]),
        },
        [
          _vm._v(" "),
          _c("el-switch", {
            attrs: { "active-text": "屏蔽底部额外内容" },
            model: {
              value: _vm.isRemoveSearchBottomContent,
              callback: function ($$v) {
                _vm.isRemoveSearchBottomContent = $$v;
              },
              expression: "isRemoveSearchBottomContent",
            },
          }),
          _vm._v(" "),
          _c(
            "el-tooltip",
            { attrs: { content: "综合选项卡视频列表中出现的直播卡片" } },
            [
              _c("el-switch", {
                attrs: { "active-text": "屏蔽推荐直播类" },
                model: {
                  value: _vm.isClearLiveCardVal,
                  callback: function ($$v) {
                    _vm.isClearLiveCardVal = $$v;
                  },
                  expression: "isClearLiveCardVal",
                },
              }),
            ],
            1
          ),
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "el-card",
        {
          attrs: { shadow: "never" },
          scopedSlots: _vm._u([
            {
              key: "header",
              fn: function () {
                return [_c("span", [_vm._v("播放页")])]
              },
              proxy: true,
            },
          ]),
        },
        [
          _vm._v(" "),
          _c("el-switch", {
            attrs: { "active-text": "屏蔽页面元素广告" },
            model: {
              value: _vm.isDelPlayerPageAd,
              callback: function ($$v) {
                _vm.isDelPlayerPageAd = $$v;
              },
              expression: "isDelPlayerPageAd",
            },
          }),
          _vm._v(" "),
          _c("el-switch", {
            attrs: { "active-text": "屏蔽右侧游戏推荐" },
            model: {
              value: _vm.isDelPlayerPageRightGameAd,
              callback: function ($$v) {
                _vm.isDelPlayerPageRightGameAd = $$v;
              },
              expression: "isDelPlayerPageRightGameAd",
            },
          }),
          _vm._v(" "),
          _c(
            "el-tooltip",
            { attrs: { content: "移除整个推荐列表，状态刷新生效" } },
            [
              _c("el-switch", {
                attrs: { "active-text": "移除右侧推荐列表" },
                model: {
                  value: _vm.isDelPlayerPageRightVideoList,
                  callback: function ($$v) {
                    _vm.isDelPlayerPageRightVideoList = $$v;
                  },
                  expression: "isDelPlayerPageRightVideoList",
                },
              }),
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "el-tooltip",
            { attrs: { content: "状态刷新生效" } },
            [
              _c("el-switch", {
                attrs: { "active-text": "移除评论区" },
                model: {
                  value: _vm.isDelBottomComment,
                  callback: function ($$v) {
                    _vm.isDelBottomComment = $$v;
                  },
                  expression: "isDelBottomComment",
                },
              }),
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "el-tooltip",
            {
              attrs: {
                content:
                  "视频播放完之后会在播放器上显示推荐内容，开启之后移除播放器上整个推荐内容",
              },
            },
            [
              _c("el-switch", {
                attrs: { "active-text": "移除播放完推荐层" },
                model: {
                  value: _vm.isDelPlayerEndingPanelVal,
                  callback: function ($$v) {
                    _vm.isDelPlayerEndingPanelVal = $$v;
                  },
                  expression: "isDelPlayerEndingPanelVal",
                },
              }),
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "el-tooltip",
            { attrs: { content: "开启后评论屏蔽功能关闭" } },
            [
              _c("el-switch", {
                attrs: { "active-text": "关闭评论屏蔽" },
                model: {
                  value: _vm.isCloseCommentBlockingVal,
                  callback: function ($$v) {
                    _vm.isCloseCommentBlockingVal = $$v;
                  },
                  expression: "isCloseCommentBlockingVal",
                },
              }),
            ],
            1
          ),
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "el-card",
        {
          attrs: { shadow: "never" },
          scopedSlots: _vm._u([
            {
              key: "header",
              fn: function () {
                return [_c("span", [_vm._v("顶部搜索框")])]
              },
              proxy: true,
            },
          ]),
        },
        [
          _vm._v(" "),
          _c("el-switch", {
            attrs: { "active-text": "清空内容" },
            model: {
              value: _vm.isClearTopInputTipContent,
              callback: function ($$v) {
                _vm.isClearTopInputTipContent = $$v;
              },
              expression: "isClearTopInputTipContent",
            },
          }),
          _vm._v(" "),
          _c("el-switch", {
            attrs: { "active-text": "隐藏热搜" },
            model: {
              value: _vm.isHideHotSearchesPanelVal,
              callback: function ($$v) {
                _vm.isHideHotSearchesPanelVal = $$v;
              },
              expression: "isHideHotSearchesPanelVal",
            },
          }),
          _vm._v(" "),
          _c("el-switch", {
            attrs: { "active-text": "隐藏搜索历史" },
            model: {
              value: _vm.isHideSearchHistoryPanelVal,
              callback: function ($$v) {
                _vm.isHideSearchHistoryPanelVal = $$v;
              },
              expression: "isHideSearchHistoryPanelVal",
            },
          }),
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "el-card",
        {
          attrs: { shadow: "never" },
          scopedSlots: _vm._u([
            {
              key: "header",
              fn: function () {
                return [_vm._v("首页")]
              },
              proxy: true,
            },
          ]),
        },
        [
          _vm._v(" "),
          _c("el-switch", {
            attrs: { "active-text": "隐藏轮播图" },
            model: {
              value: _vm.isHideCarouselImageVal,
              callback: function ($$v) {
                _vm.isHideCarouselImageVal = $$v;
              },
              expression: "isHideCarouselImageVal",
            },
          }),
          _vm._v(" "),
          _c("el-switch", {
            attrs: { "active-text": "隐藏顶部标题横幅图片" },
            model: {
              value: _vm.isHideHomeTopHeaderBannerImageVal,
              callback: function ($$v) {
                _vm.isHideHomeTopHeaderBannerImageVal = $$v;
              },
              expression: "isHideHomeTopHeaderBannerImageVal",
            },
          }),
          _vm._v(" "),
          _c(
            "el-tooltip",
            {
              attrs: { content: "隐藏视频列表上方的动态、热门、频道栏一整行" },
            },
            [
              _c("el-switch", {
                attrs: { "active-text": "隐藏顶部页面频道栏" },
                model: {
                  value: _vm.isHideTopHeaderChannelVal,
                  callback: function ($$v) {
                    _vm.isHideTopHeaderChannelVal = $$v;
                  },
                  expression: "isHideTopHeaderChannelVal",
                },
              }),
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "el-tooltip",
            {
              attrs: {
                content:
                  "定时检测首页视频列表数量，如果数量<=9则模拟鼠标上下滚动",
              },
            },
            [
              _c("el-switch", {
                attrs: { "active-text": "检查视频列表数量模拟鼠标上下滚动" },
                model: {
                  value: _vm.isAutomaticScrollingVal,
                  callback: function ($$v) {
                    _vm.isAutomaticScrollingVal = $$v;
                  },
                  expression: "isAutomaticScrollingVal",
                },
              }),
            ],
            1
          ),
          _vm._v(" "),
          _c("el-divider"),
          _vm._v(" "),
          _c(
            "el-tooltip",
            {
              attrs: {
                content: "但视频列表中出现选择的类型时跳过，反之屏蔽",
                placement: "top",
              },
            },
            [
              _c(
                "div",
                [
                  _vm._v("放行的卡片\n        "),
                  _c("el-divider"),
                  _vm._v(" "),
                  _c(
                    "el-checkbox-group",
                    {
                      model: {
                        value: _vm.releaseTypeCardVals,
                        callback: function ($$v) {
                          _vm.releaseTypeCardVals = $$v;
                        },
                        expression: "releaseTypeCardVals",
                      },
                    },
                    [
                      _c("el-checkbox", { attrs: { label: "直播" } }),
                      _vm._v(" "),
                      _c("el-checkbox", { attrs: { label: "番剧" } }),
                      _vm._v(" "),
                      _c("el-checkbox", { attrs: { label: "电影" } }),
                      _vm._v(" "),
                      _c("el-checkbox", { attrs: { label: "国创" } }),
                      _vm._v(" "),
                      _c("el-checkbox", { attrs: { label: "综艺" } }),
                      _vm._v(" "),
                      _c("el-checkbox", { attrs: { label: "课堂" } }),
                      _vm._v(" "),
                      _c("el-checkbox", { attrs: { label: "电视剧" } }),
                      _vm._v(" "),
                      _c("el-checkbox", { attrs: { label: "纪录片" } }),
                      _vm._v(" "),
                      _c("el-checkbox", { attrs: { label: "漫画" } }),
                    ],
                    1
                  ),
                ],
                1
              ),
            ]
          ),
        ],
        1
      ),
      _vm._v(" "),
      _c("dynamicCard"),
      _vm._v(" "),
      _c(
        "el-card",
        {
          attrs: { shadow: "never" },
          scopedSlots: _vm._u([
            {
              key: "header",
              fn: function () {
                return [_vm._v("直播页")]
              },
              proxy: true,
            },
          ]),
        },
        [
          _vm._v(" "),
          _c("el-switch", {
            attrs: { "active-text": "屏蔽右侧侧边栏" },
            model: {
              value: _vm.isDelLivePageRightSidebarVal,
              callback: function ($$v) {
                _vm.isDelLivePageRightSidebarVal = $$v;
              },
              expression: "isDelLivePageRightSidebarVal",
            },
          }),
          _vm._v(" "),
          _c("el-divider"),
          _vm._v("\n    直播分区页\n    "),
          _c("el-divider"),
          _vm._v(" "),
          _c("el-switch", {
            attrs: { "active-text": "房间列表自适应" },
            model: {
              value: _vm.isRoomListAdaptiveVal,
              callback: function ($$v) {
                _vm.isRoomListAdaptiveVal = $$v;
              },
              expression: "isRoomListAdaptiveVal",
            },
          }),
          _vm._v(" "),
          _c("el-divider"),
          _vm._v("\n    直播间\n    "),
          _c("el-divider"),
          _vm._v(" "),
          _c("el-switch", {
            attrs: { "active-text": "背景移除" },
            model: {
              value: _vm.isRoomBackgroundHideVal,
              callback: function ($$v) {
                _vm.isRoomBackgroundHideVal = $$v;
              },
              expression: "isRoomBackgroundHideVal",
            },
          }),
          _vm._v(" "),
          _c("el-switch", {
            attrs: { "active-text": "隐藏礼物栏" },
            model: {
              value: _vm.isHideLiveGiftPanelVal,
              callback: function ($$v) {
                _vm.isHideLiveGiftPanelVal = $$v;
              },
              expression: "isHideLiveGiftPanelVal",
            },
          }),
          _vm._v(" "),
          _c("el-switch", {
            attrs: {
              "active-text": "移除底部横幅广告",
              title: "移除页面礼物栏下方的横幅广告",
            },
            model: {
              value: _vm.isDelLiveBottomBannerAdVal,
              callback: function ($$v) {
                _vm.isDelLiveBottomBannerAdVal = $$v;
              },
              expression: "isDelLiveBottomBannerAdVal",
            },
          }),
        ],
        1
      ),
    ],
    1
  )
};
var __vue_staticRenderFns__$w = [];
__vue_render__$w._withStripped = true;
  const __vue_inject_styles__$w = undefined;
  const __vue_component__$w = normalizeComponent(
    { render: __vue_render__$w, staticRenderFns: __vue_staticRenderFns__$w },
    __vue_inject_styles__$w,
    __vue_script__$w);var script$v = {
  data() {
    return {
      group_url: globalValue.group_url,
      scriptCat_js_url: globalValue.scriptCat_js_url,
      b_url: globalValue.b_url,
      common_question_url: globalValue.common_question_url,
      update_log_url: globalValue.update_log_url
    };
  },
  methods: {
    lookImgBut() {
      eventEmitter.send("显示图片对话框", { image: "https://www.mikuchase.ltd/img/qq_group_876295632.webp" });
    }
  }
};
const __vue_script__$v = script$v;
var __vue_render__$v = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c(
        "el-card",
        {
          scopedSlots: _vm._u([
            {
              key: "header",
              fn: function () {
                return [_c("span", [_vm._v("作者b站")])]
              },
              proxy: true,
            },
          ]),
        },
        [
          _vm._v(" "),
          _c(
            "el-link",
            { attrs: { href: _vm.b_url, target: "_blank", type: "primary" } },
            [_vm._v("b站传送门")]
          ),
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "el-card",
        {
          scopedSlots: _vm._u([
            {
              key: "header",
              fn: function () {
                return [_c("span", [_vm._v("交流群")])]
              },
              proxy: true,
            },
          ]),
        },
        [
          _vm._v(" "),
          _c(
            "el-link",
            {
              attrs: { href: _vm.group_url, target: "_blank", type: "primary" },
            },
            [_vm._v("====》Q群传送门《====\n    ")]
          ),
          _vm._v(" "),
          _c(
            "el-tooltip",
            { attrs: { content: "点击查看群二维码" } },
            [
              _c("el-tag", { on: { click: _vm.lookImgBut } }, [
                _vm._v("876295632"),
              ]),
            ],
            1
          ),
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "el-card",
        {
          scopedSlots: _vm._u([
            {
              key: "header",
              fn: function () {
                return [_c("span", [_vm._v("发布、更新、反馈地址")])]
              },
              proxy: true,
            },
          ]),
        },
        [
          _vm._v(" "),
          _c(
            "el-row",
            [
              _c(
                "el-col",
                { attrs: { span: 12 } },
                [
                  _c(
                    "el-card",
                    [
                      _c("span", [_vm._v("greasyfork")]),
                      _vm._v(" "),
                      _c(
                        "el-link",
                        {
                          attrs: {
                            href: "https://greasyfork.org/scripts/461382/",
                            target: "_blank",
                            type: "primary",
                          },
                        },
                        [_vm._v("===》传送门《===\n          ")]
                      ),
                    ],
                    1
                  ),
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "el-col",
                { attrs: { span: 12 } },
                [
                  _c(
                    "el-card",
                    [
                      _c("span", [_vm._v("脚本猫")]),
                      _vm._v(" "),
                      _c(
                        "el-link",
                        {
                          attrs: {
                            href: _vm.scriptCat_js_url,
                            target: "_blank",
                            type: "primary",
                          },
                        },
                        [_vm._v("\n            ===》传送门《===\n          ")]
                      ),
                    ],
                    1
                  ),
                ],
                1
              ),
            ],
            1
          ),
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "el-card",
        {
          scopedSlots: _vm._u([
            {
              key: "header",
              fn: function () {
                return [_c("span", [_vm._v("开源地址")])]
              },
              proxy: true,
            },
          ]),
        },
        [
          _vm._v(" "),
          _c(
            "el-row",
            [
              _c(
                "el-col",
                { attrs: { span: 12 } },
                [
                  _c(
                    "el-card",
                    [
                      _c("span", [_vm._v("gitee")]),
                      _vm._v(" "),
                      _c(
                        "el-link",
                        {
                          attrs: {
                            href: "https://gitee.com/hangexi/BiBiBSPUserVideoMonkeyScript",
                            target: "_blank",
                            type: "primary",
                          },
                        },
                        [
                          _vm._v(
                            "https://gitee.com/hangexi/BiBiBSPUserVideoMonkeyScript\n          "
                          ),
                        ]
                      ),
                    ],
                    1
                  ),
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "el-col",
                { attrs: { span: 12 } },
                [
                  _c(
                    "el-card",
                    [
                      _c("span", [_vm._v("github")]),
                      _vm._v(" "),
                      _c(
                        "el-link",
                        {
                          attrs: {
                            href: "https://github.com/hgztask/BiBiBSPUserVideoMonkeyScript",
                            target: "_blank",
                            type: "primary",
                          },
                        },
                        [
                          _vm._v(
                            "https://github.com/hgztask/BiBiBSPUserVideoMonkeyScript\n          "
                          ),
                        ]
                      ),
                    ],
                    1
                  ),
                ],
                1
              ),
            ],
            1
          ),
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "el-card",
        {
          scopedSlots: _vm._u([
            {
              key: "header",
              fn: function () {
                return [_vm._v("常见问题和使用文档")]
              },
              proxy: true,
            },
          ]),
        },
        [
          _vm._v(" "),
          _c(
            "el-row",
            [
              _c(
                "el-col",
                { attrs: { span: 12 } },
                [
                  _vm._v("\n        常见问题\n        "),
                  _c(
                    "el-link",
                    {
                      attrs: {
                        href: _vm.common_question_url,
                        target: "_blank",
                        type: "primary",
                      },
                    },
                    [_vm._v("==>传送门<==\n        ")]
                  ),
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "el-col",
                { attrs: { span: 12 } },
                [
                  _vm._v("\n        使用文档\n        "),
                  _c(
                    "el-link",
                    {
                      attrs: {
                        href: "https://docs.qq.com/doc/DSmJqSkhFaktBeUdk?u=1a1ff7b128d64f188a8bfb71b5acb28c",
                        target: "_blank",
                        type: "primary",
                      },
                    },
                    [_vm._v("==>传送门<==\n        ")]
                  ),
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "div",
                [
                  _vm._v("\n        更新日志\n        "),
                  _c(
                    "el-link",
                    {
                      attrs: {
                        href: _vm.update_log_url,
                        target: "_blank",
                        type: "primary",
                      },
                    },
                    [_vm._v("==>传送门<==")]
                  ),
                ],
                1
              ),
            ],
            1
          ),
        ],
        1
      ),
    ],
    1
  )
};
var __vue_staticRenderFns__$v = [];
__vue_render__$v._withStripped = true;
  const __vue_inject_styles__$v = undefined;
  const __vue_component__$v = normalizeComponent(
    { render: __vue_render__$v, staticRenderFns: __vue_staticRenderFns__$v },
    __vue_inject_styles__$v,
    __vue_script__$v);var script$u = {
  data() {
    return {
      show: false,
      title: "图片查看",
      imgList: [],
      imgSrc: "",
      isModal: true
    };
  },
  created() {
    eventEmitter.on("显示图片对话框", ({ image, title, images, isModal }) => {
      this.imgSrc = image;
      if (title) {
        this.title = title;
      }
      if (images) {
        this.imgList = images;
      } else {
        this.imgList = [image];
      }
      if (isModal) {
        this.isModal = isModal;
      }
      this.show = true;
    });
  }
};
const __vue_script__$u = script$u;
var __vue_render__$u = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c(
        "el-dialog",
        {
          attrs: {
            modal: _vm.isModal,
            title: _vm.title,
            visible: _vm.show,
            center: "",
          },
          on: {
            "update:visible": function ($event) {
              _vm.show = $event;
            },
          },
        },
        [
          _c(
            "div",
            { staticClass: "el-vertical-center" },
            [
              _c("el-image", {
                attrs: { "preview-src-list": _vm.imgList, src: _vm.imgSrc },
              }),
            ],
            1
          ),
        ]
      ),
    ],
    1
  )
};
var __vue_staticRenderFns__$u = [];
__vue_render__$u._withStripped = true;
  const __vue_inject_styles__$u = undefined;
  const __vue_component__$u = normalizeComponent(
    { render: __vue_render__$u, staticRenderFns: __vue_staticRenderFns__$u },
    __vue_inject_styles__$u,
    __vue_script__$u);var script$t = {
  data() {
    return {
      visible: false,
      optionsList: [],
      dialogTitle: "",
      optionsClick: null,
      closeOnClickModal: true,
      contents: []
    };
  },
  methods: {
    handleClose() {
      this.visible = false;
      if (this.contents.length > 0) {
        this.contents = [];
      }
    },
    handleOptionsClick(item) {
      if (this.closeOnClickModal) {
        return;
      }
      let tempBool;
      const temp = this.optionsClick(item);
      if (temp === void 0) {
        tempBool = false;
      } else {
        tempBool = temp;
      }
      this.visible = tempBool === true;
    }
  },
  created() {
    eventEmitter.on("sheet-dialog", ({
      list,
      optionsClick,
      title = "选项",
      closeOnClickModal = false,
      contents
    }) => {
      this.visible = true;
      this.optionsList = list;
      this.dialogTitle = title;
      this.optionsClick = optionsClick;
      this.closeOnClickModal = closeOnClickModal;
      if (contents) {
        this.contents = contents;
      }
    });
  }
};
const __vue_script__$t = script$t;
var __vue_render__$t = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c(
        "el-dialog",
        {
          attrs: {
            "close-on-click-modal": _vm.closeOnClickModal,
            title: _vm.dialogTitle,
            visible: _vm.visible,
            center: "",
            width: "30%",
          },
          on: { close: _vm.handleClose },
        },
        [
          _c(
            "div",
            [
              _c(
                "el-row",
                [
                  _c(
                    "el-col",
                    _vm._l(_vm.contents, function (v) {
                      return _c("div", { key: v }, [_vm._v(_vm._s(v))])
                    }),
                    0
                  ),
                  _vm._v(" "),
                  _vm._l(_vm.optionsList, function (item) {
                    return _c(
                      "el-col",
                      { key: item.label },
                      [
                        _c(
                          "el-button",
                          {
                            staticStyle: { width: "100%" },
                            attrs: { title: item.title },
                            on: {
                              click: function ($event) {
                                return _vm.handleOptionsClick(item)
                              },
                            },
                          },
                          [_vm._v(_vm._s(item.label) + "\n          ")]
                        ),
                      ],
                      1
                    )
                  }),
                ],
                2
              ),
            ],
            1
          ),
        ]
      ),
    ],
    1
  )
};
var __vue_staticRenderFns__$t = [];
__vue_render__$t._withStripped = true;
  const __vue_inject_styles__$t = undefined;
  const __vue_component__$t = normalizeComponent(
    { render: __vue_render__$t, staticRenderFns: __vue_staticRenderFns__$t },
    __vue_inject_styles__$t,
    __vue_script__$t);var script$s = {
  data: () => {
    return {
      resData: {},
      resList: []
    };
  },
  methods: {
    async initial() {
      const { state, list, msg } = await bFetch.fetchGetBarrageBlockingWords();
      if (!state) {
        this.$message.warning(msg);
        return false;
      }
      this.resList = list;
      this.$notify({ message: "已初始化", type: "success" });
      return true;
    },
    fetchGetBarrageBlockingWordsBut() {
      if (this.resList.length === 0) {
        this.$message.info("未有弹幕屏蔽词内容或未初始化");
        return;
      }
      const list = this.resList;
      this.$message.success(`已打印在控制台上，数量${list.length}`);
      console.log("获取弹幕屏蔽词_start=====");
      console.log(list);
      console.log("获取弹幕屏蔽词_end=======");
    },
    outToJsonFIleBut() {
    }
  },
  created() {
    this.initial();
  }
};
const __vue_script__$s = script$s;
var __vue_render__$s = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c("el-button", { on: { click: _vm.fetchGetBarrageBlockingWordsBut } }, [
        _vm._v("获取弹幕屏蔽词"),
      ]),
      _vm._v(" "),
      _c("el-button", { on: { click: _vm.outToJsonFIleBut } }, [
        _vm._v("导出至json文件"),
      ]),
    ],
    1
  )
};
var __vue_staticRenderFns__$s = [];
__vue_render__$s._withStripped = true;
  const __vue_inject_styles__$s = undefined;
  const __vue_component__$s = normalizeComponent(
    { render: __vue_render__$s, staticRenderFns: __vue_staticRenderFns__$s },
    __vue_inject_styles__$s,
    __vue_script__$s);const outputInformationFontColor = localMKData.getOutputInformationFontColor();
const highlightInformationColor = localMKData.getHighlightInformationColor();
var script$r = {
  data() {
    return {
      outputInfoArr: []
    };
  },
  methods: {
    clearInfoBut() {
      this.$confirm("是否清空信息", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.outputInfoArr = [];
        this.$notify({
          message: "已清空信息",
          type: "success"
        });
      });
    },
    updateOutInfo(infoData, index) {
      const outPutInfoData = this.outputInfoArr[index];
      outPutInfoData.count++;
      outPutInfoData.time = defUtil$1.toTimeString();
      outPutInfoData.content = infoData.content;
      this.outputInfoArr.splice(index, 1);
      this.outputInfoArr.unshift(outPutInfoData);
    },
    addOutInfo(infoData) {
      const findIdIndex = this.outputInfoArr.findIndex((item) => {
        if (infoData.id === void 0 || item.id === void 0) {
          return false;
        }
        return item.id === infoData.id;
      });
      if (findIdIndex !== -1) {
        this.updateOutInfo(infoData, findIdIndex);
        return;
      }
      const findContentIndex = this.outputInfoArr.findIndex((item) => item.content === infoData.content);
      if (findContentIndex !== -1) {
        this.updateOutInfo(infoData, findContentIndex);
        return;
      }
      infoData.time = defUtil$1.toTimeString();
      infoData.count = 1;
      this.outputInfoArr.unshift(infoData);
    }
  },
  created() {
    eventEmitter.on("打印信息", (content) => {
      this.addOutInfo({ type: "info", content });
    });
    eventEmitter.on("event-update-out-info", (data) => {
      this.addOutInfo({
        type: "update-out-info",
        id: data.id,
        content: data.msg
      });
    });
    eventEmitter.on("event-打印屏蔽视频信息", (type, matching, videoData) => {
      if (isWsService()) {
        eventEmitter.send("ws-send-json", { type, matching, videoData });
      }
      const { name, uid, title, videoUrl } = videoData;
      const info = `<b style="color: ${outputInformationFontColor}; ">
根据${type}-${matching ? `<b style="color: ${highlightInformationColor}">【${matching}】</b>` : ""}-屏蔽用户【${name}】uid=
            <a href="https://space.bilibili.com/${uid}"
            style="color: ${highlightInformationColor}"
            target="_blank">【${uid}】</a>
            标题【<a href="${videoUrl}" target="_blank" style="color: ${highlightInformationColor}">${title}</a>】
            </b>`;
      this.addOutInfo({
        type: "shield-video-info",
        content: info
      });
    });
    eventEmitter.on("屏蔽评论信息", (type, matching, commentData) => {
      const { name, uid, content } = commentData;
      this.addOutInfo({
        type: "shield-comment-info",
        content: `<b style="color: ${outputInformationFontColor};">
根据${type}-${matching ? `<b style="color: ${highlightInformationColor}">【${matching}】</b>` : ""}-屏蔽用户【${name}】uid=
            <a href="https://space.bilibili.com/${uid}"
            style="color: ${highlightInformationColor}"
            target="_blank">【${uid}】</a>
            评论【${content}】
            </b>`
      });
    });
    eventEmitter.on("正则匹配时异常", (errorData) => {
      const { msg, e } = errorData;
      this.addOutInfo({
        type: "error",
        content: msg
      });
      console.error(msg);
      throw new Error(e);
    });
  }
};
const __vue_script__$r = script$r;
var __vue_render__$r = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c(
        "el-table",
        { attrs: { data: _vm.outputInfoArr, border: "", stripe: "" } },
        [
          _c("el-table-column", {
            attrs: { prop: "time", label: "显示时间", width: "148" },
          }),
          _vm._v(" "),
          _c("el-table-column", {
            scopedSlots: _vm._u([
              {
                key: "header",
                fn: function () {
                  return [
                    _c(
                      "el-button",
                      {
                        attrs: { type: "info" },
                        on: { click: _vm.clearInfoBut },
                      },
                      [_vm._v("清空消息")]
                    ),
                  ]
                },
                proxy: true,
              },
              {
                key: "default",
                fn: function (scope) {
                  return [
                    _c("div", {
                      domProps: { innerHTML: _vm._s(scope.row.content) },
                    }),
                  ]
                },
              },
            ]),
          }),
          _vm._v(" "),
          _c("el-table-column", {
            attrs: { label: "计数", width: "50", prop: "count" },
          }),
        ],
        1
      ),
    ],
    1
  )
};
var __vue_staticRenderFns__$r = [];
__vue_render__$r._withStripped = true;
  const __vue_inject_styles__$r = undefined;
  const __vue_component__$r = normalizeComponent(
    { render: __vue_render__$r, staticRenderFns: __vue_staticRenderFns__$r },
    __vue_inject_styles__$r,
    __vue_script__$r);var script$q = {
  data() {
    return {
      list: [
        {
          name: "支付宝赞助",
          alt: "支付宝支持",
          src: "https://www.mikuchase.ltd/img/paymentCodeZFB.webp"
        },
        { name: "微信赞助", alt: "微信支持", src: "https://www.mikuchase.ltd/img/paymentCodeWX.webp" },
        { name: "QQ赞助", alt: "QQ支持", src: "https://www.mikuchase.ltd/img/paymentCodeQQ.webp" }
      ],
      dialogIni: {
        title: "打赏点猫粮",
        show: false,
        srcList: []
      }
    };
  },
  methods: {
    showDialogBut() {
      this.dialogIni.show = true;
    },
    gotoAuthorBut() {
      GM_openInTab(globalValue.b_url);
    }
  },
  created() {
    this.dialogIni.srcList = this.list.map((x) => x.src);
  }
};
const __vue_script__$q = script$q;
var __vue_render__$q = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c(
        "el-card",
        {
          attrs: { shadow: "hover" },
          scopedSlots: _vm._u([
            {
              key: "header",
              fn: function () {
                return [_c("span", [_vm._v("零钱赞助")])]
              },
              proxy: true,
            },
          ]),
        },
        [
          _vm._v(" "),
          _c("span", [_vm._v("1元不嫌少，10元不嫌多，感谢支持！")]),
          _vm._v(" "),
          _c("el-divider"),
          _vm._v(" "),
          _c("span", [_vm._v("生活不易，作者叹息")]),
          _vm._v(" "),
          _c("el-divider"),
          _vm._v(" "),
          _c("span", [_vm._v("用爱发电不容易，您的支持是我最大的更新动力")]),
        ],
        1
      ),
      _vm._v(" "),
      _c("el-divider"),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "el-vertical-center", on: { click: _vm.gotoAuthorBut } },
        [
          _c("el-avatar", {
            attrs: {
              size: "large",
              src: "//i0.hdslb.com/bfs/face/87e9c69a15f7d2b68294be165073c8e07a541e28.jpg@128w_128h_1c_1s.webp",
            },
          }),
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "el-vertical-center" },
        [
          _c(
            "el-button",
            {
              attrs: { round: "", type: "primary" },
              on: { click: _vm.showDialogBut },
            },
            [_vm._v("打赏点猫粮")]
          ),
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "el-dialog",
        {
          attrs: {
            title: _vm.dialogIni.title,
            visible: _vm.dialogIni.show,
            center: "",
          },
          on: {
            "update:visible": function ($event) {
              return _vm.$set(_vm.dialogIni, "show", $event)
            },
          },
        },
        [
          _c(
            "div",
            { staticClass: "el-vertical-center" },
            _vm._l(_vm.list, function (item) {
              return _c("el-image", {
                key: item.name,
                staticStyle: { height: "300px" },
                attrs: {
                  "preview-src-list": _vm.dialogIni.srcList,
                  src: item.src,
                },
              })
            }),
            1
          ),
        ]
      ),
    ],
    1
  )
};
var __vue_staticRenderFns__$q = [];
__vue_render__$q._withStripped = true;
  const __vue_inject_styles__$q = undefined;
  const __vue_component__$q = normalizeComponent(
    { render: __vue_render__$q, staticRenderFns: __vue_staticRenderFns__$q },
    __vue_inject_styles__$q,
    __vue_script__$q);var script$p = {
  data() {
    return {
      tableData: getSubstituteWordsArr(),
      enableReplacementProcessingVal: enableReplacementProcessing(),
      clearCommentEmoticonsVal: isClearCommentEmoticons(),
      isReplaceCommentSearchTermsVal: isReplaceCommentSearchTerms()
    };
  },
  methods: {
    validate(item) {
      if (item.actionScopes.length === 0) {
        this.$message.error("请选择作用域再后续处理");
        return;
      }
      if (item.findVal === "") {
        this.$message.error("请输入查找内容再后续处理");
        return;
      }
      return true;
    },
    verifyDuplicate(val) {
      if (val === "") return;
      const set =  new Set();
      for (const v of this.tableData) {
        if (set.has(v.findVal)) {
          this.$alert(`已添加过该查找值，不可重复添加【${v.findVal}】`, "错误", {
            type: "error"
          });
          return;
        }
        set.add(v.findVal);
      }
    },
    addBut() {
      this.tableData.unshift({
        actionScopes: ["评论内容"],
        findVal: "",
        replaceVal: ""
      });
      this.$notify({ message: "已添加一条替换处理到顶部" });
    },
    delItemBut(row, index) {
      if (row.findVal === "" && row.replaceVal === "") {
        this.tableData.splice(index, 1);
        this.$notify({ message: "已删除一条替换处理" });
        return;
      }
      if (this.validate(row) !== true) return;
      this.$confirm("确定删除该条替换处理吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.tableData.splice(index, 1);
        this.$notify({ message: "已删除一条替换处理" });
      });
    },
    refreshBut() {
      this.tableData = getSubstituteWordsArr();
      this.$message.info("已刷新");
    },
    saveBut() {
      if (this.tableData.length === 0) {
        this.$message.error("请先添加数据再保存！");
        return;
      }
      for (let item of this.tableData) {
        if (this.validate(item) !== true) return;
      }
      const duplicateRemoval =  new Set();
      for (const v of this.tableData) {
        if (duplicateRemoval.has(v.findVal)) {
          this.$alert(`查找内容不能重复【${v.findVal}】`, "错误", {
            type: "error"
          });
          return;
        }
        duplicateRemoval.add(v.findVal);
      }
      GM_setValue("substitute_words", this.tableData);
      this.$message.success("已保存");
    },
    actionScopesChange(newArr) {
      if (newArr.length === 0) return;
      if (newArr.some((v) => v === "评论表情")) {
        newArr.splice(0, newArr.length, "评论表情");
      }
    }
  },
  watch: {
    clearCommentEmoticonsVal(n) {
      GM_setValue("is_clear_comment_emoticons", n);
    },
    isReplaceCommentSearchTermsVal(n) {
      GM_setValue("is_replace_comment_search_terms", n);
    }
  }
};
const __vue_script__$p = script$p;
var __vue_render__$p = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c("el-card", {
        attrs: { shadow: "never" },
        scopedSlots: _vm._u([
          {
            key: "header",
            fn: function () {
              return [
                _vm._v("说明\n      "),
                _c(
                  "el-row",
                  [
                    _c("el-col", { attrs: { span: 12 } }, [
                      _c("div", [_vm._v("1.评论内容暂不支持替换表情")]),
                      _vm._v(" "),
                      _c("div", [_vm._v("2.如修改后或添加数据需保存方可生效")]),
                      _vm._v(" "),
                      _c("div", [_vm._v("3.暂不支持标题替换")]),
                      _vm._v(" "),
                      _c(
                        "div",
                        [
                          _vm._v("4.支持正则替换，\n            "),
                          _c(
                            "el-link",
                            {
                              attrs: {
                                href: "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replaceAll",
                                target: "_blank",
                                type: "primary",
                              },
                            },
                            [
                              _vm._v(
                                "\n              详情参考js中的replaceAll用法\n            "
                              ),
                            ]
                          ),
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c("div", [_vm._v("5.搜索暂时先用快捷键ctrl+f代替")]),
                      _vm._v(" "),
                      _c("div", [
                        _vm._v(
                          "6.作用域中，选择了评论表情再选其他之前需要取消选项评论表情"
                        ),
                      ]),
                      _vm._v(" "),
                      _c(
                        "div",
                        [
                          _vm._v(
                            "7.评论表情，查找时要用英文输入法[]包裹表情关键词，留空为评论中移除该表情。反之替换普通文本内容。\n            "
                          ),
                          _c(
                            "el-link",
                            {
                              attrs: {
                                href: "https://docs.qq.com/doc/DSlJNR1NVcGR3eEto",
                                target: "_blank",
                                title: "页面中用搜索定位表情包对照表",
                                type: "primary",
                              },
                            },
                            [_vm._v("表情包对照表\n            ")]
                          ),
                        ],
                        1
                      ),
                    ]),
                    _vm._v(" "),
                    _c(
                      "el-col",
                      { attrs: { span: 12 } },
                      [
                        _c(
                          "el-card",
                          {
                            attrs: { shadow: "never" },
                            scopedSlots: _vm._u([
                              {
                                key: "header",
                                fn: function () {
                                  return [_vm._v("全局")]
                                },
                                proxy: true,
                              },
                            ]),
                          },
                          [
                            _vm._v(" "),
                            _c(
                              "el-tooltip",
                              {
                                attrs: {
                                  content: "当该选项未启用时下面表格中的不生效",
                                },
                              },
                              [
                                _c("el-switch", {
                                  attrs: { "active-text": "启用" },
                                  model: {
                                    value: _vm.enableReplacementProcessingVal,
                                    callback: function ($$v) {
                                      _vm.enableReplacementProcessingVal = $$v;
                                    },
                                    expression:
                                      "enableReplacementProcessingVal",
                                  },
                                }),
                              ],
                              1
                            ),
                            _vm._v(" "),
                            _c("el-switch", {
                              attrs: { "active-text": "清除评论表情" },
                              model: {
                                value: _vm.clearCommentEmoticonsVal,
                                callback: function ($$v) {
                                  _vm.clearCommentEmoticonsVal = $$v;
                                },
                                expression: "clearCommentEmoticonsVal",
                              },
                            }),
                            _vm._v(" "),
                            _c(
                              "el-tooltip",
                              {
                                attrs: {
                                  content:
                                    "将评论中的蓝色关键词带搜索小图标的内容替换成普通文本内容",
                                },
                              },
                              [
                                _c("el-switch", {
                                  attrs: { "active-text": "替换评论搜索词" },
                                  model: {
                                    value: _vm.isReplaceCommentSearchTermsVal,
                                    callback: function ($$v) {
                                      _vm.isReplaceCommentSearchTermsVal = $$v;
                                    },
                                    expression:
                                      "isReplaceCommentSearchTermsVal",
                                  },
                                }),
                              ],
                              1
                            ),
                          ],
                          1
                        ),
                      ],
                      1
                    ),
                  ],
                  1
                ),
              ]
            },
            proxy: true,
          },
        ]),
      }),
      _vm._v(" "),
      _c(
        "el-table",
        { attrs: { data: _vm.tableData, border: "", stripe: "" } },
        [
          _c("el-table-column", {
            attrs: { label: "作用域", width: "450px" },
            scopedSlots: _vm._u([
              {
                key: "default",
                fn: function (scope) {
                  return [
                    _c(
                      "el-checkbox-group",
                      {
                        on: { change: _vm.actionScopesChange },
                        model: {
                          value: scope.row.actionScopes,
                          callback: function ($$v) {
                            _vm.$set(scope.row, "actionScopes", $$v);
                          },
                          expression: "scope.row.actionScopes",
                        },
                      },
                      [
                        _c("el-checkbox", {
                          attrs: {
                            border: "",
                            disabled: "",
                            label: "视频标题",
                          },
                        }),
                        _vm._v(" "),
                        _c("el-checkbox", {
                          attrs: { border: "", label: "评论内容" },
                        }),
                        _vm._v(" "),
                        _c("el-checkbox", {
                          attrs: { border: "", label: "评论表情" },
                        }),
                      ],
                      1
                    ),
                  ]
                },
              },
            ]),
          }),
          _vm._v(" "),
          _c("el-table-column", {
            attrs: { label: "查找" },
            scopedSlots: _vm._u([
              {
                key: "default",
                fn: function (scope) {
                  return [
                    _c("el-input", {
                      attrs: { clearable: "", maxlength: "10" },
                      on: { change: _vm.verifyDuplicate },
                      model: {
                        value: scope.row.findVal,
                        callback: function ($$v) {
                          _vm.$set(scope.row, "findVal", $$v);
                        },
                        expression: "scope.row.findVal",
                      },
                    }),
                  ]
                },
              },
            ]),
          }),
          _vm._v(" "),
          _c("el-table-column", {
            attrs: { label: "替换" },
            scopedSlots: _vm._u([
              {
                key: "default",
                fn: function (scope) {
                  return [
                    _c("el-input", {
                      attrs: { clearable: "", maxlength: "10" },
                      model: {
                        value: scope.row.replaceVal,
                        callback: function ($$v) {
                          _vm.$set(scope.row, "replaceVal", $$v);
                        },
                        expression: "scope.row.replaceVal",
                      },
                    }),
                  ]
                },
              },
            ]),
          }),
          _vm._v(" "),
          _c("el-table-column", {
            attrs: { label: "操作" },
            scopedSlots: _vm._u([
              {
                key: "header",
                fn: function () {
                  return [
                    _c("el-button", { on: { click: _vm.addBut } }, [
                      _vm._v("添加"),
                    ]),
                    _vm._v(" "),
                    _c("el-button", { on: { click: _vm.refreshBut } }, [
                      _vm._v("刷新"),
                    ]),
                    _vm._v(" "),
                    _c(
                      "el-button",
                      {
                        attrs: { type: "success" },
                        on: { click: _vm.saveBut },
                      },
                      [_vm._v("保存")]
                    ),
                  ]
                },
                proxy: true,
              },
              {
                key: "default",
                fn: function (scope) {
                  return [
                    _c(
                      "el-button",
                      {
                        attrs: { type: "warning" },
                        on: {
                          click: function ($event) {
                            return _vm.delItemBut(scope.row, scope.$index)
                          },
                        },
                      },
                      [_vm._v("删除")]
                    ),
                  ]
                },
              },
            ]),
          }),
        ],
        1
      ),
    ],
    1
  )
};
var __vue_staticRenderFns__$p = [];
__vue_render__$p._withStripped = true;
  const __vue_inject_styles__$p = undefined;
  const __vue_component__$p = normalizeComponent(
    { render: __vue_render__$p, staticRenderFns: __vue_staticRenderFns__$p },
    __vue_inject_styles__$p,
    __vue_script__$p);const saveTable = (tableData) => {
  const newList = [];
  for (let { status, r } of tableData) {
    if (r === null) {
      eventEmitter.send("el-alert", "表格内还有未设置时间范围的项，请先设置或删除才可以保存！");
      return;
    }
    const [startTime, endTime] = r;
    newList.push({
      status,
      r: [startTime.getTime(), endTime.getTime()]
    });
  }
  if (newList.length === 0) return;
  GM_setValue("time_range_masking", newList);
  eventEmitter.send("el-notify", {
    title: "保存成功",
    message: "已保存该时间范围屏蔽",
    type: "success"
  });
};
var script$o = {
  data() {
    return {
      tableData: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end =  new Date();
              const start =  new Date();
              start.setTime(start.getTime() - 3600 * 1e3 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end =  new Date();
              const start =  new Date();
              start.setTime(start.getTime() - 3600 * 1e3 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end =  new Date();
              const start =  new Date();
              start.setTime(start.getTime() - 3600 * 1e3 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  methods: {
    refreshTableData() {
      if (this.tableData.length > 0) {
        this.tableData.splice(0, this.tableData.length);
      }
      const timeRangeMaskingArr = localMKData.getTimeRangeMaskingArr();
      if (timeRangeMaskingArr.length !== 0) {
        let index = 0;
        for (let { status, r } of timeRangeMaskingArr) {
          this.tableData.push({
            index: index++,
            status,
            r: [new Date(r[0]), new Date(r[1])],
            startTimeStamp: r[0],
            endTimeStamp: r[1]
          });
        }
      }
    },
    restoreTheLastTimeRange(row) {
      let { startTimeStamp, endTimeStamp } = row;
      console.log("上次时间戳", startTimeStamp, endTimeStamp);
      if (startTimeStamp === null || startTimeStamp === void 0) {
        row.r = null;
        return;
      }
      row.r = [new Date(startTimeStamp), new Date(endTimeStamp)];
      console.log("已恢复上次时间范围", row);
    },
    tableDatePickerChange(row) {
      const rowR = row.r;
      if (rowR === null) return;
      let { oldStartTimeStamp, oldEndTimeStamp } = row;
      const newStartTimeStamp = rowR[0].getTime();
      const newEndTimeStamp = rowR[1].getTime();
      const comparisonSTS = newStartTimeStamp || oldStartTimeStamp;
      const comparisonETS = newEndTimeStamp || oldEndTimeStamp;
      for (let v of this.tableData) {
        if (v.r === null) continue;
        if (v.index === row.index) continue;
        const tempStartTimeStamp = v.r[0].getTime();
        const tempEndTimeStamp = v.r[1].getTime();
        if (tempStartTimeStamp === comparisonSTS && tempEndTimeStamp === comparisonETS) {
          this.$alert("已存在该时间范围屏蔽");
          this.restoreTheLastTimeRange(row);
          return;
        }
        if (comparisonSTS >= tempStartTimeStamp && comparisonETS <= tempEndTimeStamp) {
          this.$alert("小于已添加过的时间范围");
          this.restoreTheLastTimeRange(row);
          return;
        }
      }
      row.startTimeStamp = newStartTimeStamp;
      row.endTimeStamp = newEndTimeStamp;
      saveTable(this.tableData);
    },
    tableSwitchChange(row) {
      if (row.r === null) return;
      saveTable(this.tableData);
    },
    addBut() {
      const length = this.tableData.length;
      this.tableData.push({
        index: length,
        status: true,
        r: null,
        startTimeStamp: null,
        endTimeStamp: null
      });
      this.$notify({ message: "已添加一条时间范围屏蔽到底部" });
    },
    delItemBut(row) {
      if (row.startTimeStamp === null) {
        this.tableData.splice(row.index, 1);
        return;
      }
      for (let { r } of this.tableData) {
        if (r === null) {
          this.$alert("表格内还有未设置时间范围的项，请先设置或删除才可以保存！");
          return;
        }
      }
      this.$confirm("确定删除该条时间范围屏蔽吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.tableData.splice(row.index, 1);
        saveTable(this.tableData);
        this.$message({
          type: "success",
          message: "删除成功!"
        });
      });
    },
    saveTableBut() {
      saveTable(this.tableData);
    }
  },
  created() {
    this.refreshTableData();
  }
};
const __vue_script__$o = script$o;
var __vue_render__$o = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c(
        "el-table",
        { attrs: { data: _vm.tableData, border: "", stripe: "" } },
        [
          _c("el-table-column", {
            attrs: { label: "状态", width: "120px" },
            scopedSlots: _vm._u([
              {
                key: "default",
                fn: function (scope) {
                  return [
                    _c("el-switch", {
                      attrs: { "active-text": "启用" },
                      on: {
                        change: function ($event) {
                          return _vm.tableSwitchChange(scope.row)
                        },
                      },
                      model: {
                        value: scope.row.status,
                        callback: function ($$v) {
                          _vm.$set(scope.row, "status", $$v);
                        },
                        expression: "scope.row.status",
                      },
                    }),
                  ]
                },
              },
            ]),
          }),
          _vm._v(" "),
          _c("el-table-column", {
            attrs: { label: "时间范围", width: "400px" },
            scopedSlots: _vm._u([
              {
                key: "default",
                fn: function (scope) {
                  return [
                    _c("el-date-picker", {
                      attrs: {
                        "picker-options": _vm.pickerOptions,
                        "end-placeholder": "结束日期",
                        "range-separator": "至",
                        "start-placeholder": "开始日期",
                        type: "datetimerange",
                      },
                      on: {
                        change: function ($event) {
                          return _vm.tableDatePickerChange(scope.row)
                        },
                      },
                      model: {
                        value: scope.row.r,
                        callback: function ($$v) {
                          _vm.$set(scope.row, "r", $$v);
                        },
                        expression: "scope.row.r",
                      },
                    }),
                    _vm._v(" "),
                    _c("el-tag", [_vm._v(_vm._s(scope.row.r))]),
                  ]
                },
              },
            ]),
          }),
          _vm._v(" "),
          _c("el-table-column", {
            scopedSlots: _vm._u([
              {
                key: "header",
                fn: function () {
                  return [
                    _c(
                      "el-button",
                      { attrs: { type: "info" }, on: { click: _vm.addBut } },
                      [_vm._v("添加")]
                    ),
                    _vm._v(" "),
                    _c("el-button", { on: { click: _vm.refreshTableData } }, [
                      _vm._v("刷新"),
                    ]),
                    _vm._v(" "),
                    _c("el-button", { on: { click: _vm.saveTableBut } }, [
                      _vm._v("保存"),
                    ]),
                  ]
                },
                proxy: true,
              },
              {
                key: "default",
                fn: function (scope) {
                  return [
                    _c(
                      "el-button",
                      {
                        attrs: { type: "warning" },
                        on: {
                          click: function ($event) {
                            return _vm.delItemBut(scope.row)
                          },
                        },
                      },
                      [_vm._v("删除")]
                    ),
                  ]
                },
              },
            ]),
          }),
        ],
        1
      ),
    ],
    1
  )
};
var __vue_staticRenderFns__$o = [];
__vue_render__$o._withStripped = true;
  const __vue_inject_styles__$o = undefined;
  const __vue_component__$o = normalizeComponent(
    { render: __vue_render__$o, staticRenderFns: __vue_staticRenderFns__$o },
    __vue_inject_styles__$o,
    __vue_script__$o);var script$n = {
  components: { time_range_masking_table_vue: __vue_component__$o },
  data() {
    return {
      status: localMKData.isTimeRangeMaskingStatus()
    };
  },
  watch: {
    status(n) {
      this.$notify({
        message: n ? "时间范围屏蔽已开启" : "时间范围屏蔽已关闭",
        type: n ? "success" : "warning"
      });
      GM_setValue("time_range_masking_status", n);
    }
  }
};
const __vue_script__$n = script$n;
var __vue_render__$n = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c(
        "el-card",
        {
          scopedSlots: _vm._u([
            {
              key: "header",
              fn: function () {
                return [_vm._v("时间范围")]
              },
              proxy: true,
            },
          ]),
        },
        [
          _vm._v(" "),
          _c("div", [_vm._v("使用说明")]),
          _vm._v(" "),
          _c("div", [
            _vm._v("1.不能添加重复的时间范围或者小于已添加过的时间范围"),
          ]),
          _vm._v(" "),
          _c("div", [
            _vm._v("2.修改时间范围的值和状态会自动保存(包括删除)，会有提示"),
          ]),
          _vm._v(" "),
          _c("div", [
            _vm._v("3.每个时间范围可独立控制开关状态，关闭则该条范围不生效"),
          ]),
          _vm._v(" "),
          _c("div", [_vm._v("4.总开关优先级最高，关闭则所有时间范围不生效")]),
          _vm._v(" "),
          _c("el-switch", {
            attrs: { "active-text": "总开关" },
            model: {
              value: _vm.status,
              callback: function ($$v) {
                _vm.status = $$v;
              },
              expression: "status",
            },
          }),
        ],
        1
      ),
      _vm._v(" "),
      _c("time_range_masking_table_vue"),
    ],
    1
  )
};
var __vue_staticRenderFns__$n = [];
__vue_render__$n._withStripped = true;
  const __vue_inject_styles__$n = undefined;
  const __vue_component__$n = normalizeComponent(
    { render: __vue_render__$n, staticRenderFns: __vue_staticRenderFns__$n },
    __vue_inject_styles__$n,
    __vue_script__$n);var script$m = {
  props: {
    formatTooltip: {
      type: Function
    },
    switchActiveText: { type: String, default: "启用" },
    step: { type: Number, default: 1 },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
    value: { type: Number, default: 0 },
    switchVal: { type: Boolean, default: false },
    range: { type: Boolean, default: false }
  },
  data() {
    return {
      local_switchVal: this.switchVal,
      disabled: !this.switchVal,
      sliderVal: this.value
    };
  },
  methods: {},
  watch: {
    value(n) {
      this.sliderVal = n;
    },
    sliderVal(n) {
      this.$emit("input", n);
    },
    disabled(n) {
      this.$emit("slider-disabled-change", n);
    },
    switchVal(n) {
      this.local_switchVal = n;
    },
    local_switchVal(n) {
      this.disabled = !n;
      this.$emit("update:switchVal", n);
    }
  }
};
const __vue_script__$m = script$m;
var __vue_render__$m = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c(
        "el-card",
        {
          attrs: { shadow: "never" },
          scopedSlots: _vm._u(
            [
              {
                key: "header",
                fn: function () {
                  return [_vm._t("header")]
                },
                proxy: true,
              },
            ],
            null,
            true
          ),
        },
        [
          _vm._v(" "),
          _vm._t("describe"),
          _vm._v(" "),
          _c(
            "div",
            { staticStyle: { display: "flex", "align-items": "center" } },
            [
              _c("el-switch", {
                attrs: { "active-text": _vm.switchActiveText },
                model: {
                  value: _vm.local_switchVal,
                  callback: function ($$v) {
                    _vm.local_switchVal = $$v;
                  },
                  expression: "local_switchVal",
                },
              }),
              _vm._v(" "),
              _c(
                "div",
                { staticStyle: { flex: "1", "margin-left": "15px" } },
                [
                  _c("el-slider", {
                    attrs: {
                      disabled: _vm.disabled,
                      "format-tooltip": _vm.formatTooltip,
                      max: _vm.max,
                      min: _vm.min,
                      range: _vm.range,
                      step: _vm.step,
                      "show-input": "",
                    },
                    model: {
                      value: _vm.sliderVal,
                      callback: function ($$v) {
                        _vm.sliderVal = $$v;
                      },
                      expression: "sliderVal",
                    },
                  }),
                ],
                1
              ),
            ],
            1
          ),
        ],
        2
      ),
    ],
    1
  )
};
var __vue_staticRenderFns__$m = [];
__vue_render__$m._withStripped = true;
  const __vue_inject_styles__$m = undefined;
  const __vue_component__$m = normalizeComponent(
    { render: __vue_render__$m, staticRenderFns: __vue_staticRenderFns__$m },
    __vue_inject_styles__$m,
    __vue_script__$m);var script$l = {
  components: { cardSlider: __vue_component__$m },
  props: {
    headerTitle: { type: String },
    describe: { type: String },
    mkTypeRateKey: { type: String },
    mkRateStatusKey: { type: String }
  },
  data() {
    return {
      rateBlockingStatus: GM_getValue(this.mkRateStatusKey, false),
      ratioRateVal: GM_getValue(this.mkTypeRateKey, 0.05)
    };
  },
  methods: {
    reteFormatTooltip(val) {
      return (val * 100).toFixed(0) + "%";
    }
  },
  watch: {
    ratioRateVal(n) {
      GM_setValue(this.mkTypeRateKey, n);
    },
    rateBlockingStatus(n) {
      GM_setValue(this.mkRateStatusKey, n);
    }
  }
};
const __vue_script__$l = script$l;
var __vue_render__$l = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c("cardSlider", {
        attrs: {
          "format-tooltip": _vm.reteFormatTooltip,
          max: 1,
          min: 0,
          step: 0.01,
          "switch-val": _vm.rateBlockingStatus,
        },
        on: {
          "update:switchVal": function ($event) {
            _vm.rateBlockingStatus = $event;
          },
          "update:switch-val": function ($event) {
            _vm.rateBlockingStatus = $event;
          },
        },
        scopedSlots: _vm._u([
          {
            key: "header",
            fn: function () {
              return [_vm._v(_vm._s(_vm.headerTitle))]
            },
            proxy: true,
          },
          {
            key: "describe",
            fn: function () {
              return [_vm._v(_vm._s(_vm.describe))]
            },
            proxy: true,
          },
        ]),
        model: {
          value: _vm.ratioRateVal,
          callback: function ($$v) {
            _vm.ratioRateVal = $$v;
          },
          expression: "ratioRateVal",
        },
      }),
    ],
    1
  )
};
var __vue_staticRenderFns__$l = [];
__vue_render__$l._withStripped = true;
  const __vue_inject_styles__$l = undefined;
  const __vue_component__$l = normalizeComponent(
    { render: __vue_render__$l, staticRenderFns: __vue_staticRenderFns__$l },
    __vue_inject_styles__$l,
    __vue_script__$l);var script$k = {
  components: { video_metrics_filter_item_view: __vue_component__$l, card_slider: __vue_component__$m },
  data() {
    return {
      metricsFilterList: [
        {
          headerTitle: "视频点赞率屏蔽",
          describe: "限制的点赞率，默认为2%，小于或等于值限时制的屏蔽该视频，公式【点赞率=点赞数/播放量*100】",
          mkRateStatusKey: "video_like_rate_blocking_status",
          mkTypeRateKey: "video_like_rate"
        },
        {
          headerTitle: "视频互动率屏蔽",
          describe: "限制的占比率，默认为2%，小于或等于值限时制的屏蔽该视频，公式【(弹幕数+评论数)/播放数*100】",
          mkRateStatusKey: "interactive_rate_blocking_status",
          mkTypeRateKey: "interactive_rate"
        },
        {
          headerTitle: "视频三连率屏蔽",
          describe: "限制的占比率，默认为2%，小于或等于值限时制的屏蔽该视频，公式【(收藏数+投币数+分享数)/播放数*100】",
          mkRateStatusKey: "triple_rate_blocking_status",
          mkTypeRateKey: "triple_rate"
        },
        {
          headerTitle: "视频投币/点赞比（内容价值）屏蔽",
          describe: "限制的占比率，默认为2%，小于或等于值限时制的屏蔽该视频，投币成本较高，比值越高内容越优质。公式【投币数 / 获赞数】",
          mkRateStatusKey: "coin_likes_ratio_rate_blocking_status",
          mkTypeRateKey: "coin_likes_ratio_rate"
        }
      ],
      limitationFanSumVal: getLimitationFanSumGm(),
      fansNumBlockingStatus: isFansNumBlockingStatusGm()
    };
  },
  watch: {
    limitationFanSumVal(n) {
      GM_setValue("limitation_fan_sum_gm", parseInt(n));
    },
    fansNumBlockingStatus(n) {
      GM_setValue("is_fans_num_blocking_status_gm", n);
    }
  }
};
const __vue_script__$k = script$k;
var __vue_render__$k = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c(
        "el-card",
        {
          scopedSlots: _vm._u([
            {
              key: "header",
              fn: function () {
                return [_vm._v("指标屏蔽(改动实时生效)")]
              },
              proxy: true,
            },
          ]),
        },
        [
          _vm._v(" "),
          _vm._l(_vm.metricsFilterList, function (item) {
            return _c("video_metrics_filter_item_view", {
              key: item.headerTitle,
              attrs: {
                describe: item.describe,
                "header-title": item.headerTitle,
                "mk-rate-status-key": item.mkRateStatusKey,
                "mk-type-rate-key": item.mkTypeRateKey,
              },
            })
          }),
          _vm._v(" "),
          _c("card_slider", {
            attrs: { max: 90000, "switch-val": _vm.fansNumBlockingStatus },
            on: {
              "update:switchVal": function ($event) {
                _vm.fansNumBlockingStatus = $event;
              },
              "update:switch-val": function ($event) {
                _vm.fansNumBlockingStatus = $event;
              },
            },
            scopedSlots: _vm._u([
              {
                key: "header",
                fn: function () {
                  return [_vm._v("粉丝数屏蔽")]
                },
                proxy: true,
              },
              {
                key: "describe",
                fn: function () {
                  return [
                    _vm._v(
                      "限制的粉丝数，小于或等于值限时制的屏蔽该视频，限制上限9万"
                    ),
                  ]
                },
                proxy: true,
              },
            ]),
            model: {
              value: _vm.limitationFanSumVal,
              callback: function ($$v) {
                _vm.limitationFanSumVal = $$v;
              },
              expression: "limitationFanSumVal",
            },
          }),
        ],
        2
      ),
    ],
    1
  )
};
var __vue_staticRenderFns__$k = [];
__vue_render__$k._withStripped = true;
  const __vue_inject_styles__$k = undefined;
  const __vue_component__$k = normalizeComponent(
    { render: __vue_render__$k, staticRenderFns: __vue_staticRenderFns__$k },
    __vue_inject_styles__$k,
    __vue_script__$k);var script$j = {
  data() {
    return {
      status: localMKData.isUidRangeMaskingStatus(),
      head: 0,
      tail: 100
    };
  },
  methods: {
    setRangeBut() {
      this.$alert("设置成功");
      GM_setValue("uid_range_masking", [this.head, this.tail]);
    }
  },
  watch: {
    head(newVal, oldVal) {
      if (newVal > this.tail) {
        this.$message("最小值不能大于最大值");
        this.head = oldVal;
      }
    },
    tail(newVal, oldVal) {
      if (newVal < this.head) {
        this.$message("最大值不能小于最小值");
        this.tail = oldVal;
      }
    },
    status(n) {
      GM_setValue("uid_range_masking_status", n);
    }
  },
  created() {
    const arr = localMKData.getUidRangeMasking();
    this.head = arr[0];
    this.tail = arr[1];
  }
};
const __vue_script__$j = script$j;
var __vue_render__$j = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c(
        "el-card",
        {
          scopedSlots: _vm._u([
            {
              key: "header",
              fn: function () {
                return [_vm._v("\n      uid范围屏蔽\n    ")]
              },
              proxy: true,
            },
          ]),
        },
        [
          _vm._v(" "),
          _c("div", { staticStyle: { "margin-bottom": "10px" } }, [
            _vm._v(
              "\n      范围内的uid都会被屏蔽掉，改动需重新设置方可生效，且再下次检查时屏蔽(如视频列表加载，评论加载)。比较关系【最小>=uid<=最大】\n    "
            ),
          ]),
          _vm._v(" "),
          _c("el-switch", {
            staticStyle: { "margin-bottom": "10px" },
            attrs: { "active-text": "启用" },
            model: {
              value: _vm.status,
              callback: function ($$v) {
                _vm.status = $$v;
              },
              expression: "status",
            },
          }),
          _vm._v(" "),
          _c("el-input", {
            staticStyle: { width: "30%" },
            scopedSlots: _vm._u([
              {
                key: "prepend",
                fn: function () {
                  return [_vm._v("最小")]
                },
                proxy: true,
              },
            ]),
            model: {
              value: _vm.head,
              callback: function ($$v) {
                _vm.head = _vm._n($$v);
              },
              expression: "head",
            },
          }),
          _vm._v(" "),
          _c("el-input", {
            staticStyle: { width: "30%" },
            scopedSlots: _vm._u([
              {
                key: "prepend",
                fn: function () {
                  return [_vm._v("最大")]
                },
                proxy: true,
              },
            ]),
            model: {
              value: _vm.tail,
              callback: function ($$v) {
                _vm.tail = _vm._n($$v);
              },
              expression: "tail",
            },
          }),
          _vm._v(" "),
          _c("el-button", { on: { click: _vm.setRangeBut } }, [_vm._v("设置")]),
        ],
        1
      ),
    ],
    1
  )
};
var __vue_staticRenderFns__$j = [];
__vue_render__$j._withStripped = true;
  const __vue_inject_styles__$j = undefined;
  const __vue_component__$j = normalizeComponent(
    { render: __vue_render__$j, staticRenderFns: __vue_staticRenderFns__$j },
    __vue_inject_styles__$j,
    __vue_script__$j);var script$i = {
  components: {
    uidRangeMaskingView: __vue_component__$j
  },
  data() {
    return {
      isLimitationVideoSubmitStatusVal: isLimitationVideoSubmitStatusGm(),
      LimitationContributeVal: getLimitationVideoSubmitSumGm(),
      blockFollowed: localMKData.isBlockFollowed(),
      is_up_owner_exclusive: localMKData.isUpOwnerExclusive(),
      genderRadioVal: localMKData.isGenderRadioVal(),
      vipTypeRadioVal: localMKData.isVipTypeRadioVal(),
      is_senior_member_val: localMKData.isSeniorMember(),
      copyrightRadioVal: localMKData.isCopyrightRadio(),
      is_vertical_val: localMKData.isBlockVerticalVideo(),
      is_check_team_member: localMKData.isCheckTeamMember(),
      isSeniorMemberOnlyVal: isSeniorMemberOnly(),
      isVideosInFeaturedCommentsBlockedVal: isVideosInFeaturedCommentsBlockedGm(),
      isFollowers7DaysOnlyVideosBlockedVal: isFollowers7DaysOnlyVideosBlockedGm(),
      isCommentDisabledVideosBlockedVal: isCommentDisabledVideosBlockedGm()
    };
  },
  methods: {},
  watch: {
    blockFollowed(n) {
      GM_setValue("blockFollowed", n);
    },
    is_up_owner_exclusive(n) {
      GM_setValue("is_up_owner_exclusive", n);
    },
    genderRadioVal(n) {
      GM_setValue("genderRadioVal", n);
    },
    vipTypeRadioVal(n) {
      GM_setValue("vipTypeRadioVal", n);
    },
    is_senior_member_val(n) {
      GM_setValue("is_senior_member", n);
    },
    copyrightRadioVal(n) {
      GM_setValue("copyrightRadioVal", n);
    },
    is_vertical_val(n) {
      GM_setValue("blockVerticalVideo", n);
    },
    is_check_team_member(n) {
      GM_setValue("checkTeamMember", n);
    },
    isSeniorMemberOnlyVal(n) {
      GM_setValue("is_senior_member_only", n);
    },
    LimitationContributeVal(n) {
      GM_setValue("limitation_video_submit_sum_gm", n);
    },
    isLimitationVideoSubmitStatusVal(n) {
      GM_setValue("is_limitation_video_submit_status_gm", n);
    },
    isVideosInFeaturedCommentsBlockedVal(n) {
      GM_setValue("is_videos_in_featured_comments_blocked_gm", n);
    },
    isFollowers7DaysOnlyVideosBlockedVal(n) {
      GM_setValue("is_followers_7_days_only_videos_blocked_gm", n);
    },
    isCommentDisabledVideosBlockedVal(n) {
      GM_setValue("is_comment_disabled_videos_blocked_gm", n);
    }
  }
};
const __vue_script__$i = script$i;
var __vue_render__$i = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c("uidRangeMaskingView"),
      _vm._v(" "),
      _c(
        "el-card",
        {
          scopedSlots: _vm._u([
            {
              key: "header",
              fn: function () {
                return [_vm._v("投稿数屏蔽")]
              },
              proxy: true,
            },
          ]),
        },
        [
          _vm._v(" "),
          _c("div", [
            _vm._v("启用后，视频列表中用户投稿数低于该值的屏蔽，改动即生效"),
          ]),
          _vm._v(" "),
          _c("el-switch", {
            attrs: { "active-text": "启用" },
            model: {
              value: _vm.isLimitationVideoSubmitStatusVal,
              callback: function ($$v) {
                _vm.isLimitationVideoSubmitStatusVal = $$v;
              },
              expression: "isLimitationVideoSubmitStatusVal",
            },
          }),
          _vm._v(" "),
          _c("el-input-number", {
            attrs: { min: 0 },
            model: {
              value: _vm.LimitationContributeVal,
              callback: function ($$v) {
                _vm.LimitationContributeVal = $$v;
              },
              expression: "LimitationContributeVal",
            },
          }),
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "el-card",
        {
          scopedSlots: _vm._u([
            {
              key: "header",
              fn: function () {
                return [_vm._v("视频类型")]
              },
              proxy: true,
            },
          ]),
        },
        [
          _vm._v(" "),
          _c(
            "el-tooltip",
            { attrs: { content: "选中的类型会被屏蔽" } },
            [
              _c(
                "el-radio-group",
                {
                  model: {
                    value: _vm.copyrightRadioVal,
                    callback: function ($$v) {
                      _vm.copyrightRadioVal = $$v;
                    },
                    expression: "copyrightRadioVal",
                  },
                },
                [
                  _c("el-radio-button", { attrs: { label: "原创" } }),
                  _vm._v(" "),
                  _c("el-radio-button", { attrs: { label: "转载" } }),
                  _vm._v(" "),
                  _c("el-radio-button", { attrs: { label: "不处理" } }),
                ],
                1
              ),
            ],
            1
          ),
          _vm._v(" "),
          _c("el-divider"),
          _vm._v(" "),
          _c("el-switch", {
            attrs: { "active-text": "屏蔽竖屏类视频" },
            model: {
              value: _vm.is_vertical_val,
              callback: function ($$v) {
                _vm.is_vertical_val = $$v;
              },
              expression: "is_vertical_val",
            },
          }),
          _vm._v(" "),
          _c("el-switch", {
            attrs: { "active-text": "屏蔽已关注" },
            model: {
              value: _vm.blockFollowed,
              callback: function ($$v) {
                _vm.blockFollowed = $$v;
              },
              expression: "blockFollowed",
            },
          }),
          _vm._v(" "),
          _c("el-switch", {
            attrs: { "active-text": "屏蔽充电专属视频" },
            model: {
              value: _vm.is_up_owner_exclusive,
              callback: function ($$v) {
                _vm.is_up_owner_exclusive = $$v;
              },
              expression: "is_up_owner_exclusive",
            },
          }),
          _vm._v(" "),
          _c("el-switch", {
            attrs: { "active-text": "屏蔽硬核会员" },
            model: {
              value: _vm.is_senior_member_val,
              callback: function ($$v) {
                _vm.is_senior_member_val = $$v;
              },
              expression: "is_senior_member_val",
            },
          }),
          _vm._v(" "),
          _c("el-divider"),
          _vm._v(" "),
          _c("div", [
            _vm._v(
              "下面三个选项尽量不要启用，任意一个启用都会增加对b站的请求次数，请酌情使用"
            ),
          ]),
          _vm._v(" "),
          _c(
            "el-tooltip",
            { attrs: { content: "视频评论区评论被up主精选后对所有人可见" } },
            [
              _c("el-switch", {
                attrs: { "active-text": "屏蔽精选评论区类视频" },
                model: {
                  value: _vm.isVideosInFeaturedCommentsBlockedVal,
                  callback: function ($$v) {
                    _vm.isVideosInFeaturedCommentsBlockedVal = $$v;
                  },
                  expression: "isVideosInFeaturedCommentsBlockedVal",
                },
              }),
            ],
            1
          ),
          _vm._v(" "),
          _c("el-switch", {
            attrs: { "active-text": "屏蔽关注UP主7天以上的人可发评论类视频" },
            model: {
              value: _vm.isFollowers7DaysOnlyVideosBlockedVal,
              callback: function ($$v) {
                _vm.isFollowers7DaysOnlyVideosBlockedVal = $$v;
              },
              expression: "isFollowers7DaysOnlyVideosBlockedVal",
            },
          }),
          _vm._v(" "),
          _c(
            "el-tooltip",
            {
              attrs: {
                content: "视频评论区输入框是禁止输入状态而非可输入类视频",
              },
            },
            [
              _c("el-switch", {
                attrs: { "active-text": "屏蔽禁止评论类视频" },
                model: {
                  value: _vm.isCommentDisabledVideosBlockedVal,
                  callback: function ($$v) {
                    _vm.isCommentDisabledVideosBlockedVal = $$v;
                  },
                  expression: "isCommentDisabledVideosBlockedVal",
                },
              }),
            ],
            1
          ),
          _vm._v(" "),
          _c("el-divider"),
          _vm._v(" "),
          _c(
            "el-row",
            [
              _c(
                "el-col",
                { attrs: { span: 12 } },
                [
                  _c(
                    "el-card",
                    {
                      attrs: { shadow: "never" },
                      scopedSlots: _vm._u([
                        {
                          key: "header",
                          fn: function () {
                            return [_vm._v("会员类型屏蔽")]
                          },
                          proxy: true,
                        },
                      ]),
                    },
                    [
                      _vm._v(" "),
                      _c(
                        "el-radio-group",
                        {
                          model: {
                            value: _vm.vipTypeRadioVal,
                            callback: function ($$v) {
                              _vm.vipTypeRadioVal = $$v;
                            },
                            expression: "vipTypeRadioVal",
                          },
                        },
                        [
                          _c("el-radio-button", { attrs: { label: "无" } }),
                          _vm._v(" "),
                          _c("el-radio-button", {
                            attrs: { label: "月大会员" },
                          }),
                          _vm._v(" "),
                          _c("el-radio-button", {
                            attrs: { label: "年度及以上大会员" },
                          }),
                          _vm._v(" "),
                          _c("el-radio-button", { attrs: { label: "不处理" } }),
                        ],
                        1
                      ),
                    ],
                    1
                  ),
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "el-col",
                { attrs: { span: 12 } },
                [
                  _c(
                    "el-card",
                    {
                      attrs: { shadow: "never" },
                      scopedSlots: _vm._u([
                        {
                          key: "header",
                          fn: function () {
                            return [_vm._v("性别屏蔽")]
                          },
                          proxy: true,
                        },
                      ]),
                    },
                    [
                      _vm._v(" "),
                      _c(
                        "el-radio-group",
                        {
                          model: {
                            value: _vm.genderRadioVal,
                            callback: function ($$v) {
                              _vm.genderRadioVal = $$v;
                            },
                            expression: "genderRadioVal",
                          },
                        },
                        [
                          _c("el-radio-button", { attrs: { label: "男性" } }),
                          _vm._v(" "),
                          _c("el-radio-button", { attrs: { label: "女性" } }),
                          _vm._v(" "),
                          _c("el-radio-button", { attrs: { label: "保密" } }),
                          _vm._v(" "),
                          _c("el-radio-button", { attrs: { label: "不处理" } }),
                        ],
                        1
                      ),
                    ],
                    1
                  ),
                ],
                1
              ),
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "el-card",
            {
              attrs: { shadow: "never" },
              scopedSlots: _vm._u([
                {
                  key: "header",
                  fn: function () {
                    return [_vm._v("计算创作团队")]
                  },
                  proxy: true,
                },
              ]),
            },
            [
              _vm._v(" "),
              _c(
                "el-tooltip",
                { attrs: { content: "当作者未匹配上时检查其他成员" } },
                [
                  _c("el-switch", {
                    attrs: { "active-text": "检查创作团队中成员" },
                    model: {
                      value: _vm.is_check_team_member,
                      callback: function ($$v) {
                        _vm.is_check_team_member = $$v;
                      },
                      expression: "is_check_team_member",
                    },
                  }),
                ],
                1
              ),
            ],
            1
          ),
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "el-card",
        {
          scopedSlots: _vm._u([
            {
              key: "header",
              fn: function () {
                return [_vm._v("评论")]
              },
              proxy: true,
            },
          ]),
        },
        [
          _vm._v(" "),
          _c("el-switch", {
            attrs: { "active-text": "仅看硬核会员" },
            model: {
              value: _vm.isSeniorMemberOnlyVal,
              callback: function ($$v) {
                _vm.isSeniorMemberOnlyVal = $$v;
              },
              expression: "isSeniorMemberOnlyVal",
            },
          }),
        ],
        1
      ),
    ],
    1
  )
};
var __vue_staticRenderFns__$i = [];
__vue_render__$i._withStripped = true;
  const __vue_inject_styles__$i = undefined;
  const __vue_component__$i = normalizeComponent(
    { render: __vue_render__$i, staticRenderFns: __vue_staticRenderFns__$i },
    __vue_inject_styles__$i,
    __vue_script__$i);var __typeError$1 = (msg) => {
  throw TypeError(msg);
};
var __accessCheck$1 = (obj, member, msg) => member.has(obj) || __typeError$1("Cannot " + msg);
var __privateGet$1 = (obj, member, getter) => (__accessCheck$1(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd$1 = (obj, member, value) => member.has(obj) ? __typeError$1("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet$1 = (obj, member, value, setter) => (__accessCheck$1(obj, member, "write to private field"), member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck$1(obj, member, "access private method"), method);
var _isProcessing, _pendingQueue, _interval$1, _asynchronousIntervalQueue_instances, processQueue_fn;
class asynchronousIntervalQueue {
  constructor(options = {}) {
    __privateAdd$1(this, _asynchronousIntervalQueue_instances);
    __privateAdd$1(this, _isProcessing, false);
    __privateAdd$1(this, _pendingQueue, []);
    __privateAdd$1(this, _interval$1, 200);
    __privateSet$1(this, _interval$1, options.interval || 200);
  }
  setInterval(interval) {
    __privateSet$1(this, _interval$1, interval);
  }
  add(func, config = {}) {
    return new Promise((resolve, reject) => {
      __privateGet$1(this, _pendingQueue).push({
        funcFn: func,
        config: {
          interval: config.interval || null
        },
        resolve,
        reject
      });
      if (!__privateGet$1(this, _isProcessing)) {
        __privateMethod(this, _asynchronousIntervalQueue_instances, processQueue_fn).call(this);
      }
    });
  }
  clearPendingQueue() {
    __privateSet$1(this, _pendingQueue, []);
    __privateSet$1(this, _isProcessing, false);
  }
}
_isProcessing = new WeakMap();
_pendingQueue = new WeakMap();
_interval$1 = new WeakMap();
_asynchronousIntervalQueue_instances = new WeakSet();
processQueue_fn = async function() {
  __privateSet$1(this, _isProcessing, true);
  while (__privateGet$1(this, _pendingQueue).length > 0) {
    const task = __privateGet$1(this, _pendingQueue).shift();
    try {
      let result;
      const funcFn = task.funcFn;
      if (funcFn instanceof Promise) {
        const template = await funcFn;
        if (template instanceof Function) {
          result = template();
        } else {
          result = template;
        }
      }
      if (funcFn instanceof Function) {
        const template = funcFn();
        if (template instanceof Promise) {
          result = await template;
        } else {
          result = template;
        }
      }
      task.resolve(result);
    } catch (error) {
      task.reject(error);
    } finally {
      const interval = task.config.interval || __privateGet$1(this, _interval$1);
      await new Promise(
        (resolve) => setTimeout(resolve, interval)
      );
    }
  }
  __privateSet$1(this, _isProcessing, false);
};const queue = new asynchronousIntervalQueue();
const getData = async (page = 1) => {
  const response = await fetch(`https://api.bilibili.com/x/relation/blacks?pn=${page}&ps=50&jsonp=jsonp`, {
    credentials: "include"
  });
  if (response.status !== 200) {
    eventEmitter.send("el-msg", "拉取黑名单数据响应失败.");
    return { state: false };
  }
  const resJson = await response.json();
  const { data: { list, total }, message, code } = resJson;
  if (code !== 0) {
    eventEmitter.send("el-msg", "请求相应内容失败：code=" + code);
    return { state: false, msg: `请求相应内容失败：msg=${message} code=` + code };
  }
  const newList = list.map(({ face, mid, mtime, uname, sign }) => {
    return { face, mid, mtime, uname, sign };
  });
  return { state: true, list: newList, total };
};
var script$h = {
  data() {
    return {
      select: {
        val: "uname",
        options: [{
          label: "用户UID",
          value: "mid"
        }, {
          label: "用户名",
          value: "uname"
        }, {
          label: "用户签名",
          value: "sign"
        }]
      },
      total: 0,
      list: [],
      showList: [],
      findVal: "",
      sliderInterval: 0.6,
      isDivLoading: false,
      isCancelMaxLimit: false,
      pageSize: 50
    };
  },
  methods: {
    filterTable(list, val) {
      const filter = list.filter((x) => {
        const x1 = x[this.select.val];
        if (Number.isInteger(x1)) {
          return x1.toString().includes(val);
        }
        return x1.includes(val);
      });
      if (filter.length === 0) {
        this.$notify({
          title: "没有匹配到数据",
          type: "warning",
          duration: 2e3
        });
        return [];
      }
      if (filter.length > 50 && !this.isCancelMaxLimit) {
        this.$notify({
          title: "数据过多，已截取前50条",
          type: "warning",
          duration: 2e3
        });
        return filter.slice(0, 50);
      }
      return filter;
    },
    async getOnePageDataBut() {
      const { state, list, total } = await getData();
      if (!state) {
        return;
      }
      this.list = list;
      this.showList = list;
      this.total = total;
      this.$message("获取成功");
    },
    tableOpenAddressBut(row) {
      GM_openInTab(`https://space.bilibili.com/${row.mid}`);
    },
    tableAddUidBlackBut(row) {
      const uid = row.mid;
      const name = row.uname;
      if (ruleUtil.findRuleItemValue("precise_uid", uid)) {
        this.$message(`该用户:${name}的uid:${uid}已添加过`);
        return;
      }
      this.$confirm(`确定添加${name}的uid:${uid}到uid精确屏蔽吗？`).then(() => {
        ruleUtil.addRulePreciseUid(uid);
      });
      console.log(row);
    },
    outDataToConsoleBut() {
      console.log("黑名单管理列表====start");
      console.log(JSON.parse(JSON.stringify(this.list)));
      console.log("黑名单管理列表====end");
      this.$alert("已导出到控制台，可通过f12查看");
    },
    outDataToFileBut() {
      this.$prompt("请输入文件名", "保存为", {
        inputValue: "B站黑名单列表"
      }).then(({ value }) => {
        if (value.trim() === "") {
          return;
        }
        const tempData = {
          total: this.total,
          list: this.list
        };
        const s = JSON.stringify(tempData, null, 4);
        defUtil.fileDownload(s, +value.trim() + ".json");
        this.$alert("已导出到文件，请按需保存");
      });
    },
    async getAllBut() {
      this.isDivLoading = true;
      const { state, list, total } = await getData();
      if (!state) return;
      if (total === 0) {
        this.isDivLoading = false;
        this.$message("没有更多数据了");
        return;
      }
      this.total = total;
      const totalPage = Math.ceil(total / 50);
      if (totalPage === 1) {
        this.list = list;
        this.isDivLoading = false;
        return;
      }
      this.list = list;
      for (let i = 2; i <= totalPage; i++) {
        const { state: state2, list: resList } = await queue.add(() => getData(i));
        if (!state2) return;
        list.push(...resList);
      }
      if (this.list.length > 50 && !this.isCancelMaxLimit) {
        this.showList = list.slice(0, 50);
      } else {
        this.showList = list;
      }
      this.showList = list;
      this.$message("获取成功");
      this.isDivLoading = false;
    },
    handleCurrentChange(page) {
      this.showList = this.list.slice((page - 1) * 50, page * 50);
    },
    clearTableBut() {
      this.showList = this.list = [];
      this.$message("已清空列表");
    },
    tableAddUidBlackButAll() {
      if (this.list.length === 0) {
        this.$message("列表为空");
        return;
      }
      this.$confirm(`确定添加所有用户到uid精确屏蔽吗？`).then(() => {
        if (ruleUtil.addPreciseUidItemRule(this.list.map((x) => x.mid), true, false)) {
          eventEmitter.send("刷新规则信息");
        }
      });
    }
  },
  watch: {
    findVal(n) {
      this.showList = this.filterTable(this.list, n);
    },
    sliderInterval(n) {
      queue.setInterval(n * 1e3);
    },
    isCancelMaxLimit(n) {
      this.pageSize = n ? 1e6 : 50;
    }
  },
  created() {
    queue.setInterval(this.sliderInterval * 1e3);
  }
};
const __vue_script__$h = script$h;
var __vue_render__$h = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c("div", [_vm._v("1.注意：该功能为b站自身的黑名单")]),
      _vm._v(" "),
      _c(
        "div",
        [
          _vm._v("1.对应地址\n    "),
          _c(
            "el-link",
            {
              attrs: {
                href: "https://account.bilibili.com/account/blacklist",
                target: "_blank",
              },
            },
            [
              _vm._v(
                "\n      https://account.bilibili.com/account/blacklist\n    "
              ),
            ]
          ),
        ],
        1
      ),
      _vm._v(" "),
      _c("div", [_vm._v("3.需要登录才可以使用")]),
      _vm._v(" "),
      _c(
        "el-card",
        {
          directives: [
            {
              name: "loading",
              rawName: "v-loading",
              value: _vm.isDivLoading,
              expression: "isDivLoading",
            },
          ],
          attrs: { "element-loading-text": "拼命加载中", shadow: "never" },
          scopedSlots: _vm._u([
            {
              key: "header",
              fn: function () {
                return [
                  _c(
                    "el-row",
                    [
                      _c(
                        "el-col",
                        { attrs: { span: 8 } },
                        [
                          _c(
                            "el-badge",
                            { attrs: { value: _vm.total } },
                            [_c("el-tag", [_vm._v("累计")])],
                            1
                          ),
                          _vm._v(" "),
                          _c(
                            "el-badge",
                            {
                              staticStyle: { "margin-left": "45px" },
                              attrs: { value: _vm.showList.length },
                            },
                            [_c("el-tag", [_vm._v("显示数")])],
                            1
                          ),
                          _vm._v(" "),
                          _c(
                            "div",
                            [
                              _c(
                                "el-card",
                                {
                                  attrs: { shadow: "never" },
                                  scopedSlots: _vm._u([
                                    {
                                      key: "header",
                                      fn: function () {
                                        return [
                                          _vm._v(
                                            "请求的间隔(" +
                                              _vm._s(_vm.sliderInterval) +
                                              "S)"
                                          ),
                                        ]
                                      },
                                      proxy: true,
                                    },
                                  ]),
                                },
                                [
                                  _vm._v(" "),
                                  _c("el-slider", {
                                    attrs: { max: "10", step: "0.1" },
                                    model: {
                                      value: _vm.sliderInterval,
                                      callback: function ($$v) {
                                        _vm.sliderInterval = $$v;
                                      },
                                      expression: "sliderInterval",
                                    },
                                  }),
                                ],
                                1
                              ),
                              _vm._v(" "),
                              _c(
                                "el-button",
                                { on: { click: _vm.getOnePageDataBut } },
                                [_vm._v("获取第一页")]
                              ),
                              _vm._v(" "),
                              _c(
                                "el-button",
                                { on: { click: _vm.getAllBut } },
                                [_vm._v("获取全部")]
                              ),
                              _vm._v(" "),
                              _c(
                                "el-button",
                                {
                                  attrs: { type: "warning" },
                                  on: { click: _vm.clearTableBut },
                                },
                                [_vm._v("清空列表")]
                              ),
                              _vm._v(" "),
                              _c(
                                "el-button",
                                { on: { click: _vm.outDataToConsoleBut } },
                                [_vm._v("导出控制台")]
                              ),
                              _vm._v(" "),
                              _c(
                                "el-button",
                                { on: { click: _vm.outDataToFileBut } },
                                [_vm._v("导出文件")]
                              ),
                            ],
                            1
                          ),
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "el-col",
                        { attrs: { span: 16 } },
                        [
                          _c(
                            "el-card",
                            {
                              attrs: { shadow: "never" },
                              scopedSlots: _vm._u([
                                {
                                  key: "header",
                                  fn: function () {
                                    return [_c("span", [_vm._v("过滤")])]
                                  },
                                  proxy: true,
                                },
                              ]),
                            },
                            [
                              _vm._v(" "),
                              _c(
                                "div",
                                [
                                  _c("el-switch", {
                                    attrs: {
                                      "active-text": "取消列表显示最大限制",
                                    },
                                    model: {
                                      value: _vm.isCancelMaxLimit,
                                      callback: function ($$v) {
                                        _vm.isCancelMaxLimit = $$v;
                                      },
                                      expression: "isCancelMaxLimit",
                                    },
                                  }),
                                ],
                                1
                              ),
                              _vm._v(" "),
                              _c(
                                "el-select",
                                {
                                  model: {
                                    value: _vm.select.val,
                                    callback: function ($$v) {
                                      _vm.$set(_vm.select, "val", $$v);
                                    },
                                    expression: "select.val",
                                  },
                                },
                                _vm._l(_vm.select.options, function (item) {
                                  return _c("el-option", {
                                    key: item.value,
                                    attrs: {
                                      label: item.label,
                                      value: item.value,
                                    },
                                  })
                                }),
                                1
                              ),
                              _vm._v(" "),
                              _c("el-input", {
                                model: {
                                  value: _vm.findVal,
                                  callback: function ($$v) {
                                    _vm.findVal = $$v;
                                  },
                                  expression: "findVal",
                                },
                              }),
                            ],
                            1
                          ),
                        ],
                        1
                      ),
                    ],
                    1
                  ),
                ]
              },
              proxy: true,
            },
          ]),
        },
        [
          _vm._v(" "),
          _c(
            "el-table",
            { attrs: { data: _vm.showList, border: "", stripe: "" } },
            [
              _c("el-table-column", {
                attrs: { label: "时间", prop: "mtime", width: "155px" },
                scopedSlots: _vm._u([
                  {
                    key: "default",
                    fn: function (scope) {
                      return [
                        _vm._v(
                          "\n          " +
                            _vm._s(
                              new Date(scope.row.mtime * 1000).toLocaleString()
                            ) +
                            "\n        "
                        ),
                      ]
                    },
                  },
                ]),
              }),
              _vm._v(" "),
              _c("el-table-column", {
                attrs: { label: "头像", width: "55px" },
                scopedSlots: _vm._u([
                  {
                    key: "default",
                    fn: function (scope) {
                      return [
                        _c("el-avatar", {
                          attrs: { src: scope.row.face, shape: "square" },
                        }),
                      ]
                    },
                  },
                ]),
              }),
              _vm._v(" "),
              _c("el-table-column", {
                attrs: { label: "用户名", prop: "uname", width: "190px" },
              }),
              _vm._v(" "),
              _c("el-table-column", {
                attrs: { label: "用户ID", prop: "mid", width: "180px" },
              }),
              _vm._v(" "),
              _c("el-table-column", { attrs: { label: "签名", prop: "sign" } }),
              _vm._v(" "),
              _c("el-table-column", {
                attrs: { label: "标记", width: "50px" },
                scopedSlots: _vm._u([
                  {
                    key: "default",
                    fn: function (scope) {
                      return [_vm._v("\n          未定\n        ")]
                    },
                  },
                ]),
              }),
              _vm._v(" "),
              _c("el-table-column", {
                attrs: { label: "操作" },
                scopedSlots: _vm._u([
                  {
                    key: "header",
                    fn: function () {
                      return [
                        _c(
                          "el-button",
                          { on: { click: _vm.tableAddUidBlackButAll } },
                          [_vm._v("一键添加uid屏蔽")]
                        ),
                      ]
                    },
                    proxy: true,
                  },
                  {
                    key: "default",
                    fn: function (scope) {
                      return [
                        _c(
                          "el-button",
                          {
                            on: {
                              click: function ($event) {
                                return _vm.tableOpenAddressBut(scope.row)
                              },
                            },
                          },
                          [_vm._v("打开地址")]
                        ),
                        _vm._v(" "),
                        _c(
                          "el-button",
                          {
                            on: {
                              click: function ($event) {
                                return _vm.tableAddUidBlackBut(scope.row)
                              },
                            },
                          },
                          [_vm._v("uid屏蔽")]
                        ),
                      ]
                    },
                  },
                ]),
              }),
            ],
            1
          ),
          _vm._v(" "),
          _c("el-pagination", {
            attrs: {
              "page-size": _vm.pageSize,
              total: _vm.list.length,
              background: "",
              layout: "prev, pager, next",
            },
            on: { "current-change": _vm.handleCurrentChange },
          }),
        ],
        1
      ),
    ],
    1
  )
};
var __vue_staticRenderFns__$h = [];
__vue_render__$h._withStripped = true;
  const __vue_inject_styles__$h = undefined;
  const __vue_component__$h = normalizeComponent(
    { render: __vue_render__$h, staticRenderFns: __vue_staticRenderFns__$h },
    __vue_inject_styles__$h,
    __vue_script__$h);var script$g = {
  data() {
    return {
      dialogVisible: false,
      inputVisible: false,
      inputValue: "",
      min: 2,
      typeMap: {},
      showTags: []
    };
  },
  methods: {
    updateShowTags() {
      this.showTags = ruleKeyListData.getVideoTagPreciseCombination();
    },
    handleTagClose(tag, index) {
      if (tag === "") return;
      this.$confirm(`确定要删除 ${tag} 吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.showTags.splice(index, 1);
        ruleKeyListData.setVideoTagPreciseCombination(this.showTags);
        this.$message.success(`已移除 ${tag}`);
        eventEmitter.send("刷新规则信息", false);
      });
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      this.inputVisible = false;
      if (inputValue === "") return;
      this.submitBut(inputValue);
      this.inputValue = "";
    },
    submitBut(inputValue) {
      const split = inputValue.split(",");
      if (split.length < this.min) {
        this.$message.error("最少添加" + this.min + "项");
        return;
      }
      const preciseVideoTagArr = ruleKeyListData.getPreciseVideoTagArr();
      const videoTagArr = ruleKeyListData.getVideoTagArr();
      for (let showTag of split) {
        showTag = showTag.trim();
        if (showTag === "") {
          this.$message.error("不能添加空项");
          return;
        }
        if (preciseVideoTagArr.includes(showTag)) {
          this.$message.error("不能添加视频tag(精确匹配)已有的项，请先移除对应的项！");
          return;
        }
        if (videoTagArr.includes(showTag)) {
          this.$message.error("不能添加视频tag(模糊匹配)已有的项，请先移除对应的项！");
          return;
        }
        if (showTag.length > 15) {
          this.$message.error("项不能超过15个字符");
          return;
        }
      }
      const arr = ruleKeyListData.getVideoTagPreciseCombination();
      for (let mk_arr of arr) {
        if (arrUtil.arraysLooseEqual(mk_arr, split)) {
          this.$message.error("不能重复添加已有的组合！");
          return;
        }
        if (arrUtil.arrayContains(mk_arr, split)) {
          this.$message.error("该组合已添加过或包括该组合");
          return;
        }
      }
      arr.push(split);
      ruleKeyListData.setVideoTagPreciseCombination(arr);
      console.log(this.typeMap, split, arr);
      this.$message.success(`${this.typeMap.name}添加成功`);
      this.updateShowTags();
      eventEmitter.send("刷新规则信息", false);
    }
  },
  created() {
    eventEmitter.on("打开多重规则编辑对话框", (typeMap) => {
      this.typeMap = typeMap;
      this.dialogVisible = true;
      this.updateShowTags();
    });
  },
  filters: {
    filterTag(tag) {
      return tag.join("||");
    }
  }
};
const __vue_script__$g = script$g;
var __vue_render__$g = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c(
        "el-dialog",
        {
          attrs: {
            "close-on-click-modal": false,
            "close-on-press-escape": false,
            modal: false,
            visible: _vm.dialogVisible,
            title: "多重规则",
          },
          on: {
            "update:visible": function ($event) {
              _vm.dialogVisible = $event;
            },
          },
        },
        [
          _c("el-tag", [_vm._v(_vm._s(_vm.typeMap.name))]),
          _vm._v(" "),
          _c(
            "el-card",
            {
              scopedSlots: _vm._u([
                {
                  key: "header",
                  fn: function () {
                    return [_vm._v("说明")]
                  },
                  proxy: true,
                },
              ]),
            },
            [
              _vm._v(" "),
              _c("div", [_vm._v("1.组合类型每条项至少大于1")]),
              _vm._v(" "),
              _c("div", [_vm._v("2.不能添加空项")]),
              _vm._v(" "),
              _c("div", [_vm._v("3.每组中的项不能超过15个字符")]),
              _vm._v(" "),
              _c("div", [_vm._v("4.不能重复添加已有的组合")]),
              _vm._v(" "),
              _c("div", [_vm._v("5.每组不能添加过包括已有的组合")]),
              _vm._v(" "),
              _c("div", [
                _vm._v(
                  "6.不能添加视频tag(精确匹配)已有的项，如需要，请先移除对应的项！包括视频tag(模糊匹配)"
                ),
              ]),
            ]
          ),
          _vm._v(" "),
          _c(
            "el-card",
            [
              _vm.inputVisible
                ? _c("el-input", {
                    ref: "saveTagInput",
                    staticClass: "input-new-tag",
                    attrs: {
                      placeholder: "多个项时请用英文符号分割",
                      size: "small",
                    },
                    on: { blur: _vm.handleInputConfirm },
                    nativeOn: {
                      keyup: function ($event) {
                        if (
                          !$event.type.indexOf("key") &&
                          _vm._k(
                            $event.keyCode,
                            "enter",
                            13,
                            $event.key,
                            "Enter"
                          )
                        ) {
                          return null
                        }
                        return _vm.handleInputConfirm.apply(null, arguments)
                      },
                    },
                    model: {
                      value: _vm.inputValue,
                      callback: function ($$v) {
                        _vm.inputValue = $$v;
                      },
                      expression: "inputValue",
                    },
                  })
                : _c(
                    "el-button",
                    { attrs: { size: "small" }, on: { click: _vm.showInput } },
                    [_vm._v("+ New Tag")]
                  ),
              _vm._v(" "),
              _vm._l(_vm.showTags, function (item, index) {
                return _c(
                  "el-tag",
                  {
                    key: index,
                    attrs: { closable: "" },
                    on: {
                      close: function ($event) {
                        return _vm.handleTagClose(item, index)
                      },
                    },
                  },
                  [
                    _vm._v(
                      "\n        " +
                        _vm._s(_vm._f("filterTag")(item)) +
                        "\n      "
                    ),
                  ]
                )
              }),
            ],
            2
          ),
        ],
        1
      ),
    ],
    1
  )
};
var __vue_staticRenderFns__$g = [];
__vue_render__$g._withStripped = true;
  const __vue_inject_styles__$g = undefined;
  const __vue_component__$g = normalizeComponent(
    { render: __vue_render__$g, staticRenderFns: __vue_staticRenderFns__$g },
    __vue_inject_styles__$g,
    __vue_script__$g);var script$f = {
  data() {
    return {
      show: false,
      ruleType: "",
      ruleName: "",
      oldVal: "",
      newVal: ""
    };
  },
  methods: {
    okBut() {
      let tempOldVal = this.oldVal.trim();
      let tempNewVal = this.newVal.trim();
      if (tempOldVal.length === 0 || tempNewVal.length === 0) {
        this.$alert("请输入要修改的值或新值");
        return;
      }
      if (tempNewVal === tempOldVal) {
        this.$alert("新值不能和旧值相同");
        return;
      }
      const tempRuleType = this.ruleType;
      if (tempRuleType === "precise_uid" || tempRuleType === "precise_uid_white") {
        tempOldVal = parseInt(tempOldVal);
        tempNewVal = parseInt(tempNewVal);
        if (isNaN(tempOldVal) || isNaN(tempNewVal)) {
          this.$alert("请输入整数数字");
          return;
        }
      }
      if (!ruleUtil.findRuleItemValue(tempRuleType, tempOldVal)) {
        this.$alert("要修改的值不存在");
        return;
      }
      if (ruleUtil.findRuleItemValue(tempRuleType, tempNewVal)) {
        this.$alert("新值已存在");
        return;
      }
      const ruleArr = GM_getValue(tempRuleType, []);
      const indexOf = ruleArr.indexOf(tempOldVal);
      ruleArr[indexOf] = tempNewVal;
      GM_setValue(tempRuleType, ruleArr);
      this.$alert(`已将旧值【${tempOldVal}】修改成【${tempNewVal}】`);
      this.show = false;
    }
  },
  watch: {
    show(newVal) {
      if (newVal === false) this.oldVal = this.newVal = "";
    }
  },
  created() {
    eventEmitter.on("修改规则对话框", ({ type, name }) => {
      this.show = true;
      this.ruleType = type;
      this.ruleName = name;
    });
  }
};
const __vue_script__$f = script$f;
var __vue_render__$f = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c(
        "el-dialog",
        {
          attrs: {
            "close-on-click-modal": false,
            modal: false,
            visible: _vm.show,
            title: "修改单项规则值",
            width: "30%",
          },
          on: {
            "update:visible": function ($event) {
              _vm.show = $event;
            },
          },
          scopedSlots: _vm._u([
            {
              key: "footer",
              fn: function () {
                return [
                  _c(
                    "el-button",
                    {
                      on: {
                        click: function ($event) {
                          _vm.show = false;
                        },
                      },
                    },
                    [_vm._v("取消")]
                  ),
                  _vm._v(" "),
                  _c("el-button", { on: { click: _vm.okBut } }, [
                    _vm._v("确定"),
                  ]),
                ]
              },
              proxy: true,
            },
          ]),
        },
        [
          _vm._v(
            "\n    " +
              _vm._s(_vm.ruleName) +
              "-" +
              _vm._s(_vm.ruleType) +
              "\n    "
          ),
          _c(
            "el-form",
            [
              _c(
                "el-form-item",
                { attrs: { label: "要修改的值" } },
                [
                  _c("el-input", {
                    attrs: { clearable: "", type: "text" },
                    model: {
                      value: _vm.oldVal,
                      callback: function ($$v) {
                        _vm.oldVal = $$v;
                      },
                      expression: "oldVal",
                    },
                  }),
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "el-form-item",
                { attrs: { label: "修改后的值" } },
                [
                  _c("el-input", {
                    attrs: { clearable: "" },
                    model: {
                      value: _vm.newVal,
                      callback: function ($$v) {
                        _vm.newVal = $$v;
                      },
                      expression: "newVal",
                    },
                  }),
                ],
                1
              ),
            ],
            1
          ),
        ],
        1
      ),
    ],
    1
  )
};
var __vue_staticRenderFns__$f = [];
__vue_render__$f._withStripped = true;
  const __vue_inject_styles__$f = undefined;
  const __vue_component__$f = normalizeComponent(
    { render: __vue_render__$f, staticRenderFns: __vue_staticRenderFns__$f },
    __vue_inject_styles__$f,
    __vue_script__$f);var script$e = {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    isNumerical: {
      type: Boolean,
      default: false
    },
    ruleInfo: {
      type: Object,
      default: () => {
        return {
          type: "ruleInfo默认type值",
          name: "ruleInfo默认name值"
        };
      }
    }
  },
  data: () => {
    return {
      dialogTitle: "",
      dialogVisible: false,
      inputVal: "",
      fragments: [],
      separator: ",",
      successAfterCloseVal: true
    };
  },
  methods: {
    closeHandle() {
      this.inputVal = "";
    },
    addBut() {
      if (this.fragments.length === 0) {
        this.$message.warning("未有分割项，请输入");
        return;
      }
      const { successList, failList } = ruleUtil.batchAddRule(this.fragments, this.ruleInfo.type);
      this.$alert(`成功项${successList.length}个:${successList.join(this.separator)}
                失败项${failList.length}个:${failList.join(this.separator)}
                `, "tip");
      if (successList.length > 0 && this.successAfterCloseVal) {
        this.dialogVisible = false;
      }
      eventEmitter.send("刷新规则信息");
    }
  },
  watch: {
    dialogVisible(val) {
      this.$emit("input", val);
    },
    value(val) {
      this.dialogVisible = val;
    },
    inputVal(val) {
      const list = [];
      for (let s of val.split(this.separator)) {
        if (s === "") continue;
        if (list.includes(s)) continue;
        s = s.trim();
        if (this.isNumerical) {
          if (isNaN(s)) {
            continue;
          } else {
            s = parseInt(s);
          }
        }
        list.push(s);
      }
      this.fragments = list;
    }
  }
};
const __vue_script__$e = script$e;
var __vue_render__$e = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c(
        "el-dialog",
        {
          attrs: {
            "close-on-click-modal": false,
            "close-on-press-escape": false,
            title: "批量添加" + _vm.ruleInfo.name + "-" + _vm.ruleInfo.type,
            visible: _vm.dialogVisible,
          },
          on: {
            "update:visible": function ($event) {
              _vm.dialogVisible = $event;
            },
            close: _vm.closeHandle,
          },
          scopedSlots: _vm._u([
            {
              key: "footer",
              fn: function () {
                return [
                  _c("el-button", { on: { click: _vm.addBut } }, [
                    _vm._v("添加"),
                  ]),
                ]
              },
              proxy: true,
            },
          ]),
        },
        [
          _c(
            "el-card",
            { attrs: { shadow: "never" } },
            [
              _c(
                "el-row",
                [
                  _c("el-col", { attrs: { span: 8 } }, [
                    _c("div", [_vm._v("1.分割项唯一，即重复xxx，只算1个")]),
                    _vm._v(" "),
                    _c("div", [_vm._v("2.uid类时，非数字跳过")]),
                    _vm._v(" "),
                    _c("div", [_vm._v("3.空项跳过")]),
                  ]),
                  _vm._v(" "),
                  _c(
                    "el-col",
                    { attrs: { span: 16 } },
                    [
                      _c("el-input", {
                        staticStyle: { width: "200px" },
                        scopedSlots: _vm._u([
                          {
                            key: "prepend",
                            fn: function () {
                              return [_vm._v("分隔符")]
                            },
                            proxy: true,
                          },
                        ]),
                        model: {
                          value: _vm.separator,
                          callback: function ($$v) {
                            _vm.separator = $$v;
                          },
                          expression: "separator",
                        },
                      }),
                      _vm._v(" "),
                      _c("el-switch", {
                        attrs: { "active-text": "添加成功后关闭对话框" },
                        model: {
                          value: _vm.successAfterCloseVal,
                          callback: function ($$v) {
                            _vm.successAfterCloseVal = $$v;
                          },
                          expression: "successAfterCloseVal",
                        },
                      }),
                    ],
                    1
                  ),
                ],
                1
              ),
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "el-form",
            [
              _c(
                "el-form-item",
                {
                  directives: [
                    {
                      name: "show",
                      rawName: "v-show",
                      value: _vm.fragments.length !== 0,
                      expression: "fragments.length!==0",
                    },
                  ],
                  attrs: { label: "分割项" },
                },
                [
                  _c(
                    "el-card",
                    {
                      attrs: { shadow: "never" },
                      scopedSlots: _vm._u([
                        {
                          key: "header",
                          fn: function () {
                            return [
                              _vm._v("数量:\n            "),
                              _c("el-tag", [
                                _vm._v(_vm._s(_vm.fragments.length)),
                              ]),
                            ]
                          },
                          proxy: true,
                        },
                      ]),
                    },
                    [
                      _vm._v(" "),
                      _vm._l(_vm.fragments, function (v) {
                        return _c(
                          "el-tag",
                          { key: v, staticStyle: { "margin-left": "5px" } },
                          [_vm._v(_vm._s(v))]
                        )
                      }),
                    ],
                    2
                  ),
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "el-form-item",
                { attrs: { label: "输入项" } },
                [
                  _c("el-input", {
                    attrs: { type: "textarea" },
                    model: {
                      value: _vm.inputVal,
                      callback: function ($$v) {
                        _vm.inputVal = $$v;
                      },
                      expression: "inputVal",
                    },
                  }),
                ],
                1
              ),
            ],
            1
          ),
        ],
        1
      ),
    ],
    1
  )
};
var __vue_staticRenderFns__$e = [];
__vue_render__$e._withStripped = true;
  const __vue_inject_styles__$e = undefined;
  const __vue_component__$e = normalizeComponent(
    { render: __vue_render__$e, staticRenderFns: __vue_staticRenderFns__$e },
    __vue_inject_styles__$e,
    __vue_script__$e);var script$d = {
  props: {
    ruleInfoArr: {
      type: Array
    }
  },
  methods: {
    refreshInfo(isTip = true) {
      for (let x of this.ruleInfoArr) {
        x.len = GM_getValue(x.type, []).length;
      }
      if (!isTip) return;
      this.$notify({ title: "tip", message: "刷新规则信息成功", type: "success" });
    },
    refreshInfoBut() {
      this.refreshInfo();
    },
    lookRuleBut(item) {
      if (item.len === 0) {
        this.$message.warning("当前规则信息为空");
        return;
      }
      const data = GM_getValue(item.type, []);
      eventEmitter.send("展示内容对话框", JSON.stringify(data));
    }
  },
  created() {
    this.refreshInfo(false);
    eventEmitter.on("刷新规则信息", (isTip = true) => {
      this.refreshInfo(isTip);
    });
  }
};
const __vue_script__$d = script$d;
var __vue_render__$d = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c(
        "el-card",
        {
          attrs: { shadow: "never" },
          scopedSlots: _vm._u([
            {
              key: "header",
              fn: function () {
                return [
                  _c("div", { staticClass: "el-horizontal-outside" }, [
                    _c("div", [_vm._v("基础规则信息")]),
                    _vm._v(" "),
                    _c(
                      "div",
                      [
                        _c("el-button", { on: { click: _vm.refreshInfoBut } }, [
                          _vm._v("刷新信息"),
                        ]),
                      ],
                      1
                    ),
                  ]),
                ]
              },
              proxy: true,
            },
          ]),
        },
        [
          _vm._v(" "),
          _c(
            "div",
            {
              staticStyle: {
                display: "flex",
                "flex-wrap": "wrap",
                "row-gap": "2px",
                "justify-content": "flex-start",
              },
            },
            _vm._l(_vm.ruleInfoArr, function (item) {
              return _c(
                "el-button",
                {
                  key: item.name,
                  attrs: { size: "small" },
                  on: {
                    click: function ($event) {
                      return _vm.lookRuleBut(item)
                    },
                  },
                },
                [
                  _vm._v("\n        " + _vm._s(item.name) + "\n        "),
                  _c(
                    "el-tag",
                    {
                      attrs: {
                        effect: item.len > 0 ? "dark" : "light",
                        size: "mini",
                      },
                    },
                    [_vm._v("\n          " + _vm._s(item.len) + "\n        ")]
                  ),
                ],
                1
              )
            }),
            1
          ),
        ]
      ),
    ],
    1
  )
};
var __vue_staticRenderFns__$d = [];
__vue_render__$d._withStripped = true;
  const __vue_inject_styles__$d = undefined;
  const __vue_component__$d = normalizeComponent(
    { render: __vue_render__$d, staticRenderFns: __vue_staticRenderFns__$d },
    __vue_inject_styles__$d,
    __vue_script__$d);var script$c = {
  components: { ruleInformationView: __vue_component__$d, ruleSetValueDialog: __vue_component__$f, multipleRuleEditDialog: __vue_component__$g, addRuleDialog: __vue_component__$e },
  data() {
    return {
      cascaderVal: ["精确匹配", "precise_uid"],
      cascaderOptions: ruleKeyListData.getSelectOptions(),
      ruleInfoArr: [],
      addRuleDialogVisible: false,
      addRuleDialogRuleInfo: {
        type: "",
        name: ""
      }
    };
  },
  methods: {
    handleChangeCascader(val) {
      console.log(val);
    },
    setRuleBut() {
      const [model, type] = this.cascaderVal;
      const typeMap = this.ruleInfoArr.find((item) => item.type === type);
      if (model === "多重匹配") {
        eventEmitter.send("打开多重规则编辑对话框", typeMap);
        return;
      }
      eventEmitter.send("修改规则对话框", typeMap);
    },
    findItemAllBut() {
      const [model, type] = this.cascaderVal;
      const typeMap = this.ruleInfoArr.find((item) => item.type === type);
      if (model === "多重匹配") {
        eventEmitter.send("打开多重规则编辑对话框", typeMap);
        return;
      }
      eventEmitter.send("event-lookRuleDialog", typeMap);
    },
    delAllBut() {
      this.$confirm("确定要删除所有规则吗？").then(() => {
        for (let x of this.ruleInfoArr) {
          GM_deleteValue(x.type);
        }
        this.$message.success("删除全部规则成功");
        eventEmitter.send("刷新规则信息", false);
      });
    },
    delBut() {
      const [model, type] = this.cascaderVal;
      const typeMap = this.ruleInfoArr.find((item) => item.type === type);
      if (model === "多重匹配") {
        eventEmitter.send("打开多重规则编辑对话框", typeMap);
        return;
      }
      ruleUtil.showDelRuleInput(type);
    },
    clearItemRuleBut() {
      const type = this.cascaderVal[1];
      const find = this.ruleInfoArr.find((item) => item.type === type);
      this.$confirm(`是要清空${find.name}的规则内容吗？`, "tip").then(() => {
        ruleKeyListData.clearKeyItem(type);
        this.$alert(`已清空${find.name}的规则内容`);
      });
    },
    batchAddBut() {
      const [model, type] = this.cascaderVal;
      if (model === "多重匹配") {
        const typeMap = this.ruleInfoArr.find((item) => item.type === type);
        eventEmitter.send("打开多重规则编辑对话框", typeMap);
        return;
      }
      this.addRuleDialogVisible = true;
      this.addRuleDialogRuleInfo = {
        type,
        name: this.ruleInfoArr.find((item) => item.type === type).name
      };
    }
  },
  watch: {},
  created() {
    for (let newRuleKeyListElement of ruleKeyListData.getRuleKeyListData()) {
      this.ruleInfoArr.push({
        type: newRuleKeyListElement.key,
        name: newRuleKeyListElement.name
      });
    }
  }
};
const __vue_script__$c = script$c;
var __vue_render__$c = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c(
        "el-row",
        [
          _c(
            "el-col",
            { attrs: { span: 10 } },
            [
              _c(
                "el-card",
                {
                  attrs: { shadow: "never" },
                  scopedSlots: _vm._u([
                    {
                      key: "header",
                      fn: function () {
                        return [_vm._v("选择规则")]
                      },
                      proxy: true,
                    },
                  ]),
                },
                [
                  _vm._v(" "),
                  _c("el-cascader", {
                    attrs: {
                      options: _vm.cascaderOptions,
                      props: { expandTrigger: "hover" },
                      "show-all-levels": false,
                      filterable: "",
                    },
                    on: { change: _vm.handleChangeCascader },
                    model: {
                      value: _vm.cascaderVal,
                      callback: function ($$v) {
                        _vm.cascaderVal = $$v;
                      },
                      expression: "cascaderVal",
                    },
                  }),
                  _vm._v(" "),
                  _c("el-divider"),
                  _vm._v(" "),
                  _c(
                    "el-row",
                    [
                      _c(
                        "el-col",
                        { attrs: { span: 12 } },
                        [
                          _c(
                            "el-button-group",
                            [
                              _c(
                                "el-button",
                                { on: { click: _vm.batchAddBut } },
                                [_vm._v("批量添加")]
                              ),
                              _vm._v(" "),
                              _c(
                                "el-button",
                                { on: { click: _vm.setRuleBut } },
                                [_vm._v("修改")]
                              ),
                              _vm._v(" "),
                              _c(
                                "el-button",
                                { on: { click: _vm.findItemAllBut } },
                                [_vm._v("查看项内容")]
                              ),
                              _vm._v(" "),
                              _c("el-button", { on: { click: _vm.delBut } }, [
                                _vm._v("移除"),
                              ]),
                            ],
                            1
                          ),
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c("el-col", { attrs: { span: 12 } }, [
                        _c(
                          "div",
                          { staticClass: "el-horizontal-right" },
                          [
                            _c(
                              "el-button-group",
                              [
                                _c(
                                  "el-button",
                                  {
                                    attrs: { type: "danger" },
                                    on: { click: _vm.clearItemRuleBut },
                                  },
                                  [_vm._v("清空项")]
                                ),
                                _vm._v(" "),
                                _c(
                                  "el-button",
                                  {
                                    attrs: { type: "danger" },
                                    on: { click: _vm.delAllBut },
                                  },
                                  [_vm._v("全部移除")]
                                ),
                              ],
                              1
                            ),
                          ],
                          1
                        ),
                      ]),
                    ],
                    1
                  ),
                ],
                1
              ),
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "el-col",
            { attrs: { span: 14 } },
            [
              _c(
                "el-card",
                {
                  attrs: { shadow: "never" },
                  scopedSlots: _vm._u([
                    {
                      key: "header",
                      fn: function () {
                        return [_c("span", [_vm._v("使用说明")])]
                      },
                      proxy: true,
                    },
                  ]),
                },
                [
                  _vm._v(" "),
                  _c("div", [
                    _vm._v(
                      "1.基础规则类型较多，下拉框支持搜索定位，鼠标点击出现光标时支持筛选"
                    ),
                  ]),
                  _vm._v(" "),
                  _c("div", [_vm._v("2.大部分情况下模糊匹配比精确匹配好用")]),
                  _vm._v(" "),
                  _c("div", [
                    _vm._v(
                      "3.如果可以的话，请优先考虑根据uid精确屏蔽，而非使用用户名相关屏蔽，因用户名可以随意更改"
                    ),
                  ]),
                  _vm._v(" "),
                  _c(
                    "div",
                    [
                      _vm._v(
                        "4.如果用户要添加自己的正则匹配相关的规则时，建议先去该网址进行测试再添加，避免浪费时间\n          "
                      ),
                      _c(
                        "el-link",
                        {
                          attrs: {
                            href: "https://www.jyshare.com/front-end/854/",
                            target: "_blank",
                            type: "primary",
                          },
                        },
                        [_vm._v(">>>正则表达式在线测试<<<\n          ")]
                      ),
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c("div", [
                    _vm._v(
                      "\n          5.如果更新脚本之后规则全没了，请点击下面的【旧规则自动转新规则】按钮，进行转换，如不行请通过关于和问题反馈选项卡中的反馈渠道联系作者\n        "
                    ),
                  ]),
                  _vm._v(" "),
                  _c("div", [_vm._v("6.改动实时生效")]),
                  _vm._v(" "),
                  _c("div", [
                    _vm._v(
                      "7. 分区包括子分区属于视频tag范畴,如需按分区屏蔽在对应视频tag类型添加"
                    ),
                  ]),
                  _vm._v(" "),
                  _c("div", [
                    _vm._v(
                      "8.\n          基础规则中的项和组合规则互斥，如xxx添加到视频tag多重规则，则不能添加到对应基础规则视频tag，反之同理，限类型，如组合精确匹配\n        "
                    ),
                  ]),
                ]
              ),
              _vm._v(" "),
              _c("ruleInformationView", {
                attrs: { "rule-info-arr": _vm.ruleInfoArr },
              }),
            ],
            1
          ),
        ],
        1
      ),
      _vm._v(" "),
      _c("ruleSetValueDialog"),
      _vm._v(" "),
      _c("multipleRuleEditDialog"),
      _vm._v(" "),
      _c("addRuleDialog", {
        attrs: { "rule-info": _vm.addRuleDialogRuleInfo },
        model: {
          value: _vm.addRuleDialogVisible,
          callback: function ($$v) {
            _vm.addRuleDialogVisible = $$v;
          },
          expression: "addRuleDialogVisible",
        },
      }),
    ],
    1
  )
};
var __vue_staticRenderFns__$c = [];
__vue_render__$c._withStripped = true;
  const __vue_inject_styles__$c = undefined;
  const __vue_component__$c = normalizeComponent(
    { render: __vue_render__$c, staticRenderFns: __vue_staticRenderFns__$c },
    __vue_inject_styles__$c,
    __vue_script__$c);var script$b = {
  data() {
    return {
      ruleContentImport: "",
      select: {
        val: [],
        options: []
      }
    };
  },
  methods: {
    getSelectValRuleContent() {
      const val = this.select.val;
      if (val.length === 0) return;
      const map = {};
      for (const valKey of val) {
        const find = this.select.options.find((item) => item.key === valKey);
        if (find === void 0) continue;
        const { key } = find;
        const ruleItemList = GM_getValue(key, []);
        if (ruleItemList.length === 0) continue;
        map[key] = ruleItemList;
      }
      if (Object.keys(map).length === 0) {
        this.$message.warning(`选定的规则类型都为空`);
        return false;
      }
      return map;
    },
    overwriteImportRulesBut() {
      this.$confirm("是否要覆盖导入规则？").then(() => {
        const trim = this.ruleContentImport.trim();
        if (ruleUtil.overwriteImportRules(trim)) {
          this.$alert("已覆盖导入成功！");
          eventEmitter.send("刷新规则信息");
        }
      });
    },
    appendImportRulesBut() {
      this.$confirm("是否要追加导入规则？").then(() => {
        const trim = this.ruleContentImport.trim();
        if (ruleUtil.appendImportRules(trim)) {
          this.$message("已追加导入成功！");
          eventEmitter.send("刷新规则信息");
        }
      });
    },
    handleFileUpload(event) {
      defUtil$1.handleFileReader(event).then((data) => {
        const { content } = data;
        try {
          JSON.parse(content);
        } catch (e) {
          this.$message("文件内容有误");
          return;
        }
        this.ruleContentImport = content;
        this.$message("读取到内容，请按需覆盖或追加");
      });
    },
    inputFIleRuleBut() {
      this.$refs.file.click();
    },
    outToInputBut() {
      this.ruleContentImport = ruleUtil.getRuleContent(false);
      this.$message("已导出到输入框中");
    },
    ruleOutToFIleBut() {
      const map = this.getSelectValRuleContent();
      if (map === false) return;
      this.$prompt("请输入文件名", "保存为", {
        inputValue: "b站屏蔽器规则-指定类型-" + defUtil$1.toTimeString()
      }).then(({ value }) => {
        if (value === "" && value.includes(" ")) {
          this.$alert("文件名不能为空或包含空格");
          return;
        }
        saveTextAsFile(JSON.stringify(map, null, 4), value + ".json");
      });
    },
    basisRuleOutToFIleBut() {
      let fileName = "b站屏蔽器规则-" + defUtil$1.toTimeString();
      this.$prompt("请输入文件名", "保存为", {
        inputValue: fileName
      }).then(({ value }) => {
        if (value === "" && value.includes(" ")) {
          this.$alert("文件名不能为空或包含空格");
          return;
        }
        saveTextAsFile(ruleUtil.getRuleContent(true, 4), value + ".json");
      });
    },
    ruleOutToConsoleBut() {
      const map = this.getSelectValRuleContent();
      if (map === false) return;
      console.log(map);
      this.$message.info("已导出到控制台上，F12打开控制台查看");
    },
    basisRuleOutToConsoleBut() {
      console.log(ruleUtil.getRuleContent(false));
      this.$message("已导出到控制台上，F12打开控制台查看");
    }
  },
  created() {
    for (const v of ruleKeyListData.getRuleKeyListData()) {
      this.select.options.push(v);
    }
  }
};
const __vue_script__$b = script$b;
var __vue_render__$b = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c(
        "el-card",
        {
          attrs: { shadow: "never" },
          scopedSlots: _vm._u([
            {
              key: "header",
              fn: function () {
                return [_c("span", [_vm._v("导出基础规则")])]
              },
              proxy: true,
            },
          ]),
        },
        [
          _vm._v(" "),
          _c("el-button", { on: { click: _vm.basisRuleOutToFIleBut } }, [
            _vm._v("导出文件"),
          ]),
          _vm._v(" "),
          _c("el-button", { on: { click: _vm.outToInputBut } }, [
            _vm._v("导出编辑框"),
          ]),
          _vm._v(" "),
          _c("el-button", { on: { click: _vm.basisRuleOutToConsoleBut } }, [
            _vm._v("导出控制台"),
          ]),
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "el-card",
        {
          attrs: { shadow: "never" },
          scopedSlots: _vm._u([
            {
              key: "header",
              fn: function () {
                return [_vm._v("导出指定规则")]
              },
              proxy: true,
            },
          ]),
        },
        [
          _vm._v(" "),
          _c(
            "el-select",
            {
              attrs: {
                clearable: "",
                filterable: "",
                multiple: "",
                placeholder: "请选择导出规则类型",
              },
              model: {
                value: _vm.select.val,
                callback: function ($$v) {
                  _vm.$set(_vm.select, "val", $$v);
                },
                expression: "select.val",
              },
            },
            _vm._l(_vm.select.options, function (item) {
              return _c("el-option", {
                key: item.key,
                attrs: { label: item.name, value: item.key },
              })
            }),
            1
          ),
          _vm._v(" "),
          _c("el-button", { on: { click: _vm.ruleOutToFIleBut } }, [
            _vm._v("导出文件"),
          ]),
          _vm._v(" "),
          _c("el-button", { on: { click: _vm.ruleOutToConsoleBut } }, [
            _vm._v("导出控制台"),
          ]),
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "el-card",
        {
          attrs: { shadow: "never" },
          scopedSlots: _vm._u([
            {
              key: "header",
              fn: function () {
                return [_vm._v("导入规则")]
              },
              proxy: true,
            },
          ]),
        },
        [
          _vm._v(" "),
          _c("div", [_vm._v("仅支持json格式内容导入,且最外层为对象(花括号)")]),
          _vm._v(" "),
          _c("div", [_vm._v("内容格式为{key: [规则列表]}")]),
          _vm._v(" "),
          _c("div", [
            _vm._v(
              "可以只导入指定类型规则，最外层需为对象，key为规则的内部key，value为规则列表"
            ),
          ]),
          _vm._v(" "),
          _c("el-divider"),
          _vm._v(" "),
          _c(
            "div",
            [
              _c("el-button", { on: { click: _vm.inputFIleRuleBut } }, [
                _vm._v("读取外部规则文件"),
              ]),
              _vm._v(" "),
              _c("el-button", { on: { click: _vm.overwriteImportRulesBut } }, [
                _vm._v("覆盖导入规则"),
              ]),
              _vm._v(" "),
              _c("el-button", { on: { click: _vm.appendImportRulesBut } }, [
                _vm._v("追加导入规则"),
              ]),
            ],
            1
          ),
          _vm._v(" "),
          _c("el-divider"),
          _vm._v(" "),
          _c(
            "div",
            [
              _c("el-input", {
                attrs: {
                  autosize: { minRows: 10, maxRows: 50 },
                  autosize: "",
                  placeholder: "要导入的规则内容",
                  type: "textarea",
                },
                model: {
                  value: _vm.ruleContentImport,
                  callback: function ($$v) {
                    _vm.ruleContentImport = $$v;
                  },
                  expression: "ruleContentImport",
                },
              }),
            ],
            1
          ),
        ],
        1
      ),
      _vm._v(" "),
      _c("input", {
        ref: "file",
        staticStyle: { display: "none" },
        attrs: { accept: "application/json", type: "file" },
        on: { change: _vm.handleFileUpload },
      }),
    ],
    1
  )
};
var __vue_staticRenderFns__$b = [];
__vue_render__$b._withStripped = true;
  const __vue_inject_styles__$b = undefined;
  const __vue_component__$b = normalizeComponent(
    { render: __vue_render__$b, staticRenderFns: __vue_staticRenderFns__$b },
    __vue_inject_styles__$b,
    __vue_script__$b);var externalList = [
  {
    "title": "弹幕量限制",
    "minInputKey": "minimum_barrage_gm",
    "maxInputKey": "maximum_barrage_gm",
    "minLabel": "最小弹幕量限制",
    "maxLabel": "最大弹幕量限制",
    "isMaxKey": "is_maximum_barrage_gm",
    "isMinKey": "is_minimum_barrage_gm",
    "minDefVal": 20,
    "maxDefVal": 1000
  },
  {
    "title": "播放量限制",
    "minInputKey": "minimum_play_gm",
    "maxInputKey": "maximum_play_gm",
    "minLabel": "最小播放量限制",
    "maxLabel": "最大播放量限制",
    "isMaxKey": "is_maximum_play_gm",
    "isMinKey": "is_minimum_play_gm",
    "minDefVal": 100,
    "maxDefVal": 10000
  },
  {
    "title": "时长限制",
    "minInputKey": "minimum_duration_gm",
    "maxInputKey": "maximum_duration_gm",
    "minLabel": "最小时长限制",
    "maxLabel": "最大时长限制",
    "isMaxKey": "is_maximum_duration_gm",
    "isMinKey": "is_minimum_duration_gm",
    "minDefVal": 30,
    "maxDefVal": 3000
  }
];var script$a = {
  data() {
    return {
      value: localMKData.getCommentWordLimitVal()
    };
  },
  watch: {
    value(newVal, oldVal) {
      if (oldVal <= 3) return;
      if (newVal < 3) {
        this.$notify({
          message: "已关闭屏蔽字数限制功能",
          type: "warning"
        });
      }
      GM_setValue("comment_word_limit", newVal);
    }
  }
};
const __vue_script__$a = script$a;
var __vue_render__$a = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c(
        "el-card",
        {
          attrs: { shadow: "never" },
          scopedSlots: _vm._u([
            {
              key: "header",
              fn: function () {
                return [_vm._v("评论字数限制")]
              },
              proxy: true,
            },
          ]),
        },
        [
          _vm._v(" "),
          _c("div", [
            _vm._v("超出设置限制的字数时屏蔽(不包括)，低于3则不生效"),
          ]),
          _vm._v(" "),
          _c("div", [_vm._v("改动即生效")]),
          _vm._v(" "),
          _c("el-input-number", {
            model: {
              value: _vm.value,
              callback: function ($$v) {
                _vm.value = $$v;
              },
              expression: "value",
            },
          }),
        ],
        1
      ),
    ],
    1
  )
};
var __vue_staticRenderFns__$a = [];
__vue_render__$a._withStripped = true;
  const __vue_inject_styles__$a = undefined;
  const __vue_component__$a = normalizeComponent(
    { render: __vue_render__$a, staticRenderFns: __vue_staticRenderFns__$a },
    __vue_inject_styles__$a,
    __vue_script__$a);var script$9 = {
  data() {
    return {
      minVal: 0,
      maxVal: 7,
      minimumUserLevelVideoVal: getMinimumUserLevelVideoGm(),
      maximumUserLevelVideoVal: getMaximumUserLevelVideoGm(),
      minimumCommentVal: getMinimumUserLevelCommentGm(),
      maximumCommentVal: getMaximumUserLevelCommentGm(),
      isEnableMinimumUserLevelVideoVal: isEnableMinimumUserLevelVideoGm(),
      isEnableMaximumUserLevelVideoVal: isEnableMaximumUserLevelVideoGm(),
      isEnableMinimumUserLevelCommentVal: isEnableMinimumUserLevelCommentGm(),
      isEnableMaximumUserLevelCommentVal: isEnableMaximumUserLevelCommentGm()
    };
  },
  methods: {},
  watch: {
    minimumUserLevelVideoVal(n) {
      const max = this.maximumUserLevelVideoVal;
      if (n > max) {
        this.minimumUserLevelVideoVal = max;
        this.$message.warning("最小等级不能大于最大等级");
        return;
      }
      if (n === max) {
        --this.minimumUserLevelVideoVal;
        this.$message.warning("最小等级不能等于最大等级");
        return;
      }
      GM_setValue("minimum_user_level_video_gm", n);
    },
    maximumUserLevelVideoVal(n) {
      const min = this.minimumUserLevelVideoVal;
      if (n < min) {
        this.maximumUserLevelVideoVal = min;
        this.$message.warning("最大等级不能小于最小等级");
        return;
      }
      if (n === min) {
        ++this.maximumUserLevelVideoVal;
        this.$message.warning("最大等级不能等于最小等级");
        return;
      }
      GM_setValue("maximum_user_level_video_gm", this.maximumUserLevelVideoVal);
    },
    minimumCommentVal(n) {
      const max = this.maximumCommentVal;
      if (n > max) {
        this.minimumCommentVal = max;
        this.$message.warning("最小等级不能大于最大等级");
        return;
      }
      if (n === max) {
        --this.minimumCommentVal;
        this.$message.warning("最小等级不能等于最大等级");
        return;
      }
      GM_setValue("minimum_user_level_comment_gm", n);
    },
    maximumCommentVal(n) {
      const min = this.minimumCommentVal;
      if (n < min) {
        this.maximumCommentVal = min;
        this.$message.warning("最大等级不能小于最小等级");
        return;
      }
      if (n === min) {
        ++this.maximumCommentVal;
        this.$message.warning("最大等级不能等于最小等级");
        return;
      }
      GM_setValue("maximum_user_level_comment_gm", n);
    },
    isEnableMinimumUserLevelVideoVal(n) {
      GM_setValue("is_enable_minimum_user_level_video_gm", n);
    },
    isEnableMaximumUserLevelVideoVal(n) {
      GM_setValue("is_enable_maximum_user_level_video_gm", n);
    },
    isEnableMinimumUserLevelCommentVal(n) {
      GM_setValue("is_enable_minimum_user_level_comment_gm", n);
    },
    isEnableMaximumUserLevelCommentVal(n) {
      GM_setValue("is_enable_maximum_user_level_comment_gm", n);
    }
  }
};
const __vue_script__$9 = script$9;
var __vue_render__$9 = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "el-card",
    {
      attrs: { shadow: "never" },
      scopedSlots: _vm._u([
        {
          key: "header",
          fn: function () {
            return [_vm._v("等级限制")]
          },
          proxy: true,
        },
      ]),
    },
    [
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "el-horizontal-left" },
        [
          _c("div", [
            _vm._v("\n      视频类\n      "),
            _c(
              "div",
              [
                _vm._v(
                  "启用最小等级" +
                    _vm._s(_vm.minimumUserLevelVideoVal) +
                    "\n        "
                ),
                _c("el-switch", {
                  model: {
                    value: _vm.isEnableMinimumUserLevelVideoVal,
                    callback: function ($$v) {
                      _vm.isEnableMinimumUserLevelVideoVal = $$v;
                    },
                    expression: "isEnableMinimumUserLevelVideoVal",
                  },
                }),
                _vm._v(" "),
                _c("el-input-number", {
                  attrs: { max: _vm.maxVal, min: _vm.minVal },
                  model: {
                    value: _vm.minimumUserLevelVideoVal,
                    callback: function ($$v) {
                      _vm.minimumUserLevelVideoVal = $$v;
                    },
                    expression: "minimumUserLevelVideoVal",
                  },
                }),
              ],
              1
            ),
            _vm._v(" "),
            _c(
              "div",
              [
                _vm._v(
                  "启用最大等级" +
                    _vm._s(_vm.maximumUserLevelVideoVal) +
                    "\n        "
                ),
                _c("el-switch", {
                  model: {
                    value: _vm.isEnableMaximumUserLevelVideoVal,
                    callback: function ($$v) {
                      _vm.isEnableMaximumUserLevelVideoVal = $$v;
                    },
                    expression: "isEnableMaximumUserLevelVideoVal",
                  },
                }),
                _vm._v(" "),
                _c("el-input-number", {
                  attrs: { max: _vm.maxVal, min: 1 },
                  model: {
                    value: _vm.maximumUserLevelVideoVal,
                    callback: function ($$v) {
                      _vm.maximumUserLevelVideoVal = $$v;
                    },
                    expression: "maximumUserLevelVideoVal",
                  },
                }),
              ],
              1
            ),
          ]),
          _vm._v(" "),
          _c("el-divider", {
            staticClass: "height-auto",
            attrs: { direction: "vertical" },
          }),
          _vm._v(" "),
          _c("div", [
            _vm._v("\n      评论类\n      "),
            _c(
              "div",
              [
                _vm._v(
                  "启用最小等级" + _vm._s(_vm.minimumCommentVal) + "\n        "
                ),
                _c("el-switch", {
                  model: {
                    value: _vm.isEnableMinimumUserLevelCommentVal,
                    callback: function ($$v) {
                      _vm.isEnableMinimumUserLevelCommentVal = $$v;
                    },
                    expression: "isEnableMinimumUserLevelCommentVal",
                  },
                }),
                _vm._v(" "),
                _c("el-input-number", {
                  attrs: { max: _vm.maxVal, min: 3 },
                  model: {
                    value: _vm.minimumCommentVal,
                    callback: function ($$v) {
                      _vm.minimumCommentVal = $$v;
                    },
                    expression: "minimumCommentVal",
                  },
                }),
              ],
              1
            ),
            _vm._v(" "),
            _c(
              "div",
              [
                _vm._v(
                  "启用最大等级" + _vm._s(_vm.maximumCommentVal) + "\n        "
                ),
                _c("el-switch", {
                  model: {
                    value: _vm.isEnableMaximumUserLevelCommentVal,
                    callback: function ($$v) {
                      _vm.isEnableMaximumUserLevelCommentVal = $$v;
                    },
                    expression: "isEnableMaximumUserLevelCommentVal",
                  },
                }),
                _vm._v(" "),
                _c("el-input-number", {
                  attrs: { max: _vm.maxVal, min: 3 },
                  model: {
                    value: _vm.maximumCommentVal,
                    callback: function ($$v) {
                      _vm.maximumCommentVal = $$v;
                    },
                    expression: "maximumCommentVal",
                  },
                }),
              ],
              1
            ),
          ]),
          _vm._v(" "),
          _c("el-divider", {
            staticClass: "height-auto",
            attrs: { direction: "vertical" },
          }),
        ],
        1
      ),
    ]
  )
};
var __vue_staticRenderFns__$9 = [];
__vue_render__$9._withStripped = true;
  const __vue_inject_styles__$9 = undefined;
  const __vue_component__$9 = normalizeComponent(
    { render: __vue_render__$9, staticRenderFns: __vue_staticRenderFns__$9 },
    __vue_inject_styles__$9,
    __vue_script__$9);var script$8 = {
  props: {
    title: {
      type: String,
      default: "默认标题"
    },
    isMaxText: { default: "启用最大" },
    isMinText: { default: "启用最小" },
    minDefVal: { default: 0 },
    maxDefVal: { default: 1 },
    isMaxVal: { default: false },
    isMinVal: { default: false },
    minInputKey: { type: String, required: true },
    maxInputKey: { type: String, required: true },
    isMaxKey: { type: String, required: true },
    isMinKey: { type: String, required: true }
  },
  data() {
    return {
      localIsMaxVal: GM_getValue(this.isMaxKey, false),
      localIsMinVal: GM_getValue(this.isMinKey, false),
      localMinInputVal: GM_getValue(this.minInputKey, this.minDefVal),
      localMaxInputVal: GM_getValue(this.maxInputKey, this.maxDefVal)
    };
  },
  watch: {
    localIsMaxVal(n) {
      GM_setValue(this.isMaxKey, n);
    },
    localIsMinVal(n) {
      GM_setValue(this.isMinKey, n);
    },
    localMinInputVal(n) {
      GM_setValue(this.minInputKey, n);
    },
    localMaxInputVal(n) {
      GM_setValue(this.maxInputKey, n);
    }
  }
};
const __vue_script__$8 = script$8;
var __vue_render__$8 = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "el-card",
    {
      attrs: { shadow: "never" },
      scopedSlots: _vm._u([
        {
          key: "header",
          fn: function () {
            return [_vm._v(_vm._s(_vm.title))]
          },
          proxy: true,
        },
      ]),
    },
    [
      _vm._v(" "),
      _c(
        "div",
        [
          _c("el-switch", {
            attrs: { "active-text": _vm.isMinText },
            model: {
              value: _vm.localIsMinVal,
              callback: function ($$v) {
                _vm.localIsMinVal = $$v;
              },
              expression: "localIsMinVal",
            },
          }),
          _vm._v(" "),
          _c("el-input-number", {
            attrs: { max: _vm.localMaxInputVal - 1, min: 0 },
            model: {
              value: _vm.localMinInputVal,
              callback: function ($$v) {
                _vm.localMinInputVal = $$v;
              },
              expression: "localMinInputVal",
            },
          }),
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        [
          _c("el-switch", {
            attrs: { "active-text": _vm.isMaxText },
            model: {
              value: _vm.localIsMaxVal,
              callback: function ($$v) {
                _vm.localIsMaxVal = $$v;
              },
              expression: "localIsMaxVal",
            },
          }),
          _vm._v(" "),
          _c("el-input-number", {
            attrs: { min: _vm.localMinInputVal + 1 },
            model: {
              value: _vm.localMaxInputVal,
              callback: function ($$v) {
                _vm.localMaxInputVal = $$v;
              },
              expression: "localMaxInputVal",
            },
          }),
        ],
        1
      ),
    ]
  )
};
var __vue_staticRenderFns__$8 = [];
__vue_render__$8._withStripped = true;
  const __vue_inject_styles__$8 = undefined;
  const __vue_component__$8 = normalizeComponent(
    { render: __vue_render__$8, staticRenderFns: __vue_staticRenderFns__$8 },
    __vue_inject_styles__$8,
    __vue_script__$8);var script$7 = {
  components: { SwitchMinMaxInputCard: __vue_component__$8, commentWordLimitView: __vue_component__$a, UserLevelFilteringView: __vue_component__$9 },
  data() {
    return {
      showInfoList: [
        { key: "minimum_user_level_video_gm", label: "最小用户等级限制-视频" },
        { key: "maximum_user_level_video_gm", label: "最大用户等级限制-视频" },
        { key: "minimum_user_level_comment_gm", label: "最小用户等级限制-评论" },
        { key: "maximum_user_level_comment_gm", label: "最大用户等级限制-评论" }
      ],
      externalList
    };
  },
  methods: {
    updateInfo(isTip = false) {
      for (const v of this.showInfoList) {
        v.showVal = GM_getValue(v.key, "");
      }
      isTip && this.$notify({ type: "info", position: "bottom-right", message: "已刷新" });
    }
  },
  created() {
    for (const v of this.externalList) {
      this.showInfoList.push({ label: v["minLabel"], key: v["minInputKey"], showVal: "" });
      this.showInfoList.push({ label: v["maxLabel"], key: v["maxInputKey"], showVal: "" });
    }
    this.updateInfo();
  }
};
const __vue_script__$7 = script$7;
var __vue_render__$7 = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", [
    _c("div", { staticStyle: { display: "flex" } }, [
      _c(
        "div",
        { staticStyle: { width: "70vw" } },
        [
          _c("UserLevelFilteringView"),
          _vm._v(" "),
          _c(
            "div",
            { staticStyle: { display: "flex" } },
            _vm._l(_vm.externalList, function (v) {
              return _c("switch-min-max-input-card", {
                key: v.title,
                attrs: {
                  "is-max-key": v.isMaxKey,
                  "is-min-key": v.isMinKey,
                  "max-def-val": v.maxDefVal,
                  "max-input-key": v.maxInputKey,
                  "min-def-val": v.minDefVal,
                  "min-input-key": v.minInputKey,
                  title: v.title,
                },
              })
            }),
            1
          ),
          _vm._v(" "),
          _c("commentWordLimitView"),
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        [
          _c(
            "el-card",
            {
              attrs: { shadow: "never" },
              scopedSlots: _vm._u([
                {
                  key: "header",
                  fn: function () {
                    return [_c("span", [_vm._v("使用说明")])]
                  },
                  proxy: true,
                },
              ]),
            },
            [
              _vm._v(" "),
              _c("ol", [
                _c("li", [_vm._v("如设置时长相关单位为秒")]),
                _vm._v(" "),
                _c("li", [_vm._v("如设置播放量和弹幕量相关单位为个")]),
                _vm._v(" "),
                _c("li", [_vm._v("最小播放量则小于该值的视频会屏蔽")]),
                _vm._v(" "),
                _c("li", [_vm._v("最大播放量则大于该值的视频会屏蔽")]),
                _vm._v(" "),
                _c("li", [_vm._v("最小弹幕量则小于该值的视频会屏蔽")]),
                _vm._v(" "),
                _c("li", [_vm._v("最大弹幕量则大于该值的视频会屏蔽")]),
                _vm._v(" "),
                _c("li", [_vm._v("最小时长则小于该值的视频会屏蔽")]),
                _vm._v(" "),
                _c("li", [_vm._v("最大时长则大于该值的视频会屏蔽")]),
                _vm._v(" "),
                _c("li", [_vm._v("最小用户等级则小于该值的会屏蔽")]),
                _vm._v(" "),
                _c("li", [_vm._v("最大用户等级则大于该值的会屏蔽")]),
                _vm._v(" "),
                _c("li", [_vm._v("取消相关限制条件则不做限制处理")]),
                _vm._v(" "),
                _c("li", [_vm._v("右侧信息关键条件-1则为未做任何限制处理")]),
                _vm._v(" "),
                _c("li", [
                  _vm._v(
                    "最后因为设置限制条件冲突或限制太多，视频未能限制的情况下，请按需设置限制条件"
                  ),
                ]),
              ]),
            ]
          ),
          _vm._v(" "),
          _c(
            "el-button",
            {
              on: {
                click: function ($event) {
                  return _vm.updateInfo(true)
                },
              },
            },
            [_vm._v("刷新")]
          ),
          _vm._v(" "),
          _vm._l(_vm.showInfoList, function (v) {
            return _c(
              "div",
              { key: v.label },
              [
                _vm._v("\n        " + _vm._s(v.label) + "\n        "),
                _c("el-tag", [_vm._v(_vm._s(v.showVal))]),
              ],
              1
            )
          }),
        ],
        2
      ),
    ]),
  ])
};
var __vue_staticRenderFns__$7 = [];
__vue_render__$7._withStripped = true;
  const __vue_inject_styles__$7 = undefined;
  const __vue_component__$7 = normalizeComponent(
    { render: __vue_render__$7, staticRenderFns: __vue_staticRenderFns__$7 },
    __vue_inject_styles__$7,
    __vue_script__$7);var script$6 = {
  data() {
    return {
      dialogVisible: false,
      typeMap: {},
      showTags: []
    };
  },
  methods: {
    updateShowRuleTags() {
      this.showTags = GM_getValue(this.typeMap.type, []);
    },
    handleTagClose(tag, index) {
      if (tag === "") return;
      this.$confirm(`确定要删除 ${tag} 吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.showTags.splice(index, 1);
        GM_setValue(this.typeMap.type, this.showTags);
        this.$message.success(`已移除 ${tag}`);
        eventEmitter.send("刷新规则信息", false);
      });
    },
    closedHandle() {
      this.typeMap = {};
      this.showTags.splice(0, this.showTags.length);
    }
  },
  created() {
    eventEmitter.on("event-lookRuleDialog", (typeMap) => {
      this.typeMap = typeMap;
      this.dialogVisible = true;
      this.updateShowRuleTags();
    });
  }
};
const __vue_script__$6 = script$6;
var __vue_render__$6 = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c(
        "el-dialog",
        {
          attrs: {
            "close-on-click-modal": false,
            "close-on-press-escape": false,
            fullscreen: true,
            modal: false,
            visible: _vm.dialogVisible,
            title: "查看规则内容",
          },
          on: {
            closed: _vm.closedHandle,
            "update:visible": function ($event) {
              _vm.dialogVisible = $event;
            },
          },
        },
        [
          _c(
            "el-card",
            {
              scopedSlots: _vm._u([
                {
                  key: "header",
                  fn: function () {
                    return [_vm._v("规则信息")]
                  },
                  proxy: true,
                },
              ]),
            },
            [
              _vm._v(" "),
              _c("el-tag", [
                _vm._v(_vm._s(_vm.typeMap.name + "|" + _vm.typeMap.type)),
              ]),
              _vm._v(" "),
              _c("el-tag", [_vm._v(_vm._s(_vm.showTags.length) + "个")]),
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "el-card",
            _vm._l(_vm.showTags, function (item, index) {
              return _c(
                "el-tag",
                {
                  key: index,
                  attrs: { closable: "" },
                  on: {
                    close: function ($event) {
                      return _vm.handleTagClose(item, index)
                    },
                  },
                },
                [_vm._v("\n        " + _vm._s(item) + "\n      ")]
              )
            }),
            1
          ),
        ],
        1
      ),
    ],
    1
  )
};
var __vue_staticRenderFns__$6 = [];
__vue_render__$6._withStripped = true;
  const __vue_inject_styles__$6 = undefined;
  const __vue_component__$6 = normalizeComponent(
    { render: __vue_render__$6, staticRenderFns: __vue_staticRenderFns__$6 },
    __vue_inject_styles__$6,
    __vue_script__$6);var script$5 = {
  components: {
    ruleExportImportView: __vue_component__$b,
    otherParameterFilterView: __vue_component__$7,
    basicRulesView: __vue_component__$c,
    blacklistManagementView: __vue_component__$h,
    highLevelRuleView: __vue_component__$i,
    videoMetricsFilterView: __vue_component__$k,
    timeRangeMaskingView: __vue_component__$n,
    replProcessingView: __vue_component__$p,
    viewRulesRuleDialog: __vue_component__$6
  }
};
const __vue_script__$5 = script$5;
var __vue_render__$5 = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c(
        "el-tabs",
        { attrs: { "tab-position": "left", type: "border-card" } },
        [
          _c(
            "el-tab-pane",
            { attrs: { label: "基础规则" } },
            [_c("basicRulesView")],
            1
          ),
          _vm._v(" "),
          _c(
            "el-tab-pane",
            { attrs: { label: "高级规则", lazy: "" } },
            [_c("highLevelRuleView")],
            1
          ),
          _vm._v(" "),
          _c(
            "el-tab-pane",
            { attrs: { label: "其他规则", lazy: "" } },
            [_c("otherParameterFilterView")],
            1
          ),
          _vm._v(" "),
          _c(
            "el-tab-pane",
            { attrs: { label: "指标屏蔽", lazy: "" } },
            [_c("videoMetricsFilterView")],
            1
          ),
          _vm._v(" "),
          _c(
            "el-tab-pane",
            { attrs: { label: "范围屏蔽", lazy: "" } },
            [_c("timeRangeMaskingView")],
            1
          ),
          _vm._v(" "),
          _c(
            "el-tab-pane",
            { attrs: { label: "替换处理", lazy: "" } },
            [_c("replProcessingView")],
            1
          ),
          _vm._v(" "),
          _c(
            "el-tab-pane",
            { attrs: { label: "导出导入", lazy: "" } },
            [_c("ruleExportImportView")],
            1
          ),
          _vm._v(" "),
          _c(
            "el-tab-pane",
            { attrs: { label: "黑名单管理", lazy: "" } },
            [_c("blacklistManagementView")],
            1
          ),
        ],
        1
      ),
      _vm._v(" "),
      _c("viewRulesRuleDialog"),
    ],
    1
  )
};
var __vue_staticRenderFns__$5 = [];
__vue_render__$5._withStripped = true;
  const __vue_inject_styles__$5 = undefined;
  const __vue_component__$5 = normalizeComponent(
    { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
    __vue_inject_styles__$5,
    __vue_script__$5);var script$4 = {
  data() {
    return {
      excludeURLSwitchVal: isExcludeURLSwitchGm(),
      data: getExcludeURLsGm(),
      testInputRegVal: "",
      testInputVal: ""
    };
  },
  methods: {
    tableAddItemBut() {
      this.data.push({ state: false, regularURL: "", desc: "" });
    },
    tableDelItemBut(index) {
      this.data.splice(index, 1);
    },
    refreshBut() {
      this.data = getExcludeURLsGm();
      this.$message.success("刷新成功");
    },
    saveBut() {
      for (let v of this.data) {
        if (v.regularURL === "") {
          this.$message.error("正则地址不能为空");
          return;
        }
      }
      GM_setValue("exclude_urls_gm", this.data);
      this.$message.success("保存成功");
    },
    tableVerificationItemUrlBut(url) {
      if (window.location.href.search(url) !== -1) {
        this.$message.success("匹配成功！");
      } else {
        this.$message.warning("匹配失败！");
      }
    },
    testVerificationBut() {
      const inputVal = this.testInputVal;
      const inputRegVal = this.testInputRegVal;
      if (inputVal.length === 0 || inputRegVal.length === 0) {
        this.$message.warning("请正确填写内容");
        return;
      }
      if (inputVal.search(inputRegVal) !== -1) {
        this.$message.success("匹配成功！");
      } else {
        this.$message.warning("匹配失败！");
      }
    }
  },
  watch: {
    excludeURLSwitchVal(n) {
      GM_setValue("is_exclude_url_switch_gm", n);
    }
  }
};
const __vue_script__$4 = script$4;
var __vue_render__$4 = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c(
        "el-card",
        {
          attrs: { shadow: "never" },
          scopedSlots: _vm._u([
            {
              key: "header",
              fn: function () {
                return [_vm._v("说明")]
              },
              proxy: true,
            },
          ]),
        },
        [
          _vm._v(" "),
          _c(
            "el-row",
            [
              _c(
                "el-col",
                { attrs: { span: 12 } },
                [
                  _c("div", [_vm._v("1.被排除的页面大部分功能会失效")]),
                  _vm._v(" "),
                  _c("div", [_vm._v("2.修改后建议刷新页面")]),
                  _vm._v(" "),
                  _c("el-switch", {
                    attrs: { "active-text": "启用设置" },
                    model: {
                      value: _vm.excludeURLSwitchVal,
                      callback: function ($$v) {
                        _vm.excludeURLSwitchVal = $$v;
                      },
                      expression: "excludeURLSwitchVal",
                    },
                  }),
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "el-col",
                { attrs: { span: 12 } },
                [
                  _c("el-input", {
                    scopedSlots: _vm._u([
                      {
                        key: "prepend",
                        fn: function () {
                          return [_vm._v("正则地址")]
                        },
                        proxy: true,
                      },
                    ]),
                    model: {
                      value: _vm.testInputRegVal,
                      callback: function ($$v) {
                        _vm.testInputRegVal =
                          typeof $$v === "string" ? $$v.trim() : $$v;
                      },
                      expression: "testInputRegVal",
                    },
                  }),
                  _vm._v(" "),
                  _c("el-input", {
                    scopedSlots: _vm._u([
                      {
                        key: "prepend",
                        fn: function () {
                          return [_vm._v("测试地址")]
                        },
                        proxy: true,
                      },
                    ]),
                    model: {
                      value: _vm.testInputVal,
                      callback: function ($$v) {
                        _vm.testInputVal =
                          typeof $$v === "string" ? $$v.trim() : $$v;
                      },
                      expression: "testInputVal",
                    },
                  }),
                  _vm._v(" "),
                  _c(
                    "div",
                    { staticClass: "el-horizontal-right" },
                    [
                      _c(
                        "el-button",
                        { on: { click: _vm.testVerificationBut } },
                        [_vm._v("测试验证")]
                      ),
                    ],
                    1
                  ),
                ],
                1
              ),
            ],
            1
          ),
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "el-table",
        { attrs: { data: _vm.data, border: "", stripe: "" } },
        [
          _c("el-table-column", {
            attrs: { label: "启用", width: "100" },
            scopedSlots: _vm._u([
              {
                key: "default",
                fn: function (scope) {
                  return [
                    _c("el-switch", {
                      model: {
                        value: scope.row.state,
                        callback: function ($$v) {
                          _vm.$set(scope.row, "state", $$v);
                        },
                        expression: "scope.row.state",
                      },
                    }),
                  ]
                },
              },
            ]),
          }),
          _vm._v(" "),
          _c("el-table-column", {
            attrs: { label: "正则地址" },
            scopedSlots: _vm._u([
              {
                key: "default",
                fn: function (scope) {
                  return [
                    _c("el-input", {
                      model: {
                        value: scope.row.regularURL,
                        callback: function ($$v) {
                          _vm.$set(
                            scope.row,
                            "regularURL",
                            typeof $$v === "string" ? $$v.trim() : $$v
                          );
                        },
                        expression: "scope.row.regularURL",
                      },
                    }),
                  ]
                },
              },
            ]),
          }),
          _vm._v(" "),
          _c("el-table-column", {
            attrs: { label: "描述" },
            scopedSlots: _vm._u([
              {
                key: "default",
                fn: function (scope) {
                  return [
                    _c("el-input", {
                      model: {
                        value: scope.row.desc,
                        callback: function ($$v) {
                          _vm.$set(
                            scope.row,
                            "desc",
                            typeof $$v === "string" ? $$v.trim() : $$v
                          );
                        },
                        expression: "scope.row.desc",
                      },
                    }),
                  ]
                },
              },
            ]),
          }),
          _vm._v(" "),
          _c("el-table-column", {
            attrs: { align: "center", width: "300" },
            scopedSlots: _vm._u([
              {
                key: "header",
                fn: function () {
                  return [
                    _c("el-button", { on: { click: _vm.tableAddItemBut } }, [
                      _vm._v("添加"),
                    ]),
                    _vm._v(" "),
                    _c("el-button", { on: { click: _vm.refreshBut } }, [
                      _vm._v("刷新"),
                    ]),
                    _vm._v(" "),
                    _c(
                      "el-button",
                      {
                        attrs: { type: "success" },
                        on: { click: _vm.saveBut },
                      },
                      [_vm._v("保存")]
                    ),
                  ]
                },
                proxy: true,
              },
              {
                key: "default",
                fn: function (scope) {
                  return [
                    _c(
                      "el-tooltip",
                      { attrs: { content: "以当前网页url用于验证匹配结果" } },
                      [
                        _c(
                          "el-button",
                          {
                            on: {
                              click: function ($event) {
                                return _vm.tableVerificationItemUrlBut(
                                  scope.row.regularURL
                                )
                              },
                            },
                          },
                          [_vm._v("验证当前Url")]
                        ),
                      ],
                      1
                    ),
                    _vm._v(" "),
                    _c(
                      "el-button",
                      {
                        attrs: { type: "danger" },
                        on: {
                          click: function ($event) {
                            return _vm.tableDelItemBut(scope.$index, scope.row)
                          },
                        },
                      },
                      [_vm._v("删除")]
                    ),
                  ]
                },
              },
            ]),
          }),
        ],
        1
      ),
    ],
    1
  )
};
var __vue_staticRenderFns__$4 = [];
__vue_render__$4._withStripped = true;
  const __vue_inject_styles__$4 = undefined;
  const __vue_component__$4 = normalizeComponent(
    { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
    __vue_inject_styles__$4,
    __vue_script__$4);const getPlayCountAndBulletChatAndDuration = (el) => {
  const playInfo = el.querySelector(".playinfo").innerHTML.trim();
  let nPlayCount = playInfo.match(/<\/svg>(.*)<svg/s)?.[1].trim();
  nPlayCount = sFormatUtil.toPlayCountOrBulletChat(nPlayCount);
  let nBulletChat = playInfo.match(/class="dm-icon".+<\/svg>(.+)$/s)?.[1].trim();
  nBulletChat = sFormatUtil.toPlayCountOrBulletChat(nBulletChat);
  let nDuration = el.querySelector(".duration")?.textContent.trim();
  nDuration = sFormatUtil.timeStringToSeconds(nDuration);
  return {
    nPlayCount,
    nBulletChat,
    nDuration
  };
};
const getRightVideoDataList$1 = (elList) => {
  const list = [];
  for (let el of elList) {
    const title = el.querySelector(".title").textContent.trim();
    const userInfoEl = el.querySelector(".upname");
    const name = userInfoEl.querySelector(".name").textContent.trim();
    const userUrl = userInfoEl.href;
    const uid = elUtil.getUrlUID(userUrl);
    const videoUrl = el.querySelector(".info>a").href;
    const bv = elUtil.getUrlBV(videoUrl);
    list.push({
      ...getPlayCountAndBulletChatAndDuration(el),
      ...{
        title,
        name,
        userUrl,
        videoUrl,
        uid,
        bv,
        el,
        insertionPositionEl: el.querySelector(".playinfo"),
        explicitSubjectEl: el.querySelector(".info")
      }
    });
  }
  return list;
};
const getVideoTags = () => {
  const el = document.body.querySelector(".video-tag-container");
  const vueData = el["__vue__"];
  const list = [];
  for (const v of vueData["tagList"]) {
    if (v["tag_type"] === "bgm") {
      continue;
    }
    list.push(v["tag_name"]);
  }
  return list;
};
const insertTagShieldButton = async () => {
  await elUtil.findElement("#biliMainHeader #nav-searchform", { interval: 4e3 });
  const el = await elUtil.findElement(".video-tag-container");
  const butEl = document.createElement("button");
  butEl.setAttribute("gz_type", "");
  butEl.textContent = "屏蔽标签";
  butEl.style.display = "none";
  el.firstElementChild.appendChild(butEl);
  el.addEventListener("mouseout", () => butEl.style.display = "none");
  el.addEventListener("mouseover", () => butEl.style.display = "");
  butEl.addEventListener("click", () => {
    const list = [];
    for (let tag of getVideoTags()) {
      list.push({ label: tag, value: tag });
    }
    eventEmitter.send("sheet-dialog", {
      contents: ["默认精确类型，不包括bgm类型tag"],
      list,
      title: "选择标签",
      optionsClick({ value }) {
        const res = ruleUtil.addRule(value, "precise_videoTag");
        eventEmitter.send("el-notify", {
          title: "添加精确标签操作提示",
          message: res.res,
          type: res.status ? "success" : "error"
        });
        res.status && eventEmitter.send("通知屏蔽");
      }
    });
  });
};
const insertUserProfileShieldButton = async () => {
  const el = await elUtil.findElement(".usercard-wrap");
  const but = document.createElement("button");
  but.id = "video-user-panel";
  but.setAttribute("gz_type", "");
  but.textContent = "屏蔽";
  but.addEventListener("click", () => {
    const vueEl = el.querySelector(".user-card-m-exp.card-loaded");
    const { userData: { mid, name } } = vueEl["__vue__"];
    eventEmitter.invoke("el-confirm", `是要屏蔽的用户${name}-【${mid}】吗？`).then(() => {
      const uid = parseInt(mid);
      if (ruleUtil.addRulePreciseUid(uid).status) {
        eventEmitter.send("通知屏蔽");
        eventEmitter.send("event-检查评论区屏蔽");
      }
    });
  });
  const observer = new MutationObserver(() => {
    if (el.querySelector("#video-user-panel[gz_type]") !== null) return;
    const userEl = el.querySelector(".user");
    if (userEl === null) return;
    userEl.appendChild(but);
  });
  observer.observe(el, { childList: true, subtree: true });
};
var videoPlayPageCommon = { getRightVideoDataList: getRightVideoDataList$1, insertTagShieldButton, insertUserProfileShieldButton };const isVideoPlayPage = (url = window.location.href) => {
  return url.includes("www.bilibili.com/video");
};
const selectUserBlocking = async () => {
  const el = await elUtil.findElement(".up-panel-container");
  const vueData = el["__vue__"];
  const { staffInfo, upInfo } = vueData;
  if (staffInfo.length > 1) {
    const list = [];
    for (const { mid: mid2, name: name2 } of staffInfo) {
      list.push({
        label: `用户-name=${name2}-uid=${mid2}`,
        uid: mid2
      });
    }
    eventEmitter.send("sheet-dialog", {
      title: "选择要屏蔽的用户(uid精确)",
      list,
      optionsClick: (item) => {
        ruleUtil.addRulePreciseUid(item.uid).status && eventEmitter.send("通知屏蔽");
        return true;
      }
    });
    return;
  }
  const { mid, name } = upInfo;
  const uid = parseInt(mid);
  eventEmitter.invoke("el-confirm", `用户uid=${uid}-name=${name}`, "uid精确屏蔽方式").then(() => {
    if (uid === -1) {
      eventEmitter.send("el-msg", "该页面数据不存在uid字段");
      return;
    }
    ruleUtil.addRulePreciseUid(uid) && eventEmitter.send("通知屏蔽");
  });
};
const getGetTheVideoListOnTheRight$1 = async () => {
  await elUtil.findElement(".video-page-card-small .b-img img");
  delAd();
  delGameAd();
  const elList = await elUtil.findElements(".rec-list>.video-page-card-small,.video-page-operator-card-small", { interval: 1e3 });
  const nextPlayEl = document.querySelector(".next-play>.video-page-card-small");
  if (nextPlayEl) {
    elList.push(nextPlayEl);
  }
  const list = [];
  for (let el of elList) {
    try {
      const elInfo = el.querySelector(".info");
      const title = elInfo.querySelector(".title").title;
      const name = elInfo.querySelector(".upname .name").textContent.trim();
      const userUrl = elInfo.querySelector(".upname>a").href;
      const uid = elUtil.getUrlUID(userUrl);
      const playInfo = el.querySelector(".playinfo").innerHTML.trim();
      const videoUrl = el.querySelector(".info>a").href;
      const bv = elUtil.getUrlBV(videoUrl);
      let nPlayCount = playInfo.match(/<\/svg>(.*)<svg/s)?.[1].trim();
      nPlayCount = sFormatUtil.toPlayCountOrBulletChat(nPlayCount);
      let nBulletChat = playInfo.match(/class="dm".+<\/svg>(.+)$/s)?.[1].trim();
      nBulletChat = sFormatUtil.toPlayCountOrBulletChat(nBulletChat);
      let nDuration = el.querySelector(".duration")?.textContent.trim();
      nDuration = sFormatUtil.timeStringToSeconds(nDuration);
      list.push({
        title,
        userUrl,
        name,
        uid,
        bv,
        nPlayCount,
        nBulletChat,
        nDuration,
        el,
        videoUrl,
        insertionPositionEl: el.querySelector(".playinfo"),
        explicitSubjectEl: elInfo
      });
    } catch (e) {
      console.error("获取右侧视频列表失败:", e);
    }
  }
  return list;
};
const startShieldingVideoList$6 = () => {
  if (localMKData.isDelPlayerPageRightVideoList()) {
    return;
  }
  getGetTheVideoListOnTheRight$1().then((videoList) => {
    for (let videoData of videoList) {
      video_shielding.shieldingVideoDecorated(videoData).catch(() => {
        eventEmitter.send("视频添加屏蔽按钮", { data: videoData, maskingFunc: startShieldingVideoList$6 });
      });
    }
  });
};
const findTheExpandButtonForTheListOnTheRightAndBindTheEvent$2 = () => {
  setTimeout(() => {
    elUtil.findElement(".rec-footer", { interval: 2e3 }).then((el) => {
      console.log("找到右侧视频列表的展开按钮", el);
      el.addEventListener("click", () => {
        startShieldingVideoList$6();
      });
    });
  }, 3e3);
};
const getPlayerVideoList = async () => {
  const elList = await elUtil.findElements(".bpx-player-ending-related>.bpx-player-ending-related-item");
  const data = { list: [], cancelEl: null };
  for (const el of elList) {
    const title = el.querySelector(".bpx-player-ending-related-item-title")?.textContent.trim();
    const cancelEl = el.querySelector(".bpx-player-ending-related-item-cancel");
    if (cancelEl) {
      data.cancelEl = cancelEl;
    }
    data.list.push({
      title,
      el
    });
  }
  return data;
};
const getVideoPlayerEndingPanelEl = async () => {
  return await elUtil.findElement(
    "#bilibili-player .bpx-player-ending-wrap>.bpx-player-ending-panel",
    { interval: 50 }
  );
};
const setVideoPlayerEnded = async () => {
  const videoEl = await elUtil.findElement("#bilibili-player video");
  const funcStart = async () => {
    const res = await getPlayerVideoList();
    for (let { el, title } of res.list) {
      let matching = ruleMatchingUtil.fuzzyMatch(ruleKeyListData.getTitleArr(), title);
      if (matching !== null) {
        eventEmitter.send("打印信息", `根据-模糊标题-【${matching}】-屏蔽视频:${title}`);
        el.remove();
        continue;
      }
      matching = ruleMatchingUtil.regexMatch(ruleKeyListData.getTitleCanonicalArr(), title);
      if (matching !== null) {
        eventEmitter.send("打印信息", `根据-正则标题-【${matching}】-屏蔽视频:${title}`);
        el.remove();
      }
    }
  };
  videoEl.addEventListener("ended", () => {
    console.log("视频播放结束");
    funcStart();
    if (localMKData.isDelPlayerEndingPanel()) {
      getVideoPlayerEndingPanelEl().then((el) => {
        el.remove();
        eventEmitter.send("打印信息", "已删除播放页播放器中推荐层");
      });
    }
  });
};
const delAd = () => {
  if (!GM_getValue("isDelPlayerPageAd", false)) {
    return;
  }
  elUtil.findElements("[class|=ad],#slide_ad,.activity-m-v1").then((elList) => {
    for (const el of elList) {
      el.style.display = "none";
    }
    eventEmitter.send("打印信息", "隐藏了播放页的页面广告");
  });
};
const delRightVideoList = () => {
  if (!localMKData.isDelPlayerPageRightVideoList()) {
    return;
  }
  elUtil.findElement(".recommend-list-v1").then((el) => {
    el.style.visibility = "hidden";
    eventEmitter.send("打印信息", "屏蔽了播放页的右侧推荐列表");
  });
};
const delGameAd = () => {
  if (!GM_getValue("isDelPlayerPageRightGameAd", false)) {
    return;
  }
  elUtil.findElement(".video-page-game-card-small", { timeout: 1e4 }).then((el) => {
    if (el === null) {
      eventEmitter.send("打印信息", "没有找到播放页的右侧游戏推荐");
      return;
    }
    el.remove();
    eventEmitter.send("打印信息", "屏蔽了游戏推荐");
  });
};
const delBottomCommentApp = () => {
  if (!localMKData.isDelBottomComment()) {
    return;
  }
  elUtil.findElement("#commentapp").then((el) => {
    el?.remove();
    eventEmitter.send("打印信息", "移除了页面底部的评论区");
  });
};
const delElManagement = () => {
  if (localMKData.isDelPlayerPageRightVideoList()) {
    delAd();
  }
  delRightVideoList();
  delBottomCommentApp();
};
const run$3 = () => {
  delElManagement();
  setVideoPlayerEnded();
  videoPlayPageCommon.insertTagShieldButton();
};
var videoPlayModel = {
  isVideoPlayPage,
  startShieldingVideoList: startShieldingVideoList$6,
  findTheExpandButtonForTheListOnTheRightAndBindTheEvent: findTheExpandButtonForTheListOnTheRightAndBindTheEvent$2,
  selectUserBlocking,
  run: run$3
};const iscCollectionVideoPlayPage = (url = window.location.href) => {
  return url.includes("www.bilibili.com/list/ml");
};
const getGetTheVideoListOnTheRight = async () => {
  const elList = await elUtil.findElements(".recommend-list-container>.video-card");
  return videoPlayPageCommon.getRightVideoDataList(elList);
};
const startShieldingVideoList$5 = () => {
  getGetTheVideoListOnTheRight().then((videoList) => {
    const css = { right: "123px" };
    for (let videoData of videoList) {
      video_shielding.shieldingVideoDecorated(videoData).catch(() => {
        videoData.cssMap = css;
        eventEmitter.send("视频添加屏蔽按钮", { data: videoData, maskingFunc: startShieldingVideoList$5 });
      });
    }
  });
};
const findTheExpandButtonForTheListOnTheRightAndBindTheEvent$1 = () => {
  setTimeout(() => {
    elUtil.findElement(".rec-footer", { interval: 2e3 }).then((el) => {
      el.addEventListener("click", () => {
        startShieldingVideoList$5();
      });
    });
  }, 3e3);
};
var collectionVideoPlayPageModel = {
  iscCollectionVideoPlayPage,
  startShieldingVideoList: startShieldingVideoList$5,
  findTheExpandButtonForTheListOnTheRightAndBindTheEvent: findTheExpandButtonForTheListOnTheRightAndBindTheEvent$1
};const isSpacePage = (url = window.location.href) => {
  return url.startsWith("https://space.bilibili.com/");
};
const isUserSpaceDynamicPage = (url) => {
  return url.search("space.bilibili.com/\\d+/dynamic") !== -1;
};
const isPersonalHomepage = async () => {
  const keyStr = "isPersonalHomepage";
  const cache = valueCache.get(keyStr);
  if (cache) {
    return cache;
  }
  const elList = await elUtil.findElements(".nav-tab__item .nav-tab__item-text", { timeout: 2500 });
  if (elList.length > 0) {
    const bool = elList.some((el2) => el2.textContent.trim() === "设置");
    valueCache.set("space_version", "new");
    return valueCache.set(keyStr, bool);
  }
  const el = await elUtil.findElement(".n-tab-links>.n-btn.n-setting>.n-text", { timeout: 1500 });
  valueCache.set("space_version", "old");
  return valueCache.set(keyStr, el);
};
const getUserInfo = async () => {
  const spaceUserInfo = valueCache.get("space_userInfo");
  if (spaceUserInfo) {
    return spaceUserInfo;
  }
  await isPersonalHomepage();
  const nameData = {};
  nameData.uid = elUtil.getUrlUID(window.location.href);
  if (valueCache.get("space_version", "new") === "new") {
    nameData.name = await elUtil.findElement(".nickname").then((el) => el.textContent.trim());
  } else {
    nameData.name = await elUtil.findElement("#h-name").then((el) => el.textContent.trim());
  }
  if (!nameData.name) {
    const title = document.title;
    nameData.name = title.match(/(.+)的个人空间/)[1];
  }
  valueCache.set("space_userInfo", nameData);
  return nameData;
};
const checkUserSpaceShieldingDynamicContentThrottle = defUtil$1.throttle(async () => {
  const personalHomepage = await isPersonalHomepage();
  if (personalHomepage) return;
  dynamicCommon.commonCheckDynamicList();
}, 2e3);
var space = {
  isPersonalHomepage,
  isSpacePage,
  getUserInfo,
  isUserSpaceDynamicPage,
  checkUserSpaceShieldingDynamicContentThrottle
};const isVideoPlayWatchLaterPage = (url = location.href) => {
  return url.startsWith("https://www.bilibili.com/list/watchlater");
};
const getRightVideoDataList = async () => {
  const elList = await elUtil.findElements(".recommend-video-card.video-card");
  return videoPlayPageCommon.getRightVideoDataList(elList);
};
const startShieldingVideoList$4 = async () => {
  const videoList = await getRightVideoDataList();
  const css = { right: "123px" };
  for (let videoData of videoList) {
    video_shielding.shieldingVideoDecorated(videoData).catch(() => {
      videoData.cssMap = css;
      eventEmitter.send("视频添加屏蔽按钮", { data: videoData, maskingFunc: startShieldingVideoList$4 });
    });
  }
};
const startDebounceShieldingVideoList = defUtil$1.debounce(startShieldingVideoList$4, 1e3);
const findTheExpandButtonForTheListOnTheRightAndBindTheEvent = () => {
  elUtil.findElementsAndBindEvents(".rec-footer", startDebounceShieldingVideoList);
};
var videoPlayWatchLater = {
  isVideoPlayWatchLaterPage,
  startDebounceShieldingVideoList,
  findTheExpandButtonForTheListOnTheRightAndBindTheEvent
};var script$3 = {
  data() {
    return {
      shieldingModelShow: true,
      shieldingUseUIDrButShow: false,
      removedShieldingUIDrButShow: false,
      selectUserBlockingButShow: false,
      uid: -1
    };
  },
  methods: {
    async dropdownEvent(item) {
      if (item === "移除屏蔽uid") {
        const { uid } = await space.getUserInfo();
        ruleUtil.delRUlePreciseUid(uid);
        return;
      }
      switch (item) {
        case "屏蔽uid":
          const { name, uid } = await space.getUserInfo();
          this.$confirm(`是否屏蔽当前用户【${name}】uid=【${uid}】`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            const { status, res } = ruleUtil.addRulePreciseUid(uid);
            this.$alert(res);
            if (status) {
              eventEmitter.send("通知屏蔽");
              this.shieldingUseUIDrButShow = false;
              this.removedShieldingUIDrButShow = true;
            }
          });
          break;
        case "选择用户屏蔽":
          await videoPlayModel.selectUserBlocking();
          break;
        case "添加bv号屏蔽":
          const urlBvId = elUtil.getUrlBV(window.location.href);
          this.$prompt(`确认添加该bv号【${urlBvId}】屏蔽吗？`, "提示", {
            inputValue: urlBvId,
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            inputValidator: (value) => {
              if (value.length >= 20) {
                return "bv号格式不正确";
              }
              return value.startsWith("BV");
            }
          }).then(async ({ value }) => {
            ruleUtil.addRulePreciseBv(value);
          });
          break;
        default:
          this.$message("未知选项");
      }
    }
  },
  async created() {
    if (videoPlayModel.isVideoPlayPage() || collectionVideoPlayPageModel.iscCollectionVideoPlayPage() || videoPlayWatchLater.isVideoPlayWatchLaterPage()) {
      this.selectUserBlockingButShow = true;
    }
    if (space.isSpacePage()) {
      this.urlUID = elUtil.getUrlUID(window.location.href);
      if (ruleKeyListData.getPreciseUidArr().includes(this.urlUID)) {
        this.shieldingModelShow = true;
        this.removedShieldingUIDrButShow = true;
        await this.$alert("当前用户为已标记uid黑名单", "提示");
        return;
      }
      if (await space.isPersonalHomepage()) {
        this.shieldingModelShow = false;
        return;
      }
      this.shieldingModelShow = true;
      this.shieldingUseUIDrButShow = true;
    }
  }
};
const __vue_script__$3 = script$3;
var __vue_render__$3 = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _vm.shieldingModelShow
        ? _c(
            "el-dropdown",
            { on: { command: _vm.dropdownEvent } },
            [
              _c("el-button", { attrs: { round: "" } }, [
                _vm._v("\n      屏蔽操作"),
                _c("i", { staticClass: "el-icon-arrow-down el-icon--right" }),
              ]),
              _vm._v(" "),
              _c("el-dropdown-menu", {
                scopedSlots: _vm._u(
                  [
                    {
                      key: "default",
                      fn: function (dropdown) {
                        return [
                          _vm.shieldingUseUIDrButShow
                            ? _c(
                                "el-dropdown-item",
                                { attrs: { command: "屏蔽uid" } },
                                [_vm._v("屏蔽(uid)\n      ")]
                              )
                            : _vm._e(),
                          _vm._v(" "),
                          _vm.removedShieldingUIDrButShow
                            ? _c(
                                "el-dropdown-item",
                                { attrs: { command: "移除屏蔽uid" } },
                                [_vm._v("移除屏蔽(uid)\n      ")]
                              )
                            : _vm._e(),
                          _vm._v(" "),
                          _vm.selectUserBlockingButShow
                            ? _c(
                                "el-dropdown-item",
                                { attrs: { command: "选择用户屏蔽" } },
                                [_vm._v("选择用户屏蔽")]
                              )
                            : _vm._e(),
                          _vm._v(" "),
                          _vm.selectUserBlockingButShow
                            ? _c(
                                "el-dropdown-item",
                                { attrs: { command: "添加bv号屏蔽" } },
                                [_vm._v("添加bv号屏蔽")]
                              )
                            : _vm._e(),
                        ]
                      },
                    },
                  ],
                  null,
                  false,
                  4029631328
                ),
              }),
            ],
            1
          )
        : _vm._e(),
    ],
    1
  )
};
var __vue_staticRenderFns__$3 = [];
__vue_render__$3._withStripped = true;
  const __vue_inject_styles__$3 = undefined;
  const __vue_component__$3 = normalizeComponent(
    { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
    __vue_inject_styles__$3,
    __vue_script__$3);var script$2 = {
  components: {
    shieldingUserView: __vue_component__$3
  },
  data() {
    return {
      panelShow: localMKData.isShowRightTopMainButSwitch()
    };
  },
  methods: {
    showBut() {
      eventEmitter.send("主面板开关");
    },
    handleMouseEnter() {
      this.$refs.divRef.style.transform = "translateX(0)";
    },
    handleMouseLeave() {
      this.$refs.divRef.style.transform = "translateX(80%)";
    }
  },
  created() {
    eventEmitter.on("显隐主面板开关", (bool) => {
      this.panelShow = bool;
    });
  },
  mounted() {
    const divStyle = this.$refs.divRef.style;
    if (!localMKData.isFirstFullDisplay()) {
      divStyle.transform = "translateX(80%)";
    } else {
      if (localMKData.isHalfHiddenIntervalAfterInitialDisplay()) {
        setTimeout(() => {
          divStyle.transform = "translateX(80%)";
          eventEmitter.send("el-notify", {
            message: "自动隐藏外部主面板显隐按钮",
            position: "button-right"
          });
        }, 8e3);
      }
    }
  }
};
const __vue_script__$2 = script$2;
var __vue_render__$2 = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    {
      directives: [
        {
          name: "show",
          rawName: "v-show",
          value: _vm.panelShow,
          expression: "panelShow",
        },
      ],
      ref: "divRef",
      staticStyle: {
        position: "fixed",
        "z-index": "9000",
        right: "0",
        top: "13%",
        transition: "transform 0.5s",
      },
      on: {
        mouseenter: _vm.handleMouseEnter,
        mouseleave: _vm.handleMouseLeave,
      },
    },
    [
      _c(
        "div",
        [
          _c(
            "el-button",
            { attrs: { round: "" }, on: { click: _vm.showBut } },
            [_vm._v("主面板")]
          ),
        ],
        1
      ),
      _vm._v(" "),
      _c("shieldingUserView"),
    ],
    1
  )
};
var __vue_staticRenderFns__$2 = [];
__vue_render__$2._withStripped = true;
  const __vue_inject_styles__$2 = undefined;
  const __vue_component__$2 = normalizeComponent(
    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
    __vue_inject_styles__$2,
    __vue_script__$2);var script$1 = {
  data() {
    return {
      requestFrequencyVal: getRequestFrequencyVal(),
      bOnlyTheHomepageIsBlocked: globalValue.bOnlyTheHomepageIsBlocked,
      isEffectiveUIDShieldingOnlyVideoVal: isEffectiveUIDShieldingOnlyVideo(),
      bFuzzyAndRegularMatchingWordsToLowercase: localMKData.bFuzzyAndRegularMatchingWordsToLowercase(),
      isDisableNetRequestsBvVideoInfo: localMKData.isDisableNetRequestsBvVideoInfo(),
      hideBlockButtonVal: hideBlockButtonGm(),
      isCheckNestedDynamicContentVal: isCheckNestedDynamicContentGm()
    };
  },
  methods: {},
  watch: {
    bOnlyTheHomepageIsBlocked(newVal) {
      GM_setValue("bOnlyTheHomepageIsBlocked", newVal === true);
    },
    bFuzzyAndRegularMatchingWordsToLowercase(newVal) {
      GM_setValue("bFuzzyAndRegularMatchingWordsToLowercase", newVal === true);
    },
    isDisableNetRequestsBvVideoInfo(b) {
      GM_setValue("isDisableNetRequestsBvVideoInfo", b);
    },
    isEffectiveUIDShieldingOnlyVideoVal(b) {
      GM_setValue("is_effective_uid_shielding_only_video", b);
    },
    requestFrequencyVal(n) {
      GM_setValue("requestFrequencyVal", n > 0 && n <= 5 ? n : 0.2);
      bvRequestQueue.setAllRequestInterval(n * 1e3);
    },
    hideBlockButtonVal(n) {
      GM_setValue("hide_block_button_gm", n);
      if (n) {
        document.body.querySelectorAll(".gz_shielding_button").forEach((el) => el.remove());
      }
    },
    isCheckNestedDynamicContentVal(n) {
      GM_setValue("is_check_nested_dynamic_content_gm", n);
    }
  },
  created() {
    eventEmitter.on("更新根据bv号网络请求获取视频信息状态", (b) => {
      this.isDisableNetRequestsBvVideoInfo = b;
    });
  }
};
const __vue_script__$1 = script$1;
var __vue_render__$1 = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c(
        "el-card",
        {
          attrs: { shadow: "never" },
          scopedSlots: _vm._u([
            {
              key: "header",
              fn: function () {
                return [_vm._v("常规")]
              },
              proxy: true,
            },
          ]),
        },
        [
          _vm._v(" "),
          _c("el-switch", {
            attrs: { "active-text": "仅首页屏蔽生效屏蔽" },
            model: {
              value: _vm.bOnlyTheHomepageIsBlocked,
              callback: function ($$v) {
                _vm.bOnlyTheHomepageIsBlocked = $$v;
              },
              expression: "bOnlyTheHomepageIsBlocked",
            },
          }),
          _vm._v(" "),
          _c(
            "el-tooltip",
            {
              attrs: {
                content:
                  "模糊和正则匹配时，将匹配词转小写与规则值匹配。修改后刷新页面生效",
              },
            },
            [
              _c("el-switch", {
                attrs: { "active-text": "模糊和正则匹配词转小写" },
                model: {
                  value: _vm.bFuzzyAndRegularMatchingWordsToLowercase,
                  callback: function ($$v) {
                    _vm.bFuzzyAndRegularMatchingWordsToLowercase = $$v;
                  },
                  expression: "bFuzzyAndRegularMatchingWordsToLowercase",
                },
              }),
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "el-tooltip",
            { attrs: { content: "改动实时生效" } },
            [
              _c("el-switch", {
                attrs: { "active-text": "仅生效UID屏蔽(限视频)" },
                model: {
                  value: _vm.isEffectiveUIDShieldingOnlyVideoVal,
                  callback: function ($$v) {
                    _vm.isEffectiveUIDShieldingOnlyVideoVal = $$v;
                  },
                  expression: "isEffectiveUIDShieldingOnlyVideoVal",
                },
              }),
            ],
            1
          ),
          _vm._v(" "),
          _c("el-switch", {
            attrs: { "active-text": "不显示屏蔽按钮" },
            model: {
              value: _vm.hideBlockButtonVal,
              callback: function ($$v) {
                _vm.hideBlockButtonVal = $$v;
              },
              expression: "hideBlockButtonVal",
            },
          }),
          _vm._v(" "),
          _c("el-switch", {
            attrs: { "active-text": "动态项屏蔽检查嵌套动态" },
            model: {
              value: _vm.isCheckNestedDynamicContentVal,
              callback: function ($$v) {
                _vm.isCheckNestedDynamicContentVal = $$v;
              },
              expression: "isCheckNestedDynamicContentVal",
            },
          }),
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "el-card",
        {
          attrs: { shadow: "never" },
          scopedSlots: _vm._u([
            {
              key: "header",
              fn: function () {
                return [
                  _c("span", [_vm._v("网络请求频率(单位秒)")]),
                  _vm._v(" "),
                  _c("div", [
                    _vm._v(
                      "如设置0，则为不限制，比如设置2，则为每个请求之间隔2秒，可有效降低对B站api接口的压力，降低风控"
                    ),
                  ]),
                  _vm._v(" "),
                  _c("div", [_vm._v("注意：设置过低可能会导致部分接口风控")]),
                  _vm._v(" "),
                  _c("div", [
                    _vm._v(
                      "如接口风控了请先勾选下面的【禁用根据bv号网络请求获取视频信息】"
                    ),
                  ]),
                  _vm._v(" "),
                  _c("div", [_vm._v("修改下一轮请求结束后生效")]),
                ]
              },
              proxy: true,
            },
          ]),
        },
        [
          _vm._v(" "),
          _c("el-switch", {
            attrs: { "active-text": "禁用根据bv号网络请求获取视频信息" },
            model: {
              value: _vm.isDisableNetRequestsBvVideoInfo,
              callback: function ($$v) {
                _vm.isDisableNetRequestsBvVideoInfo = $$v;
              },
              expression: "isDisableNetRequestsBvVideoInfo",
            },
          }),
          _vm._v(" "),
          _c("el-slider", {
            attrs: {
              disabled: _vm.isDisableNetRequestsBvVideoInfo,
              max: 5,
              step: 0.1,
              "show-input": "",
              "show-stops": "",
            },
            model: {
              value: _vm.requestFrequencyVal,
              callback: function ($$v) {
                _vm.requestFrequencyVal = $$v;
              },
              expression: "requestFrequencyVal",
            },
          }),
        ],
        1
      ),
    ],
    1
  )
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;
  const __vue_inject_styles__$1 = undefined;
  const __vue_component__$1 = normalizeComponent(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1);var script = {
  components: {
    RightFloatingLayoutView: __vue_component__$2,
    outputInformationView: __vue_component__$r,
    donateLayoutView: __vue_component__$q,
    ruleManagementView: __vue_component__$5,
    cacheManagementView: __vue_component__$C,
    panelSettingsView: __vue_component__$B,
    compatibleSettingView: __vue_component__$A,
    lookContentDialog: __vue_component__$z,
    debuggerManagementView: __vue_component__$y,
    pageProcessingView: __vue_component__$w,
    aboutAndFeedbackView: __vue_component__$v,
    showImgDialog: __vue_component__$u,
    sheetDialog: __vue_component__$t,
    bulletWordManagementView: __vue_component__$s,
    excludeURLsView: __vue_component__$4,
    conditionalityView: __vue_component__$1
  },
  data() {
    return {
      drawer: false,
      tabsActiveName: GM_getValue("mainTabsActiveName", "规则管理"),
      debug_panel_show: false
    };
  },
  methods: {
    tabClick(tab) {
      GM_setValue("mainTabsActiveName", tab.name);
    }
  },
  created() {
    eventEmitter.on("主面板开关", () => {
      this.drawer = !this.drawer;
    });
    document.addEventListener("keydown", (event) => {
      eventEmitter.emit("event-keydownEvent", event);
      if (event.key === getDrawerShortcutKeyGm()) {
        this.drawer = !this.drawer;
      }
    });
    eventEmitter.on("el-notify", (options) => {
      if (!options["position"]) {
        options.position = "bottom-right";
      }
      this.$notify(options);
    });
    eventEmitter.on("el-msg", (...options) => {
      this.$message(...options);
    });
    eventEmitter.on("el-alert", (...options) => {
      this.$alert(...options);
    });
    eventEmitter.handler("el-confirm", (...options) => {
      return this.$confirm(...options);
    });
    eventEmitter.handler("el-prompt", (...options) => {
      return this.$prompt(...options);
    });
    eventEmitter.on("请求获取视频信息失败", (response, bvId) => {
      eventEmitter.send("更新根据bv号网络请求获取视频信息状态", true);
      this.$alert(`请求获取视频信息失败，状态码：${response.status}，bv号：${bvId}
。已自动禁用根据bv号网络请求获取视频信息状态
如需关闭，请在面板条件限制里手动关闭。`, "错误", {
        confirmButtonText: "确定",
        type: "error"
      });
    });
  }
};
const __vue_script__ = script;
var __vue_render__ = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c(
        "el-drawer",
        {
          staticStyle: { position: "fixed" },
          attrs: {
            modal: false,
            visible: _vm.drawer,
            "with-header": false,
            direction: "ltr",
            size: "100%",
          },
          on: {
            "update:visible": function ($event) {
              _vm.drawer = $event;
            },
          },
        },
        [
          _c(
            "el-tabs",
            {
              attrs: { type: "border-card" },
              on: { "tab-click": _vm.tabClick },
              model: {
                value: _vm.tabsActiveName,
                callback: function ($$v) {
                  _vm.tabsActiveName = $$v;
                },
                expression: "tabsActiveName",
              },
            },
            [
              _c(
                "el-tab-pane",
                { attrs: { label: "面板设置", lazy: "", name: "面板设置" } },
                [_c("panelSettingsView")],
                1
              ),
              _vm._v(" "),
              _c(
                "el-tab-pane",
                { attrs: { label: "规则管理", lazy: "", name: "规则管理" } },
                [_c("ruleManagementView")],
                1
              ),
              _vm._v(" "),
              _c(
                "el-tab-pane",
                { attrs: { label: "排除页面", lazy: "", name: "排除页面" } },
                [_c("excludeURLsView")],
                1
              ),
              _vm._v(" "),
              _c(
                "el-tab-pane",
                { attrs: { label: "兼容设置", lazy: "", name: "兼容设置" } },
                [_c("compatibleSettingView")],
                1
              ),
              _vm._v(" "),
              _c(
                "el-tab-pane",
                { attrs: { label: "缓存管理", lazy: "", name: "缓存管理" } },
                [_c("cacheManagementView")],
                1
              ),
              _vm._v(" "),
              _c(
                "el-tab-pane",
                { attrs: { label: "页面处理", lazy: "", name: "页面处理" } },
                [_c("pageProcessingView")],
                1
              ),
              _vm._v(" "),
              _c(
                "el-tab-pane",
                { attrs: { label: "条件限制", lazy: "", name: "条件限制" } },
                [_c("conditionalityView")],
                1
              ),
              _vm._v(" "),
              _vm.debug_panel_show
                ? _c(
                    "el-tab-pane",
                    {
                      attrs: {
                        label: "弹幕词管理",
                        lazy: "",
                        name: "弹幕词管理",
                      },
                    },
                    [_c("bulletWordManagementView")],
                    1
                  )
                : _vm._e(),
              _vm._v(" "),
              _c(
                "el-tab-pane",
                { attrs: { label: "输出信息", name: "输出信息" } },
                [_c("outputInformationView")],
                1
              ),
              _vm._v(" "),
              _c(
                "el-tab-pane",
                { attrs: { label: "支持打赏", lazy: "", name: "支持打赏" } },
                [_c("donateLayoutView")],
                1
              ),
              _vm._v(" "),
              _c(
                "el-tab-pane",
                {
                  attrs: {
                    label: "关于和问题反馈",
                    lazy: "",
                    name: "关于和问题反馈",
                  },
                },
                [_c("aboutAndFeedbackView")],
                1
              ),
              _vm._v(" "),
              _vm.debug_panel_show
                ? _c(
                    "el-tab-pane",
                    {
                      attrs: { label: "调试测试", lazy: "", name: "调试测试" },
                    },
                    [_c("debuggerManagementView")],
                    1
                  )
                : _vm._e(),
            ],
            1
          ),
        ],
        1
      ),
      _vm._v(" "),
      _c("lookContentDialog"),
      _vm._v(" "),
      _c("showImgDialog"),
      _vm._v(" "),
      _c("sheetDialog"),
      _vm._v(" "),
      _c("RightFloatingLayoutView"),
    ],
    1
  )
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;
  const __vue_inject_styles__ = undefined;
  const __vue_component__ = normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__);window.addEventListener("DOMContentLoaded", () => {
  if (document.head.querySelector("#element-ui-css") === null) {
    const linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.href = "https://unpkg.com/element-ui@2.15.14/lib/theme-chalk/index.css";
    linkElement.id = "element-ui-css";
    document.head.appendChild(linkElement);
    linkElement.addEventListener("load", () => {
      console.log("element-ui样式加载完成");
    });
  }
  const { vueDiv } = elUtil.createVueDiv(document.body);
  window.mk_vue_app = initVueApp(vueDiv, __vue_component__);
  addGzStyle(document);
  elUtil.updateCssVModal();
});
GM_addStyle(`
[gz_bezel]{
border:1px solid ${localMKData.getBorderColor()}
}
`);
GM_addStyle(defCss);const isSearch = (url) => {
  return url.includes("search.bilibili.com");
};
const isSearchVideoNetWorkUrl = (netUrl) => {
  if (netUrl.includes("api.bilibili.com/x/web-interface/wbi/search/all/v2")) return true;
  if (!netUrl.includes("api.bilibili.com/x/web-interface/wbi/search/type")) return false;
  const parseUrl = defUtil$1.parseUrl(netUrl);
  const search_type = parseUrl.queryParams["search_type"] || null;
  return search_type === "video";
};
const isSearchLiveRoomNetWorkUrl = (netUrl) => {
  if (!netUrl.includes("api.bilibili.com/x/web-interface/wbi/search/type")) return false;
  const parseUrl = defUtil$1.parseUrl(netUrl);
  const search_type = parseUrl.queryParams["search_type"] || null;
  return search_type === "live";
};
const getVideoList$1 = async (css) => {
  const elList = await elUtil.findElements(css, { interval: 200 });
  const list = [];
  const isClearLiveCard = isClearLiveCardGm();
  for (let el of elList) {
    const title = el.querySelector(".bili-video-card__info--tit").title;
    const userEl = el.querySelector(".bili-video-card__info--owner");
    if (userEl === null) {
      console.log("获取不到该视频卡片的用户地址，", el);
      el?.remove();
      continue;
    }
    const userUrl = userEl.getAttribute("href");
    if (!userUrl.includes("//space.bilibili.com/")) {
      el?.remove();
      console.log("移除了非视频内容", userUrl, el);
      continue;
    }
    const videoUrl = el.querySelector(".bili-video-card__info--right>a")?.href;
    if (videoUrl?.includes("live.bilibili.com/")) {
      if (isClearLiveCard) {
        console.log("移除了综合选项卡视频列表中的直播内容", title, videoUrl, el);
        el?.remove();
      }
      continue;
    }
    const bv = elUtil.getUrlBV(videoUrl);
    const uid = elUtil.getUrlUID(userUrl);
    const name = userEl.querySelector(".bili-video-card__info--author").textContent.trim();
    const bili_video_card__stats_item = el.querySelectorAll(".bili-video-card__stats--item");
    let nPlayCount = bili_video_card__stats_item[0]?.textContent.trim();
    nPlayCount = sFormatUtil.toPlayCountOrBulletChat(nPlayCount);
    let nBulletChat = bili_video_card__stats_item[1]?.textContent.trim();
    nBulletChat = sFormatUtil.toPlayCountOrBulletChat(nBulletChat);
    let nDuration = el.querySelector(".bili-video-card__stats__duration")?.textContent.trim();
    nDuration = sFormatUtil.timeStringToSeconds(nDuration);
    list.push({
      title,
      userUrl,
      name,
      uid,
      bv,
      nPlayCount,
      nBulletChat,
      nDuration,
      el,
      videoUrl,
      insertionPositionEl: el.querySelector(".bili-video-card__info--bottom"),
      explicitSubjectEl: el.querySelector(".bili-video-card__info")
    });
  }
  return list;
};
const getTabComprehensiveSortedVideoList = () => {
  return getVideoList$1(".video.i_wrapper.search-all-list>.video-list>div");
};
const getOtherVideoList = () => {
  return getVideoList$1(".search-page.search-page-video>.video-list.row>div:not(:empty)");
};
const startShieldingCSVideoList = async () => {
  const list = await getTabComprehensiveSortedVideoList();
  for (let videoData of list) {
    video_shielding.shieldingVideoDecorated(videoData).catch(() => {
      eventEmitter.send("视频添加屏蔽按钮", { data: videoData, maskingFunc: startShieldingCSVideoList });
    });
  }
};
const startShieldingOtherVideoList = async () => {
  const list = await getOtherVideoList();
  for (let videoData of list) {
    video_shielding.shieldingVideoDecorated(videoData).catch(() => {
      eventEmitter.send("视频添加屏蔽按钮", { data: videoData, maskingFunc: startShieldingOtherVideoList });
    });
  }
};
const getTwTabActiveItem = async () => {
  const twoTabActiveItem = await elUtil.findElement(".vui_button.vui_button--tab.vui_button--active.mr_sm", { interval: 200 });
  const twoTabActiveItemLabel = twoTabActiveItem.textContent.trim();
  return { el: twoTabActiveItemLabel, label: twoTabActiveItemLabel };
};
const startShieldingVideoList$3 = async () => {
  const topTabActiveItem = await elUtil.findElement(".vui_tabs--nav-item.vui_tabs--nav-item-active", { interval: 200 });
  const topTabActiveItemLabel = topTabActiveItem.textContent.trim();
  console.log(topTabActiveItemLabel);
  if (topTabActiveItemLabel !== "综合") {
    await startShieldingOtherVideoList();
    return;
  }
  const { label } = await getTwTabActiveItem();
  if (label !== "综合排序") {
    await startShieldingOtherVideoList();
    return;
  }
  const parseUrl = defUtil$1.parseUrl(window.location.href);
  if (parseUrl.queryParams["page"] || parseUrl.queryParams["pubtime_begin_s"]) {
    await startShieldingOtherVideoList();
  } else {
    await startShieldingCSVideoList();
    await processingExactSearchVideoCardContent();
  }
};
const processingExactSearchVideoCardContent = async () => {
  let el = await elUtil.findElement(".user-list.search-all-list", { interval: 50, timeout: 4e3 });
  if (el === null) return;
  const infoCardEl = el.querySelector(".info-card");
  const userNameEl = infoCardEl.querySelector(".user-name");
  const name = userNameEl.textContent.trim();
  const userUrl = userNameEl.href;
  const uid = elUtil.getUrlUID(userUrl);
  if (ruleMatchingUtil.exactMatch(ruleKeyListData.getPreciseUidArr(), uid)) {
    el.remove();
    eventEmitter.send("打印信息", `根据精确uid匹配到用户${name}-【${uid}】`);
    return;
  }
  let fuzzyMatch = ruleMatchingUtil.fuzzyMatch(ruleKeyListData.getNameArr(), name);
  if (fuzzyMatch) {
    el.remove();
    eventEmitter.send("打印信息", `根据模糊用户名【${fuzzyMatch}】匹配到用户${name}-【${uid}】`);
    return;
  }
  fuzzyMatch = ruleMatchingUtil.regexMatch(ruleKeyListData.getNameCanonical(), name);
  if (fuzzyMatch) {
    el.remove();
    eventEmitter.send("打印信息", `根据正则用户名【${fuzzyMatch}】匹配到用户${name}-【${uid}】`);
    return;
  }
  const insertionPositionEl = el.querySelector(".info-card.flex_start");
  shielding.addBlockButton({
    data: {
      name,
      uid,
      insertionPositionEl
    }
  });
  const videoElList = el.querySelectorAll(".video-list>.video-list-item");
  const list = [];
  for (let videoEl of videoElList) {
    const titleEl = videoEl.querySelector(".bili-video-card__info--right>a");
    const videoUrl = titleEl.href;
    const bv = elUtil.getUrlBV(videoUrl);
    const title = titleEl.textContent.trim();
    let nDuration = videoEl.querySelector(".bili-video-card__stats__duration")?.textContent.trim();
    nDuration = sFormatUtil.timeStringToSeconds(nDuration);
    let nPlayCount = videoEl.querySelector(".bili-video-card__stats--item>span")?.textContent.trim();
    nPlayCount = sFormatUtil.toPlayCountOrBulletChat(nPlayCount);
    list.push({
      title,
      userUrl,
      name,
      uid,
      bv,
      nPlayCount,
      nDuration,
      el: videoEl,
      videoUrl
    });
  }
  for (let videoData of list) {
    video_shielding.shieldingVideoDecorated(videoData);
  }
};
const delFooterContent = () => {
  if (!GM_getValue("isRemoveSearchBottomContent", false)) {
    return;
  }
  elUtil.findElement("#biliMainFooter").then((el) => {
    el.remove();
    eventEmitter.send("打印信息", "已删除底部内容");
  });
};
var searchModel = {
  isSearch,
  startShieldingVideoList: startShieldingVideoList$3,
  delFooterContent,
  isSearchVideoNetWorkUrl,
  isSearchLiveRoomNetWorkUrl
};var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, key + "" , value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), member.set(obj, value), value);
var _intervalExecutorList, _interval, _func, _config, _statusObj, _keyIntervalName;
const _IntervalExecutor = class _IntervalExecutor {
  constructor(func, config = {}) {
    __privateAdd(this, _interval, null);
    __privateAdd(this, _func);
    __privateAdd(this, _config);
    __privateAdd(this, _statusObj, {});
    __privateAdd(this, _keyIntervalName, "");
    __publicField(this, "getKeyIntervalName", () => {
      return __privateGet(this, _keyIntervalName);
    });
    const defConfig = { timeout: 2e3, processTips: false, intervalName: null };
    __privateSet(this, _config, Object.assign(defConfig, config));
    if (__privateGet(this, _config).intervalName === null) {
      throw new Error("请设置间隔名称");
    }
    __privateSet(this, _func, func);
    const intervalName = __privateGet(this, _config).intervalName;
    const intervalExecutorList = __privateGet(_IntervalExecutor, _intervalExecutorList);
    const index = intervalExecutorList.length + 1;
    __privateSet(this, _keyIntervalName, `${intervalName}_${index}`);
    __privateSet(this, _statusObj, { status: false, key: __privateGet(this, _keyIntervalName), name: __privateGet(this, _config).intervalName });
    intervalExecutorList.push(this);
  }
  static setIntervalExecutorStatus(keyIntervalName, status) {
    const find = __privateGet(_IntervalExecutor, _intervalExecutorList).find((item) => item.getKeyIntervalName() === keyIntervalName);
    if (find === void 0) return;
    if (status) {
      find.start();
    } else {
      find.stop();
    }
  }
  stop(msg = null) {
    const i = __privateGet(this, _interval);
    if (i === null) return;
    clearInterval(i);
    __privateSet(this, _interval, null);
    const processTips = __privateGet(this, _config).processTips;
    if (msg) {
      console.log(msg);
    }
    if (processTips) {
      console.log(`stop:检测${__privateGet(this, _config).intervalName}间隔执行器`);
    }
    __privateGet(this, _statusObj).status = false;
  }
  setTimeout(timeout) {
    __privateGet(this, _config).timeout = timeout;
  }
  start() {
    if (__privateGet(this, _interval) !== null) return;
    __privateGet(this, _statusObj).status = true;
    __privateSet(this, _interval, setInterval(__privateGet(this, _func), __privateGet(this, _config).timeout));
    const processTips = __privateGet(this, _config).processTips;
    if (processTips) {
      console.log(`start:检测${__privateGet(this, _config).intervalName}间隔执行器`);
    }
  }
};
_intervalExecutorList = new WeakMap();
_interval = new WeakMap();
_func = new WeakMap();
_config = new WeakMap();
_statusObj = new WeakMap();
_keyIntervalName = new WeakMap();
__privateAdd(_IntervalExecutor, _intervalExecutorList, []);
let IntervalExecutor = _IntervalExecutor;const isNewHistoryPage = (url) => {
  return url.includes("://www.bilibili.com/history");
};
const getDuration = (str) => {
  if (str === null) {
    return -1;
  }
  if (str.includes("已看完") || str === "") {
    return -1;
  } else {
    const match = str?.match(/\/(.*)/);
    if (match) {
      return sFormatUtil.timeStringToSeconds(match[1]);
    }
  }
  return -1;
};
const getVideoDataList$2 = async () => {
  const elList = await elUtil.findElements(".section-cards.grid-mode>div");
  const list = [];
  for (let el of elList) {
    const titleEl = el.querySelector(".bili-video-card__title");
    const title = titleEl.textContent.trim();
    const videoUrl = titleEl.firstElementChild.href || null;
    if (videoUrl?.includes("live.bilibili.com")) {
      continue;
    }
    const bv = elUtil.getUrlBV(videoUrl);
    const userEl = el.querySelector(".bili-video-card__author");
    const cardTag = el.querySelector(".bili-cover-card__tag")?.textContent.trim() || null;
    const name = userEl.textContent.trim();
    const userUrl = userEl.href;
    const uid = elUtil.getUrlUID(userUrl);
    let nDuration = -1;
    if (cardTag !== "专栏") {
      nDuration = el.querySelector(".bili-cover-card__stat")?.textContent.trim() || null;
      nDuration = getDuration(nDuration);
    }
    const tempEL = el.querySelector(".bili-video-card__details");
    list.push({
      title,
      videoUrl,
      name,
      userUrl,
      nDuration,
      uid,
      el,
      bv,
      insertionPositionEl: tempEL,
      explicitSubjectEl: tempEL
    });
  }
  return list;
};
const startShieldingVideoList$2 = async () => {
  const list = await getVideoDataList$2();
  for (let videoData of list) {
    video_shielding.shieldingVideoDecorated(videoData).catch(() => {
      shielding.addBlockButton({
        data: videoData,
        maskingFunc: startShieldingVideoList$2
      }, "gz_shielding_button");
    });
  }
};
const intervalShieldingHistoryVideoExecutor = new IntervalExecutor(startShieldingVideoList$2, {
  processTips: true,
  intervalName: "历史记录项"
});
const getTopFilterLabel = async () => {
  const el = await elUtil.findElement(".radio-filter>.radio-filter__item--active");
  return el.textContent?.trim();
};
const topFilterInsertListener = () => {
  elUtil.findElement(".radio-filter").then((el) => {
    el.addEventListener("click", (e) => {
      const target = e.target;
      const label = target.textContent?.trim();
      console.log(`点击了${label}`);
      if (label === "直播") {
        intervalShieldingHistoryVideoExecutor.stop();
        return;
      }
      intervalShieldingHistoryVideoExecutor.start();
    });
  });
};
const startRun = () => {
  getTopFilterLabel().then((label) => {
    if (label === "直播") {
      return;
    }
    intervalShieldingHistoryVideoExecutor.start();
  });
  topFilterInsertListener();
};
var newHistory = {
  isNewHistoryPage,
  startRun
};var css = `.to_hide_xl {
    display: block !important;
}
`;const isSearchLivePage = (url = window.location.href) => {
  return url.includes("search.bilibili.com/live");
};
const installStyle = () => {
  const styleElement = document.createElement("style");
  styleElement.textContent = css;
  document.head.appendChild(styleElement);
};
const getLiveRoomList = async () => {
  const elList = await elUtil.findElements(".live-room-cards>.video-list-item");
  const list = [];
  for (let el of elList) {
    const titleAEl = el.querySelector(".bili-live-card__info--tit>a");
    const titleEl = el.querySelector(".bili-live-card__info--tit>a>span");
    const userEl = el.querySelector(".bili-live-card__info--uname");
    const liveUrl = titleAEl.href;
    const title = titleEl.textContent.trim();
    const userUrl = userEl.href;
    const uid = elUtil.getUrlUID(userUrl);
    const name = userEl.textContent.trim();
    list.push({
      title,
      liveUrl,
      name,
      userUrl,
      uid,
      el,
      explicitSubjectEl: el.querySelector(".bili-live-card__info"),
      insertionPositionEl: userEl
    });
  }
  return list;
};
const addBlockButton = (data) => {
  shielding.addBlockButton(data, "", ["right"]);
};
const startShieldingLiveRoomList = async () => {
  const list = await getLiveRoomList();
  for (let liveData of list) {
    if (live_shielding.shieldingLiveRoomDecorated(liveData)) {
      continue;
    }
    addBlockButton({ data: liveData, maskingFunc: startShieldingLiveRoomList });
  }
};
var searchLive = {
  installStyle,
  startShieldingLiveRoomList,
  isSearchLivePage
};const isMessagePage = (url = window.location.href) => {
  return url.includes("message.bilibili.com");
};
const modifyTopItemsZIndex = () => {
  elUtil.findElement("#home_nav").then((el) => {
    el.style.zIndex = 1e3;
    eventEmitter.send("打印信息", "已修改顶部的z-index值为1");
  });
};
var messagePage = {
  isMessagePage,
  modifyTopItemsZIndex
};const getGateActivatedTab = async () => {
  const el = await elUtil.findElement(".ant-radio-group>.ant-radio-button-wrapper-checked");
  return el?.textContent.trim();
};
const check_bilibili_gate_compatibility = async () => {
  const el = await elUtil.findElement(".bilibili-gate-root", { interval: 300, timeout: 5e3 });
  if (el) {
    if (!globalValue.adaptationBAppCommerce) {
      eventEmitter.send("el-alert", "检测到使用bilibili_gate脚本但未开启兼容选项，需要启用相关兼容选项才可正常使用");
    } else {
      eventEmitter.send("el-notify", {
        title: "tip",
        message: "启用兼容bilibili-gate脚本"
      });
    }
    return;
  }
  if (globalValue.adaptationBAppCommerce) {
    eventEmitter.send("el-alert", "检测到未使用bilibili_gate脚本却开启了兼容选项，请关闭兼容选项或启用bilibili_gate脚本后再启用相关兼容选项");
  }
};
const bGateClearListNonVideoV = bGateClearListNonVideoGm();
const getGateDataList = async () => {
  const elList = await elUtil.findElements(".bilibili-gate-video-grid>[data-bvid].bili-video-card");
  const list = [];
  for (let el of elList) {
    const redTag = el.querySelector(".css-1atx64h");
    if (redTag && bGateClearListNonVideoV) {
      el.remove();
      continue;
    }
    if (redTag) continue;
    const tempData = bilibiliHome.getVideoData(el);
    const videoUrl = el.querySelector("a.css-feo88y")?.href;
    const bv = elUtil.getUrlBV(videoUrl);
    const insertionPositionEl = el.querySelector(".bili-video-card__info--owner");
    list.push({
      ...tempData,
      ...{
        videoUrl,
        el,
        bv,
        insertionPositionEl,
        explicitSubjectEl: el
      }
    });
  }
  return list;
};
const startShieldingGateVideoList = async () => {
  const list = await getGateDataList();
  for (let videoData of list) {
    video_shielding.shieldingVideoDecorated(videoData, "hide").catch(() => {
      eventEmitter.send("视频添加屏蔽按钮", { data: videoData, maskingFunc: startShieldingGateVideoList });
    });
  }
};
const startIntervalShieldingGateVideoList = () => {
  const throttle = defUtil$1.throttle(startShieldingGateVideoList, 2e3);
  setInterval(async () => {
    await getGateActivatedTab();
    throttle();
  }, 1500);
};
var BLBLGate = {
  check_bilibili_gate_compatibility,
  startIntervalShieldingGateVideoList
};const checkAndExcludePageTest = (url) => {
  const arr = getExcludeURLsGm();
  if (arr.length === 0) return returnTempVal;
  for (let v of arr) {
    if (!v.state) continue;
    if (url.search(v.regularURL) !== -1) {
      return { state: true, regularURL: v.regularURL };
    }
  }
  return returnTempVal;
};
const checkAndExcludePage = (url) => {
  if (!isExcludeURLSwitchGm()) return false;
  const { state, regularURL } = checkAndExcludePageTest(url);
  if (state) {
    console.log("排除页面", regularURL);
  }
  return state;
};const isLiveHomePage = (url) => {
  return url.includes("https://live.bilibili.com/?spm_id_from=") || url === "https://live.bilibili.com/" || url.includes("live.bilibili.com/?visit_id=");
};
const getTopLiveRoomDataList = async () => {
  const verification = await elUtil.findElement(".v-top>.aside-item .t-left.aside-item-tips.p-absolute.w-100.border-box");
  if (verification.textContent.trim() === "--") {
    return await getTopLiveRoomDataList();
  }
  const elList = await elUtil.findElements(".v-top>.aside-item", { interval: 2e3 });
  const list = [];
  for (let el of elList) {
    const classList = el.classList;
    const active = classList.contains("active");
    const title = el.getAttribute("title");
    const { up_id: uid, room_id } = JSON.parse(el.getAttribute("data-report"));
    const liveUrl = `https://live.bilibili.com/${room_id}`;
    list.push({ title, uid, active, liveUrl, el });
  }
  return list;
};
const getLiveRoomDataList = async () => {
  const elList = await elUtil.findElements(".room-card-wrapper.p-relative.dp-i-block");
  const list = [];
  for (let el of elList) {
    const cardEl = el.querySelector(".room-card-ctnr.p-relative.w-100");
    const cardData = JSON.parse(cardEl.getAttribute("data-bl-report-click") || "");
    const { up_id: uid, room_id } = cardData.msg;
    const liveUrl = `https://live.bilibili.com/${room_id}`;
    const name = el.querySelector(".room-anchor>span").textContent.trim();
    const title = el.querySelector(".room-title.card-text").textContent.trim();
    const partition = el.querySelector(".area-name").textContent.trim();
    const popularity = el.querySelector(".room-anchor .v-middle").textContent.trim();
    list.push({
      name,
      title,
      partition,
      popularity,
      liveUrl,
      uid,
      el,
      roomId: room_id,
      explicitSubjectEl: el,
      insertionPositionEl: el.querySelector("a")
    });
  }
  return list;
};
const startShieldingLiveRoom = async () => {
  const list = await getLiveRoomDataList();
  for (let liveData of list) {
    if (live_shielding.shieldingLiveRoomDecorated(liveData)) continue;
    eventEmitter.send("event-直播首页列表添加屏蔽按钮", { data: liveData, maskingFunc: startShieldingLiveRoom });
  }
};
const startShieldingTopLiveRoom = async () => {
  const list = await getTopLiveRoomDataList();
  for (let liveData of list) {
    live_shielding.shieldingLiveRoomDecorated(liveData);
  }
};
const run$2 = () => {
  liveCommon.addStyle();
  startShieldingTopLiveRoom();
  startShieldingLiveRoom();
  setInterval(async () => {
    await startShieldingLiveRoom();
  }, 2e3);
};
var liveHome = {
  isLiveHomePage,
  startShieldingLiveRoom,
  run: run$2
};const isUrlPage$1 = (url) => {
  return url.startsWith("https://live.bilibili.com/all");
};
const getAllLivePageLiveList = async () => {
  const elList = await elUtil.findElements(".index_item_JSGkw");
  const list = [];
  for (const el of elList) {
    const vueEl = el.querySelector("a");
    const vueData = vueEl["__vue__"];
    const {
      anchorName: name,
      anchorId: uid,
      roomId,
      roomTitle: title,
      watchedShow: {
        num: popularity
      }
    } = vueData;
    list.push({
      name,
      uid,
      roomId,
      title,
      popularity,
      el,
      insertionPositionEl: el,
      explicitSubjectEl: el
    });
  }
  return list;
};
const checkLiveList = async () => {
  const list = await getAllLivePageLiveList();
  for (let liveData of list) {
    if (live_shielding.shieldingLiveRoomDecorated(liveData)) continue;
    shielding.addBlockButton({ data: liveData, maskingFunc: checkLiveList }, "gz-live-home-room-card-list-item");
  }
};
var allLivePage = { isUrlPage: isUrlPage$1, checkLiveList };const blockCommentWordLimit = (content) => {
  const commentWordLimit = localMKData.getCommentWordLimitVal();
  if (commentWordLimit < 3) return returnTempVal;
  if (content.length > commentWordLimit) {
    return { state: true, type: "屏蔽字数限制", matching: `字数限制为${commentWordLimit}` };
  }
  return returnTempVal;
};
const shieldingComment = (commentsData) => {
  const { content, uid, name, level = -1 } = commentsData;
  let returnVal = blockSeniorMemberOnly(level);
  if (returnVal.state) return returnVal;
  returnVal = blockUserUidAndName(uid, name);
  if (returnVal.state) return returnVal;
  returnVal = blockComment(content);
  if (returnVal.state) return returnVal;
  if (level !== -1) {
    returnVal = blockByLevelForComment(level);
    if (returnVal.state) return returnVal;
  }
  return blockCommentWordLimit(content);
};
const shieldingCommentAsync = async (commentsData) => {
  const { state, type, matching } = shieldingComment(commentsData);
  eventEmitter.send("event-评论通知替换关键词", commentsData);
  if (type === "保留硬核会员") {
    return false;
  }
  if (state) {
    commentsData.el?.remove();
    eventEmitter.send("屏蔽评论信息", type, matching, commentsData);
    return state;
  }
  return state;
};
const shieldingCommentsAsync = async (commentsDataList) => {
  for (let commentsData of commentsDataList) {
    const { state, type, matching } = await shieldingCommentAsync(commentsData);
    eventEmitter.send("event-评论通知替换关键词", commentsData);
    const { replies = [] } = commentsData;
    if (type === "保留硬核会员") continue;
    if (state) continue;
    eventEmitter.send("评论添加屏蔽按钮", commentsData);
    for (let reply of replies) {
      if (await shieldingCommentAsync(reply)) continue;
      eventEmitter.send("评论添加屏蔽按钮", reply);
    }
    if (state) {
      commentsData.el?.remove();
      eventEmitter.send("屏蔽评论信息", type, matching, commentsData);
    }
  }
};
var comments_shielding = {
  shieldingComment,
  shieldingCommentsAsync,
  shieldingCommentAsync
};const isTopicDetailPage = (url) => {
  return url.includes("//www.bilibili.com/v/topic/detail/");
};
const getDataList = async () => {
  const elList = await elUtil.findElements(".list__topic-card");
  const list = [];
  for (let el of elList) {
    const name = el.querySelector(".bili-dyn-title").textContent.trim();
    const uidEl = el.querySelector(".bili-dyn-item__following");
    const uid = parseInt(uidEl.getAttribute("data-mid"));
    const judgmentEl = el.querySelector(".bili-dyn-card-video__title");
    const data = { name, uid, el, judgmentVideo: judgmentEl !== null };
    if (judgmentEl !== null) {
      data.title = judgmentEl.textContent.trim();
      const videoUrl = el.querySelector(".bili-dyn-card-video").href;
      data.videoUrl = videoUrl;
      data.bv = elUtil.getUrlBV(videoUrl);
      data.insertionPositionEl = el.querySelector(".bili-dyn-content__orig");
      data.explicitSubjectEl = data.insertionPositionEl;
    } else {
      const dynTitle = el.querySelector(".dyn-card-opus__title");
      const contentTitle = dynTitle === null ? "" : dynTitle.textContent.trim();
      const contentBody = el.querySelector(".bili-rich-text>div").textContent.trim();
      data.insertionPositionEl = el.querySelector(".dyn-card-opus");
      data.explicitSubjectEl = data.insertionPositionEl;
      data.content = contentTitle + contentBody;
    }
    list.push(data);
  }
  return list;
};
const startShielding = async () => {
  const list = await getDataList();
  const css = { width: "100%" };
  for (let data of list) {
    data.cssMap = css;
    if (data.judgmentVideo) {
      video_shielding.shieldingVideoDecorated(data).catch(() => {
        shielding.addTopicDetailVideoBlockButton({ data, maskingFunc: startShielding });
      });
    } else {
      if (await comments_shielding.shieldingCommentAsync(data)) continue;
      shielding.addTopicDetailContentsBlockButton({ data, maskingFunc: startShielding });
    }
  }
};
var topicDetail = {
  isTopicDetailPage,
  startShielding
};eventEmitter.on("评论添加屏蔽按钮", (commentsData) => {
  shielding.addBlockButton({
    data: commentsData,
    maskingFunc: startShieldingComments
  }, "gz_shielding_comment_button");
});
const getUrlUserLevel = (src) => {
  const levelMath = src?.match(/level_(.+)\.svg/) || null;
  let level = -1;
  if (levelMath !== null) {
    const levelRow = levelMath[1];
    if (levelRow === "h") {
      level = 7;
    } else {
      level = parseInt(levelRow);
    }
  }
  return level;
};
const getOldUserLevel = (iEl) => {
  let level;
  const levelCLassName = iEl.classList[1];
  if (levelCLassName === "level-hardcore") {
    level = 7;
  } else {
    const levelMatch = levelCLassName.match(/level-(.+)/)?.[1] || "";
    level = parseInt(levelMatch);
  }
  return level;
};
const getCommentSectionList = async () => {
  const commentApp = await elUtil.findElement(
    "bili-comments",
    { interval: 500 }
  );
  const comments = await elUtil.findElements(
    "#feed>bili-comment-thread-renderer",
    { doc: commentApp.shadowRoot, interval: 500 }
  );
  const commentsData = [];
  let isLoaded = false;
  for (let el of comments) {
    const theOPEl = el.shadowRoot.getElementById("comment").shadowRoot;
    const theOPUserInfo = theOPEl.querySelector("bili-comment-user-info").shadowRoot.getElementById("info");
    const userNameEl = theOPUserInfo.querySelector("#user-name>a");
    const userLevelSrc = theOPUserInfo.querySelector("#user-level>img")?.src || null;
    const level = getUrlUserLevel(userLevelSrc);
    isLoaded = theOPEl.querySelector("#content>bili-rich-text").shadowRoot.querySelector("#contents>*") !== null;
    if (!isLoaded) {
      break;
    }
    const theOPContentEl = theOPEl.querySelector("#content>bili-rich-text").shadowRoot.querySelector("#contents");
    const theOPContent = theOPContentEl.textContent.trim();
    const userName = userNameEl.textContent.trim();
    const userUrl = userNameEl.href;
    const uid = elUtil.getUrlUID(userUrl);
    const replies = [];
    commentsData.push({
      name: userName,
      userUrl,
      uid,
      level,
      content: theOPContent,
      replies,
      el,
      insertionPositionEl: theOPUserInfo,
      explicitSubjectEl: theOPEl.querySelector("#body"),
      contentsEl: theOPContentEl
    });
    const inTheBuildingEls = el.shadowRoot.querySelector("bili-comment-replies-renderer").shadowRoot.querySelectorAll("bili-comment-reply-renderer");
    for (let inTheBuildingEl of inTheBuildingEls) {
      const inTheContentEl = inTheBuildingEl.shadowRoot;
      const biliCommentUserInfo = inTheContentEl.querySelector("bili-comment-user-info");
      biliCommentUserInfo.style.display = "block";
      const inTheBuildingUserInfo = biliCommentUserInfo.shadowRoot.getElementById("info");
      const inTheBuildingUserNameEl = inTheBuildingUserInfo.querySelector("#user-name>a");
      const inTheBuildingUserName = inTheBuildingUserNameEl.textContent.trim();
      const inTheBuildingUserUrl = inTheBuildingUserNameEl.href;
      const inTheBuildingUid = elUtil.getUrlUID(inTheBuildingUserUrl);
      const biliRichTextEL = inTheContentEl.querySelector("bili-rich-text");
      const contentsEl = biliRichTextEL.shadowRoot.querySelector("#contents");
      const inTheBuildingContent = contentsEl.textContent.trim();
      const userLevelSrc2 = inTheBuildingUserInfo.querySelector("#user-level>img")?.src || null;
      const level2 = getUrlUserLevel(userLevelSrc2);
      replies.push({
        name: inTheBuildingUserName,
        userUrl: inTheBuildingUserUrl,
        uid: inTheBuildingUid,
        level: level2,
        content: inTheBuildingContent,
        el: inTheBuildingEl,
        insertionPositionEl: inTheBuildingUserInfo,
        explicitSubjectEl: inTheBuildingEl,
        contentsEl
      });
    }
  }
  if (!isLoaded) {
    await defUtil$1.wait(500);
    return getCommentSectionList();
  }
  return commentsData;
};
const getOldCommentSectionList = async () => {
  let results = await elUtil.findElements(".reply-list>.reply-item", { timeout: 5e3 });
  const commentsData = [];
  for (let el of results) {
    const theOPEl = el.querySelector(".root-reply-container");
    const theOPUserInfoEl = theOPEl.querySelector(".user-name");
    const userName = theOPUserInfoEl.textContent.trim();
    const uid = parseInt(theOPUserInfoEl.getAttribute("data-user-id"));
    const userUrl = `https://space.bilibili.com/${uid}`;
    const theOPContent = theOPEl.querySelector(".reply-content").textContent.trim();
    const userInfoEl = el.querySelector(".user-info");
    const iEl = userInfoEl.querySelector("i");
    const level = getOldUserLevel(iEl);
    const replies = [];
    commentsData.push({
      name: userName,
      userUrl,
      uid,
      content: theOPContent,
      level,
      replies,
      el,
      insertionPositionEl: userInfoEl,
      explicitSubjectEl: el.querySelector(".content-warp")
    });
    const inTheBuildingEls = el.querySelectorAll(".sub-reply-container>.sub-reply-list>.sub-reply-item");
    for (let inTheBuildingEl of inTheBuildingEls) {
      const subUserNameEl = inTheBuildingEl.querySelector(".sub-user-name");
      const uid2 = parseInt(subUserNameEl.getAttribute("data-user-id"));
      const userName2 = subUserNameEl.textContent.trim();
      const userUrl2 = `https://space.bilibili.com/${uid2}`;
      const subContent = inTheBuildingEl.querySelector(".reply-content").textContent.trim();
      const subUserInfoEl = inTheBuildingEl.querySelector(".sub-user-info");
      const iEl2 = subUserInfoEl.querySelector("i");
      const level2 = getOldUserLevel(iEl2);
      const replyContentContainerEl = inTheBuildingEl.querySelector("span.reply-content-container");
      replyContentContainerEl.style.display = "block";
      replies.push({
        name: userName2,
        userUrl: userUrl2,
        uid: uid2,
        level: level2,
        content: subContent,
        el: inTheBuildingEl,
        insertionPositionEl: subUserInfoEl,
        explicitSubjectEl: inTheBuildingEl
      });
    }
  }
  return commentsData;
};
const getLiveRankingsCommentSectionList = async () => {
  const elList = await elUtil.findElements(".comment-list>.list-item");
  const commentsData = [];
  for (let el of elList) {
    const nameEl = el.querySelector(".user>.name");
    const uid = parseInt(nameEl.getAttribute("data-usercard-mid"));
    const name = nameEl.textContent.trim();
    const levelEl = el.querySelector(".level-link>.level");
    const level = parseInt(levelEl.classList[1].charAt(1));
    const contentsEl = el.querySelector(".con>.text");
    const content = contentsEl.textContent.trim();
    const insertionPositionEl = el.querySelector(".user");
    const replies = [];
    commentsData.push({
      name,
      uid,
      content,
      level,
      el,
      replies,
      insertionPositionEl,
      contentsEl,
      explicitSubjectEl: insertionPositionEl
    });
    for (let replyEl of el.querySelectorAll(".reply-box>.reply-item")) {
      const replyNameEl = replyEl.querySelector(".name");
      const name2 = replyNameEl.textContent.trim();
      const uid2 = parseInt(replyNameEl.getAttribute("data-usercard-mid"));
      const replyLevelEl = replyEl.querySelector(".level");
      const level2 = parseInt(replyLevelEl.classList[1].charAt(1));
      const contentsEl2 = replyEl.querySelector(".text-con");
      const content2 = contentsEl2.textContent.trim();
      const insertionPositionEl2 = replyEl.querySelector(".user");
      replies.push({
        name: name2,
        el: replyEl,
        uid: uid2,
        content: content2,
        level: level2,
        insertionPositionEl: insertionPositionEl2,
        contentsEl: contentsEl2,
        explicitSubjectEl: replyEl
      });
    }
  }
  return commentsData;
};
const checkLiveRankingsCommentSectionList = async () => {
  await comments_shielding.shieldingCommentsAsync(await getLiveRankingsCommentSectionList());
};
const startShieldingComments = async () => {
  if (videoPlayModel.isVideoPlayPage() && localMKData.isDelBottomComment() || isCloseCommentBlockingGm()) {
    return;
  }
  let list;
  const href = window.location.href;
  if (localMKData.isDiscardOldCommentAreas()) {
    list = await getCommentSectionList();
  } else if (href.includes("https://space.bilibili.com/") || topicDetail.isTopicDetailPage(href)) {
    list = await getOldCommentSectionList();
  } else {
    list = await getCommentSectionList();
  }
  comments_shielding.shieldingCommentsAsync(list);
};
eventEmitter.on("event-检查评论区屏蔽", () => {
  startShieldingComments();
});
var commentSectionModel = {
  checkLiveRankingsCommentSectionList
};const isUrlPage = (url) => {
  return url.includes("live.bilibili.com/p/eden/rank");
};
const run$1 = async () => {
  defUtil$1.getJQuery().then(($) => {
    const butEl = document.createElement("button");
    butEl.textContent = "屏蔽";
    butEl.setAttribute("gz_type", "");
    butEl.addEventListener("click", () => {
      const el = document.querySelector("body>.user-card");
      const nameEl = el.querySelector(".name");
      const userAddress = nameEl.href;
      const uid = elUtil.getUrlUID(userAddress);
      if (ruleUtil.addRulePreciseUid(uid).status) {
        commentSectionModel.checkLiveRankingsCommentSectionList();
      }
    });
    $("body").on("mouseenter.data-userCard", "[data-usercard-mid]", function() {
      elUtil.findElement("body>.user-card").then((el) => {
        if (el.querySelector("button[gz_type]") !== null) return;
        const userEl = el.querySelector(".user");
        userEl.appendChild(butEl);
      });
    });
  });
};
var liveEdenRankPage = { isUrlPage, run: run$1 };let be_wly_el = null;
const excludeTabNames = ["正在关注", "订阅剧集", "直播"];
const excludeRankingLeftTabNames = ["番剧", "综艺", "电视剧", "纪录片", "中国动画"];
const getBewlyEl = async () => {
  if (be_wly_el === null) {
    let el = await elUtil.findElement("#bewly", { interval: 500, cachePromise: true, parseShadowRoot: true });
    be_wly_el = el;
    return el;
  }
  return be_wly_el;
};
const getBEWlyWitcherButtonTextContent = async () => {
  const el = await getBewlyEl();
  return el.querySelector(".bewly-bili-switcher-button").textContent;
};
const isBEWLYCatPlugin = async () => {
  const text = await getBEWlyWitcherButtonTextContent();
  return text.includes("BewlyCat");
};
const isBEWLYPage = (url) => {
  return url.includes("www.bilibili.com/?page=") || url === "https://www.bilibili.com/" || url.startsWith("https://www.bilibili.com/?spm_id_from=");
};
const getRankingLeftTabs = async () => {
  const beEl = await getBewlyEl();
  const elList = await elUtil.findElements('ul[flex="~ col gap-2"]>li', { doc: beEl });
  const list = [];
  for (let el of elList) {
    const label = el.textContent.trim();
    list.push({ label, el });
  }
  return list;
};
const getRightTabs = async () => {
  const beEl = await getBewlyEl();
  const els = await elUtil.findElements(".dock-content-inner>.b-tooltip-wrapper", { doc: beEl });
  const list = [];
  for (let el of els) {
    const label = el.querySelector(".b-tooltip").textContent.trim();
    const active = !!el.querySelector(".dock-item.group.active");
    list.push({ label, active, el });
  }
  return list;
};
const getVideoList = async () => {
  const be_wly_el2 = await getBewlyEl();
  const elList = await elUtil.findElements(".video-card.group", { doc: be_wly_el2 });
  const list = [];
  const isBEWLYCatPluginVal = await isBEWLYCatPlugin();
  for (let el of elList) {
    const parentElement = el.parentElement.parentElement;
    const title = el.querySelector(".video-card-title>a").textContent.trim();
    const userUrlEl = el.querySelector(".channel-name");
    const userUrl = userUrlEl.href;
    const uid = elUtil.getUrlUID(userUrl);
    const name = userUrlEl.textContent.trim();
    let nDuration, nPlayCount, bulletChat;
    if (isBEWLYCatPluginVal) {
      const statsEl = el.querySelector(".video-card-cover-stats");
      nDuration = statsEl.querySelector(".video-card-cover-stats__item--duration")?.textContent.trim() ?? null;
      const othersStatsEls = statsEl.querySelectorAll(".video-card-cover-stats__items>.video-card-cover-stats__item>.video-card-cover-stats__value");
      nPlayCount = othersStatsEls[0].textContent.trim();
      bulletChat = othersStatsEls[1].textContent.trim();
      bulletChat = parseInt(bulletChat);
    } else {
      const playInfoEl = el.querySelector('[flex="~ items-center gap-1 wrap"]>div');
      nDuration = el.querySelector('[class*="group-hover:opacity-0"]')?.textContent.trim() || null;
      nPlayCount = playInfoEl.querySelector("span:first-child")?.textContent.trim() || null;
      bulletChat = playInfoEl.querySelector("span:last-of-type")?.textContent.trim() || null;
      if (playInfoEl.querySelectorAll("span").length < 2) {
        bulletChat = -1;
      } else {
        bulletChat = sFormatUtil.toPlayCountOrBulletChat(bulletChat);
      }
    }
    nDuration = sFormatUtil.timeStringToSeconds(nDuration);
    nPlayCount = sFormatUtil.toPlayCountOrBulletChat(nPlayCount);
    const videoUrl = el.querySelector('[href*="https://www.bilibili.com/video"]')?.href;
    const bv = elUtil.getUrlBV(videoUrl);
    const insertionPositionEl = el.querySelector(".video-card-meta");
    list.push({
      title,
      name,
      uid,
      bv,
      userUrl,
      videoUrl,
      nPlayCount,
      bulletChat,
      nDuration,
      el: parentElement,
      insertionPositionEl,
      explicitSubjectEl: parentElement
    });
  }
  return list;
};
const getHistoryVideoDataList = async () => {
  const beEL = await getBewlyEl();
  const elList = await elUtil.findElements("a.group[flex][cursor-pointer]", { doc: beEL });
  const list = [];
  for (let el of elList) {
    const titleEl = el.querySelector("h3.keep-two-lines");
    const videoUrlEl = titleEl.parentElement;
    const userEl = videoUrlEl.nextElementSibling;
    const videoUrl = videoUrlEl.href;
    const bv = elUtil.getUrlBV(videoUrl);
    const userUrl = userEl.href;
    const uid = elUtil.getUrlUID(userUrl);
    const name = userEl.textContent.trim();
    const title = titleEl?.textContent.trim();
    const tempTime = el.querySelector("div[pos][rounded-8]")?.textContent.trim().split(/[\t\r\f\n\s]*/g).join("");
    const match = tempTime?.match(/\/(.*)/);
    let nDuration = match?.[1];
    nDuration = sFormatUtil.timeStringToSeconds(nDuration);
    list.push({
      title,
      userUrl,
      name,
      uid,
      videoUrl,
      nDuration,
      bv,
      el,
      insertionPositionEl: videoUrlEl.parentElement,
      explicitSubjectEl: el
    });
  }
  return list;
};
const getHomeTopTabs = async () => {
  const beEl = await getBewlyEl();
  const els = beEl.querySelectorAll(".home-tabs-inside>[data-overlayscrollbars-contents]>button");
  const list = [];
  for (let el of els) {
    const label = el.textContent.trim();
    const active = el.classList.contains("tab-activated");
    list.push({ label, active, el });
  }
  if (list.some((tab) => tab.active === true)) {
    return list;
  }
  return await getHomeTopTabs();
};
const startShieldingVideoList$1 = async () => {
  const list = await getVideoList();
  for (let videoData of list) {
    video_shielding.shieldingVideoDecorated(videoData).catch(() => {
      eventEmitter.send("视频添加屏蔽按钮-BewlyBewly", {
        data: videoData,
        maskingFunc: startShieldingVideoList$1
      });
    });
  }
};
const intervalShieldingVideoListExecutor = new IntervalExecutor(startShieldingVideoList$1, { processTips: true, intervalName: "视频" });
const startShieldingHistoryVideoList = async () => {
  const list = await getHistoryVideoDataList();
  for (let videoData of list) {
    video_shielding.shieldingVideoDecorated(videoData).catch(() => {
      eventEmitter.send("视频添加屏蔽按钮", { data: videoData, maskingFunc: startShieldingHistoryVideoList });
    });
  }
};
const intervalBEWLYShieldingHistoryVideoExecutor = new IntervalExecutor(startShieldingHistoryVideoList, { processTips: true, intervalName: "BEWLY历史记录" });
const homeTopTabsInsertListener = () => {
  getHomeTopTabs().then((list) => {
    for (let { el, label } of list) {
      el.addEventListener("click", () => {
        console.log("点击了" + label);
        if (excludeTabNames.includes(label)) {
          intervalShieldingVideoListExecutor.stop();
          return;
        }
        if (label === "排行") {
          rankingLeftTabsInsertListener();
        }
        intervalShieldingVideoListExecutor.start();
      });
    }
  });
};
const rankingLeftTabsInsertListener = () => {
  getRankingLeftTabs().then((list) => {
    for (let { el, label } of list) {
      el.addEventListener("click", () => {
        console.log("点击了" + label);
        if (excludeRankingLeftTabNames.includes(label)) {
          intervalShieldingVideoListExecutor.stop();
          return;
        }
        intervalShieldingVideoListExecutor.start();
      });
    }
  });
};
const rightTabsInsertListener = () => {
  getRightTabs().then(
    (list) => {
      for (let { el, label, active } of list) {
        el.addEventListener(
          "click",
          () => {
            console.log("右侧选项卡栏点击了" + label, active);
            if (label === "首页") {
              homeTopTabsInsertListener();
              intervalShieldingVideoListExecutor.start();
            } else {
              intervalShieldingVideoListExecutor.stop();
            }
            if (label === "观看历史") {
              intervalBEWLYShieldingHistoryVideoExecutor.start();
            } else {
              intervalBEWLYShieldingHistoryVideoExecutor.stop();
            }
          }
        );
      }
    }
  );
};
const searchBoxInsertListener = async () => {
  const beEl = await getBewlyEl();
  const input = await elUtil.findElement('[placeholder="搜索观看历史"]', { doc: beEl });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.keyCode === 13) {
      console.log("回车键被按下");
      if (input["value"].length === 0) return;
      setTimeout(startShieldingHistoryVideoList, 1500);
    }
  });
};
const run = async (url) => {
  const parseUrl = defUtil$1.parseUrl(url);
  const { page } = parseUrl.queryParams;
  getBewlyEl().then((el) => {
    addGzStyle(el, el);
  });
  if (page === "Home" || url.startsWith("https://www.bilibili.com/?spm_id_from=") || url === "https://www.bilibili.com/") {
    intervalShieldingVideoListExecutor.start();
    homeTopTabsInsertListener();
  }
  if (page === "History") {
    intervalBEWLYShieldingHistoryVideoExecutor.start();
    searchBoxInsertListener();
  }
  rightTabsInsertListener();
};
const check_BEWLYPage_compatibility = async () => {
  const el = await elUtil.findElement("#bewly", { interval: 200, cachePromise: true, timeout: 5e3 });
  if (el) {
    if (!globalValue.compatibleBEWLYBEWLY) {
      eventEmitter.send("el-alert", "检测到使用Bewly插件但未开启兼容选项，需要启用相关兼容选项才可正常使用");
    }
  } else {
    if (globalValue.compatibleBEWLYBEWLY) {
      eventEmitter.send("el-alert", "检测到未使用Bewly插件却开启了兼容选项，请关闭兼容选项或启用bilibili_gate脚本后再启用相关兼容选项");
    }
  }
};
var BEWLYCommon = {
  isBEWLYPage,
  run,
  check_BEWLYPage_compatibility
};const homeStaticRoute = (title, url) => {
  if (BEWLYCommon.isBEWLYPage(url) && globalValue.compatibleBEWLYBEWLY) {
    BEWLYCommon.run(url);
  }
  if (bilibiliHome.isHome(url, title)) {
    BLBLGate.check_bilibili_gate_compatibility();
    BEWLYCommon.check_BEWLYPage_compatibility();
    eventEmitter.send("通知屏蔽");
    if (globalValue.compatibleBEWLYBEWLY) return;
    bilibiliHome.run();
  }
};
const staticRoute = (title, url) => {
  console.log("静态路由", title, url);
  if (checkAndExcludePage(url)) return;
  homeStaticRoute(title, url);
  hotSearch.run();
  if (globalValue.bOnlyTheHomepageIsBlocked) return;
  topInput.processTopInputContent();
  hotSearch.startShieldingHotList();
  eventEmitter.send("通知屏蔽");
  if (searchModel.isSearch(url)) {
    searchLive.installStyle();
    searchModel.delFooterContent();
  }
  if (videoPlayModel.isVideoPlayPage(url)) {
    videoPlayModel.findTheExpandButtonForTheListOnTheRightAndBindTheEvent();
    videoPlayModel.run();
    userProfile.run();
    videoPlayPageCommon.insertUserProfileShieldButton();
  }
  if (collectionVideoPlayPageModel.iscCollectionVideoPlayPage(url)) {
    collectionVideoPlayPageModel.findTheExpandButtonForTheListOnTheRightAndBindTheEvent();
    videoPlayPageCommon.insertTagShieldButton();
    userProfile.run();
    videoPlayPageCommon.insertUserProfileShieldButton();
  }
  if (liveRoomModel.isLiveRoom(url)) {
    liveRoomModel.run();
  }
  if (videoPlayWatchLater.isVideoPlayWatchLaterPage(url)) {
    videoPlayWatchLater.findTheExpandButtonForTheListOnTheRightAndBindTheEvent();
    videoPlayPageCommon.insertTagShieldButton();
    userProfile.run();
    videoPlayPageCommon.insertUserProfileShieldButton();
  }
  if (newHistory.isNewHistoryPage(url)) {
    newHistory.startRun();
  }
  if (messagePage.isMessagePage(url)) {
    messagePage.modifyTopItemsZIndex();
  }
  if (space.isSpacePage()) {
    userProfile.run();
    space.getUserInfo().then((userInfo) => {
      console.info("userInfo", userInfo);
    });
  }
  if (liveSectionModel.isLiveSection()) {
    liveSectionModel.run();
  }
  if (liveHome.isLiveHomePage(url)) {
    liveHome.run();
  }
  if (dynamicPage.isUrlDynamicHomePage()) {
    dynamicPage.run();
    userProfile.run();
  }
  if (dynamicPage.isUrlDynamicContentPage()) {
    userProfile.run();
  }
  if (allLivePage.isUrlPage(url)) {
    liveCommon.addStyle();
    allLivePage.checkLiveList();
  }
  if (liveEdenRankPage.isUrlPage(url)) {
    liveEdenRankPage.run();
  }
};
const dynamicRouting = (title, url) => {
  console.log("动态路由", title, url);
  if (globalValue.bOnlyTheHomepageIsBlocked) return;
  if (checkAndExcludePage(url)) return;
  eventEmitter.send("通知屏蔽");
};
var router = {
  staticRoute,
  dynamicRouting
};const addEventListenerUrlChange = (callback) => {
  let oldUrl = window.location.href;
  setInterval(() => {
    const newUrl = window.location.href;
    if (oldUrl === newUrl) return;
    oldUrl = newUrl;
    const title = document.title;
    callback(newUrl, oldUrl, title);
  }, 1e3);
};
const addEventListenerNetwork = (callback) => {
  const performanceObserver = new PerformanceObserver(() => {
    const entries = performance.getEntriesByType("resource");
    const windowUrl = window.location.href;
    const winTitle = document.title;
    for (let entry of entries) {
      const url = entry.name;
      const initiatorType = entry.initiatorType;
      if (initiatorType === "img" || initiatorType === "css" || initiatorType === "link" || initiatorType === "beacon") {
        continue;
      }
      try {
        callback(url, windowUrl, winTitle, initiatorType);
      } catch (e) {
        if (e.message === "stopPerformanceObserver") {
          performanceObserver.disconnect();
          console.log("检测到当前页面在排除列表中，已停止性能观察器对象实例", e);
          break;
        }
        throw e;
      }
    }
    performance.clearResourceTimings();
  });
  performanceObserver.observe({ entryTypes: ["resource"] });
};
function watchElementListLengthWithInterval(selector, callback, config = {}) {
  const defConfig = {};
  config = { ...defConfig, ...config };
  let previousLength = -1;
  const timer = setInterval(
    () => {
      if (previousLength === -1) {
        previousLength = document.querySelectorAll(selector).length;
        return;
      }
      const currentElements = document.querySelectorAll(selector);
      const currentLength = currentElements.length;
      if (currentLength !== previousLength) {
        previousLength = currentLength;
        callback(
          {
            action: currentLength > previousLength ? "add" : "del",
            elements: currentElements,
            length: currentLength
          }
        );
      }
    },
    config.interval
  );
  return stop = () => {
    clearInterval(timer);
  };
}
var watch = {
  addEventListenerUrlChange,
  addEventListenerNetwork,
  watchElementListLengthWithInterval
};const getVideoDataListItem = (el) => {
  const vueData = el.__vue__;
  const { videoData } = vueData;
  const videoCardInfoEl = el.querySelector(".video-card__info");
  const {
    bvid: bv,
    duration: nDuration,
    title,
    owner: {
      mid: uid,
      name
    },
    stat: {
      view: nPlayCount,
      like,
      danmaku: nBulletChat
    }
  } = videoData;
  const videoUrl = "https://www.bilibili.com/video/" + bv;
  return {
    vueData,
    el,
    title,
    name,
    uid,
    videoUrl,
    bv,
    like,
    nPlayCount,
    nDuration,
    nBulletChat,
    insertionPositionEl: videoCardInfoEl.querySelector("div"),
    explicitSubjectEl: videoCardInfoEl
  };
};
const getVideDataList = async (isWeekly = false) => {
  const css = isWeekly ? ".video-list>.video-card" : ".card-list>.video-card";
  const elList = await elUtil.findElements(css);
  const list = [];
  for (let el of elList) {
    list.push(getVideoDataListItem(el));
  }
  return list;
};
const startShieldingVideoList = async (isWeekly = false) => {
  const list = await getVideDataList(isWeekly);
  for (let videoData of list) {
    video_shielding.shieldingVideoDecorated(videoData).catch(() => {
      eventEmitter.send("添加热门视频屏蔽按钮", {
        data: videoData,
        updateFunc: getVideoDataListItem,
        maskingFunc: startShieldingVideoList
      });
    });
  }
};
var popularAll = {
  startShieldingVideoList
};const isPartition = (url = window.location.href) => {
  return url.includes("www.bilibili.com/v/");
};
const isNewPartition = (url = window.location.href) => {
  return url.includes("www.bilibili.com/c/");
};
const getHotVideoDayList = async () => {
  const elList = await elUtil.findElements(".bili-rank-list-video__item");
  const list = [];
  for (let el of elList) {
    let videoUrlEl = el.querySelector("a.rank-video-card");
    const titleEl = el.querySelector(".rank-video-card__info--tit");
    const videoUrl = videoUrlEl.href;
    const title = titleEl.textContent.trim();
    const bv = elUtil.getUrlBV(videoUrl);
    list.push({
      title,
      videoUrl,
      bv,
      el
    });
  }
  return list;
};
const getVVideoDataList = async () => {
  const elList = await elUtil.findElements(".bili-video-card");
  const list = [];
  const oneTitleEl = elList[0].querySelector(".bili-video-card__info--tit>a");
  if (oneTitleEl === null) {
    await defUtil$1.wait();
    return await getVVideoDataList();
  }
  for (let el of elList) {
    const titleEl = el.querySelector(".bili-video-card__info--tit>a");
    if (titleEl === null) {
      continue;
    }
    const userEl = el.querySelector("a.bili-video-card__info--owner");
    const playAndDmu = el.querySelectorAll(".bili-video-card__stats--item>span");
    let nDuration = el.querySelector(".bili-video-card__stats__duration")?.textContent.trim();
    let nPlayCount = playAndDmu[0]?.textContent.trim();
    nPlayCount = sFormatUtil.toPlayCountOrBulletChat(nPlayCount);
    let nBulletChat = playAndDmu[1]?.textContent.trim();
    nBulletChat = sFormatUtil.toPlayCountOrBulletChat(nBulletChat);
    nDuration = sFormatUtil.toPlayCountOrBulletChat(nDuration);
    const title = titleEl.textContent.trim();
    const videoUrl = titleEl.href;
    const userUrl = userEl.href;
    const name = userEl.querySelector(".bili-video-card__info--author")?.textContent.trim() || null;
    const uid = elUtil.getUrlUID(userUrl);
    const bv = elUtil.getUrlBV(videoUrl);
    list.push({
      name,
      title,
      uid,
      bv,
      userUrl,
      videoUrl,
      el,
      nPlayCount,
      nBulletChat,
      nDuration,
      explicitSubjectEl: el.querySelector(".bili-video-card__info"),
      insertionPositionEl: el.querySelector(".bili-video-card__info--bottom")
    });
  }
  return list;
};
const getCVideoDataList = async () => {
  const elList = await elUtil.findElements(".bili-video-card");
  const list = [];
  for (let el of elList) {
    const titleEl = el.querySelector(".bili-video-card__title");
    const title = titleEl.textContent.trim();
    const videoUrl = titleEl.querySelector("a").href;
    const bv = elUtil.getUrlBV(videoUrl);
    const userEl = el.querySelector(".bili-video-card__author");
    const userUrl = userEl.href;
    const uid = elUtil.getUrlUID(userUrl);
    const name = userEl.querySelector("[title]").textContent.trim().split("·")[0].trim();
    const statEls = el.querySelectorAll(".bili-cover-card__stats span");
    const nPlayCount = sFormatUtil.toPlayCountOrBulletChat(statEls[0].textContent.trim());
    const nBulletChat = sFormatUtil.toPlayCountOrBulletChat(statEls[1].textContent.trim());
    const nDuration = sFormatUtil.timeStringToSeconds(statEls[2].textContent.trim());
    const insertionPositionEl = el.querySelector(".bili-video-card__subtitle");
    const explicitSubjectEl = el.querySelector(".bili-video-card__details");
    list.push({
      title,
      userUrl,
      uid,
      name,
      videoUrl,
      bv,
      nPlayCount,
      nBulletChat,
      nDuration,
      el,
      insertionPositionEl,
      explicitSubjectEl
    });
  }
  return list;
};
const shieldingVideoList = async () => {
  let list;
  if (isPartition()) {
    list = await getVVideoDataList();
  } else {
    list = await getCVideoDataList();
  }
  for (let videoData of list) {
    video_shielding.shieldingVideoDecorated(videoData).catch(() => {
      eventEmitter.send("视频添加屏蔽按钮", { data: videoData, maskingFunc: shieldingVideoList });
    });
  }
};
const startShieldingHotVideoDayList = async () => {
  let list = await getHotVideoDayList();
  for (let videoData of list) {
    video_shielding.shieldingVideoDecorated(videoData);
  }
};
const startIntervalShieldingVideoList = () => {
  setInterval(async () => {
    await shieldingVideoList();
    for (let el of document.querySelectorAll(".feed-card:empty")) {
      el?.remove();
      console.log("已移除页面空白视频选项元素");
    }
  }, 1500);
};
var partition = {
  isPartition,
  isNewPartition,
  startIntervalShieldingVideoList,
  startShieldingHotVideoDayList
};const observeNetwork = (url, windowUrl, winTitle, initiatorType) => {
  if (!url.includes("api")) return;
  if (checkAndExcludePage(windowUrl)) {
    throw new Error("stopPerformanceObserver");
  }
  if (globalValue.bOnlyTheHomepageIsBlocked) {
    if (!bilibiliHome.isHome(windowUrl, winTitle)) return;
  }
  if (url.startsWith("https://api.bilibili.com/x/web-interface/wbi/index/top/feed/rcmd?web_location=")) {
    if (globalValue.compatibleBEWLYBEWLY) return;
    bilibiliHome.startDebounceShieldingHomeVideoList();
    console.log("检测到首页加载了换一换视频列表和其下面的视频列表");
    return;
  }
  if (url.startsWith("https://api.bilibili.com/x/v2/reply/wbi/main?oid=")) {
    console.log("检测到评论区楼主评论加载了");
    eventEmitter.send("event-检查评论区屏蔽");
    return;
  }
  if (url.startsWith("https://api.bilibili.com/x/v2/reply/reply?oid=")) {
    console.log("检测到评论区楼主层中的子层评论列表加载了");
    eventEmitter.send("event-检查评论区屏蔽");
  }
  if (url.startsWith("https://api.bilibili.com/x/web-interface/popular?ps=")) {
    popularAll.startShieldingVideoList();
  }
  if (url.startsWith("https://api.bilibili.com/x/web-interface/popular/series/one?number=")) {
    popularAll.startShieldingVideoList(true);
  }
  if (url.startsWith("https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?offset=")) {
    console.log("用户空间动态api加载了");
    space.checkUserSpaceShieldingDynamicContentThrottle();
  }
  if (url.startsWith("https://api.live.bilibili.com/xlive/web-interface/v1/second/getList?platform=web&parent_area_id=")) {
    console.log("检测到直播间加载了分区下的房间列表");
    liveSectionModel.startShieldingLiveRoom();
  }
  if (url.startsWith("https://api.bilibili.com/x/web-interface/ranking/region?day=")) {
    console.log("检测到专区热门排行榜加载了");
    partition.startShieldingHotVideoDayList();
  }
  if (searchModel.isSearchVideoNetWorkUrl(url) || searchModel.isSearchLiveRoomNetWorkUrl(url)) {
    eventEmitter.send("通知屏蔽");
  }
  if (url.includes("api.bilibili.com/x/polymer/web-dynamic/v1/feed/all")) {
    console.log("动态首页api加载了");
    dynamicPage.debounceCheckDynamicList();
  }
  if (url.includes("api.live.bilibili.com/xlive/web-interface/v1/second/getListByArea") || url.includes("api.live.bilibili.com/xlive/web-interface/v1/second/getUserRecommend")) {
    allLivePage.checkLiveList();
  }
  if (url.includes("api.bilibili.com/x/v2/reply/reply?callback") || url.includes("api.bilibili.com/x/v2/reply?callback")) {
    console.log("直播页排行榜地下的评论列表加载了");
    commentSectionModel.checkLiveRankingsCommentSectionList();
  }
};
var observeNetwork$1 = {
  observeNetwork
};const generalUrl = [
  "popular/rank/all",
  "popular/rank/douga",
  "popular/rank/music",
  "popular/rank/dance",
  "popular/rank/game",
  "popular/rank/knowledge",
  "popular/rank/tech",
  "popular/rank/sports",
  "popular/rank/car",
  "popular/rank/life",
  "popular/rank/food",
  "popular/rank/animal",
  "popular/rank/kichiku",
  "popular/rank/fashion",
  "popular/rank/ent",
  "popular/rank/cinephile",
  "popular/rank/origin",
  "popular/rank/rookie"
];
const isPopularHistory = (url) => {
  return url.includes("popular/history");
};
const isPopularAllPage = (url) => {
  return url.includes("www.bilibili.com/v/popular/all");
};
const isPopularWeeklyPage = (url) => {
  return url.includes("www.bilibili.com/v/popular/weekly");
};
const isGeneralPopularRank = (url) => {
  return generalUrl.some((itemUrl) => url.includes(itemUrl));
};
const getVideoDataList$1 = async () => {
  const elList = await elUtil.findElements(".rank-list>li");
  const list = [];
  for (let el of elList) {
    const title = el.querySelector(".title").textContent.trim();
    const userUrl = el.querySelector(".detail>a").href;
    const uid = elUtil.getUrlUID(userUrl);
    const name = el.querySelector(".up-name").textContent.trim();
    const detailStateEls = el.querySelectorAll(".detail-state>.data-box");
    let nPlayCount = detailStateEls[0].textContent.trim();
    nPlayCount = sFormatUtil.toPlayCountOrBulletChat(nPlayCount);
    let nBulletChat = detailStateEls[1].textContent.trim();
    nBulletChat = sFormatUtil.toPlayCountOrBulletChat(nBulletChat);
    const videoUrl = el.querySelector(".img>a")?.href || null;
    const bv = elUtil.getUrlBV(videoUrl);
    const data = {
      title,
      userUrl,
      uid,
      name,
      videoUrl,
      bv,
      nPlayCount,
      nBulletChat,
      nDuration: -1,
      el,
      insertionPositionEl: el.querySelector(".detail-state"),
      explicitSubjectEl: el.querySelector(".info")
    };
    const otherVideosSelectEl = el.querySelector(".more-data.van-popover__reference");
    if (otherVideosSelectEl) {
      data.cssMap = { "bottom": "44px" };
    }
    list.push(data);
  }
  return list;
};
const startShieldingRankVideoList = async () => {
  const list = await getVideoDataList$1();
  for (let videoData of list) {
    video_shielding.shieldingVideoDecorated(videoData).catch(() => {
      eventEmitter.send("添加热门视频屏蔽按钮", { data: videoData, maskingFunc: startShieldingRankVideoList });
    });
  }
};
var popular = {
  isPopularHistory,
  isPopularAllPage,
  isGeneralPopularRank,
  isPopularWeeklyPage,
  startShieldingRankVideoList
};const isOldHistory = (url) => {
  return url.includes("https://www.bilibili.com/account/history");
};
const getVideoDataList = async () => {
  const elList = await elUtil.findElements("#history_list>.history-record");
  const list = [];
  for (let el of elList) {
    const labelEL = el.querySelector(".cover-contain>.label");
    if (labelEL !== null) {
      const label = labelEL.textContent.trim();
      console.log(`排除${label}`);
      continue;
    }
    const titleEl = el.querySelector(".title");
    const userEl = el.querySelector(".w-info>span>a");
    const title = titleEl.textContent.trim();
    const videoUrl = titleEl.href;
    const bv = elUtil.getUrlBV(videoUrl);
    const name = userEl.textContent.trim();
    const userUrl = userEl.href;
    const uid = elUtil.getUrlUID(userUrl);
    list.push({
      title,
      videoUrl,
      name,
      userUrl,
      uid,
      el,
      bv,
      explicitSubjectEl: el.querySelector(".r-txt"),
      insertionPositionEl: el.querySelector(".subtitle")
    });
  }
  return list;
};
const startShieldingVideo = async () => {
  console.log("开始屏蔽旧版历史记录视频列表");
  const list = await getVideoDataList();
  const css = { right: "45px" };
  for (let videoData of list) {
    video_shielding.shieldingVideoDecorated(videoData).catch(() => {
      videoData.cssMap = css;
      eventEmitter.send("视频添加屏蔽按钮", { data: videoData, maskingFunc: startShieldingVideo });
    });
  }
  console.log("屏蔽旧版历史记录视频列表完成");
};
const intervalExecutionStartShieldingVideo = () => {
  setInterval(startShieldingVideo, 2e3);
};
var oldHistory = {
  isOldHistory,
  intervalExecutionStartShieldingVideo
};eventEmitter.on("通知屏蔽", () => {
  const url = window.location.href;
  const title = document.title;
  if (globalValue.bOnlyTheHomepageIsBlocked) return;
  if (searchLive.isSearchLivePage(url)) {
    searchLive.startShieldingLiveRoomList();
  }
  if (searchModel.isSearch(url)) {
    searchModel.startShieldingVideoList();
  }
  if (bilibiliHome.isHome(url, title)) {
    if (globalValue.compatibleBEWLYBEWLY) return;
    if (globalValue.adaptationBAppCommerce) {
      BLBLGate.startIntervalShieldingGateVideoList();
    }
    bilibiliHome.startDebounceShieldingHomeVideoList();
  }
  if (videoPlayModel.isVideoPlayPage(url)) {
    videoPlayModel.startShieldingVideoList();
  }
  if (collectionVideoPlayPageModel.iscCollectionVideoPlayPage(url)) {
    collectionVideoPlayPageModel.startShieldingVideoList();
  }
  if (videoPlayWatchLater.isVideoPlayWatchLaterPage(url)) {
    videoPlayWatchLater.startDebounceShieldingVideoList();
  }
  if (popular.isPopularAllPage(url) || popular.isPopularHistory(url)) {
    popularAll.startShieldingVideoList();
  }
  if (popular.isPopularWeeklyPage(url)) {
    popularAll.startShieldingVideoList(true);
  }
  if (popular.isGeneralPopularRank(url)) {
    popular.startShieldingRankVideoList();
  }
  if (topicDetail.isTopicDetailPage(url)) {
    topicDetail.startShielding();
  }
  if (space.isUserSpaceDynamicPage(url)) {
    space.checkUserSpaceShieldingDynamicContentThrottle();
  }
  if (liveSectionModel.isLiveSection()) {
    liveSectionModel.startShieldingLiveRoom();
  }
  if (liveHome.isLiveHomePage(url)) {
    liveHome.startShieldingLiveRoom();
  }
  if (oldHistory.isOldHistory(url)) {
    oldHistory.intervalExecutionStartShieldingVideo();
  }
  if (partition.isPartition(url) || partition.isNewPartition(url)) {
    partition.startIntervalShieldingVideoList();
  }
  if (dynamicPage.isUrlDynamicHomePage()) {
    dynamicPage.debounceCheckDynamicList();
  }
});const replaceKeywords = (arr, actionScope, content) => {
  if (arr.length === 0 || !enableReplacementProcessing()) return returnTempVal;
  for (const v of arr) {
    if (!content.includes(v.findVal)) continue;
    if (!v.actionScopes.some((aItem) => aItem === actionScope)) continue;
    return {
      state: true,
      content: content.replaceAll(v.findVal, v.replaceVal)
    };
  }
  return returnTempVal;
};
const replaceEmoticons = (arr, el, alt) => {
  if (arr.length === 0 || !enableReplacementProcessing()) return returnTempVal;
  for (const v of arr) {
    if (!v.actionScopes.some((aItem) => aItem === "评论表情")) continue;
    if (v.findVal !== alt) continue;
    if (v.replaceVal === "") {
      el?.remove();
      return { state: true, model: "del", content: alt };
    }
    return {
      state: true,
      model: "subStr",
      content: v.replaceVal
    };
  }
  return returnTempVal;
};
eventEmitter.on("event-评论通知替换关键词", (commentsData) => {
  const { contentsEl, name, uid } = commentsData;
  if (!contentsEl) return;
  const spanEls = contentsEl.querySelectorAll("span");
  const imgEls = contentsEl.querySelectorAll("img");
  const aEls = contentsEl.querySelectorAll("a");
  const substituteWordsArr = getSubstituteWordsArr();
  if (isClearCommentEmoticons()) {
    for (let imgEl of imgEls) {
      imgEl?.remove();
      eventEmitter.send("打印信息", `已清除${name}的评论中的表情`);
    }
  } else {
    for (let imgEl of imgEls) {
      if (imgEl.getAttribute("replace") !== null) continue;
      const alt = imgEl.getAttribute("alt");
      imgEl.setAttribute("replace", "");
      if (alt === null) continue;
      imgEl.setAttribute("title", alt);
      const { state, model, content } = replaceEmoticons(substituteWordsArr, imgEl, alt);
      if (!state) continue;
      if (model === "del") {
        eventEmitter.send("打印信息", `已清除用户${name}的评论中的表情`);
        continue;
      }
      if (model === "subStr") {
        imgEl.outerHTML = `<span replace>${content}</span>`;
        eventEmitter.send("打印信息", `已替换用户${name}的评论中的表情:`);
      }
    }
  }
  if (isReplaceCommentSearchTerms()) {
    for (let aEl of aEls) {
      const text = aEl.textContent;
      aEl.outerHTML = `<span replace>${text}</span>`;
      eventEmitter.send("打印信息", `已替换用户${name}的评论中的搜索跳转关键词:`);
    }
  }
  for (let spanEl of spanEls) {
    if (spanEl.getAttribute("replace") !== null) continue;
    const elContent = spanEl.textContent;
    const { state, content } = replaceKeywords(substituteWordsArr, "评论内容", elContent);
    if (!state) continue;
    spanEl.textContent = content;
    spanEl.setAttribute("replace", "");
    eventEmitter.send("打印信息", `已替换用户${name}的评论内容:原
${elContent}现
${content}`);
  }
});window.addEventListener("load", () => {
  console.log("页面加载完成");
  router.staticRoute(document.title, window.location.href);
  watch.addEventListenerUrlChange((newUrl, oldUrl, title) => {
    router.dynamicRouting(title, newUrl);
  });
});
watch.addEventListenerNetwork((url, windowUrl, winTitle, initiatorType) => {
  observeNetwork$1.observeNetwork(url, windowUrl, winTitle, initiatorType);
});})(Vue,Dexie);