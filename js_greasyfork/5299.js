// ==UserScript==
// @id             ------
// @name           Resource Ballancer 
// @namespace      GregTheMaster
// @author         GregTheMaster
// @description:en   Kiato K28 Ιουλιος 2014
// @copyright      2014+, GregTheMaster
// @version        2014.09.10
// @require        https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @website        https://greasyfork.org/scripts/976/
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @grant          GM_registerMenuCommand
// @grant          GM_listValues
// @grant          GM_addStyle
// @include       http://*.fyletikesmaxes.gr/game.php?*
// @description Kiato K28 Ιουλιος 2014
// @downloadURL https://update.greasyfork.org/scripts/5299/Resource%20Ballancer.user.js
// @updateURL https://update.greasyfork.org/scripts/5299/Resource%20Ballancer.meta.js
// ==/UserScript==

script.name = "Resource ballancer";

var version = "4a";
var debug = 0;
function getGameDoc(winvar) {
    getdoc = winvar.document;
    if(! getdoc.URL.match('game\.php')) {
        for(var i=0; i<winvar.frames.length; i++) {
            if(winvar.frames[i].document.URL.match('game\.php')) {
                getdoc = winvar.frames[i].document;
            }
        }
    }
return getdoc;};
doc = getGameDoc(window);
var main = doc.getElementsByTagName('table'); 

var sitterid="sitter";
var groupid="group";
var villageid="village";
var worldid=doc.URL.match(/en\d+/);
if(doc.URL.match(/t=\d+/)){sitterid=doc.URL.match(/t=\d+/);}
if(doc.URL.match(/group=\d+/)){groupid=doc.URL.match(/group=\d+/);}
if(doc.URL.match(/village=\d+/)){groupid=doc.URL.match(/village=\d+/);}
var urlbase=doc.URL.split("/")[2];

var notebook=0;

var cVillage=0;
var cResources=2;
var cWarehouse=3;
var cMerchants=4;
var cFarmspace=5;

var tw_version = window.game_data.version.substr(window.game_data.version.indexOf(".")-1,1);
tw_version = parseInt(tw_version);
if (tw_version >= 7){twVersion = '7' } else {twVersion = '6.5' }

function MarketMain() {
	var village = new Array();
	var vilCoords = new Array();
	winRef  =  window.open("","ProductionTab");	

	function GetRes() {
		doc = getGameDoc(winRef);
		var main = doc.getElementsByTagName('table'); 
		var wood = 0;  var clay = 0;  var iron = 0;
		for(var a = 0; a < main.length; a++) { 
			if(main[a].className == 'main') { 
				var par = main[a].getElementsByTagName('table'); 
				for(var i = 0; i < par.length; i++) { 
					if(par[i].className == 'vis' || par[i].id == 'production_table') {
					var rows = par[i].getElementsByTagName('tr'); 
						for(var j = 0; j < rows.length; j++) {  
							if(rows[j].className.match(/nowrap/)){  
								if(twVersion == '7'){ if(rows[0].innerHTML.match(/note.png/)){notebook=1;} }
								if(debug == '1'){ alert("Tribal Wars Version: "+twVersion+ "\nThe notebook is: " +notebook); }
								var cells = rows[j].getElementsByTagName('td'); 
								CurVill = cells[cVillage+notebook].getElementsByTagName('span')[2].firstChild.nodeValue.match(/\d+\|\d+/);
								if ( vilCoords[CurVill] == null ){ 
									village.push(CurVill);
									vilCoords[CurVill] =new Array();
									var farmpop = 0;
									var vilurl = cells[cVillage+notebook].getElementsByTagName('a')[0];
									
									if (cells[cResources+notebook].innerText) { 
										var resources = cells[cResources+notebook].innerText;
										vilCoords[CurVill][6] = cells[cWarehouse+notebook].innerText;
										farmpop = cells[cFarmspace+notebook].innerText;
										merchantsAvailable = cells[cMerchants+notebook].innerText.split("/")[0];
										vilCoords[CurVill][5]= vilurl.getElementsByTagName('span')[0].innerText;
									} else  if (cells[cResources+notebook].textContent){
										var resources = cells[cResources+notebook].textContent;
										vilCoords[CurVill][6] = cells[cWarehouse+notebook].textContent;
										farmpop = cells[cFarmspace+notebook].textContent;
										merchantsAvailable = cells[cMerchants+notebook].textContent.split("/")[0];
										vilCoords[CurVill][5]= vilurl.getElementsByTagName('span')[0].textContent;
									} 
									
									
									
									farmpop = farmpop.split("/");
									var farmmax = farmpop[1];
									var farmcurr = farmpop[0];
									
									if ( farmmax > 24000 )
									    farmcurr = farmcurr - (farmmax - 24000);
									vilCoords[CurVill][7] = farmcurr;
									
									vilTotal=resources.split(/\s/);  
									
									for(t=0;t<vilTotal.length;t++){
										vilCoords[CurVill][t] = vilTotal[t].replace(/\./g,'');  
									}
																	
									vilCoords[CurVill][3] = merchantsAvailable;
									vilCoords[CurVill][4] = vilurl.href.match(/village=\d+/)[0].split(/\=/)[1];
							
								}
							}   
						}   
					}           
				}       
				     
			}   
		}        
	}
	

	
	function openPopup() {
	TheNewWin=('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http:\/\/www.w3.org\/TR\/xhtml1\/DTD\/xhtml1-transitional.dtd"><html xmlns="http:\/\/www.w3.org\/1999\/xhtml">');
	TheNewWin+=('<head><title>Extreme TW Resource Balancer Submission Page -- Version '+ version + '<\/title><link rel="stylesheet" type="text/css" href="http://www.extremetw.com/main.css" \/><\/head><body onload=window.focus() style="overflow:visible"> ');
	TheNewWin+=('<p><p><p><table class="main" width="950" align="center" cellspacing="5"><tr><td><p></td></tr><tr><td width="50%" valign="top"><table><tr><td>');
	TheNewWin+=('<form name=ResourceBalanceForm action="http://www.extremetw.com/cgi-bin/ResourceBalancerv'+ version +'.py" method="post"><textarea name="input" rows="14" cols="60">'+msg+'</textarea></td></tr><tr><td>');
	TheNewWin+=('<br><input type="hidden"name="server" value="'+urlbase+'"><input type="submit" value="Submit"/><b> <--Press submit to see your results!</b></tr></td>');
	if(sitterid != "sitter"){TheNewWin+=('<input type="hidden" name="sitter" value="'+sitterid+'&">');}
	TheNewWin+=('<tr><td valign="center"><!-- Beginning of Project Wonderful ad code: --><!-- Ad box ID: 49369 --><map name="admap49369" id="admap49369"><area href="http://www.projectwonderful.com/out_nojs.php?r=0&amp;c=0&amp;id=49369&amp;type=7" shape="rect" coords="0,0,300,250" title="" alt="" target="_blank" /></map><table cellpadding="0" border="0" cellspacing="0" width="300" bgcolor="#ffffff"><tr><td><img src="http://www.projectwonderful.com/nojs.php?id=49369&amp;type=7" width="300" height="250" usemap="#admap49369" border="0" alt="" /></td></tr></table><!-- End of Project Wonderful ad code. --></tr></td>');
	TheNewWin+=('</table></td><td width="50%" valign="top"><table><tr><td><h3><u>Optional</u> Advanced Settings:</h3></td></tr>');
	TheNewWin+=('<tr><td><b><u>Maximum Merchant Travel Distance:</u></b></td></tr>');
	TheNewWin+=('<tr><td><select id="maxFields" name="maxFields"><option value="0">Unlimited</option><option value="25"> < 25 Fields </option><option value="50"> < 50 Fields </option><option value="100"> < 100 Fields </option><option value="200"> < 200 Fields </option><option value="300"> < 300 Fields </option><option value="500"> < 500 Fields </option></td></tr>');
	TheNewWin+=('<tr><td>Use this optional setting to limit how far your merchants will travel.  Please note this can require you to send more groups of merchants than you are used to.  The unlimited option minimizes how many groups of merchants you have to send.</td></tr>');
	TheNewWin+=('<tr><td><b><u>Send Extra Resources:</u></b></td></tr>');
	TheNewWin+=('<tr><td><input type="checkbox" name="extra" value="True"/> This optional setting sends extra resources from villages with 24k farm population to villages with less than 22k farm population. This is ideal for sending extra resources to villages under construction or recruiting troops **This feature currently negates all custom horde settings.**');
	TheNewWin+=('<tr><td><b><u>Horde Resources:</u></b></td></tr>');
	TheNewWin+=('<tr><td>These optional settings allow you to keep (horde) a minimum number of each resource of your choosing, in villages with a surplus of that resource.</td></tr>');
	TheNewWin+=('<tr><td><select id="wood_select" class="wood_select" name="wood"><option value="0" >Do not horde Wood</option><option value="50000" >Horde at least 50k Wood</option><option value="100000" >Horde at least 100k Wood</option><option value="150000" >Horde at least 150k Wood</option><option value="200000" >Horde at least 200k Wood</option><option value="250000" >Horde at least 250k Wood</option><option value="300000" >Horde at least 300k Wood</option><option value="350000">Horde at least 350k Wood</option><option value="400000">Horde ALL Wood</option></select></td></tr>');
	TheNewWin+=('<tr><td><select id="clay_select" class="clay_select" name="clay"><option value="0" >Do not horde Clay</option><option value="50000" >Horde at least 50k Clay</option>	<option value="100000" >Horde at least 100k Clay</option><option value="150000" >Horde at least 150k Clay</option><option value="200000" >Horde at least 200k Clay</option><option value="250000" >Horde at least 250k Clay</option><option value="300000" >Horde at least 300k Clay</option><option value="350000">Horde at least 350k Clay</option><option value="400000">Horde ALL Clay</option></select></td></tr>');
	TheNewWin+=('<tr><td><select id="iron_select" class="iron_select" name="iron">	<option value="0" >Do not horde Iron</option><option value="50000" >Horde at least 50k Iron</option><option value="100000" >Horde at least 100k Iron</option><option value="150000" >Horde at least 150k Iron</option><option value="200000" >Horde at least 200k Iron</option><option value="250000" >Horde at least 250k Iron</option><option value="300000" >Horde at least 300k Iron</option><option value="350000">Horde at least 350k Iron</option><option value="400000">Horde ALL Iron</option></select></td></tr>');
	TheNewWin+=('<tr><td><b>Why would I use these "horde" settings?</b></td></tr><tr><td><b>1. </b>Some players only want to balance a single resource, for example clay.  In that case the player would select "Horde ALL" for wood and iron, and leave the clay setting unchanged. The resource balancer would then only show results to balance your clay.</td></tr>');
	TheNewWin+=('<tr><td><b>2. </b>Another player might want to always keep at least 250,000 iron in his villages that can, instead of sending the excess iron to other villages that need it. In that case the player would select "Horde at least 250k iron" and leave the wood and clay settings unchanged.</form></td></tr>');
	TheNewWin+=('<tr><td><h3><u>Upcoming</u> Advanced Features!</h3></td></tr><tr><td>We are currently working on a new optional advanced setting that will allow you to balance based upon coin/packet ratio, and on another feature that will let you access the resource balancing plan for one week via a unique url. Please post feedback and suggestions here: <a href="http://forum.tribalwars.net/showthread.php?t=172320" TARGET="_blank">http://forum.tribalwars.net/showthread.php?t=172320</a> <p><p>**Currently villages with more than 23950 farm population will have their resources balanced at 85% of your village average.  Villages with less than 22k farm population will begin to receive extra resources on a sliding scale depending on how empty the village farm is up to 200% of your village average.</td></td></table></td></tr></table>');
	TheNewWin+=('<\/a><\/p> <\/body><\/html>');
	var popup1 = window.open('', 'name');
	popup1.document.write(TheNewWin);
	popup1.document.close();
	}
	
	windoc = getGameDoc(winRef);
	if(windoc.URL.match('mode\=prod') ){
		var loadtest = windoc.getElementsByTagName('span');
		if(loadtest[loadtest.length-1].id== "serverDate" || "dev_console"){ 
			GetRes();
			var msg="";
			for(var g = 0; g < village.length ; g++){
				var villageCoords = village[g];
				var newcoords = villageCoords[0];
				var info = vilCoords[villageCoords];
				msg+= info[5] + "\^ " + info[4] +"\^ " + newcoords + "\^ " + info[0] + "\^ " + info[1] + "\^ " + info[2] + "\^ " + info[3]  + "\^ " + info[6] + "\^ " + info[7];
				if(g == village.length - 1){}else {msg+= "\&@& "; } 
			}
			openPopup();
			winRef.close();
			
		} else {alert("Please wait for the page to fully load");}
		
	} else {
		OpenTabs();
		top.parent.focus();

	}
	
		
	function OpenTabs(){
		var urlbase=doc.URL.split("/")[2];
		var tempurl = "/game.php?";
		if(sitterid != "sitter"){tempurl +=  "&" +sitterid;}
		if(villageid != "village"){tempurl +=  "&" +villageid;}
		if(groupid != "group"){tempurl += "&" +groupid;}
		winRef.location.href = tempurl+ "&screen=overview_villages&mode=prod&page=-1";
	}
	
	
}

MarketMain();
void 0;