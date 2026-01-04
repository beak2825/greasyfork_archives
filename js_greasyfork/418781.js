// ==UserScript==
// @name         DH3 Sigil Cycler
// @namespace    com.anwinity.dh3
// @version      1.0.3
// @description  Say that 10 times fast
// @author       Anwinity
// @match        dh3.diamondhunt.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418781/DH3%20Sigil%20Cycler.user.js
// @updateURL https://update.greasyfork.org/scripts/418781/DH3%20Sigil%20Cycler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SIGILS = [
        'snowflakeSigil',
        'batSigil',
        'candyCaneSigil',
        'spiderSigil',
        'carrotSigil',
        'snowmanSigil',
        'catSigil',
        'bunnySigil',
        'bluePartyHatSigil',
        'whitePartyHatSigil',
        'yellowPartyHatSigil',
        'greenPartyHatSigil',
        'redPartyHatSigil',
        'pinkPartyHatSigil',
        'treeSigil',
        'ghostSigil',
        'easterEggSigil',
        'santaHatSigil',
        'pumpkinSigil',
        'hardcoreSigil',
        'globalSigil',
        'combatSigil',
        'magicSigil',
        'miningSigil',
        'craftingSigil',
        'woodcuttingSigil',
        'farmingSigil',
        'brewingSigil',
        'fishingSigil',
        'cookingSigil',
        'chickenMonsterSigil',
        'ratMonsterSigil',
        'beeMonsterSigil',
        'snakeMonsterSigil',
        'entMonsterSigil',
        'thiefMonsterSigil',
        'bearMonsterSigil',
        'spiderMonsterSigil',
        'skeletonMonsterSigil',
        'lavaAlienMonsterSigil',
        'batMonsterSigil',
        'fireMageMonsterSigil',
        'boneHeadMonsterSigil',
        'mammaPolarBearMonsterSigil',
        'yetiMonsterSigil',
        'ghostMonsterSigil',
        'skeletonGhostMonsterSigil',
        'reaperMonsterSigil',
        'sharkMonsterSigil',
        'pufferFishMonsterSigil',
        'tridentSoldierMonsterSigil',
        'skeletonMonksMonsterSigil',
        'dungeonSpiderMonsterSigil',
        'stoneWomenMonsterSigil',
        'museumSigil',
        'treasureChestSigil',
        'goldEventSigil2',
        'silverEventSigil2',
        'bronzeEventSigil2',
        'eventSigil2',
        'goldEventSigil',
        'silverEventSigil',
        'bronzeEventSigil',
        'eventSigil'
    ];

    const SKILL_SIGILS = [
        'combatSigil',
        'magicSigil',
        'miningSigil',
        'craftingSigil',
        'woodcuttingSigil',
        'farmingSigil',
        'brewingSigil',
        'fishingSigil',
        'cookingSigil'
    ];

    let scope = {
        lastSet: null
    };

    function availableSigils() {
        return SIGILS.filter(s => {
            if(s == "globalSigil") {
                return getGlobalLevel() == 900;
            }
            if(s == "museumSigil") {
                return useMuseum();
            }
            let val = window[`var_${s}`];
            if(val && val!="0") {
                return true;
            }
            if(SKILL_SIGILS.includes(s)) {
                let skill = s.replace(/Sigil$/, "");
                let level = getLevel(window[`var_${skill}Xp`]);
                return level >= 100;
            }
            return false;
        });
    }

    function currentSigil() {
        return window.var_chatIcon || null;
    }

    function enabled() {
        return localStorage.getItem("cycle-sigil")=="1";
    }

    function useMuseum() {
        return localStorage.getItem("cycle-sigil-museum")=="1";
    }

    function tryChangeSigil() {
        if(enabled()) {
            let current = currentSigil();
            let options = availableSigils().filter(s => s!= current && s != scope.lastSet);
            if(options.length > 0) {
                let newSigil = options[Math.floor(Math.random() * options.length)];
                scope.lastSet = newSigil;
                let message = `CHAT_ICON=${newSigil}`;
                console.log(message);
                sendBytes(message);
            }
        }
    }

    function initUI(n) {
        if(n==0) {
            return;
        }
        if(!$("#dialogue-sigils").is(":visible")) {
            setTimeout(() => initUI(n-1), 100);
            return;
        }
        // the dialogue seems to reset itself every time and takes a while to show up, so gotta do this dumb fuckery ^

        if(!$("#sigil-cycler-enabled").length) {
            $("#dialogue-sigils-section > div:last-child").append('<br /><br /><input id="sigil-cycler-enabled" type="checkbox"/><label>Cycle Sigils</label><input id="sigil-cycler-museum" type="checkbox"/><label>Include Museum</label><br />');
            $("#sigil-cycler-enabled").prop("checked", enabled());
            $("#sigil-cycler-enabled").change(function() {
                let val = $(this).prop("checked");
                localStorage.setItem("cycle-sigil", val?1:0);
            });
            $("#sigil-cycler-museum").prop("checked", useMuseum());
            $("#sigil-cycler-museum").change(function() {
                let val = $(this).prop("checked");
                localStorage.setItem("cycle-sigil-museum", val?1:0);
            });
        }
    }

    function overrideFunctions() {
        const original_openChatSigilsDialogues = window.openChatSigilsDialogues;
        window.openChatSigilsDialogues = function() {
            original_openChatSigilsDialogues.apply(this, arguments);
            initUI(20);
        }

        const original_chatSend = window.chatSend;
        window.chatSend = function() {
            original_chatSend.apply(this, arguments);
            tryChangeSigil();
        }
    }

    function init() {
        if(!window.var_username) {
            setTimeout(init, 1000);
            return;
        }

        overrideFunctions();
    }

    $(init);

})();