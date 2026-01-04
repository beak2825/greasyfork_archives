// ==UserScript==
// @name         HWM_ClanStoreBlacksmithHelper
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Помощник кланового кузнеца
// @author       Zeleax
// @include      /https?:\/\/(www.heroeswm.ru|178.248.235.15|www.lordswm.com|my.lordswm.com)\/(sklad_info.php.*)/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lordswm.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447808/HWM_ClanStoreBlacksmithHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/447808/HWM_ClanStoreBlacksmithHelper.meta.js
// ==/UserScript==

var url = location.protocol + '//'+location.hostname+'/';

if(/sklad_info.php\?id=\d+&cat=-1/.test(location.href)){ // если взяли с клансклада арт в ремонт- открываем страницу кузни
    window.location.assign(url+"mod_workbench.php?type=repair");
    return;
}

var el, list, artName, e, reg, pro4ka, parentTr;

el=getE('//b[contains(text(),"Артефакты для ремонта")]');
if(el) {
    parentTr=el.parentNode.parentNode.nextSibling; // tr со сломанными артами
    if(parentTr) list=getL('.//td[table and @bgcolor]');

    var arr=[];
    for (var i=0 ; i<list.snapshotLength; i++)
    {
        el=list.snapshotItem(i);
        e=getE('.//a[starts-with(@href, "art_info.php")]', el);
        if(e){
            if(reg=/\?id=(\S+)/.exec(e.href)) {
                artName=reg[1];

                if(reg=/\[0\/(\d+)\]/.exec(el.innerText)) {
                    pro4ka=parseInt(reg[1]);
                    arr.push([el, artName, pro4ka, 0]);
                }
            }
        }
    }
    // заполним колонку с количеством артов
    for (i=0 ; i<arr.length; i++) {
        if(arr[i][3]==0){
            var cnt=1;
            artName=arr[i][1];
            for(var j=i+1 ; j<arr.length; j++)
                if(arr[j][1]==artName)
                    cnt++;

            for(j=i ; j<arr.length; j++)
                if(arr[j][1]==artName)
                    arr[j][3]=cnt;
        }
    }

    arr.sort(function(a, b){
        if (a[3]<b[3]) return 1;
        if (a[3]>b[3]) return -1;
        if (a[1]<b[1]) return -1;
        if (a[1]>b[1]) return 1;
        if (a[2]<b[2]) return 1;
        if (a[2]>b[2]) return -1;

        return 0;
    });

    arr[0][0].style.backgroundColor = "yellow"; // подсветить арт для ремонта
}

// var arrayOfNewChildren = arr.map(d => d[0]);
// parentTr.replaceChildren(...arrayOfNewChildren);

function getE(xpath,el,docObj){return (docObj?docObj:document).evaluate(xpath,(el?el:(docObj?docObj.body:document.body)),null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;}
function getL(xpath,el,docObj){return (docObj?docObj:document).evaluate(xpath,(el?el:(docObj?docObj.body:document.body)),null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);}
