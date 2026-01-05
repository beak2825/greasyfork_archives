// ==UserScript==
// @name			Amazon Autopager
// @version			1.03
// @author			XFox Prower
// @namespace		http://www.TailsArchive.net/
// @description		Loads next page of search results automatically on Amazon
// @include			https://www.amazon.com/s/*
// @include			https://smile.amazon.com/s/*
// @include			https://www.amazon.co.uk/s/*
// @include			https://www.amazon.co.jp/s/*
// @grant			none
// @downloadURL https://update.greasyfork.org/scripts/23471/Amazon%20Autopager.user.js
// @updateURL https://update.greasyfork.org/scripts/23471/Amazon%20Autopager.meta.js
// ==/UserScript==

'use strict';

function fscroll()
	{
	var	next=D.getElementById('pagnNextLink'),
		cont,
		pager,
		req;

	if(!next||lock){return;}
	if(next.getBoundingClientRect().bottom<innerHeight>>1)
		{
		lock=1;
		cont=D.getElementById('s-results-list-atf');
		pager=D.getElementById('pagn');
		req=new XMLHttpRequest();
		req.open('GET',next.href);
		req.responseType='document';
		req.onload=function()
			{
			var	res=req.response,
				frag=D.createDocumentFragment(),
				col=res.querySelectorAll('li[id^=result_]'),
				len=col.length,
				i;

			for(i=0;i<len;i++)
				{
				frag.appendChild(col.item(i));
				}
			cont.appendChild(frag);
			pager.parentNode.replaceChild(res.getElementById('pagn'),pager);
			lock=0;
			};
		req.send();
		}
	}

var	D=document,
	lock=0;

addEventListener('scroll',fscroll);