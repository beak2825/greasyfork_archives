// ==UserScript==
// @name         dA_showAIOnThumb
// @namespace    http://phi.pf-control.de
// @version      2024-05-10_2
// @description  Display on thumbnail that art was generated using AI!
// @author       Dediggefedde
// @match        *://*.deviantart.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deviantart.com
// @grant        GM_addStyle
// @grant   	 GM.setValue
// @grant   	 GM.getValue
// @license      MIT; http://opensource.org/licenses/MIT
// @sandbox      DOM
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/483414/dA_showAIOnThumb.user.js
// @updateURL https://update.greasyfork.org/scripts/483414/dA_showAIOnThumb.meta.js
// ==/UserScript==

(function() {
	'use strict';

	let settings = { //default setting values
			onlyOnHover:  false,                    //bool, true: check all thumbs for AI automatically; false: check only on hover
			AITags:       ["ai","aiart","dreamup","ai_generated","stable_diffusion"], //tags that will mark an art as AI in addition to dA's own "created with AI tools" marker
			hideAIThumbs: false,                    //remove AI thumbs instead of marking them
			// moveOtherThumbs:false, //not implemented
			autoIgnore:false,
			matureHandling:1 //{0:ignore, 1:blurr, 2:remove}
	};

	let bounceInterval =100; //int [ms], avoid multiple activation at once, minimum time before activating script again

	//helper variables
	let fetchedIDs={};
	let fetchedMatures={};
	let debounceTimeout = null; // Debounce-Timer

	//style for isAIgenerated!
	//checked items have the attribute. The value is "1" if they are AI generated, otherwise "0"
	//here: AI text with white background and blue circle over the thumbnail with 70% transparency
	GM_addStyle(`
	[isAIGenerated="1"] {
		/*thumbnail-link detected as AI*/
		position: relative;
	}

	[isAIGenerated="1"]::after {
		/* AI tag image above thumbnail*/
		content: "AI" !important;
		position: relative !important;
		left: 50% !important;
		top: -95% !important;
		padding: 5px !important;
		background: radial-gradient(ellipse at center, rgb(var(--g-bg-primary-rgb, 255, 255, 255)) 0%, rgb(var(--g-bg-primary-rgb, 255, 255, 255)) 60%, rgb(var(--green4-rgb, 0, 230, 150)) 65%, rgb(var(--green4-rgb, 0, 230, 150)) 70%, rgba(0, 0, 0, 0) 75%) !important;
		color: var(--g-typography-primary, black) !important;
		width: 15px !important;
		height: 15px !important;
		line-height: 15px !important;
		display: block !important;
		filter: opacity(70%) !important;
		transform: translateX(-50%) !important;
	}
	
	[isMature="2"] {
		visibility:hidden;
	}
	[isMature="1"]>* {
		filter: blur(10px);
	}
	[isMature="1"]:hover>* {
		filter: none;
	}
	[isMature="1"]::after {
		content: "M" !important;
		position: relative !important;
		left: 50% !important;
		top: -95% !important;
		padding: 5px !important;
		width: 15px !important;
		height: 15px !important;
		line-height: 15px !important;
		display: block !important;
		filter: opacity(70%) !important;
		transform: translateX(-50%) !important;
		background: radial-gradient(ellipse at center, rgb(var(--g-bg-primary-rgb, 255, 255, 255)) 0%, rgb(var(--g-bg-primary-rgb, 255, 255, 255)) 60%, red 65%, red 70%, rgba(0, 0, 0, 0) 75%) !important;
		color: var(--g-typography-primary, black) !important;
	}
	[isMature="1"]:hover::after{
		content: none!important;
	}
	
	.dA_saiot_oldwatch [isAIGenerated="1"] {
		/*thumbnail link in /notifications/watch*/
		position: absolute;
	}

	.dA_saiot_oldwatch [isAIGenerated="1"]::after {
		/* AI tag in /notifications/watch*/
		top: 5% !important;
		visibility: visible;
	}

	#dA_saiot_notify p {
		/* Notification text*/
		font-weight: bold;
		text-align: center;
		margin: 0;
		color: var(--g-typography-secondary, black);
	}

	#dA_saiot_notify {
		/* Notification Container*/
		position: fixed;
		width: 400px;
		display: block;
		top: 0%;
		background-color: var(--g-bg-tertiary, white);
		padding: 10px;
		border-radius: 0 10px 10px 0;
		border: 1px solid var(--g-divider1, black);
		box-shadow: 1px 1px 2px var(--g-bg-primary, black);
		transition: left;
		transition-duration: 0.5s;
		transform: translateY(100%) translateY(10px);
		color: var(--g-typography-primary, black);
	}

	div.settings_form label {
		cursor: pointer;
	}
		
	.da_saiot_radiogroup {
    display: flex;
    gap: 10px; /* Abstand zwischen den Radio-Buttons */
    align-items: center; /* Vertikale Zentrierung */
	}

	.da_saiot_radiogroup input {
			margin-right: 5px; /* Abstand zwischen Radio-Button und Label */
	}

	.da_saiot_radiogroup label {
			margin-right: 20px; /* Abstand zwischen den Labeln */
	}

	/*Settings form headings*/
`);

	let msgbox,viewtimer;
	let thumbs;

	function notify(text){
			msgbox.innerHTML="<p>dA_showAiOnThumb</p>"+text;
			msgbox.style.left="0px";
			if(viewtimer!=null)clearTimeout(viewtimer);
			viewtimer=setTimeout(()=>{msgbox.style.left="-450px";},2000);
	}

	//request deviation data. deviation id, username and type ("art") is in the url.
	//include_session=false necessary
	function requestDevData(devID, username,type){
			let token=document.querySelector("input[name=validate_token]").value;

			return fetch(`https://www.deviantart.com/_puppy/dadeviation/init?deviationid=${devID}&username=${username}&type=${type}&include_session=false&csrf_token=${token}`, {
					method: "GET",
					headers: {
							"accept": 'application/json, text/plain, */*',
							"content-type": 'application/json;charset=UTF-8'
					},
					credentials: 'include' // Cookies!
			}).then(async (response) => {
					if (!response.ok) {
							throw response; // HTTP-Statuscode
					}
					try{
							const result = await response.json(); // JSON parsen
							if (result.deviation === undefined || result.error !== undefined) {
									throw result;
							}
							return result; // Erfolgreiche Antwort
					}catch(ex){
							console.log("dA_showAiOnThumb error: parsing resonce",response);
							throw response;
					}
			});
	}

	//uses the da_ignore script (v2.2) to add AI making usernames automatically to an ignore list
	function autoignoreNam(el){
			if(!settings.autoIgnore)return;
			let nam=el.parentNode.querySelector("[data-username]").dataset.username;
			let ignoreEl=document.createElement("div");
			ignoreEl.classList.add("dA_ignore_externalAddName");
			ignoreEl.innerHTML=nam;
			document.body.appendChild(ignoreEl);
	}

	//takes a thumbnail link element, extracts information, triggers request and adds isAIGenerated attribute
	function checkAIGenerated(el){
			if(el.hasAttribute("isAIGenerated"))return; //skip for items already checked

			let handled=false;

			let url=el.href;
			let dats=/deviantart.com\/(.*?)\/(.*?)\/.*?-(\d+)$/gi.exec(url); //[match, artis, type, id] extracted from URL
			if(!dats)return;

			if(fetchedIDs[dats[3]]!==undefined){ //cached results for dev ID
				el.setAttribute("isAIGenerated",fetchedIDs[dats[3]]);
				handled=true;
			}
			if( settings.matureHandling>0 && fetchedMatures[dats[3]]!==undefined){
					el.setAttribute("isMature",fetchedMatures[dats[3]]);
					handled=true;
			}
			
			if(handled>0)return;

			requestDevData(dats[3],dats[1],dats[2]).then((res)=>{ //request of extented data from PUPPY-API
					try{ //responce might be successfull but have other object members

							if(res.deviation.isAiGenerated){ //extract and add information
									el.setAttribute("isAIGenerated","1"); //set element information
									fetchedIDs[dats[3]]="1"; //cache result for deviation id.
									autoignoreNam(el);
							}else{
									el.setAttribute("isAIGenerated","0");
									fetchedIDs[dats[3]]="0";
							}

							if(res.deviation.isMature){
									el.setAttribute("isMature",settings.matureHandling);
									fetchedMatures[dats[3]]=settings.matureHandling;
							}else{
									fetchedMatures[dats[3]]="0";
							}

							if(res.deviation.extended.tags!=null){
									res.deviation.extended.tags.forEach(tg=>{
											if(settings.AITags.includes(tg.name)){
													el.setAttribute("isAIGenerated","1"); //set element information
													fetchedIDs[dats[3]]="1"; //cache result for deviation id.
													autoignoreNam(el);
													//  moveAIImgs(el);
											}});
							}

					}catch(ex){
							console.log("dA_showAIOnThumb Error 2",ex,res); //error code 2, exception and return from server
					}
			})
					.catch(err=>{
					console.log("dA_showAIOnThumb Error 3",err); //error code 3, error code from promise call
			});
	}

	function init(){ //called on DOM change

			if(window.location.href.indexOf("/notifications/watch") > -1) document.body.classList.add("dA_saiot_oldwatch");
			else document.body.classList.remove("dA_saiot_oldwatch");

			if (location.href.indexOf('https://www.deviantart.com/settings') == 0 && document.getElementById("dA_showAiOnThumb_Options")==null) {

					if(!document.querySelector("#dA_saiot_notify")){
							msgbox=document.createElement("div");
							msgbox.id="dA_saiot_notify";
							msgbox.style.left="-450px";
							document.body.append(msgbox);
					}

					let menuPoint = document.createElement("li");
					menuPoint.innerHTML='<a href="#">AI Thumbnail</a>';
					menuPoint.id="dA_showAiOnThumb_Options";

					document.getElementById("settings_public").parentNode.after(menuPoint);

					menuPoint.firstChild.addEventListener("click",(ev)=>{
							document.querySelector("a.active").classList.remove("active");
							ev.target.classList.add("active");
							document.querySelector('div.settings_form').innerHTML=`
		<div class="fooview ch">
		<div class="fooview-inner">
			<h3>dA_showAIOnThumb Settings</h3>
			<div class="altaltview altaltview-wider">

				<div class="row">
				<input ${ settings.onlyOnHover ? 'checked="checked"' : '' } type="checkbox" id="da_saiot_checkhover" class="icheckbox">
				<label for="da_saiot_checkhover" class="l">Mark AI thumbs only on hover</label>
				<br><small>Check and mark AI images only when moving the cursor over the Thumbnail. Can improve performance on slower computers/connections. Otherwise all thumbnail are checked and marked when the appear.</small>
				</div>

				<div class="row">
				<input value='${ settings.AITags?settings.AITags.join(","):'' }' type="text" id="da_saiot_AITags" class="itext_uplifted" />
				<label for="da_saiot_AITags" class="l">Tags that mark deviations as AI</label>
				<br><small>Comma-separated. Deviations with tags in this list will be marked as AI-generated. If Deviantart marks a submission as AI-generated/assisted on its own, it will be marked in any case.</small>
				</div>

				<div class="row">
				<input ${ settings.hideAIThumbs ? 'checked="checked"' : '' } type="checkbox" id="da_saiot_removeAI" class="icheckbox">
				<label for="da_saiot_removeAI" class="l">Remove AI thumbs instead of marking them</label>
				<br><small>Instead of marking AI thumbnails, this will remove them and leave an empty space in place.</small>
				</div>

				<div class="row">
					<label class="l">Handle Mature Submissions</label>
					<div class='da_saiot_radiogroup'>
						<input type="radio" id="mature_ignore" name="matureSetting" value="0" 
								${settings.matureHandling === 0 ? 'checked="checked"' : ''}>
						<label for="mature_ignore">Ignore</label><br>
						<input type="radio" id="mature_blur" name="matureSetting" value="1" 
								${settings.matureHandling === 1 ? 'checked="checked"' : ''}>
						<label for="mature_blur">Blur</label><br>
						<input type="radio" id="mature_hide" name="matureSetting" value="2" 
								${settings.matureHandling === 2 ? 'checked="checked"' : ''}>
						<label for="mature_hide">Hide</label>
					</div>
					<small>Choose how to handle mature submissions: Ignore, blur them, or hide them completely.</small>
				</div>

				<div class="row">
				<input ${ settings.autoIgnore ? 'checked="checked"' : '' } type="checkbox" id="da_saiot_autoIgnore" class="icheckbox">
				<label for="da_saiot_removeAI" class="l">Automatically ignore users that post AI images</label>
				<br><small>This requires the userscript <a href='https://www.deviantart.com/dediggefedde/art/dA-Ignore-455554874'>dA_ignore</a>! It will add users that have posted AI art automatically to the ignore-list of dA_ignore.</small>
				</div>

			</div>

			<div class=" buttons ch hh " id="submit">
				<div style="text-align:right" class="rr">
					<a class="smbutton smbutton-green" href="javascript:void(0)"><span id="da_saiot_saveSettings">Save</span></a>
				</div>
			</div>

		</div>
		</div>
		`;
							document.getElementById('da_saiot_saveSettings').addEventListener("click",(ev)=> {
									settings.onlyOnHover = document.getElementById("da_saiot_checkhover").checked;
									settings.hideAIThumbs = document.getElementById("da_saiot_removeAI").checked;
									settings.autoIgnore = document.getElementById("da_saiot_autoIgnore").checked;
									settings.AITags = document.getElementById("da_saiot_AITags").value.split(',').map((el)=>{return el.trim();});
									settings.matureHandling = parseInt(document.querySelector('input[name="matureSetting"]:checked')?.value??1);
									setTimeout(() => {
											GM.setValue('settings',JSON.stringify(settings));
											notify("Settings saved!");
									}, 0);
							},false);

					},false);
			}


			//check all thumbs which were not already checked
			thumbs=[...document.querySelectorAll(`[data-testid="thumb"]:not([da_showaionthumb])`)];
			thumbs.forEach(el=>{
					let thmb=el.querySelector("a:not([data-username])");
					if(!thmb && el.tagName=="A")thmb=el;
					if(!thmb && el.parentNode.tagName=="A")thmb=el.parentNode;
					if(!thmb)thmb=el.parentNode.querySelector("a");
					if(!thmb)thmb=el.parentNode.parentNode.querySelector("a");
					if(!thmb)thmb=el.parentNode.parentNode.parentNode.querySelector("a");
					if(!thmb)return;

					if(!thmb.style.height)thmb.style.height=thmb.offsetHeight+"px"; //workaround for using "position:relative;top:-95%;"

					el.setAttribute("da_showaionthumb",""); //mark thumb as checked
					if(!settings.onlyOnHover){ //check all immediatelly
							checkAIGenerated(thmb); //function will cancel if already checked
					}else{ //check on mouseover
							thmb.addEventListener("mouseenter",(ev=>{
									checkAIGenerated(ev.target);
							}),false); //no bubbling
					}
			});

	}

	//delayed debounce to avoid calling it multiple times at once
	function debouncer(){
			if (debounceTimeout) { //within bounce interval
					clearTimeout(debounceTimeout);
			}
			debounceTimeout = setTimeout(() => {
					init();
					debounceTimeout = null;
			}, bounceInterval);
	}

	//loading settings
	GM.getValue("settings").then((res)=>{
			if(res==null)return;
			try{
					let savedSettings=JSON.parse(res);
					Object.entries(savedSettings).forEach(([key,val])=>{settings[key]=val});
			}catch(ex){
					console.log("dA_showAiOnThumb Error: loading settings",ex);
			}
			if(settings.hideAIThumbs){
					GM_addStyle("div:has(>[isAIGenerated='1']){display:none!important;}");
			}
	}).finally(()=>{
			const observer = new MutationObserver(debouncer);
			observer.observe(document.body,{ childList: true, subtree: true });
			debouncer();
	});

})();