// ==UserScript==
// @name         FBG Popout Chat
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add Popout Button To Facebook Gaming Chat
// @author       Mattigins
// @match        https://www.facebook.com/*
// @match        http://www.facebook.com/*
// @match        https://facebook.com/*
// @match        http://facebook.com/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431415/FBG%20Popout%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/431415/FBG%20Popout%20Chat.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

window.addEventListener('load', function() {
    var $ = window.jQuery;
    console.log("Attempting To Inject Popout Chat");
    if (window.location.search == "?chatOnly"){

        //I forgot to comment all this so consider it "magic"
        $('div.j83agx80.cbu4d94t.buofh1pr.nnvw5wor.gs1a9yip.taijpn5t,div.cwj9ozl2.ni9yibek.hv4rvrfc.dati1w0a.discj3wi,div.rq0escxv.l9j0dhe7.du4w35l.bj83agx80.cbu4d94t.bkfpd7mw').hide();
        $('div[role=banner]').hide();
        $('div.hybvsw6c.j83agx80.n7fi1qx3.cbu4d94t.pad24vr5.poy2od1o.iyyx5f41.ap132fyt.pphwfc2g.be9z9djy,div.q5bimw55.rpm2j7zs.k7i0oixp.gvuykj2m.j83agx80.cbu4d94t.ni8dbmo4.eg9m0zos.l9j0dhe7.du4w35lb.ofs802cu.pohlnb88.dkue75c7.mb9wzai9.d8ncny3e.buofh1pr.g5gj957u.tgvbjcpo.l56l04vs.r57mb794.kh7kg01d.c3g1iek1.k4xni2cv.o36gj0jk').attr("style", 'width:100%;min-height:100vh;top:0px;');
        $('div.j83agx80.cbu4d94t.bkyfam09.ni8dbmo4.stjgntxs').attr("style", 'height:100vh;');
        $('div.cwj9ozl2.r28pvxcy.j83agx80.n7fi1qx3.datstx6m.poy2od1o.be9z9djy.etr7akla,div.poy2od1o.i09qtzwb.n7fi1qx3').hide();
        $('head').append('<style type="text/css">div.poy2od1o.i09qtzwb.n7fi1qx3{display:none;}</style>');

    }else{

        //Inject popout button
        $('div.kb5gq1qc.pfnyh3mw.hpfvmrgz.qdtcsgvi.oi9244e8.t7l9tvuc:first').clone().attr("id", "PopOut").prependTo('div.j83agx80.btwxx1t3.buofh1pr.l9j0dhe7:first');
        $('div.kb5gq1qc.pfnyh3mw.hpfvmrgz.qdtcsgvi.oi9244e8.t7l9tvuc:first').find('span').text('Popout Chat').click(function(){
            window.open(window.location + '?chatOnly');
        });

    }
});
