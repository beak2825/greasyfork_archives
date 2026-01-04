// ==UserScript==
// @name         ykm_csdn
// @namespace    csdn
// @version      0.3
// @description  去除csdn 不喜欢的模块
// @author       ykm
// @match        https://blog.csdn.net/*/article/details/*
// @grant        GM_addStyle
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/451159/ykm_csdn.user.js
// @updateURL https://update.greasyfork.org/scripts/451159/ykm_csdn.meta.js
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
    ` )
    var elem0 = document.getElementsByClassName('data-info d-flex item-tiling');
    elem0[0].parentNode.removeChild(elem0[0]);
    var elem2 = document.getElementsByClassName('aside-box common-nps-box');
    elem2[0].parentNode.removeChild(elem2[0]);

})();