// ==UserScript==
// @name         Mortal 显示恶手率
// @name:zh      Mortal牌谱解析增强脚本
// @name:zh-CN   Mortal牌谱解析增强脚本
// @name:zh-TW   Mortal牌譜解析增強腳本
// @name:ja      Mortal牌譜レビュー強化スクリプト
// @name:ko      Mortal 게임 기록 감사 강화 스크립트
// @name:ru      Скрипт расширения аудита игровых записей Mortal
// @name:en      Mortal game record review enhancement script
// @description Mortal牌谱解析增强脚本 (雀魂麻将/天凤(天鳳)(てんほう)/麻雀一番街)(Mahjong Soul/Tenhou/Riichi City)
// @description:zh Mortal牌谱解析增强脚本 (雀魂麻将/天凤/麻雀一番街)
// @description:zh-CN Mortal牌谱解析增强脚本 (雀魂麻将/天凤/麻雀一番街)
// @description:zh-TW Mortal牌譜解析增強腳本 (雀魂/天鳳/麻雀一番街)
// @description:ja Mortal牌譜レビュー強化スクリプト (雀魂/天鳳(てんほう)/麻雀一番街)
// @description:ko Mortal 게임 기록 감사 강화 스크립트 (작혼/천봉/마작일번가)
// @description:ru Скрипт расширения аудита игровых записей Mortal (Mahjong Soul/Tenhou/Riichi City)
// @description:en Mortal game record review enhancement script (Mahjong Soul/Tenhou/Riichi City)
// @version      2.2.22.1
// @homepage     https://www.bilibili.com/read/cv26608482/
// @namespace    https://viayoo.com/
// @author       Miku39
// @icon         data:image/x-icon;base64,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5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v+Zj9X/NR6//0Ywwv/Kxd//6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+fn5rwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA5+fmvOjn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v+YjdT/NR6//0Iswv++uN3/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+fn5rwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA5+fmvOjn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v+YjdT/NR6//z8owf+1rtv/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+fn5rwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA5+fmvOjn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v+YjdT/NR6//zwmwP+vptn/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+fn5rwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA5+fmvOjn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v+YjdT/NR6//zskwP+qodj/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+fn5rwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA5+fmvOjn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v+YjdT/NR6//zojwP+nntj/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+fn5rwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA5+fmvOjn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v+YjdT/NR6//zkiwP+lnNf/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+fn5rwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA5+fmvOjn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v+YjdT/NR6//zkiwP+lm9f/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+fn5rwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA5+fmvOjn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v+YjdT/NR6//zkiwP+kmtf/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+fn5rwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA5+fmvOjn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v+YjdT/NR6//zkiv/+jmtf/6Ofm/+jn5v/o5+b/6Ofm/+jn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5v/o5+b/6Ofm/+jn5v/n5uX+6Oblyf///wUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOTk5DDn5+bC5+fm/Ojn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+fm5f3o5+bD7unpLwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wHs7Owc5+fleOfl5Nbn5uX56Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/o5+b/6Ofm/+jn5v/n5uX56Ofl1efl5Xnj4+Mcf39/AgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==
// @resource     js_vue https://cdn.staticfile.org/vue/3.3.7/vue.global.min.js
// @resource     js_elementplus https://cdn.staticfile.org/element-plus/2.4.1/index.full.min.js
// @resource     js_layui https://cdn.staticfile.org/layui/2.8.17/layui.min.js
// @resource     js_cryptojs https://cdn.staticfile.org/crypto-js/4.1.1/crypto-js.min.js
// @resource     js_immutable https://cdn.staticfile.org/immutable/4.3.4/immutable.min.js
// @resource     js_localforage https://cdn.staticfile.org/localforage/1.10.0/localforage.min.js
// @resource     js_qunit https://cdn.staticfile.org/qunit/2.20.0/qunit.min.js
// @resource     css_elementplus https://cdn.staticfile.org/element-plus/2.4.1/index.min.css
// @resource     css_layui https://cdn.staticfile.org/layui/2.8.17/css/layui.min.css
// @resource     css_fontAwesome https://cdn.staticfile.org/font-awesome/6.4.2/css/all.min.css
// @match        *://mjai.ekyu.moe/*
// @grant        GM_info
// @grant        unsafeWindow
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_setClipboard
// @run-at       document-start
// @license      BSD-3-Clause
// @downloadURL https://update.greasyfork.org/scripts/475642/Mortal%20%E6%98%BE%E7%A4%BA%E6%81%B6%E6%89%8B%E7%8E%87.user.js
// @updateURL https://update.greasyfork.org/scripts/475642/Mortal%20%E6%98%BE%E7%A4%BA%E6%81%B6%E6%89%8B%E7%8E%87.meta.js
// ==/UserScript==

((g_window)=>{
    'use strict';
    //兼容浏览器翻译插件，比如谷歌翻译插件会更改lang属性(主要针对设置为自动翻译的语言)
    const g_origLang = document.scrollingElement.lang.toLocaleLowerCase();
    let g_currLang = g_origLang;
    const oHtml = document.getElementsByTagName("html")[0];
    const observer = new window.MutationObserver((mutations) => {
        g_currLang = oHtml.getAttribute("lang").toLocaleLowerCase();
        Console.orig.log(`原始语言:${g_origLang}, 当前被翻译为: ${g_currLang}`);
    });
    observer.observe(oHtml, { attributes: true, attributeFilter: ["lang"] });
    // ---------------------------- 全局变量: App变量 ----------------------------
    let globalSettings = { //存储永久数据
        Base: {
            appName: "Mortal",
            cssName: ".ui",
            curVersion: GM_info.script.version,
        },
        Config: {
            badMoveUpperLimit: 5, //恶手率
            badMoveUpperLimitCustom: 10, //恶手率
        },
        AppSettings: {
            global: {
                enableScrollAnimation: false, //启用滚动动画
            },
            loading: {
                isShowLoadingAnimation: true, //是否显示加载动画
                isShowLoadingProgress: true, //是否显示加载进度条
            },
            
        },
        UISettings: {
            basic: {
                global: {
                    fontColor: "#000", //字体颜色
                    currentTheme: "", //当前主题
                },
                pageExtend: {

                },
                MainApp: {
                    settingUI:{
                        window: {
                            x: 0, //posX
                            y: 0, //posY
                            z: 0, //z-index
                            width: "auto",
                            height: "auto",
                        },
                        cssStyle: "",
                    },
                    catalogUI: {
                        window: {
                            x: 0, //posX
                            y: 0, //posY
                            z: 0, //z-index
                            width: "auto",
                            height: "auto",
                        },
                        cssStyle: "",
                    },
                },
            },
            theme: [
                {
                    name: "暗色模式",
                },
            ]
        },
        Other: {
            debugMode: { //调试模式
                enable: false,
                trackCall: {
                    enable: false,
                    trackFunction: true,
                    trackTimestamp: true,
                },
                logOut: {
                    enable: true,
                    filter: "debug",
                }
            },
            safeMode: false, //安全模式 (禁用程序所有功能) //false
        },
    };

    const matchRule = {
        isInit: false,
        isRon3: true, //是否允许三家荣和
    };

    let globalStatus = { //存储临时数据
        globalExitConfirm: false, //全局退出确认 (比如更改了设置没有保存等情况下)
        openSettingUI: false,
    };

    const pageLanguage = g_origLang;
    const localization = {__proto__: null,
        zh_cn: Object.defineProperties({__proto__: null,
            badMove: "恶手",
            badMoveRatio: "恶手率",
            matchRatio: "AI 一致率",
            metaData: "元数据",
            //
            seatTypeA0: "东起",
            seatTypeA1: "南起",
            seatTypeA2: "西起",
            seatTypeA3: "北起",
            //
            seatTypeB0: "东家",
            seatTypeB1: "南家",
            seatTypeB2: "西家",
            seatTypeB3: "北家",
            //
            seatTypeC0: "自家",
            seatTypeC1: "下家",
            seatTypeC2: "对家",
            seatTypeC3: "上家",
            //
            seatStart: "亲家", //庄家
            //
            Ron: "荣和",
            Tsumo: '自摸',
            Ryuukyoku: '流局',
            RyuukyokuTsumo: "流局满贯",
            RyuukyokuType1: "九种九牌",
            //四风连打
            //四杠散了
            //四家立直
            //三家和了
            //
            badMoveError: "(恶手率统计只支持Mortal 3.1及更高版本,当前版本生成结果不可靠)",
            //
            badMoveUp: ` (严重错误 权重0~${globalSettings.Config.badMoveUpperLimit}%)`,
            badMoveDown: ` (普通错误 权重${globalSettings.Config.badMoveUpperLimit}~${globalSettings.Config.badMoveUpperLimitCustom}%)`,
            badMoveDiffer: "差值: ",
            //
            badMoveDiffer1: "微差(0~5): ",
            badMoveDiffer2: "小幅差距(5~10): ",
            badMoveDiffer3: "低等差距(10~20): ",
            badMoveDiffer4: "中等差距(20~40): ",
            badMoveDiffer5: "高等差距(40~60): ",
            badMoveDiffer6: "大幅度差距(60~80): ",
            badMoveDiffer7: "压倒性差距(80~100): ",
            //
            settingUIPanel: "设置面板",
            //
            kyokuSelector: "对局选择器",
            badChooseSelector: "恶手选择器",
            differSelector: "不一致选择器",
            openSetting: "打开设置 (等待完善)",
        },{
            getName: { //默认 不可修改，不可重新定义或者删除，不可枚举
                value : "zh-cn",
            },
        }),
        ja: Object.defineProperties({__proto__: null,
            badMove: "Bad move",
            badMoveRatio: "bad moves/total",
            matchRatio: "AI一致率",
            metaData: "メタデータ",
            //
            seatTypeA0: "東", //トン
            seatTypeA1: "南", //ナン
            seatTypeA2: "西", //シャー
            seatTypeA3: "北", //ペイ
            //
            seatTypeB0: "東家",
            seatTypeB1: "南家",
            seatTypeB2: "西家",
            seatTypeB3: "北家",
            //
            seatTypeC0: "自家",
            seatTypeC1: "下家",
            seatTypeC2: "対面",
            seatTypeC3: "上家",
            //
            seatStart: "親",
            //
            Ron: "ロン", //栄
            Tsumo: 'ツモ', //自摸
            Ryuukyoku: '流局',
            RyuukyokuTsumo: "流し満貫",
            RyuukyokuType1: "九種九牌",
            //四風連打
            //四開槓
            //四家立直
            //三家和 //トリロン
        },{
            getName: { //默认 不可修改，不可重新定义或者删除，不可枚举
                value : "ja",
            },
        }),
        ko: Object.defineProperties({__proto__: null,
            badMove: "Bad move",
            badMoveRatio: "bad moves/total",
            matchRatio: "matches/total",
            metaData: "메타데이터",
            //
            seatTypeA0: "동",
            seatTypeA1: "남",
            seatTypeA2: "서",
            seatTypeA3: "북",
            //
            seatTypeB0: "동",
            seatTypeB1: "남",
            seatTypeB2: "서",
            seatTypeB3: "북",
            //
            seatTypeC0: "나",
            seatTypeC1: "하가", //시모챠
            seatTypeC2: "대가", //대면 //또이멘
            seatTypeC3: "상가", //샹차
            //
            seatStart: "쫭찌아",
            //
            Ron: "론",
            Tsumo: '쯔모',
            Ryuukyoku: '유국',
            RyuukyokuTsumo: "유국만관",
            RyuukyokuType1: "구종구패",
            //사풍연타
            //사개깡
            //사가리치
            //삼가화
        },{
            getName: { //默认 不可修改，不可重新定义或者删除，不可枚举
                value : "ko",
            },
        }),
        en: Object.defineProperties({__proto__: null,
            badMove: "Bad move", //Bad Choose
            badMoveRatio: "bad moves/total", //Bad Choose Rate
            matchRatio: "matches/total",
            metaData: "Metadata",
            //
            modelTag: "model tag",
            //
            seatTypeA0: "East",
            seatTypeA1: "South",
            seatTypeA2: "West",
            seatTypeA3: "North",
            //
            seatTypeB0: "East",
            seatTypeB1: "South",
            seatTypeB2: "West",
            seatTypeB3: "North",
            //
            seatTypeC0: "Self", //Own
            seatTypeC1: "Shimocha", //Next player
            seatTypeC2: "Toimen", //Opposite player
            seatTypeC3: "Kamicha", //Last player
            //
            seatStart: "Oya", //Dealer
            //
            Ron: "Ron",
            Tsumo: 'Tsumo',
            Ryuukyoku: 'Ryuukyoku', //Exhaustive draw
            RyuukyokuTsumo: "Nagashi mangan", //Mangan at Draw
            RyuukyokuType1: "Kyuushu kyuuhai", //Nine Different Terminals and Honors
            //Suufon renda //Four-Wind Discarded
            //Suukaikan //Four-Kan Abortion
            //Suucha riichi //Four-Player Riichi
            //Sanchahou //Three-Player Ron
            //
            badMoveError: "(The Bad Choose Rate statistics are only supported by Mortal version 3.1 and later, the results generated by the current version are unreliable)",
            //
            badMoveUp: ` (Fatal Error: 0~${globalSettings.Config.badMoveUpperLimit}%)`,
            badMoveDown: ` (Error: ${globalSettings.Config.badMoveUpperLimit}~${globalSettings.Config.badMoveUpperLimitCustom}%)`,
            badMoveDiffer: "Differences: ",
            //
            badMoveDiffer1: "Very slight difference(0~5): ",
            badMoveDiffer2: "Small difference(5~10): ",
            badMoveDiffer3: "Low difference(10~20): ",
            badMoveDiffer4: "Medium difference(20~40): ",
            badMoveDiffer5: "Higher difference(40~60): ",
            badMoveDiffer6: "Wide difference(60~80): ",
            badMoveDiffer7: "Overwhelming difference(80~100): ",
            //
            settingUIPanel: "Settings Panel",
            //
            kyokuSelector: "Kyoku Selector",
            badChooseSelector: "Bad Choose Selector",
            differSelector: "Inconsistent Selector",
            openSetting: "Open Settings(unfinished)",
        },{
            getName: { //默认 不可修改，不可重新定义或者删除，不可枚举
                value: "en",
            },
        }),
    };
    let i18nText = { ...localization.en }; //复制对象
    if (pageLanguage == localization.zh_cn.getName) {
        Object.assign(i18nText, localization.zh_cn);
    } else if (pageLanguage == localization.ja.getName) {
        Object.assign(i18nText, localization.ja);
    } else if (pageLanguage == localization.ko.getName) {
        Object.assign(i18nText, localization.ko);
    }

    const tenhouText = {__proto__: null,
        Ron: '和了', //荣和
        Tsumo: '和了', //自摸
        Ryuukyoku: '流局', //荒牌流局
        RyuukyokuTsumo: "流し満貫", //流局满贯
        RyuukyokuType1: "九種九牌", //九种九牌
        //四風連打、四開槓、四家立直 //三家和
    };

    // ---------------------------- 全局变量: 模板 ----------------------------
    const cssID = globalSettings.Base.cssName;
    const cssIDNP = cssID.substring(1);

    const commonCSS = 
    '\
    .position_re { position: relative; }\
    .position_ab, .ui.position_ab { position: absolute; }\
    .position_fi { position: fixed; }\
    \
    .left-0 { left: 0px; }\
    .right-0 { right: 0px; }\
    .top-0 { top: 0px; }\
    .bottom-0 { bottom: 0px; }\
    .left-5 { left: 5px; }\
    .right-5 { right: 5px; }\
    .top-5 { top: 5px; }\
    .bottom-5 { bottom: 5px; }\
    .left-10 { left: 10px; }\
    .right-10 { right: 10px; }\
    .top-10 { top: 10px; }\
    .bottom-10 { bottom: 10px; }\
    \
    .text-left { text-align: left; }\
    .text-center { text-align: center; }\
    .text-right { text-align: right; }\
    \
    .font_weight_900 { font-weight: 900; }\
    .font_weight_700 { font-weight: 700; }\
    .font_weight_400 { font-weight: 400; }\
    \
    .w-auto { width: auto; }\
     .w-100 { width: 100%; }\
    .w-80 { width: 80%; }\
     .w-75 { width: 75%; }\
    .w-60 { width: 60%; }\
     .w-50 { width: 50%; }\
    .w-40 { width: 40%; }\
     .w-25 { width: 25%; }\
    .w-20 { width: 20%; }\
    .w-10 { width: 10%; }\
    .w-5  { width: 5%; }\
    \
    .min-w-auto { min-width: auto; }\
     .min-w-100 { min-width: 100%; }\
    .min-w-80 { min-width: 80%; }\
     .min-w-75 { min-width: 75%; }\
    .min-w-60 { min-width: 60%; }\
     .min-w-50 { min-width: 50%; }\
    .min-w-40 { min-width: 40%; }\
     .min-w-25 { min-width: 25%; }\
    .min-w-20 { min-width: 20%; }\
    .min-w-10 { min-width: 10%; }\
    .min-w-5  { min-width: 5%; }\
   \
    .max-w-auto { max-width: auto; }\
     .max-w-100 { max-width: 100%; }\
    .max-w-80 { max-width: 80%; }\
     .max-w-75 { max-width: 75%; }\
    .max-w-60 { max-width: 60%; }\
     .max-w-50 { max-width: 50%; }\
    .max-w-40 { max-width: 40%; }\
     .max-w-25 { max-width: 25%; }\
    .max-w-20 { max-width: 20%; }\
    .max-w-10 { max-width: 10%; }\
    .max-w-5  { max-width: 5%; }\
    \
    .cursor_default { cursor: default; }\
    .cursor_crosshair { cursor: crosshair; }\
    .cursor_pointer { cursor: pointer; }\
    .cursor_move { cursor: move; }\
    .cursor_text { cursor: text; }\
    .cursor_wait { cursor: wait; }\
    .cursor_help { cursor: help; }\
    \
    .alpha_1 { opacity: 1; }\
    .alpha_05 { opacity: 0.5; }\
    .alpha_0 { opacity: 0; }\
    \
    .show { visibility: visible; }\
    .hide { visibility: hidden; }\
    \
    .display_block { display: block; }\
    .display_inline { display: inline; }\
    .display_inlineblock { display: inline-block; }\
    .display_flex { display: flex; }\
    .display_inlineflex { display: inline-flex; }\
    .display_grid { display: grid; }\
    .display_inlinegrid { display: inline-grid; }\
    .display_none { display: none; }\
    .display_inherit { display: inherit; }\
    \
    .margin-0 { margin: 0px !important; }\
    .margin-right-2 { margin-right: 2px; }\
    .margin-right-5 { margin-right: 5px; }\
    .margin-right-10 { margin-right: 10px; }\
    .margin-right-20 { margin-right: 20px; }\
    \
    .padding-0 { padding: 0px !important; }\
    .padding-2 { padding: 2px; }\
    .padding-5 { padding: 5px; }\
    .padding-10 { padding: 10px; }\
    .padding-20 { padding: 20px; }\
    ';

    const pageExtendBaseCSS = 
    '\
    details.collapseEntryL1 { border: 2px solid #f00; }\
    details.collapseEntryL2 { border: 2px solid #6600FF; }\
    .badChoose { font-size: 20px; }\
    .level1 { color: #f00; font-weight: 900; }\
    .level2 { color: #6600FF; font-weight: 700; }\
    .color1 { color: #f00 !important; }\
    .color2 { color: #6600FF !important; }\
    .color3 { color: #FF0066 !important; }\
    .color4 { color: #990000 !important; }\
    .l-129px { left: 129px; }\
    .l-130px { left: 130px; }\
    .l-155px { left: 155px; }\
    .l-170px { left: 170px; }\
    .l-190px { left: 190px; }\
    .l-196px { left: 196px; }\
    .l-210px { left: 210px; }\
    .color5 { color: #CC0000 !important; }\
    .color6 { color: #333 !important; }\
    .bgColor1 { background: #FF0000A0 !important; }\
    .bgColor2 { background: #6600FFA0 !important; }\
    ';

    const MainAppBaseCSS = 
    '\
    html { scroll-behavior: auto; }\
    /*details { scroll-margin-top: calc(2em + 4px); }*/\
    .highlight { animation: shimmer 0.75s infinite; }\
      @keyframes shimmer {\
        0% { background: #ffd5d500; }\
        50% { background: #ffd5d5ff; }\
        100% { background: #ffd5d500; }\
      }\
    .badChoose_border { border: 1px solid #ccc; }\
    .badChoose_border_first { border-top: 1px solid #ccc; border-left: 1px solid #ccc; border-right: 1px solid #ccc; }\
    .badChoose_border_middle { border-left: 1px solid #ccc; border-right: 1px solid #ccc; }\
    .badChoose_border_last { border-left: 1px solid #ccc; border-right: 1px solid #ccc; border-bottom: 1px solid #ccc; }\
    #loadingProgress { width: 100%; position: fixed; left: 0px; bottom: 0px; z-index: 100; }\
    ';

    const MainAppCSS = 
    '\
    .commonDIV { padding: 5px; }\
    #settingUI { width: 800px; height: 600px; border: 1px solid red; position: fixed; top: 100px; left: 100px; z-index: 10; }\
    #catalogUI { border: 1px solid blue; padding: 20px 0px 0px 0px; position: fixed; z-index: 10; }\
    #selectorGroups,#selectorGroups>* { width: 100%; overflow: auto; }\
    .ui.layui-nav-container>*:first-child { padding: 6px 0px 0px 0px; }\
    .ui.layui-nav-container>*:last-child { padding: 0px 0px 6px 0px; }\
    .ui.layui-nav-container>*:not(:first-child):not(:last-child) { padding: 0; }\
    ';

    //悬浮菜单(悬浮球)
    const appHoverFloatMenu = 
    `\
    `;

    //吸附菜单(贴边)
    const appAdsorptionMenu = 
    `\
    `;

    const loadingUITemplate = 
    `\
    <div class="${cssIDNP} layui-progress" lay-showPercent="true" id="loadingProgress" lay-filter="loading-filter-progress">\
        <div class="${cssIDNP} layui-progress-bar" lay-percent="5%"></div>\
    </div>\
    `;

    //右下角 公告/消息 显示区域
    const bottomRightShowBox = 
    `\
	<div id="bottomRightShowBox">\
	</div>\
    `;

    const settingUITemplate = 
    `\
    <div class="${cssIDNP} commonDIV" id="settingUI">\
        <div class="${cssIDNP} layui-card">\
            <div class="${cssIDNP} layui-card-header">${i18nText.settingUIPanel}</div>\
            <div class="${cssIDNP} layui-card-body">\
                <div class="${cssIDNP} layui-tab layui-tab-brief">\
                    <ul class="${cssIDNP} layui-tab-title">\
                        <li class="${cssIDNP} layui-this">功能设置</li>\
                        <li class="${cssIDNP}">UI设置</li>\
                        <li class="${cssIDNP}">资源包</li>\
                        <li class="${cssIDNP}">常见问题</li>\
                        <li class="${cssIDNP}">关于</li>\
                    </ul>\
                    <div class="${cssIDNP} layui-tab-content">\
                        <div class="${cssIDNP} layui-tab-item layui-show">\
                            <div>功能设置-1</div>\
                        </div>\
                        <div class="${cssIDNP} layui-tab-item">\
                            <div>UI设置-2</div>\
                        </div>\
                        <div class="${cssIDNP} layui-tab-item">\
                            <div>资源包-3</div>\
                        </div>\
                        <div class="${cssIDNP} layui-tab-item">\
                            <div>常见问题-4</div>\
                        </div>\
                        <div class="${cssIDNP} layui-tab-item">\
                            <div>关于-5</div>\
                        </div>\
                    </div>\
                </div>\
            </div>\
        </div>\
    </div>\
    `;

    const catalogUIBase = 
    `\
    <div class="${cssIDNP} commonDIV layui-bg-gray" id="catalogUI">\
    </div>\
    `;

    const catalogUITemplate = 
    `\
        <div class="${cssIDNP} layui-btn-container" id="catalogUIBuf">\
            <button type="button" class="${cssIDNP} layui-btn" id="but_kyoku_prev">\
                <i class="${cssIDNP} layui-icon layui-icon-prev"></i>\
            </button>\
            <button type="button" class="${cssIDNP} layui-btn" id="but_kyoku_next">\
                <i class="${cssIDNP} layui-icon layui-icon-next"></i>\
            </button>\
            <button type="button" class="${cssIDNP} layui-btn" id="but_diff_prev">\
                <i class="${cssIDNP} layui-icon layui-icon-left"></i>\
            </button>\
            <button type="button" class="${cssIDNP} layui-btn" id="but_diff_next">\
                <i class="${cssIDNP} layui-icon layui-icon-right"></i>\
            </button>\
        </div>\
        <div class="${cssIDNP} layui-nav-container layui-bg-gray" id="selectorGroups" data-scrollbar >\
            <ul class="${cssIDNP} layui-nav layui-nav-tree layui-bg-gray" lay-filter="selector-filter-nav">\
                <!-- ${i18nText.kyokuSelector} -->\
                <li class="${cssIDNP} layui-nav-item layui-nav-itemed">\
                    <a class="${cssIDNP} cursor_pointer" href="javascript:;">${i18nText.kyokuSelector}</a>\
                    <dl class="${cssIDNP} layui-nav-child" class="selector" id="selector1">\
                    {{#  layui.each(d.selector1, function(index, item){ }}\
                        <dd class="${cssIDNP} cursor_pointer"><a class="${cssIDNP}" id="{{= item.nameID }}">{{= item.name }}</a></dd>\
                    {{#  }); }}\
                    </dl>\
                </li>\
            </ul>\
            <ul class="${cssIDNP} layui-nav layui-nav-tree layui-bg-gray" lay-filter="selector-filter-nav">\
                <!-- ${i18nText.badChooseSelector} -->\
                <li class="${cssIDNP} layui-nav-item">\
                    <a class="${cssIDNP} cursor_pointer" href="javascript:;">${i18nText.badChooseSelector}</a>\
                    <dl class="${cssIDNP} layui-nav-child" class="selector" id="selector2">\
                    {{#  layui.each(d.selector2, function(index, item){ }}\
                        {{#  if(item.badChooseType === 1){ }}
                            <dd class="${cssIDNP} cursor_pointer"><a class="${cssIDNP} color1 font_weight_700" id="{{= item.nameID }}">{{= item.name }}</a></dd>\
                        {{#  }else{ }}
                            <dd class="${cssIDNP} cursor_pointer"><a class="${cssIDNP} color2 font_weight_700" id="{{= item.nameID }}">{{= item.name }}</a></dd>\
                        {{#  } }}
                    {{#  }); }}\
                    </dl>\
                </li>\
            </ul>\
            <ul class="${cssIDNP} layui-nav layui-nav-tree layui-bg-gray" lay-filter="selector-filter-nav">\
                <!-- ${i18nText.differSelector} -->\
                <li class="${cssIDNP} layui-nav-item">\
                    <a class="${cssIDNP} cursor_pointer" href="javascript:;">${i18nText.differSelector}</a>\
                    <dl class="${cssIDNP} layui-nav-child" class="selector" id="selector3">\
                    {{#  layui.each(d.selector3, function(index, item){ }}\
                        {{#  if(item.badChooseType === 1){ }}
                            <dd class="${cssIDNP} cursor_pointer"><a class="${cssIDNP} color1 font_weight_700" name="{{= item.nameID }}">{{= item.name }}</a></dd>\
                        {{#  }else if(item.badChooseType === 2){ }}
                            <dd class="${cssIDNP} cursor_pointer"><a class="${cssIDNP} color2 font_weight_700" name="{{= item.nameID }}">{{= item.name }}</a></dd>\
                        {{#  }else{ }}
                            <dd class="${cssIDNP} cursor_pointer"><a class="${cssIDNP} font_weight_700" name="{{= item.nameID }}">{{= item.name }}</a></dd>\
                        {{#  } }}
                    {{#  }); }}\
                    </dl>\
                </li>\
            </ul>\
            <ul class="${cssIDNP} layui-nav layui-nav-tree layui-bg-gray position_ab bottom-0 padding-0" lay-filter="selector-filter-nav">\
                <li class="${cssIDNP} layui-nav-item text-center" style="border-top: 1px solid #ccc">\
                    <a class="${cssIDNP}" href="javascript:;">\
                    <i class="fa-solid fa-gear fa-lg margin-right-5"></i>${i18nText.openSetting}</a>\
                </li>\
            </ul>\
        </div>\
    `;

    // ---------------------------- 其他 ----------------------------
    // ---------------------------- 基本框架 ----------------------------

    const FILETYPE = {__proto__: null,
        JS: "js",
        CSS: "css",
    }

    const JSLOADTYPE = {__proto__: null,
        ASYNC: {__proto__: null, //异步加载
            name: "async",
            bit: 1,
        },
        DEFER: {__proto__: null, //延迟加载
            name: "defer",
            bit: 1 << 1,
        },
    }

    class TypeUtils {
        //
        static objType = '[object'; //对象类型
        //
        static undefinedType = '[object Undefined]'; //undefined类型
        static nullType = '[object Null]'; //null类型
        //
        static fnTypeArray = ['[object Function]', '[object AsyncFunction]']; //函数类型
        static strTypeArray = ['[object String]']; //字符串类型
        static symbolTypeArray = ['[object Symbol]']; //Symbol类型
        static arrayTypeArray = ['[object Array]']; //数组类型
        static numberTypeArray = ['[object Number]', '[object BigInt]']; //数字类型
        static booleanTypeArray = ['[object Boolean]']; //boolean类型
        static origObjType = ['[object Object]']; //原始对象类型
        //
        static mapType = ['[object Map]']; //Map对象类型
        static setType = ['[object Set]']; //Set对象类型
        //
        static dateType = ['[object Date]']; //Date对象类型
        static promiseType = ['[object Promise]']; //Promise对象类型
        static regExpType = ['[object RegExp]']; //RegExp对象类型
        //
        static errorType = ['[object Error]']; //Error对象类型 //Error、TypeError、SyntaxError、ReferenceError、RangeError、EvalError、URIError、InternalError
        //
        static getType(obj){
            return Object.prototype.toString.apply(obj);
        }
        static isValid(obj){
            if(obj == undefined || obj == null || Number.isNaN(obj)){
                return false;
            }
            if(TypeUtils.isString(obj)){
                if(TypeUtils.isUndefinedByType(obj) || TypeUtils.isNullByType(obj)){
                    return false;
                }
                return true;
            }
            return true;
        }
        static isValidValue(obj){
            if(TypeUtils.isValid(obj)){
                if(TypeUtils.isString(obj) || TypeUtils.isArray(obj)){
                    return obj.length > 0;
                }
                if(TypeUtils.isMap(obj) || TypeUtils.isSet(obj)){
                    return obj.size > 0;
                }
                return null;
            }
            return false;
        }
        // 判断是否为undefined
        static isUndefined(obj){
            let type = TypeUtils.getType(obj);
            return TypeUtils.isUndefinedByType(type);
        }
        static isUndefinedByType(obj){
            if(TypeUtils.undefinedType == obj) {
                return true;
            }
            return false;
        }
        // 判断是否为null
        static isNull(obj){
            let type = TypeUtils.getType(obj);
            return TypeUtils.isNullByType(type);
        }
        static isNullByType(obj){
            if(TypeUtils.nullType == obj) {
                return true;
            }
            return false;
        }
        // 判断是否为函数
        static isFunction(obj){
            let type = TypeUtils.getType(obj);
            return TypeUtils.isFunctionByType(type);
        }
        static isFunctionByType(obj){
            if(TypeUtils.fnTypeArray.includes(obj)) {
                return true;
            }
            return false;
        }
        // 判断是否为字符串
        static isString(obj){
            let type = TypeUtils.getType(obj);
            return TypeUtils.isStringByType(type);
        }
        static isStringByType(obj){
            if(TypeUtils.strTypeArray.includes(obj)) {
                return true;
            }
            return false;
        }
        // 判断是否为Symbol
        static isSymbol(obj){
            let type = TypeUtils.getType(obj);
            return TypeUtils.isSymbolByType(type);
        }
        static isSymbolByType(obj){
            if(TypeUtils.symbolTypeArray.includes(obj)) {
                return true;
            }
            return false;
        }
        //判断是否为数组类型
        static isArray(obj){
            let type = TypeUtils.getType(obj);
            return TypeUtils.isArrayByType(type);
        }
        static isArrayByType(obj){
            if(TypeUtils.arrayTypeArray.includes(obj)) {
                return true;
            }
            return false;
        }
        //判断是否为数字类型
        static isNumber(obj){
            let type = TypeUtils.getType(obj);
            return TypeUtils.isNumberByType(type);
        }
        static isNumberByType(obj){
            if(TypeUtils.numberTypeArray.includes(obj)) {
                return true;
            }
            return false;
        }
        //判断是否为boolean类型
        static isBoolean(obj){
            let type = TypeUtils.getType(obj);
            return TypeUtils.isBooleanByType(type);
        }
        static isBooleanByType(obj){
            if(TypeUtils.booleanTypeArray.includes(obj)) {
                return true;
            }
            return false;
        }
        // 判断是否为原始对象
        static isOrigObj(obj){
            let type = TypeUtils.getType(obj);
            return TypeUtils.isOrigObjByType(type);
        }
        static isOrigObjByType(obj){
            if(TypeUtils.origObjType.includes(obj)) {
                return true;
            }
            return false;
        }
        // 判断是否为对象(大范围)
        static isObject(obj){
            let type = TypeUtils.getType(obj);
            return TypeUtils.isObjectByType(type, obj);
        }
        static isObjectByType(obj, origObj){
            if(TypeUtils.isValid(origObj != undefined ? origObj : obj)){
                if(obj.startsWith(TypeUtils.objType)) {
                    return true;
                }
                return false;
            }
            return false;
        }
        //判断是否为Map类型
        static isMap(obj){
            let type = TypeUtils.getType(obj);
            return TypeUtils.isMapByType(type);
        }
        static isMapByType(obj){
            if(TypeUtils.mapType.includes(obj)) {
                return true;
            }
            return false;
        }
        //判断是否为Set类型
        static isSet(obj){
            let type = TypeUtils.getType(obj);
            return TypeUtils.isSetByType(type);
        }
        static isSetByType(obj){
            if(TypeUtils.setType.includes(obj)) {
                return true;
            }
            return false;
        }
        //判断是否为Date类型
        static isDate(obj){
            let type = TypeUtils.getType(obj);
            return TypeUtils.isDateByType(type);
        }
        static isDateByType(obj){
            if(TypeUtils.dateType.includes(obj)) {
                return true;
            }
            return false;
        }
        //判断是否为Promise类型
        static isPromise(obj){
            let type = TypeUtils.getType(obj);
            return TypeUtils.isPromiseByType(type);
        }
        static isPromiseByType(obj){
            if(TypeUtils.promiseType.includes(obj)) {
                return true;
            }
            return false;
        }
        //判断是否为RegExp类型
        static isRegExp(obj){
            let type = TypeUtils.getType(obj);
            return TypeUtils.isRegExpByType(type);
        }
        static isRegExpByType(obj){
            if(TypeUtils.regExpType.includes(obj)) {
                return true;
            }
            return false;
        }
        //判断是否为Error类型
        static isError(obj){
            let type = TypeUtils.getType(obj);
            return TypeUtils.isErrorByType(type);
        }
        static isErrorByType(obj){
            if(TypeUtils.errorType.includes(obj)) {
                return true;
            }
            return false;
        }
    }

    class DOMTypeUtils extends TypeUtils {
        static svgTypeArray = ['[object SVGSVGElement]']; //SVG节点类型
        static textTypeArray = ['[object Text]']; //TEXT节点类型
        // 判断是否为SVG节点
        static isSVGElement(obj){
            let type = DOMTypeUtils.getType(obj);
            return DOMTypeUtils.isSVGElementByType(type);
        }
        static isSVGElementByType(obj){
            if(DOMTypeUtils.svgTypeArray.includes(obj)) {
                return true;
            }
            return false;
        }
        // 判断是否为Text节点
        static isTextElement(obj){
            let type = DOMTypeUtils.getType(obj);
            return DOMTypeUtils.isTextElementByType(type);
        }
        static isTextElementByType(obj){
            if(DOMTypeUtils.textTypeArray.includes(obj)) {
                return true;
            }
            return false;
        }

    }

    class Utils {
        static {
            Utils.setDnsPrefecth(true);
            Utils.addDnsPrefecthUrl("//cdn.staticfile.org");
            Utils.addDnsPrefecthUrl("//tenhou.net");
            Utils.addNewScript("js_immutable", GM_getResourceText("js_immutable"));
            Utils.addNewScript("js_cryptojs", GM_getResourceText("js_cryptojs"));
            //Utils.loadjscssFile(GM_getResourceURL("js_immutable"), FILETYPE.JS, JSLOADTYPE.ASYNC.bit | JSLOADTYPE.DEFER.bit);
        }

        static loadjscssFile(filePath, fileType, args_bits_LOADTYPE_bit) {
            let ele = undefined;
            if (fileType == FILETYPE.JS) {
                ele = document.createElement('script');
                ele.setAttribute("src", filePath);

                if((args_bits_LOADTYPE_bit & (1 << 0)) == 0 ? false : true){
                    ele.setAttribute(JSLOADTYPE.ASYNC.name, true);
                }else if((args_bits_LOADTYPE_bit & (1 << 1)) == 0 ? false : true){
                    ele.setAttribute(JSLOADTYPE.DEFER.name, true);
                }
            } else if (fileType == FILETYPE.CSS) {
                ele = document.createElement("link");
                ele.setAttribute("rel", "stylesheet");
                ele.setAttribute("href", filePath);
            }else{
                Console.orig.log(`不支持的文件类型: ${fileType}`);
                return;
            }
    
            if (ele != undefined) {
                document.getElementsByTagName("head")[0].appendChild(ele);
            }
        }

        static addNewStyle(id, newStyle) {
            let styleElement = document.getElementById(id);
            
            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.id = id;
                document.getElementsByTagName('head')[0].appendChild(styleElement);
            }
            styleElement.appendChild(document.createTextNode(newStyle));
        }

        static addNewScript(id, newScript) {
            let scriptElement = document.getElementById(id);
    
            if (!scriptElement) {
                scriptElement = document.createElement('script');
                scriptElement.id = id;
                document.getElementsByTagName('head')[0].appendChild(scriptElement);
            }
            scriptElement.appendChild(document.createTextNode(newScript));
        }

        static addElementsByHTMLTemplateText(htmlTemplate, parentElement) {
            let ele = document.createElement("div");
            if(parentElement == undefined)
                document.body.appendChild(ele);
            else
                parentElement.appendChild(ele);
            ele.outerHTML = htmlTemplate;
        }

        static setDnsPrefecth(isEnable) {
            if(TypeUtils.isBoolean(isEnable)){
                if(isEnable){
                    isEnable = "on";
                }else{
                    isEnable = "off";
                }
            }else{
                isEnable = "on";
            }
            let ele = document.createElement("meta");
            ele.setAttribute("http-equiv", "x-dns-prefetch-control");
            ele.setAttribute("content", isEnable);
            document.getElementsByTagName("head")[0].appendChild(ele);
        }

        static addDnsPrefecthUrl(url){
            let ele = document.createElement("link");
            ele.setAttribute("rel", "dns-prefetch");
            ele.setAttribute("href", url);
            document.getElementsByTagName("head")[0].appendChild(ele);
        }
    }
    
    class CustomUtils {
        static{
            // 拓展系统库
            Math.constructor.roundEx = (nValue, n) => { //保留n位小数
                return Math.round(nValue*Math.pow(10,n))/Math.pow(10,n);
            }
            // 为JSON序列化添加对Map、Set类型的支持
            const { stringify, parse } = JSON
            JSON.stringify = function (value, replacer, space) {
            const _replacer =
                typeof replacer === 'function'
                    ? replacer
                    : function (_, value) {
                        return value
                    }
            replacer = function (key, value) {
                value = _replacer(key, value)
                if (value instanceof Set) value = `Set{${stringify([...value])}}`
                else if (value instanceof Map) value = `Map{${stringify([...value])}}`
                return value
                }
            return stringify(value, replacer, space)
            }
            JSON.parse = function (value, reviver) {
            if (!reviver)
                reviver = function (key, value) {
                if (/Set\{\[.*\]\}/.test(value))
                    value = new Set(parse(value.replace(/Set\{\[(.*)\]\}/, '[$1]')))
                else if (/Map\{\[.*\]\}/.test(value))
                    value = new Map(parse(value.replace(/Map\{\[(.*)\]\}/, '[$1]')))
                return value
                }
            return parse(value, reviver)
            }
        }

        static handleCSSCompatibility(idPrefix, cssText, ruleSet) { //处理css兼容性, 防止外部css库修改原始css样式, 并应用自定义规则
            let handleMode = 3; //默认为后置处理

            let retCssText = cssText;
            if(idPrefix != undefined && idPrefix != null && idPrefix != ""){ //安全检查: 是否处理名称空间
                let splitStrArray = cssText.split(/\{[\s\S]+?\}/g); //提取每一段的css选择器
                let startIndex = 0, endIndex = 0;
                splitStrArray.forEach((item,index)=> {
                    //从css选择器匹配中过滤不需要的元素
                    if(item.indexOf("@charset") != -1){
                        let start = item.indexOf("@charset");
                        let end = item.indexOf(';');
                        let array = item.split("");
                        array.splice(start, end-start +1);
                        item = array.join("");
                    }else if(item.indexOf("@import") != -1){
                        let start = item.indexOf("@import");
                        let end = item.indexOf(';');
                        let array = item.split("");
                        array.splice(start, end-start +1);
                        item = array.join("");
                    }

                    let cssSelectArray = item.match(/[A-Za-z0-9\:\-\_\@\.\#\+\>\<\*\?\;\!\[\]\=\"\'\`\/\\\(\)\{\}\~\^\$\|\%\&]+/g); //提取单个css选择器 //排除了,
                    //Console.orig.log("cssSelectArray: " + cssSelectArray);
                    
                    if(cssSelectArray != null) {
        
                        for (let i = 0; i < cssSelectArray.length; i++) {
                            const cssSelectStr = cssSelectArray[i];
                            handleMode = 3;
        
                            if(cssSelectStr.indexOf("@") != -1){ //需要排除的内容
                                break;
                            }
                            if(cssSelectStr == "from" || cssSelectStr == "to") //需要排除的内容
                                break;
                            if(cssSelectStr.indexOf("%") != -1) //需要排除的内容
                                break;
                            if(cssSelectStr.indexOf(":root") != -1){
                                handleMode = 2;
                            }else if(cssSelectStr.indexOf(":") != -1){ //需要排除的内容 (伪类元素选择器)
                                break;
                            }
        
                            //Console.orig.log("cssSelectArray: " + cssSelectArray);
                            startIndex = retCssText.indexOf(cssSelectStr, startIndex);
                            endIndex = startIndex + cssSelectStr.length;

                            if(handleMode == 1){ //前置处理, 如.ui.layui
                                retCssText = retCssText.substring(0, startIndex) + idPrefix + cssSelectStr + retCssText.substring(endIndex);
                            }else if(handleMode == 2){ //位于伪类之前处理
                                let pointIndex = cssSelectStr.indexOf(':');
                                let newCssSelectStr = cssSelectStr.substring(0, pointIndex -1) + idPrefix + cssSelectStr.substring(pointIndex);

                                retCssText = retCssText.substring(0, startIndex) + newCssSelectStr + retCssText.substring(endIndex);
                            }else{ //后置处理, 如p.layui.ui
                                retCssText = retCssText.substring(0, startIndex) + cssSelectStr + idPrefix + retCssText.substring(endIndex);
                            }
                            startIndex += idPrefix.length + 1 + cssSelectStr.length; //重新设置startIndex,防止重复查找
                            
                        }
                        startIndex = retCssText.indexOf("}", startIndex) + 1; //重新设置startIndex,防止从错误的位置开始查找
                        //Console.orig.log("\n" + retCssText);
                    }
                });
            }
            //根据规则进行替换
            if(ruleSet != undefined && ruleSet != null) {
                for (const [key, value] of ruleSet.entries()) {
                    retCssText = retCssText.replaceAll(key, value);
                }
            }
            //Console.orig.log("\n" + retCssText);
            return retCssText;
        }
    
        static handleJSCompatibility(idPrefix, jsText, ruleSet) { //处理js兼容性, 应用自定义规则
            //根据规则进行替换
            if(ruleSet != undefined && ruleSet != null) {
                for (const [key, value] of ruleSet.entries()) {
                    jsText = jsText.replaceAll(key, value);
                }
            }
            // Console.orig.log("\n" + jsText);
            return jsText;
        }

        static getTextLineNumByOffsetHeight(ele) {
            let styles = getComputedStyle(ele, null);
            let lineHeight = parseFloat(styles.lineHeight);
            let offsetHeight = parseFloat(ele.offsetHeight);
            let lineNum = offsetHeight / lineHeight;
            return Math.round(lineNum);
        }
        static getTextLineNum(ele) {
            let styles = getComputedStyle(ele, null);
            let lineHeight = parseFloat(styles.lineHeight);
            let height = parseFloat(styles.height);
            let offsetHeight = parseFloat(ele.offsetHeight);
            let lineNum = (height || offsetHeight) / lineHeight;
            return Math.round(lineNum);
        }
        static getStyleOfLineHeight(ele) {
            let styles = getComputedStyle(ele, null);
            let lineHeight = parseFloat(styles.lineHeight);
            return lineHeight;
        }

        static isShowInClientWindow(ele) {
            const scrollTop = document.scrollingElement.scrollTop;
            const clientHeight = document.scrollingElement.clientHeight;
            const scrollEndTop = scrollTop + clientHeight;
            if(ele.offsetTop + ele.offsetHeight >= scrollTop && ele.offsetTop <= scrollEndTop){
                return true;
            }else{
                return false;
            }
        }
        static isShowInClientWindowByApi(ele) {
            const clientHeight = document.scrollingElement.clientHeight;
            const {top, bottom} = ele.getBoundingClientRect();
            return bottom > 0 && top < clientHeight;
        }
        static isShowInClientWindowOfPositionMode(ele) {
            const positionMode = [
                "static",
                "relative",
                "absolute",
                "sticky",
                "fixed",
            ];
            const scrollTop = document.scrollingElement.scrollTop;
            const clientHeight = document.scrollingElement.clientHeight;
            const scrollEndTop = scrollTop + clientHeight;
            let parentEle = ele;
            let styles = getComputedStyle(parentEle, null);
            if(positionMode.includes(styles.position)){
                while(styles.position != "absolute" && styles.position != "fixed") { //循坏向上查找设置了绝对定位或固定定位的父节点
                    parentEle = parentEle.parentElement;
                    styles = getComputedStyle(parentEle, null);
                }
            }
            //以父节点为准
            const realTop = scrollTop + parentEle.offsetTop;
            const realBottom = realTop + parentEle.offsetHeight;
            if(realTop + parentEle.offsetHeight >= scrollTop && realTop <= scrollEndTop){
                return true;
            }else{
                return false;
            }
        }

        static isShowInClientWindowOfPositionModeAndScrollbar(ele) {
            // const positionMode = [
            //     "static",
            //     "relative",
            //     "absolute",
            //     "sticky",
            //     "fixed",
            // ];
            // // const scrollTop = document.scrollingElement.scrollTop;
            // // const clientHeight = document.scrollingElement.clientHeight;
            // // const scrollEndTop = scrollTop + clientHeight;
            // let parentEle = ele;
            // let styles = getComputedStyle(parentEle, null);
            // if(positionMode.includes(styles.position)){
            //     while(styles.position != "absolute" && styles.position != "fixed") { //循坏向上查找设置了绝对定位或固定定位的父节点
            //         parentEle = parentEle.parentElement;
            //         styles = getComputedStyle(parentEle, null);
            //     }
            // }
            // //以父节点为准
            // debugger
            // let scrollbarEle = parentEle.querySelector("[data-scrollbar]");
            // let scrollbarStyles = getComputedStyle(scrollbarEle, null);

            // const scrollTop = parentEle.offsetTop + scrollbarEle.offsetTop + scrollbarEle.scrollTop; //60+48=108
            // const clientHeight = scrollbarEle.clientHeight;
            // const scrollEndTop = scrollTop + clientHeight;

            // // const realTop = scrollTop + scrollbarEle.offsetTop;
            // // const realEndTop = realTop + scrollbarEle.offsetHeight;
            // //ele.offsetTop + ele.offsetHeight >= scrollTop && ele.offsetTop <= scrollEndTop
            // if(ele.parentElement.offsetTop + ele.parentElement.offsetHeight >= scrollTop && ele.parentElement.offsetTop <= scrollEndTop){
            //     return true;
            // }else{
            //     return false;
            // }
            return false;
        }


        static isShowInClientWindowOfNodeArray(eleArray, startIndex, endIndex) {
            if(eleArray == undefined || eleArray == null || eleArray.length == 0){
                return false;
            }
            if(eleArray.length == 1) {
                return CustomUtils.isShowInClientWindow(eleArray[0]);
            }
            if(startIndex == undefined || startIndex == null){
                startIndex = 0;
            }
            if(endIndex == undefined || endIndex == null){
                endIndex = eleArray.length - 1;
            }
            const scrollTop = document.scrollingElement.scrollTop;
            const clientHeight = document.scrollingElement.clientHeight;
            const scrollEndTop = scrollTop + clientHeight;

            if(eleArray[startIndex].offsetTop + ((eleArray[endIndex].offsetTop - eleArray[startIndex].offsetTop) + eleArray[endIndex].offsetHeight) >= scrollTop && eleArray[startIndex].offsetTop <= scrollEndTop){
                return true;
            }
            return false;
        }

        static getScrollTopByTargetEleOfHide(ele){ //2797
            return CustomUtils.getScrollTopByTargetEleOfShow(ele) + 1;
        }
        static getScrollTopByTargetEleOfShow(ele){ //显示 //2796
            return ele.offsetTop + ele.offsetHeight;
        }
        static getScrollBottomByTargetEleOfHide(ele){ //1523
            const clientHeight = document.scrollingElement.clientHeight;
            return ele.offsetTop - clientHeight;
        }
        static getScrollBottomByTargetEleOfShow(ele){ //显示 //1524
            return CustomUtils.getScrollBottomByTargetEleOfHide(ele) + 1;
        }

        static setScrollToTargetNode(targetNode, verticalAlign){
            // document.scrollingElement.scrollTop = targetNode.offsetTop;
            if(globalSettings.AppSettings.global.enableScrollAnimation){
                // 页面动画滚动过度 A标签高亮
                targetNode.scrollIntoView({
                    behavior: "smooth",
                    block: verticalAlign || "start",
                    inline: "start",
                });
            }else{
                //页面直接滚动不过度 A标签高亮
                targetNode.scrollIntoView({
                    behavior: "instant", //动画
                    block: verticalAlign || "start", //垂直对齐方式
                    inline: "start", //水平对齐方式
                });
            }
        }

        static setHighlightShow(targetNode, showTime_ms, EndCallBack = null, ...args){
            targetNode.classList.add("highlight");
            setTimeout(()=>{
                targetNode.classList.remove("highlight");
                if(EndCallBack != undefined && EndCallBack != null)
                    EndCallBack(args);
            }, showTime_ms);
        }

        //函数节流: 减少代码执行频率 (在一个单位时间内，只能触发一次函数)
        static throttle(fn, interval = 500) {
            let run = true;
          
            return function () {
                if (!run) return;
                run = false;
                setTimeout(() => {
                    fn.apply(this, arguments);
                    run = true;
                }, interval);
            };
        }
        //函数防抖: 判断某个动作结束，如滚动结束、input输入结束等 (在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时) (在规定时间内，只让最后一次生效，前面的不生效)
        static debounce(fn, interval = 500) {
            let timeout = null;
            
            return function () {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    fn.apply(this, arguments);
                }, interval);
            };
        }

        static compareVersion(version1, version2) { //比较字符串，如果有非数字则忽略大小写
            if(version1 === version2){
                return 0; // 版本相同
            }
            const ver1Array = version1.match(/\d+/g).map(i => parseInt(i));
            const ver2Array = version2.match(/\d+/g).map(i => parseInt(i));
            const ver1Leng = ver1Array.length, ver2Leng = ver2Array.length;
            
            for (let i = 0; i < Math.max(ver1Leng, ver2Leng); i++) {
                const value1 = i < ver1Leng ? ver1Array[i] : 0;
                const value2 = i < ver2Leng ? ver2Array[i] : 0;
                if (value1 != value2) {
                    return value1 > value2 ? 1 : -1;
                }
            }
            //处理特殊版本, 比如带alpha、Beta标识的版本
            const newVersion1 = version1.replaceAll(/[(\d+)|(\.\-\_\\\/\|)|(\s)]/g, "").toLocaleLowerCase();
            const newVersion2 = version2.replaceAll(/[(\d+)|(\.\-\_\\\/\|)|(\s)]/g, "").toLocaleLowerCase();
            if(newVersion1 === newVersion2){
                return 0; // 版本相同
            }else{
                return -1; // 版本不同, 为了避免后续发生逻辑错误, 返回版本降级结果是最好的
            }
        }
    }

    class Config {

        static readConfig(){
        }
        static SaveConfig(){
        }
        static clear(){
        }
    }

    class DBConfig extends Config {

        static async readConfig(name){
            try {
                return await localforage.getItem(name);
            } catch (err) {
                Console.orig.error("获取数据时发生错误: \n" + err);
            }
        }
        static async SaveConfig(name, obj){
            const jsonStr = JSON.stringify(obj);
            try {
                await localforage.setItem(name, jsonStr);
            } catch (err) {
                Console.orig.error("存储数据时发生错误: \n" + err);
            }
        }

        static async clear(){ //重置数据库
            await localforage.clear();
        }
    }

    const windowInfo = {__proto__: null,
        x: 0,
        y: 0,
        l: 0,
        t: 0,
        isMouseDown: false,
    }

    class DomUtils {
        static windowInfoMap = new Map();
        static ObserverEleSetMap = new Map();

        static setMoveable(targetElement, isMove) {
            let id = targetElement.id;
            let winInfo = DomUtils.windowInfoMap.get(id);
            if(winInfo == undefined){
                winInfo = { ...windowInfo }; //复制对象
            }

            targetElement.addEventListener('mousedown', function(e){ //鼠标按下事件
                let idStr = e.target.id;
                //获取x坐标和y坐标
                winInfo.x = e.clientX;
                winInfo.y = e.clientY;
                
                //获取左部和顶部的偏移量
                winInfo.l = targetElement.offsetLeft;
                winInfo.t = targetElement.offsetTop;
                //开关打开
                winInfo.isMouseDown = true;
                //设置样式  
                targetElement.style.cursor = 'move';
            });
    
            targetElement.addEventListener('mousemove', function(e){ //鼠标移动
                if (winInfo.isMouseDown == false) {
                    return;
                }
                //获取x和y
                var nx = e.clientX;
                var ny = e.clientY;
                //计算移动后的左偏移量和顶部的偏移量
                var nl = nx - (winInfo.x - winInfo.l);
                var nt = ny - (winInfo.y - winInfo.t);
    
                targetElement.style.left = nl + 'px';
                targetElement.style.top = nt + 'px';
            });
    
            targetElement.addEventListener('mouseup', function(e){ //鼠标抬起事件
                //开关关闭
                winInfo.isMouseDown = false;
                targetElement.style.cursor = 'default';
            });

            DomUtils.windowInfoMap.set(id, winInfo);
        }

        static setNewActivateEle(targetEle, className) {
            if(targetEle != null && targetEle != undefined) {
                let groupID = targetEle.parentElement.parentElement.id;
                let ObserverEleArray = DomUtils.ObserverEleSetMap.get(groupID); //
                if(ObserverEleArray == undefined){
                    ObserverEleArray = [];
                }
                //清除旧数据
                for (let j = 0; j < ObserverEleArray.length; j++) {
                    const element = ObserverEleArray[j];
                    element.parentElement.classList.remove(className);
                }
                ObserverEleArray.length = 0; //清空数组
                
                //处理新数据
                targetEle.parentElement.classList.add(className);
                ObserverEleArray.push(targetEle);
                DomUtils.ObserverEleSetMap.set(groupID, ObserverEleArray); //
            }
        }
    }

    class MJCommonUtils {
        //标准局数 转 东南西场 (1=东 2=南 3=西)
        static normalKyokuToKyokuMode(curKyoku){
            let curkyokuMode; //东南西场 (1=东 2=南 3=西)

            if(curKyoku <= 3)
                curkyokuMode = 1; //东场
            else if(curKyoku <= 7)
                curkyokuMode = 2; //南场
            else if(curKyoku <= 11)
                curkyokuMode = 3; //西场

            return curkyokuMode;
        }
        //标准局数 转 文本局数 (0=>1: 东一) (6=>3: 南3)
        static normalKyokuToTextKyoku(curKyoku, curkyokuMode){
            let textKyoku = parseInt(curKyoku) + 1;
            if(curkyokuMode == 2) //南场
                textKyoku -= 4;
            else if(curkyokuMode == 3) //西场
                textKyoku -= 8;
            
            return textKyoku;
        }

        static getTextByOutStyle(outStyle, index) {
            if(outStyle == OUTSTYLE.A)
                return eval("i18nText.seatTypeA" + index); //seatTypeA0 //东起
            else if(outStyle == OUTSTYLE.B)
                return eval("i18nText.seatTypeB" + index); //seatTypeB0 //东家
            else if(outStyle == OUTSTYLE.C)
                return eval("i18nText.seatTypeC" + index); //seatTypeC0 //自家
            else{
                Console.orig.warn("outStyle是无效的!");
            }
        }
        
        static getSelfViewPlayerNameByTargetPlayerIndex(selfIndex, targetPlayerIndex) {
            const viewMap = new Map();

            let viewArray = [
                { value: -3, name: i18nText.seatTypeC1 }, //下家
                { value: -2, name: i18nText.seatTypeC2 }, //对家
                { value: -1, name: i18nText.seatTypeC3 }, //上家
                { value: 0, name: i18nText.seatTypeC0 },  //自家
                { value: 1, name: i18nText.seatTypeC1 },  //下家
                { value: 2, name: i18nText.seatTypeC2 },  //对家
                { value: 3, name: i18nText.seatTypeC3 },  //上家
            ];
            viewArray.forEach((item,index)=> {
                viewMap.set(item.value, item.name);
            });

            const getValue = (offset) => {
                if(offset > 0)
                    return offset -4;
                else
                    return offset +4;
            }
            
            let offset = targetPlayerIndex - selfIndex;
            let result;
            do {
                result = viewMap.get(offset);
            } while (offset = getValue(offset), result == undefined);
            return result;
        }
        static getPlayerIndexByPlayerSeatName(playerSeatName, outStyle) {
            let seatArray;
            if(outStyle == OUTSTYLE.A)
                seatArray = [i18nText.seatTypeA0, i18nText.seatTypeA1, i18nText.seatTypeA2, i18nText.seatTypeA3]; //东起, 南起, 西起, 北起
            else if(outStyle == OUTSTYLE.B)
                seatArray = [i18nText.seatTypeB0, i18nText.seatTypeB1, i18nText.seatTypeB2, i18nText.seatTypeB3]; //东家, 南家, 西家, 北家
            else{
                Console.orig.warn("outStyle是无效的!");
                seatArray = [i18nText.seatTypeA0, i18nText.seatTypeA1, i18nText.seatTypeA2, i18nText.seatTypeA3]; //东起, 南起, 西起, 北起
            }
            const seatMap = new Map();
            seatArray.forEach((item,index)=> {
                seatMap.set(item, index);
            });
            return seatMap.get(playerSeatName);
        }
        static getPlayerSeatNameByPlayerIndex(playerIndex, kyoku, outStyle) {
            let seatArray;
            if(outStyle == OUTSTYLE.A)
                seatArray = [i18nText.seatTypeA0, i18nText.seatTypeA3, i18nText.seatTypeA2, i18nText.seatTypeA1]; //东起, 北起, 西起, 南起
            else if(outStyle == OUTSTYLE.B)
                seatArray = [i18nText.seatTypeB0, i18nText.seatTypeB3, i18nText.seatTypeB2, i18nText.seatTypeB1]; //东家, 北家, 西家, 南家
            else{
                Console.orig.warn("outStyle是无效的!");
                seatArray = [i18nText.seatTypeA0, i18nText.seatTypeA3, i18nText.seatTypeA2, i18nText.seatTypeA1]; //东起, 北起, 西起, 南起
            }
            const seatMap = new Map();
            seatArray.forEach((item,index)=> {
                seatMap.set(item, index);
            });
            const getValueByEachArray = (array, startIndex, eachCount) => {
                let length = array.length;
                let targetIndex = startIndex;
                for (let i = eachCount; i > 0; i--) {
                    if(++targetIndex >= length)
                        targetIndex = 0;
                }
                return array[targetIndex];
            }
            const getStart = (playerIndex, kyoku, outStyle) => {
                switch (playerIndex + kyoku) {
                    case 0:
                        return MJCommonUtils.getTextByOutStyle(outStyle, 0); //东起
                    case 1:
                        return MJCommonUtils.getTextByOutStyle(outStyle, 1); //南起
                    case 2:
                        return MJCommonUtils.getTextByOutStyle(outStyle, 2); //西起
                    case 3:
                        return MJCommonUtils.getTextByOutStyle(outStyle, 3); //北起
                    default:
                        return getStart(playerIndex, kyoku -4, outStyle);
                }
            }
            const get = (playerIndex, kyoku, outStyle) => {
                let startIndex = seatMap.get(getStart(playerIndex, 0, outStyle));
                return getValueByEachArray(seatArray, startIndex, kyoku);
            }
            if(kyoku == 0)
                return getStart(playerIndex, kyoku, outStyle);
            else
                return get(playerIndex, kyoku, outStyle);
        }

    }

    class MJUtils {

    }

    class MessageQueue {

    }

    class Popup {

    }

    class Api {
        static currApi;
        static commonApi = {
            name: "Tampermonkey",
            id: "",
            map: new Map([
                ["setValue", "GM_setValue"],          //
                ["getValue", "GM_getValue"],          //
                ["addStyle", "GM_addStyle"],
                ["deleteValue", "GM_deleteValue"],       //
                ["listValues", "GM_listValues"],        //
                ["addValueChangeListener", "GM_addValueChangeListener"],
                ["removeValueChangeListener", "GM_removeValueChangeListener"],
                ["log", "GM_log"],               //
                ["getResourceText", "GM_getResourceText"],   //
                ["getResourceURL", "GM_getResourceURL"],    //
                ["registerMenuCommand", "GM_registerMenuCommand"],
                ["unregisterMenuCommand", "GM_unregisterMenuCommand"],
                ["openInTab", "GM_openInTab"],         //
                ["xmlhttpRequest", "GM_xmlhttpRequest"],    //
                ["download", "GM_download"],          //
                ["getTab", "GM_getTab"],
                ["saveTab", "GM_saveTab"],
                ["getTabs", "GM_getTabs"],
                ["notification", "GM_notification"],
                ["setClipboard", "GM_setClipboard"],      //
                ["info", "GM_info"],
            ]),
        };
        // static viaApi = {
        //     name: "via",
        //     id: "via_gm",
        //     map: new Map([
        //         ["deleteValue", "deleteValue"],     //
        //         ["download", "download"],        //
        //         ["getResourceText", "getResourceText"], //
        //         ["getResourceURL", "getResourceURL"],  //
        //         ["getValue", "getValue"],        //
        //         ["isInstalled", "isInstalled"],
        //         ["listValues", "listValues"],      //
        //         ["log", "log"],             //
        //         ["openInTab", "openInTab"],       //
        //         ["openOptions", "openOptions"],
        //         ["setClipboard", "setClipboard"],    //
        //         ["setValue", "setValue"],        //
        //         ["xmlHttpRequest", "xmlHttpRequest"],  //
        //     ]),
        // };
        static{
            // if(Api.isDefine(Api.viaApi.id)){
            //     Api.currApi = Api.viaApi;
            // }else{
                Api.currApi = Api.commonApi;
            // }
        }
        static isDefine(id) {
            return eval(`typeof ${id} != 'undefined'`);
        }
        static getByMap(str) {
            let result = Api.currApi.map.get(str);
            return result != undefined ? result : Api.commonApi.map.get(str);
        }
        static commonCall(fnNameStr, ...args) {
            if(fnNameStr.startsWith("GM_"))
                return eval(fnNameStr + ".apply(this, args)");
            else if(Api.currApi.id == "")
                return eval(fnNameStr + ".apply(this, args)");
            else
                return eval(`${Api.currApi.id}.${fnNameStr}` + ".apply(this, args)");
        }
        //
        static GM_setValue(...args){ return Api.commonCall(Api.getByMap("setValue"), args); }
        static GM_getValue(...args){ return Api.commonCall(Api.getByMap("getValue"), args); }
        static GM_addStyle(...args){ return Api.commonCall(Api.getByMap("addStyle"), args); }
        static GM_deleteValue(...args){ return Api.commonCall(Api.getByMap("deleteValue"), args); }
        static GM_listValues(...args){ return Api.commonCall(Api.getByMap("listValues"), args); }
        static GM_addValueChangeListener(...args){ return Api.commonCall(Api.getByMap("addValueChangeListener"), args); }
        static GM_removeValueChangeListener(...args){ return Api.commonCall(Api.getByMap("removeValueChangeListener"), args); }
        static GM_log(...args){ return Api.commonCall(Api.getByMap("log"), args); }
        static GM_getResourceText(...args){ return Api.commonCall(Api.getByMap("getResourceText"), args); }
        static GM_getResourceURL(...args){ return Api.commonCall(Api.getByMap("getResourceURL"), args); }
        static GM_registerMenuCommand(...args){ return Api.commonCall(Api.getByMap("registerMenuCommand"), args); }
        static GM_unregisterMenuCommand(...args){ return Api.commonCall(Api.getByMap("unregisterMenuCommand"), args); }
        static GM_openInTab(...args){ return Api.commonCall(Api.getByMap("openInTab"), args); }
        static GM_xmlhttpRequest(...args){ return Api.commonCall(Api.getByMap("xmlhttpRequest"), args); }
        static GM_download(...args){ return Api.commonCall(Api.getByMap("download"), args); }
        static GM_getTab(...args){ return Api.commonCall(Api.getByMap("getTab"), args); }
        static GM_saveTab(...args){ return Api.commonCall(Api.getByMap("saveTab"), args); }
        static GM_getTabs(...args){ return Api.commonCall(Api.getByMap("getTabs"), args); }
        static GM_notification(...args){ return Api.commonCall(Api.getByMap("notification"), args); }
        static GM_setClipboard(...args){ return Api.commonCall(Api.getByMap("setClipboard"), args); }
        static GM_info(...args){ return Api.commonCall(Api.getByMap("info"), args); }
    }

    class Debug {
        static #bDebug = true; //调试模式
        static #bPublicApi = true;
        static {
            if(Debug.#bDebug && Debug.#bPublicApi){
                let execute = "";
                for (const [key, value] of Api.commonApi.map.entries()) {
                    execute += `if(typeof ${value} != 'undefined') g_window.${value} = ${value};\n`;
                }
                eval(execute);
            }
        }
        static set setDebug(debug){
            Debug.#bDebug = debug;
        }
        static get getDebug(){
            return Debug.#bDebug;
        }
        //
        static globalErrorHandle(errObj) {
            ElementPlus.ElNotification({
                title: errObj.name || 'Error',
                message: Vue.h('i', { style: 'color: red' }, errObj.toString()),
                type: 'error',
                duration: 4500,
            });
            Console.orig.error(errObj);
        }
        static globalOutputErrorHandle(errName, errStr) {
            ElementPlus.ElNotification({
                title: errName || 'Error',
                message: Vue.h('i', { style: 'color: red' }, errStr),
                type: 'error',
                duration: 4500,
            });
            Console.orig.error(errStr);
        }
        //
        
    }

    class Console {
        static orig = window.console; //保存原始对象
        static clear(){
            clear();
        }
        static log(...args){
            Debug.getDebug && 
            Console.orig.log('%c[log]', 'background: #ffa500; padding: 1px; color: #fff;', args);
        }
        static warn(...args){
            Debug.getDebug && 
            Console.orig.log('%c[warn]', 'background: #ffa500; padding: 1px; color: #fff;', args);
        }
        static error(...args){
            Debug.getDebug && 
            Console.orig.log('%c[error]', 'background: red; padding: 1px; color: #fff;', args);
        }
        static info(...args){
            Debug.getDebug && 
            Console.orig.log('%c[info]', 'background: #ffa500; padding: 1px; color: #fff;', args);
        }
        static table(...args){
            Debug.getDebug && 
            Console.orig.table(args);
        }
    }
    g_window.Console = Console;

    class Performance {
        constructor(name){
            if(name != undefined)
                this._name = name;
            else
                this._name = '';
            this.nTimeStart = 0;
            this.nTimeEnd = 0;
        }
        setStartTime() {
            this.nTimeStart = performance.now();
        }
        setEndTime() {
            this.nTimeEnd = performance.now();
        }
        getEndTime(fnName) {
            this.nTimeEnd = performance.now();
            let executionTime = this.nTimeEnd - this.nTimeStart;

            if(fnName == undefined || fnName == null){
                fnName = "";
            }else{
                fnName = `.${fnName}()`;
            }
            Console.orig.log(`${this._name}${fnName}代码执行时间: ${executionTime.toFixed(3)} 毫秒`); //
            return executionTime;
        }
    }

    const CallType = {__proto__: null,
        Positive: "Positive",
        Reverse: "Reverse",
    }
    const HookType = {__proto__: null,
        Single: "Single",
        Multi: "Multi",
    }
    class ProxyGenerator { //代理生成器: 生成代理方法
        proxyInfo = [
            CryptoJS.SHA1(this.generateSingle().toString().replace(/\s+/g, "")).toString(),
            CryptoJS.SHA1(this.generateMulti_ChainCall().toString().replace(/\s+/g, "")).toString(),
            CryptoJS.SHA1(this.generateMultiReverse_ChainCall().toString().replace(/\s+/g, "")).toString(),
        ];
        generateSingle(fcName_, origFcAddr_, newFcAddr_, newFcAddrLastCall_) { //单hook
            function _proxy_s(...args){
                let prototype = _proxy_s.prototype;
                if(prototype.hasOwnProperty("_fcData")) {
                    let fcData = _proxy_s.prototype._fcData;
                    let origArgs = [...args]; //复制数组
                    args.unshift(origFcAddr_); //添加到数组开头
                    let lastCallArgs = [...args]; //复制数组
                    if(fcData.newFcAddr.length == 2) //根据模板函数实际参数个数，传入匹配的参数
                        args.splice(1, 0, undefined); //将undefined插入到数组第二个元素
                    let interceptor = fcData.newFcAddr.apply(this, args); //调用newFcAddr
                    if(interceptor == true || interceptor == undefined){
                        let ret = fcData.origFcAddr.apply(this, origArgs); //调用原函数 //this是调用方传递的,也一并传递
                        if(fcData.newFcAddrLastCall && fcData.newFcAddrLastCall.length == 2) //根据模板函数实际参数个数，传入匹配的参数
                            lastCallArgs.splice(1, 0, ret); //将ret插入到数组第二个元素
                        if(fcData.newFcAddrLastCall)
                            fcData.newFcAddrLastCall.apply(this, lastCallArgs); //调用newFcAddrLastCall
                        return ret;
                    }else{
                        return; //否则就拦截
                    }
                }
            }
            _proxy_s.prototype._fcData = {
                fcName: fcName_ || "",
                origFcAddr: origFcAddr_ || null,
                newFcAddr: newFcAddr_ || null,
                newFcAddrLastCall: newFcAddrLastCall_ || null,
            };
            return _proxy_s;
        }
        generateMulti_OneToOneCall(This, key_) { //多层hook-正序-一对一调用
            function _proxy_m(...args){
                let prototype = _proxy_m.prototype;
                if(prototype.hasOwnProperty("_hk")) {
                    let hk = _proxy_m.prototype._hk;
                    let key = hk.key;
                    let hook = hk.obj;

                    let hookDataArray = hook.fcHookMap.get(key);
                    let ret;
                    let origArgs = [...args]; //复制数组
                    for (const [index, item] of hookDataArray.entries()) { //遍历多层hook
                        args.unshift(item.origFcAddr); //添加到数组开头
                        let lastCallArgs = [...args]; //复制数组
                        if(item.newFcAddr.length == 2) //根据模板函数实际参数个数，传入匹配的参数
                            args.splice(1, 0, undefined); //将undefined插入到数组第二个元素
                        let interceptor = item.newFcAddr.apply(this, args); //调用newFcAddr
                        if(interceptor == true || interceptor == undefined){
                            ret = item.origFcAddr.apply(this, origArgs); //调用原函数 //this是调用方传递的,也一并传递
                            if(item.newFcAddrLastCall && item.newFcAddrLastCall.length == 2) //根据模板函数实际参数个数，传入匹配的参数
                                lastCallArgs.splice(1, 0, ret); //将ret插入到数组第二个元素
                            if(item.newFcAddrLastCall)
                                item.newFcAddrLastCall.apply(this, lastCallArgs); //调用newFcAddrLastCall
                            if(index == hookDataArray.length -1){ //在多层hook结尾, 返回返回值
                                return ret;
                            }
                        }else{
                            return; //否则就拦截
                        }
                    }
                }
            }
            _proxy_m.prototype._hk = {
                key: key_ || "", 
                obj: This,
            };
            return _proxy_m;
        }
        generateMulti_ChainCall(This, key_) { //多层hook-正序-链式调用
            function _proxy_m(...args){
                let prototype = _proxy_m.prototype;
                if(prototype.hasOwnProperty("_hk")) {
                    let hk = _proxy_m.prototype._hk;
                    let key = hk.key;
                    let hook = hk.obj;

                    let hookDataArray = hook.fcHookMap.get(key);
                    let ret;
                    let origArgs = [...args]; //复制数组

                    let interceptor;
                    for (const [index, item] of hookDataArray.entries()) { //遍历多层hook
                        let args = [...origArgs]; //复制数组
                        args.unshift(item.origFcAddr); //添加到数组开头
                        let lastCallArgs = [...args]; //复制数组
                        if(item.newFcAddr.length == 2) //根据模板函数实际参数个数，传入匹配的参数
                            args.splice(1, 0, undefined); //将undefined插入到数组第二个元素
                        interceptor = item.newFcAddr.apply(this, args); //调用newFcAddr
                        if(interceptor == true || interceptor == undefined){
                            if(index < hookDataArray.length -1){ //如果没有遍历完成，则继续链式调用
                                continue;
                            }else{
                                ret = item.origFcAddr.apply(this, origArgs); //调用原函数 //this是调用方传递的,也一并传递
                                if(item.newFcAddrLastCall && item.newFcAddrLastCall.length == 2) //根据模板函数实际参数个数，传入匹配的参数
                                    lastCallArgs.splice(1, 0, ret); //将ret插入到数组第二个元素
                                if(item.newFcAddrLastCall)
                                    item.newFcAddrLastCall.apply(this, lastCallArgs); //调用newFcAddrLastCall
                                if(index == hookDataArray.length -1){ //在多层hook结尾, 返回返回值
                                    return ret;
                                }
                            }
                        }else{
                            return; //否则就拦截
                        }
                    }
                }
            }
            _proxy_m.prototype._hk = {
                key: key_ || "", 
                obj: This,
            };
            return _proxy_m;
        }
        generateMultiReverse_OneToOneCall(This, key_) { //多层hook-逆序-一对一调用
            function _proxy_mr(...args){
                let prototype = _proxy_mr.prototype;
                if(prototype.hasOwnProperty("_hk")) {
                    let hk = _proxy_mr.prototype._hk;
                    let key = hk.key;
                    let hook = hk.obj;

                    let hookDataArray = hook.fcHookMap.get(key);
                    let ret;
                    let origArgs = [...args]; //复制数组
                    for (let i = hookDataArray.length -1; i >= 0; i--) { //遍历多层hook
                        const item = hookDataArray[i];
                        args.unshift(item.origFcAddr); //添加到数组开头
                        let lastCallArgs = [...args]; //复制数组
                        if(item.newFcAddr.length == 2) //根据模板函数实际参数个数，传入匹配的参数
                            args.splice(1, 0, undefined); //将undefined插入到数组第二个元素
                        let interceptor = item.newFcAddr.apply(this, args); //调用newFcAddr
                        if(interceptor == true || interceptor == undefined){
                            ret = item.origFcAddr.apply(this, origArgs); //调用原函数 //this是调用方传递的,也一并传递
                            if(item.newFcAddrLastCall && item.newFcAddrLastCall.length == 2) //根据模板函数实际参数个数，传入匹配的参数
                                lastCallArgs.splice(1, 0, ret); //将ret插入到数组第二个元素
                            if(item.newFcAddrLastCall)
                                item.newFcAddrLastCall.apply(this, lastCallArgs); //调用newFcAddrLastCall
                            if(i == 0){ //在多层hook开头, 返回返回值
                                return ret;
                            }
                        }else{
                            return; //否则就拦截
                        }
                    }
                }
            }
            _proxy_mr.prototype._hk = {
                key: key_ || "", 
                obj: This,
            };
            return _proxy_mr;
        }
        generateMultiReverse_ChainCall(This, key_) { //多层hook-逆序-链式调用
            function _proxy_mr(...args){
                let prototype = _proxy_mr.prototype;
                if(prototype.hasOwnProperty("_hk")) {
                    let hk = _proxy_mr.prototype._hk;
                    let key = hk.key;
                    let hook = hk.obj;

                    let hookDataArray = hook.fcHookMap.get(key);
                    let ret;
                    let origArgs = [...args]; //复制数组
                    for (let i = hookDataArray.length -1; i >= 0; i--) { //遍历多层hook
                        let args = [...origArgs]; //复制数组
                        const item = hookDataArray[i];
                        args.unshift(item.origFcAddr); //添加到数组开头
                        let lastCallArgs = [...args]; //复制数组
                        if(item.newFcAddr.length == 2) //根据模板函数实际参数个数，传入匹配的参数
                            args.splice(1, 0, undefined);; //将undefined插入到数组第二个元素
                        let interceptor = item.newFcAddr.apply(this, args); //调用newFcAddr
                        if(interceptor == true || interceptor == undefined){
                            if(i > 0){ //如果没有遍历完成，则继续链式调用
                                continue;
                            }else{
                                ret = item.origFcAddr.apply(this, origArgs); //调用原函数 //this是调用方传递的,也一并传递
                                if(item.newFcAddrLastCall && item.newFcAddrLastCall.length == 2) //根据模板函数实际参数个数，传入匹配的参数
                                    lastCallArgs.splice(1, 0, ret); //将ret插入到数组第二个元素
                                if(item.newFcAddrLastCall)
                                    item.newFcAddrLastCall.apply(this, lastCallArgs); //调用newFcAddrLastCall
                                if(i == 0){ //在多层hook开头, 返回返回值
                                    return ret;
                                }
                            }
                        }else{
                            return; //否则就拦截
                        }
                    }
                }
            }
            _proxy_mr.prototype._hk = {
                key: key_ || "", 
                obj: This,
            };
            return _proxy_mr;
        }
    }

    class Hook {
        #proxyGenerator = new ProxyGenerator();
        #callType = CallType.Positive;
        constructor(proxyGenerator){
            if(proxyGenerator != undefined)
                this.setProxyGenerator = proxyGenerator;
            this.fcHookMap = new Map();
            //this.objHookMap = new Map();
        }
        set setProxyGenerator(proxyGenerator) {
            this.#proxyGenerator = proxyGenerator;
        }
        setCallType(callType) {
            this.#callType = callType;
            for (const [key, item] of this.fcHookMap) { //遍历map
                if(item.length > 1){ //排除单hook，因为单hook没有顺序区别
                    if(callType == CallType.Positive){
                        eval(`${key}=this.#proxyGenerator.generateMulti_ChainCall(this, '${key}')`); //替换
                        return true;
                    }else if(callType == CallType.Reverse){
                        eval(`${key}=this.#proxyGenerator.generateMultiReverse_ChainCall(this, '${key}')`); //替换
                        return true;
                    }else{
                        return false;
                    }
                }
            }
        }
        get getCallType(){
            return this.#callType;
        }
        //设置hook时,设置的是代理函数,然后在代理函数里调用newFcAddr
        //流程: 其他代码调用 fcAddr =>(实际调用) 代理函数 ->(里面先拿到原函数) 再调用newFcAddr ->(结束后根据返回值如果为true则调用原函数,并返回返回值,false就拦截)
        //如果newFcAddr没有返回值 (说明不使用拦截功能),就正常调用原函数,返回返回值
        //代理函数是动态生成的,并且代理函数里不能调用被hook的函数,不然会无限递归调用
        setSingleHook(fcAddrStr, newFcAddr, newFcAddrLastCall){
            if(!TypeUtils.isString(fcAddrStr)){
                Console.orig.log("setSingleHook()失败, fcAddrStr参数错误, 应该是字符串! 实际是: " + fcAddrStr);
                return false;
            }
            let fcAddr = eval(fcAddrStr);
            let type = TypeUtils.getType(fcAddr);
            let name = fcAddr.name;
            let key = fcAddrStr;
            if(TypeUtils.isFunction(fcAddr)){
                if(!this.fcHookMap.has(key)){
                    Console.orig.log("新fcHook: " + key);
                    this.fcHookMap.set(key, [{
                        fcName: name,
                        origFcAddr: fcAddr,
                        newFcAddr: newFcAddr,
                        newFcAddrLastCall: newFcAddrLastCall,
                    }]); //保存原始
                    eval(`${fcAddrStr}=this.#proxyGenerator.generateSingle('${name}', fcAddr, newFcAddr, newFcAddrLastCall)`); //替换
                    return true;
                }else{
                    //先取消hook,再重新单hook
                    let hookDataArray = this.fcHookMap.get(key);
                    this.unHookByNameOfSpecifyOrAll(fcAddrStr, hookDataArray[0].newFcAddr);
                    return this.setSingleHook(fcAddrStr, newFcAddr, newFcAddrLastCall);
                }
            }else{
                Console.orig.log("setSingleHook()失败, 不支持的type: " + type);
                return false;
            }
        }
        setHook(fcAddrStr, newFcAddr, newFcAddrLastCall){
            if(!TypeUtils.isString(fcAddrStr)){
                Console.orig.log("setHook()失败, fcAddrStr参数错误, 应该是字符串! 实际是: " + fcAddrStr);
                return false;
            }
            let fcAddr = eval(fcAddrStr);
            let type = TypeUtils.getType(fcAddr);
            let name = fcAddr.name;
            let key = fcAddrStr;
            if(TypeUtils.isFunction(type)){
                if(!this.fcHookMap.has(key)){
                    Console.orig.log("新fcHook: " + key);
                    this.fcHookMap.set(key, [{
                        fcName: name,
                        origFcAddr: fcAddr,
                        newFcAddr: newFcAddr,
                        newFcAddrLastCall: newFcAddrLastCall,
                    }]); //保存原始
                    eval(`${fcAddrStr}=this.#proxyGenerator.generateSingle('${name}', fcAddr, newFcAddr, newFcAddrLastCall)`); //替换
                    return true;
                }else{ //多层Hook
                    Console.orig.log("多层fcHook: " + key);
                    let hookDataArray = this.fcHookMap.get(key);
                    hookDataArray.push({
                        fcName: name,
                        origFcAddr: hookDataArray[0].origFcAddr,
                        newFcAddr: newFcAddr,
                        newFcAddrLastCall: newFcAddrLastCall,
                    }); //保存原始
                    this.fcHookMap.set(key, hookDataArray);
                    if(this.#callType == CallType.Positive){
                        eval(`${fcAddrStr}=this.#proxyGenerator.generateMulti_ChainCall(this, '${key}')`); //替换
                        return true;
                    }else if(this.#callType == CallType.Reverse){
                        eval(`${fcAddrStr}=this.#proxyGenerator.generateMultiReverse_ChainCall(this, '${key}')`); //替换
                        return true;
                    }
                }
            }else{
                Console.orig.log("setHook()失败, 不支持的type: " + type);
                return false;
            }
        }
        isHook(fcAddrStr){
            if(!TypeUtils.isString(fcAddrStr)){
                Console.orig.log("isHook()失败, fcAddrStr参数错误, 应该是字符串! 实际是: " + fcAddrStr);
                return false;
            }
            if(this.fcHookMap.has(fcAddrStr)){
                return true;
            }else{
                let fcAddr = eval(fcAddrStr);
                if(fcAddr == undefined){
                    return false;
                }
                let hash = CryptoJS.SHA1(fcAddr.toString().replace(/\s+/g, "")).toString();
                for (const [index, item] of this.#proxyGenerator.proxyInfo.entries()) {
                    if(item == hash) {
                        return true;
                    }
                }
                return false;
            }
        }
        getHookType(fcAddrStr){
            if(!TypeUtils.isString(fcAddrStr)){
                Console.orig.log("getHookType()失败, fcAddrStr参数错误, 应该是字符串! 实际是: " + fcAddrStr);
                return false;
            }
            const hookDataArray = this.fcHookMap.get(fcAddrStr);
            if(hookDataArray != undefined) {
                return hookDataArray.length == 1 ? HookType.Single : HookType.Multi;
            }else{
                return null;
            }
        }
        #unHookCommon_unload(fcAddrStr, hookData, hookDataArray, i){
            if(hookDataArray.length == 1){ //单hook 或 只有1个元素
                eval(`${fcAddrStr}=hookData.origFcAddr`); //还原
                this.fcHookMap.delete(fcAddrStr);
                return true;
            }else{ //多层
                hookDataArray.splice(i, 1); //删除当前记录
                this.fcHookMap.set(fcAddrStr, hookDataArray);
                return true;
            }
        }
        #unHookCommon_mode(fcAddrStr, newFcAddr, hookData, hookDataArray, i){
            if(newFcAddr != undefined && hookData.newFcAddr == newFcAddr){ //unHookByName //取消指定key某一层hook
                return this.#unHookCommon_unload(fcAddrStr, hookData, hookDataArray, i);
            }else if(newFcAddr == undefined){ //unAllHookByName //取消指定key下的所有hook
                return this.#unHookCommon_unload(fcAddrStr, hookData, hookDataArray, i);
            }
        }
        //取消hook, 主要针对多层hook
        //unHook(key, 新函数地址)
        //unHook(key)
        //如果指定newFcAddr, 则取消指定key某一层hook
        //如果只指定fcAddrStr, 则取消指定key下的所有hook
        unHookByNameOfSpecifyOrAll(fcAddrStr, newFcAddr){
            if(!TypeUtils.isString(fcAddrStr)){
                Console.orig.log("unHookByNameOfSpecifyOrAll()失败, fcAddrStr参数错误, 应该是字符串! 实际是: " + fcAddrStr);
                return false;
            }
            if(this.isHook(fcAddrStr)){
                let fcAddr = eval(fcAddrStr);
                let type = TypeUtils.getType(fcAddr);
                let key = fcAddrStr;
                if(TypeUtils.isFunction(type)){
                    if(this.fcHookMap.has(key)){
                        let hookDataArray = this.fcHookMap.get(key);
                        for (let i = hookDataArray.length -1; i >= 0; i--) { //逆序遍历
                            const hookData = hookDataArray[i];
                            let ret = this.#unHookCommon_mode(fcAddrStr, newFcAddr, hookData, hookDataArray, i);
                            if(newFcAddr != undefined && ret){ //单unHook, 并且执行成功, 则直接返回
                                return true;
                            }else if(newFcAddr == undefined && i == 0){ //否则是 取消指定key下的所有hook, 就判断是否循坏完成, 循坏完成后返回
                                return true;
                            }
                        }
                        Console.orig.log("unHook()失败, 找到hook, 但是实参newFcAddr有误: " + newFcAddr.name);
                        return false;
                    }else{
                        Console.orig.log("unHook()失败, 找到hook, 但是实参key有误: " + key);
                        return false;
                    }
                }else{
                    Console.orig.log("unHook()失败, 不支持的type: " + type);
                    return false;
                }
            }else{
                Console.orig.log("unHook()失败, 找不到指定的hook!");
                return false;
            }
        }
        unAllHook(){ //取消所有
            for (const [key, hookDataArray] of this.fcHookMap) { //遍历map
                for (let i = hookDataArray.length -1; i >= 0; i--) { //逆序遍历
                    const hookData = hookDataArray[i];
                    this.#unHookCommon_mode(key, undefined, hookData, hookDataArray, i);
                }
            }
            return true;
        }
    }

    class DynamicProxy {
        //DynamicProxy.apply(mainObj.perfor, "getEndTime"); //间接调用
        static apply(obj, fcName, ...args) { //执行目标对象的方法(对象, 方法名, 方法参数)
            let prototype = Object.getPrototypeOf(obj);
            if(prototype.hasOwnProperty(fcName)) {
                return eval("prototype." + fcName).apply(obj, args);
            }
        }
        static autoWired(mainObj, targetClass, CallBack) { //依赖注入
            for (const [name, value] of Object.entries(mainObj)) { //遍历对象获取指定类型的属性, 属性的类型通过参数传入
                if(value instanceof targetClass){
                    return CallBack(name, value); //CallBack(属性名, 属性值)
                }
            }
            return null;
        }
    }

    class CodeTemplate {
        static hook = new Hook();
        static autoWiredProxy(mainObj, executeFcName){ //依赖注入代理
            return DynamicProxy.autoWired(mainObj, Performance, (name, value)=>{
                //使用这个属性调用apply实现具体的功能
                DynamicProxy.apply(value, executeFcName); //apply(属性值(对象), 要执行的方法)
                return true;
            });
        }
        static autoWired_Performance(fcAddrStr, mainObj){
            if(CodeTemplate.hook.isHook(fcAddrStr)){
                Console.warn(`${fcAddrStr}已注入${mainObj.name}, 请勿重复调用!`);
                return false;
            }
            const fcStartStub = (origFcAddr, ...args)=>{
                if(CodeTemplate.autoWiredProxy(mainObj, "setStartTime") == null){ //依赖注入
                    Debug.globalOutputErrorHandle("autoWiredProxy()失败!", "返回值为null.");
                }
            };
            const fcEndStub = (origFcAddr, ret, ...args)=>{
                if(CodeTemplate.autoWiredProxy(mainObj, "getEndTime") == null){ //依赖注入
                    Debug.globalOutputErrorHandle("autoWiredProxy()失败!", "返回值为null.");
                }
            };
            CodeTemplate.hook.setSingleHook(fcAddrStr, fcStartStub, fcEndStub);
        }
    }

    const URLTYPE = {__proto__: null,
        LINK: 1, //链接
        FUZZYMATCH: 1 << 1, //模糊匹配
        RegExp: 1 << 2, //正则表达式
    }

    class URL {
        static test(testURL, urlTYPE, urlRule) {
            if(urlTYPE == URLTYPE.LINK){
                return urlRule.includes(testURL); //子串
            }else if(urlTYPE == URLTYPE.FUZZYMATCH){
                let targetURL = urlRule;
                //转义可能的特殊字符 //\和/这种字符必须首先执行 //*和?这种通配符放在后面单独处理
                let specharsArray = ['\\', '/', '[', ']', '(', ')', '{', '}', '^', '$', '-', '.', '+', '|', ',', ':', '=', '!', '<', '%'];
                specharsArray.forEach((item,index)=> {
                    targetURL = targetURL.replaceAll(item, '\\' + item);
                });
                //替换通配符 //?必须比*先执行
                targetURL = targetURL.replaceAll("?", "[\\s\\S]?");
                targetURL = targetURL.replaceAll("*", "([\\s\\S]+)?");
                //测试URL
                let regExp = new RegExp(targetURL);
                return regExp.test(testURL);
            }else if(urlTYPE == URLTYPE.RegExp){
                return urlRule.test(testURL);
            }
        }
    }

    class PageCallBack {
        static #css_layui_ruleSet = new Map([
            //重定向字体文件
            ["url(../", "url(https://cdn.staticfile.org/layui/2.8.17/"]
        ]);
        static #css_fontAwesome_ruleSet = new Map([
            //重定向字体文件(这里有些带"，有些不带")
            ['url("../', 'url("https://cdn.staticfile.org/font-awesome/6.4.2/'],
            ['url(../', 'url(https://cdn.staticfile.org/font-awesome/6.4.2/']
        ]);
        static #js_layui_ruleSet = new Map([
            //解决动态添加的节点与css兼容性的问题
            ['class="', `class="${cssIDNP} `]
        ]);
        //---------- 通用 ----------
        static init(){
            //加载库-css
            Utils.addNewStyle("css_fontAwesome", CustomUtils.handleCSSCompatibility(null, GM_getResourceText("css_fontAwesome"), PageCallBack.#css_fontAwesome_ruleSet));
            Utils.addNewStyle("css_layui", CustomUtils.handleCSSCompatibility(cssID, GM_getResourceText("css_layui"), PageCallBack.#css_layui_ruleSet));
            Utils.addNewStyle("css_elementplus", GM_getResourceText("css_elementplus"));

            //加载自定义-css
            Utils.addNewStyle("commonCSS", commonCSS);
            Utils.addNewStyle("pageExtendBaseCSS", pageExtendBaseCSS);
            Utils.addNewStyle("MainAppBaseCSS", MainAppBaseCSS);
            Utils.addNewStyle("MainAppCSS", MainAppCSS);

            //加载库-js
            Utils.addNewScript("js_localforage", GM_getResourceText("js_localforage"));
            Utils.addNewScript("js_layui", CustomUtils.handleJSCompatibility(cssID, GM_getResourceText("js_layui"), PageCallBack.#js_layui_ruleSet));
            Utils.addNewScript("js_vue",  GM_getResourceText("js_vue"));
            Utils.addNewScript("js_elementplus", GM_getResourceText("js_elementplus"));

            //预初始化
            UI.init();
        }
        static async ready() {
            //执行初始化
            localforage.config({
                name: 'MortalApp',
                storeName: 'AppDB',
                version: '1.0',
                description: 'default database',
            });

            //读取设置
            let jsonStr = await DBConfig.readConfig("globalSettings"); //从数据库中读取配置
            if(jsonStr != null) {
                let obj = JSON.parse(jsonStr);
                if(TypeUtils.isOrigObjByType(obj)){
                    let result = CustomUtils.compareVersion(globalSettings.BaseInfo.curVersion, obj.BaseInfo.curVersion);
                    if(result == 1){ //如果更新了新版本
                        //优先迁移数据库
                        Console.orig.log("版本更新, 尝试迁移数据库...");

                        //迁移失败时, 重置数据库
                        Console.orig.log("版本更新, 数据库迁移失败! 需要重置数据库...");
                        await DBConfig.clear(); //重置数据库
                    }else if(result == -1){ //如果回退了旧版本
                        //优先迁移数据库
                        Console.orig.log("版本回退, 尝试迁移数据库...");

                        //迁移失败时, 重置数据库
                        Console.orig.log("版本回退, 数据库迁移失败! 需要重置数据库...");
                        await DBConfig.clear(); //重置数据库
                    }else{
                        globalSettings = obj;
                        Console.orig.log("已读取设置: globalSettings");
                    }
                }else{
                    Console.orig.error("无法识别数据库中的数据: globalSettings, 需要重置数据库...");
                    await DBConfig.clear(); //重置数据库
                }
            }else{
                Console.orig.log("数据库中没有 globalSettings 数据!");
            }
        }

        static async end() {
            UI.setValueByLoadingProgress(100);
            UI.setShowLoadingProgress(false);
            UI.setShowLoadingAnimation(false);
        }
    }

    class ReportCallBack extends PageCallBack {
        //---------- 详细页 ----------
        static async init() {
            super.init();

            //加载模板
            // Utils.addElementsByHTMLTemplateText(bottomRightShowBox);
            // Utils.addElementsByHTMLTemplateText(settingUITemplate);
            Utils.addElementsByHTMLTemplateText(catalogUIBase);

            return await ReportCallBack.ready();
        }
        static async ready() {
            await super.ready();
            PageExtend.init();
            MainApp.init();

            UI.setValueByLoadingProgress(10);
            return true;
        }
        static async run() {
            if(!globalSettings.Other.safeMode) {
                await PageExtend.run();
                await MainApp.run();
            }
            return await ReportCallBack.end();
        }
        static async end() {
            await super.end();
            return true;
        }
    }

    class MainPageCallBack extends PageCallBack {
        //---------- 主页 ----------
        static async init() {
            super.init();
            
            //加载模板


            return await MainPageCallBack.ready();
        }
        static async ready() {
            await super.ready();

            UI.setValueByLoadingProgress(10);
            return true;
        }
        static async run() {
            if(!globalSettings.Other.safeMode) {
                //修复原页面bug: 在主页输入一番街牌谱或自定义牌谱后进入牌谱解析页面，再后退回到主页时，不显示对应的输入框
                let radioEle = document.querySelectorAll('[type="radio"][name="input-method"]');
                for (let i = 0; i < radioEle.length; i++) {
                    const ele = radioEle[i];
                    if(ele.checked){
                        ele.onchange();
                        break;
                    }
                }

                document.getElementsByName("show-rating").forEach((ele)=>{ele.checked = true}); //默认勾选 显示Rating

                const map = new Map();
                let childEle = document.getElementById("mortal-model-tag").children;
                for (let i = 0; i < childEle.length; i++) {
                    const ele = childEle[i];
                    map.set(ele.value, ele.innerText); //将数据保存到map
                }
                const jsonStr = JSON.stringify(Object.fromEntries(map));
                try {
                    // 存储不同语言的 Mortal 版本
                    const pageLanguage = g_origLang;
                    let allMap;
                    let allJsonStr = await localforage.getItem("Mortal_All");
                    if(allJsonStr == null) {
                        allMap = new Map();
                    } else{
                        allMap = new Map(Object.entries(JSON.parse(allJsonStr)));
                    }
                    allMap.set(pageLanguage, map);
                    allJsonStr = JSON.stringify(Object.fromEntries(allMap));

                    //牌谱解析页面，默认使用最新的Mortal
                    await localforage.setItem("Mortal_New", childEle[0].value);
                    await localforage.setItem("Mortal_Type", jsonStr);
                    await localforage.setItem("Mortal_All", allJsonStr);
                } catch (err) {
                    Console.orig.error("存储数据时发生错误: \n" + err);
                }
            }
            return await MainPageCallBack.end();
        }
        static async end() {
            await super.end();
            return true;
        }
    }

    class App {
        static perfor = new Performance("dom");
        static URLRuleSet = [{
                name: "牌谱解析页面",
                url: /^https?:\/\/mjai.ekyu.moe\/report\/[A-Za-z0-9-_]+.html/,
                urlType: URLTYPE.RegExp,
                exclude: [
                ],
                usabilityTest: [
                    "document.body.children.length <= 5 || document.body.firstChild.tagName == 'PRE'",
                ],
                init: ReportCallBack.init,
                entry: ReportCallBack.run,
            },{
                name: "主页",
                url: /^https?:\/\/mjai.ekyu.moe\/?([A-Za-z0-9-_]+.html)?/,
                urlType: URLTYPE.RegExp,
                exclude: [
                    //排除主动访问非页面URL的内容，比如图片等
                    /^https?:\/\/mjai.ekyu.moe\/?([A-Za-z0-9-_]+)?\/?[A-Za-z0-9-_]+.(?!.*(html|htm|jsp|php|asp))/,
                ],
                usabilityTest: [
                ],
                init: MainPageCallBack.init,
                entry: MainPageCallBack.run,
            },
        ]; //URL规则集
        constructor(){
            this.isRun = false;
            this.init();
        }
        async init() {
            document.addEventListener('readystatechange', async (event) => {
                if (event.target.readyState === 'interactive') {
                    App.perfor.setStartTime();
                    //Console.orig.log('interactive');
                    await this.yun(); //chrome第一次在这里触发
                    //initLoader();
                }
                else if (event.target.readyState === 'complete') {
                    App.perfor.getEndTime();
                    //Console.orig.log('complete');
                    await this.yun(); //firefox第一次在这里触发
                    //initApp();
                }
            });
            if(document.readyState == 'complete'){ //如果页面已经加载完成 (正常情况下不会触发)
                await this.yun();
            }
            window.addEventListener("beforeunload", async (event) => { //在页面关闭或刷新之前
                //保存设置
                // await DBConfig.SaveConfig("globalSettings", globalSettings); //保存配置到数据库
                //判断是否需要提示确认退出
                if(globalStatus.globalExitConfirm) {
                    event.preventDefault();
                    event.returnValue = "";
                }
            });
            return true;
        }
        async yun(){
            if(this.isRun) //只能运行一次
                return;
            this.isRun = true;
            let isExclude = false, isUnavailable = false;
            for (const [index, item] of App.URLRuleSet.entries()) {
                let currentURL = window.location.origin + window.location.pathname;
                if(URL.test(currentURL, item.urlType, item.url)){ //测试URL是否匹配
                    if(item.exclude.length > 0){
                        for (const [i, excludeItem] of item.exclude.entries()) {
                            if(URL.test(currentURL, item.urlType, excludeItem)){ //测试URL是否被排除
                                isExclude = true;
                                break;
                            }
                        }
                    }
                    if(item.usabilityTest.length > 0){
                        for (const [i, testItem] of item.usabilityTest.entries()) { //测试可用性
                            if(eval(testItem)){
                                isUnavailable = true;
                                break;
                            }
                        }
                    }

                    if(!isExclude && !isUnavailable){
                        if(await item.init.apply())
                            await item.entry.apply();
                    }
                    return;
                }
            }
        }
    }

    class UI {
        static loadingAnimation = {
            isShowLoadingAnimation: true,
            loadIndex: 0,
        }
        static loadingProgress = {
            isShowLoadingProgress: true,
            value: 0,
        }
        static init(){

            if(globalSettings.AppSettings.loading.isShowLoadingProgress){
                //加载模板
                Utils.addElementsByHTMLTemplateText(loadingUITemplate);
                //渲染进度条组件
                layui.element.render('progress', 'loading-filter-progress');
            }

            if(globalSettings.AppSettings.loading.isShowLoadingAnimation){
                UI.setShowLoadingAnimation(true);
            }
        }

        static setShowLoadingAnimation(isShow) {
            UI.loadingAnimation.isShowLoadingAnimation = isShow;

            layui.use(function(){
                let layer = layui.layer;
                
                if(isShow){
                    UI.loadingAnimation.loadIndex = layer.load(2); //显示加载动画
                }else{
                    layer.close(UI.loadingAnimation.loadIndex); //关闭加载动画
                }
            });
        }

        static setShowLoadingProgress(isShow) {
            UI.loadingProgress.isShowLoadingProgress = isShow;
            let loadingProgress = document.getElementById("loadingProgress");

            if(isShow){
                loadingProgress.style.display = "block";
            }else{
                setTimeout(()=>{
                    loadingProgress.style.display = "none";
                }, 500);
            }
        }

        static setValueByLoadingProgress(value) {
            if(value>100)
                value=100;
            else if(value<0)
                value=0;

            UI.loadingProgress.value = value;

            layui.element.progress('loading-filter-progress', `${value}%`); // 设置进度值
        }

        static addValueByLoadingProgress(value) {
            if(value>100)
                value=100;
            else if(value<0)
                value=0;

            layui.element.progress('loading-filter-progress', (UI.loadingProgress.value + value) + '%'); // 设置进度值
        }
    }

    // ---------------------------- 功能定义 ----------------------------
    class MortalBase {
        constructor(){
        }
        static init(){
            return true;
        }
        static run(){

        }
        static stop(){

        }
        static clean(){

        }
    }

    const OUTSTYLE = {__proto__: null,
        A: 1,
        B: 1 << 1,
        C: 1 << 2,
    }

    let strArray2 = []; //恶手选择器
    let strArray3 = []; //不一致选择器

    class PageExtend extends MortalBase {
        static perfor = new Performance("PageExtend");
        //
        static badChooseNum = 0;
        static badChooseNumCustom = 0;
        constructor(){
            //super();
        }
        static init(){
            //Console.orig.log("PageExtend.init()");
            if(Debug.getDebug){
                CodeTemplate.autoWired_Performance("PageExtend.run", PageExtend);
            }
            return true;
        }
        static async run(){
            //Console.orig.log("PageExtend.run()");
            const [result1, result2, result3] = 
                               //显示恶手 (收集数据)         //起始信息详细化 (独立) (重要)  //列出选择权重 (独立)
            (await Promise.all([PageExtend.showBadChoose(), PageExtend.showStartInfo(), PageExtend.showChooseWeight()]
            .map(item => item.catch(err => Debug.globalErrorHandle(err))) //每个并发请求使用catch进行对应异常的处理，防止某个请求失败后，影响到其他函数执行
            ));
            //Console.orig.log(result1, result2, result3);
            //修改 元数据 选项卡 (数据统计需要在showBadChoose()之后执行)
            await PageExtend.alterMetaData().catch(err => Debug.globalErrorHandle(err));
        }
        static stop(){

        }
        static clean(){

        }
        //显示恶手
        static async showBadChoose() {
            //Console.orig.log("MainApp.showBadChoose()");
            const getData = (strArray3, collapseEntry, kyokuTitleEle, summary, badChooseType) => {
                //收集数据2-不一致
                let nameID = "discord-" + strArray3.length;
                collapseEntry.setAttribute("name", nameID + "-main"); //设置子项name
                strArray3.push({
                    name: kyokuTitleEle.textContent + " " + summary.textContent,
                    parentHref: kyokuTitleEle.href.match(/#[\S\s]+$/)[0],
                    badChooseType: badChooseType,
                    //name: nameID + "-main", //name
                    type: "name",
                    nameID: nameID
                });
            };

            const orderLossEleArray = document.getElementsByClassName("order-loss");

            for (let i = 0; i < orderLossEleArray.length; i++) {
                const orderLoss = orderLossEleArray[i];

                const nChooseIndex = parseInt(orderLoss.innerText.match(/[\d]+/)[0]);
                const nChooseSum = parseInt(orderLoss.nextSibling.textContent.match(/[\d]+/)[0]);

                const turnInfo = orderLoss.parentElement;
                const summary = turnInfo.parentElement;
                const collapseEntry = summary.parentElement;

                const table = collapseEntry.lastChild.firstChild;
                const tbody = table.lastChild;

                const nChooseTR = tbody.childNodes[nChooseIndex -1];
                const nChooseWeightTD = nChooseTR.lastChild;
                const chosenWeight = parseFloat(nChooseWeightTD.innerHTML.replace(/<.*?>/g, "")); //过滤html标签, 只保留文字内容

                const kyokuTitleEle = collapseEntry.parentElement.parentElement.firstChild.getElementsByTagName("a")[0];

                if (chosenWeight <= parseFloat(globalSettings.Config.badMoveUpperLimit)) { //严重恶手
                    const badChooseNode = document.createElement("span");
                    badChooseNode.classList.add("badChoose");
                    badChooseNode.classList.add("level1");
                    badChooseNode.innerHTML = ` \u00A0\u00A0\u00A0${i18nText.badMove}${i18nText.badMoveUp}`;
                    turnInfo.appendChild(badChooseNode);

                    collapseEntry.classList.add("collapseEntryL1");

                    PageExtend.badChooseNum++;

                    //收集数据3-恶手
                    let nameID = "badChoose-1-" + strArray2.length;
                    collapseEntry.id = nameID + "-main"; //设置子项id
                    strArray2.push({
                        name: kyokuTitleEle.textContent + " " + summary.textContent,
                        parentHref: kyokuTitleEle.href.match(/#[\S\s]+$/)[0],
                        badChooseType: 1,
                        //id: nameID + "-main", //id
                        type: "id",
                        nameID: nameID
                    });
                    getData(strArray3, collapseEntry, kyokuTitleEle, summary, 1);
                }else if (chosenWeight <= parseFloat(globalSettings.Config.badMoveUpperLimitCustom)) { //普通恶手
                    const badChooseNode = document.createElement("span");
                    badChooseNode.classList.add("badChoose");
                    badChooseNode.classList.add("level2");
                    badChooseNode.innerHTML = ` \u00A0\u00A0\u00A0${i18nText.badMove}${i18nText.badMoveDown}`;
                    turnInfo.appendChild(badChooseNode);

                    collapseEntry.classList.add("collapseEntryL2");

                    PageExtend.badChooseNumCustom++;

                    //收集数据3-恶手
                    let nameID = "badChoose-2-" + strArray2.length;
                    collapseEntry.id = nameID + "-main"; //设置子项id
                    strArray2.push({
                        name: kyokuTitleEle.textContent + " " + summary.textContent,
                        parentHref: kyokuTitleEle.href.match(/#[\S\s]+$/)[0],
                        badChooseType: 2,
                        //id: nameID + "-main", //id
                        type: "id",
                        nameID: nameID
                    });
                    getData(strArray3, collapseEntry, kyokuTitleEle, summary, 2);
                }else{
                    getData(strArray3, collapseEntry, kyokuTitleEle, summary);
                }

            } //for
            //Console.orig.log("end MainApp.showBadChoose()");
            UI.addValueByLoadingProgress(20);
        }
        //修改 元数据 选项卡
        static async alterMetaData() {
            //Console.orig.log("MainApp.alterMetaData()");
            let mortalMap = null;
            let mortal_New = null;
            let allMap = null;
            try {
                // 获取不同语言的 Mortal 版本
                let allJsonStr = await localforage.getItem("Mortal_All");
                if(allJsonStr != null) {
                    allMap = new Map(Object.entries(JSON.parse(allJsonStr)));
                }
                // 新增 显示 Mortal 版本
                const jsonStr = await localforage.getItem("Mortal_Type");
                mortal_New = await localforage.getItem("Mortal_New");
                if(jsonStr != null) {
                    let obj = Object.entries(JSON.parse(jsonStr));
                    mortalMap = new Map(obj);
                }
            } catch (err) {
                Console.orig.error("获取数据时发生错误: \n" + err);
            }

            // 修改 元数据 选项卡
            let metaData = null;
            const detailsElements = document.getElementsByTagName("details");
            for (let i = 0; i < detailsElements.length; i++) {
                const details = detailsElements[i];
                const summary = details.firstChild;
                if (summary.firstChild.textContent == i18nText.metaData) {
                    metaData = details;
                    metaData.toggleAttribute("open", true); //打开 元数据 选项卡
                    break;
                }
            }
            const metaDataDL = metaData.lastChild;
            let matchRatioDD = null;
            let version = null;
            for (let i = 0; i < metaDataDL.childNodes.length; i++) {
                const metaDataChild = metaDataDL.childNodes[i];
                if(metaDataChild.nodeName == "DT" && metaDataChild.textContent == i18nText.modelTag) {
                    let ele = metaDataDL.childNodes[i + 1];
                    
                    //判断当前是否是最新版本的mortal
                    if(mortalMap != null) {
                        let mortalValue = mortalMap.get(ele.innerText);
                        if(mortalValue != undefined) {
                            let currVer = mortalValue.match('(?<=").*?(?=")')[0]; //匹配引号里的内容
                            if(CustomUtils.compareVersion(currVer, "3.1") == -1) {
                                let aiEle = metaDataDL.childNodes[i - 1];
                                aiEle.classList.add("color1");
                                aiEle.innerText = aiEle.innerText + ` \u00A0\u00A0\u00A0${i18nText.badMoveError}`;
                            }
                        }
                    }
                    //处理当前版本
                    const oldHandle = ()=>{ //设置为上次访问主页记录的数据
                        if(mortalMap != null) {
                            let mortalValue = mortalMap.get(ele.innerText);
                            if(mortalValue != undefined) {
                                ele.innerText = mortalValue;
                            }
                        }
                    }
                    //设置为之前访问主页记录的多语言数据
                    const pageLanguage = g_origLang;
                    if(allMap != null) {
                        let targetMortalMap = allMap.get(pageLanguage);
                        if(targetMortalMap != undefined){
                            let mortalValue = targetMortalMap.get(ele.innerText);
                            if(mortalValue != undefined) {
                                ele.innerText = mortalValue;
                            }
                        }else{ //目标数据中没有目标语言
                            oldHandle();
                        }
                    }else{ //没有目标数据
                        oldHandle();
                    }
                    
                }
                if (metaDataChild.nodeName == "DT" && metaDataChild.textContent == i18nText.matchRatio) {
                    matchRatioDD = metaDataDL.childNodes[i + 1];
                    version = metaDataDL.childNodes[i + 2];
                    //
                    metaDataDL.childNodes[i-2].classList.add("color2"); //rating
                    metaDataDL.childNodes[i-1].classList.add("color2");
                    metaDataDL.childNodes[i].classList.add("color2"); //AI 一致率
                    metaDataDL.childNodes[i+1].classList.add("color2");
                    break;
                }
            }
            const matchRatioText = matchRatioDD.textContent;
            const chooseNumStr = matchRatioText.substring(matchRatioText.indexOf("/") + 1);
            const chooseNum = parseInt(chooseNumStr);

            const badChooseRatioDT = document.createElement("dt");
            badChooseRatioDT.classList.add("color3");
            badChooseRatioDT.innerHTML = `${i18nText.badMoveRatio} ${globalSettings.Config.badMoveUpperLimit}%`;
            
            const badChooseRatioDD = document.createElement("dd");
            badChooseRatioDD.classList.add("color3");
            badChooseRatioDD.innerHTML = `${PageExtend.badChooseNum}/${chooseNum} = ${(100 * PageExtend.badChooseNum / chooseNum).toFixed(3)}%`;
            metaDataDL.insertBefore(badChooseRatioDD, version);
            metaDataDL.insertBefore(badChooseRatioDT, badChooseRatioDD);

            /* 新增 计算总恶手数 */
            PageExtend.badChooseNumCustom += PageExtend.badChooseNum; //计算总恶手数

            const badChooseRatioDT2 = document.createElement("dt");
            badChooseRatioDT2.classList.add("color3");
            badChooseRatioDT2.innerText = `${i18nText.badMoveRatio} ${globalSettings.Config.badMoveUpperLimitCustom}%`;
            
            const badChooseRatioDD2 = document.createElement("dd");
            badChooseRatioDD2.classList.add("color3");
            badChooseRatioDD2.innerHTML = `${PageExtend.badChooseNumCustom}/${chooseNum} = ${(100 * PageExtend.badChooseNumCustom / chooseNum).toFixed(3)}%`;
            
            metaDataDL.insertBefore(badChooseRatioDD2, version);
            metaDataDL.insertBefore(badChooseRatioDT2, badChooseRatioDD2);
            //Console.orig.log("end MainApp.alterMetaData()");
            UI.addValueByLoadingProgress(10);
        }
        //起始信息详细化
        static async showStartInfo() {
            //Console.orig.log("MainApp.showStartInfo()");
            /* 起始信息详细化 */
            function parmeHandle(eastScoreChange, southScoreChange, westScoreChange, northScoreChange) {
                let scoreArray = [{sc: eastScoreChange, i: 0}, {sc: southScoreChange, i: 1}, {sc: westScoreChange, i: 2}, {sc: northScoreChange, i: 3}];
                let newScoreArray = scoreArray.filter((obj) => {
                    return obj.sc != 0;
                });
                let scoreAddArray = newScoreArray.filter((obj) => { //荣和的玩家
                    return obj.sc > 0;
                });
                let scoreSubArray = newScoreArray.filter((obj) => { //放铳的玩家
                    return obj.sc < 0;
                });
                scoreAddArray.sort((a,b)=>{return b.sc-a.sc});

                return {scoreArray: scoreArray, newScoreArray: newScoreArray, scoreAddArray: scoreAddArray, scoreSubArray: scoreSubArray};
            }

            function handleRon(kyoku, startPlayerIndex, eastScoreChange, southScoreChange, westScoreChange, northScoreChange) { //处理荣和
                let obj = parmeHandle(eastScoreChange, southScoreChange, westScoreChange, northScoreChange);
                let scoreAddArray = obj.scoreAddArray;
                let scoreSubArray = obj.scoreSubArray;
                let selfPlayerIndex = MJCommonUtils.getPlayerIndexByPlayerSeatName(MJCommonUtils.getPlayerSeatNameByPlayerIndex(startPlayerIndex, kyoku, OUTSTYLE.B), OUTSTYLE.B);
                //
                let str = "";
                for (let i = 0; i < scoreAddArray.length; i++) {
                    const scoreAdd = scoreAddArray[i];

                    let scAddPlayerSeatName = MJCommonUtils.getPlayerSeatNameByPlayerIndex(scoreAdd.i, kyoku, OUTSTYLE.B); //荣和的玩家
                    let scAddPlayerViewName = MJCommonUtils.getSelfViewPlayerNameByTargetPlayerIndex(selfPlayerIndex, MJCommonUtils.getPlayerIndexByPlayerSeatName(scAddPlayerSeatName, OUTSTYLE.B));

                    let scSubPlayerSeatName = MJCommonUtils.getPlayerSeatNameByPlayerIndex(scoreSubArray[0].i, kyoku, OUTSTYLE.B); //放铳的玩家
                    let scSubPlayerViewName = MJCommonUtils.getSelfViewPlayerNameByTargetPlayerIndex(selfPlayerIndex, MJCommonUtils.getPlayerIndexByPlayerSeatName(scSubPlayerSeatName, OUTSTYLE.B));

                    str += `${scAddPlayerSeatName} (${scAddPlayerViewName}) ` + 
                    `<span class="color4">${i18nText.Ron}</span> ${scSubPlayerSeatName} (${scSubPlayerViewName}) +${scoreAdd.sc} ${scoreSubArray[0].sc}`;
                }

                return str;
            }
            function handleTsumo(kyoku, startPlayerIndex, eastScoreChange, southScoreChange, westScoreChange, northScoreChange) { //处理自摸
                
            }
            function handleRyuukyoku(kyoku, startPlayerIndex, eastScoreChange, southScoreChange, westScoreChange, northScoreChange) { //处理流局
                
            }
            
            const summaryEle = document.getElementsByClassName("kyoku-toc")[0];
            if(summaryEle == undefined)
                return;
            summaryEle.classList.add("position_re");
            for (let j = 0; j < summaryEle.children.length; j++) {
                const summary = summaryEle.children[j];
                summary.classList.add("min-w-20"); //
            }
            summaryEle.children[1].classList.add("position_ab");
            summaryEle.children[1].classList.add("l-196px"); //
            const kyokuEle = summaryEle.getElementsByTagName("a");
            const endInfoEle = summaryEle.getElementsByClassName("end-status");
            //
            const section = document.getElementsByTagName("section");
            for (let i = 0, length = section.length; i != length; ++i) {
                const titleEle = section[i].children[0];
                const titleKyokuEle = titleEle.getElementsByTagName("a"); //只有1个元素
                const titleEndInfoEle = titleEle.getElementsByClassName("end-status"); //只有1个元素

                const tenhouData = section[i].getElementsByTagName("iframe")[0].src;
                const playerIndexStr = tenhouData.match(/tw=[0-3]/)[0];
                const startPlayerIndex = parseInt(playerIndexStr.substring(playerIndexStr.length -1)); //起始玩家索引
                const json = JSON.parse(decodeURI(tenhouData.substring(tenhouData.indexOf("{")))); //天凤对局数据
                const kyoku = json.log[0][0][0]; //局数
                const count = json.log[0][0][1]; //本场数
                const currScore = json.log[0][1]; //当前点数
                const scoreChange = json.log[0][json.log[0].length -1]; //点数变动
                const endMode = scoreChange[0];

                //解析规则
                if(matchRule.isInit == false) {
                    const disp = json.rule.disp;

                    if(disp.indexOf("間") != -1) { //雀魂
                        matchRule.isRon3 = true;
                        //Console.orig.log("雀魂牌谱");
                    }else if(disp.indexOf("Player") != -1) { //一番街
                        matchRule.isRon3 = false;
                        //Console.orig.log("一番街牌谱");
                    }else{ //默认为天凤
                        matchRule.isRon3 = false;
                        //Console.orig.log("默认为天凤牌谱(包括自定义牌谱)");
                    }
                    matchRule.isInit = true;
                }

                //四家当前分数
                const eastScore = currScore[0]; //东
                const southScore = currScore[1]; //南
                const westScore = currScore[2]; //西
                const northScore = currScore[3]; //北
                //四家分数变化(直接) //送棒的-1000没有显示
                let eastScoreChange = [];
                let southScoreChange = [];
                let westScoreChange = [];
                let northScoreChange = [];

                let ronCount = (scoreChange.length -1) / 2;
                if(scoreChange.length > 1) { //比如九种九牌, 是没有分数变化的数据的
                    //是否有多家荣和
                    for (let j = 0; j < ronCount; j++) { //处理可能的多家荣和
                        eastScoreChange.push(scoreChange[1+ j*2][0]); //东
                        southScoreChange.push(scoreChange[1+ j*2][1]); //南
                        westScoreChange.push(scoreChange[1+ j*2][2]); //西
                        northScoreChange.push(scoreChange[1+ j*2][3]); //北
                    }
                }
                //判断模式
                if(endMode == tenhouText.Ron) { //自摸、荣和
                    let str = "";
                    for (let j = 0; j < ronCount; j++) { //处理可能的多家荣和
                        if(j>0) //处理多家
                            str += ", ";
                        
                        let obj = parmeHandle(eastScoreChange[j], southScoreChange[j], westScoreChange[j], northScoreChange[j]);
                        
                        if(eastScoreChange[j] == 0 || 
                            southScoreChange[j] == 0 || 
                            westScoreChange[j] == 0 || 
                            northScoreChange[j] == 0) { //如果有任何一家分数变动为0, 则为荣和
                            str += handleRon(kyoku, startPlayerIndex, eastScoreChange[j], southScoreChange[j], westScoreChange[j], northScoreChange[j]);
                        }if(obj.scoreAddArray.length == 3) { //判断是否是三家荣和
                            if(matchRule.isRon3) //如果启用了三家和了的规则 //? 可能是没有必要的判断? 等待使用三种游戏牌谱分别进行查证
                                str += handleRon(kyoku, startPlayerIndex, eastScoreChange[j], southScoreChange[j], westScoreChange[j], northScoreChange[j]);
                            else{ //流局 //? 可能是没有必要的判断? 等待使用三种游戏牌谱分别进行查证
                                // let str = handleRyuukyoku(kyoku, startPlayerIndex, eastScoreChange[j], southScoreChange[j], westScoreChange[j], northScoreChange[j]);
                                // Console.orig.log(str);
                            }

                        }else{ //否则都是自摸
                            // str += handleTsumo(kyoku, startPlayerIndex, eastScoreChange[j], southScoreChange[j], westScoreChange[j], northScoreChange[j]);
                        }
                    }//for
                    if(str.length > 0) {
                        const span = document.createElement("span");
                        span.innerHTML = ` \u00A0\u00A0\u00A0` + str;
                        endInfoEle[i].parentElement.appendChild(span);

                        let lineNum = CustomUtils.getTextLineNum(span.parentNode);
                        if(lineNum > 1){ //如果新添加的文字有多行, 则进行对齐
                            for (let j = 1; j < lineNum; j++) {
                                summaryEle.children[0].insertBefore(document.createElement("br"), kyokuEle[i].parentElement.nextElementSibling);
                            }
                        }
                    }
                }else if(endMode == tenhouText.Ryuukyoku){ //荒牌流局 //流局, 如果有分数改变则处理
                    // let str = handleRyuukyoku(kyoku, startPlayerIndex, eastScoreChange[j], southScoreChange[j], westScoreChange[j], northScoreChange[j]);
                    // Console.orig.log(str);
                }else if(endMode == tenhouText.RyuukyokuTsumo) { //流局满贯 (等同于自摸8000)
                    // let str = handleRyuukyoku(kyoku, startPlayerIndex, eastScoreChange[j], southScoreChange[j], westScoreChange[j], northScoreChange[j]);
                    // Console.orig.log(str);
                }else if(endMode == tenhouText.RyuukyokuType1) { //九种九牌 //流局, 如果有分数改变则处理
                    // let str = handleRyuukyoku(kyoku, startPlayerIndex, eastScoreChange[j], southScoreChange[j], westScoreChange[j], northScoreChange[j]);
                    // Console.orig.log(str);
                }else{ //四风连打、四杠散了、四家立直 //三家和了 //流局, 如果有分数改变则处理
                    // let str = handleRyuukyoku(kyoku, startPlayerIndex, eastScoreChange[j], southScoreChange[j], westScoreChange[j], northScoreChange[j]);
                    // Console.orig.log(str);
                }

                const span = document.createElement("span");
                let str = MJCommonUtils.getPlayerSeatNameByPlayerIndex(startPlayerIndex, kyoku, OUTSTYLE.A);
                span.innerText = ` \u00A0\u00A0\u00A0` + str;
                span.classList.add("position_ab");
                span.classList.add("l-130px");
                if(str == i18nText.seatTypeA0) //东起
                    span.classList.add("color5");
                else
                    span.classList.add("color6");
                kyokuEle[i].parentElement.appendChild(span);
                titleKyokuEle[0].innerText += `\u00A0\u00A0` + str;

                titleKyokuEle[0].id = titleKyokuEle[0].href.match(/#[\S\s]+$/)[0] + "-main"; //设置父项id
            }//for
            //Console.orig.log("end MainApp.showStartInfo()");
            UI.addValueByLoadingProgress(20);
        }
        //列出选择权重
        static async showChooseWeight() {
            //Console.orig.log("MainApp.showChooseWeight()");
            /* 列出选择权重 */
            const defaultHandleFunc = (newNode, differData, index, colorStr) => {
                newNode.style.color = colorStr; //设置为目标颜色
                newNode.innerHTML = ` \u00A0\u00A0\u00A0` + eval("i18nText.badMoveDiffer" + index) + differData;
            }
            const map = new Map(); //使用map保证重置循坏后的唯一性
            
            let targClassName;
            if(g_origLang == "en"){
                targClassName = "l-210px";
            }else{
                targClassName = "l-170px";
            }

            const boxObj = {__proto__: null,
                left:0,
                top:0
            };
            const entry = document.getElementsByClassName("collapse entry");
            let spanSelf, spanMortal;
            for (let i = 0, length = entry.length; i != length; ++i) {
                entry[i].classList.add("position_re");

                const roleEle = entry[i].getElementsByClassName("role");

                let selfPai = roleEle[0].parentElement;
                let mortalPai = roleEle[1].nextElementSibling;

                if(mortalPai.tagName.toLocaleLowerCase() == 'details') {
                    mortalPai = roleEle[1].nextSibling;
                }

                if (DOMTypeUtils.isSVGElement(selfPai.childNodes[selfPai.childNodes.length -2])) {
                    if(selfPai.childNodes[selfPai.childNodes.length -2].tagName.toLocaleLowerCase() == 'svg') { //如果有多张牌图片，就使用最后一张牌图片
                        selfPai = selfPai.childNodes[selfPai.childNodes.length -2];
                    }
                }


                if(mortalPai.nextElementSibling.tagName.toLocaleLowerCase() == 'svg') { //如果有多张牌图片，就使用最后一张牌图片
                    mortalPai = mortalPai.nextElementSibling;
                }

                const dataEle = entry[i].getElementsByTagName("tbody")[0].childNodes;

                let selfPaiData = 0;
                let mortalPaiData = 0;
                let selfBoxObj = { ...boxObj }, mortalBoxObj = { ...boxObj }; //复制对象
                map.clear(); //清除map

                let j = 0, size = dataEle.length;
                while (j != size) {
                    let selfPaiStr = null;
                    let mortalPaiStr = null;

                    let isResetLoop = false; //是否重置循坏

                    if(selfPai != null){
                        if(DOMTypeUtils.isTextElement(selfPai)) {
                            selfPaiStr = selfPai.data;
                        }else{
                            let obj = selfPai.getElementsByClassName("face");
                            if(obj[0] != null){
                                selfPaiStr = obj[0].href.baseVal;
                            }else{ //选择跳过的情况
                                selfPaiStr = selfPai.childNodes[selfPai.childNodes.length -1].data;
                            }
                        }
                    }
                    if(mortalPai != null){
                        if(DOMTypeUtils.isTextElement(mortalPai)) {
                            mortalPaiStr = mortalPai.data;
                        }else{
                            let obj = mortalPai.getElementsByClassName("face");
                            if(obj[0] != null){
                                mortalPaiStr = obj[0].href.baseVal;
                            }else{ //选择跳过的情况
                                mortalPaiStr = mortalPai.childNodes[mortalPai.childNodes.length -1].data;
                            }
                        }
                    }

                    let data = dataEle[j].childNodes[2].innerHTML.replace(/<.*?>/g, ""); //过滤html标签, 只保留文字内容

                    let obj1 = dataEle[j].childNodes[0].getElementsByClassName("face");
                    let dataPaiStr;
                    if(obj1[obj1.length - 1] != null) { // 如果有多张牌, 则选择最后一张牌作为对比牌 (主要用于吃的情况、碰杠这些牌都是一样的)
                        dataPaiStr = obj1[obj1.length - 1].href.baseVal;
                    }else{
                        dataPaiStr = dataEle[j].childNodes[0].innerHTML;

                        if(map.has(j) == false) {
                            map.set(j, true); //保存当前j的值，防止重复开始循坏
                            j = 0; //如果 有 选择跳过的情况, 则重新开始循坏, 以找到正确的数据
                            isResetLoop = true;
                        }
                    }

                    if(selfPaiStr == dataPaiStr) { //如果目标操作是自己的操作

                        selfPaiData = data;

                        spanSelf = document.createElement("span");
                        spanSelf.innerText = ` \u00A0\u00A0\u00A0` + data;
                        spanSelf.classList.add("position_ab");

                        if(selfBoxObj.top == 0) {
                            if(!isNaN(selfPai.offsetTop)) {
                                selfBoxObj.top = (selfPai.offsetTop + selfPai.offsetHeight / 2 - 10);
                            }else if(!isNaN(selfPai.parentElement.offsetTop)) {
                                selfBoxObj.top = (selfPai.parentElement.offsetTop + selfPai.parentElement.offsetHeight / 2 - 10);
                            }else{
                                Console.orig.error("[dom struct inconsistency] source:", "selfPai");
                                Console.orig.log("[debug]", `i: ${i}`);
                            }
                            spanSelf.style.top = selfBoxObj.top + 2 + "px";
                        }
                        spanSelf.classList.add(targClassName); //l-170px //l-210px

                        entry[i].insertBefore(spanSelf, entry[i].childNodes[3].nextSibling);

                        selfPai = null; //置null, 防止继续计算
                    }else if(mortalPaiStr == dataPaiStr) { //如果目标操作是Mortal的操作

                        mortalPaiData = data;

                        spanMortal = document.createElement("span");
                        spanMortal.innerText = ` \u00A0\u00A0\u00A0` + data;
                        spanMortal.classList.add("position_ab");

                        if(mortalBoxObj.top == 0) {
                            if(!isNaN(mortalPai.offsetTop)) {
                                mortalBoxObj.top = (mortalPai.offsetTop + mortalPai.offsetHeight / 2 - 10);
                            }else if(!isNaN(mortalPai.previousElementSibling.offsetTop)) {
                                mortalBoxObj.top = (mortalPai.previousElementSibling.offsetTop + mortalPai.previousElementSibling.offsetHeight / 2 - 10);
                            }else if(!isNaN(mortalPai.previousElementSibling.previousElementSibling.offsetTop)) {
                                mortalBoxObj.top = (mortalPai.previousElementSibling.previousElementSibling.offsetTop + mortalPai.previousElementSibling.previousElementSibling.offsetHeight / 2 - 10);
                            }else{
                                Console.orig.error("[dom struct inconsistency] source:", "mortalPai");
                                Console.orig.log("[debug]", `i: ${i}`);
                            }
                            spanMortal.style.top = mortalBoxObj.top + 1 + "px";
                        }
                        spanMortal.classList.add(targClassName); //l-170px //l-210px

                        if(DOMTypeUtils.isTextElement(mortalPai.nextSibling)) { //如果有多张牌图片，就使用最后一张牌图片后面的文字的位置
                            mortalPai = mortalPai.nextSibling;
                        }

                        entry[i].insertBefore(spanMortal, mortalPai.nextSibling);

                        mortalPai = null; //置null, 防止继续计算
                    }

                    if(selfPaiStr == mortalPaiStr) { //如果自己选择打出的牌与mortal选择打出的牌相同
                        if(map.has(j) == false) {
                            map.set(j, true); //保存当前j的值，防止重复开始循坏
                            j = 0; //如果 有 选择跳过的情况, 则重新开始循坏, 以找到正确的数据
                            isResetLoop = true;
                        }
                    }

                    if(selfPai == null && mortalPai == null) { //是否处理完毕
                        break; //跳出循坏
                    }
                    if(isResetLoop == false){ //不重置循坏时, index++
                        ++j;
                    }
                }//for

                /* 计算自己的选择与mortal选择的差值 */
                if(mortalPaiData == selfPaiData) //忽略自己和mortal打出的牌一样的结果
                    continue;
                const differData = Math.constructor.roundEx(Math.abs(mortalPaiData - selfPaiData), 5); //保留5位小数

                const turnInfo = entry[i].children[0].children[0];
                const newNode = document.createElement("span");
                newNode.classList.add("font_weight_400");

                if (differData < 5) { //微差
                    defaultHandleFunc(newNode, differData, 1, "#000"); //黑色
                }else if (differData < 10) { //小幅差距
                    defaultHandleFunc(newNode, differData, 2, "#996633"); //褐色
                }else if (differData < 20) { //低等差距
                    defaultHandleFunc(newNode, differData, 3, "#009966"); //淡绿
                }else if (differData < 40) { //中等差距
                    defaultHandleFunc(newNode, differData, 4, "#3399FF"); //淡蓝
                }else if (differData < 60) { //高等差距
                    defaultHandleFunc(newNode, differData, 5, "#3333CC"); //深蓝
                }else if (differData < 80) { //大幅度差距
                    defaultHandleFunc(newNode, differData, 6, "#CC0099"); //淡红
                }else{ //压倒性差距
                    defaultHandleFunc(newNode, differData, 7, "#f00"); //红色
                }
                turnInfo.appendChild(newNode);

                let lineNum = CustomUtils.getTextLineNum(turnInfo);
                let offsetTopDiffValue = Math.abs(roleEle[0].offsetTop - spanSelf.offsetTop);
                if(lineNum > 1 && offsetTopDiffValue >= 5){ //如果新添加的文字有多行, 则进行对齐 //移动设备x轴分辨率较小,并且各种设备分辨率不同,就会导致可能不需要对齐
                    let lineHeight = CustomUtils.getStyleOfLineHeight(turnInfo);
                    let origTopSelf = parseFloat(spanSelf.style.top);
                    let origTopMortal = parseFloat(spanMortal.style.top);
                    spanSelf.style.top = origTopSelf + lineHeight + "px";
                    spanMortal.style.top = origTopMortal + lineHeight + "px";
                }
            }//for
            //Console.orig.log("end MainApp.showChooseWeight()");
            UI.addValueByLoadingProgress(20);
        }
        
    }

    class MainApp extends MortalBase {
        static perfor = new Performance("MainApp");
        static badChooseMap = new Map(); //恶手选择器
        static disable_kyokuChoose = false;
        static disable_badChoose = false;
        static disable_diffChoose = false;
        constructor(){
            //super();
        }
        static init(){
            //Console.orig.log("MainApp.init()");
            if(Debug.getDebug){
                CodeTemplate.autoWired_Performance("MainApp.run", MainApp);
            }
            return true;
        }
        static async run(){
            //Console.orig.log("MainApp.run()");
            const [result1, result2] = 
                               //显示恶手 (收集数据)         //起始信息详细化 (独立) (重要)  //列出选择权重 (独立)
            (await Promise.all([MainApp.createCatalogUI(), MainApp.createSettingUI()]
            .map(item => item.catch(err => Debug.globalErrorHandle(err))) //每个并发请求使用catch进行对应异常的处理，防止某个请求失败后，影响到其他函数执行
            ));
            //Console.orig.log(result1, result2);
            await MainApp.end();
        }
        static async end() {
            //Console.orig.log("MainApp.end()");

            /* 将页面滚动导致的元素可见性改变与选择器绑定 (全局滚动) */
            let section = document.getElementsByTagName("section");
            let curKyoku; //局数
            let curCount; //本场数
            const globalScrollHandle = (e) => {
                const scrollTop = document.scrollingElement.scrollTop;
                const heightOffset = document.scrollingElement.clientHeight / 2;
                for (let i = 0; i < section.length; i++) {
                    if ((section.length == 1) || //比如自定义牌谱，只有1局，就跳过后续的可见性测试
                        (i == 0 && scrollTop +heightOffset < section[1].offsetTop) || //第一个节点高度范围 //0~第二个元素之间的高度 //小于第二个元素的高度
                        (i == section.length -1 && scrollTop >= section[section.length -2].offsetTop) || //最后一个节点高度范围 //大于倒数第二个元素的高度
                        (scrollTop +heightOffset >= section[i].offsetTop && scrollTop +heightOffset < section[i+1].offsetTop)) { //中间的节点高度范围 //相邻的两个节点之间
                            const titleEle = section[i].children[0];
                            const titleKyokuEle = titleEle.getElementsByTagName("a"); //只有1个元素
                            //Console.orig.log("可见: " + titleKyokuEle[0].innerText, titleKyokuEle[0].id);
                            if(!MainApp.disable_kyokuChoose){
                                let targetEle = document.getElementById(titleKyokuEle[0].id.replace("-main", ""));
                                DomUtils.setNewActivateEle(targetEle, "layui-this");
                            }
                            [curKyoku, curCount] = titleKyokuEle[0].id.split("-").filter((item) => {
                                return item.match(/\d+/); //过滤非数字
                            });
                            
                            let curkyokuMode = MJCommonUtils.normalKyokuToKyokuMode(curKyoku); //标准局数 转 东南西场 (1=东 2=南 3=西)

                            let textKyoku = MJCommonUtils.normalKyokuToTextKyoku(curKyoku, curkyokuMode); //标准局数 转 文本局数 (0=>1: 东一) (6=>3: 南3)

                            //恶手选择器
                            if(!MainApp.disable_badChoose){
                                let badChooseArray = MainApp.badChooseMap.get(`${curkyokuMode}${textKyoku}${curCount}`);
                                const handleBadChoose = (badChooseArray)=>{
                                    if(badChooseArray != undefined){
                                        for (let j = 0; j < badChooseArray.length; j++) {
                                            const badChooseEle = document.getElementById(badChooseArray[j]);
                                            
                                            if(j==0){ //第一个元素
                                                DomUtils.setNewActivateEle(badChooseEle, "layui-this");
                                                // if(badChooseArray.length == 1){ //只有1个元素
                                                //     badChooseEle.classList.add("badChoose_border");
                                                // }
                                                // else{ //多个元素
                                                //     badChooseEle.classList.add("badChoose_border_first");
                                                // }
                                            }else if(j == badChooseArray.length -1){ //最后一个
                                                // badChooseEle.classList.add("badChoose_border_last");
                                            }else{ //中间的
                                                // badChooseEle.classList.add("badChoose_border_middle");
                                            }
                                        }
                                    }else{
                                        Console.orig.error("badChooseArray is undefined");
                                    }
                                };

                                if(badChooseArray == undefined){ //如果当前的对局，比如东一，没有恶手，那么就是undefined //则继续向下查找有恶手的对局
                                    for (let index = i + 1; index < section.length; index++) {
                                        const titleEle = section[index].children[0];
                                        const titleKyokuEle = titleEle.getElementsByTagName("a"); //只有1个元素

                                        let targetEle = document.getElementById(titleKyokuEle[0].id.replace("-main", ""));
                                        [curKyoku, curCount] = titleKyokuEle[0].id.split("-").filter((item) => {
                                            return item.match(/\d+/); //过滤非数字
                                        });

                                        let curkyokuMode = MJCommonUtils.normalKyokuToKyokuMode(curKyoku); //标准局数 转 东南西场 (1=东 2=南 3=西)

                                        let textKyoku = MJCommonUtils.normalKyokuToTextKyoku(curKyoku, curkyokuMode); //标准局数 转 文本局数 (0=>1: 东一) (6=>3: 南3)

                                        badChooseArray = MainApp.badChooseMap.get(`${curkyokuMode}${textKyoku}${curCount}`); //循坏获取，直到获取到有恶手的对局
                                        if(badChooseArray != undefined){ //找到了就跳出
                                            break;
                                        }
                                    }
                                }
                                if(badChooseArray != undefined){
                                    // Console.orig.log("当前局数没有恶手，向后查找并设置!");
                                    handleBadChoose(badChooseArray);
                                }else{
                                    // Console.orig.log("当前查看的对局没有恶手!");
                                    let ele = document.querySelector(".ui #selector2");
                                    if(ele.children.length == 0){
                                        // Console.orig.log("当前牌谱没有恶手!");
                                    }else{
                                        // Console.orig.log("设置为第一个!");
                                        DomUtils.setNewActivateEle(ele.children[0].children[0], "layui-this"); //设置为第一个
                                    }
                                }
                            }
                            
                            //不一致选择器
                            if(!MainApp.disable_diffChoose){

                            }

                            MainApp.disable_kyokuChoose = false;
                            MainApp.disable_badChoose = false;
                            MainApp.disable_diffChoose = false;
                            return;
                    }//if
                }//for
            };
            window.addEventListener("scroll", CustomUtils.throttle(globalScrollHandle, 100));
            globalScrollHandle();
            
            /* 绑定按钮事件 */
            const Mode = {
                prev: "prev",
                next: "next",
            }
            const commonButClickEvent = (selectorStr, butName, mode)=>{
                let nextEle = null;
                let ele = document.querySelector(selectorStr);
                if(ele == undefined){
                    Console.orig.warn("click", butName, "获取到的目标节点为空!"); return;
                }
                
                if(mode == Mode.prev){
                    nextEle = ele.previousElementSibling;
                }else if(mode == Mode.next){
                    nextEle = ele.nextElementSibling;
                }
                if(nextEle != null){
                    nextEle = nextEle.children[0];
                    DomUtils.setNewActivateEle(nextEle, "layui-this");
                    nextEle.click();
                }
            };
            document.getElementById("but_kyoku_prev").addEventListener("click", function(e){
                let selectorName = ".ui #selector1 .layui-this";
                let ele = document.querySelector(selectorName);
                if(ele == undefined){
                    Console.orig.warn("click", "but_kyoku_prev", "获取到的目标节点为空!"); return;
                }
                
                ele = ele.children[0];
                
                let idStr = ele.id; //
                let targetNode = document.getElementById(idStr + "-main");
                if(targetNode == null){
                    Console.orig.error("idSelectorHandle", "获取到的目标节点为空!"); return;
                }
                
                let parentEle = targetNode.parentElement.parentElement.parentElement;
                let collapseEntry = parentEle.children[3].querySelectorAll(".collapse.entry");

                let liEle = ele.parentElement.parentElement.parentElement;
                if(!liEle.classList.contains("layui-nav-itemed")){ //自动打开选项卡
                    liEle.classList.add("layui-nav-itemed");
                }

                if(!CustomUtils.isShowInClientWindowOfPositionModeAndScrollbar(ele)){ //如果没有显示出来，则定位到目标元素
                    CustomUtils.setScrollToTargetNode(ele, "center");
                }

                if(!CustomUtils.isShowInClientWindowOfNodeArray(collapseEntry)){ //如果没有显示出来，则先定位到目标元素，再执行切换操作
                    let changeEle = parentEle.getElementsByClassName("sticky")[0];
                    changeEle.style.background = "transparent";
                    CustomUtils.setHighlightShow(parentEle, 750, ()=>{
                        changeEle.style.background = "";
                    }); //高亮显示
                    CustomUtils.setScrollToTargetNode(parentEle, "start");
                }else{
                    commonButClickEvent(selectorName, "#but_kyoku_prev", Mode.prev);
                }
            }, false);

            document.getElementById("but_kyoku_next").addEventListener("click", function(e){
                let selectorName = ".ui #selector1 .layui-this";
                let ele = document.querySelector(selectorName);
                if(ele == undefined){
                    Console.orig.warn("click", "but_kyoku_next", "获取到的目标节点为空!"); return;
                }
                ele = ele.children[0];
                
                let idStr = ele.id; //
                let targetNode = document.getElementById(idStr + "-main");
                if(targetNode == null){
                    Console.orig.error("idSelectorHandle", "获取到的目标节点为空!"); return;
                }
                let parentEle = targetNode.parentElement.parentElement.parentElement;
                let collapseEntry = parentEle.children[3].querySelectorAll(".collapse.entry");

                let liEle = ele.parentElement.parentElement.parentElement;
                if(!liEle.classList.contains("layui-nav-itemed")){ //自动打开选项卡
                    liEle.classList.add("layui-nav-itemed");
                }

                if(!CustomUtils.isShowInClientWindowOfPositionModeAndScrollbar(ele)){ //如果没有显示出来，则定位到目标元素
                    CustomUtils.setScrollToTargetNode(ele, "center");
                }

                if(!CustomUtils.isShowInClientWindowOfNodeArray(collapseEntry)){ //如果没有显示出来，则先定位到目标元素，再执行切换操作
                    let changeEle = parentEle.getElementsByClassName("sticky")[0];
                    changeEle.style.background = "transparent";
                    CustomUtils.setHighlightShow(parentEle, 750, ()=>{
                        changeEle.style.background = "";
                    }); //高亮显示
                    CustomUtils.setScrollToTargetNode(parentEle, "start");
                }else{
                    commonButClickEvent(selectorName, "#but_kyoku_next", Mode.next);
                }
            }, false);

            document.getElementById("but_diff_prev").addEventListener("click", function(e){
                let selectorName = ".ui #selector2 .layui-this";
                let ele = document.querySelector(selectorName);
                if(ele == undefined){
                    Console.orig.warn("click", "but_diff_prev", "获取到的目标节点为空!"); return;
                }
                ele = ele.children[0];
                
                let idStr = ele.id; //
                let targetNode = document.getElementById(idStr + "-main");
                if(targetNode == null){
                    Console.orig.error("idSelectorHandle", "获取到的目标节点为空!"); return;
                }

                let liEle = ele.parentElement.parentElement.parentElement;
                if(!liEle.classList.contains("layui-nav-itemed")){ //自动打开选项卡
                    liEle.classList.add("layui-nav-itemed");
                }

                if(!CustomUtils.isShowInClientWindowOfPositionModeAndScrollbar(ele)){ //如果没有显示出来，则定位到目标元素
                    CustomUtils.setScrollToTargetNode(ele, "center");
                }

                if(!CustomUtils.isShowInClientWindow(targetNode)){ //如果没有显示出来，则先定位到目标元素，再执行切换操作
                    CustomUtils.setHighlightShow(targetNode, 750); //高亮显示
                    CustomUtils.setScrollToTargetNode(targetNode, "center");
                }else{
                    commonButClickEvent(selectorName, "#but_diff_prev", Mode.prev);
                }
            }, false);

            document.getElementById("but_diff_next").addEventListener("click", function(e){
                let selectorName = ".ui #selector2 .layui-this";
                let ele = document.querySelector(selectorName);
                if(ele == undefined){
                    Console.orig.warn("click", "but_diff_next", "获取到的目标节点为空!"); return;
                }
                ele = ele.children[0];
                
                let idStr = ele.id; //
                let targetNode = document.getElementById(idStr + "-main");
                if(targetNode == null){
                    Console.orig.error("idSelectorHandle", "获取到的目标节点为空!"); return;
                }

                let liEle = ele.parentElement.parentElement.parentElement;
                if(!liEle.classList.contains("layui-nav-itemed")){ //自动打开选项卡
                    liEle.classList.add("layui-nav-itemed");
                }

                if(!CustomUtils.isShowInClientWindowOfPositionModeAndScrollbar(ele)){ //如果没有显示出来，则定位到目标元素
                    CustomUtils.setScrollToTargetNode(ele, "center");
                }

                if(!CustomUtils.isShowInClientWindow(targetNode)){ //如果没有显示出来，则先定位到目标元素，再执行切换操作
                    CustomUtils.setHighlightShow(targetNode, 750); //高亮显示
                    CustomUtils.setScrollToTargetNode(targetNode, "center");
                }else{
                    commonButClickEvent(selectorName, "#but_diff_next", Mode.next);
                }
            }, false);

            UI.addValueByLoadingProgress(10);

            //Console.orig.log("end MainApp.end()");
        }
        static stop(){

        }
        static clean(){

        }
        //
        static async createCatalogUI() {
            //Console.orig.log("MainApp.createCatalogUI()");
            const summaryEle = document.getElementsByClassName("kyoku-toc")[0];
            //数据处理
            let catalogUI = document.getElementById("catalogUI");
            DomUtils.setMoveable(catalogUI, true);

            layui.use(function(){
                let element = layui.element;
                let laytpl = layui.laytpl;
                let $ = layui.$;
                //收集数据1-对局
                let strArray1 = [];
                let array = summaryEle.children[0].children;
                let length = summaryEle.children[0].children.length;
                for (let j = 0; j < length; j++) {
                    const ele = array[j];
                    if(ele.children.length == 0)
                        continue; //过滤<br>等没有子节点的单标签
                    strArray1.push({
                        name: ele.children[0].innerText + (ele.children[1] != undefined ? (" " + ele.children[1].innerText.trim()) : ""),
                        type: "id",
                        nameID: ele.children[0].href.match(/#[\S\s]+$/)[0],
                    });
                }

                let data = { //模板数据
                    selector1: strArray1, //对局选择器
                    selector2: strArray2, //恶手选择器
                    selector3: strArray3, //不一致选择器
                };

                //使用模板进行解析
                let compile = laytpl(catalogUITemplate); // 模板解析
                compile.render(data, (htmlStr)=>{
                    $('#catalogUI').html(htmlStr);
                }); // 模板渲染
                
                // 渲染导航组件
                element.render('nav', 'selector-filter-nav');

                /* 新增右置对局选择器和切换器(固定/可滑动呼出) */
                let catalogUIBuf = document.getElementById("catalogUIBuf");
                let selectorGroups = document.getElementById("selectorGroups");
                let section = document.getElementsByTagName("section");
                let eleSection = section[0];
                selectorGroups.style.height = (document.scrollingElement.clientHeight - 100 - catalogUIBuf.offsetHeight -46) + "px"; //滚动条
                selectorGroups.style.paddingBottom = "46px";
                catalogUI.style.left = (eleSection.offsetLeft + eleSection.offsetWidth + 60) + "px"; //x位置
                let vTop = (eleSection.offsetTop - catalogUI.offsetHeight);
                catalogUI.style.top = 60 + "px"; //y位置

                /* 绑定选择器事件 */
                let selector1_a = document.querySelectorAll("#selector1 a"); //对局选择器 //name->id
                let selector2_a = document.querySelectorAll("#selector2 a"); //恶手选择器 //id
                let selector3_a = document.querySelectorAll("#selector3 a"); //不一致选择器 //name
                let differMap = new Map(); //不一致选择器

                let nameIdSelectorHandle = function(e) {
                    let idStr = e.target.name;
                    let targetNode = document.getElementById(idStr + "-main");
                    if(targetNode == null){
                        Console.orig.error("nameIdSelectorHandle", "获取到的目标节点为空!"); return;
                    }
                    if(targetNode.id.indexOf("kyoku") != -1){
                        let parentEle = targetNode.parentElement.parentElement.parentElement;
                        let changeEle = parentEle.getElementsByClassName("sticky")[0];
                        changeEle.style.background = "transparent";
                        CustomUtils.setHighlightShow(parentEle, 750, ()=>{
                            changeEle.style.background = "";
                        }); //高亮显示
                        CustomUtils.setScrollToTargetNode(targetNode, "start");
                    }else{
                        CustomUtils.setHighlightShow(targetNode, 750); //高亮显示
                        CustomUtils.setScrollToTargetNode(targetNode, "center");
                    }
                };
                let idSelectorHandle = function(e) {
                    let idStr = e.target.id;
                    let targetNode = document.getElementById(idStr + "-main");
                    if(targetNode == null){
                        Console.orig.error("idSelectorHandle", "获取到的目标节点为空!"); return;
                    }    
                    if(targetNode.id.indexOf("kyoku") != -1){
                        let parentEle = targetNode.parentElement.parentElement.parentElement;
                        let changeEle = parentEle.getElementsByClassName("sticky")[0];
                        changeEle.style.background = "transparent";
                        CustomUtils.setHighlightShow(parentEle, 750, ()=>{
                            changeEle.style.background = "";
                        }); //高亮显示
                        CustomUtils.setScrollToTargetNode(targetNode, "start");
                    }else{
                        CustomUtils.setHighlightShow(targetNode, 750); //高亮显示
                        CustomUtils.setScrollToTargetNode(targetNode, "center");
                    }
                };
                let nameSelectorHandle = function(e) {
                    let idStr = e.target.name;
                    let targetNode = document.getElementsByName(idStr + "-main");
                    if(targetNode == null){
                       Console.orig.error("nameSelectorHandle", "获取到的目标节点为空!"); return;
                    }
                    if(targetNode[0].id.indexOf("kyoku") != -1){
                        let parentEle = targetNode.parentElement.parentElement.parentElement;
                        let changeEle = parentEle.getElementsByClassName("sticky")[0];
                        changeEle.style.background = "transparent";
                        CustomUtils.setHighlightShow(parentEle, 750, ()=>{
                            changeEle.style.background = "";
                        }); //高亮显示
                        CustomUtils.setScrollToTargetNode(targetNode[0], "start");
                    }else{
                        CustomUtils.setHighlightShow(targetNode[0], 750); //高亮显示
                        CustomUtils.setScrollToTargetNode(targetNode[0], "center");
                    }
                };
                //绑定 对局选择器
                for (let i = 0; i < selector1_a.length; i++) {
                    const ele = selector1_a[i];
                    ele.addEventListener('click', function(e){
                        MainApp.disable_kyokuChoose = true;
                        return idSelectorHandle(e);
                    });
                }
                //绑定 恶手选择器
                for (let i = 0; i < selector2_a.length; i++) {
                    const ele = selector2_a[i];
                    //
                    let idStr = ele.id; //
                    let targetNode = document.getElementById(idStr + "-main");
                    if(targetNode == null){
                        Console.orig.error("idSelectorHandle", "获取到的目标节点为空!"); break;
                    }
                    let parentEle = targetNode.parentElement.parentElement;

                    const tenhouData = parentEle.getElementsByTagName("iframe")[0].src;
                    const json = JSON.parse(decodeURI(tenhouData.substring(tenhouData.indexOf("{")))); //天凤对局数据
                    const kyoku = json.log[0][0][0]; //局数
                    const count = json.log[0][0][1]; //本场数

                    //东南西场 (1=东 2=南 3=西)
                    let curkyokuMode = MJCommonUtils.normalKyokuToKyokuMode(kyoku); //标准局数 转 东南西场 (1=东 2=南 3=西)

                    let textKyoku = MJCommonUtils.normalKyokuToTextKyoku(kyoku, curkyokuMode); //标准局数 转 文本局数 (0=>1: 东一) (6=>3: 南3)

                    let key = `${curkyokuMode}${textKyoku}${count}`;
                    let badChooseArray = MainApp.badChooseMap.get(key);
                    if(badChooseArray == undefined)
                        badChooseArray = [];
                    badChooseArray.push(ele.id);
                    MainApp.badChooseMap.set(key, badChooseArray);
                    //
                    ele.addEventListener('click', function(e){
                        MainApp.disable_badChoose = true;
                        return idSelectorHandle(e);
                    });
                }
                //绑定 不一致选择器
                for (let i = 0; i < selector3_a.length; i++) {
                    const ele = selector3_a[i];
                    //
                    let idStr = ele.name; //
                    let targetNode = document.getElementsByName(idStr + "-main");
                    if(targetNode == null){
                        Console.orig.error("nameSelectorHandle", "获取到的目标节点为空!"); break;
                    }
                    let parentEle = targetNode[0].parentElement.parentElement;

                    const tenhouData = parentEle.getElementsByTagName("iframe")[0].src;
                    const json = JSON.parse(decodeURI(tenhouData.substring(tenhouData.indexOf("{")))); //天凤对局数据
                    const kyoku = json.log[0][0][0]; //局数
                    const count = json.log[0][0][1]; //本场数

                    //东南西场 (1=东 2=南 3=西)
                    let curkyokuMode = MJCommonUtils.normalKyokuToKyokuMode(kyoku); //标准局数 转 东南西场 (1=东 2=南 3=西)

                    let textKyoku = MJCommonUtils.normalKyokuToTextKyoku(kyoku, curkyokuMode); //标准局数 转 文本局数 (0=>1: 东一) (6=>3: 南3)

                    let key = `${curkyokuMode}${textKyoku}${count}`;
                    let differArray = differMap.get(key);
                    if(differArray == undefined)
                        differArray = [];
                    differArray.push(ele.name);
                    differMap.set(key, differArray);
                    //
                    ele.addEventListener('click', function(e){
                        MainApp.disable_diffChoose = true;
                        return nameSelectorHandle(e);
                    });
                }

                /* 对局选择器和切换器 详细化 (添加格外标记) */
                //收集数据-恶手选择器
                let strArrayMap = new Map();
                const countObject = {__proto__: null,
                    badChooseNum: 0,
                    badChooseNumCustom: 0,
                    differNum: 0,
                };
                let badChooseType1 = strArray2.filter((obj) => {
                    return obj.badChooseType == 1;
                });
                let badChooseType2 = strArray2.filter((obj) => {
                    return obj.badChooseType == 2;
                });
                for (let i = 0; i < badChooseType1.length; i++) {
                    const ele = badChooseType1[i];
                    let idStr = ele.parentHref; //
                    let parentEle = document.getElementById(idStr + "-main");
                    if(parentEle == null){
                        Console.orig.error("idSelectorHandle", "获取到的目标节点为空!"); return;
                    }

                    let obj = strArrayMap.get(idStr + "-main");
                    if(obj == undefined){
                        obj = { ...countObject }; //复制对象
                    }

                    obj.badChooseNum++;
                    strArrayMap.set(idStr + "-main", obj);
                }
                for (let i = 0; i < badChooseType2.length; i++) {
                    const ele = badChooseType2[i];
                    let idStr = ele.parentHref; //
                    let parentEle = document.getElementById(idStr + "-main");
                    if(parentEle == null){
                        Console.orig.error("idSelectorHandle", "获取到的目标节点为空!"); return;
                    }

                    let obj = strArrayMap.get(idStr + "-main");
                    if(obj == undefined){
                        obj = { ...countObject }; //复制对象
                    }

                    obj.badChooseNumCustom++;
                    strArrayMap.set(idStr + "-main", obj);
                }
                //收集数据-不一致选择器
                for (let i = 0; i < strArray3.length; i++) {
                    const ele = strArray3[i];
                    let idStr = ele.parentHref; //
                    let parentEle = document.getElementById(idStr + "-main");
                    if(parentEle == null){
                        Console.orig.error("idSelectorHandle", "获取到的目标节点为空!"); return;
                    }

                    let obj = strArrayMap.get(idStr + "-main");
                    if(obj == undefined){
                        obj = { ...countObject }; //复制对象
                    }

                    obj.differNum++;
                    strArrayMap.set(idStr + "-main", obj);
                }
                // 处理数据
                for (let i = 0; i < strArray1.length; i++) {
                    const ele = strArray1[i];
                    let idStr = ele.nameID; //
                    let targetEle = document.getElementById(idStr);
                    if(targetEle == null){
                        Console.orig.error("idSelectorHandle", "获取到的目标节点为空!"); return;
                    }

                    let obj = strArrayMap.get(idStr + "-main");
                    if(obj != undefined){ //如果为undefined, 说明整局打的都与ai一致，无需处理
                        if(obj.differNum > 0){
                            Utils.addElementsByHTMLTemplateText(`<span class="${cssIDNP} layui-badge-dot l-129px"></span>`, targetEle);
                        }
                        if(obj.badChooseNum > 0){
                            Utils.addElementsByHTMLTemplateText(`<span class="${cssIDNP} layui-badge l-155px bgColor1">${obj.badChooseNum}</span>`, targetEle);
                        }
                        if(obj.badChooseNumCustom > 0){
                            Utils.addElementsByHTMLTemplateText(`<span class="${cssIDNP} layui-badge l-190px bgColor2">${obj.badChooseNumCustom}</span>`, targetEle);
                        }
                    }
                }

                //Console.orig.log("end MainApp.createCatalogUI()");
            });
            
        }
        //
        static async createSettingUI() {

        }

    }

    const app = new App();
})((typeof unsafeWindow != 'undefined' ? unsafeWindow : window));