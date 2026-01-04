// ==UserScript==
// @name        HwmDailyNews
// @namespace   z
// @include      /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/home\.php/
// @description HWMDaily news at homepage
// @version     1.23
// @grant GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/418563/HwmDailyNews.user.js
// @updateURL https://update.greasyfork.org/scripts/418563/HwmDailyNews.meta.js
// ==/UserScript==


var maxstringlength = 25;
var SUC_script_num = 135387;
_GM_init();

var top = GM_getValue("top", true);
var last = GM_getValue("last", "0|1");

var last_ar = last.split('|');

var topics = {};topics["1"] = {title:"Новости", link:"https://daily.heroeswm.ru/news/"};topics["2"] = {title:"Горячие новости", link:"http://daily.heroeswm.ru/hn.php"};topics["3"] = {title:"Зеркало", link:"http://daily.heroeswm.ru/mrrr.php"};

var els = getI( "//td[@width=290 and @rowspan=2]" ) ;

if (els.snapshotLength == 1) {
	el = els.snapshotItem(0);
	divOuter = document.createElement( 'div' );
	divOuter.setAttribute( 'style' , 'margin: 8 auto; padding: 10px; overflow: hidden; width: 86%;' );
	divOuter.innerHTML += '<span id="switcher" opened="1" style="cursor: pointer;"></span>&nbsp;<a style = "text-decoration:none" href="http://daily.heroeswm.ru"><center style="display: inline"><h2 style="display: inline;font-size: 12px; font-weight: bold;">Геройская новостная лента</h2></center></a> <span style = "cursor:pointer" id = "gettop">' + (top ? '▼' : '▲') + '</span><br/>';
	divInner = document.createElement( 'div' );
	divInner.innerHTML = getwheelimg() +'&nbsp;&nbsp;Загрузка списка новостей...';
	divOuter.className="wblight";
    divOuter.appendChild(divInner);

    if (top)
	el.insertBefore(divOuter, el.firstChild);
    else
    el.appendChild(divOuter);

	var switcher = document.getElementById('switcher');
	switcher.addEventListener
	(
		"click" ,
		function( event )
		{
			var d = 1-Number(switcher.getAttribute("opened"));
			GM_setValue( "hwmdsw", d );
			flick(d);
		},
		false
	);
	flick(GM_getValue( "hwmdsw", 1 ));

}
document.getElementById ("gettop").addEventListener("click", gettop, false);

function gettop()
{
if (top)
    GM_setValue("top", false);
else
    GM_setValue("top", true);
    location.reload();
}

function getI(xpath,elem){return document.evaluate(xpath,(!elem?document:elem),null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);}
function flick(opened) {
	if (opened != 1) {
		switcher.innerHTML = "(+)";
		divInner.style.display = "none";
		switcher.setAttribute("opened", "0");
	} else {
		do_req();
		switcher.innerHTML = "(-)";
		divInner.style.display = "block";
		switcher.setAttribute("opened", "1");
	}
}
function _GM_init() {
	if (typeof GM_deleteValue == 'undefined') {
		GM_getValue = function(name, defaultValue) {
			var value = localStorage.getItem(name);
			if (!value)
				return defaultValue;
			var type = value[0];
			value = value.substring(1);
			switch (type) {
				case 'b':
					return value == 'true';
				case 'n':
					return Number(value);
				default:
					return value;
			}
		}
		GM_registerMenuCommand = function(name, funk) {;}
		GM_setValue = function(name, value) {
			value = (typeof value)[0] + value;
			localStorage.setItem(name, value);
		}
	}
}
function trimming(string, l) {
	var s = string;
	if (string.length > l) {
	for (var i = l; i >=0; i--)
		if (string.charAt(i) == ' ')
			s = string.substr(0, i)+'...';
	s = string.substr(0, l)+'...';
	}
	return s.replace(/&[^#]/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;");
}
function do_req() {

	GM.xmlHttpRequest({
		method: "GET",
		url: "https://daily.heroeswm.ru/news4script.txt?" + Date.now(),
		headers:
		{
			'User-agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.1; ru; rv:1.8.1)',
			'Accept': 'text/xml,text/html',
			'Content-Type': 'text/plain; charset=windows-1251'
		} ,
		synchronous: false,
		overrideMimeType: 'text/plain; charset=windows-1251',
		onload: function(response) {


			try{
                var sPat = /\/\/daily\.heroeswm\.ru\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*$/i;
				var nData = JSON.parse('[["'+response.responseText.replace(/"/g, "\\\"").replace(/\n/g,'"],["').replace(/;;/g,'","').replace(/'/g, "&#39;")+'"]]');
				var s = "";
                var new_last = '';
				for (var i=0; i < nData.length-1; i++)
                {
					if ((sPat.test(nData[i][1])) && (sPat.test(nData[i][3])) && (/^[1-3]$/.test(nData[i][0])))
                    {
                        var max = maxstringlength;
                        if (last_ar.indexOf(nData[i][4]) == -1) max = max - 3;
						s += "<tr><td><a style = 'text-decoration:none" + ( last_ar.indexOf(nData[i][4]) == -1 ? ';font-weight: bold;color:red':'') + "' target='blank_' href='"+nData[i][3]+"' title='"+trimming(nData[i][2],255)+"'>• "+trimming(nData[i][2],max)+"</a> <span title = 'комментариев' style = 'font-size:9px'>["+ nData[i][5] +"]</span></td></tr>";
                        new_last += nData[i][4] + "|";
                    }
                }
                GM_setValue("last", new_last);
			} catch(e) {
				s = "<tr><td>Что-то не то... Не получается новости подгрузить...</td></tr>";
			} finally {
				divInner.innerHTML="<table width='100%'>"+s+"</table>";
			}
		},
		onerror: function(response) {
			divInner.innerHTML="<table width='100%'><tr><td>Что-то не то... Не получается новости подгрузить...</td></tr></table>";
		}
	})
}
function getwheelimg() {
	return '<img border="0" align="absmiddle" height="11" src="data:image/gif;base64,R0lGODlhEAAQAMQAAP///+7u7t3d3bu7u6qqqpmZmYi'+
'IiHd3d2ZmZlVVVURERDMzMyIiIhEREQAR'+
'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'+
'fySDhGYQdDWGQyUhADs=">';}