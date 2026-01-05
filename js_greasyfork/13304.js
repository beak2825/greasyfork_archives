// ==UserScript==
// @name          zapIframesPropIde
// @description   zap all iframes Properties; 4 verification cycles; more efficient.
// @include       *
// @include  https://*
// @include  http://*
// @namespace     https://greasyfork.org/en/users/3561-lucianolll
// @namespace     https://openuserjs.org/users/lucianolll
// @version    15
// @grant     none
// @run-at document-end
// @author lucianolll
// @downloadURL https://update.greasyfork.org/scripts/13304/zapIframesPropIde.user.js
// @updateURL https://update.greasyfork.org/scripts/13304/zapIframesPropIde.meta.js
// ==/UserScript==
const gnfr={
zapifrprp(){
    const doc=document,ifra=doc.getElementsByTagName('iframe'); if(!ifra.length){return false;}
    const tmp=Array.from(ifra,s=>[s,s.parentNode]); tmp.reverse(); tmp.map(([f,p])=>p.removeChild(f));
  },
adtm(){[3000,9000,15000,21000].map(s=>setTimeout(gnfr.zapifrprp,s));},
adCodfr(){
	const  doc=document,rfb=doc.getElementsByTagName('body')[0],adscrip=doc.createElement('script');adscrip.setAttribute('axis','zapIframesProp');
adscrip.textContent=`const gnfr={ ${gnfr.zapifrprp}, ${gnfr.adtm},}; addEventListener('load',gnfr.zapifrprp,false);addEventListener('load',gnfr.adtm(),false);document.body.setAttribute('ondblclick','gnfr.zapifrprp()');` ;rfb.insertBefore(adscrip,rfb.lastChild);
},
};
   addEventListener('load',gnfr.zapifrprp,false);
   addEventListener('load',gnfr.adCodfr(),false);