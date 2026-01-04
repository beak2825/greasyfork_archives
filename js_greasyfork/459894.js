// ==UserScript==
// @name         auto sgo
// @namespace    http://tampermonkey.net/
// @version      7.0.0
// @description  dududuaoaogsaosoauto
// @author       You
// @match        https://swordgale.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=swordgale.online
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459894/auto%20sgo.user.js
// @updateURL https://update.greasyfork.org/scripts/459894/auto%20sgo.meta.js
// ==/UserScript==

/* jshint esversion:11 */
const base_url = "https://api.swordgale.online";
let fight_id, smith_id;
(() => {
    'use strict';

    ["ponpon", "fighting", "previous_hp"].forEach((key) => check_local(key));
    check_local("name_to_id_list", {});
    check_local("name_queue", []);


    setInterval(() => {


        if (!find_element("a", "開扁")) {
            let btn = find_element("a", "角色").cloneNode(true);
            btn.addEventListener("click", () => {
                localStorage.fighting = +!parseInt(localStorage.fighting);
                btn.innerText = `開扁(${parseInt(localStorage.fighting) ? 'on' : 'off'})`;
                if (parseInt(localStorage.fighting)) {
                    clearInterval(fight_id);
                    fight_id = setInterval(async () => await auto_fight(), 5487 + roll(587));
                }
            });
            btn.innerText = `開扁(${parseInt(localStorage.fighting) ? 'on' : 'off'})`;
            btn.disabled = false;

            if (parseInt(localStorage.fighting)) {
                clearInterval(fight_id);
                fight_id = setInterval(async () => await auto_fight(), 5487 + roll(587));
            }

            find_element("a", "角色").parentNode.insertBefore(btn, find_element("a", "角色"));
        }


        if (!find_element("a", "砰砰乓乓")) {
            let btn = find_element("a", "角色").cloneNode(true);
            btn.addEventListener("click", () => {
                localStorage.ponpon = +!parseInt(localStorage.ponpon);
                btn.innerText = `砰砰乓乓(${parseInt(localStorage.ponpon) ? 'on' : 'off'})`;
                if (parseInt(localStorage.ponpon)) {
                    clearInterval(smith_id);
                    smith_id = setInterval(async () => await auto_smith(), 5487 + roll(4487));
                }
            });
            btn.innerText = `砰砰乓乓(${parseInt(localStorage.ponpon) ? 'on' : 'off'})`;
            btn.disabled = false;
            btn.href = "";
            if (parseInt(localStorage.ponpon)) {
                clearInterval(smith_id);
                smith_id = setInterval(async () => await auto_smith(), 5487 + roll(4487));
            }
            find_element("a", "角色").parentNode.insertBefore(btn, find_element("a", "角色"));
        }
    }, 1000);
})();


let id;


function roll(max, min = 0, float = false) {
    let point = Math.random() * (max - min + 1) + min;
    if (float) return point;
    return Math.floor(point);

}

function find_element(selector, filter) {
    return Array.from(document.querySelectorAll(selector)).find((btn) => btn.innerText.match(filter));
}


async function rest(item_list) {
    const lot_item_list = ["兔肉"];

    const items = (await get_items()).consumables;

    for (let item_name of item_list) {
        const the_item = items.find((item) => item.name == item_name);
        if (the_item) {
            await template_fetch(`${base_url}/api/items/${the_item.id}/use`, "{\"quantity\":1}", "POST");
            return;
        }
    }

    await template_fetch(`${base_url}/api/action/rest`, "{}", "POST");


}

async function auto_fight() {
    const set_skill = async (skill_name, api, key, bool) => await template_fetch(`${base_url}/api/skills/${skill_name}/${api}`, JSON.stringify({ [key]: bool }), "POST");

    const dura_limit = 30;
    const hp_limit = 888;
    const sp_limit = 300;
    const loss_hp_percent = 0.4;

    const hp_item_list = ["HP藥水 中", "HP藥水 小", "山豬肉", "牛肉", "牛奶", "兔肉", "狗狗肉", "高級兔肉", "牛鞭", "S級超稀有兔肉"];
    const sp_item_list = ["體力藥水 中", "體力藥水 小", "蜂蜜", "牛肉", "牛奶", "兔肉", "狗狗肉", "高級兔肉", "牛鞭", "S級超稀有兔肉", "山豬肉"];

    if (!parseInt(localStorage.fighting)) return;

    const hunt = async (type) => await template_fetch(`${base_url}/api/hunt`, JSON.stringify({ type }), "POST");

    const fight = { click: async () => hunt(1) };

    const weee = { click: async () => hunt(2) };


    let profile = await (await template_fetch(`${base_url}/api/profile`, null, "GET")).json();
    await complete_action(profile);

    profile = await (await template_fetch(`${base_url}/api/profile`, null, "GET")).json();
    let info = await (await template_fetch(`${base_url}/api/hunt/info`, null, "GET")).json();

    const zone = [profile.zoneName, profile.huntStage];
    const dura = info.equipments.filter((e) => e.typeName == "單手劍")?.[0]?.durability ?? 0;
    const armor_dura = info.equipments.filter((e) => ["大衣", "盔甲"].includes(e.typeName))?.[0]?.durability ?? 0;

    let hp = profile.hp;
    let sp = profile.sp;

    const zone_list = {
        "起始之鎮": [0, [0, 0], Infinity],
        "大草原": [1, [11, 30], 21],
        "猛牛原": [2, [1, 6], 6],
        "蘑菇園": [4, [1, 7], 6],
        "草原秘徑":[1001, [16, 21], 18]
    };

    const boss_list = {
        "大草原": [
            ["大衣", "盔甲"],
            ["盾牌"],
            ["單手劍"]
        ]
    };



    ["zone_flag", "path_flag", "rolled_flag"].forEach((flag) => { if(!localStorage[flag]) localStorage[flag] = 0; });

    const zone_flag = +localStorage.zone_flag;

    const farm_zone = ["猛牛原", "大草原"];
    const farm_path = ["", "草原秘徑", ""];

    if (!farm_path.includes(zone[0])) localStorage.path_flag = 0;

    const path = profile.extraPaths?.find((path) => farm_path.includes(path.name));

    if(path && (+!+localStorage.rolled_flag)) {
        const go_path = roll(100);
        localStorage.rolled_flag = 1;
        console.log(go_path);

        if (go_path > 30) {
            localStorage.path_flag = 1;
            await template_fetch(`${base_url}/api/path`, JSON.stringify({ "pathId": path.id }), "POST");
        }
    }



    const path_flag = +localStorage.path_flag;
    const zone_name = (path_flag ? farm_path : farm_zone)[zone_flag];
    const [zone_id, zone_range, armor_min] = zone_list[zone_name];
    const stage_now = parseInt(zone[1] ?? 0);

    if (profile.actionStatusCode != "free") return;


    const need_armor = stage_now >= armor_min;
    const de_armor_flag = !need_armor && (armor_dura != 0);
    const swap_armor_flag = need_armor && (armor_dura < dura_limit);

    if (de_armor_flag || swap_armor_flag) {
        await swap_equipment(["大衣", "盔甲"], [null], dura_limit, de_armor_flag);
    }


    if (dura > dura_limit && sp > sp_limit && hp > hp_limit && ((profile.canAttackTime - 1000*50) < Date.now())) {


        if (zone[0].match(zone_name)) {

            const boss_set = boss_list[zone_name];
            if (profile.bossRoom && profile.canChallengeBoss && boss_set) {


                for (let type_list of boss_set) {
                    await swap_equipment(type_list, ["green"], dura_limit);
                    await delay(587);
                }
                await delay(987);


                await template_fetch(`${base_url}/api/boss`, null, "POST");
                await delay(1487);

                await template_fetch(`${base_url}/api/equipment/unequipAll`, null, "POST");

                return;
            }

            const previous_hp = +localStorage.previous_hp;

            if (((previous_hp - hp) >= (hp_limit * loss_hp_percent)) || (stage_now >= zone_range[1])) {

                localStorage.zone_flag = (zone_flag + 1) % farm_zone.length;
                if (path_flag) localStorage.path_flag = 0;

                localStorage.rolled_flag = 0;

                await template_fetch(`${base_url}/api/zone/move/${zone_list[farm_zone[+localStorage.zone_flag]][0]}`, null, "POST");

                const items = await get_items();
                localStorage.name_to_id_list = JSON.stringify(Object.fromEntries(items.mines.map((m) => [m.name, m.id])));

                console.log(zone_name, items.consumables.reduce((s, e) => s + (e.available * (e.description.match(/(\d+) 體力/)?.[1] ?? 0)), 0));
            }
            else if (stage_now >= zone_range[0]) {
                await fight.click();
            }
            else {
                await weee.click();
            }
        }
        else {
            await template_fetch(`${base_url}/api/zone/move/${zone_id}`, null, "POST");
        }

        localStorage.previous_hp = hp;
    }

    if (hp == 0) {

        await respawn();

        return;
    }
    else if (hp <= hp_limit && !rest.disabled) {
        await rest(hp_item_list);
        await delay(587, 300);
    }

    if (sp <= sp_limit) {
        await rest(sp_item_list);
        await delay(587, 300);
    }

    if (dura <= dura_limit) {
        console.log("gay", dura, dura_limit);
        await swap_equipment(["單手劍"], [null], dura_limit);
        await delay(587, 300);

    }

}

async function respawn() {
    await template_fetch("https://api.swordgale.online/api/action/revive", null, "POST");
}

async function swap_equipment(type_list, color_list, dura_limit, unequip = false) {

    const equipments = (await get_items()).equipments
    .filter((e) => type_list.includes(e.typeName))
    .filter((e) => e.durability >= dura_limit)
    .filter((e) => e.equipped == unequip)
    .filter((e) => color_list.includes(e.color))
    .sort((a, b) => a.durability - b.durability);

    if (equipments.length) {
        await template_fetch(`https://api.swordgale.online/api/equipment/${equipments[0].id}/${unequip ? "un" : ""}equip`, null, "POST")
    }
    else if (!unequip){
        localStorage.fighting = 0;
        find_element("a", "砰砰乓乓").click();
    }


}

async function auto_smith() {
    const named = 1;

    if (!parseInt(localStorage.ponpon)) return;

    if ((Date.now() / 1000) % 86400 <= 1440) {
        localStorage.ponpon = 0;
        find_element("a", "開扁").click();
        return;
    }

    const profile = await (await template_fetch(`${base_url}/api/profile`, null, "GET")).json();
    const items = await get_items();
    localStorage.name_to_id_list = JSON.stringify(Object.fromEntries(items.mines.map((m) => [m.name, m.id])));

    if(profile.zoneName != "起始之鎮" && profile.actionStatusCode == "free"){
        await template_fetch(`${base_url}/api/zone/move/0`, null, "POST");
    }

    await complete_action(profile);

    if (profile.actionStatusCode == "free") {

        let name = `波卡一斧一個${hash_id(roll(2204355)).slice(roll(10))}`.slice(0, 12);

        const name_queue = JSON.parse(localStorage.name_queue);
        const id_list = JSON.parse(localStorage.name_to_id_list);

        if(name_queue.length) {
            name = name_queue.shift();
            localStorage.name_queue = JSON.stringify(name_queue);
        }
        //let name = new Array(12).fill().map(() => "wue".split("")[roll(2)]).join("");
        let material = JSON.stringify([{ id: id_list["兔皮"], quantity: 10 }]);//"(兔皮)"
        let type = "dagger";


        if (named) {

            const check_enough = (list) => list.every(([name, count]) => items.mines.find((mine) => mine.name == name)?.available >= count);
            const create_power = (list, alter) => {
                const result_list = list.filter((name) => items.mines.find((mine) => mine.name == name));
                if (result_list.length == 0) result_list.push(alter);
                return result_list;
            }


            const weapon_power = create_power([
                "綠水靈珠",
                "菇菇寶貝傘",
                "綠菇菇傘",
                "藍菇菇傘",
                "刺菇菇傘",
                "狗頭人尾巴"
            ], "S級兔皮");

            const armor_power = create_power([
                "綠水靈珠",
                "狗頭人尾巴",
                "菇菇寶貝傘",
                "沙茶醬"
            ], "蘑菇芽孢");

            const name_list = ["波卡一斧一個8f5dbf"];

            const recipes = [
                {
                    name: name_list[roll(name_list.length - 1)],
                    type: "sword",
                    material: [
                        ["狗頭人爪", 2],
                        ["水牛角", 2],
                        ["綠液球", 3],
                        ["大黃蜂的針", 1],
                        ["青竹絲牙", 3],
                        ["山豬獠牙", 4],
                        [weapon_power[roll(weapon_power.length - 1)], 1]
                    ]
                },
                /*{
                    name: name_list[roll(name_list.length - 1)],
                    type: "armor",
                    material: [
                        ["水牛皮", 12],
                        ["綠液球", 2],
                        [armor_power[roll(armor_power.length - 1)], 1]
                    ]
                }*/
            ].filter((r) => check_enough(r.material));

            if(recipes.length == 0) {
                localStorage.ponpon = 0;
                find_element("a", "開扁").click();
                return;
            }

            ({ name, type, material } = recipes[roll(recipes.length - 1)]);
            material = JSON.stringify(material.map(([name, count]) => ({ id: id_list[name], quantity: count })));
        }
        await template_fetch("https://api.swordgale.online/api/forge", `{\"equipmentName\":\"${name}\",\"selected\":${material},\"type\":"${type}"}`, "POST");

    }


}


async function get_items() {
    return await (await template_fetch("https://api.swordgale.online/api/items", null, "GET")).json();
}

async function complete_action(profile) {

    if (profile.canCompleteAction) {
        await template_fetch(`${base_url}/api/action/complete`, null, "POST");
    }

    if (profile.movingCompletionTime <= Date.now()) {
        await template_fetch(`${base_url}/api/zone/move/complete`, null, "POST");
    }

    if (profile.forgingCompletionTime <= Date.now()) {
        await template_fetch(`${base_url}/api/forge/complete`, null, "POST");
    }

}

async function template_fetch(url, body, method) {
    const header = {
        "accept": "*/*",
        "accept-language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7,ja;q=0.6,zh-CN;q=0.5,hi;q=0.4",

        "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "token": localStorage.token,
        "Referer": "https://swordgale.online/",
        "Referrer-Policy": "strict-origin-when-cross-origin"
    };

    if (body) {
        header["content-type"] = "application/json";
    }

    return await fetch(url, {
        "headers": header,
        "body": body,
        "method": method
    });
}

async function delay(ms, float = 300) {
    return await new Promise((resolve) => setTimeout(resolve, ms + roll(float)));
}

const H = [
    0x2bef,
    0x501c,
    0x0a38,
    0x1bf4,
    0x0c41,
    0xd22a,
    0xbb8b,
    0x0de1,
];

const C = [
    0x3de8,
    0xb1da,
    0x0599,
    0xee15,
    0x840f,
    0xdd9f,
    0xb23a,
    0x87f9,
    0x53a8,
    0x8502,
    0x9311,
    0xec82,
    0x0354,
    0xe5ee,
    0x63b5,
    0x5c70,
    0xbd08,
    0x874e,
    0xed2b,
    0x2fc9,
    0xa5b0,
    0x5f07,
    0xa14f,
    0xec79,
    0x1e5c,
    0xd72c,
    0x54b9,
    0x0e1e,
    0xf408,
    0xd13e,
    0xfbde,
    0xda78,
    0xaaee,
    0xfdf0,
    0xa94d,
    0x39ae,
    0x930e,
    0x9229,
    0x1098,
    0x06ae,
    0xde77,
    0xe946,
    0xd9dc,
    0xcf22,
    0x0974,
    0x6405,
    0x46e8,
    0xdce1,
    0x194e,
    0xe63d,
    0xd171,
    0x4581,
    0x5da1,
    0x6022,
    0x6379,
    0x8be2,
    0xdc05,
    0x58f7,
    0x4a3e,
    0xded9,
    0x0fae,
    0xb8d9,
    0x780a,
    0xb735
];

function hash_id(raw_data) {

    raw_data = raw_data.toString();
    let len = raw_data.length;
    let data = new Array(8).fill(0);

    for (let i = 0; i < len; i++) {
        data[i % 8] ^= raw_data[i].charCodeAt() * C[i % 64];
    }

    for (let i = 0; i < data.length; i++) {
        data[i] |= H[i];
    }

    for (let i = 0; i < data.length; i++) {
        let [a, b, c] = [
            data[(i + 7) % 8] >> 3,
            rotate(data[i], 7) << 2,
            rotate(data[(i + 3) % 8], 13),
        ];
        data[i] = Math.abs(a ^ b ^ c);
    }

    return data.map((e) => {
        let temp = (e & 0xffff).toString(16);
        return `${"0".repeat(4 - temp.length)}${temp}`;
    }).join("");

    function rotate(e, i) {
        return (e >> i) | (e << (16 - i));
    }
}

function check_local(key, default_val = 0) {
    if (!localStorage[key]) localStorage[key] = JSON.stringify(default_val);
}