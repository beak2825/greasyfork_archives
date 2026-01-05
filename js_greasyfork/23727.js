// ==UserScript==
// @name         京东晒图助手
// @namespace    mudan_cn
// @version      0.11
// @description  京东评价晒图查看助手
// @author       mudan_cn
// @match        http*://item.jd.com/*
// @run-at      document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23727/%E4%BA%AC%E4%B8%9C%E6%99%92%E5%9B%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/23727/%E4%BA%AC%E4%B8%9C%E6%99%92%E5%9B%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
var a,ph,obs=new MutationObserver(function(recs){
    recs.map(function(rec){
        if((ph=$('.photo-wrap,.comments-showImgSwitch-photo-wrap')[0])){
            ph.insertBefore(a,ph.firstElementChild);
            obs.disconnect();
            obs=new MutationObserver(function(recs){
                recs.map(function(rec){
                    a.href=rec.target.src;
                });
            });
            obs.observe($('img.J-photo-img',ph)[0],{attributes:true});
            $('.J-cursor-left.cursor-left,.J-cursor-right.cursor-right',ph).each(function(i,e){
                e.style.width='100px';
                e.style.background='no-repeat center url(//static.360buyimg.com/item/main/1.0.28/css/i/pic-'+{left:'prev',right:'next'}[e.className.match(/left|right/)[0]]+'.cur)';
            });
        }
    });
});
obs.observe($('div.J-comments-list.comments-list.ETab,div#comments-list.m')[0],{'childList':true,'subtree':true});
(a=document.createElement('a')).setAttribute('style','float:left;position:absolute;z-index:4;font:bold 16px 微软雅黑;');
a.setAttribute('target','_blank');
a.innerHTML='源';