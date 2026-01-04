// ==UserScript==
// @name        HWM_Rented_Arts
// ==UserScript==
// @name        HWM_Rented_Arts
// @namespace   Zeleax
// @description Скрывает артефакты находящиеся на хранении и позволяет в один клик забрать нескрытые артефакты, доступные для возврата
// @include /https:\/\/(www.heroeswm.ru|qrator.heroeswm.ru|178.248.235.15|www.lordswm.com|my.lordswm.com)\/(arts_arenda.php|inventory.php)/
// @version     1.8
// @license MIT
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/371580/HWM_Rented_Arts.user.js
// @updateURL https://update.greasyfork.org/scripts/371580/HWM_Rented_Arts.meta.js
// ==/UserScript==
// скрывать всех указанных ниже игроков на странице артов сданных в аренду
var HidePlayers = ['Mr_SkauT','Сержант530','Alexis19923','Samohin017','Cle99','Лесные ягоды','Sekir'];

// GM functions
if (typeof GM_getValue != 'function') {this.GM_getValue=function (key,def) {return localStorage[key] || def;};this.GM_setValue=function (key,value) {return localStorage[key]=value;};	this.GM_deleteValue=function (key) {return delete localStorage[key];};}

if(/arts_arenda/.test(window.location.href))
{
    var urlArr=[];
    var cntVisible=0;
    var returnCnt=0, hiddenCnt=0;
    var el, _row;

    var list = getL( "//a[contains(@href, 'pl_info.php')]");
    for (var i=list.snapshotLength-1 ; i >=0; i-- )
    {
        _row=list.snapshotItem(i).parentNode.parentNode.parentNode;

        if(HidePlayers.indexOf(list.snapshotItem(i).textContent) > -1)
        {
            _row.style.display = 'none';
            hiddenCnt++;
        }
        else
        {
            cntVisible++;

            el=getE(".//a[contains(@href, 'arts_arenda.php?art_return')]", _row);
            if (el)
            {
                returnCnt++;
                urlArr.push(el.href);
            }
        }
    }
    if(GM_getValue('HWM_Rented_Arts.hiddenCnt')!=hiddenCnt)
    {
        GM_setValue('HWM_Rented_Arts.hiddenCnt', hiddenCnt);
        console.log('Сохранили HWM_Rented_Arts.hiddenCnt='+hiddenCnt);
    }

    document.body.innerHTML = document.body.innerHTML.replace('Артефакты в аренде:', 'Артефакты в аренде: '+cntVisible+' (+'+hiddenCnt+' на хранении) <button type="button" name="getBackMyArts" style="display:none">Test</button> ');

    if(returnCnt>0)
    {
        el=document.getElementsByName('getBackMyArts')[0];
        el.textContent ='Забрать арты: '+returnCnt;
        el.onclick =function() {doAction();}
        el.style.display="initial";
    }
}
else if(/inventory/.test(window.location.href))
{
    var hiddenArtsCnt= GM_getValue('HWM_Rented_Arts.hiddenCnt');
    if(!hiddenArtsCnt) hiddenArtsCnt=0;

    el=getE("//div[@class='inv_scroll_content_inside' and contains(text(),'Предметы в аренде')]");
    if(el)
    {
        var res=/\((\d+)\)/.exec(el.innerText);
        el.innerText=el.innerText.replace(/\((\d+)\)/,'('+(parseInt(res[1],10)-hiddenArtsCnt)+')');
        el.title='На хранении: '+hiddenArtsCnt+' шт.'
    }
}

function doAction() // Возврат артов
{
   for (var i=0 ; el=urlArr[i]; i++ )
      func_getDocumentFromUrl(el); // забираем арты !!!

   location.reload();
}

// получает документ по заданному URL
function func_getDocumentFromUrl(urlToLoad){console.log('Load data from url: '+urlToLoad); var req=new XMLHttpRequest(); req.open("GET", urlToLoad, false); req.overrideMimeType('text/xml; charset=windows-1251'); req.send(null); var parser = new DOMParser(); return parser.parseFromString(req.responseText, "text/html"); }

// доступ по xpath
function getE(xpath,el,docObj){return (docObj?docObj:document).evaluate(xpath,(el?el:(docObj?docObj.body:document.body)),null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;}
function getL(xpath,el,docObj){return (docObj?docObj:document).evaluate(xpath,(el?el:(docObj?docObj.body:document.body)),null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);}
// @namespace   Zeleax
// @description Скрывает артефакты находящиеся на хранении и позволяет в один клик забрать нескрытые артефакты, доступные для возврата
// @include /https:\/\/(www.heroeswm.ru|qrator.heroeswm.ru|178.248.235.15|www.lordswm.com)\/(arts_arenda.php|inventory.php)/
// @version     1.7
// @grant       none
// ==/UserScript==
// скрывать всех указанных ниже игроков на странице артов сданных в аренду
var HidePlayers = ['Mr_SkauT','Сержант530'];

// GM functions
if (typeof GM_getValue != 'function') {this.GM_getValue=function (key,def) {return localStorage[key] || def;};this.GM_setValue=function (key,value) {return localStorage[key]=value;};	this.GM_deleteValue=function (key) {return delete localStorage[key];};}

if(/arts_arenda/.test(window.location.href))
{
    var urlArr=[];
    var cntVisible=0;
    var returnCnt=0, hiddenCnt=0;
    var el, _row;

    var list = getL( "//a[contains(@href, 'pl_info.php')]");
    for (var i=list.snapshotLength-1 ; i >=0; i-- )
    {
        _row=list.snapshotItem(i).parentNode.parentNode.parentNode;

        if(HidePlayers.indexOf(list.snapshotItem(i).textContent) > -1)
        {
            _row.style.display = 'none';
            hiddenCnt++;
        }
        else
        {
            cntVisible++;

            el=getE(".//a[contains(@href, 'arts_arenda.php?art_return')]", _row);
            if (el)
            {
                returnCnt++;
                urlArr.push(el.href);
            }
        }
    }
    if(GM_getValue('HWM_Rented_Arts.hiddenCnt')!=hiddenCnt)
    {
        GM_setValue('HWM_Rented_Arts.hiddenCnt', hiddenCnt);
        console.log('Сохранили HWM_Rented_Arts.hiddenCnt='+hiddenCnt);
    }

    document.body.innerHTML = document.body.innerHTML.replace('Артефакты в аренде:', 'Артефакты в аренде: '+cntVisible+' (+'+hiddenCnt+' на хранении) <button type="button" name="getBackMyArts" style="display:none">Test</button> ');

    if(returnCnt>0)
    {
        el=document.getElementsByName('getBackMyArts')[0];
        el.textContent ='Забрать арты: '+returnCnt;
        el.onclick =function() {doAction();}
        el.style.display="initial";
    }
}
else if(/inventory/.test(window.location.href))
{
    var hiddenArtsCnt= GM_getValue('HWM_Rented_Arts.hiddenCnt');
    if(!hiddenArtsCnt) hiddenArtsCnt=0;

    el=getE("//div[@class='inv_scroll_content_inside' and contains(text(),'Предметы в аренде')]");
    if(el)
    {
        var res=/\((\d+)\)/.exec(el.innerText);
        el.innerText=el.innerText.replace(/\((\d+)\)/,'('+(parseInt(res[1],10)-hiddenArtsCnt)+')');
        el.title='На хранении: '+hiddenArtsCnt+' шт.'
    }
}

function doAction() // Возврат артов
{
   for (var i=0 ; el=urlArr[i]; i++ )
      func_getDocumentFromUrl(el); // забираем арты !!!

   location.reload();
}

// получает документ по заданному URL
function func_getDocumentFromUrl(urlToLoad){console.log('Load data from url: '+urlToLoad); var req=new XMLHttpRequest(); req.open("GET", urlToLoad, false); req.overrideMimeType('text/xml; charset=windows-1251'); req.send(null); var parser = new DOMParser(); return parser.parseFromString(req.responseText, "text/html"); }

// доступ по xpath
function getE(xpath,el,docObj){return (docObj?docObj:document).evaluate(xpath,(el?el:(docObj?docObj.body:document.body)),null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;}
function getL(xpath,el,docObj){return (docObj?docObj:document).evaluate(xpath,(el?el:(docObj?docObj.body:document.body)),null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);}