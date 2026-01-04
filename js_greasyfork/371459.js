// ==UserScript==
// @name Css_Editor
// @author NLF
// @description 不會寫CSS,也能去廣告!
// @date 2010-3-30
// @version 1.5.1
// @include http*
// @namespace https://greasyfork.org/users/159042
// @downloadURL https://update.greasyfork.org/scripts/371459/Css_Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/371459/Css_Editor.meta.js
// ==/UserScript==

	//設定
var N_CE_SET={
	save_interval:1						,//儲存文字編輯區內容的時間間隔,單位 '分鐘';
	cookie_css:false					,//初始化是否把cookie內容作為css載入到網站上;
	c_expire:88								,//cookie多久失效..單位 '天';
	F_window:true							,//是否顯示浮動開關;
	e_outlc:['1px','solid','#306EFF']					,//尋找元素時的外邊框樣式;
	e_bgc:'#C6DEFF'														,//尋找元素時背景顏色;
	domain_s:['zol.com.cn']										,//域名糾正;例如將game.zol.com.cn自動設定成 zol.com.cn
};

//初始化載入css
(function(){
	//儲存cookie所用的域名
	N_CE_SET.domain=location.hostname.replace(/^www\./i,'');
	for(var i=0;i<N_CE_SET.domain_s.length;i++){
		if (N_CE_SET.domain.indexOf(N_CE_SET.domain_s[i])>0){
			N_CE_SET.domain=N_CE_SET.domain_s[i];
			break;
		};
	};
	switch(N_getCookie('tocss')){
		case 'true':{
			N_CE_SET.cookie_css=true;
		};
		break;
		case 'false':{
			N_CE_SET.cookie_css=false;
		};
		break;
		default:{};
		break;
	};
	if (N_CE_SET.cookie_css){
		N_CE_SET.user_style=document.createElement('style');
		N_CE_SET.user_style.setAttribute('type','text/css');
		N_CE_SET.user_style.innerHTML=N_getCookie('ntemp');
		document.getElementsByTagName('head')[0].appendChild(N_CE_SET.user_style);
	}
})();

	//建立UI界面函數
	function N_c_ui(){
		if (N_CE_SET.created){
			document.getElementById('N_css_box').style.display="";
			N_autosave();
			return;
		};
		var divStyle=document.createElement('style');
		divStyle.setAttribute('type','text/css');
		divStyle.innerHTML='\
										#N_textarea,#N_path {\
											display:block;\
											padding:0;\
											margin:0;\
											border:none;\
											width:100%;\
											word-wrap:normal;\
											opacity:0.9;\
											cursor:text;\
											background:none!important;\
											background-color:#fff!important;\
										}\
										#N_path:hover,#N_textarea:hover{\
											opacity:1.0;\
										}';
		document.getElementsByTagName('head')[0].appendChild(divStyle);
		var div=document.createElement('div');
		div.id="N_css_box";
		div.style.cssText='width:520px;height:200px;top:10px;left:10px;margin:0;padding:0;border:none;background:none;position:fixed;z-index:9999999;font-size:13px;';
		div.innerHTML='\
								<div style="float:none;border-top-left-radius:5px;border-top-right-radius:5px;-moz-border-radius-topleft:5px;-moz-border-radius-topright:5px;border:2px solid #345876;border-bottom:none;height:100%;background-color:#4E85B6;margin:0;padding:0;min-width:350px;">\
									<textarea wrap="off" style="height:100%;" id="N_textarea" name="N_textarea"   title="請在這裡寫CSS"  ></textarea>\
								</div>\
								<div style="float:none;min-width:350px;background-color:#4E85B6;margin:0;padding:0;border:none;border-left:2px solid #345876;border-right:2px solid #345876;">\
									<input id="N_path"       type="text"  style="display:none;width:100%;margin:0;padding:0;border:none;border-top:1px solid #436F95;float:none;"                  title="按下尋找元素後,元素的路徑會出現在這裡"     />\
								</div>\
								<div id="N_button" style="background-color:#4E85B6;padding:1px 0;text-align:left;border:2px solid #345876;display:block;max-height:33px!important;min-width:350px;position:relative;cursor:move;border-bottom-left-radius:3px;border-bottom-right-radius:3px;-moz-border-radius-bottomleft:3px;-moz-border-radius-bottomright:3px;float:none;">\
									<input id="N_preview"     type="button" value="預覽"     title="載入目前框中的CSS內容" />\
									<input id="N_restore"     type="button" value="還原"     title="還原頁面本來的樣子"     />\
									<input id="N_find"        type="button" value="尋找"     title="尋找頁面中的元素,並對其操作"   />\
									<input id="N_close"       type="button" value="關閉"     title="關閉編輯視窗"          />\
									<input id="N_tocssck"     type="checkbox"                title="重新整理頁面時把編輯視窗的內容作為CSS載入(對目前所處域名網頁生效)" /><span style="color:#fff;text-shadow:0 0 6px #000;">啟用</span>\
									<span  id="textnumber"                                   title="字數限制"  style="color:#fff;text-shadow:0 0 6px #000;margin-left:28px;border:1px solid #ccc;padding:1px 3px;"></span>\
									<img id="sizebutton"   style="cursor:nw-resize;border:none;position:absolute;bottom:0;right:0;"  title="按住調整編輯框的大小" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAK  T2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AU  kSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXX  Pues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgAB  eNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAt  AGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3  AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dX  Lh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+  5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk  5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd  0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA  4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzA  BhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/ph  CJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5  h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+  Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhM  WE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQ  AkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+Io  UspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdp  r+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZ  D5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61Mb  U2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY  /R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllir  SKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79u  p+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6Vh  lWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1  mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lO  k06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7Ry  FDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3I  veRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+B  Z7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/  0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5p  DoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5q  PNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIs  OpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5  hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQ  rAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9  rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1d  T1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aX  Dm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7  vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3S  PVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKa  RptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO  32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21  e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfV  P1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i  /suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8  IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADq  YAAAOpgAABdvkl/FRgAAAQZJREFUeNqs1LtKA0EUBuAvl81GzYZgAlETBDtFEAQlNl5aLaxs7e0F  CwtRULDyBXwPn89mhLDMBBfmdDvD/vy3M+SdTisjWBf9nGADtHOAlRgji9oBZrmY9bFAkQNsjgus  5QAb4R7DBOtGc4qvBLMyePrvOcErtiJ3Y0yaMvvBdqQeezhuAnaGj+BdffZx3sS7Cu/YjTC7xmOT  2szwgPXI3S1e0KuFMk2BbQYpVe28wE1Ierx0vhFCG6ZkLlaE81xjNsJbqjJl2IJOYjsuaxZM8YTD  GFgRpLYTPTuKbMV3kPr3z84yWLXieZpEUr4LveyG76vgrc6Kx7EfSbmFg1qic3yi9zsAd9wRHBMT  jqEAAAAASUVORK5CYII=" />\
								</div>'
		document.body.appendChild(div);
		var cvalue=N_getCookie('ntemp');
		var tarea=document.getElementById('N_textarea');
		tarea.value=cvalue;
		tarea.addEventListener('change',
			function (){
				N_setCookie_s('ntemp',this.value);
			}
		,false);
		document.getElementById('N_button').addEventListener('click',N_clickhand,false);
		tarea.addEventListener('keyup',
			function(){
				N_nlimit(this.value);
			}
			,false);
		N_nlimit(cvalue);
		if(N_CE_SET.cookie_css){
			document.getElementById('N_tocssck').checked=true
		};
		N_autosave();
		//加入一個空的style,後面用innerHTML修改內容;
		if (!N_CE_SET.user_style){
			N_CE_SET.user_style=document.createElement('style');
			N_CE_SET.user_style.setAttribute('type','text/css');
			document.getElementsByTagName('head')[0].appendChild(N_CE_SET.user_style);
		};
		//UI調整函數
		document.getElementById('N_button').addEventListener('mousedown',
			function(e){
				//滑鼠的位置
				var grabX = e.clientX;
				var grabY = e.clientY;
				//拖曳UI
				if (e.target.id=='N_button'){
					e.preventDefault();
					var origX = parseInt(div.style.left);
					var origY = parseInt(div.style.top);
					function dndm(e){
						div.style.left = origX+e.clientX-grabX+'px';
						div.style.top = origY+e.clientY-grabY+'px';
					};
					document.addEventListener('mousemove', dndm, false);
					document.addEventListener('mouseup',
						function(){
							document.removeEventListener('mousemove', dndm, false);
							document.removeEventListener('mouseup', arguments.callee, false);
						}
					,false);
				}else{
					//縮放UI
					if(e.target.id=='sizebutton'){
						e.preventDefault();
						var origX = parseInt(div.style.width);
						var origY = parseInt(div.style.height);
						function dnds(e){
							if(origX+e.clientX-grabX>352){
								div.style.width = origX+e.clientX-grabX+'px';
							};
							div.style.height = origY+e.clientY-grabY+'px';
						};
						document.addEventListener('mousemove', dnds, false);
						document.addEventListener('mouseup',
							function(){
								document.removeEventListener('mousemove', dnds, false);
								document.removeEventListener('mouseup', arguments.callee, false);
							}
						,false);
					};
				};
			}
		,false);
		//在編輯區隱藏事件;
		div.addEventListener('keyup', function(e){e.stopPropagation();}, false);
		div.addEventListener('keydown', function(e){e.stopPropagation();}, false);
		div.addEventListener('keypress', function(e){e.stopPropagation();}, false);
		div.addEventListener('dblclick', function(e){e.stopPropagation();}, false);
		N_CE_SET.created=true;
	};

	function N_clickhand(e){
		switch (e.target.id){
			case 'N_preview':{
				N_CE_SET.user_style.innerHTML=document.getElementById('N_textarea').value;
			};
			break;

			case 'N_restore':{
				N_CE_SET.user_style.innerHTML='';
			};
			break;

			case 'N_find':{
				N_findE();window.focus();
			};
			break;

			case 'N_close':{
				document.getElementById('N_css_box').style.display='none';
				N_autosave(true);
			};
			break;

			case 'N_tocssck':{
				var nck=document.getElementById('N_tocssck').checked;
				N_setCookie_s('tocss',nck);
				var fk=document.getElementById('F_tocssck');
				if(fk){fk.checked=nck;}
			};
			break;
/////////////////////////////////////////////////////
			case 'F_edit':{
				N_c_ui();
			};
			break;

			case 'F_find':{
				N_c_ui();N_findE();window.focus();
			};
			break;

			case 'F_restore':{
				if (N_CE_SET.user_style){
					N_CE_SET.user_style.innerHTML='';
				};
			};
			break;

			case 'F_tocssck':{
				var fck=document.getElementById('F_tocssck').checked;
				N_setCookie_s('tocss',fck);
				var nk=document.getElementById('N_tocssck');
				if(nk){nk.checked=fck;}
			};
			break;

			default:{};
			break;
		};
	};

	//取cookie函數
	function N_getCookie(c_name){
		var sre="(?:;)?"+c_name+"=([^;]*);?"
		var ore=new RegExp(sre);
		if(ore.test(document.cookie)){
			return decodeURIComponent(RegExp['$1']);
		}else{
			return '';
		}
	};

	//傳入textarea的value
	function N_nlimit(tvalue){
		//顯示字數限制
		if (!tvalue){tvalue=document.getElementById('N_textarea').value;}
		var limitn=4009-encodeURIComponent(tvalue).length;
		var span=document.getElementById('textnumber');
		span.innerHTML=limitn;
		//如果剩餘不到1000則顯示紅色
		if (limitn>=2000){
			span.style.color='white';
		}else if (limitn>=1000 && limitn<=2000){
			span.style.color='yellow';
		}else if(limitn<1000 && limitn>=0){
			span.style.color='#C90000';
		}else if(limitn<0){
			span.style.color='red';
		};
	};

	function N_setCookie_s(name,text_value){
		if (name=='ntemp'){N_nlimit(text_value);};
		N_setCookie(name,text_value,N_CE_SET.c_expire,'/',N_CE_SET.domain);
	};

	//寫cookie函數
	function N_setCookie(c_name,c_value,keepday,c_path,c_domain,c_secure){
		var scookie=c_name+'='+encodeURIComponent(c_value);
		if (keepday){
			var exdate=new Date();
			exdate.setDate(exdate.getDate()+Number(keepday));
			scookie+=';expires='+exdate.toGMTString();
		};
		if (c_path){
			scookie+=';path='+c_path;
		};
		if (c_domain){
			scookie+=';domain='+c_domain;
		};
		if (c_secure){
			scookie+=';secure='+c_secure;
		};
		document.cookie=scookie;

		N_autosave();
	};

function N_autosave(close){
	if(N_CE_SET.interval){
		window.clearInterval(N_CE_SET.interval);
	};
	if(close){return;};
	var tarea=document.getElementById('N_textarea');
	N_CE_SET.interval=window.setInterval(function(){N_setCookie_s('ntemp',tarea.value)},1000*60*N_CE_SET.save_interval);
}

	//尋找元素,代碼 源自 adblock+,部分修改
	function N_findE(){
		if(window.navigator.ujs_AdBlock){
			return;
		}else{
			window.navigator.ujs_AdBlock=true
		};
		//隱藏編輯框
		var floatw=document.getElementById('float_w');
		if (floatw){floatw.style.display='none';}
		document.getElementById('N_css_box').style.display='none';
		var ele='',outline='',title='',bgColor='',frameBorder='',DList=[],delhtml=true;
		//建立一個暫時的 style 元素,用來預覽刪除;
		if (!N_CE_SET.tempstyle){
			N_CE_SET.tempstyle=document.createElement('style');
			N_CE_SET.tempstyle.setAttribute('type','text/css');
			document.getElementsByTagName('head')[0].appendChild(N_CE_SET.tempstyle);
		};
		var doc=((window.document.body instanceof HTMLFrameSetElement)?window.frames[0]:window).document;
		function getAtt(ele){
			//跳過HTML屬性
			if (ele.nodeName.toLowerCase()=='html'){return ''};
			var r='';
			for(var i=0,a;a=ele.attributes[i];i++){
				var n=a.nodeName.toLowerCase();
				if(/^(id|class|height|width|href|src)$/.test(n))r+='['+n+'=\"'+a.nodeValue+'\"]'
			};
			return r;
		};
		function getNth(ele){
			if(/^(html|body|iframe|img|a)$/i.test(ele.nodeName)||!window.postMessage)return'';
			var nth,n=0;var p=ele.parentNode;
			for(var i=0,c;c=p.childNodes[i];i++){
				if(c.nodeType==1){n++;if(c==ele)nth=n}
			};
			return(!nth||n<2)?'':':nth-child('+nth+')'
		};
		function block(ele,not_exit){
			if (ele.nodeName.toLowerCase()=='html'){delhtml=false};
			var css='';
			if(ele.hasAttribute('src') || ele.hasAttribute('id')){
				if(ele.hasAttribute('id')){
					css=ele.nodeName+'[id=\"'+ele.getAttribute('id')+'\"]'
				}else{
					css=ele.nodeName+'[src=\"'+ele.getAttribute('src')+'\"]'
				}
			}else{
				var rez=[];
				while(ele){
					if(ele.nodeType==1) {
						rez.unshift(ele.nodeName+getAtt(ele)+getNth(ele));
						if(ele.hasAttribute('id')){break;};
					};
					ele=ele.parentNode;
				};
			css=rez.join('>');
			};
			if (delhtml){css=css.replace(/^html>/i,'')}
			if (not_exit){return css;};
			//加入到編輯區
			addto();
			var N_path=document.getElementById('N_path');
			N_path.style.display='block';
			N_path.value=css;
			N_path.focus();
			N_path.select();
		};
		function remove(){
			doc.removeEventListener('mouseover',over,false);
			doc.removeEventListener('mouseout',out,false);
			doc.removeEventListener('click',click,false);
			doc.removeEventListener('keyup',press,false);
			//FX使用delete 會觸發..安全問題..導致不可用ORZ.
			window.navigator.ujs_AdBlock=null;
			document.getElementById('N_css_box').style.display="";
			if (floatw){floatw.style.display="";}
		};
		function over(ev){
			ele=ev.target;
			outline=ele.style.outline;
			title=ele.title;
			bgColor=ele.style.backgroundColor;
			//是否是iframe對像
			frameBorder=ele.frameBorder;
			if(frameBorder){ele.frameBorder=1;};
			ele.style.outline=N_CE_SET.e_outlc.join(' ');
			ele.style.backgroundColor=N_CE_SET.e_bgc;
			ele.title='Tag: '+ele.tagName+(ele.id?', ID: '+ele.id:'')+(ele.className?', Class: '+ele.className:'');
		};
		function out(){
			if(ele){
				ele.style.outline=outline;
				ele.title=title;
				ele.style.backgroundColor=bgColor;
				if(frameBorder)ele.frameBorder=frameBorder;
			}
		};
		function click(ev){
			if(ele){ev.preventDefault();out();remove();block(ele);}
		};
		function press(ev){
			ev.preventDefault();
			ev.stopPropagation();
			if(ev.keyCode==27){out();remove();N_CE_SET.tempstyle.innerHTML='';};
			//如果按下的鍵位是68 也就是D鍵.刪除所選元素
			if(ev.keyCode==68){
				out();
				var css=block(ele,true);
				if (css!=''){
					if(DList.length==0){DList[0]=css;}else{DList.unshift(css+','+'\n');}
				}
				N_CE_SET.tempstyle.innerHTML=DList.join('')+'\n'+'{display:none!important}';
			};
			//這裡用來還原元素好了;需要按 z ;
			if(ev.keyCode==90){
				if (DList.length!=0){
					//刪除第一個,也就是最近的並重載CSS
					DList.shift();
					N_CE_SET.tempstyle.innerHTML=DList.join('')+'\n'+'{display:none!important}'
				};
			};
			//按 X 鍵儲存.
			if(ev.keyCode==88){
				out();remove();addto();
			};
		};
		function addto(){
			//空數據無需寫入
			if(DList.length==0){return;}
			//加入到編輯區
			var o_value=document.getElementById('N_textarea').value;
			//如果最後一個不是換行則加一個換行
			if (/^[\n\r\s]*$/i.test(o_value) || /[\n\r]+\s*$/i.test(o_value)){}else{o_value+='\n'};
			var t_value=o_value+N_CE_SET.tempstyle.innerHTML;
			document.getElementById('N_textarea').value=t_value;
			N_CE_SET.tempstyle.innerHTML='';
			//儲存
			N_setCookie_s('ntemp',t_value);
		};
		doc.addEventListener('mouseover',over,false);
		doc.addEventListener('mouseout',out,false);
		doc.addEventListener('click',click,false);
		doc.addEventListener('keyup',press,false);
	};

	//建立懸浮開關
	function N_floatwindow(){
		var style=document.createElement('style');
		style.setAttribute('type','text/css');
		style.innerHTML='\
									#float_w {\
										position:absolute;\
										padding:3px;\
										margin:0;\
										z-index:9999;\
										max-height:28px!important;\
									}\
									#F_kaiguan {\
										opacity:0.4;\
										width:10px;\
										height:10px;\
										margin:0;\
										padding:0;\
										border-radius:3px;\
										-moz-border-radius:3px;\
										float:right;\
										border:1px solid #fff;\
										box-shadow:0 0 2px #000;\
										-moz-box-shadow:0 0 2px #000;\
										-webkit-box-shadow:0 0 2px #000;\
									}\
									#F_button {\
										vertical-align:middle;\
										background:#4E85B6;\
										padding:2px 2px 4px 4px;\
										border-radius:3px;\
										-moz-border-radius:3px;\
										box-shadow:0 0 5px #000;\
										-moz-box-shadow:0 0 5px #000;\
										-webkit-box-shadow:0 0 5px #000;\
										border:1px solid #fff;\
										white-space:nowrap;\
										display:none;\
										opacity:0;\
										-o-transition:opacity 0.3s 0.1s;\
										-o-transition-timing-function:cubic-bezier(0.42, 0, 0.58, 1);\
									}\
									#float_w:hover #F_kaiguan {\
										opacity:1;\
									}\
									#float_w:hover #F_button {\
										display:block;\
										opacity:1;\
									}\
									#F_tocssck + span{\
										color:#FFF;\
										text-shadow:0 0 5px #000;\
										font-size:14px;\
										padding:0 5px 0 0\
									}';
		document.getElementsByTagName('head')[0].appendChild(style);
		var floatdvi=document.createElement('div');
		floatdvi.id='float_w';
		floatdvi.style.cssText='top:30px;right:5px;'//-o-transition:top 0.5s 0; -o-transition-timing-function:cubic-bezier(0.42, 0, 0.58, 1);';
		floatdvi.innerHTML='\
									<div id="F_kaiguan" style="background-color:#999;"></div>\
									<div id="F_button" >\
										<input id="F_edit"    type="button" value="編輯" title="開啟編輯框,修改CSS內容" />\
										<input id="F_find"    type="button" value="尋找" title="尋找頁面元素,按D刪除,Z還原,X建立CSS代碼.按一下獲取目前元素CSS路徑"/>\
										<input id="F_restore" type="button" value="還原" title="暫時停用CSS,還原頁面"/>\
										<input id="F_tocssck" type="checkbox"            title="當頁面重新整理時,自動載入邊框中的CSS內容" /><span>啟用</span>\
									</div>';
		document.body.appendChild(floatdvi);
		floatdvi.addEventListener('click',N_clickhand,false);
		if(N_CE_SET.cookie_css){
			document.getElementById('F_tocssck').checked=true;
			document.getElementById('F_kaiguan').style.backgroundColor='blue';
		}else{
			document.getElementById('F_restore').disabled=true;
		};
		var a;
		var ot=parseFloat(floatdvi.style.top);
		var or=parseFloat(floatdvi.style.right);
		function gs(){
			if (a){clearTimeout(a)};
			a=setTimeout(gss,200);
		};
		function gss(){
			var scrolly=window.scrollY;
			var scrollx=window.scrollX;
			floatdvi.style.top=scrolly+ot+'px';
			floatdvi.style.right=-scrollx+or+'px';
		};
		//主動執行一次
		gss();
		window.addEventListener('scroll',gs,false);
	};

if (N_CE_SET.F_window && window==window.top){
	if (window.opera){
		window.addEventListener('DOMContentLoaded',N_floatwindow,false);
	}else{
		N_floatwindow();
	};
};
