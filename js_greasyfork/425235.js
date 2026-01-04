// ==UserScript==
// @name         Thingiverse ad-free download
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Download Things without watching pesky ads!
// @author       Jabybaby
// @match        https://www.thingiverse.com/thing:*
// @icon         https://www.google.com/s2/favicons?domain=thingiverse.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425235/Thingiverse%20ad-free%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/425235/Thingiverse%20ad-free%20download.meta.js
// ==/UserScript==

(function() {
    var k = [...document.getElementsByTagName("a")].filter(el => el.className.includes("SidebarMenu__download"))[0];

    var f = setInterval(() => {
        if(k == null)
        {
                k = [...document.getElementsByTagName("a")].filter(el => el.className.includes("SidebarMenu__download"))[0];
        }
        else
        {
            k.innerHTML="";
            k.parentElement.innerHTML+=`<a href="${window.location.href}/zip"><div class="button button-primary"><div class="i-button left" style="background-image: url(&quot;data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTJweCIgaGVpZ2h0PSIxM3B4IiB2aWV3Qm94PSIwIDAgMTIgMTMiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDU4ICg4NDY2MykgLSBodHRwczovL3NrZXRjaC5jb20gLS0+CiAgICA8dGl0bGU+ZG93bmxvYWQgYnV0dG9uIGNvcHk8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2UtbGluZWNhcD0icm91bmQiPgogICAgICAgIDxnIGlkPSJ0aGluZy1wYWdlLXdpdGgtb3ZlcmxheSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTExNzAuMDAwMDAwLCAtODguMDAwMDAwKSIgc3Ryb2tlPSIjRkZGRkZGIj4KICAgICAgICAgICAgPGcgaWQ9ImRvd25sb2FkLWJ1dHRvbi1jb3B5IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMTcwLjAwMDAwMCwgODkuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8cG9seWxpbmUgaWQ9IlN0cm9rZS0xLUNvcHktOSIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgcG9pbnRzPSIxMiA1IDUuOTcxNzE4MDUgMTEgMCA1LjA1NzU5Mjc1Ij48L3BvbHlsaW5lPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTYsMCBMNiwxMCIgaWQ9IkxpbmUtMi1Db3B5LTUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDYuMDAwMDAwLCA1LjAwMDAwMCkgcm90YXRlKC0xODAuMDAwMDAwKSB0cmFuc2xhdGUoLTYuMDAwMDAwLCAtNS4wMDAwMDApICI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=&quot;); background-position: center center; background-repeat: no-repeat;"><span>Download without ads!</span></div></div></a>`;
            clearInterval(f)
        }
    }, 100)
})();