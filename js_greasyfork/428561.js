// ==UserScript==
// @name		Download Vimeo
// @version		1.0.1
// @description	Display download (source) links for Vimeo videos
// @namespace	bp
// @author		Benjamin Philipp <dev [at - please don't spam] benjamin-philipp.com>
// @include		/^(https?:\/\/(www\.)?vimeo\.[a-zA-Z]{2,10}\/\d+([\/?#].*)?)|(https?:\/\/player\.vimeo\.com\/video\/\d+([\/?#].*)?)$/
// @require 	http://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @run-at		document-body
// @grant		GM_xmlhttpRequest
// @connect		*
// @downloadURL https://update.greasyfork.org/scripts/428561/Download%20Vimeo.user.js
// @updateURL https://update.greasyfork.org/scripts/428561/Download%20Vimeo.meta.js
// ==/UserScript==

/* globals $, GM_info, GM_xmlhttpRequest, debugging, waitFor */

var maxTries=40; // try to find the config script or insert the links a maximum of n times
var interval=500; // interval in ms before the above actions are tried again, if they fail.

var rex = {
	embed: /^https?:\/\/player\.vimeo\.com\/video\/\d+([\/?#].*)?$/i,
	onsite: /^https?:\/\/(www\.)?vimeo\.[a-zA-Z]{2,10}\/\d+([\/?#].*)?$/i
}; // RegEx to check which kind of site we're on: embedded video page or main video page on Vimeo?

const prefix = GM_info.script.name;
function main(){
	$("head").append(
`<style>
.vp-controls .bpDownloads{
	/* opacity: 0.3; */
	transition: opacity 0.5s;
	font-size: 12pt;
}
.vp-controls .bpDownloads:hover{
	opacity: 1;
}
.vp-controls .bpDownloads h3{
	color: #ccc;
	background: #333;
	display: block;
	margin: 0;
	padding: 6px 10px;
	font-size: 15px;
	border-radius: 3px;
	transition: all 0.5s;
}
.vp-controls .bpDownloads:hover h3{
	padding: 10px;
	border-radius: 0;
}
.vp-controls .bpDownloads a{
	background: #333;
	color: #ddd;
	color: #fff;
	text-decoration: none;
	display: block;
	margin: 0;
	padding: 0 10px;
	height: 0;
	transition: all 0.5s;
	box-sizing: content-box;
	overflow: hidden;
}
.vp-controls .bpDownloads:hover a{
	height: 1rem;
	padding: 10px;
}
.vp-controls .bpDownloads a:hover{
	background: #000;
}
</style>`);
	
	var isEmbed = rex.embed.test(location.href);
	if(isEmbed){
		log("is embedded vimeo");
		getScript(function(s){
	//		log("callback", s);
			var links = s.request.files.progressive;
			links.sort(function(a,b){return a.height - b.height;});
	//		log(links);
			insertLinks(links, "#player");
		});
	}
	else{
		log("is on vimeo site");
		waitFor("#main .player[data-config-url]", function(o){
			o.each(function(){
				var player = $(this);
				var configUrl = player.attr("data-config-url");
				log("Config URL:", configUrl);
				GM_xmlhttpRequest({
					url: configUrl,
					method: "GET",
					timeout: 15000,
					
					onload: function(res){
//						log("got:", [res.responseText], res);
						var cfg = JSON.parse(res.responseText);
						var links = cfg.request.files.progressive;
						links.sort(function(a,b){return a.height - b.height;});
				//		log(links);
						insertLinks(links, player);
					},
					onerror: function(res){
						log({error: "Error loading page", page: configUrl});
					},
					ontimeout: function(res){
						log({error: "Connection timed out", page: configUrl});
					}
				});
			});
		});
		
	}
}

function insertLinks(links, player){
	var str = "";
	for(let l of links){
		str += "<a href='" + l.url + "'><b>" + l.quality + " " + l.mime + "</b> (" + l.width + "x" + l.height + ")</a>";
	}
	str = "<div class='bpDownloads'><h3>Download</h3>" + str + "</div>";
//	log(str);
	makeSureIsInserted(str, ".bpDownloads", player, ".vp-controls-wrapper .vp-controls");
}

function makeSureIsInserted(o, sel, container, targetSel=false, tries=0){
	var findIn = document;
	var target = container;
	if(targetSel){
		findIn = $(container);
		target = targetSel;
	}
	waitFor({sel: target, findIn: findIn, cb: function(){
		var exist=$(target).children(sel);
		if(!exist || exist.length<=0){
	//		log("not in target, insert", exist);
			$(target).append(o);
		}
		if(tries<maxTries)
			setTimeout(function(){
				makeSureIsInserted(o, sel, container, targetSel, tries+1);
			}, interval);
	}, cbFail: function(){log("Failed to find target for insertion");}});
}

function getScript(cb, tries=0){
	var scripts = $("body>script");
	log("try getting config script", scripts);
	var gotit=false;
	if(scripts && scripts.length>=1){
		scripts.each(function(){
//			log(this);
			var str = $(this).html();
			var rex = /var\s+config\s*=\s*(\{.*?"files"\s*:.*?"progressive"\s*:.+?\.mp4.+?\})\s*?;/i;
			var m = str.match(rex);
			if(m && m.length>=2){
//				log("matches config");
//				log(m[1]);
				var cfg = JSON.parse(m[1]); //eval(m[1]);
				gotit=true;
				return cb(cfg);
			}
		});
	}
	if(gotit)
		return;
	if(tries>maxTries)
		return log("Could not get script");
//	log("will retry");
	setTimeout(function(){
		getScript(cb, tries+1);
	}, interval);
}

function parseSources(s){
	
}

function log(...args){
	if("undefined" != typeof(prefix) && !!prefix)
		args = [prefix + ":", ...args];
	if("undefined" != typeof(debugging) && !!debugging)
		args = [...args, new Error().stack.replace(/^\s*(Error|Stack trace):?\n/gi, "").replace(/^([^\n]*\n)/, "\n")];
	console.log(...args);
}

// UGH, why must GreasyFork block custom @includes >.<
class eleWaiter{
	constructor(sel, cb, cbFail=null, findIn="document", delay=500, maxTries=50, alwaysOn=false, autoStart=true, debug = false){
		this.sel = "";
		this.cb = null;
		this.cbFail = null;
		this.findIn = "document";
		this.delay = 500;
		this.maxTries = 50;
		this.alwaysOn = false;
		this.autoStart = true;
		this.debug = false;

		this.__running = false;
		this.__tries = 0;
		this.__timer = 0;
		this.__jqo = {};

		if(typeof sel == "object"){
//			log("got object");
			Object.assign(this, sel);
		}
		else{
			this.sel = sel;
			this.cb = cb;
			if(cbFail!== undefined || cbFail!== null)
			this.cbFail = cbFail;
			if(findIn!== undefined || findIn!== null)
				this.findIn = findIn;
			this.delay = delay;
			this.maxTries = maxTries;
			this.alwaysOn = alwaysOn;
			this.autoStart = autoStart;
			this.debug = debug;
		}
		if(this.debug){
			if(typeof this.debug != "object"){
				this.debug = {
					prefix: this.debug + " ",
					level: 1
				};
			}
			else{
				if(!this.debug.prefix)
					this.debug.prefix = "";
				else
					this.debug.prefix += " ";
			
				if(!this.debug.level)
					this.debug.level = 1;
			}
		}
//		this.log(this.cb);
		this.log(this);
		if(this.autoStart)
			this.__wait();
	}
	
	log(...args){
		if(!this.debug)
			return;
		
		if(typeof args == "object" && args.length>=2 && typeof args[args.length-1] == "string" && args[args.length-1].toLowerCase().indexOf("loglevel:")===0){
			var level = args[args.length-1].substr(9)*1;
			if(level>this.debug.level){
				return;
			}
			args.pop();
		}
		console.log(this.debug.prefix + "EleWaiter:", ...args);
	}

	start(){
		if(!this.__running){
			this.log("Start waiting", this.findIn, this.sel);
			this.__wait();
		}
	}
	stop(){
		clearTimeout(this.__timer);
		this.__running = false;
	}

	__wait(){
//		if(!this.findIn)
//			this.findIn = document;
		if(this.findIn == "document" && !!document)
			this.findIn = document;
		
		this.__running = true;
		if(this.maxTries!=-1)
			this.__tries++;
		var triesLeft = this.alwaysOn?1:(this.maxTries - this.__tries);
		this.log("tries left:", triesLeft, "loglevel:3");
		this.__jqo = $(this.findIn).find(this.sel);

		if(this.__jqo.length<=0){
			if(this.debug && this.debug.level>2 || !this.alwaysOn)
				this.log("Not found: " + this.sel);
			if(triesLeft!==0){
				this.__timer = setTimeout(function(){this.__wait();}.bind(this), this.delay);
			}
			else
				this.__result(false);
			return;
		}

		this.__result(this.__jqo);

		if(this.alwaysOn){
			this.log("Always on, repeat", "loglevel:3");
			this.__timer = setTimeout(function(){this.__wait();}.bind(this), this.delay);
		}
	}
	__result(success=false){
		if(this.debug.level>2 || !this.alwaysOn)
			this.log("Result:", success);
		this.__running = false;
		if(success){
			if(this.cb!==undefined && typeof this.cb == "function")
				this.cb(this.__jqo);
			else
				console.log("Warning: callback cb not function", this.cb);
		}
		else{
			if(this.cbFail!==undefined && typeof this.cbFail == "function")
				this.cbFail(this.__jqo);
		}
	}
}
if("undefined" === typeof eleWaiters){ // jshint ignore:line
	var eleWaiters ={}; // jshint ignore:line
}

function waitFor(sel, cb, cbFail=null, findIn="document", delay=500, maxTries=50, alwaysOn=false, debug = false){ // 2021-01-29
	return new eleWaiter(sel, cb, cbFail, findIn, delay, maxTries, alwaysOn, true, debug);
}

setTimeout(main, 0);