// ==UserScript==
// @name           DivineDaoLibrary by @trystan4861
// @name:es        DivineDaoLibrary by @trystan4861
// @namespace      http://tampermonkey.net/
// @version        1.0.5
// @description    Clear ads and more
// @description:es Elimina los anuncios y más
// @author         @trystan4861
// @match          https://www.divinedaolibrary.com/*
// @icon           https://icon.horse/icon/divinedaolibrary.com
// @grant          none
// @compatible     chrome
// @compatible     firefox
// @compatible     edge
// @license        MIT

// @downloadURL https://update.greasyfork.org/scripts/441768/DivineDaoLibrary%20by%20%40trystan4861.user.js
// @updateURL https://update.greasyfork.org/scripts/441768/DivineDaoLibrary%20by%20%40trystan4861.meta.js
// ==/UserScript==
/*jshint esversion: 6 */
const DOM=(selector,scope=document)=>scope.querySelectorAll(selector); //función para acceder a una lista de nodos específica del documnento
const _DOM=(selector,scope=document)=>DOM(selector,scope)[0]; //función para acceder a una lista de nodos específica del documnento
(function()
{
    'use strict';
    DOM("[class*='ezoic-'],#ez-cookie-dialog-wrapper").forEach(el=>{el.remove()});
    DOM("p").forEach(p=>{if (p.innerHTML=="&nbsp;") p.remove()});
    DOM("a:not([rel]):not(.next-special)").forEach(el=>{if (document.URL.includes(el.href.substr(0,el.href.length-1))) el.remove()});
    DOM("a[rel='prev'],a[rel='next'],a.next-special").forEach(el=>{el.style.marginLeft="20px"});
    DOM(`a[href^="https://www.patreon"], hr, nav, footer, #masthead, #comments, .entry-tags, iframe`).forEach(el=>el.remove());
    _DOM("body").style="padding-bottom: 0px !important;";
    var script_tag = document.createElement('script');
    script_tag.type = 'text/javascript';
    script_tag.text = `
    const  DOM=(selector,scope=document)=>scope.querySelectorAll(selector);
    const _DOM=(selector,scope=document)=>DOM(selector,scope)[0];;
    setTimeout(()=>DOM("#ez-cookie-dialog-wrapper").forEach(el=>{el.remove()}),1000);
    _DOM("body").onkeydown = function(e)
    {
    	e = e || window.event;
    	var keyCode = e.keyCode || e.which,
    	arrow = {left: 37, up: 38, right: 39, down: 40 };
    	if (e.ctrlKey)
    	{
    		switch (keyCode)
    		{
    			case arrow.right:
    				_DOM("[rel='next'],.next-special").click();
    			break;
    		//...
    		}
    	}
    };`;
    document.body.appendChild(script_tag);
})();