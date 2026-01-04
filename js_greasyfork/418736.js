// ==UserScript==
// @name         超苦逼冒险者修改
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  修改:1 出行不耗时间、 2背包大小20、 3建造不消耗资源，消耗时间0.1、 4技能加成*100、 5所有采集点产出*1000采集时间0.1、 6溪流的树木产出水晶和地牢钥匙和魔王之血
// @author       lichqwer
// @match        http://kubitionadvanture.sinaapp.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418736/%E8%B6%85%E8%8B%A6%E9%80%BC%E5%86%92%E9%99%A9%E8%80%85%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/418736/%E8%B6%85%E8%8B%A6%E9%80%BC%E5%86%92%E9%99%A9%E8%80%85%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==
fake();

function fake() {
    PLAYER_STATE_INIT['hp']['amount'] = 999
    PLAYER_STATE_INIT['full']['amount'] = 999
    PLAYER_STATE_INIT['moist']['amount'] = 999
    PLAYER_STATE_INIT['ps']['amount'] = 999
    PLAYER_STATE_INIT['san']['amount'] = 999
    BAG_BASE_SIZE = 20;
    for (let i in PLACE_DATA) {
        PLACE_DATA[i]['timeNeed'] *= 0.01
        if (PLACE_DATA[i]['resource']) {
            let res = PLACE_DATA[i]['resource'];
            for (let j in PLACE_DATA[i]['resource']) {
                PLACE_DATA[i]['resource'][j]['initAmount'] = 999999;
                PLACE_DATA[i]['resource'][j]['timeNeed'] = 0.1;
                PLACE_DATA[i]['resource'][j]['circle'] = 999999;
                if (!$.isEmptyObject(PLACE_DATA[i]['resource'][j]['require'])) PLACE_DATA[i]['resource'][j]['require'] = {ps: 0.1}
                if (!$.isEmptyObject(PLACE_DATA[i]['resource'][j]['things'])) {
                    for (let k in PLACE_DATA[i]['resource'][j]['things']) {
                        PLACE_DATA[i]['resource'][j]['things'][k] *= 10000
                    }
                }
            }
        }
    }
    PLACE_DATA['river']['resource']['tree']['things']['crystal'] = 10000;
    PLACE_DATA['river']['resource']['tree']['things']['blood'] = 1;
    PLACE_DATA['river']['resource']['tree']['things']['dungeonKey'] = 1000;
    for (let i in BUILDING_DATA) {
        if (i !== 'build') {
            BUILDING_DATA[i]['require'] = {}
            BUILDING_DATA[i]['timeNeed'] = 0.1
        }
    }
    for (let i in BUILDING_UPDATE_DATA) {
        if (!$.isEmptyObject(BUILDING_UPDATE_DATA[i])) {
            for (let j in BUILDING_UPDATE_DATA[i]) {
                BUILDING_UPDATE_DATA[i][j]['timeNeed'] *= 0.1
                BUILDING_UPDATE_DATA[i][j]['require'] = {}
            }
        }
    }

    for (let i in SKILL_DATA) {
        if (!$.isEmptyObject(SKILL_DATA[i])) {
            if (i !== 'def') SKILL_DATA[i]['buff'] *= 100;
            else SKILL_DATA[i]['buff'] = 0.1;
        }
    }

    for (let i in MAKE_DATA) {
        if (!$.isEmptyObject(MAKE_DATA[i]) && MAKE_DATA[i]['timeNeed']) {
            MAKE_DATA[i]['timeNeed'] = 0.1;
            MAKE_DATA[i]['require'] = {wood: 1}
        }
    }
    for (let i in SCIENCE_DATA) {
        if (!$.isEmptyObject(SCIENCE_DATA[i]) && SCIENCE_DATA[i]['timeNeed']) {
            SCIENCE_DATA[i]['timeNeed'] = 0.1;
            SCIENCE_DATA[i]['require'] = {wood: 1}
        }
    }
    for (let i in MAGIC_DATA) {
        if (!$.isEmptyObject(MAGIC_DATA[i]) && MAGIC_DATA[i]['timeNeed']) {
            MAGIC_DATA[i]['timeNeed'] = 0.1;
            MAGIC_DATA[i]['require'] = {wood: 1}
        }
    }
}

