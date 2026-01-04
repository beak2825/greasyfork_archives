// ==UserScript==
// @name         pt-auto-say-thanks
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  say thanks to every pt torrent~,下面match是当前支持站点列表,如果有其他站需要的话,欢迎给药我来匹配
// @author       wget
// @match        *://pt.m-team.cc/details.php*
// @match        *://pt.btschool.club/details.php*
// @match        *://www.haidan.video/details.php*
// @match        *://www.hddolby.com/details.php*
// @match        *://www.hdarea.co/details.php*
// @match        *://hdatmos.club/details.php*
// @match        *://hdhome.org/details.php*
// @match        *://hdsky.me/details.php*
// @match        *://hdtime.org/details.php*
// @match        *://lemonhd.org/details*
// @match        *://pt.soulvoice.club/details.php*
// @match        *://avgv.cc/details.php*
// @match        *://ptsbao.club/details.php*
// @match        *://www.beitai.pt/details.php*
// @match        *://et8.org/details.php*
// @match        *://pt.eastgame.org/details.php*
// @match        *://pthome.net/details.php*
// @match        *://pterclub.com/details.php*
// @match        *://ourbits.club/details.php*
// @match        *://hdzone.me/details.php*
// @match        *://pt.msg.vg/details.php*
// @match        *://hdfans.org/details.php*
// @match        *://www.tjupt.org/details.php*
// @match        *://yingk.com/details.php*
// @match        *://www.dragonhd.xyz/details.php*
// @match        *://chdbits.co/details.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411037/pt-auto-say-thanks.user.js
// @updateURL https://update.greasyfork.org/scripts/411037/pt-auto-say-thanks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var wait = ms => new Promise(resolve => setTimeout(resolve, ms))

    if(location.href.indexOf('pt.m-team.cc')>=0){
        if($('saythanks')&&!$('saythanks').disabled){
            console.log('auto click thanks way 1~~~');
            $('saythanks').click();
        }
    }else if(location.href.indexOf('pt.btschool.club')>=0
             ||location.href.indexOf('www.hddolby.com')>=0
             ||location.href.indexOf('hdatmos.club')>=0
             ||location.href.indexOf('hdhome.org')>=0
             ||location.href.indexOf('hdsky.me')>=0
             ||location.href.indexOf('lemonhd.org')>=0
             ||location.href.indexOf('pt.soulvoice.club')>=0
             ||location.href.indexOf('www.beitai.pt')>=0
             ||location.href.indexOf('et8.org')>=0
             ||location.href.indexOf('pt.eastgame.org')>=0
             ||location.href.indexOf('pthome.net')>=0
             ||location.href.indexOf('pterclub.com')>=0
             ||location.href.indexOf('hdzone.me')>=0
             ||location.href.indexOf('pt.msg.vg')>=0
             ||location.href.indexOf('hdfans.org')>=0
             ||location.href.indexOf('www.dragonhd.xyz')>=0
            ){
        wait(5000).then(() => {
            if($('saythanks')&&!$('saythanks').disabled){
                console.log('auto click thanks way 2~~~');
                $('saythanks').click();
            }
        });
    }else if(location.href.indexOf('www.hdarea.co')>=0
             ||location.href.indexOf('hdtime.org')>=0
             ||location.href.indexOf('avgv.cc')>=0
             ||location.href.indexOf('ptsbao.club')>=0
             ||location.href.indexOf('ourbits.club')>=0

            ){
        wait(5000).then(() => {
            if($('saythanks')&&!$('saythanks').disabled){
                console.log('auto click thanks way 3~~~');
                $('#saythanks').click();
            }
        });
    }else if(location.href.indexOf('www.haidan.video')>=0){
        if($('a[id*="saythanks"]')&&!$('a[id*="saythanks"]').attr('style')){
            wait(2000).then(() => {
                console.log('auto click thanks way 4~~~');
                $('a[id*="saythanks"]').click();
            });
        }
    }else if(location.href.indexOf('www.tjupt.org')>=0
             ||location.href.indexOf('yingk.com')>=0
             ||location.href.indexOf('chdbits.co')>=0
            ){
        wait(5000).then(() => {
            if($('saythanks')&&!$('saythanks').disabled&&!$('#saythanks').prop('disabled')){
                console.log('auto click thanks way 5~~~');
                $('#saythanks').click();
            }
        });
    }
})();



