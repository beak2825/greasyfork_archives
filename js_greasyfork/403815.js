// ==UserScript==
// @name         javbus 列表页关键字高亮
// @namespace    sbdx
// @version      2020.05.21
// @description  高亮关键字
// @author       sbdx
// @match        www.javbus.com/*
// @match        www.busdmm.one/*
// @match        www.dmmbus.cam/*
// @match        www.busdmm.work/*
// @match        www.dmmsee.cam/*
// @grant        GM_addStyle
// @homepageURL  https://greasyfork.org/zh-CN/scripts/403815-javbus-%E9%A1%B5%E9%9D%A2%E5%85%B3%E9%94%AE%E5%AD%97%E9%AB%98%E4%BA%AE
// @downloadURL https://update.greasyfork.org/scripts/403815/javbus%20%E5%88%97%E8%A1%A8%E9%A1%B5%E5%85%B3%E9%94%AE%E5%AD%97%E9%AB%98%E4%BA%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/403815/javbus%20%E5%88%97%E8%A1%A8%E9%A1%B5%E5%85%B3%E9%94%AE%E5%AD%97%E9%AB%98%E4%BA%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if($('div#waterfall').length)
    {
        //注入xcsoft插件
        window.xcsoft=window.xcsoft||{};xcsoft.tipsCss={height:"44px",fontSize:"16px"};xcsoft.tipsHide=xcsoft.tipsShow="fast";xcsoft.dom;xcsoft.timeout;xcsoft.loading=function(b){xcsoft.init(b,0,"loading",!0)};xcsoft.info=function(b,c){xcsoft.init(b,c||2500,"info")};xcsoft.error=function(b,c){xcsoft.init(b,c||2E3,"error")};xcsoft.success=function(b,c){xcsoft.init(b,c||1500,"success")};xcsoft.init=function(b,c,a,d){this.tipsHtml(b,a);$(this.dom).animate({top:0},this.tipsHide);clearTimeout(this.timeout);this.timeout=!d&&setTimeout(function(){xcsoft._hide()},c)};xcsoft._hide=function(){this.dom.stop().animate({top:"-"+xcsoft.tipsCss.height},this.tipsHide,"",function(){$(this).remove()})};xcsoft.tipsHtml=function(b,c){var a=$(".xctips");c=c||"info";0==a.length?(a=document.createElement("div"),a.className="xctips "+c,this.dom=$(a),this.dom.css(this.tipsCss),a.style.top="-"+this.tipsCss.height,a.style.height=this.tipsCss.height,a.style.lineHeight=this.tipsCss.height,a.innerHTML=b,$("body").append(this.dom)):(a.html(b),a.attr("class","xctips "+c),this.dom=a)};
        //注入xcsoft CSS
        GM_addStyle('.xctips{position:fixed; top:0; left:0; width:100%; height:44px; z-index:999; background:#3498db; color:#FFF; line-height:44px; text-align:center; vertical-align:middle; font-size:16px; transition:background .2s linear;-webkit-transition:background .2s linear; font-family: "Microsoft YaHei", "微软细黑", "微软雅黑 Light" , "微软雅黑", "Arial", "SimSun", "宋体";} .xctips.info{background:#3498db;} .xctips.success{background:#2ecc71;} .xctips.error{background:#ff9090;} .xctips.loading{background:#F93;}');

        const reg=/三上悠亜|三原ほのか|上原亜衣|楓カレン|明日花キララ|友田彩也香|君島みお|波多野|深田えいみ|本田岬|希島あいり|[23二三]穴|肛|アナル/i;    //关键字
        let countKeywords=0,s='',boolFind=false;
        //$('div.photo-info span').each(function(i){
        $('div.item .photo-frame img').each(function(i){
            //debugger;
            s=$(this).attr('title');
            //console.log(s);
            boolFind=reg.test(s);
            //console.log(boolFind);
            if(boolFind)
            {
                //console.log($(this).find('date:first').text());
                $(this).closest('div.item').css('background','red');
                countKeywords++;
            }
        });
        if(countKeywords)
        {
            xcsoft.error('共发现'+countKeywords+'个关键字！',2000);
        }
    }
})();