// ==UserScript==
// @name        Instagram 4K Screen UI
// @license     MIT
// @namespace   https://greasyfork.org/en/scripts/447896-instagram-4k-screen-ui
// @description Improve the view of instagram on 4K screen
// @icon        https://i.imgur.com/obCmlr9.png
// @match       https://www.instagram.com/*
// @grant       GM_registerMenuCommand
// @grant		GM_getValue
// @grant		GM_setValue
// @version     1.1
// @downloadURL https://update.greasyfork.org/scripts/447896/Instagram%204K%20Screen%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/447896/Instagram%204K%20Screen%20UI.meta.js
// ==/UserScript==

var mainUISize = {
   get() {
      return parseInt(GM_getValue("mainUISize", "1200"))
   },
   set(vl) {
      GM_setValue("mainUISize", vl + "")
   }
};

var subUISize={
   get() {
      return parseInt(GM_getValue("subUISize", "2000"))
   },
   set(vl) {
      GM_setValue("subUISize", vl + "")
   }
};

var applyNewStyle = () => {
	let m1=document.querySelectorAll("._a3gq ._aal-");
	let m2=document.querySelectorAll("._a3gq ._aam3");
	let s1=document.querySelectorAll("._a3gq ._aa_y");
	if(m1.length>0)m1[0].style.maxWidth=mainUISize.get()+"px";
	if(m2.length>0)m2[0].style.maxWidth=mainUISize.get()+"px";
	if(s1.length>0)s1[0].style.maxWidth=subUISize.get()+"px";
};

var setup = () => {
   let setupDiv = document.getElementById("instagram_4k_screen_ui_setup_div");
   if (!setupDiv) {
      setupDiv = document.createElement("div");
      setupDiv.id = "instagram_4k_screen_ui_setup_div";
      setupDiv.style.position = "fixed";
      setupDiv.style.zIndex = 999;
      setupDiv.style.left = "10%";
      setupDiv.style.top = "1%";
      setupDiv.style.backgroundColor = "#5f71a0";
      setupDiv.style.color = "White";
      setupDiv.style.borderRadius = "5px";
      setupDiv.innerHTML =`
		<p>
			<b>Main UI width (Unit:px):：</b><input type="text" maxlength="4" style="text-align:center;" id="i4su_main_ui_width" value="${mainUISize.get()}"/>
			<b>Sub UI width (Unit:px):：</b><input type="text" maxlength="4" style="text-align:center;" id="i4su_sub_ui_width" value="${subUISize.get()}"/>
			<button id="i4su_ok">Apply</button><button id="i4su_cancel">Cancel</button>
		</p>`;
      setupDiv.style.display = "none";
      document.body.appendChild(setupDiv);
      document.getElementById("i4su_ok").onclick = () => {
         let z = document.getElementById("i4su_main_ui_width").value.trim();
		 let z1= document.getElementById("i4su_sub_ui_width").value.trim();
         if (/[0-9]{3,4}/.test(z) && /[0-9]{3,4}/.test(z1)) {
            let n = parseInt(z);
			let n1= parseInt(z1);
            if (n >= 100 && n <= window.screen.width && n1>=100 && n1<=window.screen.width) {
				mainUISize.set(n);
				subUISize.set(n1);
				applyNewStyle();
            	document.getElementById("instagram_4k_screen_ui_setup_div").style.display = "none";
            	return;
            }
         }
         alert("Incorrect input! Please input numbers that between 100 to your screen width.");
      };
      document.getElementById("i4su_cancel").onclick = () => {
		document.getElementById("i4su_main_ui_width").value=mainUISize.get()+"";
		document.getElementById("i4su_sub_ui_width").value=subUISize.get()+"";
      	document.getElementById("instagram_4k_screen_ui_setup_div").style.display = "none";
      }
   }
   setupDiv.style.display = "block"
};

GM_registerMenuCommand("UI width settings", setup);

if(document.readyState=="interactive"){
	let t=0,tNow=-2;
	//reset tNow Timer
	setInterval(()=>{tNow=(new Date()).getSeconds();},3000);
	//main event
	window.addEventListener('DOMNodeInserted', (event)=> {
		t=(new Date()).getSeconds()
		if(t-tNow > 1){
			applyNewStyle();
			tNow=t;
		}
		else{
			if(tNow>57){
				if(t===0){
					tNow=-2;
				}
			}
		}
	},false);
};