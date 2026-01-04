// ==UserScript==
// @name            MHXX Sim Colorizer
// @namespace       https://github.com/hotarunx
// @homepage        https://github.com/hotarunx/mhxx-sim-colorizer
// @supportURL      https://github.com/hotarunx/mhxx-sim-colorizer/issues
// @version         0.0.1
// @description     クリックするとMHXX スキルシミュ(泣)の私がつけたいスキルを色付けするようにします
// @author          hotarunx
// @match           https://mhxx.wiki-db.com/sim/*
// @grant           none
// @license         MIT
//
// Copyright(c) 2020 hotarunx
// This software is released under the MIT License, see LICENSE or https://github.com/hotarunx/mhxx-sim-colorizer/blob/main/LICENSE.
//
// @downloadURL https://update.greasyfork.org/scripts/425857/MHXX%20Sim%20Colorizer.user.js
// @updateURL https://update.greasyfork.org/scripts/425857/MHXX%20Sim%20Colorizer.meta.js
// ==/UserScript==

function paint() {
    const elements = document.getElementsByTagName('*');

    const skillSetsColor = ["red", "blue", "purple"];
    const skillSets = [[
        "納刀術",
        "納刀",
        "斬れ味",
        "匠",
        "業物",
        "抜刀術【技】",
        "抜刀会心",
        "挑戦者の納刀",
        "集中",
        "溜め短縮",
    ], [
        "反動軽減",
        "反動",
        "超号数",
        "最大数生産",
        "通常弾・連射矢UP",
        "通常弾強化",
        "貫通弾・貫通矢UP",
        "貫通弾強化",
        "弾導強化",
        "射法",
        "特定射撃強化",
        "変則射撃",
    ], [
        "捕獲の見極め",
        "観察眼",
        "採取",
        "剥ぎ取り",
        "耳栓",
        "聴覚保護",
        "風圧",
        "耐震",
        "細菌",
        "攻撃力",
        "見切り",
        "達人",
        "弱点特効",
        "痛撃",
        "連撃の心得",
        "連撃",
        "超会心",
        "会心強化",
        "痛恨会心",
        "裏会心",
    ]];

    for (const elm of elements) {
        if (elm.children.length > 1) {
            continue;
        }
        if (elm.textContent.length > 32 || elm.tagName === "TR") {
            continue;
        }

        for (let i = 0; i < skillSets.length; i++) {
            const set = skillSets[i];
            let hasMatch = false;

            for (const skill of set) {
                if (elm.textContent.match(skill) != null) {
                    elm.style.color = skillSetsColor[i];
                    elm.style.fontWeight = "bold";
                    hasMatch = true;
                    break;
                }
                if (hasMatch) {
                    break;
                }
            }
        }
    }
}

(function () {
    document.querySelector("#ui > div > div > div:nth-child(1) > div:nth-child(3) > select").selectedIndex = 0;
    document.querySelector("#ui > div > div > div:nth-child(1) > div:nth-child(4) > select").selectedIndex = 0;

    window.onclick = paint;
    paint();
})();
