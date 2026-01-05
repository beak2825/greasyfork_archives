// ==UserScript==
// @name        HWM_Find_Protocol_Page_By_Date
// @namespace   Рианти
// @description Находим страницу протокола по дате
// @include     http://www.heroeswm.ru/pl_transfers.php?id=*
// @include     http://www.heroeswm.ru/pl_warlog.php?id=*
// @include     http://www.heroeswm.ru/sklad_log.php?id=*
// @version     1
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/12741/HWM_Find_Protocol_Page_By_Date.user.js
// @updateURL https://update.greasyfork.org/scripts/12741/HWM_Find_Protocol_Page_By_Date.meta.js
// ==/UserScript==

var URL_Template = document.location.href.split('&')[0].split('#')[0] + '&page=';

var lookupProcess;

function requestPage (url, onloadHandler){
    console.log('loading: ', url);
    try{
        GM_xmlhttpRequest({
            overrideMimeType: 'text/plain; charset=windows-1251',
            synchronous: false,
            url: url,
            method: "GET",
            onload: function(response){
                document.getElementById('HWM_Find_By_date').innerHTML = 'Страниц обработано: ' + ++lookupProcess.totalPagesLoaded;
                onloadHandler(new DOMParser().parseFromString(response.responseText, 'text/html').documentElement);
            }
        });
    } catch (e) {
        console.log(e);
    }
}

function getPageId(dom){
    return parseInt(dom.querySelector('center > b > font[color="red"]').innerHTML) - 1;
}

function getEarliestDateFromPage(dom){
    var regexp = /(\d{2}-\d{2}-\d{2} \d{2}:\d{2})/g;
    var res, temp;
    while(res = regexp.exec(dom.innerHTML)) temp = res;
    return getDateFromHWMFormatString(temp[1]);
}

function findDateOnPage(dom, date){
    var regexp = /(\d{2}-\d{2}-\d{2} \d{2}:\d{2})/g;
    var res;
    while(res = regexp.exec(dom.querySelector('body > center:nth-child(2) > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1)').innerHTML)) if (getDateFromHWMFormatString(res[1]) == date) return 1;
    return 0;
}

function getDateFromHWMFormatString(string){
    if(string.split(' ').length == 1) string = string + ' 00:00';

    var t1 = string.split(' '),
        t2 = t1[0].split('-');
    return new Date('20' + t2[2] + '-' + t2[1] + '-' + t2[0] + 'T' + t1[1] + ':00Z');
}

function lookup(){
    if (lookupProcess.stopLoading) return;

    if (lookupProcess.result){
        loadResult(lookupProcess.lastPage - 1);
    } else if(lookupProcess.lastPage == -1){
        requestPage (URL_Template + 100000, function(dom){
            lookupProcess.lastPage = getPageId(dom);
            lookup();
        });
    } else if(lookupProcess.firstPage != lookupProcess.lastPage) {
        var midPage = Math.floor((lookupProcess.firstPage + lookupProcess.lastPage) / 2);
        requestPage (URL_Template + midPage, function(dom){
            try {
                var dateOnPage = getEarliestDateFromPage(dom);
                if (dateOnPage > lookupProcess.lookedDate) {
                    if (lookupProcess.firstPage == getPageId(dom)) lookupProcess.firstPage++;
                    else lookupProcess.firstPage = getPageId(dom);
                } else if (dateOnPage < lookupProcess.lookedDate) {
                    if (lookupProcess.lastPage == getPageId(dom)) lookupProcess.lastPage--;
                    else lookupProcess.lastPage = getPageId(dom);
                } else {
                    lookupProcess.lastPage = getPageId(dom);
                    lookupProcess.firstPage = lookupProcess.lastPage
                }
                lookup();
            } catch (e ){
                console.log(e);
            }
        });
    } else {
        lookupProcess.lastPage = lookupProcess.firstPage = lookupProcess.lastPage + 1;
        requestPage (URL_Template + lookupProcess.lastPage, function(dom){
            try {
                if (!findDateOnPage(dom, lookupProcess.lookedDate)){
                    lookupProcess.result = 1;
                }
                lookup();
            } catch (e ){
                console.log(e);
            }
        });
    }
}

function addQuickLink (label, id, action){
    try{
        var quickLinksTable = document.querySelector('body > center:nth-child(2) > center:nth-child(1)');
        if (quickLinksTable) {
            quickLinksTable.innerHTML = quickLinksTable.innerHTML + ' | <a class="pi" id="' + id + '" href="#">' + label + '</a>';
        } else {
            quickLinksTable = document.querySelector('body > center:nth-child(2) > table > tbody > tr');
            quickLinksTable.innerHTML = quickLinksTable.innerHTML + '<td> | <a class="pi" id="' + id + '" href="#">' + label + '</a></td>';
        }
        var elem = document.getElementById(id);
        elem.onclick = action;
    } catch (e) {
        console.log(e);
    }
}

addQuickLink ('Поиск по дате', 'HWM_Find_By_date',
    function(){
        var el = document.getElementById('HWM_Find_By_date');
        el.innerHTML = 'Страниц обработано: 0';
        el.onclick = function(){
            el.innerHTML = 'Остановлено';
            lookupProcess.stopLoading = 1;
        };
        main();
    });

function main(){
    lookupProcess = {
        firstPage: 0,
        lastPage: -1,
        result: 0,
        totalPagesLoaded: 0,
        stopLoading: 0,
        lookedDate: getDateFromHWMFormatString(prompt("Введите дату которую нужно найти в протоколе, в формате дд-мм-гг (например 19-04-15):"))
    };
    console.log('performing lookup on date: ' + lookupProcess.lookedDate);
    lookup();
}

function loadResult(pageId){
    document.location.href = URL_Template + pageId;
}