// ==UserScript==
// @name         homoer enhancement
// @version      1.0
// @match        http*://*.homoer.com/*
// @description  made by SC
// @license      MIT
// @namespace    https://greasyfork.org/users/1010601
// @downloadURL https://update.greasyfork.org/scripts/504066/homoer%20enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/504066/homoer%20enhancement.meta.js
// ==/UserScript==
async function parse(url){
	const html=await (await fetch(url)).text(),key1='class="guest_box"';
	return html.substring(html.indexOf(key1)+key1.length,html.lastIndexOf('adsbygoogle.js'))
		.split(key1).filter(p=>!p.match(/這邊有一段限制閱讀文字|已經過期，無法閱讀/)).map((p,r)=>(
	r=[...p.matchAll(/(?:reply_by">|guest_time">|ip_flag' )(.+?)<\/span>/g)].map(m=>m[1]),
		r[3]=p.substring(...[...p.matchAll(/<div class="HTML_info"/g)].map(m=>m.index))
			.replaceAll(/<[^>]+>|[\t\r ]+/g,'').slice(1,-1).replaceAll(/\s*\n+\s*/g,'<br/>'),r));
}

function addRows(ol,page,rows){
    if(rows.length)rows.forEach(([name,time,ip,msg],i)=>ol.append(i>0||1==page?ip?
    `<li>${msg}<a class="guest_option_top">${name} (<img class='ip_flag' ${ip} ${time}</a></li>`:
    `<li>${msg}<a class="guest_option_top">${name}${time}</a></li>`:`<hr/>page #${page}`));
}

function createRoot(title){
    const ol=$(`<ol class="footer" style="padding:revert;background:black;color:white;font:12pt monospaced">${title}</ol>`);
	$('.footer').parent().empty().append(ol);
    return ol;
}

async function viewAll(tr){
	const {href,textContent:title}=tr.querySelector('a:first-child'),{textContent:pages}=tr.querySelector('a:last-child');
	const ol=createRoot(title.trim()),url=href.substring(0,href.lastIndexOf('=')+1);
	for(let i=1,n=~~pages||1;i<=n;i++)addRows(ol,i,await parse(url+i));
}

async function viewMore(href,param){
    const ol=createRoot(''),url=href.substring(0,href.lastIndexOf('=')+1),pages=~~param.get('p'),end=Math.max(pages-30,1);
    for(let page=pages;page>end;page--)addRows(ol,page,await parse(url+page));
    ol.append(`<hr/><a href="${url}${end}" style="color:pink">page #${end} &gt;</a>`);
}

let dom;
if((dom=document.querySelectorAll('#article_list tr:not(:first-child)')).length)
    for(const tr of dom)tr.addEventListener('click',e=>viewAll(tr));
else if((dom=document.querySelectorAll('#page_block .page_nr')).length)
    viewMore(location.href,new URLSearchParams(location.search));//{href,textContent}=dom[dom.length-1]