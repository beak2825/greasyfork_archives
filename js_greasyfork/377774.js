// ==UserScript==
// @name         wargaming
// @namespace    bot
// @version      0.1
// @description  bot
// @author       Djonny
// @match        https://ru.wargaming.net/clans/wot/recruit_members*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377774/wargaming.user.js
// @updateURL https://update.greasyfork.org/scripts/377774/wargaming.meta.js
// ==/UserScript==

'use strict';


var testToSend = 'Привет БОЕЦ.Наш клан [COD] приглашает тебя к нам в команду!Для Вас:командный взвод-ПОДЫМАЕМ процент побед,БЕСПЛАТНЫЙ комуфляж,укреп район,плюшки-резервы для прокачки от клана.От вас:участие в развитии клана.Ждём Вас в наших рядах.';


var timer = setInterval(function(){

    if(document.getElementById('js-processing').className.includes('js-hidden'))
    {
        sleep(1000);
        start();

        clearInterval(timer);
    }



} , 100);



async function start(){


    var nextArrow = document.getElementsByClassName('paging_arrow paging_arrow__next js-page-next js-select-page')[0];

    if(nextArrow.className.includes('disabled'))
    {
        return;
    }

    var allRequests = document.getElementsByClassName('tbl-requests_tr__clickable');

    for(var i = 0; i < allRequests.length; i++)
    {
        allRequests[i].getElementsByClassName('request-status')[0].click();


        await sleep(500);

        if(document.getElementsByClassName('application-form_textarea')[0] == undefined)
        {
            continue;
        }
        document.getElementsByClassName('application-form_textarea')[0].value =testToSend;
        document.getElementsByClassName('btn-minor js-create')[0].click();

        await sleep(1500);

        document.getElementsByClassName('btn-minor js-dialog-close')[0].click();
        await sleep(100);


    }

nextArrow.click();
 await sleep(3000);
    start();

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}