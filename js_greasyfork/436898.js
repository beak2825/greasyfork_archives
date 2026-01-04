// ==UserScript==
// @name         [HWM] NextLeadersMonsters
// @namespace    [HWM] NextLeadersMonsters
// @version      0.4.2
// @description  Скрипт добавляет информацию сколько осталось боёв до выпадения существ на главную страницу в новом интерфейсе
// @author       Komdosh
// @include      http*://*.heroeswm.ru/home.php*
// @include      http*://*.heroeswm.ru/war.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436898/%5BHWM%5D%20NextLeadersMonsters.user.js
// @updateURL https://update.greasyfork.org/scripts/436898/%5BHWM%5D%20NextLeadersMonsters.meta.js
// ==/UserScript==

var SAVED_MONSTERS_BATTLES_LEFT = 'SAVED_MONSTERS_BATTLES_LEFT_V2';

if(/war.php/.test(location.href)){
    localStorage.removeItem(SAVED_MONSTERS_BATTLES_LEFT);
    return;
}

var leadersGuildInfoDiv = document.createElement('div');
leadersGuildInfoDiv.className += "home_container_block";
leadersGuildInfoDiv.style="align-items: left;"


var leadersGuildInfoHeader = document.createElement('div');
leadersGuildInfoHeader.className += "global_container_block_header global_a_hover";
leadersGuildInfoHeader.innerHTML = '<a href="/leader_guild.php">\u0413\u0438\u043B\u044C\u0434\u0438\u044F \u041B\u0438\u0434\u0435\u0440\u043E\u0432</a>'; //Гильдия Лидеров
leadersGuildInfoDiv.append(leadersGuildInfoHeader);

var leadersGuildInfoContentDiv = document.createElement('div');
leadersGuildInfoContentDiv.className += "home_inside_margins global_a_hover";
leadersGuildInfoDiv.append(leadersGuildInfoContentDiv);

var workerGuild = document.querySelector(".home_work_block");

workerGuild.after(leadersGuildInfoDiv);
var friendsBlock = document.querySelector(".home_friends_block");

if(localStorage.getItem(SAVED_MONSTERS_BATTLES_LEFT) != null){
    var span = beforeMonstersInfo(JSON.parse(localStorage.getItem(SAVED_MONSTERS_BATTLES_LEFT)));
    var br = document.createElement('br')
    leadersGuildInfoContentDiv.append(br);
    refreshLink([span,br]);
} else{
    var span = document.createElement('span');
    span.innerText = '\u0414\u043B\u044F \u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u0430 \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u0438 \u043E\u0431\u043D\u043E\u0432\u0438\u0442\u0435 \u0434\u0430\u043D\u043D\u044B\u0435'; //Для просмотра информации обновите данные
    leadersGuildInfoContentDiv.append(span);
    var br = document.createElement('br');
    leadersGuildInfoContentDiv.append(br);
    refreshLink([span, br]);
}
//***************************************************************************
function refreshLink(contents){
    var refreshLink = document.createElement('a');
    refreshLink.href = '#';
    refreshLink.onclick = ()=>{
        for(var content of contents){
            content.remove();
        }
        var analysisSpan = document.createElement('span');
        analysisSpan.innerText = '\u0410\u043D\u0430\u043B\u0438\u0437 \u0431\u043E\u0451\u0432...';//Анализ боёв...
        leadersGuildInfoContentDiv.append(analysisSpan);
        refreshLink.remove();
        requestWarlogInfo().then(leadersInfo=>{
            analysisSpan.remove();
            localStorage.setItem(SAVED_MONSTERS_BATTLES_LEFT, JSON.stringify(leadersInfo));
            beforeMonstersInfo(leadersInfo);
        });
    };
    refreshLink.innerText = '\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C'; // Обновить
    refreshLink.style = 'text-decoration: underline;';
    leadersGuildInfoContentDiv.append(refreshLink);
}
//***************************************************************************
function beforeMonstersInfo(leadersInfo){
    var beforeMonstersInfoDiv = document.createElement('div');
    var beforeMonstersSpan = document.createElement('span');
    beforeMonstersSpan.innerText = '\u041E\u0441\u0442\u0430\u043B\u043E\u0441\u044C \u0431\u043E\u0451\u0432 \u0434\u043E \u043F\u0440\u0438\u0441\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u0438\u044F \u0441\u0443\u0449\u0435\u0441\u0442\u0432: '+leadersInfo.battlesLeft;
    beforeMonstersInfoDiv.append(beforeMonstersSpan);
    beforeMonstersInfoDiv.append(document.createElement('br'));
    var avgAmmunitionScore = document.createElement('span');
    avgAmmunitionScore.innerText = '\u0421\u0440\u0435\u0434\u043D\u0435\u0435 \u041E\u0410: '+Math.floor(leadersInfo.ammunitionScore/(5-leadersInfo.battlesLeft));
    beforeMonstersInfoDiv.append(avgAmmunitionScore);
    leadersGuildInfoContentDiv.append(beforeMonstersInfoDiv);
    return beforeMonstersInfoDiv;
}
//***************************************************************************
function requestWarlogInfo() {
    var userInfo = getUserInfo();
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', encodeURI("/pl_warlog.php?id="+userInfo.id));
        xhr.overrideMimeType('text/xml; charset=windows-1251');
        xhr.onload = async function(){
            if (xhr.status === 200)
            {
                //  setInterval();
                var div = document.createElement( 'div' );
                div.id = 'kom-smiths';
                div.style.display = 'none';
                div.innerHTML = xhr.responseText;
                document.getElementsByTagName('body')[0].appendChild( div );
                var respDoc = document.getElementsByTagName('body')[0].lastChild;
                var allLastWarId = Array.from(respDoc.querySelectorAll("a[href*='warlog.php?warid']")).map(it=>it.href.split("warid=").slice(1,2)[0]);


                var withoutMonstersCounter = 0;
                var ammunitionScore = 0;
                for(var warId of allLastWarId){
                    const battleInfo = await loadLastTurn(userInfo.name,warId);
                    if(battleInfo == null){
                        continue;
                    }

                    if(battleInfo.monstersAdded){
                        resolve({battlesLeft: 5-withoutMonstersCounter, ammunitionScore: ammunitionScore});
                        return;
                    } else {
                         ++withoutMonstersCounter;
                        ammunitionScore+=battleInfo.ammunitionScore;
                    }
                }

                respDoc.remove();
            }
            else {
                console.log('Request failed.  Returned status of ' + xhr.status);
            }
        };
        xhr.send();
    });
}
//*******************
async function loadLastTurn(name, warId){
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', encodeURI("/battle.php?lastturn=-3&warid="+warId));
        xhr.onload = function(){
            if (xhr.status === 200)
            {
                if(isMonstersAdded(name, xhr.responseText)){ // в резерв
                    resolve({monstersAdded: true, ammunitionScore: 0});
                }
                if(/\u0432\u043E\u0441\u043A\u0440\u0435\u0448\u0435\u043D\u043E \u043E\u0442\u0440\u044F\u0434\u043E\u0432/.test(xhr.responseText)){ // воскрешено отрядов
                    resolve(null);
                }

                resolve({monstersAdded: false, ammunitionScore: getAmmunitionScore(name, xhr.responseText)});
            }
            else {
                console.log('Request failed.  Returned status of ' + xhr.status);
                resolve(null);
            }
        };
        xhr.send();
    });
}
//*******************
function getAmmunitionScore(name, lastTurnText){
    var results = lastTurnText.match(new RegExp('\\|'+name+'.+?day', 'gi'));
    if(results == null || results.length == 0){
        return 0;
    }

    var info = results[0];
    var ammunitionScore = parseInt(info.split('exp1')[1].split('day')[0]);

    return ammunitionScore;
}
//*******************
function isMonstersAdded(name, respText){
    var results = respText.match(new RegExp(name+'.+?<br \/>', 'gi'));
    if(results == null || results.length==0){
        return false;
    }

    var value = results[0];

    return /\u0432 \u0440\u0435\u0437\u0435\u0440\u0432/.test(value);
}
//*******************
function getUserInfo(){
    var infoLink = document.querySelector('center>a[href^=pl_info');
    var infoLinkValues = infoLink.href.split("id=");

    return {id: infoLinkValues[infoLinkValues.length-1], name: infoLink.innerText};
}