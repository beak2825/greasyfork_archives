// ==UserScript==
// @name         fix T download all
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      GPL
// @description  Add new download all
// @author       EnderCaster
// @match        https://www.thingiverse.com/thing:*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=thingiverse.com
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444328/fix%20T%20download%20all.user.js
// @updateURL https://update.greasyfork.org/scripts/444328/fix%20T%20download%20all.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let download_area=null;
    let interval_handle=0;
    let base_url = location.href.match(/https:\/\/www.thingiverse.com\/thing:\d*\/*$/)[0];
    interval_handle=setInterval(function(){
		download_area=$("div[class^='SidebarMenu__sideMenuTop--'");
		if(download_area&&download_area.length>0){
			clearInterval(interval_handle);
			let download_wrapper=download_area.children()[0];
			download_wrapper.appendChild(document.createElement("hr"));
			let real_download=document.createElement("a");
			real_download.className="SidebarMenu__download--EC";
			real_download.target="_blank";
			real_download.href=base_url+"/zip";

			let button_wrapper=document.createElement("div");
			button_wrapper.className="button button-primary";

			let button_div=document.createElement("div");
			button_div.className="i-button left";
			button_div.style="background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTJweCIgaGVpZ2h0PSIxM3B4IiB2aWV3Qm94PSIwIDAgMTIgMTMiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDU4ICg4NDY2MykgLSBodHRwczovL3NrZXRjaC5jb20gLS0+CiAgICA8dGl0bGU+ZG93bmxvYWQgYnV0dG9uIGNvcHk8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2UtbGluZWNhcD0icm91bmQiPgogICAgICAgIDxnIGlkPSJ0aGluZy1wYWdlLXdpdGgtb3ZlcmxheSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTExNzAuMDAwMDAwLCAtODguMDAwMDAwKSIgc3Ryb2tlPSIjRkZGRkZGIj4KICAgICAgICAgICAgPGcgaWQ9ImRvd25sb2FkLWJ1dHRvbi1jb3B5IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMTcwLjAwMDAwMCwgODkuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8cG9seWxpbmUgaWQ9IlN0cm9rZS0xLUNvcHktOSIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgcG9pbnRzPSIxMiA1IDUuOTcxNzE4MDUgMTEgMCA1LjA1NzU5Mjc1Ij48L3BvbHlsaW5lPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTYsMCBMNiwxMCIgaWQ9IkxpbmUtMi1Db3B5LTUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDYuMDAwMDAwLCA1LjAwMDAwMCkgcm90YXRlKC0xODAuMDAwMDAwKSB0cmFuc2xhdGUoLTYuMDAwMDAwLCAtNS4wMDAwMDApICI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4='); background-position: center center; background-repeat: no-repeat;";

			let button_text=document.createElement("span");
			button_text.innerText="Real Download All";

			button_div.appendChild(button_text);
			button_wrapper.appendChild(button_div);
			real_download.appendChild(button_wrapper);

			download_wrapper.appendChild(real_download);
		}
    },200);
})();