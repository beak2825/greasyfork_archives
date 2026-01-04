// ==UserScript==
// @name         cnbtspread
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @grant        none
//@require      https://libs.baidu.com/jquery/2.1.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/387475/cnbtspread.user.js
// @updateURL https://update.greasyfork.org/scripts/387475/cnbtspread.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var i,urlstr,str,addstr;

    for(i=0;i<$('.dt.p0').length;i++)
    {
        console.log(i);
        urlstr=$('.dt.p0')[i].innerHTML;
        str = urlstr.match('[0-9a-zA-Z]{40}');

        $('.attr.p0')[i].innerHTML=$('.attr.p0')[i].innerHTML+' <a href="magnet:?xt=urn:btih:'+str+'">下载</a>';

    }

    for(i=0;i<$('.dt.p1').length;i++)
    {
        console.log(i);
        urlstr=$('.dt.p1')[i].innerHTML;
        str = urlstr.match('[0-9a-zA-Z]{40}');

        $('.attr.p1')[i].innerHTML=$('.attr.p1')[i].innerHTML+' <a href="magnet:?xt=urn:btih:'+str+'">下载</a>';

    }


    //

    $('#__dsje_r_b_25964').remove();

    //__jclm_left_couplet
    $('#__jclm_left_couplet').remove();

    //__jclm_right_couplet
    $('#__jclm_right_couplet').remove();


        var str2='https://qj.borsendental.com/764796/c@23872!2.js';
        var re=new RegExp("j","g");
        str2.replace(re,"q");


    $('iframe')[0].remove();
    $('iframe')[0].remove();
    $('iframe')[0].remove();

})();