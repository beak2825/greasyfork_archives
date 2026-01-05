// ==UserScript==
// @name         AcTools Content Manager Helper
// @namespace    x4fab_acmanager_acclub
// @version      0.3.1
// @description  Adds buttons which allow to install new content faster
// @author       x4fab
// @icon         http://i.imgur.com/OZO6Cn0.png
// @match        http://assettocorsa.club/mods/auto/*
// @match        http://assettocorsa.club/mods/tracks/*
// @match        http://www.racedepartment.com/downloads/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18779/AcTools%20Content%20Manager%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/18779/AcTools%20Content%20Manager%20Helper.meta.js
// ==/UserScript==

if (/(?:www\.)?assettocorsa\.club/.test(location.host)){
    $('.spec > div').css('width', '60%');
    $('.spec > div:last-child').css('width', '40%');
    $('.__cmspecial').remove(); $('p.download a').clone().text('INSTALL').css({
        color: '#64a670',
        padding: '0 0 6px 40px',
        lineHeight: '33px',
        margin: '2px 0 2px 12px',
        background: 'url(http://i.imgur.com/OZO6Cn0.png) no-repeat left center',
        backgroundSize: 'contain',
        display: 'inline-block'
    }).addClass('__cmspecial').each(function(){ this.href = 'acmanager:install/' + btoa(this.href) + '?name=a.rar' }).removeAttr('target').insertAfter($('p.download a'));
} else if (/(?:www\.)?racedepartment\.com/.test(location.host)){
    $('.__cmspecial').remove(); $('#resourceInfo .downloadButton').parent().clone().addClass('__cmspecial').insertAfter($('#resourceInfo .downloadButton').parent()).css({ marginTop: '15px' }).find('a')
.html('Install Using Content Manager' + $('#resourceInfo .downloadButton .minorText')[0].outerHTML).css({ filter: 'hue-rotate(-30deg)', WebkitFilter: 'hue-rotate(-30deg)' }).attr('href', 'acmanager:install/' + btoa(location.href) + '?name=a.rar');
} else if (/(?:www\.)?assetto-db\.com/.test(location.host)){
    $('.__cmspecial').remove(); $('.carDetails a[href^="/"][href$="/download"]').clone().addClass('__cmspecial').insertAfter('.carDetails a[href^="/"][href$="/download"]')
.html('Install Using Content Manager').removeAttr('target').css({ filter: 'hue-rotate(-120deg)', WebkitFilter: 'hue-rotate(-120deg)' }).attr('href', 'acmanager:install/' + btoa(location.href) + '?name=a.rar');
}