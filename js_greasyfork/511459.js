// ==UserScript==
// @name         Gooboo夜间狩猎寻找材料
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  夜间狩猎被变化的货币
// @author       BaiLee
// @match        *://*/gooboo/
// @match        *://gooboo.g8hh.com.cn/
// @match        *://gooboo.tkfm.online/
// @icon         https://tendsty.github.io/gooboo/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511459/Gooboo%E5%A4%9C%E9%97%B4%E7%8B%A9%E7%8C%8E%E5%AF%BB%E6%89%BE%E6%9D%90%E6%96%99.user.js
// @updateURL https://update.greasyfork.org/scripts/511459/Gooboo%E5%A4%9C%E9%97%B4%E7%8B%A9%E7%8C%8E%E5%AF%BB%E6%89%BE%E6%9D%90%E6%96%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const features = {
        mining: '采矿',
        village: '村庄',
        horde: '部落',
        farm: '农场',
        gallery: '画廊',
        school: '学校',
        gem: '宝石',
        treasure: '宝藏',
    };
    const currencies = {
        resin: '树脂',
        smoke: '烟雾',
        bone: '骨头',
        towerKey: '钥匙',
        coin: '金币',
        water: '水',
        oil: '油',
        meat: '肉',
        offering: '供品',
        vegetable: '蔬菜',
        fruit: '水果',
        berry: '浆果',
        grain: '粮食',
        bug: '虫子',
        beauty: '美丽',
        amethyst: '紫水晶',
        goldenDust: '金尘',
        examPass: '考试通行证',
        fragment: '片段',
    };
    const ingredients = {
        lavender: '薰衣草',
        mapleLeaf: '枫叶',
        fourLeafClover: '四叶草',
        charredSkull: '烧焦的头骨',
        mysticalWater: '神秘的水',
        cheese: '奶酪',
        spiderWeb: '蜘蛛网',
        strangeEgg: '奇怪的蛋',
        puzzlePiece: '一块拼图',
        wizardHat: '巫师帽',
        cactus: '仙人掌',
        feather: '羽毛',
    };

    let huntBtn = document.createElement("button");
    huntBtn.innerHTML = '<i class="v-icon mx-2 mdi mdi-weather-night"></i>';
    huntBtn.classList = 'mx-2 v-btn v-btn--is-elevated v-btn--icon v-size--default';
    huntBtn.addEventListener("click", function () {
        const list = document.getElementsByClassName("primary")[0].__vue__.$store.state.nightHunt.changedCurrency;
        const readList = [];
        for(const i in list) {
            const [feature, name] = i.split('_');
            readList.push(`${features[feature]||feature} : ${currencies[name]||name} : ${ingredients[list[i]]||list[i]}`);
        }
        alert(readList.join('\n'));
    });
    const spacer = document.querySelector('.spacer');
    const parent = spacer.parentNode;
    parent.insertBefore(huntBtn, spacer);
})();