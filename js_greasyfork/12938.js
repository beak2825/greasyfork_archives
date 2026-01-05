// ==UserScript==
// @name         [HWM] takeSelArts
// @version      0.1.2
// @description  Взять выбранные арты со склада за один раз
// @author       Komdosh
// @include      *.heroeswm.ru/sklad_info.php?*&cat=5*
// @grant        none
// @namespace https://greasyfork.org/users/13829
// @downloadURL https://update.greasyfork.org/scripts/12938/%5BHWM%5D%20takeSelArts.user.js
// @updateURL https://update.greasyfork.org/scripts/12938/%5BHWM%5D%20takeSelArts.meta.js
// ==/UserScript==
//********************************************************************************************
var work=0;

for(var i=0; document.getElementsByTagName('td')[i] || document.getElementsByTagName('input')[i]; ++i)
{
    if(/из данного района нет доступа к складу/.test(document.getElementsByTagName('td')[i].innerHTML))
    {
        work = 1;
        break;
    }
    if(/Сделать комплектом/.test(document.getElementsByTagName('input')[i].value))
    {
        //var tsaButton = document.getElementsByTagName('input')[i].parentNode;
        var tsaButton = document.createElement('button');
        tsaButton.style.marginLeft='5px';
        tsaButton.innerHTML = "Взять выбранные";
        tsaButton.onclick = function(){
            var notTaken=1;
            for(var i=0; i<100; ++i)
                if(boxs[i]) {
                    take(boxs[i]);

                    if(notTaken) notTaken=0;
                }

            if(!notTaken)
            {
                alert('Артефакты взяты!');
                location.reload()
            }
            else {
                alert('Артефакты не выбраны!');
            }
        };
        document.getElementsByTagName('input')[i].parentNode.appendChild(tsaButton);
        break;
    }
}

var href = window.location.toString();
var id = href.split("id=")[1].split("&")[0];

var form=[];
var count=0;
for(var formsIdx=0; document.forms[formsIdx] ; ++i){
    if(document.forms[formsIdx].name == 'f' && document.forms[formsIdx].elements.length==7)
    {
        var sign = document.forms[i].elements[1].value;
        break;
    }
}
//********************************************************************************************
function take(inv_id)
{
    var link = "sklad_info.php?id="+id+"&sign="+sign+"&cat=5&action=get_art&inv_id="+inv_id+"&set_id=0";
    var xhr = new XMLHttpRequest();
    xhr.open('GET', encodeURI(link));
    xhr.overrideMimeType('text/xml; charset=windows-1251');
    xhr.onload = function()
    {
        if (!(xhr.status === 200)){
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send();
}
