// ==UserScript==
// @name         missevan MP3下载
// @namespace    https://greasyfork.org/users/2646
// @contributionURL http://clso.tk/donate/
// @contributionAmount 6.66
// @version      1.0
// @description  missevan M站免鱼干下载音频文件，突破UP主禁止下载限制。（请勿滥用，下载后记得投鱼干支持UP！）
// @author       CLE
// @match        http://www.missevan.com/sound/player*
// @match        https://www.missevan.com/sound/player*
// @grant        none
// @compatible   Chrome ONLY
// @downloadURL https://update.greasyfork.org/scripts/31145/missevan%20MP3%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/31145/missevan%20MP3%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

// 拦截 pushState 事件:
var _wr = function(type) {
    var orig = history[type];
    return function() {
        var rv = orig.apply(this, arguments);
        var e = new Event(type);
        e.arguments = arguments;
        window.dispatchEvent(e);
        return rv;
    };
};
history.pushState = _wr('pushState');
history.replaceState = _wr('replaceState');

window.addEventListener('pushState', function(e) {
    getMp3();
});
window.addEventListener('replaceState', function(e) {
    getMp3();
});

function getMp3(){
	var url = document.location.toString();
	var m = url.match(/^https?:\/\/www\.missevan\.com\/sound\/player\?id=(\d+)$/i);
	if(m){
		var mjson = "https://www.missevan.com/sound/getsound?soundid=" + m[1];
		$.getJSON( mjson , function(json){
			if( json.state=="success" ){
				var mads = "https://static.missevan.com/MP3/" + json.info.sound.soundurl;
				var fname = json.info.sound.soundstr + ".mp3";
				$("#download-btn").attr("href", mads).attr("download", fname).find("span").text("右键另存");
			}
		});
	}
}

$(function(){
	$("#download-container").unbind();
	getMp3();
});