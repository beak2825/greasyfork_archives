// ==UserScript==
// @name        AliExpress Ultra Efficient
// @namespace   Mikhoul
// @description Sort Price from Low to High, Put Items in View list All  Automatically
// @include     http*://*.aliexpress.com/af/*
// @include     http*://*.aliexpress.com/w/*
// @include     http*://*.aliexpress.com/wholesale*
// @version     1.01
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/27093/AliExpress%20Ultra%20Efficient.user.js
// @updateURL https://update.greasyfork.org/scripts/27093/AliExpress%20Ultra%20Efficient.meta.js
// ==/UserScript==


//  Prices Low to High
	 
	if (window.location.href.indexOf("&SortType=price_asc") == -1) //vérifie si les prix  sont ascendant ET si non les met ascendant dans l'url
	{
		var url = window.location.href;
		var priceAsc = "&SortType=price_asc";
		url += priceAsc;
		window.location = url; 
	//	alert("Alert #1 Price Ascendant");
	}	 
	
	if (window.location.href.indexOf("&SortType=default") > -1) // Vérifie si ""&SortType=default" existe ET si OUI l'enlève
	{	
		location.href = location.href.replace(/(\&S(\w+)=(\w+)ault)/, "");  //Cherche "&SortType=default" et le remplace par RIEN
	}
	
// Free Shipping 	
	
	if (window.location.href.indexOf("&isFreeShip=y") == -1) //vérifie si les SHIPPING est gratuit ET si non le met à gratuit
	{
		var url = window.location.href;
		var freeShip = "&isFreeShip=y";
		url += freeShip;
		window.location = url;
	//	alert("Alert #2 Free Shipping");
	}	

	if (window.location.href.indexOf("&isFreeShip=n") > -1) // Vérifie si "&isFreeShip=n" existe ET si OUI l'enlève
	{	
		location.href = location.href.replace(/(\&isF(\w+)=(n))/, "");  //Cherche "&isFreeShip=n" et le remplace par RIEN
	}	
	 
// Seller sell in Quantity 1	 
	 
	 if (window.location.href.indexOf("&isRtl=yes") == -1) //vérifie si les articles sont pour Prix Unitaire Qt1 ET si non les met unitaires
	{
		var url = window.location.href;
		var priceRtlUnit = "&isRtl=yes";
		url += priceRtlUnit;
		window.location = url;
	//	alert("Alert #3 1 Piece/RTL Only");
	}	 
	 
// View LIST instead of Gallery 
	 
	if (window.location.href.indexOf("&g=n") == -1) //vérifie si le mode List est actif ET si NON actif change l'url pour l'activer
	{ 
		var url = window.location.href;
		var modeList = "&g=n";
		url += modeList;
		window.location = url;
	//	alert("Last Alert: Mode list");
	}
	
	if (window.location.href.indexOf("&g=y") > -1) // Vérifie si "&g=y" existe ET si OUI l'enlève
	{	
		location.href = location.href.replace(/(\&g)=(\y)/, "");  //Cherche "&g=y" et le remplace par RIEN
	}
	
	

