// ==UserScript==
// @name         非全自动美团神龙召唤
// @namespace    https://github.com/ocyss
// @version      2025-06-23
// @description  教程来源参考 https://linux.do/t/topic/743802
// @author       Ocyss
// @match        https://mp.weixin.qq.com/wxawap/wapreportwxadevlog?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=meituan.com
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        window.close
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540585/%E9%9D%9E%E5%85%A8%E8%87%AA%E5%8A%A8%E7%BE%8E%E5%9B%A2%E7%A5%9E%E9%BE%99%E5%8F%AC%E5%94%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/540585/%E9%9D%9E%E5%85%A8%E8%87%AA%E5%8A%A8%E7%BE%8E%E5%9B%A2%E7%A5%9E%E9%BE%99%E5%8F%AC%E5%94%A4.meta.js
// ==/UserScript==

// 模式配置：true为弹窗模式，false为通知模式自动复制+关闭
const CONFIRM_MODE = true;


(function() {
    'use strict';

    const urlParams = new URLSearchParams(location.search);

    // 尝试从pageid参数中提取poi_id_str
    let poiIdStr = null;
    const pageid = urlParams.get('pageid');

    if (pageid) {
        // 使用正则表达式从pageid中提取poi_id_str
        const match = pageid.match(/poi_id_str=([^&]+)/);
        if (match && match[1]) {
            poiIdStr = decodeURIComponent(match[1]);
        }
    }

    // 如果上面没找到，再尝试直接从URL参数中获取
    if (!poiIdStr) {
        poiIdStr = urlParams.get('poi_id_str');
    }

    if (!poiIdStr) {
        alert('未找到poi_id_str参数');
        return;
    }

    const magicLink = `packages/restaurant/restaurant/restaurant?poi_id_str=${poiIdStr}&allowance_alliance_scenes=1100&poi_id=67890&ad_activity_flag={"adActivityFlag":"100","type":0}`;

    if (CONFIRM_MODE) {
        if (confirm(`神龙链接已生成！\n\n${magicLink}\n\n点击确定复制到剪切板`)) {
            GM_setClipboard(magicLink);
        }
    } else {
        GM_setClipboard(magicLink);
        GM_notification({
            text: '神龙链接已复制到剪切板！',
            title: '美团神龙召唤',
            timeout: 1000
        });
        window.close();
    }
})();