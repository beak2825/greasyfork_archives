// ==UserScript==
// @name        e-hentai.org & exhentai.org uconfig
// @namespace   pikashi@gmail.com
// @description e-hentai.org & g.exhentai.org uconfig settings
// @include     https://exhentai.org/*
// @include     https://e-hentai.org/*
// run-at       document-end
// @version     1.1
// @grant       GM_setValue
// @grant       GM_getValue
// @icon        https://exhentai.org/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/29135/e-hentaiorg%20%20exhentaiorg%20uconfig.user.js
// @updateURL https://update.greasyfork.org/scripts/29135/e-hentaiorg%20%20exhentaiorg%20uconfig.meta.js
// ==/UserScript==

GM_setValue('uconfig','uh_n-lt_p-tl_j-oi_b6edde-qb_2588f7-tr_20-ts_l-tf_eb55f1-dm_t-xl_1x20x1044x2068x30x1054x2078x40x1064x2088x50x1074x2098x60x1084x2108x70x80x1104x2128x90x1114x2138x100x1124x2148x110x1134x2158x120x1144x2168x130x1154x2178-rc_1-pn_1');

function setCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else{
        var expires = "";
    }
    document.cookie = name+"="+value+expires+"; path=/;domain="+'.'+window.location.hostname;
}

function getCookie(c_name)
{
    if (document.cookie.length>0)
    {
        c_start=document.cookie.indexOf(c_name + "=");
        if (c_start!=-1)
        {
            c_start=c_start + c_name.length+1;
            c_end=document.cookie.indexOf(";",c_start);
            if (c_end==-1) c_end=document.cookie.length;
            return unescape(document.cookie.substring(c_start,c_end));
        }
    }
    return "";
}
if (getCookie('uconfig').length < 15)
    setCookie('uconfig',GM_getValue('uconfig'),365);

if(document.querySelector('#outer.stuffbox'))
    document.querySelector('#outer.stuffbox>h1').innerHTML = 'Settings <span style="color:red;">(设置已通过cookies修改，请勿在此页操作！)<span>';

//alert(GM_getValue('uconfig'));