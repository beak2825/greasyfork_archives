// ==UserScript==
// @name         커스텀페이지파티
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://deep.zerosic.com/ZeroHOF/index.php?*common=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39339/%EC%BB%A4%EC%8A%A4%ED%85%80%ED%8E%98%EC%9D%B4%EC%A7%80%ED%8C%8C%ED%8B%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/39339/%EC%BB%A4%EC%8A%A4%ED%85%80%ED%8E%98%EC%9D%B4%EC%A7%80%ED%8C%8C%ED%8B%B0.meta.js
// ==/UserScript==
var settings = {
    Position : 300
};

function $element(t,p,a,f){var e;if(!t){if(arguments.length>1){e=document.createTextNode(a);a=null;}else{return document.createDocumentFragment();}}else{e=document.createElement(t);}if(a!==null&&a!==undefined){switch(a.constructor){case Number:e.textContent=a;break;case String:e.textContent=a;break;case Array:var a1;a.forEach(function(a0){a1=a0.substr(1);switch(a0[0]){case "#":e.id=a1;break;case ".":e.className=a1;break;case "/":e.innerHTML=a1;break;case " ":e.textContent=a1;break;}});break;case Object:var ai,av,es,esi;for(ai in a){av=a[ai];if(av&&av.constructor===Object){if(ai in e){es=e[ai];}else{es=e[ai]={};}for(esi in av){es[esi]=av[esi];}}else{if(ai==="style"){e.style.cssText=av;}else if(ai in e){e[ai]=av;}else{e.setAttribute(ai,av);}}}break;}}if(f){if(f.constructor===Function){e.addEventListener("click",f,false);}else if(f.constructor===Object){var fi;for(fi in f){e.addEventListener(fi,f[fi],false);}}}if(p){var p0,p1;if(p.nodeType===1||p.nodeType===11){p0=p;p1=null;}else if(p.constructor===Array){p0=p[0];p1=p[1];if(!isNaN(p1)){p1=p0.childNodes[parseInt(p1,10)];}}p0.insertBefore(e,p1);}return e;}

var div = $element("div",document.body,{style:"position:absolute; top:"+settings.Position+"px; left:3px; box-sizing:border-box; width:75px; height:500px; font-size:9pt; color:#91A2BB; background-color:#10151B; line-height:1.6; padding-top:20px"});
$element("",div,"캐릭슬롯");
$element("br",div);
span = $element("span",div,{title:"저장",style:"font-size:12pt; cursor:pointer"},function(){SaveGroups();});
span.textContent = "저장";
text0 = $element("textarea",div,{id:"ctext",style:"width:70px; height:400px;"});

function SaveGroups()
{
		var i,SG;
		for(i = 1;i < 300;i++)
		{
				el = $("box" + i);
				if(!el) continue;
				if(el.checked)
				{
					if(SG){
						SG += "\n\<input type=\"hidden\" id=\"box2\" name=\"char_"+el.name.substr(5)+"\" value\=\"1\"\>";
                        SG += "<!--  -->";
                    }
					else{
						SG = "\<input type=\"hidden\" id=\"box2\" name=\"char_"+el.name.substr(5)+"\" value\=\"1\"\>";
                    	SG += "<!--  -->";
                    }
				}
		}
		text0.value=SG;
		return true;
}