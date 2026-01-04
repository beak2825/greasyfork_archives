// ==UserScript==
// @name         N0ts - 美和易思自动切换刷课
// @namespace    N0ts
// @version      0.0.4
// @description  自动切换下一课，倍速播放，取消鼠标限制，彻底解脱双手
// @author       N0ts
// @match        *://www.51moot.cn/server_hall_2/server_hall_2/*
// @match        *://www.51moot.net/server_hall_2/server_hall_2/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js
// @downloadURL https://update.greasyfork.org/scripts/412584/N0ts%20-%20%E7%BE%8E%E5%92%8C%E6%98%93%E6%80%9D%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/412584/N0ts%20-%20%E7%BE%8E%E5%92%8C%E6%98%93%E6%80%9D%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function () {
    console.log(`[N0ts]：正在加载插件！`);
    // 获取整个页面
    axios.get(window.location.href).then(res => {
        console.log(`[N0ts]：加载成功，正在缓冲！`);

        // 销毁当前视频
        player.destroy();

        // 获取 polyvPlayer 实例代码
        let subStr1 = res.data.substring(res.data.indexOf("var player"));
        let subStr2 = subStr1.substring(0, subStr1.indexOf(";") + 1);

        // 倍速配置修改
        subStr2 = subStr2.replace("false", "[3, 2.5, 2, 1.5, 1, 0.5]");

        // 重新生成 polyvPlayer
        eval(subStr2);

        // 获取li数量
        let liTagCount = document.querySelectorAll(".vedio-play-conts-left-chapter-list li");

        // 获取当前视频索引
        let index;
        for (let i = 0; i < liTagCount.length; i++) {
            if (liTagCount[i].className.includes("active")) {
                index = i;
                break;
            }
        }

        // 播放开始回调
        window.s2j_onPlayStart = function () {
            // 静音
            player.j2s_setVolume(0);
            // 三倍速
            // document.querySelectorAll(".pv-rate-select div")[0].click();
            // console.log(`[N0ts]：\n静音已开启！\n三倍速播放已开启！\n当前正在播放第${index + 1}个视频！`);
            console.log(`[N0ts]：\n静音已开启！\n当前正在播放第${index + 1}个视频！`);
        }

        // 播放结束回调
        window.s2j_onPlayOver = function () {
            liTagCount[++index].click();
        }
    }, err => {
        // 出错重载
        location.reload();
    });
})();