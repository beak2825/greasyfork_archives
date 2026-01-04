// ==UserScript==
// @name         课程视频助手
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  防止掉线；每分钟更新视频观看时间；结束后自动跳转下一视频；解除鼠标右键和F12禁用
// @author       零度
// @match        *://course.ucas.ac.cn/portal/site/*/tool/*/video/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/397309/%E8%AF%BE%E7%A8%8B%E8%A7%86%E9%A2%91%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/397309/%E8%AF%BE%E7%A8%8B%E8%A7%86%E9%A2%91%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var doc = document;
    var url = doc.URL;
    var html_source = doc.documentElement.outerHTML;
    if(url.indexOf('list')>=0){
        var video_id_list = html_source.match(/(?<=gotoPlay\(\')[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}/g);
        GM_setValue('VideoList', video_id_list);
    }
    else if(url.indexOf('play')>=0){
        portal.updateVideoView_url = html_source.match(/(?<=\$\.post\(\").*w(?=\",)/)[0];
        portal.updateVideoView_id = html_source.match(/(?<=id\:\s\")[0-9]*/)[0];
        portal.updateVideoView = function updateVideoView(){
            var videoState = $("#videoState").val();
		    if(videoState=="1"){
                $.post(portal.updateVideoView_url, { id: portal.updateVideoView_id },
		            function(data, state){
		                console.log('更新视频观看时间：'+state);
		 	            return("确定要关闭页面吗?");
	                }
                );
            }
        }
        portal.forever_keep_alive = function forever_keep_alive(){
            clearTimeout(sessionTimeOut);
            keep_session_alive();
            portal.updateVideoView();
            portal.forever_keep_alive_timer = setTimeout('portal.forever_keep_alive()', 60000);
        }
        portal.forever_keep_alive();
        portal.video_list = GM_getValue('VideoList', '');
        if(portal.video_list!=''){
            portal.cur_video_id = url.match(/(?<=id\=)[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}/)[0];
            var cur_video_index = portal.video_list.indexOf(portal.cur_video_id);
            if(cur_video_index>0){
                portal.next_video_id = portal.video_list[cur_video_index-1];
                portal.next_video_url = url.replace(/(?<=id\=)[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}/, portal.next_video_id);
                portal.goto_next_video = function goto_next_video(){
                    window.location = portal.next_video_url
                }
            }
            else{
                portal.next_video_id = null;
                portal.next_video_url = null;
                portal.goto_next_video = function goto_next_video(){
                    alert('暂无下一个视频！')
                }
            }
            player.on("ended", function(){
		        console.log("播放结束");
                portal.updateVideoView();
	            $("#videoState").val("0");
                console.log("10秒后进入下一个视频");
                portal.goto_next_video_timer = setTimeout('portal.goto_next_video()', 10000);
	        });
        }
        else{
            alert('未获取到视频列表，请返回视频列表后再点击进入视频播放界面！')
        }
    }
    //following code is copied from chrome extension 'Enable Copy'
var body = doc.body;
var html = doc.documentElement;
function allowUserSelect(element) {
	element.setAttribute('style', '-webkit-user-select: auto !important');
	element.setAttribute('style', 'user-select: auto !important');
	return element;
}

function clearHandlers() {
	html.onselectstart = html.oncopy = html.oncut = html.onpaste = html.onkeydown = html.oncontextmenu = html.onmousemove = body.oncopy = body.oncut = body.onpaste = body.onkeydown = body.oncontextmenu = body.onmousedown = body.onmousemove = body.onselectstart = body.ondragstart = doc.onselectstart = doc.oncopy = doc.oncut = doc.onpaste = doc.onkeydown = doc.oncontextmenu = doc.onmousedown = doc.onmouseup = window.onkeyup = window.onkeydown = null;
	allowUserSelect(html);
	allowUserSelect(body);
}
clearHandlers();

var jQuery = window.jQuery;

var $Fn = window.$Fn;
if ($Fn) {
	try {
		$Fn.freeElement(doc);
		$Fn.freeElement(body);
	} catch (e) {}
}

var jindo = window.jindo;
if (jindo) {
	jindo.$A = null;
}

var domain_pattern = /^https?:\/\/([^\/]+)/;
var result = domain_pattern.exec(url);
if (result) {
	try {
		var domain = result[1];
		if (jQuery) {
			var $doc = jQuery(doc);
			var $body = jQuery(body);
			if ($doc.off) {
				$doc.off();
				$body.off();
				jQuery(window).off();
			} else {
				$doc.unbind();
				$body.unbind();
				jQuery(window).unbind();
			}
		}
	} catch (e) {
		console.log(e);
	}
}
})();