// ==UserScript==
// @name        tanksmith.io custom unit menu
// @namespace   http://bzzzzdzzzz.blogspot.com/
// @description read the title
// @author      BZZZZ
// @include     /^https?\:\/\/(www\.)?tanksmith\.io\/([?#]|$)/
// @version     0.11
// @grant       none
// @run-at      document-end
// @inject-into content
// @downloadURL https://update.greasyfork.org/scripts/421431/tanksmithio%20custom%20unit%20menu.user.js
// @updateURL https://update.greasyfork.org/scripts/421431/tanksmithio%20custom%20unit%20menu.meta.js
// ==/UserScript==
 
{
const a=document.createElement("div");
a.setAttribute("onclick",`"use strict";
	document.head.insertAdjacentHTML("beforeend","<style>#store>div{display:none;}</style>");
	const mnames=["Wood","Iron","Gold","Diamond","Amethyst"],unames=["Basic\\xA0Unit","Basic\\xA0Turret","Sniper\\xA0Turret","Twin\\xA0Turret","Cannon\\xA0Turret","Healing\\xA0Unit","Alchemy\\xA0Lab","Booster\\xA0Unit","Octa\\xA0Turret","Spike"],ucost=[6,8,10,10,18,14,20,12,16,8],store=document.getElementById("store");
	const mselectedcolor="#00FF00",munselectedcolor="#FFFF00",textcolor="#000000",cursor="pointer",mselect=function(){
		mselected.style.backgroundColor=munselectedcolor;
		mselected=this;
		this.style.backgroundColor=mselectedcolor;
	},uselect=function(){
		document.getElementById("u:1;0").onclick.call({"id":\`u:\${this.dataset.id};\${mselected.dataset.id}\`});
	},setcostdisplay=function(){
		const m=parseInt(mselected.dataset.id);
		costdisplay.textContent=\`\${(1+m)*ucost[parseInt(this.dataset.id)-1]} \${mnames[m]}\`;
	},clearcostdisplay=()=>costdisplay.textContent="";
	let mselected=document.createElement("span");
	mselected.style.backgroundColor=mselectedcolor;
	mselected.style.color=textcolor;
	mselected.style.cursor=cursor;
	mselected.textContent=mnames[0];
	mselected.onclick=mselect;
	mselected.dataset.id="0";
	store.appendChild(mselected);
	let i=1,span;
	while(i<5){
		store.appendChild(document.createTextNode(" "));
		span=document.createElement("span");
		span.style.backgroundColor=munselectedcolor;
		span.style.color=textcolor;
		span.style.cursor=cursor;
		span.textContent=mnames[i];
		span.onclick=mselect;
		span.dataset.id=i++;
		store.appendChild(span);
	}
	store.appendChild(document.createElement("hr"));
	span=document.createElement("span");
	span.style.backgroundColor=munselectedcolor;
	span.style.color=textcolor;
	span.style.cursor=cursor;
	span.textContent=unames[0];
	span.onclick=uselect;
	span.onmouseenter=setcostdisplay;
	span.onmouseleave=clearcostdisplay;
	span.dataset.id="1";
	store.appendChild(span);
	i=1;
	while(i<10)if(i===7/*booster unit*/)i++;else{
		store.appendChild(document.createTextNode(" "));
		span=document.createElement("span");
		span.style.backgroundColor=munselectedcolor;
		span.style.color=textcolor;
		span.style.cursor=cursor;
		span.textContent=unames[i++];
		span.onclick=uselect;
		span.onmouseenter=setcostdisplay;
		span.onmouseleave=clearcostdisplay;
		span.dataset.id=i;
		store.appendChild(span);
	}
	store.appendChild(document.createElement("hr"));
	const costdisplay=document.createElement("span");
	costdisplay.style.color="#FFFFFF";
	store.appendChild(costdisplay);`);
a.click();
}