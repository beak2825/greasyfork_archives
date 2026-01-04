// ==UserScript==
// @name         战舰世界莱服网页汉化-代码-框架
// @namespace    https://github.com/windofxy
// @version      202503051039
// @description  战舰世界莱服网页汉化-代码
// @author       Windofxy
// @icon         https://gh-proxy.net/github.com/OpenKorabli/Korabli-InGameBrowser-L10n-CHS/blob/main/Tampermonkey%20Script/icon128.png
// @grant        none
// @license      MIT
// ==/UserScript==

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