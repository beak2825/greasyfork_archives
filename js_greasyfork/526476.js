// ==UserScript==
// @name         其乐论坛标记EPIC送过的游戏
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  标记EPIC送过的游戏
// @author       浮生若萌
// @license      MIT
// @match        *://keylol.com/t*
// @match        *://keylol.com/forum.php?mod=viewthread&tid*
// @match        *://store.steampowered.com/app*
// @grant        GM_registerMenuCommand
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/526476/%E5%85%B6%E4%B9%90%E8%AE%BA%E5%9D%9B%E6%A0%87%E8%AE%B0EPIC%E9%80%81%E8%BF%87%E7%9A%84%E6%B8%B8%E6%88%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/526476/%E5%85%B6%E4%B9%90%E8%AE%BA%E5%9D%9B%E6%A0%87%E8%AE%B0EPIC%E9%80%81%E8%BF%87%E7%9A%84%E6%B8%B8%E6%88%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 注册更新EPIC记录的菜单
    GM_registerMenuCommand('更新EPIC记录', async () => {
        window.open('https://keylol.com/t596303-1-1');//感谢论坛大佬 万狐飞仙
    });

    // 清空EPIC记录
    GM_registerMenuCommand('清空全部记录', async () => {
        var r = confirm('确认吗？清空后你需要重新"更新EPIC记录"');
        if (r == true) {
            var allValues = GM_listValues();
            for (var i = 0; i < allValues.length; i++) {
                var value = allValues[i];
                GM_deleteValue(value);
            }
        }
    });

    // 标记EPIC送过的游戏
    function marking() {
        var mark = -1;
        if (window.location.href == 'https://keylol.com/t596303-1-1') {
            mark = 2;
        }

        if (mark > 0) {
            var r = confirm('要更新记录吗？');
            if (r == true) {
                GM_setValue('EpicWeeklyMark_v', '100');
                GM_setValue('49520', 2); // 无主之地2本体
                GM_setValue('234650', 2); // 示例EPIC游戏1
                GM_setValue('362960', 2); // 示例EPIC游戏2
                GM_setValue('291650', 2); // 示例EPIC游戏3

                var workingGroup = document.querySelectorAll("a[class^='steam-info-link']");
                for (var j = 0; j < workingGroup.length; j++) {
                    if (workingGroup[j].href.match(/\/app\/\d+[\?\/]/) != null) {
                        let gameid = workingGroup[j].href.match(/\d+/)[0]; // 确保获取到游戏ID
                        if (GM_getValue(gameid) != null) {
                            var tempGet = GM_getValue(gameid);
                            if (tempGet != mark && tempGet < 3) {
                                GM_setValue(gameid, 3); // EPIC和其他标记
                            } else if (tempGet < 3) {
                                GM_setValue(gameid, mark);
                            }
                        } else {
                            GM_setValue(gameid, mark);
                        }
                    }
                }

                console.log('记录完毕');
            }
        }
    }

    marking();

    // 显示EPIC送过的游戏标签
    if (GM_getValue('EpicWeeklyMark_v') != null) {
        var addStrSet = [' ', '<EPIC送过>'];
        if (location.href.match(/store.steampowered.com\/app/)) {
            let gameid = location.href.match(/\d+/)[0]; // 获取当前页面的游戏ID
            if (GM_getValue(gameid) != null) {
                let value = GM_getValue(gameid);
                if (value === 2 || value === 3) { // 只有EPIC标记或两者都有时才加标签
                    document.querySelector("#appHubAppName").textContent = addStrSet[1] + document.querySelector("#appHubAppName").textContent;
                }
            }
        } else {
            var workingGroup = document.querySelectorAll("a[class^='steam-info-link']");
            for (var j = 0; j < workingGroup.length; j++) {
                if (workingGroup[j].href.match(/\/app\/\d+[\?\/]/) != null) {
                    let gameid = workingGroup[j].href.match(/\d+/)[0]; // 获取游戏ID
                    if (GM_getValue(gameid) != null) {
                        let value = GM_getValue(gameid);
                        if (value === 2 || value === 3) { // 只有EPIC标记或两者都有时才加标签
                            workingGroup[j].text = addStrSet[1] + workingGroup[j].text;
                        }
                    }
                }
            }
            console.log('标记完毕');
        }
    }
})();
