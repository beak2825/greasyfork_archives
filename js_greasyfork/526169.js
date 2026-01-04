// ==UserScript==
// @name         抖音自动发送评论
// @namespace    https://www.1024net.tech/
// @namespace    https://www.lovemake.love/
// @version      2025.02.02.080000
// @description  I try to take over the world!
// @author       Kay
// @match        https://live.douyin.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/4.0.0-beta.2/jquery.min.js
// @icon         https://aimg8.dlssyht.cn/u/1533835/ueditor/image/767/1533835/1633159205592221.png
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/526169/%E6%8A%96%E9%9F%B3%E8%87%AA%E5%8A%A8%E5%8F%91%E9%80%81%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/526169/%E6%8A%96%E9%9F%B3%E8%87%AA%E5%8A%A8%E5%8F%91%E9%80%81%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    $(document).ready(() => {
        var lastSpanText = '';
        var secondLastSpanText = '';
        var time = "";
        var message = "";
        var emojilist = ['[微笑]', '[色]', '[发呆]', '[酷拽]', '[抠鼻]', '[流泪]', '[捂脸]', '[发怒]', '[呲牙]', '[尬笑]', '[害羞]', '[调皮]', '[舔屏]', '[看]', '[爱心]', '[比心]', '[赞]', '[鼓掌]', '[感谢]', '[抱抱你]', '[玫瑰]', '[灵机一动]', '[耶]', '[打脸]', '[大笑]', '[机智]', '[送心]', '[666]', '[闭嘴]', '[来看我]', '[一起加油]', '[哈欠]', '[震惊]', '[晕]', '[衰]', '[困]', '[疑问]', '[泣不成声]', '[小鼓掌]', '[大金牙]', '[偷笑]', '[石化]', '[思考]', '[吐血]', '[可怜]', '[嘘]', '[撇嘴]', '[笑哭]', '[奸笑]', '[得意]', '[憨笑]', '[坏笑]', '[抓狂]', '[泪奔]', '[钱]', '[恐惧]', '[愉快]', '[快哭了]', '[翻白眼]', '[互粉]', '[我想静静]', '[委屈]', '[鄙视]', '[飞吻]', '[再见]', '[紫薇别走]', '[听歌]', '[求抱抱]', '[绝望的凝视]', '[不失礼貌的微笑]', '[不看]', '[裂开]', '[干饭人]', '[吐舌]', '[呆无辜]', '[白眼]', '[熊吉]', '[猪头]', '[冷漠]', '[微笑袋鼠]', '[凝视]', '[暗中观察]', '[二哈]', '[菜狗]', '[黑脸]', '[展开说说]', '[蜜蜂狗]', '[摸头]', '[皱眉]', '[擦汗]', '[红脸]', '[做鬼脸]', '[强]', '[如花]', '[吐]', '[惊喜]', '[敲打]', '[奋斗]', '[吐彩虹]', '[大哭]', '[嘿哈]', '[加好友]', '[惊恐]', '[惊讶]', '[囧]', '[难过]', '[斜眼]', '[阴险]', '[悠闲]', '[咒骂]', '[吃瓜群众]', '[绿帽子]', '[真的会谢]', '[达咩]', '[敢怒不敢言]', '[投降]', '[求求了]', '[眼含热泪]', '[叹气]', '[好开心]', '[不是吧]', '[动动脑子]', '[表面微笑]', '[表面呲牙]', '[鞠躬]', '[躺平]', '[九转大肠]', '[敲木鱼]', '[不你不想]', '[一头乱麻]', '[kisskiss]', '[你不大行]', '[噢买尬]', '[宕机]', '[还得是我]', '[6]', '[脸疼]', '[他急了]', '[苦涩]', '[逞强落泪]', '[强壮]', '[碰拳]', '[OK]', '[击掌]', '[左上]', '[握手]', '[抱拳]', '[勾引]', '[拳头]', '[弱]', '[胜利]', '[右边]', '[左边]', '[亚运鼓掌]', '[金牌]', '[手花]', '[嘴唇]', '[心碎]', '[凋谢]', '[啤酒]', '[咖啡]', '[蛋糕]', '[礼物]', '[撒花]', '[加一]', '[减一]', '[okk]', '[V5]', '[绝]', '[给力]', '[红包]', '[屎]', '[发]', '[我太难了]', '[18禁]', '[炸弹]', '[去污粉]', '[西瓜]', '[加鸡腿]', '[我酸了]', '[握爪]', '[太阳]', '[月亮]', '[给跪了]', '[蕉绿]', '[扎心]', '[胡瓜]', '[yyds]', '[emo]', '[开心兔]', '[招财兔]', '[年兽兔]', '[打call]', '[栓Q]', '[无语]', '[雪人]', '[雪花]', '[圣诞树]', '[平安果]', '[圣诞帽]', '[气球]', '[干杯]', '[烟花]', '[福]', '[candy]', '[糖葫芦]', '[虎头]', '[饺子]', '[鞭炮]', '[元宝]', '[灯笼]', '[锦鲤]', '[巧克力]', '[汤圆]', '[情书]', '[iloveyou]', '[戒指]', '[小黄鸭]', '[棒棒糖]', '[纸飞机]', '[必胜]', '[粽子]'];
        function checkAndLogChanges() {
            var $spans = $('.webcast-chatroom___bottom-message span');
            if ($spans.length >= 2) {
                var currentLastText = $spans.eq($spans.length - 1).text();
                var currentSecondLastText = $spans.eq($spans.length - 2).text();
                if (currentLastText !== lastSpanText || currentSecondLastText !== secondLastSpanText) {
                    // console.log('名字:', currentSecondLastText);
                    // console.log('类型:', currentLastText);
                    if (currentLastText == "为主播点赞了") {
                        message = "感谢" + currentSecondLastText.split("：")[0] + "为音柔体软易推倒的女主宝点赞";
                    } else if (currentLastText == "来了") {
                        message = "音柔体软易推倒的女主宝热烈欢迎" + currentSecondLastText.split("：")[0];
                    }
                    else if (currentLastText.contains("送出了")) {
                        message = "感谢" + currentSecondLastText.split("：")[0] + "送的";
                    }
                    let length = emojilist.length;
                    let randomNum = Math.floor(Math.random() * length);
                    message += emojilist[randomNum];
                    copyToClipboard(message);  // 复制到剪贴板
                    // 更新记录
                    lastSpanText = currentLastText;
                    secondLastSpanText = currentSecondLastText;
                    clearTimeout(time);
                }
            }
            // 重新生成一个3到10秒之间的随机整数
            // var randomInterval = Math.floor(Math.random() * 8) + 3;
            // 重新生成一个5到10秒之间的随机整数
            var randomInterval = Math.floor(Math.random() * 6) + 5;
            // 重新设置定时器
            time = setTimeout(checkAndLogChanges, randomInterval * 1000);
        }
        // 初始调用 checkAndLogChanges 并设置定时器
        checkAndLogChanges();
        // 启动 MutationObserver 监听 DOM 变化
        var targetNode = document.querySelector('.webcast-chatroom___bottom-message');
        var config = { childList: true, subtree: true };
        var callback = function (mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    checkAndLogChanges();
                }
            }
        };
        var observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    });
    var flag = 0;
    async function copyToClipboard(text) {
        if (flag === 1) {
            try {
                // 读取当前剪贴板内容
                const currentClipboardContent = await navigator.clipboard.readText();
                // console.log('当前剪贴板内容: ', currentClipboardContent);
                // 判断剪贴板内容是否为空
                if (!currentClipboardContent.trim()) {
                    // 复制指定的文本到剪贴板
                    await navigator.clipboard.writeText(text);
                    // console.log('文本已成功复制到剪贴板');
                } else {
                    // console.log('剪贴板已有内容，未执行复制操作。');
                }
            } catch (err) {
                // console.error('读取或复制失败: ', err);
            }
        }
    }
    // 切换flag自动发送状态
    function auto_send() {
        if (flag == 0) { flag = 1; $('.webcast-chatroom___textarea').css("background-color", ""); }
        else { flag = 0; $('.webcast-chatroom___textarea').css("background-color", "red"); }
    }
    $(document).keyup(function (event) {
        switch (event.code) {
            case "KeyP"://p 自动发送模式切换
                auto_send();
                break;
        }
    });
})();
/*2025.02.02.080000 - Line : 106*/
