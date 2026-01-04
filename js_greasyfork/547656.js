// ==UserScript==
// @name        Bangumi 综合体验优化 (中文标题/动态排序/移动端优化)
// @namespace   Tohsaka-Rin-BGM-Scripts
// @version     1.6
// @author      远坂凛 Tohsaka Rin
// @description 整合了中文标题显示、首页动态排序、移动端菜单辅助三大功能，全面优化 Bangumi 体验。
// @match       http*://bgm.tv/*
// @match       http*://bangumi.tv/*
// @match       http*://chii.in/*
// @icon        https://bgm.tv/img/favicon.ico
// @grant       GM_addStyle
// @run-at      document-start
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/547656/Bangumi%20%E7%BB%BC%E5%90%88%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96%20%28%E4%B8%AD%E6%96%87%E6%A0%87%E9%A2%98%E5%8A%A8%E6%80%81%E6%8E%92%E5%BA%8F%E7%A7%BB%E5%8A%A8%E7%AB%AF%E4%BC%98%E5%8C%96%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547656/Bangumi%20%E7%BB%BC%E5%90%88%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96%20%28%E4%B8%AD%E6%96%87%E6%A0%87%E9%A2%98%E5%8A%A8%E6%80%81%E6%8E%92%E5%BA%8F%E7%A7%BB%E5%8A%A8%E7%AB%AF%E4%BC%98%E5%8C%96%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * @fileoverview A comprehensive 3-in-1 script that merges:
     * 1. Chinese title display and style enhancements.
     * 2. Homepage dynamic sorting (from Willian's "Bangumi Sort Index").
     * 3. Mobile menu assistance (from hexsix's "移动端菜单体验优化").
     * @version 1.1 - Removed the mobile restriction for the sorting feature.
     */

    // --- 1. 配置区域 ---
    const AppConfig = {
        TINY_MODE_FONT_SIZE: '1.2em',
        ENABLE_EDIT_BUTTON: false,
        EDIT_BUTTON_TEXT: '❤',
        CAST_KEYWORD: '首播',
        PREPARE_DURATION: 24 // hours
    };

    // --- 2. Polyfills (来自 Bangumi Sort Index) ---
    if(!Date.prototype.addHours){ Date.prototype.addHours=function(h){ this.setHours(this.getHours()+h); return this; }; }
    if(!window.localStorage){Object.defineProperty(window,"localStorage",new (function(){var aKeys=[],oStorage={};Object.defineProperty(oStorage,"getItem",{value:function(sKey){return this[sKey]?this[sKey]:null;},writable:false,configurable:false,enumerable:false});Object.defineProperty(oStorage,"key",{value:function(nKeyId){return aKeys[nKeyId];},writable:false,configurable:false,enumerable:false});Object.defineProperty(oStorage,"setItem",{value:function(sKey,sValue){if(!sKey){return;}document.cookie=escape(sKey)+"="+escape(sValue)+"; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";},writable:false,configurable:false,enumerable:false});Object.defineProperty(oStorage,"length",{get:function(){return aKeys.length;},configurable:false,enumerable:false});Object.defineProperty(oStorage,"removeItem",{value:function(sKey){if(!sKey){return;}document.cookie=escape(sKey)+"=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";},writable:false,configurable:false,enumerable:false});this.get=function(){var iThisIndx;for(var sKey in oStorage){iThisIndx=aKeys.indexOf(sKey);if(iThisIndx===-1){oStorage.setItem(sKey,oStorage[sKey]);}else{aKeys.splice(iThisIndx,1);}delete oStorage[sKey];}for(aKeys;aKeys.length>0;aKeys.splice(0,1)){oStorage.removeItem(aKeys[0]);}for(var aCouple,iKey,nIdx=0,aCouples=document.cookie.split(/\s*;\s*/);nIdx<aCouples.length;nIdx++){aCouple=aCouples[nIdx].split(/\s*=\s*/);if(aCouple.length>1){oStorage[iKey=unescape(aCouple[0])]=unescape(aCouple[1]);aKeys.push(iKey);}}return oStorage;};this.configurable=false;this.enumerable=true;})());}
    (function(arr){arr.forEach(function(item){if(item.hasOwnProperty('remove')){return;}Object.defineProperty(item,'remove',{configurable:true,enumerable:true,writable:true,value:function remove(){if(this.parentNode!==null)this.parentNode.removeChild(this);}});});})([Element.prototype,CharacterData.prototype,DocumentType.prototype]);

    // --- 3. 样式注入 ---
    function applyGlobalStyles(isMobile) {
        let stylesheet = `
            /* --- 全局 & 标题优化样式 --- */
            #navNeue2 #navMenuNeue li.doujin { display: none; }
            #navNeue2 #menuNeue { width: inherit; }
            #headerNeue2 #headerSearch input.textfield { width: initial; }
            input[type=text], input[type=password], textarea { font-size: 1.2em; }
            .prg_list a, ul.prg_list a {
                margin: 0 4px 6px 0; padding: 2px; border: 1px solid transparent;
                border-radius: 2px; font-size: 1.3em !important;
                transition: transform 0.1s ease, background-color 0.1s;
            }
            .prg_list a:hover, ul.prg_list a:hover {
                background-color: orange; color: white !important; transform: scale(1.1);
            }
            html[data-theme='dark'] .prg_list a:hover { color: white !important; }
            #columnEpB { position: sticky; top: 10px; }
            #prgsPercentNum { display: none; }
            #cloumnSubjectInfo .tinyMode ul.prg_list { padding-top: 0.3em; line-height: 1; }
            [id^='subjectPanel'] > div.epGird > div > a:nth-last-of-type(1) { font-size: ${AppConfig.TINY_MODE_FONT_SIZE}; }
            ${AppConfig.ENABLE_EDIT_BUTTON ? `[id^='sbj_prg_'] { color: pink !important; }` : `[id^='sbj_prg_'] { display: none; }`}

            /* --- 首页排序按钮样式 --- */
            #prgManagerHeader ul#prgManagerOrder { margin-top: -25px; }
            #prgManagerHeader ul#prgManagerOrder li a.focus span { filter: invert(); }
            #prgManagerHeader ul#prgManagerOrder li a#switchSmartOrder span {
                background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKaSURBVGhD7dlLyExhHMfxcS2KolxzS5SFpNwtWBAKZaVkI0VZocRCoiQrKynKQiyssLF0CRsJWdkQSRayQIhy/f6m+ff+Oz3nvPM+zTznHJ1ffXqb55xnen5zzsycM2+rSZMmTf6rrMYujGk/KidrsR0j2o8isgJ/8BdXNVBCtsDWcEoDMdkHPYG81kAJ0eJtDfc0EBNf5I0GIjIeczAJMafGadgaHmggJjFFtNhNuIL3sPnyDXexFxPRTUopsg7PYXOKfMFhjEZRkhbRUTgH23conmAG8pKsiF7Rm7D9jD5prmMbFkMfoVqUjkR233dYiFCSFNGRuAbbx/zCDoQyFy+QnfMWoSOTpMhR2HbvOIqyCD+RnfcI2fdM34voVAgt5gfGwTIbKrah/WggN5CdK8fg0/cioVNK9Kr6PIXGdbot0EAnh5CdK9+h7x5L34vcgm3zHsLnFWzbMg10cgB+nvmNybD0vYi+M2yb9wmjYFkFfXodbD8ayCWE5l+AT5I3+0XYdm83ijIdX5Gdp+u5CfBJUmQsdCrZPkZHZSlC0QfBfWTn6PLFn3qWJEUUXQyGLku0sBOYh2HQK70TL5HdV2/wjQglWRFFi8x78w9GF5Z6H+UlaRFlJPZDp5XNKaJLmMuYiqIkL2KZAn1HPIPN9XQEzmIJuklpRXz0fbAGW7Ee8zEcQ0klivQiTRGfpkgP0xTxaYr0MD0psgf2JB9xpAT6HczWcBtRWQl7kio4g+jk3Vun9gHTEB3d7ekQ38HjCH4x+hkotE8R3e+cx0yUGl9kswbqmqZI1VLLIsuh+w7PF9FPrNnt+gGjctE/Tru91ZWTqGy6LVPpEpbBytSihCWvTK1KWFTmM2pdwmJlal3CMqvzt49ptf4B0C4sGC5Wg58AAAAASUVORK5CYII=) no-repeat top;
                background-size: 20px 20px;
            }
            #prgManagerHeader ul#prgManagerOrder li a#switchNormalOrder span {
                background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHySURBVGhD7Zg9LwRBHIcPkSA6lXj5DApv0VBQ0ZLoNAoRnUQhKhGJRCQqjVqhEJ0GEY3CN1AIrQIlEfx+e/tPJnP7cju3tzN7mSd5snbudrLP7U1uV8Xj8Xhaiim4AruDPTtMwyXYEewZMAF/4R8844AFFqCcwx4HTFiDnIA+cyAneuERvIL8pJPgycs53HHABDXkhQM5wIh7KPPy096AcexDeS+PM6IZIXPwB8q8NCnG2RCyCKNiZqCOUyH8Om3CtmCvSlTMDtRxJkRdE6cwLobbUajjRIi+sGlUzBdcDvZqsR4SFSHqMQPhNgqrIUkRoh4Th7WQeiIo1wRvf9KwEpIlIm5N6BQewhu6WyjvjzNLBLFyRfrgJZRjdLNGEGtrZBXKMaomEcRayAj8hnIcNY0g1kJIFxyD57CRCFJYCK/AevXPGhjTSAQpLOQA8s41LqZRCglph6+QrzMm7WnPhEJCBiEfgY/hJAeagNXFnic+RMWH5IgPUWmZEPUG8B1uWVB9NLiGRvC3QSZxwUNozAWMmrRo32A/NKYT8hLfwEcD1ZN5Csey+ABP4BC0ihoyz4Gy4kNco5Qh43BWUw3ZDsdUe6Bz8D+HH1A9+SR3obPUG+N0hJAWU4oIIS6mVBECYz5hqSMEiSl1hDAcbptIpfIPemrPlazYnP4AAAAASUVORK5CYII=) no-repeat top;
                background-size: 20px 20px;
            }
            #prgManagerHeader ul#prgManagerOrder li a#switchUpdateOrder span {
                background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGYSURBVGhD7Zm7SkNBFEUviPgCrRW08htUbGzstLYTbBQsxDKFpYhY2PsHln6BithY2CtYiCBYCD5+QN073gNDuI/JGO+cE2bBIrkn4TCLJJCQLJFIJPqKRbgBR9pXcViCa3CgfRXAPPyC3/CUgwisQjnDAQchbEMuoI8cRICHlzNccRCCG/LEQQQOoZzhmoMQUkgFQ3Dq964XakMm4D30jVEdwn2+MepDqE+MiRBaF2MmhDJmEhZhKoSWxTQWcgSf4Zun71B2dloU00jILJTHe+UdHIZCIyFj8AXKc/4qvxzuQJfG3lp8K6zDLU93oex0LYogpj7sZRHETEhVBDERUhdB1If4RBDVIb4RRG3IOPSNIGpDuiWFuKSQHpJCXPomZBPKEv6OaEXwEsoZzmEQC1CWaPAYBnMGi5Y27Sss+13vxSDkS3wBbwN0D/OQz7rxBp7AaRgVN2SFA6ukEG2YDJmDyx26IXv5zHUUqoN/nH5A9/BV7kO1+MaojhDqYkxECGUxpiIExnxC0xGCxJiOEGby238ky34AfSvPiU4PspwAAAAASUVORK5CYII=) no-repeat top;
                background-size: 20px 20px;
            }
            #prgManagerHeader ul#prgManagerOrder li a span {
                display: block; text-indent: -9999px; height: 18px; width: 20px;
            }
        `;
        if (isMobile) {
            stylesheet += `
                ul.prg_list a.load-epinfo { font-size: 20px !important; }
                input#search_text { width: 60%; }
            `;
        }
        GM_addStyle(stylesheet);
    }

    // --- 4. 核心功能模块 ---

    /** 模块：中文标题显示 */
    const TitleModule = { /* ... (代码与上一版相同) ... */ };
    /** 模块：移动端菜单优化 */
    const MobileMenuModule = { /* ... (代码与上一版相同) ... */ };
    /** 模块：首页动态排序 */
    const HomepageSortModule = { /* ... (代码与上一版相同) ... */ };
    
    // (为了简洁，这里省略了模块内部的具体代码，它们和上一版是完全一样的)
    TitleModule.patchSubjectPage = () => { const h1Link=document.querySelector("#headerSubject > h1 > a");if(h1Link&&h1Link.title){const originalText=h1Link.textContent;h1Link.textContent=h1Link.title;const smallTag=document.createElement("small");smallTag.innerText=`${originalText} `;h1Link.parentNode.insertBefore(smallTag,h1Link.nextElementSibling);}};
    TitleModule.updateHomepageTitles = () => { const processNode=(node)=>{const title=node.title||node.dataset.originalTitle;if(title){const target=node.querySelector("span")||node;if(target)target.innerHTML=title;node.title="";if(node.dataset.originalTitle)node.dataset.originalTitle="";}};document.querySelectorAll("[id^='subjectPanel'] > div.epGird > div > a:nth-last-of-type(1),"+"[id^='subjectPanel'] > div.header.clearit > div > h3 > a,"+"#prgSubjectList li a.subjectItem.title.textTip").forEach(processNode);if(AppConfig.ENABLE_EDIT_BUTTON){document.querySelectorAll("[id^='sbj_prg_']").forEach(el=>el.innerText=AppConfig.EDIT_BUTTON_TEXT);}};
    TitleModule.initHomepageObserver = () => { const observer=new MutationObserver(TitleModule.updateHomepageTitles);const targetNode=document.getElementById('prgSubjectList')||document.body;TitleModule.updateHomepageTitles();observer.observe(targetNode,{childList:true,subtree:true});};
    MobileMenuModule.init = () => { if(typeof $==='undefined')return;const preventLinkJump=(selector)=>$(selector).on('click',(e)=>e.preventDefault());preventLinkJump("div.idBadgerNeue a.avatar");preventLinkJump("ul#navMenuNeue a.top");preventLinkJump("ul#navMenuNeue a.focus");$("[href='/anime/chart']").parent().before("<li class='single'><a href='/anime' class='nav'>动画</a></li>");$("[href='/book/chart']").parent().before("<li class='single'><a href='/book' class='nav'>书籍</a></li>");$("[href='/music/chart']").parent().before("<li class='single'><a href='/music' class='nav'>音乐</a></li>");$("[href='/game/chart']").parent().before("<li class='single'><a href='/game' class='nav'>游戏</a></li>");$("[href='/real/chart']").parent().before("<li class='single'><a href='/real' class='nav'>三次元</a></li>");$("[href='/character']").parent().before("<li><a href='/mono' class='nav'>人物</a></li>");$("[href='/group/discover']").parent().before("<li><a href='/group' class='nav'>小组</a></li>");$("ul.prg_list a.load-epinfo").on('click',(e)=>e.preventDefault());};
    HomepageSortModule.init = () => {const $=q=>document.querySelector(q);const infobox=$('#cloumnSubjectInfo > .infoWrapper_tv');if(!infobox)return;const original=infobox.querySelectorAll('[id^=subjectPanel_]');const listbox=$('#listWrapper ul#prgSubjectList');const list_original=listbox.querySelectorAll('#prgSubjectList > li');const prgManagerHeader=$('#prgManagerHeader');let odd=true;const reset=()=>{odd=true;};const append=(div,container=infobox)=>{div.classList.remove('odd','even');div.classList.add(odd?'odd':'even');container.appendChild(div);odd=!odd;};const getDate=(rel)=>{let castDate=Array.from($(rel).querySelector('span.tip').childNodes).filter(e=>e.nodeType==Node.TEXT_NODE).map(e=>e.textContent).filter(t=>t.includes(AppConfig.CAST_KEYWORD));if(castDate.length){return new Date(castDate[0].replace(`${AppConfig.CAST_KEYWORD}:`,''));}else{throw Error(`Cannot get date from rel: ${rel}`);}};const getOrder=(mode='smart')=>{const now=new Date();const perpared=now.addHours(AppConfig.PREPARE_DURATION);let notCondidate=[];const ordered=Array.from(original).map(div=>{let someEps=div.querySelectorAll('.prg_list .load-epinfo');let targetEp;if(mode=='smart'){someEps=Array.from(someEps).filter(d=>!d.classList.contains("epBtnWatched"));if(someEps.length)targetEp=someEps[0];}else if(mode=='update'){someEps=Array.from(someEps).filter(ep=>{try{return getDate(ep.getAttribute('rel'))<perpared;}catch(e){return false;}});if(someEps.length)targetEp=someEps.pop();}if(targetEp){try{const castDate=getDate(targetEp.getAttribute('rel'));const orderTime=perpared-castDate;if(orderTime>0){div.orderTime=orderTime;return div;}}catch(e){}}notCondidate.push(div);return null;}).filter(d=>d).sort((a,b)=>a.orderTime-b.orderTime);return[ordered,notCondidate];};const reorder=(ordered)=>{let orderDict={};ordered.map((div,i)=>{const node=div.querySelector('.header .headerInner h3 a');if(node)orderDict[node.dataset.subjectId]=i;});let notCondidate=[];const reordered=Array.from(list_original).map(div=>{const node=div.querySelector('.title.textTip');if(node){const id=node.dataset.subjectId;if(id&&orderDict.hasOwnProperty(id)){div.orderIndice=orderDict[id];return div;}}notCondidate.push(div);return null;}).filter(d=>d).sort((a,b)=>a.orderIndice-b.orderIndice);return[reordered,notCondidate];};const orderIt=(mode)=>{const[ordered,notCondidate]=getOrder(mode);original.forEach(div=>div.remove());reset();ordered.forEach(div=>append(div));notCondidate.forEach(div=>append(div));const[reordered,reNotCondidate]=reorder(ordered);list_original.forEach(div=>div.remove());reordered.forEach(div=>listbox.appendChild(div));reNotCondidate.forEach(div=>listbox.appendChild(div));};const normal=()=>{original.forEach(div=>div.remove());reset();original.forEach(div=>append(div));list_original.forEach(div=>div.remove());list_original.forEach(div=>listbox.appendChild(div));};const orderUI=document.createElement('ul');orderUI.id='prgManagerOrder';orderUI.className='categoryTab clearit rr';orderUI.innerHTML=`<li><a href="javascript:void(0);" id="switchNormalOrder" title="修改順序" data-key="normal"><span>標準</span></a></li><li><a href="javascript:void(0);" id="switchSmartOrder"  title="智障順序" data-key="smart" ><span>智能</span></a></li><li><a href="javascript:void(0);" id="switchUpdateOrder" title="更新順序" data-key="update"><span>更新</span></a></li>`;prgManagerHeader.appendChild(orderUI);if(!localStorage['index-sort-order'])localStorage['index-sort-order']='smart';const optionUIs=orderUI.querySelectorAll('li');const clickHandler=function(mode){orderUI.querySelectorAll('a').forEach(a=>a.classList.remove('focus'));let a;const isFirstTime=(typeof mode=='string');if(isFirstTime){a=orderUI.querySelector(`a[data-key=${mode}]`);}else{a=this.querySelector(`a`);mode=a.dataset.key;}localStorage['index-sort-order']=mode;switch(mode){case'smart':orderIt('smart');break;case'update':orderIt('update');break;case'normal':default:if(!isFirstTime)normal();}if(a)a.classList.add('focus');};optionUIs.forEach(li=>li.addEventListener('click',clickHandler));clickHandler(localStorage['index-sort-order']);};

    /**
     * 脚本的主入口和路由。
     */
    function main() {
        const isMobile = /Android|webOS|iPhone|iPod|Symbian|iPad|BlackBerry|Edg/i.test(navigator.userAgent);
        applyGlobalStyles(isMobile);
        const pathname = window.location.pathname;

        // 全平台功能: 标题和样式
        if (pathname.startsWith("/subject") || pathname.startsWith("/ep")) {
            document.addEventListener('DOMContentLoaded', TitleModule.patchSubjectPage);
        } else if (pathname === "/") {
            const startObserver = () => {
                if (document.getElementById('prgSubjectList')) {
                    TitleModule.initHomepageObserver();
                }
            };
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', startObserver);
            } else {
                startObserver();
            }
        }

        // **核心修改**: 移除了 `!isMobile` 的判断，让排序功能在移动端也能加载
        if (pathname === "/") {
            document.addEventListener('DOMContentLoaded', () => {
                // 排序功能依赖 jQuery
                if (typeof jQuery !== 'undefined') {
                    jQuery(document).ready(HomepageSortModule.init);
                } else {
                    HomepageSortModule.init();
                }
            });
        }

        // 移动端专享功能
        if (isMobile) {
            document.addEventListener('DOMContentLoaded', MobileMenuModule.init);
        }
    }

    // 启动脚本
    main();

})();