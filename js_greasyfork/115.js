// ==UserScript==
// @name	Tieba Quotor
// @namespace	http://gera2ld.blog.163.com/
// @author	Gerald <gera2ld@163.com>
// @icon	http://cn.gravatar.com/avatar/a0ad718d86d21262ccd6ff271ece08a3?s=80
// @version	1.5.1
// @description	贴吧引用
// @homepageURL	http://gerald.top/code/TiebaQuotor
// @include	http://tieba.baidu.com/*
// @exclude	http://tieba.baidu.com/tb/*
// @require	https://greasyfork.org/scripts/144/code.user.js
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/115/Tieba%20Quotor.user.js
// @updateURL https://update.greasyfork.org/scripts/115/Tieba%20Quotor.meta.js
// ==/UserScript==

function quote(e) {
	e.preventDefault();
	e.stopPropagation();	// otherwise utils.unminify may fail
	var o=e.target,m=$(o).parent().hasClass('p_mtail'),p=$(o).parents('.l_post'),l=m?p:$(o).parents('.lzl_single_post'),
		info=p.data('field'),u=m?info.author.user_name:l.data('field').user_name;
	p=[];
	o=l.find(m?'div.d_post_content':'span.lzl_content_main').contents(':not(blockquote)').each(function(i,e){p.push(e);});
	while(p.length)	// 去掉开头空行
		if(p[0].tagName=='BR'||!/\S/.test(p[0])) p.shift(); else break;
	for(l=p.length-1,o=[];l>=0&&p.length;l--) {	// 屏蔽尾巴，去掉末尾空行
		if(p[l].tagName=='BR') {
			if(/^\s*($|——|>>)/.test(o.join(''))) {p.splice(l);o.splice(0);}
			else break;
		} else o.unshift(p[l].innerText||p[l].textContent||p[l].data);	// return undefined for IMG
	}
	o=[];p.forEach(function(i){o.push(i.outerHTML||i.data||'');});
	o=o.join('')
		.replace(/^\s+|\s+$/gi,'')	// 去掉开头和末尾的空白
		.replace(/\s?<a [^>]*>@(.*?)<\/a>\s?/gi,' $1 ')	// 屏蔽点名
		.replace(/<a [^>]*?href="(.*?)"[^>]*>(.*?)<\/a>/,function(v,g1,g2){	// 保留蓝字，屏蔽链接
			return g1==g2?g2:'<font color="#261cdc">'+g2+'</font>';
		});
	o='引用 @'+u+' ('+info.content.post_no+'楼'+(m?'':'之楼中楼')+')<br>'+o+'<br>————————————————————————————————<br><br>';
	if(e=utils.unminify) e();
	unsafeWindow.test_editor.execCommand('inserthtml',o);
}
function initLinks(o){
	var p;
	if(o.hasClass('core_reply_tail')) {	// 主楼层
		var e=o.find('.p_tail').children().children();
		if(e.length&&e[0].innerHTML!='沙发') {
			p=e.parents('.l_post').data('field').content.post_id;
			e[1].outerHTML='<a href="/p/'+PageData.thread.thread_id+'?pid='+p+'#'+p+'" title="精确定位链接">'+e[1].innerHTML+'</a>';
		}
		if(can_quote) {
			$('<a href=#>引用</a>').css({'float':'right','margin-left':'5px'}).appendTo(o.find('.p_mtail')).click(quote);
		}
	} else if(o.hasClass('core_reply_wrapper')	// 楼中楼
						||o.hasClass('lzl_single_post')) {	// 楼中楼翻页
		p=o.find('span.lzl_time').html(function(i,h) {
			var o=$(this).parents('.lzl_single_post').data('field'),
					i=$(this).parents('.l_post').data('field').content.post_id;
			if(typeof o=='string') o=JSON.parse(o.replace(/'/g,'"'));
			return '<a href="/p/'+PageData.thread.thread_id+'?pid='+i+'&cid='+o.spid+'#'+o.spid+'" title="精确定位链接">'+h+'</a>';
		});
		if(can_quote) {
			$('<a href=#>引用</a>').css('margin-right','10px').insertBefore(p).click(quote);
		}
	}
}
function initQuotationFormat() {
	// 修改引用文字格式
	utils.addStyle('\
fieldset.d_quote{border:1px solid silver;padding:.5em;}\
fieldset.d_quote .BDE_Image{height:auto !important; width:auto !important; max-height:200px; max-width:560px !important;}\
');
	$('div.d_post_content').each(function(i,e) {
		var c=-1,n=$(e).contents(),j,f;
		for(j=0;j<n.length;j++) {
			f=n[j];
			if(c>=0&&f.nodeName=='#text'&&/^\s*—{27,36}\s*$/.test(f.data)) {
				n.slice(c,c+3).wrapAll('<legend>').parent().add(
					n.slice(c+4,j).wrapAll('<p class=quote_content>').parent()
				).wrapAll('<fieldset class=d_quote>');
				$(f).add(n[c+3]).remove();
				if((f=n[j+1])&&f.nodeName=='BR') {$(f).remove();j++;}
				c=-1;
			} else if(f.nodeName=='#text'&&/^\s*引用(\s|&nbsp;?)+$/.test(f.data)
				&&n[j+1]&&n[j+1].nodeName=='A'&&n[j+1].innerHTML[0]=='@'
				&&n[j+2]&&n[j+2].nodeName=='#text'&&/^\s+\(.*?楼\)$/.test(n[j+2].data)
				&&n[j+3].nodeName=='BR') {
				c=j;j+=3;
			}
		}
	});
}

if(PageData&&PageData.user&&PageData.thread) {
	initQuotationFormat();		// 引用格式
	var lzl_update=[],
	can_quote=PageData.user.is_login&&unsafeWindow.PosterContext&&unsafeWindow.PosterContext.isPostAllowed(),
	mo=new MutationObserver(function(changes){
		$.each(changes,function(i,e){
			$.each(e.addedNodes,function(i,o){initLinks($(o));});
		});
	});
	mo.observe($('#j_p_postlist')[0],{
		childList:true,
		subtree:true,
	});
}
