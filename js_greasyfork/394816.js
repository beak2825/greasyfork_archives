// ==UserScript==
// @name         CSGO交易平台卖家查询
// @namespace    http://www.lupohan.com/
// @version      1.1
// @description  Igxe C5game自售卖家查询
// @author       lupohan44
// @match        *://www.igxe.cn/product-*
// @match        *://www.c5game.com/csgo/**
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/394816/CSGO%E4%BA%A4%E6%98%93%E5%B9%B3%E5%8F%B0%E5%8D%96%E5%AE%B6%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/394816/CSGO%E4%BA%A4%E6%98%93%E5%B9%B3%E5%8F%B0%E5%8D%96%E5%AE%B6%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

(function() {
    $(document).ready(function(){
        start();
    });
})();
var timeoutId;
var done=false;
function start(){
    if(window.location.href.indexOf("c5game") != -1){
        //c5
        timeoutId = setInterval(function(){
            c5game();
        } ,2000);
    }else{
        //IGXE
        timeoutId = setInterval(function(){
            igxe();
        } ,200);
    }
}
function igxe(){
    var inspecturl = $('#center > div:nth-child(10) > div > div > div.mod-equipmentDetail-hd > div > div.opera-box > a:nth-child(1)').attr('href');
    if(inspecturl.indexOf(' ') > 0){
        inspecturl = encodeURI(inspecturl);
    }
    var needle = 'csgo_econ_action_preview%20';
    inspecturl = inspecturl.substring(inspecturl.indexOf(needle)+needle.length);
    var splitArr = inspecturl.split('A');
    var stid = splitArr[0].replace('S','');
    console.log(stid);
    $('#center > div:nth-child(10) > div > div > div.mod-equipmentDetail-hd > div > div.opera-box').append('<a href="https://steamcommunity.com/profiles/'+ stid + '" target="_blank" one-link-mark="yes" style="width:40px">卖家</a>');
    clearTimeout(timeoutId);
}
function c5game(){
    /*
    $('#J_SellTpl > tr.j_SaleItem').each(function(){
        var inspecturl = $(this).find('td:nth-child(1) > div:nth-child(2) > a').attr('href');
        if(inspecturl.indexOf(' ') > 0){
            inspecturl = encodeURI(inspecturl);
        }
        var needle = 'csgo_econ_action_preview%20';
        inspecturl = inspecturl.substring(inspecturl.indexOf(needle)+needle.length);
        var splitArr = inspecturl.split('A');
        var stid = splitArr[0].replace('S','');
        //console.log(stid);
        $(this).find('td:nth-child(1) > div:nth-child(2)').append('<a style="cursor: pointer" class="media-middle ft-inter ft-12 mr-5" target="_blank" href="https://steamcommunity.com/profiles/'+ stid + '">卖家</a>');
        done=true;
    })
    if(done){
        clearTimeout(timeoutId);
    }
    */
    clearTimeout(timeoutId);
    //Cannot be used now
}