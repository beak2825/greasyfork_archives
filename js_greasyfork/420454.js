// ==UserScript==
// @name         Wikipedia Math-Editor Dialog
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A Simple Latex Editor Dialog!
// @author       KnIfER
// @match        https://en.wikipedia.org/*
// @match        https://en.jinzhao.wiki/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420454/Wikipedia%20Math-Editor%20Dialog.user.js
// @updateURL https://update.greasyfork.org/scripts/420454/Wikipedia%20Math-Editor%20Dialog.meta.js
// ==/UserScript==

(function() {
    'use strict';

function gid(id){
	return document.getElementById(id);
}

// formatted to one line by https://www.sojson.com/jshtml.html
// normal multiline version is here https://github.com/KnIfER/Extesions/blob/master/WikiKatexEditor/katexEss.html
var pageData = '<meta charset="UTF-8"><style>.KaDlg_Info.KaDlg_MousePost{}.KaDlg_Info.KaDlg_MousePost{}.KaDlg_Info.KaDlg_MousePost{outline:none}.KaDlg_Info{position:fixed;left:50%;width:auto;text-align:center;border:3px outset;padding:1em 2em;background-color:#DDDDDD;color:black;cursor:default;font-family:message-box;font-size:120%;font-style:normal;text-indent:0;text-transform:none;line-height:normal;letter-spacing:normal;word-spacing:normal;word-wrap:normal;white-space:nowrap;float:none;z-index:201;border-radius:15px;-webkit-border-radius:15px;-moz-border-radius:15px;-khtml-border-radius:15px;box-shadow:0px 10px 20px#808080;-webkit-box-shadow:0px 10px 20px#808080;-moz-box-shadow:0px 10px 20px#808080;-khtml-box-shadow:0px 10px 20px#808080;filter:progid:DXImageTransform.Microsoft.dropshadow(OffX=2,OffY=2,Color="gray",Positive="true")}*{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}.KaDlg_MenuFrame{font-family:sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:14px;line-height:1.42857143}.KaDlg_InfoContent{overflow:auto;text-align:left;font-size:80%;padding:.4em.6em;border:1px inset;margin:1em 0px;max-height:20em;max-width:30em;background-color:#EEEEEE;white-space:normal}.KaDlg_MenuClose{position:absolute;cursor:pointer;display:inline-block;border:2px solid#AAA;border-radius:18px;-webkit-border-radius:18px;-moz-border-radius:18px;-khtml-border-radius:18px;font-family:"Courier New",Courier;font-size:24px;color:#F0F0F0}.KaDlg_InfoClose{top:.2em;right:.2em}.KaDlg_MenuClose span{display:block;background-color:#AAA;border:1.5px solid;border-radius:18px;-webkit-border-radius:18px;-moz-border-radius:18px;-khtml-border-radius:18px;line-height:0;padding:8px 0 6px}.KaDlg_InfoContent pre{font-size:125%;margin:0;outline:none;background-color:transparent!important;padding:0!important}</style><div id="KaDlgM"class="KaDlg_MenuFrame"style="position: absolute; left: 0px; top: 0px; z-index: 200; width: 100%; height: 100%; border: 0px; padding: 0px; margin: 0px;"><div onclick="KaDlg.f()"style="position: fixed; left: 0px; top: 0px; z-index: 200; width: 100%; height: 100%; border: 0px; padding: 0px; margin: 0px;"></div><div class="KaDlg_Info KaDlg_MousePost"role="dialog"tabindex="0"style="margin-left: -239px; top: 146px;"><span class="KaDlg_InfoTitle">KaTex Editor</span><div class="KaDlg_InfoContent"tabindex="0"><pre id="et"contenteditable=true spellcheck=false></pre></div><div class="KaDlg_InfoContent"id="tex"tabindex="0"></div><span class="KaDlg_InfoSignature"><input type="button"value="Copy to Clipboard"></span><span onclick="KaDlg.f1()"class="KaDlg_MenuClose KaDlg_InfoClose"role="button"tabindex="0"aria-label="Close Dialog Box"><span>×</span></span></div></div><script id="KaTexDlg">function f1(vis){var m=gid("KaDlgM");m.style.display="none"}function f(vis){var m=gid("KaDlgM");if(vis){m.style.display="block"}else{var ev=window.event||arguments.callee.caller.arguments[0];m.style.display="none"}}function loadScript(url,callback){var item=document.createElement("script");item.type="text/javascript";item.onload=callback;item.src=url;document.head.appendChild(item)}function loadCss(url){var item=document.createElement("link");item.rel="stylesheet";item.type="text/css";item.href=url;document.head.appendChild(item)}window.initKaDlg=function(e){var et=document.getElementById("et");if(!et.upd){if(!window.KaDlg){loadCss("https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css");loadScript("https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.js",function(){initKaDlg(e)});window.KaDlg={f1:f1,f:f};console.log("全力加载中……");return}var el=document.getElementById("tex");function upd(){katex.render(et.innerText,el,{throwOnError:false})}et.addEventListener("input",function(){upd()});et.upd=upd}f(true);et.innerText=e;et.upd()}</script>';


window.addEventListener("click",function(e){
	if(e.target.tagName==="IMG") {
		if(e.target.className.indexOf("math")>=0){ // only do this to math pictures
            var lt = e.target.alt;
			if(!window.initKaDlg){
                document.body.innerHTML+=pageData;
                eval(gid("KaTexDlg").innerText)
                initKaDlg(lt);
				console.log('sending...');
			} else {
				initKaDlg(lt);
			}
		}
	}
});
})();