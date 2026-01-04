// ==UserScript==
// @name         MuseDash.moe 过滤低级歌曲
// @namespace    https://space.bilibili.com/383235432/
// @version      1.0.3
// @description  MuseDash.moe 筛选掉低等级的歌曲 个人主页https://space.bilibili.com/383235432/
// @author       无敌小钢炮
// @match        *://musedash.moe/player/*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://musedash.moe&size=64
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/482572/MuseDashmoe%20%E8%BF%87%E6%BB%A4%E4%BD%8E%E7%BA%A7%E6%AD%8C%E6%9B%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/482572/MuseDashmoe%20%E8%BF%87%E6%BB%A4%E4%BD%8E%E7%BA%A7%E6%AD%8C%E6%9B%B2.meta.js
// ==/UserScript==

(function() {

    const digits = [
        ``,
        `1️⃣`,
        `2️⃣`,
        `3️⃣`,
        `4️⃣`,
        `5️⃣`,
        `6️⃣`,
        `7️⃣`,
        `8️⃣`,
        `9️⃣`,
        `🔟`,
        `⏸️`,
    ]
    let LeastLevel = 8, is_run = true
    function registerMenuCommand() {
        if (GM_getValue(LeastLevel) == null){GM_setValue(LeastLevel, 8)};
        if (GM_getValue(is_run) == null){GM_setValue(is_run, true)};

        let menu_ID = [], menu_ID_Content = [];
        let level_content = `${digits[GM_getValue(LeastLevel)]} 筛选歌曲等级`
        menu_ID[0] = GM_registerMenuCommand(level_content, function () {menu_switch(LeastLevel, (GM_getValue(LeastLevel)) % 11 + 1)})
        menu_ID_Content[0] = level_content
        menu_ID[1] = GM_registerMenuCommand(`🔄️重置等级`, function () {menu_switch(LeastLevel, 8)})
        menu_ID_Content[1] = `重置等级`
        let is_run_content = `${GM_getValue(is_run)?'✅':'❎'} 开关`
        menu_ID[2] = GM_registerMenuCommand(is_run_content, function () {menu_switch(is_run, !GM_getValue(is_run))})
        menu_ID_Content[2] = is_run_content
        menu_ID[3] = GM_registerMenuCommand(`🐧 3083842408`, function () {GM_setClipboard(`3083842408`, `text`); GM_notification({text: `QQ已复制\n`, timeout: 3500});});
        menu_ID_Content[3] = `🐧 3083842408`

        //切换选项
        function menu_switch(name, value){
            GM_setValue(name, value);
//            registerMenuCommand(); // 重新注册脚本菜单
            location.reload(); // 刷新网页
            registerMenuCommand(); // 重新注册脚本菜单
        }
    }

    registerMenuCommand();
    if(GM_getValue(is_run)){
        HideLevel();
    }

    function HideLevel() {
        // 查找所有包含 Lv. 的元素
        var elements = document.querySelectorAll('.level-item .title.is-3.is-spaced');

        // 循环遍历每个元素
        elements.forEach(function(element) {
            // 获取 Lv. 后面的数字的元素
            var subtitleElement = element.querySelector('.subtitle.is-6');

            // 检查是否找到了 subtitle 元素
            if (subtitleElement) {
                // 获取 Lv. 后面的数字
                var level = parseInt(subtitleElement.textContent.replace('Lv.', '').trim());

                // 隐藏 Lv. 低于 x 的元素及其父元素
                if (level < GM_getValue(LeastLevel)) {
                    var parentNavElement = element.closest('.level');
                    if (parentNavElement) {
                        parentNavElement.style.display = 'none';
                    }
                }
            }
        });
    }


})();





