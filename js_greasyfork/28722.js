// ==UserScript==
// @name         吐槽补丁
// @description  首登免验证无视退稿绮罗星
// @icon         http://www.tucao.tv/favicon.ico
// @author       Sjmr
// @match        *://www.tucao.tv/*
// @version      1.13
// @run-at       document-start
// @namespace    https://greasyfork.org/users/23790
// @downloadURL https://update.greasyfork.org/scripts/28722/%E5%90%90%E6%A7%BD%E8%A1%A5%E4%B8%81.user.js
// @updateURL https://update.greasyfork.org/scripts/28722/%E5%90%90%E6%A7%BD%E8%A1%A5%E4%B8%81.meta.js
// ==/UserScript==

document.addEventListener("DOMContentLoaded", function (){
	function Link(){
		var b = document.getElementById('Button');
		var l = document.getElementById('Link');
		var t = document.getElementById('Text');
		if (!parseInt(b.style.left)){b.style.left = '80px'; l.style.left = '0px'; t.innerText = '◀';}
		else{b.style.left = '0px'; l.style.left = '-80px'; t.innerText = '▶';}
	}

	if (document.cookie.indexOf('tucao_verify') === -1) document.cookie ='tucao_verify=ok;path=/;max-age=31536000;';
	var url = location.href.toString();
	if (url.search(/check\.php\?url=/i) != -1){
		url = url.split('url=');
		location.href = atob(url[1]);
		return;
	}

    if(document.getElementById('play_ren')){
		var oldDiv = document.querySelector('div[style^="height: 172px;overflow: hidden"]');
		if (oldDiv) oldDiv.outerHTML='<div id="video_part"></div><div id="player"></div>';
		var id = url.match(/(?:[?&]id=|play\/h)([0-9]{7,})/i)[1];
		var div = document.createElement('div');
		div.innerHTML = '<div id="Layer"><div id="Link"><a href="https://www.biliplus.com/play/h'+ id + '/" title="&#x70b9;&#x51fb;&#x8bbf;&#x95ee;&#x20;' +
			'&#x42;&#x2b;&#x20;&#x5bf9;&#x5e94;&#x9875;&#x9762;" target="_blank">BiliPlus</a></div><div id="Button"><span id="Text">▶</span></div></div>';
		document.body.appendChild(div);
		document.getElementById('Button').addEventListener('click', Link, false);

		var s = [].slice.call(document.getElementsByTagName('script'));
		var t = s.filter(function(e){return e.innerText.search('bd_share_config') != -1;})[0].innerText;
		var image = t.match(/"bdpic":"(http.*?)",/i)[1];
		var cover = document.createElement('div');
		var p = document.getElementsByClassName('right')[0];
		p.insertBefore(cover, p.firstChild);
		cover.outerHTML = '<div class="title_gray" style="margin-top:0px;"><span class="name icon_r star">&#x5c01;&#x9762;</span>' +
			'</div><div class="thumb"><a href="' + image + '" target="_blank"><img src="' + image + '" style="max-width:266px;" ' +
			'title="&#x70b9;&#x51fb;&#x67e5;&#x770b;&#x539f;&#x56fe;"></div><div style="padding-top:20px;"></div>';

		var part = parseInt(location.hash.slice(1));
		if (!part) part = 0; else part -= 1;
		var d = '/index.php?m=mukio&c=index&a=init&playerID=11-' + id + '-1-' + part;
		var dm = document.createElement('a');
		var f = document.querySelector('.float_div ul');
		f.insertBefore(dm, f.lastChild.previousSibling);
		dm.outerHTML = '<a href="' + d + '" style="line-height:34px;" target="_blank" id="dm">&#x5f39;&#x5e55;</a>';
		var target = document.getElementById('video_part');
		new MutationObserver(function(){
			part = parseInt(document.querySelector('a.now').href.split('#')[1]) - 1;
			document.getElementById('dm').href = '/index.php?m=mukio&c=index&a=init&playerID=11-' + id + '-1-' + part;
		}).observe(target, {attributes: true, attributeFilter: ['class'], subtree: true});

		var style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = '#Layer{z-index:99999;} #Link a{color:white; margin:auto;} #Button span{cursor:pointer; color:white; margin:auto;}' +
			'#Link{position:fixed; left:-80px; top:155px; width:74px; height:34px; background:#3388FF; border:3px solid #D8033E; display:flex;}' +
			'#Button{position:fixed; left:0; top:155px; width:14px; height:34px; background:#D8033E; border:3px solid #D8033E; display:flex;}' +
			'.thumb{border:1px solid #ddd; border-top-style:none; padding:16px;} .star{background-position:0px -637px;}';
		document.head.appendChild(style);

		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = '/skin2013/player.js';
		document.body.appendChild(script);
	}
});

