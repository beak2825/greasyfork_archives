// ==UserScript==
// @name           Novel Ranking Filter [No GM_API Version]
// @name:ja        小説ランキングフィルター [GM_APIなし]
// @namespace      https://greasyfork.org/en/users/1264733
// @version        2024-06-23
// @description    Novel Ranking Filtering Bookmarklet for Mobile Browser
// @description:ja モバイルブラウザ用小説ランキングフィルタリングブックマークレット
// @author         LE37
// @license        MIT
// @include        https://www.alphapolis.co.jp/novel/index*
// @include        https://www.alphapolis.co.jp/novel/ranking/*
// @include        https://kakuyomu.jp/genr*
// @include        https://kakuyomu.jp/pick*
// @include        https://kakuyomu.jp/rank*
// @include        https://kakuyomu.jp/sear*
// @include        https://kakuyomu.jp/rece*
// @include        https://syosetu.org/?mode=rank*
// @include        https://yomou.syosetu.com/rank/*
// @include        https://yomou.syosetu.com/search*
// @exclude        https://www.alphapolis.co.jp/novel/ranking/annual
// @exclude        https://yomou.syosetu.com/rank/top/
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/490243/Novel%20Ranking%20Filter%20%5BNo%20GM_API%20Version%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/490243/Novel%20Ranking%20Filter%20%5BNo%20GM_API%20Version%5D.meta.js
// ==/UserScript==

(()=>{
	/*LS20240623*/
	'use strict';
	// GM key, Nodelist, userLink, userid, tag, alt;
	let gMk,eNo,eUl,sId,sTg,eAt;
	// View mode 
	let V=false;
	// Current list
	let O,A,T;
	// Client type
	const M=navigator.userAgent.includes("Mobile");
	const P=location.pathname;
	switch(location.host){
		case "www.alphapolis.co.jp":
			gMk="A";
			eNo="div.section";
			eUl="div.author>a";
			sId=/detail\/(\d+)$/;
			sTg="li.tag a";
			break;
		case "syosetu.org":
			gMk="H";
			eNo=M?"div.search_box":"div.section3";
			eUl=null;
			sId=/：(.*)/;
			sTg=M?'span[id^="tag_"]':'div.all_keyword:nth-child(9) a';
			eAt=M?"p:nth-child(2)":"div.blo_title_sak";
			break;
		case "kakuyomu.jp":
			gMk="K";
			sId=/users\/(.*)$/;
			if(P.startsWith("/search")){
				eNo=M?'div[class*="Spacer_margin-ml-m__"]':'div[class*="NewBox_borderSize-bb"]';
				eUl=M?'span[class*="workLabelAuthor__"] a':"div.partialGiftWidgetActivityName>a";
				sTg='a[href^="/tags/"]';
			}else if(P.startsWith("/recent_r")){
				eNo="div.recentReviews-item";
				eUl="a.widget-workCard-authorLabel";
				sTg='a[href^="/tags/"]';
			}else{
				eNo="div.widget-work";
				eUl="a.widget-workCard-authorLabel";
				sTg="a[itemprop='keywords']";
			}
			break;
		case "yomou.syosetu.com":
			gMk="N";
			if(P.startsWith("/search")){
				eNo=M?"div.smpnovel_list":"div.searchkekka_box";
				eUl=M?null:"a:nth-child(2)";
				sId=M?/：(.*)/:/\/(\d+)/;
				sTg='a[href*="?word"]';
				eAt="p.author";
			}else{
				eNo="div.p-ranklist-item";
				eUl="div.p-ranklist-item__author a";
				sId=/\/(\d+)/;
				sTg="div.p-ranklist-item__keyword a";
			}
			break;
	}
	//console.log( {gMk, eNo, eUl, sId, sTg, eAt} );
	// Read list
	function URD(){
		const G=JSON.parse(localStorage.getItem(gMk));
		O=G?G:{AL:[],TL:[]};
		A=O.AL;
		T=O.TL;
	}
	// Save list
	function USV(){
		if(JSON.stringify(O)!==localStorage.getItem(gMk)){
			localStorage.setItem(gMk,JSON.stringify(O));
		}
	}
	// Run
	URD();
	FMD();
	CFB();
	// Filtering multiple targets
	function FMD(){
		const no=document.querySelectorAll(eNo);
		for(let i=0;i<no.length;i++){
			let rBk=false;
			let uId;
			// Filtering content contain single id(link) or text
			let eLk=eUl?no[i].querySelector(eUl):no[i].querySelector(eAt);
			if(eLk!==null||(gMk==="N"&&M)){
				if(!eLk){
					// Narou search mobile no author link
					if(gMk==="N"){
						const tca=document.createElement("p");
						tca.classList.add("author");
						tca.style.color="#fe7643";
						const head=no[i].querySelector("div.accordion_head");
						// AD
						if(!head){
							//console.log("===A D===");
							//rBk = true;
							continue;
						}
						tca.textContent=head.textContent.split("\n")[3];
						no[i].querySelector("a.read_button").after(tca);
						eLk=tca;
						uId=eLk.textContent.match(sId)[1];
					}
				}else{
					uId=eUl?eLk.href.match(sId)[1]:eLk.textContent.match(sId)[1];
				}
				//console.log(uId);
				rBk=CHK(eLk,"a",A,uId);
			}
			if(sTg&&!rBk){
				// Filtering content contain multiple tags(text)
				// Tag node
				let tno;
				// Hameln mobile origin tag, custom tag
				let tot,tct;
				if(gMk==="H"&&M){
					tot=no[i].querySelector(".trigger p:nth-child(4)");
					tct=no[i].querySelector(sTg);
					if(!tct){
						tno=tot.textContent.slice(3).match(/[^\s]+/g);
						tot.innerHTML="";
					}else{
						tno=no[i].querySelectorAll(sTg);
					}
				}else{
					tno=no[i].querySelectorAll(sTg);
				}
				for(let j=0;j<tno.length;j++){
					let tag;
					if(tot&&!tct){
						tag=tno[j];
						tot.innerHTML+='<span id="tag_'+j+'">'+tag+'</span>';
					}else{
						tag=tno[j].textContent;
					}
					//console.log(tag);
					rBk=tot&&!tct?CHK(no[i].querySelector("span#tag_"+j),"t",T,tag):CHK(tno[j],"t",T,tag);
					if(rBk)break;
				}
			}
			// Blocked show type
			no[i].style.display=!V&&rBk?"none":"";
			no[i].style.opacity=V&&rBk?"0.5":"1";
		}
	}
	// Check keyword
	function CHK(e,n,l,s){
		const r=l.some((v)=>s===v);
		if(!e.classList.contains("c_h_k")){
			e.classList.add("c_h_k");
			e.setAttribute("data-r",n+s);
		}
		if(V){
			e.style.border=r?"thin solid fuchsia":"thin solid dodgerblue";
		}else{
			e.style.border="none";
		}
		return r;
	}

	// Select mode
	function SVM(){
		const bt=document.getElementById("r_fcb");
		if(!V){
			V=true;
			bt.textContent="📙";
			document.addEventListener("click",ECH);
			URD();
		}else{
			V=false;
			bt.textContent="📘";
			document.removeEventListener("click",ECH);
			// Auto save list
			USV();
		}
		FMD();
	}
	// Handler
	function ECH(e){
		e.preventDefault();
		const eT=e.target;
		const tE=eT.classList.contains("c_h_k")?eT
					:eT.parentElement.classList.contains("c_h_k")?eT.parentElement
					:null;
		//console.log(tE);
		if(tE){
			const tda=tE.getAttribute("data-r");
			const tlst=tda.slice(0,1)==="a"?A:T;
			const tid=tda.slice(1);
			const li=tlst.findIndex((v)=>v===tid);
			if(li!==-1){
				tlst.splice(li,1);
			}else{
				tlst.push(tid);
			}
			FMD();
		}
	}

	// Update Blocklists List
	function UBL(){
		alert(gMk+":"+localStorage.getItem(gMk));
	}
	// Sort Blocklists List
	function SBL(){
		A.sort();
		T.sort();
		USV();
		UBL();
	}
	// Delete Block List
	function DBL(){
		const t=prompt("Delete?","No");
		if(t==="Yes"){
			localStorage.removeItem(gMk);
			URD();
			UBL();
			FMD();
		}
	}
	// Create Float Button
	function CFB(){
		BCR("r_fcb","📘","2","2");
		BCR("r_ubl","♻","4","2");
		BCR("r_dbl","📛","4","4");
		BCR("r_sbl","🔀","2","4");
		document.addEventListener("click",BLM);
	}
	function BLM(e){
		switch(e.target.id){
			case "r_fcb":
				SVM();
				break;
			case "r_ubl":
				UBL();
				break;
			case "r_dbl":
				DBL();
				break;
			case "r_sbl":
				SBL();
				break;
		}
	}
	// Button creater
	function BCR(id,text,x,y){
		const cb=document.body.appendChild(document.createElement("button"));
		cb.id=id;
		cb.textContent=text;
		cb.style="position:fixed;width:44px;height:44px;z-index:999;font-size:200%;opacity:50%;cursor:pointer;right:"+x+"em;bottom:"+y+"em;";
		cb.type="button";
	}
})();