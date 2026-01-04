// ==UserScript==
// @version 1.0.
// @namespace SEO-bookmarklet
// @license MIT 
// @description SEO bookmarklet
// @name SEO-bookmarklet
// @name:ru SEO-bookmarklet
// @match SEO-bookmarklet
// @downloadURL https://update.greasyfork.org/scripts/484279/SEO-bookmarklet.user.js
// @updateURL https://update.greasyfork.org/scripts/484279/SEO-bookmarklet.meta.js
// ==/UserScript==

var XHR = ('onload' in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
var xhr = new XHR();
xhr.open('GET', window.location, true);
xhr.send();
xhr.onload = function() {
	var code = xhr.responseText;
	if(code){
		var codeB = true;
	}else{
		alert('Не удалось получить код страницы.');
		return;		
	}
	var script = code.match( /<script.*?\>([\s\S]*?)<\/script\>/g );
	code = code.replace(/\<script.*?\>.*?\<\/script\>/gi, ' ');
	var comment = code.match( /<!--([\s\S]*?)-->/g );
	code = code.replace(/\r|\n|\t/g, ' ');
	code = code.replace(/<!--[\s\S]*?-->/gi, ' ');
	code = code.replace(/<noscript.*?>.*?<\/noscript>/gi, ' ');
	code = code.replace(/<style.*?>.*?<\/style>/gi, ' ');
	codeB = code;
	code = code.match( /<body.*?>.*?<\/body>/i );
	if(!code) code = codeB.match( /<body.*?>.*/i );
	if(!code && codeB){
		alert('Не удалось проверить из-за ошибок в HTML коде. Проверьте код страницы на валидность.');
		return;
	}
	function dsr(str){
		while(str.indexOf('  ') + 1){
			str = str.replace(/  /g, ' ');
		}
		return str;
	}
	code = dsr(code[0]);
	var h = code.match( /<h[0-6].*?>.*?<\/h[0-6]>/gi );
	if(!h) h = [];
	var hd = [];
	for(var i=0;i<h.length;i++){
		hd[i] = []
		hd[i]['head'] = h[i].substr(2, 1);
		hd[i]['text'] = h[i].replace(/<.*?>/gi, '');
	}
	
	var tempHeaders = [], hErr = false;
	for(var i=0;i<hd.length;i++){
		if(i==0){
			if(hd[0]['head'] != 1){
				hd[0]['error'] = 'Первый заголовок не h1';
				tempHeaders[hd[0]['head']] = true;
				hErr = true;
				continue;
			}
		}
		
		if(hd[i]['head'] == 1 && tempHeaders[1]){
			hd[i]['error'] += 'Более одного заголовка H1. ';
		}
		
		if(hd[i]['head'] == 1 && (tempHeaders[2] || tempHeaders[3] || tempHeaders[4] || tempHeaders[5] || tempHeaders[6])){
			hd[i]['error'] += 'Не первый заголовок в иерархии.';
		}
		
		if(hd[i]['head'] != 1 && !tempHeaders[hd[i]['head']-1]){
			hd[i]['error'] += 'Перед заголовком не было заголовка уровнем выше. ';
		}
		
		if(hd[i-1] && (hd[i]['head'] - hd[i-1]['head'] > 1)){
			hd[i]['error'] += 'Нарушает иерархию заголовков. ';
		}
		
		if(hd[i]['text'].replace(/ |\s|&nbsp;/gi, '') == ''){
			hd[i]['error'] += 'Пустой заголовок.';
		}
		tempHeaders[hd[i]['head']] = true;
		if(hd[i]['error']){
			hd[i]['error'] = hd[i]['error'].replace('undefined', '');
			hErr = true;
		} 
	}
	
	var alertStr = '',
	openLinks = '',
	descr = document.querySelector('meta[name=description]'),
	keyw = document.querySelector('meta[name=keywords]'),
	meta = document.querySelectorAll('meta'),
	bcnt = document.querySelectorAll('b'),
	strong = document.querySelectorAll('strong'),
	em = document.querySelectorAll('em'),
	links = document.querySelectorAll('a'),
	externalLinks = '',
	externalLinksCnt = 0,
	internalLinks = '',
	internalLinksCnt = 0,
	img = document.querySelectorAll('img'),
	titleAttr = document.querySelectorAll('body [title]'),
	altTitle = '',
	altCnt = 0,
	altStrCnt = 0,
	h16Str = '',
	canonical = document.querySelector('link[rel=canonical]');
	rnext = document.querySelector('link[rel=next]');
	rprev = document.querySelector('link[rel=prev]');
	
	for(var i = 0; i<meta.length; i++){
		if(meta[i].name.toLowerCase() == 'description') descr = meta[i];
		if(meta[i].name.toLowerCase() == 'keywords') keyw = meta[i];
	}
	
	if(document.title){
		alertStr += '<p><b class="link_sim"  title="Скопировать title в буфер обмена" onclick="javascript:(function(){var ta=document.createElement(\'textarea\');var body=document.querySelector(\'body\');body.appendChild(ta);ta.innerHTML=document.title;ta.select();document.execCommand(\'copy\');body.removeChild(ta);})();">Title</b> <span '+((document.title.length<30 || document.title.length>150)?"class='red'":"")+'>('+ (document.title.length) +')</span>: '+document.title+'</p>';
	}else{
		alertStr += '<p><b class="red">Title: отсутствует</b></p>';
	}
	
	if(descr){
		descr = descr.content;
		if(descr){
			alertStr += '<p><b class="link_sim" title="Скопировать description в буфер обмена" onclick="javascript:(function(){var ta=document.createElement(\'textarea\');var body=document.querySelector(\'body\');body.appendChild(ta);ta.innerHTML=document.querySelector(\'meta[name=description]\').content;ta.select();document.execCommand(\'copy\');body.removeChild(ta);})();">Description</b> <span '+((descr.length<50 || descr.length>250)?"class='red'":"")+'>('+ (descr.length) +')</span>: '+descr+'</p>';
		}else{
			alertStr += '<p><b class="red">Description: отсутствует</b></p>';
		}
	}else{
		alertStr += '<p><b class="red">Description: отсутствует</b></p>';
	}
	
	if(keyw){
		keyw = keyw.content;
		if(keyw){
			alertStr += '<p><b>Keywords</b> ('+ (keyw.length) +'): '+keyw+'</p>';
		}
	}
	
	for(var i=0;i<meta.length;i++){
		if(meta[i].name.toLowerCase() == 'robots' || meta[i].name.toLowerCase() == 'yandex' || meta[i].name.toLowerCase() == 'googlebot'){
			alertStr += '<p><b>meta '+meta[i].name+':</b> '+((meta[i].content.indexOf('noindex') + 1 || meta[i].content.indexOf('nofollow') + 1)?"<b class='red'>"+meta[i].content+"</b>":meta[i].content)+'</p>';
		}
	}
	
	if(canonical){
		canonical = canonical.href;
		if(canonical){
			alertStr += '<p><b>Canonical:</b> '+((canonical == location.href)?"<a href='"+canonical+"'>"+canonical+"</a>":"<a href='"+canonical+"'><b class='red'>"+canonical+"</b></a>")+'</p>';
		}
	}
		
	if(rnext){
		rnext = rnext.href;
		if(rnext){
			alertStr += '<p><b>rel=next: </b><a href="'+rnext+'">'+rnext+'</a></p>';
		}
	}
			
	if(rprev){
		rprev = rprev.href;
		if(rprev){
			alertStr += '<p><b>rel=prev: </b><a href="'+rprev+'">'+rprev+'</a></p>';
		}
	}
	
	if(bcnt && bcnt.length>0){
		alertStr += '<p><b>b count:</b> '+bcnt.length+'</p>';
	}
	
	if(strong && strong.length>0){
		alertStr += '<p><b>strong count:</b> '+strong.length+'</p>';
	}
	
	if(em && em.length>0){
		alertStr += '<p><b>em count:</b> '+em.length+'</p>';
	}
	
	if(comment && comment.length>0){
		var commentLen = 0;
		for(var i=0; i<comment.length; i++){
			commentLen += comment[i].length - 7;
		}
		alertStr += '<p><b>HTML комментарии:</b> <span title="Количество HTML комментариев">'+comment.length + '</span> | <span title="Объем HTML комментариев (символов)">' + commentLen +'</span></p>';
	}
	
	if(script && script.length>0){
		var scriptLen = 0;
		for(var i=0; i<script.length; i++){
			scriptLen += script[i].length - 7;
		}
		alertStr += '<p><b>JS скрипты:</b> <span title="Количество внутренних JS">'+script.length + '</span> | <span title="Объем JS кода (символов)">' + scriptLen +'</span></p>';
	}
	
	var linksTempArr = [];
	var l = '';
	for(var i=0;i<links.length;i++){
		if(linksTempArr[links[i].href]) continue;
		try{ // если в try есть ошибка, то переходит в блок catch
			l = decodeURIComponent(links[i].href);
		}catch(e){
			l = links[i].href;
		}
		if(location.hostname == links[i].hostname){
			internalLinksCnt++;
			linksTempArr[links[i].href] = true;
			internalLinks += '<li><a href="'+links[i].href+'" target="_blank">'+l+'</a>'+((links[i].rel.indexOf('nofollow') + 1)?'&nbsp;&nbsp; — &nbsp;&nbsp;<b style="text-decoration:underline;">nofollow</b>':'')+'</li>';
		}else if(links[i].href.substr(0, 4) == 'http'){
			externalLinksCnt++;
			linksTempArr[links[i].href] = true;
			externalLinks += '<li><a href="'+links[i].href+'" target="_blank">'+l+'</a>'+((links[i].rel.indexOf('nofollow') + 1)?'&nbsp;&nbsp; — &nbsp;&nbsp;<b style="text-decoration:underline;">nofollow</b>':'')+'</li>';
		}
	}
	
	for(var i=0;i<img.length;i++){
		if(img[i].alt && img[i].alt != ''){
			altCnt++;
			altStrCnt += img[i].alt.length;
			altTitle += '<li><b>alt</b> — '+img[i].alt+'</li>';
		}
	}
		
	for(var i=0;i<titleAttr.length;i++){
		if(titleAttr[i].title && titleAttr[i].title != ''){
			altCnt++;
			altStrCnt += titleAttr[i].title.length;
			altTitle += '<li><b>title</b> — '+titleAttr[i].title+'</li>';
		}
	}
	alertStr += '<p><b>alt + title:</b> <span title="Объем атрибутов a[alt] title (символов)">'+ altStrCnt +'</span></p>';
	
	
	for(var i=0;i<hd.length;i++){
		h16Str += '<li style="margin-left:'+((hd[i]['head']-1)*20)+'px"'+((hd[i]['error'])?' class="red" title="'+hd[i]['error']+'"':'')+'><span>H'+hd[i]['head']+' - '+hd[i]['text']+'</span></li>';
	}
	openLinks += '<p>';
	openLinks += '<b class="openLinksB" onclick="javascript:(function(){var pxexternallinks=document.querySelector(\'ol.pxexternallinks\'),pxinternallinks=document.querySelector(\'ol.pxinternallinks\'),pxalttitlelinks=document.querySelector(\'ol.pxalttitlelinks\'),pxh16links=document.querySelector(\'ol.pxh16links\');if(pxexternallinks.classList.contains(\'active\')){pxexternallinks.classList.remove(\'active\');pxexternallinks.style.display=\'none\';}else{pxexternallinks.classList.add(\'active\');pxexternallinks.style.display=\'block\';} pxinternallinks.style.display=\'none\';pxinternallinks.classList.remove(\'active\');pxalttitlelinks.style.display=\'none\';pxalttitlelinks.classList.remove(\'active\');pxh16links.style.display=\'none\';pxh16links.classList.remove(\'active\');})();">External Links ('+externalLinksCnt+')</b>&nbsp;&nbsp;|&nbsp;&nbsp;';
	openLinks += '<b class="openLinksB" onclick="javascript:(function(){var pxexternallinks=document.querySelector(\'ol.pxexternallinks\'),pxinternallinks=document.querySelector(\'ol.pxinternallinks\'),pxalttitlelinks=document.querySelector(\'ol.pxalttitlelinks\'),pxh16links=document.querySelector(\'ol.pxh16links\');if(pxinternallinks.classList.contains(\'active\')){pxinternallinks.classList.remove(\'active\');pxinternallinks.style.display=\'none\';}else{pxinternallinks.classList.add(\'active\');pxinternallinks.style.display=\'block\';} pxexternallinks.style.display=\'none\';pxexternallinks.classList.remove(\'active\');pxalttitlelinks.style.display=\'none\';pxalttitlelinks.classList.remove(\'active\');pxh16links.style.display=\'none\';pxh16links.classList.remove(\'active\');})();">Internal Links ('+internalLinksCnt+')</b>&nbsp;&nbsp;|&nbsp;&nbsp;';
	openLinks += '<b class="openLinksB" onclick="javascript:(function(){var pxexternallinks=document.querySelector(\'ol.pxexternallinks\'),pxinternallinks=document.querySelector(\'ol.pxinternallinks\'),pxalttitlelinks=document.querySelector(\'ol.pxalttitlelinks\'),pxh16links=document.querySelector(\'ol.pxh16links\');if(pxalttitlelinks.classList.contains(\'active\')){pxalttitlelinks.classList.remove(\'active\');pxalttitlelinks.style.display=\'none\';}else{pxalttitlelinks.classList.add(\'active\');pxalttitlelinks.style.display=\'block\';} pxexternallinks.style.display=\'none\';pxexternallinks.classList.remove(\'active\');pxinternallinks.style.display=\'none\';pxinternallinks.classList.remove(\'active\');pxh16links.style.display=\'none\';pxh16links.classList.remove(\'active\');})();">Img alt/title ('+altCnt+')</b>&nbsp;&nbsp;|&nbsp;&nbsp;';
	openLinks += '<b class="openLinksB" onclick="javascript:(function(){var pxexternallinks=document.querySelector(\'ol.pxexternallinks\'),pxinternallinks=document.querySelector(\'ol.pxinternallinks\'),pxalttitlelinks=document.querySelector(\'ol.pxalttitlelinks\'),pxh16links=document.querySelector(\'ol.pxh16links\');if(pxh16links.classList.contains(\'active\')){pxh16links.classList.remove(\'active\');pxh16links.style.display=\'none\';}else{pxh16links.classList.add(\'active\');pxh16links.style.display=\'block\';} pxexternallinks.style.display=\'none\';pxexternallinks.classList.remove(\'active\');pxinternallinks.style.display=\'none\';pxinternallinks.classList.remove(\'active\');pxalttitlelinks.style.display=\'none\';pxalttitlelinks.classList.remove(\'active\');})();">H1-H6 '+((hErr)?'<span class="red">('+hd.length+')':'('+hd.length+')')+'</b>';
	openLinks += '</p>';

	var topBS = document.createElement("style");
	topBS.setAttribute("type", "text/css");
	topBS.innerHTML = ".pixelTopBlockWrp{position:relative;width:100%;top:0;left:0;background:#f8f8f8;z-index:999999;text-align:left;border-bottom:1px solid #9D9DA1;color:#000;font-family:arial;max-height:50%;overflow-y:auto;}.pixelTopBlockWrp .close {float:right;cursor:pointer;color:#000;font-size: 24px;line-height: 0;padding: 8px 0 0;}.topBlock{padding:5px 10px;font-size:14px;line-height: 16px;}.topBlock p{margin:0 0 0.3em 0 !important; padding:0px; line-height: 1.2em;font-size:14px;}.pxtblocklinks OL{margin:0px 15px;padding:0 0 0 40px;list-style:decimal;display:none;}.pxtblocklinks OL LI {color: #000;margin-bottom: 3px;display:block;font-size:14px;}.pxtblocklinks {width:70%;left:15%;position:relative;background:#fff;z-index:99999;box-shadow:0 3px 10px #000;font-size:14px;word-wrap: break-word;}.pxexternallinks, .pxinternallinks, .pxalttitlelinks, .pxh16links{margin:0px 15px;padding: 0 0 0 20px;list-style:decimal;display:none;height:500px;overflow:auto;} .pxh16links span:hover {cursor:pointer;border-bottom:1px solid;}.openLinksB{border-bottom:1px dashed #000;cursor:pointer;} .openLinksB:hover {border-bottom: none;} .pixelTopBlockWrp b, p{color:#000;}.pxtblocklinks a{color:#000;text-decoration:none;} .pxtblocklinks a:hover{border-bottom:1px solid;}.pixelTopBlockWrp b{font-weight:bold;}.topBlock .red, .pxtblocklinks .red {color:red;} .link_sim{text-decoration:underline;} .link_sim:hover{cursor:pointer; text-decoration:none;color:blue;} .topBlock a{color:black;}";
	document.getElementsByTagName("body")[0].appendChild(topBS);
	var topBlock = document.createElement("div");
	topBlock.className = 'pixelTopBlockWrp';
	topBlock.innerHTML = '<div class="topBlock"><b class="close" onclick="javascript:(function(){var pxtblock=document.querySelector(\'div.pxtagblock\');document.getElementsByTagName(\'body\')[0].removeChild(pxtblock);})();">\u00d7</b>'+alertStr+openLinks+'</div>';
	var first=document.getElementsByTagName('body')[0].childNodes[0];
	
	var linksData = document.createElement("div");
	linksData.className = 'pxtblocklinks';
	linksData.innerHTML = '<ol class="pxexternallinks">'+externalLinks+'</ol><ol class="pxinternallinks">'+internalLinks+'</ol><ol class="pxalttitlelinks">'+altTitle+'</ol><ol class="pxh16links" style="list-style:none;">'+h16Str+'<ol>';
	var block = document.createElement("div");
	block.style = 'position:fixed;z-index:9999999999999;width:100%;top:0px;left:0px;';
	block.className = 'pxtblock pxtagblock';
	block.appendChild(topBlock);
	block.appendChild(linksData);
	document.getElementsByTagName("body")[0].insertBefore(block,first);
}

<!---upload script in our site.com/js---!>
javascript:(function(){var s=document.createElement('script');s.type='text/javascript';s.src='https://www.site.com/js/meta.js';s.setAttribute('charset','utf-8');document.getElementsByTagName('body')[0].appendChild(s)})();void(0);