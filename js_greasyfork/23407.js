// ==UserScript==
// @name				LINE Sticker Downloader
// @version				1.01
// @author				XFox Prower
// @namespace			http://www.TailsArchive.net
// @description			Creates a button to download stickers from the LINE Store
// @include				https://store.line.me/stickershop/product/*
// @downloadURL https://update.greasyfork.org/scripts/23407/LINE%20Sticker%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/23407/LINE%20Sticker%20Downloader.meta.js
// ==/UserScript==

'use strict';

const
	D=document,
	Cont=D.getElementsByClassName('mdCMN08Ul').item(0);
var
	li,
	Btn;

if(Cont)
	{
	li=D.createElement('li');
	li.className='mdCMN08Li';
	Btn=D.createElement('input');
	Btn.type='button';
	Btn.value='Download';
	Btn.style.cssText='display:table-cell;min-width:170px;vertical-align:middle;height:44px;background-color:#00ace0;color:#fff';
	Btn.onclick=function()
		{
		const
			Col=D.getElementsByClassName('mdCMN09Ul').item(0).getElementsByTagName('span'),
			Len=Col.length;
		var
			i,
			bg,
			str='<!DOCTYPE html><html><head><meta charset="utf-8" /><title>'+D.title.replace(' - Creators\' Stickers','')+'</title></head><body><div>';

		for(i=0;i<Len;i++)
			{
			bg=Col.item(i).style.backgroundImage;
			bg=bg.substring(5,bg.length-2);
			str+='<img src="'+bg+'" alt="" /> ';
			}
		str+='</div></body></html>';
		open('data:text/html,'+encodeURI(str));
		};
	li.appendChild(Btn);
	Cont.insertBefore(li,Cont.getElementsByClassName('mdCMN08Li').item(2));
	}