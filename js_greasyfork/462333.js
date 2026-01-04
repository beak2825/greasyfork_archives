// ==UserScript==
// @name         ykm_wxwz
// @namespace    csdn
// @version      0.1
// @description  去除cs dn 不喜欢的模块
// @author       ykm
// @match        https://mp.weixin.qq.com/s/*
// @match        https://mp.weixin.qq.com/*
// @grant        GM_addStyle
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/462333/ykm_wxwz.user.js
// @updateURL https://update.greasyfork.org/scripts/462333/ykm_wxwz.meta.js
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
    .qr_code_pc{
        display:none;
    }
    .wx_profile_card_inner{
        display:none;
    }
    .template-box{
        display:none;
    }
    #js_tags{
        display:none;
    }
    .wx_profile_card_inner{
        display:none;
    }
     .aside-box-footer{
        display:none;
    }
      .wx_profile_card_bd{
        display:none;
    }
     #recommendNps{
        display:none;
    }
    ` )
    var elem0 = document.getElementsByClassName('rich_media_meta_list');
    elem0[0].parentNode.removeChild(elem0[0]);
    var elem1 = document.getElementsByClassName('wx_profile_card_inner');
    elem1[0].parentNode.removeChild(elem1[0]);
    var elem2 = document.getElementsByClassName('wx_profile_card_bd');
    elem2[0].parentNode.removeChild(elem2[0]);

})();