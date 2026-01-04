// ==UserScript==
// @name        BJTU 统一身份验证界面简化（仿微软）
// @namespace   bjtucasBeautify
// @match       *://cas.bjtu.edu.cn/auth/login/*
// @grant       none
// @version     1.0
// @author      harutopia
// @description 统一身份认证界面看腻了，自学了点页面样式和js，扣出来了下面屎一样的代码，大佬轻喷，随缘更新。
// @run-at      document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/445955/BJTU%20%E7%BB%9F%E4%B8%80%E8%BA%AB%E4%BB%BD%E9%AA%8C%E8%AF%81%E7%95%8C%E9%9D%A2%E7%AE%80%E5%8C%96%EF%BC%88%E4%BB%BF%E5%BE%AE%E8%BD%AF%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/445955/BJTU%20%E7%BB%9F%E4%B8%80%E8%BA%AB%E4%BB%BD%E9%AA%8C%E8%AF%81%E7%95%8C%E9%9D%A2%E7%AE%80%E5%8C%96%EF%BC%88%E4%BB%BF%E5%BE%AE%E8%BD%AF%EF%BC%89.meta.js
// ==/UserScript==

var lp=document.getElementsByClassName('contentLf')[0];
lp.remove();
var lp=document.getElementsByClassName('footer_wrap')[0];
lp.remove();
var lp=document.getElementsByClassName('mode02')[0];
lp.remove();
var lp=document.getElementsByClassName('header')[0];
lp.remove();
var btt=document.getElementsByTagName("button")[0];
btt.removeAttribute("class");
var lp=document.getElementsByTagName("span")[0];
lp.remove();
var lp=document.getElementsByTagName("span")[0];
lp.remove();
lw=document.getElementsByClassName('contentRt')[0]
lw.style.margin="auto"
lw.style.display="block"
lw.style.float="none"

var qrc=document.getElementsByTagName("img")[0]
qrc.src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCiA8ZyBpZD0iTGF5ZXJfMSI+DQogIDx0aXRsZT5MYXllciAxPC90aXRsZT4NCiAgPHJlY3QgaWQ9InN2Z18xIiBoZWlnaHQ9IjYwIiB3aWR0aD0iNjAiIHk9IjAiIHg9IjAiIHN0cm9rZT0iIzAwMCIgZmlsbD0iIzAwMDAwMCIgcng9IjUiLz4NCiAgPHJlY3Qgcng9IjUiIGlkPSJzdmdfMiIgaGVpZ2h0PSI2MCIgd2lkdGg9IjYwIiB5PSIwIiB4PSI4MCIgc3Ryb2tlPSIjMDAwIiBmaWxsPSIjMDAwMDAwIi8+DQogIDxyZWN0IHJ4PSI1IiBpZD0ic3ZnXzMiIGhlaWdodD0iNjAiIHdpZHRoPSI2MCIgeT0iODAiIHg9IjAiIHN0cm9rZT0iIzAwMCIgZmlsbD0iIzAwMDAwMCIvPg0KICA8cmVjdCBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZT0iIzAwMCIgaWQ9InN2Z180IiBoZWlnaHQ9IjQwIiB3aWR0aD0iNDAiIHk9IjEwIiB4PSIxMCIgZmlsbD0iI2ZmZmZmZiIvPg0KICA8cmVjdCBzdHJva2Utd2lkdGg9IjAiIGlkPSJzdmdfNSIgaGVpZ2h0PSIyMCIgd2lkdGg9IjIwIiB5PSIyMCIgeD0iMjAiIHN0cm9rZT0iIzAwMCIgZmlsbD0iIzAwMDAwMCIgcng9IjIiLz4NCiAgPHJlY3Qgc3Ryb2tlLXdpZHRoPSIwIiBzdHJva2U9IiMwMDAiIGlkPSJzdmdfNiIgaGVpZ2h0PSI0MCIgd2lkdGg9IjQwIiB5PSIxMCIgeD0iOTAiIGZpbGw9IiNmZmZmZmYiLz4NCiAgPHJlY3Qgc3Ryb2tlLXdpZHRoPSIwIiBzdHJva2U9IiMwMDAiIGlkPSJzdmdfNyIgaGVpZ2h0PSI0MCIgd2lkdGg9IjQwIiB5PSI4OS42MTUxNyIgeD0iMTAiIGZpbGw9IiNmZmZmZmYiLz4NCiAgPHJlY3Qgcng9IjMiIHN0cm9rZS13aWR0aD0iMCIgaWQ9InN2Z184IiBoZWlnaHQ9IjIwIiB3aWR0aD0iMjAiIHk9IjE5LjYwNzg0IiB4PSI5OS42MTUxNyIgc3Ryb2tlPSIjMDAwIiBmaWxsPSIjMDAwMDAwIi8+DQogIDxyZWN0IHJ4PSIzIiBzdHJva2Utd2lkdGg9IjAiIGlkPSJzdmdfOSIgaGVpZ2h0PSIyMCIgd2lkdGg9IjIwIiB5PSI5OS42MTUxNyIgeD0iMTkuNjE1MzkiIHN0cm9rZT0iIzAwMCIgZmlsbD0iIzAwMDAwMCIvPg0KICA8cmVjdCBzdHJva2Utd2lkdGg9IjAiIGlkPSJzdmdfMTEiIGhlaWdodD0iMTAiIHdpZHRoPSIxMCIgeT0iODAiIHg9IjgwIiBzdHJva2U9IiMwMDAiIGZpbGw9IiMwMDAwMDAiLz4NCiAgPHJlY3Qgc3Ryb2tlLXdpZHRoPSIwIiBpZD0ic3ZnXzEyIiBoZWlnaHQ9IjEwIiB3aWR0aD0iMTAiIHk9IjgwIiB4PSI5MCIgc3Ryb2tlPSIjMDAwIiBmaWxsPSIjMDAwMDAwIi8+DQogIDxyZWN0IHN0cm9rZS13aWR0aD0iMCIgaWQ9InN2Z18xMyIgaGVpZ2h0PSIxMCIgd2lkdGg9IjEwIiB5PSI5MCIgeD0iODAiIHN0cm9rZT0iIzAwMCIgZmlsbD0iIzAwMDAwMCIvPg0KICA8cmVjdCBzdHJva2Utd2lkdGg9IjAiIGlkPSJzdmdfMTQiIGhlaWdodD0iMTAiIHdpZHRoPSIxMCIgeT0iMTEwIiB4PSI4MCIgc3Ryb2tlPSIjMDAwIiBmaWxsPSIjMDAwMDAwIi8+DQogIDxyZWN0IHN0cm9rZS13aWR0aD0iMCIgaWQ9InN2Z18xNSIgaGVpZ2h0PSIxMCIgd2lkdGg9IjEwIiB5PSIxMzAiIHg9IjgwIiBzdHJva2U9IiMwMDAiIGZpbGw9IiMwMDAwMDAiLz4NCiAgPHJlY3Qgc3Ryb2tlLXdpZHRoPSIwIiBpZD0ic3ZnXzE2IiBoZWlnaHQ9IjEwIiB3aWR0aD0iMTAiIHk9IjEzMCIgeD0iOTAiIHN0cm9rZT0iIzAwMCIgZmlsbD0iIzAwMDAwMCIvPg0KICA8cmVjdCBzdHJva2Utd2lkdGg9IjAiIGlkPSJzdmdfMTciIGhlaWdodD0iMTAiIHdpZHRoPSIxMCIgeT0iMTIwIiB4PSI5MCIgc3Ryb2tlPSIjMDAwIiBmaWxsPSIjMDAwMDAwIi8+DQogIDxyZWN0IHN0cm9rZS13aWR0aD0iMCIgaWQ9InN2Z18xOCIgaGVpZ2h0PSIxMCIgd2lkdGg9IjEwIiB5PSIxMjAiIHg9IjEwMCIgc3Ryb2tlPSIjMDAwIiBmaWxsPSIjMDAwMDAwIi8+DQogIDxyZWN0IHN0cm9rZS13aWR0aD0iMCIgaWQ9InN2Z18xOSIgaGVpZ2h0PSIxMCIgd2lkdGg9IjEwIiB5PSIxMzAiIHg9IjExMCIgc3Ryb2tlPSIjMDAwIiBmaWxsPSIjMDAwMDAwIi8+DQogIDxyZWN0IHN0cm9rZS13aWR0aD0iMCIgaWQ9InN2Z18yMCIgaGVpZ2h0PSIxMCIgd2lkdGg9IjEwIiB5PSIxMzAiIHg9IjEyMCIgc3Ryb2tlPSIjMDAwIiBmaWxsPSIjMDAwMDAwIi8+DQogIDxyZWN0IHN0cm9rZS13aWR0aD0iMCIgaWQ9InN2Z18yMSIgaGVpZ2h0PSIxMCIgd2lkdGg9IjEwIiB5PSIxMjAiIHg9IjEzMCIgc3Ryb2tlPSIjMDAwIiBmaWxsPSIjMDAwMDAwIi8+DQogIDxyZWN0IHN0cm9rZS13aWR0aD0iMCIgaWQ9InN2Z18yMiIgaGVpZ2h0PSIxMCIgd2lkdGg9IjEwIiB5PSIxMTAiIHg9IjEzMCIgc3Ryb2tlPSIjMDAwIiBmaWxsPSIjMDAwMDAwIi8+DQogIDxyZWN0IHN0cm9rZS13aWR0aD0iMCIgaWQ9InN2Z18yMyIgaGVpZ2h0PSIxMCIgd2lkdGg9IjEwIiB5PSIxMTAiIHg9IjExMCIgc3Ryb2tlPSIjMDAwIiBmaWxsPSIjMDAwMDAwIi8+DQogIDxyZWN0IHN0cm9rZS13aWR0aD0iMCIgaWQ9InN2Z18yNCIgaGVpZ2h0PSIxMCIgd2lkdGg9IjEwIiB5PSIxMDAiIHg9IjEwMCIgc3Ryb2tlPSIjMDAwIiBmaWxsPSIjMDAwMDAwIi8+DQogIDxyZWN0IHN0cm9rZS13aWR0aD0iMCIgaWQ9InN2Z18yNSIgaGVpZ2h0PSIxMCIgd2lkdGg9IjEwIiB5PSI5MCIgeD0iMTAwIiBzdHJva2U9IiMwMDAiIGZpbGw9IiMwMDAwMDAiLz4NCiAgPHJlY3Qgc3Ryb2tlLXdpZHRoPSIwIiBpZD0ic3ZnXzI2IiBoZWlnaHQ9IjEwIiB3aWR0aD0iMTAiIHk9IjEwMCIgeD0iOTAiIHN0cm9rZT0iIzAwMCIgZmlsbD0iIzAwMDAwMCIvPg0KICA8cmVjdCBzdHJva2Utd2lkdGg9IjAiIGlkPSJzdmdfMjciIGhlaWdodD0iMTAiIHdpZHRoPSIxMCIgeT0iODAiIHg9IjExMCIgc3Ryb2tlPSIjMDAwIiBmaWxsPSIjMDAwMDAwIi8+DQogIDxyZWN0IHN0cm9rZS13aWR0aD0iMCIgaWQ9InN2Z18yOCIgaGVpZ2h0PSIxMCIgd2lkdGg9IjEwIiB5PSI4MCIgeD0iMTMwIiBzdHJva2U9IiMwMDAiIGZpbGw9IiMwMDAwMDAiLz4NCiAgPHJlY3Qgc3Ryb2tlLXdpZHRoPSIwIiBpZD0ic3ZnXzI5IiBoZWlnaHQ9IjEwIiB3aWR0aD0iMTAiIHk9IjkwIiB4PSIxMzAiIHN0cm9rZT0iIzAwMCIgZmlsbD0iIzAwMDAwMCIvPg0KICA8cmVjdCBzdHJva2Utd2lkdGg9IjAiIGlkPSJzdmdfMzAiIGhlaWdodD0iMTAiIHdpZHRoPSIxMCIgeT0iOTAiIHg9IjEyMCIgc3Ryb2tlPSIjMDAwIiBmaWxsPSIjMDAwMDAwIi8+DQogIDxyZWN0IHN0cm9rZS13aWR0aD0iMCIgaWQ9InN2Z18zMSIgaGVpZ2h0PSIxMCIgd2lkdGg9IjEwIiB5PSIxMDAiIHg9IjEyMCIgc3Ryb2tlPSIjMDAwIiBmaWxsPSIjMDAwMDAwIi8+DQogPC9nPg0KDQo8L3N2Zz4";
qrc.height=35;
var qrc=document.getElementsByTagName("img")[1]
qrc.src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCiA8ZyBpZD0iTGF5ZXJfMSI+DQogIDx0aXRsZT5MYXllciAxPC90aXRsZT4NCiAgPHJlY3QgaWQ9InN2Z18xIiBoZWlnaHQ9IjYwIiB3aWR0aD0iNjAiIHk9IjAiIHg9IjAiIHN0cm9rZT0iIzAwMCIgZmlsbD0iIzAwMDAwMCIgcng9IjUiLz4NCiAgPHJlY3Qgcng9IjUiIGlkPSJzdmdfMiIgaGVpZ2h0PSI2MCIgd2lkdGg9IjYwIiB5PSIwIiB4PSI4MCIgc3Ryb2tlPSIjMDAwIiBmaWxsPSIjMDAwMDAwIi8+DQogIDxyZWN0IHJ4PSI1IiBpZD0ic3ZnXzMiIGhlaWdodD0iNjAiIHdpZHRoPSI2MCIgeT0iODAiIHg9IjAiIHN0cm9rZT0iIzAwMCIgZmlsbD0iIzAwMDAwMCIvPg0KICA8cmVjdCBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZT0iIzAwMCIgaWQ9InN2Z180IiBoZWlnaHQ9IjQwIiB3aWR0aD0iNDAiIHk9IjEwIiB4PSIxMCIgZmlsbD0iI2ZmZmZmZiIvPg0KICA8cmVjdCBzdHJva2Utd2lkdGg9IjAiIGlkPSJzdmdfNSIgaGVpZ2h0PSIyMCIgd2lkdGg9IjIwIiB5PSIyMCIgeD0iMjAiIHN0cm9rZT0iIzAwMCIgZmlsbD0iIzAwMDAwMCIgcng9IjIiLz4NCiAgPHJlY3Qgc3Ryb2tlLXdpZHRoPSIwIiBzdHJva2U9IiMwMDAiIGlkPSJzdmdfNiIgaGVpZ2h0PSI0MCIgd2lkdGg9IjQwIiB5PSIxMCIgeD0iOTAiIGZpbGw9IiNmZmZmZmYiLz4NCiAgPHJlY3Qgc3Ryb2tlLXdpZHRoPSIwIiBzdHJva2U9IiMwMDAiIGlkPSJzdmdfNyIgaGVpZ2h0PSI0MCIgd2lkdGg9IjQwIiB5PSI4OS42MTUxNyIgeD0iMTAiIGZpbGw9IiNmZmZmZmYiLz4NCiAgPHJlY3Qgcng9IjMiIHN0cm9rZS13aWR0aD0iMCIgaWQ9InN2Z184IiBoZWlnaHQ9IjIwIiB3aWR0aD0iMjAiIHk9IjE5LjYwNzg0IiB4PSI5OS42MTUxNyIgc3Ryb2tlPSIjMDAwIiBmaWxsPSIjMDAwMDAwIi8+DQogIDxyZWN0IHJ4PSIzIiBzdHJva2Utd2lkdGg9IjAiIGlkPSJzdmdfOSIgaGVpZ2h0PSIyMCIgd2lkdGg9IjIwIiB5PSI5OS42MTUxNyIgeD0iMTkuNjE1MzkiIHN0cm9rZT0iIzAwMCIgZmlsbD0iIzAwMDAwMCIvPg0KICA8cmVjdCBzdHJva2Utd2lkdGg9IjAiIGlkPSJzdmdfMTEiIGhlaWdodD0iMTAiIHdpZHRoPSIxMCIgeT0iODAiIHg9IjgwIiBzdHJva2U9IiMwMDAiIGZpbGw9IiMwMDAwMDAiLz4NCiAgPHJlY3Qgc3Ryb2tlLXdpZHRoPSIwIiBpZD0ic3ZnXzEyIiBoZWlnaHQ9IjEwIiB3aWR0aD0iMTAiIHk9IjgwIiB4PSI5MCIgc3Ryb2tlPSIjMDAwIiBmaWxsPSIjMDAwMDAwIi8+DQogIDxyZWN0IHN0cm9rZS13aWR0aD0iMCIgaWQ9InN2Z18xMyIgaGVpZ2h0PSIxMCIgd2lkdGg9IjEwIiB5PSI5MCIgeD0iODAiIHN0cm9rZT0iIzAwMCIgZmlsbD0iIzAwMDAwMCIvPg0KICA8cmVjdCBzdHJva2Utd2lkdGg9IjAiIGlkPSJzdmdfMTQiIGhlaWdodD0iMTAiIHdpZHRoPSIxMCIgeT0iMTEwIiB4PSI4MCIgc3Ryb2tlPSIjMDAwIiBmaWxsPSIjMDAwMDAwIi8+DQogIDxyZWN0IHN0cm9rZS13aWR0aD0iMCIgaWQ9InN2Z18xNSIgaGVpZ2h0PSIxMCIgd2lkdGg9IjEwIiB5PSIxMzAiIHg9IjgwIiBzdHJva2U9IiMwMDAiIGZpbGw9IiMwMDAwMDAiLz4NCiAgPHJlY3Qgc3Ryb2tlLXdpZHRoPSIwIiBpZD0ic3ZnXzE2IiBoZWlnaHQ9IjEwIiB3aWR0aD0iMTAiIHk9IjEzMCIgeD0iOTAiIHN0cm9rZT0iIzAwMCIgZmlsbD0iIzAwMDAwMCIvPg0KICA8cmVjdCBzdHJva2Utd2lkdGg9IjAiIGlkPSJzdmdfMTciIGhlaWdodD0iMTAiIHdpZHRoPSIxMCIgeT0iMTIwIiB4PSI5MCIgc3Ryb2tlPSIjMDAwIiBmaWxsPSIjMDAwMDAwIi8+DQogIDxyZWN0IHN0cm9rZS13aWR0aD0iMCIgaWQ9InN2Z18xOCIgaGVpZ2h0PSIxMCIgd2lkdGg9IjEwIiB5PSIxMjAiIHg9IjEwMCIgc3Ryb2tlPSIjMDAwIiBmaWxsPSIjMDAwMDAwIi8+DQogIDxyZWN0IHN0cm9rZS13aWR0aD0iMCIgaWQ9InN2Z18xOSIgaGVpZ2h0PSIxMCIgd2lkdGg9IjEwIiB5PSIxMzAiIHg9IjExMCIgc3Ryb2tlPSIjMDAwIiBmaWxsPSIjMDAwMDAwIi8+DQogIDxyZWN0IHN0cm9rZS13aWR0aD0iMCIgaWQ9InN2Z18yMCIgaGVpZ2h0PSIxMCIgd2lkdGg9IjEwIiB5PSIxMzAiIHg9IjEyMCIgc3Ryb2tlPSIjMDAwIiBmaWxsPSIjMDAwMDAwIi8+DQogIDxyZWN0IHN0cm9rZS13aWR0aD0iMCIgaWQ9InN2Z18yMSIgaGVpZ2h0PSIxMCIgd2lkdGg9IjEwIiB5PSIxMjAiIHg9IjEzMCIgc3Ryb2tlPSIjMDAwIiBmaWxsPSIjMDAwMDAwIi8+DQogIDxyZWN0IHN0cm9rZS13aWR0aD0iMCIgaWQ9InN2Z18yMiIgaGVpZ2h0PSIxMCIgd2lkdGg9IjEwIiB5PSIxMTAiIHg9IjEzMCIgc3Ryb2tlPSIjMDAwIiBmaWxsPSIjMDAwMDAwIi8+DQogIDxyZWN0IHN0cm9rZS13aWR0aD0iMCIgaWQ9InN2Z18yMyIgaGVpZ2h0PSIxMCIgd2lkdGg9IjEwIiB5PSIxMTAiIHg9IjExMCIgc3Ryb2tlPSIjMDAwIiBmaWxsPSIjMDAwMDAwIi8+DQogIDxyZWN0IHN0cm9rZS13aWR0aD0iMCIgaWQ9InN2Z18yNCIgaGVpZ2h0PSIxMCIgd2lkdGg9IjEwIiB5PSIxMDAiIHg9IjEwMCIgc3Ryb2tlPSIjMDAwIiBmaWxsPSIjMDAwMDAwIi8+DQogIDxyZWN0IHN0cm9rZS13aWR0aD0iMCIgaWQ9InN2Z18yNSIgaGVpZ2h0PSIxMCIgd2lkdGg9IjEwIiB5PSI5MCIgeD0iMTAwIiBzdHJva2U9IiMwMDAiIGZpbGw9IiMwMDAwMDAiLz4NCiAgPHJlY3Qgc3Ryb2tlLXdpZHRoPSIwIiBpZD0ic3ZnXzI2IiBoZWlnaHQ9IjEwIiB3aWR0aD0iMTAiIHk9IjEwMCIgeD0iOTAiIHN0cm9rZT0iIzAwMCIgZmlsbD0iIzAwMDAwMCIvPg0KICA8cmVjdCBzdHJva2Utd2lkdGg9IjAiIGlkPSJzdmdfMjciIGhlaWdodD0iMTAiIHdpZHRoPSIxMCIgeT0iODAiIHg9IjExMCIgc3Ryb2tlPSIjMDAwIiBmaWxsPSIjMDAwMDAwIi8+DQogIDxyZWN0IHN0cm9rZS13aWR0aD0iMCIgaWQ9InN2Z18yOCIgaGVpZ2h0PSIxMCIgd2lkdGg9IjEwIiB5PSI4MCIgeD0iMTMwIiBzdHJva2U9IiMwMDAiIGZpbGw9IiMwMDAwMDAiLz4NCiAgPHJlY3Qgc3Ryb2tlLXdpZHRoPSIwIiBpZD0ic3ZnXzI5IiBoZWlnaHQ9IjEwIiB3aWR0aD0iMTAiIHk9IjkwIiB4PSIxMzAiIHN0cm9rZT0iIzAwMCIgZmlsbD0iIzAwMDAwMCIvPg0KICA8cmVjdCBzdHJva2Utd2lkdGg9IjAiIGlkPSJzdmdfMzAiIGhlaWdodD0iMTAiIHdpZHRoPSIxMCIgeT0iOTAiIHg9IjEyMCIgc3Ryb2tlPSIjMDAwIiBmaWxsPSIjMDAwMDAwIi8+DQogIDxyZWN0IHN0cm9rZS13aWR0aD0iMCIgaWQ9InN2Z18zMSIgaGVpZ2h0PSIxMCIgd2lkdGg9IjEwIiB5PSIxMDAiIHg9IjEyMCIgc3Ryb2tlPSIjMDAwIiBmaWxsPSIjMDAwMDAwIi8+DQogPC9nPg0KDQo8L3N2Zz4";
qrc.height=35;
//var bg=document.getElementsByClassName('content')[0];
//bg.style.backgroundImage="url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOTIwIiBoZWlnaHQ9IjEwODAiIGZpbGw9Im5vbmUiPjxnIG9wYWNpdHk9Ii4yIiBjbGlwLXBhdGg9InVybCgjRSkiPjxwYXRoIGQ9Ik0xNDY2LjQgMTc5NS4yYzk1MC4zNyAwIDE3MjAuOC02MjcuNTIgMTcyMC44LTE0MDEuNlMyNDE2Ljc3LTEwMDggMTQ2Ni40LTEwMDgtMjU0LjQtMzgwLjQ4Mi0yNTQuNCAzOTMuNnM3NzAuNDI4IDE0MDEuNiAxNzIwLjggMTQwMS42eiIgZmlsbD0idXJsKCNBKSIvPjxwYXRoIGQ9Ik0zOTQuMiAxODE1LjZjNzQ2LjU4IDAgMTM1MS44LTQ5My4yIDEzNTEuOC0xMTAxLjZTMTE0MC43OC0zODcuNiAzOTQuMi0zODcuNi05NTcuNiAxMDUuNjAzLTk1Ny42IDcxNC0zNTIuMzggMTgxNS42IDM5NC4yIDE4MTUuNnoiIGZpbGw9InVybCgjQikiLz48cGF0aCBkPSJNMTU0OC42IDE4ODUuMmM2MzEuOTIgMCAxMTQ0LjItNDE3LjQ1IDExNDQuMi05MzIuNFMyMTgwLjUyIDIwLjQgMTU0OC42IDIwLjQgNDA0LjQgNDM3Ljg1IDQwNC40IDk1Mi44czUxMi4yNzYgOTMyLjQgMTE0NC4yIDkzMi40eiIgZmlsbD0idXJsKCNDKSIvPjxwYXRoIGQ9Ik0yNjUuOCAxMjE1LjZjNjkwLjI0NiAwIDEyNDkuOC00NTUuNTk1IDEyNDkuOC0xMDE3LjZTOTU2LjA0Ni04MTkuNiAyNjUuOC04MTkuNi05ODQtMzY0LjAwNS05ODQgMTk4LTQyNC40NDUgMTIxNS42IDI2NS44IDEyMTUuNnoiIGZpbGw9InVybCgjRCkiLz48L2c+PGRlZnM+PHJhZGlhbEdyYWRpZW50IGlkPSJBIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDE0NjYuNCAzOTMuNikgcm90YXRlKDkwKSBzY2FsZSgxNDAxLjYgMTcyMC44KSI+PHN0b3Agc3RvcC1jb2xvcj0iIzEwN2MxMCIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2M0YzRjNCIgc3RvcC1vcGFjaXR5PSIwIi8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9IkIiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzk0LjIgNzE0KSByb3RhdGUoOTApIHNjYWxlKDExMDEuNiAxMzUxLjgpIj48c3RvcCBzdG9wLWNvbG9yPSIjMDA3OGQ0Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjYzRjNGM0IiBzdG9wLW9wYWNpdHk9IjAiLz48L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0iQyIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgxNTQ4LjYgOTUyLjgpIHJvdGF0ZSg5MCkgc2NhbGUoOTMyLjQgMTE0NC4yKSI+PHN0b3Agc3RvcC1jb2xvcj0iI2ZmYjkwMCIgc3RvcC1vcGFjaXR5PSIuNzUiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNjNGM0YzQiIHN0b3Atb3BhY2l0eT0iMCIvPjwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJEIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDI2NS44IDE5OCkgcm90YXRlKDkwKSBzY2FsZSgxMDE3LjYgMTI0OS44KSI+PHN0b3Agc3RvcC1jb2xvcj0iI2Q4M2IwMSIgc3RvcC1vcGFjaXR5PSIuNzUiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNjNGM0YzQiIHN0b3Atb3BhY2l0eT0iMCIvPjwvcmFkaWFsR3JhZGllbnQ+PGNsaXBQYXRoIGlkPSJFIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMCAwaDE5MjB2MTA4MEgweiIvPjwvY2xpcFBhdGg+PC9kZWZzPjwvc3ZnPg)"

var style = document.createElement('style')
    style.type = 'text/css'
    style.appendChild(document.createTextNode(
      'html {\n' +
      '  /* background-position: -48px 0; */\n' +
      '      height:100%;'+
    'width:100%;\n'+
    'display:table;\n' +
      '}\n'+
     'body {\n'+      
     'height:100%;'+ 
     'background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOTIwIiBoZWlnaHQ9IjEwODAiIGZpbGw9Im5vbmUiPjxnIG9wYWNpdHk9Ii4yIiBjbGlwLXBhdGg9InVybCgjRSkiPjxwYXRoIGQ9Ik0xNDY2LjQgMTc5NS4yYzk1MC4zNyAwIDE3MjAuOC02MjcuNTIgMTcyMC44LTE0MDEuNlMyNDE2Ljc3LTEwMDggMTQ2Ni40LTEwMDgtMjU0LjQtMzgwLjQ4Mi0yNTQuNCAzOTMuNnM3NzAuNDI4IDE0MDEuNiAxNzIwLjggMTQwMS42eiIgZmlsbD0idXJsKCNBKSIvPjxwYXRoIGQ9Ik0zOTQuMiAxODE1LjZjNzQ2LjU4IDAgMTM1MS44LTQ5My4yIDEzNTEuOC0xMTAxLjZTMTE0MC43OC0zODcuNiAzOTQuMi0zODcuNi05NTcuNiAxMDUuNjAzLTk1Ny42IDcxNC0zNTIuMzggMTgxNS42IDM5NC4yIDE4MTUuNnoiIGZpbGw9InVybCgjQikiLz48cGF0aCBkPSJNMTU0OC42IDE4ODUuMmM2MzEuOTIgMCAxMTQ0LjItNDE3LjQ1IDExNDQuMi05MzIuNFMyMTgwLjUyIDIwLjQgMTU0OC42IDIwLjQgNDA0LjQgNDM3Ljg1IDQwNC40IDk1Mi44czUxMi4yNzYgOTMyLjQgMTE0NC4yIDkzMi40eiIgZmlsbD0idXJsKCNDKSIvPjxwYXRoIGQ9Ik0yNjUuOCAxMjE1LjZjNjkwLjI0NiAwIDEyNDkuOC00NTUuNTk1IDEyNDkuOC0xMDE3LjZTOTU2LjA0Ni04MTkuNiAyNjUuOC04MTkuNi05ODQtMzY0LjAwNS05ODQgMTk4LTQyNC40NDUgMTIxNS42IDI2NS44IDEyMTUuNnoiIGZpbGw9InVybCgjRCkiLz48L2c+PGRlZnM+PHJhZGlhbEdyYWRpZW50IGlkPSJBIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDE0NjYuNCAzOTMuNikgcm90YXRlKDkwKSBzY2FsZSgxNDAxLjYgMTcyMC44KSI+PHN0b3Agc3RvcC1jb2xvcj0iIzEwN2MxMCIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2M0YzRjNCIgc3RvcC1vcGFjaXR5PSIwIi8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9IkIiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzk0LjIgNzE0KSByb3RhdGUoOTApIHNjYWxlKDExMDEuNiAxMzUxLjgpIj48c3RvcCBzdG9wLWNvbG9yPSIjMDA3OGQ0Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjYzRjNGM0IiBzdG9wLW9wYWNpdHk9IjAiLz48L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0iQyIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgxNTQ4LjYgOTUyLjgpIHJvdGF0ZSg5MCkgc2NhbGUoOTMyLjQgMTE0NC4yKSI+PHN0b3Agc3RvcC1jb2xvcj0iI2ZmYjkwMCIgc3RvcC1vcGFjaXR5PSIuNzUiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNjNGM0YzQiIHN0b3Atb3BhY2l0eT0iMCIvPjwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJEIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDI2NS44IDE5OCkgcm90YXRlKDkwKSBzY2FsZSgxMDE3LjYgMTI0OS44KSI+PHN0b3Agc3RvcC1jb2xvcj0iI2Q4M2IwMSIgc3RvcC1vcGFjaXR5PSIuNzUiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNjNGM0YzQiIHN0b3Atb3BhY2l0eT0iMCIvPjwvcmFkaWFsR3JhZGllbnQ+PGNsaXBQYXRoIGlkPSJFIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMCAwaDE5MjB2MTA4MEgweiIvPjwvY2xpcFBhdGg+PC9kZWZzPjwvc3ZnPg);'+
     '}\n'+     
     '.content {\n'+      
     'background-color: rgb(255 255 255 / 0%);'  +                                       
     '}\n'+
     '.content {\n'+
'	display: table;\n'+
'	position: absolute;\n'+
'	height: 100%;\n'+
'	width: 100%\n'+
'}\n'+
                                              
'.content {\n'+
'	display: table;\n'+
'	position: absolute;\n'+
'	height: 100%;\n'+
'	width: 100%\n'+
'}\n'+
'.con {\n'+
'	display: table-row\n'+
'}\n'+
'.mode01 {\n'+
'	display: table-cell;\n'+
'	vertical-align: middle\n'+
'}\n'+
'.contentRt {\n'+
'	margin-left: auto;\n'+
'	margin-right: auto;\n'+
'	margin-bottom: 28px;\n'+
'	max-width: 440px;\n'+
'	width: calc(100% - 40px);\n'+
'	background-color: #fff;\n'+
'	box-shadow: 0 2px 6px rgba(0,0,0,.2);\n'+
'	min-width: 380px;\n'+
'	min-height: 338px;\n'+
'	border-radius: 0px;\n'+
'	padding:44px;\n'+
'}\n'+
'.form-signin-heading {\n'+
'	height:24px;\n'+
'    border-top-left-radius: 0px;\n'+
'    border-top-right-radius: 0px;\n'+
'	background: #00000000;\n'+
'}\n'+
'.form-signin-heading a {\n'+
'	line-height:24px;\n'+
'	font-size: 24px;\n'+
'	color: #737373;\n'+
'	padding:0;\n'+
'}\n'+
'.form-control {\n'+
'    -webkit-box-shadow: inset 0 0px 0px ;\n'+
'    box-shadow: inset 0 0px 0px ;\n'+
'	border: 1px solid #000000;\n'+
'	border-radius:0px;\n'+
'}\n'+
'.form-signin .form-control {\n'+
'    padding: 6px 10px 6px 0px;\n'+
'}\n'+
'\n'+
'.formIn {\n'+
'    padding: 0;\n'+
'    margin: 20px 0 0 0;\n'+
'}\n'+
'button {\n'+
'    min-width: 108px;\n'+
'    height: 32px;\n'+
'    color: #ffffff;\n'+
'    border-style: solid;\n'+
'    border-width: 1px;\n'+
'    border-color: #ff000000;\n'+
'    background-color: #0067b8;\n'+
'    float: right\n'+
'}\n'+
'button:focus {\n'+
'    background-color: #005da6;\n'+
'    text-decoration:underline;\n'+
'    outline: 0px solid #000; \n'+
'    border-style: solid;\n'+
'    border-color: #ffffff\n'+
'}\n'+
'button:hover {\n'+
'    background-color: #005da6\n'+
'}\n'+
'input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill {\n'+
'    -webkit-box-shadow: 0 0 0 1000px #ffffff inset;\n'+
'}\n'+
'input:focus {\n'+
'    outline: 0px; \n'+
'}\n'+
'.login {\n'+
'    overflow: hidden;\n'+
'    margin-top: 49px;\n'+
'}\n'+
'.login-input-box {\n'+
'    margin-bottom: 20px;\n'+
'    border: 1px solid #ffffff;\n'+
'    width: 100%;\n'+
'}\n'+
'\n'+
'.login-input-box input {\n'+
'    margin-left: 0px;\n'+
'    border: 1px solid #ffffff;\n'+
'    border-bottom: 1px solid #000000;\n'+
'    border-radius: 0px;\n'+
'    width: 100%;\n'+
'    border-radius: 0px;\n'+
'}\n'+
'.login-input-box input:hover{\n'+
'    border: 1px solid #fff;\n'+
'	border-bottom:1px solid #0051ff;\n'+
'}\n'+
'.login-input-box input:focus{\n'+
'    border: 1px solid #fff;\n'+
'	border-bottom:1px solid #0051ff;\n'+
'}\n'+
'.form-signin .yzm input {\n'+
'    border:2px solid white;\n'+
'    border-bottom:1px solid black;\n'+
'    padding: 10px 15px;\n'+
'    background-color: #ffffff;\n'+
' \n'+
'    max-width:160px;\n'+
'    float: none;\n'+
'}\n'+
'.form-signin .yzm input:hover {\n'+
'    border-bottom:1px solid #0051ff;\n'+
'}\n'+
'.form-signin .yzm input:focus {\n'+
'    border-bottom:1px solid #0051ff;\n'+
'}\n'+
'.form-signin .yzm span {\n'+
'    margin: 0 0px 0 0;\n'+
'    float: right;\n'+
'}\n'+
'iframe {\n'+
'	margin-left:1px;\n'+
'	height:280px\n'+
'}\n'+
'@media screen and (max-width: 640px) {\n'+
'    .form-signin .yzm span {\n'+
'        margin: 30;\n'+
'    }\n'+
'}\n'                                
                                             ))

    var head = document.getElementsByTagName('head')[0]
    head.appendChild(style)