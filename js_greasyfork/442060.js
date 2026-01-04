// ==UserScript==
// @name         水源助手
// @namespace    https://shuiyuan.sjtu.edu.cn/u/bluecat/summary
// @version      1.10.1
// @description  对上海交通大学水源论坛的各项功能进行优化
// @author       bluecat, CCCC_David, pangbo
// @match        https://shuiyuan.sjtu.edu.cn/*
// @grant        none
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/429382/%E6%B0%B4%E6%BA%90%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/429382/%E6%B0%B4%E6%BA%90%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    // From Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com
    // License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2023 Fonticons, Inc.
    // Modified class attribute to fit in.
    const EXPAND_RETORT_USERS_ICON = /* solid circle-chevron-down */ '<svg class="d-icon svg-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM135 241c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l87 87 87-87c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9L273 345c-9.4 9.4-24.6 9.4-33.9 0L135 241z"/></svg>';
    const COLLAPSE_RETORT_USERS_ICON = /* solid circle-chevron-up */ '<svg class="d-icon svg-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM377 271c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-87-87-87 87c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9L239 167c9.4-9.4 24.6-9.4 33.9 0L377 271z"/></svg>';
    const INSPECT_TOPIC_ICON = /* solid magnifying-glass */ '<svg class="d-icon svg-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>';
    const CODE_ICON = /* solid code */ '<svg class="d-icon svg-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z"/></svg>';
    const CLOSE_ICON = /* solid xmark */ '<svg class="d-icon svg-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>';
    const SETTINGS_ICON = /* solid gear */ '<svg class="d-icon svg-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/></svg>';
    const EXTENSION_ICON = /* solid puzzle-piece */ '<svg class="d-icon svg-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M192 104.8c0-9.2-5.8-17.3-13.2-22.8C167.2 73.3 160 61.3 160 48c0-26.5 28.7-48 64-48s64 21.5 64 48c0 13.3-7.2 25.3-18.8 34c-7.4 5.5-13.2 13.6-13.2 22.8v0c0 12.8 10.4 23.2 23.2 23.2H336c26.5 0 48 21.5 48 48v56.8c0 12.8 10.4 23.2 23.2 23.2v0c9.2 0 17.3-5.8 22.8-13.2c8.7-11.6 20.7-18.8 34-18.8c26.5 0 48 28.7 48 64s-21.5 64-48 64c-13.3 0-25.3-7.2-34-18.8c-5.5-7.4-13.6-13.2-22.8-13.2v0c-12.8 0-23.2 10.4-23.2 23.2V464c0 26.5-21.5 48-48 48H279.2c-12.8 0-23.2-10.4-23.2-23.2v0c0-9.2 5.8-17.3 13.2-22.8c11.6-8.7 18.8-20.7 18.8-34c0-26.5-28.7-48-64-48s-64 21.5-64 48c0 13.3 7.2 25.3 18.8 34c7.4 5.5 13.2 13.6 13.2 22.8v0c0 12.8-10.4 23.2-23.2 23.2H48c-26.5 0-48-21.5-48-48V343.2C0 330.4 10.4 320 23.2 320v0c9.2 0 17.3 5.8 22.8 13.2C54.7 344.8 66.7 352 80 352c26.5 0 48-28.7 48-64s-21.5-64-48-64c-13.3 0-25.3 7.2-34 18.8C40.5 250.2 32.4 256 23.2 256v0C10.4 256 0 245.6 0 232.8V176c0-26.5 21.5-48 48-48H168.8c12.8 0 23.2-10.4 23.2-23.2v0z"/></svg>';
    const RELOAD_ICON = /* solid rotate-right */ '<svg class="d-icon svg-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M463.5 224H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5z"/></svg>';
    const DOWNLOAD_ICON = /* solid download */ '<svg class="d-icon svg-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/></svg>';
    const COPY_ICON = /* regular copy */ '<svg class="d-icon svg-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M448 384H256c-35.3 0-64-28.7-64-64V64c0-35.3 28.7-64 64-64H396.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V320c0 35.3-28.7 64-64 64zM64 128h96v48H64c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H256c8.8 0 16-7.2 16-16V416h48v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V192c0-35.3 28.7-64 64-64z"/></svg>';
    const UPLOAD_ICON = /* solid upload */ '<svg class="d-icon svg-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/></svg>';
    const PASTE_ICON = /* regular paste */ '<svg class="d-icon svg-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M104.6 48H64C28.7 48 0 76.7 0 112V384c0 35.3 28.7 64 64 64h96V400H64c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H80c0 17.7 14.3 32 32 32h72.4C202 108.4 227.6 96 256 96h62c-7.1-27.6-32.2-48-62-48H215.4C211.6 20.9 188.2 0 160 0s-51.6 20.9-55.4 48zM144 56a16 16 0 1 1 32 0 16 16 0 1 1 -32 0zM448 464H256c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16l140.1 0L464 243.9V448c0 8.8-7.2 16-16 16zM256 512H448c35.3 0 64-28.7 64-64V243.9c0-12.7-5.1-24.9-14.1-33.9l-67.9-67.9c-9-9-21.2-14.1-33.9-14.1H256c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64z"/></svg>';
    const DELETE_ICON = /* regular trash-can */ '<svg class="d-icon svg-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z"/></svg>';

    // Script parameters.
    const LOCAL_STORAGE_CONFIG_KEY = 'shuiyuanHelperConfig';
    const SETTINGS_VIEW_FRAGMENT = '#shuiyuan_helper';
    const HOOK_MAX_LEVELS = 1024;
    const FETCH_MAX_RETRIES = 15;
    const FETCH_ITEMS_PER_PAGE = 50;
    const EXP_BACKOFF_START = 1;
    const EXP_BACKOFF_BASE = 1.2;
    const RETORT_FETCH_INTERVAL = 300;
    const RETORT_FETCH_MAX_ENTRIES = 20;
    const INPUT_DEBOUNCE_INTERVAL = 300;
    const MESSAGE_DISAPPEAR_TIMEOUT = 3000;
    const POST_VIOLATION_ANNOUNCEMENT_TOPIC_ID = 12737;
    const USER_VIOLATION_ANNOUNCEMENT_TOPIC_ID = 2105;
    const UPDATE_ONLINE_USER_COUNT_INTERVAL = 60000;

    // Environment.
    if (window.shuiyuanHelperLoaded) {
        // eslint-disable-next-line no-console
        console.log('Skipped loading Shuiyuan Helper as it has already been loaded.');
        return;
    }
    window.shuiyuanHelperLoaded = true;
    const shuiyuanHelperMemory = new Map(); // Hold in-memory data per each Shuiyuan Helper instance (i.e. each page).
    const IS_DESKTOP_VIEW = document.documentElement.classList.contains('desktop-view');
    const IS_MOBILE_VIEW = document.documentElement.classList.contains('mobile-view');
    const IS_DISCOURSE_VIEW = IS_DESKTOP_VIEW || IS_MOBILE_VIEW;
    const IS_MOBILE_DEVICE = document.documentElement.classList.contains('mobile-device');
    const isNoTouchDevice = () => document.documentElement.classList.contains('discourse-no-touch');
    const IS_FIREFOX = navigator.userAgent.toLowerCase().includes('firefox') || typeof InstallTrigger !== 'undefined';
    const isObject = (x) => typeof x === 'object' && !Array.isArray(x) && x !== null;
    const saveConfig = (config) => localStorage.setItem(LOCAL_STORAGE_CONFIG_KEY, JSON.stringify(config));
    const loadConfig = () => {
        let config = null;
        try {
            config = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CONFIG_KEY) ?? '{}');
        } catch {
        }
        if (isObject(config)) {
            return config;
        }
        saveConfig({});
        return {};
    };
    let dataPreloaded = null;
    const getDataPreloaded = () => {
        if (dataPreloaded) {
            return dataPreloaded;
        }
        dataPreloaded = JSON.parse(document.getElementById('data-preloaded').getAttribute('data-preloaded'));
        return dataPreloaded;
    };
    const getSite = () => JSON.parse(getDataPreloaded().site);
    const getSiteSettings = () => JSON.parse(getDataPreloaded().siteSettings);
    const getCustomEmoji = () => JSON.parse(getDataPreloaded().customEmoji);
    const getCurrentUser = () => JSON.parse(getDataPreloaded().currentUser);
    const getCurrentUsername = () => getCurrentUser().username;
    let retortLib = null;
    const getRetortLib = () => {
        if (retortLib) {
            return retortLib;
        }
        try {
            retortLib = window.require('discourse/plugins/retort/discourse/lib/retort').default;
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
        }
        return retortLib;
    };
    let retortToggleWidgetClass = null;
    const getRetortToggleWidgetClass = () => {
        if (retortToggleWidgetClass) {
            return retortToggleWidgetClass;
        }
        try {
            retortToggleWidgetClass = window.require('discourse/plugins/retort/discourse/widgets/retort-toggle').default;
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
        }
        return retortToggleWidgetClass;
    };
    let emojiInfo = null;
    const getEmojiInfo = () => {
        if (emojiInfo) {
            return emojiInfo;
        }
        emojiInfo = {};
        try {
            const statements = window.require('@ember/component').getComponentTemplate(window.require('discourse/components/emoji-group-sections').default)().parsedLayout.block[0];
            const i18n = window.require('I18n');
            const result = [];
            let lastSection = null;
            let lastSectionEmojis = [];
            const insertLastSection = () => {
                if (lastSection === null) {
                    return;
                }
                result.push({
                    section: lastSection,
                    emojis: lastSectionEmojis,
                });
                lastSectionEmojis = [];
            };
            for (const statement of statements) {
                const st1 = statement[1];
                if (!Array.isArray(st1) || !Array.isArray(st1[1])) {
                    continue;
                }
                switch (st1[1][1]) {
                    case 0:
                        // New section.
                        insertLastSection();
                        lastSection = i18n.t(st1[2][0]);
                        break;
                    case 1:
                        // New emoji.
                        lastSectionEmojis.push(st1[2][0].slice(1, -1));
                        break;
                }
            }
            insertLastSection();
            emojiInfo.standardEmojis = result;
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            // eslint-disable-next-line no-console
            console.warn('Could not parse all standard emojis from source, falling back to built-in emojis.');
            // cSpell: disable
            emojiInfo.standardEmojis = [
                {
                    section: '笑脸与情感',
                    emojis: ['grinning', 'smiley', 'smile', 'grin', 'laughing', 'sweat_smile', 'rofl', 'joy', 'slightly_smiling_face', 'upside_down_face', 'melting_face', 'wink', 'blush', 'innocent', 'smiling_face_with_three_hearts', 'heart_eyes', 'star_struck', 'kissing_heart', 'kissing', 'smiling_face', 'kissing_closed_eyes', 'kissing_smiling_eyes', 'smiling_face_with_tear', 'yum', 'stuck_out_tongue', 'stuck_out_tongue_winking_eye', 'crazy_face', 'stuck_out_tongue_closed_eyes', 'money_mouth_face', 'hugs', 'face_with_hand_over_mouth', 'face_with_open_eyes_and_hand_over_mouth', 'face_with_peeking_eye', 'shushing_face', 'thinking', 'saluting_face', 'zipper_mouth_face', 'face_with_raised_eyebrow', 'neutral_face', 'expressionless', 'no_mouth', 'dotted_line_face', 'face_in_clouds', 'smirk', 'unamused', 'roll_eyes', 'grimacing', 'face_exhaling', 'lying_face', 'relieved', 'pensive', 'sleepy', 'drooling_face', 'sleeping', 'mask', 'face_with_thermometer', 'face_with_head_bandage', 'nauseated_face', 'face_vomiting', 'sneezing_face', 'hot_face', 'cold_face', 'woozy_face', 'dizzy_face', 'face_with_spiral_eyes', 'exploding_head', 'cowboy_hat_face', 'partying_face', 'disguised_face', 'sunglasses', 'nerd_face', 'face_with_monocle', 'confused', 'face_with_diagonal_mouth', 'worried', 'slightly_frowning_face', 'frowning_face', 'open_mouth', 'hushed', 'astonished', 'flushed', 'pleading_face', 'face_holding_back_tears', 'frowning_with_open_mouth', 'anguished', 'fearful', 'cold_sweat', 'disappointed_relieved', 'cry', 'sob', 'scream', 'confounded', 'persevere', 'disappointed', 'sweat', 'weary', 'tired_face', 'yawning_face', 'triumph', 'rage', 'angry', 'face_with_symbols_over_mouth', 'smiling_imp', 'imp', 'skull', 'skull_and_crossbones', 'poop', 'clown_face', 'japanese_ogre', 'japanese_goblin', 'ghost', 'alien', 'space_invader', 'robot', 'smiley_cat', 'smile_cat', 'joy_cat', 'heart_eyes_cat', 'smirk_cat', 'kissing_cat', 'scream_cat', 'crying_cat_face', 'pouting_cat', 'see_no_evil', 'hear_no_evil', 'speak_no_evil', 'kiss', 'love_letter', 'cupid', 'gift_heart', 'sparkling_heart', 'heartpulse', 'heartbeat', 'revolving_hearts', 'two_hearts', 'heart_decoration', 'heavy_heart_exclamation', 'broken_heart', 'heart_on_fire', 'mending_heart', 'heart', 'orange_heart', 'yellow_heart', 'green_heart', 'blue_heart', 'purple_heart', 'brown_heart', 'black_heart', 'white_heart', '100', 'anger', 'boom', 'dizzy', 'sweat_drops', 'dash', 'hole', 'bomb', 'speech_balloon', 'eye_in_speech_bubble', 'left_speech_bubble', 'right_anger_bubble', 'thought_balloon', 'zzz'],
                },
                {
                    section: '人与身体',
                    emojis: ['wave', 'raised_back_of_hand', 'raised_hand_with_fingers_splayed', 'raised_hand', 'vulcan_salute', 'rightwards_hand', 'leftwards_hand', 'palm_down_hand', 'palm_up_hand', 'ok_hand', 'pinched_fingers', 'pinching_hand', 'v', 'crossed_fingers', 'hand_with_index_finger_and_thumb_crossed', 'love_you_gesture', 'metal', 'call_me_hand', 'point_left', 'point_right', 'point_up_2', 'fu', 'point_down', 'point_up', 'index_pointing_at_the_viewer', '+1', '-1', 'fist', 'facepunch', 'fist_left', 'fist_right', 'clap', 'raised_hands', 'heart_hands', 'open_hands', 'palms_up_together', 'handshake', 'pray', 'writing_hand', 'nail_care', 'selfie', 'muscle', 'mechanical_arm', 'mechanical_leg', 'leg', 'foot', 'ear', 'hear_with_hearing_aid', 'nose', 'brain', 'anatomical_heart', 'lungs', 'tooth', 'bone', 'eyes', 'eye', 'tongue', 'lips', 'biting_lip', 'baby', 'child', 'boy', 'girl', 'adult', 'blonde_man', 'man', 'bearded_person', 'man_beard', 'woman_beard', 'man_red_haired', 'man_curly_haired', 'man_white_haired', 'man_bald', 'woman', 'woman_red_haired', 'person_red_hair', 'woman_curly_haired', 'person_curly_hair', 'woman_white_haired', 'person_white_hair', 'woman_bald', 'person_bald', 'blonde_woman', 'man_blond_hair', 'older_adult', 'older_man', 'older_woman', 'person_frowning', 'frowning_man', 'frowning_woman', 'person_pouting', 'pouting_man', 'pouting_woman', 'person_gesturing_no', 'no_good_man', 'no_good_woman', 'person_gesturing_ok', 'ok_man', 'ok_woman', 'person_tipping_hand', 'tipping_hand_man', 'tipping_hand_woman', 'person_raising_hand', 'raising_hand_man', 'raising_hand_woman', 'deaf_person', 'deaf_man', 'deaf_woman', 'bowing_man', 'man_bowing', 'bowing_woman', 'person_facepalming', 'man_facepalming', 'woman_facepalming', 'person_shrugging', 'man_shrugging', 'woman_shrugging', 'health_worker', 'man_health_worker', 'woman_health_worker', 'student', 'man_student', 'woman_student', 'teacher', 'man_teacher', 'woman_teacher', 'judge', 'man_judge', 'woman_judge', 'farmer', 'man_farmer', 'woman_farmer', 'cook', 'man_cook', 'woman_cook', 'mechanic', 'man_mechanic', 'woman_mechanic', 'factory_worker', 'man_factory_worker', 'woman_factory_worker', 'office_worker', 'man_office_worker', 'woman_office_worker', 'scientist', 'man_scientist', 'woman_scientist', 'technologist', 'man_technologist', 'woman_technologist', 'singer', 'man_singer', 'woman_singer', 'artist', 'man_artist', 'woman_artist', 'pilot', 'man_pilot', 'woman_pilot', 'astronaut', 'man_astronaut', 'woman_astronaut', 'firefighter', 'man_firefighter', 'woman_firefighter', 'policeman', 'man_police_officer', 'policewoman', 'male_detective', 'man_detective', 'female_detective', 'guardsman', 'man_guard', 'guardswoman', 'ninja', 'construction_worker_man', 'man_construction_worker', 'construction_worker_woman', 'person_with_crown', 'prince', 'princess', 'man_with_turban', 'man_wearing_turban', 'woman_with_turban', 'man_with_gua_pi_mao', 'woman_with_headscarf', 'person_in_tuxedo', 'man_in_tuxedo', 'woman_in_tuxedo', 'bride_with_veil', 'man_with_veil', 'woman_with_veil', 'pregnant_woman', 'pregnant_man', 'pregnant_person', 'breast_feeding', 'woman_feeding_baby', 'man_feeding_baby', 'person_feeding_baby', 'angel', 'santa', 'mrs_claus', 'mx_claus', 'superhero', 'man_superhero', 'woman_superhero', 'supervillain', 'man_supervillain', 'woman_supervillain', 'mage', 'man_mage', 'woman_mage', 'fairy', 'man_fairy', 'woman_fairy', 'vampire', 'man_vampire', 'woman_vampire', 'merperson', 'merman', 'mermaid', 'elf', 'man_elf', 'woman_elf', 'genie', 'man_genie', 'woman_genie', 'zombie', 'man_zombie', 'woman_zombie', 'troll', 'person_getting_massage', 'massage_man', 'massage_woman', 'person_getting_haircut', 'haircut_man', 'haircut_woman', 'walking_man', 'man_walking', 'walking_woman', 'person_standing', 'man_standing', 'woman_standing', 'person_kneeling', 'man_kneeling', 'woman_kneeling', 'person_with_white_cane', 'man_with_probing_cane', 'woman_with_probing_cane', 'person_in_motorized_wheelchair', 'man_in_motorized_wheelchair', 'woman_in_motorized_wheelchair', 'person_in_manual_wheelchair', 'man_in_manual_wheelchair', 'woman_in_manual_wheelchair', 'running_man', 'man_running', 'running_woman', 'dancer', 'man_dancing', 'business_suit_levitating', 'dancing_women', 'dancing_men', 'women_with_bunny_ears', 'person_in_steamy_room', 'man_in_steamy_room', 'woman_in_steamy_room', 'person_climbing', 'man_climbing', 'woman_climbing', 'person_fencing', 'horse_racing', 'skier', 'snowboarder', 'golfing_man', 'man_golfing', 'golfing_woman', 'surfing_man', 'man_surfing', 'surfing_woman', 'rowing_man', 'man_rowing_boat', 'rowing_woman', 'swimming_man', 'man_swimming', 'swimming_woman', 'basketball_man', 'man_bouncing_ball', 'basketball_woman', 'weight_lifting_man', 'man_lifting_weights', 'weight_lifting_woman', 'biking_man', 'man_biking', 'biking_woman', 'mountain_biking_man', 'man_mountain_biking', 'mountain_biking_woman', 'person_cartwheeling', 'man_cartwheeling', 'woman_cartwheeling', 'people_wrestling', 'men_wrestling', 'women_wrestling', 'person_playing_water_polo', 'man_playing_water_polo', 'woman_playing_water_polo', 'person_playing_handball', 'man_playing_handball', 'woman_playing_handball', 'person_juggling', 'man_juggling', 'woman_juggling', 'person_in_lotus_position', 'man_in_lotus_position', 'woman_in_lotus_position', 'bath', 'sleeping_bed', 'people_holding_hands', 'two_women_holding_hands', 'couple', 'two_men_holding_hands', 'couplekiss_man_woman', 'kiss_woman_man', 'couplekiss_man_man', 'couplekiss_woman_woman', 'couple_with_heart', 'couple_with_heart_woman_man', 'couple_with_heart_man_man', 'couple_with_heart_woman_woman', 'family', 'family_man_woman_boy', 'family_man_woman_girl', 'family_man_woman_girl_boy', 'family_man_woman_boy_boy', 'family_man_woman_girl_girl', 'family_man_man_boy', 'family_man_man_girl', 'family_man_man_girl_boy', 'family_man_man_boy_boy', 'family_man_man_girl_girl', 'family_woman_woman_boy', 'family_woman_woman_girl', 'family_woman_woman_girl_boy', 'family_woman_woman_boy_boy', 'family_woman_woman_girl_girl', 'family_man_boy', 'family_man_boy_boy', 'family_man_girl', 'family_man_girl_boy', 'family_man_girl_girl', 'family_woman_boy', 'family_woman_boy_boy', 'family_woman_girl', 'family_woman_girl_boy', 'family_woman_girl_girl', 'speaking_head', 'bust_in_silhouette', 'busts_in_silhouette', 'people_hugging', 'footprints'],
                },
                {
                    section: '动物与自然',
                    emojis: ['monkey_face', 'monkey', 'gorilla', 'orangutan', 'dog', 'dog2', 'guide_dog', 'service_dog', 'poodle', 'wolf', 'fox_face', 'raccoon', 'cat', 'cat2', 'black_cat', 'lion', 'tiger', 'tiger2', 'leopard', 'horse', 'racehorse', 'unicorn', 'zebra', 'deer', 'bison', 'cow', 'ox', 'water_buffalo', 'cow2', 'pig', 'pig2', 'boar', 'pig_nose', 'ram', 'sheep', 'goat', 'dromedary_camel', 'camel', 'llama', 'giraffe', 'elephant', 'mammoth', 'rhinoceros', 'hippopotamus', 'mouse', 'mouse2', 'rat', 'hamster', 'rabbit', 'rabbit2', 'chipmunk', 'beaver', 'hedgehog', 'bat', 'bear', 'polar_bear', 'koala', 'panda_face', 'sloth', 'otter', 'skunk', 'kangaroo', 'badger', 'paw_prints', 'turkey', 'chicken', 'rooster', 'hatching_chick', 'baby_chick', 'hatched_chick', 'bird', 'penguin', 'dove', 'eagle', 'duck', 'swan', 'owl', 'dodo', 'feather', 'flamingo', 'peacock', 'parrot', 'frog', 'crocodile', 'turtle', 'lizard', 'snake', 'dragon_face', 'dragon', 'sauropod', 't_rex', 'whale', 'whale2', 'dolphin', 'seal', 'fish', 'tropical_fish', 'blowfish', 'shark', 'octopus', 'shell', 'coral', 'snail', 'butterfly', 'bug', 'ant', 'honeybee', 'beetle', 'lady_beetle', 'cricket', 'cockroach', 'spider', 'spider_web', 'scorpion', 'mosquito', 'fly', 'worm', 'microbe', 'bouquet', 'cherry_blossom', 'white_flower', 'lotus', 'rosette', 'rose', 'wilted_flower', 'hibiscus', 'sunflower', 'blossom', 'tulip', 'seedling', 'potted_plant', 'evergreen_tree', 'deciduous_tree', 'palm_tree', 'cactus', 'ear_of_rice', 'herb', 'shamrock', 'four_leaf_clover', 'maple_leaf', 'fallen_leaf', 'leaves', 'empty_nest', 'nest_with_eggs'],
                },
                {
                    section: '食物和饮料',
                    emojis: ['grapes', 'melon', 'watermelon', 'tangerine', 'lemon', 'banana', 'pineapple', 'mango', 'apple', 'green_apple', 'pear', 'peach', 'cherries', 'strawberry', 'blueberries', 'kiwi_fruit', 'tomato', 'olive', 'coconut', 'avocado', 'eggplant', 'potato', 'carrot', 'corn', 'hot_pepper', 'bell_pepper', 'cucumber', 'leafy_green', 'broccoli', 'garlic', 'onion', 'mushroom', 'peanuts', 'beans', 'chestnut', 'bread', 'croissant', 'baguette_bread', 'flatbread', 'pretzel', 'bagel', 'pancakes', 'waffle', 'cheese', 'meat_on_bone', 'poultry_leg', 'cut_of_meat', 'bacon', 'hamburger', 'fries', 'pizza', 'hotdog', 'sandwich', 'taco', 'burrito', 'tamale', 'stuffed_flatbread', 'falafel', 'egg', 'fried_egg', 'shallow_pan_of_food', 'stew', 'fondue', 'bowl_with_spoon', 'green_salad', 'popcorn', 'butter', 'salt', 'canned_food', 'bento', 'rice_cracker', 'rice_ball', 'rice', 'curry', 'ramen', 'spaghetti', 'sweet_potato', 'oden', 'sushi', 'fried_shrimp', 'fish_cake', 'moon_cake', 'dango', 'dumpling', 'fortune_cookie', 'takeout_box', 'crab', 'lobster', 'shrimp', 'squid', 'oyster', 'icecream', 'shaved_ice', 'ice_cream', 'doughnut', 'cookie', 'birthday', 'cake', 'cupcake', 'pie', 'chocolate_bar', 'candy', 'lollipop', 'custard', 'honey_pot', 'baby_bottle', 'milk_glass', 'coffee', 'teapot', 'tea', 'sake', 'champagne', 'wine_glass', 'cocktail', 'tropical_drink', 'beer', 'beers', 'clinking_glasses', 'tumbler_glass', 'pouring_liquid', 'cup_with_straw', 'bubble_tea', 'beverage_box', 'maté', 'ice_cube', 'chopsticks', 'plate_with_cutlery', 'fork_and_knife', 'spoon', 'hocho', 'jar', 'amphora'],
                },
                {
                    section: '旅行与地点',
                    emojis: ['earth_africa', 'earth_americas', 'earth_asia', 'globe_with_meridians', 'world_map', 'japan', 'compass', 'mountain_snow', 'mountain', 'volcano', 'mount_fuji', 'camping', 'beach_umbrella', 'desert', 'desert_island', 'national_park', 'stadium', 'classical_building', 'building_construction', 'brick', 'rock', 'wood', 'hut', 'houses', 'derelict_house', 'house', 'house_with_garden', 'office', 'post_office', 'european_post_office', 'hospital', 'bank', 'hotel', 'love_hotel', 'convenience_store', 'school', 'department_store', 'factory', 'japanese_castle', 'european_castle', 'wedding', 'tokyo_tower', 'statue_of_liberty', 'church', 'mosque', 'hindu_temple', 'synagogue', 'shinto_shrine', 'kaaba', 'fountain', 'tent', 'foggy', 'night_with_stars', 'cityscape', 'sunrise_over_mountains', 'sunrise', 'city_sunset', 'city_sunrise', 'bridge_at_night', 'hotsprings', 'carousel_horse', 'playground_slide', 'ferris_wheel', 'roller_coaster', 'barber', 'circus_tent', 'steam_locomotive', 'railway_car', 'bullettrain_side', 'bullettrain_front', 'train2', 'metro', 'light_rail', 'station', 'tram', 'monorail', 'mountain_railway', 'train', 'bus', 'oncoming_bus', 'trolleybus', 'minibus', 'ambulance', 'fire_engine', 'police_car', 'oncoming_police_car', 'taxi', 'oncoming_taxi', 'red_car', 'oncoming_automobile', 'blue_car', 'pickup_truck', 'truck', 'articulated_lorry', 'tractor', 'racing_car', 'motorcycle', 'motor_scooter', 'manual_wheelchair', 'motorized_wheelchair', 'auto_rickshaw', 'bike', 'kick_scooter', 'skateboard', 'roller_skate', 'busstop', 'motorway', 'railway_track', 'oil_drum', 'fuelpump', 'wheel', 'rotating_light', 'traffic_light', 'vertical_traffic_light', 'stop_sign', 'construction', 'anchor', 'ring_buoy', 'sailboat', 'canoe', 'speedboat', 'passenger_ship', 'ferry', 'motor_boat', 'ship', 'airplane', 'small_airplane', 'flight_departure', 'flight_arrival', 'parachute', 'seat', 'helicopter', 'suspension_railway', 'mountain_cableway', 'aerial_tramway', 'artificial_satellite', 'rocket', 'flying_saucer', 'bellhop_bell', 'luggage', 'hourglass', 'hourglass_flowing_sand', 'watch', 'alarm_clock', 'stopwatch', 'timer_clock', 'mantelpiece_clock', 'clock12', 'clock1230', 'clock1', 'clock130', 'clock2', 'clock230', 'clock3', 'clock330', 'clock4', 'clock430', 'clock5', 'clock530', 'clock6', 'clock630', 'clock7', 'clock730', 'clock8', 'clock830', 'clock9', 'clock930', 'clock10', 'clock1030', 'clock11', 'clock1130', 'new_moon', 'waxing_crescent_moon', 'first_quarter_moon', 'waxing_gibbous_moon', 'full_moon', 'waning_gibbous_moon', 'last_quarter_moon', 'waning_crescent_moon', 'crescent_moon', 'new_moon_with_face', 'first_quarter_moon_with_face', 'last_quarter_moon_with_face', 'thermometer', 'sunny', 'full_moon_with_face', 'sun_with_face', 'ringer_planet', 'star', 'star2', 'stars', 'milky_way', 'cloud', 'partly_sunny', 'cloud_with_lightning_and_rain', 'sun_behind_small_cloud', 'sun_behind_large_cloud', 'sun_behind_rain_cloud', 'cloud_with_rain', 'cloud_with_snow', 'cloud_with_lightning', 'tornado', 'fog', 'wind_face', 'cyclone', 'rainbow', 'closed_umbrella', 'open_umbrella', 'umbrella', 'parasol_on_ground', 'zap', 'snowflake', 'snowman_with_snow', 'snowman', 'comet', 'fire', 'droplet', 'ocean'],
                },
                {
                    section: '活动',
                    emojis: ['jack_o_lantern', 'christmas_tree', 'fireworks', 'sparkler', 'firecracker', 'sparkles', 'balloon', 'tada', 'confetti_ball', 'tanabata_tree', 'bamboo', 'dolls', 'flags', 'wind_chime', 'rice_scene', 'red_gift_envelope', 'ribbon', 'gift', 'reminder_ribbon', 'tickets', 'ticket', 'medal_military', 'trophy', 'medal_sports', '1st_place_medal', '2nd_place_medal', '3rd_place_medal', 'soccer', 'baseball', 'softball', 'basketball', 'volleyball', 'football', 'rugby_football', 'tennis', 'flying_disc', 'bowling', 'cricket_bat_and_ball', 'field_hockey', 'ice_hockey', 'lacrosse', 'ping_pong', 'badminton', 'boxing_glove', 'martial_arts_uniform', 'goal_net', 'golf', 'ice_skate', 'fishing_pole_and_fish', 'diving_mask', 'running_shirt_with_sash', 'ski', 'sled', 'curling_stone', 'dart', 'yo-yo', 'kite', '8ball', 'crystal_ball', 'magic_wand', 'nazar_amulet', 'hamsa', 'video_game', 'joystick', 'slot_machine', 'game_die', 'jigsaw', 'teddy_bear', 'piñata', 'mirror_ball', 'nesting_dolls', 'spades', 'hearts', 'diamonds', 'clubs', 'chess_pawn', 'black_joker', 'mahjong', 'flower_playing_cards', 'performing_arts', 'framed_picture', 'art', 'thread', 'sewing_needle', 'yarn', 'knot'],
                },
                {
                    section: '对象',
                    emojis: ['eyeglasses', 'dark_sunglasses', 'goggles', 'lab_coat', 'safety_vest', 'necktie', 'tshirt', 'jeans', 'scarf', 'gloves', 'coat', 'socks', 'dress', 'kimono', 'sari', 'one_piece_swimsuit', 'briefs', 'shorts', 'bikini', 'womans_clothes', 'purse', 'handbag', 'pouch', 'shopping', 'school_satchel', 'thong_sandal', 'mans_shoe', 'athletic_shoe', 'hiking_boot', 'flat_shoe', 'high_heel', 'sandal', 'ballet_shoes', 'boot', 'crown', 'womans_hat', 'tophat', 'mortar_board', 'billed_cap', 'military_helmet', 'rescue_worker_helmet', 'prayer_beads', 'lipstick', 'ring', 'gem', 'mute', 'speaker', 'sound', 'loud_sound', 'loudspeaker', 'mega', 'postal_horn', 'bell', 'no_bell', 'musical_score', 'musical_note', 'notes', 'studio_microphone', 'level_slider', 'control_knobs', 'microphone', 'headphones', 'radio', 'saxophone', 'accordion', 'guitar', 'musical_keyboard', 'trumpet', 'violin', 'banjo', 'drum', 'long_drum', 'iphone', 'calling', 'phone', 'telephone_receiver', 'pager', 'fax', 'battery', 'low_battery', 'electric_plug', 'computer', 'desktop_computer', 'printer', 'keyboard', 'computer_mouse', 'trackball', 'minidisc', 'floppy_disk', 'cd', 'dvd', 'abacus', 'movie_camera', 'film_strip', 'film_projector', 'clapper', 'tv', 'camera', 'camera_flash', 'video_camera', 'vhs', 'mag', 'mag_right', 'candle', 'bulb', 'flashlight', 'izakaya_lantern', 'diya_lamp', 'notebook_with_decorative_cover', 'closed_book', 'open_book', 'green_book', 'blue_book', 'orange_book', 'books', 'notebook', 'ledger', 'page_with_curl', 'scroll', 'page_facing_up', 'newspaper', 'newspaper_roll', 'bookmark_tabs', 'bookmark', 'label', 'moneybag', 'coin', 'yen', 'dollar', 'euro', 'pound', 'money_with_wings', 'credit_card', 'receipt', 'chart', 'email', 'e-mail', 'incoming_envelope', 'envelope_with_arrow', 'outbox_tray', 'inbox_tray', 'package', 'mailbox', 'mailbox_closed', 'mailbox_with_mail', 'mailbox_with_no_mail', 'postbox', 'ballot_box', 'pencil2', 'black_nib', 'fountain_pen', 'pen', 'paintbrush', 'crayon', 'memo', 'briefcase', 'file_folder', 'open_file_folder', 'card_index_dividers', 'date', 'calendar', 'spiral_notepad', 'spiral_calendar', 'card_index', 'chart_with_upwards_trend', 'chart_with_downwards_trend', 'bar_chart', 'clipboard', 'pushpin', 'round_pushpin', 'paperclip', 'paperclips', 'straight_ruler', 'triangular_ruler', 'scissors', 'card_file_box', 'file_cabinet', 'wastebasket', 'lock', 'unlock', 'lock_with_ink_pen', 'closed_lock_with_key', 'key', 'old_key', 'hammer', 'axe', 'pick', 'hammer_and_pick', 'hammer_and_wrench', 'dagger', 'crossed_swords', 'gun', 'boomerang', 'bow_and_arrow', 'shield', 'carpentry_saw', 'wrench', 'screwdriver', 'nut_and_bolt', 'gear', 'clamp', 'balance_scale', 'probing_cane', 'link', 'chains', 'hook', 'toolbox', 'magnet', 'ladder', 'alembic', 'test_tube', 'petri_dish', 'dna', 'microscope', 'telescope', 'satellite', 'syringe', 'drop_of_blood', 'pill', 'adhesive_bandage', 'crutch', 'stethoscope', 'xray', 'door', 'elevator', 'mirror', 'window', 'bed', 'couch_and_lamp', 'chair', 'toilet', 'plunger', 'shower', 'bathtub', 'mouse_trap', 'razor', 'lotion_bottle', 'safety_pin', 'broom', 'basket', 'roll_of_toilet_paper', 'bucket', 'soap', 'bubbles', 'toothbrush', 'sponge', 'fire_extinguisher', 'shopping_cart', 'smoking', 'coffin', 'headstone', 'funeral_urn', 'moyai', 'placard', 'identification_card'],
                },
                {
                    section: '符号',
                    emojis: ['atm', 'put_litter_in_its_place', 'potable_water', 'wheelchair', 'mens', 'womens', 'restroom', 'baby_symbol', 'wc', 'passport_control', 'customs', 'baggage_claim', 'left_luggage', 'warning', 'children_crossing', 'no_entry', 'no_entry_sign', 'no_bicycles', 'no_smoking', 'do_not_litter', 'non-potable_water', 'no_pedestrians', 'no_mobile_phones', 'underage', 'radioactive', 'biohazard', 'arrow_up', 'arrow_upper_right', 'arrow_right', 'arrow_lower_right', 'arrow_down', 'arrow_lower_left', 'arrow_left', 'arrow_upper_left', 'arrow_up_down', 'left_right_arrow', 'leftwards_arrow_with_hook', 'arrow_right_hook', 'arrow_heading_up', 'arrow_heading_down', 'arrows_clockwise', 'arrows_counterclockwise', 'back', 'end', 'on', 'soon', 'top', 'place_of_worship', 'atom_symbol', 'om', 'star_of_david', 'wheel_of_dharma', 'yin_yang', 'latin_cross', 'orthodox_cross', 'star_and_crescent', 'peace_symbol', 'menorah', 'six_pointed_star', 'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpius', 'sagittarius', 'capricorn', 'aquarius', 'pisces', 'ophiuchus', 'twisted_rightwards_arrows', 'repeat', 'repeat_one', 'arrow_forward', 'fast_forward', 'next_track_button', 'play_or_pause_button', 'arrow_backward', 'rewind', 'previous_track_button', 'arrow_up_small', 'arrow_double_up', 'arrow_down_small', 'arrow_double_down', 'pause_button', 'stop_button', 'record_button', 'eject_button', 'cinema', 'low_brightness', 'high_brightness', 'signal_strength', 'vibration_mode', 'mobile_phone_off', 'female_sign', 'male_sign', 'transgender_symbol', 'heavy_multiplication_x', 'heavy_plus_sign', 'heavy_minus_sign', 'heavy_division_sign', 'heavy_equals_sign', 'infinity', 'bangbang', 'interrobang', 'question', 'grey_question', 'grey_exclamation', 'exclamation', 'wavy_dash', 'currency_exchange', 'heavy_dollar_sign', 'medical_symbol', 'recycle', 'fleur_de_lis', 'trident', 'name_badge', 'beginner', 'o', 'white_check_mark', 'ballot_box_with_check', 'heavy_check_mark', 'x', 'negative_squared_cross_mark', 'curly_loop', 'loop', 'part_alternation_mark', 'eight_spoked_asterisk', 'eight_pointed_black_star', 'sparkle', 'copyright', 'registered', 'tm', 'hash', 'asterisk', 'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'keycap_ten', 'capital_abcd', 'abcd', '1234', 'symbols', 'abc', 'a', 'ab', 'b', 'cl', 'cool', 'free', 'information_source', 'id', 'm', 'new', 'ng', 'o2', 'ok', 'parking', 'sos', 'up', 'vs', 'koko', 'sa', 'u6708', 'u6709', 'u6307', 'ideograph_advantage', 'u5272', 'u7121', 'u7981', 'accept', 'u7533', 'u5408', 'u7a7a', 'congratulations', 'secret', 'u55b6', 'u6e80', 'red_circle', 'orange_circle', 'yellow_circle', 'green_circle', 'large_blue_circle', 'purple_circle', 'brown_circle', 'black_circle', 'white_circle', 'red_square', 'orange_square', 'yellow_square', 'green_square', 'blue_square', 'purple_square', 'brown_square', 'black_large_square', 'white_large_square', 'black_medium_square', 'white_medium_square', 'black_medium_small_square', 'white_medium_small_square', 'black_small_square', 'white_small_square', 'large_orange_diamond', 'large_blue_diamond', 'small_orange_diamond', 'small_blue_diamond', 'small_red_triangle', 'small_red_triangle_down', 'diamond_shape_with_a_dot_inside', 'radio_button', 'white_square_button', 'black_square_button'],
                },
                {
                    section: '旗帜',
                    emojis: ['checkered_flag', 'triangular_flag_on_post', 'crossed_flags', 'black_flag', 'white_flag', 'rainbow_flag', 'transgender_flag', 'pirate_flag', 'ascension_island', 'andorra', 'united_arab_emirates', 'afghanistan', 'antigua_barbuda', 'anguilla', 'albania', 'armenia', 'angola', 'antarctica', 'argentina', 'american_samoa', 'austria', 'australia', 'aruba', 'aland_islands', 'azerbaijan', 'bosnia_herzegovina', 'barbados', 'bangladesh', 'belgium', 'burkina_faso', 'bulgaria', 'bahrain', 'burundi', 'benin', 'st_barthelemy', 'bermuda', 'brunei', 'bolivia', 'caribbean_netherlands', 'brazil', 'bahamas', 'bhutan', 'bouvet_island', 'botswana', 'belarus', 'belize', 'canada', 'cocos_islands', 'congo_kinshasa', 'central_african_republic', 'congo_brazzaville', 'switzerland', 'cote_divoire', 'cook_islands', 'chile', 'cameroon', 'cn', 'colombia', 'clipperton_island', 'costa_rica', 'cuba', 'cape_verde', 'curacao', 'christmas_island', 'cyprus', 'czech_republic', 'de', 'diego_garcia', 'djibouti', 'denmark', 'dominica', 'dominican_republic', 'algeria', 'ceuta_and_melilla', 'ecuador', 'estonia', 'egypt', 'western_sahara', 'eritrea', 'es', 'ethiopia', 'eu', 'finland', 'fiji', 'falkland_islands', 'micronesia', 'faroe_islands', 'fr', 'gabon', 'uk', 'grenada', 'georgia', 'french_guiana', 'guernsey', 'ghana', 'gibraltar', 'greenland', 'gambia', 'guinea', 'guadeloupe', 'equatorial_guinea', 'greece', 'south_georgia_south_sandwich_islands', 'guatemala', 'guam', 'guinea_bissau', 'guyana', 'hong_kong', 'heard_and_mc_donald_islands', 'honduras', 'croatia', 'haiti', 'hungary', 'canary_islands', 'indonesia', 'ireland', 'israel', 'isle_of_man', 'india', 'british_indian_ocean_territory', 'iraq', 'iran', 'iceland', 'it', 'jersey', 'jamaica', 'jordan', 'jp', 'kenya', 'kyrgyzstan', 'cambodia', 'kiribati', 'comoros', 'st_kitts_nevis', 'north_korea', 'kr', 'kuwait', 'cayman_islands', 'kazakhstan', 'laos', 'lebanon', 'st_lucia', 'liechtenstein', 'sri_lanka', 'liberia', 'lesotho', 'lithuania', 'luxembourg', 'latvia', 'libya', 'morocco', 'monaco', 'moldova', 'montenegro', 'st_martin', 'madagascar', 'marshall_islands', 'macedonia', 'mali', 'myanmar', 'mongolia', 'macau', 'northern_mariana_islands', 'martinique', 'mauritania', 'montserrat', 'malta', 'mauritius', 'maldives', 'malawi', 'mexico', 'malaysia', 'mozambique', 'namibia', 'new_caledonia', 'niger', 'norfolk_island', 'nigeria', 'nicaragua', 'netherlands', 'norway', 'nepal', 'nauru', 'niue', 'new_zealand', 'oman', 'panama', 'peru', 'french_polynesia', 'papua_new_guinea', 'philippines', 'pakistan', 'poland', 'st_pierre_miquelon', 'pitcairn_islands', 'puerto_rico', 'palestinian_territories', 'portugal', 'palau', 'paraguay', 'qatar', 'reunion', 'romania', 'serbia', 'ru', 'rwanda', 'saudi_arabia', 'solomon_islands', 'seychelles', 'sudan', 'sweden', 'singapore', 'st_helena', 'slovenia', 'svalbard_and_jan_mayen', 'slovakia', 'sierra_leone', 'san_marino', 'senegal', 'somalia', 'suriname', 'south_sudan', 'sao_tome_principe', 'el_salvador', 'sint_maarten', 'syria', 'swaziland', 'tristan_da_cunha', 'turks_caicos_islands', 'chad', 'french_southern_territories', 'togo', 'thailand', 'tajikistan', 'tokelau', 'timor_leste', 'turkmenistan', 'tunisia', 'tonga', 'tr', 'trinidad_tobago', 'tuvalu', 'taiwan', 'tanzania', 'ukraine', 'uganda', 'us_outlying_islands', 'united_nations', 'us', 'uruguay', 'uzbekistan', 'vatican_city', 'st_vincent_grenadines', 'venezuela', 'british_virgin_islands', 'us_virgin_islands', 'vietnam', 'vanuatu', 'wallis_futuna', 'samoa', 'kosovo', 'yemen', 'mayotte', 'south_africa', 'zambia', 'zimbabwe', 'england', 'scotland', 'wales'],
                },
            ];
            // cSpell: enable
        }
        try {
            emojiInfo.customEmojis = getCustomEmoji();
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            // eslint-disable-next-line no-console
            console.warn('Could not parse custom emojis from source, falling back to built-in emojis.');
            // cSpell: disable
            emojiInfo.customEmojis = [
                {
                    name: 'android',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/3X/c/6/c6adfabff819aafe81dfdefa73a19a084bf9f65b.png',
                    group: '软件服务',
                },
                {
                    name: 'apex_legends',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/b/d/6/bd6051d814ceacd286a227de8fdd161997900aa4.png',
                    group: '游戏',
                },
                {
                    name: 'arknights',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/a/7/c/a7c2a3def597f974ba22814c05456daa99d096bf.png',
                    group: '游戏',
                },
                {
                    name: 'bilibili',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/b/0/d/b0d55094db9b2eefff108add8e95297ab761c9b2.png',
                    group: '软件服务',
                },
                {
                    name: 'bing',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/9/8/1/981e0195e5270f4a79f326bd2bdef5363b29b267.png',
                    group: '软件服务',
                },
                {
                    name: 'cheems',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/0/3/9/0398d0c34c1bb4aef1d890c50f916b682d0623c4.png',
                    group: 'default',
                },
                {
                    name: 'chrome',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/3X/c/5/c5202e2c46ef257a879edf1f729d02489c9b3d53.png',
                    group: '软件服务',
                },
                {
                    name: 'cpp',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/3X/9/2/923b0d73cec8cd33b794daec1024a68f46f5df74.png',
                    group: '编程语言',
                },
                {
                    name: 'discourse',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/b/3/c/b3c6a57478759e80357d19f42385e29d20e57296.png',
                    group: '软件服务',
                },
                {
                    name: 'doge',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/5/3/f/53fbf5092b5f6e2e929c819bdaabf80c403ed904.png',
                    group: 'default',
                },
                {
                    name: 'dogface',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/5/c/3/5c361ca4562ed22d01e9eede3a85d50dc0f63935.png',
                    group: 'default',
                },
                {
                    name: 'dugtrio',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/3X/9/1/917ed0e8e5dc1bfa3f19a20cc961c90a45fb0c71.png',
                    group: 'default',
                },
                {
                    name: 'ecnu',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/3X/b/2/b2ae26e2db563996ff0acdf6d8fc112c11ec01f7.png',
                    group: '学校',
                },
                {
                    name: 'eleme',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/3X/a/1/a196e9673138f46a82e5d45ca993c269d8414b4a.png',
                    group: '公司',
                },
                {
                    name: 'fudan',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/2/a/7/2a767084591e406be3e7c7a139b953a95d3c4f28.png',
                    group: '学校',
                },
                {
                    name: 'genshin_impact',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/e/a/d/eada14f29abddb7f5a6e1dd34fedac94e75109da.png',
                    group: '游戏',
                },
                {
                    name: 'github',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/7/7/d/77d6acf8b7ee0b6e2de660e2565bec268c51c669.png',
                    group: '软件服务',
                },
                {
                    name: 'golang',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/3X/4/5/45a2e5c7242f2dae94a0a1011f32586e7e71ef45.png',
                    group: '编程语言',
                },
                {
                    name: 'google',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/3X/d/b/db2e0178efbe1203baa78e2e398bcb4fa1f5f35d.png',
                    group: '公司',
                },
                {
                    name: 'hit',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/3X/d/0/d04d1123337ead0c98cbbf452fd2a20358c199fe.png',
                    group: '学校',
                },
                {
                    name: 'honkai_star_rail',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/4/c/3/4c363708d29a6df5a14b2140b02328a53d7b5414.jpeg',
                    group: '游戏',
                },
                {
                    name: 'honor_of_kings',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/8/a/b/8ab143c5a3f426dc650ccbe99c1f260c88803aa3.png',
                    group: '游戏',
                },
                {
                    name: 'huaji',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/d/f/9/df999bace486e7cbeeb50c9fb48e6aaf0d5dd9e5.png',
                    group: 'default',
                },
                {
                    name: 'huanhu',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/9/6/f/96fe728caca3b57ab28417d41dd32b3f53111e3e.png',
                    group: 'default',
                },
                {
                    name: 'java',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/3X/8/8/886496b108cf3a38cfa0d6d78a9fa9fabc65d12e.png',
                    group: '编程语言',
                },
                {
                    name: 'javascript',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/f/e/1/fe1c532a263f3b257d41562af2572248137a46b7.png',
                    group: '编程语言',
                },
                {
                    name: 'jbox',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/3X/d/4/d43194c53f05d529afb00fe0c561e783cefe4cf2.png',
                    group: '软件服务',
                },
                {
                    name: 'jiaowoban',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/6/3/d/63d21a272c01aa50f531c3058cd319bc97c56bec.png',
                    group: '软件服务',
                },
                {
                    name: 'juban',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/d/1/9/d196f0826c232a87715d2243e47f50e429762adb.png',
                    group: 'default',
                },
                {
                    name: 'kfc',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/3X/3/9/39c7225b0127e20a1ff2108aaaa3ebdec6ad17e2.png',
                    group: '公司',
                },
                {
                    name: 'latex',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/a/9/4/a94e01135d7cfe873a58982eae7b2891288039be.png',
                    group: '编程语言',
                },
                {
                    name: 'league_of_legends',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/b/f/6/bf6431e60d4b860fbc1700ef24b46a572b6dccdb.png',
                    group: '游戏',
                },
                {
                    name: 'linux',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/3X/9/4/94ce631a3532b70e84532441337b0926e99a5644.png',
                    group: '软件服务',
                },
                {
                    name: 'matlab',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/3X/e/8/e8d530b0038c6bf2baacbf7d75fda3f095cda4f0.png',
                    group: '编程语言',
                },
                {
                    name: 'mcdonald',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/1/3/4/134dee65dc462da4402bfd238d3cab00efd4ca35.png',
                    group: '公司',
                },
                {
                    name: 'microsoft',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/3X/5/c/5c347ece124e705d6f514a11d4f9a300189abf99.png',
                    group: '公司',
                },
                {
                    name: 'minecraft',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/3X/4/d/4d8c0acd593c70b5f5e6898c485aa84dee4a5b4a.png',
                    group: '游戏',
                },
                {
                    name: 'nju',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/3X/5/1/51e687f9d52e1f1fa0e4f101a2d070f956f7d764.png',
                    group: '学校',
                },
                {
                    name: 'octocat',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/3X/3/7/371a7e24f0b27ae39dc374f65b8d113564acd16a.png',
                    group: '软件服务',
                },
                {
                    name: 'open_ai',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/8/8/b/88b9e7dc321052d0541cd8bfe35dc1906a928cb3.png',
                    group: '公司',
                },
                {
                    name: 'paradox_interactive',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/8/2/3/8235a690287883d104ec6737c2d8388ab6034630.png',
                    group: '公司',
                },
                {
                    name: 'photoshop',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/3/b/9/3b9f2f4926a79f66ef7840f210179d2d32f08cca.png',
                    group: '软件服务',
                },
                {
                    name: 'pku',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/3X/d/5/d55dec31e0b689406acef03575cb9f4a6cd7feaa.png',
                    group: '学校',
                },
                {
                    name: 'poke_ball',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/7/7/d/77dc27418194dce1ea4b832a47215f95e69fc4a9.png',
                    group: '游戏',
                },
                {
                    name: 'python',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/3X/6/0/6067b589f332bf2529cad40ab3fe4d2af96de9e5.png',
                    group: '编程语言',
                },
                {
                    name: 'qq',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/3X/c/3/c35c6d519458c273f658a1f034ee9647cda5fa90.png',
                    group: '软件服务',
                },
                {
                    name: 'ruby',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/3X/f/0/f090efa9961f54e8ee02951772d4c7da88058a31.png',
                    group: '编程语言',
                },
                {
                    name: 'rust',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/3X/2/b/2b83c70bf65e8c770027edb332ad611b594a2fae.png',
                    group: '编程语言',
                },
                {
                    name: 'sanguosha',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/3/c/5/3c528b55f205cf712b2407a774e5d518ac0bd96c.png',
                    group: '游戏',
                },
                {
                    name: 'seiee',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/b/6/8/b68602b9f8783b3547d91eecf093e82dc70f8994.png',
                    group: '学校',
                },
                {
                    name: 'shsmu',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/2/4/8/24835a9bc89751aa915eb0703755d23189cce184.png',
                    group: '学校',
                },
                {
                    name: 'shuiyuan',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/8/0/9/809879120b4a6e2f0cd22ce03c58eb8d0c47d23d.svg',
                    group: '软件服务',
                },
                {
                    name: 'sjtu',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/e/1/5/e1503d6a096813af0b2ca67301f7671e51f17c70.png',
                    group: '学校',
                },
                {
                    name: 'sjtu_acem',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/e/3/7/e37c0b48e56c821393439b77b5f143bd486349de.png',
                    group: '学校',
                },
                {
                    name: 'sjtu_bme',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/c/0/5/c05592f1bd142730c54230b42626a95375eaf31b.png',
                    group: '学校',
                },
                {
                    name: 'sjtu_me',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/f/1/3/f13d77d1d1cd6451d0d5058b2a25ddce2cfb86ac.jpeg',
                    group: '学校',
                },
                {
                    name: 'sjtu_sms',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/4/9/b/49b1eacb5417904bc750fa9f076fd413f31ef94e.png',
                    group: '学校',
                },
                {
                    name: 'steam',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/e/c/8/ec8ad1fe1ac97bceba1ca6dbf1d9a4690d126ab8.png',
                    group: '软件服务',
                },
                {
                    name: 'terminal',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/c/7/0/c70d81d6cbf0718e458a940bd755d95bd629ddde.svg',
                    group: '编程语言',
                },
                {
                    name: 'thonk',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/8/4/1/8415de4dd5f532f9f28bcf7db09a79e6a94afc65.png',
                    group: 'default',
                },
                {
                    name: 'tieba',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/9/f/8/9f8117b5ce9cfbf717270008924c712d31ad53b1.png',
                    group: '软件服务',
                },
                {
                    name: 'tongji',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/3X/2/8/2867e8b049c91b44162d7ac82de49d6d65e1489d.png',
                    group: '学校',
                },
                {
                    name: 'tsinghua',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/3X/7/3/73573337cad4f06abb98cb118cf984e526546d6b.png',
                    group: '学校',
                },
                {
                    name: 'txmeeting',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/e/2/4/e24c906626697a02f8001b068f4207da28765754.png',
                    group: '软件服务',
                },
                {
                    name: 'ucas',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/f/3/3/f335d4f721195fa448c94f6dd4a46b528e106e30.png',
                    group: '学校',
                },
                {
                    name: 'ustc',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/3X/f/9/f9044eebe17f429fdfa650bdfb69c4f2a77acffc.png',
                    group: '学校',
                },
                {
                    name: 'wechat',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/3/1/9/31996ea91dc3b3d75d9f1760ba5cb2a1793632a6.png',
                    group: '软件服务',
                },
                {
                    name: 'weibo',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/3X/0/5/052edff7a00e599c7c091499ec7b3a52141b3c06.png',
                    group: '软件服务',
                },
                {
                    name: 'wood_block',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/3/b/1/3b16709a88ed2f25b2554507956f68b3529a1fed.png',
                    group: 'default',
                },
                {
                    name: 'xiaohongshu',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/e/c/a/eca3b216d6d59e3c58c718c864f5c50d3dc5e129.png',
                    group: '软件服务',
                },
                {
                    name: 'xjtu',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/3X/c/8/c8fa53cafd8e9cdef4e4fc87d19caf7a5dfd4859.png',
                    group: '学校',
                },
                {
                    name: 'yaoming',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/e/4/c/e4c96dfa7f5d2187ca7caf13b5c9c918376da8cb.png',
                    group: 'default',
                },
                {
                    name: 'ykst',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/f/1/6/f16edf9c298e3782af1b8cdabee9672627ed73f7.png',
                    group: '软件服务',
                },
                {
                    name: 'youtube',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/3X/b/a/ba3daa80ccd82839177d8d0937bcbcde301f23bf.png',
                    group: '软件服务',
                },
                {
                    name: 'zhihu',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/e/5/e/e5eace2b3150b84e8ba69a524513060fa709f922.png',
                    group: '软件服务',
                },
                {
                    name: 'zhihu_surprise',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/8/a/5/8a518a211cedca72a428a5e7f1bc9518dccf081d.png',
                    group: 'default',
                },
                {
                    name: 'zju',
                    url: 'https://shuiyuan.s3.jcloud.sjtu.edu.cn/original/4X/3/a/9/3a94f6149d57b6b3ad903b51403280f7c8fe45d2.png',
                    group: '学校',
                },
            ];
            // cSpell: enable
        }
        emojiInfo.customEmojisMap = new Map(emojiInfo.customEmojis.map((ce) => [ce.name, ce.url]));
        emojiInfo.allEmojiNames = [
            ...emojiInfo.standardEmojis.flatMap((s) => s.emojis),
            ...emojiInfo.customEmojisMap.keys(),
        ];
        emojiInfo.allEmojiNamesSet = new Set(emojiInfo.allEmojiNames);
        return emojiInfo;
    };
    let currentThemeInfo = null;
    const getCurrentThemeInfo = () => {
        if (currentThemeInfo) {
            return currentThemeInfo;
        }
        currentThemeInfo = {};
        currentThemeInfo.themeId = parseInt(document.querySelector('meta[name="discourse_theme_id"]')?.content, 10);
        if (Number.isNaN(currentThemeInfo.themeId)) {
            currentThemeInfo.themeId = null;
            // eslint-disable-next-line no-console
            console.error('Unable to get themeId');
        }
        const dataDiscourseSetup = document.getElementById('data-discourse-setup');
        if (dataDiscourseSetup) {
            currentThemeInfo.colorSchemeId = parseInt(dataDiscourseSetup.getAttribute('data-user-color-scheme-id'), 10);
            if (Number.isNaN(currentThemeInfo.colorSchemeId)) {
                currentThemeInfo.colorSchemeId = null;
                // eslint-disable-next-line no-console
                console.error('Unable to get colorSchemeId');
            }
            currentThemeInfo.darkSchemeId = parseInt(dataDiscourseSetup.getAttribute('data-user-dark-scheme-id'), 10);
            if (Number.isNaN(currentThemeInfo.darkSchemeId)) {
                currentThemeInfo.darkSchemeId = null;
                // eslint-disable-next-line no-console
                console.error('Unable to get darkSchemeId');
            }
            currentThemeInfo.colorSchemeIsDark = dataDiscourseSetup.getAttribute('data-color-scheme-is-dark')?.toLowerCase() === 'true';
        } else {
            // eslint-disable-next-line no-console
            console.error('Missing #data-discourse-setup');
        }
        return currentThemeInfo;
    };
    const loadIgnoredUsers = () => {
        if (!shuiyuanHelperMemory.has('ignoredUsersLowerCaseSet')) {
            const currentUser = getCurrentUser();
            shuiyuanHelperMemory.set(
                'ignoredUsersLowerCaseSet',
                new Set((currentUser.ignored_users ?? []).filter(Boolean).map((u) => u.toLowerCase())),
            );
            shuiyuanHelperMemory.set('hideRetortsOfIgnoredUsers', Boolean(currentUser.custom_fields?.hide_ignored_retorts));
        }
    };

    // Utility functions.
    // eslint-disable-next-line no-promise-executor-return
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const escapeCSSIdentifier = (ident) => {
        if (ident.includes('\x00')) {
            throw new Error('CSS identifiers cannot contain the null character');
        }
        return CSS.escape(ident);
    };
    const asTagSelector = (tagName) => escapeCSSIdentifier(tagName);
    const asIdSelector = (id) => `#${escapeCSSIdentifier(id)}`;
    const asClassSelector = (className) => `.${escapeCSSIdentifier(className)}`;
    const dummyElementOfId = (id) => {
        const el = document.createElement('dummy');
        el.id = id;
        return el;
    };
    const dummyElementOfClasses = (classNames) => {
        const el = document.createElement('dummy');
        if (typeof classNames === 'string') {
            el.className = classNames;
        } else {
            el.classList.add(...classNames);
        }
        return el;
    };
    const addGlobalStyle = (css) => {
        const style = document.createElement('style');
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
        return style;
    };
    // Shadow DOM does not inherit global style. We need to set style inside.
    // CSS variables do get inherited though.
    const addShadowDOMStyle = (shadowRoot, css) => {
        const style = document.createElement('style');
        style.appendChild(document.createTextNode(css));
        shadowRoot.appendChild(style);
        return style;
    };
    const zip = (array1, array2) => array1.map((x, i) => [x, array2[i]]);
    const setIntersection = (set1, set2) => new Set([...set1].filter((x) => set2.has(x)));
    const setDifference = (set1, set2) => new Set([...set1].filter((x) => !set2.has(x)));
    const setsOverlap = (set1, set2) => setIntersection(set1, set2).size > 0;
    const fixOptionObject = (value) => {
        const obj = value ?? {};
        if (typeof obj === 'object') {
            return Array.isArray(obj) ? {} : obj;
        }
        return {enabled: Boolean(obj)};
    };
    const cleanUpKeys = (obj, validKeys) => {
        for (const key of [...Object.keys(obj)]) {
            if (!validKeys.has(key)) {
                delete obj[key];
            }
        }
    };
    const parseIntegerOption = (value, defaultValue) => {
        switch (typeof value) {
            case 'number':
                return Math.round(value);
            case 'string': {
                const parsedValue = parseInt(value, 10);
                return Number.isNaN(parsedValue) ? defaultValue : parsedValue;
            }
            default:
                return defaultValue;
        }
    };
    const parseStringOption = (value, defaultValue) => {
        switch (typeof value) {
            case 'string':
                return value;
            case 'number':
                return value.toString();
            default:
                return defaultValue;
        }
    };

    const checkPositiveInteger = (value, variableName) => {
        if (!Number.isInteger(value)) {
            throw new TypeError(`${variableName} is not an integer`);
        }
        if (value < 1) {
            throw new RangeError(`${variableName} is not positive`);
        }
    };

    const promiseAllSettledLogErrors = async (promises) => {
        const results = await Promise.allSettled(promises);
        for (const r of results) {
            if (r.status === 'rejected') {
                // eslint-disable-next-line no-console
                console.error(r.reason);
            }
        }
        return results;
    };

    const debounce = (callback, interval) => {
        let debounceTimeoutId;
        return (...args) => {
            clearTimeout(debounceTimeoutId);
            debounceTimeoutId = setTimeout(() => callback(...args), interval);
        };
    };

    const isOpenInNewTabOrWindow = (e) => e.ctrlKey || e.shiftKey || e.metaKey;

    const getRelativeDateString = (date) => {
        const MINUTE_MS = 1000 * 60;
        const HOUR_MS = MINUTE_MS * 60;
        const DAY_MS = HOUR_MS * 24;
        const currentDate = new Date();
        const timeDiff = currentDate - date;
        let relativeDateString = null;
        if (timeDiff / MINUTE_MS < 0.5) {
            relativeDateString = '刚刚';
        } else if (timeDiff / MINUTE_MS < 59.5) {
            relativeDateString = `${Math.round(timeDiff / MINUTE_MS)} 分钟前`;
        } else if (timeDiff / HOUR_MS < 23.5) {
            relativeDateString = `${Math.round(timeDiff / HOUR_MS)} 小时前`;
        } else if (timeDiff / DAY_MS < 5) {
            relativeDateString = `${Math.max(Math.floor(timeDiff / DAY_MS), 1)} 天前`;
        } else {
            relativeDateString = `${date.getMonth() + 1} 月 ${date.getDate()} 日`;
            if (date.getFullYear() !== currentDate.getFullYear()) {
                relativeDateString = `${date.getFullYear() % 100} 年 ${relativeDateString}`;
            }
        }
        return relativeDateString;
    };

    const parseBirthdayMonthDate = (birthdayString) => {
        if (!birthdayString || !/^\d{4}-\d{2}-\d{2}$/u.test(birthdayString)) {
            return null;
        }
        const [month, date] = birthdayString.split('-').map((s) => parseInt(s, 10)).slice(1);
        return `${month} 月 ${date} 日`;
    };

    const createFileDownload = (content, fileName, mimeType) => {
        const downloadLink = document.createElement('a');
        const blob = new Blob([content], {type: mimeType});
        const blobURL = URL.createObjectURL(blob);
        downloadLink.download = fileName;
        downloadLink.href = blobURL;
        downloadLink.click();
        URL.revokeObjectURL(blobURL);
    };

    const getPreferencesRoute = () => `/u/${encodeURIComponent(getCurrentUsername())}/preferences/account`;
    const getShuiyuanHelperRoute = () => `/u/${encodeURIComponent(getCurrentUsername())}/preferences/interface${SETTINGS_VIEW_FRAGMENT}`;

    // Go to another Discourse route without top-level navigation.
    const goToRoute = (path) => {
        window.history.pushState({}, '', path);
        let popStateCounter = 1;
        const popStateListener = () => {
            if (popStateCounter === 1) {
                popStateCounter -= 1;
                window.history.forward();
            } else {
                window.removeEventListener('popstate', popStateListener);
            }
        };
        window.addEventListener('popstate', popStateListener);
        window.history.back();
    };

    const hasHook = (objProp, label, maxLevels) => {
        if (!objProp) {
            return false;
        }
        const hookData = objProp.shuiyuanHelperHookData;
        if (!hookData) {
            // Not a hook.
            return false;
        }
        const level = maxLevels ?? HOOK_MAX_LEVELS;
        if (level <= 0) {
            // Maximum hook levels reached. There might be a loop, stop here.
            return false;
        }
        if (hookData.label === label) {
            // Found hook with matching label.
            return true;
        }
        if (hookData.origFunc === objProp) {
            // Hook is a self loop, stop here.
            return false;
        }
        // Check original function.
        return hasHook(hookData.origFunc, label, level - 1);
    };

    const getOrigFunc = (objProp, maxLevels) => {
        if (!objProp) {
            return objProp;
        }
        const hookData = objProp.shuiyuanHelperHookData;
        if (!hookData) {
            // Not a hook.
            return objProp;
        }
        const level = maxLevels ?? HOOK_MAX_LEVELS;
        if (level <= 0) {
            // Maximum hook levels reached. There might be a loop, stop here.
            return null;
        }
        if (hookData.origFunc === objProp) {
            // Hook is a self loop, stop here.
            return null;
        }
        // Check original function.
        return getOrigFunc(hookData.origFunc, level - 1);
    };

    const applyHook = (obj, prop, transformFunc, label, options) => {
        // Label is a string that describes the purpose of hooking.
        if (typeof label !== 'string' || !label) {
            throw new Error('missing or invalid label');
        }
        // Select the mode of hooking.
        const mode = options?.mode ?? 'regular';
        if (!['regular', 'getter'].includes(mode)) {
            throw new Error(`unknown hook mode: ${mode}`);
        }
        // Perform hooking only if the object property has not already been hooked with the same mode and label.
        const onlyIfAbsent = options?.onlyIfAbsent ?? true;
        // Get the original function and extra attributes.
        let origFunc = null;
        const extraAttrs = {};
        switch (mode) {
            case 'regular':
                origFunc = obj[prop];
                break;
            case 'getter': {
                const pd = Object.getOwnPropertyDescriptor(obj, prop);
                origFunc = pd.get;
                extraAttrs.set = pd.set;
                extraAttrs.enumerable = pd.enumerable;
                break;
            }
        }
        if (!origFunc) {
            throw new Error('missing original function');
        }
        if (onlyIfAbsent && hasHook(origFunc, label)) {
            return origFunc;
        }
        // Create our hook function.
        const newFunc = transformFunc(origFunc);
        newFunc.shuiyuanHelperHookData = {
            label,
            origFunc,
        };
        // Replace the property with our hook function.
        switch (mode) {
            case 'regular':
                obj[prop] = newFunc;
                break;
            case 'getter':
                Object.defineProperty(obj, prop, {
                    configurable: true,
                    enumerable: extraAttrs.enumerable,
                    get: newFunc,
                    set: extraAttrs.set,
                });
                break;
        }
        return newFunc;
    };

    const markElementHandledByFeature = (element, feature) => {
        element.shuiyuanHelperHandledFeatures ??= new Set();
        element.shuiyuanHelperHandledFeatures.add(feature);
    };

    const isElementHandledByFeature = (element, feature) => element.shuiyuanHelperHandledFeatures?.has(feature) ?? false;

    const setDataAtElement = (element, key, value) => {
        element.shuiyuanHelperData ??= new Map();
        element.shuiyuanHelperData.set(key, value);
        return value;
    };

    const setDataAtElementIfAbsent = (element, key, value) => {
        element.shuiyuanHelperData ??= new Map();
        if (!element.shuiyuanHelperData.has(key)) {
            element.shuiyuanHelperData.set(key, value);
        }
        return element.shuiyuanHelperData.get(key);
    };

    const computeDataAtElementIfAbsent = (element, key, computeValueFunc) => {
        element.shuiyuanHelperData ??= new Map();
        if (!element.shuiyuanHelperData.has(key)) {
            element.shuiyuanHelperData.set(key, computeValueFunc(key));
        }
        return element.shuiyuanHelperData.get(key);
    };

    const getDataAtElement = (element, key) => element.shuiyuanHelperData?.get(key);

    const hasDataAtElement = (element, key) => element.shuiyuanHelperData?.has(key) ?? false;

    const deleteDataAtElement = (element, key) => element.shuiyuanHelperData?.delete(key);

    // Look for a retort button with the given postId and emoji in the page.
    const findRetortButton = (postId, emoji) => document.querySelector([
        `article[data-post-id="${postId}"]`,
        '.post-retort-container',
        `img.emoji[alt="${escapeCSSIdentifier(`:${emoji}:`)}"]`,
    ].join(' '))?.parentElement ?? null;

    const findUsernameInUserPage = (userMain) => {
        const usernameNode = userMain.querySelector('.user-profile-names .username');
        if (!usernameNode) {
            // eslint-disable-next-line no-console
            console.error('Cannot locate username node in user page');
            return null;
        }
        const username = [...usernameNode.childNodes]
            .filter((node) => node?.nodeName === '#text')
            .map((node) => node.textContent?.trim())
            .filter(Boolean)[0];
        if (!username) {
            // eslint-disable-next-line no-console
            console.error('Cannot find username in user page');
            return null;
        }
        return username;
    };

    // Get the .cooked div within a post article, excluding those within .embedded-posts.
    const getPostCookedDiv = (postOrPostId) => {
        if (!postOrPostId) {
            return null;
        }
        if (Number.isInteger(postOrPostId)) {
            return document.querySelector(`article[data-post-id="${postOrPostId}"] .cooked:not(.embedded-posts .cooked)`);
        }
        return postOrPostId.querySelector('.cooked:not(.embedded-posts .cooked)');
    };

    // Fetch wrapper with:
    // - Discourse special headers.
    // - Response status code check.
    // - Limited exponential backoff retry upon 429 status code.
    const discourseFetch = async (url, fetchOptions, customOptions) => {
        const expectOkStatus = customOptions?.expectOkStatus ?? true;
        const maxRetries = customOptions?.maxRetries ?? FETCH_MAX_RETRIES;
        let currentAttempt = 0;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            // eslint-disable-next-line no-await-in-loop
            const response = await fetch(url, {
                method: fetchOptions?.method ?? 'GET',
                headers: {
                    'Discourse-Present': 'true',
                    'Discourse-Logged-In': 'true',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-Token': document.querySelector('meta[name=csrf-token]').content,
                    ...fetchOptions?.headers,
                },
                body: fetchOptions?.body,
                mode: 'same-origin',
                credentials: 'include',
                redirect: 'follow',
            });
            if (response.status === 429) {
                currentAttempt += 1;
                if (currentAttempt > maxRetries) {
                    throw new Error('Max retries exceeded on 429 errors');
                }
                // eslint-disable-next-line no-await-in-loop
                await sleep(1000 * EXP_BACKOFF_START * EXP_BACKOFF_BASE ** (currentAttempt - 1));
                continue;
            }
            if (expectOkStatus && !response.ok) {
                throw new Error(`discourseFetch: ${response.status}${response.statusText ? ` ${response.statusText}` : ''}`);
            }
            return response;
        }
    };

    const getUserInfo = async (username) => {
        const result = await (await discourseFetch(`/u/${encodeURIComponent(username)}.json`)).json();
        return result?.user?.username?.toLowerCase() === username.toLowerCase() ? result.user : null;
    };

    const getUserInfoFromTL0Group = async (username) => {
        if (!username) {
            return null;
        }
        let offset = 0;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            // eslint-disable-next-line no-await-in-loop
            const res = await discourseFetch(`/groups/trust_level_0/members.json?order=added_at&asc=true&filter=${encodeURIComponent(username)}&limit=${FETCH_ITEMS_PER_PAGE}&offset=${offset}`);
            // eslint-disable-next-line no-await-in-loop
            const members = (await res.json())?.members || [];
            const matchingMembers = members.filter((m) => m?.username?.toLowerCase() === username.toLowerCase());
            if (matchingMembers.length > 1) {
                throw new Error(`unexpected multiple members with username ${username} found`);
            }
            if (matchingMembers.length === 1) {
                return matchingMembers[0];
            }
            if (members.length < FETCH_ITEMS_PER_PAGE) {
                // Last page reached. User not found.
                return null;
            }
            offset += FETCH_ITEMS_PER_PAGE;
        }
    };

    const getUserByIdFromTL0Group = async (id) => {
        checkPositiveInteger(id, 'provided id');

        const getMaxIdAndOffset = async () => {
            const data = await (await discourseFetch('/groups/trust_level_0/members.json?order=added_at&limit=1&offset=0')).json();
            if (data.members.length > 1) {
                throw new Error('got more than 1 member when limit=1');
            }
            if (data.members.length < 1) {
                throw new Error('no members in trust_level_0');
            }
            const maxId = data.members[0].id;
            checkPositiveInteger(maxId, 'max id in members');
            const totalMembers = data.meta.total;
            checkPositiveInteger(totalMembers, 'the total number of members');
            return [maxId, totalMembers - 1];
        };

        const fetchTL0Members = async (offset, limit) => {
            const queryOffset = offset ?? 0;
            const res = await discourseFetch(`/groups/trust_level_0/members.json?order=added_at&asc=true&limit=${limit ?? FETCH_ITEMS_PER_PAGE}&offset=${queryOffset}`);
            const members = (await res.json()).members;
            members.forEach((m) => checkPositiveInteger(m.id, 'member id'));
            members.sort((a, b) => a.id - b.id);
            members.forEach((m, index) => {
                // eslint-disable-next-line camelcase
                m.offset_in_trust_level_0 = queryOffset + index;
            });
            return members;
        };

        const findMatchingMember = (members) => {
            const matchingMembers = members.filter((m) => m.id === id);
            if (matchingMembers.length > 1) {
                throw new Error(`unexpected multiple members with id ${id} found`);
            }
            return matchingMembers[0] ?? null;
        };

        const guessIdOffset = (leftId, leftOffset, rightId, rightOffset, targetId) => {
            if (leftId > rightId || leftOffset > rightOffset) {
                throw new Error('reversed interval');
            }
            if (targetId < leftId || targetId > rightId) {
                throw new Error('targetId out of interval');
            }
            if ((leftId === rightId) !== (leftOffset === rightOffset)) {
                throw new Error('bijection violation');
            }
            if (leftId === rightId && leftOffset === rightOffset) {
                return leftOffset;
            }
            // Linear regression.
            const slope = (rightId - leftId) / (rightOffset - leftOffset);
            const guessedTargetOffset = Math.round(leftOffset + (targetId - leftId) / slope);
            if (guessedTargetOffset < leftOffset || guessedTargetOffset > rightOffset) {
                throw new Error('guessedTargetOffset out of interval');
            }
            return guessedTargetOffset;
        };

        // For small IDs, just get the first page. It must be inside, if it exists.
        if (id <= FETCH_ITEMS_PER_PAGE) {
            const members = await fetchTL0Members();
            return findMatchingMember(members);
        }

        // Otherwise, get the max ID and offset.
        // Use linear regression to iteratively find the offset for the ID we are looking for.
        const [maxId, maxOffset] = await getMaxIdAndOffset();
        if (id > maxId) {
            return null;
        }
        let leftId = 1;
        let leftOffset = 0;
        let rightId = maxId;
        let rightOffset = maxOffset;
        let width = rightOffset - leftOffset;

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const guessedOffset = guessIdOffset(leftId, leftOffset, rightId, rightOffset, id);
            const queryOffset = Math.max(Math.round(guessedOffset - FETCH_ITEMS_PER_PAGE / 2), leftOffset);
            // eslint-disable-next-line no-await-in-loop
            const members = await fetchTL0Members(queryOffset);
            if (members.length === 0) {
                throw new Error(`no members found in interval, queryOffset = ${queryOffset}`);
            }
            const matchingMember = findMatchingMember(members);
            if (matchingMember) {
                return matchingMember;
            }
            const resultLeftId = members[0].id;
            const resultLeftOffset = queryOffset;
            const resultRightId = members.at(-1).id;
            const resultRightOffset = queryOffset + members.length - 1;
            if (id < resultLeftId) {
                rightId = resultLeftId;
                rightOffset = resultLeftOffset;
            } else if (id > resultRightId) {
                leftId = resultRightId;
                leftOffset = resultRightOffset;
            } else {
                // ID is within the last query interval but not found.
                return null;
            }
            const newWidth = rightOffset - leftOffset;
            if (newWidth >= width) {
                throw new Error('interval width not decreasing, infinite loop detected');
            }
            if (newWidth < 0) {
                throw new Error('unexpected interval left > right');
            }
            width = newWidth;
        }
    };

    // Get the number of users whose last_seen_at is within recent 5 minutes.
    // This might be inaccurate if multiple pages are fetched (i.e. onlineUserCount >= 1000).
    const getOnlineUserCount = async () => {
        const FIVE_MINUTES_MS = 1000 * 60 * 5;
        let offset = 0;
        let onlineUserCount = 0;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            // eslint-disable-next-line no-await-in-loop
            const res = await discourseFetch(`/groups/trust_level_0/members.json?order=last_seen_at&limit=1000&offset=${offset}`); // 1000 is the max page size
            // eslint-disable-next-line no-await-in-loop
            const members = (await res.json())?.members || [];
            if (!members.length) {
                break;
            }
            let moreOnlineMembers = true;
            const currentDate = new Date();
            for (const member of members) {
                if (!member.id || !member.last_seen_at) {
                    // eslint-disable-next-line no-console
                    console.error('Member missing id or last_seen_at field:', member);
                    continue;
                }
                if (currentDate - new Date(member.last_seen_at) <= FIVE_MINUTES_MS) {
                    onlineUserCount += 1;
                } else {
                    moreOnlineMembers = false;
                    break;
                }
            }
            if (!moreOnlineMembers) {
                break;
            }
            offset += members.length;
        }
        return onlineUserCount;
    };

    const castVotes = async (postId, pollName, options) => {
        checkPositiveInteger(postId, 'postId');
        let submitPollName = '';
        if ([undefined, null, ''].includes(pollName)) {
            submitPollName = 'poll';
        } else if (typeof pollName === 'string') {
            submitPollName = pollName;
        } else {
            throw new Error('poll name must be a string');
        }
        let submitOptions = [];
        if (Array.isArray(options)) {
            if (!options.length) {
                throw new Error('options array should not be empty');
            }
            if (!options.every((o) => typeof o === 'string')) {
                throw new Error('options array should only contain strings');
            }
            if (new Set(options).size !== options.length) {
                throw new Error('options array should not contain duplicate options');
            }
            submitOptions = options;
        } else if (typeof options === 'string') {
            submitOptions = [options];
        } else {
            throw new Error('options must be a string or an array of strings');
        }
        const res = await discourseFetch(
            '/polls/vote',
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    Accept: 'application/json',
                },
                body: [
                    `post_id=${postId}`,
                    `poll_name=${encodeURIComponent(submitPollName)}`,
                    ...submitOptions.map((option) => `options%5B%5D=${encodeURIComponent(option)}`),
                ].join('&'),
            },
            {expectOkStatus: false},
        );
        return res.json();
    };

    // Expose functions for debugging purposes.
    window.shuiyuanHelperDebug = {
        shuiyuanHelperMemory,
        loadConfig,
        saveConfig,
        getDataPreloaded,
        getSite,
        getSiteSettings,
        getCustomEmoji,
        getCurrentUser,
        getCurrentUsername,
        getEmojiInfo,
        getCurrentThemeInfo,
        discourseFetch,
        getUserInfo,
        getUserInfoFromTL0Group,
        getUserByIdFromTL0Group,
        getOnlineUserCount,
        castVotes,
    };

    // Feature groups.
    const FEATURE_GROUP_FIELDS_SET = new Set(['id', 'description']);
    const allFeatureGroupIds = new Set();
    const ALL_FEATURE_GROUPS = [
        {
            id: 'likes',
            description: '点赞',
        },
        {
            id: 'emojis',
            description: 'Emoji 表情',
        },
        {
            id: 'post-content',
            description: '发帖',
        },
        {
            id: 'read-content',
            description: '读帖',
        },
        {
            id: 'announcements',
            description: '公示',
        },
        {
            id: 'users',
            description: '用户',
        },
        {
            id: 'interface',
            description: '界面',
        },
    ];
    for (const group of ALL_FEATURE_GROUPS) {
        if (!isObject(group)) {
            // eslint-disable-next-line no-console
            console.error(group);
            throw new Error('Feature group is not an object');
        }
        if (typeof group.id !== 'string' || !group.id) {
            // eslint-disable-next-line no-console
            console.error(group);
            throw new Error('Feature group ID missing or invalid');
        }
        allFeatureGroupIds.add(group.id);
        if (typeof group.description !== 'string' || !group.description) {
            throw new Error(`Missing or invalid description for feature group ${group.id}`);
        }
        const unrecognizedFields = setDifference(new Set(Object.keys(group)), FEATURE_GROUP_FIELDS_SET);
        if (unrecognizedFields.size > 0) {
            // eslint-disable-next-line no-console
            console.error(unrecognizedFields);
            throw new Error(`Feature group ${group.id} contains unrecognized fields`);
        }
    }
    if (allFeatureGroupIds.size !== ALL_FEATURE_GROUPS.length) {
        throw new Error('Duplicate feature group IDs found');
    }
    const allFeatureGroupDescriptions = new Set(ALL_FEATURE_GROUPS.map((g) => g.description));
    if (allFeatureGroupDescriptions.size !== ALL_FEATURE_GROUPS.length) {
        throw new Error('Duplicate feature group descriptions found');
    }

    // Hold IDs of all features (to be populated later).
    const allFeatureIds = new Set();

    // Map from feature group ID to array of features in the group (to be populated later).
    const groupedFeatures = new Map();

    // Implementation for each feature.
    const ALL_FEATURES = [
        {
            id: 'post-qq-emoji',
            description: '可在发帖内容中插入 QQ 表情',
            group: 'post-content',
            enabledByDefault: true,
            onInitialize: () => {
                // Do not display QQ emoji entrypoint if we are not on a Discourse view (e.g. viewing an image).
                if (!IS_DISCOURSE_VIEW) {
                    return;
                }

                const QQ_EMOJI_WIDTH = 28;
                const QQ_EMOJI_HEIGHT = 28;

                // cSpell: disable
                // eslint-disable-next-line quotes, quote-props, key-spacing, comma-spacing
                const QQ_EMOJIS_LIST = [{"name":"微笑","url":"/uploads/default/original/3X/0/2/02512d1973582ba0ad99c63c1c862f4e2cb95813.png","shortUrl":"upload://kuSbYfw4Um2efSqNicK2pm5f11.png"},{"name":"撇嘴","url":"/uploads/default/original/3X/7/3/732ba1ceb18a931509781ef8464c45be74057770.png","shortUrl":"upload://gqQocxz9CD0CFMoyYMKuHAERbSo.png"},{"name":"色","url":"/uploads/default/original/3X/0/6/06851ce4cce04713b9a315e27e00c63b173ab8d3.png","shortUrl":"upload://VG3AgTZubatjpJBHMuah9IB7Jp.png"},{"name":"发呆","url":"/uploads/default/original/3X/5/e/5e1a5a33a7372b932bd8e3be52ce21d4abe2cc81.png","shortUrl":"upload://dqtlc9W7diM4NOw1pq3CIUBek1j.png"},{"name":"得意","url":"/uploads/default/original/3X/b/c/bc848fd77ae9ff0171a562bc7c8212396e481bb2.png","shortUrl":"upload://qTHMaEMQcZVGZyelhKkJub8RhZM.png"},{"name":"流泪","url":"/uploads/default/original/3X/c/6/c6e29fa837cd17eefa72346419a668dfc415f13e.png","shortUrl":"upload://snq4QdYMA5n03l30YhZW5wHhqa2.png"},{"name":"害羞","url":"/uploads/default/original/3X/2/9/29e3c91f3f68ace01664d688f89e45dc290942ff.png","shortUrl":"upload://5YzBuGoFZSuAEgcDwhGjP47fhNB.png"},{"name":"闭嘴","url":"/uploads/default/original/3X/7/3/7354da7ee6bafa8b22fb28bb6fbd36a64b99f667.png","shortUrl":"upload://gsgHPgmYENqgwjyca665jma4Ew7.png"},{"name":"睡","url":"/uploads/default/original/3X/d/6/d631e2c3e8c64587cca05f800c4bd30ec4854066.png","shortUrl":"upload://uyR3CVqMux73geQPGL0b5xPL9ki.png"},{"name":"大哭","url":"/uploads/default/original/3X/9/e/9ef51e66101dd332fce94be5cab4afc5e7c9958a.png","shortUrl":"upload://mGcBuVucsKQ7rXRB7fsWTJcHkvM.png"},{"name":"尴尬","url":"/uploads/default/original/3X/5/e/5e73f45df1206341c3c0934386d375a3540607fb.png","shortUrl":"upload://dtzjrVLj8baHp9IqbyCUYnClKH1.png"},{"name":"发怒","url":"/uploads/default/original/3X/d/a/da329451d1d5526e8bfcdc81251e2b06ddb8883a.png","shortUrl":"upload://v8gsaA5kooXgLbRkAXabeSrgVg6.png"},{"name":"调皮","url":"/uploads/default/original/3X/1/7/17ecf38c5d27a2c95171e7639adc4aae486cbc94.png","shortUrl":"upload://3pEEa1tvhXNDzQycaoAu02w7ozO.png"},{"name":"呲牙","url":"/uploads/default/original/3X/7/6/76d6fc5a95aede60b4927647adecf779e851ae79.png","shortUrl":"upload://gXiWFRjg4dXh5cHi5ksEUPrNXnP.png"},{"name":"惊讶","url":"/uploads/default/original/3X/c/f/cf96a1fbef4a91ab54b37ff7a1daa8b7689831eb.png","shortUrl":"upload://tCpz41mnTZVTQLVbPC5rynsTxOz.png"},{"name":"难过","url":"/uploads/default/original/3X/a/4/a4a010653794ca56135a5a5c41e3c07c9081d157.png","shortUrl":"upload://nuleVAlIObShNCWzq7k7OrNzhuT.png"},{"name":"酷","url":"/uploads/default/original/3X/5/b/5ba6a30a11901bd8f8cd6dcbfac5e773b073e564.png","shortUrl":"upload://d4MsZHhwwEUqCqoD9pLJLQ5HVUU.png"},{"name":"冷汗","url":"/uploads/default/original/3X/d/3/d32c312b0fb47d2efe045602237037d9f5ad9147.png","shortUrl":"upload://u87quDd6wvuzMzdm9mslE0EWVtJ.png"},{"name":"抓狂","url":"/uploads/default/original/3X/f/3/f366866d4e0f1172b9260758fa6b208496a73b39.png","shortUrl":"upload://yJdGqCpihZRkRl7SKdDHt95PPgR.png"},{"name":"吐","url":"/uploads/default/original/3X/4/4/4471302a428dccf005433bf2739e599d0fd71e3c.png","shortUrl":"upload://9LsYibplGbJpJINTpAOiZe2niBm.png"},{"name":"偷笑","url":"/uploads/default/original/3X/d/5/d51bb295ddbbdc5dbc07322781a04502e54504cb.png","shortUrl":"upload://upf2Frg5ltwgPTmOezNKNLZ36vp.png"},{"name":"可爱","url":"/uploads/default/original/3X/1/8/18de88740005ec99452b8b7e4af65db2cc8533fb.png","shortUrl":"upload://3y0evPyKwAlldy986v2O4fUhGC7.png"},{"name":"白眼","url":"/uploads/default/original/3X/1/a/1a28fdc062b459d8667934cf2bd877854bf63d53.png","shortUrl":"upload://3JqeIYY159N6vCm8oJNeQzZ14Vd.png"},{"name":"傲慢","url":"/uploads/default/original/3X/4/0/400070f9fd468c002f17f73a6f3ca1235be0f9cd.png","shortUrl":"upload://98bvdUVI06GYQluQ7ief0OEXQJL.png"},{"name":"饥饿","url":"/uploads/default/original/3X/2/d/2d2ab711c283b423f4d329f8ee0c445d462d085e.png","shortUrl":"upload://6rz0b4JDpY91WDdGMhq4LeTKUeq.png"},{"name":"困","url":"/uploads/default/original/3X/1/3/13ea015ca511b283567932873d7d97db557a61d7.png","shortUrl":"upload://2QaqpDuBDkWW7Ii3e22x0v3eU6z.png"},{"name":"惊恐","url":"/uploads/default/original/3X/7/e/7ec419e533f1e20a96ba64d2750222e2c924151b.png","shortUrl":"upload://i5qiYuMNfaF3v0EFdLki6p2XdtV.png"},{"name":"流汗","url":"/uploads/default/original/3X/d/0/d0b4f96da4d4f00d52e675478bab84d59a8043fb.png","shortUrl":"upload://tMj34wT2IbZ2Lq3OofjRDc6VBNN.png"},{"name":"憨笑","url":"/uploads/default/original/3X/d/3/d31a65ec7b07ed8d99b3ac5f7a29c4fbd4697330.png","shortUrl":"upload://u7viQE1XvXMk9nl6jWSUiU1QWGI.png"},{"name":"悠闲","url":"/uploads/default/original/3X/1/6/1683e08b156757c24ce5a055ea2cbf95c533f0a3.png","shortUrl":"upload://3db35mfRKXbm7cpDwXdELrTB6Vl.png"},{"name":"奋斗","url":"/uploads/default/original/3X/c/f/cf562b71d84f95d53f0c82c8e50ac8911ce9f324.png","shortUrl":"upload://tAbs9F1N5qxRjups44RqujxhhpG.png"},{"name":"咒骂","url":"/uploads/default/original/3X/9/6/96f72f0fe84e8521ed6aedae17909e96e2adce1d.png","shortUrl":"upload://lxvcZiqefTwATmGsDZ96mMV6vw1.png"},{"name":"疑问","url":"/uploads/default/original/3X/5/1/51a8d68121439088df5bd00c8b2d5b3b8cc61d74.png","shortUrl":"upload://bEopkS5Dplh90EtD8r5wbIhFgpu.png"},{"name":"嘘","url":"/uploads/default/original/3X/2/5/2519434fa2db53372cff039fb7c74544e4adf57e.png","shortUrl":"upload://5ibN6q4OEHcVyXI5qW0LEpX58ei.png"},{"name":"晕","url":"/uploads/default/original/3X/c/e/cef182bf010258fa7da18b7ae5ef303de035ff48.png","shortUrl":"upload://twHNbhL2wMHONpAAIwz15yvbpnW.png"},{"name":"折磨","url":"/uploads/default/original/3X/d/a/dade2f84e79775548f3caef485c35774210731b8.png","shortUrl":"upload://vec7nEC2xZFu9NTQnDCHFLjnysg.png"},{"name":"衰","url":"/uploads/default/original/3X/4/2/422f9ac4196102e70d6493542898a313cfbd9153.png","shortUrl":"upload://9rvvkw8KzrF1EUqkBbRW3vt4ne3.png"},{"name":"骷髅","url":"/uploads/default/original/3X/0/c/0cc75ae9965cdc8953dad63aea1ded7485d00ee0.png","shortUrl":"upload://1P2Qs9JZYIUxoxhFSdo10wyNL0c.png"},{"name":"敲打","url":"/uploads/default/original/3X/4/5/45ba7c6c2df2fdc2ed8fce1ae74478f74fc9fd1d.png","shortUrl":"upload://9WQunhDNkrJ0w1OrvRnlok4qudf.png"},{"name":"再见","url":"/uploads/default/original/3X/b/9/b9c3d72781a59c8240db2f3df687c49b18223179.png","shortUrl":"upload://qvlUVLOAdaGXbc2Bkdn9UPXsP33.png"},{"name":"擦汗","url":"/uploads/default/original/3X/9/a/9a52922e790c3063a6fd5365745a1955f9f9123d.png","shortUrl":"upload://m1cr9QSTYHO8axMcBuo90FwHs7j.png"},{"name":"抠鼻","url":"/uploads/default/original/3X/3/2/320d5099ea174a8aed53aae170e1caae59175fdb.png","shortUrl":"upload://78MoPlnoyiNH9TT5NCJ0A9O26fN.png"},{"name":"鼓掌","url":"/uploads/default/original/3X/5/c/5c2ed6f4ae928294c7b685b05ae77c517ec13e0e.png","shortUrl":"upload://d9uhprLKUG2ylbXAIq5wdsa4w1g.png"},{"name":"糗大了","url":"/uploads/default/original/3X/e/d/ed2b594e1e01f4c1ae1b74597cb887fa6b14d284.png","shortUrl":"upload://xQ62arCsoiU7BfYw83jfRkDfT5W.png"},{"name":"坏笑","url":"/uploads/default/original/3X/b/2/b25ba81c6d7e5648806b36992974258e8997fd46.png","shortUrl":"upload://prPmwrCeYBQHJUt8juM3uIE6kOa.png"},{"name":"左哼哼","url":"/uploads/default/original/3X/a/a/aaf08245b8966973d868180817759636abd70ca6.png","shortUrl":"upload://oocso2DmuZzApw7gbD6CLuzX2hE.png"},{"name":"右哼哼","url":"/uploads/default/original/3X/0/2/020222249dc19558da171f7fa2c2cc0331d68727.png","shortUrl":"upload://hLwAFjU7Q6m2Sckp03943gp7fh.png"},{"name":"哈欠","url":"/uploads/default/original/3X/7/4/74e995efac57f33a730ac2ea2d2845d10a0b3b1b.png","shortUrl":"upload://gGfQb7apjt9LqMND47NUAIxXmkP.png"},{"name":"鄙视","url":"/uploads/default/original/3X/f/a/fa75a98f28095ba2049a4be5086223b29f97c575.png","shortUrl":"upload://zJFsoBFAUJmRiW1qNrWXq9N1ilL.png"},{"name":"委屈","url":"/uploads/default/original/3X/7/0/700a6333db814b5c1e4618a0fb069abfbfd9e8f6.png","shortUrl":"upload://fZ9Jn94Ua6y0182gceFiIE21gLY.png"},{"name":"快哭了","url":"/uploads/default/original/3X/f/7/f7fd7a507d7b556afc71dd40c914b65fbf6fdc05.png","shortUrl":"upload://znP0y4g4jSNviFKyp79ALJpE7Ln.png"},{"name":"阴险","url":"/uploads/default/original/3X/2/2/2270d03bac9233cd51dd1e9b8aa01c09ba2dc8dc.png","shortUrl":"upload://4UFW0uH6y5JkD2argEOUKIbdt8M.png"},{"name":"右亲亲","url":"/uploads/default/original/3X/c/d/cdf8dda07b050b4b7536131f14ce65ea4c380c5a.png","shortUrl":"upload://to74zIRYhCn1r9W5Aqjf88UqhN8.png"},{"name":"左亲亲","url":"/uploads/default/original/3X/d/e/de4ae2b472b0dd3a719284dafa7e81d82e5f4925.png","shortUrl":"upload://vIurhsd7wBhRi8epRIyUkI67kWx.png"},{"name":"吓","url":"/uploads/default/original/3X/6/0/60cdbeee2be4a957329aaea3bf7b5ddc4431dd16.png","shortUrl":"upload://dOmE1vnZ5fy2B3hrYgblmdpLBNI.png"},{"name":"可怜","url":"/uploads/default/original/3X/e/d/ed67e3492bedb1d288dda5e365dad8f9e051886e.png","shortUrl":"upload://xSbJPjNqePU99KlWicM1wARNmX4.png"},{"name":"眨眼睛","url":"/uploads/default/original/3X/e/f/efb08424d314842b3200ff63f051c55da8d55298.png","shortUrl":"upload://ycoizKGLLWNH1oelxHmnQYbDEuY.png"},{"name":"笑哭","url":"/uploads/default/original/3X/9/7/97025a0a6abcb8afe76c9b1953a9a5c93fb16cc8.png","shortUrl":"upload://lxT8t0j6FdTp60YCjBlzjpChC9a.png"},{"name":"doge","url":"/uploads/default/original/2X/c/cd650448509fa9043afbb435787db26266069e02.png","shortUrl":"upload://tj0j8Y0KlePMXBMPq1x6hOEy9Ts.png"},{"name":"泪奔","url":"/uploads/default/original/3X/b/a/ba835c4a29fed666638387649764f416835322f6.png","shortUrl":"upload://qBYfnF2GxjgbsBOWBmSvYq5BZrg.png"},{"name":"无奈","url":"/uploads/default/original/3X/0/a/0af813ab362e666fbd89800e9f0317753ac05208.png","shortUrl":"upload://1z2hagtCyzbxLhTdZfVji7rbkWQ.png"},{"name":"托腮","url":"/uploads/default/original/3X/2/e/2e520b69cc9697ae707e9bc03be14c9e443cde23.png","shortUrl":"upload://6BLK5qWZoZJXfIGWksXaL4x3sTF.png"},{"name":"卖萌","url":"/uploads/default/original/3X/2/1/21282fdb772c91cb76fedf55f38378685667a82d.png","shortUrl":"upload://4JjR6YbcvXT6ffl3CAnbkinR30p.png"},{"name":"斜眼笑","url":"/uploads/default/original/3X/1/5/15b6a8845beefee8f959753f8c1aea696e290d21.png","shortUrl":"upload://365mXSO8shJEMcbVjsg7YhoXpMl.png"},{"name":"喷血","url":"/uploads/default/original/3X/a/8/a8dc8d07ed5f18210a6a80b92b61df7492439e47.png","shortUrl":"upload://o5OK4IPaOR8VwDsmbuRWItPEreD.png"},{"name":"惊喜","url":"/uploads/default/original/3X/5/3/53cd95b25b440d0120e95c9e36d1abff6d29064c.png","shortUrl":"upload://bXm5MPB3rzWPqL1EFb8Tda0oAVK.png"},{"name":"骚扰","url":"/uploads/default/original/3X/8/1/81f29ce737af495b07b3f2b29b125710cbc2c1cb.png","shortUrl":"upload://ixzo8ZotxFPrbAXGaz4Ddpu22lZ.png"},{"name":"小纠结","url":"/uploads/default/original/3X/9/8/98da4e42b2d352c34870db3d105e02b13bb37b3f.png","shortUrl":"upload://lOcibxtqck7fZcT4MbamIkgotVZ.png"},{"name":"我最美","url":"/uploads/default/original/3X/9/4/94d1c55617046cb931f78458acc032b563e88220.png","shortUrl":"upload://lew6389FQpyZBNeiyuZyB3jfx04.png"},{"name":"加油必胜","url":"/uploads/default/original/3X/f/d/fd83efe907d0263ff742bc37d3b8142f77203c6e.png","shortUrl":"upload://AaHtoiqGXAB3Lh4D7uStyGH4T5c.png"},{"name":"加油抱抱","url":"/uploads/default/original/3X/3/8/38ac8d3fd8b42291b1e607e8f8b8e24df9daef04.png","shortUrl":"upload://85mqAdnUnRpghrQRriepkJ14OuE.png"},{"name":"口罩护体","url":"/uploads/default/original/3X/d/6/d6f4232b9e262d6f988258e67e9c4e8302f0c92d.png","shortUrl":"upload://uFzeUU0N4rbpcRAoy7Uh51xrKUd.png"},{"name":"搬砖中","url":"/uploads/default/original/3X/1/4/143f089fb3bee7d607ecde61cfa51a9a254970e8.png","shortUrl":"upload://2T6B6tPBTw4mvy9NyTCxjZ8rW2Y.png"},{"name":"忙到飞起","url":"/uploads/default/original/3X/4/5/457783618e40210ff0e46a48475190c32225980e.png","shortUrl":"upload://9Ux056cSaWzzqApB7oETYsCYb9Q.png"},{"name":"脑阔疼","url":"/uploads/default/original/3X/2/6/2676bdca2cb5b11b1fbe9689e6e992ddbff1f843.png","shortUrl":"upload://5ugxR8lV6D1FCNTrPPnGXrDQpjl.png"},{"name":"沧桑","url":"/uploads/default/original/3X/e/5/e5d9e324813422c38cd74299b980548310eec4d0.png","shortUrl":"upload://wNma2Zoix0gZRuSCbpi4Jo44s8g.png"},{"name":"捂脸","url":"/uploads/default/original/3X/d/c/dc822dc0974ab503842ecd76aee38be92552cbfd.png","shortUrl":"upload://vsHWUgcf6vyLiLlml4cJXQrsZ65.png"},{"name":"辣眼睛","url":"/uploads/default/original/3X/f/e/fea1a4d76d2263d2b2b0afc1b47aa477f1d93837.png","shortUrl":"upload://AkzB4D2X9gRROVUVYUsqxL9SZoP.png"},{"name":"哦哟","url":"/uploads/default/original/3X/4/4/4430eb4cb61210380c414e1fb83a32ce5c1f1a2d.png","shortUrl":"upload://9Jfh9SnO1KiXp1QH0raLB3uxR4F.png"},{"name":"头秃","url":"/uploads/default/original/3X/9/6/96d46c39c964abb5fc9e2c5d56ea2891501c73cb.png","shortUrl":"upload://lwiJwmjvOmAdG5ET9KO0QIMaBVV.png"},{"name":"问号脸","url":"/uploads/default/original/3X/7/f/7f6e0b0f84b6e4a2e7412c2f6ac6c824c2ba5337.png","shortUrl":"upload://ibip7H4AHA7lMtr7sHWc7ZixdAj.png"},{"name":"暗中观察","url":"/uploads/default/original/3X/4/c/4cb1939c802cc3a4d6bbc3b688b922e89c85a402.png","shortUrl":"upload://aWsK7tiY60tnfsaSgvB24CQVmca.png"},{"name":"emm","url":"/uploads/default/original/3X/d/3/d3767f7da99b2c112a7894ef0aead34143223d97.png","shortUrl":"upload://uaGCSvpinFuTkAMrJmIKOEWFL8j.png"},{"name":"吃瓜","url":"/uploads/default/original/3X/f/c/fc89ce11fec2351ba8ec6213b29efc7c662f84e5.png","shortUrl":"upload://A23zeDeaOAZah57sJdIgSAGMne5.png"},{"name":"呵呵哒","url":"/uploads/default/original/3X/c/e/ce281ff16dd9efa18546190690e011720c2254ae.png","shortUrl":"upload://tpKkczHhdgFozytZwyA5X2UGtkO.png"},{"name":"汪汪","url":"/uploads/default/original/3X/3/0/30bb3327fee2b57088ec3f6c3a4aac11ca043705.png","shortUrl":"upload://6X5ZwEuvgBeaCfqJrRZv2gUpUH3.png"},{"name":"牛转钱坤","url":"/uploads/default/original/3X/f/b/fb097ee97427031b40bd7f68493ca33db034ae72.png","shortUrl":"upload://zOMbKWLVjTXoByME6fs6u7Eao14.png"},{"name":"牛气冲天","url":"/uploads/default/original/3X/d/9/d9d487fcddda75b47064f0c4f8d51eb665a9ef0c.png","shortUrl":"upload://v50Xl2TliXvy7AfhgTUKzFeryR6.png"},{"name":"无眼笑","url":"/uploads/default/original/3X/b/4/b4026c1d578e041b316725a44404846a03b17005.png","shortUrl":"upload://pGr8kX8RCc50nq7lUlJMjBjLggd.png"},{"name":"敬礼","url":"/uploads/default/original/3X/a/f/af03264c8687e37482b8510333fb05371b87b726.png","shortUrl":"upload://oYeiVFS3ZSgo0mXHfqZ4YXdF0oK.png"},{"name":"狂笑","url":"/uploads/default/original/3X/a/6/a60100a1b63b9884fc4feedab72d7e4432148785.png","shortUrl":"upload://nGxphR9zQrLVZ6SO6bm04lqVXP7.png"},{"name":"面无表情","url":"/uploads/default/original/3X/6/f/6f73f350069bd3a5d1fb65ce8d62de83c7d38694.png","shortUrl":"upload://fTXq9KyCqaDFHLYbSwmo2AaF6O8.png"},{"name":"摸鱼","url":"/uploads/default/original/3X/1/0/10b59d12dcdaadeb4cd66a98288d92e93e987f18.png","shortUrl":"upload://2nOKb1JSVayorYyYy7RGFDBTpYQ.png"},{"name":"摸锦鲤","url":"/uploads/default/original/3X/0/b/0b12568fea427631e0c06a47903735537afc1805.png","shortUrl":"upload://1zWxzjqMXUwIYyVcBIjtp5BibB3.png"},{"name":"魔鬼笑","url":"/uploads/default/original/3X/9/d/9da781c625c4fd2928acfd72e7aba4602e8a4db3.png","shortUrl":"upload://muFQnq31ZwR2k9k84gDABTZxsxt.png"},{"name":"哦","url":"/uploads/default/original/3X/6/c/6c312dce5a3cddfe9e17bf4213ba9cb943f1c9d1.png","shortUrl":"upload://fr6VNiAbKLhZKI5X7isHPUw7kHf.png"},{"name":"请","url":"/uploads/default/original/3X/8/0/806acc1e12e3865d4ce016b7b86a707c7fd11d41.png","shortUrl":"upload://ik1VyXE8H5Tu6TFfEW4ONhFg5Jn.png"},{"name":"睁眼","url":"/uploads/default/original/3X/9/f/9fe082ac5989af315f06095989049df6f6d50aec.png","shortUrl":"upload://mOkVBRK5mzO9LZ36kYxHehshz1a.png"},{"name":"期待","url":"/uploads/default/original/3X/0/f/0fad175c80b5cd5eb1a445b1439eb25fba273531.png","shortUrl":"upload://2eG0w8B8clgFjxMNrbvOjx7D8xX.png"},{"name":"拜谢","url":"/uploads/default/original/3X/1/c/1c836ff23328d80a7da6d69e4b36e1cfa8bf66af.png","shortUrl":"upload://44eYhojrMPPJ0d6uSoGaMiA9vD9.png"},{"name":"元宝","url":"/uploads/default/original/3X/8/8/8810ee0460d7ab7f2092bd510e43f3f7e1522d2f.png","shortUrl":"upload://jpHcSPvIezXLktlWZ3sVfXvhhM3.png"},{"name":"牛啊","url":"/uploads/default/original/3X/f/9/f9e61c1efb194d591fa03cef9f22bc6748909ed9.png","shortUrl":"upload://zEHTGKdWioRTfNjSFibi3bFcgcx.png"},{"name":"胖三斤","url":"/uploads/default/original/3X/8/8/88179b7ef7537be258bac81734f7c5605625abf1.png","shortUrl":"upload://jpVvUbfEFLO00WvkHiknhVSINiN.png"},{"name":"好闪","url":"/uploads/default/original/3X/f/9/f9f1649284e07a105e9e164a3323d20c86079dbc.png","shortUrl":"upload://zF64sCeNJuK6hXoehD2Kfskh5Uw.png"},{"name":"打call","url":"/uploads/default/original/3X/7/2/72badcc43a8968e3d19763d7a018f9335355f65c.png","shortUrl":"upload://gmWMvApjCauHWHVWtm6DBZDCXkU.png"},{"name":"变形","url":"/uploads/default/original/3X/1/f/1fb45aa46d9ae6abccd01f01cb8af7c301f3c84f.png","shortUrl":"upload://4wtcV5xUttwO6UofB3FMucGKqE7.png"},{"name":"仔细分析","url":"/uploads/default/original/3X/3/9/39f8e297aac767767b3ce385ac0b4ee59da5c9f6.png","shortUrl":"upload://8gQrSNJBrgXzyQ0eYLjRwxAQJtY.png"},{"name":"加油","url":"/uploads/default/original/3X/3/d/3d1850621234c49431af2773aaa31fab0519332f.png","shortUrl":"upload://8ItdwJRHs86Kq8YhuUakI9bhBYb.png"},{"name":"菜汪","url":"/uploads/default/original/3X/3/9/39822224d1f9fd020c58cd371375c12d73f9c1ba.png","shortUrl":"upload://8cK1zbWwDCHBQUpbvqA0PFJ9aqu.png"},{"name":"崇拜","url":"/uploads/default/original/3X/e/2/e242d6f65c0e19661d6e576314a71d96d7adfd64.png","shortUrl":"upload://whB6VpST8o37Tf3wQZtNNPrhQxe.png"},{"name":"比心","url":"/uploads/default/original/3X/d/e/de6eb6665715ad02214adc2958b3950aa393c69d.png","shortUrl":"upload://vJJcktudVPFvHE7MG4wgyKKI0Xj.png"},{"name":"庆祝","url":"/uploads/default/original/3X/1/a/1a619e13c7d1cd29f65487c6600e08a62af43d00.png","shortUrl":"upload://3LnyDMUlrqU6qeaca6UJ8WMsX2U.png"},{"name":"吃糖","url":"/uploads/default/original/3X/4/2/4290980b2c3bc797fd09575970e698ec84d6b227.png","shortUrl":"upload://9uRiQWtKJ7zZ8Cq48sWDJOYiTeT.png"},{"name":"花朵脸","url":"/uploads/default/original/3X/0/5/05c53eaaac5918c0f0e3b4d49afe38c0398a81bc.png","shortUrl":"upload://P2YUebyFSRxo1o72lBve5ZgXWk.png"},{"name":"我想开了","url":"/uploads/default/original/3X/5/4/54d8d4269f0c18eee1f50a2472f9ac61e4f8b06a.png","shortUrl":"upload://c6AEYtW37PlUYATOgdXi5DhCZ98.png"},{"name":"舔屏","url":"/uploads/default/original/3X/b/2/b25008f85d3e4a94953285407f90819b9f7545fc.png","shortUrl":"upload://prqsLHn6SU6wPKWSuHOu9U6uIvq.png"},{"name":"热化了","url":"/uploads/default/original/3X/9/1/910da7d3a997ead6508492c664c26bdc60568016.png","shortUrl":"upload://kHcuo7ANtUlijJC6RP2mNJs8MpE.png"},{"name":"我酸了","url":"/uploads/default/original/3X/9/6/9643b6015ce2cf0b511b1bb502e75f77ea02fa0c.png","shortUrl":"upload://lriGOLCt2ZooHsecDcx8PwzQZw8.png"},{"name":"举牌牌","url":"/uploads/default/original/3X/6/d/6d90da43494bea32b359a28425278dac973a0406.png","shortUrl":"upload://fDgo9jwNKUJv6vtI7z5xUElEGEu.png"},{"name":"豹富","url":"/uploads/default/original/3X/3/6/3684a60df913d681b57390e503d50ce6bc7a1363.png","shortUrl":"upload://7MhYS91NkwOBh08fSq5fy9Pg2nV.png"},{"name":"虎虎生威","url":"/uploads/default/original/3X/6/4/6426bd1038a5a9dc527cb9c4fa8902854290157f.png","shortUrl":"upload://ehYK7Mv5Oab0ASdNJF5T8lpuOSz.png"},{"name":"绿马护体","url":"/uploads/default/original/3X/d/6/d68b926569055d7049525d95449f4349b34d3d06.png","shortUrl":"upload://uBXd1gvbsuGNA9K2Wiy3WrY9Sxo.png"},{"name":"右拜年","url":"/uploads/default/original/3X/0/e/0e8778ac0ea20143725f4c8cb8749bee10fe2c54.png","shortUrl":"upload://24wVHuAro2BPl4iGEodt584FDFi.png"},{"name":"左拜年","url":"/uploads/default/original/3X/3/2/32e7a7ae520094dcce8f1bdac6c7fff014980063.png","shortUrl":"upload://7gkbUlL4ythguHh6ckmujL4WfAv.png"},{"name":"拿到红包","url":"/uploads/default/original/3X/7/c/7c6ffbd4f4f59bac7a575230bb16a2ba637e8d5a.png","shortUrl":"upload://hKP852XZBTLFn7DcDvbdzzt1MRs.png"},{"name":"嗨皮牛耶","url":"/uploads/default/original/3X/2/b/2b964c6da39caf3a18d98717071cacafc4be1e8e.png","shortUrl":"upload://6dAxKBL9eKJ25EhL3mX3G8eUViK.png"},{"name":"烟花","url":"/uploads/default/original/3X/6/d/6d969a5fd9fcec55b8dc75f2f2895ad9ceab8013.png","shortUrl":"upload://fDsI0myqGlZN7jEsX8kKyDXt3zB.png"},{"name":"太南了","url":"/uploads/default/original/3X/6/1/61bf8c2c1bf73d16903b40f1e27495c0427e83cb.png","shortUrl":"upload://dWIHBIZFC84NtgprpRXC3HdkWuf.png"},{"name":"菜刀","url":"/uploads/default/original/3X/0/2/02ce1542aaa73e240dfe8b857593c6172fcc9880.png","shortUrl":"upload://oOu7yjTC1Mb3mBEGX1axIJb692.png"},{"name":"西瓜","url":"/uploads/default/original/3X/5/3/53739651b9787cfaf10a5b06f3fbaa35a39b43e5.png","shortUrl":"upload://bUfh0YDuxOWXY85R6YFYcLOLF65.png"},{"name":"啤酒","url":"/uploads/default/original/3X/7/0/709906bd2827bbf7031452023c620e0ad6142732.png","shortUrl":"upload://g45kIbTKHjpXLujWOblgMNEkFAm.png"},{"name":"篮球","url":"/uploads/default/original/3X/9/7/97779c79dae95181a5391f59a8f5d622d704e374.png","shortUrl":"upload://lBWmyVE4EaEo2udRZg2Vl91lbWQ.png"},{"name":"乒乓","url":"/uploads/default/original/3X/2/f/2f54d56936b37f93bd5a3f454e9b4bcd3f7060b4.png","shortUrl":"upload://6KIcaJbJpoT6Xy7RxdEJ7LC5UKo.png"},{"name":"茶","url":"/uploads/default/original/3X/6/f/6f7f5721b4d3ae91955a6c977a5b13aa78ca2fc5.png","shortUrl":"upload://fUlP842hfEdALLXnA7WwejDnAdT.png"},{"name":"咖啡","url":"/uploads/default/original/3X/5/4/54bc7c76eb7ad769b253090b247e3110fa6f9cb3.png","shortUrl":"upload://c5BW72KC1qsYkRdR9NuqiaQZP1h.png"},{"name":"饭","url":"/uploads/default/original/3X/2/b/2b4a6790b7d457cbe4674361c307e4cd9b105998.png","shortUrl":"upload://6aXWpZM3xuZ2v7RtqwshQedqneo.png"},{"name":"猪头","url":"/uploads/default/original/3X/3/9/39dd0cbf18970d5cc895c09bc15874d094130e20.png","shortUrl":"upload://8fSOoqZKhL1jAz2NQESYFmrYYVi.png"},{"name":"玫瑰","url":"/uploads/default/original/2X/6/694f885b12749e87d455b4223e2978519c8a10e3.png","shortUrl":"upload://f1Cx081vqkYClArAjwuzghwuwsH.png"},{"name":"凋谢","url":"/uploads/default/original/3X/6/a/6a30a23574808963758fa0ad5762fcb263bac10b.png","shortUrl":"upload://f9oO9xWYZf1rcjT3J3gqdlIhLPt.png"},{"name":"示爱","url":"/uploads/default/original/3X/1/b/1b4459c7aa5a77bd404135fe762451edc583336f.png","shortUrl":"upload://3TdkBM46Ke94HZnP2KbPZAsnIyX.png"},{"name":"爱心","url":"/uploads/default/original/3X/c/3/c3242bfc14d4850213368488a86a61388247ac3d.png","shortUrl":"upload://rQiBtFTQ9YK2xiLIIO5dUEkt2dT.png"},{"name":"心碎","url":"/uploads/default/original/3X/e/3/e3637d123d94e268f2d5f1cf7f1eb1906a06b54d.png","shortUrl":"upload://wrzxq6b7sPZ1KeXyCyXc0AcNwW9.png"},{"name":"蛋糕","url":"/uploads/default/original/3X/1/5/15790b76df7479a1b886cb8ff5c3499d520dda13.png","shortUrl":"upload://33XmzIoTFN2VaL6TgWOIy7YVusX.png"},{"name":"闪电","url":"/uploads/default/original/3X/d/0/d0fdd341bebe5e8e90c23a5c2914bdefeba32a91.png","shortUrl":"upload://tOP8aXuFHXg1kdNxqO8ViVhk1WN.png"},{"name":"炸弹","url":"/uploads/default/original/3X/f/0/f0fde51852e9b4a1f17a4622f6a037f6a5147378.png","shortUrl":"upload://ynUyJvSBptHsjuqPkYEcg2yugGs.png"},{"name":"刀","url":"/uploads/default/original/3X/7/b/7b537c77acfbfb7dc588cb31b6e055703023dcd7.png","shortUrl":"upload://hAZB1JIAzaEqSFHLKqLQ4BmtGT5.png"},{"name":"祈祷","url":"/uploads/default/original/3X/3/c/3c4e634f83d3ed9ff201bb9e3861ecf287808c68.png","shortUrl":"upload://8BuANMJTkPqq2JmZ9BD8OpXdwtW.png"},{"name":"足球","url":"/uploads/default/original/3X/0/e/0ef29bd9b235b6927f862c6c86ff87e41ad35daf.png","shortUrl":"upload://28etex4NnE344Lx96js1uDbsdHx.png"},{"name":"瓢虫","url":"/uploads/default/original/3X/7/f/7f33971f77f93a9915752cdfe212905f05463476.png","shortUrl":"upload://i9hazqpUNORN8ZPQ0pjYrKhfoHk.png"},{"name":"便便","url":"/uploads/default/original/3X/1/6/16660e0a9d431bdafcab55d49aeee8b3f119b4da.png","shortUrl":"upload://3c99F6X86ZLy1CZnNBj01832Svw.png"},{"name":"月亮","url":"/uploads/default/original/3X/5/a/5afa27f01cf45f43a798db800342638d22bee619.png","shortUrl":"upload://cYOVBw5lSZGE0yizj7MKK1oCOrn.png"},{"name":"太阳","url":"/uploads/default/original/3X/4/d/4d599755ace311c9726b80e48a4650b79e20b304.png","shortUrl":"upload://b2gIeexemJEe8qQrwiXCDz30Q2E.png"},{"name":"礼物","url":"/uploads/default/original/3X/8/7/87cd5efc30cfd4036634806efe6ce061f9b0e4a7.png","shortUrl":"upload://jnmsLkm6foKR1rgwxXms1TAJuZN.png"},{"name":"拥抱","url":"/uploads/default/original/3X/a/6/a63cf81e0694dae6cade48b12e1e576f6dedc4f7.png","shortUrl":"upload://nIBSVRvK3DWWHrcIxZoEN0hDquP.png"},{"name":"赞","url":"/uploads/default/original/3X/d/2/d24e8331d0d67514c837492ab945467992fb1759.png","shortUrl":"upload://u0stOYQhq5bNSVSjXUUnQZLNWFX.png"},{"name":"踩","url":"/uploads/default/original/3X/e/4/e4c1aa49852be08ffe9f1107fcb04cfd859a56ba.png","shortUrl":"upload://wDFMUWgBy5VEbpFflsG4Vqs0ivM.png"},{"name":"握手","url":"/uploads/default/original/3X/6/4/64c2d7e686e1d40cfbd79474189bad3dd8a3319e.png","shortUrl":"upload://enncdlGgUvC9GjUiMhEZpbxLWQC.png"},{"name":"胜利","url":"/uploads/default/original/3X/b/3/b371bd1cb36083aa8766b1b60cdf1f0de6872586.png","shortUrl":"upload://pBr9nzd3P4TpKbYJli8lhY8fY5o.png"},{"name":"抱拳","url":"/uploads/default/original/3X/b/f/bf12d57b7c09880e078235e49487300f397ed10c.png","shortUrl":"upload://rgjxZNf7IoHjKj1a8TlOCqiH6EY.png"},{"name":"勾引","url":"/uploads/default/original/3X/5/1/51e744fface98835068e63b8f173a7c228c78a03.png","shortUrl":"upload://bGyaoWYxw8Vkkluvg26SzfXJPBp.png"},{"name":"拳头","url":"/uploads/default/original/3X/d/c/dc5c95df97cc4f471fd98e751e931a13fe947453.png","shortUrl":"upload://vrppe6C0CzeLiTqkfmTCjqyWJjR.png"},{"name":"差劲","url":"/uploads/default/original/3X/f/4/f4b2f9439f430eb19923efe994198451f4a06cf8.png","shortUrl":"upload://yUHX23ujVhaXQxTrBr2hfTkgNgQ.png"},{"name":"爱你","url":"/uploads/default/original/3X/c/7/c72faffed59c4ab6f88bafb7170a4ae3421722dd.png","shortUrl":"upload://sq5bzcX5E4xhpHVbd9nGZeDFsAd.png"},{"name":"NO","url":"/uploads/default/original/3X/b/5/b52360293b4834d8d60d708da08c4bb0ef420909.png","shortUrl":"upload://pQqdgWXXSAK8o5tO2nu6x7x4bmV.png"},{"name":"OK","url":"/uploads/default/original/3X/6/0/60149b67d707fc242f13fc5a481c934ca6465182.png","shortUrl":"upload://dHXZedPbw1qZ66L25oCTHzJlPDY.png"},{"name":"爱情","url":"/uploads/default/original/3X/0/c/0ce434bfa5fec9948e2051770694b5cf3130bacf.png","shortUrl":"upload://1Q2EQCFTJukeMhk3rPPffLyInCv.png"},{"name":"飞吻","url":"/uploads/default/original/3X/5/4/54671743329a6c305a3f22779bf3f1422710f11f.png","shortUrl":"upload://c2EYG4j6Wt9ts9VsO2n4KIXxCEL.png"},{"name":"跳跳","url":"/uploads/default/original/3X/9/2/928f62148deab2e9f8604bf68fe1331206a90cff.png","shortUrl":"upload://kUwUgSqMnslvegSVHqbGVm6xlo3.png"},{"name":"发抖","url":"/uploads/default/original/3X/d/f/df59465e768baf668bd4a909c64e374c578e3f54.png","shortUrl":"upload://vRPKhnnb1ZWztpNWukKKX2mmEqU.png"},{"name":"怄火","url":"/uploads/default/original/3X/b/0/b0cb1fd0c8865d5e8da3914a6e592f4425d015ad.png","shortUrl":"upload://pdZe2TN9NVNDL2fce2ixkzgJ43H.png"},{"name":"转圈","url":"/uploads/default/original/3X/e/0/e04d37edfb15d04f67e0806b35136b00a917278f.png","shortUrl":"upload://w0gonsEVrkyQOBBnjXTq5wreWxF.png"},{"name":"磕头","url":"/uploads/default/original/3X/c/c/ccc35ee45f86130b7c5b039ef77db46376d9c3bc.png","shortUrl":"upload://tdpYZmL7KQPMi76O1wQe3CQxXeQ.png"},{"name":"回头","url":"/uploads/default/original/3X/0/8/08e7c69a23e554268a0f5fb6736f93b85aad6b68.png","shortUrl":"upload://1gMoCsCmgqMFVtftwq7POHk1BsQ.png"},{"name":"跳绳","url":"/uploads/default/original/3X/9/0/9001251705f719e8709af3b50a53c3c863300048.png","shortUrl":"upload://kxVcW1Lg54CBSJinPRNbtCyNwOk.png"},{"name":"挥手","url":"/uploads/default/original/3X/f/9/f911a73e75461b7938bb786fc0e19103ce81dfaa.png","shortUrl":"upload://zxmI9wExqkUXYEuEjpqbD9sBnLQ.png"},{"name":"激动","url":"/uploads/default/original/3X/0/d/0d6369a1fd32557e1d9c2fbf262dcc4115430f58.png","shortUrl":"upload://1UrcfUPGbRHURb4Cm57OX7YMH6o.png"},{"name":"街舞","url":"/uploads/default/original/3X/7/d/7dee9dde84844c76ef2c8c943354c8a0dc78bc17.png","shortUrl":"upload://hY2UTylTAmaY7hcasI04cVwAKrl.png"},{"name":"献吻","url":"/uploads/default/original/3X/a/5/a5e1ecc1a24771d63fc32dd688d0ea764830fd80.png","shortUrl":"upload://nFsP6L6DAEsmJgCIsuhOwsREsqQ.png"},{"name":"左太极","url":"/uploads/default/original/3X/6/7/675ea3296299a681cb1d131d295812f7148bdeb0.png","shortUrl":"upload://eKrWdGtWmsKaaW5tfWA3wT5z9vO.png"},{"name":"右太极","url":"/uploads/default/original/3X/1/b/1b6ea69004bb62ff6f578bc04a74a7a5d982ba4d.png","shortUrl":"upload://3UFXuGcOya129Brnh5WtCJdo0k5.png"},{"name":"双喜","url":"/uploads/default/original/3X/5/0/5090318ce758f142577971cb6dcc9edd73a1c5f3.png","shortUrl":"upload://buH87cqShuTbMAvaBC4tQjAYvNp.png"},{"name":"灯笼","url":"/uploads/default/original/3X/3/2/32ce482c5257121f5496afd72ed30e1ab5a0de57.png","shortUrl":"upload://7frPuu5m3wviijEReeDhgq3aNTx.png"},{"name":"K歌","url":"/uploads/default/original/3X/3/5/3593122c004f56f153fb24ff68a2638fb39d0cb9.png","shortUrl":"upload://7DWp3dFvTBEgwbahzjpgaEeo0xr.png"},{"name":"喝彩","url":"/uploads/default/original/3X/f/b/fb98a45fb0bc49d6ddd2213706b3ee79ac5c9768.png","shortUrl":"upload://zTISvNWtQ0U42MYhxhgbO80VdJm.png"},{"name":"爆筋","url":"/uploads/default/original/3X/7/2/72d8a3db6c92f8e24ab03b1932d8d0ce0e13d728.png","shortUrl":"upload://gnYA0IYDiOLEmiDeJFuicjO3W2s.png"},{"name":"棒棒糖","url":"/uploads/default/original/3X/a/c/ac21312d937e25714080f339f79a53ba2a459ab6.png","shortUrl":"upload://oyJeNr3FLVrZIR6Ow1Am39yCk3s.png"},{"name":"喝奶","url":"/uploads/default/original/3X/1/b/1b9c0a5d012f07400dec03780703e2a2348336f6.png","shortUrl":"upload://3WfcPicuEPE0tW6WFfpWSqBJiiG.png"},{"name":"飞机","url":"/uploads/default/original/3X/0/4/04712a0b7a6080365ed7962f9dd7b313921def3d.png","shortUrl":"upload://DimvV5qCln5h1Na01GUzGJDzLT.png"},{"name":"钞票","url":"/uploads/default/original/3X/6/a/6ae76c918fc046a24fd28cbb67d10c5204dab45d.png","shortUrl":"upload://ffIr0R7wN8BdbddCoLF8qJ5VLlz.png"},{"name":"药","url":"/uploads/default/original/3X/f/a/fac7679efd1397647a28ffe4fff35b26214a7318.png","shortUrl":"upload://zMuABlzsozPgJSxBq8fJP9uvyY0.png"},{"name":"手枪","url":"/uploads/default/original/3X/f/1/f1510aa050bdedd928db3b3caca49f55657a4826.png","shortUrl":"upload://yqMHsGhsWpP6Fe58JqlLW0lO5dI.png"},{"name":"蛋","url":"/uploads/default/original/3X/c/e/ceea7d0229eeb87e56d0f67db20f5b4b84838084.png","shortUrl":"upload://twsKmzMwoYmsbZ5kEMrFiaJEGr2.png"},{"name":"红包","url":"/uploads/default/original/3X/5/f/5fa94bec644a7fdd246e794a4517cf262b6d9e9d.png","shortUrl":"upload://dEg4HT4I2Y0LyoKh6AcpjRoilbf.png"},{"name":"河蟹","url":"/uploads/default/original/3X/8/e/8ecf1da1cd072c3512b644d47c00f970b32f869c.png","shortUrl":"upload://knlxK6t46M1V3vbgOvvcdklKQhe.png"},{"name":"羊驼","url":"/uploads/default/original/3X/a/9/a911cbae09d5bf444aa3f4cd808b8bc52c350c5f.png","shortUrl":"upload://o7EONZ8a17ykMrBz0Sbqszuryd9.png"},{"name":"菊花","url":"/uploads/default/original/3X/2/6/26de50e37b4d3b970887129b2b156c32ba50fa14.png","shortUrl":"upload://5xQs7P7qPKPWCbXbjOfIY0U2Hcg.png"},{"name":"幽灵","url":"/uploads/default/original/3X/8/8/88c15740934bb64247bbdc156faac597ea5b0566.png","shortUrl":"upload://jvNalaolICaZyRtYe1SpXUFOtMi.png"},{"name":"大笑","url":"/uploads/default/original/3X/1/a/1a3c976896ee9ad61473aa89e2356d0022554430.png","shortUrl":"upload://3K6ejaiDHtvsjtqpi3hOQwZSbwA.png"},{"name":"不开心","url":"/uploads/default/original/3X/8/5/85cd1e77d0bb994e03e159f93348966d91ec41b7.png","shortUrl":"upload://j5EY4XYaBnzhGL938RDhCnBAk4v.png"},{"name":"冷漠","url":"/uploads/default/original/3X/9/c/9c62c86e8df62a02b1162e29737e7f2ad1316162.png","shortUrl":"upload://mjs7RDpVdmPfygaAV0ioJRuAL18.png"},{"name":"呃","url":"/uploads/default/original/3X/0/2/0279aa402cfa1f8f4b980eb9d966a1d54e673210.png","shortUrl":"upload://lTCvtibCGmkK5OgQu0lP9eKWzu.png"},{"name":"好棒","url":"/uploads/default/original/3X/6/4/64411fd2a074c5780b7ff9d08cc741392c050cd8.png","shortUrl":"upload://eiTh3Z9mBbr6wBvtDzvFgvVigsM.png"},{"name":"拜托","url":"/uploads/default/original/3X/a/0/a0cab05a8a6be01872a10b0e9d55f81f585a014a.png","shortUrl":"upload://mWqEyJE4gUOMrhKFARl7LbBZgMy.png"},{"name":"点赞","url":"/uploads/default/original/3X/7/5/75a6d5c40e22ccc69edd8d8d4807cd97af66638c.png","shortUrl":"upload://gMNiZUWLaFihwI1ZavDdg2IEpic.png"},{"name":"无聊","url":"/uploads/default/original/3X/3/b/3bb2a4806b5842622d90b01e66f3aa5eb05cd31d.png","shortUrl":"upload://8w6UsQ8E3uT3TRcHWzCTSojngqp.png"},{"name":"托脸","url":"/uploads/default/original/3X/6/6/66377a52fa400a51602656f464354c41944ed839.png","shortUrl":"upload://eAfySXHGv71dpAKsQmsFaRvSUE9.png"},{"name":"吃","url":"/uploads/default/original/3X/4/e/4e81083806199ad0169e8e75ac1ab87fa779d8ff.png","shortUrl":"upload://bctGWKVtVb4rOtTxLyO4Rez4P6L.png"},{"name":"送花","url":"/uploads/default/original/3X/e/f/ef9748790ce9d71e05e7d404b45fc4e4690db736.png","shortUrl":"upload://ybweKMOHofctqjhLt1qc5yle05w.png"},{"name":"害怕","url":"/uploads/default/original/3X/1/b/1b5e818f87034813609d41bf66bed6aadd9aba05.png","shortUrl":"upload://3U7mWAl2YoAqHcEFcBfPuLD6sxT.png"},{"name":"花痴","url":"/uploads/default/original/3X/e/b/eb5f911a65042cbea1fee68187f556fdf1514ed0.png","shortUrl":"upload://xAcXiMC6Qli3NeHAQqFoPvzgq3u.png"},{"name":"小样儿","url":"/uploads/default/original/3X/1/2/12cdb7779701af18928a236ca66c3169f98af710.png","shortUrl":"upload://2Gll6ujsGZvPUx3svD5mfLl5eIE.png"},{"name":"飙泪","url":"/uploads/default/original/3X/3/1/3130256a05fa08d540be64e415466b62f4a92bc6.png","shortUrl":"upload://718y1cIapPRYOJPdbgzxwskmVq6.png"},{"name":"我不看","url":"/uploads/default/original/3X/7/0/70383e135b36384b08a6b110641933068b415b5c.png","shortUrl":"upload://g0JYupGoziT5at9whJWhUx03ac4.png"},{"name":"汗","url":"/uploads/default/original/3X/1/2/1258583ccdd0e63a0e339b4b068c3866a8ab52c2.png","shortUrl":"upload://2ChS4e3JgPGLLDO8XZ5Nif3tmRI.png"},{"name":"打脸","url":"/uploads/default/original/3X/c/6/c6fdcfa43782c4eb6bbdd428388e177b502e1c2c.png","shortUrl":"upload://somkgGAqBzh0qBKOGVuhyZMRm4A.png"},{"name":"击掌","url":"/uploads/default/original/3X/5/f/5fa721b7cd6c94a1b1f3e685bb4b30dd0ff9e8aa.png","shortUrl":"upload://dEbr8DJ1AA6NgrWyJuKEHmYXlyO.png"},{"name":"头撞击","url":"/uploads/default/original/3X/5/e/5ee8a647d66efdc7e8e35daee156fbab8f0d6cb7.png","shortUrl":"upload://dxBkytt1BWtwFEvXlySLIfrYyrR.png"},{"name":"甩头","url":"/uploads/default/original/3X/d/7/d79706e648dd29d6b9f5039435873dd821c13478.png","shortUrl":"upload://uLcefJ1hcOpDgWmSxcR27AgNI0g.png"},{"name":"扔狗","url":"/uploads/default/original/3X/5/f/5f846790ac1256b1848726e8cf49166c14328f40.png","shortUrl":"upload://dCZ2b3Lpb20aZFSuGoHibc7LFyE.png"},{"name":"糊脸","url":"/uploads/default/original/3X/2/1/21c4b8b4eca94c6061f8bc524b19902c86fb1bc1.png","shortUrl":"upload://4OJehIYDu6bs9AF6YRzCZndbhjb.png"},{"name":"偷看","url":"/uploads/default/original/3X/c/1/c15cd922efaa6da2d805af412e70d7936cb54714.png","shortUrl":"upload://rAz4QjlqMbHJEXGuDFOVa9Cww1m.png"},{"name":"拍桌","url":"/uploads/default/original/3X/4/c/4cdef4920d27c480ba9c5dc133e9688703767f3e.png","shortUrl":"upload://aY1XYFzYXMtVvSusZElopAr16Ee.png"},{"name":"啵啵","url":"/uploads/default/original/3X/5/9/59da0c1519983e50996c0d191977572a31cbaef9.png","shortUrl":"upload://cOREQyO593QtZMQaThAVMbI1w2B.png"},{"name":"扯一扯","url":"/uploads/default/original/3X/6/7/673d872b2c86568818f095e3c9d8129b28768d11.png","shortUrl":"upload://eJj09Y9BwOpf7V0qHcKFDrTsSfD.png"},{"name":"喷脸","url":"/uploads/default/original/3X/f/c/fc4e9adba9137df0d930e69b66450aa5ca6faca1.png","shortUrl":"upload://A00JqU0yNHIIwg4zCDQSCwUtIVb.png"},{"name":"拍头","url":"/uploads/default/original/3X/a/6/a60eb6c41567faf9ce949c18fc9a300922fea57d.png","shortUrl":"upload://nH0MDMAvVfs6DzHp7hKMoFJrhXn.png"},{"name":"舔一舔","url":"/uploads/default/original/3X/5/6/5673cbbcae74ca4b9ce11f1f944902196390a58e.png","shortUrl":"upload://ckN9xF3cjBrfBIYZ4HczUjDkKAK.png"},{"name":"干杯","url":"/uploads/default/original/3X/4/2/42fef0dfb4f1c0269bfc7efc9837ac3fceaecd85.png","shortUrl":"upload://9yFIJcO4DyPszptz6x3Dvgyc5CZ.png"},{"name":"扇脸","url":"/uploads/default/original/3X/b/5/b529664e58aca2f878fa34aa29755e673f417480.png","shortUrl":"upload://pQD7t203UyVE8rDdMysWOqDQVeE.png"},{"name":"蹭一蹭","url":"/uploads/default/original/3X/c/e/ceed6676bae3726005897c331811231862727048.png","shortUrl":"upload://twyZauxXCz9ssd6G6byFl6BAWxO.png"},{"name":"撩一撩","url":"/uploads/default/original/3X/2/5/25e1e6480e49be35a8a135f38ce64fe8f476195f.png","shortUrl":"upload://5p7ExIq0ENLTwIN6qSCWfVtQh1d.png"},{"name":"哼","url":"/uploads/default/original/3X/8/4/84bedbde1c6980a99bd2e12f516f8f90a6a9d6d2.png","shortUrl":"upload://iWjWeJp8d5MUTouG5ShNVEDaMhk.png"},{"name":"掐一掐","url":"/uploads/default/original/3X/4/3/43dfb9b81a53d8ef345cee0dce1e4f7361a09135.png","shortUrl":"upload://9GrjQxlY2jWtGy6prR6ZJxj7vlb.png"},{"name":"顶呱呱","url":"/uploads/default/original/3X/6/b/6b6e4b1d6b594d2a05da6f20825c5c59c49cc14c.png","shortUrl":"upload://fknoirGoVGQ9JYUByXgv7lefDQg.png"},{"name":"抱抱","url":"/uploads/default/original/3X/5/0/50674b6f4997823e89982c2fcb15b8394c69cd72.png","shortUrl":"upload://bthvkUgIBQs2n7K4btH79z4Bm6K.png"},{"name":"原谅","url":"/uploads/default/original/3X/a/d/adcf1702016e8a49921873c5f8067bc1db5268ce.png","shortUrl":"upload://oNAi0hMTGEtobc1zEmZHRUbjYBg.png"},{"name":"佛系","url":"/uploads/default/original/3X/d/5/d5c3647c6e008763d039d0c197cd361b2dbc7b2f.png","shortUrl":"upload://uv2kjTDIVAeHq8Iu0cwdvTTC8yP.png"},{"name":"拽炸天","url":"/uploads/default/original/3X/8/4/843b89efa0a5b82b64bb9ba86230ad8b29e766ae.png","shortUrl":"upload://iRMAq1WPN7Lr8N7OzlQuKeZDmgu.png"},{"name":"颤抖","url":"/uploads/default/original/3X/1/d/1d565cd88787a28a0b2eb1afce5e138f2640974a.png","shortUrl":"upload://4bwSqnjNCKBRz0Q62eagJyKPqDE.png"},{"name":"生日快乐","url":"/uploads/default/original/3X/a/c/ac0394d60ecf22ba2301c6cbb489c129d1bbf381.png","shortUrl":"upload://oxHNtyKLTK3eluVcFcGe6wwatfX.png"},{"name":"嘲讽","url":"/uploads/default/original/3X/d/4/d49f0e82bdbf5ab68ee1129a967c9bdd1eba1942.png","shortUrl":"upload://ukW04fwgLGrBpKUvtVe1IBQlVVo.png"},{"name":"开枪","url":"/uploads/default/original/3X/0/1/0149aaf70582cc54c6820e624622c270907bd2c6.png","shortUrl":"upload://bojdUQSJA0awMQkWuuGiKmKuHQ.png"},{"name":"啃头","url":"/uploads/default/original/3X/7/5/750063281ec55fe38f8725e437ff3c5374bbea25.png","shortUrl":"upload://gH2H1kFeMTNLuPftIVaMwoqVWL3.png"},{"name":"恭喜","url":"/uploads/default/original/3X/5/2/521a331e7805200c002a49be45d27c9e13b84660.png","shortUrl":"upload://bIjhG4Toc4Vwnw3BYHzGxvYZ8kM.png"},{"name":"惊呆","url":"/uploads/default/original/3X/4/0/40e1f08cd7847a4034b4074f35de238e1bcf76dd.png","shortUrl":"upload://9fYD9LQZlNSS11RikErELLHotzv.png"},{"name":"暴击","url":"/uploads/default/original/3X/7/c/7c4e3f909c6ba695fbc94f08941bb49b96ffcb03.png","shortUrl":"upload://hJEQRbzTH4XqqrrBNBxr0BnQL2r.png"},{"name":"拍手","url":"/uploads/default/original/3X/5/e/5ef787827455fe69afdf870f00f3361c3a981ce9.png","shortUrl":"upload://dy7d6wCiDgWNHjeT28Bn8hxd6jL.png"},{"name":"1000","url":"/uploads/default/original/3X/d/1/d1843e832161dc1ade2889ff748de6d638a45d32.gif","shortUrl":"upload://tTt7DxOaEA8NXxfdUdcKkTXNBui.gif"},{"name":"1001","url":"/uploads/default/original/3X/0/d/0dc17563fde24c721472220bd35cd74572106bbf.gif","shortUrl":"upload://1XGGMZ54HwratU401sjpehLnu91.gif"},{"name":"1002","url":"/uploads/default/original/3X/c/0/c0872030d44d61dfab95ed5a640d5dfd53f76ae5.gif","shortUrl":"upload://rtbb9xaKD4FwP8RLQ5sO4DwwTsx.gif"},{"name":"1022","url":"/uploads/default/original/3X/8/0/8041a5a0932493953007feeaff11d86e43070def.gif","shortUrl":"upload://iiBLnGzTrYWaQy7AzxcyJ5Lm9sz.gif"},{"name":"1028","url":"/uploads/default/original/3X/5/6/56a5e546de7d3305f56ad990d456bc913b03b0ad.gif","shortUrl":"upload://cmwuvTL79vLoIzxsv0HM63yFAO9.gif"},{"name":"1017","url":"/uploads/default/original/3X/2/6/26b3e632c7352ed6bc798643f3a9541eef89fdab.gif","shortUrl":"upload://5wnzILv5DrZWsqNfMGmCVrnBTYv.gif"},{"name":"1027","url":"/uploads/default/original/3X/d/4/d410def3420164d544cf50b3fb7f96090c287d1a.gif","shortUrl":"upload://ug1mUf7923qL3fIo32sMbk310nw.gif"},{"name":"1029","url":"/uploads/default/original/3X/2/8/287e2a6245bb9b0f68bc558d03038d40c285177a.gif","shortUrl":"upload://5MdpfC7o4KLlYIGyqnWwI8572Xg.gif"},{"name":"1014","url":"/uploads/default/original/3X/3/2/3299c099563697509993238b7fbb93f2dbc89b56.gif","shortUrl":"upload://7dDhKT13y2Mnv9YzVy4k5ODhwAS.gif"},{"name":"1024","url":"/uploads/default/original/3X/1/6/16e3c359f5fb95385d0330e854280080655c0ec6.gif","shortUrl":"upload://3guu2vl3UbiHEkUzdjka2posd2m.gif"},{"name":"1030","url":"/uploads/default/original/3X/5/6/5668e8791fc6312dc9e0f6380622bdf9a831755b.gif","shortUrl":"upload://ckpPh4Be8WKGlyjq9bBJgO4BkzV.gif"},{"name":"1042","url":"/uploads/default/original/3X/f/b/fb00d6444fd3e9903917e3bf6a75f061f6d27d1f.gif","shortUrl":"upload://zOtDzDFaoa2rtbiqUJp1UNf9VtJ.gif"},{"name":"1040","url":"/uploads/default/original/3X/d/0/d074534f6d53f3d82af7b7a0852ca2bc932e9eb2.gif","shortUrl":"upload://tK4xtwEfYl93wkor2Vbn6IjcSTU.gif"},{"name":"1034","url":"/uploads/default/original/3X/7/9/79c63721ee107668f1b716cf4d44a222c8de2cb8.gif","shortUrl":"upload://hngrNyXXZKqCOA3SN5uSsgxIqvu.gif"},{"name":"1070","url":"/uploads/default/original/3X/0/1/015aadf0bef4bec5d573650a259324eef362dc7d.gif","shortUrl":"upload://bYKX5hcVE5eE3NAFIkWfQ1Z24l.gif"},{"name":"1071","url":"/uploads/default/original/3X/2/7/274c7176b44e455a9d31b2398d93bfea306aa1f3.gif","shortUrl":"upload://5BEoOjsXqn68F5jUFy4xpwvnUl5.gif"},{"name":"1072","url":"/uploads/default/original/3X/d/d/dd026c74bf4a3f88ddd9f4b5f037a3347bfe242c.gif","shortUrl":"upload://vx8IfbOt7OUoMp959vWVXHj1CPO.gif"},{"name":"1073","url":"/uploads/default/original/3X/e/2/e28d057a8d1c2d94d4792a6aa458999f00920ce2.gif","shortUrl":"upload://wka2O3xg3U1taeBhNFG7qJWzOSu.gif"},{"name":"1074","url":"/uploads/default/original/3X/e/6/e653e56f1af4488c830f26ca739fa9708a4dec36.gif","shortUrl":"upload://wRzz20NdfyjL8QYovYaiuyxQW2y.gif"},{"name":"189","url":"/uploads/default/original/3X/5/e/5e4c4cb2462ab741c88f9960d409cde7cccfb6ba.png","shortUrl":"upload://dsclUhsFIMZa3VGMnJJkRnuySE2.png"},{"name":"195","url":"/uploads/default/original/3X/6/5/654c8054e86c33ea92d94fd5541908aacb27bfa4.png","shortUrl":"upload://es87VcNJdcjTl6srvx5Km0gnCGo.png"},{"name":"196","url":"/uploads/default/original/3X/1/3/1374aeed9e4361b9474c34423841162f7c087c07.png","shortUrl":"upload://2M7411TQFxW7DwWimOhFJzqmTMX.png"},{"name":"209","url":"/uploads/default/original/3X/4/3/43778c8599b3cfaac92fcafcb5c23f11ee2c68b2.png","shortUrl":"upload://9CQ7Cnde8R6CddCdJZxSTgsZKL0.png"},{"name":"213","url":"/uploads/default/original/3X/8/e/8e1bd92a5b8967ac5d44f57ea5032e8e4c701373.png","shortUrl":"upload://kh9sRrHzc3KtD8hUhauXcWBtO03.png"},{"name":"亲亲","url":"/uploads/default/original/3X/2/d/2dddd6d0f50b60084023629171cca6bb3993778d.png","shortUrl":"upload://6xKM0qGsGiPaPcy8d8d211tjsQJ.png"},{"name":"栗子","url":"/uploads/default/original/3X/a/b/abbcfffad8e79889365a08dd10aa0898116d0ffe.png","shortUrl":"upload://ovgzPukoSRnDxpoHdoOCvQlOr2m.png"},{"name":"肥皂","url":"/uploads/default/original/3X/9/e/9e47807210a0a127a5d4e75d6998ee4c90ec2826.png","shortUrl":"upload://mAcDbNWS4Hje9d7bovxOKkWWHvE.png"},{"name":"下雨","url":"/uploads/default/original/3X/2/0/20d200849b84dfe7ed36eb913951d4ce6f2f4a9a.gif","shortUrl":"upload://4GlcN4wKOwd683TpFXGryN9N4M2.gif"},{"name":"不你不想","url":"/uploads/default/original/3X/a/b/ab4906d84bb628b3245fbc9dd6c7c716ba5a1962.gif","shortUrl":"upload://org6BqB0bi9B9QdO8WMfNVfiNUe.gif"},{"name":"中国象棋红帅","url":"/uploads/default/original/3X/1/f/1f110f7e2c5fef0fa6c3bfc564f524a7e160ce14.gif","shortUrl":"upload://4qPlV9n5N1XhCHAkKkc3wmJjK1C.gif"},{"name":"云","url":"/uploads/default/original/3X/2/c/2c6191b7b77d4ef50df19ae1916b73cd7efc23d3.gif","shortUrl":"upload://6kC35iTIkWBanYkqFfq3RE9tvRp.gif"},{"name":"伞","url":"/uploads/default/original/3X/4/1/41f2307151be00e586fabbc9b25a3e6f11e2f74b.gif","shortUrl":"upload://9pnVgm02BNNgkptYh7sDioak2SL.gif"},{"name":"信封","url":"/uploads/default/original/3X/2/7/27f35236ebb9355431fb135fa9123d409bf92da0.gif","shortUrl":"upload://5HpVWftMgMapjK03QG2qf4huMXS.gif"},{"name":"卷纸","url":"/uploads/default/original/3X/5/2/521754592086865d41fee28236b26dfa69c0cb16.gif","shortUrl":"upload://bId8pThpbswb454BKJjRyvf2szI.gif"},{"name":"哇哦","url":"/uploads/default/original/3X/d/3/d3b57a74b3bcc97fa5c77ce167dc498290b8fa58.gif","shortUrl":"upload://ucRyPDTA6YyoI4jpFbwYz8tAwmk.gif"},{"name":"戒指","url":"/uploads/default/original/3X/d/2/d273e1b30ed922dde9fa9433b6484e309737d0f9.gif","shortUrl":"upload://u1KxJmEpomuhHWLHfxJt1j0TwbD.gif"},{"name":"手提包","url":"/uploads/default/original/3X/4/c/4cdb78d9f2d2463965ec891384d99562492fa7e0.gif","shortUrl":"upload://aXUvhkh4xhvgdIwVxXO8HzDg0ve.gif"},{"name":"打call2","url":"/uploads/default/original/3X/0/7/075380edc4d5314558625e0b33d1c153bec1eb68.gif","shortUrl":"upload://12OfnhePJiTkYmlFjiLA8f9MJv2.gif"},{"name":"打脸2","url":"/uploads/default/original/3X/c/f/cf33fa2a1512ce567181a232eac19ab66a22843e.gif","shortUrl":"upload://tz0cdnPwBW0WhKYUpph67V37fuC.gif"},{"name":"气球","url":"/uploads/default/original/3X/4/4/44dfb5c84bfad88ee8db8c81b4e6aa93a12281d8.gif","shortUrl":"upload://9PhLphJPFItYbkUkOaxF4yMqTaw.gif"},{"name":"汽车","url":"/uploads/default/original/3X/7/1/71f24d02935d2620d6bad1c8cc26b455f11a26d8.gif","shortUrl":"upload://gg152q0zXrs6Zlny0EgAST6sNcc.gif"},{"name":"沙发","url":"/uploads/default/original/3X/1/0/10a514109286f7233012955043785f85736d74b9.gif","shortUrl":"upload://2nfjJCIBCxgv4PppIsqlt6XeBol.gif"},{"name":"没眼看","url":"/uploads/default/original/3X/1/b/1bfafa8b4d183ec3dc2fe74adaeb6943334eea50.gif","shortUrl":"upload://3ZwBSV29QUvDkEa32yYCtyRg9yw.gif"},{"name":"滚","url":"/uploads/default/original/3X/f/d/fd92c1928baa36d418f850978098b713e56ff572.gif","shortUrl":"upload://AbddRyapYbODXzy04oOiedhoVXk.gif"},{"name":"灯泡","url":"/uploads/default/original/3X/0/4/04c24faf4e835d8f4ee7f41f549040601da10a82.gif","shortUrl":"upload://G6dD7BH0VnK7rBLVeRiiLn7xpo.gif"},{"name":"熊猫","url":"/uploads/default/original/3X/c/3/c35ae2f05563218a9ace1b5bf32f17c16329cac5.gif","shortUrl":"upload://rSbPsZnvYVBVRgDfbN7NvKiigD3.gif"},{"name":"考虑中","url":"/uploads/default/original/3X/9/d/9d0d12c73827abdfc1fd0917a721bd31d201035a.gif","shortUrl":"upload://mpkYhRsvNGlQjt1oxDVtSi9DEHU.gif"},{"name":"闹钟","url":"/uploads/default/original/3X/9/d/9ddd694a2843a8d8a0ac4fde52d42defab3daa5a.gif","shortUrl":"upload://mwxkJgAWJDAe9xHhyKqjDZ0lXLk.gif"},{"name":"青蛙","url":"/uploads/default/original/3X/0/d/0d6e6b2942ec2e39d3d1bdeb05c900f8a2e2139f.gif","shortUrl":"upload://1UOMe8CjJvVFLPK28Twi7HZZGI7.gif"},{"name":"面条","url":"/uploads/default/original/3X/3/b/3bc989bfd409bd455606a8f0955dd9dc82848e55.gif","shortUrl":"upload://8wTXM24ulShPMEzXe7sS9up7UUd.gif"},{"name":"风车","url":"/uploads/default/original/3X/6/d/6d31218bb8ff79606371d5f07d1835f85adb2f24.gif","shortUrl":"upload://fzXj2gVsz7slVlMgnOokFfy7ElC.gif"},{"name":"香蕉","url":"/uploads/default/original/3X/f/a/fab0eeaa93cc41be8f1a61beff3572291e6274d4.gif","shortUrl":"upload://zLIru1Q3z3EI8bhv0OlHkOfMzn6.gif"},{"name":"高速列车1","url":"/uploads/default/original/3X/2/1/217b6b9370034c77233dedd07e3dbc5c9bc4fc2c.gif","shortUrl":"upload://4McblVqn3pHisNjWAyFB4tjm47a.gif"},{"name":"高速列车2","url":"/uploads/default/original/3X/9/8/9883337157127febfc866b16a260d34121894f82.gif","shortUrl":"upload://lLbFG6pnpuP84cjrwo2j1pSjJXs.gif"},{"name":"高速列车3","url":"/uploads/default/original/3X/c/a/cad11bee1a8e30a47560849834005850ccafb7fd.gif","shortUrl":"upload://sWcsIBbQh3rPeB8HU4SPyyB7dRr.gif"},{"name":"麻将牌发财","url":"/uploads/default/original/3X/0/1/01cedb52f84a6b25259c0c365d3732a181078db3.gif","shortUrl":"upload://fZFi1R2tsHufrZjiGRtBqk7tfl.gif"},{"name":"微信_嘿哈","url":"/uploads/default/original/3X/7/e/7e1cebd7ca5b2a3782a4878254af6db247a276a2.png","shortUrl":"upload://hZE7JHMc8yJXTzfpw1lZ7jOYBVw.png"},{"name":"微信_奸笑","url":"/uploads/default/original/3X/c/c/ccb89f2d4640cb2edf28b53b9eb21e31acf6e211.png","shortUrl":"upload://td2Xapn2LolcTVcIRsTX0d8X0Hv.png"},{"name":"微信_捂脸","url":"/uploads/default/original/3X/0/0/004c5bccf651ce624720fa314b8395ec1636300a.png","shortUrl":"upload://2DB2W0THffebeoRXMHytb9ui14.png"},{"name":"微信_机智","url":"/uploads/default/original/3X/f/3/f39250685e9843c60f0249ef4a56cf8d42b88ccd.png","shortUrl":"upload://yKJv6YXNLo37FfkHqw03xzPjtut.png"},{"name":"微信_皱眉","url":"/uploads/default/original/3X/f/9/f9f62fb93b937dee20c4db19b28e12fbaa87c18a.png","shortUrl":"upload://zFgld5se00UUmPnluhA0auR1AVA.png"},{"name":"微信_耶","url":"/uploads/default/original/3X/6/2/629898d457b9f8569405d4c6ac4111661dc3a10b.png","shortUrl":"upload://e4dJeLq1OAg1UipcbcJhjg3srkT.png"}];
                // cSpell: enable

                if (new Set(QQ_EMOJIS_LIST.map((qqEmoji) => qqEmoji.name)).size !== QQ_EMOJIS_LIST.length) {
                    throw new Error('QQ emoji names are not unique');
                }

                const qqEmojiEntrypoint = document.createElement('img');
                qqEmojiEntrypoint.classList.add('qq-emoji-entrypoint');
                qqEmojiEntrypoint.alt = 'QQ 表情面板';
                qqEmojiEntrypoint.title = 'QQ 表情面板';
                qqEmojiEntrypoint.src = QQ_EMOJIS_LIST.find((qqEmoji) => qqEmoji.name === '斜眼笑').url;

                const qqEmojiDiv = document.createElement('div');
                qqEmojiDiv.classList.add('qq-emoji-picker');
                qqEmojiDiv.style.display = 'none';

                for (const qqEmoji of QQ_EMOJIS_LIST) {
                    const img = document.createElement('img');
                    img.classList.add('qq-emoji-item');
                    img.src = qqEmoji.url;
                    img.setAttribute('data-short-url', qqEmoji.shortUrl);
                    img.alt = qqEmoji.name;
                    img.title = qqEmoji.name;
                    img.loading = 'lazy';
                    img.width = QQ_EMOJI_WIDTH;
                    img.height = QQ_EMOJI_HEIGHT;
                    qqEmojiDiv.appendChild(img);
                }

                qqEmojiEntrypoint.addEventListener('mouseenter', () => {
                    qqEmojiDiv.style.display = '';
                });
                qqEmojiEntrypoint.addEventListener('mouseleave', async () => {
                    await sleep(300);
                    if (!qqEmojiDiv.matches(':hover')) {
                        qqEmojiDiv.style.display = 'none';
                    }
                });
                qqEmojiDiv.addEventListener('mouseleave', () => {
                    qqEmojiDiv.style.display = 'none';
                });
                qqEmojiDiv.addEventListener('click', (e) => {
                    const element = e.target;
                    if (!element.matches?.('.qq-emoji-item')) {
                        return;
                    }
                    const editor = document.getElementsByClassName('d-editor-input')[0];
                    if (!editor) {
                        return;
                    }
                    const emojiName = element.title;
                    const emojiShortURL = element.getAttribute('data-short-url');
                    // eslint-disable-next-line no-control-regex
                    if (/[\x00-\x1f\x7f\\`()[\]<>&"|*:]|~~/u.test(emojiName)) {
                        throw new Error(`Cannot insert QQ emoji as name ${emojiName} is unsafe for Markdown`);
                    }
                    // eslint-disable-next-line no-control-regex
                    if (/[\x00-\x1f\x7f\\`()[\]<>&"\s]/u.test(emojiShortURL)) {
                        throw new Error(`Cannot insert QQ emoji as short URL ${emojiShortURL} is unsafe for Markdown`);
                    }
                    const insertMarkdown = `![${emojiName}|${QQ_EMOJI_WIDTH}x${QQ_EMOJI_HEIGHT}](${emojiShortURL} "${emojiName}") `;
                    if (typeof editor.selectionStart === 'number' && typeof editor.selectionEnd === 'number') {
                        const startPos = editor.selectionStart;
                        const endPos = editor.selectionEnd;
                        let cursorPos = startPos;
                        const currentValue = editor.value;
                        editor.value = currentValue.substring(0, startPos) + insertMarkdown + currentValue.substring(endPos, currentValue.length);
                        cursorPos += insertMarkdown.length;
                        editor.selectionStart = editor.selectionEnd = cursorPos;
                    } else {
                        editor.value += insertMarkdown;
                    }
                    editor.focus();
                    editor.dispatchEvent(new Event('input', {
                        bubbles: true,
                        cancelable: true,
                    }));
                });

                document.body.prepend(qqEmojiEntrypoint);
                document.body.prepend(qqEmojiDiv);

                addGlobalStyle(`
                    .qq-emoji-entrypoint {
                        width: 24px;
                        height: 24px;
                        position: fixed;
                        top: 15px;
                        right: 15px;
                        z-index: 9999;
                    }
                    .qq-emoji-picker {
                        position: fixed;
                        top: 50px;
                        right: 15px;
                        z-index: 9999;
                        width: 500px;
                        max-width: calc(90vw - 35px);
                        height: 300px;
                        max-height: calc(90vh - 70px);
                        padding: 10px;
                        overflow-y: scroll;
                        background: #eee;
                    }
                    .qq-emoji-item {
                        margin: 3px;
                        cursor: pointer;
                    }
                    /* Only display QQ emoji entrypoint when composer is open. */
                    html:not(.composer-open):not(.fullscreen-composer) .qq-emoji-entrypoint {
                        display: none;
                    }
                `);
                // QQ emoji entrypoint should not cover user avatar and composer controls.
                if (IS_MOBILE_VIEW) {
                    addGlobalStyle(`
                        html.composer-open .d-header .wrap {
                            padding-right: 50px;
                        }
                        @media (max-width: 835px) {
                            html.composer-open.keyboard-visible .composer-controls {
                                padding-right: 40px;
                            }
                            html.composer-open .composer-action-createTopic .composer-controls {
                                padding-right: 40px;
                            }
                        }
                    `);
                } else {
                    addGlobalStyle(`
                        @media (max-width: 1200px) {
                            html.composer-open body:not(.has-sidebar-page) .d-header .wrap {
                                padding-right: 50px;
                            }
                        }
                        @media (max-width: 1450px) {
                            html.composer-open body.has-sidebar-page .d-header .wrap {
                                padding-right: 50px;
                            }
                        }
                        @media (max-width: 1550px) {
                            html.fullscreen-composer .composer-controls {
                                padding-right: 40px;
                            }
                        }
                    `);
                }
            },
        },
        {
            id: 'expand-who-liked',
            description: '默认展开点赞人列表',
            group: 'likes',
            enabledByDefault: true,
            options: [
                {
                    id: 'expand-interval-ms',
                    description: '两次展开操作的间隔时间（毫秒数）',
                    type: 'integer',
                    defaultValue: 100,
                },
            ],
            matchClass: 'like-count',
            onMatch: (element, optionValues) => {
                if (isElementHandledByFeature(element, 'expand-who-liked') ||
                    (element.closest('.post-menu-area')?.getElementsByClassName('who-liked').length ?? 0) > 0) {
                    return;
                }
                markElementHandledByFeature(element, 'expand-who-liked');

                const expandWhoLikedInterval = Math.min(Math.max(optionValues['expand-interval-ms'], 0), 60000);

                const expandWhoLikedTask = () => {
                    const queue = shuiyuanHelperMemory.get('expandWhoLikedQueue') ?? [];
                    while (queue.length > 0) {
                        const el = queue.shift();
                        // If the element is no longer on the page, we ignore it.
                        if (document.body.contains(el)) {
                            el.click();
                            shuiyuanHelperMemory.set('expandWhoLikedTimeoutID', setTimeout(expandWhoLikedTask, expandWhoLikedInterval));
                            return;
                        }
                    }
                    shuiyuanHelperMemory.set('expandWhoLikedTimeoutID', null);
                };

                if (!shuiyuanHelperMemory.has('expandWhoLikedQueue')) {
                    shuiyuanHelperMemory.set('expandWhoLikedQueue', []);
                }
                shuiyuanHelperMemory.get('expandWhoLikedQueue').push(element);
                if (!shuiyuanHelperMemory.get('expandWhoLikedTimeoutID')) {
                    shuiyuanHelperMemory.set('expandWhoLikedTimeoutID', setTimeout(expandWhoLikedTask, 0));
                }
            },
        },
        {
            id: 'show-liked-usernames',
            description: '显示点赞人用户名',
            group: 'likes',
            enabledByDefault: true,
            onInitialize: () => {
                addGlobalStyle(`
                    .shuiyuan-helper-liked-username {
                        margin: 0 5px;
                    }
                `);
            },
            matchClass: 'who-liked',
            onMatch: (element) => {
                const addUsernameToWhoLikedItem = (el) => {
                    if (el.getElementsByClassName('shuiyuan-helper-liked-username').length > 0) {
                        return;
                    }
                    const usernameSpan = document.createElement('span');
                    usernameSpan.classList.add('shuiyuan-helper-liked-username');
                    usernameSpan.textContent = el.getAttribute('data-user-card');
                    el.appendChild(usernameSpan);
                };

                const updateUsernameOnWhoLikedItem = (el) => {
                    for (const usernameSpan of [...el.getElementsByClassName('shuiyuan-helper-liked-username')]) {
                        usernameSpan.remove();
                    }
                    addUsernameToWhoLikedItem(el);
                };

                computeDataAtElementIfAbsent(element, 'whoLikedObserver', () => {
                    const whoLikedObserver = new MutationObserver((mutationsList) => {
                        const newItems = new Set();
                        const updatedItems = new Set();
                        for (const mutation of mutationsList) {
                            if (mutation.type === 'childList') {
                                for (const node of mutation.addedNodes) {
                                    if (node.matches?.('a.trigger-user-card')) {
                                        newItems.add(node);
                                    }
                                }
                            } else if (mutation.type === 'attributes' && mutation.attributeName === 'data-user-card') {
                                if (mutation.target.matches?.('a.trigger-user-card')) {
                                    updatedItems.add(mutation.target);
                                }
                            }
                        }
                        for (const el of newItems) {
                            addUsernameToWhoLikedItem(el);
                        }
                        for (const el of updatedItems) {
                            updateUsernameOnWhoLikedItem(el);
                        }
                    });
                    whoLikedObserver.observe(element, {
                        subtree: true,
                        childList: true,
                        attributeFilter: ['data-user-card'],
                    });
                    return whoLikedObserver;
                });
                for (const el of element.querySelectorAll('a.trigger-user-card')) {
                    addUsernameToWhoLikedItem(el);
                }
            },
        },
        {
            id: 'show-full-who-liked',
            description: '显示超过 200 个赞的帖子的完整点赞人列表',
            group: 'likes',
            enabledByDefault: false,
            matchId: 'main-outlet-wrapper', // Wait until Discourse application is loaded.
            onMatch: () => {
                applyHook(window.require('discourse/services/store').default.prototype, 'find', (origFunc) => function (type, findArgs, ...args) {
                    if (type === 'post-action-user' && findArgs?.post_action_type_id === 2) {
                        const postId = findArgs.id;
                        if (Number.isInteger(postId)) {
                            const likeCountElement = document.querySelector(`article[data-post-id="${postId}"] .post-menu-area .like-count`);
                            if (likeCountElement) {
                                const likeCount = parseInt(likeCountElement.textContent, 10);
                                if (likeCount > 200) {
                                    findArgs.limit = likeCount;
                                }
                            }
                        } else {
                            // eslint-disable-next-line no-console
                            console.error('discourse/services/store find findArgs.id not an integer');
                        }
                    }
                    // eslint-disable-next-line no-invalid-this
                    return origFunc.call(this, type, findArgs, ...args);
                }, 'raise-limit-for-fetching-more-than-200-liked-users');
            },
        },
        {
            id: 'show-retort-users',
            description: '可显示所有贴表情人',
            group: 'emojis',
            enabledByDefault: true,
            options: [
                {
                    id: 'show-expand-collapse-button',
                    description: '显示展开/收起按钮',
                    type: 'boolean',
                    defaultValue: true,
                },
                {
                    id: 'expand-by-default',
                    description: '默认展开贴表情人列表',
                    type: 'boolean',
                    defaultValue: true,
                },
            ],
            matchClass: 'post-retort-container',
            onInitialize: (optionValues) => {
                // If both options are disabled, no need to do anything.
                if (!optionValues['show-expand-collapse-button'] && !optionValues['expand-by-default']) {
                    return;
                }
                addGlobalStyle(`
                    .post-retort-container > div > span {
                        display: inline-block;
                    }
                    .post-retort-container > div > span:first-of-type {
                        margin-left: 3px;
                    }
                    .post-retort-container.shuiyuan-helper-retort-users-collapsed > div {
                        display: inline;
                    }
                    .post-retort-container.shuiyuan-helper-retort-users-collapsed > div > span {
                        display: none;
                    }
                    /* When retort users are expanded, for retort buttons that have been temporarily unwrapped (see "retortButtonUnwrapped" below),
                       display them as block elements so that they still occupy individual lines. */
                    .post-retort-container.shuiyuan-helper-show-retort-users:not(.shuiyuan-helper-retort-users-collapsed) > .post-retort {
                        display: flex;
                    }
                    .post-retort {
                        vertical-align: middle;
                    }
                `);
            },
            onMatch: (element, optionValues) => {
                const showExpandCollapseButton = optionValues['show-expand-collapse-button'];
                const expandByDefault = optionValues['expand-by-default'];
                if (!showExpandCollapseButton && !expandByDefault) {
                    return;
                }
                setDataAtElementIfAbsent(element, 'retortUsersExpanded', expandByDefault);

                const updateRetortContainerClass = (retortContainer) => {
                    if (getDataAtElement(retortContainer, 'retortUsersExpanded')) {
                        retortContainer.classList.remove('shuiyuan-helper-retort-users-collapsed');
                    } else {
                        retortContainer.classList.add('shuiyuan-helper-retort-users-collapsed');
                    }
                };

                updateRetortContainerClass(element);

                const topicArea = element.closest('.topic-area');
                const currentTopicId = parseInt(topicArea.getAttribute('data-topic-id'), 10);
                setDataAtElementIfAbsent(topicArea, 'retortFetchQueue', []);
                setDataAtElementIfAbsent(topicArea, 'retortFetchTimeoutID', null);
                const article = element.closest('article');
                const currentPostId = parseInt(article.getAttribute('data-post-id'), 10);

                const isRetortButton = (node) => node.matches?.('button.post-retort');

                // Wrap a retort button in div.shuiyuan-helper-retort-users,
                // add username spans into the div according to retortsMap,
                // return the generated div.
                const generateRetortItem = (retortButton, retortsMap) => {
                    const div = document.createElement('div');
                    div.classList.add('shuiyuan-helper-retort-users');
                    div.appendChild(retortButton);
                    const emoji = retortButton.firstElementChild.alt.slice(1, -1);
                    const usernames = retortsMap.get(emoji) || [];
                    let displayUsernames = usernames;
                    loadIgnoredUsers();
                    if (shuiyuanHelperMemory.get('hideRetortsOfIgnoredUsers')) {
                        const ignoredUsersLowerCaseSet = shuiyuanHelperMemory.get('ignoredUsersLowerCaseSet');
                        if (ignoredUsersLowerCaseSet.size > 0) {
                            displayUsernames = usernames.filter((u) => !ignoredUsersLowerCaseSet.has(u.toLowerCase()));
                        }
                    }
                    if (displayUsernames.length === 0) {
                        retortButton.classList.remove('my-retort', 'not-my-retort');
                        retortButton.classList.add('nobody-retort');
                    }
                    for (const username of displayUsernames) {
                        const userItem = document.createElement('span');
                        const userLink = document.createElement('a');
                        userLink.href = `/u/${encodeURIComponent(username)}`;
                        userLink.setAttribute('data-user-card', username);
                        userLink.textContent = username;
                        userItem.appendChild(userLink);
                        userItem.appendChild(document.createTextNode('；'));
                        div.appendChild(userItem);
                    }
                    if (!getDataAtElement(retortButton, 'hasClickDisableHandler')) {
                        // When a retort button is clicked, disable the button (prevent more clicks), until one of the following conditions is true:
                        // - Retort toggle failed.
                        // - Rerendering of this button is fully complete (after `updateOneRetort`).
                        // - After a MessageBus update, this button has been replaced by a newly generated one.
                        // Then let parent handlers handle it.
                        retortButton.addEventListener('click', (e) => {
                            // Ignore the click if this button has been disabled.
                            if (getDataAtElement(retortButton, 'retortButtonDisabled')) {
                                e.stopPropagation();
                                return;
                            }
                            setDataAtElement(retortButton, 'retortButtonDisabled', true);
                        });
                        setDataAtElement(retortButton, 'hasClickDisableHandler', true);
                    }
                    div.addEventListener('click', (e) => {
                        // If the clicked node is within the retort button, set the retortButtonClicked flag on the button.
                        // Then let parent handlers handle it.
                        if (retortButton.contains(e.target)) {
                            setDataAtElement(retortButton, 'retortButtonClicked', true);
                            return;
                        }
                        // If the clicked node is within a username link, just let parent handlers handle it (so that the user card can be shown).
                        if (e.target.matches?.('a') || e.target.parentElement?.matches('a')) {
                            return;
                        }
                        // Clicking other places should have no effect.
                        e.stopPropagation();
                    });
                    return div;
                };

                // Process all retorts in the .post-retort-container.
                // Wrap all the retort buttons, adding usernames according to the retorts array.
                // Wrapper divs are inserted in the same order as the original order of retort buttons.
                // Add expand/collapse button if not yet added.
                const updateRetorts = (retortContainer, retorts) => {
                    const retortsMap = new Map(retorts.map((item) => [item.emoji, item.usernames]));
                    for (const el of [...retortContainer.children]) {
                        if (isRetortButton(el)) {
                            retortContainer.appendChild(generateRetortItem(el, retortsMap));
                        } else if (el.matches('.shuiyuan-helper-retort-users')) {
                            retortContainer.appendChild(generateRetortItem(el.firstElementChild, retortsMap));
                            el.remove();
                        } else {
                            // Unexpected element.
                            el.remove();
                        }
                    }

                    // Mark the .post-retort-container which has finished its processing.
                    retortContainer.classList.add('shuiyuan-helper-show-retort-users');

                    // The expand/collapse button cannot be directly added into .post-retort-container, or as a sibling element.
                    // It will break the default frontend behavior as the offsets of elements got changed.
                    // We use Shadow DOM to hide the button from being detected by the default frontend behavior.
                    if (showExpandCollapseButton) {
                        if (!retortContainer.shadowRoot) {
                            retortContainer.attachShadow({mode: 'open'});

                            addShadowDOMStyle(retortContainer.shadowRoot, `
                                .shuiyuan-helper-expand-collapse-retort-users-button {
                                    margin: 3px;
                                    padding: 5px;
                                    color: var(--primary-low-mid);
                                    background: transparent;
                                    border: none;
                                    cursor: pointer;
                                    -webkit-appearance: button;
                                }
                                .shuiyuan-helper-expand-collapse-retort-users-button > svg {
                                    width: 20px;
                                    height: 20px;
                                    vertical-align: middle;
                                    fill: currentColor;
                                    opacity: 1;
                                }
                            `);
                            if (!IS_MOBILE_DEVICE) {
                                addShadowDOMStyle(retortContainer.shadowRoot, `
                                    .shuiyuan-helper-expand-collapse-retort-users-button:hover {
                                        color: var(--primary);
                                    }
                                `);
                            }

                            const expandCollapseButton = document.createElement('button');
                            expandCollapseButton.classList.add('shuiyuan-helper-expand-collapse-retort-users-button');

                            const updateExpandCollapseButtonState = () => {
                                const retortUsersExpanded = getDataAtElement(retortContainer, 'retortUsersExpanded');
                                expandCollapseButton.innerHTML = retortUsersExpanded ? COLLAPSE_RETORT_USERS_ICON : EXPAND_RETORT_USERS_ICON;
                                expandCollapseButton.title = retortUsersExpanded ? '收起贴表情人' : '展开贴表情人';
                            };

                            updateExpandCollapseButtonState();

                            expandCollapseButton.addEventListener('click', (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setDataAtElement(retortContainer, 'retortUsersExpanded', !getDataAtElement(retortContainer, 'retortUsersExpanded'));
                                updateRetortContainerClass(retortContainer);
                                updateExpandCollapseButtonState();
                            });

                            // Add expand/collapse button before retorts, within the Shadow DOM.
                            retortContainer.shadowRoot.appendChild(expandCollapseButton);
                            retortContainer.shadowRoot.appendChild(document.createElement('slot'));
                        }

                        const expandCollapseButton = retortContainer.shadowRoot.querySelector('.shuiyuan-helper-expand-collapse-retort-users-button');
                        expandCollapseButton.style.display = retorts.length > 0 ? '' : 'none';
                    }
                };

                const processRetortUpdateRequests = async () => {
                    const retortFetchQueue = getDataAtElement(topicArea, 'retortFetchQueue');
                    const postIdsToFetch = retortFetchQueue.splice(0, RETORT_FETCH_MAX_ENTRIES);
                    const res = await discourseFetch(`/t/${currentTopicId}/posts.json?${postIdsToFetch.map((id) => `post_ids%5B%5D=${id}`).join('&')}`);
                    const posts = (await res.json())?.post_stream?.posts || [];
                    for (const post of posts) {
                        const retorts = post?.retorts || [];
                        if (!Number.isInteger(post.id)) {
                            // eslint-disable-next-line no-console
                            console.error('Skipping non-integer post ID:', post.id);
                            continue;
                        }
                        const retortContainer = topicArea.querySelector(`article[data-post-id="${post.id}"] .post-retort-container`);
                        if (!retortContainer) {
                            continue;
                        }
                        updateRetorts(retortContainer, retorts);
                    }

                    setDataAtElement(
                        topicArea,
                        'retortFetchTimeoutID',
                        retortFetchQueue.length > 0 ? setTimeout(processRetortUpdateRequests, RETORT_FETCH_INTERVAL) : null,
                    );
                };

                const enqueueRetortUpdateRequest = () => {
                    const retortFetchQueue = getDataAtElement(topicArea, 'retortFetchQueue');
                    if (!retortFetchQueue.includes(currentPostId)) {
                        retortFetchQueue.push(currentPostId);
                    }
                    if (getDataAtElement(topicArea, 'retortFetchTimeoutID') === null) {
                        setDataAtElement(topicArea, 'retortFetchTimeoutID', setTimeout(processRetortUpdateRequests, RETORT_FETCH_INTERVAL));
                    }
                };

                const scheduleRetortUpdate = () => {
                    let retorts = null;
                    try {
                        retorts = getRetortLib().postFor(currentPostId).retorts;
                        if (!Array.isArray(retorts)) {
                            throw new Error('in-memory retorts not an array');
                        }
                    } catch (e) {
                        // eslint-disable-next-line no-console
                        console.error(e);
                        retorts = null;
                    }
                    // If retorts are already available in memory, we do not need to fetch from backend, just update immediately.
                    if (retorts) {
                        updateRetorts(element, retorts);
                        return;
                    }
                    enqueueRetortUpdateRequest();
                };

                // Process one retort button.
                // This should only be called for a retort button which:
                // - has been unwrapped by our hook
                // - the rerendering triggered by `updateWidget` has completed
                const updateOneRetort = (retortButton) => {
                    try {
                        // Do not process a retort button if it is no longer on the page, or already wrapped.
                        if (!document.body.contains(retortButton) || retortButton.closest('.shuiyuan-helper-retort-users')) {
                            return;
                        }

                        // Prepare retortsMap needed by generateRetortItem,
                        const retortEmoji = retortButton.firstElementChild.alt.slice(1, -1);
                        const postId = parseInt(retortButton.closest('article')?.getAttribute('data-post-id'), 10);
                        const retortUsernames = [...getRetortLib().postFor(postId).retorts.find((item) => item.emoji === retortEmoji)?.usernames || []];
                        const retortsMap = new Map([[retortEmoji, retortUsernames]]);

                        // Wrap this retort button now. The new wrapper div will have the same position as the current position of this retort button.
                        // We need an intermediate dummy element to help us.
                        // If we do `retortButton.replaceWith(generateRetortItem(retortButton, retortsMap))` directly,
                        // we will get an error: DOMException: Failed to execute 'replaceWith' on 'Element': The new child element contains the parent.
                        const dummy = document.createElement('dummy');
                        retortButton.replaceWith(dummy);
                        dummy.replaceWith(generateRetortItem(retortButton, retortsMap));

                        // We are done processing this retort button. Unset the retortButtonUnwrapped and retortButtonDisabled flags.
                        deleteDataAtElement(retortButton, 'retortButtonUnwrapped');
                        deleteDataAtElement(retortButton, 'retortButtonDisabled');
                    } catch (e) {
                        // eslint-disable-next-line no-console
                        console.error(e);
                    }
                };

                // Hook the `updateRetort` function in retort lib.
                // If the promise is rejected (i.e. retort toggle failed), unset the retortButtonClicked and retortButtonDisabled flags on the retort button.
                try {
                    applyHook(getRetortLib(), 'updateRetort', (origFunc) => function (post, emoji) {
                        // eslint-disable-next-line no-invalid-this
                        return origFunc.call(this, post, emoji).catch((reason) => {
                            try {
                                const postId = post.id;
                                if (!Number.isInteger(postId)) {
                                    throw new Error('retort lib updateRetort post.id not an integer');
                                }
                                if (typeof emoji !== 'string') {
                                    throw new Error('retort lib updateRetort emoji not a string');
                                }
                                const retortButton = findRetortButton(postId, emoji);
                                if (retortButton) {
                                    deleteDataAtElement(retortButton, 'retortButtonClicked');
                                    deleteDataAtElement(retortButton, 'retortButtonDisabled');
                                }
                            } catch (e) {
                                // eslint-disable-next-line no-console
                                console.error(e);
                            }
                            throw reason;
                        });
                    }, 'unset-flags-on-button-upon-retort-toggle-failure');
                } catch (e) {
                    // eslint-disable-next-line no-console
                    console.error(e);
                }

                // When a retort is toggled, the `updateWidget` function in `retort-toggle.js.es6` will trigger rerendering of one particular retort button.
                // See https://github.com/discourse/discourse/blob/187204705323b650d61ed25862eb1a0c733aa63c/app/assets/javascripts/discourse/app/widgets/glue.js#L50
                // Our div.shuiyuan-helper-retort-users wrapper has a conflict with this rerendering.
                // We hook the `willRerenderWidget` function to unwrap the retort button (recover its original structure) beforehand to avoid the conflict.
                try {
                    applyHook(getRetortToggleWidgetClass().prototype, 'willRerenderWidget', (origFunc) => function () {
                        // eslint-disable-next-line no-invalid-this
                        const thisArg = this;
                        try {
                            const postId = thisArg.attrs.post.id;
                            const {emoji, usernames} = thisArg.attrs;
                            if (!Number.isInteger(postId)) {
                                throw new Error('retort-toggle updateWidget this.state.post.id not an integer');
                            }
                            if (typeof emoji !== 'string') {
                                throw new Error('retort-toggle updateWidget this.state.emoji not a string');
                            }
                            if (!Array.isArray(usernames)) {
                                throw new Error('retort-toggle updateWidget this.state.usernames not an array');
                            }
                            const retortButton = findRetortButton(postId, emoji);
                            // Check if a retort button with this postId and emoji exists on the page. If not, we do not need to do anything.
                            // Check if this retort button has been clicked (i.e. has the retortButtonClicked flag set).
                            // Note that if a MessageBus update already arrived before this, the retort buttons will be regenerated
                            // and would not have the retortButtonClicked flag set. In that case we do not need to unwrap the button since rerendering is already complete.
                            if (retortButton) {
                                // Unset the retortButtonClicked flag since we no longer need it.
                                deleteDataAtElement(retortButton, 'retortButtonClicked');
                                const retortButtonParent = retortButton.parentElement;
                                // If the retort button clicked is wrapped in div.shuiyuan-helper-retort-users, unwrap it before `updateWidget` rerendering.
                                // Set the retortButtonUnwrapped flag so that we can process the button at a later time (when rerendering is done).
                                if (retortButtonParent?.matches('.shuiyuan-helper-retort-users')) {
                                    setDataAtElement(retortButton, 'retortButtonUnwrapped', true);
                                    retortButtonParent.replaceWith(retortButton);
                                }
                            }
                        } catch (e) {
                            // eslint-disable-next-line no-console
                            console.error(e);
                        }
                        origFunc.call(thisArg);
                    }, 'unwrap-retort-button-before-widget-update');
                } catch (e) {
                    // eslint-disable-next-line no-console
                    console.error(e);
                }

                // See https://github.com/discourse/discourse/blob/187204705323b650d61ed25862eb1a0c733aa63c/app/assets/javascripts/discourse/app/widgets/glue.js#L56
                // We hook the `didRenderWidget` function to wrap the retort button after DOM patching is done.
                try {
                    applyHook(getRetortToggleWidgetClass().prototype, 'didRenderWidget', (origFunc) => function () {
                        // eslint-disable-next-line no-invalid-this
                        const thisArg = this;
                        try {
                            const postId = thisArg.attrs.post.id;
                            const {emoji} = thisArg.attrs;
                            const retortButton = findRetortButton(postId, emoji);
                            if (retortButton) {
                                updateOneRetort(retortButton);
                            }
                        } catch (e) {
                            // eslint-disable-next-line no-console
                            console.error(e);
                        }
                        origFunc.call(thisArg);
                    }, 'wrap-retort-button-after-widget-update');
                } catch (e) {
                    // eslint-disable-next-line no-console
                    console.error(e);
                }

                computeDataAtElementIfAbsent(element, 'retortObserver', () => {
                    const retortObserver = new MutationObserver((mutationsList) => {
                        let shouldUpdateRetorts = false;
                        let hasRemoval = false;
                        for (const mutation of mutationsList) {
                            if (mutation.type === 'childList') {
                                for (const node of mutation.addedNodes) {
                                    if (isRetortButton(node) && !node.closest('.shuiyuan-helper-retort-users') && !getDataAtElement(node, 'retortButtonUnwrapped')) {
                                        // We are seeing a new retort button. A MessageBus update should have arrived. We should process all retorts.
                                        shouldUpdateRetorts = true;
                                    }
                                }
                                if (mutation.removedNodes.length > 0) {
                                    hasRemoval = true;
                                }
                            }
                        }
                        if (showExpandCollapseButton && element.shadowRoot && hasRemoval && element.children.length === 0) {
                            // All retorts have been removed. Hide the expand/collapse button.
                            const expandCollapseButton = element.shadowRoot.querySelector('.shuiyuan-helper-expand-collapse-retort-users-button');
                            expandCollapseButton.style.display = 'none';
                            return;
                        }
                        if (shouldUpdateRetorts) {
                            scheduleRetortUpdate();
                        }
                    });
                    retortObserver.observe(element, {
                        subtree: true,
                        childList: true,
                        characterData: true,
                    });
                    return retortObserver;
                });

                // If the .post-retort-container contains at least one retort, do initial processing.
                if (element.firstElementChild) {
                    scheduleRetortUpdate();
                }
            },
        },
        {
            id: 'highlight-clicked-retorts',
            description: '高亮显示已点击但未更新的贴表情',
            group: 'emojis',
            enabledByDefault: false,
            matchClass: 'post-retort-container',
            onInitialize: () => {
                addGlobalStyle(`
                    @keyframes shuiyuan-helper-clicked-retort-animation {
                        0% {
                            background-color: var(--highlight-medium);
                            border-color: var(--highlight-high);
                        }
                        80% {
                            background-color: var(--highlight-medium);
                            border-color: var(--highlight-high);
                        }
                        100% {
                        }
                    }
                    .shuiyuan-helper-clicked-retort, .shuiyuan-helper-clicked-retort .post-retort {
                        animation: shuiyuan-helper-clicked-retort-animation 12.5s ease-out;
                    }
                `);
            },
            onMatch: (element) => {
                if (isElementHandledByFeature(element, 'highlight-clicked-retorts')) {
                    return;
                }

                const getAnimationElement = (retortButton) => retortButton.closest('.shuiyuan-helper-retort-users') ?? retortButton;

                element.addEventListener('click', (e) => {
                    const clickedNode = e.target;
                    const clickedRetortButton = clickedNode.closest ? clickedNode.closest('.post-retort') : clickedNode.parentElement.closest('.post-retort');
                    if (clickedRetortButton) {
                        const animationElement = getAnimationElement(clickedRetortButton);
                        animationElement.classList.add('shuiyuan-helper-clicked-retort');
                    }
                });
                element.addEventListener('animationend', (e) => {
                    if (e.animationName === 'shuiyuan-helper-clicked-retort-animation') {
                        e.target.classList.remove('shuiyuan-helper-clicked-retort');
                    }
                });

                // Hook the `updateRetort` function in retort lib.
                // If the promise is rejected (i.e. retort toggle failed), remove the highlight animation right away.
                try {
                    applyHook(getRetortLib(), 'updateRetort', (origFunc) => function (post, emoji) {
                        // eslint-disable-next-line no-invalid-this
                        return origFunc.call(this, post, emoji).catch((reason) => {
                            try {
                                const postId = post.id;
                                if (!Number.isInteger(postId)) {
                                    throw new Error('retort lib updateRetort post.id not an integer');
                                }
                                if (typeof emoji !== 'string') {
                                    throw new Error('retort lib updateRetort emoji not a string');
                                }
                                const retortButton = findRetortButton(postId, emoji);
                                if (retortButton) {
                                    const animationElement = getAnimationElement(retortButton);
                                    animationElement.classList.remove('shuiyuan-helper-clicked-retort');
                                }
                            } catch (e) {
                                // eslint-disable-next-line no-console
                                console.error(e);
                            }
                            throw reason;
                        });
                    }, 'remove-highlight-animation-upon-retort-toggle-failure');
                } catch (e) {
                    // eslint-disable-next-line no-console
                    console.error(e);
                }

                markElementHandledByFeature(element, 'highlight-clicked-retorts');
            },
        },
        {
            id: 'retort-lagging-workaround',
            description: '缓解贴表情卡顿问题（在贴表情时重新开启 MessageBus 长轮询）',
            group: 'emojis',
            enabledByDefault: false,
            matchClass: ['post-retort-container', 'emoji-picker-emoji-area'],
            onMatch: (element) => {
                const refreshRetortsImmediatelyWorkaround = () => {
                    try {
                        // Trigger a long poll if not present.
                        window.MessageBus.onVisibilityChange?.();
                        // If we have a current long poll, abort it.
                        // A new one will be automatically created by MessageBus.
                        window.MessageBus.longPoll?.abort();
                    } catch (e) {
                        // eslint-disable-next-line no-console
                        console.error(e);
                    }
                };

                if (element.matches('.post-retort-container')) {
                    if (isElementHandledByFeature(element, 'retort-lagging-workaround')) {
                        return;
                    }
                    element.addEventListener('click', (e) => {
                        const clickedNode = e.target;
                        const clickedRetortButton = clickedNode.closest ? clickedNode.closest('.post-retort') : clickedNode.parentElement.closest('.post-retort');
                        if (clickedRetortButton) {
                            refreshRetortsImmediatelyWorkaround();
                        }
                    });
                    markElementHandledByFeature(element, 'retort-lagging-workaround');
                }
                if (element.matches('.emoji-picker-emoji-area')) {
                    if (isElementHandledByFeature(element, 'retort-lagging-workaround')) {
                        return;
                    }
                    element.addEventListener('click', (e) => {
                        if (e.target.matches?.('.emoji')) {
                            refreshRetortsImmediatelyWorkaround();
                        }
                    });
                    markElementHandledByFeature(element, 'retort-lagging-workaround');
                }
            },
        },
        {
            id: 'emoji-picker-enhancements',
            description: '表情面板增强功能',
            group: 'emojis',
            enabledByDefault: true,
            options: [
                {
                    id: 'quick-access-emoji-list',
                    description: '我的快捷表情列表',
                    instructions: '输入以 | 字符分隔的表情名称列表，例如：horse|dragon',
                    type: 'string',
                    defaultValue: '',
                },
            ],
            matchClass: 'emoji-picker',
            onMatch: (element, optionValues) => {
                const {customEmojisMap, allEmojiNamesSet} = getEmojiInfo();

                const getEmojiURL = (emoji) => {
                    try {
                        return window.require('discourse/lib/text').emojiUrlFor(emoji);
                    } catch (e) {
                        // eslint-disable-next-line no-console
                        console.error(e);
                        return customEmojisMap.get(emoji) ?? `/images/emoji/google/${encodeURIComponent(emoji).replaceAll('%3A', '/')}.png`;
                    }
                };

                const createEmojiImg = (emoji, tabIndex) => {
                    const img = document.createElement('img');
                    img.src = getEmojiURL(emoji);
                    img.alt = emoji;
                    img.title = emoji;
                    img.classList.add('emoji');
                    img.width = 20;
                    img.height = 20;
                    img.loading = 'lazy';
                    if (![null, undefined].includes(tabIndex)) {
                        img.tabIndex = tabIndex;
                    }
                    return img;
                };

                const createEmojiSection = (sectionId, sectionName, emojis) => {
                    const newTitle = document.createElement('span');
                    newTitle.classList.add('title');
                    newTitle.textContent = sectionName;
                    const sectionHeader = document.createElement('div');
                    sectionHeader.classList.add('section-header');
                    sectionHeader.appendChild(newTitle);
                    const sectionGroup = document.createElement('div');
                    sectionGroup.classList.add('section-group');
                    for (const emoji of emojis) {
                        sectionGroup.appendChild(createEmojiImg(emoji, 0));
                    }
                    const newSection = document.createElement('div');
                    newSection.classList.add('section');
                    newSection.setAttribute('data-section', sectionId);
                    newSection.appendChild(sectionHeader);
                    newSection.appendChild(sectionGroup);
                    return newSection;
                };

                const createEmojiSectionButton = (sectionId, emoji) => {
                    const button = document.createElement('button');
                    button.classList.add('btn', 'btn-default', 'category-button', 'emoji');
                    button.type = 'button';
                    button.setAttribute('data-section', sectionId);
                    button.appendChild(createEmojiImg(emoji));
                    button.addEventListener('click', () => {
                        const sectionDiv = element.querySelector(`div[data-section="${sectionId}"]`);
                        if (!sectionDiv) {
                            return;
                        }
                        sectionDiv.scrollIntoView();
                    });
                    return button;
                };

                const quickAccessList = optionValues['quick-access-emoji-list'].split('|')
                    .map((emoji) => emoji.trim()).filter(Boolean).filter((emoji) => allEmojiNamesSet.has(emoji));

                const QUICK_ACCESS_SECTION_ID = 'shuiyuan_helper_quick_access_emoji_list';

                if (quickAccessList.length && !element.querySelector(`div[data-section="${QUICK_ACCESS_SECTION_ID}"]`)) {
                    const smileysAndEmotionSection = element.querySelector('div[data-section="smileys_&_emotion"]');
                    const smileysAndEmotionSectionButton = element.querySelector('button[data-section="smileys_&_emotion"]');
                    if (smileysAndEmotionSection && smileysAndEmotionSectionButton) {
                        smileysAndEmotionSection.before(createEmojiSection(QUICK_ACCESS_SECTION_ID, '我的快捷表情', quickAccessList));
                        smileysAndEmotionSectionButton.before(createEmojiSectionButton(QUICK_ACCESS_SECTION_ID, 'pushpin'));
                    } else {
                        // eslint-disable-next-line no-console
                        console.error('quick access emoji list insertion point not found');
                    }
                }
            },
        },
        {
            id: 'enhanced-user-card',
            description: '增强版用户资料卡',
            group: 'users',
            enabledByDefault: false,
            matchClass: ['metadata-row', 'secondary'],
            onMatch: async (element) => {
                if (element.matches('.metadata-row')) { // User Card
                    if (isElementHandledByFeature(element, 'enhanced-user-card')) {
                        return;
                    }

                    const addUserCardListItem = (container, desc, text, title) => {
                        if (!text) {
                            return;
                        }
                        const h3 = document.createElement('h3');
                        if (desc) {
                            const descSpan = document.createElement('span');
                            descSpan.classList.add('desc');
                            descSpan.textContent = desc;
                            h3.appendChild(descSpan);
                            h3.appendChild(document.createTextNode(' '));
                        }
                        const textSpan = document.createElement('span');
                        textSpan.textContent = text;
                        if (title) {
                            textSpan.title = title;
                        }
                        h3.appendChild(textSpan);
                        container.appendChild(h3);
                        container.appendChild(document.createTextNode(' '));
                    };

                    const addUserCardDateItem = (container, desc, dateString) => {
                        if (!dateString) {
                            return;
                        }
                        addUserCardListItem(container, desc, getRelativeDateString(new Date(dateString)), dateString);
                    };

                    const addUserCardLinkItem = (container, url, text) => {
                        const link = document.createElement('a');
                        link.style.whiteSpace = 'nowrap';
                        link.href = url;
                        link.classList.add('ember-view');
                        link.appendChild(document.createTextNode(text));
                        link.addEventListener('click', (e) => {
                            if (isOpenInNewTabOrWindow(e)) {
                                return;
                            }
                            e.preventDefault();
                            goToRoute(url);
                        });
                        container.appendChild(link);
                        container.appendChild(document.createTextNode(' '));
                    };

                    const userCard = element.closest('.user-card');
                    if (!userCard) {
                        return;
                    }
                    const usernamesInClass = [...userCard.classList].filter((c) => c.startsWith('user-card-')).map((c) => c.slice(10));
                    if (usernamesInClass.length !== 1) {
                        throw new Error(`could not determine username from user-card classList: ${userCard.classList}`);
                    }
                    const username = usernamesInClass[0];
                    const userInfo = await getUserInfoFromTL0Group(username);
                    if (!userInfo || isElementHandledByFeature(element, 'enhanced-user-card')) {
                        return;
                    }

                    const profileHidden = userCard.getElementsByClassName('profile-hidden').length > 0;
                    const extraItemsDiv = document.createElement('div');
                    extraItemsDiv.classList.add('shuiyuan-helper-user-card-extra-metadata');
                    addUserCardListItem(extraItemsDiv, 'ID', userInfo.id?.toString());
                    if (profileHidden) {
                        addUserCardDateItem(extraItemsDiv, '加入日期', userInfo.added_at);
                    }
                    if (![null, undefined].includes(userInfo.trust_level)) {
                        addUserCardListItem(extraItemsDiv, null, `TL${userInfo.trust_level}`, `信任等级 ${userInfo.trust_level}`);
                    }
                    if (profileHidden) {
                        addUserCardDateItem(extraItemsDiv, '发布时间', userInfo.last_posted_at);
                    }
                    addUserCardDateItem(extraItemsDiv, '最后活动', userInfo.last_seen_at);
                    if (profileHidden) {
                        addUserCardListItem(extraItemsDiv, '时区', userInfo.timezone);
                    }
                    addUserCardLinkItem(extraItemsDiv, `/u?name=${encodeURIComponent(username)}&period=all`, '统计信息');
                    if (!profileHidden) {
                        addUserCardLinkItem(extraItemsDiv, `/u/${encodeURIComponent(username)}/activity`, '活动');
                    }
                    addUserCardLinkItem(extraItemsDiv, `/search?q=${encodeURIComponent(`user:${username} order:latest`)}`, '搜索历史发帖');
                    element.appendChild(extraItemsDiv);
                    markElementHandledByFeature(element, 'enhanced-user-card');
                }
                if (element.matches('.secondary')) { // User Page
                    const userMain = element.closest('.user-main');
                    if (!userMain) {
                        return;
                    }
                    const infoPanelDl = userMain.querySelector('#collapsed-info-panel > dl');
                    if (!infoPanelDl || isElementHandledByFeature(infoPanelDl, 'enhanced-user-card')) {
                        return;
                    }

                    const addUserPageListItem = (dl, desc, text, title) => {
                        if (!text) {
                            return;
                        }
                        const itemDiv = document.createElement('div');
                        const dt = document.createElement('dt');
                        dt.textContent = desc;
                        itemDiv.appendChild(dt);
                        const dd = document.createElement('dd');
                        const ddSpan = document.createElement('span');
                        ddSpan.textContent = text;
                        if (title) {
                            ddSpan.title = title;
                        }
                        dd.appendChild(ddSpan);
                        itemDiv.appendChild(dd);
                        dl.appendChild(itemDiv);
                    };

                    const addUserPageViewJSONRawInfoLink = (dl, text, url) => {
                        const itemDiv = document.createElement('div');
                        itemDiv.style.marginRight = '15px';
                        const link = document.createElement('a');
                        link.href = url;
                        link.textContent = text;
                        itemDiv.appendChild(link);
                        dl.appendChild(itemDiv);
                    };

                    const username = findUsernameInUserPage(userMain);
                    if (!username) {
                        return;
                    }
                    const userInfo = await getUserInfo(username);
                    if (!userInfo || isElementHandledByFeature(infoPanelDl, 'enhanced-user-card')) {
                        return;
                    }

                    markElementHandledByFeature(infoPanelDl, 'enhanced-user-card');
                    addUserPageListItem(infoPanelDl, 'ID', userInfo.id?.toString());
                    addUserPageListItem(infoPanelDl, '生日', parseBirthdayMonthDate(userInfo.birthdate));
                    addUserPageListItem(infoPanelDl, '时区', userInfo.timezone);
                    addUserPageViewJSONRawInfoLink(infoPanelDl, '查看用户 JSON 原始数据', `/u/${encodeURIComponent(username)}.json`);
                    addUserPageViewJSONRawInfoLink(infoPanelDl, '查看用户摘要 JSON 原始数据', `/u/${encodeURIComponent(username)}/summary.json`);
                }
            },
        },
        {
            id: 'parse-ids-in-post-violation-announcements',
            description: '可解析帖子违规公示中的话题/帖子编号',
            group: 'announcements',
            enabledByDefault: false,
            matchClass: 'cooked',
            onInitialize: () => {
                addGlobalStyle(`
                    .shuiyuan-helper-post-violation-announcement-inspect-topic-button {
                        color: var(--primary-low-mid);
                        background: transparent;
                        border: none;
                    }
                    .shuiyuan-helper-post-violation-announcement-inspect-topic-button.pending {
                        cursor: wait;
                    }
                `);
                if (!IS_MOBILE_DEVICE) {
                    addGlobalStyle(`
                        .shuiyuan-helper-post-violation-announcement-inspect-topic-button:hover {
                            color: var(--primary);
                        }
                    `);
                }
            },
            onMatch: (element) => {
                const topicArea = element.closest('.topic-area');
                const currentTopicId = parseInt(topicArea.getAttribute('data-topic-id'), 10);
                if (currentTopicId !== POST_VIOLATION_ANNOUNCEMENT_TOPIC_ID) {
                    return;
                }
                if (element.getElementsByClassName('shuiyuan-helper-post-violation-announcement-inspect-topic-button').length > 0 ||
                    element.getElementsByClassName('shuiyuan-helper-post-violation-announcement-parsed-ids').length > 0) {
                    return;
                }

                const findTopicOrPostIdsNodes = () => [...element.children]
                    .filter((el) => el.matches('p'))
                    .flatMap((p) => [...p.childNodes].filter((node) => node?.nodeName === '#text' && node.textContent?.includes('编号：')));

                const getTopicStatuses = async (topicIds) => {
                    if (!topicIds.length) {
                        return new Map();
                    }
                    const topicStatuses = new Map();
                    const promises = [];
                    for (const topicId of topicIds) {
                        promises.push((async () => (await discourseFetch(`/t/${topicId}.json`, null, {expectOkStatus: false})).json())());
                    }
                    for (const [topicId, result] of zip(topicIds, await promiseAllSettledLogErrors(promises))) {
                        if (result.status === 'fulfilled') {
                            const data = result.value;
                            if (data.errors) {
                                topicStatuses.set(topicId, {
                                    accessible: false,
                                    error: Array.isArray(data.errors) ? data.errors.join(' ') : data.errors,
                                });
                            } else if (data.title) {
                                topicStatuses.set(topicId, {
                                    accessible: true,
                                    title: data.title,
                                });
                            }
                        }
                    }
                    return topicStatuses;
                };

                const createSlotForPostItem = (topicId, postNumber) => {
                    const slot = document.createElement('span');
                    slot.textContent = postNumber ? `${topicId}/${postNumber}` : topicId.toString();
                    slot.setAttribute('data-topic-id', topicId);
                    if (postNumber) {
                        slot.setAttribute('data-post-number', postNumber);
                    }
                    return slot;
                };

                const updatePostItemState = (slot, topicStatuses) => {
                    const topicId = parseInt(slot.getAttribute('data-topic-id'), 10);
                    const postNumber = slot.hasAttribute('data-post-number') ? parseInt(slot.getAttribute('data-post-number'), 10) : null;
                    const topicStatus = topicStatuses.get(topicId);
                    if (!topicStatus) {
                        return;
                    }
                    if (topicStatus.accessible) {
                        const link = document.createElement('a');
                        const postLocation = postNumber ? `${topicId}/${postNumber}` : topicId.toString();
                        link.href = `/t/topic/${postLocation}`;
                        link.title = topicStatus.title;
                        link.appendChild(document.createTextNode(`${postLocation}（${link.title}）`));
                        link.addEventListener('click', (e) => {
                            if (isOpenInNewTabOrWindow(e)) {
                                return;
                            }
                            e.preventDefault();
                            goToRoute(link.href);
                        });
                        slot.replaceChildren(link);
                    } else {
                        slot.title = topicStatus.error;
                        slot.textContent += `（${slot.title}）`;
                        slot.style.color = 'var(--danger)';
                    }
                };

                const createInspectButton = (topicOrPostIdsNode) => {
                    const topicOrPostIdsText = topicOrPostIdsNode.textContent;
                    const colonIndex = topicOrPostIdsText.indexOf('：');
                    const prefixNode = document.createTextNode(topicOrPostIdsText.slice(0, colonIndex + 1));
                    const topicOrPostIdsContent = topicOrPostIdsText.slice(colonIndex + 1);
                    if (!topicOrPostIdsContent.trim()) {
                        return;
                    }
                    const contentNode = document.createTextNode(topicOrPostIdsContent);

                    const inspectButton = document.createElement('button');
                    inspectButton.classList.add('shuiyuan-helper-post-violation-announcement-inspect-topic-button');
                    inspectButton.title = '解析话题/帖子编号';
                    inspectButton.innerHTML = INSPECT_TOPIC_ICON;
                    inspectButton.addEventListener('click', async () => {
                        try {
                            inspectButton.disabled = true;
                            inspectButton.classList.add('pending');
                            const parsedItems = [];
                            const topicIds = new Set();
                            let lastIndex = 0;
                            for (const match of topicOrPostIdsContent.matchAll(/\d+\/\d+|\d+/gu)) {
                                const matchText = match[0];
                                let matchTopicId, matchPostNumber;
                                if (matchText.includes('/')) {
                                    [matchTopicId, matchPostNumber] = matchText.split('/').map((s) => parseInt(s, 10));
                                } else {
                                    matchTopicId = parseInt(matchText, 10);
                                    matchPostNumber = null;
                                }
                                topicIds.add(matchTopicId);
                                const matchStartIndex = match.index;
                                const matchEndIndex = match.index + matchText.length;
                                parsedItems.push(topicOrPostIdsContent.slice(lastIndex, matchStartIndex));
                                parsedItems.push(createSlotForPostItem(matchTopicId, matchPostNumber));
                                lastIndex = matchEndIndex;
                            }
                            parsedItems.push(topicOrPostIdsContent.slice(lastIndex));
                            const topicStatuses = await getTopicStatuses([...topicIds]);
                            for (const item of parsedItems) {
                                if (typeof item === 'string') {
                                    continue;
                                }
                                updatePostItemState(item, topicStatuses);
                            }
                            const parsedSpan = document.createElement('span');
                            parsedSpan.classList.add('shuiyuan-helper-post-violation-announcement-parsed-ids');
                            parsedSpan.append(...parsedItems);
                            contentNode.replaceWith(parsedSpan);
                        } catch (e) {
                            inspectButton.classList.remove('pending');
                            inspectButton.disabled = false;
                            // eslint-disable-next-line no-console
                            console.error(e);
                            return;
                        }
                        inspectButton.remove();
                    });
                    topicOrPostIdsNode.replaceWith(prefixNode, inspectButton, contentNode);
                };

                for (const node of findTopicOrPostIdsNodes()) {
                    createInspectButton(node);
                }
            },
        },
        {
            id: 'parse-duration-in-user-violation-announcements',
            description: '在用户违规公示（小黑屋）中标注处罚天数',
            group: 'announcements',
            enabledByDefault: false,
            matchClass: 'cooked',
            onMatch: (element) => {
                const topicArea = element.closest('.topic-area');
                const currentTopicId = parseInt(topicArea.getAttribute('data-topic-id'), 10);
                if (currentTopicId !== USER_VIOLATION_ANNOUNCEMENT_TOPIC_ID) {
                    return;
                }
                if (element.closest('.embedded-posts')) {
                    return;
                }
                if (element.getElementsByClassName('shuiyuan-helper-user-violation-announcement-parsed-duration').length > 0) {
                    return;
                }

                const EIGHT_HOURS_MS = 8 * 60 * 60 * 1000;
                const DAY_MS = 24 * 60 * 60 * 1000;

                // Get year, month and day when the announcement was posted, as in China Standard Time (UTC+08:00).
                const getStartYMD = () => {
                    const postDate = new Date(parseInt(element.closest('article').querySelector('a.post-date > span').getAttribute('data-time'), 10));
                    const adjustedDate = new Date(postDate.getTime() + EIGHT_HOURS_MS);
                    return [adjustedDate.getUTCFullYear(), adjustedDate.getUTCMonth() + 1, adjustedDate.getUTCDate()];
                };

                // Parse year, month and day from the announcement text. The date is assumed to be in China Standard Time (UTC+08:00).
                const getEndYMD = (durationContent) => durationContent.match(/(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*(?:日|号)/u)?.slice(1, 4).map((s) => parseInt(s, 10));

                const getDayDifference = (startYMD, endYMD) => Math.round((new Date(endYMD[0], endYMD[1] - 1, endYMD[2]) - new Date(startYMD[0], startYMD[1] - 1, startYMD[2])) / DAY_MS);

                const findDurationNodes = () => [...element.children]
                    .filter((el) => el.matches('p'))
                    .flatMap((p) => [...p.childNodes].filter((node) => node?.nodeName === '#text' && node.textContent?.includes('时长：')));

                const updateDurationNode = (durationNode) => {
                    const durationContent = durationNode.textContent;
                    const endYMD = getEndYMD(durationContent);
                    if (!endYMD) {
                        return;
                    }
                    const parsedSpan = document.createElement('span');
                    parsedSpan.classList.add('shuiyuan-helper-user-violation-announcement-parsed-duration');
                    const originalContentSpan = document.createElement('span');
                    originalContentSpan.textContent = durationContent;
                    const durationDaysSpan = document.createElement('span');
                    durationDaysSpan.textContent = `（${getDayDifference(getStartYMD(), endYMD)} 天）`;
                    durationDaysSpan.style.background = 'var(--highlight-medium)';
                    parsedSpan.append(originalContentSpan, durationDaysSpan);
                    durationNode.replaceWith(parsedSpan);
                };

                for (const node of findDurationNodes()) {
                    updateDurationNode(node);
                }
            },
        },
        {
            id: 'expand-hidden-posts',
            description: '展开所有被举报隐藏的帖子',
            group: 'read-content',
            enabledByDefault: false,
            matchClass: 'expand-hidden',
            onMatch: (element) => element.click(),
        },
        {
            id: 'hold-deleted-posts',
            description: '保持显示加载后被删除的帖子',
            group: 'read-content',
            enabledByDefault: false,
            matchClass: ['post-stream', 'cooked'],
            onMatch: (element) => {
                if (element.matches('.post-stream')) {
                    // Hook topic update callback function for each topic.
                    const topicArea = document.getElementsByClassName('topic-area')[0];
                    const topicId = parseInt(topicArea.getAttribute('data-topic-id'), 10);
                    const topicUpdateCallbackEntries = window.MessageBus.callbacks.filter((cb) => cb?.channel === `/topic/${topicId}`);
                    if (topicUpdateCallbackEntries.length === 0) {
                        throw new Error('Cannot find topic update callback function to hook');
                    }
                    for (const callbackEntry of topicUpdateCallbackEntries) {
                        applyHook(callbackEntry, 'func', (origFunc) => (...args) => {
                            const [data] = args;
                            switch (data?.type) {
                                case 'revised': {
                                    try {
                                        // When a post has been revised, record the old content.
                                        const postId = data.id;
                                        if (!Number.isInteger(postId)) {
                                            // eslint-disable-next-line no-console
                                            console.error('Skipping non-integer post ID:', postId);
                                            break;
                                        }
                                        const article = document.querySelector(`article[data-post-id="${postId}"]`);
                                        const postCookedDiv = getPostCookedDiv(article);
                                        if (postCookedDiv) {
                                            setDataAtElementIfAbsent(article, 'editHistory', []).push(postCookedDiv.innerHTML);
                                        }
                                    } catch (e) {
                                        // eslint-disable-next-line no-console
                                        console.error(e);
                                    }
                                    break;
                                }
                                case 'deleted':
                                case 'destroyed': {
                                    // When a post has been deleted, mark it red, but do not pass the message to the original callback function (so that we can hold it on the page).
                                    const postId = data.id;
                                    if (!Number.isInteger(postId)) {
                                        // eslint-disable-next-line no-console
                                        console.error('Skipping non-integer post ID:', postId);
                                        return;
                                    }
                                    const postCookedDiv = getPostCookedDiv(postId);
                                    if (postCookedDiv) {
                                        postCookedDiv.style.background = 'var(--danger-low-mid)';
                                        postCookedDiv.style.border = '2px solid var(--danger)';
                                    }
                                    return;
                                }
                            }
                            origFunc(...args);
                        }, 'hold-deleted-posts');
                    }
                    // Make sure that the hooked callback function can still be unsubscribed later.
                    // Otherwise the callback is leaked and consumes unnecessary resources.
                    applyHook(window.MessageBus, 'unsubscribe', (origFunc) => (channel, func) => {
                        // If `func` is provided, `MessageBus.unsubscribe` will only unsubscribe that particular callback, not all callbacks in that channel.
                        // See: https://github.com/discourse/message_bus/blob/7c7ecee0ea7b6a81fc8b280ef5fd728b0cbe4c40/assets/message-bus.js#L528
                        if (func && typeof channel === 'string' && channel.startsWith('/topic/')) {
                            for (const callbackEntry of window.MessageBus.callbacks) {
                                if (!callbackEntry?.channel?.startsWith('/topic/')) {
                                    continue;
                                }
                                // Either unsubscribing the exact channel, or globbing for all topic update channels.
                                // See also: https://github.com/discourse/discourse/blob/38fdd842f564bb785e397661b52b002cdf120dc7/app/assets/javascripts/discourse/app/controllers/topic.js#L1605
                                if (callbackEntry.channel !== channel && channel !== '/topic/*') {
                                    continue;
                                }
                                // If this is our hook function, and the original function is exactly `func`, undo the hook so that it can be unsubscribed.
                                if (callbackEntry.func !== func && getOrigFunc(callbackEntry.func) === func) {
                                    callbackEntry.func = func;
                                }
                            }
                        }
                        return origFunc.call(window.MessageBus, channel, func);
                    }, 'unsubscribe-hooked-callback');
                }
                if (element.matches('.cooked')) {
                    if (element.closest('.embedded-posts')) {
                        return;
                    }
                    // Re-render posts that were recently deleted by author, if we have recorded the original content.
                    const article = element.closest('article');
                    const editHistory = getDataAtElement(article, 'editHistory');
                    if (editHistory?.length &&
                        element.childElementCount === 1 &&
                        element.firstElementChild.matches('p') &&
                        ['（话题已被作者删除）', '（帖子已被作者删除）'].includes(element.firstElementChild.textContent)) {
                        element.innerHTML = editHistory.at(-1);
                        element.style.background = 'var(--danger-low)';
                        element.style.border = '2px dotted var(--danger)';
                    }
                }
            },
        },
        {
            id: 'mark-topic-owner-posts',
            description: '为楼主的帖子添加标记',
            group: 'read-content',
            enabledByDefault: true,
            matchClass: ['names', 'embedded-reply'],
            onInitialize: () => {
                if (IS_MOBILE_VIEW) {
                    addGlobalStyle(`
                        .topic-post.topic-owner .names .first span.shuiyuan-helper-topic-owner-posts-marker {
                            font-weight: normal;
                            color: var(--primary);
                            background-color: var(--primary-low);
                            border-radius: 8px;
                            padding-left: 5px;
                            padding-right: 5px;
                            margin-right: 0;
                            overflow: visible;
                            text-overflow: clip;
                        }
                        .topic-post.topic-owner .names .first a {
                            margin-right: 4px;
                            /* Reserve space for both "楼主" marker and username-color-indicator */
                            max-width: calc(100% - var(--shuiyuan-helper-topic-owner-names-reserved-width, 54px));
                            overflow: hidden;
                            vertical-align: middle;
                        }
                    `);
                } else {
                    addGlobalStyle(`
                        .names span.shuiyuan-helper-topic-owner-posts-marker {
                            color: var(--primary);
                            background-color: var(--primary-low);
                            border-radius: 8px;
                            padding-left: 5px;
                            padding-right: 5px;
                            overflow: visible;
                            text-overflow: clip;
                        }
                    `);
                }
            },
            onMatch: async (element) => {
                const markTopicOwnerPost = (container) => {
                    if (container.getElementsByClassName('shuiyuan-helper-topic-owner-posts-marker').length > 0) {
                        return;
                    }

                    const marker = document.createElement('span');
                    marker.classList.add('shuiyuan-helper-topic-owner-posts-marker');
                    marker.textContent = '楼主';
                    container.appendChild(marker);

                    if (IS_MOBILE_VIEW && !document.documentElement.style.getPropertyValue('--shuiyuan-helper-topic-owner-names-reserved-width')) {
                        const reservedWidths = [];

                        const recordHorizontalWidth = (style, includeContent) => {
                            reservedWidths.push(
                                style.marginLeft, style.marginRight,
                                style.borderLeftWidth, style.borderRightWidth,
                                style.paddingLeft, style.paddingRight,
                            );
                            if (includeContent) {
                                reservedWidths.push(style.width);
                            }
                        };

                        const firstA = container.firstElementChild;
                        if (!firstA?.matches('.names .first a')) {
                            // eslint-disable-next-line no-console
                            console.error('Missing .names .first a');
                            return;
                        }
                        recordHorizontalWidth(getComputedStyle(firstA), false);

                        // Note: If the post author is a moderator or category moderator, there is an .svg-icon-title (shield icon) after the .first a.
                        // See https://github.com/discourse/discourse/blob/dd98ecb7d13f4de727b29cdb7646f0d15a981f5c/app/assets/javascripts/discourse/app/widgets/poster-name.js#L77
                        // It is currently hidden by Shuiyuan though.

                        // Reserve space for .shuiyuan-helper-topic-owner-posts-marker.
                        recordHorizontalWidth(getComputedStyle(marker), true);

                        // If the ::after pseudo-element exists, reserve space for it.
                        const afterStyle = getComputedStyle(container, ':after');
                        if (afterStyle.content && !['none', 'normal'].includes(afterStyle.content) && afterStyle.display !== 'none') {
                            recordHorizontalWidth(afterStyle, true);
                        }

                        // Note: If the page started with very small width (< 230px), getComputedStyle may return smaller values.
                        // That should be a rare scenario.

                        document.documentElement.style.setProperty(
                            '--shuiyuan-helper-topic-owner-names-reserved-width',
                            `calc(${reservedWidths.filter((w) => w && !['0', '0px'].includes(w)).join(' + ')})`,
                        );
                    }
                };

                if (element.matches('.names')) {
                    if (!element.closest('.topic-post.topic-owner .topic-meta-data') || element.closest('.embedded-reply')) {
                        return;
                    }
                    if (IS_MOBILE_VIEW) {
                        const namesFirst = element.getElementsByClassName('first')[0];
                        if (!namesFirst) {
                            // eslint-disable-next-line no-console
                            console.error('Cannot locate .first in .names');
                            return;
                        }
                        markTopicOwnerPost(namesFirst);
                    } else {
                        markTopicOwnerPost(element);
                    }
                }

                if (element.matches('.embedded-reply')) { // This should not happen on mobile view.
                    // In order to mark .embedded-reply belonging to the topic owner, we need to know the username of the topic owner.
                    const markTopicOwnerEmbeddedReply = (el, topicOwnerUsername) => {
                        if (typeof topicOwnerUsername !== 'string') {
                            // eslint-disable-next-line no-console
                            console.error('Topic owner username not a string:', topicOwnerUsername);
                            return;
                        }
                        if (topicOwnerUsername.includes('\x00')) {
                            // eslint-disable-next-line no-console
                            console.error(`Topic owner username contains the null character: ${topicOwnerUsername}`);
                            return;
                        }
                        if (el.querySelector(`a[data-user-card="${CSS.escape(topicOwnerUsername)}" i]`)) {
                            el.classList.add('shuiyuan-helper-topic-owner-embedded-reply');
                            const namesDiv = el.getElementsByClassName('names')[0];
                            if (!namesDiv) {
                                // eslint-disable-next-line no-console
                                console.error('Cannot locate .names in .shuiyuan-helper-topic-owner-embedded-reply');
                                return;
                            }
                            markTopicOwnerPost(namesDiv);
                        }
                    };

                    // We want to fetch the topic owner username only once for each topic (view), while .embedded-reply is per post.
                    // We store (share) data under the .topic-area element.
                    const topicArea = element.closest('.topic-area');

                    // If topic owner username is not yet cached, it needs to be fetched.
                    if (!hasDataAtElement(topicArea, 'topicOwnerUsername')) {
                        // This function could be executed concurrently in case of multiple .embedded-reply elements appearing,
                        // while sharing data under .topic-area. Thus we need to prevent race condition.

                        // If another promise is already fetching the topic owner username, we do not need to fetch.
                        // Add this .embedded-reply element to the pending list and let that promise handle it later.
                        if (getDataAtElement(topicArea, 'topicOwnerUsernameBeingFetched')) {
                            setDataAtElementIfAbsent(topicArea, 'markTopicOwnerEmbeddedReplyPendingElements', []).push(element);
                            return;
                        }

                        // We are the first promise started here. We should fetch the topic owner username.
                        // Set the topicOwnerUsernameBeingFetched flag so that later promises will know we are already doing the job.
                        setDataAtElement(topicArea, 'topicOwnerUsernameBeingFetched', true);
                        let topicOwnerUsername = null;
                        try {
                            const topicId = parseInt(topicArea.getAttribute('data-topic-id'), 10);
                            const data = await (await discourseFetch(`/t/${topicId}.json`)).json();
                            topicOwnerUsername = data.details?.created_by?.username ?? data.post_stream.posts[0].username;
                            if (!topicOwnerUsername) {
                                throw new Error('Cannot find topic owner username');
                            }
                            // Cache the topic owner username, so that we do not need to fetch it again for this topic (view).
                            setDataAtElement(topicArea, 'topicOwnerUsername', topicOwnerUsername);
                        } catch (e) {
                            // Make sure to unset the topicOwnerUsernameBeingFetched flag upon errors,
                            // so that later promises could still try again.
                            deleteDataAtElement(topicArea, 'topicOwnerUsernameBeingFetched');
                            // Discard pending elements as we cannot handle them in case of fetch failure.
                            deleteDataAtElement(topicArea, 'markTopicOwnerEmbeddedReplyPendingElements');
                            // eslint-disable-next-line no-console
                            console.error(e);
                            return;
                        }

                        // We are done fetching. Unset the topicOwnerUsernameBeingFetched flag.
                        deleteDataAtElement(topicArea, 'topicOwnerUsernameBeingFetched');

                        // If any other promises have added elements to the pending list, take care of them now.
                        try {
                            for (const el of getDataAtElement(topicArea, 'markTopicOwnerEmbeddedReplyPendingElements') ?? []) {
                                markTopicOwnerEmbeddedReply(el, topicOwnerUsername);
                            }
                        } catch (e) {
                            // eslint-disable-next-line no-console
                            console.error(e);
                        }
                        // We are done with the pending list. Clear it.
                        deleteDataAtElement(topicArea, 'markTopicOwnerEmbeddedReplyPendingElements');
                    }

                    // Now topic owner username must be available (either read from cache or just fetched).
                    // We can process the current .embedded-reply element now.
                    markTopicOwnerEmbeddedReply(element, getDataAtElement(topicArea, 'topicOwnerUsername'));
                }
            },
        },
        {
            id: 'show-post-raw-info',
            description: '可显示帖子原始数据',
            group: 'read-content',
            enabledByDefault: false,
            options: [
                {
                    id: 'expand-code-blocks-by-default',
                    description: '默认展开代码块',
                    type: 'boolean',
                    defaultValue: false,
                },
            ],
            matchClass: 'actions',
            onInitialize: () => {
                addGlobalStyle(`
                    .shuiyuan-helper-post-raw-info-display {
                        position: relative;
                        padding: 0.5em;
                        background: var(--tertiary-very-low);
                        border: 2px dotted var(--tertiary);
                        font-style: normal;
                    }
                    .shuiyuan-helper-post-raw-info-display-section:not(:last-child) {
                        margin-bottom: 10px;
                    }
                    .shuiyuan-helper-post-raw-info-display .shuiyuan-helper-post-raw-info-display-section > h4 {
                        margin-top: 0;
                        margin-bottom: 5px;
                    }
                    .shuiyuan-helper-post-raw-info-display-section > .desc,
                    .shuiyuan-helper-post-raw-info-display-section summary.desc {
                        color: var(--primary-high);
                    }
                    .shuiyuan-helper-post-raw-info-display-code-block {
                        margin-top: 5px;
                        margin-bottom: 5px;
                    }
                    .shuiyuan-helper-post-raw-info-display-code-block code {
                        white-space: pre-wrap;
                    }
                    .shuiyuan-helper-close-post-raw-info-display-button {
                        position: absolute;
                        top: 5px;
                        right: 5px;
                    }
                `);
            },
            onMatch: (element, optionValues) => {
                if (!element.closest('.post-menu-area .post-controls')) {
                    return;
                }

                // From: https://github.com/discourse/discourse/blob/f7367488536ce92a02b4eba4376b447c622fb490/app/models/post.rb#L157
                const hiddenReasonsMap = new Map([
                    [1, '达到举报阈值'],
                    [2, '再次达到举报阈值'],
                    [3, '达到 TL0 用户垃圾信息阈值'],
                    [4, 'TL0 用户帖子被 TL3 及以上用户举报为垃圾信息'],
                    // No translation below, as they seem to be unused.
                    [5, 'email_spam_header_found'],
                    [6, 'flagged_by_tl4_user'],
                    [7, 'email_authentication_result_header'],
                    [8, 'imported_as_unlisted'],
                ]);

                const expandCodeBlocksByDefault = optionValues['expand-code-blocks-by-default'];

                const addPostRawInfoDisplay = async (postCookedDiv, postId) => {
                    const createMention = (username) => {
                        const mention = document.createElement('a');
                        mention.classList.add('mention');
                        mention.href = `/u/${encodeURIComponent(username)}`;
                        mention.textContent = `@${username}`;
                        return mention;
                    };

                    const createCodeBlock = async (code, language) => {
                        const codePre = document.createElement('pre');
                        codePre.classList.add('shuiyuan-helper-post-raw-info-display-code-block');
                        const codeCode = document.createElement('code');
                        codeCode.classList.add(`lang-${language || 'auto'}`);
                        codeCode.textContent = code;
                        codePre.appendChild(codeCode);
                        // Apply syntax highlighting.
                        try {
                            const discourseContainer = window.Discourse.__container__;
                            await window.require('discourse/lib/highlight-syntax').default(
                                codePre,
                                discourseContainer.lookup('service:site-settings'),
                                discourseContainer.lookup('service:session'),
                            );
                        } catch (e) {
                            // eslint-disable-next-line no-console
                            console.error(e);
                        }
                        return codePre;
                    };

                    const addDisplayLine = (container, itemDesc, itemCodeName, content, options) => {
                        // Only show description, no content.
                        const descOnly = options?.descOnly ?? false;
                        // Content is HTML node instead of text.
                        const richContent = options?.richContent ?? false;
                        // Whether to add a <br> at the end.
                        const lineBreak = options?.lineBreak ?? true;
                        // Omit this display line, if we expect to display content but content is empty.
                        if (!descOnly && [undefined, null, ''].includes(content)) {
                            return;
                        }
                        const descSpan = document.createElement('span');
                        descSpan.classList.add('desc');
                        if (itemCodeName) {
                            descSpan.appendChild(document.createTextNode(`${itemDesc} `));
                            const codeName = document.createElement('code');
                            codeName.textContent = itemCodeName;
                            descSpan.appendChild(codeName);
                        } else {
                            descSpan.textContent = itemDesc;
                        }
                        container.appendChild(descSpan);
                        if (!descOnly) {
                            container.appendChild(document.createTextNode(' '));
                            if (richContent) {
                                container.appendChild(content);
                            } else {
                                const contentSpan = document.createElement('span');
                                contentSpan.textContent = content.toString();
                                container.appendChild(contentSpan);
                            }
                        }
                        if (lineBreak) {
                            container.appendChild(document.createElement('br'));
                        }
                    };

                    const addDisplayDetails = (container, itemDesc, itemCodeName, content) => {
                        const details = document.createElement('details');
                        details.open = expandCodeBlocksByDefault;
                        const summary = document.createElement('summary');
                        summary.classList.add('desc');
                        if (itemCodeName) {
                            summary.appendChild(document.createTextNode(`${itemDesc} `));
                            const codeName = document.createElement('code');
                            codeName.textContent = itemCodeName;
                            summary.appendChild(codeName);
                        } else {
                            summary.textContent = itemDesc;
                        }
                        details.append(summary, content);
                        container.appendChild(details);
                    };

                    const addDisplaySection = async (container, title, sectionId, populateItemsFunc) => {
                        // Create a div for this section.
                        const sectionDiv = document.createElement('div');
                        sectionDiv.classList.add('shuiyuan-helper-post-raw-info-display-section');
                        if (sectionId) {
                            sectionDiv.setAttribute('data-section', sectionId);
                        }
                        // Add section header.
                        const sectionHeader = document.createElement('h4');
                        sectionHeader.textContent = title;
                        sectionDiv.appendChild(sectionHeader);
                        // Populate content.
                        await Promise.resolve(populateItemsFunc(sectionDiv));
                        // Remove final <br> in the content.
                        if (sectionDiv.lastChild.matches?.('br')) {
                            sectionDiv.lastChild.remove();
                        }
                        // If a section has no content, we can omit it.
                        if (sectionDiv.lastChild === sectionHeader) {
                            return;
                        }
                        container.appendChild(sectionDiv);
                    };

                    const addViewJSONRawInfoLink = (container, text, className, url) => {
                        const rawInfoLinkDiv = document.createElement('div');
                        rawInfoLinkDiv.classList.add('shuiyuan-helper-view-json-raw-info-link');
                        if (className) {
                            rawInfoLinkDiv.classList.add(className);
                        }
                        const rawInfoLink = document.createElement('a');
                        rawInfoLink.href = url;
                        rawInfoLink.textContent = text;
                        rawInfoLinkDiv.appendChild(rawInfoLink);
                        container.appendChild(rawInfoLinkDiv);
                    };

                    const postRawInfoDisplayDiv = document.createElement('div');
                    postRawInfoDisplayDiv.classList.add('shuiyuan-helper-post-raw-info-display');

                    const closeRawInfoDisplayButton = document.createElement('button');
                    closeRawInfoDisplayButton.classList.add('btn-flat', 'shuiyuan-helper-close-post-raw-info-display-button', 'no-text', 'btn-icon', 'close');
                    closeRawInfoDisplayButton.title = '关闭帖子原始数据显示';
                    closeRawInfoDisplayButton.innerHTML = CLOSE_ICON;
                    closeRawInfoDisplayButton.addEventListener('click', () => {
                        postRawInfoDisplayDiv.remove();
                    });
                    postRawInfoDisplayDiv.appendChild(closeRawInfoDisplayButton);

                    const postInfo = await (await discourseFetch(`/posts/${postId}.json`)).json();
                    const isTopicFirstPost = postInfo.post_number === 1;
                    let topicInfo = null;
                    if (isTopicFirstPost) {
                        topicInfo = await (await discourseFetch(`/t/${postInfo.topic_id}.json`)).json();
                    }
                    // If post is hidden, its content needs to be fetched separately.
                    if (postInfo.hidden) {
                        const results = await promiseAllSettledLogErrors([
                            (async () => (await discourseFetch(`/posts/${postId}/raw`)).text())(),
                            (async () => (await discourseFetch(`/posts/${postId}/cooked.json`)).json())(),
                        ]);
                        if (results[0].status === 'fulfilled') {
                            // eslint-disable-next-line require-atomic-updates
                            postInfo.raw = results[0].value;
                        }
                        if (results[1].status === 'fulfilled') {
                            // eslint-disable-next-line require-atomic-updates
                            postInfo.cooked = results[1].value?.cooked;
                        }
                    }
                    const postLocation = `${postInfo.topic_id}/${postInfo.post_number}`;

                    if (isTopicFirstPost) {
                        await addDisplaySection(postRawInfoDisplayDiv, '话题基本信息', 'topic-basic-info', async (container) => {
                            const rawTitle = topicInfo.title;
                            const htmlTitle = topicInfo.fancy_title;
                            const unicodeTitle = topicInfo.unicode_title;
                            const hasDifferentHtmlTitle = htmlTitle && htmlTitle !== rawTitle;
                            const hasDifferentUnicodeTitle = unicodeTitle && unicodeTitle !== rawTitle;
                            const hasDifferentTitleVersions = hasDifferentHtmlTitle || hasDifferentUnicodeTitle;
                            addDisplayLine(
                                container, hasDifferentTitleVersions ? '原始标题' : '标题', 'title',
                                await createCodeBlock(rawTitle, 'text'), {richContent: true, lineBreak: false},
                            );
                            if (hasDifferentHtmlTitle) {
                                addDisplayLine(container, 'HTML 标题', 'fancy_title', await createCodeBlock(htmlTitle, 'html'), {richContent: true, lineBreak: false});
                            }
                            if (hasDifferentUnicodeTitle) {
                                addDisplayLine(container, 'Unicode 标题', 'unicode_title', await createCodeBlock(unicodeTitle, 'text'), {richContent: true, lineBreak: false});
                            }
                        });
                    }

                    await addDisplaySection(postRawInfoDisplayDiv, '帖子基本信息', 'post-basic-info', (container) => {
                        addDisplayLine(container, '帖子编号', 'post_id', postInfo.id);
                        addDisplayLine(container, '所在话题编号/楼层', 'topic_id/post_number', postLocation);
                        addDisplayLine(container, '回复楼层', 'reply_to_post_number', postInfo.reply_to_post_number);
                        const replyToUsername = postInfo.reply_to_user?.username;
                        if (replyToUsername) {
                            addDisplayLine(container, '回复用户', 'reply_to_user', createMention(replyToUsername), {richContent: true});
                        }
                    });

                    await addDisplaySection(postRawInfoDisplayDiv, '帖子内容', 'post-content', async (container) => {
                        addDisplayDetails(container, '原始内容', 'raw', await createCodeBlock(postInfo.raw, 'markdown'));
                        addDisplayDetails(container, '构建内容', 'cooked', await createCodeBlock(postInfo.cooked, 'html'));
                        if (postInfo.polls?.length) {
                            addDisplayDetails(container, '包含的投票', 'polls', await createCodeBlock(JSON.stringify(postInfo.polls, null, 4), 'json'));
                        }
                    });

                    if (isTopicFirstPost) {
                        await addDisplaySection(postRawInfoDisplayDiv, '话题状态', 'topic-status', (container) => {
                            if (topicInfo.closed) {
                                addDisplayLine(container, '话题已被关闭', 'closed', null, {descOnly: true});
                            }
                            if (topicInfo.archived) {
                                addDisplayLine(container, '话题已被归档', 'archived', null, {descOnly: true});
                            }
                            if (topicInfo.visible === false) {
                                addDisplayLine(container, '话题已被取消公开', 'visible=false', null, {descOnly: true});
                            }
                            if (topicInfo.no_bump) {
                                addDisplayLine(container, '话题已被禁止顶帖', 'no_bump', null, {descOnly: true});
                            }
                            if (topicInfo.is_warning) {
                                addDisplayLine(container, '这是一个官方警告私信', 'is_warning', null, {descOnly: true});
                            }
                        });
                    }

                    await addDisplaySection(postRawInfoDisplayDiv, '帖子状态', 'post-status', (container) => {
                        addDisplayLine(container, '编辑原因', 'edit_reason', postInfo.edit_reason);
                        if (postInfo.user_deleted) {
                            addDisplayLine(container, '帖子已被作者删除', 'user_deleted', null, {descOnly: true});
                        }
                        if (postInfo.hidden) {
                            addDisplayLine(container, '帖子已被举报隐藏', 'hidden', null, {descOnly: true});
                            addDisplayLine(container, '隐藏原因', 'hidden_reason_id', hiddenReasonsMap.get(postInfo.hidden_reason_id) ?? postInfo.hidden_reason_id);
                        }
                    });

                    if (isTopicFirstPost) {
                        await addDisplaySection(postRawInfoDisplayDiv, '话题统计信息', 'topic-stats', (container) => {
                            addDisplayLine(container, '总楼层数', 'highest_post_number', topicInfo.highest_post_number);
                            addDisplayLine(container, '有效楼层数', 'posts_count', topicInfo.posts_count);
                        });
                    }

                    await addDisplaySection(postRawInfoDisplayDiv, '帖子统计信息', 'post-stats', (container) => {
                        addDisplayLine(container, '阅读人数', 'readers_count', postInfo.readers_count);
                        addDisplayLine(container, '分数', 'score', postInfo.score);
                    });

                    if (isTopicFirstPost) {
                        addViewJSONRawInfoLink(postRawInfoDisplayDiv, '查看话题 JSON 原始数据', 'view-topic-json', `/t/${postInfo.topic_id}.json`);
                    }
                    addViewJSONRawInfoLink(postRawInfoDisplayDiv, '查看帖子 JSON 原始数据', 'view-post-json', `/posts/by_number/${postLocation}.json`);

                    postCookedDiv.appendChild(postRawInfoDisplayDiv);

                    // Add copy buttons to code blocks.
                    try {
                        const CodeblockButtons = window.require('discourse/lib/codeblock-buttons').default;
                        new CodeblockButtons().attachToGeneric(postRawInfoDisplayDiv);
                    } catch (e) {
                        // eslint-disable-next-line no-console
                        console.error(e);
                    }
                };

                if (!element.shadowRoot) {
                    element.attachShadow({mode: 'open'});

                    addShadowDOMStyle(element.shadowRoot, `
                        .shuiyuan-helper-toggle-show-post-raw-info-button {
                            margin-left: var(--control-margin);
                            flex: 0 1 auto;
                            font-size: var(--font-up-1);
                            padding: 8px 10px;
                            vertical-align: top;
                            background: transparent;
                            border: none;
                            color: var(--primary-low-mid-or-secondary-high);
                            cursor: pointer;
                            -webkit-appearance: button;
                            overflow: visible;
                            line-height: var(--line-height-small);
                            transition: color 0.25s, background 0.25s;
                        }
                        .shuiyuan-helper-toggle-show-post-raw-info-button:active,
                        .shuiyuan-helper-toggle-show-post-raw-info-button:focus {
                            outline: none;
                            background: var(--primary-low);
                            color: var(--primary);
                        }
                        .shuiyuan-helper-toggle-show-post-raw-info-button.pending {
                            cursor: wait;
                        }
                        .shuiyuan-helper-toggle-show-post-raw-info-button > svg {
                            opacity: 1;
                            color: var(--primary-low-mid);
                            height: 1em;
                            width: 1em;
                            line-height: 1;
                            display: inline-flex;
                            position: relative;
                            vertical-align: -0.125em;
                            fill: currentColor;
                            flex-shrink: 0;
                            overflow: visible;
                        }
                        .shuiyuan-helper-toggle-show-post-raw-info-button:focus > svg {
                            color: var(--primary);
                        }
                    `);
                    if (!IS_MOBILE_DEVICE) {
                        addShadowDOMStyle(element.shadowRoot, `
                            .shuiyuan-helper-toggle-show-post-raw-info-button:hover {
                                outline: none;
                                background: var(--primary-low);
                                color: var(--primary);
                            }
                            .shuiyuan-helper-toggle-show-post-raw-info-button:hover > svg {
                                color: var(--primary);
                            }
                        `);
                    }
                    switch (getCurrentThemeInfo().themeId) {
                        case 31: // graceful
                            addShadowDOMStyle(element.shadowRoot, `
                                .shuiyuan-helper-toggle-show-post-raw-info-button.btn-flat {
                                    border-radius: 4px;
                                }
                            `);
                            break;
                        case 43: // Isabelle
                            addShadowDOMStyle(element.shadowRoot, `
                                .shuiyuan-helper-toggle-show-post-raw-info-button.btn-flat {
                                    color: #68c6b9;
                                    border-radius: 20px;
                                    transition: top 0.25s, background-color 0.3s;
                                }
                                .shuiyuan-helper-toggle-show-post-raw-info-button.btn-flat > svg {
                                    color: #68c6b9;
                                }
                            `);
                            if (isNoTouchDevice()) {
                                addShadowDOMStyle(element.shadowRoot, `
                                    .shuiyuan-helper-toggle-show-post-raw-info-button.btn-flat:hover {
                                        background: #015562;
                                        box-shadow: 0 4px 0 0 #00333d;
                                        position: relative;
                                        top: -3px;
                                        color: #faf7e9;
                                    }
                                    .shuiyuan-helper-toggle-show-post-raw-info-button.btn-flat:hover > svg {
                                        color: #faf7e9;
                                    }
                                `);
                            }
                            break;
                    }

                    const toggleShowPostRawInfoButton = document.createElement('button');
                    toggleShowPostRawInfoButton.classList.add('widget-button', 'btn-flat', 'shuiyuan-helper-toggle-show-post-raw-info-button', 'no-text', 'btn-icon');
                    toggleShowPostRawInfoButton.title = '切换显示帖子原始数据';
                    toggleShowPostRawInfoButton.innerHTML = CODE_ICON;
                    toggleShowPostRawInfoButton.addEventListener('click', async () => {
                        toggleShowPostRawInfoButton.disabled = true;
                        toggleShowPostRawInfoButton.classList.add('pending');
                        try {
                            const article = element.closest('article');
                            const postCookedDiv = getPostCookedDiv(article);
                            if (!postCookedDiv) {
                                throw new Error('Missing .cooked div for post');
                            }
                            const existingPostRawInfoDisplay = postCookedDiv.getElementsByClassName('shuiyuan-helper-post-raw-info-display')[0];
                            if (existingPostRawInfoDisplay) {
                                existingPostRawInfoDisplay.remove();
                            } else {
                                await addPostRawInfoDisplay(postCookedDiv, parseInt(article.getAttribute('data-post-id'), 10));
                            }
                        } catch (e) {
                            // eslint-disable-next-line no-console
                            console.error(e);
                        }
                        toggleShowPostRawInfoButton.classList.remove('pending');
                        toggleShowPostRawInfoButton.disabled = false;
                    });

                    // Add toggle show post raw info button before other post controls buttons, within the Shadow DOM.
                    element.shadowRoot.appendChild(toggleShowPostRawInfoButton);
                    element.shadowRoot.appendChild(document.createElement('slot'));
                }
            },
        },
        {
            id: 'show-online-user-count',
            description: '在时间线上显示在线用户数',
            group: 'users',
            enabledByDefault: false,
            matchClass: 'list-container',
            onInitialize: () => {
                addGlobalStyle(`
                    .container.list-container::before {
                        content: attr(data-shuiyuan-helper-online-user-count) attr(data-shuiyuan-helper-online-user-count-last-updated);
                        color: var(--primary-medium);
                        padding-left: 5px;
                        padding-bottom: 5px;
                    }
                `);
            },
            onMatch: () => {
                const updateOnlineUserCountText = (el, onlineUserCount, lastUpdated) => {
                    let onlineUserCountText = null;
                    if ([null, undefined].includes(onlineUserCount)) {
                        onlineUserCountText = '获取在线用户数失败';
                    } else if (onlineUserCount > 0) {
                        onlineUserCountText = `${onlineUserCount} 位用户在线`;
                    } else {
                        onlineUserCountText = '当前没有用户在线';
                    }
                    const hh = lastUpdated.getHours().toString().padStart(2, '0');
                    const mm = lastUpdated.getMinutes().toString().padStart(2, '0');
                    const ss = lastUpdated.getSeconds().toString().padStart(2, '0');
                    el.setAttribute('data-shuiyuan-helper-online-user-count', onlineUserCountText);
                    el.setAttribute('data-shuiyuan-helper-online-user-count-last-updated', `（更新于 ${hh}:${mm}:${ss}）`);
                };

                const fetchAndUpdateOnlineUserCount = async () => {
                    // If the page is not visible, or .list-container is not on the page,
                    // we do not update online user count, and do not schedule next update.
                    if (document.visibilityState !== 'visible') {
                        shuiyuanHelperMemory.set('onlineUserCountUpdateTimeoutID', null);
                        return;
                    }
                    const listContainer = document.getElementsByClassName('list-container')[0];
                    if (!listContainer) {
                        shuiyuanHelperMemory.set('onlineUserCountUpdateTimeoutID', null);
                        return;
                    }

                    // Fetch the latest online user count and update.
                    listContainer.setAttribute('data-shuiyuan-helper-online-user-count-last-updated', '（正在更新在线用户数...）');
                    let onlineUserCount = null;
                    try {
                        onlineUserCount = await getOnlineUserCount();
                    } catch (e) {
                        // eslint-disable-next-line no-console
                        console.error(e);
                    }
                    const currentDate = new Date();
                    updateOnlineUserCountText(listContainer, onlineUserCount, currentDate);

                    // Cache the current online user count value.
                    shuiyuanHelperMemory.set('onlineUserCountLastValue', onlineUserCount);
                    shuiyuanHelperMemory.set('onlineUserCountLastUpdated', currentDate);

                    // Schedule next update.
                    shuiyuanHelperMemory.set('onlineUserCountUpdateTimeoutID', setTimeout(fetchAndUpdateOnlineUserCount, UPDATE_ONLINE_USER_COUNT_INTERVAL));
                    shuiyuanHelperMemory.set('onlineUserCountUpdateScheduled', new Date());
                };

                const startUpdateOnlineUserCount = () => {
                    const listContainer = document.getElementsByClassName('list-container')[0];
                    if (!listContainer) {
                        return;
                    }
                    const onlineUserCountUpdateTimeoutID = shuiyuanHelperMemory.get('onlineUserCountUpdateTimeoutID');
                    if (onlineUserCountUpdateTimeoutID) {
                        const onlineUserCountUpdateScheduled = shuiyuanHelperMemory.get('onlineUserCountUpdateScheduled');
                        if (onlineUserCountUpdateScheduled && new Date() - onlineUserCountUpdateScheduled <= UPDATE_ONLINE_USER_COUNT_INTERVAL * 1.5) {
                            // If we have a recently scheduled update, do not schedule one more. Show the cached online user count value if available.
                            if (shuiyuanHelperMemory.has('onlineUserCountLastValue')) {
                                updateOnlineUserCountText(
                                    listContainer,
                                    shuiyuanHelperMemory.get('onlineUserCountLastValue'),
                                    shuiyuanHelperMemory.get('onlineUserCountLastUpdated'),
                                );
                            }
                            return;
                        }
                        // If the most recently scheduled update is too old, cancel it and schedule a new one to be executed immediately.
                        clearTimeout(onlineUserCountUpdateTimeoutID);
                    }
                    // If we do not have a scheduled update, schedule one to be executed immediately.
                    shuiyuanHelperMemory.set('onlineUserCountUpdateTimeoutID', setTimeout(fetchAndUpdateOnlineUserCount, 0));
                    shuiyuanHelperMemory.set('onlineUserCountUpdateScheduled', new Date());
                };

                // Register visibilitychange listener if not registered yet.
                if (!shuiyuanHelperMemory.has('onlineUserCountVisibilityChangeListener')) {
                    const onlineUserCountVisibilityChangeListener = () => {
                        // Consider updating online user count when page becomes visible again.
                        if (document.visibilityState === 'visible') {
                            startUpdateOnlineUserCount();
                        }
                    };
                    document.addEventListener('visibilitychange', onlineUserCountVisibilityChangeListener);
                    shuiyuanHelperMemory.set('onlineUserCountVisibilityChangeListener', onlineUserCountVisibilityChangeListener);
                }

                // Consider updating online user count when .list-container appears (i.e. loading/switching to timeline pages).
                startUpdateOnlineUserCount();
            },
        },
        {
            id: 'replace-site-logo',
            description: '替换站点 logo',
            group: 'interface',
            enabledByDefault: false,
            options: [
                {
                    id: 'big-logo-url',
                    description: '大 logo URL',
                    instructions: '支持 HTTPS、HTTP 或 Data URL。',
                    type: 'string',
                    defaultValue: '',
                },
                {
                    id: 'small-logo-url',
                    description: '小 logo URL',
                    instructions: '将同时用于 @system 用户的头像及站点的 favicon。建议为正方形。仅支持水源站内链接或 Data URL。',
                    type: 'string',
                    defaultValue: '',
                },
            ],
            matchId: 'site-logo',
            matchClass: ['logo-big', 'logo-small', 'logo-mobile', 'avatar'],
            onInitialize: (optionValues) => {
                const replaceLinkHref = (link, href) => {
                    if (!link) {
                        return;
                    }
                    link.href = href;
                    link.referrerPolicy = 'same-origin';
                };

                const replaceMetaContent = (meta, content) => {
                    if (!meta) {
                        return;
                    }
                    meta.content = content;
                };

                // Validate logo options.
                const logoConfigFields = [
                    ['big-logo-url', 'siteBigLogoReplacementURL'],
                    ['small-logo-url', 'siteSmallLogoReplacementURL'],
                ];
                for (const [optionId, memoryCacheKey] of logoConfigFields) {
                    const optionValue = optionValues[optionId].trim();
                    if (!optionValue) {
                        continue;
                    }
                    try {
                        const logoURL = new URL(optionValue, window.location.origin);
                        if (!['https:', 'http:', 'data:'].includes(logoURL.protocol)) {
                            throw new Error(`Unsupported protocol for ${optionId}: ${logoURL.protocol}`);
                        }
                        if (optionId === 'small-logo-url' && logoURL.protocol !== 'data:' && logoURL.origin !== window.location.origin) {
                            throw new Error('Cross-origin URL is not supported for small-logo-url');
                        }
                        shuiyuanHelperMemory.set(memoryCacheKey, logoURL.href);
                    } catch (e) {
                        // eslint-disable-next-line no-console
                        console.error(e);
                    }
                }

                // Replace link and meta tags containing the site favicon.
                const siteSmallLogoReplacementURL = shuiyuanHelperMemory.get('siteSmallLogoReplacementURL');
                if (siteSmallLogoReplacementURL) {
                    replaceLinkHref(document.querySelector('link[rel="icon"]'), siteSmallLogoReplacementURL);
                    replaceLinkHref(document.querySelector('link[rel="apple-touch-icon"]'), siteSmallLogoReplacementURL);
                    replaceMetaContent(document.querySelector('meta[name="twitter:image"]'), siteSmallLogoReplacementURL);
                    replaceMetaContent(document.querySelector('meta[property="og:image"]'), siteSmallLogoReplacementURL);
                    // Note: We are not able to replace icons at these locations:
                    // - OpenSearch description (`<link rel="search" type="application/opensearchdescription+xml" ...>)
                    // - Web app manifest (`<link rel="manifest" ...>`)
                }
            },
            onMatch: (element) => {
                const replaceImageURL = (img, url, firefoxWorkaround) => {
                    if (img.matches('.shuiyuan-helper-replace-site-logo')) {
                        return;
                    }
                    img.classList.add('shuiyuan-helper-replace-site-logo');
                    img.src = url;
                    img.referrerPolicy = 'same-origin';
                    // If the image has a srcset attribute, remove (and back up) it because it has a higher precedence than the src attribute.
                    if (img.hasAttribute('srcset')) {
                        img.setAttribute('data-original-srcset', img.getAttribute('srcset'));
                        img.removeAttribute('srcset');
                    }
                    // On Firefox, sometimes the image does not rerender when we change its src. Using a setTimeout delay seems to help.
                    if (firefoxWorkaround) {
                        setTimeout(() => {
                            // Do not apply workaround if the image is no longer valid.
                            if (document.body.contains(img) && img.matches('.shuiyuan-helper-replace-site-logo')) {
                                img.src = url;
                            }
                        }, 200);
                    }
                };

                const findUsernameInACUserItem = (userItem) => {
                    if (!userItem) {
                        return null;
                    }
                    const usernameSpan = userItem.querySelector('span.username');
                    if (!usernameSpan) {
                        return null;
                    }
                    return usernameSpan.textContent?.trim();
                };

                const findUsernameInUserOnebox = (userOnebox) => {
                    if (!userOnebox) {
                        return null;
                    }
                    const usernameLink = userOnebox.querySelector('h3 a');
                    if (!usernameLink) {
                        return null;
                    }
                    return usernameLink.textContent?.trim();
                };

                const siteBigLogoReplacementURL = shuiyuanHelperMemory.get('siteBigLogoReplacementURL');
                const siteSmallLogoReplacementURL = shuiyuanHelperMemory.get('siteSmallLogoReplacementURL');

                // Replace logo at the top left corner of the page.
                const logoHandlerFields = [
                    ['.logo-big', siteBigLogoReplacementURL],
                    ['.logo-small', siteSmallLogoReplacementURL],
                    ['.logo-mobile', siteBigLogoReplacementURL],
                    ['picture > #site-logo:not(.logo-big, .logo-small, .logo-mobile)', siteBigLogoReplacementURL], // Logo on error pages
                ];
                for (const [selector, replacementURL] of logoHandlerFields) {
                    if (replacementURL && element.matches(selector)) {
                        // Apply workaround on Firefox for big logo replacement.
                        replaceImageURL(element, replacementURL, IS_FIREFOX && replacementURL === siteBigLogoReplacementURL);
                    }
                }

                // Replace avatar of the @system user at multiple locations:
                // - User card link
                // - User card
                // - User page
                // - User Onebox
                // - User search result
                // - Quote of user posts
                if (siteSmallLogoReplacementURL && element.matches('img.avatar')) {
                    if (element.closest([
                        '[data-user-card="system"]',
                        '.user-card.user-card-system',
                        '.select-kit-row:is(.user-row, .email-group-user-chooser-row)[data-value="system"]',
                        'aside.quote[data-username="system"]',
                    ].join(', ')) ||
                        (element.title === 'system' && element.closest('.user-result, .search-item-user')) ||
                        (element.closest('.user-main .user-profile-avatar') && findUsernameInUserPage(element.closest('.user-main')) === 'system') ||
                        (element.closest('.autocomplete.ac-user') && findUsernameInACUserItem(element.parentElement) === 'system') ||
                        (element.closest('aside.quote > .title') && element.src && !element.src.includes('avatar')) ||
                        ['system', '@system'].includes(findUsernameInUserOnebox(element.closest('.user-onebox')))) {
                        replaceImageURL(element, siteSmallLogoReplacementURL);
                    }
                }

                if (IS_DISCOURSE_VIEW && siteSmallLogoReplacementURL) {
                    // Replace site_logo_small_url in SiteSettings. It is used for notifications.
                    if (!shuiyuanHelperMemory.get('siteSettingsSmallLogoReplaced')) {
                        shuiyuanHelperMemory.set('siteSettingsSmallLogoReplaced', true);
                        try {
                            // eslint-disable-next-line camelcase
                            window.Discourse.__container__.lookup('service:site-settings').site_logo_small_url = siteSmallLogoReplacementURL;
                        } catch (e) {
                            // eslint-disable-next-line no-console
                            console.error(e);
                        }
                    }

                    // When update-tab-count updates the favicon, use our replacement small logo.
                    if (!shuiyuanHelperMemory.get('updateTabCountHooked')) {
                        shuiyuanHelperMemory.set('updateTabCountHooked', true);
                        try {
                            applyHook(window.require('discourse/lib/update-tab-count'), 'default', (origFunc) => (url, count) => {
                                origFunc(siteSmallLogoReplacementURL, count);
                            }, 'update-tab-count-with-replaced-small-logo');
                        } catch (e) {
                            // eslint-disable-next-line no-console
                            console.error(e);
                        }
                    }
                }
            },
        },
        {
            id: 'header-blank-avatar',
            description: '隐藏右上角个人头像（替换为默认空头像）',
            group: 'interface',
            enabledByDefault: false,
            matchId: 'current-user',
            onMatch: (element) => {
                const avatarImg = element.getElementsByClassName('avatar')[0];
                if (!avatarImg) {
                    // eslint-disable-next-line no-console
                    console.error('Cannot locate header avatar');
                    return;
                }
                if (avatarImg.matches('.shuiyuan-helper-header-blank-avatar')) {
                    return;
                }
                avatarImg.classList.add('shuiyuan-helper-header-blank-avatar');
                avatarImg.src = '/images/avatar.png';
            },
        },
        {
            id: 'remove-spoiler-blurred',
            description: '去除 Spoiler 模糊',
            group: 'read-content',
            enabledByDefault: false,
            matchClass: 'spoiler-blurred',
            onMatch: (element) => element.classList.remove('spoiler-blurred'),
        },
        {
            id: 'more-enhanced-ignore',
            description: '进一步增强屏蔽',
            instructions: '在回复列表、引用内容和频繁发帖人列表中隐藏被屏蔽的用户及其内容',
            group: 'read-content',
            enabledByDefault: false,
            hidden: true, // Not rolling this out for now due to feature limitations.
            matchClass: ['ignored-user', 'poster', 'reply'],
            onInitialize: () => {
                addGlobalStyle(`
                    aside.quote.ignored-user > .title > img.avatar {
                        display: none !important;
                    }
                `);
            },
            onMatch: (element) => {
                if (element.matches('.quote.ignored-user')) {
                    const asideTitle = element.getElementsByClassName('title')[0];
                    if (!asideTitle) {
                        return;
                    }
                    const usernameNode = asideTitle.lastChild;
                    if (usernameNode?.nodeName !== '#text') {
                        return;
                    }
                    usernameNode.textContent = '已忽略的内容';
                    // Note: Alternatively, we may just hide aside.quote.ignored-user completely.
                    // But then the conversation would seem to lose context (i.e. 虚空输出)
                    // as the post author is trying to reply to the quoted content.
                    // Also, this does not handle reference (link) of a full topic/post with Onebox yet.
                }
                if (element.matches('.reply')) {
                    if (element.querySelector('div.post-ignored')) {
                        element.style.display = 'none';
                    }
                    // Note: This implementation has many limitations:
                    // - When all .reply in .embedded-posts got hidden, the collapse button still appears, which looks bad.
                    // - Text on button.show-replies "* 个回复" cannot be easily and correctly rewritten.
                    // - Unable to correctly hide .reply-to-tab for ignored users.
                }
                if (element.matches('.poster')) {
                    loadIgnoredUsers();
                    if (shuiyuanHelperMemory.get('ignoredUsersLowerCaseSet').has(element.getAttribute('data-user-card')?.toLowerCase())) {
                        element.style.display = 'none';
                    }
                }
            },
        },
        {
            id: 'fix-only-emoji-in-blockquote',
            description: '修复行内大表情被引用时的显示效果',
            group: 'read-content',
            enabledByDefault: true,
            onInitialize: () => {
                addGlobalStyle(`
                    blockquote > img.emoji.only-emoji {
                        margin: 0;
                    }
                `);
            },
        },
        {
            id: 'fix-math-formula-display-and-scrolling',
            description: '修复数学公式的显示和滚动功能',
            group: 'read-content',
            enabledByDefault: true,
            matchClass: [
                'math-container,block-math,mathjax-math',
                'math-container,inline-math,mathjax-math',
                'math-container,inline-math,ascii-math',
            ],
            onInitialize: () => {
                addGlobalStyle(`
                    .math-container:is(.block-math, .ascii-math) > :is(div, span) :is([id*="-Frame"], .katex-html),
                    .math-container:is(.block-math, .ascii-math) > :is(div, span) > :is(nobr, span),
                    .math-container:is(.block-math, .ascii-math) > :is(div, span).MathJax_SVG {
                        overflow-y: hidden;
                    }
                `);
            },
            onMatch: (element) => {
                if (element.classList.contains('math-container,block-math,mathjax-math')) {
                    element.classList.remove('math-container,block-math,mathjax-math');
                    element.classList.add('math-container', 'block-math', 'mathjax-math');
                }
                if (element.classList.contains('math-container,inline-math,mathjax-math')) {
                    element.classList.remove('math-container,inline-math,mathjax-math');
                    element.classList.add('math-container', 'inline-math', 'mathjax-math');
                }
                if (element.classList.contains('math-container,inline-math,ascii-math')) {
                    element.classList.remove('math-container,inline-math,ascii-math');
                    element.classList.add('math-container', 'inline-math', 'ascii-math');
                }
            },
        },
        {
            id: 'settings-view',
            description: '水源助手设置面板',
            enabledByDefault: true,
            hideFromSettings: true,
            matchClass: 'user-navigation-secondary',
            onInitialize: () => {
                addGlobalStyle(`
                    .shuiyuan-helper-settings legend {
                        margin-bottom: 5px;
                    }
                    .user-preferences .shuiyuan-helper-settings .instructions {
                        margin-bottom: 0;
                    }
                    .shuiyuan-helper-settings .label-followed-by-instructions {
                        margin-bottom: 0;
                    }
                    .shuiyuan-helper-settings .shuiyuan-helper-option-controls {
                        padding-left: 2em;
                    }
                    .shuiyuan-helper-settings input[type="number"] {
                        width: 120px;
                    }
                    .shuiyuan-helper-settings button {
                        margin-right: 10px;
                    }
                    .shuiyuan-helper-settings .shuiyuan-helper-settings-import-export :is(label, input, button) {
                        margin-bottom: 10px;
                    }
                `);
            },
            onMatch: (element) => {
                if (isElementHandledByFeature(element, 'settings-view')) {
                    return;
                }
                if (element.getElementsByClassName('user-nav__preferences-account').length === 0) {
                    return;
                }

                const createFieldset = (description, className) => {
                    const fieldset = document.createElement('fieldset');
                    fieldset.classList.add('control-group');
                    if (className) {
                        fieldset.classList.add(className);
                    }
                    const legend = document.createElement('legend');
                    legend.classList.add('control-label');
                    legend.appendChild(document.createTextNode(description));
                    fieldset.appendChild(legend);
                    return fieldset;
                };

                const createInstructionsDiv = (instructions) => {
                    const instructionsDiv = document.createElement('div');
                    instructionsDiv.classList.add('instructions');
                    instructionsDiv.textContent = instructions;
                    return instructionsDiv;
                };

                const createCheckboxDiv = (description, instructions, checked, optionControls, clickHandler) => {
                    const input = document.createElement('input');
                    input.classList.add('ember-checkbox', 'ember-view');
                    input.type = 'checkbox';
                    input.checked = Boolean(checked);
                    input.addEventListener('click', clickHandler);
                    const label = document.createElement('label');
                    label.classList.add('checkbox-label');
                    label.appendChild(input);
                    label.appendChild(document.createTextNode(description));
                    const div = document.createElement('div');
                    div.classList.add('controls', 'ember-view');
                    div.appendChild(label);
                    if (instructions) {
                        label.classList.add('label-followed-by-instructions');
                        div.appendChild(createInstructionsDiv(instructions));
                    }
                    if (optionControls) {
                        div.classList.add('shuiyuan-helper-option-controls');
                        optionControls.push(input);
                    }
                    return div;
                };

                const createIntegerInputDiv = (description, instructions, value, optionControls, inputHandler) => {
                    const input = document.createElement('input');
                    input.classList.add('ember-text-field', 'ember-view');
                    input.type = 'number';
                    input.required = true;
                    input.inputMode = 'numeric';
                    input.value = value;
                    input.addEventListener('input', debounce(inputHandler, INPUT_DEBOUNCE_INTERVAL));
                    const inputDiv = document.createElement('div');
                    inputDiv.appendChild(input);
                    const label = document.createElement('label');
                    label.textContent = description;
                    const div = document.createElement('div');
                    div.classList.add('controls', 'ember-view');
                    div.appendChild(label);
                    div.appendChild(inputDiv);
                    if (instructions) {
                        div.appendChild(createInstructionsDiv(instructions));
                    }
                    if (optionControls) {
                        div.classList.add('shuiyuan-helper-option-controls');
                        optionControls.push(input);
                    }
                    return div;
                };

                const createTextInputDiv = (description, instructions, value, optionControls, inputHandler) => {
                    const input = document.createElement('input');
                    input.classList.add('input-xxlarge', 'ember-text-field', 'ember-view');
                    input.type = 'text';
                    input.value = value;
                    input.addEventListener('input', debounce(inputHandler, INPUT_DEBOUNCE_INTERVAL));
                    const inputDiv = document.createElement('div');
                    inputDiv.appendChild(input);
                    const label = document.createElement('label');
                    label.textContent = description;
                    const div = document.createElement('div');
                    div.classList.add('controls', 'ember-view');
                    div.appendChild(label);
                    div.appendChild(inputDiv);
                    if (instructions) {
                        div.appendChild(createInstructionsDiv(instructions));
                    }
                    if (optionControls) {
                        div.classList.add('shuiyuan-helper-option-controls');
                        optionControls.push(input);
                    }
                    return div;
                };

                const createButton = (text, icon, btnClass, clickHandler) => {
                    const button = document.createElement('button');
                    button.classList.add('btn', icon ? 'btn-icon-text' : 'btn-text', btnClass);
                    button.type = 'button';
                    if (icon) {
                        button.innerHTML = icon;
                    }
                    const span = document.createElement('span');
                    span.classList.add('d-button-label');
                    span.textContent = text;
                    button.appendChild(span);
                    button.addEventListener('click', clickHandler);
                    return button;
                };

                const isLiMatchingCurrentPath = (li) => new URL(li.firstElementChild.href).pathname.toLowerCase() === window.location.pathname.toLowerCase();

                const liContainer = element.getElementsByClassName('nav-pills')[0];
                if (!liContainer) {
                    throw new Error('Cannot locate Shuiyuan Helper settings view insertion point');
                }

                const existingLis = [...liContainer.getElementsByTagName('li')];
                const shuiyuanHelperLink = document.createElement('a');
                shuiyuanHelperLink.id = 'nav-shuiyuan-helper';
                shuiyuanHelperLink.classList.add('ember-view');
                shuiyuanHelperLink.href = getShuiyuanHelperRoute();
                const shuiyuanHelperLinkText = document.createElement('span');
                shuiyuanHelperLinkText.textContent = '水源助手';
                shuiyuanHelperLink.innerHTML = EXTENSION_ICON;
                shuiyuanHelperLink.appendChild(shuiyuanHelperLinkText);
                let shuiyuanHelperPageActive = false;
                shuiyuanHelperLink.addEventListener('click', (e0) => {
                    if (isOpenInNewTabOrWindow(e0)) {
                        return;
                    }
                    e0.preventDefault();
                    if (shuiyuanHelperPageActive) {
                        return;
                    }
                    const form = document.getElementsByClassName('form-vertical')[0];
                    if (!form || form.getElementsByClassName('spinner').length > 0) {
                        return;
                    }

                    const shuiyuanHelperSettingsDiv = document.createElement('div');
                    shuiyuanHelperSettingsDiv.classList.add('shuiyuan-helper-settings');

                    for (const group of ALL_FEATURE_GROUPS) {
                        const controlGroup = createFieldset(group.description, `shuiyuan-helper-feature-group-${group.id}`);
                        for (const feature of groupedFeatures.get(group.id)) {
                            if (feature.hidden || feature.hideFromSettings) {
                                continue;
                            }
                            const {id: featureId, description: featureDesc, instructions: featureInstr, options, optionValues, allOptionIds} = feature;
                            const optionControls = [];
                            controlGroup.appendChild(createCheckboxDiv(featureDesc, featureInstr, feature.enabled, null, (e) => {
                                const config = loadConfig();
                                const {checked} = e.target;
                                if (options) {
                                    config[featureId] = fixOptionObject(config[featureId]);
                                    config[featureId].enabled = checked;
                                } else {
                                    config[featureId] = checked;
                                }
                                cleanUpKeys(config, allFeatureIds);
                                saveConfig(config);
                                for (const control of optionControls) {
                                    control.disabled = !checked;
                                }
                            }));
                            if (options) {
                                const optionValidKeys = new Set(['enabled', ...allOptionIds]);
                                for (const option of options) {
                                    const {id: optionId, description: optionDesc, instructions: optionInstr, type} = option;
                                    switch (type) {
                                        case 'boolean':
                                            controlGroup.appendChild(createCheckboxDiv(optionDesc, optionInstr, optionValues[optionId], optionControls, (e) => {
                                                const config = loadConfig();
                                                config[featureId] = fixOptionObject(config[featureId]);
                                                config[featureId][optionId] = e.target.checked;
                                                cleanUpKeys(config[featureId], optionValidKeys);
                                                cleanUpKeys(config, allFeatureIds);
                                                saveConfig(config);
                                            }));
                                            break;
                                        case 'integer':
                                            controlGroup.appendChild(createIntegerInputDiv(optionDesc, optionInstr, optionValues[optionId], optionControls, (e) => {
                                                // Values that cannot be parsed will remove the option value (reset to default) when serialized to JSON.
                                                let value = parseInt(e.target.value, 10);
                                                if (Number.isNaN(value)) {
                                                    value = undefined;
                                                }
                                                const config = loadConfig();
                                                config[featureId] = fixOptionObject(config[featureId]);
                                                config[featureId][optionId] = value;
                                                cleanUpKeys(config[featureId], optionValidKeys);
                                                cleanUpKeys(config, allFeatureIds);
                                                saveConfig(config);
                                            }));
                                            break;
                                        case 'string':
                                            controlGroup.appendChild(createTextInputDiv(optionDesc, optionInstr, optionValues[optionId], optionControls, (e) => {
                                                const config = loadConfig();
                                                config[featureId] = fixOptionObject(config[featureId]);
                                                config[featureId][optionId] = e.target.value;
                                                cleanUpKeys(config[featureId], optionValidKeys);
                                                cleanUpKeys(config, allFeatureIds);
                                                saveConfig(config);
                                            }));
                                            break;
                                        default:
                                            throw new Error(`Unknown option type: ${type}`);
                                    }
                                }
                                if (!feature.enabled) {
                                    for (const control of optionControls) {
                                        control.disabled = true;
                                    }
                                }
                            }
                        }
                        shuiyuanHelperSettingsDiv.appendChild(controlGroup);
                    }

                    const reloadDiv = document.createElement('div');
                    reloadDiv.classList.add('control-group', 'shuiyuan-helper-settings-reload-apply-changes');
                    const reloadButtonDiv = document.createElement('div');
                    reloadButtonDiv.classList.add('controls', 'ember-view');
                    const reloadButton = createButton('应用更改', RELOAD_ICON, 'btn-primary', () => window.location.reload());
                    reloadButtonDiv.appendChild(reloadButton);
                    reloadDiv.appendChild(reloadButtonDiv);
                    const reloadInstructions = createInstructionsDiv('点击按钮或刷新页面，以应用对水源助手设置的更改。');
                    reloadDiv.appendChild(reloadInstructions);
                    shuiyuanHelperSettingsDiv.appendChild(reloadDiv);

                    const importExportControlGroup = createFieldset('导入/导出', 'shuiyuan-helper-settings-import-export');
                    const notesLabel = document.createElement('label');
                    notesLabel.textContent = '水源助手设置仅保存在本地设备，不会通过您的帐户进行同步。';
                    importExportControlGroup.appendChild(notesLabel);
                    const exportDiv = document.createElement('div');
                    const exportToFileButton = createButton('导出到文件', DOWNLOAD_ICON, 'btn-default', () => createFileDownload(
                        JSON.stringify(loadConfig()),
                        `shuiyuan-helper-config-${new Date().toISOString().replaceAll(/[:.]/gu, '-')}.json`,
                        'application/json',
                    ));
                    exportDiv.appendChild(exportToFileButton);
                    const exportToClipboardStatus = document.createElement('span');
                    const exportToClipboardButton = createButton('导出到剪贴板', COPY_ICON, 'btn-default', async () => {
                        exportToClipboardButton.disabled = true;
                        let copySuccessful = false;
                        try {
                            await navigator.clipboard.writeText(JSON.stringify(loadConfig()));
                            copySuccessful = true;
                        } catch (e) {
                            // eslint-disable-next-line no-console
                            console.error(e);
                        }
                        exportToClipboardStatus.textContent = copySuccessful ? '已复制到剪贴板' : '无法复制到剪贴板';
                        exportToClipboardStatus.style.color = copySuccessful ? 'var(--success)' : 'var(--danger)';
                        await sleep(MESSAGE_DISAPPEAR_TIMEOUT);
                        exportToClipboardStatus.textContent = '';
                        exportToClipboardStatus.style.color = '';
                        exportToClipboardButton.disabled = false;
                    });
                    exportDiv.appendChild(exportToClipboardButton);
                    exportDiv.appendChild(exportToClipboardStatus);
                    importExportControlGroup.appendChild(exportDiv);
                    const importDiv = document.createElement('div');
                    const importFromTextInput = document.createElement('input');
                    importFromTextInput.classList.add('input-xxlarge', 'ember-text-field', 'ember-view');
                    importFromTextInput.type = 'text';
                    importFromTextInput.placeholder = IS_MOBILE_VIEW || IS_MOBILE_DEVICE ? '在此粘贴要导入的设置文本' : '在此粘贴要导入的设置文本，或拖放设置文件到此处以导入';
                    const importFromTextInputDiv = document.createElement('div');
                    importFromTextInputDiv.appendChild(importFromTextInput);
                    importDiv.appendChild(importFromTextInputDiv);
                    const importConfigText = (content) => {
                        let config = null;
                        try {
                            if (!content) {
                                throw new Error();
                            }
                            config = JSON.parse(content);
                            if (!isObject(config)) {
                                throw new Error();
                            }
                        } catch {
                            alert('错误：导入的内容不是有效的 JSON 对象。');
                            return;
                        }
                        cleanUpKeys(config, allFeatureIds);
                        if (Object.keys(config).length === 0 && !confirm('导入的设置为空设置，这将会重置水源助手设置为默认值，是否继续？')) {
                            return;
                        }
                        saveConfig(config);
                        importFromTextInput.value = JSON.stringify(config);
                        window.location.reload();
                    };
                    const importConfigFileHandler = (file, fileInput) => {
                        if (!file) {
                            return;
                        }
                        const reader = new FileReader();
                        reader.addEventListener('loadend', () => importConfigText(reader.result));
                        reader.readAsText(file);
                        if (fileInput) {
                            fileInput.value = '';
                        }
                    };
                    let dragCounter = 0;
                    importDiv.addEventListener('dragover', (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'copy';
                    });
                    importDiv.addEventListener('dragenter', () => {
                        dragCounter += 1;
                        importDiv.style.border = 'dashed var(--success)';
                    });
                    importDiv.addEventListener('dragleave', () => {
                        dragCounter = Math.max(dragCounter - 1, 0);
                        if (dragCounter === 0) {
                            importDiv.style.border = '';
                        }
                    });
                    importDiv.addEventListener('drop', (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        dragCounter = 0;
                        importDiv.style.border = '';
                        importConfigFileHandler(e.dataTransfer.files[0]);
                    });
                    const fileInput = document.createElement('input');
                    fileInput.type = 'file';
                    fileInput.accept = '.json';
                    fileInput.addEventListener('change', () => importConfigFileHandler(fileInput.files[0], fileInput));
                    const importFromFileButton = createButton('从文件导入', UPLOAD_ICON, 'btn-default', () => fileInput.click());
                    importDiv.appendChild(importFromFileButton);
                    const importFromTextButton = createButton('导入上述文本', PASTE_ICON, 'btn-default', () => {
                        const content = importFromTextInput.value.trim();
                        if (!content) {
                            return;
                        }
                        importConfigText(content);
                    });
                    importFromTextInput.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            importFromTextButton.click();
                        }
                    });
                    importDiv.appendChild(importFromTextButton);
                    const resetButton = createButton('重置设置', DELETE_ICON, 'btn-danger', () => {
                        if (!confirm('确实要重置水源助手设置为默认值吗？')) {
                            return;
                        }
                        saveConfig({});
                        window.location.reload();
                    });
                    importDiv.appendChild(resetButton);
                    importExportControlGroup.appendChild(importDiv);
                    shuiyuanHelperSettingsDiv.appendChild(importExportControlGroup);

                    shuiyuanHelperLink.classList.add('active');
                    for (const li of existingLis) {
                        li.firstElementChild?.classList.remove('active');
                    }

                    for (const el of form.children) {
                        el.style.display = 'none';
                    }
                    form.appendChild(shuiyuanHelperSettingsDiv);
                    shuiyuanHelperPageActive = true;
                    if (window.location.hash !== SETTINGS_VIEW_FRAGMENT) {
                        window.history.pushState({}, '', `${window.location.pathname}${SETTINGS_VIEW_FRAGMENT}`);
                    }
                });
                const popStateListener = () => {
                    if (!document.body.contains(shuiyuanHelperLink)) {
                        window.removeEventListener('popstate', popStateListener);
                    }
                    if (window.location.hash === SETTINGS_VIEW_FRAGMENT) {
                        shuiyuanHelperLink.click();
                    } else {
                        for (const li of existingLis) {
                            if (isLiMatchingCurrentPath(li)) {
                                li.firstElementChild.click();
                                break;
                            }
                        }
                    }
                };
                window.addEventListener('popstate', popStateListener);
                const shuiyuanHelperLi = document.createElement('li');
                shuiyuanHelperLi.classList.add('user-nav__preferences-shuiyuan-helper', 'ember-view');
                shuiyuanHelperLi.appendChild(shuiyuanHelperLink);
                liContainer.appendChild(shuiyuanHelperLi);
                const resetPrefPage = (e) => {
                    if (isOpenInNewTabOrWindow(e)) {
                        return;
                    }
                    if (!shuiyuanHelperPageActive) {
                        return;
                    }
                    shuiyuanHelperPageActive = false;
                    const clickedNode = e.target;
                    const clickedLi = clickedNode.closest ? clickedNode.closest('li') : clickedNode.parentElement.closest('li');
                    shuiyuanHelperLink.classList.remove('active');
                    const form = document.getElementsByClassName('form-vertical')[0];
                    if (!form) {
                        return;
                    }
                    for (const el of form.children) {
                        el.style.display = '';
                    }
                    form.getElementsByClassName('shuiyuan-helper-settings')[0]?.remove();
                    if (window.location.hash === SETTINGS_VIEW_FRAGMENT && isLiMatchingCurrentPath(clickedLi)) {
                        window.history.pushState({}, '', window.location.pathname);
                    }
                };
                for (const li of existingLis) {
                    li.addEventListener('click', resetPrefPage);
                }
                markElementHandledByFeature(element, 'settings-view');

                if (window.location.hash === SETTINGS_VIEW_FRAGMENT) {
                    const form = document.getElementsByClassName('form-vertical')[0];
                    let formObserver = null;
                    const jumpIfFormLoaded = () => {
                        if (form.getElementsByClassName('spinner').length === 0) {
                            formObserver.disconnect();
                            shuiyuanHelperLink.click();
                        }
                    };
                    formObserver = new MutationObserver(jumpIfFormLoaded);
                    formObserver.observe(form, {
                        subtree: true,
                        childList: true,
                    });
                    jumpIfFormLoaded();
                }
            },
        },
        {
            id: 'fix-default-preferences-buttons',
            description: '修复默认的偏好设置按钮的行为',
            enabledByDefault: true,
            hideFromSettings: true,
            matchId: 'quick-access-profile',
            matchClass: 'user-navigation-primary',
            onMatch: (element) => {
                if (isElementHandledByFeature(element, 'fix-default-preferences-buttons')) {
                    return;
                }

                let preferencesButton = null;
                if (element.matches('#quick-access-profile')) {
                    preferencesButton = element.getElementsByClassName('preferences')[0];
                } else if (element.matches('.user-navigation-primary')) {
                    preferencesButton = element.getElementsByClassName('user-nav__preferences')[0];
                }
                if (!preferencesButton) {
                    return;
                }
                preferencesButton.addEventListener('click', (e) => {
                    if (isOpenInNewTabOrWindow(e)) {
                        return;
                    }
                    e.preventDefault();
                    e.stopPropagation();
                    const navAccountLi = document.getElementsByClassName('user-nav__preferences-account')[0];
                    if (navAccountLi) {
                        navAccountLi.firstElementChild.click();
                    } else {
                        goToRoute(getPreferencesRoute());
                    }
                });

                markElementHandledByFeature(element, 'fix-default-preferences-buttons');
            },
        },
        {
            id: 'settings-quick-entrance',
            description: '为设置面板添加快捷入口',
            enabledByDefault: true,
            hideFromSettings: true,
            matchId: 'sidebar-section-content-community',
            onMatch: (element) => {
                const addLiToSidebarSection = (ul, icon, text, url, clickHandler) => {
                    const newLi = document.createElement('li');
                    newLi.classList.add('sidebar-section-link-wrapper');
                    const newA = document.createElement('a');
                    // Not maintaining the "active" class here.
                    newA.classList.add('ember-view', 'sidebar-section-link', 'sidebar-row');
                    const iconSpan = document.createElement('span');
                    iconSpan.classList.add('sidebar-section-link-prefix', 'icon');
                    iconSpan.innerHTML = icon;
                    const textSpan = document.createElement('span');
                    textSpan.classList.add('sidebar-section-link-content-text');
                    textSpan.textContent = text;
                    newA.title = text;
                    newA.href = url;
                    newA.addEventListener('click', clickHandler);
                    newA.append(iconSpan, textSpan);
                    newLi.appendChild(newA);
                    ul.appendChild(newLi);
                };

                if (isElementHandledByFeature(element, 'settings-quick-entrance')) {
                    return;
                }
                markElementHandledByFeature(element, 'settings-quick-entrance');

                const preferencesPath = getPreferencesRoute();
                addLiToSidebarSection(element, SETTINGS_ICON, '偏好设置', preferencesPath, (e) => {
                    if (isOpenInNewTabOrWindow(e)) {
                        return;
                    }
                    e.preventDefault();
                    const navAccountLi = document.getElementsByClassName('user-nav__preferences-account')[0];
                    if (navAccountLi) {
                        navAccountLi.firstElementChild.click();
                    } else {
                        goToRoute(preferencesPath);
                    }
                });
                const shuiyuanHelperPath = getShuiyuanHelperRoute();
                addLiToSidebarSection(element, EXTENSION_ICON, '水源助手设置', shuiyuanHelperPath, (e) => {
                    if (isOpenInNewTabOrWindow(e)) {
                        return;
                    }
                    e.preventDefault();
                    const shuiyuanHelperLink = document.getElementById('nav-shuiyuan-helper');
                    if (shuiyuanHelperLink) {
                        shuiyuanHelperLink.click();
                    } else {
                        goToRoute(shuiyuanHelperPath);
                    }
                });
            },
        },
    ];

    // Lists of supported fields for features and options.
    const FEATURE_FIELDS_SET = new Set(['id', 'description', 'instructions', 'group', 'enabledByDefault', 'hidden', 'hideFromSettings', 'options', 'matchTag', 'matchId', 'matchClass', 'onMatch', 'onInitialize']);
    FEATURE_FIELDS_SET.add('allOptionIds'); // Not in declaration, but added during validation.
    const OPTION_FIELDS_SET = new Set(['id', 'description', 'instructions', 'type', 'defaultValue']);
    const MATCH_SPEC_FIELDS = ['matchTag', 'matchId', 'matchClass'];

    // Validate features and options.
    // Also organize features into groups.
    for (const feature of ALL_FEATURES) {
        if (!isObject(feature)) {
            // eslint-disable-next-line no-console
            console.error(feature);
            throw new Error('Feature is not an object');
        }
        if (typeof feature.id !== 'string' || !feature.id) {
            // eslint-disable-next-line no-console
            console.error(feature);
            throw new Error('Feature ID missing or invalid');
        }
        allFeatureIds.add(feature.id);
        if (typeof feature.description !== 'string' || !feature.description) {
            throw new Error(`Missing or invalid description for feature ${feature.id}`);
        }
        if (feature.instructions !== undefined && typeof feature.instructions !== 'string') {
            throw new Error(`Invalid instructions for feature ${feature.id}`);
        }
        for (const field of ['hidden', 'hideFromSettings']) {
            if (![undefined, false, true].includes(feature[field])) {
                throw new Error(`Invalid '${field}' value for feature ${feature.id}`);
            }
        }
        if (!feature.hidden && !feature.hideFromSettings) {
            if (!allFeatureGroupIds.has(feature.group)) {
                throw new Error(`Missing or invalid group for feature ${feature.id}`);
            }
            if (!groupedFeatures.has(feature.group)) {
                groupedFeatures.set(feature.group, []);
            }
            groupedFeatures.get(feature.group).push(feature);
        }
        if (!(feature.hidden ? [undefined, false, true] : [false, true]).includes(feature.enabledByDefault)) {
            throw new Error(`Missing or invalid 'enabledByDefault' value for feature ${feature.id}`);
        }
        if (feature.options !== undefined) {
            if (!Array.isArray(feature.options)) {
                throw new Error(`Options for feature ${feature.id} must be an array`);
            }
            feature.allOptionIds = new Set();
            for (const option of feature.options) {
                if (!isObject(option)) {
                    // eslint-disable-next-line no-console
                    console.error(option);
                    throw new Error('Option is not an object');
                }
                if (typeof option.id !== 'string' || !option.id || option.id === 'enabled') {
                    // eslint-disable-next-line no-console
                    console.error(option);
                    throw new Error(`Option ID missing or invalid in feature ${feature.id}`);
                }
                feature.allOptionIds.add(option.id);
                if (typeof option.description !== 'string' || !option.description) {
                    throw new Error(`Missing or invalid description for option ${option.id} of feature ${feature.id}`);
                }
                if (option.instructions !== undefined && typeof option.instructions !== 'string') {
                    throw new Error(`Invalid instructions for option ${option.id} of feature ${feature.id}`);
                }
                switch (option.type) {
                    case 'boolean':
                        if (![false, true].includes(option.defaultValue)) {
                            throw new Error(`Missing or invalid default value for option ${option.id} of feature ${feature.id}`);
                        }
                        break;
                    case 'integer':
                        if (!Number.isInteger(option.defaultValue)) {
                            throw new Error(`Missing or invalid default value for option ${option.id} of feature ${feature.id}`);
                        }
                        break;
                    case 'string':
                        if (typeof option.defaultValue !== 'string') {
                            throw new Error(`Missing or invalid default value for option ${option.id} of feature ${feature.id}`);
                        }
                        break;
                    default:
                        throw new Error(`Missing or invalid option type for option ${option.id} of feature ${feature.id}`);
                }
                const unrecognizedFields = setDifference(new Set(Object.keys(option)), OPTION_FIELDS_SET);
                if (unrecognizedFields.size > 0) {
                    // eslint-disable-next-line no-console
                    console.error(unrecognizedFields);
                    throw new Error(`Option ${option.id} of feature ${feature.id} contains unrecognized fields`);
                }
            }
            if (feature.allOptionIds.size !== feature.options.length) {
                throw new Error(`Duplicate option IDs found for feature ${feature.id}`);
            }
            const allOptionDescriptions = new Set(feature.options.map((o) => o.description));
            if (allOptionDescriptions.size !== feature.options.length) {
                throw new Error(`Duplicate option descriptions found for feature ${feature.id}`);
            }
        }
        let hasMatchSpec = false;
        for (const field of MATCH_SPEC_FIELDS) {
            if (feature[field] === undefined) {
                continue;
            }
            hasMatchSpec = true;
            if (typeof feature[field] === 'string' && feature[field]) {
                continue;
            }
            if (Array.isArray(feature[field]) && feature[field].every((x) => typeof x === 'string' && x)) {
                continue;
            }
            throw new Error(`Invalid '${field}' value for feature ${feature.id}`);
        }
        let hasAction = false;
        for (const field of ['onMatch', 'onInitialize']) {
            if (feature[field] === undefined) {
                continue;
            }
            hasAction = true;
            if (typeof feature[field] === 'function') {
                continue;
            }
            throw new Error(`Invalid '${field}' value for feature ${feature.id}`);
        }
        if (hasMatchSpec && !feature.onMatch) {
            throw new Error(`Feature ${feature.id} has match specifications but missing onMatch function`);
        }
        if (!hasMatchSpec && feature.onMatch) {
            throw new Error(`Feature ${feature.id} has onMatch function but missing match specifications`);
        }
        if (!hasAction) {
            throw new Error(`Feature ${feature.id} missing actions (onMatch or onInitialize)`);
        }
        const unrecognizedFields = setDifference(new Set(Object.keys(feature)), FEATURE_FIELDS_SET);
        if (unrecognizedFields.size > 0) {
            // eslint-disable-next-line no-console
            console.error(unrecognizedFields);
            throw new Error(`Feature ${feature.id} contains unrecognized fields`);
        }
    }
    if (allFeatureIds.size !== ALL_FEATURES.length) {
        throw new Error('Duplicate feature IDs found');
    }
    const allFeatureDescriptions = new Set(ALL_FEATURES.map((f) => f.description));
    if (allFeatureDescriptions.size !== ALL_FEATURES.length) {
        throw new Error('Duplicate feature descriptions found');
    }
    for (const group of ALL_FEATURE_GROUPS) {
        if (!groupedFeatures.has(group.id)) {
            throw new Error(`Group ${group.id} contains no visible features`);
        }
    }

    // Below is generic framework code to process all features.
    const observeTags = [];
    const observeIds = [];
    const observeClasses = [];
    const initExecutePromises = [];
    const config = loadConfig();

    for (const feature of ALL_FEATURES) {
        if (feature.hidden) {
            continue;
        }
        if (feature.options) {
            const optionValues = fixOptionObject(config[feature.id]);
            feature.enabled = Boolean(optionValues.enabled ?? feature.enabledByDefault);
            for (const option of feature.options) {
                const {id, type, defaultValue} = option;
                switch (type) {
                    case 'boolean':
                        optionValues[id] = Boolean(optionValues[id] ?? defaultValue);
                        break;
                    case 'integer':
                        optionValues[id] = parseIntegerOption(optionValues[id], defaultValue);
                        break;
                    case 'string':
                        optionValues[id] = parseStringOption(optionValues[id], defaultValue);
                        break;
                    default:
                        throw new Error(`Unknown option type: ${type}`);
                }
            }
            feature.optionValues = optionValues;
        } else {
            feature.enabled = Boolean(config[feature.id] ?? feature.enabledByDefault);
        }
        if (!feature.enabled) {
            continue;
        }
        try {
            initExecutePromises.push(Promise.resolve(feature.onInitialize?.(feature.optionValues)));
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
        }
        for (const field of MATCH_SPEC_FIELDS) {
            if (!feature[field]) {
                feature[field] = [];
            } else if (!Array.isArray(feature[field])) {
                feature[field] = [feature[field]];
            }
        }
        feature.matchTag = feature.matchTag.map((tagName) => tagName.toLowerCase());
        feature.selector = [
            ...feature.matchTag.map(asTagSelector),
            ...feature.matchId.map(asIdSelector),
            ...feature.matchClass.map(asClassSelector),
        ].join(', ');
        observeTags.push(...feature.matchTag);
        observeIds.push(...feature.matchId);
        observeClasses.push(...feature.matchClass);
    }

    await promiseAllSettledLogErrors(initExecutePromises);

    const handleNewElement = async (element, args) => {
        if (!element) {
            return;
        }

        // If this is an existing element getting new ID/classes that we want to match, we only call `onMatch` for the new ID/classes.
        const {addedId, addedClasses} = args ?? {};
        if (addedId && addedClasses) {
            throw new Error('Cannot specify both addedId and addedClasses, invoke handleNewElement twice instead');
        }
        let testElement = element;
        if (addedId) {
            testElement = dummyElementOfId(addedId);
        } else if (addedClasses) {
            testElement = dummyElementOfClasses(addedClasses);
        }

        const promises = [];
        for (const feature of ALL_FEATURES) {
            if (!feature.enabled || !feature.selector) {
                continue;
            }
            if (testElement.matches(feature.selector)) {
                try {
                    promises.push(Promise.resolve(feature.onMatch(element, feature.optionValues)));
                } catch (e) {
                    // eslint-disable-next-line no-console
                    console.error(e);
                }
            }
        }
        await promiseAllSettledLogErrors(promises);
    };

    const observeTagsSet = new Set(observeTags);
    const observeIdsSet = new Set(observeIds);
    const observeClassesSet = new Set(observeClasses);
    const observeSelector = [
        ...[...observeTagsSet].map(asTagSelector),
        ...[...observeIdsSet].map(asIdSelector),
        ...[...observeClassesSet].map(asClassSelector),
    ].join(', ');

    const globalObserver = new MutationObserver(async (mutationsList) => {
        const promises = [];
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                for (const node of mutation.addedNodes) {
                    // If the added node itself is an element that we want to match, handle it.
                    if (node.matches?.(observeSelector)) {
                        promises.push(handleNewElement(node));
                    }
                    // Scan all descendants of the added node and handle those we want to match.
                    if (node.querySelectorAll) {
                        for (const el of node.querySelectorAll(observeSelector)) {
                            promises.push(handleNewElement(el));
                        }
                    }
                }
            } else if (mutation.type === 'attributes') {
                switch (mutation.attributeName) {
                    case 'id': {
                        // If an element is getting a new ID we want to match, handle it.
                        const addedId = mutation.target.id;
                        if (observeIdsSet.has(addedId)) {
                            promises.push(handleNewElement(mutation.target, {addedId}));
                        }
                        break;
                    }
                    case 'class': {
                        // If an element is getting new classes we want to match, handle it.
                        const addedClasses = setDifference(new Set(mutation.target.classList), new Set(dummyElementOfClasses(mutation.oldValue ?? '').classList));
                        if (setsOverlap(observeClassesSet, addedClasses)) {
                            promises.push(handleNewElement(mutation.target, {addedClasses}));
                        }
                        break;
                    }
                }
            }
        }
        await promiseAllSettledLogErrors(promises);
    });

    let shouldObserveAttributes = false;
    const observerAttributeFilter = [];
    let shouldRecordAttributeOldValue = false;
    if (observeTagsSet.size === 0 && observeIdsSet.size === 0 && observeClassesSet.size === 0) {
        // eslint-disable-next-line no-console
        console.warn('No elements to observe! Shuiyuan Helper would perform no action.');
        return;
    }
    if (observeIdsSet.size > 0) {
        shouldObserveAttributes = true;
        observerAttributeFilter.push('id');
    }
    if (observeClassesSet.size > 0) {
        shouldObserveAttributes = true;
        observerAttributeFilter.push('class');
        shouldRecordAttributeOldValue = true;
    }

    globalObserver.observe(document.documentElement, {
        subtree: true,
        childList: true,
        attributes: shouldObserveAttributes,
        attributeFilter: shouldObserveAttributes ? observerAttributeFilter : undefined,
        attributeOldValue: shouldRecordAttributeOldValue,
    });

    // Scan elements that are already on the page initially. Handle the elements we want to match.
    const initialMatchPromises = [];
    for (const el of document.querySelectorAll(observeSelector)) {
        initialMatchPromises.push(handleNewElement(el));
    }
    await promiseAllSettledLogErrors(initialMatchPromises);
})();