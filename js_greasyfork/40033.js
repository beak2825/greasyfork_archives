// ==UserScript==
// @name         AutoEnumPP
// @namespace    Sweag
// @version      1.1
// @description  Автоматически подставляет число для продажи ресурсов на предприятии
// @author       Sweag
// @match        https://www.heroeswm.ru/object-info.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40033/AutoEnumPP.user.js
// @updateURL https://update.greasyfork.org/scripts/40033/AutoEnumPP.meta.js
// ==/UserScript==

(function() {
    'use strict';
var hrefs = document.getElementsByTagName('form');
for(var i = 0; i < hrefs.length; i++){
	if(hrefs[i].innerHTML.indexOf('count') > -1)
	{
        var S = hrefs[i].innerHTML;
        if(S.split('>>')[1]!==undefined){
            var S1 = S.split('text');
            if(S1[1]!==undefined){
                var SS = S1[1].split('value=');
                hrefs[i].innerHTML = S1[0] + 'text' + SS[0] + 'value="77"' + SS[1].substring(3) + 'value=' + SS[2];
                hrefs[i].submit();
            }
        }
	}
}
    setTimeout(reload, 3000);
})();

function reload()
{
    document.location.reload();
}