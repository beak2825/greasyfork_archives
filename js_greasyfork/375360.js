/* sfs-utils.js v0.1.5 */

// ==UserLibrary==
// @pseudoHeader
// @name        SFS Utils
// @version     0.1.5
// ==/UserLibrary==

// Script must have a version of: 
//
//           // @require     https://raw.githubusercontent.com/SloaneFox/code/master/gm4-polyfill-1.0.1.js
//
// in header to use this module userscript.  Also for use of cmdrepl console function below grant of GM register command is required.

// See below for functions:
//    function log(arguments);  // prints correct line number under GM4, due to scope wrapper the given one is incorrect.
//    function cmdrepl(e,immediate_flag);  //  Launch a js console from any place in the code &/or register one from a menu.
//    function logNewNodes();    // Logs to console any new nodes (uses a mutation observer).
//    var sname;   // Set to GM info's script.name.
//

function logError(msg,e) { console.error("Error,",msg,".  On line:",Elineno(e),"lineno offset:",-log.lineoffset,{Error:e}); }
function typeofObj(unknown_obj){ return ({}).toString.call(unknown_obj).substr(8).slice(0,-1); }
function Elineno(e) { return e.lineNumber-log.lineoffset; }

function objInfo(obj) {

	switch(typeofObj(obj)) {
		
	case "Event": return "Event:"+obj.type+" "+objInfo(obj.target);
	case "Function": return obj.toString().substr(0,200);
	case "String":
	case "Number": return obj;
	default: 		
		var node=obj;
		if(node.jquery) node=node[0];
		if (!node) return "<empty>";
		return (node.tagName||node.nodeName)+" "+(node.id?"#"+node.id:"")
			+(node.className?node.className:"").replace(/\b(?=\w)/g,".");
	}
}

function log() { // Prints lineno of logging not this lineno.   //if (!Plat_Chrome) old_GM_log(t);};
	var args=Array.from(arguments), lineno=parseInt(logStack(0,1))-log.lineoffset, pnewline,
		locator="[ "+lineno +":"+ sname+ " "+( window!=parent? ("wname:"+window.name? window.name:"-") +" @"+location+", rstate: "+document.readyState:"") + " ]\t";
	args.unshift(locator);
	console.log.apply(console, args);
	// In general it is console.log("%c a msg and another %c meggss","float:right","float:left;",anobj,"text","etc");

	function logStack(fileToo, lineno_of_callee) { // deepest first.
		var res="", e=new Error;
		var s=e.stack.split("\n");                        //if (fileToo) res="Stack of callers:\n\t\t"; //+s[1].split("@")[0]+"():\n\t\t"
		if (lineno_of_callee) return (s[2].match(/:\d+(?=:)/)||[""])[0].substr(1); // Just give line number of one who called the function that called this, ie, geives lineno -f callee.
		for (var i=1;i<s.length-1;i++)
			res+=s[i].split("@")[0]+"() "+s[i].split(":").slice(-2)+"\n";
		return !fileToo ? res : {Stack:s[0]+"\n"+res}; 
	}
};

if (log.lineoffset==undefined) { // cos ff58 has linon at 360 + script lineno.
	var ver=0,offset=0,ver_pos=navigator.userAgent.indexOf("Firefox/");
	if (ver_pos!=-1) {
		let v=parseInt(navigator.userAgent.substr(ver_pos+8));
		if (v>=58 && v<60) offset=360; 
		if (v>=60)         offset=492;
	}
	log.lineoffset=offset;
}

function logNewNodes() {
	new MutationObserver((mutations, observer) => {try{
		for (m of mutations) for (n of m.addedNodes) {
			console.log("Node added",n.nodeName,(n.nodeType!=3 ? n : n.textContent.substr(0,40)+"..."));
			if(n.nodeName=="IFRAME") { 
				$(n).removeAttr("sandbox"); 
				n.addEventListener('load', function (e) {console.log("Loaded IFRAME",location,n,"this:",this);});
			}
		}
	}catch(e){console.error("logNewNodes error",e.lineNumber,e);}})
		.observe(document.documentElement, {childList: true,subtree:true});
}

// Call cmdreply to get js console at that point.   Pass reg in to register cmd console as a menu command.
// If cant register cmd, invoke immediately.

var sname= typeof GM != "undefined" ?  GM.info && GM.info.script.name : "noscript name";

async function cmdrepl(e={},immediate,...args) {               // When called from GM menu e is set to event.
	if(!immediate && !cmdrepl.regdone) {          // if (typeof GM_registerMenuCommand!="undefined" && document.body)
		cmdrepl.regdone=true;
		setTimeout(function(){ 
			//console.log("in sfs_utils GM.","abc"+GM_registerMenuCommand);
			GM_registerMenuCommand("JS repl",cmdrepl); GM.registerMenuCommand("JS repl",cmdrepl); // reg in both 
		},2000);
		return;
	}
	ls={}; 
	try { let tmp=localStorage.reply; ls=localStorage; } catch(e){}
	var res=e.message||sname+", enter command:",reply=ls.reply||"cmd";
	while(reply) {
		reply=prompt(res,reply);
		if(!reply) break;
		ls.reply=reply;                   
		try{ res=await eval(reply); console.log(reply,"==>",res);res="==>"+res; } catch(e) {console.log("cmd err",e); cmdrepl(e);}
	}
}


