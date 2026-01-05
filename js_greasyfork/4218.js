// ==UserScript==
// @name       Popup Video
// @homepageURL https://github.com/archion/videopop
// @namespace  https://github.com/archion/
// @version    0.1.13
// @description  Popup online video out of the webpage
// @match      http://*/*
// @match      https://*/*
// @copyright  2014+, archion
// @icon       data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAQAAAC0NkA6AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZcwABEJAAARCQAYms0rgAAAL2SURBVFjD1dg/aBNRHMDxby6nxmiLaKVSW6GCcRC1eoM6FOvgn8GAdKmKSBGp2EkHhy4SFAd1kDoJUpUsooOIdVBa8A8OCgkWq1hOpLXVakopWttiNSQOuV7u0svdexcz+Fvy3vFePvd+l3t/EkAoNFhNnO2EUMR6kCXDLN95yjlVsAukqSAs3BoCBAkT5jDZoFiPGpjmA00sk2DmokocgSEGaPTBBAWRrznmI+99MIogUhITEEZKYGQQ/0wg96FJjR/YQxe1oo1VG1FNhDqWzNEFt/OKPrOWYlr8jlSTiNBKlHrCjgT00mOWN3OD9RLp0gAUWogRcWnXQxtDFmKrTG5z00obF6ksFwEKsJcL5SRAoYoOlpeTAJUD7LDU++lmmIz58NP0MlwaASrNLDRrj2hnsEjLBrr8EaCyxSyPE8sRSUsDrWQi90zmQuddOQhQyK+NU/yxE0ZsKo3AfcXWAKq4UhqBwLagmV1S3zjGN1kkyO4ic5lzfOE4rXySQ0KskiBGaaebx5ywM15IWmJKH+UkDwAKGS9kloQ0MY/xfvB3zWlFnLAzGW/kDWeZlCOSeWYImHVFjMZxzrgyVqKadTbmGH289RhJEiDLdRfGSqykkybbDT4hyhHPdHkwduIqLfm3ymA+owvs6pNoOQYuF6yghcRBx3SLnTbM0Zxi1HJZp82NyIfg+cQYzU36Oco2KpjgOXEGRAhhxGAgQYJKQswwZbm+z40QTJc9w0wylicAWOzeU/w4h+OCJhQSI/Ef/xGS9UKylrKP0Ap7OoAKv8xyNRWyxyGj9RoL4bDIqYyYR4YI+7nl49RVT9QszzDihDwzkUWcBx7yUwJYwAZibDTrg+hOyG2aWWHUarmGToqMMLKUiGUPCt2k5jcKaCqdtMtmqEjoRNHnv7QKaS7x8p8Qk8SckgXBGvhBggbxA3ORmKCDOFmnySdYA5Cil4WslfqryRq/ecFp7jgTEDB/siqNHGIndYQkNqZpxnnNPe4zDsWm0L9cDt3NATPl2QAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNC0wOC0yNVQwODo0Mjo0NyswODowMOtq9NIAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTQtMDgtMjVUMDg6NDI6NDcrMDg6MDCaN0xuAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/4218/Popup%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/4218/Popup%20Video.meta.js
// ==/UserScript==
if (window.top != window.self) { return; }  //don't run on frames or iframes
var ck=document.createElement("div");
ck.setAttribute("style","position: fixed; bottom: 5px; right: 10px;z-index: 2147483646;background: #000; opacity: 0.5;color:#fff;font-size: 1em;cursor: pointer;text-align: center;color:#fff;padding: 4px");
ck.innerHTML="Popup";
document.body.appendChild(ck);
ck.addEventListener('click', function() {
	//debugger;
	var ff=!window.chrome;
	if(ff){
		var flash=document.querySelectorAll("[type='application/x-shockwave-flash']");
		for (var i=0, len=flash.length; i<len ;i++){
			flash[i].setAttribute("wmode","opaque");
			flash[i].style.display="none";
		}
		setTimeout(function(){
			for (var i=0, len=flash.length; i<len ;i++){
				flash[i].style.display="";
			}
		},100*flash.length);
	}
	//var flash=document.querySelectorAll("iframe");
	//for (var i=0, len=flash.length; i<len ;i++){
	//flash[i].setAttribute("wmode","opaque");
	//}
	var ntf=document.createElement("div");
	ntf.id="topntf";
	var pw=document.documentElement.scrollWidth||document.body.scrollWidth;
	var ph=document.documentElement.scrollHeight||document.body.scrollHeight;
	var ptop=document.documentElement.scrollTop||document.body.scrollTop;
	ntf.setAttribute("style","position: absolute; top: 0px; left: 0px;z-index: 2147483647; background-color: #000; opacity: 0.8;font-size: 50pt;line-height: 50pt;text-align: center;color:#fff; "+"width: "+pw+"px; "+"height: "+ph+"px; "+"padding-top: "+ptop+"px;");
	ntf.innerHTML="please click the element to pop out<br> 请点击需要弹出的元素";
	document.body.appendChild(ntf);
	document.addEventListener('mousedown', function(e) {
		if (document.getElementById("topntf")){
			document.body.removeChild(document.getElementById("topntf"));
			//document.body.removeChild(ntf);
			//e = e || window.event;
			//var target = e.target || e.srcElement;
			//var target = e.target.cloneNode(true)
			//var target = document.elementFromPoint(e.clientX,e.clientY).parentNode.cloneNode(true);
            var target = document.elementFromPoint(e.clientX,e.clientY);
            var ch=window.getComputedStyle(target,null).getPropertyValue("height");
            var cw=window.getComputedStyle(target,null).getPropertyValue("width");
            var ptarget=target;
            var player = ptarget.cloneNode(true);
            var cst="width:100% !important;height:100% !important;max-width:100% !important;margin:0px !important;padding:0px !important;top:0px !important;left:0px !important;z-index: 2147483646 !important;overflow:hidden !important;position:fixed !important;display: block !important;visibility: visible !important;";
            player.setAttribute("style",cst);
            while(window.getComputedStyle(target.parentNode,null).getPropertyValue("height")==ch&&window.getComputedStyle(target.parentNode,null).getPropertyValue("width")==cw) {
                ptarget=target.parentNode.cloneNode(true);
                ptarget.replaceChild(player.cloneNode(true),ptarget.childNodes[Array.prototype.indexOf.call(target.parentNode.childNodes,target)]);
                ptarget.setAttribute("style",cst);
                player=ptarget;
                target=target.parentNode;
            }
			var wurl=window.location.href;
			if(ff){
				wurl="about:blank";
			}
			//var w=window.open(wurl,"","width=520,height=325");
			var w=window.open(wurl,"","width=520,height=325,left="+(screen.availWidth-525)+",top="+(screen.availHeight-385));
			if(!w){
				window.alert("Please set to allow pop-up windows（请设置允许弹出窗口）");
			}else{
				//w.window.location.href=window.location.href;
				var id=window.setInterval(function(){
					if(w.document.body.childElementCount>0||wurl=="about:blank"){
						window.clearInterval(id);
						//w.document.write('<script type="text/undefined">');
						//w.document.documentElement.replaceChild(document.head.cloneNode(true),w.document.head);
						w.document.documentElement.innerHTML=" ";
                        w.document.documentElement.replaceChild(document.head.cloneNode(true),w.document.head);
						//w.document.head.parentNode.appendChild(document.createElement("body"));
						//w.document.head.parentNode.removeChild(w.document.body);
						//w.document.head.parentNode.appendChild(document.createElement("body"));
						//w.document.documentElement.replaceChild(document.body.cloneNode(true),w.document.body);
						//w.document.documentElement.replaceChild(document.head.cloneNode(true),w.document.head);
						//var hd=document.head.cloneNode(true).querySelectorAll(":not(script)");
						//for (var i=0, len=hd.length; i<len ;i++){
							//w.document.head.appendChild(hd[i]);
						//}
						//var s = document.createElement('style');
						//s.type = 'text/css';
						//s.innerHTML = '* { height: 100% !important; width: 100%!important; }';
						//w.document.head.appendChild(s);
						//target.setAttribute("style","height: 100%; width: 100%; left: 0px; top: 0px;")
						//target.style.height="100%";
						//target.style.width="100%";
						//target.style.top="0px";
						//target.style.left="0px";
						//target.style.margin="0px";
						//target.style.padding="0px";
						//w.document.body.removeAttribute("class");
						//target.id="video_box";
						//target.className="video_box";
						//w.document.body.className="popupvideo";
						w.document.body.setAttribute("style",cst);
						//var d=document.createElement("div");
						//d.setAttribute("style","height: 100%; width: 100%; left: 0px; top: 0px;display: block;");
						//d.appendChild(target);
						//var js=document.querySelectorAll("script");
						//for (var i=0, len=js.length; i<len ;i++){
						//d.appendChild(js[i]);
						//}
						//w.document.body.appendChild(d);
						w.document.body.appendChild(player);
						var rt=document.createElement('script');
						rt.type = "text/javascript";
						rt.innerHTML='var ck=document.createElement("div"); ck.setAttribute("style","position: fixed; top: 5px; right: 10px;z-index: 2147483647;background: #000; opacity: 0.3;color:#fff;font-size: 8pt;cursor: pointer;text-align: center;color:#fff;padding: 4px"); ck.innerHTML="return"; ck.onclick=function() { window.open("'+window.location.href+'"); window.close(); };document.body.appendChild(ck);';
						w.document.body.appendChild(rt);
						//if (confirm("close original window?\n关闭原始窗口？") == true) {
						//window.close();
						//}
					}
				},100);
			}
		}
	}, false);
}, false);
