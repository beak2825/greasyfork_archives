// ==UserScript==
// @name         DJ网站舞曲下载[52pojie]
// @namespace    http://nickvico.com/
// @version      0.4.1
// @description  DJKK舞曲网、清风DJ舞曲网、IK123、DJ炫音社 舞曲下载。
// @author       NewType
// @match        *://*.djkk.com/dance/play/*
// @match        *://*.ik123.com/mp3-dj/*
// @match        *://*.vvvdj.com/play/*
// @match        *://*.xuanyinshe.com/*&tid=*
// @connect      vvvdj.com
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/27090/DJ%E7%BD%91%E7%AB%99%E8%88%9E%E6%9B%B2%E4%B8%8B%E8%BD%BD%5B52pojie%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/27090/DJ%E7%BD%91%E7%AB%99%E8%88%9E%E6%9B%B2%E4%B8%8B%E8%BD%BD%5B52pojie%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if( inurl('djkk.com') ) {
        var m4a = list[0].m4a;
        var mp3 = m4a.replace('//mx.djkk.com/mix', '//do.djkk.com/mp3').replace('.m4a', '.mp3');
        $('li#songdown>a').attr('href', mp3);
        $('body').append('<div class="tips">歌曲名: ' + list[0].title + '　 下载: <a target="_blank" href="' + m4a + '">【m4a格式】</a> <a target="_blank" href="' + mp3 + '">【mp3格式】</a></div>');
    }

    if( inurl('vvvdj.com') ) {
        var mp4 = 'http://' + fwq3g + '.vvvdj.com/mp4/' + mpurl + '.mp4'; //需要将UA伪装成移动端才可以试听及下载。
        $('body').append('<div class="tips">歌曲名: ' + n + '　 下载: <a id="by_xhr" target="_blank" href="' + mp4 + '">【m4a格式 - 浏览器下载】</a> <b></b>　<a id="by_aria2" target="_blank" href="">【使用 Aria2 下载】</a></div>');
        $('a#by_xhr').click(function() { download(); return false; });
		$('a#by_aria2').click(function() { downloadByaria2(); return false; });
    }

    if( inurl('ik123.com') ) {
        $('body').append('<div class="tips">歌曲名: ' + musicName + '　 下载: <a target="_blank" href="' + ipurl + '">【m4a格式】</a> <a target="_blank" href="' + ikurl + '">【mp3格式(一)】</a> <a target="_blank" href="' + ikurls + '">【mp3格式(二)】</a></div>');
    }

    if( inurl('xuanyinshe.com') ) {
		(function(d, l) {
			var getQueryString = function(name) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
				var r = l.search.substr(1).match(reg);
				return r != null ? decodeURIComponent(r[2]) : null;
			};
			var song = l.protocol + "//" + l.host + "/plugin.php?id=mxi_aplay:download&aid=" + d.querySelector("a[tid='" + getQueryString("tid") + "']").getAttribute("packaid");
			var n = d.querySelector("h4.mp3Title").textContent;
			d.body.insertAdjacentHTML("beforeend", '<div class="tips">歌曲名: ' + n + '　 下载: <a download="' + n + '.mp3" href="' + song + '">【mp3格式】</a></div>');
		})(document, location);
    }

    GM_addStyle(`.tips {
    color: #fff;
    position: fixed;
    top: 0px;
    background: #6e6d65;
    width: 100%;
    padding: 4px;
    text-align: center;
}
.tips a,b {
    color: #9add0f;
}`);

    function inurl(str) {
        var url = document.location.href;
        return url.indexOf(str) >= 0;
    }

    function downloadProgress(event) {
        if(event.lengthComputable) {
            var percentComplete = event.loaded / event.total * 100;
            $('div.tips>b').text(percentComplete.toFixed(2) + '%');
        }
    }

    function download() {
        var tips = $('div.tips');
        tips.find('a#by_xhr').hide();
		tips.find('b').text('准备下载...');
        GM_xmlhttpRequest({
            method: 'GET',
            responseType: 'blob',
            headers: {'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'},
            url: mp4,
            onload: function(r) {
                var tips = $('div.tips');
                tips.find('b').text('处理中...');
                var a = document.createElement('a');
                var burl = window.URL.createObjectURL(r.response);
                a.href = burl;
                a.download = n + '.m4a';
                a.click();
                window.URL.revokeObjectURL(burl);
                tips.find('a#by_xhr').show();
				tips.find('b').text('');
            },
            onprogress: function(r) { downloadProgress(r); }
        });
    }

    function downloadBybrowser() {
        GM_download({
            url: mp4,
            name: n + '.mp4',
            header: {'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'},
            onload: function(){
                alert('下载成功!');
            },
            onerror: function(download){
				console.log(download);
                alert('下载失败!');
            }
        });
    }

	function downloadByaria2() {
		var rpc = {
			'jsonrpc': '2.0',
			'method': 'aria2.addUri',
			'id': (new Date()).getTime().toString(),
			'params': [
				[ mp4 ],
				{
					'out': n + '.m4a',
					'header': 'User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
				}
			]
		};
		var xhr = new XMLHttpRequest();
		xhr.open('POST', 'http://192.168.1.1:6800/jsonrpc?tm=' + (new Date()).getTime().toString(), true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		xhr.onload = function(e) {
			if(this.status == 200 || this.status == 304){
				alert('任务已经添加至 Aria2-rpc 请自行查看!');
			}
		};
		xhr.onerror = function(e) { alert('添加任务失败!'); };
		xhr.send(JSON.stringify(rpc));
	}
})();