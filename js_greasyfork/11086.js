// ==UserScript==
// @name			Better Proxy-Listen.de
// @namespace		https://greasyfork.org/users/5864
// @description		Adds more FoxyProxy Links to Website Proxy-Listen.de (Proxies Proxy)
// @include			http://www.proxy-listen.de/Proxy/Proxyliste.html
// @icon			http://static.proxy-listen.de/0_proxy/images/foxyproxy.png
// @version			1.0
// @grant			none
// @require			https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/11086/Better%20Proxy-Listende.user.js
// @updateURL https://update.greasyfork.org/scripts/11086/Better%20Proxy-Listende.meta.js
// ==/UserScript==

//
// Automatic Mode = set to 'true'. Proxies are in groups, depending on the selected country
// Manual Mode = set to 'false'. You can specify your own groups
var MyAuto = true;

// Manual ProxyGroups. You can use two or more groups
if (MyAuto == false) {
	var proxy = [
		"X-1-X",							// Edit here!
		"X-2-X", 							// delete or add some Lines if you need less / more
		"X-3-X", 							// You can rename the Groups as well
		"X-4-X",
		];
}

// Automatic ProxyGroups
if (MyAuto == true) {
	var MyCountry = $( '#country option:selected' ).text();
	if (MyCountry == 'All') {
		MyCountry = 'All proxies';
	} else if (MyCountry == 'Alle') {
		MyCountry = 'Alle Proxies';
	}
	var proxy = new Array(MyCountry);
}

$('a[href^="proxy:name="]').each(
	function() {
		var MyTable = document.createElement('table');
		MyTable.classList.add("MyTable");
		var MyTr = document.createElement('tr');
		var MyTd1 = document.createElement('td');
		MyTd1.classList.add("MyTd1");
		var MyTd2 = document.createElement('td');
		MyTd2.classList.add("MyTd2");
		//MyTd2.style.backgroundColor = '#777';			// #4c4c4c
		
		var MyImg_orig = document.createElement('img');
		MyImg_orig.src = 'http://static.proxy-listen.de/0_proxy/images/foxyproxy.png';
		var MyLink_orig = document.createElement('a');
		MyLink_orig.title = 'Proxyserver in FoxyProxy übernehmen.';
		MyLink_orig.href = this.href;
		MyLink_orig.style.padding = '0 7px 0 0';
		MyLink_orig.appendChild(MyImg_orig);
		MyTd1.appendChild(MyLink_orig);
		
		this.style.display = 'none';

		for(var i in proxy){
			var MyImg = document.createElement('img');
			MyImg.src = 'http://static.proxy-listen.de/0_proxy/images/foxyproxy.png';
			MyImg.style.MozTransform = 'scaleX(-1)';
			MyImg.style.OTransform = 'scaleX(-1)';
			MyImg.style.webkitTransform = 'scaleX(-1)';
			MyImg.style.msTransform = 'scaleX(-1)';
			MyImg.style.transform = 'scaleX(-1)';

			var MyLink = document.createElement('a');
			MyLink.title = 'FoxyProxy: '+proxy[i];
			MyLink.href = this.href.replace('Proxy-listen.de', proxy[i]);
			MyLink.style.padding = '0 2px';
			MyLink.appendChild(MyImg);
			
			MyTd2.appendChild(MyLink);
		}

		MyTr.appendChild(MyTd1);
		MyTr.appendChild(MyTd2);
		MyTable.appendChild(MyTr);
		$(this).after(MyTable);

	}

);

