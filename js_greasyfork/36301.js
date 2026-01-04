// ==UserScript==
// @name         拉勾职位隐藏
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  隐藏不想看到的职位。
// @author       chroming
// @match        https://www.lagou.com/jobs/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_notification
// @require      http://code.jquery.com/jquery-1.11.0.min.js

// @downloadURL https://update.greasyfork.org/scripts/36301/%E6%8B%89%E5%8B%BE%E8%81%8C%E4%BD%8D%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/36301/%E6%8B%89%E5%8B%BE%E8%81%8C%E4%BD%8D%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

var position_list = JSON.parse(GM_getValue('lagou_hide_pl')||'[]');
var company_list = JSON.parse(GM_getValue('lagou_hide_cl')||'[]');

append_list = function(id, tag){
    if (tag){
        position_list.push(id.toString());
        GM_setValue('lagou_hide_pl', JSON.stringify(position_list));
        GM_notification(text='职位已隐藏', timeout='1');

    }
    else {
        company_list.push(id.toString());
        GM_setValue('lagou_hide_cl', JSON.stringify(company_list));
        GM_notification('公司已隐藏', '1');
    }
    window.location.reload();
};

var main = function(){
    $('.con_list_item').each(function(){
        var item = $(this);
        var p = item.attr('data-positionid');
        var c = item.attr('data-companyid');
        if (position_list.includes(p)||company_list.includes(c)){
            item.hide();
            console.log('hide:'+c);
        }
        else{
            if (item.find('.p_top .hide_button').length === 0) {
                item.find('.p_top').append('<button class="hide_button" type="button" onclick="append_list('+p+', true)">隐藏职位</button>');
                item.find('.company_name').append('<button type="button" onclick="append_list('+c+', false)">隐藏公司</button>');
        }}
    });
};
$('.pager_container [hidefocus]').each($(this).click(
    function(){
        setTimeout(main, 1000);
    }

));
$(main);
