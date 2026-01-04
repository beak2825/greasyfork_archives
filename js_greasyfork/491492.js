// ==UserScript==
// @name         Scicy原
// @namespace    http://tampermonkey.net/
// @version      1.0.0.1
// @description  chaoyue
// @author       chaoyue
// @match        https://onlinelibrary.wiley.com/*
// @match        https://link.springer.com/*
// @match        https://www.techno-press.org/*
// @match        https://www.science.org/*
// @match        https://www.tandfonline.com/*
// @match        https://www.sciencedirect.com/*
// @match        https://academic.oup.com/*
// @match        https://journals.lww.com/*
// @match        https://www.spiedigitallibrary.org/*
// @match        https://jamanetwork.com/*
// @match        https://iopscience.iop.org/*
// @match        https://aacrjournals.org/*
// @match        https://www.cambridge.org/*
// @match        https://journals.physiology.org/*
// @match        https://ascopubs.org/*
// @match        https://saemobilus.sae.org/*
// @match        https://karger.com/*
// @match        https://*.bmj.com/*
// @match        https://www.airitilibrary.com/*
// @match        https://rupress.org/*
// @match        https://www.ingentaconnect.com/*
// @match        https://pubs.aip.org/*
// @match        https://iwaponline.com/*
// @match        https://journals.aom.org/*
// @match        https://www.ajronline.org/*
// @match        https://www.atsjournals.org/*
// @match        https://*.rsc.org/*
// @match        https://journals.biologists.com/*
// @match        https://portlandpress.com/*
// @match        https://*.nejm.org/*
// @match        https://www.scientific.net/*
// @match        https://arc.aiaa.org/*
// @match        https://www.worldscientific.com/*
// @match        https://journals.sagepub.com/*
// @match        https://ascelibrary.org/*
// @match        https://apsjournals.apsnet.org/*
// @match        https://pubs.geoscienceworld.org/*
// @match        https://thejns.org/*
// @match        https://direct.mit.edu/*
// @match        https://opg.optica.org/*
// @match        https://www.psychiatrist.com/*
// @match        https://ieeexplore.ieee.org/*
// @match        https://journals.healio.com/*
// @match        https://pubs.rsna.org/*
// @match        https://www.emerald.com/*
// @match        https://asmedigitalcollection.asme.org/*
// @match        https://www.clinexprheumatol.org/*
// @match        https://www.jle.com/*
// @match        https://econtent.hogrefe.com/*
// @match        https://www.igi-global.com/gateway/*
// @match        https://www.jstor.org/*
// @match        https://www.degruyter.com/*
// @match        https://www.microbiologyresearch.org/*
// @match        https://www.journals.uchicago.edu/*
// @match        https://www.thieme-connect.de/*
// @match        https://www.neurology.org/*
// @match        https://www.eurekaselect.com/*
// @match        https://www.jco-online.com/*
// @match        https://pubs.acs.org/*
// @match        https://www.ahajournals.org/*
// @match        https://ascopubs.org/*
// @match        https://www.dbpia.co.kr/*
// @match        https://econtent.hogrefe.com/*
// @match        https://www.icevirtuallibrary.com/*
// @match        https://content.iospress.com/*
// @match        https://intellectdiscover.com/*
// @match        https://www.nature.com/*
// @match        https://www.minervamedica.it/*
// @match        https://publications.aaahq.org/*
// @match        https://brill.com/*
// @match        https://psycnet.apa.org/*
// @match        https://www.wageningenacademic.com/*
// @match        https://www.dl.begellhouse.com/*
// @match        https://journals.aps.org/*
// @match        https://agupubs.onlinelibrary.wiley.com/*
// @match        https://muse.jhu.edu/*
// @match        https://archives.datapages.com/*
// @match        https://www.cairn.info/*
// @match        https://www.aeaweb.org/*
// @match        https://www.concrete.org/*
// @match        https://ebooks.iospress.nl/*
// @match        https://jcsm.aasm.org/*
// @match        https://www.dustri.com/*
// @match        https://www.neurology.org/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/layui/2.9.3/layui.js
// @connect      127.0.0.1
// @connect      wanfangdata.com.cn
// @connect      cqvip.com
// @connect      cnki.net

// @downloadURL https://update.greasyfork.org/scripts/491492/Scicy%E5%8E%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/491492/Scicy%E5%8E%9F.meta.js
// ==/UserScript==
// SCIHUB
window.sci=function(){
    var t=location.href
    var t1 = "https://www.et-fine.com/";
    var t2 = t1 + t;
    window.open(t2, "_self");
    };
// SCIHUB
(function () {
'use strict';
const $ = unsafeWindow.jQuery;
let link = document.createElement('link');
link.rel = "stylesheet"
link.href = 'https://cdnjs.cloudflare.com/ajax/libs/layui/2.9.3/css/layui.css';
document.head.appendChild(link);
let Gmsg = "";
layui.use(function () {
  var util = layui.util;
  var bars = [{
      type: 'read',
      icon: 'layui-icon-read',
      style: 'background-color: #5d9e2b;',},
              {
      type: 'download',
      icon: 'layui-icon-download-circle',
      style: 'background-color: #5d9e2b;',}]
util.fixbar({
  bars: bars,
  default: false,
  offset: 'auto',
  css: { bottom: 200 },
  on: {
      mouseenter: function (type) {
      let C = { 'read': "权限下载", "download": "SCIHUB" }
      layer.tips(C[type], this, {
      tips: 2,
      fixed: true});},

      mouseleave: function (type) {
      layer.closeAll('tips');}},
      // 点击事件
      click: function (type) {
        if (type == 'download') {
        window.sci();
}
        else if (type == 'read') {
          window.read();
        }}});
});
// wiley
if (location.host.indexOf("onlinelibrary.wiley.com") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://onlinelibrary.wiley.com/action/authenticateSharedSP';

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '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';
usernameInput.name = 'sharedSPMessage';
form.appendChild(usernameInput);

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'redirectUri';
form.appendChild(eventTargetInput);
document.body.appendChild(form);
form.submit();
    };
    }
// wiley
if (location.host.indexOf("agupubs.onlinelibrary.wiley.com") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://onlinelibrary.wiley.com/action/authenticateSharedSP';

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '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';
usernameInput.name = 'sharedSPMessage';
form.appendChild(usernameInput);

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'redirectUri';
form.appendChild(eventTargetInput);
document.body.appendChild(form);
form.submit();
    };
    }
// uchicago
if (location.host.indexOf("www.journals.uchicago.edu") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://www.journals.uchicago.edu/action/authenticateSharedSP';

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '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';
usernameInput.name = 'sharedSPMessage';
form.appendChild(usernameInput);

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'redirectUri';
form.appendChild(eventTargetInput);
document.body.appendChild(form);
form.submit();
    };
    }
// aiaa
if (location.host.indexOf("arc.aiaa.org") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://arc.aiaa.org/action/authenticateSharedSP';

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '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';
usernameInput.name = 'sharedSPMessage';
form.appendChild(usernameInput);

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'redirectUri';
form.appendChild(eventTargetInput);
document.body.appendChild(form);
form.submit();
    };
    }
// techno-press
  else if(location.host.indexOf("www.techno-press.org") > -1)
  {window.read=function(){
        var t=location.href
        var t1
        t1=t.replace("https://www.techno-press.org/content/?page=article&","https://www.techno-press.org/download.php?");
        window.open(t1);
    };
    }
// minervamedica
   else if(location.host.indexOf("www.minervamedica.it") > -1)
  {window.read=function(){
        var t="https://sciener.netlify.app/ebscopcom"
        window.open(t);
    };
    }

// aaahq
    else if(location.host.indexOf("publications.aaahq.org") > -1)
  {window.read=function(){
        var t="https://sciener.netlify.app/ebscoozy"
        window.open(t);
    };
    }
// apa
    else if(location.host.indexOf("psycnet.apa.org") > -1)
  {window.read=function(){
        var t="https://sciener.netlify.app/ebscoozy"
        window.open(t);
    };
    }
//jcsm
  else if(location.host.indexOf("jcsm.aasm.org") > -1)
  {window.read=function(){
var t=location.href
var t1="https://oca.korea.ac.kr/link.n2s?url=";
var url=t1 + t;
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://library.korea.ac.kr/login/?returl=';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'returl';
form.appendChild(eventTargetInput);

var usertypeInput = document.createElement('input');
usertypeInput.type = 'hidden';
usertypeInput.value = "P";
usertypeInput.name = 'usertype';
form.appendChild(usertypeInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'cyj135';
usernameInput.name = 'uid';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'cnfdornq135';
passwordInput.name = 'upw';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//aci
  else if(location.host.indexOf("www.concrete.org") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.ntust.idm.oclc.org/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'B10604026';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'B10604026';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//iosebooks
  else if(location.host.indexOf("ebooks.iospress.nl") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.ntust.idm.oclc.org/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = "r122735$https://ebooks.windeal.com.tw/ios/bytitle.asp";
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'B10604026';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'B10604026';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//igi
  else if(location.host.indexOf("www.igi-global.com") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.ejp.mpip-mainz.mpg.de/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'liuchan';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'Zhan611429';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
// springer
   else if(location.host.indexOf("link.springer.com") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.ejp.mpip-mainz.mpg.de/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'liuchan';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'Zhan611429';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
// brill
   else if(location.host.indexOf("brill.com") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.proxy-ub.rug.nl/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 's4090535';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'H@llopizza1212';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
// datapages
   else if(location.host.indexOf("archives.datapages.com") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.libproxy.mtroyal.ca/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'droac145';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'Forlaren2455#';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
// cairn
   else if(location.host.indexOf("www.cairn.info") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.proxy2.hec.ca/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '11205147';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'Papillon10';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
// aeaweb
   else if(location.host.indexOf("www.aeaweb.org") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.proxy2.hec.ca/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '11205147';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'Papillon10';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
// sciencedirect
   else if(location.host.indexOf("www.sciencedirect.com") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.ejp.mpip-mainz.mpg.de/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'liuchan';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'Zhan611429';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
// pnas
   else if(location.host.indexOf("www.pnas.org") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.ejp.mpip-mainz.mpg.de/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'liuchan';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'Zhan611429';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
// microbiologyresearch
   else if(location.host.indexOf("www.microbiologyresearch.org") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.ejp.mpip-mainz.mpg.de/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'liuchan';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'Zhan611429';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
// ieee
   else if(location.host.indexOf("ieeexplore.ieee.org") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.ejp.mpip-mainz.mpg.de/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'liuchan';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'Zhan611429';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
// annualreviews
   else if(location.host.indexOf("www.annualreviews.org") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.ejp.mpip-mainz.mpg.de/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'liuchan';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'Zhan611429';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
// apa
   else if(location.host.indexOf("psycnet.apa.org") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.ejp.mpip-mainz.mpg.de/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'liuchan';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'Zhan611429';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
// acm
   else if(location.host.indexOf("dl.acm.org") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.ejp.mpip-mainz.mpg.de/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'liuchan';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'Zhan611429';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
// sagepub
   else if(location.host.indexOf("journals.sagepub.com") > -1)
  {window.read=function(){
  var t=location.href
  var iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = 'https://journals.sagepub.com/action/authenticateSharedSP?sharedSPMessage=9OwW1HqCDwBcVtbsU9Pou2yF7WhuXN6poQZCaZL1TJiySqxUHiRHnMlvhkeBlTJr347y6b6Obhxj%0D%0AZr5YIjVcpF4muMpdeb323kSsMO%2FKK2jBgB8QLCNSUBzmuL%2BetU2famlcp3yDKkEUhLCxoMfacPrg%0D%0AZM0%2B3uAi2S6smWONcjceyH0siRfa8oyZfsSbfaEsSCq2NYcFxCZcILPKfm7CSJvIPe2NmO02j7KO%0D%0AClNSM4IwNfONIIhKF6UfeNtwBKaTbmuaJUPGEDKL3yhyhAUlgZv0E7rAQLpY8UVO%2BSAAnAjTUnao%0D%0Ak86f8LZLz%2FnysljXI%2B79ewRgup8eyH0siRfa8h1gaaRLTSTu2J1JoHBM%2BqhHNnNNQ4eLVNYiqSDJ%0D%0A7DvKaHdUsNuP2aSMClM1jVCFvvVvZBgRDNBHjJl%2BxJt9oSxIKrY1hwXEJlwgs8p%2BbsJIm8g97Y2Y%0D%0A7TaPso4KU1IzgmpxVumbd5JBamlcp3yDKkF9Sy4hKayHYjQwIpW5vnj%2FS3zLMOy6eywww5ZIr6Js%0D%0AQyqm6GGHkGn1%2FcSMX5B2IT2sTqvs8wQYLaon8Msr86Ukkf%2FJjX7JJQ%2BTOrywK19Er49hMjhA5XkD%0D%0Agaf7wNSMDloiKnwuqAk164%2FkgWuzLvBPq7wkvS6hVQBYQoLm1jul0IM5B3gT%2F73SaHaFLWCRTV7A%0D%0Af%2FsROM9tT8cfarmAEmEg5Q6Y%2FPU20ly4lljlth22WTMpe3Z%2BzkP2vECCw3AKPKJQ3bLJnPp9p0wE%0D%0AqJlcLlZp%2FyKosr0UDmdLfMsw7Lp7LDDDlkivomxDKqboYYeQafX9xIxfkHYhPaxOq%2BzzBBgtqifw%0D%0AyyvzpSSR%2F8mNfsklD5M6vLArX0SvcGJn5AZTCB7jgpLh94Qbcg%3D%3D';
  document.body.appendChild(iframe);
  window.open(t,"_self");
};}
// hogrefe
    else if(location.host.indexOf("econtent.hogrefe.com") > -1)
  {
    var iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = 'https://sciener.netlify.app/hog';
  document.body.appendChild(iframe);
    window.read=function(){
  var t=location.href
  window.open(t,"_self");
};}
// jama
    else if(location.host.indexOf("jamanetwork.com") > -1)
  {
    var iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = 'https://jamanetwork.com/OAuthSignin.aspx?clientId=jamanetwork&LastName=Able&amauniqueid=85945b98-62d1-4957-b21b-5b69312c1161&code=v3dpIR5UU4D7dNdfCBN0dsWxh8JotZ&amaname=Sci+Able&username=ablescijama&amaemail=75e9d03d8d98%40drmail.in&FirstName=Sci&groups=&noOfGroups=0';
  document.body.appendChild(iframe);
    window.read=function(){
  var t=location.href
  window.open(t,"_self");
};}
// iospress
      else if(location.host.indexOf("content.iospress.com") > -1)
  {
    var iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = 'https://sciener.netlify.app/ios';
  document.body.appendChild(iframe);
    window.read=function(){
  var t=location.href
  window.open(t,"_self");
};}
// intellect
        else if(location.host.indexOf("intellectdiscover.com") > -1)
  {
    var iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = 'https://sciener.netlify.app/intellect';
  document.body.appendChild(iframe);
    window.read=function(){
  var t=location.href
  window.open(t,"_self");
};}
// ice
      else if(location.host.indexOf("www.icevirtuallibrary.com") > -1)
  {
    var iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = 'https://sciener.netlify.app/ice';
  document.body.appendChild(iframe);
    window.read=function(){
  var t=location.href
  window.open(t,"_self");
};}
// acs
      else if(location.host.indexOf("pubs.acs.org") > -1)
  {
    var iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = 'https://sciener.netlify.app/acs';
  document.body.appendChild(iframe);
    window.read=function(){
  var t="https://pubs.acs.org/action/ssoRequestForLoginPage"
  window.open(t,"_self");
};}
// science
   else if(location.host.indexOf("www.science.org") > -1)
  {
    var iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = 'https://sciener.netlify.app/science';
  document.body.appendChild(iframe);
    window.read=function(){
  var t=location.href
    window.read=function(){
        window.open(t, "_self");
    };
    };}
// wageningen
   else if(location.host.indexOf("www.wageningenacademic.com") > -1)
  {
    var iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = 'https://sciener.netlify.app/wag';
  document.body.appendChild(iframe);
    window.read=function(){
  var t=location.href
    window.read=function(){
        window.open(t, "_self");
    };
    };}
// tandfonline
     else if(location.host.indexOf("www.tandfonline.com") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://www.tandfonline.com/action/doLogin';
var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'redirectUri';
form.appendChild(eventTargetInput);
var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'talor@teml.net';
usernameInput.name = 'login';
form.appendChild(usernameInput);
var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'Ablesci666!';
passwordInput.name = 'password';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//jstor
       else if(location.host.indexOf("www.jstor.org") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://www.jstor.org/action/doLogin';
var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'redirectUri';
form.appendChild(eventTargetInput);
var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'e63d36fc7a9d@drmail.in';
usernameInput.name = 'login';
form.appendChild(usernameInput);
var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'nm9!5#my5Vcx';
passwordInput.name = 'password';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//ats
  else if(location.host.indexOf("www.atsjournals.org") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.chula.idm.oclc.org/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '60728862';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = '24052535';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//ats
  else if(location.host.indexOf("pubs.rsna.org") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.chula.idm.oclc.org/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '60728862';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = '24052535';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//begell
  else if(location.host.indexOf("www.dl.begellhouse.com") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.ncat.idm.oclc.org/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'iholman';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'OverFlow-2022';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//iopscience
  else if(location.host.indexOf("iopscience.iop.org") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.ncat.idm.oclc.org/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'iholman';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'OverFlow-2022';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//jco
    else if(location.host.indexOf("www.jco-online.com") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.uchile.idm.oclc.org/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'alvaroaravena';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'alvaro10';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//dustri
    else if(location.host.indexOf("www.dustri.com") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.uchile.idm.oclc.org/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'alvaroaravena';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'alvaro10';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//aacr
     else if(location.host.indexOf("aacrjournals.org") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.elibrary.einsteinmed.edu/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '2700004953';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'CRAIN';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//neurology
     else if(location.host.indexOf("www.neurology.org") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.elibrary.einsteinmed.edu/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '2700004953';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'CRAIN';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//nejm
     else if(location.host.indexOf("www.nejm.org") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.elibrary.einsteinmed.edu/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '2700004953';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'CRAIN';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//aha
    else if(location.host.indexOf("www.ahajournals.org") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.elibrary.einsteinmed.edu/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '2700004953';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'CRAIN';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//aip
    else if(location.host.indexOf("pubs.aip.org") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.pbidi.unam.mx:2443/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '143497';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'm2Y$M==j';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//nature
    else if(location.host.indexOf("www.nature.com") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.pbidi.unam.mx:2443/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '143497';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'm2Y$M==j';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//mit
    else if(location.host.indexOf("direct.mit.edu") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.proxy.lib.uwaterloo.ca/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '21187006793640';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'Edgar';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//muse
    else if(location.host.indexOf("muse.jhu.edu") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.proxy.lib.uwaterloo.ca/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '21187006793640';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'Edgar';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//sae
    else if(location.host.indexOf("saemobilus.sae.org") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.proxy.lib.uwaterloo.ca/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '21187006793640';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'Edgar';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//mit
    else if(location.host.indexOf("asmedigitalcollection.asme.org") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.proxy.lib.uwaterloo.ca/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '21187006793640';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'Edgar';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//aps
    else if(location.host.indexOf("journals.aps.org") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.pbidi.unam.mx:2443/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '143497';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'm2Y$M==j';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//rsc
    else if(location.host.indexOf("pubs.rsc.org") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.pbidi.unam.mx:2443/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '143497';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'm2Y$M==j';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//portland
    else if(location.host.indexOf("portlandpress.com") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.pbidi.unam.mx:2443/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '143497';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'm2Y$M==j';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//karger
    else if(location.host.indexOf("karger.com") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.pbidi.unam.mx:2443/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '143497';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'm2Y$M==j';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//physiology
    else if(location.host.indexOf("journals.physiology.org") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.pbidi.unam.mx:2443/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '143497';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'm2Y$M==j';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}

//airitilibrary
     else if(location.host.indexOf("www.airitilibrary.com") > -1)
  {
    var iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = 'https://sciener.netlify.app/ntnu';
  document.body.appendChild(iframe);

    window.read=function(){
    var t=location.href
    var t1
    t1=t.replace("https://www.airitilibrary.com/","https://0-www-airitilibrary-com.opac.lib.ntnu.edu.tw/");
    window.open(t1,"_self");

    };
    }
//asco
    else if(location.host.indexOf("ascopubs.org") > -1)
  {window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://login.elibrary.einsteinmed.edu/login';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = '2700004953';
usernameInput.name = 'user';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'CRAIN';
passwordInput.name = 'pass';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };}
//dbpia
    else if(location.host.indexOf("www.dbpia.co.kr") > -1)
{window.read=function(){
var url=location.href
var form = document.createElement('form');
form.name = 'formLogin';
form.method = 'post';
form.action = 'https://www.dbpia.co.kr/member/b2cLoginProc';

var eventTargetInput = document.createElement('input');
eventTargetInput.type = 'hidden';
eventTargetInput.value = url;
eventTargetInput.name = 'url';
form.appendChild(eventTargetInput);

var usernameInput = document.createElement('input');
usernameInput.type = 'hidden';
usernameInput.value = 'jiujiu0506';
usernameInput.name = 'userId';
form.appendChild(usernameInput);

var passwordInput = document.createElement('input');
passwordInput.type = 'hidden';
passwordInput.value = 'University2023%';
passwordInput.name = 'userPw';
form.appendChild(passwordInput);
document.body.appendChild(form);
form.submit();
    };};
})();