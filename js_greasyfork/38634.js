// ==UserScript==
// @name        ClanCompanyNew823
// @namespace   ssn
// @include     http://www.heroeswm.ru/object-info.php*
// @include     http://qrator.heroeswm.ru/object-info.php*
// @include     http://178.248.235.15/object-info.php*
// @version     2.0.0.6
// @grant       GM_xmlhttpRequest
// @description for Chrome (by ReapeR19)
// @downloadURL https://update.greasyfork.org/scripts/38634/ClanCompanyNew823.user.js
// @updateURL https://update.greasyfork.org/scripts/38634/ClanCompanyNew823.meta.js
// ==/UserScript==

// Refactored, fixed and upgraded 'ClanCompanyNew 2.0.0.2' script by ReapeR19

var clans = [823, 2336];
var idomen = "http://ginger.hwmres.shn-host.ru/";
var cl = /\d+/.exec(/alt=\"#\d+/.exec(document.body.innerHTML));
if(document.getElementsByName('FlashVars').length){
	var params = document.getElementsByName('FlashVars')[1].value.split('|');
	var pl_id = params[7];
}else{
	var aList = document.querySelectorAll('.subnav li > a');
  for(var i in aList){
    if(aList[i].href.indexOf('pl_hunter_stat') !== -1){
      var pl_id = aList[i].href.split('?id=')[1];
      break;
    }
  }
}
var sendOK = '';

if(isMyClan(cl))
{
    var t = document.getElementsByName('obj_id');
    if(t.length > 0)
    {
        var dd = document.createElement('a');
		dd.target = '_blank';
		dd.href = idomen + 'GetProtocol.php?pl_id=' + pl_id;
		dd.innerHTML = 'Статистика';
		dd.title = 'Моя статистика поддержки предприятий';
        var inp = document.getElementsByTagName('input');
        var rad = document.createElement('input');
        rad.type = 'checkbox';
        rad.id = 'sclan';
        rad.title = 'Учесть на сервере клановой статистики';
        rad.onclick = function(){startBuy();}
        
        var d = document.createElement('div');
        d.id = 'idiv';
        for(var i=0; i < inp.length; i++)
        {
            if(inp[i].name == 'buy_count')
            {
                inp[i].parentNode.appendChild(dd);
                inp[i].parentNode.appendChild(rad);
                inp[i].parentNode.appendChild(d);
                i = inp.length;
            }
        }  	
    }
    if(!getValue()) setValue("null");
    if(getValue() != "null"){
		setPanelStyle(true);
		sender_approve(getValue());
	}
}


function startBuy()
{
    document.getElementById('sclan').checked = false;
	setPanelStyle(true);
	var iurl = idomen + "StartBuy.php?id="+t[0].value+"&pl="+pl_id; 
	console.log(iurl);
	sender_start(iurl);
}

function sender_start(url)
{
	var ans = '';
    
	GM_xmlhttpRequest({
			method: "GET",
			url: url,
			onload: function(response) {
				ans = response.responseText;
				var div = document.createElement('div');
				div.innerHTML = ans;
				document.body.appendChild(div);
				
				setPanelStyle(false);
				if(document.getElementById('iapprove').innerHTML == '1')
				{
                    setValue(idomen + 'AppBuy.php?id='+document.getElementById('icode').innerHTML+'&sh='+document.getElementById('ihash').innerHTML);
                    timer();
				}
				else
                {
                    alert("Сервер статистики вернул ошибку:\r\n" + document.getElementById('imessage').innerHTML + "\r\n \r\nПерезапустите страницу и повторите операцию!");
                }
			},
			timeout: 10000,
			onerror: function(response){
				setPanelStyle(false);
				alert('Произошла ошибка на стороне сервера статистики!');
			}
	});

}

function sender_approve(url)
{
	var ans = '';
	GM_xmlhttpRequest({
			method: "GET",
			url: url,
			onload: function(response) {
                setValue('');
				setPanelStyle(false);
				//alert('Операция закончена успешно!');
			},
			timeout: 10000,
			onerror: function(response){
				alert('Произошла ошибка на стороне сервера статистики!');
			}
	});
}

var itime = 60;
function timer(){
    document.getElementById('idiv').innerHTML = 'Время на совершение сделки: ' + itime + ' сек.';
    itime--;
	if(itime>0)
		setTimeout(timer, 1000);
	else
	{
		setValue('');
		document.getElementById('idiv').innerHTML = 'Внимание! Сделка не будет учтена. Отведенное время истекло.';
	}
}

function setValue(s){
    s ? localStorage['urlRes'] = s : delete localStorage['urlRes'];
}

function getValue(){
	return localStorage['urlRes']?localStorage['urlRes']:null;
}

function isMyClan(item)
{
    for(var i = 0; i < clans.length; i++)
    {
        if(clans[i] == item) return true;
    }
    return false;
}

function setPanelStyle(isVisible)
{
	var div = document.getElementById('idiv');
	if(isVisible)
	{
	    div.style.display = 'block';
		div.style.visibility = 'visible';
		div.style.position = 'absolute';
		div.style.zIndex = '999';
		div.style.top = '0px';
		div.style.left = '0px'; 
		div.style.width = '105%';
		div.style.height = '105%'; 
		div.style.backgroundColor = 'white'; 
		div.style.textAlign = 'center'; 
		div.style.paddingTop = '20%'; 
		div.style.filter = 'alpha(opacity=75)'; 
		div.style.opacity = '0.75';
		div.innerHTML = '<b>Связываемся с сервером статистики!</b><br><img src="'+idomen+'source/ajax-loader.gif">';
	}
	else
	{
        div.style = ''; //'display: none;visibility: hidden;';
        div.style.display = '';
		div.style.visibility = '';
		div.style.position = '';
		div.style.zIndex = '';
		div.style.top = '';
		div.style.left = ''; 
		div.style.width = '';
		div.style.height = ''; 
		div.style.backgroundColor = ''; 
		div.style.textAlign = ''; 
		div.style.paddingTop = ''; 
		div.style.filter = ''; 
		div.style.opacity = '';
		div.innerHTML = '';
	}
}