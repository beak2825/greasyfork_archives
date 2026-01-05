// ==UserScript==
// @name         BS Shoutbox Popout/iframe
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Benutz die SB dort wo du sie brauchst ;)
// @author       jonnyy / High_village
// @match        https://bs.to/home
// @grant        none
// @icon         https://bs.to/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/29680/BS%20Shoutbox%20Popoutiframe.user.js
// @updateURL https://update.greasyfork.org/scripts/29680/BS%20Shoutbox%20Popoutiframe.meta.js
// ==/UserScript==
 
(function() {
	'use strict';
	var t;
	if(!location.hash.split("popup=")[1]||location.hash.split("popup=")[1].indexOf("true")===-1){
		if(document.getElementById("navigation")){
			if(location.href.replace(location.hash,"")=="https://bs.to/"||location.href.replace(location.hash,"")=="https://bs.to/home"){
				document.getElementById("shoutbox").children[0].appendChild(t=document.getElementById("navigation").children[0].children[0].cloneNode(true));
				t.innerText="POPOUT";
				t.style.cursor="pointer";
				var width=60;
				t.style.float="right";
				t.style.left=t.parentElement.clientWidth-width+"px";
				t.onclick=function(){
					var wnd=open("https://bs.to/home#popup=true",null,{width:280,height:500,location:0,menubar:0});
				};
			}else{
				localStorage.setItem("BSTOPOPUP",true);
				var btn = document.createElement("BUTTON");
				document.body.appendChild(btn);
				btn.innerText="SB";
				btn.onmouseover=function(a,b){
					a.target.children[0].style.visibility="visible";
				};
				btn.onmouseleave=function(a){
					a.target.children[0].style.visibility="hidden";
				};
				btn.style.opacity="0.85";
				var s=btn.style;
				s.position="fixed";
				s.height="30px";
				s.width="30px";
				s.top="0";
				s.zIndex=20999999999;
				var i = document.createElement('iframe');
				i.style.position="fixed";
				btn.appendChild(i);
				i.frameBorder = "0";
				i.src = "https://bs.to/home#popup=true";
				var st=i.style;
				st.transform="scale(0.8)";
				st.left="-46px";
				st.top="-64px";
				st.height="614px";
				st.width="435px";
				st.zIndex=20999999999;
				st.visibility="hidden";
			}
		}
	}else if(location.hash.split("popup=")[1].indexOf("true")===0){
		var el=document.getElementsByClassName("home")[0].children;
		for(var i=el.length-1;i>-1;i--){
			if(el[i].localName=="h2"){
				el[i].remove();
			}
			for(var j=el[i].children.length-1;j>-1;j--){
				if(el[i].children[j].id!=="shoutbox"){
					el[i].children[j].remove();
				}else{
					el[i].children[j].style.marginTop="0px";
					el[i].children[j].style.position="fixed";
					el[i].children[j].style.left="5px";
				}
			}

		}
		$("nav")[0].remove();
		$("header")[0].remove();
		$("footer")[0].remove();
		document.getElementsByClassName("home")[0].style.height="0px";
		document.getElementsByClassName("home")[0].style.padding="0px";
		document.getElementById("root").style.height="0px";
		document.getElementById("root").style.paddingBottom="0px";
		window.resizeTo(435,700);
	}
	// Your code here...
})();