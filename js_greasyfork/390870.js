// ==UserScript==
// @name         HWM_Mail_Helper
// @namespace    Zeleax
// @version      0.7
// @description  Почтовый помощник ГВД. Подсветка желтым цветом ещё не просмотренных клановых рассылок. Исправление ссылок в письмах.
// @author       Zeleax
// @include      /https:\/\/(www.heroeswm.ru|www.lordswm.com|my.lordswm.com)\/sms_clans.php.*/
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/390870/HWM_Mail_Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/390870/HWM_Mail_Helper.meta.js
// ==/UserScript==

// GM functions
if (typeof GM_getValue != 'function') {this.GM_getValue=function (key,def) {return localStorage[key] || def;};this.GM_setValue=function (key,value) {return localStorage[key]=value;};	this.GM_deleteValue=function (key) {return delete localStorage[key];};}

// Текущая рассылка
var el, curClanTd;
curClanTd=getClosestParentByTagName(getE('//*[contains(text(),"Рассылка клана")]'),'td');
var curClanNum=/#(\d+)/.exec(curClanTd.innerText)[1];

// Сохраненные данные
var clanMailInfoOldS = GM_getValue('HWM_Mail_Manager_clanMailInfoS');
var clanMailInfoOld= clanMailInfoOldS ? JSON.parse(clanMailInfoOldS) : {};

// Текущие данные
el=getE('//a[contains(@href, "sms_clans.php?clan_id=") and contains(text(),"#")]');
var clanList= getClosestParentByTagName(el, 'tbody');
var clanrows = getL('.//tr',clanList);

var regex=/(\d+).+\D(\d+)/;
var clanMailInfoNew={};
var clanMailDelta={};

for(var i=0; el=clanrows.snapshotItem(i); i++)
{
    var res=regex.exec(el.innerText);

    var old=clanMailInfoOld[res[1]];
    var cntcur=parseInt(res[2],10);
    clanMailInfoNew[res[1]]={cnt: cntcur, chk: (old ? old.chk : 1)};

    clanMailDelta[res[1]]=cntcur-(old ? old.cnt : 0);
    if(clanMailDelta[res[1]]<0) clanMailDelta[res[1]]=0;
    if(clanMailDelta[res[1]]>0)
    {
        if (curClanNum!=res[1]) el.style.backgroundColor = "yellow";
        else curClanTd.style.backgroundColor = "yellow";
    }
}

if(isEmpty(clanMailInfoOld)) clanMailInfoOld = JSON.parse(JSON.stringify(clanMailInfoNew)); // клонирование массива

if(window.location.search=='')
{
    var lastClanMailTime = parseInt(GM_getValue('HWM_Mail_Manager_lastClanMailTime', '0'), 10);
    var curTime=(new Date()).getTime();
    var deltaTime = curTime-lastClanMailTime;
    if(deltaTime > 15000) GM_setValue('HWM_Mail_Manager_lastClanMailTime', curTime);
    if (clanMailDelta[curClanNum]==0 && deltaTime > 60000) {
        const keys = Object.keys(clanMailDelta)
        for (const key of keys) {
            if(clanMailDelta[key]>0 && clanMailInfoOld[key] && clanMailInfoOld[key].chk==1) {
                window.location +='?clan_id='+key;
            }
        }
    }
}

// Обновляем данные текущей рассылки
if(!clanMailInfoOld[curClanNum]) { clanMailInfoOld[curClanNum]=clanMailInfoNew[curClanNum];}
else { clanMailInfoOld[curClanNum].cnt= clanMailInfoNew[curClanNum].cnt;}

el=document.getElementsByName('sign')[0];
if (el) clanMailInfoOld[curClanNum].chk = el.checked ? 1 : 0;

// Сохраняем актуальную инфу
var clanMailInfoOldS2=JSON.stringify(clanMailInfoOld);
if(clanMailInfoOldS2!=clanMailInfoOldS)
{
    GM_setValue('HWM_Mail_Manager_clanMailInfoS', clanMailInfoOldS2);
}

// склеиваем разорванные ссылки в письме
if(/read/.test(window.location.search))
{
    el = getE('//li[contains(text(),"Тема: ")]');
    if(el){
        el = el.parentNode.parentNode.nextSibling.nextSibling.firstChild.firstChild.firstChild.firstChild.firstChild;
        if(el){
            el.innerHTML=el.innerHTML.replaceAll(/\b(https?\S{20,200})\s(\S{1,200})/g, '$1$2'); // удаляем пробел
        }
    }
}

function isEmpty(obj) {for (var x in obj) { return false;}return true;}
function getE(xpath,el,docObj){return (docObj?docObj:document).evaluate(xpath,(el?el:(docObj?docObj.body:document.body)),null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;}
function getL(xpath,el,docObj){return (docObj?docObj:document).evaluate(xpath,(el?el:(docObj?docObj.body:document.body)),null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);}
function getClosestParentByTagName(el, tag){var p, e, fnd=false, tf=tag.toLowerCase();e=el;do{p=e.parentElement;if((p) && (p.tagName.toLowerCase()==tf)){fnd=true;break;} e=p;} while (e);
return fnd?p:null;}