// ==UserScript==
// @name         YouTube Video Preview and Ratings Keyless
// @namespace    YouTubeVideoPreviewPlayer
// @version      20230327
// @description  Instant video previews in popup player by hovering or clicking video thumbs. Video ratings and resolution data shown on the thumbs. Gets video information without using a YouTube API key, which can be banned or limited.
// @author       Couchy
// @match        https://www.youtube.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/397094/YouTube%20Video%20Preview%20and%20Ratings%20Keyless.user.js
// @updateURL https://update.greasyfork.org/scripts/397094/YouTube%20Video%20Preview%20and%20Ratings%20Keyless.meta.js
// ==/UserScript==

//==================================================================
//Userscript specific functions

function debug(...args) {
    //console.log(...args);
}

function set_pref(preference, new_value) {
    GM_setValue(preference, new_value);
}

function get_pref(preference) {
    return GM_getValue(preference);
}

function init_pref(preference, new_value) {
    let value = get_pref(preference);
    if (value == null) {
        set_pref(preference, new_value);
        value = new_value;
    }
    return value;
}

//==================================================================
// Styles

const style_basic = `
/* prefs */
#vpp_pref_popup {direction:ltr; font:11px/11px Roboto,arial,sans-serif; position:fixed; right:0px; top:0px; color:#e0e0e0; background:#202020; padding:15px 15px 15px 10px; border-radius:3px; box-shadow:0px 0px 5px 1px gray; /*z-index:2147483647;*/ z-index:2147483646;}
.vpp_pref_group {margin-left:15px; color:yellow;}
#vpp_pref_close {font:14px/14px Roboto,arial,sans-serif; color:lightgray; position:absolute; top:3px; right:5px; cursor:pointer; user-select:none; -moz-user-select:none;}
#vpp_pref_close:hover {color:white;}
#vpp_pref_title {font:500 13px/13px Roboto,arial,sans-serif; padding:5px !important;}
#vpp_pref_button {cursor:pointer; width:18px; height:18px; background-size:contain; background-repeat:no-repeat; opacity:0.7; position:absolute; right:0px; top:0px; user-select:none; -moz-user-select:none;}
#vpp_pref_button:hover {opacity:1;}
#vpp_pref_button {background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAeUlEQVR42u2UwQ2AMAwDk52YCWaCmdgp7QshKP6QKn7Yv0pudEqcuBXLBXB/7GaBzFv3Z3k+AdYY/z3cr+IZHgywPCZzxrv4T48AyAFAeKaH0ICmr2GFuDpAkQGOLRBAOQAIjw5Rtrg6QJEBji0QQDkACI8OUbYE0ADbonowcNn6sgAAAABJRU5ErkJggg==');}
#vpp_pref_delay_text {margin-left:20px; color:khaki;}
#vpp_pref_delay_num {margin-left:3px; color:khaki;}
.vpp_pref_delay_plusminus {margin-left:5px; cursor:pointer; text-align:center; font-weight:800; color:black; background:#B0B0B0; border-radius:2px; display:inline-block; width:10px; user-select:none; -moz-user-select:none;}
.vpp_pref_delay_plusminus:hover {background:#D0D0D0;}
#vpp_pref_delay_plus {margin-left:2px;}
#vpp_pref_delay_minus {margin-left:5px;}
/* meta data */
.vpp_meta_def_container {font:500 12px/14px Roboto,arial,sans-serif; position:absolute; top:0px; left:0px; background:#e8e8e8; padding:0px 3px; border-radius:2px; display:none; cursor:default;}
html[dark] .vpp_meta_def_container {background:#202020 !important;}
.vpp_meta_def_container[reveal] {display: block;}
.vpp_meta_def_container[space] .vpp_meta_def_hd {margin-right:2px;}
.vpp_meta_def_format {position:relative; color:black;}
 html[dark] .vpp_meta_def_format {color:#f0f0f0 !important;}
.vpp_meta_def_hd {position:relative;}
.vpp_meta_def_hd.HD {color:magenta;}
.vpp_meta_def_hd.UHD {color:red;}
.vpp_meta_rate {direction:ltr; font:500 12px/14px Roboto,arial,sans-serif; position:absolute; top:0px; right:0px; color:white; padding:0px 3px; border-radius:2px; cursor:default;}
body[dir='ltr'] [vpp_meta_rate] ytd-thumbnail-overlay-toggle-button-renderer, body[dir='rtl'] [vpp_meta_def] ytd-thumbnail-overlay-toggle-button-renderer {margin-top:12px !important;}
#vpp_meta_box {position:relative; float:left; height:13px; margin-top:3px;}
#vpp_meta_box .vpp_meta_def_container {background:none !important; position:relative; clear:none; float:left;}
#vpp_meta_box .vpp_meta_rate {position:relative; clear:none; float:right; margin-left:5px;}
#gridtube_title_container {position:absolute; top:5px; right:5px;}
body[dir='rtl'] #gridtube_title_container {left:5px !important; right:auto !important;}
body ytd-video-primary-info-renderer {position:relative !important;}
/* play button*/
#vpp_now_playing {font:500 14px/14px Roboto,arial,sans-serif; position:absolute; bottom:0px; left:0px; background:red; color:white; padding:5px; cursor:default; z-index:0;}
body[dir='rtl'] #vpp_now_playing {left:auto !important; right:0px !important;}
body[vpp_reveal_play_button] .vpp_play_button, *[vpp_play_marked]:hover .vpp_play_button {visibility:visible !important;}
.vpp_play_button_container {position:absolute; bottom:0px; left:0px; width:100%;}
.vpp_play_button {display:block !important; position:relative !important; padding-bottom:1px !important; margin:0px auto !important; width:25px !important; height:25px !important;
                  opacity:0.75 !important; cursor:pointer !important; background-size:25px !important; background-repeat:no-repeat !important; text-decoration:none !important; z-index:1; user-select:none; -moz-user-select:none;}
.vpp_play_button:hover {opacity:1 !important;}
.vpp_play_button {background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAG7AAABuwBHnU4NQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAOqSURBVFiF5ZdPSBxnGMZ/M98s1V1nV01A17VZUwMRqsGY9FyQlBJQ2gYPIbaB0nMgwYZWeumxIQhlT7aQW0Mhl54CvQQiISQhkixN\
bWKXaNSaYuzu6v4Z98+38/WgY9Vu9l835NAHvsvM983zvs/7vPPOaEopXif018oOGAAfjY4GgEvAu0DnK+b8A5gCvvjp6tVl7cMzZ94EwkArgM/n42BXF7peX3Fs22b+2TPW19edSzGg3wAmgFbTNPlybIyDBw7UlXgv5hcX+WZigmQy2QpMiJ6+vhDQ9Pn587wVDGLb9itdXtOku7ubW7dvA+wzgHa3201XMEg2nyebzyOlpN69oQGG\
YfCGy0VXMIjb7cayrHYDoDMQIJPLkUynKdh2nal3Q+g6psdDZyDA75HIZhcoIJFKIQuFkofz2SxCCHTDqDkA27ZJpFLbCusAuVyOvJQopUquWDzO5OQkfy4vl91bauWlJJfL/ROAlLJiEy0sLfFtKMTP16+TsayazSilBLZeRI405aBsm8JWmW7cvMn0gweMnDrFocOHay7JpgeUqiiAQqGwHQBALB7n+ytXONLXx/DQEKbPVzGxM4Oq\
U0CpXQE4eBgOMzMzwwfDwwwcO1aVSatSwN5Rgr1TVErJj9eucefuXUZGRmjz+8smAzumYUXmKRSQUiKl3C7H3vV0fp5Lly9za2oKrcRzdylQLKOiCkDREuzFe4ODfDo6yloqxUo0WnJvzSUohg6/n/GxMXp6eogsLJDd6vViqM2ELwlACMHHp0/z2dmzLK2s8MvsbNlnOai6DZ0XiIMjvb18PT6Ox+vl4ZMnFZXI4dwOAKpvwyaPhwvn\
zjF08iSzc3Msrq5WRLwX28OoGg+8f+IEX128SMKyuBcO1zS6nTObClRYAndjI9+FQvT29vJbJMJGNlsDtRPBjhLouo6tFFqZM/v278dsamL60aPaidnM3vnmNIQQaEKwYVk0NDSUPJhMp0mm0/+JHCCTyaALgcswMLymqWwptfVEgkwmg9vtRgiBppXTozo4BrYsi2wuh7JtvF6vMjra21+sRqNtqVSKtKYRi8frSvyyYDSgw+9/YRw/\
evTpnfv329aiUQyXC+qceRF2lG3T0tzM8f7+OW3m8eP++NrajXvT061SSqRSZb8Ny6FoCpqGEIIGw8DlcvHOwEC82ecb1JRS/BWLvZ1MJn/I5/N+lGpUOwxQSo+SPtm6968dmrbhEuK51zQ/aWlp+VX73/8d/w3y7NP9Di2fPgAAAABJRU5ErkJggg==') !important;}
/* preview player */
#vpp_player_area {position:fixed; width:100%; height:100%; top:0px; left:0px; background:rgba(0,0,0,0.5); overflow:hidden !important; z-index:2147483646 !important;}
#vpp_player_area2 {position:relative; width:100%; height:100%; visibility:hidden;}
#vpp_player_box {position:absolute; background:#606060; box-shadow:0px 0px 8px 3px rgba(128,128,128,0.9); border-radius:5px 5px 0px 0px; max-width:100%; max-height:100%;}
#vpp_player_box[player_pos='00']:not([player_size='fit']) {top:0px; left:0px;}
#vpp_player_box[player_pos='01']:not([player_size='fit']) {top:0px; left:0px; right:0px; margin:auto;}
#vpp_player_box[player_pos='02']:not([player_size='fit']) {top:0px; right:0px;}
#vpp_player_box[player_pos='10']:not([player_size='fit']) {top:0px; bottom:0px; left:0px; margin:auto;}
#vpp_player_box[player_pos='11']:not([player_size='fit']) {top:0px; bottom:0px; left:0px; right:0px; margin:auto;}
#vpp_player_box[player_pos='12']:not([player_size='fit']) {top:0px; bottom:0px; right:0px; margin:auto;}
#vpp_player_box[player_pos='20']:not([player_size='fit']) {bottom:0px; left:0px;}
#vpp_player_box[player_pos='21']:not([player_size='fit']) {bottom:0px; left:0px; right:0px; margin:auto;}
#vpp_player_box[player_pos='22']:not([player_size='fit']) {bottom:0px; right:0px;}
#vpp_player_box[player_pos='right']:not([player_size='fit']) {float:right;}
#vpp_player_box[player_size='xxsmall'] {/*320x180*/ width:320px; height:200px;}
#vpp_player_box[player_size='xsmall'] {/*512x288*/ width:512px; height:308px;}
#vpp_player_box[player_size='small'] {/*768x432*/ width:768px; height:452px;}
#vpp_player_box[player_size='medium'] {/*1024x576*/  width:1024px; height:596px;}
#vpp_player_box[player_size='large'] {/*1280x720*/ width:1280px; height:740px;}
#vpp_player_box[player_size='xlarge'] {/*1600x900*/ width:1600px; height:920px;}
#vpp_player_box[player_size='xxlarge'] {/*1920x1080*/ width:1920px; height:1100px;}
#vpp_player_box[player_size='fit'] {width:100%; height:100%; border-radius:0px !important;}
#vpp_player_holder {position:relative; width:100%; height:100%;}
#vpp_player_holder2 {position:absolute; top:20px; left:0px; right:0px; bottom:0px; margin:auto; background:black;}
#vpp_player_box[player_size='fit'] #vpp_player_holder2 {left:0px !important; right:0px !important;}
#vpp_player_frame {position:relative; width:100%; height:100%; display:block; border:0px;}
#vpp_player_button_area_top {direction:ltr; font:500 14px/20px Roboto,arial,sans-serif; color:#101010; position:absolute; top:-2px; left:10px;}
#vpp_player_button_area_next {font:500 19px/20px Roboto,arial,sans-serif; color:#101010; position:absolute; top:0px; right:35px;}
.vpp_player_button {position:relative; cursor:pointer; padding:0px 5px; user-select:none; -moz-user-select:none;}
.vpp_player_button[button_kind='plus'], .vpp_player_button[button_kind='minus'] {font:500 20px/20px Roboto,arial,sans-serif !important; top:2px;}
.vpp_player_button[button_kind='left'] {padding:0px 2px 0px 5px;}
.vpp_player_button[button_kind='right'] {padding:0px 2px;}
.vpp_player_button[button_kind='up'] {padding:0px 2px;}
.vpp_player_button[button_kind='down'] {padding:0px 5px 0px 2px;}
.vpp_player_button:hover {color:#E0E0E0;}
#vpp_player_close_mark {font:14px/20px Roboto,arial,sans-serif; position:absolute; top:0px; right:5px; cursor:pointer; user-select:none; -moz-user-select:none;}
#vpp_player_close_mark:hover {color:#E0E0E0;}\
/* float preview */
#vpp_float_box {position:absolute; box-shadow:0px 0px 8px 3px rgba(128,128,128,0.9); background:black; z-index:2147483647;}
#vpp_float_frame {position:relative; width:100%; height:100%; border:0px;}
/* player options */
#vpp_player_options_popup {direction:ltr; position:absolute; left:0px; top:0px; font:11px/11px Roboto,arial,sans-serif; color:white; background:linear-gradient(#888888,#787878); padding:5px; border-radius:5px; /*z-index:2147483647;*/ z-index:2147483646;}
.vpp_player_options_text {font-weight:500; margin-left:5px; margin-top:7px; color:lemonchiffon;}
.vpp_player_options_close {font:14px/14px Roboto,arial,sans-serif; color:black; position:absolute; top:3px; right:5px; cursor:pointer; user-select:none; -moz-user-select:none;}
.vpp_player_options_close:hover {color:lightgray;}
.vpp_player_options_title {font:500 13px/13px Roboto,arial,sans-serif; padding:3px !important; color:lemonchiffon;}
/*other*/
.watched .video-thumb {opacity:1 !important;}
.yt-subscribe-button-right {margin-top:12px !important;}
.pl-video .pl-video-thumbnail,
.pl-video .pl-video-thumb,
.pl-video .yt-thumb {width: 120px !important;}
.pl-video .yt-thumb-clip > img {width:120px !important; height:auto !important;}
.pl-video-time .timestamp {padding-top:18px !important;}
`;


//==============================================================
//basic

const AREA_ID = "vpp_player_area";
const BOX_ID = "vpp_player_box";
const HOLDER_ID = "vpp_player_holder";

function newElem(tag, attrs = {}, text = null, parent = null) {

    const node = document.createElement(tag);
    for (let attr in attrs) {
        node.setAttribute(attr, attrs[attr]);
    }
    if (text) {
        node.textContent = text;
    }

    parent?.appendChild(node);

    return node;
}

function insertStyle(str, id, doc = document) {
    const style = document.getElementById(id);
    if (style) {
        style.textContent = str;
    }
    else {
        newElem("style", {"type": "text/css", "id": id}, str, document.head);
    }
}

function injectScript(str, src, doc = document) {
    if (str) {
        document.head.removeChild(newElem("script", {}, str, document.head));
    }
    else if (src) {
        newElem("script", {"src": src}, null, document.head)
    }
}

function xpath(outer_dom, inner_dom, query) {
    //XPathResult.ORDERED_NODE_SNAPSHOT_TYPE = 7
    return outer_dom.evaluate(query, inner_dom, null, 7, null);
}


function docsearch(query) {
    return xpath(document, document, query);
}


function innersearch(inner, query) {
    return xpath(document, inner, query);
}


function simulClick(el) {
    const clickEvent = document.createEvent("MouseEvents");
    clickEvent.initEvent("click", true, true);
    clickEvent.artificialevent = true;
    el.dispatchEvent(clickEvent);
}

function filter(str, w, delim) {
    if (str) {
        const m = str.match(RegExp(`[${delim}]${w}[^${delim}]*`));
        if (m != null) {
            return m[0].replace(RegExp(`[${delim}]${w}`), "");
        }
    }
    return null;
}

//==============================================================
//preferences

var pref_floatEnable = init_pref("floatEnable", true);
var pref_floatDelay = init_pref("floatDelay", 1);
var pref_playerEnable = init_pref("playerEnable", true);
var pref_rateEnable = init_pref("rateEnable", true);
var pref_defEnable = init_pref("defEnable", true);

function new_plusminus(prefname, str, parent) {
    const div = newElem("div", {"class": "vpp_generic"}, null, parent);
    newElem("span", {"id": "vpp_pref_delay_text"}, str, div);
    const num = newElem("span", {"id": "vpp_pref_delay_num"}, get_pref("floatDelay").toString() + "s", div);
    const minus = newElem("span", {"id": "vpp_pref_delay_minus", "class": "vpp_pref_delay_plusminus"}, "\u2212", div);
    const plus = newElem("span", {"id": "vpp_pref_delay_plus", "class": "vpp_pref_delay_plusminus"}, "\u002B", div);

    minus.onclick = function () {
        let val = get_pref("floatDelay");
        if (val > 0) {
            val--;
            set_pref("floatDelay", val);
            num.textContent = get_pref("floatDelay").toString() + "s";
        }
    }

    plus.onclick = function () {
        let val = get_pref("floatDelay");
        if (val < 5) {
            val++;
            set_pref("floatDelay", val);
            num.textContent = get_pref("floatDelay").toString() + "s";
        }
    }

}


function new_checkbox(prefname, str, kind, parent, value, func = function(){}) {
    const div = newElem(kind, {"class": "vpp_generic"}, null, parent);
    const input = newElem("input", {"class": "vpp_generic", "type": "checkbox"}, null, div);
    if (!value) {
        input.checked = get_pref(prefname);
        input.onclick = function (e) {
            const val = get_pref(prefname);
            set_pref(prefname, !val);
            e.target.checked = !val;
            func();
        };
    }
    else {
        input.value = value;
        input.checked = (get_pref(prefname) == input.value);
        input.onclick = function (e) {
            const val = get_pref(prefname);
            set_pref(prefname, e.target.value);
            e.target.checked = true;
            const other = innersearch(parent.parentNode, `.//input[@value='${val}']`).snapshotItem(0);
            if (other && (other != e.target)) other.checked = false;
            func();
        };
    }
    newElem("span", {"class": "vpp_opendelay"}, str, div);
}


function pref_popup_close() {
    const popup = document.getElementById("vpp_pref_popup");
    popup?.parentNode?.removeChild(popup);
}

function pref_popup_open() {
    if (document.getElementById("vpp_pref_popup")) {
        return;
    }
    const popup = newElem("span", {"id": "vpp_pref_popup"}, null, document.body);
    newElem("div", {"id": "vpp_pref_title"}, "Preview Options", popup);

    let changed = false;

    const closemark = newElem("span", {"id": "vpp_pref_close", "title": "close options"}, "\u2716", popup);
    closemark.onclick = function () {
        popup.parentNode.removeChild(popup);
        if (changed) {
            location.reload();
        }
    };

    let mark = function(){changed = true;};
    new_checkbox("floatEnable", "Hover Preview", "div", popup, null, mark);
    new_plusminus("floatDelay", "open delay", popup);
    new_checkbox("playerEnable", "Click Preview", "div", popup, null, mark);
    new_checkbox("rateEnable", "Video Rating", "div", popup, null, mark);
    new_checkbox("defEnable", "Video Resolution", "div", popup, null, mark);
}


//==================================================================
// Player

const basic_str = "((local-name()='ytd-thumbnail') or (local-name()='ytd-playlist-thumbnail')) and (not(ancestor::*[@hidden]))";
const basic_str2 = "//img[contains(@src,'vi/') or contains(@src,'vi_webp/') or contains(@src,'/p/') or contains(@src,'/s_p/')]";

function player_script() {
    injectScript(`if (YT) {
                            var player = new YT.Player('vpp_player_frame');
                            var errort = null;
                            function error_reset() { if (errort) clearTimeout(errort); }
                            function check_error(t,fid) {
                               error_reset();
                               errort = setTimeout(
                                    function (fid) {
                                       var f = document.getElementById('vpp_player_frame');
                                       if (!f) return;
                                       if (f.getAttribute('fid') != fid) return;
									   fdoc = f.contentWindow.document;
                                       var s = player.getPlayerState();
                                       var a = player.getPlaylist();
                                       var i = player.getPlaylistIndex();
                                       if (a != null ? a.length == 0 : false)
                                           f.dispatchEvent(new Event('playend'));
                                       else
                                           if ((s == -1 && fdoc.getElementsByClassName('ytp-error').length > 0) || s == 5)
                                              if ((a != null && i != null) ? i < a.length - 1 : false)
                                                 player.nextVideo();
                                              else
                                                 f.dispatchEvent(new Event('playend'));
                                    }, t, fid);
                            }
                            player.addEventListener('onReady',
                                   function () {
                                        var f = document.getElementById('vpp_player_frame');
                                        if (f) {
                                             var q = f.getAttribute('quality');
                                             if (q != 'default' && q != null) player.setPlaybackQualityRange(q);
                                         }
                                   });
                            player.addEventListener('onStateChange',
                                 function () {
                                    var f = document.getElementById('vpp_player_frame');
                                    if (!f) return;
                                    var fid = f.getAttribute('fid');
                                    var q = f.getAttribute('quality');
                                    var s = player.getPlayerState();
                                    var a = player.getPlaylist();
                                    var i = player.getPlaylistIndex();
                                    var cond = ((a != null && i != null) ? i == a.length - 1 : true);
                                    if (s == -1 || s == 5) check_error(10000,fid); else error_reset();
                                    if (s == -1 && q != 'default' && q != null) player.setPlaybackQualityRange(q);
                                    if (s == 0 && cond) f.dispatchEvent(new Event('playend'));
                                 });
                            var frame = document.getElementById('vpp_player_frame');
                            if (frame) {
                                  check_error(10000,frame.getAttribute('fid'));
                                  frame.addEventListener('loadnewvideo',
                                                          function (x) {
                                                             var fid = x.target.getAttribute('fid');
                                                             var url = x.target.getAttribute('newvidurl');
                                                             var plist = x.target.getAttribute('plist');
                                                             player.pauseVideo();
                                                             if (plist) {
                                                                player.loadPlaylist({'list':plist});
                                                                check_error(10000,fid);
                                                             }
                                                             else if (url) {
                                                                player.loadVideoByUrl(url);
                                                                check_error(10000,fid);
                                                             }
                                                          });
                            }
                     }`);
}

const choices_def = ['default', 'small', 'medium', 'large', 'hd720', 'hd1080', 'hd1440', 'highres'];
const choices_size = ['xxsmall', 'xsmall', 'small', 'medium', 'large', 'xlarge', 'xxlarge'];
const choices_pos = ['00', '01', '02', '10', '11', '12', '20', '21', '22'];

const scriptPrefs = new Proxy(JSON.parse(GM_getValue("YTVPR_prefs",
     `{
        "floatEnable": true,
        "floatDelay": 1,
        "playerEnable": true,
        "rateEnable": true,
        "defEnable": true,
        "playerFit": false,
        "playerDef": 0,
        "playerSize": 3,
        "playerPosLeft": 1,
        "playerPosTop": 1,
        "playerNext": true,
        "playerClose": true,
        "playerPause": true,
        "playerDim": true
     }`)),
     {
    set: function(obj, prop, value) {
        const clamp = function(val, min, max){ return Math.min(Math.max(min, val), max); };
        switch (prop) {
            case "playerDef": value = clamp(value, 0, choices_def.length()-1); break;
            case "playerSize": value = clamp(value, 0, choices_size.length()-1); break;
            case "playerPosLeft":
            case "playerPosTop": value = clamp(value, 0, 2); break;
        }

        if(obj[prop] != value) {
            obj[prop] = value;
            GM_setValue("YTVPR_prefs", JSON.stringify(obj));
        }
        return true;
    }
});

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

    //fix char preferences
    if (choices_def.indexOf(get_pref("playerDef")) < 0) set_pref("playerDef", 'default');
    if (choices_size.indexOf(get_pref("playerSize")) < 0) set_pref("playerSize", 'medium');
    if (choices_pos.indexOf(get_pref("playerPos")) < 0) set_pref("playerPos", '11');
}


function player_options(parent) {
    if (document.getElementById("vpp_player_options_popup")) {
        return;
    }

    const popup = newElem("span", {"id": "vpp_player_options_popup"}, null, parent);
    newElem("div", {"class": "vpp_player_options_title"}, "Player Options", popup);

    const closemark = newElem("span", {"class": "vpp_player_options_close", "title": "close options"}, "\u2716", popup);
    closemark.onclick = close_player_options;

    new_checkbox("playerNext", "Auto Play Next", "div", popup);
    new_checkbox("playerDim", "Dim Background", "div", popup, null, function () {
        document.getElementById(AREA_ID).style.visibility = (get_pref("playerDim") ? "visible" : "hidden");
    });
    new_checkbox("playerClose", "Close by Clicking Outside Player", "div", popup);
    new_checkbox("playerPause", "Pause YouTube Player at Launch", "div", popup);

    newElem("div", {"class": "vpp_player_options_text"}, "Resolution", popup);
    //default, small, medium, large, hd720, hd1080, hd1440, highres;
    const group1 = newElem("div", {"class": "vpp_player_options_group"}, null, popup);
    const group2 = newElem("div", {"class": "vpp_player_options_group"}, null, popup);
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
    const popup = document.getElementById("vpp_player_options_popup");
    if (popup) {
        popup.parentNode.removeChild(popup);
    }
}


function playerUrl(vid, pid) {
    let url = `${location.protocol}//${location.hostname}/`;

    if (vid) {
        url = `${url}embed/${vid}?`;
        if (pid) {
            url = `${url}list=${pid}`;
        }
    }
    else if (pid) {
        url = `${url}embed?listType=playlist&list=${pid}`;
    }
    else {
        console.error("Null pid and vid!");
    }

    url = `${url}&autoplay=1&fs=1&iv_load_policy=3&rel=1&version=3&enablejsapi=1`;

    return (url);
}


function adjust_playing(node) {
    const playing = document.getElementById("vpp_now_playing");
    playing?.parentNode?.removeChild(playing);
    if (node) {
        newElem("span", {"id": "vpp_now_playing"}, "now playing", node);
    }
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

    var new_size = get_pref("playerSize");
    var new_pos = get_pref("playerPos");
    var new_fit = get_pref("playerFit");

    var that = this;
    var frame_count = 0;

    //public
    this.playerShow = function (vid, pid, node) {
        const box = document.getElementById(BOX_ID);
        if (box?.style.visibility == "hidden") {
            new_size = get_pref("playerSize");
            new_pos = get_pref("playerPos");
            new_fit = get_pref("playerFit");
        }
        playerAdjust((new_fit ? "fit" : new_size), new_pos, "visible", vid, pid);
        adjust_playing(node);
    }

    this.playerClose = function () {
        playerAdjust(null, null, "hidden", null, null);
        close_player_options();
        adjust_playing();
    }


    //private
    function play_next(findprevious) {
        const playing = document.getElementById("vpp_now_playing");
        if (!playing) {
            return;
        }

        const myimg = innersearch(playing.parentNode, ".//img[@src or @data-thumb]").snapshotItem(0);
        if (myimg) {
            let pos = -2;
            let l = docsearch(`//*[(${basic_str})]${basic_str2}`);

            myimg.setAttribute("matchfind", "true");

            for (let i = 0; i < l.snapshotLength; i++) {
                if (l.snapshotItem(i).getAttribute("matchfind")) {
                    pos = i;
                    break;
                }
            }

            myimg.removeAttribute("matchfind");
            pos = (findprevious ? pos - 1 : pos + 1);

            if (pos >= 0) {
                const img = l.snapshotItem(pos);
                if (img) {
                    img.setAttribute("matchfindimg", true);
                    const target = docsearch(`//*[${basic_str} and (.//img[@matchfindimg])]`).snapshotItem(0);
                    if (target) {
                        that.playerShow(find_vid(img), find_plist(img), target);
                    }
                    img.removeAttribute("matchfindimg");
                }
            }
        }
    }

    function playerAdjust(size, pos, vis, vid, pid) {
        const box = document.getElementById(BOX_ID);
        if (vis != null) {
            box.style.visibility = vis;
            area.style.visibility = (get_pref("playerDim") ? vis : "hidden");

            let frame = document.getElementById("vpp_player_frame");
            if (frame && (vis == "hidden")) {
                frame.parentNode.removeChild(frame);
                frame = null;
            }

            if (vis == "visible") {
                const vidurl = playerUrl(vid, pid);
                const def = get_pref("playerDef");
                frame_count++;

                if (frame) {
                    frame.setAttribute("newvidurl", vidurl);
                    if (pid) frame.setAttribute("plist", pid);
                    else frame.removeAttribute("plist");
                    frame.setAttribute("quality", def);
                    frame.setAttribute("fid", frame_count.toString());

                    const event = document.createEvent("Event");
                    event.initEvent("loadnewvideo", true, true);
                    frame.dispatchEvent(event);
                }
                else {
                    frame = newElem("iframe", {"id": "vpp_player_frame", "type": "text/html", "frameborder": "0", "allowfullscreen": "true", "quality": def, "fid": frame_count.toString(), "src": vidurl}, null, document.getElementById(HOLDER_ID).firstElementChild);
                    frame.addEventListener("playend", function(){if (get_pref("playerNext")) play_next();});
                    player_script();
                }
            }
        }

        if (size != null) {
            box.setAttribute("player_size", size);
            holder.setAttribute("player_size", size);
        }

        if (pos != null) {
            box.setAttribute("player_pos", pos);
        }
    }

    function click_pos_size(e) {
        var kind = e.target.getAttribute("button_kind");
        if (!kind) return;

        if (new_fit && !(kind == "options" || kind == "prev" || kind == "next")) {
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
                player_options(document.getElementById(BOX_ID));
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
        newElem("span", {"class": "vpp_player_button", "title": str_popup, "button_kind": kind}, str, parent).onclick = click_pos_size;
    }

    //initialization;
    if (document.getElementById(AREA_ID)) {
        return;
    }

    const area = newElem("div", {"id": AREA_ID, "style": "visibility: hidden;"}, null, document.body);
    const area2 = newElem("div", {"id": "vpp_player_area2"}, null, area);
    const box = newElem("div", {"id": BOX_ID, "style": "visibility: hidden;"}, null, area2);
    const holder = newElem("div", {"id": HOLDER_ID}, null, box);
    newElem("div", {"id": "vpp_player_holder2"}, null, holder);
    area.onclick = function (e) { if (e.target.id == AREA_ID && get_pref("playerClose")) that.playerClose(); };

    const buttonArea = newElem("span", {"id": "vpp_player_button_area_top"}, null, box);
    new_button("plus", "\u002B", "increase size", buttonArea);
    new_button("minus", "\u2212", "decrease size", buttonArea);
    new_button("fit", "\u2610", "fill window", buttonArea);
    new_button('left', '\u25C4', 'move left', buttonArea);
    new_button('right', '\u25BA', 'move right', buttonArea);
    new_button('up', '\u25B2', 'move up', buttonArea);
    new_button('down', '\u25BC', 'move down', buttonArea);
    new_button("options", "\u2630", "player options", buttonArea);

    const bottomArea = newElem("span", {"id": "vpp_player_button_area_next"}, null, box);
    new_button("prev", "\u140A\u140A", "play previous in page", bottomArea);
    new_button("next", "\u1405\u1405", "play next in page", bottomArea);
    //new_button("loop", "\u21BB", "repeat video", bottomArea);

    newElem("span", {"id": "vpp_player_close_mark", "title": "close player"}, "\u2716", box).onclick = this.playerClose;
}

var player = null;
if (pref_playerEnable) {
    player = new build_player();
    injectScript(null, "https://www.youtube.com/iframe_api");
}

function ytpause() {
    const func = `(function(){
        const mainVid = document.getElementById("movie_player");
        const channelVid = document.getElementById("c4-player");
        if (mainVid && (mainVid.getPlayerState() == 1))
            mainVid.pauseVideo();
        if (channelVid && (channelVid.getPlayerState() == 1))
            channelVid.pauseVideo();
    })();`;
    injectScript(func);
}


//==================================================================
// float player

//quality is default for faster upload, and youtube player is paused
function float_script() {
    const func = `(function(){
        const fplayer = new YT.Player("vpp_float_frame");
        fplayer.addEventListener("onReady", function () {
            const mainVid = document.getElementById("movie_player");
            const channelVid = document.getElementById("c4-player");
            if (mainVid && (mainVid.getPlayerState() == 1))
                mainVid.pauseVideo();
            if (channelVid && (channelVid.getPlayerState() == 1))
                channelVid.pauseVideo();
            fplayer.setPlaybackQualityRange("default");
            });
    })();`;
    injectScript(func);
}

function float_open(e, check) {
    //check tests if same url frame is already open
    const v_id = e.target.firstElementChild?.href?.match(/(?<=v=)[a-zA-Z0-9_-]*/)?.[0];

    if (!v_id || document.getElementById("vpp_player_frame")) {
        return false;
    }

    if (!check) {
        float_delay_clear();
        adjust_playing(e.target);
    }

    const url = `https://www.youtube.com/embed/${v_id}?&autoplay=1&controls=1&iv_load_policy=3&rel=0&showinfo=1&version=3&enablejsapi=1`;
    const frame = document.getElementById("vpp_float_frame");
    if (frame) {
        if (frame.src == url) {
            return check;
        }
        if (!check) {
            frame.parentNode.removeChild(frame);
        }
    }

    if (check) {
        return false;
    }

    const float_width = 480; //512;
    const float_height = 270; //288;
    let box = document.getElementById("vpp_float_box");
    if (!box) {
        box = newElem("div", {"id": "vpp_float_box", "style": `width: ${float_width}px; height: ${float_height}px;`}, null, document.body);
        box.onmouseenter = float_delay_clear;
        box.onmouseleave = float_close_delay;
    }

    const r = e.target.getBoundingClientRect();
    const w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    const hpad = Math.round(-r.width / 3); //horizontal offset
    const vpad = 0; //vertical offset

    //priority to right
    let left = r.right + hpad;
    if ((left + float_width > w) && ((r.left - float_width - hpad >= 0) || (r.left > w - r.right))) {
            left = r.left - float_width - hpad;
    }

    //priority to left
    //let left = r.left - float_width - pad;
    //if (left < 0)
    //    if ((r.right + float_width + pad <= w) || (w - r.right > r.left))
    //        left = r.right + pad;

    //priority to top
    let top = r.top - float_height - vpad;
    if (top < 0 && (r.bottom + float_height + vpad <= h || h - r.bottom > r.top)) {
        top = r.bottom + vpad;
    }

    left += (document.body.scrollLeft || document.documentElement.scrollLeft);
    top += (document.body.scrollTop || document.documentElement.scrollTop);

    box.style.left = left + "px";
    box.style.top = top + "px";

    newElem("iframe", {"id": "vpp_float_frame", "type": "text/html", "frameborder": "0", "src": url}, null, box);

    float_script();
    return true;
}

let float_open_timeout = null;
let float_close_timeout = null;

function float_close(e) {
    clearTimeout(float_close_timeout);
    const box = document.getElementById("vpp_float_box");

    //check if mouse was in the area
    if (box) {
        if (!e || (e.target != box)) {
            box.parentNode.removeChild(box);
            adjust_playing();
        }
        else { //player should not close if mouse is still inside
            const r = box.getBoundingClientRect();
            if ((e.clientX <= r.left + 1) || (e.clientX >= r.right - 1) ||
                (e.clientY <= r.top + 1) || (e.clientY >= r.bottom - 1)) {
                box.parentNode.removeChild(box);
                adjust_playing();
            }
        }
    }
}


function float_delay_clear() {
    clearTimeout(float_open_timeout);
    clearTimeout(float_close_timeout);
}

function float_reset() {
    float_delay_clear();
    float_close();
}

function float_open_delay(e) {
    if (float_open(e, true)) {
        float_delay_clear();
    }
    else {
        clearTimeout(float_open_timeout);
        const delay = get_pref("floatDelay") * 1000;
        float_open_timeout = setTimeout(float_open.bind(null, e, false), delay);
    }
}

function float_close_delay(e) {
    float_delay_clear();
    float_close_timeout = setTimeout(float_close.bind(null, e), 200);
}


//==================================================================
//meta data

function innertube_callback(data, parent) {
    let max_res = 0;
    let max_quality_label = "";
    let formats = [];

    if (data.streamingData?.hasOwnProperty("formats")) {
        formats = formats.concat(data.streamingData.formats);
    }
    if (data.streamingData?.hasOwnProperty("adaptiveFormats")) {
        formats = formats.concat(data.streamingData.adaptiveFormats);
    }
    for (let i = 0; i < formats.length; i++) {
        const res = formats[i].width * formats[i].height;
        if (res > max_res) {
            max_res = res;
            max_quality_label = formats[i].qualityLabel;
        }
    }
    if(max_res != 0) {
        parent.setAttribute("vpp_meta_def", "");
        const def_node = newElem("span", {"class": "vpp_meta_def_container", "reveal": "true", "title": max_quality_label}, null, parent);
        const def_txt =
            max_res >= (15360 * 8640) ? "16K" :
            max_res >= (7680 * 4320) ? "8K" :
            max_res >= (2880 * 2160) ? "4K" :
            max_res >= (960 * 1080) ? "1080p" :
            max_res >= (640 * 720) ? "720p" : "SD";
        newElem("span", {"class": "vpp_meta_def_hd HD"}, def_txt, def_node);
    }
}

function rytdl_callback(data, parent) {
        if (data.likes > 0 || data.dislikes > 0) {
            const perc = Math.round((data.rating/5)*100);
            // Color scale from 50 (red) to 100 (green)
            const scaled = Math.max(0,(perc-50)/50);
            const r = Math.min(0xC0,Math.round(2*0xC0*(1-scaled)));
            const g = Math.min(0xA0,Math.round(2*0xA0*(scaled)));
            const b = 0;
            const rgb = (r << 16) | (g << 8) | b;
            const hex = `#${rgb.toString(16).padStart(6, "0")}`;

            newElem("div",
                    { "class": "vpp_meta_rate",
                      "style": `background:${hex} !important;`,
                      "title": `${Number(data.viewCount).toLocaleString()} views`
                    },
                    `${perc}`,
                    parent);
            parent.setAttribute("vpp_meta_rate", "");
        }
}

var innertube_key, client_version;
const scripts = document.getElementsByTagName("script");
for (let script of scripts) {
    innertube_key = script.textContent?.match(/"INNERTUBE_API_KEY":"([^"]*?)"/)?.[1];
    if (innertube_key) {
        client_version = script.textContent?.match(/"INNERTUBE_CLIENT_VERSION":"([^"]*?)"/)?.[1];
        break;
    }
}

const rytdl_queue = new Map();
const rytdl_counter = [];
function rytdl_req() {
    const v_id = rytdl_queue.keys().next().value;
    const rytdlReq = new XMLHttpRequest();
    rytdlReq.responseType = "json";
    rytdlReq.addEventListener("loadend", function() {
        if (this.response) {
            rytdl_callback(this.response, rytdl_queue.get(v_id));
        } else {
            console.error("rytdl request failed");
        }
        rytdl_queue.delete(v_id);
        if (rytdl_queue.size > 0) {
            let timeout = 600; // 100 reqs/min
            /* Needs Timing-Allow-Origin from server for this to work
            if (this.response) {
                const resources = performance.getEntriesByType("resource");
                for (let entry of resources) {
                    if (entry.name === this.responseURL && entry.transferSize === 0) {
                        timeout = 0;
                        break;
                    }
                }
            } */
            setTimeout(rytdl_req, timeout);
        }
    });
    rytdlReq.open("GET", `https://returnyoutubedislikeapi.com/Votes?videoId=${v_id}`);
    rytdlReq.send();
}

function def_rate(v_id, parent) {
    debug(`Getting info for ${v_id}`);
    if (pref_defEnable) {
        const params = {
            "context": {
                "client": {
                    "hl": "en",
                    "clientName": "WEB",
                    "clientVersion": `${client_version}`,
                    "clientFormFactor": "UNKNOWN_FORM_FACTOR",
                    "clientScreen": "WATCH",
                    "mainAppWebInfo": {
                        "graftUrl": `/watch?v=${v_id}`,
                    }
                },
                "user": {
                    "lockedSafetyMode": false
                },
                "request": {
                    "useSsl": true,
                    "internalExperimentFlags": [],
                    "consistencyTokenJars": []
                }
            },
            "videoId": `${v_id}`,
            "playbackContext": {
                "contentPlaybackContext": {
                    "vis": 0,
                    "splay": false,
                    "autoCaptionsDefaultOn": false,
                    "autonavState": "STATE_NONE",
                    "html5Preference": "HTML5_PREF_WANTS",
                    "lactMilliseconds": "-1"
                }
            },
            "racyCheckOk": false,
            "contentCheckOk": false
        };

        const innertubeReq = new XMLHttpRequest();
        innertubeReq.responseType = "json";
        innertubeReq.addEventListener("loadend", function(){
            if (this.response) {
                innertube_callback(this.response, parent);
            } else {
                console.error("innertube request failed");
            }
        });
        // https://stackoverflow.com/questions/67615278/get-video-info-youtube-endpoint-suddenly-returning-404-not-found
        innertubeReq.open("POST", `https://www.youtube.com/youtubei/v1/player?key=${innertube_key}`);
        innertubeReq.send(JSON.stringify(params));
    }

    if (pref_rateEnable) {
        rytdl_queue.set(v_id, parent);
        if (rytdl_queue.size === 1) {
            rytdl_req();
        }
    }
}


function find_vid(img) {
    return (filter(img.src, "vi/", "/&?#") || filter(img.src, "vi_webp/", "/&?#"));
}


function find_plist(img) {
    let plist = null;
    const anc = innersearch(img, "ancestor-or-self::*[contains(@href,'&list=') and (.//*[contains(@class,'yt-pl-sidebar-content') or contains(@class,'ytd-thumbnail-overlay-side-panel-renderer')])]").snapshotItem(0);
    if (anc) {
        plist = filter(anc.href, "list=", "/&?#");
        if (plist == "WL") {
            plist = null;
        }
    }
    return plist;
}


function play(parent) {
    const playArea = newElem("div", {"class": "vpp_play_button_container"}, null, parent);
    const playNode = newElem("a", {"class": "vpp_play_button", "href": "javascript:;", "target": "_self", "title": "click to preview"}, null, playArea);

    const play_handle = function(e) {
        e.stopPropagation();
        float_reset();

        const parpar = e.target.parentNode.parentNode;
        if (innersearch(parpar, ".//*[@id='vpp_now_playing']").snapshotLength > 0) {
            player.playerClose();
        }
        else {
            const img = innersearch(parpar, `.${basic_str2}`).snapshotItem(0);
            if (img) {
                player.playerShow(find_vid(img), find_plist(img), parpar);
                if (get_pref("playerPause")) {
                    ytpause();
                }
            }
            else {
                console.error("play(parent): img not found");
            }
        }
    }

    playNode.onclick = play_handle;
}


//==================================================================
// Main
debug("***YouTube Video Preview and Ratings Keyless***");

//insert styles
insertStyle(style_basic, "vpp_style_basic");

if (pref_playerEnable) {//hide overlay of playlist
    insertStyle(".yt-pl-thumb-overlay, ytd-thumbnail-overlay-hover-text-renderer {display:none !important;}", "vpp_style_list_overlay");//OLD,NEW
}

(function insertMenuBtn() {
    const par = document.getElementById("masthead-container");
    if (par) {
        newElem("span", {"id": "vpp_pref_button", "title": "Preview Options"}, null, par).onclick = pref_popup_open;
    }
    else {
        new MutationObserver(function(mutations, observer) {
            observer.disconnect();
            insertMenuBtn();
        }).observe(document.getElementById("masthead"), {childList: true});
    }
})();

function processThumbs(thumbs) {
    for (let thumb of thumbs) {
        const parent = thumb.parentNode;
        const v_id = thumb.href?.match(/(?<=v=|shorts\/)[a-zA-Z0-9_-]*/)?.[0];
        if (v_id) {
            if (pref_defEnable || pref_rateEnable) {
                def_rate(v_id, parent);
            }
            if (pref_floatEnable) {
                parent.onmouseenter = float_open_delay;
                parent.onmouseleave = float_close_delay;
            }
            if (pref_playerEnable) {
                play(parent);
            }
        }
    }
}
processThumbs(Array.from(document.body.querySelectorAll("#thumbnail")));

new MutationObserver(function(mutations, observer) {
    for (let mutation of mutations) {
        const thumbs = Array.from(mutation.addedNodes).filter(node => (node.nodeType === Node.ELEMENT_NODE && node.id === "thumbnail"));
        processThumbs(thumbs);
    }
}).observe(document.body, {childList: true, subtree: true});
