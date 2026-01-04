// ==UserScript==
// @name         视觉中国缩略图
// @namespace    http://xiaoriri.com/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.vcg.com/creative/*
// @grant        none
// @require      http://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @require      https://cdn.bootcss.com/sweetalert/2.1.2/sweetalert.min.js
// @downloadURL https://update.greasyfork.org/scripts/398014/%E8%A7%86%E8%A7%89%E4%B8%AD%E5%9B%BD%E7%BC%A9%E7%95%A5%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/398014/%E8%A7%86%E8%A7%89%E4%B8%AD%E5%9B%BD%E7%BC%A9%E7%95%A5%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let res_id = __PRELOADED_STATE__.imageDetail.data.picInfo.res_id;
    let uid = /https:\/\/www.vcg.com\/creative\/(\d+)/.exec( window.location.href)[1];
    $(".detailDtit").siblings().last().append(`<button tabindex="0" id="down_1" class="jss128 jss113 jss29 jss64" type="button"><span class="jss114">无水印下载</span><span class="jss131"></span></button>`)
    $('#down_1').click(function(){
        $.get('https://www.vcg.com/api/image/detail/similarImages?similar_id='+uid,ret=>{
          open(ret.list[0].url800)
        })

    })



})();