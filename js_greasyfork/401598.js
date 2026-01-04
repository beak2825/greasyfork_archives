// ==UserScript==
// @name         Steam 免费游戏永久入库脚本
// @namespace    https://greasyfork.org/zh-CN/scripts/401598
// @version      0.3.2
// @description  steamdb.info屏蔽周末临时免费   Steam 免费游戏永久入库脚本
// @author       Boys
// @match        *://steamdb.info/*
// @match        *://store.steampowered.com/*
// @icon         https://store.steampowered.com/favicon.ico
// @note         2020年5月12日 修复了一些的问题
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/401598/Steam%20%E5%85%8D%E8%B4%B9%E6%B8%B8%E6%88%8F%E6%B0%B8%E4%B9%85%E5%85%A5%E5%BA%93%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/401598/Steam%20%E5%85%8D%E8%B4%B9%E6%B8%B8%E6%88%8F%E6%B0%B8%E4%B9%85%E5%85%A5%E5%BA%93%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
(function () {
    // 注册上下文菜单
    GM_registerMenuCommand("打开Free Promotions", function () {
        window.open("https://steamdb.info/upcoming/free/", "_blank");
    });
    GM_registerMenuCommand("打开Steam licenses", function () {
        window.open("https://store.steampowered.com/account/licenses/", "_blank");
    });
})();
// 数组为空的判断
Array.prototype.notempty = function () {
    let arr = [];
    this.map(function (val, index) {
        if (val !== "" && val != undefined) {
            arr.push(val);
        };
    });
    return arr;
};
// 等待元素出现
jQuery.fn.wait = function (func, times, interval,funf) {
    var _times = times || -1, //默认永远等待
        _interval = interval || 20, //20毫秒每次
        _self = this,
        _selector = this.selector, //选择器
        _iIntervalID; //定时器id
    if( this.length ){ //如果已经获取到了，就直接执行函数
        func && func.call(this);
    } else {
        _iIntervalID = setInterval(function() {
            if(!_times) { //是0就执行等待超时失败的处理函数并退出
                funf && funf.call(this);
                clearInterval(_iIntervalID);
            };
            _times <= 0 || _times--; //如果是正数就 --
            _self = $(_selector); //再次选择
            if( _self.length ) { //判断是否取到
                func && func.call(_self);
                clearInterval(_iIntervalID);
            };
        }, _interval);
    };
    return this;
};
jQuery(function($) {
    'use strict';
    function load_licenses(res) {
        if (typeof res == "undefined" || res == null || res.replace(/\s*/g, "") == "" || !res) return;
        if (location.hostname !== 'store.steampowered.com') {
            alert('Run this code on theSteamStore!');
            return;
        } else if (typeof jQuery !== 'function') {
            ShowAlertDialog('Fail', 'This page has no jQuery, try homepage.');
            return;
        } else if (document.getElementById('header_notification_area') === null) {
            ShowAlertDialog('Fail', 'You have to be logged in.');
            return;
        };
        let freePackages = res.replace(/\s*/g, "").split(",").notempty();
        let ownedPackages = {};
        $('.account_table a').each(function (i, el) {
            const match = el.href.match(/javascript:RemoveFreeLicense\( ([0-9]+), '/);
            if (match !== null) {
                ownedPackages[+match[1]] = true;
            };
        });
        let loaded = 0,
            packages = 0,
            total = freePackages.length,
            modal = ShowBlockingWaitDialog('努力执行中...', '请耐心等待，如果有错误请无视，请耐心等待脚本加载完毕');
        for (let i = 0; i < total; i++) {
            packages = freePackages[i];
            if (ownedPackages[packages]) {
                loaded++;
                continue;
            };
            jQuery.post('//store.steampowered.com/checkout/addfreelicense', {
                action: 'add_to_cart',
                sessionid: g_sessionID,
                subid: packages
            }).always(function () {
                loaded++;
                modal.Dismiss();
                if (loaded >= total) {
                    GM_setValue("steam_db_free_info_store_ok", true);
                    console.log("[信息] set steam_db_free_info_store_ok=" + true);
                    ShowAlertDialog('任务执行完成', '请刷新网页查看....');
                    // location.reload();
                } else {
                    modal = ShowBlockingWaitDialog('执行中...', '加载至 <b>' + loaded + '</b>/' + total + '.');
                };
            });//always-end
        };//for-end
    };//load_licenses-end
    function flashing_prompt(count, time) {
        let timeout
        function clear() {
            --count
            if (count === 0) {
                clearInterval(timeout)
            }
        }
        function exec() {
            $("#dark-mode-toggle .dark-mode-slider").click()
            clear();
        }
        timeout = setInterval(() => {
            exec();
        }, time)
    };//flashing_prompt-end
    function exec() {
        $("td").each(function () { // 移除周末临时免费
            if ($(this).text() == "Weekend") $(this).parent().remove();
        })
        let v = "";
        $(".timeago:even").each(function (index, value, array) {
            if ($(this).text().indexOf("ago") == -1)
                return false;
            else
                v += $(this).parent().attr("data-subid") + ",";
        })
        if (GM_getValue("steam_db_free_info_store_ok") != true) flashing_prompt(10, 500);
        let oldValue = GM_getValue("steam_db_free_info_store")
        console.log("[信息] get steam_db_free_info_store=" + oldValue);
        if (oldValue === v) return;
        let freePackages = v.replace(/\s*/g, "").split(",").notempty();
        if (freePackages.forEach(function (value, index, array) {
            if (oldValue == "undefined" || oldValue == null) return false;
            if (value == "undefined" || value == null) return false;
            if (oldValue.indexOf(value) == -1) return false;
        })) return;
        flashing_prompt(10, 500);
        GM_setValue("steam_db_free_info_store", v);
        GM_setValue("steam_db_free_info_store_ok", false);
        console.log("[信息] set steam_db_free_info_store=" + v);
        console.log("[信息] set steam_db_free_info_store_ok=" + false);
    };
    let local = window.location.href;
    if (local.indexOf("steamdb.info/upcoming/free") != -1) {
        $(".dark-mode-slider").wait(function() { //等待class='dark-mode-slider'的元素加载完成
            exec();
        },200,20,function() {
            console.log("[信息] 等待页面加载完成超时，请刷新网页后重试");
        });
        return;
    };
    if (local.indexOf("store.steampowered.com/account/licenses") != -1) {
        $("#footer").wait(function(){
            let res = GM_getValue("steam_db_free_info_store");
            let v = GM_getValue("steam_db_free_info_store_ok");
            console.log("[信息] get steam_db_free_info_store=" + res);
            console.log("[信息] get steam_db_free_info_store_ok=" + v);
            if (v == true) return;
            load_licenses(res);
        },200,20,function() {
            console.log("[信息] 等待页面加载完成超时，请刷新网页后重试");
        });
        return;
    };
});