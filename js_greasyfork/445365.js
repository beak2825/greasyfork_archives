// ==UserScript==
// @name         IT之家首页清洁
// @namespace    https://greasyfork.org/zh-TW/scripts/445365
// @version      1.0.0
// @description  简化IT之家首页内容，只保留最新的文章列表
// @author       aSmecta
// @license      MIT
// @match        *://*.ithome.com/*
// @icon         https://ugmark.com/img/icons/favicon-32x32.png
// @supportURL   https://greasyfork.org/zh-TW/scripts/445365
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/445365/IT%E4%B9%8B%E5%AE%B6%E9%A6%96%E9%A1%B5%E6%B8%85%E6%B4%81.user.js
// @updateURL https://update.greasyfork.org/scripts/445365/IT%E4%B9%8B%E5%AE%B6%E9%A6%96%E9%A1%B5%E6%B8%85%E6%B4%81.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Custom Style
    var css=`
    #news{
    padding-top: 20px;
    padding-bottom: 25px;
    }
     #nnews,#dt .content{
     width: 100%;
     }
     #nav, #nav .fr{
     height:auto
     }
     ul.nl{
     width:46%;
     padding-top:0;
     margin-top:0;
     }
     ul.nl li a{
     width:calc(100% - 60px);
     }
     #nnews .t-f{
     margin-bottom:20px;
     }
     #tt, .ra, #nav .fl, #news .fl,.hotkeyword, div.bl.bb, #fls.bb, #cp.bb,#side_func a, .fr .t-h, footer,div.mt.so,#top #music,#dt .fr, .newsgrade, .shareto, .related_post, .dajia{
     display:none !important;
     }
     .article-share-code, .page-last, .page-next{
      display:none;
     }
     .fr{
     float:initial;
     }
     .cnbeta-update-list, .cnbeta-article{
     width:auto;
     }
     .pmsg{
        margin:0 auto;
      }
    `
    GM_addStyle(css)
    var ads = document.querySelectorAll('.ad');
    Array.from(ads).map(function(ad){
        ad.parentNode.style.display = 'none';
    })
    var itList = document.querySelectorAll('.t-b.clearfix');
    Array.from(itList).map(function(item) {
        item.classList.add('sel')
        document.querySelector('#n-p').style.display='none';
    });

    $("#nmsg").click(function(){
        location.reload()
    })
})();