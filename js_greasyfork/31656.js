// ==UserScript==
// @name         Narou Index scroller
// @namespace    http://ncode.syosetu.com/
// @version      0.7.3
// @description  小説家になろうの目次で前後の章に移動するアイコンとナビをつける
// @author       b2ox
// @match        *://ncode.syosetu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31656/Narou%20Index%20scroller.user.js
// @updateURL https://update.greasyfork.org/scripts/31656/Narou%20Index%20scroller.meta.js
// ==/UserScript==

{
    const chapters = $('div.index_box > div.chapter_title')
    const lst = $('<ul>')
    const n = chapters.length
    chapters.each((i,elm) => {
        const nav = $('<span>')
        const _up = $('<span>').text('⇧').attr('title','前章へ移動').css('cursor','pointer').click(() => {$('#ct'+(i-1))[0].scrollIntoView();window.scrollBy(0,-20);})
        const _down = $('<span>').text('⇩').attr('title','次章へ移動').css('cursor','pointer').click(() => {$('#ct'+(i+1))[0].scrollIntoView();window.scrollBy(0,-20);})
        lst.append($('<li>').text($(elm).text()).css('margin','1ex').css('cursor','pointer').click(() => {$('#ct'+i)[0].scrollIntoView();window.scrollBy(0,-20);}))
        if (i>0) nav.append(_up)
        if (i<n-1) nav.append(_down)
        $(elm).attr('id','ct'+i).prepend(nav)
    })
    if (n > 0) {
        const nhead = $('#novel_header');
        const style = window.getComputedStyle(nhead[0]);
        const lsize = parseFloat(style.lineHeight == 'normal' ? style.fontSize : style.lineHeight);
        const h = Math.min(lsize * (n + 3), $(window).height() * 0.6);
        const chNavi = $('<div id="chapter_navi"/>').css('margin','1em').css('border','solid 2px black').css('width','max-content').css('height',`${h}px`).css('overflow','scroll');
        chNavi.append(lst)
        nhead.append(chNavi)
    }
}
