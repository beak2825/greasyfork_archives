// ==UserScript==
// @name         SSD修改快速评论选项
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  监控并修改快速评论下拉选项
// @author       You
// @include      http*://springsunday.net/details.php*
// @include      http*://springsunday.net/torrents.php*
// @include      http*://springsunday.net/offers.php*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523710/SSD%E4%BF%AE%E6%94%B9%E5%BF%AB%E9%80%9F%E8%AF%84%E8%AE%BA%E9%80%89%E9%A1%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/523710/SSD%E4%BF%AE%E6%94%B9%E5%BF%AB%E9%80%9F%E8%AF%84%E8%AE%BA%E9%80%89%E9%A1%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置项
    const CONFIG = {
        selectId: 'quickcommentselect',
        checkInterval: 500,
        maxAttempts: 20,
        newOptions: [
            { value: '1', text: "未检测到中字，如果是硬字幕请补充至少一张带中字的截图，外挂字幕请上传，无中字请取消标签" },
            { value: '2', text: "请重新截取 png 格式原图" },
            { value: '3', text: "请参考截图及图床教程 [url=https://springsunday.net/forums.php?action=viewtopic&forumid=10&topicid=18105#pid389691] 教程 [/url] , 如该方法获取截图分辨率错误，右键视频->图像截取->按调整后的比例保存（取消勾选该选项，其余播放器同理）。" },
            { value: '4', text: "盒子截图参考教程：https://springsunday.net/forums.php?action=viewtopic&forumid=3&topicid=19545" },
            { value: '5', text: "现在我们提供一个春天种子检查 [url=https://springsunday.net/forums.php?action=viewtopic&forumid=16&topicid=16773] 脚本 [/url]，方便用户自检常见的种子信息不规范问题，提高发种效率。" },
            { value: '6', text: "截图体积偏小，疑似压缩的太厉害，请重新截取png原图，1080影片截图应该在1000kb以上，HDR/2160影片截图应该在1800KB以上" },
            { value: '7', text: "附加信息-请移除海报、ptgen信息、截图、 mediainfo。" },
            { value: '8', text: "附加信息-压制、diy、remux作品请保留完整制作信息(包括音视频及字幕来源、处理方式等)。" },
            { value: '9', text: "请参考资源规则中的主标题部分重新命名" },
            { value: '10', text: "截图内容必须包含影视正片有效信息，片头不视为有效信息" },
            { value: '12', text: "请使用mediainfo扫描完整的英文版媒体信息 [url=https://springsunday.net/forums.php?action=viewtopic&forumid=16&topicid=14319] 教程 [/url] [url=https://mediaarea.net/MediaInfoOnline] 在线版 [/url]" },
            { value: '13', text: "请参考本帖，添加合适的标签。[url=https://springsunday.net/forums.php?action=viewtopic&forumid=3&topicid=19073] 参考 [/url]" },
            { value: '14', text: "「原生标签」Untouch 原盘指正式出版未经过二次制作的影碟，包括 Blu-ray 和 DVD。" },
            { value: '15', text: "「特效标签」字幕包含有位移、变色、动态等特殊效果。简单的颜色、字体处理不被视为特效。使用特效标签的种子要求至少提供 2 张特效截图，且必须截取剧情相关部分的特效，无分辨率和格式要求，且不计入 3 张截图的基本要求。" },
            { value: '16', text: "「已取代标签」Trump 资源必须先于候选区发布，主动「举报/反馈」种子并说明 Trump（附带对应链接），附带 Trump 理由可更好的审核。" },
            { value: '17', text: "「合集标签」剧集、纪录、动画等资源的整季打包。详见资源规则的 [url=rules.php#id59] 合集打包规则 [/url]" },
            { value: '18', text: "「中字标签」资源包含有中文字幕。以下情形均可使用中字标签：内封/外挂/上传简繁字幕、内封/外挂/上传双语字幕、中文硬字幕。" },
            { value: '19', text: "「国配标签」外语片或粤语片包含有普通话配音（包括台湾普通话配音）。原始对白为普通话的资源不可使用该标签。" },
            { value: '20', text: "「CC 标签」原盘或压制的来源是 CC 标准收藏碟。" }
        ]
    };

    // 等待元素加载
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            if (document.getElementById(selector)) {
                return resolve(document.getElementById(selector));
            }

            const observer = new MutationObserver((mutations, obs) => {
                const element = document.getElementById(selector);
                if (element) {
                    obs.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`等待元素 ${selector} 超时`));
            }, timeout);
        });
    }

    // 修改选项
    function modifyOptions(select) {
        try {
            // 清空现有选项
            select.innerHTML = '';

            // 添加新选项
            CONFIG.newOptions.forEach(option => {
                const optElement = document.createElement('option');
                optElement.id = 'quickcomment' + option.value;
                optElement.value = option.value;
                optElement.textContent = option.text; // 显示截断的文本
                optElement.title = option.text; // 完整文本显示在tooltip中
                select.appendChild(optElement);
            });

            console.log('选项更新成功');
            return true;
        } catch (error) {
            console.error('修改选项时出错:', error);
            return false;
        }
    }

    // 主函数
    async function init() {
        try {
            console.log('开始查找选择器...');
            const select = await waitForElement(CONFIG.selectId);
            console.log('找到选择器，开始修改选项...');

            if (modifyOptions(select)) {
                console.log('脚本执行完成');
            } else {
                console.error('修改选项失败');
            }
        } catch (error) {
            console.error('脚本执行出错:', error);
        }
    }

    // 启动脚本
    init();


})();
