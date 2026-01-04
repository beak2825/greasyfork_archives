// ==UserScript==
// @name         randomOJ
// @version      0.0.5
// @description  make NFLSOJ random
// @match        *://www.nfls.com.cn:20035/*
// @match        *://www.nfls.com.cn:10611/*
// @match        *://192.168.188.77/*
// @match        *://192.168.188.88/*
// @namespace https://greasyfork.org/users/1243131
// @downloadURL https://update.greasyfork.org/scripts/488603/randomOJ.user.js
// @updateURL https://update.greasyfork.org/scripts/488603/randomOJ.meta.js
// ==/UserScript==

let header = document.querySelector("a.header");
let span = document.createElement("div");
let OJs = [
    `<div class="item" data-value="File Error"><span class="status status time_limit_exceeded" style="display: contents"><img src="https://cdn.luogu.com.cn/upload/image_hosting/23ptcpn5.png?x-oss-process=image/resize,m_lfit,h_170,w_225" width="25px"></img> <b>   Banana</b></span></div>`,
    `<div class="item" data-value="File Error"><span class="status file_error"><i class="file outline icon"></i> <b>File Error</b></span></div>`,
    `<div class="item" data - value="Waiting" > <span class="status waiting"><i class="hourglass half icon"></i> <b>Waiting</b></span></div >`,
    `<div class="item" data-value="System Error"><span class="status system_error"><i class="server icon"></i> <b>System Error</b></span>`,
    `<div class="item" data-value="No Testdata"><span class="status no_testdata"><i class="folder open outline icon"></i> <b>No Testdata</b></span>`,
    `<div class="item" data-value="Judgement Failed"><span class="status judgement_failed"><i class="server icon"></i> <b>Judgement Failed</b></span>`,
    `<div class="item" data-value="Unknown"><span class="status unknown"><i class="question circle icon"></i> <b>Unknown</b></span></div>`
];
header.innerText = "OJ";
span.innerHTML = OJs[new Date().getTime()%OJs.length];
header.insertBefore(span,header.childNodes[0]);