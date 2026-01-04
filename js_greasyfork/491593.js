// ==UserScript==
// @name         Sheezy_HoverPreview
// @namespace    http://phi.pf-control.de
// @version      2024-04-03
// @description  Shows various information when holding shift and hovering!
// @author       dediggefedde
// @match        https://sheezy.art/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sheezy.art
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/491593/Sheezy_HoverPreview.user.js
// @updateURL https://update.greasyfork.org/scripts/491593/Sheezy_HoverPreview.meta.js
// ==/UserScript==

(function() {
	'use strict';
	let els;
	let headerHeight=0;
	const map1 = new Map();


	function getComment(link){
			return new Promise((resolve, reject) =>{
					if(map1.has(link))return resolve(map1.get(link));

					GM.xmlHttpRequest({
							method: "GET",
							url: link,
							onerror: function(response) {
									reject({type:"failed comment request",url:link,content:response});
							},
							onload: async function(response) {
									try{
											const rex=/<div class="[^"]*? prose[^"]*?">([\r\n.\s\S]*?)<\/div>/i;
											const res=response.response.match(rex);
											if(res==null)return reject({type:"no comment match",content:response});
											map1.set(link,res[1]);
											return resolve(res[1]);
									}catch(ex){
											reject(reject({type:"unknown comment error",content:ex}));
									}
							}
					});
			});
	}

	function getSubmission(link){
			return new Promise((resolve, reject) =>{
					if(map1.has(link))return resolve(map1.get(link));

					GM.xmlHttpRequest({
							method: "GET",
							url: link,
							onerror: function(response) {
									reject({type:"failed submission request",url:link,content:response});
							},
							onload: async function(response) {
									try{
											let rex=/<div [^>]*?id="artwork">([\r\n.\s\S]*?)<\/div>/i;
											let res;
											if(response.response.includes("/page-graphics/sheemz-422-by-majestea.webp")){
													res="No Preview for mature content";
													map1.set(link,res);
													return resolve(res);
											}
											res=response.response.match(rex);
											if(res==null)return reject({type:"no submission match",content:response});
											map1.set(link,res[1]);
											return resolve(res[1]);
									}catch(ex){
											reject(reject({type:"unknown submission error",content:ex}));
									}

							}
					});
			});
	}

	function getUploadLimit(){
			return new Promise((resolve, reject) =>{
					GM.xmlHttpRequest({
							method: "GET",
							url: "https://sheezy.art/upload/artwork",
							onerror: function(response) {
									reject({type:"failed upload limit request",content:response});
							},
							onload: async function(response) {
									try{
											let rex=/(You can .*?)(So far .*?\.)/i;
											let res=response.response.match(rex);
											if(res!=null)return resolve(`<p>${res[1]}</p><p>${res[2]}</p>`);

											rex=/(You will be able [\r\n.\s\S]*?)<\//i;
											res=response.response.match(rex);
											if(res!=null)return resolve(`<p>${res[1]}</p>`);

											if(res==null)return reject({type:"no limit match",content:response});
									}catch(ex){
											reject(reject({type:"unknown upload limit error",content:ex}));
									}
							}
					});
			});
	}

	function getInboxDetails(){
			return new Promise((resolve, reject) =>{
					GM.xmlHttpRequest({
							method: "GET",
							url: "https://sheezy.art/inbox?infinite=true&page=10&_data=routes/_frontend/_private/inbox/_index/_index",
							onerror: function(response) {
									reject({type:"failed upload inbox details request",content:response});
							},
							onload: async function(response) {
									try{
											const res=JSON.parse(response.response);
											const namMap=new Map();
											const typMap=new Map();
											res.artworks.forEach(el=>{

													const nam=el.userData.display_name;
													if(namMap.has(nam)){
															namMap.set(nam,namMap.get(nam)+1);
													}else{
															namMap.set(nam,1);
													}

													const typ=el.type;
													if(typMap.has(typ)){
															typMap.set(typ,typMap.get(typ)+1);
													}else{
															typMap.set(typ,1);
													}
											});


											let resStr="";
											if(namMap.size>0){
													namMap.forEach((val,key,map)=>{
															resStr+=`${val} from ${key}, `;
													});
													resStr=resStr.substring(0,resStr.length-2);
													resStr+="<br/>There are "
													typMap.forEach((val,key,map)=>{
															resStr+=`${val} ${key}, `;
													});
													resStr=resStr.substring(0,resStr.length-2);
											}


											return resolve(`Your inbox has ${res.artworks.length} artwork entries.<br/>${resStr}.`);
									}catch(ex){
											reject(reject({type:"unknown Inbox Details error",content:ex}));
									}
							}
					});
			});
	}

	function getInboxSummary(){
			return new Promise((resolve, reject) =>{
					GM.xmlHttpRequest({
							method: "GET",
							url: "https://sheezy.art/inbox?infinite=true&page=1&_data=routes/_frontend/_private/inbox/_layout",
							onerror: function(response) {
									reject({type:"failed upload inbox request",content:response});
							},
							onload: async function(response) {
									try{
											const res=response.response;
											const coms=res.match(/"comment":(\d+)/)[1];
											const fols=res.match(/"followed":(\d+)/)[1];
											const liks=res.match(/"like":(\d+)/)[1];
											const reps=res.match(/"reply":(\d+)/)[1];
											const journ=res.match(/"unseen_journals":(\d+)/)[1];
											const arts=res.match(/"unseen_artworks":(\d+)/)[1];
											const oths=res.match(/"unseen":\{(.*?)\}/)[1];

											getInboxDetails().then(rest=>{
												 resolve(`Notifications:<br/>Comments: ${coms}, Replies: ${reps}, Like: ${liks}, Followed: ${fols}<br/><br/>New:<br/>Unseen Journals: ${journ}, Unseen Artworks: ${arts}, Unseen others: ${oths}<br/><br/>${rest}`);
											});
									}catch(ex){
											reject(reject({type:"unknown Inbox error",content:ex}));
									}
							}
					});
			});
	}
	function getProfile(link){
			return new Promise((resolve, reject) =>{
					GM.xmlHttpRequest({
							method: "GET",
							url: link,
							onerror: function(response) {
									reject({type:"failed upload limit request",content:response});
							},
							onload: async function(response) {
									try{
											let el=document.createElement("div");
											el.innerHTML=response.response;
											return resolve(el.querySelector("ul a[href*='/gallery/']").parentNode.parentNode.parentNode.innerHTML);

									}catch(ex){
											reject(reject({type:"unknown Profile error",content:ex}));
									}
							}
					});
			});
	}


	function shiftIntoView(){
			const view={height:(window.innerHeight || document.documentElement.clientHeight),
									width:(window.innerWidth || document.documentElement.clientWidth)};
			let pos=els.getBoundingClientRect();

			//scale to viewpower (half)
			if(pos.height > view.height) els.style.width=pos.width*(view.height/pos.height)+"px";
			if(pos.width > view.width) els.style.width=view.width+"px";

			//shift into viewport (from bottom/right)
			pos=els.getBoundingClientRect();
			if(pos.bottom > view.height) els.style.top=(els.offsetTop+view.height-pos.bottom)+"px";
			if(pos.right > view.width) els.style.left=(els.offsetLeft+view.width-pos.right)+"px";
	}

	function showHover(position,content,url){
			els.innerHTML=`<header><a href=${url} SHP_hover="1">${url.replace("https://sheezy.art/","")}</a><button onclick='(()=>{document.getElementById("SHP_message_cont").style.display="none";})()'>Close</button></header>`+content;
			els.style.left=(position.left+window.scrollX)+"px";
			els.style.top=(position.top+position.height+window.scrollY)+"px";
			els.style.height=els.style.width="";
			els.style.display="block";
			shiftIntoView();
	}

	function callForHover(ev,callback){
			if (!ev.shiftKey)return;
			const pos=ev.target.getBoundingClientRect();
			ev.target.classList.add("SHP_waiting");
			els.setAttribute("pendingPromise",ev.target.href);
			callback(ev.target.href).then(com=>{
					if(els.getAttribute("pendingPromise")==ev.target.href)showHover(pos,com,ev.target.href);
			}).catch(ex=>{
					console.log("Sheezy_HoverPreview error", ex);
			}).finally(res=>{
					ev.target.classList.remove("SHP_waiting");
			});;
	}

	function init(){

			if(document.getElementById("SHP_message_cont")==null){

					GM_addStyle(`
					 #SHP_message_cont{
							 position:absolute;
							 width:66rem;
							 display:none;
							 padding:15px;
							 font-size:12pt;
							 background-color:rgb(var(--theme-sheezy-320) / var(--tw-bg-opacity));
							 border:2px solid rgb(var(--theme-sheezy-330));
							 overflow:hidden;
							 z-index:99999;
					 }
					 #SHP_message_cont header{
							 display:flex;
							 border-bottom:1px solid;
							 margin-bottom:5px;
					 }
					 #SHP_message_cont header a{flex:1;}
					 #SHP_message_cont header button{}
					 .SHP_waiting{
							 cursor:progress!important;
					 }
					`);


					els=document.createElement("div");
					els.id="SHP_message_cont";
					document.body.appendChild(els);

					els.addEventListener("mouseenter",(ev)=>{
							els.style.display="block";
					});
					els.addEventListener("mouseleave",(ev)=>{
							els.style.display="none";
					});
					els.addEventListener("load",(ev)=>{
							shiftIntoView();
					});

					headerHeight=document.querySelector("#root>header").getBoundingClientRect().height;

					//const observer = new MutationObserver(shiftIntoView);
					//observer.observe(els,{ childList: true });
			}

			shiftIntoView();

			const comments=document.querySelectorAll("a[href*='/comment/']:not([SHP_hover])");

			comments.forEach(link=>{
					link.setAttribute("SHP_hover","1");

					link.addEventListener("mouseenter",(ev)=>{
							callForHover(ev,getComment);
					},false);

					link.addEventListener("mouseleave",(ev)=>{
							els.style.display="none";
					},false);
			});

			const submissions=document.querySelectorAll("a[href*='/gallery/']:not([SHP_hover])");

			submissions.forEach(link=>{
					link.setAttribute("SHP_hover","1");

					link.addEventListener("mouseenter",(ev)=>{
							callForHover(ev,getSubmission);
					},false);

					link.addEventListener("mouseleave",(ev)=>{
							els.style.display="none";
					},false);
			});

			const uploadLink=document.querySelectorAll("a[href*='/upload/artwork']:not([SHP_hover])");

			uploadLink.forEach(link=>{
					link.setAttribute("SHP_hover","1");

					link.addEventListener("mouseenter",(ev)=>{
							callForHover(ev,getUploadLimit);
					},false);

					link.addEventListener("mouseleave",(ev)=>{
							els.style.display="none";
					},false);
			});

			const inboxLink=document.querySelectorAll("a[href*='/inbox/notifications']:not([SHP_hover])");

			inboxLink.forEach(link=>{
					link.setAttribute("SHP_hover","1");

					link.addEventListener("mouseenter",(ev)=>{
							callForHover(ev,getInboxSummary);
					},false);

					link.addEventListener("mouseleave",(ev)=>{
							els.style.display="none";
					},false);
			});

			const profileLink=document.querySelectorAll("a[title^='@']:not([SHP_hover])");

			profileLink.forEach(link=>{
					link.setAttribute("SHP_hover","1");

					link.addEventListener("mouseenter",(ev)=>{
							callForHover(ev,getProfile);
					},false);

					link.addEventListener("mouseleave",(ev)=>{
							els.style.display="none";
					},false);
			});
	}

	setInterval(init,1000);
})();