// ==UserScript==
// @name         muahahaha cal.syoboi.jp
// @namespace    muahahaha
// @version      0.2
// @description  pasar a español algunas cosas
// @match        http*://cal.syoboi.jp/tid/*/time
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398468/muahahaha%20calsyoboijp.user.js
// @updateURL https://update.greasyfork.org/scripts/398468/muahahaha%20calsyoboijp.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let nose=[
        {
            selector:'#ProgList tr td.flag div.EPGMark[title="新番組"]',
            agregar_clase:'muahaha_nuevo',
            nuevo_attr_title:'新番組 / Nuevo programa',
        },
        {
            selector:'#ProgList tr td.flag div.EPGMark[title="先週無かったか、時間が違う"]',
            agregar_clase:'muahaha_nosemant_errtie',
            nuevo_attr_title:'先週無かったか、時間が違う / No semana anterior, tiempo incorrecto',
        },
        {
            selector:'#ProgList tr td.flag div.EPGMark[title="注意"]',
            agregar_clase:'muahaha_nota',
            nuevo_attr_title:'注意 / Nota',
        },
        {
            selector:'#ProgList tr td.flag div.EPGMark[title="再放送"]',
            agregar_clase:'muahaha_reair',
            nuevo_attr_title:'再放送 / Retransmisión',
        },
        {
            selector:'#ProgList tr.past td',
            css_extra:{
                background:'#bbb',
            },
        },
    ];

    $.each(nose,function($i,$e){
        let e=$($e.selector);
        if($e.agregar_clase)
            e.addClass($e.agregar_clase);
        if($e.nuevo_attr_title)
            e.attr('title',$e.nuevo_attr_title);
        if($e.css_extra)
            e.css($e.css_extra);
    });

})();