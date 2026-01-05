// ==UserScript==
// @name         MAM reskin
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  MAM menu fix
// @author       You
// @match        https://www.myanonamouse.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26087/MAM%20reskin.user.js
// @updateURL https://update.greasyfork.org/scripts/26087/MAM%20reskin.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let blocks = $('#mainLeft .lbc');
    let headers = blocks.map((i,e)=>$($(e).find('.blockHeadCon')[0]).text());
    const baseCSS='.toggleBody{cursor:pointer;}.bHis{display:none;} div.blockHeadCon a{display:inline;}#mainLeft .blockFoot{display:none;}#mainLeft div.blockHead {background-image:none;border-width: 0;background-color:inherit;}#mainLeft .lbc{margin:0px 10px;}#mainLeft{padding-top: 20px;}#mainLeft .blockBody{border:none;margin-bottom:20px;}#statsBlock a.cen{display:none;}#statsBlock{padding-left: 10px;}';
    function addStyle(str){
        $('#customStyle').text($('#customStyle').text()+str);
    }
    function topClickHandler(e){
        let dId = $(e.target).data('id');
        $($(blocks[parseInt(dId,10)]).find('.blockBody')[0]).toggle();
    }
    $('head').append('<style id="customStyle"></style>');
    addStyle(baseCSS);
    blocks.each((i,e)=>{
        $($(e).find('.blockHeadCon')[0]).prepend(`<span class="toggleBody" data-id=${i}>  [+]</span>`);
        if(i>0){
            $($(e).find('.blockBody')[0]).hide();
        }
    });
    $('body').on('click','.toggleBody',topClickHandler);
})();