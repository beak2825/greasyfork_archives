// ==UserScript==
// @name        YouTube Fill & Float Video
// @namespace   YouTubeFillFloat
// @version     1.0.0
// @license     MIT
// @description YouTube fill window with video, float video, zoom video.
// @author      Costas
// @match       http://www.youtube.com/*
// @match       https://www.youtube.com/*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @grant 		GM_unregisterMenuCommand
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/520851/YouTube%20Fill%20%20Float%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/520851/YouTube%20Fill%20%20Float%20Video.meta.js
// ==/UserScript==

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

var option_menu_command_ID = null;
var button_menu_command_ID = null;

function build_menu_commands() {
	if (option_menu_command_ID || button_menu_command_ID) return;
	if (doc.getElementById("ytpc_fromcontrolslink")) return;

	option_menu_command_ID = GM_registerMenuCommand("Options", function() {ytplayer_options(true);});
	
	if (get_pref("ytButton"))
		show_button_menu_command();
	else
		hide_button_menu_command();
}

function hide_button_menu_command() {
	if (get_pref("ytButton")) set_pref("ytButton", false);
	if (button_menu_command_ID) GM_unregisterMenuCommand(button_menu_command_ID);
	button_menu_command_ID = GM_registerMenuCommand("Show Cog Button",show_button_menu_command);
	build_yt_control();
}

function show_button_menu_command() {
	if (!get_pref("ytButton")) set_pref("ytButton", true);
	if (button_menu_command_ID) GM_unregisterMenuCommand(button_menu_command_ID);
	button_menu_command_ID = GM_registerMenuCommand("Hide Cog Button",hide_button_menu_command);
	build_yt_control();
}

function delete_menu_commands() {
	if (button_menu_command_ID) GM_unregisterMenuCommand(button_menu_command_ID);
	if (option_menu_command_ID) GM_unregisterMenuCommand(option_menu_command_ID);
	option_menu_command_ID = null;
    button_menu_command_ID = null;
}


//==================================================================
// Styles

var style_basic = "\
/* messages */\
.ytpc_message {position:fixed; top:0px; left:0px; font:12px/15px arial,sans-serif; color:white !important; background-color:black !important; margin:0px; padding:10px; border-radius:3px; z-index:2147483647;}\
.ytpc_message[hide] {display:none;}\
/* options */\
#ytpc_options_popup {direction:ltr; width:232px; box-shadow:0px 0px 6px 2px gray; font-size:11px; color:black; background:white; padding:5px; border-radius:5px; user-select:none; -moz-user-select:none;}\
#ytpc_options_popup.ytpc_popup_top {position:fixed; top:0px; right:10px; z-index:1000000;}\
#ytpc_options_popup.ytpc_popup_normal {position:absolute; top:5px; z-index:10;}\
body[dir='ltr'] #ytpc_options_popup.ytpc_popup_normal {right:5px;}\
body[dir='rtl'] #ytpc_options_popup.ytpc_popup_normal {left:5px;}\
html[dark] #ytpc_options_popup {color:#e0e0e0; background:#1b1b1b;}\
#ytpc_options_popup input {margin:3px 2px -2px 5px !important;}\
.ytpc_options_group {margin:5px 0px;}\
.ytpc_options_group.space {padding:3px 0px; border:1px solid lightgray; border-radius:4px;}\
html[dark] .ytpc_options_group.space {border:1px solid #606060 !important;}\
.ytpc_options_group.space *[hide] {color:steelblue; margin-left:7px;}\
.ytpc_options_group[hide] *[hide] {opacity:0.5;}\
.ytpc_options_group.column > span:first-child {display:inline-block; min-width:100px;}\
.ytpc_options_text {font-weight:500; font-size:12px; margin-left:5px; margin-top:7px;}\
.ytpc_options_close {font-size:14px; color:#ff8888; position:absolute; top:0px; right:4px; cursor:pointer;}\
.ytpc_options_close:hover {font-weight:bold; color:red;}\
.ytpc_options_title {font-weight:500; font-size:14px; padding:3px 5px !important;}\
.ytpc_float_button {margin-left: 5px; padding:1px 3px; background-color:gray; color:white !important; border-radius:2px; opacity:0.7;}\
.ytpc_float_button:hover {opacity:1;}\
/* cog button */\
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
/* chat container */\
#content[ytpc_cinema] #panels-full-bleed-container {display:none !important;}\
#content[ytpc_cinema] #chat-container {display:none !important;}\
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

var message_timeout_ID;

function message(str, time) {
	var node = doc.getElementById("ytpc_message_node");
	if (!node) 
		node = newNode("div", "ytpc_message_node", "ytpc_message", doc.body);
	node.removeAttribute("hide");
    node.textContent = str + "\n";
	
	if (time) {
		clearTimeout(message_timeout_ID);
		message_timeout_ID = setTimeout(function () {
				var n = doc.getElementById("ytpc_message_node");
				if (n)
					n.setAttribute("hide","true");
			}, 
			time);
	}
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


//==============================================================
//preferences

init_pref("ytCine", true);
init_pref("ytStretch", true);
init_pref("ytHide", true);
init_pref("ytFloat", true);
init_pref("ytFSmall", true);
init_pref("ytFloatPos",1);
init_pref("ytZoom", false);
init_pref("ytButton", true);

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


function new_checkbox(prefname, str, node_kind, title, parent, value, func, hide1, hide2) {
    var div = newNode(node_kind, null, "ytpc_generic", parent);
	if (title) div.title = title;
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

function new_float_pos_button(title, parent){
	var span = newNode("span", null, "ytpc_float_button", parent);
	if (title) span.title = title;
	span.textContent = "Corner "+ get_pref("ytFloatPos");
	
	span.onclick = function(e) {
		var val = get_pref("ytFloatPos")+1;
		if (val == 5) val=1;
		set_pref("ytFloatPos",val);
		this.textContent = "Corner "+ get_pref("ytFloatPos");
	}
}


function ytplayer_options(top) {
    var popup = doc.getElementById("ytpc_options_popup");
    if (popup) return;

	if (top)
		popup = newNode("div", "ytpc_options_popup", "ytpc_popup_top", doc.body);
	else {
		var parent = doc.getElementById("ytpc_ytcontrol_container");
		if (!parent) return;
		popup = newNode("span", "ytpc_options_popup", "ytpc_popup_normal", parent);
	}
	
    var title_node = newNode("div", null, "ytpc_options_title", popup);
    title_node.textContent = "Fill & Float Options";

    var closemark = newNode("span", null, "ytpc_options_close", popup);
    closemark.textContent = "\u2716";
    closemark.title = "close";
    closemark.onclick = function (e) { e.stopPropagation(); close_ytplayer_options(); }

    var groupCine = newNode("div", null, "ytpc_options_group space", popup);
    new_checkbox("ytCine", "Fill Window", "span", "fits video horizontally in window", groupCine, null, function () { resetTheaterMode(); cinema(0); }, true, false);
    new_checkbox("ytStretch", "Stretch", "span", "fills the whole viewing area", groupCine, null, function () { cinema(0); }, false, true);
    new_checkbox("ytHide", "Hide Search", "span", "auto hides the search bar at top", groupCine, null, function () { cinema(1); }, false, true);

    var groupFloat = newNode("div", null, "ytpc_options_group column", popup);
    new_checkbox("ytFloat", "Float Video", "span", "float video while scrolling", groupFloat, null, function () { float(0); }, true, false);
    new_checkbox("ytFSmall", "Small Float", "span", "small size floating video", groupFloat, null, null, false, true);
	new_float_pos_button("click to change float position\n", groupFloat);
	
	var groupKeys = newNode("div", null, "ytpc_options_group column", popup);
	new_checkbox("ytZoom", "Pan and Zoom", "span", "Pan and Zoom in fill window mode\nZoom: Z zoom-in, X zoom-out\nPan: G left, H right, Y up, B down\nReset: ESC or CTRL+SHIFT", groupKeys, null, function() {cinema(0);});
}


function build_yt_control() {
		if (get_pref("ytButton")) {
			var parent = doc.getElementById("ytpc_ytcontrol_container");
			if (parent) return;
		
			//button container
			//var pp = null;
			var pp = doc.getElementById("below");
		
			if (!pp) pp = doc.getElementById("primary-inner");
		
			if (!pp) return;

			parent = newNode("span", "ytpc_ytcontrol_container", null, pp, 'first');
			var node = newNode("span", "ytpc_cog_container", null, parent);
			var control = newNode("span", "ytpc_ytcontrol_button", null, node);

			control.title = "Fill & Float Options";
			control.onclick = function() {ytplayer_options(false);};
		}
		else {
			var node = doc.getElementById("ytpc_ytcontrol_container");
			if (node) node.parentElement.removeChild(node);
		}
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
            mastoffset.parentNode.removeAttribute("ytpc_top");
    }
}

function hidemast(movetop) {
    var mastoffset = doc.getElementById("masthead-container");
    if (mastoffset) {
        mastoffset.setAttribute("ytpc_hide", "");
        if (movetop)
            mastoffset.parentNode.setAttribute("ytpc_top", "");
    }
}

var search_height = 56;
var key_left_offset = 0;
var key_up_offset = 0;
var key_zoom = 1;

var mouseLastX = 0;
var mouseLastY = 0;
var mouseIsDown = false;
var mouseMoved = false;
var mouseRegistered = false;

function reset_key_offset_zoom() {
	key_left_offset = 0;
	key_up_offset = 0;
	key_zoom = 1;
	
	mouseLastX = 0;
	mouseLastY = 0;
	mouseIsDown = false;
	mouseMoved = false;
}

function cinema(start_count) {
	if (start_count == 0) {
		reset_key_offset_zoom();
	}
	
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
        page.parentNode.parentNode.setAttribute("ytpc_cinema", "");
    else
        page.parentNode.parentNode.removeAttribute("ytpc_cinema");

	//check at most 5 times
    if (start_count >= 5) return;

    var hide = get_pref("ytHide") || fullscreen;
	
	if (hide && !fullscreen) { //hide or show search bar
		hidemast(true);
		if (win.pageYOffset > 0)
            showmast(true);
    }
    else
        showmast(false);

    var H = doc.documentElement.clientHeight || doc.body.clientHeight;
    var W = doc.documentElement.clientWidth || doc.body.clientWidth;
	var view_height = H - (hide ? 0 : search_height); //visible height, adjust for search bar
	var view_width = W;
	var view_ratio = view_width / view_height;

    var pl = docsearch("//ytd-watch-flexy//*[contains(@class,'html5-main-video')]").snapshotItem(0);
    if (!pl) return;
	registerMouse(pl);
	
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
			//top = -(height - view_height) / 2;
			view_height = height;
			if (hide && (!fullscreen) && (view_height <= H - search_height))
				showmast(false);
		}
	}
	
	var zheight = height * key_zoom;
	var zwidth = width * key_zoom;
	var ztop = -(zheight - height) / 2;
	var zleft = -(zwidth - width) / 2;
	height = zheight;
	width = zwidth;
	top = top + ztop + key_up_offset*key_zoom;
	left = left + zleft + key_left_offset*key_zoom;
	
	height = Math.round(height);
    width = Math.round(width);
	left = Math.round(left);
	top = Math.round(top);
	
	insertStyle("\
		ytd-watch-flexy[theater]:not([float]) #full-bleed-container {height:" + view_height + "px !important; min-height:" + view_height + "px !important; max-height:" + view_height + "px !important;}\
		ytd-watch-flexy[theater]:not([float]) .html5-main-video {width:" + width + "px !important; min-width:" + width + "px !important; max-width:" + width + "px !important; height:" + height + "px !important; min-height:" + height + "px !important; max-height:" + height + "px !important; left:" + left + "px !important; top:" + top + "px !important;}\
		", "ytpc_style_cinemode");
}

var pl_mouseover = false;
var pl_mouse_events_started = false;

function pl_reset_mouseevents() {
	pl_mouseover = false;
	pl_mouse_events_started = false;
}

function pl_enable_mouseevents() {
	var node = doc.getElementById("ytd-player");
	if (!node) {
		pl_reset_mouseevents();
		return;
	}
	
	if (!pl_mouse_events_started) {
		node.addEventListener("mouseover", function (e) {pl_mouseover = true;});
		node.addEventListener("mouseenter", function (e) {pl_mouseover = true;});
		node.addEventListener("mousemove", function (e) {pl_mouseover = true;});
		node.addEventListener("mouseleave", function (e) {pl_mouseover = false;});
		node.addEventListener("mouseout", function (e) {pl_mouseover = false;});
		
		pl_mouse_events_started = true;
	}
}

var key_message_timeout = 2000;

var key_shift_offset_value = 50;
var key_zoom_value = 0.1;

doc.addEventListener('keydown', keyDownShift, false);
  
function keyDownShift(event) {
	if (!pl_mouseover || !get_pref("ytCine") || !get_pref("ytZoom")) return;
	
    var name = event.key;
    var code = event.code;
	//message(name);
	//message(code);
	switch (code) {
		case "KeyG" : shiftPlayer(key_shift_offset_value,0); break; //shift left
		case "KeyH" : shiftPlayer(-key_shift_offset_value,0); break;//shift right
		case "KeyY" : shiftPlayer(0,key_shift_offset_value); break; //shift up
		case "KeyB" : shiftPlayer(0,-key_shift_offset_value); break; //shift down
		case "KeyZ" : ZoomIn(); break;
		case "KeyX" : ZoomOut(); break;
	}
	
	if (name == "Escape") shiftReset(true);
	
    if (event.ctrlKey) {
		//message(code);
		switch (code) {
			case "ShiftLeft" :
			case "ShiftRight" : shiftReset(); break;
		}
    }
	
	//event.stopImmediatePropagation();
}

function shiftPlayer(x,y) {
	key_left_offset += x;
	key_up_offset += y;
	message("Pan X=" + key_left_offset + " Y=" + key_up_offset, key_message_timeout);
	cinema(1);
}

function ZoomIn() {
	key_zoom += key_zoom_value;
	message("Zoom In " + (Math.round(key_zoom * 10) / 10).toFixed(1), key_message_timeout);
	cinema(1);
}

function ZoomOut() {
	key_zoom -= key_zoom_value;
	if (key_zoom < 1) key_zoom = 1;
	message("Zoom Out " + (Math.round(key_zoom * 10) / 10).toFixed(1), key_message_timeout);
	cinema(1);
}

function shiftReset(NOmsg) {
	reset_key_offset_zoom();
	if (!NOmsg) message("Reset Pan & Zoom X=" + key_left_offset + " Y=" + key_up_offset + " Zoom=" + key_zoom, key_message_timeout);
	cinema(1);
}

function registerMouse(node) {
	if (!get_pref("ytCine") || !get_pref("ytZoom")) return;
	
	if (mouseRegistered) return;
	mouseRegistered = true;
	
	node.addEventListener("mousemove", function (e) {
		if(mouseIsDown) {
			if (get_pref("ytCine") && get_pref("ytZoom")) {
				var diffX = e.pageX - mouseLastX;
				var diffY = e.pageY - mouseLastY;
				shiftPlayer(diffX, diffY);
				if (diffX != 0 || diffY !=0 ) 
					mouseMoved = true;
			}
			mouseLastX = e.pageX;
			mouseLastY = e.pageY;
	   }
	}, false);

	node.addEventListener("mousedown", function (e) {
		mouseIsDown = true;
		mouseMoved = false;
		mouseLastX = e.pageX;
		mouseLastY = e.pageY;
	}, false);

	node.addEventListener("mouseup", function (e) {
		mouseIsDown = false;
	}, false);
	
	node.addEventListener("mouseout", function (e) {
		mouseIsDown = false;
		mouseMoved = false;
	}, false);
	
	node.addEventListener("click", function (e) {
		if (mouseMoved) {
			//e.preventDefault();
			//e.stopPropagation();
			e.stopImmediatePropagation();
			mouseMoved = false;
		}
	}, false);
}


//==================================================================
// Float

var floatheight = 0;
var floatbot = 0;

function reset_float() {
    var page = docsearch("//ytd-page-manager/ytd-watch-flexy").snapshotItem(0);
    if (!page) return;

    if (page.getAttribute("float") != null) setTimeout(function () { win.dispatchEvent(new Event('resize')) }, 100);
    page.removeAttribute("float");
    page.parentNode.parentNode.removeAttribute("float");
    insertStyle("", "ytpc_style_float");
    floatheight = 0;
    floatbot = 0;
}


function float(start_count) {
	if (start_count == 0) reset_float();
	
    if (!get_pref("ytFloat")) return;
    var small = get_pref("ytFSmall");
	var flpos = get_pref("ytFloatPos");
    var cine = get_pref("ytCine");

    var page = docsearch("//ytd-page-manager/ytd-watch-flexy").snapshotItem(0);
    if (!page) return;

    var intheater = page.getAttribute("theater") != null;
    var fullscreen = page.getAttribute("fullscreen") != null;
	if (start_count == 20 && !fullscreen) return;
	
    var vid = intheater || fullscreen ? docsearch("//*[@id='full-bleed-container']").snapshotItem(0)
        : docsearch("//*[@id='primary-inner']/*[@id='player']").snapshotItem(0);
    if (!vid) return;

    var val = vid.getBoundingClientRect();
    var vwidth = val.right - val.left;
    var vheight = val.bottom - val.top;
    var vleft = val.left;
    var vright = val.right;

    //player dimensions for fill window float
    var W = doc.body.clientWidth || doc.documentElement.clientWidth;
	var H = doc.body.clientHeight || doc.documentElement.clientHeight;
    var height = 240;
    var width = 427;
    var left = Math.round((W - width) / 2);

    var infloat = page.getAttribute("float") != null;
    var inpltop = (docsearch("//*[@ytpc_top]").snapshotLength > 0);

    //store initial values
    if (!infloat) {
        floatheight = vheight;
        floatbot = inpltop ? vheight - search_height : vheight;
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
        page.parentNode.parentNode.setAttribute("float", "");

        if (intheater || fullscreen)
            insertStyle("\
				ytd-watch-flexy[float] #full-bleed-container {position: fixed !important; top:56px !important; z-index:1000 !important;\
                                                                           height: " + height + "px !important; max-height:" + height + "px !important; min-height:" + height + "px !important;}\
				ytd-watch-flexy[float] .html5-main-video {width: " + width + "px !important; height: " + height + "px !important; left: " + left + "px !important; top:0px !important; margin-left:0px !important;}\
                ytd-watch-flexy[float] #columns {margin-top: " + floatbot + "px !important;}\
				", "ytpc_style_float");
        else {
            var rtl = (doc.body.getAttribute('dir') == 'rtl');
            var lroff = "";
            if (small) {
				var hoff = (flpos == 1 || flpos == 4) ? W - width : 0;
				var voff = (flpos == 1 || flpos == 2) ? H - height : 56;
				lroff = rtl ? "right:" + hoff + "px !important;" : "left:" + hoff + "px !important;";
				
                insertStyle("\
				ytd-watch-flexy[float] #player-container {position: fixed !important; top: " + voff + "px !important; " + lroff + " width: " + width + "px !important; height: " + height + "px !important; z-index:1000 !important;}\
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


//==================================================================
// Main

var old_addr = win.location.href;
var nochanges_count = -1;
var start_count = -1;
var has_focus = false;


//ytplayer_script();
insertStyle(style_basic, "ytpc_style_basic");

win.addEventListener("focus", function () { reset_nochanges(); cinema(1); float(1); }, false);
win.addEventListener("blur", function () { reset_nochanges(); cinema(1); float(1); }, false);
win.addEventListener("resize", function () { reset_nochanges(); cinema(1); float(1); }, false);
win.addEventListener("scroll", function () { reset_nochanges(); cinema(1); float(1); }, false);
win.addEventListener("click", function (e) { reset_nochanges(); cinema(1); float(1); close_ytplayer_options(e); }, false);

function reset_nochanges() {
    nochanges_count = -1;
}

//main routine
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

    //no video page
    if (win.location.href.indexOf("watch?") == -1) {
        if (start_count < 20) {
			pl_reset_mouseevents();
            cinema(20); //for showmast
			delete_menu_commands();
        }
        return;
    }

    //video page
	float(start_count);

    if (start_count < 20) {
        if (start_count == 0) {
            close_ytplayer_options();
        } 
        build_yt_control();
		pl_enable_mouseevents();
		if (start_count > 0) build_menu_commands();
    }

    if (nochanges_count < 20) {
        cinema(start_count);
    }
}

//alert("hello");
setInterval(check_changes, 1000);
check_changes();