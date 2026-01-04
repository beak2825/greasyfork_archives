// ==UserScript==
// @name         Nuke Merc Script
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Nuke Mercenary Script
// @author       Jox[1714547]
// @license      MIT
// @match        https://www.torn.com/loader.php?sid=attackLog*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAsVBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAADAgEIBwIJCAILCQMODAQUEQUYFQcaFgcfGgggGwklIAotJgwyKg46MhA8MxBKPxRQRBZgUhthUhthUxt1ZCB9aiOEcCSIdCaQeyihiSyiiS21mjLBpDXFpzbGqDfHqTfIqjjTszrXtzzZuTzlw0DmxEDnxEDpxkHuy0LxzUNZTIHlAAAAD3RSTlMAAh4tMVtig4WRlqvq8v4ZRfBIAAABcElEQVQ4y4VT2ZKCMBBEReTSVhEX8T5BFMVb8/8ftokhJB5b2w9U9VFkMpnRNImSbpiWZRp6SfuGiu0ih2tXPuyy04CChlN+9at1vKFeVf0aVX5Um5Hai+8np470O6fEVxJVIDgQspKBFSGHAMhPKdfhU5/ce8Lv3Sk9+KjzSh0gIQwbEdg8aQI4z/s3MCEcY+6PczpBg/XDRjPLlV2L+a1dTrMmbNpfFyMisGCBRUFHcEuaDsSFsmeBfUFjQNcMIBXCOehHUT84C54ChmYCNyHM+xdCLv254DfA1Cx4xS/DiH2jsBA8WDSggAdUxWJHSPAjVMVkRaoJWuSLYLBrSnRnYTjrqorOGiWxZjWsFYE2ira6wODBAo+BVGz+WAJbfrmtHM1K/twcU3H9qVAcMTBPtI8icGzng1suRo5hWTSQLLlSVYcawVUGrgE+xhrDTAay4avPF6c5ilP6sLc0HjXfF0eunud9X73/l/fP9f8FWPxZz4MGj9YAAAAASUVORK5CYII=
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      nukefamily.org
// @connect      torn.com
// @downloadURL https://update.greasyfork.org/scripts/454479/Nuke%20Merc%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/454479/Nuke%20Merc%20Script.meta.js
// ==/UserScript==

(function() {

    'use strict';

    var NumOfLogs = 10;
    var autoRefresh = true;
    var useEmojis = true;

    var TORN_API_KEY = localStorage.getItem("jox-merc-torn-key");
    var NUKE_API_KEY = localStorage.getItem("jox-merc-nuke-key");

    let Container = document.querySelector('#attackLogContainer') || document.querySelector('#mainContainer');

    let div = document.createElement('div');
    div.classList.add('jox-merc-container');

    let btn1 = document.createElement('div');
    btn1.classList.add('jox-merc-button');
    btn1.innerHTML = '⚔️'
    btn1.addEventListener('click', SendLastLogToMercServer);

    let btn2 = document.createElement('div');
    btn2.classList.add('jox-merc-button');
    btn2.innerHTML = '➕'
    btn2.addEventListener('click', ShowMoreAttackLogs);

    let btn3 = document.createElement('div');
    btn3.classList.add('jox-merc-button');
    btn3.innerHTML = '♻️'
    btn3.addEventListener('click', RefreshAttackLogs);

    let text = document.createElement('div');
    text.id = 'jox-merc-text';
    text.classList.add('jox-merc-text');
    text.innerHTML = `${useEmojis ? '🚫' : 'no data'}`;

    let attackContainer = document.createElement('div');
    attackContainer.id = 'jox-merc-attack-container'
    attackContainer.classList.add('jox-merc-attack-container', 'jox-merc-hide');

    let attackList = document.createElement('ul');
    attackList.id = 'jox-merc-attack-list'

    let resetKeysLink = document.createElement('a')
    resetKeysLink.innerHTML = 'Reset Keys';
    resetKeysLink.href = '';
    resetKeysLink.classList.add('jox-merc-reset-button');
    resetKeysLink.addEventListener('click', ResetKeys);

    attackContainer.appendChild(attackList);
    attackContainer.appendChild(resetKeysLink);
    div.appendChild(btn1);
    div.appendChild(text);
    div.appendChild(btn2);
    div.appendChild(btn3);
    div.appendChild(attackContainer);

    Container.insertBefore(div, Container.children[0]);

    ShowLastAttack();
    PopulateMoreAttackLogs();

    if(window.location.href.startsWith('https://www.torn.com/loader.php?sid=attackLog')){
        if(autoRefresh){
            RefreshAttackLogs();
        }
    }

    function ResetKeys(){
        localStorage.removeItem("jox-merc-torn-key");
        localStorage.removeItem("jox-merc-nuke-key");
    }

    function AskForTornApiKey(){
        let key = prompt("Torn API Key:");
        if(key){
            localStorage.setItem("jox-merc-torn-key", key);
            TORN_API_KEY = localStorage.getItem("jox-merc-torn-key");
        }
    }

    function AskForNukeApiKey(){
        let key = prompt("NUKE Merc API Key:");
        if(key){
            localStorage.setItem("jox-merc-nuke-key", key);
            NUKE_API_KEY = localStorage.getItem("jox-merc-nuke-key");
        }
    }

    function RefreshAttackLogs(){
        if(!TORN_API_KEY){
            AskForTornApiKey();
        }
        console.log('Refreshing attack logs...');
        GM_xmlhttpRequest ( {
                method:     'GET',
                url:        'https://api.torn.com/user/?selections=attacks&key=' + TORN_API_KEY,
                onload:     function (responseDetails) {
                    // DO ALL RESPONSE PROCESSING HERE...

                    let AttackLog = [];
                    try {
                        let obj = JSON.parse(responseDetails.responseText);
                        let keys = Object.keys(obj.attacks).sort();
                        let i = 0;

                        while (i < NumOfLogs && keys){
                            let key = keys.pop();
                            let value = obj.attacks[key];
                            value.id = key;
                            AttackLog.push(value);
                            i++;
                        }
                    }
                    catch {
                        alert(responseDetails.responseText);
                        localStorage.setItem("jox-merc-attacklog", JSON.stringify(AttackLog));
                    }
                    localStorage.setItem("jox-merc-attacklog", JSON.stringify(AttackLog));

                    ShowLastAttack();
                    PopulateMoreAttackLogs();
                }
            });
    }

    function ShowLastAttack(){
        let AttackLog = JSON.parse(localStorage.getItem("jox-merc-attacklog"));
        let text = document.getElementById('jox-merc-text');

        if(AttackLog.length > 0){
            text.innerHTML = `${AttackLog[0].attacker_name} ${emojiForAttackResult(AttackLog[0].result)} ${AttackLog[0].defender_name}`;
            text.dataset.payload = JSON.stringify(AttackLog[0]);
        }
        else{
            text.innerHTML = `${useEmojis ? '🚫' : 'no data'}`;
        }
    }

    function ShowMoreAttackLogs(){
        document.getElementById('jox-merc-attack-container').classList.toggle('jox-merc-hide');
    }

    function PopulateMoreAttackLogs(){
        let AttackLog = JSON.parse(localStorage.getItem("jox-merc-attacklog"));
        let attackList = document.getElementById('jox-merc-attack-list');

        attackList.innerHTML = '';

        AttackLog.forEach( element => {
            let attackListItem = document.createElement('li');
            attackListItem.classList.add('jox-merc-li');
            attackListItem.innerHTML = `${element.attacker_name} ${emojiForAttackResult(element.result)} ${element.defender_name}`;
            attackListItem.dataset.payload = JSON.stringify(element);
            attackListItem.addEventListener('click', SendLogFromListToMercServer);
            attackList.appendChild(attackListItem);
        });
    }

    function SendLastLogToMercServer(){
        let text = document.getElementById('jox-merc-text');
        SendLogToMercServer(text.dataset.payload);
    }

    function SendLogFromListToMercServer(e){
        let data = e.target.dataset.payload;
        let obj = JSON.parse(data)
        let msg = `Send old log data for attack\n\n${obj.attacker_name} ${emojiForAttackResult(obj.result)} ${obj.defender_name}`
        if(confirm(msg)){
            SendLogToMercServer(data);
        }
    }

    function SendLogToMercServer(data){
        if(!NUKE_API_KEY){
            AskForNukeApiKey();
        }
        GM_xmlhttpRequest ( {
                method:     'POST',
                url:        'https://nukefamily.org/dev/mercservice.php?api=' + NUKE_API_KEY,
                data:       data, //Data is already string...
                onload:     function (responseDetails) {
                    // DO ALL RESPONSE PROCESSING HERE...
                    try {
                        let obj = JSON.parse(responseDetails.responseText);
                    }
                    catch {
                        alert(responseDetails.responseText);
                    }
                }
            });
    }

    function emojiForAttackResult(result){

        let emoji = `💥`
        let msg = result;
        switch(result){
            case 'Lost':
                msg = 'Lost to'
                emoji = `❌`;
                break;
            case 'Mugged':
                emoji = `💵`;
                break;
            case 'Attacked':
                emoji = `💥`;
                break;
            case 'Hospitalized':
                emoji = `🏥`;
                break;
            case 'Stalemate':
                emoji = `⌚`;
                break;
            case 'Assist':
                emoji = `🤝`;
                break;
            case 'Escape':
                emoji = `🏃`;
                break;
            case 'Special':
                emoji = `❤️`;
                break;
            case 'Arrested':
                emoji = `🕵`;
                break;
            case 'Timeout':
                emoji = `⌚`;
                break;
            case 'Looted':
                emoji = `🎲`;
                break;
            case 'None':
                emoji = `🚫`;
                break;
            case 'Interrupted':
                emoji = `🛑`;
                break;
            default:
                emoji = `💥`;
        }

        //return useEmojis ? `<span class='jox-merc-result'>${emoji}</span>` : msg;
        return useEmojis ? emoji : msg;
    }

    GM_addStyle ( `
    .jox-merc-button {
        height: 30px;
        line-height: 30px;
        width: 30px;
        margin: 0px 10px;
        text-align: center;
        font-size: 25px;
        cursor: pointer;
    }

    .jox-merc-result {
        line-height: 30px;
        font-size: 25px;
    }

    .jox-merc-container {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
    }

    .jox-merc-text {
        height: 25px;
        line-height: 25px;
        margin: 0px 10px;
    }

    .jox-merc-attack-container {
       width: 100%;
       display: flex;
       flex-direction: column;
       align-items: center;
    }

    .jox-merc-hide {
       display: none;
    }

    .jox-merc-li {
       padding: 5px;
       cursor: pointer
    }

    .jox-merc-reset-button {
       text-decoration: none;
    }
    `);

})();