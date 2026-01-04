// ==UserScript==
// @name         下拉刷新
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用于在大多数页面的下卡刷新，少部分页面不可用
// @author       NONE
// @include      *
// @icon         none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432591/%E4%B8%8B%E6%8B%89%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/432591/%E4%B8%8B%E6%8B%89%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    const
/*等号后的数表示最小触发下拉距离(px)*/  min_dY = 300,
/*－－－－以下勿改－－－－*/
key=encodeURIComponent('下拉刷新:执行判断');if(window[key]){return;}try{window[key]=true;let strtX,strtY=0,rchTp,onePt=false;document.addEventListener('touchstart',function(e){if(onePt){rchTp=false;}else{onePt=true;rchTp=(document.body.scrollTop||document.documentElement.scrollTop)<50;strtX=e.touches[0].screenX;strtY=e.touches[0].screenY;}},{'passive':true});document.addEventListener('touchend',function(e){if(rchTp){const dY=Math.floor(e.changedTouches[0].screenY-strtY);if(dY>min_dY&&Math.abs(e.changedTouches[0].screenX-strtX)<(0.4*dY)){location.reload();}rchTp=false;}onePt=false;},{'passive':true,'capture':true});}catch(err){console.log('下拉刷新：',err);}
})();

