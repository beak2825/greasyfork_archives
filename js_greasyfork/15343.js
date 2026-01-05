// ==UserScript==
// @name        FastNav
// @namespace   hugsmile.eu
// @include     *
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wYBBicLUdqBwAAAA1lJREFUWMPFl0tIVFEYx39nug46qE1DYoWU1KJAKZHEoEVRLhwXQUFGKG6CHpsy7KlEi/BJA7myxyKoGSKDAhfpwoIWQWJgQzNQQTZa9DJKKjTG0dPijDo6984cG6UPLsy9c875/8/3/oSUEl15FITuF8iBIQiNwOiY+u50QP5KKMoH9xZEWaH2kQgdAie9yPZukBHASLI4uqa2HBoPIBz2FAg0dyHrfRqgVjIBTdVwfg9iwQQKzyKDw4CN1GQKCtZC/yVEup04JnEEJibBdRj5+w+LKpnpEGpHuDLnkogjkHVo8cFjSXztQGTE+IVtvtqXChzg9x8oucCcG9tiHS44nCLCpApJItZLgsMKK45AvTd1h3MXw48bcO0IELZYZIN6H4yFYwicvI0kzWKDVDfTeVY51ZbDu8BXm4CEAQ13lRaElBJbFebBOAmXayDPBToJc0MulKyffX/wHPa1gdnlBDDlQxi9AesM5y6Guop/N8nerVC9E7xPTRQbgd4AGD1+pFWmexSEgRCsWaEHmGGH7IzZ99A36OyzNkOPH2kMDFkfGI5A8ZmojTWkugxuH1O/33yCTacgkeUGhsAIjSQ5Nc3chqYOHk1xL9/D5rNgXQGiGhoBY7qkLobcegLjYbj3LDk4qHKuH/kS9peq4mKtArjXpwc+s8Xp0AP3t0DncajZsXgaczrAyM+Bwa+JF77ywMbV0eoqAd16sSyx/+TngKjzSul5aL7AbsBrj2q3puXnuLKzjnz8Adsuqmgyk7oKMMq3IDxd5rmgsnQuOKg4j431RJK7HHYXQLffvHUrL0IkTsUTcP807C2Z/dQ/CG+/aDSbAj58h1O3oqawSsUAJ8rhSo95DtjXBt5aqNquPnX0ws3Hui5uDg5wwh1TDZsOICxruB2qr8D1KOjn0eihOo+w7pwbK9W/My1ZSxfy/J0EPUEEnNkw+sv6VrpNavNBOLdnHoGZTvgDSyoFeRBondXNHALjE5B7FPnrfzWl6Wnwrh2Rlb404KF2NRuYNqXToeHKhC9XEYV5SfL+QgaTPHXz+TMBZi4ngIw0eNmKaD6YuMNNKhHlcIFWpXbxL8PpWBgaOhc2nApD5ZaUh9O4Fi0A3X7kiyF4N388z4GideAuQpQV6CvpLyjrNaUqOdRiAAAAAElFTkSuQmCC
// @description Quickly navigate to the next page with your keyboard. Press n to go to the next page, press p to go to the previous page.
// @version     0.5.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/15343/FastNav.user.js
// @updateURL https://update.greasyfork.org/scripts/15343/FastNav.meta.js
// ==/UserScript==
(function(){
var pagenum;
var typeahead_value;

window.addEventListener("keyup", function (event) {
  if (event.defaultPrevented) {
    return;
  }
  
  // check if modifier is pressed (ctrl, shift)
  // if pressed, return
  if(event.getModifierState("Shift") || event.getModifierState("Control") || event.getModifierState("Meta") || event.getModifierState("OS") || event.getModifierState("AltGraph")){
	return;
  }
  if(event.getModifierState("Alt") && (typeahead_value == false || isMediaWiki() == true )){
	return;
  }

  switch (event.keyCode) {
    case 78:
		// order is important here
		if(document.hasFocus() && document.activeElement.tagName == "BODY"){
			generic("next");
		}else{
			return;
		}
      break;
    case 66:
    case 80:
		// order is important here
		if(document.hasFocus() && document.activeElement.tagName == "BODY"){
			generic("prev");
		}else{
			return;
		}
      break;
    case 79:
      if(document.hasFocus() && document.activeElement.tagName == "BODY"){
		genericOpen();
	  }else{
		return;
	  }
	  break;
    default:
      return;
  }

  // don't allow for double actions for a single event
  event.preventDefault();
}, true);

function isMediaWiki(){
	//generator
	var counter;
	var metaTags = window.document.getElementsByTagName("meta");
	for(counter = 0; counter < metaTags.length; counter++){
		if(metaTags[counter].getAttribute("name") == "generator"){
			if(metaTags[counter].getAttribute("content").indexOf("MediaWiki") > -1){
				return true;
			}else{
				return false;
			}
		}
	}
	return false;
}

function cleanurl(url){
	return decodeURIComponent(url.replace("&amp;", "&"))
}

function replacelocation(value, website){
	//alert(value + " - " + website);
	window.location.href = value;
}

function generic(mode){
	var location= window.location.href;
	var lastIndex = location.lastIndexOf("=");
	var pageNumber = location.substring(lastIndex+1);
	var stringlength = 1;
	var i = 0;

	// phoronix.com, http://punbb.informer.com, FluxBB
	// http://www.phoronix.com/forums/forum/phoronix/latest-phoronix-articles/823939-the-best-most-efficient-graphics-cards-for-1080p-linux-gamers/page2
	var linkTags = window.document.getElementsByTagName("link");
	for(i = 0; i < linkTags.length; i++){
		if(linkTags[i].getAttribute("rel") == mode){
			replacelocation(linkTags[i].getAttribute("href"), "<link rel");
			return;
		}
	}
	
	// reddit.com, phpBB
	var atags = document.getElementsByTagName("a");
	for(i = 0; i < atags.length; i++){
		if(atags[i].hasAttribute("rel")){
    	    if(atags[i].getAttribute("rel").indexOf(mode) > -1){
				replacelocation(atags[i].href, "<a rel");
				return;
			}
	   }
	}
	
	// MyBB
	if(mode == "next"){
		var value = document.getElementsByClassName("pagination_next")[0];
		if(value != undefined){
			replacelocation(document.getElementsByClassName("pagination_next")[0], "mybb (pagination_next)");
			return;
		}
	}
	
	if(location.indexOf("techradar.com") > -1){
		if (mode == "next" && location.lastIndexOf("/") < location.length - 3){ // there is no page filled in, add it
			replacelocation(window.location.href + "/2", "techradar.com");
			return;
		}

		if(location.lastIndexOf("/") > -1 && location.lastIndexOf("/") > location.length - 3){
			// increment or decrement
			lastIndex = location.lastIndexOf("/");
			pageNumber = location.substring(lastIndex+1);
				
			if(mode == "next"){
				window.location.href = window.location.href.substring(0, lastIndex) + "/" + (parseInt(pageNumber) + 1)
			}else{
				if(parseInt(pageNumber) == 2){
					window.location.href = window.location.href.substring(0, lastIndex) // there is a page filled in, remove it
				}else{
					window.location.href = window.location.href.substring(0, lastIndex) + "/" + (parseInt(pageNumber) - 1)
				}
			}
			return;
		}
	}
	
	// webwereld.nl, computerworld.nl etc.
	var paginatorNext = window.document.getElementsByClassName("paginator-next")[0];
	var paginatorPrevious = window.document.getElementsByClassName("paginator-previous")[0];
	
	if(mode == "next"){
		if(paginatorNext != undefined){
			replacelocation(paginatorNext.href, "webwereld next");
		}
	}else{
		if(paginatorPrevious != undefined){
			replacelocation(paginatorPrevious.href, "webwereld previous");
		}
	}
	
	// jenkov.com
	var nextPageJenkovCom = window.document.getElementsByClassName("nextArticleInCategory")[0];
	if(nextPageJenkovCom != null){
		if(mode == "next"){
			replacelocation(nextPageJenkovCom.parentElement.href, "jenkov.com");
			return;
		}else{
			window.history.back();
			return;
		}
	}
	
	// waarmaarraar.nl (prev/next article)
	if(location.indexOf("waarmaarraar.nl") > -1){
		var container = document.getElementsByClassName("span7")[0];
		var ahrefs = container.getElementsByTagName("a");
		var newahrefs = [];
		
		for(counter = 0; counter < ahrefs.length; counter++){
			var hrefattribute = ahrefs[counter].getAttribute("href");
			if(hrefattribute == null){
				continue;
			}
			if(hrefattribute.indexOf("/pages/re") > -1){
				newahrefs.push(ahrefs[counter]);
			}
		}

		if(newahrefs.length == 2){
			if(mode == "next" ){
				replacelocation(newahrefs[1].getAttribute("href"), "waarmaarraar.nl next");
			}else{
				replacelocation(newahrefs[0].getAttribute("href"), "waarmaarraar.nl prev");
			}
			return;
		}
		if(newahrefs.length == 1){
			// there is no previous/next page?
			replacelocation(newahrefs[0].getAttribute("href"), "waarmaarraar.nl next/prev");
			return;
		}
	}

	// chm
	var ahrefs = window.document.getElementsByClassName("a");
	var i = 0;
	for(i = 0; i < ahrefs.length; i++){
		if(ahrefs[i].getAttribute("alt") == "Next Page" && mode == "next"){
		}
		
		if(ahrefs[i].getAttribute("alt") == "Previous Page" && mode == "prev"){
			window.location.href = ahrefs[i];
		}
		return;
	}
	
	// clixsense adgrid
	if(location.indexOf("clixsense.com/en/ClixGrid") > -1){
		// /10/7?69738**
		var lastIndexSlash = location.lastIndexOf("/");
		var lastQuestionMark = location.lastIndexOf("?");
		var indexSlash = location.indexOf("/", lastIndexSlash - 6);
		
		var column = parseInt(location.substring(indexSlash+1,lastIndexSlash));// 1-30
		var row =  parseInt(location.substring(lastIndexSlash+1, lastQuestionMark)); // 1-20
		var userid = location.substring(lastQuestionMark + 1)
		if(mode == "next"){
			if(column < 30){
				column = column + 1;
			}else{
				if(row < 20){
					row = row + 1;
				}
			}
		}else{
			if(column > 1){
				column = column - 1;
			}else{
				if(row > 1){
					row = row - 1;
				}
			}
		}
		window.location.href = "http://www.clixsense.com/en/ClixGrid/" + column + "/" + row + "?" + userid;
		return;
	}
	
	// generic
	if(lastIndex == -1){
		//page-1
		stringlength = 5
		lastIndex = location.lastIndexOf("page-");
		pageNumber = location.substring(lastIndex+stringlength);
	}
	
	if (isNaN(parseInt(pageNumber) + 1) == false){
		if(mode == "next"){
			pagenum = parseInt(pageNumber) + 1;
		}else{
			// prev
			pagenum = parseInt(pageNumber) - 1;
		}
		var addendum = location.substring(lastIndex + stringlength+1);
		if(!isNaN(addendum)){
			addendum = "";
		}
		replacelocation(location.substring(0,lastIndex + stringlength) + pagenum + addendum, "generic");
	}
}
function genericOpen(){
	var i = 0;
	var location= window.location.href;
	
	if(location.indexOf("twoo.com") > -1){
		
		var photoCover = document.getElementsByClassName("photoCover")[0];
		var linkToProfile = "https://www.twoo.com/" + photoCover.getAttribute("data-user-info");
		//window.location.href = linkToProfile;
		
		/*var photoCoverTitle = document.getElementsByClassName("photoCover__info__title")[0];
		var profileAhref = photoCoverTitle.getElementsByTagName("a");
		profileAhref.setAttribute("href", linkToProfile);*/
		window.open(linkToProfile);
		return;
	}
	
	// waarmaarraar.nl
	if(location.indexOf("waarmaarraar.nl") > -1){
		// Read more
		var nextPageWMR = window.document.getElementsByClassName("readmore")[0];
		if(nextPageWMR != null){
			var alink = nextPageWMR.getElementsByTagName("a")[0];
			if(mode == "next"){
				window.location.href = alink.href;
				return;
			}
		}
		// Bronsite
		var alinks = document.getElementsByTagName("a");
		for(i = 0; i < alinks.length; i++){
			// ©
			var onclick = "";
			try{
				onclick = alinks[i].getAttribute("onclick");
			}catch(e){
				continue;
			}
			if(onclick == null){
				continue;
			}
			
			if(onclick.indexOf("/bronsite/") > -1){
				window.location.href = alinks[i].getAttribute("href");
				return;
			}
			
		}
	}
	
	// reddit interstitial page
	var interstitial = document.getElementsByClassName("interstitial")[0];
	if(interstitial != undefined){
		var buttons = document.getElementsByTagName("button");
		for(i = 0; i < buttons.length; i++){
			if(buttons[i].getAttribute("value") == "yes"){
				buttons[i].click();
				return;
			}
		}
	}
	
	if(location.indexOf("reddit.com") > -1){
		var titles = document.getElementsByClassName("title");
		for(i = 0; i < titles.length; i++){
			if(titles[i].hasAttribute("href")){
				window.location.href = titles[i].getAttribute("href");
				return;
			}
		}
	}
}

})();
