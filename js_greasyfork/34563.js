// ==UserScript==
// @name           Browser Video Options
// @description    Customize video playback
// @author         Karl Piper
// @homepage       https://greasyfork.org/en/users/8252
// @namespace      https://greasyfork.org/en/users/8252
// @include        /^(https?|file)[\.:]\/{2,3}.*\.(mts|avi|mov|ogm|wav|webm|mkv|flv|ogv|ogg|wmv|mp4|m4p|m4v|mpg|mp2|mpe|mpeg|mpv|3gp|3gpp|3g2)$/
// @grant          none
// @require        https://code.jquery.com/jquery-3.4.0.min.js
// @icon           https://i.imgur.com/CxT2VtA.png
// @version        2.3
// @downloadURL https://update.greasyfork.org/scripts/34563/Browser%20Video%20Options.user.js
// @updateURL https://update.greasyfork.org/scripts/34563/Browser%20Video%20Options.meta.js
// ==/UserScript==

/*═════════════════╦═══════════════════════════════════╦════════════╗
║ Options          ║              Description          ║   Value    ║
╠══════════════════╬═══════════════════════════════════╬════════════╣
║ controls         ║ Show video controls bar           ║ true/false ║
║ noDownload       ║ Hide download control control     ║ true/false ║
║ noRemotePlayback ║ Hide remote playback control      ║ true/false ║
║ noFullscreen     ║ Hide fullscreen control           ║ true/false ║
║ noPip            ║ Hide picture-in-picture control   ║ true/false ║
║ loop             ║ Replay video after ending         ║ true/false ║
║ autoplay         ║ Automatically start playing       ║ true/false ║
║ muted            ║ Mute video (overrides volume)     ║ true/false ║
║ width            ║ Video width, optional             ║ CSS units  ║
║ height           ║ Video height, optional            ║ CSS units  ║
║ poster           ║ Placeholder image, optional       ║ URL        ║
║ volume           ║ Volume, defaults to 1.0, optional ║ 0.0 - 1.0  ║
║ customCss        ║ Styles applied to page, optional  ║ CSS        ║
╠══════════════════╬═══════════════════════════════════╬════════════╣
║ showSettings     ║ Display settings, for debugging   ║ true/false ║
╚══════════════════╩═══════════════════════════════════╩═══════════*/
var loop = true;
var autoplay = true;
var muted = false;
var controls = true;
var noPip = false;
var noDownload = false;
var noRemotePlayback = false;
var noFullscreen = false;
var width = '100%';
var height = 'auto';
var poster = '';
var volume = '';
var customCss = ``;
var showSettings = false;
/*═════════════════════════════════════════════════════════════════*/

$(function(){
	//reset with blank video element
	$('video').replaceWith(function () {
		return $('<' + this.nodeName + '>').append($(this).contents());
	});
	//set controlslist
	var controlslist = '';
	if (noRemotePlayback) {noRemotePlayback = 'noRemotePlayback'} else {noRemotePlayback = null}
	if (noDownload) {noDownload = 'nodownload'} else {noDownload = null}
	if (noFullscreen) {noFullscreen = 'noFullscreen'} else {noFullscreen = null}
	$.each([noDownload, noRemotePlayback, noFullscreen], function(i, v) {
		if (v) {
			if (controlslist.length) controlslist += ' ';
			controlslist += v.toLowerCase();
		}
	});
	//set volume
	$('video').prop('volume', volume);
	if (muted) {
		$('video')[0].muted = "muted";
	}
	//nullify unset variables
	if (!customCss) customCss = null;
	if (!width) width = null;
	if (!height) height = null;
	if (!poster) poster = null;
	if (!volume) $('video').prop('volume', 1);
	if (!controlslist) controlslist = null;
	if (noPip) var disablepictureinpicture = true;
	//apply all video attributes
	$('video').attr({disablepictureinpicture, controls, controlslist, autoplay, loop, width, height, poster});
	//debugging options
	if (showSettings) {
		$('body').append('<div class="showSettings">' + '<span>loop:</span><span>' + loop + '</span><br>'+ '<span>autoplay:</span><span>' + autoplay + '</span><br>'+ '<span>muted:</span><span>' + muted + '</span><br>'+ '<span>controls:</span><span>' + controls + '</span><br>'+ '<span>noPip:</span><span>' + noPip + '</span><br>'+ '<span>noDownload:</span><span>' + noDownload + '</span><br>'+ '<span>noRemotePlayback:</span><span>' + noRemotePlayback + '</span><br>'+ '<span>noFullscreen:</span><span>' + noFullscreen + '</span><br>'+ '<span>width:</span><span>' + width + '</span><br>'+ '<span>height:</span><span>' + height + '</span><br>'+ '<span>poster:</span><span>' + poster + '</span><br>'+ '<span>volume:</span><span>' + volume + '</span><br><span>customCss:</span><span>' + customCss + '</span>'+ '</div>');
		$('.showSettings').css({'color':'white','position':'absolute','pointer-events':'none'});
		$('.showSettings span').css({'min-width':'150px','display':'inline-block','margin-bottom':'4px','background':'rgba(0,0,0,.5)','white-space':'pre'});
	}
	//custom css
	if (customCss) {
		$('<style id="browser-video-options-css">'+customCss+'</style>').appendTo('head');
	}
});
