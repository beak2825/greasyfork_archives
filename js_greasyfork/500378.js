// ==UserScript==
// @name         有道Web优化为App
// @namespace    Qcbf
// @version      0.0.2
// @description  优化有道网页，将他改为更适合app的形式
// @author       Qcbf
// @match        dict.youdao.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youdao.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500378/%E6%9C%89%E9%81%93Web%E4%BC%98%E5%8C%96%E4%B8%BAApp.user.js
// @updateURL https://update.greasyfork.org/scripts/500378/%E6%9C%89%E9%81%93Web%E4%BC%98%E5%8C%96%E4%B8%BAApp.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function RemoveElement(el){
        Element(el, (el)=>el.remove());
    }

    function Element(el, func){
        if (typeof el === "string"){
            el = document.querySelector(el);
        }
        try {
            if (el != null)
                func(el);
        } catch (error) {
            console.log(error)
        }
    }

    window.onfocus = function() {
        let ipt = document.querySelector("#search_input");
        ipt.focus();
        window.scrollTo(0,0);
        setTimeout(()=>{
            ipt.select();
        }, 100);
    };
    window.onblur = function() {
        localStorage.removeItem("historyList");
    };

    setTimeout(function(){
        Element("#autosuggest-autosuggest__results", el => el.style.pointerEvents = "none");
        RemoveElement(".top-banner-wrap");
    }, 500);

    if (window.location.href === 'https://dict.youdao.com/') {
        window.location.href = 'https://dict.youdao.com/result?word=.&lang=en';
        return;
    }

    RemoveElement(".feedbackBtn");
    RemoveElement(".small-logo");
    RemoveElement(".footer_container");
    RemoveElement(".top_nav-con");
    RemoveElement(".dict_indexes-con");
    Element(".search_result-dict", el => el.style.width = "100%");
    Element(".lang_select-con", el => el.style.width = "100%");
    Element(".input_con-fixed", el => el.style.padding = "0px");
    Element(".search_result.center_container", el => el.style.margin = "0px");
    Element(".fixed-wrap.center_container", el => el.style.margin="auto");
    Element("#searchLayout", el=>el.style.minWidth = "auto");
    document.head.insertAdjacentHTML('beforeend', `<style>
.search_page .search_result[data-v-727a0d14] { margin-top:0px !important}
.center_container { width: auto;min-width:auto; }
.simple { margin-left:0px; }
.search_page .input_con-fixed[data-v-727a0d14] { min-width:0px; position:relative !important}
.simple .word-exp .trans[data-v-8042e1b4] { font-size:12px; line-height:inherit; }
.search_page .word-head .phone_con { margin:0px; }
.search_page .per-phone { margin-bottom:0px; }
.search_page .word-head .title{margin-bottom:0px}
.simple .exam_type[data-v-8042e1b4]{margin:0px;}
.search_page .trans-container p{margin:0px;margin-bottom:0px;margin-top:0px;}
.catalogue_author .dict-tabs[data-v-08c0bb43]{margin:0px;margin-bottom:0px;margin-top:0px;height:16px;}
.per-phone{margin:0px;}
        </style>`);
})();
