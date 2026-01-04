// ==UserScript==
// @name         ykm_csdn_save
// @namespace    csdn
// @version      0.3
// @description  去除csdn 不喜欢的模块
// @author       ykm
// @match        https://blog.csdn.net/*/article/details/*
// @grant        GM_addStyle
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/462332/ykm_csdn_save.user.js
// @updateURL https://update.greasyfork.org/scripts/462332/ykm_csdn_save.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`
   body{
   background:url('https://img6.bdstatic.com/img/image/pcindex/sunjunpchuazhoutu.JPG') no-repeat;
   background-repeat: no-repeat;
   background-size:cover;
   background-attachment: fixed;
   background-position: center;
    }
    .programmer1Box{
        display:none;
    }
    #kp_box_479{
        display:none;
    }
    .toolbar-container-right{
        display:none;
    }
    .template-box{
        display:none;
    }
    #asideNewComments{
        display:none;
    }
    .csdn-side-toolbar{
        display:none;
    }
     .aside-box-footer{
        display:none;
    }
      .archive-box{
        display:none;
    }
     #recommendNps{
        display:none;
    }
     .blog_container_aside{
        display:none;
    }
    #csdn-toolbar{
        display:none;
    }
    .recommend-right_aside{
        display:none;
    }
    #copyright-box{
        display:none;
    }
    #pcCommentBox{
        display:none;
    }
    .content-box{
        display:none;
    }
     .more-toolbox-new{
        display:none;
    }
    .article-info-box{
        display:none;
    }
    ` )
    var elem0 = document.getElementsByClassName('data-info d-flex item-tiling');
    elem0[0].parentNode.removeChild(elem0[0]);
    var elem2 = document.getElementsByClassName('aside-box common-nps-box');
    elem2[0].parentNode.removeChild(elem2[0]);
    var elem1 = document.getElementsByClassName('column-group');
    elem1[0].parentNode.removeChild(elem1[0]);
    //first-recommend-box recommend-box
    var elem3 = document.getElementsByClassName('recommend-box insert-baidu-box recommend-box-style ');
    elem3[0].parentNode.removeChild(elem3[0]);
    //recommend-nps-box common-nps-box
    var elem4 = document.getElementsByClassName('comment-box comment-box-new2  login-comment-box-new');
    elem4[0].parentNode.removeChild(elem4[0]);
    var elem5 = document.getElementsByClassName('recommend-nps-box common-nps-box');
    elem5[0].parentNode.removeChild(elem5[0]);
      var elem6 = document.getElementsByClassName('first-recommend-box recommend-box');
    elem6[0].parentNode.removeChild(elem6[0]);
})();