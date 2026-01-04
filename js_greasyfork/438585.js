// ==UserScript==
// @name         NUKE Faction Spys
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Spy them all :P
// @author       Jox [1714547]
// @match        https://www.torn.com/factions.php*
// @match        https://www.torn.com/profiles.php*
// @match        https://www.torn.com/loader.php?sid=attack*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      nukefamily.org
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/438585/NUKE%20Faction%20Spys.user.js
// @updateURL https://update.greasyfork.org/scripts/438585/NUKE%20Faction%20Spys.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /************ SETTINGS ************/

    var hidePopupImage = false;
    var hideFactionDescription = false;

    /************ SETTINGS ************/


    if(hidePopupImage){
        GM_addStyle(`
            #profile-mini-root>.mini-profile-wrapper>div:nth-child(2) { display: none !important;}
            .profile-mini-root .buttons-list {max-width: 100% !important;}
        `);
    }

    if(hideFactionDescription){
        GM_addStyle(`.faction-description {display: none !important;}`)
    }

    var savedData = null;
    var update = 1;

    window.onload = start;

    function start(){
        if(window.location.href.startsWith('https://www.torn.com/loader.php?sid=attack')){
            setInterval(chainOnAttackPage, 750);
        }
        else{
            loadData();
            setInterval(watchForPopup, 750);
            setInterval(watchForWarList, 750);
        }
    }


    function chainOnAttackPage(){
        let chainCounter = document.querySelector('.label-container-ChainIcon div span');
        const chain = parseInt(chainCounter.innerHTML);

        let chainAlerts = [
            99,		98,		97,		96,		95,		94,		93,		92,		91,		90,
            249,	248,	247,	246,	246,	244,	243,	242,	241,	240,
            499,	498,	497,	496,	495,	494,	493,	492,	491,	490,
            999,	998,	997,	996,	995,	994,	993,	992,	991,	990,
            2499,	2498,	2497,	2496,	2495,	2494,	2493,	2492,	2491,	2490,
            4999,	4998,	4997,	4996,	4995,	4994,	4993,	4992,	4991,	4990,
            9999,	9998,	9997,	9996,	9995,	9994,	9993,	9992,	9991,	9990,
            24999,	24998,	24997,	24996,	24995,	24994,	24993,	24992,	24991,	24990,
            49999,	49998,	49997,	49996,	49995,	49994,	49993,	49992,	49991,	49990,
            99999,	99998,	99997,	99996,	99995,	99994,	99993,	99992,	99991,	99990
        ];

        if(!isNaN(chain) && chainAlerts.includes(chain)){
            chainCounter.classList.add('jox-attack-chain-watch')
            GM_addStyle(`
            .jox-attack-chain-watch {
                color: red;
                animation: blink 1s step-start 0s infinite;
            }

            @keyframes blink {
                50% {
                    opacity: 0.0;
                }
           }
            `);
        }
    }

    function loadData(){
        try{
            savedData = JSON.parse(localStorage.localSpy || '{"spy": {"status":false,"message":"Data missing","user":{"strength":0,"speed":0,"defense":0,"dexterity":0,"total":0},"spies":[]}, "timestamp" : 0}');
        }
        catch(error){
            console.error(error);
            alert('error loading saved data, please reload page!');
        }

        if(Date.now() - savedData.timestamp > update * 60 * 1000){ //minutes * seconds * miliseconds
            console.log('Update blacklist...');
            updateSpys();
        }
        else{
            displaySpy();
        }
    }

    function updateSpys(){
        GM_xmlhttpRequest ( {
            method:     'GET',
            url:        `https://nukefamily.org/dev/spies.php`,
            headers:    {'Cookie': document.cookie},
            onload:     function (responseDetails) {
                // DO ALL RESPONSE PROCESSING HERE...
                //console.log('GET Respnse', responseDetails.responseText);
                //alert(responseDetails.responseText);
                //updateBlackList();

                try{
                    var s = JSON.parse(responseDetails.responseText);
                    var dataToSave = {};
                    dataToSave.spy = s;
                    dataToSave.timestamp = Date.now();
                    localStorage.localSpy = JSON.stringify(dataToSave);
                    console.log('Spy list updated');
                    displaySpy();
                }
                catch(error){
                    console.log(error);
                }
            }
        });
    }

    function displaySpy(){
        if(window.location.href.startsWith('https://www.torn.com/factions.php')){
            loopFactionMembers();
        }

        if(window.location.href.startsWith('https://www.torn.com/profiles.php')){
            setTimeout(showSpyOnProfile,500);
        }
    }

    function showSpyOnProfile(){
        let player = document.querySelector('.basic-information .user-information-section+div>span').innerHTML;
        let id = player.replace(/(.+\[)(\d+)(\])/gm, '$2');
        let container = document.querySelector('.profile-status .profile-container');

        let div = document.createElement('div');

        const found = savedData.spy.spies.find(element => element.player_id == id);
        //console.log(found);
        if(found){
            let yourStr = savedData.spy.user.strength;
            let yourDef = savedData.spy.user.defense;
            let yourSpd = savedData.spy.user.speed;
            let yourDex = savedData.spy.user.dexterity;
            let yourTot = savedData.spy.user.total;
            let spyStr = found.strength;
            let spyDef = found.defense;
            let spySpd = found.speed;
            let spyDex = found.dexterity;
            let spyTot = found.total;
            let spyDate = found.timestamp;
            let deltaStr = yourStr - spyStr;
            let deltaDef = yourDef - spyDef;
            let deltaSpd = yourSpd - spySpd;
            let deltaDex = yourDex - spyDex;
            let deltaTot = yourTot - spyTot;

            div.innerHTML = `<span class="str-def"><span>Str:${shortenNumber(spyStr)}</span> Def:${shortenNumber(spyDef)}</span> <span class="spd-dex">Spd:${shortenNumber(spySpd)} Dex:${shortenNumber(spyDex)}</span> <span class="tot-lnk"><span style="font-weight: bolder">Total:${shortenNumber(spyTot)}</span> ${ageText(spyDate)}</span>`;
            div.style = `padding: 5px; word-spacing: 1em; line-height: 1.5; text-align: right;`
            container.appendChild(div);
        }
    }

    function loopFactionMembers(){
        let list = document.querySelector('.members-list .table-body');
        if(list && list.childNodes){
            for(var i=0; i < list.childNodes.length; i++){
                if(list.childNodes[i].childNodes.length > 0){
                    //console.log(list.childNodes[i]);
                    let nameElement = list.childNodes[i].querySelector('a[href*="profiles"]');
                    if(nameElement){
                        let id = list.childNodes[i].querySelector('a[href*="profiles"]').href.replace('https://www.torn.com/profiles.php?XID=', '');
                        let div = document.createElement('div');

                        const found = savedData.spy.spies.find(element => element.player_id == id);
                        //console.log(found);
                        if(found){
                            let yourStr = savedData.spy.user.strength;
                            let yourDef = savedData.spy.user.defense;
                            let yourSpd = savedData.spy.user.speed;
                            let yourDex = savedData.spy.user.dexterity;
                            let yourTot = savedData.spy.user.total;
                            let spyStr = found.strength;
                            let spyDef = found.defense;
                            let spySpd = found.speed;
                            let spyDex = found.dexterity;
                            let spyTot = found.total;
                            let spyDate = found.timestamp;
                            let deltaStr = yourStr - spyStr;
                            let deltaDef = yourDef - spyDef;
                            let deltaSpd = yourSpd - spySpd;
                            let deltaDex = yourDex - spyDex;
                            let deltaTot = yourTot - spyTot;

                            div.innerHTML = `<span class="str-def"><span>Str:${shortenNumber(spyStr)}</span> Def:${shortenNumber(spyDef)}</span> <span class="spd-dex">Spd:${shortenNumber(spySpd)} Dex:${shortenNumber(spyDex)}</span> <span class="tot-lnk"><span style="font-weight: bolder">Total:${shortenNumber(spyTot)}</span> ${ageText(spyDate)} <a style="color: var(--default-blue-color); text-decoration: none;" href="/loader.php?sid=attack&user2ID=${id}">Attack</a></span>`;
                            div.style = `border-bottom: 1px solid #ccc; border-bottom-color: var(--default-panel-divider-outer-side-color); padding: 5px; word-spacing: 1em; line-height: 1.5; text-align: right;`
                            insertAfter(div, list.childNodes[i]);
                        }
                    }
                }
            }
        }
    }

    function watchForPopup() {
        let myDiv = document.querySelector('#jox-popup-div');
        if(!myDiv){
            let playerLink = document.querySelector('#profile-mini-root div>a[href*="profiles"]');
            if(playerLink){
                let popup = document.querySelector('#profile-mini-root .mini-profile-wrapper');
                popup.style.flexWrap = "wrap";
                let id = playerLink.href.replace('https://www.torn.com/profiles.php?XID=', '');
                let div = document.createElement('div');
                div.id = 'jox-popup-div';

                const found = savedData.spy.spies.find(element => element.player_id == id);
                //console.log(found);
                if(found){
                    let yourStr = savedData.spy.user.strength;
                    let yourDef = savedData.spy.user.defense;
                    let yourSpd = savedData.spy.user.speed;
                    let yourDex = savedData.spy.user.dexterity;
                    let yourTot = savedData.spy.user.total;
                    let spyStr = found.strength;
                    let spyDef = found.defense;
                    let spySpd = found.speed;
                    let spyDex = found.dexterity;
                    let spyTot = found.total;
                    let spyDate = found.timestamp;
                    let deltaStr = yourStr - spyStr;
                    let deltaDef = yourDef - spyDef;
                    let deltaSpd = yourSpd - spySpd;
                    let deltaDex = yourDex - spyDex;
                    let deltaTot = yourTot - spyTot;

                    div.innerHTML = `<span class="str-def"><span>Str:${shortenNumber(spyStr)}</span> Def:${shortenNumber(spyDef)}</span> <span class="spd-dex">Spd:${shortenNumber(spySpd)} Dex:${shortenNumber(spyDex)}</span> <span class="tot-lnk"><span style="font-weight: bolder">Total:${shortenNumber(spyTot)}</span> ${ageText(spyDate)}</span>`;
                    div.style = `padding: 5px; word-spacing: 1em; line-height: 1.5; text-align: right;`
                    popup.appendChild(div);
                }
            }
        }
    }

    function watchForWarList() {
        let mySpan = document.querySelector('.jox-warlist-span');
        if(!mySpan){

            GM_addStyle(`.jox-warlist-span {padding-top: 2px; padding-left: 5px; color: red}`);
            let playerLinks = document.querySelectorAll('#react-root .descriptions .faction-war .enemy-faction .members-list .member a[href*="profiles.php"]');
            for(const playerLinkindex in playerLinks){
                let playerLink = playerLinks[playerLinkindex];
                let id = playerLink.href.replace('https://www.torn.com/profiles.php?XID=', '');
                let span = document.createElement('span');
                span.classList.add('jox-warlist-span');

                const found = savedData.spy.spies.find(element => element.player_id == id);
                //console.log(found);
                if(found){
                    let spyTot = found.total;

                    span.innerHTML = ` ${shortenNumber(spyTot)}`;

                    playerLink.appendChild(span);

                }
            }
        }
    }

    function insertAfter(newNode, existingNode) {
        existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
    }

    function ageText(age){
        let now = Date.now() / 1000;
        let dateDiff = now - age;
        let days = Math.floor(dateDiff / 60 / 60 / 24);
        let text = `<span style="word-spacing: initial;"> ${days} day${days == 1 ? '' : 's'} ago</span>`;
        return text;
    }

    function shortenNumber (num, decimalPlaces) {
        var str,
            suffix = '',
            negative = false;

        decimalPlaces = decimalPlaces || 2;
        num = +num;

        if(num < 0){
            num *= -1;
            negative = true;
        }

        var factor = Math.pow(10, decimalPlaces);


        //99999 -> 99.9K

        if (num < 1e3) {
            str = num;
        } else if (num < 1e6) {
            str = Math.floor(num / (1e3 / factor)) / factor;
            suffix = 'K';
        } else if (num < 1e9) {
            str = Math.floor(num / (1e6 / factor)) / factor;
            suffix = 'M';
        } else if (num < 1e12) {
            str = Math.floor(num / (1e9 / factor)) / factor;
            suffix = 'B';
        } else if (num < 1e15) {
            str = Math.floor(num / (1e12 / factor)) / factor;
            suffix = 'T';
        }
        return (negative ? '-' : '') + str + suffix;
}
})();