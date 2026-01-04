// ==UserScript==
// @name                Steam、Epic历史价格查询
// @name:zh-TW          Steam、Epic歷史價格查詢
// @name:en             Steam and Epic Historical Price Lookup
// @name:ja             Steam and Epic Historical Price Lookup
// @name:ko             Steam and Epic Historical Price Lookup
// @name:ru             Steam and Epic Historical Price Lookup
// @description         跳转到SteamDB、EpicGamesDB，兼容via和x浏览器
// @description:zh-TW   跳轉到 SteamDB、EpicGamesDB，兼容via和x瀏覽器
// @description:en      Navigate to SteamDB, EpicGamesDB, compatible with Via and X browsers
// @description:ja      Navigate to SteamDB, EpicGamesDB, compatible with Via and X browsers
// @description:ko      Navigate to SteamDB, EpicGamesDB, compatible with Via and X browsers
// @description:ru      Navigate to SteamDB, EpicGamesDB, compatible with Via and X browsers
// @author       shopkeeperV
// @namespace    https://greasyfork.org/zh-CN/users/150069
// @version      1.1.7
// @run-at       document-end
// @match        https://store.steampowered.com/*
// @match        https://store.epicgames.com/*
// @downloadURL https://update.greasyfork.org/scripts/471532/Steam%E3%80%81Epic%E5%8E%86%E5%8F%B2%E4%BB%B7%E6%A0%BC%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/471532/Steam%E3%80%81Epic%E5%8E%86%E5%8F%B2%E4%BB%B7%E6%A0%BC%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let host = location.host;
    let path = location.pathname;
    let db_url;
    if (/steampowered/.test(host)) {
        let page_type;
        let title_eles;
        let page_id = path.match(/\/([0-9]*?)\//i)[1];
        if (/app/.test(path)) {
            title_eles = document.getElementsByClassName("apphub_AppName");
            let wrappers = document.getElementsByClassName("game_area_purchase_game_wrapper");
            page_type = "app";
            //@run-at声明在各浏览器中表现不一致，所以为了兼容麻烦得要死
            let wait = function () {
                if (title_eles.length > 0 && wrappers.length > 0) {
                    for (let wrapper of wrappers) {
                        let item_type;
                        let item_id;
                        let forms = wrapper.getElementsByTagName("form");
                        if (forms.length < 0) {
                            continue;
                        }
                        let inputs = forms[0].getElementsByTagName("input");
                        for (let input of inputs) {
                            if (/subid|bundleid/.test(input.name)) {
                                if (/subid/.test(input.name)) {
                                    item_type = "sub";
                                } else if (/bundleid/.test(input.name)) {
                                    item_type = "bundle";
                                }
                                item_id = input.value;
                                break;
                            }
                        }
                        db_url = "https://steamdb.info/" + item_type + "/" + item_id + "/#pricehistory";
                        let titles = wrapper.getElementsByClassName("title");
                        if (titles.length > 0) {
                            titles[0].appendChild(createASpan(db_url));
                        }
                    }
                    set();
                } else {
                    setTimeout(wait, 500);
                }
            }
            wait();
        } else {
            title_eles = document.getElementsByClassName("pageheader");
            if (/sub/.test(path)) {
                page_type = "sub";
            } else if (/bundle/.test(path)) {
                page_type = "bundle";
            } else return;
            let wait = function () {
                if (title_eles.length > 0) {
                    set();
                } else {
                    setTimeout(wait, 500);
                }
            }
            wait();
        }

        function set() {
            for (let title_ele of title_eles) {
                db_url = "https://steamdb.info/" + page_type + "/" + page_id + "/#pricehistory";
                title_ele.appendChild(createASpan(db_url));
            }
        }
    }
    if (/epicgames/.test(host)) {
        //跳过年龄验证
        document.cookie = `HasAcceptedAgeGates=Generic%3A18;path=/`;
        let loop_times = 0;
        handler();
        //onurlchange兼容性不佳
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        //popstate事件监听不到，可以拦截相应方法达到同样的效果
        history.pushState = function (state) {
            originalPushState.apply(history, arguments);
            console.log("Epic历史价格查询：监听到地址变化。pushState()调用。");
            handler();
        };
        //此方法只是备用，epic并不是用这个
        history.replaceState = function (state) {
            originalReplaceState.apply(history, arguments);
            console.log("Epic历史价格查询：监听到地址变化，replaceState()调用。");
            handler();
        };

        function handler() {
            if (loop_times >= 60) {
                loop_times = 0;
                console.log("Epic历史价格查询：取消循环。");
                return;
            }
            if (/\/p\//.test(location.pathname)) {
                console.log("Epic历史价格查询：正在获取页面id...");
                let ele1 = document.getElementById("_schemaOrgMarkup-Product");
                let ele2 = document.getElementById("btn_age_continue");
                if (ele1 && !ele2 && !ele1.getAttribute("price_db")) {
                    ele1.setAttribute("price_db", "price_db");
                    loop_times = 0;
                    console.log("Epic历史价格查询：已添加查询按钮。");
                    let content = ele1.textContent;
                    let id = content.match(/"sku":"([^"]*):([^"]*)"/)[2];
                    db_url = "https://egdata.app/offers/" + id + "/price";
                    document.getElementsByTagName("h1")[0].appendChild(createASpan(db_url));
                } else {
                    loop_times++;
                    setTimeout(handler, 500);
                }
            }
        }
    }

    function createASpan(url) {
        let span = document.createElement("span");
        span.setAttribute("class", "history_price");
        span.textContent = "查价";
        span.style.cssText = "display:inline-block;margin-left:10px;color:yellow;cursor:pointer;";
        span.onclick = (e) => {
            window.open(url);
        };
        return span;
    }
})();