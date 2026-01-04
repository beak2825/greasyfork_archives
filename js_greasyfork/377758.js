// ==UserScript==
// @name         搜索时排除百家号站点
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  使用百度搜索时排除百家号站点
// @author       wymix
// @home-url     https://greasyfork.org/zh-TW/scripts/377758
// @include      http://www.baidu.com/*
// @include      https://www.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377758/%E6%90%9C%E7%B4%A2%E6%97%B6%E6%8E%92%E9%99%A4%E7%99%BE%E5%AE%B6%E5%8F%B7%E7%AB%99%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/377758/%E6%90%9C%E7%B4%A2%E6%97%B6%E6%8E%92%E9%99%A4%E7%99%BE%E5%AE%B6%E5%8F%B7%E7%AB%99%E7%82%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var holder=' -(site:#)';

    var blocksites=['baijiahao.baidu.com']

    var placeHolder='';

    for(var j=blocksites.length-1;j>-1;j--){
        placeHolder+= holder.replace('#',blocksites[j]);
    }
    var title=document.getElementsByTagName('title')[0]
    title.innerText=title.innerText.replace(placeHolder,'')
    var un=document.getElementById('s_username_top')
    var style='width: 480px!important;padding-right: 50px!important;padding: 10px 9px 10px 7px;border: 0;background-image: none;height: 20px;line-height: 20px;-webkit-box-shadow: 0 1px 3px rgba(0,0,0,0.2);-moz-box-shadow: 0 1px 3px rgba(0,0,0,0.2);'
    var kw=document.getElementById('kw');
    kw.style.cssText='display:none;';
    var xgss=document.getElementById('rs_top_new');
    if(xgss!=null){
        var as= xgss.getElementsByTagName('a');
        for(var i=0;i<as.length;i++){
            rebuildRs(as[i]);
        }
    }
    xgss=document.getElementById('rs');
    if(xgss!=null){
        as= xgss.getElementsByTagName('a');
        for(i=0;i<as.length;i++){
            rebuildRs(as[i]);
        }
    }
    var su=document.getElementById('su');
    var span=document.getElementsByClassName('bg s_ipt_wr quickdelete-wrap')[0];
    var kw_s=document.createElement("input");
    kw_s.id='kw_s';
    kw_s.name='wd_s';
    kw_s.className='s_ipt';
    kw_s.maxLength=255;
    kw_s.autocomplete='off';
    if(un)
        kw_s.style.cssText=style;
    kw_s.value=kw.value.replace(placeHolder,'');
    span.appendChild(kw_s);
    su.addEventListener('click',addCondition);

    function rebuildRs(a){
        var temp=encodeURI(placeHolder)
        a.href='https://www.baidu.com/s?wd='+a.innerText+temp
    }
    function addCondition(){
        kw.value=kw_s.value;
        if(kw.value.indexOf(placeHolder)==-1){
            kw.value=kw.value+placeHolder;
        }
    }
})();