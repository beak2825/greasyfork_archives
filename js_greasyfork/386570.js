// ==UserScript==
// @name 享溫馨KTV場地費自動計算
// @description 自動計算享溫馨KTV會員場地費
// @match http://www.sws.com.tw/index.php
// @grant none
// @version 0.0.1.20190620061030
// @namespace https://greasyfork.org/users/310793
// @downloadURL https://update.greasyfork.org/scripts/386570/%E4%BA%AB%E6%BA%AB%E9%A6%A8KTV%E5%A0%B4%E5%9C%B0%E8%B2%BB%E8%87%AA%E5%8B%95%E8%A8%88%E7%AE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/386570/%E4%BA%AB%E6%BA%AB%E9%A6%A8KTV%E5%A0%B4%E5%9C%B0%E8%B2%BB%E8%87%AA%E5%8B%95%E8%A8%88%E7%AE%97.meta.js
// ==/UserScript==
var sheet = document.getElementsByTagName('table')[0];
var basOrd = 69;
var inc = [0,0,0,0,0,0];

function CalcPrice(tue, td) {
	for (var i = 2; i < sheet.getElementsByTagName('tr').length; i++) {
		var price, priceBox = sheet.getElementsByTagName('tr')[i].getElementsByTagName('td')[td+inc[i]];
		try {
			if(priceBox.innerText == "-") continue;
		} catch {}
		try {
			var p;
			try {
				p = priceBox.getElementsByTagName('span')[0].innerHTML;
			} catch {
				priceBox = sheet.getElementsByTagName('tr')[i].getElementsByTagName('th')[1];
				p = priceBox.getElementsByTagName('span')[0].innerHTML;
			}
			p = (p.search('span') > 0) ? priceBox.getElementsByTagName('span')[0].getElementsByTagName('span')[0].innerHTML : p;
			if(p.search("~") > 0) {
                priceBox.width = "30px";
                var span = priceBox.getElementsByTagName('span')[0];
                span.style.cssText = "color: #333; font-size: 12px; line-height: 16px;";
                span.innerText = span.innerText.substr(0,5) + "\n~\n" + span.innerText.substr(6,5);
                console.log(span.innerHtml);
                foo=bar;
            }
			price = parseInt(p.substr(0,3));
			if(isNaN(price)) foo=bar;
		} catch {
			priceBox = sheet.getElementsByTagName('tr')[i].getElementsByTagName('td')[td+(++inc[i])];
			try {
				var p = priceBox.getElementsByTagName('span')[0].innerHTML;
				price = parseInt(p.substr(0,3), 10);
			} catch { continue; }
		}
		var newPrice, node = '';
		var box = document.createElement('div');
		if (tue >= 1) {
			newPrice = Math.round(((price/1.1-basOrd)*0.5+basOrd)*1.1);
			node = newPrice + "元/人";
			var e1 = createDIV(node, 1);
			box.appendChild(e1);
		}
		if (tue <= 1) {
			newPrice = Math.round(((price/1.1-basOrd)*0.8+basOrd)*1.1);
			node = newPrice + '元/人';
			var e2 = createDIV(node, 0);
			box.appendChild(e2);
		}
		if (tue == 1)
		{
			box.id = "slide";
			box.style.cssText = "position: relative; top: 0px; transition: all 0.5s ease-in-out 0s;"
			var b = document.createElement('div');
			b.appendChild(box);
			b.style.cssText = "display: block; overflow: hidden; height: 48px; margin: 5px 10px;"
			b.attributes.top = 0;
			box = b;
		} else {
			box.style.cssText = "display: block; margin: 5px 10px;"
		}
		priceBox.appendChild(box);
	}
}

function createDIV(node, tue)
{
	var e = document.createElement('div');
	var t = document.createElement('span');
	t.appendChild(document.createTextNode((tue) ? "週二會員溫馨日" : "會員價"))
	e.appendChild(t)
	e.appendChild(document.createTextNode(node));
	e.id = (tue) ? "price-tue" : "price-oth";
	e.style.cssText = "display: block; font-size: 13px; background-color: rgba(0,0,0,0.15); border-radius: 2px; padding: 2px; line-height: 20px; color: #111; height: 44px;";
	t.style.cssText = "display: block; font-size: 12px; margin-bottom: 0px; border-bottom: 1px solid #aaa; color: #666; transform: scale(.9);";
	return e;
}

var show = 0;
function showSlides() {
	show = !show;
	$('div#slide').css({'top': show*-48 + 'px'});
}

if(location.search.search("setName") > 0) {
    var th = sheet.getElementsByTagName('th');
    for (var i = 0; i < th.length; i++) {
        th[i].style.cssText = "background-color: #fff; padding: 10px; text-align: center;";
    }
    var td = sheet.getElementsByTagName('td');
    for (var i = 0; i < td.length; i++) {
        td[i].style.cssText = "background-color: #fff; padding: 10px 0px;";
    }
    var tr1td = sheet.getElementsByTagName('tr')[1].getElementsByTagName('td');
    sheet.getElementsByTagName('tr')[1].getElementsByTagName('th')[0].style.cssText = "background-color: #eee;";
    for (var i = 0; i < tr1td.length; i++) {
        tr1td[i].style.cssText = "background-color: #eee;";
    }
    
	var allp = document.getElementsByClassName('Count-box')[0].getElementsByTagName('p');
	for (var i = 0; i < allp.length; i++) {
		var t = allp[i].innerText;
		if(t.search("最低消費") > 0) {
			basOrd = parseInt(t.substr(13,2), 10);
			break;
		}
	}
	var days = sheet.getElementsByTagName('tr')[1].getElementsByTagName('td');
	for (var i = 0; i < days.length; i++) {
		switch (days[i].innerText){
			case '週一~週四':
				CalcPrice(1, i+1);
				break;
			case '週二':
				CalcPrice(2, i+1);
				break;
			default:
				CalcPrice(0, i+1);
				break;
		}
	}
	var inte = setInterval(showSlides, 8000);
}