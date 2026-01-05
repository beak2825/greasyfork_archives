// ==UserScript==
// @name        InfoPerk
// @namespace   perk
// @description Perk table -> homepage
// @include     https://www.heroeswm.ru/home.php
// @include     http://178.248.235.15/home.php*
// @autor		Sweag
// @version     1.7.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/25129/InfoPerk.user.js
// @updateURL https://update.greasyfork.org/scripts/25129/InfoPerk.meta.js
// ==/UserScript==


var hrefs = document.getElementsByTagName('a');
var temp = document.querySelectorAll("body > center");
temp[0].children[1].children[0].children[0].children[0].children[0].children[0].children[2].children[0].children[1].remove();
    for(var i=0; i<hrefs.length; i++){
        if(hrefs[i].href.indexOf('pl_transfers') > -1){
            if(hrefs[i].className =='pi')continue;
            var s = hrefs[i].href.split('pl_transfers');
            var s1 = s[0]+'pl_info'+s[1];
            get_table(s1);
            break;
        }
    }

function insert_table(_perk_, _kukla_)
{
    var t1, t = document.getElementsByTagName('BR');
    var d = document.createElement('div'), p = document.createElement('div');
    d.innerHTML = _kukla_;
    p.innerHTML = _perk_;
    t[0].parentNode.innerHTML += '<BR>';
    t[0].parentNode.appendChild(p);
    t1 = document.getElementsByTagName('a');
    for(var i=t1.length-1; i>0; i--){
        if(t1[i].href.endsWith('help.php')){
            t1[i].parentNode.appendChild(d);
            i = 0;
        }
    }
}

function get_table(href)
{
    var table_perk = "<";
    var table_kukla = "<td";
    var xhr = new XMLHttpRequest();
	xhr.open("GET", href, true);
	xhr.overrideMimeType('text/html; charset=windows-1251');
    xhr.send();
	xhr.onreadystatechange = function() {
		if (xhr.readyState != 4) return;
		if (xhr.status == 200) {
			var text = xhr.responseText.split('table');
            var i;
            for(i=1; i<text.length; i++){
                if(text[i].indexOf('showperkinfo.php') > -1){
                    table_perk += "table" + text[i-1] + "table" + text[i];
                }
            }
            text = xhr.responseText.split('td');
            for(i=1; i<text.length; i++){
                if(text[i].indexOf('kukla') > -1){
                    table_kukla += text[i];
                }
            }
            table_perk += "table>";
            table_kukla += "td>";
            insert_table(table_kukla, table_perk);
        }
	};
}