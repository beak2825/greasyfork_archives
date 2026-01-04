// ==UserScript==
// @name        Shiny Colors Local Storage Setter
// @namespace       http://tampermonkey.net/
// @version     0.3
// @description     シャニマスの各ページ初回表示時に表示されるヘルプのポップアップ回避 & オーディションやフェスで倍速ボタン押さなくても3倍速
// @author      kood
// @match       https://shinycolors.enza.fun/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/441037/Shiny%20Colors%20Local%20Storage%20Setter.user.js
// @updateURL https://update.greasyfork.org/scripts/441037/Shiny%20Colors%20Local%20Storage%20Setter.meta.js
// ==/UserScript==

(function () {
    const version = parseFloat(GM_info.script.version);
    const _version = parseFloat(localStorage.getItem("_shinyColorsLocalStorageSetter"));

    if (isNaN(_version) || _version < version) {
        const keyObj1 = {
            deckEdit: "DeckEdit",
            evolution: "Evolution",
            fesIdolDetail: "FesIdolDetail",
            fesTop: "FesTop",
            fesDeck: "FesDeck",
            fesRewardUpdate: "FesRewardUpdate",
            fesTowerPanelSelect: "FesTowerPanelSelect",
            fesTowerDeck: "FesTowerDeck",
            fesTowerItem: "FesTowerItem",
            fesTowerAdvantage: "FesTowerAdvantage",
            fesTowerLevelUp: "FesTowerLevelUp",
            fesTowerLivePanel: "FesTowerLivePanel",
            fesTowerReset: "FesTowerReset",
            fesTowerItemTakeover: "FesTowerItemTakeover",
            gasha: "Gasha",
            homeDeck: "HomeDeck",
            idolDetail: "IdolDetail",
            ideaNote: "IdeaNote",
            idolRoad: "IdolRoad",
            invitation: "Invitation",
            jointFesTop: "JointFesTop",
            jointFesStageSelect: "JointFesStageSelect",
            jointFesReady: "JointFesReady",
            jointFesDeck: "JointFesDeck",
            jointFesFacility: "jointFesFacility",
            jointFesRanking: "jointFesRanking",
            jointFesTrophy: "jointFesTrophy",
            KnowHowBookList: "KnowHowBookList",
            mission: "Mission",
            produceItemPreparation: "ProduceItemPreparation",
            produceAbility: "ProduceAbility",
            produceBlock: "ProduceBlock",
            produceEvents: "ProduceEvents",
            produceGrowth: "ProduceGrowth",
            produceMusicSelect: "ProduceMusicSelect",
            produceMusicSupporterSelect: "ProduceMusicSupporterSelect",
            produceMusicInfo: "ProduceMusicInfo",
            produceMusicChange: "ProduceMusicChange",
            produceMusicOrder: "ProduceMusicOrder",
            produceMusicAssignment: "ProduceMusicAssignment",
            produceActionFourth: "ProduceActionFourth",
            produceActionFifth: "ProduceActionFifth",
            produceKnowHowBookPreparation: "ProduceKnowHowBookPreparation",
            produceKnowHowBookSelect: "ProduceKnowHowBookSelect",
            reserveIdol: "ReserveIdol",
            shop: "Shop",
            supportIdol: "SupportIdol",
            training: "Traning",
            workActivity: "WorkActivity",
            produceResultExSkill: "ProduceEndingExSkill",
            exSkill: "ExSkillList",
            producerDeskTop: "producerDeskTop",
            producerLevel: "producerLevel",
            jewelCounter: "jewelCounter"
        };

        const keyObj2 = {
            WING: "wing",
            FAN_MEETING: "fan_meeting",
            GRAD: "3rd_produce_area",
            FOURTH: "4th_produce_area",
            FIFTH: "5th_produce_area"
        };

        const values1 = Object.values(keyObj1);
        const values2 = Object.values(keyObj2);

        const firstTimeKeys = [...values1, ...values2];

        firstTimeKeys.forEach(function (firstTimeKey) {
            firstTimeKey = "TheFirstTimeOf" + firstTimeKey;
            localStorage.setItem(firstTimeKey, true);
        });

        const extraKeys = [
            "ProduceModeHelpAlreadyTransition",
            "TheFirstTimeOf4th_produce_area_ready",
            "TheFirstTimeOf5th_produce_area_ready"
        ];
        extraKeys.forEach(function (extraKey) {
            localStorage.setItem(extraKey, true);
        });

        // オーディションやフェスでボタン押さなくても3倍速
        localStorage.setItem("concertSpeed", 3);

        // _shinyColorsLocalStorageSetter をセット
        localStorage.setItem("_shinyColorsLocalStorageSetter", version);
    }

})();