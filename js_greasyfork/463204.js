// ==UserScript==
// @name        YouTube Player Controls 1.3.3 fork July 2023 set video quality / resolution bugfix
// @namespace   YouTubePlayerControlsEdited
// @version     1.3.3.11
// @license     MIT
// @description Fork of YouTube Player Controls 1.3.3 by Costas https://greasyfork.org/en/scripts/16323-youtube-player-controls . Fill window, stretch video, float video, set HD 4K 8K resolution, click skip ads, click show more, hide ads and annotations, loop, pause at start/end
// @match       http://www.youtube.com/*
// @match       https://www.youtube.com/*
// @grant       GM_setValue
// @grant       GM_getValue
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/463204/YouTube%20Player%20Controls%20133%20fork%20July%202023%20set%20video%20quality%20%20resolution%20bugfix.user.js
// @updateURL https://update.greasyfork.org/scripts/463204/YouTube%20Player%20Controls%20133%20fork%20July%202023%20set%20video%20quality%20%20resolution%20bugfix.meta.js
// ==/UserScript==
console.log(`${GM.info.script.name} run`)

// forked from YouTube Player Controls 1.3.3 by Costas https://greasyfork.org/en/scripts/16323-youtube-player-controls
//==================================================================
//Userscript specific functions

var doc = document;
var win = window;

if (win.frameElement) throw new Error("Stopped JavaScript.");

function set_pref(preference, new_value) {
    GM_setValue(preference, new_value);
}

function get_pref(preference) {
    return GM_getValue(preference);
}

function init_pref(preference, new_value) {
    var value = get_pref(preference);
    if (value == null) {
        set_pref(preference, new_value);
        value = new_value;
    }
    return value;
}


//==================================================================
// Styles

var style_annotations = "\
.html5-video-player .annotation,\
.html5-video-player .video-annotations,\
.html5-video-player .ytp-cards-button,\
.html5-video-player .ytp-cards-teaser,\
.html5-video-player .iv-drawer,\
.html5-video-player .ima-container,\
.html5-video-player .ytp-paid-content-overlay,\
.html5-video-player .ytp-ad-overlay-slot {display:none !important;}\
";

var style_extra_ads = "\
#player-ads,\
#offer-module,\
ytd-compact-promoted-video-renderer,\
ytd-promoted-sparkles-web-renderer {display:none !important;}\
";

var style_basic = "\
/* messages */\
.ytpc_message {font:12px/15px arial,sans-serif; text-align:left; white-space:pre; float:left; clear:both; color:black; background:beige; margin:10px 0px 0px 300px; z-index:2147483647;}\
/* options */\
#ytpc_options_popup {direction:ltr; position:absolute; top:5px; width:235px; box-shadow:0px 0px 6px 2px gray; font-size:11px; color:black; background:white; padding:5px; border-radius:5px; z-index:10; user-select:none; -moz-user-select:none;}\
body[dir='ltr'] #ytpc_options_popup {right:5px;}\
body[dir='rtl'] #ytpc_options_popup {left:5px;}\
html[dark] #ytpc_options_popup {color:#e0e0e0; background:#1b1b1b;}\
#ytpc_options_popup input {margin:3px 2px -2px 5px !important;}\
.ytpc_options_group.space {margin-bottom:3px; border:1px solid lightgray; border-radius:3px;}\
html[dark] .ytpc_options_group.space {border:1px solid #606060 !important;}\
.ytpc_options_group.space *[hide] {color:steelblue; margin-left:7px;}\
.ytpc_options_group[hide] *[hide] {opacity:0.5;}\
.ytpc_options_group.column > span:first-child {display:inline-block; min-width:120px;}\
.ytpc_options_text {font-weight:500; font-size:12px; margin-left:5px; margin-top:7px;}\
.ytpc_options_close {font-size:14px; color:#ff8888; position:absolute; top:0px; right:4px; cursor:pointer;}\
.ytpc_options_close:hover {font-weight:bold; color:red;}\
.ytpc_options_title {font-weight:500; font-size:14px; padding:3px 5px !important;}\
/* button */\
#ytpc_ytcontrol_container {position:relative; float:right; z-index:700;}\
body[dir='rtl'] #ytpc_ytcontrol_container {float:left !important;}\
#ytpc_cog_container {position:absolute; top:5px;}\
body[dir='ltr'] #ytpc_cog_container {right:5px;}\
body[dir='rtl'] #ytpc_cog_container {left:5px;}\
#ytpc_ytcontrol_button {overflow:hidden; position:relative; float:right; margin:-3px -2px 0px 0px; width:24px; height:23px; cursor:pointer; opacity:0.7; background-size:100%; user-select:none; -moz-user-select:none; background-image:url('data:image/png;base64,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'); }\
#ytpc_ytcontrol_button:hover {opacity:1;}\
/* masthead */\
#content[ytpc_cinema]:not([float]) #masthead-container[ytpc_hide] {display:none !important;}\
#content[ytpc_cinema][ytpc_top]:not([float]) #page-manager {margin-top:0px !important;}\
";


//==============================================================
//basic

function newNode(kind, id, classname, refnode, position) {

    var node = doc.createElement(kind);

    if (node == null) return null;

    if (id != null) node.id = id;

    if (classname != null) node.className = classname;

    if (refnode != null) {
        switch (position) {
            //insert after refnode
            case 'after':
                if (refnode.nextSibling != null)
                    refnode.parentNode.insertBefore(node, refnode.nextSibling);
                else
                    refnode.parentNode.appendChild(node);
                break;

            //insert before refnode
            case 'before':
                refnode.parentNode.insertBefore(node, refnode);
                break;

            //insert as first child of refnode
            case 'first':
                var child = refnode.childNodes[0];
                if (child != null)
                    refnode.insertBefore(node, child);
                else
                    refnode.appendChild(node);
                break;

            //insert as last child of refnode
            case 'last':
            default:
                refnode.appendChild(node);
                break;
        }
    }

    return node;
}


function message(str) {
    var node = newNode("div", null, "ytpc_message", doc.body);
    node.textContent = str + "\n";
}


function insertStyle(str, id) {
    var styleNode = null;

    if (id != null) {
        styleNode = doc.getElementById(id);
    }

    if (styleNode == null) {
        styleNode = newNode("style", id, null, doc.head);
        styleNode.setAttribute("type", "text/css");
    }

    if (styleNode.textContent != str)
        styleNode.textContent = str;
}

function deleteStyle(id) {
    var styleNode = doc.getElementById(id);
    if (styleNode) styleNode.parentElement.removeChild(styleNode);
}


function injectScript(str, src) {
    var script = doc.createElement("script");
    if (str) script.textContent = str;
    if (src) script.src = src;
    doc.body.appendChild(script);
    if (!src) doc.body.removeChild(script);
}


function simulClick(el) {
    var clickEvent = doc.createEvent('MouseEvents');
    clickEvent.initEvent('click', true, true);
    clickEvent.artificialevent = true;
    el.dispatchEvent(clickEvent);
}


function xpath(outer_dom, inner_dom, query) {
    //XPathResult.ORDERED_NODE_SNAPSHOT_TYPE = 7
    return outer_dom.evaluate(query, inner_dom, null, 7, null);
}


function docsearch(query) {
    return xpath(doc, doc, query);
}


function innersearch(inner, query) {
    return xpath(doc, inner, query);
}



//==================================================================
//YT Player

function ytplayer_script() {
    injectScript("function f() {\
                    var a = document.getElementById('c4-player') || document.getElementById('movie_player');\
                    var b = document.getElementById('ytpc_ytplayer_state');\
                    if (a != null && b != null)\
                      if (b.getAttribute('loop') == 'true') {\
                        if (window.location.href.indexOf('list=') == -1) {\
                          if (a.getPlayerState() == 0) {\
                            a.playVideo();\
                          }\
                        }\
                        else {\
                          var d = a.getDuration();\
                          if ((d - a.getCurrentTime() <= 1) && d > 0) {\
                            a.playVideoAt(a.getPlaylistIndex());\
                          }\
                        }\
                      }\
                      else {\
                         if (b.getAttribute('pause_end') == 'true' && b.getAttribute('pause_end_mark') != 'true') {\
                           var d = a.getDuration();\
                           if ((d - a.getCurrentTime() <= 1) && d > 0) {\
                             a.pauseVideo();\
                             b.setAttribute('pause_end_mark', 'true');\
                           }\
                         }\
                      }\
                  }\
                  window.setInterval(f, 1000);\
                  ");
}


function ytplayer_state(attr, value) {
    var node = doc.getElementById('ytpc_ytplayer_state');
    if (!node) {
        node = newNode("div", 'ytpc_ytplayer_state', null, doc.body);
        node.style.display = "none";
    }

    if (!node) return null;

    if (attr && value) node.setAttribute(attr, value);
    else if (attr) return node.getAttribute(attr);
}


function set_loop() { ytplayer_state('loop', 'true'); }
function set_noloop() { ytplayer_state('loop', 'false'); }
function set_pause_end() { ytplayer_state('pause_end', 'true'); }
function set_nopause_end() { ytplayer_state('pause_end', 'false'); }
function reset_pause_end_mark() { ytplayer_state('pause_end_mark', 'false'); }


function adjust_pause_end() {
    var islive = docsearch("//yt-view-count-renderer/*[contains(.,'watching now')]").snapshotLength > 0;
    //message("Is live: " + islive);
    //alert("Is live: " + islive);
    get_pref("ytPauseEnd") && !islive ? set_pause_end() : set_nopause_end();
    reset_pause_end_mark();
}


function adjust_loop() {
    get_pref("ytLoop") ? set_loop() : set_noloop();
}

// lame emulation for setPlaybackQualityRange and getPlaybackQualityRange
var waitqualitychanged=2000
var retryqualitybuttonclickable=3
var waitqualitybuttonclickable=1000

ytplayer_quality(get_pref('ytDef'))
get_pref('ytPause')

var clicksettings=_=>document.querySelector('.ytp-settings-button').click()
var clickquality=_=>
  [...document.querySelectorAll('.ytp-menuitem')].filter(e=>{
    return e.querySelector('.ytp-menuitem-label')?.textContent==='Quality'
  })[0]?.click()
var qualitychecked=hitq=>
  [...document.querySelectorAll('.ytp-menuitem')]
  .filter(e=>~e.textContent.indexOf(hitq))
  [0]?.getAttribute('aria-checked')==='true'
var setq=(def,count)=>{
  clicksettings()
  clickquality()
  var hit,hitq
  (Number(def)!=0?
    '144,240,360,480,720,1080,1440,2160,2880,4320'.split(',').splice(0,Number(def)).reverse()
    :['Auto']
  ).map(q=>
    [...document.querySelectorAll('.ytp-menuitem')].map(e=>{
      if(!hit && ~e.textContent.indexOf(q)){
        hit=true
        e.click()
        hitq=e.textContent
        //console.log(GM.info.script.name+' quality clicked '+hitq)
      }
    })
  )
  //
  if(hit){
    setTimeout(_=>{
      clicksettings()
      clickquality()
      if(qualitychecked(hitq)){
        titleq=hitq
        //console.log(GM.info.script.name+' quality set success')
        clicksettings()
      }
      else setq(def,count!=undefined?count-1:(retryqualitybuttonclickable-1))
    },waitqualitychanged)
  }else if(count==undefined||1<count){
    setTimeout(_=>setq(def,count!=undefined?count-1:(retryqualitybuttonclickable-1)),waitqualitybuttonclickable)
  }
}
//
var documenttitle=''
function ytplayer_quality(def) {
  titleq=''
  qq=def
}
// independent video loop
var v,qq=get_pref('ytDef'),curdur,lastq
var vloop=_=>{
  if(v != document.getElementById('c4-player') || document.getElementById('movie_player')){
    v = document.getElementById('c4-player') || document.getElementById('movie_player')
  }
  if(~win.location.href.indexOf("watch?")&& v && !isNaN(v.getDuration())
     && (  curdur != v.getDuration() || lastq!=qq) ){
    curdur=v.getDuration()
    lastq=qq
    setq(qq)
    if (get_pref('ytPause') && v.pauseVideo != null) v.pauseVideo()
  }
  setTimeout(vloop,500)
}
vloop()
//
var titleq=''
var appendqualitytotitle=_=>{
  if(~win.location.href.indexOf("watch?")) document.title=(get_pref('ytDefMarkTitle')?titleq+(titleq!=''?' ':''):'')+documenttitle
  setTimeout(appendqualitytotitle,500)
}
appendqualitytotitle()

var qc=e=>{
  if(
    !e.target.closest('#ytpc_ytcontrol_container')
    &&
    ~'144,240,360,480,720,1080,1440,2160,2880,4320,Auto'.split(',').indexOf(e.target.textContent.replace(/(HD)|\s/g,'') )
  ) titleq=e.target.textContent
}
win.addEventListener("click", qc)
//==============================================================
//preferences

init_pref("ytPause", false);
init_pref("ytPauseEnd", false);
init_pref("ytDef", "0");
init_pref("ytLoop", false);
init_pref("ytCine", true);
init_pref("ytStretch", false);
init_pref("ytHide", false);
init_pref("ytAnnot", false);
init_pref("ytAds", false);
init_pref("ytAdsExtra", false);
init_pref("ytFloat", true);
init_pref("ytFSmall", true);
init_pref("ytLoad", false);
init_pref("ytDefMarkTitle", true);


function close_ytplayer_options(e) {
    var popup = doc.getElementById("ytpc_options_popup");
    if (!popup) return;

    if (!e) {
        popup.parentNode.removeChild(popup);
        return;
    }

    if (e.artificialevent) return;

    var p = e.target;
    for (var i = 0; i < 5; i++) {
        if (p) {
            if (p.id)
                if (p.id.search(/ytpc/) == 0) {
                    e.stopPropagation();
                    return;
                }
            if (p.className)
                if (p.className.search(/ytpc/) == 0) {
                    e.stopPropagation();
                    return;
                }
        }
        p = p.parentNode;
    }

    popup.parentNode.removeChild(popup);
}


function new_checkbox(prefname, str, node_kind, parent, value, func, hide1, hide2) {
    var div = newNode(node_kind, null, "ytpc_generic", parent);
    var input = newNode("input", null, "ytpc_generic", div);
    input.type = "checkbox";
    if (!value) {
        input.checked = get_pref(prefname);
        if (hide1 && !input.checked) parent.setAttribute("hide", "true");
        input.onclick = function (e) {
            var val = get_pref(prefname);
            if (hide2 && parent.getAttribute("hide")) val = !val; //no change if hidden
            set_pref(prefname, !val);
            e.target.checked = !val;
            if (hide1)
                if (!val)
                    parent.removeAttribute("hide");
                else
                    parent.setAttribute("hide", "true");
            if (func) func();
        };
    }
    else {
        input.value = value;
        input.checked = (get_pref(prefname) == input.value);
        input.onclick = function (e) {
            var val = get_pref(prefname);
            set_pref(prefname, e.target.value);
            e.target.checked = true;
            var other = innersearch(parent.parentNode, ".//input[@value='" + val + "']").snapshotItem(0);
            if (other && (other != e.target)) other.checked = false;
            if (func) func();
        };
    }
    var span = newNode("span", null, "ytpc_generic", div);
    span.textContent = str;
    if (hide2) div.setAttribute("hide", "true");
}


function ytplayer_options() {
    var popup = doc.getElementById("ytpc_options_popup");
    if (popup) return;

    var parent = doc.getElementById("ytpc_ytcontrol_container");
    if (!parent) return;

    popup = newNode("span", "ytpc_options_popup", null, parent);
    //parent.parentNode.parentNode.style.overflow = "visible";

    var title_node = newNode("div", null, "ytpc_options_title", popup);
    title_node.textContent = "YouTube Player Controls";

    var closemark = newNode("span", null, "ytpc_options_close", popup);
    closemark.textContent = "\u2716";
    closemark.title = "close";
    closemark.onclick = function (e) { e.stopPropagation(); close_ytplayer_options(); }

    var groupCine = newNode("div", null, "ytpc_options_group space", popup);
    new_checkbox("ytCine", "Fill Window", "span", groupCine, null, function () { resetTheaterMode(); cinema(0); }, true, false);
    new_checkbox("ytStretch", "Stretch", "span", groupCine, null, function () { cinema(0); }, false, true);
    new_checkbox("ytHide", "Hide Search", "span", groupCine, null, function () { cinema(0); }, false, true);

    var groupFloat = newNode("div", null, "ytpc_options_group column", popup);
    new_checkbox("ytFloat", "Float Video", "span", groupFloat, null, function () { float(0); }, true, false);
    new_checkbox("ytFSmall", "Small Float", "span", groupFloat, null, null, false, true);

    var groupAnnot = newNode("div", null, "ytpc_options_group column", popup);
    new_checkbox("ytAnnot", "Hide Annotations", "span", groupAnnot, null, annotation);
    new_checkbox("ytAdsExtra", "Hide Related Ads", "span", groupAnnot, null, extra_ads);

    var groupClick = newNode("div", null, "ytpc_options_group column", popup);
    new_checkbox("ytLoad", "Click Show More", "span", groupClick, null, function() { auto_load(10); });
    new_checkbox("ytAds", "Click Skip Ads", "span", groupClick);
    
    var groupRepeat = newNode("div", null, "ytpc_options_group", popup);
    new_checkbox("ytLoop", "Loop ↺", "span", groupRepeat, null, adjust_loop);
	  new_checkbox("ytPause", "Pause Start", "span", groupRepeat);
    new_checkbox("ytPauseEnd", "Pause End", "span", groupRepeat, null, adjust_pause_end);

    var div = newNode("div", null, "ytpc_options_text", popup);
    //auto, small, medium, large, hd720, hd1080, hd1440, 4k2160, 5k2880, highres;
    div.textContent = "Max Resolution";
    var groupDef1 = newNode("div", null, "ytpc_options_group", popup);
    var groupDef2 = newNode("div", null, "ytpc_options_group", popup);
    var groupDef3 = newNode("div", null, "ytpc_options_group", popup);
    new_checkbox("ytDef", "Auto", "span", groupDef1, "0", function() {ytplayer_quality("0");});
    new_checkbox("ytDef", "144", "span", groupDef1, "1", function() {ytplayer_quality("1");});
    new_checkbox("ytDef", "240", "span", groupDef1, "2", function() {ytplayer_quality("2");});
    new_checkbox("ytDef", "360", "span", groupDef1, "3", function() {ytplayer_quality("3");});
    new_checkbox("ytDef", "480", "span", groupDef1, "4", function() {ytplayer_quality("4");});
    new_checkbox("ytDef", "HD 720", "span", groupDef2, "5", function() {ytplayer_quality("5");});
    new_checkbox("ytDef", "FHD 1080", "span", groupDef2, "6", function() {ytplayer_quality("6");});
    new_checkbox("ytDef", "QHD 1440", "span", groupDef2, "7", function() {ytplayer_quality("7");});
    new_checkbox("ytDef", "4K 2160", "span", groupDef3, "8", function() {ytplayer_quality("8");});
    new_checkbox("ytDef", "5K 2880", "span", groupDef3, "9", function() {ytplayer_quality("9");});
    new_checkbox("ytDef", "8K 4320", "span", groupDef3, "10", function() {ytplayer_quality("10");});

    var tabtitle = newNode("div", null, "ytpc_options_group column", popup);
    new_checkbox("ytDefMarkTitle", "Show current resolution on tab title", "span", tabtitle,null, _=>ytplayer_quality(get_pref('ytDef')) );
}

function build_yt_control() {
        var parent = doc.getElementById("ytpc_ytcontrol_container");
        if (parent) return;
		
		//cog button container
	    //var pp = null;
		var pp = doc.getElementById("below");
		
		if (!pp) pp = doc.getElementById("primary-inner");
		
		if (!pp) return;

        parent = newNode("span", "ytpc_ytcontrol_container", null, pp, 'first');
        var node = newNode("span", "ytpc_cog_container", null, parent);
        var control = newNode("span", "ytpc_ytcontrol_button", null, node);

        control.title = "YouTube Player Controls";
        control.onclick = ytplayer_options;
}


//==================================================================
//Theater mode

function setTheaterMode() {
    if (docsearch("//ytd-page-manager/ytd-watch-flexy[@theater]").snapshotLength > 0) return; //already in theater mode
    var thnode = docsearch("//ytd-page-manager/ytd-watch-flexy//*[@class='ytp-chrome-controls']//*[contains(@class,'ytp-size-button')]").snapshotItem(0);
    if (thnode) simulClick(thnode);
}

function resetTheaterMode() {
    if (get_pref("ytCine")) return;

    if (docsearch("//ytd-page-manager/ytd-watch-flexy[@theater]").snapshotLength == 0) return; //already in default view
    var thnode = docsearch("//ytd-page-manager/ytd-watch-flexy//*[@class='ytp-chrome-controls']//*[contains(@class,'ytp-size-button')]").snapshotItem(0);
    if (thnode) simulClick(thnode);

    deleteStyle("ytpc_style_cinemode");
    showmast(false);
}

function showmast(movetop) {
    var mastoffset = doc.getElementById("masthead-container");
    if (mastoffset) {
        mastoffset.removeAttribute("ytpc_hide");
        if (!movetop)
            mastoffset.closest('#content')?.removeAttribute("ytpc_top");
    }
}

function hidemast(movetop) {
    var mastoffset = doc.getElementById("masthead-container");
    if (mastoffset) {
        mastoffset.setAttribute("ytpc_hide", "");
        if (movetop)
            mastoffset.closest('#content')?.setAttribute("ytpc_top", "");
    }
}


function cinema(start_count) {
    //not video page
    if (win.location.href.indexOf("watch?") == -1) {
        showmast(false);
        insertStyle("", "ytpc_style_cinemode");
        return;
    }

    //video page
    if (!get_pref("ytCine")) return;

    var page = docsearch("//ytd-page-manager/ytd-watch-flexy").snapshotItem(0);
    if (!page) return;

    setTheaterMode();

    var intheater = page.getAttribute("theater") != null;
    var fullscreen = page.getAttribute("fullscreen") != null;

    if (intheater || fullscreen)
        page.closest('#content')?.setAttribute("ytpc_cinema", "");
    else
        page.closest('#content')?.removeAttribute("ytpc_cinema");

    var hide = get_pref("ytHide") || fullscreen;
	
	if (hide && !fullscreen) { //hide or show search bar
		hidemast(true);
		if (win.pageYOffset > 0)
            showmast(true);
    }
    else
        showmast(false);

	//check at most 6 times
    if (start_count > 5) return;

    var H = doc.documentElement.clientHeight || doc.body.clientHeight;
    var W = doc.documentElement.clientWidth || doc.body.clientWidth;
	var view_height = H - (hide ? 0 : 56); //visible height, adjust for search bar
	var view_width = W;
	var view_ratio = view_width / view_height;

    var pl = docsearch("//ytd-watch-flexy//*[contains(@class,'html5-main-video')]").snapshotItem(0);
    if (!pl) return;
    var pwidth = Number(pl.style.width.replace(/[^\d\.\-]/g, '')); //video width
    var pheight = Number(pl.style.height.replace(/[^\d\.\-]/g, '')); //video height
    var pratio = pwidth / pheight; //video aspect ratio
	
	var height = 1; // actual video height in view area
	var width = 1;
	var left = 0;
	var top = 0;
	
	var stretch = get_pref("ytStretch"); //horizontal stretch of videos

	if (stretch) {
	   if (pratio < view_ratio) {
		   width = view_width;
		   height = width / pratio;
		   top = -(height - view_height) / 2;
	   }
	   else {
		   height = view_height;
		   width = height * pratio;
		   left = -(width - view_width) / 2;
	   }
	} 
	else{	
		if (pratio < view_ratio) {
			height = view_height;
			width = height * pratio;
		    left = -(width - view_width) / 2;
		} 
		else{
			width = view_width;
			height = width / pratio;
			top = -(height - view_height) / 2;
		}
	}
	
	
	height = Math.round(height);
    width = Math.round(width);
	left = Math.round(left);
	top = Math.round(top);
	
	//peculiarity of fullscreen, forces to loose a few pixels from bottom to keep correct aspect ratio
	if (stretch && fullscreen) {
		height = height + top - 7;
	}
	
	insertStyle("\
		ytd-watch-flexy[theater]:not([float]) #player-theater-container {height:" + view_height + "px !important; min-height:" + view_height + "px !important; max-height:" + view_height + "px !important;}\
		ytd-watch-flexy[theater]:not([float]) .html5-main-video {width:" + width + "px !important; min-width:" + width + "px !important; max-width:" + width + "px !important; height:" + height + "px !important; min-height:" + height + "px !important; max-height:" + height + "px !important; left:" + left + "px !important; top:" + top + "px !important;}\
		", "ytpc_style_cinemode");
}


//==================================================================
// Float

var floatheight = 0;
var floatbot = 0;

function reset_float() {
    var page = docsearch("//ytd-page-manager/ytd-watch-flexy").snapshotItem(0);
    if (!page) return;

    if (page.getAttribute("float") != null) win.setTimeout(function () { win.dispatchEvent(new Event('resize')) }, 100);
    page.removeAttribute("float");
    page.closest('#content')?.removeAttribute("float");
    insertStyle("", "ytpc_style_float");
    floatheight = 0;
    floatbot = 0;
}


function float(start_count) {
	if (start_count == 0) reset_float();
	
    if (!get_pref("ytFloat")) return;
    var small = get_pref("ytFSmall");
    var cine = get_pref("ytCine");

    var page = docsearch("//ytd-page-manager/ytd-watch-flexy").snapshotItem(0);
    if (!page) return;

    var intheater = page.getAttribute("theater") != null;
    var fullscreen = page.getAttribute("fullscreen") != null;
	if (start_count == 20 && !fullscreen) return;
	
    var vid = intheater || fullscreen ? docsearch("//*[@id='player-theater-container']").snapshotItem(0)
        : docsearch("//*[@id='primary-inner']/*[@id='player']").snapshotItem(0);
    if (!vid) return;

    var val = vid.getBoundingClientRect();
    var vwidth = val.right - val.left;
    var vheight = val.bottom - val.top;
    var vleft = val.left;
    var vright = val.right;

    //player dimensions for fill window float
    var W = doc.body.clientWidth || doc.documentElement.clientWidth;
    var height = 240;
    var width = 427;
    var left = Math.round((W - width) / 2);

    var infloat = page.getAttribute("float") != null;
    var inpltop = (docsearch("//*[@ytpc_top]").snapshotLength > 0);

    //store initial values
    if (!infloat) {
        floatheight = vheight;
        floatbot = inpltop ? vheight - 56 : vheight;
    }

    var thres = -1;

    if (intheater || fullscreen) {
        if (floatheight > 0)
            thres = inpltop || fullscreen ? floatheight - 296 : floatheight - 240;
    }
    else
        if (small) {
            if (floatheight > 0)
                thres = floatheight - 220;
        }
        else {
            if (vheight > 0)
                thres = 1;
        }
	
	var scrollY = win.pageYOffset;
	if (fullscreen) { //in fullscreen the regular scroll value is not correct
		var ref = doc.getElementById("content");
		if (ref) scrollY = - ref.getBoundingClientRect().top;
	}

    if (scrollY >= thres && thres > 0) {		
        page.setAttribute("float", "");
        page.closest('#content')?.setAttribute("float", "");

        if (intheater || fullscreen)
            insertStyle("\
				ytd-watch-flexy[float] #player-theater-container {position: fixed !important; top:56px !important; z-index:1000 !important;\
                                                                           height: " + height + "px !important; max-height:" + height + "px !important; min-height:" + height + "px !important;}\
				ytd-watch-flexy[float] .html5-main-video {width: " + width + "px !important; height: " + height + "px !important; left: " + left + "px !important; top:0px !important; margin-left:0px !important;}\
                ytd-watch-flexy[float] #columns {margin-top: " + floatbot + "px !important;}\
				", "ytpc_style_float");
        else {
            var rtl = (doc.body.getAttribute('dir') == 'rtl');
            var lroff = "";
            if (small) {
				lroff = rtl ? "right:" + (W - width) + "px !important;" : "left:" + (W - width) + "px !important;";
                insertStyle("\
				ytd-watch-flexy[float] #player-container {position: fixed !important; top:56px !important; " + lroff + " width: " + width + "px !important; height: " + height + "px !important; z-index:1000 !important;}\
                ytd-watch-flexy[float] .html5-main-video {width: " + width + "px !important; height: " + height + "px !important;}\
				", "ytpc_style_float");
            }
            else {
				lroff = rtl ? "right: " + (W - vright) + "px !important;" : "left: " + vleft + "px !important;";
                insertStyle("\
                ytd-watch-flexy[float] #player-container {position: fixed !important; top:80px !important; " + lroff + " width: " + vwidth + "px !important; height: " + vheight + "px !important; z-index:1000 !important;}\
                ", "ytpc_style_float");
            }
        }
    }
    else
        reset_float();
}


//=================================================================
//ads & annotations

var adds_on = false;
var fs_on = false;

function skip_ads(start_count) {

    //adjust cinema after adds by forcing resize event
    if (get_pref("ytCine")) {
        if (start_count == 0) adds_on = false;
        var adds = doc.getElementsByClassName("video-ads ytp-ad-module");
        if (adds.length > 0) {
            if (adds[0].style.display != "none") {
                adds_on = true;
            }
        }
        else {
            if (adds_on) { //adds turned off
                //win.dispatchEvent(new Event('resize'));
                win.setTimeout(function () { win.dispatchEvent(new Event('resize')) }, 100);
            }
            adds_on = false;
        }
    }

	//fullscreen also forces resize event
	var fs = (docsearch("//ytd-page-manager/ytd-watch-flexy[@fullscreen]").snapshotLength > 0);
    if (fs != fs_on) {
        //win.dispatchEvent(new Event('resize'));
        win.setTimeout(function () { win.dispatchEvent(new Event('resize')) }, 100);
        //alert("fullscreen");
		float(0);
    }
    fs_on = fs;

    //main skip ads
    if (!get_pref("ytAds")) return;

    var button = doc.getElementsByClassName("ytp-ad-skip-button ytp-button");
    if (button.length > 0)
        if (button[0].parentNode)
            if (button[0].parentNode.style.display != "none") {
                //message("will click");
                simulClick(button[0]);
            }
}

function extra_ads() {
    insertStyle(get_pref("ytAdsExtra") ? style_extra_ads : "", "ytpc_style_extra_ads");
}

function annotation() {
    insertStyle(get_pref("ytAnnot") ? style_annotations : "", "ytpc_style_annotations");
}


//==================================================================
//Load More

function auto_load(start_count) {
    if (win.location.href.indexOf("watch?") == -1) return;

    var button = docsearch("//div[(@id='meta') or (@id='above-the-fold')]//tp-yt-paper-button[(@id='more') or (@id='expand')]").snapshotItem(0);
    if (!button) return;

    if (start_count < 2) {
        button.removeAttribute("buttonclicked");
        return;
    }

    if (!get_pref("ytLoad")) return;
    if (button.getAttribute("buttonclicked") == "true") return;

    button.setAttribute("buttonclicked","true");
    simulClick(button);
}


//==================================================================
// Main

var old_addr = win.location.href;
var nochanges_count = -1;
var start_count = -1;

ytplayer_script();
insertStyle(style_basic, "ytpc_style_basic");

win.addEventListener("focus", function () { reset_nochanges(); }, false);
win.addEventListener("blur", function () { reset_nochanges(); }, false);
win.addEventListener("resize", function () { reset_nochanges(); cinema(0); float(1); }, false);
win.addEventListener("scroll", function () { reset_nochanges(); cinema(0); float(1); }, false);
win.addEventListener("click", function (e) { reset_nochanges(); close_ytplayer_options(e); }, false);

function reset_nochanges() {
    nochanges_count = -1;
}

var pause_count=0

//main routine
var has_focus
function check_changes() {
    if (old_addr == win.location.href) {
        if (nochanges_count < 20) nochanges_count++;
        if (start_count < 20) start_count++;
    }
    else {
        old_addr = win.location.href;
        nochanges_count = 0;
        start_count = 0;
    }

    if (!has_focus) {
        has_focus = doc.hasFocus();
        if (has_focus) {
            nochanges_count = 0;
            start_count = 0;
        }
    }

    if (!~win.location.href.indexOf("watch?")){
      if (start_count < 20) {
        set_noloop();
        set_nopause_end();
        cinema(20); //for showmast
      }
    }else{
      skip_ads(start_count);
      float(start_count);
      if (start_count == 0) {
        close_ytplayer_options();
        adjust_loop();
        adjust_pause_end();
        fetch(document.URL).then(a=>a.text()).then(a=>documenttitle=a.match(/"title":"(.*?)"/)[1])
      }
      if (start_count < 20) {
        build_yt_control();
        annotation();
        extra_ads();
        auto_load(start_count);
      }

      if (nochanges_count < 20) {
        cinema(start_count);
      }
    }
    setTimeout(check_changes, 1000);
}
check_changes();
