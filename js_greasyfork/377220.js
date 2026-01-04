// ==UserScript==
// @name        StoreManyArts (на склад пачкой)
// @namespace   Скрипт для перемещения артефактов на клановый склад и обратно пачкой
// @description на склад пачкой
// @include     https://www.heroeswm.ru/sklad_info.php*
// @version     1.0.0.0
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/377220/StoreManyArts%20%28%D0%BD%D0%B0%20%D1%81%D0%BA%D0%BB%D0%B0%D0%B4%20%D0%BF%D0%B0%D1%87%D0%BA%D0%BE%D0%B9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/377220/StoreManyArts%20%28%D0%BD%D0%B0%20%D1%81%D0%BA%D0%BB%D0%B0%D0%B4%20%D0%BF%D0%B0%D1%87%D0%BA%D0%BE%D0%B9%29.meta.js
// ==/UserScript==

var params = [];
var count = 0;
var store_id = -1;
var store_sign = -1;
var isAdd = 0;
var headadd = 0;
var mytimeout = 1000;

//if(getURIParam()['cat'] != undefined)
{
	if(document.body.innerHTML.indexOf('sklad_rc_on=0') >-1)
	{
		var inputs = document.body.getElementsByTagName('input');
		for(var i = 0; i < inputs.length; i++)
		{
			if(inputs[i].name == 'inv_id' && inputs[i].parentNode.name == 'f')
			{
				if(!headadd)
				{
					var td = document.createElement('td');
					td.width = '5';
					td.align = 'center';
					td.innerHTML = '<input type=checkbox id=macrochecker title="Отметить все">';
					inputs[i++].parentNode.parentNode.parentNode.parentNode.firstChild.insertBefore(td,inputs[i].parentNode.parentNode.parentNode.parentNode.firstChild.firstChild);
					headadd = 1;
				}
				var t = document.createElement('td');
				t.style='background: #eeeeee';
				t.innerHTML = '<input type=checkbox id="c'+inputs[i].value+'" class="myarts" title="Пометить артефакт для переноса в инвентарть">';
				inputs[i++].parentNode.parentNode.parentNode.insertBefore(t, inputs[i].parentNode.parentNode.parentNode.firstChild);
			}
			else if(inputs[i].value == 'Поместить')
			{
				inputs[i].parentNode.innerHTML += "<div style='text-align: left;height: 200px;width: 400px;border: 1px solid #C1C1C1;overflow-y: scroll;' id='artplace'></div><br><input type='button' id='setterArt' value='Поместить на склад'><input type='button' id='getterArt' value='Забрать со склада'><div id='statusplace' style='text-color:red;'></div>";
				var marts = inputs[i].parentNode.parentNode.parentNode.getElementsByTagName('option');
				var div = document.getElementById('artplace');
				for(var j = 1; j < marts.length; j++)
				{
					div.innerHTML += "<input type='checkbox' class='artsfromset' id='set"+marts[j].value+"'>"+marts[j].innerHTML+"<br>";
				}
				marts[0].parentNode.style = 'display: none;';
				inputs[i].style = 'display: none;';
			}
			else if(inputs[i].name == 'id' && inputs[i].value != undefined && store_id == -1) store_id = inputs[i].value;
			else if(inputs[i].name == 'sign' && inputs[i].value != undefined && store_sign == -1) store_sign = inputs[i].value;
		}
		document.getElementById('getterArt').onclick = function(){getCheckedArts();};
		document.getElementById('setterArt').onclick = function(){setCheckedArts();};
		document.getElementById('macrochecker').onchange = function(){changeCheck();};
	}
}

function getCheckedArts()
{
	params = [];
	var c = document.getElementsByClassName('myarts');
	for(var i = 0; i < c.length; i++)
	{
		if(c[i].checked)
		{
			try
			{
				var inps = c[i].parentNode.parentNode.getElementsByTagName('form')[1].getElementsByTagName('input');
				var str = '';
				for(var j = 0; j < inps.length - 1; j++)
				{
					if(j != 0) str += '&';
					str += inps[j].name + '=' + inps[j].value;
				}
				params.push(str);
			}
			catch(e){alert(e)}
		}
	}
	count = params.length;
	isAdd = 0;
	startGetter();
}

function setCheckedArts()
{
	params = [];
	var c = document.getElementsByClassName('artsfromset');
	for(var i = 0; i < c.length; i++)
	{
		if(c[i].checked)
		{
			try
			{
				var str = 'id=' + store_id + '&sign=' + store_sign + '&p_art_id=' + c[i].id.split('et')[1];
				params.push(str);
			}
			catch(e){alert(e)}
		}
	}
	count = params.length;
	isAdd = 1;
	startGetter();
}

function startGetter()
{
	if(params.length > 0)
	{
		var txt = '';
		if(isAdd == 1) txt = 'Помещено'; else txt = 'Забрано';
		var uri = "https://www.heroeswm.ru/sklad_info.php?" + params.pop();
		GM_xmlhttpRequest({
			method: "GET",
			url: uri,
			onload: function(response) {
				document.getElementById('statusplace').innerHTML = "<center>"+txt+": "+(count-params.length)+"/"+count+"</center>";
				if(params.length > 0) setTimeout(startGetter, mytimeout);
				else location.href = location.href;
			}
		});
	}
}

function getURIParam()
{
	var search = window.location.search.substr(1),
	keys = {};
	       
	search.split('&').forEach(function(item) {
	    item = item.split('=');
	    keys[item[0]] = item[1];
	});
	return keys;
}

function changeCheck()
{
	var c = document.getElementById('macrochecker');
	var myinp = document.getElementsByClassName('myarts');
	for(var i = 0; i < myinp.length; i++)
	{
		myinp[i].checked = c.checked;
	}
}