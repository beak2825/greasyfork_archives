/*
+----------------------------------------------------------+
 ██░██░██ ████░  ████░ ████░ ████░ ████░ ██░░░█
 ██░██░██ ██░██  ██░██ ██░██ ██░██ ██░██ ██░░██
 ████████ ██░██  ██░██ ██░██ ██░██ ██░██ ██████
 ██░░░██ ██░██  ██░██ ██░██ ██░██ ██░██ ██░░██
 ██░░░██ ████░  ████░ ████░ ████░ ████░ ██░░░█



   _   _                             _
 | \ | | _____   _____ _ __    __ _(_)_   _____   _   _ _ __
 |  \| |/ _ \ \ / / _ \ '__|  / _` | \ \ / / _ \ | | | | '_ \
 | |\  |  __/\ V /  __/ |    | (_| | |\ V /  __/ | |_| | |_) |
 |_| \_|\___| \_/ \___|_|     \__, |_| \_/ \___|  \__,_| .__/
                              |___/                    |_|


   /\_/\
 =( °w° )=
   )   (   //
  (__ __)//
+----------------------------------------------------------+
           by：yyy.                V：Why15236444193
+----------------------------------------------------------+
*/

// ==UserScript==
// @name              🫧404小站 — 🎨 鼠标指针美化
// @namespace         http://gongju.dadiyouhui03.cn/app/tool/youhou/index.html
// @version           3.0.1
// @description       ✨可自定义鼠标特效等显示效果，特殊光标特效：全屏十字光标，流体水花，目标光标，丝带等等。为枯燥的界面增加趣味，让光标及轨迹更加醒目，内置130+个精美光标，包含动漫、游戏、卡通等多种主题，支持Sweezy: https://sweezy-cursors.com/new-cursors/动画光标下载。
// @author            yyy.
// @match             *://*/*
// @grant             GM_addStyle
// @grant             GM_download
// @grant             GM_xmlhttpRequest
// @grant             GM_getResourceText
// @grant             unsafeWindow
// @grant             GM_setClipboard
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_deleteValue
// @grant             GM_openInTab
// @grant             GM_registerMenuCommand
// @grant             GM_unregisterMenuCommand
// @grant             GM.getValue
// @grant             GM.setValue
// @grant             GM_info
// @grant             GM_notification
// @run-at            document-idle
// @icon              http://cur.cursors-4u.net/anime/ani-12/ani1136.gif
// @noframes
// @connect           *
// @downloadURL https://update.greasyfork.org/scripts/538573/%F0%9F%AB%A7404%E5%B0%8F%E7%AB%99%20%E2%80%94%20%F0%9F%8E%A8%20%E9%BC%A0%E6%A0%87%E6%8C%87%E9%92%88%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/538573/%F0%9F%AB%A7404%E5%B0%8F%E7%AB%99%20%E2%80%94%20%F0%9F%8E%A8%20%E9%BC%A0%E6%A0%87%E6%8C%87%E9%92%88%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 默认配置
    const DEFAULT_CONFIG = {
        enabled: false,
        cursorNormal: 'https://www.dadiyouhui02.cn/img/menghuan.ico',
        cursorHover: 'https://ae01.alicdn.com/kf/H88647b1696564b9d880fdf741d728ec3a.png',
        cursorClick: 'https://ae01.alicdn.com/kf/H88647b1696564b9d880fdf741d728ec3a.png',
        // 图片光标缩放尺寸（仅对 png/jpg/webp/gif 等“图片型光标”生效；.cur/.ani/.ico 无法在 CSS 中强制缩放）
        cursorImageSize: 64,
        textEffect: {
            enabled: false,
            type: 'text', // 'text' 或 'spark'
            words: ['❤', '💖', '💝', '💕', '💗'],
            fontSize: 16,
            customText: '',
            useCustomText: false,
            spark: {
                sparkColor: '#8B5CF6', // 蓝紫色
                sparkSize: 10,
                sparkRadius: 15,
                sparkCount: 8,
                duration: 400,
                easing: 'ease-out',
                extraScale: 1.0
            }
        },
        cursorEffect: {
            enabled: false,
            type: 'none',
            intensity: 5,
            color: '#4CAF50',
            size: 20,
            enableNoiseEffect: true, // 悬停链接时启用噪声滤镜动画
            ribbons: {
                colors: ['#FC8EAC'],
                baseSpring: 0.03,
                baseFriction: 0.9,
                baseThickness: 30,
                offsetFactor: 0.05,
                maxAge: 500,
                pointCount: 50,
                speedMultiplier: 0.6,
                enableFade: false,
                enableShaderEffect: false,
                effectAmplitude: 2
            },
            splash: {
                simResolution: 128,
                dyeResolution: 1440,
                densityDissipation: 3.5,
                velocityDissipation: 2,
                pressure: 0.1,
                pressureIterations: 20,
                curl: 3,
                splatRadius: 0.2,
                splatForce: 6000,
                shading: true,
                colorUpdateSpeed: 10,
                transparent: true
            },
            target: {
                spinDuration: 2,
                hideDefaultCursor: true,
                parallaxOn: true,
                size: 40,
                color: '#FF4444', // 亮红色
                borderWidth: 2
            }
        }
    };


    const PRESET_CURSOR_CATEGORIES = [
        {
            category: '内置/常用',
            items: [
                { name: '梦幻', url: 'https://www.dadiyouhui02.cn/img/menghuan.ico' },
                { name: '手型', url: 'https://www.dadiyouhui02.cn/img/shou32x32.ico' },
                { name: '爱心', url: 'https://ae01.alicdn.com/kf/H88647b1696564b9d880fdf741d728ec3a.png' }
            ]
        },
        {
            category: 'Cursors-4u 游戏/卡通/指针',
            items: [
                { name: '游戏1', url: 'http://cur.cursors-4u.net/games/gam-13/gam1232.png' },
                { name: '游戏2', url: 'http://cur.cursors-4u.net/games/gam-14/gam1340.cur' },
                { name: '游戏3', url: 'http://cur.cursors-4u.net/games/gam-14/gam1338.cur' },
                { name: '游戏4', url: 'http://cur.cursors-4u.net/games/gam-4/gam376.cur' },
                { name: '游戏5', url: 'http://cur.cursors-4u.net/games/gam-4/gam375.cur' },
                { name: '游戏6', url: 'http://cur.cursors-4u.net/games/gam-14/gam1391.png' },
                { name: '卡通1', url: 'http://cur.cursors-4u.net/toons/too-2/too150.cur' },
                { name: '指针1', url: 'http://cur.cursors-4u.net/cursors/cur-7/cur641.cur' },
                { name: '指针2', url: 'http://cur.cursors-4u.net/cursors/cur-2/cur119.cur' },
                { name: '指针3', url: 'http://cur.cursors-4u.net/cursors/cur-2/cur116.cur' },
                { name: '指针4', url: 'http://cur.cursors-4u.net/cursors/cur-9/cur805.png' },
                { name: '指针5', url: 'http://cur.cursors-4u.net/cursors/cur-9/cur812.png' },
                { name: '指针6', url: 'http://cur.cursors-4u.net/cursors/cur-3/cur273.cur' },
                { name: '指针7', url: 'http://cur.cursors-4u.net/cursors/cur-2/cur125.cur' },
                { name: '指针8', url: 'http://cur.cursors-4u.net/cursors/cur-3/cur221.png' },
                { name: '指针9', url: 'http://cur.cursors-4u.net/cursors/cur-9/cur265.cur' },
                { name: '指针10', url: 'http://cur.cursors-4u.net/cursors/cur-8/cur740.png' },
                { name: '指针11', url: 'http://cur.cursors-4u.net/cursors/cur-8/cur727.png' },
                { name: '指针12', url: 'http://cur.cursors-4u.net/cursors/cur-8/cur728.png' },
                { name: '指针13', url: 'http://cur.cursors-4u.net/cursors/cur-11/cur1054.cur' }
            ]
        },
        {
            category: 'Cursors-4u 动漫/自然/符号/其他',
            items: [
                { name: '其他1', url: 'http://cur.cursors-4u.net/others/oth-4/oth305.cur' },
                { name: '其他3', url: 'http://cur.cursors-4u.net/others/oth-8/oth755.cur' },
                { name: '其他4', url: 'http://cur.cursors-4u.net/others/oth-8/oth726.png' },
                { name: '动画1', url: 'http://ani.cursors-4u.net/cursors/cur-11/cur1089.cur' },
                { name: '表情1', url: 'http://cur.cursors-4u.net/smilies/smi-3/smi267.png' },
                { name: '动漫1', url: 'http://ani.cursors-4u.net/anime/ani-13/ani1227.cur' },
                { name: '动漫2', url: 'http://cur.cursors-4u.net/anime/ani-9/ani878.png' },
                { name: '动漫3', url: 'http://cur.cursors-4u.net/anime/ani-12/ani1112.png' },
                { name: '动漫4', url: 'http://cur.cursors-4u.net/anime/ani-1/ani195.png' },
                { name: '动漫5', url: 'http://cur.cursors-4u.net/anime/ani-12/ani1136.gif' },
                { name: '自然1', url: 'http://cur.cursors-4u.net/nature/nat-11/nat1034.gif' },
                { name: '自然2', url: 'http://cur.cursors-4u.net/nature/nat-11/nat1028.gif' },
                { name: '自然3', url: 'http://cur.cursors-4u.net/nature/nat-11/nat1033.gif' },
                { name: '特殊1', url: 'http://cur.cursors-4u.net/special/spe-3/spe302.png' },
                { name: '特殊2', url: 'http://cur.cursors-4u.net/special/spe-2/spe114.cur' },
                { name: '符号1', url: 'http://cur.cursors-4u.net/symbols/sym-6/sym501.png' },
                { name: '符号2', url: 'http://cur.cursors-4u.net/symbols/sym-7/sym646.gif' }
            ]
        },
        {
            category: 'Sweezy 海绵宝宝（预览图，可下载）',
            items: [
                { name: '珍珠·蟹老板', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/spongebob-pearl-krabs/spongebob-pearl-krabs-custom-cursor.png' },
                { name: '章鱼哥与单簧管', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/spongebob-squidward-tentacles-clarinet/spongebob-squidward-tentacles-clarinet-custom-cursor.png' },
                // 注意：这里文件名里有一个看起来像西里尔字母的 "с"，保持原样
                { name: '平底锅', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/spongebob-squarepants-spatula/spongebob-squarepants-spatula-сustom-cursor.png' },
                { name: '珊迪与花朵', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/spongebob-sandy-cheeks-flower/spongebob-sandy-cheeks-flower-custom-cursor.png' },
                { name: '派大星与网', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/spongebob-patrick-star-net/spongebob-patrick-star-net-custom-cursor.png' },
                { name: '不，这是派大星', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/spongebob-no-this-is-patrick-meme/spongebob-no-this-is-patrick-meme-custom-cursor.png' },
                { name: '凯伦·痞老板', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/spongebob-karen-plankton/spongebob-karen-plankton-custom-cursor.png' },
                { name: '水母', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/spongebob-jellyfish/spongebob-jellyfish-custom-cursor.png' },
                { name: '小蜗', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/spongebob-gary-the-snail/spongebob-gary-the-snail-custom-cursor.png' },
                { name: '痞老板的秘密配方', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/spongebob-plankton-secret-formula/spongebob-plankton-secret-formula-custom-cursor.png' },
                { name: '蟹老板的第一美元', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/spongebob-mr-krabs-first-dollar/spongebob-mr-krabs-first-dollar-custom-cursor.png' },
                { name: '想象力表情包', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/sponge-bob-imagination-meme/spongebob-imagination-meme-custom-cursor.png' },
                { name: '嘲讽海绵宝宝表情包', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/mocking-spongebob-meme/mocking-spongebob-meme-custom-cursor.png' },
                // 新增海绵宝宝光标
                { name: '帕大星女巫飞行', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/auto-draft/spongebob-patrick-witch-flight-custom-cursor.png' },
                { name: '帕大星瓶头表情包', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/spongebob-patrick-bottlehead-meme-spongebob-collection/spongebob-patrick-bottlehead-meme-custom-cursor.png' },
                { name: '海绵宝宝和帕大星幽灵', url: 'https://sweezy-cursors.com/wp-content/uploads/spongebob-and-patrick-ghosts-custom-cursor.png' },
                { name: '强壮痞老板', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/spongebob-buff-plankton/spongebob-buff-plankton-custom-cursor.png' },
                { name: '搞笑痞老板', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/spongebob-funny-plankton/spongebob-funny-plankton-custom-cursor.png' },
                { name: '🎬 蟹堡王美元动画', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/spongebob-krusty-krab-dollar-animated/spongebob-krusty-krab-dollar-animated-custom-cursor.gif' },
                { name: '🎬 水母网动画', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/auto-draft/spongebob-jellyfish-net-animated-custom-cursor.gif' },
                { name: '🎬 帕大星渔网动画', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/spongebob-patrick-star-fishnets-animated/spongebob-patrick-star-fishnets-animated-custom-cursor.gif' },
                { name: '海绵宝宝点赞', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/auto-draft/spongebob-thumbs-up-custom-cursor.png' },
                { name: '海绵宝宝复活节篮子', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/auto-draft/spongebob-easter-basket-custom-cursor.png' },
                { name: '海绵宝宝僵尸幽灵帕大星', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/spongebob-zombie-amp-ghost-patrick/spongebob-zombie-ghost-patrick-custom-cursor.png' },
                { name: '🎬 飞翔的荷兰人船动画', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/spongebob-flying-dutchman-ship-animated/spongebob-flying-dutchman-ship-animated-custom-cursor.gif' },
                { name: '🎬 海绵宝宝×RIPNDIP动画', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/spongebob-x-ripndip-lord-nermal-animated/spongebob-x-ripndip-lord-nermal-animated-custom-cursor.gif' },
                { name: '🎬 帕大星圣诞树像素动画', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/spongebob-patrick-christmas-tree-pixel-animated/spongebob-patrick-christmas-tree-pixel-animated-custom-cursor.gif' },
                { name: '🎬 玻璃球中的海绵宝宝动画', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/spongebob-in-glass-ball-animated/spongebob-in-glass-ball-animated-custom-cursor.gif' },
                { name: '🎬 万圣节幽灵海绵宝宝动画', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/spongebob-halloween-ghost-animated/spongebob-halloween-ghost-animated-custom-cursor.gif' },
                { name: '🎬 章鱼哥单簧管动画', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/spongebob-squidward-amp-clarinet-animated/spongebob-squidward-clarinet-animated-custom-cursor.gif' },
                { name: '🎬 章鱼哥咖啡动画', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/spongebob-squidward-amp-coffee-animated/spongebob-squidward-coffee-animated-custom-cursor.gif' },
                { name: '🎬 害怕的海绵宝宝动画', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/scared-spongebob-animated/scared-spongebob-animated-custom-cursor.gif' },
                { name: '🎬 海绵宝宝恐惧动画', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/spongebob-scared-animated/spongebob-scared-animated-custom-cursor.gif' },
                { name: '🎬 美人鱼侠腰带动画', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/spongebob-mermaid-man-belt-animated/spongebob-mermaid-man-belt-animated-custom-cursor.gif' },
                { name: '🎬 小蜗像素动画', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/spongebob-gary-pixel-animated/spongebob-gary-pixel-animated-custom-cursor.gif' },
                { name: '🎬 海绵宝宝抛爱心像素动画', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/spongebob-throws-love-hearts-pixel-animated/spongebob-throws-love-hearts-pixel-animated-custom-cursor.gif' },
                { name: '哈罗德和玛格丽特', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/spongebob-harold-margaret/spongebob-harold-margaret-cursors.png' },
                { name: '🎬 海绵宝宝奔跑像素动画', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/spongebob-running-pixel-animated/spongebob-running-pixel-animated-custom-cursor.gif' },
                { name: '泡芙老师和船', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/spongebob-mrs-puff-boat/spongebob-mrs-puff-boat-custom-cursor.png' },
                { name: '🎬 野蛮帕大星表情包动画', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/savage-patrick-meme-animated/savage-patrick-meme-animated-custom-cursor.gif' },
                { name: '拉里龙虾杠铃', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/spongebob-larry-the-lobster-barbell/spongebob-larry-the-lobster-barbell-custom-cursor.png' }
            ]
        },
        {
            category: 'Sweezy 动漫/游戏（预览图，可下载）',
            items: [
                // 咒术回战
                { name: '🎬 咒术回战宿儺箭动画', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/auto-draft/jujutsu-kaisen-sukuna-arrow-animated-custom-cursor.gif' },
                // 鬼灭之刃
                { name: '🎬 鬼灭之刃水呼吸剑动画', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/demon-slayer-water-breathing-sword-animated/demon-slayer-water-breathing-sword-animated-custom-cursor.gif' },
                { name: '🎬 鬼灭之刃无一郎灭鬼动画', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/demon-slayer-muichiro-destroyer-of-demons-animated/demon-slayer-muichiro-destroyer-of-demons-animated-custom-cursor.gif' },
                { name: '鬼灭之刃炼狱炎柱', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/auto-draft/demon-slayer-kyojuro-rengoku-flame-hashira-custom-cursor.png' },
                { name: '鬼灭之刃炭治郎狐狸面具', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/demon-slayer-tanjiro-kamado-fox-mask/demon-slayer-tanjiro-kamado-fox-mask-custom-cursor.png' },
                // 蜘蛛侠
                { name: '圣诞节迈尔斯·莫拉莱斯', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/auto-draft/christmas-miles-morales-custom-cursor.png' },
                { name: '蜘蛛侠迈尔斯涂鸦面具', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/auto-draft/spider-man-miles-morales-graffiti-mask-custom-cursor.png' },
                // Valorant
                { name: '🎬 Valorant杰特刀锋风暴动画', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/auto-draft/valorant-jett-blade-storm-animated-custom-cursor.gif' },
                { name: 'Valorant密室猎头者', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/valorant-chamber-headhunter/valorant-chamber-headhunter-custom-cursor.png' },
                { name: 'Valorant丁香', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/valorant-clove/valorant-clove-custom-cursor.png' },
                // 间谍过家家
                { name: '🎬 间谍过家家阿尼亚霹雳舞动画', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/spy-x-family-anya-forger-breakdancing-animated/spy-x-family-anya-forger-breakdancing-animated-custom-cursor.gif' },
                // 电锯人
                { name: '电锯人蕾塞花', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/chainsaw-man-reze-flower/chainsaw-man-reze-flower-custom-cursor.png' },
                // Re:Zero
                { name: 'Re:Zero可爱的雷姆', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/auto-draft/rezero-adorable-rem-custom-cursor.png' },
                // 哈利波特
                { name: '哈利波特格林德沃长老魔杖', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/harry-potter-grindelwald-elder-wand/harry-potter-grindelwald-elder-wand-custom-cursor.png' },
                // K-ON!
                { name: 'K-ON!平泽唯', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/auto-draft/k-on-yui-hirasawa-custom-cursor.png' },
                // OMORI
                { name: '🎬 OMORI刀动画', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/omori-knife-animated/omori-knife-animated-cursor.gif' },
                // 城堡毁灭者
                { name: '🎬 城堡毁灭者绿骑士毒球动画', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/castle-crashers-green-knight-amp-poison-ball-animated/castle-crashers-green-knight-poison-ball-animated-custom-cursor.gif' },
                // Roblox
                { name: '🎬 Roblox森林99夜阿尔法狼动画', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/roblox-99-nights-in-the-forest-alpha-wolf-animated/roblox-99-nights-in-the-forest-alpha-wolf-animated-custom-cursor.gif' },
                { name: '🎯 Roblox森林99夜阿尔法狼(.ani)', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/roblox-99-nights-in-the-forest-alpha-wolf-animated/roblox-99-nights-in-the-forest-alpha-wolf-animated-cursor.ani' },
                { name: 'Roblox渐强怪物', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/roblox-crescendo-telamonster/roblox-crescendo-telamonster-custom-cursor.png' }
            ]
        },
        {
            category: 'Sweezy 可爱/卡通（预览图，可下载）',
            items: [
                // 三丽鸥
                { name: '三丽鸥黑见骷髅箭', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/sanrio-kuromi-skullarrow/sanrio-kuromi-skull-arrow-custom-cursor.png' },
                { name: '三丽鸥美乐蒂箭头', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/auto-draft/sanrio-my-melody-arrow-custom-cursor.png' },
                { name: '万圣节肉桂蝙蝠满月', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/helloween-cinnamoroll-bat-full-moon/halloween-cinnamoroll-bat-full-moon-custom-cursor.png' },
                // 粉彩洛丽塔
                { name: '粉彩洛丽塔蕾丝手弓', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/auto-draft/pastel-lolita-lace-hand-bow-custom-cursor.png' },
                // Chiikawa
                { name: '🎬 Chiikawa飞鼠动画', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/chiikawa-momonga-animated/chiikawa-momonga-animated-custom-cursor.gif' },
                // 像素风格
                { name: '🎬 粉红像素动画', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/pinky-pixel-animated/pinky-pixel-animated-custom-cursor.gif' },
                { name: '🎬 粉色雪云像素动画', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/auto-draft/pink-snow-cloud-pixel-animated-custom-cursor.gif' },
                { name: 'Q版月亮女孩刀', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/auto-draft/chibi-moon-girl-knife-custom-cursor.png' }
            ]
        },
        {
            category: 'Sweezy 虚拟偶像/音乐（预览图，可下载）',
            items: [
                // 初音未来
                { name: '青葱与初音未来', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/auto-draft/green-onion-hatsune-miku-custom-cursor.png' },
                { name: '初音铁人圣诞', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/miku-teto-christmas/miku-teto-christmas-custom-cursor.png' },
                // VTuber
                { name: 'Gawr Gura三叉戟', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/gawr-gura-trident/gawr-gura-trident-custom-cursor.png' },
                // BLACKPINK
                { name: 'BLACKPINK Lisa武士刀', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/blackpink-lalisa-manoban-katana/blackpink-lalisa-manoban-katana-custom-cursor.png' },
                // 小马宝莉
                { name: '🎬 小马宝莉小蝶跳舞动画', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/mlp-fluttershy-dancing-animated/mlp-fluttershy-dancing-animated-custom-cursor.gif' },
                // Spotify
                { name: '🎬 Spotify标志代码动画', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/spotify-logo-code-animated/spotify-logo-code-animated-custom-cursor.gif' }
            ]
        },
        {
            category: 'Sweezy 表情包/网络文化（预览图，可下载）',
            items: [
                // 猫咪表情包
                { name: '🎬 喵猫表情包动画', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/nyan-cat-meme-animated/nyan-cat-meme-animated-custom-cursor.gif' },
                { name: '🎬 oo ee a e a猫表情包', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/oo-ee-a-e-a-cat-meme-animated/oo-ee-a-e-a-cat-meme-custom-cursor.gif' },
                { name: '🎬 大眼仓鼠表情包动画', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/auto-draft/hamster-with-big-eyes-meme-animated-custom-cursor.gif' },
                { name: '🎬 邦戈猫动画', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/bongo-cat-animated/bongo-cat-animated-custom-cursor.gif' },
                { name: '🎬 Pop猫表情包动画', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/pop-cat-meme-animated/pop-cat-meme-animated-custom-cursor.gif' },
                { name: '强壮狗vs Cheems表情包', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/swole-doge-vs-cheems-meme/swole-doge-vs-cheems-meme-custom-cursor.png' },
                // 恶作剧表情
                { name: '恶作剧新月脸表情符号', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/new-moon-face-emoji-macos/prank-new-moon-face-emoji-macos-custom-cursor.png' }
            ]
        },
        {
            category: 'Sweezy 动物/自然（预览图，可下载）',
            items: [
                // 鱼类
                { name: '🎬 锦鲤动画', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/koi-fish-animated/koi-fish-animated-custom-cursor.gif' },
                // 鸟类
                { name: '🎬 蓝鸽子动画', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/blue-pigeon-animated/blue-pigeon-animated-custom-cursor.gif' },
                { name: '🎬 风中奇缘小鸟动画', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/pocahontas-amp-flit-animated/pocahontas-flit-animated-custom-cursor.gif' },
                // 蛇类
                { name: '🎬 绿蛇动画', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/green-snake-animated/green-snake-animated-custom-cursor.gif' }
            ]
        },
        {
            category: 'Sweezy 迪士尼/电影（预览图，可下载）',
            items: [
                // 冰雪奇缘
                { name: '冰雪奇缘艾莎雪花', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/frozen-elza-snowflake/frozen-elza-snowflake-custom-cursor.png' }
            ]
        },
        {
            category: 'Sweezy 食物/品牌（预览图，可下载）',
            items: [
                // 薯片
                { name: '乐事经典薯片', url: 'https://sweezy-cursors.com/wp-content/uploads/cursor/auto-draft/lays-classic-potato-chips-custom-cursor.png' }
            ]
        }
    ];

    // 扁平化预设（兼容老逻辑：name->url）
    const PRESET_CURSORS = PRESET_CURSOR_CATEGORIES.reduce((acc, group) => {
        group.items.forEach(({ name, url }) => { acc[name] = url; });
        return acc;
    }, {});

    // 预设文字效果
    const PRESET_TEXTS = {
        '爱心': ['❤', '💖', '💝', '💕', '💗'],
        '星星': ['⭐', '🌟', '✨', '💫', '⭐'],
        '笑脸': ['😊', '😄', '😃', '😁', '😆'],
        '动物': ['🐱', '🐶', '🐼', '🐨', '🦊'],
        '水果': ['🍎', '🍊', '🍇', '🍉'],
        '符号': ['✿', '❀', '❁', '✾', '❃'],
        '箭头': ['➜', '➤', '➳', '➵', '➸'],
        '花朵': ['🌸', '🌺', '🌹', '🌷', '🌼'],
        '天气': ['☀️', '🌈', '❄️', '⚡', '🌙'],
        '食物': ['🍕', '🍔', '🍟', '🍦', '🍩'],
        '运动': ['⚽', '🏀', '🎾', '🏈', '⚾'],
        '音乐': ['🎵', '🎶', '🎸', '🎹', '🎺'],
        '游戏': ['🎮', '🎲', '🎯', '🎳', '🎰'],
        '节日': ['🎄', '🎃', '🎁', '🎊', '🎉'],
        '自然': ['🌿', '🍃', '🌱', '🌺', '🌸']
    };

    // 初始化配置
    function initializeConfig() {
        if (!GM_getValue('config')) {
            GM_setValue('config', DEFAULT_CONFIG);
        }
    }

    // 获取配置
    function getConfig() {
        const config = GM_getValue('config') || DEFAULT_CONFIG;
        // 兼容旧配置：图片光标缩放尺寸
        if (!config.cursorImageSize) {
            config.cursorImageSize = DEFAULT_CONFIG.cursorImageSize;
        }
        // 兼容旧配置，确保cursorEffect存在
        if (!config.cursorEffect) {
            config.cursorEffect = DEFAULT_CONFIG.cursorEffect;
        }
        // 兼容旧配置，确保ribbons配置存在
        if (!config.cursorEffect.ribbons) {
            config.cursorEffect.ribbons = DEFAULT_CONFIG.cursorEffect.ribbons;
        }
        return config;
    }

    // 保存配置
    function saveConfig(config) {
        GM_setValue('config', config);
    }

    // 创建配置弹窗
    function createConfigModal() {
        const config = getConfig();

        // 光标URL缓存（用于大图缩放后的 dataURL）
        const _cursorResolvedCache = new Map();

        function normalizeCursorUrl(url) {
            if (!url) return url;
            // https 页面下，http 光标经常会被浏览器拦截（mixed content）
            if (location && location.protocol === 'https:' && url.startsWith('http://')) {
                // 部分站点支持 https，优先升级
                if (/^http:\/\/(cur|ani)\.cursors-4u\.net\//i.test(url) || /^http:\/\/cur\.cursors-4u\.net\//i.test(url)) {
                    return url.replace(/^http:\/\//i, 'https://');
                }
            }
            return url;
        }

        function isProbablyBigPreviewImage(url) {
            if (!url) return false;
            // Sweezy 这类基本都是文章预览图（很大）
            if (url.includes('sweezy-cursors.com/wp-content/uploads/cursor/')) return true;
            return false;
        }

        function loadImageFromBlob(blob) {
            return new Promise((resolve, reject) => {
                const objectUrl = URL.createObjectURL(blob);
                const img = new Image();
                img.onload = () => {
                    URL.revokeObjectURL(objectUrl);
                    resolve(img);
                };
                img.onerror = (e) => {
                    URL.revokeObjectURL(objectUrl);
                    reject(e);
                };
                img.src = objectUrl;
            });
        }

        async function scaleImageToCursorDataUrl(url, size = 64) {
            const normalized = normalizeCursorUrl(url);
            const cacheKey = `${normalized}::${size}`;
            if (_cursorResolvedCache.has(cacheKey)) return _cursorResolvedCache.get(cacheKey);

            const blob = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: normalized,
                    responseType: 'blob',
                    onload: (res) => resolve(res.response),
                    onerror: (err) => reject(err)
                });
            });

            const img = await loadImageFromBlob(blob);

            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, size, size);

            // contain 缩放居中
            const scale = Math.min(size / img.width, size / img.height);
            const w = Math.max(1, Math.round(img.width * scale));
            const h = Math.max(1, Math.round(img.height * scale));
            const x = Math.round((size - w) / 2);
            const y = Math.round((size - h) / 2);
            ctx.drawImage(img, x, y, w, h);

            const dataUrl = canvas.toDataURL('image/png');
            _cursorResolvedCache.set(cacheKey, dataUrl);
            return dataUrl;
        }

        async function scaleImageCropToCursorDataUrl(url, cropRect, size = 64, cacheSalt = '') {
            const normalized = normalizeCursorUrl(url);
            const cacheKey = `${normalized}::crop:${cacheSalt || JSON.stringify(cropRect)}::${size}`;
            if (_cursorResolvedCache.has(cacheKey)) return _cursorResolvedCache.get(cacheKey);

            const blob = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: normalized,
                    responseType: 'blob',
                    onload: (res) => resolve(res.response),
                    onerror: (err) => reject(err)
                });
            });

            const img = await loadImageFromBlob(blob);

            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, size, size);

            const sx = Math.max(0, cropRect.sx);
            const sy = Math.max(0, cropRect.sy);
            const sWidth = Math.max(1, cropRect.sWidth);
            const sHeight = Math.max(1, cropRect.sHeight);

            // 把裁切区域 contain 到 size×size
            const scale = Math.min(size / sWidth, size / sHeight);
            const dw = Math.max(1, Math.round(sWidth * scale));
            const dh = Math.max(1, Math.round(sHeight * scale));
            const dx = Math.round((size - dw) / 2);
            const dy = Math.round((size - dh) / 2);

            ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dw, dh);

            const dataUrl = canvas.toDataURL('image/png');
            _cursorResolvedCache.set(cacheKey, dataUrl);
            return dataUrl;
        }

        function isSweezyPairPreview(img, url) {
            // Sweezy 的预览图通常是“左 cursor + 右 pointer”，横向很宽
            if (!url || !url.includes('sweezy-cursors.com/wp-content/uploads/cursor/')) return false;
            if (!img || !img.width || !img.height) return false;
            return img.width >= img.height * 1.6; // 足够宽才认为是左右拼接
        }

        async function resolveCursorUrlForCss(url, role = 'normal') {
            const normalized = normalizeCursorUrl(url);
            if (!normalized) return normalized;
            if (normalized.startsWith('data:')) return normalized;

            // .cur/.ani/.ico 通常最适合当 cursor
            if (/\.(cur|ani|ico)(\?|#|$)/i.test(normalized)) return normalized;

            // 对“可能很大的预览图”先缩放（Sweezy：左右拼图要裁切）
            const desiredSize = getCursorSize();

            if (isProbablyBigPreviewImage(normalized)) {
                try {
                    const blob = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: normalized,
                            responseType: 'blob',
                            onload: (res) => resolve(res.response),
                            onerror: (err) => reject(err)
                        });
                    });
                    const img = await loadImageFromBlob(blob);

                    if (isSweezyPairPreview(img, normalized)) {
                        const halfW = Math.floor(img.width / 2);
                        const left = { sx: 0, sy: 0, sWidth: halfW, sHeight: img.height };
                        const right = { sx: halfW, sy: 0, sWidth: img.width - halfW, sHeight: img.height };
                        const pick = (role === 'hover') ? right : left; // hover 用右边，其他默认左边
                        return await scaleImageCropToCursorDataUrl(
                            normalized,
                            pick,
                            desiredSize,
                            `sweezy:${role}`
                        );
                    }

                    // 不是拼图就直接缩放整张
                    // 复用刚才拉到的 blob（避免二次请求）
                    const canvas = document.createElement('canvas');
                    canvas.width = desiredSize;
                    canvas.height = desiredSize;
                    const ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, desiredSize, desiredSize);
                    const scale = Math.min(desiredSize / img.width, desiredSize / img.height);
                    const w = Math.max(1, Math.round(img.width * scale));
                    const h = Math.max(1, Math.round(img.height * scale));
                    const x = Math.round((desiredSize - w) / 2);
                    const y = Math.round((desiredSize - h) / 2);
                    ctx.drawImage(img, x, y, w, h);
                    const dataUrl = canvas.toDataURL('image/png');
                    _cursorResolvedCache.set(`${normalized}::${desiredSize}`, dataUrl);
                    return dataUrl;
                } catch (e) {
                    // 失败就退回原逻辑
                    return await scaleImageToCursorDataUrl(normalized, desiredSize);
                }
            }

            // 其他图片：如果真的太大，也缩放（需要先探测尺寸）
            if (/\.(png|gif|jpg|jpeg|webp)(\?|#|$)/i.test(normalized)) {
                try {
                    const blob = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: normalized,
                            responseType: 'blob',
                            onload: (res) => resolve(res.response),
                            onerror: (err) => reject(err)
                        });
                    });
                    const img = await loadImageFromBlob(blob);
                    if (img.width > 128 || img.height > 128) {
                        // 重新走缩放（复用缓存）
                        return await scaleImageToCursorDataUrl(normalized, desiredSize);
                    }
                } catch (e) {
                    // 拉取失败就原样返回（可能仍可用）
                }
            }

            return normalized;
        }

        function toCursorCssValue(url, fallback = 'auto') {
            // 这里统一加热点坐标 0 0，避免某些浏览器对图片 cursor 的热点不确定
            // 语法：cursor: url(x) x y, auto;
            return `url('${url}') 0 0, ${fallback}`;
        }

        const getCursorSize = () => {
            const n = parseInt(config.cursorImageSize, 10);
            if (Number.isFinite(n) && n >= 24 && n <= 256) return n;
            return 64;
        };

        // 渲染收藏列表
        function renderFavoritesList() {
            const favorites = getFavorites();
            if (favorites.length === 0) {
                return '<div style="text-align: center; padding: 20px; color: #888;">暂无收藏，点击"添加"按钮收藏你喜欢的光标</div>';
            }
            return favorites.map(({ name, url }) => `
                <div class="cursor-option cursor-card" data-url="${url}" data-name="${name}">
                    <div class="cursor-card-title">${name}</div>
                    <div class="cursor-card-preview">
                        <img class="cursor-card-img" src="${url}" alt="${name}" loading="lazy">
                    </div>
                    <div class="cursor-card-actions">
                        <button class="cursor-preview-btn" type="button" title="预览光标" data-url="${url}" data-name="${name}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="cursor-remove-btn" type="button" title="从收藏中移除" data-url="${url}" data-name="${name}">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button class="cursor-download" type="button" title="下载到本地" data-url="${url}" data-name="${name}">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            <span class="cursor-download-text">下载</span>
                        </button>
                    </div>
                </div>
            `).join('');
        }

        // 渲染分组光标列表（支持下载按钮，卡片式 - Sweezy 风格）
        function renderCursorGroups(selectedUrl) {
            return PRESET_CURSOR_CATEGORIES.map(group => {
                const itemsHtml = group.items.map(({ name, url }) => `
                    <div class="cursor-option cursor-card" data-url="${url}" data-name="${name}" ${url === selectedUrl ? 'data-selected="true"' : ''}>
                        <div class="cursor-card-title">${name}</div>
                        <div class="cursor-card-preview">
                            <img class="cursor-card-img" src="${url}" alt="${name}" loading="lazy">
                        </div>
                        <div class="cursor-card-actions">
                            <button class="cursor-preview-btn" type="button" title="预览光标" data-url="${url}" data-name="${name}">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="cursor-add-btn" type="button" title="添加到收藏" data-url="${url}" data-name="${name}">
                                <span class="cursor-add-text">添加</span>
                                <span class="cursor-add-icon-wrapper">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                </span>
                            </button>
                            <button class="cursor-download" type="button" title="下载到本地" data-url="${url}" data-name="${name}">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                <span class="cursor-download-text">下载</span>
                            </button>
                        </div>
                    </div>
                `).join('');

                return `
                    <div class="cursor-category">
                        <div class="cursor-category-title">${group.category}</div>
                        <div class="cursor-category-items">
                            ${itemsHtml}
                        </div>
                    </div>
                `;
            }).join('');
        }

        // 加载 Font Awesome
        if (!document.querySelector('link[href*="font-awesome"]') && !document.querySelector('link[href*="fontawesome"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
            document.head.appendChild(link);
        }

        // 创建模态框样式
        const style = `
            .cursor-config-modal {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #1e1e1e;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(0,0,0,0.5);
                z-index: 999999;
                min-width: 500px;
                max-width: 90vw;
                max-height: 90vh;
                overflow-y: auto;
                font-family: Arial, sans-serif;
                color: #fff;
            }
            .cursor-config-modal h2 {
                margin: 0 0 20px 0;
                color: #cccccc;
                text-align: center;
                font-size: 1.5em;
                text-shadow: 0 0 10px rgba(204, 204, 204, 0.3);
            }
            .cursor-config-modal .qr-code-container {
                text-align: center;
                margin-bottom: 20px;
                padding: 10px;
                background: #2d2d2d;
                border-radius: 8px;
                border: 1px solid #444;
            }
            .cursor-config-modal .qr-code {
                display: inline-block;
                border-radius: 4px;
                margin-bottom: 10px;
            }
            .cursor-config-modal .qr-code-text {
                color: #cccccc;
                font-size: 14px;
                line-height: 1.5;
                text-shadow: 0 0 5px rgba(204, 204, 204, 0.2);
                font-weight: bold;
            }
            .cursor-config-modal .section {
                margin-bottom: 20px;
                background: #2d2d2d;
                padding: 15px;
                border-radius: 8px;
                border: 1px solid #444;
            }
            .cursor-config-modal .section-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;
                padding: 5px;
                border-radius: 4px;
            }
            .cursor-config-modal .section-header:hover {
                background: #444;
            }
            .cursor-config-modal .section-title {
                font-weight: bold;
                color: #4CAF50;
                font-size: 1.1em;
                text-shadow: 0 0 5px rgba(76, 175, 80, 0.2);
            }
            .cursor-config-modal .section-content {
                margin-top: 10px;
                padding-top: 10px;
                border-top: 1px solid #444;
                transition: all 0.3s ease;
                max-height: 1000px;
                overflow: hidden;
            }
            .cursor-config-modal .section-content.collapsed {
                margin-top: 0;
                padding-top: 0;
                max-height: 0;
                border-top: none;
            }
            .cursor-config-modal .toggle-icon {
                color: #4CAF50;
                font-size: 1.2em;
                transition: transform 0.3s ease;
            }
            .cursor-config-modal .toggle-icon.collapsed {
                transform: rotate(-90deg);
            }
            .cursor-config-modal select,
            .cursor-config-modal input[type="text"] {
                width: 100%;
                padding: 8px;
                margin: 5px 0;
                border: 1px solid #444;
                border-radius: 4px;
                background: #333;
                color: #fff;
                font-size: 14px;
            }
            .cursor-config-modal .custom-url-input {
                display: flex;
                gap: 10px;
                margin: 10px 0;
            }
            .cursor-config-modal .custom-url-input input {
                flex-grow: 1;
            }
            .cursor-config-modal .custom-url-input button {
                padding: 8px 15px;
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                transition: background 0.3s ease;
            }
            .cursor-config-modal .custom-url-input button:hover {
                background: #45a049;
            }
            .cursor-config-modal .button-group {
                text-align: center;
                margin-top: 20px;
            }
            .cursor-config-modal button {
                padding: 8px 20px;
                margin: 0 10px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s ease;
                font-size: 14px;
            }
            .cursor-config-modal .save-btn {
                background: #4CAF50;
                color: white;
            }
            .cursor-config-modal .save-btn:hover {
                background: #45a049;
                transform: translateY(-2px);
            }
            .cursor-config-modal .cancel-btn {
                background: #f44336;
                color: white;
            }
            .cursor-config-modal .cancel-btn:hover {
                background: #da190b;
                transform: translateY(-2px);
            }
            .cursor-config-modal .preview {
                margin: 10px 0;
                padding: 10px;
                border: 1px solid #444;
                border-radius: 4px;
                text-align: center;
                background: #333;
                min-height: 50px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .cursor-config-modal .preview-text {
                font-size: 24px;
                line-height: 1.5;
            }
            .cursor-config-modal .overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.7);
                z-index: 999998;
            }
            .cursor-config-modal label {
                display: block;
                margin: 10px 0;
                color: #e0e0e0;
                font-size: 14px;
            }
            .cursor-config-modal input[type="checkbox"] {
                margin-right: 8px;
                width: 16px;
                height: 16px;
            }
            .cursor-config-modal select:focus,
            .cursor-config-modal input:focus {
                outline: none;
                border-color: #4CAF50;
                box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
            }
            .cursor-config-modal .modal-content {
                position: relative;
                z-index: 999999;
            }
            .cursor-config-modal .preview-area {
                cursor: pointer;
                padding: 20px;
                text-align: center;
                background: #333;
                border-radius: 4px;
                margin: 10px 0;
            }
            .cursor-config-modal .preview-area:hover {
                background: #444;
            }
            .cursor-config-modal {
                --cursor-thumb-size: 140px;
            }
            .cursor-config-modal .cursor-option {
                cursor: pointer;
            }
            .cursor-config-modal .cursor-option[data-selected="true"] .cursor-card-preview {
                /* 移除紫色边框，保持简洁 */
            }
            .cursor-config-modal .cursor-card {
                background: linear-gradient(135deg, #2a2a2a 0%, #1e1e1e 100%);
                border: 1px solid #3a3a3a;
                border-radius: 12px;
                padding: 0;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                position: relative;
            }
            .cursor-config-modal .cursor-card:hover {
                transform: translateY(-4px);
                border-color: #8B5CF6;
                box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3);
                background: linear-gradient(135deg, #2f2f2f 0%, #232323 100%);
            }
            .cursor-config-modal .cursor-card[data-selected="true"] {
                border-color: #8B5CF6;
                box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.3), 0 4px 16px rgba(139, 92, 246, 0.2);
            }
            .cursor-config-modal .cursor-card-title {
                font-weight: 600;
                color: #ffffff;
                font-size: 14px;
                text-align: center;
                line-height: 1.4;
                padding: 12px 8px 8px 8px;
                min-height: 44px;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                transition: color 0.3s ease;
            }
            .cursor-config-modal .cursor-card:hover .cursor-card-title {
                color: #8B5CF6;
            }
            .cursor-config-modal .cursor-card-title::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                width: 60px;
                height: 2px;
                background: #8B5CF6;
                border-radius: 1px;
            }
            .cursor-config-modal .cursor-card-preview {
                width: 100%;
                height: var(--cursor-thumb-size);
                background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
                border-radius: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                position: relative;
                padding: 8px;
            }
            .cursor-config-modal .cursor-card-img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                transition: transform 0.3s ease;
            }
            .cursor-config-modal .cursor-card:hover .cursor-card-img {
                transform: scale(1.05);
            }
            .cursor-config-modal .cursor-card-actions {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 10px;
                padding: 12px;
                background: rgba(0, 0, 0, 0.15);
            }
            .cursor-config-modal .cursor-preview-btn {
                border: none;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: white;
                transition: all 0.3s ease;
                flex-shrink: 0;
                background: rgba(139, 92, 246, 0.8);
                box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
            }
            .cursor-config-modal .cursor-preview-btn:hover {
                background: rgba(139, 92, 246, 1);
                transform: scale(1.1);
                box-shadow: 0 4px 12px rgba(139, 92, 246, 0.5);
            }
            .cursor-config-modal .cursor-preview-btn i {
                font-size: 16px;
                display: block;
            }
            .cursor-config-modal .cursor-add-btn {
                border: none;
                border-radius: 25px;
                padding: 8px 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                cursor: pointer;
                color: white;
                transition: all 0.3s ease;
                flex-shrink: 0;
                background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
                box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
                font-size: 14px;
                font-weight: 500;
            }
            .cursor-config-modal .cursor-add-btn:hover {
                background: linear-gradient(135deg, #9F7AEA 0%, #8B5CF6 100%);
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(139, 92, 246, 0.5);
            }
            .cursor-config-modal .cursor-add-btn:active {
                transform: translateY(0);
            }
            .cursor-config-modal .cursor-add-text {
                display: inline-block;
                white-space: nowrap;
            }
            .cursor-config-modal .cursor-add-icon-wrapper {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }
            .cursor-config-modal .cursor-add-btn svg {
                width: 16px;
                height: 16px;
                display: block;
            }
            .cursor-config-modal .cursor-remove-btn {
                border: none;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: white;
                transition: all 0.3s ease;
                flex-shrink: 0;
                background: rgba(244, 67, 54, 0.8);
                box-shadow: 0 2px 8px rgba(244, 67, 54, 0.3);
                padding: 0;
            }
            .cursor-config-modal .cursor-remove-btn:hover {
                background: rgba(244, 67, 54, 1);
                transform: scale(1.1);
                box-shadow: 0 4px 12px rgba(244, 67, 54, 0.5);
            }
            .cursor-config-modal .cursor-remove-btn i {
                font-size: 16px;
                display: block;
            }
            .cursor-config-modal .cursor-download {
                border: none;
                border-radius: 50%;
                min-width: 40px;
                height: 40px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 2px;
                cursor: pointer;
                color: white;
                transition: all 0.3s ease;
                flex-shrink: 0;
                background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
                box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
                padding: 4px 8px;
            }
            .cursor-config-modal .cursor-download:hover {
                background: linear-gradient(135deg, #9F7AEA 0%, #8B5CF6 100%);
                transform: scale(1.1);
                box-shadow: 0 4px 12px rgba(139, 92, 246, 0.5);
            }
            .cursor-config-modal .cursor-download:active {
                transform: scale(0.95);
            }
            .cursor-config-modal .cursor-download svg {
                width: 16px;
                height: 16px;
                display: block;
                flex-shrink: 0;
            }
            .cursor-config-modal .cursor-download-text {
                display: block;
                font-size: 10px;
                font-weight: 500;
                line-height: 1;
                white-space: nowrap;
            }
            .cursor-config-modal .cursor-category {
                margin: 10px 0;
                padding: 8px;
                border: 1px solid #444;
                border-radius: 6px;
                background: #2a2a2a;
            }
            .cursor-config-modal .cursor-category-title {
                font-weight: bold;
                color: #e5e7eb;
                margin-bottom: 6px;
                font-size: 13px;
            }
            .cursor-config-modal .cursor-category-items {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 16px;
            }
            @media (max-width: 768px) {
                .cursor-config-modal .cursor-category-items {
                    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
                    gap: 12px;
                }
            }
            .cursor-config-modal .cursor-list {
                max-height: 300px;
                overflow-y: auto;
                margin: 10px 0;
                padding: 5px;
                background: #333;
                border-radius: 4px;
            }
            .download-format-menu {
                position: absolute;
                background: #2a2a2a;
                border: 1px solid #444;
                border-radius: 8px;
                padding: 4px 0;
                min-width: 220px;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
                z-index: 1000000;
                font-size: 13px;
            }
            .download-menu-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px 16px;
                width: 100%;
                border: none;
                background: transparent;
                color: #e5e7eb;
                cursor: pointer;
                transition: all 0.2s ease;
                text-align: left;
                font-size: 13px;
            }
            .download-menu-item:hover {
                background: #3a3a3a;
                color: #8B5CF6;
            }
            .cursor-config-modal .cursor-download.active {
                background: linear-gradient(135deg, #9F7AEA 0%, #8B5CF6 100%);
            }
            /* 自定义提示框样式 - 显示在弹窗中间 */
            .cursor-toast {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #2d2d2d 0%, #1e1e1e 100%);
                color: #fff;
                padding: 20px 30px;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(139, 92, 246, 0.3);
                z-index: 1000001;
                font-size: 15px;
                font-weight: 500;
                text-align: center;
                min-width: 280px;
                max-width: 90vw;
                animation: toastFadeIn 0.3s ease-out;
                border: 1px solid rgba(139, 92, 246, 0.4);
            }
            .cursor-toast.success {
                border-color: rgba(76, 175, 80, 0.4);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(76, 175, 80, 0.3);
            }
            .cursor-toast.error {
                border-color: rgba(244, 67, 54, 0.4);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(244, 67, 54, 0.3);
            }
            .cursor-toast.warning {
                border-color: rgba(255, 193, 7, 0.4);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 193, 7, 0.3);
            }
            .cursor-toast-title {
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 8px;
                color: #4CAF50;
            }
            .cursor-toast.error .cursor-toast-title {
                color: #f44336;
            }
            .cursor-toast.warning .cursor-toast-title {
                color: #FFC107;
            }
            .cursor-toast-text {
                line-height: 1.6;
                white-space: pre-line;
                word-break: break-word;
            }
            @keyframes toastFadeIn {
                from {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }
            @keyframes toastFadeOut {
                from {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
                to {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.9);
                }
            }
            .cursor-toast.fade-out {
                animation: toastFadeOut 0.3s ease-in forwards;
            }
        `;
        GM_addStyle(style);

        // 创建模态框HTML
        const modal = document.createElement('div');
        modal.className = 'cursor-config-modal';
        modal.innerHTML = `
            <div class="overlay"></div>
            <div class="modal-content">
                <h2>鼠标美化设置</h2>
                <div class="qr-code-container">
                    <img class="qr-code" src="data:image/jpeg;base64,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" alt="QR Code" width="140" height="141">
                    <div class="qr-code-text">生活不易，猪猪叹气 —— 赏口饲料，让我少气！😫</div>
                </div>
                <div class="section">
                    <div class="section-header" data-section="basic">
                        <div class="section-title">基本设置</div>
                        <span class="toggle-icon">▼</span>
                    </div>
                    <div class="section-content" id="basicContent">
                        <label>
                            <input type="checkbox" id="enableEffect" ${config.enabled ? 'checked' : ''}>
                            启用鼠标效果
                        </label>
                        <label style="margin-top:12px;">
                            光标大小（图片光标）: <span id="cursorImageSizeValue">${config.cursorImageSize || 64}</span> px
                            <input type="range" id="cursorImageSize" min="32" max="128" step="4" value="${config.cursorImageSize || 64}">
                            <div style="opacity:0.85; font-size:12px; margin-top:6px;">
                                说明：仅对 png/gif/jpg/webp 这类“图片型光标”生效；.cur/.ani/.ico 无法调整大小。
                            </div>
                        </label>
                    </div>
                </div>
                <div class="section">
                    <div class="section-header" data-section="normal">
                        <div class="section-title">普通光标</div>
                        <span class="toggle-icon collapsed">▼</span>
                    </div>
                    <div class="section-content collapsed" id="normalContent">
                        <div class="custom-url-input">
                            <input type="text" id="normalCustomUrl" placeholder="输入自定义光标URL">
                            <button id="addNormalCustom">添加</button>
                        </div>
                        <div class="cursor-list" id="normalCursorList">
                            ${renderCursorGroups(config.cursorNormal)}
                        </div>
                    </div>
                </div>
                <div class="section">
                    <div class="section-header" data-section="hover">
                        <div class="section-title">悬停光标</div>
                        <span class="toggle-icon collapsed">▼</span>
                    </div>
                    <div class="section-content collapsed" id="hoverContent">
                        <div class="custom-url-input">
                            <input type="text" id="hoverCustomUrl" placeholder="输入自定义光标URL">
                            <button id="addHoverCustom">添加</button>
                        </div>
                        <div class="cursor-list" id="hoverCursorList">
                            ${renderCursorGroups(config.cursorHover)}
                        </div>
                    </div>
                </div>
                <div class="section">
                    <div class="section-header" data-section="click">
                        <div class="section-title">点击光标</div>
                        <span class="toggle-icon collapsed">▼</span>
                    </div>
                    <div class="section-content collapsed" id="clickContent">
                        <div class="custom-url-input">
                            <input type="text" id="clickCustomUrl" placeholder="输入自定义光标URL">
                            <button id="addClickCustom">添加</button>
                        </div>
                        <div class="cursor-list" id="clickCursorList">
                            ${renderCursorGroups(config.cursorClick)}
                        </div>
                    </div>
                </div>
                <div class="section">
                    <div class="section-header" data-section="favorites">
                        <div class="section-title">⭐ 我的收藏</div>
                        <span class="toggle-icon collapsed">▼</span>
                    </div>
                    <div class="section-content collapsed" id="favoritesContent">
                        <div class="cursor-list" id="favoritesCursorList">
                            ${renderFavoritesList()}
                        </div>
                    </div>
                </div>
                <div class="section">
                    <div class="section-header" data-section="systemCursor">
                        <div class="section-title">系统光标（说明）</div>
                        <span class="toggle-icon collapsed">▼</span>
                    </div>
                    <div class="section-content collapsed" id="systemCursorContent">
                        <div style="color:#ddd; font-size: 13px; line-height: 1.6;">
                            <div style="margin-bottom:8px;">
                                这个脚本可以让你在网页上<b>预览和使用各种漂亮的光标</b>，还能<b>把光标文件下载到电脑里</b>。
                                不过<b>不能自动更换电脑系统的光标</b>，如果想换系统光标，需要你手动在系统设置里更换，脚本主页有图文教学。
                            </div>
                            <div style="margin-bottom:8px; padding:8px; background:#444; border-radius:4px; border-left:2px solid #FFC107;">
                                <b style="color:#FFC107;">⚠️ 关于动画光标：</b><br>
                                由于浏览器限制，<b>.gif 动画光标在网页中只显示第一帧（静态）</b>。想看到真正的动画效果，需要：
                                <br>• 下载 <b>.ani 或 .cur</b> 格式并装配到系统光标
                                <br>• 或访问 Sweezy 官网查看完整动画效果
                            </div>
                            <div style="margin-bottom:8px;">
                                系统光标方法：
                                <ol style="margin:6px 0 0 18px; padding:0;">
                                    <li>在上面的列表里点“下载”，把你喜欢的光标文件保存到本地。</li>
                                    <li>如果下载的是 <b>.cur 或 .ani 文件</b>：打开电脑的「系统」→「鼠标设置」→「相关设置」→「其他鼠标设置」→「指针」→ 选择光标方案或浏览文件替换。</li>
                                    <li>如果下载的是 <b>.png 或 .gif 图片</b>：这些只能在网页上用，想用作系统光标需要先转换成 .cur 格式。</li>
                                </ol>
                            </div>
                            <div style="margin-top:12px; padding:12px; background:#333; border-radius:6px; border-left:3px solid #4CAF50;">
                                <div style="font-weight:bold; color:#4CAF50; margin-bottom:8px;">✨ Sweezy 光标下载说明：</div>
                                <div style="opacity:0.9; line-height:1.6;">
                                    <p style="margin:6px 0;">Sweezy 网站提供多种光标格式，但这个脚本只提供简单的下载选项：</p>
                                    <ul style="margin:6px 0 0 18px; padding:0;">
                                        <li><b>访问 Sweezy 页面</b> - 打开官方页面手动下载 .cur/.ani/.zip 格式</li>
                                        <li><b>下载预览图</b> - 下载 PNG 格式的预览图（只能网页使用）</li>
                                        <li><b>提取左侧/右侧</b> - 从预览图中分离出左右两部分</li>
                                    </ul>
                                    <p style="margin:10px 0 0 0;"><b>推荐使用方法：</b></p>
                                    <ol style="margin:6px 0 0 18px; padding:0;">
                                        <li>点击 Sweezy 光标的"下载"按钮，选择"访问 Sweezy 页面下载"</li>
                                        <li>在打开的官方页面中，下载 <b>.zip 完整包</b> 或 <b>.ani/.cur</b> 系统光标格式</li>
                                        <li>下载后，在电脑「鼠标设置」→「指针」中替换系统光标</li>
                                    </ol>
                                    <p style="margin:10px 0 0 0; color:#FFC107;">💡 小贴士：官方页面的完整包 (.zip) 包含所有格式，最实用！</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="section">
                    <div class="section-header" data-section="text">
                        <div class="section-title">点击特效</div>
                        <span class="toggle-icon">▼</span>
                    </div>
                    <div class="section-content" id="textContent">
                        <label>
                            <input type="checkbox" id="enableTextEffect" ${config.textEffect.enabled ? 'checked' : ''}>
                            启用点击特效
                        </label>
                        <div class="text-effect-options">
                            <label>
                                特效类型:
                                <select id="textEffectType" ${!config.textEffect.enabled ? 'disabled' : ''}>
                                    <option value="text" ${config.textEffect.type === 'text' || !config.textEffect.type ? 'selected' : ''}>文字特效</option>
                                    <option value="spark" ${config.textEffect.type === 'spark' ? 'selected' : ''}>火花特效</option>
                                </select>
                            </label>
                            <div id="textEffectOptions" style="display: ${config.textEffect.type === 'spark' ? 'none' : 'block'}; margin-top: 10px;">
                                <label>
                                    <input type="checkbox" id="useCustomText" ${config.textEffect.useCustomText ? 'checked' : ''} ${!config.textEffect.enabled ? 'disabled' : ''}>
                                    使用自定义文字（模板"😘,😊,😂,🤣"要使用英文逗号）
                                </label>
                                <div class="custom-text-input" style="margin: 10px 0;">
                                    <input type="text" id="customText" placeholder="输入自定义文字或表情符号" value="${config.textEffect.customText}" ${!config.textEffect.enabled ? 'disabled' : ''}>
                                </div>
                                <select id="textEffect" ${config.textEffect.useCustomText || !config.textEffect.enabled ? 'disabled' : ''}>
                                    ${Object.entries(PRESET_TEXTS).map(([name, words]) =>
                                        `<option value="${words.join(',')}" ${words.join(',') === config.textEffect.words.join(',') ? 'selected' : ''}>${name}</option>`
                                    ).join('')}
                                </select>
                                <div class="effect-parameters">
                                    <label>
                                        文字大小: <input type="number" id="fontSize" value="${config.textEffect.fontSize}" min="8" max="72" ${!config.textEffect.enabled ? 'disabled' : ''}>px
                                    </label>
                                </div>
                            </div>
                            <div id="sparkEffectOptions" style="display: ${config.textEffect.type === 'spark' ? 'block' : 'none'}; margin-top: 10px;">
                                <label>
                                    火花颜色: <input type="color" id="sparkColor" value="${config.textEffect.spark?.sparkColor || '#ffffff'}" ${!config.textEffect.enabled ? 'disabled' : ''}>
                                </label>
                                <label>
                                    火花大小: <input type="number" id="sparkSize" value="${config.textEffect.spark?.sparkSize || 10}" min="5" max="30" ${!config.textEffect.enabled ? 'disabled' : ''}>
                                </label>
                                <label>
                                    火花半径: <input type="number" id="sparkRadius" value="${config.textEffect.spark?.sparkRadius || 15}" min="5" max="50" ${!config.textEffect.enabled ? 'disabled' : ''}>
                                </label>
                                <label>
                                    火花数量: <input type="number" id="sparkCount" value="${config.textEffect.spark?.sparkCount || 8}" min="4" max="32" ${!config.textEffect.enabled ? 'disabled' : ''}>
                                </label>
                                <label>
                                    持续时间: <input type="number" id="sparkDuration" value="${config.textEffect.spark?.duration || 400}" min="200" max="1000" step="50" ${!config.textEffect.enabled ? 'disabled' : ''}> ms
                                </label>
                                <label>
                                    缓动函数:
                                    <select id="sparkEasing" ${!config.textEffect.enabled ? 'disabled' : ''}>
                                        <option value="ease-out" ${config.textEffect.spark?.easing === 'ease-out' || !config.textEffect.spark?.easing ? 'selected' : ''}>ease-out</option>
                                        <option value="ease-in" ${config.textEffect.spark?.easing === 'ease-in' ? 'selected' : ''}>ease-in</option>
                                        <option value="ease-in-out" ${config.textEffect.spark?.easing === 'ease-in-out' ? 'selected' : ''}>ease-in-out</option>
                                        <option value="linear" ${config.textEffect.spark?.easing === 'linear' ? 'selected' : ''}>linear</option>
                                    </select>
                                </label>
                                <label>
                                    额外缩放: <input type="number" id="sparkExtraScale" value="${config.textEffect.spark?.extraScale || 1.0}" min="0.5" max="2.0" step="0.1" ${!config.textEffect.enabled ? 'disabled' : ''}>
                                </label>
                            </div>
                        </div>
                        <div class="preview">
                            <div class="preview-text" id="textEffectPreview">
                                ${config.textEffect.useCustomText ? config.textEffect.customText : config.textEffect.words.join(' ')}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="section">
                    <div class="section-header" data-section="cursorEffect">
                        <div class="section-title">光标特效</div>
                        <span class="toggle-icon collapsed">▼</span>
                    </div>
                    <div class="section-content collapsed" id="cursorEffectContent">
                        <label>
                            <input type="checkbox" id="enableCursorEffect" ${config.cursorEffect.enabled ? 'checked' : ''}>
                            启用光标特效
                        </label>
                        <div class="cursor-effect-options" style="margin-top: 10px;">
                            <label>
                                特效类型:
                                <select id="cursorEffectType" ${!config.cursorEffect.enabled ? 'disabled' : ''}>
                                    <option value="none" ${config.cursorEffect.type === 'none' ? 'selected' : ''}>无</option>
                                    <option value="crosshair" ${config.cursorEffect.type === 'crosshair' ? 'selected' : ''}>十字准星</option>
                                    <option value="ribbons" ${config.cursorEffect.type === 'ribbons' ? 'selected' : ''}>丝带</option>
                                    <option value="splash" ${config.cursorEffect.type === 'splash' ? 'selected' : ''}>流体水花</option>
                                    <option value="target" ${config.cursorEffect.type === 'target' ? 'selected' : ''}>目标光标</option>
                                </select>
                            </label>
                            <div id="crosshairOptions" style="display: ${config.cursorEffect.type === 'crosshair' ? 'block' : 'none'};">
                                <label>
                                    颜色: <input type="color" id="cursorEffectColor" value="${config.cursorEffect.color}" ${!config.cursorEffect.enabled ? 'disabled' : ''}>
                                </label>
                                <label style="margin-top: 10px;">
                                    <input type="checkbox" id="enableNoiseEffect" ${config.cursorEffect.enableNoiseEffect !== false ? 'checked' : ''} ${!config.cursorEffect.enabled ? 'disabled' : ''}>
                                    悬停链接时启用噪声滤镜动画
                                </label>
                            </div>
                            <div id="ribbonsOptions" style="display: ${config.cursorEffect.type === 'ribbons' ? 'block' : 'none'}; margin-top: 10px;">
                                <label>
                                    颜色: <input type="color" id="ribbonsColor" value="${(config.cursorEffect.ribbons?.colors && config.cursorEffect.ribbons.colors.length > 0) ? config.cursorEffect.ribbons.colors[0] : '#FC8EAC'}" ${!config.cursorEffect.enabled ? 'disabled' : ''}>
                                </label>
                                <label>
                                    厚度: <input type="number" id="ribbonsThickness" value="${config.cursorEffect.ribbons?.baseThickness || 30}" min="10" max="100" ${!config.cursorEffect.enabled ? 'disabled' : ''}>
                                </label>
                                <label>
                                    点数量: <input type="number" id="ribbonsPointCount" value="${config.cursorEffect.ribbons?.pointCount || 50}" min="20" max="200" ${!config.cursorEffect.enabled ? 'disabled' : ''}>
                                </label>
                                <label>
                                    速度: <input type="number" id="ribbonsSpeed" value="${config.cursorEffect.ribbons?.speedMultiplier || 0.6}" min="0.1" max="2" step="0.1" ${!config.cursorEffect.enabled ? 'disabled' : ''}>
                                </label>
                                <label>
                                    <input type="checkbox" id="ribbonsEnableFade" ${config.cursorEffect.ribbons?.enableFade ? 'checked' : ''} ${!config.cursorEffect.enabled ? 'disabled' : ''}>
                                    启用渐变效果
                                </label>
                                <label>
                                    <input type="checkbox" id="ribbonsEnableShader" ${config.cursorEffect.ribbons?.enableShaderEffect ? 'checked' : ''} ${!config.cursorEffect.enabled ? 'disabled' : ''}>
                                    启用着色器效果
                                </label>
                            </div>
                            <div id="splashOptions" style="display: ${config.cursorEffect.type === 'splash' ? 'block' : 'none'}; margin-top: 10px;">
                                <label>
                                    模拟分辨率: <input type="number" id="splashSimResolution" value="${config.cursorEffect.splash?.simResolution || 128}" min="64" max="256" ${!config.cursorEffect.enabled ? 'disabled' : ''}>
                                </label>
                                <label>
                                    颜色分辨率: <input type="number" id="splashDyeResolution" value="${config.cursorEffect.splash?.dyeResolution || 1440}" min="512" max="2048" ${!config.cursorEffect.enabled ? 'disabled' : ''}>
                                </label>
                                <label>
                                    密度消散: <input type="number" id="splashDensityDissipation" value="${config.cursorEffect.splash?.densityDissipation || 3.5}" min="0" max="10" step="0.1" ${!config.cursorEffect.enabled ? 'disabled' : ''}>
                                </label>
                                <label>
                                    速度消散: <input type="number" id="splashVelocityDissipation" value="${config.cursorEffect.splash?.velocityDissipation || 2}" min="0" max="10" step="0.1" ${!config.cursorEffect.enabled ? 'disabled' : ''}>
                                </label>
                                <label>
                                    漩涡强度: <input type="number" id="splashCurl" value="${config.cursorEffect.splash?.curl || 3}" min="0" max="20" step="0.1" ${!config.cursorEffect.enabled ? 'disabled' : ''}>
                                </label>
                                <label>
                                    水花半径: <input type="number" id="splashSplatRadius" value="${config.cursorEffect.splash?.splatRadius || 0.2}" min="0.1" max="1" step="0.1" ${!config.cursorEffect.enabled ? 'disabled' : ''}>
                                </label>
                                <label>
                                    水花力度: <input type="number" id="splashSplatForce" value="${config.cursorEffect.splash?.splatForce || 6000}" min="1000" max="10000" step="100" ${!config.cursorEffect.enabled ? 'disabled' : ''}>
                                </label>
                                <label>
                                    <input type="checkbox" id="splashShading" ${config.cursorEffect.splash?.shading !== false ? 'checked' : ''} ${!config.cursorEffect.enabled ? 'disabled' : ''}>
                                    启用阴影效果
                                </label>
                            </div>
                            <div id="targetOptions" style="display: ${config.cursorEffect.type === 'target' ? 'block' : 'none'}; margin-top: 10px;">
                                <label>
                                    颜色: <input type="color" id="targetColor" value="${config.cursorEffect.target?.color || '#ffffff'}" ${!config.cursorEffect.enabled ? 'disabled' : ''}>
                                </label>
                                <label>
                                    大小: <input type="number" id="targetSize" value="${config.cursorEffect.target?.size || 40}" min="20" max="100" ${!config.cursorEffect.enabled ? 'disabled' : ''}> px
                                </label>
                                <label>
                                    边框宽度: <input type="number" id="targetBorderWidth" value="${config.cursorEffect.target?.borderWidth || 2}" min="1" max="10" ${!config.cursorEffect.enabled ? 'disabled' : ''}> px
                                </label>
                                <label>
                                    旋转时长: <input type="number" id="targetSpinDuration" value="${config.cursorEffect.target?.spinDuration || 2}" min="0.5" max="10" step="0.5" ${!config.cursorEffect.enabled ? 'disabled' : ''}> 秒
                                </label>
                                <label>
                                    <input type="checkbox" id="targetHideDefaultCursor" ${config.cursorEffect.target?.hideDefaultCursor !== false ? 'checked' : ''} ${!config.cursorEffect.enabled ? 'disabled' : ''}>
                                    隐藏默认光标
                                </label>
                                <label>
                                    <input type="checkbox" id="targetParallaxOn" ${config.cursorEffect.target?.parallaxOn !== false ? 'checked' : ''} ${!config.cursorEffect.enabled ? 'disabled' : ''}>
                                    启用视差效果
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="button-group">
                    <button class="save-btn" id="saveConfig">保存设置</button>
                    <button class="cancel-btn" id="cancelConfig">取消</button>
                </div>
            </div>
        `;

        // 添加预览功能
        async function updatePreview(elementId, cursorUrl, role = 'normal') {
            const element = modal.querySelector(`#${elementId}`);
            if (element) {
                element.style.cursor = 'progress';
                const resolved = await resolveCursorUrlForCss(cursorUrl, role);
                element.style.cursor = toCursorCssValue(resolved, 'auto');
            }
        }

        // 更新文字特效预览
        function updateTextPreview() {
            const textEffect = modal.querySelector('#textEffect');
            const preview = modal.querySelector('#textEffectPreview');
            const useCustomText = modal.querySelector('#useCustomText');
            const customText = modal.querySelector('#customText');
            const fontSize = modal.querySelector('#fontSize');

            if (preview) {
                if (useCustomText.checked) {
                    const customWords = customText.value.split(',').map(word => word.trim()).filter(word => word);
                    preview.textContent = customWords.join(' ');
                    textEffect.disabled = true;
                } else {
                    preview.textContent = textEffect.value.split(',').join(' ');
                    textEffect.disabled = false;
                }
                preview.style.fontSize = `${fontSize.value}px`;
            }
        }

        // 处理光标选择
        function handleCursorSelection(listId, previewId, role = 'normal') {
            const list = modal.querySelector(`#${listId}`);
            const options = list.querySelectorAll('.cursor-option');

            options.forEach(option => {
                option.addEventListener('click', async (e) => {
                    // 点击下载按钮、预览按钮或添加按钮不触发选中
                    if (e && e.target && e.target.classList) {
                        if (e.target.classList.contains('cursor-download') ||
                            e.target.classList.contains('cursor-preview-btn') ||
                            e.target.classList.contains('cursor-add-btn') ||
                            e.target.classList.contains('cursor-remove-btn') ||
                            e.target.closest('.cursor-preview-btn') ||
                            e.target.closest('.cursor-add-btn') ||
                            e.target.closest('.cursor-remove-btn') ||
                            e.target.closest('.cursor-download')) return;
                    }
                    // 移除其他选项的选中状态
                    options.forEach(opt => opt.removeAttribute('data-selected'));
                    // 设置当前选项为选中状态
                    option.setAttribute('data-selected', 'true');
                });
            });
        }

        // 绑定预览按钮
        // 获取收藏列表
        function getFavorites() {
            const favorites = GM_getValue('cursorFavorites', []);
            return Array.isArray(favorites) ? favorites : [];
        }

        // 保存收藏列表
        function saveFavorites(favorites) {
            GM_setValue('cursorFavorites', favorites);
        }

        // 添加到收藏
        function addToFavorites(name, url) {
            const favorites = getFavorites();
            // 检查是否已存在
            const exists = favorites.some(fav => fav.url === url);
            if (exists) {
                showToast('该光标已在收藏列表中', '鼠标美化', 'warning', 2000);
                return;
            }
            favorites.push({ name, url, addedAt: Date.now() });
            saveFavorites(favorites);
            showToast(`已添加"${name}"到收藏列表`, '鼠标美化', 'success', 2000);
        }

        // 从收藏中移除
        function removeFromFavorites(url) {
            const favorites = getFavorites();
            const index = favorites.findIndex(fav => fav.url === url);
            if (index !== -1) {
                const removedName = favorites[index].name;
                favorites.splice(index, 1);
                saveFavorites(favorites);
                showToast(`已从收藏中移除"${removedName}"`, '鼠标美化', 'success', 2000);
                refreshFavoritesList();
            }
        }

        // 自定义提示框函数 - 显示在弹窗中间
        function showToast(text, title = '鼠标美化', type = 'success', duration = 2000) {
            // 移除已存在的提示框
            const existingToast = document.querySelector('.cursor-toast');
            if (existingToast) {
                existingToast.classList.add('fade-out');
                setTimeout(() => existingToast.remove(), 300);
            }

            // 创建提示框
            const toast = document.createElement('div');
            toast.className = `cursor-toast ${type}`;

            const titleEl = title ? `<div class="cursor-toast-title">${title}</div>` : '';
            toast.innerHTML = `
                ${titleEl}
                <div class="cursor-toast-text">${text}</div>
            `;

            document.body.appendChild(toast);

            // 自动移除
            setTimeout(() => {
                toast.classList.add('fade-out');
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.remove();
                    }
                }, 300);
            }, duration);
        }

        // 绑定预览按钮
        function bindPreviewButtons() {
            const previewButtons = modal.querySelectorAll('.cursor-preview-btn');
            previewButtons.forEach(btn => {
                // 移除旧的事件监听器（如果存在）
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);

                // 添加悬停提示
                let tooltip = null;
                newBtn.addEventListener('mouseenter', () => {
                    tooltip = document.createElement('div');
                    tooltip.className = 'button-tooltip';
                    tooltip.textContent = '预览';
                    tooltip.style.cssText = `
                        position: absolute;
                        bottom: 100%;
                        left: 50%;
                        transform: translateX(-50%);
                        margin-bottom: 8px;
                        padding: 4px 8px;
                        background: rgba(0, 0, 0, 0.8);
                        color: white;
                        font-size: 12px;
                        border-radius: 4px;
                        white-space: nowrap;
                        pointer-events: none;
                        z-index: 10000;
                    `;
                    newBtn.style.position = 'relative';
                    newBtn.appendChild(tooltip);
                });
                newBtn.addEventListener('mouseleave', () => {
                    if (tooltip) {
                        tooltip.remove();
                        tooltip = null;
                    }
                });

                newBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const url = newBtn.dataset.url;
                    const name = newBtn.dataset.name;
                    const card = newBtn.closest('.cursor-card');
                    if (!card) return;

                    // 确定光标类型（根据卡片所在的列表）
                    let role = 'normal';
                    const listContainer = card.closest('.cursor-list, .cursor-category-items');
                    if (listContainer) {
                        if (listContainer.id === 'hoverCursorList' || listContainer.closest('#hoverCursorList')) {
                            role = 'hover';
                        } else if (listContainer.id === 'clickCursorList' || listContainer.closest('#clickCursorList')) {
                            role = 'click';
                        }
                    }

                    // 移除之前的预览样式
                    if (modal.dataset.previewStyleId) {
                        const oldStyle = document.getElementById(modal.dataset.previewStyleId);
                        if (oldStyle) oldStyle.remove();
                    }

                    try {
                        // 解析光标URL
                        const resolved = await resolveCursorUrlForCss(url, role);
                        const cursorValue = toCursorCssValue(resolved, 'auto');

                        // 创建样式，应用到整个模态框和页面
                        const styleId = `cursor-preview-${Date.now()}`;
                        const style = document.createElement('style');
                        style.id = styleId;
                        style.textContent = `
                            .cursor-config-modal,
                            .cursor-config-modal *,
                            body {
                                cursor: ${cursorValue} !important;
                            }
                        `;
                        document.head.appendChild(style);
                        modal.dataset.previewStyleId = styleId;

                        // 点击模态框外部或模态框内非交互元素时取消预览
                        const cancelPreview = (e) => {
                            // 如果点击的是按钮、输入框等交互元素，不取消预览
                            if (e.target.closest('button') ||
                                e.target.closest('input') ||
                                e.target.closest('select') ||
                                e.target.closest('a') ||
                                e.target.closest('.cursor-preview-btn')) {
                                return;
                            }

                            // 如果点击的是模态框外部，取消预览
                            if (!modal.contains(e.target)) {
                                const previewStyle = document.getElementById(styleId);
                                if (previewStyle) {
                                    previewStyle.remove();
                                    delete modal.dataset.previewStyleId;
                                    document.removeEventListener('click', cancelPreview);
                                    document.removeEventListener('mousedown', cancelPreview);
                                }
                            }
                        };

                        // 延迟绑定，避免立即触发
                        setTimeout(() => {
                            document.addEventListener('click', cancelPreview);
                            document.addEventListener('mousedown', cancelPreview);
                        }, 100);

                    } catch (error) {
                        console.error('预览失败:', error);
                        showToast('预览失败，请检查光标链接', '光标预览', 'error', 2000);
                    }
                });
            });
        }

        // 刷新收藏列表
        function refreshFavoritesList() {
            const favoritesList = modal.querySelector('#favoritesCursorList');
            if (favoritesList) {
                favoritesList.innerHTML = renderFavoritesList();
                // 重新绑定收藏列表中的按钮事件
                bindDownloadButtons();
                bindPreviewButtons();
                bindRemoveButtons();
                // 绑定收藏列表中的卡片选择事件
                const options = favoritesList.querySelectorAll('.cursor-option');
                options.forEach(option => {
                    option.addEventListener('click', async (e) => {
                        if (e && e.target && e.target.classList) {
                            if (e.target.classList.contains('cursor-download') ||
                                e.target.classList.contains('cursor-preview-btn') ||
                                e.target.classList.contains('cursor-remove-btn') ||
                                e.target.closest('.cursor-preview-btn') ||
                                e.target.closest('.cursor-remove-btn') ||
                                e.target.closest('.cursor-download')) return;
                        }
                    });
                });
            }
        }

        // 绑定添加到收藏按钮
        function bindAddButtons() {
            const addButtons = modal.querySelectorAll('.cursor-add-btn');
            addButtons.forEach(btn => {
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);

                // 添加悬停提示
                let tooltip = null;
                newBtn.addEventListener('mouseenter', () => {
                    tooltip = document.createElement('div');
                    tooltip.className = 'button-tooltip';
                    tooltip.textContent = '添加到收藏';
                    tooltip.style.cssText = `
                        position: absolute;
                        bottom: 100%;
                        left: 50%;
                        transform: translateX(-50%);
                        margin-bottom: 8px;
                        padding: 4px 8px;
                        background: rgba(0, 0, 0, 0.8);
                        color: white;
                        font-size: 12px;
                        border-radius: 4px;
                        white-space: nowrap;
                        pointer-events: none;
                        z-index: 10000;
                    `;
                    newBtn.style.position = 'relative';
                    newBtn.appendChild(tooltip);
                });
                newBtn.addEventListener('mouseleave', () => {
                    if (tooltip) {
                        tooltip.remove();
                        tooltip = null;
                    }
                });

                newBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const url = newBtn.dataset.url;
                    const name = newBtn.dataset.name;
                    addToFavorites(name, url);
                    // 刷新收藏列表
                    refreshFavoritesList();
                });
            });
        }

        // 绑定从收藏中移除按钮
        function bindRemoveButtons() {
            const removeButtons = modal.querySelectorAll('.cursor-remove-btn');
            removeButtons.forEach(btn => {
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);

                // 添加悬停提示
                let tooltip = null;
                newBtn.addEventListener('mouseenter', () => {
                    tooltip = document.createElement('div');
                    tooltip.className = 'button-tooltip';
                    tooltip.textContent = '从收藏中移除';
                    tooltip.style.cssText = `
                        position: absolute;
                        bottom: 100%;
                        left: 50%;
                        transform: translateX(-50%);
                        margin-bottom: 8px;
                        padding: 4px 8px;
                        background: rgba(0, 0, 0, 0.8);
                        color: white;
                        font-size: 12px;
                        border-radius: 4px;
                        white-space: nowrap;
                        pointer-events: none;
                        z-index: 10000;
                    `;
                    newBtn.style.position = 'relative';
                    newBtn.appendChild(tooltip);
                });
                newBtn.addEventListener('mouseleave', () => {
                    if (tooltip) {
                        tooltip.remove();
                        tooltip = null;
                    }
                });

                newBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const url = newBtn.dataset.url;
                    removeFromFavorites(url);
                });
            });
        }

        // 下载功能
        function safeFilename(name, url) {
            const base = (name || 'cursor').toString().trim().replace(/[\\/:*?"<>|]/g, '_');
            try {
                const u = new URL(url);
                const pathname = u.pathname || '';
                const extMatch = pathname.match(/(\.[a-zA-Z0-9]+)$/);
                const ext = extMatch ? extMatch[1] : '.png';
                return `${base}${ext}`;
            } catch (e) {
                const extMatch = (url || '').match(/(\.[a-zA-Z0-9]+)(\?|#|$)/);
                const ext = extMatch ? extMatch[1] : '.png';
                return `${base}${ext}`;
            }
        }

        // 备用下载方法（使用a标签）
        function fallbackDownload(url, filename) {
            try {
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                return true;
            } catch (e) {
                console.error('备用下载方法失败:', e);
                return false;
            }
        }

        // 改进的下载函数
        function downloadFile(url, filename, label = '') {
            if (!url) {
                showToast('下载链接无效', '鼠标美化', 'error', 2000);
                return;
            }

            // 优先使用GM_download
            if (typeof GM_download === 'function') {
                try {
                    GM_download({
                        url: url,
                        name: filename,
                        saveAs: true,
                        onerror: (error) => {
                            console.warn('GM_download失败，尝试备用方法:', error);
                            // 如果GM_download失败，尝试备用方法
                            if (fallbackDownload(url, filename)) {
                                showToast(`成功下载：${filename}${label ? ` (${label})` : ''}`, '鼠标美化', 'success', 2000);
                            } else {
                                // 最后尝试直接打开链接
                                window.open(url, '_blank');
                                showToast(`已在新窗口打开下载链接${label ? ` (${label})` : ''}`, '鼠标美化', 'warning', 3000);
                            }
                        },
                        onload: () => {
                            showToast(`成功下载：${filename}${label ? ` (${label})` : ''}`, '鼠标美化', 'success', 2000);
                        }
                    });
                } catch (e) {
                    console.error('GM_download调用失败:', e);
                    // 如果调用失败，尝试备用方法
                    if (fallbackDownload(url, filename)) {
                        showToast(`成功下载：${filename}${label ? ` (${label})` : ''}`, '鼠标美化', 'success', 2000);
                    } else {
                        window.open(url, '_blank');
                        showToast(`已在新窗口打开下载链接${label ? ` (${label})` : ''}`, '鼠标美化', 'warning', 3000);
                    }
                }
            } else {
                // 如果没有GM_download，直接使用备用方法
                if (fallbackDownload(url, filename)) {
                    showToast(`成功下载：${filename}${label ? ` (${label})` : ''}`, '鼠标美化', 'success', 2000);
                } else {
                    window.open(url, '_blank');
                    showToast(`已在新窗口打开下载链接${label ? ` (${label})` : ''}`, '鼠标美化', 'warning', 3000);
                }
            }
        }

        // 从 Sweezy URL 生成下载链接（简化版）
        function generateSweezyDownloadUrls(baseUrl, cursorSlug) {
            if (!baseUrl || !baseUrl.includes('sweezy-cursors.com')) return null;

            // 从预览图 URL 提取光标 ID
            let cursorId = null;
            try {
                const url = new URL(baseUrl);
                const pathParts = url.pathname.split('/').filter(p => p);
                if (pathParts.length >= 3 && pathParts[pathParts.length - 3] === 'cursor') {
                    cursorId = pathParts[pathParts.length - 2];
                }
            } catch (e) {
                const match = baseUrl.match(/cursor\/([^\/]+)\//);
                if (match) cursorId = match[1];
            }

            if (!cursorId) return null;

            return {
                cursorId: cursorId,
                preview: baseUrl,
                // 标记这是简化版的 Sweezy 处理
                isSweezySimple: true
            };
        }


        // 显示下载格式选择菜单 - 增强版，支持精准跟随并限制在容器内
        function showDownloadMenu(btn, url, name) {
            // 辅助函数：下载 dataURL
            function downloadDataUrl(dataUrl, filename) {
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = filename;
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

            // 检查是否已有菜单打开，如果有则关闭
            const existingMenu = document.querySelector('.download-format-menu');
            if (existingMenu) {
                // 如果点击的是同一个按钮，关闭菜单
                if (existingMenu.dataset.buttonId === btn.dataset.buttonId) {
                    existingMenu.remove();
                    btn.classList.remove('active');
                    preciseFollowSystem.stopTracking();
                    return;
                } else {
                    // 如果点击的是不同按钮，关闭旧菜单
                    existingMenu.remove();
                    document.querySelectorAll('.cursor-download').forEach(b => b.classList.remove('active'));
                    preciseFollowSystem.stopTracking();
                }
            }

            // 获取按钮所在的容器
            function getButtonContainer(button) {
                let container = button.closest('.cursor-category-items');
                if (container) return container;

                container = button.closest('.cursor-category');
                if (container) return container;

                container = button.closest('#favoritesList');
                if (container) return container;

                container = button.closest('#normalCursorList, #hoverCursorList, #clickCursorList');
                if (container) return container;

                container = button.closest('.section-content');
                if (container) return container;

                container = button.closest('.section');
                if (container) return container;

                container = button.closest('.cursor-config-modal');
                return container;
            }

            const container = getButtonContainer(btn);
            if (!container) {
                console.error('无法找到按钮容器');
                return;
            }

            // 确保容器有相对定位
            const computedStyle = window.getComputedStyle(container);
            if (computedStyle.position === 'static') {
                container.style.position = 'relative';
            }

            // 检查是否是 Sweezy 光标
            const isSweezy = url && url.includes('sweezy-cursors.com');
            const sweezyUrls = isSweezy ? generateSweezyDownloadUrls(url) : null;

            // 创建菜单
            const menu = document.createElement('div');
            menu.className = 'download-format-menu';
            menu.dataset.buttonId = btn.dataset.buttonId || Date.now().toString();
            btn.dataset.buttonId = menu.dataset.buttonId;

            // 关键改变：使用 absolute 定位而不是 fixed
            menu.style.cssText = `
                position: absolute;
                background: #2a2a2a;
                border: 1px solid #444;
                border-radius: 8px;
                padding: 4px 0;
                min-width: 220px;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
                z-index: 1000001;
                font-size: 13px;
                opacity: 0;
                transform: translateY(-10px);
                transition: opacity 0.2s ease, transform 0.2s ease;
                overflow: hidden;
            `;

            const menuItems = [];

            if (sweezyUrls && sweezyUrls.isSweezySimple) {
                // Sweezy 下载选项（简化版）
                menuItems.push(
                    {
                        label: '🌐 访问 Sweezy 页面下载',
                        url: `https://sweezy-cursors.com/cursor/${sweezyUrls.cursorId}/`,
                        ext: '',
                        icon: '🌐',
                        action: 'open'
                    }
                );

                // 添加 PNG 下载选项
                menuItems.push(
                    {
                        label: '下载预览图',
                        url: sweezyUrls.preview,
                        ext: '.png',
                        icon: '🖼️'
                    },
                    {
                        label: '提取左侧光标',
                        url: sweezyUrls.preview,
                        ext: '.png',
                        icon: '◀️',
                        action: 'extract',
                        part: 'left'
                    },
                    {
                        label: '提取右侧指针',
                        url: sweezyUrls.preview,
                        ext: '.png',
                        icon: '▶️',
                        action: 'extract',
                        part: 'right'
                    },
                    {
                        label: 'Roblox的光标',
                        cursorId: sweezyUrls.cursorId,
                        fileType: 'cursor-for-roblox--png',
                        ext: '.png',
                        icon: '�',
                        action: 'sweezy-api'
                    },
                    {
                        label: 'Roblox 的指针',
                        cursorId: sweezyUrls.cursorId,
                        fileType: 'pointer-for-roblox--png',
                        ext: '.png',
                        icon: '🎮',
                        action: 'sweezy-api'
                    }
                );

            } else {
                // 普通光标的多种下载选项
                const originalExt = url.split('.').pop().split('?')[0].toLowerCase();

                // 原始文件下载
                menuItems.push({
                    label: '下载原始文件',
                    url: url,
                    ext: `.${originalExt}`,
                    icon: '⬇️'
                });

                // 如果是图片格式，提供转换选项
                if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(originalExt)) {
                    // 转换为不同尺寸的 PNG
                    menuItems.push(
                        {
                            label: '转换为 PNG (32x32)',
                            url: url,
                            ext: '.png',
                            icon: '🖼️',
                            action: 'convert',
                            size: 32
                        },
                        {
                            label: '转换为 PNG (64x64)',
                            url: url,
                            ext: '.png',
                            icon: '🖼️',
                            action: 'convert',
                            size: 64
                        },
                        {
                            label: '转换为 PNG (128x128)',
                            url: url,
                            ext: '.png',
                            icon: '🖼️',
                            action: 'convert',
                            size: 128
                        }
                    );

                    // 如果是 Sweezy 预览图（左右拼接），提供分离选项
                    if (url.includes('sweezy-cursors.com') || url.includes('custom-cursor')) {
                        menuItems.push(
                            {
                                label: '提取左侧光标',
                                url: url,
                                ext: '.png',
                                icon: '◀️',
                                action: 'extract',
                                part: 'left'
                            },
                            {
                                label: '提取右侧指针',
                                url: url,
                                ext: '.png',
                                icon: '▶️',
                                action: 'extract',
                                part: 'right'
                            }
                        );
                    }
                }

                // 如果是 .cur 或 .ani 文件，提供转换选项
                if (['cur', 'ani'].includes(originalExt)) {
                    menuItems.push({
                        label: '转换为 PNG 图像',
                        url: url,
                        ext: '.png',
                        icon: '🖼️',
                        action: 'convert',
                        size: 64
                    });
                }

                // 通用选项
                menuItems.push(
                    {
                        label: '复制下载链接',
                        url: url,
                        ext: '',
                        icon: '🔗',
                        action: 'copy'
                    },
                    {
                        label: '在新标签页打开',
                        url: url,
                        ext: '',
                        icon: '🔗',
                        action: 'open'
                    }
                );
            }

            // 统一的菜单关闭函数
            const cleanupAndCloseMenu = () => {
                if (menu.parentNode) {
                    menu.remove();
                }
                btn.classList.remove('active');
                document.removeEventListener('click', closeMenu, true);
                document.removeEventListener('touchstart', closeMenu, true);
                document.removeEventListener('keydown', handleKeyDown);
                preciseFollowSystem.stopTracking();
            };

            menuItems.forEach(item => {
                // 处理分隔线和禁用项
                if (item.disabled || item.label.includes('───')) {
                    const separatorEl = document.createElement('div');
                    separatorEl.style.cssText = `
                        padding: 8px 16px;
                        color: #9ca3af;
                        font-size: 11px;
                        text-align: center;
                        border-top: 1px solid #444;
                        margin: 4px 0;
                        background: #333;
                    `;
                    separatorEl.textContent = item.label;
                    menu.appendChild(separatorEl);
                    return;
                }

                const itemEl = document.createElement('button');
                itemEl.className = 'download-menu-item';
                itemEl.style.cssText = `
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 10px 16px;
                    width: 100%;
                    border: none;
                    background: transparent;
                    color: #e5e7eb;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-align: left;
                    font-size: 13px;
                `;
                itemEl.innerHTML = `
                    <span>${item.icon || ''}</span>
                    <span style="flex: 1;">${item.label}</span>
                    <span style="color: #9ca3af; font-size: 11px;">${item.ext}</span>
                `;
                itemEl.addEventListener('mouseenter', () => {
                    itemEl.style.background = '#3a3a3a';
                    itemEl.style.color = '#8B5CF6';
                });
                itemEl.addEventListener('mouseleave', () => {
                    itemEl.style.background = 'transparent';
                    itemEl.style.color = '#e5e7eb';
                });
                itemEl.addEventListener('click', async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();

                    // 处理不同的操作类型
                    if (item.action === 'copy') {
                        // 复制链接
                        try {
                            if (navigator.clipboard) {
                                await navigator.clipboard.writeText(item.url);
                            } else {
                                const textArea = document.createElement('textarea');
                                textArea.value = item.url;
                                textArea.style.position = 'fixed';
                                textArea.style.opacity = '0';
                                document.body.appendChild(textArea);
                                textArea.select();
                                document.execCommand('copy');
                                document.body.removeChild(textArea);
                            }
                            showToast('链接已复制到剪贴板', '鼠标美化', 'success', 2000);
                        } catch (err) {
                            showToast('复制失败', '鼠标美化', 'error', 2000);
                        }
                    } else if (item.action === 'open') {
                        // 在新标签页打开
                        window.open(item.url, '_blank');
                        showToast('已在新标签页打开', '鼠标美化', 'success', 2000);
                    } else if (item.action === 'convert') {
                        // 转换图像尺寸
                        try {
                            showToast(`正在转换为 ${item.size}x${item.size} PNG...`, '鼠标美化', 'info', 2000);
                            const dataUrl = await scaleImageToCursorDataUrl(item.url, item.size);
                            const filename = safeFilename(name + `_${item.size}x${item.size}`, '.png');
                            downloadDataUrl(dataUrl, filename);
                            showToast('转换完成并开始下载', '鼠标美化', 'success', 2000);
                        } catch (error) {
                            console.error('转换失败:', error);
                            showToast('转换失败，请重试', '鼠标美化', 'error', 2000);
                        }
                    } else if (item.action === 'extract') {
                        // 提取左右部分
                        try {
                            showToast(`正在提取${item.part === 'left' ? '左侧' : '右侧'}部分...`, '鼠标美化', 'info', 2000);

                            // 获取图像并分割
                            const blob = await new Promise((resolve, reject) => {
                                GM_xmlhttpRequest({
                                    method: 'GET',
                                    url: normalizeCursorUrl(item.url),
                                    responseType: 'blob',
                                    onload: (res) => resolve(res.response),
                                    onerror: (err) => reject(err)
                                });
                            });

                            const img = await loadImageFromBlob(blob);
                            const halfW = Math.floor(img.width / 2);

                            const cropRect = item.part === 'left'
                                ? { sx: 0, sy: 0, sWidth: halfW, sHeight: img.height }
                                : { sx: halfW, sy: 0, sWidth: img.width - halfW, sHeight: img.height };

                            const dataUrl = await scaleImageCropToCursorDataUrl(
                                item.url,
                                cropRect,
                                64,
                                `extract:${item.part}`
                            );

                            const filename = safeFilename(`${name}_${item.part}`, '.png');
                            downloadDataUrl(dataUrl, filename);
                            showToast(`${item.part === 'left' ? '左侧' : '右侧'}部分提取完成`, '鼠标美化', 'success', 2000);
                        } catch (error) {
                            console.error('提取失败:', error);
                            showToast('提取失败，请重试', '鼠标美化', 'error', 2000);
                        }
                    } else {
                        // 普通下载
                        const filename = safeFilename(name, item.url).replace(/\.[^.]+$/, item.ext);
                        console.log('下载菜单项点击:', { url: item.url, filename, label: item.label });
                        downloadFile(item.url, filename, item.label);
                    }

                    cleanupAndCloseMenu(); // 使用统一的清理函数
                });
                menu.appendChild(itemEl);
            });

            // 关键改变：将菜单添加到容器内而不是 body
            container.appendChild(menu);
            btn.classList.add('active');

            // 启动精准跟随系统
            preciseFollowSystem.startTracking(menu, btn);

            // 添加菜单淡入效果
            setTimeout(() => {
                menu.style.opacity = '1';
                menu.style.transform = 'translateY(0)';
            }, 10);

            // 点击外部或再次点击按钮关闭菜单
            const closeMenu = (e) => {
                // 检查点击的目标是否在菜单内部、按钮本身或按钮的子元素
                if (!menu.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
                    cleanupAndCloseMenu();
                }
            };

            // 处理键盘事件（ESC 键关闭菜单）
            const handleKeyDown = (e) => {
                if (e.key === 'Escape') {
                    cleanupAndCloseMenu();
                }
            };

            // 立即添加事件监听器，使用捕获阶段确保能够捕获到所有点击事件
            // 同时监听 click 和 touchstart 事件以支持移动设备
            setTimeout(() => {
                document.addEventListener('click', closeMenu, true);
                document.addEventListener('touchstart', closeMenu, true);
                document.addEventListener('keydown', handleKeyDown);
            }, 0); // 使用 0 延迟，确保在当前事件循环结束后立即执行
        }

        // 精准跟随定位系统 - 使用相对定位限制在容器内
        function createPreciseFollowSystem() {
            let activeMenu = null;
            let activeButton = null;
            let activeContainer = null;
            let updateRAF = null;
            let isUpdating = false;

            // 获取按钮所在的容器区域
            function getButtonContainer(button) {
                // 优先查找光标选择区域的直接容器
                let container = button.closest('.cursor-category-items');
                if (container) return container;

                // 查找光标分类容器
                container = button.closest('.cursor-category');
                if (container) return container;

                // 查找收藏列表容器
                container = button.closest('#favoritesList');
                if (container) return container;

                // 查找自定义光标列表容器
                container = button.closest('#normalCursorList, #hoverCursorList, #clickCursorList');
                if (container) return container;

                // 查找section内容区域
                container = button.closest('.section-content');
                if (container) return container;

                // 查找整个section
                container = button.closest('.section');
                if (container) return container;

                // 最后使用模态框作为容器
                container = button.closest('.cursor-config-modal');
                return container;
            }

            // 确保容器有相对定位
            function ensureContainerPositioning(container) {
                if (!container) return;

                const computedStyle = window.getComputedStyle(container);
                if (computedStyle.position === 'static') {
                    container.style.position = 'relative';
                }

                // 确保容器有足够的 z-index
                const currentZIndex = parseInt(computedStyle.zIndex) || 0;
                if (currentZIndex < 1000) {
                    container.style.zIndex = '1000';
                }
            }

            // 精准位置更新函数 - 使用相对于容器的定位
            function updateMenuPosition() {
                if (!activeMenu || !activeButton || !activeContainer) return;

                const buttonRect = activeButton.getBoundingClientRect();
                const containerRect = activeContainer.getBoundingClientRect();
                const menuRect = activeMenu.getBoundingClientRect();

                // 计算相对于容器的位置
                let left = buttonRect.left - containerRect.left;
                let top = buttonRect.bottom - containerRect.top + 8;

                // 容器内边界检测
                const containerWidth = activeContainer.offsetWidth;
                const containerHeight = activeContainer.offsetHeight;
                const padding = 10;

                // 水平位置调整 - 确保菜单不超出容器右边界
                if (left + menuRect.width > containerWidth - padding) {
                    left = Math.max(padding, containerWidth - menuRect.width - padding);
                }

                // 确保不超出容器左边界
                if (left < padding) {
                    left = padding;
                }

                // 垂直位置调整 - 优先显示在按钮下方
                if (top + menuRect.height > containerHeight - padding) {
                    // 尝试显示在按钮上方
                    const topPosition = buttonRect.top - containerRect.top - menuRect.height - 8;
                    if (topPosition >= padding) {
                        top = topPosition;
                    } else {
                        // 如果上下都不够，显示在容器内最佳位置
                        top = Math.max(padding, Math.min(top, containerHeight - menuRect.height - padding));
                    }
                }

                // 确保不超出容器顶部
                if (top < padding) {
                    top = padding;
                }

                // 应用位置
                activeMenu.style.left = `${left}px`;
                activeMenu.style.top = `${top}px`;
            }

            // 调度更新（节流）
            function scheduleUpdate() {
                if (isUpdating) return;

                isUpdating = true;
                updateRAF = requestAnimationFrame(() => {
                    updateMenuPosition();
                    isUpdating = false;
                });
            }

            // 开始位置跟踪
            function startPositionTracking(menu, button) {
                activeMenu = menu;
                activeButton = button;
                activeContainer = getButtonContainer(button);

                // 确保容器有正确的定位
                ensureContainerPositioning(activeContainer);

                // 立即更新一次位置
                updateMenuPosition();

                // 开始持续跟踪
                const update = () => {
                    if (activeMenu) {
                        updateMenuPosition();
                        requestAnimationFrame(update);
                    }
                };
                requestAnimationFrame(update);
            }

            // 停止位置跟踪
            function stopPositionTracking() {
                activeMenu = null;
                activeButton = null;
                activeContainer = null;
                if (updateRAF) {
                    cancelAnimationFrame(updateRAF);
                    updateRAF = null;
                }
            }

            // 监听影响位置的事件
            window.addEventListener('scroll', scheduleUpdate, { passive: true });
            window.addEventListener('resize', scheduleUpdate);
            window.addEventListener('orientationchange', scheduleUpdate);

            // 监听页面缩放
            let lastZoom = window.devicePixelRatio;
            const checkZoom = () => {
                if (window.devicePixelRatio !== lastZoom) {
                    lastZoom = window.devicePixelRatio;
                    scheduleUpdate();
                }
                requestAnimationFrame(checkZoom);
            };
            requestAnimationFrame(checkZoom);

            return {
                startTracking: startPositionTracking,
                stopTracking: stopPositionTracking
            };
        }

        // 创建精准跟随系统实例
        const preciseFollowSystem = createPreciseFollowSystem();

        function bindDownloadButtons() {
            const buttons = modal.querySelectorAll('.cursor-download');
            buttons.forEach((btn, index) => {
                // 检查是否已经绑定过事件（避免重复绑定）
                if (btn.dataset.downloadBound === 'true') {
                    return;
                }
                btn.dataset.downloadBound = 'true';

                // 为按钮添加唯一ID
                if (!btn.dataset.buttonId) {
                    btn.dataset.buttonId = `download_btn_${Date.now()}_${index}`;
                }

                // 添加悬停提示
                let tooltip = null;
                btn.addEventListener('mouseenter', () => {
                    tooltip = document.createElement('div');
                    tooltip.className = 'button-tooltip';
                    tooltip.textContent = '下载';
                    tooltip.style.cssText = `
                        position: absolute;
                        bottom: 100%;
                        left: 50%;
                        transform: translateX(-50%);
                        margin-bottom: 8px;
                        padding: 4px 8px;
                        background: rgba(0, 0, 0, 0.8);
                        color: white;
                        font-size: 12px;
                        border-radius: 4px;
                        white-space: nowrap;
                        pointer-events: none;
                        z-index: 10000;
                    `;
                    btn.style.position = 'relative';
                    btn.appendChild(tooltip);
                });
                btn.addEventListener('mouseleave', () => {
                    if (tooltip) {
                        tooltip.remove();
                        tooltip = null;
                    }
                });

                // 使用命名函数以便可以移除（如果需要）
                const downloadHandler = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();

                    const url = this.dataset.url;
                    const name = this.dataset.name || 'cursor';

                    console.log('下载按钮点击:', { url, name, button: this });

                    if (!url) {
                        console.error('下载链接为空');
                        showToast('下载链接无效', '鼠标美化', 'error', 2000);
                        return;
                    }

                    // 所有光标都显示下载菜单（包括普通光标和 Sweezy 光标）
                    showDownloadMenu(this, url, name);
                };

                // 使用capture阶段确保事件能触发，并保存引用以便后续可以移除
                btn.addEventListener('click', downloadHandler, { capture: true });
                btn._downloadHandler = downloadHandler;
            });
        }

        // 添加自定义光标
        function addCustomCursor(inputId, listId, previewId) {
            const input = modal.querySelector(`#${inputId}`);
            const list = modal.querySelector(`#${listId}`);
            const url = input.value.trim();

            if (url) {
                const option = document.createElement('div');
                option.className = 'cursor-option';
                option.dataset.url = url;
                option.innerHTML = `
                    <img class="cursor-preview" src="${url}" alt="自定义光标">
                    <span class="cursor-name">自定义光标</span>
                    <button class="cursor-download" type="button" title="下载到本地" data-url="${url}" data-name="自定义光标">下载</button>
                `;

                // 添加点击事件
                option.addEventListener('click', (e) => {
                    if (e && e.target && e.target.classList && e.target.classList.contains('cursor-download')) return;
                    const options = list.querySelectorAll('.cursor-option');
                    options.forEach(opt => opt.removeAttribute('data-selected'));
                    option.setAttribute('data-selected', 'true');
                });

                list.insertBefore(option, list.firstChild);
                input.value = '';

                // 自动选中新添加的光标
                option.click();

                // 绑定新按钮的下载事件、预览事件和添加事件
                bindDownloadButtons();
                bindPreviewButtons();
                bindAddButtons();
            }
        }

        // 处理展开/收缩
        function handleSectionToggle() {
            const headers = modal.querySelectorAll('.section-header');
            headers.forEach(header => {
                header.addEventListener('click', () => {
                    const sectionId = header.dataset.section;
                    const content = modal.querySelector(`#${sectionId}Content`);
                    const icon = header.querySelector('.toggle-icon');

                    content.classList.toggle('collapsed');
                    icon.classList.toggle('collapsed');
                });
            });
        }

        // 初始化光标选择
        handleCursorSelection('normalCursorList', '', 'normal');
        handleCursorSelection('hoverCursorList', '', 'hover');
        handleCursorSelection('clickCursorList', '', 'click');
        bindDownloadButtons();
        bindPreviewButtons();
        bindAddButtons();
        bindRemoveButtons();

        // 初始化收藏列表
        refreshFavoritesList();

        // 初始化展开/收缩
        handleSectionToggle();

        // 添加自定义光标事件
        modal.querySelector('#addNormalCustom').addEventListener('click', () => {
            addCustomCursor('normalCustomUrl', 'normalCursorList', '');
        });
        modal.querySelector('#addHoverCustom').addEventListener('click', () => {
            addCustomCursor('hoverCustomUrl', 'hoverCursorList', '');
        });
        modal.querySelector('#addClickCustom').addEventListener('click', () => {
            addCustomCursor('clickCustomUrl', 'clickCursorList', '');
        });

        // 添加事件监听器
        modal.querySelector('#useCustomText').addEventListener('change', updateTextPreview);
        modal.querySelector('#customText').addEventListener('input', updateTextPreview);
        modal.querySelector('#fontSize').addEventListener('input', updateTextPreview);
        modal.querySelector('#textEffect').addEventListener('change', updateTextPreview);

        // 点击特效类型切换
        modal.querySelector('#textEffectType').addEventListener('change', function() {
            const type = this.value;
            const textOptions = modal.querySelector('#textEffectOptions');
            const sparkOptions = modal.querySelector('#sparkEffectOptions');

            if (textOptions) {
                textOptions.style.display = type === 'text' ? 'block' : 'none';
            }
            if (sparkOptions) {
                sparkOptions.style.display = type === 'spark' ? 'block' : 'none';
            }
        });

        // 光标特效启用/禁用控制
        modal.querySelector('#enableCursorEffect').addEventListener('change', function() {
            const enabled = this.checked;
            modal.querySelector('#cursorEffectType').disabled = !enabled;
            modal.querySelector('#cursorEffectColor').disabled = !enabled;
            modal.querySelector('#enableNoiseEffect').disabled = !enabled;
            // Ribbons选项
            modal.querySelector('#ribbonsColor').disabled = !enabled;
            modal.querySelector('#ribbonsThickness').disabled = !enabled;
            modal.querySelector('#ribbonsPointCount').disabled = !enabled;
            modal.querySelector('#ribbonsSpeed').disabled = !enabled;
            modal.querySelector('#ribbonsEnableFade').disabled = !enabled;
            modal.querySelector('#ribbonsEnableShader').disabled = !enabled;
            // Splash选项
            modal.querySelector('#splashSimResolution').disabled = !enabled;
            modal.querySelector('#splashDyeResolution').disabled = !enabled;
            modal.querySelector('#splashDensityDissipation').disabled = !enabled;
            modal.querySelector('#splashVelocityDissipation').disabled = !enabled;
            modal.querySelector('#splashCurl').disabled = !enabled;
            modal.querySelector('#splashSplatRadius').disabled = !enabled;
            modal.querySelector('#splashSplatForce').disabled = !enabled;
            modal.querySelector('#splashShading').disabled = !enabled;
            // Target选项
            modal.querySelector('#targetColor').disabled = !enabled;
            modal.querySelector('#targetSize').disabled = !enabled;
            modal.querySelector('#targetBorderWidth').disabled = !enabled;
            modal.querySelector('#targetSpinDuration').disabled = !enabled;
            modal.querySelector('#targetHideDefaultCursor').disabled = !enabled;
            modal.querySelector('#targetParallaxOn').disabled = !enabled;
        });

        // 特效类型切换时显示/隐藏对应选项
        modal.querySelector('#cursorEffectType').addEventListener('change', function() {
            const type = this.value;
            const crosshairOptions = modal.querySelector('#crosshairOptions');
            const ribbonsOptions = modal.querySelector('#ribbonsOptions');
            const splashOptions = modal.querySelector('#splashOptions');
            const targetOptions = modal.querySelector('#targetOptions');

            if (crosshairOptions) {
                crosshairOptions.style.display = type === 'crosshair' ? 'block' : 'none';
            }
            if (ribbonsOptions) {
                ribbonsOptions.style.display = type === 'ribbons' ? 'block' : 'none';
            }
            if (splashOptions) {
                splashOptions.style.display = type === 'splash' ? 'block' : 'none';
            }
            if (targetOptions) {
                targetOptions.style.display = type === 'target' ? 'block' : 'none';
            }
        });

        // 初始化预览
        const selectedNormal = modal.querySelector('#normalCursorList [data-selected="true"]');
        const selectedHover = modal.querySelector('#hoverCursorList [data-selected="true"]');
        const selectedClick = modal.querySelector('#clickCursorList [data-selected="true"]');

        // 初始化缩略图尺寸（更像 Sweezy 的卡片大预览）
        const initialThumb = Math.max(96, Math.min(200, (getCursorSize() || 64) * 2));
        modal.style.setProperty('--cursor-thumb-size', `${initialThumb}px`);

        // 光标大小滑块
        const cursorImageSizeInput = modal.querySelector('#cursorImageSize');
        const cursorImageSizeValue = modal.querySelector('#cursorImageSizeValue');
        if (cursorImageSizeInput && cursorImageSizeValue) {
            cursorImageSizeInput.addEventListener('input', () => {
                const n = parseInt(cursorImageSizeInput.value, 10) || 64;
                cursorImageSizeValue.textContent = String(n);
                config.cursorImageSize = n; // 直接影响后续预览/保存时的缩放
                const thumb = Math.max(96, Math.min(220, n * 2));
                modal.style.setProperty('--cursor-thumb-size', `${thumb}px`);
            });
        }

        updateTextPreview();

        // 保存配置
        modal.querySelector('#saveConfig').addEventListener('click', async () => {
            const enabled = modal.querySelector('#enableEffect').checked;

            // 把选中的 cursor URL 先“解析/缩放/去 mixed content”
            const selectedNormal = modal.querySelector('#normalCursorList [data-selected="true"]');
            const selectedHover = modal.querySelector('#hoverCursorList [data-selected="true"]');
            const selectedClick = modal.querySelector('#clickCursorList [data-selected="true"]');

            const normalUrl = selectedNormal ? selectedNormal.dataset.url : DEFAULT_CONFIG.cursorNormal;
            const hoverUrl = selectedHover ? selectedHover.dataset.url : DEFAULT_CONFIG.cursorHover;
            const clickUrl = selectedClick ? selectedClick.dataset.url : DEFAULT_CONFIG.cursorClick;

            let resolvedNormal = normalUrl;
            let resolvedHover = hoverUrl;
            let resolvedClick = clickUrl;

            try {
                showToast('正在处理光标资源（可能需要几秒）...', '鼠标美化', 'success', 1500);
                resolvedNormal = await resolveCursorUrlForCss(normalUrl, 'normal');
                resolvedHover = await resolveCursorUrlForCss(hoverUrl, 'hover');
                resolvedClick = await resolveCursorUrlForCss(clickUrl, 'click');
            } catch (e) {
                // 失败就用原始链接
            }

            const newConfig = {
                enabled,
                cursorImageSize: getCursorSize(),
                cursorNormal: resolvedNormal,
                cursorHover: resolvedHover,
                cursorClick: resolvedClick,
                textEffect: {
                    enabled: modal.querySelector('#enableTextEffect').checked,
                    type: modal.querySelector('#textEffectType').value,
                    words: modal.querySelector('#textEffect').value.split(','),
                    fontSize: modal.querySelector('#fontSize').value,
                    customText: modal.querySelector('#customText').value,
                    useCustomText: modal.querySelector('#useCustomText').checked,
                    spark: {
                        sparkColor: modal.querySelector('#sparkColor').value,
                        sparkSize: parseInt(modal.querySelector('#sparkSize').value) || 10,
                        sparkRadius: parseInt(modal.querySelector('#sparkRadius').value) || 15,
                        sparkCount: parseInt(modal.querySelector('#sparkCount').value) || 8,
                        duration: parseInt(modal.querySelector('#sparkDuration').value) || 400,
                        easing: modal.querySelector('#sparkEasing').value,
                        extraScale: parseFloat(modal.querySelector('#sparkExtraScale').value) || 1.0
                    }
                },
                cursorEffect: {
                    enabled: modal.querySelector('#enableCursorEffect').checked,
                    type: modal.querySelector('#cursorEffectType').value,
                    intensity: config.cursorEffect.intensity || 5, // 保留配置但不显示在UI
                    color: modal.querySelector('#cursorEffectColor').value,
                    size: config.cursorEffect.size || 20, // 保留配置但不显示在UI
                    enableNoiseEffect: modal.querySelector('#enableNoiseEffect').checked,
                    ribbons: {
                        colors: [modal.querySelector('#ribbonsColor').value],
                        baseSpring: config.cursorEffect.ribbons?.baseSpring || 0.03,
                        baseFriction: config.cursorEffect.ribbons?.baseFriction || 0.9,
                        baseThickness: parseInt(modal.querySelector('#ribbonsThickness').value) || 30,
                        offsetFactor: config.cursorEffect.ribbons?.offsetFactor || 0.05,
                        maxAge: config.cursorEffect.ribbons?.maxAge || 500,
                        pointCount: parseInt(modal.querySelector('#ribbonsPointCount').value) || 50,
                        speedMultiplier: parseFloat(modal.querySelector('#ribbonsSpeed').value) || 0.6,
                        enableFade: modal.querySelector('#ribbonsEnableFade').checked,
                        enableShaderEffect: modal.querySelector('#ribbonsEnableShader').checked,
                        effectAmplitude: config.cursorEffect.ribbons?.effectAmplitude || 2
                    },
                    splash: {
                        simResolution: parseInt(modal.querySelector('#splashSimResolution').value) || 128,
                        dyeResolution: parseInt(modal.querySelector('#splashDyeResolution').value) || 1440,
                        densityDissipation: parseFloat(modal.querySelector('#splashDensityDissipation').value) || 3.5,
                        velocityDissipation: parseFloat(modal.querySelector('#splashVelocityDissipation').value) || 2,
                        pressure: config.cursorEffect.splash?.pressure || 0.1,
                        pressureIterations: config.cursorEffect.splash?.pressureIterations || 20,
                        curl: parseFloat(modal.querySelector('#splashCurl').value) || 3,
                        splatRadius: parseFloat(modal.querySelector('#splashSplatRadius').value) || 0.2,
                        splatForce: parseInt(modal.querySelector('#splashSplatForce').value) || 6000,
                        shading: modal.querySelector('#splashShading').checked,
                        colorUpdateSpeed: config.cursorEffect.splash?.colorUpdateSpeed || 10,
                        transparent: config.cursorEffect.splash?.transparent !== false
                    },
                    target: {
                        spinDuration: parseFloat(modal.querySelector('#targetSpinDuration').value) || 2,
                        hideDefaultCursor: modal.querySelector('#targetHideDefaultCursor').checked,
                        parallaxOn: modal.querySelector('#targetParallaxOn').checked,
                        size: parseInt(modal.querySelector('#targetSize').value) || 40,
                        color: modal.querySelector('#targetColor').value,
                        borderWidth: parseInt(modal.querySelector('#targetBorderWidth').value) || 2
                    }
                }
            };
            saveConfig(newConfig);
            showToast('设置已保存', '鼠标美化', 'success', 2000);
            setTimeout(() => {
                modal.remove();
                location.reload();
            }, 500);
        });

        modal.querySelector('#cancelConfig').addEventListener('click', () => {
            modal.remove();
        });

        // 阻止点击模态框内容时关闭
        modal.querySelector('.modal-content').addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // 点击遮罩层关闭
        modal.querySelector('.overlay').addEventListener('click', () => {
            modal.remove();
        });

        document.body.appendChild(modal);
    }

    // 应用鼠标样式
    function applyCursorStyles() {
        const config = getConfig();
        if (!config.enabled) return;

        const style = `
            html, body {
                cursor: url('${config.cursorNormal}') 0 0, default !important;
            }
            input[type=button], button, a:hover {
                cursor: url('${config.cursorHover}') 0 0, pointer !important;
            }
        `;
        GM_addStyle(style);

        // 点击效果
        document.addEventListener('click', function(event) {
            const clickStyle = document.createElement('style');
            clickStyle.textContent = `html, body { cursor: url('${config.cursorClick}') 0 0, auto !important; }`;
            document.head.appendChild(clickStyle);

            setTimeout(() => {
                clickStyle.remove();
            }, 100);
        });
    }

    // 文字特效
    function applyTextEffect() {
        const config = getConfig();
        if (!config.enabled || !config.textEffect.enabled) return;

        const effectType = config.textEffect.type || 'text';

        if (effectType === 'spark') {
            applySparkEffect(config.textEffect);
        } else {
            applyTextClickEffect(config.textEffect);
        }
    }

    // 文字点击特效
    function applyTextClickEffect(textConfig) {
        let wordIndex = 0;
        document.addEventListener('click', function(event) {
            let text;
            if (textConfig.useCustomText) {
                const customWords = textConfig.customText.split(',').map(word => word.trim()).filter(word => word);
                if (customWords.length > 0) {
                    text = customWords[wordIndex % customWords.length];
                    wordIndex = (wordIndex + 1) % customWords.length;
                } else {
                    text = '❤'; // 默认值
                }
            } else {
                text = textConfig.words[wordIndex];
                wordIndex = (wordIndex + 1) % textConfig.words.length;
            }

            const element = document.createElement('b');
            element.textContent = text;
            element.style.cssText = `
                position: fixed;
                z-index: 999999;
                pointer-events: none;
                user-select: none;
                left: ${event.clientX}px;
                top: ${event.clientY}px;
                color: ${getRandomColor()};
                font-size: ${textConfig.fontSize}px;
                opacity: 1;
                transition: all 0.5s ease-out;
            `;
            document.body.appendChild(element);

            setTimeout(() => {
                element.style.transform = 'translateY(-20px) scale(1.2)';
                element.style.opacity = '0';
                setTimeout(() => element.remove(), 500);
            }, 10);
        });
    }

    // 火花特效
    function applySparkEffect(textConfig) {
        const sparkConfig = textConfig.spark || {};
        const sparkColor = sparkConfig.sparkColor || '#fff';
        const sparkSize = sparkConfig.sparkSize || 10;
        const sparkRadius = sparkConfig.sparkRadius || 15;
        const sparkCount = sparkConfig.sparkCount || 8;
        const duration = sparkConfig.duration || 400;
        const easing = sparkConfig.easing || 'ease-out';
        const extraScale = sparkConfig.extraScale || 1.0;

        // 创建canvas容器
        const container = document.createElement('div');
        container.id = 'spark-effect-container';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 999999;
        `;
        document.body.appendChild(container);

        // 创建canvas
        const canvas = document.createElement('canvas');
        canvas.id = 'spark-canvas';
        canvas.style.cssText = `
            width: 100%;
            height: 100%;
            display: block;
            user-select: none;
            position: absolute;
            top: 0;
            left: 0;
            pointer-events: none;
        `;
        container.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let sparks = [];
        let animationId = null;
        let startTime = null;

        // 调整canvas大小
        function resizeCanvas() {
            const width = window.innerWidth;
            const height = window.innerHeight;
            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
            }
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // 缓动函数
        function easeFunc(t) {
            switch (easing) {
                case 'linear':
                    return t;
                case 'ease-in':
                    return t * t;
                case 'ease-in-out':
                    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                default: // ease-out
                    return t * (2 - t);
            }
        }

        // 绘制函数
        function draw(timestamp) {
            if (!startTime) {
                startTime = timestamp;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            sparks = sparks.filter(spark => {
                const elapsed = timestamp - spark.startTime;
                if (elapsed >= duration) {
                    return false;
                }

                const progress = elapsed / duration;
                const eased = easeFunc(progress);

                const distance = eased * sparkRadius * extraScale;
                const lineLength = sparkSize * (1 - eased);

                const x1 = spark.x + distance * Math.cos(spark.angle);
                const y1 = spark.y + distance * Math.sin(spark.angle);
                const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
                const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

                ctx.strokeStyle = sparkColor;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();

                return true;
            });

            if (sparks.length > 0) {
                animationId = requestAnimationFrame(draw);
            } else {
                animationId = null;
                startTime = null;
            }
        }

        // 点击处理
        document.addEventListener('click', function(event) {
            resizeCanvas();

            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const now = performance.now();
            const newSparks = Array.from({ length: sparkCount }, (_, i) => ({
                x,
                y,
                angle: (2 * Math.PI * i) / sparkCount,
                startTime: now
            }));

            sparks.push(...newSparks);

            if (!animationId) {
                startTime = null;
                animationId = requestAnimationFrame(draw);
            }
        });

        console.log('火花特效已初始化');
    }

    // 随机颜色
    function getRandomColor() {
        return `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
    }

    // 应用光标特效
    function applyCursorEffect() {
        const config = getConfig();
        if (!config.enabled || !config.cursorEffect || !config.cursorEffect.enabled) return;

        const effect = config.cursorEffect;

        // 创建特效容器
        const effectContainer = document.createElement('div');
        effectContainer.id = 'cursor-effect-container';
        effectContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 999998;
        `;
        document.body.appendChild(effectContainer);

        // 根据特效类型应用不同的特效
        switch(effect.type) {
            case 'none':
                // 无特效
                break;
            case 'crosshair':
                applyCrosshairEffect(effectContainer, effect);
                break;
            case 'ribbons':
                applyRibbonsEffect(effectContainer, effect);
                break;
            case 'splash':
                applySplashEffect(effectContainer, effect);
                break;
            case 'target':
                applyTargetCursorEffect(effectContainer, effect);
                break;
            // 在这里添加新的特效类型
            default:
                break;
        }
    }

    // 线性插值函数
    function lerp(a, b, n) {
        return (1 - n) * a + n * b;
    }

    // 获取鼠标位置
    function getMousePos(e, container) {
        if (container) {
            const bounds = container.getBoundingClientRect();
            return {
                x: e.clientX - bounds.left,
                y: e.clientY - bounds.top
            };
        }
        return { x: e.clientX, y: e.clientY };
    }

    // 十字准星特效
    function applyCrosshairEffect(container, effect) {
        let mouse = { x: 0, y: 0 };
        let isAnimating = false;

        // 创建SVG滤镜
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.style.cssText = 'position: absolute; left: 0; top: 0; width: 100%; height: 100%; pointer-events: none;';
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const filterX = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        filterX.setAttribute('id', 'filter-noise-x');
        const filterY = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        filterY.setAttribute('id', 'filter-noise-y');

        const turbulenceX = document.createElementNS('http://www.w3.org/2000/svg', 'feTurbulence');
        turbulenceX.setAttribute('type', 'fractalNoise');
        turbulenceX.setAttribute('baseFrequency', '0.000001');
        turbulenceX.setAttribute('numOctaves', '1');
        const displacementX = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap');
        displacementX.setAttribute('in', 'SourceGraphic');
        displacementX.setAttribute('scale', '40');
        filterX.appendChild(turbulenceX);
        filterX.appendChild(displacementX);

        const turbulenceY = document.createElementNS('http://www.w3.org/2000/svg', 'feTurbulence');
        turbulenceY.setAttribute('type', 'fractalNoise');
        turbulenceY.setAttribute('baseFrequency', '0.000001');
        turbulenceY.setAttribute('numOctaves', '1');
        const displacementY = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap');
        displacementY.setAttribute('in', 'SourceGraphic');
        displacementY.setAttribute('scale', '40');
        filterY.appendChild(turbulenceY);
        filterY.appendChild(displacementY);

        defs.appendChild(filterX);
        defs.appendChild(filterY);
        svg.appendChild(defs);
        container.appendChild(svg);

        // 创建水平线
        const lineHorizontal = document.createElement('div');
        lineHorizontal.style.cssText = `
            position: fixed;
            width: 100%;
            height: 1px;
            background: ${effect.color};
            pointer-events: none;
            transform: translateY(-50%);
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        container.appendChild(lineHorizontal);

        // 创建垂直线
        const lineVertical = document.createElement('div');
        lineVertical.style.cssText = `
            position: fixed;
            height: 100%;
            width: 1px;
            background: ${effect.color};
            pointer-events: none;
            transform: translateX(-50%);
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        container.appendChild(lineVertical);

        // 平滑动画状态
        const renderedStyles = {
            tx: { previous: 0, current: 0, amt: 0.15 },
            ty: { previous: 0, current: 0, amt: 0.15 }
        };

        let animationFrameId = null;
        let isMouseInWindow = false;

        // 鼠标移动处理
        const handleMouseMove = (e) => {
            mouse = getMousePos(e, null);

            // 检查鼠标是否在窗口内
            if (e.clientX < 0 || e.clientX > window.innerWidth ||
                e.clientY < 0 || e.clientY > window.innerHeight) {
                if (isMouseInWindow) {
                    lineHorizontal.style.opacity = '0';
                    lineVertical.style.opacity = '0';
                    isMouseInWindow = false;
                    if (animationFrameId) {
                        cancelAnimationFrame(animationFrameId);
                        animationFrameId = null;
                    }
                }
            } else {
                if (!isMouseInWindow) {
                    renderedStyles.tx.previous = renderedStyles.tx.current = mouse.x;
                    renderedStyles.ty.previous = renderedStyles.ty.current = mouse.y;

                    // 淡入动画
                    lineHorizontal.style.transition = 'opacity 0.9s ease-out';
                    lineVertical.style.transition = 'opacity 0.9s ease-out';
                    lineHorizontal.style.opacity = '1';
                    lineVertical.style.opacity = '1';

                    isMouseInWindow = true;
                    if (!animationFrameId) {
                        render();
                    }
                }
                // 持续更新鼠标位置（即使已经在窗口内）
                renderedStyles.tx.current = mouse.x;
                renderedStyles.ty.current = mouse.y;
            }
        };

        // 渲染函数
        const render = () => {
            if (!isMouseInWindow) {
                animationFrameId = null;
                return;
            }

            // 更新目标位置
            renderedStyles.tx.current = mouse.x;
            renderedStyles.ty.current = mouse.y;

            // 线性插值实现平滑跟随
            renderedStyles.tx.previous = lerp(
                renderedStyles.tx.previous,
                renderedStyles.tx.current,
                renderedStyles.tx.amt
            );
            renderedStyles.ty.previous = lerp(
                renderedStyles.ty.previous,
                renderedStyles.ty.current,
                renderedStyles.ty.amt
            );

            // 更新位置
            lineVertical.style.left = renderedStyles.tx.previous + 'px';
            lineHorizontal.style.top = renderedStyles.ty.previous + 'px';

            animationFrameId = requestAnimationFrame(render);
        };

        // 链接悬停效果（仅在启用噪声效果时）
        const links = document.querySelectorAll('a');
        let turbulenceAnimation = null;

        const enterLink = () => {
            // 如果未启用噪声效果，则不执行
            if (!effect.enableNoiseEffect) return;

            // 应用噪声滤镜
            lineHorizontal.style.filter = 'url(#filter-noise-x)';
            lineVertical.style.filter = 'url(#filter-noise-y)';

            // 噪声动画
            let turbulence = 1;
            const duration = 500; // 0.5秒
            const startTime = Date.now();

            if (turbulenceAnimation) {
                cancelAnimationFrame(turbulenceAnimation);
            }

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                turbulence = 1 - progress;

                turbulenceX.setAttribute('baseFrequency', turbulence * 0.01);
                turbulenceY.setAttribute('baseFrequency', turbulence * 0.01);

                if (progress < 1) {
                    turbulenceAnimation = requestAnimationFrame(animate);
                } else {
                    lineHorizontal.style.filter = 'none';
                    lineVertical.style.filter = 'none';
                }
            };

            animate();
        };

        const leaveLink = () => {
            if (!effect.enableNoiseEffect) return;

            if (turbulenceAnimation) {
                cancelAnimationFrame(turbulenceAnimation);
            }
            lineHorizontal.style.filter = 'none';
            lineVertical.style.filter = 'none';
        };

        // 绑定事件
        window.addEventListener('mousemove', handleMouseMove);

        links.forEach(link => {
            link.addEventListener('mouseenter', enterLink);
            link.addEventListener('mouseleave', leaveLink);
        });

        // 动态添加的链接也需要绑定事件
        const observer = new MutationObserver(() => {
            const newLinks = document.querySelectorAll('a:not([data-crosshair-bound])');
            newLinks.forEach(link => {
                link.setAttribute('data-crosshair-bound', 'true');
                link.addEventListener('mouseenter', enterLink);
                link.addEventListener('mouseleave', leaveLink);
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 标记已绑定的链接
        links.forEach(link => {
            link.setAttribute('data-crosshair-bound', 'true');
        });
    }

    // 丝带特效
    function applyRibbonsEffect(container, effect) {
        console.log('开始初始化丝带特效', effect);

        const ribbonsConfig = effect.ribbons || {};
        const colors = ribbonsConfig.colors && ribbonsConfig.colors.length > 0
            ? ribbonsConfig.colors
            : ['#FC8EAC'];

        console.log('丝带配置:', ribbonsConfig);
        console.log('丝带颜色:', colors);

        // 创建canvas容器
        const canvasContainer = document.createElement('div');
        canvasContainer.id = 'ribbons-container';
        canvasContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 999997;
        `;
        container.appendChild(canvasContainer);
        console.log('丝带容器已创建');

        // 动态加载OGL库
        const loadOGL = () => {
            // 检查是否已经加载
            if (window.OGL) {
                initRibbons(canvasContainer, ribbonsConfig, colors);
                return;
            }

            // 尝试多个CDN源（OGL库使用ES模块，需要通过importmap或动态import）
            // 使用esm.sh或skypack等支持ES模块的CDN
            const cdnSources = [
                'https://esm.sh/ogl@0.0.79',
                'https://cdn.skypack.dev/ogl@0.0.79',
                'https://esm.sh/ogl@latest',
                'https://cdn.skypack.dev/ogl@latest',
                'https://unpkg.com/ogl@0.0.79/src/index.js?module',
                'https://cdn.jsdelivr.net/npm/ogl@0.0.79/src/index.js'
            ];

            // 使用动态import加载ES模块
            const tryESMImport = async () => {
                for (const cdnUrl of cdnSources) {
                    try {
                        console.log(`尝试从 ${cdnUrl} 加载OGL库...`);
                        const module = await import(cdnUrl);
                        const OGL = module.default || module;

                        // 检查OGL的结构 - 可能是命名导出
                        let OGLModule = OGL;
                        if (!OGL.Renderer && OGL.OGL) {
                            OGLModule = OGL.OGL;
                        }

                        if (OGLModule && OGLModule.Renderer && OGLModule.Transform && OGLModule.Vec3 && OGLModule.Color && OGLModule.Polyline) {
                            console.log('OGL库通过ES模块加载成功');
                            window.OGL = OGLModule;
                            initRibbons(canvasContainer, ribbonsConfig, colors);
                            return;
                        } else {
                            console.warn('OGL模块加载但结构不正确，尝试下一个源');
                            console.log('模块结构:', Object.keys(OGL));
                            if (OGL.default) {
                                console.log('default导出:', Object.keys(OGL.default));
                            }
                        }
                    } catch (e) {
                        console.warn(`从 ${cdnUrl} 加载OGL失败:`, e.message);
                        console.error('详细错误:', e);
                    }
                }

                // 所有ES模块源都失败，显示错误
                console.error('所有OGL库ES模块源都加载失败');
                canvasContainer.innerHTML = '<div style="color: red; padding: 10px; background: rgba(0,0,0,0.8); border-radius: 4px; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 999999;">丝带特效需要加载OGL库，但所有CDN源都失败。<br>请打开控制台查看详细错误信息，或刷新页面重试。</div>';
            };

            // 尝试使用动态import
            tryESMImport().catch(err => {
                console.error('动态import执行失败:', err);
                canvasContainer.innerHTML = '<div style="color: red; padding: 10px; background: rgba(0,0,0,0.8); border-radius: 4px; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 999999;">动态import不支持，请检查浏览器版本或使用其他浏览器。</div>';
            });
        };

        loadOGL();
    }

    // 初始化丝带特效（使用OGL库）
    function initRibbons(container, config, colors) {
        // 尝试多种方式获取OGL库
        let OGL = window.OGL || window.ogl || (window.exports && window.exports.OGL);

        if (!OGL) {
            console.error('OGL library not loaded. Available globals:', Object.keys(window).filter(k => k.toLowerCase().includes('ogl')));
            container.innerHTML = '<div style="color: red; padding: 10px; background: rgba(0,0,0,0.8); border-radius: 4px;">OGL库加载失败，请刷新页面重试</div>';
            return;
        }

        try {
            const { Renderer, Transform, Vec3, Color, Polyline } = OGL;

            const renderer = new Renderer({
                dpr: window.devicePixelRatio || 2,
                alpha: true
            });
            const gl = renderer.gl;
            gl.clearColor(0, 0, 0, 0);

            gl.canvas.style.position = 'absolute';
            gl.canvas.style.top = '0';
            gl.canvas.style.left = '0';
            gl.canvas.style.width = '100%';
            gl.canvas.style.height = '100%';
            container.appendChild(gl.canvas);

            const scene = new Transform();
            const lines = [];

            const vertex = `
                precision highp float;

                attribute vec3 position;
                attribute vec3 next;
                attribute vec3 prev;
                attribute vec2 uv;
                attribute float side;

                uniform vec2 uResolution;
                uniform float uDPR;
                uniform float uThickness;
                uniform float uTime;
                uniform float uEnableShaderEffect;
                uniform float uEffectAmplitude;

                varying vec2 vUV;

                vec4 getPosition() {
                    vec4 current = vec4(position, 1.0);
                    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
                    vec2 nextScreen = next.xy * aspect;
                    vec2 prevScreen = prev.xy * aspect;
                    vec2 tangent = normalize(nextScreen - prevScreen);
                    vec2 normal = vec2(-tangent.y, tangent.x);
                    normal /= aspect;
                    normal *= mix(1.0, 0.1, pow(abs(uv.y - 0.5) * 2.0, 2.0));
                    float dist = length(nextScreen - prevScreen);
                    normal *= smoothstep(0.0, 0.02, dist);
                    float pixelWidthRatio = 1.0 / (uResolution.y / uDPR);
                    float pixelWidth = current.w * pixelWidthRatio;
                    normal *= pixelWidth * uThickness;
                    current.xy -= normal * side;
                    if(uEnableShaderEffect > 0.5) {
                        current.xy += normal * sin(uTime + current.x * 10.0) * uEffectAmplitude;
                    }
                    return current;
                }

                void main() {
                    vUV = uv;
                    gl_Position = getPosition();
                }
            `;

            const fragment = `
                precision highp float;
                uniform vec3 uColor;
                uniform float uOpacity;
                uniform float uEnableFade;
                varying vec2 vUV;
                void main() {
                    float fadeFactor = 1.0;
                    if(uEnableFade > 0.5) {
                        fadeFactor = 1.0 - smoothstep(0.0, 1.0, vUV.y);
                    }
                    gl_FragColor = vec4(uColor, uOpacity * fadeFactor);
                }
            `;

            function resize() {
                const width = container.clientWidth;
                const height = container.clientHeight;
                renderer.setSize(width, height);
                lines.forEach(line => line.polyline.resize());
            }
            window.addEventListener('resize', resize);

            const center = (colors.length - 1) / 2;
            colors.forEach((color, index) => {
                const spring = (config.baseSpring || 0.03) + (Math.random() - 0.5) * 0.05;
                const friction = (config.baseFriction || 0.9) + (Math.random() - 0.5) * 0.05;
                const thickness = (config.baseThickness || 30) + (Math.random() - 0.5) * 3;
                const offsetFactor = config.offsetFactor || 0.05;
                const mouseOffset = new Vec3(
                    (index - center) * offsetFactor + (Math.random() - 0.5) * 0.01,
                    (Math.random() - 0.5) * 0.1,
                    0
                );

                const line = {
                    spring,
                    friction,
                    mouseVelocity: new Vec3(),
                    mouseOffset
                };

                const count = config.pointCount || 50;
                const points = [];
                for (let i = 0; i < count; i++) {
                    points.push(new Vec3());
                }
                line.points = points;

                line.polyline = new Polyline(gl, {
                    points,
                    vertex,
                    fragment,
                    uniforms: {
                        uColor: { value: new Color(color) },
                        uThickness: { value: thickness },
                        uOpacity: { value: 1.0 },
                        uTime: { value: 0.0 },
                        uEnableShaderEffect: { value: (config.enableShaderEffect ? 1.0 : 0.0) },
                        uEffectAmplitude: { value: config.effectAmplitude || 2 },
                        uEnableFade: { value: (config.enableFade ? 1.0 : 0.0) }
                    }
                });
                line.polyline.mesh.setParent(scene);
                lines.push(line);
            });

            resize();
            console.log('初始化完成，容器尺寸:', container.clientWidth, 'x', container.clientHeight);
            console.log('渲染器尺寸:', renderer.gl.canvas.width, 'x', renderer.gl.canvas.height);

            const mouse = new Vec3();
            function updateMouse(e) {
                let x, y;
                // 使用window坐标而不是container坐标
                if (e.changedTouches && e.changedTouches.length) {
                    x = e.changedTouches[0].clientX;
                    y = e.changedTouches[0].clientY;
                } else {
                    x = e.clientX;
                    y = e.clientY;
                }
                const width = window.innerWidth;
                const height = window.innerHeight;
                mouse.set((x / width) * 2 - 1, (y / height) * -2 + 1, 0);
            }

            // 绑定到window而不是container，因为container有pointer-events: none
            window.addEventListener('mousemove', updateMouse);
            window.addEventListener('touchstart', updateMouse);
            window.addEventListener('touchmove', updateMouse);

            console.log('鼠标事件已绑定，线条数量:', lines.length);

            const tmp = new Vec3();
            let frameId;
            let lastTime = performance.now();

            function update() {
                frameId = requestAnimationFrame(update);
                const currentTime = performance.now();
                const dt = currentTime - lastTime;
                lastTime = currentTime;

                lines.forEach(line => {
                    tmp.copy(mouse).add(line.mouseOffset).sub(line.points[0]).multiply(line.spring);
                    line.mouseVelocity.add(tmp).multiply(line.friction);
                    line.points[0].add(line.mouseVelocity);

                    const maxAge = config.maxAge || 500;
                    const speedMultiplier = config.speedMultiplier || 0.6;

                    for (let i = 1; i < line.points.length; i++) {
                        if (isFinite(maxAge) && maxAge > 0) {
                            const segmentDelay = maxAge / (line.points.length - 1);
                            const alpha = Math.min(1, (dt * speedMultiplier) / segmentDelay);
                            line.points[i].lerp(line.points[i - 1], alpha);
                        } else {
                            line.points[i].lerp(line.points[i - 1], 0.9);
                        }
                    }

                    if (line.polyline && line.polyline.mesh && line.polyline.mesh.program && line.polyline.mesh.program.uniforms && line.polyline.mesh.program.uniforms.uTime) {
                        line.polyline.mesh.program.uniforms.uTime.value = currentTime * 0.001;
                    }
                    if (line.polyline) {
                        line.polyline.updateGeometry();
                    }
                });

                renderer.render({ scene });
            }
            update();
            console.log('渲染循环已启动');

            // 清理函数
            container._ribbonsCleanup = () => {
                window.removeEventListener('resize', resize);
                window.removeEventListener('mousemove', updateMouse);
                window.removeEventListener('touchstart', updateMouse);
                window.removeEventListener('touchmove', updateMouse);
                if (frameId) {
                    cancelAnimationFrame(frameId);
                }
                if (gl.canvas && gl.canvas.parentNode === container) {
                    container.removeChild(gl.canvas);
                }
            };
        } catch (error) {
            console.error('初始化丝带特效时出错:', error);
            container.innerHTML = '<div style="color: red; padding: 10px; background: rgba(0,0,0,0.8); border-radius: 4px;">丝带特效初始化失败: ' + error.message + '</div>';
        }
    }

    // 流体水花特效
    function applySplashEffect(container, effect) {
        console.log('开始初始化流体水花特效', effect);

        const splashConfig = effect.splash || {};

        // 创建canvas容器
        const canvasContainer = document.createElement('div');
        canvasContainer.id = 'splash-container';
        canvasContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 999997;
        `;
        container.appendChild(canvasContainer);

        // 创建canvas
        const canvas = document.createElement('canvas');
        canvas.id = 'fluid-canvas';
        canvas.style.cssText = `
            width: 100vw;
            height: 100vh;
            display: block;
        `;
        canvasContainer.appendChild(canvas);

        // 初始化流体模拟
        initSplashFluid(canvas, splashConfig);
    }

    // 初始化流体模拟
    function initSplashFluid(canvas, config) {
        // Pointer原型
        function pointerPrototype() {
            this.id = -1;
            this.texcoordX = 0;
            this.texcoordY = 0;
            this.prevTexcoordX = 0;
            this.prevTexcoordY = 0;
            this.deltaX = 0;
            this.deltaY = 0;
            this.down = false;
            this.moved = false;
            this.color = { r: 0, g: 0, b: 0 };
        }

        const SIM_RESOLUTION = config.simResolution || 128;
        const DYE_RESOLUTION = config.dyeResolution || 1440;
        const DENSITY_DISSIPATION = config.densityDissipation || 3.5;
        const VELOCITY_DISSIPATION = config.velocityDissipation || 2;
        const PRESSURE = config.pressure || 0.1;
        const PRESSURE_ITERATIONS = config.pressureIterations || 20;
        const CURL = config.curl || 3;
        const SPLAT_RADIUS = config.splatRadius || 0.2;
        const SPLAT_FORCE = config.splatForce || 6000;
        const SHADING = config.shading !== false;
        const COLOR_UPDATE_SPEED = config.colorUpdateSpeed || 10;
        const TRANSPARENT = config.transparent !== false;

        let pointers = [new pointerPrototype()];

        // 获取WebGL上下文函数
        function getWebGLContext(canvas) {
            const params = {
                alpha: TRANSPARENT,
                depth: false,
                stencil: false,
                antialias: false,
                preserveDrawingBuffer: false
            };

            let gl = canvas.getContext('webgl2', params);
            const isWebGL2 = !!gl;
            if (!isWebGL2) {
                gl = canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params);
            }

            let halfFloat;
            let supportLinearFiltering;

            if (isWebGL2) {
                gl.getExtension('EXT_color_buffer_float');
                supportLinearFiltering = gl.getExtension('OES_texture_float_linear');
            } else {
                halfFloat = gl.getExtension('OES_texture_half_float');
                supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear');
            }

            gl.clearColor(0.0, 0.0, 0.0, TRANSPARENT ? 0.0 : 1.0);

            const halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : halfFloat && halfFloat.HALF_FLOAT_OES;

            let formatRGBA, formatRG, formatR;
            if (isWebGL2) {
                formatRGBA = getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType);
                formatRG = getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType);
                formatR = getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType);
            } else {
                formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
                formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
                formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
            }

            return {
                gl,
                ext: {
                    formatRGBA,
                    formatRG,
                    formatR,
                    halfFloatTexType,
                    supportLinearFiltering
                }
            };
        }

        // 获取WebGL上下文
        const { gl, ext } = getWebGLContext(canvas);
        if (!ext.supportLinearFiltering) {
            config.DYE_RESOLUTION = 256;
            config.SHADING = false;
        }

        function getSupportedFormat(gl, internalFormat, format, type) {
            if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
                switch (internalFormat) {
                    case gl.R16F:
                        return getSupportedFormat(gl, gl.RG16F, gl.RG, type);
                    case gl.RG16F:
                        return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
                    default:
                        return null;
                }
            }
            return { internalFormat, format };
        }

        function supportRenderTextureFormat(gl, internalFormat, format, type) {
            const texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
            const fbo = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
            const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
            return status === gl.FRAMEBUFFER_COMPLETE;
        }

        // Shader编译和程序创建函数
        function compileShader(type, source, keywords) {
            source = addKeywords(source, keywords);
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.trace(gl.getShaderInfoLog(shader));
            }
            return shader;
        }

        function addKeywords(source, keywords) {
            if (!keywords) return source;
            let keywordsString = '';
            keywords.forEach(keyword => {
                keywordsString += '#define ' + keyword + '\n';
            });
            return keywordsString + source;
        }

        function createProgram(vertexShader, fragmentShader) {
            let program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.trace(gl.getProgramInfoLog(program));
            }
            return program;
        }

        function getUniforms(program) {
            let uniforms = {};
            let uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
            for (let i = 0; i < uniformCount; i++) {
                let uniformName = gl.getActiveUniform(program, i).name;
                uniforms[uniformName] = gl.getUniformLocation(program, uniformName);
            }
            return uniforms;
        }

        class Program {
            constructor(vertexShader, fragmentShader) {
                this.program = createProgram(vertexShader, fragmentShader);
                this.uniforms = getUniforms(this.program);
            }
            bind() {
                gl.useProgram(this.program);
            }
        }

        class Material {
            constructor(vertexShader, fragmentShaderSource) {
                this.vertexShader = vertexShader;
                this.fragmentShaderSource = fragmentShaderSource;
                this.programs = [];
                this.activeProgram = null;
                this.uniforms = [];
            }
            setKeywords(keywords) {
                let hash = 0;
                for (let i = 0; i < keywords.length; i++) {
                    hash += hashCode(keywords[i]);
                }
                let program = this.programs[hash];
                if (program == null) {
                    let fragmentShader = compileShader(gl.FRAGMENT_SHADER, this.fragmentShaderSource, keywords);
                    program = createProgram(this.vertexShader, fragmentShader);
                    this.programs[hash] = program;
                }
                if (program === this.activeProgram) return;
                this.uniforms = getUniforms(program);
                this.activeProgram = program;
            }
            bind() {
                gl.useProgram(this.activeProgram);
            }
        }

        function hashCode(s) {
            if (s.length === 0) return 0;
            let hash = 0;
            for (let i = 0; i < s.length; i++) {
                hash = (hash << 5) - hash + s.charCodeAt(i);
                hash |= 0;
            }
            return hash;
        }

        // 基础顶点着色器
        const baseVertexShader = compileShader(gl.VERTEX_SHADER, `
            precision highp float;
            attribute vec2 aPosition;
            varying vec2 vUv;
            varying vec2 vL;
            varying vec2 vR;
            varying vec2 vT;
            varying vec2 vB;
            uniform vec2 texelSize;
            void main () {
                vUv = aPosition * 0.5 + 0.5;
                vL = vUv - vec2(texelSize.x, 0.0);
                vR = vUv + vec2(texelSize.x, 0.0);
                vT = vUv + vec2(0.0, texelSize.y);
                vB = vUv - vec2(0.0, texelSize.y);
                gl_Position = vec4(aPosition, 0.0, 1.0);
            }
        `);

        // 各种着色器
        const copyShader = compileShader(gl.FRAGMENT_SHADER, `
            precision mediump float;
            precision mediump sampler2D;
            varying highp vec2 vUv;
            uniform sampler2D uTexture;
            void main () {
                gl_FragColor = texture2D(uTexture, vUv);
            }
        `);

        const clearShader = compileShader(gl.FRAGMENT_SHADER, `
            precision mediump float;
            precision mediump sampler2D;
            varying highp vec2 vUv;
            uniform sampler2D uTexture;
            uniform float value;
            void main () {
                gl_FragColor = value * texture2D(uTexture, vUv);
            }
        `);

        const displayShaderSource = `
            precision highp float;
            precision highp sampler2D;
            varying vec2 vUv;
            varying vec2 vL;
            varying vec2 vR;
            varying vec2 vT;
            varying vec2 vB;
            uniform sampler2D uTexture;
            uniform vec2 texelSize;
            vec3 linearToGamma (vec3 color) {
                color = max(color, vec3(0));
                return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));
            }
            void main () {
                vec3 c = texture2D(uTexture, vUv).rgb;
                #ifdef SHADING
                    vec3 lc = texture2D(uTexture, vL).rgb;
                    vec3 rc = texture2D(uTexture, vR).rgb;
                    vec3 tc = texture2D(uTexture, vT).rgb;
                    vec3 bc = texture2D(uTexture, vB).rgb;
                    float dx = length(rc) - length(lc);
                    float dy = length(tc) - length(bc);
                    vec3 n = normalize(vec3(dx, dy, length(texelSize)));
                    vec3 l = vec3(0.0, 0.0, 1.0);
                    float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
                    c *= diffuse;
                #endif
                float a = max(c.r, max(c.g, c.b));
                gl_FragColor = vec4(c, a);
            }
        `;

        const splatShader = compileShader(gl.FRAGMENT_SHADER, `
            precision highp float;
            precision highp sampler2D;
            varying vec2 vUv;
            uniform sampler2D uTarget;
            uniform float aspectRatio;
            uniform vec3 color;
            uniform vec2 point;
            uniform float radius;
            void main () {
                vec2 p = vUv - point.xy;
                p.x *= aspectRatio;
                vec3 splat = exp(-dot(p, p) / radius) * color;
                vec3 base = texture2D(uTarget, vUv).xyz;
                gl_FragColor = vec4(base + splat, 1.0);
            }
        `);

        const advectionShader = compileShader(gl.FRAGMENT_SHADER, `
            precision highp float;
            precision highp sampler2D;
            varying vec2 vUv;
            uniform sampler2D uVelocity;
            uniform sampler2D uSource;
            uniform vec2 texelSize;
            uniform vec2 dyeTexelSize;
            uniform float dt;
            uniform float dissipation;
            vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
                vec2 st = uv / tsize - 0.5;
                vec2 iuv = floor(st);
                vec2 fuv = fract(st);
                vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
                vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
                vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
                vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
                return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
            }
            void main () {
                #ifdef MANUAL_FILTERING
                    vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
                    vec4 result = bilerp(uSource, coord, dyeTexelSize);
                #else
                    vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
                    vec4 result = texture2D(uSource, coord);
                #endif
                float decay = 1.0 + dissipation * dt;
                gl_FragColor = result / decay;
            }
        `, ext.supportLinearFiltering ? null : ['MANUAL_FILTERING']);

        const divergenceShader = compileShader(gl.FRAGMENT_SHADER, `
            precision mediump float;
            precision mediump sampler2D;
            varying highp vec2 vUv;
            varying highp vec2 vL;
            varying highp vec2 vR;
            varying highp vec2 vT;
            varying highp vec2 vB;
            uniform sampler2D uVelocity;
            void main () {
                float L = texture2D(uVelocity, vL).x;
                float R = texture2D(uVelocity, vR).x;
                float T = texture2D(uVelocity, vT).y;
                float B = texture2D(uVelocity, vB).y;
                vec2 C = texture2D(uVelocity, vUv).xy;
                if (vL.x < 0.0) { L = -C.x; }
                if (vR.x > 1.0) { R = -C.x; }
                if (vT.y > 1.0) { T = -C.y; }
                if (vB.y < 0.0) { B = -C.y; }
                float div = 0.5 * (R - L + T - B);
                gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
            }
        `);

        const curlShader = compileShader(gl.FRAGMENT_SHADER, `
            precision mediump float;
            precision mediump sampler2D;
            varying highp vec2 vUv;
            varying highp vec2 vL;
            varying highp vec2 vR;
            varying highp vec2 vT;
            varying highp vec2 vB;
            uniform sampler2D uVelocity;
            void main () {
                float L = texture2D(uVelocity, vL).y;
                float R = texture2D(uVelocity, vR).y;
                float T = texture2D(uVelocity, vT).x;
                float B = texture2D(uVelocity, vB).x;
                float vorticity = R - L - T + B;
                gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
            }
        `);

        const vorticityShader = compileShader(gl.FRAGMENT_SHADER, `
            precision highp float;
            precision highp sampler2D;
            varying vec2 vUv;
            varying vec2 vL;
            varying vec2 vR;
            varying vec2 vT;
            varying vec2 vB;
            uniform sampler2D uVelocity;
            uniform sampler2D uCurl;
            uniform float curl;
            uniform float dt;
            void main () {
                float L = texture2D(uCurl, vL).x;
                float R = texture2D(uCurl, vR).x;
                float T = texture2D(uCurl, vT).x;
                float B = texture2D(uCurl, vB).x;
                float C = texture2D(uCurl, vUv).x;
                vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
                force /= length(force) + 0.0001;
                force *= curl * C;
                force.y *= -1.0;
                vec2 velocity = texture2D(uVelocity, vUv).xy;
                velocity += force * dt;
                velocity = min(max(velocity, -1000.0), 1000.0);
                gl_FragColor = vec4(velocity, 0.0, 1.0);
            }
        `);

        const pressureShader = compileShader(gl.FRAGMENT_SHADER, `
            precision mediump float;
            precision mediump sampler2D;
            varying highp vec2 vUv;
            varying highp vec2 vL;
            varying highp vec2 vR;
            varying highp vec2 vT;
            varying highp vec2 vB;
            uniform sampler2D uPressure;
            uniform sampler2D uDivergence;
            void main () {
                float L = texture2D(uPressure, vL).x;
                float R = texture2D(uPressure, vR).x;
                float T = texture2D(uPressure, vT).x;
                float B = texture2D(uPressure, vB).x;
                float C = texture2D(uPressure, vUv).x;
                float divergence = texture2D(uDivergence, vUv).x;
                float pressure = (L + R + B + T - divergence) * 0.25;
                gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
            }
        `);

        const gradientSubtractShader = compileShader(gl.FRAGMENT_SHADER, `
            precision mediump float;
            precision mediump sampler2D;
            varying highp vec2 vUv;
            varying highp vec2 vL;
            varying highp vec2 vR;
            varying highp vec2 vT;
            varying highp vec2 vB;
            uniform sampler2D uPressure;
            uniform sampler2D uVelocity;
            void main () {
                float L = texture2D(uPressure, vL).x;
                float R = texture2D(uPressure, vR).x;
                float T = texture2D(uPressure, vT).x;
                float B = texture2D(uPressure, vB).x;
                vec2 velocity = texture2D(uVelocity, vUv).xy;
                velocity.xy -= vec2(R - L, T - B);
                gl_FragColor = vec4(velocity, 0.0, 1.0);
            }
        `);

        // Blit函数
        const blit = (() => {
            gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
            gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(0);
            return (target, clear = false) => {
                if (target == null) {
                    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
                    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                } else {
                    gl.viewport(0, 0, target.width, target.height);
                    gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
                }
                if (clear) {
                    gl.clearColor(0.0, 0.0, 0.0, TRANSPARENT ? 0.0 : 1.0);
                    gl.clear(gl.COLOR_BUFFER_BIT);
                }
                gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
            };
        })();

        // 创建程序
        const copyProgram = new Program(baseVertexShader, copyShader);
        const clearProgram = new Program(baseVertexShader, clearShader);
        const splatProgram = new Program(baseVertexShader, splatShader);
        const advectionProgram = new Program(baseVertexShader, advectionShader);
        const divergenceProgram = new Program(baseVertexShader, divergenceShader);
        const curlProgram = new Program(baseVertexShader, curlShader);
        const vorticityProgram = new Program(baseVertexShader, vorticityShader);
        const pressureProgram = new Program(baseVertexShader, pressureShader);
        const gradienSubtractProgram = new Program(baseVertexShader, gradientSubtractShader);
        const displayMaterial = new Material(baseVertexShader, displayShaderSource);

        // FBO创建函数
        function createFBO(w, h, internalFormat, format, type, param) {
            gl.activeTexture(gl.TEXTURE0);
            let texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);
            let fbo = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
            gl.viewport(0, 0, w, h);
            gl.clear(gl.COLOR_BUFFER_BIT);
            let texelSizeX = 1.0 / w;
            let texelSizeY = 1.0 / h;
            return {
                texture,
                fbo,
                width: w,
                height: h,
                texelSizeX,
                texelSizeY,
                attach(id) {
                    gl.activeTexture(gl.TEXTURE0 + id);
                    gl.bindTexture(gl.TEXTURE_2D, texture);
                    return id;
                }
            };
        }

        function createDoubleFBO(w, h, internalFormat, format, type, param) {
            let fbo1 = createFBO(w, h, internalFormat, format, type, param);
            let fbo2 = createFBO(w, h, internalFormat, format, type, param);
            return {
                width: w,
                height: h,
                texelSizeX: fbo1.texelSizeX,
                texelSizeY: fbo1.texelSizeY,
                get read() { return fbo1; },
                set read(value) { fbo1 = value; },
                get write() { return fbo2; },
                set write(value) { fbo2 = value; },
                swap() {
                    let temp = fbo1;
                    fbo1 = fbo2;
                    fbo2 = temp;
                }
            };
        }

        function resizeFBO(target, w, h, internalFormat, format, type, param) {
            let newFBO = createFBO(w, h, internalFormat, format, type, param);
            copyProgram.bind();
            gl.uniform1i(copyProgram.uniforms.uTexture, target.attach(0));
            blit(newFBO);
            return newFBO;
        }

        function resizeDoubleFBO(target, w, h, internalFormat, format, type, param) {
            if (target.width === w && target.height === h) return target;
            target.read = resizeFBO(target.read, w, h, internalFormat, format, type, param);
            target.write = createFBO(w, h, internalFormat, format, type, param);
            target.width = w;
            target.height = h;
            target.texelSizeX = 1.0 / w;
            target.texelSizeY = 1.0 / h;
            return target;
        }

        let dye, velocity, divergence, curl, pressure;

        function initFramebuffers() {
            let simRes = getResolution(SIM_RESOLUTION);
            let dyeRes = getResolution(DYE_RESOLUTION);
            const texType = ext.halfFloatTexType;
            const rgba = ext.formatRGBA;
            const rg = ext.formatRG;
            const r = ext.formatR;
            const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

            gl.disable(gl.BLEND);

            if (!dye) {
                dye = createDoubleFBO(dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);
            } else {
                dye = resizeDoubleFBO(dye, dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);
            }

            if (!velocity) {
                velocity = createDoubleFBO(simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);
            } else {
                velocity = resizeDoubleFBO(velocity, simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);
            }

            divergence = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
            curl = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
            pressure = createDoubleFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
        }

        function getResolution(resolution) {
            let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
            if (aspectRatio < 1) aspectRatio = 1.0 / aspectRatio;
            const min = Math.round(resolution);
            const max = Math.round(resolution * aspectRatio);
            if (gl.drawingBufferWidth > gl.drawingBufferHeight) {
                return { width: max, height: min };
            } else {
                return { width: min, height: max };
            }
        }

        function scaleByPixelRatio(input) {
            const pixelRatio = window.devicePixelRatio || 1;
            return Math.floor(input * pixelRatio);
        }

        function updateKeywords() {
            let displayKeywords = [];
            if (SHADING) displayKeywords.push('SHADING');
            displayMaterial.setKeywords(displayKeywords);
        }

        updateKeywords();
        initFramebuffers();

        let lastUpdateTime = Date.now();
        let colorUpdateTimer = 0.0;

        function calcDeltaTime() {
            let now = Date.now();
            let dt = (now - lastUpdateTime) / 1000;
            dt = Math.min(dt, 0.016666);
            lastUpdateTime = now;
            return dt;
        }

        function resizeCanvas() {
            let width = scaleByPixelRatio(canvas.clientWidth);
            let height = scaleByPixelRatio(canvas.clientHeight);
            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
                return true;
            }
            return false;
        }

        function HSVtoRGB(h, s, v) {
            let r, g, b, i, f, p, q, t;
            i = Math.floor(h * 6);
            f = h * 6 - i;
            p = v * (1 - s);
            q = v * (1 - f * s);
            t = v * (1 - (1 - f) * s);
            switch (i % 6) {
                case 0: r = v; g = t; b = p; break;
                case 1: r = q; g = v; b = p; break;
                case 2: r = p; g = v; b = t; break;
                case 3: r = p; g = q; b = v; break;
                case 4: r = t; g = p; b = v; break;
                case 5: r = v; g = p; b = q; break;
            }
            return { r, g, b };
        }

        function generateColor() {
            let c = HSVtoRGB(Math.random(), 1.0, 1.0);
            c.r *= 0.15;
            c.g *= 0.15;
            c.b *= 0.15;
            return c;
        }

        function wrap(value, min, max) {
            const range = max - min;
            if (range === 0) return min;
            return ((value - min) % range) + min;
        }

        function updateColors(dt) {
            colorUpdateTimer += dt * COLOR_UPDATE_SPEED;
            if (colorUpdateTimer >= 1) {
                colorUpdateTimer = wrap(colorUpdateTimer, 0, 1);
                pointers.forEach(p => {
                    p.color = generateColor();
                });
            }
        }

        function updatePointerDownData(pointer, id, posX, posY) {
            pointer.id = id;
            pointer.down = true;
            pointer.moved = false;
            pointer.texcoordX = posX / canvas.width;
            pointer.texcoordY = 1.0 - posY / canvas.height;
            pointer.prevTexcoordX = pointer.texcoordX;
            pointer.prevTexcoordY = pointer.texcoordY;
            pointer.deltaX = 0;
            pointer.deltaY = 0;
            pointer.color = generateColor();
        }

        function updatePointerMoveData(pointer, posX, posY, color) {
            pointer.prevTexcoordX = pointer.texcoordX;
            pointer.prevTexcoordY = pointer.texcoordY;
            pointer.texcoordX = posX / canvas.width;
            pointer.texcoordY = 1.0 - posY / canvas.height;
            pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX);
            pointer.deltaY = correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY);
            pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
            pointer.color = color;
        }

        function updatePointerUpData(pointer) {
            pointer.down = false;
        }

        function correctDeltaX(delta) {
            let aspectRatio = canvas.width / canvas.height;
            if (aspectRatio < 1) delta *= aspectRatio;
            return delta;
        }

        function correctDeltaY(delta) {
            let aspectRatio = canvas.width / canvas.height;
            if (aspectRatio > 1) delta /= aspectRatio;
            return delta;
        }

        function correctRadius(radius) {
            let aspectRatio = canvas.width / canvas.height;
            if (aspectRatio > 1) radius *= aspectRatio;
            return radius;
        }

        function splatPointer(pointer) {
            let dx = pointer.deltaX * SPLAT_FORCE;
            let dy = pointer.deltaY * SPLAT_FORCE;
            splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color);
        }

        function clickSplat(pointer) {
            const color = generateColor();
            color.r *= 10.0;
            color.g *= 10.0;
            color.b *= 10.0;
            let dx = 10 * (Math.random() - 0.5);
            let dy = 30 * (Math.random() - 0.5);
            splat(pointer.texcoordX, pointer.texcoordY, dx, dy, color);
        }

        function splat(x, y, dx, dy, color) {
            splatProgram.bind();
            gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
            gl.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height);
            gl.uniform2f(splatProgram.uniforms.point, x, y);
            gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0.0);
            gl.uniform1f(splatProgram.uniforms.radius, correctRadius(SPLAT_RADIUS / 100.0));
            blit(velocity.write);
            velocity.swap();

            gl.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
            gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
            blit(dye.write);
            dye.swap();
        }

        function applyInputs() {
            pointers.forEach(p => {
                if (p.moved) {
                    p.moved = false;
                    splatPointer(p);
                }
            });
        }

        function step(dt) {
            gl.disable(gl.BLEND);

            curlProgram.bind();
            gl.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
            gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
            blit(curl);

            vorticityProgram.bind();
            gl.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
            gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
            gl.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1));
            gl.uniform1f(vorticityProgram.uniforms.curl, CURL);
            gl.uniform1f(vorticityProgram.uniforms.dt, dt);
            blit(velocity.write);
            velocity.swap();

            divergenceProgram.bind();
            gl.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
            gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
            blit(divergence);

            clearProgram.bind();
            gl.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0));
            gl.uniform1f(clearProgram.uniforms.value, PRESSURE);
            blit(pressure.write);
            pressure.swap();

            pressureProgram.bind();
            gl.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
            gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));

            for (let i = 0; i < PRESSURE_ITERATIONS; i++) {
                gl.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1));
                blit(pressure.write);
                pressure.swap();
            }

            gradienSubtractProgram.bind();
            gl.uniform2f(gradienSubtractProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
            gl.uniform1i(gradienSubtractProgram.uniforms.uPressure, pressure.read.attach(0));
            gl.uniform1i(gradienSubtractProgram.uniforms.uVelocity, velocity.read.attach(1));
            blit(velocity.write);
            velocity.swap();

            advectionProgram.bind();
            gl.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
            if (!ext.supportLinearFiltering) {
                gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY);
            }
            let velocityId = velocity.read.attach(0);
            gl.uniform1i(advectionProgram.uniforms.uVelocity, velocityId);
            gl.uniform1i(advectionProgram.uniforms.uSource, velocityId);
            gl.uniform1f(advectionProgram.uniforms.dt, dt);
            gl.uniform1f(advectionProgram.uniforms.dissipation, VELOCITY_DISSIPATION);
            blit(velocity.write);
            velocity.swap();

            if (!ext.supportLinearFiltering) {
                gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
            }
            gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
            gl.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
            gl.uniform1f(advectionProgram.uniforms.dissipation, DENSITY_DISSIPATION);
            blit(dye.write);
            dye.swap();
        }

        function render(target) {
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            gl.enable(gl.BLEND);
            drawDisplay(target);
        }

        function drawDisplay(target) {
            let width = target == null ? gl.drawingBufferWidth : target.width;
            let height = target == null ? gl.drawingBufferHeight : target.height;
            displayMaterial.bind();
            if (SHADING) {
                gl.uniform2f(displayMaterial.uniforms.texelSize, 1.0 / width, 1.0 / height);
            }
            gl.uniform1i(displayMaterial.uniforms.uTexture, dye.read.attach(0));
            blit(target);
        }

        function updateFrame() {
            const dt = calcDeltaTime();
            if (resizeCanvas()) initFramebuffers();
            updateColors(dt);
            applyInputs();
            step(dt);
            render(null);
            requestAnimationFrame(updateFrame);
        }

        // 事件处理
        window.addEventListener('mousedown', e => {
            let pointer = pointers[0];
            let posX = scaleByPixelRatio(e.clientX);
            let posY = scaleByPixelRatio(e.clientY);
            updatePointerDownData(pointer, -1, posX, posY);
            clickSplat(pointer);
        });

        let firstMouseMove = true;
        document.body.addEventListener('mousemove', function handleFirstMouseMove(e) {
            if (!firstMouseMove) return;
            firstMouseMove = false;
            let pointer = pointers[0];
            let posX = scaleByPixelRatio(e.clientX);
            let posY = scaleByPixelRatio(e.clientY);
            let color = generateColor();
            updateFrame();
            updatePointerMoveData(pointer, posX, posY, color);
            document.body.removeEventListener('mousemove', handleFirstMouseMove);
        });

        window.addEventListener('mousemove', e => {
            let pointer = pointers[0];
            let posX = scaleByPixelRatio(e.clientX);
            let posY = scaleByPixelRatio(e.clientY);
            let color = pointer.color;
            updatePointerMoveData(pointer, posX, posY, color);
        });

        let firstTouchStart = true;
        document.body.addEventListener('touchstart', function handleFirstTouchStart(e) {
            if (!firstTouchStart) return;
            firstTouchStart = false;
            const touches = e.targetTouches;
            let pointer = pointers[0];
            for (let i = 0; i < touches.length; i++) {
                let posX = scaleByPixelRatio(touches[i].clientX);
                let posY = scaleByPixelRatio(touches[i].clientY);
                updateFrame();
                updatePointerDownData(pointer, touches[i].identifier, posX, posY);
            }
            document.body.removeEventListener('touchstart', handleFirstTouchStart);
        });

        window.addEventListener('touchstart', e => {
            const touches = e.targetTouches;
            let pointer = pointers[0];
            for (let i = 0; i < touches.length; i++) {
                let posX = scaleByPixelRatio(touches[i].clientX);
                let posY = scaleByPixelRatio(touches[i].clientY);
                updatePointerDownData(pointer, touches[i].identifier, posX, posY);
            }
        });

        window.addEventListener('touchmove', e => {
            const touches = e.targetTouches;
            let pointer = pointers[0];
            for (let i = 0; i < touches.length; i++) {
                let posX = scaleByPixelRatio(touches[i].clientX);
                let posY = scaleByPixelRatio(touches[i].clientY);
                updatePointerMoveData(pointer, posX, posY, pointer.color);
            }
        }, false);

        window.addEventListener('touchend', e => {
            const touches = e.changedTouches;
            let pointer = pointers[0];
            for (let i = 0; i < touches.length; i++) {
                updatePointerUpData(pointer);
            }
        });

        updateFrame();
        console.log('流体水花特效初始化完成');
    }

    // 目标光标特效
    function applyTargetCursorEffect(container, effect) {
        console.log('开始初始化目标光标特效', effect);

        const targetConfig = effect.target || {};
        const spinDuration = targetConfig.spinDuration || 2;
        const hideDefaultCursor = targetConfig.hideDefaultCursor !== false;
        const parallaxOn = targetConfig.parallaxOn !== false;
        const color = targetConfig.color || '#ffffff';
        const hoverDuration = 0.2;
        const targetSelector = '.cursor-target, a, button, [role="button"], input[type="button"], input[type="submit"]';
        const borderWidth = 3;
        const cornerSize = 12;

        // 检测移动设备
        const isMobile = (() => {
            const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            const isSmallScreen = window.innerWidth <= 768;
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
            const isMobileUserAgent = mobileRegex.test(userAgent.toLowerCase());
            return (hasTouchScreen && isSmallScreen) || isMobileUserAgent;
        })();

        if (isMobile) {
            console.log('移动设备，不启用目标光标特效');
            return;
        }

        // 隐藏默认光标
        const originalCursor = document.body.style.cursor;
        if (hideDefaultCursor) {
            document.body.style.cursor = 'none';
        }

        // 创建光标容器
        const cursorWrapper = document.createElement('div');
        cursorWrapper.className = 'target-cursor-wrapper';
        cursorWrapper.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0;
            height: 0;
            pointer-events: none;
            z-index: 999999;
            mix-blend-mode: difference;
            transform: translate(-50%, -50%);
        `;
        container.appendChild(cursorWrapper);

        // 创建中心点
        const dot = document.createElement('div');
        dot.className = 'target-cursor-dot';
        dot.style.cssText = `
            position: absolute;
            left: 50%;
            top: 50%;
            width: 4px;
            height: 4px;
            background: ${color};
            border-radius: 50%;
            transform: translate(-50%, -50%);
            will-change: transform;
        `;
        cursorWrapper.appendChild(dot);

        // 创建四个角落
        const corners = [];
        const cornerClasses = ['corner-tl', 'corner-tr', 'corner-br', 'corner-bl'];
        const cornerStyles = [
            { borderRight: 'none', borderBottom: 'none', x: -cornerSize * 1.5, y: -cornerSize * 1.5 },
            { borderLeft: 'none', borderBottom: 'none', x: cornerSize * 0.5, y: -cornerSize * 1.5 },
            { borderLeft: 'none', borderTop: 'none', x: cornerSize * 0.5, y: cornerSize * 0.5 },
            { borderRight: 'none', borderTop: 'none', x: -cornerSize * 1.5, y: cornerSize * 0.5 }
        ];

        cornerClasses.forEach((className, index) => {
            const corner = document.createElement('div');
            corner.className = `target-cursor-corner ${className}`;
            const style = cornerStyles[index];
            corner.style.cssText = `
                position: absolute;
                left: 50%;
                top: 50%;
                width: ${cornerSize}px;
                height: ${cornerSize}px;
                border: ${borderWidth}px solid ${color};
                border-right: ${style.borderRight || borderWidth + 'px solid ' + color};
                border-left: ${style.borderLeft || borderWidth + 'px solid ' + color};
                border-top: ${style.borderTop || borderWidth + 'px solid ' + color};
                border-bottom: ${style.borderBottom || borderWidth + 'px solid ' + color};
                will-change: transform;
                transform: translate(${style.x}px, ${style.y}px);
            `;
            cursorWrapper.appendChild(corner);
            corners.push(corner);
        });

        // 线性插值函数
        const lerp = (a, b, n) => (1 - n) * a + n * b;

        // 平滑移动函数
        const moveCursor = (x, y) => {
            let currentX = parseFloat(cursorWrapper.style.left) || x;
            let currentY = parseFloat(cursorWrapper.style.top) || y;

            const update = () => {
                currentX = lerp(currentX, x, 0.2);
                currentY = lerp(currentY, y, 0.2);

                cursorWrapper.style.left = `${currentX}px`;
                cursorWrapper.style.top = `${currentY}px`;

                if (Math.abs(currentX - x) > 0.1 || Math.abs(currentY - y) > 0.1) {
                    requestAnimationFrame(update);
                }
            };
            update();
        };

        // 旋转动画
        let rotation = 0;
        let spinAnimationId = null;
        let isSpinning = true;

        const startSpin = () => {
            if (spinAnimationId) return;
            isSpinning = true;
            const spin = () => {
                if (!isSpinning) {
                    spinAnimationId = null;
                    return;
                }
                rotation += (360 / (spinDuration * 60)); // 60fps
                if (rotation >= 360) rotation = 0;
                cursorWrapper.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
                spinAnimationId = requestAnimationFrame(spin);
            };
            spin();
        };

        const stopSpin = () => {
            isSpinning = false;
            if (spinAnimationId) {
                cancelAnimationFrame(spinAnimationId);
                spinAnimationId = null;
            }
        };

        startSpin();

        // 状态变量
        let activeTarget = null;
        let activeStrength = 0;
        let targetCornerPositions = null;
        let isActive = false;
        let currentLeaveHandler = null;
        let resumeTimeout = null;

        // 角落位置更新函数
        const updateCorners = () => {
            if (!targetCornerPositions || !isActive) return;

            const cursorX = parseFloat(cursorWrapper.style.left) || 0;
            const cursorY = parseFloat(cursorWrapper.style.top) || 0;

            corners.forEach((corner, i) => {
                // 计算目标位置（相对于光标位置的偏移）
                const targetX = targetCornerPositions[i].x - cursorX;
                const targetY = targetCornerPositions[i].y - cursorY;

                // 获取当前transform值
                const transformMatch = corner.style.transform.match(/translate\(([^,]+)px,\s*([^)]+)px\)/);
                let currentX = cornerStyles[i].x;
                let currentY = cornerStyles[i].y;

                if (transformMatch) {
                    currentX = parseFloat(transformMatch[1]) || cornerStyles[i].x;
                    currentY = parseFloat(transformMatch[2]) || cornerStyles[i].y;
                }

                // 使用activeStrength进行插值
                const finalX = lerp(currentX, targetX, activeStrength);
                const finalY = lerp(currentY, targetY, activeStrength);

                corner.style.transition = 'none';
                corner.style.transform = `translate(${finalX}px, ${finalY}px)`;
            });
        };

        // 鼠标移动处理
        const handleMouseMove = (e) => {
            let x = e.clientX;
            let y = e.clientY;

            // 视差效果
            if (parallaxOn && !isActive) {
                const deltaX = (x - window.innerWidth / 2) * 0.15;
                const deltaY = (y - window.innerHeight / 2) * 0.15;
                x += deltaX;
                y += deltaY;
            }

            moveCursor(x, y);
        };

        // 鼠标进入目标元素
        const enterHandler = (e) => {
            const directTarget = e.target;
            const allTargets = [];
            let current = directTarget;

            while (current && current !== document.body) {
                if (current.matches && current.matches(targetSelector)) {
                    allTargets.push(current);
                }
                current = current.parentElement;
            }

            const target = allTargets[0] || null;
            if (!target || activeTarget === target) return;

            if (activeTarget && currentLeaveHandler) {
                currentLeaveHandler();
            }

            if (resumeTimeout) {
                clearTimeout(resumeTimeout);
                resumeTimeout = null;
            }

            activeTarget = target;
            stopSpin();
            cursorWrapper.style.transform = 'translate(-50%, -50%) rotate(0deg)';

            const rect = target.getBoundingClientRect();
            const cursorX = parseFloat(cursorWrapper.style.left) || 0;
            const cursorY = parseFloat(cursorWrapper.style.top) || 0;

            targetCornerPositions = [
                { x: rect.left - borderWidth, y: rect.top - borderWidth },
                { x: rect.right + borderWidth - cornerSize, y: rect.top - borderWidth },
                { x: rect.right + borderWidth - cornerSize, y: rect.bottom + borderWidth - cornerSize },
                { x: rect.left - borderWidth, y: rect.bottom + borderWidth - cornerSize }
            ];

            isActive = true;
            activeStrength = 0;

            // 立即更新一次，确保初始状态正确
            updateCorners();

            // 动画到目标位置
            let animateFrameId = null;
            const animateStrength = () => {
                if (!isActive || !targetCornerPositions) {
                    animateFrameId = null;
                    return;
                }

                activeStrength = Math.min(1, activeStrength + (1 / (hoverDuration * 60))); // 基于hoverDuration计算增量
                updateCorners();

                if (activeStrength < 1) {
                    animateFrameId = requestAnimationFrame(animateStrength);
                } else {
                    // 达到1后继续更新，跟随鼠标移动
                    updateCorners();
                    animateFrameId = requestAnimationFrame(animateStrength);
                }
            };
            animateFrameId = requestAnimationFrame(animateStrength);

            const leaveHandler = () => {
                isActive = false;
                targetCornerPositions = null;
                activeTarget = null;
                activeStrength = 0;

                // 角落回到初始位置
                corners.forEach((corner, index) => {
                    const style = cornerStyles[index];
                    corner.style.transition = 'transform 0.3s ease-out';
                    corner.style.transform = `translate(${style.x}px, ${style.y}px)`;
                });

                resumeTimeout = setTimeout(() => {
                    if (!activeTarget) {
                        rotation = rotation % 360;
                        cursorWrapper.style.transition = 'none';
                        startSpin();
                    }
                    resumeTimeout = null;
                }, 50);

                if (currentLeaveHandler) {
                    currentLeaveHandler = null;
                }
            };

            currentLeaveHandler = leaveHandler;
            target.addEventListener('mouseleave', leaveHandler);
        };

        // 鼠标按下/释放
        const mouseDownHandler = () => {
            dot.style.transition = 'transform 0.3s';
            dot.style.transform = 'translate(-50%, -50%) scale(0.7)';
            if (!isActive) {
                cursorWrapper.style.transition = 'transform 0.2s';
                const currentRotation = rotation % 360;
                cursorWrapper.style.transform = `translate(-50%, -50%) rotate(${currentRotation}deg) scale(0.9)`;
            } else {
                cursorWrapper.style.transition = 'transform 0.2s';
                cursorWrapper.style.transform = 'translate(-50%, -50%) rotate(0deg) scale(0.9)';
            }
        };

        const mouseUpHandler = () => {
            dot.style.transition = 'transform 0.3s';
            dot.style.transform = 'translate(-50%, -50%) scale(1)';
            if (!isActive && isSpinning) {
                // 恢复旋转动画，但不设置transition，让旋转动画继续
                cursorWrapper.style.transition = 'none';
                // 旋转动画会通过startSpin继续
            } else if (isActive) {
                cursorWrapper.style.transition = 'transform 0.2s';
                cursorWrapper.style.transform = 'translate(-50%, -50%) rotate(0deg) scale(1)';
            } else {
                cursorWrapper.style.transition = 'none';
            }
        };

        // 滚动处理
        const scrollHandler = () => {
            if (!activeTarget) return;
            const cursorX = parseFloat(cursorWrapper.style.left) || 0;
            const cursorY = parseFloat(cursorWrapper.style.top) || 0;
            const elementUnderMouse = document.elementFromPoint(cursorX, cursorY);
            const isStillOverTarget = elementUnderMouse &&
                (elementUnderMouse === activeTarget || elementUnderMouse.closest(targetSelector) === activeTarget);
            if (!isStillOverTarget && currentLeaveHandler) {
                currentLeaveHandler();
            }
        };

        // 初始化位置
        cursorWrapper.style.left = `${window.innerWidth / 2}px`;
        cursorWrapper.style.top = `${window.innerHeight / 2}px`;

        // 事件监听
        window.addEventListener('mousemove', handleMouseMove);
        // 使用mouseover事件，监听所有元素
        document.addEventListener('mouseover', enterHandler, { passive: true });
        window.addEventListener('scroll', scrollHandler, { passive: true });
        window.addEventListener('mousedown', mouseDownHandler);
        window.addEventListener('mouseup', mouseUpHandler);

        // 添加调试日志
        console.log('目标光标特效已初始化，目标选择器:', targetSelector);
        console.log('测试：请确保页面中有带有 .cursor-target 类的元素');

        console.log('目标光标特效初始化完成');
    }

    // 设置菜单
    function setupMenu() {
        GM_registerMenuCommand('🤓设置鼠标效果', createConfigModal);
    }

    // 主函数
    function main() {
        initializeConfig();
        setupMenu();
        applyCursorStyles();
        applyTextEffect();
        applyCursorEffect();
    }

    // 启动脚本
    if (window.top === window.self) {
        main();
    }
})();