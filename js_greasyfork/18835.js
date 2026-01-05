// ==UserScript==
// @name         DeviantArt - Iframe embedding
// @namespace    http://tampermonkey.net/
// @version      0.17
// @description  Allows external content to be displayed on DeviantArt.
// @author       RSGmaker
// @match        http://*.deviantart.com/*
// @match        https://*.deviantart.com/*
// @match        http://sta.sh/*
// @match        https://sta.sh/*
// @match        http://deviantart.com/*
// @match        https://deviantart.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18835/DeviantArt%20-%20Iframe%20embedding.user.js
// @updateURL https://update.greasyfork.org/scripts/18835/DeviantArt%20-%20Iframe%20embedding.meta.js
// ==/UserScript==



(function() {
    'use strict';
	//The div tag with the main image(and the different sized variants) in it.
	var devcontent = document.getElementsByClassName("dev-view-deviation")[0];
	//The url to use for the iframe.
	var link = null;
	var target = null;
	//The size of the main image(we apply the size to the iframe).
	var W = 0;
	var H = 0;
	//What the content div had before messing with it(when the user clicks "cancel", the innerHTML is set back to this).
	var oldHtml;
	//The journal/text content, if this isn't an art deviation.
	var journal = null;
	//The div containing the warning message, if this is a journal, it will hold the iframe instead of devcontent.
	///var warningDiv = null;
	//the user name of the deviation's owner.
	var username = "";
	//If false, the "Don't ask me again" checkbox is removed.
	var allowAutoLoad=false;
	//The saved "Don't ask me again" state("-1"=block,"0"=ask,"1"=autoload,"false"=unsupported).
	var autoLoad="0";
	//The "Don't ask me again" checkbox.
	var rememberDecision = null;
	
	var contextMenu = null;
	
	var loadenabled = true;
	if (document.getElementsByClassName("grf-indent").length>0)
	{
		journal = document.getElementsByClassName("grf-indent")[0].childNodes[1];
	}
	//The user clicked "Load content".
	function loadiframe()
	{
		var ifrm = document.createElement("IFRAME");
		ifrm.sandbox = "allow-forms allow-pointer-lock allow-scripts allow-same-origin";
		ifrm.width = W;
		ifrm.height = H;
		ifrm.setAttribute('allowFullScreen', '')
		
		var SRC = this.link.href.replace("http://www.deviantart.com/users/outgoing?","").replace("https://www.deviantart.com/users/outgoing?","");
		if (SRC.indexOf("https://greasyfork.org/en/scripts/18835-")==0)
		{
			//SRC = SRC.split("?")[1];
			SRC = SRC.substr(SRC.indexOf("?")+1);
		}else{
        }
		ifrm.src = SRC;
		var ihtml = "<iframe sandbox='allow-forms allow-pointer-lock allow-scripts allow-same-origin' width='"+W+"' height='"+H+"' src='"+SRC+"'></iframe>";;
		var T = devcontent;
		if (journal == null)
		{
			//devcontent.innerHTML = ihtml;
			//clearChildren(devcontent);
		}
		else
		{
			//warningDiv.innerHTML = ihtml;
			//clearChildren(warningDiv);
			//T = warningDiv;
			T = this.warningDiv;
		}
		clearChildren(T);
		var DV = document.createElement("DIV");
		DV.style = "background-color:white";
		DV.appendChild(ifrm);
		/*var tbl = document.createElement("TABLE");
		tbl.border=1;
		var row = tbl.insertRow(-1);
		var col = row.insertCell(-1);
		var button = document.createElement("P");
		button.style="display:inline";
		button.innerHTML = "...";
		col.appendChild(button);
		DV.appendChild(tbl);*/
		var Btn = document.createElement("INPUT");
		Btn.type = "button";
		Btn.value = "...";
		Btn.title = "Iframe options";
		
		DV.appendChild(Btn);
		T.appendChild(DV);
		if (contextMenu != null)
		{
			contextMenu.parentNode.removeChild(contextMenu);
		}
		contextMenu = document.createElement("UL")
		var offset = cumulativeOffset(Btn);
		var cancel = false;
		Btn.onclick = function() {
			contextMenu.style.visibility="visible";
			//contextMenu.style.right = (offset.left-30)+"px";
			//contextMenu.focus();
			cancel = true;
		};
		contextMenu.onfocusout = function() {
			//contextMenu.style.visibility="collapse";
			
			if (!cancel)
			{
				//contextMenu.style.right = (-2000)+"px";
				contextMenu.style.visibility="hidden";
			}
			cancel = false;
		};
		document.body.onclick = contextMenu.onfocusout;
		contextMenu.onblur=contextMenu.onfocusout;
		DV.onfocusout = contextMenu.onfocusout;
		contextMenu.onclick = contextMenu.onfocusout;
		contextMenu.border = 1;
		
		contextMenu.style = "padding-left: 0px;border: 1px solid black;cursor: pointer;list-style-type:none;z-index:100;position:absolute;right:"+(offset.left-30)+"px;top:"+(offset.top+12)+"px;background-color:white;visibility:hidden";
		contextMenu.width = "30%";
		var listyle = "border-bottom: 1px solid black; ";
		var li=document.createElement('li');
		li.innerHTML = "Close";
		li.onclick = cancelload;
		li.style = listyle;
		li.title = "Closes this Iframe";
		li.target = this.target;
		li.link = this.link;
		li.warningDiv = this.warningDiv;
		contextMenu.appendChild(li);
		li=document.createElement('li');
		li.innerHTML = "Pop out";
		li.title = "Opens this Iframe in another tab";
		li.target = this.target;
		li.link = this.link;
		li.warningDiv = this.warningDiv;
		li.onclick = function() {
			window.open(ifrm.src);
			//ifrm.src = "";
			ifrm.srcdoc="<p>The content has been popped out.<br/>Click to reload.</p>";
			DV.target = this.target;
			DV.link = this.link;
			DV.warningDiv = this.warningDiv;
			DV.onclick = loadiframe;
			var overlay = document.createElement("DIV");
			overlay.style = "top:0;left:0;width:100%;height:100%;position:absolute;";
			DV.appendChild(overlay);
			DV.onclick = loadiframe;
			};
			li.style = listyle;
		contextMenu.appendChild(li);
		//
		li=document.createElement('li');
		li.innerHTML = "Fullscreen";
		li.title = "Puts the iframe in fullscreen mode";
		li.target = this.target;
		li.link = this.link;
		li.warningDiv = this.warningDiv;
		li.onclick = function() {
			//ifrm.requestFullscreen();
			if (ifrm.mozRequestFullScreen) {
				ifrm.mozRequestFullScreen();
			} else if (ifrm.webkitRequestFullScreen) {
				ifrm.webkitRequestFullScreen();
			}
		};
			li.style = listyle;
		contextMenu.appendChild(li);
		
		document.body.appendChild(contextMenu);
		//DV.appendChild(contextMenu);
		if (autoLoad=="0" && rememberDecision != null && rememberDecision.checked)
		{
			if (confirm("Are you sure you want to automatically load all content from the user:"+username+"?"))
			{
				GM_setValue("autoLoad_"+username,"1")
			}
		}
	}
	var cumulativeOffset = function(element) {
    var top = 0, left = 0;
    do {
        top += element.offsetTop  || 0;
        left += element.offsetLeft || 0;
        element = element.offsetParent;
    } while(element);

    return {
        top: top,
        left: left
    };
};
	function clearChildren(element)
	{
		while (element.firstChild) {
			element.removeChild(element.firstChild);
		}
	}
	//The user clicked "Cancel".
	function cancelload()
	{
		if (journal == null)
		{
			devcontent.innerHTML = oldHtml;
		}
		else
		{
			this.warningDiv.parentNode.replaceChild(this.target,this.warningDiv);
		}
		if (autoLoad=="0" && rememberDecision != null && rememberDecision.checked)
		{
			GM_setValue("autoLoad_"+username,"-1")
		}
	}
	function getTextWithinText(text,startText,endText)
	{
		var SI = text.indexOf(startText);
		var EI = text.indexOf(endText,SI+startText.length);
		if (SI>=0 && EI>SI)
		{
			return text.slice(SI+startText.length,EI);
		}
		return null;
	}
	function checkForEmbed(startCommandText,endCommandText,loadFunction)
	{
		if (devcontent)
    {
		link = null;
		target = null;
		oldHtml = devcontent.innerHTML;
		W = 0;
		H = 0;
		//All <a> tags within the deviation description.
		var links = null;
		if (journal != null)
		{
			links = journal.getElementsByClassName("external");
		}
		else
		{
			links = document.getElementsByClassName("text block")[0].getElementsByClassName("external");
		}
        //alert("a");
		//hidden links
		if (document.getElementsByClassName("[iframe-embed]").length>0)
		{
            /*alert("b");
			link = document.getElementsByClassName("[iframe-embed]")[0];
            if (link.nodeName.toLowerCase()=="div")
            {
                link = link.getElementsByClassName("external")[0];
                alert("link:"+link);
            }
            else*/
            {
			var S = link.parentNode.className;
			target = link.parentNode;
			if (S && S!="" && S.indexOf(",")>0)
			{
				W = S.split(",")[0];
				H = S.split(",")[1];
			}
            }
		}
		//hidden links method#2
		if (link == null)
		{
			var L = document.getElementsByClassName("text block")[0].getElementsByTagName("A");
			var i = 0;
            var litem = null;
			while (i < L.length)
			{
				var item = L[i];
				if ((!item.id || item.id=="") && item.parentNode.nodeName.toLowerCase()=="div" && item.parentNode.className != "text block" && item.parentNode != journal)
				{
					if (!item.innerHTML || item.innerHTML=="")
					{
                        if (item.href.indexOf("https://greasyfork.org/en/scripts/18835-")>=0 && item.href.indexOf("?")<item.href.length-3 )
                        {
                            link = litem;
                        }
                        else
                        {
                            link = item;
                        }
					}
				}
                litem = item;
				i++;
			}
		}
		if (link==null && !(links && links.length>0))
		{
			return;
		}
		var i = 0;
		//Search for an "[iframe-embed]" command within the description.
		if (link == null)
		{
		while (i < links.length)
		{
			var text = links[i].innerHTML.toLowerCase();
			var ind = text.indexOf(startCommandText);
			if (ind>=0 && text.indexOf(endCommandText)>ind)
			{
				link = links[i];
				target = link;
				var tmp = getTextWithinText(text,"width=\"","\"");
				if (tmp != null)
				{
					W = tmp;
				}
				tmp = getTextWithinText(text,"height=\"","\"");
				if (tmp != null)
				{
					H = tmp;
				}
				i = links.length;
			}
			else
			{
				var SRC = links[i].href.replace("http://www.deviantart.com/users/outgoing?","").replace("https://www.deviantart.com/users/outgoing?","");
				if (SRC.indexOf("https://greasyfork.org/en/scripts/18835-")==0)
				{
					if (SRC.indexOf("?")>0)
					{
						link = links[i];
						target = link;
						i = links.length;
					}
				}
			}
			i++;
		}
		}
        if (link == null)
		{
			//This disabled code would allow for iframe embedding of an <a> tag that is literally the very first thing of the description.(I decided that this doesn't make all that much sense.)
			/*if (oldHtml.indexOf("<a class=\"external\" href=\"http://www.deviantart.com/users/outgoing?")==0)
			{
				link = links[0].href.replace("http://www.deviantart.com/users/outgoing?","");
			}
			else*/
			{
				//No [iframe-embed] detected.
				return false;
			}
		}
		
		if (W == 0 || H == 0)
		{
			//Get the size of the main image.
			//var C = devcontent.childNodes[1];
            var C = devcontent.getElementsByClassName("dev-content-full")[0];
			if (W == 0)
			{
				W = C.width;
			}
			if (H == 0)
			{
				H = C.height;
			}
		}
		
		//Create the load content warning box, this allows the user to review the url, and decide to allow the iframe or not.
		var DV = document.createElement("DIV");
		///warningDiv = DV;
		if (journal == null)
		{
			//Make the box float over the top of the main image.
			DV.style = "position:absolute;left:35%;top:"+(H*0.3)+"px;background-color:white";
		}
		else
		{
			DV.style = "background-color:white";
		}
		var center = document.createElement("CENTER");
		center.style = "border: 1px solid black";
		var T = document.createElement("TABLE");
		var row = T.insertRow(-1);
		var col = row.insertCell(-1);
		var SRC = link.href.replace("http://www.deviantart.com/users/outgoing?","").replace("https://www.deviantart.com/users/outgoing?","");
		if (SRC.indexOf("https://greasyfork.org/en/scripts/18835-")==0)
		{
			//SRC = SRC.split("?")[1];
			SRC = SRC.substr(SRC.indexOf("?")+1);
		}
		//var msg = "This deviation contains embedded content from another location, do you want to load it?<br/>(Only load content from sources you trust.)<br/>"
		var msg = "There is some content embedded here, would you like to load it?<br/>(Only load content from sources you trust.)<br/>"
		col.innerHTML = msg+"URL:"+SRC; 
		row = T.insertRow(-1);
		col = row.insertCell(-1);
		
		var center2 = document.createElement("CENTER");
		
		var Btn = document.createElement("INPUT");
		Btn.type = "button";
		Btn.value = "Load content";
		Btn.warningDiv = DV;
		Btn.link = link;
		Btn.target = target;
		Btn.onclick = loadFunction;
		
		center2.appendChild(Btn);
		
		var spacing = document.createElement("P");
		spacing.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
		spacing.style="display:inline";
		center2.appendChild(spacing);
		
		var Btn2 = document.createElement("INPUT");
		Btn2.type = "button";
		Btn2.value = "Cancel";
		Btn2.warningDiv = DV;
		Btn2.link = link;
		Btn2.target = target;
		Btn2.onclick = cancelload;
		
		
		center2.appendChild(Btn2);
		if (autoLoad != "false")
		{
			spacing = document.createElement("P");
			spacing.innerHTML = "<br/>Don't ask me again";
			spacing.style="display:inline";
			center2.appendChild(spacing);
			rememberDecision = document.createElement("INPUT");
			rememberDecision.type = "checkbox";
			center2.appendChild(rememberDecision);
		}
		else
		{
			rememberDecision = null;
		}
		col.appendChild(center2);
		center.appendChild(T);
		DV.appendChild(center);
		if (journal == null)
		{
			devcontent.appendChild(DV);
		}
		else
		{
			target.parentNode.replaceChild(DV,target);
		}
		if (document.getElementsByClassName("iframe-embed install instructions").length>0)
		{
			var i = 0;
			var L = document.getElementsByClassName("iframe-embed install instructions");
			while (i < L.length)
			{
				L[i].parentNode.removeChild(L[i]);
				i++;
			}
		}
		if (autoLoad == "1")
		{
			loadFunction();
		}
		return true;
    }
	}
	var dmain = window.location.href;
	if (window.location.href.indexOf("sta.sh")<0)
	{
		
	}
	else
	{
		var title = document.getElementsByClassName("dev-title-container")[0];
		dmain = title.getElementsByClassName("u regular username")[0].href;
	};
	username = dmain.split(".")[0].replace("http://","");
	/*if (GM_getValue && allowAutoLoad)
	{
		var AL = GM_getValue("autoLoad_"+username);		
		if (AL)
		{
		if (AL=="-1" || AL == "0" || AL=="1")
		{
			autoLoad = AL;
		}
		}
		else
		{
			autoLoad = "false";
		}
	}
	else
	{
		autoLoad = "false";
	}*/
	var lasturl = "";
	function LoadContent()
    {
		/*if (!loadenabled)
		{
			return;
		}*/
		if (lasturl == window.location.href)
		{
			return;
		}
		devcontent = document.getElementsByClassName("dev-view-deviation")[0];
		journal = null;
		if (document.getElementsByClassName("grf-indent").length>0)
		{
			journal = document.getElementsByClassName("grf-indent")[0].childNodes[1];
		}
        while (checkForEmbed("[iframe-embed","]",loadiframe) == true && journal != null){}
		//loadenabled = false;
		lasturl = window.location.href;
    }
	autoLoad = "false";
	if (autoLoad != "-1")
	{
		LoadContent();
		document.addEventListener('DOMNodeInserted', function(event){
			setTimeout(function(){ LoadContent(); }, 1500);
			});
	}
	else
	{
		//The user's preferences has been set to block this users, iframe embeds.
		if (document.getElementsByClassName("iframe-embed install instructions").length>0)
		{
			var i = 0;
			var L = document.getElementsByClassName("iframe-embed install instructions");
			while (i < L.length)
			{
				L[i].innerHTML = "<a onclick='if confirm(\"Remove your decision to cancel all content from:"+username+"?\"){GM_setValue(autoLoad_"+username+",\"0\");checkForEmbed('[iframe-embed',']',loadiframe);}return false;'>(Iframe content blocked.)</a>";
				i++;
			}
		}
	}
	//the code below purposefully throws an error, to make finding the running script easier.
	/*var tt = null;
	document.removeChild(tt);*/
})();