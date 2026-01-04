// ==UserScript==
// @name         YouTube Preview 2020
// @namespace    YouTubeRatings+Preview2019
// @version      2019.04.29
// @description  Instant video previews in popup player by hovering or clicking video thumbs. Video ratings and resolution data no longer shown on the thumbs. This is a fork of Costas' original with Arantius' GM4-Polyfill js.
// @author       Livadas
// @match        http://www.youtube.com/*
// @match        https://www.youtube.com/*
// @require     https://code.jquery.com/jquery-3.2.1.min.js
// @require https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.xmlHttpRequest
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/377529/YouTube%20Preview%202020.user.js
// @updateURL https://update.greasyfork.org/scripts/377529/YouTube%20Preview%202020.meta.js
// ==/UserScript==

//==================================================================
//Rating thresholds

//var red_threshold = 50;
//var orange_threshold = 70;

//==================================================================
//Userscript specific functions

var doc = document;
var win = window;

if (win.frameElement) throw new Error("Stopped JavaScript.");

//new YT format
var NEWYT = doc.body.id != 'body';
NEWYT ? doc.body.setAttribute("newyt", "") : doc.body.setAttribute("oldyt", "");

function set_pref(preference, new_value) {
    GM.setValue(preference, new_value);
}

function get_pref(preference) {
    return GM.getValue(preference);
}

function init_pref(preference, new_value) {
    var value = get_pref(preference);
    if (value == null) {
        set_pref(preference, new_value);
        value = new_value;
    }
    return value;
}


function httpReq(url, callback, param1, param2, param3, param4) {
    //message(url);

    GM.xmlHttpRequest({
        method: "GET",
        url: url,
        onload: function (response) {
            //message(response.responseText);
            callback(response.responseText, param1, param2, param3, param4);
        }
    });
}


//function httpReq(url, callback, param1, param2, param3, param4) {
//    //message(url);
//    if (!win.XMLHttpRequest) return;
//    var xhttp = new win.XMLHttpRequest();
//    xhttp.onreadystatechange = function () {
//        if (this.readyState == 4 && this.status == 200) {
//            callback(this.responseText, param1, param2, param3, param4);
//        }
//    };
//    xhttp.open("GET", url, true);
//    xhttp.send();
//}

GM_registerMenuCommand("YouTube Preview Options", pref_popup_open);


//==================================================================
//==================================================================


//==================================================================
// Styles

var style_basic = "\
/* messages */\
#vpp_message {position:fixed; top:0px; left:0px; font:14px/20px Roboto,arial,sans-serif; text-align:left; white-space:pre; color:black; background:beige; padding:20px; z-index:2147483647;}\
/* prefs */\
#vpp_pref_popup {direction:ltr; font:11px/11px Roboto,arial,sans-serif; position:fixed; right:0px; top:0px; color:#e0e0e0; background:#202020; padding:15px 15px 15px 10px; border-radius:3px; box-shadow:0px 0px 5px 1px gray; /*z-index:2147483647;*/ z-index:2147483646;}\
.vpp_pref_group {margin-left:15px; color:yellow;}\
#vpp_pref_close {font:14px/14px Roboto,arial,sans-serif; color:lightgray; position:absolute; top:3px; right:5px; cursor:pointer; user-select:none; -moz-user-select:none;}\
#vpp_pref_close:hover {color:white;}\
#vpp_pref_title {font:500 13px/13px Roboto,arial,sans-serif; padding:5px !important;}\
#vpp_pref_button {cursor:pointer; width:18px; height:18px; background-size:contain; background-repeat:no-repeat; opacity:0.7; position:absolute; right:0px; top:0px; user-select:none; -moz-user-select:none;}\
#vpp_pref_button:hover {opacity:1;}\
#vpp_pref_button {background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAeUlEQVR42u2UwQ2AMAwDk52YCWaCmdgp7QshKP6QKn7Yv0pudEqcuBXLBXB/7GaBzFv3Z3k+AdYY/z3cr+IZHgywPCZzxrv4T48AyAFAeKaH0ICmr2GFuDpAkQGOLRBAOQAIjw5Rtrg6QJEBji0QQDkACI8OUbYE0ADbonowcNn6sgAAAABJRU5ErkJggg==');}\
#vpp_pref_delay_text {margin-left:20px; color:khaki;}\
#vpp_pref_delay_num {margin-left:3px; color:khaki;}\
.vpp_pref_delay_plusminus {margin-left:5px; cursor:pointer; text-align:center; font-weight:800; color:black; background:#B0B0B0; border-radius:2px; display:inline-block; width:10px; user-select:none; -moz-user-select:none;}\
.vpp_pref_delay_plusminus:hover {background:#D0D0D0;}\
#vpp_pref_delay_plus {margin-left:2px;}\
#vpp_pref_delay_minus {margin-left:5px;}\
/* meta data */\
.vpp_meta_def_container {font:500 11px/13px Roboto,arial,sans-serif; position:absolute; top:0px; left:0px; background:#e8e8e8; padding:0px 3px; border-radius:2px; opacity:0.9; display:none; cursor:default;}\
html[dark] .vpp_meta_def_container {background:#202020 !important;}\
.vpp_meta_def_container[reveal] {display: block;}\
.vpp_meta_def_container[space] .vpp_meta_def_hd {margin-right:2px;}\
body[oldyt] .vpp_meta_def_container {z-index:10 !important;}\
.vpp_meta_def_format {position:relative; color:black;}\
 html[dark] .vpp_meta_def_format {color:#f0f0f0 !important;}\
.vpp_meta_def_hd {position:relative;}\
.vpp_meta_def_hd.HD {color:magenta;}\
.vpp_meta_def_hd.UHD {color:red;}\
.vpp_meta_rate {direction:ltr; font:500 11px/13px Roboto,arial,sans-serif; position:absolute; top:0px; right:0px; background:green; color:white; opacity:0.9; padding:0px 3px; border-radius:2px; cursor:default;}\
.vpp_meta_rate[bad] {background:red !important;}\
.vpp_meta_rate[med] {background:darkorange !important;}\
body[oldyt] .vpp_meta_rate {z-index:10 !important;}\
body[newyt][dir='ltr'] [vpp_meta_rate] ytd-thumbnail-overlay-toggle-button-renderer, body[newyt][dir='rtl'] [vpp_meta_def] ytd-thumbnail-overlay-toggle-button-renderer {margin-top:12px !important;}\
#vpp_meta_box {position:relative; float:left; height:13px; margin-top:3px;}\
#vpp_meta_box .vpp_meta_def_container {background:none !important; position:relative; clear:none; float:left;}\
#vpp_meta_box .vpp_meta_rate {position:relative; clear:none; float:right; margin-left:5px;}\
#gridtube_title_container {position:absolute; top:5px; right:5px;}\
body[dir='rtl'] #gridtube_title_container {left:5px !important; right:auto !important;}\
body[newyt] ytd-video-primary-info-renderer {position:relative !important;}\
/* play button*/\
#vpp_now_playing {font:500 14px/14px Roboto,arial,sans-serif; position:absolute; bottom:0px; left:0px; background:red; color:white; padding:5px; cursor:default; z-index:0;}\
body[dir='rtl'] #vpp_now_playing {left:auto !important; right:0px !important;}\
body[oldyt] #vpp_now_playing {z-index:10 !important;}\
body[vpp_reveal_play_button] .vpp_play_button, *[vpp_play_marked]:hover .vpp_play_button {visibility:visible !important;}\
.vpp_play_button_container {position:absolute; bottom:0px; left:0px; width:100%; visibility:hidden;}\
body[oldyt] .vpp_play_button_container {z-index:11 !important;}\
.vpp_play_button {visibility:hidden !important; display:block !important; position:relative !important; padding-bottom:1px !important; margin:0px auto !important; width:25px !important; height:25px !important;\
                  opacity:0.75 !important; cursor:pointer !important; background-size:25px !important; background-repeat:no-repeat !important; text-decoration:none !important; z-index:1; user-select:none; -moz-user-select:none;}\
.vpp_play_button:hover {opacity:1 !important;}\
.vpp_play_button {background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAG7AAABuwBHnU4NQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAOqSURBVFiF5ZdPSBxnGMZ/M98s1V1nV01A17VZUwMRqsGY9FyQlBJQ2gYPIbaB0nMgwYZWeumxIQhlT7aQW0Mhl54CvQQiISQhkixN\
bWKXaNSaYuzu6v4Z98+38/WgY9Vu9l835NAHvsvM983zvs/7vPPOaEopXif018oOGAAfjY4GgEvAu0DnK+b8A5gCvvjp6tVl7cMzZ94EwkArgM/n42BXF7peX3Fs22b+2TPW19edSzGg3wAmgFbTNPlybIyDBw7UlXgv5hcX+WZigmQy2QpMiJ6+vhDQ9Pn587wVDGLb9itdXtOku7ubW7dvA+wzgHa3201XMEg2nyebzyOlpN69oQGG\
YfCGy0VXMIjb7cayrHYDoDMQIJPLkUynKdh2nal3Q+g6psdDZyDA75HIZhcoIJFKIQuFkofz2SxCCHTDqDkA27ZJpFLbCusAuVyOvJQopUquWDzO5OQkfy4vl91bauWlJJfL/ROAlLJiEy0sLfFtKMTP16+TsayazSilBLZeRI405aBsm8JWmW7cvMn0gweMnDrFocOHay7JpgeUqiiAQqGwHQBALB7n+ytXONLXx/DQEKbPVzGxM4Oq\
U0CpXQE4eBgOMzMzwwfDwwwcO1aVSatSwN5Rgr1TVErJj9eucefuXUZGRmjz+8smAzumYUXmKRSQUiKl3C7H3vV0fp5Lly9za2oKrcRzdylQLKOiCkDREuzFe4ODfDo6yloqxUo0WnJvzSUohg6/n/GxMXp6eogsLJDd6vViqM2ELwlACMHHp0/z2dmzLK2s8MvsbNlnOai6DZ0XiIMjvb18PT6Ox+vl4ZMnFZXI4dwOAKpvwyaPhwvn\
zjF08iSzc3Msrq5WRLwX28OoGg+8f+IEX128SMKyuBcO1zS6nTObClRYAndjI9+FQvT29vJbJMJGNlsDtRPBjhLouo6tFFqZM/v278dsamL60aPaidnM3vnmNIQQaEKwYVk0NDSUPJhMp0mm0/+JHCCTyaALgcswMLymqWwptfVEgkwmg9vtRgiBppXTozo4BrYsi2wuh7JtvF6vMjra21+sRqNtqVSKtKYRi8frSvyyYDSgw+9/YRw/\
evTpnfv329aiUQyXC+qceRF2lG3T0tzM8f7+OW3m8eP++NrajXvT061SSqRSZb8Ny6FoCpqGEIIGw8DlcvHOwEC82ecb1JRS/BWLvZ1MJn/I5/N+lGpUOwxQSo+SPtm6968dmrbhEuK51zQ/aWlp+VX73/8d/w3y7NP9Di2fPgAAAABJRU5ErkJggg==') !important;}\
/* preview player */\
#vpp_player_area {position:fixed; width:100%; height:100%; top:0px; left:0px; background:rgba(0,0,0,0.5); overflow:hidden !important; z-index:2147483646 !important;}\
#vpp_player_area2 {position:relative; width:100%; height:100%; visibility:hidden;}\
#vpp_player_box {position:absolute; background:#606060; box-shadow:0px 0px 8px 3px rgba(128,128,128,0.9); border-radius:5px 5px 0px 0px; max-width:100%; max-height:100%;}\
#vpp_player_box[player_pos='00']:not([player_size='fit']) {top:0px; left:0px;}\
#vpp_player_box[player_pos='01']:not([player_size='fit']) {top:0px; left:0px; right:0px; margin:auto;}\
#vpp_player_box[player_pos='02']:not([player_size='fit']) {top:0px; right:0px;}\
#vpp_player_box[player_pos='10']:not([player_size='fit']) {top:0px; bottom:0px; left:0px; margin:auto;}\
#vpp_player_box[player_pos='11']:not([player_size='fit']) {top:0px; bottom:0px; left:0px; right:0px; margin:auto;}\
#vpp_player_box[player_pos='12']:not([player_size='fit']) {top:0px; bottom:0px; right:0px; margin:auto;}\
#vpp_player_box[player_pos='20']:not([player_size='fit']) {bottom:0px; left:0px;}\
#vpp_player_box[player_pos='21']:not([player_size='fit']) {bottom:0px; left:0px; right:0px; margin:auto;}\
#vpp_player_box[player_pos='22']:not([player_size='fit']) {bottom:0px; right:0px;}\
#vpp_player_box[player_pos='right']:not([player_size='fit']) {float:right;}\
#vpp_player_box[player_size='xxsmall'] {/*320x180*/ width:320px; height:200px;}\
#vpp_player_box[player_size='xsmall'] {/*512x288*/ width:512px; height:308px;}\
#vpp_player_box[player_size='small'] {/*768x432*/ width:768px; height:452px;}\
#vpp_player_box[player_size='medium'] {/*1024x576*/  width:1024px; height:596px;}\
#vpp_player_box[player_size='large'] {/*1280x720*/ width:1280px; height:740px;}\
#vpp_player_box[player_size='xlarge'] {/*1600x900*/ width:1600px; height:920px;}\
#vpp_player_box[player_size='xxlarge'] {/*1920x1080*/ width:1920px; height:1100px;}\
#vpp_player_box[player_size='fit'] {width:100%; height:100%; border-radius:0px !important;}\
#vpp_player_holder {position:relative; width:100%; height:100%;}\
#vpp_player_holder2 {position:absolute; top:20px; left:0px; right:0px; bottom:0px; margin:auto; background:black;}\
#vpp_player_box[player_size='fit'] #vpp_player_holder2 {left:0px !important; right:0px !important;}\
#vpp_player_frame {position:relative; width:100%; height:100%; display:block; border:0px;}\
#vpp_player_button_area_top {direction:ltr; font:500 14px/20px Roboto,arial,sans-serif; color:#101010; position:absolute; top:-2px; left:10px;}\
#vpp_player_button_area_next {font:500 19px/20px Roboto,arial,sans-serif; color:#101010; position:absolute; top:0px; right:35px;}\
.vpp_player_button {position:relative; cursor:pointer; padding:0px 5px; user-select:none; -moz-user-select:none;}\
.vpp_player_button[button_kind='plus'], .vpp_player_button[button_kind='minus'] {font:500 20px/20px Roboto,arial,sans-serif !important; top:2px;}\
.vpp_player_button[button_kind='left'] {padding:0px 2px 0px 5px;}\
.vpp_player_button[button_kind='right'] {padding:0px 2px;}\
.vpp_player_button[button_kind='up'] {padding:0px 2px;}\
.vpp_player_button[button_kind='down'] {padding:0px 5px 0px 2px;}\
.vpp_player_button:hover {color:#E0E0E0;}\
#vpp_player_close_mark {font:14px/20px Roboto,arial,sans-serif; position:absolute; top:0px; right:5px; cursor:pointer; user-select:none; -moz-user-select:none;}\
#vpp_player_close_mark:hover {color:#E0E0E0;}\
/* float preview */\
#vpp_float_box {position:absolute; box-shadow:0px 0px 8px 3px rgba(128,128,128,0.9); background:black; z-index:2147483647;}\
#vpp_float_frame {position:relative; width:100%; height:100%; border:0px;}\
/* player options */\
#vpp_player_options_popup {direction:ltr; position:absolute; left:0px; top:0px; font:11px/11px Roboto,arial,sans-serif; color:white; background:linear-gradient(#888888,#787878); padding:5px; border-radius:5px; /*z-index:2147483647;*/ z-index:2147483646;}\
.vpp_player_options_text {font-weight:500; margin-left:5px; margin-top:7px; color:lemonchiffon;}\
.vpp_player_options_close {font:14px/14px Roboto,arial,sans-serif; color:black; position:absolute; top:3px; right:5px; cursor:pointer; user-select:none; -moz-user-select:none;}\
.vpp_player_options_close:hover {color:lightgray;}\
.vpp_player_options_title {font:500 13px/13px Roboto,arial,sans-serif; padding:3px !important; color:lemonchiffon;}\
/*other*/\
.watched .video-thumb {opacity:1 !important;}\
.yt-subscribe-button-right {margin-top:12px !important;}\
.pl-video .pl-video-thumbnail,\
.pl-video .pl-video-thumb,\
.pl-video .yt-thumb {width: 120px !important;}\
.pl-video .yt-thumb-clip > img {width:120px !important; height:auto !important;}\
.pl-video-time .timestamp {padding-top:18px !important;}\
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
    var node = doc.getElementById("vpp_message");
    if (!node) node = newNode("div", "vpp_message", null, doc.body);
    node.textContent = str + "\n";
}


function insertStyle(str, id, sdoc) {
    var styleNode = null;
    var ldoc = sdoc;
    if (!ldoc) ldoc = doc;

    if (id != null) {
        styleNode = ldoc.getElementById(id);
    }

    if (styleNode == null) {
        styleNode = newNode("style", id, null, ldoc.head);
        styleNode.setAttribute("type", "text/css");
    }

    if (styleNode.textContent != str)
        styleNode.textContent = str;
}


function injectScript(str, src, sdoc) {
    var ldoc = sdoc;
    if (!ldoc) ldoc = doc;
    var script = ldoc.createElement("script");
    if (str) script.textContent = str;
    if (src) script.src = src;
    ldoc.head.appendChild(script);
    if (!src) ldoc.head.removeChild(script);
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


function simulClick(el) {
    var clickEvent = doc.createEvent('MouseEvents');
    clickEvent.initEvent('click', true, true);
    clickEvent.artificialevent = true;
    el.dispatchEvent(clickEvent);
}


function jmessage(json) {
    message(JSON.stringify(json, null, '                  '));
}


function filter(str, w, delim) {
    if (str == null) return null;

    var r = null;
    var m = str.match(RegExp("[" + delim + "]" + w + "[^" + delim + "]*"));
    if (m != null) {
        r = m[0];
        r = r.replace(RegExp("[" + delim + "]" + w), "");
    }
    return r;
}


function number_comma(str) {
    if (str == null) return null;

    return str.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}


//returns object with fields: size, format, HD, UHD
function extract_resolution(txt) {
    if (txt == null) return null;

    //message(txt);

    var str = filter("%" + txt, "26size%3D", "%");
    if (str == null || str == "") {
        str = filter("&" + txt, "fmt_list=", "&?");
    }

    if (str == null) return null;

    //message(str);

    var m = str.match(/([0-9])+x([0-9])+/);

    if (m == null) return null;

    if (m.length == 0) return null;

    var pos_max = -1;
    var format_max = "";
    var int0_max = -1;
    var int1_max = -1;

    for (var i = 0; i < m.length; i++) {
        var size = m[i];
        var nums = size.split("x");
        var int1 = parseInt(nums[1]);

        if (int1 > int1_max) {
            pos_max = i;
            format_max = nums[1];
            int0_max = parseInt(nums[0]);
            int1_max = int1;
        }
    }

    var ret = new Object();
    ret.size = m[pos_max];
    ret.format = format_max;
    ret.HD = ((int0_max >= 1280) || (int1_max >= 720));
    ret.UHD = (int0_max >= 7680) ? '8K' : (int0_max >= 5120) ? '5K' : (int0_max >= 3812) ? '4K' : null;
    //jmessage(ret);

    return ret;
}


//==============================================================
//preferences

var pref_floatEnable = init_pref("floatEnable", true);
var pref_floatDelay = init_pref("floatDelay", 1);
var pref_playerEnable = init_pref("playerEnable", true);
var pref_rateEnable = init_pref("rateEnable", true);
var pref_defEnable = init_pref("defEnable", true);
var pref_iconEnable = init_pref("iconEnable", true);


function new_plusminus(prefname, str, parent) {
    var div = newNode("div", null, "vpp_generic", parent);
    var txt = newNode("span", "vpp_pref_delay_text", null, div);
    txt.textContent = str;
    var num = newNode("span", "vpp_pref_delay_num", null, div);
    num.textContent = get_pref("floatDelay").toString() + "s";
    var minus = newNode("span", "vpp_pref_delay_minus", "vpp_pref_delay_plusminus", div);
    minus.textContent = "\u2212";
    var plus = newNode("span", "vpp_pref_delay_plus", "vpp_pref_delay_plusminus", div);
    plus.textContent = "\u002B";

    minus.onclick = function () {
        var val = get_pref("floatDelay");
        if (val > 0) {
            val--;
            set_pref("floatDelay", val);
            var numNode = doc.getElementById("vpp_pref_delay_num");
            numNode.textContent = get_pref("floatDelay").toString() + "s";
        }
    }

    plus.onclick = function () {
        var val = get_pref("floatDelay");
        if (val < 5) {
            val++;
            set_pref("floatDelay", val);
            var numNode = doc.getElementById("vpp_pref_delay_num");
            numNode.textContent = get_pref("floatDelay").toString() + "s";
        }
    }

}


function new_checkbox(prefname, str, kind, parent, value, func) {
    var div = newNode(kind, null, "vpp_generic", parent);
    var input = newNode("input", null, "vpp_generic", div);
    input.type = "checkbox";
    if (!value) {
        input.checked = get_pref(prefname);
        input.onclick = function (e) {
            var val = get_pref(prefname);
            set_pref(prefname, !val);
            e.target.checked = !val;
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
    var span = newNode("span", null, "vpp_opendelay", div);
    span.textContent = str;
}


function pref_popup_close() {
    var popup = doc.getElementById("vpp_pref_popup");
    if (!popup) return;

    popup.parentNode.removeChild(popup);
}


function pref_popup_open() {
    var popup = doc.getElementById("vpp_pref_popup");
    if (popup) return;

    popup = newNode("span", "vpp_pref_popup", null, doc.body);

    var title_node = newNode("div", "vpp_pref_title", null, popup);
    title_node.textContent = "Preview Options";

    var changed = false;
    function mark() {
        changed = true;
    }

    var closemark = newNode("span", "vpp_pref_close", null, popup);
    closemark.textContent = "\u2716";
    closemark.title = "close options";
    closemark.onclick = function () {
        popup.parentNode.removeChild(popup);
        if (changed) win.location.reload();
    };

    new_checkbox("floatEnable", "Hover Preview", "div", popup, null, mark);
    new_plusminus("floatDelay", "open delay", popup);
    new_checkbox("playerEnable", "Click Preview", "div", popup, null, mark);
    new_checkbox("rateEnable", "Video Rating", "div", popup, null, mark);
    new_checkbox("defEnable", "Video Resolution", "div", popup, null, mark);
    new_checkbox("iconEnable", "Options Icon", "div", popup, null, mark);
}


function pref_button() {
    if (!pref_iconEnable) return;

    var node = doc.getElementById("vpp_pref_button");
    if (node) return;
    var par = doc.getElementById("masthead-container") || doc.getElementById("yt-masthead-container");
    if (!par) return;

    node = newNode("span", "vpp_pref_button", null, par);
    node.title = "Preview Options";
    node.onclick = pref_popup_open;
}


//==================================================================
// Player

var basic_str = !NEWYT ?
    "(contains(@class,'video-thumb') or contains(@class,'thumb-wrap'))\
                 and (not(descendant::*[contains(@class,'video-thumb') or contains(@class,'thumb-wrap')]))\
                 and (not(ancestor::*[(@id='player-playlist') or (@id='pl-suggestions')]))"
    :
    "((local-name()='ytd-thumbnail') or (local-name()='ytd-playlist-thumbnail'))\
                 and (not(ancestor::*[@hidden]))";

var basic_str2 = "//img[contains(@src,'vi/') or contains(@src,'vi_webp/') or contains(@src,'/p/') or contains(@src,'/s_p/')]";

function player_script() {
    injectScript("if (YT) {\
                            var player = new YT.Player('vpp_player_frame');\
                            var errort = null;\
                            function error_reset() { if (errort) window.clearTimeout(errort); }\
                            function check_error(t,fid) {\
                               error_reset();\
                               errort = window.setTimeout(\
                                    function (fid) {\
                                       var f = document.getElementById('vpp_player_frame');\
                                       if (!f) return;\
                                       if (f.getAttribute('fid') != fid) return;\
									   fdoc = f.contentWindow.document;\
                                       var s = player.getPlayerState();\
                                       var a = player.getPlaylist();\
                                       var i = player.getPlaylistIndex();\
                                       if (a != null ? a.length == 0 : false)\
                                           f.dispatchEvent(new Event('playend'));\
                                       else\
                                           if ((s == -1 && fdoc.getElementsByClassName('ytp-error').length > 0) || s == 5)\
                                              if ((a != null && i != null) ? i < a.length - 1 : false)\
                                                 player.nextVideo();\
                                              else\
                                                 f.dispatchEvent(new Event('playend'));\
                                    }, t, fid);\
                            }\
                            player.addEventListener('onReady',\
                                   function () {\
                                        var f = document.getElementById('vpp_player_frame');\
                                        if (f) {\
                                             var q = f.getAttribute('quality');\
                                             if (q != 'default' && q != null) player.setPlaybackQualityRange(q);\
                                         }\
                                   });\
                            player.addEventListener('onStateChange',\
                                 function () {\
                                    var f = document.getElementById('vpp_player_frame');\
                                    if (!f) return;\
                                    var fid = f.getAttribute('fid');\
                                    var q = f.getAttribute('quality');\
                                    var s = player.getPlayerState();\
                                    var a = player.getPlaylist();\
                                    var i = player.getPlaylistIndex();\
                                    var cond = ((a != null && i != null) ? i == a.length - 1 : true);\
                                    if (s == -1 || s == 5) check_error(10000,fid); else error_reset();\
                                    if (s == -1 && q != 'default' && q != null) player.setPlaybackQualityRange(q);\
                                    if (s == 0 && cond) f.dispatchEvent(new Event('playend'));\
                                 });\
                            var frame = document.getElementById('vpp_player_frame');\
                            if (frame) {\
                                  check_error(10000,frame.getAttribute('fid'));\
                                  frame.addEventListener('loadnewvideo',\
                                                          function (x) {\
                                                             var fid = x.target.getAttribute('fid');\
                                                             var url = x.target.getAttribute('newvidurl');\
                                                             var plist = x.target.getAttribute('plist');\
                                                             player.pauseVideo();\
                                                             if (plist) {\
                                                                player.loadPlaylist({'list':plist});\
                                                                check_error(10000,fid);\
                                                             }\
                                                             else if (url) {\
                                                                player.loadVideoByUrl(url);\
                                                                check_error(10000,fid);\
                                                             }\
                                                          });\
                            }\
                     }");
}

var choices_def = ['default', 'small', 'medium', 'large', 'hd720', 'hd1080', 'hd1440', 'highres'];
var choices_size = ['xxsmall', 'xsmall', 'small', 'medium', 'large', 'xlarge', 'xxlarge'];
var choices_pos = ['00', '01', '02', '10', '11', '12', '20', '21', '22'];

//player preferences
if (pref_playerEnable) {
    init_pref("playerFit", false);
    init_pref("playerDef", "default");
    init_pref("playerSize", "medium");
    init_pref("playerPos", "11");
    init_pref("playerNext", true);
    init_pref("playerClose", true);
    init_pref("playerPause", true);
    init_pref("playerDim", true);
    init_pref("playerAds", true);
    init_pref("playerButton", true);

    //fix char preferences
    if (choices_def.indexOf(get_pref("playerDef")) < 0) set_pref("playerDef", 'default');
    if (choices_size.indexOf(get_pref("playerSize")) < 0) set_pref("playerSize", 'medium');
    if (choices_pos.indexOf(get_pref("playerPos")) < 0) set_pref("playerPos", '11');
}


function player_options(parent) {
    var popup = doc.getElementById("vpp_player_options_popup");
    if (popup) return;

    popup = newNode("span", "vpp_player_options_popup", null, parent);

    var title_node = newNode("div", null, "vpp_player_options_title", popup);
    title_node.textContent = "Player Options";

    var closemark = newNode("span", null, "vpp_player_options_close", popup);
    closemark.textContent = "\u2716";
    closemark.title = "close options";
    closemark.onclick = close_player_options;


    new_checkbox("playerNext", "Auto Play Next", "div", popup);
    new_checkbox("playerDim", "Dim Background", "div", popup, null, function () {
        doc.getElementById("vpp_player_area").style.visibility = (get_pref("playerDim") ? "visible" : "hidden");
    });
    new_checkbox("playerClose", "Close by Clicking Outside Player", "div", popup);
    new_checkbox("playerPause", "Pause YouTube Player at Launch", "div", popup);
    new_checkbox("playerButton", "Hide Play Button on Thumbs", "div", popup, null, revealPlayerButton);
    new_checkbox("playerAds", "Auto Skip Ads", "div", popup);

    var div = newNode("div", null, "vpp_player_options_text", popup);
    //default, small, medium, large, hd720, hd1080, hd1440, highres;
    div.textContent = "Resolution";
    var group1 = newNode("div", null, "vpp_player_options_group", popup);
    var group2 = newNode("div", null, "vpp_player_options_group", popup);
    new_checkbox("playerDef", "Default", "span", group1, "default");
    new_checkbox("playerDef", "LQ 240", "span", group1, "small");
    new_checkbox("playerDef", "MQ 360", "span", group1, "medium");
    new_checkbox("playerDef", "HQ 480", "span", group1, "large");
    new_checkbox("playerDef", "HD 720", "span", group2, "hd720");
    new_checkbox("playerDef", "HD 1080", "span", group2, "hd1080");
    new_checkbox("playerDef", "HD 1440", "span", group2, "hd1440");
    new_checkbox("playerDef", "MAX", "span", group2, "highres");
}

function close_player_options() {
    var popup = doc.getElementById("vpp_player_options_popup");
    if (popup) popup.parentNode.removeChild(popup);
}

function revealPlayerButton() {
    if (!get_pref("playerButton"))
        doc.body.setAttribute("vpp_reveal_play_button", "");
    else
        doc.body.removeAttribute("vpp_reveal_play_button");
}

function playerUrl(vid, pid) {

    var url = win.location.protocol + "//www.youtube.com/";

    if (vid) url += "embed/" + vid + "?" + (pid ? "&list=" + pid : "");
    else if (pid) url += "embed?listType=playlist&list=" + pid;

    url += "&autoplay=1&fs=1&iv_load_policy=3&rel=1&version=3&enablejsapi=1";

    return (url);
}


function adjust_playing(node) {
    var playing = doc.getElementById("vpp_now_playing");
    if (playing)
        playing.parentNode.removeChild(playing);

    if (node) {
        playing = newNode("span", "vpp_now_playing", null, node);
        playing.textContent = "now playing";
    }
}


function handleFrameLoad(evt) {
    var frame = evt.target;
    var fdoc = frame.contentWindow.document;
    //hide ad banner
    insertStyle(".ima-container {display:none !important;}", 'vpp_frame_ads', fdoc);

    var frame_skip_ad_script = "\
		window.setInterval(function() {\
			var button = document.getElementsByClassName('videoAdUiSkipButton videoAdUiAction');\
			if (button.length > 0)\
				if (button[0].parentNode && button[0].parentNode.style.display != 'none') {\
					var clickEvent = document.createEvent('MouseEvents');\
					clickEvent.initEvent('click', true, true);\
                    button[0].dispatchEvent(clickEvent);\
				}\
		},1000);";

    if (get_pref("playerAds"))
        injectScript(frame_skip_ad_script, null, fdoc);
}


function build_player() {
    //constants
    var next_choice = new Object();
    next_choice['plus'] = new Object();
    next_choice['minus'] = new Object();
    next_choice['left'] = new Object();
    next_choice['right'] = new Object();
    next_choice['up'] = new Object();
    next_choice['down'] = new Object();

    next_choice['plus']['xxsmall'] = 'xsmall';
    next_choice['plus']['xsmall'] = 'small';
    next_choice['plus']['small'] = 'medium';
    next_choice['plus']['medium'] = 'large';
    next_choice['plus']['large'] = 'xlarge';
    next_choice['plus']['xlarge'] = 'xxlarge';
    next_choice['plus']['xxlarge'] = 'xxlarge';

    next_choice['minus']['xxsmall'] = 'xxsmall';
    next_choice['minus']['xsmall'] = 'xxsmall';
    next_choice['minus']['small'] = 'xsmall';
    next_choice['minus']['medium'] = 'small';
    next_choice['minus']['large'] = 'medium';
    next_choice['minus']['xlarge'] = 'large';
    next_choice['minus']['xxlarge'] = 'xlarge';

    {
        for (var i = 0; i < 3; i++)
            for (var j = 0; j < 3; j++) {
                next_choice['left'][i.toString() + j.toString()] = i.toString() + (j - 1 >= 0 ? j - 1 : 0).toString();
                next_choice['right'][i.toString() + j.toString()] = i.toString() + (j + 1 <= 2 ? j + 1 : 2).toString();
                next_choice['up'][i.toString() + j.toString()] = (i - 1 >= 0 ? i - 1 : 0).toString() + j.toString();
                next_choice['down'][i.toString() + j.toString()] = (i + 1 <= 2 ? i + 1 : 2).toString() + j.toString();
            }
    }

    var area = null;
    var area2 = null;
    var box = null;
    var holder = null;
    var holder2 = null;

    var new_size = get_pref("playerSize");
    var new_pos = get_pref("playerPos");
    var new_fit = get_pref("playerFit");

    var that = this;
    var frame_count = 0;

    //public
    this.playerShow = function (vid, pid, node) {
        var vis = box.style.visibility;
        if (vis == "hidden") {
            new_size = get_pref("playerSize");
            new_pos = get_pref("playerPos");
            new_fit = get_pref("playerFit");
        }
        playerAdjust((new_fit ? 'fit' : new_size), new_pos, "visible", vid, pid);
        adjust_playing(node);
    }

    this.playerClose = function () {
        playerAdjust(null, null, "hidden", null, null);
        close_player_options();
        adjust_playing();
        move_enable = false;
    }


    //private
    function play_next(findprevious) {

        var playing = doc.getElementById("vpp_now_playing");
        if (!playing) return;

        var pos = -2;
        var l = null;

        var myimg = innersearch(playing.parentNode, ".//img[@src or @data-thumb]").snapshotItem(0);
        if (myimg) {
            l = docsearch("//*[(" + basic_str + ")]" + basic_str2);

            myimg.setAttribute("matchfind", "true");

            for (var i = 0; i < l.snapshotLength; i++) {
                if (l.snapshotItem(i).getAttribute("matchfind")) {
                    pos = i;
                    break;
                }
            }

            myimg.removeAttribute("matchfind");
        }

        pos = (findprevious ? pos - 1 : pos + 1);

        if (pos >= 0) {
            var img = l.snapshotItem(pos);
            if (img) {
                var vid = find_vid(img);
                var pid = find_plist(img);
                img.setAttribute("matchfindimg", true);
                var target = docsearch("//*[" + basic_str + " and (.//img[@matchfindimg])]").snapshotItem(0);
                if (target) {
                    that.playerShow(vid, pid, target);
                }
                img.removeAttribute("matchfindimg");
            }
        }
    }


    function playerAdjust(size, pos, vis, vid, pid) {

        if (vis != null) {
            box.style.visibility = vis;
            area.style.visibility = (get_pref("playerDim") ? vis : "hidden");

            var frame = doc.getElementById("vpp_player_frame");
            if (frame != null && (vis == 'hidden')) {
                frame.parentNode.removeChild(frame);
                frame = null;
            }

            if (vis == "visible") {
                var vidurl = playerUrl(vid, pid);
                var def = get_pref("playerDef");
                frame_count++;

                if (frame) {
                    frame.setAttribute("newvidurl", vidurl);
                    if (pid) frame.setAttribute("plist", pid);
                    else frame.removeAttribute("plist");
                    frame.setAttribute("quality", def);
                    frame.setAttribute("fid", frame_count.toString());

                    var event = doc.createEvent('Event');
                    event.initEvent('loadnewvideo', true, true);
                    frame.dispatchEvent(event);
                }
                else {
                    frame = newNode("iframe", "vpp_player_frame", null, holder2);
                    frame.setAttribute("type", "text/html");
                    frame.setAttribute("frameborder", "0");
                    frame.setAttribute("allowfullscreen", "true");
                    frame.setAttribute("quality", def);
                    frame.setAttribute("fid", frame_count.toString());
                    frame.src = vidurl;
                    frame.addEventListener('playend', function f() {
                        if (get_pref("playerNext")) play_next();
                    });
                    frame.addEventListener('load', handleFrameLoad, true);
                    player_script();
                }
            }
        }

        if (size != null) {
            box.setAttribute("player_size", size);
            holder.setAttribute("player_size", size);
        }

        if (pos != null)
            box.setAttribute("player_pos", pos);
    }


    function click_pos_size(e) {
        var kind = e.target.getAttribute("button_kind");
        if (!kind) return;

        if (new_fit && !(kind == 'options' || kind == 'prev' || kind == 'next')) {
            set_pref("playerFit", false);
            new_fit = false;
            playerAdjust(new_size, new_pos);
            return;
        }

        switch (kind) {
            case 'plus':
            case 'minus':
                new_size = next_choice[kind][new_size];
                set_pref("playerSize", new_size);
                playerAdjust(new_size, new_pos);
                break;

            case 'fit':
                set_pref("playerFit", true);
                new_fit = true;
                playerAdjust('fit');
                break;

            case 'left':
            case 'right':
            case 'up':
            case 'down':
                new_pos = next_choice[kind][new_pos];
                set_pref("playerPos", new_pos);
                playerAdjust(new_size, new_pos);
                break;

            case 'options':
                player_options(box);
                break;

            case 'prev':
                play_next(true);
                break;

            case 'next':
                play_next();
                break;
        }
    }


    function new_button(kind, str, str_popup, parent) {
        var node = newNode("span", null, "vpp_player_button", parent);
        node.textContent = str;
        node.title = str_popup;
        node.setAttribute("button_kind", kind);
        node.onclick = click_pos_size;
    }

    //initialization;
    if (doc.getElementById("vpp_player_area")) return;

    area = newNode("div", "vpp_player_area", null, doc.body);
    area2 = newNode("div", "vpp_player_area2", null, area);
    box = newNode("div", "vpp_player_box", null, area2);
    holder = newNode("div", "vpp_player_holder", null, box);
    holder2 = newNode("div", "vpp_player_holder2", null, holder);
    box.style.visibility = "hidden";
    area.style.visibility = "hidden";
    holder.title = "close player";

    holder.onclick = function (e) {
        if (e.target.id == "vpp_player_holder") that.playerClose();
    };

    var buttonArea = newNode("span", "vpp_player_button_area_top", null, box);
    new_button("plus", "\u002B", "increase size", buttonArea);
    new_button("minus", "\u2212", "decrease size", buttonArea);
    new_button("fit", "\u2610", "fill window", buttonArea);
    new_button('left', '\u25C4', 'move left', buttonArea);
    new_button('right', '\u25BA', 'move right', buttonArea);
    new_button('up', '\u25B2', 'move up', buttonArea);
    new_button('down', '\u25BC', 'move down', buttonArea);
    new_button("options", "\u2630", "player options", buttonArea);

    var bottomArea = newNode("span", "vpp_player_button_area_next", null, box);
    new_button("prev", "\u140A\u140A", "play previous in page", bottomArea);
    new_button("next", "\u1405\u1405", "play next in page", bottomArea);
    //new_button("loop", "\u21BB", "repeat video", bottomArea);

    var mark = newNode("span", "vpp_player_close_mark", null, box);
    mark.textContent = "\u2716";
    mark.title = "close player";
    mark.onclick = this.playerClose;
}


var player = null;
if (pref_playerEnable) {
    player = new build_player();
    injectScript(null, 'https://www.youtube.com/iframe_api');
    revealPlayerButton();
}



function player_close(e) {
    if (!player) return;

    if (!e) {
        player.playerClose();
        return;
    }

    if (!get_pref("playerClose")) return;

    if (e.artificialevent) return;
    if (e.target.hasAttribute("button_kind")) return;

    var box = doc.getElementById("vpp_player_box");
    if (!box) return;
    if (box.style.visibility == "hidden") return;

    var r = box.getBoundingClientRect();
    //message(e.offsetX + " " + r.width + "\n" + e.offsetY + " " + r.height);
    if ((e.clientX < r.left) || (e.clientX > r.right) ||
        (e.clientY < r.top) || (e.clientY > r.bottom))
        player.playerClose();
}


function ytpause() {
    injectScript("var a = document.getElementById('c4-player') || document.getElementById('movie_player');\
                   if (a != null)\
                      if (a.pauseVideo != null){\
                          a.pauseVideo();\
                      }\
                  ");
}


//==================================================================
// float player

//quality is default for faster upload, and youtube player is paused
function float_script() {
    injectScript("if (YT) { var fplayer = new YT.Player('vpp_float_frame');\
                            fplayer.addEventListener('onReady',\
                                   function () {\
                                        var f = document.getElementById('vpp_float_frame');\
                                        if (f) {\
                                            fplayer.setPlaybackQualityRange('default');\
                                            var a = document.getElementById('c4-player') || document.getElementById('movie_player');\
                                            if (a != null)\
                                                if (a.pauseVideo != null){\
                                                    a.pauseVideo();\
                                                }\
                                        }\
                                   });\
                          }");
}


function float_open(e, check) {
    //check tests if same url frame is already open
    var float_width = 480; //512;
    var float_height = 270; //288;

    if (doc.getElementById("vpp_player_frame")) return;

    var img = innersearch(e.target, "." + basic_str2).snapshotItem(0);
    if (!img) return;
    var vid = find_vid(img);
    if (!vid) return;

    if (!check) {
        float_delay_clear();
        adjust_playing(e.target);
    }

    var url = win.location.protocol + "//www.youtube.com/embed/" + vid + "?&autoplay=1&controls=1&iv_load_policy=3&rel=0&showinfo=1&version=3&enablejsapi=1";

    var frame = doc.getElementById("vpp_float_frame");
    if (frame)
        if (frame.src == url) return check;
        else if (!check) frame.parentNode.removeChild(frame);

    if (check) return false;

    var box = doc.getElementById("vpp_float_box");
    if (!box) {
        box = newNode("div", "vpp_float_box", null, doc.body);
        box.style.width = float_width + "px";
        box.style.height = float_height + "px";
        box.onmouseenter = float_delay_clear;
        box.onmouseleave = float_close_delay;
    }

    var w = win.innerWidth
        || doc.documentElement.clientWidth
        || doc.body.clientWidth;

    var h = win.innerHeight
        || doc.documentElement.clientHeight
        || doc.body.clientHeight;

    var r = e.target.getBoundingClientRect();

    var hpad = Math.round(-r.width / 3); //horizontal offset
    var vpad = 0; //vertical offset

    //priority to right
    var left = r.right + hpad;
    if (left + float_width > w)
        if (r.left - float_width - hpad >= 0 || r.left > w - r.right)
            left = r.left - float_width - hpad;

    //priority to left
    //var left = r.left - float_width - pad;
    //if (left < 0)
    //    if ((r.right + float_width + pad <= w) || (w - r.right > r.left))
    //        left = r.right + pad;

    //priority to top
    var top = r.top - float_height - vpad;
    if (top < 0)
        if (r.bottom + float_height + vpad <= h || h - r.bottom > r.top)
            top = r.bottom + vpad;

    var scrollT = doc.body.scrollTop || doc.documentElement.scrollTop;
    var scrollL = doc.body.scrollLeft || doc.documentElement.scrollLeft;
    left += scrollL;
    top += scrollT;

    box.style.left = left + "px";
    box.style.top = top + "px";

    frame = newNode("iframe", "vpp_float_frame", null, box);
    frame.setAttribute("type", "text/html");
    frame.setAttribute("frameborder", "0");
    frame.src = url;
    float_script();
}


function float_close(e) {
    float_close_delay_clear();
    var box = doc.getElementById("vpp_float_box");

    function box_close() {
        box.parentNode.removeChild(box);
        adjust_playing();
    }

    //check if mouse was in the area
    if (!box) return;
    if (!e) box_close();
    else
        if (e.target != box)
            box_close();
        else { //player should not close if mouse is still inside
            var r = box.getBoundingClientRect();
            //message(e.offsetX + " " + r.width + "\n" + e.offsetY + " " + r.height);
            if ((e.clientX <= r.left + 1) || (e.clientX >= r.right - 1) ||
                (e.clientY <= r.top + 1) || (e.clientY >= r.bottom - 1))
                box_close();
        }
}

var float_open_timeout = null;
var float_close_timeout = null;

function float_delay_clear() {
    float_open_delay_clear();
    float_close_delay_clear();
}

function float_open_delay_clear() {
    win.clearTimeout(float_open_timeout);
}

function float_close_delay_clear() {
    win.clearTimeout(float_close_timeout);
}

function float_open_delay(e) {
    if (float_open(e, true)) {
        float_delay_clear();
    }
    else {
        float_open_delay_clear();
        var delay = get_pref("floatDelay") * 1000;
        float_open_timeout = win.setTimeout(float_open, delay, e);
    }
}

function float_close_delay(e) {
    float_delay_clear();
    float_close_timeout = win.setTimeout(float_close, 200, e);
}

function float_reset() {
    float_delay_clear();
    float_close();
}


//==================================================================
//meta data

var api_key = "AIzaSyAxn6m4k-YdsYhrwUZ2Mxf_Lh5jC-lWeyA";

function data_entry_v3(entry) {

    var ret = new Object();

    ret.feedKind = null;
    ret.feedId = null;

    ret.title = null;
    ret.descr = null;
    ret.length = null;

    ret.views = null;
    ret.length = null;
    ret.likes = null;
    ret.dislikes = null;
    ret.HD = null;

    ret.user = new Object();
    ret.user.id = null;
    ret.user.name = null;
    ret.user.channelId = null;

    if (entry.kind)
        if (entry.kind == "youtube#video")
            ret.feedKind = "video";

    if (entry.id)
        ret.feedId = entry.id;

    //message("feedKind=" + ret.feedKind);
    //message("feedId=" + ret.feedId);

    if (entry.snippet) {
        if (entry.snippet.title)
            ret.title = entry.snippet.title;
        if (entry.snippet.description)
            ret.descr = entry.snippet.description;
        if (entry.snippet.channelId)
            ret.user.channelId = entry.snippet.channelId;
        if (entry.snippet.channelTitle)
            ret.user.name = entry.snippet.channelTitle;

        //message("title=" + ret.title);
        //message("description=" + ret.descr);
        //message("channelId=" + ret.user.channelId);
    }


    if (entry.contentDetails) {
        if (entry.contentDetails.definition)
            if (entry.contentDetails.definition == "hd")
                ret.HD = true;

        if (entry.contentDetails.duration)
            ret.length = entry.contentDetails.duration;

        //message("HD=" + ret.HD);
        //message("length=" + ret.length + "  converted:" + time_column(ret.length));
    }

    if (entry.statistics) {
        if (entry.statistics.viewCount)
            ret.views = entry.statistics.viewCount;
        if (entry.statistics.likeCount)
            ret.likes = entry.statistics.likeCount;
        if (entry.statistics.dislikeCount)
            ret.dislikes = entry.statistics.dislikeCount;

        //message("views=" + ret.views + "     likes=" + ret.likes + "       dislikes=" + ret.dislikes);
    }

    return ret;
}


function data_feed_v3(json_txt) {

    //object to be returned
    var ret = new Object();
    ret.totalResults = 0;
    ret.entry = new Array();

    //main code
    var job = null; //json object
    if (json_txt != null)
        job = JSON.parse(json_txt);

    if (job == null) return ret;

    //jmessage(job);

    if (job.pageInfo != null)
        if (job.pageInfo.totalResults != null) {
            ret.totalResults = job.pageInfo.totalResults;
            //message("totalResults=" + ret.totalResults);
        }

    if (job.items != null)
        if (job.items.length != 0)
            for (var i = 0; i < job.items.length; i++) {
                var data = data_entry_v3(job.items[i]);
                if (data.feedKind != null) {
                    ret.entry.push(data);
                }
            }

    return ret;
}


function callback2(json_txt, def_node, buildHD, buildRate, parent) {
    //message(json_txt);

    var feed = data_feed_v3(json_txt);

    if (feed.entry.length != 1) return;
    var entry = feed.entry[0];

    //message("here");

    if (buildHD) {
        if (entry.HD != null) {
            def_node.setAttribute("reveal", "true");
            parent.setAttribute("vpp_meta_def", "");
            def_node.title = "no resolution data";
            var node_hd = newNode("span", null, "vpp_meta_def_hd HD", def_node);
            node_hd.textContent = "HD";
        }
    }

    //message("there");

    if (buildRate) {
        var num_likes = (entry.likes != null ? parseInt(entry.likes) : 0);
        var num_dislikes = (entry.dislikes != null ? parseInt(entry.dislikes) : 0);
        console.log(buildRate);
        if ((num_likes != 0) || (num_dislikes != 0)) {
            var perc = 100 - Math.round(num_dislikes * 100.0 / (num_likes + num_dislikes));

            var rateBrief = newNode("div", null, "vpp_meta_rate", parent);
            parent.setAttribute("vpp_meta_rate", "");
            rateBrief.title = perc + "% likes: +" + number_comma(num_likes.toString()) + "  -" + number_comma(num_dislikes.toString());

            if (entry.views != null) {
                var view_num = number_comma(entry.views);
                rateBrief.title += "\n" + view_num + " views";
            }

            if (perc >= red_threshold) {
                rateBrief.textContent = "\uD83D\uDC4D " + perc;
                if (perc < orange_threshold) {
                    rateBrief.setAttribute("med", "true");
                }
            }
            else {
                rateBrief.textContent = "\uD83D\uDC4E " + perc;
                rateBrief.setAttribute("bad", "true");
            }
        }
    }
}


function callback1(txt, def_node, url2, parent) {
    //message(txt);
    var res = extract_resolution(txt);

    if (res) {
        def_node.setAttribute("reveal", "true");
        parent.setAttribute("vpp_meta_def", "");
        def_node.title = res.size + " resolution";
        if (res.HD) {
            var node_hd = newNode("span", null, "vpp_meta_def_hd" + (res.UHD ? " UHD" : " HD"), def_node);
            node_hd.textContent = res.UHD ? res.UHD : "HD";
            def_node.setAttribute("space", "true");
        }
        var node_attr = newNode("span", null, "vpp_meta_def_format", def_node);
        node_attr.textContent = res.format;

        if (pref_rateEnable) {
            //message("callback");
            httpReq(url2, callback2, null, false, true, parent);
        }
    }
    else {
        //message("callback");
        httpReq(url2, callback2, def_node, true, pref_rateEnable, parent);
    }
}


function def_rate(v_id, parent) {
    var url1 = "https://www.youtube.com/get_video_info?video_id=" + v_id;
    var url2 = "https://www.googleapis.com/youtube/v3/videos?id=" + v_id + "&key=" + api_key + "&part=contentDetails,statistics";

    //httpreq
    if (pref_defEnable) {
        var def_node = newNode("span", null, "vpp_meta_def_container", parent);
        httpReq(url1, callback1, def_node, url2, parent);
    }
    else
        if (pref_rateEnable)
            httpReq(url2, callback2, null, false, true, parent);
}


function play(parent) {
    if (parent.hasAttribute("vpp_play_marked")) return;

    parent.setAttribute("vpp_play_marked", "true");
    var playArea = newNode("div", null, "vpp_play_button_container", parent);
    var playNode = newNode("a", null, "vpp_play_button", playArea);
    playNode.href = "javascript:;";
    playNode.target = "_self";
    playNode.title = "click to preview";

    function play_handle(e) {
        e.stopPropagation();
        float_reset();

        var parpar = e.target.parentNode.parentNode;

        if (innersearch(parpar, ".//*[@id='vpp_now_playing']").snapshotLength > 0)
            player_close();
        else {
            var img = innersearch(parpar, "." + basic_str2).snapshotItem(0);
            if (!img) return;
            var evid = find_vid(img);
            var epid = find_plist(img);

            player.playerShow(evid, epid, parpar);
            if (get_pref("playerPause")) ytpause();
        }
    }

    playNode.onclick = play_handle;
}


function float_setup(parent) {
    if (parent.hasAttribute("vpp_float_marked")) return;

    parent.setAttribute("vpp_float_marked", "true");
    parent.onmouseenter = float_open_delay;
    parent.onmouseleave = float_close_delay;
}


function find_vid(img) {
    var vid = filter(img.src, "vi/", "/&?#");
    if (!vid) vid = filter(img.src, "vi_webp/", "/&?#");
    return vid;
}


function find_plist(img) {
    var anc = innersearch(img, "ancestor-or-self::*[contains(@href,'&list=') and (.//*[contains(@class,'yt-pl-sidebar-content') or contains(@class,'ytd-thumbnail-overlay-side-panel-renderer')])]").snapshotItem(0);
    var plist = null;
    if (anc)
        plist = filter(anc.href, "list=", "/&?#");
    //message(plist);
    if (plist == 'WL') plist = null;
    return plist;
}


function in_video_page() {
    return (win.location.href.indexOf("watch?") >= 0);
}


function reset_meta_marked() {
    var reset_nodes = docsearch("//*[@vpp_meta_thumb_mark]");
    for (var j = 0; j < reset_nodes.snapshotLength; j++) {
        var rnode = reset_nodes.snapshotItem(j);
        if (rnode) {
            rnode.removeAttribute("vpp_meta_thumb_mark");
            rnode.removeAttribute("vpp_meta_rate");
            rnode.removeAttribute("vpp_meta_def");
            var inner_nodes = innersearch(rnode, ".//*[contains(@class,'vpp_meta')]");
            for (var k = 0; k < inner_nodes.snapshotLength; k++) {
                var node = inner_nodes.snapshotItem(k);
                if (node)
                    if (node.parentNode)
                        node.parentNode.removeChild(node);
            }
        }
    }
}


function meta_data(start_count) {
    if (pref_defEnable || pref_rateEnable || pref_playerEnable || pref_floatEnable) {
        //video page
        if ((pref_defEnable || pref_rateEnable) && in_video_page()) {
            var wvid = filter(win.location.href, "v=", "?&#");
            if (wvid) {
                var par = doc.getElementById("vpp_meta_box");
                if (par && start_count == 0) {
                    par.parentNode.removeChild(par);
                    par = null;
                }
                if (!par) {
                    var target = doc.getElementById("gridtube_title_container");
                    if (!target) {
                        //var pp = doc.getElementById("watch7-user-header");
                        var pp = doc.getElementById("watch-header") || docsearch("//ytd-video-primary-info-renderer").snapshotItem(0); //OLD||NEW
                        if (pp) target = newNode("span", "gridtube_title_container", null, pp);
                    }
                    if (target) {
                        par = newNode("span", 'vpp_meta_box', null, target);
                        def_rate(wvid, par);
                    }
                }
            }
        }

        //thumbs
        var start_delay = 2; //cycle delay to erase old data from thumbs

        //reset marked at new page
        if (start_count < start_delay) reset_meta_marked();

        var vid_str = !NEWYT ? "//*[" + basic_str + " and (not(.//img[@data-thumb])) and (not(@vpp_meta_thumb_mark))]"
            : "//*[" + basic_str + " and (.//img[@src]) and (not(@vpp_meta_thumb_mark))]";

        var p = docsearch(vid_str);
        //message(p.snapshotLength);
        for (var i = 0; i < p.snapshotLength; i++) {
            var parent = p.snapshotItem(i);
            if (start_count >= start_delay) parent.setAttribute('vpp_meta_thumb_mark', 'true');
            var img = innersearch(parent, "." + basic_str2).snapshotItem(0);
            if (!img) continue;

            var vid = find_vid(img);

            //definition and rating
            if (vid) {//video or playlist
                if (pref_defEnable || pref_rateEnable)
                    if (start_count >= start_delay)
                        def_rate(vid, parent);
                //for float
                if (pref_floatEnable) {
                    float_setup(parent);
                }
            }

            //play button
            if (pref_playerEnable) {
                if (vid || (!vid && find_plist(img)))
                    play(parent);
            }
        }
    }
}

//==================================================================
// Main

//insert styles
insertStyle(style_basic, "vpp_style_basic");

if (pref_playerEnable) //hide overlay of playlist
    insertStyle(".yt-pl-thumb-overlay, ytd-thumbnail-overlay-hover-text-renderer {display:none !important;}", "vpp_style_list_overlay");//OLD,NEW

var old_addr = win.location.href;
var nochanges_count = -1;
var start_count = -1; //not used now

win.addEventListener("resize", function () { nochanges_count = -1; }, false);
win.addEventListener("scroll", function () { nochanges_count = -1; }, false);
win.addEventListener("click", function (e) { nochanges_count = -1; player_close(e); }, false);

//main routine
function check_changes() {
    if (old_addr == win.location.href) {
        if (nochanges_count < 20) nochanges_count++;
        if (start_count < 20) start_count++;
    }
    else {
        nochanges_count = 0;
        start_count = 0;
        old_addr = win.location.href;

        float_reset();
        player_close();
        pref_popup_close();
    }

    if (nochanges_count >= 20) return;

    pref_button();
    meta_data(start_count);
}

win.setInterval(check_changes, 1000);
check_changes();
