// ==UserScript==
// @name        Better Thingiverse zip download
// @namespace   Dinggo67
// @description Restores zip file download button on Thingiverse
// @icon        https://cdn.thingiverse.com/site/img/favicons/favicon-32x32.png
// @version     0.1.2
// @license     GNU General Public License v3
// @copyright   2022, Dinggo
// @author      Dinggo
// @grant       none
// @match    https://www.thingiverse.com/thing:*
// @downloadURL https://update.greasyfork.org/scripts/443555/Better%20Thingiverse%20zip%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/443555/Better%20Thingiverse%20zip%20download.meta.js
// ==/UserScript==
/* ORIGINAL CODE WAS FROM https://greasyfork.org/en/scripts/440679-thingiverse-zip-download, donate to original author if you want */

var no = location.pathname.match( /[0-9]+/ );
var zip = "/thing:" + no + "/zip";

var elm = document.createElement("div");
elm.innerHTML = '<div><a href='+zip+' class="SidebarMenu__download--3Vqb7"><div class="button button-primary"><div style="background-image: url(&quot;data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTJweCIgaGVpZ2h0PSIxM3B4IiB2aWV3Qm94PSIwIDAgMTIgMTMiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDU4ICg4NDY2MykgLSBodHRwczovL3NrZXRjaC5jb20gLS0+CiAgICA8dGl0bGU+ZG93bmxvYWQgYnV0dG9uIGNvcHk8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2UtbGluZWNhcD0icm91bmQiPgogICAgICAgIDxnIGlkPSJ0aGluZy1wYWdlLXdpdGgtb3ZlcmxheSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTExNzAuMDAwMDAwLCAtODguMDAwMDAwKSIgc3Ryb2tlPSIjRkZGRkZGIj4KICAgICAgICAgICAgPGcgaWQ9ImRvd25sb2FkLWJ1dHRvbi1jb3B5IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMTcwLjAwMDAwMCwgODkuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8cG9seWxpbmUgaWQ9IlN0cm9rZS0xLUNvcHktOSIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgcG9pbnRzPSIxMiA1IDUuOTcxNzE4MDUgMTEgMCA1LjA1NzU5Mjc1Ij48L3BvbHlsaW5lPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTYsMCBMNiwxMCIgaWQ9IkxpbmUtMi1Db3B5LTUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDYuMDAwMDAwLCA1LjAwMDAwMCkgcm90YXRlKC0xODAuMDAwMDAwKSB0cmFuc2xhdGUoLTYuMDAwMDAwLCAtNS4wMDAwMDApICI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=&quot;); background-position: center center; background-repeat: no-repeat;" class="i-button left"><span>Download The Zip</span></div></div></a></div>';
elm.title = "Zip file download";
elm.setAttribute("class", "SidebarMenu__sideMenuTop--3xCYh");

var sidebar = document.getElementsByClassName("SidebarMenu__sidebarMenu--3uBjd");
sidebar[0].appendChild( elm );

