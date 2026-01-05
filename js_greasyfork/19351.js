// ==UserScript==
// @name		GC Customisable Menu
// @namespace		delta68.customisable_menu
// @include		http://www.geocaching.com*
// @include		https://www.geocaching.com/*
// @grant		GM_getValue
// @grant		GM_setValue
// @description		Menu editor
// @version		1.05
// @downloadURL https://update.greasyfork.org/scripts/19351/GC%20Customisable%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/19351/GC%20Customisable%20Menu.meta.js
// ==/UserScript==
/* April 2016 release version 1.00 Now has in-page editor interface */
/* April 2016 release version 1.01 missing semi colons added */
/* May 2016 release version 1.02 fixed for Tampermonkey */
/* May 2016 release version 1.03 import/export settngs added */
/* May 2016 release version 1.04 accesskey='p' fix */
/* May 2016 release version 1.05 hide 'key' input boxes */
var version = '1.05';

convertOldSettings();

if(document.title.length>0)
{
	var url = document.location.toString();
	if(url.indexOf('https://www.geocaching.com/play/search') < 0)
	{
	addEditMenuItem();
	}

	customiseMenu();
}

/* ******************************************************* */
function customiseMenu()
{
	if(document.title.length>0)
	{
		//var nav = document.getElementById('Navigation')
		var nav = document.getElementsByTagName('nav');  // I had to use the tag name because the home page doesn't have 'id' attibutes
		var a = nav[0].getElementsByTagName("a");
		var ak='';
		for(var i=0;i<a.length;i++)
		{
			ak=a[i].accessKey;
			var s=GM_getValue(ak,'');
			if(s.length>0){	modifyMenuItem(ak,s);}
		}
	}
}


function modifyMenuItem(accesskey,str)
{
	if(str.indexOf('hide=true')>-1)
	{
		hideItem(accesskey);
	}else{
		showItem(accesskey);
		var t=str.replace(/hide=true/gi, "").split('|');
		if((t[0].length>0) && (t[1].length>0))
		{
			changeLink(accesskey,t[0],t[1]);
		}
	}

}


function saveChanges()
{
	var key = document.getElementsByName("key");
	var title = document.getElementsByName("title");
	var href = document.getElementsByName("href");
	var hide = document.getElementsByName("hide");
	var str='';
	for(var i=0;i<key.length;i++)
	{
		str= href[i].value + '|' + title[i].value + '|' + 'hide=' + hide[i].checked;
		modifyMenuItem(key[i].value,str);
		GM_setValue(key[i].value,str);
	}

	closeMenuEditDiv();
}

function closeMenuEditDiv()
{
	try{
	var element = document.getElementById("topmenueditdiv");
	element.parentNode.removeChild(element);
	}catch(err){}
}

function hideItem(t)
{
	var x =getMenuItemByAccessKey(t);
	x.style.display = 'none';
}

function showItem(t)
{
	var x =getMenuItemByAccessKey(t);
	x.style.display = 'block';
}

function getRel(href)
{
	if (href=='#'){return('');}

	if (href.indexOf("www.geocaching.com")>-1){return('');}

	if (href.indexOf("forums.groundspeak.com")>-1){return('');}

	if (href.indexOf("http://")>-1){return('external');}

	return('');
}


function getMenuItemByInnerHTML(h)
{
	var nav = document.getElementsByTagName('nav');
	var a = nav[0].getElementsByTagName("a");

	for(var i=0;i<a.length;i++)
	{
		if(a[i].innerHTML==h)
		{//alert('x')
		  return(a[i]);
		}
	}
}

function getMenuItemByAccessKey(k)
{
	var nav = document.getElementsByTagName('nav');
	var a = nav[0].getElementsByTagName("a");
	for(var i=0;i<a.length;i++)
	{
		if(a[i].accessKey==k){
			if(a[i].className=='li-user-info')
			{//do nothing
			}else{
				return(a[i]);
			}
		}
	}
}


function changeLink(t,href,text)
{
	var x =getMenuItemByAccessKey(t);
	//alert(text)

	//try{
	if(href!=='')
	{
		x.href=href;
		x.rel =getRel(href);
	}
	//if(id.indexOf('hlNav')>-1){
	//	x.innerHTML=text //+ ' \u25bc'
	//}else{
		x.innerHTML=text;
	//}
	x.title = text;
	//}catch(err)
	//{}
}


function mydecodeURI(uri)
{
var s = uri.replace(/%2F/gi, "/");
s = s.replace(/\+/gi, " ");
s = s.replace(/%3A/gi, ":");
s = s.replace(/%23/gi, "#");
s = s.replace(/%3D/gi, "=");
s = s.replace(/%26/gi, "&");
s = s.replace(/%3F/gi, "?");

return(s);

}


function createEditableFields()
{
		var nav = document.getElementsByTagName('nav');
		var a = nav[0].getElementsByTagName("a");
		var aCount=a.length-1;
//alert(a.length)
		// change edit link to 'save'
		//a[aCount].removeEventListener('click', createEditableFields, false);
		//a[aCount].addEventListener('click', saveChanges, false);
		//a[aCount].innerHTML='Save Menu Changes'
		//a[aCount].title = 'Save Menu Changes'

		closeMenuEditDiv();


	var div = document.createElement("div");
	div.id="topmenueditdiv";
	//div.style.width = "500px";
	//div.style.height = "100px";
 	div.style.position = "absolute";
	div.style.zIndex = 10000;
	div.style.left = "50px";
	div.style.top = "20px";
	div.style.background = "lightgray";
	div.style.border = "2px solid #82aa13";
	div.style.color = "black";

	var str='<center><h3>Menu Editor</h3></center><table><tr><th>Caption</th><th>Link Address</th><th>Hide</th></tr>';
	var ch='';

		for(var i=0;i<a.length-1;i++)
		{
			var li = a[i].parentElement;
			//alert(li.parentElement.className)

			var s=GM_getValue(a[i].accessKey ,'');
			if(s.indexOf('hide=true')>-1)
			{ch=' checked';}else{ch='';}

			if(li.parentElement.className=='SubMenu')
			{
				str = str +"<tr><td>&nbsp;&nbsp;&nbsp;<input type='hidden' name='key' value='" + a[i].accessKey + "'><input type='text' name='title' value='" + a[i].innerHTML + "'></td><td><input type='text' name='href' value='" + a[i].href + "'></td><td><input name='hide' type='checkbox'" + ch + "></td></tr>";
			}else if(li.parentElement.className=='Menu')
			{

				str = str + "<tr><td><input type='hidden' name='key' value='" + a[i].accessKey + "'><input type='text' name='title' value='" + a[i].innerHTML + "'></td><td><input type='hidden' name='href' value='#'>n/a</td><td><input name='hide' type='checkbox'" + ch + "></td></tr>";

			}
		}
	str = str +"<tr><td colspan=3><small>v" + version + " <a href='#' id='export'>export settngs</a> <a href='#'id='import'>import settings</a> <input type='button' value='Cancel' id='cancel'><input type='button' value='Save Changes' id='savechanges'></td></tr>";
	str = str +"</table>";
	div.innerHTML = str;

	document.body.appendChild(div);

	elem = document.getElementById('cancel');
	elem.addEventListener('click', closeMenuEditDiv, false);

	elem = document.getElementById('savechanges');
	elem.addEventListener('click', saveChanges, false);

	elem = document.getElementById('export');
	elem.addEventListener('click', exportSettings, false);
	elem = document.getElementById('import');
	elem.addEventListener('click', importSettings, false);

}


function addEditMenuItem()
{	// find the last menu item and create a new one after it

	var nav = document.getElementsByTagName('nav');
//try{
	var a = nav[0].getElementsByTagName("a");
	var ul=a[a.length-1].parentElement.parentElement;
	//var ul=document.getElementById('ctl00_ctl22_hlBecomePremium').parentElement.parentElement
	var li = document.createElement('li');
	ul.appendChild(li);

	a = document.createElement('a');
	var linkText = document.createTextNode('Edit Menu');
	a.appendChild(linkText);
	a.title = 'Edit Menu';
	a.href='#';
	a.addEventListener('click', createEditableFields, false);
	li.appendChild(a);
	//}catch(err){}

}


function convertOldSettings()
{
if(GM_getValue('converted','').length===0)
{
	var nav = document.getElementsByTagName('nav');
	var a = nav[0].getElementsByTagName("a");

		for(var i=0;i<a.length;i++)
		{
			var str = a[i].id;
			str=str.replace("ctl22_", "");
			var s=GM_getValue(str,'');
			if(s.length>0)
			{
				var t=s.split('|');
				if((t[0].length>0) && (t[1].length>0))
				{
					str= t[0] + '|' + t[1] + '|' + 'hide=false';
					GM_setValue(a[i].accessKey,str);
				}
			}
		}
		//alert('conversion finished')
		GM_setValue('converted','true')	;
	}
}

/* ******************************************************* */
function exportSettings()
{

if(document.title.length>0)
	{
		//var nav = document.getElementById('Navigation')
		var nav = document.getElementsByTagName('nav');  // I had to use the tag name because the home page doesn't have 'id' attibutes
		var a = nav[0].getElementsByTagName("a");
		var ak='';
		var str='';
		for(var i=0;i<a.length;i++)
		{
			ak=a[i].accessKey;
			var s=GM_getValue(ak,'');
			if(s.length>0){
				str += '~~' + ak + '|' + s;
			}
		}
		   var x = prompt("Export settings", str);
	}


}

function importSettings()
{

 var x = prompt("Enter exported settings", '');
if(x.length>0)
{
	var r = x.split('~~');
	//alert(r.length)

	for(var i=1;i<r.length;i++)
	{
		var t=r[i].split('|');

		str= t[1] + '|' + t[2] + '|' + t[3];
		//alert(t[0] + " " + str)
		GM_setValue(t[0],str);
    }

	closeMenuEditDiv();
}

}
