// ==UserScript==
// @name         Google-open-in-new-tab
// @name:ZH-CN   谷歌搜索：新建标签页打开链接
// @name:ZH-TW   谷歌搜尋：新建標籤頁打開鏈接
// @namespace    https://github.com/li-zyang/
// @version      1.0.2
// @description  Open links in the google search results in a new tab
// @description:ZH-CN  点击搜索结果中的链接时在新标签页中打开
// @description:ZH-TW  點擊搜索結果中的鏈接時在新標籤頁中打開
// @author       阿昭
// @include      https://www.google.com/*
// @include      https://www.google.ad/*
// @include      https://www.google.ae/*
// @include      https://www.google.com.af/*
// @include      https://www.google.com.ag/*
// @include      https://www.google.com.ai/*
// @include      https://www.google.al/*
// @include      https://www.google.am/*
// @include      https://www.google.co.ao/*
// @include      https://www.google.com.ar/*
// @include      https://www.google.as/*
// @include      https://www.google.at/*
// @include      https://www.google.com.au/*
// @include      https://www.google.az/*
// @include      https://www.google.ba/*
// @include      https://www.google.com.bd/*
// @include      https://www.google.be/*
// @include      https://www.google.bf/*
// @include      https://www.google.bg/*
// @include      https://www.google.com.bh/*
// @include      https://www.google.bi/*
// @include      https://www.google.bj/*
// @include      https://www.google.com.bn/*
// @include      https://www.google.com.bo/*
// @include      https://www.google.com.br/*
// @include      https://www.google.bs/*
// @include      https://www.google.bt/*
// @include      https://www.google.co.bw/*
// @include      https://www.google.by/*
// @include      https://www.google.com.bz/*
// @include      https://www.google.ca/*
// @include      https://www.google.cd/*
// @include      https://www.google.cf/*
// @include      https://www.google.cg/*
// @include      https://www.google.ch/*
// @include      https://www.google.ci/*
// @include      https://www.google.co.ck/*
// @include      https://www.google.cl/*
// @include      https://www.google.cm/*
// @include      https://www.google.cn/*
// @include      https://www.google.com.co/*
// @include      https://www.google.co.cr/*
// @include      https://www.google.com.cu/*
// @include      https://www.google.cv/*
// @include      https://www.google.com.cy/*
// @include      https://www.google.cz/*
// @include      https://www.google.de/*
// @include      https://www.google.dj/*
// @include      https://www.google.dk/*
// @include      https://www.google.dm/*
// @include      https://www.google.com.do/*
// @include      https://www.google.dz/*
// @include      https://www.google.com.ec/*
// @include      https://www.google.ee/*
// @include      https://www.google.com.eg/*
// @include      https://www.google.es/*
// @include      https://www.google.com.et/*
// @include      https://www.google.fi/*
// @include      https://www.google.com.fj/*
// @include      https://www.google.fm/*
// @include      https://www.google.fr/*
// @include      https://www.google.ga/*
// @include      https://www.google.ge/*
// @include      https://www.google.gg/*
// @include      https://www.google.com.gh/*
// @include      https://www.google.com.gi/*
// @include      https://www.google.gl/*
// @include      https://www.google.gm/*
// @include      https://www.google.gr/*
// @include      https://www.google.com.gt/*
// @include      https://www.google.gy/*
// @include      https://www.google.com.hk/*
// @include      https://www.google.hn/*
// @include      https://www.google.hr/*
// @include      https://www.google.ht/*
// @include      https://www.google.hu/*
// @include      https://www.google.co.id/*
// @include      https://www.google.ie/*
// @include      https://www.google.co.il/*
// @include      https://www.google.im/*
// @include      https://www.google.co.in/*
// @include      https://www.google.iq/*
// @include      https://www.google.is/*
// @include      https://www.google.it/*
// @include      https://www.google.je/*
// @include      https://www.google.com.jm/*
// @include      https://www.google.jo/*
// @include      https://www.google.co.jp/*
// @include      https://www.google.co.ke/*
// @include      https://www.google.com.kh/*
// @include      https://www.google.ki/*
// @include      https://www.google.kg/*
// @include      https://www.google.co.kr/*
// @include      https://www.google.com.kw/*
// @include      https://www.google.kz/*
// @include      https://www.google.la/*
// @include      https://www.google.com.lb/*
// @include      https://www.google.li/*
// @include      https://www.google.lk/*
// @include      https://www.google.co.ls/*
// @include      https://www.google.lt/*
// @include      https://www.google.lu/*
// @include      https://www.google.lv/*
// @include      https://www.google.com.ly/*
// @include      https://www.google.co.ma/*
// @include      https://www.google.md/*
// @include      https://www.google.me/*
// @include      https://www.google.mg/*
// @include      https://www.google.mk/*
// @include      https://www.google.ml/*
// @include      https://www.google.com.mm/*
// @include      https://www.google.mn/*
// @include      https://www.google.ms/*
// @include      https://www.google.com.mt/*
// @include      https://www.google.mu/*
// @include      https://www.google.mv/*
// @include      https://www.google.mw/*
// @include      https://www.google.com.mx/*
// @include      https://www.google.com.my/*
// @include      https://www.google.co.mz/*
// @include      https://www.google.com.na/*
// @include      https://www.google.com.ng/*
// @include      https://www.google.com.ni/*
// @include      https://www.google.ne/*
// @include      https://www.google.nl/*
// @include      https://www.google.no/*
// @include      https://www.google.com.np/*
// @include      https://www.google.nr/*
// @include      https://www.google.nu/*
// @include      https://www.google.co.nz/*
// @include      https://www.google.com.om/*
// @include      https://www.google.com.pa/*
// @include      https://www.google.com.pe/*
// @include      https://www.google.com.pg/*
// @include      https://www.google.com.ph/*
// @include      https://www.google.com.pk/*
// @include      https://www.google.pl/*
// @include      https://www.google.pn/*
// @include      https://www.google.com.pr/*
// @include      https://www.google.ps/*
// @include      https://www.google.pt/*
// @include      https://www.google.com.py/*
// @include      https://www.google.com.qa/*
// @include      https://www.google.ro/*
// @include      https://www.google.ru/*
// @include      https://www.google.rw/*
// @include      https://www.google.com.sa/*
// @include      https://www.google.com.sb/*
// @include      https://www.google.sc/*
// @include      https://www.google.se/*
// @include      https://www.google.com.sg/*
// @include      https://www.google.sh/*
// @include      https://www.google.si/*
// @include      https://www.google.sk/*
// @include      https://www.google.com.sl/*
// @include      https://www.google.sn/*
// @include      https://www.google.so/*
// @include      https://www.google.sm/*
// @include      https://www.google.sr/*
// @include      https://www.google.st/*
// @include      https://www.google.com.sv/*
// @include      https://www.google.td/*
// @include      https://www.google.tg/*
// @include      https://www.google.co.th/*
// @include      https://www.google.com.tj/*
// @include      https://www.google.tl/*
// @include      https://www.google.tm/*
// @include      https://www.google.tn/*
// @include      https://www.google.to/*
// @include      https://www.google.com.tr/*
// @include      https://www.google.tt/*
// @include      https://www.google.com.tw/*
// @include      https://www.google.co.tz/*
// @include      https://www.google.com.ua/*
// @include      https://www.google.co.ug/*
// @include      https://www.google.co.uk/*
// @include      https://www.google.com.uy/*
// @include      https://www.google.co.uz/*
// @include      https://www.google.com.vc/*
// @include      https://www.google.co.ve/*
// @include      https://www.google.vg/*
// @include      https://www.google.co.vi/*
// @include      https://www.google.com.vn/*
// @include      https://www.google.vu/*
// @include      https://www.google.ws/*
// @include      https://www.google.rs/*
// @include      https://www.google.co.za/*
// @include      https://www.google.co.zm/*
// @include      https://www.google.co.zw/*
// @include      https://www.google.cat/*
// @exclude      none
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      *
// @noframes
// @run-at       document-end
// @note         v1.0.0      2020-03-15  First published
// @note         v1.0.1      2020-03-26  Fixed bug: uncaught mutation
// @note         v1.0.2      2020-07-15  Fixed local google search domain mismatch
// @downloadURL https://update.greasyfork.org/scripts/397957/Google-open-in-new-tab.user.js
// @updateURL https://update.greasyfork.org/scripts/397957/Google-open-in-new-tab.meta.js
// ==/UserScript==

// All google search domains: https://www.google.com.hk/supported_domains

(function() {
  'use strict';
  $('#taw a').attr('target', '_blank').attr('rel', 'noopener');
  $('#taw div:nth-of-type(2) a').attr('target', '');
  $('#res a').attr('target', '_blank').attr('rel', 'noopener');
  $('#rhs a').attr('target', '_blank').attr('rel', 'noopener');
  $('#taw a').unbind().removeAttr('onmousedown').removeAttr('onclick');
  $('#res a').unbind().removeAttr('onmousedown').removeAttr('onclick');
  $('#rhs a').unbind().removeAttr('onmousedown').removeAttr('onclick');
  let observer = new MutationObserver(function(mulist) {
    for (let mutation of mulist) {
      if (mutation.type == 'childList') {
        let jq_target = $(mutation.target);
        let caught = false;
        jq_target.parents().each(function() {
          if ($(this).attr('id') == 'taw') {
            caught = true;
            $('#taw a').attr('target', '_blank').attr('rel', 'noopener');
            $('#taw a').unbind().removeAttr('onmousedown').removeAttr('onclick');
            $('#taw div:nth-of-type(2) a').attr('target', '');
          } else if ($(this).attr('id') == 'res') {
            caught = true;
            $('#res a').attr('target', '_blank').attr('rel', 'noopener');
            $('#res a').unbind().removeAttr('onmousedown').removeAttr('onclick');
          } else if ($(this).attr('id') == 'rhs') {
            caught = true;
            $('#rhs a').attr('target', '_blank').attr('rel', 'noopener');
            $('#rhs a').unbind().removeAttr('onmousedown').removeAttr('onclick');
          }
        });
        /*
        if (!caught) {
          console.log('uncaught mutation:', jq_target);
          console.log('parents:', jq_target.parents());
        } */
      }
    }
  });
  observer.observe($('#rcnt')[0], {
    childList: true,
    subtree: true
  });
})();