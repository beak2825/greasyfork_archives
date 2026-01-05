// ==UserScript==
// @name           Indeed.com: Design like Stepstone
// @namespace      https://greasyfork.org/de/scripts/21365
// @description    This script changes the old-fashioned indeed.com design to the modern Stepstone.com design and adds new useful features like navigation, company search and unlocks 150km search radius.

// @include        *.indeed.com/*
// @include        *.indeed.co.uk/*
// @include        *.indeed.*/*
// @include  	   *proxy-us.hide.me/*
// @run-at         document-end

// @author         lukie80
// @copyright      Creative Commons Attribution-ShareAlike 3.0 Unported (CC-BY-SA 3.0)
// @license        http://creativecommons.org/licenses/by-sa/3.0/
// @version        1.11
// @lastupdated    2016.06.15
// 
// @downloadURL https://update.greasyfork.org/scripts/21365/Indeedcom%3A%20Design%20like%20Stepstone.user.js
// @updateURL https://update.greasyfork.org/scripts/21365/Indeedcom%3A%20Design%20like%20Stepstone.meta.js
// ==/UserScript==
//-------------------------------------------------------------------------------------------------------------------

//needed for finding sponsored jobs, source: http://stackoverflow.com/a/4275177 - needed
function getElementsStartsWithId( id ) {
  var children = document.body.getElementsByTagName('*');
  var elements = [], child;
  for (var i = 0, length = children.length; i < length; i++) {
    child = children[i];
    if (child.id.substr(0, id.length) == id)
      elements.push(child);
  }
  return elements;
}

//needed for CSS replacement
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

//replacing CSS
addGlobalStyle("\
	*{\
		font-family: Trebuchet ms !important; \
    }\
	body{\
		font-family: Trebuchet ms !important; \
		color: #0C2577 !important; \
        background: linear-gradient(#EFF5FA 0px, #EFF5FA 35px,#FFFFFF 205px) !important; \
	} \
	a{\
		color: #0C2577 !important; \
	} \
	a:visited{\
		color: #666 !important; \
	} \
	h1{\
		color: #0C2577 !important; \
	} \
	.company{\
		color: #1260cf !important; \
	} \
	.location{\
		color: #1260cf !important; \
	} \
	.summary{\
		color: #666 !important; \
	} \
	.inwrap{\
		border-right: none !important; \
		border-bottom: none !important; \
	} \
	.input_text{\
		border: thin solid #d4e4f2 !important; \
    } \
    .new{\
		color: #1260cf !important; \
	} \
	.nji{\
		color: #1260cf !important; \
	} \
	.nji nji recDecoration{\
		color: #1260cf !important; \
	} \
	.more_link{\
		color: #1260cf !important; \
	} \
	.iaLabel{\
		color: #1260cf !important; \
	} \
	.result-link-source{\
		color: #1260cf !important; \
	} \
	.date{\
		color: #1260cf !important; \
	} \
	#what_label_top{\
		color: #1260cf !important; \
	} \
	#where_label_top{\
		color: #1260cf !important; \
	} \
	#g_nav{\
		background: #fff !important; \
		border-bottom: thin solid #d4e4f2 !important; \
	} \
	#p_nav{\
		background: #fff !important; \
		border: none !important; \
	} \
	.inwrapBorder{\
		border: none !important; \
		thin solid #d4e4f2 !important; \
	} \
	.lnav{\
		border-spacing: 10px !important; \
	} \
	#pageContent{\
		border-spacing: 10px !important; \
	} \
	#refineresults{\
		background: #eff5fa !important; \
		background: linear-gradient(#EFF5FA 0px, #EFF5FA 35px,#FFFFFF 205px) !important; \
		border: thin solid #d4e4f2 !important; \
		border-radius: 6px !important; \
		padding-top: 17px !important; \
	} \
	#resultsCol{\
		border: thin solid #d4e4f2 !important; \
		border-radius: 6px !important; \
		background-color: #eff5fa !important; \
	} \
	#auxColDiv{\
		border: thin solid #d4e4f2 !important; \
		border-radius: 6px !important; \
		background-color: #eff5fa !important; \
		background: linear-gradient(#EFF5FA 0px, #EFF5FA 35px,#FFFFFF 205px) !important; \
		padding-right: 10px !important; \
		padding-left: 10px !important; \
	} \
	#auxCol{\
		padding: 0px !important; \
	} \
	.femp_item{\
		border: thin solid #d4e4f2 !important; \
		border-radius: 6px !important; \
		background: #ffffff !important; \
	} \
	.separator_top{\
		border-top: none !important; \
		background: none!important; \
	} \
	.separator_bottom{\
		border-bottom: none !important; \
		background: none!important; \
	} \
	.separator_top{\
		border-top: none !important; \
		background: none!important; \
	} \
	.header{\
		background-color: #eff5fa !important; \
	} \
	#cookie-alert{\
		border-radius: 10px !important; \
		border: thin solid #d4e4f2 !important; \
	} \
	.sdn{\
		color: #e09ee0 !important; \
	} \
	#tjobalerts{\
		background: none; \
	} \
	#bjobalerts{\
		background: none; \
	} \
");

//dynamic style application
if (document.getElementsByTagName("h1")[0]){
	document.getElementsByTagName("h1")[0].textContent = "Search: " + document.getElementsByTagName("h1")[0].textContent;
}

if (getElementsStartsWithId("pj_")[0]){
  var badDivs = getElementsStartsWithId("pj_");
  for (var i = 0; i < badDivs.length; i++){
    badDivs[i].style.background = '#fdf9fd';
    badDivs[i].style.border = 'thin solid #f7e6f7';
    badDivs[i].style.margin = "-1px -1px -1px -1px";
    //badDivs[i].remove(); 
    //this can remove the sponsored jobs but this is not suggested 
    //because they are not spam. However they are 
    //quantitative spam.
  }
}

  
var goodDivs = getElementsStartsWithId("p_");
for (var i = 0; i < goodDivs.length; i++){
  if (i % 2 == 0){
    goodDivs[i].style.background = '#f9fbfd';
  } else {
    goodDivs[i].style.background = '#FFFFFF';
  }
  goodDivs[i].style.border = 'thin solid #d4e4f2';
  goodDivs[i].style.margin = "-1px -1px -1px -1px";
  //goodDivs[i].style.borderRadius = '6px';
}

// show a link to google maps navigation
var navOriginEles = document.getElementsByClassName("input_text");
var navDestEles = document.getElementsByClassName("location");
for (var i = 0; i < navDestEles.length; i++){
  	var navDestTxt = navDestEles[i].firstChild.textContent;
  	var navLinkEle = document.createElement('a');
    navLinkEle.href = "https:\/\/www.google.de\/maps\/dir\/"+navOriginEles[1].getAttribute('value')+"\/"+navDestTxt;
  	navLinkEle.innerHTML = "(Navigation)";
  	navLinkEle.setAttribute("target", "_blank");
  	var navSpace = document.createTextNode(" ");
  	navDestEles[i].appendChild(navSpace);
	navDestEles[i].appendChild(navLinkEle);
}

//style improvement
if (getElementsStartsWithId("pj_")[0]){
	getElementsStartsWithId("pj_")[0].parentNode.style.marginBottom="0px";
}
  
if (document.getElementById("auxCol")){
	var tempDiv = document.createElement('div');
	tempDiv.setAttribute("id", "auxColDiv");
	document.getElementById("auxCol").appendChild(tempDiv);
	tempDiv.appendChild(document.getElementById("tjobalertswrapper"));
  	if (document.getElementById("femp_list")){
		tempDiv.appendChild(document.getElementById("femp_list"));
    }
}

// create link company job search
if (document.getElementsByClassName("company")){
  var companyEles = document.getElementsByClassName("company");
  for (var i = 0; i < companyEles.length; i++){
     	   	var companyLinkEle = document.createElement('a');
    		companyLinkEle.href = "http:\/\/"+window.location.href.match(/[\w.]*indeed[\w.]+/)+"\/jobs?q=company:\""+encodeURI(companyEles[i].textContent.replace(/^\s*/, ''))+"\"&amp;l=";
    		companyLinkEle.innerHTML = companyEles[i].textContent;
    		companyLinkEle.setAttribute("target", "_blank");
            companyEles[i].textContent="";
    		companyEles[i].appendChild(companyLinkEle);
  }
}

// add 150km radius
if (document.getElementById("distance_selector")){
  var distEle = document.createElement('option');	
  distEle.innerHTML = "150km";
  distEle.setAttribute("value", "150");
  document.getElementById("distance_selector").appendChild(distEle);
}

if (document.getElementById("radius")){
  var distEle = document.createElement('option');	
  distEle.innerHTML = "150km";
  distEle.setAttribute("value", "150");
  document.getElementById("radius").appendChild(distEle);
}


//-------------------------------------------------------------------------------------------------------------------