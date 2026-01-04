// ==UserScript==
// @name         战舰世界莱服网页汉化
// @namespace    https://github.com/windofxy
// @version      202503120820
// @description  一个将战舰世界莱服网页内容翻译为中文的插件
// @author       Windofxy
// @icon         https://gh-proxy.net/github.com/OpenKorabli/Korabli-InGameBrowser-L10n-CHS/blob/main/Tampermonkey%20Script/icon128.png
// @grant        none
// @license      MIT


// @run-at       document_idle

// @match        http://armory.korabli.su/*
// @match        https://armory.korabli.su/*
// @match        http://clans.korabli.su/*
// @match        https://clans.korabli.su/*
// @match        http://dockyard.korabli.su/*
// @match        https://dockyard.korabli.su/*
// @match        http://friends.korabli.su/*
// @match        https://friends.korabli.su/*
// @match        http://profile.korabli.su/*
// @match        https://profile.korabli.su/*
// @match        http://warehouse.korabli.su/*
// @match        https://warehouse.korabli.su/*

// 代码-框架
// @require      https://update.greasyfork.org/scripts/529413/1551061/%E6%88%98%E8%88%B0%E4%B8%96%E7%95%8C%E8%8E%B1%E6%9C%8D%E7%BD%91%E9%A1%B5%E6%B1%89%E5%8C%96-%E4%BB%A3%E7%A0%81-%E6%A1%86%E6%9E%B6.js
// 资源-兵工厂翻译
// @require      https://update.greasyfork.org/scripts/529395/1550983/%E6%88%98%E8%88%B0%E4%B8%96%E7%95%8C%E8%8E%B1%E6%9C%8D%E7%BD%91%E9%A1%B5%E6%B1%89%E5%8C%96-%E8%B5%84%E6%BA%90-%E5%85%B5%E5%B7%A5%E5%8E%82%E7%BF%BB%E8%AF%91.js
// 资源-军团翻译
// @require      https://update.greasyfork.org/scripts/529397/1550989/%E6%88%98%E8%88%B0%E4%B8%96%E7%95%8C%E8%8E%B1%E6%9C%8D%E7%BD%91%E9%A1%B5%E6%B1%89%E5%8C%96-%E8%B5%84%E6%BA%90-%E5%86%9B%E5%9B%A2%E7%BF%BB%E8%AF%91.js
// 资源-造船厂翻译
// @require      https://update.greasyfork.org/scripts/529398/1550991/%E6%88%98%E8%88%B0%E4%B8%96%E7%95%8C%E8%8E%B1%E6%9C%8D%E7%BD%91%E9%A1%B5%E6%B1%89%E5%8C%96-%E8%B5%84%E6%BA%90-%E9%80%A0%E8%88%B9%E5%8E%82%E7%BF%BB%E8%AF%91.js
// 资源-征募站翻译
// @require      https://update.greasyfork.org/scripts/529402/1551011/%E6%88%98%E8%88%B0%E4%B8%96%E7%95%8C%E8%8E%B1%E6%9C%8D%E7%BD%91%E9%A1%B5%E6%B1%89%E5%8C%96-%E8%B5%84%E6%BA%90-%E5%BE%81%E5%8B%9F%E7%AB%99%E7%BF%BB%E8%AF%91.js
// 资源-账号档案翻译
// @require      https://update.greasyfork.org/scripts/529405/1551022/%E6%88%98%E8%88%B0%E4%B8%96%E7%95%8C%E8%8E%B1%E6%9C%8D%E7%BD%91%E9%A1%B5%E6%B1%89%E5%8C%96-%E8%B5%84%E6%BA%90-%E8%B4%A6%E5%8F%B7%E6%A1%A3%E6%A1%88%E7%BF%BB%E8%AF%91.js
// 资源-仓库翻译
// @require      https://update.greasyfork.org/scripts/529406/1551020/%E6%88%98%E8%88%B0%E4%B8%96%E7%95%8C%E8%8E%B1%E6%9C%8D%E7%BD%91%E9%A1%B5%E6%B1%89%E5%8C%96-%E8%B5%84%E6%BA%90-%E4%BB%93%E5%BA%93%E7%BF%BB%E8%AF%91.js
// @downloadURL https://update.greasyfork.org/scripts/529417/%E6%88%98%E8%88%B0%E4%B8%96%E7%95%8C%E8%8E%B1%E6%9C%8D%E7%BD%91%E9%A1%B5%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/529417/%E6%88%98%E8%88%B0%E4%B8%96%E7%95%8C%E8%8E%B1%E6%9C%8D%E7%BD%91%E9%A1%B5%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
if(!window.__localizer__)
{
    window.__localizer__ = {};
}
if(!window.__localizer__.localizer_framework_loaded)
{
    window.__localizer__.localizer_framework_loaded = true;
    window.__localizer__.localizer_mode = { mode: "Polling", interval: 500 };
    window.__localizer__.localizer_Debug = { showPerformanceData: false, showMutationTargetClassName: false };
    window.__localizer__.localizer_Debug_Execute_Start_Time = 0;

    window.__localizer__.localizer_Observe_ClassName_Now = "";
    window.__localizer__.localizer_Observe_ClassName_Set = new Set();

    window.__localizer__.localizer_MutationObserver_Config = { childList: true, subtree: true };
    window.__localizer__.localizer_Pass_Element_Id_Set = new Set();
    window.__localizer__.localizer_Pass_Element_ClassName_Set = new Set();

    window.__localizer__.localizer_Detect_Elements_CssSelector_Set = new Set();
    window.__localizer__.localizer_Detect_Elements_Override_Map = new Map();
    window.__localizer__.localizer_Detect_Elements_Replace_Map = new Map();

    window.__localizer__.localizer_Observe_ClassName_Set.add("navalBase");
    window.__localizer__.localizer_Observe_ClassName_Set.add("tasks");
    window.__localizer__.localizer_Observe_ClassName_Set.add("members");
    window.__localizer__.localizer_Observe_ClassName_Set.add("search");
    window.__localizer__.localizer_Observe_ClassName_Set.add("new-recommendations");
    window.__localizer__.localizer_Observe_ClassName_Set.add("treasury");
    window.__localizer__.localizer_Observe_ClassName_Set.add("clan-wars");

    window.__localizer__.localizer_Pass_Element_Id_Set.add("app");
    window.__localizer__.localizer_Pass_Element_Id_Set.add("wows-react-tooltip-body");
    window.__localizer__.localizer_Pass_Element_ClassName_Set.add("wru__Tooltip__header");
    window.__localizer__.localizer_Pass_Element_ClassName_Set.add("clan-wars");
    window.__localizer__.localizer_Pass_Element_ClassName_Set.add("TotalBalance_wrapper_1sZcM");
    window.__localizer__.localizer_Pass_Element_ClassName_Set.add("History_noTransactionsWrapper_2q7z-");
    window.__localizer__.localizer_Pass_Element_ClassName_Set.add("we-asset__text we-widget__text");
    window.__localizer__.localizer_Pass_Element_ClassName_Set.add("ViewClanStars_wrapper_18UHq");
    window.__localizer__.localizer_Pass_Element_ClassName_Set.add("ViewTreasury_tabContent_2MpE4");
    window.__localizer__.localizer_Pass_Element_ClassName_Set.add("ViewClanBattles_wrapper_1uPSF");
    window.__localizer__.localizer_Pass_Element_ClassName_Set.add("ViewClanWars_blurable_GNk-j ");
    window.__localizer__.localizer_Pass_Element_ClassName_Set.add("MyWarTab_content_1d_Lf");
    window.__localizer__.localizer_Pass_Element_ClassName_Set.add(
        "wru__Menu__toggle wru__Menu__isActive"
    );
    window.__localizer__.localizer_Pass_Element_ClassName_Set.add("LanguagesDialog_error_zZskG");

    window.__localizer__.Localizer_Init = function () {
        window.__localizer__.detect_elements.forEach((value, index, set) => {
            let cssSelector = value[0];
            let arg = value[1];
            if (!cssSelector || !arg) return;
            window.__localizer__.localizer_Detect_Elements_CssSelector_Set.add(cssSelector);
            if (!arg.isReplace) {
                let element_arg_list =
                    window.__localizer__.localizer_Detect_Elements_Override_Map.get(cssSelector);
                if (!element_arg_list) {
                    window.__localizer__.localizer_Detect_Elements_Override_Map.set(cssSelector, new Set());
                    window.__localizer__.localizer_Detect_Elements_Override_Map.get(cssSelector).add(arg);
                } else {
                    element_arg_list.add(arg);
                }
            } else {
                let element_arg_list =
                    window.__localizer__.localizer_Detect_Elements_Replace_Map.get(cssSelector);
                if (!element_arg_list) {
                    window.__localizer__.localizer_Detect_Elements_Replace_Map.set(cssSelector, new Set());
                    window.__localizer__.localizer_Detect_Elements_Replace_Map.get(cssSelector).add(arg);
                } else {
                    element_arg_list.add(arg);
                }
            }
        });

        if(window.__localizer__.localizer_mode.mode === "Event")
        {
            window.__localizer__.Localizer_Start_Event_Mode();
        }
        else if(window.__localizer__.localizer_mode.mode === "Polling")
        {
            window.__localizer__.Localizer_Start_Polling_Mode();
        }
    };

    window.__localizer__.Localizer_Start_Event_Mode = function() {
        if(window.__localizer_Event_Mode_Observing__)
        {
            window.__localizer__.localizer_mutationObserver.disconnect();
            window.__localizer__.localizer_mutationObserver.observe(
                document.getRootNode(),
                window.__localizer__.localizer_MutationObserver_Config
            );
            window.__localizer_Event_Mode_Observing__ = true;
        }
        else
        {
            window.__localizer__.localizer_mutationObserver.observe(
                document.getRootNode(),
                window.__localizer__.localizer_MutationObserver_Config
            );
            window.__localizer_Event_Mode_Observing__ = true;
        }
    };

    window.__localizer__.Localizer_Start_Polling_Mode = function() {
        if(window.__localizer_Polling_Mode_Interval_Num__)
        {
            clearInterval(window.__localizer_Polling_Mode_Interval_Num__);
            window.__localizer_Polling_Mode_Interval_Num__ = setInterval(window.__localizer__.Localizer_Work_Polling_Mode, window.__localizer__.localizer_mode.interval);
        }
        else
        {
            window.__localizer_Polling_Mode_Interval_Num__ = setInterval(window.__localizer__.Localizer_Work_Polling_Mode, window.__localizer__.localizer_mode.interval);
        }
    };

    window.__localizer__.Localizer_Work_Event_Mode = function (mutationList, observer) {
        if (window.__localizer__.localizer_Debug.showPerformanceData) { window.__localizer__.localizer_Debug_Execute_Start_Time = performance.now(); }
        for (let mutation of mutationList) {
            if (mutation.type !== "childList") continue;
            if (
                mutation.target.className !== window.__localizer__.localizer_Observe_ClassName_Now &&
                window.__localizer__.localizer_Observe_ClassName_Set.has(mutation.target.className)
            ) {
                observer.disconnect();
                observer.observe(mutation.target, window.__localizer__.localizer_MutationObserver_Config);
                return;
            }
            if (window.__localizer__.localizer_Debug.showMutationTargetClassName) console.log(mutation.target.className);
            if (
                !window.__localizer__.localizer_Pass_Element_Id_Set.has(mutation.target.id) &&
                !window.__localizer__.localizer_Pass_Element_ClassName_Set.has(mutation.target.className)
            )
                return;
            window.__localizer__.localizer_Detect_Elements_CssSelector_Set.forEach(
                (cssSelector, index, set) => {
                    let targetElementsList = document.querySelectorAll(cssSelector);
                    targetElementsList.forEach((element, index, list) => {
                        if (!element.innerText) return;
                        let override_arg_list =
                            window.__localizer__.localizer_Detect_Elements_Override_Map.get(cssSelector);
                        if (override_arg_list) {
                            override_arg_list.forEach((arg, index, list) => {
                                var temp_translated_str = window.__localizer__.translation.get(
                                    arg.isReplaceHTML ? element.innerHTML : element.innerText
                                );
                                if (!temp_translated_str) return;
                                if (arg.isReplaceHTML) {
                                    if (element.innerHTML === temp_translated_str) return;
                                    element.innerHTML = temp_translated_str;
                                } else {
                                    if (element.innerText === temp_translated_str) return;
                                    element.innerText = temp_translated_str;
                                }
                            });
                        }
                        let replace_arg_list =
                            window.__localizer__.localizer_Detect_Elements_Replace_Map.get(cssSelector);
                        if (replace_arg_list) {
                            replace_arg_list.forEach((arg, index, list) => {
                                if (arg.isReplace !== true) return;
                                var temp_translated_str = arg.isReplaceHTML
                                    ? element.innerHTML
                                    : element.innerText;
                                arg.translation.forEach((value, index, array) => {
                                    temp_translated_str = temp_translated_str.replaceAll(
                                        value[0],
                                        value[1]
                                    );
                                });
                                if (arg.isReplaceHTML) {
                                    if (element.innerHTML === temp_translated_str) return;
                                    element.innerHTML = temp_translated_str;
                                } else {
                                    if (element.innerText === temp_translated_str) return;
                                    element.innerText = temp_translated_str;
                                }
                            });
                        }
                    });
                }
            );
        }
        if (window.__localizer__.localizer_Debug.showPerformanceData) { console.log(`Localizer Work Time: ${ (performance.now() - window.__localizer__.localizer_Debug_Execute_Start_Time).toFixed(2)} ms`); }
    };

    window.__localizer__.Localizer_Work_Polling_Mode = function () {
        if (window.__localizer__.localizer_Debug.showPerformanceData) { window.__localizer__.localizer_Debug_Execute_Start_Time = performance.now(); }
        window.__localizer__.localizer_Detect_Elements_CssSelector_Set.forEach(
            (cssSelector, index, set) => {
                let targetElementsList = document.querySelectorAll(cssSelector);
                targetElementsList.forEach((element, index, list) => {
                    if (!element.innerText) return;
                    let override_arg_list =
                        window.__localizer__.localizer_Detect_Elements_Override_Map.get(cssSelector);
                    if (override_arg_list) {
                        override_arg_list.forEach((arg, index, list) => {
                            var temp_translated_str = window.__localizer__.translation.get(
                                arg.isReplaceHTML ? element.innerHTML : element.innerText
                            );
                            if (!temp_translated_str) return;
                            if (arg.isReplaceHTML) {
                                if (element.innerHTML === temp_translated_str) return;
                                element.innerHTML = temp_translated_str;
                            } else {
                                if (element.innerText === temp_translated_str) return;
                                element.innerText = temp_translated_str;
                            }
                        });
                    }
                    let replace_arg_list =
                        window.__localizer__.localizer_Detect_Elements_Replace_Map.get(cssSelector);
                    if (replace_arg_list) {
                        replace_arg_list.forEach((arg, index, list) => {
                            if (arg.isReplace !== true) return;
                            var temp_translated_str = arg.isReplaceHTML
                                ? element.innerHTML
                                : element.innerText;
                            arg.translation.forEach((value, index, array) => {
                                temp_translated_str = temp_translated_str.replaceAll(
                                    value[0],
                                    value[1]
                                );
                            });
                            if (arg.isReplaceHTML) {
                                if (element.innerHTML === temp_translated_str) return;
                                element.innerHTML = temp_translated_str;
                            } else {
                                if (element.innerText === temp_translated_str) return;
                                element.innerText = temp_translated_str;
                            }
                        });
                    }
                });
            }
        );
        if (window.__localizer__.localizer_Debug.showPerformanceData) { console.log(`Localizer Work Time: ${ (performance.now() - window.__localizer__.localizer_Debug_Execute_Start_Time).toFixed(2)} ms`); }
    };

    window.__localizer__.localizer_mutationObserver = new MutationObserver(
        (mutationList, observer) => {
            setTimeout(() => {
                window.__localizer__.Localizer_Work_Event_Mode(mutationList, observer);
            }, 100);
        }
    );

    window.__localizer__.detect_elements = new Set();
    window.__localizer__.translation = new Map();
}
})();