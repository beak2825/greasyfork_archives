// ==UserScript==
// @name         YY直播绿化
// @namespace    https://github.com/MiaoZang
// @version      1.1
// @description  🔥功能介绍🔥：🎉 YY直播绿化
// @author       MiaoZang
// @match        https://www.yy.com/22490906
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        GM_setValue
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/493792/YY%E7%9B%B4%E6%92%AD%E7%BB%BF%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/493792/YY%E7%9B%B4%E6%92%AD%E7%BB%BF%E5%8C%96.meta.js
// ==/UserScript==
(async () => {
    function sleepMZ(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function 打印日志(内容) {
        //内容文本的前面加上 时间
        var now = new Date();
        var time = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
        console.log("[" + time + "] " + 内容);
    }
    window.sleep = function (ms) { return new Promise(resolve => setTimeout(resolve, ms || 1000)) };

    async function 隐藏内容(内容css, 延迟) {
        if (延迟 == true) {
            await sleepMZ(3 * 1000);
            do { await sleepMZ(500); } while (document.querySelectorAll(内容css).length = 0); await sleepMZ(500);
        }
        let elements99 = document.querySelectorAll(内容css);
        for (let i = 0; i < elements99.length; i++) {
            elements99[i].style.opacity = '0'; // 设置元素透明度为0（完全透明）
            elements99[i].style.display = 'none'; // 隐藏元素
            // 打印日志（使用正确的拼接方式）
            if (延迟 == true) { 打印日志(内容css + "  隐藏  io = " + (i + 1)); }
            else { 打印日志(内容css + "  隐藏无延迟  io = " + (i + 1)); }
        }
    }

    隐藏内容(".yyplayer__ext-layer", false);
    隐藏内容(".w-allcombo", false);
    隐藏内容(".w-combo", false);

    await window.sleep(3000);
    do { await window.sleep(500); } while (document.querySelectorAll('[title="影院模式"]').length = 0); await window.sleep(500);
    打印日志("点击 影院模式"); document.querySelectorAll('[title="影院模式"]')[0].click();
    do { await window.sleep(500); } while (document.querySelectorAll('[title="关闭弹幕"]').length = 0); await window.sleep(500);
    打印日志("点击 关闭弹幕"); document.querySelectorAll('[title="关闭弹幕"]')[0].click();

    打印日志("删除公屏");
    do { await window.sleep(500); } while (document.querySelectorAll('.yycom_live-sidebar').length = 0); await window.sleep(500);
    let elements1 = document.querySelectorAll('.yycom_live-sidebar');
    for (let i = 0; i < elements1.length; i++) {
        elements1[i].parentNode.removeChild(elements1[i]);
    }

    打印日志("播放器1   宽度 100%");
    let element2 = document.querySelector('#wLiveplayer');
    element2.style.width = '100%';

    打印日志("播放器2   bottom 0px");
    let element3 = document.querySelector('.yycom_live-video_area-main');
    element3.style.bottom = '0px';

    await window.sleep(1000);
    打印日志("删除礼物区");
    do { await window.sleep(500); } while (document.querySelectorAll('.yycom_live-video_area-giftbar').length = 0); await window.sleep(500);
    let elements4 = document.querySelectorAll('.yycom_live-video_area-giftbar');
    for (let i = 0; i < elements4.length; i++) {
        elements4[i].parentNode.removeChild(elements4[i]);
    }

    打印日志("删除 左侧栏");
    await window.sleep(500);
    let elements6 = document.querySelectorAll('.drawer-collapse');
    for (let i = 0; i < elements6.length; i++) {
        elements6[i].parentNode.removeChild(elements6[i]);
    }

    隐藏内容(".yyplayer__ext-layer", false);
    隐藏内容(".w-allcombo", false);
    隐藏内容(".w-combo", false);

    打印日志("确定弹窗");
    //点击 确定弹窗
    for (let io = 0; io < 10; io++) {//最外层循环
        await window.sleep(1000);//延迟
        if (document.querySelectorAll('[style="display: block; z-index: 11;"]').length > 0) {
            打印日志(document.querySelectorAll('[style="display: block; z-index: 11;"]'));
            document.querySelectorAll('[style="display: block; z-index: 11;"]  .yex__popup__ok-btn')[0].click();
            break; // 跳出最外层循环
        }
    }

    await window.sleep(1000);
    打印日志("点击 刷新");
    document.querySelectorAll('[title="刷新"]')[0].click();

    await window.sleep(1000);//延迟

    隐藏内容(".yyplayer__ext-layer", true);
    隐藏内容(".w-allcombo", true);
    隐藏内容(".w-combo", true);

    打印日志("脚本结束");

})
    ();