// ==UserScript==
// @name        selection length | 选中计字数
// @namespace   hzhbest
// @description    鼠标拖选显示选中字数
// @include     https://*
// @include     http://*
// @version     1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10763/selection%20length%20%7C%20%E9%80%89%E4%B8%AD%E8%AE%A1%E5%AD%97%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/10763/selection%20length%20%7C%20%E9%80%89%E4%B8%AD%E8%AE%A1%E5%AD%97%E6%95%B0.meta.js
// ==/UserScript==

(function() {
	
	// CONFIG
	var _use_alt = true; // true－必须按住Alt才显示；false－直接显示。
	// CONFIG
	
	document.addEventListener('mouseup', function(e) {
		if (!_use_alt || e.altKey) setTimeout(function(){count(e);},150);
	}, false);

	var tooltip = creaElemIn('div', document.body);
	tooltip.id = "sl_tooltip";	
	var timer, content, overed = false;
	var timeout = 1000;
	
	// Insert CSS
	var headID = document.getElementsByTagName('head')[0];         
	var cssNode = creaElemIn('style', headID);
	cssNode.type = 'text/css';
	cssNode.innerHTML = `
	#sl_tooltip {
		display: none;
		position: fixed;
		z-index: 999999;
		font-size: 12pt;
		background: white;
		border: 1px solid #eee;
		box-shadow: 0 1px 12px #3332;
	}

	#sl_tooltip.show {
		display: block;
	  padding: 0.2em 0.3em;
	  border-radius:0.3em;
	}

	#sl_tooltip table {
		line-height: 15 pt;
		border-collapse: collapse;
		border-spacing: 0;
		font-size: 10pt;
	}

	#sl_tooltip .subT{
		border-top: 0.4em solid white;
	}`;


function count(e) {
	if (overed) return;
	var ae = document.activeElement; //console.log(ae.value + "|" + ae.selectionStart + "|" + ae.selectionEnd);
	if (ae.tagName.toLowerCase() == "input" || ae.tagName.toLowerCase() == "textarea") {
		content = ae.value.substring(ae.selectionStart, ae.selectionEnd);
	} else {
		content = getSelection().toString();
	}
	var selCount = content.length;
	if (selCount == 0) return;
		//借用一字数统计脚本代码
			var cvalue=content.replace(/\r\n/g,"\n");
			var sarr=cvalue.split("");
			var len_total=sarr.length;
			var r={
				"wd":0,  //中英文字数
				"nwd":0, //英数词数
				"kwd":0, //日文假名
				"krd":0, //韩文字
				"nb":0,  //数字词数
				"c":0,   //字符数
				"cb":0,  //非空格字符
				"r":0,   //回车
				"en":0,  //英文字母数
				"cn":0,  //中文字数
				"bl":0   //非回车空格
			};
			var words=cvalue.match(/\w+([’\']\w+)?/g)||[];    //含撇号（如I'm）的单词视为一个词
			var numbers=cvalue.match(/\b\d+(\.\d+)?\b/g)||[];  //含小数点的数字视为一个词
			var cnwords=cvalue.match(/[\u4e00-\u9fa5]/g)||[];  //统一中文字范围
			var kanawds=cvalue.match(/[\u3040-\u30ff]/g)||[];  //日文假名范围
			var krwords=cvalue.match(/[\uac00-\ud7af]/g)||[];  //韩文字范围
			r.nwd=words.length;
			r.nb=numbers.length;
			r.cn=cnwords.length;
			r.kwd=kanawds.length;
			r.krd=krwords.length;
			for(var i=0;i<len_total;i++){
				r.c++;
				switch(true){
					case /[a-zA-Z]/.test(sarr[i]):
						r.en++;
						break;
					case /\S/.test(sarr[i]):
						r.cb++;
						break;
					case /\s/.test(sarr[i]):
						if(sarr[i]=="\n"||sarr[i]=="\r"){
							r.r++;
						}else{
							r.bl++;
						}
				}
			}
			r.wd=r.nwd+r.cn+r.kwd+r.krd;
			var str="字符统计<br/>";
			str+="<table border='0' cellpadding='0' cellspacing='0' width='100%'>";
			str+="<tr class='subT'><td algin='left'>总字符数:</td><td align='right'>　"+(r.c-r.r)+"</td></tr>";
			// str+="<tr><td algin='left'>非空白总字符数:</td><td align='right'>"+(r.c-r.bl-r.r)+"</td></tr>";
			str+="<tr><td algin='left'>　空白字符:</td><td align='right'>　"+r.bl+"</td></tr>";
			str+="<tr><td algin='left'>　英文字符:</td><td align='right'>　"+r.en+"</td></tr>";
			str+="<tr><td algin='left'>　其它字符:</td><td align='right'>　"+(r.c-r.en-r.bl-r.cn-r.r)+"</td></tr>";
			// str+="<tr><td algin='left'>&nbsp;</td><td align='right'>&nbsp;</td></tr>";
			str+="<tr class='subT'><td algin='left'>总字词数:</td><td align='right'>　"+r.wd+"</td></tr>";
			if(r.cn > 0)	str+="<tr><td algin='left'>　中文字:</td><td align='right'>　"+r.cn+"</td></tr>";
			if(r.kwd > 0)	str+="<tr><td algin='left'>　日文假名:</td><td align='right'>　"+r.kwd+"</td></tr>";
			if(r.krd > 0)	str+="<tr><td algin='left'>　韩文字:</td><td align='right'>　"+r.krd+"</td></tr>";
			if(r.nwd-r.nb > 0)str+="<tr><td algin='left'>　英文单词:</td><td align='right'>　"+(r.nwd-r.nb)+"</td></tr>";
			if(r.nb > 0)	str+="<tr><td algin='left'>　阿拉伯数字:</td><td align='right'>　"+r.nb+"</td></tr>";
			// str+="<tr><td algin='left'>&nbsp;</td><td align='right'>&nbsp;</td></tr>";
			str+="<tr class='subT'><td algin='left'>回行数:</td><td align='right'>　"+(r.r+1)+"</td></tr>";
			str+="</table>";
	tooltip.innerHTML = str;
	// tooltip.innerHTML = getSelection().toString();  //for debug
	tooltip.className = "show";
	tooltip.style.top = Math.min(e.clientY + 10, window.innerHeight - tooltip.offsetHeight - 10) + "px";
	tooltip.style.left = Math.min(e.clientX + 20, window.innerWidth - 150) + "px";
	
	function hide(){
		tooltip.className = '';
		tooltip.removeEventListener('mouseover', over, false);
		tooltip.removeEventListener('mouseout', out, false);
	}
	function over() {
		overed = true;
		clearTimeout(timer);
	}
	function out() {
		overed = false;
		timer = setTimeout(hide, timeout);
	}
	tooltip.addEventListener('mouseover', over, false);
	tooltip.addEventListener('mouseout', out, false);
	timer = setTimeout(hide, timeout * 3);
}


// Create an element
function creaElemIn(tagname, destin) {
	var theElem = destin.appendChild(document.createElement(tagname));
	return theElem;
}


})();