// ==UserScript==
// @name         HWM_MarkRealtyOnMap
// @namespace    http://tampermonkey.net/
// @version      1.5.3
// @description  Подсвечивает предприятия, акциями которых вы владеете. Подсвечивает на карте и в экономической статистике по арту
// @author       Zeleax
// @include /https?:\/\/(www.heroeswm.ru|178.248.235.15|www.lordswm.com|my.lordswm.com)\/(pl_info_realty.php|map.php|ecostat_details.php|auction.php\?cat=obj_share).*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lordswm.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447445/HWM_MarkRealtyOnMap.user.js
// @updateURL https://update.greasyfork.org/scripts/447445/HWM_MarkRealtyOnMap.meta.js
// ==/UserScript==
// GM functions
if (typeof GM_getValue != 'function') {this.GM_getValue=function (key,def) {return localStorage[key] || def;};this.GM_setValue=function (key,value) {return localStorage[key]=value;};	this.GM_deleteValue=function (key) {return delete localStorage[key];};}

if(/map.php/.test(location.href)){
    document.body.addEventListener('click', function (evt) {
        if (evt.target.className.indexOf('job_fl_btn show_hint')==0) {
            if(/map.php.+st=(mn|fc|sh)/.test(evt.target.parentNode.href)){
                setTimeout(AA, 500);
            }
        }
    }, false);
}

AA();

function AA() {
    var HWM_objArr = GM_getValue('HWM_objArr',null);
    var objArr=JSON.parse(HWM_objArr);
    if(!objArr) objArr = [];

    var reg, list, el;

    if(/pl_info_realty.php/.test(location.href))
    {
        var heroId=/id=(\d+)/.exec(location.href)?.[1];
        if(heroId==getCurrentHeroWMId()){
            objArr = [];
            list=getL('//a[contains(@href,"object-info.php?id=") and contains(text(),"#")]');

            if(list.snapshotLength>0)
            {
                for (var i=0 ; i<list.snapshotLength; i++) objArr.push(/id=(\d+)/.exec(list.snapshotItem(i).href)[1]);
                var s_objArr=JSON.stringify(objArr);

                if(HWM_objArr!=s_objArr)
                {
                    GM_setValue('HWM_objArr',s_objArr);
                }
            }
        }
    }
    else if(/map.php/.test(location.href)){
        list=getL('//tr[starts-with(@class, "map_obj_table")]');
        var _row;

        for (i=0 ; i<list.snapshotLength; i++)
        {
            _row = list.snapshotItem(i);
            reg = /object-info.php\?id=(\d+)/.exec(_row.firstChild.firstChild.href);

            if((reg[1]) && objArr.includes(reg[1])) {

                var cellsInRow = _row.getElementsByTagName('td');
                for (var j = 0; j < cellsInRow.length; j++) {
                    cellsInRow[j].style.backgroundColor = 'yellow';
                }
            }
        }
    }
    else if(/ecostat_details/.test(location.href)){
        list=getL('//td[a[contains(@href,"object-info")]]');
        var _td;

        for (i=0 ; i<list.snapshotLength; i++)
        {
            _td = list.snapshotItem(i);
            reg = /object-info.php\?id=(\d+)/.exec(_td.getElementsByClassName('pi')[0].href);

            if((reg[1]) && objArr.includes(reg[1])) _td.parentNode.style.backgroundColor = "yellow";
        }
    }
    else if(/auction.php\?cat=obj_share/.test(location.href)){
        list=getL('//a[contains(@href,"object-info.php?id=")]');
        for (i=0 ; i<list.snapshotLength; i++) {
            el=list.snapshotItem(i);
            el.href = el.href.replace('object-info','object_sh_info'); // заменяем ссылки на объекты ссылками на протоколы этих объектов
        }
    }
};

// доступ по xpath
function getE(xpath,el,docObj){return (docObj?docObj:document).evaluate(xpath,(el?el:(docObj?docObj.body:document.body)),null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;}
function getL(xpath,el,docObj){return (docObj?docObj:document).evaluate(xpath,(el?el:(docObj?docObj.body:document.body)),null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);}
function getCurrentHeroWMId(){var el=getE('//a[contains(@href,"pl_hunter_stat.php")]');if(el){return /id=(\d+)/.exec(el.href)?.[1];}}
