// ==UserScript==
// @name         PH_Downloader
// @namespace    ph
// @version      0.0.4
// @description  pornhub.com
// @author       Hmhm
// @match        *://*.pornhub.com/view_video.php?viewkey=*
// @match        *://*.pornhubpremium.com/view_video.php?viewkey=*
// @grant        unsafeWindow
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/524722/PH_Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/524722/PH_Downloader.meta.js
// ==/UserScript==

(Win=>{
	for(let key in Win){
		if(key.startsWith("flashvars_")){
			for(let md of Win[key]?.mediaDefinitions){
				if(md?.format=="mp4"){
					fetch(md.videoUrl,{mode:"cors"}).then(r=>r.json()).then(json=>{
						let dom = document.createElement("div");
						dom.innerHTML = json.map(obj=>`<h1><a href="${obj?.videoUrl}">${obj?.quality}p</a></h1>`).join("");
						if(typeof(isPlatformMobile)!="undefined"&&isPlatformMobile==1)
							document.body.insertBefore(dom,document.querySelector("#mobileContainer"));
						else
							document.querySelector("#main-container").insertBefore(dom,document.querySelector("#vpContentContainer"));
					});break;
				}
			}
		}
	}
})(unsafeWindow??window);