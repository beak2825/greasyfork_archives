// ==UserScript==
// @name        HWM_Accept_And_Dress_All_Transfers
// @namespace   Рианти
// @description Прием и автоодевание всех подвешенных в инвентарь артефактов в один клик
// @include     http://www.heroeswm.ru/inventory.php*
// @version     1
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/12716/HWM_Accept_And_Dress_All_Transfers.user.js
// @updateURL https://update.greasyfork.org/scripts/12716/HWM_Accept_And_Dress_All_Transfers.meta.js
// ==/UserScript==

var parent = document.querySelector('td[class="wb"][width="350"] > table > tbody');
if (parent.querySelector('a[href*="trade_accept.php?tid="]')) {
    var edited = parent.querySelector('a[id="trade_cancel"]').parentNode;
    edited.innerHTML = '<a style="float: left" title="Одевается только крафт" href="javascript:void(0);" id="acceptAllArtsControl"><b>Принять и одеть все</b></a>' + edited.innerHTML;
    document.getElementById('acceptAllArtsControl').onclick = collectLists;

    var acceptList = [];
    var dressList = [];
}
function collectLists(){
    var allArts = parent.querySelectorAll('a[href*="trade_accept.php?tid="]');
    var artIdLink;
    for(var i = 0 ; i < allArts.length; i++){
        acceptList.push(allArts[i].href);
        artIdLink = allArts[i].parentElement.parentElement.previousSibling.querySelector('a[href*="&uid="]');
        if(artIdLink) dressList.push(artIdLink.href.match(/uid=(\d+)/)[1]);
    }
    acceptAllArts();
}

function acceptAllArts(){
    if (!acceptList.length){
        dressAllArts();
        return;
    }
    requestPage (acceptList.pop(), function(dom){
        acceptAllArts();
    });
}

function dressAllArts(){
    if (!dressList.length){
        document.location.reload();
        return;
    }
    var link = document.location.protocol + '//' + document.location.host + document.location.pathname + '?dress=' + dressList.pop() + '&js=1&rand=' + Math.random() * 1000000;
    requestPage (link, function(dom){
        dressAllArts();
    });
}

function requestPage (url, onloadHandler){
    console.log('loading: ', url);
    try{
        GM_xmlhttpRequest({
            overrideMimeType: 'text/plain; charset=windows-1251',
            synchronous: false,
            url: url,
            method: "GET",
            onload: function(response){
                onloadHandler(new DOMParser().parseFromString(response.responseText, 'text/html').documentElement);
            },
            onerror: function(){ setTimeout( function() { requestPage (url, onloadHandler) }, 500 ) },
            ontimeout: function(){ requestPage (url, onloadHandler) },
            timeout: 5000
        });
    } catch (e) {
        console.log(e);
    }
}