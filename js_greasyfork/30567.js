// ==UserScript==
// @name           Make Bookmarklets from Javascript URLs
// @namespace      MBFU
// @description    When it sees a link to a userscript or general Javascript URL, adds a Bookmarklet besides it, which you can drag to your toolbar to load the script when you next need it (running outside Greasemonkey of course).
// @include        http://hwi.ath.cx/*/gm_scripts/*
// @include        http://hwi.ath.cx/*/userscripts/*
// @include        http://*userscripts.org/*
// @include        https://*userscripts.org/*
// @include        http://openuserjs.org/*
// @include        https://openuserjs.org/*
// @include        http://greasyfork.org/*
// @include        https://greasyfork.org/*
// @include        http://*/*
// @include        https://*/*
// @exclude        http://hwi.ath.cx/code/other/gm_scripts/joeys_userscripts_and_bookmarklets_overview.html
// @exclude        http://neuralyte.org/~joey/gm_scripts/joeys_userscripts_and_bookmarklets_overview.html
// @grant          none
// @version        1.2.5
// @downloadURL https://update.greasyfork.org/scripts/30567/Make%20Bookmarklets%20from%20Javascript%20URLs.user.js
// @updateURL https://update.greasyfork.org/scripts/30567/Make%20Bookmarklets%20from%20Javascript%20URLs.meta.js
// ==/UserScript==
// BUG: We had (i%32) in a userscript (DLT) but when this was turned into a bookmarklet and dragged into Chrome, the debugger showed it had become (i2), causing the script to error with "i2 is not defined".  Changing the code to (i % 32) worked around the problem.
// TODO: All links with using dummy=random should change the value on mouseover/mousemove/click, so they can be re-used live without refreshing the page.
//       Static bookmarklets could timeout and re-build after ... 10 seconds?  ^^
// Most people will NOT want the NoCache version.  It's only useful for script developers.
// Firefox/Greasemonkey does not like to install scripts ending ".user.js?dummy=123"
// But in Chrome it is a useful way to prevent the script from being cached when you are developing it.
function buildLiveBookmarklet(link){var neverCache=preventBrowserFromCachingBookmarklets,scriptsToLoad=defaultScripts.slice(0),url=link.href.replace(/^http[s]*:/,"//");scriptsToLoad.push(url);var neverCacheStr=neverCache?"+'?dummy='+new Date().getTime()":"",toRun="(function(){\n";
// Chrome has no .toSource() or uneval(), so we use JSON.  :f
toRun+="var scriptsToLoad="+JSON.stringify(scriptsToLoad)+";\n",toRun+="function loadNext() {\n",toRun+="  if (scriptsToLoad.length == 0) { return; }\n",toRun+="  var next = scriptsToLoad.shift();\n",toRun+="  var newScript = document.createElement('script');\n",toRun+="  newScript.src = next"+neverCacheStr+";\n",toRun+="  newScript.onload = loadNext;\n",toRun+="  newScript.onerror = function(e){ console.error('Problem loading script: '+next,e); };\n",toRun+="  document.body.appendChild(newScript);\n",toRun+="}\n",toRun+="loadNext();\n",toRun+="})(); (void 0);";var name=getNameFromFilename(link.href),newLink=document.createElement("A");newLink.href="javascript:"+toRun,newLink.textContent=name,newLink.title=newLink.href;var newContainer=document.createElement("div");
// newContainer.style.whiteSpace = 'nowrap';
newContainer.appendChild(document.createTextNode("(Live Bookmarklet: ")),newContainer.appendChild(newLink);
// link.parentNode.insertBefore(newContainer,link.nextSibling);
return newContainer.appendChild(document.createTextNode(")")),newContainer.style.paddingLeft="8px",newContainer}function reportMessage(msg){console.log(msg)}function reportWarning(msg){console.warn(msg)}function reportError(msg){console.error(msg)}function doesItCompile(code){try{new Function(code)}catch(e){return!1}return!0}/* For more bugs try putting (function(){ ... })(); wrapper around WikiIndent! */
function fixComments(line){
//// Clear // comment line
line=line.replace(/^[ \t]*\/\/.*/g,"");
//// Wrap // comment in /*...*/ (Dangerous! if comment contains a */ !)
// line = line.replace(/^([ \t]*)\/\/(.*)/g,'$1/*$2*/');
//// Clear trailing comment (after a few chars we deem sensible)
//// This still doesn't handle some valid cases.
var trailingComment=/([;{}()\[\],\. \t])\s*\/\/.*/g;if(trailingComment.exec(line)){/*
		if (line.match(worrying)) {
			reportWarning("Warning: trailingComment matches: "+hasTrailingComment);
		}
		*/
var compiledBefore=doesItCompile(line),newLine=line.replace(trailingComment,"$1"),compilesAfter=doesItCompile(newLine);compiledBefore&&!compilesAfter?reportWarning("Aborted // stripping on: "+line):
// Accept changes
line=newLine}return line}function cleanupSource(source){
// console.log("lines: "+lines.length);
for(var lines=source.split("\n"),i=0;i<lines.length;i++)lines[i]=fixComments(lines[i]);
// source = lines.join('\n');
// console.log("new length: "+source.length);
//// For Bookmarklet Builder's reformatter:
return source=lines.join(" "),source=source.replace("(function","( function","g")}
// My first "promise":
function getSourceFor(url){return{then:function(handleResponse){function handlerFn(res){var source=res.responseText;handleResponse(source)}function onErrorFn(res){reportError("Failed to load "+url+": HTTP "+res.status)}
// Prevent caching of this resource.  I found this was needed one time on Chrome!
// It probably doesn't need to be linked to preventCachingOfInstallScripts or preventBrowserFromCachingBookmarklets.
url+="?dummy="+Math.random(),console.log("Loading "+url),getURLThen(url,handlerFn,onErrorFn)}}}/* To avoid a multitude of premature network requests, the bookmarklet is not actually "compiled" until mouseover. */
function buildStaticBookmarklet(link){function whenGot(staticSrc,report){var extraText="";
// Does it parse?
try{new Function(staticSrc);newLink.style.color=""}catch(e){var msg="PARSE FAILED";
// Firefox has this:
e.lineNumber&&(msg+=" on line "+e.lineNumber),msg+=":",console.log("["+href+"] "+msg,e),newLink.title=msg+" "+e,newLink.style.color="red",// color as error
window.lastParseError=e}if(newLink.href="javascript:"+staticSrc,addDateToStaticBookmarklets){var dateStr=(new Date).toISOString().substring(0,10);newLink.textContent=newLink.textContent+" ("+dateStr+")"}report.needsGMFallbacks?extraText+=" uses GM":extraText+=" GM free",extraText&&newLink.parentNode.insertBefore(document.createTextNode(extraText),newLink.nextSibling),
// Just in case the browser is dumb, force it to re-analyse the link.
newLink.parentNode.insertBefore(newLink,newLink.nextSibling)}var newLink=document.createElement("a");newLink.textContent=getNameFromFilename(link.href);var newContainer=document.createElement("div");
// newContainer.style.whiteSpace = 'nowrap';
// Experimental:
newContainer.appendChild(document.createTextNode("(Static Bookmarklet: ")),newContainer.appendChild(newLink),newContainer.appendChild(document.createTextNode(")")),newContainer.style.paddingLeft="8px",newLink.style.textDecoration="underline",
// newLink.style.color = '#000080';
newLink.style.color="#333366";
// link.parentNode.insertBefore(newContainer,link.nextSibling);
// The href may change before we fire (e.g. if dummy is appended) so we make a copy.
var href=link.href;
// setTimeout(function(){
// ,2000 * staticsRequested);
return newLink.onmouseover=function(){getStaticBookmarkletFromUserscript(href,whenGot),newLink.style.color="#ff7700",newLink.onmouseover=null},newContainer}function getStaticBookmarkletFromUserscript(href,callbackGotStatic){function loadScripts(scriptsToLoad,callbackScriptsLoaded){if(0===scriptsToLoad.length)return callbackScriptsLoaded([]);for(var scriptSources=[],numLoaded=0,i=0;i<scriptsToLoad.length;i++)!function(i){getSourceFor(scriptsToLoad[i]).then(function(source){source||reportError("Failed to acquire source for: "+href),scriptSources[i]=source,++numLoaded==scriptsToLoad.length&&callbackScriptsLoaded(scriptSources)})}(i)}getSourceFor(href).then(function(userscriptSource){function allSourcesLoaded(scriptSources){scriptSources.push(userscriptSource);for(var toRun="",i=0;i<scriptSources.length;i++)scriptSources[i]||reportError("Expected contents of "+scriptsToLoad[i]+" but got: "+scriptSources[i]),toRun+="(function(){\n",toRun+=cleanupSource(scriptSources[i]),toRun+="})();\n";callbackGotStatic(toRun+="(void 0);",{needsGMFallbacks:needsGMFallbacks})}var needsGMFallbacks=!userscriptSource.match("\\n//\\s*@grant\\s+none\\s*\\n"),scriptsToLoad=needsGMFallbacks?defaultScripts.slice(0):[];loadScripts(scriptsToLoad,allSourcesLoaded)})}
// In this case, link points to a folder containing a userscript.
// We guess the userscript's name from the folder's name.
function addQuickInstall(link){"TD"==link.parentNode.tagName&&(link.parentNode.style.width="60%");var br2=document.createElement("br");link.parentNode.insertBefore(br2,link.nextSibling);var br=document.createElement("br");link.parentNode.insertBefore(br,link.nextSibling.nextSibling);var name=link.href.match(/([^\/]*)\/$/)[1],newLink=document.createElement("A");newLink.href=link.href+name+".user.js",newLink.textContent="Install Userscript";// name+".user.js";
var newContainer=document.createElement("span");newContainer.appendChild(document.createTextNode("      [")),newContainer.appendChild(newLink),newContainer.appendChild(document.createTextNode("]")),newContainer.style.paddingLeft="8px",link.parentNode.insertBefore(newContainer,br),link.style.color="black",link.style.fontWeight="bold",newContainer.appendChild(buildLiveBookmarklet(newLink)),newContainer.appendChild(buildStaticBookmarklet(newLink)),newContainer.appendChild(buildLiveUserscript(newLink)),popupSourceOnHover(newLink),
// Do this after the other two builders have used the .href
preventCachingOfInstallScripts&&(newLink.href=newLink.href+"?dummy="+(new Date).getTime())}function getURLThen(url,handlerFn,onErrorFn){var req=new XMLHttpRequest;req.open("get",url,!0),req.onreadystatechange=function(aEvt){if(4==req.readyState)if(200==req.status)
// Got it
handlerFn(req);else{var msg="XHR failed with status "+req.status+"\n";window.status=msg,onErrorFn(req),console.warn(msg)}},req.send(null)}function loadSourceViewer(url,newLink,evt){function reportToFrame(msg){frame.appendChild(document.createTextNode(msg))}
// window.lastEVT = evt;
frame&&frame.parentNode&&frame.parentNode.removeChild(frame),frame=document.createElement("div");
// This doesn't work.  Loading it directly into the iframe triggers Greasemonkey to install it!
//frame.src = url;
// What we need to do is get the script with an XHR, then place it into the div.
// This seems to fire immediately in Firefox!
var cleanup=function(evt){frame.parentNode.removeChild(frame),document.body.removeEventListener("click",cleanup,!1)};document.body.addEventListener("click",cleanup,!1),getURLThen(url,function(res){
// We were using pre instead of div to get monospace like <tt> or <code>
// However since we are commonly reading the description, sans seems better.
var displayDiv=document.createElement("div");displayDiv.style.fontSize="0.8em",displayDiv.style.whiteSpace="pre-wrap";var displayCode=document.createElement("pre");for(displayCode.textContent=res.responseText,displayCode.style.maxHeight="100%",displayCode.style.overflow="auto",displayDiv.appendChild(displayCode);frame.firstChild;)frame.removeChild(frame.firstChild);frame.appendChild(displayDiv),null!=typeof Rainbow&&/*
			// Works fine in Chrome, but in Firefox it causes Rainbow to fail with "too much recursion".
			Rainbow.extend('javascript', [
				{
					'name': 'importantcomment',
					'pattern': /(\/\/|\#) @(name|description|include) [\s\S]*?$/gm
				},
			], false);
			*/
setTimeout(function(){displayCode.setAttribute("data-language","javascript"),displayCode.style.fontSize="100%",Rainbow.color(displayCode.parentNode,function(){console.log("Rainbow finished.")})},50);for(var lines=res.responseText.split("\n"),i=0;i<lines.length;i++){var line=lines[i];if(line.match(/@description\s/)){var descr=line.replace(/.*@description\s*/,"");newLink.title=descr;break}}},function(res){reportToFrame("Failed to load "+url+": HTTP "+res.status)}),/*
	frame.style.position = 'fixed';
	frame.style.top = evt.clientY+4+'px';
	frame.style.left = evt.clientX+4+'px';
	*/
// frame.style.position = 'absolute';
// frame.style.top = evt.layerY+12+'px';
// frame.style.left = evt.layerX+12+'px';
// frame.style.top = evt.layerY - window.innerHeight*35/100 + 'px';
// frame.style.left = evt.layerX + 64 + 'px';
// frame.style.width = "70%";
// frame.style.height = "70%";
frame.style.position="fixed",frame.style.right="2%",frame.style.width="50%",frame.style.top="10%",frame.style.height="80%",frame.style.backgroundColor="white",frame.style.color="black",frame.style.padding="8px",frame.style.border="2px solid #555555",document.body.appendChild(frame),reportToFrame("Loading...")}function buildSourceViewer(link){var newLink=document.createElement("A");
// newLink.href = '#';
newLink.textContent="Source",newLink.addEventListener("click",function(e){loadSourceViewer(link.href,newLink,e)},!1);
// TODO: Problem with .user.js files and Chrome:
// In Chrome, opens an empty iframe then the statusbar says it wants to install an extension.
// For Chrome we could try: frame.src = "view-source:"+...;
var extra=document.createElement("span");
// link.parentNode.insertBefore(extra,link.nextSibling);
return extra.appendChild(document.createTextNode("[")),extra.appendChild(newLink),extra.appendChild(document.createTextNode("]")),extra.style.paddingLeft="8px",extra}function popupSourceOnHover(link){function startHover(evt){stopHover(evt),hoverTimer=setTimeout(function(){loadSourceViewer(link.href,link,evt),stopHover(evt)},1500)}function stopHover(evt){clearTimeout(hoverTimer),hoverTimer=null}var hoverTimer=null;link.addEventListener("mouseover",startHover,!1),link.addEventListener("mouseout",stopHover,!1),
// If they click on it before waiting to hover, they probably don't want the popup:
link.addEventListener("click",stopHover,!1)}function buildLiveUserscript(link){
//// This isn't working any more.  data:// lost its power circa 2006 due to abuse.
//// Create a clickable link that returns a sort-of file to the browser using the "data:" protocol.
//// That file would be a new userscript for installation.
//// We can generate the contents of this new userscript at run-time.
//// The current one we generate runs (no @includes), and loads the latest userscript from its website via script injection.
/* DISABLED
	// BUG: data:{...}.user.js does not interest my Chromium
	var name = getNameFromFilename(link.href)+" Live!";
	var name = "Install LiveLoader";
	var whatToRun = '(function(){\n'
		+ '  var ns = document.createElement("script");\n'
		+ '  ns.src = "' + encodeURI(getCanonicalUrl(link.href)) + '";\n'
		+ '  document.getElementsByTagName("head")[0].appendChild(ns);\n'
		+ '})();\n';
	var newLink = document.createElement("a");
	newLink.textContent = name;
	newLink.href = "data:text/javascript;charset=utf-8,"
		+ "// ==UserScript==%0A"
		+ "// @namespace LiveLoader%0A"
		+ "// @name " + name + " LIVE%0A"
		+ "// @description Loads " +name+ " userscript live from " + link.href + "%0A"
		+ "// ==/UserScript==%0A"
		+ "%0A"
		+ encodeURIComponent(whatToRun) + "%0A"
		+ "//.user.js";
	var extra = document.createElement("span");
	extra.appendChild(document.createTextNode("["));
	extra.appendChild(newLink);
	extra.appendChild(document.createTextNode("]"));
	extra.style.paddingLeft = '8px';
	link.parentNode.insertBefore(extra,link.nextSibling);
	*/
return document.createTextNode("")}function getCanonicalUrl(url){return"/"==url.substring(0,1)&&(url=document.location.protocol+"://"+document.location.domain+"/"+url),url.match("://")||(url=document.location.href.match("^[^?]*/")+url),url}function getNameFromFilename(href){var isUserscript=href.match(/\.user\.js$/),name=href.match(/[^\/]*$/)[0].replace(/\.user\.js$/,"");
// The scripts on userscripts.org do not have their name in the filename,
// but we can get the name from the page title!
if(name=decodeURIComponent(name),"userscripts.org"==document.location.host&&document.location.pathname=="/scripts/show/"+name){var scriptID=name;name=document.title.replace(/ for Greasemonkey/,""),
// Optionally, include id in name:
name+=" ("+scriptID+")"}if(isUserscript){for(var words=name.split("_"),i=0;i<words.length;i++)if(words[i].length){var c=words[i].charCodeAt(0);c>=97&&c<=122&&(c=c-97+65,words[i]=String.fromCharCode(c)+words[i].substring(1))}name=words.join(" ")}else
// It's just a Javascript file
name="Load "+name;return name}function insert(newElem){where.parentNode.insertBefore(newElem,where.nextSibling),where=newElem}var inGoogleChrome=window&&window.navigator&&window.navigator.vendor.match(/Google/),preventBrowserFromCachingBookmarklets=inGoogleChrome,preventCachingOfInstallScripts=inGoogleChrome,addGreasemonkeyLibToBookmarklets=!0,addDateToStaticBookmarklets=!0,defaultScripts=[],includeGMCompat=addGreasemonkeyLibToBookmarklets;includeGMCompat&&
// defaultScripts.push("http://hwi.ath.cx/code/other/gm_scripts/fallbackgmapi/fallbackgmapi.user.js");
defaultScripts.push("//neuralyte.org/~joey/gm_scripts/fallbackgmapi/fallbackgmapi.user.js");
//// We used to process backwards (for less height recalculation).
//// But this was messing up maxStaticsToRequest.
//// But now backwards processing is restored, to avoid producing multiple bookmarks!
for(var sourcesLoaded={},frame=null,links=document.getElementsByTagName("A"),i=links.length;i--;){
//for (var i=0;i<links.length;i++) {
var link=links[i];if("false"!==link.getAttribute("data-make-bookmarklet")){
// If we see a direct link to a user script, create buttons for it.
if(link.href.match(/\.js$/)){// \.user\.js
var where=link;insert(buildLiveBookmarklet(link)),insert(buildStaticBookmarklet(link)),insert(buildLiveUserscript(link)),insert(buildSourceViewer(link))}
// If the current page looks like a Greasemonkey Userscript Folder, then
// create an installer for every subfolder (assuming a script is inside it).
document.location.pathname.match(/\/(gm_scripts|userscripts)\//)&&link.href.match(/\/$/)&&"Parent Directory"!==link.textContent&&addQuickInstall(link)}}