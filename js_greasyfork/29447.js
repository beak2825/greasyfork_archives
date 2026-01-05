// ==UserScript==
// @name		ニコニコ大百科掲示板NG機能
// @namespace	yakisoft
// @include		/^https?:\/\/dic\.nico(moba|video)\.jp\/[a-z]\/.*$/
// @version		1.11.0
// @grant		none
// @run-at document-start
// @description	ニコニコ大百科掲示板NG機能。IDを入力して設定を押せばNGできます。
// @downloadURL https://update.greasyfork.org/scripts/29447/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%A4%A7%E7%99%BE%E7%A7%91%E6%8E%B2%E7%A4%BA%E6%9D%BFNG%E6%A9%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/29447/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%A4%A7%E7%99%BE%E7%A7%91%E6%8E%B2%E7%A4%BA%E6%9D%BFNG%E6%A9%9F%E8%83%BD.meta.js
// ==/UserScript==

const url = window.location.href;

function hide(e, c, r){
	if(e===undefined)
		return;
	const key = c+"_cache";
	if(r!==undefined){
		if(e[c]!=r){
			e[key]=e[c];
			e[c]=r;
		}
	}
	else{
		if(e[key]!==undefined){
			e[c]=e[key];
			e[key]=undefined;
		}
	}
}

function getNGdiv(engine){
	const div = document.createElement("div");
	const NGList = document.createElement("textarea");
	const NGButton = document.createElement("button");
	NGList.name = "NGList";
	NGList.cols = "40";
	NGList.rows = "10";
	if(typeof(Storage) !== "undefined"){
		if(localStorage.nicodicNG){
			NGList.value = localStorage.getItem('nicodicNG');
		}
	}
	NGList.addNGID=function(id){
		NGList.value+="\n"+id;
		while(NGList.value.indexOf("\n\n")!=-1)
			NGList.value=NGList.value.replace("\n\n", "\n");
		localStorage.setItem('nicodicNG', NGList.value);
	};
	NGList.removeNGID=function(id){
		NGList.value=NGList.value.replace(id, "");
		while(NGList.value.indexOf("\n\n")!=-1)
			NGList.value=NGList.value.replace("\n\n", "\n");
		localStorage.setItem('nicodicNG', NGList.value);
	};

	NGButton.name = "NGButton";
	NGButton.textContent = "NG設定";
	NGButton.style = "width:75px; height:25px";
	NGButton.onclick=function(){
		localStorage.setItem('nicodicNG', NGList.value);
		engine.doNG(NGList);
	};
	div.appendChild(NGList);
	div.appendChild(NGButton);

	div.NGList=NGList;

	return div;
}

//PC or nicomoba
class NGPC{
	constructor(){
		const NGdiv = getNGdiv(this);
		this.NGdiv = NGdiv;
		if(url.indexOf("nicomoba")===-1){//PC
			const div = document.getElementById("main");
			div.appendChild(NGdiv);
			this.addNGButton(NGdiv.NGList);
		}
		else{//nicomoba
			const div = document.querySelectorAll("[id='bottom']")[1];
			div.parentNode.insertBefore(NGdiv, div);
			this.addNGButton(NGdiv.NGList);
		}
	
	}
	doNGImpl(dl, ngList){
		const resList = [];
		//st-bbs_reshead
		//st-bbs_resbody
		//res_reaction
		for(let child of dl.children){
			if(child.tagName=="DT")
				resList.push({});
			resList[resList.length-1][child.className.split("_")[1]] = child;
		}
		for(const res of resList){
			const name = res.reshead.childNodes[5];
			const resinfo = res.reshead.childNodes[9];
			const date = resinfo.children[0];
			const id = resinfo.children[resinfo.children.length-2];
			const text = res.resbody;
			const reaction = res.reaction;
			if(ngList.indexOf(id.textContent)!=-1){
				hide(name, "textContent", "NGしました");
				hide(date, "textContent", "NGしました");
				hide(text, "innerHTML", "NGしました");
				hide(reaction, "innerHTML", "");
			}
			else{
				hide(name, "textContent");
				hide(date, "textContent");
				hide(text, "innerHTML");
				hide(reaction, "innerHTML");
			}
		}
	};
	getBBS(){
		return document.getElementsByTagName("dl");
	};
	getSelectorString(){
		return 'dl > dt[class=st-bbs_reshead]';
	};
	doNG(){
		console.log("doNG PC or nicomoba");
		const ngList=this.NGdiv.NGList.value.split('\n').filter(function(el) {return el.length !== 0;});
		const bbs = document.querySelectorAll('div[class=st-bbs-contents] > dl');
		for(var dl=0; dl<bbs.length; dl++)
			this.doNGImpl(bbs[dl], ngList);
	};

	addNGButton(NGList){
		const dts=document.querySelectorAll(this.getSelectorString()+ ' > div[class=st-bbs_resInfo]');
		const regex=/ID: (.*)/;
		dts.forEach(function(e){
			e.innerHTML=e.innerHTML.replace(regex, "ID: <id title='NGする' style='cursor: pointer;'>$1</id>");
			const id=e.querySelectorAll('id')[0];
			id.onmouseover = function() {
				id.style.color="red";
				id.style.textDecoration = "underline";
			};
			id.onmouseleave = function() {
				id.style.color="grey";
				id.style.textDecoration = "none";
			};
		});
		const ids=document.querySelectorAll(this.getSelectorString()+ ' > div > id');
		ids.forEach((e)=>{
			e.onclick=()=>{
				const ID=e.textContent;
				if(NGList.value.indexOf(ID)==-1){
					NGList.addNGID(ID);
				}
				else{
					NGList.removeNGID(ID);
				}
				this.doNG(NGList);
				e.onmouseleave();
			};
		});
	};
}
//mobile
class NGMobile{
	constructor(){
		const NGdiv = getNGdiv(this);
		this.NGdiv = NGdiv;
		const div = document.getElementsByClassName("st-Footer_Inner")[0];
		div.parentNode.insertBefore(NGdiv, div.nextSibling);
		NGdiv.NGList.rows = "5";
		NGdiv.NGList.cols = "20";
		document.getElementsByClassName("st-Footer")[0].style.height="295.9375px";
		this.addNGButton(NGdiv.NGList);
	}
	doNGImpl(bbs, ngList){
		const resList = [];
		for(let child of bbs.children){
			if(child.tagName=="LI" && child.className!="res_reaction")
				resList.push({
					li: child
				});
			else if(child.tagName=="LI")
				resList[resList.length-1]["reaction"] = child;
		}
		for(const res of resList){
			const li = res.li;
			const reaction = res.reaction;
			const name = li.getElementsByClassName("bbs_name")[0];
			const date = li.getElementsByClassName("bbs_resInfo_resTime")[0];
			const id = li.querySelector("p[class=at-List_Date] > span > id");
			const text = li.getElementsByClassName("at-List_Text")[0];
			if(ngList.indexOf(id.textContent)!=-1){
				hide(name, "textContent", "NGしました");
				hide(date, "textContent", "NGしました");
				hide(text, "innerHTML", "NGしました");
				hide(reaction, "innerHTML", "");
			}
			else{
				hide(name, "textContent");
				hide(date, "textContent");
				hide(text, "innerHTML");
				hide(reaction, "innerHTML");
			}
		}
	};
	getBBS(){
		return document.getElementsByClassName("sw-Article_List")[0];
	};
	doNG(){
		console.log("doNG mobile");
		const ngList=this.NGdiv.NGList.value.split('\n').filter(function(el) {return el.length !== 0;});
		const bbs = this.getBBS();
		this.doNGImpl(bbs, ngList);
	};
	addNGButton(NGList){
		const dts = document.getElementsByClassName("at-List_Date");
		const regex=/ID: (.*)/;
		dts.forEach(function(e){
			e.innerHTML=e.innerHTML.replace(regex, "ID: <id title='NGする' style='cursor: pointer;'>$1</id>");
			const id=e.querySelectorAll('id')[0];
			id.onmouseover = function() {
				id.style.color="red";
				id.style.textDecoration = "underline";
			};
			id.onmouseleave = function() {
				id.style.color="grey";
				id.style.textDecoration = "none";
			};
		});
		const ids=document.querySelectorAll('p[class=at-List_Date] > span > id');
		ids.forEach((e)=>{
			e.onclick=()=>{
				const ID=e.textContent;
				if(NGList.value.indexOf(ID)==-1){
					NGList.addNGID(ID);
				}
				else{
					NGList.removeNGID(ID);
				}
				this.doNG(NGList);
				e.onmouseleave();
			};
		});
	};
}

function main(){
	const engine = url.indexOf("dic.nicovideo.jp/t")!==-1 ? new NGMobile() : new NGPC();
	//autopagerize support
	document.body.addEventListener('AutoPagerize_DOMNodeInserted',function(evt){
		engine.doNG();
	}, false);
	engine.doNG();
};
if(url.indexOf("dic.nicovideo.jp/a")===-1)//notes page
{
	try{
		document.getElementsByTagName("html")[0].style.visibility="hidden";
	}catch(e){
		console.warn(e);
	}
}
const greasemonkeyInterval = setInterval(greasemonkey, 100);
function greasemonkey(){
	if(document.readyState!=="loading"){
		clearInterval(greasemonkeyInterval);
		try{
			main();
		}
		finally{
			document.getElementsByTagName("html")[0].style.visibility="";
		}
	}
}