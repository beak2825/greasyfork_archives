// ==UserScript==
// @name               自研 - 母带吧 - 调整音量
// @name:en_US         Self-made - MuDaiBa MUSIC BBS - Adjust volume
// @description        调整在线播放器音量。
// @description:en_US  Adjust the volume of the online player.
// @version            1.0.1
// @author             CPlayerCHN
// @license            MulanPSL-2.0
// @namespace          https://www.gitlink.org.cn/CPlayerCHN
// @match              https://mudaiba.com/thread-*.htm
// @icon               https://mudaiba.com/view/img/favicon.ico
// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM_registerMenuCommand
// @run-at             document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/501624/%E8%87%AA%E7%A0%94%20-%20%E6%AF%8D%E5%B8%A6%E5%90%A7%20-%20%E8%B0%83%E6%95%B4%E9%9F%B3%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/501624/%E8%87%AA%E7%A0%94%20-%20%E6%AF%8D%E5%B8%A6%E5%90%A7%20-%20%E8%B0%83%E6%95%B4%E9%9F%B3%E9%87%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 从「音量值」数据中提取并定义对应变量，定义「获取音量值」和「插入脚本」函数。
    var volume = GM_getValue("volume");

    function getVolume() {

        // 判断「音量值」变量是否被定义且数值是否合规，如果不满足判断就记录并保存。
        do {

            insertScript("ap4.pause()");
            volume = window.prompt("请输入您期望的音量。", GM_getValue("volume", 10));
            GM_setValue("volume", volume);
            insertScript("if(ap4.audio.currentTime !== 0) { ap4.play() }");

        } while(typeof volume !== undefined && !(volume > 0 && volume <= 100));

    };
    function insertScript(script = `ap4.volume(${volume * 0.01}, true);`) {

        // 将修改音量的代码插入页面尾部，并在执行后自动销毁。
        const scripts = document.createElement('script');

        scripts.textContent = script;
        document.body.appendChild(scripts);

        scripts.remove();

    }


    // 调整音量；判断「音量值」是否被定义，如果通过判断就执行「获取音量值」函数。
    if(typeof volume === "undefined") {

        getVolume();

    }
    // 调整音量；增加「修改音量」菜单命令。
    GM_registerMenuCommand("设置新音量", () => {

        getVolume();
        insertScript();

    });
    // 调整音量；监听按下`.`键。
    document.addEventListener("keydown", (event) => {

        if (event.key === '.') {

            getVolume();
            insertScript();

        }

    });
    // 调整音量；脚本执行时。
    insertScript();

})();