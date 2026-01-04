// ==UserScript==
// @name         EDGE_Agar.io_script_v.1.1具
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Offical EDGE Extention for XingKong Agar
// @author       EDGE_DEV_TEAM/
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @require      https://code.jquery.com/jquery-3.4.1.min.js"integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="crossorigin="anonymous
// @match        http://agario.xingkong.tw/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      agario.xingkong.tw
// @downloadURL https://update.greasyfork.org/scripts/396508/EDGE_Agario_script_v11%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/396508/EDGE_Agario_script_v11%E5%85%B7.meta.js
// ==/UserScript==

function inject(page) { var _page = page.replace('<script src="/cdn-cgi/apps/head/7LNFg1kJ-8FGQR2bHMSDJTp37uA.js"></script>', ''); _page = _page.replace('<!--', ''); _page = _page.replace('%3Chead%3E','%3Chead%3E%0D%0A%3Cscript%20src%3D%22https%3A%2F%2Fcode.jquery.com%2Fjquery-3.4.1.min.js%22%3E%3C%2Fscript%3E'); _page = _page.replace('assets/img/logo.png', 'http://i.imgur.com/ycsfwvx.png'); _page = _page.replace("%3Cscript%20src%3D%22assets/js/main_out.js%22%3E%3C/script%3E", "%3Cscript%20src%3D%22https://codepen.io/coding_for_fun/pen/vYOQYoz.js%22%3E%3C%2Fscript%3E%3Cscript%20src%3D%22https://codepen.io/coding_for_fun/pen/yLNQPrN.js%22%3E%3C%2Fscript%3E"); _page = _page.replace('assets/css/index.min.css', 'https://codepen.io/coding_for_fun/pen/vYOQYoz.css'); _page = _page.replace('%3Cfont%20color%3D%22orangered%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%u4F7F%u7528%20%3Cb%3E%u6ED1%u9F20%3C/b%3E%20%u63A7%u5236%u79FB%u52D5%u65B9%u5411%3Cbr/%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cb%3E%u7A7A%u767D%u9375%3C/b%3E%20%u5206%u88C2%3Cbr/%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cb%3EW%3C/b%3E%20%u91CB%u653E%u90E8%u5206%u8CEA%u91CF%3Cbr/%3E%0A%09%09%09%09%09%09%3C/font%3E','%3Cfont%20color%3D%22white%22%3EW=連噴 空白鍵=分裂<br>A=雙拍 C=四拍<br>S=定住不動%3Cfont%3E'); return _page; } document.documentElement.innerHTML = ""; GM_xmlhttpRequest({ method : "GET", url : 'http://agario.xingkong.tw/', onload : function(e) { var doc = inject(e.responseText); document.open(); console.log(doc); document.write(doc); document.close(); } });