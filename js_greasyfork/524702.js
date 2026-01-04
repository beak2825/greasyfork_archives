// ==UserScript==
// @name         x Downloader
// @version      8.5.2
// @description  download mp4 @ pornhub.com xhamster.com spankbang.com tnaflix.com
// @author       https://t.me/cyru55
// @namespace    cyru55_x
// @match        https://*.pornhub.com/*
// @match        https://*.xhamster.com/*
// @match        https://spankbang.com/*
// @match        https://*.tnaflix.com/*
// @run-at       document-end
// @unwrap       x
// @sandbox      raw
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @license      WTFPL
// @connect      pornhub.com
// @connect      pornhub.org
// @connect      phncdn.com
// @downloadURL https://update.greasyfork.org/scripts/524702/x%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/524702/x%20Downloader.meta.js
// ==/UserScript==

function O2S(n){let o=[];if(null==n)return String(n);if("object"==typeof n&&null==n.join){for(prop in n)n.hasOwnProperty(prop)&&o.push(prop+": "+O2S(n[prop]));return"{"+o.join(",")+"}"}if("object"==typeof n&&null!=n.join){for(prop in n)o.push(O2S(n[prop]));return"["+o.join(",")+"]"}return"function"==typeof n?o.push(n.toString()):o.push(JSON.stringify(n)),o.join(",")}

( (N5,Win)=>{

	const Cy = {
		is: (H=>{ let P,L;return P=H.split("."),L=P.length-1,P[L].length<3?H:P.slice(-(L<2?2:L)).join("."); })(Win.location.host)??"",
		el:{
			id: str => Win.document.getElementById(str),
			cls: str => Win.document.getElementsByClassName(str),
			q: str => Win.document.querySelectorAll(str),
			q1: str => Win.document.querySelector(str),
			del: el => {
				if(typeof(el)=="string") el=Cy.el.id(el);
				try{if(el) el.parentNode.removeChild(el);}catch{}
			},
		}
	};

	Cy[N5] = {
		ALERT: 1,
		log: str=>{console.log("%c"+N5,"background-color:#930;color:#fff;",str);},
		err: str=>{
			if(Cy.N5?.ALERT){if(typeof(str)!="string") try{str=JSON.stringify(str)}catch{str="!STRING"};alert(str);}
			else console.error("%c"+N5,"background-color:#C00;color:#fff;",str);
		},
		name_gen: str=>{
			if(typeof(str)!="string"||str.length<1) return "";
			let title = str
				.replace(/'s/ig,"")
				.replace(/[^\w\s\-\+\.,]/g,"")
				.replace(/([\-\+\.,]){2,}/g,"$1")
				.replace(/\s+/g," ")
				.replace(/^[\-\+\.\s_,]+/,"")
				.replace(/[\-\+\.\s_,]+$/,"")
				.replace(/\W*S\d+E\d+\W*/,"");
			return title.substr(0,232);
		},
		fetch: (url,cb,obj)=>{
			Cy[N5].log("--------------- fetch: fetch");
			fetch(url,{mode:"cors"})
			.then( res=>{
				if(res.ok)
					return res.text();
				throw("server returns non2xx");
			})
			.then( txt=>{
				Cy[N5].log(">fetch "+txt);
				cb(txt,obj);
			})
			.catch( err=>{
				alert("Error while api request\n\n"+err);
			});
		},
		ph_block_adblock_blockers: ()=>{
			if(typeof(page_params)!="undefined")
				page_params.isAdBlockEnable=false;
			if(typeof(setCookieAdvanced)=="function")
				setCookieAdvanced("adBlockAlertHidden",1,1,"/","pornhub.com");
			Cy.el.del("abAlert");
			if(typeof(MG_Utils)!="undefined"){
				let header=Cy.el.id("header");
				if(header)
					MG_Utils.removeClass(header,"hasAdAlert");
			}
		},
		ph_rm_age_nag: ()=>{
			Cy.el.del("ageDisclaimerMainBG");
			Cy.el.del("ageDisclaimerOverlay");
			Cy.el.del("js-ageDisclaimerModal");
			Cy.el.del("modalWrapMTubes");
			if(typeof(setCookieAdvanced)=="function")
				setCookieAdvanced("accessAgeDisclaimerPH",1,1,"/","pornhub.com");
		},
		ph_change_params: ()=>{
			for(let i=32;i;){
				setTimeout( ()=>{
					if(typeof(essentialCookiesListAll)!="undefined"){
						essentialCookiesListAll["pornhub.com"]["CookieConsent"]=3;
						essentialCookiesListAll["pornhub.com"]["cookieConsent"]=3;
						essentialCookiesListAll["pornhub.com"]["accessAgeDisclaimerPH"]=1;
						essentialCookiesListAll["pornhub.com"]["accessAgeDisclaimerUK"]=1;
						essentialCookiesListAll["pornhub.com"]["accessPH"]=1;
						essentialCookiesListAll["pornhub.com"]["adBlockAlertHidden"]=1;
						essentialCookiesListAll["pornhub.com"]["age_verified"]=1;
						essentialCookiesListAll["pornhub.com"]["cookieBannerEU"]=1;
						essentialCookiesListAll["pornhub.com"]["cookieBannerState"]=1;
						essentialCookiesListAll["pornhub.com"]["cookiesBanner"]=1;
						essentialCookiesListAll["pornhub.com"]["cookiesBannerSeen"]=1;
						essentialCookiesListAll["pornhub.com"]["autoplay"]=0;
					}
				},500*--i);
			}
		},
		ph_to_list: (obj,src)=>{
			let out="";
			if(src.length){
				let title = Cy[N5].name_gen(obj.video_title);
				out = '<div style="text-align:center;"><a href="javascript:(()=>{ cymod.style.display=\'none\'; })();" style="color:#f00;font-size:99px;">x</a></div>';
				if(Win.location.href.indexOf("embed/")!=-1){
					out+='<div><a target="_blank" href="'+Win.location.href.replace("embed/","view_video.php?viewkey=")+'">🟡 High Resolution in New Tab</a></div><br>';
				}
				let vhex = window.location.search.match(/viewkey=([^&]+)/)[1];
				for(let i in src){
					if(src[i].format=="mp4"){
						out+='<div>'+
							'<a target="dl" download="'+title+(vhex.length>3?" ,PH"+vhex:"")+'.mp4" href="'+src[i].videoUrl+'">⬇️ '+src[i].quality+'</a>'+
							'<button onclick="(()=>{ if(typeof(GM_setClipboard)!=\'undefined\') GM_setClipboard(\''+src[i].videoUrl+'\',\'text\');else try{navigator.clipboard.writeText(\''+src[i].videoUrl+'\');}catch(e){} })();" style="margin-left:32px;padding:8px;cursor:pointer">📎</button>'+
						'</div>';
					}
				}
				if(vhex.length>3){
					out+='<br><input type="text" value="PH_'+vhex+'" style="width:96%;font-size:20px;" onclick="((_)=>{_.select();if(typeof(GM_setClipboard)!=\'undefined\') GM_setClipboard(_.value,\'text\');else try{navigator.clipboard.writeText(_.value);}catch(e){};})(this);"/>';
					out+='<br><input type="text" value="'+title+(vhex.length>3?" ,PH"+vhex:"")+'" style="width:96%;font-size:20px;" onclick="((_)=>{_.select();if(typeof(GM_setClipboard)!=\'undefined\') GM_setClipboard(_.value,\'text\');else try{navigator.clipboard.writeText(_.value);}catch(e){};})(this);"/>';
				}
			}
			return out;
		},
		xh_to_list_2024: (obj,src)=>{
			let out="";
			let title = Cy[N5].name_gen(obj?.videoTitle?.pageTitle??"");
			out = '<div style="text-align:center;"><a href="javascript:(()=>{ cymod.style.display=\'none\'; })();" style="color:#f00;font-size:99px;">x</a></div>';
			let vid = Win.location.href.slice(Win.location.href.lastIndexOf("-")+1);
			for(let k in src){
				let web = obj?.xhlMlSource?.payload?.site?? obj?.collectorData?.site;
				if(web=="mobile"){
					let link = src[k]?.label?? src[k]?.quality?? "Click";
					if(link!="auto"){
						out+='<div>'+
							'<a target="dl" style="color:#ff0" download="'+title+(vid.length>3?" ,XH"+vid:"")+'.mp4" href="'+src[k].url+'">⬇️ '+link+'</a>'+
							'<button onclick="(()=>{ if(typeof(GM_setClipboard)!=\'undefined\') GM_setClipboard(\''+src[k].url+'\',\'text\');else try{navigator.clipboard.writeText(\''+src[k].url+'\');}catch(e){} })();" style="margin-left:32px;padding:8px;cursor:pointer">📎</button>'+
						'</div>';
					}
				}else{// desktop
					out+='<div>'+
						'<a target="dl" style="color:#ff0" download="'+title+(vid.length>3?" ,XH"+vid:"")+'.mp4" href="'+src[k]+'">⬇️ '+k+'</a>'+
						'<button onclick="(()=>{ if(typeof(GM_setClipboard)!=\'undefined\') GM_setClipboard(\''+src[k]+'\',\'text\');else try{navigator.clipboard.writeText(\''+src[k]+'\');}catch(e){} })();" style="margin-left:32px;padding:8px;cursor:pointer">📎</button>'+
					'</div>';
				}
			}
			if(vid.length>3){
				out+='<br><input type="text" value="XH_'+vid+'" style="width:96%;font-size:20px;" onclick="((_)=>{_.select();if(typeof(GM_setClipboard)!=\'undefined\') GM_setClipboard(_.value,\'text\');else try{navigator.clipboard.writeText(_.value);}catch(e){};})(this);"/>';
				out+='<br><input type="text" value="'+title+(vid.length>3?" ,XH"+vid:"")+'" style="width:96%;font-size:20px;" onclick="((_)=>{_.select();if(typeof(GM_setClipboard)!=\'undefined\') GM_setClipboard(_.value,\'text\');else try{navigator.clipboard.writeText(_.value);}catch(e){};})(this);"/>';
			}
			return out;
		},
		xh_to_list: (obj,src)=>{
			let out="";
			let title = Cy[N5].name_gen(obj?.videoTitle?.pageTitle??"");
			out = '<div style="text-align:center;"><a href="javascript:(()=>{ cymod.style.display=\'none\'; })();" style="color:#f00;font-size:99px;">x</a></div>';
			let loc=Win.location.href;
			let pos_start=loc.lastIndexOf("-")+1;
			let pos_end=loc.indexOf("?");
			let vid=loc.slice(pos_start,(pos_end>0?pos_end:loc.length));
			out+='<div>'+
				'<a target="dl" style="color:#ff0" download="'+title+(vid.length>3?" ,XH"+vid:"")+'.mp4" href="'+src+'">⬇️ 480p</a>'+
				'<button onclick="(()=>{ if(typeof(GM_setClipboard)!=\'undefined\') GM_setClipboard(\''+src+'\',\'text\');else try{navigator.clipboard.writeText(\''+src+'\');}catch(e){} })();" style="margin-left:32px;padding:8px;cursor:pointer">📎</button>'+
			'</div>';
			if(vid.length>3){
				out+='<br><input type="text" value="XH_'+vid+'" style="width:96%;font-size:20px;" onclick="((_)=>{_.select();if(typeof(GM_setClipboard)!=\'undefined\') GM_setClipboard(_.value,\'text\');else try{navigator.clipboard.writeText(_.value);}catch(e){};})(this);"/>';
				out+='<br><input type="text" value="'+title+(vid.length>3?" ,XH"+vid:"")+'" style="width:96%;font-size:20px;" onclick="((_)=>{_.select();if(typeof(GM_setClipboard)!=\'undefined\') GM_setClipboard(_.value,\'text\');else try{navigator.clipboard.writeText(_.value);}catch(e){};})(this);"/>';
			}
			return out;
		},
		sb_to_list: (name,src)=>{
			let out="";
			let title = Cy[N5].name_gen(name);
			out = '<div style="text-align:center;"><a href="javascript:(()=>{ cymod.style.display=\'none\'; })();" style="color:#f00;font-size:99px;">x</a></div>';
			let vid = Win.location.pathname.split("/")[1];
			for(let k in src){
				if(
					["240p","320p","480p","720p","1080p","4k"].includes(k)&&
					src[k].length
				){
					out+='<div>'+
						'<a target="dl" style="color:#ff0" download="'+title+(vid.length?" ,SB"+vid:"")+'.mp4" href="'+src[k][0]+'">⬇️ '+k+'</a>'+
						'<button onclick="(()=>{ if(typeof(GM_setClipboard)!=\'undefined\') GM_setClipboard(\''+src[k][0]+'\',\'text\');else try{navigator.clipboard.writeText(\''+src[k][0]+'\');}catch(e){} })();" style="margin-left:32px;padding:8px;cursor:pointer">📎</button>'+
					'</div>';
				}
			}
			if(vid.length>3){
				out+='<br><input type="text" value="SB_'+vid+'" style="width:96%;font-size:20px;" onclick="((_)=>{_.select();if(typeof(GM_setClipboard)!=\'undefined\') GM_setClipboard(_.value,\'text\');else try{navigator.clipboard.writeText(_.value);}catch(e){};})(this);"/>';
				out+='<br><input type="text" value="'+title+(vid.length>3?" ,SB"+vid:"")+'" style="width:96%;font-size:20px;" onclick="((_)=>{_.select();if(typeof(GM_setClipboard)!=\'undefined\') GM_setClipboard(_.value,\'text\');else try{navigator.clipboard.writeText(_.value);}catch(e){};})(this);"/>';
			}
			return out;
		},
		tn_to_list: (obj)=>{
			let out="";
			let title = Cy[N5].name_gen(obj?.name);
			out = '<div style="text-align:center;"><a href="javascript:(()=>{ cymod.style.display=\'none\'; })();" style="color:#f00;font-size:99px;">x</a></div>';
			for(let link of obj.vids){
				let pos=link.lastIndexOf(".");let resolution=link.substring(pos-5,pos).replace("-","");
				out+='<div>'+
					'<a target="dl" style="color:#ff0" download="'+title+(obj?.vid.length?" ,TN"+obj?.vid:"")+'.mp4" href="'+link+'">⬇️ '+resolution+'</a>'+
					'<button onclick="(()=>{ if(typeof(GM_setClipboard)!=\'undefined\') GM_setClipboard(\''+link+'\',\'text\');else try{navigator.clipboard.writeText(\''+link+'\');}catch(e){} })();" style="margin-left:32px;padding:8px;cursor:pointer">📎</button>'+
				'</div>';
			}
			if(obj?.vid.length>3){
				out+='<br><input type="text" value="TN_'+obj?.vid+'" style="width:96%;font-size:20px;" onclick="((_)=>{_.select();if(typeof(GM_setClipboard)!=\'undefined\') GM_setClipboard(_.value,\'text\');else try{navigator.clipboard.writeText(_.value);}catch(e){};})(this);"/>';
				out+='<br><input type="text" value="'+title+(obj?.vid.length>3?" ,TN"+obj?.vid:"")+'" style="width:96%;font-size:20px;" onclick="((_)=>{_.select();if(typeof(GM_setClipboard)!=\'undefined\') GM_setClipboard(_.value,\'text\');else try{navigator.clipboard.writeText(_.value);}catch(e){};})(this);"/>';
			}
			return out;
		},
		make_modal: (obj,src)=>{
			Cy[N5].log("--------------- make_modal");
			let html =
				Cy.is=="pornhub.com"? Cy[N5].ph_to_list(obj,src):
				Cy.is=="xhamster.com"? Cy[N5].xh_to_list(obj,src):
				Cy.is=="tnaflix.com"? Cy[N5].tn_to_list(obj):
				Cy[N5].sb_to_list(obj,src);// spankbang.com
			if(html.length){
				let top_pop = Win.document.createElement("div");
				top_pop.id = "cymod";
				top_pop.style.cssText =
					'position:fixed;'+
					'z-index:999;'+
					'top:50%;'+
					'left:50%;'+
					'transform:translate(-50%,-70%);'+
					'width:320px;'+
					'width:60vw;'+
					'background:#000;'+
					'background:#000c;'+
					'padding:0 40px 40px;'+
					'border-radius:44px;'+
					'box-shadow:0 0 44px 22px #000;'+
					'font-size:24px;';
				top_pop.innerHTML = html;
				Win.document.body.appendChild(top_pop);
				// hide modal in dl btn
				if(Cy.is=="pornhub.com"){
					let is_mobile= typeof(isPlatformMobile)!="undefined"&&isPlatformMobile==1 || typeof(FLAG_COMMENT_DATA)!="undefined"&&FLAG_COMMENT_DATA.platform=="mobile";
					let el=Cy.el.id(is_mobile?"flagVideoBtn":"video_flag");
					if(!el) el=Cy.el.id("phubLogo");
					let dl_btn = Win.document.createElement("input");
					dl_btn.id = "btn_dl";
					dl_btn.type = "button";
					dl_btn.value = "Download";
					dl_btn.style.cssText="background:#723;border-radius:24px;animation:cyglow 2s infinite;min-width:48px;";
					if(!is_mobile) dl_btn.style.cssText+="padding:7px;";
					dl_btn.onclick=()=>{ top_pop.style.display="block"; };
					el.parentNode.appendChild(dl_btn);
					Cy.el.del(el);
					if(typeof(InstallTrigger)=="undefined")
						top_pop.style.display="none";
				}
			}
		},
		handler: obj=>{
			Cy[N5].log("--------------- handler");
			if(Cy.is=="pornhub.com"){
				for(let i in obj.mediaDefinitions){
					if(obj.mediaDefinitions[i].format=="mp4"){
						Cy[N5].log("---------------> "+obj.mediaDefinitions[i].videoUrl);
						let str=Cy[N5].fetch(
							obj.mediaDefinitions[i].videoUrl,
							(t,o)=>{
								Cy[N5].log("fetch>cb "+t);
								if(t.length){
									let json={};try{ json=JSON.parse(t); }catch{}
									Cy[N5].log(json);
									if(Object.keys(json).length)
										Cy[N5].make_modal(o,json);
								}
							},
							obj
						);
						break;
					}
				}
			}else if(Cy.is=="xhamster.com"){
				Cy[N5].make_modal(Win.initials, obj);
			}else if(Cy.is=="spankbang.com"){
				let name = "";
				let ld = Win.document.querySelectorAll('script[type="application/ld+json"]')[0].textContent;
				if(ld){
					let json = {};
					try{
						json = JSON.parse(ld);
						if(Object.keys(json).length){
							name = json.name;
						}
					}catch(e){}
				}
				Cy[N5].make_modal(name, obj);
			}else if(Cy.is=="tnaflix.com"){
				Cy[N5].make_modal(obj);
			}
		}
	};

	Cy[N5].log("--------------- RUN @ "+Cy.is);

	if(Cy.is=="pornhub.com"){
		if(Win.location.href.indexOf("embed/")>0||Win.location.href.indexOf("view_video.php")>0){
			let vid = 0;
			let vars = null;
			if(typeof(Win.VIDEO_SHOW)!="undefined")
				vid = parseInt(Win.VIDEO_SHOW?.trackVideoId?? Win.VIDEO_SHOW?.video_id?? "0");
			if(!vid && typeof(VIDEO_SHOW)!="undefined")
				vid = parseInt(VIDEO_SHOW?.trackVideoId?? VIDEO_SHOW?.video_id?? "0");
			if(vid>0){
				Cy[N5].log("vid: "+vid);
				if(Win.hasOwnProperty("flashvars_"+vid)){
					vars = Win["flashvars_"+vid];
				}
			}
			if(vars==null){
				for(let k in Win) if(k.startsWith("flashvars")) vars=Win[k];
			}
			if(vars!=null){
				Cy[N5].log("vars: "+JSON.stringify(vars));
				if(vars.hasOwnProperty("mediaDefinitions")){
					Cy[N5].handler(vars);
				}else Cy[N5].err("'flashvars' found but not contains 'mediaDefinitions'");
			}else{
				Cy[N5].log("try sandbox");
				let ta=Win.document.createElement("textarea");
				ta.id="cyru55";
				ta.value="const Win=window; const N5='cyru55_x'; const Cy = "+O2S(Cy)+`;

					Cy[N5].log("sandbox run");
					let vid = 0;
					let vars = null;
					if(typeof(Win.VIDEO_SHOW)!="undefined")
						vid = parseInt(Win.VIDEO_SHOW?.trackVideoId?? Win.VIDEO_SHOW?.video_id?? "0");
					if(!vid && typeof(VIDEO_SHOW)!="undefined")
						vid = parseInt(VIDEO_SHOW?.trackVideoId?? VIDEO_SHOW?.video_id?? "0");
					if(vid>0){
						Cy[N5].log("vid: "+vid);
						if(Win.hasOwnProperty("flashvars_"+vid)){
							vars = Win["flashvars_"+vid];
						}
					}
					if(vars==null){
						for(let k in Win) if(k.startsWith("flashvars")) vars=Win[k];
					}
					if(vars!=null){
						Cy[N5].log("vars: "+JSON.stringify(vars));
						if(vars.hasOwnProperty("mediaDefinitions")){
							Cy[N5].handler(vars);
						}else Cy[N5].err("'flashvars' found but not contains 'mediaDefinitions'");
					}else Cy[N5].err("cant find 'flashvars'");
				`;
				Win.document.body.appendChild(ta);
				Win.document.body.setAttribute("onload",'window.eval(document.getElementById("cyru55").value);');
			}
		}
		// maximize view with removing right panel
		//for(let sideColumn of Cy.el.q("div.sideColumn")) Cy.el.del(sideColumn);// remove every side contents
		// just hide righ-side panel
		Cy.el.del(Cy.el.q1("#vpContentContainer .topSectionGrid .sideColumn"));
		// then maximize video width
		let el=Cy.el.q1("#vpContentContainer .topSectionGrid");
		if(el) el.style.display="block";
		// bigger watched flag
		let style1 = document.createElement("style");
		style1.innerText = "div.watchedVideoText{line-height:32px;font-size:32px;} @keyframes cyglow{0%{box-shadow:0 0 0px #f00}50%{box-shadow:0 0 48px #f00}}";
		document.head.appendChild(style1);
		// remove adblock blockers
		for(let i=16;i;) setTimeout( ()=>Cy[N5].ph_block_adblock_blockers(), 200*--i);
		// remove cookie banner
		Cy.el.del("cookieBanner");
		document.cookie = "cookieConsent=3; expires=0;domain=pornhub.com;secure;path=/";
		// may set backend dont-show-ads
		if(typeof(MG_Utils)!="undefined")
			MG_Utils.ajaxCall({
				type: "GET",
				url: "/front/cookie_kill_ajax",
				data: {cookie_name: "showPremiumWelcomeFromPornhub"}
			});
		// try set custom settings
		Cy[N5].ph_change_params();
		// remove Ads
		setInterval(()=>{
			// overlay text ads on the video
			Cy.el.del(Cy.el.q1("#player div.mgp_overlayText"));
			// side of video ads, on desktop only
			let side_ads=Cy.el.q(".sideAds");
			if(side_ads.length)
				side_ads.forEach(N=>N.remove());
		},500);
		// remove age warning
		//Cy.ph_rm_age_nag();
	}else if(Cy.is=="xhamster.com"){
		if(Win.location.pathname.indexOf("/videos/")==0){
			// also remove ads at buttom inside the video
			for(let el of Cy.el.q("div.player-container>div")){
				let cl=el.classList;
				if(!cl.length){// !cl.contains("player-container__player") && !cl.contains("xplayer")
					Cy.el.del(el);
				}
			}
			// remove all another possible promo ads
			for(let el of Cy.el.q("[data-role='promo-messages-wrapper']")){
				Cy.el.del(el);
			}
			// remove another rubbish inside the player
			for(let el of Cy.el.q("div.player-container__player>div:not([class^='xp'])")){
				let c=el.getAttribute("class")??"";
				if(!c.startsWith("control-bar") && !c.startsWith("settings") && el?.id!="custom-subtitles" || c.startsWith("xp-subscribe")){
					Cy.el.del(el);
				}
			}
			// try remove right ads
			setInterval(()=>{
				for(let el of Cy.el.q("div.with-player-container>div")){
					let cl=el.classList;
					let dr=el.getAttribute("data-role");
					if(cl.length && !cl.contains("player-container") && !cl.contains("controls-info") || !cl.length && dr!="video-actions-bar" && dr!="video-title"){
						Cy.el.del(el);
					}
				}
			},500);
			// remove pause on the video ads
			setInterval(()=>{
				Cy.el.del(Cy.el.q1("div.player-container__player>div[class$='pauseSpotContainer']"));
			},100);
			// try find download URL's
			let url=Cy.el.q1("div.player-container>a").href??"";
			if(url.length){
				Cy[N5].handler(url);
			}
			/*if(Win.hasOwnProperty("initials")){
				let mp4 = initials?.videoModel?.sources?.mp4?? initials?.xplayerSettings?.sources?.standard?.h264;
				if(mp4){
					Cy[N5].handler(mp4);
				}else alert("it seems website scripts changed\ncontact me @cyru55");
				setInterval( ()=>{
					let ads = document.querySelectorAll("div.thumb-list>div:not(.thumb-list__item)");
					for(let ad of ads) Cy.el.del(ad);
				}, 200);
			}*/
			// make WATCHED flag bigger, remove right margin
			let css = document.createElement("style");
			css.innerText = `
			.player-container{margin-right:unset !important}
			.thumb-image-container__watched{background:red !important;height:32px !important}
			.thumb-image-container__watched>div{font-size:26px}`;
			document.getElementsByTagName("head")[0].appendChild(css);
		}
	}else if(Cy.is=="spankbang.com"){
		if(
			Win.location.pathname.length>1&&
			Win.hasOwnProperty("stream_data")
		){
			if(stream_data.length){
				Cy[N5].handler(stream_data);
			}else alert("it seems website scripts changed\ncontact me @cyru55");
		}
		let styl = document.getElementsByTagName("style");
		styl[styl.length-1].innerText+="#cymod input{background:#323232}";
		Cy.el.del(Cy.el.q1("#video .right"));
	}else if(Cy.is=="tnaflix.com"){
		if(Win.location.pathname.length>1){
			Cy[N5].i_tn1=setInterval(()=>{
				let vid_el=Cy.el.id("video-player");
				if(vid_el.children.length){
					clearInterval(Cy[N5].i_tn1);
					let vid=~~vid_el.getAttribute("data-vid");
					let vids=[];
					for(let el of vid_el.children){
						let link=el.getAttribute("src")??"";
						if(link.length) vids.push(link);
					}
					let name = "";
					let ld = document.querySelectorAll('script[type="application/ld+json"]')[0].textContent;
					if(ld){
						let json = {};
						try{
							json = JSON.parse(ld);
							if(Object.keys(json).length){
								name = json.name;
							}
						}catch(e){}
					}
					Cy[N5].log({"vid":vid,"vids":vids,"name":name});
					if(vids.length)
						Cy[N5].handler({"vid":vid+"","vids":vids,"name":name});
				}
			},500);
		}
	}

})(
	"cyru55_x",
	typeof(unsafeWindow)=="undefined"? window: unsafeWindow
);