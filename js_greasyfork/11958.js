// ==UserScript==
// @name NeoGAF - Highlight OP posts
// @namespace NeoGafOPHiglighter
// @description Highlights posts from the original poster of a thread on NeoGAF
// @include http://www.neogaf.com/forum/showthread*
// @include http://neogaf.com/forum/showthread*
// @version 0.459
// @downloadURL https://update.greasyfork.org/scripts/11958/NeoGAF%20-%20Highlight%20OP%20posts.user.js
// @updateURL https://update.greasyfork.org/scripts/11958/NeoGAF%20-%20Highlight%20OP%20posts.meta.js
// ==/UserScript==

//var color = "#D3E6F9";
//var themeElement = document.getElementsByClassName("sep");
//if(themeElement.length > 0){
//	var themeName = themeElement[0].getElementsByTagName("a")[0].getAttribute('title');
//	if(themeName === "Switch to Default Theme"){
//		color = "rgb(73, 80, 86)";
//	}
//}

var linkCss = ".postbit-details-username.ophg{padding: 3px 0px 3px 3px;\
    border-radius: 2px;\
    width: 148px;\
    margin-left: -8px;\
    background-color: #01518e;}";

var linkHoverCss = ".postbit-details-username.ophg:hover{background-color: #4982ae!important;}";

var linkDivCss = ".ophginner{float: right;\
    background-color: #4982ae;\
    height: 20px;\
    width: 30px;\
    color: white;\
    text-align: center;\
    padding-top: 4px;\
    margin-top: -3px;\
    margin-right: -1px;\
    font-size: 10px;\
    border-radius: 2px;}";

var css = linkCss + linkHoverCss + linkDivCss;
style = document.createElement('style');

if (style.styleSheet) {
    style.styleSheet.cssText = css ;
} else {
    style.appendChild(document.createTextNode(css));
}
document.getElementsByTagName('head')[0].appendChild(style);

var url = window.location.href;
var res1 = url.search("page");
var res2 = url.search("p=");
if(res1 != -1 || res2 != -1) {
    if(res1 != -1){
        url = url.substring(0, url.indexOf("&page"));
    }
    else if(res2 != -1){
    	//var threadElement = document.getElementsByClassName("pagenav-popup");
   		//var threadLink = threadElement[0].getAttribute("title");
   		//url = url.substring(0, url.indexOf("showthread"));
   		//url += threadLink;
   		var threadElement = document.getElementsByClassName("left");
   		var threadLink = threadElement[1].getElementsByTagName("a")[0].href;
   		url = threadLink;
    }
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = 'document';
	xhr.send();
	xhr.onload = function foo(e) {  
		var doc = e.target.responseXML;
		var OPName = GetOPName(doc);
		ChangePostByOPName(OPName);	
	}
}
else {
	var OPName = GetOPName(document);
	ChangePostByOPName(OPName);	
}

function GetOPName(doc){
	var list = doc.getElementsByClassName("postbit-details-username");
	if(list.length > 0){
		return list[0].getElementsByTagName("a")[0].textContent;	
	}
}

function ChangePostByOPName(OPName){
	var list = document.getElementsByClassName("postbit-details-username");
	var possOPName;
	for (var i = 0; i < list.length; i++){
		 possOPName = list[i].getElementsByTagName("a")[0];
		if(possOPName.textContent == OPName){
			list[i].className += " ophg";
			list[i].children[0].style.color = "white";
            var el =  document.createElement("div");
            el.className = "ophginner";
            el.innerText = "OP";
			list[i].appendChild(el);
			if(list[i].children[0].innerText.length > 19)
			    list[i].style["font-size"] = "10px";
			
		        if(list[i].children[0].innerText.length > 23)
			    list[i].style["font-size"] = "8px";
			//possOPName.parentNode.parentNode.parentNode.style.backgroundColor = color;
		}
	}
}