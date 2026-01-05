// ==UserScript==
// @name Translator Tooltip
// @id Translator_Tooltip
// @version 1.0.1
// @description Translates selected text, by Google, into a tooltip
// @author Martin Brinkmann modified/reposted by Sonny Razzano
// @namespace srazzano
// @license MIT
// @include /https?://.*/
// @homepageURL https://github.com/srazzano/Translator_Tooltip
// @supportURL https://github.com/srazzano
// @icon https://camo.githubusercontent.com/f143dcd15145ee38f7b466089f4cca53b05904b3/68747470733a2f2f6d656469616372752e73682f4655626f4b447032467975642e706e67
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_log
// @grant GM_xmlhttpRequest
// @require http://code.jquery.com/jquery-1.7.2.min.js
// @require http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.13/jquery-ui.min.js
// @downloadURL https://update.greasyfork.org/scripts/4480/Translator%20Tooltip.user.js
// @updateURL https://update.greasyfork.org/scripts/4480/Translator%20Tooltip.meta.js
// ==/UserScript==

const HREF_NO = 'javascript:void(0)';
const MAX_Z = 2147483640;
var imgLookup, txtSel, currentURL, languagesGoogle, timerWindowResize, initialized = false, COLOR_BG1, COLOR_BG2, COLOR_TEXT, COLOR_LINK;
var colorschemes = [
  {name:'Default', bg1:'#FFFF77', bg2:'#FFFFAA', link:'#0000FF', text:'#333333'},
  {name:'Dark', bg1:'#333', bg2:'#555', link:'#ddd', text:'#eee'},
  {name:'Dark green', bg1:'#284030', bg2:'#5D7350', link:'#FAFCB6', text:'#E2F0A8'},
  {name:'Dark blue', bg1:'#2D4358', bg2:'#3A5065', link:'#b5cce3', text:'#b5cce3'},       
  {name:'Dark red', bg1:'#751310', bg2:'#9C1B19', link:'#FAEFE0', text:'#FAEFE0'},
  {name:'Light green', bg1:'#4F724F', bg2:'#649064', link:'#EDF8ED', text:'#EDF8ED'},       
  {name:'Light blue', bg1:'#4D6680', bg2:'#647A90', link:'#EDF2F8', text:'#EDF2F8'}
];

var scriptID = 'Translator_Tooltip', scriptVER = '1.0.1', scriptHOME = 'https://github.com/srazzano/Translator_Tooltip';
var scriptMETA = 'https://raw.githubusercontent.com/srazzano/Translator_Tooltip/master/Translator_Tooltip.meta.js';
var scriptUSER = 'https://raw.githubusercontent.com/srazzano/Translator_Tooltip/master/Translator_Tooltip.user.js';

ScriptUpdater = function() {
  function initVars(id, currentVersion, callbackfn, notice, noticeEnabled) {
    this.scriptId = id;
    this.scriptCurrentVersion = typeof currentVersion != "undefined" ? currentVersion.toString() : false;
    this.callbackFunction = typeof callbackfn == "function" ? callbackfn : false;
    this.useNotice = notice;
    this.forceNoticeEnabled = noticeEnabled;
    this.interval = getInterval();
    this.lastCheck = getLastCheck();
  }
  
  function checkRemoteScript() {
    if (scriptCurrentVersion && !alreadyOffered(scriptCurrentVersion)) addOffer(scriptCurrentVersion);
    var d = new Date;
    GM_xmlhttpRequest({
      method: "GET", 
      url: scriptMETA, 
      headers: {"User-agent": "Mozilla/5.0", "Accept": "text/html"}, 
      onload: function(response) {handleResponse(response.responseText);}
    });
    GM_setValue("lastCheck", d.getTime());
  }
  
  function handleResponse(response) {
    this.meta = parseHeaders(response);
    GM_setValue("versionAvailable", meta.version);
    if (forceNoticeEnabled || scriptCurrentVersion != meta.version && useNotice) {
      if (!alreadyOffered(meta.version)) addOffer(meta.version);
      showNotice();
    }
    if (typeof callbackFunction == "function") callbackFunction(meta.version);
  }
  
  function parseHeaders(metadataBlock) {
    var source = metadataBlock;
    var headers = {};
    var tmp = source.match(/\/\/ ==UserScript==((.|\n|\r)*?)\/\/ ==\/UserScript==/);
    if (tmp) {
      var lines = tmp[0].match(/@(.*?)(\n|\r)/g);
      for (var i = 0; i < lines.length; i++) {
        var tmp = lines[i].match(/^@([^\s]*?)\s+(.*)/);
        var key = tmp[1], value = tmp[2];
        if (headers[key] && !(headers[key] instanceof Array)) headers[key] = new Array(headers[key]);
        if (headers[key] instanceof Array) headers[key].push(value);
        else headers[key] = value;
    } }
    return headers;
  }
  
  function showNotice() {
    if (meta.name && meta.version) {
      var s = "#ScriptUpdater-" + scriptId + "-";
      GM_addStyle(s + 
        "Mask{background-color:#000!important;height:100%!important;left:0!important;opacity:.7!important;position:fixed!important;top:0!important;width:100%!important;z-index:9000!important}" + s +
        "BodyWrapper{left:0!important;max-height:auto!important;max-width:auto!important;min-height:auto!important;min-width:auto!important;position:absolute!important;top:0!important;width:100%!important;\
z-index:9010!important}" + s +
        "Body *{background:none!important;border:none!important;color:#333!important;font-family:sans-serif!important;font-size:12px!important;font-weight:normal!important;margin:0!important;padding:0!important;\
text-decoration:none!important;}" + s +
        "Body{background:#f9f9f9!important;border:none!important;-moz-border-radius:6px!important;-webkit-border-radius:6px!important;border-radius:5px!important;color:#333!important;cursor:default!important;\
font-family:sans-serif!important;font-size:14px!important;left:35%!important;margin:auto!important;padding:0 0 8px 0!important;position:fixed!important;text-align:left!important;top:125px!important;width:500px!important;\
z-index:9010!important}" + s +
        "Body > *{background:#f9f9f9!important}" + s +
        "Body p a{border-bottom:1px solid!important;color:#009!important;font-weight:bold!important;margin:0 .5em!important;padding:0!important;text-decoration:none!important}" + s +
        "Body strong{font-weight:bold!important}" + s +
        "Body h1{background-color:#444!important;border-radius:4px 4px 0 0!important;font-size:13px!important;font-weight:bold!important;margin-bottom:14px!important;padding:4px!important;text-align:center!important}" + s +
        "Body h2{font-weight:bold!important;margin:.5em 1em!important}" + s +
        "Body h1 img:first-child{position:relative!important;right:4px!important;top:2px!important;vertical-align:middle!important;}" + s +
        "Body h1 img:not(:first-child){float:left!important;margin: 2px 0 0 2px !important;}" + s +
        "Body h1 a{color:tan!important;font-size:17px!important;font-weight:bold!important;left:-10px!important;position:relative!important;text-decoration:none!important;text-shadow:1px 1px 2px #000!important}" + s +
        "Body a:hover{text-decoration:underline!important}" + s +
        "Body table{margin:0 1em!important;width:auto!important}" + s +
        "Body table tr th{line-height:2em!important;padding-left:2em!important;padding-right:.5em!important;text-align:right!important}" + s +
        "Body table tr td{font-weight:bold!important;line-height:2em!important}" + s +
        "Body p{font-size:12px!important;font-weight:normal!important;margin:1em!important}" + s +
        "CloseButton{background-color:#ccc!important;background-image:url(" + icons.close + ")!important;background-position:4px center!important;background-repeat:no-repeat!important}" + s +
        "InstallButton{background-color:#ccc!important;background-image:url(" + icons.install + ")!important;background-position:4px center!important;background-repeat:no-repeat!important}" + s +
        "History{border:1px inset #999!important;margin:0 1em 1em 1em!important;max-height:150px!important;overflow-y:auto!important;padding:0 1em 1em!important;width:448px!important}" + s +
        "History ul{margin-left:2em!important}" + s +
        "Close{cursor:pointer!important;float:right!important}" + s +
        "Footer{margin:.75em 1em!important}" + s +
        "Footer input{border:1px outset #666!important;border-radius:3px!important;-moz-border-radius:3px!important;-webkit-border-radius:3px!important;cursor:pointer!important;float:right!important;\
margin-left:.5em!important;padding:4px 4px 4px 22px!important}" + s +
        "Footer input:hover{background-color:#fff!important}" + s +
        "Footer select{border:1px inset #666!important}"
      );
      var noticeBg = $c('div', {id:'ScriptUpdater-' + scriptId + '-Mask'});
      document.body.appendChild(noticeBg);
      var noticeWrapper = $c('div', {id:'ScriptUpdater-' + scriptId + '-BodyWrapper'});
      var html = new Array;
      var notice = $c('div', {id:'ScriptUpdater-' + scriptId + '-Body'});
      html.push('<h1><img id="ScriptUpdater-' + scriptId + '-Close" src="' + icons.close + '" title="Close"/><img id="ScriptUpdater-' + scriptId + '-USO" src="' + icons.uso + '"/>');
      html.push('<a href="' + scriptHOME + '" target="_blank" title="Script Homepage">Translator Tooltip Updater</a></h1>');
      if (!forceNoticeEnabled) {
        html.push('<p>There is a new version of <strong>');
        html.push('<a href="' + scriptUSER + '" target="_blank" title="Direct Download">' + meta.name + '</a>');
        html.push('</strong> available for installation.</p>');
      } else {
        html.push('<p><strong>');
        html.push('<a href="' + scriptUSER + '" target="_blank" title="Direct Download">' + meta.name + '</a>');
        html.push('</strong></p>');
      }
      if (scriptCurrentVersion) html.push('<p>You currently have version <strong>' + scriptCurrentVersion + '</strong> installed. The latest version is <strong>' + meta.version + '</strong></p>');
      if (meta.history) {
        html.push('<h2>Version History:</h2><div id="ScriptUpdater-' + scriptId + '-History">');
        var history = new Array;
        var version, desc;
        if (typeof meta.history != "string") for (var i = 0; i < meta.history.length; i++) {
          var tmp = meta.history[i].match(/(\S+)\s+(.*)$/);
          version = tmp[1];
          change = tmp[2];
          history[version] = typeof history[version] == "undefined" ? new Array : history[version];
          history[version].push(change);
        } else {
          var tmp = meta.history.match(/(\S+)\s+(.*)$/);
          version = tmp[1];
          change = tmp[2];
          history[version] = typeof history[version] == "undefined" ? new Array : history[version];
          history[version].push(change);
        }
        for (var v in history) {
          html.push('<div style="margin-top:.75em;"><strong>v' + v + "</strong></div><ul>");
          for(var i = 0; i < history[v].length; i++) html.push("<li>" + history[v][i] + "</li>");
          html.push("</ul>");
        }
        html.push("</div>");
      }
      html.push('<div id="ScriptUpdater-' + scriptId + '-Footer"><input type="button" id="ScriptUpdater-' + scriptId + '-CloseButton" value="Close"/>');
      html.push('<input type="button" id="ScriptUpdater-' + scriptId + '-InstallButton" value="Install"/>Check for updates every ');
      html.push('<select id="ScriptUpdater-' + scriptId + '-Interval"><option value="3600000"> Hour </option><option value="21600000"> 6 Hours </option><option value="43200000"> 12 Hours </option>');
      html.push('<option value="86400000"> Day </option><option value="259200000"> 3 Days </option><option value="604800000"> Week </option><option value="0">Never</option></select></div>');
      notice.innerHTML = html.join("");
      noticeWrapper.appendChild(notice);
      document.body.appendChild(noticeWrapper);
      $("#ScriptUpdater-" + scriptId + "-Close").addEventListener("click", closeNotice, true);
      $("#ScriptUpdater-" + scriptId + "-CloseButton").addEventListener("click", closeNotice, true);
      $("#ScriptUpdater-" + scriptId + "-InstallButton").addEventListener("click", function() {
        setTimeout(closeNotice, 500); document.location = typeof installUrl == "string" ? installUrl : scriptUSER}, true);
      window.addEventListener("keyup", keyUpHandler, true);
      var selector = $("#ScriptUpdater-" + scriptId + "-Interval");
      for (var i = 0; i < selector.options.length; i++) if (selector.options[i].value.toString() == interval.toString()) selector.options[i].selected = true;
      selector.addEventListener("change", function() {interval = this.value; GM_setValue("interval", parseInt(interval))}, true);
      noticeWrapper.style.height = document.documentElement.clientHeight + "px";
      $("#ScriptUpdater-" + scriptId + "-Mask").style.height = window.scrollMaxY + window.innerHeight + "px";
  } }
  
  function closeNotice() {
    document.body.removeChild($("#ScriptUpdater-" + scriptId + "-BodyWrapper"));
    document.body.removeChild($("#ScriptUpdater-" + scriptId + "-Mask"));
    window.removeEventListener("keyup", keyUpHandler, true);
  }
  
  function keyUpHandler(e) {
    if (e.keyCode == 27) closeNotice();
  }
  
  function alreadyOffered(version) {
    var offers = getOffers();
    if (offers.length == 0) {
      addOffer(version);
      return true;
    }
    for (var i = 0; i < offers.length; i++) if (version.toString() == offers[i].toString()) return true;
    return false;
  }
  
  function getOffers() {
    var offers = GM_getValue("versionsOffered");
    return typeof offers == "undefined" || typeof offers.length == "undefined" || typeof offers.push == "undefined" ? new Array : offers;
  }
  
  function addOffer(version) {
    var offers = getOffers();
    offers.push(version);
    GM_setValue("versionsOffered", offers);
  }
  
  function getInterval() {
    var val = GM_getValue("interval");
    return typeof val == "undefined" || !val.toString().match(/^\d+$/) ? 3600000 : parseInt(val.toString());
  }
  
  function getLastCheck() {
    var val = GM_getValue("lastCheck");
    return typeof val == "undefined" || !val.toString().match(/^\d+$/) ? 0 : parseInt(val.toString());
  }
  
  var icons = {
    install: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAKCSURBVHjaYjTL3lPI\
wMAgD8Q2QKwExDwMDP9ZgDQjw38GMGBmYmRgAuL///8x/PvH8IGNleHO95+/O09N81wDEEAghVqzS61SQOrVpdnBev7/+8/w6w8Q//4H1szJzsTAyMjA8OX7P4YvP/7y33v+xWDhzrszzLK28QMEEBNQvS1I1/pTnxiA+oC2/GfI\
m3waaBOQA9TFygKxHWTgd6CBf/4xMP5lYGKJd1cW5mRnmwoQQCADJEC2gjT8Bsr+/gNx928gn4WZAWwASO77L6gc0IIDlz8zsLEyM3z/+YcNIIBAXuD68w/scLAiEGACufc/SDPQ6UD4A2jz95//gS78D3YliH729gfIMEaAAGIB\
BdhfoAAQMfyE2l6bYADWDEQMv//+Z/j2E+R0cAACzQXCfyDX/AUHKkAAgUP7318GsNOaF5wHehvoZ0aY7QwMINf9AXoNGiFgICAgBDSAGawHIIBYGMBOApn+l0FMXBoUGZD4A+uAOhlo4///UC+AnAG05PfvP6DoYgAIIJALGP7+\
BRsGBoxwBgPEyf8h4QOh/oPlQU7//RuSLgACCGzAn7//GKBWgv0ICjgGsEKIf8H+Btv+F5xGgCyGn7//g10AEECgQGT4+w/i5LpIGQZiQOnsq8BwgbgEIIBYQFH2Fxa6QEMmHkvBqznPcjbQy3/ACQukASCAWCB+/Q8OcRCwkokl\
6IJ/QBv//gYnPwaAAGIB+u0/0AuMsDA49mQxXs0msnZAF/wFpw+QXoAAYgFa/uDXn3+Kxspc4AxTYD2HoAvEeYEu+Au28D1AADGaZe3qBxqkBnSBJdBIQZCzwFH3/x84kJBpWMxAIv3/ZwZGpssAAQYAIXxui1/HoMEAAAAASUVO\
RK5CYII%3D", 
    close: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAD2SURBVHjaxFM7DoMwDH\
2pOESHHgDPcB223gKpAxK34EAMMIe1FCQOgFQxuflARVBSVepQS5Ht2PHn2RHMjF/ohB8p2gSZpprtyxEHX8dGTeMG0A5UlsD5rCSGvF55F4SpqpSm1GmCzPO3LXJy1LXllwvodoMsCpNVy2hbYBjCLRiaZ8u7Dng+QXlu9b4H7n\
cvBmKbwoYBWR4kaXv3YmAMyoEpjv2PdWUHcP1j1ECqFpyj777YA6Yss9KyuEeDaW0cCsCUJMDjYUE8kr5TNuOzC+JiMI5uz2rmJvNWvidwcJXXx8IAuwb6uMqrY2iVgzbx99/4EmAAarFu0IJle5oAAAAASUVORK5CYII%3D", 
    uso: "data:image/png;base64,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\
rkJggg=="
  }; 
  
  return {
    setjsURL: function(url) {
      if (url != "undefined" && typeof url == "string") jsURL = url;
    }, 
    check: function(scriptId, currentVersion, callback) {
      initVars(scriptId, currentVersion, callback, true, false); 
      var d = new Date; 
      if (interval > 0 && d.getTime() - lastCheck > interval) checkRemoteScript();
    }, 
    forceCheck: function(scriptId, currentVersion, callback) {
      initVars(scriptId, currentVersion, callback, true, false); 
      checkRemoteScript();
    }, 
    getLatestVersion: function(scriptId, callback) {
      if (typeof callback != "function") alert("ScriptUpdater error:\n\n scriptUpdater.getLatestVersion() requires a callback function as the second argument"); 
      initVars(scriptId, callback, false, false, false); 
      checkRemoteScript();
    }, 
    forceNotice: function(scriptId, currentVersion, callback) {
      initVars(scriptId, currentVersion, callback, true, true); 
      checkRemoteScript();
    }, 
    checkStored: function() { 
      if (typeof scriptId != "undefined" && typeof scriptCurrentVersion != "undefined") 
        return typeof GM_getValue("versionAvailable") != "undefined" && scriptCurrentVersion.toString() != GM_getValue("versionAvailable").toString(); 
      else return false;
  } }
  
}();

document.addEventListener('mouseup', showLookupIcon, false);
document.addEventListener('mousedown', mousedownCleaning, false);
window.addEventListener('resize', windowResizeHandler, false);

ScriptUpdater.setjsURL(scriptUSER);
ScriptUpdater.check(scriptID, scriptVER);
 
function mousedownCleaning(evt) {
  var divDic = getId('divDic'), divLookup = getId('divLookup');
  if (divDic) {
    if (!clickedInsideID(evt.target, 'divDic')) divDic.parentNode.removeChild(divDic);
  }       
  if (divLookup) divLookup.parentNode.removeChild(divLookup);
}
 
function showLookupIcon(evt) {
  if (evt.ctrlKey && evt.altKey && (!GM_getValue('ctrl') || !GM_getValue('alt'))) return;
	if (evt.ctrlKey ? !GM_getValue('ctrl') : GM_getValue('ctrl')) return;
	if (evt.altKey ? !GM_getValue('alt') : GM_getValue('alt')) return;		
	var divDic = getId('divDic');
	var divLookup = getId('divLookup');
	txtSel = getSelection(evt);
	if (!txtSel || txtSel=="") {
		if (divDic) {
			if (!clickedInsideID(evt.target, 'divDic')) {
				divDic.parentNode.removeChild(divDic);
				deselect();
		} }
		if (divLookup) divLookup.parentNode.removeChild(divLookup);
		return;
	}
	if (divDic) {
		if (!clickedInsideID(evt.target, 'divDic')) {
			divDic.parentNode.removeChild(divDic);
			deselect();
		}
		return;
	}
	if (divLookup) divLookup.parentNode.removeChild(divLookup);
	if (!initialized) {
		initialized = true;
		images();
		if (GM_getValue('opt_youtube') == undefined) {
			GM_setValue('opt_youtube', true);
			GM_setValue('opt_youtube_auto', true);
			GM_setValue('opt_compare', true);
	} }
	css(true);	
	divLookup = createElement('div', {id:'divLookup', style:'top:' + (evt.clientY + window.pageYOffset + 10) + 'px; left:' + (evt.clientX + window.pageXOffset + 10) + 'px;'});
	divLookup.appendChild(imgLookup.cloneNode(false));
	divLookup.addEventListener('mouseover', lookup, false);
	document.body.appendChild(divLookup);
	repositionNode($('#divLookup'));
}
 
function lookup(evt) {
  var divResult = null, divDic = getId('divDic'), divLookup = getId('divLookup'), top = divLookup.style.top, left = divLookup.style.left;
  if (!txtSel || txtSel == "") {
     if (divDic = getId('divDic')) divDic.parentNode.removeChild(divDic);
     return;
  }
  if (divDic = getId('divDic')) divDic.parentNode.removeChild(divDic);
  divLookup.parentNode.removeChild(divLookup);
  divDic = createElement('div', {id:'divDic'});
  divDic.style.top = top;
  divDic.style.left = left;
  divDic.addEventListener('mousedown', dragHandler, false);
  document.body.appendChild(divDic);
  if (GM_getValue('opt_shadow') == true) $(divDic).addClass('classShadowww');
  divResult = createElement('div', {id:'divResult'}, null, 'Loading...');
  divDic.appendChild(divResult);       
  if (txtSel.search(/^\s*https?:\/\//) > -1) {
     divResult.innerHTML = '<a class="gootranslink" href="' + txtSel + '" target="_blank">' + txtSel + '</a>';
     if (GM_getValue('opt_youtube') && isYoutubeLink(txtSel)) return;               
  } else if (txtSel.search(/^\s*\S+(\.\S+)+/) > -1) {
    divResult.innerHTML = '<a class="gootranslink" href="http://' + txtSel + '" target="_blank">' + txtSel + '</a>';
    if (GM_getValue('opt_youtube') && isYoutubeLink(txtSel)) return;
  } else {
    var sl, tl, lang;
    sl = GM_getValue('from') ? GM_getValue('from') : "auto";
    tl = GM_getValue('to') ? GM_getValue('to') : "auto";
    lang = sl + "|" + tl;
    currentURL = "http://www.google.com/translate_t?text=" + txtSel + "&langpair=" + lang;
    GM_xmlhttpRequest({
      method: 'GET',
      url: currentURL,
      onload: function(resp) {
        try {
          extractResultFrames(resp);
        } catch (e) {GM_log(e);}
      }
    });       
  }
  repositionNode($('#divDic'));
  getId('divDic').setAttribute('query', txtSel);
  divDic.appendChild(createElement('span', {id:'spanOtherSearches', title:'search other sites'}, 'mouseover otherSites false', '+'));
  divDic.appendChild(createElement('span', {id:'optionsLink', title:'options', href:HREF_NO}, 'click toggleOptions false', '>>'));
}
 
function quickLookup() {
  getId('divResult').innerHTML = 'Loading...'
  currentURL = "http://www.google.com/translate_t?text=" + $('#divDic').attr('query') + "&langpair=" + getId('optSelLangFrom').value + "|" + getId('optSelLangTo').value;
  GM_xmlhttpRequest({
    method: 'GET',
    url: currentURL,
    onload: function(resp) {
      try {
        extractResultFrames(resp);
      } catch(e) {GM_log(e);}
    }
  });       
}
 
function otherSites(evt) {
  var ul, li, query = getId('divDic').getAttribute('query').replace(/\s+$/,'').replace(/^\s+/, '');
  var sites = [
    {name:'Google', href:'http://www.google.com/search?q=' + query.replace(/\s+/g, '+')},
    {name:'Google Images', href:'http://www.google.com/images?q=' + query.replace(/\s+/g, '+')},
    {name:'The Free Dictionary', href:'http://www.thefreedictionary.com/' + query.replace(/\s+/g, '+')},
    {name:'Urban Dictionary', href:'http://www.urbandictionary.com/define.php?term=' + query.replace(/\s+/g, '+')},
    {name:'Linguee', href:'http://www.linguee.com/search?query=' + query.replace(/\s+/g, '+')},
    {name:'Wikipedia', href:'http://www.wikipedia.org/w/index.php?title=Special%3ASearch&search=' + query.replace(/\s+/g, '+')},
    {name:'IMDb', href:'http://www.imdb.com/find?s=all&q=' + query.replace(/\s+/g, '+')},
    {name:'Youtube', href:'http://www.youtube.com/results?search_query=' + query.replace(/\s+/g, '+')}
  ];
  getId('divDic').appendChild(createElement('br'));
  getId('divDic').appendChild(document.createTextNode('Search "' + (query.match(/^[\s\S]{15}/) ? query.match(/^[\s\S]{15}/)[0] + '...' : query.match(/^[\s\S]+/)[0] ) + '" at:'));
  ul = getId('divDic').appendChild(createElement('ul'));
  for (var i = 0; i < sites.length; i++) {
    li = ul.appendChild(createElement('li'));
    li.appendChild(createElement('a', {class:'gootranslink', target:'_blank', href:sites[i].href}, null, sites[i].name));
  }
  evt.target.parentNode.removeChild(evt.target);
  repositionNode($('#divDic'));
}
 
function extractResultFrames(resp) {       
  var html = resp.responseText.match(/\<body[^\>]*\>([\s\S]+)\<\/body\>/)[1];
  html = html.replace(/\<script[^\<]+\<\/script\>/ig, '');
  html = html.replace(/\<iframe[^\<]+\<\/iframe\>/ig, '');
  var iframe = document.body.appendChild(createElement('iframe', {style:'visibility: hidden;'}));       
  var divExtract = iframe.contentWindow.document.body.appendChild(createElement('div', {id:'divExtract'}, null, html));
  divExtract = document.importNode(divExtract, true);
  iframe.parentNode.removeChild(iframe);
  var arrs = getTag('a', divExtract);
  for (var i = 0; i < arrs.length; i++) {
    arrs[i].setAttribute('target', '_blank');
    arrs[i].setAttribute('class', 'gootranslink');
  }
  var translation = trim(xp('.//span[@id="result_box"]', divExtract)[0].textContent);
  var dict = xp('.//div[@id="gt-res-dict"]', divExtract)[0];
  if (dict) {
    try {
      dict.removeChild(getTag('h3', dict)[0]);
      dict = dict.innerHTML;
    } catch(e) {dict = null;}
  }       
  getId('divResult').innerHTML = '<a class="gootranslink" href="' + currentURL + '" target="_blank">' + translation + '</a>'
    + '<div id="divCompareee" ' + (GM_getValue('opt_compare') == true ? '' : 'style="display: none;"') + '>' + $('#divDic').attr('query') + '</div>';
  if (dict) getId('divResult').innerHTML += '<br><br><div id="dict">' + dict + '</div>';
  repositionNode($('#divDic'));
}
 
function repositionNode(node) {
  var pos = node.offset();
  if (pos == null) return;
  var w = node.width(), h = node.height();
  if (pos.left + w > window.innerWidth + window.pageXOffset) node.css('left', window.innerWidth + window.pageXOffset - w - 25);
  if (pos.top + h > window.innerHeight + window.pageYOffset) node.css('top', window.innerHeight + window.pageYOffset - h - 25);
}
 
function repositionNodeFixed(node, pad) {
  var pos = node.offset();
  if (pos == null) return;
  var w = node.width(), h = node.height();
  if (pos.left + w > window.innerWidth + window.pageXOffset) node.css('left', window.innerWidth- w - (pad?pad:25));
  if (pos.top + h > window.innerHeight + window.pageYOffset) node.css('top', window.innerHeight - h - (pad?pad:25));
}
 
function trim(str) {
  return str.replace(/^\s+/, '').replace(/\s+$/, '');
}
 
function getSelection(evt) {
  var txt = null;
  if (evt && evt.target.nodeName == 'TEXTAREA') txt = evt.target.value.substr(evt.target.selectionStart, evt.target.selectionEnd - evt.target.selectionStart);              
  else if (window.getSelection) txt = window.getSelection();
  else if (document.getSelection) txt = document.getSelection();
  else if (document.selection) txt = document.selection.createRange().text;
  try {
    return txt.toString();
  } catch(e) {return txt;}
}
 
function deselect() {
  try {
    window.getSelection().removeAllRanges();
  } catch(e) {document.selection.empty();}
}
 
function isYoutubeLink(txt) {
  var id, time=null;
  if (txt.search(/youtube\.com\/watch\?/) > -1) id = txt.match(/[\?\&]v\=([^\&]+)/)[1];
  else if (txt.search(/youtu.be\//) > -1) id = txt.match(/youtu.be\/([^\?]+)/)[1];
  else if (txt.search(/youtube\.com\/v\/[^\?]+/) > -1) id = txt.match(/youtube\.com\/v\/([^\?]+)/)[1];
  else return false;
  try {
    time = txt.match(/[\?\&\#](t\=[^\&]+)/)[1];
  } catch(e) {time = null;}
  if (time != null) {
    var h, m, s;
    try {
      h = parseInt(time.match(/(\d+)h/)[1]);
    } catch(e) {h = 0;}
    try {
      m = parseInt(time.match(/(\d+)m/)[1]);
    } catch(e) {m = 0;}
    try {
      s = parseInt(time.match(/(\d+)s/)[1]);
    } catch(e) {s = 0;}
    time = s + (m * 60) + (h * 60 * 60);
  } else {
    if (txt.search(/[\?\&]start\=\d+/) > -1) time = txt.match(/start\=(\d+)/)[1];
  }  
  deselect();       
  if ($('.classDivYoutubeeee[ytvid="' + id + '"]').length > 0) {
    var div = $('.classDivYoutubeeee[ytvid="' + id + '"]:first');
    if (div.hasClass('classYoutubeMinimizeddd')) toggleYoutubeSize({target: div.find('.classtoggleSize:first').get(0)});
    div.effect('shake', {times:2});
    $('#divDic, #divLookup').remove();
    return true;
  }
  var auto = GM_getValue('opt_youtube') == true && GM_getValue('opt_youtube_auto') == true ? 1 : 0;
  var url = 'http://www.youtube.com/v/' + id + '?fs=1&autoplay=' + auto + (time != null ? '&start=' + time : '');
  var pos = $('#divDic').offset();
  var div = $('<div>')
    .attr('ytvid', id)
    .addClass('classDivYoutubeeee')
    .css({backgroundColor:COLOR_BG1, position:'fixed', top:Math.abs(window.pageYOffset - pos.top), left:Math.abs(window.pageXOffset - pos.left), zIndex:MAX_Z, padding:'0 26px', borderRadius:'5px'})
    .appendTo(document.body)
    .append($('<span title="close">').css({float:'right', cursor:'pointer',color:COLOR_LINK, marginLeft:7}).append('\u24E7').click(function(evt) {$(this).parents('.classDivYoutubeeee:first').remove();}))
    .append($('<span class="classtoggleSize" title="toggle size">').css({float:'right', cursor:'pointer', color:COLOR_LINK, marginLeft:7}).append('\u21F2').click(toggleYoutubeSize))       
    .append('<br><object><param name="movie" value="' + url + '"</param><param name="allowFullScreen" value="true"></param><embed src="' + url + '" type="application/x-shockwave-flash" \
allowfullscreen="true" width="425" height="344"></embed></object><br><br>')
    .draggable();
  if (GM_getValue('opt_shadow') == true) div.addClass('classShadowww');
  repositionNodeFixed(div);
  $('#divDic, #divLookup').remove();
  return true;
}
 
function toggleYoutubeSize(evt) {
  var div = $(evt.target).parents('.classDivYoutubeeee:first'), ytlink = div.find('a[href*="youtube.com"]'), pos = div.offset();
  if (!div.hasClass('classYoutubeMinimizeddd')) {
    ytlink.hide();
    div.addClass('classYoutubeMinimizeddd');
    div.attr({prevlefttt: Math.abs(window.pageXOffset - pos.left), prevtoppp: Math.abs(window.pageYOffset - pos.top)});
    div.find('embed').attr({width:'212.5', height:'172'});
    div.css({top:window.innerHeight - div.outerHeight() - 7, left:window.innerWidth - div.outerWidth() - 13});
    if ($('.classYoutubeMinimizeddd').length > 1) {
      var len = $('.classYoutubeMinimizeddd').length, top = div.offset().top, left = div.offset().left;
      left -= (div.outerWidth() + 7) * (len - 1);
      if (left < 0) left = div.offset().left;
      div.css({left:left})
    }
    evt.target.innerHTML = '\u21F1';
  } else {
    ytlink.show();
    div.removeClass('classYoutubeMinimizeddd');
    div.css({top:div.attr('prevtoppp') + 'px', left:div.attr('prevlefttt') + 'px'});
    div.find('embed').attr({width:'425', height:'344'});
    evt.target.innerHTML = '\u21F2';
} }
 
function windowResizeHandler(evt) {
  clearTimeout(timerWindowResize);
  timerWindowResize = setTimeout(windowResized, 333);
}
 
function windowResized(evt) {
  if ($('#divDic,.classDivYoutubeeee').length == 0) return;
  if ($('#divDic').length > 0) repositionNodeFixed($('#divDic'));
  if ($('.classDivYoutubeeee').length > 0) {
    var vids = $('.classDivYoutubeeee');
    for (var i = 0; i < vids.length; i++) repositionNodeFixed(vids.eq(i), 35);
} }
 
function toggleOptions(evt) {
  if (!languagesGoogle)  languagesGoogle = '<option value="auto">Detect language</option><option value="sq">Albanian</option><option value="ar">Arabic</option>\
<option value="bg">Bulgarian</option><option value="ca">Catalan</option><option value="zh-TW">Chinese_TC</option><option value="zh-CN">Chinese</option><option value="hr">Croatian</option>\
<option value="cs">Czech</option><option value="da">Danish</option><option value="nl">Dutch</option><option value="en">English</option><option value="et">Estonian</option>\
<option value="tl">Filipino</option><option value="fi">Finnish</option><option value="fr">French</option><option value="gl">Galician</option><option value="de">German</option>\
<option value="el">Greek</option><option value="iw">Hebrew</option><option value="hi">Hindi</option><option value="hu">Hungarian</option><option value="id">Indonesian</option>\
<option value="it">Italian</option><option value="ja">Japanese</option><option value="ko">Korean</option><option value="lv">Latvian</option><option value="lt">Lithuanian</option>\
<option value="mt">Maltese</option><option value="no">Norwegian</option><option value="pl">Polish</option><option value="pt">Portuguese</option><option value="ro">Romanian</option>\
<option value="ru">Russian</option><option value="sr">Serbian</option><option value="sk">Slovak</option><option value="sl">Slovenian</option><option value="es">Spanish</option>\
<option value="sv">Swedish</option><option value="th">Thai</option><option value="tr">Turkish</option><option value="uk">Ukrainian</option><option value="vi">Vietnamese</option>';
  var divOptions = getId('divOpt');
  if (!divOptions) {
    divOptions = createElement('div', {id:'divOpt'});
    getId('divDic').appendChild(divOptions);
    getId('optionsLink').style.visibility = 'hidden';
    divOptions.appendChild(createElement('span', null, null, 'From:'));
    divOptions.appendChild(createElement('select', {id:'optSelLangFrom'}, null, languagesGoogle));
    getId('optSelLangFrom').value = GM_getValue('from') ? GM_getValue('from') : "auto";
    getId('optSelLangFrom').addEventListener('change', quickLookup, false);
    divOptions.appendChild(createElement('span', null, null, ' To:'));
    divOptions.appendChild(createElement('select', {id:'optSelLangTo'}, null, languagesGoogle));
    getId('optSelLangTo').value = GM_getValue('to') ? GM_getValue('to') : "auto";
    getId('optSelLangTo').addEventListener('change', quickLookup, false);
    divOptions.appendChild(createElement('br'));
    divOptions.appendChild(createElement('br'));
    divOptions.appendChild(createElement('input', {id:'checkCtrl', type:'checkbox'}));
    divOptions.appendChild(createElement('span', null, null, 'Use Ctrl key'));
    getId('checkCtrl').checked = GM_getValue('ctrl');
    divOptions.appendChild(createElement('br'));
    divOptions.appendChild(createElement('input', {id:'checkAlt', type:'checkbox'}));
    divOptions.appendChild(createElement('span', null, null, 'Use Alt key'));
    getId('checkAlt').checked = GM_getValue('alt');
    divOptions.appendChild(createElement('br'));
    divOptions.appendChild(createElement('input', {id:'checkCompare', type:'checkbox'}));
    divOptions.appendChild(createElement('span', null, null, 'Compare translation to original'));
    getId('checkCompare').checked = GM_getValue('opt_compare');
    $('#checkCompare').click(function(evt) {
       if (this.checked) $('#divCompareee').show();
       else $('#divCompareee').hide();
    });
    divOptions.appendChild(createElement('br'));
    divOptions.appendChild(createElement('input', {id:'checkShadowww', type:'checkbox'}));
    divOptions.appendChild(createElement('span', null, null, 'Show box shadow'));
    getId('checkShadowww').checked = GM_getValue('opt_shadow');
    $('#checkShadowww').click(function(evt) {
      if (this.checked) $('#divDic').addClass('classShadowww');
      else $('.classShadowww').removeClass('classShadowww');
    });
    divOptions.appendChild(createElement('br'));
    divOptions.appendChild(createElement('input', {id:'checkYoutubeee', type:'checkbox'}));
    divOptions.appendChild(createElement('span', null, null, 'Preview Youtube links'));
    getId('checkYoutubeee').checked = GM_getValue('opt_youtube');
    $(divOptions).append($('<div id="divOptYoutubeee">')
      .css({display: GM_getValue('opt_youtube') == true ? 'inline' : 'none'})
      .append('&nbsp;&nbsp;&nbsp;&nbsp;<input id="checkYoutubeAutoplayyy" type="checkbox">')
      .append(' autoplay video')
    );
    getId('checkYoutubeAutoplayyy').checked = GM_getValue('opt_youtube_auto');
    $('#checkYoutubeee').click(function(evt) {
      if (this.checked) $('#divOptYoutubeee').show();
      else $('#divOptYoutubeee').hide();
    });
    $(divOptions).append('<br><table id="tablecolorrr"><tr><td>Color schemes:</td><td colspan=2><select id="selectColorSchemesss"><option value=""></option></select>\
<a class="gootranslink" id="spanNewColorSchemeee" statusss="hidden" href="' + HREF_NO + '">customize</span></td></tr><tr style="display:none;"><td>Background 1:</td>\
<td><input type="text" size="10" id="inputbgcolor111" value="' + COLOR_BG1 + '" /></td><td><input class="simplecolorrr" id="bgcolor111" value="' + COLOR_BG1 + '" /></td>\
</tr><tr style="display:none;"><td>Background 2:</td><td><input type="text" size="10" id="inputbgcolor222" value="' + COLOR_BG2 + '" /></td>\
<td><input class="simplecolorrr" id="bgcolor222" value="' + COLOR_BG2 + '" /></td> </tr><tr style="display:none;"><td>Text:</td>\
<td><input type="text" size="10" id="inputtxttt" value="' + COLOR_TEXT + '" /></td><td><input class="simplecolorrr" id="textcolorrr" value="' + COLOR_TEXT + '" /></td></tr>\
<tr style="display:none;"><td>Link:</td> <td><input type="text" size="10" id="inputlinkkk" value="' + COLOR_LINK + '" /></td>\
<td><input class="simplecolorrr" id="linkcolorrr" value="' + COLOR_LINK + '" /></td></tr></table>');
    $('.simplecolorrr').simpleColor({boxWidth:'0px', boxHeight:'0px', buttonClass:'classButtonColorrr'});
    $('#bgcolor111, #bgcolor222, #linkcolorrr, #textcolorrr').change(optColorPickerChanged);
    $('#inputbgcolor111, #inputbgcolor222, #inputlinkkk, #inputtxttt').keyup(optColorInputChanged);
    for (var i = 0; i < colorschemes.length; i++) $('#selectColorSchemesss').append('<option value="' + colorschemes[i].name + '">' + colorschemes[i].name + '</option>');
    $('#selectColorSchemesss').change(changeColorScheme);
    $('#spanNewColorSchemeee').click(function(evt) {
      if ($('#spanNewColorSchemeee').attr('statusss') == 'hidden') {
        $('#tablecolorrr tr:not(:first-child)').show();
        $('#spanNewColorSchemeee').attr('statusss', 'visible');
      } else {
        $('#tablecolorrr tr:not(:first-child)').hide();
        $('#spanNewColorSchemeee').attr('statusss', 'hidden');
     }
    });
    divOptions.appendChild(createElement('br'));
    divOptions.appendChild(createElement('a', {href:HREF_NO, class:"gootranslink"}, 'click saveOptions false', 'save'));
    divOptions.appendChild(createElement('span', null, null,'&nbsp;'));
    divOptions.appendChild(createElement('a', {href:HREF_NO, class:"gootranslink"}, 'click toggleOptions false', 'cancel'));
    repositionNode($('#divDic'));  
  } else {
    divOptions.parentNode.removeChild(divOptions);
    getId('optionsLink').style.visibility = 'visible';
    css(true);
} }
 
function changeColorScheme(evt) {
  var name = this.value;
  if (name == '') return;
  var sch = getColorSchemeByName(name);
  if (sch == null) return;
  COLOR_BG1 = sch.bg1;
  COLOR_BG2 = sch.bg2;
  COLOR_TEXT = sch.text;
  COLOR_LINK = sch.link;
  css();
  $('#inputbgcolor111').val(COLOR_BG1);
  $('#inputbgcolor222').val(COLOR_BG2);
  $('#inputtxttt').val(COLOR_TEXT);
  $('#inputlinkkk').val(COLOR_LINK);
}
 
function getColorSchemeByName(name) {
  for (var i = 0; i < colorschemes.length; i++) {
    if (name == colorschemes[i].name) return colorschemes[i];
  }
  return null;
}
 
function optColorInputChanged(evt) {
  var id, color = evt.target.value;
  if (!isColorValid(color)) return;
  if (color.charAt(0) != '#') color = '#'+color;
  id = evt.target.getAttribute('id');               
  if (id == 'inputbgcolor111') {
    COLOR_BG1 = color;
    css();
  } else if (id == 'inputbgcolor222') {
    COLOR_BG2 = color;
    css();       
  } else if (id == 'inputtxttt') {
    COLOR_TEXT = color;
    css();       
  } else if (id == 'inputlinkkk') {
    COLOR_LINK = color;
    css();       
} }
 
function isColorValid(color) {
  return (color.search(/^(#)?([0-9a-fA-F]{3})([0-9a-fA-F]{3})?$/) == 0);
}
 
function optColorPickerChanged(evt) {
  var color = evt.target.value, id = evt.target.getAttribute('id');
  if (id == 'bgcolor111') {
    COLOR_BG1 = color;
    $('#inputbgcolor111').val(color);
    css();
  } else if (id == 'bgcolor222') {
    COLOR_BG2 = color;
    $('#inputbgcolor222').val(color);
    css();       
  } else if (id == 'textcolorrr') {
    COLOR_TEXT = color;
    $('#inputtxttt').val(color);
    css();       
  } else if (id == 'linkcolorrr') {
    COLOR_LINK = color;
    $('#inputlinkkk').val(color);
    css();       
} }
 
function saveOptions(evt) {
  var from = getId('optSelLangFrom').value, to = getId('optSelLangTo').value, ctrl = getId('checkCtrl').checked, alt = getId('checkAlt').checked;
  var compare = getId('checkCompare').checked, shadow = getId('checkShadowww').checked, yt = getId('checkYoutubeee').checked, ytauto = getId('checkYoutubeAutoplayyy').checked;
  GM_setValue('from', from);
  GM_setValue('to', to);
  GM_setValue('ctrl', ctrl);
  GM_setValue('alt', alt);
  GM_setValue('opt_compare', compare);
  GM_setValue('opt_shadow', shadow);       
  GM_setValue('opt_youtube', yt);
  GM_setValue('opt_youtube_auto', ytauto);
  if (!isColorValid($('#inputbgcolor111').val())) {
    $('#inputbgcolor111').effect('pulsate');
    return;
  }
  if (!isColorValid($('#inputbgcolor222').val())) {
    $('#inputbgcolor222').effect('pulsate');
    return;
  }
  if (!isColorValid($('#inputtxttt').val())) {
    $('#inputtxttt').effect('pulsate');
    return;
  }
  if (!isColorValid($('#inputlinkkk').val())) {
    $('#inputlinkkk').effect('pulsate');
     return;
  }       
  GM_setValue('opt_color_bg1', $('#inputbgcolor111').val());
  GM_setValue('opt_color_bg2', $('#inputbgcolor222').val());
  GM_setValue('opt_color_text', $('#inputtxttt').val());
  GM_setValue('opt_color_link', $('#inputlinkkk').val());
  css(true);
  getId('divDic').removeChild(getId('divOpt'));
  getId('optionsLink').style.visibility = 'visible';
}
 
function css(init) {
  $('#css_googletranslatortooltip').remove();
  if (init == true) {
    COLOR_BG1 = GM_getValue('opt_color_bg1') != undefined ? GM_getValue('opt_color_bg1') : '#FFFF77';
    COLOR_BG2 = GM_getValue('opt_color_bg2') != undefined ? GM_getValue('opt_color_bg2') : '#FFFFAA';
    COLOR_TEXT = GM_getValue('opt_color_text') != undefined ? GM_getValue('opt_color_text') : '#333333';
    COLOR_LINK = GM_getValue('opt_color_link') != undefined ? GM_getValue('opt_color_link') : '#0000FF';
    if (GM_getValue('opt_shadow') == true) $('#divDic').addClass('classShadowww');
    else $('#divDic').removeClass('classShadowww');
  }
  var style = createElement('style', {id:'css_googletranslatortooltip', type:"text/css"}, null, 'a.gootranslink:link{color:' + COLOR_LINK + '!important;\
font-size:14px!important}a.gootranslink:visited{color:' + COLOR_LINK + '!important;text-decoration:underline!important}a.gootranslink:hover{color:' + COLOR_LINK + '!important;\
text-decoration:underline!important}a.gootranslink:active{color:' + COLOR_LINK + '!important;text-decoration:underline!important}#divLookup{background:none!important;\
color:' + COLOR_TEXT + '!important;position:absolute!important;z-index:' + MAX_Z + '!important;border:none!important}#divLookup img{border:2px solid ' + COLOR_BG1 + '!important}\
#divDic{background-color:' + COLOR_BG1 + '!important;color:' + COLOR_TEXT + '!important;position:absolute!important;min-width:380px!important;min-height:50px!important;max-width:50%!important;\
padding:5px!important;text-align:left!important;z-index:' + MAX_Z + '!important;border-radius:3px!important;border:none!important}#divResult{overflow:auto!important;padding:3px!important;\
background-color:' + COLOR_BG1 + '!important;color:' + COLOR_TEXT + '!important;border:none!important;margin:0!important;padding:0 0 4px 0!important}#divResult>a{border-bottom:1px solid!important;\
padding-bottom:2px!important;}#divOpt{background-color:' + COLOR_BG2 + '!important;position:relative!important;padding:5px!important;border:none!important;margin:0!important;font-size:12px!important}\
#divOpt span{padding:4px!important}#spanOtherSearches{cursor:pointer!important}#optionsLink{float:right!important;text-decoration:none!important;cursor:pointer!important}\
#dict{background-color:' + COLOR_BG2 + '!important;color:' + COLOR_TEXT + '!important;padding:5px!important;-moz-border-radius:3px!important;margin-bottom:10px!important;max-height:180px!important;\
overflow-y:auto!important;overflow-x:hidden!important}#divCompareee{font-size:14px!important;padding-top:4px!important}#divDic ul{margin:7px 23px !important;list-style:disc outside none!important;\
padding:0!important}#dict>ol{list-style:none !important}#dict>ol>li{display:table-cell!important}#tablecolorrr .simpleColorDisplay{display:none!important}#tablecolorrr{border:none!important;\
padding:0!important;margin:0!important}#tablecolorrr td{vertical-align:top!important;color:' + COLOR_TEXT + '!important;border:none!important;padding:0!important;margin:0!important;}\
#tablecolorrr input,#tablecolorrr select{border:none!important;padding:0!important;margin:0!important;width:100%!important}#tablecolorrr td:first-child{text-align:right!important}\
#tablecolorrr .classButtonColorrr{vertical-align:top!important}.classShadowww{box-shadow:3px 3px 10px #333!important}.simpleColorContainer{margin:2px!important}'
  );
  getTag('head')[0].appendChild(style);
}

function $(q, root, single, context) {
  root = root || document;
  context = context || root;
  if (q[0] == '#') return root.getElementById(q.substr(1));
  if (q.match(/^[\/*]|^\.[\/\.]/)) {
    if (single) return root.evaluate(q, context, null, 9, null) .singleNodeValue;
    var arr = [], xpr = root.evaluate(q, context, null, 7, null);
    for (var i = 0; i < xpr.snapshotLength; i++) arr.push(xpr.snapshotItem(i));
    return arr;
  }
  if (q[0] == '.') {
    if (single) return root.getElementsByClassName(q.substr(1)) [0];
    return root.getElementsByClassName(q.substr(1));
  }
  if (single) return root.getElementsByTagName(q) [0];
  return root.getElementsByTagName(q);
}

function $c(type, props, evls) {
  var node = document.createElement(type);
  if (props && typeof props == 'object') {
    for (prop in props) {
      if (typeof node[prop] == 'undefined') node.setAttribute(prop, props[prop]);
      else node[prop] = props[prop];
  } }
  if (evls instanceof Array) {
    for (var i = 0; i < evls.length; i++) {
      var evl = evls[i];
      if (typeof evl.type == 'string' && typeof evl.fn == 'function') node.addEventListener(evl.type, evl.fn, false);
  } }
  return node;
}
 
function createElement(type, attrArray, evtListener, html) {
  var node = document.createElement(type);
  for (var attr in attrArray) if (attrArray.hasOwnProperty(attr)) node.setAttribute(attr, attrArray[attr]);
  if (evtListener) {
    var a = evtListener.split(' ');
    node.addEventListener(a[0], eval(a[1]), eval(a[2]));
  }
  if (html) node.innerHTML = html;
  return node;
}
 
function getId(id, parent) {
  if (!parent) return document.getElementById(id);
  return parent.getElementById(id);       
}
 
function getTag(name, parent) {
  if (!parent) return document.getElementsByTagName(name);
  return parent.getElementsByTagName(name);
}
 
function xp(p, context, doc) {
  if (!context) context = document;
  if (!doc) doc = document;       
  var i, arr = [], xpr = doc.evaluate(p, context, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  for (i = 0; item = xpr.snapshotItem(i); i++) arr.push(item);
  return arr;
}
 
function debug(str) {
  var d = document.getElementById('debugg');
  if (!d) {
    var div = document.createElement('div');
    div.setAttribute('id', 'divdebug');
    div.setAttribute('style', 'background-color: #000000; position: fixed; bottom: 3px; left: 3px; width: 50%; z-index: 999999999;');
    var closeButton = document.createElement('input');
    closeButton.setAttribute('id', 'closedebug');
    closeButton.setAttribute('type', 'button');
    closeButton.setAttribute('value', 'close');
    closeButton.setAttribute('onClick', 'this.parentNode.parentNode.removeChild(this.parentNode);');
    d = document.createElement('textarea');
    d.setAttribute('id', 'debugg');
    d.setAttribute('style', "height: 150px; width: 99%; margin: 2px;");
    div.appendChild(d);
    div.appendChild(document.createElement('br'));
    div.appendChild(closeButton);
    document.body.appendChild(div);
  }
  d.innerHTML += '\n'+str;
  d.scrollTop = d.scrollHeight;
}
 
var savedTarget = null, orgCursor = null, dragOK = false, dragXoffset = 0, dragYoffset = 0, didDrag = false;
 
function moveHandler(e) {
  if (e == null) return;
  if (e.button <= 1 && dragOK) {
    savedTarget.style.left = e.clientX - dragXoffset + 'px';
    savedTarget.style.top = e.clientY - dragYoffset + 'px';
    return false;
} }
 
function dragCleanup(e) {
  document.removeEventListener('mousemove', moveHandler, false);
  document.removeEventListener('mouseup', dragCleanup, false);
  savedTarget.style.cursor = orgCursor;
  dragOK = false;
  didDrag = true;
}
 
function dragHandler(e) {
  var htype = '-moz-grabbing';
  if (e == null) return;
  var target = e.target;
  orgCursor = target.style.cursor;
  if(target.nodeName != 'DIV') return;
  else if (clickedInsideID(target, 'dict')) return;
  if (target = clickedInsideID(target, 'divDic')) {
    savedTarget = target;      
    target.style.cursor = htype;
    dragOK = true;
    dragXoffset = e.clientX - target.offsetLeft;
    dragYoffset = e.clientY - target.offsetTop;
    target.style.left = e.clientX - dragXoffset + 'px';
    target.style.right = null;
    document.addEventListener('mousemove', moveHandler, false);
    document.addEventListener('mouseup', dragCleanup, false);
    return false;
} }
 
function clickedInsideID(target, id) {
  if (target.getAttribute('id') == id) return getId(id);
  if (target.parentNode) {
    while (target = target.parentNode) {
      try {
        if (target.getAttribute('id') == id) return getId(id);
      } catch(e) {}
  } }
  return null;
}
 
function images() {
	imgLookup = createElement('img', {border:0});
	imgLookup.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAACHElEQVR42mP89uX1fwYaAsZRCwa/BUeOHWF4+PgpQ3R4OPUsWLpyJcO9+/fB7KfPnoNpaSlJ\
uHxtRQV1LAAZDjMY2SKKLQCBi9euMUyfMZOhsKiAQZSPi6F1/lYGds8yuPzzHwwMX39+Y3jym4vh0effYLEn3h9Ji4OMvHywi5UUFRneG0QyPPsrhNcCbJbgtQAUwUtWrAazhTKWohieJvUUzO6/L8hw7B0r6Ra8e\
PmYYfb8pfCw/5mAsMCY+x1DvORrhn///zIsfiHB0HGHFyz+/eMrhrdR7IQtuPngPoPpfCGGw+FPGT5/eMcgKiXN0PHOFBwkIFCo+J5Bh+sLw7N3nxj4OVkYTM7oEG/B509vGaR7WeD8B/k/wLTPFW0wLcP6jWG21g\
OGY09/MdxllmMIEXjIkHdPnWHv/fdgeYIW8NVjpoTHRT8ZPC9qgdlR4u8YokSfM8y+9pvhLLMawySlmwzn3zIyxFwQJc4CdEv+9KowMkZs/C8Y6Anm79W+AE62v37/gqv5+P0PQ/RZMYa7bz4yvE+XImwBT8ENBiZ\
+SYZ/HyER/P/LOzDtnewCd/GMW8xgMSuRvwwBMr8ZNjxhZei4ykS8BTAAMxwG7rbKMqQfZ2E48g2RJ/YZ3AXTDocFiLMAlyVspgpgmolXGC737/NbFH1EW4AMuFOOMXydY8VgsvYrw9dfqMr///4OZ9+IE8XQO/D1\
wagFAH9qRghPu8SmAAAAAElFTkSuQmCC';
}

(function(c) {
  c.fn.simpleColor = function(b) {
    var o = ["990033","ff3366","cc0033","ff0033","ff9999","cc3366","ffccff","cc6699","993366","660033","cc3399","ff99cc","ff66cc","ff99ff","ff6699","cc0066",
"ff0066","ff3399","ff0099","ff33cc","ff00cc","ff66ff","ff33ff","ff00ff","cc0099","990066","cc66cc","cc33cc","cc99ff","cc66ff","cc33ff","993399","cc00cc","cc00ff",
"9900cc","990099","cc99cc","996699","663366","660099","9933cc","660066","9900ff","9933ff","9966cc","330033","663399","6633cc","6600cc","9966ff","330066","6600ff",
"6633ff","ccccff","9999ff","9999cc","6666cc","6666ff","666699","333366","333399","330099","3300cc","3300ff","3333ff","3333cc","0066ff","0033ff","3366ff","3366cc",
"000066","000033","0000ff","000099","0033cc","0000cc","336699","0066cc","99ccff","6699ff","003366","6699cc","006699","3399cc","0099cc","66ccff","3399ff","003399",
"0099ff","33ccff","00ccff","99ffff","66ffff","33ffff","00ffff","00cccc","009999","669999","99cccc","ccffff","33cccc","66cccc","339999","336666","006666","003333",
"00ffcc","33ffcc","33cc99","00cc99","66ffcc","99ffcc","00ff99","339966","006633","336633","669966","66cc66","99ff99","66ff66","339933","99cc99","66ff99","33ff99",
"33cc66","00cc66","66cc99","009966","009933","33ff66","00ff66","ccffcc","ccff99","99ff66","99ff33","00ff33","33ff33","00cc33","33cc33","66ff33","00ff00","66cc33",
"006600","003300","009900","33ff00","66ff00","99ff00","66cc00","00cc00","33cc00","339900","99cc66","669933","99cc33","336600","669900","99cc00","ccff66","ccff33",
"ccff00","999900","cccc00","cccc33","333300","666600","999933","cccc66","666633","999966","cccc99","ffffcc","ffff99","ffff66","ffff33","ffff00","ffcc00","ffcc66",
"ffcc33","cc9933","996600","cc9900","ff9900","cc6600","993300","cc6633","663300","ff9966","ff6633","ff9933","ff6600","cc3300","996633","330000","663333","996666",
"cc9999","993333","cc6666","ffcccc","ff3333","cc3333","ff6666","660000","990000","cc0000","ff0000","ff3300","cc9966","ffcc99","ffffff","cccccc","999999","666666",
"333333","000000","000000","000000","000000","000000","000000","000000","000000","000000"];
    b = c.extend({defaultColor:this.attr("defaultColor") || "#FFF", border:this.attr("border") || "1px solid #000", cellWidth:this.attr("cellWidth") || 10, 
cellHeight:this.attr("cellHeight") || 10, cellMargin:this.attr("cellMargin") || 1, boxWidth:this.attr("boxWidth") || "115px", boxHeight:this.attr("boxHeight") || 
"20px", columns:this.attr("columns") || 16, insert:this.attr("insert") || "after", buttonClass:this.attr("buttonClass") || "", colors:this.attr("colors") || o, 
displayColorCode:this.attr("displayColorCode") || false, colorCodeAlign:this.attr("colorCodeAlign") || "center", colorCodeColor:this.attr("colorCodeColor") || "#FFF"}, b || {});
    this.hide();
    b.totalWidth = b.columns * (b.cellWidth + 2 * b.cellMargin);
    if (c.browser.msie) b.totalWidth += 2;
    b.totalHeight = Math.ceil(b.colors.length / b.columns) * (b.cellHeight + 2 * b.cellMargin);
    c.simpleColorOptions = b;
    this.each(function() {
      var a = c.simpleColorOptions, i = c("<div class='simpleColorContainer' />"), l = this.value && this.value != "" ? this.value : a.defaultColor, d = c("<div class='simpleColorDisplay' />");
      d.css("backgroundColor", l);
      d.css("border", a.border);
      d.css("width", a.boxWidth);
      d.css("height", a.boxHeight);
      d.css("cursor", "pointer");
      i.append(d);
      if (a.displayColorCode) {
        d.text(this.value);
        d.css("color", a.colorCodeColor);
        d.css("textAlign", a.colorCodeAlign)
      }
      var j = c("<input type='button' value='Select' class='simpleColorSelectButton " + a.buttonClass + "'>");
      i.append(j);
      var k = c("<input type='button' value='Cancel' class='simpleColorCancelButton " + a.buttonClass + "'>");
      i.append(k);
      k.hide();
      l = function(e) {
        e.data.select_button.hide();
        e.data.cancel_button.show();
        if (e.data.container.chooser) e.data.container.chooser.show();
        else {
          var g = c("<div class='simpleColorChooser'/>");
          g.css("border", a.border);
          g.css("margin", "0px");
          g.css("margin-top", "3px");
          g.css("width", a.totalWidth + "px");
          g.css("height", a.totalHeight + "px");
          e.data.container.chooser = g;
          e.data.container.append(g);
          for (var m = 0; m < a.colors.length; m++) {
            var f = c("<div class='simpleColorCell' id='" + a.colors[m] + "'/>");
            f.css("width", a.cellWidth + "px");
            f.css("height", a.cellHeight + "px");
            f.css("margin", a.cellMargin + "px");
            f.css("cursor", "pointer");
            f.css("lineHeight", a.cellHeight + "px");
            f.css("fontSize", "1px");
            f.css("float", "left");
            f.css("backgroundColor", "#" + a.colors[m]);
            g.append(f);
            f.bind("click", {input:e.data.input, chooser:g, select_button:j, cancel_button:k, display_box:d}, function(h) {
h.data.input.value="#"+this.id; c(h.data.input).change(); h.data.display_box.css("backgroundColor", "#" + this.id); h.data.chooser.hide(); 
h.data.cancel_button.hide(); h.data.display_box.show(); h.data.select_button.show(); a.displayColorCode && h.data.display_box.text("#" + this.id)})
        } }
      };
      var n = {container:i,input:this,cancel_button:k,display_box:d,select_button:j};
      j.bind("click", n, l);
      d.bind("click", n, l);
      k.bind("click", {container:i, select_button:j, display_box:d}, function(e) {c(this).hide(); e.data.container.find(".simpleColorChooser").hide(); e.data.display_box.show(); e.data.select_button.show()});
      c(this).after(i)
    });
    return this;
  };
  c.fn.closeSelector = function() {
    this.each(function() {
      var b = c(this).parent().find("div.simpleColorContainer");
      b.find(".simpleColorCancelButton").hide();
      b.find(".simpleColorChooser").hide();
      b.find(".simpleColorDisplay").show();
      b.find(".simpleColorSelectButton").show()
    });
    return this;
  }
})(jQuery);
