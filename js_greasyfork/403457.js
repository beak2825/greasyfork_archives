// ==UserScript==
// @name         PPT Viewer for ClassIn
// @namespace    http://tampermonkey.net/
// @version      0.0.5
// @description  To view the teacher's ppt when in class, for EEO (ClassIn)
// @author       4e1a607a
// @match        https://*.eeo.cn/upload/trans/ppt*/html5/index.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403457/PPT%20Viewer%20for%20ClassIn.user.js
// @updateURL https://update.greasyfork.org/scripts/403457/PPT%20Viewer%20for%20ClassIn.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('html').html(`<head><meta charset="utf-8"></head><body><button id="show-all" style="left: 1000px;">Show All</button><button id="normal" style="left: 1100px;">Normal</button><button id="cfont" style="left: 1000px; top: 50px;">Disable Font</button></body>`).css("overflow", "auto");
    $('button').css('position', 'absolute');
    //Fonts
    var style = `<style id='font'>`;
    for (var i=0; i<50; i++) {
        style += `@font-face{font-family:'fnt${i}';src:url('data/fnt${i}.ttf'),url('data/fnt${i}.woff')format('woff');}\n`;
    }
    style += `</style>`;
    $('head').append(style);
    function printpage(page) {
        $('body').append(`<div id='p${page}'></div>`)
        $.ajax({
            type: "GET",
            url: `data/slide${page}.css`,
            success: function(data){
                $('head').append(`<style>${data}</style>`);
            },
        });
        $.ajax({
            type: "GET",
            url: `data/slide${page}.js`,
            success: function(data){
                var s = data.substr(data.match('<div').index);
                s = s.substr(0, s.length-8);
                $(`#p${page}`).html(s).css('position', 'absolute').css('top', 600*page-600);
                $(`#p${page} div, span, img, svg, path`).css('position', 'absolute');
                printpage(page+1);
            },
        });
    };
    printpage(1);
    $('#show-all').on('click', function(){
        $('div').css('display', 'block');
    });
    $('#normal').on('click', function(){
        $('div').css('display', '');
    });
    $('#cfont').on('click', function(){
        $('#font').remove();
    });
})();