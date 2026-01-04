// ==UserScript==
// @name						Politics and War Helper 2
// @author					Ryahn aka Praximus Cladius
// @description			Adds useful functions to the Game Politics and War
// @include					https://politicsandwar.com/*
// @version					0.7.6.12
// @grant						GM_setValue
// @grant						GM_deleteValue
// @grant						GM_getValue
// @grant						GM_xmlhttpRequest
// @namespace				https://github.com/Ryahn/PnWH
// @downloadURL https://update.greasyfork.org/scripts/34969/Politics%20and%20War%20Helper%202.user.js
// @updateURL https://update.greasyfork.org/scripts/34969/Politics%20and%20War%20Helper%202.meta.js
// ==/UserScript==

var vdebug, d, stamp, lastUpdate, pwhThisVersion;

d = new Date();
stamp = d.getTime();
lastUpdate = GM_getValue("lastUpdate", 0);
pwhThisVersion = GM_info.script.version;
vdebug = $_GET("debug");

//Checks for update once every 10 minutes
if (stamp > (lastUpdate + 600000)) {
	GM_setValue("lastUpdate", stamp);
	GM_xmlhttpRequest({
		method: "GET",
		url: "https://greasyfork.org/en/scripts/34969-politics-and-war-helper-2",
		headers: {
			"User-Agent": "Mozilla/5.0",
		},
		onload: function(response) {
			GM_setValue("pwhCurrentVersion", jQuery(response.responseText).find("dd[class='script-show-version']").text());
		}
	});
}
var pwhCurrentVersion = GM_getValue("pwhCurrentVersion");

debug("pwh Current",pwhCurrentVersion,vdebug);

//Save nation name to variable
if(GM_getValue("nationName", 0) == 0){
	getNationName();
	debug("Naion Name Function",getNationName(),vdebug);
}

// ----------------------- FUNCTIONS -----------------------
function $_GET(param) {
	var vars = {};
	window.location.href.replace(location.hash, "").replace(
		/[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
		function(m, key, value) { // callback
			vars[key] = value !== undefined ? value : "";
		}
	);

	if (param) {
		return vars[param] ? vars[param] : null;
	}
	return vars;
}
function debug(name,data,parm) {
	if(parm) {
		console.log("\""+name+": \"\n"+ data);
	}
}

//Function to captitalize strings - http://stackoverflow.com/a/4878800
function toTitleCase(str)
{
	return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

//Saves nation name to a variable
function getNationName(){
	jQuery.get("https://politicsandwar.com/nation", function(response) {
		var data = jQuery.parseHTML(response);
		if(jQuery(response).find("li:contains('Login')").length) {
			GM_deleteValue("nationName");
		} else {
			var nID = jQuery(response).find("td")[1];
			var pwhNationName = jQuery(nID).text();
			GM_setValue("nationName", pwhNationName);
			debug("Nation Name",pwhNationName,vdebug);
		}
	});
}

//Loads city page in invisible iframe to allow buying/selling improvements
function setupCityPage(cityHash){
	var deferred = jQuery.Deferred();
	jQuery(document).find("iframe[id='pwhFrame']").attr("src","https://politicsandwar.com/city/"+cityHash).load(deferred.resolve);
	return deferred.promise();
}

//reloads page or displays errors
function reloadCityManager(){
	if(jQuery("#pwhFrame").contents().find("div[class='alert alert-danger']").length){
		GM_setValue("citmanagerError", jQuery("#pwhFrame").contents().find("div[class='alert alert-danger']").wrap("<div>").parent().html());
		window.location = window.location.href;
	}else{
		window.location = window.location.href;
	}
}

//Waits until current prices are loaded then creates tables
function checkPrices(){
	if(resCount != resources.length * 2){
		setTimeout(checkPrices, 1e3);
	}else{
		createProfitsTable();
		createBuySellTable();
		var now = new Date().getTime();
		if(GM_getValue("dblastUpdate", 0) == 0 ||  Number(GM_getValue("dblastUpdate"))+3.6e+6 < now){
			GM_setValue("dblastUpdate", now);
			GM_xmlhttpRequest({
				method: "POST",
				url: "http://www.ereptools.tk/paw/pnwhelper.php",
				data: "coal="+GM_getValue("sellcoal")+"&oil="+GM_getValue("selloil")+"&bauxite="+GM_getValue("sellbauxite")+"&iron="+GM_getValue("selliron")+"&lead="+GM_getValue("selllead")+"&uranium="+GM_getValue("selluranium")+"&food="+GM_getValue("sellfood")+"&gasoline="+GM_getValue("sellgasoline")+"&aluminum="+GM_getValue("sellaluminum")+"&steel="+GM_getValue("sellsteel")+"&munitions="+GM_getValue("sellmunitions")+"&credits="+GM_getValue("sellcredits"),
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			});
		}
	}
}

function createBuySellTable(){
	jQuery("tbody").append("<tr><th colspan='3'>Buy/Sell Comparison</th></tr>");
	jQuery("tbody").append("<tr><th>Lowest Selling Offer</th><th>Highest Buying Offer</th><th>Difference</th></tr>");
	for(i = 0; i < resources.length; ++i){
		var res = resources[i];
		var sell = GM_getValue("sell"+res);
		var buy = GM_getValue("buy"+res);
		jQuery("tbody").append("<tr><td><img src='/img/resources/"+res+".png' style='height:16px; width:16px;''> "+toTitleCase(res)+" <p style='text-align:right; margin:0; float:right;'><a href='/index.php?id=26&display=world&resource1="+res+"&buysell=sell&ob=price&od=ASC'>$"+sell+"</a></p><td style='text-align:right;'><a href='/index.php?id=26&display=world&resource1="+res+"&buysell=buy&ob=price&od=DESC'>$"+buy+"</a></td><td style='text-align:right;'>$"+(Number(sell)-Number(buy))+"</td></tr>");
	}
}

function createProfitsTable(){
	jQuery("tbody").append("<tr><th colspan='3'>Profit Table<br /><small>*Profits on manufactured products are based on buying needed resources from the market</small></th></tr>");
	jQuery("tbody").append("<tr><th>Resource (ppu)</th><th>Profit</th><th>Start Up Cost</th></tr>");

	for(i = 0; i < resources.length; ++i){
		var res = resources[i];
		var ppu = GM_getValue("sell"+res);
		var profit = "";
		var startUp = "";

		if(res == "food"){
			var savedLand = GM_getValue("savedLand", 1000);
			profit = ppu*(savedLand/25)-300;
			startUp = "$1000";
		}
		if(res == "gasoline"){
			profit = ppu*6-4000-GM_getValue("selloil")*3;
			startUp = "$45000";
		}
		if(res == "oil"){
			profit = ppu*9-600;
			startUp = "$1500";
		}
		if(res == "coal"){
			profit = ppu*6-400;
			startUp = "$1000";
		}
		if(res == "uranium"){
			profit = ppu*3-5000;
			startUp = "$25000";
		}
		if(res == "steel"){
			profit = ppu*9-4000-3*(Number(GM_getValue("selliron")) + Number(GM_getValue("sellcoal")));
			startUp = "$45000";
		}
		if(res == "iron"){
			profit = ppu*6-1600;
			startUp = "$9500";
		}
		if(res == "munitions"){
			profit = ppu*18-3500-6*(GM_getValue("selllead"));
			startUp = "$35000";
		}
		if(res == "lead"){
			profit = ppu*9-1500;
			startUp = "$7500";
		}
		if(res == "aluminum"){
			profit = ppu*9-2500-3*GM_getValue("sellbauxite");
			startUp = "$30000";
		}
		if(res == "bauxite"){
			profit = ppu*6-1600;
			startUp = "$9500";
		}
		if(res != "credits"){
			if(res == "food"){
				jQuery("tbody").append("<tr><td><img src='/img/resources/"+res+".png' style='height:16px; width:16px;'> <a href='/index.php?id=26&display=world&resource1="+res+"&buysell=sell&ob=price&od=ASC'>"+toTitleCase(res)+"</a> ("+ppu+" ppu)  <select id='helperLandSelect' name='helperLandSelect'><option value='1000'>1,000 Land</option><option value='1500'>1,500 Land</option><option value='2000'>2,000 Land</option><option value='2500'>2,500 Land</option></select></td><td id='helperLandProfit' style='text-align:right;'>$"+profit+"</td><td style='text-align:right;'>"+startUp+"</td></tr>");
				jQuery("#helperLandSelect").val(savedLand);
			}else{
				jQuery("tbody").append("<tr><td><img src='/img/resources/"+res+".png' style='height:16px; width:16px;'> <a href='/index.php?id=26&display=world&resource1="+res+"&buysell=sell&ob=price&od=ASC'>"+toTitleCase(res)+"</a> ("+ppu+" ppu)</td><td style='text-align:right;'>$"+profit+"</td><td style='text-align:right;'>"+startUp+"</td></tr>");
			}
		}
	}
}

//Function loads Market page by resource and gets top PPU
function getPrice(resource,method) {
	var sort;
	method = typeof method !== "undefined" ? method : "sell";
	if(method == "sell"){
		sort = "ASC";
	}else{
		sort = "DESC";
	}
	jQuery.get("/index.php?id=90&display=world&resource1="+resource+"&buysell="+method+"&ob=price&od="+sort, function(response) {
		var data = jQuery.parseHTML(response);
		var price = jQuery(data).find("tr:eq(1)").find("td:eq(5)").text().replace(/,/g, "").split(" ");
		GM_setValue(method+resource, price[1]);
		resCount++;
	});
}

//Adds quick links to your cities to the top of the page
function getCityUrls() {
	jQuery("#rightcolumn").prepend("<div class='columnheader' style='font-size: small; line-height: inherit;'><a href='https://politicsandwar.com/city/manager/n="+GM_getValue("nationName")+" style='color:#e7e7e7;'>City Manager</a></div><center style='margin-bottom: 10px; font-size: small;'></center>");
	jQuery.get("/nation/", function(response) {
		var data = jQuery.parseHTML(response);
		var urls = jQuery(data).find("tbody:eq(1)").find("tr:eq(2)").nextUntil("tr:contains('Nation Activity')").each(function(){
			if(jQuery("td:eq(0)", this).text() != "Show More/Less"){
				jQuery("#rightcolumn center").eq(0).prepend(" <a href='"+jQuery("a",this).attr("href")+"#improvements'>"+jQuery("td:eq(0)", this).text()+"</a> ");
				GM_setValue("cityURL", jQuery("a",this).attr("href"));
			}
		});
	});
}

//waits for getImpDesc to finish then inserts improvement descriptions
function showImpDesc(images, desc){
	var impDesc = desc;
	var impImg = images;
	var tooltipCount = 0;
	jQuery(document).find("tbody:eq(0)").find("tr:eq(9)").nextAll().each(function(){
		jQuery(this).find("td:eq(0)").find("b").attr("class", "cooltip").append("<span class='spantip'>"+impImg[tooltipCount] + impDesc[tooltipCount]+"</span>");
		tooltipCount++;
	});
}

//gets Improvements descriptions from city page to use on city manager page
function getImpDesc(callback){
	var impImg = [];
	var impDesc = [];
	jQuery.get(GM_getValue("cityURL"), function(response) {
		var data = jQuery.parseHTML(response);
		jQuery(data).find("table:eq(2)").nextAll().each(function(){
			jQuery(this).find("tr").each(function(){
				jQuery(this).find("td").slice(0, 1).each(function(){
					jQuery(this).find("img").attr("style", "float:right; padding-left:10px;").attr("class", "img-responsive");
					impImg.push(jQuery(this).html());
				});
				jQuery(this).find("td").slice(1, 2).each(function(){
					impDesc.push(jQuery(this).html());
				});

			});
		});
		callback(impImg, impDesc);
	});
}

function addGlobalStyle(css) {
	var head, style;
	head = document.getElementsByTagName("head")[0];
	if (!head) { return; }
	style = document.createElement("style");
	style.type = "text/css";
	style.innerHTML = css;
	head.appendChild(style);
}

addGlobalStyle("html{height: 100%;}body {min-height: 100%;}.modal-backdrop {bottom: 0;position: fixed;}body.modal-open {overflow-y: scroll;padding-right: 0 !important;} b.cooltip{outline:none}b.cooltip strong{line-height:30px}b.cooltip:hover{text-decoration:none}b.cooltip span{z-index:10;display:none;padding:14px 20px;margin-top:-80px;margin-right:-200px;width:60vw;line-height:16px;text-align: left;}b.cooltip:hover span{display:inline;position:absolute;border:2px solid #FFF;color:#EEE;background:#333 url(cssttp/css-tooltip-gradient-bg.png) repeat-x 0 0}.callout{z-index:20;position:absolute;border:0;top:-14px;left:120px}b.cooltip span{border-radius:2px;box-shadow:0px 0px 8px 4px #666}");
