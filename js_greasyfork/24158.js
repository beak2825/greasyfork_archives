// ==UserScript==
// @name        WebEraser
// @version     1.4.8
// @namespace   sfswe
// @description Erase parts of any webpage --annoyances, logos, ads, images, etc., permanently with just, Ctrl + Left-Click.
// @license     GPL-3.0-only
// @copyright   2018, slow! (https://openuserjs.org/users/slow!)
// @include     *
// @require     https://code.jquery.com/jquery-3.2.1.js
// @require     https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @require https://greasyfork.org/scripts/375359-gm4-polyfill-1-0-1/code/gm4-polyfill-101.js
// @require https://greasyfork.org/scripts/375360-sfs-utils-0-1-5/code/sfs-utils-015.js
// @resource    whiteCurtains      https://raw.githubusercontent.com/SloaneFox/imgstore/master/whiteCurtainsDbl.jpg
// @resource    whiteCurtainsOrig  https://raw.githubusercontent.com/SloaneFox/imgstore/master/whiteCurtains.orig.jpg
// @resource    whiteCurtainsXsm   https://raw.githubusercontent.com/SloaneFox/imgstore/master/whiteCurtainsExSm.jpg
// @resource    whiteCurtainsTrpl  https://raw.githubusercontent.com/SloaneFox/imgstore/master/whiteCurtainsTrpl.jpg
// @icon        https://raw.githubusercontent.com/SloaneFox/imgstore/master/WebEraserIcon.gif
// @run-at      document-start
// @author      Sloane Fox
// @grant       GM.registerMenuCommand
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.deleteValue
// @grant       GM.listValues
// @grant       GM.addStyle
// @grant       GM.getResourceText
// @grant       GM.getResourceUrl
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// @downloadURL https://update.greasyfork.org/scripts/24158/WebEraser.user.js
// @updateURL https://update.greasyfork.org/scripts/24158/WebEraser.meta.js
// ==/UserScript==

//
// History
// updated Nov  2018  v1.4.8 Images and Canvas elements lost functionality, returned.
// updated Oct  2018  v1.4.6 Bug fix re complete deletion of element.  Got around webpage trick of translateZ(0) & css hiding.  Block page change mid-setup.
// updated Jan  2018  v1.3.9   Update for yet to come GM4 and already past backward compatibile GM4 polyfill.  And for Chromium.
// updated Nov  2017  v1.3.8   Added extra GM menu command to enable use of Ctrl-e to manually invoke web erasure on a webpage.
// updated Nov  2017  v1.3.7   Added extra GM menu command in case user accidentally erases entire webpage and is faced a blank with not even a WebEraser menu to allow one to undo accident.
// updated Aug  2017  v1.3.6   Issue with iframe when injected code not called for it due to its late creation same origin.
// updated Jan  2017  v1.3.5   Compatibility working on msedge/safari/opera under tampermonkey.  With ie11 (adGuard method) js engine is too old.  Windows ok with Chrome either native or with tamper.
//                             Safari on windows cant run userscripts.
// updated Jan  2017   v1.3.4  Bug fixes.  Issue with load sequence on Chrome.  Monitoring class changes relating to identifier of element.  Compatibility on msedge/safari/opera under tampermonkey.
// updated Dec  2016   v1.3.0  Bug fixes, check for duplicate selectors, color & other ui issues.  Removed zoomer (it used up a little cpu).
// updated Nov  2016.  v1.2.3  Iframe handling for deep iframes.
// updated Oct  2016.  v1.2.2  Fixed bug, GM menu on Chrome not closing.
//                     v1.2.1  Adapted for use also in Google Chrome/Chromium web browser.
// updated Sept 2016.  v1.2    Added user option to turn on the monitoring for new nodes (node mutations).

ttimer("start");

// Globals:
var environ=this, jq_saved, chromert=this.chrome; //window; //this // note 11'17 polyfill acts upon this (sandbox with a member "window") not on window.
if (typeof jQuery!="undefined") jq_saved=jQuery;
var iframe=window!=window.parent, border_width=6;
var win=window,
	host=window.document.location.host,
	pathname=window.document.location.pathname, webpage=host+pathname, website=host;
var askedAlready,last_one_deleted, delcnt=0, gelem, gelems, gpre_elem,
	bblinker, promptOpen, rbcl="sfswe-redborder", pbcl="sfswe-prevborder", tbcl="sfswe-transparentborder";
var tab="&emsp;&emsp;&emsp; &emsp; "; // tab=5spaces, emsp=4spaces, but HTML tab in a <pre> wider hence extra emsp's.
//
// Globs to be initialized asynchronously, see below, init_globs().
//
var page_erasedElems,site_erasedElems,curtain_icon, elems_to_be_hid,curtain_slim_icon,curtain_xslim_icon, 
	curtain_wide_icon, config, ownImageAddr, whitecurtains, whitecurtainsoriginal, whitecurtainstriple;
var ignoreIdsDupped, curtain_cnt=0;
var zaplists,overlay=false;

if (iframe) {
	installEventHandlers();
	return;
}

//if (!environInit()) if (!plat_msedge) $(main.bind(environ)); // In a normal GM environment, main will be called at docready.
var str=GM_registerMenuCommand.toString();
//for (var i=0;i<str.length;i++) console.log(str[i]);
if (!environInit(environ)) if (!plat_msedge) {
	if(/^complete/.test(document.readyState)) main();
	else document.addEventListener("DOMContentLoaded",main.bind(environ)); //main(); addEventListener("load",main.bind(environ))	; // In a normal GM environment, main will be called at docready.
}

Number.prototype.in=function(){for (i of Array.from(arguments)) if (this==i) return true;}; // Use brackets with a literal, eg, (2).in(3,4,2);
Number.prototype.inRange=function(min,max){ if (this >=min && this<=max) return true;}; // Ditto.
Number.prototype.withinRangeOf=function(range,target){ return this.inRange(target-range,target+range); }; // Ditto.
String.prototype.prefix=function(pfix) { return this.length ? pfix+this : ""+this; };

async function main() {try{
	log=x=>null;  //logger on/off
	ttimer("start of main, state: "+document.readyState);
	log("w/e main GM:",GM, "readyState",document.readyState,"body:",document.body,"iframe",iframe,"jQuery:",window.jQuery&&window.jQuery.fn.jquery,"$",window.$);
	if (!this.chrome) this.chrome=chromert;  
	await init_globs();
	installEventHandlers();
	ensure_jquery_extended(); // may get clobbered by other script loading jQ.
	inner_eraseElements("init");
	var nerased=$(".Web-Eraser-ed").length, delay=5000+300*(2+nerased), forErasure=getHidElemsCmd("count");
	setTimeout(x=> { 
		//ttimer("start of delay phase ");
		log("End of",delay,"delay, checking for inner_eraseElements",page_erasedElems,"or",site_erasedElems);
		if(page_erasedElems || site_erasedElems) inner_eraseElements("delay"); 
		else if ($(".Web-Eraser-ed").length==0 && elems_to_be_hid)
			console.info("WebEraser message: no match for any selectors:",getHidElemsCmd(),"\nWebpage:",webpage);
		var nerased2=$(".Web-Eraser-ed").length;
		nerased=nerased2;
		installEventHandlers("phase2");
		regcmds();
		//ttimer("end delay phase ",document.readyState);
	},delay);
	
	//!!
	// $(window).focus(x=>{
	// 	//$(window).off("focus");
	// 	setTimeout(x=> { //try{
	// 		forErasure=getHidElemsCmd("count");
	// 		var sels=getHidElemsCmd(), nerased=$(".Web-Eraser-ed").length;
	// 		log("WE focus, check for erasure", nerased ,forErasure,"site_erasedElems:",site_erasedElems);
	// 		if (nerased < forErasure) { inner_eraseElements("focus"); }
	// 		//}catch(e){console.error("WebEraser main--focus, error@",e.lineNumber,e);}
	// 	},400);
	// });
	GM_addStyle( jqueryui_dialog_css()         //GM_getResourceText ("jqueryUiCss")
				 +" .sfswe-prevborder { border-color:transparent !important;border-width:"+border_width+"px !important;border-style:double !important; } "
				 +".sfswe-transparentborder  { border-color:transparent !important;border-width:"+border_width+"px !important;border-style:double !important; } "
				 +".sfswe-redborder { border-color:red !important; border-width:"+border_width+"px !important;border-style:double !important; } " 
				 +"img.WebEraserCurtain { display: block !important; color:#fff !important; }"
				 +`.CurtainRod {
                     background-color: #bbb;
			    	 background-image: linear-gradient(90deg, rgba(255,255,255,.07) 50%, transparent 50%), linear-gradient(90deg, rgba(255,255,255,.13) 50%, transparent 50%), linear-gradient(90deg, transparent 50%, rgba(255,255,255,.17) 50%), linear-gradient(90deg, transparent 50%, rgba(255,255,255,.19) 50%);
			    	 background-size:  13px, 19px, 17px, 15px;
			       }`
				 +".ui-dialog-buttonpane button {color:black !important;}"
				 +'img[src*="blob:"] { display:block !important; }'
			   ); // A later defined rule has precedence when both rules in effect.
	//setTimeout(inner_eraseElements,1500);
	if (plat_chrome && typeof submenuModule != "undefined") submenuModule.register("WebEraser"); //,"w");
	regcmds();
	setTimeout(reattachTornCurtains,4000);
	gelems=$();
	ttimer("end of main, state: "+document.readyState);
} catch(e){console.log("WebEraser main(), error@",e.lineNumber,e);}} //main()

function handleClick(e,iframe_click) {  try { //called from event handler in page & iframe, and pseudo called from click within iframe.
	if (!e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return;
	log("CLICK jwin is ","page:",location.href,"iframe?",iframe);
	halter();
	var permrm, target=e.target, frameEl=target.ownerDocument.defaultView.frameElement;
	if(frameEl) target=frameEl;
	prevDef(e);
	if (!iframe_click) { //not pseudo call
		var seltext_len=window.getSelection().toString().length;
		window.status="webEraser, Ctrl-Click, on HTML element:"+target.tagName+" "+seltext_len+", ifame: "+iframe;
		if (seltext_len != 0) { unhalt(); return; }
		if (target.blur) target.blur();
		if (iframe)  {
			window.parent.postMessage( { type:"sfswe-iframe-click", code:0, src:location.toString() },"*"); // msg,origin makes pseudo call back here.
			log("post to parent from window."); //"frameElement:",window.frameElement);
			unhalt(); 
			return false;
		}
	} // endif !iframe_click
	while (/HTMLUnknownElement/.test(target.toString())) target=target.parentNode; //Avoid non HTML tags.
	log("Click reached target",target);
	if ($(target).is(".WebEraserCurtain")) 
		if (e.button==0) {
			let reply=confirm("This will completely erase selected item, continue? \nOn any revisit to webpage you can check in the console for such erasures.");
			if (reply) openCurtains("zap",$(target).siblings("img").addBack());
		} else
			eraseElementsCmd();
	else if (!askedAlready) {
		if ($("body").is(target)) {
			if (!confirm("WebEraser.  You clicked on the main body of the webpage.  Body however, is not removable by ctrl-click, try ctrl-clicking on an image or other item on the webpage.  Hit CANCEL to open erasure window."))
				eraseElementsCmd();
			unhalt();
			return;
		}
		halter.dialog=true;
		inner_eraseElements();
		var prom=checkIfPermanentRemoval(target);
		prom.then(function(confirm_val){     // then takes a function with 2 params, the arg of resolve func call and of reject.
			log("then in checkIfPermanentRemoval, permrm:",permrm,"confirm_val",confirm_val);
			var [permrm,item_sel]=confirm_val;
			halter.dialog=false;
			unhalt();
			if (permrm==Infinity)      { // temp delete
				askedAlready=true; 
				alert("You hit TEMP, item deleted.  Ctrl-click from now until reload merely removes elements temporarily (esc to undo). ");
				last_one_deleted=$(item_sel);
				last_one_deleted.replaceWith("<placeholder delcnt="+(++delcnt)+">");
				console.log("install escape catch");
				escapeCatch(function(){ 
					$("placeholder").replaceWith(last_one_deleted); },"perm");
			}
			log("checkIfPermanentRemoval, permrm",permrm);
			//			if (permrm!=undefined)   inner_eraseElements("click");         //undefined==>escape (cancel)
			if (permrm!=false)       inner_eraseElements("click");           //undefined==>escape (cancel)
		});
		prom.catch(function (a){log("caught in checkIfPermanentRemoval",a); unhalt();halter.dialog=false;});
	} // endif !askedAlready
	else { 
		last_one_deleted=$(target);  //temp delete
		$("placeholder").remove();
		last_one_deleted.replaceWith("<placeholder delcnt="+(++delcnt)+">");
		console.log("set last_one_deleted:",last_one_deleted, "placeholder",$("<placeholder>"));
	} 
	
	if(!halter.dialog) { unhalt();}
	return false;

	function halter() {	window.addEventListener("beforeunload", handlehalt);}
	function handlehalt(event) {
		event.returnValue="a  message to stay";
		//log("event beforeunload: ",event.returnValue);
		return event.returnValue;
	};
	function unhalt(){ 	window.removeEventListener("beforeunload",handlehalt,false);}
} catch(e) { console.log("Click handling error:"+(e.lineNumber),e,e.stack);unhalt(); }}  //handleClick() 

function sprompt(tex,initv,cancel_btn="Cancel",ok_btn="OK",extra_btn){ // returns a promise with true/false value or for prompts an array value: [true/false,string], rejected with escape.
	var dialog, p=new Promise((resolve,reject)=>{
		dialog=sprompt_inner(tex,initv,resolve,reject,cancel_btn,ok_btn,extra_btn);
	});
	p.dialog=dialog;
	return p;
}
function sconfirm(msg,cancelbtnText,okbtnText,extrabtnText) { return sprompt(msg,undefined,cancelbtnText,okbtnText,extrabtnText); }
function salert(msg) { return sprompt(msg,undefined,-1,"OK"); }

//Resolution of promise returned is cancel:false, OK: true, extrabtn: Infinity;

function sprompt_inner(pretext,initval,resolve,reject,cancelbtnText,okbtnText,extrabtnText) {try{ // "Cancel" has reply of false or null (if a prompt), "OK" gives reply of true or "", Escape key returns undefined reply.  undefined==null is true. but not for ""
	var that=arguments.callee; if (that.last_dfunc) that.last_dfunc("destroy"); // Only one modal allowed.
	var input_tag, input_style="width:80%;font-size:small;";
	var confirm_prompt=initval===undefined;
	if (!confirm_prompt) input_tag=initval.length<40 ? "input" : (input_style="width:95%;height:100px;","textarea");
	var content=$("<div class=sfswe-content tabindex=2 style='outline:none;white-space:pre-wrap;background:#fff0f0;'>"
				  +"<div>"+pretext+"</div>" 
				  +(initval!==undefined ? "<"+input_tag+" spellcheck='false' style='"+input_style+"'  tabindex='1'></"+input_tag+">":"")+"</div>");
	content.find("input:not(:checkbox),textarea").val(initval);
	try{content.resizable();}catch(e) {log("spromtinner(), err",e.lineNumber,e);}
	var sp1=$(document).scrollTop();
	var dfunc=content.dialog.bind(content);
	var dialog=content.dialog({
		modal: true, width:"auto", position: { my: "center", at: "center", of: unsafeWindow }, // Greater percent further to top.// Position is almost default anyway, difference is use of unsafeWindow due to strange error during prompt in jq in opera violentmonkey
		close: function(e) { dialog.off("keydown"); $(document).scrollTop(sp1); if (e.key=="Escape") reject("Escape");}
	}).parent();
	var buttons={
		[cancelbtnText]: function(e) { if (confirm_prompt) resolve(false); else resolve([false, $(this).find("input,textarea").val()]); dfunc("close"); return false;},
		[okbtnText]: function(e) { if (confirm_prompt) resolve(true); else resolve([true,$(this).find("input,textarea").val() || ""]); dfunc("close"); return false;}
	};
	if(extrabtnText) buttons[extrabtnText]=function(e) { if (confirm_prompt) resolve(Infinity); else resolve([Infinity,$(this).find("input,textarea").val() || ""]); dfunc("close"); return false;};
	content.dialog("option","buttons",buttons);
	if (cancelbtnText==-1) { dialog.find("button").each(function(){   if (this.textContent=="-1") $(this).remove(); }); }
	dialog.wrap("<div class=sfswe-sprompt></div>"); // allows css rules to exclude other jqueryUi css on webpage from own settings, a
	dialog.keydown(function(e){	if (e.key == "Enter" && !/textarea/i.test(e.target.tagName)) $("button:contains("+okbtnText+")",this).click();  });
	dialog.css({"z-index":2147483647, width:550, position:"fixed", left:200, top: 50, background: "whitesmoke"}); //"#fff0e0"
	dialog.find(".ui-dialog-titlebar").remove(); // No img in css for close 'x' at top right so remove.  Title bar not in normal confirm anyhow.
	dialog.draggable("option","handle", ".ui-dialog-buttonpane"); //
	dialog.resizable();
	// var maxH=innerHeight - (content.offset().top-$(window).scrollTop()) - 100;
	// content.css({"overflow-x":"hidden","max-height":maxH}); //innerHeight-dialog.position().top-$(".ui-dialog-buttonpane").height()}).scrollTop(0);
	setTimeout(function(){var ips=dialog.find("input,textarea");if (ips.length) ips.focus(); else content.focus();},100);
	that.last_dfunc=dfunc;
	return dialog; //.ui-dialog
}catch(e) {log("hlightAndsetsel(), err",e.lineNumber,e);}}

function checkIfPermanentRemoval(target) {   // called from click handler.
	var sconfirm_promise, checkif_resolve, checkif_reject;
		checkif_promise=new Promise((resolve,reject)=>{
			checkif_resolve=resolve;checkif_reject=reject;
			var parent=target.parentNode, index=0;
			var msg="Permanently erase selected element(s) from website &mdash; now seen on page red bordered and blinking?  In addition you may use 'w' and 'n' keys freely, to widen and narrow your selection.  "
				+"Escape quits.  Enter OK's.  Use the GM menu <a href='#abc"+Math.random().toString(36)+"'>Erase Web Elements</a> to edit internal code."           // Clickable link see .click below.
	+"Hit Temp button below for ctrl-click to erase element(s) temporarily and inhibit this prompting until reload."
	+"\n\nInternal code for <span id=fsfpe-tagel></span><br><div style='display:inline-block; position:relative;width:100%'><input disabled id=sfswe-seledip style='width:80%;margin:10px;'><div id=sfswe-seledipfull style='position:absolute; left:0; right:0; top:0; bottom:0;'></div></div>";
			$(document).keypress(keypressHandler);
			sconfirm_promise=sconfirm(msg,"Cancel","OK","Temp"); ////////////////
			var dialog=sconfirm_promise.dialog;
			var buttonpane=dialog.find(".ui-dialog-buttonpane");
			buttonpane.append("<div><input id=sfswe-checkbox7 type=checkbox style='vertical-align:middle'>"+"<label style='display:inline'>&nbsp;&nbsp;Remove just from this page (not entire website).</label></div>");
			buttonpane.append("<br><div style='margin-top:-10px;'><input id=sfswe-checkbox6 type=checkbox style='vertical-align:middle'>"	+"<label style='display:inline;'>&nbsp;&nbsp;Completely delete element.</label></div>");
			dialog.find("a").click(e=>{
				log("click on a in OK");
				dialog.trigger($.Event("keydown",{keyCode:27,key:"Escape"})); // close prompt.
				eraseElementsCmd();});
			var input=$("#sfswe-seledip"), ip=input[0], div_surround=input.next();
			div_surround.click(e=>{ // a click on input & surround enables it.
				ip.disabled=false; 	    ip.setSelectionRange(999,999);
				div_surround.css("display","none");
				input.focus();
				input.blur(e=>{ip.disabled=true; div_surround.css("display",""); });
			}); //
			hlightAndsetsel(target); // Also sets input value to selector!
			setTimeout(function(){dialog[0].scrollIntoView();},100);
		});//new Promise()
	close_of_prompt(sconfirm_promise, checkif_resolve, checkif_reject);
	log("Got back from close_of_prompt, close_of_prompt:",sconfirm_promise);
	return checkif_promise;
}//end checkIfPermanentRemoval()

function close_of_prompt(sconfirm_promise, checkif_resolve, checkif_reject) {
	var nested_confirm, first_reply, complete_rm, reply_sel;
	sconfirm_promise.catch(function(reply){
		hlightAndsetsel(0,"off","restore");
		log("caught confirm prom");
		checkif_reject("caught");
	});
	nested_confirm=sconfirm_promise.then(function(reply){                 ///////////////////////////////////////
		$(document).off('keypress');
		$(":data(pewiden-trace)").data("pewiden-trace",""); // remove trace
		var complete_rm=$("#sfswe-checkbox6:checked").length!=0;
		var webpage_only=$("#sfswe-checkbox7:checked").length!=0;
		log("complete_rm?",complete_rm, "reply:",reply);
		if (reply!=false) reply_sel=$("#sfswe-seledip").val().trim(); 
		if(reply!=true) { 
			hlightAndsetsel(0,"off","restore"); 
			//if(reply==Infinity) checkif_resolve([reply,$(reply_sel).detach]); //$(reply_sel).hide(); // temp delete
			checkif_resolve([reply,reply_sel]); 
			return; 
		};
		sconfirm_promise.data=[reply_sel,complete_rm]; // use ES6 await?
		if (reply_sel)  {
			let ancErased=$(reply_sel).closest(".Web-Eraser-ed");  //.closest, includes current.
			if (hidElementsListCmd("isthere?", reply_sel) || (ancErased.length && getHidElemsCmd("match el",ancErased))){ 
				alert("Already attempting erasure of the element specified or parent, if not being erased properly try "
                      +"ticking the monitoring option or open 'Erase Web Elements' GM menu and hit its 'OK' button.\nInternal code:"
					  +reply_sel+"\n\n   Ancestor:"+nodeInfo(ancErased)); 
				console.info("Already erasing",ancErased,nodeInfo(ancErased),".  Your selector",reply_sel);
				hlightAndsetsel(0,"off","restore");
				checkif_reject("Ancestor Already");
				return; 
			}
			if (!webpage_only)
				hidElementsListCmd("add",reply_sel+" site");
			else
				hidElementsListCmd("add",reply_sel);    // btn1 -> null, btn2 -> "<string>" null==undefined
			if (hidElementsListCmd("rm", $(reply_sel).find(".Web-Eraser-ed"))) console.info("Removed child selectors of",reply_sel);
			hlightAndsetsel(0,"off","restore");
			log("reply true, complete_rm@",complete_rm,"add sel:",reply_sel);
			if (complete_rm) zaplists.add(reply_sel);
			checkif_resolve([true,reply_sel]);
			
		} else {  // empty reply.
			hlightAndsetsel(0,"off","restore"); 
			checkif_reject("empty");
		}
	});// sconfirm_promise.then        /////////////////////////////////////////////
}

function eraseElementsCmd() { 
	// Called from GM script command menu and from clickable within ctrl-click  prompt.
	// 
	var erasedElems, no_sels;
	erasedElems=getHidElemsCmd("with site");
	no_sels = !erasedElems ? 0 : erasedElems.split(/,/).length;
	var prompt_promise=sprompt(
		"See checkboxes distantly below to set the script's configutation values.  Ctrl-click is the usual way to erase parts of a webpage, however, as an alternative below you can manually "
			+"edit the internal selectors for erased elements, eg, 'DIV#main_column site', optional word 'site' erases the element at the entire website; eg, 'iframe' will hide all iframes (often ads). " 
			+"For more than one selector use commas to separate"+(no_sels?", currently there's "+no_sels+" below":"")+".  To remove all element erasures set to blank.  Reload webpage if necessary."
		, erasedElems.replace(/,/g,", \n"));
	prompt_promise.then(function([btn,reply]){
		if (!btn) return; //cancel ==> null, undefined==> escape. (null is == to undefined!)
		config={monitor:config.monitor}; delete config.monitor[website];
		if ($("#sfswe-checkbox:checked").length)	config.noAnimation="checked";
		if ($("#sfswe-checkbox2:checked").length)	config.keepLayout="checked";
		if ($("#sfswe-checkbox3:checked").length) 	config.hideCurtains="checked";
		if ($("#sfswe-checkbox5:checked").length)       config.monitor[website]="checked";
		if ($("#sfswe-checkbox4:checked").length) {
			toggleCurtains();
			let subpromt=sprompt("Please enter http address of curtain image to be used.  If giving left and right images separate with a space.  "
	+"Leave empty to reset.  Accepts base64 image strings.","");
			subpromt.dialog.attr("title","Perhaps try a quaint example; one found with an image search for 'curtains':\n\thttp://www.divadecordesign.com/wp-content/uploads/2015/09/lace-curtains-5.jpg");
			subpromt.then(function([btn2,reply2]){
				if (btn2) { setValue("ownImageAddr",reply2);
							curtain_icon=reply2||whitecurtains;
							curtain_slim_icon=reply2||whitecurtainsoriginal;
							curtain_wide_icon=reply2||whitecurtainstriple;
							$(".WebEraserCurtain").attr("src",curtain_icon);  }
				toggleCurtains(); });
		} else {
			let duplicates={};
			reply=reply.replace(/\s*,\s*/g,",").replace(/(?=[^,])\n(?=[^,])/g,",").split(/,/); // , newline->comma if none; if no comma all is put in [0]
			log("Got reply array:",reply);
			if(reply.length) {
				page_erasedElems=[]; site_erasedElems=[]; 
				$(reply).each((i,str)=>{ //
					if (str=="") return;
					if (duplicates[str]) return;
					duplicates[str]=true;
					str=str.trim();
					if (/\ssite$/.test(str)) site_erasedElems.push(str.replace(/\ssite$/,""));
					else page_erasedElems.push(str);
				});
				site_erasedElems=site_erasedElems.toString();
				page_erasedElems=page_erasedElems.toString();
			}
			try{$(reply);} catch(e){alert("Bad selector given."); throw(e);}
			setValue("config",config);
			setValue(website+":erasedElems",site_erasedElems);
			setValue(webpage+":erasedElems",page_erasedElems);
			zaplists.update();
			//log("end awaaits of setvalue");
			openCurtains();
			$(".Web-Eraser-ed").each(function(){
				var self=$(this);
				self.css({display: self.data("sfswe-display"), visibility: self.data("sfswe-visibility")});
				self.removeClass("Web-Eraser-ed");
			});
			$(".CurtainRod").remove();
			//log("set tout")
			setTimeout(inner_eraseElements,1000,"prompt"); //'cos openCurtains takes time
			//inner_eraseElements("fromPrompt");
		}
	});//prompt_promise.then()
	var keep_layout=config.keepLayout;
	var dialog=prompt_promise.dialog;
	dialog.find(".ui-dialog-buttonpane").prepend(
		"<div class=sfswe-ticks style='float:left;font-size:10px;'>" //width:78%;
	+"<input id=sfswe-checkbox2 type=checkbox style='float:left;"+(!keep_layout?" margin:0 3px;":"")+"' "+keep_layout+"><label>Preserve layout (in general).</label>"
			+(keep_layout ? "<input id=sfswe-checkbox3 type=checkbox style='margin:0 3px 0 10px;height:12px;'"+(config.hideCurtains||"")+"><label>Also hide curtains.</label>" : "")
	+"<br><input id=sfswe-checkbox type=checkbox style='margin-left:3px;'"+(config.noAnimation||"")+"><label>Disable animation (in general).</label>"
	+"<br><input id=sfswe-checkbox4 type=checkbox style='margin-left:3px;'><label>Set your own curtains' image.</label>"
			+"<input id=sfswe-checkbox5 type=checkbox style='margin-left:15px;'"+(config.monitor[website]||"")+"><label>Monitor for new elements on this website.</label>"
			+"</div>"
	);
	dialog.find("input:checkbox").css({
		//cmtd out 8/17	"-moz-appearance":"none",
		height:12});
	dialog.find(".ui-dialog-content").attr("title","WebEraser userscript.\n"+webpage+"\n\nCurrent matches at this webpage:\n"+bodymsg());
} //eraseElementsCmd()

function inner_eraseElements(from) { 
	//
	// Called at page load and when user sets selector(s) for erasure.
	// 1. Go through uncurtained elements for erasure and do curtainClose (or css display to none) on each.
	// 2. Class each as "Web-Eraser-ed" and backup css values that might get changed.
	// 3. If changes were made log details to console and to logging div.
	//
	var erasedElems=getHidElemsCmd(), len=erasedElems.length, erasedElems_ar=erasedElems.split(/,/), count=0, nomatch=[];
	if (erasedElems_ar[0]=="") erasedElems_ar.shift(); //fix split's creation of array length one for empty string.
	var theErased=$(".Web-Eraser-ed"); theErased.removeClass("Web-Eraser-ed");
	log("inner_eraseElements, erasedElems_ar",erasedElems_ar, "from:",from);
	erasedElems_ar.forEach(function(sel,i){
		erasedElems=$(sel); //Array.from(document.querySelectorAll(sel)); //$(sel), jQ cannot find duplicate ids.
		erasedElems.each(function() {
			log("inner_eraseElements Found for sel",sel," el: ",this);
			var eld=this,el=$(eld); // 40msecs per 'each' loop.
			if(/delay|focus/.test(from)) { // skip curtains already closed.
				var crod=jQuery.data(eld,"rod-el"); //el.prev()[0];
				if (crod && /^sfswediv/i.test(crod[0].tagName)) {el.addClass("Web-Eraser-ed");return;}
			}
			markForTheCurtains(el,eld,sel);
			var no_anima=config.noAnimation, keep_layout=config.keepLayout;
			if (no_anima && !keep_layout)  eld.style.setProperty("display","none","important");
			else  if (el.css("display")!="none") closeCurtains(el, no_anima, measureForCurtains);
			count++;
		}); //erasedElems.each()
		if (erasedElems.length==0 && sel) nomatch.push(sel);
	}); //forEach()
	if (iframe || count==0) return;
	theErased=$(".Web-Eraser-ed");
	observeThings();

	if (len==0)  observeThings("off");
	if (theErased.length==0) return;  ////////////////////
	if (nomatch.length) {
		console.info("WebEraser message: no match for the following selectors at",webpage+":");
		nomatch.forEach(nom=>console.info("\t",nom));
	}
	var ieemsg="Userscript WebEraser has selectors to hide.  "+count+(count==1 ? " element that was":" elements that were")+" present on page at site: "+website
		+".\nSee GM menu command Erase Web Elements to check and edit selector list.  "
		+(config.keepLayout ? "" : "Keep layout is not ticked.")
		+(config.noAnimation ? "Animation is off." : "")
		+(config.hideCurtains ? "Hide curtains is ticked." : "");
	theErased.each(function(i){
		var that=$(this);
		var sel=that.attr("selmatch-sfswe");
		var onzaplist=zaplists.which(sel);               // 10 msecs to here from prev in  closeCurtains() above.
		var rod=jQuery.data(this,"rod-el");
		var is_an_overlay=rod && rod.hasClass("sfswe-overlay");    //that.prev().hasClass("sfswe-overlay");
		ieemsg+="\n"+(i+1)+":"+sel;
		ieemsg+=".\t\t"
			+(is_an_overlay ? "=> Considered as an Overlay,takes up > 2/3 of window, deleted."
			  : onzaplist.zap ? " => complete erasure."
			  : onzaplist.keep_layout ? " => erase but keep layout."
			  : "" );
	});
	ieemsg+="(phase:"+from+")";
	count=0;
	console.info(ieemsg);
	bodymsg(ieemsg.replace(/(.*\n){2}/,"")+"  Whence: "+from+".","init");
}

function closeCurtains(el, noAnimKeepLayout, finishedCB=x=>x) {   //called from inner_eraseElements()
	//log("closeCurtains1, el:",el,noAnimKeepLayout,finishedCB,"sel:",el.attr("selmatch-sfswe")); //,"\n\nLog of Stack",logStack());
	var that=closeCurtains; if (!that.final_curtain) that.final_curtain=0;
	var hide_curtains=config.hideCurtains, keep_layout=config.keepLayout, wediv=el.children("sfswediv"), curtainRod, lrcurtains;
	var old_curtained=wediv.length ? jQuery.data(wediv[0],"covered-el") : null;
	if ( ! old_curtained || ! old_curtained.is(el))
		[curtainRod,lrcurtains]=createCurtains(el,noAnimKeepLayout);
	else { curtainRod=el.children("sfswediv"), lrcurtains=curtainRod.children();}
	curtainRod.css("display","");
	var onzaplist=zaplists.which(el); // 20 msecs from prev
	if (noAnimKeepLayout) {
		lrcurtains.css({width:"51%"});
		if (onzaplist.zap) { curtainRod.css({display:"none"}); el[0].style.setProperty("display","none","important");} // "none" triggers monitor if on.
		else if (onzaplist.keep_layout||hide_curtains||curtainRod.hasClass("sfswe-overlay")){
			curtainRod.css({visibility:"hidden",display:""});
			el[0].style.setProperty("visibility","hidden","important");
		}
		measureForCurtains();
	}
	else { // Do animated curtain closing, then, perhaps, fade out.
		that.final_curtain++;
		manimate(lrcurtains,["width",15,"%"],1000,2);
		manimate(lrcurtains,["width",51,"%",1000],1000,5,function(){ ///////////////////////Animation
			log("Anim end",lrcurtains,"Width of left curtain:",lrcurtains.css("width"));
			lrcurtains.css("width","51%");
			curtainRod.css("visibility","visible");
			el=jQuery.data(this.parentNode, "covered-el")||$();
			if (!keep_layout || curtainRod.hasClass("sfswe-overlay")||onzaplist.zap) {
				//console.log("Anim end, fade curtains");
				el.add(curtainRod).delay(200).fadeOut(       // $.add here prepends.
					500, function(){
						this.style.setProperty("display","none","important"); // triggers monitor if on.
						if (el[0]==this && --that.final_curtain==0) finishedCB();
					});
			}
			else if (hide_curtains||onzaplist.keep_layout) {
				//console.log("Anim end, fade out 2");
				el.add(curtainRod).delay(200).fadeOut(
					1000, function(){
						this.style.setProperty("visibility","hidden","important");
						this.style.setProperty("display",$(this).data("sfswe-display"),"important"); //triggers monitor.
						curtainRod.css({visibility:"hidden",display:""});
						curtainRod.remove();
						if (el[0]==this && --that.final_curtain==0) finishedCB();
					});
			} else if (--that.final_curtain==0) {
				//console.log("Anim end, call CB");
				finishedCB();
			}
		}); //animate()
	}
	return false;
} //closeCurtains()

function keypressHandler(event) { try{ //while prompt is open.
	var ip=$("#sfswe-seledip:enabled");
	if (ip.length) { //live typing of selector.
		setTimeout(ip=>{
			var cval=ip.val(), matched_els=[];
			try{matched_els=$(cval);} catch(e) {};// bad selector, transient
			if (matched_els.length) { // may unwind.
				hlightAndsetsel(0,"off",null,"mere_highlight"); 
				hlightAndsetsel($(cval),null,null,"mere_highlight"); }
			else hlightAndsetsel(0,"off","restore");
		},500,ip);
	} else  { // widen/narrow
		switch(event.key) {
		case "w": widen(); break;
		case "n": narrow(); break; 
		default: return; } 
		return false;
	}
} catch(e) {console.error("An key handler error:"+e+" "+e.lineNumber);} };

// GM_registerMenuCommand("Temporary web deleter, ctrl-click",function(){
//     window.addEventListener("mousedown",function(e){
// 	if(e.ctrlKey) {
// 	    if (e.preventDefault) { e.preventDefault(); e.stopPropagation(); }
// 	    e.target.style.setProperty("display","none","important");
// 	}
//     },true);
// });
//thousand's comma, call Number.toLocaleString()
//if (iframe) console.log=x=>null;       //logger(); // Logs from doc start.

async function init_globs() { // all globs asynchronously set.
	log("init_globs");
	page_erasedElems=(await getValue(webpage+":erasedElems","")).trim();
	//loader Failed here.
	site_erasedElems=(await getValue(website+":erasedElems","")).trim();
	elems_to_be_hid=getHidElemsCmd();
	zaplists=new zaplist_composite(); 
	await zaplists.update(); //depends on site/page_erasedElems being read first.

	ownImageAddr=await getValue("ownImageAddr","");
	whitecurtains=await GM.getResourceUrl("whiteCurtains");
	// Ensure visit to https matches getResourceUrl use of https or address as given in header w/wo ssl!
	whitecurtainsoriginal=await GM.getResourceUrl("whiteCurtainsOrig");
	whitecurtainstriple=await GM.getResourceUrl("whiteCurtainsTrpl");
	curtain_icon=ownImageAddr|| whitecurtains;
	curtain_slim_icon=await getValue("ownImageAddr","")||whitecurtainsoriginal;
	curtain_xslim_icon=await getValue("ownImageAddr","")||await GM.getResourceUrl("whiteCurtainsXsm");
	curtain_wide_icon=await getValue("ownImageAddr","")||whitecurtainstriple;
	config=await getValue("config",{keepLayout:"checked",monitor:{}});
	if (!config.monitor) config.monitor={};
	if(!jQuery.ui)  { // GM4 loader problem. Another userscript is loaded that has jq but no jQuery-UI will clobber $.ui here.
		$=jQuery=jq_saved;  // saved from when prior to async branch.
		console.log("GM4 FAILure, jq.ui clobbered, patching up.",jQuery.ui);
	}
}

function installEventHandlers(phase2) {
	if(!phase2) {
		document.addEventListener("scroll", function(e){ if (!overlay) return; e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();},true);
		
		//window.addEventListener("click",handleClick,true);
		window.addEventListener("mousedown",handleClick,true);
		window.addEventListener("message", postMessageHandler,false);
		if(iframe) window.installedEHs=true;
		//console.log("installed handlers, window.mousedown, at:",location.href,".  In iframe?",iframe);
	}
	else {
		$("iframe").each(function(){
			var fwin=this.contentWindow; try{ //perhaps permission error due to iframe origin.
				if (!fwin.installedEHs) {
					fwin.addEventListener.call(fwin,"mousedown",handleClick,true);
					fwin.addEventListener.call(fwin,"message", postMessageHandler2,false);
					//despite use of call(), event is still triggered in this context not in iframe's hence use of frameElement.
				}} catch(e){};
		});
	}
}

function prevDef(e) { if (e.preventDefault) {	e.preventDefault();   e.stopPropagation(); e.stopImmediatePropagation();  }
					} //else console.log("No preventDefault for event",e);	}					       

function postMessageHandler(e){ //reads postMessage().
	if ( ! e.data.type || e.data.type!="sfswe-iframe-click") return;
	//log("Handle a PostMessage, iframe:",iframe, "code:",e.data.code,"data",e.data,[e]);
	if (iframe) {
		window.parent.postMessage({type:"sfswe-iframe-click",code:++e.data.code},"*");
		return;
	}
	var iframeEl; 
	$("iframe, embed").each((i,el)=>{ 
		// log("cmp, el.cont",el.contentWindow," e.source",e.source," e.origin",e.origin,typeof e.origin);
		// log("getsvg",el.getSVGDocument,el);
		// log("src",e.data.src,"==",el.src);          //xss perm denied, e.source.toString(),
		if (el.contentWindow==e.source ||e.data.src==el.src) { iframeEl=$(el); return false; }
	});

	// var iframeEl=$("iframe, embed").filter(function(){ 
	// 	log("cmp, this.cont",this.contentWindow," e.src",e.source,"res:",this.contentWindow==e.source);
	// 	return this.contentWindow==e.source; 
	// });
	handleClick({target:iframeEl[0],ctrlKey:true},"iframe_click");
}

function getSelectorWithNearestId(target,exclude_classes) { // need extended jquery for :regexp 
	ensure_jquery_extended(); 
	var sel, nearestNonNumericId=target.closest(":regexp(id,^\\D+$)").attr("id"), nnmi=nearestNonNumericId; //closest also checks target
	//console.log("nnmi",nnmi, "matches #els:",$("[id="+nnmi+"]").length);
	if (nnmi && $("[id="+nnmi+"]").length>1) { nnmi="";ignoreIdsDupped=true;} // Page error duplicate ids, ignore id.
	if (nnmi) nnmi=$("#"+nnmi).prop("tagName")+"#"+nnmi; //cos of jQ & multiple ids.
	if ($(nnmi).is(target)) sel=nnmi;
	else {
		sel=selector(target,$(nnmi),true,0,exclude_classes); //ok if nnmi is undefined id.
		if (!sel) sel=nnmi; //both target and $(nnmi) are same element. 
		else if(nnmi) sel=nnmi+sel;
	}
	return sel;
}

function getHidElemsCmd(cmd,el){
	var els, pels=page_erasedElems, sels=site_erasedElems;
	//console.log("Got sels as:",sels);
	switch(cmd) {
		
	case "match el":  return el.is($(getHidElemsCmd()));
	case "count":     return getHidElemsCmd().split(/,/).reduce(function(prev_res,sel){return prev_res+$(sel).length;},0);
	case "with site": sels=sels.replace(/,/g," site,")+(sels ? " site" : ""); // see reverse of this in hidElementsListCmd() and  eraseElementsCmd().
	default:          return pels + (sels && pels ? "," : "") + sels;	// if (justpels_ar) return pels.split(","); //webpage elements.
	}
}

function hidElementsListCmd(cmd,str,str2) {
	//console.log("hidElementsListCmd, cmd:",cmd, "str:",str,"str2:",str2, "HidElems:",getHidElemsCmd());
	var  sitewide;
	switch(cmd) {
	case "add":
		if (hidElementsListCmd("isthere?",str)) return;
		if (/\ssite$/.test(str)) { sitewide=true; str=str.replace(/\s+site$/,"");  }
		if (sitewide)  site_erasedElems += site_erasedElems ? ","+str : str;
		else  page_erasedElems += page_erasedElems ? ","+str : str;
		$(str).each(function() {  $(this).data("sfswe-oldval", $(this).css(["display","visibility","height","width"]));	});
		break;
	case "mv":
		if (hidElementsListCmd("rm",str)) str2+=" site";
		hidElementsListCmd("add",str2);
		return; //return needed to prevent saving of old values.
	case "rm":
		if (str instanceof $) { str.each(function(){ hidElementsListCmd("rm", $(this).attr("#selmatch-sfswe"));	});  return str.length; }
		page_erasedElems=$.map(page_erasedElems.split(/,/),el=>el==str ? null : el.trim()).join(",");
		site_erasedElems=$.map(site_erasedElems.split(/,/),el=>el==str ? null : el.trim()).join(",");
		break;
	case "isthere?": //check if str is amongst hidden elements list.
		return getHidElemsCmd().split(/,/).includes(str);
		//return getHidElemsCmd().split(/,/).reduce((prev_res,next)=>prev_res||next==str,false);
	}
	log("hidElementsListCmd",cmd,str,str2,"SetValues: ",site_erasedElems,page_erasedElems);
	setValue(website+":erasedElems",site_erasedElems);
	setValue(webpage+":erasedElems",page_erasedElems);
	zaplists.update();
	
	return sitewide;
}

//Blinks are double, one for selected elements, other is only when at top/bottom of narrow/widen chosen.
function hlightAndsetsel(elem, off, restore, mere_highlight) {try{ //also updates prompt with elem's selector.
	if (!off) { // on
		elem=$(elem);
		if (elem.length==0) return;
		gpre_elem=gelem;
		gelem=$(elem);
		var newsel,fullsel,h=gelem.height(),w=gelem.width();
		console.info("W/e widen/narrow, element to highlight is",gelem, mere_highlight);
		if (!mere_highlight) { // not typed in but from widen/narrow etc.
			var selinput=$("#sfswe-seledip"),            //sfs_pesel");
				elhtml=gelem[0].outerHTML.replace(gelem[0].innerHTML,"");
			
			newsel=getSelectorWithNearestId(gelem,tbcl+" "+rbcl+" Web-Eraser-ed");
			fullsel=selector(gelem,0,false,0,tbcl+" "+rbcl+" Web-Eraser-ed");
			gelems=$(newsel).not(gelem);
			selinput.val(newsel); //+"<pre style='font-size:14.4px;'>\n\tHTML in pre</pre>");
			selinput.prop("title", (newsel!=fullsel ? "Full selector:\n\n\t"+fullsel+"\n\n" : "")
						  //+gelem[0].outerHTML.replace(/>.*/g,">").replace(/\s*</g,"<")
				+"Element html:\n"+elhtml
				+"\n\nElement style:\n"+myGetComputedStyle(gelem[0]));
		} //endif !mere_highlight
		updatePromptText(newsel,fullsel);
		gelem.data("pewiden-trace","true"); //    if (!gelem.hasClass("pewiden-trace"))
		//!!	gelem.parents().addBack().addClass(tbcl);
		//	gelem.find(">:only-child").addClass(tbcl);
		gelem.add(gelems).toggleClass(rbcl);
		gelem.elh=gelem[0].style.height;	gelem.elw=gelem[0].style.width;
		gelem.height(h- 2*border_width);gelem.width(w- 2*border_width);
		bblinker=setInterval(function(){ // normal "selected" blink.
			if (gelems.length) gelems.toggleClass(rbcl);
			else gelem.toggleClass(rbcl);    //.css({borderColor:"red",borderWidth:"9px",borderStyle:"double"});
			if (plat_msedge) // catch of escape not working on msedge.
				if ($(".ui-dialog").css("display")=="none") 	hlightAndsetsel(0,"off","restore"); 
		},1200);
	}
	else { //off
		clearInterval(bblinker);
		gelem.removeClass(rbcl);
		gelem[0].style.height=gelem.elh;	gelem[0].style.width=gelem.elw;
		//gelem.height(h+ 2*border_width);gelem.width(w+ 2*border_width);
		if (restore) $("."+tbcl).removeClass(tbcl); 
	}
}catch(e) {console.error("hlightAndsetsel(), err",e.lineNumber,e);}}


function widen() { // .html() return &gt; encodings, .text() does not.  tab as @emsp must be set with html() not text()
	var selinput=$("#sfswe-seledip");
	if (/[:.][^>]+$/.test(selinput.val())) {
		var newsel=selinput.val().trim().replace(/[:.][^:.]+$/,"");
		selinput.val(newsel);
		gelems=$(newsel);
		gelems.addClass(rbcl);
		updatePromptText();
		return;
	}
	if (gelems.length) { gelems.removeClass(rbcl);gelems=$();}
	var p=gelem.parent();
	if (p.is("body")) {
		blinkBorders(gelem); //blink double indicates top of hierarchy.
		return;
	}
	hlightAndsetsel(0,"off");
	hlightAndsetsel(p);
}

function narrow() {
	if (gelems.length) {
		widen();  // nulls gelems.
		narrow(); // Follow gelem trace back to el.
		//narrow();
		return;
	}
	var trace=gelem.find(":data(pewiden-trace):first"); // trace left by hlightAndsetsel()
	if(trace.length==0) trace=gelem.find(">:only-child");
	if (trace.length==0) {
		blinkBorders(gelem);
		return;
	}
	hlightAndsetsel(0,"off");
	hlightAndsetsel(trace);
}

function updatePromptText(newsel,fullsel) { 	// set text size tagname etc.
	var updated_text="";
	if (gelems.length<=1)
		updated_text="selected ("+gelem.prop("tagName").toLowerCase()+") element ("+(gelem.height()|0)+"x"+(gelem.width()|0)+"pixels)";
	else
		updated_text="selected "+gelems.length+" "+gelem.prop("tagName").toLowerCase()+"s";
	updated_text+=":";
	$("#fsfpe-tagel").parent().prop("title","Click here to invoke widen/narrow with 'w' and 'n' keys resp.\nClick on the internal code below, then move mouse a small bit to see "
									+(newsel!=fullsel ? "full position in hierarchy," : "")
				+" html and style settings of the selected element. ");
	$("#fsfpe-tagel").text(updated_text);
}

function myGetComputedStyle(el) {
	if (!document.defaultView.getDefaultComputedStyle) return ""; // has no getDefaultComputedStyle().
	var roll="",defaultStyle=document.defaultView.getDefaultComputedStyle(el);
	var y=document.defaultView.getComputedStyle(el), val, val2, i=1;
	for (let prop in y) {
		if (/^[a-z]/.test(prop) && ! /[A-Z]/.test(prop) && (val=y[prop])
			&& val!=defaultStyle[prop]) {
			if (val.trim)  //just a type check
				if (val.startsWith("rgb")) val="#"+val.replace(/[^\d,]/g,"").split(/,/).map(x=>Number(x).toString(16)).join("");
			if (prop.startsWith("border") && y[prop.replace(/-\w*$/,"")+"-style"]=="none") continue; // Error in getDefaultComputedStyle borders not set properly (eg, color should be that of el)
			roll+= prop +": "+val+"; ";
			if (i++%3==0) roll+="\n";
		} //endif
	}
	return roll;
}


function blinkBorders(elem, interval=150, times=4) { // borders must already be set.
	times*=2;
	var cnt=0,i=setInterval(function(){
		cnt++;
		elem.toggleClass(rbcl);
		//!!
		//	elem.toggleClass(tbcl); 
		if (cnt==times) {clearInterval(i);elem.removeClass(rbcl);}// interference so rm class.
	},interval);
}

function ensure_jquery_extended() { 
	if ($.expr[":"].regexp) return; // already extended, not yet clobbered.
	$.fn.reverse = Array.prototype.reverse; 
	$.fn.swap = function(to) {
		var a=this.eq(0), b=$(to).eq(0);
		var tmp = $('<span>').hide();
		a.before(tmp);
		b.before(a);
		tmp.replaceWith(b);
		return;
	};
	$.easing["stepper"] =  function (x, t, b, c, maxt) { // eg, see, console.log($.easing)  for other funcs.
		// var y=c*(t/=maxt)*t + b;
		// if (x<0.4) y=0.1;
		//console.log(x);
		//return y;
		return x;
	};
	$.extend($.expr[':'], {       // Check it's there with $.expr[":"].regexp.toString()
		regexp: function(currentobj, i, params, d) { //filter type function.
			params=params[3].split(/,/);       //eg, [ 'regexp', 'regexp', '', 'className,promo$' ]
			var attr=params[0], re=params[1];  //eg, className, promo$
			if (attr=="class") attr="className";
			var val=currentobj[attr]+""||"";
			if (attr=="className") return val.split(/\s/).some(function(cl){return cl.match(re);});
			else return val.match(re);
		}}); //$.extend()     //usage eg: $(“div:regexp(className,promo$)”);

	(function($){ 
		$.event.special.destroyed = {
			remove: function(o) {
				if (o.handler) {
					o.handler();
				}
			}
		}; })($); //Usage: $("#anid").bind('destroyed', function() {// do stuff}) // only for is jQ  removed el.
} //extend_jquery()

function selector(desc,anc,no_numerals,recursed,exclude_classes) {try{ // descendent, ancestor, such that ancestor.find(ret.val) would return descendant.  If no ancestor given it gives it relative to body's parent node.   // See example usage in checkIfPermanentRemoval(). Numeraled classes/ids are excluded.
	anc=$(anc).eq(0); //apply only to first ancestor.
	if (anc.length==0) anc=$(document.body.parentNode); // !anc wouldnt work for a jq obj.
	desc=$(desc);
	if ( (desc.closest(anc).length==0 || desc.length!=1) && !recursed) {
		console.info("Too many elements or descendant may not related to ancestor:");
		console.info("Descendant is:"+selector(desc,0,0,true));
		console.info("Ancestor is:"+selector(anc,0,0,true)+".");
		return;
	}
	// Last element is highest in node tree for .parentsUntil();
	var sel=
		desc.add(desc.parentsUntil(anc)) // up to but not including.
		.reverse() 
		.map(function() { // works from bottom up to ancestor, hence need for reverse().
			var t=$(this), tag=this.tagName.toLowerCase(), nth=t.prevAll(tag).length+1, id="", cl, nthcl;
			//id=this.id.replace(/^\s*\b\s*/,"#"); if (!ignoreIdsDupped) id="";
			cl=(t.attr("class")||"").trim(); // Don't use this.className (animated string issue)
			cl=cl.split(/\s+/).join(".").prefix("."); 
			if (exclude_classes) cl=cl.replace(RegExp(".("+exclude_classes.replace(/ /g,"|")+")","g"),"");
			if (no_numerals && /\d/.test(id)) id="";
			if (no_numerals && /\d/.test(cl)) cl="";
			if ( (cl && t.siblings(tag+cl).length==0)
				 || id
				 || t.siblings(tag).length==0)
				nth=0;
			else if (cl && t.siblings(tag+cl).length!=0) {
				cl+=":eq("+t.prevAll(tag+cl).length+")";   //jQuery only has :eq()
				nth=0;
			}
			return tag+(nth?":nth-of-type("+nth+")":"")+id+cl; ////////////////////nth-of-type is One-indexed.
		}) //map()
		.get()         //
		.reverse()
		.join(">");
	if (desc.is(anc.find(">"+sel))) {
		if (anc.is(document.body.parentNode)) return "html>" + sel;
		return ">"+sel;
	} else {
		console.info("Selector result:\n\t"+sel+"  Not findable in ancestor, nor in body's parent.");
		if ($(sel).length) return sel; //Its the very top element, <HTML>.
	}} catch(e){logError("Can't get selector for "+desc,e); }}  //fixBadCharsInClass(desc);}


function fixBadCharsInClass(obj) { //official chars allowed in class, throw error in jquery selection.
	obj.parents().addBack().each(function(){ this.className=this.className.replace(/[^\s_a-zA-Z0-9-]/g,""); });
}

function markForTheCurtains(el,eld,sel,unmark) {
	if (!unmark) {
		el.css({overflow:"hidden"}).addClass("Web-Eraser-ed").attr("selmatch-sfswe",sel) //hidden, so height not 0.
			.data({sfsweDisplay: eld.style.display, sfsweVisibility:eld.style.visibility, sfsweOverflow: eld.style.overflow}); // needed in case zero height element with floating contents. // To make it have dims, in case of zero height with sized contents.
	}
	else el.css({overflow:el.data("overflow")}).removeClass("Web-Eraser-ed").attr("selmatch-sfswe",""); //hidden, so height not 0.
	log("end markForTheCurtains, classes:",eld.className);
}

function reattachTornCurtains(curtains=$(".CurtainRod")) {try{
	var torn=false;
	curtains.each(function(){
		var that=$(this), el=jQuery.data(this,"covered-el")||$();
		if (el.parent().length==0 || !el.hasClass("Web-Eraser-ed")) {
			torn=true;
			that.addClass("sfswe-delete","true");
			//that.remove();
		}    });
	$(".sfswe-delete").remove();
	if (torn) inner_eraseElements();
} catch(e){console.error("WebEraser reattachTornCurtains(), error@",e.lineNumber,e);}}

function measureForCurtains(curtains=$(".CurtainRod")) {
	curtains.each(function(){
		//console.log("measureForCurtains for el(data-covered) as:",jQuery.data(this,"covered-el"));
		var that=$(this), el=jQuery.data(this,"covered-el");          // $.data seems to lose its info when another userscript is also running, jQuery.data works.
		if(!el) {console.error("noel");el=$();}

		var w=el.outerWidth(), h=el.outerHeight()+1; // Includes padding & border, margin included if 'true' passed.  jQuery sets and unsets margin-left during this, provoking attrModifiedListener.
		if (!el.hasClass("Web-Eraser-ed")) {
			el.addClass("Web-Eraser-ed");
			el.css({overflow:"hidden"});
		}
		//var offset=moffset(el);
		//that.css(offset);
		//that.css({height:h,width:w});
		//this.style.setProperty("width",w+"px","important");

		if(!that.hasClass("outie")) {
			that.css({left:0,top:0});
			this.style.setProperty("width","100%","important");
			this.style.setProperty("height","100%","important");
		}else {
			var offset=moffset(el);
			that.css(offset).css({height:h,width:w});
			this.style.setProperty("width",w+"px","important");
		}

		
	});};

function bodymsg(str,init) { // Append string to a <pre> that is initially appended to body.
	if ($("#sfswe-div-logger").length==0) $("body").prepend("<pre style='display:none;' id=sfswe-div-logger><pre class=init></pre></pre>");
	var sfsprelog=$("#sfswe-div-logger");
	var initpre=sfsprelog.find(".init");
	if (str) if (init) initpre.text(initpre.text()+"\n"+str+"\n");        //b.attr("sfswe-message",str);bodymsg.init=str;}
	else {
		if (str==bodymsg.str) 	sfsprelog.append(".");
		else {
			sfsprelog.append("\n"+str);
			console.info("WebEraser Monitor: "+str);
			bodymsg.str=str;
		}
	}
	return initpre.text();
}

function observeThings(disable) { // call will start or if running reset monitoring, with param, it disables.
	var that=arguments.callee; that.off=[];
	if (that.obs1) { try { that.obs1.disconnect(); that.obs2.disconnect();} catch(e){
		console.log("Error during turn off of observations,",e);  } }
	if (disable || ! config.monitor[website]) return;

	var a,b,sels=getHidElemsCmd(),
		nomonitor=set=>{ if (set==1) { that.off.push(true); a=that.obs1.takeRecords(); b=that.obs2.takeRecords();
									   //if(a.length ||b.length) console.log("TOOK records");
									 } // jquery get causes set, hence inf.loop.
						 if (set==0) { that.off.pop(); a=that.obs1.takeRecords(); b=that.obs2.takeRecords();
									   //if(a.length ||b.length) console.log("0TOOK records");
									 } return that.off.slice(-1)[0]; };
	
	var parseCssText=str=>JSON.parse("{" + (str||"").replace(/[\w-]+(?=:)/g,'"$&"').replace(/:\s*(.+?)(?=;)/g,':"$1"').replace(/;/g,",").slice(0,-1) + "}");
	console.info("WebEraser message: Monitoring elements that match given selectors for creation and display and to be erased on sight.");
	$(sels).each((i,el)=>$(el).data("sfswe-oldval", $(el).css(["display","visibility","height","width"])) ); //copy of style obj but dead (eg, cssText not updated).
	obs1_connect(sels);
	
	function obs1_connect(selectors) {
		that.obs1=attrModifiedListener(document,selectors,["style","class","id"],function(mutrecs) {
			if (nomonitor()) return;
			nomonitor(1);
			var rec=mutrecs[0], t=rec.target, target=$(t), attr=rec.attributeName;
			var oldval=target.data("sfswe-oldval"), currval=target.css(["display","visibility","height","width"]);
			
			//console.log("Attr modified: "+attr,	"\n\nmut.oldValue--attr currvalue\n\n    ",			rec.oldValue,"\n\n ---",nodeInfo(target.attr(attr)),"\n\n\ntarget.data.oldvals:\t\t",			nodeInfo(oldval),"\n\nCurvals from .css():\t\t",nodeInfo(currval),			"\n\n\ntarget",target,"\n\nAll "+mutrecs.length+" All mutation records with oldvals:\n",			mutrecs.map(x=>"\noldval: "+x.oldValue+"\t\t\t\tnode: "+nodeInfo(x.target)).join(" ")  );
			//ldval=parseCssText(mutrecs[0].oldValue);	    //var moldval=parseCssText(rec.oldValue);
			
			var objsel=target.attr("selmatch-sfswe");
			if (!objsel) {
				target.data("sfswe-oldval", target.css(["display","visibility","height","width"]));
				markForTheCurtains(target,t,findMatchingSelector(target,selectors));
			}
			if (!oldval && /class|id/.test(attr)) { //&& target.prev("sfswediv")[0]) {
				var newlen=that.obs1.add(target);
				oldval={};
			}
			
			if (currval.display=="none" && oldval.display!="none") {
				bodymsg("change-nodisplay:"+target.attr("selmatch-sfswe"));
				target.children("sfswediv").css("display","none");
				measureForCurtains();
			} else if (currval.display!="none" && (oldval.display=="none" || oldval.display==undefined )) {
				bodymsg("change-display:"+target.attr("selmatch-sfswe"));
				target.children("sfswediv").css("display","");
				closeCurtains(target); //,true); //no animation since asynch anime will trigger too many mutation records.
			}
			if ( parseInt(currval.height)|0 - parseInt(oldval.height)|0) {
				bodymsg("change-height:"+nodeInfo(target)+" "+currval.height);
				measureForCurtains();
			} else if ( parseInt(currval.width)|0 - parseInt(oldval.width)|0) {
				bodymsg("change-width:"+nodeInfo(target)+" "+currval.width);
				measureForCurtains();
			} else if (currval.visibility!=oldval.visibility)
				bodymsg("change-visibility:"+nodeInfo(target));
			// 	if (currval.visibility=="visible")  {
			// 	    bodymsg("change-display:"+target.attr("selmatch-sfswe"));
			// 	    target.prev().css("display","");
			// 	    closeCurtains(target,true); //no animation since asynch anime will trigger too many mutation records.
			// 	} else if (currval.visible!="visible") {
			target.data("sfswe-oldval",currval);
			// change-visibility?
			//}); //forEach
			nomonitor(0);
		}); // attrModifiedListener(... 
	} // obs1_connect()
	that.obs2=nodeMutationListener(document,sels, function(foundArrayOfNodes, parentOfMutation,removed) {
		if (nomonitor()) return;
		nomonitor(1);
		foundArrayOfNodes.forEach(node=>{   // A flattened subtree, if node was again removed quickly it may have no parent.
			var jQnode=$(node);
			if (!removed) { // new node inserted.
				jQnode.data("sfswe-oldval", jQnode.css(["display","visibility","height","width"]));
				var foundsel=findMatchingSelector(jQnode,sels);
				bodymsg("new-node:"+foundsel);
				markForTheCurtains(jQnode,node,foundsel);
				closeCurtains(jQnode,false,measureForCurtains); //nomonitor(0); },300);
			} else { // node removed
				//if(jQnode.attr("cc"))  {
				bodymsg("node-delete:"+jQnode.attr("selmatch-sfswe"));
				$(".CurtainRod[cc='"+jQnode.attr("cc")+"']").remove(); //.filter(function(){return $(this).data()})
				measureForCurtains();
				//} 
			}
		});//forEach
		nomonitor(0);
	},true); //nodeMutationListener()
}

function findMatchingSelector(obj,sels) {
	return sels.split(/,/).find(sel=>obj.is(sel));
}

function openCurtains(zap_or_keep="",curtains=$(".WebEraserCurtain")) { // called from ctrl-click with curtains, eraseElementsCmd() w/o curtains, and lrcurtains.click sets "keep"
	log("openCurtains",zap_or_keep,"curtains:",curtains);
	setTimeout(function() {
		curtains.each(function() { $(this).parent().css("visibility","hidden");});
		manimate(curtains,["width",0,"%"],3500,8,function() {
			var that=$(this), erased_el=jQuery.data(this.parentNode,"covered-el"); 
			var sel=erased_el.attr("selmatch-sfswe");
			bodymsg("opened curtains for sel:"+sel+", cc:"+erased_el.attr("cc"));
			switch(zap_or_keep[0]) { // z: zap from layout, k: keep layout, t temporarily rm curtains, a: alt rm erasure
			case "z": zaplists.add(sel);erased_el.css("display","none");measureForCurtains();console.info("Completely erased,",sel+".");break; 
			case "k": zaplists.add(sel,"keep");;erased_el[0].style.setProperty("visibility","hidden","important");console.info("Hidden for layout,",sel+".");break; //keep_layout
			case "t": that.parent().css("display","none");break;           //tzap
			case "a": hidElementsListCmd("rm",sel); observeThings(); that.parent().remove();markForTheCurtains(erased_el,0,0,"unmark"); break; //azap
			}
			//erased_el.prev().css({display:"none"});
		});
	},1000);
	return false;
}

// Outline overview of layout:
//
// <DIV id=xyz class=Web-Eraser-ed selmatch-sfswe="DIV#xyz"> // target el, for covering.  el.children("sfswediv") has data covered-el to here.
//   <sfswediv class=CurtainRod cc=n data.coveredEl=divtarget>             
// 	    <img class=webEraserCurtain sfswe-left>                        
// 	    <img> class=webEraserCurtain sfswe-right>
//   </sfswediv> 
// </DIV> 

// 

function createCurtains(el, noAnimKeepLayout) {
	var h=el.outerHeight()|0,w=el.outerWidth()|0, area=h*w, iw=w/2, //pos= moffset(el),    
		warea=window.innerHeight*window.innerWidth, csspos=el.css("position");
	log("createCurtains ",noAnimKeepLayout,"h/w",h,w," el:",el);
	// 9 msecs to here from function start.
	var lsrc=curtain_icon.split(/\s+/)[0], rsrc=curtain_icon.split(/\s+/).slice(-1); //last string
	//if (!getValue("ownImageAddr","")) switch(true) {
	if(!ownImageAddr) switch(true) {
		case w<250:  lsrc=rsrc=curtain_xslim_icon;break;
		case w<500:  lsrc=rsrc=curtain_slim_icon;break;
		case w>800: lsrc=rsrc=curtain_wide_icon;break; }
	var lcurtain=$("<img class='WebEraserCurtain sfswe-left' style='left:0;position:absolute;height:100%;visibility:visible;'>");
	lcurtain.attr("src",lsrc);
	setTimeout(()=>{
		if (lcurtain[0].complete||plat_chrome) return;
		lcurtain[0].src="https://raw.githubusercontent.com/SloaneFox/imgstore/master/whiteCurtains.orig.jpg";
		rcurtain[0].src="https://raw.githubusercontent.com/SloaneFox/imgstore/master/whiteCurtains.orig.jpg";
	},500);
	var rcurtain=$("<img class='WebEraserCurtain sfswe-right' style='right:0;position:absolute;height:100%;visibility:visible;' src="+rsrc+"></img>"), 
		curtainRod=$("<sfswediv tabindex=0 class=CurtainRod cc="+(++curtain_cnt)+" style='z-index:2147483640; position:absolute; display:block; opacity:0.94;visibility:hidden'></sfswediv>"),//background-color:#888; !!overflow:hidden; rm'ed //inline is default here, 'd take full width of parent.
		lrcurtains=lcurtain.add(rcurtain), sel=el.attr("selmatch-sfswe");
	//Absolute is relative to nearest non-statically positioned ancestor, this is returned from elem.offsetParent.
	el.attr("cc",curtain_cnt);
	curtainRod.append(lcurtain,rcurtain);
	curtainRod[0].title="Shift-Click to hide and preserve page layout.\nCtrl-click to persistently delete from layout.\nAlt-Click to remove erasure.\nDouble click to open or close curtains.\nClick to focus and enable typing of 'w', for widen, 'n', for narrow, 'l', lighten."
				+"\n\nSelector is: "+sel+", webpage is:"+webpage+".";

	lrcurtains.contextmenu(e=>(eraseElementsCmd(),false));
	lrcurtains.click(function({ctrlKey:ctrl,shiftKey:shift,altKey:alt,target:target}) {
		var that=$(this),lrcurtains=that.add(that.siblings());
		log("lrcurtains.click alt",alt,"lrcurtains:",lrcurtains,"this:",this);
		if (!(alt||shift)) return;
		if (ctrl&&shift) alert("Curtained target is,"+target,"lrcurtains:",lrcurtains,"this",this);
		else if (shift) openCurtains("keep_layout",lrcurtains);
		else if (alt) openCurtains("azap",lrcurtains);
		else if (ctrl&&alt) that.parent().focus();
		return false;
	});
	lrcurtains.dblclick(e=>openCurtains("tzap",lrcurtains));
	curtainRod.dblclick(e=>openCurtains("tzap",lrcurtains));
	el.dblclick(e=>closeCurtains(el)); el.mousedown(e=>false);  el.mouseup(e=>false);  el.click(e=>false);
	curtainRod.keypress(moveRod);
	//curtainRod.css({height:h,width:w}).css(pos).data({coveredEl:el,selmatchSfswe:sel});
	//curtainRod.css({height:h,width:w}); //.css(pos);

	curtainRod[0].style.setProperty("float","none","important");
	curtainRod[0].style.setProperty("width",w+"px","important");
	jQuery.data(curtainRod[0],"coveredEl",el);
	jQuery.data(el[0],"rodEl",curtainRod);
	//log("data covered-el",jQuery.data(curtainRod[0],"covered-el"),"for rod",curtainRod[0]);
	//log("\nAnd rod-el is ",jQuery.data(el[0],"rod-el"),"for el",el[0]);
	lrcurtains.css({ width: (!noAnimKeepLayout ? 0 : "51%" )}); // Initial width of each curtain.
	var portions=area/warea*100|0;    //curtainRod.attr("init-calc",(calc|0)+" "+portions);
	if (portions>=60) { //>75% of window is covered.
		var visible_area;
		with (Math) {visible_area=min(w,window.innerWidth)*min(h,window.innerHeight);}
		if (visible_area>=warea*0.6) {
			lcurtain.css({left:"10%"});
			curtainRod.css({width:"80%",top:"10%"}).addClass("sfswe-overlay");
			lrcurtains.css({height:h*0.8});
			setTimeout(x=>$("html, body").css("overflow",(i,v) => 
							  v=="hidden" ? "auto": null).css("position",(i,v) => v=="fixed" ? "static": null),4000);
			overlay=true;
			//First event listener can stop prop to ones added later, ideally would be added at doc-start.
			console.info("This element, chosen for erasure, is an Overlay (>2/3 covered, "+portions+"%, "+h+"x"+w+"): ", sel, el);}}
	assertZ(el);      
	if(!el.is("iframe,img,canvas")) { 
		curtainRod.css({height:"100%",width:"100%",left:0,top:0});
		el.prepend(curtainRod);        ////////////////////
		curtainRod.parent().css("position","relative"); // ensure also that left and top are 0.
	}
	else { 
		curtainRod.addClass("outie"); 
		let pos=moffset(el);
		log("OUTIE pos",pos,h,w, "$pos:",el.position());
		curtainRod.css({height:h,width:w}).css(pos); //	curtainRod.css({height:"100%",width:"100%",left:0,top:0});
		el.wrap("<div class=sfswe-contner>");
		el.before(curtainRod); 
	}
	return [curtainRod,lrcurtains];
}

function moveRod(e) {
	if (e.key=="w"||e.key=="n") {
		let  newel, rod=$(this), el=jQuery.data(this,"covered-el")||$(), p=el.parent(), newsel, oldsel=el.attr("selmatch-sfswe");
		var trace=el.find(":data(pewiden-trace):first"); 
		if(trace.length==0) trace=el.find(">:only-child");
		
		if (e.key=="n")   newel=trace; //narrow
		else              newel=p;     // widen
		if (newel.length==0 || newel.is("body")) {	rod.focus();$("body").blur();rod.focus(); return false;}
		
		newsel=selector(newel,0,false,0,"Web-Eraser-ed");
		el.data("pewiden-trace","true");
		hidElementsListCmd("mv", oldsel, newsel);
		newel.before(rod);
		jQuery.data(this,"covererEl",newel);
		markForTheCurtains(el,null,null,"unmark");
		markForTheCurtains(newel,newel[0],newsel);
		rod[0].title=rod[0].title.replace(/\nSelector is:.*\./,"\nSelector is:"+newsel+".");
		measureForCurtains();
		rod.focus();
	} else if (e.key=="l") { //lighten
		var rod=$(this);
		var op=rod.css("opacity");
		rod.css("opacity",op*0.8);
		setTimeout(x=>rod.css("opacity",rod.css("opacity")*1.25),10000);
	} else if (e.key=="s") {
		var sfsprelog=$("#sfswe-div-logger");
		sfsprelog.css("display","");
		sfsprelog[0].scrollIntoView();
	}
	
	return false;
}

function toggleCurtains() {
	var that=arguments.callee; 
	$(".CurtainRod").each(function(){
		if (!that.xor)    {manimate($(".WebEraserCurtain",this),["width",51,"%"],2000,12);}
		else              manimate($(".WebEraserCurtain",this),["width", $(this).data("init-width"),"%"],4000,8);
	});
}

function zaplist_composite() { // composite pattern.  4 objs.  Those on zaplist are for complete erasure, but may keep layout.
	if (iframe) return;
	var zlists=[new zaplist(webpage),new zaplist(website),new zaplist(webpage,"kl"),new zaplist(website,"kl")];
	this.add=function(sel,keep_layout){ 
		zlists.forEach(function(el) { el.add(sel,keep_layout);});   };
	this.contains=function(el){  // may be a dom/jq object or a string selector.   
		return zlists.some(function(list) { return list.contains(el);}); };
	this.which=function(el) { // The 2 bits returned tell if & on which zaplist the elem is.
		if (this.contains(el)) {
			var has_keep_layout=zlists.map(v => v.contains(el)).includes("kl");
			return {keep_layout:has_keep_layout,zap:!has_keep_layout};
		}
		return {keep_layout:false,zap:false};
	};
	this.update=function(sel){	zlists.forEach(function(el) { el.update();});  };
	this.toString=()=>"[object zaplist_composite]";
}

function zaplist(key,keytype) { 
	var fullkey=key+":zaplist"+(keytype? ":"+keytype : "");
	var savelist=function() { var p=setValue(fullkey,list);
							  if (!list.length && GM.deleteValue) p=GM.deleteValue(fullkey);
							  //log("saved zaplist fullkey",fullkey,", list:",list,"getval");
							  return p;
							};
	var readlist=function() { return getValue(fullkey,[]); }; 
	var list;   //console.log("zap inited:",key,keytype);
	
	this.add=async function(str,kl) {
		log("zaplist add, str:",str,"in kl:",kl,"this.fullkey:",fullkey);
		if (!!kl != !!keytype) return;
		list.push(str);
		if((await getValue(key+":erasedElems","")).split(/,/).includes(str)) {
			await savelist();
		} else { log("pop goes the attempt");list.pop();}
	};
	this.contains=function(jqobjOrStr){
		//log("zap check if list contains obj:",jqobjOrStr,"within its \nlist:",list,"FUll key",fullkey);
		if (list.length==0) return;
		if (jqobjOrStr.attr) jqobjOrStr=jqobjOrStr.attr("selmatch-sfswe");
		if (list.indexOf(jqobjOrStr) != -1)
			return keytype||"zap";
	};
	this.rm=function(str) {
		var i=list.indexOf(str);
		if (i!=-1)   list.splice(i,1);
		savelist();
	};
	this.update=async function() { // If sels removed from main list also remove from zaplists.
		if(!list) list=await readlist();
		//log("zaplist.update key:",fullkey,"read list:",list);
		//if (list.length==0) return;
		var strs_ar=getHidElemsCmd().split(/,/);
		list=list.filter(function (lel) {
			return strs_ar.includes(lel);
		});
		savelist();
	};
	this.toString=()=>"[object zaplist]";
}

function moffset(elem, eld=elem[0]) { try{
	if (  elem.find("*").addBack().filter(function(){
		return $(this).css("position").includes("fixed");
	}).length )	                                               //    if (elem.css("position").includes("fixed")) 
		return Object.assign(elem.position(),{position:"fixed"});
	var dominPar=elem.offsetParent()[0]; // gets closest element that is positioned (ie, non static);
	return left_top(elem);
	
	function left_top(elem) {
		var {left,top}= elem.position(); // something sets & unset margintop or left during something here for some reason, margins and floating els may disaffect calc!
		let margl=parseInt(elem.css('margin-left')), margt=parseInt(elem.css('margin-top'));
		//let bordl=parseInt(elem.css('border-left-width')), bordt=parseInt(elem.css('border-top-width'));
		var x = left + margl, y = top + margt;
		do {
			elem = elem.offsetParent();
			if (elem.is(dominPar) || elem.is("html")) break;
			let {left,top}=elem.position(); // something sets & unset margintop during something here for some reason, margins and floating els may disaffect calc!
			x += left; y += top;
		} while (true)
		if (y) y--;
		return { left: x, top: y };
	}
}    catch(e){ console.log("Error moffset",e); }}	      

function assertZ(el){
	var dominPar=el.offsetParent();
	//	var tnames=["transform","-webkit-transform","-webkit-perspective"];
	var tnames=["transform","perspective"];             // jquery adds vendor suffixes, eg -webkit-
	el.parentsUntil(dominPar).addBack().each(function(){
		var that=$(this), tforms=that.css(tnames),tf={}; 
		//log("assertZ dominpar:",dominPar,"tforms:",tforms);
		if(Object.values(tforms).some(x=>!/none/.test(x))) {
			tnames.forEach(name=>tf[name]="none");
			that.css(tf);that.addClass("assertedZ");
		}
		//log("assertz changed css",tforms,"\n",tforms,"now it is: ",that.css(tnames));
	});
}

//
// MutationObserver functions.           Eg, var obs=nodeInsertedListener(document,"#results", myCBfunc);  function myCBfunc(foundArrayOfNodes, DOMparentOfMutation);
// Requires jQuery.
// See https://www.w3.org/TR/dom/#mutationrecord for details of the object sent to the callback for each change.
// Four functions available here:
// Parameter, include_subnodes is to check when .innerHTML add subnodes that do not get included in normal mutation lists, these lower nodes are checked when parameeter is true.
// Return false from callback to ditch out.

function nodeInsertedListener(target, selector, callback, include_subnodes) {
	return nodeMutation(target,selector,callback,1, include_subnodes);
}
function nodeRemovedListener(target, selector, callback, include_subnodes) {
	return nodeMutation(target,selector,callback,2, include_subnodes);
}
function nodeMutationListener(target, selector, callback, include_subnodes) { //inserted or removed, callback's 3rd parameter is true if nodes were removed.
	return nodeMutation(target,selector,callback,3, include_subnodes);
}
function attrModifiedListener(target, selectors, attr, callback) { //attr is array or is not set.  Callback always has same target in each mutrec.
	var attr_obs=new MutationObserver(attrObserver), jQcollection=$(selectors);
	var config={ subtree:true, attributes:true, attributeOldValue:true};
	if (attr) config.attributeFilter=attr;      // an array of attribute names.
	attr_obs.observe(target, config);
	function attrObserver(mutations) {
		var results=mutations.filter(v=>{ return $(v.target).is(selectors)||$(v.target).is(jQcollection);});
		if (results.length) { //Only send mutrecs together if they have the same target and attributeName.
			let pos=0;
			results.reduce((prev_res,curr,i)=>{ if ( prev_res.target!=curr.target || prev_res.attributeName != curr.attributeName) {
				callback(results.slice(pos,i)); pos=i;  } // not really a reduce!
												return curr; 
											  });
			callback(results.slice(pos)); //////////////////<<<<<<<
		} }
	attr_obs.add=function(newmem) { jQcollection=jQcollection.add(newmem); return jQcollection.length; };
	return attr_obs;
}

//
// Internal functions:
function nodeMutation(target, selectors, callback, type, include_subnodes) { //type new ones, 1, removed, 2 or both, 3.
	var node_obs=new MutationObserver(mutantNodesObserver);
	var jQcollection, cnt=0;
	node_obs.observe(target, { subtree: true, childList: true } );
	return node_obs;
	
	function mutantNodesObserver(mutations) { 
		var sel_find, muts, node;
		jQcollection=$(selectors);
		for(var i=0; i<mutations.length; i++) {
			if (type!=2) testNodes(mutations[i].addedNodes, mutations[i].target); // target is node whose children changed
			if (type!=1) testNodes(mutations[i].removedNodes, mutations[i].target,"rmed"); // no longer in DOM.
		}
		function testNodes(nodes, ancestor, rmed) { //non jQ use, document.querySelectorAll()
			if (nodes.length==0) return;
			var results=[], subresults=$();
			for (var j=0,node; node=nodes[j], j<nodes.length;j++) {
				if (node.nodeType!=1) continue;
				if (jQcollection.is(node)) results.push(node);
				if (include_subnodes) subresults=subresults.add($(node).find(jQcollection));
			}
			results=results.concat(subresults.toArray());
			if (results.length) callback(results, ancestor, rmed);
		} //testNodes()
	};
} 
//
// End MutationObserver functions.  Usage example, var obs=nodeInsertedListener(document,"div.results", myCBfunc);  function myCBfunc(foundArrayOfNodes, ancestorOfMutation);
//

function manimate(objs,[css_attr,target_val,suffix,delay],interval,noOf_subintervals,CB) { // CB is invoked once, at end.  $.animate max-ed out cpu for 30 secs or so.
	var len=objs.length,cnt=0,i,random_element=3;
	if (!len) return false;
	var maxi=objs.length-1, subinterval=interval/noOf_subintervals,
		init_int=parseInt(objs[0].style[css_attr]), // assume same initital position and same units/suffix for all objs.
		m=(target_val-init_int)/noOf_subintervals,
		linear=(v,i)=>init_int+m*(i+1),	// quad=(v,i)=>Math.min(target_val_int,init_int+(5/3)*Math.pow(i+1,2)-(5/3)*(i+1)),	// combo=(v,i)=>quad(v,i)/2+linear(v,i)/2,
		plotvals=new Uint32Array(noOf_subintervals).map(linear);
	//console.log("manimate() targets:",objs," requestAnimationFrame:",css_attr,"currval:",objs.css(css_attr),target_val,interval,noOf_subintervals,CB,objs,"plotvals:",plotvals);

	subinterval+=random(-subinterval/random_element,subinterval/random_element);  /// Random element +/- 1/random_element.
	if (delay) setTimeout(x=>i=setInterval(eppursimuove,subinterval,objs),delay);
	else i=setInterval(eppursimuove,subinterval,objs);
	function eppursimuove(that,b,c) {try{
		requestAnimationFrame(tstamp=>objs.css(css_attr,plotvals[cnt]+suffix));
		if (++cnt==noOf_subintervals) {     
			clearInterval(i);  
			CB && CB.call(that[1]);
		}
	} catch(e){log("WebEraser eppursimuove(), error@",Elineno(e),e);}}
} //manimate()

async function regcmds(){
	var reg_args;
	if(!regcmds.done) {
		reg_args=["Erase Web Elements ["+(elems_to_be_hid?"some erased":"none erased")+"]", eraseElementsCmd,"","", "E"];
		if(!GM_registerMenuCommand(...reg_args))  // from GM4_registerMenuCommand_Submenu_JS_Module, if there, undefined, else from gm4-polyfill which returns the menuitem DOM object.
			GM.registerMenuCommand(...reg_args);  // from gm4-polyfill.  It sets body contextmenu style menu.
		var ctrl_e_ON=await getValue("eraseElems_ctrlE",false);
		if(ctrl_e_ON) $(window).keypress(function(e) {
			if (!e.ctrlKey || e.key!="e") return;
			setTimeout(function(){salert("Invoking web erasure function.");},300);
			inner_eraseElements("fromCtrlE");
		});
		
		reg_args=["Set ctrl-e to invoke WebEraser now"+(ctrl_e_ON ? "[on]" : "[off]"), function(){
			ctrl_e_ON^=true;
			setValue("eraseElems_ctrlE",ctrl_e_ON);
			alert("Ctrl-e function is now "+(ctrl_e_ON?"enabled":"disabled")+".  When pages load the erase function is invoked.  However, if the webpage is unusual "
				+"it may delay this erasure, ctrl-E can be typed to invoke the erasure at any time when "
				+"ctrl-e function is enabled.  Select again from menu to toggle");
		},"","", ""];
		if(!GM_registerMenuCommand(...reg_args))
			GM.registerMenuCommand(...reg_args);
		regcmds.done=1;
	}// endif ! regcmds.done
	if (regcmds.done==2 || $(".Web-Eraser-ed").length == 0) return; 
	reg_args=["Clear All WebErasures here on page & site; reloads page.",async function(){
		await deleteValue(website+":erasedElems");
		await deleteValue(webpage+":erasedElems");
		location=location;
	}];
	if(!GM_registerMenuCommand(...reg_args))
		GM.registerMenuCommand(...reg_args);
	regcmds.done=2;
} // regcmds()

function setValue(n,v) { 
	if (!v && GM.deleteValue) return GM.deleteValue(n);
	else return GM.setValue(n,JSON.stringify(v)); 
}
async function getValue(n,v) { var r1,res=await GM.getValue(n,JSON.stringify(v)); try {
	r1=JSON.parse(res); return r1; } catch(e) { console.log("Error in parse of res:"+res+".Value:"+v+".  Error:",e); return v; } }

function random(min,max) {
	return Math.floor(Math.random() * ((max+1) - min)) + min;
}

function timer() { //console.time() and console.timeEnd() not working at the mo, so tstamp sent with each console.log
	// Use with eg, time("start"); ... time("end"); // Each call to time()  for from start and from previous call to time().
	//if (window!=window.parent || timer.log) return;
	if (timer.log) return; // aleady started
	var originalLogger = console.log;
	timer.log=originalLogger;
	console.log = function () {
		if (!timer.begin) {
			timer.begin=Date.now();
			timer.last_time=timer.begin;
			originalLogger.call(timer.begin,">>>>Init timer "+location.pathname+":");
		}
		var args=Array.from(arguments);
		var tstamp=Date.now();
		var sdiff=tstamp-timer.begin, ldiff=tstamp-timer.last_time;
		args.unshift(sdiff+"ms, "+ldiff+"ms\t");
		timer.last_time=tstamp;

		originalLogger.apply(this, args);
	};
}

function logger2() {
	var originalLogger = console.log;
	logger2.log=originalLogger;
	console.log = function () {
		//alert(Array.from(arguments));
		var roll="";
		for (var i=0;i<arguments.length;i++)
			roll+=arguments[i]+" ";
		document.body.innerHTML+=roll+"<br>";
		//originalLogger.apply(this, arguments);
	};
	// var originalInfo = console.info;
	// logger2.info=originalInfo;
	// console.info = function () {
	// 	//alert(Array.from(arguments));
	// 	document.body.innerHTML+=Array.from(arguments);
	// 	originalInfo.apply(this, arguments);
	// };
	// var originalError = console.error;
	// logger2.error=originalError;
	// console.error = function () {
	// 	//alert(Array.from(arguments));
	// 	document.body.innerHTML+=Array.from(arguments);
	// 	originalError.apply(this, arguments);
	// };
}

function logger() {
	$(document).dblclick(outputlogger);
	var originalLogger = console.log;
	logger.log=originalLogger;
	console.log = function () {
		if (!logger.this) logger.this=this;
		// Do your custom logging logic
		var argq=$(document).data("loggerq");
		var args=Array.from(arguments);
		if (!argq) argq=[];
		if (document.readyState!=logger.state) {
			argq.push(document.readyState+":");
			logger.state=document.readyState;
		}
		argq.push(args);
		$(document).data("loggerq",argq);
		
		args.push(document.readyState);
		originalLogger.apply(this, args);
	};
} //logger()

function csscmp(prevval, newval) {try{
	var that=arguments.callee;
	var covered={}, roll="";
	for (let i in prevval) {
		covered[i]=1;
		if (newval[i]===undefined) roll+="Removed: "+i+"="+prevval[i]+" ";
		else if (prevval[i]!=newval[i]) roll+="Changed: "+prevval[i]+" to: "+newval[i]+" ";
	}
	for (let i in newval) if (!covered[i]) roll+="Added: "+i+"="+newval[i]+" ";
	return roll||"Same";
}catch(e) {console.error("csscmp Error",e.lineNumber,e);}}

function nodeInfo(node1,plevel,...nodes) { // show DOM node info or if name/value object list name=value
	//console.log("nodeInfo stack:",logStack());
	if (node1==undefined || node1.length==0) return;
	plevel=plevel||1;
	if (isNaN(plevel) && plevel) { nodes.unshift(node1,plevel); plevel=1; }
	else nodes.unshift(node1);
	plevel--;
	return nodes.map(node=> {
		if (!node || typeof node=="string") return node;
		if (node && node.attr) node=node[0];
		if (node && node.appendChild) {
			let classn=node.className ? node.className.replace("Web-Eraser-ed","") : "";
			return node ? node.tagName.toLowerCase() + classn.replace(/^\b|\s+(?=\w+)/gi, ".").trim() + (node.id||"").replace(/^\s*\b\s*/,"#")
				+ (plevel>0 ? "<" + nodeInfo(node.parentNode,plevel):"")
			: "<empty>";
		}
		else if (node && node.cssText) return node.cssText;
		else
			return ""+Object.entries(node)      // entries => array of 2 member arrays [[member name,value]...]
			.filter(x=> isNaN(x[0]) && x[1] )  //Only name value members of object converted to string.
			.map(x=>x[0]+":"+x[1]).join(", ");
	}).join(" ");
}
//selector(node,node.parentNode,0,0,"Web-Eraser-ed").replace(/^html>body>/,""); }

function outputlogger() {
	var originalLogger=logger.log;
	var that=logger.this;
	
	var argq=$(document).data("loggerq");
	originalLogger.call(that,"===============Logger Output==========================");
	argq.forEach(function(v){
		originalLogger.call(that,v); //this changes in forEach in this case!
	}); // originalLogger.apply(this,argq);
	originalLogger.call(that,"===============End Logger Output=======================");
	return false;
};

function logStack(fileToo) { // deepest first.
	var res="", e=new Error;
	var s=e.stack.split("\n");
	if (fileToo) res="Stack of callers:\n\t\t"; //+s[1].split("@")[0]+"():\n\t\t"
	for (var i=1;i<s.length-1;i++)
		res+=s[i].split("@")[0]+"() "+s[i].split(":").slice(-2)+"\n";
	return !fileToo ? res : {Stack:s[0]+"\n"+res}; 
}

function Ppositions(el, incl_self,not_pos_break="") { 
	el=$(el); var roll="\n\n";
	var els=el.parents();
	if (incl_self) els=els.add(el).reverse();
	els.each(function(){
		var pos=$(this).css("position");
		roll+=this.tagName+" "+pos+"\n";
		if (! pos.includes(not_pos_break)) return false;
		//       /^((?!relative).)*$/   matches any string, or line w/o \n, not containing the str "relative"
	});
	return roll;
}

function ttimer(stage) { 
	return; //!! for profiling only.
	if(window==window.parent) {
		console.time("----from "+stage);
		if(ttimer.last_stage) console.timeEnd(ttimer.last_stage); // print to console: "tTimer[n]: [num]ms"

		if(ttimer.last_stage) console.log("\t----to "+stage);
		ttimer.last_stage="----from "+stage;
	}
}

function escapeCatch(cbfunc,perm) { // Usage: call first time to install listener & add a callback for keydown of escape key.  Optionally then call many times adding callback functions.
	var that=escapeCatch;
	if(!that.flist || that.flist.length==0) {
		that.flist=[cbfunc];
		window.addEventListener("keydown", subfunc, true);
		function subfunc(e) { 
			if (e.which == 27)  {
				console.log("escape",perm,"this is:",this);
				that.flist.forEach(func=>func());
				if(perm) return;
				window.removeEventListener("keydown", subfunc, true); 
				that.flist=[];
			}
		};
	} else
		if(cbfunc) { that.flist.push(cbfunc); return; }
}


function summarize(longstr, max=160)  {
	longstr=longstr.toString();
	if (longstr.length<=max) return longstr;
	max=(max-3)/2;
	var begin=longstr.substr(0,max);
	var end=longstr.substr(longstr.length-max,max);
	return begin+" ...●●●●... "+end;
}

function jqueryui_dialog_css() {
	return ".ui-dialog-content,.ui-dialog,.ui-dialog textarea { font-size: 12px; font-family: Arial,Helvetica,sans-serif; border: 1px solid #757575; "
		+"background:whitesmoke; color:#335; padding:12px;margin:5px;} "
		+".ui-dialog-buttonpane {  width:94%; background:whitesmoke; font-size: 10px; cursor:move; border: 1px solid #ddd; overflow:hidden; } "
		+".ui-dialog-buttonpane button { background: #f0f0e0; }"
		+".ui-dialog-buttonset { float:right; } "
		+".ui-widget-overlay { background: #aaaaaa none repeat scroll 0 0; opacity: 0.3;height: 100%; left: 0;position: fixed;  top: 0; width: 100%;}"
		+".ui-button,.ui-widget-content { text-align:left; color:#333; border: solid 1px #757575; padding: 6px 13px;margin: 4px 3px 4px 0;} "
		+".ui-corner-all,.ui-dialog-buttonpane {border-bottom-left-radius:30px;}"
		+".ui-button:hover { background-color: #ededed;color:#333; } "
		+".ui-button { background-color: #f6f6f6; color:#333; }"
		+".ui-dialog {position:absolute;padding:3px;outline:none;}"
		+".ui-resizable-handle { position:absolute; cursor: url(data:image/svg+xml;base64,"
		+"iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAAAAACo4kLRAAAACXBIWXMAAAsTAAALEwEAmpwYAAABAUlEQVQY022RsWrCYACEvz9EK1HQCilYu+jWdNKlj9BNN1/Cp/IBFHTMExihdTCIm0sR26W6KNHkvw6lunjLjffdnXn7fG0/PzzeG0A/m+/Ve/REB3CL/laStn7RBTpOG0iTXgWg0ktSoO20DJDv5gBy3TxgWkQFAG+QSdnAAyhErMtuFSiN0nRUAqpuec2x2V/4YOr7fd2AH/ebR+zhbMOaCWJrF4GphfZ8sEhSNm3EVrJxY5pJkhGAkjtzNRxuyAGws2Ap0DKYWYDbQRek3e6K9A8/TNPhBf5mzbEBvDCTpCz0ADN25gJOkzPAeXICNL85spu8/N0B8LDafK0+ouQXfemVYVtdIewAAAAASUVORK5CYII="
		+") 10 10, row-resize; } .ui-resizable-sw {bottom:5px;left:5px;}"
		+".ui-resizable-w, .ui-resizable-e { width:10px;height:100%;top:-5px;} .ui-resizable-n, .ui-resizable-s { width:100%;height:10px;} .ui-resizable-n {top:-5px; } .ui-resizable-w {left:-5px; } .ui-resizable-e {right:-5px; }"
		+ (str=>str+str.replace(/-moz-/g,"-webkit-"))(
			//	    ".sfswe-content :-moz-any(div,input) { font-size:13px;padding:6px;margin:4px 3px 4px 0;color:#333; opacity:1;  }"
			".sfswe-content :-moz-any(div,input) { font-size:13px;padding:0px;margin: 0;color:#333; opacity:1;  }" //background:whitesmoke; 
				+".sfswe-content :-moz-any(span) { font-size:13px;padding:0;margin:0;color:#333;}"
				+".sfswe-content :-moz-any(a,a:visited)    { color:#333;text-decoration:underline; padding:0;margin:0;}"
				+".sfswe-content :-webkit-any(a,a:visited) { color:#333;text-decoration:underline; padding:0;margin:0;}"
		)  +".sfswe-content a:hover {opacity:0.5;}"
		+".ui-tooltip { font-size: 7px; }"
		+".sfswe-ticks * {font-size:11px;padding:0px;margin:2px;}"
		.replace(/\.ui/g,".sfswe-sprompt .ui"); //gives namespace of .sfswe-prompt
}

function environInit(environ) { // returns false if GM environment is there, otherwise it calls main when ready and immediately returns true.
	environ.plat_chrome=false; environ.plat_msedge=false;        //chrome standalone, ie, not under tamper in chrome.	// environ.plat_msedge=/Edge[\d./]+$/i.test(navigator.userAgent);
	if (/Chrome/.test(navigator.userAgent)) environ.plat_chrome=true;
	environ.plat_mac = /^Mac/.test(navigator.platform);

	try { environ.nonGMmode= (typeof GM == "undefined"); } // || "Barychelidae"!=GM_getValue("arachnoidal","Barychelidae"); }
	catch(e) { environ.nonGMmode=true; }; //eg, chromium stadalone

	//environ.nonjQ = !window.jQuery || parseFloat(jQuery.fn.jquery) < 3.1;
	
	if (nonGMmode){ // chromium bare, ie, w/o tamper.
		console.info("WebEraser userscript in non GM_ mode at "+location.href, "typeof GM:",typeof GM, "nonGMmode",nonGMmode);
		environ.unsafeWindow=window;
		environ.old_GM_getValue=environ.GM_getValue;
		try { localStorage["anothervariable"]=32; }	catch(e) {
			window.nostorage=true;
			if(!iframe) console.error("No local storage, no GM storage, use Tampermonkey to include this script on page:",location.href);
			window.localStorage={};
		}
		//if(!window.nostorage) console.log("Have local storage",localStorage.anothervariable);
		environ.GM_getValue=function(a,b) { return localStorage[a]||b; };
		environ.GM_setValue=function(a,b) { localStorage[a]=b; };
		environ.GM_getResourceURL=function(url) {
			var ext="Dbl"; if (url.endsWith("Orig")) ext=".orig"; else if (url.endsWith("Xsm")) ext="ExSm"; else if (url.endsWith("Trpl")) ext="Trpl";
			return "https://raw.githubusercontent.com/SloaneFox/imgstore/master/whiteCurtains"+ ext +".jpg";
		};
		//environ.GM_registerMenuCommand=x=>null;
		environ.GM_addStyle=function(cssSheet) { $("head").append("<style>"+cssSheet+"</style>"); };
		environ.uneval=function(x) { return "("+JSON.stringify(x)+")";  }; //Diff is that uneval brackets string and json excludes code only data allowed in json.
		var xhr_queue=[], xhr=new XMLHttpRequest();
		xhr.onload=x=> { //arrow function means this remains window not xhr (as a function would).
			//console.log(xhr.responseURL,"onload to eval in window, jQuery in window? ",!!window.jQuery,!!window.$,!!this.jQuery);
			var synop=(xhr.response||"").substr(0,40);
			try {
				eval.call(window,xhr.response); } catch(e) {  console.error("Can't eval Error:"+e,".  Response:",xhr.response?xhr.response.substr(0,60)+"[60chars]":"No response text",x,xhr,", Queue:",xhr_queue); }
			if (xhr_queue.length) {  xhr.open('GET', xhr_queue.shift()); xhr.send(); }
			else if (!iframe) main.call(window); //////////////////
			
		};
		xhr.onerror=e=> {
			console.log("W/e XHR Error: "+e,", E:",e,"XHR:",xhr,"After error queue:",xhr_queue);
			if (xhr_queue.length) xhr.open('GET', xhr_queue.shift()); xhr.send();
		};
		var jq_versions_prior={ 
			core: parseFloat(environ.$ && environ.$.fn && environ.$.fn.jquery) || 0,
			ui: parseFloat(environ.$ && environ.$.ui && environ.$.ui.version) || 0 
		};
		
		if(jq_versions_prior.core < 1.7)
			xhr_queue.push("https://code.jquery.com/jquery-1.7.2.js");
		if(jq_versions_prior.ui < 1.12)
			xhr_queue.push("https://code.jquery.com/ui/1.12.1/jquery-ui.js");
		xhr_queue.push("https://raw.githubusercontent.com/SloaneFox/code/master/gm4-polyfill-1.0.1.js");
		xhr_queue.push("https://raw.githubusercontent.com/SloaneFox/code/master/gm-popup-menus-1.3.7.js");
		xhr_queue.push("https://raw.githubusercontent.com/SloaneFox/code/master/sfs-utils-0.1.5.js");
		xhr.open('GET', xhr_queue.shift()); xhr.send();
		return true; 
	} else return false;              //if (nonGM || nonJQ)
}
ttimer("end globs setup");

