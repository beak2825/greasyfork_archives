// ==UserScript==
// @name          zapEmbedsRefer
// @description   replace all embeds for href option display
// @include       *
// @include  https://*
// @include  http://*
// @run-at   document-end
// @namespace     https://greasyfork.org/en/users/3561-lucianolll
// @namespace     https://openuserjs.org/users/lucianolll
// @namespace     http://userscripts-mirror.org/users/46776
// @version     16
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/3777/zapEmbedsRefer.user.js
// @updateURL https://update.greasyfork.org/scripts/3777/zapEmbedsRefer.meta.js
// ==/UserScript==
var codemp={
zapEmbedsref:function(){
	var doc=document,gemb=doc.getElementsByTagName('embed'),len=gemb.length;
  if(len!==0){
  var geb=function(gt){var g,gds=function(d){g=gt[d];return [g,g.parentNode];};return function(d){return gds(d);};}(gemb),
      embid=function(at){var t,ts=function(d){t=at[d];return [t.name,t.value];};return function(d){return ts(d);};};
   for(var m=len,j=0,tmp=[];m--;j++){tmp[j]=geb(j);}
   for(var i=len,embaj=[],att,embi,emba;i--;){
	att=tmp[i][0].attributes;embi=embid(att);
   for(j=att.length,emba=embaj[i]=[];j--;){emba[j]=embi(j);}
   }geb=null;embi=null;emba=null;
	var gem=[];embaj.forEach(
function(){
	var ads,repl=function(){var doc=document,ds=function(ad){ad.setAttribute('href','javascript:;');ad.setAttribute('onclick','replAdsC(this)');ad.style.position='relative';ad.textContent='em';return ad;};
  return function(){return ds(doc.createElement('a'));};}();
return function(v,i){ads=repl();v.forEach(function(d){ads.setAttribute(d[0],d[1]);});gem[i]=ads;};
}());embaj=null;
	tmp.forEach(function(v,i){v[1].replaceChild(gem[i],v[0]);});tmp=null;gem=null;
  }
},
zapobjt:function(){
	var doc=document,objt=doc.getElementsByTagName('object'),len=objt.length;
  if(len!==0){
  var embid=function(at){var t,ts=function(d){t=at[d];return [t.name,t.value];};return function(d){return ts(d);};};
    for(var j=len,n=0,p=0,q=0,obs,vrf,prm,frgm,objm=[],ptemp=[],qtemp=[],att,embi,embaj=[];j--;n++){
	obs=objt[n];vrf=obs.getElementsByTagName('a')===true;
  if(vrf){qtemp[q++]=obs;}
  if(!vrf){
	ptemp[p]=[obs,obs.parentNode];prm=obs.getElementsByTagName('param');frgm=doc.createDocumentFragment();
   for(var s=prm.length;s--;){frgm.appendChild(prm[s]);}
	objm[p]=frgm;p++;att=obs.attributes;embi=embid(att);frgm=null;
   for(var m=att.length,u=0,emba=embaj[n]=[];m--;u++){emba[u]=embi(u);}
  }
   }
  if(!vrf){
	var gem=[];embaj.forEach(
function(){
	var doc=document,ads,spn,repl=function(){var doc=document,ds=function(ad){ad.setAttribute('href','javascript:;');ad.setAttribute('onclick','replObjM(this)');ad.style.position='relative';ad.textContent='emi';return ad;};
  return function(){return ds(doc.createElement('a'));};}();
return function(v,i){
	ads=repl();spn=doc.createElement('span');
	v.forEach(function(d){ads.setAttribute(d[0],d[1]);});spn.appendChild(objm[i]);ads.appendChild(spn);gem[i]=ads;
   };}());embaj=null;objm=null;ads=null;
	ptemp.forEach(function(v,i){v[1].replaceChild(gem[i],v[0]);});ptemp=null;gem=null;
  }
  if(vrf){
   for(var i=qtemp.length,obst,prmo;i--;){
	obst=qtemp[i];obs.data='';prmo=obst.getElementsByTagName('param');
   for(var a=obs.attributes.length;a--;){obst.removeAttribute(obst.attributes[a].name);}
   for(var t=prmo.length,pa,tmp=[];t--;){pa=prmo[t];tmp[t]=[pa,pa.parentNode];}
	tmp.forEach(function(v){v[1].removeChild(v[0]);});tmp=null;
   }
  }
  }
},
replAdsC:function replAdsC(obj){
	var attr=obj.attributes,ademb=document.createElement('embed');
   for(var i=attr.length,as,adm=[];i--;){as=attr[i];adm[i]=[as.name,as.value];}attr=null;
	adm.forEach(function(v){ademb.setAttribute(v[0],v[1]);});adm=null;ademb.removeAttribute('href');ademb.removeAttribute('onclick');
	obj.parentNode.replaceChild(ademb,obj);
},
replObjM:function replObjM(obj){
	var doc=document,attr=obj.attributes,ln=attr.length,prm=obj.getElementsByTagName('param'),ademb=doc.createElement('object'),frgm=doc.createDocumentFragment();
   for(var i=ln,as,adm=[];i--;){as=attr[i];adm[i]=[as.name,as.value];}attr=null;
	adm.forEach(function(v){ademb.setAttribute(v[0],v[1]);});adm=null;ademb.removeAttribute('href');ademb.removeAttribute('onclick');
   for(var s=prm.length;s--;){frgm.appendChild(prm[s]);}
	ademb.appendChild(frgm);prm=null;frgm=null;
	obj.parentNode.replaceChild(ademb,obj);
},
adscr:function(){
  var doc=document,adscript=doc.createElement('script');adscript.textContent=[this.replAdsC,this.replObjM].join('');doc.getElementsByTagName('body')[0].appendChild(adscript);
}
};
  addEventListener('load',codemp.zapEmbedsref,false);addEventListener('load',codemp.zapobjt,false);addEventListener('load',codemp.adscr(),false);
/*addEventListener('load',codemp.zapEmbedsref(),codemp.zapobjt(),codemp.adscr(),false);*/
/*addEventListener('load',codemp.zapEmbedsref(),false);addEventListener('load',codemp.zapobjt(),false);addEventListener('load',codemp.adscr(),false);*/