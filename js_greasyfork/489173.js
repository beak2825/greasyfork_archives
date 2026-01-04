// ==UserScript==
// @name         文学社在看着你👀
// @namespace    https://world.xiaomawang.com/w/person/project/all/3267489
// @version      2.0.0
// @description  在你的浏览器上添加文学社所有女生的Q版形象
// @author       茶铭
// @match        *://*/*
// @icon           https://ddlc.moe/images/favicon.ico
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489173/%E6%96%87%E5%AD%A6%E7%A4%BE%E5%9C%A8%E7%9C%8B%E7%9D%80%E4%BD%A0%F0%9F%91%80.user.js
// @updateURL https://update.greasyfork.org/scripts/489173/%E6%96%87%E5%AD%A6%E7%A4%BE%E5%9C%A8%E7%9C%8B%E7%9D%80%E4%BD%A0%F0%9F%91%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const imageUrls = [
        "https://ddlc.moe/images/sticker_s.png",
        "https://ddlc.moe/images/sticker_y.png",
        "https://ddlc.moe/images/sticker_m.png",
        "https://ddlc.moe/images/sticker_n.png"
    ];

    const alternativeImageUrls = [
        "https://img.qovv.cn/2024/04/20/66230b7098aac.png",
        "https://img.qovv.cn/2024/04/20/66230b748295a.png",
        "https://img.qovv.cn/2024/04/20/66230b6924394.png",
        "https://img.qovv.cn/2024/04/20/66230b6c47129.png"
    ];

    const links = [
        "https://chat.monika.love/",
        "https://wiki.monika.love/index.php?title=%E9%A6%96%E9%A1%B5",
        "https://disk.monika.love/",
        "https://forum.monika.love/"
    ];

const descriptions = [
    "DCC chat",
    "DCC wiki",
    "莫盘",
    "心跳文学部中文论坛"
];

const name = [
    "纱世里",
    "优里",
    "莫妮卡",
    "夏树"
];

const characterKeywords = [
    {
        name: "纱世里",
        keywords: [
            "快乐", "悲伤", "死亡", "悲剧", "孤独", "爱情", "冒险", "甜蜜", "刺激", "烟花",
            "浪漫", "泪水", "压抑", "心声", "婚姻", "激情", "童年", "乐趣", "色彩", "希望",
            "朋友", "家庭", "聚会", "度假", "懒惰", "做白日梦", "痛苦", "假日", "床", "羽毛",
            "羞耻", "恐惧", "温暖", "花朵", "舒适", "跳舞", "唱歌", "哭泣", "笑", "黑暗",
            "晴天", "雨云", "平静", "傻傻的", "飞翔", "美妙", "单相思", "玫瑰", "在一起",
            "承诺", "魅力", "美丽", "欢呼", "微笑", "破碎", "珍贵", "祈祷", "笨拙", "原谅",
            "自然", "海洋", "耀眼", "特别", "音乐", "幸运", "不幸", "响亮", "夕阳", "萤火虫",
            "彩虹", "受伤", "游戏", "闪光", "伤痕", "空空如也", "了不起", "悲伤", "拥抱",
            "非同寻常", "令人敬畏", "失败", "绝望", "痛苦", "宝藏", "幸福", "回忆"
        ]
    },
    {
        name: "夏树",
        keywords: [
            "蓬松", "纯洁", "糖果", "购物", "小狗", "小猫咪", "云朵", "口红", "冻糕", "草莓味",
            "粉红色", "巧克力", "心跳", "亲吻", "旋律", "丝带", "蹦蹦跳跳", "嘟嘟嘟", "卡哇伊",
            "裙子", "脸颊", "电子邮件", "黏黏的", "蹦蹦跳跳", "闪闪发光", "轻咬", "幻想", "发糖",
            "咯咯笑", "棉花糖", "跳一跳", "跳跃", "和平", "旋转", "旋转", "棒棒糖", "噗噗", "泡泡",
            "耳语", "夏天", "瀑布", "泳装", "香草", "耳机", "游戏机", "袜子", "头发", "操场",
            "睡衣", "毛毯", "牛奶", "噘嘴", "生气", "爸爸", "情人节礼物", "老鼠", "吹口哨",
            "啵啵", "兔子", "动画片", "跳跃"
        ]
    },
    {
        name: "优里",
        keywords: [
            "决心", "自杀", "想象力", "秘密", "活力", "存在", "发光", "深红色", "旋风", "残影",
            "眩晕", "迷失方向", "本质", "氛围", "星景", "混乱", "污染", "智力", "分析", "熵",
            "活泼", "不可思议", "不协调", "愤怒", "天真", "屠杀", "哲学", "善变", "顽强", "灵气",
            "不稳定", "地狱", "无能", "命运", "无懈可击", "痛苦", "变异", "无法控制", "极端",
            "逃离", "梦境", "灾难", "生动", "生机勃勃", "疑问", "发酵", "审判", "牢笼", "爆炸",
            "快感", "欲望", "感觉", "高潮", "电流", "不承认", "鄙视", "无限", "永恒", "时间",
            "宇宙", "永无止境", "雨滴", "觊觎", "无拘无束", "风景", "肖像", "旅程", "微薄",
            "焦虑", "惊恐", "恐怖", "忧郁", "洞察力", "赎罪", "呼吸", "俘虏", "欲望", "墓地"
        ]
    },
    {
        name: "莫妮卡",
        keywords: ["莫妮卡"] // 没错老莫真就这一个词）
    }
];


const images = [];
const imagePositions = [];
let isJumpPaused = false;

function toggleImageVisibility(index) {
    return function () {
        const img = images[index];
        img.style.display = img.style.display === 'none' ? 'block' : 'none';
        // 保存隐藏状态到本地存储
        localStorage.setItem(`imageVisibility_${index}`, img.style.display);
    };
}

function createImage(url, link, description, x) {
    const a = document.createElement('a');
    a.href = link;
    a.title = `前往 ${description}`;

    const img = document.createElement('img');
    img.src = url;
    img.style.position = 'fixed';
    img.style.bottom = '0';
    img.style.left = `${x}px`;
    img.style.zIndex = '9999';

    // 从本地存储中获取隐藏状态并设置
    const index = images.length;
    const visibility = localStorage.getItem(`imageVisibility_${index}`);
    if (visibility === 'none') {
        img.style.display = 'none';
    }

    a.appendChild(img);
    document.body.appendChild(a);

    return img;
}

function registerMenuCommands() {
    for (let i = 0; i < name.length; i++) {
        GM_registerMenuCommand(`隐藏/显示 ${name[i]}`, toggleImageVisibility(i));
    }
}

registerMenuCommands();



function startJumpAnimation() {
    if (isJumpPaused) return;
    const visibleImages = images.filter(img => img.style.display !== 'none');
    if (visibleImages.length === 0) return; // 如果没有可见图片，则不执行跳跃动画

    const randomIndex = Math.floor(Math.random() * visibleImages.length);
    jumpAnimation(visibleImages[randomIndex], true); // 只执行大跳事件

    const randomInterval = Math.floor(Math.random() * 3000) + 3000;
    setTimeout(startJumpAnimation, randomInterval);
}

function jumpAnimation(img, isBigJump) {
    const jumpHeight = isBigJump ? 100 : 50; // 调整第一次触底反弹的高度
    const jumpDuration = isBigJump ? 1000 : 0; // 增加跳跃速度

    img.animate([
        { transform: 'translateY(0)', },
        { transform: `translateY(-${jumpHeight}px)`, offset: 0.3 }, // 触底反弹
        { transform: 'translateY(0)', offset: 0.6 }, // 再次落地
        { transform: `translateY(-${jumpHeight / 2}px)`, offset: 0.8 }, // 落地前稍微反弹一次
        { transform: 'translateY(0)', offset: 1 }
    ], {
        duration: jumpDuration,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        iterations: 1
    });
}

    function checkOverlap(x) {
        for (let i = 0; i < imagePositions.length; i++) {
            const position = imagePositions[i];
            if (Math.abs(x - position) <= 100) {
                return true;
            }
        }
        return false;
    }

    function generateRandomX() {
        let x = Math.floor(Math.random() * (window.innerWidth - 100));
        while (checkOverlap(x)) {
            x = Math.floor(Math.random() * (window.innerWidth - 100));
        }
        return x;
    }

    window.addEventListener('load', () => {
        imageUrls.forEach((url, index) => {
            const x = generateRandomX();
            const img = createImage(url, links[index], descriptions[index], x);
            images.push(img);
            imagePositions.push(x);
        });

        startJumpAnimation();

        function checkCopiedText(text) {
            for (let i = 0; i < characterKeywords.length; i++) {
                const character = characterKeywords[i];
                for (let j = 0; j < character.keywords.length; j++) {
                    if (text.includes(character.keywords[j])) {
                        const index = name.indexOf(character.name);
                        if (index !== -1 && !isJumpPaused) {
                            images[index].src = alternativeImageUrls[index];
                            jumpAnimation(images[index], true);
                            isJumpPaused = true;
                            setTimeout(() => {
                                images[index].src = imageUrls[index];
                                isJumpPaused = false;
                            }, 1000);
                        }
                        return; // 只触发一个角色的大跳事件
                    }
                }
            }
        }

        document.addEventListener('copy', event => {
            const copiedText = window.getSelection().toString();
            checkCopiedText(copiedText);
        });

    });

})();

