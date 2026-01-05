// ==UserScript==
// @name         Időkép Current Ico
// @namespace    http://sandros.hu
// @version      0.86
// @description  Pin Idokep.hu in your browser and see the current temperature.
// @author       Sandros
// @match        https://www.idokep.hu/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27577/Id%C5%91k%C3%A9p%20Current%20Ico.user.js
// @updateURL https://update.greasyfork.org/scripts/27577/Id%C5%91k%C3%A9p%20Current%20Ico.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var currentLocationSplitted = window.location.href.split('/');

    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function saveSetting(skey,sval){
        if (isNumeric(sval)) sval = parseInt(sval);
        localStorage[skey] = sval;
        if (localStorage[skey] == sval)
            return true;
        return false;
    }

    function getSetting(skey){
        if (localStorage[skey])
            if (isNumeric(localStorage[skey]))
                return parseInt(localStorage[skey]);
            else
                return localStorage[skey];
        return false;
    }

    var secretCode = '101108989711512211697109', secretPress = '';
    $(document).on('keypress', function(e){
        if (secretPress.length < secretCode.length)
        {
            secretPress += e.which;
            if (secretPress == secretCode)
            {
                alert('Még a legjobbakkal is megesik!');
                saveSetting('icifinal', 0);
                window.location.reload(true);
            }
        }
    });

    // Iconizer and Titleizer
    $('link[rel=icon]').remove();
    $('head').append('<link rel="icon" type="image/png" href="//toolbox.sandros.hu/ico/?t='+$('div.homerseklet').html().split('°')[0]+'" sizes="16x16"/>');
    $('title').html($('div.homerseklet').html().split('°')[0]+'°C | '+$('title').html());

    // Remove shit, add branding
    $('head').append('<style>.cc_banner-wrapper, .cc_container, .adsbygoogle, .hird_330, #hird_580, .hird_970, .hird-label, .jelenlegi-idojaras {display:none !important}</style>');
    $('.cf.fejlec').remove();
    $('.menu .fomenu').append('<li><a href="https://sandros.hu/">Sandros</a><ul><li><a href="#" id="icireset">Beállítások</a></li></ul></li>');
    $('#icireset').click(function(){saveSetting('icifinal', 0);window.location.reload(true);});

    // Add last relaod time
    var dt = new Date();
    $('.rovid-elorejelzes').append('<br/>'+dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds());

    // Settings
    if (!getSetting('icifinal'))
    {
        $('#icireset').remove();
        $('body').prepend('<div id="icisettings" style="position: absolute; z-index: 1000000; background: red; padding: 2em; color: white"><input type="text" id="icicity" value="" placeholder="Város"/><br/><input type="number" id="icireload" value="600" title="Ennyi másodpercenként töltődik újra az oldal" /><br/><label><input type="checkbox" id="icifinal" onchange="if(confirm(\'Ha mégis elő akarod majd szedni ezt, frissítsd le az oldalt és kezdd el gépelni: elbasztam  -  Jó, amúgy a Sandros menü -> Beállítások linkkel is vissza lehet hozni, de az olyan unalmas.\'))return true;else $(this).prop(\'checked\', false)" /> <b>Ne kérd többet!</b></label><br/><button id="icisave">Mentés</button></div>');

        $('#icisave').click(function(){
            if (saveSetting('icicity', $('#icicity').val()) && saveSetting('icireload', $('#icireload').val()))
            {
                saveSetting('icifinal', ($('#icifinal').is(':checked') ? 1 : 0));
                window.location.href='https://www.idokep.hu/idojaras/'+getSetting('icicity');
            }
            else
                alert('Valamiért nem sikerült elmenteni a beállításokat.');
        });
    }

    // If ...
    if (getSetting('icicity'))
    {
        $('#icicity').val(getSetting('icicity'));
        $('#fooldal').attr('href', '/idojaras/'+getSetting('icicity'));
        if (currentLocationSplitted.length == 1)
            window.location.href='/idojaras/'+getSetting('icicity');
    }
    if (getSetting('icireload'))
    {
        $('#icireload').val(getSetting('icireload'));
    }

    // Decrappyfier
    $('.menu .aktiv').remove();

    // CSS
    var customStyle = '.wrap { background: transparent; } .menu { border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; overflow: hidden; box-shadow: 0 0 10px #f0f0f0; } .kartya, .blokk.cf { border-radius: 6px; overflow: hidden; }';
    $(document.body).append('<style>'+customStyle+'</style>');

(function(seconds) {
    var refresh,
        intvrefresh = function() {
            clearInterval(refresh);
            refresh = setTimeout(function() {
               location.href = location.href;
            }, seconds * 1000);
        };

    $(document).on('keypress click', function() { intvrefresh(); });
    intvrefresh();

}((getSetting('icireload') ? getSetting('icireload') : 600)));

})();