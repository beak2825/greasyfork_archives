// ==UserScript==
// @name         crx4chrome
// @namespace    http://tampermonkey.net/
// @version      2025.4.4
// @description  修改版本历史页面
// @author       AN drew
// @match        https://www.crx4chrome.com/history/*
// @match        https://www.crx4chrome.com/crx/*
// @require      https://lib.baomitu.com/jquery/3.5.0/jquery.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/532946/crx4chrome.user.js
// @updateURL https://update.greasyfork.org/scripts/532946/crx4chrome.meta.js
// ==/UserScript==

function getUTC8(datetime) {
    let month = (datetime.getMonth() + 1) < 10 ? "0" + (datetime.getMonth() + 1) : (datetime.getMonth() + 1);
    let date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    return (datetime.getFullYear() + "-" + month + "-" + date);
}


(function() {
    'use strict';

    let hide_marker=1;

    if(hide_marker===1)
    {
        GM_addStyle(`ol.history{list-style:none}`);
    }

    $('.history li').each(function(index){
        if(hide_marker===1)
        {
            $(this).find('span').replaceWith(function() {
                if(index==0)
                    return $('<div>', {'class':'title', 'style':'background:#ff00004f'}).prepend('<strong>'+index+'.<strong>\xa0\xa0').append($(this).contents());
                else
                    return $('<div>', {'class':'title'}).prepend('<strong>'+index+'.<strong>\xa0\xa0').append($(this).contents());
            });
        }
        else
        {
            $(this).find('span').replaceWith(function() {
                if(index==0)
                    return $('<div>', {'class':'title', 'style':'background:#ff00004f'}).append($(this).contents());
                else
                    return $('<div>', {'class':'title'}).append($(this).contents());
            });
        }

        let $Date=$(this).find('.app-desc').eq(0);
        let date_text=$Date.text();
        if(date_text!=undefined)
        {
            date_text=date_text.replace('► Updated: ','');
            let DATE=new Date(date_text);
            let date=getUTC8(DATE);
            $Date.text('► 更新时间: '+date);
        }

        let $Version=$(this).find('.app-desc').eq(1);
        let version_text=$Version.text();
        if(version_text!=undefined && version_text.indexOf('up')>-1)
        {
            version_text=version_text.match(/► Require: Chrome (\S*) an up/)[1];
            $Version.text('► 版本要求: Chrome ≥ '+version_text);
        }
    })

    if($('.app-title').eq(-1).text().indexOf('More Extensions')>-1)
    {
        $('.app-title').eq(-1).hide();
        $('.app-title').eq(-1).next().hide();
    }

    GM_addStyle(`
    div.title {background: #0084ff4f; padding: 2px 6px;}
    #sidebar{display:none}
    `);

    $('blockquote').eq(0).hide();
    $('blockquote').eq(2).hide();
    $('blockquote').eq(3).hide();

})();