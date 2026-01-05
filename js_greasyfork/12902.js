// ==UserScript==
// @name         [HWM] auctionSpliterUnique
// @version      0.1.1
// @description  Открывает несколько позиций в одном окне
// @author       Komdosh
// @include        *.heroeswm.ru/auction.php*
// @grant        none
// @namespace https://greasyfork.org/users/13829
// @downloadURL https://update.greasyfork.org/scripts/12902/%5BHWM%5D%20auctionSpliterUnique.user.js
// @updateURL https://update.greasyfork.org/scripts/12902/%5BHWM%5D%20auctionSpliterUnique.meta.js
// ==/UserScript==

//********************************************************************************************
//Инициализация
var optionsOfSel = document.getElementsByName('ss2')[0].innerHTML;
optionsOfSel +="<option value='notToSel'>============================</option><option value='elements#abrasive'>Абразив</option><option value='elements#snake_poison'>Змеиный яд</option><option value='elements#tiger_tusk'>Клык тигра</option><option value='elements#ice_crystal'>Ледяной кристалл</option>\
<option value='elements#moon_stone'>Лунный камень</option><option value='elements#fire_crystal'>Огненный кристалл</option><option value='elements#meteorit'>Осколок метеорита</option><option value='elements#witch_flower'>Цветок ведьм</option>\
<option value='elements#wind_flower'>Цветок ветров</option><option value='elements#fern_flower'>Цветок папоротника</option><option value='elements#badgrib'>Ядовитый гриб</option>";

var td = document.getElementsByTagName('td');
for(var i = 0; i < td.length; ++i)
    if(td[i].className=="wbwhite" && td[i].getAttribute("valign")) 
    {
        var mainEl = td[i];
        break;
    }

var href = window.location.toString();
if(/sort=/.test(href))
    var sort = href.split("sort=")[1].split("&")[0];
else
    var sort=0;
var tr = document.createElement('tr');
tr.setAttribute("bgcolor", "#dddddd");
var td = document.createElement('td');
td.setAttribute("colspan", "3");
td.innerHTML="<center><select id='auctionSpliterSel' multiple size='6'>"+optionsOfSel+"</select></center>";
tr.appendChild(td);
var td = document.createElement('td');
td.setAttribute("colspan", "2");
var button = document.createElement('button');
button.innerHTML='Подгрузить!';
button.id="aucSplitButton";
//button.onclick=function(){ if(countSel()>0) { save(); start();} else alert('Ошибка, артефакты не выбраны!');}
td.appendChild(button);
tr.appendChild(td);
mainEl.childNodes[0].childNodes[0].insertBefore(tr, mainEl.childNodes[0].childNodes[0].childNodes[2]);
document.getElementById('aucSplitButton').addEventListener('click', function(){if(countSel()>0) {save(); takeSel(); /*start();*/} else alert('Ошибка, артефакты не выбраны!')}, false);
//********************************************************************************************
function upload(cat, type, sort)
{
    var xhr = new XMLHttpRequest();
    xhr.open('GET', encodeURI("auction.php?cat="+cat+"&sort="+sort+"&art_type="+type));
    xhr.overrideMimeType('text/xml; charset=windows-1251');
    xhr.onload = function() 
    {
        if(document.getElementById('resp')===null)
        {
            var div = document.createElement( 'div' );
            div.id = 'resp';
            div.style.display = 'none';
            document.getElementsByTagName('body')[0].appendChild( div );
        }
        if (xhr.status === 200)
        {
            document.getElementById('resp').innerHTML=xhr.responseText;
            var td = document.getElementById('resp').getElementsByTagName('td');
            for(var i = 0; i < td.length; ++i)
                if(td[i].className=="wbwhite" && td[i].getAttribute("valign"))
                {
                    var pasteEl = td[i];
                    break; 
                }
            for(var i=2; pasteEl.childNodes[0].childNodes[0].childNodes[i]; ++i)
                mainEl.childNodes[0].childNodes[0].innerHTML+=pasteEl.childNodes[0].childNodes[0].childNodes[i].outerHTML;
            mainEl.childNodes[0].childNodes[0].innerHTML+='<tr bgcolor="#49FF21"><td colspan="5"><hr/></td></tr>';
            document.getElementById('resp').innerHTML='';
            document.getElementById('aucSplitButton').addEventListener('click', function(){if(countSel()>1) { save(); takeSel(); /*start();*/} else takeUpl();}, false);
        }
        else 
        {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send();
}
//********************************************************************************************
function countSel() 
{ 
    var list = document.getElementById('auctionSpliterSel'); 
    var count = 0; 
    for (var i=1; i<list.length; ++i) 
        if(list.options[i].value!='notToSel')
            count+= list.options[i].selected;
    return count; 
} 
//********************************************************************************************
function takeSel() 
{
    while(mainEl.childNodes[0].childNodes[0].childNodes[3])
        mainEl.childNodes[0].childNodes[0].removeChild(mainEl.childNodes[0].childNodes[0].childNodes[3]);
    var list = document.getElementById('auctionSpliterSel'); 
    for (var i=1; i<list.length; ++i) 
        if(list.options[i].selected)
            upload(list.options[i].value.split('#')[0], list.options[i].value.split('#')[1], sort); 
} 
//********************************************************************************************
function takeUpl() 
{
    while(mainEl.childNodes[0].childNodes[0].childNodes[3])
        mainEl.childNodes[0].childNodes[0].removeChild(mainEl.childNodes[0].childNodes[0].childNodes[3]);
    var pars = localStorage.getItem("AuctionSplitData").split('|');
    for (var i=0; i<pars.length; ++i) 
        upload(pars[i].split('#')[0], pars[i].split('#')[1], sort); 
} 
//********************************************************************************************
function save() 
{ 
    var str = '';
    var list = document.getElementById('auctionSpliterSel'); 
    for (var i=1; i<list.length; ++i) 
        if(list.options[i].selected && list.options[i].value != 'notToSel')
            str+=list.options[i].value+'|';
    localStorage.setItem("AuctionSplitData", str);
} 
