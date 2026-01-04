// ==UserScript==
// @name         Sweat Baby公司检测!
// @name:en      Sweat Baby Detect for Steam!
// @namespace    http://tampermonkey.net/
// @version      2024-03-26
// @description  检测Sweat Baby制作的游戏并在Steam页面上标识！
// @description:en Sweat Baby Detect!
// @author       Cliencer Goge
// @match        https://store.steampowered.com/app/*
// @icon         data:image/jpeg;base64,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
// @license GPLv3
// @downloadURL https://update.greasyfork.org/scripts/490892/Sweat%20Baby%E5%85%AC%E5%8F%B8%E6%A3%80%E6%B5%8B%21.user.js
// @updateURL https://update.greasyfork.org/scripts/490892/Sweat%20Baby%E5%85%AC%E5%8F%B8%E6%A3%80%E6%B5%8B%21.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 检测网页语言
    var lang = document.documentElement.lang || navigator.language;
    const locolization_en={SBID:"Sweat Baby Inc detect!"}
    const locolization_zhcn={SBID:"检测到该游戏有Sweat Baby公司参与制作！"}
    const locolization_zhtw={SBID:"檢測到該遊戲有Sweat Baby公司參與制作！"}
    // 决定显示语言
    var locolization;
    switch(lang) {
        case 'zh-cn':
            locolization = locolization_zhcn; // 简体中文
            break;
        case 'zh-tw':
            locolization = locolization_zhtw; // 繁体中文
            break;
        case 'en':
            locolization = locolization_en; // 英语
            break;
        default:
            locolization = locolization_en; // 默认英语
    }
    const SBIGamelist=[
        315210,
        623280,
        757310,
        794540,
        1310330,
        1421290,
        1477940,
        1496790,
        1534840,
        1545560,
        1599780,
        1823210,
        1832040,
        1934570,
        1956040,
        2208920,
        2316580,
        2702430]
    var AppID=getAppID()
    // 检查AppID是否在SBIGamelist数组中
    if (SBIGamelist.includes(AppID)) {
        console.log("AppID", AppID, "在SBIGamelist中找到了！");
        InsertMessage(true)
    } else {
        console.log("AppID", AppID, "不在SBIGamelist中。");
        //InsertMessage(false)
        //计划制作投票举报功能，希望能有好心人赞助服务器
        //Plan to create a voting and reporting feature, hoping for kind-hearted people to sponsor the server.
    }



    function getAppID() {
        // 获取当前页面的URL
        const currentUrl = window.location.href;
        // 数字总是出现在 /app/ 和 / 之间
        const match = currentUrl.match(/\/app\/(\d+)\//);
        // 检查匹配项并获取数字
        if (match && match.length > 1) {
            return parseInt(match[1], 10); // 将提取的字符串转换为数字
        } else {
            return false
        }
    }


    function InsertMessage(yes) {
        // 查找页面上第一个具有指定类名的div元素
        var targetDiv = document.querySelector('.game_media_and_summary_ctn');
        // 检查是否找到目标元素
        if (targetDiv) {
            // 创建新的div元素
            var newDiv = document.createElement('div');
            newDiv.className = 'referring_curator_ctn'; // 设置类名
            // 设置要插入的HTML内容
            newDiv.innerHTML = `
            <div class="page_content">
                <div data-panel='{"type":"PanelGroup","flow-children":"row"}' class="referring_curator ">
                    <div class="curator_detail_right_ctn no_video">
                        <div class="blurb">
                            <p>`+locolization.SBID+`</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 将新创建的div元素插入到找到的元素之后
        targetDiv.parentNode.insertBefore(newDiv, targetDiv.nextSibling);
        }
    }
})();