// ==UserScript==
// @name				BTDigg_Chart_Adder
// @namespace			BTDigg_Chart_Adder
// @id					BTDigg_Chart_Adder
// @description			adds BTDigg popularity chart for Bit-torrent magnet-links
// @version				0.2.4
// @author				KOLANICH
// @copyright			KOLANICH, 2014
// @homepageURL			https://github.com/KOLANICH/BTDigg_Chart_Adder/
// @icon				https://btdigg.org/favicon.ico
// @license				GNU GPL v3
// @screenshot			./images/screenshots/tpb.png ./images/screenshots/btdigg.png ./images/screenshots/nnm-club.ru.png ./images/screenshots/kickasstorrents.com.png ./images/screenshots/extratorrent.com.png
// @contributionURL		https://github.com/KOLANICH/BTDigg_Chart_Adder/fork
// @contributionAmount	feel free to fork and contribute

// @include				*
// @exclude				/https?\:\/\/btdigg\.org.+/i
// @noframes			1
// @run-at				document-idle
// @optimize			1

// @resource			flotr2lib https://raw.github.com/HumbleSoftware/Flotr2/master/flotr2.min.js
// @resource			tooltipcss ./tooltip.css
// @resource			preloader ./images/preloader.png
// @btdiggBaseURL		http://api.btdigg.org/api/public-8e9a50f8335b964f
// @tooltipWidth		600
// @tooltipHeight		200
// @installationReportIteration	1
// @scriptId			4706
// @downloadURL https://update.greasyfork.org/scripts/4706/BTDigg_Chart_Adder.user.js
// @updateURL https://update.greasyfork.org/scripts/4706/BTDigg_Chart_Adder.meta.js
// ==/UserScript==

/*
Preloader by http://preloaders.net/
Tooltip by http://cssarrowplease.com/
This script is distributed under conditions of GNU GPL v3.
*/

/*
	Copyright (C) 2013-2014  KOLANICH
	
	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	
	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.
	
	You should have received a copy of the GNU General Public License
	along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var btdiggApiBaseURL=GM_getMetadata("btdiggbaseurl")[0];
var tooltipWidth=GM_getMetadata("tooltipwidth")[0];
var tooltipHeight=GM_getMetadata("tooltipheight")[0];
var preloader=new Image();
preloader.src=GM_getResourceURL("preloader");
var arrowHeight=40;
var parseURIRx=/(\w+)=([^&]+)/ig;
var infohashRx=/[A-F0-9]{40}|[A-Z2-7]{32}/i;

var site=null;
var currentLink=null;

var BTDiggReportingEnabled=GM_getValue("enableBTDiggReporting",-1);

if(BTDiggReportingEnabled==-1){
	alert("Usage of this userscript may be very dangerous. Using this you will allow BTDigg site to gather information about magnet links YOU see. This destroys our privacy. We know nothing about BTDigg true intentions, they may be working for copyrust.\nAnother risk is that BTDigg have ssl certificate only for www.btdigg.com and btdigg.com, but noot for api.btdigg.com, so we have to USE UNENCRYPTED PROTOCOL, WHICH MAKES ANYONE WHO CANE EAVESDROP YOUR INTERNET CONNECTION, INCLUDING GOVERNMENT AGENCIES, KNOW WHAT LINKS DO YOU REQUEST STATISTICS FOR");
	alert("Remember:\nYOU DO THIS AT YOUR OWN RISK!!!\n THE AUTHOR(S) IS (ARE) NOT LIABLE FOR ANY DAMAGE OF ANY KIND OR LAW VIOLATION!!!");
	alert("Look BTDigg privacy policy...");
	GM_openInTab("https://btdigg.org/about/privacypolicy.html");
	alert("... and Terms of Service");
	GM_openInTab("https://btdigg.org/about/termsofservice.html");
	enableBTDiggReporting();
}
reportInstallationIfNeeded();

function GM_xhrPr(obj){
	return function(resolve, reject) {
		obj.onload=resolve;
		obj.onerror=reject;
		GM_xmlhttpRequest(obj);
	};
}

function reportInstallationIfNeeded(){
	const instReptItKey="installationReportIteration";
	var instReptIt=GM_getMetadata(instReptItKey.toLowerCase())[0];
	if(GM_getValue(instReptItKey,0)<instReptIt){
		const scriptId=GM_getMetadata("scriptid")[0];
		const greaseForkScripts="https://greasyfork.org/scripts/";
		let token="";
		let pr=new Promise(GM_xhrPr({url:greaseForkScripts+scriptId, method:"GET", ignoreCache:true}))
			.then((xhr)=>findCSRFToken(xhr.responseText))
			.then((token)=>{
				new Promise(GM_xhrPr({
					url:"https://greasyfork.org/script_sets/add_to_set",method:"POST",
					ignoreCache:true,
					data:"utf8=%E2%9C%93&authenticity_token="+encodeURIComponent(token)+"&action-set=ai-336&script_id="+scriptId,
					headers:{"Content-Type":"application/x-www-form-urlencoded"}
				}))
					.then((xhr)=>findCSRFToken(xhr.responseText))
					.then((token)=>{
						new Promise(GM_xhrPr({
							url:greaseForkScripts+scriptId+"/install-ping?authenticity_token="+token,
							method:"POST", ignoreCache:true
						}))
						.then((xhr)=>GM_setValue(instReptItKey,instReptIt));
					});
			});
	}
}

function findCSRFToken(source){
	const tokenFieldRx=/<meta[^<>]*name=(['"])csrf-token\1[^<>]*\/>/i
	const valueRx=/content=(["'])([A-Z0-9+=]*)\1/i;
	let m=source.match(tokenFieldRx);
	if(m[0]){
		m=m[0].match(valueRx);
		if(m[2])return m[2];
	}
	return false;
}


function enableBTDiggReporting(){
	if(
		confirm("Would you like to send BTDigg info about all magnet links clicked by you? I don't recommend you to do this, because any collected information may be used against you in a court of (sword) law. Make sure you wouldn't download anything illegal or copyrighted when you enabled this!!! This feature was implemented because I could implement it and I hope it will help BTDigg to index maget links.")
		&&
		prompt("YOU DO THIS AT YOUR OWN RISK!!!\n THE AUTHOR(S) IS (ARE) NOT LIABLE FOR ANY DAMAGE OF ANY KIND OR LAW VIOLATION!!!\n Now you were warned.\nA you really sure?\nType \"I am warned and accept.\" if you really want to enable this feature.")=="I am warned and accept."
	){
		GM_setValue("enableBTDiggReporting",1);
		alert("BTDigg is now \"spying\" on you\nYou can disable it via script menu.");
		window.location.reload();
		return;
	}
	else{
		alert("Wise decision");
	};
	GM_setValue("enableBTDiggReporting",0);
}

if(BTDiggReportingEnabled==1){
	GM_registerMenuCommand("BTDigg: disable reporting",function(){
		BTDiggReportingEnabled=0;
		GM_setValue("enableBTDiggReporting",BTDiggReportingEnabled);
		alert("Espionage stopped!!!");
		window.location.reload();
	});
}


function checkPlottingLibrary(){
	if(window.Flotr === undefined){
		eval(GM_getResourceText("flotr2lib"));
	}
}
var cssInjected=false;
function checkCssStyle(){
	if(!cssInjected)GM_addStyle(GM_getResourceText("tooltipcss"));
}

/*!
	@param btdescriptor
	{
		link: объект ссылки,
		infohash:инфохеш,
		ещё что-либо
	}
*/
function BTDescriptor(uri){
	if(uri)this.parseMagnetURI(uri);
	console.log(this);
};
BTDescriptor.prototype.parseMagnetURI=function(uri){
	parseURIRx.lastIndex=0;
	var arr=uri.match(parseURIRx);
	for(var i=0;i<arr.length;i++){
		var el=arr[i].split('=');
		//console.log(el);
		this[el[0]]=decodeURIComponent(el[1].replace(/\+/g," "));
	}
	//console.log(this);
	if(this.xt){
		var infohash=this.xt.match(infohashRx)[0];
		if(infohash)this.infohash=infohash;
	}
};
BTDescriptor.parseMagnetURI=function(uri){
	var d=new BTDescriptor();
	d.parseMagnetURI(uri);
	return d;
};

function getMagnetLinksFromPage(){
	return Array.prototype.filter.call(document.querySelectorAll("a[href]"),function(lnk){return lnk.protocol=="magnet:";});
}

var isLoading=0;


function requestTorrentPopularityByLink(btdescriptor){
	return new Promise(GM_xhrPr({
		method:"GET",
		url:btdiggApiBaseURL+"/h02?info_hash="+btdescriptor.infohash,
	})).then(addPlotToPage.bind(btdescriptor),showError);
}

var tooltip=null;

var plotArea;
function checkTooltip(){
	if(!tooltip){
		tooltip=document.createElement("div");
		tooltip.style.zIndex="2147483647";
		tooltip.style.position="absolute";
		checkCssStyle();
		tooltip.className="BTDigg_Chart_Adder_tooltip";
		
		plotArea=document.createElement("div");
		plotArea.style.width=tooltipWidth+"px";
		plotArea.style.height=tooltipHeight+"px";
		
		document.body.appendChild(tooltip);
		tooltip.appendChild(preloader);
		tooltip.appendChild(plotArea);
	}
}

var tooltipCurrentWidth;

/*!
@param link DOMNode to where tooltip should be placed
*/
function placeTooltip(link,offsets){
	console.log(link);
	var linkRect=link.getBoundingClientRect();
	console.log(linkRect);
	tooltip.style.display="";
	tooltip.style.top=(linkRect.top+arrowHeight+window.pageYOffset)+"px";
	tooltip.style.left=(linkRect.left-tooltipCurrentWidth/2+linkRect.width/2+window.pageXOffset)+"px";
	return tooltip;
}

function tsvToArray(txt){
	var arr=txt.split("\n").map(function(el){return el.split("\t").map(function(el){return parseInt(el)});});
	if(Number.isNaN(arr[arr.length-1][0]))arr.splice(arr.length-1,1);
	return arr;
}

function cloneSize(target,donor){
	target.style.width=donor.style.width;
	target.style.height=donor.style.height;
};

function addPlotToPage(evt){
	isLoading=0;//!< 0 is not loading now, 1 is loading now
	//console.log("link descriptor is",this);
	//console.log("got text",evt.responseText);
	currentLink=this.link;
	if(!evt.responseText){
		hideTooltip();
		GM_notification("Info is not available for this torrent");
		return;
	}
	var arr=tsvToArray(evt.responseText);
	console.log("splitted",arr);
	checkPlottingLibrary();
	placeTooltip(currentLink);
	
	//
	var flotrConfig={
		xaxis: {
			mode: 'time',
			timeUnit:"second",
			timeMode:'local',
			labelsAngle: 45,
			showMinorLabels: true,
		},
		selection: {
			mode: 'x'
		},
		grid: {
			minorVerticalLines: true,
		},
		points: {
			show: true,
		},
		lines: {
			show: true,
		},
		HtmlText: false,
	};
	
	if(this.dn)flotrConfig.title=this.dn;
	if(this.xl)flotrConfig.subtitle=this.xl+" Bytes";
	
	tooltip.style.width=tooltipWidth+"px";
	tooltip.style.height=tooltipHeight+"px";
	tooltipCurrentWidth=tooltipWidth;
	
	preloader.style.display="none";
	plotArea.style.display="";
	
	console.log(flotrConfig);
	Flotr.draw(plotArea, [arr], flotrConfig);
	placeTooltip(currentLink);
	
}

function showError(evt){
	console.error(evt.statusText);
}

function hideTooltip(){
	currentLink=null;
	if(!isLoading)tooltip.style.display="none";
}

function showTooltipForLink(evt){
	if(!isLoading){
		checkTooltip();
		tooltip.style.width=preloader.width+"px";
		tooltip.style.height=preloader.height+"px";
		tooltipCurrentWidth=preloader.width;
		
		placeTooltip(evt.target);
		plotArea.style.display="none";
		preloader.style.display="";
		isLoading=1;
		requestTorrentPopularityByLink(evt.target.magnet);
	}
}


/*!
gets some strange info in format

# TSL	numbers divided by tab
# NORM	numbers divided by tab

every number from top line corresponds number from low line
*/
function getSomethingStrange(btdescriptor){
	var data = new FormData();
	data.append("info_hash", btdescriptor.infohash);
	GM_xmlhttpRequest({
		method:"POST",
		url:btdiggApiBaseURL+"/h01",
		onload:console.log,
		onerror:console.warn,
		data:data
	});
}

/*!
this function is needed to send clicked magnet links to btdigg
or to send info about clicked banners
maybe this will help them to collect magnet links to track their torrents' popularity
in any case enabling this must be voluntarily
*/
function sendClick(href,banner){
	var data = new FormData();
	if(banner){
		data.append("banner", href);
	}else{
		data.append("magnet", href);
	}
	console.log("sending click on",link,"...");
	GM_xmlhttpRequest({
		method:"POST",
		url:"https://btdigg.org/click",
		onload:console.info,
		onerror:console.warn,
		data:data
	});
}

function processClick(evt){
	try{
		GM_notification("Info about the click was sent!","BTDigg");
	}catch(e){}
	sendClick(evt.source.href);
}

/*function processScroll(evt){
    console.log(evt);
	if(currentLink)placeTooltip(currentLink,{x:evt.mozMovementX,y:evt.mozMovementY});
}*/

function main(){
	var links=getMagnetLinksFromPage();
	for(var i=0;i<links.length;i++){
		links[i].magnet=new BTDescriptor(links[i].href);
		if(links[i].magnet.infohash){
			links[i].magnet.link=links[i];
			links[i].addEventListener("mouseenter",showTooltipForLink,false);
			links[i].addEventListener("mouseleave",hideTooltip,false);
			if(BTDiggReportingEnabled)links[i].addEventListener("click",processClick,true);
		}
	}
	//document.body.addEventListener("DOMMouseScroll",processScroll,true);
}
main();