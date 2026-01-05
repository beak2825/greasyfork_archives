//
// ==UserScript==
// @name          [hwm]_battlefilter
// @author        http://www.heroeswm.ru/pl_info.php?id=993353
// @description   filter battles
// @version       0.1
// @include       http://www.heroeswm.ru/bselect.php*
// @include       http://178.248.235.15/bselect.php*
// @grant        unsafeWindow
// @namespace https://greasyfork.org/users/29576
// @downloadURL https://update.greasyfork.org/scripts/16903/%5Bhwm%5D_battlefilter.user.js
// @updateURL https://update.greasyfork.org/scripts/16903/%5Bhwm%5D_battlefilter.meta.js
// ==/UserScript==

(function (window, undefined) {  // [2] нормализуем window
    var w;
    if (typeof unsafeWindow !== undefined) {
        w = unsafeWindow
    } else {
        w = window;
    }
    if (w.self != w.top) {
        return;
    }

    if (/http:\/\/www.heroeswm.ru\/bselect.php\?all=1/.test(w.location.href)) {
        var cntbody = document.body.childNodes.length;
        var bigtable = document.body.childNodes[3];
        var smtable = bigtable.childNodes[8];
        var battles = smtable.childNodes[0];
        battles = battles.getElementsByTagName('tr')[2].getElementsByTagName('td')[2];//нужный кусок страницы
        var childNodes = battles.childNodes;

        for (var i = 0; i < childNodes.length; i++) {
            if (childNodes[i].nodeType != 8) {
                continue;
            }
            var curcomment=childNodes[i];
               var typeBattle=childNodes[i].data;
            var nextelem;
            if(typeBattle == 88) {
                nextelem=curcomment.nextElementSibling;
                nextelem.innerHTML='<b style="color: red;">'+nextelem.innerHTML+'</b>';
            }
            else {
                nextelem=curcomment.nextElementSibling;
                nextelem.innerHTML='<span style="display: none;">'+nextelem.innerHTML+'</span>';
            }   
        }
    }
})(window);