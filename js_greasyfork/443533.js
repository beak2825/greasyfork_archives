// ==UserScript==
// @name         LNK_forumSearch
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  поиск по теме форума
// @author       LNK
// @include      *heroeswm.ru/forum_messages.php*
// @include      *lordswm.com/forum_messages.php*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/443533/LNK_forumSearch.user.js
// @updateURL https://update.greasyfork.org/scripts/443533/LNK_forumSearch.meta.js
// ==/UserScript==

(function() {
    'use strict';

async function getPageFetch(aURL) {
    let response = await fetch(aURL);
    let buf = await response.arrayBuffer()
    let s = new TextDecoder('windows-1251').decode(buf);
    return s;
} // getPageFetch

function el(id) { return document.getElementById(id); }

async function searchGo() { //alert(sCount);
    var sCount = 0; 
    var sWhat = el('sWhat').value.trim();
    var pFrom = el('pFrom').value-1;
    var pTo = el('pTo').value-1;
    var dirForw = (pFrom > pTo) ? -1 : 1;
    var i, n1=0, n2, n3, n01, n02, sMes, sText = '', found=false;
    var addr = location.href;
    //var reponse = '';
    if (sWhat == '') { alert('не задана строка дляя поиска!'); return false; }
    if ( btnText == 'Искать') { 
        localStorage.setItem('HWM_forumSearchFromInit', pFrom+1); 
        localStorage.setItem('HWM_forumSearchDirForw', dirForw); 
    }
    localStorage.setItem('HWM_forumSearchStr', sWhat);
    while (((dirForw == -1) && (pFrom >= pTo)) || ((dirForw == 1) && (pFrom <= pTo))) {
        n2 = ((n2 = addr.indexOf('&')) < 0) ? 1000 : n2;
        addr = addr.slice(0,n2) + '&page='+pFrom;
        sText = await getPageFetch(addr);
        if (sText.indexOf(`<td style='color: #000000; padding: 5px;font-size: 0.8125em;'>`) < 0) {
            alert('forum not found'); return false; }
        if (n1 == 0) {
            n1 = sText.indexOf('</a></h1><BR>'); 
            n1 = sText.indexOf('<b><font color=red>',n1);
            if (n1 < 0) { alert('forum page list not found'); return 0; }
            n2 = sText.indexOf('>',n1+5);
            n3 = sText.indexOf('<',n1+5);
            n1 = +sText.slice(n2+1,n3); 
            pFrom = n1-1;
        }
        n1 = 0;
        while ((n1 = sText.indexOf(`<td style='color: #000000; padding: 5px;font-size: 0.8125em;'>`,n1)) > 0) {
            n1 = sText.indexOf('>',n1)+1;
            n2 = sText.indexOf('</td>',n1);
            sMes = sText.slice(n1,n2); //alert(sMes);
            n01 = sMes.toLowerCase().indexOf(sWhat.toLowerCase());
            if (n01 >= 0) {
                n02 = n01 + sWhat.length;
                sCount++;
            }
        }
        if (sCount > 0) { break; }
        pFrom += dirForw; 
        el('pFrom').value = pFrom+1; 
    }
    if (sCount == 0) {
        alert('Все страницы диапазона просмотрены. Поиск завершен.');
        el('pFrom').value = localStorage.getItem('HWM_forumSearchFromInit');
        el('sGo').innerHTML = 'Искать';
        return false;
    } else {
        //alert('Найдено '+sCount);
        localStorage.setItem('HWM_forumSearchFrom', pFrom+1);
        localStorage.setItem('HWM_forumSearchTo', pTo+1);
        location.href = addr;
        return true;
    }
}//searchGo

function showResult() {
    var sCount = 0;
    var sWhat = el('sWhat').value;
    var i, n1=0, n2, n01, n02, sMes, sMes0, sText = '', found=false;
    sText = document.body.innerHTML;
    if (sText.indexOf(`<td style="color: #000000; padding: 5px;font-size: 0.8125em;">`) < 0) {
        alert('forum not found'); return false; }
    while ((n1 = sText.indexOf(`<td style="color: #000000; padding: 5px;font-size: 0.8125em;">`,n1)) > 0) {
        n1 = sText.indexOf('>',n1)+1;
        n2 = sText.indexOf('</td>',n1);
        sMes0 = sText.slice(n1,n2);
        sMes = sMes0.toLowerCase();
        n01 = sMes.indexOf('<a ');
        if (n01 >= 0) {
            n02 = sMes.indexOf('>', n01);
            if (n02 >= 0) {
                sMes = sMes.slice(0,n01) + sMes.slice(n01,n02).toUpperCase() + sMes.slice(n02);
            }
        }
        n01 = sMes.indexOf(sWhat.toLowerCase());
        if (n01 >= 0) {
            n02 = n01 + sWhat.length;
            sCount++;
            sMes0 = sMes0.slice(0,n01) + `<span id='found${sCount}' style='background:magenta;'>` + sMes0.slice(n01,n02) + `</span>` + sMes0.slice(n02);
            //sMes = `<span id='found${sCount}' style='background:magenta;'>` + sMes + `</span>`;
            sText = sText.slice(0,n1) + sMes0 + sText.slice(n2-1);
        }
    }
    if (sCount == 0) {
        alert('Ничего не найдено');
        return false;
    } else {
        document.body.innerHTML = sText;
        el('sGo').onclick = searchGo;
        if (el(`found1`)) { el(`found1`).scrollIntoView({block: "center"}); };
        return true;
    }
}//showResult

    var pText = document.body.innerHTML;
    if (pText.indexOf('</a></h1><br><center><') < 0) { 
        pText = pText.replace('</a></h1><br><br>','</a></h1>&nbsp&nbsp&nbsp&nbsp В теме 1 страница - поиск средствами браузера<BR><BR>');
        document.body.innerHTML = pText;
        return 0;
    }
    var n1 = pText.indexOf('</a></h1><br>');
    //alert(pText.slice(n1,n1+200));
    n1 = pText.indexOf('<b><font color="red">',n1);
    if (n1 < 0) { alert('forum page list not found'); return 0; }
    var n2 = pText.indexOf('>',n1+5); 
    var n3 = pText.indexOf('<',n1+5);
    n1 = +pText.slice(n2+1,n3); //alert(pText.slice(n2+1,n3));
    n2 = n1 - 20; 
    if (n2 < 1) { 
        n2 = 1; 
        if (n1 == 1) { n2 = 20; }
    }
    var strFound = localStorage.getItem('HWM_forumSearchStr');
    var btnText = 'Искать';
    if (!strFound) { strFound = ''; }
    var pFrom = localStorage.getItem('HWM_forumSearchFrom');
    if (pFrom) { 
        var dirForw = parseInt(localStorage.getItem('HWM_forumSearchDirForw'));
        pFrom = parseInt(localStorage.getItem('HWM_forumSearchFrom')) + dirForw;
        localStorage.removeItem('HWM_forumSearchFrom'); 
        btnText = 'Следуюшая страница';
    } else { pFrom = n1; }
    var pTo = localStorage.getItem('HWM_forumSearchTo');
    if (pTo) { localStorage.removeItem('HWM_forumSearchTo'); }
    else { pTo = n2; }
    var sText = `
       &nbsp&nbsp&nbsp&nbsp Поиск по теме:
       <input type='text' id='sWhat' size='30' value='${strFound}'>
       <span id='pCur'> страницы с </span>
       <input type='text' id='pFrom' size='7' value='${pFrom}'> по
       <input type='text' id='pTo' size='7' value='${pTo}'>
       <button id='sGo'>${btnText}</button>
    `;
    pText = pText.replace('</a></h1><br><center><','</a></h1>'+sText+'<br><center><');
    document.body.innerHTML = pText;
    el('sGo').onclick = searchGo;
    if ( btnText == 'Следуюшая страница') { showResult(); }

})();