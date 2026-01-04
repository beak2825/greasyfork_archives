// ==UserScript==
// @name         MWI Order Helper
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  OrderCalc,OrderSort
// @author       shykai
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513653/MWI%20Order%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/513653/MWI%20Order%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function unformatNumberWithUnit(str) {
        // 保留数字、小数点以及单位字母
        str = str.replace(/[^0-9.kmbt]/gi, '');

        const someLetters = ["k", "m", "b", "t"];

        // 提取数值部分（包含小数点）
        var value = Number(str.replace(/[^0-9.]/gi, ''));

        // 提取单位部分
        var unit = str.replace(/[0-9.]/g, '').toLowerCase();
        if (unit.length > 0) {
            const zMultiplier = someLetters.findIndex(x => x == unit) + 1;
            value = value * 1000 ** zMultiplier;
        }

        return value;
    }

    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);

            let button = document.querySelector("#AODump");
            button.style.backgroundColor = 'green'
            //alert("Copied to clipboard!");
        } catch (err) {
            console.error("Failed to copy: ", err);
        }
    }

    function dumpAOPrice() {
        var marketList = document.querySelector(".MarketplacePanel_marketListings__1GCyQ");
        var aoList = marketList.querySelectorAll(".MarketplacePanel_orderBookTableContainer__hUu-X")[0];
        var rows = aoList.querySelectorAll("table tbody tr");

        let priceList = new Map();

        rows.forEach(function (row) {
            var cells = row.querySelectorAll('td');
            var count = unformatNumberWithUnit(cells[0].innerText);
            var price = unformatNumberWithUnit(cells[1].innerText);
            if (priceList.has(price)) {
                priceList.set(price, priceList.get(price) + count);
            } else {
                priceList.set(price, count);
            }
        });

        var pasteStr = Array.from(priceList, ([key, value]) => `${value}\t${key}`).join('\n');

        copyToClipboard(pasteStr);
    }

    function addButton() {
        const targetNode = document.querySelector("div.MarketplacePanel_marketNavButtonContainer__2QI9I");
        if (targetNode) {
            let newButton = targetNode.querySelector("#AODump");
            if (!newButton) {
                newButton = document.createElement("button");
                newButton.setAttribute("class", "Button_button__1Fe9z");
                newButton.id = "AODump";
                newButton.innerHTML = "AODump";
                newButton.addEventListener("click", function (evt) {
                    dumpAOPrice();
                });
                targetNode.appendChild(newButton);
            }
        }
    }

    function convertToScientificNotation(input) {
        // 定义单位和对应的指数
        const units = { 'K': 3, 'M': 6, 'B': 9, 'T': 12 };

        // 检查是否有单位
        const unit = input.slice(-1).toUpperCase();
        let valuePart = input;
        let exponent = 0;

        if (units.hasOwnProperty(unit)) {
            // 有单位的情况
            valuePart = input.slice(0, -1);
            exponent = units[unit];
        } else {
            // 没有单位的情况
            valuePart = input;
        }

        const value = parseFloat(valuePart);

        // 将数值转换为科学计数法
        const scientificNotation = value.toExponential();

        // 分解指数部分和系数部分
        const [base, exp] = scientificNotation.split('e');

        // 计算最终的指数
        const finalExponent = parseInt(exp) + exponent;

        // 格式化输出
        const formattedBase = parseFloat(base).toFixed(4).padStart(5, '0');
        return `10^${finalExponent}*${formattedBase}`;
    }

    const itemDetails = {
        "/items/poke": {
            "categoryHrid": 6,
            "sortIndex": 136
        },
        "/items/impale": {
            "categoryHrid": 6,
            "sortIndex": 137
        },
        "/items/puncture": {
            "categoryHrid": 6,
            "sortIndex": 138
        },
        "/items/penetrating_strike": {
            "categoryHrid": 6,
            "sortIndex": 139
        },
        "/items/scratch": {
            "categoryHrid": 6,
            "sortIndex": 140
        },
        "/items/cleave": {
            "categoryHrid": 6,
            "sortIndex": 141
        },
        "/items/maim": {
            "categoryHrid": 6,
            "sortIndex": 142
        },
        "/items/crippling_slash": {
            "categoryHrid": 6,
            "sortIndex": 143
        },
        "/items/smack": {
            "categoryHrid": 6,
            "sortIndex": 144
        },
        "/items/sweep": {
            "categoryHrid": 6,
            "sortIndex": 145
        },
        "/items/stunning_blow": {
            "categoryHrid": 6,
            "sortIndex": 146
        },
        "/items/fracturing_impact": {
            "categoryHrid": 6,
            "sortIndex": 147
        },
        "/items/shield_bash": {
            "categoryHrid": 6,
            "sortIndex": 148
        },
        "/items/quick_shot": {
            "categoryHrid": 6,
            "sortIndex": 149
        },
        "/items/aqua_arrow": {
            "categoryHrid": 6,
            "sortIndex": 150
        },
        "/items/flame_arrow": {
            "categoryHrid": 6,
            "sortIndex": 151
        },
        "/items/rain_of_arrows": {
            "categoryHrid": 6,
            "sortIndex": 152
        },
        "/items/silencing_shot": {
            "categoryHrid": 6,
            "sortIndex": 153
        },
        "/items/steady_shot": {
            "categoryHrid": 6,
            "sortIndex": 154
        },
        "/items/pestilent_shot": {
            "categoryHrid": 6,
            "sortIndex": 155
        },
        "/items/penetrating_shot": {
            "categoryHrid": 6,
            "sortIndex": 156
        },
        "/items/water_strike": {
            "categoryHrid": 6,
            "sortIndex": 157
        },
        "/items/ice_spear": {
            "categoryHrid": 6,
            "sortIndex": 158
        },
        "/items/frost_surge": {
            "categoryHrid": 6,
            "sortIndex": 159
        },
        "/items/mana_spring": {
            "categoryHrid": 6,
            "sortIndex": 160
        },
        "/items/entangle": {
            "categoryHrid": 6,
            "sortIndex": 161
        },
        "/items/toxic_pollen": {
            "categoryHrid": 6,
            "sortIndex": 162
        },
        "/items/natures_veil": {
            "categoryHrid": 6,
            "sortIndex": 163
        },
        "/items/life_drain": {
            "categoryHrid": 6,
            "sortIndex": 164
        },
        "/items/fireball": {
            "categoryHrid": 6,
            "sortIndex": 165
        },
        "/items/flame_blast": {
            "categoryHrid": 6,
            "sortIndex": 166
        },
        "/items/firestorm": {
            "categoryHrid": 6,
            "sortIndex": 167
        },
        "/items/smoke_burst": {
            "categoryHrid": 6,
            "sortIndex": 168
        },
        "/items/minor_heal": {
            "categoryHrid": 6,
            "sortIndex": 169
        },
        "/items/heal": {
            "categoryHrid": 6,
            "sortIndex": 170
        },
        "/items/quick_aid": {
            "categoryHrid": 6,
            "sortIndex": 171
        },
        "/items/rejuvenate": {
            "categoryHrid": 6,
            "sortIndex": 172
        },
        "/items/taunt": {
            "categoryHrid": 6,
            "sortIndex": 173
        },
        "/items/provoke": {
            "categoryHrid": 6,
            "sortIndex": 174
        },
        "/items/toughness": {
            "categoryHrid": 6,
            "sortIndex": 175
        },
        "/items/elusiveness": {
            "categoryHrid": 6,
            "sortIndex": 176
        },
        "/items/precision": {
            "categoryHrid": 6,
            "sortIndex": 177
        },
        "/items/berserk": {
            "categoryHrid": 6,
            "sortIndex": 178
        },
        "/items/elemental_affinity": {
            "categoryHrid": 6,
            "sortIndex": 179
        },
        "/items/frenzy": {
            "categoryHrid": 6,
            "sortIndex": 180
        },
        "/items/spike_shell": {
            "categoryHrid": 6,
            "sortIndex": 181
        },
        "/items/retribution": {
            "categoryHrid": 6,
            "sortIndex": 182
        },
        "/items/vampirism": {
            "categoryHrid": 6,
            "sortIndex": 183
        },
        "/items/revive": {
            "categoryHrid": 6,
            "sortIndex": 184
        },
        "/items/insanity": {
            "categoryHrid": 6,
            "sortIndex": 185
        },
        "/items/invincible": {
            "categoryHrid": 6,
            "sortIndex": 186
        },
        "/items/speed_aura": {
            "categoryHrid": 6,
            "sortIndex": 187
        },
        "/items/guardian_aura": {
            "categoryHrid": 6,
            "sortIndex": 188
        },
        "/items/fierce_aura": {
            "categoryHrid": 6,
            "sortIndex": 189
        },
        "/items/critical_aura": {
            "categoryHrid": 6,
            "sortIndex": 190
        },
        "/items/mystic_aura": {
            "categoryHrid": 6,
            "sortIndex": 191
        },
        "/items/coin": {
            "categoryHrid": 1,
            "sortIndex": 1
        },
        "/items/task_token": {
            "categoryHrid": 1,
            "sortIndex": 2
        },
        "/items/chimerical_token": {
            "categoryHrid": 1,
            "sortIndex": 3
        },
        "/items/sinister_token": {
            "categoryHrid": 1,
            "sortIndex": 4
        },
        "/items/enchanted_token": {
            "categoryHrid": 1,
            "sortIndex": 5
        },
        "/items/pirate_token": {
            "categoryHrid": 1,
            "sortIndex": 6
        },
        "/items/cowbell": {
            "categoryHrid": 1,
            "sortIndex": 7
        },
        "/items/milking_tea": {
            "categoryHrid": 5,
            "sortIndex": 72
        },
        "/items/foraging_tea": {
            "categoryHrid": 5,
            "sortIndex": 73
        },
        "/items/woodcutting_tea": {
            "categoryHrid": 5,
            "sortIndex": 74
        },
        "/items/cooking_tea": {
            "categoryHrid": 5,
            "sortIndex": 75
        },
        "/items/brewing_tea": {
            "categoryHrid": 5,
            "sortIndex": 76
        },
        "/items/alchemy_tea": {
            "categoryHrid": 5,
            "sortIndex": 77
        },
        "/items/enhancing_tea": {
            "categoryHrid": 5,
            "sortIndex": 78
        },
        "/items/cheesesmithing_tea": {
            "categoryHrid": 5,
            "sortIndex": 79
        },
        "/items/crafting_tea": {
            "categoryHrid": 5,
            "sortIndex": 80
        },
        "/items/tailoring_tea": {
            "categoryHrid": 5,
            "sortIndex": 81
        },
        "/items/super_milking_tea": {
            "categoryHrid": 5,
            "sortIndex": 82
        },
        "/items/super_foraging_tea": {
            "categoryHrid": 5,
            "sortIndex": 83
        },
        "/items/super_woodcutting_tea": {
            "categoryHrid": 5,
            "sortIndex": 84
        },
        "/items/super_cooking_tea": {
            "categoryHrid": 5,
            "sortIndex": 85
        },
        "/items/super_brewing_tea": {
            "categoryHrid": 5,
            "sortIndex": 86
        },
        "/items/super_alchemy_tea": {
            "categoryHrid": 5,
            "sortIndex": 87
        },
        "/items/super_enhancing_tea": {
            "categoryHrid": 5,
            "sortIndex": 88
        },
        "/items/super_cheesesmithing_tea": {
            "categoryHrid": 5,
            "sortIndex": 89
        },
        "/items/super_crafting_tea": {
            "categoryHrid": 5,
            "sortIndex": 90
        },
        "/items/super_tailoring_tea": {
            "categoryHrid": 5,
            "sortIndex": 91
        },
        "/items/ultra_milking_tea": {
            "categoryHrid": 5,
            "sortIndex": 92
        },
        "/items/ultra_foraging_tea": {
            "categoryHrid": 5,
            "sortIndex": 93
        },
        "/items/ultra_woodcutting_tea": {
            "categoryHrid": 5,
            "sortIndex": 94
        },
        "/items/ultra_cooking_tea": {
            "categoryHrid": 5,
            "sortIndex": 95
        },
        "/items/ultra_brewing_tea": {
            "categoryHrid": 5,
            "sortIndex": 96
        },
        "/items/ultra_alchemy_tea": {
            "categoryHrid": 5,
            "sortIndex": 97
        },
        "/items/ultra_enhancing_tea": {
            "categoryHrid": 5,
            "sortIndex": 98
        },
        "/items/ultra_cheesesmithing_tea": {
            "categoryHrid": 5,
            "sortIndex": 99
        },
        "/items/ultra_crafting_tea": {
            "categoryHrid": 5,
            "sortIndex": 100
        },
        "/items/ultra_tailoring_tea": {
            "categoryHrid": 5,
            "sortIndex": 101
        },
        "/items/gathering_tea": {
            "categoryHrid": 5,
            "sortIndex": 102
        },
        "/items/gourmet_tea": {
            "categoryHrid": 5,
            "sortIndex": 103
        },
        "/items/wisdom_tea": {
            "categoryHrid": 5,
            "sortIndex": 104
        },
        "/items/processing_tea": {
            "categoryHrid": 5,
            "sortIndex": 105
        },
        "/items/efficiency_tea": {
            "categoryHrid": 5,
            "sortIndex": 106
        },
        "/items/artisan_tea": {
            "categoryHrid": 5,
            "sortIndex": 107
        },
        "/items/catalytic_tea": {
            "categoryHrid": 5,
            "sortIndex": 108
        },
        "/items/blessed_tea": {
            "categoryHrid": 5,
            "sortIndex": 109
        },
        "/items/stamina_coffee": {
            "categoryHrid": 5,
            "sortIndex": 110
        },
        "/items/intelligence_coffee": {
            "categoryHrid": 5,
            "sortIndex": 111
        },
        "/items/defense_coffee": {
            "categoryHrid": 5,
            "sortIndex": 112
        },
        "/items/attack_coffee": {
            "categoryHrid": 5,
            "sortIndex": 113
        },
        "/items/melee_coffee": {
            "categoryHrid": 5,
            "sortIndex": 114
        },
        "/items/ranged_coffee": {
            "categoryHrid": 5,
            "sortIndex": 115
        },
        "/items/magic_coffee": {
            "categoryHrid": 5,
            "sortIndex": 116
        },
        "/items/super_stamina_coffee": {
            "categoryHrid": 5,
            "sortIndex": 117
        },
        "/items/super_intelligence_coffee": {
            "categoryHrid": 5,
            "sortIndex": 118
        },
        "/items/super_defense_coffee": {
            "categoryHrid": 5,
            "sortIndex": 119
        },
        "/items/super_attack_coffee": {
            "categoryHrid": 5,
            "sortIndex": 120
        },
        "/items/super_melee_coffee": {
            "categoryHrid": 5,
            "sortIndex": 121
        },
        "/items/super_ranged_coffee": {
            "categoryHrid": 5,
            "sortIndex": 122
        },
        "/items/super_magic_coffee": {
            "categoryHrid": 5,
            "sortIndex": 123
        },
        "/items/ultra_stamina_coffee": {
            "categoryHrid": 5,
            "sortIndex": 124
        },
        "/items/ultra_intelligence_coffee": {
            "categoryHrid": 5,
            "sortIndex": 125
        },
        "/items/ultra_defense_coffee": {
            "categoryHrid": 5,
            "sortIndex": 126
        },
        "/items/ultra_attack_coffee": {
            "categoryHrid": 5,
            "sortIndex": 127
        },
        "/items/ultra_melee_coffee": {
            "categoryHrid": 5,
            "sortIndex": 128
        },
        "/items/ultra_ranged_coffee": {
            "categoryHrid": 5,
            "sortIndex": 129
        },
        "/items/ultra_magic_coffee": {
            "categoryHrid": 5,
            "sortIndex": 130
        },
        "/items/wisdom_coffee": {
            "categoryHrid": 5,
            "sortIndex": 131
        },
        "/items/lucky_coffee": {
            "categoryHrid": 5,
            "sortIndex": 132
        },
        "/items/swiftness_coffee": {
            "categoryHrid": 5,
            "sortIndex": 133
        },
        "/items/channeling_coffee": {
            "categoryHrid": 5,
            "sortIndex": 134
        },
        "/items/critical_coffee": {
            "categoryHrid": 5,
            "sortIndex": 135
        },
        "/items/gobo_stabber": {
            "categoryHrid": 7,
            "sortIndex": 192
        },
        "/items/gobo_slasher": {
            "categoryHrid": 7,
            "sortIndex": 193
        },
        "/items/gobo_smasher": {
            "categoryHrid": 7,
            "sortIndex": 194
        },
        "/items/spiked_bulwark": {
            "categoryHrid": 7,
            "sortIndex": 195
        },
        "/items/werewolf_slasher": {
            "categoryHrid": 7,
            "sortIndex": 196
        },
        "/items/griffin_bulwark": {
            "categoryHrid": 7,
            "sortIndex": 197
        },
        "/items/griffin_bulwark_refined": {
            "categoryHrid": 7,
            "sortIndex": 198
        },
        "/items/gobo_shooter": {
            "categoryHrid": 7,
            "sortIndex": 199
        },
        "/items/vampiric_bow": {
            "categoryHrid": 7,
            "sortIndex": 200
        },
        "/items/cursed_bow": {
            "categoryHrid": 7,
            "sortIndex": 201
        },
        "/items/cursed_bow_refined": {
            "categoryHrid": 7,
            "sortIndex": 202
        },
        "/items/gobo_boomstick": {
            "categoryHrid": 7,
            "sortIndex": 203
        },
        "/items/cheese_bulwark": {
            "categoryHrid": 7,
            "sortIndex": 204
        },
        "/items/verdant_bulwark": {
            "categoryHrid": 7,
            "sortIndex": 205
        },
        "/items/azure_bulwark": {
            "categoryHrid": 7,
            "sortIndex": 206
        },
        "/items/burble_bulwark": {
            "categoryHrid": 7,
            "sortIndex": 207
        },
        "/items/crimson_bulwark": {
            "categoryHrid": 7,
            "sortIndex": 208
        },
        "/items/rainbow_bulwark": {
            "categoryHrid": 7,
            "sortIndex": 209
        },
        "/items/holy_bulwark": {
            "categoryHrid": 7,
            "sortIndex": 210
        },
        "/items/wooden_bow": {
            "categoryHrid": 7,
            "sortIndex": 211
        },
        "/items/birch_bow": {
            "categoryHrid": 7,
            "sortIndex": 212
        },
        "/items/cedar_bow": {
            "categoryHrid": 7,
            "sortIndex": 213
        },
        "/items/purpleheart_bow": {
            "categoryHrid": 7,
            "sortIndex": 214
        },
        "/items/ginkgo_bow": {
            "categoryHrid": 7,
            "sortIndex": 215
        },
        "/items/redwood_bow": {
            "categoryHrid": 7,
            "sortIndex": 216
        },
        "/items/arcane_bow": {
            "categoryHrid": 7,
            "sortIndex": 217
        },
        "/items/stalactite_spear": {
            "categoryHrid": 7,
            "sortIndex": 218
        },
        "/items/granite_bludgeon": {
            "categoryHrid": 7,
            "sortIndex": 219
        },
        "/items/furious_spear": {
            "categoryHrid": 7,
            "sortIndex": 220
        },
        "/items/furious_spear_refined": {
            "categoryHrid": 7,
            "sortIndex": 221
        },
        "/items/regal_sword": {
            "categoryHrid": 7,
            "sortIndex": 222
        },
        "/items/regal_sword_refined": {
            "categoryHrid": 7,
            "sortIndex": 223
        },
        "/items/chaotic_flail": {
            "categoryHrid": 7,
            "sortIndex": 224
        },
        "/items/chaotic_flail_refined": {
            "categoryHrid": 7,
            "sortIndex": 225
        },
        "/items/soul_hunter_crossbow": {
            "categoryHrid": 7,
            "sortIndex": 226
        },
        "/items/sundering_crossbow": {
            "categoryHrid": 7,
            "sortIndex": 227
        },
        "/items/sundering_crossbow_refined": {
            "categoryHrid": 7,
            "sortIndex": 228
        },
        "/items/frost_staff": {
            "categoryHrid": 7,
            "sortIndex": 229
        },
        "/items/infernal_battlestaff": {
            "categoryHrid": 7,
            "sortIndex": 230
        },
        "/items/jackalope_staff": {
            "categoryHrid": 7,
            "sortIndex": 231
        },
        "/items/rippling_trident": {
            "categoryHrid": 7,
            "sortIndex": 232
        },
        "/items/rippling_trident_refined": {
            "categoryHrid": 7,
            "sortIndex": 233
        },
        "/items/blooming_trident": {
            "categoryHrid": 7,
            "sortIndex": 234
        },
        "/items/blooming_trident_refined": {
            "categoryHrid": 7,
            "sortIndex": 235
        },
        "/items/blazing_trident": {
            "categoryHrid": 7,
            "sortIndex": 236
        },
        "/items/blazing_trident_refined": {
            "categoryHrid": 7,
            "sortIndex": 237
        },
        "/items/cheese_sword": {
            "categoryHrid": 7,
            "sortIndex": 238
        },
        "/items/verdant_sword": {
            "categoryHrid": 7,
            "sortIndex": 239
        },
        "/items/azure_sword": {
            "categoryHrid": 7,
            "sortIndex": 240
        },
        "/items/burble_sword": {
            "categoryHrid": 7,
            "sortIndex": 241
        },
        "/items/crimson_sword": {
            "categoryHrid": 7,
            "sortIndex": 242
        },
        "/items/rainbow_sword": {
            "categoryHrid": 7,
            "sortIndex": 243
        },
        "/items/holy_sword": {
            "categoryHrid": 7,
            "sortIndex": 244
        },
        "/items/cheese_spear": {
            "categoryHrid": 7,
            "sortIndex": 245
        },
        "/items/verdant_spear": {
            "categoryHrid": 7,
            "sortIndex": 246
        },
        "/items/azure_spear": {
            "categoryHrid": 7,
            "sortIndex": 247
        },
        "/items/burble_spear": {
            "categoryHrid": 7,
            "sortIndex": 248
        },
        "/items/crimson_spear": {
            "categoryHrid": 7,
            "sortIndex": 249
        },
        "/items/rainbow_spear": {
            "categoryHrid": 7,
            "sortIndex": 250
        },
        "/items/holy_spear": {
            "categoryHrid": 7,
            "sortIndex": 251
        },
        "/items/cheese_mace": {
            "categoryHrid": 7,
            "sortIndex": 252
        },
        "/items/verdant_mace": {
            "categoryHrid": 7,
            "sortIndex": 253
        },
        "/items/azure_mace": {
            "categoryHrid": 7,
            "sortIndex": 254
        },
        "/items/burble_mace": {
            "categoryHrid": 7,
            "sortIndex": 255
        },
        "/items/crimson_mace": {
            "categoryHrid": 7,
            "sortIndex": 256
        },
        "/items/rainbow_mace": {
            "categoryHrid": 7,
            "sortIndex": 257
        },
        "/items/holy_mace": {
            "categoryHrid": 7,
            "sortIndex": 258
        },
        "/items/wooden_crossbow": {
            "categoryHrid": 7,
            "sortIndex": 259
        },
        "/items/birch_crossbow": {
            "categoryHrid": 7,
            "sortIndex": 260
        },
        "/items/cedar_crossbow": {
            "categoryHrid": 7,
            "sortIndex": 261
        },
        "/items/purpleheart_crossbow": {
            "categoryHrid": 7,
            "sortIndex": 262
        },
        "/items/ginkgo_crossbow": {
            "categoryHrid": 7,
            "sortIndex": 263
        },
        "/items/redwood_crossbow": {
            "categoryHrid": 7,
            "sortIndex": 264
        },
        "/items/arcane_crossbow": {
            "categoryHrid": 7,
            "sortIndex": 265
        },
        "/items/wooden_water_staff": {
            "categoryHrid": 7,
            "sortIndex": 266
        },
        "/items/birch_water_staff": {
            "categoryHrid": 7,
            "sortIndex": 267
        },
        "/items/cedar_water_staff": {
            "categoryHrid": 7,
            "sortIndex": 268
        },
        "/items/purpleheart_water_staff": {
            "categoryHrid": 7,
            "sortIndex": 269
        },
        "/items/ginkgo_water_staff": {
            "categoryHrid": 7,
            "sortIndex": 270
        },
        "/items/redwood_water_staff": {
            "categoryHrid": 7,
            "sortIndex": 271
        },
        "/items/arcane_water_staff": {
            "categoryHrid": 7,
            "sortIndex": 272
        },
        "/items/wooden_nature_staff": {
            "categoryHrid": 7,
            "sortIndex": 273
        },
        "/items/birch_nature_staff": {
            "categoryHrid": 7,
            "sortIndex": 274
        },
        "/items/cedar_nature_staff": {
            "categoryHrid": 7,
            "sortIndex": 275
        },
        "/items/purpleheart_nature_staff": {
            "categoryHrid": 7,
            "sortIndex": 276
        },
        "/items/ginkgo_nature_staff": {
            "categoryHrid": 7,
            "sortIndex": 277
        },
        "/items/redwood_nature_staff": {
            "categoryHrid": 7,
            "sortIndex": 278
        },
        "/items/arcane_nature_staff": {
            "categoryHrid": 7,
            "sortIndex": 279
        },
        "/items/wooden_fire_staff": {
            "categoryHrid": 7,
            "sortIndex": 280
        },
        "/items/birch_fire_staff": {
            "categoryHrid": 7,
            "sortIndex": 281
        },
        "/items/cedar_fire_staff": {
            "categoryHrid": 7,
            "sortIndex": 282
        },
        "/items/purpleheart_fire_staff": {
            "categoryHrid": 7,
            "sortIndex": 283
        },
        "/items/ginkgo_fire_staff": {
            "categoryHrid": 7,
            "sortIndex": 284
        },
        "/items/redwood_fire_staff": {
            "categoryHrid": 7,
            "sortIndex": 285
        },
        "/items/arcane_fire_staff": {
            "categoryHrid": 7,
            "sortIndex": 286
        },
        "/items/eye_watch": {
            "categoryHrid": 7,
            "sortIndex": 287
        },
        "/items/snake_fang_dirk": {
            "categoryHrid": 7,
            "sortIndex": 288
        },
        "/items/vision_shield": {
            "categoryHrid": 7,
            "sortIndex": 289
        },
        "/items/gobo_defender": {
            "categoryHrid": 7,
            "sortIndex": 290
        },
        "/items/vampire_fang_dirk": {
            "categoryHrid": 7,
            "sortIndex": 291
        },
        "/items/knights_aegis": {
            "categoryHrid": 7,
            "sortIndex": 292
        },
        "/items/knights_aegis_refined": {
            "categoryHrid": 7,
            "sortIndex": 293
        },
        "/items/treant_shield": {
            "categoryHrid": 7,
            "sortIndex": 294
        },
        "/items/manticore_shield": {
            "categoryHrid": 7,
            "sortIndex": 295
        },
        "/items/tome_of_healing": {
            "categoryHrid": 7,
            "sortIndex": 296
        },
        "/items/tome_of_the_elements": {
            "categoryHrid": 7,
            "sortIndex": 297
        },
        "/items/watchful_relic": {
            "categoryHrid": 7,
            "sortIndex": 298
        },
        "/items/bishops_codex": {
            "categoryHrid": 7,
            "sortIndex": 299
        },
        "/items/bishops_codex_refined": {
            "categoryHrid": 7,
            "sortIndex": 300
        },
        "/items/cheese_buckler": {
            "categoryHrid": 7,
            "sortIndex": 301
        },
        "/items/verdant_buckler": {
            "categoryHrid": 7,
            "sortIndex": 302
        },
        "/items/azure_buckler": {
            "categoryHrid": 7,
            "sortIndex": 303
        },
        "/items/burble_buckler": {
            "categoryHrid": 7,
            "sortIndex": 304
        },
        "/items/crimson_buckler": {
            "categoryHrid": 7,
            "sortIndex": 305
        },
        "/items/rainbow_buckler": {
            "categoryHrid": 7,
            "sortIndex": 306
        },
        "/items/holy_buckler": {
            "categoryHrid": 7,
            "sortIndex": 307
        },
        "/items/wooden_shield": {
            "categoryHrid": 7,
            "sortIndex": 308
        },
        "/items/birch_shield": {
            "categoryHrid": 7,
            "sortIndex": 309
        },
        "/items/cedar_shield": {
            "categoryHrid": 7,
            "sortIndex": 310
        },
        "/items/purpleheart_shield": {
            "categoryHrid": 7,
            "sortIndex": 311
        },
        "/items/ginkgo_shield": {
            "categoryHrid": 7,
            "sortIndex": 312
        },
        "/items/redwood_shield": {
            "categoryHrid": 7,
            "sortIndex": 313
        },
        "/items/arcane_shield": {
            "categoryHrid": 7,
            "sortIndex": 314
        },
        "/items/sinister_cape": {
            "categoryHrid": 7,
            "sortIndex": 315
        },
        "/items/sinister_cape_refined": {
            "categoryHrid": 7,
            "sortIndex": 316
        },
        "/items/chimerical_quiver": {
            "categoryHrid": 7,
            "sortIndex": 317
        },
        "/items/chimerical_quiver_refined": {
            "categoryHrid": 7,
            "sortIndex": 318
        },
        "/items/enchanted_cloak": {
            "categoryHrid": 7,
            "sortIndex": 319
        },
        "/items/enchanted_cloak_refined": {
            "categoryHrid": 7,
            "sortIndex": 320
        },
        "/items/red_culinary_hat": {
            "categoryHrid": 7,
            "sortIndex": 321
        },
        "/items/snail_shell_helmet": {
            "categoryHrid": 7,
            "sortIndex": 322
        },
        "/items/vision_helmet": {
            "categoryHrid": 7,
            "sortIndex": 323
        },
        "/items/fluffy_red_hat": {
            "categoryHrid": 7,
            "sortIndex": 324
        },
        "/items/corsair_helmet": {
            "categoryHrid": 7,
            "sortIndex": 325
        },
        "/items/corsair_helmet_refined": {
            "categoryHrid": 7,
            "sortIndex": 326
        },
        "/items/acrobatic_hood": {
            "categoryHrid": 7,
            "sortIndex": 327
        },
        "/items/acrobatic_hood_refined": {
            "categoryHrid": 7,
            "sortIndex": 328
        },
        "/items/magicians_hat": {
            "categoryHrid": 7,
            "sortIndex": 329
        },
        "/items/magicians_hat_refined": {
            "categoryHrid": 7,
            "sortIndex": 330
        },
        "/items/cheese_helmet": {
            "categoryHrid": 7,
            "sortIndex": 331
        },
        "/items/verdant_helmet": {
            "categoryHrid": 7,
            "sortIndex": 332
        },
        "/items/azure_helmet": {
            "categoryHrid": 7,
            "sortIndex": 333
        },
        "/items/burble_helmet": {
            "categoryHrid": 7,
            "sortIndex": 334
        },
        "/items/crimson_helmet": {
            "categoryHrid": 7,
            "sortIndex": 335
        },
        "/items/rainbow_helmet": {
            "categoryHrid": 7,
            "sortIndex": 336
        },
        "/items/holy_helmet": {
            "categoryHrid": 7,
            "sortIndex": 337
        },
        "/items/rough_hood": {
            "categoryHrid": 7,
            "sortIndex": 338
        },
        "/items/reptile_hood": {
            "categoryHrid": 7,
            "sortIndex": 339
        },
        "/items/gobo_hood": {
            "categoryHrid": 7,
            "sortIndex": 340
        },
        "/items/beast_hood": {
            "categoryHrid": 7,
            "sortIndex": 341
        },
        "/items/umbral_hood": {
            "categoryHrid": 7,
            "sortIndex": 342
        },
        "/items/cotton_hat": {
            "categoryHrid": 7,
            "sortIndex": 343
        },
        "/items/linen_hat": {
            "categoryHrid": 7,
            "sortIndex": 344
        },
        "/items/bamboo_hat": {
            "categoryHrid": 7,
            "sortIndex": 345
        },
        "/items/silk_hat": {
            "categoryHrid": 7,
            "sortIndex": 346
        },
        "/items/radiant_hat": {
            "categoryHrid": 7,
            "sortIndex": 347
        },
        "/items/dairyhands_top": {
            "categoryHrid": 7,
            "sortIndex": 348
        },
        "/items/foragers_top": {
            "categoryHrid": 7,
            "sortIndex": 349
        },
        "/items/lumberjacks_top": {
            "categoryHrid": 7,
            "sortIndex": 350
        },
        "/items/cheesemakers_top": {
            "categoryHrid": 7,
            "sortIndex": 351
        },
        "/items/crafters_top": {
            "categoryHrid": 7,
            "sortIndex": 352
        },
        "/items/tailors_top": {
            "categoryHrid": 7,
            "sortIndex": 353
        },
        "/items/chefs_top": {
            "categoryHrid": 7,
            "sortIndex": 354
        },
        "/items/brewers_top": {
            "categoryHrid": 7,
            "sortIndex": 355
        },
        "/items/alchemists_top": {
            "categoryHrid": 7,
            "sortIndex": 356
        },
        "/items/enhancers_top": {
            "categoryHrid": 7,
            "sortIndex": 357
        },
        "/items/gator_vest": {
            "categoryHrid": 7,
            "sortIndex": 358
        },
        "/items/turtle_shell_body": {
            "categoryHrid": 7,
            "sortIndex": 359
        },
        "/items/colossus_plate_body": {
            "categoryHrid": 7,
            "sortIndex": 360
        },
        "/items/demonic_plate_body": {
            "categoryHrid": 7,
            "sortIndex": 361
        },
        "/items/anchorbound_plate_body": {
            "categoryHrid": 7,
            "sortIndex": 362
        },
        "/items/anchorbound_plate_body_refined": {
            "categoryHrid": 7,
            "sortIndex": 363
        },
        "/items/maelstrom_plate_body": {
            "categoryHrid": 7,
            "sortIndex": 364
        },
        "/items/maelstrom_plate_body_refined": {
            "categoryHrid": 7,
            "sortIndex": 365
        },
        "/items/marine_tunic": {
            "categoryHrid": 7,
            "sortIndex": 366
        },
        "/items/revenant_tunic": {
            "categoryHrid": 7,
            "sortIndex": 367
        },
        "/items/griffin_tunic": {
            "categoryHrid": 7,
            "sortIndex": 368
        },
        "/items/kraken_tunic": {
            "categoryHrid": 7,
            "sortIndex": 369
        },
        "/items/kraken_tunic_refined": {
            "categoryHrid": 7,
            "sortIndex": 370
        },
        "/items/icy_robe_top": {
            "categoryHrid": 7,
            "sortIndex": 371
        },
        "/items/flaming_robe_top": {
            "categoryHrid": 7,
            "sortIndex": 372
        },
        "/items/luna_robe_top": {
            "categoryHrid": 7,
            "sortIndex": 373
        },
        "/items/royal_water_robe_top": {
            "categoryHrid": 7,
            "sortIndex": 374
        },
        "/items/royal_water_robe_top_refined": {
            "categoryHrid": 7,
            "sortIndex": 375
        },
        "/items/royal_nature_robe_top": {
            "categoryHrid": 7,
            "sortIndex": 376
        },
        "/items/royal_nature_robe_top_refined": {
            "categoryHrid": 7,
            "sortIndex": 377
        },
        "/items/royal_fire_robe_top": {
            "categoryHrid": 7,
            "sortIndex": 378
        },
        "/items/royal_fire_robe_top_refined": {
            "categoryHrid": 7,
            "sortIndex": 379
        },
        "/items/cheese_plate_body": {
            "categoryHrid": 7,
            "sortIndex": 380
        },
        "/items/verdant_plate_body": {
            "categoryHrid": 7,
            "sortIndex": 381
        },
        "/items/azure_plate_body": {
            "categoryHrid": 7,
            "sortIndex": 382
        },
        "/items/burble_plate_body": {
            "categoryHrid": 7,
            "sortIndex": 383
        },
        "/items/crimson_plate_body": {
            "categoryHrid": 7,
            "sortIndex": 384
        },
        "/items/rainbow_plate_body": {
            "categoryHrid": 7,
            "sortIndex": 385
        },
        "/items/holy_plate_body": {
            "categoryHrid": 7,
            "sortIndex": 386
        },
        "/items/rough_tunic": {
            "categoryHrid": 7,
            "sortIndex": 387
        },
        "/items/reptile_tunic": {
            "categoryHrid": 7,
            "sortIndex": 388
        },
        "/items/gobo_tunic": {
            "categoryHrid": 7,
            "sortIndex": 389
        },
        "/items/beast_tunic": {
            "categoryHrid": 7,
            "sortIndex": 390
        },
        "/items/umbral_tunic": {
            "categoryHrid": 7,
            "sortIndex": 391
        },
        "/items/cotton_robe_top": {
            "categoryHrid": 7,
            "sortIndex": 392
        },
        "/items/linen_robe_top": {
            "categoryHrid": 7,
            "sortIndex": 393
        },
        "/items/bamboo_robe_top": {
            "categoryHrid": 7,
            "sortIndex": 394
        },
        "/items/silk_robe_top": {
            "categoryHrid": 7,
            "sortIndex": 395
        },
        "/items/radiant_robe_top": {
            "categoryHrid": 7,
            "sortIndex": 396
        },
        "/items/dairyhands_bottoms": {
            "categoryHrid": 7,
            "sortIndex": 397
        },
        "/items/foragers_bottoms": {
            "categoryHrid": 7,
            "sortIndex": 398
        },
        "/items/lumberjacks_bottoms": {
            "categoryHrid": 7,
            "sortIndex": 399
        },
        "/items/cheesemakers_bottoms": {
            "categoryHrid": 7,
            "sortIndex": 400
        },
        "/items/crafters_bottoms": {
            "categoryHrid": 7,
            "sortIndex": 401
        },
        "/items/tailors_bottoms": {
            "categoryHrid": 7,
            "sortIndex": 402
        },
        "/items/chefs_bottoms": {
            "categoryHrid": 7,
            "sortIndex": 403
        },
        "/items/brewers_bottoms": {
            "categoryHrid": 7,
            "sortIndex": 404
        },
        "/items/alchemists_bottoms": {
            "categoryHrid": 7,
            "sortIndex": 405
        },
        "/items/enhancers_bottoms": {
            "categoryHrid": 7,
            "sortIndex": 406
        },
        "/items/turtle_shell_legs": {
            "categoryHrid": 7,
            "sortIndex": 407
        },
        "/items/colossus_plate_legs": {
            "categoryHrid": 7,
            "sortIndex": 408
        },
        "/items/demonic_plate_legs": {
            "categoryHrid": 7,
            "sortIndex": 409
        },
        "/items/anchorbound_plate_legs": {
            "categoryHrid": 7,
            "sortIndex": 410
        },
        "/items/anchorbound_plate_legs_refined": {
            "categoryHrid": 7,
            "sortIndex": 411
        },
        "/items/maelstrom_plate_legs": {
            "categoryHrid": 7,
            "sortIndex": 412
        },
        "/items/maelstrom_plate_legs_refined": {
            "categoryHrid": 7,
            "sortIndex": 413
        },
        "/items/marine_chaps": {
            "categoryHrid": 7,
            "sortIndex": 414
        },
        "/items/revenant_chaps": {
            "categoryHrid": 7,
            "sortIndex": 415
        },
        "/items/griffin_chaps": {
            "categoryHrid": 7,
            "sortIndex": 416
        },
        "/items/kraken_chaps": {
            "categoryHrid": 7,
            "sortIndex": 417
        },
        "/items/kraken_chaps_refined": {
            "categoryHrid": 7,
            "sortIndex": 418
        },
        "/items/icy_robe_bottoms": {
            "categoryHrid": 7,
            "sortIndex": 419
        },
        "/items/flaming_robe_bottoms": {
            "categoryHrid": 7,
            "sortIndex": 420
        },
        "/items/luna_robe_bottoms": {
            "categoryHrid": 7,
            "sortIndex": 421
        },
        "/items/royal_water_robe_bottoms": {
            "categoryHrid": 7,
            "sortIndex": 422
        },
        "/items/royal_water_robe_bottoms_refined": {
            "categoryHrid": 7,
            "sortIndex": 423
        },
        "/items/royal_nature_robe_bottoms": {
            "categoryHrid": 7,
            "sortIndex": 424
        },
        "/items/royal_nature_robe_bottoms_refined": {
            "categoryHrid": 7,
            "sortIndex": 425
        },
        "/items/royal_fire_robe_bottoms": {
            "categoryHrid": 7,
            "sortIndex": 426
        },
        "/items/royal_fire_robe_bottoms_refined": {
            "categoryHrid": 7,
            "sortIndex": 427
        },
        "/items/cheese_plate_legs": {
            "categoryHrid": 7,
            "sortIndex": 428
        },
        "/items/verdant_plate_legs": {
            "categoryHrid": 7,
            "sortIndex": 429
        },
        "/items/azure_plate_legs": {
            "categoryHrid": 7,
            "sortIndex": 430
        },
        "/items/burble_plate_legs": {
            "categoryHrid": 7,
            "sortIndex": 431
        },
        "/items/crimson_plate_legs": {
            "categoryHrid": 7,
            "sortIndex": 432
        },
        "/items/rainbow_plate_legs": {
            "categoryHrid": 7,
            "sortIndex": 433
        },
        "/items/holy_plate_legs": {
            "categoryHrid": 7,
            "sortIndex": 434
        },
        "/items/rough_chaps": {
            "categoryHrid": 7,
            "sortIndex": 435
        },
        "/items/reptile_chaps": {
            "categoryHrid": 7,
            "sortIndex": 436
        },
        "/items/gobo_chaps": {
            "categoryHrid": 7,
            "sortIndex": 437
        },
        "/items/beast_chaps": {
            "categoryHrid": 7,
            "sortIndex": 438
        },
        "/items/umbral_chaps": {
            "categoryHrid": 7,
            "sortIndex": 439
        },
        "/items/cotton_robe_bottoms": {
            "categoryHrid": 7,
            "sortIndex": 440
        },
        "/items/linen_robe_bottoms": {
            "categoryHrid": 7,
            "sortIndex": 441
        },
        "/items/bamboo_robe_bottoms": {
            "categoryHrid": 7,
            "sortIndex": 442
        },
        "/items/silk_robe_bottoms": {
            "categoryHrid": 7,
            "sortIndex": 443
        },
        "/items/radiant_robe_bottoms": {
            "categoryHrid": 7,
            "sortIndex": 444
        },
        "/items/enchanted_gloves": {
            "categoryHrid": 7,
            "sortIndex": 445
        },
        "/items/pincer_gloves": {
            "categoryHrid": 7,
            "sortIndex": 446
        },
        "/items/panda_gloves": {
            "categoryHrid": 7,
            "sortIndex": 447
        },
        "/items/magnetic_gloves": {
            "categoryHrid": 7,
            "sortIndex": 448
        },
        "/items/dodocamel_gauntlets": {
            "categoryHrid": 7,
            "sortIndex": 449
        },
        "/items/dodocamel_gauntlets_refined": {
            "categoryHrid": 7,
            "sortIndex": 450
        },
        "/items/sighted_bracers": {
            "categoryHrid": 7,
            "sortIndex": 451
        },
        "/items/marksman_bracers": {
            "categoryHrid": 7,
            "sortIndex": 452
        },
        "/items/marksman_bracers_refined": {
            "categoryHrid": 7,
            "sortIndex": 453
        },
        "/items/chrono_gloves": {
            "categoryHrid": 7,
            "sortIndex": 454
        },
        "/items/cheese_gauntlets": {
            "categoryHrid": 7,
            "sortIndex": 455
        },
        "/items/verdant_gauntlets": {
            "categoryHrid": 7,
            "sortIndex": 456
        },
        "/items/azure_gauntlets": {
            "categoryHrid": 7,
            "sortIndex": 457
        },
        "/items/burble_gauntlets": {
            "categoryHrid": 7,
            "sortIndex": 458
        },
        "/items/crimson_gauntlets": {
            "categoryHrid": 7,
            "sortIndex": 459
        },
        "/items/rainbow_gauntlets": {
            "categoryHrid": 7,
            "sortIndex": 460
        },
        "/items/holy_gauntlets": {
            "categoryHrid": 7,
            "sortIndex": 461
        },
        "/items/rough_bracers": {
            "categoryHrid": 7,
            "sortIndex": 462
        },
        "/items/reptile_bracers": {
            "categoryHrid": 7,
            "sortIndex": 463
        },
        "/items/gobo_bracers": {
            "categoryHrid": 7,
            "sortIndex": 464
        },
        "/items/beast_bracers": {
            "categoryHrid": 7,
            "sortIndex": 465
        },
        "/items/umbral_bracers": {
            "categoryHrid": 7,
            "sortIndex": 466
        },
        "/items/cotton_gloves": {
            "categoryHrid": 7,
            "sortIndex": 467
        },
        "/items/linen_gloves": {
            "categoryHrid": 7,
            "sortIndex": 468
        },
        "/items/bamboo_gloves": {
            "categoryHrid": 7,
            "sortIndex": 469
        },
        "/items/silk_gloves": {
            "categoryHrid": 7,
            "sortIndex": 470
        },
        "/items/radiant_gloves": {
            "categoryHrid": 7,
            "sortIndex": 471
        },
        "/items/collectors_boots": {
            "categoryHrid": 7,
            "sortIndex": 472
        },
        "/items/shoebill_shoes": {
            "categoryHrid": 7,
            "sortIndex": 473
        },
        "/items/black_bear_shoes": {
            "categoryHrid": 7,
            "sortIndex": 474
        },
        "/items/grizzly_bear_shoes": {
            "categoryHrid": 7,
            "sortIndex": 475
        },
        "/items/polar_bear_shoes": {
            "categoryHrid": 7,
            "sortIndex": 476
        },
        "/items/centaur_boots": {
            "categoryHrid": 7,
            "sortIndex": 477
        },
        "/items/sorcerer_boots": {
            "categoryHrid": 7,
            "sortIndex": 478
        },
        "/items/cheese_boots": {
            "categoryHrid": 7,
            "sortIndex": 479
        },
        "/items/verdant_boots": {
            "categoryHrid": 7,
            "sortIndex": 480
        },
        "/items/azure_boots": {
            "categoryHrid": 7,
            "sortIndex": 481
        },
        "/items/burble_boots": {
            "categoryHrid": 7,
            "sortIndex": 482
        },
        "/items/crimson_boots": {
            "categoryHrid": 7,
            "sortIndex": 483
        },
        "/items/rainbow_boots": {
            "categoryHrid": 7,
            "sortIndex": 484
        },
        "/items/holy_boots": {
            "categoryHrid": 7,
            "sortIndex": 485
        },
        "/items/rough_boots": {
            "categoryHrid": 7,
            "sortIndex": 486
        },
        "/items/reptile_boots": {
            "categoryHrid": 7,
            "sortIndex": 487
        },
        "/items/gobo_boots": {
            "categoryHrid": 7,
            "sortIndex": 488
        },
        "/items/beast_boots": {
            "categoryHrid": 7,
            "sortIndex": 489
        },
        "/items/umbral_boots": {
            "categoryHrid": 7,
            "sortIndex": 490
        },
        "/items/cotton_boots": {
            "categoryHrid": 7,
            "sortIndex": 491
        },
        "/items/linen_boots": {
            "categoryHrid": 7,
            "sortIndex": 492
        },
        "/items/bamboo_boots": {
            "categoryHrid": 7,
            "sortIndex": 493
        },
        "/items/silk_boots": {
            "categoryHrid": 7,
            "sortIndex": 494
        },
        "/items/radiant_boots": {
            "categoryHrid": 7,
            "sortIndex": 495
        },
        "/items/small_pouch": {
            "categoryHrid": 7,
            "sortIndex": 496
        },
        "/items/medium_pouch": {
            "categoryHrid": 7,
            "sortIndex": 497
        },
        "/items/large_pouch": {
            "categoryHrid": 7,
            "sortIndex": 498
        },
        "/items/giant_pouch": {
            "categoryHrid": 7,
            "sortIndex": 499
        },
        "/items/gluttonous_pouch": {
            "categoryHrid": 7,
            "sortIndex": 500
        },
        "/items/guzzling_pouch": {
            "categoryHrid": 7,
            "sortIndex": 501
        },
        "/items/necklace_of_efficiency": {
            "categoryHrid": 7,
            "sortIndex": 502
        },
        "/items/fighter_necklace": {
            "categoryHrid": 7,
            "sortIndex": 503
        },
        "/items/ranger_necklace": {
            "categoryHrid": 7,
            "sortIndex": 504
        },
        "/items/wizard_necklace": {
            "categoryHrid": 7,
            "sortIndex": 505
        },
        "/items/necklace_of_wisdom": {
            "categoryHrid": 7,
            "sortIndex": 506
        },
        "/items/necklace_of_speed": {
            "categoryHrid": 7,
            "sortIndex": 507
        },
        "/items/philosophers_necklace": {
            "categoryHrid": 7,
            "sortIndex": 508
        },
        "/items/earrings_of_gathering": {
            "categoryHrid": 7,
            "sortIndex": 509
        },
        "/items/earrings_of_essence_find": {
            "categoryHrid": 7,
            "sortIndex": 510
        },
        "/items/earrings_of_armor": {
            "categoryHrid": 7,
            "sortIndex": 511
        },
        "/items/earrings_of_regeneration": {
            "categoryHrid": 7,
            "sortIndex": 512
        },
        "/items/earrings_of_resistance": {
            "categoryHrid": 7,
            "sortIndex": 513
        },
        "/items/earrings_of_rare_find": {
            "categoryHrid": 7,
            "sortIndex": 514
        },
        "/items/earrings_of_critical_strike": {
            "categoryHrid": 7,
            "sortIndex": 515
        },
        "/items/philosophers_earrings": {
            "categoryHrid": 7,
            "sortIndex": 516
        },
        "/items/ring_of_gathering": {
            "categoryHrid": 7,
            "sortIndex": 517
        },
        "/items/ring_of_essence_find": {
            "categoryHrid": 7,
            "sortIndex": 518
        },
        "/items/ring_of_armor": {
            "categoryHrid": 7,
            "sortIndex": 519
        },
        "/items/ring_of_regeneration": {
            "categoryHrid": 7,
            "sortIndex": 520
        },
        "/items/ring_of_resistance": {
            "categoryHrid": 7,
            "sortIndex": 521
        },
        "/items/ring_of_rare_find": {
            "categoryHrid": 7,
            "sortIndex": 522
        },
        "/items/ring_of_critical_strike": {
            "categoryHrid": 7,
            "sortIndex": 523
        },
        "/items/philosophers_ring": {
            "categoryHrid": 7,
            "sortIndex": 524
        },
        "/items/trainee_milking_charm": {
            "categoryHrid": 7,
            "sortIndex": 525
        },
        "/items/basic_milking_charm": {
            "categoryHrid": 7,
            "sortIndex": 526
        },
        "/items/advanced_milking_charm": {
            "categoryHrid": 7,
            "sortIndex": 527
        },
        "/items/expert_milking_charm": {
            "categoryHrid": 7,
            "sortIndex": 528
        },
        "/items/master_milking_charm": {
            "categoryHrid": 7,
            "sortIndex": 529
        },
        "/items/grandmaster_milking_charm": {
            "categoryHrid": 7,
            "sortIndex": 530
        },
        "/items/trainee_foraging_charm": {
            "categoryHrid": 7,
            "sortIndex": 531
        },
        "/items/basic_foraging_charm": {
            "categoryHrid": 7,
            "sortIndex": 532
        },
        "/items/advanced_foraging_charm": {
            "categoryHrid": 7,
            "sortIndex": 533
        },
        "/items/expert_foraging_charm": {
            "categoryHrid": 7,
            "sortIndex": 534
        },
        "/items/master_foraging_charm": {
            "categoryHrid": 7,
            "sortIndex": 535
        },
        "/items/grandmaster_foraging_charm": {
            "categoryHrid": 7,
            "sortIndex": 536
        },
        "/items/trainee_woodcutting_charm": {
            "categoryHrid": 7,
            "sortIndex": 537
        },
        "/items/basic_woodcutting_charm": {
            "categoryHrid": 7,
            "sortIndex": 538
        },
        "/items/advanced_woodcutting_charm": {
            "categoryHrid": 7,
            "sortIndex": 539
        },
        "/items/expert_woodcutting_charm": {
            "categoryHrid": 7,
            "sortIndex": 540
        },
        "/items/master_woodcutting_charm": {
            "categoryHrid": 7,
            "sortIndex": 541
        },
        "/items/grandmaster_woodcutting_charm": {
            "categoryHrid": 7,
            "sortIndex": 542
        },
        "/items/trainee_cheesesmithing_charm": {
            "categoryHrid": 7,
            "sortIndex": 543
        },
        "/items/basic_cheesesmithing_charm": {
            "categoryHrid": 7,
            "sortIndex": 544
        },
        "/items/advanced_cheesesmithing_charm": {
            "categoryHrid": 7,
            "sortIndex": 545
        },
        "/items/expert_cheesesmithing_charm": {
            "categoryHrid": 7,
            "sortIndex": 546
        },
        "/items/master_cheesesmithing_charm": {
            "categoryHrid": 7,
            "sortIndex": 547
        },
        "/items/grandmaster_cheesesmithing_charm": {
            "categoryHrid": 7,
            "sortIndex": 548
        },
        "/items/trainee_crafting_charm": {
            "categoryHrid": 7,
            "sortIndex": 549
        },
        "/items/basic_crafting_charm": {
            "categoryHrid": 7,
            "sortIndex": 550
        },
        "/items/advanced_crafting_charm": {
            "categoryHrid": 7,
            "sortIndex": 551
        },
        "/items/expert_crafting_charm": {
            "categoryHrid": 7,
            "sortIndex": 552
        },
        "/items/master_crafting_charm": {
            "categoryHrid": 7,
            "sortIndex": 553
        },
        "/items/grandmaster_crafting_charm": {
            "categoryHrid": 7,
            "sortIndex": 554
        },
        "/items/trainee_tailoring_charm": {
            "categoryHrid": 7,
            "sortIndex": 555
        },
        "/items/basic_tailoring_charm": {
            "categoryHrid": 7,
            "sortIndex": 556
        },
        "/items/advanced_tailoring_charm": {
            "categoryHrid": 7,
            "sortIndex": 557
        },
        "/items/expert_tailoring_charm": {
            "categoryHrid": 7,
            "sortIndex": 558
        },
        "/items/master_tailoring_charm": {
            "categoryHrid": 7,
            "sortIndex": 559
        },
        "/items/grandmaster_tailoring_charm": {
            "categoryHrid": 7,
            "sortIndex": 560
        },
        "/items/trainee_cooking_charm": {
            "categoryHrid": 7,
            "sortIndex": 561
        },
        "/items/basic_cooking_charm": {
            "categoryHrid": 7,
            "sortIndex": 562
        },
        "/items/advanced_cooking_charm": {
            "categoryHrid": 7,
            "sortIndex": 563
        },
        "/items/expert_cooking_charm": {
            "categoryHrid": 7,
            "sortIndex": 564
        },
        "/items/master_cooking_charm": {
            "categoryHrid": 7,
            "sortIndex": 565
        },
        "/items/grandmaster_cooking_charm": {
            "categoryHrid": 7,
            "sortIndex": 566
        },
        "/items/trainee_brewing_charm": {
            "categoryHrid": 7,
            "sortIndex": 567
        },
        "/items/basic_brewing_charm": {
            "categoryHrid": 7,
            "sortIndex": 568
        },
        "/items/advanced_brewing_charm": {
            "categoryHrid": 7,
            "sortIndex": 569
        },
        "/items/expert_brewing_charm": {
            "categoryHrid": 7,
            "sortIndex": 570
        },
        "/items/master_brewing_charm": {
            "categoryHrid": 7,
            "sortIndex": 571
        },
        "/items/grandmaster_brewing_charm": {
            "categoryHrid": 7,
            "sortIndex": 572
        },
        "/items/trainee_alchemy_charm": {
            "categoryHrid": 7,
            "sortIndex": 573
        },
        "/items/basic_alchemy_charm": {
            "categoryHrid": 7,
            "sortIndex": 574
        },
        "/items/advanced_alchemy_charm": {
            "categoryHrid": 7,
            "sortIndex": 575
        },
        "/items/expert_alchemy_charm": {
            "categoryHrid": 7,
            "sortIndex": 576
        },
        "/items/master_alchemy_charm": {
            "categoryHrid": 7,
            "sortIndex": 577
        },
        "/items/grandmaster_alchemy_charm": {
            "categoryHrid": 7,
            "sortIndex": 578
        },
        "/items/trainee_enhancing_charm": {
            "categoryHrid": 7,
            "sortIndex": 579
        },
        "/items/basic_enhancing_charm": {
            "categoryHrid": 7,
            "sortIndex": 580
        },
        "/items/advanced_enhancing_charm": {
            "categoryHrid": 7,
            "sortIndex": 581
        },
        "/items/expert_enhancing_charm": {
            "categoryHrid": 7,
            "sortIndex": 582
        },
        "/items/master_enhancing_charm": {
            "categoryHrid": 7,
            "sortIndex": 583
        },
        "/items/grandmaster_enhancing_charm": {
            "categoryHrid": 7,
            "sortIndex": 584
        },
        "/items/trainee_stamina_charm": {
            "categoryHrid": 7,
            "sortIndex": 585
        },
        "/items/basic_stamina_charm": {
            "categoryHrid": 7,
            "sortIndex": 586
        },
        "/items/advanced_stamina_charm": {
            "categoryHrid": 7,
            "sortIndex": 587
        },
        "/items/expert_stamina_charm": {
            "categoryHrid": 7,
            "sortIndex": 588
        },
        "/items/master_stamina_charm": {
            "categoryHrid": 7,
            "sortIndex": 589
        },
        "/items/grandmaster_stamina_charm": {
            "categoryHrid": 7,
            "sortIndex": 590
        },
        "/items/trainee_intelligence_charm": {
            "categoryHrid": 7,
            "sortIndex": 591
        },
        "/items/basic_intelligence_charm": {
            "categoryHrid": 7,
            "sortIndex": 592
        },
        "/items/advanced_intelligence_charm": {
            "categoryHrid": 7,
            "sortIndex": 593
        },
        "/items/expert_intelligence_charm": {
            "categoryHrid": 7,
            "sortIndex": 594
        },
        "/items/master_intelligence_charm": {
            "categoryHrid": 7,
            "sortIndex": 595
        },
        "/items/grandmaster_intelligence_charm": {
            "categoryHrid": 7,
            "sortIndex": 596
        },
        "/items/trainee_attack_charm": {
            "categoryHrid": 7,
            "sortIndex": 597
        },
        "/items/basic_attack_charm": {
            "categoryHrid": 7,
            "sortIndex": 598
        },
        "/items/advanced_attack_charm": {
            "categoryHrid": 7,
            "sortIndex": 599
        },
        "/items/expert_attack_charm": {
            "categoryHrid": 7,
            "sortIndex": 600
        },
        "/items/master_attack_charm": {
            "categoryHrid": 7,
            "sortIndex": 601
        },
        "/items/grandmaster_attack_charm": {
            "categoryHrid": 7,
            "sortIndex": 602
        },
        "/items/trainee_defense_charm": {
            "categoryHrid": 7,
            "sortIndex": 603
        },
        "/items/basic_defense_charm": {
            "categoryHrid": 7,
            "sortIndex": 604
        },
        "/items/advanced_defense_charm": {
            "categoryHrid": 7,
            "sortIndex": 605
        },
        "/items/expert_defense_charm": {
            "categoryHrid": 7,
            "sortIndex": 606
        },
        "/items/master_defense_charm": {
            "categoryHrid": 7,
            "sortIndex": 607
        },
        "/items/grandmaster_defense_charm": {
            "categoryHrid": 7,
            "sortIndex": 608
        },
        "/items/trainee_melee_charm": {
            "categoryHrid": 7,
            "sortIndex": 609
        },
        "/items/basic_melee_charm": {
            "categoryHrid": 7,
            "sortIndex": 610
        },
        "/items/advanced_melee_charm": {
            "categoryHrid": 7,
            "sortIndex": 611
        },
        "/items/expert_melee_charm": {
            "categoryHrid": 7,
            "sortIndex": 612
        },
        "/items/master_melee_charm": {
            "categoryHrid": 7,
            "sortIndex": 613
        },
        "/items/grandmaster_melee_charm": {
            "categoryHrid": 7,
            "sortIndex": 614
        },
        "/items/trainee_ranged_charm": {
            "categoryHrid": 7,
            "sortIndex": 615
        },
        "/items/basic_ranged_charm": {
            "categoryHrid": 7,
            "sortIndex": 616
        },
        "/items/advanced_ranged_charm": {
            "categoryHrid": 7,
            "sortIndex": 617
        },
        "/items/expert_ranged_charm": {
            "categoryHrid": 7,
            "sortIndex": 618
        },
        "/items/master_ranged_charm": {
            "categoryHrid": 7,
            "sortIndex": 619
        },
        "/items/grandmaster_ranged_charm": {
            "categoryHrid": 7,
            "sortIndex": 620
        },
        "/items/trainee_magic_charm": {
            "categoryHrid": 7,
            "sortIndex": 621
        },
        "/items/basic_magic_charm": {
            "categoryHrid": 7,
            "sortIndex": 622
        },
        "/items/advanced_magic_charm": {
            "categoryHrid": 7,
            "sortIndex": 623
        },
        "/items/expert_magic_charm": {
            "categoryHrid": 7,
            "sortIndex": 624
        },
        "/items/master_magic_charm": {
            "categoryHrid": 7,
            "sortIndex": 625
        },
        "/items/grandmaster_magic_charm": {
            "categoryHrid": 7,
            "sortIndex": 626
        },
        "/items/basic_task_badge": {
            "categoryHrid": 7,
            "sortIndex": 627
        },
        "/items/advanced_task_badge": {
            "categoryHrid": 7,
            "sortIndex": 628
        },
        "/items/expert_task_badge": {
            "categoryHrid": 7,
            "sortIndex": 629
        },
        "/items/celestial_brush": {
            "categoryHrid": 7,
            "sortIndex": 630
        },
        "/items/cheese_brush": {
            "categoryHrid": 7,
            "sortIndex": 631
        },
        "/items/verdant_brush": {
            "categoryHrid": 7,
            "sortIndex": 632
        },
        "/items/azure_brush": {
            "categoryHrid": 7,
            "sortIndex": 633
        },
        "/items/burble_brush": {
            "categoryHrid": 7,
            "sortIndex": 634
        },
        "/items/crimson_brush": {
            "categoryHrid": 7,
            "sortIndex": 635
        },
        "/items/rainbow_brush": {
            "categoryHrid": 7,
            "sortIndex": 636
        },
        "/items/holy_brush": {
            "categoryHrid": 7,
            "sortIndex": 637
        },
        "/items/celestial_shears": {
            "categoryHrid": 7,
            "sortIndex": 638
        },
        "/items/cheese_shears": {
            "categoryHrid": 7,
            "sortIndex": 639
        },
        "/items/verdant_shears": {
            "categoryHrid": 7,
            "sortIndex": 640
        },
        "/items/azure_shears": {
            "categoryHrid": 7,
            "sortIndex": 641
        },
        "/items/burble_shears": {
            "categoryHrid": 7,
            "sortIndex": 642
        },
        "/items/crimson_shears": {
            "categoryHrid": 7,
            "sortIndex": 643
        },
        "/items/rainbow_shears": {
            "categoryHrid": 7,
            "sortIndex": 644
        },
        "/items/holy_shears": {
            "categoryHrid": 7,
            "sortIndex": 645
        },
        "/items/celestial_hatchet": {
            "categoryHrid": 7,
            "sortIndex": 646
        },
        "/items/cheese_hatchet": {
            "categoryHrid": 7,
            "sortIndex": 647
        },
        "/items/verdant_hatchet": {
            "categoryHrid": 7,
            "sortIndex": 648
        },
        "/items/azure_hatchet": {
            "categoryHrid": 7,
            "sortIndex": 649
        },
        "/items/burble_hatchet": {
            "categoryHrid": 7,
            "sortIndex": 650
        },
        "/items/crimson_hatchet": {
            "categoryHrid": 7,
            "sortIndex": 651
        },
        "/items/rainbow_hatchet": {
            "categoryHrid": 7,
            "sortIndex": 652
        },
        "/items/holy_hatchet": {
            "categoryHrid": 7,
            "sortIndex": 653
        },
        "/items/celestial_hammer": {
            "categoryHrid": 7,
            "sortIndex": 654
        },
        "/items/cheese_hammer": {
            "categoryHrid": 7,
            "sortIndex": 655
        },
        "/items/verdant_hammer": {
            "categoryHrid": 7,
            "sortIndex": 656
        },
        "/items/azure_hammer": {
            "categoryHrid": 7,
            "sortIndex": 657
        },
        "/items/burble_hammer": {
            "categoryHrid": 7,
            "sortIndex": 658
        },
        "/items/crimson_hammer": {
            "categoryHrid": 7,
            "sortIndex": 659
        },
        "/items/rainbow_hammer": {
            "categoryHrid": 7,
            "sortIndex": 660
        },
        "/items/holy_hammer": {
            "categoryHrid": 7,
            "sortIndex": 661
        },
        "/items/celestial_chisel": {
            "categoryHrid": 7,
            "sortIndex": 662
        },
        "/items/cheese_chisel": {
            "categoryHrid": 7,
            "sortIndex": 663
        },
        "/items/verdant_chisel": {
            "categoryHrid": 7,
            "sortIndex": 664
        },
        "/items/azure_chisel": {
            "categoryHrid": 7,
            "sortIndex": 665
        },
        "/items/burble_chisel": {
            "categoryHrid": 7,
            "sortIndex": 666
        },
        "/items/crimson_chisel": {
            "categoryHrid": 7,
            "sortIndex": 667
        },
        "/items/rainbow_chisel": {
            "categoryHrid": 7,
            "sortIndex": 668
        },
        "/items/holy_chisel": {
            "categoryHrid": 7,
            "sortIndex": 669
        },
        "/items/celestial_needle": {
            "categoryHrid": 7,
            "sortIndex": 670
        },
        "/items/cheese_needle": {
            "categoryHrid": 7,
            "sortIndex": 671
        },
        "/items/verdant_needle": {
            "categoryHrid": 7,
            "sortIndex": 672
        },
        "/items/azure_needle": {
            "categoryHrid": 7,
            "sortIndex": 673
        },
        "/items/burble_needle": {
            "categoryHrid": 7,
            "sortIndex": 674
        },
        "/items/crimson_needle": {
            "categoryHrid": 7,
            "sortIndex": 675
        },
        "/items/rainbow_needle": {
            "categoryHrid": 7,
            "sortIndex": 676
        },
        "/items/holy_needle": {
            "categoryHrid": 7,
            "sortIndex": 677
        },
        "/items/celestial_spatula": {
            "categoryHrid": 7,
            "sortIndex": 678
        },
        "/items/cheese_spatula": {
            "categoryHrid": 7,
            "sortIndex": 679
        },
        "/items/verdant_spatula": {
            "categoryHrid": 7,
            "sortIndex": 680
        },
        "/items/azure_spatula": {
            "categoryHrid": 7,
            "sortIndex": 681
        },
        "/items/burble_spatula": {
            "categoryHrid": 7,
            "sortIndex": 682
        },
        "/items/crimson_spatula": {
            "categoryHrid": 7,
            "sortIndex": 683
        },
        "/items/rainbow_spatula": {
            "categoryHrid": 7,
            "sortIndex": 684
        },
        "/items/holy_spatula": {
            "categoryHrid": 7,
            "sortIndex": 685
        },
        "/items/celestial_pot": {
            "categoryHrid": 7,
            "sortIndex": 686
        },
        "/items/cheese_pot": {
            "categoryHrid": 7,
            "sortIndex": 687
        },
        "/items/verdant_pot": {
            "categoryHrid": 7,
            "sortIndex": 688
        },
        "/items/azure_pot": {
            "categoryHrid": 7,
            "sortIndex": 689
        },
        "/items/burble_pot": {
            "categoryHrid": 7,
            "sortIndex": 690
        },
        "/items/crimson_pot": {
            "categoryHrid": 7,
            "sortIndex": 691
        },
        "/items/rainbow_pot": {
            "categoryHrid": 7,
            "sortIndex": 692
        },
        "/items/holy_pot": {
            "categoryHrid": 7,
            "sortIndex": 693
        },
        "/items/celestial_alembic": {
            "categoryHrid": 7,
            "sortIndex": 694
        },
        "/items/cheese_alembic": {
            "categoryHrid": 7,
            "sortIndex": 695
        },
        "/items/verdant_alembic": {
            "categoryHrid": 7,
            "sortIndex": 696
        },
        "/items/azure_alembic": {
            "categoryHrid": 7,
            "sortIndex": 697
        },
        "/items/burble_alembic": {
            "categoryHrid": 7,
            "sortIndex": 698
        },
        "/items/crimson_alembic": {
            "categoryHrid": 7,
            "sortIndex": 699
        },
        "/items/rainbow_alembic": {
            "categoryHrid": 7,
            "sortIndex": 700
        },
        "/items/holy_alembic": {
            "categoryHrid": 7,
            "sortIndex": 701
        },
        "/items/celestial_enhancer": {
            "categoryHrid": 7,
            "sortIndex": 702
        },
        "/items/cheese_enhancer": {
            "categoryHrid": 7,
            "sortIndex": 703
        },
        "/items/verdant_enhancer": {
            "categoryHrid": 7,
            "sortIndex": 704
        },
        "/items/azure_enhancer": {
            "categoryHrid": 7,
            "sortIndex": 705
        },
        "/items/burble_enhancer": {
            "categoryHrid": 7,
            "sortIndex": 706
        },
        "/items/crimson_enhancer": {
            "categoryHrid": 7,
            "sortIndex": 707
        },
        "/items/rainbow_enhancer": {
            "categoryHrid": 7,
            "sortIndex": 708
        },
        "/items/holy_enhancer": {
            "categoryHrid": 7,
            "sortIndex": 709
        },
        "/items/donut": {
            "categoryHrid": 4,
            "sortIndex": 44
        },
        "/items/blueberry_donut": {
            "categoryHrid": 4,
            "sortIndex": 45
        },
        "/items/blackberry_donut": {
            "categoryHrid": 4,
            "sortIndex": 46
        },
        "/items/strawberry_donut": {
            "categoryHrid": 4,
            "sortIndex": 47
        },
        "/items/mooberry_donut": {
            "categoryHrid": 4,
            "sortIndex": 48
        },
        "/items/marsberry_donut": {
            "categoryHrid": 4,
            "sortIndex": 49
        },
        "/items/spaceberry_donut": {
            "categoryHrid": 4,
            "sortIndex": 50
        },
        "/items/cupcake": {
            "categoryHrid": 4,
            "sortIndex": 51
        },
        "/items/blueberry_cake": {
            "categoryHrid": 4,
            "sortIndex": 52
        },
        "/items/blackberry_cake": {
            "categoryHrid": 4,
            "sortIndex": 53
        },
        "/items/strawberry_cake": {
            "categoryHrid": 4,
            "sortIndex": 54
        },
        "/items/mooberry_cake": {
            "categoryHrid": 4,
            "sortIndex": 55
        },
        "/items/marsberry_cake": {
            "categoryHrid": 4,
            "sortIndex": 56
        },
        "/items/spaceberry_cake": {
            "categoryHrid": 4,
            "sortIndex": 57
        },
        "/items/gummy": {
            "categoryHrid": 4,
            "sortIndex": 58
        },
        "/items/apple_gummy": {
            "categoryHrid": 4,
            "sortIndex": 59
        },
        "/items/orange_gummy": {
            "categoryHrid": 4,
            "sortIndex": 60
        },
        "/items/plum_gummy": {
            "categoryHrid": 4,
            "sortIndex": 61
        },
        "/items/peach_gummy": {
            "categoryHrid": 4,
            "sortIndex": 62
        },
        "/items/dragon_fruit_gummy": {
            "categoryHrid": 4,
            "sortIndex": 63
        },
        "/items/star_fruit_gummy": {
            "categoryHrid": 4,
            "sortIndex": 64
        },
        "/items/yogurt": {
            "categoryHrid": 4,
            "sortIndex": 65
        },
        "/items/apple_yogurt": {
            "categoryHrid": 4,
            "sortIndex": 66
        },
        "/items/orange_yogurt": {
            "categoryHrid": 4,
            "sortIndex": 67
        },
        "/items/plum_yogurt": {
            "categoryHrid": 4,
            "sortIndex": 68
        },
        "/items/peach_yogurt": {
            "categoryHrid": 4,
            "sortIndex": 69
        },
        "/items/dragon_fruit_yogurt": {
            "categoryHrid": 4,
            "sortIndex": 70
        },
        "/items/star_fruit_yogurt": {
            "categoryHrid": 4,
            "sortIndex": 71
        },
        "/items/blue_key_fragment": {
            "categoryHrid": 3,
            "sortIndex": 27
        },
        "/items/green_key_fragment": {
            "categoryHrid": 3,
            "sortIndex": 28
        },
        "/items/purple_key_fragment": {
            "categoryHrid": 3,
            "sortIndex": 29
        },
        "/items/white_key_fragment": {
            "categoryHrid": 3,
            "sortIndex": 30
        },
        "/items/orange_key_fragment": {
            "categoryHrid": 3,
            "sortIndex": 31
        },
        "/items/brown_key_fragment": {
            "categoryHrid": 3,
            "sortIndex": 32
        },
        "/items/stone_key_fragment": {
            "categoryHrid": 3,
            "sortIndex": 33
        },
        "/items/dark_key_fragment": {
            "categoryHrid": 3,
            "sortIndex": 34
        },
        "/items/burning_key_fragment": {
            "categoryHrid": 3,
            "sortIndex": 35
        },
        "/items/chimerical_entry_key": {
            "categoryHrid": 3,
            "sortIndex": 36
        },
        "/items/chimerical_chest_key": {
            "categoryHrid": 3,
            "sortIndex": 37
        },
        "/items/sinister_entry_key": {
            "categoryHrid": 3,
            "sortIndex": 38
        },
        "/items/sinister_chest_key": {
            "categoryHrid": 3,
            "sortIndex": 39
        },
        "/items/enchanted_entry_key": {
            "categoryHrid": 3,
            "sortIndex": 40
        },
        "/items/enchanted_chest_key": {
            "categoryHrid": 3,
            "sortIndex": 41
        },
        "/items/pirate_entry_key": {
            "categoryHrid": 3,
            "sortIndex": 42
        },
        "/items/pirate_chest_key": {
            "categoryHrid": 3,
            "sortIndex": 43
        },
        "/items/bag_of_10_cowbells": {
            "categoryHrid": 2,
            "sortIndex": 8
        },
        "/items/purples_gift": {
            "categoryHrid": 2,
            "sortIndex": 9
        },
        "/items/small_meteorite_cache": {
            "categoryHrid": 2,
            "sortIndex": 10
        },
        "/items/medium_meteorite_cache": {
            "categoryHrid": 2,
            "sortIndex": 11
        },
        "/items/large_meteorite_cache": {
            "categoryHrid": 2,
            "sortIndex": 12
        },
        "/items/small_artisans_crate": {
            "categoryHrid": 2,
            "sortIndex": 13
        },
        "/items/medium_artisans_crate": {
            "categoryHrid": 2,
            "sortIndex": 14
        },
        "/items/large_artisans_crate": {
            "categoryHrid": 2,
            "sortIndex": 15
        },
        "/items/small_treasure_chest": {
            "categoryHrid": 2,
            "sortIndex": 16
        },
        "/items/medium_treasure_chest": {
            "categoryHrid": 2,
            "sortIndex": 17
        },
        "/items/large_treasure_chest": {
            "categoryHrid": 2,
            "sortIndex": 18
        },
        "/items/chimerical_chest": {
            "categoryHrid": 2,
            "sortIndex": 19
        },
        "/items/chimerical_refinement_chest": {
            "categoryHrid": 2,
            "sortIndex": 20
        },
        "/items/sinister_chest": {
            "categoryHrid": 2,
            "sortIndex": 21
        },
        "/items/sinister_refinement_chest": {
            "categoryHrid": 2,
            "sortIndex": 22
        },
        "/items/enchanted_chest": {
            "categoryHrid": 2,
            "sortIndex": 23
        },
        "/items/enchanted_refinement_chest": {
            "categoryHrid": 2,
            "sortIndex": 24
        },
        "/items/pirate_chest": {
            "categoryHrid": 2,
            "sortIndex": 25
        },
        "/items/pirate_refinement_chest": {
            "categoryHrid": 2,
            "sortIndex": 26
        },
        "/items/milk": {
            "categoryHrid": 8,
            "sortIndex": 710
        },
        "/items/verdant_milk": {
            "categoryHrid": 8,
            "sortIndex": 711
        },
        "/items/azure_milk": {
            "categoryHrid": 8,
            "sortIndex": 712
        },
        "/items/burble_milk": {
            "categoryHrid": 8,
            "sortIndex": 713
        },
        "/items/crimson_milk": {
            "categoryHrid": 8,
            "sortIndex": 714
        },
        "/items/rainbow_milk": {
            "categoryHrid": 8,
            "sortIndex": 715
        },
        "/items/holy_milk": {
            "categoryHrid": 8,
            "sortIndex": 716
        },
        "/items/cheese": {
            "categoryHrid": 8,
            "sortIndex": 717
        },
        "/items/verdant_cheese": {
            "categoryHrid": 8,
            "sortIndex": 718
        },
        "/items/azure_cheese": {
            "categoryHrid": 8,
            "sortIndex": 719
        },
        "/items/burble_cheese": {
            "categoryHrid": 8,
            "sortIndex": 720
        },
        "/items/crimson_cheese": {
            "categoryHrid": 8,
            "sortIndex": 721
        },
        "/items/rainbow_cheese": {
            "categoryHrid": 8,
            "sortIndex": 722
        },
        "/items/holy_cheese": {
            "categoryHrid": 8,
            "sortIndex": 723
        },
        "/items/log": {
            "categoryHrid": 8,
            "sortIndex": 724
        },
        "/items/birch_log": {
            "categoryHrid": 8,
            "sortIndex": 725
        },
        "/items/cedar_log": {
            "categoryHrid": 8,
            "sortIndex": 726
        },
        "/items/purpleheart_log": {
            "categoryHrid": 8,
            "sortIndex": 727
        },
        "/items/ginkgo_log": {
            "categoryHrid": 8,
            "sortIndex": 728
        },
        "/items/redwood_log": {
            "categoryHrid": 8,
            "sortIndex": 729
        },
        "/items/arcane_log": {
            "categoryHrid": 8,
            "sortIndex": 730
        },
        "/items/lumber": {
            "categoryHrid": 8,
            "sortIndex": 731
        },
        "/items/birch_lumber": {
            "categoryHrid": 8,
            "sortIndex": 732
        },
        "/items/cedar_lumber": {
            "categoryHrid": 8,
            "sortIndex": 733
        },
        "/items/purpleheart_lumber": {
            "categoryHrid": 8,
            "sortIndex": 734
        },
        "/items/ginkgo_lumber": {
            "categoryHrid": 8,
            "sortIndex": 735
        },
        "/items/redwood_lumber": {
            "categoryHrid": 8,
            "sortIndex": 736
        },
        "/items/arcane_lumber": {
            "categoryHrid": 8,
            "sortIndex": 737
        },
        "/items/rough_hide": {
            "categoryHrid": 8,
            "sortIndex": 738
        },
        "/items/reptile_hide": {
            "categoryHrid": 8,
            "sortIndex": 739
        },
        "/items/gobo_hide": {
            "categoryHrid": 8,
            "sortIndex": 740
        },
        "/items/beast_hide": {
            "categoryHrid": 8,
            "sortIndex": 741
        },
        "/items/umbral_hide": {
            "categoryHrid": 8,
            "sortIndex": 742
        },
        "/items/rough_leather": {
            "categoryHrid": 8,
            "sortIndex": 743
        },
        "/items/reptile_leather": {
            "categoryHrid": 8,
            "sortIndex": 744
        },
        "/items/gobo_leather": {
            "categoryHrid": 8,
            "sortIndex": 745
        },
        "/items/beast_leather": {
            "categoryHrid": 8,
            "sortIndex": 746
        },
        "/items/umbral_leather": {
            "categoryHrid": 8,
            "sortIndex": 747
        },
        "/items/cotton": {
            "categoryHrid": 8,
            "sortIndex": 748
        },
        "/items/flax": {
            "categoryHrid": 8,
            "sortIndex": 749
        },
        "/items/bamboo_branch": {
            "categoryHrid": 8,
            "sortIndex": 750
        },
        "/items/cocoon": {
            "categoryHrid": 8,
            "sortIndex": 751
        },
        "/items/radiant_fiber": {
            "categoryHrid": 8,
            "sortIndex": 752
        },
        "/items/cotton_fabric": {
            "categoryHrid": 8,
            "sortIndex": 753
        },
        "/items/linen_fabric": {
            "categoryHrid": 8,
            "sortIndex": 754
        },
        "/items/bamboo_fabric": {
            "categoryHrid": 8,
            "sortIndex": 755
        },
        "/items/silk_fabric": {
            "categoryHrid": 8,
            "sortIndex": 756
        },
        "/items/radiant_fabric": {
            "categoryHrid": 8,
            "sortIndex": 757
        },
        "/items/egg": {
            "categoryHrid": 8,
            "sortIndex": 758
        },
        "/items/wheat": {
            "categoryHrid": 8,
            "sortIndex": 759
        },
        "/items/sugar": {
            "categoryHrid": 8,
            "sortIndex": 760
        },
        "/items/blueberry": {
            "categoryHrid": 8,
            "sortIndex": 761
        },
        "/items/blackberry": {
            "categoryHrid": 8,
            "sortIndex": 762
        },
        "/items/strawberry": {
            "categoryHrid": 8,
            "sortIndex": 763
        },
        "/items/mooberry": {
            "categoryHrid": 8,
            "sortIndex": 764
        },
        "/items/marsberry": {
            "categoryHrid": 8,
            "sortIndex": 765
        },
        "/items/spaceberry": {
            "categoryHrid": 8,
            "sortIndex": 766
        },
        "/items/apple": {
            "categoryHrid": 8,
            "sortIndex": 767
        },
        "/items/orange": {
            "categoryHrid": 8,
            "sortIndex": 768
        },
        "/items/plum": {
            "categoryHrid": 8,
            "sortIndex": 769
        },
        "/items/peach": {
            "categoryHrid": 8,
            "sortIndex": 770
        },
        "/items/dragon_fruit": {
            "categoryHrid": 8,
            "sortIndex": 771
        },
        "/items/star_fruit": {
            "categoryHrid": 8,
            "sortIndex": 772
        },
        "/items/arabica_coffee_bean": {
            "categoryHrid": 8,
            "sortIndex": 773
        },
        "/items/robusta_coffee_bean": {
            "categoryHrid": 8,
            "sortIndex": 774
        },
        "/items/liberica_coffee_bean": {
            "categoryHrid": 8,
            "sortIndex": 775
        },
        "/items/excelsa_coffee_bean": {
            "categoryHrid": 8,
            "sortIndex": 776
        },
        "/items/fieriosa_coffee_bean": {
            "categoryHrid": 8,
            "sortIndex": 777
        },
        "/items/spacia_coffee_bean": {
            "categoryHrid": 8,
            "sortIndex": 778
        },
        "/items/green_tea_leaf": {
            "categoryHrid": 8,
            "sortIndex": 779
        },
        "/items/black_tea_leaf": {
            "categoryHrid": 8,
            "sortIndex": 780
        },
        "/items/burble_tea_leaf": {
            "categoryHrid": 8,
            "sortIndex": 781
        },
        "/items/moolong_tea_leaf": {
            "categoryHrid": 8,
            "sortIndex": 782
        },
        "/items/red_tea_leaf": {
            "categoryHrid": 8,
            "sortIndex": 783
        },
        "/items/emp_tea_leaf": {
            "categoryHrid": 8,
            "sortIndex": 784
        },
        "/items/catalyst_of_coinification": {
            "categoryHrid": 8,
            "sortIndex": 785
        },
        "/items/catalyst_of_decomposition": {
            "categoryHrid": 8,
            "sortIndex": 786
        },
        "/items/catalyst_of_transmutation": {
            "categoryHrid": 8,
            "sortIndex": 787
        },
        "/items/prime_catalyst": {
            "categoryHrid": 8,
            "sortIndex": 788
        },
        "/items/snake_fang": {
            "categoryHrid": 8,
            "sortIndex": 789
        },
        "/items/shoebill_feather": {
            "categoryHrid": 8,
            "sortIndex": 790
        },
        "/items/snail_shell": {
            "categoryHrid": 8,
            "sortIndex": 791
        },
        "/items/crab_pincer": {
            "categoryHrid": 8,
            "sortIndex": 792
        },
        "/items/turtle_shell": {
            "categoryHrid": 8,
            "sortIndex": 793
        },
        "/items/marine_scale": {
            "categoryHrid": 8,
            "sortIndex": 794
        },
        "/items/treant_bark": {
            "categoryHrid": 8,
            "sortIndex": 795
        },
        "/items/centaur_hoof": {
            "categoryHrid": 8,
            "sortIndex": 796
        },
        "/items/luna_wing": {
            "categoryHrid": 8,
            "sortIndex": 797
        },
        "/items/gobo_rag": {
            "categoryHrid": 8,
            "sortIndex": 798
        },
        "/items/goggles": {
            "categoryHrid": 8,
            "sortIndex": 799
        },
        "/items/magnifying_glass": {
            "categoryHrid": 8,
            "sortIndex": 800
        },
        "/items/eye_of_the_watcher": {
            "categoryHrid": 8,
            "sortIndex": 801
        },
        "/items/icy_cloth": {
            "categoryHrid": 8,
            "sortIndex": 802
        },
        "/items/flaming_cloth": {
            "categoryHrid": 8,
            "sortIndex": 803
        },
        "/items/sorcerers_sole": {
            "categoryHrid": 8,
            "sortIndex": 804
        },
        "/items/chrono_sphere": {
            "categoryHrid": 8,
            "sortIndex": 805
        },
        "/items/frost_sphere": {
            "categoryHrid": 8,
            "sortIndex": 806
        },
        "/items/panda_fluff": {
            "categoryHrid": 8,
            "sortIndex": 807
        },
        "/items/black_bear_fluff": {
            "categoryHrid": 8,
            "sortIndex": 808
        },
        "/items/grizzly_bear_fluff": {
            "categoryHrid": 8,
            "sortIndex": 809
        },
        "/items/polar_bear_fluff": {
            "categoryHrid": 8,
            "sortIndex": 810
        },
        "/items/red_panda_fluff": {
            "categoryHrid": 8,
            "sortIndex": 811
        },
        "/items/magnet": {
            "categoryHrid": 8,
            "sortIndex": 812
        },
        "/items/stalactite_shard": {
            "categoryHrid": 8,
            "sortIndex": 813
        },
        "/items/living_granite": {
            "categoryHrid": 8,
            "sortIndex": 814
        },
        "/items/colossus_core": {
            "categoryHrid": 8,
            "sortIndex": 815
        },
        "/items/vampire_fang": {
            "categoryHrid": 8,
            "sortIndex": 816
        },
        "/items/werewolf_claw": {
            "categoryHrid": 8,
            "sortIndex": 817
        },
        "/items/revenant_anima": {
            "categoryHrid": 8,
            "sortIndex": 818
        },
        "/items/soul_fragment": {
            "categoryHrid": 8,
            "sortIndex": 819
        },
        "/items/infernal_ember": {
            "categoryHrid": 8,
            "sortIndex": 820
        },
        "/items/demonic_core": {
            "categoryHrid": 8,
            "sortIndex": 821
        },
        "/items/griffin_leather": {
            "categoryHrid": 8,
            "sortIndex": 822
        },
        "/items/manticore_sting": {
            "categoryHrid": 8,
            "sortIndex": 823
        },
        "/items/jackalope_antler": {
            "categoryHrid": 8,
            "sortIndex": 824
        },
        "/items/dodocamel_plume": {
            "categoryHrid": 8,
            "sortIndex": 825
        },
        "/items/griffin_talon": {
            "categoryHrid": 8,
            "sortIndex": 826
        },
        "/items/chimerical_refinement_shard": {
            "categoryHrid": 8,
            "sortIndex": 827
        },
        "/items/acrobats_ribbon": {
            "categoryHrid": 8,
            "sortIndex": 828
        },
        "/items/magicians_cloth": {
            "categoryHrid": 8,
            "sortIndex": 829
        },
        "/items/chaotic_chain": {
            "categoryHrid": 8,
            "sortIndex": 830
        },
        "/items/cursed_ball": {
            "categoryHrid": 8,
            "sortIndex": 831
        },
        "/items/sinister_refinement_shard": {
            "categoryHrid": 8,
            "sortIndex": 832
        },
        "/items/royal_cloth": {
            "categoryHrid": 8,
            "sortIndex": 833
        },
        "/items/knights_ingot": {
            "categoryHrid": 8,
            "sortIndex": 834
        },
        "/items/bishops_scroll": {
            "categoryHrid": 8,
            "sortIndex": 835
        },
        "/items/regal_jewel": {
            "categoryHrid": 8,
            "sortIndex": 836
        },
        "/items/sundering_jewel": {
            "categoryHrid": 8,
            "sortIndex": 837
        },
        "/items/enchanted_refinement_shard": {
            "categoryHrid": 8,
            "sortIndex": 838
        },
        "/items/marksman_brooch": {
            "categoryHrid": 8,
            "sortIndex": 839
        },
        "/items/corsair_crest": {
            "categoryHrid": 8,
            "sortIndex": 840
        },
        "/items/damaged_anchor": {
            "categoryHrid": 8,
            "sortIndex": 841
        },
        "/items/maelstrom_plating": {
            "categoryHrid": 8,
            "sortIndex": 842
        },
        "/items/kraken_leather": {
            "categoryHrid": 8,
            "sortIndex": 843
        },
        "/items/kraken_fang": {
            "categoryHrid": 8,
            "sortIndex": 844
        },
        "/items/pirate_refinement_shard": {
            "categoryHrid": 8,
            "sortIndex": 845
        },
        "/items/butter_of_proficiency": {
            "categoryHrid": 8,
            "sortIndex": 846
        },
        "/items/thread_of_expertise": {
            "categoryHrid": 8,
            "sortIndex": 847
        },
        "/items/branch_of_insight": {
            "categoryHrid": 8,
            "sortIndex": 848
        },
        "/items/gluttonous_energy": {
            "categoryHrid": 8,
            "sortIndex": 849
        },
        "/items/guzzling_energy": {
            "categoryHrid": 8,
            "sortIndex": 850
        },
        "/items/milking_essence": {
            "categoryHrid": 8,
            "sortIndex": 851
        },
        "/items/foraging_essence": {
            "categoryHrid": 8,
            "sortIndex": 852
        },
        "/items/woodcutting_essence": {
            "categoryHrid": 8,
            "sortIndex": 853
        },
        "/items/cheesesmithing_essence": {
            "categoryHrid": 8,
            "sortIndex": 854
        },
        "/items/crafting_essence": {
            "categoryHrid": 8,
            "sortIndex": 855
        },
        "/items/tailoring_essence": {
            "categoryHrid": 8,
            "sortIndex": 856
        },
        "/items/cooking_essence": {
            "categoryHrid": 8,
            "sortIndex": 857
        },
        "/items/brewing_essence": {
            "categoryHrid": 8,
            "sortIndex": 858
        },
        "/items/alchemy_essence": {
            "categoryHrid": 8,
            "sortIndex": 859
        },
        "/items/enhancing_essence": {
            "categoryHrid": 8,
            "sortIndex": 860
        },
        "/items/swamp_essence": {
            "categoryHrid": 8,
            "sortIndex": 861
        },
        "/items/aqua_essence": {
            "categoryHrid": 8,
            "sortIndex": 862
        },
        "/items/jungle_essence": {
            "categoryHrid": 8,
            "sortIndex": 863
        },
        "/items/gobo_essence": {
            "categoryHrid": 8,
            "sortIndex": 864
        },
        "/items/eyessence": {
            "categoryHrid": 8,
            "sortIndex": 865
        },
        "/items/sorcerer_essence": {
            "categoryHrid": 8,
            "sortIndex": 866
        },
        "/items/bear_essence": {
            "categoryHrid": 8,
            "sortIndex": 867
        },
        "/items/golem_essence": {
            "categoryHrid": 8,
            "sortIndex": 868
        },
        "/items/twilight_essence": {
            "categoryHrid": 8,
            "sortIndex": 869
        },
        "/items/abyssal_essence": {
            "categoryHrid": 8,
            "sortIndex": 870
        },
        "/items/chimerical_essence": {
            "categoryHrid": 8,
            "sortIndex": 871
        },
        "/items/sinister_essence": {
            "categoryHrid": 8,
            "sortIndex": 872
        },
        "/items/enchanted_essence": {
            "categoryHrid": 8,
            "sortIndex": 873
        },
        "/items/pirate_essence": {
            "categoryHrid": 8,
            "sortIndex": 874
        },
        "/items/task_crystal": {
            "categoryHrid": 8,
            "sortIndex": 875
        },
        "/items/star_fragment": {
            "categoryHrid": 8,
            "sortIndex": 876
        },
        "/items/pearl": {
            "categoryHrid": 8,
            "sortIndex": 877
        },
        "/items/amber": {
            "categoryHrid": 8,
            "sortIndex": 878
        },
        "/items/garnet": {
            "categoryHrid": 8,
            "sortIndex": 879
        },
        "/items/jade": {
            "categoryHrid": 8,
            "sortIndex": 880
        },
        "/items/amethyst": {
            "categoryHrid": 8,
            "sortIndex": 881
        },
        "/items/moonstone": {
            "categoryHrid": 8,
            "sortIndex": 882
        },
        "/items/sunstone": {
            "categoryHrid": 8,
            "sortIndex": 883
        },
        "/items/philosophers_stone": {
            "categoryHrid": 8,
            "sortIndex": 884
        },
        "/items/crushed_pearl": {
            "categoryHrid": 8,
            "sortIndex": 885
        },
        "/items/crushed_amber": {
            "categoryHrid": 8,
            "sortIndex": 886
        },
        "/items/crushed_garnet": {
            "categoryHrid": 8,
            "sortIndex": 887
        },
        "/items/crushed_jade": {
            "categoryHrid": 8,
            "sortIndex": 888
        },
        "/items/crushed_amethyst": {
            "categoryHrid": 8,
            "sortIndex": 889
        },
        "/items/crushed_moonstone": {
            "categoryHrid": 8,
            "sortIndex": 890
        },
        "/items/crushed_sunstone": {
            "categoryHrid": 8,
            "sortIndex": 891
        },
        "/items/crushed_philosophers_stone": {
            "categoryHrid": 8,
            "sortIndex": 892
        },
        "/items/shard_of_protection": {
            "categoryHrid": 8,
            "sortIndex": 893
        },
        "/items/mirror_of_protection": {
            "categoryHrid": 8,
            "sortIndex": 894
        }
    }

    function sortOrderList() {
        let orderList = document.querySelector(".MarketplacePanel_myListingsTableContainer__2s6pm");
        if (orderList) {
            let tbody = orderList.querySelector("table tbody");
            let rows = orderList.querySelectorAll("table tbody tr");

            // Convert NodeList to Array for sorting
            let rowsArray = Array.from(rows);

            rowsArray.forEach(function (row, index) {
                // 解析订单行数据
                const typeElement = row.querySelector("td:nth-child(2)");
                const isSell = typeElement.className.includes("sell");

                // 获取物品信息
                const itemElement = row.querySelector("td:nth-child(3)");
                const itemHref = "/items/" + itemElement.querySelector("svg use").getAttribute("href").split("#")[1];
                let categoryIndex = itemDetails[itemHref]?.categoryHrid || 0;
                categoryIndex = String(categoryIndex).padStart(4, '0')
                let itemIndex = itemDetails[itemHref]?.sortIndex || 0;
                itemIndex = String(itemIndex).padStart(4, '0')

                // 获取价格
                const priceText = row.querySelector("td:nth-child(4)").innerText;
                const priceIndex = convertToScientificNotation(priceText);

                // 收集位置？ 部分完成
                const collectElement = row.querySelector("td:nth-last-child(3)");
                const isPartFinished = collectElement.querySelectorAll("svg").length > 0;

                // 取消？ 已完成
                const cancelElement = row.querySelector("td:nth-last-child(1)");
                const isFinished = cancelElement.childElementCount === 0;

                // 排序索引
                const sortIndex = `${isFinished ? 'F' : isPartFinished ? "P" : 'X'}-${isSell ? 'S' : 'B'}-${categoryIndex}+${itemIndex}-${priceIndex}-${String(index).padStart(3, '0')}`;
                // 设置排序索引为行的自定义属性
                row.setAttribute("data-index", sortIndex);
            });

            // Sort the array
            rowsArray.sort((a, b) => {
                const indexA = a.getAttribute("data-index");
                const indexB = b.getAttribute("data-index");
                return indexA.localeCompare(indexB);
            });

            // Clear the tbody and append sorted rows
            while (tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
            }

            // Append sorted rows back to the table
            rowsArray.forEach(row => {
                tbody.appendChild(row);
            });
        }
    }

    function addSortIndexToOrderList() {
        const target = document.querySelector(".MarketplacePanel_listingCount__3nVY_");
        if (!target || target.querySelector("#OrderSort")) {
            return;
        }

        let orderSort = document.createElement("button");
        orderSort.id = "OrderSort";
        orderSort.innerHTML = "OrderSort";
        orderSort.setAttribute("class", "Button_button__1Fe9z Button_small__3fqC7");
        orderSort.addEventListener("click", function (evt) {
            sortOrderList();
        });

        target.appendChild(orderSort);
    }

    const config = { attributes: true, childList: true, subtree: true };

    const observer = new MutationObserver(function (mutationsList, observer) {
        addButton();
        addSortIndexToOrderList();
    });

    observer.observe(document, config);
})();