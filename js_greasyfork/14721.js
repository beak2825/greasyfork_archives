// ==UserScript==
// @name         Player Helper
// @namespace    http://viooz.ac/
// @version      0.1
// @description  This userscript is required to play the video.
// @icon         http://viooz.ac/extensions/userscript/icon128.png
// @icon64       http://viooz.ac/extensions/userscript/icon64.png
// @homepage     http://viooz.ac/extensions/
// @updateURL    http://viooz.ac/extensions/userscript/gkplugins-helper.meta.js
// @downloadURL  http://viooz.ac/extensions/userscript/gkplugins-helper.user.js
// @author       
// @match        https://*/*
// @match        http://*/*
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// ==/UserScript==

function checkReq(){
	var list = document.getElementById("gkpluginsExtListReq");
	if(list==null){
		return;
	}
	list.title = "ready";
	if(list.childNodes.length>0){
		var curReq = list.firstChild;
		if(typeof curReq.innerHTML=="undefined"){
			list.removeChild(curReq);
			return;
		}
		var obj = JSON.parse(atob(curReq.innerHTML));
		obj.onload = obj.onerror = obj.onabor = function(response){
			var txtout = document.createElement("textarea");
			txtout.id = obj.extreqid;
			txtout.style.display = "none";
			var Hfres = response.status+" "+response.statusText+"\r\n"+response.responseHeaders;
			if(response.finalUrl){
				Hfres += "FinalLocation: "+response.finalUrl+"\r\n";
			}
			if(obj.returndtaescape){
				txtout.value = escape(Hfres+"\r\n"+response.responseText);
			}else if(obj.returndtab64){
				txtout.value = btoa(Hfres+"\r\n"+response.responseText);
			}else{
				txtout.value = Hfres+"\r\n"+response.responseText;
			}
			document.body.appendChild(txtout);
		};
		GM_xmlhttpRequest(obj);
		list.removeChild(curReq);
	}
}
setInterval(checkReq,100);