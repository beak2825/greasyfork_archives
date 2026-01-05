// ==UserScript==
// @name        gw2IdCode
// @namespace   gw2IdCode
// @description Quickly fetch API Code from guildwars2 Wiki pages
// @match     	https://*.guildwars2.com/wiki/*
// @version     1
// @author		Dediggefedde
// @noframes
// @grant       GM_setClipboard
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/29912/gw2IdCode.user.js
// @updateURL https://update.greasyfork.org/scripts/29912/gw2IdCode.meta.js
// ==/UserScript==


var skillEl=document.querySelectorAll("span.chatlink");
var skillElAlt=document.querySelectorAll("span.gamelink");
if(skillEl.length>0||skillElAlt.length>0){
	var n=skillEl.length;
	var targetS;
	for(var i=0;i<n;i++){
		targetS=skillEl[i];
		var el=document.createElement("dt");
		el.innerHTML="API ID";
		targetS.parentNode.parentNode.appendChild(el);
		el=document.createElement("dd");
		el.innerHTML=targetS.innerHTML;
		targetS.parentNode.parentNode.appendChild(el);
	}
	n=skillElAlt.length;
	
	for(var i=0;i<n;i++){
		targetS=skillElAlt[i];
		var el=document.createElement("dt");
		el.innerHTML="API ID";
		targetS.parentNode.parentNode.appendChild(el);
		el=document.createElement("dd");
		el.innerHTML=targetS.getAttribute("data-id");
		targetS.parentNode.parentNode.appendChild(el);
	}
}

function getHTTPid(){
	var targetEl=this;
	if(targetEl.getAttribute("ready")==1){
		GM_setClipboard(targetEl.innerHTML);
		return;
	}
	
	GM_xmlhttpRequest({
		method: "GET",
		url: targetEl.getAttribute("targetLink"),
		onload: function(response){
			var responseXML = null;
			if (!response.responseXML) {
				responseXML = new DOMParser().parseFromString(response.responseText, "text/html");
				var skillElRem=responseXML.querySelector("span.chatlink");
				var skillElRemAlt=responseXML.querySelector("span.gamelink");
				var result=null;
				if(skillElRem)result=skillElRem.innerHTML;
				else if(skillElRemAlt)result=skillElRemAlt.getAttribute("data-id");
				if(result!=null){
					GM_setClipboard(result);					
					var sameList=document.querySelectorAll("span[targetLink='"+targetEl.getAttribute("targetLink")+"']");
					for(var i=0;i<sameList.length;i++){
						sameList[i].innerHTML=result;
						sameList[i].setAttribute("ready",1);
						sameList[i].title="Click to copy to clipBoard";
					}
						sameList[i].innerHTML="";
				}else{
					targetEl.innerHTML="";
					var sameList=document.querySelectorAll("span[targetLink='"+targetEl.getAttribute("targetLink")+"']");
					for(var i=0;i<sameList.length;i++)
						sameList[i].innerHTML="";
				}
			}
		}
	});
}

var skillLink=document.querySelectorAll("table.wikit td a[href*='/wiki/']");
if(skillLink.length==0)
var skillLink=document.querySelectorAll("table.table td a[href*='/wiki/']");
	
var n2=skillLink.length;
var tatSLink;
var newEl;
for(var i=0;i<n2;i++){
	tatSLink=skillLink[i];
	if(!tatSLink.href.match(/wiki\/[^\/\.]+$/i))continue;
	newEl=document.createElement("span");
	newEl.innerHTML="#";
	newEl.title="Click to fetch and copy to clipBoard";
	newEl.style="margin-left:5px;cursor:pointer;color:blue;";
	newEl.setAttribute("targetLink",tatSLink.href);
	tatSLink.parentNode.insertBefore(newEl,tatSLink.nextSibling);
	newEl.addEventListener("click",getHTTPid,false);
}