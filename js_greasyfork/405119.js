// ==UserScript==
// @name         Skip Netflix and Prime
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Skip Netflix Intro/Next and Amazon Ad/Intro/Next
// @author       Therrom
// @match *://*.netflix.com/*
// @match *://*.netflix.co.uk/*
// @match *://*.netflix.ar/*
// @match *://*.netflix.au/*
// @match *://*.netflix.br/*
// @match *://*.netflix.ca/*
// @match *://*.netflix.fr/*
// @match *://*.netflix.de/*
// @match *://*.netflix.cz/*
// @match *://*.netflix.hk/*
// @match *://*.netflix.in/*
// @match *://*.netflix.jp/*
// @match *://*.netflix.lt/*
// @match *://*.netflix.no/*
// @match *://*.netflix.nl/*
// @match *://*.netflix.pl/*
// @match *://*.netflix.ru/*
// @match *://*.netflix.sg/*
// @match *://*.netflix.sk/*
// @match *://*.netflix.es/*
// @match *://*.primevideo.com/*
// @match *://*.amazon.com/*
// @match *://amazon.com/*
// @match *://*.amazon.co.uk/*
// @match *://amazon.co.uk/*
// @match *://*.amazon.ac/*
// @match *://amazon.ac/*
// @match *://*.amazon.ad/*
// @match *://amazon.ad/*
// @match *://*.amazon.ae/*
// @match *://amazon.ae/*
// @match *://*.amazon.af/*
// @match *://amazon.af/*
// @match *://*.amazon.ag/*
// @match *://amazon.ag/*
// @match *://*.amazon.ai/*
// @match *://amazon.ai/*
// @match *://*.amazon.al/*
// @match *://amazon.al/*
// @match *://*.amazon.am/*
// @match *://amazon.am/*
// @match *://*.amazon.ao/*
// @match *://amazon.ao/*
// @match *://*.amazon.aq/*
// @match *://amazon.aq/*
// @match *://*.amazon.ar/*
// @match *://amazon.ar/*
// @match *://*.amazon.as/*
// @match *://amazon.as/*
// @match *://*.amazon.at/*
// @match *://amazon.at/*
// @match *://*.amazon.au/*
// @match *://amazon.au/*
// @match *://*.amazon.aw/*
// @match *://amazon.aw/*
// @match *://*.amazon.ax/*
// @match *://amazon.ax/*
// @match *://*.amazon.az/*
// @match *://amazon.az/*
// @match *://*.amazon.ba/*
// @match *://amazon.ba/*
// @match *://*.amazon.bb/*
// @match *://amazon.bb/*
// @match *://*.amazon.bd/*
// @match *://amazon.bd/*
// @match *://*.amazon.be/*
// @match *://amazon.be/*
// @match *://*.amazon.bf/*
// @match *://amazon.bf/*
// @match *://*.amazon.bg/*
// @match *://amazon.bg/*
// @match *://*.amazon.bh/*
// @match *://amazon.bh/*
// @match *://*.amazon.bi/*
// @match *://amazon.bi/*
// @match *://*.amazon.bj/*
// @match *://amazon.bj/*
// @match *://*.amazon.bm/*
// @match *://amazon.bm/*
// @match *://*.amazon.bn/*
// @match *://amazon.bn/*
// @match *://*.amazon.bo/*
// @match *://amazon.bo/*
// @match *://*.amazon.br/*
// @match *://amazon.br/*
// @match *://*.amazon.bs/*
// @match *://amazon.bs/*
// @match *://*.amazon.bt/*
// @match *://amazon.bt/*
// @match *://*.amazon.bw/*
// @match *://amazon.bw/*
// @match *://*.amazon.by/*
// @match *://amazon.by/*
// @match *://*.amazon.bz/*
// @match *://amazon.bz/*
// @match *://*.amazon.ca/*
// @match *://amazon.ca/*
// @match *://*.amazon.cc/*
// @match *://amazon.cc/*
// @match *://*.amazon.cd/*
// @match *://amazon.cd/*
// @match *://*.amazon.cf/*
// @match *://amazon.cf/*
// @match *://*.amazon.cg/*
// @match *://amazon.cg/*
// @match *://*.amazon.ch/*
// @match *://amazon.ch/*
// @match *://*.amazon.ci/*
// @match *://amazon.ci/*
// @match *://*.amazon.ck/*
// @match *://amazon.ck/*
// @match *://*.amazon.cl/*
// @match *://amazon.cl/*
// @match *://*.amazon.cm/*
// @match *://amazon.cm/*
// @match *://*.amazon.cn/*
// @match *://amazon.cn/*
// @match *://*.amazon.co/*
// @match *://amazon.co/*
// @match *://*.amazon.cr/*
// @match *://amazon.cr/*
// @match *://*.amazon.cu/*
// @match *://amazon.cu/*
// @match *://*.amazon.cv/*
// @match *://amazon.cv/*
// @match *://*.amazon.cw/*
// @match *://amazon.cw/*
// @match *://*.amazon.cx/*
// @match *://amazon.cx/*
// @match *://*.amazon.cy/*
// @match *://amazon.cy/*
// @match *://*.amazon.cz/*
// @match *://amazon.cz/*
// @match *://*.amazon.de/*
// @match *://amazon.de/*
// @match *://*.amazon.dj/*
// @match *://amazon.dj/*
// @match *://*.amazon.dk/*
// @match *://amazon.dk/*
// @match *://*.amazon.dm/*
// @match *://amazon.dm/*
// @match *://*.amazon.do/*
// @match *://amazon.do/*
// @match *://*.amazon.dz/*
// @match *://amazon.dz/*
// @match *://*.amazon.ec/*
// @match *://amazon.ec/*
// @match *://*.amazon.ee/*
// @match *://amazon.ee/*
// @match *://*.amazon.eg/*
// @match *://amazon.eg/*
// @match *://*.amazon.er/*
// @match *://amazon.er/*
// @match *://*.amazon.es/*
// @match *://amazon.es/*
// @match *://*.amazon.et/*
// @match *://amazon.et/*
// @match *://*.amazon.eu/*
// @match *://amazon.eu/*
// @match *://*.amazon.fi/*
// @match *://amazon.fi/*
// @match *://*.amazon.fj/*
// @match *://amazon.fj/*
// @match *://*.amazon.fk/*
// @match *://amazon.fk/*
// @match *://*.amazon.fm/*
// @match *://amazon.fm/*
// @match *://*.amazon.fo/*
// @match *://amazon.fo/*
// @match *://*.amazon.fr/*
// @match *://amazon.fr/*
// @match *://*.amazon.ga/*
// @match *://amazon.ga/*
// @match *://*.amazon.gd/*
// @match *://amazon.gd/*
// @match *://*.amazon.ge/*
// @match *://amazon.ge/*
// @match *://*.amazon.gf/*
// @match *://amazon.gf/*
// @match *://*.amazon.gg/*
// @match *://amazon.gg/*
// @match *://*.amazon.gh/*
// @match *://amazon.gh/*
// @match *://*.amazon.gi/*
// @match *://amazon.gi/*
// @match *://*.amazon.gl/*
// @match *://amazon.gl/*
// @match *://*.amazon.gm/*
// @match *://amazon.gm/*
// @match *://*.amazon.gn/*
// @match *://amazon.gn/*
// @match *://*.amazon.gp/*
// @match *://amazon.gp/*
// @match *://*.amazon.gq/*
// @match *://amazon.gq/*
// @match *://*.amazon.gr/*
// @match *://amazon.gr/*
// @match *://*.amazon.gs/*
// @match *://amazon.gs/*
// @match *://*.amazon.gt/*
// @match *://amazon.gt/*
// @match *://*.amazon.gu/*
// @match *://amazon.gu/*
// @match *://*.amazon.gw/*
// @match *://amazon.gw/*
// @match *://*.amazon.gy/*
// @match *://amazon.gy/*
// @match *://*.amazon.hk/*
// @match *://amazon.hk/*
// @match *://*.amazon.hm/*
// @match *://amazon.hm/*
// @match *://*.amazon.hn/*
// @match *://amazon.hn/*
// @match *://*.amazon.hr/*
// @match *://amazon.hr/*
// @match *://*.amazon.ht/*
// @match *://amazon.ht/*
// @match *://*.amazon.hu/*
// @match *://amazon.hu/*
// @match *://*.amazon.id/*
// @match *://amazon.id/*
// @match *://*.amazon.ie/*
// @match *://amazon.ie/*
// @match *://*.amazon.il/*
// @match *://amazon.il/*
// @match *://*.amazon.im/*
// @match *://amazon.im/*
// @match *://*.amazon.in/*
// @match *://amazon.in/*
// @match *://*.amazon.io/*
// @match *://amazon.io/*
// @match *://*.amazon.iq/*
// @match *://amazon.iq/*
// @match *://*.amazon.ir/*
// @match *://amazon.ir/*
// @match *://*.amazon.is/*
// @match *://amazon.is/*
// @match *://*.amazon.it/*
// @match *://amazon.it/*
// @match *://*.amazon.je/*
// @match *://amazon.je/*
// @match *://*.amazon.jm/*
// @match *://amazon.jm/*
// @match *://*.amazon.jo/*
// @match *://amazon.jo/*
// @match *://*.amazon.jp/*
// @match *://amazon.jp/*
// @match *://*.amazon.ke/*
// @match *://amazon.ke/*
// @match *://*.amazon.kg/*
// @match *://amazon.kg/*
// @match *://*.amazon.kh/*
// @match *://amazon.kh/*
// @match *://*.amazon.ki/*
// @match *://amazon.ki/*
// @match *://*.amazon.km/*
// @match *://amazon.km/*
// @match *://*.amazon.kn/*
// @match *://amazon.kn/*
// @match *://*.amazon.kp/*
// @match *://amazon.kp/*
// @match *://*.amazon.kr/*
// @match *://amazon.kr/*
// @match *://*.amazon.kw/*
// @match *://amazon.kw/*
// @match *://*.amazon.ky/*
// @match *://amazon.ky/*
// @match *://*.amazon.kz/*
// @match *://amazon.kz/*
// @match *://*.amazon.la/*
// @match *://amazon.la/*
// @match *://*.amazon.lb/*
// @match *://amazon.lb/*
// @match *://*.amazon.lc/*
// @match *://amazon.lc/*
// @match *://*.amazon.li/*
// @match *://amazon.li/*
// @match *://*.amazon.lk/*
// @match *://amazon.lk/*
// @match *://*.amazon.lr/*
// @match *://amazon.lr/*
// @match *://*.amazon.ls/*
// @match *://amazon.ls/*
// @match *://*.amazon.lt/*
// @match *://amazon.lt/*
// @match *://*.amazon.lu/*
// @match *://amazon.lu/*
// @match *://*.amazon.lv/*
// @match *://amazon.lv/*
// @match *://*.amazon.ly/*
// @match *://amazon.ly/*
// @match *://*.amazon.ma/*
// @match *://amazon.ma/*
// @match *://*.amazon.mc/*
// @match *://amazon.mc/*
// @match *://*.amazon.md/*
// @match *://amazon.md/*
// @match *://*.amazon.me/*
// @match *://amazon.me/*
// @match *://*.amazon.mg/*
// @match *://amazon.mg/*
// @match *://*.amazon.mh/*
// @match *://amazon.mh/*
// @match *://*.amazon.mk/*
// @match *://amazon.mk/*
// @match *://*.amazon.ml/*
// @match *://amazon.ml/*
// @match *://*.amazon.mm/*
// @match *://amazon.mm/*
// @match *://*.amazon.mn/*
// @match *://amazon.mn/*
// @match *://*.amazon.mo/*
// @match *://amazon.mo/*
// @match *://*.amazon.mp/*
// @match *://amazon.mp/*
// @match *://*.amazon.mq/*
// @match *://amazon.mq/*
// @match *://*.amazon.mr/*
// @match *://amazon.mr/*
// @match *://*.amazon.ms/*
// @match *://amazon.ms/*
// @match *://*.amazon.mt/*
// @match *://amazon.mt/*
// @match *://*.amazon.mu/*
// @match *://amazon.mu/*
// @match *://*.amazon.mv/*
// @match *://amazon.mv/*
// @match *://*.amazon.mw/*
// @match *://amazon.mw/*
// @match *://*.amazon.mx/*
// @match *://amazon.mx/*
// @match *://*.amazon.my/*
// @match *://amazon.my/*
// @match *://*.amazon.mz/*
// @match *://amazon.mz/*
// @match *://*.amazon.na/*
// @match *://amazon.na/*
// @match *://*.amazon.nc/*
// @match *://amazon.nc/*
// @match *://*.amazon.ne/*
// @match *://amazon.ne/*
// @match *://*.amazon.nf/*
// @match *://amazon.nf/*
// @match *://*.amazon.ng/*
// @match *://amazon.ng/*
// @match *://*.amazon.ni/*
// @match *://amazon.ni/*
// @match *://*.amazon.nl/*
// @match *://amazon.nl/*
// @match *://*.amazon.no/*
// @match *://amazon.no/*
// @match *://*.amazon.np/*
// @match *://amazon.np/*
// @match *://*.amazon.nr/*
// @match *://amazon.nr/*
// @match *://*.amazon.nu/*
// @match *://amazon.nu/*
// @match *://*.amazon.nz/*
// @match *://amazon.nz/*
// @match *://*.amazon.om/*
// @match *://amazon.om/*
// @match *://*.amazon.pa/*
// @match *://amazon.pa/*
// @match *://*.amazon.pe/*
// @match *://amazon.pe/*
// @match *://*.amazon.pf/*
// @match *://amazon.pf/*
// @match *://*.amazon.pg/*
// @match *://amazon.pg/*
// @match *://*.amazon.ph/*
// @match *://amazon.ph/*
// @match *://*.amazon.pk/*
// @match *://amazon.pk/*
// @match *://*.amazon.pl/*
// @match *://amazon.pl/*
// @match *://*.amazon.pm/*
// @match *://amazon.pm/*
// @match *://*.amazon.pn/*
// @match *://amazon.pn/*
// @match *://*.amazon.pr/*
// @match *://amazon.pr/*
// @match *://*.amazon.ps/*
// @match *://amazon.ps/*
// @match *://*.amazon.pt/*
// @match *://amazon.pt/*
// @match *://*.amazon.pw/*
// @match *://amazon.pw/*
// @match *://*.amazon.py/*
// @match *://amazon.py/*
// @match *://*.amazon.qa/*
// @match *://amazon.qa/*
// @match *://*.amazon.re/*
// @match *://amazon.re/*
// @match *://*.amazon.ro/*
// @match *://amazon.ro/*
// @match *://*.amazon.rs/*
// @match *://amazon.rs/*
// @match *://*.amazon.ru/*
// @match *://amazon.ru/*
// @match *://*.amazon.rw/*
// @match *://amazon.rw/*
// @match *://*.amazon.sa/*
// @match *://amazon.sa/*
// @match *://*.amazon.sb/*
// @match *://amazon.sb/*
// @match *://*.amazon.sc/*
// @match *://amazon.sc/*
// @match *://*.amazon.sd/*
// @match *://amazon.sd/*
// @match *://*.amazon.se/*
// @match *://amazon.se/*
// @match *://*.amazon.sg/*
// @match *://amazon.sg/*
// @match *://*.amazon.sh/*
// @match *://amazon.sh/*
// @match *://*.amazon.si/*
// @match *://amazon.si/*
// @match *://*.amazon.sk/*
// @match *://amazon.sk/*
// @match *://*.amazon.sl/*
// @match *://amazon.sl/*
// @match *://*.amazon.sm/*
// @match *://amazon.sm/*
// @match *://*.amazon.sn/*
// @match *://amazon.sn/*
// @match *://*.amazon.so/*
// @match *://amazon.so/*
// @match *://*.amazon.sr/*
// @match *://amazon.sr/*
// @match *://*.amazon.ss/*
// @match *://amazon.ss/*
// @match *://*.amazon.st/*
// @match *://amazon.st/*
// @match *://*.amazon.su/*
// @match *://amazon.su/*
// @match *://*.amazon.sv/*
// @match *://amazon.sv/*
// @match *://*.amazon.sx/*
// @match *://amazon.sx/*
// @match *://*.amazon.sy/*
// @match *://amazon.sy/*
// @match *://*.amazon.sz/*
// @match *://amazon.sz/*
// @match *://*.amazon.tc/*
// @match *://amazon.tc/*
// @match *://*.amazon.td/*
// @match *://amazon.td/*
// @match *://*.amazon.tf/*
// @match *://amazon.tf/*
// @match *://*.amazon.tg/*
// @match *://amazon.tg/*
// @match *://*.amazon.th/*
// @match *://amazon.th/*
// @match *://*.amazon.tj/*
// @match *://amazon.tj/*
// @match *://*.amazon.tk/*
// @match *://amazon.tk/*
// @match *://*.amazon.tl/*
// @match *://amazon.tl/*
// @match *://*.amazon.tm/*
// @match *://amazon.tm/*
// @match *://*.amazon.tn/*
// @match *://amazon.tn/*
// @match *://*.amazon.to/*
// @match *://amazon.to/*
// @match *://*.amazon.tr/*
// @match *://amazon.tr/*
// @match *://*.amazon.tt/*
// @match *://amazon.tt/*
// @match *://*.amazon.tv/*
// @match *://amazon.tv/*
// @match *://*.amazon.tw/*
// @match *://amazon.tw/*
// @match *://*.amazon.tz/*
// @match *://amazon.tz/*
// @match *://*.amazon.ua/*
// @match *://amazon.ua/*
// @match *://*.amazon.ug/*
// @match *://amazon.ug/*
// @match *://*.amazon.uk/*
// @match *://amazon.uk/*
// @match *://*.amazon.us/*
// @match *://amazon.us/*
// @match *://*.amazon.uy/*
// @match *://amazon.uy/*
// @match *://*.amazon.uz/*
// @match *://amazon.uz/*
// @match *://*.amazon.va/*
// @match *://amazon.va/*
// @match *://*.amazon.vc/*
// @match *://amazon.vc/*
// @match *://*.amazon.ve/*
// @match *://amazon.ve/*
// @match *://*.amazon.vg/*
// @match *://amazon.vg/*
// @match *://*.amazon.vi/*
// @match *://amazon.vi/*
// @match *://*.amazon.vn/*
// @match *://amazon.vn/*
// @match *://*.amazon.vu/*
// @match *://amazon.vu/*
// @match *://*.amazon.wf/*
// @match *://amazon.wf/*
// @match *://*.amazon.ws/*
// @match *://amazon.ws/*
// @match *://*.amazon.ye/*
// @match *://amazon.ye/*
// @match *://*.amazon.yt/*
// @match *://amazon.yt/*
// @match *://*.amazon.za/*
// @match *://amazon.za/*
// @match *://*.amazon.zm/*
// @match *://amazon.zm/*
// @match *://*.amazon.zw/*
// @match *://amazon.zw/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405119/Skip%20Netflix%20and%20Prime.user.js
// @updateURL https://update.greasyfork.org/scripts/405119/Skip%20Netflix%20and%20Prime.meta.js
// ==/UserScript==

const NETFLIX = 'netflix';
const PRIME = 'prime';

const elementMapping = [{
  type: NETFLIX,
  selector: "[aria-label='Skip Intro']",
  id: "netflixIntro",
  skip: true
},{
  type: NETFLIX,
  selector: "[aria-label='Skip Recap']",
  id: "netflixRecap",
  skip: true
},{
  type: PRIME,
  selector: ".skipElement",
  textSelector: "Rückblick überspringen",
  id: "primeRecap",
  skip: true
},{
  type: PRIME,
  selector: ".adSkipButton",
  textSelector: "Überspringen",
  id: "primeAd",
  skip: true
},{
  type: PRIME,
  selector: ".nextUpCard",
  id: "primeNext",
  skip: true
}];

(function() {
    'use strict';

    setInterval(() => skipNetflixAndPrime(), 1000);
})();

function skipNetflixAndPrime() {
  const skipButton = fetchDomNode(elementMapping);

  if(!skipButton || !skipButton.skip) {
    return;
  }

  const { domNode, type, selector, id } = skipButton;

  if(domNode) {
    if(selector === '.nextUpCard') {
      setTimeout(800, function() {
          domNode.click();
      });
    } else {
        domNode.click();
    }
  }
}


function fetchDomNode(elements) {
  for(const element of elements) {
    var domNode = document.querySelector(element.selector);
    if (!domNode && element.textSelector) {
      domNode = document.evaluate('//div[text()="' + element.textSelector + '"]',document, null, XPathResult.ANY_TYPE, null ).iterateNext();
    }

    if(domNode) {
      return {
        ...element,
        domNode
      };
    }
  }
}

